// ==UserScript==
// @name        ANT Buffer Size
// @namespace   Violentmonkey Scripts
// @match       https://anthelion.me/*
// @version     1.2 (23/02/2024)
// @author      ANThusiast
// @description ANT Buffer Size Calculator
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/488086/ANT%20Buffer%20Size.user.js
// @updateURL https://update.greasyfork.org/scripts/488086/ANT%20Buffer%20Size.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var targetLiId = 'stats_seeding';
    var targetLiLeechId = 'stats_leeching';
    var requiredRatio = 'stats_required';


    var targetLi = document.getElementById(targetLiId);
    var targetLiLeech = document.getElementById(targetLiLeechId);
    var targetLiRequiredRatio = document.getElementById(requiredRatio);

    if (targetLi) {
        var uploadValue = parseFloat(targetLi.querySelector('.stat.tooltip').textContent);
        var requiredRatioValue = parseFloat(targetLiRequiredRatio.querySelector('.stat.tooltip').textContent);
        var multiplierValue = (1 / requiredRatioValue);
        var bufferValue = (uploadValue * multiplierValue).toFixed(2);
        var bufferLi = document.createElement('li');
        bufferLi.innerHTML = '<a href="https://anthelion.me/wiki.php?action=article&name=ratio">Buffer</a>: <span class="stat tooltip">' + bufferValue + '</span> TiB';
        targetLiLeech.parentNode.insertBefore(bufferLi, targetLiLeech.nextSibling);
    }
})();