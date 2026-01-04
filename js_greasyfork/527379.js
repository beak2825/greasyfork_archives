// ==UserScript==
// @name         dtf adblock
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  удаляет рекламные посты
// @author       resursator
// @license      MIT
// @match        https://dtf.ru/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=dtf.ru
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/527379/dtf%20adblock.user.js
// @updateURL https://update.greasyfork.org/scripts/527379/dtf%20adblock.meta.js
// ==/UserScript==

function removeAdDivs() {
    let rotators = document.querySelectorAll(".rotator");
    if (rotators) {
        let childad = rotators[0].children[0];
        let adstyle = childad.classList[0];
        let styleSheet = document.styleSheets[0];
        styleSheet.insertRule("." + adstyle + " { display: none; }", 0);
        if (rotators.length > 0) for (let rotator of rotators) rotator.remove();
    }
}

function removeAdDivsTimeout() {
    removeAdDivs();
    setTimeout(removeAdDivs(), 500);
    setTimeout(removeAdDivs(), 1250);
}

document.addEventListener("DOMContentLoaded", removeAdDivsTimeout());