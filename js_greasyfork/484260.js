// ==UserScript==
// @name         Adb Blocker - Aggressive & Smart (With Network Blocker)
// @namespace    http://tampermonkey.net/
// @version      2.23
// @description  Block ads, toggle button, prevents network loading
// @author       Groland
// @match        *://*/*
// @exclude      /^https?://\w+\.google\.com/.*$/
// @exclude      /^https?://\w+\.hcaptcha\.com/.*$/
// @exclude      /^https?://\w+\.funcaptcha\.com/.*$/
// @exclude      /^https?://\w+\.arkoselabs\.com/.*$/
// @exclude      /^https?://\w+\.cloudflare\.com/turnstile/.*$/
// @exclude      /^https?://\w+\.gstatic\.com/.*$/
// @exclude      /^https?://\w+\.recaptcha\.net/.*$/
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/484260/Adb%20Blocker%20-%20Aggressive%20%20Smart%20%28With%20Network%20Blocker%29.user.js
// @updateURL https://update.greasyfork.org/scripts/484260/Adb%20Blocker%20-%20Aggressive%20%20Smart%20%28With%20Network%20Blocker%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const STORAGE_KEY = 'adb_blocker_status';
    let isEnabled = localStorage.getItem(STORAGE_KEY) !== 'false';

    // =========================================================
    //              ИНТЕРФЕЙС (КНОПКА)
    // =========================================================
    function createToggleButton() {
        if (!document.body) {
            requestAnimationFrame(createToggleButton);
            return;
        }

        const btn = document.createElement('div');
        btn.id = 'adb-toggle-btn';
        updateButtonVisuals(btn);

        btn.style.cssText = `
            position: fixed; background: blue; color: #fff;  bottom: 20px; left: 20px;
            z-index: 2147483647; padding: 10px 15px;
            border-radius: 5px; font-family: Arial, sans-serif;
            font-size: 14px; font-weight: bold; cursor: pointer;
            box-shadow: 0 4px 6px rgba(0,0,0,0.3);
            transition: opacity 0.3s; opacity: 0.5; user-select: none;
        `;

        btn.onmouseenter = () => btn.style.opacity = '1';
        btn.onmouseleave = () => btn.style.opacity = '0.5';

        btn.onclick = function() {
            isEnabled = !isEnabled;
            localStorage.setItem(STORAGE_KEY, isEnabled);
            updateButtonVisuals(btn);
            location.reload();
        };

        document.body.appendChild(btn);
    }

    function updateButtonVisuals(btn) {
        if (isEnabled) {
            btn.innerText = '🛡️ ADS: BLOCKED';
            btn.style.backgroundColor = '#28a745';
            btn.style.color = 'white';
            btn.style.border = '1px solid #1e7e34';
        } else {
            btn.innerText = '⚠️ ADS: ALLOWED';
            btn.style.backgroundColor = '#dc3545';
            btn.style.color = 'white';
            btn.style.border = '1px solid #bd2130';
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', createToggleButton);
    } else {
        createToggleButton();
    }

    // =========================================================
    //              ЛОГИКА БЛОКИРОВКИ
    // =========================================================

    if (!isEnabled) {
        console.log('[Adb Blocker] Отключен пользователем.');
        return;
    }

    setInterval(function() { window.focus(); }, 10000);
    document.hasFocus = function () {return true;};

    // --- СПИСКИ ---
    const AD_DOMAINS = [
        'cryptocoinsad.com', 'a-ads.com', 'revbid.net', 'czilladx.com',
        'bmcdn6.com', 'adskeeper.com', 'netpub.io', 'netpub.ru',
        'netpub.net', 'mndlvr.com', 'atmndx.com', 'zerads.com',
        'popunder', 'popads', '#as15v6d9999gg'
    ];

    const CAPTCHA_WHITELIST = [
        'hcaptcha.com', 'google.com/recaptcha', 'funcaptcha.com',
        'arkoselabs.com', 'cloudflare.com/turnstile', 'recaptcha.net'
    ];

    const CAPTCHA_IFRAME_SELECTORS_LIST = [
        'iframe[src*="hcaptcha.com"]', 'iframe[src*="google.com/recaptcha"]',
        'iframe[src*="funcaptcha.com"]', 'iframe[src*="arkoselabs.com"]',
        'iframe[src*="cloudflare.com/turnstile"]', 'iframe[id^="hcaptcha-"]',
        'iframe[id^="g-recaptcha"]', 'iframe[class*="h-captcha"]',
        'iframe[class*="g-recaptcha"]', 'iframe[id^="cf-chl-"]'
    ];

    const AD_CONTAINER_SELECTORS = [
        '#cryptocoinsad', '.a-ads', '#sas_iframe_26322', '#as15v6d9999gg',
        'div[id*="netpub"]', 'div[id*="#sas"]', '.netpub-init',
        '.sbt-block', '.ads iframe', '[id^="mgw1880352_"]',
        '[data-widget-id="1880393"]', '[data-type="_mgwidget"]',
        '#revbid-float2 > iframe', '#revbid-footer > iframe',
        '.adbytes-display-ad', '.sbt-item-link.sbt-item-text'
    ];

    // =========================================================
    //      СЕКЦИЯ 0: СЕТЕВОЙ ПЕРЕХВАТЧИК (БЛОКИРОВКА ЗАГРУЗКИ)
    // =========================================================

    // Проверка URL на наличие рекламы
    function isAdUrl(url) {
        if (!url) return false;
        const urlStr = url.toString().toLowerCase();

        // Сначала проверяем белый список капчи
        if (CAPTCHA_WHITELIST.some(w => urlStr.includes(w))) return false;

        // Проверяем черный список рекламы
        return AD_DOMAINS.some(d => urlStr.includes(d));
    }

    // 1. Перехват Fetch
    const originalFetch = window.fetch;
    window.fetch = function(input, init) {
        let url = input;
        if (input instanceof Request) {
            url = input.url;
        }
        if (isAdUrl(url)) {
            console.log(`[Adb Network] Fetch заблокирован: ${url}`);
            return Promise.reject(new TypeError('Network request blocked by Adb Blocker'));
        }
        return originalFetch.apply(this, arguments);
    };

    // 2. Перехват XMLHttpRequest (AJAX)
    const originalOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function(method, url) {
        if (isAdUrl(url)) {
            console.log(`[Adb Network] XHR заблокирован: ${url}`);
            // Подменяем URL на "пустышку", чтобы запрос ушел в никуда
            // Полностью отменить сложнее без ошибок в консоли, но это предотвратит загрузку данных
            arguments[1] = '/blocked-by-userscript';
        }
        return originalOpen.apply(this, arguments);
    };

    // =========================================================
    //      СЕКЦИЯ 1: CSS-БЛОКИРОВКА
    // =========================================================
    const CAPTCHA_NOT_SELECTOR = CAPTCHA_IFRAME_SELECTORS_LIST.map(sel => `:not(${sel})`).join('');
    const style = document.createElement('style');
    style.textContent = `
        ${AD_CONTAINER_SELECTORS.join(', ')},
        iframe${CAPTCHA_NOT_SELECTOR},
        ${AD_DOMAINS.map(d => `iframe[src*="${d}"]`).join(', ')}
        {
            display: none !important; visibility: hidden !important;
            width: 0 !important; height: 0 !important;
            position: absolute !important; left: -9999px !important;
        }
    `;
    (document.head || document.documentElement).appendChild(style);

    // =========================================================
    //      СЕКЦИЯ 2: DOM-ОЧИСТКА И ОСТАНОВКА ЗАГРУЗКИ
    // =========================================================
    const CAPTCHA_EXCLUSION_CHECK =
        'iframe[src*="hcaptcha.com"], iframe[src*="google.com/recaptcha"],' +
        'iframe[src*="funcaptcha.com"], iframe[src*="arkoselabs.com"],' +
        'iframe[id^="hcaptcha-"], .anticap-toggle, .g-recaptcha > div > div,' +
        '.mb-4.anti-captcha, .mb-4.anti-captcha > div, iframe[id^="g-recaptcha"],' +
        'iframe[class*="h-captcha"], iframe[class*="g-recaptcha"]';

    function cleanAdsDynamically() {
        let count = 0;

        // Очистка элементов по домену
        AD_DOMAINS.forEach(d => {
            document.querySelectorAll(
                `script[src*="${d}"], img[src*="${d}"], iframe[src*="${d}"]`
            ).forEach(el => {
                // ПРЕДОТВРАЩЕНИЕ ЗАГРУЗКИ: Обнуляем src перед удалением
                el.src = '';
                el.removeAttribute('src');
                el.remove();
                count++;
            });
        });

        // Очистка контейнеров
        AD_CONTAINER_SELECTORS.forEach(sel => {
            document.querySelectorAll(sel).forEach(el => {
                if (el.tagName === 'IFRAME' && el.matches(CAPTCHA_EXCLUSION_CHECK)) return;
                if (el.querySelector(CAPTCHA_EXCLUSION_CHECK)) return;

                // Если это iframe внутри контейнера, убиваем его загрузку
                const iframes = el.querySelectorAll('iframe');
                iframes.forEach(ifr => { ifr.src = ''; });

                el.remove();
                count++;
            });
        });

        document.querySelectorAll('.el-tooltip__trigger.is-disabled.el-button--primary.el-button')
            .forEach(btn => {
                if (btn.classList.contains('is-disabled')) {
                    btn.classList.remove('is-disabled');
                    btn.disabled = false;
                }
            });
    }

    const observer = new MutationObserver(() => cleanAdsDynamically());
    function startObserver() {
        if (document.documentElement) {
            observer.observe(document.documentElement, { childList: true, subtree: true });
            console.log('[Adb Blocker] Observer + NetBlocker запущены.');
            cleanAdsDynamically();
        } else {
            setTimeout(startObserver, 50);
        }
    }
    startObserver();

})();
