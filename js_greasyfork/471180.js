// ==UserScript==
// @name         KBin.social hide vote counters
// @namespace    https://kbin.social/
// @version      0.1
// @description  Hide vote counters on posts and comments (until you place a vote yourself).
// @author       H2SO4
// @match        https://kbin.social/*
// @grant        none
// @license      Whatever
// @downloadURL https://update.greasyfork.org/scripts/471180/KBinsocial%20hide%20vote%20counters.user.js
// @updateURL https://update.greasyfork.org/scripts/471180/KBinsocial%20hide%20vote%20counters.meta.js
// ==/UserScript==

(function() {
    const upvotes = document.querySelectorAll('span[data-subject-target="favCounter"]');
    const downvotes = document.querySelectorAll('span[data-subject-target="downvoteCounter"]');
    let votes = [];
    votes.push.apply(votes, upvotes);
    votes.push.apply(votes, downvotes);
    for(let i=0;i<votes.length;i++) {
        votes[i].style.display = "none";
    }
})();
