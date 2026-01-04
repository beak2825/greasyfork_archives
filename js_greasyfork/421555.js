// ==UserScript==
// @name          eBay: price to title
// @description   Adds product price to the tab title
// @version       2.1.3
// @match         https://www.ebay.com/
// @include       /^http(s|):\/\/www\.ebay\.(at|ca|fr|de|it|ie|pl|ph|nl|ch|es|co\.uk|com\.(au|hk|my|sg))\/(itm|p)\/.*$/
// @author        Konf
// @namespace     https://greasyfork.org/users/424058
// @compatible    Chrome
// @compatible    Opera
// @compatible    Firefox
// @icon          https://www.google.com/s2/favicons?domain=ebay.com&sz=16
// @require       https://cdnjs.cloudflare.com/ajax/libs/arrive/2.4.1/arrive.min.js
// @run-at        document-body
// @grant         none
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/421555/eBay%3A%20price%20to%20title.user.js
// @updateURL https://update.greasyfork.org/scripts/421555/eBay%3A%20price%20to%20title.meta.js
// ==/UserScript==

/* jshint esversion: 6 */

(function() {
  'use strict';

  let titleCopy = '';
  let priceCopy = '';
  let bidsCopy = '';
  let deliveryCopy = '';

  const divider = ' - ';

  function updateTitle() {
    const priceCurrency = priceCopy.split(' ')[0];

    const priceVal = priceCopy.split(' ')[1] || '';
    const shortPriceVal = priceVal.slice(-3) === ',00' ? priceVal.slice(0, -3) : priceVal;
    const numPriceVal = Number(shortPriceVal.replace(',', '.'));

    const deliveryVal = deliveryCopy.split(' ')[1] || '';
    const shortDelVal = deliveryVal.slice(-3) === ',00' ? deliveryVal.slice(0, -3) : deliveryVal;
    const numDelVal = Number(shortDelVal.replace(',', '.'));

    const price = priceCurrency + ' ' + ((numPriceVal + numDelVal) + '').replace('.', ',');
    const bids = bidsCopy ? divider + bidsCopy + 'b' : '';

    document.title = `${price}${bids}${divider}${titleCopy}`;
  }

  const matchings = [
    // ebay/itm
    {
      timer: {
        belonging: null,
        number: null
      },
      queriesByPriority: [
        {
          priority: 1,
          query: 'span#prcIsum_bidPrice' // start price
        },
        {
          priority: 2,
          query: 'span#prcIsum' // price
        }
      ],
      handler: (aNode) => {
        const price = aNode.innerText;
        if (!price) return;

        priceCopy = price;
        updateTitle();
      }
    },
    {
      timer: {},
      queriesByPriority: [
        {
          priority: 1,
          query: 'span#qty-test' // bids
        }
      ],
      handler: (aNode) => {
        const bidsCount = aNode.innerText;
        if (!bidsCount) return;

        bidsCopy = bidsCount;
        updateTitle();
      }
    },

    // ebay - short itm
    {
      timer: {},
      queriesByPriority: [
        {
          priority: 1,
          query: 'span.vi-VR-cvipPrice' // price
        }
      ],
      handler: (aNode) => {
        const price = aNode.innerText;
        if (!price) return;

        priceCopy = price;
        updateTitle();
      }
    },
    {
      timer: {},
      queriesByPriority: [
        {
          priority: 1,
          query: 'a#vi-VR-bid-lnk > span:first-child' // bids
        }
      ],
      handler: (aNode) => {
        const bidsCount = Number(aNode.innerText);
        if (!bidsCount) return;

        bidsCopy = bidsCount;
        updateTitle();
      }
    },

    // ebay/p
    {
      timer: {},
      queriesByPriority: [
        {
          priority: 1,
          query: 'div.display-price' // price
        }
      ],
      handler: (aNode) => {
        const price = aNode.innerText;
        if (!price) return;

        priceCopy = price;
        updateTitle();
      }
    },
    {
      timer: {},
      queriesByPriority: [
        {
          priority: 1,
          query: 'span.bid-count' // bids
        }
      ],
      handler: (aNode) => {
        const bidsCount = Number(aNode.innerText.split(' ')[0]);
        if (!bidsCount) return;

        bidsCopy = bidsCount;
        updateTitle();
      }
    },
    {
      timer: {},
      queriesByPriority: [
        {
          priority: 1,
          query: 'span.logistics-cost' // delivery cost
        }
      ],
      handler: (aNode) => {
        const deliveryCaptionArr = aNode.innerText.split(' ');
        const deliveryCost = deliveryCaptionArr[1] + ' ' + deliveryCaptionArr[2];
        if (!deliveryCost) return;

        deliveryCopy = deliveryCost;
        updateTitle();
      }
    },
  ];

  document.arrive('title', {
    onceOnly: true,
    existing: true
  }, () => { titleCopy = document.title });

  matchings.forEach(matching => {
    matching.queriesByPriority.forEach(entity => {
      document.arrive(entity.query, { existing: true }, (aNode) => {

        if (matching.timer.number) {
          const processingPriority = matching.timer.belonging.priority;

          if (processingPriority < entity.priority) return;
          clearTimeout(matching.timer.number);
        }

        matching.timer.belonging = entity;
        matching.timer.number = setTimeout(() => {
          try {
            matching.handler(aNode);
          } catch(e) {
            console.error(e);
          } finally {
            matching.queriesByPriority.forEach(entity => {
              document.unbindArrive(entity.query);
            });
          }
        }, 500);
      });
    });
  });

})();
