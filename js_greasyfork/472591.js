// ==UserScript==
// @name         RR Timer
// @namespace    rrtimer.torn
// @version      0.1
// @description  rr timer
// @match        https://www.torn.com/page.php?sid=russianRoulette*
// @grant        unsafeWindow
// @run-at       document-start
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/472591/RR%20Timer.user.js
// @updateURL https://update.greasyfork.org/scripts/472591/RR%20Timer.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let obj = {};
    obj.matches = {};
    let pageUrl = window.location.href;
    if (pageUrl.includes("page.php?sid=russianRoulette")) {
        let original_fetch = unsafeWindow.fetch;
        unsafeWindow.fetch = async (url, init) => {
            let response = await original_fetch(url, init)
            let respo = response.clone();
            if (url.includes("sid=russianRouletteData")) {
                respo.json().then((info) => {
                    if (info.step === "lobby") {
                        setTimeout(addToObj(info.data), 300);

                    }
                });
            }
            return response;
        };
    }
    function addTimer() {
        let listNode = document.querySelector("div[class^='joinWrap'] div[class^='rowsWrap']")
        if (listNode) {
            let list = listNode.children;
            if (list.length === 0) {
                obj.matches = {};
            } else {
                let now = Math.round(Date.now()/1000);
                for (const match of list) {
                    let id = match.getAttribute("id");
                    if (!obj.matches[id]) {
                        obj.matches[id] = now;
                    }
                    let time = getTimer(obj.matches[id]);
                    match.querySelector("div[class^='topSection'] div[class^='statusBlock'] span").innerText = time;
                }
            }
        }
    }
    function formatNumber(num) {
        return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
    }
    function getTimer(startTime) {
        let now = Math.round(Date.now()/1000);
        let timeLeft = 900-(now-startTime);
        if (timeLeft <= 0) {
            return "Match Expired";
        } else if (timeLeft <= 60) {
            return timeLeft + " s";
        } else {
            let min = Math.floor(timeLeft/60);
            let sec = timeLeft%60;
            return min+" m "+ sec + " s";
        }
    }
    function addToObj(info) {
        if (typeof info == "undefined" || info === null) {
            return;
        } else {
            for (const data of info) {
                let id = data.ID;
                if (typeof id != "undefined") {
                    obj.matches[data.ID] = data.timeCreated;
                }
            }
            var cd = setInterval(addTimer, 1000);
        }
    }
    GM_addStyle(`
div[class^='betBlock'] {line-height: 1.3;}
`);

})();