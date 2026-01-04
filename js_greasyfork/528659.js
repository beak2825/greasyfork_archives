// ==UserScript==
// @name         Stop YouTube scrolling
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Stops YouTube autoscrolling when pressing on the bottom bar (video chapters)
// @author       vesku
// @match        https://www.youtube.com/*
// @grant        GM_addStyle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/528659/Stop%20YouTube%20scrolling.user.js
// @updateURL https://update.greasyfork.org/scripts/528659/Stop%20YouTube%20scrolling.meta.js
// ==/UserScript==

(function() {
    'use strict';

    //
    GM_addStyle(`
        .ytp-chapter-container {
            pointer-events: none;
        }
        .ytp-chapter-container * {
            pointer-events: auto;
        }
    `);
})();
