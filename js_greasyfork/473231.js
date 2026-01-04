// ==UserScript==
// @name         Wall countdown
// @namespace    http://tampermonkey.net/
// @version      0.31
// @description  Give countdowns directly on quick view
// @author       olesien
// @match        https://www.torn.com/city.php
// @license      BSD
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @require      https://cdn.jsdelivr.net/npm/dayjs@1/dayjs.min.js
// @require      https://cdn.jsdelivr.net/npm/dayjs@1/plugin/utc.js
// @require      https://cdn.jsdelivr.net/npm/dayjs@1/plugin/duration.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/473231/Wall%20countdown.user.js
// @updateURL https://update.greasyfork.org/scripts/473231/Wall%20countdown.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let loading = false;
    let apiKey = String(localStorage.getItem("current_wars_key"));
    if (apiKey.length < 10) {
        let key = prompt("Please enter key (public is ok)", "");
        if (key.length > 10) {
            localStorage.setItem("current_wars_key", key);
            apiKey = key;
        } else {
            alert("That is not a key");
        }
    }
    dayjs.extend(window.dayjs_plugin_utc)
    dayjs.extend(window.dayjs_plugin_duration)
    let stored = JSON.parse(localStorage.getItem("current_wars") ?? JSON.stringify({}));
    let storedData;
    if (stored && stored?.timeAdded) {
        if (stored.timeAdded + (60 * 5) >= (Date.now() / 1000)) {
            console.log("we have data from localstorage on current_wars");
            storedData = stored.data;
        }
    }
    function getCountdown(datetime) {
        var currentTime = dayjs();
        var diffTime = dayjs(datetime).unix() - currentTime.unix();

        var duration = dayjs.duration(diffTime * 1000, "milliseconds");
        const twoDP = (n) =>
        n === 0 ? "00" : String(n).length > 1 ? n : "0" + n;

        if (dayjs().utc().isAfter(dayjs(datetime).utc())) {
            return ["", "inherit"];
        }
        const day = duration.days();
        const hour = duration.hours();
        const min = duration.minutes();
        let timestamp = `${day} days ${hour} hours ${min} minutes`;
        let color = "inherit";
        if (day == 0) {
            if (hour > 12) {
                color = "green";
            } else if (hour > 6) {
                color = "yellow";
            } else {
                color = "red";
            }

        }
        return [timestamp, color];
    }
    const fetchData = async () => {
        if (loading) return;
        try {
            loading = true;
            const resp = await fetch(`https://api.torn.com/torn/?selections=territorywars&key=${apiKey}`);
            const body = await resp.json();

            if (body.territorywars) {
                const newData = {timeAdded:  Math.round(Date.now() / 1000), data: body.territorywars}
                storedData = body.territorywars;
                localStorage.setItem("current_wars", JSON.stringify(newData));
            } else {
               localStorage.setItem("current_wars_key", "");
            }
            loading = false;
            return;

        } catch (err) {
            console.log(err);
            loading = false;
            return;
        }
    }

    let setup = false;
    const addCountdown = async (panel) => {
        console.log(panel)
        if (!storedData) await fetchData();
        const exists = panel.querySelector(".countdown-li");
        const listEl = panel.querySelector(".territory-info-wrap");
        if (listEl) {
            const attacker = panel.querySelector(".assaulter");
            const defender = panel.querySelector(".defender");

            if (attacker && defender) {
                const newEl = exists ?? document.createElement("li");
                newEl.className = "countdown-li";
                const li = listEl?.children[0];
                console.log(li?.innerText);
                const territoryName = li?.innerText.split(":")[1].replace(/[^a-z0-9]/gi, '');
                if (!storedData) return;
                console.log(storedData);
                const tertWar = storedData[territoryName]; //{ territory_war_id: 37921, assaulting_faction: 35507, defending_faction: 11581, score: 0, score_required: 1100000, started: 1691765020, ends: 1692024220 }
                console.log(tertWar);
                console.log(territoryName);
                const [countdown, color] = getCountdown(dayjs(tertWar.ends * 1000));
                newEl.innerHTML = `<span class="bold">Time left: </span>${countdown}`
                newEl.style.color = color;
                console.log(newEl);
                listEl.appendChild(newEl);
            }


        }


    }
    const observer = new MutationObserver((mutationsList, observer) => {
        let panel = document.querySelector(".leaflet-popup-pane");
        if (!setup && panel) {
            setup = true;
            observer.disconnect();
            observer.observe(document.querySelector(".leaflet-popup-pane"), { subtree: false, childList: true});
        } else if (panel) {
            console.log("adding buttons");
            const allWrappers = Array.from(panel.querySelectorAll(".leaflet-zoom-animated"))
            const wrappers = allWrappers.filter(wrapper => wrapper.querySelector(".btn-wrap"));
            const rackets = allWrappers.filter(wrapper => wrapper.querySelector(".m-left10"));
            rackets.forEach(racket => {
                racket.style.bottom = "15px"
                racket.style.left = "200px"
            });
            const newPanel = wrappers.length > 1 ? wrappers[1] : wrappers[0];
            for (let mutation of mutationsList) {
                if (mutation.type === "childList") {
                    // Only handle direct child changes
                    for (let addedNode of mutation.addedNodes) {
                        if (addedNode.nodeType === Node.ELEMENT_NODE && panel.contains(addedNode)) {
                            if (newPanel) addCountdown(newPanel);
                        }
                    }
                }
            }

            if (wrappers && wrappers.length > 1) {
                const shitWrapper = wrappers[0];
                if (shitWrapper) shitWrapper.style.display = "none";
            }


        }
    });

    observer.observe(document, { subtree: true, childList: true });
})();