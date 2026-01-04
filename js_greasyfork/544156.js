// ==UserScript==
// @name         Windy.com Premium Watermark Remover
// @namespace    https://github.com/djzhao627
// @version      1.0
// @description  Remove the premium watermark in weather forcast
// @author       djhzao
// @match        https://www.windy.com/*
// @icon         none
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/544156/Windycom%20Premium%20Watermark%20Remover.user.js
// @updateURL https://update.greasyfork.org/scripts/544156/Windycom%20Premium%20Watermark%20Remover.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Select the element containing the watermark using its CSS class
    const style = document.createElement('style');
    style.innerHTML = `
        .get-premium--ribbon {
            display: none !important;
        }
    `;
    document.head.appendChild(style);
})();
