// ==UserScript==
// @name         Indeed.com Remove Sponsor
// @namespace    http://joeyism.com/
// @version      1.1.2
// @description  Removes sponsored companies when job searching
// @author       joeyism
// @include      http*://*.indeed.com/*
// @include      http*://*.indeed.co.uk/*
// @include      http*://*indeed.tld/*
// @include      http*://*.indeed.*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/32596/Indeedcom%20Remove%20Sponsor.user.js
// @updateURL https://update.greasyfork.org/scripts/32596/Indeedcom%20Remove%20Sponsor.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function remove(elem){
        elem.parentNode.removeChild(elem);
    }

    function removeSponsor(allSponsors){
        while(allSponsors.length > 0){
            var elem = allSponsors[0];
            var sponsor = elem.parentElement.parentElement.parentElement.parentElement;
            remove(sponsor);
        }
    }

    function removeRecommendedSponsor(allSponsors){
        while(allSponsors.length > 0){
            var elem = allSponsors[0];
            var sponsor = elem.parentElement;
            remove(sponsor);
        }
    }
    removeSponsor(document.getElementsByClassName("sponsoredGray"));
    removeRecommendedSponsor(document.getElementsByClassName("sdn"));
})();
