// ==UserScript==
// @name         PODOLSK | Скрипт для КФ by K.Livinenko
// @namespace    https://openuserjs.org/users/King73
// @version      1.2
// @description  ...
// @author       K.Livinenko
// @match        https://forum.blackrussia.online/*
// @include      https://forum.blackrussia.online/threads/
// @icon         https://pic.rutubelist.ru/user/05/03/0503c2ba8d12e8f14974c833d9923cc6.jpg
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/522929/PODOLSK%20%7C%20%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%9A%D0%A4%20by%20KLivinenko.user.js
// @updateURL https://update.greasyfork.org/scripts/522929/PODOLSK%20%7C%20%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%9A%D0%A4%20by%20KLivinenko.meta.js
// ==/UserScript==

(async function () {
    `use strict`;
    const UNACCEPT_PREFIX = 4; // Prefix that will be set when thread closes
    const ACCEPT_PREFIX = 8; // Prefix that will be set when thread accepted
    const PIN_PREFIX = 2; // Prefix that will be set when thread pins
    const COMMAND_PREFIX = 10; // Prefix that will be set when thread send to project team
    const WATCHED_PREFIX = 9;
    const CLOSE_PREFIX = 7;
    const GA_PREFIX = 12;
    const TEX_PREFIX = 13;
    const SPEC_PREFIX = 11;
    const data = await getThreadData(),
        greeting = data.greeting,
        user = data.user;
    const buttons = [
        {
            title: `свой текст`,
            content:
            `[CENTER][COLOR=rgb(0, 255, 255)][FONT=verdana][SIZE=4]Здравствуйте.[/SIZE][/FONT][/COLOR]<br><br>`+
            'текст<br><br>' +
            '[Center][SIZE=4][FONT=verdana]Благодарим вас за обращение. Приятной игры на сервере [COLOR=rgb(102, 51, 255)][B]PODOLSK[/B][/COLOR].<br>',
        },
{
      title: `-------------------------------------------------------------------- РП биографии --------------------------------------------------------------------`,
        },
        {
            title: `Одобрено`,
            content: `[CENTER][COLOR=rgb(0, 255, 255)][FONT=verdana][SIZE=4]Здравствуйте.[/SIZE][/FONT][/COLOR]<br><br>`+
            `Ваше заявление на RP биографию была рассмотрена и ей дан следующий статус: [COLOR=rgb(9, 255, 0)][U]Одобрено[/U][/COLOR].<br><br>`+
            "[Center][SIZE=4][FONT=verdana]Благодарим вас за обращение. Приятной игры на сервере [COLOR=rgb(102, 51, 255)][B]PODOLSK[/B][/COLOR].",

            prefix: ACCEPT_PREFIX,
            status: false,
        },

        {
            title: 'дополните биографию',
            content: `[CENTER][COLOR=rgb(0, 255, 255)][FONT=verdana][SIZE=4]Здравствуйте.[/SIZE][/FONT][/COLOR]<br><br>`+
            `Ваше заявление на RP биографию была рассмотрена и ей дан следующий статус: [COLOR=rgb(255, 255, 0)][U]На рассмотрении[/U][/COLOR].<br>`+
            'Дополните свою RP биографию информацией в течении 24-х часов<br><br>' +
            "[Center][SIZE=4][FONT=verdana]Благодарим вас за обращение. Приятной игры на сервере [COLOR=rgb(102, 51, 255)][B]PODOLSK[/B][/COLOR].",

            prefix: PIN_PREFIX,
            status: true,
        },
        {
            title: `Заголовок не по форме`,
            content: `[CENTER][COLOR=rgb(0, 255, 255)][FONT=verdana][SIZE=4]Здравствуйте.[/SIZE][/FONT][/COLOR]<br><br>`+
            `Ваша RP биография была рассмотрена и [COLOR=rgb(255, 0, 0)][U]отклонена[/U][/COLOR] администрацией сервера.<br>`+
            'Причина отклонения RP биографии: заголовок создаваемой темы должен быть написан строго по данной форме: "RolePlay биография гражданина Имя Фамилия".<br>' +
            'Ознакомьтесь с [url=https://forum.blackrussia.online/threads/podolsk-Правила-создания-roleplay-биографии.11034857/]"Правилами подачи RP биографий"[/url]<br><br>' +
            "[Center][SIZE=4][FONT=verdana]Благодарим вас за обращение. Приятной игры на сервере [COLOR=rgb(102, 51, 255)][B]PODOLSK[/B][/COLOR].",

            prefix: UNACCEPT_PREFIX,
            status: false,
        },
        {
            title: `Ошибки в тексте`,
            content: `[CENTER][COLOR=rgb(0, 255, 255)][FONT=verdana][SIZE=4]Здравствуйте.[/SIZE][/FONT][/COLOR]<br><br>`+
            `Ваше заявление на RP биографию была рассмотрена и ей дан следующий статус: [COLOR=rgb(255, 255, 0)][U]На рассмотрении[/U][/COLOR].<br>`+
            "Даю 24 часа на исправление орфаграфических и пунктуационных ошибок<br><br>" +
            "[Center][SIZE=4][FONT=verdana]Благодарим вас за обращение. Приятной игры на сервере [COLOR=rgb(102, 51, 255)][B]PODOLSK[/B][/COLOR].",

            prefix: PIN_PREFIX,
            status: true,
        },
        {
            title: `NRP ник`,
            content: `[CENTER][COLOR=rgb(0, 255, 255)][FONT=verdana][SIZE=4]Здравствуйте.[/SIZE][/FONT][/COLOR]<br><br>`+
            `Ваша RP биография была рассмотрена и [COLOR=rgb(255, 0, 0)][U]отклонена[/U][/COLOR] администрацией сервера.<br>`+
            "Причина отклонения RP биографии: запрещено создание Role Play биографии, если у Вас NonRolePlay никнейм.<br><br>" +
            "[Center][SIZE=4][FONT=verdana]Благодарим вас за обращение. Приятной игры на сервере [COLOR=rgb(102, 51, 255)][B]PODOLSK[/B][/COLOR].",

            prefix: UNACCEPT_PREFIX,
            status: false,
        },
        {
            title: `заголовок написан с ником в игре`,
            content: `[CENTER][COLOR=rgb(0, 255, 255)][FONT=verdana][SIZE=4]Здравствуйте.[/SIZE][/FONT][/COLOR]<br><br>`+
            `Ваша RP биография была рассмотрена и [COLOR=rgb(255, 0, 0)][U]отклонена[/U][/COLOR] администрацией сервера.<br>`+
            "Причина отклонения RP биографии: никнейм должен быть указан без нижнего подчеркивания на русском как в заголовке, так и в самой теме.<br><br>" +
            "[Center][SIZE=4][FONT=verdana]Благодарим вас за обращение. Приятной игры на сервере [COLOR=rgb(102, 51, 255)][B]PODOLSK[/B][/COLOR].",

            prefix: UNACCEPT_PREFIX,
            status: false,
        },
        {
            title: `вторая биография для акка`,
            content: `[CENTER][COLOR=rgb(0, 255, 255)][FONT=verdana][SIZE=4]Здравствуйте.[/SIZE][/FONT][/COLOR]<br><br>`+
            `Ваша RP биография была рассмотрена и [COLOR=rgb(255, 0, 0)][U]отклонена[/U][/COLOR] администрацией сервера.<br>`+
            "Причина отклонения RP биографии: запрещено создавать более чем одной биографии для одного игрового аккаунта.<br><br>" +
            "[Center][SIZE=4][FONT=verdana]Благодарим вас за обращение. Приятной игры на сервере [COLOR=rgb(102, 51, 255)][B]PODOLSK[/B][/COLOR].",

            prefix: UNACCEPT_PREFIX,
            status: false,
        },
        {
            title: `рп био других людей`,
            content: `[CENTER][COLOR=rgb(0, 255, 255)][FONT=verdana][SIZE=4]Здравствуйте.[/SIZE][/FONT][/COLOR]<br><br>`+
            `Ваша RP биография была рассмотрена и [COLOR=rgb(255, 0, 0)][U]отклонена[/U][/COLOR] администрацией сервера.<br>`+
            "Причина отклонения RP биографии: запрещено использовать биографии известных личностей, лидеров, администраторов сервера, разработчиков, руководителей.<br><br>" +
            "[Center][SIZE=4][FONT=verdana]Благодарим вас за обращение. Приятной игры на сервере [COLOR=rgb(102, 51, 255)][B]PODOLSK[/B][/COLOR].",

            prefix: UNACCEPT_PREFIX,
            status: false,
        },
        {
            title: `Скопированная РП био`,
            content: `[CENTER][COLOR=rgb(0, 255, 255)][FONT=verdana][SIZE=4]Здравствуйте.[/SIZE][/FONT][/COLOR]<br><br>`+
            `Ваша RP биография была рассмотрена и [COLOR=rgb(255, 0, 0)][U]отклонена[/U][/COLOR] администрацией сервера.<br>`+
            "Причина отклонения RP биографии: запрещено полное и частичное копирование биографий из данного раздела или из разделов RP биографий других серверов.<br><br>" +
            "[Center][SIZE=4][FONT=verdana]Благодарим вас за обращение. Приятной игры на сервере [COLOR=rgb(102, 51, 255)][B]PODOLSK[/B][/COLOR].",

            prefix: UNACCEPT_PREFIX,
            status: false,
        },
        {
            title: `способности в био`,
            content: `[CENTER][COLOR=rgb(0, 255, 255)][FONT=verdana][SIZE=4]Здравствуйте.[/SIZE][/FONT][/COLOR]<br><br>`+
            `Ваша RP биография была рассмотрена и [COLOR=rgb(255, 0, 0)][U]отклонена[/U][/COLOR] администрацией сервера.<br>`+
            "Причина отклонения RP биографии: запрещено приписывание своему персонажу супер способностей.<br><br>" +
            "[Center][SIZE=4][FONT=verdana]Благодарим вас за обращение. Приятной игры на сервере [COLOR=rgb(102, 51, 255)][B]PODOLSK[/B][/COLOR].",

            prefix: UNACCEPT_PREFIX,
            status: false,
        },
        {
            title: `пропаганда религий или националистических взглядов`,
            content: `[CENTER][COLOR=rgb(0, 255, 255)][FONT=verdana][SIZE=4]Здравствуйте.[/SIZE][/FONT][/COLOR]<br><br>`+
            `Ваша RP биография была рассмотрена и [COLOR=rgb(255, 0, 0)][U]отклонена[/U][/COLOR] администрацией сервера.<br>`+
            "Причина отклонения RP биографии: запрещена пропаганда религиозных или националистических взглядов, или высказываний.<br><br>" +
            "[Center][SIZE=4][FONT=verdana]Благодарим вас за обращение. Приятной игры на сервере [COLOR=rgb(102, 51, 255)][B]PODOLSK[/B][/COLOR].",

            prefix: UNACCEPT_PREFIX,
            status: false,
        },
        {
            title: `Дата рождения не корректна`,
            content: `[CENTER][COLOR=rgb(0, 255, 255)][FONT=verdana][SIZE=4]Здравствуйте.[/SIZE][/FONT][/COLOR]<br><br>`+
            `Ваша RP биография была рассмотрена и [COLOR=rgb(255, 0, 0)][U]отклонена[/U][/COLOR] администрацией сервера.<br>`+
            "Причина отклонения RP биографии: информация не совпадает с датой рождения<br><br>" +
            "[Center][SIZE=4][FONT=verdana]Благодарим вас за обращение. Приятной игры на сервере [COLOR=rgb(102, 51, 255)][B]PODOLSK[/B][/COLOR].",

            prefix: UNACCEPT_PREFIX,
            status: false,
        },
        {
            title: `возраст не совпадает с датой рождения`,
            content: `[CENTER][COLOR=rgb(0, 255, 255)][FONT=verdana][SIZE=4]Здравствуйте.[/SIZE][/FONT][/COLOR]<br><br>`+
            `Ваша RP биография была рассмотрена и [COLOR=rgb(255, 0, 0)][U]отклонена[/U][/COLOR] администрацией сервера.<br>`+
            "Причина отклонения RP биографии: возраст не совпадает с датой рождения<br><br>" +
            "[Center][SIZE=4][FONT=verdana]Благодарим вас за обращение. Приятной игры на сервере [COLOR=rgb(102, 51, 255)][B]PODOLSK[/B][/COLOR].",

            prefix: UNACCEPT_PREFIX,
            status: false,
        },
        {
            title: `Отсутствует дата рождения`,
            content: `[CENTER][COLOR=rgb(0, 255, 255)][FONT=verdana][SIZE=4]Здравствуйте.[/SIZE][/FONT][/COLOR]<br><br>`+
            `Ваша RP биография была рассмотрена и [COLOR=rgb(255, 0, 0)][U]отклонена[/U][/COLOR] администрацией сервера.<br>`+
            "Причина отклонения RP биографии: Отсутствие даты рождения<br><br>" +
            "[Center][SIZE=4][FONT=verdana]Благодарим вас за обращение. Приятной игры на сервере [COLOR=rgb(102, 51, 255)][B]PODOLSK[/B][/COLOR].",

            prefix: UNACCEPT_PREFIX,
            status: false,
        },

        {
            title: `Не по форме`,
            content: `[CENTER][COLOR=rgb(0, 255, 255)][FONT=verdana][SIZE=4]Здравствуйте.[/SIZE][/FONT][/COLOR]<br><br>`+
            `Ваша RP биография была рассмотрена и [COLOR=rgb(255, 0, 0)][U]отклонена[/U][/COLOR] администрацией сервера.<br>`+
            "Причина отклонения RP биографии: РП биография не по форме<br><br>" +
            "[Center][SIZE=4][FONT=verdana]Благодарим вас за обращение. Приятной игры на сервере [COLOR=rgb(102, 51, 255)][B]PODOLSK[/B][/COLOR].",

            prefix: UNACCEPT_PREFIX,
            status: false,
        },
      {
            title: `От 3 лица`,
            content: `[CENTER][COLOR=rgb(0, 255, 255)][FONT=verdana][SIZE=4]Здравствуйте.[/SIZE][/FONT][/COLOR]<br><br>`+
            `Ваша RP биография была рассмотрена и [COLOR=rgb(255, 0, 0)][U]отклонена[/U][/COLOR] администрацией сервера.<br>`+
            "Причина отклонения RP биографии: Ваша RP биография написанна от 3-его лица<br><br>" +
            "[Center][SIZE=4][FONT=verdana]Благодарим вас за обращение. Приятной игры на сервере [COLOR=rgb(102, 51, 255)][B]PODOLSK[/B][/COLOR].",

            prefix: UNACCEPT_PREFIX,
            status: false,
        },
      {
            title: `Не была дополнена`,
            content: `[CENTER][COLOR=rgb(0, 255, 255)][FONT=verdana][SIZE=4]Здравствуйте.[/SIZE][/FONT][/COLOR]<br><br>`+
            `Ваша RP биография была рассмотрена и [COLOR=rgb(255, 0, 0)][U]отклонена[/U][/COLOR] администрацией сервера.<br>`+
            "Причина отклонения RP биографии: Не была дополнена в течении 24-х часов<br><br>" +
            "[Center][SIZE=4][FONT=verdana]Благодарим вас за обращение. Приятной игры на сервере [COLOR=rgb(102, 51, 255)][B]PODOLSK[/B][/COLOR].",

            prefix: UNACCEPT_PREFIX,
            status: false,
        },

    ];

    $(document).ready(() => {
        // Загрузка скрипта для обработки шаблонов
        $(`body`).append(`<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>`);

        // Добавление кнопок при загрузке страницы
       addButton(`На рассмотрение`, `pin`)
       $("button#pin").css("background-color", "#FF8000");
        $("button#pin").css("border", "2px solid #FF8000")
        $("button#pin").css("border-radius", "15px")
        addButton(`Одобрено`, `accepted`);
        $("button#accepted").css("background-color", "#009900");
        $("button#accepted").css("border", "2px solid #009900")
        $("button#accepted").css("border-radius", "15px")
        addButton(`Отказано`, `unaccept`);
        $("button#unaccept").css("background-color", "#FF0000");
        $("button#unaccept").css("border", "2px solid #FF0000")
        $("button#unaccept").css("border-radius", "15px")
        addButton(`Ответы`, `selectAnswer`);
        $("button#pin, button#accepted, button#unaccept").css("margin-right", "5px");

       /*$("body").css("background-image", "url('https://i.artfile.ru/1920x1280_1076217_[www.ArtFile.ru].jpg')");
       $("body").css("background-size", "100%");
       $("body").css("background-repeat", "no-repeat");
       $("body").css("background-attachment", "fixed");
       $("div .p-body-pageContent").css("opacity", "0.6");*/


        // Поиск информации о теме
        const threadData = getThreadData();

        $(`button#pin`).click(() => editThreadData(PIN_PREFIX, true));
        $(`button#accepted`).click(() => editThreadData(ACCEPT_PREFIX, false));
        $(`button#teamProject`).click(() => editThreadData(COMMAND_PREFIX, true));
        $(`button#unaccept`).click(() => editThreadData(UNACCEPT_PREFIX, false));
       $(`button#selectAnswer`).click(() => {
            XF.alert(buttonsMarkup(buttons), null, `Выберите ответ:`);
            buttons.forEach((btn, id) => {
                if (id != 0 && id != 100) {
                    $(`button#answers-${id}`).click(() => pasteContent(id, threadData, true));}
                 else {
                    $(`button#answers-${id}`).click(() => pasteContent(id, threadData, false));
                }
            });
        });
    });

    function addButton(name, id) {
        $(`.button--icon--reply`).before(
            `<button type="button" class="button rippleButton" id="${id}" style="margin: 3px;">${name}</button>`,
        );
    }

    function buttonsMarkup(buttons) {

        return `<div class="select_answer">${buttons
            .map(
                (btn, i) =>
                    `<button id="answers-${i}" class="button--primary button ` +
                    `rippleButton" style="margin:5px"><span class="button-text">${btn.title}</span></button>`,
            )
            .join(``)}</div>`;
    }

    function pasteContent(id, data = {}, send = false) {
        const template = Handlebars.compile(buttons[id].content);
        if ($(`.fr-element.fr-view p`).text() === ``) $(`.fr-element.fr-view p`).empty();

        $(`span.fr-placeholder`).empty();
        $(`div.fr-element.fr-view p`).append(template(data));
        $(`a.overlay-titleCloser`).trigger(`click`);

        if (send == true) {
            editThreadData(buttons[id].prefix, buttons[id].status);
            $(`.button--icon.button--icon--reply.rippleButton`).trigger(`click`);
        }
    }

    async function getThreadData() {
        const authorID = $(`a.username`)[0].attributes[`data-user-id`].nodeValue;
        const authorName = $(`a.username`).html();
        const hours = new Date().getHours();
        const greeting = 4 < hours && hours <= 11
            ? `Доброе утро`
            : 11 < hours && hours <= 15
                ? `Добрый день`
                : 15 < hours && hours <= 21
                    ? `Добрый вечер`
                    : `Доброй ночи`

        return {
            user: {
                id: authorID,
                name: authorName,
                mention: `[USER=${authorID}]${authorName}[/USER]`,
            },
            greeting: greeting
        };
    }

    function editThreadData(prefix, pin = false) {
        // Получаем заголовок темы, так как он необходим при запросе
        const threadTitle = $(`.p-title-value`)[0].lastChild.textContent;

        if (pin == false) {
            fetch(`${document.URL}edit`, {
                method: `POST`,
                body: getFormData({
                    prefix_id: prefix,
                    title: threadTitle,
                    _xfToken: XF.config.csrf,
                    _xfRequestUri: document.URL.split(XF.config.url.fullBase)[1],
                    _xfWithData: 1,
                    _xfResponseType: `json`,
                }),
            }).then(() => location.reload());
        }
        if (pin == true) {
            fetch(`${document.URL}edit`, {
                method: `POST`,
                body: getFormData({
                    prefix_id: prefix,
                    title: threadTitle,
                    sticky: 1,
                    _xfToken: XF.config.csrf,
                    _xfRequestUri: document.URL.split(XF.config.url.fullBase)[1],
                    _xfWithData: 1,
                    _xfResponseType: `json`,
                }),
            }).then(() => location.reload());
        }
    }

    function getFormData(data) {
        const formData = new FormData();
        Object.entries(data).forEach(i => formData.append(i[0], i[1]));
        return formData;
    }
})();// ==UserScript==
// @name         New Userscript
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://docs.google.com/spreadsheets/d/13ADEJLnL4Y9JVhQFX6U0Kirt9gKf93LfjPADw9wfldQ/edit#gid=1928965921
// @icon         https://www.google.com/s2/favicons?sz=64&domain=google.com
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
})();// ==UserScript==
// @name         New Userscript
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://forum.blackrussia.online/threads/test.6402380/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=blackrussia.online
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
})();// ==UserScript==
// @name         New Userscript
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B8%D0%B3%D1%80%D0%BE%D0%BA%D0%BE%D0%B2.2458/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=blackrussia.online
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
})();