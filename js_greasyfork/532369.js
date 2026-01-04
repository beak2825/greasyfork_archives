// ==UserScript==
// @name         [MWI] Anti-Gambling Tool
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  Removes transmute gamble items from marketplace lol
// @author       Nex
// @match        https://www.milkywayidle.com/*
// @match        https://test.milkywayidle.com/*
// @license      MIT
// @icon         https://www.google.com/s2/favicons?sz=64&domain=milkywayidle.com
// @downloadURL https://update.greasyfork.org/scripts/532369/%5BMWI%5D%20Anti-Gambling%20Tool.user.js
// @updateURL https://update.greasyfork.org/scripts/532369/%5BMWI%5D%20Anti-Gambling%20Tool.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const GAMBLE_ITEM_HRIDS = [
    "/items/knights_aegis",
    "/items/bishops_codex",
    "/items/griffin_bulwark",
    "/items/royal_fire_robe_top",
    "/items/royal_fire_robe_bottoms",
    "/items/royal_nature_robe_top",
    "/items/royal_nature_robe_bottoms",
    "/items/royal_water_robe_top",
    "/items/royal_water_robe_bottoms",
    "/items/sunstone",
  ];

  const GAMBLE_ITEM_NAMES = [
    "Knight's Aegis",
    "Bishop's Codex",
    "Griffin Bulwark",
    "Royal Fire Robe Top",
    "Royal Fire Robe Bottoms",
    "Royal Nature Robe Top",
    "Royal Nature Robe Bottoms",
    "Royal Water Robe Top",
    "Royal Water Robe Bottoms",
    "Sunstone"
  ]
  // Add this CSS once to ensure hidden elements stay hidden
  const hideCSS = `
      [data-permanently-hidden] {
          display: none !important;
          visibility: hidden !important;
          opacity: 0 !important;
          pointer-events: none !important;
          position: absolute !important;
          height: 0 !important;
          width: 0 !important;
          margin: 0 !important;
          padding: 0 !important;
          border: 0 !important;
      }
  `;
  document.head.insertAdjacentHTML('beforeend', `<style id="permanent-hide-style">${hideCSS}</style>`);

  function getParentDivs(element, levels) {
      let current = element;
      for (let i = 0; i < levels; i++) {
        if (!current.parentElement) return null;
        current = current.parentElement;
        // Ensure we're only counting div elements
        while (current && current.tagName !== 'DIV') {
          current = current.parentElement;
          if (!current) return null;
        }
      }
      return current;
    }

    function permanentlyHideItemsByAriaLabel(hiddenNames, debug = true) {
       if (debug) console.log('[PERMA-HIDE] Starting with items:', hiddenNames);

       const processItems = (items) => {
         let hiddenCount = 0;

         items.forEach(svg => {
           const itemName = svg.getAttribute('aria-label');
           if (hiddenNames.includes(itemName)) {
             // Go up exactly 6 div levels (adjust this number as needed)
             const container = getParentDivs(svg, 4);
             if (container) {
               container.setAttribute('data-permanently-hidden', 'true');
               hiddenCount++;
               if (debug) console.log(`[PERMA-HIDE] Permanently hidden "${itemName}"`);
             } else if (debug) {
               console.warn(`[PERMA-HIDE] Could not find container 4 levels up for "${itemName}"`);
             }
           }
         });

         return hiddenCount;
       };

       // MutationObserver setup remains the same
       const observer = new MutationObserver((mutations) => {
         mutations.forEach(mutation => {
           mutation.addedNodes.forEach(node => {
             if (node.nodeType === 1) {
               const newItems = node.querySelectorAll?.('svg[aria-label]') || [];
               const count = processItems(newItems);
               if (debug && count > 0) {
                 console.log(`[PERMA-HIDE] Hid ${count} new dynamically added items`);
               }
             }
           });
         });
       });

       observer.observe(document.body, {
         childList: true,
         subtree: true
       });

       // Process initial items
       const initialItems = document.querySelectorAll('svg[aria-label]');
       const totalHidden = processItems(initialItems);

       if (debug) {
         console.log(`[PERMA-HIDE] Complete. Initially hid ${totalHidden} items`);
         console.log('[PERMA-HIDE] Now watching for new items...');
       }

       return {
         stop: () => {
           observer.disconnect();
           if (debug) console.log('[PERMA-HIDE] Stopped watching for new items');
         }
       };
     }

  // Example usage - will continue working even if new items load later
  const hideManager = permanentlyHideItemsByAriaLabel(GAMBLE_ITEM_NAMES, false);

  // To stop watching (if needed):
  // hideManager.stop();

})();
