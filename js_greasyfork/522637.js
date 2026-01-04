// ==UserScript==
// @name         ARES VIEWER - Gökkuşağı Menü
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Ares Viewer için otomatik yönlendirme ve gökkuşağı renkli menü
// @author       Ares
// @match        https://gartic.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/522637/ARES%20VIEWER%20-%20G%C3%B6kku%C5%9Fa%C4%9F%C4%B1%20Men%C3%BC.user.js
// @updateURL https://update.greasyfork.org/scripts/522637/ARES%20VIEWER%20-%20G%C3%B6kku%C5%9Fa%C4%9F%C4%B1%20Men%C3%BC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Sayfa yüklendikten sonra menüyü oluşturuyoruz
    window.onload = function() {
        // Menü container'ı
        const body = document.body;

        const menuContainer = document.createElement('div');
        menuContainer.style.position = 'fixed';
        menuContainer.style.top = '50%';
        menuContainer.style.left = '50%';
        menuContainer.style.transform = 'translate(-50%, -50%)'; // Ortalamak için
        menuContainer.style.padding = '20px';
        menuContainer.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        menuContainer.style.borderRadius = '10px';
        menuContainer.style.zIndex = '1000';
        menuContainer.style.textAlign = 'center';  // Yazıyı ortalamak için

        // Menü başlığı
        const menuTitle = document.createElement('h3');
        menuTitle.innerText = 'Ares Menü';
        menuTitle.style.color = 'white';
        menuContainer.appendChild(menuTitle);

        // Menü öğesi
        const menuItem = document.createElement('a');
        menuItem.href = 'https://gartic.io/Ares';  // Ares odasına yönlendirecek link
        menuItem.innerText = 'Ares Odanıza Gitmek İçin Tıklayın';
        menuItem.style.fontSize = '20px';
        menuItem.style.textDecoration = 'none';
        menuItem.style.display = 'block';
        menuItem.style.marginTop = '15px';
        menuItem.style.fontWeight = 'bold';

        // Gökkuşağı efekti ekleyelim
        menuItem.style.backgroundImage = 'linear-gradient(to left, violet, indigo, blue, green, yellow, orange, red)';
        menuItem.style.backgroundSize = '200% 100%';
        menuItem.style.backgroundPosition = 'right bottom';
        menuItem.style.webkitBackgroundClip = 'text';
        menuItem.style.color = 'transparent';
        menuItem.style.transition = 'background-position 1s ease';

        // Bağlantıya hover etkisi ekleyelim (renk geçişi)
        menuItem.addEventListener('mouseover', () => {
            menuItem.style.backgroundPosition = 'left bottom';
        });

        menuItem.addEventListener('mouseout', () => {
            menuItem.style.backgroundPosition = 'right bottom';
        });

        // Menü öğesine tıklama ile yönlendirme işlemi ekliyoruz
        menuItem.addEventListener('click', function() {
            window.location.href = menuItem.href;  // Yönlendirme yapılacak
        });

        // Sayfaya menüyü ekliyoruz
        body.appendChild(menuContainer);
    };
})();