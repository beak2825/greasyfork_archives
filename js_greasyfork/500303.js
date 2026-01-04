// ==UserScript==
// @name         Hacker News Comment Sorter
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Sort Hacker News comments by various attributes
// @match        https://news.ycombinator.com/item?id=*
// @grant        none
// @author       Osiris-Team
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/500303/Hacker%20News%20Comment%20Sorter.user.js
// @updateURL https://update.greasyfork.org/scripts/500303/Hacker%20News%20Comment%20Sorter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function createSortButton(text, sortFunction) {
        const button = document.createElement('button');
        button.textContent = text;
        button.addEventListener('click', sortFunction);
        return button;
    }

    function getComments() {
        return Array.from(document.querySelectorAll('tr.athing.comtr'));
    }

    function sortComments(compareFn) {
        const comments = getComments();
        const sortedComments = comments.sort(compareFn);
        const commentList = document.querySelector('table.comment-tree');
        sortedComments.forEach(comment => commentList.appendChild(comment));
    }

    function sortByAge() {
        sortComments((a, b) => {
            const aAge = a.querySelector('.age').getAttribute('title');
            const bAge = b.querySelector('.age').getAttribute('title');
            return new Date(bAge) - new Date(aAge);
        });
    }

    function sortByUser() {
        sortComments((a, b) => {
            const aUser = a.querySelector('.hnuser').textContent.toLowerCase();
            const bUser = b.querySelector('.hnuser').textContent.toLowerCase();
            return aUser.localeCompare(bUser);
        });
    }

    function sortByIndentation() {
        sortComments((a, b) => {
            const aIndent = parseInt(a.querySelector('.ind img').getAttribute('width'));
            const bIndent = parseInt(b.querySelector('.ind img').getAttribute('width'));
            return aIndent - bIndent;
        });
    }

    function sortByScore() {
        sortComments((a, b) => {
            const aScore = parseInt(a.querySelector('.score')?.textContent) || 0;
            const bScore = parseInt(b.querySelector('.score')?.textContent) || 0;
            return bScore - aScore;
        });
    }

    function sortByCommentLength() {
        sortComments((a, b) => {
            const aLength = a.querySelector('.commtext').textContent.length;
            const bLength = b.querySelector('.commtext').textContent.length;
            return bLength - aLength;
        });
    }

    function sortByCommentId() {
        sortComments((a, b) => {
            const aId = parseInt(a.id);
            const bId = parseInt(b.id);
            return aId - bId;
        });
    }

    function sortByUserColor() {
        sortComments((a, b) => {
            const aColor = a.querySelector('.hnuser font')?.getAttribute('color') || '';
            const bColor = b.querySelector('.hnuser font')?.getAttribute('color') || '';
            return aColor.localeCompare(bColor);
        });
    }

    function init() {
        const sortingDiv = document.createElement('div');
        sortingDiv.style.margin = '10px 0';
        sortingDiv.appendChild(createSortButton('Sort by Age', sortByAge));
        sortingDiv.appendChild(createSortButton('Sort by User', sortByUser));
        sortingDiv.appendChild(createSortButton('Sort by Indentation', sortByIndentation));
        sortingDiv.appendChild(createSortButton('Sort by Score', sortByScore));
        sortingDiv.appendChild(createSortButton('Sort by Comment Length', sortByCommentLength));
        sortingDiv.appendChild(createSortButton('Sort by Comment ID', sortByCommentId));
        sortingDiv.appendChild(createSortButton('Sort by User Color', sortByUserColor));

        const commentSection = document.querySelector('table.comment-tree');
        commentSection.parentNode.insertBefore(sortingDiv, commentSection);
    }

    init();
})();