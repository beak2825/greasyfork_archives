// ==UserScript==
// @name        Dolibarr product external reference linking
// @namespace   Violentmonkey Scripts
// @match       http://162.19.226.24/product/card.php*
// @grant       none
// @version     1.0
// @author      -
// @description 4/29/2024, 9:51:39 AM
// @downloadURL https://update.greasyfork.org/scripts/495250/Dolibarr%20product%20external%20reference%20linking.user.js
// @updateURL https://update.greasyfork.org/scripts/495250/Dolibarr%20product%20external%20reference%20linking.meta.js
// ==/UserScript==
// Get the element for external reference
var externalRefElement = document.querySelector('.valuefield.product_extras_external_ref');

// Get the element for codename
var codenameElement = document.querySelector('.valuefield.product_extras_main_supplier_codename');

// Extract text content from both elements
var externalRef = externalRefElement.textContent;
var codename = codenameElement.textContent;

// Function to create a link and replace the content of externalRefElement
function createLink(baseUrl, externalRef) {
    // Create a link element
    var link = document.createElement('a');

    // Set the href attribute of the link
    link.href = baseUrl + externalRef;

    // Set the text content of the link to the external reference
    link.textContent = externalRef;

    // Replace the text content of the external reference element with the link
    externalRefElement.textContent = '';
    externalRefElement.appendChild(link);
}

// Determine the appropriate link based on the codename
switch (codename) {
    case "JO":
        createLink("https://shop.hoj24.se/products/", externalRef);
        break;
    case "SH":
        createLink("https://b2b.shimano.com/bike/se/sv/product/", externalRef);
        break;
    case "MS":
        createLink("https://www.messingschlager.com/en/products/_t/?q=", externalRef);
        break;
    case "BT":
        // remove the dash
        createLink("https://www.biltema.se/redirect/article/1/sv/", externalRef.replace(/-/g, ""));
        break;
    case "CSN":
        // remove the dash
        createLink("https://www.cycleservicenordic.com/en/product-search?q=", externalRef);
        break;
    default:
        console.log("Unsupported codename.");
}
