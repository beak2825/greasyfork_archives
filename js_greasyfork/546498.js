// ==UserScript==
// @name         doeda vs reklam silici
// @namespace    http://tampermonkey.net/
// @version      2.2
// @description  AMP sayfalarda belirli elementleri kaldırır. Log sayfanın sonunda gösterilir (sabit değil). 🧹🧹🧹
// @author       silent chaos
// @match        *://*/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/546498/doeda%20vs%20reklam%20silici.user.js
// @updateURL https://update.greasyfork.org/scripts/546498/doeda%20vs%20reklam%20silici.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // === SAYFA ALTINDA GÖRÜNEN LOG PANELİ OLUŞTUR ===
    const logPanel = document.createElement("div");
    logPanel.id = "tm-log-panel";
    logPanel.style.backgroundColor = "#111";
    logPanel.style.color = "#00FF88";
    logPanel.style.fontSize = "13px";
    logPanel.style.padding = "12px";
    logPanel.style.marginTop = "50px";
    logPanel.style.fontFamily = "monospace";
    logPanel.style.borderTop = "3px solid #00FF88";
    logPanel.style.maxHeight = "300px";
    logPanel.style.overflowY = "auto";
    logPanel.style.zIndex = "9999";

    const initialLog = document.createElement("div");
    initialLog.innerHTML = `<b>✅ Tampermonkey Script Başlatıldı</b>`;
    logPanel.appendChild(initialLog);

    // Sayfanın en altına ekle
    document.body.appendChild(logPanel);

    // === LOG EKLEME FONKSİYONU ===
    function log(message) {
        const logLine = document.createElement("div");
        const time = new Date().toLocaleTimeString();
        logLine.textContent = `[${time}] ${message}`;
        logPanel.appendChild(logLine);
    }

    // === ID'ye göre silme ===
    function removeDivById(id) {
        const el = document.getElementById(id);
        if (el) {
            el.remove();
            log(`🧹 <div id="${id}"> kaldırıldı.`);
        }
    }

    // === CLASS'a göre silme ===
    function removeDivByClass(className) {
        const els = document.querySelectorAll(`div.${className}`);
        els.forEach(el => {
            el.remove();
            log(`🧹 <div class="${className}"> kaldırıldı.`);
        });
    }

    // === Temizlik işlemi ===
    function cleanPage() {
        const idsToRemove = [
            "vrsAlert",
            "maheir-id",
            "uyari",
            "hdabla-id",
            "amp-x-id"
        ];
        idsToRemove.forEach(removeDivById);

        const classesToRemove = [
            "partner"
        ];
        classesToRemove.forEach(removeDivByClass);
    }

    // === Her saniye temizleme yap ===
    cleanPage();               // İlk temizleme hemen çalışsın
    setInterval(cleanPage, 1000); // Her 1000 ms (1 saniye) tekrar et
})();
