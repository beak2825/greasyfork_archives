// ==UserScript==
// @name        Google Search Category Order
// @description Fix Google's habit of constantly changing the order of the menu bar tabs in the search results page. This script allows you to order the menu items in any way you want
// @namespace   Violentmonkey Scripts
// @match       https://*google.*/search
// @grant       none
// @version     1.0
// @author      Moka
// @license     MIT

// @downloadURL https://update.greasyfork.org/scripts/428041/Google%20Search%20Category%20Order.user.js
// @updateURL https://update.greasyfork.org/scripts/428041/Google%20Search%20Category%20Order.meta.js
// ==/UserScript==

// ENTER YOUR DESIRED ORDER HERE
// Take the names of the tabs, like "All", "Maps", "Books" etc,
// and just write them in the array here, in the order you want.
// These items will always appear before any other items Google may offer.
const ORDER = [
  "All",
  "Images",
  "Videos",
  "Maps",
  "News"
]

// END CONFIGURATION




const menuItems = Array.from(document.getElementsByClassName("hdtb-mitem"));
const itemBar = menuItems[0].parentElement;

for (let [index, itemText] of ORDER.reverse().entries()) {
  const elem = menuItems.find((item) => item.innerText === itemText);
  if(elem) {
      itemBar.prepend(elem)
  }
}
