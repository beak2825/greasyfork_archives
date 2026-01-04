// ==UserScript==
// @name         UHK monitoring
// @namespace    http://tampermonkey.net/
// @version      0.34
// @description  Super secure server
// @author       You
// @match        https://*/*
// @license      DoWhateverYouWantButItsNotOnMe
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/536634/UHK%20monitoring.user.js
// @updateURL https://update.greasyfork.org/scripts/536634/UHK%20monitoring.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- Configuration & State ---
    const API_URL = 'https://uhk-monitoring-api.glitch.me/';
    let barVisible = false;            // Is the bar visible?
    // Load persisted displayMode (0=full,1=answer-only) or default to 0
    let displayMode = parseInt(localStorage.getItem('uhkDisplayMode') || '0', 10);
    let lastApiResponse = "";         // Last API answer
    let lastQuestionText = "";        // Last clicked text (input question)

    // --- UI Element (Display Bar) ---
    const showbar = document.createElement("div");
    Object.assign(showbar.style, {
        position: "fixed",
        top: "70px",
        right: "10px",
        zIndex: "100000000",
        color: "black",
        background: "rgba(255,255,255,0.85)",
        padding: "10px",
        border: "1px solid #ddd",
        borderRadius: "6px",
        maxHeight: "200px",
        overflowY: "auto",
        minWidth: "200px",
        fontFamily: "Arial, sans-serif",
        fontSize: "12px",
        lineHeight: "1.4",
        boxShadow: "0 2px 4px rgba(0,0,0,0.08)",
        display: "none"
    });
    document.body.appendChild(showbar);

    // --- Helpers ---
    function escapeHtml(s) {
        return String(s)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/\"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    function updateShowbar() {
        if (!barVisible) {
            showbar.style.display = "none";
            return;
        }
        showbar.style.display = "block";
        if (displayMode === 1) {
            // Answer-only mode
            showbar.innerHTML = lastApiResponse
                ? `<div>${escapeHtml(lastApiResponse)}</div>`
                : `<div><em>Žádná odpověď</em></div>`;
        } else {
            // Full detail mode: show input + answer
            const html =
                `<div><strong>Otázka:</strong><br>${escapeHtml(lastQuestionText)}</div><br>` +
                `<div><strong>Odpověď:</strong><br>${escapeHtml(lastApiResponse)}</div>`;
            showbar.innerHTML = html;
        }
    }

    function getPrompt(question) {
        return `System instrukce: \"Dostaneš otázku. Odpověz stručně, maximálně 30 slovy, bez okecávání.\"\n\nOtázka: ${question}`;
    }

    // --- Event Listeners ---
    document.addEventListener('keypress', (e) => {
        const tag = e.target.tagName;
        if (['INPUT','TEXTAREA'].includes(tag) || e.target.isContentEditable) return;

        if (e.key === 'f') {
            e.preventDefault();
            barVisible = !barVisible;
            updateShowbar();
        }
        if (e.key === 'd') {
            e.preventDefault();
            // Toggle and persist mode
            displayMode = 1 - displayMode;
            localStorage.setItem('uhkDisplayMode', displayMode.toString());
            updateShowbar();
        }
    });

    document.body.addEventListener('click', async (e) => {
        const path = e.composedPath?.() || [];
        const el = path[0] || e.target;
        if (showbar.contains(el)) return;
        const text = el.innerText?.trim();
        if (!text) return;

        if (barVisible) {
            lastQuestionText = text;
            lastApiResponse = '... načítání ...';
            updateShowbar();

            try {
                const resp = await fetch(API_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ question: getPrompt(text) })
                });
                const data = await resp.json();
                lastApiResponse = data.answer || 'Neplatná odpověď z API.';
            } catch (err) {
                lastApiResponse = 'Chyba API: ' + err.message;
            }
            updateShowbar();
        }
    }, true);

    console.log('UHK Monitoring v0.34 loaded. [f]=toggle bar, [d]=toggle display mode (persisted).');
})();
