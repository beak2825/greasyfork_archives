// ==UserScript==
// @name         Market Auto-Yes
// @namespace    http://tampermonkey.net/
// @version      2
// @match        https://www.torn.com/*
// @description  Auto yes after market buy
// @author       LoadEnro
// @run-at       document-end
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/534866/Market%20Auto-Yes.user.js
// @updateURL https://update.greasyfork.org/scripts/534866/Market%20Auto-Yes.meta.js
// ==/UserScript==

const interval = setInterval(() => {
const yesButton = Array.from(document.querySelectorAll('button'))
        .find(btn => btn.textContent.trim() === 'Yes');

    if (yesButton) {
        clearInterval(interval);
        yesButton.click();
    }
}, 100); // Check every 100ms
