// ==UserScript==
// @license MIT
// @name         Fix Jira right pane width
// @namespace    https://*.atlassian.net/
// @version      0.1
// @description  Sort Jira's right panel layout out
// @author       You
// @match        https://*.atlassian.net/browse/*
// @icon         https://www.google.com/s2/favicons?domain=atlassian.net
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/436025/Fix%20Jira%20right%20pane%20width.user.js
// @updateURL https://update.greasyfork.org/scripts/436025/Fix%20Jira%20right%20pane%20width.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const el = document.getElementById("jira-issue-header-actions").parentElement.parentElement;
    el.style.width = "calc(12px + min(200px, 20%))";
    el.style.paddingRight = "20px";
})();