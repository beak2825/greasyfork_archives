// ==UserScript==
// @name         AliExpress Total Price ++
// @version      1.2
// @description  Calculate and dynamically update total price including shipping on AliExpress product page
// @author       masssya
// @match        https://www.aliexpress.com/item/*
// @grant        none
// @namespace https://greasyfork.org/users/1323298
// @downloadURL https://update.greasyfork.org/scripts/500071/AliExpress%20Total%20Price%20%2B%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/500071/AliExpress%20Total%20Price%20%2B%2B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let priceElement, shippingElement, quantityElement, totalPriceElement, altQuantityElement;

    function calculateTotalPrice() {
        if (priceElement && shippingElement && quantityElement && totalPriceElement) {
            let priceText = priceElement.textContent.trim().split('$').pop(); // Extract the price after the last '$'
            let price = parseFloat(priceText);
            let quantity = parseInt(quantityElement.value.trim());
            let shippingText = "0";
            if (shippingElement.textContent.includes("Free")){
                if (shippingElement.textContent.includes("Free shipping over US $10.00")){
                    if (price*quantity<10){
                        shippingText = "1.99";
                    }
                    else {
                        shippingText = "0";
                    }
                }
                else {
                    shippingText = "0";
                }
            }
            else{
                shippingText = shippingElement.textContent.trim().split('$').pop(); // Extract the shipping after the last '$'
            }
            let shipping = parseFloat(shippingText);

            let altQuantity = 1;
            altQuantityElement.forEach(function (listObj) {
            // console.log(listObj.textContent.match(/.*?(\d+)\s*pcs/i)[1]);
            if (listObj.textContent.toLowerCase().includes("pcs")){
                altQuantity = parseInt(listObj.textContent.match(/.*?(\d+)\s*pcs/i)[1]);
                // console.log(altQuantity+" items per lot")
            }
          })
            // Looking for quantity per lot in price element
            let altPerLot = 1;
            if (priceElement.firstChild.nextSibling){
              altPerLot = parseInt(priceElement.firstChild.nextSibling.firstChild.nextSibling.firstChild.nextSibling.textContent);
              console.log(priceElement.firstChild.nextSibling.firstChild.nextSibling.firstChild.nextSibling.textContent+" pcs per lot");
            }

            // Calculate total price
            let totalPrice = (price * quantity) + shipping;
            let perItem = (totalPrice/(quantity*altQuantity*altPerLot))
            console.log("Total: "+price+" * "+quantity+" ("+altQuantity*altPerLot+" per lot) + "+shipping+" = "+totalPrice);

            // Update the total price element
            if (isNaN(shipping)){
              totalPriceElement.textContent = `Can't be shipped!`;
            }
            else{
              totalPriceElement.textContent = `Total: $${totalPrice.toFixed(2)} (${quantity*altQuantity*altPerLot} x ${perItem.toFixed(2)})`;
            }
        }
    }

    // Function to initialize elements and setup mutation observers
    function initializeElements() {
        console.log("Script is running");
        priceElement = document.querySelector('.product-price-current');
        console.log("Price: "+priceElement.firstChild.textContent);
        shippingElement = document.querySelector(".dynamic-shipping-line"); // Specific shipping cost element
        // console.log("Shipping: "+shippingElement.textContent);
        quantityElement = document.querySelector('.comet-v2-input-number-input'); // Input field for quantity
        // console.log("Quantity: "+quantityElement.value);
        altQuantityElement = document.querySelectorAll("div[class^='sku-item--title--']");
      // console.log(altQuantityElement);
        totalPriceElement = document.createElement('div');
        totalPriceElement.style.fontSize = '18px';
        totalPriceElement.style.color = 'red';
        totalPriceElement.style.fontWeight = 'bold';
        totalPriceElement.style.marginTop = '10px';

        if (priceElement) {
            // priceElement.parentNode.insertBefore(totalPriceElement, priceElement.nextSibling);
            priceElement.parentNode.appendChild(totalPriceElement);
        }

        // MutationObserver to detect changes in price, shipping, and quantity
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
              // console.log(mutation.type);
              // console.log(mutation.target);
                // if (mutation.type === 'childList' && (mutation.target === priceElement || mutation.target === shippingElement)) {
                // if (mutation.target === priceElement || mutation.target === shippingElement) {
                    calculateTotalPrice();
                // }
            });
        });

        // Observe changes
        if (priceElement) {
            observer.observe(priceElement.parentNode, { childList: false, attributes: true, characterData: true, subtree: true });
        }
        if (shippingElement) {
            observer.observe(shippingElement.parentNode, { childList: true, attributes: true, characterData: true, subtree: true });
        }
        if (quantityElement) {
            observer.observe(quantityElement.parentNode, { childList: true, attributes: true, characterData: true, subtree: true });
        }
    }

    // Call the function initially when the page is fully loaded
    window.addEventListener('load', function() {
        initializeElements();
        calculateTotalPrice();
    });

})();
