// ==UserScript==
// @name         Asura - Advert Remover
// @namespace    https://greasyfork.org/en/users/1427435-fevnax
// @version      1.2
// @description  Removes the advert overlay, premium card, subscription prompts, and additional ads automatically when the page loads.
// @author       Harsh P
// @match        https://asuracomic.net/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/524890/Asura%20-%20Advert%20Remover.user.js
// @updateURL https://update.greasyfork.org/scripts/524890/Asura%20-%20Advert%20Remover.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function removeAdvert() {
        var advert = document.querySelector('.fixed.inset-0.bg-gray-900.bg-opacity-75.flex.items-center.justify-center.z-50.p-4');
        if (advert) {
            advert.remove();
            console.log("Advert removed.");
        }
    }

    removeAdvert();

    var observer = new MutationObserver(removeAdvert);
    observer.observe(document.body, { childList: true, subtree: true });

    setTimeout(() => {
        const interval = setInterval(() => {
            try {
                const subHeader = document.querySelector('.bg-gradient-to-br.from-indigo-900.via-purple-900.to-indigo-800.text-white.py-8.px-4.md\\:py-12.md\\:px-10.shadow-lg.relative.overflow-hidden');
                const sub = document.querySelector('.w-full.flex.justify-center');

                console.log('Subscriber Header found:', subHeader);
                console.log('Subscribe Button found:', sub);

                if (subHeader) {
                    subHeader.remove();
                    console.log('Subscriber Header successfully removed.');
                }

                if (sub) {
                    sub.remove();
                    console.log('Subscribe Button successfully removed.');
                }

                if (!subHeader && !sub) {
                    clearInterval(interval);
                    console.log('All targeted elements removed. Stopping script.');
                }

            } catch (error) {
                console.error("Error encountered while removing elements:", error);
            }
        }, 500);

        setTimeout(() => {
            clearInterval(interval);
            console.log('Timeout reached. Stopping script.');
        }, 5000);

    }, 10);
})();
