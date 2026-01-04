// ==UserScript==
// @name         Popmundo - Bulk Offer & Accept Helper
// @namespace    http://tampermonkey.net/
// @version      4.4
// @description  Oferta itens por nome/quantidade/preço e aceita ofertas/presentes/compras em massa por nome e preço máximo (apenas valores inteiros). 
// @author       Popper
// @match        *://*.popmundo.com/World/Popmundo.aspx/Character/OfferItem/*
// @match        *://*.popmundo.com/World/Popmundo.aspx/Character/ItemsOffered
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/534674/Popmundo%20-%20Bulk%20Offer%20%20Accept%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/534674/Popmundo%20-%20Bulk%20Offer%20%20Accept%20Helper.meta.js
// ==/UserScript==
(function() {
    'use strict';
    // =================================================================================
    // --- ROTEADOR PRINCIPAL ---
    // =================================================================================
    function initializeScript() {
        const currentUrl = window.location.href;
        if (currentUrl.includes('/Character/OfferItem/')) {
            console.log("Bulk Helper: Página de OFERTAR item detectada.");
            setupOfferPage();
        } else if (currentUrl.includes('/Character/ItemsOffered')) {
            console.log("Bulk Helper: Página de ITENS OFERTADOS detectada.");
            setupAcceptPage(); // Esta função já cuida da página ItemsOffered
            cleanOfferedItemsList(); // Chama a nova função de limpeza
        }
    }

    // =================================================================================
    // --- FUNCIONALIDADE 1: OFERTAR ITENS EM MASSA (LAYOUT CORRIGIDO) ---
    // =================================================================================
    function setupOfferPage() {
        const OFFER_BUTTON_SELECTOR = '#ctl00_cphLeftColumn_ctl00_btnGive';
        const PRICE_INPUT_SELECTOR = '#ctl00_cphLeftColumn_ctl00_txtPriceTag';
        const ITEM_DROPDOWN_SELECTOR = '#ctl00_cphLeftColumn_ctl00_ddlItem';
        const FORM_CONTENT_DIV_SELECTOR = '#ctl00_cphLeftColumn_ctl00_updMain';
        const BASE_DELAY_MS = 2000;
        const POST_PRICE_SET_DELAY_MS = 100;
        const STORAGE_KEY_ITEMS_OFFER = 'popmundo_offerItem_items_swqp';
        const STORAGE_KEY_RUNNING_OFFER = 'popmundo_offerItem_running_swqp';
        const STORAGE_KEY_PRICE_OFFER = 'popmundo_offerItem_targetPrice';
        const HIDE_OFFERRED_ITEM_CHECKBOX_KEY = "MR_HIDE_OFFERRED_ITEM_CHCKBOX";
        const HIDE_OFFERRED_ITEM_LIST_KEY = "MR_HIDE_OFFERRED_ITEM_LIST";

        function removeWarningBox() {
            const warningBox = Array.from(document.querySelectorAll('.box h2')).find(h2 => h2.textContent.trim() === "Quem avisa amigo é!");
            if (warningBox && warningBox.parentElement) {
                warningBox.parentElement.remove();
                console.log("Bulk Helper: Caixa de aviso 'Quem avisa amigo é!' removida.");
            }
        }

        function hideOfferedItemsFeature() {
            if (localStorage.getItem(HIDE_OFFERRED_ITEM_CHECKBOX_KEY) === null) {
                localStorage.setItem(HIDE_OFFERRED_ITEM_CHECKBOX_KEY, 1);
            }
            let offerredItemList = { "offred_item_list": [] };
            if (localStorage.getItem(HIDE_OFFERRED_ITEM_LIST_KEY) === null) {
                localStorage.setItem(HIDE_OFFERRED_ITEM_LIST_KEY, JSON.stringify(offerredItemList));
            } else {
                offerredItemList = JSON.parse(localStorage.getItem(HIDE_OFFERRED_ITEM_LIST_KEY));
            }
            const deliveryCheckboxParent = document.querySelector('#ctl00_cphLeftColumn_ctl00_chkDelivery')?.parentElement;
            if (deliveryCheckboxParent) {
                const checkboxContainer = document.createElement('p');
                checkboxContainer.innerHTML = `
                    <input id='mr_hideoffere_item_checkbox' type='checkbox' ${localStorage.getItem(HIDE_OFFERRED_ITEM_CHECKBOX_KEY) == 1 ? 'checked' : ''}>
                    <label for='mr_hideoffere_item_checkbox'>Remover itens já oferecidos</label>
                `;
                deliveryCheckboxParent.before(checkboxContainer);
                document.getElementById('mr_hideoffere_item_checkbox').addEventListener('change', function() {
                    localStorage.setItem(HIDE_OFFERRED_ITEM_CHECKBOX_KEY, this.checked ? 1 : 0);
                    location.reload();
                });
            }
            if (localStorage.getItem(HIDE_OFFERRED_ITEM_CHECKBOX_KEY) == 1) {
                const itemDropdown = document.querySelector(ITEM_DROPDOWN_SELECTOR);
                if (itemDropdown) {
                    Array.from(itemDropdown.options).forEach(option => {
                        if (option.value && option.value !== "-1" && offerredItemList.offred_item_list.includes(option.value)) {
                            option.remove();
                        }
                    });
                }
            }
            console.log("Bulk Helper: Funcionalidade 'Esconder itens já oferecidos' inicializada (Padrão: LIGADO).");
        }

        function createOfferUI() {
            if (document.getElementById('bulkOfferUIScript')) return;
            const mainBoxWithForm = document.querySelector(FORM_CONTENT_DIV_SELECTOR)?.closest('.box');
            if (!mainBoxWithForm) {
                console.error("Bulk Helper: Não foi possível encontrar a caixa principal do formulário.");
                return;
            }
            const nativeTitles = mainBoxWithForm.querySelectorAll('h2, h3');
            nativeTitles.forEach(title => {
                if (title.textContent.includes('Ofertar um item') || title.textContent.includes('Selecione um item para ofertar')) {
                    title.remove();
                }
            });
            const scriptUIArea = document.createElement('div');
            scriptUIArea.id = 'bulkOfferUIScript';
            scriptUIArea.className = 'bulk-helper-wrapper';
            scriptUIArea.innerHTML = `
                <div class="panel-header"><h2><i class="fa-solid fa-dolly"></i>Bulk Offer Helper</h2></div>
                <div class="automation-panel-compact">
                    <div class="config-container">
                        <div class="config-item"><label for="itemNameInputScript">Nome do Item:</label><input type="text" id="itemNameInputScript" placeholder="Ex: Analgésicos"></div>
                        <div class="config-item"><label for="itemQuantityInputScript">Quantidade:</label><input type="number" id="itemQuantityInputScript" min="1" value="1"></div>
                        <div class="config-item config-item-full"><label for="itemPriceInputScript">Preço (M$):</label><input type="number" id="itemPriceInputScript" min="0" step="1" value="0"></div>
                    </div>
                    <div class="action-buttons">
                        <button id="startOfferByNameQtyPriceBtnScript" type="button" class="btn-start"><i class="fa-solid fa-play"></i> Ofertar</button>
                        <button id="stopBulkOfferBtnScript" type="button" class="btn-stop"><i class="fa-solid fa-stop"></i> Parar</button>
                    </div>
                    <div id="bulkOfferStatusScript" class="status-display">Status: Pronto.</div>
                </div>
            `;
            mainBoxWithForm.insertBefore(scriptUIArea, mainBoxWithForm.firstChild);
            document.getElementById('startOfferByNameQtyPriceBtnScript').addEventListener('click', startOfferByNameQuantityPrice);
            document.getElementById('stopBulkOfferBtnScript').addEventListener('click', stopOffer);
            addGlobalStyles();
        }

        async function startOfferByNameQuantityPrice() {
            const itemNameInput = document.getElementById('itemNameInputScript');
            const quantityInput = document.getElementById('itemQuantityInputScript');
            const priceInput = document.getElementById('itemPriceInputScript');
            const statusDiv = document.getElementById('bulkOfferStatusScript');
            const inputText = itemNameInput.value.trim();
            const requestedQuantity = parseInt(quantityInput.value, 10);
            const requestedPrice = parseInt(priceInput.value, 10);
            if (!inputText) { statusDiv.textContent = "Erro: Digite o início do nome do item."; return; }
            if (isNaN(requestedQuantity) || requestedQuantity < 1) { statusDiv.textContent = "Erro: Quantidade inválida."; return; }
            if (isNaN(requestedPrice) || requestedPrice < 0) { statusDiv.textContent = "Erro: Preço inválido."; return; }
            const allItemsFound = Array.from(document.querySelector(ITEM_DROPDOWN_SELECTOR).options)
                .filter(option => option.value && option.value !== "-1" && option.textContent.trim().toLowerCase().startsWith(inputText.toLowerCase()))
                .map(option => ({ value: option.value, text: option.textContent.trim() }));
            if (allItemsFound.length === 0) {
                statusDiv.textContent = `Status: Nenhum item encontrado começando com "${inputText}".`;
                return;
            }
            const itemsToOfferThisRun = allItemsFound.slice(0, requestedQuantity);
            statusDiv.textContent = `Encontrado(s) ${allItemsFound.length}. Ofertando ${itemsToOfferThisRun.length} por ${requestedPrice} M$...`;
            await GM_setValue(STORAGE_KEY_PRICE_OFFER, requestedPrice);
            await GM_setValue(STORAGE_KEY_ITEMS_OFFER, JSON.stringify(itemsToOfferThisRun));
            await GM_setValue(STORAGE_KEY_RUNNING_OFFER, true);
            disableOfferButtons(true);
            await processNextOffer();
        }
        async function stopOffer() {
            await GM_deleteValue(STORAGE_KEY_ITEMS_OFFER);
            await GM_deleteValue(STORAGE_KEY_RUNNING_OFFER);
            await GM_deleteValue(STORAGE_KEY_PRICE_OFFER);
            const statusDiv = document.getElementById('bulkOfferStatusScript');
            if (statusDiv) statusDiv.textContent = "Status: Oferta interrompida pelo usuário.";
            disableOfferButtons(false);
        }
        function disableOfferButtons(disabled) {
             document.getElementById('startOfferByNameQtyPriceBtnScript').disabled = disabled;
             document.getElementById('stopBulkOfferBtnScript').disabled = !disabled;
             document.getElementById('itemNameInputScript').disabled = disabled;
             document.getElementById('itemQuantityInputScript').disabled = disabled;
             document.getElementById('itemPriceInputScript').disabled = disabled;
        }
        async function processNextOffer() {
            const isRunning = await GM_getValue(STORAGE_KEY_RUNNING_OFFER, false);
            if (!isRunning) { disableOfferButtons(false); return; }
            let itemsToOffer = JSON.parse(await GM_getValue(STORAGE_KEY_ITEMS_OFFER, '[]'));
            const statusDiv = document.getElementById('bulkOfferStatusScript');
            if (itemsToOffer.length === 0) {
                statusDiv.textContent = "Status: Todas as ofertas foram concluídas!";
                await stopOffer();
                return;
            }
            const itemDropdown = document.querySelector(ITEM_DROPDOWN_SELECTOR);
            const offerButton = document.querySelector(OFFER_BUTTON_SELECTOR);
            const pagePriceInput = document.querySelector(PRICE_INPUT_SELECTOR);
            if (!itemDropdown || !offerButton) {
                statusDiv.textContent = "Erro Crítico: Elementos da página desapareceram.";
                await stopOffer(); return;
            }
            const itemToOffer = itemsToOffer.shift();
            const targetPrice = await GM_getValue(STORAGE_KEY_PRICE_OFFER, 0);
            if (pagePriceInput) pagePriceInput.value = String(targetPrice);
            await new Promise(resolve => setTimeout(resolve, POST_PRICE_SET_DELAY_MS));
            const initialTotalCount = JSON.parse(await GM_getValue(STORAGE_KEY_ITEMS_OFFER, '[]')).length + itemsToOffer.length + 1;
            statusDiv.textContent = `Ofertando ${initialTotalCount - itemsToOffer.length}/${initialTotalCount}: '${itemToOffer.text}'...`;
            itemDropdown.value = itemToOffer.value;
            if (itemDropdown.value !== itemToOffer.value) {
                 statusDiv.textContent = `Erro: Falha ao selecionar '${itemToOffer.text}'. Pulando...`;
                 await GM_setValue(STORAGE_KEY_ITEMS_OFFER, JSON.stringify(itemsToOffer));
                 setTimeout(processNextOffer, BASE_DELAY_MS / 2); return;
            }
            let offerredItemList = JSON.parse(localStorage.getItem(HIDE_OFFERRED_ITEM_LIST_KEY) || '{"offred_item_list":[]}');
            if (!offerredItemList.offred_item_list.includes(itemToOffer.value)) {
                offerredItemList.offred_item_list.push(itemToOffer.value);
                localStorage.setItem(HIDE_OFFERRED_ITEM_LIST_KEY, JSON.stringify(offerredItemList));
                console.log(`Bulk Helper: Item '${itemToOffer.text}' adicionado à lista de itens ofertados para esconder.`);
            }
            await GM_setValue(STORAGE_KEY_ITEMS_OFFER, JSON.stringify(itemsToOffer));
            await new Promise(resolve => setTimeout(resolve, BASE_DELAY_MS));
            if (!await GM_getValue(STORAGE_KEY_RUNNING_OFFER, false)) { disableOfferButtons(false); return; }
            offerButton.click();
        }
        async function checkOfferStateOnLoad() {
            removeWarningBox();
            createOfferUI();
            hideOfferedItemsFeature();
            const isRunning = await GM_getValue(STORAGE_KEY_RUNNING_OFFER, false);
            if (isRunning) {
                disableOfferButtons(true);
                document.getElementById('bulkOfferStatusScript').textContent = "Status: Recarregado, continuando oferta...";
                await new Promise(resolve => setTimeout(resolve, 500));
                await processNextOffer();
            } else {
                disableOfferButtons(false);
            }
        }
        checkOfferStateOnLoad();
    }

    // =================================================================================
    // --- FUNCIONALIDADE 2: ACEITAR OFERTAS E LIMPEZA DA LISTA ---
    // =================================================================================

    const HIDE_OFFERRED_ITEM_LIST_KEY = "MR_HIDE_OFFERRED_ITEM_LIST";

    // *** FUNÇÃO CORRIGIDA: Limpar a lista de itens ofertados ***
    function cleanOfferedItemsList() {
        let offerredItemList = JSON.parse(localStorage.getItem(HIDE_OFFERRED_ITEM_LIST_KEY) || '{"offred_item_list":[]}');
        if (offerredItemList.offred_item_list.length === 0) {
            console.log("Bulk Helper Clean: Nenhuma lista de itens escondidos para limpar.");
            return;
        }

        // 1. Encontrar a caixa específica de "Seus itens sendo ofertados"
        const yourOffersBox = Array.from(document.querySelectorAll('.box h2'))
            .find(h2 => h2.textContent.trim() === 'Itens que você está ofertando' || h2.textContent.trim() === 'Your Items Being Offered')
            ?.closest('.box');

        // 2. Se a caixa não for encontrada, significa que você não tem NENHUM item ofertado. Limpamos a lista inteira.
        if (!yourOffersBox) {
            console.log("Bulk Helper Clean: Seção 'Seus itens sendo ofertados' não encontrada. Limpando toda a lista de itens escondidos.");
            localStorage.setItem(HIDE_OFFERRED_ITEM_LIST_KEY, JSON.stringify({ "offred_item_list": [] }));
            return;
        }

        // 3. Se a caixa for encontrada, pegamos os IDs dos itens APENAS de dentro dela.
        const currentOfferedItemIDs = Array.from(yourOffersBox.querySelectorAll('a[href*="/World/Popmundo.aspx/Character/Item/"]'))
            .map(link => {
                const match = link.href.match(/\/Item\/(\d+)/);
                return match ? match[1] : null;
            })
            .filter(Boolean);

        // Se a caixa existe mas não há links de itens dentro dela, também limpamos a lista.
        if (currentOfferedItemIDs.length === 0 && yourOffersBox.textContent.includes('Você não está ofertando nenhum item no momento')) {
             console.log("Bulk Helper Clean: Você não tem itens em oferta. Limpando a lista de itens escondidos.");
             localStorage.setItem(HIDE_OFFERRED_ITEM_LIST_KEY, JSON.stringify({ "offred_item_list": [] }));
             return;
        }

        const newOfferedItemList = [];
        let itemsRemovedCount = 0;

        // 4. Comparamos nossa lista de escondidos com a lista real de itens que você está ofertando.
        offerredItemList.offred_item_list.forEach(itemId => {
            if (currentOfferedItemIDs.includes(itemId)) {
                newOfferedItemList.push(itemId); // Mantém na lista de escondidos
            } else {
                itemsRemovedCount++; // Remove da lista de escondidos
            }
        });

        if (itemsRemovedCount > 0) {
            offerredItemList.offred_item_list = newOfferedItemList;
            localStorage.setItem(HIDE_OFFERRED_ITEM_LIST_KEY, JSON.stringify(offerredItemList));
            console.log(`Bulk Helper Clean: Removidos ${itemsRemovedCount} itens da lista de escondidos que não estão mais em oferta.`);
        } else {
            console.log("Bulk Helper Clean: Todos os itens escondidos ainda estão em oferta. Nenhuma limpeza necessária.");
        }
    }

    function setupAcceptPage() {
        const BASE_DELAY_MS = 2000;
        const STORAGE_KEY_RUNNING_ACCEPT = 'popmundo_acceptItem_running';
        const STORAGE_KEY_MAX_PRICE_ACCEPT = 'popmundo_acceptItem_maxPrice';
        const STORAGE_KEY_ITEM_NAME_ACCEPT = 'popmundo_acceptItem_itemName';
        const STORAGE_KEY_ACCEPTED_COUNT = 'popmundo_acceptItem_accepted_count';
        const STORAGE_KEY_TOTAL_SPENT_ACCEPT = 'popmundo_acceptItem_totalSpent';

        function createAcceptUI() {
            if (document.getElementById('bulkAcceptUIScript')) return;
            const offersSection = Array.from(document.querySelectorAll('.box'))
                .find(box => box.textContent.includes('Itens sendo ofertados a você') || box.textContent.includes('Items Offered To You'));
            if (!offersSection) {
                console.log("Bulk Accept Helper: Seção 'Itens sendo ofertados a você' não encontrada.");
                return;
            }
            const scriptUIArea = document.createElement('div');
            scriptUIArea.id = 'bulkAcceptUIScript';
            scriptUIArea.className = 'bulk-helper-wrapper';
            scriptUIArea.innerHTML = `
                <div class="panel-header"><h2><i class="fa-solid fa-check-circle"></i>Bulk Accept Helper</h2></div>
                <div class="automation-panel-compact">
                    <div class="config-container">
                        <div class="config-item"><label for="itemNameInputAcceptScript">Nome do Item (Opcional):</label><input type="text" id="itemNameInputAcceptScript" placeholder="Deixe em branco para todos"></div>
                        <div class="config-item"><label for="maxPriceInputScript">Preço MÁXIMO (M$):</label><input type="number" id="maxPriceInputScript" min="0" step="1" value="55000"></div>
                    </div>
                    <div class="action-buttons">
                        <button id="startAcceptBtnScript" type="button" class="btn-start"><i class="fa-solid fa-play"></i> Aceitar</button>
                        <button id="stopAcceptBtnScript" type="button" class="btn-stop"><i class="fa-solid fa-stop"></i> Parar</button>
                    </div>
                    <div id="bulkAcceptStatusScript" class="status-display">Status: Pronto.</div>
                    <div id="bulkAcceptSpentScript" class="spent-display">Gasto Total: 0 M$</div>
                </div>
            `;
            offersSection.insertBefore(scriptUIArea, offersSection.firstChild);
            document.getElementById('startAcceptBtnScript').addEventListener('click', startBulkAccept);
            document.getElementById('stopAcceptBtnScript').addEventListener('click', stopBulkAccept);
            addGlobalStyles();
        }

        async function startBulkAccept() {
            const priceInput = document.getElementById('maxPriceInputScript');
            const nameInput = document.getElementById('itemNameInputAcceptScript');
            const statusDiv = document.getElementById('bulkAcceptStatusScript');
            const maxPrice = parseInt(priceInput.value.replace(/[.,]/g, ''), 10);
            const targetName = nameInput.value.trim().toLowerCase();
            if (isNaN(maxPrice) || maxPrice < 0) { statusDiv.textContent = "Erro: Preço máximo inválido."; priceInput.focus(); return; }
            statusDiv.textContent = `Iniciando... Buscando ofertas para "${targetName || 'qualquer item'}" com preço até ${maxPrice} M$.`;
            document.getElementById('bulkAcceptSpentScript').textContent = `Gasto Total: 0 M$`;
            await GM_setValue(STORAGE_KEY_MAX_PRICE_ACCEPT, maxPrice);
            await GM_setValue(STORAGE_KEY_ITEM_NAME_ACCEPT, targetName);
            await GM_setValue(STORAGE_KEY_RUNNING_ACCEPT, true);
            await GM_setValue(STORAGE_KEY_ACCEPTED_COUNT, 0);
            await GM_setValue(STORAGE_KEY_TOTAL_SPENT_ACCEPT, 0);
            disableAcceptButtons(true);
            await processNextAccept();
        }

        async function stopBulkAccept() {
            const totalSpent = await GM_getValue(STORAGE_KEY_TOTAL_SPENT_ACCEPT, 0);
            const acceptedCount = await GM_getValue(STORAGE_KEY_ACCEPTED_COUNT, 0);
            await GM_deleteValue(STORAGE_KEY_RUNNING_ACCEPT);
            await GM_deleteValue(STORAGE_KEY_MAX_PRICE_ACCEPT);
            await GM_deleteValue(STORAGE_KEY_ITEM_NAME_ACCEPT);
            await GM_deleteValue(STORAGE_KEY_ACCEPTED_COUNT);
            await GM_deleteValue(STORAGE_KEY_TOTAL_SPENT_ACCEPT);
            const statusDiv = document.getElementById('bulkAcceptStatusScript');
            if (statusDiv) statusDiv.textContent = `Status: Interrompido. Total aceito: ${acceptedCount}. Gasto: ${totalSpent} M$.`;
            disableAcceptButtons(false);
        }

        function disableAcceptButtons(disabled) {
            document.getElementById('startAcceptBtnScript').disabled = disabled;
            document.getElementById('stopAcceptBtnScript').disabled = !disabled;
            document.getElementById('maxPriceInputScript').disabled = disabled;
            document.getElementById('itemNameInputAcceptScript').disabled = disabled;
        }

        function parseBrazilianCurrency(valueStr) {
            let cleanStr = valueStr.replace(/[^\d.,]/g, '');
            let parts = cleanStr.split(',');
            let integerPart = parts[0].replace(/\./g, '');
            return parseInt(integerPart, 10) || 0;
        }

        async function processNextAccept() {
            if (!await GM_getValue(STORAGE_KEY_RUNNING_ACCEPT, false)) { disableAcceptButtons(false); return; }
            const maxPrice = await GM_getValue(STORAGE_KEY_MAX_PRICE_ACCEPT, -1);
            const targetName = await GM_getValue(STORAGE_KEY_ITEM_NAME_ACCEPT, '');
            const acceptedCount = await GM_getValue(STORAGE_KEY_ACCEPTED_COUNT, 0);
            const totalSpent = await GM_getValue(STORAGE_KEY_TOTAL_SPENT_ACCEPT, 0);
            const statusDiv = document.getElementById('bulkAcceptStatusScript');
            const spentDiv = document.getElementById('bulkAcceptSpentScript');
            const offersSection = Array.from(document.querySelectorAll('.box')).find(box => box.textContent.includes('Itens sendo ofertados a você') || box.textContent.includes('Items Offered To You'));
            if (!offersSection) { statusDiv.textContent = "Status: Seção de ofertas não encontrada. Concluindo."; await stopBulkAccept(); return; }
            const offerParagraphs = Array.from(offersSection.querySelectorAll('p.nobmargin')).filter(p => p.textContent.includes('Oferecido por') || p.textContent.includes('custo:') || p.textContent.includes('cost:'));
            if (offerParagraphs.length === 0) { statusDiv.textContent = `Status: Nenhuma oferta encontrada. Total aceito: ${acceptedCount}. Gasto: ${totalSpent} M$. Concluído!`; await stopBulkAccept(); return; }
            let foundItemToAccept = false;
            for (const paragraph of offerParagraphs) {
                const itemLink = paragraph.querySelector('a[id*="lnkItem"]');
                const itemName = itemLink ? itemLink.textContent.trim() : '';
                if (!itemName) continue;
                let itemPrice = 0;
                let priceText = "Presente";
                const costMatch = paragraph.textContent.match(/(custo|cost):\s*([\d.,]+)\s*M\$/);
                if (costMatch && costMatch[2]) {
                    itemPrice = parseBrazilianCurrency(costMatch[2]);
                    priceText = `${itemPrice} M$`;
                }
                const isNameOk = (targetName === '' || itemName.toLowerCase().includes(targetName));
                const isPriceOk = (itemPrice <= maxPrice);
                if (isNameOk && isPriceOk) {
                    const newCount = acceptedCount + 1;
                    const newTotalSpent = totalSpent + itemPrice;
                    await GM_setValue(STORAGE_KEY_ACCEPTED_COUNT, newCount);
                    await GM_setValue(STORAGE_KEY_TOTAL_SPENT_ACCEPT, newTotalSpent);
                    statusDiv.textContent = `Aceitando #${newCount}: '${itemName}' (${priceText})...`;
                    spentDiv.textContent = `Gasto Total: ${newTotalSpent} M$`;
                    foundItemToAccept = true;
                    let acceptButton = paragraph.querySelector('input[value="Comprar e pagar pela entrega"]') || paragraph.querySelector('input[id*="btnAccept"]') || paragraph.querySelector('input[name*="btnAccept"]') || paragraph.querySelector('input[type="submit"]:not([value="Rejeitar"])');
                    if (!acceptButton) { console.log("Botão de aceitar não encontrado para este item"); continue; }
                    await new Promise(resolve => setTimeout(resolve, BASE_DELAY_MS));
                    if (!await GM_getValue(STORAGE_KEY_RUNNING_ACCEPT, false)) { console.log("Processo interrompido durante o delay final."); disableAcceptButtons(false); return; }
                    acceptButton.click();
                    break;
                }
            }
            if (!foundItemToAccept) {
                statusDiv.textContent = `Status: Nenhuma outra oferta corresponde. Total aceito: ${acceptedCount}. Gasto: ${totalSpent} M$. Concluído!`;
                await stopBulkAccept();
            }
        }

        async function checkAcceptStateOnLoad() {
            createAcceptUI();
            if (await GM_getValue(STORAGE_KEY_RUNNING_ACCEPT, false)) {
                disableAcceptButtons(true);
                const acceptedCount = await GM_getValue(STORAGE_KEY_ACCEPTED_COUNT, 0);
                const totalSpent = await GM_getValue(STORAGE_KEY_TOTAL_SPENT_ACCEPT, 0);
                document.getElementById('bulkAcceptStatusScript').textContent = `Status: Recarregado, continuando... Total aceito: ${acceptedCount}`;
                document.getElementById('bulkAcceptSpentScript').textContent = `Gasto Total: ${totalSpent} M$`;
                await new Promise(resolve => setTimeout(resolve, 500));
                await processNextAccept();
            } else {
                disableAcceptButtons(false);
            }
        }
        checkAcceptStateOnLoad();
    }

    // =================================================================================
    // --- ESTILOS GLOBAIS PARA A UI ---
    // =================================================================================
    function addGlobalStyles() {
        if (!document.querySelector('link[href*="font-awesome"]')) {
            const fontAwesomeLink = document.createElement('link');
            fontAwesomeLink.rel = 'stylesheet';
            fontAwesomeLink.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css';
            document.head.appendChild(fontAwesomeLink);
        }
        GM_addStyle(`
            .bulk-helper-wrapper { margin-bottom: 20px; }
            .panel-header { border-bottom: 1px solid #EEE; padding-bottom: 4px; margin-bottom: 10px; }
            .panel-header h2 { font-size: 1em; font-weight: normal; margin: 0; color: #000; display: flex; align-items: center; }
            .panel-header h2 i { margin-right: 8px; color: #555; }
            .automation-panel-compact { background-color: #f0f0f0; border: 1px solid #dcdcdc; border-radius: 6px; padding: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.08); font-family: Arial, sans-serif; font-size: 13px; }
            .config-container { display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 10px; margin-bottom: 12px; }
            .config-item-full { grid-column: 1 / -1; }
            .config-item label { display: block; font-weight: bold; margin-bottom: 4px; font-size: 11px; color: #555; }
            .config-item input[type="number"], .config-item input[type="text"] { width: 100%; padding: 6px; border: 1px solid #ccc; border-radius: 4px; box-sizing: border-box; }
            .action-buttons { display: flex; gap: 8px; margin-bottom: 10px; }
            .action-buttons button { display: inline-flex; align-items: center; justify-content: center; flex-grow: 1; padding: 6px 12px; border: 1px solid #555; border-radius: 4px; font-weight: bold; font-size: 12px; cursor: pointer; transition: all 0.2s; color: #333; text-shadow: 1px 1px 1px #fff; }
            .action-buttons button:hover:not(:disabled) { border-color: #333; }
            .action-buttons button:disabled { background: #e9ecef !important; border-color: #ccc !important; color: #999 !important; cursor: not-allowed; opacity: 0.7; }
            .action-buttons button i { margin-right: 6px; }
            .btn-start { background: linear-gradient(to bottom, #d4edda, #c3e6cb); border-color: #28a745; }
            .btn-start:hover:not(:disabled) { background: linear-gradient(to bottom, #c3e6cb, #b1dfbb); }
            .btn-stop { background: linear-gradient(to bottom, #f8d7da, #f5c6cb); border-color: #dc3545; }
            .btn-stop:hover:not(:disabled) { background: linear-gradient(to bottom, #f5c6cb, #f1b0b7); }
            .status-display { font-size: 12px; text-align: center; background-color: #e9ecef; padding: 6px; border-radius: 4px; margin-bottom: 5px; font-weight: 500; color: #495057; }
            .spent-display { font-size: 12px; text-align: center; background-color: #d1fae5; padding: 6px; border-radius: 4px; font-weight: 500; color: #065f46; }
            #mr_hideoffere_item_checkbox { margin-right: 5px; }
            #mr_hideoffere_item_checkbox + label { font-weight: normal; color: #333; font-size: 12px; }
        `);
    }

    // Inicia o script
    initializeScript();
})();
