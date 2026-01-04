// ==UserScript==
// @name         Жалобы на администрацию
// @namespace    https://forum.blackrussia.online
// @version      3.0.2
// @author       Shyne_Zazik by D.Diev
// @description  -
// @match        https://forum.blackrussia.online/*
// @include      https://forum.blackrussia.online/
// @grant        none
// @license 	 none
// @icon https://i.yapx.ru/RMTMT.png
// @updateURL
// @downloadURL https://update.greasyfork.org/scripts/523953/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B%20%D0%BD%D0%B0%20%D0%B0%D0%B4%D0%BC%D0%B8%D0%BD%D0%B8%D1%81%D1%82%D1%80%D0%B0%D1%86%D0%B8%D1%8E.user.js
// @updateURL https://update.greasyfork.org/scripts/523953/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B%20%D0%BD%D0%B0%20%D0%B0%D0%B4%D0%BC%D0%B8%D0%BD%D0%B8%D1%81%D1%82%D1%80%D0%B0%D1%86%D0%B8%D1%8E.meta.js
// ==/UserScript==

(function () {
  'use strict';
const DECLINED_PREFIX = 4;
const APPROVED_PREFIX = 8;
const WAIT_PREFIX = 2;
const TECH_PREFIX = 13;
const WATCHED_PREFIX = 9;
const CLOSED_PREFIX = 7;
const GA_PREFIX = 12;
const SA_PREFIX = 11;
const CP_PREFIX = 10;

const START_DECOR = `<div style="text-align: center"><span style="font-family: 'Verdana'; font-size: 14px">`;
const END_DECOR = `</span></div>`;

const buttons = [
    {
	    title: 'Приветствие',
	    content:
	  	`${START_DECOR}Приветствую, {{ user.mention }}.<br><br><br><br><br><br>${END_DECOR}`
	  },
	  {
	    title: 'Рассмотрение',
	    content:
	  	  `${START_DECOR}Приветствую, {{ user.mention }}.<br><br>` +
	  	  "Ваша жалоба взята на рассмотрение.<br><br>" +
	  	  `Ожидайте ответа.${END_DECOR}`,
	    prefix: WAIT_PREFIX,
	    status: true,
	  },
	  {
	    title: 'Передать ЗГА',
	    content:
	  	  `${START_DECOR}Приветствую, {{ user.mention }}.<br><br>` +
	  	  "Ваша жалоба передана заместителю главного администратора на рассмотрение.<br><br>" +
	  	  `Ожидайте ответа.${END_DECOR}`,
	    prefix: WAIT_PREFIX,
	    status: true,
	  },
	  {
	    title: 'Передать ГА',
	    content:
	  	  `${START_DECOR}Приветствую, {{ user.mention }}.<br><br>` +
	  	  "Ваша жалоба передана главному администратору на рассмотрение.<br><br>" +
	  	  `Ожидайте ответа.${END_DECOR}`,
	    prefix: GA_PREFIX,
	    status: true,
	  },
     {
	    title: 'Передать СА',
	    content:
	  	  `${START_DECOR}Приветствую, {{ user.mention }}.<br><br>` +
	  	  "Ваша жалоба передана специальному администратору на рассмотрение.<br><br>" +
	  	  `Ожидайте ответа.${END_DECOR}`,
	    prefix: SA_PREFIX,
	    status: true,
	  },
    {
         title: 'Отказать',   
},
    {
	    title: 'Выдано верно',
    
	    content:
	  	  `${START_DECOR}Приветствую, {{ user.mention }}.<br><br>` +
	  	  "Нарушений нет. Выдано верно.<br><br>" +
	  	  `Закрыто.${END_DECOR}`,
	    prefix: CLOSED_PREFIX,
	    status: false,
	  },
    {
	    title: 'Не по форме',
	    content:
	  	  `${START_DECOR}Приветствую, {{ user.mention }}.<br><br>` +
	  	  "Не по форме<br><br>" +
	  	  `Закрыто.${END_DECOR}`,
	    prefix: CLOSED_PREFIX,
	    status: false,
	  },
    {
	    title: '48 часов',
	    content:
	  	  `${START_DECOR}Приветствую, {{ user.mention }}.<br><br>` +
	  	  "С момента выдачи наказания прошло более 48-ми часов. Жалоба не подлежит рассмотрению.<br><br>" +
	  	  `Закрыто.${END_DECOR}`,
	    prefix: CLOSED_PREFIX,
	    status: false,
	  },
    {
	    title: 'Нет нарушений',
	    content:
	  	  `${START_DECOR}Приветствую, {{ user.mention }}.<br><br>` +
	  	  "Со стороны администратора нет нарушений.<br><br>" +
	  	  `Закрыто.${END_DECOR}`,
	    prefix: CLOSED_PREFIX,
	    status: false,
	  },
    {
	    title: 'Недостаточно док-в',
	    content:
	  	  `${START_DECOR}Приветствую, {{ user.mention }}.<br><br>` +
	  	  "В вашей жалобе не предоставлено достаточного объёма доказательств нарушений.<br><br>" +
	  	  `Закрыто.${END_DECOR}`,
	    prefix: CLOSED_PREFIX,
	    status: false,
	  },
    {
	    title: 'Нет доказательств',
	    content:
	  	  `${START_DECOR}Приветствую, {{ user.mention }}.<br><br>` +
	  	  "В вашей жалобе отсутствуют доказательства. Не подлежит рассмотрению.<br><br>" +
	  	  `Закрыто.${END_DECOR}`,
	    prefix: CLOSED_PREFIX,
	    status: false,
	  },
    {
	    title: 'Док-ва в соц сетях',
	    content:
	  	  `${START_DECOR}Приветствую, {{ user.mention }}.<br><br>` +
	  	  "Загрузка доказательств в соц. сети (ВКонтакте, instagram) запрещается, доказательства должны быть загружены на фото/видео хостинги (YouTube, Япикс, Imgur).<br><br>" +
	  	  `Закрыто.${END_DECOR}`,
	    prefix: CLOSED_PREFIX,
	    status: false,
	  },
    {
	    title: 'Бан IP',
	    content:
	  	  `${START_DECOR}Приветствую, {{ user.mention }}.<br><br>` +
	  	  "IP адрес был заблокирован не вам, вы случайно попали на заблокированный IP, перезагрузите роутер, либо же смените способ подключения к интернету.<br><br>" +
	  	  `Закрыто.${END_DECOR}`,
	    prefix: CLOSED_PREFIX,
	    status: false,
	  },
    {
	    title: 'Жалобы на техов',
	    content:
	  	  `${START_DECOR}Приветствую, {{ user.mention }}.<br><br>` +
	  	  "Пересоздайте тему в разделе жалоб на технических специалистов.<br><br>" +
        `Закрыто.${END_DECOR}`,
	    prefix: CLOSED_PREFIX,
	    status: false,
	  },
    {
	    title: 'Жалобы на игроков',
	    content:
	  	  `${START_DECOR}Приветствую, {{ user.mention }}.<br><br>` +
	  	  "Обратитесь в раздел жалоб на игроков.<br><br>" +
        `Закрыто.${END_DECOR}`,
	    prefix: CLOSED_PREFIX,
	    status: false,
	  },
    {
	    title: 'В обж',
	    content:
	  	  `${START_DECOR}Приветствую, {{ user.mention }}.<br><br>` +
	  	  "Если вы не согласны с выданным наказанием, обратитесь в раздел обжалований.<br><br>" +
        `Закрыто.${END_DECOR}`,
	    prefix: CLOSED_PREFIX,
	    status: false,
	  },
    {
	    title: 'Не по теме',
	    content:
	  	  `${START_DECOR}Приветствую, {{ user.mention }}.<br><br>` +
	  	  "Не по теме.<br><br>" +
	  	  `Закрыто.${END_DECOR}`,
	    prefix: CLOSED_PREFIX,
	    status: false,
	  },
    {
	    title: 'Ответ в прошлой теме',
	    content:
	  	  `${START_DECOR}Приветствую, {{ user.mention }}.<br><br>` +
	  	  "Ожидайте ответ в предыдущей созданной вами теме.<br><br>" +
	  	  `Закрыто.${END_DECOR}`,
	    prefix: CLOSED_PREFIX,
	    status: false,
	  },
    {
	    title: 'Дубликат',
	    content:
	  	  `${START_DECOR}Приветствую, {{ user.mention }}.<br><br>` +
	  	  "Ответ был дан ранее. За создание дубликатов следует наказание.<br><br>" +
	  	  `Закрыто.${END_DECOR}`,
	    prefix: CLOSED_PREFIX,
	    status: false,
	  },
    {
	    title: 'Проведены работы',
	    content:
	  	  `${START_DECOR}Приветствую, {{ user.mention }}.<br><br>` +
	  	  "Были проведены работы.<br><br>" +
	  	  `Закрыто.${END_DECOR}`,
	    prefix: CLOSED_PREFIX,
	    status: false,
	  },
    {
	    title: 'Приняты меры',
	    content:
	  	  `${START_DECOR}Приветствую, {{ user.mention }}.<br><br>` +
	  	  "По отношению к администратору будут приняты меры, приносим извинения за предоставленные неудобства.<br><br>" +
	  	  `Закрыто.${END_DECOR}`,
	    prefix: WATCHED_PREFIX,
	    status: false,
	  },
   
    {
	    title: 'Будет снято',
	    content:
	  	  `${START_DECOR}Приветствую, {{ user.mention }}.<br><br>` +
	  	  "Ваше наказание будет снято в ближайшее время.<br><br>" +
	  	  `Закрыто.${END_DECOR}`,
	    prefix: CLOSED_PREFIX,
	    status: false,
	  },
    {
	    title: 'Жб будет пересмотрена',
	    content:
	  	  `${START_DECOR}Приветствую, {{ user.mention }}.<br><br>` +
        "Жалоба будет пересмотрена в ближайшее время.<br><br>" +
	  	  `Закрыто.${END_DECOR}`,
	    prefix: CLOSED_PREFIX,
	    status: false,
	  },

];

$(document).ready(() => {
	// Загрузка скрипта для обработки шаблонов
	$('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');

	// Добавление кнопок при загрузке страницы
  addButton('Pin', 'pinned');
  addButton('Watched', 'checked');
  addButton('Closed', 'closed');
  addButton('|', '');
  addButton('дать отпор', 'selectAnswer');
  addButton('|', '');

	// Поиск информации о теме
	const threadData = getThreadData();

  $('button#pinned').click(() => pasteContent(1, threadData, true));
  $('button#closed').click(() => editThreadData(CLOSED_PREFIX, false));
  $('button#checked').click(() => editThreadData(WATCHED_PREFIX, false));

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