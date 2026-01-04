// ==UserScript==
// @name         Hacker News Story Rank Change Indicator
// @namespace    http://tampermonkey.net/
// @version      2024-09-07_15-42
// @description  Indicate the new stories and stories moving up/down on the front page
// @author       SMUsamaShah
// @match        https://news.ycombinator.com/
// @match        https://news.ycombinator.com/news
// @match        https://news.ycombinator.com/news?p=*
// @match        https://news.ycombinator.com/?p=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ycombinator.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/486605/Hacker%20News%20Story%20Rank%20Change%20Indicator.user.js
// @updateURL https://update.greasyfork.org/scripts/486605/Hacker%20News%20Story%20Rank%20Change%20Indicator.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const KEY_LAST_CLEAR = 'hackernews-rank-notifier-clear-time';
    const KEY_RANK_STORE = 'hackernews-rank-notifier';
    const KEY_COMMENT_STORE = 'hackernews-rank-notifier-comments';
    const MAX_STORIES = 3000;
    const MAX_NEW_COMMENTS_FOR_MAX_COLOR = 50;
    const HIDE_SEEN_AND_UNCHANGED_STORIES = false;
    const HIDE_STORIES_WITH_FEWER_NEW_COMMENTS = false;
    const HIDE_STORIES_WITH_FEWER_NEW_COMMENTS_THRESHOLD = 2;

    const oldRanks = JSON.parse(localStorage.getItem(KEY_RANK_STORE)) || {};
    const oldComments = JSON.parse(localStorage.getItem(KEY_COMMENT_STORE)) || {};

    function getAllStoryElements() { return Array.from(document.getElementsByClassName('athing')); }
    function getTitleElement(story) { return story.querySelector('.title a'); }
    function getId(story) { return story.id; }
    function getRank(story) { return parseInt(story.querySelector('span.rank').innerText.slice(0, -1)); }
    function clamp(v, min, max) { return Math.max(min, Math.min(v, max)); }
    
    function sortAndDiscardOldRecords(ranks, comments, keepRecordsUpto) {
        const topStoryIds = Object.keys(ranks).sort((a, b) => b - a).slice(0, keepRecordsUpto); 
        const newRanks = {};
        const newComments = {};
        topStoryIds.forEach(id => {
            newRanks[id] = ranks[id];
            newComments[id] = comments[id];
        });
        localStorage.setItem(KEY_RANK_STORE, JSON.stringify(newRanks));
        localStorage.setItem(KEY_COMMENT_STORE, JSON.stringify(newComments));
    }

    function getCommentsElement(story) { return story.nextSibling.querySelector('.subline>a:last-child'); }
    function getCommentCount(story) {
        let commentsElement = getCommentsElement(story);
        if (!commentsElement) return 0;
        let commentCountText = commentsElement.innerText.match(/([0-9]*) comment/);
        return (commentCountText) ? parseInt(commentCountText[1]) : 0;
    }
    function hideStory(story) {
        story.style.display = 'none';
        story.nextElementSibling.style.display = 'none';
        story.nextElementSibling.nextElementSibling.style.display = 'none';
    }
    function updateTitle(story, rankChange) {
        let title = getTitleElement(story);
        if (rankChange == undefined) {
            title.innerHTML = "<b style='color:green'>(NEW) </b>" + title.innerHTML;
        } else {
            title.textContent = '(' + (rankChange > 0 ? '+' : '-') + Math.abs(rankChange) + ') ' + title.textContent;
        }
    }
    function updateCommentCount(story, commentChange) {
        let commentsElement = getCommentsElement(story);
        if (commentsElement) {
            let bright = clamp(120 - commentChange * 120 / MAX_NEW_COMMENTS_FOR_MAX_COLOR, 0, 120);
            const commentColor = "rgb(255, " + bright + "," + bright + ")";
            commentsElement.innerHTML = '<span style="color:' + commentColor + '">(' + (commentChange > 0 ? '+' : '-') + Math.abs(commentChange) + ') </span>' + commentsElement.innerHTML;
        }
    }

    const stories = getAllStoryElements();

    stories.forEach(function(story) {
        const id = getId(story);
        const rank = getRank(story);
        const commentCount = getCommentCount(story);

        if (id in oldRanks) {
            const rankChange = oldRanks[id] - rank;
            const commentChange = commentCount - (oldComments[id] || 0);
            
            if (rankChange !== 0) {
                updateTitle(story, rankChange);
            }
            if (commentChange !== 0) {
                updateCommentCount(story, commentChange);
            }
            if (HIDE_SEEN_AND_UNCHANGED_STORIES && commentChange === 0) {
                hideStory(story);
            }
            if (HIDE_STORIES_WITH_FEWER_NEW_COMMENTS && commentChange < HIDE_STORIES_WITH_FEWER_NEW_COMMENTS_THRESHOLD) {
                hideStory(story);
            }
        } 
        else {
            updateTitle(story);
        }
        oldRanks[id] = rank;
        oldComments[id] = commentCount;
    });

    const topStoryIds = sortAndDiscardOldRecords(oldRanks, oldComments, MAX_STORIES);
})();