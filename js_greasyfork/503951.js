// ==UserScript==
// @name         36 40
// @namespace    https://forum.blackrussia.online
// @version      1.0
// @description  Для определенного круга лиц
// @author       Denny Archer
// @match        https://forum.blackrussia.online/*
// @include      https://forum.blackrussia.online/
// @grant        none
// @license      MIT
// @collaborator Denny Archer
// @icon https://i.dailymail.co.uk/1s/2021/12/07/18/26397236-10285081-ANSWER_BLOOD_DIAMOND_This_2006_political_war_thriller_raked_in_a-a-68_1638900061648.jpg
// @downloadURL https://update.greasyfork.org/scripts/503951/36%2040.user.js
// @updateURL https://update.greasyfork.org/scripts/503951/36%2040.meta.js
// ==/UserScript==

(function () {
	'use strict';
	const UNACCEPT_PREFIX = 4; // префикс отказано
    const PIN_PREFIX = 2; //  префикс закрепить
    const COMMAND_PREFIXX = 10; // команде проекта
	const COMMAND_PREFIX = 10; // команде проекта
	const CLOSE_PREFIX = 7; // префикс закрыто
	const DECIDED_PREFIX = 6; // префикс решено
	const TECHADM_PREFIX = 13 // тех администратору
	const WATCHED_PREFIX = 9; // рассмотрено
	const WAIT_PREFIX = 14; // ожидание (для переноса в баг-трекер)
	const NO_PREFIX = 0;
	const buttons = [
                {
        title: 'покупка ив через банк',
        dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
		content:
		"[CENTER][IMG width=695px]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/IMG]<br>"+
       '[COLOR=rgb(0, 255, 127)][FONT=georgia][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/COLOR]<br><br>' +
		'[CENTER]*строчка из логов*<br><br>На ваш банковский счет были зачислены средства от пользователя, известного как продавец игровой валюты.<br>Вы, не задумываясь, сняли эти средства, будучи в курсе о происхождении перевода. <br>Отсутствие каких-либо договоренностей или взаимодействий в игре до или после этого момента не оставляет сомнений в том, что средства были получены в результате предполагаемой покупки игровой валюты. <br>Именно это стало причиной блокировки вашего аккаунта.<br>[SPOILER="Пункт 2.28"]2.28. Запрещена покупка/продажа внутриигровой валюты в любых ее проявлениях за реальные деньги | PermBan с обнулением аккаунта + ЧС проекта<br>Примечание: любые попытки покупки/продажи, попытки поинтересоваться о ней у другого игрока и прочее - наказуемы.<br>Примечание: также запрещен обмен доната на игровые ценности и наоборот;<br>Пример: пополнение донат счет любого игрока взамен на игровые ценности;<br>Исключение: официальная покупка через сайт.[/SPOILER][/CENTER]<br>[SIZE=4][I][ICODE]Остались ли у вас вопросы касаемо данной блокировки? Ожидаю ваш ответ.[/ICODE]<br><br>[IMG width=695px]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/IMG]',
    },
 {
        title: 'трансфер(4.05)',
        dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
		content:
		"[CENTER][IMG width=695px]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/IMG]<br>"+
       '[COLOR=rgb(0, 255, 127)][FONT=georgia][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/COLOR]<br><br>' +
            '[CENTER]*строчка из логов*<br><br>На ваш банковский счёт были зачислены денежные средства с аккаунта, который является вашим твинк-аккаунтом, что можно доказать с помощью системы логирования. <br>Переводы средств с одного аккаунта на другой запрещены и рассматриваются как нарушение правил проекта.<br>Нарушение пункта правил 4.05, которое устанавливает запрет на передачу денежных средств или ресурсов между основным и твинк-аккаунтом привело к блокировке аккаунта.<br>Пункт 4.05<br>[SPOILER]4.05. Запрещено передавать любые игровые ценности между игровыми аккаунтами, а также в целях удержания имущества | Ban 15 - 30 дней / PermBan<br>Пример: перекинуть бизнес, АЗС, дом или любые другие игровые материальные ценности с одного аккаунта игрока на другой / используя свой твинк / договорившись заранее с игроком и иные способы удержания.[/SPOILER]<br><B>[SIZE=4][I]Остались ли у вас вопросы касаемо данной блокировки? Ожидаю ваш ответ.<br><br>[IMG width=695px]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/IMG]',
            },
 {
        title: 'Обменялись ZAZ на ZAZ',
        dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
		content:
		"[CENTER][IMG width=695px]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/IMG]<br>"+
       '[COLOR=rgb(0, 255, 127)][FONT=georgia][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/COLOR]<br><br>' +
        '[CENTER]*строчка из логов*<br><br>Вы совершили обмен машинами ZAZ на ZAZ с доплатой игровой валюты? что является нарушением правил игры, а именно пункта 2.21, который запрещает обход системы.<br>Важно помнить, что незнание правил не освобождает от ответственности. Игрокам следует соблюдать установленные правила.<br>'+
        '[CENTER]Подобные нарушения могут повлечь за собой негативные последствия, включая блокировку аккаунтов. Поэтому рекомендуется всегда действовать сознательно и соблюдать правила, чтобы поддерживать честную игровую атмосферу.<br><br>Пункт 2.21<br>[SPOILER]2.21. Запрещено пытаться обходить игровую систему или использовать любые баги сервера | Ban 15 - 30 дней /PermBan (по согласованию с ГА, ЗГА, руководством тех. специалистов)<br>Примечание: под игровой системой подразумеваются функции и возможности, которые реализованы в игре для взаимодействия между игроками, а также взаимодействия игроков с функциями, у которых есть свое конкретное предназначение.<br>Пример: аптечка предназначена для пополнения уровня здоровья, доступна всем игрокам по фиксированной цене в любом магазине. Но она не предназначена для перепродажи по завышенной цене с целью передачи виртуальной валюты между игроками;<br>Аксессуары предназначены для украшения внешнего вида персонажа, не предназначены для передачи виртуальной валюты между игроками;<br>Банк и личные счета предназначены для передачи денежных средств между игроками;<br>Транспортное средство предназначено для передвижения игроков, не предназначено для передачи денег тем или иным способом, включая обмен с завышенными доплатами.[/SPOILER]<br><br><B>[SIZE=4][I]Остались ли у вас вопросы касаемо данной блокировки? Ожидаю ваш ответ.<br><br>[IMG width=695px]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/IMG]',
},

{
    title: 'Покупка ИВ у игрока через трейд',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
    content:
    "[CENTER][IMG width=695px]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/IMG]<br>"+
   '[COLOR=rgb(0, 255, 127)][FONT=georgia][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/COLOR]<br><br>' +
   '[CENTER]*строчка из логов*<br><br>На ваш счёт в системе трейда поступила игровая валюта от игрока, известного, как продавец игровой валюты. До этого момента вы не взаимодействовали; договорились встретиться вне игры, что нельзя подтвердить. <br>Встретились, получили деньги, что является нарушением правил. Никаких обсуждений в игре не было, поэтому можно предположить, что произошла покупка игровой валюты<br>Пункт 2.28<br>[SPOILER]<br>2.28. Запрещена покупка/продажа внутриигровой валюты в любых ее проявлениях за реальные деньги | PermBan с обнулением аккаунта + ЧС проекта<br>Примечание: любые попытки покупки/продажи, попытки поинтересоваться о ней у другого игрока и прочее - наказуемы.<br>Примечание: также запрещен обмен доната на игровые ценности и наоборот;<br>Пример: пополнение донат счет любого игрока взамен на игровые ценности;<br>Исключение: официальная покупка через сайт.<br>[/SPOILER]<br><br><B>[SIZE=4][I]Остались ли у вас вопросы касаемо данной блокировки? Ожидаю ваш ответ.<br><br>[IMG width=695px]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/IMG]',
},
{
    title: 'Покупка ИВ у Бота',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
    content:
    "[CENTER][IMG width=695px]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/IMG]<br>"+
   '[COLOR=rgb(0, 255, 127)][FONT=georgia][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/COLOR]<br><br>' +
   '[CENTER]*строчка из логов*<br><br>На ваш банковский счет поступили денежные средства от Ботовода. <br>Бот – это программа, задачей которой является выполнение определенных функций с целью заработать игровую валюту для последующей продажи.<br> В результате, на ваш счет были зачислены игровые средства.<br>Прошло некоторое время, и вы без колебаний решили снять эти средства с банковского счета. Это было ожидаемо, так как вы знали о предстоящем переводе.<br>Следует отметить, что в наше время использование ботов для заработка игровой валюты становится все более распространенным явлением. Однако важно помнить, что подобные операции могут повлечь за собой нарушение пункта правил 2.28.<br>Пункт 2.28<br>[SPOILER]<br>2.28. Запрещена покупка/продажа внутриигровой валюты в любых ее проявлениях за реальные деньги | PermBan с обнулением аккаунта + ЧС проекта<br>Примечание: любые попытки покупки/продажи, попытки поинтересоваться о ней у другого игрока и прочее - наказуемы.<br>Примечание: также запрещен обмен доната на игровые ценности и наоборот;<br>Пример: пополнение донат счет любого игрока взамен на игровые ценности;<br>Исключение: официальная покупка через сайт.<br>[/SPOILER]<br><br><B>[SIZE=4][I]Остались ли у вас вопросы касаемо данной блокировки? Ожидаю ваш ответ.<br><br>[IMG width=695px]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/IMG]',
    },
 {

        title: 'У игрока Чужая привязка',
        dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
        content:
        "[CENTER][IMG width=695px]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/IMG]<br>"+
       '[COLOR=rgb(0, 255, 127)][FONT=georgia][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/COLOR]<br><br>' +
        '[CENTER]К сожалению, обнаружена чужая привязка к вашему аккаунту, что может представлять угрозу для безопасности данных. В данной ситуации нам, к сожалению, не удастся разблокировать ваш аккаунт. Для обеспечения безопасности рекомендуется создать новый аккаунт и принять все возможные меры по защите данных. Наша команда технических специалистов настоятельно рекомендует вам установить дополнительные меры безопасности, такие как двухфакторную аутентификацию, сложные пароли и регулярное обновление паролей. [/CENTER] <br>' +
        '[CENTER]Пожалуйста, будьте внимательны при создании нового аккаунта и храните данные доступа в надежном месте. Мы приносим извинения за возможные неудобства, связанные с этой ситуацией, и стараемся обеспечить безопасность всех наших пользователей [/CENTER]<br><br>' +
        '[CENTER][COLOR=rgb(255, 255, 0)][SIZE=4][I][ICODE]Передано руководству.[/ICODE][/COLOR][/FONT][/CENTER]'+
        "[CENTER][IMG width=695px]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/IMG]<br>",
     },
        {
            title: 'Ожидаю ответ в лс форума',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
            "[CENTER][IMG width=695px]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/IMG]<br>"+
            '[COLOR=rgb(0, 255, 127)][FONT=georgia][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/COLOR]<br><br>' +
            '[CENTER]Ожидаю ответ от вас в личных сообщениях форума.[/CENTER]<br><br>'+
            "[CENTER][IMG width=695px]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/IMG]<br>",
    },
        {
        title: 'Бан по IP',
        dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
        content:
        "[CENTER][IMG width=695px]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/IMG]<br>"+
        '[COLOR=rgb(0, 255, 127)][FONT=georgia][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/COLOR]<br><br>' +
        '[CENTER]Вы попали на заблокированный айпи адрес. Ваш аккаунт не находится в блокировке. Переживать не стоит. Причиной попадания в данную ситуацию могло быть разное, например, смена мобильного интернета, переезд и тому подобное. Чтобы избежать данную ситуацию, вам необходимо перезагрузить телефон или воспользоваться услугами VPN. Приносим свои извинения за доставленные неудобства. [/CENTER]<br>'+
        '[CENTER]Желаем приятного времяпровождения на нашем проекте.[/CENTER]<br>'+
        '[CENTER][COLOR=rgb(52,201,36)][SIZE=4][I][ICODE]Рассмотрено.[/ICODE][/COLOR][/FONT][/CENTER][/I][/SIZE]<br>'+
        "[CENTER][IMG width=695px]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/IMG]<br>",
        prefix: WATCHED_PREFIX,
        status: false,
    },

   ];
	$(document).ready(() => {
	// Загрузка скрипта для обработки шаблонов
	$('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');

	// Добавление кнопок при загрузке страницы
	addAnswers();

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
    $('button#teamProject').click(() => editThreadData(COMMAND_PREFIXX, true));

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
		$('.button--icon--reply').after(`<button type="button" class="button--cta uix_quickReply--button button button--icon button--icon--write rippleButton" id="selectAnswer" style="georgia: 3px; margin-left: 3px; margin-top: 10px; border-radius: 30px;">Доп. меню ответов</button>`,
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
