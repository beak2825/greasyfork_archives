// ==UserScript==
// @name Жалобы
// @namespace Samurai
// @version 1.0
// @description Рабочая версия
// @author Samurai Kalashnikov
// @match https://forum.blackrussia.online/threads/*
// @include https://forum.blackrussia.online/threads/
// @grant none
// @license MIT
// @collaborator
// @icon https://icons.iconarchive.com/icons/graphicloads/flat-finance/128/certificate-icon.png
// @updateURL
// @downloadURL https://update.greasyfork.org/scripts/515116/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/515116/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B.meta.js
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
title: '-----------------------------------------------------------Жалобы на игроков-----------------------------------------------------------',
},
{
title: 'Отправить на рассмотрение',
content:
'[SIZE=4][FONT=Times New Roman][COLOR=#db7093][CENTER]{{ greeting }}, уважаемый(ая) {{ user.mention }}![/COLOR][/CENTER]<br>' +
"[CENTER]Ваша жалоба взята на рассмотрение. Пожалуйста, ожидайте ответа.[/CENTER]<br><br>" +
'[CENTER][COLOR=#ffd838]На рассмотрении…[/COLOR][/CENTER][/FONT][/SIZE]',
prefix: PIN_PREFIX,
status: true,
},
{
title: 'Не хватает /time',
content:
'[SIZE=4][FONT=Times New Roman][COLOR=#db7093][CENTER]{{ greeting }}, уважаемый(ая) {{ user.mention }}![/COLOR][/CENTER]<br>' +
"[CENTER]На доказательствах отсутствует /time.[/CENTER]<br><br>" +
'[CENTER][COLOR=#ff0000]Отказано, закрыто.[/COLOR][/CENTER][/FONT][/SIZE]',
prefix: UNACCEPT_PREFIX,
status: false,
},
{
title: 'Док-ва более 3-х минут',
content:
'[SIZE=4][FONT=Times New Roman][COLOR=#db7093][CENTER]{{ greeting }}, уважаемый(ая) {{ user.mention }}![/COLOR][/CENTER]<br>' +
"[CENTER]Ваши доказательства длятся более 3-ëх минут. Нужно указать тайм-коды: условий,обмена и момент обмана.[/CENTER]<br><br>" +
'[CENTER][COLOR=#ff0000]Отказано, закрыто.[/COLOR][/CENTER][/FONT][/SIZE]',
prefix: UNACCEPT_PREFIX,
status: false,
},
{
title: 'Форма подачи жалобы',
content:
'[SIZE=4][FONT=Times New Roman][COLOR=#db7093][CENTER]{{ greeting }}, уважаемый(ая) {{ user.mention }}![/COLOR][/CENTER]<br>' +
"[B][CENTER][COLOR=lavender]Ваша жалоба составлена не по форме, пожалуйста ознакомьтесь с правилами подачи жалоб : [URL='https://forum.blackrussia.online/threads/Правила-подачи-жалоб-на-игроков.3429394/']*Нажмите сюда*[/URL]<br><br>" +
'[CENTER][COLOR=#ff0000]Отказано, закрыто.[/COLOR][/CENTER][/FONT][/SIZE]',
prefix: CLOSE_PREFIX,
status: false,
},
{ title: 'Доказательства обрываются',
content:
'[SIZE=4][FONT=Times New Roman][COLOR=#db7093][CENTER]{{ greeting }}, уважаемый(ая) {{ user.mention }}![/COLOR][/CENTER]<br>' +
"[CENTER]Ваши доказательства обрываются. Используйте фото/видео хостинги как Youtube/Rutube и создайте новую жалобу .[/CENTER]<br><br>" +
'[CENTER][COLOR=#ff0000]Отказано, закрыто.[/COLOR][/CENTER][/FONT][/SIZE]',
prefix: CLOSE_PREFIX,
status: false,
},
{
title: 'более 3 дней',
content:
'[SIZE=4][FONT=Times New Roman][COLOR=#db7093][CENTER]{{ greeting }}, уважаемый(ая) {{ user.mention }}![/COLOR][/CENTER]<br>' +
"[CENTER]С момента нарушения прошло более 3 дней.[/CENTER]<br><br>" +
'[CENTER][COLOR=#ff0000]Отказано, закрыто.[/COLOR][/CENTER]',
prefix: UNACCEPT_PREFIX,
status: false,
},
{
title: 'Нет доказательств',
content:
'[SIZE=4][FONT=Times New Roman][COLOR=#db7093][CENTER]{{ greeting }}, уважаемый(ая) {{ user.mention }}![/COLOR][/CENTER]<br>' +
"[CENTER]В вашей жалобе отсутсвуют доказательства. Используйте фото/видео хостинги как Imgur,Youtube,Япикс,Rutube. [/CENTER]<br><br>" +
'[CENTER][COLOR=#ff0000]Отказано, закрыто.[/COLOR][/CENTER][/FONT][/SIZE]',
prefix: UNACCEPT_PREFIX,
status: false,
},
{
title: 'Недостаточно доказательств',
content:
'[SIZE=4][FONT=Times New Roman][COLOR=#db7093][CENTER]{{ greeting }}, уважаемый(ая) {{ user.mention }}![/COLOR][/CENTER]<br>' +
"[CENTER]В вашей жалобе недостаточно доказательств. [/CENTER]<br><br>" +
'[CENTER][COLOR=#ff0000]Отказано, закрыто.[/COLOR][/CENTER][/FONT][/SIZE]',
prefix: UNACCEPT_PREFIX,
status: false,
},
{
title: '| Передать Теху|',
content:
'[SIZE=4][FONT=Times New Roman][COLOR=#db7093][CENTER]{{ greeting }}, уважаемый(ая) {{ user.mention }}![/COLOR][/CENTER]<br>' +
"[B][CENTER][COLOR=lavender] Ваша жалоба была передана техническому специалисту сервера, пожалуйста ожидайте ответа..<br><br>" +
'[CENTER][COLOR=blue]Передано Техническому Специалисту.[/COLOR][/CENTER]',
prefix: TECH_PREFIX,
status: true,
},
 {
title: 'нужен фрапс',
content:
'[SIZE=4][FONT=Times New Roman][COLOR=#db7093][CENTER]{{ greeting }}, уважаемый(ая) {{ user.mention }}![/COLOR][/CENTER]<br>' +
"[CENTER]В таких случаях нужен фрапс (видеофиксация).[/CENTER]<br><br>" +
'[CENTER][COLOR=#ff0000]Отказано, закрыто.[/COLOR][/CENTER][/FONT][/SIZE]',
prefix: UNACCEPT_PREFIX,
status: false,
},
    {
 title: 'нет условий',
 content:
'[SIZE=4][FONT=Times New Roman][COLOR=#db7093][CENTER]{{ greeting }}, уважаемый(ая) {{ user.mention }}![/COLOR][/CENTER]<br>' +
"[CENTER]В ваших доказательствах отсутствуют условия обмена[/CENTER]<br><br>" +
'[CENTER][COLOR=#ff0000]Отказано, закрыто.[/COLOR][/CENTER][/FONT][/SIZE]',
prefix: UNACCEPT_PREFIX,
status: false,
},
          {
title: 'Док-ва более 3-х минут',
content:
'[SIZE=4][FONT=Times New Roman][COLOR=#db7093][CENTER]{{ greeting }}, уважаемый(ая) {{ user.mention }}![/COLOR][/CENTER]<br>' +
"[CENTER]Ваши доказательства длятся более 3-ëх минут. Нужно указать тайм-коды: условий,обмена и момент обмана.[/CENTER]<br><br>" +
'[CENTER][COLOR=#ff0000]Отказано, закрыто.[/COLOR][/CENTER][/FONT][/SIZE]',
prefix: UNACCEPT_PREFIX,
status: false,
},
     {
title: 'нет доступа к доказательствам',
content:
'[SIZE=4][FONT=Times New Roman][COLOR=#db7093][CENTER]{{ greeting }}, уважаемый(ая) {{ user.mention }}![/COLOR][/CENTER]<br>' +
"[CENTER]К вашим доказательствам нет доступа/битая ссылка. Просьба создать новую жалобу и предоставть рабочие доказательства[/CENTER]<br><br>" +
'[CENTER][COLOR=#ff0000]Отказано, закрыто.[/COLOR][/CENTER][/FONT][/SIZE]',
prefix: UNACCEPT_PREFIX,
status: false,
},
{
title: 'Игрок будет наказан',
content:
'[SIZE=4][FONT=Times New Roman][COLOR=#db7093][CENTER]{{ greeting }}, уважаемый(ая) {{ user.mention }}![/COLOR][/CENTER]<br>'+
"[CENTER]Игрок будет наказан. Благодарим вас за обращение.[/CENTER]<br><br>" +
'[CENTER][COLOR=#38ff4c]Одобрено, закрыто.[/COLOR][/CENTER][/FONT][/SIZE]',
prefix: ACCEPT_PREFIX,
status: false,
},
{
title: '-----------------------------------------------------------Жалобы на администрацию-----------------------------------------------------------',
},
{
title: '| Прошло более 48 часов |',
content:
'[SIZE=4][FONT=Times New Roman][COLOR=#db7093][CENTER]{{ greeting }}, уважаемый(ая) {{ user.mention }}![/COLOR][/CENTER]<br>'+
"[CENTER]С момента выдачи наказания прошло более 48-ми часов.[/CENTER]<br><br>" +
'[CENTER][COLOR=#ff0000]Отказано, закрыто.[/COLOR][/CENTER][/FONT][/SIZE]',
prefix: UNACCEPT_PREFIX,
status: false,
},
{
title: '| Окно бана |',
content:
'[SIZE=4][FONT=Times New Roman][COLOR=#db7093][CENTER]{{ greeting }}, уважаемый(ая) {{ user.mention }}![/COLOR][/CENTER]<br>'+
"[CENTER]Зайдите в игру и сделайте скрин окна с баном после чего,напишите жалобу заново.[/CENTER]<br><br>" +
'[CENTER][COLOR=#ff0000]Отказано, закрыто.[/COLOR][/CENTER][/FONT][/SIZE]',
prefix: UNACCEPT_PREFIX,
status: false,
},
{
title: '| Нет нарушений |',
content:
'[SIZE=4][FONT=Times New Roman][COLOR=#db7093][CENTER]{{ greeting }}, уважаемый(ая) {{ user.mention }}![/COLOR][/CENTER]<br>'+
"[CENTER] Исходя из выше приложенных доказательств, нарушения со стороны администратора - не имееться!.[/CENTER]<br><br>" +
'[CENTER][COLOR=#ff0000]Отказано, закрыто.[/COLOR][/CENTER][/FONT][/SIZE]',
prefix: UNACCEPT_PREFIX,
status: false,
},
{
title: '| Наказание верное |',
content:
'[SIZE=4][FONT=Times New Roman][COLOR=#db7093][CENTER]{{ greeting }}, уважаемый(ая) {{ user.mention }}![/COLOR][/CENTER]<br>'+
"[B][CENTER][COLOR=lavender] Проверив доказательства администратора, было принято решение, что наказание выдано верно<br><br>" +
'[CENTER][COLOR=#ff0000]Отказано, закрыто.[/COLOR][/CENTER][/FONT][/SIZE]',
prefix: UNACCEPT_PREFIX,
status: false,
},
    {
title: 'Форма подачи жалобы',
content:
'[SIZE=4][FONT=Times New Roman][COLOR=#db7093][CENTER]{{ greeting }}, уважаемый(ая) {{ user.mention }}![/COLOR][/CENTER]<br>' +
"[B][CENTER][COLOR=lavender]Ваша жалоба составлена не по форме, пожалуйста ознакомьтесь с правилами подачи жалоб : [URL='https://forum.blackrussia.online/threads/Правила-подачи-жалоб-на-администрацию.3429349/']*Нажмите сюда*[/URL]<br><br>" +
'[CENTER][COLOR=#ff0000]Отказано, закрыто.[/COLOR][/CENTER][/FONT][/SIZE]',
prefix: CLOSE_PREFIX,
status: false,
},
{
title: '| В ЖБ на теха |',
content:
'[SIZE=4][FONT=Times New Roman][COLOR=#db7093][CENTER]{{ greeting }}, уважаемый(ая) {{ user.mention }}![/COLOR][/CENTER]<br>'+
"[B][CENTER][COLOR=lavender] Вам было выдано наказания Техническим специалистом, вы можете написать жалобу здесь : [URL='https://forum.blackrussia.online/forums/Сервер-№87-podolsk.3816/']*Нажмите сюда*[/URL]<br><br>" +
'[CENTER][COLOR=#ff0000]Закрыто.[/COLOR][/CENTER][/FONT][/SIZE]',
prefix: CLOSE_PREFIX,
status: false,
},
{
title: '| Передать ГА |',
content:
'[SIZE=4][FONT=Times New Roman][COLOR=#db7093][CENTER]{{ greeting }}, уважаемый(ая) {{ user.mention }}![/COLOR][/CENTER]<br>'+
"[B][CENTER][COLOR=lavender] Жалоба передана Главному Администратору , пожалуйста ожидайте ответа.<br><br>" +
'[CENTER][COLOR=#ff0000]Передано Главному Администратору.[/COLOR][/CENTER][/FONT][/SIZE]',
prefix: GA_PREFIX,
status: true,
},
{
title: '| Наказание по ошибке |',
content:
'[SIZE=4][FONT=Times New Roman][COLOR=#db7093][CENTER]{{ greeting }}, уважаемый(ая) {{ user.mention }}![/COLOR][/CENTER]<br>'+
"[B][CENTER][COLOR=lavender] В следствие беседы с администратором, было выяснено, наказание было выдано по ошибке.<br><br>" +
"[B][CENTER][COLOR=lavender] Наказание будет снято в течении 24-х часов если еще присутствует."+
'[CENTER][COLOR=#38ff4c]Одобрено, закрыто.[/COLOR][/CENTER][/FONT][/SIZE]',
prefix: ACCEPT_PREFIX,
status: false,
},
    {
title: '|отредачено|',
content:
'[SIZE=4][FONT=Times New Roman][COLOR=#db7093][CENTER]{{ greeting }}, уважаемый(ая) {{ user.mention }}![/COLOR][/CENTER]<br>'+
"[B][CENTER][COLOR=lavender] Ваши доказательства отредактированы, следовательно жалоба рассмотрению не подлежит<br><br>" +
'[CENTER][COLOR=#ff0000]Отказано, закрыто.[/COLOR][/CENTER][/FONT][/SIZE]',
prefix: UNACCEPT_PREFIX,
status: false,
},
{
title: '| Беседа с админом |',
content:
'[SIZE=4][FONT=Times New Roman][COLOR=#db7093][CENTER]{{ greeting }}, уважаемый(ая) {{ user.mention }}![/COLOR][/CENTER]<br>'+
"[B][CENTER][COLOR=lavender] Ваша жалоба была одобрена и будет проведена беседа с администратором.<br><br>" +
"[B][CENTER][COLOR=lavender] Приносим свои извинения за данную ситуацию."+
'[CENTER][COLOR=#38ff4c]Одобрено, закрыто.[/COLOR][/CENTER][/FONT][/SIZE]',
prefix: ACCEPT_PREFIX,
status: false,
},
{
title: '| Передать спецам |',
content:
'[SIZE=4][FONT=Times New Roman][COLOR=#db7093][CENTER]{{ greeting }}, уважаемый(ая) {{ user.mention }}![/COLOR][/CENTER]<br>'+
"[B][CENTER][COLOR=lavender] Жалоба передана Специальному Администратору, а так же его Заместителям, пожалуйста ожидайте ответа..<br><br>" +
'[B][CENTER][COLOR=yellow]Передано Специальной Администрации[/FONT][/COLOR][/CENTER][/B]',
prefix: SPECIAL_PREFIX,
status: true,
},
    {
title: '-----------------------------------------------------------Обжалование-----------------------------------------------------------',
},
    {
title: 'Обжалован',
content:
'[SIZE=4][FONT=Times New Roman][COLOR=#db7093][CENTER]{{ greeting }}, уважаемый(ая) {{ user.mention }}![/COLOR][/CENTER]<br>'+
"[CENTER]Ваше обжалование одобрено, наказание будет снято, впредь не совершайте подобных ошибок..[/CENTER]<br><br>"+
'[CENTER][COLOR=#38ff4c]Одобрено, закрыто.[/COLOR][/CENTER][/FONT][/SIZE]',
prefix: ACCEPT_PREFIX,
status: false,
},
    {
title: 'Отказано',
content:
'[SIZE=4][FONT=Times New Roman][COLOR=#db7093][CENTER]{{ greeting }}, уважаемый(ая) {{ user.mention }}![/COLOR][/CENTER]<br>'+
"[B][CENTER][COLOR=lavender]В обжаловании вашего наказания отказано.<br><br>" +
'[CENTER][COLOR=#ff0000]Отказано, закрыто.[/COLOR][/CENTER][/FONT][/SIZE]',
prefix: UNACCEPT_PREFIX,
status: false,
},
    {
title: 'Отправить на рассмотрение',
content:
'[SIZE=4][FONT=Times New Roman][COLOR=#db7093][CENTER]{{ greeting }}, уважаемый(ая) {{ user.mention }}![/COLOR][/CENTER]<br>' +
"[CENTER]Ваше обжалование взято на рассмотрение. Пожалуйста, ожидайте ответа.[/CENTER]<br><br>" +
'[CENTER][COLOR=#ffd838]На рассмотрении…[/COLOR][/CENTER][/FONT][/SIZE]',
prefix: PIN_PREFIX,
status: true,
},
    {
title: 'Не по форме',
content:
'[SIZE=4][FONT=Times New Roman][COLOR=#db7093][CENTER]{{ greeting }}, уважаемый(ая) {{ user.mention }}![/COLOR][/CENTER]<br>' +
"[B][CENTER][COLOR=lavender]Ваше обжалование составлено не по форме, пожалуйста ознакомьтесь с правилами подачи обжалований : [URL='https://forum.blackrussia.online/threads/Правила-подачи-заявки-на-обжалование-наказания.3429398/']*Нажмите сюда*[/URL]<br><br>" +
'[CENTER][COLOR=#ff0000]Отказано, закрыто.[/COLOR][/CENTER][/FONT][/SIZE]',
prefix: CLOSE_PREFIX,
status: false,
},
{
title: 'Передать Sakaro',
content:
'[SIZE=4][FONT=Times New Roman][COLOR=#db7093][CENTER]{{ greeting }}, уважаемый(ая) {{ user.mention }}![/COLOR][/CENTER]<br>'+
"[B][CENTER]Ваше обжалование передано<br><br>" +
"[B][CENTER][COLOR=#4169E1]Руководителю Модерации Дискорда.[/COLOR]<br><br>" +
'[B][CENTER][COLOR=yellow]Передано [COLOR=yellow][USER=17]Sakaro[/USER][/FONT][/COLOR][/CENTER][/B]',
prefix: COMMAND_PREFIX,
status: true,
    },
 {
title: 'Nrp обман',
content:
'[SIZE=4][FONT=Times New Roman][COLOR=#db7093][CENTER]{{ greeting }}, уважаемый(ая) {{ user.mention }}![/COLOR][/CENTER]<br>' +
"[B][CENTER][COLOR=lavender]Обжалование NonRP обмана возможно лишь в том случае ,если вы сами свяжитесь с обманутой стороной и будите готовы отдать украденное.​<br><br>" +
'[CENTER][COLOR=#ff0000]Отказано, закрыто.[/COLOR][/CENTER][/FONT][/SIZE]',
prefix: CLOSE_PREFIX,
status: false,
},
    {
title: 'ошибка сервер',
content:
'[SIZE=4][FONT=Times New Roman][COLOR=#db7093][CENTER]{{ greeting }}, уважаемый(ая) {{ user.mention }}![/COLOR][/CENTER]<br>' +
"[B][CENTER][COLOR=lavender]Вы ошиблись сервером.Обратитесь в раздел обжалований в нужном разделе.​<br><br>" +
'[CENTER][COLOR=#ff0000]Отказано, закрыто.[/COLOR][/CENTER][/FONT][/SIZE]',
prefix: CLOSE_PREFIX,
status: false,
},
     {
title: 'ВК',
content:
'[SIZE=4][FONT=Times New Roman][COLOR=#db7093][CENTER]{{ greeting }}, уважаемый(ая) {{ user.mention }}![/COLOR][/CENTER]<br>' +
"[B][CENTER][COLOR=lavender]Прикрепите ссылку на ваш ВК, на котором находится ЧС.​<br><br>" +
'[CENTER][COLOR=#ffd838]На рассмотрении…[/COLOR][/CENTER][/FONT][/SIZE]',
prefix: PIN_PREFIX,
status: true,
},
    {
title: '24 часа',
content:
'[SIZE=4][FONT=Times New Roman][COLOR=#db7093][CENTER]{{ greeting }}, уважаемый(ая) {{ user.mention }}![/COLOR][/CENTER]<br>' +
"[B][CENTER][COLOR=lavender]Ваш аккаунт будет разблокирован на 24 часа для исправления нарушения.​<br><br>" +
'[CENTER][COLOR=#ffd838]На рассмотрении…[/COLOR][/CENTER][/FONT][/SIZE]',
prefix: PIN_PREFIX,
status: true,
},
 ];


$(document).ready(() => {
	// Загрузка скрипта для обработки шаблонов
	$('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');

	// Добавление кнопок при загрузке страницы
	addButton('На рассмотрение', 'pin');
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
