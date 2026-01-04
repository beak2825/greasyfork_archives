 // ==UserScript==
 // @name         Link do produktu na stronie z panelu
 // @namespace    http://butosklep.pl/panel/
 // @version      1.2
 // @description  Link z edycji towaru do produktu na sklepie
 // @author       Marcin
 // @match        https://butosklep.pl/panel/product.php*
 // @icon         https://butosklep.pl/gfx/pol/favicon.ico
 // @grant        none
// @downloadURL https://update.greasyfork.org/scripts/459948/Link%20do%20produktu%20na%20stronie%20z%20panelu.user.js
// @updateURL https://update.greasyfork.org/scripts/459948/Link%20do%20produktu%20na%20stronie%20z%20panelu.meta.js
 // ==/UserScript==

function convertToAscii(string) {
    const stringWithoutAccents = string.normalize("NFD").replace(/[\u0300-\u036f]/g, '');
    return stringWithoutAccents;
}
 
window.addEventListener('load', function() {
   let productTitle = document.querySelector("#product-edit-aceform-basic-elem-2 h3").textContent;
   let buttonForLinkToProduct = document.querySelector("#product-edit-aceform-basic-elem-2 h3");
   let productId = document.querySelector(".hiddenId").id;
   productTitle = convertToAscii(productTitle);
   productTitle = productTitle.split(' ').join('-');
   buttonForLinkToProduct.innerHTML = `<a href="https://butosklep.pl/product-pol-${productId}-${productTitle}.html">${buttonForLinkToProduct.innerHTML}</a>`;
}, false);