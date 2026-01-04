// ==UserScript==
// @name         KHABAROVSK | КФ | РП био/ситуации/организации
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Если нашли баг/недочёт писать: @mr_hares (ВК)
// @author       L. Moretti
// @match        https://forum.blackrussia.online/threads/*
// @include      https://forum.blackrussia.online/threads/
// @icon         https://i.postimg.cc/dVF25LZY/JS.png
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/523382/KHABAROVSK%20%7C%20%D0%9A%D0%A4%20%7C%20%D0%A0%D0%9F%20%D0%B1%D0%B8%D0%BE%D1%81%D0%B8%D1%82%D1%83%D0%B0%D1%86%D0%B8%D0%B8%D0%BE%D1%80%D0%B3%D0%B0%D0%BD%D0%B8%D0%B7%D0%B0%D1%86%D0%B8%D0%B8.user.js
// @updateURL https://update.greasyfork.org/scripts/523382/KHABAROVSK%20%7C%20%D0%9A%D0%A4%20%7C%20%D0%A0%D0%9F%20%D0%B1%D0%B8%D0%BE%D1%81%D0%B8%D1%82%D1%83%D0%B0%D1%86%D0%B8%D0%B8%D0%BE%D1%80%D0%B3%D0%B0%D0%BD%D0%B8%D0%B7%D0%B0%D1%86%D0%B8%D0%B8.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const UNACCEPT_PREFIX = 4;
    const ACCEPT_PREFIX = 8;
    const PIN_PREFIX = 2;
    const COMMAND_PREFIX = 10;
    const WATCHED_PREFIX = 9;
    const GA_PREFIX = 12;
    const TECH_PREFIX = 13;
    const CLOSE_PREFIX = 7;
    const GROUP = 98;
    const ANSWER = 16;
    const buttons = [
        {
            title: "РП биографии",
            type: GROUP,
        },
        {
            title: "Одобрена",
            content:
            '[CENTER][FONT=courier new][B][COLOR=rgb(84, 172, 210)]Доброго времени суток, уважаемый(-ая) {{ user.mention }}.[/COLOR]<br><br>' +
            '[IMG width="600px"]https://i.ibb.co/4FnVsC8/image.png[[IMG]https://ibb.co/51gRYCr[/IMG]<br>' +
            'Ваша RolePlay - Биография одобрена.<br>' +
            '[IMG width="600px"]https://i.ibb.co/4FnVsC8/image.png[[IMG]https://ibb.co/51gRYCr[/IMG]<br>' +
            '[COLOR=#4caf50][ICODE]Одобрено[/ICODE][/COLOR][/B][/FONT][/CENTER]',
            prefix: ACCEPT_PREFIX,
            status: false,
        },
        {
            title: "Скопирована",
            content:
            '[CENTER][FONT=courier new][B][COLOR=rgb(84, 172, 210)]Доброго времени суток, уважаемый(-ая) {{ user.mention }}.[/COLOR]<br><br>' +
            '[IMG width="600px"]https://i.ibb.co/4FnVsC8/image.png[[IMG]https://ibb.co/51gRYCr[/IMG]<br>' +
            'Ваша RolePlay - Биография скопирована.<br>' +
            '[COLOR=rgb(209, 213, 216)]Внимательно прочитайте правила создания RP - биографий закрепленные в данном разделе.<br>' +
            '[IMG width="600px"]https://i.ibb.co/4FnVsC8/image.png[[IMG]https://ibb.co/51gRYCr[/IMG]<br>' +
            '[COLOR=red][ICODE]Отказано[/ICODE][/COLOR][/B][/FONT][/CENTER]',
            prefix: UNACCEPT_PREFIX,
            status: false,
        },
        {
            title: "Дата не подходит",
            content:
            '[CENTER][FONT=courier new][B][COLOR=rgb(84, 172, 210)]Доброго времени суток, уважаемый(-ая) {{ user.mention }}.[/COLOR]<br><br>' +
            '[IMG width="600px"]https://i.ibb.co/4FnVsC8/image.png[[IMG]https://ibb.co/51gRYCr[/IMG]<br>' +
            'Возраст в RolePlay - Биографии не совпадает с датой рождения.<br>' +
            '[COLOR=rgb(209, 213, 216)]Внимательно прочитайте правила создания RP - биографий закрепленные в данном разделе.<br>' +
            '[IMG width="600px"]https://i.ibb.co/4FnVsC8/image.png[[IMG]https://ibb.co/51gRYCr[/IMG]<br>' +
            '[COLOR=red][ICODE]Отказано[/ICODE][/COLOR][/B][/FONT][/CENTER]',
            prefix: UNACCEPT_PREFIX,
            status: false,
        },
        {
            title: "Заголовок не по форме",
            content:
            '[CENTER][FONT=courier new][B][COLOR=rgb(84, 172, 210)]Доброго времени суток, уважаемый(-ая) {{ user.mention }}.[/COLOR]<br><br>' +
            '[IMG width="600px"]https://i.ibb.co/4FnVsC8/image.png[[IMG]https://ibb.co/51gRYCr[/IMG]<br>' +
            'Заголовок вашей RolePlay - Биографии составлен не по форме.<br>' +
            '[COLOR=rgb(209, 213, 216)]Внимательно прочитайте правила создания RP - биографий закрепленные в данном разделе.<br>' +
            '[IMG width="600px"]https://i.ibb.co/4FnVsC8/image.png[[IMG]https://ibb.co/51gRYCr[/IMG]<br>' +
            '[COLOR=red][ICODE]Отказано[/ICODE][/COLOR][/B][/FONT][/CENTER]',
            prefix: UNACCEPT_PREFIX,
            status: false,
        },
        {
            title: "Не по форме",
            content:
            '[CENTER][FONT=courier new][B][COLOR=rgb(84, 172, 210)]Доброго времени суток, уважаемый(-ая) {{ user.mention }}.[/COLOR]<br><br>' +
            '[IMG width="600px"]https://i.ibb.co/4FnVsC8/image.png[[IMG]https://ibb.co/51gRYCr[/IMG]<br>' +
            'Ваша RolePlay - Биография составлена не по форме.<br>' +
            '[COLOR=rgb(209, 213, 216)]Внимательно прочитайте правила создания RP - биографий закрепленные в данном разделе.<br>' +
            '[IMG width="600px"]https://i.ibb.co/4FnVsC8/image.png[[IMG]https://ibb.co/51gRYCr[/IMG]<br>' +
            '[COLOR=red][ICODE]Отказано[/ICODE][/COLOR][/B][/FONT][/CENTER]',
            prefix: UNACCEPT_PREFIX,
            status: false,
        },
        {
            title: "Мало информации",
            content:
            '[CENTER][FONT=courier new][B][COLOR=rgb(84, 172, 210)]Доброго времени суток, уважаемый(-ая) {{ user.mention }}.[/COLOR]<br><br>' +
            '[IMG width="600px"]https://i.ibb.co/4FnVsC8/image.png[[IMG]https://ibb.co/51gRYCr[/IMG]<br>' +
            'Ваша RolePlay - Биография содержит мало информации.<br>' +
            '[COLOR=rgb(209, 213, 216)]Внимательно прочитайте правила создания RP - биографий закрепленные в данном разделе.<br>' +
            '[IMG width="600px"]https://i.ibb.co/4FnVsC8/image.png[[IMG]https://ibb.co/51gRYCr[/IMG]<br>' +
            '[COLOR=red][ICODE]Отказано[/ICODE][/COLOR][/B][/FONT][/CENTER]',
            prefix: UNACCEPT_PREFIX,
            status: false,
        },
        {
            title: "Много ошибок",
            content:
            '[CENTER][FONT=courier new][B][COLOR=rgb(84, 172, 210)]Доброго времени суток, уважаемый(-ая) {{ user.mention }}.[/COLOR]<br><br>' +
            '[IMG width="600px"]https://i.ibb.co/4FnVsC8/image.png[[IMG]https://ibb.co/51gRYCr[/IMG]<br>' +
            'В вашей RolePlay - Биографии допущено много ошибок.<br>' +
            '[COLOR=rgb(209, 213, 216)]Внимательно прочитайте правила создания RP - биографий закрепленные в данном разделе.<br>' +
            '[IMG width="600px"]https://i.ibb.co/4FnVsC8/image.png[[IMG]https://ibb.co/51gRYCr[/IMG]<br>' +
            '[COLOR=red][ICODE]Отказано[/ICODE][/COLOR][/B][/FONT][/CENTER]',
            prefix: UNACCEPT_PREFIX,
            status: false,
        },
        {
            title: "От 3-его лица",
            content:
            '[CENTER][FONT=courier new][B][COLOR=rgb(84, 172, 210)]Доброго времени суток, уважаемый(-ая) {{ user.mention }}.[/COLOR]<br><br>' +
            '[IMG width="600px"]https://i.ibb.co/4FnVsC8/image.png[[IMG]https://ibb.co/51gRYCr[/IMG]<br>' +
            'Ваша RolePlay - Биография написана от 3-его лица.<br>' +
            '[COLOR=rgb(209, 213, 216)]Внимательно прочитайте правила создания RP - биографий закрепленные в данном разделе.<br>' +
            '[IMG width="600px"]https://i.ibb.co/4FnVsC8/image.png[[IMG]https://ibb.co/51gRYCr[/IMG]<br>' +
            '[COLOR=red][ICODE]Отказано[/ICODE][/COLOR][/B][/FONT][/CENTER]',
            prefix: UNACCEPT_PREFIX,
            status: false,
        },
        {
            title: "Ник на анг",
            content:
            '[CENTER][FONT=courier new][B][COLOR=rgb(84, 172, 210)]Доброго времени суток, уважаемый(-ая) {{ user.mention }}.[/COLOR]<br><br>' +
            '[IMG width="600px"]https://i.ibb.co/4FnVsC8/image.png[[IMG]https://ibb.co/51gRYCr[/IMG]<br>' +
            'Ник в вашей RolePlay - Биографии должен быть на русском языке.<br>' +
            '[COLOR=rgb(209, 213, 216)]Внимательно прочитайте правила создания RP - биографий закрепленные в данном разделе.<br>' +
            '[IMG width="600px"]https://i.ibb.co/4FnVsC8/image.png[[IMG]https://ibb.co/51gRYCr[/IMG]<br>' +
            '[COLOR=red][ICODE]Отказано[/ICODE][/COLOR][/B][/FONT][/CENTER]',
            prefix: UNACCEPT_PREFIX,
            status: false,
        },
        {
            title: "НонРП ник",
            content:
            '[CENTER][FONT=courier new][B][COLOR=rgb(84, 172, 210)]Доброго времени суток, уважаемый(-ая) {{ user.mention }}.[/COLOR]<br><br>' +
            '[IMG width="600px"]https://i.ibb.co/4FnVsC8/image.png[[IMG]https://ibb.co/51gRYCr[/IMG]<br>' +
            'Ваша RolePlay - Биография отказана т.к у вас NonRP NickName.<br>' +
            '[COLOR=rgb(209, 213, 216)]Внимательно прочитайте правила создания RP - биографий закрепленные в данном разделе.<br>' +
            '[IMG width="600px"]https://i.ibb.co/4FnVsC8/image.png[[IMG]https://ibb.co/51gRYCr[/IMG]<br>' +
            '[COLOR=red][ICODE]Отказано[/ICODE][/COLOR][/B][/FONT][/CENTER]',
            prefix: UNACCEPT_PREFIX,
            status: false,
        },
        {
            title: "НонРП биография",
            content:
            '[CENTER][FONT=courier new][B][COLOR=rgb(84, 172, 210)]Доброго времени суток, уважаемый(-ая) {{ user.mention }}.[/COLOR]<br><br>' +
            '[IMG width="600px"]https://i.ibb.co/4FnVsC8/image.png[[IMG]https://ibb.co/51gRYCr[/IMG]<br>' +
            'Ваша RolePlay - Биография является NonRP.<br>' +
            '[COLOR=rgb(209, 213, 216)]Внимательно прочитайте правила создания RP - биографий закрепленные в данном разделе.<br>' +
            '[IMG width="600px"]https://i.ibb.co/4FnVsC8/image.png[[IMG]https://ibb.co/51gRYCr[/IMG]<br>' +
            '[COLOR=red][ICODE]Отказано[/ICODE][/COLOR][/B][/FONT][/CENTER]',
            prefix: UNACCEPT_PREFIX,
            status: false,
        },
        {
            title: "Супергерой",
            content:
            '[CENTER][FONT=courier new][B][COLOR=rgb(84, 172, 210)]Доброго времени суток, уважаемый(-ая) {{ user.mention }}.[/COLOR]<br><br>' +
            '[IMG width="600px"]https://i.ibb.co/4FnVsC8/image.png[[IMG]https://ibb.co/51gRYCr[/IMG]<br>' +
            'Персонаж в вашей RolePlay - Биографии обладает суперспособностями.<br>' +
            '[COLOR=rgb(209, 213, 216)]Внимательно прочитайте правила создания RP - биографий закрепленные в данном разделе.<br>' +
            '[IMG width="600px"]https://i.ibb.co/4FnVsC8/image.png[[IMG]https://ibb.co/51gRYCr[/IMG]<br>' +
            '[COLOR=red][ICODE]Отказано[/ICODE][/COLOR][/B][/FONT][/CENTER]',
            prefix: UNACCEPT_PREFIX,
            status: false,
        },
        {
            title: "РП Cитуации",
            type: GROUP,
        },
        {
            title: "Одобрена",
            content:
            '[CENTER][FONT=courier new][B][COLOR=rgb(84, 172, 210)]Доброго времени суток, уважаемый(-ая) {{ user.mention }}.[/COLOR]<br><br>' +
            '[IMG width="600px"]https://i.ibb.co/4FnVsC8/image.png[[IMG]https://ibb.co/51gRYCr[/IMG]<br>' +
            'Ваша RolePlay - Ситуация одобрена.<br>' +
            '[IMG width="600px"]https://i.ibb.co/4FnVsC8/image.png[[IMG]https://ibb.co/51gRYCr[/IMG]<br>' +
            '[COLOR=#4caf50][ICODE]Одобрено[/ICODE][/COLOR][/B][/FONT][/CENTER]',
            prefix: ACCEPT_PREFIX,
            status: false,
        },
        {
            title: "Скопирована",
            content:
            '[CENTER][FONT=courier new][B][COLOR=rgb(84, 172, 210)]Доброго времени суток, уважаемый(-ая) {{ user.mention }}.[/COLOR]<br><br>' +
            '[IMG width="600px"]https://i.ibb.co/4FnVsC8/image.png[[IMG]https://ibb.co/51gRYCr[/IMG]<br>' +
            'Ваша RolePlay - Ситуация скопирована.<br>' +
            '[COLOR=rgb(209, 213, 216)]Внимательно прочитайте правила создания RP - Ситуаций закрепленные в данном разделе.<br>' +
            '[IMG width="600px"]https://i.ibb.co/4FnVsC8/image.png[[IMG]https://ibb.co/51gRYCr[/IMG]<br>' +
            '[COLOR=red][ICODE]Отказано[/ICODE][/COLOR][/B][/FONT][/CENTER]',
            prefix: UNACCEPT_PREFIX,
            status: false,
        },
        {
            title: "Заголовок не по форме",
            content:
            '[CENTER][FONT=courier new][B][COLOR=rgb(84, 172, 210)]Доброго времени суток, уважаемый(-ая) {{ user.mention }}.[/COLOR]<br><br>' +
            '[IMG width="600px"]https://i.ibb.co/4FnVsC8/image.png[[IMG]https://ibb.co/51gRYCr[/IMG]<br>' +
            'Заголовок вашей RolePlay - Ситуации составлен не по форме.<br>' +
            '[COLOR=rgb(209, 213, 216)]Внимательно прочитайте правила создания RP - Ситуаций закрепленные в данном разделе.<br>' +
            '[IMG width="600px"]https://i.ibb.co/4FnVsC8/image.png[[IMG]https://ibb.co/51gRYCr[/IMG]<br>' +
            '[COLOR=red][ICODE]Отказано[/ICODE][/COLOR][/B][/FONT][/CENTER]',
            prefix: UNACCEPT_PREFIX,
            status: false,
        },
        {
            title: "Не по форме",
            content:
            '[CENTER][FONT=courier new][B][COLOR=rgb(84, 172, 210)]Доброго времени суток, уважаемый(-ая) {{ user.mention }}.[/COLOR]<br><br>' +
            '[IMG width="600px"]https://i.ibb.co/4FnVsC8/image.png[[IMG]https://ibb.co/51gRYCr[/IMG]<br>' +
            'Ваша RolePlay - Ситуация составлена не по форме.<br>' +
            '[COLOR=rgb(209, 213, 216)]Внимательно прочитайте правила создания RP - Ситуаций закрепленные в данном разделе.<br>' +
            '[IMG width="600px"]https://i.ibb.co/4FnVsC8/image.png[[IMG]https://ibb.co/51gRYCr[/IMG]<br>' +
            '[COLOR=red][ICODE]Отказано[/ICODE][/COLOR][/B][/FONT][/CENTER]',
            prefix: UNACCEPT_PREFIX,
            status: false,
        },
        {
            title: "Мало информации",
            content:
            '[CENTER][FONT=courier new][B][COLOR=rgb(84, 172, 210)]Доброго времени суток, уважаемый(-ая) {{ user.mention }}.[/COLOR]<br><br>' +
            '[IMG width="600px"]https://i.ibb.co/4FnVsC8/image.png[[IMG]https://ibb.co/51gRYCr[/IMG]<br>' +
            'Ваша RolePlay - Ситуация содержит мало информации.<br>' +
            '[COLOR=rgb(209, 213, 216)]Внимательно прочитайте правила создания RP - Ситуаций закрепленные в данном разделе.<br>' +
            '[IMG width="600px"]https://i.ibb.co/4FnVsC8/image.png[[IMG]https://ibb.co/51gRYCr[/IMG]<br>' +
            '[COLOR=red][ICODE]Отказано[/ICODE][/COLOR][/B][/FONT][/CENTER]',
            prefix: UNACCEPT_PREFIX,
            status: false,
        },
        {
            title: "РП Организации",
            type: GROUP,
        },
        {
            title: "Одобрена",
            content:
            '[CENTER][FONT=courier new][B][COLOR=rgb(84, 172, 210)]Доброго времени суток, уважаемый(-ая) {{ user.mention }}.[/COLOR]<br><br>' +
            '[IMG width="600px"]https://i.ibb.co/4FnVsC8/image.png[[IMG]https://ibb.co/51gRYCr[/IMG]<br>' +
            'Ваша RolePlay Организация одобрена.<br>' +
            '[IMG width="600px"]https://i.ibb.co/4FnVsC8/image.png[[IMG]https://ibb.co/51gRYCr[/IMG]<br>' +
            '[COLOR=#4caf50][ICODE]Одобрено[/ICODE][/COLOR][/B][/FONT][/CENTER]',
            prefix: ACCEPT_PREFIX,
            status: false,
        },
        {
            title: "Отказана",
            content:
            '[CENTER][FONT=courier new][B][COLOR=rgb(84, 172, 210)]Доброго времени суток, уважаемый(-ая) {{ user.mention }}.[/COLOR]<br><br>' +
            '[IMG width="600px"]https://i.ibb.co/4FnVsC8/image.png[[IMG]https://ibb.co/51gRYCr[/IMG]<br>' +
            'Ваша RolePlay - Организация отказана.<br>' +
            '[COLOR=rgb(209, 213, 216)]Внимательно прочитайте правила создания RP - Организаций закрепленные в данном разделе.<br>' +
            '[IMG width="600px"]https://i.ibb.co/4FnVsC8/image.png[[IMG]https://ibb.co/51gRYCr[/IMG]<br>' +
            '[COLOR=red][ICODE]Отказано[/ICODE][/COLOR][/B][/FONT][/CENTER]',
            prefix: UNACCEPT_PREFIX,
            status: false,
        },
    ]


