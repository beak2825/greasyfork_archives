// ==UserScript==
// @name         WhiskeRR
// @namespace    rr.whiskerr.torn
// @version      0.2
// @description  RR timer and alert
// @author       You
// @match        https://www.torn.com/page.php?sid=russianRoulette*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        unsafeWindow
// @run-at       document-start
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/465825/WhiskeRR.user.js
// @updateURL https://update.greasyfork.org/scripts/465825/WhiskeRR.meta.js
// ==/UserScript==


var timer_alert = 60; // Will alert once the time left in seconds is less than this value

var rrdata = {};

var audio = new Audio('https://media.geeksforgeeks.org/wp-content/uploads/20190531135120/beep.mp3');

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
    let now = Math.round(Date.now()/1000);
    let timeLeft = 900-(now-startTime);

    if (timeLeft < timer_alert){
        audio.play();
    }
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