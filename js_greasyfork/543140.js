// ==UserScript==
// @name         Poloska
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  СКАЖИ ПОЛОСКЕ - НЕТ
// @match        https://lolz.live/*
// @match        https://lolz.guru/*
// @match        https://zelenka.guru/*
// @grant        GM_addStyle
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/543140/Poloska.user.js
// @updateURL https://update.greasyfork.org/scripts/543140/Poloska.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 1. CSS-инъекция (блокирует отображение на любом этапе)
    GM_addStyle(`
        .progress-sliver {
            display: none !important;
            visibility: hidden !important;
            height: 0 !important;
            opacity: 0 !important;
            pointer-events: none !important;
        }
    `);

    // 2. Функция для физического удаления элемента
    const nukeProgressBar = () => {
        document.querySelectorAll('.progress-sliver').forEach(el => {
            el.remove();
        });
    };

    // 3. Мгновенное выполнение при инъекции
    nukeProgressBar();

    // 4. Наблюдатель для динамически добавляемых элементов
    new MutationObserver(nukeProgressBar).observe(document, {
        childList: true,
        subtree: true,
        attributes: false,
        characterData: false
    });

    // 5. Перехват создания элемента через Proxy (экстремальный метод)
    if (window.Element.prototype.appendChild) {
        const originalAppend = Element.prototype.appendChild;
        Element.prototype.appendChild = function(node) {
            if (node.classList && node.classList.contains('progress-sliver')) {
                return node.cloneNode(false); // Возвращаем пустой клон
            }
            return originalAppend.call(this, node);
        };
    }
})();