// ==UserScript==
// @name         Shikimori Better Rating
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Заменяет рейтинг на Shikimori.one с учётом большинства
// @author       eretly
// @match        https://shikimori.one/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/546247/Shikimori%20Better%20Rating.user.js
// @updateURL https://update.greasyfork.org/scripts/546247/Shikimori%20Better%20Rating.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function parseStats() {
        const statsEl = document.querySelector('#rates_scores_stats');
        if (!statsEl) return null;
        const statsData = statsEl.getAttribute('data-stats');
        if (!statsData) return null;
        try {
            return JSON.parse(statsData).map(([score, count]) => ({
                score: parseInt(score, 10),
                count: parseInt(count, 10)
            }));
        } catch (e) {
            return null;
        }
    }


    function calcWeightedByMajority(stats) {
        let totalVotes = 0;
        stats.forEach(s => totalVotes += s.count);

        const minScore = Math.min(...stats.map(s => s.score));
        const maxScore = Math.max(...stats.map(s => s.score));
        const midScore = (minScore + maxScore) / 2;

        // Находим самую популярную оценку
        const maxVotes = Math.max(...stats.map(s => s.count));
        const mostPopularScore = stats.find(s => s.count === maxVotes).score;

        // Считаем голоса выше и ниже самой популярной оценки
        let votesAbove = 0;
        let votesBelow = 0;

        stats.forEach(({score, count}) => {
            if (score > mostPopularScore) votesAbove += count;
            else if (score < mostPopularScore) votesBelow += count;
        });

        // Определяем перевес
        const scoresAbove = stats.filter(s => s.score > mostPopularScore).length;
        const scoresBelow = stats.filter(s => s.score < mostPopularScore).length;

        let favorHigher = false;
        let boostPercent = 0;

        if (votesAbove + votesBelow > 0) {
            if (votesAbove > votesBelow || scoresAbove === 0) {
                favorHigher = true;
                boostPercent = scoresBelow * 0.1;
            } else if (votesBelow > votesAbove || scoresBelow === 0) {
                favorHigher = false;
                boostPercent = scoresAbove * 0.1;
            }
        }

        let weightedSum = 0;
        let weightTotal = 0;
        const alpha = 1.2;

        stats.forEach(({score, count}) => {
            const p = count / totalVotes;
            let weight = Math.pow(p, alpha);

            // Буст самой популярной оценке
            if (count === maxVotes) {
                weight *= 1.0;
            }

            // Применяем буст к перевесившей стороне
            if (favorHigher && score > mostPopularScore) {
                weight *= (1.0 + boostPercent);
            } else if (!favorHigher && score < mostPopularScore) {
                weight *= (1.0 + boostPercent);
            }

            // Буст от края шкалы
            const distance = Math.abs(score - midScore);
            const maxDistance = midScore - minScore; // половина диапазона
            const edgeFactor = distance / maxDistance; // от 0 (середина) до 1 (край)
            const boostFromEdge = edgeFactor * 0.7;   // максимум +70%
            weight *= (1.0 + boostFromEdge);

            weightedSum += score * weight;
            weightTotal += weight;
        });

        return weightedSum / weightTotal;
    }


    function injectRating() {
        const stats = parseStats();
        if (!stats) return;

        const majority = calcWeightedByMajority(stats);
        const aggBlock = document.querySelector('div.block[itemprop="aggregateRating"] .b-rate');
        if (!aggBlock) return;

        const scoreTexts = {
            1: "Хуже некуда",
            2: "Ужасно",
            3: "Очень плохо",
            4: "Плохо",
            5: "Более-менее",
            6: "Нормально",
            7: "Хорошо",
            8: "Отлично",
            9: "Великолепно",
            10: "Эпик вин!"
        };

        const scoreValueEl = aggBlock.querySelector('.score-value');
        if (scoreValueEl) scoreValueEl.textContent = majority.toFixed(2);

        const roundedScoreText = Math.floor(majority);
        const scoreNoticeEl = aggBlock.querySelector('.score-notice');
        if (scoreNoticeEl) scoreNoticeEl.textContent = scoreTexts[roundedScoreText] || "";

        const starScore = Math.floor(majority + 0.5);
        const starsEl = aggBlock.querySelector('.stars.score');
        if (starsEl) {
            starsEl.className = starsEl.className.replace(/score-\d+/, '');
            starsEl.classList.add('stars', 'score', `score-${starScore}`);
        }
    }

    let currentUrl = window.location.href;

    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;

    history.pushState = function() {
        originalPushState.apply(history, arguments);
        setTimeout(injectRating, 1000);
    };

    history.replaceState = function() {
        originalReplaceState.apply(history, arguments);
        setTimeout(injectRating, 1000);
    };

    window.addEventListener('popstate', function() {
        setTimeout(injectRating, 1000);
    });

    setTimeout(injectRating, 1);
})();