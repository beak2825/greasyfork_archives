// ==UserScript==
// @name         Bionic Readd Highlighter (English Only)
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Highlight the first three letters of each word in English on a webpage.
// @author       iamnobody
// @match        *://*/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/488390/Bionic%20Readd%20Highlighter%20%28English%20Only%29.user.js
// @updateURL https://update.greasyfork.org/scripts/488390/Bionic%20Readd%20Highlighter%20%28English%20Only%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var highlighted = false;
    var currentDomain = window.location.hostname;

    // Function to highlight words
    function highlightWords() {
        var textNodes = document.createTreeWalker(
            document.body,
            NodeFilter.SHOW_TEXT,
            null,
            false
        );

        while(textNodes.nextNode()) {
            var node = textNodes.currentNode;
            var text = node.nodeValue;

            // Regex to match words
            var wordRegex = /\b\w+\b/g;
            var match;

            // Iterate through each word in the text node
            while ((match = wordRegex.exec(text)) !== null) {
                var word = match[0];
                var highlightedWord = word.substring(0, 3);
                var remainingWord = word.substring(3);
                var replacement = '<span style="background-color: yellow;">' + highlightedWord + '</span>' + remainingWord;
                text = text.replace(word, replacement);
            }

            // Update the text node with highlighted words
            if (text !== node.nodeValue) {
                var spanNode = document.createElement('span');
                spanNode.innerHTML = text;
                node.parentNode.replaceChild(spanNode, node);
            }
        }

        highlighted = true;
    }

    // Function to remove highlighting
    function removeHighlighting() {
        var highlightedWords = document.querySelectorAll('span[style="background-color: yellow;"]');
        if (highlightedWords.length > 0) {
            highlightedWords.forEach(function(word) {
                word.outerHTML = word.innerHTML;
            });
        }

        highlighted = false;
    }

    // Floating button to toggle feature
    var floatingButton = document.createElement('div');
    floatingButton.innerHTML = '<img src="https://play-lh.googleusercontent.com/TI8o079rVoxaQ5ZeDcLfQRlS7MQrwNbpGh4-WdOYC2lYIZk1jAhABtABLU_kl2aReCSl" style="width: 50px; height: 50px; position: fixed; bottom: 20px; right: 20px; cursor: pointer;">';
    document.body.appendChild(floatingButton);

    floatingButton.addEventListener('click', function() {
        if (!highlighted) {
            highlightWords();
        } else {
            removeHighlighting();
        }
    });
})();
