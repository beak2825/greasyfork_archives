// ==UserScript==
// @name         ANAPA Главный следящий | Заместитель главного следящего by C.Dark
// @namespace    https://forum.blackrussia.online
// @version      1.8
// @description  Для ГС/ЗГС
// @author       Christopher_Dark
// @match        https://forum.blackrussia.online/threads/*
// @include      https://forum.blackrussia.online/threads/
// @grant        none
// @license 	 MIT
// @collaborator Quenk269
// @icon https://icons.iconarchive.com/icons/papirus-team/papirus-apps/48/emerald-theme-manager-icon-icon.png
// @downloadURL https://update.greasyfork.org/scripts/494187/ANAPA%20%D0%93%D0%BB%D0%B0%D0%B2%D0%BD%D1%8B%D0%B9%20%D1%81%D0%BB%D0%B5%D0%B4%D1%8F%D1%89%D0%B8%D0%B9%20%7C%20%D0%97%D0%B0%D0%BC%D0%B5%D1%81%D1%82%D0%B8%D1%82%D0%B5%D0%BB%D1%8C%20%D0%B3%D0%BB%D0%B0%D0%B2%D0%BD%D0%BE%D0%B3%D0%BE%20%D1%81%D0%BB%D0%B5%D0%B4%D1%8F%D1%89%D0%B5%D0%B3%D0%BE%20by%20CDark.user.js
// @updateURL https://update.greasyfork.org/scripts/494187/ANAPA%20%D0%93%D0%BB%D0%B0%D0%B2%D0%BD%D1%8B%D0%B9%20%D1%81%D0%BB%D0%B5%D0%B4%D1%8F%D1%89%D0%B8%D0%B9%20%7C%20%D0%97%D0%B0%D0%BC%D0%B5%D1%81%D1%82%D0%B8%D1%82%D0%B5%D0%BB%D1%8C%20%D0%B3%D0%BB%D0%B0%D0%B2%D0%BD%D0%BE%D0%B3%D0%BE%20%D1%81%D0%BB%D0%B5%D0%B4%D1%8F%D1%89%D0%B5%D0%B3%D0%BE%20by%20CDark.meta.js
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
const CLOSE_PREFIX = 7;
const SPECIAL_PREFIX = 11;
const TECH_PREFIX = 13;
const buttons = [
    {
       },
       {
        title: '----╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴ИТОГИ------------- ------------------╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
	    },
        {
        title: '| ИТОГИ |',
	  content:
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>"+
		"[B][CENTER][FONT=georgia][COLOR=#ff0000] Здравстсвуйте уважаемые игроки [/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=georgia][COLOR=lavender]Список [COLOR=#00ff00]одобренных[COLOR=lavender] кандидатов:"+
        "[B][CENTER][FONT=georgia][COLOR=lavender]*ОДОБРЕННЫЕ [/CENTER][/FONT][/COLOR][/B]"+
        "[B][CENTER][FONT=georgia][COLOR=lavender]Список [COLOR=#ff0000] отказанных[COLOR=lavender] кандидатов:"+
        "[B][CENTER][FONT=georgia][COLOR=lavender]*ОТКАЗАННЫЕ* [/CENTER][/FONT][/COLOR][/B]"+
        "[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br>"+
        "[B][CENTER][FONT=georgia][COLOR=lavender]Обзвон будет назначен в группе кандидатов на пост Лидера, он будет проходить в официальном дискорд канале сервера [URL='https://discord.gg/Q4b9q2nD9j'][Color=lavender]Кликабельно[/URL]."+
        "[B][CENTER][FONT=georgia][COLOR=RED]Убедительная просьба не опаздывать"+
        "[B][CENTER][FONT=georgia][COLOR=lavender]VK Главного Следящего - [URL='https://vk.com/id593310097'][Color=lavender]Кликабельно[/URL]."+
        "[B][CENTER][FONT=georgia][COLOR=lavender]VK Заместителя Главного Следящего - [URL=' https://vk.com/id353665102'][Color=lavender]Кликабельно[/URL]",
    },
    {
	title: '----╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴ Жб на лидера  ------------------╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
	},
    {
	   title: '| Приветствие |',
	  content:
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>"+
		"[B][CENTER][FONT=georgia][COLOR=#2222ff][ICODE]{{ greeting }} {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] [/CENTER][/COLOR][/B]",
    },
	{
        title: '| Беседа с лд |',
	  content:
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>"+
        '[SIZE=4][CENTER][B][FONT=georgia]{{ greeting }}, {{ user.mention }}.[CENTER][/FONT][/B][/SIZE]'+
        "[B][CENTER][FONT=georgia][COLOR=#ff0000]С лидером будет проведена беседа.[/COLOR][/CENTER][/B]"+
        "[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br>"+
        "[B][COLOR=#00FF00][CENTER][ICODE]Одобрено.[/ICODE][/B][/COLOR][/CENTER]",
        prefix: ACCEPT_PREFIX,
	  status: false,
	 },
     {
        title: 'Приветствие',
        content:
          '[SIZE=4][CENTER][B][FONT=georgia]{{ greeting }}, {{ user.mention }}.[/FONT][/B][/SIZE]'+
         "[B][CENTER][FONT=georgia][COLOR=lavender] {{ greeting }} {{ user.name }} [/COLOR][/CENTER][/B]<br><br>",
        },
        {
     }
];

$(document).ready(() => {
	// Загрузка скрипта для обработки шаблонов
	$('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');

	// Добавление кнопок при загрузке страницы

	addButton('Закрыть', 'closed');
    addButton('Меню', 'selectAnswer');


	// Поиск информации о теме
	const threadData = getThreadData();

	$('button#pin').click(() => editThreadData(PIN_PREFIX, true));
	$('button#accepted').click(() => editThreadData(ACCEPT_PREFIX, false));
	$(`button#teamProject`).click(() => editThreadData(COMMAND_PREFIX, true));
	$(`button#techspec`).click(() => editThreadData( TECH_PREFIX , true));
	$(`button#watched`).click(() => editThreadData(WATCHED_PREFIX, false));
	$(`button#unaccept`).click(() => editThreadData(UNACCEPT_PREFIX, false));
	$(`button#mainAdmin`).click(() => editThreadData(GA_PREFIX, true));

	$(`button#specialAdmin`).click(() => editThreadData(SPECIAL_PREFIX, true));

	$('button#unaccept').click(() => editThreadData(UNACCEPT_PREFIX, false));

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
	  ? 'Доброе утро, уважаемый(ая)'
	  : 11 < hours && hours <= 15
	  ? 'Добрый день, уважаемый(ая)'
	  : 15 < hours && hours <= 21
	  ? 'Добрый вечер, уважаемый(ая)'
	  : 'Доброй ночи, уважаемый(ая)',
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