// ==UserScript==
// @name         Fix HN comment length
// @namespace    https://github.com/tekinosman/
// @version      1.1
// @license      MIT
// @description  Sets HN comment length to 50-75 characters
// @author       Osman Tekin
// @match        https://news.ycombinator.com/*
// @match        http://news.ycombinator.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ycombinator.com
// @grant        GM_addStyle
// ==/UserScript==

GM_addStyle(`
  .default {
    min-width: 50ch !important;
    max-width: 75ch !important;
  }
  #hnmain {
    max-width: 80ch !important;
  }
`);