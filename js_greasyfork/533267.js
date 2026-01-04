// ==UserScript==
// @name         удобное меню mass-check на lzt.market
// @namespace    http://tampermonkey.net/
// @version      2.2
// @description  Удаляет валидные и невалидные аккаунты, удаляет элемент accountResultList и заменяет текст ошибки на странице mass-check | теперь позволяет скачать ошибки
// @author       SteamUser | Chatgpt
// @match        https://lzt.market/mass-check/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/533267/%D1%83%D0%B4%D0%BE%D0%B1%D0%BD%D0%BE%D0%B5%20%D0%BC%D0%B5%D0%BD%D1%8E%20mass-check%20%D0%BD%D0%B0%20lztmarket.user.js
// @updateURL https://update.greasyfork.org/scripts/533267/%D1%83%D0%B4%D0%BE%D0%B1%D0%BD%D0%BE%D0%B5%20%D0%BC%D0%B5%D0%BD%D1%8E%20mass-check%20%D0%BD%D0%B0%20lztmarket.meta.js
// ==/UserScript==

(function () {
    'use strict';

    /* ---------- Утилиты ---------- */
    function hideElements(nodeList) {
        nodeList.forEach(el => {
            el.style.display = 'none';
            el.classList.add('hiddenByScript');
        });
    }

    function timestampFilename(prefix, ext) {
        const d = new Date();
        const pad = n => String(n).padStart(2, '0');
        const yyyy = d.getFullYear();
        const mm = pad(d.getMonth() + 1);
        const dd = pad(d.getDate());
        const hh = pad(d.getHours());
        const mi = pad(d.getMinutes());
        const ss = pad(d.getSeconds());
        return `${prefix}_${yyyy}-${mm}-${dd}_${hh}-${mi}-${ss}.${ext}`;
    }

    /* ---------- Кнопочные действия ---------- */
    function hideValidAccounts() {
        const validAccounts = document.querySelectorAll('.account.checked.valid');
        hideElements(validAccounts);
        const res = document.querySelector('.accountResultList');
        if (res) res.style.display = 'none';
        replaceErrorText();
    }

    function hideInvalidBadPass() {
        const invalid = document.querySelectorAll('.account.checked.error');
        const toHide = [];
        invalid.forEach(acc => {
            const txt = acc.textContent;
            if (txt.includes('Неверный логин или пароль у данного аккаунта') ||
                txt.includes('Invalid username or password for this account')) toHide.push(acc);
        });
        hideElements(toHide);
        replaceErrorText();
    }

    function downloadErrors() {
        const errAcc = document.querySelectorAll('.account.checked.error');
        const lines = [];
        errAcc.forEach(acc => {
            const link = acc.querySelector('.loginData a')?.href || '';
            const tooltip = acc.querySelector('.AccountStatus .Tooltip');
            const errText = tooltip ? (tooltip.getAttribute('data-cachedtitle') || tooltip.textContent.trim()) : '';
            lines.push(`${link} | ${errText}`);
        });
        if (!lines.length) { alert('Ошибок не найдено.'); return; }
        const blob = new Blob([lines.join('\n')], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = timestampFilename('errors', 'txt');
        document.body.appendChild(a);
        a.click();
        URL.revokeObjectURL(url);
        a.remove();
    }

    /* ---------- Замена текста ошибок ---------- */
    function replaceErrorText() {
        const tips = document.querySelectorAll('.account.checked.error .AccountStatus .Tooltip');
        tips.forEach(t => {
            const msg = t.getAttribute('data-cachedtitle');
            if (msg && !t.dataset.modified) {
                t.innerHTML = `<i class="fas fa-times redc"></i> <span style="margin-left:5px;">${msg}</span>`;
                Object.assign(t.style, { whiteSpace: 'normal', display: 'flex', alignItems: 'center', textAlign: 'left' });
                t.dataset.modified = 'true';
            }
        });
    }

    /* ---------- Кнопки ---------- */
    function createButton(text, cb, bottom) {
        const btn = Object.assign(document.createElement('button'), { textContent: text });
        btn.style.cssText = `position:fixed;right:10px;bottom:${bottom}px;padding:10px;background:#4CAF50;color:#fff;border:none;border-radius:5px;cursor:pointer;z-index:9999;`;
        btn.addEventListener('click', cb);
        document.body.appendChild(btn);
    }

    /* ---------- Инициализация ---------- */
    const int = setInterval(() => {
        replaceErrorText();
        if (!document.querySelector('.account:not(.checked)')) clearInterval(int);
    }, 1000);

    window.addEventListener('load', () => {
        createButton('Скрыть Валидные', hideValidAccounts, 90);
        createButton('Скрыть Невалид (bad pass)', hideInvalidBadPass, 130);
        createButton('Скачать ошибки', downloadErrors, 170);
    });
})();
