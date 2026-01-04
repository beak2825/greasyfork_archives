// ==UserScript==
// @name        Remove highlight from Mobilism
// @namespace   https://github.com/AbdurazaaqMohammed
// @author       Abdurazaaq Mohammed
// @version     1.0.2
// @description Removes unnecessary highlight from Mobilism pages triggered when clicking on a search result to prevent potential issues with external links.
// @match       https://forum.mobilism.org/viewtopic.php?f=*
// @match       https://forum.mobilism.me/viewtopic.php?f=*
// @match       https://forum.mobilism.org/search.php?*
// @match       https://forum.mobilism.me/search.php?*
// @grant       none
// @run-at      document-start
// @homepage    https://github.com/AbdurazaaqMohammed/userscripts
// @supportURL  https://github.com/AbdurazaaqMohammed/userscripts/issues
// @license      The Unlicense
// @downloadURL https://update.greasyfork.org/scripts/477292/Remove%20highlight%20from%20Mobilism.user.js
// @updateURL https://update.greasyfork.org/scripts/477292/Remove%20highlight%20from%20Mobilism.meta.js
// ==/UserScript==

(function() {
  'use strict';


  const url = window.location.href;
  if (url.includes('viewtopic')) {
    const index = url.indexOf("&hilit");
    if (index > -1) window.location.href = url.substring(0, index);
  } else {
      addEventListener("load", (event) => {
        const topics = document.querySelectorAll('.topictitle');
        const latestPosts = document.querySelectorAll('a[rel="tooltip"]');
        const toBeReplaced = '&hilit=' + document.querySelector('h3 > [href^="./search.php"]').innerText.replaceAll(' ', '+');

        for (let i = 0; i < topics.length; i++) {
          const topic = topics[i];
          const latestPost = latestPosts[i];
          const topicLink = $(topic).attr('href').toString();
          const latestPostLink = $(latestPost).attr('href').toString();

          topic.setAttribute('href', topicLink.replace(toBeReplaced, ''));
          latestPost.setAttribute('href', latestPostLink.replace(toBeReplaced, ''));
        }
      });
  }
})();