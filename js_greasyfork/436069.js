// ==UserScript==
// @name         Remove ad/link entries from marktplaats
// @namespace    https://github.com/Alistair1231/my-userscripts/
// @version      0.2.3
// @description  Remove ad/link entries from marktplaats!
// @author       Alistair1231
// @match        https://www.marktplaats.nl/q/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=marktplaats.nl
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/436069/Remove%20adlink%20entries%20from%20marktplaats.user.js
// @updateURL https://update.greasyfork.org/scripts/436069/Remove%20adlink%20entries%20from%20marktplaats.meta.js
// ==/UserScript==
function removeStuff(){

    // enties with links to websites
    document.querySelectorAll("span.mp-Listing-seller-link").forEach(x => x.parentElement.parentElement.remove())

    // ad entries at bottom
    document.querySelector("div.mp-Listings__admarktTitle + ul").remove();
    // entry heading
    document.querySelector(".mp-adsense-header.mp-text-meta").remove();
    // text beneath ad heading
    document.querySelector("div.mp-Listings__admarktTitle").remove();
}

(function() {
    'use strict';

    setInterval(removeStuff,500);


})();