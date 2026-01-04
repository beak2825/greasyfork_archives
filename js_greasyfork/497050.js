"use strict";
// ==UserScript==
// @name        More stats
// @namespace   Violentmonkey Scripts
// @match       https://app.planitpoker.com/room/*
// @grant       none
// @version     0.1.1
// @author      x-dune
// @license MIT
// @description Adds more stats like std dev to the console
// @downloadURL https://update.greasyfork.org/scripts/497050/More%20stats.user.js
// @updateURL https://update.greasyfork.org/scripts/497050/More%20stats.meta.js
// ==/UserScript==
let lastVotes = null;
function getVoteCounts(votesDistribution) {
    const voteCountRegex = /(\d+)\s+votes?/;
    const voteCounts = {};
    const children = votesDistribution.children;
    for (let i = 0; i < children.length; i++) {
        const item = children[i];
        const voteOption = item.querySelector(".vote-option")?.textContent;
        const rawVoteCount = item.querySelector(".vote-stats")?.textContent;
        if (!voteOption || !rawVoteCount) {
            throw Error();
        }
        const voteCountMatch = voteCountRegex.exec(rawVoteCount);
        if (!voteCountMatch) {
            throw Error();
        }
        const voteCount = +voteCountMatch[1];
        if (!Number.isNaN(+voteOption)) {
            // filter non-number like "?" (did not vote)
            voteCounts[voteOption] = voteCount;
        }
    }
    return voteCounts;
}
function voteCountToVotes(voteCount) {
    const votes = [];
    Object.entries(voteCount).forEach(([k, v]) => {
        for (let i = 0; i < v; i++) {
            votes.push(+k);
        }
    });
    return votes;
}
function getStats(numbers) {
    const n = numbers.length;
    const mean = numbers.reduce((a, b) => a + b, 0) / n;
    const stdDev = Math.sqrt(numbers.map((x) => Math.pow(x - mean, 2)).reduce((a, b) => a + b, 0) / n);
    return { mean, stdDev };
}
function isSameAsLastVotes(votes) {
    let isSame = false;
    if (lastVotes && lastVotes.length === votes.length) {
        isSame = lastVotes.every((x, i) => x === votes[i]);
    }
    if (!isSame) {
        lastVotes = votes;
    }
    return isSame;
}
function main() {
    const votesDistribution = document.querySelector(".votes-distribution");
    if (votesDistribution) {
        const votes = voteCountToVotes(getVoteCounts(votesDistribution));
        if (!isSameAsLastVotes(votes)) {
            const stats = getStats(votes);
            console.log("votes:", votes, ", mean:", stats.mean.toFixed(2), ", stdDev:", stats.stdDev.toFixed(2));
        }
    }
}
setInterval(main, 100);
console.log("planitpoker - more stats");
