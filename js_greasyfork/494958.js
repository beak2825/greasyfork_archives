// ==UserScript==
// @name         Steam Wishlist Sorter
// @namespace    Violentmonkey Scripts
// @version      2.4
// @description  Sort Steam wishlist contents by review score and title, then save the new order.
// @autor        Vamos
// @match        https://store.steampowered.com/wishlist/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/494958/Steam%20Wishlist%20Sorter.user.js
// @updateURL https://update.greasyfork.org/scripts/494958/Steam%20Wishlist%20Sorter.meta.js
// ==/UserScript==

(function() {
  'use strict';

  function waitForWishlist() {
      return new Promise((resolve) => {
          const checkWishlist = () => {
              if (window.g_Wishlist && window.g_Wishlist.rgAllApps) {
                  resolve(window.g_Wishlist);
              } else {
                  setTimeout(checkWishlist, 500);
              }
          };
          checkWishlist();
      });
  }

  function exportWishlist(wishlist) {
      const wishlistArray = wishlist.rgAllApps.map(appId => {
          const app = window.g_rgAppInfo[appId];
          if (app) {
              return {
                  id: appId,
                  title: app.name,
                  reviewScore: app.review_score || 0
              };
          } else {
              return null;
          }
      }).filter(app => app !== null);

      wishlistArray.sort((a, b) => {
          if (a.reviewScore === b.reviewScore) {
              return a.title.localeCompare(b.title);
          }
          return b.reviewScore - a.reviewScore;
      });

      console.log(`[SWPS] Number of elements in the wishlist: ${wishlistArray.length}`);
      return wishlistArray;
  }

  function saveWishlistOrder(wishlistArray) {
      window.g_Wishlist.rgAllApps = wishlistArray.map(app => app.id);
      window.g_Wishlist.SaveOrder();
      console.log("[SWPS] Wishlist order saved.");
  }

  function addSortButton() {
      const button = document.createElement('button');
      button.innerText = 'Sort Wishlist';
      button.style.position = 'fixed';
      button.style.top = '10px';
      button.style.right = '10px';
      button.style.zIndex = '1000';
      document.body.appendChild(button);

      button.addEventListener('click', async () => {
          const wishlist = await waitForWishlist();
          const sortedWishlist = exportWishlist(wishlist);
          saveWishlistOrder(sortedWishlist);

          // Show spinner and block inputs
          const spinner = document.createElement('div');
          spinner.innerHTML = `
              <div style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.5); z-index: 1001; display: flex; align-items: center; justify-content: center;">
                  <div style="border: 16px solid #f3f3f3; border-top: 16px solid #3498db; border-radius: 50%; width: 120px; height: 120px; animation: spin 2s linear infinite;"></div>
              </div>
              <style>
                  @keyframes spin {
                      0% { transform: rotate(0deg); }
                      100% { transform: rotate(360deg); }
                  }
              </style>
          `;
          document.body.appendChild(spinner);

          // Wait for 5 seconds before reloading the page
          await new Promise(resolve => setTimeout(resolve, 5000));
          location.reload(); // Refresh the page
      });
  }

  waitForWishlist().then(() => {
      addSortButton();
  });
})();