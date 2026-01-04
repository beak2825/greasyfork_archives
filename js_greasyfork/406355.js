// ==UserScript==
// @name         jira-use-whole-page-width
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Make jira use whole width to make comments wider on issue view
// @author       You
// @match        https://*.atlassian.net/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/406355/jira-use-whole-page-width.user.js
// @updateURL https://update.greasyfork.org/scripts/406355/jira-use-whole-page-width.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.querySelectorAll('[data-testid="Content"]')[0].childNodes[0].className = "";
})();
