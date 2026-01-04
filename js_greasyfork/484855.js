// ==UserScript==
// @name        Get Pricelist (Google Sheets)
// @namespace   Violentmonkey Scripts
// @match       https://docs.google.com/spreadsheets/d/e/2PACX-1vSX8nLl71Lx1UaSV3Le_KVYq0xOe5wWGD0v2cvpow1Q-gp4TU2Un5BrfrMK9f0QRpKzkI5v-AaAZMiZ/pubhtml
// @grant       GM_setClipboard
// @version     1.0
// @author      Terekhov
// @description 12/4/2023, 12:27:55 AM
// @downloadURL https://update.greasyfork.org/scripts/484855/Get%20Pricelist%20%28Google%20Sheets%29.user.js
// @updateURL https://update.greasyfork.org/scripts/484855/Get%20Pricelist%20%28Google%20Sheets%29.meta.js
// ==/UserScript==

function getPrices() {
  let plushiesPrices = {
    wholeSet: document.querySelector('table').children[1].children[4].children[4].textContent,
    kitten: document.querySelector('table').children[1].children[5].children[4].textContent,
    sheep: document.querySelector('table').children[1].children[6].children[4].textContent,
    teddyBear: document.querySelector('table').children[1].children[7].children[4].textContent,
    wolverine: document.querySelector('table').children[1].children[8].children[4].textContent,
    stingray: document.querySelector('table').children[1].children[9].children[4].textContent,
    jaguar: document.querySelector('table').children[1].children[10].children[4].textContent,
    nessie: document.querySelector('table').children[1].children[11].children[4].textContent,
    redFox: document.querySelector('table').children[1].children[12].children[4].textContent,
    monkey: document.querySelector('table').children[1].children[13].children[4].textContent,
    chamois: document.querySelector('table').children[1].children[14].children[4].textContent,
    lion: document.querySelector('table').children[1].children[15].children[4].textContent,
    panda: document.querySelector('table').children[1].children[16].children[4].textContent,
    camel: document.querySelector('table').children[1].children[17].children[4].textContent,
  };

  let flowersPrices = {
    wholeSet: document.querySelector('table').children[1].children[4].children[4].textContent,
    dozenRoses: document.querySelector('table').children[1].children[5].children[8].textContent,
    bunchOfFlowers: document.querySelector('table').children[1].children[6].children[8].textContent,
    bunchOfBlackRoses: document.querySelector('table').children[1].children[7].children[8].textContent,
    singleRedRose: document.querySelector('table').children[1].children[8].children[8].textContent,
    dahlia: document.querySelector('table').children[1].children[9].children[8].textContent,
    crocus: document.querySelector('table').children[1].children[10].children[8].textContent,
    bananaOrchid: document.querySelector('table').children[1].children[11].children[8].textContent,
    orchid: document.querySelector('table').children[1].children[12].children[8].textContent,
    edelweiss: document.querySelector('table').children[1].children[13].children[8].textContent,
    heather: document.querySelector('table').children[1].children[14].children[8].textContent,
    ceiboFlower: document.querySelector('table').children[1].children[15].children[8].textContent,
    cherryBlossom: document.querySelector('table').children[1].children[16].children[8].textContent,
    africanViolet: document.querySelector('table').children[1].children[17].children[8].textContent,
    peony: document.querySelector('table').children[1].children[18].children[8].textContent,
    tribulus: document.querySelector('table').children[1].children[19].children[8].textContent,
  };

  GM_setClipboard(JSON.stringify({plushies: plushiesPrices, flowers: flowersPrices}));
}

setTimeout(getPrices, 750);