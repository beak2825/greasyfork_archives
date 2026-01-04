// ==UserScript==
// @name        Item & set building Tracker
// @namespace   Violentmonkey Scripts
// @match       https://www.torn.com/item.php
// @grant       none
// @version     1.0
// @author      Terekhov
// @description 12/4/2023, 12:37:48 PM
// @downloadURL https://update.greasyfork.org/scripts/482000/Item%20%20set%20building%20Tracker.user.js
// @updateURL https://update.greasyfork.org/scripts/482000/Item%20%20set%20building%20Tracker.meta.js
// ==/UserScript==

(function() {
  'use strict';

  const countUpdatesChannel = new BroadcastChannel("itemCountUpdates");

  const colorHaveEnough = '#E0E0E0';
  const colorNeedMore = '#FFFFCC';
  const lsKey_itemInventoryCountsToGoBaseKey = '__itemInventoryCountsToGo';

  const dataTypeToMarketCatMappings = {
    // Item Data Type: 'market category'
    Flower: 'flowers',
    Plushie: 'plushies'
  }

  /**
   * This map uses the market tab's 'data-cat' attribute as the top-level keys
   *
   * See {@link #getActiveMarketTab} to see how to find market tabs
   */
  const itemCrossReference = {
    flowers: {
      defaultNumItemsToTarget: 250,
      marketDivId: 'flowers',
      itemsDataType: 'Flower',
      idToItemPriceNameMappings: {
        '129' : 'dozenRoses',
        '97' : 'bunchOfFlowers',
        '184' : 'bunchOfBlackRoses',
        '183' : 'singleRedRose',
        '260' : 'dahlia',
        '263' : 'crocus',
        '617' : 'bananaOrchid',
        '264' : 'orchid',
        '272' : 'edelweiss',
        '267' : 'heather',
        '271' : 'ceiboFlower',
        '277' : 'cherryBlossom',
        '282' : 'africanViolet',
        '276' : 'peony',
        '385' : 'tribulus',
      }
    },
    plushies: {
      defaultNumItemsToTarget: 500,
      marketDivId: 'plushies',
      itemsDataType: 'Plushie',
      idToItemPriceNameMappings: {
        '215': 'kitten',
        '186': 'sheep',
        '187': 'teddyBear',
        '618': 'stingray',
        '261': 'wolverine',
        '273': 'chamois',
        '258': 'jaguar',
        '266': 'nessie',
        '268': 'redFox',
        '269': 'monkey',
        '274': 'panda',
        '281': 'lion',
        '384': 'camel'
      }
    }
  };

  function getCurrentlySelectedItemCategory() {
    const itemCategories = document.querySelector('#categoriesList').children;
    for (let i = 0; i < itemCategories.length; i++) {
      if (itemCategories[i] && itemCategories[i].getAttribute('aria-selected') === 'true') {
        return itemCategories[i];
      }
    }
    return null;
  }
  function getCurrentlyOpenItemsList() {
    const itemsLists = document.querySelectorAll('.itemsList')
    for (let list of itemsLists) {
      if (list.getAttribute('aria-expanded') === 'true') {
        return list;
      }
    }
    return null;
  }

  // Initial load
  setTimeout(syncItemInfo, 650);

  // Handle changing of selected category
  document.querySelector('#categoriesList').addEventListener('click', () => {
    setTimeout(syncItemInfo, 650);
  });

  function syncItemInfo() {
    const selectedCategory = getCurrentlySelectedItemCategory().getAttribute('data-type');
    const xrefKey = dataTypeToMarketCatMappings[selectedCategory];
    if (!xrefKey) {
      console.log(`syncItemInfo() :: Category not registered: ${selectedCategory}`);
      return;
    }

    //
    // Set the number of items we're targeting
    //
    const numItemsToTarget = itemCrossReference[xrefKey].defaultNumItemsToTarget;
    if (!numItemsToTarget && numItemsToTarget !== 0) {
      console.log(`syncItemInfo() :: Number of items to target not set for: ${selectedCategory}`);
      return;
    }
    const individualItemsBeingTracked = Object.keys(itemCrossReference[xrefKey].idToItemPriceNameMappings);
    let countsToGo = {};
    for (let itemId of individualItemsBeingTracked) {
      countsToGo[itemId] = numItemsToTarget;
    }

    //
    // Sometimes we don't track all items in an item category.
    // For example, there are more plushies/flowers than are in the sets.
    //
    // We don't care about the extra ones, so we don't do anything with those (hence the 'continue')
    //

    for (let itemListRow of getCurrentlyOpenItemsList().children) {
      const itemId = `${itemListRow.getAttribute('data-item')}`;
      if (individualItemsBeingTracked.indexOf(itemId) === -1) {
        continue;
      }

      let itemNameNode = itemListRow.children[1].children[0].children[1].children[1];
      if (itemNameNode.textContent.startsWith('need')) {
        itemNameNode.textContent = itemNameNode.textContent.substring(itemNameNode.textContent.indexOf('|| ') + 3);
      }
      let amountNode = itemListRow.children[1].children[0].children[1].children[2];

      // 'x200' --> 200
      let amount = +amountNode.textContent.replace('x', '').trim();
      const numToGo = numItemsToTarget - amount;
      const haveEnough = (numToGo <= 0);
      if (haveEnough) {
        countsToGo[itemId] = 0;
        itemListRow.style.backgroundColor = colorHaveEnough;
      } else {
        countsToGo[itemId] = numToGo;
        itemListRow.style.backgroundColor = colorNeedMore;
        itemNameNode.textContent = `need ${numToGo} || ${itemNameNode.textContent}`;
      }
    }
    localStorage.setItem(`${lsKey_itemInventoryCountsToGoBaseKey}_${xrefKey}`, JSON.stringify(countsToGo));
    countUpdatesChannel.postMessage(countsToGo);
  }

})();
