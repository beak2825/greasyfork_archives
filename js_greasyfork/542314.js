// ==UserScript==
// @name         Для руководителей орла
// @namespace    http://tampermonkey.net/
// @version      1000-7
// @description  Скрипт для Руководство OREL
// @author       P.Moroznik
// @match        https://forum.blackrussia.online/threads/*
// @icon         https://avatars.mds.yandex.net/i?id=70fa275caf117351350b8ae6ac6116b2d1fc55e3-3752383-images-thumbs&n=13
// @grant        none
// @license    MIT
// @downloadURL https://update.greasyfork.org/scripts/542314/%D0%94%D0%BB%D1%8F%20%D1%80%D1%83%D0%BA%D0%BE%D0%B2%D0%BE%D0%B4%D0%B8%D1%82%D0%B5%D0%BB%D0%B5%D0%B9%20%D0%BE%D1%80%D0%BB%D0%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/542314/%D0%94%D0%BB%D1%8F%20%D1%80%D1%83%D0%BA%D0%BE%D0%B2%D0%BE%D0%B4%D0%B8%D1%82%D0%B5%D0%BB%D0%B5%D0%B9%20%D0%BE%D1%80%D0%BB%D0%B0.meta.js
// ==/UserScript==

(function () {
	'use strict';
	const UNACCEPT_PREFIX = 4; // префикс отказано
	const ACCEPT_PREFIX = 8; // префикс одобрено
	const PIN_PREFIX = 2; //  префикс закрепить
	const SPECADM_PREFIX = 11; // специальному администратору
	const MAINADM_PREFIX = 12; // главному адамнистратору
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
const KOMANDE_PREFIX = 10;
const buttons = [
        {
        title: '------------------------------------------------------------ ЖАЛОБЫ НА АДМ ----------------------------------------------------------------',
                                   },

        {
        title: '| Жалоба на рассмотрение |',
	  content:
		"[B][CENTER][COLOR=pink]{{ greeting }}, уважаемый уважаемый игрок [/COLOR][/CENTER][/B]<br><br>"+
'[CENTER][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/CENTER]<br><br>' +
        "[B][CENTER][COLOR=WHITE] Ваша жалоба взята на [/COLOR][COLOR=Yellow]рассмотрение.[/COLOR]<br>[COLOR=WHITE]Ожидайте ответа в данной теме. Не создавайте повторные темы в противном случае Вы можете получить блокировку форумного аккаунта.<br> [color=red]Закрыто[/color]"+
"[CENTER][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/CENTER]<br>",
               prefix: PIN_PREFIX,
      status: true,
                       },
            {
        title: '| не по форме |',
	  content:
		"[B][CENTER][COLOR=pink]{{ greeting }}, уважаемый уважаемый игрок [/COLOR][/CENTER][/B]<br><br>"+
'[CENTER][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/CENTER]<br><br>' +
        "[B][CENTER][COLOR=WHITE]Ваша жалоба была составлена не по форме. Пожалуйста, ознакомьтесь с правилой подачи жалоб здесь - [URL='https://forum.blackrussia.online/threads/Правила-подачи-жалоб-на-администрацию.3429349/']кликабельно[/URL]<br> [color=red]Закрыто[/color]."+
"[CENTER][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/CENTER]<br>",
               prefix: CLOSE_PREFIX,
      status: false,
                       },
                {
        title: '| доказательства предоставлены |',
	  content:
		"[B][CENTER][COLOR=pink]{{ greeting }}, уважаемый уважаемый игрок [/COLOR][/CENTER][/B]<br><br>"+
'[CENTER][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/CENTER]<br><br>' +
        "[B][CENTER][COLOR=WHITE]Администратор предоставил доказательства Вашего нарушения. Выдано верно.<br> [color=red]Закрыто[/color]."+
"[CENTER][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/CENTER]<br>",
               prefix: CLOSE_PREFIX,
      status: false,
                       },
                   {
        title: '| Нарушений нет |',
	  content:
		"[B][CENTER][COLOR=pink]{{ greeting }}, уважаемый уважаемый игрок [/COLOR][/CENTER][/B]<br><br>"+
'[CENTER][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/CENTER]<br><br>' +
        "[B][CENTER][COLOR=WHITE]На предоставленных Вами доказательств нарушений со стороны администратора отсутсвуют.<br> [color=red]Закрыто[/color]."+
"[CENTER][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/CENTER]<br>",
               prefix: CLOSE_PREFIX,
      status: false,
                       },
                   {
        title: '| оффтоп |',
	  content:
		"[B][CENTER][COLOR=pink]{{ greeting }}, уважаемый уважаемый игрок [/COLOR][/CENTER][/B]<br><br>"+
'[CENTER][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/CENTER]<br><br>' +
        "[B][CENTER][COLOR=WHITE]Ваша тема никоем образом не относится к разделу. <br> [color=red]Закрыто[/color]."+
"[CENTER][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/CENTER]<br>",
               prefix: CLOSE_PREFIX,
      status: false,
                       },
                   {
        title: '| доквы не работают |',
	  content:
		"[B][CENTER][COLOR=pink]{{ greeting }}, уважаемый уважаемый игрок [/COLOR][/CENTER][/B]<br><br>"+
'[CENTER][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/CENTER]<br><br>' +
        "[B][CENTER][COLOR=WHITE]Ваши доказательства не работают. Пожалуйста, проверьте правильность ссылки и создайте новую тему.<br> [color=red]Закрыто[/color]."+
"[CENTER][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/CENTER]<br>",
               prefix: CLOSE_PREFIX,
      status: false,
                       },
                       {
        title: '| неадекват жалоба |',
	  content:
		"[B][CENTER][COLOR=pink]{{ greeting }}, уважаемый уважаемый игрок [/COLOR][/CENTER][/B]<br><br>"+
'[CENTER][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/CENTER]<br><br>' +
        "[B][CENTER][COLOR=WHITE]Жалобы в таком виде рассматриваться не будут. Последующие подобные темы могут привести к блокировке форумного аккаунта.<br> [color=red]Закрыто[/color]."+
"[CENTER][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/CENTER]<br>",
               prefix: CLOSE_PREFIX,
      status: false,
                       },
                       {
        title: '|  48 часов  |',
	  content:
		"[B][CENTER][COLOR=pink]{{ greeting }}, уважаемый игрок [/COLOR][/CENTER][/B]<br><br>"+
'[CENTER][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/CENTER]<br><br>' +
        "[B][CENTER][COLOR=WHITE]С момента выдачи наказания прошло более 48-ми часов.<br> [color=red]Закрыто[/color]."+
"[CENTER][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/CENTER]<br>",
               prefix: CLOSE_PREFIX,
      status: false,
                       },
                       {
        title: '| передано ГА |',
	  content:
		"[B][CENTER][COLOR=pink]{{ greeting }}, уважаемый игрок [/COLOR][/CENTER][/B]<br><br>"+
'[CENTER][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/CENTER]<br><br>' +
        "[B][CENTER][COLOR=WHITE]Ваша жалоба была передана на рассмотрение [color=red]Главному администратору[/color]. Пожалуйста, ожидайте ответа в данной теме и не создавайте её дубликатов.<br> [color=orange]На рассмотрение[/color]."+
"[CENTER][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/CENTER]<br>",
               prefix: MAINADM_PREFIX,
      status: true,
                       },
                       {
        title: '| Передано ЗГА |',
	  content:
		"[B][CENTER][COLOR=pink]{{ greeting }}, уважаемый игрок [/COLOR][/CENTER][/B]<br><br>"+
'[CENTER][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/CENTER]<br><br>' +
        "[B][CENTER][COLOR=WHITE]Ваша жалобы была передана на рассмотрение [color=red]Заместителю Главному администратора[/color]. Пожалуйста, ожидайте ответа в данной теме и не создавайте её дубликатов.<br> [color=orange]На рассмотрение[/color]"+
"[CENTER][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/CENTER]<br>",
               prefix: PIN_PREFIX,
      status: true,
                       },
                           {
        title: '| Передано спецам |',
	  content:
		"[B][CENTER][COLOR=pink]{{ greeting }}, уважаемый игрок [/COLOR][/CENTER][/B]<br><br>"+
'[CENTER][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/CENTER]<br><br>' +
        "[B][CENTER][COLOR=WHITE]Ваша жалоба была передана на рассмотрение [color=red]Специальному администратору[/color]. Пожалуйста, ожидайте ответа в данной теме и не создавайте её дубликатов.<br> [color=orange]На рассмотрение[/color]."+
"[CENTER][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/CENTER]<br>",
               prefix: SPECADM_PREFIX,
      status: true,
                       },
                           {
        title: '| проведена работа |',
	  content:
		"[B][CENTER][COLOR=pink]{{ greeting }}, уважаемый игрок [/COLOR][/CENTER][/B]<br><br>"+
'[CENTER][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/CENTER]<br><br>' +
        "[B][CENTER][COLOR=WHITE]С администратором будет проведена работа. Благодарим за Ваше обращение.<br> [color=green]Рассмотрено[/color], [color=red]Закрыто[/color]."+
"[CENTER][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/CENTER]<br>",
               prefix: ACCEPT_PREFIX,
      status: false,
                       },
                           {
        title: '| наказание будет снято |',
	  content:
		"[B][CENTER][COLOR=pink]{{ greeting }}, уважаемый игрок [/COLOR][/CENTER][/B]<br><br>"+
'[CENTER][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/CENTER]<br><br>' +
        "[B][CENTER][COLOR=WHITE]Со стороны администратора произошла ошибка. Ваше наказание будет снято, если ещё не снято. Извиняемся за предоставленные неудобства.<br> [color=green]Одобрено[/color], [color=red]закрыто[/color]."+
"[CENTER][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/CENTER]<br><br><br>",
               prefix: ACCEPT_PREFIX,
      status: false,
                       },
    


];

	$(document).ready(() => {
	// Загрузка скрипта для обработки шаблонов
	$('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');

	// Добавление кнопок при загрузке страницы
        	addButton('Ответы💥', 'selectAnswer');
	addButton('На рассмотрение', 'pin');
	addButton('Отказано⛔', 'unaccept');
	addButton('Одобрено✅', 'accepted');
	addButton('Специальному Администратору💥', 'specadm');
    addButton('Теху', 'Texy');
	addButton('Главному Администратору💥', 'mainadm');
    addButton('Закрыто⛔', 'Zakrito');
    addButton('Решено✅', 'Resheno');
    addButton('Закрыто⛔', 'Zakrito');
    addButton('Реализовано💫', 'Realizovano');
    addButton('Рассмотрено✅', 'Rassmotreno');
    addButton('Ожидание', 'Ojidanie');
    addButton('Без префикса⛔', 'Prefiks');
    addButton('Проверено контролем качества', 'Kachestvo');

	// Поиск информации о теме
	const threadData = getThreadData();

	$('button#unaccept').click(() => editThreadData(UNACCEPT_PREFIX, false));
	$('button#pin').click(() => editThreadData(PIN_PREFIX, true));
	$('button#accepted').click(() => editThreadData(ACCEPT_PREFIX, false));
	$('button#specadm').click(() => editThreadData(SPECADM_PREFIX, true));
	$('button#mainadm').click(() => editThreadData(MAINADM_PREFIX, true));
     $('button#Texy').click(() => editThreadData(TEXY_PREFIX, false));
    $('button#Zakrito').click(() => editThreadData(CLOSE_PREFIX, false));
	$('button#watched').click(() => editThreadData(WATCHED_PREFIX, false));
	$('button#decided').click(() => editThreadData(DECIDED_PREFIX, false));
    $('button#Resheno').click(() => editThreadData(RESHENO_PREFIX, false));
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