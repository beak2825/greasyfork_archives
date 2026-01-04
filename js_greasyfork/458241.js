// // ==UserScript==
// @name         RP Bio
// @namespace    https://forum.blackrussia.online
// @version      1.4.1
// @description  Always remember who you are!
// @author       xz
// @match        https://forum.blackrussia.online/index.php?threads/*
// @include      https://forum.blackrussia.online/index.php?threads/
// @grant        none
// @license      MIT
// @collaborator tot samiy ya
// @icon https://cdn-icons-png.flaticon.com/512/274/274681.png
// @downloadURL https://update.greasyfork.org/scripts/458241/RP%20Bio.user.js
// @updateURL https://update.greasyfork.org/scripts/458241/RP%20Bio.meta.js
// ==/UserScript==
 
(function () {
  'use strict';
const UNACCEPT_PREFIX = 4; // Prefix that will be set when thread closes
const ACCEPT_PREFIX = 8; // Prefix that will be set when thread accepted
const PIN_PREFIX = 2; // Prefix that will be set when thread pins
const COMMAND_PREFIX = 10; // Prefix that will be set when thread send to project team
const WATCHED_PREFIX = 9;
const CLOSE_PREFIX = 7; // Prefix that will be set when thread closes.
const SA_PREFIX = 11;
const GA_PREFIX = 12;
const V_PREFIX = 1;
const buttons = [
    {
      title: '========================================= Отказ ========================================= ',
    },
    {
      title: 'Название темы не по форме.',
      content:
        '[CENTER][FONT=times new roman][SIZE=4][COLOR=rgb(255, 0, 0)]{{ greeting }}, уважаемый игрок.[/COLOR][/SIZE][/FONT]<br><br>' +
        "[FONT=times new roman][SIZE=4][COLOR=rgb(209, 213, 216)]Ваша рп биография [COLOR=rgb(255, 0, 0)] отказана,[/COLOR][COLOR=rgb(209, 213, 216)]так как название темы не по форме.[/COLOR]<br>" +
        '[FONT=times new roman][COLOR=rgb(209, 213, 216)]Название темы должно быть по форме: "RolePlay биография гражданина | Nick_Name"[/COLOR][/FONT][/SIZE][/CENTER]'+
        '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]Закрыто.[/SIZE][/FONT][/COLOR][/CENTER]',
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
      title: 'Биография составлена не по форме.',
      content:
        '[CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый игрок.[/SIZE][/FONT][/COLOR]<br><br>' +
        "[FONT=times new roman][SIZE=4][COLOR=rgb(209, 213, 216)]Ваша рп биография [COLOR=rgb(255, 0, 0)] отказана,[/COLOR][COLOR=rgb(209, 213, 216)]так как составлена не по фомре.[/COLOR]<br>" +
        "[FONT=times new roman][SIZE=4][COLOR=rgb(209, 213, 216)]Составьте рп биографию по форме ниже.[/COLOR]<br>" +
        '[LEFT][QUOTE]1. Ваш Nick_Name:<br>2. Nick_Name администратора:<br>3. Дата выдачи/получения наказания:<br>4. Суть жалобы:<br>5. Доказательство:[/QUOTE][/LEFT]<br><br>' +
        '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]Закрыто.[/SIZE][/FONT][/COLOR][/CENTER]',
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
      title: 'История продумана не до конца,',
      content:
        '[CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый игрок.[/SIZE][/FONT][/COLOR]<br><br>' +
        "[FONT=times new roman][SIZE=4][COLOR=rgb(209, 213, 216)]Ваша рп биография [COLOR=rgb(255, 0, 0)] отказана,[/COLOR][COLOR=rgb(209, 213, 216)]так как История продумана не до конца.[/COLOR]<br>" +
        '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]Закрыто.[/SIZE][/FONT][/COLOR][/CENTER]',
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
      title: 'Нарушение правил физики и адекватной логики.',
      content:
        '[CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый игрок.[/SIZE][/FONT][/COLOR]<br><br>' +
        "[FONT=times new roman][SIZE=4][COLOR=rgb(209, 213, 216)]Ваша рп биография [COLOR=rgb(255, 0, 0)] отказана,[/COLOR][COLOR=rgb(209, 213, 216)]так как в вашей теме нарушаются правила физики и адекватной логики.[/COLOR]<br>" +
        '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]Закрыто.[/SIZE][/FONT][/COLOR][/CENTER]',
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
      title: 'Копипаст.',
      content:
        '[CENTER][FONT=times new roman][SIZE=4][COLOR=rgb(255, 0, 0)]{{ greeting }}, уважаемый игрок.[/COLOR][/SIZE][/FONT]<br><br>' +
        "[FONT=times new roman][SIZE=4][COLOR=rgb(209, 213, 216)]Ваша рп биография [COLOR=rgb(255, 0, 0)] отказана,[/COLOR][COLOR=rgb(209, 213, 216)]так как было скопирована у другого игрока.[/COLOR]<br>" +
        '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]Закрыто.[/SIZE][/FONT][/COLOR][/CENTER]',
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
      title: 'Не по теме',
      content:
        '[CENTER][FONT=times new roman][SIZE=4][COLOR=rgb(255, 0, 0)]{{ greeting }}, уважаемый игрок.[/COLOR][/SIZE][/FONT]<br><br>' +
        "[FONT=times new roman][SIZE=4][COLOR=rgb(209, 213, 216)]Ваша тема никак не связана с данным разделом .[/COLOR]<br>" +
        '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]Закрыто.[/SIZE][/FONT][/COLOR][/CENTER]',
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
      title: '========================================= Одобрено ========================================= ',
    },
    {
      title: 'Рп био одорено',
      content:
        '[CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый игрок.[/SIZE][/FONT][/COLOR]<br><br>' +
        "[FONT=times new roman][SIZE=4][COLOR=rgb(209, 213, 216)]Ваша рп биография [COLOR=rgb(0, 255, 0)]одобрено[/COLOR][COLOR=rgb(209, 213, 216)].[/COLOR]<br>" +
        '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]Закрыто.[/SIZE][/FONT][/COLOR][/CENTER]',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
];



$(document).ready(() => {
    // Загрузка скрипта для обработки шаблонов
    $('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');
 
 
    // Добавление кнопок при загрузке страницы
    addButton('РпБИО', 'rpbio');
 
 
 
    // Поиск информации о теме
    const threadData = getThreadData();
 

 
    $(`button#rpbio`).click(() => {
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
		4 < hours && hours <= 11 ?
		'Доброе утро' :
		11 < hours && hours <= 15 ?
		'Добрый день' :
		15 < hours && hours <= 22 ?
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