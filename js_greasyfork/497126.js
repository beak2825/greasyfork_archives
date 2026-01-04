// ==UserScript==
// @name         List Tags
// @namespace    https://github.com/x3ric
// @match        https://*/*
// @grant        GM_registerMenuCommand
// @version      1.0
// @author       x3ric
// @license      MIT
// @description  Retrieves all HTML tags used on a webpage
// @downloadURL https://update.greasyfork.org/scripts/497126/List%20Tags.user.js
// @updateURL https://update.greasyfork.org/scripts/497126/List%20Tags.meta.js
// ==/UserScript==
(function() {
    'use strict';
    function getAllTags() {
        var elements = document.querySelectorAll('*');
        var tagCounts = {};
        elements.forEach(function(element) {
            var tagName = element.tagName.toLowerCase();
            if (tagCounts[tagName]) {
                tagCounts[tagName]++;
            } else {
                tagCounts[tagName] = 1;
            }
        });
        return tagCounts;
    }
    function displayTagCounts() {
        var tagCounts = getAllTags();
        console.log("Tag Counts:");
        console.log(tagCounts);
        alert("Tag Counts:\n" + JSON.stringify(tagCounts, null, 2));
    }
    GM_registerMenuCommand('Show', displayTagCounts);
})();
