// ==UserScript==
// @name        Redirect YouTube channel to /videos
// @namespace   https://stojanow.com/
// @match       *://youtube.com/*
// @match       *://*.youtube.com/*
// @exclude     *://studio.youtube.com/*
// @run-at      document-start
// @grant       none
// @version     0.3.1
// @author      Piotr Stojanow (https://github.com/psto/)
// @license     MIT
// @description Redirect a YouTube channel home page straight to the videos tab.
// @icon        https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQoiMtJG_PC4lsb3-GZAiTZkUXAm3VlkJC1Ag&s
// @downloadURL https://update.greasyfork.org/scripts/500460/Redirect%20YouTube%20channel%20to%20videos.user.js
// @updateURL https://update.greasyfork.org/scripts/500460/Redirect%20YouTube%20channel%20to%20videos.meta.js
// ==/UserScript==

(function() {
  'use strict';

  const excludedPaths = ['/videos', '/community', '/live', '/playlists', '/search', '/podcasts', '/shorts', '/streams'];
  let isRedirecting = false;
  let lastCheckedPath = '';

  function redirectIfNeeded() {
    const currentPath = window.location.pathname;

    if (isRedirecting || currentPath === lastCheckedPath) return;
    lastCheckedPath = currentPath;

    /**
    * Regex to capture the base path of any valid YouTube channel URL format:
    * @handle, /c/channel, /user/legacy, /channel/
    */
    const channelMatch = currentPath.match(/^(\/@[\w.-]+|\/(?:channel|c|user)\/[^/]+)/);

    if (channelMatch) {
      const channelBasePath = channelMatch[0];
      const shouldBeExcluded = excludedPaths.some(suffix => currentPath.startsWith(channelBasePath + suffix));

      if (!shouldBeExcluded) {
        isRedirecting = true;
        const newUrl = `https://www.youtube.com${channelBasePath}/videos`;
        window.location.href = newUrl;
      }
    }
  }

  // Observe changes in the DOM to trigger redirection if needed
  const observer = new MutationObserver(redirectIfNeeded);
  observer.observe(document, { subtree: true, childList: true });

  // Initial check for redirection
  redirectIfNeeded();
})();
