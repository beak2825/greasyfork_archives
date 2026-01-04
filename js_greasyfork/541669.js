// ==UserScript==
// @name         YouTube Cookies to cookies.txt
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Eksportuje ciasteczka YouTube do pliku cookies.txt
// @author       You
// @match        *://*.youtube.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/541669/YouTube%20Cookies%20to%20cookiestxt.user.js
// @updateURL https://update.greasyfork.org/scripts/541669/YouTube%20Cookies%20to%20cookiestxt.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Funkcja tworząca przycisk
    function createButton() {
        // Sprawdź czy przycisk już istnieje
        const existingBtn = document.getElementById('ytCookieExportBtn');
        if (existingBtn) return;

        const btn = document.createElement('button');
        btn.id = 'ytCookieExportBtn';
        btn.textContent = 'Pobierz cookies.txt';
        btn.style.position = 'fixed';
        btn.style.bottom = '20px';
        btn.style.right = '20px';
        btn.style.zIndex = '99999';
        btn.style.padding = '10px 15px';
        btn.style.backgroundColor = '#FF0000';
        btn.style.color = 'white';
        btn.style.border = 'none';
        btn.style.borderRadius = '20px';
        btn.style.cursor = 'pointer';
        btn.style.fontWeight = 'bold';
        btn.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';

        btn.addEventListener('click', downloadCookies);
        document.body.appendChild(btn);
    }

    // Funkcja pobierająca ciasteczka
    function downloadCookies() {
        const cookies = document.cookie.split(';');
        let output = "# Netscape HTTP Cookie File\n";
        output += "# This file contains YouTube cookies\n\n";

        const timestamp = Math.floor(Date.now() / 1000) + 86400; // 24h ważności

        cookies.forEach(cookie => {
            cookie = cookie.trim();
            const [name, ...valueParts] = cookie.split('=');
            const value = valueParts.join('=');

            if (name) {
                output += `.youtube.com\tTRUE\t/\tFALSE\t${timestamp}\t${name}\t${value}\n`;
            }
        });

        // Tworzenie i pobieranie pliku
        const blob = new Blob([output], {type: 'text/plain'});
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'cookies.txt'; // Zawsze ta sama nazwa pliku
        a.click();

        // Zwolnienie zasobów
        setTimeout(() => URL.revokeObjectURL(url), 100);
    }

    // Obserwator zmian w DOM (YouTube używa SPA)
    const observer = new MutationObserver(() => {
        if (document.body) {
            createButton();
        }
    });

    // Rozpocznij obserwację
    observer.observe(document.documentElement, {
        childList: true,
        subtree: true
    });

    // Inicjalne utworzenie przycisku jeśli strona już załadowana
    if (document.readyState === 'complete') {
        createButton();
    } else {
        window.addEventListener('load', createButton);
    }
})();