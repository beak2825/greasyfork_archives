// ==UserScript==
// @name    Forum Curators (Mod)  
// @name:ru Для удобной работы
// @name:uk Куратори форуму | 🍒
// @description  Suggestions for improving the script write here ---> https://vk.com/stassavulcik
// @description:ru Предложения по улучшению скрипта писать сюда ---> https://vk.com/stassavulcik
// @description:uk Пропозиції щодо покращення скрипту писати сюди ---> https://vk.com/stassavulcik
// @version 3.4.7
// @namespace https://forum.blackrussia.online
// @match        https://forum.blackrussia.online/index.php?threads/*
// @include      https://forum.blackrussia.online/index.php?threads/
// @grant        none
// @license    MIT
// @supportURL https://vk.com/dreamer_0612
// @icon https://emoji.gg/assets/emoji/9372-blurple-boost-level-9.png
// @downloadURL https://update.greasyfork.org/scripts/462626/Forum%20Curators%20%28Mod%29.user.js
// @updateURL https://update.greasyfork.org/scripts/462626/Forum%20Curators%20%28Mod%29.meta.js
// ==/UserScript==

(function () {
  'use strict';
const UNACCСEPT_PREFIX = 4; // Prefix that will be set when thread closes
const ACCСEPT_PREFIX = 8; // Prefix that will be set when thread accepted
const RESHENO_PREFIX = 6; // Prefix that will be set when solving the problem
const PINN_PREFIX = 2; // Prefix that will be set when thread pins
const GA_PREFIX = 12; // Prefix that will be set when thread send to ga
const COMMAND_PREFIX = 10; // Prefix that will be set when thread send to project team
const WATCHED_PREFIX = 9;
const CLOSE_PREFIX = 7;
const SPECY_PREFIX = 11;
const TEXY_PREFIX = 13;
const OTKAZBIO_PREFIX = 4;
const ODOBRENOBIO_PREFIX = 8;
const NARASSMOTRENIIBIO_PREFIX = 2;
const OTKAZRP_PREFIX = 4;
const ODOBRENORP_PREFIX = 8;
const NARASSMOTRENIIRP_PREFIX = 2;
const OTKAZORG_PREFIX = 4;
const ODOBRENOORG_PREFIX = 8;
const NARASSMOTRENIIORG_PREFIX = 2;
const buttons = [
     {
      title: 'Приветствие',
      content: '[FONT=Courier New][CENTER]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br>' + '[CENTER][FONT=georgia][I]       [/I][/FONT][/CENTER]',
    },
    {
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴Одобрено ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
     {
        title: 'Одобрено',
        content:
         '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}.[/color][/CENTER]<br>' +
          "[CENTER]Ознокомевшись с вашим заявлением, я выношу вердикт.[/CENTER]<br>" +
            '[CENTER]Ваше заявление получает статус.[/CENTER]<br>' +
           "[Color=Lime][FONT=georgia][I][CENTER]Одобрено![/CENTER][/color] <br>" +
        '[CENTER][FONT=georgia][I]С уважением подполковник ГИБДД Матвей Персиков.[/I][/CENTER][/FONT]',
          status: false,
     },
    {
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴Отказано ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
        title: 'Нету тайма',
        content:
         '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}.[/color][/CENTER]<br>' +
          "[CENTER]Ознокомевшись с вашим заявлением, я выношу вердикт.[/CENTER]<br>" +
            '[CENTER]Ваше заявление получает статус.[/CENTER]<br>' +
         "[Color=Red][FONT=georgia][I][CENTER]Отказано.[/I][/CENTER][/color][/FONT]<br>" +
         '[Color=Red][FONT=georgia][I][CENTER]Причина: В вашем заявлении отсутствует /time[/I][/CENTER][/color][/FONT]<br>' +
        "[CENTER][FONT=georgia][I]С уважением подполковник ГИБДД Матвей Персиков.[/I][/CENTER][/FONT]",
         status: false,
     },
      {
        title: 'Старые скрины',
        content:
         '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}.[/color][/CENTER]<br>' +
          "[CENTER]Ознокомевшись с вашим заявлением, я выношу вердикт.[/CENTER]<br>" +
            '[CENTER]Ваше заявление получает статус.[/CENTER]<br>' +
         "[Color=Red][FONT=georgia][I][CENTER]Отказано.[/I][/CENTER][/color][/FONT]<br>" +
         '[Color=Red][FONT=georgia][I][CENTER]Причина: В вашем заявлении скринам более 3 дней[/I][/CENTER][/color][/FONT]<br>' +
        "[CENTER][FONT=georgia][I]С уважением подполковник ГИБДД Матвей Персиков.[/I][/CENTER][/FONT]",
           status: false,
     },
      {
        title: 'уже в организации',
        content:
         '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}.[/color][/CENTER]<br>' +
          "[CENTER]Ознокомевшись с вашим заявлением, я выношу вердикт.[/CENTER]<br>" +
            '[CENTER]Ваше заявление получает статус.[/CENTER]<br>' +
         "[Color=Red][FONT=georgia][I][CENTER]Отказано.[/I][/CENTER][/color][/FONT]<br>" +
         '[Color=Red][FONT=georgia][I][CENTER]Причина: Вы уже состоите в организации ГИБДД[/I][/CENTER][/color][/FONT]<br>' +
        "[CENTER][FONT=georgia][I]С уважением подполковник ГИБДД Матвей Персиков.[/I][/CENTER][/FONT]",
           status: false,
     },
      {
        title: 'Не выполненные задания(Повыха)',
        content:
         '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}.[/color][/CENTER]<br>' +
          "[CENTER]Ознокомевшись с вашим заявлением, я выношу вердикт.[/CENTER]<br>" +
            '[CENTER]Ваше заявление получает статус.[/CENTER]<br>' +
         "[Color=Red][FONT=georgia][I][CENTER]Отказано.[/I][/CENTER][/color][/FONT]<br>" +
         '[Color=Red][FONT=georgia][I][I][CENTER]Причина: Не выполнены все задания для повышения[/I][/CENTER][/color][/FONT]<br>' +
        "[CENTER][FONT=georgia][I]С уважением подполковник ГИБДД Матвей Персиков.[/I][/CENTER][/FONT]",
           status: false,
     },
     {
        title: 'Не выполненные задания(Снятие выга)',
        content:
         '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}.[/color][/CENTER]<br>' +
          "[CENTER]Ознокомевшись с вашим заявлением, я выношу вердикт.[/CENTER]<br>" +
            '[CENTER]Ваше заявление получает статус.[/CENTER]<br>' +
         "[Color=Red][FONT=georgia][I][CENTER]Отказано.[/I][/CENTER][/color][/FONT]<br>" +
         '[Color=Red][FONT=georgia][I][CENTER]Причина: Не выполнены все задания для снятия выговора.[/I][/CENTER][/color][/FONT]<br>' +
        "[CENTER][FONT=georgia][I]С уважением подполковник ГИБДД Матвей Персиков.[/I][/CENTER][/FONT]",
          status: false,
     },
     {
        title: 'Подделаные доква',
        content:
         '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}.[/color][/CENTER]<br>' +
          "[CENTER]Ознокомевшись с вашим заявлением, я выношу вердикт.[/CENTER]<br>" +
            '[CENTER]Ваше заявление получает статус.[/CENTER]<br>' +
         "[Color=Red][FONT=georgia][I][CENTER]Отказано.[/I][/CENTER][/color]<br>" +
         '[Color=Red][I][CENTER]Причина: Ваши доказательства были поддельные[/I][/CENTER][/color][/FONT]<br>' +
        "[CENTER][FONT=georgia][I]С уважением подполковник ГИБДД Матвей Персиков.[/I][/CENTER][/FONT]",
          status: false,
     },
  ];

 $(document).ready(() => {
    // Загрузка скрипта для обработки шаблонов
    $('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');

    // Добавление кнопок при загрузке страницы
    addButton('На рассмотрение', 'pin');
    addButton('КП', 'teamProject');
    addButton('Га', 'Ga');
    addButton('Спецу', 'Spec');
    addButton('Click me', 'selectAnswer');

    // Поиск информации о теме
    const threadData = getThreadData();

    $('button#pin').click(() => editThreadData(PINN_PREFIX, true));
    $('button#Ga').click(() => editThreadData(GA_PREFIX, true));
    $('button#Spec').click(() => editThreadData(SPECY_PREFIX, true));
    $('button#teamProject').click(() => editThreadData(COMMAND_PREFIX, true));

    $(`button#selectAnswer`).click(() => {
      XF.alert(buttonsMarkup(buttons), null, 'Выберите ответ:');
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
        4 < hours && hours <= 11 ?
        'Доброе утро' :
        11 < hours && hours <= 15 ?
        'Добрый день' :
        15 < hours && hours <= 21 ?
        'Добрый вечер' :
        'Доброй ночи',
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
    } else  {
        fetch(`${document.URL}edit`, {
          method: 'POST',
          body: getFormData({
            prefix_id: prefix,
            title: threadTitle,
            pin: 1,
            _xfToken: XF.config.csrf,
            _xfRequestUri: document.URL.split(XF.config.url.fullBase)[1],
            _xfWithData: 1,
            _xfResponseType: 'json',
          }),
        }).then(() => location.reload());
    }




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
    } else  {
        fetch(`${document.URL}edit`, {
          method: 'POST',
          body: getFormData({
            prefix_id: prefix,
            title: threadTitle,
            pin: 1,
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
