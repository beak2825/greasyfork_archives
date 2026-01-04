// ==UserScript==
// @name            Xhamster - Delete Extra Big space in comments / Blogs v.1
// @version         v.1.00
// @description	    Delete Extra Big space in comments / Blog
// @icon            https://external-content.duckduckgo.com/ip3/fr.xhamster.com.ico
// @namespace       https://greasyfork.org/fr/users/7434-janvier56
// @homepage        https://greasyfork.org/fr/users/7434-janvier56
// @match           https://*.xhamster.com/*
// @grant           none
// @downloadURL https://update.greasyfork.org/scripts/537320/Xhamster%20-%20Delete%20Extra%20Big%20space%20in%20comments%20%20Blogs%20v1.user.js
// @updateURL https://update.greasyfork.org/scripts/537320/Xhamster%20-%20Delete%20Extra%20Big%20space%20in%20comments%20%20Blogs%20v1.meta.js
// ==/UserScript==

(function() {
  'use strict';
  var comments = document.querySelectorAll('.video-page .width-wrap .comments-section.comments-container #commentBox [class^="commentsList-"] [class^="commentItem-"] [class^="text-"]  [class^="commentText-"]');
  comments.forEach(function(comment) {
    var brs = comment.getElementsByTagName('br');
    var i = 0;
    while (i < brs.length - 1) {
      if (brs[i].nextSibling === brs[i + 1]) {
        brs[i + 1].remove();
      } else {
        i++;
      }
    }
  });

  var storyTexts = document.querySelectorAll('.story-section .story-item .story-text:not(.xh-editor)');
  storyTexts.forEach(function(storyText) {
    var brs = storyText.getElementsByTagName('br');
    var i = 0;
    while (i < brs.length - 1) {
      if (brs[i].nextSibling === brs[i + 1]) {
        brs[i + 1].remove();
      } else {
        i++;
      }
    }
  });
})();



