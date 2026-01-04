// ==UserScript==
// @name         Лидерам и заместителям | RODINA RP | By Kevik
// @namespace    http://tampermonkey.net/
// @version      1.0 beta
// @description  По вопросам, дополнениям или багам, обращайтесь в личные сообщения ВК - https://vk.com/alexeykevik
// @author       Kevik
// @match        https://forum.rodina-rp.com/threads/*
// @grant        none
// @license 	 MIT
// @icon https://i.postimg.cc/02pB5YtL/kevik.png
// @downloadURL
// @updateURL
// @downloadURL https://update.greasyfork.org/scripts/494836/%D0%9B%D0%B8%D0%B4%D0%B5%D1%80%D0%B0%D0%BC%20%D0%B8%20%D0%B7%D0%B0%D0%BC%D0%B5%D1%81%D1%82%D0%B8%D1%82%D0%B5%D0%BB%D1%8F%D0%BC%20%7C%20RODINA%20RP%20%7C%20By%20Kevik.user.js
// @updateURL https://update.greasyfork.org/scripts/494836/%D0%9B%D0%B8%D0%B4%D0%B5%D1%80%D0%B0%D0%BC%20%D0%B8%20%D0%B7%D0%B0%D0%BC%D0%B5%D1%81%D1%82%D0%B8%D1%82%D0%B5%D0%BB%D1%8F%D0%BC%20%7C%20RODINA%20RP%20%7C%20By%20Kevik.meta.js
// ==/UserScript==

