// ==UserScript==
// @name         Remove GameFAQs "Would you recommend this guide?" Header
// @namespace    gameFARKZ
// @version      1.0
// @description  Removes the annoying "Would you recommend this guide?" header on every FAQ page.
// @include      http://www.gamefaqs.com/*/*/faqs/*
// @include      https://www.gamefaqs.com/*/*/faqs/*
// @include      http://gamefaqs.gamespot.com/*/*/faqs/*
// @include      https://gamefaqs.gamespot.com/*/*/faqs/*
// @author       jakenastysnake
// @grant        none
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/408431/Remove%20GameFAQs%20%22Would%20you%20recommend%20this%20guide%22%20Header.user.js
// @updateURL https://update.greasyfork.org/scripts/408431/Remove%20GameFAQs%20%22Would%20you%20recommend%20this%20guide%22%20Header.meta.js
// ==/UserScript==

// Remove the header div when it is loaded.
function removeHeader(header) {
    header.remove();
}

// Set up a MutationObserver to check for changes in DOM 
// (Needed since header is not loaded until you scroll down the page)
// Mutations: This is an array that holds any mutations or changes that have occurred.
// Me: This is the MutationObserver instance.
var observer = new MutationObserver(function (mutations, me) {
    var header = document.getElementById('faq_header_wrap');
    if (header) {
        removeHeader(header);
        me.disconnect(); // Stop the MutationObserver.
        return;
    }
});

// Start the MutationObserver.
observer.observe(document, {
    childList: true,
    subtree: true
});