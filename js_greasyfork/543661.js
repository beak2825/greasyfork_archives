// ==UserScript==
// @name         EarnBitMoon Auto Claim
// @namespace    http://tampermonkey.net/
// @version      2.6
// @description  Auto faucet + daily bonus with watchdog + static page detector
// @author       Rubystance
// @license      MIT
// @match        https://earnbitmoon.club/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/543661/EarnBitMoon%20Auto%20Claim.user.js
// @updateURL https://update.greasyfork.org/scripts/543661/EarnBitMoon%20Auto%20Claim.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let lastActivity = Date.now();
    const WATCHDOG_TIMEOUT = 60000; // 1 min

    function heartbeat(reason) {
        lastActivity = Date.now();
        console.log('[EarnBitMoon] Heartbeat:', reason);
    }

    setInterval(() => {
        if (Date.now() - lastActivity > WATCHDOG_TIMEOUT) {
            console.warn('[EarnBitMoon] Watchdog triggered. Reloading.');
            hardReload();
        }
    }, 10000);

    const HARD_RELOAD_INTERVAL = 90 * 1000;
    setInterval(() => {
        console.warn('[EarnBitMoon] Periodic hard reload.');
        hardReload();
    }, HARD_RELOAD_INTERVAL);

    function hardReload() {
        try {
            location.reload(true);
        } catch {
            window.location.href = window.location.pathname + '?r=' + Date.now();
        }
    }

    let lastTextSnapshot = '';
    let lastDomChange = Date.now();

    setInterval(() => {
        const box = document.querySelector('.alert, .alert-danger, .alert-warning');
        const text = box ? box.innerText.trim() : '';

        if (text && text === lastTextSnapshot) {
            if (Date.now() - lastDomChange > 70000) {
                console.warn('[EarnBitMoon] Page frozen detected.');
                hardReload();
            }
        } else {
            lastTextSnapshot = text;
            lastDomChange = Date.now();
        }
    }, 5000);

    const MIN_DELAY = 1000;
    const MAX_DELAY = 3000;
    const CAPTCHA_TIMEOUT = 60000;
    const RESULT_TIMEOUT = 20000;

    const sleep = ms => new Promise(r => setTimeout(r, ms));
    const randomDelay = () =>
        sleep(Math.floor(Math.random() * (MAX_DELAY - MIN_DELAY + 1)) + MIN_DELAY);

    const isVisible = el =>
        el && !el.disabled && el.offsetParent !== null;

    const smartClick = el => {
        if (!el) return;
        heartbeat('click');
        el.dispatchEvent(new MouseEvent('click', {
            bubbles: true,
            cancelable: true,
            view: window
        }));
    };

    const isCaptchaSolved = () => {
        return (
            document.querySelector('input[name="cf-turnstile-response"]')?.value?.length > 10 ||
            document.querySelector('#g-recaptcha-response')?.value?.length > 10 ||
            document.querySelector('textarea[name="h-captcha-response"]')?.value?.length > 10 ||
            document.querySelector('.iconcaptcha-wrap.solved, .iconcaptcha-done')
        );
    };

    async function checkDailyBonus() {
        heartbeat('checkDailyBonus');
        const bonusLink = document.querySelector('a[href="/bonus.html"]');
        if (bonusLink && isVisible(bonusLink)) {
            bonusLink.click();
            heartbeat('dailyBonusClick');
            return true;
        }
        return false;
    }

    async function handleBonusPage() {
        heartbeat('handleBonusPage');
        const start = Date.now();

        while (Date.now() - start < 15000) {
            const claimBtn = [...document.querySelectorAll('button')]
                .find(b => b.innerText.includes('CLAIM DAILY BONUS'));

            if (claimBtn && isVisible(claimBtn)) {
                await randomDelay();
                smartClick(claimBtn);

                const modalStart = Date.now();
                while (Date.now() - modalStart < 10000) {
                    const innerClaim = document.querySelector('#dailyBonus');
                    if (innerClaim && isVisible(innerClaim)) {
                        await randomDelay();
                        smartClick(innerClaim);
                        await sleep(4000);

                        const logo = document.querySelector('img.site-logo');
                        if (logo) logo.click();
                        else hardReload();

                        heartbeat('bonusFinished');
                        return;
                    }
                    await sleep(1000);
                }
            }
            await sleep(1000);
        }

        hardReload();
    }

    async function clickRollNow() {
        heartbeat('clickRollNow');
        const start = Date.now();

        while (Date.now() - start < 30000) {
            const btn = [...document.querySelectorAll('button, a')].find(el => {
                const text = el.innerText?.toUpperCase() || '';
                return (
                    (text.includes('ROLL NOW') || text.includes('GRAB JACKPOT')) &&
                    isVisible(el)
                );
            });

            if (btn) {
                await randomDelay();
                smartClick(btn);
                return;
            }
            await sleep(2000);
        }

        hardReload();
    }

    async function handleFaucet() {
        heartbeat('handleFaucet');
        const start = Date.now();

        while (Date.now() - start < CAPTCHA_TIMEOUT) {
            const pressBtn = document.querySelector('button.zxz');
            if (isCaptchaSolved() && isVisible(pressBtn)) {
                await randomDelay();
                smartClick(pressBtn);
                await waitForResult();
                return;
            }
            await sleep(3000);
        }

        hardReload();
    }

    async function waitForResult() {
        heartbeat('waitForResult');
        const start = Date.now();

        while (Date.now() - start < RESULT_TIMEOUT) {
            if (document.querySelector('.fa-rotate-right')) {
                heartbeat('claimFinished');
                return;
            }
            await sleep(2000);
        }

        hardReload();
    }

    async function main() {
        heartbeat('mainStart');

        if (location.pathname.includes('bonus')) {
            await handleBonusPage();
            return;
        }

        if (await checkDailyBonus()) return;

        await sleep(2000);
        await clickRollNow();
        await handleFaucet();
    }

    window.addEventListener('load', main);
})();