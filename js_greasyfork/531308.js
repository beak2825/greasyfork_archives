// ==UserScript==
// @name         Dzen Lite (Single Column Feed)
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Упрощает ленту Dzen: удаляет верхние вкладки/фишки, располагает статьи в одном столбце, удаляет рекламу и заполнители скелета.
// @author       Your Name
// @match        https://dzen.ru/articles
// @license MIT
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/531308/Dzen%20Lite%20%28Single%20Column%20Feed%29.user.js
// @updateURL https://update.greasyfork.org/scripts/531308/Dzen%20Lite%20%28Single%20Column%20Feed%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Функция для добавления стилей
    function addGlobalStyle(css) {
        var head, style;
        head = document.getElementsByTagName('head')[0];
        if (!head) { return; }
        style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = css;
        head.appendChild(style);
        console.log("Dzen Lite Styles Applied");
    }

    // CSS стили для упрощения и одного столбика
    const customCSS = `
        /* --- Элементы для скрытия --- */

        /* 1. Верхние табы-чипсы тем */
        .desktop2--trends-tabs__container-33 {
            display: none !important;
        }

        /* 2. Скелетоны/плейсхолдеры загрузки (справа или общие) */
        .desktop2--skeleton__skeletonWrapper-3U {
             display: none !important;
        }

        /* 3. Рекламные блоки (RTB) */
        article[data-testid="card-rtb"], /* Основной селектор для рекламных карточек */
        div[id="article-showcase-card-rtb"], /* Контейнер рекламной карточки */
         .desktop2--card-rtb__zenadCardRtb-79 /* Класс рекламной карточки */
         {
            display: none !important;
            height: 0 !important;
            padding: 0 !important;
            margin: 0 !important;
            visibility: hidden !important;
         }

        /* 4. Скелетоны карточек в конце списка (при подгрузке) */
        .desktop2--remaining-cards-list__remainingCard-3B {
             display: none !important;
        }

        /* --- Перестройка сетки в один столбик --- */

        /* 1. Основной контейнер сетки статей */
        .desktop2--adaptive-card-grid__container-2l {
            display: flex !important;
            flex-direction: column !important;
            align-items: center !important; /* Центрируем колонку */
            width: 100% !important;
            max-width: 100% !important;
            padding: 0 !important;
            gap: 20px !important; /* Расстояние между карточками */
            grid-template-columns: 1fr !important; /* Убираем грид-колонки */
        }

        /* 2. Общий контейнер ленты - даем ему пространство */
         .desktop2--redesign-feed__redesignFeed-36 {
            max-width: 800px !important; /* Ограничиваем ширину ленты */
            margin: 0 auto !important;   /* Центрируем ленту */
            padding-top: 20px; /* Небольшой отступ сверху после скрытия табов */
        }

        /* 3. Отдельные карточки статей */
        .desktop2--adaptive-card-grid__container-2l > div[data-testid="article-showcase-card"] {
            width: 100% !important;
            max-width: 100% !important; /* Карточка занимает всю ширину колонки */
            margin: 0 !important; /* Убираем внешние отступы, gap сделает свое дело */
            padding: 0 !important;
            box-sizing: border-box;
             /* Сброс свойств, которые могли влиять на позиционирование в сетке */
            grid-column: auto !important;
            flex-basis: auto !important;
         }

        /* 4. Внутренний враппер карточки статьи */
        .desktop2--card-article__cardWrapper-1S,
        .desktop2--card-part-wrapper__cardPartWrapper-3S {
            width: 100% !important;
            max-width: 100% !important;
            height: auto !important; /* Автоматическая высота */
        }

        /* 5. Возможно, нужно убрать мин. высоту у рекламных контейнеров (на всякий случай) */
         .desktop2--card-rtb__zenadShouldLimitMinHeight-3S {
            min-height: 0 !important;
         }

         /* --- Дополнительные мелкие правки --- */
         /* Убираем потенциальные боковые отступы у родительских блоков */
         .desktop2--article-showcase-feed__articleFeed-1B {
            padding: 0 !important;
         }
    `;

    // Применяем стили
    addGlobalStyle(customCSS);

    // Опционально: Можно добавить MutationObserver для отслеживания
    // динамически добавляемых рекламных блоков, если CSS не справляется,
    // но обычно CSS правил с `!important` достаточно.

})();