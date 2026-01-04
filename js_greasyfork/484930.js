// ==UserScript==
// @name         KALININGRAD || Скрипт для лидеров сервера by V.Norkin.
// @namespace    https://forum.blackrussia.online
// @version      1.2
// @description  По вопросам(ВК): https://vk.com/qnorkin
// @author       Victor Norkin
// @match        https://forum.blackrussia.online/threads/*
// @grant        none
// @license 	 MIT
// @icon https://icons.iconarchive.com/icons/papirus-team/papirus-apps/48/emerald-theme-manager-icon-icon.png
// @updateURL
// @downloadURL https://update.greasyfork.org/scripts/484930/KALININGRAD%20%7C%7C%20%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%BB%D0%B8%D0%B4%D0%B5%D1%80%D0%BE%D0%B2%20%D1%81%D0%B5%D1%80%D0%B2%D0%B5%D1%80%D0%B0%20by%20VNorkin.user.js
// @updateURL https://update.greasyfork.org/scripts/484930/KALININGRAD%20%7C%7C%20%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%BB%D0%B8%D0%B4%D0%B5%D1%80%D0%BE%D0%B2%20%D1%81%D0%B5%D1%80%D0%B2%D0%B5%D1%80%D0%B0%20by%20VNorkin.meta.js
// ==/UserScript==
(function () {
  'use strict';
const UNACCEPT_PREFIX = 0; // Prefix that will be set when thread closes
const ACCEPT_PREFIX = 0; // Prefix that will be set when thread accepted
const RESHENO_PREFIX = 0; // Prefix that will be set when solving the problem
const PIN_PREFIX = 0; // Prefix that will be set when thread pins
const GA_PREFIX = 0; // Prefix that will be set when thread send to ga
const COMMAND_PREFIX = 0; // Prefix that will be set when thread send to project team
const CLOSE_PREFIX = 0; // Prefix that will be set when thread closes.
const VAJNO_PREFIX = 0;
const WATCHED_PREFIX = 0;
const TEX_PREFIX = 0;
const PREFIKS = 0;
const OTKAZRP_PREFIX = 0;
const ODOBRENORP_PREFIX = 0;
const NARASSMOTRENIIRP_PREFIX = 0;
const NARASSMOTRENIIORG_PREFIX = 0;
const buttons = [

  {
	  title: '| НА РАССМОТРЕНИЕ |',
	  content:
		"[B][CENTER][COLOR=#00FFFF][ICODE]{{ greeting }},уважаемый Пользователь. [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Ваша заявка взята на рассмотрение, не создавайте дубликатов и ожидайте ответа от автора сообщения.<br><br>"+

		'[B][CENTER][COLOR=yellow][ICODE]На рассмотрении[/ICODE][/COLOR][/CENTER][/B]',
	},
  {
	  title: '| не по форме |',
	  content:
		"[B][CENTER][COLOR=#00FFFF][ICODE]{{ greeting }},уважаемый Пользователь. [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Вашa заявка составленa не по форме, пожалуйста ознакомьтесь с правилами подачи заявок.<br><br>"+

		'[B][CENTER][COLOR=RED][ICODE]Отказано[/ICODE][/COLOR][/CENTER][/B]',
	},
   {
	  title: '| Дубликат |',
	  content:
		"[B][CENTER][COLOR=#00FFFF][ICODE]{{ greeting }},уважаемый Пользователь. [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Вам уже был дан ответ в прошлой вашей заявке, пожалуйста перестаньте делать дубликаты, иначе ваш Форумный аккаунт  может быть заблокирован.<br>"+

		'[B][CENTER][COLOR=RED][ICODE]Отказано[/ICODE][/COLOR][/CENTER][/B]',

	},
	{
	  title: '| Уже был ответ |',
	  content:
		"[B][CENTER][COLOR=#00FFFF][ICODE]{{ greeting }},уважаемый Пользователь. [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Вам был дан ответ в прошлой вашей заявке. Просьба не создавать дубликаты данной темы.<br>"+

		'[B][CENTER][COLOR=red][ICODE]Закрыто.[/ICODE][/COLOR][/CENTER][/B]',
	},
   {
	  title: '| Одобрено / жб на мл. сост. |',
	  content:
		"[B][CENTER][COLOR=#00FFFF][ICODE]{{ greeting }},уважаемый Пользователь. [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша заявка получает статус: Одобрено. Cотрудник получил наказание,либо был уволен из организации.<br>"+

		'[B][CENTER][COLOR=#00FA9A][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',
	},
   {
	  title: '| Отказано жб на мл.сост. |',
	  content:
		"[B][CENTER][COLOR=#00FFFF][ICODE]{{ greeting }},уважаемый Пользователь. [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша заявка получает статус: Отказано. Не заметил нарушений со стороны сотрудника.<br>"+

		'[B][CENTER][COLOR=red][ICODE]Отказано[/ICODE][/COLOR][/CENTER][/B]',
	},
   {
	  title: '| Одобрено / жб на ст. сост. |',
	  content:
		"[B][CENTER][COLOR=#00FFFF][ICODE]{{ greeting }},уважаемый Пользователь. [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша заявка одобрена,сотрудник получил наказание,или же был проинструктирован.<br>"+

		'[B][CENTER][COLOR=#00FA9A][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',
	},
   {
	  title: '| Отказано жб на ст.сост. |',
	  content:
		"[B][CENTER][COLOR=#00FFFF][ICODE]{{ greeting }},уважаемый Пользователь. [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша заявка получает статус: Отказано. Не заметил нарушений со стороны сотрудника.<br>"+

		'[B][CENTER][COLOR=red][ICODE]Отказано[/ICODE][/COLOR][/CENTER][/B]',
	},
   {
	  title: '| Одобрено / заявки вб/повышение и т.п. |',
	  content:
		"[B][CENTER][COLOR=#00FFFF][ICODE]{{ greeting }},уважаемый Пользователь. [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша заявка одобрена,свяжитесь со мной в иигре в течении 24 часов. <br>"+

		'[B][CENTER][COLOR=#00FA9A][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',
	},
   {
	  title: '| Одобрено / Отчетность СС. |',
	  content:
		"[B][CENTER][COLOR=#00FFFF][ICODE]{{ greeting }}, уважаемый Пользователь. [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша заявка одобрена,Данные были занесены в таблицу успеваемости. <br>"+

		'[B][CENTER][COLOR=#00FA9A][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',
	},
 {
	  title: '| Отказано / Отчетность СС |',
	  content:
		"[B][CENTER][COLOR=#00FFFF][ICODE]{{ greeting }},уважаемый Пользователь. [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша заявка получает статус: Отказано. Обычно это происходит,если не достаточно проделанной работы.<br>"+

		'[B][CENTER][COLOR=red][ICODE]Отказано[/ICODE][/COLOR][/CENTER][/B]',

	},
 {
	  title: '| Рассмотрено / Кабинет Полковника / шаблон под ваш текст. |',
	  content:
		"[B][CENTER][COLOR=#00FFFF][ICODE]{{ greeting }},уважаемый Пользователь. [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Пишите сюда ваш текст. <br>"+

		'[B][CENTER][COLOR=#00FA9A][ICODE]Рассмотрено[/ICODE][/COLOR][/CENTER][/B]',
	},
 {
	  title: '| Шаблон для сообщения о ежеденевной норме. |',
	  content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zXwvN2pg/7s-PCNqz-T4dw.jpg[/img][/url]<br>' +
        '[CENTER][url=https://postimages.org/][img]https://cdn.discordapp.com/attachments/624208658548391966/716998520300634182/1a28eebb5d98.gif[/img][/url]<br>' +
		"[B][CENTER][COLOR=#00FFFF][ICODE]{{ greeting }},уважаемый Пользователь. [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] 1) Ваш NickName: Victor Norkin. <br>"+
		"[B][CENTER][COLOR=lavender] 2) Ваша организация: МВД  <br>"+
		"[B][CENTER][COLOR=lavender] 3) Скриншоты работы за день:   <br>"+
		"[B][CENTER][COLOR=lavender] - Вербовки: --------------------------------------------------------- <br>"+
		"[B][CENTER][COLOR=lavender] - Проверки: --------------------------------------------------------- <br>"+
		"[B][CENTER][COLOR=lavender] - РП Ситуации:  <br>"+
		"[B][CENTER][COLOR=lavender] - Лекции: --------------------------------------------------------- <br>"+
		"[B][CENTER][COLOR=lavender] - Тренировки: <br>"+
		"[B][CENTER][COLOR=lavender] - Совместные тренировки:  <br>"+
		"[B][CENTER][COLOR=lavender] - Скриншот с /time: <br>"+
		"[B][CENTER][COLOR=lavender] - Ситуации (с любой Госс организации): ---------------------------------------------------------  <br>"+
		"[B][CENTER][COLOR=lavender] - Отыгранное время:  <br>"+
		"[B][CENTER][COLOR=lavender] 4) Дата:  <br>"+
        '[CENTER][url=https://postimages.org/][img]https://cdn.discordapp.com/attachments/624208658548391966/716998520300634182/1a28eebb5d98.gif[/img][/url]<br>',
	},
 {
	  title: '| Шаблон для сообщения о еженедельной норме. |',
	  content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zXwvN2pg/7s-PCNqz-T4dw.jpg[/img][/url]<br>' +
        '[CENTER][url=https://postimages.org/][img]https://cdn.discordapp.com/attachments/624208658548391966/716998520300634182/1a28eebb5d98.gif[/img][/url]<br>' +
		"[B][CENTER][COLOR=#00FFFF][ICODE]{{ greeting }},уважаемый Пользователь. [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] 1) Ваш NickName: Victor Norkin. <br>"+
		"[B][CENTER][COLOR=lavender] 2) Ваша организация: МВД  <br>"+
		"[B][CENTER][COLOR=lavender] 3) Скриншоты работы за неделю:  <br>"+
		"[B][CENTER][COLOR=lavender] - Cобеседования: ---------------------------------------------------------   <br>"+
		"[B][CENTER][COLOR=lavender] - РП Ситуации:   <br>"+
		"[B][CENTER][COLOR=lavender] - Лекции: ---------------------------------------------------------   <br>"+
		"[B][CENTER][COLOR=lavender] - Тренировки:   <br>"+
		"[B][CENTER][COLOR=lavender] - Совместные тренировки:  <br>"+
		"[B][CENTER][COLOR=lavender] - Глобальная РП ситуация: <br>"+
		"[B][CENTER][COLOR=lavender] 4) Дата: <br>"+
        '[CENTER][url=https://postimages.org/][img]https://cdn.discordapp.com/attachments/624208658548391966/716998520300634182/1a28eebb5d98.gif[/img][/url]<br>',
	},

];

$(document).ready(() => {
	// Загрузка скрипта для обработки шаблонов
	$('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');

	// Добавление кнопок при загрузке страницы
    addButton('📒 ШАБЛОНЧИКИ 📒', 'selectAnswer');

	// Поиск информации о теме
	const threadData = getThreadData();

	$('button#pin').click(() => editThreadData(PIN_PREFIX, false));
	$('button#accepted').click(() => editThreadData(ACCEPT_PREFIX, false));
	$('button#teamProject').click(() => editThreadData(COMMAND_PREFIX, false));
	$('button#unaccept').click(() => editThreadData(UNACCEPT_PREFIX, false));
    $('button#Zakrito').click(() => editThreadData(UNACCEPT_PREFIX, false));

	$(`button#selectAnswer`).click(() => {
		XF.alert(buttonsMarkup(buttons), null, 'Выберите ответ:');
		buttons.forEach((btn, id) => {
			if(id > 1) {
				$(`button#answers-${id}`).click(() => pasteContent(id, threadData, true));
			} else {
				$(`button#answers-${id}`).click(() => pasteContent(id, threadData, true));
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

	if(send == false){
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
	if(pin == false){
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