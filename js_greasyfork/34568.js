// ==UserScript==
// @name         Hide ebay range listings
// @author       Rolandas Valantinas
// @description  Remove ebay listings that have range values
// @include      *ebay.co.uk/sch*
// @include      *ebay.com/sch*
// @namespace    https://greasyfork.org/users/157178
// @supportURL   https://github.com/rolandas-valantinas/gists/issues
// @version      1.2
// @downloadURL https://update.greasyfork.org/scripts/34568/Hide%20ebay%20range%20listings.user.js
// @updateURL https://update.greasyfork.org/scripts/34568/Hide%20ebay%20range%20listings.meta.js
// ==/UserScript==

(function () {
    var interval = setInterval(hideListings, 2000);

    function hideListings() {
        var price = document.getElementsByClassName("DEFAULT");

        for (var i = 0; i < price.length; i++) {
            price[i].parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.remove();
        }

        if (price.length === 0) {
            clearInterval(interval);
        }
    }
})();
