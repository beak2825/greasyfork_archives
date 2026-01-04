// ==UserScript==
// @name        Скрипт для КФ biography, , organization
// @namespace    https://forum.blackrussia.online
// @version      2
// @description  По всем вопросам писать @br.santa
// @author      Santa_Aelpee
// @match        https://forum.blackrussia.online/threads/*
// @include      https://forum.blackrussia.online/threads/
// @grant        none
// @license      MIT
// @collaborator
// @icon https://icons.iconarchive.com/icons/papirus-team/papirus-apps/48/emerald-theme-manager-icon-icon.png
// @downloadURL https://update.greasyfork.org/scripts/468338/%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%9A%D0%A4%20biography%2C%20%2C%20organization.user.js
// @updateURL https://update.greasyfork.org/scripts/468338/%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%9A%D0%A4%20biography%2C%20%2C%20organization.meta.js
// ==/UserScript==
 
(function () {
  'use strict';
const UNACCEPT_PREFIX = 4; // Prefix that will be set when thread closes
const ACCEPT_PREFIX = 8; // Prefix that will be set when thread accepted
const RASSMOTRENO_PREFIX = 6; // Prefix that will be set when solving the problem
const PIN_PREFIX = 2; // Prefix that will be set when thread pins
const GA_PREFIX = 12; // Prefix that will be set when thread send to Chief Administrator
const COMMAND_PREFIX = 10; // Prefix that will be set when thread send to Project Team
const WATCHED_PREFIX = 9;  // Prefix that will be set when thread reviewed by
const CLOSE_PREFIX = 7; // Prefix that will be set when thread closed
const TEX_PREFIX = 13; // Prefix that will be set when thread send to Technical Specialist
const SPEC_PREFIX = 11; // Prefix that will be set when thread send to Special Administrator
const buttons = [
 
    {
	  title: '-----  РП Биографии  -----------------------------------------------------------------------------------------------------------------------------------',
	},
     {
      title: 'Одобрено',
      content:
		"[B][CENTER][COLOR=#FF0000][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        " [FONT=georgia] [B][CENTER]Ваша РП Биография получает статус<br><br>" +
		"[CENTER][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG]<br>"+
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/BvPWW4LJ/download.gif[/img][/url][/CENTER]' +
"[CENTER][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG]<br>"+
"[I][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] Black Russia[/B][/COLOR] [/SIZE][/I][COLOR=rgb(0, 255, 127)][B][SIZE=1][/SIZE][/B][/COLOR]", 
		
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
     {
      title: 'Отказано',
      content:
		"[B][CENTER][COLOR=#FF0000][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        " [FONT=georgia] [B][CENTER]Ваша РП Биография получает статус<br><br>" +
"[CENTER][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG]<br>"+
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/VLdnykBS/download-1.gif[/img][/url][/CENTER]' +
"[CENTER][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG]<br>"+
" [FONT=georgia] Причиной могло послужить любое нарушение Правил Подачи РП Биографии<br>" , 
      prefix: UNACCEPT_PREFIX,
	  status: false,
}, 
{
     title: 'Возраст не совпадает',
      content:
		'[Color=Red][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый {{ user.name }}.[/color][/CENTER]<br>' +
        "[CENTER]Ваша РП биография получает статус: [Color=Red]Отказано.[/color]<br>Причина: Возраст не совпадает с датой рождения."+
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/MpZsG4kg/9.png[/img][/url][/CENTER]' +
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/VLdnykBS/download-1.gif[/img][/url][/CENTER]' , 
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    
    {
      title: 'Фамилия или имя в названии отличаются',
      content:
		'[Color=Red][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый {{ user.name }}.[/color][/CENTER]<br>' +
        "[CENTER]Ваша РП биография получает статус: [Color=Red]Отказано.[/color]<br>Причина: В названии вашей биографии и в пункте 1 различаются имя/фамилия."+
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/MpZsG4kg/9.png[/img][/url][/CENTER]' +
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/VLdnykBS/download-1.gif[/img][/url][/CENTER]' , 
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
{
      title: 'био отказ(18 лет)',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Ваша РП биография получает статус: [Color=Red]Отказано.[/color]<br>Причина отказа: минимальный возраст для составления биографии: 18 лет.[/CENTER][/FONT]" +
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/MpZsG4kg/9.png[/img][/url][/CENTER]' +
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/VLdnykBS/download-1.gif[/img][/url][/CENTER]' , 
    prefix: UNACCEPT_PREFIX,  
    status: false, 
    },
     {
      title: 'Не по форме',
      content:
		"[B][CENTER][COLOR=#FF0000][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        " [FONT=georgia] [B][CENTER]Ваша РП Биография получает статус<br><br>" +
		"[CENTER][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG]<br>"+
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/VLdnykBS/download-1.gif[/img][/url][/CENTER]' +
"[CENTER][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG]<br>"+
" [FONT=georgia] Причиной послужило написание РП Биографии не по форме<br>" , 
	  prefix: UNACCEPT_PREFIX,
	  status: false,
    },
	 {
      title: 'От 1-го лица',
      content:
		"[B][CENTER][COLOR=#FF0000][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        " [FONT=georgia] [B][CENTER]Ваша РП Биография получает статус<br><br>" +
		"[CENTER][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG]<br>"+
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/VLdnykBS/download-1.gif[/img][/url][/CENTER]' +
"[CENTER][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG]<br>"+
		" [FONT=georgia] Причиной послужило написание РП Биографии от 1-лица", 
	  prefix: UNACCEPT_PREFIX,
	  status: false,
    },
	 {
      title: 'Копипаст',
      content:
		"[B][CENTER][COLOR=#FF0000][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+        "[B][CENTER]Ваша РП Биография получает статус<br><br>" +
		"[CENTER][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG]<br>"+
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/VLdnykBS/download-1.gif[/img][/url][/CENTER]' + 
"[CENTER][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG]<br>"+
		" [FONT=georgia] Причиной послужило копирование текста / темы<br>" , 
	  prefix: UNACCEPT_PREFIX,
	  status: false,
    },
	 {
      title: 'Дублирование',
      content:
		"[B][CENTER][COLOR=#FF0000][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        " [FONT=georgia] [B][CENTER]Ваша РП Биография получает статус<br><br>" +
		"[CENTER][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG]<br>"+
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/VLdnykBS/download-1.gif[/img][/url][/CENTER]' +
"[CENTER][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG]<br>"+
		" [FONT=georgia] Причиной послужило дублирование РП Биографии<br>" , 
	  prefix: UNACCEPT_PREFIX,
	  status: false,
    },
	 {
      title: 'Ошибки в словах',
      content:
		"[B][CENTER][COLOR=#FF0000][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        " [FONT=georgia] [B][CENTER]Ваша РП Биография получает статус<br><br>" +
		"[CENTER][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG]<br>"+
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/VLdnykBS/download-1.gif[/img][/url][/CENTER]' +
"[CENTER][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG]<br>"+
" [FONT=georgia] Причиной послужило написание РП Биографии с грамматическими / орфографическими ошибками<br>" , 
	  prefix: UNACCEPT_PREFIX,
	  status: false,
    },
	 {
      title: 'Заговолок',
      content:
		"[B][CENTER][COLOR=#FF0000][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        " [FONT=georgia] [B][CENTER]Ваша РП Биография получает статус<br><br>" +
		"[CENTER][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG]<br>"+
	'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/VLdnykBS/download-1.gif[/img][/url][/CENTER]' +
"[CENTER][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG]<br>"+
	" [FONT=georgia] Причиной послужило написание заговолка РП Биографии не по форме<br>" , 
		prefix: UNACCEPT_PREFIX,
	  status: false,
    },
	 {
      title: 'Нету имени родных',
      content:
		"[B][CENTER][COLOR=#FF0000][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        " [FONT=georgia] [B][CENTER]Ваша РП Биография получает статус<br><br>" +
		"[CENTER][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG]<br>"+
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/VLdnykBS/download-1.gif[/img][/url][/CENTER]' +
"[CENTER][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG]<br>"+
		" [FONT=georgia] Причиной послужило то, что вы не написали имя родителей и тд.<br>" , 
	  prefix: UNACCEPT_PREFIX,
	  status: false,
    },
	 {
	     title: '2 Био на 1 Акк',
      content:
		"[B][CENTER][COLOR=#FF0000][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        " [FONT=georgia] [B][CENTER]Ваша РП Биография получает статус<br><br>" +
		"[CENTER][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG]<br>"+
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/VLdnykBS/download-1.gif[/img][/url][/CENTER]' +
"[CENTER][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG]<br>"+
		" [FONT=georgia] Причиной послужило написание второй Биографии на один игровой аккаунт, что же запрещено правилами написаний РП Биографийы<br>" ,
	  prefix: UNACCEPT_PREFIX,
	  status: false,
    },
	 {
      title: 'Мало текста',
      content:
		"[B][CENTER][COLOR=#FF0000][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        " [FONT=georgia] [B][CENTER]Ваша РП Биография получает статус<br><br>" +
		"[CENTER][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG]<br>"+
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/VLdnykBS/download-1.gif[/img][/url][/CENTER]' +
"[CENTER][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG]<br>"+
" [FONT=georgia] Причиной послужило то, что Вы написали мало текста в своей РП Биографии<br>" , 
		prefix: UNACCEPT_PREFIX,
	  status: false,
    },
 
	 {
	  title: '-----  РП Ситуации  -------------------------------------------------------------------------------------------------------------------------------------',
	},
	 {
      title: 'Одобрено',
      content:
		"[B][CENTER][COLOR=#FF0000][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        " [FONT=georgia] [B][CENTER]Ваша РП Ситуация получает статус<br><br>" +
		"[CENTER][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG]<br>"+
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/BvPWW4LJ/download.gif[/img][/url][/CENTER]' +
"[I][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] Black Russia[/B][/COLOR] [/SIZE][/I][COLOR=rgb(0, 255, 127)][B][SIZE=1][/SIZE][/B][/COLOR]", 
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
	 {
      title: 'Отказано',
      content:
		"[B][CENTER][COLOR=#FF0000][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        " [FONT=georgia] [B][CENTER]Ваша РП Ситуация получает статус<br><br>" +
		"[CENTER][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG]<br>"+
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/VLdnykBS/download-1.gif[/img][/url][/CENTER]' +
"[CENTER][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG]<br>"+
		" [FONT=georgia] Причиной могло послужить любое нарушение Правил Написания РП Ситуации<br>" , 
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
	 
	 {
      title: 'Копипаст',
      content:
		"[B][CENTER][COLOR=#FF0000][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        " [FONT=georgia] [B][CENTER]Ваша РП Ситуация получает статус<br><br>" +
		"[CENTER][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG]<br>"+
	'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/VLdnykBS/download-1.gif[/img][/url][/CENTER]' +
"[CENTER][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG]<br>"+
	" [FONT=georgia] Причиной послужило копирование текста / темы<br>" , 
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
	 {
      title: 'Дублирование',
      content:
		"[B][CENTER][COLOR=#FF0000][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        " [FONT=georgia] [B][CENTER]Ваша РП Ситуация получает статус<br><br>" +
		"[CENTER][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG]<br>"+
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/VLdnykBS/download-1.gif[/img][/url][/CENTER]' +
"[CENTER][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG]<br>"+
		" [FONT=georgia] Причиной послужило дублирование темы<br>" , 
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
	 {
	  title: '-----  РП Организации  -------------------------------------------------------------------------------------------------------------------------------',
	},
	 {
      title: 'Одобрено',
      content:
		"[B][CENTER][COLOR=#FF0000][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        " [FONT=georgia] [B][CENTER]Ваша Неофициальная РП Организация получает статус<br><br>" +
		"[CENTER][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG]<br>"+
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/BvPWW4LJ/download.gif[/img][/url][/CENTER]' +
"[I][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] Black Russia[/B][/COLOR] [/SIZE][/I][COLOR=rgb(0, 255, 127)][B][SIZE=1][/SIZE][/B][/COLOR]", 
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
	 {
      title: 'Отказано',
      content:
		"[B][CENTER][COLOR=#FF0000][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        " [FONT=georgia] [B][CENTER]Ваша Неофициальная РП Организация получает статус<br><br>" +
		"[CENTER][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG]<br>"+
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/VLdnykBS/download-1.gif[/img][/url][/CENTER]' +
"[CENTER][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG]<br>"+
" [FONT=georgia] Причиной могло послужить любое нарушение Правил Подачи Заявления На Неофициальную РП Организацию<br>" , 
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
  
	 {
      title: 'Копипаст',
      content:
		"[B][CENTER][COLOR=#FF0000][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        " [FONT=georgia] [B][CENTER]Ваша Неофициальная РП Организация получает статус<br><br>" +
		"[CENTER][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG]<br>"+
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/VLdnykBS/download-1.gif[/img][/url][/CENTER]' +
"[CENTER][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG]<br>"+
" [FONT=georgia] Причиной послужило копирование текста / темы<br>"  , 
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
	 {
      title: 'Дублирование',
      content:
		"[B][CENTER][COLOR=#FF0000][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        " [FONT=georgia] [B][CENTER]Ваша Неофициальная РП Организация получает статус<br><br>" +
		"[CENTER][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG]<br>"+
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/VLdnykBS/download-1.gif[/img][/url][/CENTER]' , 
		
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
  ];
  $(document).ready(() => {
    // Загрузка скрипта для обработки шаблонов
    $('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');
 
    // Добавление кнопок при загрузке страницы
    addButton('Ответы', 'selectAnswer');
 
    // Поиск информации о теме
    const threadData = getThreadData();
 
    $('button#accepted').click(() => editThreadData(ACCEPT_PREFIX, false));
	$('button#unaccept').click(() => editThreadData(UNACCEPT_PREFIX, false));
	$('button#pin').click(() => editThreadData(PIN_PREFIX, true));
	$('button#close').click(() => editThreadData(CLOSE_PREFIX, false));
	$('button#rassmotreno').click(() => editThreadData(RASSMOTRENO_PREFIX, false));
	$('button#texy').click(() => editThreadData(TEX_PREFIX, true));
    $('button#ga').click(() => editThreadData(GA_PREFIX, true));
 
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
	} else  {
		fetch(`${document.URL}edit`, {
		  method: 'POST',
		  body: getFormData({
			prefix_id: prefix,
			title: threadTitle,
			pin: 1,
			_xfToken: XF.config.csrf,
			_xfRequestUri: document.URL.split(XF.config.url.fullBase)[1],
			_xfWithData: 1,
			_xfResponseType: 'json',
		  }),
		}).then(() => location.reload());
	}
 
 
 
 
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
	} else  {
		fetch(`${document.URL}edit`, {
		  method: 'POST',
		  body: getFormData({
			prefix_id: prefix,
			title: threadTitle,
			pin: 1,
			_xfToken: XF.config.csrf,
			_xfRequestUri: document.URL.split(XF.config.url.fullBase)[1],
			_xfWithData: 1,
			_xfResponseType: 'json',
		  }),
		}).then(() => location.reload());
		   }
 
 
function moveThread(prefix, type) {
// Получаем заголовок темы, так как он необходим при запросе
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
    }
})();