// ==UserScript==
// @name         AH price calc
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Calculates the total price of your AH delivery and shows it on the "mijn lijst" page
// @author       Maarten
// @match        https://www.ah.nl/mijnlijst
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/25203/AH%20price%20calc.user.js
// @updateURL https://update.greasyfork.org/scripts/25203/AH%20price%20calc.meta.js
// ==/UserScript==

setTimeout(calc, 2500)

function calc() {
    var total = 0;

    var item = document.querySelectorAll('.shoppinglist-lane article');
    for (var i = 0; item[i]; i++) {
        var price = 0;

        if (typeof item[i].childNodes[0].childNodes[3].childNodes[1] !== 'undefined') {
            price = item[i].childNodes[0].childNodes[3].childNodes[1].outerText;
        } else {
            price = item[i].childNodes[0].childNodes[3].outerText;
        }

        var quantity = item[i].childNodes[1].childNodes[1].childNodes[2].value;

        total += quantity * price; 
    }

    total = Math.round(total * 100) / 100;

    var header = document.querySelectorAll('.edc-heading.heading--10')[0];
    header.innerHTML = header.innerHTML + ' € '+total.toLocaleString();
}