// ==UserScript==
// @name         PrisonStruggle Percentage Display
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Display percentage values to the right of bars in PrisonStruggle
// @author       Nina
// @match        https://prisonstruggle.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/521872/PrisonStruggle%20Percentage%20Display.user.js
// @updateURL https://update.greasyfork.org/scripts/521872/PrisonStruggle%20Percentage%20Display.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Display percentage numbers for bars
    document.querySelectorAll('.hasTooltip').forEach(el => {
        const tooltip = el.getAttribute('data-tippy-content');
        const match = tooltip.match(/(\d+)[%]/);
        if (match) {
            const percentage = match[1] + '%';
            const percentageDisplay = document.createElement('span');
            percentageDisplay.style.color = 'black';
            percentageDisplay.style.position = 'absolute';
            percentageDisplay.style.marginLeft = '5px';
            percentageDisplay.textContent = `(${percentage})`;
            el.parentNode.appendChild(percentageDisplay);
        }
    });
})();
