// ==UserScript==
// @name         Ares RedBOT v5.0
// @namespace    http://tampermonkey.net/
// @version      5.0
// @description  Gartic io hack script
// @author       Ares
// @match        https://gartic.io/*
// @run-at       document-start
// @grant        GM_setValue
// @grant        GM_addValueChangeListener
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/523789/Ares%20RedBOT%20v50.user.js
// @updateURL https://update.greasyfork.org/scripts/523789/Ares%20RedBOT%20v50.meta.js
// ==/UserScript==

(function() {
    "use strict";

    // Abnormal Menu kütüphanesini yükleyin
    const abnormalMenu = document.createElement('script');
    abnormalMenu.src = 'https://greasyfork.org/scripts/raw/462013/abnormal-menu.js';
    document.head.appendChild(abnormalMenu);

    // Menu oluşturun
    const menu = new abnormalMenu.Menu({
        title: 'Ares RedBOT v5.0 Menü',
        items: [
            {
                label: 'Odaya Katıl',
                action: function () {
                    // Odaya katılma işlemini gerçekleştiren kod burada
                    alert('Odaya katılma işlemini gerçekleştireceğiz.');
                }
            },
            {
                label: 'Odadan Çık',
                action: function () {
                    // Odadan çıkma işlemini gerçekleştiren kod burada
                    alert('Odadan çıkma işlemini gerçekleştireceğiz.');
                }
            },
            {
                label: 'Bot Ekle',
                action: function () {
                    // Bot ekleme işlemini gerçekleştiren kod burada
                    alert('Bot ekleme işlemini gerçekleştireceğiz.');
                }
            },
            {
                label: 'Bot Sil',
                action: function () {
                    // Bot silme işlemini gerçekleştiren kod burada
                    alert('Bot silme işlemini gerçekleştireceğiz.');
                }
            }
        ]
    });

    // Menuyi sol üst köşeye ekleyin
    const body = document.body;
    const header = document.querySelector('header');
    if (header) {
        header.insertBefore(menu.element, header.firstChild);
    } else {
        body.insertBefore(menu.element, body.firstChild);
    }

    // Menu'nun görünümünü ayarlayın
    injectCSS(`
.abnormal-menu {
    position: fixed;
    top: 0;
    left: 0;
    background-color: #333;
    color: #fff;
    padding: 10px;
    border-radius: 10px;
    z-index: 9999;
}

.abnormal-menu * {
    text-align: center;
    font-size: 12pt !important;
    box-sizing: border-box;
}
`);

})()