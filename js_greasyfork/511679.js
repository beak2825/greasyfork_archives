// ==UserScript==
// @name         ShikiEmptyStylesRemoval
// @namespace    http://shikimori.org/
// @version      1.0.1
// @description  Позволяет оставлять чужие стили в профилях и заменять только "пустые" на свой стиль
// @author       BadPurse
// @match        http://shikimori.org/*
// @match        https://shikimori.org/*
// @match        http://shikimori.one/*
// @match        https://shikimori.one/*
// @match        http://shikimori.me/*
// @match        https://shikimori.me/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=shikimori.me
// @grant        none
// @license MIT

// @downloadURL https://update.greasyfork.org/scripts/511679/ShikiEmptyStylesRemoval.user.js
// @updateURL https://update.greasyfork.org/scripts/511679/ShikiEmptyStylesRemoval.meta.js
// ==/UserScript==
(function() {
    const styleElementId = "custom_css"; // ID элемента с кастомным стилем
    const customStyle = `Ваш стиль`; // Ваш стиль(Его мы меняем на свой и меняем ковычки, если необходимо ' " `)

    let lastUrl = window.location.href; // Сохраняем последний URL

    const setCustomStyle = () => {
        const styleElement = document.getElementById(styleElementId);
        if (styleElement) {
            // Устанавливаем стиль, если его содержимое меньше 700 символов
            if (styleElement.innerHTML.length < 700) {
                styleElement.innerHTML = customStyle;
            }
        }
    };

   // Проверка изменения URL
    const checkUrlChange = () => {
        if (window.location.href !== lastUrl) {
            setTimeout(setCustomStyle, 600); // Применяем стиль с задержкой 600 мс
        }
    };

    // Устанавливаем интервал для проверки URL каждые 500 мс
    setInterval(checkUrlChange, 500);

    // Применяем стиль через 600 мс при загрузке страницы
    setTimeout(setCustomStyle, 600);
})();