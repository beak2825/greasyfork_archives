// ==UserScript==
// @name         Ukryj filmy premium na cda.pl i sortuj widoczne wyniki
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Hide Premium Videos on cda.pl and Sort
// @author       You
// @license      MIT
// @match        https://www.cda.pl/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=cda.pl
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/475967/Ukryj%20filmy%20premium%20na%20cdapl%20i%20sortuj%20widoczne%20wyniki.user.js
// @updateURL https://update.greasyfork.org/scripts/475967/Ukryj%20filmy%20premium%20na%20cdapl%20i%20sortuj%20widoczne%20wyniki.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Ukryj filmy premium
    document.querySelectorAll('div.video-clip-wrapper:has(span.flag-video-premium)').forEach(function(element) {
        element.style.display = 'none';
    });

    // Sortuj widoczne wyniki
    var resultsContainer = document.querySelector('div.video-clip-results'); // Dostosuj selektor do struktury strony
    var visibleResults = Array.from(resultsContainer.querySelectorAll('div.video-clip-wrapper')).filter(function(element) {
        return element.style.display !== 'none';
    });

    visibleResults.sort(function(a, b) {
        // Dostosuj logikę sortowania do swoich preferencji
        var titleA = a.querySelector('a.link-title-visit').textContent;
        var titleB = b.querySelector('a.link-title-visit').textContent;
        return titleA.localeCompare(titleB);
    });

    visibleResults.forEach(function(element) {
        resultsContainer.appendChild(element);
    });
})();