// ==UserScript==
// @name         VivePort new links
// @namespace    http://tampermonkey.net/
// @version      2025-06-06
// @description  Some minor tweaks to VivePort.com, to enable browsing to experiences while not losing your position in the search results (opening pages in new windows/tabs).
// @author       Steve64B
// @match        https://www.viveport.com/filter-page*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=viveport.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/538565/VivePort%20new%20links.user.js
// @updateURL https://update.greasyfork.org/scripts/538565/VivePort%20new%20links.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Function to create links for product cards
    function createLinks() {
        let productCards = document.querySelectorAll("div#productCard");
        productCards.forEach(card => {
            // Check if the link has already been added
            if (!card.querySelector("a#customlink")) {
                let img = card.querySelector("img.card_image");
                if (img) {
                    let src = img.src;
                    let basename = src.split('/').pop(); // Get the last part of the URL
                    let id = basename.split('.')[0]; // Get the string before the first dot
                    let link = document.createElement("a");
                    link.target = "_blank";
                    link.href = "https://www.viveport.com/apps/" + id;
                    link.id = "customlink";
                    link.textContent = "Go to product page";
                    link.addEventListener("click", function (event) {
                        event.stopPropagation(); // Prevent click event from bubbling
                    });
                    card.appendChild(link);
                } else {
                    console.warn("No image with class 'card_image' found in one of the productCards.");
                }
            }
        });
     // Update all <p> elements with the 'chakra-text' class
        let textElements = document.querySelectorAll("p.chakra-text");
        textElements.forEach(p => {
            p.setAttribute("title", p.textContent.trim());
        });
    }

    // Set up a MutationObserver to watch for changes in the DOM
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === "childList" || mutation.type === "subtree") {
                createLinks(); // Recreate links when the DOM changes
            }
        });
    });

    // Start observing the body for changes
    const config = { childList: true, subtree: true };
    observer.observe(document.body, config);

    // Initial call to create links for already loaded content
    createLinks();

})();