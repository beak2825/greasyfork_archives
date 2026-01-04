// ==UserScript==
// @name         Кнопка скачать для больших файлов
// @namespace    http://tampermonkey.net/
// @version      2025-04-10
// @description  Скрипт Tampermonkey для скачивания файлов с Яндекс.Диска без установки клиента
// @author       You
// @match        https://disk.yandex.ru/d/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=yandex.ru
// @run-at        document-start
// @license GNU AGPLv3
// @downloadURL https://update.greasyfork.org/scripts/532449/%D0%9A%D0%BD%D0%BE%D0%BF%D0%BA%D0%B0%20%D1%81%D0%BA%D0%B0%D1%87%D0%B0%D1%82%D1%8C%20%D0%B4%D0%BB%D1%8F%20%D0%B1%D0%BE%D0%BB%D1%8C%D1%88%D0%B8%D1%85%20%D1%84%D0%B0%D0%B9%D0%BB%D0%BE%D0%B2.user.js
// @updateURL https://update.greasyfork.org/scripts/532449/%D0%9A%D0%BD%D0%BE%D0%BF%D0%BA%D0%B0%20%D1%81%D0%BA%D0%B0%D1%87%D0%B0%D1%82%D1%8C%20%D0%B4%D0%BB%D1%8F%20%D0%B1%D0%BE%D0%BB%D1%8C%D1%88%D0%B8%D1%85%20%D1%84%D0%B0%D0%B9%D0%BB%D0%BE%D0%B2.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function addCustomStyles() {
        const style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = `
            button.DownloadBtn {
    margin-left: 12px;
    margin-right: 12px;
}
        `;
        document.head.appendChild(style);
    }

    const getDownloadLink = () => {
        return new Promise((resolve,reject)=>{
            const obj = JSON.parse(document.querySelector(`#store-prefetch`).textContent);
            const actions = document.querySelector(".action-buttons");
            const fiberNode = actions[Object.keys(actions).find(k => k.startsWith('__reactInternal'))];
            const currentId = fiberNode.memoizedProps.children.find(e=>e.props?.resourceId)?.props.resourceId;
            const currentDir = obj.resources[currentId];
            const downloadData = {"hash":currentDir.hash,"sk":obj.environment.sk,"uid":obj.user.id}
            fetch("https://disk.yandex.ru/public/api/download-url", {
                "headers": {
                    "accept": "*/*",
                    "accept-language": "ru,tr;q=0.9,he;q=0.8,ar;q=0.7,en-US;q=0.6,en;q=0.5,bg;q=0.4",
                    "cache-control": "no-cache",
                    "content-type": "text/plain",
                    "pragma": "no-cache",
                    "sec-ch-ua": "\"Chromium\";v=\"134\", \"Not:A-Brand\";v=\"24\", \"Google Chrome\";v=\"134\"",
                    "sec-ch-ua-mobile": "?0",
                    "sec-ch-ua-platform": "\"Windows\"",
                    "sec-fetch-dest": "empty",
                    "sec-fetch-mode": "cors",
                    "sec-fetch-site": "same-origin",
                    "x-requested-with": "XMLHttpRequest",
                    "x-retpath-y": location.href
                },
                "referrer": location.href,
                "referrerPolicy": "strict-origin-when-cross-origin",
                "body": encodeURIComponent(JSON.stringify(downloadData)),
                "method": "POST",
                "mode": "cors",
                "credentials": "include"
            }).then(e=>e.json()).then(e=>resolve(e.data.url)).catch(e=>reject(e))
        })
    }

    function createDownloadButton() {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'DownloadBtn Button2 Button2_view_raised Button2_size_m download-button action-buttons__button action-buttons__button_download';
        button.setAttribute('aria-disabled', 'false');
        button.setAttribute('autocomplete', 'off');

        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
        svg.setAttribute('xmlns:xlink', 'http://www.w3.org/1999/xlink');
        svg.setAttribute('focusable', 'false');
        svg.setAttribute('aria-hidden', 'true');
        svg.setAttribute('width', '16');
        svg.setAttribute('height', '16');
        svg.setAttribute('viewBox', '0 0 16 16');

        const path1 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path1.setAttribute('fill', 'currentColor');
        path1.setAttribute('d', 'M10.632 4.843 8.803 6.672V1h-2v5.672L4.975 4.843 3.56 6.257 7.803 10.5l4.243-4.243z');

        const path2 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path2.setAttribute('fill', 'currentColor');
        path2.setAttribute('d', 'M1 12V8h2v4a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V8h2v4a3 3 0 0 1-3 3H4a3 3 0 0 1-3-3');

        svg.appendChild(path1);
        svg.appendChild(path2);

        const textSpan = document.createElement('span');
        textSpan.className = 'Button2-Text';
        textSpan.textContent = 'Без установки Я.Диска';

        const iconSpan = document.createElement('span');
        iconSpan.className = 'Button2-Icon Button2-Icon_side_left';
        iconSpan.appendChild(svg);

        button.appendChild(iconSpan);
        button.appendChild(textSpan);

        button.addEventListener('click',()=>{
            getDownloadLink().then(e=>window.open(e,"_blank"))
        });

        return button;
    }

    function addDownloadButton() {
        const actionButtons = document.querySelector('.action-buttons');
        if (actionButtons && !document.querySelector('.DownloadBtn')) {
            const downloadButton = createDownloadButton();
            actionButtons.appendChild(downloadButton);
            addCustomStyles();
        } else {
            console.warn('Элемент .action-buttons не найден на странице.');
        }
    }

    window.addEventListener('load', () => {
        addDownloadButton();

        const observer = new MutationObserver(() => {
            addDownloadButton();
            observer.disconnect();
        });

        observer.observe(document.body, { childList: true, subtree: true });
    });
})();