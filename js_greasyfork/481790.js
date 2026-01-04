// ==UserScript==
// @name         Redirect to Checkout
// @namespace    http://yournamespace.com
// @version      0.1
// @description  Redirect to checkout page when visiting the cart page
// @author       Your Name
// @match        https://www.goopi.co/cart
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/481790/Redirect%20to%20Checkout.user.js
// @updateURL https://update.greasyfork.org/scripts/481790/Redirect%20to%20Checkout.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Redirect to the checkout page
    window.location.href = 'https://www.goopi.co/checkout';
})();