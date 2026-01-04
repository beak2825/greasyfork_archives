(function() {
    'use strict';

    // Your code here...
})();// ==UserScript==
// @name         тестеровочный||
// @namespace    https://forum.blackrussia.online
// @version      3.1.5
// @description  Специально для BlackRussia ||
// @author       Daniil Korobka
// @match        https://forum.blackrussia.online/threads/*
// @include      https://forum.blackrussia.online/threads/
// @icon         
// @grant        none
// @license      none
// @supportURL   https://vk.com/danmak
// @downloadURL https://update.greasyfork.org/scripts/521306/%D1%82%D0%B5%D1%81%D1%82%D0%B5%D1%80%D0%BE%D0%B2%D0%BE%D1%87%D0%BD%D1%8B%D0%B9%7C%7C.user.js
// @updateURL https://update.greasyfork.org/scripts/521306/%D1%82%D0%B5%D1%81%D1%82%D0%B5%D1%80%D0%BE%D0%B2%D0%BE%D1%87%D0%BD%D1%8B%D0%B9%7C%7C.meta.js
// ==/UserScript==

(async function () {
    `use strict`;
    const UNACCEPT_PREFIX = 4; // Префикс "Отказано"
    const ACCEPT_PREFIX = 8; // Префикс "Одобрено"
    const PIN_PREFIX = 2; // Префикс "На рассмотрении"
    const COMMAND_PREFIX = 10; // Префикс "Команде проекта"
    const WATCHED_PREFIX = 9;
    const CLOSE_PREFIX = 7; // Префикс "Закрыто"
    const SPECIAL_PREFIX = 11; // Префикс "Специальному админитсратору"
    const GA_PREFIX = 12; // Префикс "Главному администратору"
    const TECH_PREFIX = 13; // Префикс "Техническому специалисту"
    const data = await getThreadData(),
          greeting = data.greeting,
          user = data.user;
    const buttons = [
     {
      title: `____________________________________________________ПРИВЕТСТВИЕ____________________________________________________`,
      dpstyle: `oswald: 3px;     color: #ffff00; background: #ffffee; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #FF0000`,
      content:
         `[CENTER][FONT=verdana]${greeting}, уважаемый ${user.mention}.<br><br>`,
     },
    {
	   title: `---------------------------------------------------> Раздел Жалоб на администрацию <---------------------------------------------------`,
       dpstyle: `oswald: 3px;     color: #5555ff; background: #eeeeff; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #FF0000`,
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
        $(`body`).append(`<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>`);

        // Добавление кнопок при загрузке страницы

        addButton(`На рассмотрение`, `pin`, `border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255,165,0, 0.5);`);
        addButton(`Одобрено`, `accepted`, `border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 251, 152, 0.5);`);
        addButton(`Отказано`, `unaccept`, `border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5);`);
        addButton(`Закрыто`, `closed`, `border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5);`);
        addAnswers();

        // Поиск информации о теме

        const threadData = getThreadData();

        $(`button#pin`).click(() => editThreadData(PIN_PREFIX, true));
        $(`button#accepted`).click(() => editThreadData(ACCEPT_PREFIX, false));
        $(`button#unaccept`).click(() => editThreadData(UNACCEPT_PREFIX, false));
        $(`button#closed`).click(() => editThreadData(CLOSE_PREFIX, false));

        $(`button#admin-otvet`).click(() => {
            XF.alert(buttonsMarkup(buttons), null, `бродяга, выбери ответ`);
            buttons.forEach((btn, id) => {
                if (id > 6) {
                    $(`button#answers-${id}`).click(() => pasteContent(id, threadData, true));
                } else {
                    $(`button#answers-${id}`).click(() => pasteContent(id, threadData, false));
                }
            });
        });

        $(`button#igroki-otvet`).click(() => {
            XF.alert(buttonsMarkup(buttons2), null, `бродяга, выбери ответ`);
            buttons2.forEach((btn, id) => {
                if (id > 15) {
                    $(`button#answers-${id}`).click(() => pasteContent2(id, threadData, true));
                } else {
                    $(`button#answers-${id}`).click(() => pasteContent2(id, threadData, false));
                }
            });
        });
    });

    function addButton(name, id, style) {
        $(`.button--icon--reply`).before(
            `<button type="button" class="button--primary button rippleButton" id="${id}" style="${style}">${name}</button>`,
        );
        if(id === 21) {
            button.hide()
        }
    }
        function addAnswers() {
        $(`.button--icon--reply`).after(`<button type="button" class="button--cta uix_quickReply--button button button--icon button--icon--write rippleButton" id="admin-otvet" style="oswald: 4px; margin-left: 5px; margin-top: 10px; border-radius: 13px;">ОТВЕТЫ</button>`,);
    }

    function buttonsMarkup(buttons) {
        return `<div class="select_answer">${buttons
            .map(
            (btn, i) =>
            `<button id="answers-${i}" class="button--primary button ` +
            `rippleButton" style="margin:4px; ${btn.dpstyle}"><span class="button-text">${btn.title}</span></button>`,
        )
            .join('')}</div>`;
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
    })();