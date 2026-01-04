// ==UserScript==
// @name         YouTube Live Chat Alternating Backgrounds - Medium Purple & Black
// @namespace    http://tampermonkey.net/
// @version      0.26
// @description  Alternate background color for each chatter in YouTube Live Chat (medium purple & black theme)
// @match        https://www.youtube.com/live_chat*
// @grant        GM_addStyle
// @license MIT 
// @downloadURL https://update.greasyfork.org/scripts/534208/YouTube%20Live%20Chat%20Alternating%20Backgrounds%20-%20Medium%20Purple%20%20Black.user.js
// @updateURL https://update.greasyfork.org/scripts/534208/YouTube%20Live%20Chat%20Alternating%20Backgrounds%20-%20Medium%20Purple%20%20Black.meta.js
// ==/UserScript==

GM_addStyle(`
  yt-live-chat-text-message-renderer:nth-child(odd) {
    background-color: #6a4fbf !important;  /* Medium purple */
  }
  yt-live-chat-text-message-renderer:nth-child(even) {
    background-color: #000000 !important;  /* Black */
  }
  yt-live-chat-text-message-renderer {
    color: #e0d7ff !important;            /* Soft light purple text for readability */
  }
`);
