// ==UserScript==
// @name         LZT Market: Конвертируемые подарки в блоке бейджей
// @namespace    https://lzt.market/
// @version      1.1
// @description  Показывает количество подарков младше 7 дней (можно сконвертировать в звезды)
// @author       @umikud
// @match        https://lzt.market/telegram*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/531474/LZT%20Market%3A%20%D0%9A%D0%BE%D0%BD%D0%B2%D0%B5%D1%80%D1%82%D0%B8%D1%80%D1%83%D0%B5%D0%BC%D1%8B%D0%B5%20%D0%BF%D0%BE%D0%B4%D0%B0%D1%80%D0%BA%D0%B8%20%D0%B2%20%D0%B1%D0%BB%D0%BE%D0%BA%D0%B5%20%D0%B1%D0%B5%D0%B9%D0%B4%D0%B6%D0%B5%D0%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/531474/LZT%20Market%3A%20%D0%9A%D0%BE%D0%BD%D0%B2%D0%B5%D1%80%D1%82%D0%B8%D1%80%D1%83%D0%B5%D0%BC%D1%8B%D0%B5%20%D0%BF%D0%BE%D0%B4%D0%B0%D1%80%D0%BA%D0%B8%20%D0%B2%20%D0%B1%D0%BB%D0%BE%D0%BA%D0%B5%20%D0%B1%D0%B5%D0%B9%D0%B4%D0%B6%D0%B5%D0%B9.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;
    const processed = new Set();

    const months = {
        'янв': 0, 'января': 0,
        'фев': 1, 'февраля': 1,
        'мар': 2, 'марта': 2,
        'апр': 3, 'апреля': 3,
        'май': 4, 'мая': 4,
        'июн': 5, 'июня': 5,
        'июл': 6, 'июля': 6,
        'авг': 7, 'августа': 7,
        'сен': 8, 'сентября': 8,
        'окт': 9, 'октября': 9,
        'ноя': 10, 'ноября': 10,
        'дек': 11, 'декабря': 11
    };

    function parseDate(title) {
        const regex = /(\d{1,2}) ([^ ]+) (\d{4}) в (\d{2}):(\d{2})/;
        const match = title.match(regex);
        if (!match) return null;

        const [, day, monRaw, year, hour, minute] = match;
        const mon = monRaw.toLowerCase();
        const monthNum = months[mon];
        if (monthNum === undefined) return null;

        return new Date(Date.UTC(+year, monthNum, +day, +hour - 3, +minute));
    }

    async function getConvertibleGiftsCount(url) {
        try {
            const res = await fetch(url);
            const html = await res.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');

            const giftDates = [...doc.querySelectorAll('.telegram_gifts_block .DateTime')];
            const now = Date.now();

            return giftDates.filter(dt => {
                if (!dt.title) return false;
                const giftDate = parseDate(dt.title);
                if (!giftDate) return false;
                return now - giftDate.getTime() <= SEVEN_DAYS_MS;
            }).length;
        } catch (e) {
            console.error(`❌ Ошибка при загрузке ${url}:`, e);
            return 0;
        }
    }

    async function processCard(card) {
        const match = card.id.match(/marketItem--(\d+)/);
        const productId = match?.[1];
        if (!productId || processed.has(productId)) return;

        processed.add(productId);
        const href = `https://lzt.market/${productId}/`;
        const count = await getConvertibleGiftsCount(href);

        const badgesBlock = card.querySelector('.marketIndexItem--Badges');
        if (badgesBlock) {
            const badge = document.createElement('span');
            badge.className = `stat Tooltip ${count > 0 ? 'greenText' : 'warningText'}`;
            badge.setAttribute('data-tipclass', 'fixedWidth');
            badge.setAttribute('tabindex', '0');
            badge.setAttribute('data-cachedtitle', count > 0
                ? `На аккаунте есть ${count} подарков, которые можно обменять на Telegram Stars`
                : `Нет подарков, подходящих для обмена на Telegram Stars`);

            badge.textContent = count > 0
                ? `${count} → звезды`
                : `Нет подарков для обмена`;

            badgesBlock.appendChild(badge);
            console.log(`[✨] Бейдж ${productId} добавлен (${count})`);
        }
    }

    function observeNewCards() {
        const observer = new MutationObserver(mutations => {
            for (const mutation of mutations) {
                for (const node of mutation.addedNodes) {
                    if (node.nodeType !== 1) continue;

                    const newCards = node.matches?.('.marketIndexItem') ? [node] : node.querySelectorAll?.('.marketIndexItem');
                    if (newCards) {
                        newCards.forEach(card => processCard(card));
                    }
                }
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    async function processInitialCards() {
        const cards = document.querySelectorAll('.marketIndexItem');
        for (const card of cards) {
            await processCard(card);
            await new Promise(r => setTimeout(r, 100));
        }
    }

    window.addEventListener('load', () => {
        console.log('[🚀] Скрипт LZT Market Gifts запущен');
        processInitialCards();
        observeNewCards();
    });
})();