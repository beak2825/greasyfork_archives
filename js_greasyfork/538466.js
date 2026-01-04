// ==UserScript==
// @name         Автоподсчёт суммы донатов
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Описание имеет неверное значение 
// @author       Весточка
// @match        https://lzt.market/user/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=lzt.market
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/538466/%D0%90%D0%B2%D1%82%D0%BE%D0%BF%D0%BE%D0%B4%D1%81%D1%87%D1%91%D1%82%20%D1%81%D1%83%D0%BC%D0%BC%D1%8B%20%D0%B4%D0%BE%D0%BD%D0%B0%D1%82%D0%BE%D0%B2.user.js
// @updateURL https://update.greasyfork.org/scripts/538466/%D0%90%D0%B2%D1%82%D0%BE%D0%BF%D0%BE%D0%B4%D1%81%D1%87%D1%91%D1%82%20%D1%81%D1%83%D0%BC%D0%BC%D1%8B%20%D0%B4%D0%BE%D0%BD%D0%B0%D1%82%D0%BE%D0%B2.meta.js
// ==/UserScript==

(function () {
    const container = document.querySelector('div.line:nth-child(1)');
    if (!container) return alert('Не найден div.line:nth-child(1)');

    const existingButton = container.querySelector('.button.rightButton.overlayTriggerCalc');
    if (existingButton) return; // чтобы не дублировать кнопку

    const calcButton = document.createElement('a');
    calcButton.className = 'button rightButton overlayTriggerCalc';
    calcButton.textContent = 'Подсчитать';
    calcButton.href = '#';
    calcButton.style.marginLeft = '10px';

    container.appendChild(calcButton);

    calcButton.addEventListener('click', function (e) {
        e.preventDefault();

        const blocks = document.querySelectorAll('.payment_main_block');
        const incoming = {};
        const outgoing = {};

        function parseAmount(text) {
            const clean = text.replace(/[^\d.,]/g, '').replace(/\s/g, '').replace(',', '.');
            return parseFloat(clean);
        }

        blocks.forEach(block => {
            const isIn = !!block.querySelector('.amountChange .in');
            const userEl = block.querySelector('.titleAction a.username span');
            const amountEl = block.querySelector('.amountChange span.in, .amountChange span.out');

            if (!userEl || !amountEl) return;

            const username = userEl.textContent.trim();
            const amount = parseAmount(amountEl.textContent);
            if (isNaN(amount)) return;

            const storage = isIn ? incoming : outgoing;
            storage[username] = (storage[username] || 0) + amount;
        });

        function saveFile(filename, dataObj) {
            // Преобразуем в массив, сортируем по убыванию суммы
            const entries = Object.entries(dataObj)
                .sort((a, b) => b[1] - a[1]);

            const text = entries
                .map(([user, amount]) => `@${user} - ${amount.toFixed(2)} ₽`)
                .join('\n');

            const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = filename;
            link.click();
        }

        saveFile('Входящие переводы.txt', incoming);
        saveFile('Исходящие переводы.txt', outgoing);
    });
})();
