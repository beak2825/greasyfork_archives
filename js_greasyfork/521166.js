// ==UserScript==
// @name         Hacker News Points & Comments Highlighter
// @namespace    http://tampermonkey.net/
// @icon         https://news.ycombinator.com/favicon.ico
// @version      0.1.1
// @description  Highlight points and comments on Hacker News with different colors based on their values
// @author       RoCry
// @match        https://news.ycombinator.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/521166/Hacker%20News%20Points%20%20Comments%20Highlighter.user.js
// @updateURL https://update.greasyfork.org/scripts/521166/Hacker%20News%20Points%20%20Comments%20Highlighter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Color functions
    function getPointsColor(points) {
        if (points >= 500) return '#FF4500';      // Bright red-orange
        if (points >= 250) return '#FF6B21';      // Orange
        if (points >= 100) return '#FF8C42';      // Light orange
        if (points >= 50)  return '#FFA563';      // Pale orange
        return '#FFB584';                         // Very pale orange
    }

    function getCommentsColor(comments) {
        if (comments >= 300) return '#1E88E5';    // Bright blue
        if (comments >= 200) return '#42A5F5';    // Blue
        if (comments >= 100) return '#64B5F6';    // Light blue
        if (comments >= 50)  return '#90CAF9';    // Pale blue
        return '#BBDEFB';                         // Very pale blue
    }

    // Highlight points
    document.querySelectorAll('.score').forEach(score => {
        const points = parseInt(score.innerText);
        if (!isNaN(points)) {
            score.style.color = getPointsColor(points);
            score.style.fontWeight = 'bold';
        }
    });

    // Highlight comments
    document.querySelectorAll('a').forEach(link => {
        if (link.href.includes('item?id=') && link.innerText.includes('comment')) {
            const comments = parseInt(link.innerText);
            if (!isNaN(comments)) {
                link.style.color = getCommentsColor(comments);
                link.style.fontWeight = 'bold';
            }
        }
    });
})();