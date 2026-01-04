// ==UserScript==
// @name         Arcaea Online Enhancer
// @namespace    https://github.com/saicaca
// @version      1.1.0
// @description  Show the rating of each play and the average rating on the Arcaea Online page.
// @author       saicaca
// @match        https://arcaea.lowiro.com/*
// @homepageURL  https://github.com/saicaca/arcaea-online-enhancer
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/521374/Arcaea%20Online%20Enhancer.user.js
// @updateURL https://update.greasyfork.org/scripts/521374/Arcaea%20Online%20Enhancer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const queryAPI = '/score/rating/me';

    const originalOpen = XMLHttpRequest.prototype.open;
    const originalSend = XMLHttpRequest.prototype.send;
    XMLHttpRequest.prototype.open = function(method, url, ...rest) {
        this._url = url;
        return originalOpen.call(this, method, url, ...rest);
    };
    XMLHttpRequest.prototype.send = function(...args) {
        this.addEventListener('load', function() {
            if (this._url.includes(queryAPI)) {
                const data = JSON.parse(this.responseText);
                modify(data);
            }
        });
        return originalSend.apply(this, args);
    };

    function modify(data) {
        const cardListEl = document.querySelector('.card-list');
        const cardEls = Array.from(cardListEl.children).filter(child =>
            child.classList.contains('card')
        );

        // Calculate the average rating of the best 30 scores and the best recent scores

        const best30Scores = data.value.best_rated_scores;
        const bestRecentScores = data.value.recent_rated_scores;

        const best30Avg = best30Scores.length === 0 ? 0 : best30Scores.reduce((sum, score) => sum + score.rating, 0) / best30Scores.length;
        const bestRecentAvg = bestRecentScores.length === 0 ? 0 : bestRecentScores.reduce((sum, score) => sum + score.rating, 0) / bestRecentScores.length;

        cardListEl.querySelector('.line-dark').insertAdjacentHTML('afterend', `
            <div class="aoe-info-card">
            <div>
                <div>Best 30 Avg.</div>
                <div class="aoe-rating-text">${best30Avg.toFixed(3)}</div>
            </div>
            <span>
                <div>Best Recent Avg.</div>
                <div class="aoe-rating-text">${bestRecentAvg.toFixed(3)}</div>
            </span>
            </div>
        `);

        // Add the rating of each play and chart constants

        const scores = [...best30Scores, ...bestRecentScores];

        for (let i= 0; i < scores.length; i++) {
            let card = cardEls[i];
            const section1 = card.querySelector('.section-1');
            if (section1) {
                section1.insertAdjacentHTML('afterbegin', `
                    <div class="aoe-rating-text">${scores[i].rating.toFixed(3)}</div>
                `);
            }

            const section2 = card.querySelector('.section-2');
            if (section2) {
                let chartConst = 0;
                if (scores[i].score >= 9800000) {
                    chartConst = (scores[i].rating - 1 - (scores[i].score - 9800000) / 200000).toFixed(1);
                } else {
                    chartConst = (scores[i].rating - (scores[i].score - 9500000) / 300000).toFixed(1);
                }

                const constColor = chartConst >= 11 ? '#FF9500' :
                    chartConst >= 10 ? '#E12A55' :
                    chartConst >= 9 ? '#882299' :
                    chartConst >= 8 ? '#2BB36B' :
                        '#1082BE';

                section2.insertAdjacentHTML('beforeend', `
                    <div class="aoe-constant-text" style="color: ${constColor}">${chartConst}</div>
                `);
            }
        }
    }
})();

GM_addStyle(`
    .aoe-info-card {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 24px;
        font-family: Titillium Web;
        font-size: 14px;
    }
    .aoe-rating-text {
        font-weight: bold;
        margin-bottom: 4px;
        font-family: Titillium Web;
        color: #882299;
        background: linear-gradient(to bottom, #882299, #5566AA);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        font-size: 18px;
    }
    .card .section-2 {
        flex-direction: column;
        gap: 4px;
        align-items: center !important;
    }
    .aoe-constant-text {
        font-family: Titillium Web;
        font-weight: bold;
        font-size: 18px;
    }
`);
