// ==UserScript==
// @name         SL MP Skip Checkout Ads
// @version      0.1
// @description  Automatically skips the ad page on checkout when you're only buying free stuff. Used to be tolerable before, but now they force you to scroll through 96 items, this is regardless of membership as well.
// @author       AzukiPuddles#0001
// @match        https://marketplace.secondlife.com/orders/checkout/continue
// @icon         https://www.google.com/s2/favicons?sz=64&domain=secondlife.com
// @license      MIT
// @namespace https://Pudl.es/Contact
// @downloadURL https://update.greasyfork.org/scripts/462587/SL%20MP%20Skip%20Checkout%20Ads.user.js
// @updateURL https://update.greasyfork.org/scripts/462587/SL%20MP%20Skip%20Checkout%20Ads.meta.js
// ==/UserScript==

(function () {
  document.getElementsByClassName("cart-button")[0].click();
})();
