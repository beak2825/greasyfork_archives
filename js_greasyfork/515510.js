// ==UserScript==
// @name         YouTube Cast Button - Apple AirPlay Style
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Change the YouTube Cast button to resemble the Apple AirPlay icon on all YouTube pages
// @author       GPT
// @match        https://www.youtube.com/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/515510/YouTube%20Cast%20Button%20-%20Apple%20AirPlay%20Style.user.js
// @updateURL https://update.greasyfork.org/scripts/515510/YouTube%20Cast%20Button%20-%20Apple%20AirPlay%20Style.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // CSS to replace the Cast icon with an AirPlay-style icon
    GM_addStyle(`
        /* Target the YouTube Cast button */
        .ytp-chrome-controls .ytp-button[data-tooltip-target-id="ytp-id-18"] svg {
            visibility: hidden; /* Hide the default Cast icon */
        }

        /* Insert custom AirPlay icon using :after pseudo-element */
        .ytp-chrome-controls .ytp-button[data-tooltip-target-id="ytp-id-18"]::after {
            content: '';
            display: inline-block;
            width: 16px;
            height: 16px;
            background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white"><path d="M12 3C7.03 3 3 7.03 3 12h2c0-3.87 3.13-7 7-7s7 3.13 7 7h2c0-4.97-4.03-9-9-9zm1 14h-2v-5h2v5zm1.59-8.58-2.12 2.12c-.36.36-.94.36-1.3 0L9.41 8.42c-.36-.36-.36-.94 0-1.3.36-.36.94-.36 1.3 0l1.29 1.3 1.3-1.3c.36-.36.94-.36 1.3 0 .36.36.36.94 0 1.3z"/></svg>');
            background-size: cover;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
        }
    `);

    console.log("Custom YouTube Cast button styling applied: AirPlay-style icon.");
})();
