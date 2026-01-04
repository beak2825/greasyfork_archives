// ==UserScript==
// @name         Close Jira Zoom Warning Toast
// @namespace    http://schuppentier.org/
// @version      0.1
// @description  Atlassian builds stupid warnings and is unwilling to fix them. This script blocks the Zoom Warning alert when viewing Jira workflows on any modern OS.
// @author       Dennis Stengele
// @match        https://*.atlassian.net/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=atlassian.net
// @require      https://bowercdn.net/c/arrive-2.4.1/minified/arrive.min.js
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/465850/Close%20Jira%20Zoom%20Warning%20Toast.user.js
// @updateURL https://update.greasyfork.org/scripts/465850/Close%20Jira%20Zoom%20Warning%20Toast.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.arrive("div.aui-message", function() {
        const textContent = this.textContent;
        const searchString = "The workflow designer may not behave correctly at your current browser zoom level";

        if (textContent.startsWith(searchString)) {
            this.remove();
            console.log("Removed Bullshit Zoom Level Toast");
        }
    });
})();