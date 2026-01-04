// ==UserScript==
// @name         Aggressive Hide YouTube Mobile Comments - Full
// @namespace    https://your.custom.domain/
// @version      1.3
// @description  Remove comments and hide container on m.youtube.com
// @match        *://m.youtube.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/543153/Aggressive%20Hide%20YouTube%20Mobile%20Comments%20-%20Full.user.js
// @updateURL https://update.greasyfork.org/scripts/543153/Aggressive%20Hide%20YouTube%20Mobile%20Comments%20-%20Full.meta.js
// ==/UserScript==

(function() {
  'use strict';

  function removeComments() {
    const selectors = [
      'ytm-comments-entry-point-renderer',
      'ytd-comments',
      '#comments',
      'ytm-comment-renderer',
      'ytd-comment-thread-renderer'
    ];

    let found = false;

    selectors.forEach(sel => {
      const elems = document.querySelectorAll(sel);
      if (elems.length > 0) {
        found = true;
        elems.forEach(el => {
          el.remove();
          console.log(`Removed element matching selector: ${sel}`);
        });
      }
    });

    // Hide any leftover containers (if still present)
    const commentContainers = document.querySelectorAll('ytm-comments-entry-point-renderer, ytd-comments, #comments');
    commentContainers.forEach(container => {
      container.style.display = 'none';
      console.log('Hid comment container');
    });

    if (!found) {
      console.log('No comment elements found this run.');
    }
  }

  setInterval(removeComments, 500);
  removeComments();

})();