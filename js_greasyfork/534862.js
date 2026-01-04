// ==UserScript==
// @name         Nova Castelijns Eşya Teklif Scripti
// @namespace    popmundo
// @author       Nova Castelijns (2641094)
// @version      1.0
// @description  Belirli bir karaktere isim/miktar/fiyat ile toplu eşya teklif etme aracı.
// @match        *://*.popmundo.com/World/Popmundo.aspx/Character/OfferItem/*
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @run-at       document-idle
// @icon         https://www.pngmart.com/files/22/Star-Emojis-PNG-HD.png
// @downloadURL https://update.greasyfork.org/scripts/534862/Nova%20Castelijns%20E%C5%9Fya%20Teklif%20Scripti.user.js
// @updateURL https://update.greasyfork.org/scripts/534862/Nova%20Castelijns%20E%C5%9Fya%20Teklif%20Scripti.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- YAPILANDIRMA ---
    const ITEM_DROPDOWN_SELECTOR = '#ctl00_cphLeftColumn_ctl00_ddlItem';
    const OFFER_BUTTON_SELECTOR = '#ctl00_cphLeftColumn_ctl00_btnGive';
    const PRICE_INPUT_SELECTOR = '#ctl00_cphLeftColumn_ctl00_txtPriceTag';
    const MIN_DELAY_MS = 2000; // Minimum bekleme süresi (2 saniye)
    const MAX_DELAY_MS = 3000; // Maksimum bekleme süresi (3 saniye)
    const POST_PRICE_SET_DELAY_MS = 500; // Fiyat belirleme sonrası bekleme
    const STORAGE_KEY_ITEMS = 'popmundo_offerItem_items_swqp';
    const STORAGE_KEY_RUNNING = 'popmundo_offerItem_running_swqp';
    const STORAGE_KEY_PRICE = 'popmundo_offerItem_targetPrice';

    // Rastgele gecikme süresi oluşturan fonksiyon
    function getRandomDelay() {
        return Math.floor(Math.random() * (MAX_DELAY_MS - MIN_DELAY_MS + 1)) + MIN_DELAY_MS;
    }

    let itemDropdown = document.querySelector(ITEM_DROPDOWN_SELECTOR);
    let offerButton = document.querySelector(OFFER_BUTTON_SELECTOR);
    let pagePriceInput = document.querySelector(PRICE_INPUT_SELECTOR);

    if (!itemDropdown) { console.warn("Hata: Eşya listesi bulunamadı"); return; }
    if (!offerButton) { console.warn("Hata: Teklif butonu bulunamadı"); }
    if (!pagePriceInput) { console.warn("Hata: Fiyat alanı bulunamadı"); }

    function createUI() {
        if (document.getElementById('bulkOfferUIScript')) return;
        const scriptUIArea = document.createElement('div');
        scriptUIArea.id = 'bulkOfferUIScript';
        scriptUIArea.style.border = '1px solid #ccc';
        scriptUIArea.style.padding = '15px';
        scriptUIArea.style.margin = '20px 0 5px 0';
        scriptUIArea.style.backgroundColor = '#f9f9f9';

        scriptUIArea.innerHTML = `
            <div style="display: flex; flex-wrap: wrap; gap: 15px; margin-bottom: 10px;">
                <div>
                    <label for="itemNameInputScript">Eşya Adının Başlangıcı:</label><br>
                    <input type="text" id="itemNameInputScript" style="width: 250px; padding: 5px;" placeholder="Örn: İlaç">
                </div>
                <div>
                    <label for="itemQuantityInputScript">Miktar:</label><br>
                    <input type="number" id="itemQuantityInputScript" min="1" value="1" style="width: 70px; padding: 5px;">
                </div>
                <div>
                    <label for="itemPriceInputScript">Fiyat (M$):</label><br>
                    <input type="number" id="itemPriceInputScript" min="0" value="0" style="width: 90px; padding: 5px;">
                </div>
            </div>
            <div style="margin-top: 15px;">
                <button id="startOfferByNameQtyPriceBtnScript" type="button" style="background-color: #4CAF50; color: white; padding: 8px 12px; border: none; cursor: pointer;">Teklif Et</button>
                <button id="stopBulkOfferBtnScript" type="button" style="margin-left: 10px; background-color: #f44336; color: white; padding: 8px 12px; border: none; cursor: pointer;">Durdur</button>
            </div>
            <div id="bulkOfferStatusScript" style="margin-top: 15px; font-weight: bold;">Durum: Hazır</div>
        `;

        itemDropdown.parentNode.insertBefore(scriptUIArea, itemDropdown);

        document.getElementById('startOfferByNameQtyPriceBtnScript').addEventListener('click', startOfferByNameQuantityPrice);
        document.getElementById('stopBulkOfferBtnScript').addEventListener('click', stopOffer);

        GM_addStyle(`
            #itemNameInputScript, #itemQuantityInputScript, #itemPriceInputScript {
                border: 1px solid #ccc;
                border-radius: 3px;
                box-sizing: border-box;
            }
            #startOfferByNameQtyPriceBtnScript:disabled, #stopBulkOfferBtnScript:disabled {
                cursor: not-allowed;
                opacity: 0.6;
            }
        `);
    }

    async function startOfferByNameQuantityPrice() {
        const itemNameInput = document.getElementById('itemNameInputScript');
        const quantityInput = document.getElementById('itemQuantityInputScript');
        const priceInput = document.getElementById('itemPriceInputScript');
        const statusDiv = document.getElementById('bulkOfferStatusScript');
        const inputText = itemNameInput.value.trim();
        const requestedQuantity = parseInt(quantityInput.value, 10);
        const requestedPrice = parseInt(priceInput.value, 10);

        if (!inputText) {
            statusDiv.textContent = "Hata: Lütfen eşya adı girin";
            return;
        }
        if (isNaN(requestedQuantity) || requestedQuantity < 1) {
            statusDiv.textContent = "Hata: Geçersiz miktar";
            return;
        }
        if (isNaN(requestedPrice) || requestedPrice < 0) {
            statusDiv.textContent = "Hata: Geçersiz fiyat";
            return;
        }

        const allItemsFound = [];
        const inputTextLower = inputText.toLowerCase();

        for (let option of itemDropdown.options) {
            if (option.value && option.value !== "-1" && option.textContent.trim().toLowerCase().startsWith(inputTextLower)) {
                allItemsFound.push({
                    value: option.value,
                    text: option.textContent.trim()
                });
            }
        }

        if (allItemsFound.length === 0) {
            statusDiv.textContent = `Eşya bulunamadı: "${inputText}"`;
            return;
        }

        const itemsToOffer = allItemsFound.slice(0, requestedQuantity);
        statusDiv.textContent = `${allItemsFound.length} eşya bulundu. ${itemsToOffer.length} adet teklif edilecek...`;

        await GM_setValue(STORAGE_KEY_PRICE, requestedPrice);
        await GM_setValue(STORAGE_KEY_ITEMS, JSON.stringify(itemsToOffer));
        await GM_setValue(STORAGE_KEY_RUNNING, true);
        disableButtons(true);
        await processNextOffer();
    }

    async function stopOffer() {
        const statusDiv = document.getElementById('bulkOfferStatusScript');
        await GM_deleteValue(STORAGE_KEY_ITEMS);
        await GM_deleteValue(STORAGE_KEY_RUNNING);
        await GM_deleteValue(STORAGE_KEY_PRICE);
        statusDiv.textContent = "İşlem durduruldu";
        disableButtons(false);
    }

    function disableButtons(disabled) {
        const elements = ['startOfferByNameQtyPriceBtnScript', 'stopBulkOfferBtnScript', 'itemNameInputScript', 'itemQuantityInputScript', 'itemPriceInputScript'];
        elements.forEach(id => {
            const element = document.getElementById(id);
            if (element) element.disabled = disabled;
        });
    }

    async function processNextOffer() {
        const isRunning = await GM_getValue(STORAGE_KEY_RUNNING, false);
        if (!isRunning) {
            disableButtons(false);
            return;
        }

        const itemsJson = await GM_getValue(STORAGE_KEY_ITEMS, '[]');
        let itemsToOffer = JSON.parse(itemsJson);
        const statusDiv = document.getElementById('bulkOfferStatusScript');
        const targetPrice = await GM_getValue(STORAGE_KEY_PRICE, 0);

        if (itemsToOffer.length === 0) {
            statusDiv.textContent = "Tüm teklifler tamamlandı!";
            await stopOffer();
            return;
        }

        const itemToOffer = itemsToOffer.shift();

        // Fiyat ayarlama
        if (pagePriceInput && targetPrice > 0) {
            pagePriceInput.value = targetPrice;
            pagePriceInput.dispatchEvent(new Event('input', { bubbles: true }));
            pagePriceInput.dispatchEvent(new Event('change', { bubbles: true }));
            await new Promise(resolve => setTimeout(resolve, POST_PRICE_SET_DELAY_MS));
        }

        // Eşya seçme
        itemDropdown.value = itemToOffer.value;
        statusDiv.textContent = `Teklif ediliyor: ${itemToOffer.text} - ${targetPrice}M$`;

        // Kalan listeyi kaydet
        await GM_setValue(STORAGE_KEY_ITEMS, JSON.stringify(itemsToOffer));

        // Rastgele gecikme
        const delay = getRandomDelay();
        console.log(`Bekleniyor: ${delay}ms`);
        await new Promise(resolve => setTimeout(resolve, delay));

        // Son kontrol ve teklif
        const stillRunning = await GM_getValue(STORAGE_KEY_RUNNING, false);
        if (stillRunning) {
            offerButton.click();
        }
    }

    async function checkOfferStateOnLoad() {
        createUI();
        const isRunning = await GM_getValue(STORAGE_KEY_RUNNING, false);
        const itemsPending = JSON.parse(await GM_getValue(STORAGE_KEY_ITEMS, '[]'));

        if (isRunning && itemsPending.length > 0) {
            disableButtons(true);
            setTimeout(processNextOffer, 500);
        }
    }

    checkOfferStateOnLoad();
})();
