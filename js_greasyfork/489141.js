// ==UserScript==
// @name         Uniform HN comment color
// @namespace    https://github.com/tekinosman/
// @version      1.1
// @license      MIT
// @description  Makes all HN comments the same color
// @author       Osman Tekin
// @match        https://news.ycombinator.com/*
// @match        http://news.ycombinator.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ycombinator.com
// @grant        none
// ==/UserScript==

document.querySelectorAll(".commtext").forEach(commtext => commtext.classList.value = "commtext c00");