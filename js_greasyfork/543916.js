// ==UserScript==
// @name         BitFaucet Auto Claim Selected Coin + Multi Coin Selection Screen + Instant Currency Redirect
// @namespace    http://tampermonkey.net/
// @version      1.7
// @author       Rubystance
// @license      MIT
// @match        https://bitfaucet.net/*
// @grant        none
// @description Auto login + auto claim DOGE. Waits for Emoji captcha AND Cloudflare Turnstile backend confirmation before proceeding.
// @downloadURL https://update.greasyfork.org/scripts/543916/BitFaucet%20Auto%20Claim%20Selected%20Coin%20%2B%20Multi%20Coin%20Selection%20Screen%20%2B%20Instant%20Currency%20Redirect.user.js
// @updateURL https://update.greasyfork.org/scripts/543916/BitFaucet%20Auto%20Claim%20Selected%20Coin%20%2B%20Multi%20Coin%20Selection%20Screen%20%2B%20Instant%20Currency%20Redirect.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const EMAIL = 'YOUR_FAUCETPAY_EMAIL_HERE'; // << YOUR_FAUCETPAY_EMAIL
    const STORAGE_KEY = 'bitfaucet_selected_currency';

    const CURRENCIES = [
        'ltc','ton','doge','bch','usdt','trx','bnb','eth','sol','dash',
        'dgb','xrp','usdc','fey','zec','ada','xlm','xmr','tara','pol',
        'trump','pepe'
    ];

    function waitFor(checkFn, interval = 500, timeout = 180000) {
        return new Promise((resolve, reject) => {
            const start = Date.now();
            const timer = setInterval(() => {
                const result = checkFn();
                if (result) {
                    clearInterval(timer);
                    resolve(result);
                } else if (Date.now() - start > timeout) {
                    clearInterval(timer);
                    reject();
                }
            }, interval);
        });
    }

    function realClick(el) {
        ['mousedown', 'mouseup', 'click'].forEach(evt =>
            el.dispatchEvent(new MouseEvent(evt, { bubbles: true }))
        );
    }

    function createCurrencySelector() {
        if (document.getElementById('bf-currency-box')) return;

        const box = document.createElement('div');
        box.id = 'bf-currency-box';
        box.style = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: #111;
            color: #fff;
            padding: 10px;
            border-radius: 8px;
            z-index: 99999;
            font-family: Arial, sans-serif;
        `;

        const select = document.createElement('select');
        select.style = `padding:5px;border-radius:5px;`;

        const saved = localStorage.getItem(STORAGE_KEY) || '';

        const placeholder = document.createElement('option');
        placeholder.textContent = 'Escolher faucet';
        placeholder.disabled = true;
        placeholder.selected = !saved;
        select.appendChild(placeholder);

        CURRENCIES.forEach(c => {
            const opt = document.createElement('option');
            opt.value = c;
            opt.textContent = c.toUpperCase();
            if (c === saved) opt.selected = true;
            select.appendChild(opt);
        });

        select.addEventListener('change', () => {
            const cur = select.value;
            localStorage.setItem(STORAGE_KEY, cur);

            const target = `/faucet/currency/${cur}`;
            console.log('[Selector] Redirecting to:', target);
            location.href = target;
        });

        box.appendChild(select);
        document.body.appendChild(box);
    }

    createCurrencySelector();

    if (location.pathname === '/' || location.pathname === '/home') {
        waitFor(() => document.querySelector('input[name="wallet"]'))
            .then(input => {
                input.value = EMAIL;
                input.dispatchEvent(new Event('input', { bubbles: true }));
                return waitFor(() =>
                    document.querySelector('button.hero_form_btn:not([disabled])'),
                    500,
                    120000
                );
            })
            .then(realClick)
            .catch(() => {});
    }

    if (location.pathname.includes('/faucet/currency/')) {
        waitFor(() => {
            const t =
                document.querySelector('input[name="cf-turnstile-response"]') ||
                document.querySelector('textarea[name="cf-turnstile-response"]');
            return t && t.value && t.value.length > 20 ? t : null;
        }, 500, 180000)
        .then(() => waitFor(() =>
            document.querySelector('button.btn.sl_btn'),
            300,
            30000
        ))
        .then(realClick)
        .catch(() => {});
    }

})();
