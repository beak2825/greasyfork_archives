// ==UserScript==
// @name         Amazon Vine - Autocheck (Komplett Optimiert & Zuverlässig)
// @description  Amazon Bestellung mit zuverlässigem Scanning + ALLEN Features
// @version      6.1.8
// @match        *://www.amazon.de/vine/vine-items*
// @match        *://www.amazon.de/checkout/*
// @match        *://www.amazon.de/gp/buy/thankyou*
// @match        *://www.amazon.de/gp/cart/view.html*
// @require      https://code.jquery.com/jquery-3.7.1.min.js
// @grant        GM.getValue
// @grant        GM.setValue
// @grant        GM.deleteValue
// @grant        GM_xmlhttpRequest
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @run-at       document-end
// @noframes
// @namespace    https://greasyfork.org/users/83290
// @downloadURL https://update.greasyfork.org/scripts/542214/Amazon%20Vine%20-%20Autocheck%20%28Komplett%20Optimiert%20%20Zuverl%C3%A4ssig%29.user.js
// @updateURL https://update.greasyfork.org/scripts/542214/Amazon%20Vine%20-%20Autocheck%20%28Komplett%20Optimiert%20%20Zuverl%C3%A4ssig%29.meta.js
// ==/UserScript==

// ==================== KONFIGURATION ====================
const DEFAULT_CONFIG = {
    PAGE_LIMIT: 100,
    BATCH_SIZE: 3,
    MAX_CACHE_AGE_MS: 4 * 24 * 60 * 60 * 1000,
    MAX_CACHE_ENTRIES: 6000,
    ACTIVE_HOURS: { start: 23, end: 5 },
    WAIT_TIMES: {
        POPUP_OPEN: 500,
        TAX_VALUE: 1000,
        AFTER_CLICK: 500,
        BUTTON_RETRY: 600,
        PAGE_DELAY_MIN: 800,
        PAGE_DELAY_MAX: 1400,
        PRODUCT_DELAY_MIN: 700,
        PRODUCT_DELAY_MAX: 800,
        BETWEEN_SCANS_MIN: 1500,
        BETWEEN_SCANS_MAX: 3000,
        PRICE_REQUEST_DELAY: 800
    },
    FILTERS: {
        blacklist: [
            'loevschall','momi','levis','levi&','pepe jeans','kare design',
            'hansgrohe','paulmann','seac','ideal standard','kludi',
            'dirndl','matratze','carplay','toner','luftbefeuchter','luftentfeuchter','aktenvernichter'
        ],
        whitelist: ['hitschies','kitkat','lachgummi','bitburger','vantrue'],
        asin_list: ['B0FJQTT1ZQ','B0FJLVVF6S','B0FG2QV922','B0FHQ4XGRY','B0F9NTWXCJ','B0F9NTW65C','B0FJ1GZ7X4','B0FDVYWCHS'],
        priceThreshold: 249
    }
};

let CONFIG = { ...DEFAULT_CONFIG };
let menuIds = [];
let processingLock = false;

