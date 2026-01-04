// ==UserScript==
// @name         sell_items_from_inventory
// @version      1.0.0
// @author       IhorPoplawskyi
// @description  Скрипт дозволяє виставляти на продаж усі предмети, що є в інвентарі + 100% +1% ремонт по дефолту
// @match        https://www.heroeswm.ru/*
// @match        https://my.lordswm.com/*
// @match        https://www.lordswm.com/*
// @match        https://mirror.heroeswm.ru/*
// @namespace    https://github.com/IhorPoplawskyi
// @connect      ihorpoplawskyi.github.io
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/483096/sell_items_from_inventory.user.js
// @updateURL https://update.greasyfork.org/scripts/483096/sell_items_from_inventory.meta.js
// ==/UserScript==

(async function() {
    const SCRIPT_KEY = "sell_items_from_inventory_сache";
    const SCRIPT_URL = "https://ihorpoplawskyi.github.io/MyScripts/sell_items_from_inventory.user.js";
    const CACHE_TIME = 1000 * 60 * 10; // 10 хвилин

    async function fetchScript() {
        try {
            const response = await fetch(SCRIPT_URL, { cache: "no-store" });
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            const text = await response.text();
            const data = { script: text, time: Date.now() };
            localStorage.setItem(SCRIPT_KEY, JSON.stringify(data));
            console.log("✅ Оновлено sell_items_from_inventory.user.js");
            return data;
        } catch (e) {
            console.warn("⚠️ Не вдалося завантажити sell_items_from_inventory.user.js:", e);
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
        console.log("🚀 Запущено sell_items_from_inventory.user.js");
    }

    let scriptData = loadFromCache();
    const isExpired = !scriptData || (Date.now() - scriptData.time > CACHE_TIME);

    if (isExpired) {
        console.log("🔄 Завантаження нової версії sell_items_from_inventory.user.js...");
        scriptData = await fetchScript() || scriptData;
    }

    if (scriptData?.script) {
        inject(scriptData.script);
    } else {
        console.error("❌ Немає доступного коду sell_items_from_inventory.user.js!");
    }
})();
