// ==UserScript==
// @name         Costco Delivery Time Finder
// @namespace    https://www.github.com/kizjkre
// @version      1.0
// @description  Automatic Costco delivery time finder
// @author       Kizjkre
// @match        https://sameday.costco.com/store/checkout_v3
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/400116/Costco%20Delivery%20Time%20Finder.user.js
// @updateURL https://update.greasyfork.org/scripts/400116/Costco%20Delivery%20Time%20Finder.meta.js
// ==/UserScript==

(function() {
  'use strict';

  // Your code here...
  console.log('Loading...');
  window.onload = function() {
    console.log('Running...');
    const error = 'No delivery times available\n\nRight now, all shoppers are busy and working hard to get to every order. Please check back later to see if delivery times are available.';
  	const observer = new MutationObserver(function(mutations) {
    	mutations.forEach(function(mutation) {
      	if (mutation.removedNodes.length !== 0 && mutation.target.innerText.substring(0, 5) === 'Today') {
          const target = mutation.target;
          const dayTab = target.children[0].children[0].children[0].children;
          if (dayTab.length === 1) {
          	setTimeout(function() { location.reload(); }, 300000);
          }
          dayTab[1].click();
          setTimeout(function() { document.querySelectorAll('input[name=delivery_option]')[0].parentElement.children[1].children[2].children[0].click(); }, 1000);
          setTimeout(function() { document.querySelector('.rmq-28f9c13a.rmq-8e4e203').children[2].children[0].children[3].children[0].click(); }, 1000);
          setTimeout(function() { document.getElementsByClassName('rmq-3774bba5')[7].children[0].children[0].children[0].click(); }, 1000);
        } else if (mutation.addedNodes.length !== 0 && mutation.target.innerText === error) setTimeout(function() { location.reload(); }, 300000);
      });
    });
    observer.observe(document.querySelector('body'), { childList: true, subtree: true });
  };
})();