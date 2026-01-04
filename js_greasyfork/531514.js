// ==UserScript==
// @name         Amazon Vine - Autocheck (ohne Benachrichtigung) 
// @description  Vine
// @version      1.5.5
// @match        *://www.amazon.de/vine/vine-items*
// @require      https://code.jquery.com/jquery-3.7.1.min.js
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        unsafeWindow
// @run-at       document-end
// @noframes
// @namespace https://greasyfork.org/users/83290
// @downloadURL https://update.greasyfork.org/scripts/531514/Amazon%20Vine%20-%20Autocheck%20%28ohne%20Benachrichtigung%29.user.js
// @updateURL https://update.greasyfork.org/scripts/531514/Amazon%20Vine%20-%20Autocheck%20%28ohne%20Benachrichtigung%29.meta.js
// ==/UserScript==

/*globals $*/

// Konfiguration
const CONFIG = {
    WAIT_TIMES: {
        POPUP_OPEN: 100,
        TAX_VALUE: 500,
        AFTER_CLICK: 500,
        BUTTON_RETRY: 300 // Wartezeit zwischen Button-Klick-Versuchen
    },
    FILTERS: {
        blacklist: ['loevschall','momi','levis','levi&','pepe jeans','kare design','hansgrohe','paulmann','seac','ideal standard','kludi'],
        whitelist: ['hitschies','vodka','kitkat','schokolade','alkoholfrei','limonade','lachgummi','likör'],
        priceThreshold: 121
    }
};

// Hauptfunktion
window.addEventListener('load', () => {
    console.log('Vine Autocheck gestartet');
    startProductCheck();
});

async function startProductCheck() {
    const itemsGrid = document.getElementById('vvp-items-grid');
    if (!itemsGrid) {
        console.log('Produktgrid nicht gefunden');
        return scheduleReload();
    }

    await checkNewProducts(itemsGrid.querySelectorAll('.vvp-item-tile'));
    scheduleReload();
}

async function checkNewProducts(productTiles) {
    const checkedProducts = getCheckedProducts();
    let newProductsFound = false;

    for (const tile of productTiles) {
        const asin = tile.querySelector('.vvp-details-btn input[type="submit"]')?.getAttribute("data-asin");
        if (!asin || checkedProducts.includes(asin)) continue;

        newProductsFound = true;
        await processProduct(tile, asin);
        checkedProducts.push(asin);
        updateCheckedProducts(checkedProducts);
    }

    console.log(newProductsFound ? 'Neue Produkte verarbeitet' : 'Keine neuen Produkte');
}

async function processProduct(tile, asin) {
    const product = {
        asin: asin,
        title: tile.querySelector('.vvp-item-product-title-container')?.textContent.trim(),
        link: tile.querySelector('a')?.href
    };

    if (!product.title || !product.link) {
        console.warn('Unvollständige Produktdaten', product);
        return;
    }

    console.log(`Verarbeite Produkt: ${product.title}`);

    try {
        await clickWithRetry(tile.querySelector('.vvp-details-btn input[type="submit"]'));
        await new Promise(r => setTimeout(r, CONFIG.WAIT_TIMES.POPUP_OPEN));

        const price = await getProductPrice(product.link, product.title);
        if (price === null) return;

        product.price = price;

        if (shouldRequestProduct(price, product.title)) {
            await requestProduct(product);
        }

        await closePopup();
    } catch (error) {
        console.error('Fehler bei Produktverarbeitung:', error);
    }
}

