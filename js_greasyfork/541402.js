// ==UserScript==
// @name         Freebitco.in Smart Auto Claim v5.1 (Cloudflare + Mobile Safe)
// @namespace    http://tampermonkey.net/
// @version      5.1
// @description  Freebitco.in auto claim with Cloudflare bypass, verify, roll, and Telegram alerts (mobile-safe)
// @match        https://freebitco.in/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/541402/Freebitcoin%20Smart%20Auto%20Claim%20v51%20%28Cloudflare%20%2B%20Mobile%20Safe%29.user.js
// @updateURL https://update.greasyfork.org/scripts/541402/Freebitcoin%20Smart%20Auto%20Claim%20v51%20%28Cloudflare%20%2B%20Mobile%20Safe%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const CLAIM_INTERVAL = 60 * 60 * 1000;  // 1 hour
    const FALLBACK_RELOAD = 10 * 60 * 1000; // 10 minutes
    const TELEGRAM_TOKEN = 'YOUR_TELEGRAM_BOT_TOKEN'; //Replace YOUR_TELEGRAM_BOT_TOKEN
    const TELEGRAM_CHAT_ID = 'YOUR_CHAT_ID'; //Replace YOUR_TELEGRAM_CHAT_ID

    let claimed = false;

    function sendTelegram(msg) {
        fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({chat_id: TELEGRAM_CHAT_ID, text: `[Freebitco.in]\n${msg}`})
        }).catch(console.error);
    }

    function getLast() {
        return parseInt(localStorage.getItem("fbtc_last") || "0");
    }
    function setLast(ts) {
        localStorage.setItem("fbtc_last", ts);
    }

    function wait(ms) {
        return new Promise(r => setTimeout(r, ms));
    }

    // Poll for Cloudflare challenge done
    async function waitForCloudflare(timeout = 20000) {
        const start = Date.now();
        while (Date.now() - start < timeout) {
            const cf = document.querySelector("div[data-translate='checking_browser']");
            if (!cf) return;
            await wait(500);
        }
        throw new Error("Cloudflare timeout");
    }

    // Try clicking verify button
    async function clickVerify() {
        const btn = document.querySelector("input[value*='Verify'], button#verify_play");
        if (btn) {
            btn.click();
            console.log("[v5.1] clicked verify");
            await wait(5000);
        }
    }

    // Try clicking roll button
    async function clickRoll() {
        const roll = document.querySelector("#free_play_form_button");
        if (roll) {
            roll.click();
            console.log("[v5.1] clicked roll");
            claimed = true;
            setLast(Date.now());
            sendTelegram("✅ Claimed at " + new Date().toLocaleTimeString());
            return true;
        }
        throw new Error("ROLL not found");
    }

    async function claimFlow() {
        const now = Date.now(), last = getLast();
        if (now - last < CLAIM_INTERVAL) return;

        claimed = false;
        try {
            await waitForCloudflare();
            await clickVerify();
            await clickRoll();
        } catch (err) {
            console.warn("[v5.1]", err.message);
            sendTelegram("⚠️ Claim failed: " + err.message);
        }
    }

    // Fallback & auto-retry
    setTimeout(() => { if (!claimed) location.reload(); }, FALLBACK_RELOAD);
    setInterval(() => {
        if (!claimed && Date.now() - getLast() >= CLAIM_INTERVAL) location.reload();
    }, 60000);

    // Start flow after load
    window.addEventListener("load", () => setTimeout(claimFlow, 3000));

})();
