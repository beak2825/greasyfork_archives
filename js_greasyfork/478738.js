// ==UserScript==
// @name         Скрипт для гс/згс
// @namespace    https://forum.blackrussia.online
// @author       Не Владик
// @version      13.2
// @description  123
// @match        https://forum.blackrussia.online/*
// @include      https://forum.blackrussia.online/
// @grant        none
// @license 	 none
// @icon         none
// @updateURL
// @downloadURL https://update.greasyfork.org/scripts/478738/%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%B3%D1%81%D0%B7%D0%B3%D1%81.user.js
// @updateURL https://update.greasyfork.org/scripts/478738/%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%B3%D1%81%D0%B7%D0%B3%D1%81.meta.js
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

const START_DECOR = `<div style="text-align: center"><span style="font-family: 'Verdana'; font-size: 14px">`;
const END_DECOR = `</span></div>`;

const buttons = [
    {
	    title: 'Приветствие',
	    content:
	  	`${START_DECOR}Здравствуйте, {{ user.mention }}.<br><br><br><br><br><br>${END_DECOR}`
	  },
	  {
	    title: 'Рассмотрение',
	    content:
	  	  `${START_DECOR}Здравствуйте, {{ user.mention }}.<br><br>` +
	  	  "Ваша жалоба взята на рассмотрение. Пожалуйста, не создавайте копии тем.<br><br>" +
	  	  `Ожидайте ответа.${END_DECOR}`,
	    prefix: WAIT_PREFIX,
	    status: true,
	  },
	  {
	    title: 'Передать ЗГА',
	    content:
	  	  `${START_DECOR}Здравствуйте, {{ user.mention }}.<br><br>` +
	  	  "Ваша жалоба передана Заместителю Главного Администратора на рассмотрение.<br><br>" +
	  	  `Ожидайте ответа.${END_DECOR}`,
	    prefix: WAIT_PREFIX,
	    status: true,
	  },
	  {
	    title: 'Передать ГА',
	    content:
	  	  `${START_DECOR}Здравствуйте, {{ user.mention }}.<br><br>` +
	  	  "Ваша жалоба передана Главному Администратору на рассмотрение.<br><br>" +
	  	  `Ожидайте ответа.${END_DECOR}`,
	    prefix: GA_PREFIX,
	    status: true,
	  },
    {
	    title: 'Не по форме',
	    content:
	  	  `${START_DECOR}Здравствуйте, {{ user.mention }}.<br><br>` +
	  	  "Ваша жалоба составлена не по форме, ознакомьтесь с правилами подачи жалоб → *[URL='https://forum.blackrussia.online/threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BF%D0%BE%D0%B4%D0%B0%D1%87%D0%B8-%D0%B6%D0%B0%D0%BB%D0%BE%D0%B1-%D0%BD%D0%B0-%D0%BB%D0%B8%D0%B4%D0%B5%D1%80%D0%BE%D0%B2.3429391/']Кликабельно[/URL]*<br><br>" +
	  	  `Закрыто.${END_DECOR}`,
	    prefix: CLOSE_PREFIX,
	    status: false,
	  },
    {
	    title: 'Жб на сотрудников',
	    content:
	  	  `${START_DECOR}Здравствуйте, {{ user.mention }}.<br><br>` +
	  	  "Обратитесь в раздел жалоб на сотрудников. <br><br>" +
	  	  `Закрыто.${END_DECOR}`,
	    prefix: CLOSE_PREFIX,
	    status: false,
	  },
    {
	    title: 'Нет нарушений',
	    content:
	  	  `${START_DECOR}Здравствуйте, {{ user.mention }}.<br><br>` +
	  	  "Со стороны лидера нарушений нет.<br><br>" +
	  	  `Закрыто.${END_DECOR}`,
	    prefix: CLOSE_PREFIX,
	    status: false,
	  },
    {
	    title: 'Недостаточно док-в',
	    content:
	  	  `${START_DECOR}Здравствуйте, {{ user.mention }}.<br><br>` +
	  	  "В вашей жалобе не предоставлено достаточного объёма доказательств нарушений.<br><br>" +
	  	  `Закрыто.${END_DECOR}`,
	    prefix: CLOSE_PREFIX,
	    status: false,
	  },
    {
	    title: 'Нет доказательств',
	    content:
	  	  `${START_DECOR}Здравствуйте, {{ user.mention }}.<br><br>` +
	  	  "В вашей жалобе отсутствуют доказательства.<br><br>" +
	  	  `Закрыто.${END_DECOR}`,
	    prefix: CLOSE_PREFIX,
	    status: false,
	  },
    {
	    title: 'Загрузка док-в',
	    content:
	  	  `${START_DECOR}Здравствуйте, {{ user.mention }}.<br><br>` +
	  	  "Загрузите доказательства на любой фото/видео хостинг, например Imgur, Yapx, Youtube, и оставьте полученную ссылку в новой теме.<br><br>" +
	  	  `Закрыто.${END_DECOR}`,
	    prefix: CLOSE_PREFIX,
	    status: false,
	  },
    {
	    title: 'Док-ва в соц сетях',
	    content:
	  	  `${START_DECOR}Здравствуйте, {{ user.mention }}.<br><br>` +
	  	  "Загрузка доказательств в соц. сети (ВКонтакте, instagram) запрещается, доказательства должны быть загружены на фото/видео хостинги (YouTube, Япикс, Imgur).<br><br>" +
	  	  `Закрыто.${END_DECOR}`,
	    prefix: CLOSE_PREFIX,
	    status: false,
	  },
    {
	    title: 'Жалобы на игроков',
	    content:
	  	  `${START_DECOR}Здравствуйте, {{ user.mention }}.<br><br>` +
	  	  "Обратитесь в раздел жалоб на игроков → *[URL='https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B8%D0%B3%D1%80%D0%BE%D0%BA%D0%BE%D0%B2.2122/']Кликабельно[/URL]*<br><br>" +
        `Закрыто.${END_DECOR}`,
	    prefix: CLOSE_PREFIX,
	    status: false,
	  },
    {
	    title: 'В обжалования',
	    content:
	  	  `${START_DECOR}Здравствуйте, {{ user.mention }}.<br><br>` +
	  	  "Обратитесь в раздел обжалований наказаний → *[URL='https://forum.blackrussia.online/forums/%D0%9E%D0%B1%D0%B6%D0%B0%D0%BB%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D0%B5-%D0%BD%D0%B0%D0%BA%D0%B0%D0%B7%D0%B0%D0%BD%D0%B8%D0%B9.2123/']Кликабельно[/URL]*<br><br>" +
        `Закрыто.${END_DECOR}`,
	    prefix: CLOSE_PREFIX,
	    status: false,
	  },
    {
	    title: 'Не по теме',
	    content:
	  	  `${START_DECOR}Здравствуйте, {{ user.mention }}.<br><br>` +
	  	  "Ваше обращение не относится к теме данного раздела.<br><br>" +
	  	  `Закрыто.${END_DECOR}`,
	    prefix: CLOSE_PREFIX,
	    status: false,
	  },
    {
	    title: 'Ошиблись сервером',
	    content:
	  	  `${START_DECOR}Здравствуйте, {{ user.mention }}.<br><br>` +
	  	  "Пересоздайте жалобу в разделе нужного вам сервера → *[URL='https://forum.blackrussia.online/#igrovye-servera.12']Кликабельно[/URL]*<br><br>" +
	  	  `Закрыто.${END_DECOR}`,
	    prefix: CLOSE_PREFIX,
	    status: false,
	  },
    {
	    title: 'Ответ ранее',
	    content:
	  	  `${START_DECOR}Здравствуйте, {{ user.mention }}.<br><br>` +
	  	  "Ответ вы получили в одной из предыдущих тем.<br><br>" +
	  	  `Закрыто.${END_DECOR}`,
	    prefix: CLOSE_PREFIX,
	    status: false,
	  },
    {
	    title: 'Закрыто',
	    content:
	  	  `${START_DECOR}Здравствуйте, {{ user.mention }}.<br><br>` +
	  	  "Будут приняты необходимые меры.<br><br>" +
	  	  `Закрыто.${END_DECOR}`,
	    prefix: CLOSE_PREFIX,
	    status: false,
	  },


];

$(document).ready(() => {
	// Загрузка скрипта для обработки шаблонов
	$('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');

	// Добавление кнопок при загрузке страницы
  addButton('Pin', 'ras');
  addButton('Watched', 'checked');
  addButton('Closed', 'closed');
  addButton('|', '');
  addButton('Menu', 'selectAnswer');
  addButton('|', '');

	// Поиск информации о теме
	const threadData = getThreadData();

  $('button#ras').click(() => pasteContent(1, threadData, true));
  $('button#closed').click(() => editThreadData(CLOSE_PREFIX, false));
  $('button#checked').click(() => editThreadData(WATCH_PREFIX, false));

	$(`button#selectAnswer`).click(() => {
		XF.alert(buttonsMarkup(buttons), null, 'Main menu');
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

function moveThread(prefix, target) {
  // Функция перемещения тем
  const threadTitle = $('.p-title-value')[0].lastChild.textContent;

  fetch(`${document.URL}move`, {
    method: 'POST',
    body: getFormData({
      prefix_id: prefix,
      title: threadTitle,
      target_node_id: target,
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