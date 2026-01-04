// ==UserScript==
// @name         Автопроверка билетов
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Автоматическая проверка наличия билетов каждые 20 секунд
// @author       Вы
// @match        https://ваш-сайт/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/520821/%D0%90%D0%B2%D1%82%D0%BE%D0%BF%D1%80%D0%BE%D0%B2%D0%B5%D1%80%D0%BA%D0%B0%20%D0%B1%D0%B8%D0%BB%D0%B5%D1%82%D0%BE%D0%B2.user.js
// @updateURL https://update.greasyfork.org/scripts/520821/%D0%90%D0%B2%D1%82%D0%BE%D0%BF%D1%80%D0%BE%D0%B2%D0%B5%D1%80%D0%BA%D0%B0%20%D0%B1%D0%B8%D0%BB%D0%B5%D1%82%D0%BE%D0%B2.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let audioContext, oscillator, gainNode;

    function startBeep() {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        oscillator = audioContext.createOscillator();
        gainNode = audioContext.createGain();

        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(440, audioContext.currentTime);
        gainNode.gain.setValueAtTime(0.5, audioContext.currentTime);

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.start();
    }

    function stopBeep() {
        if (oscillator) {
            oscillator.stop();
            oscillator.disconnect();
            gainNode.disconnect();
            audioContext.close();
        }
    }

    function checkAvailability() {
        const points = document.querySelectorAll('img[src="/images/hsc_.png"]');

        const targetPoint = Array.from(points).find(point => {
            const style = window.getComputedStyle(point);
            return style.transform === 'translate3d(535px, 663px, 0px)';
        });

        if (targetPoint) {
            console.log('Билет доступен!');
            startBeep();
            alert('Билет доступен!');
            stopBeep();
        } else {
            console.log('Билетов пока нет.');
        }

        setTimeout(() => {
            location.reload();
        }, 1000); // 1 секунда задержки
    }

    setInterval(checkAvailability, 20000); // Проверяем каждые 20 секунд
})();
