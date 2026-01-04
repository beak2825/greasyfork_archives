// ==UserScript==
// @name         BLACK RUSSIA YAROSLAVL || Скрипт для ГС/ЗГС
// @namespace    https://forum.blackrussia.online/
// @version      1.1.111
// @description  Создан для ГС/ЗГС сервера YAROSLAVL
// @author       Nikolay_Lubimov
// @match        https://forum.blackrussia.online/threads/*
// @include      https://forum.blackrussia.online/threads/
// @grant        none
// @license      MIT
// @icon https://img.icons8.com/nolan/452/beezy.png
// @downloadURL https://update.greasyfork.org/scripts/492421/BLACK%20RUSSIA%20YAROSLAVL%20%7C%7C%20%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%93%D0%A1%D0%97%D0%93%D0%A1.user.js
// @updateURL https://update.greasyfork.org/scripts/492421/BLACK%20RUSSIA%20YAROSLAVL%20%7C%7C%20%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%93%D0%A1%D0%97%D0%93%D0%A1.meta.js
// ==/UserScript==
(function () {
  'use strict';
const UNACCEPT_PREFIX = 4; // Prefix that will be set when thread closes
const ACCEPT_PREFIX = 8; // Prefix that will be set when thread accepted
const PIN_PREFIX = 2; // Prefix that will be set when thread pins
const COMMAND_PREFIX = 10; // Prefix that will be set when thread send to project team
const WATCHED_PREFIX = 9;
const CLOSE_PREFIX = 7; // Prefix that will be set when thread closes.
const TEX_PREFIX = 13;
const GA_PREFIX = 12;
const V_PREFIX = 1;
const buttons = [ 
               {
title: '_____________________________________________ღ ЖБ на ЛД ღ_____________________________________________ ',
     },
{
title: 'На рассмотрении',
      content:

"[CENTER][FONT=TIMES NEW ROMAN][COLOR=MediumPurple]{{greeting}}, уважаемый {{ user.name }} [/COLOR][/CENTER]<br><br>"+
	           
		        " [FONT=Times new roman][B][CENTER]Ваша жалоба взята на рассмотрение.<br>" +
		        'Не нужно создавать копии данной темы.<br>' +
		        "[B][CENTER]В противном случае Вам будет выдана блокировка ФА.<br><br>" +
		       '[CENTER][FONT=TIMES NEW ROMAN] [COLOR=YELLOW]  На рассмотрении [/COLOR][/FONT] [/CENTER]'+
		        "[I][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] Black Russia[/B][/COLOR]",
	  prefix: PIN_PREFIX,
	  status: true,
    },
	 {
title: 'Нет нарушений',
      content:
"[CENTER][FONT=TIMES NEW ROMAN][COLOR=MediumPurple]{{greeting}}, уважаемый {{ user.name }} [/COLOR][/CENTER]<br><br>"+
"[CENTER][COLOR=rgb(209, 213, 216)][FONT=courier new][SIZE=4]Внимательно ознакомившись с вашей жалобой, я выношу вердикт:[/SIZE][/FONT][/CENTER]<br>" +
        "[CENTER][COLOR=rgb(209, 213, 216)][FONT=courier new][SIZE=4]Нарушений со стороны лидера нет![/SIZE][/FONT][/CENTER]<br>" +
        "[CENTER][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/CENTER]<br>" +
        "[CENTER][FONT=courier new][COLOR=rgb(255, 0, 0)][SIZE=4]Отказано![/SIZE][/COLOR][/FONT][/CENTER]",
      prefix: CLOSE_PREFIX,
      status: true,
     },
     {
title: 'Одобрено',
      content:
"[CENTER][FONT=TIMES NEW ROMAN][COLOR=MediumPurple]{{greeting}}, уважаемый {{ user.name }} [/COLOR][/CENTER]<br><br>"+
	           "[CENTER][SIZE=4][FONT=courier new][COLOR=rgb(204, 204, 204)]Ваша жалоба была одобрена, с администратором будет проведена беседа![/COLOR][/FONT][/SIZE][/CENTER]<br>" +
        "[CENTER][SIZE=4][FONT=courier new][COLOR=rgb(204, 204, 204)]Спасибо за содействие![/COLOR][/FONT][/SIZE][/CENTER]<br>" +
        "[CENTER][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/CENTER]<br>" +
        "[CENTER][SIZE=4][COLOR=rgb(0, 255, 0)][FONT=courier new]Одобрено![/FONT][/COLOR][/SIZE][/CENTER]",
        prefix: ACCEPT_PREFIX,
      status: false,
    },
    ];

$(document).ready(() => {
    // Загрузка скрипта для обработки шаблонов
    $('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');
 
    // Добавление кнопок при загрузке страницы
    addButton('Закрыто', 'close');
    addButton('На рассмотрение', 'pin');
    addButton('Одобрено', 'accepted');
    addButton('Отказано', 'unaccept');
    addButton('Рассмотрено', 'wached');
    addButton('Ответы', 'selectAnswer');
 
    // Поиск информации о теме
    const threadData = getThreadData();
 
    $('button#pin').click(() => editThreadData(PIN_PREFIX, true));
    $('button#accepted').click(() => editThreadData(ACCEPT_PREFIX, false));
    $('button#Ga').click(() => editThreadData(GA_PREFIX, true));
    $('button#teamProject').click(() => editThreadData(COMMAND_PREFIX, true));
    $('button#unaccept').click(() => editThreadData(UNACCEPT_PREFIX, false));
    $('button#Texy').click(() => editThreadData(TEX_PREFIX, false));
    $('button#close').click(() => editThreadData(CLOSE_PREFIX, false));
    $('button#wached').click(() => editThreadData(WATCHED_PREFIX, false));
 
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
    const authorName = $('a.username').html();
    const hours = new Date().getHours();
    return {
      user: {
        name: authorName,
        mention: `${authorName}`,
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