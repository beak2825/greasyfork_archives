// ==UserScript==
// @name         Forum Enhancement
// @namespace    http://tampermonkey.net/
// @version      2.4
// @description  Enhance forum UI with animations and effects
// @icon         https://i.imgur.com/GfCuryV.png
// @match        https://lolz.live/*
// @match        https://zelenka.guru/*
// @match        https://lolz.guru/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/504123/Forum%20Enhancement.user.js
// @updateURL https://update.greasyfork.org/scripts/504123/Forum%20Enhancement.meta.js
// ==/UserScript==

// Ваш код здесь

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

// при ники прожатие
GM_addStyle(`
  a.username.NoOverlay {
    display:inline-block!important;
    transition:transform .15s cubic-bezier(.4,0,.2,1),box-shadow .15s ease;
  }
  a.username.NoOverlay:hover {
    transform:scale(1.03);
    box-shadow:0 3px 8px rgba(0,0,0,.1);
  }
  a.username.NoOverlay._press {
    transform:scale(.94)!important;
    box-shadow:0 2px 5px rgba(0,0,0,.2)!important;
  }
`);

document.addEventListener('mousedown',e=>{
    const el=e.target.closest('a.username.NoOverlay');
    if(!el)return;
    el.classList.add('_press');
    setTimeout(()=>el.classList.remove('_press'),120);
},true);




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
        .fr-toolbar .fr-btn,
