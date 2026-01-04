// ==UserScript==
// @name Кураторы форума | РУСЬ МОБАЙЛ
// @namespace https://forum.russia-game.ru/
// @version 0.2
// @description Работа с форумом РУСИ
// @author Kosty Youmans
// @match https://forum.russia-game.ru/*
// @grant none
// @license MIT
// @icon https://icons.iconarchive.com/icons/thesquid.ink/free-flat-sample/128/support-icon.png
// @downloadURL https://update.greasyfork.org/scripts/521055/%D0%9A%D1%83%D1%80%D0%B0%D1%82%D0%BE%D1%80%D1%8B%20%D1%84%D0%BE%D1%80%D1%83%D0%BC%D0%B0%20%7C%20%D0%A0%D0%A3%D0%A1%D0%AC%20%D0%9C%D0%9E%D0%91%D0%90%D0%99%D0%9B.user.js
// @updateURL https://update.greasyfork.org/scripts/521055/%D0%9A%D1%83%D1%80%D0%B0%D1%82%D0%BE%D1%80%D1%8B%20%D1%84%D0%BE%D1%80%D1%83%D0%BC%D0%B0%20%7C%20%D0%A0%D0%A3%D0%A1%D0%AC%20%D0%9C%D0%9E%D0%91%D0%90%D0%99%D0%9B.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const PIN_PREFIX = 2; // На рассмотрении
  const RESHENO_PREFIX = 3; // Решено
  const UNACCEPT_PREFIX = 4; // Отказано
  const ACCEPT_PREFIX = 5; // Одобрено
  const COMMAND_PREFIX = 6; // Команде проекта
  const GA_PREFIX = 7; // Главному администратору
  const WATCHED_PREFIX = 9;

  const buttons = [
      {
          title: '-----------------------------------------------------Раздел игроков-----------------------------------------------------'
      },
      {
          title: 'Взять жалобу на рассмотрение',
          content: '[CENTER][size=15px][font=Trebuchet MS][CENTER]Приветствую, уважаемый игрок [COLOR=rgb(255,200,0)] {{ user.mention }}[/color].[/size][/font][/CENTER]<br><br>' +
                   '[CENTER][size=15px][font=Trebuchet MS]Благодарим вас за ваше обращение. Ваша жалоба получает Статус: [Color=rgb(255, 155 ,0)]На рассмотрении.[/color][/size][/font][/CENTER]<br><br>' +
                   '[CENTER][size=15px][font=Trebuchet MS]Ожидайте ответа в данной теме[/color].[/size][/font][/CENTER>',
          prefix: PIN_PREFIX,
          status: false,
      },
      {
          title: 'Недостаточно док-в',
          content: '[CENTER][size=15px][font=Trebuchet MS][CENTER]Доброго времени суток, уважаемый [COLOR=rgb(255,200,0)] {{ user.mention }}[/color].[/size][/font][/CENTER]<br><br>' +
                   '[CENTER][size=15px][font=Trebuchet MS]Недостаточно доказательств[/size][/font][/CENTER]<br><br>' +
                   '[CENTER][size=15px][font=Trebuchet MS]Отказано, Закрыто[/color].[/size][/font][/CENTER]',
          prefix: UNACCEPT_PREFIX,
          status: false,
      },
      {
          title: '-------------------------------------------------Раздел администраций------------------------------------------------'
      },
      {
          title: 'Админ выдал наказание верно',
          content: '[CENTER][size=15px][font=Trebuchet MS][CENTER]Приветствую, уважаемый игрок [COLOR=rgb(255,200,0)] {{ user.mention }}[/color].[/size][/font][/CENTER]<br><br>' +
                   '[CENTER][size=15px][font=Trebuchet MS]Благодарим вас за вашу жалобу. После проведения расследования мы пришли к выводу, что в данной жалобе администратор выдал наказание верно.[/size][/font][/CENTER><br><br>' +
                   '[CENTER][size=15px][font=Trebuchet MS]Мы всегда стремимся поддерживать честную и справедливую игровую среду для всех участников.[/size][/font][/CENTER><br><br>' +
                   '[CENTER][size=15px][font=Trebuchet MS]Ваша внимательность и активное участие в сообществе игры оцениваются нами. Спасибо за понимание![/size][/font][/CENTER><br><br>' +
                   '[CENTER][size=15px][font=Trebuchet MS]С уважением, Администрация [COLOR=rgb(255,200,0)]РУСЬ Mobile[/color].[/size][/font][/CENTER]',
          prefix: UNACCEPT_PREFIX,
          status: false,
      },
  ];

$(document).ready(() => {
    $('button#teamProject').click(() => editThreadData(COMMAND_PREFIX, true));
    $('button#unaccept').click(() => editThreadData(UNACCEPT_PREFIX, false));

    $('button#selectAnswer').click(() => {
        XF.alert(buttonsMarkup(buttons), null, 'Выберите ответ:');
        buttons.forEach((btn, id) => {
            $(`button#answers-${id}`).click(() => pasteContent(id, threadData, id > 0));
        });
    });

    function addButton(name, id) {
        $('.button--icon--reply').before(
            `<button type="button" class="button rippleButton" id="${id}" style="margin: 3px;">${name}</button>`
        );
    }

    function buttonsMarkup(buttons) {
        return `<div class="select_answer">${buttons
            .map(
                (btn, i) =>
                    `<button id="answers-${i}" class="button--primary button rippleButton" style="margin:5px"><span class="button-text">${btn.title}</span></button>`
            )
            .join('')}</div>`;
    }

    function pasteContent(id, data = {}, send = false) {
        const template = Handlebars.compile(buttons[id].content);
        const editor = $('div.fr-element.fr-view p');

        editor.empty(); // Очищаем редактор перед вставкой
        editor.append(template(data));
        $('a.overlay-titleCloser').trigger('click');

        if (send) {
            editThreadData(buttons[id].prefix, buttons[id].status);
            $('.button--icon.button--icon--reply.rippleButton').trigger('click');
        }
    }

    function getThreadData() {
        const authorID = $('a.username')[0].attributes['data-user-id'].value;
        const authorName = $('a.username').html();
        return {
            user: {
                id: authorID,
                name: authorName,
                mention: `[USER=${authorID}]${authorName}[/USER]`,
            },
        };
    }

    function editThreadData(prefix, pin = false) {
        const threadTitle = $('.p-title-value').text().trim();

        const data = {
            prefix_id: prefix,
            title: threadTitle,
            _xfToken: XF.config.csrf,
            _xfRequestUri: document.URL.split(XF.config.url.fullBase)[1],
            _xfWithData: 1,
            _xfResponseType: 'json',
        };

        if (pin) {
            data.pin = 1;
        }

        fetch(`${document.URL}edit`, {
            method: 'POST',
            body: getFormData(data),
        }).then(() => location.reload());
    }

    function moveThread(prefix, type) {
        const threadTitle = $('.p-title-value').text().trim();

        const data = {
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
        };

        fetch(`${document.URL}move`, {
            method: 'POST',
            body: getFormData(data),
        }).then(() => location.reload());
    }

    function getFormData(data) {
        const formData = new FormData();
        Object.entries(data).forEach(([key, value]) => formData.append(key, value));
        return formData;
    }
});
})