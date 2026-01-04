// ==UserScript==
// @name         Hide ebay collection listings
// @author       Rolandas Valantinas
// @description  Remove ebay listings that have "Free collection in person"
// @match        https://www.ebay.co.uk/sch*
// @namespace    https://greasyfork.org/users/157178
// @supportURL   https://github.com/rolandas-valantinas/gists/issues
// @version      1.1
// @downloadURL https://update.greasyfork.org/scripts/486784/Hide%20ebay%20collection%20listings.user.js
// @updateURL https://update.greasyfork.org/scripts/486784/Hide%20ebay%20collection%20listings.meta.js
// ==/UserScript==

(function () {
    var interval = setInterval(hideListings, 2000);

    function hideListings() {
        var localDelivery = document.getElementsByClassName("s-item__localDelivery");

        for (var i = 0; i < localDelivery.length; i++) {
            localDelivery[i].parentNode.parentNode.parentNode.parentNode.parentNode.remove();
        }

        if (localDelivery.length === 0) {
            clearInterval(interval);
        }
    }
})();
