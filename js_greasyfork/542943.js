// ==UserScript==
// @name         Скрипт для Руководства || CHEREPOVETS
// @namespace    https://forum.blackrussia.online
// @version      5.23
// @description  Специально для BlackRussia || CHEREPOVETS
// @author       Yaroslav_Vladimirich
// @match        https://forum.blackrussia.online/threads/*
// @include      https://forum.blackrussia.online/threads/
// @grant        none
// @license   MIT
// @supportURL Yaroslav_Vladimirich|CHEREPOVETS
// @icon https://i.postimg.cc/ZKwZvbfd/Developer.png
// @downloadURL https://update.greasyfork.org/scripts/542943/%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%A0%D1%83%D0%BA%D0%BE%D0%B2%D0%BE%D0%B4%D1%81%D1%82%D0%B2%D0%B0%20%7C%7C%20CHEREPOVETS.user.js
// @updateURL https://update.greasyfork.org/scripts/542943/%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%A0%D1%83%D0%BA%D0%BE%D0%B2%D0%BE%D0%B4%D1%81%D1%82%D0%B2%D0%B0%20%7C%7C%20CHEREPOVETS.meta.js
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
		title: 'ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ                                ᅠ⠀             ⠀ ⠀⠀ᅠ ᅠᅠОБЖАЛОВАНИЯ    ᅠᅠ ᅠᅠ          ⠀        ⠀    ⠀      ⠀ᅠ     ᅠ ᅠ     ᅠ ᅠ ᅠ ',
        dpstyle: 'oswald: 3px;     color: #fff; background: #212428; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: 1px solid #FF0000;  width: 96%; border-radius: 15px;',
},
      {

      title: `На рассмотрении`,
        dpstyle: `oswald: 3px;     color: #FF2B2B; background: #212428; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #FF0000`,
      content:
        `Здравствуйте.<br><br>`+
        `Ваше обжалование взято на рассмотрение, мы внимательно изучим ситуацию и вынесем вердикт, ожидайте.<br><br>`+
        `Ожидайте ответа.`,
      prefix: PIN_PREFIX,
      status: true,

	},
     {
	  title: `Не по форме`,
         dpstyle: `oswald: 3px;     color: #FF2B2B; background: #212428; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #FF0000`,
	  content:
		`Здравствуйте.<br><br>`+
		`В вашем обжаловании форма подачи не соответствует установленным требованиям и правилам, что препятствует её рассмотрению.
Создайте новую тему с актуальной формой подачи:<br><br>`+
        `1. Ваш Nick_Name:<br>`+
        `2. Nick_Name администратора:<br>`+
        `3. Дата выдачи/получения наказания:<br>`+
        `4. Суть жалобы:<br>`+
        `5. Доказательство:<br><br>`+

		`Закрыто.`,
	  prefix: CLOSE_PREFIX,
	  status: false,
    },

         {
		title: 'ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ                                ᅠ⠀             ⠀ ⠀⠀ᅠ ᅠᅠОБЩЕЕ   ᅠᅠ ᅠᅠ          ⠀        ⠀    ⠀      ⠀ᅠ     ᅠ ᅠ     ᅠ ᅠ ᅠ ',
        dpstyle: 'oswald: 3px;     color: #41A85F; background: #212428; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: 1px solid #4169e2;  width: 96%; border-radius: 15px;',

    },
    {
      title: `Передать спецам`,
        dpstyle: `oswald: 3px;     color: #FF2B2B; background: #212428; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #FF0000`,
      content:
         `Здравствуйте.<br><br>`+
         `Ваша тема передана на рассмотрение Специальной Администрации.<br><br>`+
         `Ожидайте ответа.`,
      prefix: SPECIAL_PREFIX,
      status: true,
    },
    {
	  title: `Передать ГА`,
        dpstyle: `oswald: 3px;     color: #FF0000; background: #212428; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #FF0000`,
	  content:
		`Здравствуйте.<br><br>`+
        `Ваша тема передана на рассмотрение Главному Администратору.<br><br>`+
        `Ожидайте ответа.`,
      prefix: GA_PREFIX,
	  status: true,
    },
    {
	  title: `Передать ЗГА`,
        dpstyle: `oswald: 3px;     color: #FF0000; background: #212428; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #FF0000`,
	  content:
		`Здравствуйте.<br><br>`+
        `Ваша тема передана на рассмотрение Заместителю Главного Администратора.<br><br>`+
        `Ожидайте ответа.`,
      prefix: GA_PREFIX,
	  status: true,
    },
     {
	  title: `Предыдущая тема уже на рассмотрении`,
        dpstyle: `oswald: 3px;     color: #FF2B2B; background: #212428; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #FF0000`,
	  content:
		`Здравствуйте.<br><br>`+
		`Ваша предыдущая тема находится на рассмотрении. Ожидайте ответа.<br><br>`+
		`Закрыто.`,
	  prefix: CLOSE_PREFIX,
	  status: false,
    },
    {
	  title: `Док-ва из соц. сетей`,
        dpstyle: `oswald: 3px;     color: #FF2B2B; background: #212428; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #FF0000`,
	  content:
		`Здравствуйте.<br><br>`+
		`Доказательства должны быть загружены на фото/видеохостинги, такие как Imgur, Япикс или YouTube.<br><br>`+
		`Закрыто.`,
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
    {
	  title: `Нет окна бана`,
        dpstyle: `oswald: 3px;     color: #FF2B2B; background: #212428; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #FF0000`,
	  content:
		`Здравствуйте.<br><br>`+
		`В доказательства необходимо прикрепить окно блокировки.<br><br>`+
		`Закрыто.`,
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
    {
	  title: `Нерабочие док-ва`,
        dpstyle: `oswald: 3px;     color: #FF2B2B; background: #212428; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #FF0000`,
	  content:
		`Здравствуйте.<br><br>`+
		`В вашей теме прикреплены нерабочие доказательства. Загрузите их повторно на фото/видео хостинг и создайте новую тему.<br><br>`+
		`Закрыто.`,
	  prefix: CLOSE_PREFIX,
	  status: false,
    },

         {
		title: 'ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ                                ᅠ⠀             ⠀ ⠀⠀ᅠ ᅠᅠЖАЛОБЫ НА АДМИНИСТРАЦИЮ    ᅠᅠ ᅠᅠ          ⠀        ⠀    ⠀      ⠀ᅠ     ᅠ ᅠ     ᅠ ᅠ ᅠ ',
        dpstyle: 'oswald: 3px;     color: #fff; background: #212428; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: 1px solid #4169e2;  width: 96%; border-radius: 15px;',

    },
     {
	  title: `На рассмотрении`,
         dpstyle: `oswald: 3px;     color: #FF2B2B; background: #212428; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #FF0000`,
	  content:
         `Здравствуйте.<br><br>`+
         `Ваша жалоба взята на рассмотрение, мы внимательно изучим ситуацию и вынесем вердикт.<br><br>`+
         `Ожидайте ответа в данной теме.`,
	  prefix: PIN_PREFIX,
	  status: true,
	},
     {
	  title: `Не по форме`,
         dpstyle: `oswald: 3px;     color: #FF2B2B; background: #212428; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #FF0000`,
	  content:
		`Здравствуйте.<br><br>`+
		`В вашей жалобе форма подачи не соответствует установленным требованиям и правилам, что препятствует её рассмотрению.
Создайте новую жалобу с актуальной формой подачи:<br><br>`+
        `1. Ваш Nick_Name:<br>`+
        `2. Nick_Name администратора:<br>`+
        `3. Дата выдачи/получения наказания:<br>`+
        `4. Суть жалобы:<br>`+
        `5. Доказательство:<br><br>`+

		`Закрыто.`,
	  prefix: CLOSE_PREFIX,
	  status: false,
     },
     {
      title: `Дублирование`,
        dpstyle: `oswald: 3px;     color: #FF2B2B; background: #212428; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #FF0000`,
      content:
         `Здравствуйте.<br><br>`+
         `Вам был дан в предыдущей теме. Если вы продолжите создавать дубликаты, ваш форумный аккаунт будет заблокирован.<br><br>`+
         `Закрыто.`,
	  prefix: CLOSE_PREFIX,
      status: false,
	},
    {
	  title: `Неадекватка в ЖБ`,
         dpstyle: `oswald: 3px;     color: #FF2B2B; background: #212428; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #FF0000`,
	  content:
		`Здравствуйте.<br><br>`+
		`В вашей жалобе присутствует неадекватное поведение/общение. Жалоба рассмотрению не подлежит.<br><br>`+
		`Закрыто.`,
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
    {
	  title: `Прошло 48 часов`,
        dpstyle: `oswald: 3px;     color: #FF2B2B; background: #212428; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #FF0000`,
	  content:
		`Здравствуйте.<br><br>`+
		`С момента выдачи наказания прошло более 48-ми часов. Жалоба рассмотрению не подлежит.<br><br>`+
		`Закрыто.`,
	  prefix: CLOSE_PREFIX,
	  status: false,
    },
];
     $(document).ready(() => {
        // Загрузка скрипта для обработки шаблонов
        $(`body`).append(`<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>`);

        // Добавление кнопок при загрузке страницы

        addButton(`На рассмотрение`, `pin`, `border-radius: 13px; margin-right: 5px; border: 1px solid #4169e2; border-color: rgba(255, 255, 0, 0.5);`);
        addButton(`Одобрено`, `accepted`, `border-radius: 13px; margin-right: 5px; border: 1px solid #4169e2; border-color: rgba(0, 255, 0, 0.5);`);
        addButton(`Отказано`, `unaccept`, `border-radius: 13px; margin-right: 5px; border: 1px solid #4169e2; border-color: rgba(255, 0, 0, 0.5);`);
        addButton(`Закрыто`, `closed`, `border-radius: 13px; margin-right: 5px; border: 1px solid #4169e2; border-color: rgba(255, 0, 0, 0.5);`);
        addAnswers();



        // Поиск информации о теме

        const threadData = getThreadData();

        $(`button#pin`).click(() => editThreadData(PIN_PREFIX, true));
        $(`button#accepted`).click(() => editThreadData(ACCEPT_PREFIX, false));
        $(`button#unaccept`).click(() => editThreadData(UNACCEPT_PREFIX, false));
        $(`button#closed`).click(() => editThreadData(CLOSE_PREFIX, false));

        $(`button#admin-otvet`).click(() => {
            XF.alert(buttonsMarkup(buttons), null, `sex ответы`);
            buttons.forEach((btn, id) => {
                if (id > 6) {
                    $(`button#answers-${id}`).click(() => pasteContent(id, threadData, true));
                } else {
                    $(`button#answers-${id}`).click(() => pasteContent(id, threadData, false));
                }
            });
        });

        $(`button#igroki-otvet`).click(() => {
            XF.alert(buttonsMarkup(buttons2), null, `sex ответы`);
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
            ? `Здравствуйте`
            : 11 < hours && hours <= 15
                ? `Здравствуйте`
                : 15 < hours && hours <= 21
                    ? `Здравствуйте`
                    : `Здравствуйте`

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