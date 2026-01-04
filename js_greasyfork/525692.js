// ==UserScript==
// @name         un-Gmail Google Contacts
// @copyright    Copyright 2025 Jonathan Kamens
// @license      GPL
// @namespace    http://tampermonkey.net/
// @version      2025-02-03
// @description  change gmail links in Google Contacts to mailto: links
// @author       Jonathan Kamens <jik@kamens.us>
// @match        https://contacts.google.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=google.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/525692/un-Gmail%20Google%20Contacts.user.js
// @updateURL https://update.greasyfork.org/scripts/525692/un-Gmail%20Google%20Contacts.meta.js
// ==/UserScript==

// Instead of displaying email addresses as mailto: links as it rightfully should,
// the Google Contacts web app sends you to Gmail when you click on them. This
// script changes the email addresses back into mailto: links so that when you
// click on them they open in your configured email app.
//
// Uses a mutation observer because the Contacts app dynamically inserts content
// into the page after the browser thinks the page is finished loading.

(function() {
    'use strict';

    let callback = (mutationList, observer) => {
        let addresses = document.evaluate("//span[starts-with(@href,'mailto:') or starts-with(@data-href,'mailto:')]", document);
        let addressElement;
        while (addressElement = addresses.iterateNext()) {
            let href = addressElement.getAttribute("href") || addressElement.getAttribute("data-href");
            let addressString = href.substring(7);
            let anchor = document.createElement("a")
            anchor.setAttribute("href", `mailto:${addressString}`);
            anchor.innerText = addressString;
            addressElement.replaceWith(anchor);
        }
    };
    let observer = new MutationObserver(callback);
    observer.observe(document, {subtree: true, childList: true});
})();