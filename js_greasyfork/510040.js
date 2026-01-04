// ==UserScript==
// @name         A R E S croxy açma
// @namespace    http://tampermonkey.net/
// @version      6.0
// @description  Belirtilen sayıda CroxyProxy sekmesi açar, URL'yi yapıştırır ve çalıştırır. Hem PC hem de mobil uyumludur.
// @author       ARES
// @match        *://gartic.io/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/510040/A%20R%20E%20S%20croxy%20a%C3%A7ma.user.js
// @updateURL https://update.greasyfork.org/scripts/510040/A%20R%20E%20S%20croxy%20a%C3%A7ma.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Menü oluşturma
    const menu = document.createElement('div');
    menu.style.position = 'fixed';
    menu.style.top = '10px';
    menu.style.right = '10px';
    menu.style.backgroundColor = 'rgba(0, 0, 0, 0.9)';
    menu.style.padding = '20px';
    menu.style.borderRadius = '15px';
    menu.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.6)';
    menu.style.color = '#FFF';
    menu.style.fontFamily = 'Arial, sans-serif';
    menu.style.zIndex = '9999';
    menu.style.textAlign = 'center';
    menu.style.width = '300px';
    menu.style.maxWidth = '90%';

    // Menü başlığı
    const header = document.createElement('h2');
    header.innerText = 'A R E S croxy açma';
    header.style.color = '#00FF00';
    menu.appendChild(header);

    // Kaç site açılacağını belirtmek için input alanı
    const inputCount = document.createElement('input');
    inputCount.type = 'number';
    inputCount.placeholder = 'Kaç site açılsın?';
    inputCount.style.width = '100%';
    inputCount.style.padding = '10px';
    inputCount.style.marginBottom = '10px';
    menu.appendChild(inputCount);

    // URL yapıştırma alanı
    const inputURL = document.createElement('input');
    inputURL.type = 'text';
    inputURL.placeholder = 'Bağlantı yapıştır...';
    inputURL.style.width = '100%';
    inputURL.style.padding = '10px';
    inputURL.style.marginBottom = '10px';
    menu.appendChild(inputURL);

    // "Aç" butonu
    const button = document.createElement('button');
    button.innerText = 'Aç';
    button.style.width = '100%';
    button.style.padding = '10px';
    button.style.borderRadius = '5px';
    button.style.backgroundColor = '#4CAF50';
    button.style.color = '#FFF';
    button.style.cursor = 'pointer';
    menu.appendChild(button);

    // Menü altına imza
    const footer = document.createElement('div');
    footer.innerText = 'Made by A R E S';
    footer.style.marginTop = '10px';
    footer.style.color = '#FFD700';
    menu.appendChild(footer);

    document.body.appendChild(menu);

    // "Aç" butonuna tıklanınca çalışacak işlev
    button.addEventListener('click', async () => {
        const count = parseInt(inputCount.value);
        const url = inputURL.value.trim();

        if (isNaN(count) || count < 1) {
            alert('Lütfen geçerli bir sayı girin.');
            return;
        }

        if (!url) {
            alert('Lütfen geçerli bir URL yapıştırın.');
            return;
        }

        // Belirtilen sayıda CroxyProxy sekmesi aç ve URL'yi yapıştırıp çalıştır
        let openedWindows = [];
        for (let i = 0; i < count; i++) {
            setTimeout(() => {
                const win = window.open('https://www.croxyproxy.com/', '_blank');
                if (win) {
                    openedWindows.push(win);
                    win.onload = function () {
                        try {
                            const inputField = win.document.querySelector('input[name="url"]');
                            const submitButton = win.document.querySelector('button[type="submit"]');
                            if (inputField && submitButton) {
                                inputField.value = url;
                                submitButton.click();
                            }
                        } catch (e) {
                            console.error('Bağlantı yapıştırılamadı:', e);
                        }
                    };
                }
            }, i * 1000); // Her sekmeyi 1 saniye aralıklarla aç
        }

        // Tüm sekmelerin kapanmasını istemiyorsan bu kısmı kaldırabilirsin.
        setTimeout(() => {
            openedWindows.forEach(win => win.close());
        }, 10000); // 10 saniye sonra otomatik kapanma
    });
})();