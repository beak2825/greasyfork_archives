// ==UserScript==
// @license      JazzMedo
// @name         Force RTL
// @version      0.72
// @description  This script will change the direction of the elements with arabic characters
// @author       JazzMedo
// @match        https://*
// @include      https://*
// @icon         https://cdn-icons-png.flaticon.com/512/6212/6212766.png
// @grant        none
// @namespace https://greasyfork.org/users/1420266
// @downloadURL https://update.greasyfork.org/scripts/524871/Force%20RTL.user.js
// @updateURL https://update.greasyfork.org/scripts/524871/Force%20RTL.meta.js
// ==/UserScript==

(function() {
    'use strict';
function updateTextDirections() {
    document.querySelectorAll("*").forEach((element) => {
        // Check if the element contains Arabic characters using Unicode range
        const arabicRegex =
            /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/;

        // Check only direct text content of the element (not nested elements)
        const textNodes = Array.from(element.childNodes).filter(
            (node) => node.nodeType === Node.TEXT_NODE
        );

        const hasArabic = textNodes.some((node) =>
            arabicRegex.test(node.textContent)
        );

        if (hasArabic && element.parentElement) {
            element.parentElement.setAttribute("dir", "rtl");
        }
    });
}

// Run on initial load
updateTextDirections();

// Run again whenever new content is added
// (e.g., after AJAX calls or dynamic element creation)
const observer = new MutationObserver((mutationsList) => {
    for (const mutation of mutationsList) {
        if (mutation.type === "childList" || mutation.type === "characterData") {
            updateTextDirections();
            break;
        }
    }
});

observer.observe(document.body, {
    childList: true,
    subtree: true,
    characterData: true,
});
})();