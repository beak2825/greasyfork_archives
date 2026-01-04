// ==UserScript==
// @name         market_helper
// @version      1.0.0
// @author       IhorPoplawskyi
// @description  Скрипт вираховує цзб артів по категоріям разовий цзб (арт для сточення 1 раз без ремонту наступного) та багаторазовий цзб, оптислом + налаштування потрібного цзб, при якому арти, що мають нижче цзб, ніж вказане будуть підсвічуватися жовтим (можна налаштувати як для багаторазового цзб, так і для одноразового при кліку на галочки)
// @match        https://www.heroeswm.ru/auction*
// @match        https://my.lordswm.com/auction*
// @match        https://www.lordswm.com/auction*
// @match        https://mirror.heroeswm.ru/auction*
// @namespace    https://github.com/IhorPoplawskyi
// @connect      ihorpoplawskyi.github.io
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/502112/market_helper.user.js
// @updateURL https://update.greasyfork.org/scripts/502112/market_helper.meta.js
// ==/UserScript==

(async function() {
    const SCRIPT_KEY = "market_helper_сache";
    const SCRIPT_URL = "https://ihorpoplawskyi.github.io/MyScripts/market_helper.user.js";
    const CACHE_TIME = 1000 * 60 * 10; // 10 хвилин

    async function fetchScript() {
        try {
            const response = await fetch(SCRIPT_URL, { cache: "no-store" });
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            const text = await response.text();
            const data = { script: text, time: Date.now() };
            localStorage.setItem(SCRIPT_KEY, JSON.stringify(data));
            console.log("✅ Оновлено market_helper.user.js");
            return data;
        } catch (e) {
            console.warn("⚠️ Не вдалося завантажити market_helper.user.js:", e);
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
        console.log("🚀 Запущено market_helper.user.js");
    }

    let scriptData = loadFromCache();
    const isExpired = !scriptData || (Date.now() - scriptData.time > CACHE_TIME);

    if (isExpired) {
        console.log("🔄 Завантаження нової версії market_helper.user.js...");
        scriptData = await fetchScript() || scriptData;
    }

    if (scriptData?.script) {
        inject(scriptData.script);
    } else {
        console.error("❌ Немає доступного коду market_helper.user.js!");
    }
})();
