// ==UserScript==
// @name         Akakçe Süper İndirim Avcısı (Tüm Sayfalar Uyumlu - Düzeltilmiş)
// @namespace    http://tampermonkey.net/
// @version      2.6
// @description  Cloudflare "insan doğrulama" ekranını otomatik olarak geçer. Herhangi bir ürün listeleme sayfasındaki tüm sayfaları bir kullanıcı gibi gezer, tüm ürünleri toplar ve ilk sayfada birleştirir. İndirim oranı hafızada tutulur.
// @author       alex66 (Genişletilmiş Uyumluluk: AI Assistant)
// @match        https://www.akakce.com/*
// @grant        GM_addStyle
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/540731/Akak%C3%A7e%20S%C3%BCper%20%C4%B0ndirim%20Avc%C4%B1s%C4%B1%20%28T%C3%BCm%20Sayfalar%20Uyumlu%20-%20D%C3%BCzeltilmi%C5%9F%29.user.js
// @updateURL https://update.greasyfork.org/scripts/540731/Akak%C3%A7e%20S%C3%BCper%20%C4%B0ndirim%20Avc%C4%B1s%C4%B1%20%28T%C3%BCm%20Sayfalar%20Uyumlu%20-%20D%C3%BCzeltilmi%C5%9F%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- Cloudflare Otomatik Tıklama Mekanizması ---
    const handleCloudflare = () => {
        try {
            const iframe = document.querySelector('iframe[title*="Cloudflare"], iframe[src*="challenges.cloudflare.com"]');
            if (!iframe) return;
            const iframeDoc = iframe.contentDocument;
            if (!iframeDoc) return;
            const checkbox = iframeDoc.querySelector('input[type="checkbox"], #challenge-stage .ctp-checkbox-label');
            if (checkbox) {
                // console.log('Cloudflare doğrulama kutucuğu bulundu ve tıklanıyor...');
                checkbox.click();
            }
        } catch (e) {
            // Cross-origin hatalarını yoksay
        }
    };
    const cloudflareInterval = setInterval(handleCloudflare, 500);

    // --- YENİ BAŞLATMA MEKANİZMASI (TÜM SAYFALAR İÇİN) ---
    function initializeWhenReady() {
        const productList = document.getElementById('DPL');
        const controlsExist = document.getElementById('hunter-controls');

        if (productList && !controlsExist) {
            clearInterval(cloudflareInterval);
            mainScript();
            clearInterval(readyCheckInterval);
        }
    }

    const readyCheckInterval = setInterval(initializeWhenReady, 250);
    setTimeout(() => clearInterval(readyCheckInterval), 20000);

    // --- ANA BETİK ---
    function mainScript() {
        const DEFAULT_DISCOUNT_PERCENT = 30;

        GM_addStyle(`
            #hunter-controls {
                position: fixed; bottom: 10px; left: 10px; right: 10px; width: auto; z-index: 9999;
                background-color: #f0f0f0; color: #333; padding: 12px; border: 1px solid #ccc;
                border-radius: 10px; box-shadow: 0 -4px 10px rgba(0,0,0,0.15);
                display: grid; grid-template-columns: 1fr auto; gap: 10px; font-family: sans-serif;
                align-items: center;
            }
            .hunter-row { display: contents; }
            #hunter-controls label { font-weight: bold; font-size: 16px; }
            #discount-input { width: 60px; padding: 8px; border: 1px solid #ccc; border-radius: 5px; font-size: 16px; text-align: center; font-weight: bold; }
            .hunter-button {
                background-color: #ff6000; color: white; padding: 12px 15px; border: none;
                border-radius: 8px; cursor: pointer; font-size: 16px; font-weight: bold;
                transition: background-color 0.2s; grid-column: 1 / -1;
            }
            .hunter-button:disabled { background-color: #999; cursor: not-allowed; }
            .hunter-button:hover:not(:disabled) { background-color: #e65500; }
            #status-box {
                position: fixed; bottom: 180px; left: 10px; right: 10px; width: auto; z-index: 9998;
                background-color: #1e90ff; color: white; padding: 15px; border-radius: 8px;
                font-size: 15px; display: none; box-sizing: border-box; text-align: center;
                box-shadow: 0 4px 8px rgba(0,0,0,0.1);
            }
        `);

        let collectButton, filterButton, statusBox, discountInput;
        const productList = document.getElementById('DPL');

        function getDiscount(productItem) {
            const discountElement = productItem.querySelector('.ps_v9 i');
            if (discountElement && discountElement.textContent.includes('%')) {
                const discountValue = parseInt(discountElement.textContent.replace(/\D/g, ''), 10);
                return isNaN(discountValue) ? null : discountValue;
            }
            return null;
        }

        function showStatus(message, color = '#1e90ff') {
            const sb = document.getElementById('status-box');
            if (sb) {
                sb.style.display = 'block';
                sb.style.backgroundColor = color;
                sb.textContent = message;
            }
        }

        function startCollection() {
            if (!productList) { alert('Ürün listesi bulunamadı.'); return; }

            // --- DÜZELTME 1: Başlarken kullanıcının girdiği değeri hafızaya kaydet ---
            const currentDiscountVal = discountInput.value;
            sessionStorage.setItem('targetDiscount', currentDiscountVal);
            // ---------------------------------------------------------------------

            showStatus('Toplama işlemi başlatılıyor...');
            sessionStorage.removeItem('collectedProducts');
            sessionStorage.removeItem('collectionComplete');
            const firstPageItems = productList.innerHTML;
            sessionStorage.setItem('collectedProducts', JSON.stringify([firstPageItems]));
            sessionStorage.setItem('isCollecting', 'true');
            const nextPageLink = document.querySelector('.pager_v8 a.p[title="Sonraki"]');
            if (nextPageLink && nextPageLink.href) {
                window.location.href = nextPageLink.href;
            } else {
                showStatus('Sadece bir sayfa var.', '#28a745');
                sessionStorage.removeItem('isCollecting');
                document.getElementById('filter-button').disabled = false;
            }
        }

        function continueCollection() {
            const collectBtn = document.getElementById('collect-button');
            if (collectBtn) {
                collectBtn.disabled = true;
                collectBtn.textContent = 'Ürünler Toplanıyor...';
            }
            const currentPageItems = productList.innerHTML;
            let collected = [];
            try { collected = JSON.parse(sessionStorage.getItem('collectedProducts')) || []; } catch(e) {}
            collected.push(currentPageItems);
            sessionStorage.setItem('collectedProducts', JSON.stringify(collected));
            const nextPageLink = document.querySelector('.pager_v8 a.p[title="Sonraki"]');
            const currentPageNum = document.querySelector('.pager_v8 b')?.textContent || '1';
            const totalPages = document.querySelector('.pager_v8 i')?.textContent.split('/')[1].trim() || '1';
            showStatus(`Sayfa ${currentPageNum}/${totalPages} toplandı...`);
            if (nextPageLink && nextPageLink.href) {
                setTimeout(() => { window.location.href = nextPageLink.href; }, 1500);
            } else {
                sessionStorage.setItem('collectionComplete', 'true');
                sessionStorage.removeItem('isCollecting');
                const url = new URL(window.location.href);
                url.searchParams.set('p', '1');
                setTimeout(() => { window.location.href = url.toString(); }, 1500);
            }
        }

        function displayCollectedResults() {
            showStatus('Tüm ürünler sayfaya yükleniyor...', '#17a2b8');
            const collectedHTML = JSON.parse(sessionStorage.getItem('collectedProducts')).join('');
            productList.innerHTML = collectedHTML;
            document.querySelector('.pager_v8')?.remove();
            document.querySelector('.pph_dl')?.remove();
            sessionStorage.removeItem('collectedProducts');
            sessionStorage.removeItem('collectionComplete');
            showStatus('Tüm ürünler birleştirildi. Filtreleyebilirsiniz.', '#28a745');
            const collectBtn = document.getElementById('collect-button');
            const filterBtn = document.getElementById('filter-button');
            if (collectBtn) {
                collectBtn.textContent = 'Ürünler Toplandı';
                collectBtn.disabled = true;
            }
            if (filterBtn) filterBtn.disabled = false;
        }

        async function startFiltering() {
            // Filtreleme butonuna basıldığında güncel input değerini alıyoruz
            // initialize kısmında bu değeri zaten hafızadan geri yüklemiş olacağız.
            const minDiscountPercent = parseInt(discountInput.value, 10);

            if (isNaN(minDiscountPercent) || minDiscountPercent < 1 || minDiscountPercent > 99) {
                alert('Lütfen 1 ile 99 arasında geçerli bir indirim oranı girin.');
                return;
            }

            // Yeni filtreleme değeri ile tekrar hafızayı güncelleyelim (isteğe bağlı)
            sessionStorage.setItem('targetDiscount', discountInput.value);

            collectButton.disabled = true;
            filterButton.disabled = true;
            showStatus('Ürünler filtreleniyor...');
            const foundProducts = [];
            const allItems = Array.from(productList.querySelectorAll('li[data-pr]'));
            allItems.forEach(item => {
                const discount = getDiscount(item);
                if (discount !== null && discount >= minDiscountPercent) {
                    foundProducts.push({ element: item, discount: discount });
                }
            });
            showStatus('Sıralama yapılıyor...', '#17a2b8');
            foundProducts.sort((a, b) => b.discount - a.discount);
            productList.innerHTML = '';
            foundProducts.forEach(product => {
                productList.appendChild(product.element);
            });
            showStatus(`Filtreleme bitti! ${foundProducts.length} ürün bulundu (Min %${minDiscountPercent}).`, '#28a745');
            filterButton.textContent = 'Filtreleme Bitti';
        }

        function initialize() {
            const controlsContainer = document.createElement('div');
            controlsContainer.id = 'hunter-controls';
            const discountRow = document.createElement('div');
            discountRow.className = 'hunter-row';
            const label = document.createElement('label');
            label.htmlFor = 'discount-input';
            label.textContent = 'Min. İndirim (%):';

            discountInput = document.createElement('input');
            discountInput.id = 'discount-input';
            discountInput.type = 'number';

            // --- DÜZELTME 2: Hafızadaki değeri kontrol et, yoksa varsayılanı kullan ---
            const savedDiscount = sessionStorage.getItem('targetDiscount');
            discountInput.value = savedDiscount ? savedDiscount : DEFAULT_DISCOUNT_PERCENT;
            // ----------------------------------------------------------------------

            discountRow.appendChild(label);
            discountRow.appendChild(discountInput);
            collectButton = document.createElement('button');
            collectButton.id = 'collect-button';
            collectButton.className = 'hunter-button';
            collectButton.textContent = 'Tüm Ürünleri Topla';
            collectButton.onclick = startCollection;
            filterButton = document.createElement('button');
            filterButton.id = 'filter-button';
            filterButton.className = 'hunter-button';
            filterButton.textContent = 'Filtrele ve Sırala';
            filterButton.onclick = startFiltering;
            filterButton.disabled = true;
            filterButton.style.marginTop = "5px";
            statusBox = document.createElement('div');
            statusBox.id = 'status-box';
            controlsContainer.appendChild(discountRow);
            controlsContainer.appendChild(collectButton);
            controlsContainer.appendChild(filterButton);
            document.body.appendChild(controlsContainer);
            document.body.appendChild(statusBox);

            if (sessionStorage.getItem('isCollecting') === 'true') {
                continueCollection();
            } else if (sessionStorage.getItem('collectionComplete') === 'true') {
                displayCollectedResults();
            }
        }
        initialize();
    }
})();