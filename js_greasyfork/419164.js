// ==UserScript==
// @name         Russian Roulette Timeout
// @namespace    hardy.russian.roulette
// @version      2.3
// @description  Shows a countdown of when a RR match would expire and makes names on Poker table clickable
// @author       Hardy [2131687]
// @match        https://www.torn.com/page.php?sid=russianRoulette*
// @match        https://www.torn.com/loader.php?sid=holdem*
// @grant        unsafeWindow
// @run-at       document-start
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/419164/Russian%20Roulette%20Timeout.user.js
// @updateURL https://update.greasyfork.org/scripts/419164/Russian%20Roulette%20Timeout.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let obj = {};
    let mobile = true;
    obj.matches = {};
    let settings = {"color": 1};
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
    } else if (pageUrl.includes("loader.php?sid=holdem")) {
        setInterval(addLink, 5000);
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
                    if (mobile) {
                        let spanList = match.querySelector("div[class^='betBlock']");
                        let bet = "$"+formatNumber(spanList.getAttribute("aria-label").split(":")[1].trim());
                        spanList.innerText = bet +"\n"+time;
                    }
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
    function addLink() {
        let list = document.querySelectorAll("div[class^='playerPosition']");
        if (list.length > 0) {
            for (const entry of list) {
                let player = entry.querySelector("div[class^='opponent']");
                if (player) {
                    let id = player.getAttribute("id").split("-")[1];
                    let nameNode = player.querySelector("div[class^='detailsBox'] p[class^='name']");
                    if (settings.color === 1) {
                        settings.color = getComputedStyle(nameNode).getPropertyValue("color");
                    }
                    nameNode.innerHTML = `<a style="text-decoration: none; color: ${settings.color}" href="https://www.torn.com/profiles.php?XID=${id}">${nameNode.innerText}</a>`;
                }
            }
        }
    }
    GM_addStyle(`
div[class^='betBlock'] {line-height: 1.3;}
`);

})();