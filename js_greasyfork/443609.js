// ==UserScript==
// @name         ZoomUtils
// @namespace    https://letga.me/
// @version      0.3.1.1
// @description  A bunch of small utilities for Zoom Web Meetings.
// @author       LetGame
// @license      MIT
// @match        https://zoom.us/*
// @match        https://*.zoom.us/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zoom.us
// @grant        window.close
// @downloadURL https://update.greasyfork.org/scripts/443609/ZoomUtils.user.js
// @updateURL https://update.greasyfork.org/scripts/443609/ZoomUtils.meta.js
// ==/UserScript==

/* jshint esversion: 8 */

(function() {
    'use strict';

    const addTimer = async(element, seconds) => { // timer function
        const sleep = ms => new Promise(resolve => setTimeout(resolve, ms)); // sleep function for delays

        const text = element.innerText;
        for (var t = seconds; t > 0; t--) {
            element.innerText = text + ' (' + t + ')';
            await sleep(1000);
        }
        element.innerText = text + ' (0)';
        await sleep(100); // additional 100ms timeout to avoid bugs
    };

    const q = e => document.querySelector(e); // querySelector shortcut

    window.addEventListener('load', () => {
        q('body').style.fontFamily = "sans-serif"; // fix fonts

        if (window.location.href.match('zoom.us/j/')) { // web client redirector
            window.location.href = window.location.href.replace('/j/', '/wc/join/');
        }

        if (window.location.href.match('zoom.us/wc/leave')) {
            q('#change_bo').style.display = 'none'; // remove the annoying message to switch to chrome
            addTimer(q('.leave-wrap h1'), 5).then(() => {window.close();}); // auto close ended meetings
        }

        if (window.location.href.match('zoom.us/wc/join/')) {
            addTimer(q("#joinBtn"), 5).then(() => {q("#joinBtn").click();}); // auto join button press
        }
    });
})();