// ==UserScript==
// @name         goplaceit.com price per square meter
// @namespace    https://github.com/healarconr
// @version      0.1
// @description  Show the price per square meter in the search results of goplaceit.com
// @author       Hernán Alarcón
// @match        https://www.goplaceit.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/393189/goplaceitcom%20price%20per%20square%20meter.user.js
// @updateURL https://update.greasyfork.org/scripts/393189/goplaceitcom%20price%20per%20square%20meter.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function calculatePricePerSquareMeter() {
        calculatePricePerSquareMeterInSearchResults();
    }
    function calculatePricePerSquareMeterInSearchResults() {
        const properties = document.querySelectorAll('.properties-list > .property');
        for (const property of properties) {
            try {
                let pricePerSquareMeterElement = property.querySelector('p.pricePerSquareMeter');
                if (pricePerSquareMeterElement) {
                    pricePerSquareMeterElement.remove();
                }
                const priceNode = property.querySelector('.price');
                const price = findPrice(priceNode.textContent);
                const area = findArea(property.querySelector('.features-summary .css-td:nth-child(3)').textContent)
                const pricePerSquareMeter = (price / area).toLocaleString('es-CO', {style:'currency', currency: 'COP'}) + '/m\u00B2';
                pricePerSquareMeterElement = document.createElement('p');
                pricePerSquareMeterElement.className = 'pricePerSquareMeter';
                pricePerSquareMeterElement.style.fontSize = 'smaller';
                pricePerSquareMeterElement.style.fontWeight = 'normal';
                pricePerSquareMeterElement.appendChild(document.createTextNode(pricePerSquareMeter));
                priceNode.parentNode.insertBefore(pricePerSquareMeterElement, priceNode.nextSibling);
            } catch (e) {
                // Do nothing
            }
        }
    }
    function findPrice(value) {
        return parseFloat(value.match(/[\d.,]+/)[0].replace(/[,.]/g, ''));
    }
    function findArea(value) {
        return parseFloat(value.match(/[\d.,]+/)[0].replace(/[,]/g, ''));
    }
    const propertiesContainer = document.querySelector('.properties-list');
    if (propertiesContainer) {
        new MutationObserver(calculatePricePerSquareMeter).observe(propertiesContainer, {childList: true});
    }
    calculatePricePerSquareMeter();
    //setTimeout(calculatePricePerSquareMeter, 2000);
})();