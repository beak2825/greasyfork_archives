// ==UserScript==
// @name         Лолз гивэвэй монитор
// @version      1.0
// @description  Следит за лимитом участий с отстуком в тг-бота
// @author       MisterLis
// @match        https://lolz.live/forums/contests/*
// @grant        GM_xmlhttpRequest
// @namespace https://greasyfork.org/users/1508462
// @downloadURL https://update.greasyfork.org/scripts/547139/%D0%9B%D0%BE%D0%BB%D0%B7%20%D0%B3%D0%B8%D0%B2%D1%8D%D0%B2%D1%8D%D0%B9%20%D0%BC%D0%BE%D0%BD%D0%B8%D1%82%D0%BE%D1%80.user.js
// @updateURL https://update.greasyfork.org/scripts/547139/%D0%9B%D0%BE%D0%BB%D0%B7%20%D0%B3%D0%B8%D0%B2%D1%8D%D0%B2%D1%8D%D0%B9%20%D0%BC%D0%BE%D0%BD%D0%B8%D1%82%D0%BE%D1%80.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const BOT_TOKEN = '';
    const CHAT_ID = '';
    const LEFT_MAX = 5;
    const RELOAD_MS = 60 * 1000;

    const sendTg = (text) => {
        GM_xmlhttpRequest({
            method: 'POST',
            url: `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`,
            headers: { 'Content-Type': 'application/json' },
            data: JSON.stringify({ chat_id: CHAT_ID, text })
        });
    };

    const checkLimit = () => {
        const node = document.querySelector('.counterText');
        if (!node) return;

        const [used, total] = node.textContent.trim().split('/').map(Number);
        const left = total - used;

        console.log(`Giveaway: ${used}/${total}, left=${left}`);

        if (left <= LEFT_MAX && !window.__tgSent) {
            sendTg(`⚠️ Осталось ${left} из ${total} попыток в розыгрышах lolz.live!\nНе забудьте создать розыгрыш https://lolz.live/forums/contests/create-thread`);
            window.__tgSent = true;
        }
    };

    checkLimit();
    setTimeout(() => location.reload(), RELOAD_MS);
})();