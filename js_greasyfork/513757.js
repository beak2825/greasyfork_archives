// ==UserScript==
// @name         Gartic.io Arka Plan Resmi Ekleme (Tamamen Net)
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Gartic.io arka planına özel bir resim ekler ve bulanıklığı kaldırır.
// @author       ARES
// @match        *://gartic.io/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/513757/Garticio%20Arka%20Plan%20Resmi%20Ekleme%20%28Tamamen%20Net%29.user.js
// @updateURL https://update.greasyfork.org/scripts/513757/Garticio%20Arka%20Plan%20Resmi%20Ekleme%20%28Tamamen%20Net%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Resim URL'si
    const imageUrl = 'https://cdn.pixabay.com/photo/2024/10/17/21/46/man-9128923_640.png';

    // Arka plan stilini ayarlama
    const style = document.createElement('style');
    style.innerHTML = `
        body {
            background-image: url(${imageUrl});
            background-size: cover; /* Arka plan resmi sayfayı kaplar */
            background-repeat: no-repeat; /* Resim tekrar etmez */
            background-position: center; /* Resim ortalanır */
        }
        #canvas {
            background: transparent !important; /* Canvas arka planını şeffaf yap */
        }
    `;
    document.head.appendChild(style);
})();
