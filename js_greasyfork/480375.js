// ==UserScript==
// @name         Atlassian zoom out board
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Zoom out board of atlassian
// @license      MIT
// @author       IgnaV
// @match        https://talana.atlassian.net/jira/software/c/projects/*/boards/*
// @icon         https://www.atlassian.com/favicon.ico
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/480375/Atlassian%20zoom%20out%20board.user.js
// @updateURL https://update.greasyfork.org/scripts/480375/Atlassian%20zoom%20out%20board.meta.js
// ==/UserScript==


(function() {
    'use strict';

    GM_addStyle(`
        #ak-main-content [data-test-id="software-board.board-area"] { zoom: 90%; }
    `);
})();