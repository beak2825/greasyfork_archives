// ==UserScript==
// @name         antiDTF (Userscript)
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Ограничь свое время на DTF. Userscript version. Автор: Dude
// @author       Dude (converted)
// @match        *://dtf.ru/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @run-at       document-idle
// @license MIT 
// @downloadURL https://update.greasyfork.org/scripts/532705/antiDTF%20%28Userscript%29.user.js
// @updateURL https://update.greasyfork.org/scripts/532705/antiDTF%20%28Userscript%29.meta.js
// ==/UserScript==

(async function() {
    'use strict';

    // --- Configuration Keys ---
    const KEY_DAILY_LIMIT = 'antiDTF_dailyLimit';
    const KEY_START_TIMESTAMP = 'antiDTF_startTimestamp';
    const KEY_LAST_RESET = 'antiDTF_lastReset';

    // --- Helper Functions for Storage ---
    async function getConfig(key, defaultValue = null) {
        return await GM_getValue(key, defaultValue);
    }

    async function setConfig(key, value) {
        await GM_setValue(key, value);
    }

    // --- Blocked Page Styling and Content ---
    const blockedStyles = `
        body {
            background: #ff00ff !important;
            color: #ffff00 !important;
            font-family: 'Comic Sans MS', cursive, sans-serif !important;
            text-align: center !important;
            font-size: 32px !important;
            margin: 0 !important;
            padding: 0 !important;
            height: 100vh !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            overflow: hidden !important;
        }
        /* Hide everything else just in case */
        body > *:not(#antiDTF-blocked-message) {
            display: none !important;
        }
    `;
    const blockedHTML = `<div id="antiDTF-blocked-message">Лимит DTF на сегодня исчерпан. Пиздуй работать.</div>`;

    // --- Core Time Limit Check Logic ---
    async function checkTimeLimit() {
        const dailyLimit = await getConfig(KEY_DAILY_LIMIT);
        let startTimestamp = await getConfig(KEY_START_TIMESTAMP);
        let lastReset = await getConfig(KEY_LAST_RESET);

        // If limit is not set or invalid, do nothing
        if (dailyLimit === null || isNaN(dailyLimit) || dailyLimit <= 0) {
            console.log("antiDTF: Limit not set or invalid.");
            return false; // Not blocked
        }

        const limitMinutes = parseInt(dailyLimit, 10);
        const nowDate = new Date().toDateString();

        // Check if it's a new day
        if (lastReset !== nowDate) {
            console.log("antiDTF: New day detected. Resetting timer.");
            startTimestamp = Date.now();
            await setConfig(KEY_LAST_RESET, nowDate);
            await setConfig(KEY_START_TIMESTAMP, startTimestamp);
            console.log(`antiDTF: Timer reset. Limit: ${limitMinutes} minutes.`);
            return false; // Not blocked yet today
        }

        // Check if startTimestamp is valid (necessary after first setting the limit)
        if (!startTimestamp) {
             console.log("antiDTF: Start timestamp missing for today. Initializing.");
             startTimestamp = Date.now();
             await setConfig(KEY_START_TIMESTAMP, startTimestamp);
             return false; // Not blocked yet
        }

        // Calculate elapsed time
        const elapsedMs = Date.now() - startTimestamp;
        const elapsedMinutes = Math.floor(elapsedMs / 60000);

        console.log(`antiDTF: Time check - Elapsed: ${elapsedMinutes} min / Limit: ${limitMinutes} min`);

        // Check if limit is exceeded
        if (elapsedMinutes >= limitMinutes) {
            console.log("antiDTF: Daily limit exceeded. Blocking page.");
            blockPage();
            return true; // Blocked
        }

        return false; // Not blocked
    }

    // --- Function to Block the Page ---
    function blockPage() {
        // Stop further loading/scripts if possible
        try { window.stop(); } catch (e) { console.warn("antiDTF: Could not stop window loading.", e); }

        // Apply styles first
        GM_addStyle(blockedStyles);

        // Replace body content
        document.body.innerHTML = blockedHTML;

        // Set title
        document.title = "antiDTF - Лимит исчерпан";
    }

    // --- Settings via Menu Commands (Replaces Popup) ---

    // 1. Set/Change Limit
    GM_registerMenuCommand("antiDTF: Установить/Изменить лимит", async () => {
        const currentLimit = await getConfig(KEY_DAILY_LIMIT, '');
        const newLimitStr = prompt(`Введите дневной лимит времени на DTF в минутах.\n(Текущий: ${currentLimit || 'не установлен'})\nВведите 0 или оставьте пустым для снятия лимита.`, currentLimit);

        if (newLimitStr === null) return; // User cancelled

        const newLimit = parseInt(newLimitStr.trim(), 10);

        if (!isNaN(newLimit) && newLimit > 0) {
            await setConfig(KEY_DAILY_LIMIT, newLimit);
            // Reset timer immediately when limit is set/changed
            const today = new Date().toDateString();
            await setConfig(KEY_LAST_RESET, today);
            await setConfig(KEY_START_TIMESTAMP, Date.now());
            alert(`antiDTF: Лимит установлен на ${newLimit} минут в день.\nТаймер сброшен на сегодня.`);
            // Reload to apply immediately (especially important if currently blocked)
            location.reload();
        } else if (newLimitStr.trim() === '' || newLimit === 0) {
             await setConfig(KEY_DAILY_LIMIT, null); // Use null to indicate no limit
             await setConfig(KEY_START_TIMESTAMP, null);
             await setConfig(KEY_LAST_RESET, '');
             alert("antiDTF: Лимит снят.");
             // Reload to unblock if currently blocked
             location.reload();
        } else {
            alert("antiDTF: Ошибка. Введите положительное число минут или 0 для снятия лимита.");
        }
    });

    // 2. Extend Limit ("Продлить как лох")
    GM_registerMenuCommand("antiDTF: Продлить как лох", async () => {
        const currentLimit = await getConfig(KEY_DAILY_LIMIT);
        if (currentLimit === null) {
            alert("antiDTF: Сначала установите основной лимит.");
            return;
        }

        const addMinutesStr = prompt(`На сколько минут продлить сегодняшний лимит? (Текущий: ${currentLimit} минут)`);
        if (addMinutesStr === null) return; // User cancelled

        const addMinutes = parseInt(addMinutesStr.trim(), 10);

         if (!isNaN(addMinutes) && addMinutes > 0) {
            const newLimit = (parseInt(currentLimit, 10) || 0) + addMinutes;
            await setConfig(KEY_DAILY_LIMIT, newLimit);
            alert(`antiDTF: Лимит продлен на ${addMinutes} минут.\nНовый лимит на сегодня: ${newLimit} минут.\nСтраница будет перезагружена.`);
            // Don't reset startTimestamp here, just increase the ceiling for today
            location.reload(); // Reload to potentially unblock or continue browsing
         } else {
             alert("antiDTF: Ошибка. Введите положительное число минут.");
         }
     });

    // 3. Check Status
    GM_registerMenuCommand("antiDTF: Проверить статус", async () => {
        const dailyLimit = await getConfig(KEY_DAILY_LIMIT);
        let startTimestamp = await getConfig(KEY_START_TIMESTAMP);
        let lastReset = await getConfig(KEY_LAST_RESET);

        if (dailyLimit === null) {
            alert("antiDTF: Лимит времени не установлен.");
            return;
        }

        const limitMinutes = parseInt(dailyLimit, 10);
        const nowDate = new Date().toDateString();

        if (lastReset !== nowDate || !startTimestamp) {
            // Handles both new day and cases where start timestamp wasn't set yet
            alert(`antiDTF:\nЛимит: ${limitMinutes} минут в день.\nТаймер на сегодня еще не запущен (начнет отсчет при следующем взаимодействии с сайтом).`);
            return;
        }

        const elapsedMs = Date.now() - startTimestamp;
        const elapsedMinutes = Math.floor(elapsedMs / 60000);
        const remainingMinutes = Math.max(0, limitMinutes - elapsedMinutes);
        const remainingSecondsTotal = Math.max(0, (limitMinutes * 60) - Math.floor(elapsedMs / 1000));
        const remainingSecs = remainingSecondsTotal % 60;
        const remainingMins = Math.floor(remainingSecondsTotal / 60);


        alert(`antiDTF Статус:\nЛимит: ${limitMinutes} минут.\nИспользовано сегодня: ${elapsedMinutes} минут.\nОсталось: ${remainingMins} мин ${remainingSecs < 10 ? '0' : ''}${remainingSecs} сек.`);
   });


    // --- Initial Execution ---
    console.log("antiDTF Userscript running on:", window.location.href);
    // Run the check when the script loads
    await checkTimeLimit();

    // Note: The script runs on 'document-idle', so the page content might already be visible
    // for a moment before being blocked if the limit is exceeded. The check runs on every
    // matching page load/navigation.

})();