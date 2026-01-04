// ==UserScript==
// @name         🐭️ MouseHunt - Item Quantity Fix
// @version      1.1.0
// @description  Fixes the "You Own: 0" bug when viewing an item info page.
// @license      MIT
// @author       bradp
// @namespace    bradp
// @match        https://www.mousehuntgame.com/i.php
// @icon         https://brrad.com/mouse.png
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/445926/%F0%9F%90%AD%EF%B8%8F%20MouseHunt%20-%20Item%20Quantity%20Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/445926/%F0%9F%90%AD%EF%B8%8F%20MouseHunt%20-%20Item%20Quantity%20Fix.meta.js
// ==/UserScript==

((function () {
  'use strict';

  // Make sure we have the ID parameter.
  if (window.location.href.indexOf('i.php?id=') === -1) {
    return;
  }

  // Grab the item ID.
  const itemID = window.location.href.split('i.php?id=')[ 1 ];
  if (! itemID) {
    return;
  }

  // Make sure the quantity shown is 0.
  const qty = document.querySelector('.itemView-sidebar-quantity');
  if (! (qty && qty.textContent.indexOf('You Own:') !== -1)) {
    return;
  }

  // Grab the item slug.
  const itemName = document.querySelector('.itemViewContainer').getAttribute('data-item-type');
  if (! itemName) {
    return;
  }

  // redirect to item.php?item_type=itemName
  const newLocation = window.location.href.replaceAll(`i.php?id=${itemID}`, `item.php?item_type=${itemName}`);
  if (newLocation !== window.location.href) {
    window.location.href = newLocation;
  }
})());
