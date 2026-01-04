// ==UserScript==
// @name         Gartic.io Oda Link Toplayıcı
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Gartic.io odalarını toplar ve sonuna /viewer ekler, renkli bir menüde gösterir.
// @author       Siz
// @match        https://gartic.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/524764/Garticio%20Oda%20Link%20Toplay%C4%B1c%C4%B1.user.js
// @updateURL https://update.greasyfork.org/scripts/524764/Garticio%20Oda%20Link%20Toplay%C4%B1c%C4%B1.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Menü oluşturma
    const menu = document.createElement('div');
    menu.style.position = 'fixed';
    menu.style.top = '10px';
    menu.style.right = '10px';
    menu.style.padding = '15px';
    menu.style.background = 'linear-gradient(45deg, red, orange, yellow, green, blue, indigo, violet)';
    menu.style.border = '2px solid #fff';
    menu.style.borderRadius = '10px';
    menu.style.color = '#fff';
    menu.style.fontFamily = 'Arial, sans-serif';
    menu.style.zIndex = '10000';
    menu.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
    menu.style.cursor = 'pointer';

    // Menü içeriği
    menu.innerHTML = `
        <h3 style="text-align: center; margin: 0; font-size: 16px;">Gartic.io Link Toplayıcı</h3>
        <button id="collect-links" style="width: 100%; padding: 8px; margin-top: 10px; border: none; background: #333; color: white; border-radius: 5px; cursor: pointer;">Oda Linklerini Topla</button>
        <div id="link-list" style="margin-top: 10px; max-height: 200px; overflow-y: auto;"></div>
        <a href="https://gartic.io" target="_blank" style="display: block; text-align: center; margin-top: 10px; color: yellow; text-decoration: underline;">Gartic.io'ya Git</a>
    `;

    // Menü sayfaya ekleme
    document.body.appendChild(menu);

    // Linkleri toplama işlevi
    document.getElementById('collect-links').addEventListener('click', function() {
        const rooms = document.querySelectorAll('.room-item a'); // Oda bağlantılarını bul
        const linkList = document.getElementById('link-list');
        linkList.innerHTML = ''; // Eski bağlantıları temizle

        if (rooms.length === 0) {
            linkList.innerHTML = '<p style="color: white;">Oda bulunamadı.</p>';
            return;
        }

        rooms.forEach(room => {
            let url = room.href; // Oda bağlantısını al
            if (!url.endsWith('/viewer')) {
                url += '/viewer'; // Sonuna /viewer ekle
            }

            // Bağlantıyı listeye ekle
            const link = document.createElement('a');
            link.href = url;
            link.textContent = url;
            link.style.display = 'block';
            link.style.color = '#00ff00';
            link.style.marginBottom = '5px';
            link.target = '_blank';
            linkList.appendChild(link);
        });
    });
})();