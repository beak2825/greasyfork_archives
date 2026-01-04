// ==UserScript==
// @name         Evil Seek CPS Test 1000 CPS (Mobile Support)
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Evil Seek's 1000 CPS Auto Clicker for cpstest.org with mobile support
// @author       Evil Seek
// @match        *://cpstest.org/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/527045/Evil%20Seek%20CPS%20Test%201000%20CPS%20%28Mobile%20Support%29.user.js
// @updateURL https://update.greasyfork.org/scripts/527045/Evil%20Seek%20CPS%20Test%201000%20CPS%20%28Mobile%20Support%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const cps = 1000;
    const delay = 1000 / cps;
    let intervalId;

    function simulateClick() {
        const clickArea = document.querySelector('.click-area'); // Target the click area on cpstest.org
        if (clickArea) {
            const event = new MouseEvent('click', { bubbles: true, cancelable: true, view: window });
            clickArea.dispatchEvent(event);
        }
    }

    function startClicking() {
        if (!intervalId) {
            intervalId = setInterval(simulateClick, delay);
        }
    }

    function stopClicking() {
        if (intervalId) {
            clearInterval(intervalId);
            intervalId = null;
        }
    }

    // Start auto-clicker on page load
    startClicking();

    // Mobile support: Start on touch, stop on release
    document.addEventListener('touchstart', startClicking);
    document.addEventListener('touchend', stopClicking);

    console.log(`Evil Seek 1000 CPS Auto Clicker activated. Mobile chaos unleashed.`);
})();