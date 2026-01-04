// ==UserScript==
// @name         Copy Ref-Inv + Payee Link for Vendor Payments Submit
// @namespace    https://openai.com
// @version      1.3
// @description  Adds copy buttons and clickable Payee links in vendor payments submit table
// @match        https://imos.churchofjesuschrist.org/payments/*
// @grant        GM_setClipboard
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/544183/Copy%20Ref-Inv%20%2B%20Payee%20Link%20for%20Vendor%20Payments%20Submit.user.js
// @updateURL https://update.greasyfork.org/scripts/544183/Copy%20Ref-Inv%20%2B%20Payee%20Link%20for%20Vendor%20Payments%20Submit.meta.js
// ==/UserScript==

(function () {
    'use strict';

    console.log('[Copy Ref-Inv] Script loaded');

    function processTable() {
        const table = document.getElementById('vendor-payments-table');
        if (!table) {
            console.log('[Copy Ref-Inv] vendor-payments-table not found.');
            return;
        }

        console.log('[Copy Ref-Inv] Processing vendor-payments-table...');

        // Add header if not yet present
        const headerRow = table.querySelector('thead tr');
        if (headerRow && !headerRow.querySelector('.imos-thead-directive-th-wrapper-copy')) {
            const th = document.createElement('th');
            th.className = 'ng-scope imos-thead-directive-th-wrapper-copy';

            const labelDiv = document.createElement('div');
            labelDiv.className = 'field-label current-sorted-column';
            labelDiv.textContent = 'Copy Ref - Inv';

            th.appendChild(labelDiv);
            headerRow.appendChild(th);
            console.log('[Copy Ref-Inv] Header added.');
        }

        const tbodies = table.querySelectorAll('tbody.qa-id-');
        tbodies.forEach((tbody, index) => {
            const row = tbody.querySelector('tr.first-line');
            if (!row) return;

            // Skip if already processed
            if (row.querySelector('.copy-cell')) {
                console.log(`[Copy Ref-Inv] Row ${index} already processed.`);
                return;
            }

            // === COPY BUTTON ===
            const refCell = row.querySelector('td.col-reference-number a');
            const invCell = row.querySelector('td:nth-child(6) span'); // 6th column: Invoice #

            const ref = refCell?.innerText.trim();
            const invoice = invCell?.innerText.trim();

            if (!ref || !invoice) {
                console.log(`[Copy Ref-Inv] Row ${index} missing ref/invoice.`);
                return;
            }

            const toCopy = `${ref} - ${invoice}`;
            console.log(`[Copy Ref-Inv] Row ${index}: "${toCopy}"`);

            const td = document.createElement('td');
            td.className = 'copy-cell';

            const btn = document.createElement('button');
            btn.innerText = 'Copy';
            btn.title = `Copy "${toCopy}"`;
            btn.style.cursor = 'pointer';
            btn.style.padding = '2px 6px';
            btn.style.border = '1px solid #ccc';
            btn.style.borderRadius = '4px';
            btn.style.background = '#f0f0f0';
            btn.style.fontSize = '13px';

            btn.onclick = () => {
                GM_setClipboard(toCopy);
                console.log(`[Copy Ref-Inv] Copied: "${toCopy}"`);
                btn.textContent = '✅';
                setTimeout(() => btn.textContent = 'Copy', 1200);
            };

            td.appendChild(btn);
            row.appendChild(td);

            // === PAYEE LINK ===
            const payeeCell = row.querySelector('td.col-payee');
            const nameSpan = payeeCell?.querySelector('.payee-display-name');
            const vendorSpan = payeeCell?.querySelector('.payee-vendor-id');

            if (nameSpan && vendorSpan) {
                const name = nameSpan.textContent.trim();
                const idMatch = vendorSpan.textContent.match(/\((\d+)\)/);
                if (idMatch) {
                    const vendorId = idMatch[1];
                    const link = document.createElement('a');
                    link.href = `https://imos.churchofjesuschrist.org/vendor-management/#!/payment-history/vendor/${vendorId}-01-1`;
                    link.textContent = name;
                    link.target = '_blank';
                    link.style.textDecoration = 'underline';

                    // Replace nameSpan with link
                    nameSpan.replaceWith(link);
                }
            }
        });
    }

    // === Monkey Button ===
    function addFloatingButton() {
        if (document.querySelector('#copy-monkey-button')) return;

        const btn = document.createElement('button');
        btn.id = 'copy-monkey-button';
        btn.textContent = '🐒';
        btn.title = 'Click to add Copy buttons';
        btn.style.position = 'fixed';
        btn.style.bottom = '20px';
        btn.style.right = '20px';
        btn.style.width = '48px';
        btn.style.height = '48px';
        btn.style.borderRadius = '50%';
        btn.style.border = 'none';
        btn.style.background = '#0091bc';
        btn.style.color = 'white';
        btn.style.fontSize = '24px';
        btn.style.boxShadow = '0 2px 6px rgba(0,0,0,0.3)';
        btn.style.zIndex = '9999';
        btn.style.cursor = 'pointer';

        const style = document.createElement('style');
        style.textContent = `
            @keyframes monkey-jump-spin {
                0% { transform: translateY(0) rotate(0deg); }
                30% { transform: translateY(-100px) rotate(180deg); }
                60% { transform: translateY(0) rotate(360deg); }
                100% { transform: translateY(0) rotate(360deg); }
            }
            #copy-monkey-button.animate {
                animation: monkey-jump-spin 0.9s ease-in-out;
            }
        `;
        document.head.appendChild(style);

        btn.onclick = () => {
            console.log('[Copy Ref-Inv] 🐒 Button clicked!');
            btn.classList.remove('animate');
            void btn.offsetWidth;
            btn.classList.add('animate');
            processTable();
        };

        document.body.appendChild(btn);
    }

    // === Keyboard Shortcut ===
    document.addEventListener('keydown', function (e) {
        if (e.ctrlKey && e.key.toLowerCase() === 'm') {
            e.preventDefault();
            console.log('[Copy Ref-Inv] Ctrl+M pressed!');
            processTable();
        }
    });

    // Run on page load
    window.addEventListener('load', () => {
        addFloatingButton();
    });
})();
