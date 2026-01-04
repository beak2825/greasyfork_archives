// ==UserScript==
// @name         Orkun Isıtmak Everywhere
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Tüm sitelerde ikonları ve resimleri değiştirir, başlığı "Orkun Işıtmak" yapar.
// @author       Babapro
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/531006/Orkun%20Is%C4%B1tmak%20Everywhere.user.js
// @updateURL https://update.greasyfork.org/scripts/531006/Orkun%20Is%C4%B1tmak%20Everywhere.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Sayfa başlığını değiştir
    document.title = "Orkun Işıtmak";

    // Favicon'u değiştirme
    function changeFavicon(url) {
        let link = document.querySelector("link[rel~='icon']");
        if (!link) {
            link = document.createElement("link");
            link.rel = "icon";
            document.head.appendChild(link);
        }
        link.href = url;
    }
    changeFavicon("https://upload.wikimedia.org/wikipedia/commons/a/a2/Orkun_I%C5%9F%C4%B1tmak_-_21.1.17.jpg");

    // Tüm resimleri değiştirme
    function replaceImages() {
        document.querySelectorAll("img").forEach(img => {
            img.src = "https://upload.wikimedia.org/wikipedia/commons/a/a2/Orkun_I%C5%9F%C4%B1tmak_-_21.1.17.jpg";
        });
    }
    replaceImages();

    // Yeni yüklenen resimleri de değiştirme
    const observer = new MutationObserver(replaceImages);
    observer.observe(document.body, { childList: true, subtree: true });
})();