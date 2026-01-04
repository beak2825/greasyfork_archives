// ==UserScript==
// @name         Скрипт для ГС/ЗГС ГОСC/ОПГ | KHABAROVSK
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Скрипт для ГС/ЗГС 
// @author       Orkni_Stalin
// @match        https://forum.blackrussia.online/threads/*
// @icon         https://klike.net/uploads/posts/2021-12/1638345168_12.jpg
// @grant        none
// @license    MIT
// @downloadURL https://update.greasyfork.org/scripts/513691/%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%93%D0%A1%D0%97%D0%93%D0%A1%20%D0%93%D0%9E%D0%A1C%D0%9E%D0%9F%D0%93%20%7C%20KHABAROVSK.user.js
// @updateURL https://update.greasyfork.org/scripts/513691/%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%93%D0%A1%D0%97%D0%93%D0%A1%20%D0%93%D0%9E%D0%A1C%D0%9E%D0%9F%D0%93%20%7C%20KHABAROVSK.meta.js
// ==/UserScript==

(function () {
	'use strict';
	const UNACCEPT_PREFIX = 4; // префикс отказано
	const ACCEPT_PREFIX = 8; // префикс одобрено
	const PIN_PREFIX = 2; //  префикс закрепить
	const SPECADM_PREFIX = 11; // специальному Лидеру
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
const buttons = [
 {
                     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴Основное ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
{
                                	  title: '| Приветствие |',
	  content:
		"[FONT=courier new][FONT=courier new][B][CENTER][COLOR=RED][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/4dCP7byM/GFL6g.png[/img][/url][/CENTER]<br>' +
		"[FONT=courier new][B][CENTER][COLOR=WHITE] Текст <br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/4dCP7byM/GFL6g.png[/img][/url][/CENTER]<br>' +
        "[CENTER] Приятной игры на [Color=Red]Black Russia [/I][/CENTER][/color][/FONT]",
               },
    {
        title: '| Жалоба на рассмотрение |',
	  content:
		"[FONT=courier new][FONT=courier new][B][CENTER][COLOR=RED][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/4dCP7byM/GFL6g.png[/img][/url][/CENTER]<br>' +
        "[FONT=courier new][B][CENTER][COLOR=WHITE] Ваша жалоба взята на [/COLOR][COLOR=Yellow]рассмотрение.[/COLOR]<br>[COLOR=WHITE]Ожидайте ответа в данной теме. Не создавайте повторные темы в противном случае Вы можете получить блокировку форумного аккаунта.<br>"+
                '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/4dCP7byM/GFL6g.png[/img][/url][/CENTER]<br>' +
               "[CENTER] Приятной игры на [Color=Red]Black Russia [/I][/CENTER][/color][/FONT]",
               prefix: PIN_PREFIX,
      status: true,
                       },
    {
         title: '| Наказание Лидеру |',
	  content:
		"[FONT=courier new][FONT=courier new][B][CENTER][COLOR=RED][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/4dCP7byM/GFL6g.png[/img][/url][/CENTER]<br>' +
        "[FONT=courier new][B][CENTER][COLOR=WHITE] Спасибо за обращение, Ваша жалоба[/COLOR] [COLOR=GREEN]одобрена[/COLOR].<br>[COLOR=WHITE]В сторону Лидера будут применены меры.[/COLOR]<br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/4dCP7byM/GFL6g.png[/img][/url][/CENTER]' +
        "[CENTER] Приятной игры на [Color=Red]Black Russia [/I][/CENTER][/color][/FONT]",
        prefix: ACCEPT_PREFIX,
	  status: false,
               },
    {
                                                            	  title: '| Беседа с Лидером |',
	  content:
		"[FONT=courier new][FONT=courier new][B][CENTER][COLOR=RED][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/4dCP7byM/GFL6g.png[/img][/url][/CENTER]' +
		"[FONT=courier new][B][CENTER][COLOR=WHITE] Спасибо за обращение, Ваша жалоба[/COLOR] [COLOR=GREEN]одобрена[/COLOR].<br>[COLOR=WHITE]Лидер допустил ошибку, приносим свои извинения.<br>С Лидером будет проведена беседа.[/COLOR]<br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/4dCP7byM/GFL6g.png[/img][/url][/CENTER]' +
        "[CENTER] Приятной игры на [Color=Red]Black Russia [/I][/CENTER][/color][/FONT]",
        prefix: ACCEPT_PREFIX,
	  status: false,
               },
    {
             title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴Отказ жалобы ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
                                        	  title: '| Нарушений нет |',
	  content:
		"[FONT=courier new][B][CENTER][COLOR=RED][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/4dCP7byM/GFL6g.png[/img][/url][/CENTER]' +
		"[FONT=courier new][B][CENTER][COLOR=WHITE]Нарушений со стороны Лидера не обнаружено. <br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/4dCP7byM/GFL6g.png[/img][/url][/CENTER]' +
        "[CENTER] Приятной игры на [Color=Red]Black Russia [/I][/CENTER][/color][/FONT]",
        	      prefix: CLOSE_PREFIX,
      status: false
               },
    {
                                                	  title: '| Лидер прав |',
	  content:
		"[FONT=courier new][B][CENTER][COLOR=RED][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/4dCP7byM/GFL6g.png[/img][/url][/CENTER]' +
		"[FONT=courier new][B][CENTER][COLOR=WHITE]Лидер вынес правильный вердикт. <br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/4dCP7byM/GFL6g.png[/img][/url][/CENTER]' +
        "[CENTER] Приятной игры на [Color=Red]Black Russia [/I][/CENTER][/color][/FONT]",
        	      prefix: CLOSE_PREFIX,
      status: false
               },
    {
                                                	  title: '| Док-ва предоставлены |',
	  content:
		"[FONT=courier new][B][CENTER][COLOR=RED][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/4dCP7byM/GFL6g.png[/img][/url][/CENTER]' +
		"[FONT=courier new][B][CENTER][COLOR=WHITE]Доказательства были предоставлены, вердикт Лидера является верным. <br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/4dCP7byM/GFL6g.png[/img][/url][/CENTER]' +
        "[CENTER] Приятной игры на [Color=Red]Black Russia [/I][/CENTER][/color][/FONT]",
        	      prefix: CLOSE_PREFIX,
      status: false
               },
    {
                                                	  title: '| Не по форме |',
	  content:
		"[FONT=courier new][B][CENTER][COLOR=RED][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/4dCP7byM/GFL6g.png[/img][/url][/CENTER]' +
		"[FONT=courier new][B][CENTER][COLOR=WHITE]К сожалению, вам отказано, Вы допустили ошибку в правилах подачи жалобы.<br>Прочитайте внимательно эту тему:<br>[URL='https://forum.blackrussia.online/threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BF%D0%BE%D0%B4%D0%B0%D1%87%D0%B8-%D0%B6%D0%B0%D0%BB%D0%BE%D0%B1-%D0%BD%D0%B0-%D0%BB%D0%B8%D0%B4%D0%B5%D1%80%D0%BE%D0%B2.3429391/']Важно - Правила подачи жалобы.[/URL]<br>Прежде чем написать жалобу. <br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/4dCP7byM/GFL6g.png[/img][/url][/CENTER]' +
        "[CENTER] Приятной игры на [Color=Red]Black Russia [/I][/CENTER][/color][/FONT]",
        	      prefix: CLOSE_PREFIX,
      status: false
               },

    {
                                                	  title: '| Недостаточно док-ев |',
	  content:
		"[FONT=courier new][B][CENTER][COLOR=RED][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/4dCP7byM/GFL6g.png[/img][/url][/CENTER]' +
		"[FONT=courier new][B][CENTER][COLOR=WHITE]Недостаточно доказательств для корректного рассмотрения вашего обращения. <br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/4dCP7byM/GFL6g.png[/img][/url][/CENTER]' +
        "[CENTER] Приятной игры на [Color=Red]Black Russia [/I][/CENTER][/color][/FONT]",
        	      prefix: CLOSE_PREFIX,
      status: false
               },
    {
                                                	  title: '| Отсутствуют док-ва |',
	  content:
		"[FONT=courier new][B][CENTER][COLOR=RED][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/4dCP7byM/GFL6g.png[/img][/url][/CENTER]' +
		"[FONT=courier new][B][CENTER][COLOR=WHITE]В вашей жалобе отсутствуют Доказательства.<br>Следовательно жалоба рассмотрению не подлежит. <br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/4dCP7byM/GFL6g.png[/img][/url][/CENTER]' +
        "[CENTER] Приятной игры на [Color=Red]Black Russia [/I][/CENTER][/color][/FONT]",
        	      prefix: CLOSE_PREFIX,
      status: false
               },
    {
                                                	  title: '| Требуется фрапс |',
	  content:
		"[FONT=courier new][B][CENTER][COLOR=RED][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/4dCP7byM/GFL6g.png[/img][/url][/CENTER]' +
		"[FONT=courier new][B][CENTER][COLOR=WHITE]Недостаточно доказательств для корректного рассмотрения жалобы.<br>В данном случае требуются видео - доказательства. <br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/4dCP7byM/GFL6g.png[/img][/url][/CENTER]' +
        "[CENTER] Приятной игры на [Color=Red]Black Russia [/I][/CENTER][/color][/FONT]",
        	      prefix: CLOSE_PREFIX,
      status: false
               },
    {
                                                	  title: '| Док-ва отредактированы |',
	  content:
		"[FONT=courier new][B][CENTER][COLOR=RED][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/4dCP7byM/GFL6g.png[/img][/url][/CENTER]' +
		"[FONT=courier new][B][CENTER][COLOR=WHITE]Ваши доказательства были подвергнуты изменениям (редактированию), прикрепите оригинальные файлы. <br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/4dCP7byM/GFL6g.png[/img][/url][/CENTER]' +
        "[CENTER] Приятной игры на [Color=Red]Black Russia [/I][/CENTER][/color][/FONT]",
        	      prefix: CLOSE_PREFIX,
      status: false
               },
    {
                                                	  title: '| Док-ва в соц. сетях |',
	  content:
		"[FONT=courier new][B][CENTER][COLOR=RED][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/4dCP7byM/GFL6g.png[/img][/url][/CENTER]' +
		"[FONT=courier new][B][CENTER][COLOR=WHITE]Доказательства в социальных сетях (VK,Instagram,FaceBook) не принимаются.<br>Загрузите доказательства на фохостинг (Imgur,Yapix,Youtube). <br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/4dCP7byM/GFL6g.png[/img][/url][/CENTER]' +
        "[CENTER] Приятной игры на [Color=Red]Black Russia [/I][/CENTER][/color][/FONT]",
        	      prefix: CLOSE_PREFIX,
      status: false
               },

    {
                                                	  title: '| Ответ дан ранее |',
	  content:
		"[FONT=courier new][B][CENTER][COLOR=RED][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/4dCP7byM/GFL6g.png[/img][/url][/CENTER]' +
		"[FONT=courier new][B][CENTER][COLOR=WHITE]Вам уже ранее был дан корректный ответ, за создание дубликатов этой темы ваш форумный аккаунт может быть заблокирован. <br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/4dCP7byM/GFL6g.png[/img][/url][/CENTER]' +
        "[CENTER] Приятной игры на [Color=Red]Black Russia [/I][/CENTER][/color][/FONT]",
        	      prefix: CLOSE_PREFIX,
      status: false
               },
    {
                                                	  title: '| Отсутствует /time |',
	  content:
		"[FONT=courier new][B][CENTER][COLOR=RED][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/4dCP7byM/GFL6g.png[/img][/url][/CENTER]' +
		"[FONT=courier new][B][CENTER][COLOR=WHITE]В ваших доказательствах отсутствует /time.<br>Следовательно, жалоба рассмотрению не подлежит. <br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/4dCP7byM/GFL6g.png[/img][/url][/CENTER]' +
        "[CENTER] Приятной игры на [Color=Red]Black Russia [/I][/CENTER][/color][/FONT]",
        	      prefix: CLOSE_PREFIX,
      status: false
               },
    {
                                                	  title: '| Ошиблись сервером |',
	  content:
		"[FONT=courier new][B][CENTER][COLOR=RED][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/4dCP7byM/GFL6g.png[/img][/url][/CENTER]' +
        "[FONT=courier new][B][CENTER][COLOR=WHITE]Вы ошиблись сервером, Переношу вашу жалобу на нужный сервер. <br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/4dCP7byM/GFL6g.png[/img][/url][/CENTER]' +
        "[CENTER] Приятной игры на [Color=Red]Black Russia [/I][/CENTER][/color][/FONT]",
        	      prefix: CLOSE_PREFIX,
      status: false
               },
     {
                                                	  title: '| не ЛД |',
	  content:
		"[FONT=courier new][B][CENTER][COLOR=RED][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/4dCP7byM/GFL6g.png[/img][/url][/CENTER]' +
        "[FONT=courier new][B][CENTER][COLOR=WHITE]Данный игрок не является лидером <br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/4dCP7byM/GFL6g.png[/img][/url][/CENTER]' +
        "[CENTER] Приятной игры на [Color=Red]Black Russia [/I][/CENTER][/color][/FONT]",
        	      prefix: CLOSE_PREFIX,
      status: false
               },
     {
                                                	  title: '| На СС |',
	  content:
		"[FONT=courier new][B][CENTER][COLOR=RED][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/4dCP7byM/GFL6g.png[/img][/url][/CENTER]' +
		"[FONT=courier new][B][CENTER][COLOR=WHITE]К сожалению, вам отказано, Подайте жалобу на Старший состав.<br>В разделе ГОСС организаций:<br>[URL='https://forum.blackrussia.online/forums/%D0%93%D0%BE%D1%81%D1%83%D0%B4%D0%B0%D1%80%D1%81%D1%82%D0%B2%D0%B5%D0%BD%D0%BD%D1%8B%D0%B5-%D0%BE%D1%80%D0%B3%D0%B0%D0%BD%D0%B8%D0%B7%D0%B0%D1%86%D0%B8%D0%B8.2181/']Раздел Государственных организаций.[/URL]<br>Прежде чем написать жалобу. <br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/4dCP7byM/GFL6g.png[/img][/url][/CENTER]' +
        "[CENTER] Приятной игры на [Color=Red]Black Russia [/I][/CENTER][/color][/FONT]",
        	      prefix: CLOSE_PREFIX,
      status: false
               },
];

	$(document).ready(() => {
	// Загрузка скрипта для обработки шаблонов
	$('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');

	// Добавление кнопок при загрузке страницы
	addButton('Ответы💥', 'selectAnswer');

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