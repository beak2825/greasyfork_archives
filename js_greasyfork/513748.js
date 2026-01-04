// ==UserScript==
// @name         Gartic.io CroxyProxy Panel
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Adds a realistic CroxyProxy panel to Gartic.io.
// @author       Your Name
// @match        *://gartic.io/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/513748/Garticio%20CroxyProxy%20Panel.user.js
// @updateURL https://update.greasyfork.org/scripts/513748/Garticio%20CroxyProxy%20Panel.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Stil ekleme
    const style = document.createElement('style');
    style.innerHTML = `
        #proxy-menu-btn {
            position: fixed;
            top: 10px;
            left: 10px;
            background-color: #4CAF50;
            color: white;
            border: none;
            border-radius: 5px;
            padding: 10px 15px;
            font-size: 16px;
            cursor: pointer;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
            transition: background-color 0.3s;
            z-index: 9999;
        }

        #proxy-menu-btn:hover {
            background-color: #45a049;
        }

        #proxy-panel {
            display: none;
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background-color: #f9f9f9;
            width: 400px;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
            z-index: 10000;
        }

        #proxy-panel h2 {
            margin-top: 0;
            font-size: 24px;
            text-align: center;
        }

        #proxy-panel input {
            width: 100%;
            padding: 10px;
            margin: 10px 0;
            border: 1px solid #ccc;
            border-radius: 5px;
        }

        #proxy-panel button {
            width: 100%;
            padding: 10px;
            background-color: #4CAF50;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            transition: background-color 0.3s;
        }

        #proxy-panel button:hover {
            background-color: #45a049;
        }
    `;
    document.head.appendChild(style);

    // Menü butonu ekleme
    const menuButton = document.createElement('button');
    menuButton.id = 'proxy-menu-btn';
    menuButton.innerText = 'Proxy Panel';
    document.body.appendChild(menuButton);

    // Proxy paneli ekleme
    const proxyPanel = document.createElement('div');
    proxyPanel.id = 'proxy-panel';
    proxyPanel.innerHTML = `
        <h2>CroxyProxy Ayarları</h2>
        <input type="text" id="proxy-url" placeholder="Proxy URL'si girin..." />
        <button id="open-proxy-btn">Proxy ile Aç</button>
    `;
    document.body.appendChild(proxyPanel);

    // Menü butonuna tıklayınca paneli açma/kapatma
    menuButton.addEventListener('click', () => {
        proxyPanel.style.display = proxyPanel.style.display === 'none' ? 'block' : 'none';
    });

    // Proxy açma butonuna tıklama işlevi
    document.getElementById('open-proxy-btn').addEventListener('click', () => {
        const proxyURL = document.getElementById('proxy-url').value;
        if (proxyURL) {
            window.location.href = `https://www.croxyproxy.com/?q=${encodeURIComponent(proxyURL)}`;
        } else {
            alert('Lütfen geçerli bir URL girin.');
        }
    });
})();
