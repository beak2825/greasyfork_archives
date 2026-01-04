// ==UserScript==
// @name         Mamba UnBlure
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Убирает blur и открывает профили по нажатию на фото
// @author       Vierta
// @match        https://www.mamba.ru/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/537430/Mamba%20UnBlure.user.js
// @updateURL https://update.greasyfork.org/scripts/537430/Mamba%20UnBlure.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Создаем стиль для переопределения
    const style = document.createElement('style');
    style.innerHTML = `
        .b1qktkn [data-name=user-photo-no-image],
        .b1qktkn [data-name=user-photo] {
            -webkit-filter: none !important;
            filter: none !important;
        }
        .b1qktkn:after {
            display: none !important;
        }
        .b56amc0, .sc-1xy5yf6-0.dydfsQ {
            display: none !important;
        }
    `;
    document.head.appendChild(style);

    function processPage() {
        // Удаляем VIP-карточки
        document.querySelectorAll('a[data-name="events-item-vip-action"]').forEach(el => el.remove());

        // Обрабатываем ссылки профилей
        document.querySelectorAll('a[data-name="link-hitlist-item-not-open-event-action"][href="/event-list/all/app/storefront/vip/slide/show-hitlist-rating/place/activity"]').forEach(link => {
            const img = link.querySelector('img[data-name="user-photo"]');
            if (img) {
                const match = img.src.match(/\/\d+\/\d+\/\d+\/(\d+)\//);
                if (match?.[1]) {
                    const newHref = `/profile/${match[1]}`;
                    link.href = newHref;
                    link.onclick = e => {
                        e.preventDefault();
                        window.open(newHref, '_blank');
                    };
                }
            }
        });
    }

    // Отслеживание изменений DOM
    new MutationObserver(mutations => {
        if (mutations.some(m =>
                           Array.from(m.addedNodes).some(n =>
                                                         n.nodeType === 1 &&
                                                         (n.matches?.('a[data-name="events-item-vip-action"]') ||
                                                          n.querySelector?.('a[data-name="events-item-vip-action"]'))
                                                        )
                          )) {
            setTimeout(processPage, 50);
        }
    }).observe(document.body, { childList: true, subtree: true });

})();