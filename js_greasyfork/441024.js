// ==UserScript==
// @name TESTERS BLACK RUSSIA
// @namespace https://forum.blackrussia.online
// @version 263
// @description Для борьбы с Твинки
// @author maylens.
// @match https://forum.blackrussia.online/index.php?threads/*
// @include https://forum.blackrussia.online/index.php?threads/
// @grant none
// @license MIT
// @collaborator May_Lens
// @icon https://icons.iconarchive.com/icons/thesquid.ink/free-flat-sample/128/support-icon.png
// @downloadURL https://update.greasyfork.org/scripts/441024/TESTERS%20BLACK%20RUSSIA.user.js
// @updateURL https://update.greasyfork.org/scripts/441024/TESTERS%20BLACK%20RUSSIA.meta.js
// ==/UserScript==

(function () {
	'use strict';
	const WATCHED_PREFIX = 9; // рассмотрено
	const UNACCEPT_PREFIX = 4; // префикс отказано
   const PIN_PREFIX = 2; //  префикс на рассмотрении
	const COMMAND_PREFIX = 10; // команде проекта
	const TECHADM_PREFIX = 13; // теху администратору
	const CHECKK_PREFIX = 15; // теху администратору
	const buttons = [
	{
	   title: 'Приветствие',
		content:
	   '[CENTER][COLOR=rgb(97, 189, 109)]Приветствую[/COLOR], {{ user.name }} [/CENTER]',
	},
	{
		  title: 'На рассмотрении',
		  content:
		   "[CENTER]Ваша [COLOR=rgb(255, 255, 0)]тема [/COLOR]взята [COLOR=rgb(255, 255, 0)]на рассмотрение<br>Не [/COLOR]создавайте [COLOR=rgb(255, 255, 0)]подобных [/COLOR]тем<br>[COLOR=rgb(255, 255, 0)]Ожидайте вердикта[/COLOR]<br><br>[COLOR=rgb(251, 160, 38)]На рассмотрении[/COLOR][/CENTER]",
		prefix: PIN_PREFIX,
		status: true,
		},
	{
   title: 'Обнаружено (ТЕХ)',
	content:
		   '[CENTER]После [COLOR=rgb(127, 255, 212)]проверки [/COLOR]вашей темы, [COLOR=rgb(127, 255, 212)]баг [/COLOR]был [COLOR=rgb(127, 255, 212)]обнаружен[/COLOR]<br>Данный [COLOR=rgb(127, 255, 212)]баг[/COLOR], мы [COLOR=rgb(127, 255, 212)]передали разработчикам [/COLOR]проекта<br>Рано или поздно, [COLOR=rgb(127, 255, 212)]баг [/COLOR]будет [COLOR=rgb(127, 255, 212)]исправлен[/COLOR]<br><br>[COLOR=rgb(0, 255, 255)]Проверено Сотрудником Контроля Качества<br>Обнаружено[/COLOR][/CENTER]',
		   prefix: CHECKK_PREFIX,
		   status: false,
	},
	{
   title: 'Известно (ТЕХ)',
	content:
		   '[CENTER]Ваша [COLOR=rgb(124, 252, 0)]тема [/COLOR]была [COLOR=rgb(124, 252, 0)]рассмотрена[/COLOR]<br>После [COLOR=rgb(124, 252, 0)]проверки [/COLOR]вашей [COLOR=rgb(124, 252, 0)]темы[/COLOR], мы поняли, что данная [COLOR=rgb(124, 252, 0)]ошибка/недоработка/баг[/COLOR] уже [COLOR=rgb(124, 252, 0)]известна [/COLOR]нам<br>Данная [COLOR=rgb(124, 252, 0)]ошибка/недоработка/баг[/COLOR] будет [COLOR=rgb(124, 252, 0)]исправлена [/COLOR]в течении [COLOR=rgb(124, 252, 0)]какого-то времени[/COLOR]<br><br>[COLOR=rgb(0, 255, 255)]Проверено Сотрудником Контроля Качества<br>Известно[/COLOR][/CENTER]',
		   prefix: CHECKK_PREFIX,
		   status: false,
	},
	{
   title: 'Передано ГКК',
	content:
		   '[CENTER]Данная [COLOR=rgb(97, 189, 109)]тема [/COLOR]передана [COLOR=rgb(97, 189, 109)]Главе Контроля Качества[/COLOR]<br>Последующие [COLOR=rgb(97, 189, 109)]решения [/COLOR]будут от [COLOR=rgb(97, 189, 109)]него[/COLOR]<br>[COLOR=rgb(247, 218, 100)]Ожидайте вердикта<br><br>На рассмотрении[/COLOR][/CENTER]',
		   prefix: PIN_PREFIX,
		   status: true,
	},
	{
   title: 'Док-ва (ТЕХ)',
	content:
		   '[CENTER][COLOR=rgb(247, 218, 100)]Без [/COLOR]доказательств/[COLOR=rgb(247, 218, 100)]Нехватки [/COLOR]дополнительных доказательств ([COLOR=rgb(247, 218, 100)]в частности скриншоты или видео[/COLOR]) – [COLOR=rgb(247, 218, 100)]решить[/COLOR] проблему [COLOR=rgb(247, 218, 100)]не получится[/COLOR].<br>Если [COLOR=rgb(247, 218, 100)]доказательства [/COLOR]найдутся - [COLOR=rgb(247, 218, 100)]создайте [/COLOR]новую [COLOR=rgb(247, 218, 100)]тему[/COLOR], приложив [COLOR=rgb(247, 218, 100)]доказательства [/COLOR]с фото/видео-хостинга<br><br>[COLOR=rgb(0, 255, 255)]Проверено сотрудником Контроля Качества[/COLOR][/CENTER]',
		   prefix: CHECKK_PREFIX,
		   status: false,
	},
	{
   title: 'Не обнаружено (ТЕХ)',
	content:
		   '[CENTER]После [COLOR=rgb(97, 189, 109)]проверки [/COLOR]вашей [COLOR=rgb(97, 189, 109)]темы[/COLOR], мы [COLOR=rgb(97, 189, 109)]не обнаружили[/COLOR] баг<br>Скорее всего, данная [COLOR=rgb(97, 189, 109)]ошибка [/COLOR]произошла из-за [COLOR=rgb(97, 189, 109)]серверных ошибок[/COLOR] или же, данный баг был [COLOR=rgb(97, 189, 109)]уже исправлен[/COLOR]<br><br>[COLOR=rgb(0, 255, 255)]Проверено Сотрудником Контроля Качества<br>Не обнаружено[/COLOR][/CENTER]',
		   prefix: CHECKK_PREFIX,
		   status: false,
	},
		{
   title: 'ТЕХу',
	content:
		   '[CENTER]Данная [COLOR=rgb(251, 160, 38)]тема [/COLOR]передается обратно [COLOR=rgb(251, 160, 38)]техническому специалисту[/COLOR]<br>Последующие [COLOR=rgb(251, 160, 38)]решения [/COLOR]будут от [COLOR=rgb(251, 160, 38)]него<br><br>Передано техническому специалисту сервера[/COLOR][/CENTER]',
		   prefix: TECHADM_PREFIX,
		   status: true,
		},
	{
		title: 'Не баг (ТЕХ)',
		content:
			'[CENTER]После [COLOR=rgb(221, 160, 221)]прочтения [/COLOR]описания вашей [COLOR=rgb(221, 160, 221)]темы[/COLOR], мы с [COLOR=rgb(221, 160, 221)]уверенностью [/COLOR]готовы вынести [COLOR=rgb(221, 160, 221)]вердикт [/COLOR]- [COLOR=rgb(221, 160, 221)]НЕ БАГ[/COLOR]<br>Данная "[COLOR=rgb(221, 160, 221)]фича[/COLOR]" не является [COLOR=rgb(221, 160, 221)]багом[/COLOR]<br><br>[COLOR=rgb(0, 255, 255)]Проверено Сотрудником Контроля Качества<br>Не является багом[/COLOR]<br>[COLOR=rgb(235, 107, 86)]Закрыто[/COLOR][/CENTER]',
			prefix: CHECKK_PREFIX,
			status: false,
	},
	{
		title: 'Не баг (Т)',
		content:
			'[CENTER]После прочтения темы, мы готовы вынести вердикт - НЕ БАГ<br>Данная "фича" не является багом<br><br>Проверено Сотрудником Контроля Качества<br>Не является багом<br>Закрыто[/CENTER]',
			prefix: WATCHED_PREFIX,
			status: false,
	},
	{
		title: 'Не обнаружено (Т)',
		content:
			'[CENTER]После проверки темы, мы не обнаружили баг<br><br>Проверено Сотрудником Контроля Качества<br>Не обнаружено<br>Закрыто[/CENTER]',
			prefix: WATCHED_PREFIX,
			status: false,
	},
	{
		title: 'Известно (Т)',
		content:
			'[CENTER]Тема была рассмотрена<br>После проверки темы, мы поняли, что данная ошибка/недоработка/баг уже известна нам<br>Данная ошибка/недоработка/баг будет исправлена в течении какого-то времени<br><br>Проверено Сотрудником Контроля Качества<br>Известно<br>Закрыто[/CENTER]',
			prefix: WATCHED_PREFIX,
			status: false,
	},
	{
		title: 'Обнаружено (Т)',
		content:
			'[CENTER]После проверки темы, баг был обнаружен<br>Данный баг, мы передали разработчикам проекта<br>Рано или поздно, баг будет исправлен<br><br>Проверено Сотрудником Контроля Качества<br>Обнаружено<br>Закрыто[/CENTER]',
			prefix: WATCHED_PREFIX,
			status: false,
	},
	{
		title: 'Не проверить (ТЕХ)',
		content:
			'[CENTER]Данную проблему невозможно воспроизвести специально<br>Данные ошибки возникают из-за серверных ошибок/сбоев<br><br>Проверено Сотрудником Контроля Качества<br>Не возможно воспроизвести[/CENTER]',
			prefix: CHECKK_PREFIX,
			status: true,
	},
	];

	$(document).ready(() => {
	$('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');

	// Добавление кнопок при загрузке страницы
   addButton('КП', 'teamProject');
   addButton('ТC', 'techspec');
   addButton('На рассмотрении', 'pin');
   addButton('ПКК', 'checkkn');
   addButton('|', '');
   addButton('Меню', 'selectAnswer');

	// Поиск информации о теме
	const threadData = getThreadData();

	$('button#unaccept').click(() => editThreadData(UNACCEPT_PREFIX, false));
	$('button#pin').click(() => editThreadData(PIN_PREFIX, true));
	$('button#teamProject').click(() => editThreadData(COMMAND_PREFIX, true));
	$('button#techspec').click(() => editThreadData(TECHADM_PREFIX, true));
	$('button#watched').click(() => editThreadData(WATCHED_PREFIX, false));
	$('button#checkk').click(() => editThreadData(CHECKK_PREFIX, false));

	$(`button#selectAnswer`).click(() => {
	   XF.alert(buttonsMarkup(buttons), null, 'ВЫБЕРИТЕ ОТВЕТ');
	   buttons.forEach((btn, id) => {
	   if (id > 0) {
	   $(`button#answers-${id}`).click(() => pasteContent(id, threadData, true));
	   }
	   else {
	   $(`button#answers-${id}`).click(() => pasteContent(id, threadData, false));
	   }
	   });
	   });
	   });

    function addButton(name, id) {
        $('.button--icon--reply').before(
            `<button type="button" class="button rippleButton" id="${id}" style="oswald: 3px;">${name}</button>`,
        );
    }

	   function buttonsMarkup(buttons) {
	   return `<div class="select_answer">${buttons
	   .map(
	   (btn, i) =>
	   `<button id="answers-${i}" class="button--primary button ` +
	   `rippleButton" style="margin:4px"><span class="button-text">${btn.title}</span></button>`,
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
			if(prefix == CHECKK_PREFIX) {
				moveThread(prefix, 230); }
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