// ==UserScript==
// @name         Обжалование наказаний (align left)
// @namespace    https://forum.blackrussia.online
// @version      1.0
// @author       Devid Diev
// @description  -
// @match        https://forum.blackrussia.online/*
// @include      https://forum.blackrussia.online/
// @grant        none
// @license 	 none
// @icon https://i.yapx.ru/RMTMT.png
// @updateURL
// @downloadURL https://update.greasyfork.org/scripts/535137/%D0%9E%D0%B1%D0%B6%D0%B0%D0%BB%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D0%B5%20%D0%BD%D0%B0%D0%BA%D0%B0%D0%B7%D0%B0%D0%BD%D0%B8%D0%B9%20%28align%20left%29.user.js
// @updateURL https://update.greasyfork.org/scripts/535137/%D0%9E%D0%B1%D0%B6%D0%B0%D0%BB%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D0%B5%20%D0%BD%D0%B0%D0%BA%D0%B0%D0%B7%D0%B0%D0%BD%D0%B8%D0%B9%20%28align%20left%29.meta.js
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

const START_DECOR = `<div style="text-align: left"><span style="font-family: 'Verdana'; font-size: 13px">`;
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
	  	  "Ваше обжалование взято на рассмотрение. Пожалуйста, не создавайте копии тем.<br><br>" +
	  	  `Ожидайте ответа.${END_DECOR}`,
	    prefix: WAIT_PREFIX,
	    status: true,
	  },
	  {
	    title: 'Передать ГА',
	    content:
	  	  `${START_DECOR}Здравствуйте, {{ user.mention }}.<br><br>` +
	  	  "Ваше обжалование передано главному администратору на рассмотрение.<br><br>" +
	  	  `Ожидайте ответа.${END_DECOR}`,
	    prefix: GA_PREFIX,
	    status: true,
	  },
     {
	    title: 'Передать СА',
	    content:
	  	  `${START_DECOR}Здравствуйте, {{ user.mention }}.<br><br>` +
	  	  "Ваше обжалование передано специальному администратору на рассмотрение.<br><br>" +
	  	  `Ожидайте ответа.${END_DECOR}`,
	    prefix: SA_PREFIX,
	    status: true,
	  },
    {
	    title: 'Передать кузю',
	    content:
	  	  `${START_DECOR}Здравствуйте, {{ user.mention }}.<br><br>` +
	  	  "Ваше обжалование передано руководителю модераторов Discord на рассмотрение.<br><br>" +
	  	  `Ожидайте ответа.${END_DECOR}`,
	    prefix: WAIT_PREFIX,
	    status: true,
	  },
    {
	    title: 'Обж отказ',
	    content:
	  	  `${START_DECOR}Здравствуйте, {{ user.mention }}.<br><br>` +
	  	  "В обжаловании отказано.<br><br>" +
	  	  `Закрыто.${END_DECOR}`,
	    prefix: CLOSED_PREFIX,
	    status: false,
	  },
    {
	    title: 'Выдано верно',
	    content:
	  	  `${START_DECOR}Здравствуйте, {{ user.mention }}.<br><br>` +
	  	  "Наказание выдано верно.<br><br>" +
	  	  `Закрыто.${END_DECOR}`,
	    prefix: CLOSED_PREFIX,
	    status: false,
	  },
    {
	    title: 'Не по форме',
	    content:
	  	  `${START_DECOR}Здравствуйте, {{ user.mention }}.<br><br>` +
	  	  "Ваше обжалование составлено не по форме, ознакомьтесь с правилами подачи жалоб → *[URL='https://forum.blackrussia.online/threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BF%D0%BE%D0%B4%D0%B0%D1%87%D0%B8-%D0%B7%D0%B0%D1%8F%D0%B2%D0%BA%D0%B8-%D0%BD%D0%B0-%D0%BE%D0%B1%D0%B6%D0%B0%D0%BB%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D0%B5-%D0%BD%D0%B0%D0%BA%D0%B0%D0%B7%D0%B0%D0%BD%D0%B8%D1%8F.3429398/']Кликабельно[/URL]*<br><br>" +
	  	  `Закрыто.${END_DECOR}`,
	    prefix: CLOSED_PREFIX,
	    status: false,
	  },
    {
	    title: 'Окно бана',
	    content:
	  	  `${START_DECOR}Здравствуйте, {{ user.mention }}.<br><br>` +
	  	  "В ваших доказательствах отсутствует окно блокировки. Зайдите в игру, сделайте скриншот окна блокировки, после чего заново напишите обжалование.<br><br>" +
	  	  `Закрыто.${END_DECOR}`,
	    prefix: CLOSED_PREFIX,
	    status: false,
	  },
    {
	    title: '24 часа НИК',
	    content:
	  	  `${START_DECOR}Здравствуйте, {{ user.mention }}.<br><br>` +
	  	  "Ваш аккаунт будет разблокирован на 24 часа для смены никнейма. Если за отведенное время он не будет сменен, аккаунт будет заблокирован без возможности дальнейшей разблокировки.<br><br>" +
	  	  `На рассмотрении.${END_DECOR}`,
	    prefix: WAIT_PREFIX,
	    status: true,
	  },
    {
	    title: 'Нет доказательств',
	    content:
	  	  `${START_DECOR}Здравствуйте, {{ user.mention }}.<br><br>` +
	  	  "В вашем обжаловании отсутствуют доказательства. Для возможности рассмотрения заявки, загрузите доказательства на любой фото/видео хостинг, например Imgur, Yapx, Youtube, и оставьте полученную ссылку в новой теме.<br><br>" +
	  	  `Закрыто.${END_DECOR}`,
	    prefix: CLOSED_PREFIX,
	    status: false,
	  },
    {
	    title: 'Док-ва в соц сетях',
	    content:
	  	  `${START_DECOR}Здравствуйте, {{ user.mention }}.<br><br>` +
	  	  "Загрузка доказательств в соц. сети (ВКонтакте, instagram) запрещается, доказательства должны быть загружены на фото/видео хостинги (YouTube, Япикс, Imgur).<br><br>" +
	  	  `Закрыто.${END_DECOR}`,
	    prefix: CLOSED_PREFIX,
	    status: false,
	  },
    {
	    title: 'Бан IP',
	    content:
	  	  `${START_DECOR}Здравствуйте, {{ user.mention }}.<br><br>` +
	  	  "IP адрес был заблокирован не вам, вы случайно попали на заблокированный IP, перезагрузите роутер, либо же смените способ подключения к интернету.<br><br>" +
	  	  `Закрыто.${END_DECOR}`,
	    prefix: CLOSED_PREFIX,
	    status: false,
	  },
    {
	    title: 'Жалобы на техов',
	    content:
	  	  `${START_DECOR}Здравствуйте, {{ user.mention }}.<br><br>` +
	  	  "Пересоздайте тему в разделе жалоб на технических специалистов → *[URL='https://forum.blackrussia.online/forums/%D0%A1%D0%B5%D1%80%D0%B2%D0%B5%D1%80-%E2%84%9646-chelyabinsk.2051/']Кликабельно[/URL]*<br><br>" +
        `Закрыто.${END_DECOR}`,
	    prefix: CLOSED_PREFIX,
	    status: false,
	  },
    {
	    title: 'Жалобы на игроков',
	    content:
	  	  `${START_DECOR}Здравствуйте, {{ user.mention }}.<br><br>` +
	  	  "Обратитесь в раздел жалоб на игроков → *[URL='https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B8%D0%B3%D1%80%D0%BE%D0%BA%D0%BE%D0%B2.2080/']Кликабельно[/URL]*<br><br>" +
        `Закрыто.${END_DECOR}`,
	    prefix: CLOSED_PREFIX,
	    status: false,
	  },
{
	    title: 'Жалобы на адм',
	    content:
	  	  `${START_DECOR}Здравствуйте, {{ user.mention }}.<br><br>` +
	  	  "Обратитесь в раздел жалоб на администрацию → *[URL='https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B0%D0%B4%D0%BC%D0%B8%D0%BD%D0%B8%D1%81%D1%82%D1%80%D0%B0%D1%86%D0%B8%D1%8E.2078/']Кликабельно[/URL]*<br><br>" +
        `Закрыто.${END_DECOR}`,
	    prefix: CLOSED_PREFIX,
	    status: false,
	  },
    {
	    title: 'Не по теме',
	    content:
	  	  `${START_DECOR}Здравствуйте, {{ user.mention }}.<br><br>` +
	  	  "Ваше обращение не относится к теме данного раздела.<br><br>" +
	  	  `Закрыто.${END_DECOR}`,
	    prefix: CLOSED_PREFIX,
	    status: false,
	  },
    {
	    title: 'Ошиблись сервером',
	    content:
	  	  `${START_DECOR}Здравствуйте, {{ user.mention }}.<br><br>` +
	  	  "Пересоздайте жалобу в разделе нужного вам сервера → *[URL='https://forum.blackrussia.online/index.php#igrovye-servera.12']Кликабельно[/URL]*<br><br>" +
	  	  `Закрыто.${END_DECOR}`,
	    prefix: CLOSED_PREFIX,
	    status: false,
	  },
    {
	    title: 'Дубликат',
	    content:
	  	  `${START_DECOR}Здравствуйте, {{ user.mention }}.<br><br>` +
	  	  "Вам уже ранее был дан корректный ответ в прошлой теме, за создание дубликатов этой темы ваш форумный аккаунт может быть заблокирован.<br><br>" +
	  	  `Закрыто.${END_DECOR}`,
	    prefix: CLOSED_PREFIX,
	    status: false,
	  },
    {
	    title: 'Одобрено (снижено)',
	    content:
	  	  `${START_DECOR}Здравствуйте, {{ user.mention }}.<br><br>` +
	  	  "Ваше обжалование одобрено, наказание будет изменено.<br><br>" +
	  	  `Закрыто.${END_DECOR}`,
        prefix: WATCHED_PREFIX,
	    status: false,
	  },
    {
	    title: 'Одобрено (снято)',
	    content:
	  	  `${START_DECOR}Здравствуйте, {{ user.mention }}.<br><br>` +
	  	  "Ваше обжалование одобрено, наказание будет полностью снято.<br><br>" +
	  	  `Закрыто.${END_DECOR}`,
	    prefix: WATCHED_PREFIX,
	    status: false,
	  },
    {
	    title: '24 часа ВОЗВРАТ',
	    content:
	  	  `${START_DECOR}Здравствуйте, {{ user.mention }}.<br><br>` +
	  	  "Ваш аккаунт будет разблокирован на 24 часа, за отведенное время Вы должны будете вернуть все имущетсво владельцу и отписаться в данной теме, приложив доказательства.<br><br>" +
	  	  `На рассмотрении.${END_DECOR}`,
	    prefix: WAIT_PREFIX,
	  },
     {
	    title: 'Не подлежит обж',
	    content:
	  	  `${START_DECOR}Здравствуйте, {{ user.mention }}.<br><br>` +
	  	  "Ваше наказание обжалованию не подлежит.<br><br>" +
	  	  `Закрыто.${END_DECOR}`,
        prefix: CLOSED_PREFIX,
	    status: false,
	  },
    {
	    title: 'нРП обман',
	    content:
	  	  `${START_DECOR}Здравствуйте, {{ user.mention }}.<br><br>` +
	  	  "Разблокировка игрового аккаунта будет возможна только в случае возврата полной суммы причиненного ущерба, либо непосредственно самого имущества, которое было украдено (по решению обманутой стороны).<br>" +
          "Форумный аккаунт игрока: .<br><br>" +
	  	  `Закрыто.${END_DECOR}`,
	    prefix: CLOSED_PREFIX,
	    status: false,
	  },
    {
	    title: 'НИК сменен',
	    content:
	  	  `${START_DECOR}Здравствуйте, {{ user.mention }}.<br><br>` +
	  	  "Никнейм сменен. Аккаунт разблокирован окончательно.<br><br>" +
	  	  `Закрыто.${END_DECOR}`,
	    prefix: CLOSED_PREFIX,
	    status: false,
	  },

];

$(document).ready(() => {
	// Загрузка скрипта для обработки шаблонов
	$('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');

	// Добавление кнопок при загрузке страницы
  addButton('ДАТЬ ОТПОР', 'selectAnswer');
  addButton('На рассмотрение', 'pinned');
  addButton('Одобрено', 'approved');
  addButton('Закрыто', 'closed');

	// Поиск информации о теме
	const threadData = getThreadData();

  $('button#pinned').click(() => pasteContent(1, threadData, true));
  $('button#closed').click(() => editThreadData(CLOSED_PREFIX, false));
  $('button#approved').click(() => editThreadData(APPROVED_PREFIX, false));

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
  `<button type="button" class="button rippleButton" id="${id}" style="margin: 3px; vertical-align: baseline ">${name}</button>`,
);
}

function buttonsMarkup(buttons) {
  return `<div class="select_answer">${buttons
    .map(
      (btn, i) =>
        `<button id="answers-${i}" class="button--primary button rippleButton" style="margin:5px; vertical-align: baseline"><span class="button-text">${btn.title}</span></button>`,
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