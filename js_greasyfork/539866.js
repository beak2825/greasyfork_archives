// ==UserScript==
// @name         Hacker News Heatmap Highlighter
// @namespace    http://greasemonkey.net/
// @version      1.4.3
// @description  Highlight HN points and comment count numbers, logarithmically, based on the score
// @author       alex77456
// @match        https://news.ycombinator.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/539866/Hacker%20News%20Heatmap%20Highlighter.user.js
// @updateURL https://update.greasyfork.org/scripts/539866/Hacker%20News%20Heatmap%20Highlighter.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // === CONFIGURABLE COLOR RANGE ===
    const COLOR_MIN = [0, 0, 0];      // RGB for lowest values (black)
    const COLOR_MAX = [139, 0, 0];    // RGB for highest values (dark red)
    const TEXT_COLOR = 'white';
    const PADDING = '1px 3px';
    const BORDER_RADIUS = '3px';

    function parseIntSafe(str) {
        const match = str && str.replace(/\u00a0/g, ' ').match(/\d+/);
        return match ? parseInt(match[0], 10) : 0;
    }

    function interpolateColor(ratio, minColor, maxColor) {
        return `rgb(${
            minColor.map((minVal, i) =>
                Math.round(minVal + ratio * (maxColor[i] - minVal))
            ).join(', ')
        })`;
    }

    function getLogColor(value, min, max) {
        if (value <= 0) return `rgb(${COLOR_MIN.join(',')})`;
        const logVal = Math.log(value);
        const logMin = Math.log(Math.max(min, 1));
        const logMax = Math.log(Math.max(max, 1));
        const ratio = (logVal - logMin) / (logMax - logMin);
        return interpolateColor(Math.min(1, Math.max(0, ratio)), COLOR_MIN, COLOR_MAX);
    }

    function highlightNumberOnly(el, value, min, max) {
        const bg = getLogColor(value, min, max);
        const numMatch = el.textContent.match(/^(\d+)/);
        if (numMatch) {
            const numSpan = document.createElement('span');
            numSpan.textContent = numMatch[1];
            numSpan.style.backgroundColor = bg;
            numSpan.style.color = TEXT_COLOR;
            numSpan.style.padding = PADDING;
            numSpan.style.borderRadius = BORDER_RADIUS;
            el.innerHTML = el.innerHTML.replace(numMatch[1], numSpan.outerHTML);
        }
    }

    const scoreElements = Array.from(document.querySelectorAll('.score'));
    const commentElements = Array.from(document.querySelectorAll('a'))
        .filter(el => el.textContent.includes('comment') && /\d/.test(el.textContent));

    const scores = scoreElements.map(el => parseIntSafe(el.textContent));
    const comments = commentElements.map(el => parseIntSafe(el.textContent));

    const minScore = Math.min(...scores.filter(v => v > 0));
    const maxScore = Math.max(...scores);
    const minComments = Math.min(...comments.filter(v => v > 0));
    const maxComments = Math.max(...comments);

    scoreElements.forEach(el => {
        const score = parseIntSafe(el.textContent);
        highlightNumberOnly(el, score, minScore, maxScore);
    });

    commentElements.forEach(el => {
        const count = parseIntSafe(el.textContent);
        highlightNumberOnly(el, count, minComments, maxComments);
    });
})();
