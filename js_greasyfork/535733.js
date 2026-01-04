// ==UserScript==
// @name         Fiveable Bypass Script
// @namespace    http://tampermonkey.net/
// @version      1000
// @author       0xBear
// @description  clear local storage and refresh to bypass fiveable paywall
// @match        *://fiveable.me/*
// @match        *://*.fiveable.me/*
// @grant        none
// @run-at       document-start
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/535733/Fiveable%20Bypass%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/535733/Fiveable%20Bypass%20Script.meta.js
// ==/UserScript==

(function() {
    // Disable localStorage
    localStorage.clear();
    console.log('running');

    // clear localStorage and close popup
    setInterval(() => {
        localStorage.clear();
        const button = document.querySelector('.MuiButtonBase-root.MuiIconButton-root.MuiIconButton-sizeMedium.css-19l2szi');
        if (button) {
            button.click();
        } else {
        }
    }, 1000);

    // Check for hard stop
    const targetSelector = '.MuiDialogContent-root.css-1a36fg .MuiBox-root[data-testid="timed-hard-gate"]';

    function checkAndRefresh() {
        const targetElement = document.querySelector(targetSelector);
        if (targetElement) {
            console.log('Target element detected. Refreshing the page...');
            localStorage.clear();

            location.reload(); 
        }
    }
    const observer = new MutationObserver(checkAndRefresh);
    observer.observe(document.body, { childList: true, subtree: true });
})();
