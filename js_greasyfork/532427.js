// ==UserScript==
// @name         KG_Youtube_Info
// @namespace    https://klavogonki.ru/
// @version      0.0.2
// @description  Set additional information about YouTube videos in the chat as Youtube channel name and video title
// @author       Patcher
// @match        *://klavogonki.ru/gamelist/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=klavogonki.ru
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/532427/KG_Youtube_Info.user.js
// @updateURL https://update.greasyfork.org/scripts/532427/KG_Youtube_Info.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // Emoji definitions for YouTube links
  const emojis = {
    youtube: '▶️',
    channel: '📺',
    title: '📹',
    type: '🎬️'
  };

  // Extracts video information from a URL
  function getVideoInfo(url) {
    const youtubeMatch = url.match(/(?:shorts\/|live\/|watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/i);
    if (youtubeMatch) {
      const videoId = youtubeMatch[1];
      const videoType = url.includes('shorts/') ? 'Shorts' :
        url.includes('live/') ? 'Live' :
          url.includes('watch?v=') ? 'Watch' :
            url.includes('youtu.be/') ? 'Share' : 'YouTube';
      return { youtubeMatch: true, videoId, videoType };
    }
    return { youtubeMatch: false };
  }

  // Fetches YouTube metadata using the oEmbed endpoint
  async function fetchYouTubeMetadata(videoId) {
    const oembedUrl = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`;
    try {
      const response = await fetch(oembedUrl);
      const data = await response.json();
      return {
        title: data.title || 'Title not found',
        channel: data.author_name || 'Channel not found'
      };
    } catch (error) {
      console.error('Error fetching YouTube metadata:', error);
      return { title: 'Error', channel: 'Error' };
    }
  }

  // Processes YouTube links in the chat messages
  async function processYouTubeLinks(container) {
    const links = container.querySelectorAll('a:not(.processed-youtube-link)');
    for (const link of links) {
      const videoInfo = getVideoInfo(link.href);
      if (videoInfo && videoInfo.youtubeMatch) {
        const metadata = await fetchYouTubeMetadata(videoInfo.videoId);
        link.classList.add('processed-youtube-link');
        link.innerHTML = [
          `${emojis.youtube} YouTube`,
          `${emojis.type} [${videoInfo.videoType}]`,
          `${emojis.channel} ${metadata.channel}`,
          `${emojis.title} ${metadata.title}`
        ].join(' - ');
      } else if (videoInfo && videoInfo.youtubeMatch === false) {
        link.classList.add('processed-youtube-link'); // Mark as processed to skip in future
      }
    }
  }

  // Get chat elements from the page
  function getChatElements() {
    const messagesContainer = document.querySelector('.messages-content');
    if (!messagesContainer) return null;
    const messages = messagesContainer.querySelectorAll('p');
    return { messagesContainer, messages };
  }

  // Observe new messages and process YouTube links
  function observeMessages() {
    const chatElements = getChatElements();
    if (!chatElements) return;

    const { messagesContainer } = chatElements;
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeName === 'P') { // Only process new <p> tags
              processYouTubeLinks(node);
            }
          });
        }
      }
    });

    observer.observe(messagesContainer, { childList: true, subtree: true }); // Changed subtree to true to capture nested <p> tags
  }

  function initialize() {
    const chatElements = getChatElements();
    if (!chatElements) return;

    observeMessages();
  }

  initialize();
})();
