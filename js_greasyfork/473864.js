// ==UserScript==
// @name         NOVOSIBIRSK скрипт для ГС/ЗГС 
// @namespace    https://forum.blackrussia.online
// @version     3.0
// @description  NOVOSIBIRSK для ГС/ЗГС
// @author       I.Watson
// @match          https://forum.blackrussia.online/threads/*
// @license MIT
// @icon           https://forum.blackrussia.online/threads/
// @grant        none
// @icon         tbn0.gstatic.com/images?q=tbn:ANd9GcRgeBlAMtHufJKNxWuE5DJhTbp-tqs9gRdPmw&usqp=CAU
// @downloadURL https://update.greasyfork.org/scripts/473864/NOVOSIBIRSK%20%D1%81%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%93%D0%A1%D0%97%D0%93%D0%A1.user.js
// @updateURL https://update.greasyfork.org/scripts/473864/NOVOSIBIRSK%20%D1%81%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%93%D0%A1%D0%97%D0%93%D0%A1.meta.js
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
const OTKAZBIO_PREFIX = 4;
const ODOBRENOBIO_PREFIX = 8;
const NARASSMOTRENIIBIO_PREFIX = 2;
const OTKAZRP_PREFIX = 4;
const ODOBRENORP_PREFIX = 8;
const NARASSMOTRENIIRP_PREFIX = 2;
const OTKAZORG_PREFIX = 4;
const ODOBRENOORG_PREFIX = 8;
const NARASSMOTRENIIORG_PREFIX = 2;
const buttons = [
      {
      title: 'На рассмотрении...',
      content:	    "[B][CENTER][FONT=Georgia][SIZE=4][COLOR=White]Доброго времени суток уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/VNTPGQsQ/image2-3-1-1-1-10.gif[/img][/url]<br>' +
        '[Color=White][FONT=Georgia][SIZE=5][CENTER]Ваша жалоба взята[/color][Color=Orange][ICODE] на рассмотрение.<br>[/CENTER][CENTER][/ICODE][/color][Color=White] Ожидайте ответа и не создавайте копии данной темы.[/CENTER][/color]' + '[CENTER]  [/CENTER]',
      prefix: WATCHED_PREFIX,
      status: false,
    },
       {
      title: 'Одобрено',
       content:	    "[B][CENTER][FONT=Georgia][SIZE=4][COLOR=White]Доброго времени суток уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br><br>"+
    '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/VNTPGQsQ/image2-3-1-1-1-10.gif[/img][/url]<br>' +
    "[B][FONT=Georgia][SIZE=4][Color=White][CENTER] [Color=White]Будет проведена работа с лидером[/CENTER][/color][CENTER]  [/CENTER][B]"+
      '[Color=AQUA][CENTER]Спасибо за Ваше обращение!<br>Приятной игры.[/CENTER][/color]' +
        '[COLOR=LightGREEN][CENTER][ICODE]Одобрено,Закрыто [/ICODE][/CENTER][/COLOR]',
        prefix: WATCHED_PREFIX,
      status: false,
       },
       {
           title: '--------------------------------------------------->>>>>>>>>>>>>>>>>>Отказано<<<<<<<<<<<<<<<<<<---------------------------------------------------'
       },
    {
      title: 'Не явл.лидером',
      content:  "[B][CENTER][FONT=Georgia][SIZE=4][COLOR=White]Доброго времени суток уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br><br>"+
    '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/VNTPGQsQ/image2-3-1-1-1-10.gif[/img][/url]<br>' +
    "[B][FONT=Georgia][SIZE=4][Color=White][CENTER] [Color=White]Не является лидером.[/CENTER][/color][CENTER]  [/CENTER][B]"+
    "[B][FONT=Georgia][SIZE=4][Color=AQUA][CENTER] [Color=White]Спасибо за ваше обращение![/CENTER][/color][CENTER]  [/CENTER][B]"+
     '[Color=Red][FONT=Georgia][SIZE=5][CENTER][ICODE]Отказано, Закрыто.[/ICODE][/CENTER][/color]',
     prefix: WATCHED_PREFIX,
      status: false,
    },
     {
      title: 'Док-ва',
      content:  "[B][CENTER][FONT=Georgia][SIZE=4][COLOR=White]Доброго времени суток уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br><br>"+
    '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/VNTPGQsQ/image2-3-1-1-1-10.gif[/img][/url]<br>' +
    "[B][FONT=Georgia][SIZE=4][Color=White][CENTER] [Color=White]Не работают доказательства.[/CENTER][/color][CENTER]  [/CENTER][B]"+
    "[B][FONT=Georgia][SIZE=4][Color=AQUA][CENTER] [Color=White]Спасибо за ваше обращение![/CENTER][/color][CENTER]  [/CENTER][B]"+
      '[Color=Red][FONT=Georgia][SIZE=5][CENTER][ICODE]Отказано, Закрыто.[/ICODE][/CENTER][/color]',
      prefix: WATCHED_PREFIX,
      status: false,
    },
      {
      title: 'Отказ',
       content:  "[B][CENTER][FONT=Georgia][SIZE=4][COLOR=White]Доброго времени суток уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br><br>"+
    '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/VNTPGQsQ/image2-3-1-1-1-10.gif[/img][/url]<br>' +
    "[B][FONT=Georgia][SIZE=4][Color=AQUA][CENTER] [Color=White]Спасибо за ваше обращение![/CENTER][/color][CENTER]  [/CENTER][B]"+
     '[Color=Red][FONT=Georgia][SIZE=5][CENTER][ICODE]Отказано, Закрыто.[/ICODE][/CENTER][/color]',
     prefix: WATCHED_PREFIX,
      status: false,
    },
     {
      title: 'Время',
      content:  "[B][CENTER][FONT=Georgia][SIZE=4][COLOR=White]Доброго времени суток уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br><br>"+
    '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/VNTPGQsQ/image2-3-1-1-1-10.gif[/img][/url]<br>' +
    "[B][FONT=Georgia][SIZE=4][Color=White][CENTER] [Color=White]Прошло более 48 часов.[/CENTER][/color][CENTER]  [/CENTER][B]"+
    "[B][FONT=Georgia][SIZE=4][Color=AQUA][CENTER] [Color=White]Спасибо за ваше обращение![/CENTER][/color][CENTER]  [/CENTER][B]"+
     '[Color=Red][FONT=Georgia][SIZE=5][CENTER][ICODE]Отказано, Закрыто.[/ICODE][/CENTER][/color]',
     prefix: WATCHED_PREFIX,
      status: false,
    },
    {
      title: 'Не работают доказательства ',
      content:  "[B][CENTER][FONT=Georgia][SIZE=4][COLOR=White]Доброго времени суток уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br><br>"+
    '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/VNTPGQsQ/image2-3-1-1-1-10.gif[/img][/url]<br>' +
    "[B][FONT=Georgia][SIZE=4][Color=White][CENTER] [Color=White]Не работают доказательства.[/CENTER][/color][CENTER]  [/CENTER][B]"+
    "[B][FONT=Georgia][SIZE=4][Color=AQUA][CENTER] [Color=White]Спасибо за ваше обращение![/CENTER][/color][CENTER]  [/CENTER][B]"+
     '[Color=Red][FONT=Georgia][SIZE=5][CENTER][ICODE]Отказано, Закрыто.[/ICODE][/CENTER][/color]',
     prefix: WATCHED_PREFIX,
      status: false,
    },
     {
      title: '/time',
      content:  "[B][CENTER][FONT=Georgia][SIZE=4][COLOR=White]Доброго времени суток уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br><br>"+
    '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/VNTPGQsQ/image2-3-1-1-1-10.gif[/img][/url]<br>' +
    "[B][FONT=Georgia][SIZE=4][Color=White][CENTER] [Color=White]Нет /time.[/CENTER][/color][CENTER]  [/CENTER][B]"+
    "[B][FONT=Georgia][SIZE=4][Color=AQUA][CENTER] [Color=White]Спасибо за ваше обращение![/CENTER][/color][CENTER]  [/CENTER][B]"+
     '[Color=Red][FONT=Georgia][SIZE=5][CENTER][ICODE]Отказано, Закрыто.[/ICODE][/CENTER][/color]',
     prefix: WATCHED_PREFIX,
      status: false,
    },
     {
           title: '--------------------------------------------------->>>>>>>>>>>>>>>>>>Одобрено<<<<<<<<<<<<<<<<<<---------------------------------------------------'
       },
      {
      title: 'Снят',
      content:  "[B][CENTER][FONT=Georgia][SIZE=4][COLOR=White]Доброго времени суток уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br><br>"+
    '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/VNTPGQsQ/image2-3-1-1-1-10.gif[/img][/url]<br>' +
    "[B][FONT=Georgia][SIZE=4][Color=White][CENTER] [Color=White]Лидер будет снят со своего поста.[/CENTER][/color][CENTER]  [/CENTER][B]"+
    "[B][FONT=Georgia][SIZE=4][Color=AQUA][CENTER] [Color=White]Спасибо за ваше обращение![/CENTER][/color][CENTER]  [/CENTER][B]"+
      '[COLOR=LightGREEN][CENTER][ICODE]Одобрено,Закрыто [/ICODE][/CENTER][/COLOR]',
      prefix: WATCHED_PREFIX,
      status: false,
    },
      {
      title: 'Наказание',
      content:  "[B][CENTER][FONT=Georgia][SIZE=4][COLOR=White]Доброго времени суток уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br><br>"+
    '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/VNTPGQsQ/image2-3-1-1-1-10.gif[/img][/url]<br>' +
    "[B][FONT=Georgia][SIZE=4][Color=White][CENTER] [Color=White]Лидер получит соответствующее наказание.[/CENTER][/color][CENTER]  [/CENTER][B]"+
    "[B][FONT=Georgia][SIZE=4][Color=AQUA][CENTER] [Color=White]Спасибо за ваше обращение![/CENTER][/color][CENTER]  [/CENTER][B]"+
      '[COLOR=LightGREEN][CENTER][ICODE]Одобрено,Закрыто [/ICODE][/CENTER][/COLOR]',
      prefix: WATCHED_PREFIX,
      status: false,
    },
    {
          title: '- - - - - -  - - - - - - - - -  - - - - - - - - - - - - - - - - - - - Анти-Блат - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -',
    },
     {
      title: 'А/Б Одобрен',
      content:  "[B][CENTER][FONT=Georgia][SIZE=4][COLOR=White]Доброго времени суток уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br><br>"+
    '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/VNTPGQsQ/image2-3-1-1-1-10.gif[/img][/url]<br>' +
    '[B][FONT=Georgia][SIZE=4][Color=White][/color][CENTER] [Color=White]Анти-Блат на СС [Color=LightGreen][ICODE]Одобрен[/ICODE][/CENTER][/color][CENTER]  [/CENTER][B]',
    },
    {
      title: 'А/Б Отказ',
      content:  "[B][CENTER][FONT=Georgia][SIZE=4][COLOR=White]Доброго времени суток уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br><br>"+
    '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/VNTPGQsQ/image2-3-1-1-1-10.gif[/img][/url]<br>' +
    '[B][FONT=Georgia][SIZE=4][Color=White][/color][CENTER] [Color=White]Анти-Блат на СС [Color=Red][ICODE]Отказан[/ICODE][/CENTER][/color][CENTER]  [/CENTER][B]',
    },
    ];
  $(document).ready(() => {
    // Загрузка скрипта для обработки шаблонов
    $('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');
 
    // Добавление кнопок при загрузке страницы
    addButton('Ответы', 'selectAnswer');
 
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
      `<button type="button" class="button rippleButton" id="${id}" style="margin: 3px;">${name}</button>`
    );
  }
 
  function buttonsMarkup(buttons) {
    return `<div class="select_answer">${buttons
  .map(
  (btn, i) =>
    `<button id="answers-${i}" class="button--primary button ` +
    `rippleButton" style="margin:5px"><span class="button-text">${btn.title}</span></button>`
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