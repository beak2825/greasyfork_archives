// ==UserScript==
// @name         Hacker News Open Both Links and Comments
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Open both links and comments on Hacker News in two new tabs with a single click, inspired by RES' [l+c] feature
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
// @downloadURL https://update.greasyfork.org/scripts/441297/Hacker%20News%20Open%20Both%20Links%20and%20Comments.user.js
// @updateURL https://update.greasyfork.org/scripts/441297/Hacker%20News%20Open%20Both%20Links%20and%20Comments.meta.js
// ==/UserScript==

let things = document.querySelectorAll("tr.athing");
for(let i = 0; i < things.length; i++) {
    let titleLink = things[i].querySelector("td.title > span.titleline > a");
    let commentLink = things[i].nextSibling.querySelector("td.subtext > span.subline > a[href^=\"item?id\"");

    if(commentLink) {
        if(titleLink.href !== commentLink.href) {
            let newButton = document.createElement("a");
            newButton.href = titleLink.href;
            newButton.target = "_blank";
            newButton.innerHTML = "[l+c]"
            newButton.onclick = function() {
                window.open(commentLink.href)
            }

            commentLink.after(commentLink.parentNode.lastChild, newButton);
        }
    }
}