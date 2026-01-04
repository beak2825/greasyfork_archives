// ==UserScript==
// @name Adelard Lemonte мой скрипт
// @namespace https://forum.blackrussia.online
// @version 1.2
// @description Официальный скрипт на форум для технического отдела BLACK RUSSIA
// @author t.me/cyberalg
// @match https://forum.blackrussia.online/threads/*
// @include https://forum.blackrussia.online/threads/
// @grant t.me/cyberalg
// @license t.me/cyberalg
// @collaborator t.me/cyberalg
// @icon https://i.yapx.ru/ViO6c.png
// @downloadURL https://update.greasyfork.org/scripts/485247/Adelard%20Lemonte%20%D0%BC%D0%BE%D0%B9%20%D1%81%D0%BA%D1%80%D0%B8%D0%BF%D1%82.user.js
// @updateURL https://update.greasyfork.org/scripts/485247/Adelard%20Lemonte%20%D0%BC%D0%BE%D0%B9%20%D1%81%D0%BA%D1%80%D0%B8%D0%BF%D1%82.meta.js
// ==/UserScript==

(function () {
	'use strict';
	const UNACCEPT_PREFIX = 4; // префикс отказано
	const PIN_PREFIX = 2; //  префикс закрепить
	const COMMAND_PREFIX = 10; // команде проекта
	const CLOSE_PREFIX = 7; // префикс закрыто
	const DECIDED_PREFIX = 6; // префикс решено
	const TECHADM_PREFIX = 13 // теху администратору
	const WATCHED_PREFIX = 9; // рассмотрено
	const WAIT_PREFIX = 14; // ожидание (для переноса в баг-трекер)
	const NO_PREFIX = 0;
	const buttons = [
	{
		title: 'Приветствие',
		content:
		'[SIZE=4][FONT=Veranda][CENTER]Доброго времени суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		'[CENTER]Здесь вставьте Ваш текст[/CENTER][/FONT][/SIZE]',
	},
        {
		title: 'покупка ив',
		content:
		'[SIZE=4][FONT=Veranda][CENTER]Доброго времени суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Вы были заблокированы за Покупку Игровой валюты так как были замечены переводы на банковские счета от продавца Игровой Валюты.<br>Это нарушает пункт правил - <br> 2.28. Запрещена покупка/продажа внутриигровой валюты в любых ее проявлениях за реальные деньги | PermBan с обнулением аккаунта + ЧС проекта.<br><br>" +
        "[CENTER]Здесь вставьте Ваш текст[/CENTER][/FONT][/SIZE]" +
        "[CENTER]Тут видно как вы получили от продавца Игровой Валюты денежные средства.<br>Все доказательства были переданы Куратору технических специалистов.[/CENTER]" +
		'[CENTER][COLOR=rgb(255, 255, 0)]<br>Тема находиться на рассмотрении и ожидает вердикта Куратора технических специалистов.[/COLOR].[/CENTER]',
	},
	{
        title: 'ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ⠀ᅠ ᅠ         ᅠᅠ             Для жалоб на игроков / техᅠ         ᅠ ⠀ᅠᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ',
        dpstyle: 'oswald: 3px;     color: #fff; background: #db2309; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
	},
	{
		title: 'Нрп обман(слоты)',
		content:
		'[SIZE=4][FONT=Veranda][CENTER]Доброго времени суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		'[CENTER]После проверки доказательств и системы логирования.<br>Игрок будет наказан по пункту правил -[QUOTE][SIZE=4]2.05. Запрещены любые OOC обманы и их попытки, а также любые IC обманы с нарушением Role Play правил и логики | PermBan[/SIZE][/QUOTE][CENTER][COLOR=rgb(0, 128, 0)]Одобрено, закрыто.[/COLOR][/CENTER][/FONT][/SIZE]',
		prefix: WATCHED_PREFIX,
		status: false,
	},
	{
		title: 'Долг 2.57',
		content:
		'[SIZE=4][FONT=Veranda][CENTER]Доброго времени суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		'[CENTER]После проверки доказательств и системы логирования.<br>Игрок будет наказан по пункту правил -[QUOTE][SIZE=4]2.57. Запрещается брать в долг игровые ценности и не возвращать их. | Ban 30 дней / permban<br>В следующий раз рассматриваться не будет так как все долги даются через банковскую систему.[/SIZE][/QUOTE][CENTER][COLOR=rgb(0, 128, 0)]Одобрено, закрыто.[/COLOR][/CENTER][/FONT][/SIZE]',
		prefix: WATCHED_PREFIX,
		status: false,
	},
	{
title: 'Взлом',
content:
'[SIZE=4][FONT=Georgia][CENTER]Доброго времени суток, уважаемый {{ user.mention }}.[/CENTER]<br><br>' +
"[CENTER]Аккаунт злоумышленника будет заблокирован.[/CENTER]<br>" +
"[CENTER]В данном случае имущество восстановлению не принадлежит, ознакомьтесь с правилами восстановления имущества → *[URL='https://forum.blackrussia.online/threads/Правила-восстановления-игровых-ценностей.4462676/']Кликабельно[/URL]*[/CENTER]<br><br>" +
'[CENTER][COLOR=rgb(0, 128, 0)]Рассмотрено, закрыто.[/COLOR][/CENTER][/FONT][/SIZE]' ,
prefix: WATCHED_PREFIX,
status: false,
},
	{
		title: 'Ответ был дан',
		content:
		'[SIZE=4][FONT=Veranda][CENTER]Доброго времени суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		'[CENTER]Ответ от Куратора технических специалистов был дан в предыдущей теме.<br>Если вы не согласны с его вердиктом, напишите жалобу на имя Куратора технических специалистов, создав новую тему.[CENTER][COLOR=rgb(255, 0, 0)]Отказано, закрыто.[/COLOR][/CENTER][/FONT][/SIZE]',
		prefix: UNACCEPT_PREFIX,
		status: false,
	},
        {
		title: 'Забыл Пин-код',
		content:
		'[SIZE=4][FONT=Veranda][CENTER]Доброго времени суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
            '[CENTER]Команда технических специалистов не восстанавливает пин-коды банковских счетов.<br>В следующий раз, записывайте или сохраняйте пин-код в надежном для вас месте.[CENTER][COLOR=rgb(0, 128, 0)]Рассмотрено, закрыто.[/COLOR][/CENTER][/FONT][/SIZE]',
		prefix: WATCHED_PREFIX,
		status: false,
	},
          {
		title: 'Тема уже находится на рассмотрении',
		content:
		'[SIZE=4][FONT=Veranda][CENTER]Доброго времени суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
            '[CENTER]В данный момент ваша предыдущая тема находиться на рассмотрении.<br>Не нужно создавать идентичные или похожие темы - иначе Ваш форумный аккаунт может быть заблокирован.[CENTER][COLOR=rgb(0, 128, 0)]Рассмотрено, закрыто.[/COLOR][/CENTER][/FONT][/SIZE]',
		prefix: WATCHED_PREFIX,
		status: false,
	},
          {
		title: 'Отпечаток пальца',
		content:
		'[SIZE=4][FONT=Veranda][CENTER]Доброго времени суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
            '[CENTER]В данный момент отпечаток пальца не работает.<br>Убедительная просьба использовать другие доступные привязки, дабы избежать потерю игрового аккаунта. [CENTER][COLOR=rgb(0, 128, 0)]Рассмотрено, закрыто.[/COLOR][/CENTER][/FONT][/SIZE]',
		prefix: WATCHED_PREFIX,
		status: false,
	},
         {
		title: 'Забло не будет',
		content:
		'[SIZE=4][FONT=Veranda][CENTER]Доброго времени суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
            '[CENTER][CENTER]Проверив систему логирования, доказательств недостаточно для блокировки игрока.[COLOR=rgb(255, 0, 0)]<br>Отказано, закрыто.[/COLOR][/CENTER][/FONT][/SIZE]',
		prefix: UNACCEPT_PREFIX,
		status: false,
	},
        {
		title: 'Хочу стать адм',
		content:
		'[SIZE=4][FONT=Veranda][CENTER]Доброго времени суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
           '[CENTER][CENTER]На пост администратора можно встать двумя способами.<br>' +
           '[CENTER]<br>1. Подать заявление на пост Агента поддержки.<br>2. Подать заявление на пост Лидера фракции любого направления.[COLOR=rgb(0, 128, 0)]<br>Рассмотрено, закрыто.[/COLOR][/CENTER][/FONT][/SIZE]',
		prefix: WATCHED_PREFIX,
		status: false,
	},
{
    title: 'Донат',
    content:
    '[SIZE=4][FONT=Courier new][CENTER]Приветствую, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
    '[CENTER]Мы рассмотрели ваш запрос о возврате денежных средств и сообщаем следующее.<br><br>' +
    '[SIZE=4][FONT=Courier new][CENTER]Запуская игру, пользователь <u>соглашается с правилами её использования</u>, которые изложены в <u>Пользовательском соглашении</u>, что по смыслу ст. 435 и 438 Гражданского кодекса РФ является принятием (акцептом) оферты Компании https://blackrussia.online/oferta.php, а равно заключением договора.<br><br>Согласно Пользовательскому соглашению <u>«Внутриигровая валюта» – виртуальная внутриигровая валюта</u>, являющаяся неактивированными данными и командами, которая не имеет денежной стоимости и не подлежит денежной оценке, хотя и имеет цену на момент приобретения.<br>' +
    '[SIZE=4][FONT=Courier new][CENTER]Согласно п. Политика возврата платежей, Пользовательского соглашения денежные средства за внутриигровые товары не подлежат возврату с момента появления Внутриигровой валюты на счете аккаунта.<br>' +
    '[SIZE=4][FONT=Courier new][CENTER]Согласно п. Политика возврата платежей, Пользовательского соглашения пользователь самостоятельно следит за безопасностью своего аккаунта, сам несет ответственность за все действия, которые выполняются в сервисах с помощью его аккаунта, а также в нем самом.<br>' +
    '[SIZE=4][FONT=Courier new][CENTER]Согласно п. Политика возврата платежей, Пользовательского соглашения пользователь гарантирует, что он имеет право использовать выбранные им платежные средства, не нарушая при этом законодательства РФ и/или законодательства иной страны, гражданином которой является пользователь, и прав третьих лиц.<br>' +
    '[SIZE=4][FONT=Courier new][CENTER]Компания /u>не несет ответственности за возможный ущерб третьим лицам</u>, причиненный в результате использования пользователем не принадлежащих ему средств оплаты.<br><br> ' +
    '[SIZE=4][FONT=Courier new][CENTER]</u>Совершая покупки внутри игры</u>, а также предоставляя платежную информацию, Вы гарантируете, что являетесь законным владельцем платёжного средства и аккаунта, связанного с данным платежом.<br><br>' +
    '[SIZE=4][FONT=Courier new][CENTER]Все действия с картой считаются совершенными с Вашего ведома и согласия, то есть лично владельцем карты.<br><br>' +
    '[SIZE=4][FONT=Courier new][CENTER]Кроме того, в соответствии законодательством РФ родители несут имущественную ответственность по сделкам малолетнего, в том числе по сделкам, совершенным им самостоятельно.<br>' +
    '[SIZE=4][FONT=Courier new][CENTER]Таким образом, если Вы являетесь законными представителем, Вы отвечаете за действия ребёнка внутри игры. Компания не может отслеживать действия несовершеннолетнего и нести за них ответственность.<br><br>' +
    '[SIZE=4][FONT=Courier new][CENTER]Таким образом основания для возврата денежных средств отсутствуют.<br>' +
    '[CENTER][I]Решено[/I].[/CENTER][/FONT][/SIZE]',
   prefix: DECIDED_PREFIX,
   status: false,
  }
	];-

	$(document).ready(() => {
	// Загрузка скрипта для обработки шаблонов
	$('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');

	// Поиск информации о теме
	const threadData = getThreadData();

	$(`button#ff`).click(() => pasteContent(8, threadData, true));
	$(`button#prr`).click(() => pasteContent(2, threadData, true));
	$(`button#zhb`).click(() => pasteContent(21, threadData, true));
	$('button#unaccept').click(() => editThreadData(UNACCEPT_PREFIX, false));
	$('button#pin').click(() => editThreadData(PIN_PREFIX, true));
	$('button#teamProject').click(() => editThreadData(COMMAND_PREFIX, true));
	$('button#watched').click(() => editThreadData(WATCHED_PREFIX, false));
	$('button#decided').click(() => editThreadData(DECIDED_PREFIX, false));
	$('button#closed').click(() => editThreadData(CLOSE_PREFIX, false));
	$('button#closed_complaint').click(() => editThreadData(CLOSE_PREFIX, false, false));
	$('button#techspec').click(() => editThreadData(TECHADM_PREFIX, true));

	$(`button#selectAnswer`).click(() => {
	XF.alert(buttonsMarkup(buttons), null, 'ВЫБЕРИТЕ ОТВЕТ');
	buttons.forEach((btn, id) => {
	if (id > 1) {
	$(`button#answers-${id}`).click(() => pasteContent(id, threadData, true));
	}
	else {
	$(`button#answers-${id}`).click(() => pasteContent(id, threadData, false));
	}
	});
	});
	});

    function addButton(name, id, style) {
         $('.button--icon--reply').before(
	`<button type="button" class="button--primary button rippleButton" id="${id}" style="${style}">${name}</button>`,
	);
	}
	function addAnswers() {
		$('.button--icon--reply').after(`<button type="button" class="button--cta uix_quickReply--button button button--icon button--icon--write rippleButton" id="selectAnswer" style="oswald: 3px; margin-left: 5px; margin-top: 10px; border-radius: 13px;">ОТВЕТЫ</button>`,
	);
	}

	function buttonsMarkup(buttons) {
	return `<div class="select_answer">${buttons
	.map(
	(btn, i) =>
	`<button id="answers-${i}" class="button--primary button ` +
	`rippleButton" style="margin:4px; ${btn.dpstyle}"><span class="button-text">${btn.title}</span></button>`,
	)
	.join('')}</div>`;
	}

	function pasteContent(id, data = {}, send = false) {
	const template = Handlebars.compile(buttons[id].content);
	if ($('.fr-element.fr-view p').text() === '') $('.fr-element.fr-view p').empty();

	$('span.fr-placeholder').empty();
	$('div.fr-element.fr-view p').append(template(data));
	$('a.overlay-titleCloser').trigger('click');

	if (send == true) {
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

	function editThreadData(prefix, pin = false, may_lens = true) {
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
		if(may_lens === true) {
			if(prefix == UNACCEPT_PREFIX || prefix == WATCHED_PREFIX || prefix == CLOSE_PREFIX || prefix == DECIDED_PREFIX) {
				moveThread(prefix, 230); }

			if(prefix == WAIT_PREFIX) {
				moveThread(prefix, 917);
			}
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