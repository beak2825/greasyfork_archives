// ==UserScript==
// @name         Surgut | Скрипт для технического специалиста
// @namespace    https://forum.blackrussia.online/
// @version      0.1.0.0.1
// @description  Для модерирования и работы на форуме
// @author       C. Stoyn
// @match        https://forum.blackrussia.online/*
// @include      https://forum.blackrussia.online/
// @icon         https://icons.iconarchive.com/icons/arturo-wibawa/akar/256/bluetooth-icon.png
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/525788/Surgut%20%7C%20%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D1%82%D0%B5%D1%85%D0%BD%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%BE%D0%B3%D0%BE%20%D1%81%D0%BF%D0%B5%D1%86%D0%B8%D0%B0%D0%BB%D0%B8%D1%81%D1%82%D0%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/525788/Surgut%20%7C%20%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D1%82%D0%B5%D1%85%D0%BD%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%BE%D0%B3%D0%BE%20%D1%81%D0%BF%D0%B5%D1%86%D0%B8%D0%B0%D0%BB%D0%B8%D1%81%D1%82%D0%B0.meta.js
// ==/UserScript==

(function() {
    'use strict';

    scriptInit();

    function buttonConfig(text, href) {
        const button = document.createElement("button");
        button.textContent = text;
        button.classList.add("bgButton");
        button.addEventListener("click", () => {
            window.location.href = href;
        });
        return button;
    }

    function createButtons() {
        const bgButtons = document.querySelector(".pageContent");

        const buttonPlayer = buttonConfig("ЖБ на игроков", "https://forum.blackrussia.online/forums/3967/");
        const buttonAdmin = buttonConfig("ЖБ на техов", "https://forum.blackrussia.online/forums/3946/");
        const buttonServer = buttonConfig("Тех раздел", "https://forum.blackrussia.online/forums/3978/")
        const buttonRules = buttonConfig("Правила проекта", "https://forum.blackrussia.online/threads/312571/");

        bgButtons.append(buttonPlayer);
        bgButtons.append(buttonAdmin);
        bgButtons.append(buttonServer);
        bgButtons.append(buttonRules);
    }

    function createButton() {
        const elements1 = document.querySelectorAll('.structItem.structItem--thread.is-prefix14');
        const elements2 = document.querySelectorAll('.structItem.structItem--thread.is-prefix2');
        const elements3 = document.querySelectorAll('.structItem.structItem--thread.is-prefix13');
        const elements4 = document.querySelectorAll('.structItem.structItem--thread.is-prefix18');
        const elements5 = document.querySelectorAll('.structItem.structItem--thread.is-prefix19');

        const count1 = elements1.length;
        const count2 = elements2.length;
        const count3 = elements3.length;
        const count4 = elements4.length;
        const count5 = elements5.length;

        const button1 = document.createElement('button');
        const button2 = document.createElement('button');
        const button3 = document.createElement('button');
        const button4 = document.createElement('button');
        const button5 = document.createElement('button');

        button1.textContent = "Ожидание: " + count1;
        button1.style.position = 'fixed';
        button1.style.bottom = '20px';
        button1.style.left = '20px';
        button1.style.padding = '10px';
        button1.style.backgroundColor = '#000';
        button1.style.color = 'white';
        button1.style.border = '1px solid #ffffff';
        button1.style.borderRadius = '10px';
        button1.style.cursor = 'pointer';
        button1.style.zIndex = '10000';

        button2.textContent = "На рассмотрении: " + count2;
        button2.style.position = 'fixed';
        button2.style.bottom = '70px';
        button2.style.left = '20px';
        button2.style.padding = '10px';
        button2.style.backgroundColor = '#000';
        button2.style.color = 'white';
        button2.style.border = '1px solid #ffffff';
        button2.style.borderRadius = '10px';
        button2.style.cursor = 'pointer';
        button2.style.zIndex = '10000';

        button3.textContent = "Теху: " + count3;
        button3.style.position = 'fixed';
        button3.style.bottom = '120px';
        button3.style.left = '20px';
        button3.style.padding = '10px';
        button3.style.backgroundColor = '#000';
        button3.style.color = 'white';
        button3.style.border = '1px solid #ffffff';
        button3.style.borderRadius = '10px';
        button3.style.cursor = 'pointer';
        button3.style.zIndex = '10000';

        button4.textContent = "Жалоб: " + count4;
        button4.style.position = 'fixed';
        button4.style.bottom = '170px';
        button4.style.left = '20px';
        button4.style.padding = '10px';
        button4.style.backgroundColor = '#000';
        button4.style.color = 'white';
        button4.style.border = '1px solid #ffffff';
        button4.style.borderRadius = '10px';
        button4.style.cursor = 'pointer';
        button4.style.zIndex = '10000';

        button5.textContent = "Обжалований: " + count5;
        button5.style.position = 'fixed';
        button5.style.bottom = '220px';
        button5.style.left = '20px';
        button5.style.padding = '10px';
        button5.style.backgroundColor = '#000';
        button5.style.color = 'white';
        button5.style.border = '1px solid #ffffff';
        button5.style.borderRadius = '10px';
        button5.style.cursor = 'pointer';
        button5.style.zIndex = '10000';

        document.body.appendChild(button1);
        document.body.appendChild(button2);
        document.body.appendChild(button3);
        document.body.appendChild(button4);
        document.body.appendChild(button5);
    }
//background-image: url(http://postimg.su/image/22j5A30u/photo_2025-03-10_15-29-42.jpg);
    function applyBodyStyle() {
        const bodyStyle = document.createElement('style');
        bodyStyle.id = 'main-body-theme';
        bodyStyle.textContent = `
            html {
                background-image: url("https://i.pinimg.com/originals/8d/38/88/8d3888949373dba368980154aa80f18f.jpg");
                background-repeat: no-repeat;
                background-position: center center;
                background-attachment: fixed;
                background-size: cover;
            }

            .buttonGroup>.button:first-child:not(:last-child) {
                border-right: 1px solid #FFFFFF !important;
            }

            .buttonGroup {
                border: 1px solid #FFFFFF !important;
                border-radius: 10PX;
            }

            .fr-box.fr-basic.is-focused .fr-toolbar.fr-top {
                background: linear-gradient(180deg, rgba(0, 0, 0, 0.75), rgba(0, 0, 0, 0.75))
            }

            .message-responseRow, .buttonGroup, .fr-box.fr-basic.is-focused, .fr-toolbar .fr-more-toolbar, .fr-command.fr-btn+.fr-dropdown-menu, .fr-box.fr-basic, button.button a.button.button--link, .input, .block-container, .block-minorTabHeader, .blockMessage, .input:focus, .input.is-focused, .js-quickReply.block .message, .block--messages .block-row, .js-quickReply .block-row {
                background: linear-gradient(90deg, rgba(51, 51, 51, 0.9) 0%, rgba(17, 17, 17, 0.9) 100%) !important;
            }

            .node--depth2:nth-child(even) .node-body, .node-body, .message-cell.message-cell--user, .message-cell.message-cell--action, .block--messages.block .message, .button.button--link {
                background-color: rgba(0, 0, 0, 0);
                background: rgba(0, 0, 0, 0);
            }

            .bgButton {
                background: transparent;
                border: 0px;
                color: rgba(255, 255, 255, 0.7) !important;
            }

            .bgButton:hover {
                color: #fff;
            }
        `;
        document.head.appendChild(bodyStyle);
    }

    function scriptInit() {

        createButtons();

        createButton();

        applyBodyStyle();

    }
})();