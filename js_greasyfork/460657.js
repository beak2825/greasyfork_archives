// ==UserScript==
// @name         HN Highlight Original Poster
// @namespace    https://github.com/tekinosman/
// @version      1.3
// @license      MIT
// @description  Highlights original poster's name on Hacker News
// @author       Osman Tekin
// @match        https://news.ycombinator.com/item?id=*
// @match        http://news.ycombinator.com/item?id=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ycombinator.com
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/460657/HN%20Highlight%20Original%20Poster.user.js
// @updateURL https://update.greasyfork.org/scripts/460657/HN%20Highlight%20Original%20Poster.meta.js
// ==/UserScript==

// Original poster is the first user
let originalPoster = document.querySelector('.hnuser').innerText;

GM_addStyle(`
  a[href='user?id=${originalPoster}'] {
    background: #ccc !important;
    color: #f9f9f9 !important;
    padding: 2px !important;
    borderRadius: 2px !important;
  }
`);