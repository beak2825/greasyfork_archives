// ==UserScript==
// @name         YouTube Sticky Live Chat
// @name:ja      YouTube Sticky Live Chat
// @namespace    https://i544c.github.io
// @version      0.4.1
// @description  Pin the latest message written by live owner or moderator to the top
// @description:ja  生放送主とモデレータの最新のコメントを上に固定するユーザスクリプト
// @author       i544c
// @match        https://www.youtube.com/live_chat*
// @match        https://www.youtube.com/live_chat_replay*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/402617/YouTube%20Sticky%20Live%20Chat.user.js
// @updateURL https://update.greasyfork.org/scripts/402617/YouTube%20Sticky%20Live%20Chat.meta.js
// ==/UserScript==

(() => {
  const style = document.createElement('style');
  style.textContent = `
    yt-live-chat-app {
      /* Global variables */
      --ysl-line-length: 3;
      --ysl-message-height: calc(1em * var(--ysl-line-length) + 4px);
    }

    #item-offset {
      overflow: visible !important;
    }

    #items {
      transform: none !important;
    }

    yt-live-chat-text-message-renderer[author-type="owner"],
    yt-live-chat-text-message-renderer[author-type="moderator"] {
      background: var(--yt-live-chat-message-highlight-background-color);
      position: sticky;
      top: -1px;
      z-index: 1;
      height: var(--ysl-message-height);
      min-height: var(--ysl-message-height);
    }

    yt-live-chat-text-message-renderer[author-type="owner"]:hover,
    yt-live-chat-text-message-renderer[author-type="moderator"]:hover {
      height: 100% !important;
    }

    yt-live-chat-text-message-renderer[author-type="owner"] #content,
    yt-live-chat-text-message-renderer[author-type="moderator"] #content {
      align-self: normal;
      /* String truncate */
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: var(--ysl-line-length);
      overflow: hidden;
    }

    yt-live-chat-text-message-renderer[author-type="owner"] #content:hover,
    yt-live-chat-text-message-renderer[author-type="moderator"] #content:hover {
      -webkit-box-orient: inline-axis;
    }
  `;
  document.body.appendChild(style);
})();
