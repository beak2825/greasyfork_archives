// ==UserScript==
// @name         BaseLinker Cardboard
// @namespace    http://tampermonkey.net/
// @version      1.4.8
// @description  BaseLinker Custom PickPack
// @author       Smerechuk
// @match        https://panel.baselinker.com/orders*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=baselinker.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/507650/BaseLinker%20Cardboard.user.js
// @updateURL https://update.greasyfork.org/scripts/507650/BaseLinker%20Cardboard.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const JSBARCODE_URL = 'https://cdn.jsdelivr.net/npm/jsbarcode@3.11.6/dist/JsBarcode.all.min.js';
    const MODAL_STYLES = `#cardboard_button { margin-left: 5px; } .cardboard-row-selected { background-color: rgba(40, 167, 69, 0.2) !important; } .cardboard-cursor-pointer { cursor: pointer; }`;

    const style = document.createElement('style');
    style.textContent = MODAL_STYLES;
    document.head.appendChild(style);

    async function loadJsBarcode() {
        if (window.JsBarcode) return;
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = JSBARCODE_URL;
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }

    function addCardboardButton() {
        const container = $('#pick_pack_buttons_container');
        if (container.length && $('#cardboard_button').length === 0) {
            container.append(`
                <button id="cardboard_button" class="pick_pack_btn_container btn btn-lg btn-labeled btn-primary">
                    <span class="btn-label icon fal fa-box"></span>
                    Kartony
                </button>
            `);

            $('#cardboard_button').on('click', async function(e) {
                e.preventDefault();
                await loadJsBarcode();
                window.cardboardModal();
            });
        }
    }

    function updateCardboardInfo() {
        if (typeof getCurrentPickPackSaleId === 'undefined' || typeof getSaleTab === 'undefined') return;

        try {
            const saleId = getCurrentPickPackSaleId();
            if (!saleId) return;

            const $existingCanvas = $('#pick_pack_3d_box_canvas canvas');
            const containerRenderedId = $('#pick_pack_3d_box_canvas').attr('data-rendered-id');

            if ($existingCanvas.length > 0 && containerRenderedId == saleId) {
                return;
            }

            const saleTab = getSaleTab(saleId);
            const saleInfo = getTabSaleInfo(saleTab);

            if (!saleInfo) return;
            if (!saleInfo.cardboard_info) return;

            let cardboardMatchInfo = null;
            if (typeof Result !== 'undefined') {
                const result = new Result(saleInfo.cardboard_info);
                if (result.IsSuccess) {
                    cardboardMatchInfo = JSON.parse(result.Val);
                }
            }

            if (cardboardMatchInfo && cardboardMatchInfo.items.length === 1) {
                const item = cardboardMatchInfo.items[0];
                const sizeX = item.size_x;
                const sizeY = item.size_y;
                const sizeZ = item.size_z;

                const $cardboardName = $('#pick_pack_sale_cardboard_name');
                if ($cardboardName.length) {
                    const dimensions = `${sizeZ*10} x ${sizeX*10} x ${sizeY*10}`;
                    $cardboardName.html(`Produkt: <span style="font-size: 14px; font-weight: bold;">${dimensions}</span>`);
                }

                if (typeof prepareCardboardAnimationContainer === 'function') {
                    prepareCardboardAnimationContainer();

                    if (!$('#pick_pack_sales_cardboard_full_info_container').is(':visible')) {
                        if(typeof showCardboardFullInfo === 'function') {
                            localStorage.setItem('pick_pack_cardboards_info_expanded', '1');
                            showCardboardFullInfo(true);
                        }
                    }

                    setTimeout(function() {
                        if (getCurrentPickPackSaleId() != saleId) return;
                        if ($('#pick_pack_3d_box_canvas canvas').length > 0 && $('#pick_pack_3d_box_canvas').attr('data-rendered-id') == saleId) return;

                        prepareCardboardAnimationContainer();

                        if(typeof render3dBoxInCanvas === 'function') {
                            $('#pick_pack_3d_box_canvas').attr('data-rendered-id', saleId);

                            render3dBoxInCanvas('pick_pack_3d_box_canvas', {
                                cardboard_id: 0,
                                size_x: sizeX,
                                size_y: sizeY,
                                size_z: sizeZ
                            }, cardboardMatchInfo.items);
                        }
                    }, 100);
                }
            }
        } catch (e) {
            console.error("Cardboard script error:", e);
        }
    }

    window.cardboardModal = function() {
        let html = `
            <table id="cardboardTable" class="table table-bordered table-hover">
                <thead>
                    <tr>
                        <th></th>
                        <th class="text-center">Zamówienie</th>
                        <th>Produkty</th>
                        <th class="text-center">Rozmiar</th>
                    </tr>
                </thead>
                <tbody>
        `;

        const saleIds = getPickPackSelectedSaleIds();

        saleIds.forEach(saleId => {
            const saleTab = getSaleTab(saleId);
            const saleInfo = getTabSaleInfo(saleTab);

            let cardboardCheck = false;
            let pickPackState = getSaleItemsPickPackState(saleId) == '1';
            let cardboardIs = false;
            let cardboardOneItems = false;
            let cardboardName = '';
            let cardboardSize = [];
            let cardboardBarcode = '';

            if (typeof Result !== 'undefined' && saleInfo && saleInfo['cardboard_info']) {
                const result = new Result(saleInfo.cardboard_info);
                if (result.IsSuccess) {
                    cardboardIs = true;
                    const matchInfo = JSON.parse(result.Val);

                    if (matchInfo.items.length === 1) {
                        if (!pickPackState) cardboardCheck = true;
                        cardboardOneItems = true;
                        if(saleInfo['products_data'] && saleInfo['products_data'][0]) {
                            cardboardName = saleInfo['products_data'][0]['name'];
                            cardboardBarcode = saleInfo['products_data'][0]['ean'];
                        }
                        const item = matchInfo.items[0];
                        cardboardSize = [item.size_z * 10, item.size_x * 10, item.size_y * 10];
                        cardboardSize.sort((a, b) => b - a);
                    } else {
                        const c = matchInfo.cardboard;
                        cardboardName = "Karton ID: " + c.cardboard_id;
                        cardboardBarcode = "box_" + c.cardboard_id;
                        cardboardSize = [c.size_z * 10, c.size_x * 10, c.size_y * 10];
                    }
                }
            }

            const rowValue = JSON.stringify({
                id: saleId,
                name: cardboardName.replace(/["']/g, ''),
                size: cardboardSize,
                barcode: cardboardBarcode
            }).replace(/"/g, '&quot;');

            html += `
                <tr value="${rowValue}" class="${cardboardCheck ? 'cardboard-row-selected' : ''}">
                    <td class="text-center align-top" ${cardboardIs ? 'style="cursor: pointer;" onclick="toggleRow(this, event)"' : ''}>
                        <input role="button" type="checkbox" ${cardboardCheck ? 'checked' : ''} ${cardboardIs ? '' : 'disabled'}>
                    </td>
                    <td class="text-center align-top">
                        <div style="margin-bottom: 5px;">
                            <a href="?#order:${saleId}" target="_blank">${saleId}</a>
                        </div>
                        <span class="label label-${pickPackState ? 'success' : 'warning'}">
                            ${pickPackState ? 'Spakowano' : 'Do pakowania'}
                        </span>
                    </td>
                    <td>
                        <table><tbody>`;

            if(saleInfo && saleInfo['products_data']) {
                saleInfo['products_data'].forEach(p => {
                    html += `
                        <tr>
                            <td><img src="${p.thumbUrl}" alt="Product image" style="max-width:50px; max-height:50px;"></td>
                            <td>
                                <div style="font-weight: 600; margin-bottom: 8px;">${p.quantity} x ${p.name}</div>
                                <div>ID: <a href="inventory_products.php?display_product=${p.product_id}" target="_blank">${p.product_id}</a> | SKU: ${p.sku} | EAN: ${p.ean}</div>
                            </td>
                        </tr>`;
                });
            }

            html += `   </tbody></table>
                    </td>
                    <td class="text-center align-top">`;

            if (cardboardIs) {
                html += `
                    <p style="font-weight: 600; margin-bottom: 5px; white-space: nowrap;">
                        ${cardboardSize[0]} x ${cardboardSize[1]} x ${cardboardSize[2]}
                    </p>
                    <span style="cursor: pointer;" class="label label-${cardboardOneItems ? 'primary' : 'danger'}" onclick="selectSaleById(${saleId})">
                        ${cardboardOneItems ? 'Produkt' : cardboardName}
                    </span>`;
            }

            html += `</td></tr>`;
        });

        html += `</tbody></table>`;

        window.toggleRow = function(td, event) {
            const tr = td.closest('tr');
            const checkbox = tr.querySelector('input[type="checkbox"]');

            if (!checkbox || checkbox.disabled) return;

            if (event && event.target !== checkbox) {
                checkbox.checked = !checkbox.checked;
            }

            if (checkbox.checked) {
                tr.classList.add('cardboard-row-selected');
            } else {
                tr.classList.remove('cardboard-row-selected');
            }
        };

        const footer = `
            <div class="row">
                <div class="col-sm-6 text-left">
                    <fieldset class="float-labels-blocked">
                        <div class="form-group col-sm-5">
                            <label>Typ</label>
                            <div class="double px-controls-group px-hidden-controls">
                                <div class="px-control">
                                    <label>
                                        <input class="px" type="radio" value="standard" name="pdf_type" checked>
                                        <span class="lbl">Standard</span>
                                    </label>
                                </div>
                                <div class="px-control">
                                    <label>
                                        <input class="px" type="radio" name="pdf_type" value="compact">
                                        <span class="lbl">Kompakt</span>
                                    </label>
                                </div>
                            </div>
                        </div>
                        <div class="form-group col-sm-5">
                            <label>Rozmiar (mm)</label>
                            <div class="px-controls-group">
                                <div class="px-control">
                                    <label>
                                        <input id="addSizeCheckbox" type="checkbox" class="px" checked>
                                        <span class="lbl">Dodaj</span>
                                    </label>
                                </div>
                                <div class="px-control col-sm-5">
                                    <label>
                                        <input id="sizeInput" type="number" class="form-control" style="height: 100%;" value="3" min="1" max="10">
                                    </label>
                                </div>
                            </div>
                        </div>
                    </fieldset>
                </div>
                <div class="col-sm-6 text-right">
                    <button type="button" class="btn btn-default" data-dismiss="modal">Anuluj</button>
                    <button type="button" class="btn btn-primary" id="btn-print-cardboards" data-dismiss="modal" onclick="getCardboardData()">Pobierz (Enter)</button>
                </div>
            </div>
        `;

        const button = `
            <button type="button" class="close rds-close" data-dismiss="modal">
                <span aria-hidden="true"><i class="fal fa-times icon-md"></i></span>
            </button>
        `;

        ModalBL.modal('cardboard_modal', 'Kartony', html, footer, button, 'modal-lg');

        setTimeout(() => {
            const input = document.getElementById('sizeInput');
            if (input) input.focus();

            const modalElement = document.getElementById('cardboard_modal');
            if (modalElement) {
                modalElement.addEventListener('keydown', function(e) {
                    if (e.key === 'Enter') {
                        e.preventDefault();
                        document.getElementById('btn-print-cardboards').click();
                    }
                });
            }
        }, 300);
    };

    window.getCardboardData = function() {
        const station = $('.pack_station_info').text();
        const pdfType = $('input[name="pdf_type"]:checked').val();
        const addSizeChecked = $('#addSizeCheckbox').is(':checked');
        const sizeValue = addSizeChecked ? Number($('#sizeInput').val()) : 0;
        const data = [];

        $('#cardboardTable input[type="checkbox"]:checked').each(function() {
            const row = $(this).closest('tr');
            const valStr = row.attr('value');
            if(valStr) {
                const value = JSON.parse(valStr);
                data.push({
                    id: value.id,
                    name: value.name,
                    size: value.size,
                    barcode: value.barcode
                });
            }
        });

        if (data.length > 0) {
            cardboardPDF(station, data, pdfType, sizeValue);
        }
    };

    function generateBarcode(value) {
        if (!window.JsBarcode) return null;
        const canvas = document.createElement('canvas');
        try {
            JsBarcode(canvas, value, {
                format: "CODE128",
                displayValue: true,
                fontSize: 28
            });
            return canvas.toDataURL("image/png");
        } catch(e) {
            return null;
        }
    }

    function cardboardPDF(station, data, type, size) {
        let html = '';
        let counter = 0;

        const PRINT_STYLES = `
            @media print {
                @page { size: 105mm 148mm; margin: -5mm 0 -5mm 0; }
                body { width: 100mm; margin: auto; font-family: sans-serif; }
            }
            body { font-family: sans-serif; margin: 0; padding: 20px; }
            table { width: 100%; border-collapse: collapse; border-spacing: 0; background-color: white; color: black; }
            td { border: 1px solid black; padding: 5px; text-align: center; }
            h4 { text-align: center; margin-bottom: 10px; color: black; }
            img { display: block; margin: 0 auto; }
            .no-wrap { white-space: nowrap; }
            .name-cell { text-align: left; font-size: 12px; }
            .barcode-cell { height: 99px; width: 160px; }
            .compact-row { height: 29px; }
            .page-break { page-break-after: always; }
        `;

        data.forEach((item, index) => {
            let threshold = type === "compact" ? 19 : 5;

            if (counter % threshold === 0) {
                if (counter > 0) {
                    html += '</tbody></table><div class="page-break"></div>';
                }
                html += `
                    <h4>${station}</h4>
                    <table>
                        <tbody>
                `;
            }

            const sizeText = `${item.size[0] + size} x ${item.size[1] + size} x ${item.size[2] + size}`;
            const barcodeImg = item.barcode ? generateBarcode(item.barcode) : null;
            const barcodeHtml = barcodeImg ? `<img style="height: 100%; width: 100%;" src="${barcodeImg}">` : '<p>brak</p>';

            if (type === "compact") {
                html += `
                    <tr class="compact-row">
                        <td>${item.id}</td>
                        <td class="no-wrap">${sizeText}</td>
                        <td>${item.barcode || 'brak'}</td>
                    </tr>
                `;
            } else {
                const nameText = item.name.length > 80 ? item.name.substring(0, 75) + '...' : item.name;
                html += `
                    <tr>
                        <td>${item.id}</td>
                        <td class="no-wrap">${sizeText}</td>
                        <td rowspan="2" class="barcode-cell">
                            ${barcodeHtml}
                        </td>
                    </tr>
                    <tr>
                        <td class="name-cell" colspan="2">${nameText}</td>
                    </tr>
                `;
            }

            counter++;
            if (index === data.length - 1) html += '</tbody></table>';
        });

        const iframe = document.createElement('iframe');
        Object.assign(iframe.style, {
            position: 'fixed', right: '0', bottom: '0', width: '0', height: '0', border: '0'
        });
        document.body.appendChild(iframe);

        const doc = iframe.contentWindow.document;
        doc.open();
        doc.write(`<html><head><title>Print</title><style>${PRINT_STYLES}</style></head><body>${html}</body></html>`);
        doc.close();

        iframe.onload = function() {
            setTimeout(() => {
                try {
                    iframe.contentWindow.focus();
                    iframe.contentWindow.print();
                } catch (e) { console.error(e); }

                setTimeout(() => { document.body.removeChild(iframe); }, 3000);
            }, 500);
        };
    }

    const buttonObserver = new MutationObserver((mutations) => {
        let shouldAddButton = false;
        mutations.forEach(m => {
            if (m.type === 'childList') {
                if (m.target.id === 'pick_pack_buttons_container' || (m.target.id && m.target.id.includes('pick_pack'))) {
                    shouldAddButton = true;
                }
                for(let node of m.addedNodes) {
                    if (node.nodeType === 1 && (node.id === 'pick_pack_buttons_container' || node.querySelector?.('#pick_pack_buttons_container'))) {
                        shouldAddButton = true;
                        break;
                    }
                }
            }
        });
        if (shouldAddButton) {
            addCardboardButton();
        }
    });

    let debounceTimer;
    const tabObserver = new MutationObserver((mutations) => {
        let shouldUpdateInfo = false;
        mutations.forEach(m => {
            if (m.type === 'attributes' && m.attributeName === 'class') {
                if (m.target.classList.contains('sale_tab_active')) {
                    shouldUpdateInfo = true;
                }
            }
        });

        if (shouldUpdateInfo) {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => {
                updateCardboardInfo();
            }, 100);
        }
    });

    buttonObserver.observe(document.body, { childList: true, subtree: true });
    tabObserver.observe(document.body, { attributes: true, subtree: true, attributeFilter: ['class'] });

    setTimeout(() => {
        addCardboardButton();
        updateCardboardInfo();
    }, 500);

})();