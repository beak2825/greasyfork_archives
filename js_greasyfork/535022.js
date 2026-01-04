// ==UserScript==
// @name         check_arts_before_battle
// @version      1.0.0
// @author       IhorPoplawskyi
// @description  Скрипт перевіряє комплектність твоїх артів перед ГТ та івентах
// @match        https://www.heroeswm.ru/*
// @match        https://my.lordswm.com/*
// @match        https://www.lordswm.com/*
// @match        https://mirror.heroeswm.ru/*
// @namespace    https://github.com/IhorPoplawskyi
// @connect      ihorpoplawskyi.github.io
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/535022/check_arts_before_battle.user.js
// @updateURL https://update.greasyfork.org/scripts/535022/check_arts_before_battle.meta.js
// ==/UserScript==

(async function() {
    const SCRIPT_KEY = "check_arts_before_battle_сache";
    const SCRIPT_URL = "https://ihorpoplawskyi.github.io/MyScripts/check_arts_before_battle.user.js";
    const CACHE_TIME = 1000 * 60 * 10; // 10 хвилин

    async function fetchScript() {
        try {
            const response = await fetch(SCRIPT_URL, { cache: "no-store" });
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            const text = await response.text();
            const data = { script: text, time: Date.now() };
            localStorage.setItem(SCRIPT_KEY, JSON.stringify(data));
            console.log("✅ Оновлено start_of_battle_btn_hwm.user.js");
            return data;
        } catch (e) {
            console.warn("⚠️ Не вдалося завантажити check_arts_before_battle.user.js:", e);
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
        console.log("🚀 Запущено check_arts_before_battle.user.js");
    }

    let scriptData = loadFromCache();
    const isExpired = !scriptData || (Date.now() - scriptData.time > CACHE_TIME);

    if (isExpired) {
        console.log("🔄 Завантаження нової версії check_arts_before_battle.user.js...");
        scriptData = await fetchScript() || scriptData;
    }

    if (scriptData?.script) {
        inject(scriptData.script);
    } else {
        console.error("❌ Немає доступного коду check_arts_before_battle.user.js!");
    }
})();