// ==================== UTILITY-FUNKTIONEN ====================
function getTodayStr() {
    const d = new Date();
    return d.getFullYear() + '-' + (d.getMonth() + 1).toString().padStart(2, '0') + '-' + d.getDate().toString().padStart(2, '0');
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function rand(min, max) {
    if (typeof min !== 'number' || typeof max !== 'number' || isNaN(min) || isNaN(max)) {
        console.error('❌ Ungültige rand() Parameter:', min, max);
        return 2000;
    }
    if (min > max) [min, max] = [max, min];
    const result = Math.floor(Math.random() * (max - min + 1)) + min;
    if (isNaN(result) || result <= 0) return 2000;
    return result;
}

function normalize(text) {
    return text
        .normalize('NFKD').replace(/[\u0300-\u036f]/g, "")
        .replace(/[.,;:!?"'()\[\]{}<>\/\\]/g, ' ')
        .toLowerCase();
}

// ==================== ASIN-LISTEN MANAGEMENT ====================
async function removeASINFromList(asin) {
    console.log(`🗑️ Entferne ASIN ${asin} aus der Liste...`);
    
    const index = CONFIG.FILTERS.asin_list.indexOf(asin);
    if (index > -1) {
        CONFIG.FILTERS.asin_list.splice(index, 1);
        await saveConfigAndUpload();
        console.log(`✅ ASIN ${asin} erfolgreich aus Liste entfernt!`);
        console.log(`📋 Verbleibende ASINs: ${CONFIG.FILTERS.asin_list.length}`);
        return true;
    }
    
    return false;
}

// ==================== CACHE-MANAGEMENT (ROBUST WIE CODE 1) ====================
async function getCheckedProductsMap() {
    const raw = await GM.getValue('checkedProducts', '{}');
    try {
        const now = Date.now();
        const valid = {};
        const parsed = JSON.parse(raw);
        for (const [asin, ts] of Object.entries(parsed)) {
            if (now - ts < CONFIG.MAX_CACHE_AGE_MS) {
                valid[asin] = ts;
            }
        }
        return valid;
    } catch {
        return {};
    }
}

async function updateCheckedProducts(map) {
    const now = Date.now();
    const maxAge = CONFIG.MAX_CACHE_AGE_MS;
    const maxEntries = CONFIG.MAX_CACHE_ENTRIES;

    // Alte Einträge entfernen
    for (const [asin, ts] of Object.entries(map)) {
        if (now - ts > maxAge) delete map[asin];
    }

    // Begrenzung auf maximale Einträge
    const keys = Object.keys(map);
    if (keys.length > maxEntries) {
        keys.sort((a, b) => map[a] - map[b]);
        for (let i = 0; i < keys.length - maxEntries; i++) {
            delete map[keys[i]];
        }
    }

    await GM.setValue('checkedProducts', JSON.stringify(map));
}

// ==================== HTTP & PREIS-FUNKTIONEN ====================
async function fetchPage(pageNum) {
    const url = `https://www.amazon.de/vine/vine-items?queue=all_items&page=${pageNum}`;
    return fetch(url, { credentials: 'include' })
        .then(res => res.ok ? res.text() : null)
        .catch(err => (console.error(`❌ Fehler beim Laden Seite ${pageNum}:`, err), null));
}

function parsePrice(text) {
    if (!text) return null;
    text = text.replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').trim();
    
    const patterns = [
        /(\d{1,3}(?:\.\d{3})*),(\d{2})\s*€/,
        /(\d+),(\d{2})\s*€/,
        /(\d+)\s*€/
    ];
    
    for (const pattern of patterns) {
        const match = text.match(pattern);
        if (match) {
            if (match[2]) {
                let wholePart = match[1].replace(/\./g, '');
                return parseFloat(`${wholePart}.${match[2]}`);
            } else {
                let wholePart = match[1].replace(/\./g, '');
                return parseFloat(wholePart);
            }
        }
    }
    return null;
}

async function fetchProductPriceSafe(productLink, title) {
    return new Promise((resolve) => {
        const safetyTimeout = setTimeout(() => {
            console.warn(`⏱️ Timeout beim Preisabruf für: ${title ? title.substring(0, 30) : productLink}`);
            resolve(null);
        }, 12000);
        
        GM_xmlhttpRequest({
            method: 'GET',
            url: productLink,
            onload: (res) => {
                clearTimeout(safetyTimeout);
                
                console.log(`🔍 Status: ${res.status} für ${title.substring(0, 30)}...`);
                
                if (res.status === 200) {
                    try {
                        console.log(`📄 HTML empfangen: ${res.responseText.length} Zeichen`);
                        
                        const parser = new DOMParser();
                        const doc = parser.parseFromString(res.responseText, 'text/html');
                        
                        const mainPriceSelectors = [
                            '#corePrice_feature_div .a-price:not(.a-text-price) .a-offscreen',
                            '.a-price[data-a-size="xl"] .a-offscreen',
                            '.a-price[data-a-size="large"] .a-offscreen'
                        ];

                        for (const selector of mainPriceSelectors) {
                            const element = doc.querySelector(selector);
                            if (element) {
                                const priceText = element.textContent.trim();
                                if (!/pro\s*(kg|l|liter|ml|m2|qm|stück|stk|piece|gram|g)\b/i.test(priceText)) {
                                    const price = parsePrice(priceText);
                                    if (price !== null && price > 0) {
                                        resolve(price);
                                        return;
                                    }
                                }
                            }
                        }

                        const priceContainers = doc.querySelectorAll('span.a-price');
                        const validPrices = [];

                        for (const container of priceContainers) {
                            const offscreenSpan = container.querySelector('span.a-offscreen');
                            if (!offscreenSpan) continue;

                            const priceText = offscreenSpan.textContent.trim();
                            if (/pro\s*(kg|l|liter|ml|m2|qm|stück|stk|piece|gram|g)\b/i.test(priceText)) continue;
                            if (/\/\s*(kg|l|liter|ml|m2|qm|stück|stk|piece|gram|g)\b/i.test(priceText)) continue;

                            const parent = container.closest('.aok-relative, .a-size-mini');
                            if (parent && /(pro|per|\/).*?(kg|l|liter|ml|m2|qm|stück|stk|piece|gram|g)\b/i.test(parent.textContent)) continue;

                            const price = parsePrice(priceText);
                            if (price !== null && price > 0) {
                                validPrices.push(price);
                            }
                        }

                        if (validPrices.length > 0) {
                            validPrices.sort((a, b) => a - b);
                            resolve(validPrices[0]);
                            return;
                        }

                        const allOffscreens = doc.querySelectorAll('span.a-offscreen');
                        for (const off of allOffscreens) {
                            const txt = off.textContent.trim();
                            if (/€/.test(txt) && !/pro\s*(kg|l|liter|ml|m2|qm|stück|stk|piece|gram|g)\b/i.test(txt)) {
                                const price = parsePrice(txt);
                                if (price !== null && price > 0) {
                                    resolve(price);
                                    return;
                                }
                            }
                        }

                        resolve(null);
                    } catch (e) {
                        clearTimeout(safetyTimeout);
                        console.error('❌ Fehler beim Preisparsen:', e);
                        resolve(null);
                    }
                } else {
                    clearTimeout(safetyTimeout);
                    console.warn(`⚠️ HTTP Status ${res.status} für: ${productLink}`);
                    resolve(null);
                }
            },
            onerror: () => {
                clearTimeout(safetyTimeout);
                resolve(null);
            }
        });
    });
}

// ==================== FILTER-LOGIK ====================
function isSpecialASIN(asin) {
    if (!CONFIG.FILTERS.asin_list || !Array.isArray(CONFIG.FILTERS.asin_list)) {
        console.warn('⚠️ asin_list ist nicht definiert oder kein Array!');
        return false;
    }
    
    // Trimme beide Werte für sicheren Vergleich
    const trimmedAsin = String(asin).trim();
    const found = CONFIG.FILTERS.asin_list.some(listAsin => String(listAsin).trim() === trimmedAsin);
    
    if (found) {
        console.log(`🎯 Spezial-ASIN Match: "${trimmedAsin}"`);
    }
    
    return found;
}

function shouldRequestProduct(price, title, asin) {
    if (price === null) {
        console.log(`🔧 shouldRequestProduct: price ist null für "${title.substring(0, 30)}"`);
        return false;
    }
    
    console.log(`🔧 shouldRequestProduct: "${title.substring(0, 40)}" → Preis: ${price}€, ASIN: ${asin}`);
    
    // ASIN-Liste hat höchste Priorität
    if (isSpecialASIN(asin)) {
        console.log(`🎯 ASIN-Match gefunden in shouldRequestProduct: ${asin}`);
        return true;
    }
    
    const normTitle = normalize(title);
    
    const isBlacklisted = CONFIG.FILTERS.blacklist.some(w => {
        if (!w.trim()) return false;
        const pattern = new RegExp(`\\b${normalize(w)}\\b`, 'i');
        const matches = pattern.test(normTitle);
        if (matches) {
            console.log(`🔧 Blacklist Match: "${w}" in "${title.substring(0, 30)}"`);
        }
        return matches;
    });
    
    const isWhitelisted = CONFIG.FILTERS.whitelist.some(w => {
        if (!w.trim()) return false;
        const pattern = new RegExp(`\\b${normalize(w)}\\b`, 'i');
        const matches = pattern.test(normTitle);
        if (matches) {
            console.log(`🔧 Whitelist Match: "${w}" in "${title.substring(0, 30)}"`);
        }
        return matches;
    });
    
    const overThreshold = price > CONFIG.FILTERS.priceThreshold;
    const shouldMatch = (overThreshold || isWhitelisted) && !isBlacklisted;
    
    console.log(`🔧 Filter: Preis ${price}€ > ${CONFIG.FILTERS.priceThreshold}€: ${overThreshold}, Whitelist: ${isWhitelisted}, Blacklist: ${isBlacklisted} → ${shouldMatch}`);
    
    return shouldMatch;
}

// ==================== HAUPT-SCAN-LOGIK ====================
async function runProductCheck() {
    if (processingLock) {
        console.log('⚠️ Scan bereits aktiv, überspringe...');
        return;
    }
    
    processingLock = true;
    
    try {
        const checkedMap = await getCheckedProductsMap();
        const todayStr = getTodayStr();
        let lastScanDay = await GM.getValue('last_scan_day', null);
        let isFirstDay = (lastScanDay === null) || (lastScanDay !== todayStr);

        console.log(`📅 Scan-Info: Heute=${todayStr}, Letzter Scan=${lastScanDay}, Erster Tag=${isFirstDay}`);
        console.log(`📊 Cache enthält ${Object.keys(checkedMap).length} Einträge`);
        console.log(`📄 Page Limit: ${CONFIG.PAGE_LIMIT}`);
        console.log(`📋 ASIN-Liste: ${CONFIG.FILTERS.asin_list.length} Einträge`);

        const todayMidnight = new Date();
        todayMidnight.setHours(0, 0, 0, 0);
        const midnightMs = todayMidnight.getTime();

        let foundOldProduct = false;

        for (let page = 1; page <= CONFIG.PAGE_LIMIT; page++) {
            console.log(`🔍 === SEITE ${page}/${CONFIG.PAGE_LIMIT} ===`);
            
            if (!isFirstDay && foundOldProduct) {
                console.log(`🛑 ABBRUCH: Scan beendet bei Seite ${page-1} (foundOldProduct=true, isFirstDay=false)`);
                break;
            }

            console.log(`📄 Prüfe Seite ${page}...`);
            const html = await fetchPage(page);
            if (!html) {
                console.warn(`⚠️ Seite ${page} konnte nicht geladen werden`);
                continue;
            }

            const doc = new DOMParser().parseFromString(html, 'text/html');
            const productTiles = Array.from(doc.querySelectorAll('.vvp-item-tile'));
            
            if (productTiles.length === 0) {
                console.log(`🏁 Seite ${page} hat keine Produkte mehr - Ende erreicht`);
                break;
            }
            
            console.log(`📦 Gefunden: ${productTiles.length} Produkte auf Seite ${page}`);

            let newProductTiles = [];
            for (const tile of productTiles) {
                const asin = tile.querySelector('.vvp-details-btn input[type="submit"]')?.getAttribute("data-asin");
                if (!asin) continue;

                // ✅ FIX: Spezial-ASIN Check ZUERST - VOR Cache und Alter-Check!
                if (isSpecialASIN(asin)) {
                    console.log(`⭐️ Spezial-ASIN gefunden: ${asin} - DIREKTE BESTELLUNG (ignoriert Cache!)`);
                    
                    const targetUrl = `https://www.amazon.de/vine/vine-items?queue=all_items&page=${page}&target_asin=${asin}`;
                    console.log(`🛒 Springe zu Seite ${page} für Spezial-ASIN`);
                    
                    setTimeout(() => {
                        window.location.href = targetUrl;
                    }, rand(500, 1000));
                    
                    processingLock = false;
                    return;
                }

                const firstSeen = checkedMap[asin];
                
                // Prüfe auf alte Produkte (vor Mitternacht)
                if (!isFirstDay && firstSeen !== undefined && firstSeen < midnightMs) {
                    if (!foundOldProduct) {
                        foundOldProduct = true;
                        console.log(`⚠️ Alt-Produkt gefunden (ASIN: ${asin}, ts: ${firstSeen}), Scan wird beendet`);
                    }
                    continue;
                }
                
                // Bereits heute verarbeitet
                if (checkedMap[asin]) continue;

                const title = tile.querySelector('.vvp-item-product-title-container')?.textContent.trim();
                const link = tile.querySelector('a')?.href;
                
                if (!title || !link) continue;
                
                newProductTiles.push({ asin, title, link });
            }

            await updateCheckedProducts(checkedMap);

            // Batch-Verarbeitung
            for (let i = 0; i < newProductTiles.length; i += CONFIG.BATCH_SIZE) {
                const batch = newProductTiles.slice(i, i + CONFIG.BATCH_SIZE);
                
                for (const product of batch) {
                    try {
                        console.log(`📦 Verarbeite: ${product.title.substring(0, 50)}...`);
                        
                        const delay = Math.max(300, rand(CONFIG.WAIT_TIMES.PRODUCT_DELAY_MIN, CONFIG.WAIT_TIMES.PRODUCT_DELAY_MAX));
                        console.log(`⏳ Warte ${delay}ms vor Preisabruf`);
                        await sleep(delay);
                        
                        console.log(`💶 Rufe Preis ab für: ${product.title.substring(0, 30)}...`);
                        const price = await fetchProductPriceSafe(product.link, product.title);
                        console.log(`💶 Preis erhalten: ${price !== null ? price + '€' : 'NULL'}`);
                        
                        // Sofort cachen
                        checkedMap[product.asin] = Date.now();
                        
                        if (price !== null && shouldRequestProduct(price, product.title, product.asin)) {
                            console.log(`🎯 Match gefunden: ${product.title.substring(0, 50)}... (${price}€)`);
                            
                            await updateCheckedProducts(checkedMap);
                            
                            const targetUrl = `https://www.amazon.de/vine/vine-items?queue=all_items&page=${page}&target_asin=${product.asin}`;
                            console.log(`🛒 Springe zu Bestellung: ${targetUrl}`);
                            
                            setTimeout(() => {
                                try {
                                    window.location.assign(targetUrl);
                                } catch (e) {
                                    window.location.href = targetUrl;
                                }
                            }, rand(800, 1500));
                            
                            processingLock = false;
                            return;
                        } else if (price !== null) {
                            console.log(`⛔ Nicht relevant: ${product.title.substring(0, 30)}... (${price}€)`);
                        } else {
                            console.log(`⚠️ Kein Preis: ${product.title.substring(0, 30)}...`);
                        }
                    } catch (error) {
                        console.error(`❌ Fehler bei Produkt ${product.asin}:`, error);
                        checkedMap[product.asin] = Date.now();
                    }
                }

                await updateCheckedProducts(checkedMap);
                
                if (i + CONFIG.BATCH_SIZE < newProductTiles.length) {
                    const batchDelay = rand(CONFIG.WAIT_TIMES.PRODUCT_DELAY_MIN, CONFIG.WAIT_TIMES.PRODUCT_DELAY_MAX);
                    console.log(`⏳ Pause zwischen Batches: ${batchDelay}ms`);
                    await sleep(batchDelay);
                }
            }

            const pageDelay = rand(CONFIG.WAIT_TIMES.PAGE_DELAY_MIN, CONFIG.WAIT_TIMES.PAGE_DELAY_MAX);
            console.log(`⏳ Warte ${pageDelay} ms vor nächster Seite...`);
            await sleep(pageDelay);
        }

        if (isFirstDay) {
            await GM.setValue('last_scan_day', todayStr);
            console.log(`📅 last_scan_day gesetzt auf: ${todayStr}`);
        }
        
        console.log('✅ Durchlauf abgeschlossen');
        
    } catch (error) {
        console.error('❌ Fehler beim Produktcheck:', error);
    } finally {
        processingLock = false;
    }
}

// ==================== TARGET-ASIN VERARBEITUNG ====================
async function handleTargetASIN() {
    const url = new URL(location.href);
    const targetASIN = url.searchParams.get('target_asin');
    
    if (!targetASIN) return false;
    
    console.log(`🎯 Target-ASIN erkannt: ${targetASIN}`);
    
    url.searchParams.delete('target_asin');
    history.replaceState({}, '', url.toString());
    
    await sleep(1500);
    
    const itemsGrid = document.getElementById('vvp-items-grid');
    if (!itemsGrid) {
        console.warn('⚠️ Produktgrid nicht gefunden');
        return false;
    }
    
    const productTiles = itemsGrid.querySelectorAll('.vvp-item-tile');
    console.log(`🔍 Suche Target-ASIN ${targetASIN} in ${productTiles.length} Produkten`);
    
    for (const tile of productTiles) {
        const asin = tile.querySelector('.vvp-details-btn input[type="submit"]')?.getAttribute('data-asin');
        
        if (asin === targetASIN) {
            console.log(`🎯 Target-Produkt gefunden: ${asin}`);
            
            tile.scrollIntoView({ behavior: 'smooth', block: 'center' });
            await sleep(500);
            
            const isSpecial = isSpecialASIN(asin);
            console.log(`🔧 Verarbeite Target-ASIN als ${isSpecial ? 'Spezial-ASIN' : 'normales Produkt'}`);
            
            const success = await processProduct(tile, asin, isSpecial);
            
            // ✅ NEUE FUNKTION: Entferne ASIN aus Liste nach erfolgreicher Bestellung
            if (success && isSpecial) {
                await removeASINFromList(asin);
            }
            
            // Cache-Update
            const checkedMap = await getCheckedProductsMap();
            checkedMap[asin] = Date.now();
            await updateCheckedProducts(checkedMap);
            
            if (success) {
                console.log('✅ Target-Produkt erfolgreich bestellt');
            } else {
                console.log('❌ Target-Produkt konnte nicht bestellt werden');
            }
            
            console.log('🔄 Setze Scanning fort in 5 Sekunden...');
            setTimeout(() => {
                window.location.href = 'https://www.amazon.de/vine/vine-items?queue=all_items&page=1';
            }, 5000);
            
            return true;
        }
    }
    
    console.warn(`⚠️ Target-ASIN ${targetASIN} nicht gefunden`);
    
    const checkedMap = await getCheckedProductsMap();
    checkedMap[targetASIN] = Date.now();
    await updateCheckedProducts(checkedMap);
    
    return false;
}

// ==================== PRODUKTBESTELLUNG ====================
async function processProduct(tile, asin, forceRequest=false) {
    const product = {
        asin,
        title: tile.querySelector('.vvp-item-product-title-container')?.textContent.trim(),
        link: tile.querySelector('a')?.href
    };
    
    if (!product.title || !product.link) {
        console.warn('⚠️ Unvollständige Produktdaten');
        return false;
    }
    
    console.log(`🔍 Beginne Bestellung: ${product.title}`);

    try {
        const openBtn = tile.querySelector('.vvp-details-btn input[type="submit"]');
        const opened = await tryOpenModal(openBtn);
        
        if (!opened) {
            console.warn('❌ Modal konnte nicht geöffnet werden');
            return false;
        }

        const valueField = $('#vvp-product-details-modal--tax-value-string');
        if (valueField.length) valueField[0].scrollIntoView({behavior:'smooth', block:'center'});
        await sleep(CONFIG.WAIT_TIMES.TAX_VALUE);

        if (forceRequest) {
            console.log(`⭐️ Spezial-ASIN: Fordere Produkt direkt an`);
            const success = await requestProduct(product);
            await closePopup();
            
            // ✅ NEUE FUNKTION: Entferne ASIN aus Liste nach erfolgreicher Bestellung
            if (success) {
                await removeASINFromList(product.asin);
            }
            
            return success;
        }

        const price = await getProductPrice(product.link, product.title);
        if (price === null) {
            console.warn('⚠️ Preis nicht lesbar');
            await closePopup();
            return false;
        }
        
        product.price = price;

        if (shouldRequestProduct(price, product.title, product.asin)) {
            console.log(`✅ Anforderungen erfüllt (${price}€), fordere Produkt an`);
            const success = await requestProduct(product);
            await closePopup();
            
            // ✅ NEUE FUNKTION: Entferne ASIN aus Liste wenn es eine war
            if (success && isSpecialASIN(product.asin)) {
                await removeASINFromList(product.asin);
            }
            
            return success;
        } else {
            console.log(`⛔ Produkt nicht geeignet (${price}€)`);
            await closePopup();
            return false;
        }
        
    } catch (e) {
        console.error('❌ Fehler bei Produktbestellung:', e);
        await closePopup();
        return false;
    }
}

async function getProductPrice(link, title) {
    const taxValue = $('#vvp-product-details-modal--tax-value-string').text().trim();
    let price = parseFloat(taxValue.replace('€','').replace(',','.'));
    if (!taxValue || isNaN(price) || price === 0) {
        return await fetchProductPriceSafe(link, title);
    }
    console.log(`💶 Preis im Modal: ${price}€`);
    return price;
}

async function requestProduct(product) {
    try {
        await clickWithRetry($('#vvp-product-details-modal--request-btn input[type="submit"]')[0]);
        await sleep(CONFIG.WAIT_TIMES.AFTER_CLICK);
        
        const errorMsg = document.getElementById('vvp-generic-request-error-msg');
        if (errorMsg && errorMsg.offsetParent !== null) {
            console.log(`❌ Bestellfehler: Artikel kann nicht angefordert werden`);
            return false;
        }
        
        const shippingBtn = $('#vvp-shipping-address-modal--submit-btn input[type="submit"]')[0];
        if (shippingBtn) {
            console.log(`📦 Versandadresse-Dialog gefunden`);
            await clickWithRetry(shippingBtn);
            await sleep(CONFIG.WAIT_TIMES.AFTER_CLICK);
            
            const errorMsgAfterShipping = document.getElementById('vvp-generic-request-error-msg');
            if (errorMsgAfterShipping && errorMsgAfterShipping.offsetParent !== null) {
                console.log(`❌ Bestellfehler nach Versandadresse`);
                return false;
            }
        }
        
        console.log(`✅ Produkt erfolgreich angefordert: ${product.title}`);
        return true;
        
    } catch(e) {
        console.error(`❌ Fehler beim Anfordern:`, e);
        return false;
    }
}

async function tryOpenModal(element, maxRetries=8) {
    if(!element) return false;
    
    await sleep(800);
    
    for(let i=0; i < maxRetries; i++) {
        try {
            console.log(`🔄 Klick-Versuch ${i+1}/${maxRetries} auf Modal-Button`);
            
            element.scrollIntoView({behavior:'smooth', block:'center'});
            await sleep(300);
            
            element.focus();
            await sleep(200);
            
            element.click();
            
            const opened = await waitForModalToOpen(2500);
            if(opened) {
                console.log(`✅ Modal erfolgreich geöffnet nach ${i+1} Versuchen`);
                return true;
            }
            
            console.log(`⚠️ Modal nicht geöffnet, Versuch ${i+1} fehlgeschlagen`);
            
        } catch(e) {
            console.error(`❌ Fehler bei Klick-Versuch ${i+1}:`, e);
        }
        
        await sleep(CONFIG.WAIT_TIMES.BUTTON_RETRY * (i + 1));
    }
    
    console.error(`❌ Modal konnte nach ${maxRetries} Versuchen nicht geöffnet werden`);
    return false;
}

async function waitForModalToOpen(timeout=3000) {
    const start = Date.now();
    while(Date.now() - start < timeout) {
        const modal = document.querySelector('#vvp-product-details-modal');
        if(modal && modal.offsetParent !== null) return true;
        await sleep(100);
    }
    return false;
}

async function closePopup() {
    const modal = document.querySelector('#vvp-product-details-modal');
    if(!modal || modal.offsetParent === null) return;
    const backButton = $('#vvp-product-details-modal--back-btn-announce input[type="submit"]')[0];
    if(backButton) {
        try {
            await clickWithRetry(backButton);
            await sleep(500);
            console.log('✅ Popup geschlossen');
        } catch(e) {
            console.warn('⚠️ Fehler beim Schließen des Popups:', e);
        }
    }
}

async function clickWithRetry(element, maxRetries=5) {
    if(!element) throw new Error('❌ Element nicht gefunden');
    for(let i=0; i < maxRetries; i++){
        try {
            element.scrollIntoView({behavior:'smooth', block:'center'});
            element.click();
            return;
        } catch(e) {
            if(i === maxRetries - 1) throw e;
            await sleep(CONFIG.WAIT_TIMES.BUTTON_RETRY);
        }
    }
}

// ==================== CHECKOUT-AUTOMATISIERUNG ====================
function startCheckoutAutomation() {
    if(window.checkoutObserverStarted) return;
    window.checkoutObserverStarted = true;
    console.log('📦 Checkout erkannt – überwache "Jetzt kaufen"');

    const tryClick = () => {
        const btn = document.getElementById('placeOrder');
        if(btn && !btn.disabled) {
            console.log('🛒 Klicke auf Jetzt kaufen');
            btn.scrollIntoView({behavior: 'smooth', block: 'center'});
            btn.click();
            return true;
        }
        return false;
    };

    const intervalId = setInterval(() => {
        if(tryClick()) clearInterval(intervalId);
    }, 1000);

    const observer = new MutationObserver(() => {
        if(tryClick()) {
            observer.disconnect();
            clearInterval(intervalId);
        }
    });
    observer.observe(document.body, { childList: true, subtree: true });
}

// ==================== KONFIGURATION & SPEICHERUNG ====================
async function loadConfig() {
    try {
        const savedConfig = await GM.getValue('vine_config', null);
        if (savedConfig) {
            const parsedConfig = JSON.parse(savedConfig);
            CONFIG = {
                ...DEFAULT_CONFIG,
                ...parsedConfig,
                WAIT_TIMES: {
                    ...DEFAULT_CONFIG.WAIT_TIMES,
                },
                FILTERS: {
                    ...DEFAULT_CONFIG.FILTERS,
                    ...(parsedConfig.FILTERS || {})
                },
                ACTIVE_HOURS: {
                    ...DEFAULT_CONFIG.ACTIVE_HOURS,
                    ...(parsedConfig.ACTIVE_HOURS || {})
                }
            };
            console.log('✅ Lokale Konfiguration geladen (WAIT_TIMES aus Code)');
        } else {
            console.log('ℹ️ Keine gespeicherte Konfiguration - verwende Standardwerte');
        }
        
        if (!CONFIG.WAIT_TIMES || !CONFIG.WAIT_TIMES.BETWEEN_SCANS_MIN) {
            console.warn('⚠️ WAIT_TIMES fehlen - verwende Fallback');
            CONFIG.WAIT_TIMES = { ...DEFAULT_CONFIG.WAIT_TIMES };
        }
        
    } catch (e) {
        console.warn('⚠️ Fehler beim Laden der Konfiguration:', e);
        CONFIG = { ...DEFAULT_CONFIG };
    }
}

async function saveConfigLocal() {
    try {
        const configString = JSON.stringify(CONFIG);
        await GM.setValue('vine_config', configString);
        console.log('✅ Konfiguration lokal gespeichert');
    } catch (e) {
        console.error('❌ Fehler beim lokalen Speichern:', e);
    }
}

async function saveConfigAndUpload() {
    await saveConfigLocal();
    
    const autoUpload = await GM.getValue('auto_upload', true);
    if (autoUpload) {
        uploadConfigToCloud().catch(err => {
            console.warn('⚠️ Auto-Upload fehlgeschlagen (wird beim nächsten Mal erneut versucht)');
        });
    }
}

// ==================== GITHUB CLOUD-SYNC ====================
async function uploadConfigToCloud() {
    try {
        const apiToken = await GM.getValue('github_token', '');
        if (!apiToken) {
            return false;
        }

        const configString = JSON.stringify(CONFIG, null, 2);
        const existingGistId = await GM.getValue('cloud_gist_id', '');

        const gistData = {
            description: "Amazon Vine Config - " + new Date().toLocaleString(),
            public: false,
            files: {
                "vine-config.json": {
                    content: configString
                }
            }
        };

        let url, method;
        if (existingGistId) {
            url = `https://api.github.com/gists/${existingGistId}`;
            method = 'PATCH';
        } else {
            url = 'https://api.github.com/gists';
            method = 'POST';
        }

        const response = await new Promise((resolve, reject) => {
            const timeout = setTimeout(() => reject(new Error('Upload timeout')), 8000);
            
            GM_xmlhttpRequest({
                method: method,
                url: url,
                headers: {
                    'Authorization': `token ${apiToken}`,
                    'Content-Type': 'application/json',
                    'User-Agent': 'Amazon-Vine-Script'
                },
                data: JSON.stringify(gistData),
                onload: (res) => {
                    clearTimeout(timeout);
                    resolve(res);
                },
                onerror: (err) => {
                    clearTimeout(timeout);
                    reject(err);
                },
                ontimeout: () => {
                    clearTimeout(timeout);
                    reject(new Error('Request timeout'));
                },
                timeout: 8000
            });
        });

        if (response.status === 200 || response.status === 201) {
            const gistInfo = JSON.parse(response.responseText);
            const gistId = gistInfo.id;
            
            await GM.setValue('cloud_gist_id', gistId);
            await GM.setValue('last_cloud_upload', Date.now());
            
            console.log(`✅ Gist gespeichert: ${gistId}`);
            return gistId;
        }
        return false;
    } catch (e) {
        return false;
    }
}

async function downloadConfigFromCloud() {
    try {
        const gistId = await GM.getValue('cloud_gist_id', '');
        if (!gistId) {
            return false;
        }

        const response = await new Promise((resolve, reject) => {
            const timeout = setTimeout(() => reject(new Error('Timeout')), 5000);
            
            GM_xmlhttpRequest({
                method: 'GET',
                url: `https://api.github.com/gists/${gistId}`,
                headers: { 'User-Agent': 'Amazon-Vine-Script' },
                onload: (res) => {
                    clearTimeout(timeout);
                    resolve(res);
                },
                onerror: (err) => {
                    clearTimeout(timeout);
                    reject(err);
                },
                ontimeout: () => {
                    clearTimeout(timeout);
                    reject(new Error('Request timeout'));
                },
                timeout: 5000
            });
        });

        if (response.status === 200) {
            const gistInfo = JSON.parse(response.responseText);
            
            if (!gistInfo.files || !gistInfo.files['vine-config.json']) {
                return false;
            }
            
            const configContent = gistInfo.files['vine-config.json'].content;
            const cloudConfig = JSON.parse(configContent);
            
            if (JSON.stringify(CONFIG) !== JSON.stringify(cloudConfig)) {
                CONFIG = {
                    ...DEFAULT_CONFIG,
                    ...cloudConfig,
                    WAIT_TIMES: { ...DEFAULT_CONFIG.WAIT_TIMES }
                };
                await saveConfigLocal();
                await GM.setValue('last_cloud_download', Date.now());
                console.log('✅ Config von Cloud aktualisiert (WAIT_TIMES aus Code)');
                return true;
            }
        }
        return false;
    } catch (e) {
        return false;
    }
}

async function startAutoSync() {
    console.log('🔄 Auto-Sync wird im Hintergrund gestartet...');
    
    setTimeout(async () => {
        try {
            const success = await downloadConfigFromCloud();
            if (success) {
                console.log('✅ Konfiguration von Cloud geladen (Hintergrund)');
            }
        } catch (e) {
            // Stillschweigend ignorieren
        }
    }, 2000);
    
    setInterval(async () => {
        try {
            await downloadConfigFromCloud();
        } catch (e) {
            // Fehler stillschweigend ignorieren
        }
    }, 5 * 60 * 1000);
}

// ==================== MENÜ-SYSTEM ====================
function createMenu() {
    menuIds.forEach(id => GM_unregisterMenuCommand(id));
    menuIds = [];

    menuIds.push(GM_registerMenuCommand('📊 Batch-Größe ändern', editBatchSize));
    menuIds.push(GM_registerMenuCommand('🔍 Cache-Status anzeigen', debugCacheStatus));
    menuIds.push(GM_registerMenuCommand('─────────────', () => {}));
    
    menuIds.push(GM_registerMenuCommand('⚙️ Blacklist bearbeiten', editBlacklist));
    menuIds.push(GM_registerMenuCommand('✅ Whitelist bearbeiten', editWhitelist));
    menuIds.push(GM_registerMenuCommand('🎯 ASIN-Liste bearbeiten', editASINList));
    menuIds.push(GM_registerMenuCommand('💰 Preisschwelle ändern', editPriceThreshold));
    menuIds.push(GM_registerMenuCommand('🕐 Aktive Zeiten ändern', editActiveHours));
    menuIds.push(GM_registerMenuCommand('📋 Aktuelle Einstellungen anzeigen', showCurrentSettings));
    
    menuIds.push(GM_registerMenuCommand('─────────────', () => {}));
    menuIds.push(GM_registerMenuCommand('🔑 GitHub Token setzen', setGitHubToken));
    menuIds.push(GM_registerMenuCommand('☁️ Manuell in Cloud speichern', manualUpload));
    menuIds.push(GM_registerMenuCommand('📥 Manuell von Cloud laden', manualDownload));
    menuIds.push(GM_registerMenuCommand('🔄 Auto-Upload ein/aus', toggleAutoUpload));
    menuIds.push(GM_registerMenuCommand('📊 Cloud-Status anzeigen', showCloudStatus));
    menuIds.push(GM_registerMenuCommand('🔗 Gist-ID manuell setzen', setGistId));
    menuIds.push(GM_registerMenuCommand('🌐 Gist im Browser öffnen', openGistInBrowser));
    
    menuIds.push(GM_registerMenuCommand('─────────────', () => {}));
    menuIds.push(GM_registerMenuCommand('🔄 Auf Standardwerte zurücksetzen', resetToDefaults));
    menuIds.push(GM_registerMenuCommand('💾 Konfiguration exportieren', exportConfig));
    menuIds.push(GM_registerMenuCommand('📥 Konfiguration importieren', importConfig));
}

function editBatchSize() {
    const current = CONFIG.BATCH_SIZE;
    const info = `
📊 BATCH-VERARBEITUNG (Produkte):

Aktuelle Batch-Größe: ${current} Produkte pro Batch

Das Script verarbeitet Seite für Seite und prüft dabei
${current} Produkte gleichzeitig per Batch.

Empfohlen: 3-6 Produkte (höhere Werte können instabil sein)
`;
    alert(info);
    
    const newValue = prompt('Batch-Größe eingeben (3-8 empfohlen):', current);
    if (newValue !== null && !isNaN(newValue)) {
        const batchSize = parseInt(newValue);
        if (batchSize >= 1 && batchSize <= 10) {
            CONFIG.BATCH_SIZE = batchSize;
            saveConfigAndUpload();
            alert(`✅ Batch-Größe auf ${batchSize} gesetzt!`);
        } else {
            alert('❌ Batch-Größe muss zwischen 1 und 10 liegen!');
        }
    }
}

async function debugCacheStatus() {
    const checkedMap = await getCheckedProductsMap();
    const todayStr = getTodayStr();
    const lastScanDay = await GM.getValue('last_scan_day', null);
    
    const todayMidnight = new Date();
    todayMidnight.setHours(0, 0, 0, 0);
    const midnightMs = todayMidnight.getTime();
    
    let oldCount = 0, newCount = 0;
    
    for (const [asin, ts] of Object.entries(checkedMap)) {
        if (ts < midnightMs) {
            oldCount++;
        } else {
            newCount++;
        }
    }
    
    const status = `🔍 CACHE-STATUS:\nHeute: ${todayStr}\nLetzter Scan: ${lastScanDay || 'Nie'}\nCache gesamt: ${Object.keys(checkedMap).length}\nVor Mitternacht: ${oldCount}\nNach Mitternacht: ${newCount}`;
    alert(status);
}

function editBlacklist() {
    const current = CONFIG.FILTERS.blacklist.join(', ');
    const newValue = prompt('Blacklist bearbeiten (Begriffe mit Komma trennen):', current);
    if (newValue !== null) {
        CONFIG.FILTERS.blacklist = newValue.split(',').map(s => s.trim()).filter(s => s);
        saveConfigAndUpload();
        alert('✅ Blacklist aktualisiert!');
    }
}

function editWhitelist() {
    const current = CONFIG.FILTERS.whitelist.join(', ');
    const newValue = prompt('Whitelist bearbeiten (Begriffe mit Komma trennen):', current);
    if (newValue !== null) {
        CONFIG.FILTERS.whitelist = newValue.split(',').map(s => s.trim()).filter(s => s);
        saveConfigAndUpload();
        alert('✅ Whitelist aktualisiert!');
    }
}

function editASINList() {
    const current = CONFIG.FILTERS.asin_list.join(', ');
    const info = `🎯 ASIN-LISTE:\n\nASINs in dieser Liste werden IMMER bestellt.\nNach erfolgreicher Bestellung werden sie automatisch entfernt.\n\nAktuell ${CONFIG.FILTERS.asin_list.length} ASINs in der Liste.`;
    alert(info);
    
    const newValue = prompt('ASIN-Liste bearbeiten (ASINs mit Komma trennen):', current);
    if (newValue !== null) {
        CONFIG.FILTERS.asin_list = newValue.split(',').map(s => s.trim()).filter(s => s);
        saveConfigAndUpload();
        alert(`✅ ASIN-Liste aktualisiert! (${CONFIG.FILTERS.asin_list.length} Einträge)`);
    }
}

function editPriceThreshold() {
    const current = CONFIG.FILTERS.priceThreshold;
    const newValue = prompt('Preisschwelle eingeben (in Euro):', current);
    if (newValue !== null && !isNaN(newValue)) {
        CONFIG.FILTERS.priceThreshold = parseFloat(newValue);
        saveConfigAndUpload();
        alert('✅ Preisschwelle aktualisiert!');
    }
}

function editActiveHours() {
    const current = `${CONFIG.ACTIVE_HOURS.start}-${CONFIG.ACTIVE_HOURS.end}`;
    const newValue = prompt('Aktive Zeiten (Format: Start-Ende, z.B. 5-22):', current);
    if (newValue !== null) {
        const match = newValue.match(/(\d+)-(\d+)/);
        if (match) {
            CONFIG.ACTIVE_HOURS.start = parseInt(match[1]);
            CONFIG.ACTIVE_HOURS.end = parseInt(match[2]);
            saveConfigAndUpload();
            alert('✅ Aktive Zeiten aktualisiert!');
        }
    }
}

function showCurrentSettings() {
    const settings = `🔧 EINSTELLUNGEN:\n📊 Batch: ${CONFIG.BATCH_SIZE} Produkte\n🎯 ASIN-Liste: ${CONFIG.FILTERS.asin_list.length} ASINs\n📛 Blacklist: ${CONFIG.FILTERS.blacklist.length} Begriffe\n✅ Whitelist: ${CONFIG.FILTERS.whitelist.length} Begriffe\n💰 Preisschwelle: ${CONFIG.FILTERS.priceThreshold}€\n🕐 Aktive Zeiten: ${CONFIG.ACTIVE_HOURS.start}-${CONFIG.ACTIVE_HOURS.end} Uhr`;
    alert(settings);
}

async function setGitHubToken() {
    const info = `🔑 GITHUB TOKEN:\n\nGehe zu https://github.com/settings/tokens\nund erstelle ein Token mit "gist" Berechtigung.`;
    alert(info);
    
    const newToken = prompt('GitHub Personal Access Token eingeben:', '');
    if (newToken !== null && newToken.trim()) {
        await GM.setValue('github_token', newToken.trim());
        alert('✅ GitHub Token gespeichert!');
    }
}

async function manualUpload() {
    const success = await uploadConfigToCloud();
    if (success) {
        alert(`✅ Erfolgreich in GitHub Gist gespeichert!`);
    } else {
        alert('❌ Upload fehlgeschlagen! Prüfe Console für Details.');
    }
}

async function manualDownload() {
    const success = await downloadConfigFromCloud();
    if (success) {
        alert('✅ Erfolgreich von GitHub Gist geladen!');
    } else {
        alert('❌ Download fehlgeschlagen oder keine Änderungen! Prüfe Console für Details.');
    }
}

async function toggleAutoUpload() {
    const current = await GM.getValue('auto_upload', true);
    const newValue = !current;
    await GM.setValue('auto_upload', newValue);
    alert(`🔄 Auto-Upload ${newValue ? 'AKTIVIERT' : 'DEAKTIVIERT'}`);
}

async function showCloudStatus() {
    const apiToken = await GM.getValue('github_token', '');
    const gistId = await GM.getValue('cloud_gist_id', '');
    const autoUpload = await GM.getValue('auto_upload', true);
    const lastUpload = await GM.getValue('last_cloud_upload', 0);
    const lastDownload = await GM.getValue('last_cloud_download', 0);
    
    const uploadDate = lastUpload ? new Date(lastUpload).toLocaleString() : 'Nie';
    const downloadDate = lastDownload ? new Date(lastDownload).toLocaleString() : 'Nie';
    
    const status = `☁️ GITHUB SYNC STATUS:\n\n🔑 Token: ${apiToken ? '✅ Gesetzt' : '❌ Fehlt'}\n🔗 Gist-ID: ${gistId || 'Nicht gesetzt'}\n🔄 Auto-Upload: ${autoUpload ? '✅ Aktiv' : '❌ Inaktiv'}\n📤 Letzter Upload: ${uploadDate}\n📥 Letzter Download: ${downloadDate}`;
    alert(status);
}

async function setGistId() {
    const current = await GM.getValue('cloud_gist_id', '');
    const info = `🔗 GIST-ID SETZEN:\n\nWenn du bereits einen Gist erstellt hast,\nkannst du hier die ID eingeben.\n\nAktuell: ${current || 'Nicht gesetzt'}`;
    alert(info);
    
    const newId = prompt('Gist-ID eingeben:', current);
    if (newId !== null && newId.trim()) {
        await GM.setValue('cloud_gist_id', newId.trim());
        alert('✅ Gist-ID gesetzt!');
    }
}

async function openGistInBrowser() {
    const gistId = await GM.getValue('cloud_gist_id', '');
    if (gistId) {
        window.open(`https://gist.github.com/${gistId}`, '_blank');
    } else {
        alert('❌ Keine Gist-ID gesetzt!');
    }
}

function resetToDefaults() {
    if (confirm('⚠️ Alle Einstellungen auf Standardwerte zurücksetzen?')) {
        CONFIG = { ...DEFAULT_CONFIG };
        saveConfigAndUpload();
        alert('✅ Auf Standardwerte zurückgesetzt!');
    }
}

function exportConfig() {
    const configString = JSON.stringify(CONFIG, null, 2);
    const blob = new Blob([configString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'vine-config.json';
    a.click();
    URL.revokeObjectURL(url);
    alert('✅ Konfiguration exportiert!');
}

function importConfig() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const importedConfig = JSON.parse(e.target.result);
                    CONFIG = { ...DEFAULT_CONFIG, ...importedConfig };
                    saveConfigAndUpload();
                    alert('✅ Konfiguration importiert!');
                } catch (err) {
                    alert('❌ Ungültige Konfigurationsdatei!');
                }
            };
            reader.readAsText(file);
        }
    };
    input.click();
}

