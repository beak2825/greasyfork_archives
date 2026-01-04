// ==UserScript==
// @name         VOLGOGRAD | Скрипт для доп. разделов
// @namespace    https://forum.blackrussia.online
// @version      5.8
// @description  Best Curators
// @author       Lucky Moonlight
// @match        https://forum.blackrussia.online/index.php?threads/*
// @include      https://forum.blackrussia.online/index.php?threads/
// @grant        none
// @license 	 MIT
// @copyright 2022,
// @downloadURL https://update.greasyfork.org/scripts/461446/VOLGOGRAD%20%7C%20%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%B4%D0%BE%D0%BF%20%D1%80%D0%B0%D0%B7%D0%B4%D0%B5%D0%BB%D0%BE%D0%B2.user.js
// @updateURL https://update.greasyfork.org/scripts/461446/VOLGOGRAD%20%7C%20%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%B4%D0%BE%D0%BF%20%D1%80%D0%B0%D0%B7%D0%B4%D0%B5%D0%BB%D0%BE%D0%B2.meta.js
// ==/UserScript==

(function () {
  'use strict';
const FAIL_PREFIX = 4;
const OKAY_PREFIX = 8;
const WAIT_PREFIX = 2;
const TECH_PREFIX = 13;
const WATCH_PREFIX = 9;
const CLOSE_PREFIX = 7;
const GA_PREFIX = 12;
const SA_PREFIX = 11;
const CP_PREFIX = 10;
const buttons = [
     {
	  title: '_____________________FAST ANS______________________',
	},
	{
	  title: '_____________________FAST ANS______________________',
	},
{
	  title: 'ОФФТОП',
	  content:
		'[SIZE=4][FONT=Georgia][CENTER]Здравствуйте,  {{ user.mention }}.[/CENTER]<br><br>' +
        "[CENTER]Ваше сообщение никаким образом не относится к теме данного раздела.[/CENTER]<br><br>" +
		'[CENTER]Отказано, закрыто.[/CENTER][/FONT][/SIZE]',
	  prefix: FAIL_PREFIX,
	  status: false,
	},
	 {
	  title: 'ЗАКРЕП | ДОПОЛНИТЕ',
	  content:
		'[SIZE=4][FONT=Georgia][CENTER]Здравствуйте,  {{ user.mention }}.[/CENTER]<br><br>' +
		"[CENTER]При рассмотрении вашей темы, были выявлены следующие ошибки:[/CENTER]<br><br>" +
		"[CENTER]На исправление ошибок дано 24 часа.[/CENTER][/FONT][/SIZE]",
	},
	{
	  title: 'НЕ ДОПОЛНИЛ',
	  content:
		'[SIZE=4][FONT=Georgia][CENTER]Здравствуйте,  {{ user.mention }}.[/CENTER]<br><br>' +
        "[CENTER]По истечению 24-х часов полного объёма изменений не последовало.[/CENTER]<br><br>" +
		'[CENTER]Отказано, закрыто.[/CENTER][/FONT][/SIZE]',
	  prefix: FAIL_PREFIX,
	  status: false,
	},
    {
	  title: 'ОТКАЗАНО | ОТВЕТ РАНЕЕ',
	  content:
		'[SIZE=4][FONT=Georgia][CENTER]Здравствуйте,  {{ user.mention }}.[/CENTER]<br><br>' +
        "[CENTER]Ответ вам был дан в предыдущей теме.[/CENTER]<br><br>" +
		'[CENTER]Отказано, закрыто.[/CENTER][/FONT][/SIZE]',
	  prefix: FAIL_PREFIX,
	  status: false,
	},
    {
	  title: '_____________________БИОГРАФИИ_____________________',
	},
	{
	  title: '_____________________БИОГРАФИИ_____________________',
	},
    {
	  title: 'RP BIO | ОДОБРЕНО',
	  content:
		'[SIZE=4][FONT=Georgia][CENTER]Здравствуйте,  {{ user.mention }}.[/CENTER]<br><br>' +
        "[CENTER]Ваша RolePlay биография проверена и одобрена.[/CENTER]<br><br>" +
		"[CENTER]Одобрено, закрыто.[/CENTER][/FONT][/SIZE]" +
		'[CENTER][FONT=Georgia][COLOR=rgb(255, 0, 0)][SIZE=5]Приятной игры и времяпровождение на сервере VOLGOGRAD (39)[/SIZE][/COLOR][/FONT][/CENTER]',
	  prefix: OKAY_PREFIX,
	  status: false,
	},
    {
	  title: 'RP BIO | ЗАГОЛОВОК',
	  content:
		'[SIZE=4][FONT=Georgia][CENTER]Здравствуйте,  {{ user.mention }}.[/CENTER]<br><br>' +
        "[CENTER]Название темы должно быть строго по данной форме: «RolePlay биография гражданина Имя Фамилия».[/CENTER]<br><br>" +
        "[CENTER]Подробнее о правилах составления RolePlay биографий можно ознакомиться тут → *[URL='https://forum.blackrussia.online/index.php?threads/volgograd-%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BF%D0%BE%D0%B4%D0%B0%D1%87%D0%B8-%D0%A0%D0%9F-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B9.4296596/']Кликабельно[/URL]*[/CENTER]<br>" +
		"[CENTER]Отказано, закрыто.[/CENTER][/FONT][/SIZE]" +
		'[CENTER][FONT=Georgia][COLOR=rgb(255, 0, 0)][SIZE=5]Приятной игры и времяпровождение на сервере VOLGOGRAD (39)[/SIZE][/COLOR][/FONT][/CENTER]',
	  prefix: FAIL_PREFIX,
	  status: false,
	},
    {
	  title: 'RP BIO | ПЕРВОЕ ЛИЦО',
	  content:
		'[SIZE=4][FONT=Georgia][CENTER]Здравствуйте,  {{ user.mention }}.[/CENTER]<br><br>' +
        "[CENTER]Повествование в вашей RolePlay биографии составлено от первого лица.[/CENTER]<br>" +
		"[CENTER]Подробнее о правилах составления RolePlay биографий можно ознакомиться тут → *[URL='https://forum.blackrussia.online/index.php?threads/volgograd-%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BF%D0%BE%D0%B4%D0%B0%D1%87%D0%B8-%D0%A0%D0%9F-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B9.4296596/']Кликабельно[/URL]*[/CENTER]<br><br>" +
		"[CENTER]Отказано, закрыто.[/CENTER][/FONT][/SIZE]" +
		'[CENTER][FONT=Georgia][COLOR=rgb(255, 0, 0)][SIZE=5]Приятной игры и времяпровождение на сервере VOLGOGRAD (39)[/SIZE][/COLOR][/FONT][/CENTER]',
	  prefix: FAIL_PREFIX,
	  status: false,
	},
    {
	  title: 'RP BIO | КОПИПАСТ',
	  content:
		'[SIZE=4][FONT=Georgia][CENTER]Здравствуйте,  {{ user.mention }}.[/CENTER]<br><br>' +
        "[CENTER]Ваша RolePlay биография скопирована или слишком схожа с одной из предыдущих.[/CENTER]<br>" +
		"[CENTER]Подробнее о правилах составления RolePlay биографий можно ознакомиться тут → *[URL='https://forum.blackrussia.online/index.php?threads/volgograd-%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BF%D0%BE%D0%B4%D0%B0%D1%87%D0%B8-%D0%A0%D0%9F-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B9.4296596/']Кликабельно[/URL]*[/CENTER]<br><br>" +
		"[CENTER]Отказано, закрыто.[/CENTER][/FONT][/SIZE]" +
		'[CENTER][FONT=Georgia][COLOR=rgb(255, 0, 0)][SIZE=5]Приятной игры и времяпровождение на сервере VOLGOGRAD (39)[/SIZE][/COLOR][/FONT][/CENTER]',
    prefix: FAIL_PREFIX,
	  status: false,
	},
    {
	  title: 'RP BIO | ГРАМ ОШИБКИ',
	  content:
		'[SIZE=4][FONT=Georgia][CENTER]Здравствуйте,  {{ user.mention }}.[/CENTER]<br><br>' +
        "[CENTER]В вашей теме допущено слишком много грамматических ошибок.[/CENTER]<br>" +
		"[CENTER]Отказано, закрыто.[/CENTER][/FONT][/SIZE]" +
		'[CENTER][FONT=Georgia][COLOR=rgb(255, 0, 0)][SIZE=5]Приятной игры и времяпровождение на сервере VOLGOGRAD (39)[/SIZE][/COLOR][/FONT][/CENTER]',
	  prefix: FAIL_PREFIX,
	  status: false,
	},
	  {
	  title: 'RP BIO | ВОЗРАСТ',
	  content:
		'[SIZE=4][FONT=Georgia][CENTER]Здравствуйте,  {{ user.mention }}.[/CENTER]<br><br>' +
        "[CENTER]В вашей биографии возраст не совпадает с датой рождения персонажа.[/CENTER]<br><br>" +
		"[CENTER]Отказано, закрыто.[/CENTER][/FONT][/SIZE]" +
		'[CENTER][FONT=trebuchet ms][COLOR=rgb(255, 0, 0)][SIZE=5]Приятной игры и времяпровождение на сервере VOLGOGRAD (39)[/SIZE][/COLOR][/FONT][/CENTER]',
	  prefix: FAIL_PREFIX,
	  status: false,
	},
   {
	  title: 'RP BIO | МАЛО ИНФО',
	  content:
		'[SIZE=4][FONT=Georgia][CENTER]Здравствуйте,  {{ user.mention }}.[/CENTER]<br><br>' +
        "[CENTER]В составленной вами биографии, недостаточно информации о повестововании персонажа.[/CENTER]<br>" +
		"[CENTER]Дополните информацию и создайте новую тему.[/CENTER]<br><br>" +
		'[CENTER]Отказано, закрыто.[/CENTER][/FONT][/SIZE]',
	  prefix: FAIL_PREFIX,
	  status: false,
	},
	 {
	  title: 'RP BIO | НЕ ПО ФОРМЕ',
	  content:
		'[SIZE=4][FONT=Georgia][CENTER]Здравствуйте,  {{ user.mention }}.[/CENTER]<br><br>' +
        "[CENTER]Ваша RolePlay биография ссоставлена не по форме.[/CENTER]<br>" +
		"[CENTER]Подробнее о правилах составления RolePlay биографий можно ознакомиться тут → *[URL='https://forum.blackrussia.online/index.php?threads/volgograd-%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BF%D0%BE%D0%B4%D0%B0%D1%87%D0%B8-%D0%A0%D0%9F-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B9.4296596/']Кликабельно[/URL]*[/CENTER]<br><br>" +
		"[CENTER]Отказано, закрыто.[/CENTER][/FONT][/SIZE]" +
		'[CENTER][FONT=Georgia][COLOR=rgb(255, 0, 0)][SIZE=5]Приятной игры и времяпровождение на сервере VOLGOGRAD (39)[/SIZE][/COLOR][/FONT][/CENTER]',
prefix: FAIL_PREFIX,
	  status: false,
	},
    {
	  title: '____________________ОСТАЛЬНОЕ____________________',
	},
    {
	  title: '____________________ОСТАЛЬНОЕ____________________',
	},
    {
	  title: 'ОДОБРЕНО | СИТУАЦИЯ',
	  content:
		'[SIZE=4][FONT=Georgia][CENTER]Здравствуйте,  {{ user.mention }}.[/CENTER]<br><br>' +
        "[CENTER]Ваша RolePlay ситуация проверена и одобрена.[/CENTER]<br><br>" +
		"[CENTER]Одобрено, закрыто.[/CENTER][/FONT][/SIZE]" +
	    '[CENTER][FONT=trebuchet ms][COLOR=rgb(255, 0, 0)][SIZE=5]Приятной игры и времяпровождение на сервере VOLGOGRAD (39)[/SIZE][/COLOR][/FONT][/CENTER]',
	  prefix: OKAY_PREFIX,
	  status: false,
	},
	  {
	  title: 'СИТУАЦИЯ | НЕВЕРНОЕ РП',
	  content:
		'[SIZE=4][FONT=Georgia][CENTER]Здравствуйте,  {{ user.mention }}.[/CENTER]<br><br>' +
        "[CENTER]Вы неверно отыграли RP ситуацию.[/CENTER]<br><br>" +
		"[CENTER]Подробнее о правилах вы можете ознакомиться тут → [URL='https://forum.blackrussia.online/index.php?threads/volgograd-Правила-подачи-roleplay-ситуаций.4296557/']Кликабельно[/URL]*[/CENTER]<br><br>" +
		"[CENTER]Отказано, закрыто.[/CENTER][/FONT][/SIZE]" +
		'[CENTER][FONT=trebuchet ms][COLOR=rgb(255, 0, 0)][SIZE=5]Приятной игры и времяпровождение на сервере VOLGOGRAD (39)[/SIZE][/COLOR][/FONT][/CENTER]',
	  prefix: FAIL_PREFIX,
	  status: false,
	},
    {
	  title: 'ОДОБРЕНО | ОРГАНИЗАЦИЯ',
	  content:
		'[SIZE=4][FONT=Georgia][CENTER]Здравствуйте,  {{ user.mention }}.[/CENTER]<br><br>' +
        "[CENTER]Ваша RolePlay организация проверена и одобрена.[/CENTER]<br><br>" +
		'[CENTER]Одобрено, закрыто.[/CENTER][/FONT][/SIZE]',
	  prefix: OKAY_PREFIX,
	  status: false,
	},
	  {
	  title: 'ОРГАНИЗАЦИЯ | ЗАГОЛОВОК',
	  content:
		'[SIZE=4][FONT=Georgia][CENTER]Здравствуйте,  {{ user.mention }}.[/CENTER]<br><br>' +
        "[CENTER]Название темы должно быть строго по данной форме: ’’Название организации’’ | Дата создания.[/CENTER]<br><br>" +
		"[CENTER]Подробнее о правилах вы можете ознакомиться тут → [URL='https://forum.blackrussia.online/index.php?threads/volgograd-Правила-создания-неофициальной-roleplay-организации.4296728/']Кликабельно[/URL]*[/CENTER]<br><br>" +
		"[CENTER]Отказано, закрыто.[/CENTER][/FONT][/SIZE]" +
		'[CENTER][FONT=trebuchet ms][COLOR=rgb(255, 0, 0)][SIZE=5]Приятной игры и времяпровождение на сервере VOLGOGRAD (39)[/SIZE][/COLOR][/FONT][/CENTER]',
	  prefix: FAIL_PREFIX,
	  status: false,
	},
	 {
	  title: 'ОРГАНИЗАЦИЯ | НЕ ПО ФОРМЕ',
	  content:
		'[SIZE=4][FONT=Georgia][CENTER]Здравствуйте,  {{ user.mention }}.[/CENTER]<br><br>' +
        "[CENTER]Ваша неофициальная организация составлена не по форме.[/CENTER]<br><br>" +
		"[CENTER]Подробнее о правилах вы можете ознакомиться тут → [URL='https://forum.blackrussia.online/index.php?threads/volgograd-Правила-создания-неофициальной-roleplay-организации.4296728/']Кликабельно[/URL]*[/CENTER]<br><br>" +
		"[CENTER]Отказано, закрыто.[/CENTER][/FONT][/SIZE]" +
		'[CENTER][FONT=trebuchet ms][COLOR=rgb(255, 0, 0)][SIZE=5]Приятной игры и времяпровождение на сервере VOLGOGRAD (39)[/SIZE][/COLOR][/FONT][/CENTER]',
	  prefix: FAIL_PREFIX,
	  status: false,
	},
];

$(document).ready(() => {
	// Загрузка скрипта для обработки шаблонов
	$('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');

	addButton('ДОП РАЗДЕЛЫ', 'selectAnswer1');
    addButton('|', '');

	// Поиск информации о теме
	const threadData = getThreadData();

 $('button#pin').click(() => editThreadData(WAIT_PREFIX, true));
 $('button#tech').click(() => editThreadData(TECH_PREFIX, true));
 $('button#accepted').click(() => editThreadData(OKAY_PREFIX, false));
 $('button#watch').click(() => editThreadData(WATCH_PREFIX, false));
 $('button#close').click(() => editThreadData(CLOSE_PREFIX, false));
 $('button#unaccept').click(() => editThreadData(FAIL_PREFIX, false));

	$(`button#selectAnswer1`).click(() => {
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

function moveThread(prefix, type) {
// Перемещение темы в раздел окончательных ответов
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