.manageItem,
.footerItem.button, .Menu.MenuOpened a
.actionsBlock .button {
    transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.fr-toolbar .fr-btn:hover,
.manageItem:hover,
.footerItem.button:hover,
.actionsBlock .button:hover {
    transform: scale(1.08);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
}

.fr-toolbar .fr-btn:active,
.manageItem:active,
.footerItem.button:active,
.actionsBlock .button:active {
    transform: scale(0.98);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}





   a > img.menuAvatar {
      display: inline-block !important;
      transition: transform 0.2s ease, box-shadow 0.2s ease;
    }

    a > img.menuAvatar:hover {
      transform: scale(1.03);
      box-shadow: 0 4px 10px rgba(0,0,0,0.15);
    }

    a > img.menuAvatar:active {
      transform: scale(0.94);
      box-shadow: 0 2px 6px rgba(0,0,0,0.25);
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
        background-color: #46d293 !important; /* Цвет фона при клике */
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
    width: 34px;
    height: 34px;
    border: 1px solid #333;

}

.dottesStyle.buttonStyle.PopupControl {

    background-color: rgba(54, 54, 54, 1);
    border: unset;
}

/* на стенке профиля преды арбы и тд */

 .tabs.mainTabs.Tabs.member_tabs li a {
    display: block;
    transition: transform 0.18s ease;
  }

  .tabs.mainTabs.Tabs.member_tabs li a:hover {
    transform: scale(1.01);
  }

  .tabs.mainTabs.Tabs.member_tabs li a:active {
    transform: scale(0.99);
  }







    `);
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
            left: 210px;
        }

        div.latestThreads [id^="thread-"] {
            transition: transform 0.15s ease;
        }

        div.latestThreads [id^="thread-"]:hover {
            transform: scale(1.005);
        }

        div.latestThreads [id^="thread-"]:active {
            transform: scale(0.99);
        }

        /* Анимация для элементов тем - LinkClicker и title */
        .discussionListItem .LinkClicker,
        .profile_threads_block .LinkClicker,
        .text_Ads .LinkClicker {
            transition: transform 0.15s ease;
        }

        div.latestThreads [id^="thread-"]:hover .LinkClicker,
        .discussionListItem:hover .discussionListItem--Wrapper .LinkClicker,
        .discussionListItem.item:hover .LinkClicker,
        .profile_threads_block:hover .LinkClicker,
        .text_Ads:hover .LinkClicker {
            transform: scale(1.005);
        }

        div.latestThreads [id^="thread-"]:active .LinkClicker,
        .discussionListItem:active .discussionListItem--Wrapper .LinkClicker,
        .discussionListItem.item:active .LinkClicker,
        .profile_threads_block:active .LinkClicker {
            transform: scale(0.99);
        }

        /* Анимация для заголовка темы */
        .discussionListItem .title,
        .discussionListItem .title.bold,
        .profile_threads_block .title,
        .profile_threads_block .title.bold {
            transition: transform 0.15s ease;
        }

        div.latestThreads [id^="thread-"]:hover .title.bold,
        .discussionListItem:hover .discussionListItem--Wrapper .title,
        .discussionListItem.item:hover .title,
        .profile_threads_block:hover .title.bold,
        .profile_threads_block:hover .title {
            transform: scale(1.005);
        }

        div.latestThreads [id^="thread-"]:active .title.bold,
        .discussionListItem:active .discussionListItem--Wrapper .title,
        .discussionListItem.item:active .title,
        .profile_threads_block:active .title.bold,
        .profile_threads_block:active .title {
            transform: scale(0.99);
        }


         /* Анимация нажатия на элемент кнопок */

           .button:hover {
          transform: scale(1.009); /* Уменьшение кнопки при нажатии */
        background-color: #333; /* Цвет фона при наведении */
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* Тень */
    }

    .button:active {
        transform: scale(0.998); /* Уменьшение кнопки при нажатии */
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2); /* Тень */
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

        a.button.withSendMoneyButton.primary.OverlayTrigger {
        background: rgba(0, 0, 0, 0.1) !important; /* #333 с прозрачностью 0.1 */
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

        .nodeText .nodeTitle:hover,
        .unread .nodeTitle:hover,
        /* штука снизу зеленая когда тык на тему */
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

         /* базовая кнопка — структура и переходы как у manageItem */
            a.CreateThreadButton.button.primary.full.callToAction {
            display: inline-block !important;
            position: relative !important;
            overflow: hidden !important;
            cursor: pointer !important;
            transform: scale(1) !important;
            transition: transform 0.2s ease, box-shadow 0.2s ease, background-color 0.2s ease !important;
                    will-change: transform;
            border-radius: 8px;
          }

          /* hover — мягкий подъём */
          a.CreateThreadButton.button.primary.full.callToAction:hover {
            transform: scale(1.08) !important;
            background-color: rgb(26, 114, 67) !important;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3) !important;
          }

          /* active — лёгкое прожатие */
          a.CreateThreadButton.button.primary.full.callToAction:active {
            transform: scale(0.98) !important;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2) !important;
          }

          /* бликовая полоса — не блокирует hover/active */
          a.CreateThreadButton.button.primary.full.callToAction::before {
            content: "";
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(
              90deg,
              rgba(255, 255, 255, 0) 0%,
              rgba(255, 255, 255, 0.4) 50%,
              rgba(255, 255, 255, 0) 100%
            );
            transition: transform 0.8s ease;
            transform: translateX(-100%);
            pointer-events: none; /* не мешает наведению */
            z-index: 0; /* под текстом */
          }

          a.CreateThreadButton.button.primary.full.callToAction:hover::before {
            transform: translateX(100%);
          }

          /* текст поверх блика */
          a.CreateThreadButton.button.primary.full.callToAction span {
            position: relative;
            z-index: 1;
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

        /* Анимация для блоков форумов с иконками */
        .forumTitleBlock {
            display: flex;
            align-items: center;
            transition: color 0.2s ease;
        }

        /* Анимация для SVG иконок в форумах */
        .NodeSvgIcon {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            transition: transform 0.3s ease;
        }

        .nodeTitle a:hover .NodeSvgIcon {
            transform: rotate(-15deg);
        }

        .nodeTitle a:active .NodeSvgIcon {
            transform: rotate(-10deg);
        }

        .nodeTitle a:hover .NodeSvgIcon svg {
            transition: transform 0.3s ease;
        }

        /* Анимация для текста заголовка форума */
        .forumTitle {
            transition: transform 0.2s ease, color 0.2s ease;
        }

        .nodeTitle a:hover .forumTitle {
            transform: translateX(2px);
        }

        .nodeTitle a:active .forumTitle {
            transform: translateX(0);
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

       .sectionMain.quickWrite, .heading.h1 {
        background: rgb(0,0,0) !important;
        background: rgba(155, 155, 155, 0.1) !important; /* White background with 10% opacity */
            border-radius: 10px; /* Rounded corners */
            backdrop-filter: blur(10px); /* Blur effect for glassmorphism */
            border: 1px solid rgba(155, 155, 155, 0.2); /* Optional: semi-transparent border */
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

    }

    .blockLinksList a,
        .blockLinksList label,  {
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



/* Вторичные кнопки с OverlayTrigger */
        a.button.secondary.OverlayTrigger {
            display: inline-block !important;
            padding: 10px 30px !important;
            transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        a.button.secondary.OverlayTrigger:hover {
            transform: scale(1.03);
            box-shadow: 0 4px 10px rgba(0,0,0,0.15);
        }

        /* Футерные элементы с OverlayTrigger */
        a.footerItem.OverlayTrigger {
            display: inline-block !important;
            padding: 10px 30px !important;
            transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        a.footerItem.OverlayTrigger:hover {
            transform: scale(1.03);
            box-shadow: 0 4px 10px rgba(0,0,0,0.15);
        }

        /* Конкретная кнопка "deposit-withdraw" */
        /* Кнопка "deposit-withdraw" для любого ника */
a.button.OverlayTrigger[href$="/deposit-withdraw"] {
    display: inline-block !important;
    padding: 10px 30px !important;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
}

a.button.OverlayTrigger[href$="/deposit-withdraw"]:hover {
    transform: scale(1.05);
    box-shadow: 0 4px 12px rgba(0,0,0,0.2);
}

a.button.OverlayTrigger[href$="/deposit-withdraw"]:active {
    transform: scale(0.98);
    box-shadow: 0 2px 4px rgba(0,0,0,0.15);
}
        a.username.NoOverlay {
        display: inline-block !important;
        transition: transform 0.2s ease, box-shadow 0.2s ease;
    }

    a.username.NoOverlay:hover {
        transform: scale(1.03);
        box-shadow: 0 4px 10px rgba(0,0,0,0.15);
    }


        /* Guarantor кнопка */
        a.button.secondary.guarantorbtn {
            display: inline-block !important;
            padding: 10px 30px !important;
            transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        a.button.secondary.guarantorbtn:hover {
            transform: scale(1.03);
            box-shadow: 0 4px 10px rgba(0,0,0,0.15);
        }


        a.amountBlock {
        display: inline-block !important;
        transition: transform 0.2s ease, box-shadow 0.2s ease;
    }

    a.amountBlock:hover {
        transform: scale(1.03);
    }

    /* Все ссылки внутри блока с иконками */
    .secondaryContent.blockLinksList.have-icon a {
        transition: transform 0.2s ease, box-shadow 0.2s ease;
    }

    .secondaryContent.blockLinksList.have-icon a:hover {
        transform: scale(1.05);
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
    }

    .secondaryContent.blockLinksList.have-icon a:active {
        transform: scale(0.98);
        box-shadow: 0 2px 4px rgba(0,0,0,0.15);
    }

    .xenOverlay.memberCard .avatar .img {
    display:inline-block!important;
    transition:transform .2s cubic-bezier(.4,0,.2,1), box-shadow .2s ease;
  }

  .xenOverlay.memberCard .avatar .img:hover {
    transform:scale(1.03);
    box-shadow:0 4px 10px rgba(0,0,0,.15);
  }

  .xenOverlay.memberCard .avatar .img:active {
    transform:scale(0.93);
    box-shadow:0 2px 6px rgba(0,0,0,.25);
  }







    `;

    (function () {
        'use strict';
        const css = `
    .hotThreadsContainer {
      position: relative;
      border-radius: 10px;
      overflow: visible;
      z-index: 0;
    }

    /* линии рамки */
    .hotThreadsContainer::before,
    .hotThreadsContainer::after,
    .hotThreadsContainer span.ht-top,
    .hotThreadsContainer span.ht-bottom {
      position: absolute;
      background: linear-gradient(90deg,#ff9f1c,#ffcc00);
      transition: all .45s cubic-bezier(.4,0,.2,1);
      pointer-events: none;
      z-index: 1;
      display: block;
      content: "";
    }

    /* боковые — теперь со скруглениями */
    .hotThreadsContainer::before,
    .hotThreadsContainer::after {
      width: 2px;
      height: 0;
      bottom: 0;
      background: linear-gradient(180deg,#ff9f1c,#ffcc00);
      border-radius: 10px; /* 👈 добавлено */
    }
    .hotThreadsContainer::before { left: 0; }
    .hotThreadsContainer::after  { right: 0; }

    /* верх и низ */
    .hotThreadsContainer span.ht-top,
    .hotThreadsContainer span.ht-bottom {
      height: 2px;
      width: 0;
      left: 0;
      border-radius: 10px; /* 👈 тоже чуть скруглим для ровности */
    }
    .hotThreadsContainer span.ht-top { top: 0; }
    .hotThreadsContainer span.ht-bottom { bottom: 0; }

    .hotThreadsContainer:hover::before,
    .hotThreadsContainer:hover::after { height: 100%; }
    .hotThreadsContainer:hover span.ht-top,
    .hotThreadsContainer:hover span.ht-bottom { width: 100%; }

    /* темы — лёгкий эффект */
    .hotThreadsContainer .threadItem {
      transition: transform .25s ease, box-shadow .25s ease;
      border-radius: 6px;
      position: relative;
      z-index: 2;
    }
    .hotThreadsContainer .threadItem:hover {
      transform: scale(1.007);
      box-shadow: 0 1px 10px rgba(0,0,0,.15);
    }
    .hotThreadsContainer .threadItem:active {
      transform: scale(0.995);
      box-shadow: 0 1px 3px rgba(0,0,0,.15);
    }

    a[href="forums/8/"],
    a[href="/forums/8/"],
    a[href="forums/587/"],
    a[href="/forums/587/"],
    a[href="forums/435/"],
    a[href="/forums/435/"],
    a[href="forums/85/"],
    a[href="/forums/85/"],
    a[href="forums/86/"],
    a[href="/forums/86/"],
    a[href="forums/88/"],
    a[href="/forums/88/"],
    a[href="forums/4/"],
    a[href="/forums/4/"] {
        background: transparent !important;
    }


  `;
        const style = document.createElement('style');
        style.textContent = css;
        document.head.appendChild(style);

        const c = document.querySelector('.hotThreadsContainer');
        if (c && !c.querySelector('.ht-top')) {
            c.insertAdjacentHTML('beforeend', `
      <span class="ht-top"></span>
      <span class="ht-bottom"></span>
    `);
        }
    })();

    (function () {
  'use strict';

  // 🔧 ГЛОБАЛЬНЫЕ НАСТРОЙКИ
  const hoverBrightness = 0.99; // яркость при hover (1.0 = без изменений)
  const hoverAlpha = 0.03;      // прозрачность фона (0.05 = еле видно, 0.15 = ярче)

  const colorMap = {
    '.node4.node .nodeText .nodeTitle a::before':   '#FF2A46',
    '.node8.node .nodeText .nodeTitle a::before':   '#FF9F31',
    '.node85.node .nodeText .nodeTitle a::before':  '#32FF9F',
    '.node86.node .nodeText .nodeTitle a::before':  '#A672FF',
    '.node88.node .nodeText .nodeTitle a::before':  '#FFB42A',
    '.node435.node .nodeText .nodeTitle a::before': '#36C3FF',
    '.node587.node .nodeText .nodeTitle a::before': '#2F90FF'
  };

  window.addEventListener('load', () => {
    setTimeout(() => {
      addStyle(`
        .node .nodeText .nodeTitle,
        .node .nodeText .nodeTitle a,
        .subForumList .nodeTitle a {
          transition: color 0.25s ease, background-color 0.25s ease, border-color 0.25s ease, filter 0.25s ease;
        }
      `);

      for (const [selector, color] of Object.entries(colorMap)) {
        const encoded = encodeURIComponent(color);
        const hoverSel  = selector.replace('::before', ':hover::before');
        const activeSel = selector.replace('.node ', '.node.current ').replace('::before', '::before');
        const textHover = selector.replace('::before', ':hover');
        const textActive = selector.replace('.node ', '.node.current ').replace('::before', '');
        const nodeRoot = selector.match(/\.node\d+\.node/)?.[0];
        const bg = getSvgBackground(selector);
        if (!bg || !nodeRoot) continue;

        const newBg = bg.replace(/%23[0-9A-Fa-f]{3,6}/g, encoded);
        const rgbaHover = hexToRgba(color, hoverAlpha * hoverBrightness);
        const rgbaActive = hexToRgba(color, hoverAlpha + 0.02);

        const css = `
          /* ===== ${nodeRoot} (${color}) ===== */
          ${hoverSel} {
            background-image: ${newBg} !important;
            filter: brightness(${hoverBrightness});
          }

          ${activeSel} {
            background-image: ${newBg} !important;
            filter: brightness(1.05);
          }

          ${textHover} {
            color: ${adjustBrightness(color, hoverBrightness)} !important;
          }

          ${textActive} {
            color: ${color} !important;
          }

          /* hover: подсветка и фон */
          ${nodeRoot} .nodeText .nodeTitle:hover,
          ${nodeRoot} .unread .nodeTitle:hover {
            background-color: ${rgbaHover} !important;
            color: ${adjustBrightness(color, hoverBrightness)} !important;
            border-bottom: 2px solid ${adjustBrightness(color, hoverBrightness)} !important;
          }

          /* active: яркий */
          ${nodeRoot} .nodeTitle.active,
          .nodeList ${nodeRoot}.current > .nodeInfo > .nodeText > .nodeTitle,
          .nodeList ${nodeRoot} .current > div > .nodeTitle {
            background-color: ${rgbaActive} !important;
            color: ${color} !important;
            border-bottom: 2px solid ${color} !important;
          }

          /* подфорумы */
          ${nodeRoot} .subForumList .node .nodeTitle a.menuRow:hover {
            color: ${adjustBrightness(color, hoverBrightness)} !important;
            border-bottom-color: ${adjustBrightness(color, hoverBrightness)} !important;
          }
          ${nodeRoot} .subForumList .node.current .nodeTitle a.menuRow {
            color: ${color} !important;
            border-bottom-color: ${color} !important;
          }

          /* адаптация стандартного #2d2d2d под цвет */
          ${nodeRoot} h3.nodeTitle > a:hover {
            background-color: ${hexToRgba(color, hoverAlpha * hoverBrightness)} !important;
            transition: background-color 0.25s ease;
          }
        `;
        addStyle(css);
      }
    }, 400);
  });

  // ===== вспомогательные функции =====
  function getSvgBackground(selector) {
    const el = document.querySelector(selector.replace('::before', ''));
    if (!el) return null;
    const style = getComputedStyle(el, '::before');
    const bg = style.backgroundImage;
    return (bg && bg.includes('data:image/svg+xml')) ? bg : null;
  }

  function addStyle(css) {
    const s = document.createElement('style');
    s.textContent = css.trim();
    document.head.appendChild(s);
  }

  function hexToRgba(hex, alpha = 1) {
    const n = parseInt(hex.replace('#', ''), 16);
    const r = (n >> 16) & 255;
    const g = (n >> 8) & 255;
    const b = n & 255;
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

  function adjustBrightness(hex, factor = 1) {
    const n = parseInt(hex.replace('#', ''), 16);
    let r = Math.min(255, Math.round(((n >> 16) & 255) * factor));
    let g = Math.min(255, Math.round(((n >> 8) & 255) * factor));
    let b = Math.min(255, Math.round((n & 255) * factor));
    return `rgb(${r}, ${g}, ${b})`;
  }
})();




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
        // Обработка для ника cart
        const nick0x88 = Array.from(pageTopElement.querySelectorAll('span')).find(span => span.textContent === 'Cartier');
        if (nick0x88) {
            createRainbowText(nick0x88, 'Owner SmoothAnimation', '🧊');
        }

        // Обработка для ника MSHR
        const nickMSHR = Array.from(pageTopElement.querySelectorAll('span')).find(span => span.textContent === 'MSHR');
        if (nickMSHR) {
            createRainbowText(nickMSHR, 'раб cartier, хуесос', '⚫');
        }
    }
    // Обработка для ника goodplayer
    const nickgood_players = Array.from(pageTopElement.querySelectorAll('span')).find(span => span.textContent === 'good_players');
    if (nickgood_players) {
        createRainbowText(nickgood_players, 'Спонсор Cartier, 100RUB', '💰');



    }
    // Обработка для ника AVENICK
    const Avenick = Array.from(pageTopElement.querySelectorAll('span')).find(span => span.textContent === 'Avenick');
    if (Avenick) {
        createRainbowText(Avenick, 'Bug Hunter SmoothAnimation', '👾');

    }
    // Обработка для ника goodplayer
    const k1erry = Array.from(pageTopElement.querySelectorAll('span')).find(span => span.textContent === 'k1erry');
    if (k1erry) {
        createRainbowText(k1erry, 'Спонсор Cartier, 111RUB', '💰');
    }
})();






