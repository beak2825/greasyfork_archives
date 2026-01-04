// ==UserScript==
// @name        GHacks Hide Older Comments - Final Version
// @namespace   MickyFoley
// @description Hides comments on ghacks.net that were made before the date of the article.
// @include     *://*.ghacks.net/*
// @match       *://*.ghacks.net/*
// author       MickyFoley
// @license     GPL-3.0-only
// @version     2.0
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/476362/GHacks%20Hide%20Older%20Comments%20-%20Final%20Version.user.js
// @updateURL https://update.greasyfork.org/scripts/476362/GHacks%20Hide%20Older%20Comments%20-%20Final%20Version.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Month lookup object for short names to full names
    const monthShortToFullName = {
        "Jan": "January", "Feb": "February", "Mar": "March", "Apr": "April", "May": "May", "Jun": "June",
        "Jul": "July", "Aug": "August", "Sep": "September", "Oct": "October", "Nov": "November", "Dec": "December"
    };

    // Month lookup object for full names to numbers
    const monthFullNameToNumber = {
        "January": 0, "February": 1, "March": 2, "April": 3, "May": 4, "June": 5,
        "July": 6, "August": 7, "September": 8, "October": 9, "November": 10, "December": 11
    };

    // Extract the article date dynamically from the page
    const articleDateDiv = document.querySelector('.post-subtitle-meta_left_date-published');
    if (!articleDateDiv) return;

    const rawArticleDate = articleDateDiv.textContent.trim();
    let [articleMonth, articleDay, articleYear] = rawArticleDate.replace(',', '').split(' ');
    articleMonth = monthFullNameToNumber[monthShortToFullName[articleMonth]];
    const articleDateObj = new Date(Number(articleYear), articleMonth, Number(articleDay));

    // Iterate through comments and hide them if they were made before the article's date
    const comments = document.querySelectorAll('li.comment');
    comments.forEach(comment => {
        const dateDivText = comment.querySelector('div.comment-item__header div').textContent;
        const dateMatch = dateDivText.match(/said on (\w+) (\d+), (\d+) at/);
        if (!dateMatch) return;

        const [, commentMonth, commentDay, commentYear] = dateMatch;
        const commentDateObj = new Date(Number(commentYear), monthFullNameToNumber[commentMonth], Number(commentDay));

        if (commentDateObj < articleDateObj) {
            comment.style.display = 'none';
        }
    });
})();
