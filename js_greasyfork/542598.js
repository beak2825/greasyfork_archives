// ==UserScript==
// @name         LEMO系統 施工地點複製
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  在施工地點欄位旁增加按鈕，點擊可以複製該施工地點文字內容
// @author       shanlan(grok-code-fast-1)
// @match        https://cemiscrm.cht.com.tw/Cemis_web/Localization/data_access_2
// @icon         https://www.google.com/s2/favicons?sz=64&domain=cht.com.tw
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/542598/LEMO%E7%B3%BB%E7%B5%B1%20%E6%96%BD%E5%B7%A5%E5%9C%B0%E9%BB%9E%E8%A4%87%E8%A3%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/542598/LEMO%E7%B3%BB%E7%B5%B1%20%E6%96%BD%E5%B7%A5%E5%9C%B0%E9%BB%9E%E8%A4%87%E8%A3%BD.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const timer = setInterval(() => {
        const table = document.querySelector('table.word');
        if (!table) return;

        const headers = table.querySelectorAll('tr:first-child td');
        const idx = Array.from(headers).findIndex(th => th.textContent.includes('施工地點'));
        if (idx < 0 || headers[idx].querySelector('.copy-btn')) return;

        const btn = document.createElement('button');
        btn.textContent = '複製全部';
        btn.className = 'copy-btn';
        btn.type = 'button';
        btn.style.cssText =
            'color: #ffffff;' +
            'background-color: #5bc0de;' +
            'border: 1px solid #46b8da;' +
            'margin-left: 8px;' +
            'border-radius: 4px;';

        btn.addEventListener('click', () => {
            const rows = table.querySelectorAll('tr');
            const locs = Array.from(rows).slice(1)
                .map(r => r.querySelectorAll('td')[idx]?.textContent.trim())
                .filter(t => t);
            if (!locs.length) {
                showToast('無施工地點資料');
                return;
            }
            const text = locs.join('\n');
            navigator.clipboard.writeText(text)
                .then(() => showToast(`已複製 ${locs.length} 筆施工地點`))
                .catch(() => showToast('複製失敗'));
        });

        headers[idx].appendChild(btn);
        clearInterval(timer);
    }, 500);

    function showToast(message) {
        const toast = document.createElement('div');
        toast.textContent = message;
        toast.style.cssText =
            'position: fixed;' +
            'top: 50%;' +
            'left: 50%;' +
            'transform: translate(-50%, -50%) scale(0.98);' +
            'background: rgba(0,0,0,0.8);' +
            'backdrop-filter: blur(10px) saturate(140%);' +
            '-webkit-backdrop-filter: blur(10px) saturate(140%);' +
            'color: #fff;' +
            'padding: 14px 22px;' +
            'border-radius: 12px;' +
            'border: 1px solid rgba(255,255,255,0.3);' +
            'z-index: 10000;' +
            'font-size: 16px;' +
            'box-shadow: 0 10px 30px rgba(0,0,0,0.50);' +
            'opacity: 0;' +
            'transition: opacity 0.35s ease, transform 0.35s ease;';
        document.body.appendChild(toast);
        setTimeout(() => {
            toast.style.opacity = '1';
            toast.style.transform = 'translate(-50%, -50%) scale(1)';
        }, 10);
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translate(-50%, -50%) scale(0.98)';
            setTimeout(() => {
                toast.remove();
            }, 350);
        }, 2000);
    }
})();