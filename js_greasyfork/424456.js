// ==UserScript==
// @name         Show whether Daily Mail articles without comments are moderated
// @namespace    Silico
// @version      2
// @description  On Daily Mail articles that don't yet show any comments, there is no indication whether the article's comments are being pre-moderated. When they are, the Daily Mail discards most that are submitted, so this can save you wasting your time.
// @author       mrj
// @match        https://www.dailymail.co.uk/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/424456/Show%20whether%20Daily%20Mail%20articles%20without%20comments%20are%20moderated.user.js
// @updateURL https://update.greasyfork.org/scripts/424456/Show%20whether%20Daily%20Mail%20articles%20without%20comments%20are%20moderated.meta.js
// ==/UserScript==

var newCommentHeading = document.querySelector('#newcomment + .rc-header h3');

if (newCommentHeading) {
    var headingText = newCommentHeading.firstChild.nodeValue;
    newCommentHeading.firstChild.nodeValue = headingText.replace(/ comment/, (PageCriteria.moderationStatus == 'POM' ? ' un' : ' ') + 'moderated comment');
}