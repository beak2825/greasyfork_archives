// ==UserScript==
// @name         Ludomedia no ad
// @namespace    http://tampermonkey.net/
// @version      2025-03-04
// @description  Removes ads from profile and homepage of ludomedia.it
// @author       You
// @include      *://*.ludomedia.it*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ludomedia.it
// @grant        none
// @license      GPL-3.0-or-later
// @downloadURL https://update.greasyfork.org/scripts/528806/Ludomedia%20no%20ad.user.js
// @updateURL https://update.greasyfork.org/scripts/528806/Ludomedia%20no%20ad.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function removeElementsByClass(className) {
        let elements = document.querySelectorAll("." + className); // Select elements by class
        elements.forEach(el => el.remove()); // Remove each element
    }

    // Example: Remove elements with class "ads-banner"
    removeElementsByClass("profilopbiLink");
    removeElementsByClass("boxpbiLink");

    // To handle dynamically loaded elements, use MutationObserver:
    const observer = new MutationObserver(() => removeElementsByClass("profilopbiLinkr"));
    observer.observe(document.body, { childList: true, subtree: true });

    const observer2 = new MutationObserver(() => removeElementsByClass("boxpbiLink"));
    observer2.observe(document.body, { childList: true, subtree: true });
})();