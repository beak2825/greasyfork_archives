// ==UserScript==
// @name         amazon sponsor block
// @namespace    https://greasyfork.org/de/users/1491862-bernhardsigl
// @version      1.0
// @description  removes sponsored products from search results across all amazon country domains
// @match        https://www.amazon.de/*
// @match        https://www.amazon.com/*
// @match        https://www.amazon.co.uk/*
// @match        https://www.amazon.fr/*
// @match        https://www.amazon.es/*
// @match        https://www.amazon.it/*
// @match        https://www.amazon.nl/*
// @match        https://www.amazon.ca/*
// @match        https://www.amazon.com.mx/*
// @grant        none
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/541715/amazon%20sponsor%20block.user.js
// @updateURL https://update.greasyfork.org/scripts/541715/amazon%20sponsor%20block.meta.js
// ==/UserScript==

(function () {
    'use strict';

    if (!window.location.pathname.startsWith('/s')) {
        return;
    }

    function removeSponsoredByLabel() {
        let removed = 0;

        const sponsoredWords = new Set([
            "sponsored", "gesponsert", "sponsorisé", "patrocinado", "sponsorizzato", "gesponsord"
        ]),
        sponsorLabels = Array.from(document.querySelectorAll("span, div")).filter(el =>
            sponsoredWords.has(el.textContent.trim().toLowerCase())
        );

        sponsorLabels.forEach(label => {
            let container = label.closest(".s-result-item");

            if (container) {
                container.remove();
                removed++;
            }
        });
    }

    const observer = new MutationObserver(removeSponsoredByLabel);
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    removeSponsoredByLabel();
})();