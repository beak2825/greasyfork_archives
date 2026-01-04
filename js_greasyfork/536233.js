// ==UserScript==
// @name         Ответы
// @namespace    http://tampermonkey.net/
// @version      2.2R
// @description  Скрипт для упрощения работы кураторов форума на BlackRussia. Связь с разработчиком https://vk.com/kottvse https://vk.com/jaroslavgrasso
// @author       Ярослав Колмогорцев || Jaroslav_Grasso
// @match        https://forum.blackrussia.online/threads/*
// @grant        none
// @license 	 MIT
// @icon https://forum.blackrussia.online/data/avatars/o/0/3.jpg?1650124351
// @downloadURL https://update.greasyfork.org/scripts/536233/%D0%9E%D1%82%D0%B2%D0%B5%D1%82%D1%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/536233/%D0%9E%D1%82%D0%B2%D0%B5%D1%82%D1%8B.meta.js
// ==/UserScript==

//-----------------------------------------------------------------------------------------------------------------
//-------------------------------Жалобы на администрацию-----------------------------------------------------------
//-----------------------------------------------------------------------------------------------------------------

(function() {
    'use strict';
    const GGUNACCEPT_PREFIX = 4; //Префикс Отказано
    const GGACCEPT_PREFIX = 8; //Префикс Одобрено
    const GGRASSMOTENO_PREFIX = 9; //Префикс Рассмотрено
    const GGVAJNO_PREFIX = 1; //Префикс Важно
    const GGPIN_PREFIX = 2; //Префикс На рассмотрении
    const GGGA_PREFIX = 12; //Префикс Главному администратору
    const GGCOMMAND_PREFIX = 10;
    const GGDECIDED_PREFIX = 6;
    const GGWAIT_PREFIX = 14; //Префикс Ожидание
    const GGWATCHED_PREFIX = 9;
    const GGCLOSE_PREFIX = 7; //Префикс Закрыто
    const GGSPECY_PREFIX = 11;
    const GGTEX_PREFIX = 13; //Префикс Тех. Специалисту
const buttons5 = [
{
    title: 'Одобрено',
    content:
      '[CENTER][B][COLOR=WHITE]{{ greeting }}, ваша заявка получает статус - [/COLOR][COLOR=#00FF00][FONT=georgia][ICODE]Одобрено[/ICODE][/FONT][/COLOR][/B][/CENTER]',
},
{
    title: 'Отказано',
    content:
      '[CENTER][B][COLOR=WHITE]{{ greeting }}, ваша заявка получает статус - [/COLOR][COLOR=#FF0000][FONT=georgia][ICODE]Отказано[/ICODE][/FONT][/COLOR][/B][/CENTER]',
},
{
    title: '-',
    content:
      "[CENTER][B][COLOR=WHITE]{{ greeting }}, уважаемый[/COLOR][COLOR=#7800C9] [ICODE]{{ user.name }}[/ICODE][/COLOR][/B][/CENTER] <br><br>" +
      "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
      "[CENTER][B][COLOR=WHITE][FONT=georgia]Ваша жалоба взята на рассмотрение. <br> Не нужно создавать копии этой жалобы, ожидайте ответа в этой теме.[/FONT][/COLOR][/B][/CENTER] <br><br>" +
      "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
      "[CENTER][B][COLOR=#00FFFF][FONT=georgia][ICODE]Ожидайте ответа[/ICODE][/FONT][/COLOR][/B][/CENTER]",
    prefix: GGPIN_PREFIX,
 status: true,
},
{
  title: '-',
  content:
    "[CENTER][B][COLOR=WHITE]{{ greeting }}, уважаемый[/COLOR][COLOR=#7800C9] [ICODE]{{ user.name }}[/ICODE][/COLOR][/B][/CENTER] <br><br>" +
    "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
    "[CENTER][B][COLOR=WHITE][FONT=georgia]Запрошу доказательства у администратора. <br> Не нужно создавать копии этой жалобы, ожидайте ответа в этой теме.[/FONT][/COLOR][/B][/CENTER] <br><br>" +
    "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
    "[CENTER][B][COLOR=#00FFFF][FONT=georgia][ICODE]Ожидайте ответа[/ICODE][/FONT][/COLOR][/B][/CENTER]",
  prefix: GGPIN_PREFIX,
status: true,
},
{
  title: '-',
  content:
    "[CENTER][B][COLOR=WHITE]{{ greeting }}, уважаемый[/COLOR][COLOR=#7800C9] [ICODE]{{ user.name }}[/ICODE][/COLOR][/B][/CENTER] <br><br>" +
    "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
    "[CENTER][B][COLOR=WHITE][FONT=georgia]Проверив доказательства администратора, было принято решение, что наказание было выдано верно.[/FONT][/COLOR][/B][/CENTER] <br><br>" +
    "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
    "[CENTER][B][COLOR=#00FFFF][FONT=georgia][ICODE]Закрыто[/ICODE][/FONT][/COLOR][/B][/CENTER]",
  prefix: GGCLOSE_PREFIX,
status: false,
},
{
  title: '-',
  content:
    "[CENTER][B][COLOR=WHITE]{{ greeting }}, уважаемый[/COLOR][COLOR=#7800C9] [ICODE]{{ user.name }}[/ICODE][/COLOR][/B][/CENTER] <br><br>" +
    "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
    "[CENTER][B][COLOR=WHITE][FONT=georgia]В следствие беседы с администратором, было выяснено, что наказание было выдано по ошибке. <br> Ваше наказание будет снято.[/FONT][/COLOR][/B][/CENTER] <br><br>" +
    "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
    "[CENTER][B][COLOR=#00FF00][FONT=georgia][ICODE]Одобрено[/ICODE][/FONT][/COLOR][/B][/CENTER]",
  prefix: GGACCEPT_PREFIX,
status: false,
},
{
   title: '-',
},
{
  title: '-',
},
];

$(document).ready(() => {
	$('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');

    addButton('Ответы', 'selectAnswer5');

	const threadData = getThreadData();

$(`button#selectAnswer5`).click(() => {
XF.alert(buttonsMarkup(buttons5), null, 'Ответы');
buttons5.forEach((btn, id) => {
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
            `<button type="button" class="button--primary button rippleButton" id="${id}" style="border-radius: 20px 20px; border-color: MediumSpringGreen; border-style: double; margin-right: 7px; margin-bottom: 10px; background: SpringGreen; text-decoration-style: wavy;">${name}</button>`,
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
	const template = Handlebars.compile(buttons5[id].content);
	if ($('.fr-element.fr-view p').text() === '') $('.fr-element.fr-view p').empty();

	$('span.fr-placeholder').empty();
	$('div.fr-element.fr-view p').append(template(data));
	$('a.overlay-titleCloser').trigger('click');

	if(send == true){
		editThreadData(buttons5[id].prefix, buttons5[id].status);
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
	if(pin == 12345){
		fetch(`${document.URL}edit`, {
		  method: 'POST',
		  body: getFormData({
			prefix_id: prefix,
			title: threadTitle,
            discussion_open: 1,
			sticky: 0,
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