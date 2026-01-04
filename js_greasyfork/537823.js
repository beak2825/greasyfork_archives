// ==UserScript==
// @name         Шаблоны для лидеров Кемерово
// @namespace    https://vk.com/kaito_maniero
// @version      1.0.1
// @description  Скрипт с шаблонами для лидеров на форуме BlackRussia (Кемерово)
// @author       Kaito Maniero
// @match        https://forum.blackrussia.online/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/537823/%D0%A8%D0%B0%D0%B1%D0%BB%D0%BE%D0%BD%D1%8B%20%D0%B4%D0%BB%D1%8F%20%D0%BB%D0%B8%D0%B4%D0%B5%D1%80%D0%BE%D0%B2%20%D0%9A%D0%B5%D0%BC%D0%B5%D1%80%D0%BE%D0%B2%D0%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/537823/%D0%A8%D0%B0%D0%B1%D0%BB%D0%BE%D0%BD%D1%8B%20%D0%B4%D0%BB%D1%8F%20%D0%BB%D0%B8%D0%B4%D0%B5%D1%80%D0%BE%D0%B2%20%D0%9A%D0%B5%D0%BC%D0%B5%D1%80%D0%BE%D0%B2%D0%BE.meta.js
// ==/UserScript==
(function() {
    'use strict';
const ACCEPT_PREFIX = 0; // Prefix that will be set when thread accepted
const RESHENO_PREFIX = 0; // Prefix that will be set when solving the problem
const PIN_PREFIX = 0; // Prefix that will be set when thread pins
const GA_PREFIX = 0; // Prefix that will be set when thread send to ga
const COMMAND_PREFIX = 0; // Prefix that will be set when thread send to project team
const CLOSE_PREFIX = 0; // Prefix that will be set when thread closes.
const VAJNO_PREFIX = 0;
const WATCHED_PREFIX = 0;
const TEX_PREFIX = 0;
const PREFIKS = 0;
const OTKAZRP_PREFIX = 0;
const ODOBRENORP_PREFIX = 0;
const NARASSMOTRENIIRP_PREFIX = 0;
const NARASSMOTRENIIORG_PREFIX = 0;
const buttons = [
 {
	  title: '| НА РАССМОТРЕНИЕ |',
	  content:
"[URL='https://postimages.org/'][IMG]https://i.postimg.cc/kM2WMSML/f3eabafac57241f0ac0dd6776a1c00ff.gif[/IMG][/URL]<br>" +
"[CENTER][URL='https://postimages.org/'][IMG]https://i.postimg.cc/bY5dmFhB/RLwzo.png[/IMG][/URL]<br>" +
     "[SIZE=19][FONT=georgia][I][B][COLOR=rgb(255, 0, 0)]{{ greeting }},уважаемый Пользователь.[/COLOR]<br>"+
"[URL='https://postimages.org/'][IMG]https://i.postimg.cc/bY5dmFhB/RLwzo.png[/IMG][/URL][/B][/I]<br>"+
     "[B][I]Ваша заявка взята на рассмотрение, не создавайте дубликатов и ожидайте ответа от автора сообщения.[/I][/B][/FONT][/SIZE]<br>"+
"[FONT=georgia][SIZE=18][B][I][COLOR=rgb(255, 0, 0)]На рассмотрении[/COLOR][/I][/B][/SIZE][/FONT][/CENTER]"
	},
  {
	  title: '| не по форме |',
	  content:
		"[URL='https://postimages.org/'][IMG]https://i.postimg.cc/kM2WMSML/f3eabafac57241f0ac0dd6776a1c00ff.gif[/IMG][/URL]<br>" +
"[CENTER][URL='https://postimages.org/'][IMG]https://i.postimg.cc/bY5dmFhB/RLwzo.png[/IMG][/URL]<br>" +
      "[CENTER][FONT=georgia][SIZE=18][B][I][COLOR=rgb(255, 0, 0)]{{ greeting }},уважаемый Пользователь. [/COLOR][/SIZE][/FONT][/CENTER][/B][/I]<br>"+
		"[CENTER][URL='https://postimages.org/'][IMG]https://i.postimg.cc/bY5dmFhB/RLwzo.png[/IMG][/URL]<br>" +
      "[I][B][CENTER][FONT=Georgio][SIZE=18][COLOR=FFFFFF] Вашa заявка составленa не по форме, пожалуйста ознакомьтесь с правилами подачи заявок.<br>"+

		'[CENTER][FONT=georgia][SIZE=18][B][I][COLOR=rgb(255, 0, 0)]Отказано[/COLOR][/SIZE][/FONT][/CENTER][/B][/I]',
	},
   {
	  title: '| Дубликат |',
	  content:
		"[URL='https://postimages.org/'][IMG]https://i.postimg.cc/kM2WMSML/f3eabafac57241f0ac0dd6776a1c00ff.gif[/IMG][/URL]<br>" +
"[CENTER][URL='https://postimages.org/'][IMG]https://i.postimg.cc/bY5dmFhB/RLwzo.png[/IMG][/URL]<br>" +
       "[CENTER][FONT=georgia][SIZE=18][B][I][COLOR=rgb(255, 0, 0)]{{ greeting }},уважаемый Пользователь.[/COLOR][/SIZE][/FONT][/CENTER][/B][/I]<br>"+
       "[CENTER][URL='https://postimages.org/'][IMG]https://i.postimg.cc/bY5dmFhB/RLwzo.png[/IMG][/URL]<br>" +
		"[I][B][CENTER][FONT=Giorgio][SIZE=18][COLOR=FFFFFF]Вам уже был дан ответ в прошлой вашей заявке, пожалуйста перестаньте делать дубликаты, иначе ваш Форумный аккаунт  может быть заблокирован.<br>"+
		'[CENTER][FONT=georgia][SIZE=18][B][I][COLOR=rgb(255, 0, 0)]Отказано[/COLOR][/SIZE][/FONT][/CENTER][/B][/I]',

	},
	{
	  title: '| Уже был ответ |',
	  content:
		"[URL='https://postimages.org/'][IMG]https://i.postimg.cc/kM2WMSML/f3eabafac57241f0ac0dd6776a1c00ff.gif[/IMG][/URL]<br>" +
"[CENTER][URL='https://postimages.org/'][IMG]https://i.postimg.cc/bY5dmFhB/RLwzo.png[/IMG][/URL]<br>" +
        "[CENTER][FONT=georgia][SIZE=18][B][I][COLOR=rgb(255, 0, 0)]{{ greeting }},уважаемый Пользователь.[/COLOR][/SIZE][/FONT][/CENTER][/B][/I]<br>"+
        "[CENTER][URL='https://postimages.org/'][IMG]https://i.postimg.cc/bY5dmFhB/RLwzo.png[/IMG][/URL]<br>" +
		"[I][B][CENTER][FONT=Giorgio][SIZE=18][COLOR=FFFFFF]Вам был дан ответ в прошлой вашей заявке. Просьба не создавать дубликаты данной темы.<br>"+
		'[CENTER][FONT=georgia][SIZE=18][B][I][COLOR=rgb(255, 0, 0)]Отказано.[/COLOR][/SIZE][/FONT][/CENTER][/B][/I]',
	},
   {
	  title: '| Одобрено / жб на мл. сост. |',
	  content:
			"[URL='https://postimages.org/'][IMG]https://i.postimg.cc/kM2WMSML/f3eabafac57241f0ac0dd6776a1c00ff.gif[/IMG][/URL]<br>" +
"[CENTER][URL='https://postimages.org/'][IMG]https://i.postimg.cc/bY5dmFhB/RLwzo.png[/IMG][/URL]<br>" +
       "[CENTER][FONT=georgia][SIZE=18][B][I][COLOR=rgb(255, 0, 0)]{{ greeting }},уважаемый Пользователь.[/COLOR][/SIZE][/FONT][/CENTER][/B][/I]<br>"+
       "[CENTER][URL='https://postimages.org/'][IMG]https://i.postimg.cc/bY5dmFhB/RLwzo.png[/IMG][/URL]<br>" +
		"[I][B][CENTER][FONT=Giorgio][SIZE=18][COLOR=FFFFFF] Ваша заявка получает статус: Одобрено. Cотрудник получил наказание,либо был уволен из организации.<br>"+
		'[CENTER][FONT=georgia][SIZE=18][B][I][COLOR=rgb(255, 0, 0)]Одобрено[/COLOR][/SIZE][/FONT][/CENTER][/B][/I]',
	},
   {
	  title: '| Отказано жб на мл.сост. |',
	  content:
		"[URL='https://postimages.org/'][IMG]https://i.postimg.cc/kM2WMSML/f3eabafac57241f0ac0dd6776a1c00ff.gif[/IMG][/URL]<br>" +
"[CENTER][URL='https://postimages.org/'][IMG]https://i.postimg.cc/bY5dmFhB/RLwzo.png[/IMG][/URL]<br>" +
       "[CENTER][FONT=georgia][SIZE=18][B][I][COLOR=rgb(255, 0, 0)]{{ greeting }},уважаемый Пользователь.[/COLOR][/SIZE][/FONT][/CENTER][/B][/I]<br>"+
       "[CENTER][URL='https://postimages.org/'][IMG]https://i.postimg.cc/bY5dmFhB/RLwzo.png[/IMG][/URL]<br>" +
		"[I][B][CENTER][FONT=Giorgio][SIZE=18][COLOR=FFFFFF] Ваша заявка получает статус: Отказано. Не заметил нарушений со стороны сотрудника.<br>"+
		'[CENTER][FONT=georgia][SIZE=18][B][I][COLOR=rgb(255, 0, 0)]Отказано[/COLOR][/SIZE][/FONT][/CENTER][/B][/I]',
	},
   {
	  title: '| Одобрено / жб на ст. сост. |',
	  content:
		"[URL='https://postimages.org/'][IMG]https://i.postimg.cc/kM2WMSML/f3eabafac57241f0ac0dd6776a1c00ff.gif[/IMG][/URL]<br>" +
"[CENTER][URL='https://postimages.org/'][IMG]https://i.postimg.cc/bY5dmFhB/RLwzo.png[/IMG][/URL]<br>" +
       "[CENTER][FONT=georgia][SIZE=18][B][I][COLOR=rgb(255, 0, 0)]{{ greeting }},уважаемый Пользователь.[/COLOR][/SIZE][/FONT][/CENTER][/B][/I]<br>"+
       "[CENTER][URL='https://postimages.org/'][IMG]https://i.postimg.cc/bY5dmFhB/RLwzo.png[/IMG][/URL]<br>" +
		"[I][B][CENTER][FONT=Giorgio][SIZE=18][COLOR=FFFFFF] Ваша заявка одобрена,сотрудник получил наказание,или же был проинструктирован.<br>"+
		'[CENTER][FONT=georgia][SIZE=18][B][I][COLOR=rgb(255, 0, 0)]Одобрено[/COLOR][/SIZE][/FONT][/CENTER][/B][/I]',
	},
   {
	  title: '| Отказано жб на ст.сост. |',
	  content:
		"[URL='https://postimages.org/'][IMG]https://i.postimg.cc/kM2WMSML/f3eabafac57241f0ac0dd6776a1c00ff.gif[/IMG][/URL]<br>" +
"[CENTER][URL='https://postimages.org/'][IMG]https://i.postimg.cc/bY5dmFhB/RLwzo.png[/IMG][/URL]<br>" +
       "[CENTER][FONT=georgia][SIZE=18][B][I][COLOR=rgb(255, 0, 0)]{{ greeting }},уважаемый Пользователь.[/COLOR][/SIZE][/FONT][/CENTER][/B][/I]<br>"+
       "[CENTER][URL='https://postimages.org/'][IMG]https://i.postimg.cc/bY5dmFhB/RLwzo.png[/IMG][/URL]<br>" +
		"[I][B][CENTER][FONT=Giorgio][SIZE=18][COLOR=FFFFFF] Ваша заявка получает статус: Отказано. Не заметил нарушений со стороны сотрудника.<br>"+
		'[CENTER][FONT=georgia][SIZE=18][B][I][COLOR=rgb(255, 0, 0)]Отказано[/COLOR][/SIZE][/FONT][/CENTER][/B][/I]',
	},
   {
	  title: '| Одобрено / заявки вб/повышение и т.п. |',
	  content:
		"[URL='https://postimages.org/'][IMG]https://i.postimg.cc/kM2WMSML/f3eabafac57241f0ac0dd6776a1c00ff.gif[/IMG][/URL]<br>" +
"[CENTER][URL='https://postimages.org/'][IMG]https://i.postimg.cc/bY5dmFhB/RLwzo.png[/IMG][/URL]<br>" +
       "[CENTER][FONT=georgia][SIZE=18][B][I][COLOR=rgb(255, 0, 0)]{{ greeting }},уважаемый Пользователь. [/COLOR][/SIZE][/FONT][/CENTER][/B][/I]]<br>"+
       "[CENTER][URL='https://postimages.org/'][IMG]https://i.postimg.cc/bY5dmFhB/RLwzo.png[/IMG][/URL]<br>" +
		"[I][B][CENTER][FONT=Giorgio][SIZE=18][COLOR=FFFFFF] Ваша заявка одобрена,свяжитесь со мной в игре в течении 24 часов. <br>"+
		'[CENTER][FONT=georgia][SIZE=18][B][I][COLOR=rgb(255, 0, 0)]Одобрено[/COLOR][/SIZE][/FONT][/CENTER][/B][/I]',
	},

 {
	  title: '| Рассмотрено / Кабинет Полковника / шаблон под ваш текст. |',
	  content:
		"[URL='https://postimages.org/'][IMG]https://i.postimg.cc/kM2WMSML/f3eabafac57241f0ac0dd6776a1c00ff.gif[/IMG][/URL]<br>" +
"[CENTER][URL='https://postimages.org/'][IMG]https://i.postimg.cc/bY5dmFhB/RLwzo.png[/IMG][/URL]<br>" +
     "[CENTER][FONT=georgia][SIZE=5][B][I][COLOR=rgb(255, 0, 0)]{{ greeting }},уважаемый Пользователь.[/COLOR][/SIZE][/FONT][/CENTER][/B][/I]<br>"+
     "[CENTER][URL='https://postimages.org/'][IMG]https://i.postimg.cc/bY5dmFhB/RLwzo.png[/IMG][/URL]<br>" +
		"[I][B][CENTER][FONT=Giorgio][SIZE=18][COLOR=FFFFFF] Пишите сюда ваш текст. <br>"+
		'[CENTER][FONT=georgia][SIZE=18][B][I][COLOR=rgb(255, 0, 0)]Рассмотрено[/COLOR][/SIZE][/FONT][/CENTER][/B][/I]',
	},

];

$(document).ready(() => {
	// Загрузка скрипта для обработки шаблонов
	$('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');

	// Добавление кнопок при загрузке страницы
    addButton('📒 ШАБЛОНЧИКИ 📒', 'selectAnswer');

	// Поиск информации о теме
	const threadData = getThreadData();

	$('button#pin').click(() => editThreadData(PIN_PREFIX, false));
	$('button#accepted').click(() => editThreadData(ACCEPT_PREFIX, false));
	$('button#teamProject').click(() => editThreadData(COMMAND_PREFIX, false));
	$('button#unaccept').click(() => editThreadData(UNACCEPT_PREFIX, false));
    $('button#Zakrito').click(() => editThreadData(UNACCEPT_PREFIX, false));

	$(`button#selectAnswer`).click(() => {
		XF.alert(buttonsMarkup(buttons), null, 'Выберите ответ:');
		buttons.forEach((btn, id) => {
			if(id > 1) {
				$(`button#answers-${id}`).click(() => pasteContent(id, threadData, true));
			} else {
				$(`button#answers-${id}`).click(() => pasteContent(id, threadData, true));
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

	if(send == false){
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
	if(pin == false){
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