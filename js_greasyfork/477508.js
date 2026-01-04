// ==UserScript==
// @name         Meetup Tweaks
// @namespace    https://greasyfork.org/en/users/8615-joeytwiddle
// @version      0.0.1
// @license      ISC
// @description  Make meetup.com easier to use.
// @author       joeytwiddle
// @match        https://www.meetup.com/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/477508/Meetup%20Tweaks.user.js
// @updateURL https://update.greasyfork.org/scripts/477508/Meetup%20Tweaks.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Make the (Preview) button green instead of white, so I hit that instead of accidentally hitting (Publish) too early.
    GM_addStyle(`
        button.schedule-preview-btn {
            background: #7b7;
            border-color: #7b7;
            color: white;
        }
        button.schedule-preview-btn:hover {
            background: #7b7d;
            border-color: #7b7d;
        }
    `);
})();
