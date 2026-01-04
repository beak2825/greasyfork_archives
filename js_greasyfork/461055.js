// ==UserScript==
// @name         2Posit
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Watch playposit videos at 1.5x, 2x, or 10x speed!
// @author       reesericci
// @match        https://api.playposit.com/player_v2/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=playposit.com
// @grant        none
// @license      GPL-v3.0-or-later
// @downloadURL https://update.greasyfork.org/scripts/461055/2Posit.user.js
// @updateURL https://update.greasyfork.org/scripts/461055/2Posit.meta.js
// ==/UserScript==



function waitForElm(selector) {
    return new Promise(resolve => {
        if (document.querySelector(selector)) {
            return resolve(document.querySelector(selector));
        }

        const observer = new MutationObserver(mutations => {
            if (document.querySelector(selector)) {
                resolve(document.querySelector(selector));
                observer.disconnect();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
}


(async function() {
    'use strict';

    await waitForElm("#playback-speed-select-all");

    let oneFiveOption = document.createElement("option")
    oneFiveOption.value = 1.5;
    oneFiveOption.text = "1.5x Speed"

    let twoOption = document.createElement("option")
    twoOption.value = 2;
    twoOption.text = "2x Speed"

    let tenOption = document.createElement("option")
    tenOption.value = 10;
    tenOption.text = "10x Speed"

    document.getElementById("playback-speed-select-all").add(oneFiveOption)
    document.getElementById("playback-speed-select-all").add(twoOption)
    document.getElementById("playback-speed-select-all").add(tenOption)
})();