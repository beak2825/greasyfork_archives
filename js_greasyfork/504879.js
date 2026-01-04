// ==UserScript==
// @name         Simple darkmode for hckrnews & Hacker News
// @namespace    http://tampermonkey.net/
// @version      2024-08-25
// @description  Dark mode css for hckrnews.com and https://news.ycombinator.com/
// @author       Henrique Moraes
// @match        https://hckrnews.com/*
// @match        https://news.ycombinator.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=hckrnews.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/504879/Simple%20darkmode%20for%20hckrnews%20%20Hacker%20News.user.js
// @updateURL https://update.greasyfork.org/scripts/504879/Simple%20darkmode%20for%20hckrnews%20%20Hacker%20News.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const style = document.createElement('style');
    style.textContent = `

/* hckrnews.com >>> */
body {
  background-color: #121212 !important;
  color: #e0e0e0 !important;
}
a {
  color: #e5e5e5 !important;
}
a:visited {
  color: #696969 !important;
}
.title, .subtitle, .other-elements {
  background-color: #1e1e1e !important;
  color: #e0e0e0 !important;
}
.entries a:hover {
    text-decoration: none;
    background-color: #ffe95b0a;
}
/* to clip long urls */
.span15 {
    overflow: hidden;
    text-overflow: ellipsis;
}


/* hn.ycombinator.com >>> */
table#hnmain {
    background-color: #121212;
    color: white;
}
textarea {
    background-color: #0e0e0e;
    color: #e5e5e5;
}
.toptext {
    color: #bcbcbc;
}
.commtext.c00 {
    color: #cdcdcd;
}
td.default>div:first-child {
    background-color: #ff660014;
}
.pagetop a {
    color: white !important;
}
.titleline a {
    color: white !important;
}
/* thread indentation coloring */
td.ind {
    border-right: 5px #ff66003d solid;
    background-color: #ff66000d;
}
td.ind[indent="0"] {
    border-right: 3px #ff6600 solid !important;
    background-color:#ff6600;
}

    `;
    document.head.appendChild(style);
})();