// ==UserScript==
// @name         Javdb 优质影片高亮
// @namespace    http://tampermonkey.net/
// @version      1.4.0
// @description  基于评分和播放量数据对 Javdb 的优质影片增加高亮背景色，加快浏览速度
// @author       JHT
// @match        https://javdb.com/*
// @grant        none
// @license      GPLv3
// @downloadURL https://update.greasyfork.org/scripts/499312/Javdb%20%E4%BC%98%E8%B4%A8%E5%BD%B1%E7%89%87%E9%AB%98%E4%BA%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/499312/Javdb%20%E4%BC%98%E8%B4%A8%E5%BD%B1%E7%89%87%E9%AB%98%E4%BA%AE.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to calculate the background color based on score and number of reviews
    function calculateBackgroundColor(score, ratedBy) {
        // Apply a non-linear transformation to the score to reduce high score density
        let scoreTransformed = Math.sqrt(score / 5); // Using square root for non-linear transformation

        // Normalize ratedBy (0 to 100) to a value (0 to 1)
        // Assuming 100 is a high number of reviews, you can adjust this threshold
        let ratedByNormalized = Math.min(ratedBy / 100, 1);

        // Increase the weight of the number of reviews
        let weightedScore = scoreTransformed * ratedByNormalized;

        // Normalize weighted score to (0 to 255)
        let intensity = Math.min(weightedScore * 255, 255);

        // Return the rgba color string
        return `rgba(240, 0, 144, ${intensity / 255})`;
    }

    // Find the movie list div
    const movieListDiv = document.querySelector("body > section > div > div.movie-list.h.cols-4.vcols-8");

    if (movieListDiv) {
        // Get all the item divs
        const items = movieListDiv.querySelectorAll('.item');

        items.forEach(item => {
            // Find the score element
            const scoreElement = item.querySelector('.score .value');
            if (scoreElement) {
                // Extract the score and rated by values
                const scoreText = scoreElement.textContent.trim();
                const scoreMatch = scoreText.match(/([\d.]+)分, 由(\d+)人評價/);

                if (scoreMatch) {
                    const score = parseFloat(scoreMatch[1]);
                    const ratedBy = parseInt(scoreMatch[2], 10);

                    // Calculate the background color
                    const backgroundColor = calculateBackgroundColor(score, ratedBy);

                    // Find the a tag and set the background color
                    const aTag = item.querySelector('a');
                    if (aTag) {
                        aTag.style.backgroundColor = backgroundColor;
                    }
                }
            }
        });
    }
})();