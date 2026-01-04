// ==UserScript==
// @name         metrocuadrado.com price per square meter
// @namespace    https://github.com/healarconr
// @version      0.1
// @description  Show the price per square meter in the search results of metrocuadrado.com
// @author       Hernán Alarcón
// @match        https://www.metrocuadrado.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/381597/metrocuadradocom%20price%20per%20square%20meter.user.js
// @updateURL https://update.greasyfork.org/scripts/381597/metrocuadradocom%20price%20per%20square%20meter.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function calculatePricePerSquareMeter() {
        calculatePricePerSquareMeterInHighlightedSearchResults();
        calculatePricePerSquareMeterInSearchResults();
    }
    function calculatePricePerSquareMeterInHighlightedSearchResults() {
        const offers = document.querySelectorAll('[itemstype="http://schema.org/Offer"]');
        for (const offer of offers) {
            try {
                let pricePerSquareMeterElement = offer.querySelector('p.pricePerSquareMeter');
                if (pricePerSquareMeterElement) {
                    pricePerSquareMeterElement.remove();
                }
                const priceNode = offer.querySelector('[itemprop="price"]');
                const price = findPrice(priceNode.textContent);
                const area = findArea(offer.querySelector('.area').previousElementSibling.textContent);
                const pricePerSquareMeter = (price / area).toLocaleString('es-CO', {style:'currency', currency: 'COP'}) + '/m\u00B2';
                pricePerSquareMeterElement = document.createElement('p');
                pricePerSquareMeterElement.className = 'pricePerSquareMeter';
                pricePerSquareMeterElement.style.fontSize = 'smaller';
                pricePerSquareMeterElement.style.fontWeight = 'normal';
                pricePerSquareMeterElement.appendChild(document.createTextNode(pricePerSquareMeter));
                priceNode.appendChild(pricePerSquareMeterElement);
            } catch(e) {
                // Do nothing
            }
        }
    }
    function calculatePricePerSquareMeterInSearchResults() {
        const offers = document.querySelectorAll('[itemtype="http://schema.org/Offer"]');
        console.log('calculating prices of', offers.length, 'offers');
        for (const offer of offers) {
            try {
                let pricePerSquareMeterElement = offer.querySelector('span.pricePerSquareMeter');
                if (pricePerSquareMeterElement) {
                    pricePerSquareMeterElement.remove();
                }
                const priceNode = offer.querySelector('[itemprop="price"]');
                const price = findPrice(priceNode.textContent);
                const area = findArea(offer.querySelector('.m2>p>span:nth-child(2)').textContent);
                const pricePerSquareMeter = (price / area).toLocaleString('es-CO', {style:'currency', currency: 'COP'}) + '/m\u00B2';
                pricePerSquareMeterElement = document.createElement('span');
                pricePerSquareMeterElement.className = 'pricePerSquareMeter';
                pricePerSquareMeterElement.style.fontSize = 'smaller';
                pricePerSquareMeterElement.style.fontWeight = 'normal';
                pricePerSquareMeterElement.appendChild(document.createTextNode(pricePerSquareMeter));
                priceNode.parentElement.appendChild(pricePerSquareMeterElement);
            } catch(e) {
                // Do nothing
            }
        }
    }
    function findPrice(value) {
        return parseFloat(value.match(/[\d.]+/)[0].replace(/\./g, ''));
    }
    function findArea(value) {
        return parseFloat(value.match(/[\d.]+/)[0]);
    }
    const offersContainer = document.querySelector('#resultListHtmlContainer');
    if (offersContainer) {
        new MutationObserver(calculatePricePerSquareMeter).observe(offersContainer, {childList: true});
    }
    calculatePricePerSquareMeter();
})();