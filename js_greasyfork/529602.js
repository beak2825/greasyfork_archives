// ==UserScript==
// @name        GOG: Static and Better Page Titles
// @namespace   Violentmonkey Scripts
// @match       https://www.gog.com/*
// @grant       none
// @version     1.0
// @author      GreasyBastard
// @license     AGPLv3
// @description Disable annoying dynamic updates to page titles and improve them overall.
// @downloadURL https://update.greasyfork.org/scripts/529602/GOG%3A%20Static%20and%20Better%20Page%20Titles.user.js
// @updateURL https://update.greasyfork.org/scripts/529602/GOG%3A%20Static%20and%20Better%20Page%20Titles.meta.js
// ==/UserScript==

(function() {
  'use strict';

  // Function to set the title based on og:title meta tag
  const setTitleFromMetaTag = () => {
    const metaTag = document.querySelector('meta[property="og:title"]');
    if (metaTag && metaTag.content) {
      document.title = metaTag.content;
    }
  };

  // Function to set the title based on the query parameter
  const setTitleFromQueryParam = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const queryTerm = urlParams.get('query');
    if (queryTerm) {
      document.title = `> ${decodeURIComponent(queryTerm)}`;
    }
  };

  // Function to set the title from the first h1 tag for non-game paths
  const setTitleFromFirstH1 = () => {
    const pathPart = window.location.pathname.split('/')[3]; // Extract the 3rd part of the URL path
    if (pathPart && pathPart !== 'game' && pathPart !== 'games') {
      const firstH1 = document.querySelector('h1');
      if (firstH1) {
        document.title = firstH1.textContent.trim();
      }
    }
  };

  // Function to set the title to "GOG.com" for homepage or /en/ root
  const setTitleForHomepage = () => {
    const pathParts = window.location.pathname.split('/').filter(part => part.trim() !== '');
    console.log('Path Parts:', pathParts);  // Debugging output to check the pathname parts
    if (pathParts.length <= 1) { // This should cover "/" and "/en/"
      document.title = "GOG.com";
    }
  };

  // Function to set the title to the error code for error pages (like /404, /403, etc.)
  const setTitleForErrorPage = () => {
    const pathParts = window.location.pathname.split('/').filter(part => part.trim() !== '');
    const errorCode = pathParts[pathParts.length - 1];  // The last part of the URL path

    // Check if the last part of the path is a number (error code like 404, 403, etc.)
    if (!isNaN(errorCode)) {
      document.title = `Error ${errorCode}`;
    }
  };

  // Function to lock the document title
  const lockTitle = () => {
    const originalTitle = document.title;
    Object.defineProperty(document, 'title', {
      configurable: false,
      enumerable: true,
      get: () => originalTitle,
      set: () => {}
    });
  };

  // Initialize
  setTitleForHomepage();
  setTitleFromMetaTag();
  setTitleFromQueryParam();
  setTitleFromFirstH1();
  setTitleForErrorPage();
  lockTitle();
})();

