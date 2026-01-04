// @license 0x88
// ==UserScript==
// @name         для сереги
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Enhance forum UI with animations and effects
// @match        https://lolz.live/*
// @match        https://zelenka.guru/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/505513/%D0%B4%D0%BB%D1%8F%20%D1%81%D0%B5%D1%80%D0%B5%D0%B3%D0%B8.user.js
// @updateURL https://update.greasyfork.org/scripts/505513/%D0%B4%D0%BB%D1%8F%20%D1%81%D0%B5%D1%80%D0%B5%D0%B3%D0%B8.meta.js
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

         .counter {
    display: inline-flex;
    align-items: center;
    color: #fff; /* Белый цвет текста */
    transition: transform 0.2s, color 0.2s; /* Плавная анимация при наведении */
    text-decoration: none;
}

.counter:hover {
    color: #D6D6D6; /* Цвет текста при наведении */
    transform: scale(1.05); /* Легкое увеличение при наведении */
}

.counterIcon {
    margin-right: 8px; /* Отступ иконки от текста */
    transition: transform 0.2s;
}

.counter:hover .counterIcon {
    transform: rotate(-15deg); /* Наклон иконки при наведении */
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

  /* Стили для кнопок input */
        .button.primary.mbottom {

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

        /* Анимация панели рядом с лого */
        .navTabs .navTab.selected .tabLinks a {
            transition: transform 0.3s ease;
        }

        .navTabs .navTab.selected .tabLinks a:hover {
            transform: scale(1.05);
            transition: transform 0.3s ease;
        }

        .navTabs .navTab.selected .tabLinks a:active {
            transform: scale(0.95);
            transition: transform 0.3s ease;
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

        .mn-15-0-0.button.primary.block {
            transition: transform 0.3s ease;

        }

        .mn-15-0-0.button.primary.block:hover {
            transform: scale(1.05);
            transition: transform 0.3s ease;
        }

        .mn-15-0-0.button.primary.block:active {
            transform: scale(0.95);
        }

        /* Анимация тултип панели в профиле */
        .page_counter.Tooltip {
            transition: transform 0.15s ease;
        }

        .page_counter.Tooltip:hover {
            transform: scale(1.05);
            transition: transform 0.15s ease;
        }

        .page_counter.Tooltip:active {
            transform: scale(0.95);
            transition: transform 0.15s ease;
        }

        .page_counter {
            transition: transform 0.15s ease;
        }

        .page_counter:hover {
            transform: scale(1.05);
            transition: transform 0.15s ease;
        }

        .page_counter:active {
            transform: scale(0.95);
            transition: transform 0.15s ease;
        }


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

    // Функция для замены текста плейсхолдера
    function replacePlaceholderText() {
        const searchInput = document.querySelector('#searchBar .textCtrl.QuickSearchQuery');
        if (searchInput) {
            searchInput.placeholder = "Что будем искать?";
        }
    }

    // Запуск функции замены текста
    replacePlaceholderText();

(function() {
    'use strict';

    // Добавление стилей для центрирования иконки и текста
    GM_addStyle(`
    .contact {
        display: inline-flex;
        align-items: center; /* Центрирует элементы по вертикали */
        justify-content: center; /* Центрирует элементы по горизонтали */
        border-radius: 8px;
        background-color: transparent; /* Убираем цвет фона */

        text-decoration: none;
        transition: transform 0.2s, box-shadow 0.3s, background-color 0.3s, color 0.3s; /* Плавный переход */
        position: relative;
        border: 2px solid #333; /* Обводка кнопки */
        text-align: center; /* Центрирование текста внутри кнопки */
        white-space: nowrap; /* Убирает перенос текста */
    }

    .contact:hover {
        background-color: #444; /* Цвет фона при наведении */
        color: #ffffff; /* Цвет текста при наведении */
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); /* Тень при наведении */
    }

    .contact:active {
        transform: scale(0.95); /* Уменьшение кнопки при нажатии */
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2); /* Тень при нажатии */
    }

    .contactIcon {
        margin-right: 8px; /* Отступ между иконкой и текстом */
        line-height: 1; /* Выравнивание иконки по вертикали с текстом */
        transition: color 0.3s; /* Плавное изменение цвета иконки */
    }

    .contact:hover .contactIcon {
        color: #0077b5; /* Цвет иконки при наведении */
    }

    a.contact{
     text-decoration: none;

    }



    /* Удаляем стили для goIcon */
    .goIcon {
        display: none; /* Скрываем иконку goIcon */
    }
    /* Общий стиль для ссылок внутри блока */
.userStatCounters .counter {

    border-radius: 8px; /* Закруглим углы */

    color: #fff; /* Цвет текста */
    text-decoration: none; /* Уберем подчеркивание */
    transition: all 0.3s ease; /* Плавный переход для всех свойств */
}

/* Стиль для эффекта нажатия */
.userStatCounters .counter:active {

    transform: scale(0.95); /* Немного уменьшаем размер */
    box-shadow: inset 0 4px 6px rgba(0,0,0,0.1); /* Добавим эффект внутренней тени */
}



    .button {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        border-radius: 8px;


        text-decoration: none;
        transition: transform 0.2s, box-shadow 0.3s, background-color 0.3s; /* Плавный переход */
        position: relative;

        text-align: center; /* Центрирование текста внутри кнопки */
        white-space: nowrap; /* Убирает перенос текста */
        height: unset !important;
    }




    .button .icon {
        margin-right: 8px; /* Отступ между иконкой и текстом */
        display: inline-flex;
        align-items: center;
        justify-content: center;
        transition: transform 0.2s; /* Плавное вращение иконки */
    }

    .button:hover .icon {
        transform: rotate(-20deg); /* Поворот иконки при наведении */
    }

    /* Выравнивание иконок по центру текста */
    .button span {
        display: flex;
        align-items: center;
    }

    /* КНОПОЧКИ */
    .xenOverlay.memberCard .userContentLinks .button .icon {
        margin: 0 !important; /* Убираем отступы у иконок и используем !important для переопределения */
        margin-right: 8px !important; /* Добавляем отступ справа */
    }


    /* !!!Стили для кнопок отправить деньги и сообщение в .xenOverlay.memberCard .top .right */

    .xenOverlay.memberCard .top .right a {

        display: inline-flex;
        align-items: center;
        justify-content: center;
        border-radius: 35px; /* Скругление углов */
        background-color: rgba(0,0,0, 0.21); /* Цвет фона
        color: #ffffff; /* Цвет текста */
        text-decoration: none;
        margin-right: 3px;
        border: 2px solid #333; /* Обводка кнопки */
        transition: background-color 0.3s, box-shadow 0.3s, transform 0.2s; /* Плавные переходы */


    }
/* кнопки сообщения отпр и денег */
    .xenOverlay.memberCard .top .right a:hover {
        background-color: #333; /* Цвет фона при наведении */
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); /* Тень */
    }

    .xenOverlay.memberCard .top .right a:active {
        transform: scale(0.95); /* Уменьшение кнопки при нажатии */
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2); /* Тень */
    }






      .userContentLinks .button .icon {
        margin: 0px 7px !important;
    }


    /* АНИМАЦИЯ СИМПОЧЕК И КОМЕНТОВ И КУБОЧКОВ В МИНИПРОФИЛЕ*/
   /* Стили для кнопки "Нельзя написать" */






    .counterIcon {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        margin-right: 8px; /* Отступ между иконкой и текстом */
        line-height: 1; /* Выравнивание иконки по вертикали с текстом */
    }

    /* Стили для кнопки Send Money */
        .actionButton--sendMoney {


            border-radius: 35px; /* Скругление углов */
            background-color: rgbargb(32,142,93, 0.50); /* Полупрозрачный фон */
            color: #333; /* Цвет текста */
            text-decoration: none; /* Убираем подчеркивание */
            border-left: 1px solid;


            transition: background-color 0.3s, box-shadow 0.3s, transform 0.2s; /* Плавные переходы */


        }

        .actionButton--sendMoney:hover {
            background-color: rgba(0, 0, 0, 0.22); /* Темнее фон при наведении */
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); /* Тень при наведении */
        }

        .actionButton--sendMoney:active {
            transform: scale(0.95); /* Уменьшение кнопки при нажатии */
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2); /* Тень при нажатии */
        }


     /* Стили для кнопки с классами followButton, button, block и OverlayTrigger */
.followButton.button.block.OverlayTrigger, span.button.disabled {

    border-radius: 3px; /* Закругление углов */
    background-color: rgba(54, 54, 54, 1);
    color: #ffffff; /* Цвет текста и иконки */


    border: 0px solid #333; /* Обводка кнопки */

    transition: background-color 0.3s, box-shadow 0.3s, transform 0.2s; /* Плавные переходы */
    cursor: pointer; /* Курсор для кнопки */
    text-align: center; /* Центрируем текст */

    font-weight: bold; /* Жирный шрифт */
}

.dottesStyle.buttonStyle{


    background: transparent;


    text-decoration: none;
    width: 35px;
    height: 33px;
    border: 1px solid #333;

}








    `);
})();
})();
})();


