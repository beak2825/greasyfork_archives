// ==UserScript==
// @name        Remove "watch-next" sidebar
// @namespace   Violentmonkey Scripts
// @match       https://www.youtube.com/watch*
// @grant       none
// @version     1.1
// @license     MIT
// @author      popular-software
// @description The sidebar is quite distracting when trying to focus on a single video.
// @require https://cdn.jsdelivr.net/npm/@violentmonkey/dom@2
// @downloadURL https://update.greasyfork.org/scripts/537844/Remove%20%22watch-next%22%20sidebar.user.js
// @updateURL https://update.greasyfork.org/scripts/537844/Remove%20%22watch-next%22%20sidebar.meta.js
// ==/UserScript==

const disconnect = VM.observe(document.body, () => {
  const watch_next_sidebar = document.querySelector("ytd-watch-next-secondary-results-renderer");
  if (watch_next_sidebar) {
    watch_next_sidebar.remove();
  }
});