// ==UserScript==
// @name         test
// @namespace    https://forum.blackrussia.online
// @version      0.0.5
// @description  -
// @author       Soul Crown
// @match        https://forum.blackrussia.online/*
// @include      https://forum.blackrussia.online/
// @grant        none
// @license      none
// @copyright    2025,
// @downloadURL
// @updateURL
// @downloadURL https://update.greasyfork.org/scripts/538093/test.user.js
// @updateURL https://update.greasyfork.org/scripts/538093/test.meta.js
// ==/UserScript==
 
(function () {
    'use strict';
    const PIN_PREFIX = 2; // На рассмотрение
    const TECH_PREFIX = 13; // Тех. специалисту
    const KP_PREFIX = 10; // Команде проекта
    const WATCHED_PREFIX = 9; // Рассмотрено
    const DECIDED_PREFIX = 6; // Решено
    const UNACCEPT_PREFIX = 4 // Отказано
    const CLOSE_PREFIX = 7; // Закрыто
    const EXPECTATION_PREFIX = 14 // Ожидание
  
    const START_COLOR_1 = `<font color=#FFB6C1>`
    const START_COLOR_2 = `<font color=#FFFAFA>`
    const END_COLOR = `</font>`
 
    const START_DECOR = `<div style="text-align: center"><span style="font-family: 'Times New Roman';font-size: 14px">`
    const END_DECOR = `</span></div>`
 
    const buttons = [
        {
            title: 'Приветствие',
            content:
            `${START_DECOR}<img src="https://i.postimg.cc/mrhcH5vR/1621526767066.png"><br>` +
            `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
            `${START_COLOR_2}*Ваш текст*${END_COLOR}<br><br>` +
            `${START_COLOR_1}На рассмотрении${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
            prefix: PIN_PREFIX,
            status: true,
            open: true,
            move: 0,
        },
        ]
    const tasks = [
        {
           title: '===================================> Технический раздел <===================================',
           color: 'border-radius: px; margin-right: 5px; border: 1px solid; background-color: #8A2BE2; border-color: #E6E6FA',
        },
        {
           title: 'В технический раздел (46)',
           prefix: EXPECTATION_PREFIX,
           status: false,
           open: false,
           move: 2052,
        },
        {
           title: 'В технических раздел (47)',
           prefix: EXPECTATION_PREFIX,
           status: false,
           open: false,
           move: 2094,
        },
        {   
           title: 'В технический раздел (48)',
           prefix: EXPECTATION_PREFIX,
           status: false,
           open: false,
           move: 2136,
        },
        {
           title: 'В технический раздел (49)',
           prefix: EXPECTATION_PREFIX,
           status: false,
           open: false,
           move: 2178,
        },
        {
           title: 'В технический раздел (50)',
           prefix: EXPECTATION_PREFIX,
           status: false,
           open: false,
           move: 2220,
        },
        {
           title: '==================================> Жалобы на тех спецов <==================================',
           color: 'border-radius: px; margin-right: 5px; border: 1px solid; background-color: #8A2BE2; border-color: #E6E6FA',
        },
        {
           title: 'В жалобы на тех спецов (46)',
           prefix: EXPECTATION_PREFIX,
           status: false,
           open: false,
           move: 2051,
        },
        {
           title: 'В жалобы на тех спецов (47)',
           prefix: EXPECTATION_PREFIX,
           status: false,
           open: false,
           move: 2093,
        },
        {
           title: 'В жалобы на тех спецов (48)',
           prefix: EXPECTATION_PREFIX,
           status: false,
           open: false,
           move: 2135,
        },
        {
           title: 'В жалобы на тех спецов (49)',
           prefix: EXPECTATION_PREFIX,
           status: false,
           open: false,
           move: 2177,
        },
        {
           title: 'В жалобы на тех спецов (50)',
           prefix: EXPECTATION_PREFIX,
           status: false,
           open: false,
           move: 2219,
        },
        {
           title: '===============================> Жалобы на администрацию <===============================',
           color: 'border-radius: px; margin-right: 5px; border: 1px solid; background-color: #8A2BE2; border-color: #E6E6FA',
        },
        {
           title: 'В жалобы на администрацию (46)',
           prefix: EXPECTATION_PREFIX,
           status: false,
           open: false,
           move: 2078,
        },
        {
           title: 'В жалобы на администрацию (47)',
           prefix: EXPECTATION_PREFIX,
           status: false,
           open: false,
           move: 2120,
        },
        {
           title: 'В жалобы на администрацию (48)',
           prefix: EXPECTATION_PREFIX,
           status: false,
           open: false,
           move: 2162,
        },
        {
           title: 'В жалобы на администрацию (49)',
           prefix: EXPECTATION_PREFIX,
           status: false,
           open: false,
           move: 2204,
        },
        {
           title: 'В жалобы на администрацию (50)',
           prefix: EXPECTATION_PREFIX,
           status: false,
           open: false,
           move: 2246,
        },
        {
           title: '===================================> Жалобы на лидеров <====================================',
           color: 'border-radius: px; margin-right: 5px; border: 1px solid; background-color: #8A2BE2; border-color: #E6E6FA',
        },
        {
           title: 'В жалобы на лидеров (46)',
           prefix: EXPECTATION_PREFIX,
           status: false,
           open: false,
           move: 2079,
        },
        {
           title: 'В жалобы на лидеров (47)',
           prefix: EXPECTATION_PREFIX,
           status: false,
           open: false,
           move: 2121,
        },
        {
           title: 'В жалобы на лидеров (48)',
           prefix: EXPECTATION_PREFIX,
           status: false,
           open: false,
           move: 2163,
        },
        {
           title: 'В жалобы на лидеров (49)',
           prefix: EXPECTATION_PREFIX,
           status: false,
           open: false,
           move: 2205,
        },
        {
           title: 'В жалобы на лидеров (50)',
           prefix: EXPECTATION_PREFIX,
           status: false,
           open: false,
           move: 2247,
        },
        {
           title: '===================================> Жалобы на игроков <====================================',
           color: 'border-radius: px; margin-right: 5px; border: 1px solid; background-color: #8A2BE2; border-color: #E6E6FA',
        },
        {
           title: 'В жалобы на игроков (46)',
           prefix: EXPECTATION_PREFIX,
           status: false,
           open: false,
           move: 2080,
        },
        {
           title: 'В жалобы на игроков (47)',
           prefix: EXPECTATION_PREFIX,
           status: false,
           open: false,
           move: 2122,
        },
        {
           title: 'В жалобы на игроков (48)',
           prefix: EXPECTATION_PREFIX,
           status: false,
           open: false,
           move: 2164,
        },
        {
           title: 'В жалобы на игроков (49)',
           prefix: EXPECTATION_PREFIX,
           status: false,
           open: false,
           move: 2206,
        },
        {
           title: 'В жалобы на игроков (50)',
           prefix: EXPECTATION_PREFIX,
           status: false,
           open: false,
           move: 2248,
        },
        {
           title: '=======================> Обжалование наказаний от администрации <=======================',
           color: 'border-radius: px; margin-right: 5px; border: 1px solid; background-color: #8A2BE2; border-color: #E6E6FA',
        },
        {
           title: 'В обжалования  наказаний (46)',
           prefix: EXPECTATION_PREFIX,
           status: false,
           open: false,
           move: 2081,
        },
        {
           title: 'В обжалования  наказаний (47)',
           prefix: EXPECTATION_PREFIX,
           status: false,
           open: false,
           move: 2123,
        },
        {
           title: 'В обжалования  наказаний (48)',
           prefix: EXPECTATION_PREFIX,
           status: false,
           open: false,
           move: 2165,
        },
        {
           title: 'В обжалования  наказаний (49)',
           prefix: EXPECTATION_PREFIX,
           status: false,
           open: false,
           move: 2207,
        },
        {
           title: 'В обжалования  наказаний (50)',
           prefix: EXPECTATION_PREFIX,
           status: false,
           open: false,
           move: 2249,
        },
        {
           title: '=========================================> Прочее <=========================================',
           color: 'border-radius: px; margin-right: 5px; border: 1px solid; background-color: #8A2BE2; border-color: #E6E6FA',
        },
        {
           title: 'В заявки с окончательным ответом',
           prefix: CLOSE_PREFIX,
           status: false,
           open: false,
           move: 230,
      }
    ]
    
    const bgButtons = document.querySelector(".pageContent");
    const buttonConfig = (text, href) => {
    const button = document.createElement("button");
    button.style = "color: #E6E6FA; background-color: #000000; border-color: #E6E6FA; border-radius: 13px";
    button.textContent = text;
    button.classList.add("bgButton");
    button.addEventListener("click", () => {
    window.location.href = href;
    });
    return button;
    };
    
    const Button1 = buttonConfig("Название раздела", 'Ссылка на раздел');
    const Button2 = buttonConfig("Название раздела", 'Ссылка на раздел');
    const Button3 = buttonConfig("Название раздела", 'Ссылка на раздел');
    const Button4 = buttonConfig("Название раздела", 'Ссылка на раздел');
    const Button5 = buttonConfig("Название раздела", 'Ссылка на раздел');
    const Button6 = buttonConfig("Название раздела", 'Ссылка на раздел');
    const Button7 = buttonConfig("Название раздела", 'Ссылка на раздел');
    const Button8 = buttonConfig("Название раздела", 'Ссылка на раздел');
    const Button9 = buttonConfig("Название раздела", 'Ссылка на раздел');
    const Button10 = buttonConfig("Название раздела", 'Ссылка на раздел');
    const Button11 = buttonConfig("Название раздела", 'Ссылка на раздел');
    const Button12 = buttonConfig("Название раздела", 'Ссылка на раздел');
    const Button13 = buttonConfig("Название раздела", 'Ссылка на раздел');
    const Button14 = buttonConfig("Название раздела", 'Ссылка на раздел');
    const Button15 = buttonConfig("Название раздела", 'Ссылка на раздел');
    
    bgButtons.append(Button1);
    bgButtons.append(Button2);
    bgButtons.append(Button3);
    bgButtons.append(Button4);
    bgButtons.append(Button5);
    bgButtons.append(Button6);
    bgButtons.append(Button7);
    bgButtons.append(Button8);
    bgButtons.append(Button9);
    bgButtons.append(Button10);
    bgButtons.append(Button11);
    bgButtons.append(Button12);
    bgButtons.append(Button13);
    bgButtons.append(Button14);
    bgButtons.append(Button15);
    
    $(document).ready(() => {
        // Загрузка скрипта для обработки шаблонов
        $('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');
 
        addButton('На рассмотрение', 'pin', 'border-radius: 13px; margin-right: 5px; border: 1px solid; background-color: #000000; border-color: #FFA500');
        addButton('Команде проекта', 'kp', 'border-radius: 13px; margin-right: 5px; border: 1px solid; background-color: #000000; border-color: #FFD700');
        addButton('Тех. специалисту', 'tech', 'border-radius: 13px; margin-right: 5px; border: 1px solid; background-color: #000000; border-color: #0000FF');
        addButton('Рассмотрено', 'watch', 'border-radius: 13px; margin-right: 5px; border: 1px solid; background-color: #000000; border-color: #008000');
        addButton('Решено', 'decided', 'border-radius: 13px; margin-right: 5px; border: 1px solid; background-color: #000000; border-color: #008000');
        addButton('Отказано', 'unaccept', 'border-radius: 13px; margin-right: 5px; border: 1px solid; background-color: #000000; border-color: #FF0000');
        addButton('Закрыто', 'close', 'border-radius: 13px; margin-right: 5px; border: 1px solid; background-color: #000000; border-color: #FF0000');
        addMoveTasks();
        addAnswers();
 
        // Поиск информации о теме
        const threadData = getThreadData();
 
        $('button#pin').click(() => editThreadData(0, PIN_PREFIX, true, true));
        $('button#tech').click(() => editThreadData(0, TECH_PREFIX, true, true));
        $('button#kp').click(() => editThreadData(0, KP_PREFIX, true, true));
        $('button#watch').click(() => editThreadData(230, WATCHED_PREFIX, false));
        $('button#decided').click(() => editThreadData(230, DECIDED_PREFIX, false));
        $('button#unaccept').click(() => editThreadData(230, UNACCEPT_PREFIX, false));
        $('button#close').click(() => editThreadData(230, CLOSE_PREFIX, false));
        
        $(`button#selectAnswers`).click(() => {
            XF.alert(buttonsMarkup(buttons), null, 'Выберите ответ:');
            buttons.forEach((btn, id) => {
                if (id > 4) {
                    $(`button#answers-${id}`).click(() => pasteContent(id, threadData, true));
                } else {
                    $(`button#answers-${id}`).click(() => pasteContent(id, threadData, false));
                }
            });
        });
    
        $(`button#selectMoveTasks`).click(() => {
            XF.alert(tasksMarkup1(tasks), null, 'Выберите действие:');
            tasks.forEach((btn, id) => {
                $(`button#answers-${id}`).click(() => moveThread(tasks[id].prefix, tasks[id].move));
            });
        });
    });
    
    
    function addButton(name, id, hex="grey") {
        $('.button--icon--reply').before(
            `<button type="button" class="button--primary button rippleButton" id="${id}" style="border-radius: 13px; margin-right: 5px; background-color: ${hex}">${name}</button>`,
        );
    }
    
    function addAnswers() {
        $('.button--icon--reply').after(`<button type="button" class="button--cta uix_quickReply--button button button--icon button--icon--write rippleButton" id="selectAnswers" style="oswald: 3px; margin-left: 5px; margin-top: 1px; border-radius: 13px; background-color: #FF4500; border-color: #E6E6FA">Ответы</button>`,
        );
    }
    
    function addMoveTasks() {
        $('.button--icon--reply').after(`<button type="button" class="button--cta uix_quickReply--button button button--icon button--icon--write rippleButton" id="selectMoveTasks" style="oswald: 3px; margin-left: 5px; margin-top: 1px; border-radius: 13px; background-color: #FF4500; border-color: #E6E6FA">Перемещение</button>`,
        );
    }
 
    function buttonsMarkup(buttons) {
        return `<div class="select_answer">${buttons
            .map(
            (btn, i) =>
            `<button id="answers-${i}" class="button--primary button ` +
            `rippleButton" style="margin:5px; border-radius: 13px; margin-right: 5px; border: 1px solid; border-color: #E6E6FA; background-color: ${btn.color || "#000000"}"><span class="button-text">${btn.title}</span></button>`,
        )
            .join('')}</div>`;
    }
 
    function tasksMarkup(buttons) {
        return `<div class="select_answer">${buttons
            .map(
            (btn, i) =>
            `<button id="answers-${i}" class="button--primary button ` +
            `rippleButton" style="margin:5px; border-radius: 13px; margin-right: 5px; border: 1px solid; border-color: #E6E6FA; background-color: ${btn.color || "#000000"}"><span class="button-text">${btn.title}</span></button>`,
        )
            .join('')}</div>`;
    }
    
    function buttonsMarkup1(tasks) {
        return `<div class="select_answer">${tasks
            .map(
            (btn, i) =>
            `<button id="answers-${i}" class="button--primary button ` +
            `rippleButton" style="margin:5px; border-radius: 13px; margin-right: 5px; border: 1px solid; border-color: #E6E6FA; background-color: ${btn.color || "#000000"}"><span class="button-text">${btn.title}</span></button>`,
        )
            .join('')}</div>`;
    }
 
    function tasksMarkup1(tasks) {
        return `<div class="select_answer">${tasks
            .map(
            (btn, i) =>
            `<button id="answers-${i}" class="button--primary button ` +
            `rippleButton" style="margin:5px; border-radius: 13px; margin-right: 5px; border: 1px solid; border-color: #E6E6FA; background-color: ${btn.color || "#000000"}"><span class="button-text">${btn.title}</span></button>`,
        )
            .join('')}</div>`;
    }
    
    function pasteContent(id, data = {}, send = false) {
        const template = Handlebars.compile(buttons[id].content);
        if ($('.fr-element.fr-view p').text() === '') $('.fr-element.fr-view p').empty();
 
        $('span.fr-placeholder').empty();
        $('div.fr-element.fr-view p').append(template(data));
        $('a.overlay-titleCloser').trigger('click');
 
        if (send == true) {
            editThreadData(buttons[id].move, buttons[id].prefix, buttons[id].status, buttons[id].open);
            $('.button--icon.button--icon--reply.rippleButton').trigger('click');
        }
    }
    
    function getThreadData() {
        const authorID = $('a.username')[0].attributes['data-user-id'].nodeValue;
        const authorName = $('a.username').html();
        const hours = new Date().getHours();
        return {
            user: {
                id: authorID,
                name: authorName,
                mention: `[USER=${authorID}]${authorName}[/USER]`,
            },
            greeting: () =>
            4 < hours && hours <= 11
            ? 'Доброе утро'
            : 11 < hours && hours <= 15
            ? 'Добрый день'
            : 15 < hours && hours <= 21
            ? 'Добрый вечер'
            : 'Доброй ночи',
        };
    }
 
    function editThreadData(move, prefix, pin = false, open = false) {
        // Получаем заголовок темы, так как он необходим при запросе
        const threadTitle = $('.p-title-value')[0].lastChild.textContent;
 
        if (pin == false) {
            fetch(`${document.URL}edit`, {
                method: 'POST',
                body: getFormData({
                    prefix_id: prefix,
                    title: threadTitle,
                    _xfToken: XF.config.csrf,
                    _xfRequestUri: document.URL.split(XF.config.url.fullBase)[1],
                    _xfWithData: 1,
                    _xfResponseType: 'json',
                }),
            }).then(() => location.reload());
        } else if(pin == true && open){
            fetch(`${document.URL}edit`, {
                method: 'POST',
                body: getFormData({
                    prefix_id: prefix,
                    discussion_open: 1,
                    title: threadTitle,
                    sticky: 1,
                    _xfToken: XF.config.csrf,
                    _xfRequestUri: document.URL.split(XF.config.url.fullBase)[1],
                    _xfWithData: 1,
                    _xfResponseType: 'json',
                }),
            }).then(() => location.reload());
        } else {
            fetch(`${document.URL}edit`, {
                method: 'POST',
                body: getFormData({
                    prefix_id: prefix,
                    title: threadTitle,
                    sticky: 1,
                    _xfToken: XF.config.csrf,
                    _xfRequestUri: document.URL.split(XF.config.url.fullBase)[1],
                    _xfWithData: 1,
                    _xfResponseType: 'json'
                }),
            }).then(() => location.reload());
        }
        if (move > 0) {
            moveThread(prefix, move);
        }
    }
 
    function moveThread(prefix, type) {
        // Функция перемещения тем
        const threadTitle = $('.p-title-value')[0].lastChild.textContent;
 
        fetch(`${document.URL}move`, {
            method: 'POST',
            body: getFormData({
                prefix_id: prefix,
                title: threadTitle,
                target_node_id: type,
                redirect_type: 'none',
                notify_watchers: 1,
                starter_alert: 1,
                starter_alert_reason: "",
                _xfToken: XF.config.csrf,
                _xfRequestUri: document.URL.split(XF.config.url.fullBase)[1],
                _xfWithData: 1,
                _xfResponseType: 'json',
            }),
        }).then(() => location.reload());
    }
 
    function getFormData(data) {
        const formData = new FormData();
        Object.entries(data).forEach(i => formData.append(i[0], i[1]));
        return formData;
    }
})();