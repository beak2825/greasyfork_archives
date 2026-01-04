// ==UserScript==
// @name       4khd remove click wait and autoclick and ads remove
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  ilikeporn
// @author       rainbowflesh
// @match        https://m.4khd.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=4khd.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/533324/4khd%20remove%20click%20wait%20and%20autoclick%20and%20ads%20remove.user.js
// @updateURL https://update.greasyfork.org/scripts/533324/4khd%20remove%20click%20wait%20and%20autoclick%20and%20ads%20remove.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const interval = setInterval(() => {
        const button = document.getElementById('custom_button');
        if (button) {
            button.click();
            clearInterval(interval);
        }
    }, 100);
    window.addEventListener('load', () => {
        new MutationObserver(() => {
            document.querySelector('div.popup')?.remove();
        }).observe(document.body, {
            childList: true,
            subtree: true,
        });
    });
})();