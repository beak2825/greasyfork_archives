// ==UserScript==
// @name         Shiki: Кнопка копирования кода
// @namespace    http://shikimori.me/
// @version      1.0
// @description  Добавляет кнопку копирования для блоков кода.
// @author       pirate~
// @match        *://shikimori.tld/*
// @match        *://shikimori.one/*
// @match        *://shikimori.me/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/496272/Shiki%3A%20%D0%9A%D0%BD%D0%BE%D0%BF%D0%BA%D0%B0%20%D0%BA%D0%BE%D0%BF%D0%B8%D1%80%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D1%8F%20%D0%BA%D0%BE%D0%B4%D0%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/496272/Shiki%3A%20%D0%9A%D0%BD%D0%BE%D0%BF%D0%BA%D0%B0%20%D0%BA%D0%BE%D0%BF%D0%B8%D1%80%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D1%8F%20%D0%BA%D0%BE%D0%B4%D0%B0.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function debounce(func, wait) {
        let timeout;
        return function(...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    }

    function createCopyButton(pre) {
        const btn = document.createElement('button');
        btn.textContent = '○';
        btn.style.padding = '0 5px';
        btn.style.fontSize = '16px';
        btn.style.lineHeight = '1';
        btn.style.display = 'block';
        btn.style.cursor = 'pointer';
        btn.addEventListener('click', e => {
            const codeEl = pre.querySelector('code');
            if (!codeEl) return;
            navigator.clipboard.writeText(codeEl.innerText).then(() => {
                btn.textContent = '⦿';
                setTimeout(() => { btn.textContent = '○'; }, 2000);
            }).catch(() => {
                btn.textContent = 'ошибка';
            });
            e.stopPropagation();
        });
        return btn;
    }

    function addCopyButton(pre) {
        const existing = pre.querySelector('button');
        if (existing) { existing.remove(); }
        pre.style.position = 'relative';
        const btn = createCopyButton(pre);
        pre.insertBefore(btn, pre.firstChild);
    }

    function init() {
        document.querySelectorAll('pre.b-code-v2').forEach(pre => {
            addCopyButton(pre);
        });
    }

    const debouncedInit = debounce(init, 1000);
    init();
    const observer = new MutationObserver(debouncedInit);
    observer.observe(document.body, { childList: true, subtree: true });
    const _wrapHistoryMethod = method => {
        const orig = history[method];
        return function() {
            const ret = orig.apply(this, arguments);
            window.dispatchEvent(new Event('locationchange'));
            return ret;
        };
    };
    history.pushState = _wrapHistoryMethod('pushState');
    history.replaceState = _wrapHistoryMethod('replaceState');
    window.addEventListener('popstate', () => {
        window.dispatchEvent(new Event('locationchange'));
    });
    window.addEventListener('locationchange', () => {
        debouncedInit();
    });
    window.addEventListener('pageshow', () => {
        debouncedInit();
    });
})();
