// ==UserScript==
// @name         SENSE Grammar Fixer for Agma.io & Cellcraft.io
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Rewrite your chat messages into natural English before sending
// @author       S E N S E
// @match        *://agma.io/*
// @match        *://cellcraft.io/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/545531/SENSE%20Grammar%20Fixer%20for%20Agmaio%20%20Cellcraftio.user.js
// @updateURL https://update.greasyfork.org/scripts/545531/SENSE%20Grammar%20Fixer%20for%20Agmaio%20%20Cellcraftio.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let enabled = GM_getValue("sense_enabled", false);
    let apiKey = GM_getValue("sense_apiKey", "");

    // --- Create SENSE Menu ---
    const btn = document.createElement("div");
    btn.innerText = "S E N S E";
    btn.style.position = "fixed";
    btn.style.bottom = "50px";
    btn.style.right = "20px";
    btn.style.background = "#222";
    btn.style.color = "#fff";
    btn.style.padding = "8px 12px";
    btn.style.borderRadius = "6px";
    btn.style.fontSize = "14px";
    btn.style.cursor = "pointer";
    btn.style.zIndex = "99999";
    btn.style.fontFamily = "Arial, sans-serif";
    document.body.appendChild(btn);

    btn.onclick = function () {
        let choice = prompt(
            "S E N S E Menu:\n1. Toggle ON/OFF (current: " + (enabled ? "ON" : "OFF") + ")\n2. Set API Key\nEnter 1 or 2:"
        );
        if (choice === "1") {
            enabled = !enabled;
            GM_setValue("sense_enabled", enabled);
            alert("SENSE is now " + (enabled ? "ENABLED" : "DISABLED"));
        } else if (choice === "2") {
            let key = prompt("Enter your OpenAI API Key:");
            if (key) {
                apiKey = key;
                GM_setValue("sense_apiKey", key);
                alert("API Key saved!");
            }
        }
    };

    // --- Listen for chat send ---
    document.addEventListener("keydown", function (e) {
        if (!enabled || !apiKey) return;
        if (e.key === "Enter") {
            let chatInput = document.querySelector("input[type=text]");
            if (chatInput && chatInput.value.trim() !== "") {
                e.preventDefault();
                let originalText = chatInput.value.trim();
                fixGrammar(originalText, function (fixedText) {
                    chatInput.value = fixedText || originalText;
                    let evt = new KeyboardEvent("keydown", { key: "Enter" });
                    chatInput.dispatchEvent(evt);
                });
            }
        }
    });

    function fixGrammar(text, callback) {
        GM_xmlhttpRequest({
            method: "POST",
            url: "https://api.openai.com/v1/chat/completions",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + apiKey
            },
            data: JSON.stringify({
                model: "gpt-3.5-turbo",
                messages: [
                    { role: "system", content: "You are a grammar corrector. Rewrite messages into natural English while keeping meaning." },
                    { role: "user", content: text }
                ],
                max_tokens: 60,
                temperature: 0.3
            }),
            onload: function (res) {
                try {
                    let json = JSON.parse(res.responseText);
                    let fixed = json.choices[0].message.content.trim();
                    callback(fixed);
                } catch (err) {
                    console.error("Grammar fix failed:", err);
                    callback(null);
                }
            },
            onerror: function () {
                console.error("Error contacting API");
                callback(null);
            }
        });
    }

})();