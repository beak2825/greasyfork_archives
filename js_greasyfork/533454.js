// ==UserScript==
// @name        Hacker News Horizon Dark Mode
// @version     1.2
// @description A dark theme for Hacker News based on `Doom Horizon`
// @author      szczepan.org
// @match       https://news.ycombinator.com/*
// @grant        GM_addStyle
// @license MIT
// @namespace https://greasyfork.org/users/1460251
// @downloadURL https://update.greasyfork.org/scripts/533454/Hacker%20News%20Horizon%20Dark%20Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/533454/Hacker%20News%20Horizon%20Dark%20Mode.meta.js
// ==/UserScript==

(function () {
  "use strict";

  GM_addStyle(`
@media (prefers-color-scheme: dark) {

        body {
            background-color: #23262E !important; /* Slightly lighter background */
            color: #E0E0E0 !important;
        }

        .title {
            color: #FFFFFF !important; /* Brighter title */
        }
        a {
           color: #E56B6F !important; /* More vibrant red */
           :visited {
              color: #C2908E !important;
           }
        }

        .storylink, .sitestr, .subtext a, .hnuser, .age a {
            color: #FF8B61 !important; /* Brighter orange */
        }

        .comment {
            color: #C18FFF !important; /* Lighter purple */
        }

        .commtext {
            color: #DCDCDC !important; /* Slightly lighter text */
        }

        .comment-tree tr.athing.comtr {
            background-color: #2A2D36 !important; /* Lighter comment background */
        }

        .comment-tree tr.athing.comtr:hover {
            background-color: #343744 !important; /* Lighter hover background */
        }

        .fatitem {
            background-color: #2A2D36 !important; /* Lighter item background */
        }

        .pagetop {
            color: #66D9EF !important; /* Brighter cyan */
        }

        .pagetop a {
            color: #89CFF0 !important; /* Lighter blue */
        }

        .score {
            color: #EEEEEE !important; /* Lighter score */
        }

        table#hnmain {
            background-color: #2A2D36 !important; /* Lighter table background */
        }

        td.title {
            color: #FFFFFF !important; /* Brighter title */
        }

        td.subtext {
            color: #A3A8B1 !important; /* Lighter subtext */
        }

        .default {
            color: #EEEEEE !important; /* Lighter default text */
        }
        a:link, .titleline {
            color: #F0F4F8;
        }

        input {
            background-color: #3E4451 !important; /* Lighter input background */
            color: #F0F4F8 !important; /* Lighter input text */
            border: 1px solid #5E6572 !important; /* Lighter border */
        }

        textarea {
            background-color: #3E4451 !important; /* Lighter textarea background */
            color: #F0F4F8 !important; /* Lighter textarea text */
            border: 1px solid #5E6572 !important; /* Lighter border */
        }

        /* Top navigation bar */
        .topbar {
            background-color: #3E4451 !important; /* Lighter topbar */
        }

        /* Links that have been visited */
        .storylink:visited {
            color: #F5CBA1 !important;
        }

        /* Rank numbers */
        .rank {
            color: #A3A8B1 !important; /* Lighter rank */
        }

        /* Footer */
        .yclinks {
            color: #A3A8B1 !important; /* Lighter footer */
        }

        .yclinks a {
            color: #89CFF0 !important; /* Lighter footer links */
        }


}
`);
})();
