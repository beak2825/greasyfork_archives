// ==UserScript==
// @name         Время на прочтение статьи LZT
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Добавляет время прочтения статьи на форуме
// @match        https://zelenka.guru/*
// @match        https://lolz.live/*
// @match        https://lolz.guru/*
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/489921/%D0%92%D1%80%D0%B5%D0%BC%D1%8F%20%D0%BD%D0%B0%20%D0%BF%D1%80%D0%BE%D1%87%D1%82%D0%B5%D0%BD%D0%B8%D0%B5%20%D1%81%D1%82%D0%B0%D1%82%D1%8C%D0%B8%20LZT.user.js
// @updateURL https://update.greasyfork.org/scripts/489921/%D0%92%D1%80%D0%B5%D0%BC%D1%8F%20%D0%BD%D0%B0%20%D0%BF%D1%80%D0%BE%D1%87%D1%82%D0%B5%D0%BD%D0%B8%D0%B5%20%D1%81%D1%82%D0%B0%D1%82%D1%8C%D0%B8%20LZT.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function isInRequiredSection() {
        const breadcrumbs = Array.from(document.querySelectorAll('.breadcrumb .crust a.crumb span[itemprop="name"]')).map(crumb => crumb.textContent.trim());
        return breadcrumbs.includes("Форум") && breadcrumbs.some(crumb => crumb === "Статьи");
    }

    if (!isInRequiredSection()) {
        return;
    }

    function calculateReadingTime() {
        let text = '';
        if (document.querySelector('blockquote.messageText')) {
            text += document.querySelector('blockquote.messageText').textContent + ' ';
        }
        document.querySelectorAll('.SpoilerTarget').forEach(spoiler => {
            text += spoiler.textContent + ' ';
        });
        const words = text.split(/\s+/).filter(Boolean).length;
        const readingSpeed = 200; // Средняя скорость чтения слов в минуту
        return Math.ceil(words / readingSpeed);
    }

    function addReadingTimeToPage(readingTime) {
        const pageDescription = document.getElementById("pageDescription");
        const mutedDiv = document.querySelector('.muted');
        const targetContainer = pageDescription || mutedDiv;

        if (!targetContainer) {
            console.error('Место для вставки информации о времени чтения не найдено.');
            return;
        }

        const readingTimeElement = document.createElement("div");
        readingTimeElement.innerHTML = `Время на прочтение: ${readingTime} минут(ы)`;
        readingTimeElement.style.marginTop = "10px";

        targetContainer.insertAdjacentElement('afterend', readingTimeElement);
    }

    window.addEventListener('load', () => {
        const readingTime = calculateReadingTime();
        addReadingTimeToPage(readingTime);
    });
})();
