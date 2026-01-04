// ==UserScript==
// @name         YouTube Shorts Redirect
// @namespace    https://github.com/bennett-zhang
// @version      0.1
// @description  Redirect YouTube shorts to default player
// @author       Bennett Zhang
// @match        *://*.youtube.com/*
// @icon         https://raw.githubusercontent.com/bennett-zhang/youtube-shorts-redirect/main/src/icons/icon32.png
// @icon64       https://raw.githubusercontent.com/bennett-zhang/youtube-shorts-redirect/main/src/icons/icon64.png
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/472376/YouTube%20Shorts%20Redirect.user.js
// @updateURL https://update.greasyfork.org/scripts/472376/YouTube%20Shorts%20Redirect.meta.js
// ==/UserScript==

(function() {
  function redirect(url) {
    if (url.includes("shorts/")) {
      window.location.replace(url.replace("shorts/", "watch?v="));
    }
  }

  // Desktop YouTube
  window.addEventListener("yt-navigate-start", evt => {
    redirect(evt.target.baseURI);
  });

  // Mobile YouTube
  window.addEventListener("state-navigatestart", evt => {
    redirect(evt.detail.href);
  });

  redirect(window.location.href);
})();