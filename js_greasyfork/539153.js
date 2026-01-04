// ==UserScript==
// @name         CRM Tools: Google Maps & Remote Order Link
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  Adds buttons for Google Maps search and remote_id order link (no duplicates, dynamic-safe, Edge-friendly)
// @author       You
// @match        *://omins.snipesoft.net.nz/modules/omins/invoices_addedit.php?tableid=1041&id=*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/539153/CRM%20Tools%3A%20Google%20Maps%20%20Remote%20Order%20Link.user.js
// @updateURL https://update.greasyfork.org/scripts/539153/CRM%20Tools%3A%20Google%20Maps%20%20Remote%20Order%20Link.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function waitForElements(selectorIds, callback, maxAttempts = 30) {
        let attempts = 0;
        const interval = setInterval(() => {
            const elements = selectorIds.map(id => document.getElementById(id));
            const remoteIdField = document.querySelector('input[name="remote_id"]');
            const allFound = elements.every(el => el !== null) && remoteIdField;

            if (allFound) {
                clearInterval(interval);
                const elementMap = {};
                selectorIds.forEach((id, index) => {
                    elementMap[id] = elements[index];
                });
                elementMap['remote_id'] = remoteIdField;
                callback(elementMap);
            }

            if (++attempts >= maxAttempts) {
                clearInterval(interval);
                console.warn('Tampermonkey: Required elements not found in time.');
            }
        }, 300);
    }

    waitForElements(
        ['address', 'city', 'postcode', 'state', 'country'],
        ({ address, city, postcode, state, country, remote_id }) => {

            // ---------- Google Maps Button ----------
            if (!document.getElementById('search-address-btn')) {
                const mapsButton = document.createElement('button');
                mapsButton.id = 'search-address-btn';
                mapsButton.textContent = 'Search Address';
                mapsButton.style.marginTop = '5px';
                mapsButton.style.marginLeft = '10px';
                mapsButton.style.padding = '4px 10px';
                mapsButton.style.fontSize = '0.9em';
                mapsButton.style.cursor = 'pointer';

                mapsButton.addEventListener('click', function (e) {
                    e.preventDefault();
                    e.stopPropagation();

                    const countryVal = country.value.trim() || 'New Zealand';
                    const fullAddress = [
                        address.value.trim(),
                        city.value.trim(),
                        postcode.value.trim(),
                        state.value.trim(),
                        countryVal
                    ]
                        .filter(part => part !== '')
                        .join(', ');

                    const mapsURL = 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(fullAddress);
                    window.open(mapsURL, '_blank');
                });

                const mapsSpacer = document.createElement('div');
                mapsSpacer.appendChild(mapsButton);
                country.parentElement.appendChild(mapsSpacer);
            }

            // ---------- Remote Order Button ----------
            const remoteValue = remote_id.value.trim();
            if (remoteValue && !document.getElementById('go-to-order-btn')) {
                const orderButton = document.createElement('button');
                orderButton.id = 'go-to-order-btn';
                orderButton.textContent = 'Go to Order';
                orderButton.style.marginTop = '5px';
                orderButton.style.marginLeft = '10px';
                orderButton.style.padding = '4px 10px';
                orderButton.style.fontSize = '0.9em';
                orderButton.style.cursor = 'pointer';

                orderButton.addEventListener('click', function (e) {
                    e.preventDefault();
                    e.stopPropagation();

                    const url = 'https://store-va5pcinq8p.mybigcommerce.com/manage/orders/' + remoteValue;
                    window.open(url, '_blank');
                });

                const orderSpacer = document.createElement('div');
                orderSpacer.appendChild(orderButton);
                remote_id.parentElement.appendChild(orderSpacer);
            }
        }
    );
})();
