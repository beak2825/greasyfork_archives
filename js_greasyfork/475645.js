// ==UserScript==
// @name         Hacker News Simple Theme
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  none
// @author       Luzemin
// @match        https://news.ycombinator.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ycombinator.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/475645/Hacker%20News%20Simple%20Theme.user.js
// @updateURL https://update.greasyfork.org/scripts/475645/Hacker%20News%20Simple%20Theme.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var styles = `
    #hnmain{background:none;}
    .athing td{padding-top:8px;}
    .spacer{height:0;}
    `
    var styleSheet = document.createElement("style")
    styleSheet.innerText = styles
    document.head.appendChild(styleSheet)
})();