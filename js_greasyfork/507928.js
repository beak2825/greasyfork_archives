// ==UserScript==
// @name         Remove RetroAchievements Redirects
// @namespace    https://metalsnake.space/
// @version      1.2
// @description  Replace redirect links on RetroAchievements with direct links and replace Google search links with Ecosia
// @author       MetalSnake
// @match        http*://retroachievements.org/*
// @icon         https://static.retroachievements.org/assets/images/favicon.webp
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/507928/Remove%20RetroAchievements%20Redirects.user.js
// @updateURL https://update.greasyfork.org/scripts/507928/Remove%20RetroAchievements%20Redirects.meta.js
// ==/UserScript==

(function() {
  'use strict';

  let lastUrl = location.href;

  function rewriteGoogleSearchToEcosia(rawUrl) {
    try {
      const u = new URL(rawUrl);
      const isGoogleCom = u.hostname === 'google.com' || u.hostname === 'www.google.com';
      if (isGoogleCom && u.pathname === '/search') {
        u.hostname = 'www.ecosia.org';
        u.protocol = 'https:';
        return u.toString();
      }
    } catch (_) {
      // ignore invalid URLs
    }
    return rawUrl;
  }

  function rewriteRedirects() {
    // Get all anchor tags on the page
    const links = document.querySelectorAll('a[href*="/redirect?url="]');
    links.forEach(link => {
      try {
        // Extract the URL parameter
        const urlParam = link.href.match(/\/redirect\?url=([^&]+)/);
        if (urlParam && urlParam[1]) {
          // Decode the URL
          const decodedUrl = decodeURIComponent(urlParam[1]);
          const rewrittenUrl = rewriteGoogleSearchToEcosia(decodedUrl);
          // Replace the href with the decoded direct link
          link.href = rewrittenUrl;
          // Optional: add a tooltip to indicate replacement
          link.title = 'Direct link (fixed by userscript)';
        }
      } catch (e) {
        // If something goes wrong, do nothing
        // console.error("[RALinkFixer] - Error fixing link", link, e);
      }
    });

    const googleSearchLinks = document.querySelectorAll('a[href^="https://www.google.com/search"], a[href^="https://google.com/search"], a[href^="http://www.google.com/search"], a[href^="http://google.com/search"]');
    googleSearchLinks.forEach(link => {
      try {
        link.href = rewriteGoogleSearchToEcosia(link.href);
      } catch (_) {
        // ignore
      }
    });
  }

  function onUrlChange() {
    // kleiner Delay, damit der neue DOM aufgebaut werden kann
    setTimeout(rewriteRedirects, 50);
  }



  // pushState / replaceState hooken
  const originalPushState = history.pushState;
  const originalReplaceState = history.replaceState;

  history.pushState = function (...args) {
    originalPushState.apply(this, args);
    if (location.href !== lastUrl) {
      lastUrl = location.href;
      onUrlChange();
    }
  };

  history.replaceState = function (...args) {
    originalReplaceState.apply(this, args);
    if (location.href !== lastUrl) {
      lastUrl = location.href;
      onUrlChange();
    }
  };

  // Browser zurück / vor
  window.addEventListener('popstate', () => {
    if (location.href !== lastUrl) {
      lastUrl = location.href;
      onUrlChange();
    }
  });

})();
