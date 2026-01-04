// ==UserScript==
// @name         Morele.net - Remove blur
// @namespace    https://greasyfork.org
// @version      1.0
// @description  Remove blurred items ("Zobacz w aplikacji")
// @author       Dawid Marzec
// @match        https://lp.morele.net/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/421443/Morelenet%20-%20Remove%20blur.user.js
// @updateURL https://update.greasyfork.org/scripts/421443/Morelenet%20-%20Remove%20blur.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let productElements = document.getElementsByClassName("product-item-blur");

    while (productElements.length > 0) {
        //fix links
        let productLinkElements = productElements[0].getElementsByClassName("product-link");
        if (productLinkElements.length > 0) {
            let link = productLinkElements[0].getAttribute("data-href");
            productLinkElements[0].setAttribute("href", link);
            productLinkElements[0].removeAttribute("data-href");
        }

        //remove blur
        productElements[0].classList.remove("product-item-blur");
    }
})();