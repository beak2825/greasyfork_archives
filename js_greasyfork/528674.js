// ==UserScript==
// @name         Hide YouTube Info Panel
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Hides the blue info panel below (certain) YouTube videos
// @author       Vesku
// @match        *://www.youtube.com/*
// @grant        GM_addStyle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/528674/Hide%20YouTube%20Info%20Panel.user.js
// @updateURL https://update.greasyfork.org/scripts/528674/Hide%20YouTube%20Info%20Panel.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle(`
        ytd-info-panel-container-renderer {
            display: none !important;
        }
    `);
})();