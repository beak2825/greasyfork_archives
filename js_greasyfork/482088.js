// ==UserScript==
// @name         send_multiply_elements
// @version      1.0.0
// @author       IhorPoplawskyi
// @description  Скрипт дозволяє надсилати елементи, ресурси та золото пачкою
// @include      /^https{0,1}:\/\/((www|my|mirror)\.(heroeswm|lordswm)\.(ru|com)|178\.248\.235\.15)\/(el_transfer|transfer).php*/
// @namespace    https://github.com/IhorPoplawskyi
// @connect      ihorpoplawskyi.github.io
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/482088/send_multiply_elements.user.js
// @updateURL https://update.greasyfork.org/scripts/482088/send_multiply_elements.meta.js
// ==/UserScript==

(async function() {
    const SCRIPT_KEY = "send_multiply_elements_сache";
    const SCRIPT_URL = "https://ihorpoplawskyi.github.io/MyScripts/send_multiply_elements.user.js";
    const CACHE_TIME = 1000 * 60 * 10; // 10 хвилин

    async function fetchScript() {
        try {
            const response = await fetch(SCRIPT_URL, { cache: "no-store" });
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            const text = await response.text();
            const data = { script: text, time: Date.now() };
            localStorage.setItem(SCRIPT_KEY, JSON.stringify(data));
            console.log("✅ Оновлено send_multiply_elements.user.js");
            return data;
        } catch (e) {
            console.warn("⚠️ Не вдалося завантажити send_multiply_elements.user.js:", e);
            return null;
        }
    }

    function loadFromCache() {
        try {
            const raw = localStorage.getItem(SCRIPT_KEY);
            return raw ? JSON.parse(raw) : null;
        } catch {
            return null;
        }
    }

    function inject(code) {
        const s = document.createElement("script");
        s.textContent = code;
        document.head.appendChild(s);
        console.log("🚀 Запущено send_multiply_elements.user.js");
    }

    let scriptData = loadFromCache();
    const isExpired = !scriptData || (Date.now() - scriptData.time > CACHE_TIME);

    if (isExpired) {
        console.log("🔄 Завантаження нової версії send_multiply_elements.user.js...");
        scriptData = await fetchScript() || scriptData;
    }

    if (scriptData?.script) {
        inject(scriptData.script);
    } else {
        console.error("❌ Немає доступного коду send_multiply_elements.user.js!");
    }
})();
