
// ==UserScript==
// @name         Ares redBOT v4
// @namespace    http://tampermonkey.net/
// @version      4.0
// @description  Ares redBOT v4 için Türkçe menü ile uyarlanmış kullanıcı betiği
// @author       Siz
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/523788/Ares%20redBOT%20v4.user.js
// @updateURL https://update.greasyfork.org/scripts/523788/Ares%20redBOT%20v4.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Menü oluşturuluyor
    const menu = document.createElement('div');
    menu.style.position = 'fixed';
    menu.style.top = '10px';
    menu.style.right = '10px';
    menu.style.backgroundColor = '#fff';
    menu.style.border = '1px solid #000';
    menu.style.padding = '10px';
    menu.style.zIndex = '10000';

    // Menü başlığı
    const title = document.createElement('h3');
    title.textContent = 'Ares redBOT v4';
    menu.appendChild(title);

    // Menüdeki Türkçe düğmeler
    const button1 = document.createElement('button');
    button1.textContent = 'Başlat';
    button1.onclick = function() {
        alert('Bot başlatıldı!');
    };
    menu.appendChild(button1);

    const button2 = document.createElement('button');
    button2.textContent = 'Duraklat';
    button2.onclick = function() {
        alert('Bot duraklatıldı!');
    };
    menu.appendChild(button2);

    const button3 = document.createElement('button');
    button3.textContent = 'Durdur';
    button3.onclick = function() {
        alert('Bot durduruldu!');
    };
    menu.appendChild(button3);

    // Menü sayfaya ekleniyor
    document.body.appendChild(menu);
})();