(function() {
    'use strict';

    // Создаем стили для анимации радужного эффекта и оформления
    const style = document.createElement('style');
    style.textContent = `
        @keyframes rainbow {
            0% { color: red; }
            16% { color: orange; }
            32% { color: yellow; }
            48% { color: green; }
            64% { color: blue; }
            80% { color: indigo; }
            100% { color: violet; }
        }
        .rainbow-text {
            font-weight: bold;
            animation: rainbow 5s infinite linear;

            margin-left: 10px;
            display: inline-flex;
            align-items: center;
        }
        .rainbow-text .icon {
            margin-right: 5px;

        }

        /* Стили для кнопки с классами button, primary и block */

.button.primary.block {
    border: 1px solid
    border-radius: 3px;
    background-color: rgba(34,142, 93, 1);
    text-decoration: none;


    transition: background-color 0.3s, box-shadow 0.3s, transform 0.2s;
}

.button.primary.block:hover {

    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); /* Тень при наведении */
}

.button.primary.block:active {
    transform: scale(0.95); /* Уменьшение кнопки при нажатии */
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2); /* Тень при нажатии */
}


     /* нельзя написать кнопко*/


    .button.withSendMoneyButton.disabled.OverlayTrigger.fl_r.Tooltip{

    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: 35px;
    background-color: rgba(0, 0, 0, 0.21);
    text-decoration: none;
    margin-right: 3px;
    border: 2px solid #333;
    transition: background-color 0.3s, box-shadow 0.3s, transform 0.2s;

     }



      /* ДИАЛОГ ЛИЧНЫЕ СООБЩЕНИЯ В ПРОФИЛЕ */

     .xenOverlay .section .heading, .xenOverlay .sectionMain .heading, .xenOverlay .errorOverlay .heading, {
       background: none;
       border-radius: 10px;
       }

       .sectionMain.quickWrite, .heading.h1{
        background: rgb(0,0,0) !important;
        background: rgba(255, 255, 255, 0.1) !important; /* White background with 10% opacity */
            border-radius: 10px; /* Rounded corners */
            padding: 16px; /* Padding inside the card */
            backdrop-filter: blur(10px); /* Blur effect for glassmorphism */
            border: 1px solid rgba(255, 255, 255, 0.2); /* Optional: semi-transparent border */
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); /* Optional: subtle shadow */
            color: rgb(214, 214, 214); /* Text color */

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

        .xenOverlay .primaryContent{
        background: rgba(0,0,0, 0.1);
        }

    .xenOverlay a.close{
    z-index: 999;
    margin: unset !important;
    }

    `;
    document.head.appendChild(style);

    // Функция для создания радужного текста
    function createRainbowText(nickElement, text, icon = '') {
        const newElement = document.createElement('span');
        newElement.classList.add('rainbow-text');

        // Если есть иконка, добавляем её
        if (icon) {
            const iconElement = document.createElement('span');
            iconElement.textContent = icon;
            iconElement.classList.add('icon');
            newElement.appendChild(iconElement);
        }

        const textNode = document.createTextNode(text);
        newElement.appendChild(textNode);

        // Вставляем новый элемент после найденного элемента с ником
        nickElement.parentNode.insertBefore(newElement, nickElement.nextSibling);
    }

    // Найти блок с классом "page_top"
    const pageTopElement = document.querySelector('.page_top');

    // Если блок найден
    if (pageTopElement) {
        // Обработка для ника 0х88
        const nick0x88 = Array.from(pageTopElement.querySelectorAll('span')).find(span => span.textContent === '0х88');
        if (nick0x88) {
            createRainbowText(nick0x88, 'Owner SmoothAnimation', '🧊');
        }

        // Обработка для ника MSHR
        const nickMSHR = Array.from(pageTopElement.querySelectorAll('span')).find(span => span.textContent === 'MSHR');
        if (nickMSHR) {
            createRainbowText(nickMSHR, 'раб 0х88', '⚫');
        }
    }
     // Обработка для ника goodplayer
        const nickgood_players = Array.from(pageTopElement.querySelectorAll('span')).find(span => span.textContent === 'good_players');
        if (nickgood_players) {
            createRainbowText(nickgood_players, 'Спонсор Анимок 0х88, 100RUB', '💰');

        }
     // Обработка для ника AVENICK
        const Avenick = Array.from(pageTopElement.querySelectorAll('span')).find(span => span.textContent === 'Avenick');
        if (Avenick) {
            createRainbowText(Avenick, 'Bug Hunter SmoothAnimation', '👾');

        }
})();


