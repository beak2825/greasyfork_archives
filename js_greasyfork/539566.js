// ==UserScript==
// @name         Get Token - Simpeg
// @namespace    http://tampermonkey.net/
// @version      2025-06-17
// @description  Open API Simpeg
// @author       You
// @match        https://simpeg.bps.go.id/data*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/539566/Get%20Token%20-%20Simpeg.user.js
// @updateURL https://update.greasyfork.org/scripts/539566/Get%20Token%20-%20Simpeg.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let tokenDataList = [];
    let cookieHeaderList = [];

    function extractTokens(payload) {
        const params = new URLSearchParams(payload);
        const token = params.get('token');
        const token2 = params.get('token2');

        if (token && token2) {
            const formatted = `token: ${token}\ntoken2: ${token2}`;
            if (!tokenDataList.includes(formatted)) {
                tokenDataList.push(formatted);
            }
        }
    }

    // Intercept XMLHttpRequest
    const originalXHROpen = XMLHttpRequest.prototype.open;
    const originalXHRSend = XMLHttpRequest.prototype.send;
    const originalSetRequestHeader = XMLHttpRequest.prototype.setRequestHeader;

    XMLHttpRequest.prototype.open = function () {
        this._headers = {};
        return originalXHROpen.apply(this, arguments);
    };

    XMLHttpRequest.prototype.setRequestHeader = function (header, value) {
        this._headers[header.toLowerCase()] = value;
        return originalSetRequestHeader.apply(this, arguments);
    };

    XMLHttpRequest.prototype.send = function (body) {
        if (typeof body === 'string') {
            extractTokens(body);
        }

        const cookieHeader = this._headers?.['cookie'];
        if (cookieHeader && !cookieHeaderList.includes(cookieHeader)) {
            cookieHeaderList.push(cookieHeader);
        }

        return originalXHRSend.call(this, body);
    };

    // Intercept fetch
    const originalFetch = window.fetch;
    window.fetch = function (...args) {
        const options = args[1] || {};
        if (options.body && typeof options.body === 'string') {
            extractTokens(options.body);
        }

        const headers = options.headers || {};
        const cookieHeader =
            typeof headers.get === 'function'
                ? headers.get('cookie')
                : headers['cookie'] || headers['Cookie'];

        if (cookieHeader && !cookieHeaderList.includes(cookieHeader)) {
            cookieHeaderList.push(cookieHeader);
        }

        return originalFetch.apply(this, args);
    };

    // Fungsi untuk menyisipkan <li> menu baru
    function addMenuItem() {
        const forumItem = document.querySelector("#menu_tree li[id='6']");
        const keluarItem = document.querySelector("#menu_tree li#Keluar");

        if (!forumItem || !keluarItem) {
            console.warn("Gagal menemukan elemen 'Forum Diskusi' atau 'Keluar'.");
            return;
        }

        const newLi = document.createElement('li');
        newLi.id = 'menuKirimToken';
        newLi.style.cursor = 'pointer';
        newLi.textContent = '📤 Kirim Token ke API';
        newLi.style.color = '#007bff';

        newLi.addEventListener('mouseenter', () => newLi.style.textDecoration = 'underline');
        newLi.addEventListener('mouseleave', () => newLi.style.textDecoration = 'none');

        newLi.onclick = () => {
            const latest = tokenDataList[tokenDataList.length - 1];
            if (!latest) {
                alert("Belum ada token ditemukan dari request.");
                return;
            }

            const tokenMatch = latest.match(/token: (.+)\ntoken2: (.+)/);
            if (!tokenMatch) {
                alert("Format token tidak valid.");
                return;
            }

            const token = encodeURIComponent(tokenMatch[1]);
            const token2 = encodeURIComponent(tokenMatch[2]);
            const cookie = encodeURIComponent(document.cookie || '');

            const targetUrl = `https://iph.statapps.dev/api_gojags_simpeg_dll/presensi.php?token=${token}&token2=${token2}&cookie=${cookie}`;
            window.open(targetUrl, '_blank');
        };

        // Sisipkan setelah Forum Diskusi, sebelum Keluar
        keluarItem.parentElement.insertBefore(newLi, keluarItem);
    }

    window.addEventListener('load', () => {
        setTimeout(addMenuItem, 1000); // beri waktu untuk DOM selesai render
    });
})();