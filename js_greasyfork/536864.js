// ==UserScript==
// @name         Generate Youtube Mix Link
// @namespace    https://greasyfork.org/en/users/1473478
// @version      0.1
// @description  Adds a link to the youtube mix playlist for the current video after the video title
// @author       exrook
// @match        https://www.youtube.com/watch*
// @grant        none
// @license      GPL3
// @downloadURL https://update.greasyfork.org/scripts/536864/Generate%20Youtube%20Mix%20Link.user.js
// @updateURL https://update.greasyfork.org/scripts/536864/Generate%20Youtube%20Mix%20Link.meta.js
// ==/UserScript==

(function () {
  'use strict';

  function getVideoId() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('v');
  }

  function createMixLink(videoId) {
    const mixLink = document.createElement('a');
    mixLink.href = `https://www.youtube.com/watch?v=${videoId}&list=RD${videoId}&start_radio=1`;
    mixLink.textContent = 'YT Mix';
    mixLink.style.padding = '0px 12px';
    mixLink.style.borderRadius = '18px';
    mixLink.style.background = 'rgb(39, 39, 39)';
    mixLink.style.color = '#fff';
    mixLink.style.textDecoration = 'none';
    mixLink.style.fontWeight = '500';
    mixLink.style.fontSize = '14px';
    mixLink.style.fontFamily = 'Roboto, Arial, sans-serif';
    mixLink.style.cursor = 'pointer';
    mixLink.style.marginLeft = '10px';
    mixLink.style.display = 'inline-flex';
    mixLink.style.alignItems = 'center';
    mixLink.style.justifyContent = 'center';
    mixLink.id = 'yt-mix-link'; // Unique ID for updating link
    return mixLink;
  }

  function addLink() {
    const videoId = getVideoId();
    if (videoId) {
      const mixLink = createMixLink(videoId);
      const titleElement = document.querySelector('#title h1') || document.querySelector('h1.title');
      if (titleElement) {
        const existingLink = titleElement.querySelector('#yt-mix-link');
        if (existingLink) {
          existingLink.replaceWith(mixLink);
        } else {
          titleElement.appendChild(mixLink);
        }
      }
    }
  }


  // Use MutationObserver to add the link after title element is created
  function registerTitleObserver() {
    const observer = new MutationObserver((mutations) => {
      const titleElement = document.querySelector('#title h1');
      console.log("Hello");
      if (titleElement) {
        observer.disconnect();
        addLink();
      }
    });
    observer.observe(document.body, { subtree: true, childList: true });
  }

  let lastUrl = location.href;
  // Trigger addLink function on url changes
  function updateUrl() {
    const currentUrl = location.href;
    if (currentUrl !== lastUrl) {
      lastUrl = currentUrl;
      addLink();
    }
  }

  function registerNavigationObserver() {
    updateUrl(); // Don't miss changes while we were disconnected
    const observer = new MutationObserver(() => {
      updateUrl();

      // completely unnecessary optimization, sleep 2 seconds after each trigger
      // because it bothers me that this gets called multiple times for second
      observer.disconnect();
      setTimeout(registerNavigationObserver, 2000);
    });
    observer.observe(document.body, { childList: true, subtree: true });
  }

  registerTitleObserver()
  registerNavigationObserver();
})();
