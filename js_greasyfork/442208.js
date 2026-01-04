// ==UserScript==
// @name Акрошка
// @namespace https://forum.blackrussia.online
// @version 1.0.5.4
// @description SPB
// @author Danila_Fererra
// @match https://forum.blackrussia.online/index.php?threads/*
// @include https://forum.blackrussia.online/index.php?threads/
// @grant none
// @license MIT
// @collaborator 
// @icon https://icons.iconarchive.com/icons/thesquid.ink/free-flat-sample/128/support-icon.png
// @downloadURL https://update.greasyfork.org/scripts/442208/%D0%90%D0%BA%D1%80%D0%BE%D1%88%D0%BA%D0%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/442208/%D0%90%D0%BA%D1%80%D0%BE%D1%88%D0%BA%D0%B0.meta.js
// ==/UserScript==

(function () {
'use strict';
const UNACCEPT_PREFIX = 4; // префикс отказано
const PIN_PREFIX = 2; //  префикс закрепить
const COMMAND_PREFIX = 10; // команде проекта
const CLOSE_PREFIX = 7; // префикс закрыто
const DECIDED_PREFIX = 6; // префикс решено
const TECHADM_PREFIX = 13 // теху администратору
const buttons = [
{
	title: 'Приветствие',
	content:
	'[SIZE=4][FONT=Courier New][CENTER]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br><br>' + 
	'[CENTER]  [/CENTER][/FONT][/SIZE]',
},	
{
title: 'Сброс прописки',
content: '[FONT=Courier New][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br>' +
"[CENTER]Вам будет выдан сброс места прописки , ожидайте в течении недели и не изменяйте свой NickName.[/CENTER]" +
'[CENTER]Решено.[/CENTER][/FONT]',
	prefix: DECIDED_PREFIX,
	status: false,
},
{
title: 'Данная проблема решается',
content: '[FONT=Courier New][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br>' +
'[CENTER] О данной проблеме уже известна, над ней ведется активная работа.[/CENTER]' +
'[CENTER] Решено.[/CENTER][/FONT]',
	prefix: DECIDED_PREFIX,
	status: false,
},
{
title: 'Будет исправленно',
content: '[FONT=Courier New][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br>' +
"[CENTER]Данная недоработка будет проверена и исправлена. Спасибо за то, что помогаете сделать проект лучше![/CENTER]<br>" +
'[CENTER]Решено.[/CENTER][/FONT]',
	prefix: DECIDED_PREFIX,
	status: false,
},
  {
	  title: 'Передано на тестирование',
	  content:
		'[CENTER]{{ greeting }}, уважаемый(-ая)[B] {{ user.name }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Благодарим за уведомление о недоработке. Ваша тема передана в раздел тестирования, для выявление недоработок.<br><br>" +
		'[CENTER]На рассмотрении.[/CENTER]',
	},
	{
	  title: 'Логировщику',
	  content:
	    '[CENTER]{{ greeting }}, уважаемый(-ая)[B] {{ user.name }}[/B]![/CENTER]<br><br>' +
	    "[CENTER]Ваша тема закреплена и находиться на проверке. Пожалуйста, ожидайте ответа в данной теме.<br><br>" +
	    '[CENTER]Создавать новые темы с данной проблемой — не нужно.[/CENTER]',
		prefix: TECHADM_PREFIX,
			status: true,
	},
	{
	  title: 'Жб на адм',
	  content:	
	  '[CENTER]{{ greeting }}, уважаемый[B] {{ user.name }}[/B]![/CENTER]<br><br>' +
	  "[CENTER] Если вы не согласны с выданным наказанием от администратора сервера и прошло не более 24-ех часов с момента выдачи наказания, обратитесь в раздел Жалобы на адмминистрацию вашего сервера.<br>" +
	  "[CENTER] Решено, закрыто.[/CENTER]",
	prefix: DECIDED_PREFIX,
	status: false,
	},
		{
	  title: 'Обжалования',
	  content:	
	  '[CENTER]{{ greeting }}, уважаемый[B] {{ user.name }}[/B]![/CENTER]<br><br>' +
	  "[CENTER] Если вы хотите снизить наказание на ваш аккаунт от администратора сервера, вам в раздел обжалования.<br>" +
	  "[CENTER] Решено, закрыто.[/CENTER]",
	prefix: DECIDED_PREFIX,
	status: false,
	},
		{
	  title: 'Жб на игроков',
	  content:	
	  '[CENTER]{{ greeting }}, уважаемый[B] {{ user.name }}[/B]![/CENTER]<br><br>' +
	  "[CENTER] Данная тема не относится к техническому разделу, вам нужно создать данную тему в разделе жалоб на игроков если не прошло более 3-ех дней с момента нарушения.<br>" +
	  '[CENTER] Решено, закрыто.[/CENTER]',
	prefix: DECIDED_PREFIX,
	status: false,
	},
{
	  title: 'Жалобы сервера',
	  content:
		'[CENTER]{{ greeting }}, уважаемый {{ user.name }}![/CENTER]<br><br>' +
    "[CENTER]Обратитесь в раздел «Жалобы» Вашего сервера:<br><br>[URL='https://forum.blackrussia.online/index.php?categories/Жалобы.54/'][B]Сервер №1 | Red[/B] → нажмите сюда[/URL]<br>[URL='https://forum.blackrussia.online/index.php?categories/Жалобы.98/'][B]Сервер №2 | Green[/B] → нажмите сюда[/URL]<br>[URL='https://forum.blackrussia.online/index.php?categories/Жалобы.138/'][B]Сервер №3 | Blue[/B] → нажмите сюда[/URL]<br>[URL='https://forum.blackrussia.online/index.php?categories/Жалобы.174/'][B]Сервер №4 | Yellow[/B] → нажмите сюда[/URL]<br>[URL='https://forum.blackrussia.online/index.php?categories/Жалобы.251/'][B]Сервер №5 | Orange[/B] → нажмите сюда[/URL]<br>[URL='https://forum.blackrussia.online/index.php?categories/Жалобы.291/'][B]Сервер №6 | Purple[/B] → нажмите сюда[/URL]<br>[URL='https://forum.blackrussia.online/index.php?categories/Жалобы.331/'][B]Сервер №7 | Lime[/B] → нажмите сюда[/URL]<br>[URL='https://forum.blackrussia.online/index.php?categories/Жалобы.373/'][B]Сервер №8 | Pink[/B] → нажмите сюда[/URL]<br>[URL='https://forum.blackrussia.online/index.php?categories/Жалобы.414/'][B]Сервер №9 | Cherry[/B] → нажмите сюда[/URL]<br>[URL='https://forum.blackrussia.online/index.php?categories/Жалобы.467/'][B]Сервер №10 | Black[/B] → нажмите сюда[/URL]<br>[URL='https://forum.blackrussia.online/index.php?categories/Жалобы.498/'][B]Сервер №11 | Indigo[/B] → нажмите сюда[/URL]<br>[URL='https://forum.blackrussia.online/index.php?categories/Жалобы.654/'][B]Сервер №12 | White[/B] → нажмите сюда[/URL]<br>[URL='https://forum.blackrussia.online/index.php?categories/Жалобы.655/'][B]Сервер №13 | Magenta[/B] → нажмите сюда[/URL]<br>[URL='https://forum.blackrussia.online/index.php?forums/Жалобы.619/'][B]Сервер №14 | Crimson[/B] → нажмите сюда[/URL]<br>[URL='https://forum.blackrussia.online/index.php?categories/Жалобы.700/'][B]Сервер №15 | Gold[/B] → нажмите сюда[/URL]<br>[URL='https://forum.blackrussia.online/index.php?categories/Жалобы.720/'][B]Сервер №16 | Azure[/B] → нажмите сюда[/URL]<br>[URL='https://forum.blackrussia.online/index.php?categories/Жалобы.763/'][B]Сервер №17 | Platinum[/B] → нажмите сюда[/URL]<br>[URL='https://forum.blackrussia.online/index.php?forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B.822/'] [B] Сервер №18 | Aqua[/B] → нажмите сюда[/URL]<br>[URL='https://forum.blackrussia.online/index.php?forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B.863/'][B]Сервер №19 | Gray[/B] → нажмите сюда[/URL]<br>[URL='https://forum.blackrussia.online/index.php?forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B.932/'] [B]Сервер №20 | Ice [/B] → нажмите сюда[/URL]<br>[URL='https://forum.blackrussia.online/index.php?forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B.972/'] [B]Сервер №21 | Chilli [/B] → нажмите сюда[/URL]<br>[URL='https://forum.blackrussia.online/index.php?forums/Сервер-№22-choco.1009/'] [B]Сервер №22 | Choco [/B] → нажмите сюда[/URL]<br><br>" +
        '[CENTER]Отказано, закрыто.[/CENTER]',
        prefix: UNACCEPT_PREFIX,
        status: false,
	},
{
	title: 'Переустановите игру',
	content: '[FONT=Courier New][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br>' +
	"[CENTER]SIZE=4][FONT=Courier New]Возможно в файлах вашей игры присутствуют постороннее оборудование(дополнения/изменения/Фаст Конект).[/FONT]<br>" +
	"[CENTER][FONT=Courier New]Рекомендуется удалить полностью лаунчер и связанные с ним файлы и установить игру заново с официального источника - [URL='http://brussia-new.reactnet.site/launcher.apk']тык[/URL] <br>[/FONT]" +
	'[CENTER][FONT=Courier New]Решено.[/CENTER][/FONT]',
	prefix: DECIDED_PREFIX,
	status: false,
},
{
title: 'Идите в жб на техов',
content:  '[CENTER][FONT=Times New Roman][CENTER]Доброго времени суток, уважаемый игрок![/CENTER]<br><br>' +
	  "[CENTER]Если вы считаете что наказание было выдано неверно обратитесь в раздел жалобы на технических специалистов - [URL='https://forum.blackrussia.online/index.php?forums/Жалобы-на-технических-специалистов.490/']клик[/URL]<br><br>" +
	  '[CENTER]Закрыто.[/CENTER][/FONT]',
prefix: UNACCEPT_PREFIX,
status: false,
},
{
title: 'Дублирование темы',
content: '[FONT=Courier New][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br>' +
"[CENTER]Данная тема является дублированием прошлой. Напоминаем, при 3 дублированиях – форумный аккаунт будет заблокирован.<br>" +
'[CENTER]Решено.[/CENTER][/FONT]',
	prefix: DECIDED_PREFIX,
	status: false,
},
{
	  title: 'Нет доказательств',
	  content:
		'[CENTER]{{ greeting }}, уважаемый(-ая)[B] {{ user.name }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Без доказательств (в частности скриншоты или видео) – решить проблему не получится. Если доказательства найдутся - создайте новую тему, приложив доказательства с фото-хостинга yapx.ru или imgur.com<br><br>" +
		'[CENTER]Отказано, закрыто.[/CENTER]',
	prefix: DECIDED_PREFIX,
	status: false,
},
   {
	  title: 'Донат',
	  content:
		'[CENTER]{{ greeting }}, уважаемый(-ая)[B] {{ user.name }}[/B]![/CENTER]<br><br>' +
		'[CENTER]Система построена таким образом, что деньги не спишутся, пока наша платформа не уведомит платежную систему о зачислении BLACK COINS. Для проверки зачисления BLACK COINS необходимо ввести в игре команду: /donat.<br><br>' +
        '[CENTER]В остальных же случаях, если не были зачислены BLACK COINS — вероятнее всего, была допущена ошибка при вводе реквизитов. К нашему сожалению, из-за большого количества попыток обмана, мы перестали рассматривать подобные жалобы. Вам необходимо быть внимательными при осуществлении покупок. <br><br>' +
        '[CENTER]Если Вы считаете, что ошибки быть не может и с момента оплаты не прошло более 7 дней, то в обязательном порядке обратитесь в данное сообщество для дальнейшего решения: https://vk.com/br_tech.<br><br>' +
        '[CENTER]Решено.[/CENTER]',
    },
	    {
	  title: 'Хочу стать администратором',
	  content:
		'[CENTER]{{ greeting }}, уважаемый(-ая)[B] {{ user.name }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Команда технических специалистов не решает назначение на какую-либо должность, которая присутствует на проекте. Для этого существуют заявления в главном разделе Вашего игрового сервера, где Вы можете ознакомиться с открытыми должностями и формами подач. Приятной игры и желаем удачи в карьерной лестнице!<br><br>" +
		'[CENTER]Закрыто.[/CENTER]',
			prefix: DECIDED_PREFIX,
			status: false,
	},
{
title: 'Прикрепите доказательства',
content: '[FONT=Courier New][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br>' +
"[CENTER]В вашей теме нету доказательств, загрузите их на Imgur/Yapx/YouTube, пересоздайте тему и прикрепите ссылку в ней."+
'[CENTER]Решено.[/CENTER][/FONT]',
    prefix: UNACCEPT_PREFIX,
	status: false,
},
{
	title: 'Вылеты и т.д.',
content: '[FONT=Courier New][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br>' +
"[CENTER] Вам нужно оставить сообщение в этой теме - [URL='https://forum.blackrussia.online/index.php?threads/Вылеты-отсоединения-recaptcha-—-оставляйте-заявку-в-этой-теме.461486/page-8#post-6964181']клик[/URL]<br>" +
    '[CENTER]Решено.[/CENTER][/FONT]',
	prefix: DECIDED_PREFIX,
	status: false,
},
{
title: 'Актуально?',
content: '[FONT=Courier New][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br>' +
"[CENTER]Актуально?",
},
{
title: 'Передача разрабам',
content: '[FONT=Courier New][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br>' +
"[CENTER]Ваша тема закреплена и находится на рассмотрении у команды проекта. Пожалуйста, ожидайте выноса вердикта разработчиков."+
"[CENTER] Создавать новые темы с данной проблемой — не нужно, ожидайте ответа в данной теме. Если проблема решится - Вы всегда можете оставить своё сообщение в этой теме.<br>" +
'[CENTER]Решено.[/CENTER][/FONT]',
	prefix: COMMAND_PREFIX,
	status: true,
},
{
title: 'Форма темы',
content: '[FONT=Courier New][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br>' +
"[CENTER]Заполните форму ниже.<br><br>" +
"[CENTER]01. Ваш игровой никнейм:" +
"[CENTER]02. Сервер, на котором Вы играете:" +
"[CENTER]03. Суть возникшей проблемы (описать максимально подробно и раскрыто):" +
"[CENTER]04. Любые скриншоты, которые могут помочь в решении проблемы (если таковые имеются):" +
"[CENTER]05. Дата и время произошедшей технической проблемы (постарайтесь указать максимально точно):" +
'[CENTER]Решено.[/CENTER][/FONT]',
	prefix: DECIDED_PREFIX,
	status: false,
},
{
title: 'Не относится к разделу',
content: '[FONT=Courier New][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br>' +
"[CENTER]Пожалуйста, убедительная просьба, ознакомиться с назначением данного раздела в котором Вы создали тему, так как Ваш запрос никоим образом не относится к технической проблеме.[/CENTER]<br>" +
'[CENTER]Закрыто.[/CENTER][/FONT]',
	prefix: UNACCEPT_PREFIX,
	status: false,
},
{
title: 'Взлом',
content: '[FONT=Courier New][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br>' +
"[CENTER]Если Вы обезопасили Ваш аккаунт и привязали его к странице во ВКонтакте, то сбросить пароль или пин-код Вы всегда сможете обратившись вофициальное сообщество проекта - https://vk.com/blackrussia.online. Напишите 'Начать' в личные сообщения группы, затем выберите нужные Вам функции." +
"[CENTER]Если Вы обезопасили Ваш аккаунт и привязали его к почте, то сбросить пароль или пин-код Вы всегда сможете при вводе пароля на сервере. Выберите кнопку 'восст', затем выберите нужные Вам функции." +
"[CENTER]Если Вы не обезопасили свой аккаунт - его невозможно вернуть. Он будет заблокирован навсегда." +
"[CENTER]К сожалению, иногда решение подобных вопросов требует много времени. Надеемся, что Вы сможете восстановить доступ к аккаунту!." +
'[CENTER] Решено.[/CENTER][/FONT]',
	prefix: DECIDED_PREFIX,
	status: false,
},
{
title: 'Отсутствие ответа',
content: '[FONT=Courier New][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br>' +
"[CENTER]По техническими соображениям было принято решение закрыть данное обращение.<br><br>" +
"[CENTER] Пожалуйста, если данная проблема все ещё актуальна, оставьте новую заявку в данном разделе." +
'[CENTER]Закрыто.[/CENTER][/FONT]',
	prefix: UNACCEPT_PREFIX,
	status: false,
},
];

$(document).ready(() => {
// Загрузка скрипта для обработки шаблонов
$('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');

// Добавление кнопок при загрузке страницы
addButton('На рассмотрение', 'pin');
addButton('КП', 'teamProject');
addButton('Отказано', 'unaccept');
addButton('Решено', 'decided');
addButton('Закрыто', 'closed');
addButton('Техническому спецалисту', 'techspec');
addButton('Ответы', 'selectAnswer');

// Поиск информации о теме
const threadData = getThreadData();

$('button#unaccept').click(() => editThreadData(UNACCEPT_PREFIX, false));
$('button#pin').click(() => editThreadData(PIN_PREFIX, true));
$('button#teamProject').click(() => editThreadData(COMMAND_PREFIX, true));
$('button#watched').click(() => editThreadData(WATCHED_PREFIX, false));
$('button#decided').click(() => editThreadData(DECIDED_PREFIX, false));
$('button#closed').click(() => editThreadData(CLOSE_PREFIX, false));
$('button#techspec').click(() => editThreadData(TECHADM_PREFIX, true));

$(`button#selectAnswer`).click(() => {
XF.alert(buttonsMarkup(buttons), null, 'Выберите ответ:');
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

if (pin == false) {
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
if (pin == true) {
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
