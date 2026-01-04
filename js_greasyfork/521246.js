// ==UserScript==
// @name     OpenAI Sora Video Downloader
// @description  Adds a context menu item that opens the raw Sora video in a new tab to download or share.
// @version  1.0.3
// @author       yodaluca23
// @license      GNU GPLv3
// @match        *://sora.com/*
// @match        *://sora.chatgpt.com/*
// @grant    GM_registerMenuCommand
// @grant    GM_openInTab
// @run-at   document-idle
// @namespace https://greasyfork.org/users/1315976
// @downloadURL https://update.greasyfork.org/scripts/521246/OpenAI%20Sora%20Video%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/521246/OpenAI%20Sora%20Video%20Downloader.meta.js
// ==/UserScript==

function extractAndOpenVideoURL() {
    const targetElement = document.querySelector('.absolute.cursor-default');
    if (targetElement) {
      const videoElement = targetElement.querySelector('video');
      if (videoElement && videoElement.src) {
          // Open the video URL in a new tab
          GM_openInTab(videoElement.src, {
              active: true,
              insert: true,
              pinned: false
          });
      }
    }
}

GM_registerMenuCommand("Download This Sora Video", extractAndOpenVideoURL, "e");