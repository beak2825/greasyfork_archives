/// ==UserScript==
// @name         Скрипт для рп ситуаций  | R.Witdahoodie
// @namespace    https://forum.blackrussia.online
// @version      1.1Final
// @description  Скрипт для кураторов форума
// @author       Ruslan_Witdahoodie @ggemer
// @match        https://forum.blackrussia.online/threads/*
// @include      https://forum.blackrussia.online/threads/
// @grant        none
// @license    @ggemer
// @collaborator
// @icon https://vk.com/sticker/1-76845-128
// @downloadURL https://update.greasyfork.org/scripts/483774/%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D1%80%D0%BF%20%D1%81%D0%B8%D1%82%D1%83%D0%B0%D1%86%D0%B8%D0%B9%20%20%7C%20RWitdahoodie.user.js
// @updateURL https://update.greasyfork.org/scripts/483774/%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D1%80%D0%BF%20%D1%81%D0%B8%D1%82%D1%83%D0%B0%D1%86%D0%B8%D0%B9%20%20%7C%20RWitdahoodie.meta.js
// ==/UserScript==

(function () {
	'use strict';
const UNACCEPT_PREFIX= 4; // отказано
const ODOBRENO_PREFIX= 8;//  одобрено
const GA_PREFIX= 12;// га
const PIN_PREFIX = 2; //  закрепить\на рассмотрении
const TECHADM_PREFIX = 13 // тех
const NO_PREFIX = 0;
const buttons = [
{
	title: 'Приветсвие',
	content:
	'[SIZE=4][FONT=Veranda][CENTER]Доброе время суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
	'[CENTER] текст [/CENTER][/FONT][/SIZE]',
},
    {
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴РП биографии╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
      {
      title: 'одобрено',
      content:
		'[COLOR=rgb(224, 255, 255)][FONT=times new roman][SIZE=4][CENTER][I]{{ greeting }}, {{ user.mention }}[/color][/CENTER]' +
        "[Color=rgb(224, 255, 255)][FONT=courier new][CENTER]Ваша РП биография получает статус: [Color=rgb(154, 205, 50)]Одобрено.[/I][/CENTER][/color][/FONT]",
      prefix: ODOBRENO_PREFIX,
	  status: false,
    },
    {
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴РП биографии дополнения╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
      title: ' дополните детсво',
      content:
		'[COLOR=rgb(224, 255, 255)][FONT=times new roman][SIZE=4][CENTER][I]{{ greeting }}, {{ user.mention }}[/color][/CENTER]' +
        "[Color=rgb(224, 255, 255)][FONT=courier new][CENTER][B][I]Вам даётся 24 часа на дополнение пункта Детство[/color][/CENTER]" +
        '[Color=rgb(255, 140, 0)][CENTER]На рассмотрении[/I][/CENTER][/color][/FONT]',
      prefix: PIN_PREFIX,
       status: true,
    },
    {
      title: ' дополните пункт юность и взрослая жизнь',
      content:
		'[COLOR=rgb(224, 255, 255)][FONT=times new roman][SIZE=4][CENTER][I]{{ greeting }}, {{ user.mention }}[/color][/CENTER]' +
        "[Color=rgb(224, 255, 255)][FONT=courier new][CENTER][B][I]Вам даётся 24 часа на дополнение пункта Юность и взрослая жизнь[/color][/CENTER]" +
        '[Color=rgb(255, 140, 0)][CENTER]На рассмотрении[/I][/CENTER][/color][/FONT]',
      prefix: PIN_PREFIX,
       status: true,
    },
    {
      title: ' дополните пункт настоящее время',
      content:
		'[COLOR=rgb(224, 255, 255)][FONT=times new roman][SIZE=4][CENTER][I]{{ greeting }}, {{ user.mention }}[/color][/CENTER]' +
        "[Color=rgb(224, 255, 255)][FONT=courier new][CENTER][B][I]Вам даётся 24 часа на дополнение пункта Настоящее время[/color][/CENTER]" +
        '[Color=rgb(255, 140, 0)][CENTER]На рассмотрении[/I][/CENTER][/color][/FONT]',
      prefix: PIN_PREFIX,
       status: true,
    },
    {
      title: 'дополните хобби',
      content:
		'[COLOR=rgb(224, 255, 255)][FONT=times new roman][SIZE=4][CENTER][I]{{ greeting }}, {{ user.mention }}[/color][/CENTER]' +
        "[Color=rgb(224, 255, 255)][FONT=courier new][CENTER][B][I]Вам даётся 24 часа на дополнение пункта Хобби[/color][/CENTER]" +
        '[Color=rgb(255, 140, 0)][CENTER]На рассмотрении[/I][/CENTER][/color][/FONT]',
      prefix: PIN_PREFIX,
       status: false,
    },
    {
      title: ' некорректный возраст',
      content:
		'[COLOR=rgb(224, 255, 255)][FONT=times new roman][SIZE=4][CENTER][I]{{ greeting }}, {{ user.mention }}[/color][/CENTER]' +
        "[Color=rgb(224, 255, 255)][FONT=courier new][CENTER][B][I]Вам даётся 24 часа на исправление пункта возраст[/color][/CENTER]" +
        '[Color=rgb(255, 140, 0)][CENTER]На рассмотрении[/I][/CENTER][/color][/FONT]',
      prefix: PIN_PREFIX,
       status: false,
    },
    {
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴РП биографии отказ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
      title: 'отказ не выполнение условий',
      content:
		'[COLOR=rgb(224, 255, 255)][FONT=times new roman][SIZE=4][CENTER][I]{{ greeting }}, {{ user.mention }}[/color][/CENTER]' +
        "[Color=rgb(224, 255, 255)][FONT=courier new][CENTER]Ваша РП биография получает статус: [Color=FireBrick]Отказано.[/color]Причиной отказа послужило - не выполение условий выше[/I][/FONT][/color][/CENTER]" ,
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: '  отказ заголовок',
      content:
		'[COLOR=rgb(224, 255, 255)][FONT=times new roman][SIZE=4][CENTER][I]{{ greeting }}, {{ user.mention }}[/color][/CENTER]' +
        "[Color=rgb(224, 255, 255)][FONT=courier new][CENTER]Ваша РП биография получает статус: [Color=FireBrick]Отказано.[/color]Причиной отказа послужило - Заголовок создаваемой темы должен быть написан строго по данной форме: “ RolePlay биография гражданина Имя Фамилия. “[/I][/FONT][/color][/CENTER]" ,
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'отказ нонрп ник',
      content:
		'[COLOR=rgb(224, 255, 255)][FONT=times new roman][SIZE=4][CENTER][I]{{ greeting }}, {{ user.mention }}[/color][/CENTER]' +
        "[Color=rgb(224, 255, 255)][FONT=courier new][CENTER]Ваша РП биография получает статус: [Color=FireBrick]Отказано.[/color]Причиной отказа послужило - Запрещено создание Role Play биографии, если у Вас NonRolePlay никнейм.[/I][/FONT][/color][/CENTER]" ,
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: ' отказ нижнее подчеркивание в нике',
      content:
		'[COLOR=rgb(224, 255, 255)][FONT=times new roman][SIZE=4][CENTER][I]{{ greeting }}, {{ user.mention }}[/color][/CENTER]' +
        "[Color=rgb(224, 255, 255)][FONT=courier new][CENTER]Ваша РП биография получает статус: [Color=FireBrick]Отказано.[/color]Причиной отказа послужило - Никнейм должен быть указан без нижнего подчеркивания на русском как в заголовке, так и в самой теме.[/I][/FONT][/color][/CENTER]" ,
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: ' отказ не от 3-го лица',
      content:
		'[COLOR=rgb(224, 255, 255)][FONT=times new roman][SIZE=4][CENTER][I]{{ greeting }}, {{ user.mention }}[/color][/CENTER]' +
        "[Color=rgb(224, 255, 255)][FONT=courier new][CENTER]Ваша РП биография получает статус: [Color=FireBrick]Отказано.[/color]Причиной отказа послужило - Биография должна быть написана от третьего лица персонажа.[/I][/FONT][/color][/CENTER]" ,
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'отказ более чем 1 рп био на 1 акк',
      content:
		'[COLOR=rgb(224, 255, 255)][FONT=times new roman][SIZE=4][CENTER][I]{{ greeting }}, {{ user.mention }}[/color][/CENTER]' +
        "[Color=rgb(224, 255, 255)][FONT=courier new][CENTER]Ваша РП биография получает статус: [Color=FireBrick]Отказано.[/color]Причиной отказа послужило - Запрещено создавать более чем одной биографии для одного игрового аккаунта.[/I][/FONT][/color][/CENTER]",
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: ' отказ био известных лиц',
      content:
		'[COLOR=rgb(224, 255, 255)][FONT=times new roman][SIZE=4][CENTER][I]{{ greeting }}, {{ user.mention }}[/color][/CENTER]' +
        "[Color=rgb(224, 255, 255)][FONT=courier new][CENTER]Ваша РП биография получает статус: [Color=FireBrick]Отказано.[/color]Причиной отказа послужило - Запрещено использовать биографии известных личностей, лидеров, администраторов сервера, разработчиков, руководителей.[/I][/FONT][/color][/CENTER]",
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: ' отказ копипаси',
      content:
		'[COLOR=rgb(224, 255, 255)][FONT=times new roman][SIZE=4][CENTER][I]{{ greeting }}, {{ user.mention }}[/color][/CENTER]' +
        "[Color=rgb(224, 255, 255)][FONT=courier new][CENTER]Ваша РП биография получает статус: [Color=FireBrick]Отказано.[/color]Причиной отказа послужило - Запрещено полное и частичное копирование биографий из данного раздела или из разделов RP биографий других серверов.[/I][/FONT][/color][/CENTER]",
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: ' отказ приписывание супер способностей',
      content:
		'[COLOR=rgb(224, 255, 255)][FONT=times new roman][SIZE=4][CENTER][I]{{ greeting }}, {{ user.mention }}[/color][/CENTER]' +
        "[Color=rgb(224, 255, 255)][FONT=courier new][CENTER]Ваша РП биография получает статус: [Color=FireBrick]Отказано.[/color]Причиной отказа послужило - Запрещено приписывание своему персонажу супер-способностей.[/I][/FONT][/color][/CENTER]" ,
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: ' отказ много ошибок',
      content:
		'[COLOR=rgb(224, 255, 255)][FONT=times new roman][SIZE=4][CENTER][I]{{ greeting }}, {{ user.mention }}[/color][/CENTER]' +
        "[Color=rgb(224, 255, 255)][FONT=courier new][CENTER]Ваша РП биография получает статус: [Color=FireBrick]Отказано.[/color]Причиной отказа послужило многочисленные грамматические ошибки[/I][/FONT][/color][/CENTER]" ,
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴РП ситуации╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
      title: 'РП ситуация одобрено',
      content:
		'[COLOR=rgb(224, 255, 255)][FONT=times new roman][SIZE=4][CENTER][I]{{ greeting }}, {{ user.mention }}[/color][/CENTER]' +
        "[Color=rgb(224, 255, 255)][FONT=courier new][CENTER]Ваша РП ситуация получает статус: [Color=rgb(154, 205, 50)]Одобрено.[/I][/CENTER][/color][/FONT]",
      prefix: ODOBRENO_PREFIX,
	  status: false,
    },
    {
      title: 'РП ситуация на дороботке',
      content:
		'[COLOR=rgb(224, 255, 255)][FONT=times new roman][SIZE=4][CENTER][I]{{ greeting }}, {{ user.mention }}[/color][/CENTER]' +
        "[Color=rgb(224, 255, 255)][FONT=courier new][CENTER][B][I]Вам даётся 24 часа на дополнение вашей РП ситуации[/color][/CENTER]" +
        '[Color=rgb(255, 140, 0)][CENTER]На рассмотрении[/I][/CENTER][/color][/FONT]',
      prefix: PIN_PREFIX,
	  status: true,
    },
    {
      title: 'РП ситуация отказ',
      content:
		'[COLOR=rgb(224, 255, 255)][FONT=times new roman][SIZE=4][CENTER][I]{{ greeting }}, {{ user.mention }}[/color][/CENTER]' +
        "[Color=rgb(224, 255, 255)][FONT=courier new][CENTER]Ваша РП ситуация получает статус: [Color=FireBrick]Отказано.[/color]Причиной отказа могло послужить какое-либо нарушение из [URL=https://forum.blackrussia.online/index.php?threads/moscow-%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-role-play-%D1%81%D0%B8%D1%82%D1%83%D0%B0%D1%86%D0%B8%D0%B9.1809166]Тык[/URL][/color][/CENTER][/FONT]",
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴Неофициал. орг.╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
      title: 'Неофициальная Орг Одобрено',
      content:
		'[COLOR=rgb(224, 255, 255)][FONT=times new roman][SIZE=4][CENTER][I]{{ greeting }}, {{ user.mention }}[/color][/CENTER]' +
        '[Color=rgb(224, 255, 255)][FONT=courier new][CENTER]Ваша РП ситуация получает статус: [Color=rgb(154, 205, 50)]Одобрено.[/I][/CENTER][/color][/FONT]' +
        "[Color=rgb(224, 255, 255)][FONT=courier new][/color][/CENTER]Приятной игры [/color][/CENTER]",
      prefix: ODOBRENO_PREFIX,
	  status: false,
    },
    {
      title: 'Неофициальная Орг на дороботке',
      content:
		'[COLOR=rgb(224, 255, 255)][FONT=times new roman][SIZE=4][CENTER][I]{{ greeting }}, {{ user.mention }}[/color][/CENTER]' +
        "[Color=rgb(224, 255, 255)][FONT=courier new][CENTER][B][I]Вам даётся 24 часа на дополнение вашей Неофициальная Орг[/color][/CENTER]" +
        '[Color=rgb(255, 140, 0)][CENTER]На рассмотрении[/I][/CENTER][/color][/FONT]',
      prefix: PIN_PREFIX,
	  status: false,
    },
    {
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴Неофициал. орг. отказ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
      title: 'Неофициальная Орг отказ',
      content:
		'[COLOR=rgb(224, 255, 255)][FONT=times new roman][SIZE=4][CENTER][I]{{ greeting }}, {{ user.mention }}[/color][/CENTER]' +
        "[Color=rgb(224, 255, 255)][FONT=courier new][CENTER]Ваша РП ситуация получает статус: [Color=FireBrick]Отказано.[/color]Причиной отказа могло послужить какое-либо нарушение из [URL='https://forum.blackrussia.online/index.php?threads/moscow-%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%BE%D0%B7%D0%B4%D0%B0%D0%BD%D0%B8%D1%8F-%D0%BD%D0%B5%D0%BE%D1%84%D0%B8%D1%86%D0%B8%D0%B0%D0%BB%D1%8C%D0%BD%D0%BE%D0%B9-roleplay-%D0%BE%D1%80%D0%B3%D0%B0%D0%BD%D0%B8%D0%B7%D0%B0%D1%86%D0%B8%D0%B8.1809163/']Правила создания неофициальной RolePlay организации[/URL].[/color][/CENTER][/FONT]",
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Неофициальная Орг отказ нету стартового состава',
      content:
		'[COLOR=rgb(224, 255, 255)][FONT=times new roman][SIZE=4][CENTER][I]{{ greeting }}, {{ user.mention }}[/color][/CENTER]' +
        "[Color=rgb(224, 255, 255)][FONT=courier new][CENTER]Ваша РП ситуация получает статус: [Color=FireBrick]Отказано.[/color]Причиной отказа послужило - Для создания своей организации, её лидер должен иметь стартовый состав от 3+ человек, которые уже зарегистрированы на проекте.[/color][/CENTER][/FONT]",
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Неофициальная Орг отказ нету истории орг',
      content:
		'[COLOR=rgb(224, 255, 255)][FONT=times new roman][SIZE=4][CENTER][I]{{ greeting }}, {{ user.mention }}[/color][/CENTER]' +
        "[Color=rgb(224, 255, 255)][FONT=courier new][CENTER]Ваша РП ситуация получает статус: [Color=FireBrick]Отказано.[/color]Причиной отказа послужило - В теме должна быть описана история появления организации, её дальнейшие занятия.[/color][/CENTER][/FONT]",
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Неофициальная Орг отказ плохое оформление',
      content:
		'[COLOR=rgb(224, 255, 255)][FONT=times new roman][SIZE=4][CENTER][I]{{ greeting }}, {{ user.mention }}[/color][/CENTER]' +
        "[Color=rgb(224, 255, 255)][FONT=courier new][CENTER]Ваша РП ситуация получает статус: [Color=FireBrick]Отказано.[/color]Причиной отказа послужило - Оформление темы должно быть опрятным, если текст будет не читабелен, проверяющий вправе отклонить вашу заявку, переместив её в специальную тему.[/color][/CENTER][/FONT]",
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Неофициальная Орг отказ некорректное название',
      content:
		'[COLOR=rgb(224, 255, 255)][FONT=times new roman][SIZE=4][CENTER][I]{{ greeting }}, {{ user.mention }}[/color][/CENTER]' +
        "[Color=rgb(224, 255, 255)][FONT=courier new][CENTER]Ваша РП ситуация получает статус: [Color=FireBrick]Отказано.[/color]Причиной отказа послужило - Название темы должно быть по форме Название организации| Дата создания.[/color][/CENTER][/FONT]",
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴Неофициал. орг. активность╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
      {
      title: 'Неофициальная Орг запроси активности',
      content:
		'[COLOR=rgb(224, 255, 255)][FONT=times new roman][SIZE=4][CENTER][I]{{ greeting }}, {{ user.mention }}[/color][/CENTER]' +
        "[Color=rgb(224, 255, 255)][FONT=courier new][CENTER][B][I]Ваша неофициальная РП организация может быть закрыта по пункту правил: Неактив в топике организации более недели, он закрывается. Прекрипите отчёт о активности организации в виде скриншотов. Через 24 часа если отчёта не будет или он будет некорректный организация будет закрыта.[/color][/CENTER]",
              prefix: PIN_PREFIX,
	 status: true
,
    },
    {
      title: 'Неофициальная Орг закрытие активности',
      content:
		'[COLOR=rgb(224, 255, 255)][FONT=times new roman][SIZE=4][CENTER][I]{{ greeting }}, {{ user.mention }}[/color][/CENTER]' +
        "[Color=rgb(224, 255, 255)][FONT=courier new][CENTER][B][I]Активность небыла предоставлена. Организация закрыта.[/color][/CENTER]",
              prefix: UNACCEPT_PREFIX,
	  status: false,
},
];
$(document).ready(() => {
// Загрузка скрипта для обработки шаблонов
$('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');
 
 
// Добавление кнопок при загрузке страницы
addButton('|', '');
addButton('<span style="-color: DarkOrange;">На рассмотрении</span>', 'pin');
addButton('<span style="color: Beige;">Меню</span>', 'selectAnswer');
 
 
// Поиск информации о теме
const threadData = getThreadData();

$(`button#ff`).click(() => pasteContent(8, threadData, true));
$(`button#prr`).click(() => pasteContent(2, threadData, true));
$(`button#zhb`).click(() => pasteContent(21, threadData, true));
$('button#unaccept').click(() => editThreadData(UNACCEPT_PREFIX, false));
$('button#pin').click(() => editThreadData(PIN_PREFIX, true));
$('button#techspec').click(() => editThreadData(TECHADM_PREFIX, true));
 
$(`button#selectAnswer`).click(() => {
XF.alert(buttonsMarkup(buttons), null, '<span style="color: ;">Выбери</span> ответ ');
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
        `<button type="button" class="button rippleButton" id="${id}" style="oswald: 1px;">${name}</button>`,
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