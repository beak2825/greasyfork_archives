// ==UserScript==
// @name         Упрощенная подача жалоб
// @namespace    https://forum.blackrussia.online/
// @version      0.1.2
// @description  Скрипт для упрощения подачи жалоб в разделы Администрации, Игроков, Лидеров, Техов и Обжалований
// @author       t.me/solukky
// @match        https://forum.blackrussia.online/forums/*
// @icon         https://forum.blackrussia.online/data/assets/logo/favicon-cust.png
// @license      t.me/solukky
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/480499/%D0%A3%D0%BF%D1%80%D0%BE%D1%89%D0%B5%D0%BD%D0%BD%D0%B0%D1%8F%20%D0%BF%D0%BE%D0%B4%D0%B0%D1%87%D0%B0%20%D0%B6%D0%B0%D0%BB%D0%BE%D0%B1.user.js
// @updateURL https://update.greasyfork.org/scripts/480499/%D0%A3%D0%BF%D1%80%D0%BE%D1%89%D0%B5%D0%BD%D0%BD%D0%B0%D1%8F%20%D0%BF%D0%BE%D0%B4%D0%B0%D1%87%D0%B0%20%D0%B6%D0%B0%D0%BB%D0%BE%D0%B1.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Находим кнопку "Создать тему"
    var createThreadLink = document.querySelector('.button--cta');

    // Получаем ссылку нашей страницы (для определения раздела)
    var currentUrl = decodeURIComponent(location.href);

    // Проверяем наличие кнопки и правильность раздела
    if (createThreadLink && (currentUrl.includes('Жалобы') || currentUrl.includes('Обжалования') || currentUrl.includes('Сервер'))) {
        createThreadLink.addEventListener('click', function (event) {
            event.preventDefault();
            showFields();
        });
    }

    // Создаем меню жалобы
    var form = document.createElement('form');
    form.id = "complaint-form";
    form.className = "--hidden";
    form.innerHTML = `
            <div class="complaint-window">
                <div id="complaintFields">
                    <label for="firstNickname" class="complaint-label" id="firstNicknameLabel" class="complaint-label"></label>
                    <input type="text" class="complaint-input" id="firstNickname" name="firstNickname" minlength=3 maxlength=32 autocomplete="off" required><br>

                    <label for="secondNickname" class="complaint-label" id="secondNicknameLabel" class="complaint-label"></label>
                    <input type="text" class="complaint-input" id="secondNickname" name="secondNickname" minlength=3 maxlength=32 autocomplete="off" required><br>

                    <label for="punishName" class="complaint-label" id="punishNameLabel" class="complaint-label"></label>
                    <input type="text" class="complaint-input" id="punishName" name="punishName" autocomplete="off" required><br>

                    <label for="punishDate" class="complaint-label" id="punishDateLabel" class="complaint-label"></label>
                    <input type="text" class="complaint-input" id="punishDate" name="punishDate" maxlength=10 autocomplete="off" required><br>

                    <label for="complaint" class="complaint-label" id="complaintLabel" class="complaint-label"></label>
                    <textarea class="complaint-input" id="complaint" name="complaint" rows="4" style="resize: none;" required></textarea><br>

                    <label for="evidence" class="complaint-label" id="evidenceLabel" class="complaint-label"></label>
                    <input type="text" class="complaint-input" id="evidence" name="evidence" autocomplete="off" required><br>

                    <div class="complaint-buttons" style="display: flex; justify-content: space-between;">
                        <button class="complaint-button cancel-complaint">Отмена</button>
                        <button type="submit" class="complaint-button submit-complaint">Создать</button>
                    </div>
                </div>
            </div>`;
    document.body.appendChild(form);

    // Добавляем событие нажатия на кнопку "Создать" в меню
    let contentToInsert;
    let titleToInsert;
    var submitButton = document.querySelector('.submit-complaint');
    submitButton.addEventListener('click', function (event) {
        event.preventDefault();
        var firstNicknameSend = document.getElementById("firstNickname").value;
        var secondNicknameSend = document.getElementById("secondNickname").value;
        var punishName = document.getElementById("punishName").value;
        var punishDate = document.getElementById("punishDate").value;
        var complaintSend = document.getElementById("complaint").value;
        var evidenceSend = document.getElementById("evidence").value;

        // Задаем логические выражения для Input'ов
        var nicknameRegex = /^[a-zA-Z]+_[a-zA-Z]+$/;
        var dateRegex = /^\d{2}\/\d{2}\/\d{4}$/;
        var linkRegex = /^https?:\/\/\S+$/;

        // Проверяем правильность ввода для каждого Input'а
        if (firstNicknameSend === '' || secondNicknameSend === '' || punishName === '' || punishDate === '' || complaintSend === '' || evidenceSend === '') {
            alert('Одно из необходимых полей пустое. Заполните все необходимые поля.');
        } else if (!nicknameRegex.test(firstNicknameSend) || !nicknameRegex.test(secondNicknameSend)) {
            alert('Некорректный формат одного из никнеймов, используйте формат: Nick_Name');
        } else if (!dateRegex.test(punishDate)) {
            alert('Некорректный формат даты, используйте формат: 31/12/2023');
        } else if (!linkRegex.test(evidenceSend) && evidenceSend != '-') {
            alert('Некорректная ссылка на доказательства, пожалуйста, воспользуйтесь файлообменником (Imgur, Yapx, Ibb)');
        } else {

            if (currentUrl.includes('администрацию')) {
                contentToInsert = `[FONT=verdana][B]NickName:[/B] [I]${firstNicknameSend}[/I]<br><br>`;
                contentToInsert += `[B]NickName администратора:[/B] [I]${secondNicknameSend}[/I]<br><br>`;
                contentToInsert += `[B]Дата получения наказания:[/B] [I]${punishDate}[/I]<br><br>`;
                contentToInsert += `[B]Суть жалобы:[/B] ${complaintSend}<br><br>`;
                contentToInsert += `[B]Доказательства:[/B] ${evidenceSend}[/FONT]`;
            } else if (currentUrl.includes('игроков')) {
                contentToInsert = `[FONT=verdana][B]NickName:[/B] [I]${firstNicknameSend}[/I]<br><br>`;
                contentToInsert += `[B]NickName игрока:[/B] [I]${secondNicknameSend}[/I]<br><br>`;
                contentToInsert += `[B]Дата совершенного нарушения:[/B] [I]${punishDate}[/I]<br><br>`;
                contentToInsert += `[B]Суть жалобы:[/B] ${complaintSend}<br><br>`;
                contentToInsert += `[B]Доказательства:[/B] ${evidenceSend}[/FONT]`;
            } else if (currentUrl.includes('лидеров')) {
                contentToInsert = `[FONT=verdana][B]NickName:[/B] [I]${firstNicknameSend}[/I]<br><br>`;
                contentToInsert += `[B]NickName лидера:[/B] [I]${secondNicknameSend}[/I]<br><br>`;
                contentToInsert += `[B]Дата совершенного нарушения:[/B] [I]${punishDate}[/I]<br><br>`;
                contentToInsert += `[B]Суть жалобы:[/B] ${complaintSend}<br><br>`;
                contentToInsert += `[B]Доказательства:[/B] ${evidenceSend}[/FONT]`;
            } else if (currentUrl.includes('Обжалования')) {
                contentToInsert = `[FONT=verdana][B]NickName:[/B] [I]${firstNicknameSend}[/I]<br><br>`;
                contentToInsert += `[B]NickName администратора:[/B] [I]${secondNicknameSend}[/I]<br><br>`;
                contentToInsert += `[B]Дата полученного наказания:[/B] [I]${punishDate}[/I]<br><br>`;
                contentToInsert += `[B]Суть обжалования:[/B] ${complaintSend}<br><br>`;
                contentToInsert += `[B]Доказательства:[/B] ${evidenceSend}[/FONT]`;
            } else if (currentUrl.includes('Сервер')) {
                contentToInsert = `[FONT=verdana][B]NickName:[/B] [I]${firstNicknameSend}[/I]<br><br>`;
                contentToInsert += `[B]NickName технического специалиста:[/B] [I]${secondNicknameSend}[/I]<br><br>`;
                contentToInsert += `[B]Дата полученного наказания:[/B] [I]${punishDate}[/I]<br><br>`;
                contentToInsert += `[B]Суть жалобы:[/B] ${complaintSend}<br><br>`;
                contentToInsert += `[B]Доказательства:[/B] ${evidenceSend}[/FONT]`;
            }

            titleToInsert = `${secondNicknameSend} | ${punishName}`;

            localStorage.setItem('content', contentToInsert);
            localStorage.setItem('title', titleToInsert);

            window.location.href = location.href + "/post-thread";

        }
    });

    // Добавляем событие при открытии окна (после нажатия кнопки "Создать")
    window.addEventListener('load', function () {
        if (currentUrl.includes('post-thread') && (currentUrl.includes('Жалобы') || currentUrl.includes('Обжалование') || currentUrl.includes('Сервер'))) {
            setTimeout(() => {
                var editableDiv = document.querySelector('div.fr-element');
                var editableTitle = document.querySelector('textarea.input--title[name="title"]');
                editableDiv.innerHTML = '';
                editableTitle.innerHTML = '';
                var content = localStorage.getItem('content');
                var title = localStorage.getItem('title');
                editableDiv.innerHTML = content;
                editableTitle.innerHTML = title;
                var sendButton = document.querySelector('.button--icon--write');
                if (sendButton) {
                    sendButton.click();
                }
            }, 2500);
        }
    });

    // Добавляем событие при нажатии на кнопку "Отмена" (в меню)
    var cancelButton = document.querySelector('.cancel-complaint');
    cancelButton.addEventListener('click', function (event) {
        event.preventDefault();
        var mainForm = document.getElementById('complaint-form');
        mainForm.classList.remove('--visible');
        mainForm.classList.add('--hidden');
    });

    // Добавляем CSS (стили) для меню жалобы
    var styleMenu = document.createElement('style');
    styleMenu.id = 'style-menu';
    styleMenu.textContent = `
    /* Complaint Menu Stylesheet */

    .complaint-input {
        margin-top: 5px;
        background: #333333;
        border: 1px solid #555555;
        border-radius: 10px;
        color: #ffffff;
        padding: 5px;
        padding-left: 10px;
        transition-duration: .3s;
    }
    .complaint-input:hover {
        background: #404040;
        transition-duration: .3s;
    }
    .complaint-input:focus {
        background: #484848;
        border: 1px solid #666666;
        box-shadow: 0 0 5px 1px #888888;
    }
    .complaint-input:focus-visible {
        background: #444444;
        border: 1px solid #666666;
        box-shadow: 0 0 5px 1px #888888;
    }
        .complaint-label {
        color: #ffffff;
        font-weight: 600;
    }
    .complaint-button {
        background: #333333;
        border-radius: 10px;
        font-size: 16px;
        font-weight: 600;
        color: #ffffff;
        box-shadow: 0 0 5px #000000;
        cursor: pointer;
        padding: 5px;
        margin-top: 10px;
        transition-duration: .3s;
        width: 33%;
    }
    .complaint-button:hover {
        background: #444444;
        box-shadow: 0 0 7px 3px #000000;
        cursor: pointer;
    }
    .submit-complaint {
        border: 2px solid #008800;
    }
    .cancel-complaint {
        border: 2px solid #880000;
    }
    #complaint-form {
        position: fixed;
        top: 0;
        left: 0;
        border-radius: 0;
        background-color: transparent;
        z-index: 1000;
        width: 100%;
        height: 100%;
        backdrop-filter: blur(10px);
    }
    #complaint-form.--hidden {
        opacity: 0;
        display: flex;
        transition: all .5s ease;
        transform: translateY(-100%);
    }
    #complaint-form.--visible {
        opacity: 1;
        transition: all .5s ease;
        transform: translateY(0%);
    }
    .complaint-window {
        position: fixed;
        background-color: #212121;
        padding: 25px;
        top: 10%;
        left: 10%;
        width: 80%;
        border-radius: 10px;
        font-size: 14px;
        box-shadow: 0 0 10px 2px #000000;
    }
    #complaintFields {
        display: flex;
        flex-direction: column;
        width: 100%;
    }
    `;
    document.head.appendChild(styleMenu);

    // Реализуем функцию showFields(), которая отобразит меню
    function showFields() {
        var mainWindow = document.getElementById('complaint-form');
        mainWindow.classList.remove('--hidden');
        mainWindow.classList.add('--visible');

        // Находим Label'ы в меню
        var firstNicknameLabel = document.getElementById("firstNicknameLabel");
        var secondNicknameLabel = document.getElementById("secondNicknameLabel");
        var punishNameLabel = document.getElementById("punishNameLabel");
        var punishDateLabel = document.getElementById("punishDateLabel");
        var complaintLabel = document.getElementById("complaintLabel");
        var evidenceLabel = document.getElementById("evidenceLabel");

        // Находим Input'ы в меню
        var firstNicknameInput = document.getElementById("firstNickname");
        var secondNicknameInput = document.getElementById("secondNickname");
        var punishNameInput = document.getElementById("punishName");
        var punishDateInput = document.getElementById("punishDate");
        var complaintInput = document.getElementById("complaint");
        var evidenceInput = document.getElementById("evidence");

        // Показываем поля для соответствующих разделов
        if (currentUrl.includes('администрацию')) {
            firstNicknameLabel.textContent = "Ваш NickName:";
            firstNicknameInput.placeholder = "Формат: Nick_Name";
            secondNicknameLabel.textContent = "NickName Администратора:";
            secondNicknameInput.placeholder = "Формат: Nick_Name";
            punishNameLabel.textContent = "Полученное наказание:";
            punishNameInput.placeholder = "Пример: NonRP Обман";
            punishDateLabel.textContent = "Дата получения наказания:";
            punishDateInput.placeholder = "Формат: 01/01/2023";
            complaintLabel.textContent = "Суть жалобы:";
            complaintInput.placeholder = "Подробное описание жалобы";
            evidenceLabel.textContent = "Доказательства (ссылка):";
            evidenceInput.placeholder = 'Ссылка (Imgur, Yapx, Ibb)';
        } else if (currentUrl.includes('игроков')) {
            firstNicknameLabel.textContent = "Ваш NickName:";
            firstNicknameInput.placeholder = "Формат: Nick_Name";
            secondNicknameLabel.textContent = "NickName Игрока:";
            secondNicknameInput.placeholder = "Формат: Nick_Name";
            punishNameLabel.textContent = "Совершенное Нарушение:";
            punishNameInput.placeholder = "Пример: ДМ";
            punishDateLabel.textContent = "Дата нарушения:";
            punishDateInput.placeholder = "Формат: 01/01/2023";
            complaintLabel.textContent = "Суть жалобы:";
            complaintInput.placeholder = "Подробное описание жалобы";
            evidenceLabel.textContent = "Доказательства (ссылка):";
            evidenceInput.placeholder = 'Ссылка (Imgur, Yapx, Ibb)';
        } else if (currentUrl.includes('лидеров')) {
            firstNicknameLabel.textContent = "Ваш NickName:";
            firstNicknameInput.placeholder = "Формат: Nick_Name";
            secondNicknameLabel.textContent = "NickName Лидера:";
            secondNicknameInput.placeholder = "Формат: Nick_Name";
            punishNameLabel.textContent = "Совершенное нарушение:";
            punishNameInput.placeholder = "Пример: Увольнение без причины";
            punishDateLabel.textContent = "Дата нарушения:";
            punishDateInput.placeholder = "Формат: 01/01/2023";
            complaintLabel.textContent = "Суть жалобы:";
            complaintInput.placeholder = "Подробное описание жалобы";
            evidenceLabel.textContent = "Доказательства (ссылка):";
            evidenceInput.placeholder = 'Ссылка (Imgur, Yapx, Ibb)';
        } else if (currentUrl.includes('Обжалования')) {
            firstNicknameLabel.textContent = "Ваш NickName:";
            firstNicknameInput.placeholder = "Формат: Nick_Name";
            secondNicknameLabel.textContent = "NickName Администратора:";
            secondNicknameInput.placeholder = "Формат: Nick_Name";
            punishNameLabel.textContent = "Полученное наказание:";
            punishNameInput.placeholder = "Пример: NonRP Обман";
            punishDateLabel.textContent = "Дата получения наказания:";
            punishDateInput.placeholder = "Формат: 01/01/2023";
            complaintLabel.textContent = "Суть обжалования:";
            complaintInput.placeholder = "Подробное описание заявки";
            evidenceLabel.textContent = "Доказательства (ссылка):";
            evidenceInput.placeholder = 'Ссылка (Imgur, Yapx, Ibb)';
        } else if (currentUrl.includes('Сервер')) {
            firstNicknameLabel.textContent = "Ваш NickName:";
            firstNicknameInput.placeholder = "Формат: Nick_Name";
            secondNicknameLabel.textContent = "NickName Технического Специалиста:";
            secondNicknameInput.placeholder = "Формат: Nick_Name";
            punishNameLabel.textContent = "Полученное наказание:";
            punishNameInput.placeholder = "Пример: Покупка ИВ";
            punishDateLabel.textContent = "Дата получения наказания:";
            punishDateInput.placeholder = "Формат: 01/01/2023";
            complaintLabel.textContent = "Суть жалобы:";
            complaintInput.placeholder = "Подробное описание жалобы";
            evidenceLabel.textContent = "Окно блокировки (ссылка):";
            evidenceInput.placeholder = 'Ссылка (Imgur, Yapx, Ibb)';
        }
    }

})();