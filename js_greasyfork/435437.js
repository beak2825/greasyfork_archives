// ==UserScript==
// @name         BLACK RUSSIA: скрипт для технических специалистов
// @namespace    https://forum.blackrussia.online
// @version      1.1.5.3
// @description  Для борьбы с техническими шоколадками
// @author       Antonio Carrizo
// @match        https://forum.blackrussia.online/index.php?threads/*
// @include      https://forum.blackrussia.online/index.php?threads/
// @grant        none
// @license 	 MIT
// @collaborator modified by rosenfeld, ermakov
// @icon https://icons.iconarchive.com/icons/thesquid.ink/free-flat-sample/128/support-icon.png
// @copyright 2021, Carrizo (https://openuserjs.org/users/Carrizo)
// @downloadURL https://update.greasyfork.org/scripts/435437/BLACK%20RUSSIA%3A%20%D1%81%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D1%82%D0%B5%D1%85%D0%BD%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%B8%D1%85%20%D1%81%D0%BF%D0%B5%D1%86%D0%B8%D0%B0%D0%BB%D0%B8%D1%81%D1%82%D0%BE%D0%B2.user.js
// @updateURL https://update.greasyfork.org/scripts/435437/BLACK%20RUSSIA%3A%20%D1%81%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D1%82%D0%B5%D1%85%D0%BD%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%B8%D1%85%20%D1%81%D0%BF%D0%B5%D1%86%D0%B8%D0%B0%D0%BB%D0%B8%D1%81%D1%82%D0%BE%D0%B2.meta.js
// ==/UserScript==

