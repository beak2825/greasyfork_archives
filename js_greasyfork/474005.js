// ==UserScript==
// @name         Кнопка "Бабло" на zelenka.guru
// @namespace    http://tampermonkey.net/
// @description  Добавляет кнопку "Бабло" на ЛОЛЗ
// @author       stealyourbrain
// @match        https://zelenka.guru/*
// @version 0.0.1.20230827092742
// @downloadURL https://update.greasyfork.org/scripts/474005/%D0%9A%D0%BD%D0%BE%D0%BF%D0%BA%D0%B0%20%22%D0%91%D0%B0%D0%B1%D0%BB%D0%BE%22%20%D0%BD%D0%B0%20zelenkaguru.user.js
// @updateURL https://update.greasyfork.org/scripts/474005/%D0%9A%D0%BD%D0%BE%D0%BF%D0%BA%D0%B0%20%22%D0%91%D0%B0%D0%B1%D0%BB%D0%BE%22%20%D0%BD%D0%B0%20zelenkaguru.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Создание кнопки (не надо это вам)
    const moneyButton = document.createElement('a');
    moneyButton.textContent = '$Бабло$'; // тут название кнопки типо пон
    moneyButton.href = 'https://zelenka.guru/forums/contests/';
    moneyButton.classList.add('money-button');

    // Стили для кнопки с новыми координатами
    moneyButton.style.position = 'fixed';
    moneyButton.style.left = '165px'; // Координата x
    moneyButton.style.top = '440px'; // Координата y
    moneyButton.style.backgroundColor = '#4CAF50';
    moneyButton.style.color = 'white';
    moneyButton.style.padding = '10px 20px';
    moneyButton.style.border = 'none';
    moneyButton.style.borderRadius = '5px';
    moneyButton.style.cursor = 'pointer';

    // Добавление кнопки на страницу (вам это не надо)
    document.body.appendChild(moneyButton);
})();