$(document).ready(() => {
// Загрузка скрипта для обработки шаблонов
$('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');

// Добавление кнопок при загрузке страницы
addButton('РП био/ситуации/организации', 'selectAns');

// Поиск информации о теме
const threadData = getThreadData();


$(`button#selectAns`).click(() => {
    XF.alert(buttonsMarkup(buttons), null, 'Выберите ответ:');
    buttons.forEach((btn, id) => {
        if(id > 0) {
            $(`button#answers-${id}`).click(() => pasteContent(id, threadData, true));
        } else {
            $(`button#answers-${id}`).click(() => pasteContent(id, threadData, false));
        }
    });
});
});

function addButton(name, id) {
$('.button--icon--reply').before(
   `<button type="button" class="button rippleButton" id="${id}" style="margin-right: 6px; top: -2px; background-color: #212428; border-color: #33383e; border: none; box-shadow: 0 0 2px 0 rgba(0, 0, 0, 0.14), 0 2px 2px 0 rgba(0, 0, 0, 0.12), 0 1px 3px 0 rgba(0, 0, 0, 0.2);">${name}</button>`,
);
}

function buttonsMarkup(buttons) {
    return `<div class="select_answer">${buttons.map((btn, i) => {
    if (btn.type == 98) {
        return `<button id="answers-0" class="button--primary button ` +`rippleButton" style="margin:5px; width: 96.5%; display: flex; justify-content: space-between;"><span class="button-text">📌</span><span class="button-text">${btn.title}</span><span class="button-text">📌</span></button>`
    } else {
        if (btn.important == true) {
            return `<button id="answers-${i}" class="button--primary button ` +`rippleButton" style="margin:5px; background: #31343b; border: 1px solid red"><span class="button-text">${btn.title}</span></button>`
        } else {
            return `<button id="answers-${i}" class="button--primary button ` +`rippleButton" style="margin:5px; background: #31343b;"><span class="button-text">${btn.title}</span></button>`
        }
    }}).join('')}</div>`;
}

