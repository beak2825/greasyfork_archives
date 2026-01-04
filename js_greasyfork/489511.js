/// ==UserScript==
// @name         Скрипт для рассмортение жалоб на лидера
// @namespace    http://tampermonkey.net/
// @version      2.9
// @description  Скрипт для Daniel'a South от by D.Sobolev
// @author       Denis Sobolev
// @match        https://forum.blackrussia.online/threads/*
// @icon         https://pibig.info/uploads/posts/2022-11/1669796838_45-pibig-info-p-samurai-i-sakura-oboi-krasivo-49.jpg
// @grant        none
// @license  MIT
// @downloadURL
// @updateURL
// @downloadURL https://update.greasyfork.org/scripts/489511/%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D1%80%D0%B0%D1%81%D1%81%D0%BC%D0%BE%D1%80%D1%82%D0%B5%D0%BD%D0%B8%D0%B5%20%D0%B6%D0%B0%D0%BB%D0%BE%D0%B1%20%D0%BD%D0%B0%20%D0%BB%D0%B8%D0%B4%D0%B5%D1%80%D0%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/489511/%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D1%80%D0%B0%D1%81%D1%81%D0%BC%D0%BE%D1%80%D1%82%D0%B5%D0%BD%D0%B8%D0%B5%20%D0%B6%D0%B0%D0%BB%D0%BE%D0%B1%20%D0%BD%D0%B0%20%D0%BB%D0%B8%D0%B4%D0%B5%D1%80%D0%B0.meta.js
// ==/UserScript==

