// ==UserScript==
// @name         Steam Review Other lang Calculation
// @name:zh-CN   Steam评测其他语言好评率计算
// @namespace    https://controlnet.space/
// @version      2025-02-17
// @description  Calculate steam review positive rate for other langauges.
// @description:zh-CN 计算steam消费者评测中其他语言的好评率。
// @author       ControlNet
// @match        https://store.steampowered.com/app/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        none
// @license      agpl-3.0
// @downloadURL https://update.greasyfork.org/scripts/490957/Steam%20Review%20Other%20lang%20Calculation.user.js
// @updateURL https://update.greasyfork.org/scripts/490957/Steam%20Review%20Other%20lang%20Calculation.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Ensure the script only runs on Chinese language pages
    if (document.documentElement.lang !== "zh-cn") {
        return;
    }

    const langReviewContainer = document.querySelector("div.reviews_info_ctn > div.user_reviews_filter_score");
    if (!langReviewContainer) {
        console.error("Language review container not found.");
        return;
    }

    let domNodeInserted = false;

    const processReviews = () => {
        if (domNodeInserted) return;
        domNodeInserted = true;

        const reviewScores = [];
        const pattern = /此游戏的 ([\d,]+) 篇用户评测中有 (\d+)% 为好评。/;

        document.querySelectorAll("span.game_review_summary").forEach(node => {
            const tooltip = node.getAttribute("data-tooltip-html");
            if (!tooltip) return;

            const match = tooltip.match(pattern);
            if (!match) return;

            reviewScores.push({
                num: parseInt(match[1].replace(/,/g, ""), 10),
                score: parseInt(match[2], 10) / 100
            });
        });

        if (reviewScores.length < 2) {
            console.error("Not enough review data found.");
            return;
        }

        const [overallScore, langScore] = reviewScores;
        const otherLangNum = overallScore.num - langScore.num;
        const otherLangPositive = Math.round(overallScore.num * overallScore.score - langScore.num * langScore.score);
        const otherLangPercent = Math.round((otherLangPositive / otherLangNum) * 100);

        if (isNaN(otherLangPercent)) {
            console.error("Error calculating other language review percentage.");
            return;
        }

        const message = `其他语言的 ${otherLangNum} 用户评测中有 ${otherLangPercent}% 为好评。`;
        langReviewContainer.insertAdjacentHTML("beforeend", `<div>${message}</div>`);
    };

    // Observe changes to the DOM to detect when the review section loads
    const observer = new MutationObserver(processReviews);
    observer.observe(langReviewContainer, { childList: true, subtree: true });
})();
