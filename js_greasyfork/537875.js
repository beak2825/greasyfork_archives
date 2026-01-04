// ==UserScript==
    // @name         Логисты by A.Nezgoduk
    // @namespace    https://forum.blackrussia.online/
    // @version      1.7.3
    // @description  Скрипт для Кураторов Форума по направлению Логов | Black Russia по всем вопросам на счет скрипта VK - https://vk.com/m1rozr | Дата создания: 31.05.2025 / Дата обновления: 02.06.2025
    // @author       Andrey_Nezgoduk
    // @match        https://forum.blackrussia.online/threads/*
    // @include      https://forum.blackrussia.online/threads/
    // @grant        none
    // @license      MIT
    // @icon         https://grizly.club/uploads/posts/2023-08/1691524743_grizly-club-p-kartinki-znachok-blek-rasha-bez-fona-1.png
// @downloadURL https://update.greasyfork.org/scripts/537875/%D0%9B%D0%BE%D0%B3%D0%B8%D1%81%D1%82%D1%8B%20by%20ANezgoduk.user.js
// @updateURL https://update.greasyfork.org/scripts/537875/%D0%9B%D0%BE%D0%B3%D0%B8%D1%81%D1%82%D1%8B%20by%20ANezgoduk.meta.js
    // ==/UserScript==

    (function() {
        'use strict';

        // !!!ВНИМАНИЕ!!! Укажите номер вашего сервера ниже
        const server = 31; // Замените 31 на номер вашего сервера

        // Создаем контейнер для интерфейса
        const container = document.createElement('div');
        container.className = 'log-search-wrapper';
        container.innerHTML = `
            <div class="log-search-container">
                <button id="textButton">Текст</button>
                <button id="loginButton">Вход/Выход</button>
                <button id="nickChangeButton">Смена Ника</button>
                <button id="familyButton">Семьи</button>
                <button id="changepropButton">Обмены ТС</button>
            </div>
        `;

        // Добавляем стили
        const style = document.createElement('style');
        style.textContent = `
            .log-search-wrapper .log-search-container {
                display: flex;
                flex-direction: row;
                align-items: center;
                gap: 1vw;
                justify-content: center;
                padding: 1rem;
                max-width: 90%;
                margin: 1rem auto;
                border-radius: 5px;
                box-sizing: border-box;
            }
            .log-search-wrapper .input-group {
                display: flex;
                flex-direction: column;
                gap: 1vh;
            }
            .log-search-wrapper .input-row {
                display: flex;
                flex-direction: row;
                align-items: center;
                gap: 1vw;
            }
            .log-search-wrapper input {
                width: 40vw;
                max-width: 300px;
                min-width: 200px;
                height: 5vh;
                max-height: 40px;
                padding: 0.8rem;
                font-size: clamp(14px, 2.5vw, 16px);
                border: 2px solid #8e24aa;
                border-radius: 5px;
                background-color: #ede7f6;
                color: #4a148c;
                box-sizing: border-box;
            }
            .log-search-wrapper input:hover, .log-search-wrapper input:active, .log-search-wrapper input:focus {
                border-color: #ce93d8;
                outline: none;
            }
            .log-search-wrapper button {
                width: auto;
                min-width: 100px;
                height: 5vh;
                max-height: 40px;
                padding: 0 1rem;
                font-size: clamp(14px, 2.5vw, 16px);
                border: 2px solid #8e24aa;
                border-radius: 5px;
                background-color: #ab47bc;
                color: white;
                cursor: pointer;
                box-sizing: border-box;
            }
            .log-search-wrapper button:hover, .log-search-wrapper button:active {
                background-color: #9c27b0;
                border-color: #ce93d8;
            }
            @media screen and (max-width: 600px) {
                .log-search-wrapper .log-search-container {
                    flex-direction: column;
                    gap: 1vh;
                }
                .log-search-wrapper .input-row {
                    flex-direction: column;
                    gap: 1vh;
                }
                .log-search-wrapper input {
                    width: 80vw;
                    min-width: 150px;
                }
                .log-search-wrapper button {
                    width: 80vw;
                    max-width: 200px;
                }
            }
        `;
        document.head.appendChild(style);

        // Находим форму с классом block js-quickReply
        const quickReplyForm = document.querySelector('.block.js-quickReply');
        if (quickReplyForm) {
            // Добавляем контейнер в конец формы
            quickReplyForm.appendChild(container);
        } else {
            // pass
        }

        // Функции для отображения кнопок
        function showButtons() {
            container.innerHTML = `
                <div class="log-search-container">
                    <button id="textButton">Текст</button>
                    <button id="loginButton">Вход/Выход</button>
                    <button id="nickChangeButton">Смена Ника</button>
                    <button id="familyButton">Семьи</button>
                    <button id="changepropButton">Обмены ТС</button>
                </div>
            `;
             // Обработчики кнопок
             document.getElementById('textButton').addEventListener('click', showTextFields);
             document.getElementById('loginButton').addEventListener('click', showLoginFields);
             document.getElementById('nickChangeButton').addEventListener('click', showNickChangeFields);
             document.getElementById('familyButton').addEventListener('click', showFamilyFields);
             document.getElementById('changepropButton').addEventListener('click', showChangepropsFields);
        }

        // Функции для отображения полей
        function showTextFields() {
            container.innerHTML = `
                <div class="log-search-container">
                    <div class="input-row">
                        <div class="input-group">
                            <input type="text" id="nickName" placeholder="Nick_Name">
                            <input type="text" id="text" placeholder="Текст">
                        </div>
                        <button id="searchButton">Искать</button>
                    </div>
                    <button id="backButton">Назад</button>
                </div>
            `;
            document.getElementById('searchButton').addEventListener('click', searchText);
            document.getElementById('backButton').addEventListener('click', showButtons);
            addEnterListener();
        }

        function showLoginFields() {
            container.innerHTML = `
                <div class="log-search-container">
                    <div class="input-row">
                        <input type="text" id="nickName" placeholder="Nick_Name">
                        <button id="searchButton">Искать</button>
                    </div>
                    <button id="backButton">Назад</button>
                </div>
            `;
            document.getElementById('searchButton').addEventListener('click', searchLogin);
            document.getElementById('backButton').addEventListener('click', showButtons);
            addEnterListener();
        }

        function showNickChangeFields() {
            container.innerHTML = `
                <div class="log-search-container">
                    <div class="input-row">
                        <input type="text" id="nickName" placeholder="Nick_Name">
                        <button id="searchButton">Искать</button>
                    </div>
                    <button id="backButton">Назад</button>
                </div>
            `;
            document.getElementById('searchButton').addEventListener('click', searchNickChange);
            document.getElementById('backButton').addEventListener('click', showButtons);
            addEnterListener();
        }
        
        function showFamilyFields() {
            container.innerHTML = `
                <div class="log-search-container">
                    <div class="input-row">
                        <input type="text" id="nickName" placeholder="Nick_Name">
                        <button id="searchButton">Искать</button>
                    </div>
                    <button id="backButton">Назад</button>
                </div>
            `;
            document.getElementById('searchButton').addEventListener('click', searchFamily);
            document.getElementById('backButton').addEventListener('click', showButtons);
            addEnterListener();
        }
        
        function showChangepropsFields() {
            container.innerHTML = `
                <div class="log-search-container">
                    <div class="input-row">
                        <div class="input-group">
                            <input type="text" id="nickNameS" placeholder="Nick_Name Продавца">
                            <input type="text" id="nickNameB" placeholder="Nick_Name Покупателя">
                        </div>
                        <button id="searchButton">Искать</button>
                    </div>
                    <button id="backButton">Назад</button>
                </div>
            `;
            document.getElementById('searchButton').addEventListener('click', searchChangeprop);
            document.getElementById('backButton').addEventListener('click', showButtons);
            addEnterListener();
        }

        // Функции поиска
        function searchText() {
            const nickName = encodeURIComponent(document.getElementById('nickName').value);
            const text = encodeURIComponent(document.getElementById('text').value);
            if (nickName && text) {
                const url = `https://logs.blackrussia.online/gslogs/${server}/?pname=${nickName}&td=%25${text}%25`;
                window.open(url, '_blank');
            }
        }

        function searchLogin() {
            const nickName = encodeURIComponent(document.getElementById('nickName').value);
            if (nickName) {
                const url = `https://logs.blackrussia.online/gslogs/${server}/?pname=${nickName}&ci=38`;
                window.open(url, '_blank');
            }
        }

        function searchNickChange() {
            const nickName = encodeURIComponent(document.getElementById('nickName').value);
            if (nickName) {
                const url = `https://logs.blackrussia.online/gslogs/${server}/?pname=${nickName}&ci=48`;
                window.open(url, '_blank');
            }
        }
        
        function searchFamily() {
            const nickName = encodeURIComponent(document.getElementById('nickName').value);
            if (nickName) {
                const url = `https://logs.blackrussia.online/gslogs/${server}/?pname=${nickName}&ci=5`;
                window.open(url, '_blank');
            }
        }
        
        function searchChangeprop() {
            const nickNameS = encodeURIComponent(document.getElementById('nickNameS').value);
            const nickNameB = encodeURIComponent(document.getElementById('nickNameB').value);
            if (nickNameS) {
                const url = `https://logs.blackrussia.online/gslogs/${server}/?pname=${nickNameS}&td=%25${nickNameB}%25&ci=17`;
                window.open(url, '_blank');
            }
        }


        // Обработчик Enter
        function addEnterListener() {
            document.addEventListener('keydown', function handler(event) {
                if (event.key === 'Enter') {
                    const nickName = document.getElementById('nickName')?.value;
                    const text = document.getElementById('text')?.value;
                    if (nickName && text) {
                        searchText();
                    } else if (nickName) {
                        if (document.getElementById('searchButton').onclick === searchLogin) {
                            searchLogin();
                        } else if (document.getElementById('searchButton').onclick === searchNickChange) {
                            searchNickChange();
                        }
                    }
                    // Удаляем обработчик после первого Enter, чтобы избежать дублирования
                    document.removeEventListener('keydown', handler);
                }
            });
        }

        // Обработчики кнопок
        document.getElementById('textButton').addEventListener('click', showTextFields);
        document.getElementById('loginButton').addEventListener('click', showLoginFields);
        document.getElementById('nickChangeButton').addEventListener('click', showNickChangeFields);
        document.getElementById('familyButton').addEventListener('click', showFamilyFields);
        document.getElementById('changepropButton').addEventListener('click', showChangepropsFields);
        document.getElementById('backButton').addEventListener('click', showButtons);
    })();