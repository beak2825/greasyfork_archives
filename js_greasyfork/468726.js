// ==UserScript==
// @name         Soundcloud Album Art Downloader+
// @namespace    Wizzergod
// @version      2.0.2
// @description  Allows you to download album art on the Soundcloud website, updated, no jquery, restyled, future i will try to fix cors problem for firefox, for chrome work fine.
// @author       Wizzergod
// @icon         https://www.google.com/s2/favicons?sz=64&domain=soundcloud.com
// @license      MIT
// @include      *://*.soundcloud.*/*
// @include      *://soundcloud.*/*
// @match        *://*.soundcloud.*/*
// @match        *://soundcloud.*/*
// @grant        GM_download
// @grant        GM_info
// @grant        GM_notification
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @grant        GM_addStyle
// @grant        GM_openInTab
// @connect      i1.sndcdn.com
// @connect      *
// @run-at       document-body
// @downloadURL https://update.greasyfork.org/scripts/468726/Soundcloud%20Album%20Art%20Downloader%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/468726/Soundcloud%20Album%20Art%20Downloader%2B.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Определение браузера
    const isFirefox = navigator.userAgent.toLowerCase().includes('firefox');

    // Стили
    GM_addStyle(`
        .gpt-art-img {
            width: 500px;
            height: 500px;
            margin-bottom: 15px;
            display: block;
            border: 0.1px solid var(--highlight-color);
            padding: 1px;
            border-radius: 5px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.45);
            z-index: 99991;
            margin: 10px auto 0 auto;
        }

        .gpt-art-btn {
            margin: 10px auto 0 auto;
            display: block;
            width: 100%;
            z-index: 99991;
            padding: 10px;
            background-color: var(--highlight-color) !important;
            border: 0.1px solid rgba(255, 255, 255, 0.74);
            cursor: pointer;
            border-radius: 5px;
            transition: color 0.3s ease, background-color 0.3s ease;
            text-align: center;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.45);
            font-family: 'Compacta', sans-serif;
            gap: 15px;
            font-size: 1rem;
            line-height: 1.5rem;
            opacity: 0.8;
        }

        .gpt-art-btn:hover {
            background-color: #857744c9 !important;
            border: 0.1px solid #d0e8276b;
            color: #d0ef02c2;
            box-shadow: 0 0 10px #d0e8276b;
        }

        .gpt-art-btn.missing {
            border: 2px solid red !important;
            opacity: 0.6;
        }
    `);

    const sizes = {
        't500x500': '500x500',
        't1080x1080': 'FHD 1080',
        'original': 'original size'
    };
    const regexp = /t\d{3}x\d{3}/gi;

    setInterval(() => {
        const modals = document.querySelectorAll('.modal__content:not(.appeared)');
        modals.forEach(modal => {
            modal.classList.add('appeared');
            handleModal(modal);
        });
    }, 500);

    function handleModal(modal) {
        const imageSpan = modal.querySelector('.imageContent .image .image__full');
        if (!imageSpan) {
            logError("❌ Обложка не найдена в .image__full");
            return;
        }

        const style = getComputedStyle(imageSpan);
        const match = /url\("(.+?)"\)/.exec(style.backgroundImage);
        if (!match || !match[1]) {
            logError("❌ Фон не содержит URL обложки!");
            return;
        }

        const imageURL = match[1];
        const container = modal.querySelector('.imageContent');
        if (!container) return;

        container.innerHTML = '';

        const img = document.createElement('img');
        img.src = imageURL.replace(regexp, 't500x500');
        img.className = 'gpt-art-img';
        container.appendChild(img);

        Object.entries(sizes).forEach(([key, label]) => {
            const sizedURL = key === 'original'
                ? imageURL.replace(regexp, 'original')
                : imageURL.replace(regexp, key);

            checkImageExists(sizedURL, exists => {
                const btn = makeButton(sizedURL, label, !exists, key);
                container.appendChild(btn);
            });
        });
    }

    function checkImageExists(url, callback) {
        const xhr = new XMLHttpRequest();
        xhr.open('HEAD', url, true);
        xhr.onload = () => callback(xhr.status === 200);
        xhr.onerror = () => callback(false);
        xhr.send();
    }

    function makeButton(url, label, missing = false) {
        const btn = document.createElement('button');
        btn.textContent = 'Download ' + label;
        btn.className = 'sc-button sc-button-medium sc-button-responsive gpt-art-btn';
        if (missing) {
            btn.classList.add('missing');
            btn.title = 'Файл может быть недоступен, но можно попробовать скачать';
        }

        btn.addEventListener('click', e => {
            e.preventDefault();
            if (isFirefox) {
                downloadImageFirefox(url);
            } else {
                downloadImageChrome(url);
            }
        });

        return btn;
    }

    function downloadImageChrome(url) {
        url = normalizeURL(url);
        const fileName = decodeURIComponent(url.split('/').pop());
        GM_download({
            url: url,
            name: fileName,
            onerror: e => logError("Скачивание не удалось: " + e.error)
        });
    }

    function downloadImageFirefox(url) {
        url = normalizeURL(url);
        const fileName = decodeURIComponent(url.split('/').pop());

        GM_xmlhttpRequest({
            method: 'GET',
            url: url,
            responseType: 'blob',
            onload: function (response) {
                const blob = response.response;
                const objectUrl = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = objectUrl;
                a.download = fileName;
                document.body.appendChild(a);
                a.click();
                a.remove();
                URL.revokeObjectURL(objectUrl);
            },
            onerror: function (err) {
                logError("Скачивание не удалось: " + (err.error || err.toString()));
            }
        });
    }

    function normalizeURL(url) {
        url = url.split('?')[0];
        if (!url.startsWith('http')) {
            url = window.location.protocol + (url.startsWith('//') ? '' : '//') + url;
        }
        return url;
    }

    function logError(message) {
        const scriptName = GM_info.script.name;
        GM_notification({ title: scriptName, text: message });
        console.error(`%c${scriptName}%c: ${message}`, 'font-weight: bold', 'font-weight: normal');
    }
})();
