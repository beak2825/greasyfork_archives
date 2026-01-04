// ==UserScript==
// @description Highlights author without breaking comment collapse
// @name        HN Highlight Author
// @namespace   Violentmonkey Scripts
// @match       https://news.ycombinator.com/item
// @version     1.2
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/393187/HN%20Highlight%20Author.user.js
// @updateURL https://update.greasyfork.org/scripts/393187/HN%20Highlight%20Author.meta.js
// ==/UserScript==

let author = document.querySelector('table.fatitem a.hnuser').textContent;
let authorComments = document.querySelectorAll(`table.comment-tree span.comhead > a[href*=${author}]`);
authorComments.forEach(elm => {
    if (elm.querySelector('font'))
        elm.querySelector('font').style.color = '#fff';
    elm.style.backgroundColor = 'rgba(198, 120, 221, 0.8)';
    elm.style.borderRadius = '3px';
    elm.style.color = '#fff';
    elm.style.padding = '1px 2px';
    elm.style.paddingBottom = '2px';
})
