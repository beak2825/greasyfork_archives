// ==UserScript==
// @name         Auto dark mode HN
// @version      1.0
// @description  Dark mode Hacker News, respecting your system preferences.
// @author       1_player
// @match        https://news.ycombinator.com/*
// @grant        GM_addStyle
// @license      MIT
// @namespace https://greasyfork.org/users/930341
// @downloadURL https://update.greasyfork.org/scripts/447218/Auto%20dark%20mode%20HN.user.js
// @updateURL https://update.greasyfork.org/scripts/447218/Auto%20dark%20mode%20HN.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle(`
@media (prefers-color-scheme: dark) {

  body {
    background-color: black;
  }

  table#hnmain {
    background-color: #333;
  }

  a:link, .c00, .c00 a:link {
    color: #ddd;
  }

  .comhead a:link, .subtext, .subtext a:link, .subtext a:visited {
    color: #999;
  }

  textarea {
    background-color: #444;
    color: white;
  }

  .pagetop a {
    color: #000;
  }
}
`);

})();