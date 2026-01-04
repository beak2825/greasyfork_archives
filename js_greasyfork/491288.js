// ==UserScript==
// @name         Anti Reverse Buymug
// @namespace    reversebuymug.2023
// @version      1.0
// @description  Send an alert when visiting andyman's bazaar
// @author       Yarrow [2668259]
// @match        https://www.torn.com/*
// @grant        none
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/491288/Anti%20Reverse%20Buymug.user.js
// @updateURL https://update.greasyfork.org/scripts/491288/Anti%20Reverse%20Buymug.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const observer = new MutationObserver(function(mutations) {
        if (/Andyman's Bazaar/i.test (document.body.innerHTML) ){
            observer.disconnect();
            alert ("Warning: Andyman Likes to Reverse Buymug!!");
        }
    });
    observer.observe(document, {attributes: false, childList: true, characterData: false, subtree:true});

})();