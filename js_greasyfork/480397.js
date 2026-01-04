// ==UserScript==
// @name         Inactive Screen - Shigure
// @namespace    inactivescreenshigure
// @version      1.0
// @description  Display Shiguri after "?" seconds of inactivity
// @author       Who cares
// @license      GPLv3
// @match        *://*/*
// @exclude      *://example.com/* // Add url
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/480397/Inactive%20Screen%20-%20Shigure.user.js
// @updateURL https://update.greasyfork.org/scripts/480397/Inactive%20Screen%20-%20Shigure.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let idleTimer;
    const idleTime = 90000; // Set time, 90000 = 90 seconds

    function startIdleTimer() {
        idleTimer = setTimeout(() => {
            showGif();
        }, idleTime);
    }

    function resetIdleTimer() {
        clearTimeout(idleTimer);
        startIdleTimer();
    }

    function showGif() {
        const gifOverlay = document.createElement('div');
        gifOverlay.id = 'gif-overlay';
        document.body.appendChild(gifOverlay);
    }

    function removeGif() {
        const gifOverlay = document.getElementById('gif-overlay');
        if (gifOverlay) {
            gifOverlay.remove();
            resetIdleTimer();
        }
    }

    GM_addStyle(`
        #gif-overlay {
            position: fixed;
            bottom: 25px;
            right: 25px;
            width: 160px;
            height: 210px;
            background-image: url('https://i.ibb.co/0jZDGqD/shigure.gif');
            background-repeat: no-repeat;
            filter: blur(0px);
            z-index: 9999;
        }
    `);

    document.addEventListener('mousemove', removeGif);
    document.addEventListener('keypress', removeGif);

    startIdleTimer();
})();
