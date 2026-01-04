// ==UserScript==
// @name        Google Search disable Google's video player
// @namespace   https://greasyfork.org/en/users/85671-jcunews
// @version     1.0.3
// @license     AGPL v3
// @author      jcunews
// @description Disable Google's video player in Google search
// @match       https://google.*/search*
// @match       https://google.*.*/search*
// @match       https://www.google.*/search*
// @match       https://www.google.*.*/search*
// @grant       none
// @run-at      document-start
// @downloadURL https://update.greasyfork.org/scripts/459612/Google%20Search%20disable%20Google%27s%20video%20player.user.js
// @updateURL https://update.greasyfork.org/scripts/459612/Google%20Search%20disable%20Google%27s%20video%20player.meta.js
// ==/UserScript==

/*
Initially posted on Reddit:

https://www.reddit.com/r/userscripts/comments/10kvlb4/go_to_youtube_from_google_by_clicking_on_the/j5udys2/

Released in GreasyFork as suggested by a Reddit user, and with code modification based on the suggested code.

https://www.reddit.com/user/changePOURchange
*/

(() => {
  addEventListener("mouseover", (ev, viewerSelector, urlSelector, thumbLink, resEle) => {
    viewerSelector = 'a[data-vll]';
    urlSelector = '[data-surl]';
    if ((thumbLink = ev.target.closest(viewerSelector)) && (resEle = thumbLink.closest(urlSelector))) {
      delete thumbLink.dataset.vll;
      thumbLink.href = resEle.dataset.surl
    }
  }, true)
})()
