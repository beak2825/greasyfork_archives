// ==UserScript==
// @name        AliExpress Total Price
// @namespace   forked_bytes
// @match       https://*.aliexpress.com/*
// @match       https://*.aliexpress.us/*
// @grant       none
// @version     1.9
// @author      forked_bytes
// @license     0BSD
// @description Display total price (including shipping) on AliExpress item pages
// @downloadURL https://update.greasyfork.org/scripts/481268/AliExpress%20Total%20Price.user.js
// @updateURL https://update.greasyfork.org/scripts/481268/AliExpress%20Total%20Price.meta.js
// ==/UserScript==

const total = document.createElement('h2');
total.style.fontSize = '2em';
total.style.margin = '0.25em 0 0';

setInterval(function() {
  // Find price, shipping, quantity
  const priceElement = document.querySelector('.product-price-current, .dcss-price-first, .pdp-comp-price-current, span[class^="price-default--current--"]');
  if (!priceElement) return;

  const shippingElement = document.querySelector('.dynamic-shipping-line, div[ae_button_type="sku_shipmethod_click"]');
  const quantityElement = document.querySelector('div[class*="quantity--picker"] input');

  // Parse element text
  const [price, prefix, suffix] = parse(priceElement.textContent);
  const [shipping] = shippingElement?.textContent.includes(':') ? parse(shippingElement?.textContent) : [0];
  const quantity = parseInt(quantityElement?.value) || 1;

  // Add total price to DOM
  if (price) total.textContent = `Σ ${prefix}${(price * quantity + shipping).toFixed(2)}${suffix}`;
  if ((shipping || quantity > 1) && !total.isConnected) priceElement.parentNode.parentNode.appendChild(total);
}, 500);

function parse(text) {
  // Find number and currency (before or after)
  // May contain spaces, commas or periods as decimal or thousands separators
  const match = text?.match(/([^\d\s-]*)(\d[\d\s.,]*\d|\d)([^\d\s-]*)/);
  if (!match) return [0, '', ''];

  let [, prefix, price, suffix] = match;
  price = price.replace(/\s/g, '').split(/\D+/); // Remove whitespace and split on non-digit characters
  if (!prefix && !suffix && price.length <= 1) return [0, '', ''];

  // Assume the last non-digit was the decimal separator
  price = price.length > 1 ? price.slice(0, -1).join('') + '.' + price[price.length - 1] : price[0];
  return [parseFloat(price), prefix, suffix];
}