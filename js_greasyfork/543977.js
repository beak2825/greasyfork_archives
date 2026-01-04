// ==UserScript==
// @name         Play DMM browser games without VPN
// @name:zh-TW   免VPN遊玩DMM網頁遊戲
// @name:zh-CN   免VPN游玩DMM网页游戏
// @name:fr   Jouer aux jeux DMM sur navigateur sans VPN
// @name:de   DMM-Browser-Spiele ohne VPN spielen
// @name:es   Jugar juegos de navegador de DMM sin VPN
// @name:pt-BR   Jogar jogos de navegador da DMM sem VPN
// @name:ru   Играть в браузерные игры DMM без VPN
// @name:ar   تشغيل ألعاب DMM على المتصفح بدون VPN
// @name:ko   VPN 없이 DMM 브라우저 게임 플레이
// @name:id   Main game browser DMM tanpa VPN
//
// @description  Modify the cookie values on DMM webpages
// @description:zh-TW 修改DMM網頁的cookie值
// @description:zh-CN 修改DMM网页的cookie值
// @description:fr  Modifier les valeurs des cookies sur les pages DMM
// @description:de  Cookie-Werte auf DMM-Webseiten ändern
// @description:es  Modificar los valores de cookies en las páginas web de DMM
// @description:pt-BR  Modificar os valores de cookies nas páginas da DMM
// @description:ru  Изменение значений cookie на страницах DMM
// @description:ar  تعديل قيم الكوكيز في صفحات DMM
// @description:ko  DMM 웹페이지의 쿠키 값을 수정
// @description:id  Ubah nilai cookie di halaman web DMM
//
// @namespace    http://tampermonkey.net/
// @version      1.2
// @include      *://*.dmm.*/*
// @run-at       document-start
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/544063/Play%20DMM%20browser%20games%20without%20VPN.user.js
// @updateURL https://update.greasyfork.org/scripts/544063/Play%20DMM%20browser%20games%20without%20VPN.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const targetDomains = ['dmm.co.jp', 'dmm.com'];
    if (!targetDomains.some(domain => location.hostname.includes(domain))) return;

    const domains = ['.dmm.co.jp', '.dmm.com'];
    const oldValue = 'ckcy_remedied_check=ktkrt_argt';
    const newValue = 'ec_mrnhbtk';

    let maxAttempts = 10;
    let delay = 300;

    const tryReplaceCookie = () => {
        if (document.cookie.includes(oldValue)) {
            domains.forEach(domain => {
                document.cookie = `ckcy_remedied_check=${newValue}; path=/; domain=${domain}`;
            });
            console.log('✅ Cookie modified successfully: ckcy_remedied_check=ec_mrnhbtk');
        } else if (maxAttempts-- > 0) {
            setTimeout(tryReplaceCookie, delay);
        } else {
            console.warn('⚠️ Target cookie not found, stopping retry');
        }
    };

    setTimeout(tryReplaceCookie, delay);
})();

