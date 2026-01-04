// ==UserScript==
// @name         Podświetlanie Zapłacono i Przy odbiorze w kolumnie 6 na stronie premiumtechpanel
// @version      0.5
// @author       Dawid
// @description  Podświetlanie komórek w kolumnie 6 zawierających wartości "Zapłacono" (zielony) lub "Przy odbiorze" (pomarańczowy) na stronie premiumtechpanel
// @match        https://premiumtechpanel.sellasist.pl/admin/orders/edit*
// @license      Proprietary
// @namespace https://greasyfork.org/users/1396754
// @downloadURL https://update.greasyfork.org/scripts/517514/Pod%C5%9Bwietlanie%20Zap%C5%82acono%20i%20Przy%20odbiorze%20w%20kolumnie%206%20na%20stronie%20premiumtechpanel.user.js
// @updateURL https://update.greasyfork.org/scripts/517514/Pod%C5%9Bwietlanie%20Zap%C5%82acono%20i%20Przy%20odbiorze%20w%20kolumnie%206%20na%20stronie%20premiumtechpanel.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.addEventListener('load', function() {
        document.querySelectorAll('table td:nth-child(6)').forEach(function(cell) {
            let statusElement = cell.querySelector('div.c-status__text');

            if (statusElement) {
                const statusText = statusElement.textContent.trim();

                if (statusText === "Zapłacono") {
                    cell.style.backgroundColor = '#a8ff00';
                    cell.style.color = '#000';
                } else if (statusText === "Przy odbiorze") {
                    cell.style.backgroundColor = '#ff8c00';
                    cell.style.color = '#000';
                } else if (statusText === "Częściowo") {
                    cell.style.backgroundColor = '#ff69b4';
                    cell.style.color = '#000';
                }
            }
        });
    });
})();