// ==UserScript==
// @name         [GC] Neggs Counter
// @namespace    https://greasyfork.org/users/1230396
// @namespace    https://github.com/bernasgui/
// @version      1.1
// @description  Show how many Negg Tokens you have in the inventory
// @author       Berna
// @match        https://www.grundos.cafe/winter/neggery/
// @icon         https://i.imgur.com/gDxnNrn.gif
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/481686/%5BGC%5D%20Neggs%20Counter.user.js
// @updateURL https://update.greasyfork.org/scripts/481686/%5BGC%5D%20Neggs%20Counter.meta.js
// ==/UserScript==
 
function findElementByText(text) {
  var elements = document.querySelectorAll('p');
  for (var i = 0; i < elements.length; i++) {
    if (elements[i].textContent.includes(text)) {
      return elements[i];
    }
  }
  return null;
}
 
var yourNeggs = findElementByText('Your Neggs');
 
if (yourNeggs) {
  var neggPoints = Array.from(document.getElementsByClassName('item-info')).reduce(function (total, itemInfo) {
    var match = itemInfo.textContent.match(/\d+/);
    return total + (match ? parseInt(match[0], 10) : 0);
  }, 0);
 
  var combinedHtml = yourNeggs.innerHTML + ' (</strong>' + neggPoints + ' Negg Tokens available in your inventory)';
 
  yourNeggs.innerHTML = combinedHtml;
}