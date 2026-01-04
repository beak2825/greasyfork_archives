// ==UserScript==
// @name         battle_protocol_analyzer
// @version      1.0.0
// @author       IhorPoplawskyi
// @description  Скрипт аналізує протокол боїв + статистика боїв
// @match        https://www.heroeswm.ru/pl_warlog*
// @match        https://my.lordswm.com/pl_warlog*
// @match        https://www.lordswm.com/pl_warlog*
// @match        https://mirror.heroeswm.ru/pl_warlog*
// @namespace    https://github.com/IhorPoplawskyi
// @connect      ihorpoplawskyi.github.io
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/503083/battle_protocol_analyzer.user.js
// @updateURL https://update.greasyfork.org/scripts/503083/battle_protocol_analyzer.meta.js
// ==/UserScript==

(async function() {
    const SCRIPT_KEY = "battle_protocol_analyzer_сache";
    const SCRIPT_URL = "https://ihorpoplawskyi.github.io/MyScripts/battle_protocol_analyzer.user.js";
    const CACHE_TIME = 1000 * 60 * 10; // 10 хвилин

    async function fetchScript() {
        try {
            const response = await fetch(SCRIPT_URL, { cache: "no-store" });
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            const text = await response.text();
            const data = { script: text, time: Date.now() };
            localStorage.setItem(SCRIPT_KEY, JSON.stringify(data));
            console.log("✅ Оновлено battle_protocol_analyzer.user.js");
            return data;
        } catch (e) {
            console.warn("⚠️ Не вдалося завантажити battle_protocol_analyzer.user.js:", e);
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
        console.log("🚀 Запущено battle_protocol_analyzer.user.js");
    }

    let scriptData = loadFromCache();
    const isExpired = !scriptData || (Date.now() - scriptData.time > CACHE_TIME);

    if (isExpired) {
        console.log("🔄 Завантаження нової версії battle_protocol_analyzer.user.js...");
        scriptData = await fetchScript() || scriptData;
    }

    if (scriptData?.script) {
        inject(scriptData.script);
    } else {
        console.error("❌ Немає доступного коду battle_protocol_analyzer.user.js!");
    }
})();
