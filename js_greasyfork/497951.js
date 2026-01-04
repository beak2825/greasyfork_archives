// ==UserScript==
// @name         Shortened large numbers within main menu
// @namespace    lore
// @version      1
// @license      MIT
// @description  automatically shorten large leaderboard scores and total score + score to next rank to compact forms like/similar to '1.8B' or '700k' for easier reading. Ideal for optimizing/making viewing better.
// @author       lore
// @match        *://*sploop.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/497951/Shortened%20large%20numbers%20within%20main%20menu.user.js
// @updateURL https://update.greasyfork.org/scripts/497951/Shortened%20large%20numbers%20within%20main%20menu.meta.js
// ==/UserScript==

(function() {
  'use strict';

  function shortenNumber(number) {
    if (number >= 1000 && number < 1000000) {
      return (number / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
    } else if (number >= 1000000 && number < 1000000000) {
      return (number / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
    } else if (number >= 1000000000) {
      return (number / 1000000000).toFixed(1).replace(/\.0$/, '') + 'B';
    } else {
      return number;
    }
  }

  function updateScores() {
    updateLeaderboard('ranking-ranks-container');
    updateLeaderboard('ranking-rank-container');
    updateLeaderboard('ranks-container');

    updateSingleScore('total-score');
    updateSingleScore('score-left-value');
  }

  function updateLeaderboard(containerId) {
    const scores = document.querySelectorAll(`#${containerId} .ranking-score`);
    scores.forEach(updateScoreElement);
  }

  function updateSingleScore(elementId) {
    const scoreElement = document.getElementById(elementId);
    if (scoreElement) {
      updateScoreElement(scoreElement);
    }
  }

  function updateScoreElement(scoreElement) {
    const scoreText = scoreElement.textContent.trim();
    if (!scoreElement.dataset.shortened && !isNaN(scoreText)) {
      const score = parseInt(scoreText, 10);
      if (score >= 1000) {
        scoreElement.textContent = shortenNumber(score);
        scoreElement.dataset.shortened = true;
      }
    }
  }

  function isElementVisible(el) {
    const rect = el.getBoundingClientRect();
    return rect.top >= 0 && rect.bottom <= (window.innerHeight || document.documentElement.clientHeight);
  }

  setInterval(() => {
    if (isElementVisible(document.body)) {
      updateScores();
    }
  }, 30);
})();

