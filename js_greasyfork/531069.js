// ==UserScript==
// @name скрипт....
// @name:ru скрипт...
// @description скрипт..
// @version 15.14
// @namespace https://forum.blackrussia.online
// @match       https://forum.blackrussia.online/threads/*
// @match       https://forum.blackrussia.online/threads/
// @grant       none
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/531069/%D1%81%D0%BA%D1%80%D0%B8%D0%BF%D1%82.user.js
// @updateURL https://update.greasyfork.org/scripts/531069/%D1%81%D0%BA%D1%80%D0%B8%D0%BF%D1%82.meta.js
// ==/UserScript==
(function () {
  'use strict';
const UNACCEPT_PREFIX = 4; // Prefix that will be set when thread closes
const ACCEPT_PREFIX = 8; // Prefix that will be set when thread accepted
const RESHENO_PREFIX = 6; // Prefix that will be set when solving the problem
const PIN_PREFIX = 2; // Prefix that will be set when thread pins
const GA_PREFIX = 12; // Prefix that will be set when thread send to ga
const COMMAND_PREFIX = 10; // Prefix that will be set when thread send to project team
const WATCHED_PREFIX = 9;
const TEX_PREFIX = 13;
const CLOSE_PREFIX = 7;
const buttons = [
 
 {
    title: `Свой текст`,
    content: "[CENTER][FONT=georgia]Доброго времени суток, уважаемый(-ая) [U]{{ user.name }}[/U]![/font][/center]<br><br>" +
    "[font=georgia][center]Текст[/center][/font]<br><br>" +
    "[center][FONT=georgia]Приятной игры на сервере [COLOR=rgb(255, 215, 0)]NOVGOROD[/COLOR].[/center][/FONT]",

}, 
 
 
{
    title: `--------------------------------------------------------------------Правила игрового процесса --------------------------------------------------------------------`,
},

 
 
{
    title: `на рассмотрении`,
    content: "[size=4][center][font=times new roman][color=red]{{ greeting }}, уважаемый[/color] {{ user.mention }}![/font][/size][/center]" +
    "[url=https://postimages.org/][img]https://i.postimg.cc/6pSNSXKh/1000078797.png[/img][/url]" +
"[Center][size=4][font=times new roman]Ваша жалоба взята на рассмотрение, ожидайте ответа в данной теме.[/size][/font][/center]" +
"[url=https://postimages.org/][img]https://i.postimg.cc/6pSNSXKh/1000078797.png[/img][/url]" +
"[Center][SIZE=4][Color=yellow][ICODE]На рассмотрении.[/ICODE][/COLOR][/SIZE][/center]", 
    prefix: PIN_PREFIX,
    status: true,
},

{
    title: `одобрено`,
    content: "Здравствуйте.<br><br>" +
    "Игрок будет наказан.<br><br>" +
"Одобрено. Закрыто.", 
    prefix: ACCEPT_PREFIX,
    status: false,
},

{
    title: `администратор предоставил доказательства`,
    content: "[size=4][center][font=times new roman][color=red]{{ greeting }}[/color], {{ user.mention }}![/font][/size][/center]" +
    "[url=https://postimages.org/][img]https://i.postimg.cc/6pSNSXKh/1000078797.png[/img][/url]" +
"[Center][size=4][font=times new roman]Администратор предоставил доказательства, наказание выдано верно.[/size][/font][/center]" +
"[url=https://postimages.org/][img]https://i.postimg.cc/6pSNSXKh/1000078797.png[/img][/url]" +
"[Center][SIZE=4][Color=red][ICODE]Закрыто.[/ICODE][/COLOR][/SIZE][/center]", 
    prefix: CLOSE_PREFIX,
    status: true,
},




];
 
 $(document).ready(() => {
	// Загрузка скрипта для обработки шаблонов
	$('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');
 
	// Добавление кнопок при загрузке страницы
 
        addButton('На рассмотрении', 'pin');
$('button#pin').css({
    'background-color': '#FF8C00',
    'border': '2px solid #FF8C00',
    'border-radius': '20px'
});       
     
        addButton(`Одобрено`, `accepted`);
$("button#accepted").css({
    "background-color": "#228B22",
    "border": "2px solid #228B22",
    "border-radius": "20px"
});
 
addButton(`Отказано`, `unaccept`);
$("button#unaccept").css({
    "background-color": "#B22222",
    "border": "2px solid #B22222",
    "border-radius": "20px"
});
 
addButton(`Быстрые ответы`, `selectAnswer`);
$("button#selectAnswer").css({
    "background-color": "#6495ED",
    "border": "2px solid #6495ED",
    "border-radius": "20px",
});
 
	
 
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