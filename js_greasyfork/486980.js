// ==UserScript==
// @name             OLX Sponsored Begone
// @name:pl          Ukrywacz ofert sponsorowanych na OLX
// @namespace        https://github.com/b13kjack/OLX-Sponsored-Begone-Script
// @version          1.1.5
// @description      Hides sponsored listings on olx.pl
// @description:pl   Ukrywa oferty sponsorowane na olx.pl
// @author           b13kjack
// @license          MIT
// @supportURL       https://github.com/b13kjack/OLX-Sponsored-Begone-Script/issues
// @match            https://olx.pl/*
// @match            https://*.olx.pl/*
// @match            https://olx.pl*
// @match            https://*.olx.pl*
// @icon             https://www.google.com/s2/favicons?sz=64&domain=olx.pl
// @grant            none
// @downloadURL https://update.greasyfork.org/scripts/486980/OLX%20Sponsored%20Begone.user.js
// @updateURL https://update.greasyfork.org/scripts/486980/OLX%20Sponsored%20Begone.meta.js
// ==/UserScript==
(function () {
    'use strict';

    const SPONSORED_TEXT = 'Wyróżnione';
    const LISTINGS_CONTAINER_SELECTOR = '[data-testid="listing-grid"]';
    const LISTING_CARD_SELECTOR = '[data-cy="l-card"]';
    const GRID_ICON_SELECTOR = '[data-testid="grid-icon"]';
    const TOGGLE_BUTTON_TESTID = 'grid-icon-duplicate';

    let areSponsoredListingsHidden = true;

    function ensureToggleButtonExists() {
        let toggleButton = document.querySelector(`[data-testid="${TOGGLE_BUTTON_TESTID}"]`);
        if (!toggleButton) {
            const referenceButton = document.querySelector(GRID_ICON_SELECTOR);
            if (referenceButton) {
                toggleButton = document.createElement('button');
                toggleButton.setAttribute('data-testid', TOGGLE_BUTTON_TESTID);
                toggleButton.textContent = areSponsoredListingsHidden ? 'Pokaż Oferty Sponsorowane' : 'Ukryj Oferty Sponsorowane';
                toggleButton.style.cssText = window.getComputedStyle(referenceButton).cssText;
                referenceButton.insertAdjacentElement('afterend', toggleButton);
                toggleButton.addEventListener('click', () => {
                    areSponsoredListingsHidden = !areSponsoredListingsHidden;
                    toggleButton.textContent = areSponsoredListingsHidden ? 'Pokaż Oferty Sponsorowane' : 'Ukryj Oferty Sponsorowane';
                    updateSponsoredListingsVisibility();
                });
            } else {
                console.warn('Grid icon not found. Cannot create toggle button.');
            }
        }
    }

    function updateSponsoredListingsVisibility() {
        const listingsContainer = document.querySelector(LISTINGS_CONTAINER_SELECTOR);
        if (!listingsContainer) {
            console.warn('Listings container not found.');
            return;
        }

        const listingCards = listingsContainer.querySelectorAll(LISTING_CARD_SELECTOR);
        if (listingCards.length === 0) {
            console.warn('No listing cards found.');
            return;
        }

        listingCards.forEach(card => {
            if (card.textContent.includes(SPONSORED_TEXT)) {
                card.style.display = areSponsoredListingsHidden ? 'none' : '';
            }
        });
    }

    const observer = new MutationObserver(() => {
        updateSponsoredListingsVisibility();
    });
    observer.observe(document.body, { childList: true, subtree: true });

    ensureToggleButtonExists();
    updateSponsoredListingsVisibility();

    const intervalId = setInterval(() => {
        ensureToggleButtonExists();
        if (document.querySelector(`[data-testid="${TOGGLE_BUTTON_TESTID}"]`)) {
            clearInterval(intervalId);
        }
    }, 2000);
})();