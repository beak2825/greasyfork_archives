// ==UserScript==
// @name         Hacker News - Hide your own karma
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  Hide your own karma in the top right corner (to avoid karma obsession)
// @author       Giovanni Tirloni
// @match        https://news.ycombinator.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/28820/Hacker%20News%20-%20Hide%20your%20own%20karma.user.js
// @updateURL https://update.greasyfork.org/scripts/28820/Hacker%20News%20-%20Hide%20your%20own%20karma.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.getElementById("karma").remove();
})();