// ==UserScript==
// @name         MADBLOX Ad Blocker
// @namespace    http://tampermonkey.net/
// @version      2024-07-25
// @description  MADBLOX Ad Blocker | Don't give money to the stupid people that run madblox!
// @author       watrabi
// @match        https://robloxa.cf/*
// @icon         https://robloxa.cf/images/MADBLOXsmall.png
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/501532/MADBLOX%20Ad%20Blocker.user.js
// @updateURL https://update.greasyfork.org/scripts/501532/MADBLOX%20Ad%20Blocker.meta.js
// ==/UserScript==

(function() {
    'use strict';
    if (!localStorage.getItem('disableads')) {
        alert('Please disable any ad blockers that you may have enabled.\n\nThis script does that job.');
        localStorage.setItem('disableads', 'true');
    }

    function removeads() {
        const iframes = document.querySelectorAll('iframe');
        iframes.forEach(iframe => {
            if (iframe.src.includes('ad.a-ads.com')) {
                iframe.remove();
            }
        });
    }
    removeads(); // removes before load *doesn't seem to cause an issue*
    window.addEventListener('load', removeads); // wait for load
    setInterval(removeads, 5000); // just in case they're being readded
})();