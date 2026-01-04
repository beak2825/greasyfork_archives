// ==UserScript==
// @name         LZT КТ ЧЕКЕР МАСС (Оптимизированный)
// @namespace    http://tampermonkey.net/
// @version      3.0
// @description  БОЛЬШАЯ ОБНОВА ТУТ - https://lolz.live/threads/8125203/ \ Проверка профилей Steam на LZT Market с исправленной структурой поиска и устранением просадок скорости
// @author       steamuser | chatgpt
// @license MIT
// @match        https://lzt.market/*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/523222/LZT%20%D0%9A%D0%A2%20%D0%A7%D0%95%D0%9A%D0%95%D0%A0%20%D0%9C%D0%90%D0%A1%D0%A1%20%28%D0%9E%D0%BF%D1%82%D0%B8%D0%BC%D0%B8%D0%B7%D0%B8%D1%80%D0%BE%D0%B2%D0%B0%D0%BD%D0%BD%D1%8B%D0%B9%29.user.js
// @updateURL https://update.greasyfork.org/scripts/523222/LZT%20%D0%9A%D0%A2%20%D0%A7%D0%95%D0%9A%D0%95%D0%A0%20%D0%9C%D0%90%D0%A1%D0%A1%20%28%D0%9E%D0%BF%D1%82%D0%B8%D0%BC%D0%B8%D0%B7%D0%B8%D1%80%D0%BE%D0%B2%D0%B0%D0%BD%D0%BD%D1%8B%D0%B9%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const logEnabled = false;

    const MAX_CONCURRENT_REQUESTS = 5;
    const MAX_RETRIES = 3;
    let currentRequests = 0;

    GM_addStyle(`
        .kt-flag, .no-flag, .error-flag {
            display: inline-block;
            width: 65px;
            height: 50px;
            color: white;
            font-size: 20px;
            font-weight: bold;
            border-radius: 5px;
            text-align: center;
            line-height: 50px;
            position: absolute;
            right: -80px;
            top: 10px;
        }
        .kt-flag { background-color: red; }
        .no-flag { background-color: green; }
        .error-flag { background-color: orange; }
    `);

    function addFlag(container, flagType) {
        if (!container.querySelector('.kt-flag, .no-flag, .error-flag')) {
            const flag = document.createElement('div');
            flag.className = flagType;
            flag.textContent = flagType === 'kt-flag' ? 'KT' : flagType === 'no-flag' ? 'NO' : 'ER';
            container.appendChild(flag);
            container.classList.add('processed');
        }
    }

    function findSteamLink(accountElement) {
        return accountElement.querySelector('.marketIndexItem--topContainer a[href*="steamcommunity.com/profiles/"]')?.href || null;
    }

    async function checkAccount(accountElement, retries = 0) {
        const steamProfileUrl = findSteamLink(accountElement);
        if (!steamProfileUrl) {
            addFlag(accountElement, 'error-flag');
            return;
        }

        return new Promise((resolve) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: steamProfileUrl,
                onload: function(response) {
                    if (response.status === 200) {
                        const parser = new DOMParser();
                        const doc = parser.parseFromString(response.responseText, 'text/html');
                        const element = doc.querySelector('div.responsive_count_link_area');
                        addFlag(accountElement, element ? 'no-flag' : 'kt-flag');
                    } else {
                        retries < MAX_RETRIES ? setTimeout(() => checkAccount(accountElement, retries + 1), 2000) : addFlag(accountElement, 'error-flag');
                    }
                    currentRequests--;
                    resolve();
                },
                onerror: function() {
                    retries < MAX_RETRIES ? setTimeout(() => checkAccount(accountElement, retries + 1), 2000) : addFlag(accountElement, 'error-flag');
                    currentRequests--;
                    resolve();
                }
            });
        });
    }

    async function processQueue(accountElements) {
        const queue = [];
        for (const accountElement of accountElements) {
            if (currentRequests < MAX_CONCURRENT_REQUESTS) {
                currentRequests++;
                queue.push(checkAccount(accountElement));
            }
            if (queue.length >= MAX_CONCURRENT_REQUESTS) {
                await Promise.race(queue);
                queue.splice(queue.findIndex(p => p.resolved), 1);
            }
        }
        await Promise.all(queue);
    }

    function checkAccounts() {
        const accountElements = document.querySelectorAll('.marketIndexItem:not(.processed)');
        if (accountElements.length > 0) {
            processQueue(accountElements);
        }
    }

    function resetProcessing() {
        document.querySelectorAll('.marketIndexItem.processed').forEach(el => el.classList.remove('processed'));
    }

    let observer = new MutationObserver(() => {
        checkAccounts();
    });

    observer.observe(document.body, { childList: true, subtree: true });

    setInterval(() => {
        checkAccounts();
        if (currentRequests === 0) {
            resetProcessing(); // Убираем метки "processed", чтобы избежать замедления
        }
    }, 2000);
})();
