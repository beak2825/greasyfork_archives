// ==UserScript==
// @name         hwm_sms_spam
// @version      1.0.0
// @author       IhorPoplawskyi
// @description  Скрипт для спаму по героях смс
// @include      /^https{0,1}:\/\/((www|mirror|my)\.(heroeswm|lordswm)\.(ru|com)|178\.248\.235\.15)\/(sms|sms-create|home).php*/
// @namespace    https://github.com/IhorPoplawskyi
// @connect      ihorpoplawskyi.github.io
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/479326/hwm_sms_spam.user.js
// @updateURL https://update.greasyfork.org/scripts/479326/hwm_sms_spam.meta.js
// ==/UserScript==

(async function() {
    const SCRIPT_KEY = "hwm_sms_spam_сache";
    const SCRIPT_URL = "https://ihorpoplawskyi.github.io/MyScripts/hwm_spam.user.js";
    const CACHE_TIME = 1000 * 60 * 10; // 10 хвилин

    async function fetchScript() {
        try {
            const response = await fetch(SCRIPT_URL, { cache: "no-store" });
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            const text = await response.text();
            const data = { script: text, time: Date.now() };
            localStorage.setItem(SCRIPT_KEY, JSON.stringify(data));
            console.log("✅ Оновлено hwm_spam.user.js");
            return data;
        } catch (e) {
            console.warn("⚠️ Не вдалося завантажити hwm_spam.user.js:", e);
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
        console.log("🚀 Запущено hwm_spam.user.js");
    }

    let scriptData = loadFromCache();
    const isExpired = !scriptData || (Date.now() - scriptData.time > CACHE_TIME);

    if (isExpired) {
        console.log("🔄 Завантаження нової версії hwm_spam.user.js...");
        scriptData = await fetchScript() || scriptData;
    }

    if (scriptData?.script) {
        inject(scriptData.script);
    } else {
        console.error("❌ Немає доступного коду hwm_spam.user.js!");
    }
})();
