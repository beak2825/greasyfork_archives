// ==UserScript==
// @name         Market Monitor
// @namespace    http://tampermonkey.net/
// @version      0.0.2
// @license MIT
// @description  Buy items from market for a good price
// @author       Serhii T
// @include      http*://*.the-west.*/game.php*
// @include      http*://*.the-west.*.*/game.php*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/493874/Market%20Monitor.user.js
// @updateURL https://update.greasyfork.org/scripts/493874/Market%20Monitor.meta.js
// ==/UserScript==

(function() {
  const botToken = "7194106399:AAHjteUE6YljOAOLU5ILdGVRQXwtcEgWt5k";
  const chatId = -732543551;
  const DEFAULT_SCAN_MARKET_PATTERN = "раскатистой";
  const VISIBILITY_WORLD = 2;

  const itemsToBuy = [
    { itemId: 53876000, price: 100000 }, // голова
    { itemId: 53877000, price: 100000 }, // шея
    { itemId: 53878000, price: 800000 }, // туловище
    { itemId: 53879000, price: 500000 }, // пояс
    { itemId: 53880000, price: 800000 }, // штаны
    { itemId: 53881000, price: 500000 }, // ботинки
    { itemId: 53885000, price: 800000 }, // пистоль
    { itemId: 53884000, price: 800000 }, // нож
    { itemId: 53886000, price: 1500000 }, // ружье
  ];

  function startToScanMarket() {
    // Random timeout between 3 and 5 minutes
    const randomInterval = Math.floor(Math.random() * 120000) + 180000;

    scanMarket(DEFAULT_SCAN_MARKET_PATTERN);

    // schedule next scan
    setTimeout(startToScanMarket, randomInterval);
  }

  function scanMarket(searchPattern) {
    Ajax.remoteCall("building_market", "search", {
      pattern: searchPattern,
      nav: "first",
      page: 1,
      sort: "buynow",
      order: "asc", // from low to high
      level_range_min: 0,
      usable: true,
      has_effect: false,
      visibility: VISIBILITY_WORLD
    }, function (data) {
      if (data.error == false && data.msg.search_result.length) {
        console.log('Found items on marker: ', data.msg.search_result)
        itemsToBuy.forEach(function (itemToBuy) {
          data.msg.search_result
            .filter(function (searchResultItem) {
              return itemToBuy.itemId === searchResultItem.item_id
                && searchResultItem.max_price !== null // ignore items without price to buy
                && searchResultItem.seller_name !== Character.name // ignore items from yourself
                && searchResultItem.sell_rights === VISIBILITY_WORLD // ignore items for alliance and town
                && searchResultItem.description === '' // ignore items with description
                && (itemToBuy.price) > (searchResultItem.max_price / searchResultItem.item_count)
            })
            .forEach(function (searchResultItem) {
              console.log("Buying ", searchResultItem);

              buyItem(searchResultItem.market_offer_id, searchResultItem.max_price, getNotificationCallback(searchResultItem));
            })
        })

      } else {
        console.log("Items not found: " + JSON.stringify(data.msg));
      }
    }, null)
  }

  function buyItem(offerId, price, notificationCallback) {
    Ajax.remoteCall("building_market", "bid", {
      bidtype: 0, // by cash
      bid: price,
      market_offer_id: offerId
    }, function (data) {
      if (data.error == false && data.msg.instantBuy) {
        console.log("Item was bought!");
        notificationCallback();
      } else {
        console.error("buyItem error: " + data.msg);
      }
    }, null)
  }

  function getNotificationCallback(searchResultItem) {
    return function () {
      const item = ItemManager.get(searchResultItem.item_id);
      const buyerInfo = searchResultItem.description ? `${searchResultItem.description}, обламайся!` : '';
      const message = `${Character.name} (${Game.worldName}) выгодно купил ${item.name} за $${searchResultItem.max_price}. ${searchResultItem.seller_name} спасибо! ${buyerInfo}`;
      fetch(`https://api.telegram.org/bot${botToken}/sendMessage?chat_id=${chatId}&text=${message}`);
    }
  }

  $(document).ready(async () => {
    try {
      startToScanMarket();
    } catch (err) {
      console.log(err.stack);
    }
  });
})();
