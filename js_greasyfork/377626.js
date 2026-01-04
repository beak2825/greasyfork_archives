// ==UserScript==
// @name         fincaraiz.com.co price per square meter
// @namespace    https://github.com/healarconr
// @version      0.3
// @description  Show the price per square meter in the search results of fincaraiz.com.co
// @author       Hernán Alarcón
// @match        https://www.fincaraiz.com.co/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/377626/fincaraizcomco%20price%20per%20square%20meter.user.js
// @updateURL https://update.greasyfork.org/scripts/377626/fincaraizcomco%20price%20per%20square%20meter.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function calculatePricePerSquareMeter() {
        calculatePricePerSquareMeterInSearchResults();
        calculatePricePerSquareMeterInANewProject();
    }
    function calculatePricePerSquareMeterInSearchResults() {
        const advertisements = document.querySelectorAll('#divAdverts .advert, #divAdverts .AD_OV');
        for (const advertisement of advertisements) {
            try {
                let pricePerSquareMeterElement = advertisement.querySelector('p.pricePerSquareMeter');
                if (pricePerSquareMeterElement) {
                    pricePerSquareMeterElement.remove();
                }
                const priceNode = advertisement.querySelector('.price');
                const price = findFirstNumber(priceNode.textContent);
                const area = findFirstNumber(advertisement.querySelector('.surface').textContent)
                const pricePerSquareMeter = (price / area).toLocaleString('es-CO', {style:'currency', currency: 'COP'}) + '/m\u00B2';
                pricePerSquareMeterElement = document.createElement('p');
                pricePerSquareMeterElement.className = 'pricePerSquareMeter';
                pricePerSquareMeterElement.style.fontSize = 'smaller';
                pricePerSquareMeterElement.style.fontWeight = 'normal';
                pricePerSquareMeterElement.appendChild(document.createTextNode(pricePerSquareMeter));
                priceNode.insertBefore(pricePerSquareMeterElement, priceNode.querySelector('.compare_div'));
            } catch (e) {
                // Do nothing
            }
        }
    }
    function calculatePricePerSquareMeterInANewProject() {
        const offers = document.querySelectorAll('#typology tbody tr');
        for (const offer of offers) {
            try {
                const priceNode = offer.querySelector('td:nth-child(7)');
                const price = findFirstNumber(priceNode.textContent);
                const area = findFirstNumber(offer.querySelector('td:nth-child(3)').textContent);
                const pricePerSquareMeter = (price / area).toLocaleString('es-CO', {style:'currency', currency: 'COP'}) + '/m\u00B2';
                const pricePerSquareMeterElement = document.createElement('div');
                pricePerSquareMeterElement.style.fontSize = 'smaller';
                pricePerSquareMeterElement.style.fontWeight = 'normal';
                pricePerSquareMeterElement.appendChild(document.createTextNode(pricePerSquareMeter));
                priceNode.appendChild(pricePerSquareMeterElement);
            } catch (e) {
                // Do nothing
            }
        }
    }
    function calculatePricePerSquareMeterInTheMap() {
        const popUp = document.querySelector('li.proyect_Map');
        if (popUp) {
            try {
                const priceNode = popUp.querySelector('.texto_precio');
                const price = findFirstNumber(priceNode.textContent);
                const area = findFirstNumber(popUp.querySelector('.texto_area').textContent);
                const pricePerSquareMeter = (price / area).toLocaleString('es-CO', {style:'currency', currency: 'COP'}) + '/m\u00B2';
                const pricePerSquareMeterElement = document.createElement('div');
                pricePerSquareMeterElement.className = 'texto_precio';
                pricePerSquareMeterElement.style.fontSize = 'smaller';
                pricePerSquareMeterElement.style.fontWeight = 'normal';
                pricePerSquareMeterElement.appendChild(document.createTextNode(pricePerSquareMeter));
                popUp.insertBefore(pricePerSquareMeterElement, priceNode.nextSibling);
                document.querySelector('.leaflet-popup-content > div').style.height = null;
            } catch (e) {
                // Do nothing
            }
        }
    }
    function findFirstNumber(value) {
        return parseFloat(value.match(/[\d.,]+/)[0].replace(/\./g, '').replace(/,/g, '.'));
    }
    let observeMapPopUpMutationsStartDate = new Date();
    const observeMapPopUpMutationsTimeoutInMillis = 5000;
    function observeMapPopUpMutations() {
        const mapPopUpPane = document.querySelector('.leaflet-popup-pane');
        if (mapPopUpPane) {
            new MutationObserver(calculatePricePerSquareMeterInTheMap).observe(mapPopUpPane, {childList: true});
        } else {
            const currentDate = new Date();
            if (currentDate.getTime() - observeMapPopUpMutationsStartDate.getTime() < observeMapPopUpMutationsTimeoutInMillis) {
                setTimeout(observeMapPopUpMutations, 500);
            }
        }
    }
    const advertisementsContainer = document.querySelector('#divAdverts');
    if (advertisementsContainer) {
        new MutationObserver(calculatePricePerSquareMeter).observe(advertisementsContainer, {childList: true});
    }
    observeMapPopUpMutations();
    calculatePricePerSquareMeter();
})();
