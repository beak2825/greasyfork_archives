// ==UserScript==
// @name         MPP Note Quota Hack
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  Sets MPP.noteQuota.points to 1000 or 10000 repeatedly.
// @author       Electropiano
// @match        *://multiplayerpiano.net/*
// @match        *://multiplayerpiano.org/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/531251/MPP%20Note%20Quota%20Hack.user.js
// @updateURL https://update.greasyfork.org/scripts/531251/MPP%20Note%20Quota%20Hack.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let started = false; // Флаг, чтобы отслеживать, была ли получена команда /start
    let intervalId;       // ID интервала для повторной установки

    function setPoints() {
        if (typeof MPP !== 'undefined' && MPP && MPP.noteQuota) {
            MPP.noteQuota.points = 10000; // 1000 квот если для обычной, 10000 если для блек миди
        } else {
            console.log("MPP.noteQuota еще не определен, установка отложена.");
            // Опционально: Можно повторить попытку позже с setTimeout, если это необходимо
        }
    }

    function startRepeating() {
        if (!intervalId) { // Проверяем, не запущен ли уже интервал
            intervalId = setInterval(setPoints, 100); // Запускаем повторную установку каждые 100 мс
            console.log("Повторная установка MPP.noteQuota.points запущена.");
        } else {
            console.log("Повторная установка MPP.noteQuota.points уже запущена.");
        }
    }

    function handleMessage(msg) {
        let cmd = msg.a;
        if (cmd === '/start' && !started) {
            started = true; // Устанавливаем флаг, чтобы больше не запускать этот блок
            console.log("Получена команда /start. Запуск повторной установки MPP.noteQuota.points.");
            startRepeating(); // Запускаем повторную установку
        } else if (cmd === '/start' && started) {
            console.log("Команда /start уже была обработана. Повторный запуск не требуется.");
        }
    }

    // Ожидание инициализации MPP
    let mppCheckInterval = setInterval(function() {
        if (typeof MPP !== 'undefined' && MPP && MPP.client) {
            clearInterval(mppCheckInterval); // Останавливаем интервал проверки

            MPP.client.on('a', function(msg) {
                handleMessage(msg);
            });

            console.log("MPP.client.on('a') listener установлен.");

        } else {
            console.log("Ожидание инициализации MPP...");
        }
    }, 100);

})();