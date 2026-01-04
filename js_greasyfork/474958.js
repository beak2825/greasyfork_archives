// // ==UserScript==
// @name         скрипт згкф
// @namespace    https://forum.blackrussia.online/
// @version      1.56
// @description  пятак
// @author       Danila_Pyatak
// @match        https://forum.blackrussia.online/*
// @icon         https://forum.blackrussia.online/
// @grant        none
// @license 	 MIT
// @collaborator none
// @icon         https://klike.net/uploads/posts/2023-05/1685074399_3-18.jpg
// @updateURL
// @downloadURL https://update.greasyfork.org/scripts/474958/%D1%81%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B7%D0%B3%D0%BA%D1%84.user.js
// @updateURL https://update.greasyfork.org/scripts/474958/%D1%81%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B7%D0%B3%D0%BA%D1%84.meta.js
// ==/UserScript==
 
 ( function () {
    `use strict`;
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
const OJIDANIE_PREFIX = 14;
    const buttons = [
        
    {
      title: 'Приветствие',
      content:
         '[CENTER][COLOR=rgb(255, 0, 0)][FONT=trebuchet ms][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER][COLOR=rgb(255, 0, 0)][/FONT][/SIZE]<br>',
    },
    {
          title: '<<<<<<<<<<<<<<<<<<<<<<<<<<< Доказательства >>>>>>>>>>>>>>>>>>>>>>>>>>',
    },
    {
      title: 'На рассмотрении',
      content:
        '[CENTER][COLOR=rgb(255, 0, 0)][FONT=trebuchet ms][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER][/COLOR][/FONT][/SIZE]<br>' +
        '[CENTER][COLOR=rgb(255, 0, 0)][FONT=trebuchet ms][SIZE=4]Ваша жалоба взята на рассмотрение.[/CENTER][/COLOR][/FONT][/SIZE]<br>' +
        '[CENTER][FONT=trebuchet ms][SIZE=4]Пожалуйста, ожидайте вердикт в данной теме и не создавайте дубликаты.[/CENTER][/FONT][/SIZE]<br>' +
        '[CENTER][FONT=trebuchet ms][SIZE=4]Приятной игры на просторах [COLOR=rgb(0, 0, 0)]BLACK [/COLOR][COLOR=rgb(255, 0, 0)]RUSSIA [/COLOR][COLOR=rgb(255, 255, 255)]KRASNODAR.[/COLOR][/CENTER]' ,
       prefix: PINN_PREFIX,
	   status: true,
   },
  {
      title: 'Недостаточно док-в',
      content:
        '[CENTER][COLOR=rgb(255, 0, 0)][FONT=trebuchet ms][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER][/COLOR][/FONT][/SIZE]<br>' +
        '[CENTER][FONT=trebuchet ms][SIZE=4]Недостаточно доказательств для рассмотрения данной темы.[/CENTER][/COLOR][/FONT][/SIZE]<br>' +
        '[CENTER][COLOR=rgb(255, 0, 0)][FONT=trebuchet ms][SIZE=4]Отказано.Закрыто.[/CENTER][/COLOR][/FONT][/SIZE]<br>' +
        '[CENTER][FONT=trebuchet ms][SIZE=4]Приятной игры на просторах [COLOR=rgb(0, 0, 0)]BLACK[/COLOR][COLOR=rgb(255, 0, 0)]RUSSIA[/COLOR][COLOR=rgb(255, 255, 255)]KRASNODAR.[/COLOR][/CENTER]' ,
       prefix: ACCEPT_PREFIX,
	   status: false,
   },
  
  
   ];
  
  
  
 
$(document).ready(() => {
	// Загрузка скрипта для обработки шаблонов
	$('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');
 
	// Добавление кнопок при загрузке страницы
    addButton('Одобрено', 'accepted');
	addButton('Отказано', 'unaccept');
	addButton('На рассмотрение', 'pin');
    addButton('Передать ГА', 'mainAdmin');
    addButton('Тех.Спецу', 'techspec');
	addButton('ПАНЕЛЬ ОТВЕТОВ', 'selectAnswer');
 
	// Поиск информации о теме
	const threadData = getThreadData();
 
	$('button#pin').click(() => editThreadData(PIN_PREFIX, true));
	$('button#accepted').click(() => editThreadData(ACCEPT_PREFIX, false));
	$('button#techspec').click(() => editThreadData(TEX_PREFIX, true));
	$('button#unaccept').click(() => editThreadData(UNACCEPT_PREFIX, false));
    $('button#mainAdmin').click(() => editThreadData(GA_PREFIX, true));
 
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