async function getProductPrice(link, title) {
    await new Promise(r => setTimeout(r, CONFIG.WAIT_TIMES.TAX_VALUE));

    const taxValueElement = $('#vvp-product-details-modal--tax-value-string');
    if (taxValueElement.length === 0) {
        console.warn('Steuerwert-Element nicht gefunden');
        return await getPriceByLink(link);
    }

    taxValueElement[0].scrollIntoView({ behavior: 'auto', block: 'center' });
    await new Promise(r => setTimeout(r, 400));

    const taxValueText = taxValueElement.text().trim();
    let price = parseTaxValue(taxValueText);

    if (price === null || price === 0) {
        console.log('Steuerwert ist 0€ oder konnte nicht gelesen werden, versuche Produktlink');
        price = await getPriceByLink(link);
    }

    if (price !== null) {
        console.log(`Preis für ${title}: ${price} €`);
        return price;
    }

    console.warn('Preis konnte nicht ermittelt werden');
    return null;
}

function parseTaxValue(value) {
    if (!value || value === '€' || value.includes('Loading')) return null;
    const numericValue = parseFloat(value.replace('€', '').replace(',', '.').trim());
    return isNaN(numericValue) ? null : numericValue;
}

async function requestProduct(product) {
    try {
        await clickWithRetry($('#vvp-product-details-modal--request-btn input[type="submit"]')[0]);
        await new Promise(r => setTimeout(r, CONFIG.WAIT_TIMES.AFTER_CLICK));
;debugger
        const shippingButton = $('#vvp-shipping-address-modal--submit-btn input[type="submit"]')[0];
        if (shippingButton) {
            await clickWithRetry(shippingButton);
            await new Promise(r => setTimeout(r, CONFIG.WAIT_TIMES.AFTER_CLICK));
        }

        console.log(`Produkt angefordert: ${product.title}`);
    } catch (error) {
        console.error('Anforderungsfehler:', error);
    }
}

async function closePopup() {
    const backButton = $('#vvp-product-details-modal--back-btn-announce input[type="submit"]')[0];
    if (backButton) {
        await clickWithRetry(backButton);
        await new Promise(r => setTimeout(r, 500));
    }
}

async function clickWithRetry(element, maxRetries = 5) {
    if (!element) {
        throw new Error('Button-Element nicht gefunden');
    }

    for (let i = 0; i < maxRetries; i++) {
        try {
            element.scrollIntoView({ behavior: 'auto', block: 'center' });
            element.click();
            return; // Erfolg
        } catch (error) {
            if (i === maxRetries - 1) {
                throw error; // Letzter Versuch fehlgeschlagen
            }
            await new Promise(r => setTimeout(r, CONFIG.WAIT_TIMES.BUTTON_RETRY));
        }
    }
}

function shouldRequestProduct(price, title) {
    const titleLower = title.toLowerCase();
    const isBlacklisted = CONFIG.FILTERS.blacklist.some(w => titleLower.includes(w));
    const isWhitelisted = CONFIG.FILTERS.whitelist.some(w => titleLower.includes(w));

    return (price > CONFIG.FILTERS.priceThreshold && !isBlacklisted) ||
           (price <= CONFIG.FILTERS.priceThreshold && isWhitelisted);
}

function scheduleReload() {
    const delay = Math.floor(Math.random() * 800) + 500;
    setTimeout(() => location.reload(), delay);
}

function getCheckedProducts() {
    return GM_getValue('checkedProducts', []);
}

function updateCheckedProducts(products) {
    GM_setValue('checkedProducts', products);
}

async function getPriceByLink(link, retries = 2) {
    for (let i = 0; i < retries; i++) {
        try {
            const response = await fetch(link);
            const text = await response.text();

            const matches = [
                ...text.matchAll(/<span class="a-offscreen">([\d,]+)\s*€<\/span>/g),
                ...text.matchAll(/data-a-color="price".*?>\s*([\d,]+)\s*€/g),
                ...text.matchAll(/priceToPay".*?>\s*([\d,]+)\s*€/g)
            ];

            if (matches.length > 0) {
                const priceStr = matches[0][1].replace(',', '.');
                const price = parseFloat(priceStr);
                return isNaN(price) ? null : price;
            }
        } catch (e) {
            console.warn(`Preisabfrage fehlgeschlagen (Versuch ${i+1})`, e);
        }
        await new Promise(r => setTimeout(r, 1000));
    }
    return null;
}