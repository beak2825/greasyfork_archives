// ==UserScript==
// @name         IMVU Hide All | by zo@imvu
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Adds a Hide All button to the IMVU web inventory page and clicks buttons with value="Hide" on each page
// @author       zo@imvu
// @match        https://www.imvu.com/catalog/web_inventory.php
// @grant        none
// @license MI
// @downloadURL https://update.greasyfork.org/scripts/489887/IMVU%20Hide%20All%20%7C%20by%20zo%40imvu.user.js
// @updateURL https://update.greasyfork.org/scripts/489887/IMVU%20Hide%20All%20%7C%20by%20zo%40imvu.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var delayBetweenHideButtons = 1000; // Adjust this delay as needed

    function addButton() {
        var hideAllButton = document.createElement('button');
        hideAllButton.innerHTML = 'Hide All';
        hideAllButton.style.position = 'fixed';
        hideAllButton.style.top = '20px';
        hideAllButton.style.right = '20px';
        hideAllButton.style.zIndex = '9999';
        hideAllButton.addEventListener('click', function() {
            console.log('Hide All button clicked');
            hideAll();
        });
        document.body.appendChild(hideAllButton);
    }

    function hideAll() {
        clickAllProductsLink();
    }

    function clickAllProductsLink() {
        var allProductsLink = document.querySelector('a[href="#tab7"]');
        if (allProductsLink) {
            allProductsLink.click();
            setTimeout(function() {
                visitPage(1);
            }, 500); // Adjust delay if needed
        } else {
            console.log('All Products link not found.');
        }
    }

    function visitPage(pageNumber) {
        var pageLink = document.querySelector('a[href^="javascript:loadInventory(\'all\',' + pageNumber + ');"]');
        if (pageLink) {
            pageLink.click();
            setTimeout(function() {
                clickHideButtons();
                var nextPageLink = document.querySelector('a[href^="javascript:loadInventory(\'all\',' + (pageNumber + 1) + ');"]');
                if (nextPageLink) {
                    visitPage(pageNumber + 1);
                } else {
                    console.log('Visited all pages.');
                    alert('Visited all pages.');
                }
            }, 200); // Delay before proceeding to the next page
        } else {
            console.log('Page link not found for page ' + pageNumber);
            alert('Visited all pages.');
        }
    }

    function clickHideButtons() {
        var hideButtons = document.querySelectorAll('button[value="Hide"]');
        if (hideButtons.length > 0) {
            hideButtons.forEach(function(button, index) {
                setTimeout(function() {
                    button.click();
                    console.log('Clicked hide button ' + (index + 1));
                }, index * delayBetweenHideButtons); // Add delay for each hide button
            });
            alert('Clicked ' + hideButtons.length + ' button(s) with value "Hide" on page.');
        } else {
            console.log('No hide buttons found on page.');
        }
    }

    addButton();
})();
