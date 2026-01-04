// ==UserScript==
// @name         Atlassian hide column
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Hide column on click
// @license      MIT
// @author       You
// @match        https://rexmas.atlassian.net/jira/software/c/projects/REX/boards/*
// @icon         https://www.atlassian.com/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/451059/Atlassian%20hide%20column.user.js
// @updateURL https://update.greasyfork.org/scripts/451059/Atlassian%20hide%20column.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const removeColumnIssues = (columnIndex) => {
        document.querySelectorAll('#ghx-pool .ghx-swimlane .ghx-columns').forEach((week) => {
            week.querySelectorAll('.ghx-column')[columnIndex].querySelectorAll('.ghx-issue').forEach((issue) => {
                issue.style.display = 'none';
            });
        });
    }
    const addListener = () => {
        document.querySelectorAll('#ghx-column-header-group .ghx-column').forEach((columnHeader, columnHeaderIndex) => {
            columnHeader.addEventListener('click', () => {
                removeColumnIssues(columnHeaderIndex);
            });
        });
    }
    setTimeout(() => {
        addListener();
    }, 1500);

    let lastUrl = location.href;
    new MutationObserver(() => {
        const url = location.href;
        if (url !== lastUrl) {
            lastUrl = url;
            addListener();
        }
    }).observe(document, {subtree: true, childList: true});

})();