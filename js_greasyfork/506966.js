// ==UserScript==
// @name         Torn Crimes Scamming Timers
// @namespace    https://github.com/SOLiNARY
// @version      0.3.2
// @description  Show how much cooldown & expiration is left for targets
// @author       Ramin Quluzade, Silmaril [2665762]
// @license      MIT License
// @match        https://www.torn.com/loader.php?sid=crimes*
// @match        https://torn.com/loader.php?sid=crimes*
// @match        https://www.torn.com/page.php?sid=crimes*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        GM_addStyle
// @grant        unsafeWindow
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/506966/Torn%20Crimes%20Scamming%20Timers.user.js
// @updateURL https://update.greasyfork.org/scripts/506966/Torn%20Crimes%20Scamming%20Timers.meta.js
// ==/UserScript==

(async function() {
    'use strict';

    const showExpiration = true;
    const showCooldown = true;
    const timeElementsToShow = 2; // Options: 1,2,3,4
    const scammingCrimesUrl = 'loader.php?sid=crimesData&step=crimesList&rfcv='
    const observerConfig = { childList: true, subtree: true };
    let foundTargets = false;
    let noTargets = false;
    let targets = {};
    const isTampermonkeyEnabled = typeof unsafeWindow !== 'undefined';
    const isMobileView = window.innerWidth <= 784;
    const { fetch: originalFetch } = isTampermonkeyEnabled ? unsafeWindow : window;
    const customFetch = async (...args) => {
        let [resource, config] = args;
        let response = await originalFetch(resource, config);
        if (response.url.indexOf(scammingCrimesUrl) >= 0 && window.location.href.includes('crimes#/scamming')) {
            targets = {};
            try {
                const jsonData = await response.clone().json();
                jsonData.DB.crimesByType.targets.forEach((target, index) => {
                    let expireTimestamp = target.expire.toString().length == 10 ? target.expire : target.expire.toString().substr(0, 10); // Fix for Torn's long timestamps bug
                    let cooldownTimestamp = null;
                    if (target.cooldown > 0){
                        cooldownTimestamp = target.cooldown.toString().length == 10 ? target.cooldown : target.cooldown.toString().substr(0, 10); // Fix for Torn's long timestamps bug
                    }
                    targets[index] = {
                        email: target.email,
                        expire: expireTimestamp,
                        cooldown: cooldownTimestamp
                    };
                });

                response.json = async () => jsonData;
                response.text = async () => JSON.stringify(jsonData);
            } catch (error) {
                noTargets = true;
                console.log('[TornCrimesScammingTimers] No targets, skipping the script init', error);
            }
        }

        return response;
    };

    if (isTampermonkeyEnabled){
        unsafeWindow.fetch = customFetch;
    } else {
        window.fetch = customFetch;
    }

    await addStyle();

    const timeDeltas = {
        "After": 1,
        "Ago": -1
    };
    const timerTypes = {
        "Expiration": 1,
        "Cooldown": 2
    }


    setInterval(addTimeSpans, 2 * 1_000);

    function addTimeSpans(){
        let targetEmailSpans = document.querySelectorAll('div.crimes-app div.crime-root.scamming-root div[class^=virtualList___] div[class^=virtualItem___] span[class^=email___]');
        Object.values(targets).forEach(target => {
            var match = Object.values(targetEmailSpans).find(targetRow => targetRow.innerText == target.email);
            if (match != null) {
                if (showCooldown){
                    let timeElement = match.parentNode.querySelector('span.silmaril-torn-crimes-scamming-timers-cooldown');
                    if (timeElement == null) {
                        timeElement = document.createElement('span');
                        timeElement.className = 'silmaril-torn-crimes-scamming-timers-cooldown';
                        timeElement.innerText = calculateTimeDelta(target.cooldown, timeDeltas.After, timerTypes.Cooldown, !isMobileView);
                        match.insertAdjacentElement('afterEnd', timeElement);
                    } else {
                        timeElement.innerText = calculateTimeDelta(target.cooldown, timeDeltas.After, timerTypes.Cooldown, !isMobileView);
                    }
                }
                if (showExpiration){
                    let timeElement = match.parentNode.querySelector('span.silmaril-torn-crimes-scamming-timers-expiration');
                    if (timeElement == null) {
                        timeElement = document.createElement('span');
                        timeElement.className = 'silmaril-torn-crimes-scamming-timers-expiration';
                        timeElement.innerText = calculateTimeDelta(target.expire, timeDeltas.After, timerTypes.Expiration, !isMobileView);
                        match.insertAdjacentElement('afterEnd', timeElement);
                    } else {
                        timeElement.innerText = calculateTimeDelta(target.expire, timeDeltas.After, timerTypes.Expiration, !isMobileView);
                    }
                }
            }
        })
    }

    function calculateTimeDelta(timestamp, timeDeltaType, timerType, isDesktopView) {
        const now = Math.floor(Date.now() / 1000); // Current timestamp in seconds
        let timeDelta = timestamp - now; // Time remaining in seconds

        if (timeDeltaType === timeDeltas.After && timeDelta <= 0) {
            switch (timerType){
                case timerTypes.Cooldown:
                    return "";
                case timerTypes.Expire:
                default:
                    return "Expired";
            }
        }
        if (timeDeltaType === timeDeltas.Ago) {
            timeDelta = Math.abs(timeDelta);
            if (timeDelta <= 0) {
                return "Just now";
            }
        }

        const days = Math.floor(timeDelta / 86400); // 86400 seconds in a day
        const hours = Math.floor((timeDelta % 86400) / 3600); // 3600 seconds in an hour
        const minutes = Math.floor((timeDelta % 3600) / 60); // 60 seconds in a minute
        const seconds = timeDelta % 60;

        let prefix = '';
        switch (timerType){
            case timerTypes.Cooldown:
                prefix = "Cooldown in ";
                break;
            case timerTypes.Expire:
            default:
                prefix = "Expires in ";
                break;
        }

        let timeElementsAdded = 0;
        let timeDeltaText = isDesktopView ? timeDeltaType === timeDeltas.After ? prefix : "Created " : timeDeltaType === timeDeltas.After ? "In " : "";
        if (days != 0 && timeElementsAdded < timeElementsToShow) {
            timeDeltaText += isDesktopView ? `${days} d` : `${days} day${days === 1 ? '' : 's'}`;
            timeElementsAdded += 1;
        }
        if (hours != 0 && timeElementsAdded < timeElementsToShow) {
            if (days !== 0){
                timeDeltaText += ', ';
            }
            timeDeltaText += isDesktopView ? `${hours} h` : `${hours} hour${hours === 1 ? '' : 's'}`;
            timeElementsAdded += 1;
        }
        if (minutes != 0 && timeElementsAdded < timeElementsToShow) {
            if (days !== 0 || hours !== 0){
                timeDeltaText += ', ';
            }
            timeDeltaText += isDesktopView ? `${minutes} m` : `${minutes} minute${minutes === 1 ? '' : 's'}`;
            timeElementsAdded += 1;
        }
        if (seconds != 0 && timeElementsAdded < timeElementsToShow) {
            if (days !== 0 || hours !== 0 || minutes !== 0){
                timeDeltaText += ', ';
            }
            timeDeltaText += isDesktopView ? `${seconds} s` : `${seconds} second${seconds === 1 ? '' : 's'}`;
            timeElementsAdded += 1;
        }
        if (timeDeltaType === timeDeltas.Ago) {
            timeDeltaText += ' ago';
        }

        return timeDeltaText;
    }

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async function addStyle() {
        const styles = `
        span.silmaril-torn-crimes-scamming-timers-cooldown {
            color: yellowgreen;
            font-size: xx-small;
            display: ${showCooldown ? 'block' : 'none'};
        }
        span.silmaril-torn-crimes-scamming-timers-expiration {
            color: gray;
            font-size: xx-small;
            display: ${showExpiration ? 'block' : 'none'};
        }
        `;

        if (isTampermonkeyEnabled){
            GM_addStyle(styles);
        } else {
            let style = document.createElement("style");
            style.type = "text/css";
            style.innerHTML = styles;
            while (document.head == null){
                await sleep(50);
            }
            document.head.appendChild(style);
        }
    }
})();