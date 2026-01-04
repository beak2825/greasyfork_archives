// ==UserScript==
// @name        ГС ГОСС Sonya_Phelps
// @namespace   https://forum.blackrussia.online
// @match       https://forum.blackrussia.online/threads/*
// @grant       none
// @version     1.2
// @license 	 MIT
// @author      DeLuna Mods
// @description 05.08.2024, 19:34:29
// @downloadURL https://update.greasyfork.org/scripts/502715/%D0%93%D0%A1%20%D0%93%D0%9E%D0%A1%D0%A1%20Sonya_Phelps.user.js
// @updateURL https://update.greasyfork.org/scripts/502715/%D0%93%D0%A1%20%D0%93%D0%9E%D0%A1%D0%A1%20Sonya_Phelps.meta.js
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
const TEX_PREFIX = 13;
const CLOSE_PREFIX = 7;
const buttons = [


{
title: 'не по форме',
content:
        '[FONT=Courier New][CENTER]Доброго времени суток, уважаемый {{ user.mention }}[/CENTER]' +
        "[CENTER]Ваша жалоба составлена не по форме, внимательно прочтите правила подачи жалобы на лидера. [/CENTER]<br>" +
        "[CENTER]Отказано, закрыто.[/CENTER]<br>" +
        "[CENTER]С уважением, главная следящая за государственными структурами Sonya_Phelps![/CENTER][/FONT]<br>" +
        '[CENTER][IMG width="165px"]https://koshka.top/uploads/posts/2021-12/1639879454_53-koshka-top-p-kotikov-smeshnikh-i-nyashnikh-55.jpg[/IMG][/CENTER]<br><br>',
},
{
title: 'Ошиблись разделом',
content: '[FONT=Courier New][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br>' +
         "[CENTER]Вы ошиблись разделом, внимательно прочитайте суть своей жалобы и выберите необходимый раздел.[/CENTER]<br>" +
         "[CENTER]Отказано, закрыто.[/CENTER]<br>" +
         "[CENTER]С уважением, главная следящая за государственными структурами Sonya_Phelps![/CENTER][/FONT]<br>" +
         '[IMG width="165px"]https://koshka.top/uploads/posts/2021-12/1638688485_71-koshka-top-p-kotik-milashka-79.jpg[/IMG][/CENTER]',
},
{
title: 'не жалоба',
content:
        '[FONT=Courier New][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br>' +
        "[CENTER]Созданная  вами тема никоим образом не относится к теме данного раздела. [/CENTER]<br>" +
        "[CENTER]Отказано,закрыто.[/CENTER]<br>" +
        "[CENTER]С уважением, главная следящая за государственными структурами Sonya_Phelps![/CENTER][/FONT]<br>" +
        '[CENTER][IMG width="165px"]https://avatars.mds.yandex.net/i?id=4f19a2d1abf3ae838ef4b29fac4e8ab6_l-5433078-images-thumbs&n=13[/IMG][/CENTER]',
},
{
title: 'Дублирование',
content:
        '[FONT=Courier New][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br>' +
        "[CENTER]Дублирование темы. Напоминаем, при 3 дублированиях – форумный аккаунт будет заблокирован. Ответ по вашей жалобе был дан ранее.<br>" +
        "[CENTER]Отказано, закрыто.[/CENTER]" +
        "[CENTER]С уважением, главная следящая за государственными структурами Sonya_Phelps[/CENTER][/FONT]<br>" +
        '[CENTER][IMG width="165px"]https://papik.pro/uploads/posts/2022-08/1661377153_56-papik-pro-p-kot-persik-stikeri-png-56.png[/IMG][/CENTER]',
},
 {
	  title: 'Нарушений у лд нет',
	  content:
    '[FONT=Courier New][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br>' +
	"[CENTER]Нарушений со стороны лидера нет.<br>" +
    "[CENTER]Отказано, закрыто.[/CENTER]<br>" +
    "[CENTER]С уважением, главная следящая за государственными структурами Sonya_Phelps![/CENTER][/FONT]<br>" +
    '[CENTER][IMG width="165px"]https://avatanplus.com/files/resources/original/5a774322e96c816161de408c.png[/IMG][/CENTER]',
},
 {
	  title: 'выговор лд',
	  content:
    '[FONT=Courier New][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br>' +
	"[CENTER]С лидером государственных структур была проведена строгая беседа.<br><br>" +
    "[CENTER]Спасибо за ваше обращение, закрыто.[/CENTER][/FONT]<br>" +
    "[CENTER]С уважением, главная следящая за государственными структурами Sonya_Phelps![/CENTER][/FONT]<br>" +
    '[CENTER][IMG width="165px"]https://vkklub.ru/_data/stickers/biscuit/sticker_vk_biscuit_037.png[/IMG][/CENTER]',
},
 {
	  title: 'выг правильно',
	  content:
    '[FONT=Courier New][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br>' +
	"[CENTER]Проверив доказательства лидера, было принято решение, что наказание выдано верно.<br>" +
    "[CENTER]Отказано, закрыто.[/CENTER]<br>" +
    "[CENTER]С уважением, главная следящая за государственными структурами Sonya_Phelps![/CENTER][/FONT]<br>" +
    '[CENTER][IMG width="165px"]https://papik.pro/grafic/uploads/posts/2023-04/1682310774_papik-pro-p-oi-stiker-vektor-12.png[/IMG][/CENTER]',
},
 {
	  title: 'выг неправильно',
	  content:
    '[FONT=Courier New][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br>' +
	"[CENTER]С лидером государственных структур была проведена профилактическая беседа.<br>" +
    "[CENTER]Спасибо за обращение, закрыто.[/CENTER]<br>" +
    "[CENTER]С уважением, главная следящая за государственными структурами Sonya_Phelps![/CENTER][/FONT]<br>" +
    '[CENTER][IMG width="165px"]https://papik.pro/grafic/uploads/posts/2023-04/1682310774_papik-pro-p-oi-stiker-vektor-12.png[/IMG][/FONT][/CENTER]',
},





	];

$(document).ready(() => {
	// Загрузка скрипта для обработки шаблонов
	$('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');

	// Добавление кнопок при загрузке страницы
	addButton('Меню', 'selectAnswer');

	// Поиск информации о теме
	const threadData = getThreadData();

	$('button#pin').click(() => editThreadData(PIN_PREFIX, true));
	$('button#accepted').click(() => editThreadData(ACCEPT_PREFIX, false));
	$('button#teamProject').click(() => editThreadData(COMMAND_PREFIX, true));
	$('button#unaccept').click(() => editThreadData(UNACCEPT_PREFIX, false));
	$('button#close').click(() => editThreadData(CLOSE_PREFIX, false));

	$(`button#selectAnswer`).click(() => {
		XF.alert(buttonsMarkup(buttons), null, 'Выберите ответ:');
		buttons.forEach((btn, id) => {
			if(id > 0) {
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