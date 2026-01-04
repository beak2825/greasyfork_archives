// ==UserScript==
// @name        Roblox Scam Blocker
// @namespace   Violentmonkey Scripts
// @match       https://www.youtube.com/results?search_query=roblox+live
// @grant       none
// @version     1.0
// @author      idk
// @description 7/2/2023, 7:43:33 PM
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/470011/Roblox%20Scam%20Blocker.user.js
// @updateURL https://update.greasyfork.org/scripts/470011/Roblox%20Scam%20Blocker.meta.js
// ==/UserScript==

function blockVideos() {
  const keywords = ['robux', 'giving', 'giveaway'];
  const videoItems = Array.from(document.querySelectorAll('ytd-video-renderer'));

  videoItems.forEach(videoItem => {
    const title = videoItem.querySelector('#video-title')?.textContent?.toLowerCase();

    if (keywords.some(keyword => title?.includes(keyword))) {
      videoItem.style.display = 'none';
      const blockedMessage = document.createElement('p');
      blockedMessage.textContent = 'Video blocked';
      blockedMessage.style.fontSize = '18px';
      videoItem.insertAdjacentElement('afterend', blockedMessage);
    }
  });
}

blockVideos();
