// ==UserScript==
// @name         Simple Grammar Fix
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Ctrl+& fixes grammar using Github API
// @match        *://*/*
// @license      WTFPL
// @icon         https://www.iconsdb.com/icons/preview/royal-blue/edit-12-xxl.png
// @author       moony
// @grant        GM_xmlhttpRequest
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @connect      models.github.ai
// @downloadURL https://update.greasyfork.org/scripts/536345/Simple%20Grammar%20Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/536345/Simple%20Grammar%20Fix.meta.js
// ==/UserScript==

(function() {
    const MODEL = "openai/gpt-4.1"; // gpt-4o, o4-mini, gpt-4.1, Mistral-Large-2411 from https://github.com/marketplace?type=models
    const SYSTEM_PROMPT = "Fix grammar only. Return compact corrected text.";

    GM_registerMenuCommand("🗝️ Set API Key", () =>
        GM_setValue("GITHUB_TOKEN", prompt("Enter your GitHub API key:") || GM_getValue("GITHUB_TOKEN"))
    );

    document.addEventListener('keydown', e => {
        if (!(e.ctrlKey && e.key === '&')) return;
        e.preventDefault();

        const token = GM_getValue("GITHUB_TOKEN");
        if (!token) return alert("API key not set. Use Tampermonkey menu → 🗝️ Set API Key");

        const sel = window.getSelection();
        const txt = sel.toString().trim();
        if (!txt) return;

        const el = document.activeElement;
        const isInput = el.tagName === 'TEXTAREA' || el.tagName === 'INPUT';

        GM_xmlhttpRequest({
            method: "POST",
            url: "https://models.github.ai/inference/chat/completions",
            headers: {"Content-Type": "application/json", "Authorization": `Bearer ${token}`},
            data: JSON.stringify({
                messages: [{role: "system", content: SYSTEM_PROMPT}, {role: "user", content: txt}],
                model: MODEL, temperature: 0.7
            }),
            onload: r => {
                if (r.status !== 200) return console.error("Error:", r.responseText);

                const fixed = JSON.parse(r.responseText).choices[0].message.content;

                if (isInput) {
                    const [start, end] = [el.selectionStart, el.selectionEnd];
                    el.value = el.value.substring(0, start) + fixed + el.value.substring(end);
                    el.selectionStart = start;
                    el.selectionEnd = start + fixed.length;
                } else if (sel.rangeCount) {
                    const rng = sel.getRangeAt(0);
                    rng.deleteContents();
                    rng.insertNode(document.createTextNode(fixed));
                }
            },
            onerror: e => console.error("Request failed:", e)
        });
    });
})();