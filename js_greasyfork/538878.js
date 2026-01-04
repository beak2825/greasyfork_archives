// ==UserScript==
// @name         Reddit Title Upvote Ratio Tooltip
// @namespace    https://greasyfork.org/en/users/1479408
// @license MIT
// @version      1.0
// @description  On a Reddit post page, show upvote_ratio (%) as a tooltip on the post title.
// @match        https://www.reddit.com/*/*/comments/*
// @grant        GM.xmlHttpRequest
// @connect      reddit.com
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/538878/Reddit%20Title%20Upvote%20Ratio%20Tooltip.user.js
// @updateURL https://update.greasyfork.org/scripts/538878/Reddit%20Title%20Upvote%20Ratio%20Tooltip.meta.js
// ==/UserScript==

(function() {
  'use strict';

  // Run once on page load
  const titleEl = document.querySelector('h1[id^="post-title-t3_"]');
  if (!titleEl) return;

  // Extract the base‑36 post ID from the element's id attribute
  const [, postId] = titleEl.id.split('t3_');
  if (!postId) return;

  // Fetch JSON and set tooltip to upvote_ratio × 100
  GM.xmlHttpRequest({
    method: "GET",
    url: `https://www.reddit.com/comments/${postId}.json?raw_json=1`,
    responseType: 'json',
    onload: resp => {
      try {
        const ratio = resp.response[0].data.children[0].data.upvote_ratio;
        titleEl.title = ratio != null
          ? `${(ratio * 100).toFixed(1)}%`
          : 'N/A';
      } catch (e) {
        console.error('TitleUpPctTooltip error', e);
      }
    }
  });
})();
