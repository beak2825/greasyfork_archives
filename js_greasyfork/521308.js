// ==UserScript==
// @name         тестеровочный
// @namespace    https://greasyfork.org/ru/users/1120519-danik-pryanik
// @version      9.999
// @description  Скрипт для упрощения работы ГА/ЗГА/Кураторов администрации.
// @author       --------
// @match        https://forum.blackrussia.online/threads/*
// @include      https://forum.blackrussia.online/threads/
// @icon         https://icons.iconarchive.com/icons/aha-soft/iron-man/48/Ironman-Mask-3-Old-icon.png
// @grant        none
// @license 	 none
// @downloadURL https://update.greasyfork.org/scripts/521308/%D1%82%D0%B5%D1%81%D1%82%D0%B5%D1%80%D0%BE%D0%B2%D0%BE%D1%87%D0%BD%D1%8B%D0%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/521308/%D1%82%D0%B5%D1%81%D1%82%D0%B5%D1%80%D0%BE%D0%B2%D0%BE%D1%87%D0%BD%D1%8B%D0%B9.meta.js
// ==/UserScript==

(function () {
    'use strict';
    const UNACCEPT_PREFIX = 4; // Префикс "Отказано"
    const ACCEPT_PREFIX = 8; // Префикс "Одобрено"
    const RESHENO_PREFIX = 6; // Префикс "Решено"
    const PIN_PREFIX = 2; // Префикс "На рассмотрении"
    const GA_PREFIX = 12; // Префикс "Главному Администратору"
    const COMMAND_PREFIX = 10; // Префикс "Команде Проекта"
    const WATCHED_PREFIX = 9; // Префикс "Рассмотрено"
    const CLOSE_PREFIX = 7; // Префикс "Закрыто"
    const SPECIAL_PREFIX = 11; // Префикс "Специальному Администратору"
    const buttons = [
        {
            title: '|╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴> Раздел Жалоб <╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴|',
        },
        {
             },
    {
	  title: `Будет проведена беседа`,
        dpstyle: `oswald: 3px;     color: #54FF9F; background: #212428; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #FF0000`,
	  content:
		`[CENTER][I][COLOR=rgb(255, 0, 0)]Здравствуйте, уважаемый игрок![/COLOR][/I].<br><br>`+
        `[IMG]https://i.postimg.cc/3wn2PwG6/M68I9I3.png[/IMG].<br><br>`+
        `[I]С администратором будет проведена беседа, спасибо за обращение.<br><br>`+
		`[COLOR=rgb(204, 204, 204)]Одобрено. Закрыто.[/COLOR][/I][/CENTER]`,
	  prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
	  title: `Наказание выдано верно`,
        dpstyle: `oswald: 3px;     color: #54FF9F; background: #212428; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #FF0000`,
	  content:
		`[CENTER][I][COLOR=rgb(255, 0, 0)]Здравствуйте, уважаемый игрок![/COLOR][/I].<br><br>`+
        `[IMG]https://i.postimg.cc/3wn2PwG6/M68I9I3.png[/IMG].<br><br>`+
        `[I]Администратор предоставил доказательства, выношу вердикт что наказание выдано верно.<br><br>`+
		`[COLOR=rgb(204, 204, 204)]Отказано. Закрыто.[/COLOR][/I][/CENTER]`,
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
	{
      title: `Руководсву Сервера`,
        dpstyle: `oswald: 3px;     color: #54FF9F; background: #212428; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #FF0000`,
	  content:
		`[CENTER][I][COLOR=rgb(255, 0, 0)]Здравствуйте, уважаемый игрок![/COLOR][/I].<br><br>`+
        `[IMG]https://i.postimg.cc/3wn2PwG6/M68I9I3.png[/IMG].<br><br>`+
        `[I]Ваша жалоба передана на рассмотрение руководству сервера.<br><br>`+
		`[COLOR=rgb(204, 204, 204)]Ожидайте ответа, просьба не создавать копии данной темы.[/COLOR][/I][/CENTER]`,
	  prefix: PIN_PREFIX,
	  status: false,
    },
     {
	  title: `На рассмотрений (док-ва)`,
        dpstyle: `oswald: 3px;     color: #54FF9F; background: #212428; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #FF0000`,
	  content:
		`[CENTER][I][COLOR=rgb(255, 0, 0)]Здравствуйте, уважаемый игрок![/COLOR][/I].<br><br>`+
        `[IMG]https://i.postimg.cc/3wn2PwG6/M68I9I3.png[/IMG].<br><br>`+
        `[I]Запрошу доказательства у администратора, Ожидайте ответа.<br><br>`+
		`[COLOR=rgb(204, 204, 204)]На рассмотрении.[/COLOR][/I][/CENTER]`,
	  prefix: PIN_PREFIX,
	  status: false,
     },
     {
      title: `Не по форме`,
        dpstyle: `oswald: 3px;     color: #54FF9F; background: #212428; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #FF0000`,
	  content:
		`[CENTER][I][COLOR=rgb(255, 0, 0)]Здравствуйте, уважаемый игрок![/COLOR][/I].<br><br>`+
        `[IMG]https://i.postimg.cc/3wn2PwG6/M68I9I3.png[/IMG].<br><br>`+
        `[I]Ваша жалоба составлена не по форме, рассмотрению не подлежит.<br><br>`+
		`[COLOR=rgb(204, 204, 204)]Отказано. Закрыто[/COLOR][/I][/CENTER]`,
	  prefix: CLOSE_PREFIX,
	  status: false,
     },
     {
      title: `Прошло 72 часа`,
        dpstyle: `oswald: 3px;     color: #54FF9F; background: #212428; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #FF0000`,
	  content:
		`[CENTER][I][COLOR=rgb(255, 0, 0)]Здравствуйте, уважаемый игрок![/COLOR][/I].<br><br>`+
        `[IMG]https://i.postimg.cc/3wn2PwG6/M68I9I3.png[/IMG].<br><br>`+
        `[I]С момента выдачи наказания прошло 72 часа, обратитесь в раздел обжалования.<br><br>`+
		`[COLOR=rgb(204, 204, 204)]Закрыто.[/COLOR][/I][/CENTER]`,
	  prefix: CLOSE_PREFIX,
	  status: false,
         },
    ];

    $(document).ready(() => {
        // Загрузка скрипта для обработки шаблонов
        $('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');

        // Добавление кнопок при загрузке страницы
        addButton('Меню', 'selectAnswer');
        addButton('Одобрить', 'accepted');
        addButton('Отказать', 'unaccept');
        addButton('На рассмотрение', 'pin');
        addButton('Рассмотрено', 'watched');
        addButton('Закрыть', 'closed');
        addButton('КП', 'teamProject');
        addButton ('Спецу', 'specialAdmin');
        addButton ('ГА', 'mainAdmin');


        // Поиск информации о теме
        const threadData = getThreadData();

        $('button#pin').click(() => editThreadData(PIN_PREFIX, true));
        $('button#accepted').click(() => editThreadData(ACCEPT_PREFIX, false));
        $(`button#teamProject`).click(() => editThreadData(COMMAND_PREFIX, true));
        $(`button#watched`).click(() => editThreadData(WATCHED_PREFIX, false));
        $(`button#unaccept`).click(() => editThreadData(UNACCEPT_PREFIX, false));
        $(`button#mainAdmin`).click(() => editThreadData(GA_PREFIX, true));

        $(`button#specialAdmin`).click(() => editThreadData(SPECIAL_PREFIX, true));

        $('button#unaccept').click(() => editThreadData(UNACCEPT_PREFIX, false));

        $(`button#selectAnswer`).click(() => {
            XF.alert(buttonsMarkup(buttons), null, 'Выберите ответ:');
            buttons.forEach((btn, id) => {
                if(id > 1) {
                    $(`button#answers-${id}`).click(() => pasteContent(id, threadData, true));
                } else {
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
            `rippleButton" style="margin:5px"><span class="button-text">${btn.title}</span></button>`,
        )
            .join('')}</div>`;
    }

    function pasteContent(id, data = {}, send = false) {
        const template = Handlebars.compile(buttons[id].content);
        if ($('.fr-element.fr-view p').text() === '') $('.fr-element.fr-view p').empty();

        $('span.fr-placeholder').empty();
        $('div.fr-element.fr-view p').append(template(data));
        $('a.overlay-titleCloser').trigger('click');

        if(send == true){
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
    }

    function getFormData(data) {
        const formData = new FormData();
        Object.entries(data).forEach(i => formData.append(i[0], i[1]));
        return formData;
    }
})();