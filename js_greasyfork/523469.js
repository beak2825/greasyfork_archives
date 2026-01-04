// ==UserScript==
// @name         Automatische Suche + Klick + Benachrichtigung
// @description  search for words
// @version      1.8.3
// @match        *://www.amazon.de/vine/vine-items*

// @require      https://code.jquery.com/jquery-3.7.1.min.js
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        GM_xmlhttpRequest

// @run-at       document-end
// @noframes
// @namespace    https://greasyfork.org/users/83290

// @downloadURL https://update.greasyfork.org/scripts/523469/Automatische%20Suche%20%2B%20Klick%20%2B%20Benachrichtigung.user.js
// @updateURL https://update.greasyfork.org/scripts/523469/Automatische%20Suche%20%2B%20Klick%20%2B%20Benachrichtigung.meta.js
// ==/UserScript==

(async function() {
    'use strict';

    let selectedAddressId = localStorage.getItem('selectedAddressId');
    let selectedLegacyAddressId = localStorage.getItem('selectedLegacyAddressId');

    const CRSRF_TOKEN = document.body.querySelector('input[name="csrf-token"]').value;

    const style = document.createElement('style');
    style.textContent = `
      #notification-popup {
        display: none;
        position: fixed;
        bottom: 20px;
        right: 20px;
        background-color: #333;
        color: #fff;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        max-width: 400px;
        word-wrap: break-word;
        z-index: 1000;
        font-size: 14px;
        font-family: Arial, sans-serif;
        white-space: pre-wrap;
      }
      #address-selector {
        margin: 10px 0;
        padding: 5px;
        font-size: 14px;
      }
    `;
    document.head.appendChild(style);

    const notification = document.createElement('div');
    notification.id = 'notification-popup';
    document.body.appendChild(notification);

    function showNotification(text, duration = 5000) {
        notification.textContent = text;
        notification.style.display = 'block';

        setTimeout(() => {
            notification.style.display = 'none';
        }, duration);
    }

    function createAddressDropdown() {
        const addressElements = document.body.querySelectorAll('.vvp-address-option');
        const dropdown = document.createElement('select');
        dropdown.style.marginRight = '10px';
        dropdown.id = 'address-selector';

        addressElements.forEach((element) => {
            const addressId = element.getAttribute('data-address-id');
            const legacyAddressId = element.getAttribute('data-legacy-address-id');

            // Extract only the street address as the rest is just clutter
            const streetAddress = element.querySelector('.a-radio-label > span:nth-of-type(1)')?.textContent.trim();

            if (streetAddress) {
                const option = document.createElement('option');
                option.value = addressId;
                option.textContent = streetAddress;
                option.dataset.legacyAddressId = legacyAddressId;
                dropdown.appendChild(option);
            }
        });

        // Default to first option if no address is selected
        if (dropdown.options.length > 0) {
            if (selectedAddressId) {
                dropdown.value = selectedAddressId;
            } else {
                selectedAddressId = dropdown.options[0].value;
                selectedLegacyAddressId = dropdown.options[0].dataset.legacyAddressId;
            }
        } else {
            // If no items are showing, then Amazon does not return addresses
            return;
        }

        dropdown.onchange = function() {
            selectedAddressId = this.value;
            selectedLegacyAddressId = this.options[this.selectedIndex].dataset.legacyAddressId;
            localStorage.setItem('selectedAddressId', selectedAddressId);
            localStorage.setItem('selectedLegacyAddressId', selectedLegacyAddressId);
        };

        document.body.querySelector('#vvp-items-button-container').prepend(dropdown);
    }

    createAddressDropdown();

    // Blacklist mit Markenbezeichnern
    const BLACKLIST = ['loevschall', 'momi', 'levis', 'pepe jeans', 'kare design', 'hansgrohe', 'paulmann', 'cressi', 'colamy'];

    // Whitelist mit bevorzugten Wörtern
    const WHITELIST = ['kitkat', 'vodka', 'alkoholfrei', 'kekse', 'schokolade'];

   async function createCartPurchaseButton(item) {
        const isParent = item.querySelector('input').getAttribute('data-is-parent-asin') === 'true';
        const asin = item.querySelector('.vvp-details-btn .a-button-input').dataset.asin;
        const recommendationId = item.getAttribute('data-recommendation-id');

        const cartButton = document.createElement('button');
        cartButton.type = 'button';
        cartButton.className = 'a-button a-button-primary a-button-small';
        cartButton.style.marginTop = '-10px';
        cartButton.style.height = '30px';
        cartButton.style.display = 'block';

        const buttonText = isParent ? '🛍️' : '🛒';
        cartButton.innerHTML = `<span class="a-button-inner"><span class="a-button-text emoji">${buttonText}</span></span>`;
        cartButton.onclick = () => cartPurchase(recommendationId, asin, isParent);

        const contentElement = item.querySelector('.vvp-item-tile-content');
        if (contentElement) {
            contentElement.appendChild(cartButton);
        } else {
            console.warn('Das Element .vvp-item-tile-content konnte nicht gefunden werden.');
        }


    // Preis prüfen und Button klicken, wenn der Preis über 121 € liegt
  (async function() {
            const cachedProduct = JSON.parse(localStorage.getItem(`product_${asin}`));
            let price;

            if (cachedProduct) {
                price = cachedProduct.price;
                console.log(`Preis aus Cache abgerufen: ${price} €`);
            } else {
                price = await getPriceByLink(item.querySelector('a').href);
                // Speichern im Cache
                if (price > 0) {
                    localStorage.setItem(`product_${asin}`, JSON.stringify({ title: item.querySelector('.vvp-item-product-title-container').textContent, asin: asin, price: price }));
                }
            }

            const productTitle = item.querySelector('.vvp-item-product-title-container').textContent.toLowerCase();

            // Überprüfen, ob der Titel ein Wort aus der Blacklist oder Whitelist enthält
            const containsBlacklistWord = BLACKLIST.some(word => productTitle.includes(word.toLowerCase()));
            const containsWhitelistWord = WHITELIST.some(word => productTitle.includes(word.toLowerCase()));

            if (!containsBlacklistWord && (price > 121 || containsWhitelistWord)) {
                console.log('Produkt erfüllt die Bedingungen. Klicke den Button...');
                cartButton.click(); // Klick auf den Button
                reloadPageAfterProduct(); // Nach dem Klick wird die Seite in 3 Sekunden neu geladen
            } else {
                console.log('Produkt erfüllt die Bedingungen nicht. Kauf wird verhindert.');
            }
        })();
    }

    function reloadPageAfterProduct() {
        console.log('Produkt verarbeitet, Seite wird in 3 Sekunden neu geladen...');

        // Verzögerung von 3 Sekunden, um genügend Zeit für den Klick zu lassen
        setTimeout(() => {
            location.reload(); // Seite neu laden
        }, 3000);
    }

    async function cartPurchase(recommendationId, asin, isParent) {
        if (isParent) {
            const encodedId = encodeURIComponent(recommendationId);
            const url = `https://www.amazon.de/vine/api/recommendations/${encodedId}`;

            try {
                const response = await fetch(url);
                const data = await response.json();
                asin = data.result?.variations?.[0]?.asin;
            } catch (error) {
                showNotification('Error fetching variation ASIN');
                return;
            }
        }

        if (!recommendationId || !asin || !selectedAddressId || !selectedLegacyAddressId || !CRSRF_TOKEN) {
            showNotification('Could not trigger cart purchase as one or more key variables are missing.');
            return;
        }

        const payload = JSON.stringify({
            recommendationId: recommendationId,
            recommendationType: "SEARCH",
            itemAsin: asin,
            addressId: selectedAddressId,
            legacyAddressId: selectedLegacyAddressId
        });

        try {
            const req = await fetch("https://www.amazon.de/vine/api/voiceOrders", {
                method: 'POST',
                body: payload,
                headers: {
                    'anti-csrftoken-a2z': CRSRF_TOKEN,
                    'content-type': 'application/json'
                }
            });

            const response = await req.json();
            showNotification(JSON.stringify(response));

            // Nur Seite neu laden, wenn der Kauf erfolgreich war
            console.log('Kauf erfolgreich, Seite wird in 3 Sekunden neu geladen...');
            setTimeout(() => {
                location.reload();
            }, 3000);
        } catch (error) {
            showNotification('Purchase failed');
        }
    }

    document.body.querySelectorAll('.vvp-item-tile').forEach(createCartPurchaseButton);

    // Warte, bis das Dokument vollständig geladen ist
    window.addEventListener('load', () => {
        startProductCheck();
    });

    // Funktion zum Starten der Produktüberprüfung
    function startProductCheck() {
        let itemsGrid = document.getElementById('vvp-items-grid');

        if (itemsGrid) {
            let productTiles = itemsGrid.querySelectorAll('.vvp-item-tile');
            checkNewProducts(productTiles);
        } else {
            console.log('Das Element mit der ID "vvp-items-grid" wurde nicht gefunden.');
        }
    }

    async function checkNewProducts(productTiles) {
        let checkedProducts = getCheckedProducts();
        let newProductsFound = false;

        for (const productTile of productTiles) {
            let asin = productTile.querySelector('.a-button.a-button-primary.vvp-details-btn input[type="submit"]').getAttribute("data-asin");

            if (!checkedProducts.includes(asin)) {
                newProductsFound = true;

                // Sammeln der Produktinformationen
                let productTitle = productTile.querySelector('.vvp-item-product-title-container').textContent.trim();
                let productImage = productTile.querySelector('img').src;
                let productLink = productTile.querySelector('a').href;

                // Preis abrufen
                let cachedProduct = JSON.parse(localStorage.getItem(`product_${asin}`));
                let price;

                if (cachedProduct) {
                    price = cachedProduct.price;
                    console.log(`Preis aus Cache abgerufen: ${price} €`);
                } else {
                    price = await getPriceByLink(productLink);
                    if (price > 0) {
                        localStorage.setItem(`product_${asin}`, JSON.stringify({ title: productTitle, asin: asin, price: price }));
                    }
                }

                // Push-Benachrichtigung mit Preis senden
                sendPushNotification({ productTitle, productImage, productLink }, price);

                // Als geprüft markieren
                checkedProducts.push(asin);
                updateCheckedProducts(checkedProducts);

                // Verzögerung zwischen den Aktionen
                await delay(500); // 0,5 Sekunde Verzögerung
            }
        }

        if (newProductsFound) {
            console.log('Neue Produkte gefunden und verarbeitet. Seite wird in 3 Sekunden neu geladen.');
            scheduleReload(3000); // 3 Sekunden Verzögerung für Reload
        } else {
            console.log('Keine neuen Produkte gefunden. Setze die Suche fort.');
            scheduleReload(); // Standard-Verzögerung für Reload
        }
    }

    // Hilfsfunktion für Verzögerung
    function delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // Funktion zum Abrufen des Preises über den Produktlink mit Wiederholungslogik
    async function getPriceByLink(link, maxRetries = 3, retryDelay = 1500) {
        let attempt = 0;

        while (attempt < maxRetries) {
            try {
                let response = await fetch(link);
                let rtext = await response.text();

                let priceMatch = rtext.match(/<span class="a-offscreen">([\d,]+(?:\s| )*€)<\/span>/);

                if (priceMatch) {
                    let pricestr = priceMatch[1]
                        .replace(/[^\u0000-\u007F]+/g, "") // Entfernt nicht-ASCII-Zeichen
                        .replace(",", ".") // Komma durch Punkt ersetzen
                        .replace("€", ""); // Eurozeichen entfernen

                    let price = parseFloat(pricestr); // Umwandlung in eine Zahl
                    console.log(`Preis erfolgreich abgerufen: ${price} €`);
                    return price; // Erfolgreicher Abruf, Preis zurückgeben
                } else {
                    console.warn(`Versuch ${attempt + 1}: Preis konnte nicht gefunden werden.`);
                }
            } catch (error) {
                console.error(`Fehler beim Abrufen des Preises (Versuch ${attempt + 1}):`, error);
            }

            attempt++;
            if (attempt < maxRetries) {
                console.log(`Warte ${retryDelay / 500} Sekunden vor erneutem Versuch...`);
                await new Promise(resolve => setTimeout(resolve, retryDelay));
            }
        }

        console.warn('Maximale Anzahl von Versuchen erreicht. Preis konnte nicht abgerufen werden.');
        return -1; // Gibt -1 zurück, falls kein Preis gefunden wurde
    }

    // Server- und Pushover-Konfiguration
    const NAS_SERVER_URL = 'https://192.168.178.92:477/';
    const PUSHOVER_USER_KEY = 'u7u6ioq46a367zehqk1rz968rzv6yr';
    const PUSHOVER_API_TOKEN = 'augogfpc4dvh5pd7tjpd2e3m949372';

    // Funktion zum Senden der Daten an den NAS-Server
    function sendToServer(data) {
        fetch(NAS_SERVER_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        }).then(response => {
            if (!response.ok) {
                throw new Error('Netzwerkantwort war nicht ok');
            }
            return response.json();
        }).then(data => {
            console.log('Daten erfolgreich an den Server gesendet:', data);
        }).catch(error => {
            console.error('Fehler beim Senden der Daten:', error);
        });
    }

    // Funktion zur Sendung einer Pushbenachrichtigung mit Pushover
    function sendPushNotification(product, price) {
        let message = `${product.productTitle}\nPreis: ${price > 0 ? `${price} €` : "nicht verfügbar"}\nProduktlink: ${product.productLink}\nZur Vine-Seite: https://www.amazon.de/vine/vine-items`;

        GM_xmlhttpRequest({
            method: 'GET',
            url: product.productImage,
            responseType: 'blob',
            onload: function(response) {
                if (response.status === 200) {
                    let imageBlob = new Blob([response.response], { type: 'image/jpeg' });

                    let formData = new FormData();
                    formData.append('token', PUSHOVER_API_TOKEN);
                    formData.append('user', PUSHOVER_USER_KEY);
                    formData.append('message', message);
                    formData.append('title', 'Neues Produkt gefunden');
                    formData.append('attachment', imageBlob, 'product.jpg');

                    fetch('https://api.pushover.net/1/messages.json', {
                        method: 'POST',
                        body: formData
                    })
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('Fehler bei der Pushover-Anfrage');
                        }
                        return response.json();
                    })
                    .then(data => {
                        console.log('Pushbenachrichtigung gesendet:', data);
                    })
                    .catch(error => {
                        console.error('Fehler bei der Sendung der Pushbenachrichtigung:', error);
                    });
                } else {
                    console.error('Fehler beim Herunterladen des Bildes:', response.statusText);
                }
            },
            onerror: function(error) {
                console.error('Fehler bei der GM_xmlhttpRequest-Anfrage:', error);
            }
        });
    }

    function scheduleReload() {
        let reloadDelay = getRandomReloadDelay();
        document.title = `Nächste Aktualisierung in ${reloadDelay / 1000} Sekunden`;
        setTimeout(() => {
            location.reload();
        }, reloadDelay);
    }

    function getRandomReloadDelay() {
        return Math.floor(Math.random() * (1500 - 600 + 1)) + 500;
    }

    function resetCheckedProducts() {
        localStorage.removeItem('checkedProducts');
    }

    function getCheckedProducts() {
        let checkedProducts = localStorage.getItem('checkedProducts');
        return checkedProducts ? JSON.parse(checkedProducts) : [];
    }

    function updateCheckedProducts(checkedProducts) {
        localStorage.setItem('checkedProducts', JSON.stringify(checkedProducts));
    }

    function checkAndReload() {
        let errorMessage = document.getElementById('vvp-generic-request-error-msg');
        let amazonErrorMessage = document.querySelector('.a-box.a-alert.a-alert-error');

        if (errorMessage || amazonErrorMessage) {
            console.log('Fehlermeldung gefunden. Seite wird in 3 Sekunden neu geladen.');
            setTimeout(() => {
                location.reload();
            }, 3000);
        }
    }
})();