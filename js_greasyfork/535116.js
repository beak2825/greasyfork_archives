// ==UserScript==
// @name         Проверка артов перед ГТ
// @namespace    http://tampermonkey.net/
// @version      4.60
// @description  проверка перед ГТ
// @author       Sky
// @license      MIT
// @match        *://*.heroeswm.ru/pvp_guild.php*
// @match        *://*.lordswm.com/pvp_guild.php*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/535116/%D0%9F%D1%80%D0%BE%D0%B2%D0%B5%D1%80%D0%BA%D0%B0%20%D0%B0%D1%80%D1%82%D0%BE%D0%B2%20%D0%BF%D0%B5%D1%80%D0%B5%D0%B4%20%D0%93%D0%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/535116/%D0%9F%D1%80%D0%BE%D0%B2%D0%B5%D1%80%D0%BA%D0%B0%20%D0%B0%D1%80%D1%82%D0%BE%D0%B2%20%D0%BF%D0%B5%D1%80%D0%B5%D0%B4%20%D0%93%D0%A2.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const link = location.hostname.includes('lordswm')
        ? 'https://my.lordswm.com'
        : 'https://www.heroeswm.ru';


    const createEl = (tag, style, text) => {
        const el = document.createElement(tag);
        if (style) el.style.cssText = style;
        if (text) el.innerText = text;
        return el;
    };

    function insertUnderGT(wrap) {

        const titles = [...document.querySelectorAll('*')]
            .filter(el =>
                el.children.length === 0 &&
                el.textContent.trim() === 'Гильдия Тактиков' &&
                el.tagName !== 'A'
            );

        if (!titles.length) {
            document.body.prepend(wrap);
            return;
        }

        const gtTitle = titles[titles.length - 1];

        let container = gtTitle.closest('td, div');
        while (container && container.offsetWidth < 500) {
            container = container.parentElement;
        }

        if (container) {
            container.prepend(wrap);
        } else {
            document.body.prepend(wrap);
        }
    }


    function fetchInventoryAndRender() {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', `${link}/inventory.php`);
        xhr.overrideMimeType('text/html; charset=windows-1251');

        xhr.onload = () => {
            const doc = new DOMParser().parseFromString(xhr.responseText, 'text/html');

            const slots = [
                { id: 'slot1', name: 'шлем' },
                { id: 'slot2', name: 'кулон' },
                { id: 'slot3', name: 'броня' },
                { id: 'slot4', name: 'спина' },
                { id: 'slot5', name: 'правая рука' },
                { id: 'slot6', name: 'левая рука' },
                { id: 'slot7', name: 'сапоги' },
                { id: 'slot8', name: 'верхнее кольцо' },
                { id: 'slot9', name: 'нижнее кольцо' }
            ];

            let equipped = 0;
            const missing = [];

            slots.forEach(s => {
                const el = doc.getElementById(s.id);
                if (el && el.innerText.trim()) {
                    equipped++;
                } else {
                    missing.push(s.name);
                }
            });

            const mirrorEl = doc.getElementById('slot11');
            const mirrorOn = mirrorEl && mirrorEl.innerText.trim();


            const wrap = createEl(
                'div',
                `
                margin:6px 0 10px;
                display:flex;
                flex-wrap:wrap;
                justify-content:center;
                align-items:center;
                gap:12px;
                font-size:15px;
                font-weight:600;
                `
            );

            wrap.append(
                createEl(
                    'span',
                    `color:${equipped < 9 ? 'red' : 'green'}`,
                    `Надето артов: ${equipped}/9`
                )
            );

            if (equipped < 9) {
                wrap.append(
                    createEl(
                        'span',
                        'color:red;font-weight:500',
                        `Не надето: ${missing.join(', ')}`
                    )
                );
            }

            wrap.append(
                createEl(
                    'span',
                    `color:${mirrorOn ? 'green' : 'red'}`,
                    mirrorOn ? 'Зеркало надето' : 'Зеркало не надето'
                )
            );

            wrap.style.cursor = 'pointer';
            wrap.onclick = () => location.href = `${link}/inventory.php`;

            insertUnderGT(wrap);
        };

        xhr.send();
    }

    fetchInventoryAndRender();

})();