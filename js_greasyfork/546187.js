// ==UserScript==
// @name         Кнопка "Ожидание"
// @namespace    https://forum.blackrussia.online
// @version      1.0
// @description  Для руководства технического отдела и комфортной модерации разделов
// @author       Raf_Piatigorsky
// @match        https://forum.blackrussia.online/*
// @include      https://forum.blackrussia.online/
// @grant        none
// @license  MIT
// @collaborator Raf_Piatigorsky
// @icon https://steamuserimages-a.akamaihd.net/ugc/1769322337460134984/5A1D32EC938D23FA36A01A33EE1943C839BB049C/?imw=512&imh=512&ima=fit&impolicy=Letterbox&imcolor=%23000000&letterbox=true
// @downloadURL
// @updateURL
// @downloadURL https://update.greasyfork.org/scripts/546187/%D0%9A%D0%BD%D0%BE%D0%BF%D0%BA%D0%B0%20%22%D0%9E%D0%B6%D0%B8%D0%B4%D0%B0%D0%BD%D0%B8%D0%B5%22.user.js
// @updateURL https://update.greasyfork.org/scripts/546187/%D0%9A%D0%BD%D0%BE%D0%BF%D0%BA%D0%B0%20%22%D0%9E%D0%B6%D0%B8%D0%B4%D0%B0%D0%BD%D0%B8%D0%B5%22.meta.js
// ==/UserScript==

  (function () {
	'use strict';
	const WAIT_PREFIX = 14; // префикс ожидание

$(document).ready(() => {
	// Загрузка скрипта для обработки шаблонов
	$('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');

	// Добавление кнопок при загрузке страницы
	addButton('Ожидание', 'wait', 'border-radius: 20px; margin-right: 100x; border: 2px solid; border-color: hsl(0, 0%, 85%);');

	// Поиск информации о теме
	const threadData = getThreadData();

	$(`button#ff`).click(() => pasteContent(8, threadData, true));
	$(`button#prr`).click(() => pasteContent(2, threadData, true));
	$(`button#zhb`).click(() => pasteContent(21, threadData, false));
	$('button#wait').click(() => editThreadData(WAIT_PREFIX, false));

        $(`button#selectMoveTasks`).click(() => {
            XF.alert(tasksMarkup1(tasks), null, 'Выберите действие:');
            tasks.forEach((btn, id) => {
                $(`button#answers-${id}`).click(() => moveThread(tasks[id].prefix, tasks[id].move));
            });
        });
    });


    function addButton(name, id, hex = "grey") {
		$('.button--icon--reply').before(
		`<button type="button" class="button--primary button rippleButton" id="${id}" style="border-radius: 25px; margin-right: 5px; background-color: ${hex}">${name}</button>`,
		);
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

