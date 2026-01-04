// ==UserScript==
// @include https://news.ycombinator.com
// @version 1.5
// @name Hacker News - Only show highly discussed topics
// @description This script removes every news entry with less than 100 comments.
// @namespace https://greasyfork.org/users/947801
// @downloadURL https://update.greasyfork.org/scripts/449769/Hacker%20News%20-%20Only%20show%20highly%20discussed%20topics.user.js
// @updateURL https://update.greasyfork.org/scripts/449769/Hacker%20News%20-%20Only%20show%20highly%20discussed%20topics.meta.js
// ==/UserScript==

var COMMENT_THRESHHOLD = 100;

var commentElements = document.getElementsByClassName("subtext");

var commentCounts = []
for (let element of commentElements) {
    if(element.innerText.includes("comments")) {
        var commentTextSplitt = element.innerText.split("comments")[0].trim().split(/(\s+)/);
        var commentCount = parseInt(commentTextSplitt[commentTextSplitt.length - 1]);
        commentCounts.push(commentCount);
    } else {
        commentCounts.push(0)
    }
}

var items = document.getElementsByTagName("tbody")[2].querySelectorAll('tr');

commentCounts.forEach(function (value, i) {
   if(value < COMMENT_THRESHHOLD) {
        items[i*3].remove();
        items[(i*3)+1].remove();
        items[(i*3)+2].remove();
   }
});