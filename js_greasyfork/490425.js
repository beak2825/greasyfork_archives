// ==UserScript==
// @name         Скрипт // Руководства Azure.
// @namespace    https://forum.blackrussia.online/
// @version      1.1.1
// @description  По всем вопросам: https://vk.com/tomasflorence
// @author       Tomas_Florence | Elmin_Emran
// @match        https://forum.blackrussia.online/threads/*
// @include      https://forum.blackrussia.online/threads/
// @grant        none
// @license      MIT
// @icon https://imgur.com/a/8PIznAO
// @downloadURL https://update.greasyfork.org/scripts/490425/%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%20%D0%A0%D1%83%D0%BA%D0%BE%D0%B2%D0%BE%D0%B4%D1%81%D1%82%D0%B2%D0%B0%20Azure.user.js
// @updateURL https://update.greasyfork.org/scripts/490425/%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%20%D0%A0%D1%83%D0%BA%D0%BE%D0%B2%D0%BE%D0%B4%D1%81%D1%82%D0%B2%D0%B0%20Azure.meta.js
// ==/UserScript==
          
(function () {
	'use strict';
	const OTKAZANO_PREFIX = 4; // префикс отказано
	const ODOBRENO_PREFIX = 8; // префикс одобрено
	const ZAKREP_PREFIX = 2; //  префикс закрепить
        const WATCHED_PREFIX = 9; // префикс рассмотрено
        const TEX_PREFIX = 13; //  техническому специалисту
        const GA_PREFIX = 12; //  главному администратору
        const SPECY_PREFIX = 11;  // специальному администратору
        const WAIT_PREFIX = 14; // префикс ожидание
        const ZAKRITO_PREFIX = 7; // префикс закрыто
	const NO_PREFIX = 0;
	const buttons = [
          {
          title: '⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀ ⠀⠀⠀Скрипт для раздела обжалований | Azure⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀ ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀',
          dpstyle: 'oswald: 3px;     color: #fff; background: #db2309; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
          },
          {
          title: '⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀Основное⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀',
          dpstyle: 'oswald: 3px;     color: #fff; background: #db2309; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
          },
          {
             title: 'На рассмотрении',
             dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
             content:
             '[CENTER][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=times new roman][B]{{ greeting }}, уважаемый {{ user.mention }}.[/B][/FONT][/SIZE][/COLOR]<br><br>' +
             "[COLOR=rgb(209, 216, 213)][SIZE=4][FONT=times new roman][B]Ваше обжалование взято на рассмотрение.[/COLOR]<br><br>" +
             '[COLOR=rgb(209, 216, 213)]Ожидайте ответа в данной теме, не создавайте подобные, иначе ваш форум. аккаунт может быть [COLOR=rgb(255, 0, 0)]заблокирован[/COLOR][COLOR=rgb(209, 216, 213)].[/B][/FONT][/SIZE][/COLOR][/COLOR]',
             prefix: ZAKREP_PREFIX,
             status: true,
           },
           {
             title: 'На рассмотрении (смена ника)',
             dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
             content:
             '[CENTER][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=times new roman][B]{{ greeting }}, уважаемый {{ user.mention }}.[/B][/FONT][/SIZE][/COLOR]<br><br>' +
             "[COLOR=rgb(209, 216, 213)][SIZE=4][FONT=times new roman][B]Ваше обжалование взято на рассмотрение.<br>Вам даётся 24 часа на смену Nick_Name.[/COLOR]<br><br>" +
             '[COLOR=rgb(209, 216, 213)]Ожидайте ответа в данной теме, не создавайте подобные, иначе ваш форум. аккаунт может быть [COLOR=rgb(255, 0, 0)]заблокирован[/COLOR][COLOR=rgb(209, 216, 213)].[/B][/FONT][/SIZE][/COLOR][/COLOR]',
             prefix: ZAKREP_PREFIX,
             status: true,
           },
           {
             title: 'Обжалование отказано',
             dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
             content:
             '[CENTER][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=times new roman][B]{{ greeting }}, уважаемый {{ user.mention }}.[/B][/FONT][/SIZE][/COLOR]<br><br>' +
             "[COLOR=rgb(209, 216, 213)][SIZE=4][FONT=times new roman][B]В обжаловании [COLOR=rgb(255, 0, 0)]отказано[/COLOR][COLOR=rgb(209, 216, 213)], ваше наказание не может быть снижено.[/COLOR]<br><br>" +
             '[COLOR=rgb(209, 216, 213)]Не нужно создавать подобные темы, иначе ваш форум. аккаунт будет [COLOR=rgb(255, 0, 0)]заблокирован[/COLOR][COLOR=rgb(209, 216, 213)].[/B][/FONT][/SIZE][/COLOR][/COLOR]',
             prefix: OTKAZANO_PREFIX,
             status: false,
           },
           {
             title: 'Обжалование одобрено',
             dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
             content:
             '[CENTER][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=times new roman][B]{{ greeting }}, уважаемый {{ user.mention }}.[/B][/FONT][/SIZE][/COLOR]<br><br>' +
             "[COLOR=rgb(209, 216, 213)][SIZE=4][FONT=times new roman][B]Ваше обжалование было [COLOR=rgb(0, 255, 0)]рассмотрено[/COLOR], руководство сервера готово снять или понизить вам наказание.[/COLOR]<br><br>" +
             '[COLOR=rgb(209, 216, 213)]Впредь, не нарушайте правила проекта, приятной игры на сервере [COLOR=rgb(0, 128, 255)]Azure[/COLOR][COLOR=rgb(209, 216, 213)].[/COLOR][/B][/FONT][/SIZE][/COLOR]',
             prefix: WATCHED_PREFIX,
             status: false,
           },
           {
          title: '⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀Причины для отказов⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀',
          dpstyle: 'oswald: 3px;     color: #fff; background: #db2309; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
          },
          {
             title: 'Не по форме',
             dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
             content:
             '[CENTER][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=times new roman][B]{{ greeting }}, уважаемый {{ user.mention }}.[/B][/FONT][/SIZE][/COLOR][FONT=times new roman][/FONT]<br><br>' +
             "[COLOR=rgb(209, 216, 213)][FONT=times new roman][SIZE=4][B]Ваше обжалование составлено не по форме.[/B][/SIZE][/FONT][/COLOR][FONT=times new roman][/FONT]<br><br>" +
             '[COLOR=rgb(209, 216, 213)][FONT=times new roman][SIZE=4][B]Форма подачи:[/B][/SIZE][/FONT][/COLOR][/CENTER]<br><br>' +
             "[QUOTE]" +
             '[CENTER][B][COLOR=rgb(209, 216, 213)][SIZE=4][FONT=times new roman]1. Ваш Nick_Name:[/FONT][/SIZE][/COLOR][/B]<br>' +
             "[COLOR=rgb(209, 216, 213)][SIZE=4][FONT=times new roman][B]2. Nick_Name администратора:<br>" +
             '3. Дата выдачи/получения наказания:[/B][/FONT][/SIZE][/COLOR]<br>' +
             "[B][COLOR=rgb(209, 216, 213)][SIZE=4][FONT=times new roman]4. Суть заявки:[/FONT][/SIZE][/COLOR][/B]<br>" +
             '[B][COLOR=rgb(209, 216, 213)][SIZE=4][FONT=times new roman][B]5. Доказательство:[/COLOR][/B][/CENTER]' +
             "[/QUOTE]" +
             "[CENTER]<br>" +
             '[CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4] Закрыто. [/FONT][/SIZE][/COLOR][/CENTER]',
             prefix: ZAKRITO_PREFIX,
             status: false,
           },
           {
             title: 'Не по теме',
             dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
             content:
             '[CENTER][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=times new roman][B]{{ greeting }}, уважаемый {{ user.mention }}.[/B][/FONT][/SIZE][/COLOR]<br><br>' +
             "[COLOR=rgb(209, 216, 213)][SIZE=4][FONT=times new roman][B]Ваша тема никак не связана с данным разделом.<br>" +
             'Не нужно создавать подобные темы, иначе ваш форум. аккаунт будет [COLOR=rgb(255, 0, 0)]заблокирован[/COLOR][COLOR=rgb(209, 216, 213)].[/B][/FONT][/SIZE][/COLOR][/COLOR]<br><br>' +
             "[CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4] Закрыто. [/FONT][/SIZE][/COLOR][/CENTER]",
             prefix: ZAKRITO_PREFIX,
             status: false,
           },
           {
             title: 'Ответ дан ранее',
             dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
             content:
             '[CENTER][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=times new roman][B]{{ greeting }}, уважаемый {{ user.mention }}.[/B][/FONT][/SIZE][/COLOR]<br><br>' +
             "[COLOR=rgb(209, 216, 213)][SIZE=4][FONT=times new roman][B]Вам уже был дан корректный ответ в прошлой теме.<br>" +
             'Не нужно создавать подобные темы, иначе ваш форум. аккаунт будет [COLOR=rgb(255, 0, 0)]заблокирован[/COLOR][COLOR=rgb(209, 216, 213)].[/B][/FONT][/SIZE][/COLOR][/COLOR]<br><br>' +
             "[CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4] Закрыто. [/FONT][/SIZE][/COLOR][/CENTER]",
             prefix: ZAKRITO_PREFIX,
             status: false,
           },
           {
          title: '⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀Передача⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀',
          dpstyle: 'oswald: 3px;     color: #fff; background: #db2309; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
          },
          {
             title: 'Передать теху',
             dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
             content:
             '[CENTER][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=times new roman][B]{{ greeting }}, уважаемый {{ user.mention }}.[/B][/FONT][/SIZE][/COLOR]<br><br>' +
             "[COLOR=rgb(209, 216, 213)][SIZE=4][FONT=times new roman][B]Ваше обжалование переадресовано \"Техническому Специалисту\".<br><br>" +
             'Ожидайте ответа в данной теме, не создавайте подобные, иначе ваш форум. аккаунт может быть [COLOR=rgb(255, 0, 0)]заблокирован[/COLOR][COLOR=rgb(209, 216, 213)].[/B][/FONT][/SIZE][/COLOR][/COLOR]',
             prefix: TEX_PREFIX,
             status: true,
           },
           {
             title: 'Передать ГА',
             dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
             content:
             '[CENTER][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=times new roman][B]{{ greeting }}, уважаемый {{ user.mention }}.[/B][/FONT][/SIZE][/COLOR]<br><br>' +
             "[COLOR=rgb(209, 216, 213)][SIZE=4][FONT=times new roman][B]Ваше обжалование переадресовано \"Главному Администратору\".<br><br>" +
             'Ожидайте ответа в данной теме, не создавайте подобные, иначе ваш форум. аккаунт может быть [COLOR=rgb(255, 0, 0)]заблокирован[/COLOR][COLOR=rgb(209, 216, 213)].[/B][/FONT][/SIZE][/COLOR][/COLOR]',
             prefix: GA_PREFIX,
             status: true,
           },
           {
             title: 'Передать Спецу',
             dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
             content:
             '[CENTER][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=times new roman][B]{{ greeting }}, уважаемый {{ user.mention }}.[/B][/FONT][/SIZE][/COLOR]<br><br>' +
             "[COLOR=rgb(209, 216, 213)][SIZE=4][FONT=times new roman][B]Ваше обжалование переадресовано \"Специальному Администратору\".<br><br>" +
             'Ожидайте ответа в данной теме, не создавайте подобные, иначе ваш форум. аккаунт может быть [COLOR=rgb(255, 0, 0)]заблокирован[/COLOR][COLOR=rgb(209, 216, 213)].[/B][/FONT][/SIZE][/COLOR][/COLOR]',
             prefix: SPECY_PREFIX,
             status: true,
           },
           {
          title: '⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀Перенаправление в другие разделы⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀',
          dpstyle: 'oswald: 3px;     color: #fff; background: #db2309; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
          },
          {
             title: 'В жалобы на администрацию',
             dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
             content:
             '[CENTER][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=times new roman][B]{{ greeting }}, уважаемый {{ user.mention }}.[/B][/FONT][/SIZE][/COLOR]<br><br>' +
             "[COLOR=rgb(209, 216, 213)][SIZE=4][FONT=times new roman][B]Ваше обжалование никак не относится к данному разделу, мы перенесли вашу тему в нужный вам раздел.[/COLOR]<br><br<Ожидайте ответа в данной теме, не создавайте подобные, иначе ваш форум. аккаунт может быть [COLOR=rgb(255, 0, 0)]заблокирован[/COLOR][COLOR=rgb(209, 216, 213)].[/B][/FONT][/SIZE][/COLOR]",
             prefix: WAIT_PREFIX,
             status: false,
           },
	];
 
	$(document).ready(() => {
	// Загрузка скрипта для обработки шаблонов
	$('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');
 
	// Добавление кнопок при загрузке страницы
        addButton('ГА', 'GA', 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5);');
        addButton('СА', 'SPEC', 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 255, 0, 0.5);')
        addButton('На рассмотрение', 'RASSMOTRENIE', 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 140, 0, 0.5);')
	addButton('Т.СПЕЦ', 'TEXSPEC', 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(0, 0, 255, 0.5);');
        addButton('Обж отказано', 'OTKAZANO', 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5);');
        addButton('Обж одобрено', 'ODOBRENO', 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(0, 255, 0, 0.5);');
        addButton('Не по теме', 'OFFTOP', 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(192, 192, 192, 0.5);');
        addButton('Не по форме', 'NEPOFORME', 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(192, 192, 192, 0.5);');
	addObzhs();
	
	// Поиск информации о теме
	const threadData = getThreadData();
 
	$(`button#GA`).click(() => pasteContent(12, threadData, true));
	$(`button#SPEC`).click(() => pasteContent(13, threadData, true));
	$(`button#RASSMOTRENIE`).click(() => pasteContent(2, threadData, true));
        $('button#TEXSPEC').click(() => pasteContent(11, threadData, true));
	$('button#OTKAZANO').click(() => pasteContent(4, threadData, true));
	$('button#OFFTOP').click(() => pasteContent(8, threadData, true));
	$('button#NEPOFORME').click(() => pasteContent(7, threadData, true));
        $(`button#ODOBRENO`).click(() => pasteContent(5, threadData, true));
 
	$(`button#selectObzh`).click(() => {
	XF.alert(buttonsMarkup(buttons), null, 'ВЫБЕРИТЕ ОТВЕТ');
	buttons.forEach((btn, id) => {
	if (id > 1) {
	$(`button#obzhs-${id}`).click(() => pasteContent(id, threadData, true));
	}
	else {
	$(`button#obzhs-${id}`).click(() => pasteContent(id, threadData, false));
	}
	});
	});
	});
 
    function addButton(name, id, style) {
         $('.button--icon--reply').before(
	`<button type="button" class="button--primary button rippleButton" id="${id}" style="${style}">${name}</button>`,
	);
	}
	function addObzhs() {
		$('.button--icon--reply').after(`<button type="button" class="button--cta uix_quickReply--button button button--icon button--icon--write rippleButton" id="selectObzh" style="oswald: 3px; margin-left: 5px; margin-top: 10px; border-radius: 13px;">ОБЖАЛОВАНИЯ</button>`,
	);
	}
 
	function buttonsMarkup(buttons) {
	return `<div class="select_answer">${buttons
	.map(
	(btn, i) =>
	`<button id="obzhs-${i}" class="button--primary button ` +
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
	11 < hours && hours <= 17 ?
	'Добрый день' :
	17 < hours && hours <= 21 ?
	'Добрый вечер' :
	'Доброй ночи',
	};
	
	}
          function editThreadData(prefix, pin = false) 
          {
          // Получаем заголовок темы, так как он необходим при запросе
            const threadTitle = $('.p-title-value')[0].lastChild.textContent;
           
            if(pin == false)
            {
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
            if(pin == true)
            {
              fetch(`${document.URL}edit`, 
              {
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
           if(prefix == WAIT_PREFIX)
          {
             moveThread(prefix, 721);
             editThreadData(WAIT_PREFIX, false);
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