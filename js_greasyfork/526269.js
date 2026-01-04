// ==UserScript==
// @name            Disable Auto Mic Adjustment & Self-Listening for Nekto.me
// @name:ru         Отключение автонастройки микрофона и самопрослушивания для Nekto.me
// @name:uk         Відключення автоналаштувань мікрофона та самопрослуховування для Nekto.me
// @namespace       http://tampermonkey.net/
// @version         1.0
// @description     Microphone settings for Nekto.me, self-listening, settings apply after page refresh
// @description:ru Настройки микрофона для Nekto.me, самопрослушивание, настройки применяются после обновления страницы
// @description:uk Налаштування мікрофона для Nekto.me, самопрослуховування, налаштування застосовуються після оновлення сторінки
// @author         t3ry4
// @match          *://*nekto.me/*
// @grant          GM_registerMenuCommand
// @grant          GM_unregisterMenuCommand
// @grant          GM_setValue
// @grant          GM_getValue
// @license        MIT
// @downloadURL https://update.greasyfork.org/scripts/526269/Disable%20Auto%20Mic%20Adjustment%20%20Self-Listening%20for%20Nektome.user.js
// @updateURL https://update.greasyfork.org/scripts/526269/Disable%20Auto%20Mic%20Adjustment%20%20Self-Listening%20for%20Nektome.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let globalStream = null;

    let enableLoopback = GM_getValue("enableLoopback", false);
    let settings = {
        autoGainControl: GM_getValue("autoGainControl", false),
        noiseSuppression: GM_getValue("noiseSuppression", true),
        echoCancellation: GM_getValue("echoCancellation", false),
        gainValue: GM_getValue("gainValue", 1.5)
    };

    let menuIDs = [];

    function updateMenu() {
        menuIDs.forEach(id => GM_unregisterMenuCommand(id));
        menuIDs = [];

        menuIDs.push(GM_registerMenuCommand(
            `🎤 Self-Listening: ${enableLoopback ? "✅ ON" : "❌ OFF"}`,
            () => {
                enableLoopback = !enableLoopback;
                GM_setValue("enableLoopback", enableLoopback);
                updateMenu();
            }
        ));

        menuIDs.push(GM_registerMenuCommand(
            `📢 Auto Gain Control: ${settings.autoGainControl ? "✅ ON" : "❌ OFF"}`,
            () => {
                settings.autoGainControl = !settings.autoGainControl;
                GM_setValue("autoGainControl", settings.autoGainControl);
                updateMenu();
            }
        ));

        menuIDs.push(GM_registerMenuCommand(
            `🔇 Noise Suppression: ${settings.noiseSuppression ? "✅ ON" : "❌ OFF"}`,
            () => {
                settings.noiseSuppression = !settings.noiseSuppression;
                GM_setValue("noiseSuppression", settings.noiseSuppression);
                updateMenu();
            }
        ));

        menuIDs.push(GM_registerMenuCommand(
            `🔁 Echo Cancellation: ${settings.echoCancellation ? "✅ ON" : "❌ OFF"}`,
            () => {
                settings.echoCancellation = !settings.echoCancellation;
                GM_setValue("echoCancellation", settings.echoCancellation);
                updateMenu();
            }
        ));

        menuIDs.push(GM_registerMenuCommand(
            `🔊 Self-Listening Volume: ${settings.gainValue.toFixed(1)}`,
            () => {
                let newGain = parseFloat(prompt("Enter volume level (0.1 - 3.0):", settings.gainValue));
                if (!isNaN(newGain) && newGain >= 0.1 && newGain <= 3.0) {
                    settings.gainValue = newGain;
                    GM_setValue("gainValue", settings.gainValue);
                    updateMenu();
                } else {
                    alert("Invalid value! Enter a number between 0.1 and 3.0");
                }
            }
        ));
    }

    updateMenu();

    navigator.mediaDevices.getUserMedia = (function(originalGetUserMedia) {
        return function(constraints) {
            if (constraints && constraints.audio) {
                if (constraints.audio === true) {
                    constraints.audio = {};
                }

                constraints.audio.autoGainControl = settings.autoGainControl;
                constraints.audio.noiseSuppression = settings.noiseSuppression;
                constraints.audio.echoCancellation = settings.echoCancellation;
            }

            return originalGetUserMedia.call(navigator.mediaDevices, constraints).then(stream => {
                globalStream = stream;
                if (enableLoopback) {
                    enableSelfListening(stream);
                }
                return stream;
            });
        };
    })(navigator.mediaDevices.getUserMedia);

    function enableSelfListening(stream) {
        if (!stream || stream.getAudioTracks().length === 0) {
            return;
        }

        const audioContext = new window.AudioContext();
        const source = audioContext.createMediaStreamSource(stream);
        const gainNode = audioContext.createGain();
        gainNode.gain.value = settings.gainValue;

        source.connect(gainNode);
        gainNode.connect(audioContext.destination);
    }
})();
