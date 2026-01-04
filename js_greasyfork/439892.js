// ==UserScript==
// @name         Calc score on page
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Puts lower bound of Wilson score on RYM release pages
// @author       jermrellum
// @match        https://rateyourmusic.com/release/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/439892/Calc%20score%20on%20page.user.js
// @updateURL https://update.greasyfork.org/scripts/439892/Calc%20score%20on%20page.meta.js
// ==/UserScript==

function getScore(rating, n)
{
    var pos = rating / 5 * n;
    if (n == 0)
    {
        return 0;
    }
    var z = 3;
    return ((pos / n + z * z / (2 * n) - z * Math.sqrt((pos / n * (1 - pos / n) + z * z / (4 * n)) / n)) / (1 + z * z / n)) * 5;
}

(function() {
    'use strict';

    var rawscore = parseFloat(document.getElementsByClassName("avg_rating")[0].innerText);
    var num_ratings = parseInt(document.getElementsByClassName("num_ratings")[0].children[0].innerText.replace(",",""));
    var cScore = getScore(rawscore, num_ratings);

    document.getElementsByClassName("num_ratings")[0]. innerHTML += " (" + cScore.toFixed(4) + ")";
})();