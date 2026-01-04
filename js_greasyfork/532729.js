// ==UserScript==
// @name         KRASNODAR | Главные следящие
// @namespace    https://forum.blackrussia.online/forums/%D0%A1%D0%B5%D1%80%D0%B2%D0%B5%D1%80-%E2%84%9632-krasnodar.1461/
// @version      1.3
// @description  не переставай жить
// @author       flatcher
// @match        https://forum.blackrussia.online/*
// @icon         https://forum.blackrussia.online/
// @grant        none
// @license 	 MIT
// @collaborator none
// @icon https://icons.iconarchive.com/icons/papirus-team/papirus-apps/48/emerald-theme-manager-icon-icon.png
// @updateURL
// @downloadURL https://update.greasyfork.org/scripts/532729/KRASNODAR%20%7C%20%D0%93%D0%BB%D0%B0%D0%B2%D0%BD%D1%8B%D0%B5%20%D1%81%D0%BB%D0%B5%D0%B4%D1%8F%D1%89%D0%B8%D0%B5.user.js
// @updateURL https://update.greasyfork.org/scripts/532729/KRASNODAR%20%7C%20%D0%93%D0%BB%D0%B0%D0%B2%D0%BD%D1%8B%D0%B5%20%D1%81%D0%BB%D0%B5%D0%B4%D1%8F%D1%89%D0%B8%D0%B5.meta.js
// ==/UserScript==

(function() {
    'use strict';
const UNACCEPT_PREFIX = 4; // Prefix that will be set when thread closes
const ACCEPT_PREFIX = 8; // Prefix that will be set when thread accepted
const RESHENO_PREFIX = 6; // Prefix that will be set when solving the problem
const PIN_PREFIX = 2; // Prefix that will be set when thread pins
const GA_PREFIX = 12; // Prefix that will be set when thread send to ga
const COMMAND_PREFIX = 10; // Prefix that will be set when thread send to project team
const CLOSE_PREFIX = 7; // Prefix that will be set when thread closes.
const WATCHED_PREFIX = 9;
const TEX_PREFIX = 13;
const buttons = [

    {
        title: '32'
    },
    {
        title: '⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀ДЛЯ РУКОВОДСТВА ОПГ И ГОС (ЖАЛОБЫ НА ЛИДЕРОВ)⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀'
    },
    {
        title: 'НА РАССМОТРЕНИИ',
        content:
        "Здравствуйте.<br><br>"+
        "Ваша тема находится на рассмотрении.<br>"+
        "Ожидайте в ней ответа и не создавайте дубликатов.",
        prefix: PIN_PREFIX,
        status: true
    },
    {
        title: 'НЕТ ДОК-В',
        content:
        "Здравствуйте.<br><br>"+
        "В вашей теме отсутствуют доказательства, в связи с чем жалоба не может быть рассмотрена.<br>"+
        "Создайте новую тему и прикрепите необходимые для ее рассмотрения доказательства.<br><br>"+
        "Закрыто",
        prefix: UNACCEPT_PREFIX,
        status: false
    },
    {
        title: 'ДОК-ВА В ПЛОХОМ / НЕРАБОЧЕМ КАЧЕСТВЕ',
        content:
        "Здравствуйте.<br><br>"+
        "Доказательства в вашей темы находятся в плохом / нерабочем (просмотр доказательств невозможен) качестве, в связи с чем жалоба не может быть рассмотрена.<br>"+
        "Создайте новую тему и прикрепите доказательства хорошего качества.<br><br>"+
        "Закрыто",
        prefix: UNACCEPT_PREFIX,
        status: false
    },
    {
        title: 'ДОК-ВА В ЗАКРЫТ ДОСТУПЕ',
        content:
        "Здравствуйте.<br><br>"+
        "Доказательства в вашей теме находятся в закрытом виде, в связи с чем жалоба не может быть рассмотрена.<br>"+
        "Создайте новую тему и прикрепите необходимые для ее рассмотрения доказательства.<br><br>"+
        "Закрыто",
        prefix: UNACCEPT_PREFIX,
        status: false
    },
    {
        title: 'ДОК-ВА В СОЦ СЕТЯХ',
        content:
        "Здравствуйте.<br><br>"+
        "Доказательства в вашей теме загружены в социальные сети, в связи с чем жалоба не может быть рассмотрена.<br>"+
        "Создайте новую тему и прикрепите доказательства, загруженные на фотохостинги, к примеру: imgur.com / imgbb.com<br><br>"+
        "Закрыто",
        prefix: UNACCEPT_PREFIX,
        status: false
    },
    {
        title: 'ОТ 3 ЛИЦА',
        content:
        "Здравствуйте.<br><br>"+
        "Темы от 3-х лиц не рассматриваются.<br><br>"+
        "Закрыто.",
        prefix: UNACCEPT_PREFIX,
        status: false
    },
    {
        title: 'НЕТ /TIME',
        content:
        "Здравствуйте.<br><br>"+
        "На ваших доказательствах отсутствует /time, в связи с чем жалоба не может быть рассмотрена.<br>"+
        "Создайте новую тему и прикрепите доказательства, на которых присутствует /time<br><br>"+
        "Закрыто",
        prefix: UNACCEPT_PREFIX,
        status: false
    },
    {
        title: 'НЕДОСТ ДОК-В',
        content:
        "Здравствуйте.<br><br>"+
        "Доказательств, которые были вами прикреплены недостаточно для рассмотрения жалобы.<br><br>"+
        "Закрыто.",
        prefix: UNACCEPT_PREFIX,
        status: false
    },
    {
        title: 'НЕТ НАРУШ',
        content:
        "Здравствуйте.<br><br>"+
        "Нарушений со стороны лидера нет.<br><br>"+
        "Закрыто.",
        prefix: UNACCEPT_PREFIX,
        status: false
    },
    {
        title: 'С ЛД БУДЕТ ПРОВ РАБ',
        content:
        "Здравствуйте.<br><br>"+
        "С лидером будет проведена необходимая работа.<br>"+
        "Благодарим за информацию<br>"+
        "Закрыто.",
        prefix: UNACCEPT_PREFIX,
        status: false
    },
    {
        title: 'СРОК ПРОШЕЛ',
        content:
        "Здравствуйте.<br><br>"+
        "С момента нарушения лидера прошло более 2-х суток.<br>"+
        "Жалоба не подлежит рассмотрению.<br><br>"+
        "Закрыто.",
        prefix: UNACCEPT_PREFIX,
        status: false
    },
    {
        title: 'ДОК-ВА РЕДАКТ',
        content:
        "Здравствуйте.<br><br>"+
        "Доказательства, предоставленные вами были отредактированы. Подобные доказательства не рассматриваются.<br><br>"+
        "Закрыто.",
        prefix: UNACCEPT_PREFIX,
        status: false
    },
    {
        title: 'ОШИБ РАЗДЕЛ',
        content:
        "Здравствуйте.<br><br>"+
        "Вы ошиблись разделом при подаче жалобы.<br>"+
        "Ваша тема будет перенаправлена в нужный раздел.<br><br>",
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