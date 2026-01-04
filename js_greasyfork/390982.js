// ==UserScript==
// @name G2A Price Updater
// @description Updates all open G2A price update pages
// @namespace Mattwmaster58 Scripts
// @match https://www.g2a.com/marketplace/wholesale/editproduct/id/*
// @grant GM_registerMenuCommand
// @version 0.0.1.20200222204428
// @downloadURL https://update.greasyfork.org/scripts/390982/G2A%20Price%20Updater.user.js
// @updateURL https://update.greasyfork.org/scripts/390982/G2A%20Price%20Updater.meta.js
// ==/UserScript==

const channel = new BroadcastChannel('g2apriceupdater');

// noinspection JSUnresolvedFunction
GM_registerMenuCommand('Beat prices on all open pages', () => {
  updateAllPrices('beat');
});
// noinspection JSUnresolvedFunction
GM_registerMenuCommand('Match prices on all open pages', () => {
  updateAllPrices('match');
});

if (window.onload) {
  let cur_onload = window.onload;
  window.onload = function (evt) {
    cur_onload(evt);
    main();
  };
} else {
  window.onload = main;
}

function main() {
  channel.onmessage = (msg) => {
    let dat = msg.data
    if (dat.command === 'match' || dat.command === 'beat') {
      updatePrices(dat.command);
    } else {
      console.error(`command not found: ${dat.command}`);
    }
  }
}

function updatePrices(type) {
  console.log(`${type}ing prices on page`);
  let price_to_set = parseFloat(document.querySelector('#lowestMarketplacePrice div span span').textContent);
  if (type === 'beat') {
    price_to_set -= 0.01;
  }
  document.querySelector('input.price-retail').value = Math.round(price_to_set * 100) / 100;
  document.querySelector('.mp-update').click();
}

function updateAllPrices(type) {
  channel.postMessage({command: type});
  updatePrices(type);
}