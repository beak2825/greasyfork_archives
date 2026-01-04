// ==UserScript==
// @name         Barter Tradables/Wishlist Raw
// @namespace    github.com/ummayrr
// @version      2024-10-13
// @description  Gives titles of games in raw text of a user's tradables/wishlist on Barter.vg
// @author       ummayrr
// @match        https://barter.vg/u/*/w/
// @match        https://barter.vg/u/*/t/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/512428/Barter%20TradablesWishlist%20Raw.user.js
// @updateURL https://update.greasyfork.org/scripts/512428/Barter%20TradablesWishlist%20Raw.meta.js
// ==/UserScript==

function extractGameNames() {
  let gameLinks = document.querySelectorAll('table.collection a[href^="https://barter.vg/i/"]');

  let gameNames = [];

  gameLinks.forEach(link => {
    if (!link.closest('td[colspan]')) {
      gameNames.push(link.textContent.trim());
    }
  });

  let newWindow = window.open('', 'Game Names', 'width=600,height=400,left=200,top=100');

  newWindow.document.write('<title>Raw data</title>');

  newWindow.document.write('<pre>' + gameNames.join('\n') + '</pre>');

  newWindow.document.close();
}

let button = document.createElement('button');
button.textContent = 'Extract Game Names';
button.style.position = 'fixed';
button.style.top = '145px';
button.style.right = '75px';
button.style.padding = '10px 20px';

document.body.appendChild(button);
button.addEventListener('click', extractGameNames);
