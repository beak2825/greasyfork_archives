// ==UserScript==
// @name         HeroesWM - Массовая передача элементов v6 (исправленный вариант)
// @namespace    http://tamperscripts
// @version      0.7
// @description  Исправленная версия с рабочей отправкой всех типов элементов (AI generated)
// @author       Your Name
// @include     /^https?:\/\/(www\.heroeswm\.ru|178\.248\.235\.15|my\.lordswm\.com)\/el_transfer\.php$
// @include     https://www.heroeswm.ru/el_transfer.php
// @license     MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/534941/HeroesWM%20-%20%D0%9C%D0%B0%D1%81%D1%81%D0%BE%D0%B2%D0%B0%D1%8F%20%D0%BF%D0%B5%D1%80%D0%B5%D0%B4%D0%B0%D1%87%D0%B0%20%D1%8D%D0%BB%D0%B5%D0%BC%D0%B5%D0%BD%D1%82%D0%BE%D0%B2%20v6%20%28%D0%B8%D1%81%D0%BF%D1%80%D0%B0%D0%B2%D0%BB%D0%B5%D0%BD%D0%BD%D1%8B%D0%B9%20%D0%B2%D0%B0%D1%80%D0%B8%D0%B0%D0%BD%D1%82%29.user.js
// @updateURL https://update.greasyfork.org/scripts/534941/HeroesWM%20-%20%D0%9C%D0%B0%D1%81%D1%81%D0%BE%D0%B2%D0%B0%D1%8F%20%D0%BF%D0%B5%D1%80%D0%B5%D0%B4%D0%B0%D1%87%D0%B0%20%D1%8D%D0%BB%D0%B5%D0%BC%D0%B5%D0%BD%D1%82%D0%BE%D0%B2%20v6%20%28%D0%B8%D1%81%D0%BF%D1%80%D0%B0%D0%B2%D0%BB%D0%B5%D0%BD%D0%BD%D1%8B%D0%B9%20%D0%B2%D0%B0%D1%80%D0%B8%D0%B0%D0%BD%D1%82%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const IMAGE_MAP = {
        'abrasive': 'https://www.heroeswm.ru/i/abrasive.gif',
        'snake_poison': 'https://www.heroeswm.ru/i/snake_poison.gif',
        'tiger_tusk': 'https://www.heroeswm.ru/i/tiger_tusk.gif',
        'ice_crystal': 'https://www.heroeswm.ru/i/ice_crystal.gif',
        'moon_stone': 'https://www.heroeswm.ru/i/moon_stone.gif',
        'fire_crystal': 'https://www.heroeswm.ru/i/fire_crystal.gif',
        'meteorit': 'https://www.heroeswm.ru/i/meteorit.gif',
        'witch_flower': 'https://www.heroeswm.ru/i/witch_flower.gif',
        'wind_flower': 'https://www.heroeswm.ru/i/wind_flower.gif',
        'fern_flower': 'https://www.heroeswm.ru/i/fern_flower.gif',
        'badgrib': 'https://www.heroeswm.ru/i/badgrib.gif'
    };

    function encodeWindows1251(str) {
        const encoder = {
            'А': 0xC0, 'Б': 0xC1, 'В': 0xC2, 'Г': 0xC3, 'Д': 0xC4,
            'Е': 0xC5, 'Ж': 0xC6, 'З': 0xC7, 'И': 0xC8, 'Й': 0xC9,
            'К': 0xCA, 'Л': 0xCB, 'М': 0xCC, 'Н': 0xCD, 'О': 0xCE,
            'П': 0xCF, 'Р': 0xD0, 'С': 0xD1, 'Т': 0xD2, 'У': 0xD3,
            'Ф': 0xD4, 'Х': 0xD5, 'Ц': 0xD6, 'Ч': 0xD7, 'Ш': 0xD8,
            'Щ': 0xD9, 'Ъ': 0xDA, 'Ы': 0xDB, 'Ь': 0xDC, 'Э': 0xDD,
            'Ю': 0xDE, 'Я': 0xDF,
            'а': 0xE0, 'б': 0xE1, 'в': 0xE2, 'г': 0xE3, 'д': 0xE4,
            'е': 0xE5, 'ж': 0xE6, 'з': 0xE7, 'и': 0xE8, 'й': 0xE9,
            'к': 0xEA, 'л': 0xEB, 'м': 0xEC, 'н': 0xED, 'о': 0xEE,
            'п': 0xEF, 'р': 0xF0, 'с': 0xF1, 'т': 0xF2, 'у': 0xF3,
            'ф': 0xF4, 'х': 0xF5, 'ц': 0xF6, 'ч': 0xF7, 'ш': 0xF8,
            'щ': 0xF9, 'ъ': 0xFA, 'ы': 0xFB, 'ь': 0xFC, 'э': 0xFD,
            'ю': 0xFE, 'я': 0xFF,
            'Ё': 0xA8, 'ё': 0xB8
        };

        const bytes = [];
        for (let i = 0; i < str.length; i++) {
            const char = str[i];
            const code = encoder[char] ?? null;

            if (code !== null) {
                bytes.push(code);
            } else {
                const utf8Code = char.charCodeAt(0);
                if (utf8Code <= 0x7F) {
                    bytes.push(utf8Code);
                } else {
                    bytes.push(0x3F); // Заменяем на '?'
                }
            }
        }
        return new Uint8Array(bytes);
    }

    function urlEncodeWindows1251Bytes(bytes) {
        let result = '';
        for (const byte of bytes) {
            if (byte === 0x20) {
                result += '+';
            } else if (
                (byte >= 0x41 && byte <= 0x5A) || // A-Z
                (byte >= 0x61 && byte <= 0x7A) || // a-z
                (byte >= 0x30 && byte <= 0x39) || // 0-9
                byte === 0x2D || // -
                byte === 0x5F || // _
                byte === 0x2E || // .
                byte === 0x7E    // ~
            ) {
                result += String.fromCharCode(byte);
            } else {
                result += '%' + byte.toString(16).padStart(2, '0').toUpperCase();
            }
        }
        return result;
    }

    function createElementsTable() {
        const select = document.querySelector('select[name="eltype"]');
        if (!select) {
            console.log("Элей не нашёл")
            return; }

        const elements = Array.from(select.options)
        .slice(1)
        .map(option => ({
            name: option.text.split(' (')[0],
            value: option.value,
            count: parseInt(option.text.match(/\((\d+)\)/)[1], 10)
        }));

        const container = document.createElement('div');
        container.style.display = 'flex';
        container.style.margin = 'auto';
        container.style.justifyContent = 'center';

        const massForm = document.createElement('form');
        massForm.method = 'POST';
        massForm.action = '/el_transfer.php';
        massForm.onsubmit = handleSubmit;

        const inputContainer = document.createElement('div');
        inputContainer.style.cssText = 'display: flex; gap: 20px; margin-bottom: 15px; align-items: center;';

        inputContainer.innerHTML = `
            <div>
                <label>Ник получателя:
                    <input type="text" name="nick" style="min-width: 50px;" required>
                </label>
            </div>
            <div>
                <label>Комментарий:
                    <input type="text" name="comment" style="min-width: 50px;">
                </label>
            </div>
        `;

        massForm.appendChild(inputContainer);

        const table = document.createElement('table');
        table.style.cssText = 'margin: 10px auto; border-collapse: collapse; font-weight: 400; text-allign: center;';

        const headerRow = table.insertRow();
        elements.forEach(el => {
            const th = document.createElement('th');
            th.style.cssText = 'padding: 8px; border: 1px solid #999; font-weight: 400; vertical-align: middle;';

            const img = document.createElement('img');
            img.src = IMAGE_MAP[el.value] || '';
            img.style.cssText = 'width: 40px; height: 40px; display: block; margin: 0 auto;';
            img.alt = el.name;
            img.title = el.name;

            th.appendChild(img);
            headerRow.appendChild(th);
        });

        const inputRow = table.insertRow();
        elements.forEach(el => {
            const td = document.createElement('td');
            td.style.cssText = 'padding: 5px; border: 1px solid #999; text-align: center;';

            td.innerHTML = `
                <input type="number" min="0" max="${el.count}"
                    name="${el.value}_count"
                    style="width: 60px;"
                    value="0"
                    ${el.count === 0 ? 'disabled' : ''}>
            `;
            inputRow.appendChild(td);
        });

        const countRow = table.insertRow();
        elements.forEach(el => {
            const td = document.createElement('td');
            td.style.cssText = 'padding: 5px; border: 1px solid #999; text-align: center;';
            td.textContent = el.count;
            countRow.appendChild(td);
        });

        massForm.appendChild(table);

        const originalForm = document.forms.f;
        const hiddenFields = ['gold', 'art_id', 'sign'];
        hiddenFields.forEach(name => {
            const input = document.createElement('input');
            input.type = 'hidden';
            input.name = name;
            input.value = originalForm[name].value;
            massForm.appendChild(input);
        });

        const sendTypeInput = document.createElement('input');
        sendTypeInput.type = 'hidden';
        sendTypeInput.name = 'sendtype';
        sendTypeInput.value = '1';
        massForm.appendChild(sendTypeInput);

        const submitButton = document.createElement('input');
        submitButton.type = 'submit';
        submitButton.value = 'Передать элементы';
        submitButton.style.cssText = 'display: block; margin: 15px auto; padding: 8px 20px; cursor: pointer;';

        massForm.appendChild(submitButton);
        container.appendChild(massForm);

        const targetElement = document.querySelector('.wbwhite');
        if (targetElement) {
            targetElement.parentNode.insertBefore(container, targetElement);
        } else {
            // Fallback, если элемент не найден
            console.log("Не найден")
            originalForm.parentNode.insertBefore(container, originalForm);
        }
    }

    async function handleSubmit(e) {
        e.preventDefault();
        const form = e.target;
        const formData = new FormData(form);

        const transfers = [];
        formData.forEach((value, key) => {
            if (key.endsWith('_count') && value > 0) {
                transfers.push({
                    eltype: key.replace('_count', ''),
                    count: value
                });
            }
        });

        if (transfers.length === 0) {
            alert('Выберите элементы для передачи!');
            return;
        }

        if (!confirm(`Будет передано ${transfers.length} типов элементов. Продолжить?`)) return;

        for (let i = 0; i < transfers.length; i++) {
            const transfer = transfers[i];
            await sendTransfer(formData, transfer);

            if (i < transfers.length - 1) {
                await new Promise(resolve => setTimeout(resolve, 1500));
            }
        }

        alert('Все элементы переданы! Обновите страницу.');
        location.reload();
    }

    async function sendTransfer(formData, transfer) {
        const params = {
            nick: formData.get('nick'),
            comment: formData.get('comment'),
            gold: formData.get('gold'),
            sendtype: formData.get('sendtype'),
            art_id: formData.get('art_id'),
            sign: formData.get('sign'),
            eltype: transfer.eltype,
            count: transfer.count
        };

        const encodedParams = [];
        for (const [key, value] of Object.entries(params)) {
            const encodedKey = encodeURIComponent(key);
            let encodedValue;

            if (key === 'comment') {
                const bytes = encodeWindows1251(value);
                encodedValue = urlEncodeWindows1251Bytes(bytes);
            } else {
                encodedValue = encodeURIComponent(value);
            }

            encodedParams.push(`${encodedKey}=${encodedValue}`);
        }

        const body = encodedParams.join('&');

        try {
            const response = await fetch('/el_transfer.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: body,
                credentials: 'include'
            });
            const resultText = await response.text();
            console.log(`Передача ${transfer.eltype}:`, resultText);
        } catch (error) {
            console.error(`Ошибка при передаче ${transfer.eltype}:`, error);
        }
    }

    window.addEventListener('load', createElementsTable);
})();