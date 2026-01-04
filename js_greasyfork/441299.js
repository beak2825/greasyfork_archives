// ==UserScript==
// @name         Hacker News Highlight Number of Comments
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Highlight the number of comments on each post on Hacker News by making the number bold and a darker color than the surrounding text
// @license      GPL v3.0
// @author       xdpirate
// @match        https://news.ycombinator.com/
// @match        https://news.ycombinator.com/?p*
// @match        https://news.ycombinator.com/news*
// @match        https://news.ycombinator.com/best*
// @match        https://news.ycombinator.com/newest*
// @match        https://news.ycombinator.com/front*
// @match        https://news.ycombinator.com/ask*
// @match        https://news.ycombinator.com/show*
// @icon         https://www.google.com/s2/favicons?domain=ycombinator.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/441299/Hacker%20News%20Highlight%20Number%20of%20Comments.user.js
// @updateURL https://update.greasyfork.org/scripts/441299/Hacker%20News%20Highlight%20Number%20of%20Comments.meta.js
// ==/UserScript==

let commentLinks = document.querySelectorAll("td.subtext > span.subline > a[href^=\"item?id\"");
for(let i = 0; i < commentLinks.length; i++) {
    let commentMatch = commentLinks[i].innerHTML.match(/^([0-9]+)/g);
    if(commentMatch) {
        let numComments = commentMatch[0];
        let plural = "";

        if(numComments > 1) {
            plural = "s";
        }

        commentLinks[i].innerHTML = `<span style="font-weight: bold; color: #666;">${numComments}</span> comment${plural}`;
    }
}