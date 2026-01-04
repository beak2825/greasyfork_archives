// ==UserScript==
// @name         M-Pesa CSV Extractor
// @namespace    https://openai.com
// @version      1.7
// @description  Extracts M-Pesa messages into a CSV of transactions
// @match        https://messages.google.com/web/*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/544746/M-Pesa%20CSV%20Extractor.user.js
// @updateURL https://update.greasyfork.org/scripts/544746/M-Pesa%20CSV%20Extractor.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function createFloatingButton() {
        const btn = document.createElement('button');
        btn.id = 'mpesa-monkey-button';
        btn.textContent = '🐒';
        btn.title = 'Save M-Pesa Transactions';
        Object.assign(btn.style, {
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            border: 'none',
            background: '#1a73e8',
            color: 'white',
            fontSize: '24px',
            boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
            zIndex: '9999',
            cursor: 'pointer'
        });

        const style = document.createElement('style');
        style.textContent = `
            @keyframes mpesa-jump {
                0% { transform: translateY(0); }
                50% { transform: translateY(-10px); }
                100% { transform: translateY(0); }
            }
        `;
        document.head.appendChild(style);

        btn.onclick = () => {
            btn.style.animation = 'mpesa-jump 0.4s ease';
            setTimeout(() => btn.style.animation = '', 400);
            openDateModal();
        };

        document.body.appendChild(btn);
    }

    function openDateModal() {
        const existing = document.getElementById('mpesa-modal');
        if (existing) existing.remove();

        const modal = document.createElement('div');
        modal.id = 'mpesa-modal';
        Object.assign(modal.style, {
            position: 'fixed',
            top: '0', left: '0', right: '0', bottom: '0',
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: '10000'
        });

        const content = document.createElement('div');
        Object.assign(content.style, {
            background: 'white',
            padding: '20px',
            borderRadius: '8px',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            maxWidth: '300px'
        });

        const title = document.createElement('h3');
        title.textContent = 'Select start date';

        const reminder = document.createElement('p');
        reminder.style.fontSize = '12px';
        reminder.style.color = '#666';
        reminder.textContent = 'Reminder: Scroll to load all messages before extracting.';

        const input = document.createElement('input');
        input.type = 'date';
        input.id = 'mpesa-date';

        const buttons = document.createElement('div');
        buttons.style.display = 'flex';
        buttons.style.justifyContent = 'space-between';
        buttons.style.gap = '10px';

        const submit = document.createElement('button');
        submit.textContent = 'Extract';
        submit.onclick = () => {
            const dateValue = input.value;
            modal.remove();
            if (dateValue) processMessages(new Date(dateValue));
        };

        const cancel = document.createElement('button');
        cancel.textContent = 'Cancel';
        cancel.onclick = () => modal.remove();

        buttons.appendChild(submit);
        buttons.appendChild(cancel);

        content.appendChild(title);
        content.appendChild(reminder);
        content.appendChild(input);
        content.appendChild(buttons);
        modal.appendChild(content);
        document.body.appendChild(modal);
    }

    function showToast(message) {
        const toast = document.createElement('div');
        toast.textContent = message;
        Object.assign(toast.style, {
            position: 'fixed',
            bottom: '80px',
            right: '20px',
            background: '#333',
            color: '#fff',
            padding: '10px 15px',
            borderRadius: '5px',
            zIndex: '10001',
            fontSize: '14px',
            opacity: '0',
            transition: 'opacity 0.3s ease'
        });

        document.body.appendChild(toast);
        setTimeout(() => toast.style.opacity = '1', 10);
        setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    };

    function normalizeAmount(str) {
        if (!str) return "0.00";
        return parseFloat(str.replace(/,/g, '').replace(/[^\d.]/g, '')).toFixed(2);
    }

    // ** CLEAN PHONE NUMBERS (Remove 258 prefix only) **
    function normalizePhoneNumber(str) {
        if (!str) return "N/A";
        if (str.startsWith('258')) {
            return str.substring(3);
        }
        return str;
    }

    function processMessages(startDate) {
        const rawMessages = Array.from(document.querySelectorAll('mws-text-message-part'))
            .map(el => el.getAttribute('aria-label')?.trim())
            .filter(Boolean);

        const rows = [];

        for (const message of rawMessages) {
            const dateMatch = message.match(/Received on (.+?) at/);
            if (!dateMatch) continue;
            const msgDate = new Date(dateMatch[1]);
            const startOfDay = new Date(startDate);
            startOfDay.setHours(0, 0, 0, 0);
            if (msgDate < startOfDay) continue;


            const reversalMatch = message.match(/.*?factura\s+(\w{11}).*?revertido/i);
            if (reversalMatch) {
                const code = reversalMatch[1];
                const index = rows.findIndex(row => row[1] === code);
                if (index !== -1) rows.splice(index, 1);
                continue;
            }

            const transfer = message.match(
                /Confirmado\s+([A-Z0-9]{11,12})[\s\S]*?Transferiste\s+([\d,]+\.\d{2})MT[\s\S]*?taxa\s+foi\s+de\s+([\d,]+\.\d{2})MT[\s\S]*?para\s+(\d+)[\s\S]*?aos\s+(\d{1,2})\/(\d{1,2})\/(\d{2})[\s\S]*?saldo M-Pesa e de\s+([\d,]+\.\d{2})MT/i
            );
            if (transfer) {
                const [_, code, value, fee, recipient, day, month, year, balance] = transfer;
                const formattedDate = `${day.padStart(2, '0')}/${month.padStart(2, '0')}/20${year}`;
                rows.push([
                    rows.length + 1,
                    code,
                    normalizeAmount(value),
                    formattedDate,
                    normalizeAmount(fee),
                    normalizePhoneNumber(recipient), // remove 258 if present
                    normalizeAmount(balance)
                ]);
                continue;
            }

            const engTransfer = message.match(
                /([A-Z0-9]{11,12})\s+Confirmed\.\s*([\d,]+\.\d{2})MT\s+sent(?:\s+and\s+the\s+fee\s+was\s+([\d,]+\.\d{2})MT)?\s+to\s+(\d+)[\s\S]*?on\s+(\d{1,2})\/(\d{1,2})\/(\d{2})[\s\S]*?New\s+M-Pesa\s+balance\s+is\s+([\d,]+\.\d{2})MT/i
            );
            if (engTransfer) {
                const [_, code, value, fee = '0.00', recipient, day, month, year, balance] = engTransfer;
                const formattedDate = `${day.padStart(2, '0')}/${month.padStart(2, '0')}/20${year}`;
                rows.push([
                    rows.length + 1,
                    code,
                    normalizeAmount(value),
                    formattedDate,
                    normalizeAmount(fee),
                    normalizePhoneNumber(recipient), // remove 258 if present
                    normalizeAmount(balance)
                ]);
                continue;
            }

            const engCompra1 = message.match(
                 /([A-Z0-9]{11,12})\s+Confirmed\.\s*([\d,]+\.\d{2})MT\s+sent(?:\s+and\s+the\s+fee\s+was\s+([\d,]+\.\d{2})MT)?\s+to\s+business\s+(.+?)\s+for\s+account[\s\S]*?on\s+(\d{1,2})\/(\d{1,2})\/(\d{2})[\s\S]*?New\s+M-Pesa\s+balance\s+is\s+([\d,]+\.\d{2})MT/i
            );
            if (engCompra1) {
                const [_, code, value, fee = '0.00', merchantRaw, day, month, year, balance] = engCompra1;
                const merchant = merchantRaw.trim();
                const formattedDate = `${day.padStart(2, '0')}/${month.padStart(2, '0')}/20${year}`;
                rows.push([
                    rows.length + 1,
                    code,
                    normalizeAmount(value),
                    formattedDate,
                    normalizeAmount(fee),
                    merchant,
                    normalizeAmount(balance)
                ]);
                continue;
            }

            const withdraw = message.match(
                /Confirmado\s+([A-Z0-9]{11,12})[\s\S]*?Aos\s+(\d{1,2})\/(\d{1,2})\/(\d{2})[\s\S]*?levantaste\s+([\d,]+\.\d{2})MT[\s\S]*?taxa\s+foi\s+de\s+([\d,]+\.\d{2})MT/i
            );

            if (withdraw) {
                const [_, code, day, month, year, value, fee] = withdraw;
                const formattedDate = `${day.padStart(2, '0')}/${month.padStart(2, '0')}/20${year}`;
                rows.push([
                    rows.length + 1,
                    code,
                    normalizeAmount(value),
                    formattedDate,
                    normalizeAmount(fee)
                ]);
                continue;
            }

            const compra = message.match(
                /Confirmado\s+([A-Z0-9]{11,12})[\s\S]*?operacao de compra[\s\S]*?([\d,]+\.\d{2})MT[\s\S]*?aos\s+(\d{1,2})\/(\d{1,2})\/(\d{2})[\s\S]*?saldo M-Pesa e de\s+([\d,]+\.\d{2})MT/i
            );
            if (compra) {
                const [_, code, value, day, month, year, balance] = compra;
                const formattedDate = `${day.padStart(2, '0')}/${month.padStart(2, '0')}/20${year}`;
                rows.push([
                    rows.length + 1,
                    code,
                    normalizeAmount(value),
                    formattedDate,
                    '0.00',
                    'N/A',
                    normalizeAmount(balance)
                ]);
                continue;
            }

            const compra2 = message.match(
                /Confirmado\s+([A-Z0-9]{11,12})[\s\S]*?Registamos uma compra no valor de\s+([\d,]+\.\d{2})MT[\s\S]*?comerciante\s+(\d+)[\s\S]*?aos\s+(\d{1,2})\/(\d{1,2})\/(\d{2})[\s\S]*?saldo M-Pesa e de\s+([\d,]+\.\d{2})MT/i
            );

            if (compra2) {
                const [_, code, value, merchant, day, month, year, balance] = compra2;
                const formattedDate = `${day.padStart(2, '0')}/${month.padStart(2, '0')}/20${year}`;
                rows.push([
                    rows.length + 1,
                    code,
                    normalizeAmount(value),
                    formattedDate,
                    '0.00',
                    merchant,
                    normalizeAmount(balance)
                ]);
                continue;
            }

            const engCompra2 = message.match(
                /([A-Z0-9]{11,12})\s+Confirmed\.\s*We\s+registered\s+a\s+purchasing\s+operation\s+of\s+([\d,]+\.\d{2})MT\s+to\s+([^0-9]+?)\s+on\s+(\d{1,2})\/(\d{1,2})\/(\d{2})[\s\S]*?balance\s+is\s+([\d,]+\.\d{2})MT/i
            );
            if (engCompra2) {
                const [_, code, value, merchantRaw, day, month, year, balance] = engCompra2;
                const merchant = merchantRaw.trim();
                const formattedDate = `${day.padStart(2, '0')}/${month.padStart(2, '0')}/20${year}`;
                rows.push([
                    rows.length + 1,
                    code,
                    normalizeAmount(value),
                    formattedDate,
                    '0.00',
                    merchant,
                    normalizeAmount(balance)
                ]);
                continue;
            }

            const engCompra3 = message.match(
                /([A-Z0-9]{11,12})\s+Confirmed\.\s+We\s+registered\s+a\s+purchase\s+of\s+([\d,]+\.\d{2})MT\s+in\s+the\s+Merchant\s+(.+?)\s+on\s+(\d{1,2})\/(\d{1,2})\/(\d{2})[\s\S]*?Your\s+new\s+M-Pesa\s+balance\s+is\s+([\d,]+\.\d{2})MT/i
            );
            if (engCompra3) {
                const [_, code, value, merchantRaw, day, month, year, balance] = engCompra3;
                const merchant = merchantRaw.trim();
                const formattedDate = `${day.padStart(2, '0')}/${month.padStart(2, '0')}/20${year}`;
                rows.push([
                    rows.length + 1,
                    code,
                    normalizeAmount(value),
                    formattedDate,
                    '0.00',
                    merchant,
                    normalizeAmount(balance)
                ]);
                continue;
            }

        }

        if (rows.length === 0) {
            showToast("No transactions found");
            return;
        }

        const csvContent = [
            ['#', 'MPESA Code', 'Cost', 'Date', 'Fee', 'Phone Number', 'Final Balance'],
            ...rows
        ].map(row => row.map(field => `"${field}"`).join(';')).join('\r\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'mpesa_export.csv';
        link.click();
    }

    window.addEventListener('load', () => {
        setTimeout(createFloatingButton, 1500);
        document.addEventListener('keydown', e => {
            if (e.altKey && e.key.toLowerCase() === 'm') {
                e.preventDefault();
                openDateModal();
            }
        });
    });
})();