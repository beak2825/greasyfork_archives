// ==UserScript==
// @name         corporation_energy
// @namespace    virtonomica
// @version      0.1.2
// @description  Энергопотребление корпорации!
// @author       ThunderFit
// @include      http*://*virtonomic*.*/*/main/corporation/energy
// @downloadURL https://update.greasyfork.org/scripts/394625/corporation_energy.user.js
// @updateURL https://update.greasyfork.org/scripts/394625/corporation_energy.meta.js
// ==/UserScript==
var corporation_energy = function () {
    $('a.c_row').each(function (i, element) {
        $(element).children().each(function (r, child) {
            var container = $(child);
            var quantity = container.find('.c_qty');

            var quantityFrom = parseInt(quantity.first().text().replace(/ +/g, ''));
            var quantityTo = parseInt(quantity.last().text().replace(/ +/g, ''));
            if (isNaN(quantityFrom)) {quantityFrom = 1}
            if (isNaN(quantityTo)) {quantityTo = 1}

            var procentage_from = 100;
            var procentage_to = 100;
            var background = '';

            var lightColor = '#0EF';
            var darkColor = '#FB7';
            var zeroColor = '#EE0';

            if (quantityFrom >= quantityTo) {
                procentage_from = 100 - parseInt(quantityTo / quantityFrom * 100 );
                background = 'linear-gradient(to right, ' + zeroColor + ' ' + procentage_from + '%, ' + lightColor + ' ' + procentage_from + '%)';
            } else {
                procentage_from = parseInt(quantityFrom / quantityTo * 100 );
                background = 'linear-gradient(to right, ' + lightColor + ' ' + procentage_from + '%, ' + darkColor + ' ' + procentage_from + '%)';
            }
            if (background.length) {
                container.find('.c_name').css('background', background);
            }
        });
    });
}
if(window.top == window) {
    var script = document.createElement("script");
    script.textContent = '(' + corporation_energy.toString() + ')();';
    document.documentElement.appendChild(script);
}