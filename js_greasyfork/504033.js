// ==UserScript==
// @name         Forum Enhancement
// @namespace    http://tampermonkey.net/
// @version      1
// @description  Enhance forum UI with animations and effects
// @match        https://lolz.live/*
// @match        https://zelenka.guru/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/504033/Forum%20Enhancement.user.js
// @updateURL https://update.greasyfork.org/scripts/504033/Forum%20Enhancement.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Основные стили
    GM_addStyle(`
        /* Основные категории */
        .nodeTitle {
            transition: background-color 0.3s ease, color 0.3s ease, border-bottom 0.3s ease;
            position: relative;
            padding-bottom: 2px;
            border-bottom: 2px solid transparent;

        }

        .node .nodeTitle .expandSubForumList {
            right: 7px;
        }

         /* Анимация нажатия на элемент discussionListItem--Wrapper */
        .discussionListItem--Wrapper {
            transition: transform 0.15s ease;
        }

        .discussionListItem--Wrapper:hover {
            transform: scale(1.005);
        }

        .discussionListItem--Wrapper:active {
            transform: scale(0.99);
        }


             /* юзер профиль и ава профиль  */
            .memberCardInner {
            background: rgba(255, 255, 255, 0.1); /* White background with 10% opacity */
            border-radius: 10px; /* Rounded corners */
            padding: 16px; /* Padding inside the card */
            backdrop-filter: blur(10px); /* Blur effect for glassmorphism */
            border: 1px solid rgba(255, 255, 255, 0.2); /* Optional: semi-transparent border */
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); /* Optional: subtle shadow */
            color: rgb(214, 214, 214); /* Text color */
             .bottom {
            background: none !important;
        }
        .top {
            border-radius: 15px
        }
        }

          /* Основной стиль для поля ввода */
        #searchBar .textCtrl.QuickSearchQuery {
            border-radius: 15px; /* Круглые углы для стилизации */
            padding-right: 30px; /* Отступ для иконки очистки */
            /* Остальные стили не изменяются */
        }

        /* Стили для кнопки обновления ленты */
        .UpdateFeedButton {
            position: relative;
            display: inline-block;
            text-decoration: none; /* Если нужно, можно удалить, если текстовое оформление не требуется */
            border-radius: 4px;
            transition: background-color 0.3s ease, transform 0.3s ease, opacity 0.3s ease;
        }

        .UpdateFeedButton:hover {
            transform: scale(1.05);
        }

        .UpdateFeedButton:active {
            opacity: 0.7;
            transform: scale(0.95);
        }

        /* Стили для ссылки настройки ленты */
        .SelectExcludedForumsLink {
            position: relative;
            display: inline-block;
            text-decoration: none;
            border-radius: 4px;
            transition: background-color 0.3s ease, transform 0.3s ease, opacity 0.3s ease;
        }

        .SelectExcludedForumsLink:hover {
            transform: scale(1.05);
        }

        .SelectExcludedForumsLink:active {
            opacity: 0.7;
            transform: scale(0.95);
        }


          /* !!!Меню с аватаркой */

           .secondaryContent.blockLinksList li a {
            position: relative;
            display: block;
            transition: background-color 0.3s, transform 0.3s;
            border-radius: 6px;

        }

        .secondaryContent.blockLinksList li a:hover {
            background-color: rgba(0, 186, 120, 0.5);
            transform: translateX(5px);
        }

        .secondaryContent.blockLinksList li a:active {
            background-color: rgba(0, 186, 120, 0.5);
            transform: scale(0.98);
        }

  /* Стили для кнопок input */
        .button.primary.mbottom {
            font-size: 13px;
            color: white;
            text-decoration: none;
            background-color: rgb(34, 142, 93);
            padding: 0px 15px;
            border-style: none;
            border-radius: 8px;
            user-select: none;
            font-style: normal;
            text-align: center;
            outline: none;
            line-height: 34px;
            display: inline-block;
            cursor: pointer;
            box-sizing: border-box;
            vertical-align: top;
            -webkit-appearance: none !important;
            font-weight: 600;
            transition: transform 0.3s ease, box-shadow 0.3s ease;
            overflow: hidden;
            height: 34px;
        }

        .PreviewButton.JsOnly {
            font-size: 13px;
            color: white;
            text-decoration: none;
            background-color: rgb(54, 54, 54);
            padding: 0px 15px;
            border-style: none;
            border-radius: 6px;
            user-select: none;
            font-style: normal;
            text-align: center;
            outline: none;
            line-height: 34px;
            display: inline-block;
            cursor: pointer;
            box-sizing: border-box;
            vertical-align: top;
            -webkit-appearance: none !important;
            font-weight: 600;
            transition: transform 0.3s ease, box-shadow 0.3s ease;
            overflow: hidden;
            height: 34px;
        }

        /* Эффект увеличения при наведении */
        .button.primary.mbottom:hover,
        .PreviewButton.JsOnly:hover {
            transform: scale(1.05);
            box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3);
        }

        /* Эффект нажатия */
        .button.primary.mbottom:active,
        .PreviewButton.JsOnly:active {
            transform: scale(0.95);
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
        }

        .nodeTitle:hover,
        .nodeTitle.active {
            background-color: rgba(0, 186, 120, 0.1);
            color: rgb(0, 186, 120);
            border-bottom: 2px solid rgb(0, 186, 120);
        }

        .node {
            transition: color 0.3s ease;
        }

        .node:hover {
            color: rgb(0, 186, 120);
        }

        .nodeTitle.active ~ .node {
            color: rgb(0, 186, 120);
        }

        /* Стили для кнопки "Создать тему" */
        .CreateThreadButton {
            display: inline-block;
            background-color: rgb(34, 142, 93);
            color: white;
            font-size: 13px;
            font-weight: bold;
            text-align: center;
            text-decoration: none;
            cursor: pointer;
            position: relative;
            overflow: hidden;
            transition: transform 0.3s ease, background-color 0.3s ease, box-shadow 0.3s ease;
            line-height: 34px;
            border-radius: 8px;
            height: 34px;
            border: none;
            padding: 0;
        }

        .CreateThreadButton:hover {
            background-color: rgb(26, 114, 67);
            transform: scale(1.05);
            box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3);
        }

        .CreateThreadButton:active {
            transform: scale(0.95);
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
        }

        .CreateThreadButton::before {
            content: "";
            position: absolute;
            top: 0;
            left: -100%;
            height: 100%;
            width: 100%;
            background: linear-gradient(90deg, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.5) 50%, rgba(255, 255, 255, 0) 100%);
            transition: transform 0.5s ease;
            z-index: 1;
            transform: translateX(-100%);
        }

        .CreateThreadButton:hover::before {
            transform: translateX(100%);
        }

        .CreateThreadButton span {
            position: relative;
            z-index: 2;
        }

        /* Стили для иконки лайка */
        .LikeLink {
            position: relative;
            display: inline-block;
        }

        .LikeLink .icon.like2Icon {
            fill: rgb(140, 140, 140);
            transition: fill 0.3s ease, transform 0.2s ease;
        }

        .LikeLink:hover .icon.like2Icon {
            transform: scale(1.1);
        }

        .LikeLink:active .icon.like2Icon {
            transform: scale(0.95);
        }

        /* Стили для иконок счетчика и скрытых ответов */
        .PostCommentButton .icon.postCounterIcon,
        ._hiddenReplyButton .icon.hiddenReplyIcon,
        .LikeLink .icon.likeCounterIcon {
            fill: rgb(140, 140, 140);
            transition: fill 0.3s ease, transform 0.2s ease;
        }

        .PostCommentButton:hover .icon.postCounterIcon,
        ._hiddenReplyButton:hover .icon.hiddenReplyIcon,
        .LikeLink:hover .icon.likeCounterIcon {
            transform: scale(1.1);
        }

        .PostCommentButton:active .icon.postCounterIcon,
        ._hiddenReplyButton:active .icon.hiddenReplyIcon,
        .LikeLink:active .icon.likeCounterIcon {
            transform: scale(0.95);
        }

        /* Колокольчик и личные сообщения */
        .navTabs .navTab.Popup .navLink .counter-container svg,
        .navTabs .navTab.PopupOpen .navLink .counter-container svg {
            transition: transform 0.3s ease;
        }

        .navTabs .navTab.Popup .navLink:hover .counter-container svg,
        .navTabs .navTab.PopupOpen .navLink .counter-container svg:hover {
            transform: rotate(-15deg);
        }

        /* Наклон SVG значков при наведении */
        .nodeText .nodeTitle a::before {
            transition: transform 0.3s ease;
        }

        .nodeTitle:hover a::before {
            transform: rotate(-15deg);
        }

        /* Стили для логотипа */
        #lzt-logo {
            display: inline-block;
            transition: transform 0.2s ease, opacity 0.2s ease;
        }

        /* Эффект увеличения при наведении */
        #lzt-logo:hover {
            transform: scale(1.05);
        }

        /* Эффект нажатия */
        #lzt-logo:active {
            transform: scale(0.95);
            opacity: 0.7;
        }

        /* Стили для кнопки чата */
        .chat2-button {
            background-color: rgb(0, 186, 120);
            border-radius: 50%;
            transition: transform 0.3s ease, background-color 0.3s ease;
            cursor: pointer;
        }

        .chat2-button:hover {
            transform: scale(1.1) rotate(5deg);
            background-color: rgb(0, 200, 130);
        }

        .chat2-button:active {
            transform: scale(0.95) rotate(-5deg);
            background-color: rgb(0, 160, 100);
        }

        .chat2-button:focus {
            outline: none;
        }

        /* Анимация значков визитор панели */
        .likeCounterIcon {
            transition: transform 0.3s ease;
        }

        .likeCounterIcon:hover {
            transform: scale(1.1);
            transition: transform 0.3s ease;
        }

        .postCounterIcon {
            transition: transform 0.3s ease;
        }

        .postCounterIcon:hover {
            transform: scale(1.1);
            transition: transform 0.3s ease;
        }

        .button.primary.block {
            transition: transform 0.3s ease;

        }
        .button.primary.block:hover {
            transform: scale(1.05);
            transition: transform 0.3s ease;
        }

        /* Анимация тултип панели в профиле */
        .page_counter.Tooltip {
            transition: transform 0.15s ease;
        }

        .page_counter.Tooltip:hover {
            transform: scale(1.05);
            transition: transform 0.15s ease;
        }

        .page_counter {
            transition: transform 0.15s ease;
        }

        .page_counter:hover {
            transform: scale(1.05);
            transition: transform 0.15s ease;

    `);




    // Ловим нажатие на логотип
    const logo = document.querySelector('#lzt-logo');
    if (logo) {
        logo.addEventListener('click', () => {
            window.location.href = 'https://lolz.live';
        });
    }

    // Ловим клик на кнопку создания темы
    const createThreadButton = document.querySelector('.CreateThreadButton');
    if (createThreadButton) {
        createThreadButton.addEventListener('click', () => {
            // Действия при нажатии на кнопку создания темы
        });
    }


(function() {
    'use strict';

    // CSS для зеленого кружочка
    const style = document.createElement('style');
    style.innerHTML = `
        .green-circle {
            position: absolute;
            right: 10px;
            top: 50%;
            transform: translateY(-50%);
            width: 10px;
            height: 10px;
            background-color: rgb(34, 142, 93);
            border-radius: 50%;
            opacity: 0;
            transition: opacity 0.2s ease-in-out;
        }
        .discussionListItem:hover .green-circle {
            opacity: 1;
        }
    `;
    document.head.appendChild(style);

    // Функция для добавления зеленого кружочка
    function addGreenCircle(element) {
        const circle = document.createElement('div');
        circle.classList.add('green-circle');
        element.appendChild(circle);
    }

    // Найти все посты и добавить зеленые кружочки
    const threads = document.querySelectorAll('.discussionListItem');
    threads.forEach(thread => {
        addGreenCircle(thread);
    });

    // Функция для замены текста плейсхолдера
    function replacePlaceholderText() {
        const searchInput = document.querySelector('#searchBar .textCtrl.QuickSearchQuery');
        if (searchInput) {
            searchInput.placeholder = "Что будем искать?";
        }
    }

    // Запуск функции замены текста
    replacePlaceholderText();

})();
})();