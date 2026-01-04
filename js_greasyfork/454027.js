// ==UserScript==
// @name         YouTube shorts to wide
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  YouTube shorts to wide Ctrl + q
// @author       fact-0
// @match        https://www.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/454027/YouTube%20shorts%20to%20wide.user.js
// @updateURL https://update.greasyfork.org/scripts/454027/YouTube%20shorts%20to%20wide.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.addEventListener("keydown", keysPressed, false);
    window.addEventListener("keyup", keysReleased, false);

    let keys = [];

    function keysPressed(e) {
        if(!document.location.href.includes('shorts/')){
            return;
        }

        keys[e.keyCode] = true;

        // Ctrl + Space
        if (keys[17] && keys[81]) {
            const p =  document.location.href.split('shorts/')[1];
            location.href=`https://www.youtube.com/watch?v=${p}`;

            console.log("Ctrl + q");
            e.preventDefault();	 // prevent default browser behavior
        }
    }

    function keysReleased(e) {
        keys[e.keyCode] = false;
    }
})();