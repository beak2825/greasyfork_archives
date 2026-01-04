// ==UserScript==
// @license      MIT
// @name         JIRA right-col collapse btn
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  add right-menu collapse
// @author       Mason
// @match        *.atlassian.net/browse/*
// @icon         https://www.google.com/s2/favicons?domain=atlassian.net
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/436026/JIRA%20right-col%20collapse%20btn.user.js
// @updateURL https://update.greasyfork.org/scripts/436026/JIRA%20right-col%20collapse%20btn.meta.js
// ==/UserScript==
(function() {
    'use strict';
    const rightCol = document.getElementById('jira-issue-header-actions').parentElement.parentElement;
    const issueCol = rightCol.previousElementSibling;
    issueCol.style.position = "relative";

    const toggle = document.createElement('button');
    toggle.innerHTML = ">";
    toggle.style.position = "absolute";
    toggle.style.top = 0;
    toggle.style.right = 0;
    toggle.style.width = "48px";
    toggle.style.height = "48px";
    toggle.style.zIndex = 100;
    toggle.onclick = () => {
        if (toggle.innerHTML === "&gt;") {
            toggle.innerHTML = "<";
            rightCol.style.display = "none";
        } else {
            toggle.innerHTML = ">";
            rightCol.style.display = "initial";
        }
    };
    issueCol.append(toggle);
})();