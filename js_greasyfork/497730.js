// ==UserScript==
// @name         auto_repairs
// @version      1.0.0
// @author       IhorPoplawskyi
// @description  Скрипт перевіряє в інвентарі наявність артів на ремонт та автоматично бере їх в ремонт + налаштування wage - ставка при якій приймати на ремонт, а інші арти будуть відхилені. Список друзів - нікнейм друга, якому скрипт буде ремонтувати за 100.
// @match        https://www.heroeswm.ru/inventory*
// @match        https://my.lordswm.com/inventory*
// @match        https://www.lordswm.com/inventory*
// @match        https://mirror.heroeswm.ru/inventory*
// @namespace    https://github.com/IhorPoplawskyi
// @connect      ihorpoplawskyi.github.io
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/497730/auto_repairs.user.js
// @updateURL https://update.greasyfork.org/scripts/497730/auto_repairs.meta.js
// ==/UserScript==

(async function() {
    const SCRIPT_KEY = "auto_repairs_сache";
    const SCRIPT_URL = "https://ihorpoplawskyi.github.io/MyScripts/auto_repairs.user.js";
    const CACHE_TIME = 1000 * 60 * 10; // 10 хвилин

    async function fetchScript() {
        try {
            const response = await fetch(SCRIPT_URL, { cache: "no-store" });
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            const text = await response.text();
            const data = { script: text, time: Date.now() };
            localStorage.setItem(SCRIPT_KEY, JSON.stringify(data));
            console.log("✅ Оновлено auto_repairs.user.js");
            return data;
        } catch (e) {
            console.warn("⚠️ Не вдалося завантажити auto_repairs.user.js:", e);
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
        console.log("🚀 Запущено auto_repairs.user.js");
    }

    let scriptData = loadFromCache();
    const isExpired = !scriptData || (Date.now() - scriptData.time > CACHE_TIME);

    if (isExpired) {
        console.log("🔄 Завантаження нової версії auto_repairs.user.js...");
        scriptData = await fetchScript() || scriptData;
    }

    if (scriptData?.script) {
        inject(scriptData.script);
    } else {
        console.error("❌ Немає доступного коду auto_repairs.user.js!");
    }
})();
