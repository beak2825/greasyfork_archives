// ==UserScript== 
// @name Black Russia Скрипт для Отчётов. 
// @description Для адм отчётов. 
// @namespace https://forum.blackrussia.online 
// @version 1.0.5
// @author Vladimir_Francz & Alex_Otaman & Nikita_Blumba 
// @match https://forum.blackrussia.online/index.php?threads/* 
// @include https://forum.blackrussia.online/index.php?threads/ 
// @grant none 
// @license MIT 
// @icon https://icons.iconarchive.com/icons/thesquid.ink/free-flat-sample/128/support-icon.png 
// @downloadURL https://update.greasyfork.org/scripts/455107/Black%20Russia%20%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%9E%D1%82%D1%87%D1%91%D1%82%D0%BE%D0%B2.user.js
// @updateURL https://update.greasyfork.org/scripts/455107/Black%20Russia%20%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%9E%D1%82%D1%87%D1%91%D1%82%D0%BE%D0%B2.meta.js
// ==/UserScript==   
 
(function () { 
 'use strict'; 
const UNACCEPT_PREFIX = 4; // Prefix that will be set when thread closes 
const ACCEPT_PREFIX = 8; // Prefix that will be set when thread accepted 
const PIN_PREFIX = 2; // Prefix that will be set when thread pins 
const COMMAND_PREFIX = 10; // Prefix that will be set when thread send to project team 
const WATCHED_PREFIX = 9; 
const CLOSE_PREFIX = 7; 
const buttons = [ 
 { 
 title: 'Отчёт', 
 content: 
 '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]https://i.yapx.cc/GFL6g.png[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms [/CENTER][COLOR=rgb(0, 255, 255)]' +
'1.Ваш Nick_Name: Artur_Kirakosyan ' + 

'2.Должность: ' + 

'3. ссылка на /astats:' + 

'4.Доп работа(Мп. Посты и т.п): ' + 

'5.Количество заработанных баллов за день: ' +

'6.Дата отчёта: ' +

'[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]https://i.yapx.cc/GFL6g.png[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]' + 
'[B][SIZE=3][COLOR=rgb(0, 255, 255)]С уважением, Artur_Kirakosyan [/COLOR][COLOR=rgb(128, 0, 128)]"Purple" (06)[/COLOR][/SIZE][/B]', 
 }, 
]; 
 
$(document).ready(() => { 
 // Загрузка скрипта для обработки шаблонов 
 $('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>'); 
 
 // Добавление кнопок при загрузке страницы 
 addButton('Отчёт', 'selectAnswer'); 
 
 // Поиск информации о теме 
 const threadData = getThreadData(); 
 
 $('button#pin').click(() => editThreadData(PIN_PREFIX, true)); 
 $('button#accepted').click(() => editThreadData(ACCEPT_PREFIX, false)); 
 $('button#teamProject').click(() => editThreadData(COMMAND_PREFIX, true)); 
 $('button#unaccept').click(() => editThreadData(UNACCEPT_PREFIX, false)); 
 
 $(`button#selectAnswer`).click(() => { 
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
