// ==UserScript==
// @name         Скрипт для лидеров/следящих форума ANAPA
// @namespace    http://tampermonkey.net/
// @version      3.15
// @description  По вопросам в ВК - https://vk.com/id859847308, туда же и по предложениям на улучшение скрипта)
// @author       Nekit_Donsckoy
// @match        https://forum.blackrussia.online/threads/*
// @icon         https://forum.blackrussia.online/data/avatars/o/11/11193.jpg?1680968342
// @grant        none
// @license    MIT
// @downloadURL https://update.greasyfork.org/scripts/537011/%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%BB%D0%B8%D0%B4%D0%B5%D1%80%D0%BE%D0%B2%D1%81%D0%BB%D0%B5%D0%B4%D1%8F%D1%89%D0%B8%D1%85%20%D1%84%D0%BE%D1%80%D1%83%D0%BC%D0%B0%20ANAPA.user.js
// @updateURL https://update.greasyfork.org/scripts/537011/%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%BB%D0%B8%D0%B4%D0%B5%D1%80%D0%BE%D0%B2%D1%81%D0%BB%D0%B5%D0%B4%D1%8F%D1%89%D0%B8%D1%85%20%D1%84%D0%BE%D1%80%D1%83%D0%BC%D0%B0%20ANAPA.meta.js
// ==/UserScript==

