// ==UserScript==
// @name          Black Russia | Скрипт для КФ 83
// @namespace     https://forum.blackrussia.online
// @version       1.220
// @description   Скрипт для Кураторов Форума.
// @author        Egor_Montano
// @match         https://forum.blackrussia.online/threads/*
// @include       https://forum.blackrussia.online/threads/
// @icon          https://icons.iconarchive.com/icons/google/noto-emoji-food-drink/256/32343-watermelon-icon.png
// @match        https://forum.blackrussia.online/* 
// @grant         none
// @license       none
// @downloadURL https://update.greasyfork.org/scripts/546654/Black%20Russia%20%7C%20%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%9A%D0%A4%2083.user.js
// @updateURL https://update.greasyfork.org/scripts/546654/Black%20Russia%20%7C%20%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%9A%D0%A4%2083.meta.js
// ==/UserScript==

(function () {
    'use strict';
    'esversion 6' ;
    const UNACCEPT_PREFIX = 4; // Префикс "Отказано"
    const ACCEPT_PREFIX = 8; //  Префикс "Одобрено"
    const PIN_PREFIX = 2;  //  Префикс "На рассмотрении"
    const WATCHED_PREFIX = 9; // Префикс "Рассмотрено"
    const CLOSE_PREFIX = 7; // Префикс "Закрыто"
    const TEX_PREFIX = 13; // Префикс "Техническому специалисту"
    const GA_PREFIX = 12; // Префикс "Главному Администратору"
    const V_PREFIX = 1;
    const NULL_PREFIX = 15;
    const buttons = [
        {
            title: '-------------------------РП БИО--------------------------------',
        },
        {
        title: '| НА РАССМОТРЕНИЕ |',
	  content:
"[URL='https://postimages.org/'][IMG]https://i.postimg.cc/kM2WMSML/f3eabafac57241f0ac0dd6776a1c00ff.gif[/IMG][/URL]<br>" +
"[CENTER][URL='https://postimages.org/'][IMG]https://i.postimg.cc/bY5dmFhB/RLwzo.png[/IMG][/URL]<br>" +
     "[SIZE=4][FONT=georgia][I][B][COLOR=rgb(255, 0, 0)]{{ greeting }},уважаемый Пользователь.[/COLOR]<br>"+
"[URL='https://postimages.org/'][IMG]https://i.postimg.cc/bY5dmFhB/RLwzo.png[/IMG][/URL][/B][/I]<br>"+
     "[B][I]Ваша заявка взята на рассмотрение, не создавайте дубликатов и ожидайте ответа от автора сообщения.[/I][/B][/FONT][/SIZE]<br>"+
"[FONT=georgia][SIZE=4][B][I][COLOR=rgb(255, 0, 0)]На рассмотрении[/COLOR][/I][/B][/SIZE][/FONT][/CENTER]"
	    },
        {
            title: 'Одобрена',
            content:
            '[COLOR=rgb(255, 0, 0)][FONT=times new roman][CENTER][SIZE=4]{{ greeting }}, уважаемый(ая) {{ user.mention }} <br><br>' +
            "[COLOR=rgb(209, 213, 216)]Ваша RolePlay биография - одобрена.[/COLOR][/COLOR][/CENTER][/FONT][/SIZE]<br><br>" +
            '[FONT=times new roman][CENTER][SIZE=4][COLOR=rgb(209, 213, 216)]Приятной игры на BLACK RUSSIA [COLOR=rgb(0, 255, 255)]TVER.[/COLOR][/SIZE][/CENTER][/FONT]',
            prefix: ACCEPT_PREFIX,
            status: false,
        },
        {
            title: 'Отказана',
            content:
            '[COLOR=rgb(255, 0, 0)][CENTER][FONT=times new roman][CENTER][SIZE=4]{{ greeting }}, уважаемый(ая) {{ user.mention }}[/SIZE][/CENTER][/FONT][/COLOR]<br><br>' +
            "[SIZE=4][CENTER][FONT=times new roman][COLOR=rgb(209, 213, 216)]Ваша RolePlay биография - отказана.Причиной могло послужить любое нарушение правил создания RolePlay биографий.[/COLOR][/CENTER]<br><br>" +
            "[COLOR=rgb(209, 213, 216)][CENTER]Внимательно прочитайте правила создания RP биографий закрепленные в данном разделе [/COLOR][/CENTER][COLOR=rgb(209, 213, 216)][/COLOR][/FONT][/SIZE]<br><br>" +
            '[FONT=times new roman][SIZE=4][CENTER][COLOR=rgb(209, 213, 216)]Приятной игры на BLACK RUSSIA [COLOR=rgb(0, 255, 255)]TVER.[/COLOR][/CENTER][/SIZE][/FONT]',
            prefix: UNACCEPT_PREFIX,
            status: false,
        },
        {
            title : 'Заголовок не по форме' ,
            content:
            '[COLOR=rgb(255, 0, 0)][FONT=times new roman][CENTER][SIZE=4]{{ greeting }}, уважаемый(ая) {{ user.mention }}[/FONT][/CENTER][/COLOR]<br><br>' +
            "[SIZE=4][FONT=times new roman][CENTER][COLOR=rgb(209, 213, 216)]Ваша RolePlay биография - отказана т.к заголовок оформлен неправильно. [/COLOR][/CENTER]<br><br>" +
            "[COLOR=rgb(209, 213, 216)][CENTER]Внимательно прочитайте правила создания RP - биографий закрепленные в данном разделе [/COLOR][COLOR=rgb(209, 213, 216)][/CENTER][/COLOR][/FONT][/SIZE]<br><br>" +
            '[FONT=times new roman][CENTER][SIZE=4][COLOR=rgb(209, 213, 216)]Приятной игры на BLACK RUSSIA [COLOR=rgb(0, 255, 255)]TVER.[/COLOR][/SIZE][/CENTER][/FONT][/COLOR]',
            prefix: UNACCEPT_PREFIX,
            status: false,
        },
        {
            title : 'Не по форме' ,
            content:
            '[COLOR=rgb(255, 0, 0)][FONT=times new roman][CENTER][SIZE=4]{{ greeting }}, уважаемый(ая) {{ user.mention }}[/FONT][/CENTER][/COLOR]<br><br>' +
            "[SIZE=4][FONT=times new roman][CENTER][COLOR=rgb(209, 213, 216)]Ваша RolePlay биография - отказана т.к она составлена не по форме. [/COLOR][/CENTER]<br><br>" +
            "[COLOR=rgb(209, 213, 216)][CENTER]Внимательно прочитайте правила создания RolePlay биографий закрепленные в данном разделе [/COLOR][/FONT][/CENTER][/SIZE]<br><br>" +
            '[FONT=times new roman][SIZE=4][CENTER][COLOR=rgb(209, 213, 216)]Приятной игры на BLACK RUSSIA [COLOR=rgb(0, 255, 255)]TVER.[/COLOR][/SIZE][/FONT][/CENTER][/COLOR]',
            prefix: UNACCEPT_PREFIX,
            status: false,
        },
        {
            title : 'Не дополнил' ,
            content:
            '[COLOR=rgb(255, 0, 0)][CENTER][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый(ая) {{ user.mention }}[/FONT][CENTER][/COLOR]<br><br>' +
            "[SIZE=4][FONT=times new roman][CENTER][COLOR=rgb(209, 213, 216)]Ваша RolePlay биография - отказана т.к вы ее не дополнили. [/COLOR][/CENTER]<br><br>" +
            "[COLOR=rgb(209, 213, 216)][CENTER]Внимательно прочитайте правила создания RolePlay биографий закрепленные в данном разделе [/COLOR][/CENTER][COLOR=rgb(209, 213, 216)][/COLOR][/FONT][/SIZE]<br><br>" +
            '[FONT=times new roman][SIZE=4][CENTER][COLOR=rgb(209, 213, 216)]Приятной игры на BLACK RUSSIA [COLOR=rgb(0, 255, 255)]TVER.[/COLOR][/SIZE][/CENTER][/FONT][/COLOR]',
            prefix: UNACCEPT_PREFIX,
            status: false,
        },
        {
            title : 'Неграмотная' ,
            content:
            '[COLOR=rgb(255, 0, 0)][FONT=times new roman][CENTER][SIZE=4]{{ greeting }}, уважаемый(ая) {{ user.mention }}[/FONT][/CENTER][/COLOR]<br><br>' +
            "[SIZE=4][FONT=times new roman][CENTER][COLOR=rgb(209, 213, 216)]Ваша RolePlay биография - отказана т.к она оформлена неграмотно. [/COLOR][/CENTER]<br><br>" +
            "[COLOR=rgb(209, 213, 216)][CENTER]Внимательно прочитайте правила создания RolePlay биографий закрепленные в данном разделе [/COLOR][/CENTER][COLOR=rgb(209, 213, 216)][/COLOR][/FONT][/SIZE]<br><br>" +
            '[FONT=times new roman][SIZE=4][CENTER][COLOR=rgb(209, 213, 216)]Приятной игры на BLACK RUSSIA [COLOR=rgb(0, 255, 255)]TVER.[/COLOR][/SIZE][/CENTER][/FONT][/COLOR]',
            prefix: UNACCEPT_PREFIX,
            status: false,
        },
        {
            title : 'От 3-его лица' ,
            content:
            '[COLOR=rgb(255, 0, 0)][FONT=times new roman][CENTER][SIZE=4]{{ greeting }}, уважаемый(ая) {{ user.mention }}[/FONT][/CENTER][/COLOR]<br><br>' +
            "[SIZE=4][FONT=times new roman][CENTER][COLOR=rgb(209, 213, 216)]Ваша RolePlay биография - отказана т.к она должна быть написана от 3-его лица. [/COLOR][/CENTER]<br><br>" +
            "[COLOR=rgb(209, 213, 216)][CENTER]Внимательно прочитайте правила создания RolePlay биографий закрепленные в данном разделе [/COLOR][/CENTER][COLOR=rgb(209, 213, 216)][/COLOR][/FONT][/SIZE]<br><br>" +
            '[FONT=times new roman][SIZE=4][CENTER][COLOR=rgb(209, 213, 216)]Приятной игры на BLACK RUSSIA [COLOR=rgb(0, 255, 255)]TVER.[/COLOR][/SIZE][/CENTER][/FONT][/COLOR]',
            prefix: UNACCEPT_PREFIX,
            status: false,
        },
        {
            title : 'Уже одобрена' ,
            content:
            '[COLOR=rgb(255, 0, 0)][FONT=times new roman][CENTER][SIZE=4]{{ greeting }}, уважаемый(ая) {{ user.mention }}[/FONT][/CENTER][/COLOR]<br><br>' +
            "[SIZE=4][FONT=times new roman][CENTER][COLOR=rgb(209, 213, 216)]Ваша RolePlay биография - отказана т.к она уже была одобрена. [/CENTER][/COLOR]<br><br>" +
            '[FONT=times new roman][SIZE=4][CENTER][COLOR=rgb(209, 213, 216)]Приятной игры на BLACK RUSSIA [COLOR=rgb(0, 255, 255)]TVER.[/COLOR][/CENTER][/SIZE][/FONT][/COLOR]',
            prefix: UNACCEPT_PREFIX,
            status: false,
        },
        {
            title : 'Супергерой' ,
            content:
            '[COLOR=rgb(255, 0, 0)][FONT=times new roman][CENTER][SIZE=4]{{ greeting }}, уважаемый(ая) {{ user.mention }}[/FONT][/CENTER][/COLOR]<br><br>' +
            "[SIZE=4][FONT=times new roman][CENTER][COLOR=rgb(209, 213, 216)]Ваша RolePlay биография - отказана т.к вы приписали суперспособности своему персонажу. [/COLOR][/CENTER]<br><br>" +
            "[COLOR=rgb(209, 213, 216)][CENTER]Внимательно прочитайте правила создания RolePlay биографий закрепленные в данном разделе [/COLOR][COLOR=rgb(209, 213, 216)][/COLOR][/CENTER][/FONT][/SIZE]<br><br>" +
            '[FONT=times new roman][SIZE=4][CENTER][COLOR=rgb(209, 213, 216)]Приятной игры на BLACK RUSSIA [COLOR=rgb(0, 255, 255)]TVER.[/COLOR][/SIZE][/CENTER][/FONT][/COLOR]',
            prefix: UNACCEPT_PREFIX,
            status: false,
        },
        {
            title : 'Копипаст' ,
            content:
            '[COLOR=rgb(255, 0, 0)][FONT=times new roman][CENTER][SIZE=4]{{ greeting }}, уважаемый(ая) {{ user.mention }}[/FONT][/CENTER][/COLOR]<br><br>' +
            "[SIZE=4][FONT=times new roman][CENTER][COLOR=rgb(209, 213, 216)]Ваша RolePlay биография - отказана т.к вы ее скопировали у другого человека или создали при помощи ИИ. [/COLOR][/CENTER]<br><br>" +
            "[COLOR=rgb(209, 213, 216)][CENTER]Внимательно прочитайте правила создания RolePlay биографий закрепленные в данном разделе [/COLOR][COLOR=rgb(209, 213, 216)][/CENTER][/COLOR][/FONT][/SIZE]<br><br>" +
            '[FONT=times new roman][SIZE=4][CENTER][COLOR=rgb(209, 213, 216)]Приятной игры на BLACK RUSSIA [COLOR=rgb(0, 255, 255)]TVER.[/COLOR][/SIZE][/CENTER][/FONT][/COLOR]',
            prefix: UNACCEPT_PREFIX,
            status: false,
        },
        {
            title : 'нонрп ник' ,
            content:
            '[COLOR=rgb(255, 0, 0)][FONT=times new roman][CENTER][SIZE=4]{{ greeting }}, уважаемый(ая) {{ user.mention }}[/FONT][/CENTER][/COLOR]<br><br>' +
            "[SIZE=4][FONT=times new roman][CENTER][COLOR=rgb(209, 213, 216)]Ваша RolePlay биография - отказана т.к у вас NonRP NickName. [/CENTER][/COLOR]<br><br>" +
            "[COLOR=rgb(209, 213, 216)][CENTER]Внимательно прочитайте правила создания Roleplay биографий закрепленные в данном разделе [/COLOR][/CENTER][COLOR=rgb(209, 213, 216)][/COLOR][/FONT][/SIZE]<br><br>" +
            '[FONT=times new roman][SIZE=4][CENTER][COLOR=rgb(209, 213, 216)]Приятной игры на BLACK RUSSIA [COLOR=rgb(0, 255, 255)]TVER.[/COLOR][/CENTER][/SIZE][/FONT][/COLOR]',
            prefix: UNACCEPT_PREFIX,
            status: false,
        },
        {
            title : 'ник англ' ,
            content:
            '[COLOR=rgb(255, 0, 0)][FONT=times new roman][CENTER][SIZE=4]{{ greeting }}, уважаемый(ая) {{ user.mention }}[/FONT][/CENTER][/COLOR]<br><br>' +
            "[SIZE=4][FONT=times new roman][CENTER][COLOR=rgb(209, 213, 216)]Ваша RolePlay биография - отказана т.к ваш NickName должен быть написан на русском языке. [/CENTER][/COLOR]<br><br>" +
            "[COLOR=rgb(209, 213, 216)][CENTER]Внимательно прочитайте правила создания RolePlay биографий закрепленные в данном разделе [/COLOR][COLOR=rgb(209, 213, 216)][/COLOR][/CENTER][/FONT][/SIZE]<br><br>" +
            '[FONT=times new roman][SIZE=4][CENTER][COLOR=rgb(209, 213, 216)]Приятной игры на BLACK RUSSIA [COLOR=rgb(0, 255, 255)]TVER.[/COLOR][/CENTER][/SIZE][/FONT][/COLOR]',
            prefix: UNACCEPT_PREFIX,
            status: false,
        },
        {
            title : 'дата рождения с годом' ,
            content:
            '[COLOR=rgb(255, 0, 0)][FONT=times new roman][CENTER][SIZE=4]{{ greeting }}, уважаемый(ая) {{ user.mention }}[/FONT][/CENTER][/COLOR]<br><br>' +
            "[SIZE=4][FONT=times new roman][CENTER][COLOR=rgb(209, 213, 216)]Ваша RolePlay биография - отказана т.к дата рождения не совпадает с возрастом. [/CENTER][/COLOR]<br><br>" +
            "[COLOR=rgb(209, 213, 216)][CENTER]Внимательно прочитайте правила создания RolePlay биографий закрепленные в данном разделе [/COLOR][COLOR=rgb(209, 213, 216)][/COLOR][/CENTER][/FONT][/SIZE]<br><br>" +
            '[FONT=times new roman][SIZE=4][CENTER][COLOR=rgb(209, 213, 216)]Приятной игры на BLACK RUSSIA [COLOR=rgb(0, 255, 255)]TVER.[/COLOR][/CENTER][/SIZE][/FONT][/COLOR]',
            prefix: UNACCEPT_PREFIX,
            status: false,
        },
        {
            title : 'Нету 18 лет' ,
            content:
            '[COLOR=rgb(255, 0, 0)][FONT=times new roman][CENTER][SIZE=4]{{ greeting }}, уважаемый(ая) {{ user.mention }}[/FONT][CENTER][/COLOR]<br><br>' +
            "[SIZE=4][FONT=times new roman][CENTER][COLOR=rgb(209, 213, 216)]Ваша RolePlay биография - отказана т.к ваш персонаж должен быть совершеннолетним. [CENTER][/COLOR]<br><br>" +
            "[COLOR=rgb(209, 213, 216)][CENTER]Внимательно прочитайте правила создания RolePlay биографий закрепленные в данном разделе [/COLOR][COLOR=rgb(209, 213, 216)][/COLOR][CENTER][/FONT][/SIZE]<br><br>" +
            '[FONT=times new roman][SIZE=4][CENTER][COLOR=rgb(209, 213, 216)]Приятной игры на BLACK RUSSIA [COLOR=rgb(0, 255, 255)]TVER.[/COLOR][/SIZE][CENTER][/FONT][/COLOR]',
            prefix: UNACCEPT_PREFIX,
            status: false,
        },
        {
            title : 'семья не полнос.' ,
            content:
            '[COLOR=rgb(255, 0, 0)][CENTER][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый(ая) {{ user.mention }}[/FONT][/CENTER][/COLOR]<br><br>' +
            "[SIZE=4][FONT=times new roman][CENTER][COLOR=rgb(209, 213, 216)]Ваша RolePlay биография - отказана т.к ваша семья расписана не полностью.Вы должны полностью расписать Имя и Фамилию у каждого члена семьи[/CENTER][/COLOR]<br><br>" +
            "[COLOR=rgb(209, 213, 216)][CENTER]Внимательно прочитайте правила создания RolePlay биографий закрепленные в данном разделе [/COLOR][/CENTER][COLOR=rgb(209, 213, 216)][/COLOR][/FONT][/SIZE]<br><br>" +
            '[FONT=times new roman][SIZE=4][CENTER][COLOR=rgb(209, 213, 216)]Приятной игры на BLACK RUSSIA [COLOR=rgb(0, 255, 255)]TVER.[/COLOR][/CENTER][/SIZE][/FONT][/COLOR]',
            prefix: UNACCEPT_PREFIX,
            status: false,
        },
        {
            title : 'дата рождения не полнос.' ,
            content:
            '[COLOR=rgb(255, 0, 0)][FONT=times new roman][CENTER][SIZE=4]{{ greeting }}, уважаемый(ая) {{ user.mention }}[/FONT][/CENTER][/COLOR]<br><br>' +
            "[SIZE=4][FONT=times new roman][CENTER][COLOR=rgb(209, 213, 216)]Ваша RolePlay биография - отказана т.к ваша дата рождения расписана не полностью. [/CENTER][/COLOR]<br><br>" +
            "[COLOR=rgb(209, 213, 216)][CENTER]Внимательно прочитайте правила создания RolePlay биографий закрепленные в данном разделе [/COLOR][/CENTER][COLOR=rgb(209, 213, 216)][/COLOR][/FONT][/SIZE]<br><br>" +
            '[FONT=times new roman][SIZE=4][CENTER][COLOR=rgb(209, 213, 216)]Приятной игры на BLACK RUSSIA [COLOR=rgb(0, 255, 255)]TVER.[/COLOR][/CENTER][/SIZE][/FONT][/COLOR]',
            prefix: UNACCEPT_PREFIX,
            status: false,
        },
        {
            title: 'На доработке',
            content:
            '[COLOR=rgb(255, 0, 0)][FONT=times new roman][CENTER][SIZE=4]{{ greeting }}, уважаемый(ая) {{ user.mention }}[/FONT][/CENTER][/COLOR]<br><br>' +
            "[COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4][CENTER]В вашей RolePlay биографии недостаточно информации.[/SIZE][/FONT][/CENTER][/COLOR]<br><br>" +
            "[COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4][CENTER]Даю вам 24 часа на ее дополнение.[/SIZE][/FONT][/CENTER][/COLOR]<br><br>" +
            '[FONT=times new roman][SIZE=4][CENTER][COLOR=rgb(209, 213, 216)]Приятной игры на BLACK RUSSIA [COLOR=rgb(0, 255, 255)]TVER.[/COLOR][/CENTER][/SIZE][/FONT][/COLOR]',
            prefix: PIN_PREFIX,
            status: true,
        },
        {
            title: 'Мало инфы',
            content:
            '[COLOR=rgb(255, 0, 0)][FONT=times new roman][CENTER][SIZE=4]{{ greeting }}, уважаемый(ая) {{ user.mention }}[/FONT][/CENTER][/COLOR]<br><br>'+
            "[COLOR=rgb(209, 213, 216)][CENTER][FONT=times new roman][SIZE=4]В вашей RolePlay биографии крайне мало информации.[/CENTER]<br><br>" +
            "[COLOR=rgb(209, 213, 216)][CENTER]Внимательно прочитайте правила создания RolePlay биографий закрепленные в данном разделе.[COLOR=rgb(209, 213, 216)][/CENTER][/COLOR][/SIZE]<br><br>" +
            "[COLOR=rgb(209, 213, 216)][CENTER]Создайте новую тему, дополнив ее новой информацией.[/SIZE][/FONT][/CENTER][/COLOR]<br><br>" +
            '[FONT=times new roman][SIZE=4][CENTER][COLOR=rgb(209, 213, 216)]Приятной игры на BLACK RUSSIA [COLOR=rgb(0, 255, 255)]TVER.[/COLOR][/SIZE][/CENTER][/FONT][/COLOR]',
            prefix: UNACCEPT_PREFIX,
            status: false,
        },
    ];


    $(document).ready(() => {
        // Загрузка скрипта для обработки шаблонов
        $('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');

        // Добавление кнопок при загрузке страницы
        addButton('На рассмотрение', 'pin');
        addButton('Одобрено', 'accepted');
        addButton('Отказано', 'unaccept');
        addButton('ГА', 'Ga');
        addButton('Теху', 'Texy');
        addButton('Меню', 'selectAnswer');
        addButton('Закрыть тему', 'zakroi');

        // Поиск информации о теме
        const threadData = getThreadData();

        $('button#pin').click(() => editThreadData(PIN_PREFIX, true));
        $('button#accepted').click(() => editThreadData(ACCEPT_PREFIX, false));
        $('button#Ga').click(() => editThreadData(GA_PREFIX, true));
        $('button#unaccept').click(() => editThreadData(UNACCEPT_PREFIX, false));
        $('button#Texy').click(() => editThreadData(TEX_PREFIX, true));
        $('button#Zakrito').click(() => editThreadData(CLOSE_PREFIX, false));
        $('button#zakroi').click(() => editThreadData(NULL_PREFIX, false));

        $(`button#selectAnswer`).click(() => {
            XF.alert(buttonsMarkup(buttons), null, 'Выберите ваш ответ:');
            buttons.forEach((btn, id) => {
                if (id > 0) {
                    $(`button#answers-${id}`).click(() => pasteContent(id, threadData, true));
                }
                else {
                    $(`button#answers-${id}`).click(() => pasteContent(id, threadData, false));
                }
            });
        });
    });

    function addButton(name, id) {
        $('.button--icon--reply').before(
            `<button type="button" class="button--primary button rippleButton" id="${id}" style="border-radius: 30px; margin-right: 7px;">${name}</button>`,
        );
    }

    function buttonsMarkup(buttons) {
        return `<div class="select_answer">${buttons
            .map(
            (btn, i) =>
            `<button id="answers-${i}" class="button--primary button ` +
            `rippleButton" style="margin:4px"><span class="button-text">${btn.title}</span></button>`,
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
            editThreadData(buttons[id].prefix, buttons[id].status);
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
            6 < hours && hours <= 10
            ? 'Доброе утро'
            : 10 < hours && hours <= 18
            ? 'Добрый день'
            : 18 < hours && hours <= 6
            ? 'Добрый вечер'
            : 'Доброй ночи',
        };
    }

    function editThreadData(prefix, pin = false) {
        // Получаем заголовок темы, так как он необходим при запросе
        const threadTitle = $('.p-title-value')[0].lastChild.textContent;

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


        function moveThread(prefix, type) {
            // Получаем заголовок темы, так как он необходим при запросе
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
    }
})();