// ==UserScript==
// @name         Etsy short URL
// @namespace    graphen
// @version      1.2.2
// @description  Replaces long url by short url.
// @author       graphen
// @include      https://www.etsy.com/*
// @run-at       document-end
// @icon         https://www.etsy.com/images/favicon.ico
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/375272/Etsy%20short%20URL.user.js
// @updateURL https://update.greasyfork.org/scripts/375272/Etsy%20short%20URL.meta.js
// ==/UserScript==

/* jshint esversion: 6 */
(function(){
    'use strict';

    if(document.getElementById("listing-image")) {
        var itemId = document.getElementById("listing-image").getAttribute("data-palette-listing-id");
        if(itemId) {
            history.replaceState(null, 'Shortened Etsy URL', "https://www.etsy.com/listing/" + itemId);
        }
    }

})();
