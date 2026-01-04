// ==UserScript==
// @name         Better Market Logs
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Adds price per item tooltips to market sale events
// @author       Weav3r
// @match        https://www.torn.com/page.php?sid=events
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/514400/Better%20Market%20Logs.user.js
// @updateURL https://update.greasyfork.org/scripts/514400/Better%20Market%20Logs.meta.js
// ==/UserScript==

(function() {
   'use strict';

   function processMessage(messageElement) {
       try {
           if (messageElement.hasAttribute('data-price-processed')) return;

           const text = messageElement.textContent;
           if (!text.includes('You sold')) return;

           const match = text.match(/You sold (\d+)x .+ for \$([0-9,]+)/);
           if (!match) return;

           const quantity = parseInt(match[1]);
           const totalPrice = parseInt(match[2].replace(/,/g, ''));
           const pricePerItem = Math.floor(totalPrice / quantity);

           const priceSpan = document.createElement('span');
           priceSpan.title = `Price per item: $${pricePerItem.toLocaleString()}`;

           const textNodes = Array.from(messageElement.childNodes);
           for (const node of textNodes) {
               if (node.nodeType === Node.TEXT_NODE && node.nodeValue.includes('$')) {
                   const priceMatch = node.nodeValue.match(/(\$[0-9,]+)/);
                   if (priceMatch) {
                       const parts = node.nodeValue.split(priceMatch[0]);
                       const newNode = document.createTextNode(parts[0]);
                       priceSpan.textContent = priceMatch[0];
                       const endNode = document.createTextNode(parts[1]);

                       node.parentNode.insertBefore(newNode, node);
                       node.parentNode.insertBefore(priceSpan, node);
                       node.parentNode.insertBefore(endNode, node);
                       node.parentNode.removeChild(node);
                       break;
                   }
               }
           }

           messageElement.setAttribute('data-price-processed', 'true');
       } catch (error) {}
   }

   function checkForNewMessages() {
       document.querySelectorAll('.message___RSW3S:not([data-price-processed])').forEach(processMessage);
   }

   function createObserver() {
       const observer = new MutationObserver(() => setTimeout(checkForNewMessages, 100));
       observer.observe(document.body, { childList: true, subtree: true, attributes: false, characterData: false });
       checkForNewMessages();
   }

   if (document.readyState === 'loading') {
       document.addEventListener('DOMContentLoaded', createObserver);
   } else {
       createObserver();
   }
})();