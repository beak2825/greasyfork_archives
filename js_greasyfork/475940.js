// ==UserScript==
// @name         тестинг перемещения
// @namespace    https://forum.blackrussia.online
// @version      0.0.0.4
// @description  для перемещения тем
// @author       @xmoore
// @match        https://forum.blackrussia.online/threads/*
// @include      https://forum.blackrussia.online/threads/
// @grant        none
// @license 	 MIT
// @collaborator Maximillian Miller
// @icon https://icons.iconarchive.com/icons/thesquid.ink/free-flat-sample/128/support-icon.png
// @copyright 2023
// @downloadURL https://update.greasyfork.org/scripts/475940/%D1%82%D0%B5%D1%81%D1%82%D0%B8%D0%BD%D0%B3%20%D0%BF%D0%B5%D1%80%D0%B5%D0%BC%D0%B5%D1%89%D0%B5%D0%BD%D0%B8%D1%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/475940/%D1%82%D0%B5%D1%81%D1%82%D0%B8%D0%BD%D0%B3%20%D0%BF%D0%B5%D1%80%D0%B5%D0%BC%D0%B5%D1%89%D0%B5%D0%BD%D0%B8%D1%8F.meta.js
// ==/UserScript==
// Названия префиксов
const RASSMOTRENO_PREFIX = 9; // Рассмотрено
const NARASSMOTRENII_PREFIX = 2; //   На рассмотрении
const QCUN_PREFIX = 15; // Проверено QC
const OBRATNOTECH_PREFIX = 13; // Теху
const buttons = [
    {
title: '41 zhb',

prefix: closedANDzakrep,
status: false,
},
];
$(document).ready(() => {
 
// Загрузка скрипта для обработки шаблонов
$('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');
 
// Добавление кнопок при загрузке страницы
addButton('>>>>>>>>>>>>>>>>>>>>МЕНЮ(TEХ)<<<<<<<<<<<<<<<<<<<<', 'selectAnswer');
 
 
// Поиск информации о теме
	const threadData = getThreadData();
 
	$('button#pin').click(() => editThreadData(NARASSMOTRENII_PREFIX, false)); // На рассмотрении
    $('button#watched').click(() => editThreadData(RASSMOTRENO_PREFIX, false)); // Рассмотрено
	$('button#checkk').click(() => editThreadData(QCCLOSED_PREFIX, false)); // Проверено QC
	$('button#tech').click(() => editThreadData(OBRATNOTECH_PREFIX, true)); // Теху
 $('button#closed').click(() => editThreadData(false)); //

if (prefix == closedANDzakrep) {
moveThread(1841);
} 
 
	$(`button#selectAnswer`).click(() => {
	   XF.alert(buttonsMarkup(buttons), null, '(v12.2.2)Выберите действие:');
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
// в окончательные ответы
if (prefix == QCUN_PREFIX) {
	moveThread(prefix, 230);
    }
//Перемещение по серверам
	   }   