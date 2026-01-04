// ==UserScript==
// @name        SPB || Кураторы форума 
// @namespace    https://forum.blackrussia.online/
// @version      1.0.1.5
// @description  Специально для BlackRussia
// @author       M.Woody | SPB
// @match        https://forum.blackrussia.online/threads/*
// @include      https://forum.blackrussia.online/threads/
// @match        https://forum.blackrussia.online/forums/*
// @include      https://forum.blackrussia.online/forums/
// @match        https://forum.blackrussia.online/forums/Сервер-№35-grozny.1587/post-thread&inline-mode=1*
// @include      https://forum.blackrussia.online/forums/Сервер-№35-grozny.1587/post-thread&inline-mode=1
// @icon         https://icons.iconarchive.com/icons/aha-soft/iron-man/48/Ironman-Mask-3-Old-icon.png
// @grant        none
// @license      MIT
// @supportURL https://vk.com/procto_pashka
// @downloadURL https://update.greasyfork.org/scripts/489966/SPB%20%7C%7C%20%D0%9A%D1%83%D1%80%D0%B0%D1%82%D0%BE%D1%80%D1%8B%20%D1%84%D0%BE%D1%80%D1%83%D0%BC%D0%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/489966/SPB%20%7C%7C%20%D0%9A%D1%83%D1%80%D0%B0%D1%82%D0%BE%D1%80%D1%8B%20%D1%84%D0%BE%D1%80%D1%83%D0%BC%D0%B0.meta.js
// ==/UserScript==


