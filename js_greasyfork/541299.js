// ==UserScript==
// @name         Freebitco.in Smart Auto Claim - v5.0 (Full Cloudflare + Telegram)
// @namespace    http://tampermonkey.net/
// @version      5.0
// @description  Fully automated Freebitco.in auto roll with Cloudflare click, wait check, and Telegram alerts
// @author       Zaw
// @match        https://freebitco.in/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/541299/Freebitcoin%20Smart%20Auto%20Claim%20-%20v50%20%28Full%20Cloudflare%20%2B%20Telegram%29.user.js
// @updateURL https://update.greasyfork.org/scripts/541299/Freebitcoin%20Smart%20Auto%20Claim%20-%20v50%20%28Full%20Cloudflare%20%2B%20Telegram%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // ----------- Configurations -----------
    const CLAIM_INTERVAL = 60 * 60 * 1000; // 1 hour
    const FALLBACK_RELOAD = 10 * 60 * 1000; // 10 min

    const TELEGRAM_TOKEN = 'YOUR_TELEGRAM_BOT_TOKEN'; //Replace YOUR_TELEGRAM_BOT_TOKEN & YOUR_CHAT_ID with your actual values
    const TELEGRAM_CHAT_ID = 'YOUR_CHAT_ID'; //Replace YOUR_TELEGRAM_BOT_TOKEN & YOUR_CHAT_ID with your actual values

    const SELECTOR_CLAIM_BTN = "#free_play_form_button";
    const SELECTOR_CLOUDFLARE_CHECKBOX = "input[type='checkbox']";
    const SELECTOR_CLOUDFLARE_MARK = "span.mark";
    const SELECTOR_VERIFY_BTNS = [
        "input[value*='Verify']",
        "button#verify_play",
        "input[type='button'][value*='Verify']",
        "button"
    ];

    let claimed = false;

    // ----------- Telegram Alert -----------
    function sendTelegram(msg) {
        fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                chat_id: TELEGRAM_CHAT_ID,
                text: `[Freebitco.in Bot]\n${msg}`,
                parse_mode: "Markdown"
            })
        }).catch(console.error);
    }

    // ----------- Time Tracking -----------
    function getLastClaim() {
        return parseInt(localStorage.getItem("fbtc_last") || "0");
    }
    function setLastClaim(ts) {
        localStorage.setItem("fbtc_last", ts.toString());
    }

    // ----------- Wait for Element -----------
    function waitFor(selector, timeout = 20000) {
        return new Promise((resolve, reject) => {
            const start = Date.now();
            const interval = setInterval(() => {
                const el = document.querySelector(selector);
                if (el && el.offsetParent !== null && !el.disabled) {
                    clearInterval(interval);
                    resolve(el);
                } else if (Date.now() - start > timeout) {
                    clearInterval(interval);
                    reject(new Error("Timeout: " + selector));
                }
            }, 500);
        });
    }

    // ----------- Cloudflare CAPTCHA Click -----------
    async function clickCloudflareCaptcha() {
        try {
            const checkbox = await waitFor(SELECTOR_CLOUDFLARE_CHECKBOX, 8000);
            checkbox.click();
            console.log("[v5.0] Clicked CAPTCHA checkbox.");

            const mark = await waitFor(SELECTOR_CLOUDFLARE_MARK, 8000);
            mark.click();
            console.log("[v5.0] Clicked CAPTCHA mark.");
        } catch (e) {
            console.warn("[v5.0] Cloudflare click failed:", e.message);
        }
    }

    // ----------- Main Logic -----------
    async function claimFlow() {
        const now = Date.now();
        const last = getLastClaim();

        if (now - last < CLAIM_INTERVAL) {
            console.log(`[v5.0] Not time yet. Wait ${(CLAIM_INTERVAL - (now - last)) / 60000} mins`);
            return;
        }

        try {
            await clickCloudflareCaptcha();

            // Try verify buttons
            for (let sel of SELECTOR_VERIFY_BTNS) {
                try {
                    const btn = await waitFor(sel, 5000);
                    btn.click();
                    console.log("[v5.0] Clicked verify button.");
                    break;
                } catch (_) {}
            }

            const claimBtn = await waitFor(SELECTOR_CLAIM_BTN, 10000);
            claimBtn.click();
            setLastClaim(Date.now());
            claimed = true;
            sendTelegram("✅ Successfully claimed at " + new Date().toLocaleTimeString());
            console.log("[v5.0] Claim successful.");
        } catch (err) {
            sendTelegram("⚠️ Claim failed: " + err.message);
            console.error("[v5.0] Error:", err);
        }
    }

    // ----------- Fallback Timer -----------
    setTimeout(() => {
        if (!claimed) {
            console.log("[v5.0] Fallback: reload");
            sendTelegram("🔁 Reloading after 10 mins (no claim)");
            location.reload();
        }
    }, FALLBACK_RELOAD);

    // ----------- Auto Check Interval -----------
    setInterval(() => {
        if (!claimed && Date.now() - getLastClaim() >= CLAIM_INTERVAL) {
            location.reload();
        }
    }, 60000);

    // ----------- Initial Trigger -----------
    window.addEventListener("load", () => {
        setTimeout(claimFlow, 2500);
    });
})();
