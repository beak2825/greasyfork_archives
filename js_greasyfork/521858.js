// ==UserScript==
// @name         ARKHANGELSK|Скрипт для С/X |by Calvin Venoris
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Скрипт для следящих за агентами поддержки 
// @author       Calvin Venoris
// @match        https://forum.blackrussia.online/threads/*
// @icon         https://scontent.fbzy1-1.fna.fbcdn.net/v/t39.30808-6/258373301_307111411260400_691949802744386287_n.jpg?_nc_cat=106&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=QtREybLboYUQ7kNvgEVo-no&_nc_oc=AdjZ7q2RXxml8Nv2PXsg4hf_ouY3M6mAuuDygkmhgYVhk_kB6FrQknzPtQIeNVQKvIQ&_nc_zt=23&_nc_ht=scontent.fbzy1-1.fna&_nc_gid=A9Agb62TxNqkfjscUC-RO9h&oh=00_AYBQ0mJ5oy7eor6WQaxh_Ol7fV10KJSrX6drCfEGMmj6iA&oe=6770F781
// @grant        none
// @license    MIT
// @downloadURL https://update.greasyfork.org/scripts/521858/ARKHANGELSK%7C%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%A1X%20%7Cby%20Calvin%20Venoris.user.js
// @updateURL https://update.greasyfork.org/scripts/521858/ARKHANGELSK%7C%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%A1X%20%7Cby%20Calvin%20Venoris.meta.js
// ==/UserScript==

