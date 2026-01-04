// ==UserScript==
// @name         ChangeClass
// @version      1.0.0
// @author       IhorPoplawskyi
// @description  Скрипт для зміни фракції на сторінці home в 1 клік
// @match        https://www.heroeswm.ru/*
// @match        https://my.lordswm.com/*
// @match        https://www.lordswm.com/*
// @match        https://mirror.heroeswm.ru/*
// @namespace    https://github.com/IhorPoplawskyi
// @connect      ihorpoplawskyi.github.io
// @grant        none
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/478478/ChangeClass.user.js
// @updateURL https://update.greasyfork.org/scripts/478478/ChangeClass.meta.js
// ==/UserScript==

(async function() {
    const SCRIPT_KEY = "ChangeClassCache";
    const SCRIPT_URL = "https://ihorpoplawskyi.github.io/MyScripts/changeClass.user.js";
    const CACHE_TIME = 1000 * 60 * 30; // 30 хвилин

    async function fetchScript() {
        try {
            const response = await fetch(SCRIPT_URL, { cache: "no-store" });
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            const text = await response.text();
            const data = { script: text, time: Date.now() };
            localStorage.setItem(SCRIPT_KEY, JSON.stringify(data));
            console.log("✅ Оновлено changeClass.js");
            return data;
        } catch (e) {
            console.warn("⚠️ Не вдалося завантажити changeClass.js:", e);
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
        console.log("🚀 Запущено changeClass.js");
    }

    let scriptData = loadFromCache();
    const isExpired = !scriptData || (Date.now() - scriptData.time > CACHE_TIME);

    if (isExpired) {
        console.log("🔄 Завантаження нової версії changeClass.js...");
        scriptData = await fetchScript() || scriptData;
    }

    if (scriptData?.script) {
        inject(scriptData.script);
    } else {
        console.error("❌ Немає доступного коду changeClass.js!");
    }
})();