(function() {
    'use strict';
const buttons = [
    {
      title: 'свой ответ (заявка)',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#FFFF00]{{ greeting }}, уважаемый игрок.[/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#FFFF00][SIZE=5] . [/COLOR][/FONT][/CENTER]<br>" +
        "[I][FONT=times new roman][COLOR=#FFFF00][SIZE=5]Причиной послужило: .[/COLOR][/FONT][/CENTER] <br>" +
        '[I][FONT=times new roman][COLOR=#FFFF00][SIZE=5]Приятной игры. <br>С уважением руководство организации.[/COLOR][/FONT]',
    },
    {
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴Вердикт ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
      title: 'Одобрено',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#FFFF00]{{ greeting }}, уважаемый игрок.[/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#FFFF00][SIZE=5]Рассмотрев ваше заявление, было принято следующее решение - [COLOR=#00FF00]одобрить заявление.[/COLOR][/COLOR][/FONT][/CENTER] <br>" +
        '[I][FONT=times new roman][COLOR=#FFFF00][SIZE=5]Приятной игры. <br>С уважением руководство организации.[/COLOR][/FONT]',
	  status: false,
    },
    {
      title: 'Отказано (Не по форме)',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#FFFF00]{{ greeting }}, уважаемый игрок.[/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#FFFF00][SIZE=5]Рассмотрев ваше заявление, было принято следующее решение - [COLOR=#FF0000]отклонить заявление.[/COLOR][/COLOR][/FONT] <br>" +
        "[I][FONT=times new roman][COLOR=#FFFF00][SIZE=5]Причиной послужило составленое не по форме заявление.[/COLOR][/FONT][/CENTER] <br>" +
        '[I][FONT=times new roman][COLOR=#FFFF00][SIZE=5]Приятной игры. <br>С уважением руководство организации.[/COLOR][/FONT]',
	  status: false,
    },
    {
      title: 'Отказано (Скринам более суток)',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#FFFF00]{{ greeting }}, уважаемый игрок.[/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#FFFF00][SIZE=5]Рассмотрев ваше заявление, было принято следующее решение - [COLOR=#FF0000]отклонить заявление.[/COLOR][/COLOR][/FONT] <br>" +
        "[I][FONT=times new roman][COLOR=#FFFF00][SIZE=5]Причиной послужило: Доказательствам более дня.[/COLOR][/FONT][/CENTER] <br>" +
        '[I][FONT=times new roman][COLOR=#FFFF00][SIZE=5]Приятной игры. <br>С уважением руководство организации.[/COLOR][/FONT]',
	  status: false,
    },
    {
      title: 'Отказано (Обрезаные скрины)',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#FFFF00]{{ greeting }}, уважаемый игрок.[/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#FFFF00][SIZE=5]Рассмотрев ваше заявление, было принято следующее решение - [COLOR=#FF0000]отклонить заявление.[/COLOR][/COLOR][/FONT] <br>" +
        "[I][FONT=times new roman][COLOR=#FFFF00][SIZE=5]Причиной послужило: Обрезаные доказательства.[/COLOR][/FONT][/CENTER] <br>" +
        '[I][FONT=times new roman][COLOR=#FFFF00][SIZE=5]Приятной игры. <br>С уважением руководство организации.[/COLOR][/FONT]',
	  status: false,
    },
    {
      title: 'Отказано (Древнее качество)',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#FFFF00]{{ greeting }}, уважаемый игрок.[/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#FFFF00][SIZE=5]Рассмотрев ваше заявление, было принято следующее решение - [COLOR=#FF0000]отклонить заявление.[/COLOR][/COLOR][/FONT] <br>" +
        "[I][FONT=times new roman][COLOR=#FFFF00][SIZE=5]Причиной послужило: Плохое качество доказательств.[/COLOR][/FONT][/CENTER] <br>" +
        '[I][FONT=times new roman][COLOR=#FFFF00][SIZE=5]Приятной игры. <br>С уважением руководство организации.[/COLOR][/FONT]',
	  status: false,
    },
    {
      title: 'Отказано (Нету тайма)',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#FFFF00]{{ greeting }}, уважаемый игрок.[/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#FFFF00][SIZE=5]Рассмотрев ваше заявление, было принято следующее решение - [COLOR=#FF0000]отклонить заявление.[/COLOR][/COLOR][/FONT] <br>" +
        "[I][FONT=times new roman][COLOR=#FFFF00][SIZE=5]Причиной послужило: На доказательствах отстутствует время (/time).[/COLOR][/FONT][/CENTER] <br>" +
        '[I][FONT=times new roman][COLOR=#FFFF00][SIZE=5]Приятной игры. <br>С уважением руководство организации.[/COLOR][/FONT]',
	  status: false,
    },
    {
      title: 'Отказано (Скрины отредачены)',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#FFFF00]{{ greeting }}, уважаемый игрок.[/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#FFFF00][SIZE=5]Рассмотрев ваше заявление, было принято следующее решение - [COLOR=#FF0000]отклонить заявление.[/COLOR][/COLOR][/FONT] <br>" +
        "[I][FONT=times new roman][COLOR=#FFFF00][SIZE=5]Причиной послужило: Редактирование доказательств.[/COLOR][/FONT][/CENTER] <br>" +
        '[I][FONT=times new roman][COLOR=#FFFF00][SIZE=5]Приятной игры. <br>С уважением руководство организации.[/COLOR][/FONT]',
	  status: false,
    },
    {
      title: 'Отказано (Чужие скрины)',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#FFFF00]{{ greeting }}, уважаемый игрок.[/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#FFFF00][SIZE=5]Рассмотрев ваше заявление, было принято следующее решение - [COLOR=#FF0000]отклонить заявление.[/COLOR][/COLOR][/FONT] <br>" +
        "[I][FONT=times new roman][COLOR=#FFFF00][SIZE=5]Причиной послужило: Доказательства принадлежат не вам.[/COLOR][/FONT][/CENTER] <br>" +
        '[I][FONT=times new roman][COLOR=#FFFF00][SIZE=5]Приятной игры. <br>С уважением руководство организации.[/COLOR][/FONT]',
	  status: false,
    },
];

$(document).ready(() => {
	// Загрузка скрипта для обработки шаблонов
	$('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');

	// Добавление кнопок при загрузке страницы
    addButton('Заявления на пост 📝', 'selectAnswer');

	// Поиск информации о теме
	const threadData = getThreadData();

	$('button#pin').click(() => pasteContent(2, threadData, true));
	$('button#Ga').click(() => pasteContent(8, threadData, true));
	$('button#accepted').click(() => editThreadData(ACCEPT_PREFIX, false));
	$('button#Texy').click(() => pasteContent(7, threadData, true));
	$('button#Rasmotreno').click(() => editThreadData(RASSMOTENO_PREFIX, false));
	$('button#Close').click(() => editThreadData(CLOSE_PREFIX, false));
	$('button#unaccept').click(() => editThreadData(UNACCEPT_PREFIX, false));


$(`button#selectAnswer`).click(() => {
XF.alert(buttonsMarkup(buttons), null, 'НАЖМИТЕ НА НУЖНЫЙ ОТВЕТ');
buttons.forEach((btn, id) => {
if (id > 1) {
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
            `<button type="button" class="button--primary button rippleButton" id="${id}" style="border-radius: 0px 20px; border-color: blue; border-style: dashed solid; margin-right: 7px; margin-bottom: 10px; background: blue; text-decoration-style: wavy;">${name}</button>`,
);
}

function buttonsMarkup(buttons) {
return `<div class="select_answer">${buttons
  .map(
	(btn, i) =>
	  `<button id="answers-${i}" class="button--primary button ` +
	  `rippleButton" style="border-radius: 10px; margin-right: 10px; margin-bottom: 10px"><span class="button-text">${btn.title}</span></button>`,
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

	if(pin == true){
		fetch(`${document.URL}edit`, {
		  method: 'POST',
		  body: getFormData({
			prefix_id: prefix,
			title: threadTitle,
            discussion_open: 0,
			sticky: 1,
			_xfToken: XF.config.csrf,
			_xfRequestUri: document.URL.split(XF.config.url.fullBase)[1],
			_xfWithData: 1,
			_xfResponseType: 'json',
		  }),
		}).then(() => location.reload());
	}
	if(pin == 123){
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

}


function moveThread(prefix, type) {
// Перемещение темы
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
})();


(function() {
    'use strict';
const buttons1 = [
    {
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴Вердикт (ЖБ) ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
      title: 'Одобрено',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#FFFF00]{{ greeting }}, уважаемый игрок.[/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#FFFF00][SIZE=5]Рассмотрев ваше заявление, было принято следующее решение - [COLOR=#00FF00]одобрить заявление.[/COLOR][/COLOR][/FONT][/CENTER] <br>" +
        '[I][FONT=times new roman][COLOR=#FFFF00][SIZE=5]Приятной игры. <br>С уважением руководство организации.[/COLOR][/FONT]',
	  status: false,
    },
    {
      title: 'Одобрено (Стороннее ПО в док-вах)',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#FFFF00]{{ greeting }}, уважаемый игрок.[/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#FFFF00][SIZE=5]Рассмотрев ваше заявление, было принято следующее решение - [COLOR=#00FF00]одобрить заявление.[/COLOR][/COLOR][/FONT][/CENTER] <br>" +
        '[I][FONT=times new roman][COLOR=#FFFF00][SIZE=5]Ваш рапорт будет передан администрации, так как в нём присутствует стороннее ПО <br>С уважением руководство организации.[/COLOR][/FONT]',
	  status: false,
    },
    {
      title: 'Отказано (Не по форме)',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#FFFF00]{{ greeting }}, уважаемый игрок.[/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#FFFF00][SIZE=5]Рассмотрев ваше заявление, было принято следующее решение - [COLOR=#FF0000]отклонить заявление.[/COLOR][/COLOR][/FONT] <br>" +
        "[I][FONT=times new roman][COLOR=#FFFF00][SIZE=5]Причиной послужило составленое не по форме заявление.[/COLOR][/FONT][/CENTER] <br>" +
        '[I][FONT=times new roman][COLOR=#FFFF00][SIZE=5]Приятной игры. <br>С уважением руководство организации.[/COLOR][/FONT]',
	  status: false,
    },
    {
      title: 'Отказано (срок подачи истёк)',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#FFFF00]{{ greeting }}, уважаемый игрок.[/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#FFFF00][SIZE=5]Рассмотрев ваше заявление, было принято следующее решение - [COLOR=#FF0000]отклонить заявление.[/COLOR][/COLOR][/FONT] <br>" +
        "[I][FONT=times new roman][COLOR=#FFFF00][SIZE=5]Причиной послужило: Срок подачи заявления истёк.[/COLOR][/FONT][/CENTER] <br>" +
        '[I][FONT=times new roman][COLOR=#FFFF00][SIZE=5]Приятной игры. <br>С уважением руководство организации.[/COLOR][/FONT]',
	  status: false,
    },
    {
      title: 'Отказано (Нарушения нет)',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#FFFF00]{{ greeting }}, уважаемый игрок.[/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#FFFF00][SIZE=5]Рассмотрев ваше заявление, было принято следующее решение - [COLOR=#FF0000]отклонить заявление.[/COLOR][/COLOR][/FONT] <br>" +
        "[I][FONT=times new roman][COLOR=#FFFF00][SIZE=5]Причиной послужило: Нарушений со стороны игрока нет.[/COLOR][/FONT][/CENTER] <br>" +
        '[I][FONT=times new roman][COLOR=#FFFF00][SIZE=5]Приятной игры. <br>С уважением руководство организации.[/COLOR][/FONT]',
	  status: false,
    },
    {
      title: 'Отказано (Док-ва от стороннего чела)',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#FFFF00]{{ greeting }}, уважаемый игрок.[/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#FFFF00][SIZE=5]Рассмотрев ваше заявление, было принято следующее решение - [COLOR=#FF0000]отклонить заявление.[/COLOR][/COLOR][/FONT] <br>" +
        "[I][FONT=times new roman][COLOR=#FFFF00][SIZE=5]Причиной послужило: Доказательства от 3-го лица.[/COLOR][/FONT][/CENTER] <br>" +
        '[I][FONT=times new roman][COLOR=#FFFF00][SIZE=5]Приятной игры. <br>С уважением руководство организации.[/COLOR][/FONT]',
	  status: false,
    },
    {
      title: 'Отказано (Подделка доказательств)',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#FFFF00]{{ greeting }}, уважаемый игрок.[/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#FFFF00][SIZE=5]Рассмотрев ваше заявление, было принято следующее решение - [COLOR=#FF0000]отклонить заявление.[/COLOR][/COLOR][/FONT] <br>" +
        "[I][FONT=times new roman][COLOR=#FFFF00][SIZE=5]Причиной послужило: Подделка доказательств о нарушении игрока.[/COLOR][/FONT][/CENTER] <br>" +
        '[I][FONT=times new roman][COLOR=#FFFF00][SIZE=5]Приятной игры. <br>С уважением руководство организации.[/COLOR][/FONT]',
	  status: false,
    },
    {
      title: 'Отказано (Древнее качество)',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#FFFF00]{{ greeting }}, уважаемый игрок.[/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#FFFF00][SIZE=5]Рассмотрев ваше заявление, было принято следующее решение - [COLOR=#FF0000]отклонить заявление.[/COLOR][/COLOR][/FONT] <br>" +
        "[I][FONT=times new roman][COLOR=#FFFF00][SIZE=5]Причиной послужило: Плохое качество предоставленых доказательств.[/COLOR][/FONT][/CENTER] <br>" +
        '[I][FONT=times new roman][COLOR=#FFFF00][SIZE=5]Приятной игры. <br>С уважением руководство организации.[/COLOR][/FONT]',
	  status: false,
    },
    {
      title: 'Отказано (Нарушены правила сервера, а не орги)',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#FFFF00]{{ greeting }}, уважаемый игрок.[/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#FFFF00][SIZE=5]Рассмотрев ваше заявление, было принято следующее решение - [COLOR=#FF0000]отклонить заявление.[/COLOR][/COLOR][/FONT] <br>" +
        "[I][FONT=times new roman][COLOR=#FFFF00][SIZE=5]Причиной послужило: Сотрудник нарушил правила сервера, обратитесь в [URL='https://forum.rodina-rp.com/forums/183/']Жалобы на игроков[/URL].[/COLOR][/FONT][/CENTER] <br>" +
        '[I][FONT=times new roman][COLOR=#FFFF00][SIZE=5]Приятной игры. <br>С уважением руководство организации.[/COLOR][/FONT]',
	  status: false,
    },
];

$(document).ready(() => {
	// Загрузка скрипта для обработки шаблонов
	$('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');

	// Добавление кнопок при загрузке страницы
    addButton('Жалобы на сотрудников 😡', 'selectAnswer1');


	// Поиск информации о теме
	const threadData = getThreadData();


$(`button#selectAnswer1`).click(() => {
XF.alert(buttonsMarkup(buttons1), null, 'НАЖМИТЕ НА НУЖНЫЙ ОТВЕТ');
buttons1.forEach((btn, id) => {
if (id > 1) {
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
            `<button type="button" class="button--primary button rippleButton" id="${id}" style="border-radius: 0px 20px; border-color: blue; border-style: dashed solid; margin-right: 7px; margin-bottom: 10px; background: blue; text-decoration-style: wavy;">${name}</button>`,
);
}

function buttonsMarkup(buttons) {
return `<div class="select_answer">${buttons
  .map(
	(btn, i) =>
	  `<button id="answers-${i}" class="button--primary button ` +
	  `rippleButton" style="border-radius: 10px; margin-right: 10px; margin-bottom: 10px"><span class="button-text">${btn.title}</span></button>`,
  )
  .join('')}</div>`;
}

function pasteContent(id, data = {}, send = false) {
	const template = Handlebars.compile(buttons1[id].content);
	if ($('.fr-element.fr-view p').text() === '') $('.fr-element.fr-view p').empty();

	$('span.fr-placeholder').empty();
	$('div.fr-element.fr-view p').append(template(data));
	$('a.overlay-titleCloser').trigger('click');

	if(send == true){
		editThreadData(buttons1[id].prefix, buttons1[id].status);
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

	if(pin == true){
		fetch(`${document.URL}edit`, {
		  method: 'POST',
		  body: getFormData({
			prefix_id: prefix,
			title: threadTitle,
            discussion_open: 0,
			sticky: 1,
			_xfToken: XF.config.csrf,
			_xfRequestUri: document.URL.split(XF.config.url.fullBase)[1],
			_xfWithData: 1,
			_xfResponseType: 'json',
		  }),
		}).then(() => location.reload());
	}
	if(pin == 123){
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

}


function moveThread(prefix, type) {
// Перемещение темы
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
})();


(function() {
    'use strict';
const buttons4 = [
    {
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴Сотрудники ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
      title: 'Одобрено',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#FFFF00]{{ greeting }}, уважаемый игрок.[/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#FFFF00][SIZE=5]Рассмотрев ваше заявление, было принято следующее решение - [COLOR=#00FF00]одобрить заявление.[/COLOR][/COLOR][/FONT][/CENTER] <br>" +
        '[I][FONT=times new roman][COLOR=#FFFF00][SIZE=5]Приятной игры. <br>С уважением руководство организации.[/COLOR][/FONT]',
	  status: false,
    },
    {
      title: 'Отказано (Стороннее ПО)',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#FFFF00]{{ greeting }}, уважаемый игрок.[/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#FFFF00][SIZE=5]Рассмотрев ваше заявление, было принято следующее решение - [COLOR=#FF0000]снять вас с поста.[/COLOR][/COLOR][/FONT] <br>" +
        "[I][FONT=times new roman][COLOR=#FFFF00][SIZE=5]Причиной послужило: Стороннее ПО в доказательствах.[/COLOR][/FONT][/CENTER] <br>" +
        '[I][FONT=times new roman][COLOR=#FFFF00][SIZE=5]Приятной игры. <br>С уважением руководство организации.[/COLOR][/FONT]',
	  status: false,
    },
    {
      title: 'Отказано (Выполнено не всё)',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#FFFF00]{{ greeting }}, уважаемый игрок.[/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#FFFF00][SIZE=5]Рассмотрев ваше заявление, было принято следующее решение - [COLOR=#FF0000]отклонить заявление.[/COLOR][/COLOR][/FONT] <br>" +
        "[I][FONT=times new roman][COLOR=#FFFF00][SIZE=5]Причиной послужило: Выполнение не всех пунктов.[/COLOR][/FONT][/CENTER] <br>" +
        '[I][FONT=times new roman][COLOR=#FFFF00][SIZE=5]Приятной игры. <br>С уважением руководство организации.[/COLOR][/FONT]',
	  status: false,
    },
    {
      title: 'Отказано (Док-ва чужая)',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#FFFF00]{{ greeting }}, уважаемый игрок.[/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#FFFF00][SIZE=5]Рассмотрев ваше заявление, было принято следующее решение - [COLOR=#FF0000]отклонить заявление, а также дать выговор.[/COLOR][/COLOR][/FONT] <br>" +
        "[I][FONT=times new roman][COLOR=#FFFF00][SIZE=5]Причиной послужило: Выставление чужих доказательств за свои.[/COLOR][/FONT][/CENTER] <br>" +
        '[I][FONT=times new roman][COLOR=#FFFF00][SIZE=5]Приятной игры. <br>С уважением руководство организации.[/COLOR][/FONT]',
	  status: false,
    },
    {
      title: 'Отказано (Подделка доказательств)',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#FFFF00]{{ greeting }}, уважаемый игрок.[/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#FFFF00][SIZE=5]Рассмотрев ваше заявление, было принято следующее решение - [COLOR=#FF0000]отклонить заявление, а также дать выговор.[/COLOR][/COLOR][/FONT] <br>" +
        "[I][FONT=times new roman][COLOR=#FFFF00][SIZE=5]Причиной послужило: Подделка доказательств.[/COLOR][/FONT][/CENTER] <br>" +
        '[I][FONT=times new roman][COLOR=#FFFF00][SIZE=5]Приятной игры. <br>С уважением руководство организации.[/COLOR][/FONT]',
	  status: false,
    },
    {
      title: 'Отказано (Обрезаные скрины)',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#FFFF00]{{ greeting }}, уважаемый игрок.[/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#FFFF00][SIZE=5]Рассмотрев ваше заявление, было принято следующее решение - [COLOR=#FF0000]отклонить заявление.[/COLOR][/COLOR][/FONT] <br>" +
        "[I][FONT=times new roman][COLOR=#FFFF00][SIZE=5]Причиной послужило: Обрезка доказательств.[/COLOR][/FONT][/CENTER] <br>" +
        '[I][FONT=times new roman][COLOR=#FFFF00][SIZE=5]Приятной игры. <br>С уважением руководство организации.[/COLOR][/FONT]',
	  status: false,
    },
    {
      title: 'Отказано (Выполнена не та работа)',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#FFFF00]{{ greeting }}, уважаемый игрок.[/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#FFFF00][SIZE=5]Рассмотрев ваше заявление, было принято следующее решение - [COLOR=#FF0000]отклонить заявление.[/COLOR][/COLOR][/FONT] <br>" +
        "[I][FONT=times new roman][COLOR=#FFFF00][SIZE=5]Причиной послужило: Выполнение не тех пунктов для снятие выговора.[/COLOR][/FONT][/CENTER] <br>" +
        '[I][FONT=times new roman][COLOR=#FFFF00][SIZE=5]Приятной игры. <br>С уважением руководство организации.[/COLOR][/FONT]',
	  status: false,
    },
    {
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴Старший состав ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
      title: 'Одобрено',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#FFFF00]{{ greeting }}, уважаемый игрок.[/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#FFFF00][SIZE=5]Рассмотрев ваше заявление, было принято следующее решение - [COLOR=#00FF00]одобрить заявление.[/COLOR][/COLOR][/FONT][/CENTER] <br>" +
        '[I][FONT=times new roman][COLOR=#FFFF00][SIZE=5]Приятной игры. <br>С уважением руководство организации.[/COLOR][/FONT]',
	  status: false,
    },
    {
      title: 'Отказано (Стороннее ПО)',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#FFFF00]{{ greeting }}, уважаемый игрок.[/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#FFFF00][SIZE=5]Рассмотрев ваше заявление, было принято следующее решение - [COLOR=#FF0000]снять вас с поста.[/COLOR][/COLOR][/FONT] <br>" +
        "[I][FONT=times new roman][COLOR=#FFFF00][SIZE=5]Причиной послужило: Стороннее ПО в доказательствах.[/COLOR][/FONT][/CENTER] <br>" +
        '[I][FONT=times new roman][COLOR=#FFFF00][SIZE=5]Приятной игры. <br>С уважением руководство организации.[/COLOR][/FONT]',
	  status: false,
    },
    {
      title: 'Отказано (Выполнено не всё)',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#FFFF00]{{ greeting }}, уважаемый игрок.[/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#FFFF00][SIZE=5]Рассмотрев ваше заявление, было принято следующее решение - [COLOR=#FF0000]отклонить заявление.[/COLOR][/COLOR][/FONT] <br>" +
        "[I][FONT=times new roman][COLOR=#FFFF00][SIZE=5]Причиной послужило: Выполнение не всех пунктов.[/COLOR][/FONT][/CENTER] <br>" +
        '[I][FONT=times new roman][COLOR=#FFFF00][SIZE=5]Приятной игры. <br>С уважением руководство организации.[/COLOR][/FONT]',
	  status: false,
    },
    {
      title: 'Отказано (Док-ва чужая)',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#FFFF00]{{ greeting }}, уважаемый игрок.[/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#FFFF00][SIZE=5]Рассмотрев ваше заявление, было принято следующее решение - [COLOR=#FF0000]отклонить заявление, а также дать выговор.[/COLOR][/COLOR][/FONT] <br>" +
        "[I][FONT=times new roman][COLOR=#FFFF00][SIZE=5]Причиной послужило: Выставление чужих доказательств за свои.[/COLOR][/FONT][/CENTER] <br>" +
        '[I][FONT=times new roman][COLOR=#FFFF00][SIZE=5]Приятной игры. <br>С уважением руководство организации.[/COLOR][/FONT]',
	  status: false,
    },
    {
      title: 'Отказано (Подделка доказательств)',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#FFFF00]{{ greeting }}, уважаемый игрок.[/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#FFFF00][SIZE=5]Рассмотрев ваше заявление, было принято следующее решение - [COLOR=#FF0000]отклонить заявление, а также дать выговор.[/COLOR][/COLOR][/FONT] <br>" +
        "[I][FONT=times new roman][COLOR=#FFFF00][SIZE=5]Причиной послужило: Подделка доказательств.[/COLOR][/FONT][/CENTER] <br>" +
        '[I][FONT=times new roman][COLOR=#FFFF00][SIZE=5]Приятной игры. <br>С уважением руководство организации.[/COLOR][/FONT]',
	  status: false,
    },
    {
      title: 'Отказано (Обрезаные скрины)',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#FFFF00]{{ greeting }}, уважаемый игрок.[/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#FFFF00][SIZE=5]Рассмотрев ваше заявление, было принято следующее решение - [COLOR=#FF0000]отклонить заявление.[/COLOR][/COLOR][/FONT] <br>" +
        "[I][FONT=times new roman][COLOR=#FFFF00][SIZE=5]Причиной послужило: Обрезка доказательств.[/COLOR][/FONT][/CENTER] <br>" +
        '[I][FONT=times new roman][COLOR=#FFFF00][SIZE=5]Приятной игры. <br>С уважением руководство организации.[/COLOR][/FONT]',
	  status: false,
    },
    {
      title: 'Отказано (Выполнена не та работа)',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#FFFF00]{{ greeting }}, уважаемый игрок.[/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#FFFF00][SIZE=5]Рассмотрев ваше заявление, было принято следующее решение - [COLOR=#FF0000]отклонить заявление.[/COLOR][/COLOR][/FONT] <br>" +
        "[I][FONT=times new roman][COLOR=#FFFF00][SIZE=5]Причиной послужило: Выполнение не тех пунктов для снятие выговора.[/COLOR][/FONT][/CENTER] <br>" +
        '[I][FONT=times new roman][COLOR=#FFFF00][SIZE=5]Приятной игры. <br>С уважением руководство организации.[/COLOR][/FONT]',
	  status: false,
    },
    {
      title: 'Отказано (Строгий, менее 7 дней)',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#FFFF00]{{ greeting }}, уважаемый игрок.[/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#FFFF00][SIZE=5]Рассмотрев ваше заявление, было принято следующее решение - [COLOR=#FF0000]отклонить заявление.[/COLOR][/COLOR][/FONT] <br>" +
        "[I][FONT=times new roman][COLOR=#FFFF00][SIZE=5]Причиной послужило: строгий выговор можно снять не менее, чем через 7 дней.[/COLOR][/FONT][/CENTER] <br>" +
        '[I][FONT=times new roman][COLOR=#FFFF00][SIZE=5]Приятной игры. <br>С уважением руководство организации.[/COLOR][/FONT]',
	  status: false,
    },
];

$(document).ready(() => {
	// Загрузка скрипта для обработки шаблонов
	$('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');

	// Добавление кнопок при загрузке страницы
    addButton('Снятие выговора 📕', 'selectAnswer4');
    addButton('🎄 Скрипт от KEVIK 🎄', '/');



	// Поиск информации о теме
	const threadData = getThreadData();




$(`button#selectAnswer4`).click(() => {
XF.alert(buttonsMarkup(buttons4), null, 'НАЖМИТЕ НА НУЖНЫЙ ОТВЕТ');
buttons4.forEach((btn, id) => {
if (id > 1) {
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
            `<button type="button" class="button--primary button rippleButton" id="${id}" style="border-radius: 0px 20px; border-color: blue; border-style: dashed solid; margin-right: 7px; margin-bottom: 10px; background: blue; text-decoration-style: wavy;">${name}</button>`,
);
}

function buttonsMarkup(buttons) {
return `<div class="select_answer">${buttons
  .map(
	(btn, i) =>
	  `<button id="answers-${i}" class="button--primary button ` +
	  `rippleButton" style="border-radius: 10px; margin-right: 10px; margin-bottom: 10px"><span class="button-text">${btn.title}</span></button>`,
  )
  .join('')}</div>`;
}
function pasteContent(id, data = {}, send = false) {
	const template = Handlebars.compile(buttons4[id].content);
	if ($('.fr-element.fr-view p').text() === '') $('.fr-element.fr-view p').empty();

	$('span.fr-placeholder').empty();
	$('div.fr-element.fr-view p').append(template(data));
	$('a.overlay-titleCloser').trigger('click');

	if(send == true){
		editThreadData(buttons4[id].prefix, buttons4[id].status);
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

	if(pin == true){
		fetch(`${document.URL}edit`, {
		  method: 'POST',
		  body: getFormData({
			prefix_id: prefix,
			title: threadTitle,
            discussion_open: 0,
			sticky: 1,
			_xfToken: XF.config.csrf,
			_xfRequestUri: document.URL.split(XF.config.url.fullBase)[1],
			_xfWithData: 1,
			_xfResponseType: 'json',
		  }),
		}).then(() => location.reload());
	}
	if(pin == 123){
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
	if(pin == 12345){
		fetch(`${document.URL}edit`, {
		  method: 'POST',
		  body: getFormData({
			prefix_id: prefix,
			title: threadTitle,
            discussion_open: 1,
			sticky: 0,
			_xfToken: XF.config.csrf,
			_xfRequestUri: document.URL.split(XF.config.url.fullBase)[1],
			_xfWithData: 1,
			_xfResponseType: 'json',
		  }),
		}).then(() => location.reload());
	}
}


function moveThread(prefix, type) {
// Перемещение темы
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
})();