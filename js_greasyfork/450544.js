// ==UserScript==
// Creation Date: 31/8/2022, 14:45:43
// @name            Add Catawiki commission fees
// @name:it         Aggiungi commisioni d'asta Catawiki
// @namespace       https://nicksenzaname.github.io/
// @description     This script allows to visualize the final price of the item adding fee commisions on Catawiki.
// @description:it  Questo script permette di visualizzare il prezzo finale di un oggetto aggiungendovi le commisioni d'asta su Catawiki.
// @match           https://www.catawiki.com/*
// @grant           none
// @homepageURL     https://greasyfork.org/it/scripts/450544-add-catawiki-commission-fees
// @version         1.0.1
// @author          NickSenzaName
// @license         GPL version 3 or any later version; http://www.gnu.org/copyleft/gpl.html
// @downloadURL https://update.greasyfork.org/scripts/450544/Add%20Catawiki%20commission%20fees.user.js
// @updateURL https://update.greasyfork.org/scripts/450544/Add%20Catawiki%20commission%20fees.meta.js
// ==/UserScript==

// --- Function Declaration ---
function hasNumber(str) {
  let regex = /\d/;
  return regex.test(str);
}

function str_to_nr(str) {
  let splitted_str = str.split(' ');
  let i = 0;
  while (!hasNumber(splitted_str[i])) {
    i++;
  }
  return parseFloat(str.split(' ')[i]);
}

function add_percentage(number, percentage) {
  return number + number*percentage;
}

function set_new_price_label(element) {
  let bid = str_to_nr(element.innerHTML);
  bid = add_percentage(bid, 0.09);
  element.innerHTML = element.innerHTML + '<br>(' + bid.toString() + ' €)';
  // console.log(element.innerHTML);
}

// --- Main ---

setTimeout(function(){
 if (typeof elements === 'undefined') {
  let elements;
}
elements = document.getElementsByClassName('c-button__label');

for (let i = 0; i < elements.length; i++) {
  if (elements[i].innerHTML.includes("€")) {
    set_new_price_label(elements[i]);
  }
}
}, 2000);
