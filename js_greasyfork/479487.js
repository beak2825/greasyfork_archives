// ==UserScript==
// @name         StoneWars Preise mit Versandkosten
// @namespace    https://dudesoft.dev/
// @description  Fügt die Versandkosten zu den Preisen hinzu
// @version      1.1.1
// @license      MIT
// @author       Philipp Kursawe <pke@pke.fyi>
// @match        https://www.stonewars.de/angebote/*alza*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=stonewars.de
// @homepageURL	 https://github.com/pke/stonewars-vsk-userscript
// @supportURL   https://github.com/pke/stonewars-vsk-userscript/discussions
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/479487/StoneWars%20Preise%20mit%20Versandkosten.user.js
// @updateURL https://update.greasyfork.org/scripts/479487/StoneWars%20Preise%20mit%20Versandkosten.meta.js
// ==/UserScript==

(function() {
  'use strict';
  'use esversion: 11';

  const r = /für (\d+,\d+) Euro \((\d+)% Rabatt\)/i;
  const prices = {
      alza: 5.49,
  };

  GM_addStyle(`
     label.with-shipping {
       position: fixed;
       right: 0;
       top: 0;
       padding: 0.3em 0.6em;
       margin: 1em;
       z-index: 1000;
       background: rgba(0,0,0,.4);
       color: #fff;
       cursor: pointer;
       border-radius: 6px;
     }
     .price-with-shipping {
       display: none;
     }

     body.prices-with-shipping .price-with-shipping {
       display: inline;
     }
     body.prices-with-shipping .price-without-shipping {
       display: none;
     }
  `);

  document.body.classList.toggle("prices-with-shipping");

  const label = document.createElement("label");
  label.className = "with-shipping";
  label.innerHTML = "<span class='price-with-shipping'>mit VSK</span><span class='price-without-shipping'>ohne VSK</span>";
  label.onclick = function() {
      document.body.classList.toggle("prices-with-shipping");
      return false;
  }
  document.body.prepend(label);

  const items = document.querySelectorAll("article li");

  for (let item of items) {
      // Grab all li text content that follows <a> or <del><a>
      const textNode = document.evaluate("(del/a|a)/following-sibling::text()", item, null, XPathResult.FIRST_ORDERED_NODE_TYPE)?.singleNodeValue
      if (textNode) {
          const newText = textNode.nodeValue.replace(r, function (match, price, percent) {
              const oldPrice = parseFloat(price.replace(",","."));
              price = (oldPrice + prices.alza).toFixed(2);
              percent = (percent - (((percent * price) / oldPrice) - percent)).toFixed(0);
              return `für ${price.replace(".", ",")} Euro (${percent}% Rabatt)`;
          });
          const span = document.createElement("span");
          span.innerHTML = `<span class="price-with-shipping">${newText}</span><span class="price-without-shipping">${textNode.nodeValue}</span>`
          textNode.replaceWith(span);
      }
  }
})();