(function() {
    'use strict';

    // Добавляем стили анимации через Tampermonkey
    const style = document.createElement('style');
    style.innerHTML = `
        @keyframes pulseBlink {
            0%, 100% {
                transform: scale(1);
                opacity: 1;
            }
            50% {
                transform: scale(0.75);
                opacity: 0.5;
            }
        }

        .onlineMarker.Tooltip {
            animation: pulseBlink 1.5s infinite;
        }
    `;
    document.head.appendChild(style);
})();


(function() {
    'use strict';

    // Добавляем стили анимации через Tampermonkey
    const style = document.createElement('style');
    style.innerHTML = `
        @keyframes smoothPulseBlink {
            0%, 100% {
                transform: scale(1);
                opacity: 1;
            }
            50% {
                transform: scale(0.9);
                opacity: 0.8;
            }
        }

        .onlineMarker.Tooltip {
            animation: smoothPulseBlink 3s infinite ease-in-out;
        }
    `;
    document.head.appendChild(style);
})();


   (function() {
    'use strict';

    // Добавляем стили для пульсирующего эффекта
    const style = document.createElement('style');
    style.innerHTML = `
        .onlineMarker.Tooltip {
            position: relative;
            z-index: 1;
        }

        .onlineMarker.Tooltip::before {
            content: '';
            position: absolute;
            top: 50%;
            left: 50%;
            width: 100%;
            height: 100%;
            background-color: rgba(34, 142, 93, 0.5); /* Цвет пульсации */
            border-radius: 50%;
            transform: translate(-50%, -50%) scale(1);
            animation: pulseEffect 2s infinite;
            z-index: -1;
        }

        @keyframes pulseEffect {
            0% {
                transform: translate(-50%, -50%) scale(1);
                opacity: 1;
            }
            100% {
                transform: translate(-50%, -50%) scale(2.5);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
})();



(function() {
    'use strict';

    function handleBackgroundTransparency() {
        function setTransparentBackground() {
            const elements = document.querySelectorAll('.xenOverlay.memberCard .top');
            elements.forEach((element) => {
                const computedStyle = window.getComputedStyle(element);
                if (computedStyle.backgroundColor === 'rgb(39, 39, 39)') {
                    element.style.backgroundColor = 'rgba(39, 39, 39, 0)';
                }
            });
        }

        window.addEventListener('DOMContentLoaded', setTransparentBackground);

        const observer = new MutationObserver(() => setTransparentBackground());
        observer.observe(document.body, { childList: true, subtree: true });

        setTimeout(setTransparentBackground, 1000);
    }

    handleBackgroundTransparency();
})();

(function() {
    'use strict';
    // Подсветка кнопки подписаться или отписаться
    GM_addStyle(`
        .blockLinksList a,
        .blockLinksList label {
            position: relative;
            display: block;
            transition: background-color 0.3s, transform 0.3s;
            border-radius: 6px;
        }

        .blockLinksList a:hover,
        .blockLinksList label:hover {
            background-color: rgba(0, 186, 120, 0.5);
            transform: translateX(5px);
        }

        .blockLinksList a:active,
        .blockLinksList label:active {
            background-color: rgba(0, 186, 120, 0.5);
            transform: scale(0.98);
        }
    `);

})();

(function() {
    'use strict';

    // Добавляем стили для анимации наведения и нажатия кнопок с классом "lzt-fe-se-extraButton"
    const style = document.createElement('style');
    style.innerHTML = `
        .lzt-fe-se-extraButton {
            transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .lzt-fe-se-extraButton:hover {
            transform: scale(1.08); /* Увеличение кнопки при наведении */
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3); /* Усиление тени при наведении */
        }

        .lzt-fe-se-extraButton:active {
            transform: scale(0.98); /* Уменьшение кнопки при нажатии */
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2); /* Легкая тень при нажатии */
        }
    `;
    document.head.appendChild(style);
})();

(function() {
    'use strict';

    // Добавляем стили для анимации наведения и нажатия кнопок внутри блока с классом "fr-toolbar"
    const style = document.createElement('style');
    style.innerHTML = `
        .fr-toolbar .fr-btn {
            transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .fr-toolbar .fr-btn:hover {
            transform: scale(1.08); /* Увеличение кнопки при наведении */
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3); /* Усиление тени при наведении */
        }

        .fr-toolbar .fr-btn:active {
            transform: scale(0.98); /* Уменьшение кнопки при нажатии */
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2); /* Легкая тень при нажатии */
        }
    `;
    document.head.appendChild(style);
})();

(function() {
    'use strict';

    // Добавляем стили для анимации наведения и нажатия псевдо-элемента ::before
    const style = document.createElement('style');
    style.innerHTML = `
        .simpleRedactor .lzt-fe-se-sendMessageButton::before {
            transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .simpleRedactor .lzt-fe-se-sendMessageButton:hover::before {
            transform: scale(1.1); /* Увеличение при наведении */
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3); /* Усиление тени при наведении */
        }

        .simpleRedactor .lzt-fe-se-sendMessageButton:active::before {
            transform: scale(0.95); /* Уменьшение при нажатии */
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2); /* Легкая тень при нажатии */
        }
    `;
    document.head.appendChild(style);
})();

(function() {
    'use strict';

    const style = document.createElement('style');
    style.innerHTML = `
        /* Для класса Menu HeaderMenu JsOnly MenuOpened */
        .Menu.HeaderMenu.JsOnly.MenuOpened .secondaryContent.blockLinksList li a,
        /* Для класса Menu HeaderMenu MenuOpened */
        .Menu.HeaderMenu.MenuOpened .secondaryContent.blockLinksList li a,
        /* Для класса Menu .secondaryContent */
        .Menu .secondaryContent.blockLinksList li a {
            position: relative;
            display: block;
            transition: background-color 0.3s, transform 0.3s;
            border-radius: 6px;
        }

        .Menu.HeaderMenu.JsOnly.MenuOpened .secondaryContent.blockLinksList li a:hover,
        .Menu.HeaderMenu.MenuOpened .secondaryContent.blockLinksList li a:hover,
        .Menu .secondaryContent.blockLinksList li a:hover {
            background-color: rgba(0, 186, 120, 0.5);
            transform: translateX(5px);
        }

        .Menu.HeaderMenu.JsOnly.MenuOpened .secondaryContent.blockLinksList li a:active,
        .Menu.HeaderMenu.MenuOpened .secondaryContent.blockLinksList li a:active,
        .Menu .secondaryContent.blockLinksList li a:active {
            background-color: rgba(0, 186, 120, 0.5);
            transform: scale(0.98);
        }
    `;
    document.head.appendChild(style);
})();