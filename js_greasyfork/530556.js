// ==UserScript==
// @name         TwoStopBits Dark Mode
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  twostopbits.com dark mode userstyle
// @author       Theodric
// @license      WTFPL
// @match        https://twostopbits.com/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/530556/TwoStopBits%20Dark%20Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/530556/TwoStopBits%20Dark%20Mode.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle(`
        body {
            background-color: #121212;
            color: #e0e0e0;
        }
        .topcolor.page-header, .page-footer.topcolor {
            background-color: #1f1f1f;
            color: #ffffff; /* make top header text white */
        }
        #navleft, #navmain, #navright {
            color: #ffffff;
        }
        #navleft a, #navmain a, #navright a {
            color: #ffffff; /* ensure links in header are white */
        }
        #navleft a:hover, #navmain a:hover, #navright a:hover {
            color: #63b8ff; /* add hover effect for links */
        }
        .layout {
            background-color: #121212;
        }
        a {
            color: #1e90ff;
        }
        a:hover {
            color: #63b8ff;
        }
        .items-list-item {
            background-color: #1f1f1f;
            border: 1px solid #2f2f2f;
            margin-bottom: 8px;
            padding: 8px;
        }
        .items-list {
            background-color: #121212;
        }
        .votelinks .votearrow {
            filter: invert(1);
        }
        .comtitle {
            color: #ffffff;
        }
        .comtitle a {
            color: #1e90ff;
        }
        .comtitle a:hover {
            color: #63b8ff;
        }
        .subtext, .sitebit {
            color: #bbbbbb;
        }
        .yclinks a {
            color: #1e90ff;
        }
        .yclinks a:hover {
            color: #63b8ff;
        }
        input[type="text"] {
            background-color: #2b2b2b;
            color: #e0e0e0;
            border: 1px solid #444444;
        }
    `);
})();
