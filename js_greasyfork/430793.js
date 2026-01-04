// ==UserScript==
// @name        Total Price
// @namespace   Violentmonkey Scripts
// @match       https://www.manga-occasion.com/*
// @grant       none
// @version     1.0
// @author      ImFireGod
// @description Add a line in the article description with total price of the article
// @downloadURL https://update.greasyfork.org/scripts/430793/Total%20Price.user.js
// @updateURL https://update.greasyfork.org/scripts/430793/Total%20Price.meta.js
// ==/UserScript==

function getByStrictClassName(className) {
  for (const item of document.getElementsByClassName(className)) {
    if (item.className === className) {
      return item;
    }
  }
}

const list = getByStrictClassName('list-unstyled');
if (!list) return;

function countPrice (list) {
  let price = 0;
  for (let i = 1; i < 4; i++) {
    const match = list.children[i].textContent.match(/(\d+,\d+)/);
    if (!match) continue;
    
    price += Number.parseFloat(match[0].replace(',', '.'));
  }
  return price;
}

const item = document.createElement('li');
item.innerHTML = `<strong>Prix total : </strong>${countPrice(list).toFixed(2)} €`
list.insertBefore(item, list.children[4])