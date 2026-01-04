// ==UserScript==
// @name         Скрипт форума для Ринни
// @namespace    https://forum.blackrussia.online
// @version      1.2
// @description  Для форума Ринни
// @author       Emiliano Jimenez
// @match        https://forum.blackrussia.online/index.php?threads/*
// @include      https://forum.blackrussia.online/index.php?threads/
// @grant        none
// @license 	 MIT
// @collaborator jimenez
// @icon https://icons.iconarchive.com/icons/thesquid.ink/free-flat-sample/128/support-icon.png
// @downloadURL https://update.greasyfork.org/scripts/443903/%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D1%84%D0%BE%D1%80%D1%83%D0%BC%D0%B0%20%D0%B4%D0%BB%D1%8F%20%D0%A0%D0%B8%D0%BD%D0%BD%D0%B8.user.js
// @updateURL https://update.greasyfork.org/scripts/443903/%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D1%84%D0%BE%D1%80%D1%83%D0%BC%D0%B0%20%D0%B4%D0%BB%D1%8F%20%D0%A0%D0%B8%D0%BD%D0%BD%D0%B8.meta.js
// ==/UserScript==

(function () {
  'use strict';
    const UNACCEPT_PREFIX = 4; // Prefix that will be set when thread closes
    const ACCEPT_PREFIX = 8; // Prefix that will be set when thread accepted
    const PIN_PREFIX = 2; // Prefix that will be set when thread pins
    const COMMAND_PREFIX = 10; // Prefix that will be set when thread send to project team
    const WATCHED_PREFIX = 9;
    const CLOSE_PREFIX = 7;
    const SPECIAL_PREFIX = 11;
    const GA_PREFIX = 12;
    const TECH_PREFIX = 13;
const buttons = [
	{
	  title: 'ОБЖ: Рассмотрение',
	  content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
"[CENTER][B]Приветствую уважаемый(- ая) [COLOR=rgb(243, 121, 52)]{{ user.mention }}[/COLOR]. [/CENTER]<br>" +
"[CENTER] [IMG]https://rp-wow.ru/upload/017/u1791/98/69/gfl6g.png[/IMG][/B][/FONT][/SIZE][/CENTER]<br>" +
"[SIZE=3][FONT=trebuchet ms][B]Ваше обжалование взято на рассмотрение. Ожидайте ответа в данной теме. Не создавайте повторные темы в противном случае Вы можете получить блокировку форумного аккаунта.[/B][/FONT][/SIZE]<br>" +
"[CENTER][SIZE=3][FONT=trebuchet ms][B][IMG]https://rp-wow.ru/upload/017/u1791/98/69/gfl6g.png[/IMG][/CENTER]<br>" +
"[CENTER][COLOR=rgb(250, 197, 28)]На рассмотрении[/COLOR]. [/B][/FONT][/SIZE][/CENTER]<br>" +
"[RIGHT][SIZE=3][FONT=trebuchet ms][B]С уважением Куратор Администрации.[/B][/FONT][/SIZE][/RIGHT]<br>" +
'[RIGHT][B][FONT=trebuchet ms][SIZE=3]- [COLOR=rgb(255, 0, 0)]Jina Jimenez[/COLOR].[/SIZE][/FONT][/B][/RIGHT]',
	},
	{
	  title: 'ОБЖ: Не по форме',
	  content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
"[CENTER][B]Приветствую уважаемый(- ая) [COLOR=rgb(243, 121, 52)]{{ user.mention }}[/COLOR]. [/CENTER]<br>" +
"[CENTER] [IMG]https://rp-wow.ru/upload/017/u1791/98/69/gfl6g.png[/IMG][/B][/FONT][/SIZE][/CENTER]<br>" +
"[SIZE=3][FONT=trebuchet ms][B]Обжалование составлено не по форме или же не соответствует правилам подачи. Ознакомится - [URL='https://forum.blackrussia.online/index.php?threads/Правила-подачи-заявки-на-обжалование-наказания.1158730/']Кликабельно[/URL].<br>" +
"[CENTER][SIZE=3][FONT=trebuchet ms][B][IMG]https://rp-wow.ru/upload/017/u1791/98/69/gfl6g.png[/IMG][/CENTER]<br>" +
"[CENTER][COLOR=rgb(255, 0, 0)]Отказано[/COLOR], закрыто. [/B][/FONT][/SIZE][/CENTER]<br>" +
"[RIGHT][SIZE=3][FONT=trebuchet ms][B]С уважением Куратор Администрации.[/B][/FONT][/SIZE][/RIGHT]<br>" +
'[RIGHT][B][FONT=trebuchet ms][SIZE=3]- [COLOR=rgb(255, 0, 0)]Jina Jimenez[/COLOR].[/SIZE][/FONT][/B][/RIGHT]',
        status: true,
    },
	{
	  title: 'ОБЖ: Отказано',
	  content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
"[CENTER][B]Приветствую уважаемый(- ая) [COLOR=rgb(243, 121, 52)]{{ user.mention }}[/COLOR]. [/CENTER]<br>" +
"[CENTER] [IMG]https://rp-wow.ru/upload/017/u1791/98/69/gfl6g.png[/IMG][/B][/FONT][/SIZE][/CENTER]<br>" +
"[SIZE=3][FONT=trebuchet ms][B]В обжаловании отказано.<br>" +
"[CENTER][SIZE=3][FONT=trebuchet ms][B][IMG]https://rp-wow.ru/upload/017/u1791/98/69/gfl6g.png[/IMG][/CENTER]<br>" +
"[CENTER][COLOR=rgb(255, 0, 0)]Отказано[/COLOR], закрыто. [/B][/FONT][/SIZE][/CENTER]<br>" +
"[RIGHT][SIZE=3][FONT=trebuchet ms][B]С уважением Куратор Администрации.[/B][/FONT][/SIZE][/RIGHT]<br>" +
'[RIGHT][B][FONT=trebuchet ms][SIZE=3]- [COLOR=rgb(255, 0, 0)]Jina Jimenez[/COLOR].[/SIZE][/FONT][/B][/RIGHT]',
        status: true,
    },
	{
	  title: 'ОБЖ: Одобрено, полностью',
	  content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
"[CENTER][B]Приветствую уважаемый(- ая) [COLOR=rgb(243, 121, 52)]{{ user.mention }}[/COLOR]. [/CENTER]<br>" +
"[CENTER] [IMG]https://rp-wow.ru/upload/017/u1791/98/69/gfl6g.png[/IMG][/B][/FONT][/SIZE][/CENTER]<br>" +
"[SIZE=3][FONT=trebuchet ms][B]Ваше обжалование одобрено, ваше наказание будет полностью снято.<br>" +
"[CENTER][SIZE=3][FONT=trebuchet ms][B][IMG]https://rp-wow.ru/upload/017/u1791/98/69/gfl6g.png[/IMG][/CENTER]<br>" +
"[CENTER][COLOR=rgb(65, 168, 95)]Одобрено[/COLOR], закрыто. [/B][/FONT][/SIZE][/CENTER]<br>" +
"[RIGHT][SIZE=3][FONT=trebuchet ms][B]С уважением Куратор Администрацииа.[/B][/FONT][/SIZE][/RIGHT]<br>" +
'[RIGHT][B][FONT=trebuchet ms][SIZE=3]- [COLOR=rgb(255, 0, 0)]Jina Jimenez[/COLOR].[/SIZE][/FONT][/B][/RIGHT]',
        status: true,
    },
	{
	  title: 'ОБЖ: Одобрено, частично',
	  content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
"[CENTER][B]Приветствую уважаемый(- ая) [COLOR=rgb(243, 121, 52)]{{ user.mention }}[/COLOR]. [/CENTER]<br>" +
"[CENTER] [IMG]https://rp-wow.ru/upload/017/u1791/98/69/gfl6g.png[/IMG][/B][/FONT][/SIZE][/CENTER]<br>" +
"[SIZE=3][FONT=trebuchet ms][B]Ваше обжалование было рассмотрено и принято решение о сокращении вашего наказания.<br>" +
"[CENTER][SIZE=3][FONT=trebuchet ms][B][IMG]https://rp-wow.ru/upload/017/u1791/98/69/gfl6g.png[/IMG][/CENTER]<br>" +
"[CENTER][COLOR=rgb(65, 168, 95)]Одобрено[/COLOR], закрыто. [/B][/FONT][/SIZE][/CENTER]<br>" +
"[RIGHT][SIZE=3][FONT=trebuchet ms][B]С уважением Куратор Администрации.[/B][/FONT][/SIZE][/RIGHT]<br>" +
'[RIGHT][B][FONT=trebuchet ms][SIZE=3]- [COLOR=rgb(255, 0, 0)]Jina Jimenez[/COLOR].[/SIZE][/FONT][/B][/RIGHT]',
        status: true,
         },
	{
	  title: 'ОБЖ: ЖБ на админа',
	  content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
"[CENTER][B]Приветствую уважаемый(- ая) [COLOR=rgb(243, 121, 52)]{{ user.mention }}[/COLOR]. [/CENTER]<br>" +
"[CENTER] [IMG]https://rp-wow.ru/upload/017/u1791/98/69/gfl6g.png[/IMG][/B][/FONT][/SIZE][/CENTER]<br>" +
"[SIZE=3][FONT=trebuchet ms][B]Обратитесь в раздел жалоб на Администрацию сервера. Жалобы - [URL='https://forum.blackrussia.online/index.php?forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B0%D0%B4%D0%BC%D0%B8%D0%BD%D0%B8%D1%81%D1%82%D1%80%D0%B0%D1%86%D0%B8%D1%8E.310/']Кликабельно[/URL].<br>" +
"[CENTER][SIZE=3][FONT=trebuchet ms][B][IMG]https://rp-wow.ru/upload/017/u1791/98/69/gfl6g.png[/IMG][/CENTER]<br>" +
"[CENTER][COLOR=rgb(255, 0, 0)]Отказано[/COLOR], закрыто. [/B][/FONT][/SIZE][/CENTER]<br>" +
"[RIGHT][SIZE=3][FONT=trebuchet ms][B]С уважением Куратор Администрации.[/B][/FONT][/SIZE][/RIGHT]<br>" +
'[RIGHT][B][FONT=trebuchet ms][SIZE=3]- [COLOR=rgb(255, 0, 0)]Jina Jimenez[/COLOR].[/SIZE][/FONT][/B][/RIGHT]',
        status: true,
               },
	{
	  title: 'ОБЖ: ЖБ на теха',
	  content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
"[CENTER][B]Приветствую уважаемый(- ая) [COLOR=rgb(243, 121, 52)]{{ user.mention }}[/COLOR]. [/CENTER]<br>" +
"[CENTER] [IMG]https://rp-wow.ru/upload/017/u1791/98/69/gfl6g.png[/IMG][/B][/FONT][/SIZE][/CENTER]<br>" +
"[SIZE=3][FONT=trebuchet ms][B]Обратитесь в раздел жалоб на технических специалистов. Жалобы - [URL='https://forum.blackrussia.online/index.php?forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D1%82%D0%B5%D1%85%D0%BD%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%B8%D1%85-%D1%81%D0%BF%D0%B5%D1%86%D0%B8%D0%B0%D0%BB%D0%B8%D1%81%D1%82%D0%BE%D0%B2.490/']Кликабельно[/URL].<br>" +
"[CENTER][SIZE=3][FONT=trebuchet ms][B][IMG]https://rp-wow.ru/upload/017/u1791/98/69/gfl6g.png[/IMG][/CENTER]<br>" +
"[CENTER][COLOR=rgb(255, 0, 0)]Отказано[/COLOR], закрыто. [/B][/FONT][/SIZE][/CENTER]<br>" +
"[RIGHT][SIZE=3][FONT=trebuchet ms][B]С уважением Куратор Администрации.[/B][/FONT][/SIZE][/RIGHT]<br>" +
'[RIGHT][B][FONT=trebuchet ms][SIZE=3]- [COLOR=rgb(255, 0, 0)]Jina Jimenez[/COLOR].[/SIZE][/FONT][/B][/RIGHT]',
        status: true,
	},
    {
	  title: 'Рандом',
	  content:
         '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
"[CENTER][B]Приветствую уважаемый(- ая) [COLOR=rgb(243, 121, 52)]{{ user.mention }}[/COLOR]. [/CENTER]<br>" +
"[CENTER] [IMG]https://rp-wow.ru/upload/017/u1791/98/69/gfl6g.png[/IMG][/B][/FONT][/SIZE][/CENTER]<br>" +
"[SIZE=3][FONT=trebuchet ms][B] НАПИСАТЬ [/B][/FONT][/SIZE]<br>" +
"[CENTER][SIZE=3][FONT=trebuchet ms][B][IMG]https://rp-wow.ru/upload/017/u1791/98/69/gfl6g.png[/IMG][/CENTER]<br>" +
"[RIGHT][SIZE=3][FONT=trebuchet ms][B]С уважением Куратор Администрации.[/B][/FONT][/SIZE][/RIGHT]<br>" +
'[RIGHT][B][FONT=trebuchet ms][SIZE=3]- [COLOR=rgb(255, 0, 0)]Jina Jimenez[/COLOR].[/SIZE][/FONT][/B][/RIGHT]',
        prefix: UNACCEPT_PREFIX,
        status: false,
	},
];

$(document).ready(() => {
// Загрузка скрипта для обработки шаблонов
$('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');

// Добавление кнопок при загрузке страницы
    addButton(`На рассмотрение`, `pin`);
    addButton(`Одобрено`, `accepted`);
    addButton(`Отказано`, `unaccept`);
    addButton(`КП`, `teamProject`);
    addButton(`Рассмотрено`, `watched`);
    addButton(`Закрыто`, `closed`);
    addButton (`Спецу`, `specialAdmin`);
    addButton (`ГА`, `mainAdmin`);
    addButton(`Тех.Спец`, `techspec`);
    addButton(`Ответы💥`, `selectAnswer`);


// Поиск информации о теме
const threadData = getThreadData();

    $(`button#pin`).click(() => editThreadData(PIN_PREFIX, true));
    $(`button#accepted`).click(() => editThreadData(ACCEPT_PREFIX, false));
    $(`button#teamProject`).click(() => editThreadData(COMMAND_PREFIX, false));
    $(`button#unaccept`).click(() => editThreadData(UNACCEPT_PREFIX, false));
    $(`button#watched`).click(() => editThreadData(WATCHED_PREFIX, false));
    $(`button#closed`).click(() => editThreadData(CLOSE_PREFIX, false));
    $(`button#specialAdmin`).click(() => editThreadData(SPECIAL_PREFIX, true));
    $(`button#mainAdmin`).click(() => editThreadData(GA_PREFIX, true));
    $(`button#techspec`).click(() => editThreadData( TECH_PREFIX , true));

$(`button#selectAnswer`).click(() => {
  XF.alert(buttonsMarkup(buttons), null, 'Выберите ответ:');
  buttons.forEach((btn, id) => {
	$(`button#answers-${id}`).click(() => pasteContent(id, threadData));
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

function pasteContent(id, data = {}) {
const template = Handlebars.compile(buttons[id].content);
if ($('.fr-element.fr-view p').text() === '') $('.fr-element.fr-view p').empty();

$('span.fr-placeholder').empty();
$('div.fr-element.fr-view p').append(template(data));
$('a.overlay-titleCloser').trigger('click');
}

// Приветствие и время суток
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
	  : 11 < hours && hours <= 17
	  ? 'Добрый день'
	  : 17 < hours && hours <= 23
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
            discussion_open: 1,
			sticky: 1,
			_xfToken: XF.config.csrf,
			_xfRequestUri: document.URL.split(XF.config.url.fullBase)[1],
			_xfWithData: 1,
			_xfResponseType: 'json',
		  }),
		}).then(() => location.reload());
	}
	if(prefix == UNACCEPT_PREFIX || prefix == ACCEPT_PREFIX || prefix == CLOSE_PREFIX || prefix == WATCHED_PREFIX) {
		moveThread(prefix, 230);
	}
}

function getFormData(data) {
	const formData = new FormData();
	Object.entries(data).forEach(i => formData.append(i[0], i[1]));
	return formData;
  }
})();