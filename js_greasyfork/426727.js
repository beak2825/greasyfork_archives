// ==UserScript==
// @name         Add Saved Items to Cart
// @namespace    https://gist.github.com/beporter/ce76204bcba35d9edb66b395bb5e9305
// @version      0.5
// @description  Repeatedly refresh a given "saved items" page (Amazon, Walmart, BestBuy), look for specific "Add to Cart" buttons, click them if present, and make a lot of noise on success.
// @author       https://github.com/beporter
// @match        https://www.amazon.com/gp/registry/wishlist/*
// @match        https://www.amazon.com/hz/wishlist/ls/*
// @match        https://www.bestbuy.com/cart
// @match        https://www.bestbuy.com/site/customer/lists/manage/saveditems
// @match        https://www.walmart.com/lists*
// @grant        none
// @run-at       document-idle
// @require      https://cdnjs.cloudflare.com/ajax/libs/howler/2.1.3/howler.min.js#sha256-/Q4ZPy6sMbk627wHxuaWSIXS1y7D2KnMhsm/+od7ptE=
// @downloadURL https://update.greasyfork.org/scripts/426727/Add%20Saved%20Items%20to%20Cart.user.js
// @updateURL https://update.greasyfork.org/scripts/426727/Add%20Saved%20Items%20to%20Cart.meta.js
// ==/UserScript==
 
(function() {
  'use strict';

  const SELECTORS = [
      {
          site: 'Walmart',
          urls: ['https://www.walmart.com/lists'],
          selector: 'div.ListDetails button.RegularItemTile-add-to-cart',
          loadWait: 2,
          cooldown: 15, // Set to 0 to disable the refresh.
          active: true,
      },
      {
          site: 'BestBuy',
          urls: ['https://www.bestbuy.com/site/customer/lists/manage/saveditems'],
          selector: '#your-saved-items .add-to-cart-button button:not([disabled])',
          loadWait: 5,
          cooldown: 5,
          active: true,
      },
      {
          site: 'Amazon',
          urls: ['https://www.amazon.com/gp/registry/wishlist/', 'https://www.amazon.com/hz/wishlist/ls/'],
          selector: 'div#my-lists-tab span[data-action=add-to-cart] a[role=button]',
          loadWait: 5,
          cooldown: 5,
          active: true,
      },
  ];

  var readySound = new window.Howl({
    src: ['//freesound.org/data/previews/187/187404_635158-lq.mp3'],
    autoplay: false,
    loop: true,
    volume: 1.0,
  });

  // Scan the page for the provided selector and "click" them if present.
  function triggerClicks(sel) {
      var anyClicked = false;
      const buttons = document.querySelectorAll(sel.selector);

      // No available "Add to Cart" buttons. Cool down and refresh.
      if (!buttons.length) {
          console.log(`${sel.site}: No active "Add to Cart" buttons.`);
          return anyClicked;
      }

      buttons.forEach((b) => {
          var clickEvent = document.createEvent('MouseEvents');
          clickEvent.initEvent('click', true, true);
          b.dispatchEvent(clickEvent);
          console.log(`${sel.site}: Clicked "Add to Cart" button.`);
          anyClicked = true;
      });

      return anyClicked;
  }

  function refreshInSecs(secs) {
      console.log(`Scheduling page refresh in ${secs} secs.`);
      window.setTimeout(() => {
          window.location.reload(true);
      }, secs * 1000);
  }

  function waitToClick(sel, callback) {
      console.log(`Scheduling clicks for ${sel.site}.`);
      window.setTimeout(() => {
          callback(sel);
      }, sel.loadWait * 1000);
  }

  function locationStartsWithAnyOfUrls(urls) {
      return urls.reduce((acc, url) => {
          return acc || window.location.href.startsWith(url);
      }, false);
  }

  // function main()
  SELECTORS.forEach((sel) => {
      if (sel.active && locationStartsWithAnyOfUrls(sel.urls)) {
          waitToClick(sel, (sel) => {
              if (triggerClicks(sel)) {
                  readySound.play();
              } else if (sel.cooldown) {
                  refreshInSecs(sel.cooldown);
              }
          });
      }
  });

  window.addEventListener('popstate', function (event) {
    // Log the state data to the console
    console.log(event.state);
  });

})();