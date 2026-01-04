// ==UserScript==
// @name         Hacker News Hide Inline Ads
// @namespace    http://news.ycombinator.com/
// @version      1.0
// @license      GPLv3
// @description  Hide inline ads/recruitment on Hacker News
// @author       xdpirate
// @match        https://news.ycombinator.com/
// @match        https://news.ycombinator.com/?p*
// @match        https://news.ycombinator.com/news*
// @match        https://news.ycombinator.com/best*
// @match        https://news.ycombinator.com/newest*
// @match        https://news.ycombinator.com/front*
// @match        https://news.ycombinator.com/ask*
// @match        https://news.ycombinator.com/show*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ycombinator.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/441859/Hacker%20News%20Hide%20Inline%20Ads.user.js
// @updateURL https://update.greasyfork.org/scripts/441859/Hacker%20News%20Hide%20Inline%20Ads.meta.js
// ==/UserScript==
let things = document.querySelectorAll("tr.athing");
for(let i = 0; i < things.length; i++) {
    if(things[i].nextSibling.querySelector("td.subtext").childElementCount == 2) {
        things[i].style.display = "none";
        things[i].nextSibling.style.display = "none";
        things[i].nextSibling.nextSibling.nextSibling.style.display = "none";
    }
}
