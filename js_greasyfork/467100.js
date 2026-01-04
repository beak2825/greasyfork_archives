// ==UserScript==
// @name    Скрипт для ЗГС/ГС ГОС COLD
// @name:ru Скрипт для ЗГС/ГС ГОС COLD
// @description  Suggestions for improving the script write here ---> https://vk.com/hz9991
// @description:ru Если вы заметили ошибку или есть предложение писать сюда ---> https://vk.com/hz9991
// @version 0.0.0
// @namespace https://forum.blackrussia.online
// @match        https://forum.blackrussia.online/index.php?threads/*
// @include      https://forum.blackrussia.online/index.php?threads/
// @grant        none
// @license    MIT
// @supportURL https://vk.com/hz9991
// @icon https://emoji.gg/assets/emoji/9372-blurple-boost-level-9.png
// @downloadURL https://update.greasyfork.org/scripts/467100/%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%97%D0%93%D0%A1%D0%93%D0%A1%20%D0%93%D0%9E%D0%A1%20COLD.user.js
// @updateURL https://update.greasyfork.org/scripts/467100/%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%97%D0%93%D0%A1%D0%93%D0%A1%20%D0%93%D0%9E%D0%A1%20COLD.meta.js
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
title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴Одобрено ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
      title: 'Получит соотв. наказание',
      content:
        '[Color=rgb(148, 0, 211)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER][FONT=georgia][I][B] Сотрудник получит соответствующее наказание. [/FONT][/I][/B][/CENTER]<br>" +
        '[Color=Lime][CENTER]Одоброно, извиняюсь за предоставленные неудобства.[/color]<br> ' +
        "[CENTER] С Уважением Губернатор Нижегородской области Рамиль Николенко [Color=Yellow]C [/I][/CENTER][/color][/FONT]",
      prefix: ACCСEPT_PREFIX,
      status: false,
    },
    {
      title: 'Профилактическая беседа',
      content:
        '[Color=rgb(148, 0, 211)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER][FONT=georgia][I][B]С сотрудником будет проведена профилактическая беседа. [/FONT][/I][/B][/CENTER]<br>" +
        '[Color=Lime][CENTER] Одобрено. Извините за предоставленные неудобства.[/color]<br> ' +
        "[CENTER] С Уважением Губернатор Нижегородской области Рамиль Николенко.[Color=Yellow]  [/I][/CENTER][/color][/FONT]",
      prefix: ACCСEPT_PREFIX,
      status: false,
    },
        {
      title: 'Строгая беседа',
      content:
        '[Color=rgb(148, 0, 211)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER][FONT=georgia][I][B]С сотрудником будет проведена строгая беседа. [/FONT][/I][/B][/CENTER]<br>" +
        '[Color=Lime][CENTER]Одобрено, извиняюсь за предоставленные неудобства[/color]<br> ' +
        "[CENTER] С уважением Губернатор Нижегородской области Рамиль Николенко[Color=Yellow]  [/I][/CENTER][/color][/FONT]",
      prefix: ACCСEPT_PREFIX,
      status: false,
    },
    {
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴На Заявление одобрено╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
      title: `Лизензер/Адвокат одобр`,
      content:
        '[Color=rgb(148, 0, 211)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER][FONT=georgia][I][ Ваше заявление получает статус одобрено. [/FONT][/I][/B][/CENTER]<br>" +
        '[Color=Orange][CENTER]Для дальнейшей работы я отпишу вам в вк. [/color]<br> ' +
        "[CENTER] С уважением Губернатор Нижегородской области Рамиль Николенко[Color=Yellow]  [/I][/CENTER][/color][/FONT]",
      prefix: PINN_PREFIX,
      status: false,
    },
    {
      title: 'Лиз/Адвокат отказано',
      content:
        '[Color=rgb(148, 0, 211)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER][FONT=georgia][I][B]Ваше заявление получает статус отказано. [/FONT][/I][/B][/CENTER]<br>" +
        '[Color=Orange][CENTER]причина:[/color]<br> ' +
        "[CENTER] С Уважением Губернатор Нижегородской области Рамиль Николенко[Color=Yellow]  [/I][/CENTER][/color][/FONT]",
      prefix: PINN_PREFIX,
      status: false,
    },
     {
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴Отказы ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
     {
      title: 'Предоставил док-ва',
      content:
        '[Color=rgb(148, 0, 211)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER][FONT=georgia][I][B]Сотрудник предоставил доказательства. [/FONT][/I][/B][/CENTER]<br>" +
        '[Color=Red][CENTER]Отказано..[/color]<br> ' +
        "[CENTER] С уважением Губернатор Нижегородской области Рамиль Николенко[Color=Yellow] COLD [/I][/CENTER][/color][/FONT]",
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
     {
      title: 'Нет доказательств',
      content:
        '[Color=rgb(148, 0, 211)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER][FONT=georgia][I][B]В вашей жалобе нет доказательств. [/FONT][/I][/B][/CENTER]<br>" +
        '[Color=Red][CENTER]Отказано, закрыто.[/color]<br> ' +
        "[CENTER] Приятной игры на [Color=Yellow] COLD [/I][/CENTER][/color][/FONT]",
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
    {
      title: 'Нужен фрапс',
      content:
        '[Color=rgb(148, 0, 211)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER][FONT=georgia][I][B]В данном случае нужен фрапс. [/FONT][/I][/B][/CENTER]<br>" +
        '[Color=Red][CENTER]Отказано.[/color]<br> ' +
        "[CENTER] С уважением Губернатор Нижегородской области Рамиль Николенко[Color=Yellow] COLD [/I][/CENTER][/color][/FONT]",
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
    {
      title: 'Нету тайм',
      content:
        '[Color=rgb(148, 0, 211)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER][FONT=georgia][I][B]На ваших доказательствах отсутствует /time. [/FONT][/I][/B][/CENTER]<br>" +
        '[Color=Red][CENTER]Отказано [/color]<br> ' +
        "[CENTER] С Уважением Губернатор Нижегородской области Рамиль Николенко[Color=Yecolo] COLD [/I][/CENTER][/color][/FONT]",
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
    {
      title: 'От 3-го лица',
      content:
        '[Color=rgb(148, 0, 211)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER][FONT=georgia][I][B]Жалоба написана от трегьего лица. [/FONT][/I][/B][/CENTER]<br>" +
        '[Color=Red][CENTER]Отказано, закрыто.[/color]<br> ' +
        "[CENTER] Приятной игры на [Color=Yellow] COLD [/I][/CENTER][/color][/FONT]",
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
    {
      title: 'Более 48ч',
      content:
        '[Color=rgb(148, 0, 211)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER][FONT=georgia][I][B]С момента нарушения сотрудника прошло более 72 часов. [/FONT][/I][/B][/CENTER]<br>" +
        '[Color=Red][CENTER]Отказано. [/color]<br> ' +
        "[CENTER] С Уважением Губернатор Нижегородской области Рамиль Николенко[Color=Yellow] COLD [/I][/CENTER][/color][/FONT]",
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
    {
      title: 'Док-ва отредактированы',
      content:
        '[Color=rgb(148, 0, 211)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER][FONT=georgia][I][B]Доказательства должны быть в первоначальном виде. [/FONT][/I][/B][/CENTER]<br>" +
        '[Color=Red][CENTER]Отказано.[/color]<br> ' +
        "[CENTER] С уважением Губернатор Нижегородской области Рамиль Николенко[Color=Yellow] COLD [/I][/CENTER][/color][/FONT]",
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
     {
      title: '24ч на проверку форума',
      content:
        '[Color=rgb(148, 0, 211)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER][FONT=georgia][I][B]У лидера имеется 24 часа , чтобы проверить форумные разделы. [/FONT][/I][/B][/CENTER]<br>" +
        '[Color=Red][CENTER]Отказано, закрыто.[/color]<br> ' +
        "[CENTER] Приятной игры на [Color=Yellow] COLD [/I][/CENTER][/color][/FONT]",
      prefix: UNACCСEPT_PREFIX,
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
    addButton('Ответы', 'selectAnswer');
 
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