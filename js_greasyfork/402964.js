// ==UserScript==
// @name         Amazon order history arrow key navigation
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        www.amazon.ca/gp/css/order-history*
// @match        www.amazon.ca/gp/your-account/order-history*
// @match        www.amazon.com/gp/css/order-history*
// @match        www.amazon.com/gp/your-account/order-history*
// @match        www.amazon.co.uk/gp/css/order-history*
// @match        www.amazon.co.uk/gp/your-account/order-history*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/402964/Amazon%20order%20history%20arrow%20key%20navigation.user.js
// @updateURL https://update.greasyfork.org/scripts/402964/Amazon%20order%20history%20arrow%20key%20navigation.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.addEventListener('keydown', e => {
        switch (e.keyCode) {
            case 37:
                document.querySelector('.a-pagination li:first-child a').click();
                break;
            case 39:
                document.querySelector('.a-pagination li.a-last a').click();
                break;
        }
    });
})();
