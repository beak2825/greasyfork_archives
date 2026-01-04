// ==UserScript==
// @name         Otomatik (Mining)
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Belirli aralıklarla düğmeye tıklama
// @author       Senin Adın
// @match        https://web.idle-mmo.com/skills/view/mining
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/505317/Otomatik%20%28Mining%29.user.js
// @updateURL https://update.greasyfork.org/scripts/505317/Otomatik%20%28Mining%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 90 dakikayı milisaniyeye çevir
    const interval = 90 * 60 * 1000;

    // Yeni düğme seçici
    const buttonSelector = "form.inline-flex.items-center > button[type='submit']";

    function clickButton() {
        // Düğmeyi seç
        const button = document.querySelector(buttonSelector);
        if (button && !button.disabled) {
            button.click();
            console.log('Düğmeye tıklandı!');
        } else {
            console.log('Düğme bulunamadı veya düğme devre dışı.');
        }
    }

    // Sayfa yüklendiğinde ve her 90 dakikada bir tıklama işlemini yap
    window.addEventListener('load', () => {
        clickButton(); // İlk tıklama
        setInterval(clickButton, interval); // 90 dakikada bir tekrar
    });
})();
