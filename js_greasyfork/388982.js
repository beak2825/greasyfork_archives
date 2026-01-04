// ==UserScript==
// @name         La Crosse Tribune full article unblocker
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  On the La Crosse Tribune website, displays full articles.
// @author       J1bill
// @match        https://lacrossetribune.com/*
// @grant        none
// @license      MIT
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/443403/La%20Crosse%20Tribune%20full%20article%20unblocker.user.js
// @updateURL https://update.greasyfork.org/scripts/443403/La%20Crosse%20Tribune%20full%20article%20unblocker.meta.js
// ==/UserScript==


(function() {
    'use strict';

    function removePaywall() {
        document.querySelectorAll('.subscriber-hide').forEach(element => {
            element.classList.remove('subscriber-hide');
        });

        document.querySelectorAll('.paywall, .paywall-container, .subscription-required').forEach(element => {
            element.remove();
        });
        document.querySelectorAll('.lee-article-text').forEach(element => {
            element.style.filter = 'blur(0)';
            element.style.webkitFilter = 'blur(0)';
            element.style.overflow = 'visible';
            element.style.maxHeight = 'none';
        });

        document.querySelectorAll('[disabled], [aria-hidden="true"]').forEach(element => {
            element.removeAttribute('disabled');
            element.removeAttribute('aria-hidden');
        });
        document.querySelectorAll('.modal-backdrop, .paywall-overlay, .subscribe-overlay').forEach(element => {
            element.remove();
        });
        const assetContent = document.getElementById('asset-content');
        if (assetContent) {
            assetContent.removeAttribute('hidden');
            assetContent.style.display = 'block'; // Make sure it's visible
        }
        const accessOffersModal = document.getElementById('access-offers-modal');
        if (accessOffersModal) {
            accessOffersModal.remove();
        }
        document.body.style.overflow = 'auto';
        document.documentElement.style.overflow = 'auto';
    }

    removePaywall();

    setTimeout(removePaywall, 1000);

    const observer = new MutationObserver(function(mutations) {
        removePaywall();
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: false,
        characterData: false
    });

    window.addEventListener('scroll', function() {
        removePaywall();
    }, { passive: true });

    document.addEventListener('click', function() {
        removePaywall();
    }, { passive: true });
})();
