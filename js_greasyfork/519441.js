// ==UserScript==

// @name         Snowy DTF
// @namespace    http://tampermonkey.net/
// @version      2024-11-28
// @description  Добавляет падающий снег на DTF!
// @author       Zefjrka, Andy Skor, Chat GPT
// @match        https://dtf.ru/*
// @icon         https://i.imgur.com/ffgJY6D.png
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/519441/Snowy%20DTF.user.js
// @updateURL https://update.greasyfork.org/scripts/519441/Snowy%20DTF.meta.js
// ==/UserScript==

(function() {
    var snowflakes = [],
        animationInterval;

    function getRandomNumber(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function createSnowflake() {
        var el = document.createElement('div'),
            style = el.style;

        style.borderRadius = '100%';
        style.border = getRandomNumber(1, 4) + 'px solid white';
        style.position = 'fixed';
        style.zIndex = '999999';
        style.boxShadow = '0 0 2px rgba(255,255,255,0.8)';
        style.top = getRandomNumber(-window.innerHeight, 0) + 'px'; // Начальная позиция сверху
        style.left = getRandomNumber(0, window.innerWidth) + 'px';

        // Добавляем случайную скорость для каждого снежинки
        el.fallSpeed = getRandomNumber(1, 3); // Скорость падения (px за кадр)

        return el;
    }

    function moveSnowflakes() {
        var l = snowflakes.length,
            i;

        for (i = 0; i < l; i++) {
            moveSnowflake(snowflakes[i]);
        }
    }

    function moveSnowflake(el) {
        var style = el.style,
            height = window.innerHeight,
            top = parseInt(style.top, 10);

        // Постоянное падение вниз с индивидуальной скоростью
        top += el.fallSpeed;

        if (top > height) {
            resetSnowflake(el);
        } else {
            style.top = top + 'px';
        }
    }

    function resetSnowflake(el) {
        var style = el.style;
        style.top = getRandomNumber(-20, 0) + 'px'; // Сбрасываем на верх экрана
        style.left = getRandomNumber(0, window.innerWidth) + 'px';
        el.fallSpeed = getRandomNumber(1, 3); // Обновляем скорость падения
    }

    function setup() {
        var number = Math.floor(window.innerWidth / 30), // Количество снежинок
            particle,
            i;

        for (i = 0; i < number; i++) {
            particle = snowflakes[i] = createSnowflake();
            document.body.appendChild(particle);
        }

        animationInterval = setInterval(moveSnowflakes, 33); // Обновление каждые 33 мс (~30 FPS)
    }

    setup();
})();