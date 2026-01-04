// ==UserScript==
// @name         Proxy Açma
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Mor bir menü oluşturur ve girilen Proxy sayısı kadar sayfa açar.
// @author       neo
// @match        https://gartic.io/*
// @grant        GM_openInTab
// @downloadURL https://update.greasyfork.org/scripts/486224/Proxy%20A%C3%A7ma.user.js
// @updateURL https://update.greasyfork.org/scripts/486224/Proxy%20A%C3%A7ma.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Mor menü oluşturuluyor
    const menuContainer = document.createElement('div');
    menuContainer.style.position = 'fixed';
    menuContainer.style.top = '10px';
    menuContainer.style.right = '10px';
    menuContainer.style.background = 'purple';
    menuContainer.style.padding = '10px';
    menuContainer.style.borderRadius = '5px';
    menuContainer.style.zIndex = '9999';

    // Proxy sayısı için giriş kutusu oluşturuluyor
    const proxyInput = document.createElement('input');
    proxyInput.type = 'text';
    proxyInput.placeholder = 'Proxy Sayısı';
    proxyInput.style.marginBottom = '1px';
    menuContainer.appendChild(proxyInput);

    // "Aç" düğmesi oluşturuluyor
    const openButton = document.createElement('button');
    openButton.textContent = 'Aç';
    openButton.style.background = 'white';
    openButton.style.padding = '5px';
    openButton.style.border = 'none';
    openButton.style.cursor = 'pointer';
    openButton.addEventListener('click', openPages);
    menuContainer.appendChild(openButton);

    document.body.appendChild(menuContainer);

    // "Aç" düğmesine tıklandığında çalışacak fonksiyon
    function openPages() {
        const proxyCount = parseInt(proxyInput.value, 10);
        if (isNaN(proxyCount) || proxyCount <= 0) {
            alert('Geçerli bir Proxy sayısı girin.');
            return;
        }

        // Proxy sayısı kadar sayfa açılıyor
        for (let i = 0; i < proxyCount; i++) {
            const url = 'https://cdn.blockaway.net/_tr/';
            GM_openInTab(url, false);
        }
    }
})();