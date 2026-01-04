// ==UserScript==
// @name         Hacker News Open Links in New Tab
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Open links on Hacker News in a new tab
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
// @downloadURL https://update.greasyfork.org/scripts/441225/Hacker%20News%20Open%20Links%20in%20New%20Tab.user.js
// @updateURL https://update.greasyfork.org/scripts/441225/Hacker%20News%20Open%20Links%20in%20New%20Tab.meta.js
// ==/UserScript==

let links = document.querySelectorAll("td.title > span.titleline > a");
for(let i = 0; i < links.length; i++) {
    links[i].target = "_blank";
}