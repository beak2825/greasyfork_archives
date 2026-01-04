// ==UserScript==
// @name         Change to Special Mess
// @namespace    http://tampermonkey.net/
// @version      2024-07-17
// @license      GPLv3
// @description  Changes hostel info for vit chennai website to special mess everytime
// @author       You
// @match        https://vtopcc.vit.ac.in/vtop/content
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ac.in
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/500906/Change%20to%20Special%20Mess.user.js
// @updateURL https://update.greasyfork.org/scripts/500906/Change%20to%20Special%20Mess.meta.js
// ==/UserScript==

(function() {
    'use strict';


    function handleInteraction(event) {
        let element = document.querySelector("#\\36 a > div > div > table > tbody > tr:nth-child(7) > td:nth-child(2)");
        element.innerHTML = "Special Mess - MOTHER HOSPITALITY";
    }

    // Add event listeners for mouse, touch, and scroll events
    document.addEventListener('mousedown', handleInteraction);
    document.addEventListener('touchstart', handleInteraction);
    document.addEventListener('scroll', handleInteraction);
})();