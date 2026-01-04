// ==UserScript==
// @name         Otomatik (hunt)
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Düğme aktif olduğunda tıklama yapma
// @author       Senin Adın
// @match        https://web.idle-mmo.com/battle
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/505529/Otomatik%20%28hunt%29.user.js
// @updateURL https://update.greasyfork.org/scripts/505529/Otomatik%20%28hunt%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Belirtilen seçici
    const buttonSelector = "#game-container > div > div.md\\:mt-4.space-y-2 > div.grid.grid-cols-8.gap-4.md\\:mt-4 > div.col-span-8.md\\:col-span-5.md\\:block > div:nth-child(2) > div > div.flex.justify-end.mt-2.gap-2.items-center.flex-wrap > div:nth-child(2) > button";

    function checkAndClickButton() {
        // Düğmeyi seç
        const button = document.querySelector(buttonSelector);
        if (button && !button.disabled) {
            button.click();
            console.log('Düğmeye tıklandı!');
        } else {
            console.log('Düğme bulunamadı veya düğme devre dışı.');
        }
    }

    // Sayfa yüklendiğinde ve her 5 saniyede bir düğmeyi kontrol et
    window.addEventListener('load', () => {
        checkAndClickButton(); // İlk kontrol
        setInterval(checkAndClickButton, 5000); // 5 saniyede bir tekrar
    });
})();
