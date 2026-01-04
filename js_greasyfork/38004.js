// ==UserScript==
// @name         JIRA issue width
// @namespace    http://tampermonkey.net/
// @version      0.12
// @description  try to take over the world!
// @author       You
// @match        https://originlab.jira.com/browse/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/38004/JIRA%20issue%20width.user.js
// @updateURL https://update.greasyfork.org/scripts/38004/JIRA%20issue%20width.meta.js
// ==/UserScript==

(function() {
    'use strict';

     // Your code here...
    var open_issue_div = document.getElementById('customfield_10044-val');
    var close_issue_div = document.getElementById('customfield_10045-val');

    if (open_issue_div)
        open_issue_div.setAttribute("style", "max-width:100%;");
    if (close_issue_div)
        close_issue_div.setAttribute("style", "max-width:100%;");
})();
