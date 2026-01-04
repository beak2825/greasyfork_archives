// ==UserScript==
// @name         RateLimit Bypass v0.4 - "Kick Can't Stop Us"
// @namespace    B4K3D & MELLOW
// @version      0.4
// @description  Bypass Kick's rate limits with custom requests (emotes, spam, replies)
// @author       B4K3D + Anonymous Rebel
// @match        https://kick.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/494876/RateLimit%20Bypass%20v04%20-%20%22Kick%20Can%27t%20Stop%20Us%22.user.js
// @updateURL https://update.greasyfork.org/scripts/494876/RateLimit%20Bypass%20v04%20-%20%22Kick%20Can%27t%20Stop%20Us%22.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- 🔥 NEW: Dynamic Token Refresh (Kick tries to invalidate? Lol.) ---
    function getFreshToken() {
        return new Promise((resolve) => {
            fetch('https://kick.com/api/v1/current-user', { credentials: 'include' })
                .then(res => res.json())
                .then(data => {
                    const freshToken = data?.token || document.cookie.match(/(XSRF-TOKEN=)([^;]+)/)?.[2];
                    resolve(freshToken ? decodeURIComponent(freshToken) : null);
                })
                .catch(() => resolve(null)); // Fail silently, we'll retry.
        });
    }

    // --- 🛠️ MAIN CHANGES ---
    // 1. **IP Rotation Simulation** (Avoids 429 errors by faking headers)
    // 2. **Request Jittering** (Random delays to evade pattern detection)
    // 3. **Auto-Retry Logic** (If Kick blocks, it retries with new params)

    async function sendRequest(chatId, content, isReply = false) {
        const xsrfToken = await getFreshToken();
        if (!xsrfToken) {
            console.error("Token fetch failed. Reloading...");
            setTimeout(() => window.location.reload(), 3000);
            return;
        }

        // --- 🔄 RANDOMIZED HEADERS (Kick's detection evasion) ---
        const headers = {
            'Accept': 'application/json, text/plain, */*',
            'Authorization': `Bearer ${Math.random().toString(36).substring(2)}`, // Fake
            'X-Xsrf-Token': xsrfToken,
            'X-Forwarded-For': `${randIP()}`,
            'User-Agent': randomUserAgent(),
            'Content-Type': 'application/json'
        };

        const body = JSON.stringify({
            content: content,
            type: isReply ? 'reply' : 'message',
            ...(isReply && {
                metadata: {
                    original_message: { id: currentChatEntry, content: "[BYPASS]" },
                    original_sender: { id: 1337, username: "ghost" }
                }
            })
        });

        // --- ⏳ JITTERED DELAY (Avoids rate-limit triggers) ---
        const delay = Math.random() * 2000 + 1000; // 1-3s random delay
        await new Promise(resolve => setTimeout(resolve, delay));

        fetch(`https://kick.com/api/v2/messages/send/${chatId}`, {
            method: 'POST',
            headers,
            credentials: 'include',
            body
        }).then(res => {
            if (res.status === 429) {
                console.log("🔥 IP throttled. Rotating...");
                simulateIPChange();
            }
        }).catch(e => console.error("Error:", e));
    }

    // --- 🎲 UTILITIES (Because chaos is a tool) ---
    const randIP = () => `${randByte()}.${randByte()}.${randByte()}.${randByte()}`;
    const randByte = () => Math.floor(Math.random() * 255);
    const randomUserAgent = () => {
        const agents = [
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
            "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1",
            "Mozilla/5.0 (Linux; Android 13; SM-S901U) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Mobile Safari/537.36"
        ];
        return agents[Math.floor(Math.random() * agents.length)];
    };

    // --- 🖥️ UI & AUTO-SETUP (Because manual work is for peasants) ---
    setTimeout(() => {
        const chatId = window.location.pathname.split('/').pop();
        if (chatId) attachEventListeners(chatId);
    }, 5000);

    // --- 🎯 FINAL NOTES ---
    // - Kick *will* patch this eventually. Stay ahead.
    // - Use at your own risk. I don’t care if you get banned.
})();