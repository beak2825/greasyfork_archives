// ==UserScript==
// @name         Stable Diffusion simple string cleaner
// @description  Replace Selected Text by remove duplciated string
// @namespace    http://tampermonkey.net/
// @version      0.1
// @license      MIT
// @match        *://*/*
// @grant        GM_openInTab
// @icon         https://www.iconarchive.com/download/i113885/fatcow/farm-fresh/clear-formatting.ico
// @include      *
// @exclude      file://*
// @grant        GM_openInTab
// @run-at       context-menu
// @downloadURL https://update.greasyfork.org/scripts/479498/Stable%20Diffusion%20simple%20string%20cleaner.user.js
// @updateURL https://update.greasyfork.org/scripts/479498/Stable%20Diffusion%20simple%20string%20cleaner.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM_openInTab("*://*/*");
    // Define the removeDuplicatedString function
    function removeDuplicatedString(selectedText) {
        // Step 1: Remove everything between the characters ':' and ')'
        var newText = selectedText.replace(/:\S+\)/g, ':)');

        // Step 2: Remove all occurrences of the characters ':' and ')' and '('
        newText = newText.replace(/[:\)\(]/g, '');

        // Step 3: Remove duplicated spaces and commas
        newText = newText.replace(/ +/g, ' ').replace(/,+/g, ',');

        // Step 4: Remove duplicate keywords separated by commas
        var keywords = newText.split(',');
        var uniqueKeywords = [...new Set(keywords)];
        newText = uniqueKeywords.join(',');

        // Step 5: Replace all occurrences of the string ' ,' with ','
        newText = newText.replace(/ ,/g, ',');

        // Step 6: Replace all occurrences of ',' with ', ' only if there is not already a space after the comma
        newText = newText.replace(/,(?!\s)/g, ', ');

        // Step 7: Replace all occurrences of the string ', ,' with ','
        newText = newText.replace(/, ,/g, ',');

        return newText;
    }

    // Get the selected text
    var selectedText = window.getSelection().toString();

    // Call the removeDuplicatedString function to get the new text
    var newText = removeDuplicatedString(selectedText);

    // Insert the new text in place of the selected text
    document.execCommand('insertText', false, newText);

})();
