// ==UserScript==
// @name         FORUM
// @namespach https://forum.blackrussia.online/index.php?forums/%D0%A1%D0%B5%D1%80%D0%B2%D0%B5%D1%80-%E2%84%9632-krasnodar.1461/
// @version      2.54
// @description  mironovv
// @author       mironovv
// @match        https://forum.blackrussia.online/*
// @icon         https://forum.blackrussia.online/
// @grant        none
// @license 	 MIT
// @collaborator none
// @icon https://icons.iconarchive.com/icons/papirus-team/papirus-apps/48/emerald-theme-manager-icon-icon.png
// @updateURL
// @namespace https://forum.blackrussia.online/index.php?forums/%D0%A1%D0%B5%D1%80%D0%B2%D0%B5%D1%80-%E2%84%9632-krasnodar.1461/
// @downloadURL https://update.greasyfork.org/scripts/504108/FORUM.user.js
// @updateURL https://update.greasyfork.org/scripts/504108/FORUM.meta.js
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
      title: '⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀НАСТРОЙКИ⠀⠀'
    },
    {
	  title: 'КЕФИРР',
	  content:
		"[CENTER][FONT=trebuchet ms][COLOR=rgb(255, 0, 0)][SIZE=4]Приветствую[/SIZE][/COLOR]<br><br>"+
		"[SIZE=4]КЕФИРРР. [COLOR=rgb(255, 0, 0)]КЕФИРРРР вердикта[/COLOR][/SIZE][/FONT]<br><br>"+
        "Приятной игры на просторах [COLOR=rgb(0, 0, 0)]BLACK [/COLOR][COLOR=rgb(255, 0, 0)]RUSSIA [/COLOR][COLOR=rgb(255, 255, 255)]KRASNODAR[/COLOR][/CENTER]",
	  prefix: PIN_PREFIX,
	  status: true
	},
        {
	  title: 'НА РАССМОТРЕНИЕ',
	  content:
		"[CENTER][FONT=trebuchet ms][COLOR=rgb(255, 0, 0)][SIZE=4]Приветствую[/SIZE][/COLOR]<br><br>"+
		"[SIZE=4]Тема поставлена на рассмотрение. [COLOR=rgb(255, 0, 0)]Ожидайте вердикта, создавать новые темы не нужно.[/COLOR][/SIZE][/FONT]",
	  prefix: PIN_PREFIX,
	  status: true
	},
	{
	  title: 'ПЕРЕДАТЬ ЗГА',
	  content:
		"[CENTER][FONT=trebuchet ms][COLOR=rgb(255, 0, 0)][SIZE=4]Приветствую[/SIZE][/COLOR]<br><br>"+
		"[SIZE=4]Тема передана на рассмотрение Заместителю Главного Администратора. [COLOR=rgb(255, 0, 0)]Ожидайте вердикта, создавать новые темы не нужно.[/COLOR][/SIZE][/FONT]",
	  prefix: PIN_PREFIX,
	  status: true
	},
	{
      title: '⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀Жалобы на⠀⠀ АДМ⠀⠀⠀⠀'
        },
    
   {
        title: 'НЕ ПРАВ GAME',
        content:
        "[CENTER][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=trebuchet ms]Приветствую[/FONT][/COLOR]<br><br>"+
        "[FONT=trebuchet ms]После проверки доказательств и рассмотрения ситуации, принято решение:<br><br>"+
        "[QUOTE] Наказание будет снято, с администратором будет проведена необходимая работа.[/QUOTE]<br>"+
        "[COLOR=rgb(255, 0, 0)]Одобрено, Закрыто.[/COLOR][/FONT][/SIZE]<br><br>"+
        "[FONT=trebuchet ms][SIZE=4]Приятной игры на просторах [COLOR=rgb(0, 0, 0)]BLACK [/COLOR][COLOR=rgb(255, 0, 0)]RUSSIA [/COLOR][COLOR=rgb(255, 255, 255)]KRASNODAR[/COLOR][/SIZE][/FONT][/CENTER]",
        prefix: ACCEPT_PREFIX,
        status: false
    },
    {
              title: 'НАКАЗАНИЕ БУДЕТ СНЯТО',
        content:
        "[CENTER][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=trebuchet ms]Приветствую[/FONT][/COLOR]<br><br>"+
        "[FONT=trebuchet ms] После разбора ситуации, принято решение:<br><br>"+
        "[QUOTE] Наказание будет снято. Приносим свои извинения за доставленные неудобства.[/QUOTE]<br>"+
        "[COLOR=rgb(255, 0, 0)] Одобрено, Закрыто.[/COLOR][/FONT][/SIZE]<br><br>"+
        "[FONT=trebuchet ms][SIZE=4]Приятной игры на просторах [COLOR=rgb(0, 0, 0)]BLACK [/COLOR][COLOR=rgb(255, 0, 0)]RUSSIA [/COLOR][COLOR=rgb(255, 255, 255)]KRASNODAR[/COLOR][/SIZE][/FONT][/CENTER]",
        prefix: ACCEPT_PREFIX,
        status: false
    },
    {
              title: 'ПРАВ GAME',
        content:
        "[CENTER][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=trebuchet ms]Приветствую[/FONT][/COLOR]<br><br>"+
        "[FONT=trebuchet ms]После проверки доказательств и рассмотрения ситуации, принято решение:<br><br>"+
        "[QUOTE] Наказание выдано верно, нарушения со стороны администратора нет.[/QUOTE]<br>"+
        "[COLOR=rgb(255, 0, 0)] Отказано, Закрыто.[/COLOR][/FONT][/SIZE]<br><br>"+
        "[FONT=trebuchet ms][SIZE=4]Приятной игры на просторах [COLOR=rgb(0, 0, 0)]BLACK [/COLOR][COLOR=rgb(255, 0, 0)]RUSSIA [/COLOR][COLOR=rgb(255, 255, 255)]KRASNODAR[/COLOR][/SIZE][/FONT][/CENTER]",
        prefix: CLOSE_PREFIX,
        status: false
    },
    {
              title: 'ВЕРДИК ВЕРНЫЙ',
        content:
        "[CENTER][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=trebuchet ms]Приветствую[/FONT][/COLOR]<br><br>"+
        "[FONT=trebuchet ms] После перепроверки доказательств, принято решение:<br><br>"+
        "[QUOTE] Вердикт от Администратора вынесен верно, нарушений по этому поводу не обнаружено.[/QUOTE]<br>"+
        "[COLOR=rgb(255, 0, 0)] Отказано, Закрыто.[/COLOR][/FONT][/SIZE]<br><br>"+
        "[FONT=trebuchet ms][SIZE=4]Приятной игры на просторах [COLOR=rgb(0, 0, 0)]BLACK [/COLOR][COLOR=rgb(255, 0, 0)]RUSSIA [/COLOR][COLOR=rgb(255, 255, 255)]KRASNODAR[/COLOR][/SIZE][/FONT][/CENTER]",
        prefix: CLOSE_PREFIX,
        status: false
    },
    {
              title: 'БАН ip',
        content:
        "[CENTER][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=trebuchet ms]Приветствую[/FONT][/COLOR]<br><br>"+
        "[FONT=trebuchet ms]IP адрес был заблокирован не вам, вы случайно попали на заблокированный IP, попробуйте перезагрузить свой мобильный интернет или интернет-роутер. В случае если проблема останется, пересоздайте тему.<br>"+
        "[COLOR=rgb(255, 0, 0)] Рассмотрено, Закрыто.[/COLOR][/FONT][/SIZE]<br><br>"+
        "[FONT=trebuchet ms][SIZE=4]Приятной игры на просторах [COLOR=rgb(0, 0, 0)]BLACK [/COLOR][COLOR=rgb(255, 0, 0)]RUSSIA [/COLOR][COLOR=rgb(255, 255, 255)]KRASNODAR[/COLOR][/SIZE][/FONT][/CENTER]",
        prefix: CLOSE_PREFIX,
        status: false
    },
    {
              title: 'БАН ip+га',
        content:
        "[CENTER][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=trebuchet ms]Приветствую[/FONT][/COLOR]<br><br>"+
        "[FONT=trebuchet ms]IP адрес был заблокирован не вам, вы случайно попали на заблокированный IP, попробуйте перезагрузить свой мобильный интернет или интернет-роутер.<br>"+
        "[FONT=trebuchet ms][SIZE=4]Тема передана [COLOR=rgb(0, 0, 0)]Главному Администратору[/COLOR][COLOR=rgb(255, 0, 0)]RUSSIA [/COLOR][COLOR=rgb(255, 255, 255)], ожидайте вердикта.[/COLOR][/SIZE][/FONT][/CENTER]",
        prefix: mainAdmin_PREFIX,
        status: true
    },
    {
        title: 'ОТ 3 ЛИЦ',
        content:
        "[CENTER][FONT=trebuchet ms][COLOR=rgb(255, 0, 0)]Приветствую[/COLOR]<br><br>"+
        "Жалобы от 3-х лиц не принимаются.<br><br>"+
        "[COLOR=rgb(255, 0, 0)]Отказано. Закрыто [/COLOR][/FONT]<br><br>"+
        "Приятной игры на просторах [COLOR=rgb(0, 0, 0)]BLACK [/COLOR][COLOR=rgb(255, 0, 0)]RUSSIA [/COLOR][COLOR=rgb(255, 255, 255)]KRASNODAR[/COLOR][/CENTER]",
        prefix: CLOSE_PREFIX,
        status: false
    },
    {
      title: 'НЕТ ДОКВ',
      content:
        "[CENTER][COLOR=rgb(255, 0, 0)][FONT=trebuchet ms][SIZE=4]Приветствую[/FONT][/COLOR]<br><br>"+
        "В теме отсутствуют доказательства. Используйте любой бесплатный фотохостинг браузера (Imbb,Youtube,Imgur,Postimages).<br><br>"+
        "[COLOR=rgb(255, 0, 0)][FONT=trebuchet ms][SIZE=4]Отказано. Закрыто[/FONT][/COLOR]<br><br>"+
        "Приятной игры на просторах [COLOR=rgb(0, 0, 0)]BLACK [/COLOR][COLOR=rgb(255, 0, 0)]RUSSIA [/COLOR][COLOR=rgb(255, 255, 255)]KRASNODAR[/COLOR][/CENTER]",
      prefix: CLOSE_PREFIX,
      status: false
    },
    {
      title: 'ДОКВА ОТРЕДАК-НЫ',
      content:
        "[CENTER][COLOR=rgb(255, 0, 0)][FONT=trebuchet ms][SIZE=4]Приветствую[/FONT][/COLOR]<br><br>"+
        "Ваши доказательства отредактированы из-за, чего жалоба не подлежит рассмотрению. Ваши доказательства должны иметь первоначальный вид, без каких-либо дополнений или корректировок.<br><br>"+
        "[COLOR=rgb(255, 0, 0)][FONT=trebuchet ms][SIZE=4]Отказано. Закрыто[/FONT][/COLOR]<br><br>"+
        "Приятной игры на просторах [COLOR=rgb(0, 0, 0)]BLACK [/COLOR][COLOR=rgb(255, 0, 0)]RUSSIA [/COLOR][COLOR=rgb(255, 255, 255)]KRASNODAR[/COLOR][/CENTER]",
      prefix: CLOSE_PREFIX,
      status: false
    },
    {
        title: 'НЕПОФОРМЕ',
        content:
        "[CENTER][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=trebuchet ms]Приветствую[/FONT][/COLOR]<br><br>"+
        "[FONT=trebuchet ms]Ваша тема не соответствует формату подачи жалоб на администрацию. Ознакомьтесь с правилами подачи жалоб и обратитесь повторно<br>"+
        "Правила подачи жалоб - [URL='https://forum.blackrussia.online/threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BF%D0%BE%D0%B4%D0%B0%D1%87%D0%B8-%D0%B6%D0%B0%D0%BB%D0%BE%D0%B1-%D0%BD%D0%B0-%D0%B0%D0%B4%D0%BC%D0%B8%D0%BD%D0%B8%D1%81%D1%82%D1%80%D0%B0%D1%86%D0%B8%D1%8E.3131972/']*ссылка*[/URL][/FONT]<br><br>"+
        "[COLOR=rgb(255, 0, 0)][FONT=trebuchet ms]Отказано. Закрыто[/FONT][/COLOR][/SIZE]<br><br>"+
        "Приятной игры на просторах [COLOR=rgb(0, 0, 0)]BLACK [/COLOR][COLOR=rgb(255, 0, 0)]RUSSIA [/COLOR][COLOR=rgb(255, 255, 255)]KRASNODAR[/COLOR][/CENTER]",
        prefix: CLOSE_PREFIX,
        status: false
    },
    {
        title: 'ПЕРЕНАПР К ТЕХУ',
        content:
        "[CENTER][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=trebuchet ms]Приветствую[/FONT][/COLOR][/SIZE]<br><br>"+
        "[FONT=trebuchet ms][SIZE=4]Вы ошиблись разделом сервера, данная ситуация относится к Техническим Специалистам.<br><br>"+
        "[COLOR=rgb(255, 0, 0)] Перенаправляю вашу жалобу в нужный раздел, ожидайте ответа.[/COLOR]<br><br>"+
        "Приятной игры на просторах [COLOR=rgb(0, 0, 0)]BLACK [/COLOR][COLOR=rgb(255, 0, 0)]RUSSIA [/COLOR][COLOR=rgb(255, 255, 255)]KRASNODAR[/COLOR][/SIZE][/FONT][/CENTER]<br><br>",
        prefix: WATCHED_PREFIX,
        status: false
    },
    {
        title: 'ПРОШЛО 72 ЧАСА',
        content:
        "[CENTER][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=trebuchet ms]Приветствую[/FONT][/COLOR][/SIZE]<br><br>"+
        "[FONT=trebuchet ms][SIZE=4]С момента получения наказания прошло более 72-х часов, в связи с чем жалоба не подлежит рассмотрению<br><br>"+
        "[COLOR=rgb(255, 0, 0)]Отказано. Закрыто[/COLOR]<br><br>"+
        "Приятной игры на просторах [COLOR=rgb(0, 0, 0)]BLACK [/COLOR][COLOR=rgb(255, 0, 0)]RUSSIA [/COLOR][COLOR=rgb(255, 255, 255)]KRASNODAR[/COLOR][/SIZE][/FONT][/CENTER]<br><br>",
        prefix: CLOSE_PREFIX,
        status: false
    },
    {
        title: 'ДОКВ В СОЦ СЕТЯХ',
        content:
        "[CENTER][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=trebuchet ms]Приветствую[/FONT][/COLOR][/SIZE]<br><br>"+
        "[FONT=trebuchet ms][SIZE=4]Запрещено выкладывать доказательства в социальные сети<br>"+
        "Обратитесь повторно, загрузив доказательства на любой бесплатный фотохостинг браузера (Imbb,Youtube,Imgur,Postimages).<br><br>"+
        "[COLOR=rgb(255, 0, 0)]Отказано. Закрыто[/COLOR]<br><br>"+
        "Приятной игры на просторах [COLOR=rgb(0, 0, 0)]BLACK [/COLOR][COLOR=rgb(255, 0, 0)]RUSSIA [/COLOR][COLOR=rgb(255, 255, 255)]KRASNODAR[/COLOR][/SIZE][/FONT][/CENTER]",
        prefix: CLOSE_PREFIX,
        status: false
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
})()