(function() {
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
    {
        title: '| Привествие |',
         content:
        "[B][CENTER][COLOR=red][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/SK8gkVNW/image.png[/img][/url]<br>' +
       "[B][CENTER][COLOR=white][FONT=courier new] Текст   <br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/SK8gkVNW/image.png[/img][/url]<br>' +
         "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=BLUE]YAKUTSK[/COLOR].<br><br>",
    },
    {
        title: '| С лидером проведена беседа |',
        content:
        "[B][CENTER][COLOR=red][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
         '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/SK8gkVNW/image.png[/img][/url]<br>' +
          "[B][CENTER][COLOR=white][FONT=courier new] Ваша жалоба получает статус одобрено, лидер допустил ошибку приносим свои извенения  <br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/SK8gkVNW/image.png[/img][/url]<br>' +
        "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=BLUE]YAKUTSK[/COLOR].<br><br>",
 prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
        title: '| Лидер не занимает свой пост |',
        content:
        "[B][CENTER][COLOR=red][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/SK8gkVNW/image.png[/img][/url]<br>' +
       "[B][CENTER][COLOR=white][FONT=courier new] На данный момент лидер не занимает свой пост  <br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/SK8gkVNW/image.png[/img][/url]<br>' +
         "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=BLUE]YAKUTSK[/COLOR].<br><br>",
         prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
     title: '| Лидер снят |',
        content:
        "[B][CENTER][COLOR=red][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/SK8gkVNW/image.png[/img][/url]<br>' +
       "[B][CENTER][COLOR=white][FONT=courier new] Лидер был снят с поста  <br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/SK8gkVNW/image.png[/img][/url]<br>' +
         "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=BLUE]YAKUTSK[/COLOR].<br><br>",
             prefix: CLOSE_PREFIX,
	  status: false,
    },
    {
        title: '| Лидер наказан |',
        content:
        "[B][CENTER][COLOR=red][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/SK8gkVNW/image.png[/img][/url]<br>' +
       "[B][CENTER][COLOR=white][FONT=courier new] К лидеру применены меры   <br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/SK8gkVNW/image.png[/img][/url]<br>' +
         "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=BLUE]YAKUTSK[/COLOR].<br><br>",
         prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
        title: '| Беседа с лидером |',
        content:
        "[B][CENTER][COLOR=red][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/SK8gkVNW/image.png[/img][/url]<br>' +
       "[B][CENTER][COLOR=white][FONT=courier new] С лидером будет проведена беседа   <br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/SK8gkVNW/image.png[/img][/url]<br>' +
         "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=BLUE]YAKUTSK[/COLOR].<br><br>",
         prefix: ACCСEPT_PREFIX,
	  status: false,
    },
{
        title: '| В жб на игроков  |',
    content:
        "[B][CENTER][COLOR=red][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/SK8gkVNW/image.png[/img][/url]<br>' +
       "[B][CENTER][COLOR=white][FONT=courier new] Вы ошиблись разделом, обратитесь в раздел |Жалобы на игроков|  <br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/SK8gkVNW/image.png[/img][/url]<br>' +
         "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=BLUE]YAKUTSK[/COLOR].<br><br>",
      prefix: CLOSE_PREFIX,
	  status: false,
    },
    {
        title: '| Не относ. к жб на лд  |',
        content:
        "[B][CENTER][COLOR=red][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/SK8gkVNW/image.png[/img][/url]<br>' +
       "[B][CENTER][COLOR=white][FONT=courier new] Ваша жалоба никак не относится к жалобам на лидеров.   <br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/SK8gkVNW/image.png[/img][/url]<br>' +
         "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=BLUE]YAKUTSK[/COLOR].<br><br>",
          prefix: CLOSE_PREFIX,
	  status: false,
    },
    {
        title: '| В жб на адм  |',
        content:
        "[B][CENTER][COLOR=red][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/SK8gkVNW/image.png[/img][/url]<br>' +
       "[B][CENTER][COLOR=white][FONT=courier new] Вы ошиблись разделом, обратитесь в раздел |Жалобы на администрацию|   <br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/SK8gkVNW/image.png[/img][/url]<br>' +
         "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=BLUE]YAKUTSK[/COLOR].<br><br>",
          prefix: CLOSE_PREFIX,
	  status: false,
    },
        {
        title: '| В тех раздел  |',
            content:
        "[B][CENTER][COLOR=red][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/SK8gkVNW/image.png[/img][/url]<br>' +
       "[B][CENTER][COLOR=white][FONT=courier new] Вы ошиблись разделом обратитесь в |Техниченский раздел|   <br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/SK8gkVNW/image.png[/img][/url]<br>' +
         "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=BLUE]YAKUTSK[/COLOR].<br><br>",
              prefix: CLOSE_PREFIX,
	  status: false,
    },
     {
        title: '| Нарушений нет  |',
         content:
        "[B][CENTER][COLOR=red][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/SK8gkVNW/image.png[/img][/url]<br>' +
       "[B][CENTER][COLOR=white][FONT=courier new] Нарушений со стороны лидера нет   <br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/SK8gkVNW/image.png[/img][/url]<br>' +
         "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=BLUE]YAKUTSK[/COLOR].<br><br>",
         prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
       {
        title: '| Не по форме  |',
           content:
        "[B][CENTER][COLOR=red][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/SK8gkVNW/image.png[/img][/url]<br>' +
       "[B][CENTER][COLOR=white][FONT=courier new] Ваша жалоба составлена не по форме, убедительная просьба ознакомиться с правилами подачи жалоб   <br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/SK8gkVNW/image.png[/img][/url]<br>' +
         "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=BLUE]YAKUTSK[/COLOR].<br><br>",
           prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
     {
        title: '| Заголовок не по форме |',
         content:
        "[B][CENTER][COLOR=red][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/SK8gkVNW/image.png[/img][/url]<br>' +
       "[B][CENTER][COLOR=white][FONT=courier new] Заголовок вашей темы составлен не по форме, убедительная просьба ознакомиться с правилами подачи жалоб   <br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/SK8gkVNW/image.png[/img][/url]<br>' +
         "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=BLUE]YAKUTSK[/COLOR].<br><br>",
         prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
        title: '| Недостаточно док-в |',
         content:
        "[B][CENTER][COLOR=red][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/SK8gkVNW/image.png[/img][/url]<br>' +
       "[B][CENTER][COLOR=white][FONT=courier new] Недостаточно доказательств на нарушение со стороны лидера   <br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/SK8gkVNW/image.png[/img][/url]<br>' +
         "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=BLUE]YAKUTSK[/COLOR].<br><br>",
         prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
        title: '| На рассмотрени |',
         content:
        "[B][CENTER][COLOR=red][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/SK8gkVNW/image.png[/img][/url]<br>' +
       "[B][CENTER][COLOR=white][FONT=courier new] Ожидайте ответа в данной теме. Не создавайте повторные темы в противном случае Вы можете получить блокировку форумного аккаунта.   <br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/SK8gkVNW/image.png[/img][/url]<br>' +
         "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=BLUE]YAKUTSK[/COLOR].<br><br>",
         prefix: NARASSMOTRENIIORG_PREFIX,
	  status: false,
    },
    {
    title: '| В жб на сотрудников  |',
         content:
        "[B][CENTER][COLOR=red][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/SK8gkVNW/image.png[/img][/url]<br>' +
       "[B][CENTER][COLOR=white][FONT=courier new] Обратитесь в раздел |Жалобы на сотрудников|   <br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/SK8gkVNW/image.png[/img][/url]<br>' +
         "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=BLUE]YAKUTSK[/COLOR].<br><br>",
         prefix: CLOSE_PREFIX,
	  status: false,
    },
 ];

	$(document).ready(() => {
	// Загрузка скрипта для обработки шаблонов
	$('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');

	// Добавление кнопок при загрузке страницы
	addButton('На рассмотрение', 'pin');
	addButton('Отказано⛔', 'unaccept');
	addButton('Одобрено✅', 'accepted');
	addButton('Ответы💥', 'selectAnswer');

	// Поиск информации о теме
	const threadData = getThreadData();

	$('button#unaccept').click(() => editThreadData(UNACCСEPT_PREFIX, false));
	$('button#pin').click(() => editThreadData(PINN_PREFIX, true));
	$('button#accepted').click(() => editThreadData(ACCСEPT_PREFIX, false));


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