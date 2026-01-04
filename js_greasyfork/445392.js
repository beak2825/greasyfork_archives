// ==UserScript==
// @name         Per Unit Price on Cards
// @namespace    http://tampermonkey.net/
// @version      0.9
// @description  Adds per unit prices to cards
// @author       ItMeCube
// @match        https://www.kroger.com/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=kroger.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/445392/Per%20Unit%20Price%20on%20Cards.user.js
// @updateURL https://update.greasyfork.org/scripts/445392/Per%20Unit%20Price%20on%20Cards.meta.js
// ==/UserScript==

(function() {
    'use strict';
    //Every second look for new cards
    let checkForCards = setInterval(main,1000)

    function main(){
        //get cards based on css class
        const productCards = document.querySelectorAll(".ProductCard")
        if(productCards.length < 1) return; // No cards return.
        //for each card ...
        const cards = Array.from(productCards);
        cards
            .filter(card => {
            // if we've already modified the card move on.
            return !card.dataset.unitPriceAdded
        })
            .forEach(card => {
            //get data from dom
            let price = getPrice(card);
            let units = getUnits(card);
            //create new text
            let perUnitPrice = calcPerUnitPrice(price,units);
            //append new text to element
            addPricePerUnitToCard(card, perUnitPrice);
            //mark card as being edited
            card.dataset.unitPriceAdded = 'true';
        })
    }

    function getPrice(el){
        let priceEl = el.querySelector('data[typeof=Price]')
        return Number(priceEl.value)
    }

    function getUnits(element){
        var units = element.querySelector('[data-qa=cart-page-item-sizing]')?.innerText;
        let numberRegex = /\d+[\/\.]?\d*/ // extracts numbers and fractions
        let unitRegex = /[A-z]+/ // extracts text
        let number = numberRegex.exec(units)[0]; //first match
        let unit = unitRegex.exec(units)[0]; //first match

        if(number.includes('/')){
            let values = number.split('/');
            number = values[0]/values[1];
        }

        return [Number(number), unit]
    }

    function calcPerUnitPrice(price,units){
        if(units[0]===1) return "&nbsp;";
        if(units[1]==='lb') return "&nbsp;";
        const pricePerUnit = (price/units[0]).toLocaleString('en-US', {style:'currency',currency:'USD'})
        return `${pricePerUnit} per ${units[1]}`
    }

    function addPricePerUnitToCard(element, text){
        let priceEl = element.querySelector('data[typeof=Price]');
        let perUnitPriceEl = document.createElement('div');
        perUnitPriceEl.style.fontWeight = "bold";
        perUnitPriceEl.innerHTML = text;
        priceEl.parentElement.after(perUnitPriceEl);
    }

    // Your code here...
})();