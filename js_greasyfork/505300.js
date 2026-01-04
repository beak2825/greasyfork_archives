// ==UserScript==
// @name         Autoklick + Benachrichtigungen 1.0
// @description  search for words
// @version      1.1
// @match        *://www.amazon.de/vine/vine-items*

// @require      https://code.jquery.com/jquery-3.7.1.min.js
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        GM_xmlhttpRequest

// @run-at       document-end
// @noframes
// @namespace    https://greasyfork.org/users/83290
// @downloadURL https://update.greasyfork.org/scripts/505300/Autoklick%20%2B%20Benachrichtigungen%2010.user.js
// @updateURL https://update.greasyfork.org/scripts/505300/Autoklick%20%2B%20Benachrichtigungen%2010.meta.js
// ==/UserScript==

/*globals $*/

// Server- und Pushover-Konfiguration
const NAS_SERVER_URL = 'https://192.168.178.92:477/';
const PUSHOVER_USER_KEY = 'u7u6ioq46a367zehqk1rz968rzv6yr';
const PUSHOVER_API_TOKEN = 'augogfpc4dvh5pd7tjpd2e3m949372';

// Blacklist-Konfiguration
const blacklistWords = ['loevschall','momi','levis','pepe jeans','kare design','hansgrohe','paulmann']; // Hier fügst du weitere Wörter hinzu

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

// Funktion zum Überprüfen neuer Produkte
function checkNewProducts(productTiles) {
    let checkedProducts = getCheckedProducts();
    let newProductsFound = false;
    let allProductData = [];

    productTiles.forEach(productTile => {
        let asin = productTile.querySelector('.a-button.a-button-primary.vvp-details-btn input[type="submit"]').getAttribute("data-asin");

        if (!checkedProducts.includes(asin)) {
            newProductsFound = true;

            // Sammeln der Produktinformationen
            let productTitle = productTile.querySelector('.vvp-item-product-title-container').textContent.trim();
            let productImage = productTile.querySelector('img').src;
            let productLink = productTile.querySelector('a').href;

            allProductData.push({ asin, productTitle, productImage, productLink });

            // Klickaktionen bleiben erhalten
            let detailsButton = productTile.querySelector('.a-button.a-button-primary.vvp-details-btn input[type="submit"]');
            if (detailsButton) {
                detailsButton.click();

                checkedProducts.push(asin);
                updateCheckedProducts(checkedProducts);

                // Verwendet setTimeout, um den Popup-Dialog vollständig laden zu lassen
                setTimeout(() => {
                    handlePopup(productTiles.length == 1);
                }, 2000);
            }
        }
    });

    if (newProductsFound) {
        sendToServer(allProductData);
        allProductData.forEach(product => sendPushNotification(product));
    } else {
        console.log('Keine neuen Produkte gefunden. Setze die Seite fort, um nach neuen Produkten zu suchen.');
        scheduleReload();
    }
}

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
function sendPushNotification(product) {
    let message = `${product.productTitle}\nProduktlink: ${product.productLink}\nZur Vine-Seite: https://www.amazon.de/vine/vine-items`;

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

// Funktion zur Behandlung des Popups
function handlePopup(isLastProduct) {
    let intervalId = setInterval(() => {
        let taxValueElement = $('#vvp-product-details-modal--tax-value-string');
        if (taxValueElement.length > 0) {
            let taxValue = parseFloat(taxValueElement.text().replace('€', '').trim());

            if (!isNaN(taxValue)) {
                clearInterval(intervalId);

                if (taxValue > 121) {
                    let productTitleElement = $('#vvp-product-details-modal--product-title');
                    let productTitle = productTitleElement ? productTitleElement.text().toLowerCase() : '';

                    // Überprüfen der Blacklist
                    if (blacklistWords.some(word => productTitle.includes(word.toLowerCase()))) {
                        console.log(`Produkt "${productTitle}" ist auf der Blacklist. Popup wird geschlossen.`);
                        $('#vvp-product-details-modal--back-btn-announce input[type="submit"]').click();
                    } else {
                        $('#vvp-product-details-modal--request-btn input[type="submit"]').click();
                        setTimeout(() => {
                            $('#vvp-shipping-address-modal--submit-btn input[type="submit"]').click();
                        }, 600);
                    }
                } else {
                    let productTitleElement = $('#vvp-product-details-modal--product-title');
                    let productTitle = productTitleElement ? productTitleElement.text().toLowerCase() : '';

                    let targetWords = ['hitschies','vodka','kitkat','schokolade'];

                    if (targetWords.some(word => productTitle.includes(word))) {
                        $('#vvp-product-details-modal--request-btn input[type="submit"]').click();
                        setTimeout(() => {
                            $('#vvp-shipping-address-modal--submit-btn input[type="submit"]').click();
                        }, 600);
                    } else {
                        $('#vvp-product-details-modal--back-btn-announce input[type="submit"]').click();
                    }
                }

                scheduleReload();
            }
        }
    }, 500);
}

function scheduleReload() {
    let reloadDelay = getRandomReloadDelay();
    document.title = `Nächste Aktualisierung in ${reloadDelay / 1000} Sekunden`;
    setTimeout(() => {
        location.reload();
    }, reloadDelay);
}

function getRandomReloadDelay() {
    return Math.floor(Math.random() * (1500 - 400 + 1)) + 500;
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
