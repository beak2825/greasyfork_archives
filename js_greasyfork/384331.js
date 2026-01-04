// ==UserScript==
// @name         Auction House Price Viewer
// @namespace    LordBusiness.AHPV
// @version      1.1.1
// @description  Shows you the lowest market price of an item while in the auction house.
// @author       LordBusiness [2052465]
// @match        https://www.torn.com/amarket.php
// @run-at       document-end
// @connect      api.torn.com
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/384331/Auction%20House%20Price%20Viewer.user.js
// @updateURL https://update.greasyfork.org/scripts/384331/Auction%20House%20Price%20Viewer.meta.js
// ==/UserScript==

const APIkey = 'Mx1ByrR3oCGFwfx8';

GM_addStyle(`
    .items-list > li > .c-bid-wrap {
        cursor: pointer;
    }
`);

(function() {
    'use strict';


    // Saves values that are retreived from that API
    let lowestPrices = {}

    // This rendition of fetch can bypass the CSP.
    const unsafeFetch = url => new Promise((resolve, reject) => GM_xmlhttpRequest({
              method: 'GET',
              url: url,
              responseType: 'json',
              onload: response => resolve(response.response),
              onerror: err => reject(err)
          })),

          // Display value to user
          displayValue = (value, placeholder) => {
              // If integer, check if max integer (this means there were no items for sale). Else just return a properly formatted string.
              if(Number.isInteger(value)) value = value == Number.MAX_SAFE_INTEGER ? 'Not on the market yet' : `Price: \$${value.toLocaleString()}`

              // JQUERY BELOW! EXTREMELY TOXIC! KEEP OUT!
              $( placeholder )
                  .trigger('mouseleave')
                  .prop('title', value)
                  .trigger('mouseenter');
              // JQUERY ABOVE! EXTREMELY TOXIC! KEEP OUT!
          },

          // Get the lowest price when given an object with market costs
          getlowestPrice = market => {
              // return biggest value possible if there is nothing for sale
              if (market === null) return Number.MAX_SAFE_INTEGER;

              // Push all costs into an array
              let costs = [];
              for(const { cost } of Object.values(market)) costs.push(cost);
              return Math.min(...costs);
          },

          // Get lowest price from API
          checkPriceOnHover = event => {

              // Get the target hover elemnt and item ID
              const hoverDiv = event.target,
                    itemID = hoverDiv.parentNode.querySelector('[item]').getAttribute('item');

              // if click, redirect to relevant item page
              if(event.type == 'click') {
                  location.href = `https://www.torn.com/imarket.php#/p=shop&type=${itemID}`;
                  return;
              }

              // Memoization
              if(itemID in lowestPrices) {
                  displayValue(lowestPrices[itemID], hoverDiv);
                  return;
              }

              // Get prices from Torn API
              unsafeFetch(`https://api.torn.com/market/${itemID}?selections=bazaar,itemmarket&key=${APIkey}`)
              .then(async response => {
                  if(response.error) return response.error.error;

                  const lowestBazaarPrice = getlowestPrice(response.bazaar),
                        lowestItemmarketPrice = getlowestPrice(response.itemmarket);

                  return Math.min(lowestBazaarPrice, lowestItemmarketPrice);
              })
              .then(lowestPrice => {
                  lowestPrices[itemID] = lowestPrice;
                  displayValue(lowestPrice, hoverDiv);
              })
              .catch(err => console.log(err));
          },

          // Mutation Observer config. We only want to observe children, i.e., the respective items.
          mutationConfig = {
              childList: true
          },

          // Event Listener Config. We want the listener to be invoked at most once.
          eventListenerConfig = {
              once: true
          },

          // Mutation Observer
          auctionObserver = new MutationObserver(mutationList => {
              for(const mutationRecord of mutationList) {
                  for(const addedNode of mutationRecord.addedNodes) {
                      if(addedNode.id && !addedNode.classList.contains('itemPriceHover')) {
                          addedNode.querySelector('.c-bid-wrap').addEventListener('click', checkPriceOnHover);
                          addedNode.querySelector('.c-bid-wrap').addEventListener('mouseenter', checkPriceOnHover, eventListenerConfig);
                          addedNode.classList.add('itemPriceHover');
                      }
                  }
              }
          }),

          // Get item lists (there are 5 -- one for each rarity)
          itemsLists = document.querySelectorAll('.items-list');

    // Loop through item lists and add a MutationObserver to each one.
    for(const itemsList of itemsLists) {
        auctionObserver.observe(itemsList, mutationConfig);
    }

})();