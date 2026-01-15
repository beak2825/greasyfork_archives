// ==UserScript==
// @name         CELMAN_BaseLinker
// @namespace    http://tampermonkey.net/
// @version      1.4.0
// @description  Baselinker: Optima buttons control, Couriers buttons, Other
// @author       Smerechuk
// @match        https://panel.baselinker.com/orders*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=baselinker.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/480279/CELMAN_BaseLinker.user.js
// @updateURL https://update.greasyfork.org/scripts/480279/CELMAN_BaseLinker.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const BUTTON_IDS = {
        doOptimy: '40223',
        usunRO: '40511',
        wystawFS: '39900',
        wgrajPdf: '41743',
        wystawKorekte: '40225'
    };

    const style = document.createElement('style');
    style.textContent = `
        #oms_info_admin_comments, td.orders-extra-td { white-space: pre-wrap !important; max-width: 100%; }
        #panel1, td[data-tid="orderDate"] { padding-right: 10px !important; }
        .celman-alert-text, .celman-alert-label { color: red !important; font-weight: bold; }
        .hidden-receipt-row { display: none !important; }
    `;
    document.head.appendChild(style);

    function handleOptimaButtons() {
        const extraField1 = document.getElementById("oms_info_extra_field_1");
        if (!extraField1) return;

        const confirmButton = document.querySelector('button[data-bb-handler="confirm"]');
        if (confirmButton && !confirmButton.dataset.listenerAdded) {
            confirmButton.addEventListener('click', () => {
                setTimeout(() => {
                    const confirmAction = document.querySelector(".growl-error");
                    const confirmOrderButton = document.querySelector('a[onclick^="confirmOrder"]');
                    if (!confirmAction && confirmOrderButton) confirmOrderButton.style.display = "none";
                }, 250);
            });
            confirmButton.dataset.listenerAdded = "true";
        }

        const confirmOrderButton = document.querySelector('a[onclick^="confirmOrder"]');
        if (confirmOrderButton && confirmOrderButton.style.display !== "none" && confirmOrderButton.offsetParent !== null) {
            toggleButtons(true, Object.values(BUTTON_IDS));
            return;
        }

        const roText = extraField1.innerText || "";
        const roPattern = /RO\/\d+\/\d{4}/.test(roText);
        const invoiceLink = document.querySelector('#invoice_text a[href^="/download/invoice.php"]');

        if (roPattern) {
            toggleButtons(true, [BUTTON_IDS.doOptimy]);
            if (invoiceLink) {
                toggleButtons(true, [BUTTON_IDS.usunRO, BUTTON_IDS.wystawFS, BUTTON_IDS.wgrajPdf]);
                toggleButtons(false, [BUTTON_IDS.wystawKorekte]);
            } else {
                toggleButtons(false, [BUTTON_IDS.usunRO, BUTTON_IDS.wystawFS, BUTTON_IDS.wgrajPdf]);
                toggleButtons(true, [BUTTON_IDS.wystawKorekte]);
            }
        } else {
            toggleButtons(false, [BUTTON_IDS.doOptimy]);
            toggleButtons(true, [BUTTON_IDS.usunRO, BUTTON_IDS.wystawFS, BUTTON_IDS.wgrajPdf, BUTTON_IDS.wystawKorekte]);
        }
    }

    function toggleButtons(disable, idsToToggle) {
        idsToToggle.forEach(id => {
            const btn = document.querySelector(`.btn_personal_trigger_${id}`);
            if (btn) {
                btn.style.opacity = disable ? "0.5" : "1";
                btn.style.pointerEvents = disable ? "none" : "auto";
                btn.style.cursor = disable ? "not-allowed" : "pointer";
                disable ? btn.setAttribute("disabled", "true") : btn.removeAttribute("disabled");
            }
        });
    }

    function injectCustomButtons() {
        const statusRow = document.getElementById("sale_fulfillment_status_row");
        const container = document.getElementById('personal_macro_triggers_container');

        if (statusRow && container && !container.dataset.buttonsAdded) {
            statusRow.insertAdjacentHTML('afterend', `
                <tr><td></td><td><div class="btn-group-sm mt-2">
                    <button class="btn btn-success" onclick="triggerMacro('40542')" type="button"><i class="far fa-check"></i> Zrealizuj zamówienie</button>
                    <button class="btn btn-warning" onclick="triggerMacro('41031')" type="button"><i class="far fa-times"></i> Anuluj zamówienie</button>
                </div></td></tr>`);
            container.dataset.buttonsAdded = "true";
        }

        const infoPanel = document.getElementById('pnl_order_info');
        if (infoPanel && !infoPanel.dataset.buttonAdded) {
            const headingControls = infoPanel.querySelector(".panel-heading-controls div");
            if (headingControls) {
                headingControls.insertAdjacentHTML('afterbegin', `
                    <button class="btn btn_pickpack" onclick="findSimilarOrders()" type="button" style="margin-right: 5px;">
                        <i class="fa fa-search icon-sm"></i> Podobne zamówienia
                    </button>`);
                infoPanel.dataset.buttonAdded = "true";
            }
        }

        const searchDate = document.getElementById("search_start_date");
        if (searchDate && !searchDate.dataset.changedDate && searchDate.value) {
            const p = searchDate.value.split(".");
            if (p.length === 3) {
                const d = new Date(p[2], p[1] - 1, p[0]);
                d.setMonth(d.getMonth() - 3);
                searchDate.value = ("0" + d.getDate()).slice(-2) + "." + ("0" + (d.getMonth() + 1)).slice(-2) + "." + d.getFullYear();
                searchDate.dataset.changedDate = "true";
            }
        }
    }

    function visualTweaks() {
        document.querySelectorAll(".order-actions tr").forEach(row => {
            if (row.textContent.includes("Paragon:") && !row.classList.contains('hidden-receipt-row')) {
                row.classList.add('hidden-receipt-row');
            }
        });

        const qtyTd = document.querySelector('td[data-tid="productQuantity"]');
        if (qtyTd && qtyTd.innerText.trim().startsWith('0')) qtyTd.classList.add('celman-alert-text');

        ['oms_info_extra_field_39786', 'oms_info_extra_field_40000', 'oms_info_extra_field_39703'].forEach(id => {
            const el = document.getElementById(id);
            const row = el?.closest('tr');
            if (row) {
                const label = row.getElementsByTagName('td')[0];
                const text = el.innerText.trim();
                (text === '...' || text === '') ? label.classList.add('celman-alert-label') : label.classList.remove('celman-alert-label');
            }
        });
    }

    function calculateTotalWeight() {
        if (typeof $ === 'undefined') return;

        let totalSum = 0;
        $('input[name="weight[]"]').each(function() {
            let val = $(this).val().replace(',', '.');
            let number = parseFloat(val);
            if (!isNaN(number)) {
                totalSum += number;
            }
        });

        const displayEl = $('#total-package-weight');
        if (displayEl.length) {
            displayEl.text('Łączna waga: ' + totalSum.toFixed(2) + ' kg');
        }
    }

    function initWeightListeners() {
        if (document.body.dataset.weightListenersAdded === "true") return;
        if (typeof $ === 'undefined') return;

        $(document).on('keyup change paste', 'input[name="weight[]"]', function() {
            calculateTotalWeight();
        });

        $(document).on('click', '.add_subpackage_btn, .btn i.fa-times', function() {
            setTimeout(calculateTotalWeight, 150);
        });

        $(document).on('click', '.btn[onclick*="courierSubpackageDelete"]', function() {
            setTimeout(calculateTotalWeight, 150);
        });

        document.body.dataset.weightListenersAdded = "true";
    }

    function handleWeightWidget() {
        const addBtn = document.querySelector('.add_subpackage_btn');
        if (!addBtn) return;

        if (!document.getElementById('total-package-weight')) {
            const widgetDiv = document.createElement('div');
            widgetDiv.id = 'total-package-weight';
            widgetDiv.classList = 'label lbl-red disabled';
            widgetDiv.textContent = 'Łączna waga: 0.00 kg';

            addBtn.parentElement.appendChild(widgetDiv);

            calculateTotalWeight();
        }
    }

    setTimeout(initWeightListeners, 500);

    const observer = new MutationObserver(() => {
        clearTimeout(window.celmanTimeout);
        window.celmanTimeout = setTimeout(() => {
            handleOptimaButtons();
            injectCustomButtons();
            visualTweaks();

            handleWeightWidget();
        }, 150);
    });

    observer.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['class', 'style'] });

    handleOptimaButtons();
    injectCustomButtons();
    visualTweaks();
    handleWeightWidget();

})();