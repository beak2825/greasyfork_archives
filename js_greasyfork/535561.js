// ==UserScript==
// @name         Обжалования
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  ------
// @match        https://forum.blackrussia.online/threads/*
// @grant        none
// @license 	 MIT
// @icon https://forum.blackrussia.online/data/avatars/o/11/11193.jpg
// @downloadURL https://update.greasyfork.org/scripts/535561/%D0%9E%D0%B1%D0%B6%D0%B0%D0%BB%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D1%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/535561/%D0%9E%D0%B1%D0%B6%D0%B0%D0%BB%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D1%8F.meta.js
// ==/UserScript==

(function() {
    'use strict';
const UNACCEPT_PREFIX = 4;
const ACCEPT_PREFIX = 8;
const RASSMOTENO_PREFIX = 9;
const PIN_PREFIX = 2;
const GA_PREFIX = 12;
const COMMAND_PREFIX = 10;
const DECIDED_PREFIX = 6;
const WAIT_PREFIX = 14;
const WATCHED_PREFIX = 9;
const CLOSE_PREFIX = 7;
const SPECY_PREFIX = 11;
const TEX_PREFIX = 13;
const buttons = [
    {
      title: 'свой ответ',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#FFFF00]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#FFFF00][SIZE=5] . [/COLOR][/FONT][/CENTER]<br><br>" +
        '[CENTER][I][FONT=times new roman][COLOR=#FFFF00][SIZE=5]Закрыто. [/COLOR][/FONT][/CENTER]',
    },
    {
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴передам ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
      title: 'для га',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#E0FFFF][SIZE=5]Ваша жалоба была передана на рассмотрение [Color=#DC143C]Главному Администратору.[/COLOR] [/COLOR][/FONT]<br>[B][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG][/B][/CENTER] <br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#00FFFF][ICODE]Ожидайте ответа. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
      prefix: GA_PREFIX,
	  status: true,
    },
    {
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴Правила рп процесса ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
      title: 'Одобрено',
      content:
		'[CENTER][FONT=georgia][I][COLOR=rgb(239, 239, 239)]Здравствуйте, уважаемый игрок![/COLOR][/I][/FONT] <br><br>' +
        '[COLOR=rgb(204, 204, 204)][FONT=georgia][I][IMG width="386px"]https://i.postimg.cc/W4rc4yn5/YiSiNfV.png[/IMG]<br><br>' +
        'Вашем обжалований одобрено не совершайте подобных действий или следующий раз аккаунт разблокировать не получиться.[/I][/FONT][/COLOR]<br><br>' +
        '[FONT=georgia][I][COLOR=rgb(204, 204, 204)]Закрыто. [/COLOR][/I][/FONT][/CENTER]',
      prefix: CLOSE_PREFIX,
	  status: false,
    },
    {
      title: 'В вашем обжаловании отказано',
      content:
		'[CENTER][I][FONT=tahoma]Здравствуйте. <br><br>' +
        '[IMG width="499px"]https://i.postimg.cc/W4rc4yn5/YiSiNfV.png[/IMG][/FONT][/I]<br><br>' +
        '[FONT=tahoma][I][COLOR=rgb(204, 204, 204)]В вашем обжаловании отказано. Администрация не готова вам снизить наказание из-за грубых нарушений правил проекта.<br><br>' +
        'Владелец аккаунта несет полную ответственность за свой аккаунт и действия, совершенные с него. [/COLOR][/I][/FONT] <br><br>' +
        '[COLOR=rgb(153, 153, 153)][I][FONT=tahoma]За[/FONT][/I][/COLOR][COLOR=rgb(179, 179, 179)][I][FONT=tahoma]к[/FONT][/I][/COLOR][COLOR=rgb(204, 204, 204)][I][FONT=tahoma]р[/FONT][/I][/COLOR][COLOR=rgb(179, 179, 179)][I][FONT=tahoma]ы[/FONT][/I][/COLOR][COLOR=rgb(153, 153, 153)][I][FONT=tahoma]т[/FONT][/I][/COLOR][COLOR=rgb(128, 128, 128)][I][FONT=tahoma]о[/FONT][/I][/COLOR][COLOR=rgb(102, 102, 102)][I][FONT=tahoma].[/FONT][/I][/COLOR]<br><br>' +

        '[COLOR=rgb(184, 49, 47)][I][FONT=tahoma][IMG width="484px"]https://share.creavite.co/6771954f0ae0e4f686a63f47.gif[/IMG][/FONT][/I][/COLOR][/CENTER]',
      prefix: CLOSE_PREFIX,
	  status: false,
    },
    {
      title: 'На данный момент отказ',
      content:
		'[CENTER][FONT=trebuchet ms]Здравствуйте <br><br>' +
        ' К сожалению, на данный момент вам отказано в обжаловании.[/FONT]<br><br>' +
        '[COLOR=rgb(184, 49, 47)][FONT=trebuchet ms]Закрыто.[/FONT][/COLOR][/CENTER]<br><br>' +
        '[HR][/HR]<br><br>' +
        '[CENTER]<br><br>' +
        '[IMG width="652px"]https://share.creavite.co/6771954f0ae0e4f686a63f47.gif[/IMG][/CENTER]',
      prefix: CLOSE_PREFIX,
	  status: false,
    },
    {
      title: 'Вашем обжаловании одобрено',
      content:
		'[CENTER][I][FONT=tahoma]Здравствуйте. <br><br>' +
        '[IMG width="499px"]https://i.postimg.cc/W4rc4yn5/YiSiNfV.png[/IMG][/FONT][/I]<br><br>' +
        '[FONT=tahoma][I][COLOR=rgb(204, 204, 204)]Ваше обжалование Одобрено.<br><br>' +
        'Не совершайте больше подобных действий или в следующий раз обжаловать наказание не получится. [/COLOR][/I][/FONT]<br><br>' +
        '[COLOR=rgb(153, 153, 153)][I][FONT=tahoma]За[/FONT][/I][/COLOR][COLOR=rgb(179, 179, 179)][I][FONT=tahoma]к[/FONT][/I][/COLOR][COLOR=rgb(204, 204, 204)][I][FONT=tahoma]р[/FONT][/I][/COLOR][COLOR=rgb(179, 179, 179)][I][FONT=tahoma]ы[/FONT][/I][/COLOR][COLOR=rgb(153, 153, 153)][I][FONT=tahoma]т[/FONT][/I][/COLOR][COLOR=rgb(128, 128, 128)][I][FONT=tahoma]о[/FONT][/I][/COLOR][COLOR=rgb(102, 102, 102)][I][FONT=tahoma].[/FONT][/I][/COLOR]<br><br>' +

        '[COLOR=rgb(184, 49, 47)][I][FONT=tahoma][IMG width="484px"]https://share.creavite.co/6771954f0ae0e4f686a63f47.gif[/IMG][/FONT][/I][/COLOR][/CENTER]',
      prefix: CLOSE_PREFIX,
	  status: false,
    },
    {
      title: 'Подобные наказания не обжалуються',
      content:
		'[CENTER][COLOR=rgb(204, 204, 204)][SIZE=4][FONT=trebuchet ms]Здравствуйте[/FONT][/SIZE][/COLOR]<br><br>' +
        '[SIZE=4][FONT=trebuchet ms][IMG width="384px"]https://i.postimg.cc/W4rc4yn5/YiSiNfV.png[/IMG]<br><br>' +
        'Подобные наказания, как в вашем случае, в соответствии с правилами не подлежат обжалованию.<br><br>' +
        'Закрыто.[/FONT][/SIZE][/CENTER]',
      prefix: CLOSE_PREFIX,
	  status: false,
    },
    {
      title: 'нон рп обман возврат',
      content:
		'[CENTER][I][COLOR=rgb(255, 0, 0)]Здравствуйте, уважаемый игрок![/COLOR]<br><br>' +
        'На Вашем аккаунте обнаружено имущество, полученное нечестным путем. Чтобы разблокировать аккаунт, выполните следующие шаги:<br><br>' +
        '1. Найдите игрока, которого Вы обманули.<br><br>' +
        '2. Прикрепите скриншот переписок с обманутой стороной. и ссылки на тг или вк где вы обговаривали<br><br>' +
        '3. Договоритесь с ним о возврате имущества.<br><br>' +
        '4. Сделайте запись, подтверждающую возврат имущества. Запись должна содержать подтверждение того, что игрок является настоящим и согласен на возврат имущества.<br><br>' +
        '5. Подайте новое обжалование и в пункт "Доказательства" прикрепите запись с подтверждением возврата имущества вместе с окном блокировки аккаунта.<br><br>' +
        '[COLOR=rgb(204, 204, 204)]После этого мы рассмотрим Ваш запрос на разблокировку. Вам будет предоставлено 24 часа для завершения процесса возврата имущества и предоставления подтверждающей записи в той же теме.<br><br>' +
        'Спасибо за понимание.[/COLOR]<br><br>' +
        '[COLOR=rgb(255, 0, 0)]Закрыто.[/COLOR][/I][/CENTER]',
      prefix: CLOSE_PREFIX,
	  status: false,
    },
    {
      title: 'Одобрено бан за рекламу',
      content:
		'[CENTER][FONT=trebuchet ms]Здравствуйте<br><br>' +
        'Ваше обжалование одобрено. Пожалуйста, воздерживайтесь от подобных действий. Размещение своих социальных сетей в общественных местах считается рекламой, поэтому в следующий раз лучше делать это в более удалённых от других людей местах. [/FONT]<br><br>' +
        '[COLOR=rgb(184, 49, 47)][FONT=trebuchet ms]Закрыто.[/FONT][/COLOR][/CENTER]<br><br>' +
        '[HR][/HR]<br><br>' +
        '[CENTER]<br><br>' +
        '[IMG width="652px"]https://share.creavite.co/6771954f0ae0e4f686a63f47.gif[/IMG][/CENTER]',
      prefix: CLOSE_PREFIX,
	  status: false,
    },
   {
      title: 'замены текста сми нет',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#E0FFFF][SIZE=5]Нарушений со стороны игрока нет, все объявления редактировались по просьбе игроков [/COLOR][/FONT]<br>[B][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG][/B][/CENTER] <br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#FF0000][ICODE]Закрыто. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
      prefix: CLOSE_PREFIX,
	  status: false,
    },


];

$(document).ready(() => {
	// Загрузка скрипта для обработки шаблонов
	$('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');

	// Добавление кнопок при загрузке страницы
    addButton('На рассмотрение 🍁', 'pin');
    addButton('Га 🐰', 'Ga');
    addButton('Одобрено ✅', 'accepted');
    addButton('Отказано ❌', 'unaccept');
    addButton('Тех. Специалисту 🐣', 'Texy');
    addButton('Рассмотрено 👍', 'Rasmotreno');
    addButton('Закрыто 🏚', 'Close');
    addButton('Обжалования', 'selectAnswer');

	// Поиск информации о теме
	const threadData = getThreadData();

	$('button#pin').click(() => pasteContent(2, threadData, true));
	$('button#Ga').click(() => pasteContent(8, threadData, true));
	$('button#accepted').click(() => editThreadData(CLOSE_PREFIX, false));
	$('button#Texy').click(() => pasteContent(7, threadData, true));
	$('button#Rasmotreno').click(() => editThreadData(RASSMOTENO_PREFIX, false));
	$('button#Close').click(() => editThreadData(CLOSE_PREFIX, false));
	$('button#unaccept').click(() => editThreadData(UNACCEPT_PREFIX, false));


$(`button#selectAnswer`).click(() => {
XF.alert(buttonsMarkup(buttons), null, 'ВЫБЕРИТЕ ОТВЕТ');
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
            `<button type="button" class="button--primary button rippleButton" id="${id}" style="border-radius: 0px 20px; border-color: green; border-style: dashed solid; margin-right: 7px; margin-bottom: 10px; background: green; text-decoration-style: wavy;">${name}</button>`,
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