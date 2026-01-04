// ==UserScript==
// @name         Auto ok klicker
// @namespace    http://tampermonkey.net/
// @version      2024-11-23
// @description  clicks ok in tw divs
// @author       You
// @match        https://greasyfork.org/en/scripts/514385-clothcache-filter
// @icon         https://www.google.com/s2/favicons?sz=64&domain=greasyfork.org
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/518569/Auto%20ok%20klicker.user.js
// @updateURL https://update.greasyfork.org/scripts/518569/Auto%20ok%20klicker.meta.js
// ==/UserScript==

let okDivClickCount = 0;
let clickTimes = [];

function clickJaDiv() {
    var jaDiv = Array.from(document.querySelectorAll('.textart_title'))
        .find(div => div.textContent.trim() === 'Ja');
    if (jaDiv) {
        jaDiv.click();
    }
}

function clickOkDiv() {
    var okDiv = Array.from(document.querySelectorAll('.textart_title'))
        .find(div => div.textContent.trim() === 'Ok');
    if (okDiv) {
        okDiv.click();
        okDivClickCount++;
        clickTimes.push(Date.now());
        cleanupOldClicks();
        console.log(`OK Divs clicked in the last minute: ${okDivClickCount}`);
    }
}

function cleanupOldClicks() {
    const oneMinuteAgo = Date.now() - 60000;
    clickTimes = clickTimes.filter(time => time > oneMinuteAgo);
    okDivClickCount = clickTimes.length;
}

function observePopup() {
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.addedNodes.length > 0) {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === 1) {
                        clickJaDiv();
                        clickOkDiv();
                    }
                });
            }
        });
    });

    observer.observe(document.body, { childList: true, subtree: true });
}

observePopup();
