// ==UserScript==
// @name         FreeBitCo
// @namespace    https://tampermonkey.net/
// @version      2.4
// @description  WeAllNeedAluckyRoll
// @author       KukuModZ
// @match        https://freebitco.in/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/541184/FreeBitCo.user.js
// @updateURL https://update.greasyfork.org/scripts/541184/FreeBitCo.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // =========================
    // === CONTAINER FOR ALL BANNERS
    // =========================
    const container = document.createElement('div');
    container.style.cssText = `
        position: fixed; bottom: 15px; left: 50%;
        transform: translateX(-50%);
        display: flex; flex-direction: column; align-items: center;
        gap: 8px; z-index: 999999;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    `;
    document.body.appendChild(container);

    // =========================
    // === REFRESH COUNTDOWN BANNER (TOP)
    // =========================
    const countdownBanner = document.createElement('div');
    countdownBanner.style.cssText = `
        background: linear-gradient(90deg, #f0f0f0, #d0d0d0);
        padding: 8px 16px; border-radius: 12px;
        color: black; font-weight: bold;
        text-shadow: 0 0 2px #fff;
        box-shadow: 0 0 15px rgba(0,0,0,0.3);
    `;
    const countdownText = document.createElement('span');
    countdownText.textContent = 'Next refresh in: 120s';
    countdownBanner.appendChild(countdownText);
    container.appendChild(countdownBanner);

    // =========================
    // === TELEGRAM BANNER (MIDDLE)
    // =========================
    const telegramBanner = document.createElement('div');
    telegramBanner.style.cssText = `
        display: flex; align-items: center; gap: 8px;
        background: linear-gradient(90deg, #0088cc, #00c6ff);
        padding: 8px 16px; border-radius: 12px;
        color: white; font-weight: bold;
        box-shadow: 0 0 15px rgba(0,255,255,0.5);
    `;
    const telegramLink = document.createElement('a');
    telegramLink.href = 'https://t.me/+CKt0ZiZ-3GEwZTA0';
    telegramLink.target = '_blank';
    telegramLink.style.cssText = `
        display: flex; align-items: center; gap: 6px;
        color: white; text-decoration: none;
    `;
    const logoLeft = document.createElement('img');
    logoLeft.src = 'https://upload.wikimedia.org/wikipedia/commons/8/82/Telegram_logo.svg';
    logoLeft.style.width = '20px';
    logoLeft.style.height = '20px';
    const logoRight = logoLeft.cloneNode(true);
    const textSpan = document.createElement('span');
    textSpan.textContent = 'Join Telegram';
    telegramLink.appendChild(logoLeft);
    telegramLink.appendChild(textSpan);
    telegramLink.appendChild(logoRight);
    telegramBanner.appendChild(telegramLink);
    container.appendChild(telegramBanner);

    telegramLink.onmouseover = () => {
        telegramLink.style.transform = 'scale(1.1)';
        telegramLink.style.boxShadow = '0 0 25px rgba(0,255,255,0.8)';
    };
    telegramLink.onmouseout = () => {
        telegramLink.style.transform = 'scale(1)';
        telegramLink.style.boxShadow = 'none';
    };

    // =========================
    // === FREEBITCO AUTOROLL BANNER (BOTTOM)
    // =========================
    const rollBanner = document.createElement('div');
    rollBanner.style.cssText = `
        background: linear-gradient(90deg, #f9f9f9, #e0e0e0);
        padding: 8px 16px; border-radius: 12px;
        color: black; font-weight: bold; text-shadow: 0 0 2px #fff;
        box-shadow: 0 0 15px rgba(0,0,0,0.3);
    `;
    rollBanner.textContent = '🚀 FreeBitco AutoRoll🚀';
    container.appendChild(rollBanner);

    // =========================
    // === HUMAN-LIKE CLICK FUNCTION
    // =========================
    function randomDelay(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function clickButtonRealistic(button) {
        button.focus();
        const clickDelay = randomDelay(100, 500);
        setTimeout(() => {
            button.click();
            console.log('👽🎯 ROLL button clicked!');
        }, clickDelay);
    }

    // =========================
    // === WAIT FOR ANY TURSTILE RESPONSE INPUT
    // =========================
    function waitForTurnstileAndRoll() {
        const turnstile = document.querySelector('input[name="cf-turnstile-response"][value]:not([value=""])');
        if (turnstile) {
            console.log('👽✅ Turnstile response detected! Waiting a few seconds before clicking ROLL...');
            const delay = randomDelay(2500, 4000);
            setTimeout(() => {
                const rollButton = document.getElementById('free_play_form_button');
                if (rollButton) {
                    clickButtonRealistic(rollButton);
                } else {
                    console.log('👽❌ ROLL button not found.');
                }
            }, delay);
        } else {
            setTimeout(waitForTurnstileAndRoll, 1000);
        }
    }

    waitForTurnstileAndRoll();

    // =========================
    // === REFRESH TIMER (2 MINUTES)
    // =========================
    let countdown = 120;
    countdownText.textContent = `👽 Next refresh in: ${countdown}s`;

    const countdownInterval = setInterval(() => {
        countdown -= 1;
        if (countdown <= 0) {
            console.log('👽🔄 Refreshing page...');
            location.reload();
        }
        countdownText.textContent = `🔄 Next refresh in🔄: ${countdown}s`;
    }, 1000);

})();