(async function () {
    `use strict`;
    const UNACCEPT_PREFIX = 4; // Prefix that will be set when thread closes
    const ACCEPT_PREFIX = 8; // Prefix that will be set when thread accepted
    const PIN_PREFIX = 2; // Prefix that will be set when thread pins
    const COMMAND_PREFIX = 10; // Prefix that will be set when thread send to project team
    const WATCHED_PREFIX = 9;
    const CLOSE_PREFIX = 7;
    const SPECIAL_PREFIX = 11;
    const GA_PREFIX = 12;
    const TECH_PREFIX = 13;
    const data = await getThreadData(),
          greeting = data.greeting,
          user = data.user;
    const buttons2 = [
    {
            title: `Приветствие`,
            content: `[CENTER][COLOR=rgb(255, 0, 0)]${greeting}, уважаемый[/COLOR] ${user.mention}[/CENTER]`,
     },
     {
            title: '-----------------------------------------------------------------------Одобрено-----------------------------------------------------------------------',
     },
     
      
     {
          title: `НА РАССМОТРЕНИИ`,
          content: `[SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]${greeting}[/COLOR], уважаемый(ая)${user.mention}[/FONT][/SIZE]<br><br>`+
         `[SIZE=4][FONT=georgia]Ваша жалоба находится на рассмотрении.<br>`+
         `Просьба не создавать дубликаты данной темы.<br><br>`+
         `[COLOR=rgb(51, 204, 51)]На рассмотрении.[/COLOR][/FONT][/SIZE]<br>`,
          prefix: PIN_PREFIX,
         status:false,
    },
    {
          title: `DM`,
          content: `[SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]${greeting}[/COLOR] , уважаемый(ая) ${user.mention}[/FONT][/SIZE]<br><br>`+
         `[SIZE=4][FONT=georgia]Нарушитель будет наказан по следующему пункту общих правил серверов:<[/FONT][/SIZE]<br><br>`+
         "[COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4]2.18. [/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4] Запрещен MG (MetaGaming) — использование ООС информации, которую Ваш персонаж никак не мог получить в IC процессе[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4] | Mute 30 минут[/SIZE][/FONT][/COLOR]<br><br>" +
         '[LIST]<br><br>' +
         "[*][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4]Примечание: [/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4]использование смайлов в виде символов «))», «=D» запрещено в IC чате.[/SIZE][/FONT][/COLOR]<br><br>" +
         "[*][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4]Примечание:[/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4] телефонное общение также является IC чатом.[/SIZE][/FONT][/COLOR]<br><br>" +
         "[*][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4]Примечание:[/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4] за написанный однократно вопросительный «?» или восклицательный «!» знак в IC чате, наказание не выдается.[/SIZE][/FONT][/COLOR]<br><br>" +
         "[/LIST]<br><br>" +
         `[COLOR=rgb(255, 0, 0)]Одобрено.[/COLOR][/FONT][/SIZE]<br>`,
          prefix: ACCEPT_PREFIX,
         status:false,
    },

  ]

    $(document).ready(() => {
        // Загрузка скрипта для обработки шаблонов
        $(`body`).append(`<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>`);

        // Добавление кнопок при загрузке страницы
        
        // Поиск информации о теме
        const threadData = getThreadData();

        

        $(`button#admin-otvet`).click(() => {
            XF.alert(buttonsMarkup(buttons), null, `Здарова грозный, выбери ответ:`);
            buttons.forEach((btn, id) => {
                if (id > 15) {
                    $(`button#answers-${id}`).click(() => pasteContent(id, threadData, true));
                } else {
                    $(`button#answers-${id}`).click(() => pasteContent(id, threadData, false));
                }
            });
        });
              addButton(`ОТВЕТЫ`, `player-otvet`);

        $(`button#player-otvet`).click(() => {
            XF.alert(buttonsMarkup(buttons2), null, `Здарова Питерский, выбери ответ:`);
            buttons2.forEach((btn, id) => {
                if (id > 15) {
                    $(`button#answers-${id}`).click(() => pasteContent2(id, threadData, true));
                } else {
                    $(`button#answers-${id}`).click(() => pasteContent2(id, threadData, false));
                }
            });
        });
    });

    function addButton(name, id) {
        $(`.button--icon--reply`).before(
            `<button type="button" class="button rippleButton" id="${id}" style="margin: 3px;">${name}</button>`,
        );
        if(id === 21) {
            button.hide()
        }
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
    function pasteContent2(id, data = {}, send = false) {
        const template = Handlebars.compile(buttons2[id].content);
        if ($(`.fr-element.fr-view p`).text() === ``) $(`.fr-element.fr-view p`).empty();

        $(`span.fr-placeholder`).empty();
        $(`div.fr-element.fr-view p`).append(template(data));
        $(`a.overlay-titleCloser`).trigger(`click`);

        if (send == true) {
            editThreadData(buttons2[id].prefix, buttons2[id].status);
            $(`.button--icon.button--icon--reply.rippleButton`).trigger(`click`);
        }
    }

    function pasteContent3(id, data = {}, send = false) {
        const template = Handlebars.compile(buttons3[id].content);
        if ($(`.fr-element.fr-view p`).text() === ``) $(`.fr-element.fr-view p`).empty();

        $(`span.fr-placeholder`).empty();
        $(`div.fr-element.fr-view p`).append(template(data));
        $(`a.overlay-titleCloser`).trigger(`click`);

        if (send == true) {
            editThreadData(buttons3[id].prefix, buttons3[id].status);
            $(`.button--icon.button--icon--reply.rippleButton`).trigger(`click`);
        }
    }

    function pasteContent0(id, data = {}, send = false) {
        const template = Handlebars.compile(buttons0[id].content);
        if ($(`.fr-element.fr-view p`).text() === ``) $(`.fr-element.fr-view p`).empty();

        $(`span.fr-placeholder`).empty();
        $(`div.fr-element.fr-view p`).append(template(data));
        $(`a.overlay-titleCloser`).trigger(`click`);

        if (send == true) {
            editThreadData(buttons0[id].prefix, buttons0[id].status);
            $(`.button--icon.button--icon--reply.rippleButton`).trigger(`click`);
        }
    }
    addButton('На рассмотрение', 'pin');
    addButton('Одобрено', 'accepted');
    addButton('Отказано', 'unaccept');
    addButton('Теху', 'tex123');
    addButton(`ОТВЕТЫ`, `player-otvet`);
    
    $('button#pin').click(() => editThreadData(PIN_PREFIX, true));
    $('button#accepted').click(() => editThreadData(ACCEPT_PREFIX, false));
    $('button#Ga').click(() => editThreadData(GA_PREFIX, true));
    $('button#teamProject').click(() => editThreadData(COMMAND_PREFIX, true));
    $('button#unaccept').click(() => editThreadData(UNACCEPT_PREFIX, false));
    $('button#tex123').click(() => editThreadData(TECH_PREFIX, true));
    $('button#Zakrito').click(() => editThreadData(CLOSE_PREFIX, false));
  

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
    })();

