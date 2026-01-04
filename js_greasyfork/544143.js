// ==UserScript==
// @name         Rottentomatoes Average Critics Scores
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  Display Critics All and Top Critics average scores on RottenTomatoes
// @match        https://www.rottentomatoes.com/m/*
// @match        https://www.rottentomatoes.com/tv/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/544143/Rottentomatoes%20Average%20Critics%20Scores.user.js
// @updateURL https://update.greasyfork.org/scripts/544143/Rottentomatoes%20Average%20Critics%20Scores.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function extractScore(html, type) {
        const match = html.match(new RegExp(`"${type}":\\{"averageRating":"(\\d+\\.\\d+)"`));
        return match ? match[1] : null;
    }

    function createScoreElement(label, score) {
        const el = document.createElement('div');
        el.style.marginBottom = '6px';
        el.style.fontWeight = 'bold';
        el.style.color = '#000000'; // black text
        el.style.textAlign = 'justify'; // justified alignment
        el.textContent = `${label}: ${score} Out of 10`;
        return el;
    }

    function displayScoreBox(allScore, topScore) {
        if (document.getElementById('rt-critics-combined-box')) return; // avoid duplicate

        const container = document.createElement('div');
        container.id = 'rt-critics-combined-box';
        container.style.background = '#f0f0f0'; // light gray background
        container.style.border = '1px solid #cccccc';
        container.style.padding = '12px 18px';
        container.style.borderRadius = '12px';
        container.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.05)';
        container.style.fontSize = '15px';
        container.style.fontFamily = 'Arial, sans-serif';
        container.style.minWidth = '200px';
        container.style.marginTop = '12px';
        container.style.color = '#000000'; // black text
        container.style.textAlign = 'justify'; // justified alignment

        const title = document.createElement('div');
        title.textContent = 'Critics Average Scores';
        title.style.fontSize = '16px';
        title.style.marginBottom = '10px';
        title.style.fontWeight = 'bold';
        title.style.color = '#000000'; // black text
        title.style.textAlign = 'justify'; // justified alignment
        container.appendChild(title);

        if (allScore) container.appendChild(createScoreElement('All Critics Avg', allScore));
        if (topScore) container.appendChild(createScoreElement('Top Critics Avg', topScore));

        const target = document.querySelector('.no-border.media-scorecard');
        if (target && target.parentNode) {
            target.parentNode.insertBefore(container, target.nextSibling);
        } else {
            document.body.appendChild(container);
        }
    }

    function tryInjectScore() {
        const html = document.documentElement.innerHTML;
        const allScore = extractScore(html, 'criticsAll');
        const topScore = extractScore(html, 'criticsTop');

        if (allScore || topScore) displayScoreBox(allScore, topScore);
    }

    window.addEventListener('load', tryInjectScore);
    const observer = new MutationObserver(tryInjectScore);
    observer.observe(document.body, { childList: true, subtree: true });
})();