(function () {
  'use strict';
const UNACCEPT_PREFIX = 4; // Prefix that will be set when thread closes
const ACCEPT_PREFIX = 6; // Prefix that will be set when thread solved
const PIN_PREFIX = 2; // Prefix that will be set when thread pins
const COMMAND_PREFIX = 10; // Prefix that will be set when thread send to project team
const WATCHED_PREFIX = 9;
const CLOSE_PREFIX = 7;
const buttons = [
	{
	  title: 'Приветствие',
	  content:
		'[CENTER]{{ greeting }}, уважаемый(-ая) {{ user.mention }}.[/CENTER]<br>' + '[CENTER][/CENTER]',
	},
	{
	  title: 'Правила раздела',
	  content:
		'[CENTER]{{ greeting }}, уважаемый(-ая) {{ user.mention }}.[/CENTER]<br>' +
		"[CENTER]Пожалуйста, убедительная просьба, ознакомиться с назначением данного раздела в котором Вы создали тему, так как Ваш запрос никоим образом не относится к технической проблеме.[/CENTER]<br>" +
		'[CENTER]Отказано, закрыто.[/CENTER]',
       status: true,
	},
{
	  title: 'Жалобы сервера',
	  content:
		'[CENTER]{{ greeting }}, уважаемый(-ая) {{ user.mention }}.[/CENTER]<br>' +
		"[CENTER]Обратитесь в раздел «Жалобы» Вашего сервера:<br>[URL='https://forum.blackrussia.online/index.php?categories/Жалобы.54/'][B]Сервер №1 | Red[/B] → нажмите сюда[/URL]<br>[URL='https://forum.blackrussia.online/index.php?categories/Жалобы.98/'][B]Сервер №2 | Green[/B] → нажмите сюда[/URL]<br>[URL='https://forum.blackrussia.online/index.php?categories/Жалобы.138/'][B]Сервер №3 | Blue[/B] → нажмите сюда[/URL]<br>[URL='https://forum.blackrussia.online/index.php?categories/Жалобы.174/'][B]Сервер №4 | Yellow[/B] → нажмите сюда[/URL]<br>[URL='https://forum.blackrussia.online/index.php?categories/Жалобы.251/'][B]Сервер №5 | Orange[/B] → нажмите сюда[/URL]<br>[URL='https://forum.blackrussia.online/index.php?categories/Жалобы.291/'][B]Сервер №6 | Purple[/B] → нажмите сюда[/URL]<br>[URL='https://forum.blackrussia.online/index.php?categories/Жалобы.331/'][B]Сервер №7 | Lime[/B] → нажмите сюда[/URL]<br>[URL='https://forum.blackrussia.online/index.php?categories/Жалобы.373/'][B]Сервер №8 | Pink[/B] → нажмите сюда[/URL]<br>[URL='https://forum.blackrussia.online/index.php?categories/Жалобы.414/'][B]Сервер №9 | Cherry[/B] → нажмите сюда[/URL]<br>[URL='https://forum.blackrussia.online/index.php?categories/Жалобы.467/'][B]Сервер №10 | Black[/B] → нажмите сюда[/URL]<br>[URL='https://forum.blackrussia.online/index.php?categories/Жалобы.498/'][B]Сервер №11 | Indigo[/B] → нажмите сюда[/URL]<br>[URL='https://forum.blackrussia.online/index.php?categories/Жалобы.654/'][B]Сервер №12 | White[/B] → нажмите сюда[/URL]<br>[URL='https://forum.blackrussia.online/index.php?categories/Жалобы.655/'][B]Сервер №13 | Magenta[/B] → нажмите сюда[/URL]<br>[URL='https://forum.blackrussia.online/index.php?forums/Жалобы.619/'][B]Сервер №14 | Crimson[/B] → нажмите сюда[/URL]<br>[URL='https://forum.blackrussia.online/index.php?categories/Жалобы.700/'][B]Сервер №15 | Gold[/B] → нажмите сюда[/URL]<br>[URL='https://forum.blackrussia.online/index.php?categories/Жалобы.720/'][B]Сервер №16 | Azure[/B] → нажмите сюда[/URL]<br>[URL='https://forum.blackrussia.online/index.php?categories/Жалобы.763/'][B]Сервер №17 | Platinum[/B] → нажмите сюда[/URL]<br>[URL='https://forum.blackrussia.online/index.php?forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B.822/'] [B] Сервер №18 | Aqua[/B] → нажмите сюда[/URL]<br>[URL='https://forum.blackrussia.online/index.php?forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B.863/'][B]Сервер №19 | Gray[/B] → нажмите сюда[/URL]<br><br>" +
        '[CENTER]Отказано, закрыто.[/CENTER]',
        prefix: UNACCEPT_PREFIX,
        status: false,
	},
	{
	  title: 'Краш/вылет',
	  content:
		'[CENTER]{{ greeting }}, уважаемый(-ая) {{ user.mention }}.[/CENTER]<br>' +
		"[CENTER]В том случае, если Вы вылетели из игры во время игрового процесса (произошел краш), в обязательном порядке необходимо обратиться в данную тему - https://forum.blackrussia.online/index.php?threads/Вылеты-отсоединения-recaptcha-—-оставляйте-заявку-в-этой-теме.461523/ [/CENTER]<br>" +
		"[CENTER][CODE]01. Ваш игровой никнейм: <br> 02. Сервер: <br> 03. Тип проблемы: Обрыв соединения | Проблема с ReCAPTCHA | Краш игры (закрытие игры) | Другое [Выбрать один вариант ответа] <br> 04. Действия, которые привели к этому (при вылетах, по возможности предоставлять место сбоя): <br> 05. Как часто данная проблема: <br> 06. Полное название мобильного телефона: <br> 07. Версия Android: <br> 08. Дата и время (по МСК): <br> 09. Связь с Вами по Telegram/VK:[/CODE]<br><br>" +
		'[CENTER]Решено, заполните данную форму в теме, указанной выше.[/CENTER]',
	},
	{
	  title: 'Дублирование темы',
	  content:
		'[CENTER]{{ greeting }}, уважаемый(-ая) {{ user.mention }}.[/CENTER]<br>' +
		"[CENTER]Ответ уже был дан в подобной теме. Пожалуйста, прекратите создавать идентичные или похожие темы - иначе Ваш аккаунт может быть заблокирован.<br>" +
		'[CENTER]Отказано, закрыто.[/CENTER]',
	},
	{ 
	  title: 'Сервер не отвечает',
	  content:
	    '[CENTER]{{ greeting }}, уважаемый(-ая) {{ user.mention }}.[/CENTER]<br>' +
	    "[CENTER]Если вы используете wi-fi, переключитесь на мобильный интернет и станьте в очередь на сервер, у Вас будет написано что «Сервер полон. Повторное подключение» это значит всё наладилось и можно переходить на wi-fi обратно.<br>" + 
	    "[CENTER]Если проблема не исчезнет, проверьте стабильность подключения Вашего интернета, возможно высокая скорость отклика (пинг)<br>" +
	    '[CENTER]Рассмотрено.[/CENTER]',
	},
	{
	  title: 'Форма темы',
	  content:
		'[CENTER]{{ greeting }}, уважаемый(-ая) {{ user.mention }}.[/CENTER]<br>' +
		"[CENTER]Пожалуйста, заполните форму, создав новую тему: <br>[CODE]01. Ваш игровой никнейм:<br>02. Сервер, на котором Вы играете:<br>03. Суть Вашей возникшей проблемы (описать максимально подробно и раскрыто): <br>04. Любые скриншоты, которые могут помочь в решении проблемы (если таковые имеются):<br>05. Дата и время произошедшей технической проблемы (постарайтесь указать максимально точно):[/CODE]<br><br>" +
		'[CENTER]Отказано, закрыто.[/CENTER]',
	},
{
	  title: 'Восстановление аккаунта',
	  content:
		'[CENTER]{{ greeting }}, уважаемый(-ая) {{ user.mention }}.[/CENTER]<br>' +
		"[CENTER]Если Вы обезопасили Ваш аккаунт и [U]привязали его к странице во ВКонтакте[/U], то сбросить пароль или пин-код Вы всегда сможете обратившись в официальное сообщество проекта - https://vk.com/blackrussia.online. Напишите 'Начать' в личные сообщения группы, затем выберите нужные Вам функции.<br><br>" +
		"[CENTER]Если Вы обезопасили Ваш аккаунт и [U]привязали его к почте[/U], то сбросить пароль или пин-код Вы всегда сможете при вводе пароля на сервере. Выберите кнопку 'восст', затем выберите нужные Вам функции.<br><br>" +
        "[CENTER]Если Вы [U]не обезопасили свой аккаунт - его невозможно вернуть[/U]. Он будет заблокирован навсегда.<br><br>" +
        '[CENTER]К сожалению, иногда решение подобных вопросов требует много времени. Надеемся, что Вы сможете восстановить доступ к аккаунту! Рассмотрено.[/CENTER]',
	},
{
	  title: 'Слетел аккаунт',
	  content:
        '[CENTER]{{ greeting }}, уважаемый(-ая) {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER]Аккаунт не может пропасть или аннулироваться просто так. Даже если Вы меняете ник, используете кнопки 'починить игру' или 'сброс настроек' - Ваш аккаунт не удаляется. Система работает иначе.<br>" +
        "[CENTER]Проверьте ввод своих данных: пароль, ник-нейм и сервер. Зачастую игроки просто забывают ввести актуальные данные и считают, что их аккаунт был удален. Будьте внимательны! Рассмотрено.<br><br>" +
        '[CENTER]Как ввести никнейм (на случай, если сменили в игре, но не поменяли в клиенте): https://youtu.be/c8rhVwkoFaU[/CENTER]'
	},
    {
	  title: 'Проблема будет исправлена',
	  content:
		'[CENTER]{{ greeting }}, уважаемый(-ая) {{ user.mention }}.[/CENTER]<br>' +
		"[CENTER]Данная недоработка будет проверена и исправлена. Спасибо за то, что помогаете сделать проект лучше!<br><br>" +
		'[CENTER]Рассмотрено.[/CENTER]',
	},
	{
	  title: 'Известно о проблеме',
	  content:
		'[CENTER]{{ greeting }}, уважаемый(-ая) {{ user.mention }}.[/CENTER]<br>' +
		"[CENTER]Команде проекта уже известно о данной проблеме, она обязательно будет рассмотрена и исправлена. Спасибо за Ваше обращение!<br><br>" +
		'[CENTER]Закрыто.[/CENTER]',
	},
	{
	  title: 'Команде проекта',
	  content:
		'[CENTER]{{ greeting }}, уважаемый(-ая) {{ user.mention }}.[/CENTER]<br>' +
		"[CENTER]Ваша тема закреплена и находится на рассмотрении у команды проекта. Пожалуйста, ожидайте выноса вердикта разработчиков.<br>" +
		'[CENTER]Создавать новые темы с данной проблемой — не нужно, ожидайте ответа в данной теме. Если проблема решится - Вы всегда можете оставить своё сообщение в этой теме.[/CENTER]',
	},
	{
	  title: 'Логировщику',
	  content:
	    '[CENTER]{{ greeting }}, уважаемый(-ая) {{ user.mention }}.[/CENTER]<br>' +
	    "[CENTER]Ваша тема закреплена и находится на рассмотрении. Пожалуйста,ожидайте ответа в данной теме.<br>" +
	    '[CENTER]Создавать новые темы с данной проблемой — не нужно.[/CENTER]',
	},
	{
	  title: 'Нет доказательств',
	  content:
		'[CENTER]{{ greeting }}, уважаемый(-ая) {{ user.mention }}.[/CENTER]<br>' +
		"[CENTER]Без доказательств (в частности скриншоты или видео) – решить проблему не получится. Если доказательства найдутся - создайте новую тему, приложив доказательства с фото-хостинга yapx.ru или imgur.com<br><br>" +
		'[CENTER]Отказано, закрыто.[/CENTER]',
	},
    	{
	  title: 'Правила восстановления',
	  content:
		'[CENTER]{{ greeting }}, уважаемый(-ая) {{ user.mention }}.[/CENTER]<br>' +
		"[CENTER]Пожалуйста, убедительная просьба, ознакомтесь с правилами восстановлений: https://clck.ru/NeHEQ. Вы создали тему, которая никоим образом не относится к технической проблеме. Имущество не будет восстановлено.[/CENTER]<br>" +
		'[CENTER]Отказано, закрыто.[/CENTER]',
	},
    {
	  title: 'Донат',
	  content:
		'[CENTER]{{ greeting }}, уважаемый(-ая) {{ user.mention }}.[/CENTER]<br>' +
		'[CENTER]Система построена таким образом, что деньги не спишутся, пока наша платформа не уведомит платежную систему о зачислении BLACK COINS. Для проверки зачисления BLACK COINS необходимо ввести в игре команду: /donat.<br>' +
        '[CENTER]В остальных же случаях, если не были зачислены BLACK COINS — вероятнее всего, была допущена ошибка при вводе реквизитов. К нашему сожалению, из-за большого количества попыток обмана, мы перестали рассматривать подобные жалобы. Вам необходимо быть внимательными при осуществлении покупок. <br>' +
        '[CENTER]Решено.[/CENTER]',
    },
    {
	  title: 'Хочу стать админом',
	  content:
		'[CENTER]{{ greeting }}, уважаемый(-ая) {{ user.mention }}.[/CENTER]<br>' +
		"[CENTER]Команда технических специалистов не решает назначение на какую-либо должность,которая присутствует на проекте. Для этого существуют заявления в главном разделе Вашего сервера. Приятной игры и удачи в начинаниях!<br>" +
		'[CENTER]Закрыто.[/CENTER]',
	},
    {
	  title: 'Жалобы на техспециалистов',
	  content:
		'[CENTER]{{ greeting }}, уважаемый(-ая) {{ user.mention }}.[/CENTER]<br>' +
		'[CENTER]Вы получили наказание от технического специалиста Вашего сервера. Вам следует обратиться в раздел жалоб на технических специалистов в случае, если Вы не согласны с наказанием.<br>' +
        '[CENTER]Ссылка на раздел, где можно оформить жалобу на технического специалиста: https://forum.blackrussia.online/index.php?forums/Жалобы-на-технических-специалистов.490/ <br>' +
        '[CENTER]Закрыто.[/CENTER]'
	},
];

$(document).ready(() => {
// Загрузка скрипта для обработки шаблонов
$('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');

// Добавление кнопок при загрузке страницы
addButton('На рассмотрении', 'pin');
addButton('КП', 'teamProject');
addButton('Отказано', 'unaccept');
addButton('Рассмотренно', 'watched');
addButton('Решено', 'accepted');
addButton('Закрыто', 'closed');
addButton('Ответы', 'selectAnswer');


// Поиск информации о теме
const threadData = getThreadData();

$('button#unaccept').click(() => editThreadData(UNACCEPT_PREFIX, false));
$('button#pin').click(() => editThreadData(PIN_PREFIX, true));
$('button#accepted').click(() => editThreadData(ACCEPT_PREFIX, false));
$('button#teamProject').click(() => editThreadData(COMMAND_PREFIX, true));
$('button#watched').click(() => editThreadData(WATCHED_PREFIX, false));
$('button#closed').click(() => editThreadData(CLOSE_PREFIX, false));

$(`button#selectAnswer`).click(() => {
  XF.alert(buttonsMarkup(buttons), null, 'Выберите ответ:');
  buttons.forEach((btn, id) => {
	$(`button#answers-${id}`).click(() => pasteContent(id, threadData));
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

function pasteContent(id, data = {}) {
const template = Handlebars.compile(buttons[id].content);
if ($('.fr-element.fr-view p').text() === '') $('.fr-element.fr-view p').empty();

$('span.fr-placeholder').empty();
$('div.fr-element.fr-view p').append(template(data));
$('a.overlay-titleCloser').trigger('click');
}

// Приветствие и время суток
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
	  : 11 < hours && hours <= 17
	  ? 'Добрый день'
	  : 17 < hours && hours <= 23
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
            discussion_open: 1,
			sticky: 1,
			_xfToken: XF.config.csrf,
			_xfRequestUri: document.URL.split(XF.config.url.fullBase)[1],
			_xfWithData: 1,
			_xfResponseType: 'json',
		  }),
		}).then(() => location.reload());
	}
	if(prefix == UNACCEPT_PREFIX || prefix == ACCEPT_PREFIX || prefix == CLOSE_PREFIX || prefix == WATCHED_PREFIX) {
		moveThread(prefix, 230);
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
        