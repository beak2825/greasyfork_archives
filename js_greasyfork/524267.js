// ==UserScript==
// @name         Full width OSRS Wiki
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Hides the left sidebar on OldSchool RuneScape Wiki for screen widths under 768px
// @match        https://oldschool.runescape.wiki/*
// @grant        GM_addStyle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/524267/Full%20width%20OSRS%20Wiki.user.js
// @updateURL https://update.greasyfork.org/scripts/524267/Full%20width%20OSRS%20Wiki.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle(`
        @media (max-width: 768px) {
            /* Hide the left sidebar */
            #mw-navigation {
                display: none !important;
            }
            /* Expand the main content to use full width */
            #mw-page-base,
            #mw-head-base,
            #content,
            #mw-head,
            #p-personal {
                margin-left: 0 !important;
            }
        }
    `);
})();