(function () {
    'use strict';
  const FAIL_PREFIX = 4;
  const OKAY_PREFIX = 8;
  const WAIT_PREFIX = 2;
  const TECH_PREFIX = 13;
  const WATCH_PREFIX = 9;
  const CLOSE_PREFIX = 7;
  const UNACCСEPT_PREFIX = 4;
  const PIN_PREFIX = 2; // Prefix that will be set when thread closes
  const ACCСEPT_PREFIX = 8; // Prefix that will be set when thread accepted
  const RESHENO_PREFIX = 6; // Prefix that will be set when solving the problem
  const PINN_PREFIX = 2; // Prefix that will be set when thread pins
  const GA_PREFIX = 12; // Prefix that will be set when thread send to ga
  const COMMAND_PREFIX = 10; // Prefix that will be set when thread send to project team
  const WATCHED_PREFIX = 9;
  const SPECY_PREFIX = 11;
  const TEXY_PREFIX = 13;
  const OJIDANIE_PREFIX = 14;
  const OTKAZBIO_PREFIX = 4;
  const ODOBRENOBIO_PREFIX = 8;
  const NARASSMOTRENIIBIO_PREFIX = 2;
  const REALIZOVANO_PREFIX = 5;
  const VAJNO_PREFIX = 1;
  const PREFIKS = 0;
  const KACHESTVO = 15;
  const RASSMOTRENO_PREFIX = 9;
  const OTKAZRP_PREFIX = 4;
  const ODOBRENORP_PREFIX = 8;
  const NARASSMOTRENIIRP_PREFIX = 2;
  const OTKAZORG_PREFIX = 4;
  const ODOBRENOORG_PREFIX = 8;
  const NARASSMOTRENIIORG_PREFIX = 2;

  const START_DECOR = `<div style="text-align: center"><span style="font-family: 'Courier New'">`
  const END_DECOR = `</span></div>`


  const buttons = [
   {
       title: '_______________________________________________✅️Статус одобрено✅️_______________________________________________'
    },
      {
     title: 'Рулетка',
	  content:

		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][COLOR=lavender][FONT=times new roman][Color=#ff0000][/color] У вас будет снято 25 баллов.[/color].[/CENTER][/B]<br><br>"+
      '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][COLOR=#ff0026] Одобрено.[/CENTER]<br><br>" +
         '[CENTER][CENTER][FONT=times new roman][COLOR=	#ffc6b4]С уважением by N.Donsckoy![/CENTER][/FONT]',
     },
      {
      title: 'Выговор',
	  content:

		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][COLOR=lavender][FONT=times new roman][Color=#ff0000][/color] У вас будет снято 40 баллов.[/color].[/CENTER][/B]<br><br>"+
        "[B][CENTER][COLOR=lavender][FONT=times new roman][Color=#ff0000][/color] Вам будет добавлен Иммунитет от выговора.[/color].[/CENTER][/B]<br><br>"+
      '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][COLOR=#ff0026] Одобрено.[/CENTER]<br><br>" +
         '[CENTER][CENTER][FONT=times new roman][COLOR=	#ffc6b4]С уважением by N.Donsckoy![/CENTER][/FONT]',
     },
      {
      title: 'Предупреждение',
	  content:

		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][COLOR=lavender][FONT=times new roman][Color=#ff0000][/color] У вас будет снято 30 баллов.[/color].[/CENTER][/B]<br><br>"+
        "[B][CENTER][COLOR=lavender][FONT=times new roman][Color=#ff0000][/color] Вам будет добавлен Иммунитет от предупреждения.[/color].[/CENTER][/B]<br><br>"+
      '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][COLOR=#ff0026] Одобрено.[/CENTER]<br><br>" +
         '[CENTER][CENTER][FONT=times new roman][COLOR=	#ffc6b4]С уважением by N.Donsckoy![/CENTER][/FONT]',
     },
      {
      title: 'Роспись',
	  content:

		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][COLOR=lavender][FONT=times new roman][Color=#ff0000][/color] У вас будет снято 20 баллов.[/color].[/CENTER][/B]<br><br>"+
        "[B][CENTER][COLOR=lavender][FONT=times new roman][Color=#ff0000][/color] У вас в течении 24 чалов распишутся ГС/ЗГС/С на форумном аккаунте.[/color].[/CENTER][/B]<br><br>"+
      '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][COLOR=#ff0026] Одобрено.[/CENTER]<br><br>" +
         '[CENTER][CENTER][FONT=times new roman][COLOR=	#ffc6b4]С уважением by N.Donsckoy![/CENTER][/FONT]',
     },
      {
      title: 'Банер',
	  content:

		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][COLOR=lavender][FONT=times new roman][Color=#ff0000][/color] У вас будет снято 25 баллов.[/color].[/CENTER][/B]<br><br>"+
        "[B][CENTER][COLOR=lavender][FONT=times new roman][Color=#ff0000][/color] Обратитесь к следящему вашей организации.[/color].[/CENTER][/B]<br><br>"+
      '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][COLOR=#ff0026] Одобрено.[/CENTER]<br><br>" +
         '[CENTER][CENTER][FONT=times new roman][COLOR=	#ffc6b4]С уважением by N.Donsckoy![/CENTER][/FONT]',
     },
      {
      title: 'Статус',
	  content:

		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][COLOR=lavender][FONT=times new roman][Color=#ff0000][/color] У вас будет снято 25 баллов.[/color].[/CENTER][/B]<br><br>"+
        "[B][CENTER][COLOR=lavender][FONT=times new roman][Color=#ff0000][/color] Обратитесь к следящему вашей организации.[/color].[/CENTER][/B]<br><br>"+
      '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][COLOR=#ff0026] Одобрено.[/CENTER]<br><br>" +
         '[CENTER][CENTER][FONT=times new roman][COLOR=	#ffc6b4]С уважением by N.Donsckoy![/CENTER][/FONT]',
     },
      {
       title: '_______________________________________________✅️Статус отказано✅️_______________________________________________'
    },
      {
      title: 'Нехватает быллов',
	  content:

		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][COLOR=lavender][FONT=times new roman][Color=#ff0000][/color] У вас не хватает баллов на преоюретение чего либо.[/color].[/CENTER][/B]<br><br>"+
      '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][COLOR=#ff0026] Отказано.[/CENTER]<br><br>" +
         '[CENTER][CENTER][FONT=times new roman][COLOR=	#ffc6b4]С уважением by N.Donsckoy![/CENTER][/FONT]',
     },
  ];

  $(document).ready(() => {
      // Загрузка скрипта для обработки шаблонов

      addButton('Ответы', 'selectAnswer');

      // Поиск информации о теме
      const threadData = getThreadData();

   $('button#pin').click(() => editThreadData(0, WAIT_PREFIX, true));
   $('button#tech').click(() => editThreadData(0, TECH_PREFIX, true));
   $('button#accepted').click(() => editThreadData(0, OKAY_PREFIX, false));
   $('button#watch').click(() => editThreadData(0, WATCH_PREFIX, false));
   $('button#close').click(() => editThreadData(0, CLOSE_PREFIX, false));
   $('button#unaccept').click(() => editThreadData(0, FAIL_PREFIX, false));
    $('button#pin').click(() => editThreadData(PINN_PREFIX, true));
    $('button#accepted').click(() => editThreadData(ACCСEPT_PREFIX, false));
    $('button#Ga').click(() => editThreadData(GA_PREFIX, true));
    $('button#Spec').click(() => editThreadData(SPECY_PREFIX, true));
    $('button#teamProject').click(() => editThreadData(COMMAND_PREFIX, true));
    $('button#unaccept').click(() => editThreadData(UNACCСEPT_PREFIX, false));
    $('button#Texy').click(() => editThreadData(TEXY_PREFIX, false));
     $('button#Rasmotreno').click(() => editThreadData(RASSMOTENO_PREFIX, false));
    $('button#Resheno').click(() => editThreadData(RESHENO_PREFIX, false));
    $('button#Zakrito').click(() => editThreadData(CLOSE_PREFIX, false));
    $('button#Realizovano').click(() => editThreadData(REALIZOVANO_PREFIX, false));
    $('button#Vajno').click(() => editThreadData(VAJNO_PREFIX, false));
    $('button#Rassmotreno').click(() => editThreadData(RASSMOTRENO_PREFIX, false));
    $('button#Ojidanie').click(() => editThreadData(OJIDANIE_PREFIX, false));
     $('button#pin').click(() => editThreadData(WAIT_PREFIX, true));

	$(`button#selectAnswer`).click(() => {
		XF.alert(buttonsMarkup(buttons), null, 'Выберите ответ:');
		buttons.forEach((btn, id) => {
			if(id > 1) {
				$(`button#answers-${id}`).click(() => pasteContent(id, threadData, true));
			} else {
				$(`button#answers-${id}`).click(() => pasteContent(id, threadData, false));
			}
		});
	});
  });

function addButton(name, id) {
$('.button--icon--reply').before(

            `<button type="button" class="button--primary button rippleButton" id="${id}" style="border-radius: 0px 20px; border-color: purple; border-style: dashed solid; margin-right: 7px; margin-bottom: 10px; background: purple; text-decoration-style: wavy;">${name}</button>`,
);
}

function buttonsMarkup(buttons) {
return `<div class="select_answer">${buttons
  .map(
	(btn, i) =>
	  `<button id="answers-${i}" class="button--primary button ` +
	  `rippleButton" style="border-radius: 10px; margin-right: 10px; margin-bottom: 10px"><span class="button-text; font-style: italic">${btn.title}</span></button>`,
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

})();