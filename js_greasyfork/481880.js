// ==UserScript==
// @name         Скрипт Для обж
// @namespace    https://forum.blackrussia.online/
// @version      1.1
// @description  Создано для проверки РП биографий, ситуаций, организаций
// @author       Не указано. Текст ответов Ники Рековой.
// @match        https://forum.blackrussia.online/threads/*
// @grant        none
// @license 	 MIT
// @icon https://sun9-61.userapi.com/impg/ceUI_jySaNf3CA68hg0bbBgYXieB9BHci8Ukag/2-wlwvUSswA.jpg?size=272x300&quality=95&sign=00de5ec9d6061efc44d4f01c1fcb41e9&type=album
// @copyright 2021, Kuk (https://openuserjs.org/users/Kuk)
// @downloadURL https://update.greasyfork.org/scripts/481880/%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%94%D0%BB%D1%8F%20%D0%BE%D0%B1%D0%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/481880/%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%94%D0%BB%D1%8F%20%D0%BE%D0%B1%D0%B6.meta.js
// ==/UserScript==

(function () {
  'use strict';
const UNACCEPT_PREFIX = 4; // Prefix that will be set when thread closes
const ACCEPT_PREFIX = 8; // Prefix that will be set when thread accepted
const RESHENO_PREFIX = 6; // Prefix that will be set when solving the problem
const PIN_PREFIX = 2; // Prefix that will be set when thread pins
const GA_PREFIX = 12; // Prefix that will be set when thread send to ga
const COMMAND_PREFIX = 10; // Prefix that will be set when thread send to project team
const CLOSE_PREFIX = 7; // Prefix that will be set when thread closes.
const VAJNO_PREFIX = 1;
const WATCHED_PREFIX = 9;
const TEX_PREFIX = 13;
const PREFIKS = 0;
const OTKAZRP_PREFIX = 4;
const ODOBRENORP_PREFIX = 8;
const NARASSMOTRENIIRP_PREFIX = 2;
const NARASSMOTRENIIORG_PREFIX = 2;
const buttons = [

              {
        title: 'Приветствие',
        content:
        '[CENTER][FONT=verdana][COLOR=rgb(247, 218, 100)]Доброго времени суток.[/COLOR]<br>',
        },
        {
	  title: 'Не по теме (Подходит под ВСЕ разделы)',
	  content:
            '[CENTER][FONT=verdana][COLOR=rgb(247, 218, 100)]Доброго времени суток.[/COLOR]<br><br>' +
            "[CENTER]Ваша тема не относится к данному разделу.<br><br>" +
            "[CENTER][COLOR=rgb(235, 107, 86)][FONT=verdana]Закрыто.[/FONT][/COLOR][/CENTER]" ,
            prefix: CLOSE_PREFIX,
            status: false,
        },
        {
	  title: 'На рассмотрении',
	  content:
            '[CENTER][FONT=verdana][COLOR=rgb(247, 218, 100)]Доброго времени суток.[/COLOR]<br><br>' +
            "[CENTER]Ваша тема находится на рассмотрении. Не создавайте её копий.<br><br>" +
            "[CENTER][COLOR=rgb(251, 160, 38)][FONT=verdana]Ожидайте ответа.[/FONT][/COLOR][/CENTER]" ,
            prefix: PIN_PREFIX,
            status: true,
        },
        {
	  title: 'Повтор темы (Подходит под ВСЕ разделы)',
	  content:
            '[CENTER][FONT=verdana][COLOR=rgb(247, 218, 100)]Доброго времени суток.[/COLOR]<br><br>' +
            "[CENTER]Не нужно создавать темы повторно, для рассмотрения необходима только одна.<br><br>" +
            "[CENTER][COLOR=rgb(235, 107, 86)][FONT=verdana]Закрыто.[/FONT][/COLOR][/CENTER]" ,
            prefix: CLOSE_PREFIX,
            status: false,
        },
        {
	  title: 'Ответ в прошлой теме',
	  content:
            '[CENTER][FONT=verdana][COLOR=rgb(247, 218, 100)]Доброго времени суток.[/COLOR]<br><br>' +
            "[CENTER]Ответ был дан в прошлой вашей теме.<br><br>" +
            "[CENTER][COLOR=rgb(251, 160, 38)][FONT=verdana]Закрыто.[/FONT][/COLOR][/CENTER]" ,
            prefix: CLOSE_PREFIX,
            status: false,
        },
        {
	  title: 'Не по форме(обж)',
	  content:
            '[CENTER][FONT=verdana][COLOR=rgb(247, 218, 100)]Доброго времени суток.[/COLOR]<br><br>' +
            "[CENTER]Ваше обжалование написано не по форме. [URL='https://forum.blackrussia.online/threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BF%D0%BE%D0%B4%D0%B0%D1%87%D0%B8-%D0%B7%D0%B0%D1%8F%D0%B2%D0%BA%D0%B8-%D0%BD%D0%B0-%D0%BE%D0%B1%D0%B6%D0%B0%D0%BB%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D0%B5-%D0%BD%D0%B0%D0%BA%D0%B0%D0%B7%D0%B0%D0%BD%D0%B8%D1%8F.3429398/']НАЖМИТЕ СЮДА[/URL] чтобы ознакомиться с формой подачи обжалования.<br><br>" +
            "[CENTER][COLOR=rgb(235, 107, 86)][FONT=verdana]Закрыто.[/FONT][/COLOR][/CENTER]" ,
            prefix: CLOSE_PREFIX,
            status: false,
        },
        {
	  title: 'ЖБ на теха',
	  content:
            '[CENTER][FONT=verdana][COLOR=rgb(247, 218, 100)]Доброго времени суток.[/COLOR]<br><br>' +
            "[CENTER]Обратитесь в жалобы на технических специалистов нашего сервера. [URL='https://forum.blackrussia.online/forums/%D0%A1%D0%B5%D1%80%D0%B2%D0%B5%D1%80-%E2%84%9624-spb.1205/']НАЖМИТЕ СЮДА[/URL] чтобы перейти в нужный раздел.<br><br>" +
            "[CENTER][COLOR=rgb(235, 107, 86)][FONT=verdana]Закрыто.[/FONT][/COLOR][/CENTER]" ,
            prefix: CLOSE_PREFIX,
            status: false,
        },
        {
	  title: 'ЖБ на игроков',
	  content:
            '[CENTER][FONT=verdana][COLOR=rgb(247, 218, 100)]Доброго времени суток.[/COLOR]<br><br>' +
            "[CENTER]Обратитесь в жалобы на игроков.<br><br>" +
            "[CENTER][COLOR=rgb(235, 107, 86)][FONT=verdana]Закрыто.[/FONT][/COLOR][/CENTER]" ,
            prefix: CLOSE_PREFIX,
            status: false,
        },
        {
	  title: 'ЖБ на адм',
	  content:
            '[CENTER][FONT=verdana][COLOR=rgb(247, 218, 100)]Доброго времени суток.[/COLOR]<br><br>' +
            "[CENTER]Обратитесь в жалобы на администрацию.<br><br>" +
            "[CENTER][COLOR=rgb(235, 107, 86)][FONT=verdana]Закрыто.[/FONT][/COLOR][/CENTER]" ,
            prefix: CLOSE_PREFIX,
            status: false,
        },
        {
	  title: 'В тех раздел',
	  content:
            '[CENTER][FONT=verdana][COLOR=rgb(247, 218, 100)]Доброго времени суток.[/COLOR]<br><br>' +
            "[CENTER]Обратитесь в технический раздел нашего сервера. [URL='https://forum.blackrussia.online/forums/%D0%A1%D0%B5%D1%80%D0%B2%D0%B5%D1%80-%E2%84%9624-spb.1205/']НАЖМИТЕ СЮДА[/URL] чтобы перейти в нужный раздел.<br><br>" +
            "[CENTER][COLOR=rgb(235, 107, 86)][FONT=verdana]Закрыто.[/FONT][/COLOR][/CENTER]" ,
            prefix: CLOSE_PREFIX,
            status: false,
        },
        {
	  title: 'Третье лицо',
	  content:
            '[CENTER][FONT=verdana][COLOR=rgb(247, 218, 100)]Доброго времени суток.[/COLOR]<br><br>' +
            "[CENTER]Жалобы/обжалования от третьего лица не принимаются. Получивший наказание человек должен самостоятельно опубликовать тему.<br><br>" +
            "[CENTER][COLOR=rgb(235, 107, 86)][FONT=verdana]Закрыто.[/FONT][/COLOR][/CENTER]" ,
            prefix: CLOSE_PREFIX,
            status: false,
        },
        {
	  title: 'Нет скрина',
	  content:
            '[CENTER][FONT=verdana][COLOR=rgb(247, 218, 100)]Доброго времени суток.[/COLOR]<br><br>' +
            "[CENTER]В вашем обжаловании нет скриншота (или доступа к скриншоту) выданного наказания или он находится в социальных сетях (ВК, ОК, ИНСТ и тд). Сделайте скриншот окна блокировки или наказания и прикрепите его в следующее обжалование через фотохостинги (Имгур, Япикс).<br><br>" +
            "[CENTER][COLOR=rgb(235, 107, 86)][FONT=verdana]Закрыто.[/FONT][/COLOR][/CENTER]" ,
            prefix: CLOSE_PREFIX,
            status: false,
        },
        {
	  title: 'Передано ГА',
	  content:
            '[CENTER][FONT=verdana][COLOR=rgb(247, 218, 100)]Доброго времени суток.[/COLOR]<br><br>' +
            "[CENTER]Передал вашу тему Главному администратору. Ожидайте ответа.<br><br>" +
            "[CENTER][COLOR=rgb(251, 160, 38)][FONT=verdana]На рассмотрении.[/FONT][/COLOR][/CENTER]" ,
            prefix: GA_PREFIX,
            status: true,
        },
        {
        title: '________________________________________Отказаны ОБЖ________________________________________',
        },
        {
        title: 'Не обжалуем',
        content:
            '[CENTER][FONT=verdana][COLOR=rgb(247, 218, 100)]Доброго времени суток.[/COLOR]<br><br>' +
            '[CENTER]Данный тип наказания не обжалуется никоим образом.<br><br>' +
            '[CENTER]Обратите внимание:' +
            '[QUOTE]'+
            '[CENTER][B][COLOR=rgb(247, 218, 100)]Нарушения, по которым заявка на обжалование не рассматривается:[/COLOR][/B]<br><br>'+
            '[FONT=verdana]Различные формы "слива";<br>'+
            'продажа игровой валюты;<br>'+
            'махинации;<br>'+
            'целенаправленный багоюз;<br>'+
            'продажа, передача аккаунта;<br>'+
            'сокрытие ошибок, багов системы;<br>'+
            'использование стороннего программного обеспечения;<br>'+
            'распространение конфиденциальной информации;<br>'+
            'обман администрации.[/FONT][/CENTER]'+
            '[/QUOTE]<br><br>'+
            '[CENTER][COLOR=rgb(235, 107, 86)][FONT=verdana]Отказано, закрыто.[/FONT][/COLOR][/CENTER]' ,
            prefix: UNACCEPT_PREFIX,
            status: false,
        },
        {
	  title: 'Выдано верно',
	  content:
            '[CENTER][FONT=verdana][COLOR=rgb(247, 218, 100)]Доброго времени суток.[/COLOR]<br><br>' +
            "[CENTER]Наказание выдано верно.<br><br>" +
            "[CENTER][COLOR=rgb(235, 107, 86)][FONT=verdana]Отказано, закрыто.[/FONT][/COLOR][/CENTER]" ,
            prefix: UNACCEPT_PREFIX,
            status: false,
        },
        {
	  title: 'Не хочу обжаловать',
	  content:
            '[CENTER][FONT=verdana][COLOR=rgb(247, 218, 100)]Доброго времени суток.[/COLOR]<br><br>' +
            "[CENTER]Мы не готовы пойти вам на встречу в этом случае. Попробуйте обжаловаться позже.<br><br>" +
            "[CENTER][COLOR=rgb(235, 107, 86)][FONT=verdana]Отказано, закрыто.[/FONT][/COLOR][/CENTER]" ,
            prefix: UNACCEPT_PREFIX,
            status: false,
        },
        {
	  title: 'Договор ущерб',
	  content:
            '[CENTER][FONT=verdana][COLOR=rgb(247, 218, 100)]Доброго времени суток.[/COLOR]<br><br>' +
            "[CENTER]Вам нужно договориться с обманутым игроком о возврате ущерба. После осуществления договоренности, вам нужно будет написать новое обжалование, прикрепив скриншот или видео того, как вы связались с игроком.<br><br>" +
            "[CENTER]Так же хочу сказать, не пытайтесь вернуть ущерб через третьих лиц или через свой второй аккаунт. Вернуть ущерб вы должны сами, с аккаунта, с которого производился обман, после разблокировки.<br><br>" +
            "[CENTER][COLOR=rgb(235, 107, 86)][FONT=verdana]Закрыто.[/FONT][/COLOR][/CENTER]" ,
            prefix: CLOSE_PREFIX,
            status: false,
        },
        {
      title: 'Ник не изменили',
	  content:
            '[CENTER][FONT=verdana][COLOR=rgb(247, 218, 100)]Доброго времени суток.[/COLOR]<br><br>' +
            "[CENTER]Никнейм не изменен. Аккаунт будет снова заблокирован.<br><br>" +
            "[CENTER][COLOR=rgb(235, 107, 86)][FONT=verdana]Отказано, закрыто.[/FONT][/COLOR][/CENTER]" ,
            prefix: UNACCEPT_PREFIX,
            status: false,
        },
        {
	  title: 'Скрин не относится к ОБЖ',
	  content:
            '[CENTER][FONT=verdana][COLOR=rgb(247, 218, 100)]Доброго времени суток.[/COLOR]<br><br>' +
            "[CENTER]В вашем обжаловании скриншот не соответствует никнейму/содержанию, указанному в обжаловании. Сделайте скриншот своего наказания и прикрепите его в новом обжаловании.<br><br>" +
            "[CENTER][COLOR=rgb(235, 107, 86)][FONT=verdana]Отказано, закрыто.[/FONT][/COLOR][/CENTER]" ,
            prefix: UNACCEPT_PREFIX,
            status: false,
        },
        {

        title: '________________________________________Частич.одобрены ОБЖ________________________________________',
        },
        {
            title: 'Смена ника сутки',
            content:
            '[CENTER][FONT=verdana][COLOR=rgb(247, 218, 100)]Доброго времени суток.[/COLOR]<br><br>' +
            "[CENTER]Аккаунт будет разблокирован, у вас есть сутки, чтобы сменить никнейм.<br><br>" +
            "[CENTER][COLOR=rgb(251, 160, 38)][FONT=verdana]На рассмотрении.[/FONT][/COLOR][/CENTER]",
            prefix: PIN_PREFIX,
            status: true,
        },
        {
            title: 'Возврат ущерба сутки',
            content:
            '[CENTER][FONT=verdana][COLOR=rgb(247, 218, 100)]Доброго времени суток.[/COLOR]<br><br>' +
            "[CENTER]Аккаунт будет разблокирован, у вас есть сутки, чтобы вернуть ущерб. Видео с возвратом прикрепите сюда.<br><br>" +
            "[CENTER][COLOR=rgb(251, 160, 38)][FONT=verdana]На рассмотрении.[/FONT][/COLOR][/CENTER]",
            prefix: PIN_PREFIX,
            status: true,
        },
        {
	  title: 'Дополнительное время',
	  content:
            '[CENTER][FONT=verdana][COLOR=rgb(247, 218, 100)]Доброго времени суток.[/COLOR]<br><br>' +
            "[CENTER]В связи с вашими обстоятельствами даем вам дополнительное время в виде пяти часов на выполнение наших условий.<br><br>" +
            "[CENTER][COLOR=rgb(251, 160, 38)][FONT=verdana]На рассмотрении.[/FONT][/COLOR][/CENTER]",
            prefix: PIN_PREFIX,
            status: true,
        },
        {
        title: '________________________________________Одобрены ОБЖ________________________________________',
        },
        {
	  title: 'Аккаунт разблокирован!',
            content:
            '[CENTER][FONT=verdana][COLOR=rgb(247, 218, 100)]Доброго времени суток.[/COLOR]<br><br>' +
            "[CENTER]Ваш аккаунт будет разблокирован.<br><br>" +
            "[CENTER][FONT=verdana][COLOR=rgb(97, 189, 109)]Одоберно[/COLOR], приятной игры на сервере [COLOR=rgb(84, 172, 210)]SPB[/COLOR].[/FONT][/CENTER]",
            prefix: ACCEPT_PREFIX,
            status: false,
        },
        {
	  title: 'Наказание будет снято',
            content:
            '[CENTER][FONT=verdana][COLOR=rgb(247, 218, 100)]Доброго времени суток.[/COLOR]<br><br>' +
            "[CENTER]Ваше наказание будет снято.<br><br>" +
            "[CENTER][FONT=verdana][COLOR=rgb(97, 189, 109)]Одоберно[/COLOR], приятной игры на сервере [COLOR=rgb(84, 172, 210)]SPB[/COLOR].[/FONT][/CENTER]",
            prefix: ACCEPT_PREFIX,
            status: false,
        },
        {
	  title: 'Обжалован бан',
            content:
            '[CENTER][FONT=verdana][COLOR=rgb(247, 218, 100)]Доброго времени суток.[/COLOR]<br><br>' +
            "[CENTER]Ваше наказание обжаловано. Аккаунт будет разблокирован. Впредь постарайтесь не нарушать правил сервера, так как в следующий раз такого шанса может не быть.<br><br>" +
            "[CENTER][FONT=verdana][COLOR=rgb(97, 189, 109)]Одоберно[/COLOR], с возвращением на сервер [COLOR=rgb(84, 172, 210)]SPB[/COLOR].[/FONT][/CENTER]",
            prefix: ACCEPT_PREFIX,
            status: false,
        },
        {
	  title: 'Обжаловано никнейм',
            content:
            '[CENTER][FONT=verdana][COLOR=rgb(247, 218, 100)]Доброго времени суток.[/COLOR]<br><br>' +
            "[CENTER]Ваше наказание обжаловано. Никнейм изменен, у администрации больше нет к вам претензий.<br><br>" +
            "[CENTER][FONT=verdana][COLOR=rgb(97, 189, 109)]Одоберно[/COLOR], с возвращением на сервер [COLOR=rgb(84, 172, 210)]SPB[/COLOR].[/FONT][/CENTER]",
            prefix: ACCEPT_PREFIX,
            status: false,
        },
        {
	  title: 'Обжаловано ущерб',
            content:
            '[CENTER][FONT=verdana][COLOR=rgb(247, 218, 100)]Доброго времени суток.[/COLOR]<br><br>' +
            "[CENTER]Ваше наказание обжаловано. Ущерб возмещен, у администрации больше нет к вам претензий. Впредь постарайтесь не нарушать правил сервера, так как в следующий раз такого шанса может не быть.<br><br>" +
            "[CENTER][FONT=verdana][COLOR=rgb(97, 189, 109)]Одоберно[/COLOR], с возвращением на сервер [COLOR=rgb(84, 172, 210)]SPB[/COLOR].[/FONT][/CENTER]",
            prefix: ACCEPT_PREFIX,
            status: false,
        },
        ];

$(document).ready(() => {
	// Загрузка скрипта для обработки шаблонов
	$('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');

	// Добавление кнопок при загрузке страницы
   	addButton('Одобрено', 'accepted');
    addButton('Отказано', 'unaccept');
    addButton('📒 ШАБЛОНЧИКИ 📒', 'selectAnswer');

	// Поиск информации о теме
	const threadData = getThreadData();

	$('button#pin').click(() => editThreadData(PIN_PREFIX, true));
	$('button#accepted').click(() => editThreadData(ACCEPT_PREFIX, false));
	$('button#teamProject').click(() => editThreadData(COMMAND_PREFIX, true));
	$('button#unaccept').click(() => editThreadData(UNACCEPT_PREFIX, false));
    $('button#Zakrito').click(() => editThreadData(UNACCEPT_PREFIX, false));

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