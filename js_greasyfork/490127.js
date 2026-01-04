// ==UserScript==
// @name         Moonbounce Networth Calculator
// @namespace    https://github.com/diary001/moonbounce
// @supportURL   https://discord.gg/pixel
// @license      MIT
// @version      1.0.1
// @description  Adds the diffuse price of all the items in your inventory and displays how much everything is worth. ((made with <3 by lune))
// @author       lune / linktr.ee/moon
// @match        *://moonbounce.gg/*
// @icon         https://framerusercontent.com/images/iuVZmsE2sifPExZXNrETQrDkU.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/490127/Moonbounce%20Networth%20Calculator.user.js
// @updateURL https://update.greasyfork.org/scripts/490127/Moonbounce%20Networth%20Calculator.meta.js
// ==/UserScript==


(function() {
  'use strict';

  function updateAllItemsText(totalValue) {
    const allItemsElement = document.querySelector('div._text-xl_128i6_229._neutral-700_128i6_727._semibold_128i6_30');
    if (allItemsElement) {
      allItemsElement.textContent = `All Items Worth ${totalValue} MP`;
    }
  }

  function fetchAndUpdateData() {
    fetch('https://moonbounce.gg/u/@me/backpack?_data=routes%2Fu.%5B%40me%5D%2B%2Fbackpack%2B%2F_index')
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('API request failed');
        }
      })
      .then(data => {
        if (data.hasOwnProperty('batched')) {
          const items = data.batched;
          let totalValue = 0;
          for (let item of items) {
            totalValue += item.stack * item.alch_price;
          }
          updateAllItemsText(totalValue);
        }
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }

  function observeDOM() {
    const targetNode = document.body;
    const observerOptions = {
      childList: true,
      subtree: true
    };
    const observer = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        if (mutation.type === 'childList') {
          const allItemsElement = document.querySelector('div._text-xl_128i6_229._neutral-700_128i6_727._semibold_128i6_30');
          if (allItemsElement) {
            fetchAndUpdateData();
          }
        }
      });
    });
    observer.observe(targetNode, observerOptions);
  }

  function checkAndUpdateText() {
    const allItemsElement = document.querySelector('div._text-xl_128i6_229._neutral-700_128i6_727._semibold_128i6_30');
    if (allItemsElement && allItemsElement.textContent === 'All Items') {
      fetchAndUpdateData();
    }
  }

  observeDOM();
  fetchAndUpdateData();
  setInterval(checkAndUpdateText, 500);
})();