function pasteContent(id, data = {}, send = false) {
const template = Handlebars.compile(buttons[id].content);
if ($('.fr-element.fr-view p').text() === ' ') $('.fr-element.fr-view p').empty();

    $('.fr-element.fr-view > p').empty();
    $('span.fr-placeholder').empty();
    $('div.fr-element.fr-view > p').last().append(template(data));
    $('a.overlay-titleCloser').trigger('click');

    if (send == true) {
      editThreadData(buttons[id].prefix, buttons[id].status);
      moveThread(buttons[id].move, buttons[id].prefix);
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

function editThreadData(prefix, pin = false) {
    const threadTitle =
          $('.p-title-value')[0].lastChild.textContent;

    if(pin == false){
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
    }
    if(pin == true){
        fetch(`${document.URL}edit`, {
            method: 'POST',
            body: getFormData({
                prefix_id: prefix,
                title: threadTitle,
                sticky: 1,
                _xfToken: XF.config.csrf,
                _xfRequestUri: document.URL.split(XF.config.url.fullBase)[1],
                _xfWithData: 1,
                _xfResponseType: 'json',
            }),
        }).then(() => location.reload());
    }
}

function moveThread(type, prefix) {
    const threadTitle = $('.p-title-value')[0].lastChild.textContent;

    fetch(`${document.URL}move`, {
        method: 'POST',
        body: getFormData({
            title: threadTitle,
            prefix: prefix,
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