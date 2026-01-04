// ==UserScript==
// @name         Rename advanced JQL search in Jira menu
// @namespace    http://schuppentier.org/
// @version      1.0
// @description  Atlassian likes to shittify their products. This unshittifies Jira a bit by renaming "Show all issues" back to "Advanced Issue Search" and removing the default JQL.
// @author       Dennis Stengele
// @match        https://*.atlassian.net/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=atlassian.net
// @require      https://bowercdn.net/c/arrive-2.4.1/minified/arrive.min.js
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/474343/Rename%20advanced%20JQL%20search%20in%20Jira%20menu.user.js
// @updateURL https://update.greasyfork.org/scripts/474343/Rename%20advanced%20JQL%20search%20in%20Jira%20menu.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.arrive('a[href="/issues/?jql=created%20%3E%3D%20-30d%20order%20by%20created%20DESC"]', function() {
        // Replace default JQL search
        this.href = "/issues/?jql=";

        // Remove all event handlers that still use the default JQL
        this.outerHTML = this.outerHTML;

        // Rename back to "Advanced issue search"
        const elem = document.querySelectorAll('a[href="/issues/?jql="]')[0].querySelectorAll('span > span > span')[0];
        elem.innerHTML = "Advanced issue search";
    });
})();