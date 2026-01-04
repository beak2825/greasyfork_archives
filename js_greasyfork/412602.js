// ==UserScript==
// @name         Facebook Search History Cleaner
// @namespace    Facebook Search History Cleaner
// @version      1.02
// @description  Automates emptying of Facebook search history
// @author       JustSomeGuy
// @include      *facebook.*/*/allactivity?category_key=search*
// @license      MIT
// @donation     https://www.paypal.com/paypalme/iappreciateyoutoo
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/412602/Facebook%20Search%20History%20Cleaner.user.js
// @updateURL https://update.greasyfork.org/scripts/412602/Facebook%20Search%20History%20Cleaner.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var uri = document.baseURI;

    if (uri.includes("category_key=search")) {
        uri = uri.replace('search', 'SEARCH');
        location.replace(uri);
    }

    setTimeout(function() {
        var aTags = document.querySelectorAll('[dir="auto"]');
        var found;
        for (var i = 0; i < aTags.length; i++) {
            found = aTags[i];
            if (aTags[i].textContent == "Clear Searches") {
                found.click();
            }
        }
    }, 1000);
})();