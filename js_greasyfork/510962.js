// ==UserScript==
// @name         Link Extractor
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  Extract and display links from web sites pages based on specific patterns
// @author       SijosxStudio
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/510962/Link%20Extractor.user.js
// @updateURL https://update.greasyfork.org/scripts/510962/Link%20Extractor.meta.js
// ==/UserScript==

(function() {
  'use strict';

  console.log('Link Extractor started');

  // Define URL patterns to match specific links
  const patterns = [
      'https://*/.*',
  ];

  // Function to check if a URL matches any of the defined patterns
  function matchesPattern(url) {
      return patterns.some(pattern => {
          const regex = new RegExp(pattern);
          const matches = regex.test(url);
          console.log(`Checking ${url} against pattern ${pattern}: ${matches}`);
          return matches;
      });
  }

  // Regex to find URL-like strings within page text
  const urlRegex = /https?:\/\/[^ "]+/g;

  // Create an overlay to display matching links
  const overlay = document.createElement('div');
  overlay.style = 'position: fixed; top: 10px; right: 10px; min-width: 300px; max-height: calc(100vh - 20px); background: rgba(255, 255, 255, 0.9); color: #333; padding: 15px; border: 1px solid #ccc; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.1); z-index: 9999; white-space: nowrap; overflow-y: auto; font-size: 14px; font-family: Arial, sans-serif;';
  document.body.appendChild(overlay); // Append overlay to body

  // Function to extract URLs from text and non-text elements
  function extractURLs() {
      const urls = [];

      // Extract URLs from text nodes
      const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
      let node;
      while (node = walker.nextNode()) {
          const matches = node.textContent.match(urlRegex);
          if (matches) {
              urls.push(...matches);
          }
      }

      // Extract URLs from non-text elements (e.g., <a>, <iframe>, <p>)
      const elements = document.querySelectorAll('a[href], iframe[src]');
      elements.forEach(element => {
          const url = element.getAttribute('href') || element.getAttribute('src');
          if (url) {
              urls.push(url);
          }
      });

      return urls;
  }

  let isUpdating = false; // Flag to track if the update function is currently executing

  // Function to update the overlay with matching links
  function updateOverlay() {
      if (isUpdating) return; // Skip if the function is already executing

      isUpdating = true; // Set the flag to true to prevent recursive calls

      // Temporarily disconnect the observer to avoid triggering it during overlay update
      observer.disconnect();

      console.log('Updating overlay...');
      const potentialUrls = extractURLs(); // Extract URLs from text and non-text elements
      console.log('Potential URLs:', potentialUrls);
      const links = potentialUrls.filter(url => matchesPattern(url)); // Filter URLs by pattern
      console.log('Matching URLs:', links);

      // Clear previous content
      overlay.textContent = '';

      if (links.length > 0) {
          const ul = document.createElement('ul');
          links.forEach(link => {
              const li = document.createElement('li');
              const a = document.createElement('a');
              a.href = link;
              a.textContent = link;
              a.style.color = 'lightblue';
              li.appendChild(a);
              ul.appendChild(li);
          });
          overlay.appendChild(ul);
      } else {
          overlay.textContent = 'No matching links found.';
      }

      // Adjust width to fit content or screen width
      overlay.style.width = `${Math.min(overlay.offsetWidth, window.innerWidth)}px`;

      isUpdating = false; // Reset the flag after the update is complete

      // Reconnect the observer after updating the overlay
      observer.observe(document.body, { childList: true, subtree: true });
  }

  // Use a mutation observer to detect changes to the DOM
  const observer = new MutationObserver(() => {
    clearTimeout(updateTimeout); // Clear the previous timeout
    updateTimeout = setTimeout(updateOverlay, 500); // Set a new timeout
});

// Initial update
updateOverlay();
})();