// ==UserScript==
// @name         Hacker News Mark as Read
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Mark things on Hacker News as read
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
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/441507/Hacker%20News%20Mark%20as%20Read.user.js
// @updateURL https://update.greasyfork.org/scripts/441507/Hacker%20News%20Mark%20as%20Read.meta.js
// ==/UserScript==

let readArticles = GM_getValue("readArticles", []);

GM_addStyle(`
    .hnmrCheck {
        margin-left: 2px;
        margin-right: 2px;
        cursor: pointer;
    }
`);

let things = document.querySelectorAll("tr.athing");
for(let i = 0; i < things.length; i++) {
    let titleLink = things[i].querySelector("td.title > span.titleline > a");
    let titleContainer = things[i].querySelector("td.title > span.titleline");
    let commentLink = things[i].nextSibling.querySelector("td.subtext > span.subline > a[href^=\"item?id\"");

    if(commentLink) {
        let checkmark = document.createElement("span");
        checkmark.classList.add("hnmrCheck");
        checkmark.innerHTML = "✅";
        checkmark.title = "Mark as read";

        let articleIDMatch = commentLink.href.match(/item\?id\=([0-9]+)/i);

        if(articleIDMatch) {
            checkmark.articleID = articleIDMatch[1];

            if(readArticles.includes(checkmark.articleID)) {
                things[i].style.opacity = "0.3";
                things[i].nextSibling.style.opacity = "0.3";
            } else {
                things[i].style.opacity = "1";
                things[i].nextSibling.style.opacity = "1";
            }

            checkmark.onclick = function() {
                if(readArticles.includes(this.articleID)) {
                    readArticles.splice(readArticles.indexOf(this.articleID), 1);
                    let theThing = this.closest("tr.athing");
                    theThing.style.opacity = "1";
                    theThing.nextSibling.style.opacity = "1";
                } else {
                    readArticles.push(this.articleID);
                    let theThing = this.closest("tr.athing");
                    theThing.style.opacity = "0.3";
                    theThing.nextSibling.style.opacity = "0.3";
                }

                GM_setValue("readArticles", readArticles);
            };

            titleContainer.append(checkmark);
        }
    }

}