// ==UserScript==
// @name         Скрипт для КФ 
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  Скрипт для Кураторам Форума
// @author       Rayn Rey
// @match        https://forum.blackrussia.online/threads/*
// @icon         none
// @grant        none
// @license    MIT
// @downloadURL https://update.greasyfork.org/scripts/536206/%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%9A%D0%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/536206/%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%9A%D0%A4.meta.js
// ==/UserScript==
 
(function () {
  'use strict';
const UNACCСEPT_PREFIX = 4; // Prefix that will be set when thread closes
const ACCСEPT_PREFIX = 8; // Prefix that will be set when thread accepted
const RESHENO_PREFIX = 6; // Prefix that will be set when solving the problem
const PINN_PREFIX = 2; // Prefix that will be set when thread pins
const GA_PREFIX = 12; // Prefix that will be set when thread send to ga
const COMMAND_PREFIX = 10; // Prefix that will be set when thread send to project team
const WATCHED_PREFIX = 9;
const CLOSE_PREFIX = 7;
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
const buttons = [	
     {	 
    	  title: '|(-(-(-(-(->╴RolePlay Биографии ╴<-)-)-)-)-)-|'
},
{
        	  title: '| Био одобрена |',
	  content:
	    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/img][/url]<br>' +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша Биография получает статус - [COLOR=#00FF00]Одобрено[/COLOR]<br><br>"+
                "[B][CENTER][COLOR=BLUE]С уважением [/COLOR][COLOR=BLUE]Главный Куратор Форума.[/COLOR]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url]<br>",
    prefix: ACCСEPT_PREFIX,
	  status: false,
},
  {
    	  title: '| Био отказ (Форма) |',
	  content:
	    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/img][/url]<br>' +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша Биография получает статус - [COLOR=#FF0000]Отказано[/COLOR], Причиной отказа послужило нарушение Правила написания RP биографии <br><br>"+
                "[B][CENTER][COLOR=lavender]Убедительная просьба ознакомиться с правилами подачи Биографий, закрепленные в данном разделе.<br>"+
                "[B][CENTER][COLOR=BLUE]С уважением [/COLOR][COLOR=BLUE]Главный Куратор Форума.[/COLOR]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url]<br>",
     prefix: UNACCСEPT_PREFIX,
	  status: false,
},
  {
          	  title: '| Био отказ (Мало инфы) |',
	  content:
	    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/img][/url]<br>' +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша Биография получает статус - [COLOR=#FF0000]Отказано[/COLOR], Причиной отказа послужило - Недостаточно количество RolePlay информации о вашем персонаже. <br><br>"+
                "[B][CENTER][COLOR=lavender]Убедительная просьба ознакомиться с правилами подачи Биографий, закрепленные в данном разделе.<br>"+
                "[B][CENTER][COLOR=BLUE]С уважением [/COLOR][COLOR=BLUE]Главный Куратор Форума.[/COLOR]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url]<br>",
     prefix: UNACCСEPT_PREFIX,
	  status: false,
},
  {
                	  title: '| Био отказ (Скопирована) |',
	  content:
	    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/img][/url]<br>' +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша Биография получает статус - [COLOR=#FF0000]Отказано[/COLOR], Причиной отказа послужило - Биография скопирована <br><br>"+
                "[B][CENTER][COLOR=lavender]Убедительная просьба ознакомиться с правилами подачи Биографий, закрепленные в данном разделе.<br>"+
                "[B][CENTER][COLOR=BLUE]С уважением [/COLOR][COLOR=BLUE]Главный Куратор Форума.[/COLOR]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url]<br>",
     prefix: UNACCСEPT_PREFIX,
	  status: false,
},
  {
                	  title: '| Био отказ (Заголовок) |',
	  content:
	    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/img][/url]<br>' +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша Биография получает статус - [COLOR=#FF0000]Отказано[/COLOR], Причиной отказа послужило - Неправильное написание заголовка биографии. <br><br>"+
                "[B][CENTER][COLOR=lavender]Убедительная просьба ознакомиться с правилами подачи Биографий, закрепленные в данном разделе.<br>"+
                "[B][CENTER][COLOR=BLUE]С уважением [/COLOR][COLOR=BLUE]Главный Куратор Форума.[/COLOR]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url]<br>",
     prefix: UNACCСEPT_PREFIX,
	  status: false,
},
  {
                	  title: '| Био отказ (1-ое лицо) |',
	  content:
	    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/img][/url]<br>' +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша Биография получает статус - [COLOR=#FF0000]Отказано[/COLOR], Причиной отказа послужило - Написание Биографии от 1-го лица. <br><br>"+
                "[B][CENTER][COLOR=lavender]Убедительная просьба ознакомиться с правилами подачи Биографий, закрепленные в данном разделе.<br>"+
                "[B][CENTER][COLOR=BLUE]С уважением [/COLOR][COLOR=BLUE]Главный Куратор Форума.[/COLOR]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url]<br>",
     prefix: UNACCСEPT_PREFIX,
	  status: false,
},
  {
                	  title: '| Био отказ (Возраст не совпал) |',
	  content:
	    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/img][/url]<br>' +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша Биография получает статус - [COLOR=#FF0000]Отказано[/COLOR], Причиной отказа послужило - Возраст не совпадает с датой рождения. <br><br>"+
                "[B][CENTER][COLOR=lavender]Убедительная просьба ознакомиться с правилами подачи Биографий, закрепленные в данном разделе.<br>"+
                "[B][CENTER][COLOR=BLUE]С уважением [/COLOR][COLOR=BLUE]Главный Куратор Форума.[/COLOR]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url]<br>",
     prefix: UNACCСEPT_PREFIX,
	  status: false,
},
  {
                	  title: '| Био отказ (Возраст) |',
	  content:
	    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/img][/url]<br>' +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша Биография получает статус - [COLOR=#FF0000]Отказано[/COLOR], Причиной отказа послужило - Возраст слишком мал. <br><br>"+
                "[B][CENTER][COLOR=lavender]Убедительная просьба ознакомиться с правилами подачи Биографий, закрепленные в данном разделе.<br>"+
                "[B][CENTER][COLOR=BLUE]С уважением [/COLOR][COLOR=BLUE]Главный Куратор Форума.[/COLOR]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url]<br>",
     prefix: UNACCСEPT_PREFIX,
	  status: false,
},
  {
                	  title: '| Био отказ (Ошибки) |',
	  content:
	    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/img][/url]<br>' +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша Биография получает статус - [COLOR=#FF0000]Отказано[/COLOR], Причиной отказа послужило большое количество ошибок. <br><br>"+
                "[B][CENTER][COLOR=lavender]Убедительная просьба ознакомиться с правилами подачи Биографий, закрепленные в данном разделе.<br>"+
                "[B][CENTER][COLOR=BLUE]С уважением [/COLOR][COLOR=BLUE]Главный Куратор Форума.[/COLOR]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url]<br>",
     prefix: UNACCСEPT_PREFIX,
	  status: false,
},
 
 
];
 
 
 
 $(document).ready(() => {
    // Загрузка скрипта для обработки шаблонов
    $('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');
 
    // Добавление кнопок при загрузке страницы
    addButton('На рассмотрение💫', 'pin');
    addButton('Важно💥', 'Vajno');
    addButton('Команде Проекта💥', 'teamProject');
    addButton('ГА', 'Ga');
    addButton('Спецу💥', 'Spec');
    addButton('Одобрено✅', 'accepted');
    addButton('Отказано⛔', 'unaccept');
    addButton('Теху', 'Texy');
    addButton('Решено✅', 'Resheno');
    addButton('Закрыто⛔', 'Zakrito');
    addButton('Реализовано💫', 'Realizovano');
    addButton('Рассмотрено✅', 'Rassmotreno');
    addButton('Ожидание', 'Ojidanie');
    addButton('Без префикса⛔', 'Prefiks');
    addButton('Проверено контролем качества', 'Kachestvo');
    addButton('Ответ💥', 'selectAnswer');
 
    // Поиск информации о теме
    const threadData = getThreadData();
 
    $('button#pin').click(() => editThreadData(PINN_PREFIX, true));
    $('button#accepted').click(() => editThreadData(ACCСEPT_PREFIX, false));
    $('button#Ga').click(() => editThreadData(GA_PREFIX, true));
    $('button#Spec').click(() => editThreadData(SPECY_PREFIX, true));
    $('button#teamProject').click(() => editThreadData(COMMAND_PREFIX, true));
    $('button#unaccept').click(() => editThreadData(UNACCСEPT_PREFIX, false));
    $('button#Texy').click(() => editThreadData(TEXY_PREFIX, false));
    $('button#Resheno').click(() => editThreadData(RESHENO_PREFIX, false));
    $('button#Zakrito').click(() => editThreadData(CLOSE_PREFIX, false));
    $('button#Realizovano').click(() => editThreadData(REALIZOVANO_PREFIX, false));
    $('button#Vajno').click(() => editThreadData(VAJNO_PREFIX, false));
    $('button#Rassmotreno').click(() => editThreadData(RASSMOTRENO_PREFIX, false));
    $('button#Ojidanie').click(() => editThreadData(OJIDANIE_PREFIX, false));
    $('button#Prefiks').click(() => editThreadData(PREFIKS, false));
    $('button#Kachestvo').click(() => editThreadData(KACHESTVO, false));
 
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