// ==UserScript==
// @name         HN derank
// @namespace    https://github.com/tekinosman/
// @version      1.1
// @license      MIT
// @description  Removes ranking from Hacker News homepage
// @author       Osman Tekin
// @match        https://news.ycombinator.com/*
// @match        http://news.ycombinator.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ycombinator.com
// @grant        GM_addStyle
// ==/UserScript==
 
GM_addStyle(".rank { display: none !important }");