// ==UserScript==
// @name         Krasnoyarsk | Скрипт для руководства АП
// @namespace    https://forum.blackrussia.online
// @version      0.0.14
// @description  -
// @author       Johnathan Kingsman
// @match        https://forum.blackrussia.online/*
// @include      https://forum.blackrussia.online/
// @grant        none
// @license      none
// @copyright    2025,
// @downloadURL
// @updateURL
// @downloadURL https://update.greasyfork.org/scripts/533384/Krasnoyarsk%20%7C%20%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D1%80%D1%83%D0%BA%D0%BE%D0%B2%D0%BE%D0%B4%D1%81%D1%82%D0%B2%D0%B0%20%D0%90%D0%9F.user.js
// @updateURL https://update.greasyfork.org/scripts/533384/Krasnoyarsk%20%7C%20%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D1%80%D1%83%D0%BA%D0%BE%D0%B2%D0%BE%D0%B4%D1%81%D1%82%D0%B2%D0%B0%20%D0%90%D0%9F.meta.js
// ==/UserScript==

(function () {
    'use strict'
    const START_COLOR_1 = `<font color=#FFB6C1>`
    const START_COLOR_2 = `<font color=#FFFAFA>`
    const END_COLOR = `</font>`
 
    const START_DECOR = `<div style="text-align: center"><span style="font-family: 'Times New Roman';font-size: 14px">`
    const END_DECOR = `</span></div>`

    const buttons = [
        {
            title: 'Приветствие',
            content:
            `${START_COLOR_1}Здравствуйте, уважаемый игрок${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
            `${START_COLOR_2}*Ваш текст*${END_COLOR}${END_DECOR}`,
        },
        {
            title: '======================================> Заявки на АП <======================================',
            color: 'border-radius: px; margin-right: 5px; border: 1px solid; background-color: #8A2BE2; border-color: #E6E6FA',
        },
        {
            title: 'Ответить в заявке',
            content:
            `${START_COLOR_2}Список одобренных кандидатов:<br><br>*Список ников*<br><br>Список отказанных кандидатов:<br><br>*Список ников*${END_COLOR}<br><br>` +
            `${START_COLOR_1}Одобренным кандидатам отпишу в личные сообщения${END_COLOR + START_COLOR_2}.${END_COLOR + END_DECOR}`,
        },
        {
            title: '======================================> Жалобы на АП <======================================',
            color: 'border-radius: px; margin-right: 5px; border: 1px solid; background-color: #8A2BE2; border-color: #E6E6FA',
        },
        {
            title: 'Будет проведена работа с АП',
            content:
            `${START_COLOR_1}Здравствуйте, уважаемый игрок${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
            `${START_COLOR_2}С Агентом Поддержки будет проведена работа.${END_COLOR}<br><br>` +
            `${START_COLOR_1}Рассмотрено${END_COLOR + START_COLOR_2}.${END_COLOR + END_DECOR}`,
        },
        {
            title: 'АП будет снят',
            content:
            `${START_COLOR_1}Здравствуйте, уважаемый игрок${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
            `${START_COLOR_2}Агента Поддержки будет снят со своего поста.${END_COLOR}<br><br>` +
            `${START_COLOR_1}Рассмотрено${END_COLOR + START_COLOR_2}.${END_COLOR + END_DECOR}`,
        },
        {
            title: 'Нет нарушений',
            content:
            `${START_COLOR_1}Здравствуйте, уважаемый игрок${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
            `${START_COLOR_2}От Агента Поддержки нет нарушений.${END_COLOR}<br><br>` +
            `${START_COLOR_1}Рассмотрено${END_COLOR + START_COLOR_2}.${END_COLOR + END_DECOR}`,
        },
        {
            title: 'Не относится',
            content:
            `${START_COLOR_1}Здравствуйте, уважаемый игрок${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
            `${START_COLOR_2}Ваше сообщение никак не относится к теме данного раздела${END_COLOR}<br><br>` +
            `${START_COLOR_1}Рассмотрено${END_COLOR + START_COLOR_2}.${END_COLOR + END_DECOR}`,
        },
        {
            title: '======================================> Ответы на заявки <======================================',
            color: 'border-radius: px; margin-right: 5px; border: 1px solid; background-color: #8A2BE2; border-color: #E6E6FA',
        },
        {
            title: 'Одобрено',
            content:
            `${START_COLOR_1}Здравствуйте${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
            `${START_COLOR_2}Одобрено.${END_COLOR + END_DECOR}`,
        },
        {
            title: 'Отказано',
            content:
            `${START_COLOR_1}Здравствуйте${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
            `${START_COLOR_2}Отказано.${END_COLOR + END_DECOR}`,
        },
    ];
    
    const bgButtons = document.querySelector(".pageContent");
    const buttonConfig = (text, href) => {
    const button = document.createElement("button");
    button.style = "border-radius: 13px; background-color: #E6E6FA";
    button.textContent = text;
    button.classList.add("bgButton");
    button.addEventListener("click", () => {
    window.location.href = href;
    });
    return button;
    };

    const Button51 = buttonConfig("Заявки на АП", 'https://forum.blackrussia.online/forums/%D0%90%D0%B3%D0%B5%D0%BD%D1%82%D1%8B-%D0%BF%D0%BE%D0%B4%D0%B4%D0%B5%D1%80%D0%B6%D0%BA%D0%B8.3161/');
    const Button52 = buttonConfig("Раздел АП", 'https://forum.blackrussia.online/forums/%D0%A0%D0%B0%D0%B7%D0%B4%D0%B5%D0%BB-%D0%B4%D0%BB%D1%8F-%D0%B0%D0%B3%D0%B5%D0%BD%D1%82%D0%BE%D0%B2-%D0%BF%D0%BE%D0%B4%D0%B4%D0%B5%D1%80%D0%B6%D0%BA%D0%B8.2104/');
 
    bgButtons.append(Button51);
    bgButtons.append(Button52);
   
    $(document).ready(() => {
        // Загрузка скрипта для обработки шаблонов
        $('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');
 
        addAnswers();
 
        // Поиск информации о теме
        const threadData = getThreadData();
 
        $(`button#selectAnswers`).click(() => {
            XF.alert(buttonsMarkup(buttons), null, 'Выберите ответ:');
            buttons.forEach((btn, id) => {
                if (id > 100) {
                    $(`button#answers-${id}`).click(() => pasteContent(id, threadData, true));
                } else {
                    $(`button#answers-${id}`).click(() => pasteContent(id, threadData, false));
                }
            });
        });
    
    });
    
    function addAnswers() {
        $('.button--icon--reply').after(`<button type="button" class="button--cta uix_quickReply--button button button--icon button--icon--write rippleButton" id="selectAnswers" style="oswald: 3px; margin-left: 5px; margin-top: 1px; border-radius: 13px; background-color: #FF4500; border-color: #E6E6FA">Ответы</button>`,
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