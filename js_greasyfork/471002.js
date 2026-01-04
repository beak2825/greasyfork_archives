// ==UserScript==
// @name         Google 2014 part 7
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Changes background color and border-bottom of a specific div on YouTube.
// @author       You
// @match        https://vanced-youtube.neocities.org/2013*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/471002/Google%202014%20part%207.user.js
// @updateURL https://update.greasyfork.org/scripts/471002/Google%202014%20part%207.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to change background-color and border-bottom properties of the target div
    function changeBackground() {
        const targetDiv = document.querySelector('div.bg');
        if (targetDiv) {
            targetDiv.style.backgroundColor = '#f1f1f1';
            targetDiv.style.borderBottom = '1px solid #f1f1f1';
        }
    }

    // Wait for the page to load and then apply the changes
    window.addEventListener('load', changeBackground);
})();