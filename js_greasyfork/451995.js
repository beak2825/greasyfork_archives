// ==UserScript==
// @name         Steam Market Purchase
// @version      0.3.3
// @description  Level your steam account via the market
// @author       You
// @match        https://steamcommunity.com/market/multibuy*
// @match        https://steamcommunity.com/*/gamecards/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=steamcommunity.com
// @grant   GM_getValue
// @grant   GM_setValue
// @require      http://code.jquery.com/jquery-3.4.1.min.js
// @license MIT
// @namespace http://tampermonkey.net/
// @downloadURL https://update.greasyfork.org/scripts/451995/Steam%20Market%20Purchase.user.js
// @updateURL https://update.greasyfork.org/scripts/451995/Steam%20Market%20Purchase.meta.js
// ==/UserScript==

/* eslint-disable no-param-reassign */
/* eslint-disable no-undef */
/* eslint-disable no-restricted-globals */

const refreshPage = () => {
  // ensure reloading from server instead of cache
  location.reload(true);
};

const delayRefreshPage = (mileSeconds) => {
  window.setTimeout(refreshPage, mileSeconds);
};

// Pasted from stackoverflow
// Returns true if it is a DOM element
const isElement = (o) => (
  typeof HTMLElement === 'object' ? o instanceof HTMLElement // DOM2
    : o && typeof o === 'object' && o !== null && o.nodeType === 1 && typeof o.nodeName === 'string'
);

const isValidPrice = (price) => {
  // return if its undefined
  if (!price) return false;
  // false if its not a string
  if (typeof price !== 'string') return false;

  // check if it is a comma price
  if (price.includes(',')) {
    return true;
  }

  return false;
};

const cleanWhiteSpace = (str) => str.replace(/\s/g, '');

const multibuy = (body, badgeInfo) => {
  console.log('getting badgeInfo', badgeId);

  if (body.match(/An error was encountered while processing your request:/) || body.match(/Bei der Kommunikation mit den Steam-Servern ist ein Fehler aufgetreten. Bitte versuchen Sie es später erneut./)) {
    return delayRefreshPage(1000);
  }

  // find card info in array of badgeinfo

  const prices = $('.market_multi_price');
  const quantities = $('.market_multi_quantity');
  let currency;
  let addedPrice = 0;

  Object.entries(prices).forEach(([, value]) => {
    if (!isValidPrice(value.value)) return;

    // remove TL from price
    // get currency
    currency = value.value.split(' ')[1];

    const currentPrice = parseFloat(((value.value).replace(currency, '')).replace(',', '.'));
    console.log(currency, currentPrice);

    // if the price is above 3.5 TL display a error message
    addedPrice += currentPrice;
  });

  addedPrice = addedPrice.toFixed(2);

  if (addedPrice > 3.5) {
    const placeOrderButton = document.getElementById('market_multibuy_purchase');
    placeOrderButton.style['pointer-events'] = 'none';
    placeOrderButton.innerHTML = `Price is too high ${addedPrice} ${currency}`;

    return false;
  }

  Object.entries(quantities).forEach(([, node]) => {
    if (!isElement(node)) return;
    // eslint-disable-next-line no-unused-vars
    const cardInfo = badgeInfo.cards.find(
      (card) => card.name === cleanWhiteSpace($(node).parent().next().text()),
    );

    node.value = cardInfo.buyCount;
  });

  Object.entries(prices).forEach(([, value]) => {
    if (!isValidPrice(value.value)) return;
    // add A comma price to the TL price
    const currentPrice = parseFloat(((value.value).replace(currency, '')).replace(',', '.'));

    const newPrice = currentPrice + 0.2;

    value.value = `${(newPrice.toFixed(2)).toString()} ${currency}`;
  });
};

const storeData = (badgeId) => {
  const cards = $('.badge_card_set_card');
  const badge = $('.badge_info_description');

  const badgeInfo = {
    level: 0,
    cards: [],
  };

  if (badge[0]?.innerText) {
    // eslint-disable-next-line prefer-destructuring
    badgeInfo.level = badge[0].innerText.match(/Level (\d+)/)[1];
  }

  Object.entries(cards).forEach(([, node]) => {
    if (!isElement(node)) return;

    const divs = node.getElementsByClassName('badge_card_set_text');
    const cardInfo = {
      buyCount: 5,
    };

    Object.entries(divs).forEach(([, children]) => {
      const htmlClass = children.className;

      if (htmlClass.includes('badge_card_set_title')) {
        cardInfo.name = cleanWhiteSpace(children.innerText.replace(/(.*?)\n/, ''));

        // split the number of owned and max badges from the text
        const currentlyOwned = children.innerText.match(/\((.*?)\)/);
        if (currentlyOwned) {
          cardInfo.buyCount -= currentlyOwned[1];
        }
      }
    });

    cardInfo.buyCount -= badgeInfo.level;

    badgeInfo.cards.push(cardInfo);
  });

  console.log('setting badgeInfo', badgeId, badgeInfo);

  GM_setValue(badgeId, badgeInfo);
};

$(document).ready(async () => {
  const url = $(location).attr('href');
  const body = $('body').text();

  if (url.includes('steamcommunity.com/market/multibuy')) {
    const badgeInfo = await GM_getValue(url.match(/\[\]=(.*?)-/)?.[1]);

    multibuy(body, badgeInfo);
  } else {
    // match numbers behind /
    // get badgeInfo from the url
    const badgeId = url.match(/gamecards\/(\d+)$/)[1];
    storeData(badgeId);
  }
});
