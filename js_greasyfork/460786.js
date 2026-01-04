// ==UserScript==
// @name         Halve HN comment's indentation
// @namespace    https://github.com/tekinosman/
// @version      1.1
// @license      MIT
// @description  Halves indentation of HN comments
// @author       Osman Tekin
// @match        https://news.ycombinator.com/*
// @match        http://news.ycombinator.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ycombinator.com
// @grant        none
// ==/UserScript==

document.querySelectorAll(".ind img") /* Comments are indented
                                       * with varying-width img elements
                                       */
    .forEach(indentation => indentation.width *= 0.5);