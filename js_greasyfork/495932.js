// ==UserScript==
// @name         Inoreader Article Highlighter
// @version      20241028
// @description  Change the background colour of article headers if they are popularity red or orange, or if the score is >100.
// @author       jamesdeluk
// @match        https://www.inoreader.com/*
// @grant        none
// @namespace https://greasyfork.org/users/242246
// @downloadURL https://update.greasyfork.org/scripts/495932/Inoreader%20Article%20Highlighter.user.js
// @updateURL https://update.greasyfork.org/scripts/495932/Inoreader%20Article%20Highlighter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function changeHeaderBackground() {
    var articleHeaders = document.querySelectorAll('.article_header');
    articleHeaders.forEach(header => {
        var scoreSpan = header.querySelector('.popularity_score_span');
        if (scoreSpan) {
            var scoreText = scoreSpan.innerText;
            var score = parseScore(scoreText);
            if (score > 99) {
                header.style.backgroundColor = 'lightblue';
            }
        }
        if (header.querySelector('.text-orange')) {
            header.style.backgroundColor = '#FFDAB9';
        }
        if (header.querySelector('.text-error-color')) {
            header.style.backgroundColor = '#F08080';
        }
    });
    }

    function parseScore(scoreText) {
        var multiplier = 1;
        var score = parseFloat(scoreText);
        if (scoreText.toLowerCase().includes('k')) {
            multiplier = 1000;
        } else if (scoreText.toLowerCase().includes('m')) {
            multiplier = 1000000;
        }
        return score * multiplier;
    }

    window.addEventListener('load', changeHeaderBackground);

    setInterval(changeHeaderBackground, 5000); // Checks every 5 seconds for newly-loaded articles
})();