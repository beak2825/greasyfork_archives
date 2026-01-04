// ==UserScript==
// @name eBay Remove Variation Listings
// @description Removes variation listings (multiple prices, $X to $Y) from eBay
// @namespace https://jacobbundgaard.dk
// @version 1.0
// @match https://www.ebay.at/sch/i.html
// @match https://www.ebay.be/sch/i.html
// @match https://www.ebay.ca/sch/i.html
// @match https://www.ebay.ch/sch/i.html
// @match https://www.ebay.cn/sch/i.html
// @match https://www.ebay.co.th/sch/i.html
// @match https://www.ebay.co.uk/sch/i.html
// @match https://www.ebay.com.au/sch/i.html
// @match https://www.ebay.com.hk/sch/i.html
// @match https://www.ebay.com.my/sch/i.html
// @match https://www.ebay.com.sg/sch/i.html
// @match https://www.ebay.com.tw/sch/i.html
// @match https://www.ebay.com/sch/i.html
// @match https://www.ebay.de/sch/i.html
// @match https://www.ebay.es/sch/i.html
// @match https://www.ebay.fr/sch/i.html
// @match https://www.ebay.ie/sch/i.html
// @match https://www.ebay.it/sch/i.html
// @match https://www.ebay.nl/sch/i.html
// @match https://www.ebay.ph/sch/i.html
// @match https://www.ebay.pl/sch/i.html
// @match https://www.ebay.vn/sch/i.html
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/378120/eBay%20Remove%20Variation%20Listings.user.js
// @updateURL https://update.greasyfork.org/scripts/378120/eBay%20Remove%20Variation%20Listings.meta.js
// ==/UserScript==

(function() {
  const items = document.querySelectorAll(".s-item, .sresult");
  const variationItems = [].filter.call(items, item => item.querySelector(".s-item__price > .DEFAULT, .prRange"));
  
  for (const item of variationItems) {
      item.style.display = "none";
  }
  
  var stylesheet = document.createElement("style");
  stylesheet.append(document.createTextNode(`
    @keyframes fadeout {
        from { opacity: 1; }
        to   { opacity: 0; }
    }
  `));
  document.head.appendChild(stylesheet);

  var message = document.createElement("div");
  message.appendChild(document.createTextNode(variationItems.length + " variation listings removed"));
  message.style.position = "absolute";
  message.style.top = "40px";
  message.style.right = "10px";
  message.style.height = "38px";
  message.style.boxSizing = "border-box";
  message.style.padding = "10px";
  message.style.border = "1px solid #ddd";
  message.style.borderRadius = "3px";
  message.style.backgroundColor = "white";
  message.style.color = "#333";
  message.style.fontSize = "12px";
  message.style.animation = "fadeout 1s ease 9s forwards";
  document.body.appendChild(message);
})();