// ==UserScript==
// @name         HN sans votes
// @namespace    https://github.com/tekinosman/
// @version      1.1
// @license      MIT
// @description  Removes vote arrows and score from Hacker News
// @author       Osman Tekin
// @match        https://news.ycombinator.com/*
// @match        http://news.ycombinator.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ycombinator.com
// @grant        GM_addStyle
// ==/UserScript==

GM_addStyle(".votearrow, .score { display: none !important }");