// ==UserScript==
// @name         Login, źródło i NIP zamówienia dodany do karty zwrotu
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Pobiera login kupującego, źródło zamówienia i status pola NIP z pierwotnego zamówienia i dodaje je jako popup na karcie zwrotu danego klienta
// @author       Dawid
// @match        *://premiumtechpanel.sellasist.pl/admin/returns/*
// @license      Proprietary
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/518323/Login%2C%20%C5%BAr%C3%B3d%C5%82o%20i%20NIP%20zam%C3%B3wienia%20dodany%20do%20karty%20zwrotu.user.js
// @updateURL https://update.greasyfork.org/scripts/518323/Login%2C%20%C5%BAr%C3%B3d%C5%82o%20i%20NIP%20zam%C3%B3wienia%20dodany%20do%20karty%20zwrotu.meta.js
// ==/UserScript==

(function () {
    'use strict';
    const originalOrderLink = document.querySelector('a[href*="/admin/orders/edit/"].u-underline');
    if (!originalOrderLink) {
        console.error('Nie znaleziono odnośnika do pierwotnego zamówienia.');
        return;
    }
    const originalOrderURL = originalOrderLink.href;
    console.log('URL pierwotnego zamówienia:', originalOrderURL);
    fetch(originalOrderURL)
        .then(response => {
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
            return response.text();
        })
        .then(data => {
            const parser = new DOMParser();
            const doc = parser.parseFromString(data, 'text/html');
            const usernameElement = doc.querySelector('a[href*="allegro.pl/uzytkownik/"]');
            if (!usernameElement) {
                console.error('Nie znaleziono nazwy użytkownika.');
                return;
            }
            const username = usernameElement.textContent.trim();
            console.log('Znaleziono login:', username);
            const sourceElement = doc.querySelector('td[data-account-type][data-account-name] div.m-order-panel-section__row');
            if (!sourceElement) {
                console.error('Nie znaleziono źródła zamówienia.');
                return;
            }
            const source = sourceElement.childNodes[0]?.textContent.trim();
            console.log('Znaleziono źródło zamówienia:', source);
            const nipElement = doc.querySelector('#bill_address_company_nip input.company_nip');
            let nipInfo;
            if (nipElement && nipElement.value.trim()) {
                nipInfo = `NIP firmy: ${nipElement.value.trim()}`;
            } else {
                nipInfo = 'Pole NIP jest puste.';
            }
            console.log('Informacja o NIP:', nipInfo);
            const popup = document.createElement('div');
            popup.style.position = 'fixed';
            popup.style.top = '15%';
            popup.style.left = '50%';
            popup.style.transform = 'translate(-50%, -50%)';
            popup.style.backgroundColor = '#ffcccc';
            popup.style.color = '#000';
            popup.style.border = '2px solid #990000';
            popup.style.padding = '20px';
            popup.style.fontSize = '18px';
            popup.style.fontWeight = 'bold';
            popup.style.textAlign = 'center';
            popup.style.boxShadow = '0 0 15px rgba(0, 0, 0, 0.5)';
            popup.style.zIndex = '10000';
            popup.innerHTML = `
                <p>Login: ${username}</p>
                <p>Źródło: ${source}</p>
                <p>${nipInfo}</p>
            `;
            document.body.appendChild(popup);
        })
        .catch(error => console.error('Błąd podczas pobierania danych zamówienia:', error));
})();