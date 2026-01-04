// ==UserScript==
// @name         For guidance by S.Ryabov
// @namespace    https://forum.blackrussia.online
// @version      0.25
// @description  Always remember who you are!
// @author       Sema_Ryabov
// @match        https://forum.blackrussia.online/threads/*
// @include      https://forum.blackrussia.online/threads/
// @grant        none
// @license 	 MIT
// @collaborator Sema_Ryabov
// @icon https://icons.iconarchive.com/icons/papirus-team/papirus-apps/48/emerald-theme-manager-icon-icon.png
// @downloadURL https://update.greasyfork.org/scripts/468947/For%20guidance%20by%20SRyabov.user.js
// @updateURL https://update.greasyfork.org/scripts/468947/For%20guidance%20by%20SRyabov.meta.js
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
const CLOSE_PREFIX = 7;
const SA_PREFIX = 11;
const buttons = [

    {
	  title: 'Приветствие',
	  content:
		'[SIZE=4][FONT=courier new][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER]<br><br>' +
		"[CENTER]<br><br>",
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
    {
	  title: 'В ЖБ на техов',
	  content:
		'[Color=Red][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER][/B]' +
		"[CENTER]Обратитесь в раздел «Жалобы на технических Специалистов».[/CENTER]<br><br>" +
		'[Color=Red][CENTER][B]Закрыто.[/CENTER][/color][/B]',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
    {
	  title: 'ЖБ от 3-го лица',
	  content:
		'[Color=Red][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER][/B]' +
		"[CENTER]Жалобы составленые от 3-го лица не подлежат рассмотрению.[/CENTER]<br><br>" +
		'[Color=Red][CENTER][B]Закрыто.[/CENTER][/color][/B]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
    {
	  title: 'Недостаточно доказательств «ЖБ»<таб>',
	  content:
		'[Color=Red][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER][/B]' +
		"[CENTER]Недостаточно доказательств, чтобы корректно рассмотреть данную жалобу.<br>Доказательства должны состоять из скриншота с табличкой выданного наказания которую вы можете увидеть при заходе на сервер.[/CENTER]<br><br>" +
		'[Color=Red][CENTER][B]Закрыто.[/CENTER][/color][/B]',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
    {
	  title: 'Недостаточно доказательств «ЖБ»',
	  content:
		'[Color=Red][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER][/B]' +
		"[CENTER]Недостаточно доказательств, чтобы корректно рассмотреть данную жалобу.[/CENTER]<br><br>" +
		'[Color=Red][CENTER][B]Закрыто.[/CENTER][/color][/B]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
    {
	  title: 'Недейств. доказательства',
	  content:
		'[Color=Red][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER][/B]' +
		"[CENTER]Доказательства предоставлены в плохом качестве или являются обрезанными.[/CENTER]<br><br>" +
		'[Color=Red][CENTER][B]Закрыто.[/CENTER][/color][/B]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
    {
	  title: 'Недостаточно док-в обжалование',
	  content:
		'[Color=Red][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER][/B]' +
		"[CENTER]Недостаточно доказательств, чтобы корректно рассмотреть данное обжалование.<br>Доказательства должны состоять из скриншота с табличкой выданного наказания которую вы можете увидеть при заходе на сервер.[/CENTER]<br><br>" +
		'[Color=Red][CENTER][B]Закрыто.[/CENTER][/color][/B]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
    {
	  title: 'Жалоба на рассмотрении',
	  content:
		'[Color=Red][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER][/B]' +
		"[CENTER]Ваша жалоба взята на рассмотрение.[/CENTER]<br><br>" +
		'[Color=Red][CENTER][B]Ожидайте ответа.[/CENTER][/color][/B]',
	  prefix: PIN_PREFIX,
	  status: true,
	},
	{
	  title: 'Запросить док-ва',
	  content:
		'[Color=Red][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER][/B]' +
		"[CENTER]Запрошу доказательства у данного администратора.[/CENTER]<br><br>" +
		'[Color=Red][CENTER][B]Ожидайте ответа.[/CENTER][/color][/B]',
	  prefix: PIN_PREFIX,
	  status: true,
	},
	{
	  title: 'Жалоба одобрена',
	  content:
		'[Color=Red][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER][/B]' +
		"[CENTER]Ваша жалоба была одобрена и будет проведена беседа с администратором.<br>Ваше наказание будет снято в течение 12-ти часов.[/CENTER]<br><br>" +
		'[Color=Red][CENTER][B]Закрыто.[/CENTER][/color][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
    {
	  title: 'Жалоба одобрена (без снятия наказания)',
	  content:
		'[Color=Red][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER][/B]' +
		"[CENTER]Ваша жалоба была одобрена и будет проведена беседа с данным администратором.[/CENTER]<br><br>" +
		'[Color=Red][CENTER][B]Закрыто.[/CENTER][/color][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: 'Жалоба отказана',
	  content:
		'[Color=Red][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER][/B]' +
		"[CENTER]Проверив доказательства администратора, было принято решение, что наказание выдано верно.[/CENTER]<br><br>" +
		'[Color=Red][CENTER][B]Закрыто.[/CENTER][/color][/B]',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: 'Жалоба не по форме',
	  content:
		'[Color=Red][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER][/B]' +
		"[CENTER]Жалоба составлена не по форме.<br>Внимательно прочитайте правила составления жалоб, которые написаны в [U][URL='https://forum.blackrussia.online/index.php?threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BF%D0%BE%D0%B4%D0%B0%D1%87%D0%B8-%D0%B6%D0%B0%D0%BB%D0%BE%D0%B1-%D0%BD%D0%B0-%D0%B0%D0%B4%D0%BC%D0%B8%D0%BD%D0%B8%D1%81%D1%82%D1%80%D0%B0%D1%86%D0%B8%D1%8E.1426106/']данной[/URL][/U] теме.[/CENTER]<br><br>" +
		'[Color=Red][CENTER][B]Закрыто.[/CENTER][/color][/B]',
	  prefix: CLOSE_PREFIX,
	  status: false,
    },
    {
        title: 'В жалобе мат',
	  content:
		'[Color=Red][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER][/B]' +
		"[CENTER]В вашей жалобе присутствует нецензурная брань.[/CENTER]<br><br>" +
		'[Color=Red][CENTER][B]Закрыто.[/CENTER][/color][/B]',
	  prefix: CLOSE_PREFIX,
	  status: false,
    },
    {
        title: 'Отсутствуют доказательства',
	  content:
		'[Color=Red][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER][/B]' +
		"[CENTER]В вашей жалобе отсутствуют доказательства.[/CENTER]<br><br>" +
		'[Color=Red][CENTER][B]Закрыто.[/CENTER][/color][/B]',
	  prefix: CLOSE_PREFIX,
	  status: false,
    },
    {
        title: 'Редактирование доказательств',
	  content:
		'[Color=Red][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER][/B]' +
		"[CENTER]Доказательства, которые были отредактированы и на которых присутствует посторонняя музыка, неадекватная речь, нецензурные слова или выражения, могут быть не рассмотрены в качестве доказательств.<br>Если видеодоказательство длится более 3 минут, Вы должны указать тайм-коды нарушений.[/CENTER]<br><br>" +
		'[Color=Red][CENTER][B]Закрыто.[/CENTER][/color][/B]',
	  prefix: CLOSE_PREFIX,
	  status: false,
    },
    {
        title: 'Отсутствует /time',
	  content:
		'[Color=Red][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER][/B]' +
		"[CENTER]В жалобе отсутствует /time.[/CENTER]<br><br>" +
		'[Color=Red][CENTER][B]Закрыто.[/CENTER][/color][/B]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
	{
	  title: 'жб ГА',
	  content:
		'[Color=Red][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER][/B]' +
		"[CENTER]Ваша жалоба будет передана Главному Администратору на рассмотрение.[/CENTER]<br><br>" +
		'[Color=Red][CENTER][B]Ожидайте ответа.[/CENTER][/color][/B]',
	  prefix: GA_PREFIX,
	  status: true,
	},
    {
	  title: 'обж ГА',
	  content:
		'[Color=Red][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER][/B]' +
		"[CENTER]Ваше обжалование будет передано Главному Администратору на рассмотрение.[/CENTER]<br><br>" +
		'[Color=Red][CENTER][B]Ожидайте ответа.[/CENTER][/color][/B]',
	  prefix: GA_PREFIX,
	  status: true,
	},
    {
	  title: 'Обжалование на рассмотрении',
	  content:
		'[Color=Red][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER][/B]' +
		"[CENTER]Ваше обжалование взято на рассмотрение.[/CENTER]<br><br>" +
		'[Color=Red][CENTER][B]Ожидайте ответа.[/CENTER][/color][/B]',
	  prefix: PIN_PREFIX,
	  status: true,
	},
	{
	  title: 'Обжалованию не подлежит',
	  content:
		'[Color=Red][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER][/B]' +
		"[CENTER]Данное наказание обжалованию не подлежит.[/CENTER]<br><br>" +
		'[Color=Red][CENTER][B]Закрыто.[/CENTER][/color][/B]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
    {
	  title: 'Обжалование отказано',
	  content:
		'[Color=Red][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER][/B]' +
		"[CENTER]Администрация не готова снизить вам наказание.<br>В обжаловании отказано.[/CENTER]<br><br>" +
		'[Color=Red][CENTER][B]Закрыто.[/CENTER][/color][/B]',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: 'Обжалование одобрено',
	  content:
		'[Color=Red][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER][/B]' +
		"[CENTER]Ваше обжалование получает статус «Одобрено».<br>Наказание будет снижено/снято.[/CENTER]<br><br>" +
		'[Color=Red][CENTER][B]Закрыто.[/CENTER][/color][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
		{
	  title: 'Обжалование NonRP обмана',
	  content:
		'[Color=Red][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER][/B]' +
		"[CENTER]У вас есть ровно 24 часа чтобы вернуть игроку имущество или средства на которые вы провели NonRP обман, если за данное время это сделано не будет, то ваш аккаунт блокируется навсегда без права на обжалование.[/CENTER]<br><br>" +
		'[Color=Red][CENTER][B]Закрыто.[/CENTER][/color][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: 'Уже есть мин. наказание',
	  content:
		'[Color=Red][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER][/B]' +
		"[CENTER]Вам итак выдано минимальное наказание.[/CENTER]<br><br>" +
		'[Color=Red][CENTER][B]Закрыто.[/CENTER][/color][/B]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
	{
	  title: 'Обжалование не по форме',
	  content:
		'[Color=Red][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER][/B]' +
		"[CENTER]Обжалование составлено не по форме.<br>Внимательно прочитайте правила составления обжалования, которые написаны в [U][URL='https://forum.blackrussia.online/index.php?threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BF%D0%BE%D0%B4%D0%B0%D1%87%D0%B8-%D0%B7%D0%B0%D1%8F%D0%B2%D0%BA%D0%B8-%D0%BD%D0%B0-%D0%BE%D0%B1%D0%B6%D0%B0%D0%BB%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D0%B5-%D0%BD%D0%B0%D0%BA%D0%B0%D0%B7%D0%B0%D0%BD%D0%B8%D1%8F.1426138/']данной[/URL][/U] теме.[/CENTER]<br><br>" +
		'[Color=Red][CENTER][B]Закрыто.[/CENTER][/color][/B]',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: 'Направить в раздел жб на адм',
	  content:
		'[Color=Red][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER][/B]' +
		"[CENTER]Если не согласны с выданным наказанием от администрации, то обратитесь в раздел «Жалобы на администрацию».[/CENTER]<br><br>" +
		'[Color=Red][CENTER][B]Закрыто.[/CENTER][/color][/B]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
    {
	  title: 'Направить в раздел жб на игроков',
	  content:
		'[Color=Red][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER][/B]' +
		"[CENTER]Если есть жалобы на какого-либо игрока, то обратитесь в раздел «Жалобы на игроков».[/CENTER]<br><br>" +
		'[Color=Red][CENTER][B]Закрыто.[/CENTER][/color][/B]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
    {
	  title: 'Направить в раздел обж',
	  content:
		'[Color=Red][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER][/B]' +
		"[CENTER]Если хотите попытаться снизить срок вашего наказания, то обратитесь в раздел «Обжалование наказаний».[/CENTER]<br><br>" +
		'[Color=Red][CENTER][B]Закрыто.[/CENTER][/color][/B]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
    {
	  title: 'Соц. сети',
	  content:
		'[Color=Red][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER][/B]' +
		"[CENTER]Доказательства из каких-либо соц. сетей не принимаются.<br>Требуется загрузить доказательства на какой-либо фото/видео хостинг.[/CENTER]<br><br>" +
		'[Color=Red][CENTER][B]Закрыто.[/CENTER][/color][/B]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
    {
	  title: 'Не замечено нарушений',
	  content:
		'[Color=Red][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER][/B]' +
		"[CENTER]Со стороны администрации нарушений не замечено.[/CENTER]<br><br>" +
		'[Color=Red][CENTER][B]Закрыто.[/CENTER][/color][/B]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
    {
	  title: 'Прошло 48 часов <ЖБ>',
	  content:
		'[Color=Red][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER][/B]' +
		"[CENTER] Срок написания жалобы составляет два дня (48 часов) с момента совершенного нарушения со стороны администратора сервера.[/CENTER]<br><br>" +
		'[Color=Red][CENTER][B]Закрыто.[/CENTER][/color][/B]',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
    {
	  title: 'Наказание по форуму',
	  content:
		'[Color=Red][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER][/B]' +
		"[CENTER]Вам было выдано наказание по жалобе на форуме.<br>Если есть желание попробовать снизить наказание, то обратитесь в раздел «Обжалование наказаний».[/CENTER]<br><br>" +
		'[Color=Red][CENTER][B]Закрыто.[/CENTER][/color][/B]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
	{
	  title: 'Недейств. ссылка',
	  content:
		'[Color=Red][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER][/B]' +
		"[CENTER]Ваша прикреплённая ссылка на доказательства является недействительной.[/CENTER]<br><br>" +
		'[Color=Red][CENTER][B]Закрыто.[/CENTER][/color][/B]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
    {
	  title: 'Уже дан ответ',
	  content:
		'[Color=Red][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER][/B]' +
		"[CENTER]Вам уже был дан корректный ответ в прошлых темах.[/CENTER]<br><br>" +
		'[Color=Red][CENTER][B]Закрыто.[/CENTER][/color][/B]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
	{
	  title: 'жб спец.адм.',
	  content:
		'[Color=Red][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER][/B]' +
		"[CENTER]Ваша жалоба будет передана Специальному Администратору на рассмотрение.[/CENTER]<br><br>" +
		'[Color=Red][CENTER][B]Ожидайте ответа.[/CENTER][/color][/B]',
	  prefix: SA_PREFIX,
	  status: true,
	},
		{
	  title: 'жб команде проекта',
	  content:
		'[Color=Red][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER][/B]' +
		"[CENTER]Ваша жалоба будет передана Команде проекта на рассмотрение.[/CENTER]<br><br>" +
		'[Color=Red][CENTER][B]Ожидайте ответа.[/CENTER][/color][/B]',
	  prefix: COMMAND_PREFIX,
	  status: true,
	},
		{
	  title: 'обжалование команде проекта',
	  content:
		'[Color=Red][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER][/B]' +
		"[CENTER]Ваша обжалование перенаправлено Команде Проекта.[/CENTER]<br><br>" +
		'[Color=Red][CENTER][B]Ожидайте ответа.[/CENTER][/color][/B]',
	  prefix: COMMAND_PREFIX,
	  status: true,
	},
		{
	  title: 'обжалование спец. адм.',
	  content:
		'[Color=Red][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER][/B]' +
		"[CENTER]Ваша обжалование перенаправлено Специальному администратору.[/CENTER]<br><br>" +
		'[Color=Red][CENTER][B]Ожидайте ответа.[/CENTER][/color][/B]',
	  prefix: SA_PREFIX,
	  status: true,
	},



];

$(document).ready(() => {
	// Загрузка скрипта для обработки шаблонов
	$('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');

	// Добавление кнопок при загрузке страницы
	addButton('На рассмотрение', 'pin');
	addButton('КП', 'teamProject');
	addButton('Одобрено', 'accepted');
	addButton('Отказано', 'unaccept');
	addButton('Ответы', 'selectAnswer');

	// Поиск информации о теме
	const threadData = getThreadData();

	$('button#pin').click(() => editThreadData(PIN_PREFIX, true));
	$('button#accepted').click(() => editThreadData(ACCEPT_PREFIX, false));
	$('button#teamProject').click(() => editThreadData(COMMAND_PREFIX, true));
	$('button#unaccept').click(() => editThreadData(UNACCEPT_PREFIX, false));

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