// ==UserScript==
// @name         Windy.com Watermark Remover
// @namespace    https://github.com/ySpica
// @version      1.0
// @description  Remove the watermark for better viewing experience
// @author       Spica Yeung
// @match        https://www.windy.com/*
// @icon         none
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/513488/Windycom%20Watermark%20Remover.user.js
// @updateURL https://update.greasyfork.org/scripts/513488/Windycom%20Watermark%20Remover.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Select the element containing the watermark using its CSS class
    const style = document.createElement('style');
    style.innerHTML = `
        .premium-calendar #map-container::after {
            background-image: none !important;
        }
    `;
    document.head.appendChild(style);
})();