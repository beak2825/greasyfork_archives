// ==UserScript==
// @name        Extend youtube player styles (Background, Borders)
// @namespace   shiftgeist
// @match       https://www.youtube.com/*
// @grant       GM_addStyle
// @version     20250407
// @author      shiftgeist
// @description Makes youtube player round and hides black background
// @run-at      document-start
// @license     GNU GPLv3
// @icon        https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @downloadURL https://update.greasyfork.org/scripts/527745/Extend%20youtube%20player%20styles%20%28Background%2C%20Borders%29.user.js
// @updateURL https://update.greasyfork.org/scripts/527745/Extend%20youtube%20player%20styles%20%28Background%2C%20Borders%29.meta.js
// ==/UserScript==

GM_addStyle(`
  ytd-watch-flexy[full-bleed-player] div#full-bleed-container.ytd-watch-flexy {
    background: #0f0f0f;
  }

  .video-stream.html5-main-video {
    border-radius: 4px;
  }
`);