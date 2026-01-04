// ==UserScript==
// @name         TurboSquid Paid Asset Tile Remover In Free Sections
// @namespace    https://www.turbosquid.com
// @version      1.0
// @license      MIT
// @description  Removes the paid asset tiles when the free tag is selected on TurboSquid
// @author       slysnake96 & ChatGPT
// @match        https://www.turbosquid.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/468882/TurboSquid%20Paid%20Asset%20Tile%20Remover%20In%20Free%20Sections.user.js
// @updateURL https://update.greasyfork.org/scripts/468882/TurboSquid%20Paid%20Asset%20Tile%20Remover%20In%20Free%20Sections.meta.js
// ==/UserScript==

(function() {
  'use strict';

  let removalExecuted = false;

  // Function to remove asset tiles
  function removeAssetTiles() {
    if (removalExecuted) {
      return; // Exit if removal has already been executed
    }

    console.log('Removing asset tiles...');

    // Get all the asset tiles on the webpage
    const assetTiles = document.querySelectorAll('div.search-lab.AssetTile-md.tile-large');

    // Loop through the asset tiles
    assetTiles.forEach(tile => {
      const priceElement = tile.querySelector('label.lightPrice');
      const priceText = priceElement ? priceElement.textContent.trim() : '';

      // Check if the tile represents a paid asset
      if (priceText !== 'Free' && priceText !== '$0') {
        // Remove the asset tile
        tile.remove();
        console.log('Asset tile removed:', tile);
      }
    });

    console.log('Asset tile removal complete.');
    removalExecuted = true;
  }

  // Check if the URL contains the word "free"
  if (window.location.href.includes('free')) {
    // Monitor for new content loaded via AJAX
    const observer = new MutationObserver(removeAssetTiles);
    const config = { childList: true, subtree: true };
    observer.observe(document.body, config);
    console.log('Observer started.');

    // Check and remove asset tiles at intervals
    const interval = setInterval(() => {
      if (document.readyState === 'complete') {
        removeAssetTiles();
        clearInterval(interval);
        console.log('Asset tile removal executed on page load.');
      }
    }, 1000);
  }
})();