(function () {
	'use strict';
const UNACCСEPT_PREFIX = 4; // префикс отказано
const ACCСEPT_PREFIX = 8; // префикс одобрено
const PINN_PREFIX = 2; //  префикс закрепить
const SPECADM_PREFIX = 11; // специальному администратору
const GA_PREFIX = 12; // главному адамнистратору
const CLOSE_PREFIX = 7;
const TEXY_PREFIX = 13;
const REALIZOVANO_PREFIX = 5;
const VAJNO_PREFIX = 1;
const OJIDANIE_PREFIX = 14;
const OTKAZBIO_PREFIX = 4;
const ODOBRENOBIO_PREFIX = 8;
const NARASSMOTRENIIBIO_PREFIX = 2;
const PREFIKS = 0;
const KACHESTVO = 15;
const RASSMOTRENO_PREFIX = 9;
const OTKAZRP_PREFIX = 4;
const ODOBRENORP_PREFIX = 8;
const NARASSMOTRENIIRP_PREFIX = 2;
const OTKAZORG_PREFIX = 4;
const ODOBRENOORG_PREFIX = 8;
const NARASSMOTRENIIORG_PREFIX = 2;
const buttons = [

{ title: ' ДОП БАЛЛЫ (ОДОБРЕНО) ',
	  content:
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>" +
        "[B][CENTER] [FONT=book antiqua] [COLOR=#00FFFF] Здравствуйте уважаемый агент поддержки!  [/COLOR] <br><br>"+
		"[B][CENTER] [FONT=book antiqua] Ваша заявка на получение дополнительных баллов,  <br><br>"+
        "[B][CENTER] [FONT=book antiqua] получает статус: [COLOR=#00FF00] одобрено [/COLOR] <br><br>"+
        "[B][CENTER] [FONT=book antiqua] Приятной игры на сервере [COLOR=#FF11FF] Arkhangelsk! <br><br>",

        prefix: ACCСEPT_PREFIX,
	  status: false,
},
{ title: ' ДОП БАЛЛЫ (ОТКАЗАНО) ',
	  content:
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>" +
        "[B][CENTER] [FONT=book antiqua] [COLOR=#00FFFF] Здравствуйте уважаемый агент поддержки!  [/COLOR] <br><br>"+
		"[B][CENTER] [FONT=book antiqua] Ваша заявка на получение дополнительных баллов, <br><br>"+
        "[B][CENTER] [FONT=book antiqua] получает статус: [COLOR=RED] отказано [/COLOR] <br><br>"+
        "[B][CENTER] [FONT=book antiqua] Приятной игры на сервере [COLOR=#FF11FF] Arkhangelsk! <br><br>",

        prefix: ACCСEPT_PREFIX,
	  status: false,
},
    { title: ' НЕАКТИВ (ОДОБРЕНО)',
	  content:
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>" +
        "[B][CENTER] [FONT=book antiqua] [COLOR=#00FFFF] Здравствуйте уважаемый агент поддержки!  [/COLOR] <br><br>"+
		"[B][CENTER] [FONT=book antiqua] Ваша заявка на неактив, <br><br>"+
        "[B][CENTER] [FONT=book antiqua] получает статус: [COLOR=#00FF00] одобрено [/COLOR] <br><br>"+
        "[B][CENTER] [FONT=book antiqua] Приятной игры на сервере [COLOR=#FF11FF] Arkhangelsk! <br><br>",

        prefix: ACCСEPT_PREFIX,
	  status: false,
     },

  { title: 'НЕАКТИВ (ОТКАЗАНО)',
	  content:
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>" +
        "[B][CENTER] [FONT=book antiqua] [COLOR=#00FFFF] Здравствуйте уважаемый агент поддержки!  [/COLOR] <br><br>"+
		"[B][CENTER] [FONT=book antiqua] Ваша заявка на неактива,  <br><br>"+
        "[B][CENTER] [FONT=book antiqua] получает статус: [COLOR=RED] отказано [/COLOR] <br><br>"+
        "[B][CENTER] [FONT=book antiqua] Приятной игры на сервере [COLOR=#FF11FF] Arkhangelsk! <br><br>",

        prefix: ACCСEPT_PREFIX,
	  status: false,
     },
     { title: 'ПРОПУСК СОБРАНИЯ (ОДОБРЕНО)',
	  content:
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>" +
        "[B][CENTER] [FONT=book antiqua] [COLOR=#00FFFF] Здравствуйте уважаемый агент поддержки!  [/COLOR] <br><br>"+
		"[B][CENTER] [FONT=book antiqua] Ваша заявка на пропуск еженедельного собрания, <br><br>"+
        "[B][CENTER] [FONT=book antiqua] получает статус:[COLOR=#00FF00] одобрено  [/COLOR] <br><br>"+
        "[B][CENTER] [FONT=book antiqua] Приятной игры на сервере [COLOR=#FF11FF] Arkhangelsk! <br><br>",

        prefix: ACCСEPT_PREFIX,
	  status: false,
     },
     { title: 'ПРОПУСК СОБРАНИЯ (ОТКАЗАНО)',
	  content:
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>" +
        "[B][CENTER] [FONT=book antiqua] [COLOR=#00FFFF] Здравствуйте уважаемый агент поддержки!  [/COLOR] <br><br>"+
		"[B][CENTER] [FONT=book antiqua] Ваша заявка на пропуск еженедельного собрания, <br><br>"+
        "[B][CENTER] [FONT=book antiqua] получает статус: [COLOR=RED] отказано  [/COLOR] <br><br>"+
        "[B][CENTER] [FONT=book antiqua] Приятной игры на сервере [COLOR=#FF11FF] Arkhangelsk! <br><br>",

        prefix: ACCСEPT_PREFIX,
	  status: false,
     },
 { title: 'СНЯТИЕ ПРЕДУПРЕЖДЕНИЯ (ОДОБРЕНО)',
	  content:
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>" +
        "[B][CENTER] [FONT=book antiqua] [COLOR=#00FFFF] Здравствуйте уважаемый агент поддержки!  [/COLOR] <br><br>"+
		"[B][CENTER] [FONT=book antiqua] Ваша заявка на снятие предупреждения <br><br>"+
        "[B][CENTER] [FONT=book antiqua] получает статус: [COLOR=#00FF00] одобрено  [/COLOR] <br><br>"+
        "[B][CENTER] [FONT=book antiqua] Приятной игры на сервере [COLOR=#FF11FF] Arkhangelsk! <br><br>",

        prefix: ACCСEPT_PREFIX,
	  status: false,
     },
 { title: 'СНЯТИЕ ПРЕДУПРЕЖДЕНИЯ (ОТКАЗАНО)',
	  content:
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>" +
        "[B][CENTER] [FONT=book antiqua] [COLOR=#00FFFF] Здравствуйте уважаемый агент поддержки!  [/COLOR] <br><br>"+
		"[B][CENTER] [FONT=book antiqua] Ваша заявка на снятие предупреждения <br><br>"+
        "[B][CENTER] [FONT=book antiqua] получает статус: [COLOR=RED] отказано  [/COLOR] <br><br>"+
        "[B][CENTER] [FONT=book antiqua] Приятной игры на сервере [COLOR=#FF11FF] Arkhangelsk! <br><br>",

        prefix: ACCСEPT_PREFIX,
	  status: false,
     },
     { title: 'СНЯТИЕ ВЫГОВОРА (ОДОБРЕНО)',
	  content:
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>" +
        "[B][CENTER] [FONT=book antiqua] [COLOR=#00FFFF] Здравствуйте уважаемый агент поддержки!  [/COLOR] <br><br>"+
		"[B][CENTER] [FONT=book antiqua] Ваша заявка на снятие выговора <br><br>"+
        "[B][CENTER] [FONT=book antiqua] получает статус: [COLOR=#00FF00] одобрено  [/COLOR] <br><br>"+
        "[B][CENTER] [FONT=book antiqua] Приятной игры на сервере [COLOR=#FF11FF] Arkhangelsk! <br><br>",

        prefix: ACCСEPT_PREFIX,
	  status: false,
     },
 { title: 'СНЯТИЕ ВЫГОВОРА (ОТКАЗАНО)',
	  content:
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>" +
        "[B][CENTER] [FONT=book antiqua] [COLOR=#00FFFF] Здравствуйте уважаемый агент поддержки!  [/COLOR] <br><br>"+
		"[B][CENTER] [FONT=book antiqua] Ваша заявка на снятие выговора <br><br>"+
        "[B][CENTER] [FONT=book antiqua] получает статус: [COLOR=RED] отказано  [/COLOR] <br><br>"+
        "[B][CENTER] [FONT=book antiqua] Приятной игры на сервере [COLOR=#FF11FF] Arkhangelsk! <br><br>",

        prefix: ACCСEPT_PREFIX,
	  status: false,
     },
     { title: 'СНЯТИЕ СТРОГОГО ВЫГОВОРА (ОДОБРЕНО)',
	  content:
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>" +
        "[B][CENTER] [FONT=book antiqua] [COLOR=#00FFFF] Здравствуйте уважаемый агент поддержки!  [/COLOR] <br><br>"+
		"[B][CENTER] [FONT=book antiqua] Ваша заявка на снятие строгого выговора <br><br>"+
        "[B][CENTER] [FONT=book antiqua] получает статус: [COLOR=#00FF00] одобрено  [/COLOR] <br><br>"+
        "[B][CENTER] [FONT=book antiqua] Приятной игры на сервере [COLOR=#FF11FF] Arkhangelsk! <br><br>",

        prefix: ACCСEPT_PREFIX,
	  status: false,
     },
     { title: 'СНЯТИЕ СТРОГОГО ВЫГОВОРА (ОТКАЗАНО)',
	  content:
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>" +
        "[B][CENTER] [FONT=book antiqua] [COLOR=#00FFFF] Здравствуйте уважаемый агент поддержки!  [/COLOR] <br><br>"+
		"[B][CENTER] [FONT=book antiqua] Ваша заявка на снятие строгого выговора <br><br>"+
        "[B][CENTER] [FONT=book antiqua] получает статус: [COLOR=RED] отказано  [/COLOR] <br><br>"+
        "[B][CENTER] [FONT=book antiqua] Приятной игры на сервере [COLOR=#FF11FF] Arkhangelsk! <br><br>",

        prefix: ACCСEPT_PREFIX,
	  status: false,
     },
];

	$(document).ready(() => {
	// Загрузка скрипта для обработки шаблонов
	$('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');

	// Добавление кнопок при загрузке страницы
	addButton('Ответы💥', 'selectAnswer');

	// Поиск информации о теме
	const threadData = getThreadData();

	$('button#unaccept').click(() => editThreadData(UNACCСEPT_PREFIX, false));
	$('button#pin').click(() => editThreadData(PINN_PREFIX, true));
	$('button#accepted').click(() => editThreadData(ACCСEPT_PREFIX, false));
	$('button#specadm').click(() => editThreadData(SPECADM_PREFIX, true));
	$('button#mainadm').click(() => editThreadData(GA_PREFIX, true));
     $('button#Texy').click(() => editThreadData(TEXY_PREFIX, false));
    $('button#Zakrito').click(() => editThreadData(CLOSE_PREFIX, false));
    $('button#Zakrito').click(() => editThreadData(CLOSE_PREFIX, false));
    $('button#Realizovano').click(() => editThreadData(REALIZOVANO_PREFIX, false));
    $('button#Vajno').click(() => editThreadData(VAJNO_PREFIX, false));
    $('button#Rassmotreno').click(() => editThreadData(RASSMOTRENO_PREFIX, false));
    $('button#Ojidanie').click(() => editThreadData(OJIDANIE_PREFIX, false));
    $('button#Prefiks').click(() => editThreadData(PREFIKS, false));
    $('button#Kachestvo').click(() => editThreadData(KACHESTVO, false));


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

	if (pin == false) {
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
	if (pin == true) {
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