// ==================== HAUPTFUNKTION ====================
(async function main() {
    console.log('🚀 Amazon Vine Autocheck - Version 6.1.8 (ASIN-Match Fix)');
    
    try {
        await loadConfig();
        console.log(`✅ Lokale Konfiguration geladen`);
        
        createMenu();
        
        startAutoSync();
        
        console.log(`✅ Script initialisiert - Batch: ${CONFIG.BATCH_SIZE}, ASIN-Liste: ${CONFIG.FILTERS.asin_list.length}`);
        
    } catch (e) {
        console.error('❌ Initialisierungsfehler:', e);
    }
    
    const url = location.href;
    
    if (url.includes('/checkout/')) {
        console.log('📦 Checkout erkannt');
        startCheckoutAutomation();
        return;
    }
    
    if (url.includes('/gp/buy/thankyou')) {
        console.log('🎉 Danke-Seite - zurück zu Vine in 5 Sekunden');
        setTimeout(() => {
            window.location.href = 'https://www.amazon.de/vine/vine-items?queue=all_items&page=1';
        }, 5000);
        return;
    }
    
    if (url.includes('/gp/cart/view.html')) {
        console.log('🛒 Warenkorb - zurück zu Vine in 3 Sekunden');
        setTimeout(() => {
            window.location.href = 'https://www.amazon.de/vine/vine-items?queue=all_items&page=1';
        }, 3000);
        return;
    }
    
    if (url.includes('/vine/vine-items')) {
        const hasTarget = await handleTargetASIN();
        if (hasTarget) {
            return;
        }
        
        while (true) {
            try {
                const hour = new Date().getHours();
                
                let isActiveTime;
                if (CONFIG.ACTIVE_HOURS.start > CONFIG.ACTIVE_HOURS.end) {
                    isActiveTime = (hour >= CONFIG.ACTIVE_HOURS.start) || (hour < CONFIG.ACTIVE_HOURS.end);
                } else {
                    isActiveTime = (hour >= CONFIG.ACTIVE_HOURS.start) && (hour < CONFIG.ACTIVE_HOURS.end);
                }
                
                if (isActiveTime) {
                    console.log('🔄 Starte Scan-Durchlauf');
                    await runProductCheck();
                    
                    const minDelay = CONFIG.WAIT_TIMES?.BETWEEN_SCANS_MIN || 1500;
                    const maxDelay = CONFIG.WAIT_TIMES?.BETWEEN_SCANS_MAX || 3000;
                    const scanDelay = rand(minDelay, maxDelay);
                    
                    console.log(`⏳ Warte ${Math.floor(scanDelay / 1000)}s bis zum nächsten Durchlauf...`);
                    await sleep(scanDelay);
                    
                } else {
                    console.log(`🌙 Außerhalb aktiver Stunden (${hour} Uhr) - Scan pausiert`);
                    await sleep(5 * 60 * 1000);
                }
                
            } catch (error) {
                console.error('❌ Fehler in Hauptschleife:', error);
                processingLock = false;
                await sleep(10000);
            }
        }
    }
})();