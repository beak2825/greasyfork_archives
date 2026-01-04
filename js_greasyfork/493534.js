// ==UserScript==
// @name         Torn - Russian Roulette Mug
// @namespace    http://tampermonkey.net/
// @version      1.8
// @description  Loader for the Torn RR Helper script
// @author       Flav
// @match        https://www.torn.com/page.php?sid=russianRoulette*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/493534/Torn%20-%20Russian%20Roulette%20Mug.user.js
// @updateURL https://update.greasyfork.org/scripts/493534/Torn%20-%20Russian%20Roulette%20Mug.meta.js
// ==/UserScript==
(function (unsafeWindow, $) {
    'use strict';

    let API_KEY = GM_getValue("API_KEY", "");
    let BET_AMOUNT = parseInt(GM_getValue("BET_AMOUNT", 0));
    let MAX_BS = parseInt(GM_getValue("MAX_BS", 0));
    let isFirstLoad = true;
    let playerTimers = {};

    Date.prototype.add15minutes = function () {
        return new Date(this.setMinutes(this.getMinutes() + 15));
    }

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
            right: 0;
            top: 10%;
            transform: translate(-50%, 0);
            visibility: visible;
            opacity: 1;
            transition: opacity 250ms ease-in, visibility 0ms ease-in 0ms;
            max-height: calc(100vh - 15%);
            overflow-y: auto;
            overflow-x: hidden;
            padding:10px;
            width:500px;
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
        } else if (number >= 1_000_000_000_000 && number < 1_000_000_000_000_000) {
            return (number / 1_000_000_000_000).toFixed(1) + "T";
        }
    }

    const init = new Promise((resolve, reject) => {

        const dialogHtml = `<dialog id="capture-dialog">
                <form method="post" id="captureform" action="" style="padding:10px;">
                <h2>Russian Roulette Mug Settings</h2>
                <p>
                    <label>
                    API Key:
                    </label>
                    <br />
                    <input type="text" required id="rr-api-key" value="${API_KEY}" name="rrApiKey" style="${inputStyle}" />

                </p>
                <p>
                    <label>
                    Minimum Bet Amount:
                    </label>
                    <br />
                    <input type="number" required id="rr-min-bet-amount" min="1" value="${BET_AMOUNT}" name="rrBetAmount" style="${inputStyle}" />

                </p>
                <p>
                    <label>
                    Max Battle Stats:
                    </label>
                    <br />
                    <input type="number" required id="rr-max-bs" min="1000" value="${MAX_BS}" name="rrMaxBs" style="${inputStyle}" />

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

            var formData = new FormData(document.forms.captureform);

            API_KEY = formData.get("rrApiKey");
            BET_AMOUNT = formData.get("rrBetAmount");
            MAX_BS = formData.get("rrMaxBs");

            if (API_KEY !== "" && BET_AMOUNT !== "" && MAX_BS !== "") {

                GM_setValue("API_KEY", API_KEY);
                GM_setValue("BET_AMOUNT", BET_AMOUNT);
                GM_setValue("MAX_BS", MAX_BS);

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

        if (API_KEY === "" || BET_AMOUNT === 0 || MAX_BS === 0) {

            BET_AMOUNT === 0 ? BET_AMOUNT = 1 : BET_AMOUNT;
            MAX_BS === 0 ? MAX_BS = 1000 : MAX_BS;



            const dialog = document.getElementById("capture-dialog");
            dialog.showModal();
        }
        else {
            resolve();
        }
    });

    function getGameDetails(gameElement) {

        const userId = $(gameElement).find(('a[href*="profiles.php"]')).attr("href").split("XID=")[1];
        const betAmount = parseInt($(gameElement).find('div[aria-label*="Bet amount:"]').attr("aria-label").split("Bet amount: ")[1]);

        return {
            userId,
            betAmount
        };
    }

    function inspectGames(mutationRecord) {
        for (let index = 0; index < mutationRecord.length; index++) {
            var mutation = mutationRecord[index];

            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                // new game
                const addedNode = mutation.addedNodes[0];

                if (!$(addedNode).hasClass("row___CHcax")) return;

                const gameDetails = getGameDetails(addedNode);

                if (gameDetails.betAmount >= BET_AMOUNT) {
                    addUser(gameDetails.userId, gameDetails.betAmount);
                }

                break;
            } else if (mutation.type === 'childList' && mutation.removedNodes.length > 0) {
                // game started or pulled out

                for (let index = 0; index < mutation.removedNodes.length; index++) {
                    const removedNode = mutation.removedNodes[index];

                    if (!$(removedNode).hasClass("row___CHcax")) return;

                    const gameDetails = getGameDetails(removedNode);

                    if (idList.has(gameDetails.userId)) {

                        //const attackLink = `<a id="rr-link-attack-${gameDetails.userId}" href="https://www.torn.com/loader.php?sid=attack&user2ID=${gameDetails.userId}" target="_blank">MUG</a>`;

                        //if ($(`#rr-link-attack-${gameDetails.userId}`).length === 0) {
                        //$(`#mug-link-${gameDetails.userId}`).append(attackLink);
                        $(`#rr-mug-player-${gameDetails.userId}`).css("visibility", "visible");
                        $(`#rr-mug-player-${gameDetails.userId}`).focus();
                        $(`#rr-mug-player-${gameDetails.userId}`).click();

                        playAudio();

                        // remove link after 30 seconds
                        setTimeout(() => {
                            unSetUser(gameDetails.userId);
                        }, 30 * 1000);
                        //}
                    }

                }


                break;
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
                            resolve({
                                ...data,
                                username: data.name, // Fetch the username
                                healthStatus: data.status.state,
                                Age: data.age // Fetch the age
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
            console.error("Bet amount is undefined or not provided!");
            return [0, 0];
        }
        const actualBetAmount = betAmount;
        const baseMinMugAmount = actualBetAmount * BASE_MIN_PERCENTAGE;
        const baseMaxMugAmount = actualBetAmount * BASE_MAX_PERCENTAGE;

        const minMugAmount = Math.floor(baseMinMugAmount * 2);
        const maxMugAmount = Math.floor(baseMaxMugAmount * 2);

        return [minMugAmount, maxMugAmount];
    }

    function formatCurrency(amount) {
        return `$${Number(amount).toLocaleString('en-US')}`;
    }

    function setTitle() {

        let title = 'Russian Roulette';

        if (title.slice(-1) === ")") {
            title = title.substring(0, title.length - 4);
        }

        if (idList.size > 0)
            document.title = title + ` (${idList.size})`;
        else
            document.title = title;
    }

    function playAudio() {
        try {
            let audio = new Audio('https://staticfiles.torn.com/casino/craps/audio/win.ogg');
            audio.play();
        }
        catch (e) {
            console.log("Couldn't play audio");
        }
    }

    function setUser(userId, tbs, username, healthStatus, betAmount) {
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

        const targetDate = new Date().add15minutes();
        //const timeout = `${timeoutDate.getHours()}:${timeoutDate.getMinutes() < 10 ? '0' + timeoutDate.getMinutes() : timeoutDate.getMinutes()}:${timeoutDate.getSeconds() < 10 ? '0' + timeoutDate.getSeconds() : timeoutDate.getSeconds()}`;

        if (playerTimers[userId]) {
            clearInterval(playerTimers[userId]);
            delete playerTimers[userId];
        }

        console.log("playerTimers:" + JSON.stringify(playerTimers));


        // Get the current date and time
        const currentDate = new Date();
        // Calculate the time difference between the target date and the current date
        const timeDifference = targetDate.getTime() - currentDate.getTime();
        // Convert the time difference to seconds
        let totalSeconds = Math.floor(timeDifference / 1000);
        // Define a function to update the countdown timer
        function updateCountdown() {
            // Calculate the remaining hours, minutes, and seconds
            //const hours = Math.floor(totalSeconds / 3600);
            const minutes = Math.floor((totalSeconds % 3600) / 60);
            const seconds = Math.floor(totalSeconds % 60);
            // Display the countdown timer
            //console.log(`${minutes}:${seconds}`);
            $(`#player-timer-${userId}`).html(`${minutes}:${seconds < 10 ? '0' + seconds : seconds}`);
            // Decrease the totalSeconds by 1
            totalSeconds--;
            // Check if the countdown has reached zero
            if (totalSeconds < 0) {
                clearInterval(playerTimers[userId]);
                $(`#rr-mug-player-${userId}`).css("visibility", "visible");

                playAudio();

                setTimeout(() => {
                    unSetUser(userId);
                }, 30 * 1000);

            }
        }

        playerTimers[userId] = setInterval(updateCountdown, 1000);


        if ($(`#player-row-${userId}`).length === 0) {
            const mugButton = `<input type="button" id="rr-mug-player-${userId}" value="MUG" style="${buttonStyle}visibility: hidden;" />`;

            const profileLink = `<a title="View Profile" style="cursor:pointer;" href ="https://www.torn.com/profiles.php?XID=${userId}" target="_blank">${username}</a>`;
            let statusSpan = '<span style="visibility:hidden">H</span>';



            if (healthStatus === 'Hospital') statusSpan = '<span style="visibility:visible;color:red;">H</span>';

            const playerHtml = `<tr id="player-row-${userId}">
            <td${cellStyle}width:100px">${profileLink}</td>
            <td style="width:10px">${statusSpan}</td>
            <td${cellStyle}width:60px">${formattedBs}</td>
            <td${cellStyle}width:120px">${mugText}</td>
            <td${cellStyle}width:40px" id="player-timer-${userId}"></td>
            <td${cellStyle}width:60px" id="player-time-${userId}"></td>
            <td${cellStyle}width:70px">${mugButton}</td></tr>`;

            $("#player-table").append(playerHtml);


            $(`#rr-mug-player-${userId}`).on('click', function () {
                window.open(`https://www.torn.com/loader.php?sid=attack&user2ID=${userId}`, "_blank");
            });



            $("#rr-no-players").hide();
        }

        const hours = targetDate.getHours();
        const minutes = targetDate.getMinutes();
        const seconds = targetDate.getSeconds();
        const mugTime = `${hours}:${minutes < 10 ? '0' + minutes : minutes}:${seconds < 10 ? '0' + seconds : seconds}`;

        $(`#player-time-${userId}`).html(mugTime);

        setTitle();
    }

    function unSetUser(userId) {
        idList.delete(userId);
        $(`#player-row-${userId}`).remove();

        if (playerTimers[userId]) {
            clearInterval(playerTimers[userId]);
            delete playerTimers[userId];
        }

        if (idList.size === 0) {
            $("#rr-no-players").show();
        }
        else {
            $("#rr-no-players").hide();
        }

        setTitle();
    }

    async function fetchBspData(userId, username, healthStatus, betAmount) {

        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "GET",
                url: `http://www.lol-manager.com/api/battlestats/${API_KEY}/${userId}/9.0.2`,
                onload: function (response) {
                    try {
                        const data = JSON.parse(response.responseText);
                        if (data.Result && data.Result > 0) {
                            if (data.TBS <= MAX_BS) {
                                setUser(userId, data.TBS, username, healthStatus, betAmount);
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

    function addUser(userId, betAmount) {
        if (userId && !idList.has(userId)) {
            idList.set(userId, {
                isPresent: true,
                lastSeen: Date.now(),
                betAmount
            });
            fetchUserData(userId)
                .then(userData => {
                    idList.set(userId, {
                        isPresent: true,
                        ...userData,
                        lastSeen: Date.now(),
                        betAmount
                    });
                    const bspStats = window.localStorage.getItem(BSP_KEY + userId);
                    if (bspStats) {

                        const userBs = JSON.parse(bspStats).TBS;

                        if (userBs <= MAX_BS) {
                            setUser(userId, userBs, userData.name, userData.healthStatus, betAmount);
                        }
                        else {
                            unSetUser(userId);
                        }
                    }
                    else {
                        fetchBspData(userId, userData.name, userData.healthStatus, betAmount);
                    }
                })
                .catch(error => {
                    console.error('Error fetching user data:', error);
                });
        } else if (idList.has(userId)) {
            idList.get(userId).lastSeen = Date.now();
            if (betAmount !== "N/A")
                idList.get(userId).betAmount = betAmount;
        }
    }

    function start() {

        $("#player-table").children().remove();

        const gamesWrapper = $(".rowsWrap___QDquR");

        if (gamesWrapper.length > 0) {

            gamesWrapper.children().each(function () {
                const gameDetails = getGameDetails(this);

                if (gameDetails.betAmount >= BET_AMOUNT) {
                    addUser(gameDetails.userId, gameDetails.betAmount);
                }
            });

            const playerWrapper = $(".cont-gray.bottom-round");

            if (playerWrapper.length > 0) {
                observer = new MutationObserver(inspectGames);

                gamesWrapper.each(function () {
                    observer.observe(playerWrapper[1], {
                        childList: true,
                        subtree: true
                    });
                });
            }
        } else {
            setTimeout(start, 1000);
        }

    }


    init.then(() => {

        initDisplay();
        start();
        isFirstLoad = false;
    });


})(window, jQuery);
