// ==UserScript==
// @name         Voronezh ЗГА/Кураторы
// @namespace    https://forum.blackrussia.online
// @version      1.0
// @description  Мой скрипт топ
// @author       Tommy_Ferrari
// @match        https://forum.blackrussia.online/threads/*
// @include      https://forum.blackrussia.online/threads/
// @grant        none
// @license 	 MIT
// @collaborator Quenk269
// @icon https://icons.iconarchive.com/icons/papirus-team/papirus-apps/48/emerald-theme-manager-icon-icon.png
// @updateURL
// @downloadURL https://update.greasyfork.org/scripts/468366/Voronezh%20%D0%97%D0%93%D0%90%D0%9A%D1%83%D1%80%D0%B0%D1%82%D0%BE%D1%80%D1%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/468366/Voronezh%20%D0%97%D0%93%D0%90%D0%9A%D1%83%D1%80%D0%B0%D1%82%D0%BE%D1%80%D1%8B.meta.js
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
const SPECIAL_PREFIX = 11;
const TECH_PREFIX = 13;
const buttons = [
    {
	  title: '----> Раздел Жалоб <-----',
	},
    {
	  title: '|',
	  content:
		"[B]Здравствуйте уважаемый {{ user.name }} [/B]<br><br>"+
		"[B][/B]",
	},
	{
	  title: 'На рассмотрение',
	  content:
		"[B]Здравствуйте уважаемый {{ user.name }}. [/B]<br><br>"+
		"[B]Ваша жалоба взята на рассмотрение, пожалуйста не создавайте дубликатов. Ожидайте ответа.<br>"+
		'[B]На рассмотрение[/B]',
	  prefix: PIN_PREFIX,
	  status: true,
	},
    {
	  title: 'Не по форме',
	  content:
		"[B]Здравствуйте уважаемый {{ user.name }}. [/B]<br><br>"+
		"[B]Ваша жалоба составлена не по форме, пожалуйста ознакомьтесь с правилами подачи жалоб : [URL='https://forum.blackrussia.online/index.php?threads/3429349/']*Нажмите сюда*[/URL].<br>"+
        '[B]Отказано.[/B]',

	  prefix: CLOSE_PREFIX,
	  status: false,
	},
	{
	  title: 'Нет /time',
	  content:
		"[B]Здравствуйте уважаемый {{ user.name }}. [/B]<br><br>"+
		"[B]В предоставленных доказательств отсутствует время (/time), не подлежит рассмотрению.<br>"+
        '[B]Отказано.[/B]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
	{
	  title: 'От 3 лица',
	  content:
		"[B]Здравствуйте уважаемый {{ user.name }}. [/B]<br><br>"+
		"[B]Жалоба составлена от 3-го лица, мы не можем ее рассмотреть.<br>"+
		'[B]Отказано.[/B]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
	{
	  title: 'Нужен фрапс',
	  content:
		"[B]Здравствуйте уважаемый {{ user.name }}. [/B]<br><br>"+
		"[B]В данной ситуации обязательно должен быть фрапс (видео фиксация) всех моментов, в противном случае жалоба будет отказано.<br>"+
		'[B]Отказано.[/B]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
        {
	  title: 'Нефул фрапс',
	  content:
		"[B]Здравствуйте уважаемый {{ user.name }}. [/B]<br><br>"+
		"[B]Видео запись не полная либо же нет условии сделки, к сожелению мы вынуждены отказать..<br>"+
		'[B]Отказано.[/B]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
	{
	  title: 'Доки отредактированы',
	  content:
		"[B]Здравствуйте уважаемый {{ user.name }}. [/B]<br><br>"+
		"[B] Представленные доказательства были отредактированные или в плохом качестве, пожалуйста прикрепите оригинал.<br>"+
		'[B]Отказано.[/B]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
	{
	  title: 'Прошло больше 48 часов',
	  content:
		"[B]Здравствуйте уважаемый {{ user.name }}. [/B]<br><br>"+
		"[B] С момента выдачи наказания прошло более 48-ми часов, жалоба не подлежит рассмотрению.<br>"+
		'[B]Отказано.[/B]',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
	  title: 'Нет доков',
	  content:
		"[B]Здравствуйте уважаемый {{ user.name }}. [/B]<br><br>"+
		"[B]В вашей жалобе отсутствуют доказательства для рассмотра. Пожалуйста прикрепите доказательсва в хорошем качестве на разрешенных платформах. (Yapix/Imgur/Youtube/Disk)<br>"+
		'[B]Отказано.[/B]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
	{
	  title: 'Не рабочие доква',
	  content:
		"[B]Здравствуйте уважаемый {{ user.name }}. [/B]<br><br>"+
		"[B]Предоставленные доказательства не рабочие либо же битая ссылка, пожалуйста загрузите доказательства на фото/видео хостинге.<br>"+
		'[B]Отказано.[/B]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
	{
	  title: 'Окно бана',
	  content:
		"[B]Здравствуйте уважаемый {{ user.name }}. <br><br>"+
		"[B]Зайдите в игру и сделайте скрин окна с баном после чего, заново напишите жалобу.<br>"+
		'[B]Отказано.[/B]',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: 'Дублирование',
	  content:
		"[B]Здравствуйте уважаемый {{ user.name }}. [/B]<br><br>"+
		"[B]Напоминаю, за дублирование тем ваш форумный аккаунт может быть заблокирован.<br>"+
		'[B]Отказано.[/B]',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: 'Проинструктировать',
	  content:
		"[B]Здравствуйте уважаемый {{ user.name }}. [/B]<br><br>"+
		"[B]Благодарим за ваше обращение! Администратор будет проинструктирован.<br>"+
		'[B]Одобрено.[/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: 'Беседа с админом',
	  content:
		"[B]Здравствуйте уважаемый {{ user.name }}. [/B]<br><br>"+
		"[B]Ваша жалоба была одобрена и будет проведена беседа с администратором.<br>"+
		'[B]Одобрено.[/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: 'Строгая беседа с админом',
	  content:
		"[B]Здравствуйте уважаемый {{ user.name }}. [/B]<br><br>"+
		"[B]Ваша жалоба была одобрена и будет проведена строгая беседа с администратором.<br>"+
		'[B]Одобрено.[/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: 'Админ будет наказан',
	  content:
		"[B]Здравствуйте уважаемый {{ user.name }}. [/B]<br><br>"+
		"[B]Ваша жалоба была одобрена и администратор получит наказание.<br>"+
		'[B]Одобрено.[/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: 'Нет нарушений',
	  content:
		"[B]Здравствуйте уважаемый {{ user.name }}. [/B]<br><br>"+
		"[B]Исходя из выше приложенных доказательств, нарушения со стороны администратора - не имеется!<br>"+
		'[B]Отказано.[/B]',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: 'Наказание верное',
	  content:
		"[B]Здравствуйте уважаемый {{ user.name }}. [/B]<br><br>"+
		"[B]Проверив доказательства администратора, было принято решение, что наказание выдано верно.<br>"+
		'[B]Закрыто.[/B]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
	{
	  title: 'Наказание по ошибке',
	  content:
		"[B]Здравствуйте уважаемый {{ user.name }}. [/B]<br><br>"+
		"[B]В следствие беседы с администратором, было выяснено, наказание было выдано по ошибке.<br>"+
		'[B]Одобрено.[/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: 'Админ Снят/ПСЖ',
	  content:
		"[B]Здравствуйте уважаемый {{ user.name }}. [/B]<br><br>"+
		"[B]Администратор был снят/ушел с поста администратора.<br>"+
		'[B]Рассмотрено.[/B]',
	  prefix: WATCHED_PREFIX,
	  status: false,
	},
    {
	  title: 'Передано ГА',
	  content:
		"[B]Здравствуйте уважаемый {{ user.name }}. [/B]<br><br>"+
		"[B]Жалоба передана Главному Администратору - @Jennie Carter, пожалуйста ожидайте ответа..<br>"+
		'[B]Передано Главному Администратору.[/B]',
	  prefix: GA_PREFIX,
	  status: true,
	},
	{
	  title: 'Передано ЗГА ГОСС & ОПГ',
	  content:
		"[B]Здравствуйте уважаемый {{ user.name }}. [/B]<br><br>"+
		"[B]Жалоба передана Заместителю Главного Администратора по направлени ОПГ и ГОСС - @Tommy Ferrari, пожалуйста ожидайте ответа..<br>"+
		'[B]Передано ЗГА ГОСС&ОПГ.[/B]',
	  prefix: GA_PREFIX,
	  status: true,
	},
	{
	  title: 'Передано Теху',
	  content:
		"[B]Здравствуйте уважаемый {{ user.name }}. [/B]<br><br>"+
		"[B]Ваша жалоба была передана техническому специалисту сервера, пожалуйста ожидайте ответа..<br>"+
		'[B]Передано Техническому Специалисту.[/B]',
	  prefix: GA_PREFIX,
	  status: true,
	},
	{
	  title: 'Передано Спецу и Заму Спеца',
	  content:
		"[B]Здравствуйте уважаемый {{ user.name }}. [/B]<br><br>"+
		"[B] Жалоба передана Специальному Администратору, а так же его Заместителю - @Sander_Kligan / @Clarence Crown, пожалуйста ожидайте ответа.<br>"+
		'[B]Передано Специальному Администратору.[/B]',
	  prefix: SPECIAL_PREFIX,
	  status: true,
	},
	{
	  title: 'Соц. сети',
	  content:
		"[B]Здравствуйте уважаемый {{ user.name }}. [/B]<br><br>"+
		"[B]Доказательства из соц. сетей не принимаются, вам нужно загрузить доказательств на видео/фото хостинге.<br>"+
		'[B]Отказано.[/B]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
	{
	  title: 'В Тех раздел',
	  content:
		"[B]Здравствуйте уважаемый {{ user.name }}. [/B]<br><br>"+
		"[B]Пожалуйста составьте свою жалобу в Технический раздел сервера : [URL=https://forum.blackrussia.online/index.php?forums/%D0%A1%D0%B5%D1%80%D0%B2%D0%B5%D1%80-%E2%84%9640-voronezh.1799/]*Нажмите сюда*[/URL]<br>"+
		'[B]Отказано.[/B]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
	{
	  title: 'В ЖБ на теха',
	  content:
		"[B]Здравствуйте уважаемый {{ user.name }}. [/B]<br><br>"+
		"[B]Вам было выдано наказания Техническим специалистом, вы можете написать жалобу здесь : [URL='https://forum.blackrussia.online/index.php?forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D1%82%D0%B5%D1%85%D0%BD%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%B8%D1%85-%D1%81%D0%BF%D0%B5%D1%86%D0%B8%D0%B0%D0%BB%D0%B8%D1%81%D1%82%D0%BE%D0%B2.490/']*Нажмите сюда*[/URL]<br>"+
		'[B]Отказано.[/B]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
	{
	  title: 'В обжалование',
	  content:
		"[B]Здравствуйте уважаемый {{ user.name }}. [/B]<br><br>"+
		"[B] Если вы согласны с выданным наказанием, то напишите в раздел Обжалование.<br>"+
		'[B]Отказано.[/B]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
    {
	  title: '_____Раздел Обжалование____',
	},
    {
	  title: 'Не по форме',
	  content:
		"[B]Здравствуйте уважаемый {{ user.name }}. [/B]<br><br>"+
		"[B]Ваше обжалование составлено не по форме, пожалуйста ознакомьтесь с правилами подачи обжалований : [URL='https://forum.blackrussia.online/index.php?threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BF%D0%BE%D0%B4%D0%B0%D1%87%D0%B8-%D0%B7%D0%B0%D1%8F%D0%B2%D0%BA%D0%B8-%D0%BD%D0%B0-%D0%BE%D0%B1%D0%B6%D0%B0%D0%BB%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D0%B5-%D0%BD%D0%B0%D0%BA%D0%B0%D0%B7%D0%B0%D0%BD%D0%B8%D1%8F.2639626/']*Нажмите сюда*[/URL]<br>"+
		'[B]Отказано.[/B]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
    {
	  title: 'Обжалованию не подлежит',
	  content:
		"[B]Здравствуйте уважаемый {{ user.name }}. [/B]<br><br>"+
		"[B]Данное нарушения не подлежит обжалованию, администрация не может снизить вам его.<br>"+
		'[B]Отказано.[/B]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
    {
	  title: 'Не готовы снизить',
	  content:
		"[B]Здравствуйте уважаемый {{ user.name }}. [/B]<br><br>"+
		"[B]Администрация сервера не готова снизить вам наказания, пожалуйста не создавайте дубликаты, создание дубликатов карается баном форумного аккаунта.<br>"+
		'[B]Отказано.[/B]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
    {
	  title: 'ОБЖ на рассмотрение',
	  content:

		"[B]Здравствуйте уважаемый {{ user.name }}. [/B]<br><br>"+
		"[B]Ваше обжалование взято на рассмотрение, пожалуйста не создавайте дубликатов. Ожидайте ответа.<br>"+
		'[B]На рассмотрение.[/B]',
	  prefix: PIN_PREFIX,
	  status: true,
	},
    {
	  title: 'Уже есть мин. наказания',
	  content:
		"[B]Здравствуйте уважаемый {{ user.name }}. [/B]<br><br>"+
		"[B]Вам было выдано минимальное наказание, обжалованию не подлежит.<br>"+
		'[B]Отказано.[/B]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
	{
	  title: 'Обжалование одобрено',
	  content:
		"[B]Здравствуйте уважаемый {{ user.name }}. [/B]<br><br>"+
		"[B]Обжалование одобрено, ваше наказание будет снято/снижено в течение 24-ех часов.<br>"+
		'[B]Одобрено.[/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
    {
	  title: 'Передано ГА обж',
	  content:
		"[B]Здравствуйте уважаемый {{ user.name }}. <br><br>"+
		"[B]Обжалование передано Главному Администратору - @Jennie Carter, пожалуйста ожидайте ответа.<br>"+
		'[B]На рассмотрение.[/B]',
	  prefix: GA_PREFIX,
	  status: true,
	},
	{
	  title: 'Соц. сети ОБЖ',
	  content:
		"[B]Здравствуйте уважаемый {{ user.name }}. [/B]<br><br>"+
		"[B] Доказательства из соц сетей не принимаются, вам нужно загрузить доказательств на видео/фото хостинге.<br>"+
		'[B]Отказано.[/B]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
	{
	  title: 'В жб на админов',
	  content:
		"[B]Здравствуйте уважаемый {{ user.name }}. [/B]<br><br>"+
		"[B]Если вы не согласны с выданным наказанием, то напишите в раздел Жалобы на Администрацию.<br>"+
		'[B]Отказано.[/B]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	}
];

$(document).ready(() => {
	// Загрузка скрипта для обработки шаблонов
	$('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');

	// Добавление кнопок при загрузке страницы
	addButton('Ответы', 'selectAnswer');
	


	// Поиск информации о теме
	const threadData = getThreadData();

	$('button#pin').click(() => editThreadData(PIN_PREFIX, true));
	$('button#accepted').click(() => editThreadData(ACCEPT_PREFIX, false));
	$(`button#teamProject`).click(() => editThreadData(COMMAND_PREFIX, true));
	$(`button#techspec`).click(() => editThreadData( TECH_PREFIX , true));
	$(`button#watched`).click(() => editThreadData(WATCHED_PREFIX, false));
	$(`button#unaccept`).click(() => editThreadData(UNACCEPT_PREFIX, false));
	$(`button#mainAdmin`).click(() => editThreadData(GA_PREFIX, true));

	$(`button#specialAdmin`).click(() => editThreadData(SPECIAL_PREFIX, true));

	$('button#unaccept').click(() => editThreadData(UNACCEPT_PREFIX, false));

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
})();// ==UserScript==
// @name         New Userscript
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://forum.blackrussia.online/index.php?forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B0%D0%B4%D0%BC%D0%B8%D0%BD%D0%B8%D1%81%D1%82%D1%80%D0%B0%D1%86%D0%B8%D1%8E.1400/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=blackrussia.online
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
})();