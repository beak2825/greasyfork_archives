// ==UserScript==
// @name         MAL Restore Rating
// @namespace    https://greasyfork.org/en/users/957127-supertouch
// @version      0.1
// @description  Restore MAL's old rating display
// @author       SuperTouch
// @match        https://myanimelist.net/manga/*
// @match        https://myanimelist.net/anime/*
// @match        https://myanimelist.net/reviews*
// @icon         https://cdn.myanimelist.net/images/favicon.ico
// @run-at       document-end
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/451122/MAL%20Restore%20Rating.user.js
// @updateURL https://update.greasyfork.org/scripts/451122/MAL%20Restore%20Rating.meta.js
// ==/UserScript==

(function() {
  'use strict';
  function createRatingElement(rating) {
    let html = `<div class="floatRightHeader"><a href="javascript:void(0);">Overall Rating</a>: ${rating}</div>`
    let template = document.createElement('template');
    html = html.trim();
    template.innerHTML = html;
    return template.content.firstChild;
  }

  const reviews = document.querySelectorAll('.review-element');
  reviews.forEach((reviewEl) => {
    const tags = reviewEl.querySelector('.tags');
    const rating = reviewEl.querySelector('.rating > .num').textContent;
    const ratingElement = createRatingElement(rating);
    tags.appendChild(ratingElement);
  })
})();