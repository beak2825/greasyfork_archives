// ==UserScript==
// @name        Estimate Individual Reddit Vote Tallies + Show Percentage on Posts
// @namespace   greenwithenvy
// @description Recreates old RES feature which shows individual up/downvotes when possible. Votes are calculated on post score and percentage.
// @include     *.reddit.com/*
// @include     *./reddit.com/user/*/submitted
// @version     7
// @license     MIT
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/527765/Estimate%20Individual%20Reddit%20Vote%20Tallies%20%2B%20Show%20Percentage%20on%20Posts.user.js
// @updateURL https://update.greasyfork.org/scripts/527765/Estimate%20Individual%20Reddit%20Vote%20Tallies%20%2B%20Show%20Percentage%20on%20Posts.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function addCommas(number) {
        return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }

    function estimatePostScoreVotes() {
        document.querySelectorAll('.linkinfo .score').forEach(linkinfoScore => {
            const numberElement = linkinfoScore.querySelector('.number');
            if (!numberElement) return;

            const points = parseInt(numberElement.textContent.replace(/[^0-9]/g, ''), 10);
            const percentageMatch = linkinfoScore.textContent.match(/([0-9]{1,3})\s?%/);
            const percentage = percentageMatch ? parseInt(percentageMatch[1], 10) : 0;

            if (points !== 50 && percentage !== 50) {
                const upvotes = Math.round(points * percentage / (2 * percentage - 100));
                const downvotes = upvotes - points;
                const totalVotes = upvotes + downvotes;

                const css = `
                    .linkinfo .upvotes { font-size: 80%; color: orangered; margin-left: 5px; }
                    .linkinfo .downvotes { font-size: 80%; color: #5f99cf; margin-left: 5px; }
                    .linkinfo .totalvotes { font-size: 80%; margin-left: 5px; }
                `;

                const style = document.createElement('style');
                style.innerHTML = css;
                document.head.appendChild(style);

                linkinfoScore.insertAdjacentHTML('afterend', `
                    <span class="upvotes"><span class="number">${addCommas(upvotes)}</span> <span class="word">${upvotes > 1 ? 'upvotes' : 'upvote'}</span></span>
                    <span class="downvotes"><span class="number">${addCommas(downvotes)}</span> <span class="word">${downvotes > 1 ? 'downvotes' : 'downvote'}</span></span>
                    <span class="totalvotes"><span class="number">${addCommas(totalVotes)}</span> <span class="word">${totalVotes > 1 ? 'votes' : 'vote'}</span></span>
                `);
            }
        });
    }

    async function addUpvoteDownvoteInfo() {
        const linkListing = document.querySelector(".linklisting") || document.querySelector(".Post")?.parentElement;
        if (!linkListing) return;

        const linkDivs = linkListing.getElementsByClassName("link");

        const promises = Array.from(linkDivs).map(async (linkDiv) => {
            const commentsLink = linkDiv.querySelector(".comments");
            if (!commentsLink) return;

            const commentsPage = await httpGet(`${commentsLink.href}?limit=1&depth=1`);

            const scoreSection = /<div class=(\"|\')score(\"|\')[\s\S]*?<\/div>/.exec(commentsPage);
            if (!scoreSection) return;

            const scoreMatch = /<span class=(\"|\')number(\"|\')>([\d\,\.]*)<\/span>/.exec(scoreSection[0]);
            if (!scoreMatch) return;

            const score = parseInt(scoreMatch[3].replace(',', '').replace('.', ''), 10);
            const upvotesPercentageMatch = /\((\d+)\s*\%[^\)]*\)/.exec(scoreSection[0]);
            if (!upvotesPercentageMatch) return;

            const upvotesPercentage = parseInt(upvotesPercentageMatch[1], 10);
            const upvotes = calcUpvotes(score, upvotesPercentage);
            const downvotes = upvotes !== "--" ? score - upvotes : "--";

            updateTagline(linkDiv, upvotes, downvotes, upvotesPercentage);
        });

        await Promise.all(promises);
    }

    function calcUpvotes(score, upvotesPercentage) {
        if (score === 0) return "--";
        return Math.round(((upvotesPercentage / 100) * score) / (2 * (upvotesPercentage / 100) - 1));
    }

    function updateTagline(linkDiv, upvotes, downvotes, upvotesPercentage) {
        const taglineParagraph = linkDiv.querySelector(".tagline") || linkDiv.querySelector(".Post div[data-test-id='post-content']")?.querySelector(".tagline");
        if (!taglineParagraph) return;

        let upvoteSpan = taglineParagraph.querySelector(".res_post_ups");
        let downvoteSpan = taglineParagraph.querySelector(".res_post_downs");
        let percentageSpan = taglineParagraph.querySelector(".res_post_percentage");

        if (!upvoteSpan || !downvoteSpan || !percentageSpan) {
            const updownInfoSpan = document.createElement("span");

            upvoteSpan = createVoteSpan("res_post_ups", upvotes, "#FF8B24");
            downvoteSpan = createVoteSpan("res_post_downs", downvotes, "#9494FF");
            percentageSpan = createVoteSpan("res_post_percentage", `${upvotesPercentage}%`, "#00A000");

            updownInfoSpan.append("(", upvoteSpan, "|", downvoteSpan, "|", percentageSpan, ") ");
            taglineParagraph.insertBefore(updownInfoSpan, taglineParagraph.firstChild);
        } else {
            upvoteSpan.textContent = upvotes;
            downvoteSpan.textContent = downvotes;
            percentageSpan.textContent = `${upvotesPercentage}%`;
        }
    }

    function createVoteSpan(className, textContent, color) {
        const span = document.createElement("span");
        span.classList.add(className);
        span.style.color = color;
        span.textContent = textContent;
        return span;
    }

    async function httpGet(url) {
        const response = await fetch(url);
        return response.text();
    }

    window.addEventListener('load', () => {
        estimatePostScoreVotes();
        addUpvoteDownvoteInfo();
    });

    window.addEventListener('keydown', (event) => {
        if (event.shiftKey && event.key === 'P') {
            estimatePostScoreVotes();
            addUpvoteDownvoteInfo();
        }
    });

})();
