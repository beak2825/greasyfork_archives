// ==UserScript==
// @name         YT auto comment
// @namespace    DK 
// @version      1.0.0
// @description  Auto-fills comment automatically on YT
// @author       DK
// @match        https://*.youtube.com/watch*
// @grant        GM_registerMenuCommand
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/540427/YT%20auto%20comment.user.js
// @updateURL https://update.greasyfork.org/scripts/540427/YT%20auto%20comment.meta.js
// ==/UserScript==

(() => {
  'use strict';

  const ALLOWED_CHANNELS = [
    "MRBREAST"
  ];

  const comments = [
    "Hello Human"
  ];

  const SELECTORS = {
    CHANNEL_NAME: '#text-container.ytd-channel-name',
    COMMENT_BOX: 'ytd-comment-simplebox-renderer div#placeholder-area',
    COMMENT_INPUT: '#contenteditable-root',
  };

  function getChannelName() {
    const el = document.querySelector(SELECTORS.CHANNEL_NAME);
    return el?.innerText?.trim() || null;
  }

  function scrollToComments() {
    document.querySelector('ytd-comments')?.scrollIntoView({ behavior: 'smooth' });
    return new Promise(resolve => setTimeout(resolve, 1500));
  }

  async function fillComment() {
    const commentBox = document.querySelector(SELECTORS.COMMENT_BOX);
    if (!commentBox) {
      alert(" Comment box not found.");
      return false;
    }

    commentBox.click();
    await new Promise(resolve => setTimeout(resolve, 1000));

    const commentInput = document.querySelector(SELECTORS.COMMENT_INPUT);
    if (commentInput) {
      const comment = comments[Math.floor(Math.random() * comments.length)];
      commentInput.focus();
      commentInput.innerText = comment;
      commentInput.dispatchEvent(new InputEvent("input", { bubbles: true }));
      console.log(` Auto-filled comment: "${comment}"`);
      return true;
    } else {
      alert(" Comment input area not found.");
      return false;
    }
  }

  async function autoFillIfAllowed() {
    const channelName = getChannelName();
    if (!channelName) return;

    if (ALLOWED_CHANNELS.includes(channelName)) {
      console.log(` Auto-filling comment on allowed channel: ${channelName}`);
      await scrollToComments();
      await fillComment();
    } else {
      console.log(` Channel not allowed for auto-fill: ${channelName}`);
    }
  }

  // Tampermonkey menu command for manual fill on any channel
  GM_registerMenuCommand(" Manually Auto-Fill Comment", async () => {
    const channelName = getChannelName() || 'Unknown Channel';
    console.log(` Manual fill requested on channel: ${channelName}`);
    await scrollToComments();
    await fillComment();
  });

  // Run auto-fill on page load
  setTimeout(autoFillIfAllowed, 3000);
})();
