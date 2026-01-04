// ==UserScript==
// @name         FanFiction.net Word Counter
// @namespace    https://github.com/erasels
// @version      1.0
// @description  Display word count for the current chapter on FanFiction.net
// @author       erasels
// @match        https://www.fanfiction.net/s/*
// @icon         https://www.fanfiction.net/favicon.ico
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/497110/FanFictionnet%20Word%20Counter.user.js
// @updateURL https://update.greasyfork.org/scripts/497110/FanFictionnet%20Word%20Counter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to count words in the specified element
    function countWords(element) {
        var text = element.innerText || element.textContent;
        return text.split(/\s+/).filter(function(n) { return n != '' }).length;
    }

    // Find the element that contains the story text
    var storyTextElement = document.getElementById('storytext');
    if (storyTextElement) {
        var wordCount = countWords(storyTextElement);

        // Create a new div to display the word count
        var wordCountDiv = document.createElement('div');
        wordCountDiv.setAttribute('style', 'margin-top: 0px; text-align: center; color: black; font-weight: bold;');
        wordCountDiv.innerText = 'Chapter Word Count: ' + wordCount;

        // Find the profile_top div and insert the word count div
        var profileTopElement = document.getElementById('profile_top');
        if (profileTopElement) {
            // Inserts the word count div at the end of the profile_top element
            profileTopElement.appendChild(wordCountDiv);
        }
    }
})();