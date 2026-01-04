// ==UserScript==
// @name        RR timer
// @namespace    rr.whiskerr.torn
// @version      0.3
// @description  Adds RR game timer
// @author       Whiskey_Jack [1994581]
// @match        https://www.torn.com/page.php?sid=russianRoulette*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        unsafeWindow
// @run-at       document-start
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/512902/RR%20timer.user.js
// @updateURL https://update.greasyfork.org/scripts/512902/RR%20timer.meta.js
// ==/UserScript==

var rrdata = {};

(function() {

    let loc = window.location.href;
    if (loc.includes("page.php?sid=russianRoulette")) {
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
})();

function getTimer(startTime) {
    let now = Math.round(Date.now() / 1000);
    let timeLeft = 900 - (now - startTime); // Time left calculation

    if (timeLeft > 60) {
        let min = Math.floor(timeLeft / 60);
        let sec = timeLeft % 60;
        return min + " m " + sec + " s";
    } else {
        return timeLeft + " s"; // Even if negative, it won't interfere
    }
}

function addTimer() {
    let listNode = document.querySelector("div[class^='joinWrap'] div[class^='rowsWrap']")
    if (listNode) {
        let list = listNode.children;
        if (list.length === 0) {
            rrdata = {};
        } else {
            let now = Math.round(Date.now()/1000);
            for (const match of list) {
                let id = match.getAttribute("id");
                if (!rrdata[id]) {
                    rrdata[id] = now;
                }
                let time = getTimer(rrdata[id]);
                match.querySelector("div[class^='topSection'] div[class^='statusBlock'] span").innerText = time;
            }
        }
    }
}

function addToObj(info) {
    if (typeof info == "undefined" || info === null) {
        return;
    } else {
        for (const data of info) {
            let id = data.ID;
            if (typeof id != "undefined") {
                rrdata[data.ID] = data.timeCreated;
            }
        }
        var cd = setInterval(addTimer, 1000);
    }
}
