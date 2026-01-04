// ==UserScript==
// @name         Скрипт Для КФ.
// @namespace    https://forum.blackrussia.online
// @version      1.1
// @description  Создано для проверки РП биографий, ситуаций, организаций
// @author       code: SPECTER text: ника
// @match       *://*.forum.blackrussia.online/*
// @include      https://forum.blackrussia.online/index.php?threads/
// @grant        none
// @license    MIT
// @icon https://icons.iconarchive.com/icons/aha-soft/iron-man/48/Ironman-Mask-3-Old-icon.png
// @downloadURL https://update.greasyfork.org/scripts/478468/%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%94%D0%BB%D1%8F%20%D0%9A%D0%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/478468/%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%94%D0%BB%D1%8F%20%D0%9A%D0%A4.meta.js
// ==/UserScript==


(async function () {
    `use strict`;
    const UNACCEPT_PREFIX = 4; // Prefix that will be set when thread closes
  const ACCEPT_PREFIX = 8; // Prefix that will be set when thread accepted
  const PIN_PREFIX = 2; // Prefix that will be set when thread pins
  const COMMAND_PREFIX = 10; // Prefix that will be set when thread send to project team
  const WATCHED_PREFIX = 9;
  const CLOSE_PREFIX = 7;
  const SPECADM_PREFIX = 11;
  const DECIDED_PREFIX = 6;
  const MAINADM_PREFIX = 12;
  const TECHADM_PREFIX = 13;
  const CHECKED_PREFIX = 9
    const data = await getThreadData(),
          greeting = data.greeting,
          user = data.user;
    const buttons = [

               {
        title: 'Приветствие',
        content:
        '[CENTER][FONT=verdana][COLOR=rgb(247, 218, 100)]Доброго времени суток.[/COLOR]<br>',
        },
        {
	  title: 'Не по теме (Подходит под ВСЕ разделы)',
	  content:
            '[CENTER][FONT=verdana][COLOR=rgb(247, 218, 100)]Доброго времени суток.[/COLOR]<br><br>' +
            "[CENTER]Ваша тема не относится к данному разделу.<br><br>" +
            "[CENTER][COLOR=rgb(235, 107, 86)][FONT=verdana]Закрыто.[/FONT][/COLOR][/CENTER]" ,
            prefix: CLOSE_PREFIX,
            status: false,
        },
        {
	  title: 'Повтор темы (Подходит под ВСЕ разделы)',
	  content:
            '[CENTER][FONT=verdana][COLOR=rgb(247, 218, 100)]Доброго времени суток.[/COLOR]<br><br>' +
            "[CENTER]Не нужно создавать темы повторно, для рассмотрения необходима только одна.<br><br>" +
            "[CENTER][COLOR=rgb(235, 107, 86)][FONT=verdana]Закрыто.[/FONT][/COLOR][/CENTER]" ,
            prefix: CLOSE_PREFIX,
            status: false,
        },
        {
        title: '________________________________________РП биографии________________________________________',
        },
        {
            title: 'Биография одобрена',
            content:
            '[CENTER][FONT=verdana][COLOR=rgb(247, 218, 100)]Доброго времени суток.[/COLOR]<br><br>' +
            "[CENTER]Ваша биография соответствует всем требованиям.<br><br>" +
            "[CENTER][FONT=verdana][COLOR=rgb(97, 189, 109)]Одоберно[/COLOR], приятной игры на сервере [COLOR=rgb(84, 172, 210)]SPB[/COLOR].[/FONT][/CENTER]",
            prefix: ACCEPT_PREFIX,
            status: false,
        },
        {
            title: 'Биография на доработке',
            content:
            '[CENTER][FONT=verdana][COLOR=rgb(247, 218, 100)]Доброго времени суток.[/COLOR]<br><br>' +
            "[CENTER]Ваша биография отправляется на доработку. Распишу ниже, что вам нужно исправить.<br><br>" +
            "[CENTER]На доработку биографии даются сутки.<br><br>" +
            "[CENTER][COLOR=rgb(251, 160, 38)][FONT=verdana]На рассмотрении.[/FONT][/COLOR][/CENTER]",
            prefix: PIN_PREFIX,
            status: true,
        },
        {
	  title: 'Биография скопирована',
	  content:
            '[CENTER][FONT=verdana][COLOR=rgb(247, 218, 100)]Доброго времени суток.[/COLOR]<br><br>' +
            "[CENTER]Ваша биография скопирована у другого игрока.<br><br>" +
            "[CENTER][COLOR=rgb(235, 107, 86)][FONT=verdana]Отказано, закрыто.[/FONT][/COLOR][/CENTER]" ,
            prefix: UNACCEPT_PREFIX,
            status: false,
        },
        {
	  title: 'Биография не по форме',
	  content:
            '[CENTER][FONT=verdana][COLOR=rgb(247, 218, 100)]Доброго времени суток.[/COLOR]<br><br>' +
            "[CENTER]Ваша биография составлена не по форме.<br><br>" +
            "[CENTER][FONT=verdana]Ознакомьтесь с [URL='https://forum.blackrussia.online/threads/spb-%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%BE%D1%81%D1%82%D0%B0%D0%B2%D0%BB%D0%B5%D0%BD%D0%B8%D1%8F-%D0%A0%D0%9F-%D0%91%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8.1873455/'][U][COLOR=rgb(84, 172, 210)]Формой составления биографии[/COLOR][/U][/URL], на которую вы можете перейти нажав на текст.[/FONT][/CENTER]<br><br>" +
            "[CENTER][COLOR=rgb(235, 107, 86)][FONT=verdana]Отказано, закрыто.[/FONT][/COLOR][/CENTER]" ,
            prefix: UNACCEPT_PREFIX,
            status: false,
        },
        {
      title: 'В биографии мало информации',
	  content:
            '[CENTER][FONT=verdana][COLOR=rgb(247, 218, 100)]Доброго времени суток.[/COLOR]<br><br>' +
            "[CENTER]В вашей биографии содержится мало информации. Сделайте ее заполнение более полным и ясным.<br><br>" +
            "[CENTER][COLOR=rgb(235, 107, 86)][FONT=verdana]Отказано, закрыто.[/FONT][/COLOR][/CENTER]" ,
            prefix: UNACCEPT_PREFIX,
            status: false,
        },
        {
	  title: 'Возраст ошибочный',
	  content:
            '[CENTER][FONT=verdana][COLOR=rgb(247, 218, 100)]Доброго времени суток.[/COLOR]<br><br>' +
            "[CENTER]В вашей биографии неверно указан возраст. Либо он не соответствует дате рождения, либо в самой биографии он не соответвествует тому, который указан выше.<br><br>" +
            "[CENTER][COLOR=rgb(235, 107, 86)][FONT=verdana]Отказано, закрыто.[/FONT][/COLOR][/CENTER]" ,
            prefix: UNACCEPT_PREFIX,
            status: false,
        },
        {
	  title: 'Биография неграмотна или нелогична',
	  content:
            '[CENTER][FONT=verdana][COLOR=rgb(247, 218, 100)]Доброго времени суток.[/COLOR]<br><br>' +
            "[CENTER]Текст вашей биографии содержит логические и/или грамматические ошибки, на которые невозможно закрыть глаза. Перепишите вашу биографию, допустив минимальное количество ошибок.<br><br>" +
            "[CENTER][COLOR=rgb(235, 107, 86)][FONT=verdana]Отказано, закрыто.[/FONT][/COLOR][/CENTER]" ,
            prefix: UNACCEPT_PREFIX,
            status: false,
        },
        {
	  title: 'Заголовок не по форме',
      content:
            '[CENTER][FONT=verdana][COLOR=rgb(247, 218, 100)]Доброго времени суток.[/COLOR]<br><br>' +
            "[CENTER]Заголовок вашей биография составлен не по форме.<br><br>" +
            "[CENTER][FONT=verdana]Ознакомьтесь с [URL='https://forum.blackrussia.online/threads/spb-%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%BE%D1%81%D1%82%D0%B0%D0%B2%D0%BB%D0%B5%D0%BD%D0%B8%D1%8F-%D0%A0%D0%9F-%D0%91%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8.1873455/'][U][COLOR=rgb(84, 172, 210)]Формой составления биографии[/COLOR][/U][/URL], на которую вы можете перейти нажав на текст.[/FONT][/CENTER]<br><br>" +
            "[CENTER][COLOR=rgb(235, 107, 86)][FONT=verdana]Отказано, закрыто.[/FONT][/COLOR][/CENTER]" ,
            prefix: UNACCEPT_PREFIX,
            status: false,
        },
        {

        title: '________________________________________РП Ситуации________________________________________',
        },
        {
            title: 'Ситуация одобрена',
            content:
            '[CENTER][FONT=verdana][COLOR=rgb(247, 218, 100)]Доброго времени суток.[/COLOR]<br><br>' +
            "[CENTER]Ваша ситуация соответствует всем требованиям.<br><br>" +
            "[CENTER][FONT=verdana][COLOR=rgb(97, 189, 109)]Одоберно[/COLOR], приятной игры на сервере [COLOR=rgb(84, 172, 210)]SPB[/COLOR].[/FONT][/CENTER]",
            prefix: ACCEPT_PREFIX,
            status: false,
        },
        {
            title: 'Ситуация на доработке',
            content:
            '[CENTER][FONT=verdana][COLOR=rgb(247, 218, 100)]Доброго времени суток.[/COLOR]<br><br>' +
            "[CENTER]Ваша ситуация отправляется на доработку. Распишу ниже, что вам нужно исправить.<br><br>" +
            "[CENTER]На доработку биографии даются сутки.<br><br>" +
            "[CENTER][COLOR=rgb(251, 160, 38)][FONT=verdana]На рассмотрении.[/FONT][/COLOR][/CENTER]",
            prefix: PIN_PREFIX,
            status: true,
        },
        {
	  title: 'Ситуация или видео скопированы',
	  content:
            '[CENTER][FONT=verdana][COLOR=rgb(247, 218, 100)]Доброго времени суток.[/COLOR]<br><br>' +
            "[CENTER]Ваша ситуация и/или прилагаемые к ней видеоролики/скриншоты полностью скопированы у другого игрока.<br><br>" +
            "[CENTER][COLOR=rgb(235, 107, 86)][FONT=verdana]Отказано, закрыто.[/FONT][/COLOR][/CENTER]" ,
            prefix: UNACCEPT_PREFIX,
            status: false,
        },
        {
	  title: 'Ситуация не по форме',
	  content:
            '[CENTER][FONT=verdana][COLOR=rgb(247, 218, 100)]Доброго времени суток.[/COLOR]<br><br>' +
            "[CENTER]Ваша биография составлена не по форме.<br><br>" +
            "[CENTER][FONT=verdana]Ознакомьтесь с [URL='https://forum.blackrussia.online/threads/spb-%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BD%D0%B0%D0%BF%D0%B8%D1%81%D0%B0%D0%BD%D0%B8%D1%8F-roleplay-%D1%81%D0%B8%D1%82%D1%83%D0%B0%D1%86%D0%B8%D0%B8.6378831/'][U][COLOR=rgb(84, 172, 210)]Правилами написания ситуации[/COLOR][/U][/URL], на которую вы можете перейти нажав на текст.[/FONT][/CENTER]<br><br>" +
            "[CENTER][COLOR=rgb(235, 107, 86)][FONT=verdana]Отказано, закрыто.[/FONT][/COLOR][/CENTER]" ,
            prefix: UNACCEPT_PREFIX,
            status: false,
        },
        {
      title: 'Содеражние ситуации не совпадает с видео',
	  content:
            '[CENTER][FONT=verdana][COLOR=rgb(247, 218, 100)]Доброго времени суток.[/COLOR]<br><br>' +
            '[CENTER]В вашей ситуации пункт "Краткий пересказ и пояснения по RP ситуации" не совпадает с тем, что изображено на видеоролике.<br><br>' +
            "[CENTER][COLOR=rgb(235, 107, 86)][FONT=verdana]Отказано, закрыто.[/FONT][/COLOR][/CENTER]" ,
            prefix: UNACCEPT_PREFIX,
            status: false,
        },
        {

        title: '________________________________________РП Организации________________________________________',
        },
        {
	  title: 'Организация одобрена',
            content:
            '[CENTER][FONT=verdana][COLOR=rgb(247, 218, 100)]Доброго времени суток.[/COLOR]<br><br>' +
            "[CENTER]Ваша организация соответствует всем требованиям.<br><br>" +
            "[CENTER][FONT=verdana][COLOR=rgb(97, 189, 109)]Одоберно[/COLOR], приятной игры на сервере [COLOR=rgb(84, 172, 210)]SPB[/COLOR].[/FONT][/CENTER]",
            prefix: ACCEPT_PREFIX,
            status: false,
        },
        {
            title: 'Организация на доработке',
            content:
            '[CENTER][FONT=verdana][COLOR=rgb(247, 218, 100)]Доброго времени суток.[/COLOR]<br><br>' +
            "[CENTER]Ваша организация отправляется на доработку. Распишу ниже, что вам нужно исправить.<br><br>" +
            "[CENTER]На доработку биографии даются сутки.<br><br>" +
            "[CENTER][COLOR=rgb(251, 160, 38)][FONT=verdana]На рассмотрении.[/FONT][/COLOR][/CENTER]",
            prefix: PIN_PREFIX,
            status: true,
        },
        {
	  title: 'Организация неграмотна или нелогична',
	  content:
            '[CENTER][FONT=verdana][COLOR=rgb(247, 218, 100)]Доброго времени суток.[/COLOR]<br><br>' +
            "[CENTER]Текст вашей биографии содержит логические и/или грамматические ошибки, на которые невозможно закрыть глаза. Перепишите вашу биографию, допустив минимальное количество ошибок.<br><br>" +
            "[CENTER][COLOR=rgb(235, 107, 86)][FONT=verdana]Отказано, закрыто.[/FONT][/COLOR][/CENTER]" ,
            prefix: UNACCEPT_PREFIX,
            status: false,
        },
        {
	  title: 'Заполнение не по форме',
      content:
            '[CENTER][FONT=verdana][COLOR=rgb(247, 218, 100)]Доброго времени суток.[/COLOR]<br><br>' +
            "[CENTER]Заголовок вашей биография составлен не по форме.<br><br>" +
            "[CENTER][FONT=verdana]Ознакомьтесь с [URL='https://forum.blackrussia.online/threads/spb-%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%BE%D0%B7%D0%B4%D0%B0%D0%BD%D0%B8%D1%8F-%D0%BD%D0%B5%D0%BE%D1%84%D0%B8%D1%86%D0%B8%D0%B0%D0%BB%D1%8C%D0%BD%D1%8B%D1%85-rp-%D0%BE%D1%80%D0%B3%D0%B0%D0%BD%D0%B8%D0%B7%D0%B0%D1%86%D0%B8%D0%B9.6388114/'][U][COLOR=rgb(84, 172, 210)]Правилами создания неофициальных организаций[/COLOR][/U][/URL], на которую вы можете перейти нажав на текст.[/FONT][/CENTER]<br><br>" +
            "[CENTER][COLOR=rgb(235, 107, 86)][FONT=verdana]Отказано, закрыто.[/FONT][/COLOR][/CENTER]" ,
            prefix: UNACCEPT_PREFIX,
            status: false,
        },
        ];


    $(document).ready(() => {
        // Загрузка скрипта для обработки шаблонов
        $(`body`).append(`<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>`);

        // Добавление кнопок при загрузке страницы
        addButton(`Ответы`, `selectAnswer`)




        // Поиск информации о теме
        const threadData = getThreadData();

       $(`button#unaccept`).click(() => editThreadData(UNACCEPT_PREFIX, false));
$(`button#pin`).click(() => editThreadData(PIN_PREFIX, true));
$(`button#accepted`).click(() => editThreadData(ACCEPT_PREFIX, false));
$(`button#teamProject`).click(() => editThreadData(COMMAND_PREFIX, true));
$(`button#specadm`).click(() => editThreadData(SPECADM_PREFIX, true));
$(`button#mainadm`).click(() => editThreadData(MAINADM_PREFIX, true));
$(`button#watched`).click(() => editThreadData(WATCHED_PREFIX, false));
$(`button#decided`).click(() => editThreadData(DECIDED_PREFIX, false));
$(`button#closed`).click(() => editThreadData(CLOSE_PREFIX, false));
$(`button#techspec`).click(() => editThreadData(TECHADM_PREFIX, true));
        $(`button#checked`).click(() => editThreadData(CHECKED_PREFIX, false));
        $(`button#statusTheme`).click(() => {
            const threadTitle = $(`.p-title-value`)[0].lastChild.textContent;

            let status = threadData.theme_status
            if ( status == false) status = 1
            else status = 0

            fetch(`${document.URL}edit`, {
                method: `POST`,
                body: getFormData({
                    title: threadTitle,
                    discussion_open: status,
                    _xfToken: XF.config.csrf,
                    _xfRequestUri: document.URL.split(XF.config.url.fullBase)[1],
                    _xfWithData: 1,
                    _xfResponseType: `json`,
                }),
            }).then(() => location.reload());
        });

        $(`button#selectAnswer`).click(() => {
            XF.alert(buttonsMarkup(buttons), null, `Select an answer:`);
            buttons.forEach((btn, id) => {
                if (id >1) {
                    $(`button#answers-${id}`).click(() => pasteContent(id, threadData, true));
                } else {
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

    $('#input').focus(function() {
        $(this).setCursorPosition(4);
      });

    async function getThreadData() {
        const authorID = $(`a.username`)[0].attributes[`data-user-id`].nodeValue;
        const authorName = $(`a.username`).html();
        const theme_status = $(`a.discussion_open`).html();
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
        theme_status,
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