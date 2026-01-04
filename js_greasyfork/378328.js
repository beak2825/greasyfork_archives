// ==UserScript==
// @namespace Planetsuzy
// @name Planetsuzy Threads - Hide images in signatures
// @description This script will automatically hide all images in signatures under each forum post
// @version 1.0
// @license MIT
// @icon http://ps.fscache.com/styles/style1/images/statusicon/forum_old.gif
// @include /^https?://(www\.)?planetsuzy\.org/showthread\.php/
// @include /^https?:\/\/(www\.)?planetsuzy\.org\/t\d+[\w-]+\.html$/
// @downloadURL https://update.greasyfork.org/scripts/378328/Planetsuzy%20Threads%20-%20Hide%20images%20in%20signatures.user.js
// @updateURL https://update.greasyfork.org/scripts/378328/Planetsuzy%20Threads%20-%20Hide%20images%20in%20signatures.meta.js
// ==/UserScript==

const decoratePosts = function() {
  
  document.querySelectorAll('table[id^=post] [id^=td_post_]')
    .forEach(function (el) {
      let sigContext = false;
      for (let i = el.childNodes.length - 1; i >= 0; i--) {
        let node = el.childNodes[i];
        if (node.nodeType === Node.COMMENT_NODE && node.textContent.trim() === '/ sig') {
          sigContext = true;
        } else if (node.nodeType === Node.COMMENT_NODE && node.textContent.trim() === 'sig') {
          sigContext = false;
        } else if (sigContext && typeof node.querySelectorAll === 'function') {
          node.querySelectorAll('img')
            .forEach(function (img) {
              img.style.display = 'none';
            });
        }
      }
    });
};


decoratePosts();
