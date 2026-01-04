// ==UserScript==
// @name         YTMusic red seekbar
// @namespace    http://tampermonkey.net/
// @version      2024-11-04
// @description  sets seekbar color to flat red
// @author       Lukifer
// @match        *://music.youtube.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/515762/YTMusic%20red%20seekbar.user.js
// @updateURL https://update.greasyfork.org/scripts/515762/YTMusic%20red%20seekbar.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // inject custom css
    function addCustomStyle() {
        const style = document.createElement('style');
        style.textContent = `
            ytmusic-player-bar[enable-cairo-refresh-signature-moments-web] #progress-bar.ytmusic-player-bar {
                --paper-slider-active-color: #f03 !important;
            }
        `;
        document.head.appendChild(style);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', addCustomStyle);
    } else {
        addCustomStyle();
    }
})();
