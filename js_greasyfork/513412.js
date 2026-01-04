// ==UserScript==
// @name         Job Filter businessfrance
// @namespace    http://tampermonkey.net/
// @version      2024-10-21
// @license MIT
// @description  Removes offers from businessfrance search page from location given by the user
// @author       Thomas Abecassis
// @match        https://mon-vie-via.businessfrance.fr/offres/recherche?*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=businessfrance.fr
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/513412/Job%20Filter%20businessfrance.user.js
// @updateURL https://update.greasyfork.org/scripts/513412/Job%20Filter%20businessfrance.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const removedJobOfferArray = [];

    function removeJobOfferDiv(div){
        div.style.display = 'none';
        removedJobOfferArray.push(div);
    }

    function resetHiddenJobOffers(){
        removedJobOfferArray.forEach(div=>div.style.display = 'block')
        removedJobOfferArray.length = 0;
    }

    function getKeywords() {
        return GM_getValue('jobFilterKeywords', ['bruxelles', 'luxembourg', '(inactif)']);
    }

    function saveKeywords(keywords) {
        GM_setValue('jobFilterKeywords', keywords);
    }

    function promptForKeywords() {
        const currentKeywords = getKeywords();
        const input = prompt('Enter the keywords to be filtered, separated by commas:', currentKeywords.join(', '));
        if (input !== null) {
            const newKeywords = input.split(',').map(keyword => keyword.trim()).filter(keyword => keyword !== '');
            saveKeywords(newKeywords);
            resetHiddenJobOffers();
            removeOfferByKeywords(getKeywords());
        }
    }

    GM_registerMenuCommand('Edit filter keywords', promptForKeywords);

    function removeOfferByKeywords(keywords) {
        const jobOfferDivs = document.querySelectorAll('.latest_offers div');

        jobOfferDivs.forEach(div => {
            const locationElement = div.querySelector('.location');

            if (locationElement) {
                const location = locationElement.textContent;
                if (keywords.some(keyword => location.toLowerCase().includes(keyword.toLowerCase())))
                    removeJobOfferDiv(div);
            }
        });
    }

    function observeJobOffersChanges() {
        const observer = new MutationObserver(() => {
            removeOfferByKeywords(getKeywords());
        });

        const JobOffersContainer = document.querySelector('.home_offre');

        if(JobOffersContainer){
            observer.observe(JobOffersContainer, {
                childList: true,
                subtree: true
            });
        }else {
            console.error('The job offers container hasn\'t been found.');
        }
    }

    document.readyState === 'complete' ? observeJobOffersChanges() : window.addEventListener('load', observeJobOffersChanges());
})();