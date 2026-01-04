// ==UserScript==
// @name         Torn - Poker Mug
// @namespace    http://tampermonkey.net/
// @version      3.2.6
// @description  Torn - Poker Mug helper
// @author       Flav
// @match        https://www.torn.com/page.php?sid=holdem*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_notification
// @grant       window.focus
// @downloadURL https://update.greasyfork.org/scripts/494853/Torn%20-%20Poker%20Mug.user.js
// @updateURL https://update.greasyfork.org/scripts/494853/Torn%20-%20Poker%20Mug.meta.js
// ==/UserScript==
(function (unsafeWindow, $) {
    'use strict';

    let API_KEY = GM_getValue("API_KEY", "");
    let MAX_BS = parseInt(GM_getValue("PK_MAX_BS", 0));
    let MIN_MUG_AMOUNT = parseInt(GM_getValue("PK_MIN_MUG_AMOUNT", 0));
    let isFirstLoad = true;
    const preloadedTabs = new Map();
    const ignoredPlayers = new Set();

    const BSP_KEY = 'tdup.battleStatsPredictor.cache.prediction.';
    const inputStyle = "width:95%;border: 1px solid #ccc;border-color: var(--input-money-border-color); padding: 9px 5px; border-radius: 5px; line-height: 14px;margin-top:5px;margin-bottom:5px;";
    const buttonStyle = `font-family: fjalla one,Arial,serif;
            font-size: 14px;
            font-weight: 400;
            text-align: center;
            text-transform: uppercase;
            border-radius: 5px;
            display:inline-block;
            padding: 0 10px;
            cursor: pointer;
            color: #555;
            color: var(--btn-color);
            text-shadow: 0 1px 0 #ffffff40;
            text-shadow: var(--btn-text-shadow);
            background: linear-gradient(180deg,#DEDEDE 0%,#F7F7F7 25%,#CFCFCF 60%,#E7E7E7 78%,#D9D9D9 100%);
            background: var(--btn-background);
            border: 1px solid #aaa;
            border: var(--btn-border);
            vertical-align: middle;
            height: 34px;
            line-height: 34px;`;

    const idList = new Map();

    let observer = null;

    const initDisplay = function () {

        $("#player-table").children().remove();
        idList.clear();
        $("#rr-no-players").show();

        if (isFirstLoad) {

            const displayStyles = `
        #rr-display-dialog {
            z-index: 99998;
              height: auto;
            background-color: var(--tooltip-bg-color);
            border: var(--mini-profile-border);
            border-radius: 5px;
            position: fixed;
            left: 400px;
            top: 80px;
            transform: translate(-50%, 0);
            visibility: visible;
            opacity: 1;
            transition: opacity 250ms ease-in, visibility 0ms ease-in 0ms;
            max-height: calc(100vh - 15%);
            overflow-y: auto;
            overflow-x: hidden;
            padding:10px;
            width:700px;
        }
        #rr-display-dialog  h2{
            margin-top: 0px;
            margin-bottom: 10px;
        }

        #player-table tr td{
            color: rgb(221, 221, 221);
        }


        #player-table tr td a{
            color: var(--default-blue-color);
        }

        #player-table button:focus {
            outline: 2px solid #00ccff !important;
            box-shadow: 0 0 6px #00ccff;
            background-color: #222 !important;
            color: #00ccff !important;
            }

        `;

            // Create a <style> element and append it to the <head>
            const displayStylesElement = document.createElement('style');
            displayStylesElement.textContent = displayStyles;
            document.head.appendChild(displayStylesElement);

            const dialogHtml = `<div id="rr-display-dialog">
                <h2>Mugzz!</h2>
                <p id="rr-no-players" style="line-height:34px;">No players being tracked.</p>
                <table id="player-table">
                </table>
                 <div style="margin-top:15px;">
                    <input type="button" id="show-settings" value="Settings" style="${buttonStyle}" />
                </div>
            </div>`;

            // Finding the main content container
            $('body').append(dialogHtml);

            $('#show-settings').on('click', function (e) {
                const dialog = document.getElementById("capture-dialog");
                dialog.showModal();
            });
        }

        $('#rr-display-dialog').show();
    }

    function formatCompactNumber(number) {
        if (number < 1000) {
            return number;
        } else if (number >= 1000 && number < 1_000_000) {
            return (number / 1000).toFixed(1) + "K";
        } else if (number >= 1_000_000 && number < 1_000_000_000) {
            return (number / 1_000_000).toFixed(1) + "M";
        } else if (number >= 1_000_000_000 && number < 1_000_000_000_000) {
            return (number / 1_000_000_000).toFixed(1) + "B";
        } else if (number >= 1_000_000_000_000 && number < 1_000_000_000_000_000_000_000) {
            return (number / 1_000_000_000_000).toFixed(1) + "T";
        }
    }

    const init = new Promise((resolve, reject) => {

        const dialogHtml = `<dialog id="capture-dialog">
                <form method="post" id="captureform" action="" style="padding:10px;">
                <h2>Poker Mug Settings</h2>
                <p>
                    <label>
                    API Key:
                    </label>
                    <br />
                    <input type="text" required id="rr-api-key" value="${API_KEY}" name="rrApiKey" style="${inputStyle}" />

                </p>
                <p>
                    <label>
                    Max Battle Stats:
                    </label>
                    <br />
                    <input type="number" required id="rr-max-bs" min="1000" value="${MAX_BS}" name="rrMaxBs" style="${inputStyle}" />

                </p>
                <p>
                    <label>
                    Min Mug Amount:
                    </label>
                    <br />
                    <input type="number" required id="rr-min-mug-amount" min="1000" value="${MIN_MUG_AMOUNT}" name="rrMinMugAmount" style="${inputStyle}" />

                </p>
                <div style="margin-top:15px;">
                    <input type="submit" id="save-settings" value="Save" style="${buttonStyle}" />
                </div>
                </form>
            </dialog>`;

        // Finding the main content container
        const contentWrapper = $('.content-wrapper[role="main"]');
        if (contentWrapper.length !== 0) {
            contentWrapper.append(dialogHtml); // Append the box to the end of the container
        } else {
            // If for some reason the main container isn't found, the box will be added to the body
            document.body.appendChild(dialogHtml);
        }

        $('#captureform').on('submit', function (e) {

            e.preventDefault();

            let formData = new FormData(document.forms.captureform);

            API_KEY = formData.get("rrApiKey");
            MAX_BS = formData.get("rrMaxBs");
            MIN_MUG_AMOUNT = formData.get("rrMinMugAmount");

            if (API_KEY !== "" && MAX_BS !== "") {

                GM_setValue("API_KEY", API_KEY);
                //GM_setValue("PK_BET_AMOUNT", BET_AMOUNT);
                GM_setValue("PK_MAX_BS", MAX_BS);
                GM_setValue("PK_MIN_MUG_AMOUNT", MIN_MUG_AMOUNT);

                const dialog = document.getElementById("capture-dialog");
                dialog.close();

                if (isFirstLoad)
                    resolve();
                else {
                    initDisplay();
                    start();
                }

            }
        });

        if (API_KEY === "" || MAX_BS === 0 || MIN_MUG_AMOUNT === 0) {

            //BET_AMOUNT === 0 ? BET_AMOUNT = 1 : BET_AMOUNT;
            MAX_BS === 0 ? MAX_BS = 1000 : MAX_BS;



            const dialog = document.getElementById("capture-dialog");
            dialog.showModal();
        }
        else {
            resolve();
        }
    });

    function getPlayerBS(userId, userData, betAmount) {
        const bspStats = window.localStorage.getItem(BSP_KEY + userId);
        if (bspStats) {

            const userBs = JSON.parse(bspStats).TBS;

            if (userBs > 0 && userBs <= MAX_BS) {
                setUser(userId, userBs, userData.name, userData.healthStatus, betAmount, userData.faction);
            }
            else {
                unSetUser(userId);
            }
        }
        else {
            fetchBspData(userId, userData.name, userData.healthStatus, betAmount, userData.faction);
        }
    }

    function getPlayerDetails(playerElement) {

        const firstChild = $(playerElement).children()[0];

        const userId = $(firstChild).attr("id").split("-")[1];
        let betAmount = $(playerElement).find('div[class*=potString___]').html();
        if (betAmount) {
            betAmount = parseInt(betAmount.replace("$", "").replaceAll(",", ""));
            return {
                userId,
                betAmount
            };
        }

        return {
            userId,
            betAmount: 0
        };
    }

    const tempList = new Map();
    function inspectPlayers(mutationRecord) {
        const players = $('div[class*=playerPositioner___]');
        tempList.clear();

        if (players.length > 0) {

            players.each(function () {
                const playerDetails = getPlayerDetails(this);


                addUser(playerDetails.userId, playerDetails.betAmount);
                tempList.set(playerDetails.userId, playerDetails.userId);
            });

            for (const [key, value] of idList.entries()) {
                if (!tempList.has(key)) {
                    if ($(`#rr-mug-player-${key}`).length > 0 && $(`#rr-mug-player-${key}`).css("visibility") !== "visible") {
                        $(`#rr-mug-player-${key}`).css("visibility", "visible");
                        // $(`#rr-mug-player-${key}`).focus();

                        // Check if player is ignored
                        if (ignoredPlayers.has(key)) {
                            continue;
                        }

                        if (parseFloat($(`#rr-mugamount-${key}`).html()) >= MIN_MUG_AMOUNT) {
                            try {
                                const mugAaudio = new Audio('https://notificationsounds.com/storage/sounds/file-sounds-1230-pretty-good.ogg');
                                mugAaudio.play();
                            }
                            catch (e) {
                                console.log("Couldn't play mugAaudio");
                            }

                            const attackTab = preloadedTabs.get(key);
                            if (attackTab && !attackTab.closed) {
                                const oldBtn = document.getElementById(`rr-focus-${key}`);
                                if (oldBtn) {
                                    oldBtn.focus();
                                    //oldBtn.focus();
                                }
                            } else {
                                const newWindow = window.open(`https://www.torn.com/loader.php?sid=attack&user2ID=${key}`, "_blank");
                                if (newWindow) newWindow.focus();
                            }
                            //preloadedTabs.delete(key);


                            //$(`#rr-mug-player-${key}`).click();
                            //window.open(`https://www.torn.com/loader.php?sid=attack&user2ID=${key}`);

                        }


                        try {
                            const audio = new Audio('https://notificationsounds.com/storage/sounds/file-sounds-817-reload.ogg');
                            audio.play();

                            const bStats = $(`#rr-bs-${key}`).html();
                            const mugAmount = $(`#rr-mugtext-${key}`).html();
                            const mugText = `BS: ${bStats} - ${mugAmount}`;


                            GM_notification({
                                text: mugText,
                                title: "POKER Mug",
                                image: "",
                                silent: false,
                                timeout: 60 * 1000,
                                highlight: false,
                                onclick: function () {
                                    window.open(`https://www.torn.com/loader.php?sid=attack&user2ID=${key}`);
                                }
                            });
                        }
                        catch (e) {
                            console.log("Couldn't play audio");
                        }

                        setTimeout(() => {
                            unSetUser(key);
                        }, 30 * 1000);
                    }
                }
            }
        }
    }

    async function fetchUserData(userId) {

        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "GET",
                url: `https://api.torn.com/user/${userId}?selections=profile&key=${API_KEY}`,
                onload: function (response) {
                    try {
                        const data = JSON.parse(response.responseText);
                        if (data.status && data.status.state) {
                            //console.log(data);
                            resolve({
                                ...data,
                                username: data.name, // Fetch the username
                                healthStatus: data.status.state,
                                Age: data.age, // Fetch the age,
                                faction: data.faction ?
                                    (data.faction.faction_tag === null || data.faction.faction_tag === "" ? "N/A" : data.faction.faction_tag)
                                    : "N/A"
                            });
                        } else {
                            resolve({
                                ...data,
                                username: data.name, // Fetch the username
                                healthStatus: 'Error: Status unavailable or missing',
                                Age: data.age
                            });
                        }
                    } catch (error) {
                        console.error('Error parsing user data:', error);
                        reject(error);
                    }
                },
                onerror: function (error) {
                    console.error('Error fetching user data:', error);
                    reject(error);
                }
            });
        });
    }

    const BASE_MIN_PERCENTAGE = 0.05; // 5%
    const BASE_MAX_PERCENTAGE = 0.10; // 10%

    function calculateMugRange(betAmount) {
        if (!betAmount) {
            return [0, 0];
        }
        const actualBetAmount = betAmount;
        const baseMinMugAmount = actualBetAmount * BASE_MIN_PERCENTAGE;
        const baseMaxMugAmount = actualBetAmount * BASE_MAX_PERCENTAGE;

        const minMugAmount = Math.floor(baseMinMugAmount);
        const maxMugAmount = Math.floor(baseMaxMugAmount);

        return [minMugAmount, maxMugAmount];
    }

    function formatCurrency(amount) {
        return `$${Number(amount).toLocaleString('en-US')}`;
    }

    function setTitle() {

        let title = 'Poker';

        if (title.slice(-1) === ")") {
            title = title.substring(0, title.length - 4);
        }

        document.title = title + ` (${$(".pok-player-row").length})`;
    }

    function setUser(userId, tbs, username, healthStatus, betAmount, faction) {
        let user = idList.get(userId);
        user.bs = tbs;

        //const formattedBs = (tbs).toLocaleString(
        //    undefined
        //);

        const formattedBs = formatCompactNumber(tbs);

        const cellStyle = ` style="display:inline-block;padding: 3px;`;
        const [minMug, maxMug] = calculateMugRange(betAmount);
        const mugText = `$${formatCompactNumber(minMug)} - $${formatCompactNumber(maxMug)}`;


        idList.set(userId, user);
        if ($(`#player-row-${userId}`).length === 0) {

            // Inside setUser(), create buttons using native DOM API:
            const mugButtonEl = document.createElement('input');
            mugButtonEl.type = 'button';
            mugButtonEl.id = `rr-mug-player-${userId}`;
            mugButtonEl.value = 'MUG';
            mugButtonEl.setAttribute('style', `${buttonStyle}visibility: hidden;`);

            const preloadButtonEl = document.createElement('input');
            preloadButtonEl.type = 'button';
            preloadButtonEl.id = `rr-preload-${userId}`;
            preloadButtonEl.value = 'Preload';
            preloadButtonEl.setAttribute('style', `${buttonStyle}margin-left:5px;`);

            const focusButtonEl = document.createElement('button');
            focusButtonEl.className = 'torn-btn btn___RxE8_ silver';
            focusButtonEl.type = 'submit';
            focusButtonEl.id = `rr-focus-${userId}`;
            focusButtonEl.tabIndex = 0;
            focusButtonEl.textContent = 'Focus';
            focusButtonEl.setAttribute('style', `${buttonStyle}visibility: hidden;margin-left:5px;`);

            const ignoreCheckboxEl = document.createElement('input');
            ignoreCheckboxEl.type = 'checkbox';
            ignoreCheckboxEl.id = `rr-ignore-${userId}`;
            ignoreCheckboxEl.setAttribute('style', 'margin-left:10px; transform: scale(1.2);');

            const profileLink = `<a title="View Profile" style="cursor:pointer;" href ="https://www.torn.com/profiles.php?XID=${userId}" target="_blank">${username}</a>`;
            let statusSpan = '<span style="visibility:hidden">H</span>';
            if (healthStatus === 'Hospital') statusSpan = '<span style="visibility:visible;color:red;">H</span>';

            const playerRow = document.createElement('tr');
            playerRow.id = `player-row-${userId}`;
            playerRow.className = 'pok-player-row';
            playerRow.innerHTML = `
<td${cellStyle}width:90px">${profileLink}</td>
<td style="width:20px">${statusSpan}</td>
<td style="width:25px">${faction}</td>
<td${cellStyle}width:80px" id="rr-bs-${userId}">${formattedBs}</td>
<td${cellStyle}width:120px" id="rr-mugtext-${userId}">${mugText}</td>
<td style="visibility: collapse;display:none;" id="rr-mugamount-${userId}">${betAmount}</td>`;

            const buttonTd = document.createElement('td');
            buttonTd.setAttribute('style', `${cellStyle}width:260px`);
            buttonTd.appendChild(mugButtonEl);
            buttonTd.appendChild(preloadButtonEl);
            buttonTd.appendChild(focusButtonEl);
            buttonTd.appendChild(ignoreCheckboxEl);
            playerRow.appendChild(buttonTd);

            document.getElementById('player-table').appendChild(playerRow);

            // Setup mug button
            mugButtonEl.addEventListener('click', () => {
                const newWindow = window.open(`https://www.torn.com/loader.php?sid=attack&user2ID=${userId}`, "_blank");
                newWindow.blur();
                setTimeout(() => newWindow.focus(), 0);
            });

            // Setup preload button
            preloadButtonEl.addEventListener('click', () => {
                if (preloadedTabs.has(userId) && !preloadedTabs.get(userId).closed) return;
                const attackUrl = `https://www.torn.com/loader.php?sid=attack&user2ID=${userId}`;
                const attackTab = window.open(attackUrl, "_blank");
                if (attackTab) {
                    preloadedTabs.set(userId, attackTab);
                    attackTab.blur();
                    window.focus();
                    focusButtonEl.style.visibility = 'visible';
                } else {
                    alert("Popup blocked. Please allow pop-ups for Torn.");
                }
            });

            // Setup focus button (click & Enter)
            focusButtonEl.addEventListener('click', () => {
                const tab = preloadedTabs.get(userId);
                if (tab && !tab.closed) {
                    const focusSuccess = tab.focus();
                    console.log("Focus success?", focusSuccess);
                    preloadedTabs.delete(userId);
                    focusButtonEl.style.visibility = 'hidden';
                }
            });

            focusButtonEl.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.keyCode === 13) {
                    focusButtonEl.click();
                }
            });

            // Setup ignore checkbox
            ignoreCheckboxEl.addEventListener('change', (e) => {
                if (e.target.checked) {
                    ignoredPlayers.add(userId);
                } else {
                    ignoredPlayers.delete(userId);
                }
            });

            $("#rr-no-players").hide();
        }

        setTitle();
    }

    function unSetUser(userId) {
        idList.delete(userId);
        $(`#player-row-${userId}`).remove();

        if (idList.size === 0) {
            $("#rr-no-players").show();
        }
        else {
            $("#rr-no-players").hide();
        }

        setTitle();
    }

    async function fetchBspData(userId, username, healthStatus, betAmount, faction) {

        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "GET",
                url: `http://www.lol-manager.com/api/battlestats/${API_KEY}/${userId}/9.0.2`,
                onload: function (response) {
                    try {
                        const data = JSON.parse(response.responseText);

                        if (data.Result && data.Result > 0) {

                            //console.log(userId + " BS - " + data.TBS)

                            if (data.TBS > 0 && data.TBS <= MAX_BS) {
                                setUser(userId, data.TBS, username, healthStatus, betAmount, faction);
                            }
                            else {
                                unSetUser(userId);
                            }

                            window.localStorage.setItem(BSP_KEY + userId, response.responseText);
                        }
                        resolve();
                    } catch (error) {
                        console.error('Error parsing bs data:', error);
                        reject(error);
                    }
                },
                onerror: function (error) {
                    console.error('Error fetching bs data:', error);
                    reject(error);
                }
            });
        });
    }


    function getBsFromStorage(userId) {
        const bspStats = window.localStorage.getItem(BSP_KEY + userId);
        if (bspStats) {

            return JSON.parse(bspStats).TBS;

        }

        return 0;
    }

    function addUser(userId, betAmount) {
        if (userId && !idList.has(userId)) {
            idList.set(userId, {
                isPresent: true,
                lastSeen: Date.now(),
                betAmount
            });

            const bs = getBsFromStorage(userId);

            if (bs > MAX_BS) return;

            fetchUserData(userId)
                .then(userData => {
                    idList.set(userId, {
                        isPresent: true,
                        ...userData,
                        lastSeen: Date.now(),
                        betAmount
                    });
                    getPlayerBS(userId, userData, betAmount);
                })
                .catch(error => {
                    console.error('Error fetching user data:', error);
                });
        } else if (idList.has(userId)) {
            idList.get(userId).lastSeen = Date.now();
            if (betAmount !== "N/A") {
                idList.get(userId).betAmount = betAmount;
                const [minMug, maxMug] = calculateMugRange(betAmount);
                const mugText = `$${formatCompactNumber(minMug)} - $${formatCompactNumber(maxMug)}`;

                $(`#rr-mugtext-${userId}`).text(mugText);
                $(`#rr-mugamount-${userId}`).text(betAmount);
            }
        }
    }

    function start() {


        $("#player-table").children().remove();

        const players = $('div[class*=playerPositioner___]');

        if (players.length > 0) {

            players.each(function () {
                const playerDetails = getPlayerDetails(this);

                //if (playerDetails.betAmount >= BET_AMOUNT) {
                //console.log(playerDetails.userId + " - " + playerDetails.betAmount)
                addUser(playerDetails.userId, playerDetails.betAmount, playerDetails.faction);

            });

            if (isFirstLoad) {
                const gameWrapper = $('.sidebar');

                if (gameWrapper.length > 0) {
                    observer = new MutationObserver(inspectPlayers);

                    gameWrapper.each(function () {
                        observer.observe(gameWrapper[0], {
                            childList: true,
                            subtree: true
                        });
                    });
                }

                isFirstLoad = false;
            }

        } else {
            setTimeout(start, 1000);
        }

    }


    init.then(() => {
        initDisplay();
        start();
    });


})(window, jQuery);
