// ==UserScript==
// @name         Команда 1WMobile
// @namespace     https://forum.1wmobile.gg/*
// @version      1.2
// @description  Работа с форумом
// @author       Jordan Hercules
// @match         https://forum.1wmobile.gg/*
// @include       https://forum.1wmobile.gg/
// @grant        none
// @license 	 MIT
// @icon https://icons.iconarchive.com/icons/thesquid.ink/free-flat-sample/128/support-icon.png
// @downloadURL https://update.greasyfork.org/scripts/518741/%D0%9A%D0%BE%D0%BC%D0%B0%D0%BD%D0%B4%D0%B0%201WMobile.user.js
// @updateURL https://update.greasyfork.org/scripts/518741/%D0%9A%D0%BE%D0%BC%D0%B0%D0%BD%D0%B4%D0%B0%201WMobile.meta.js
// ==/UserScript==

(function () {
  'use strict';
const PIN_PREFIX = 2; // Prefix that will be set when thread pins
const RESHENO_PREFIX = 3;
const UNACCEPT_PREFIX = 4; // Prefix that will be set when thread closes
const ACCEPT_PREFIX = 5; // Prefix that will be set when thread solved
const COMMAND_PREFIX = 6; // Prefix that will be set when thread solved
const GA_PREFIX = 7;
const WATCHED_PREFIX = 9;
const buttons = [
    {
      title: '-----------------------------------------------------Администрации -----------------------------------------------------'
    },
    {
	  title: 'Взять жалобу на рассмотрение',
	  content:
'[CENTER][size=15px][font=Trebuchet MS][CENTER]Приветствую, уважаемый игрок [COLOR=rgb(255,200,0)] {{ user.mention }}[/color].[/size][/font][/CENTER]<br><br>' +
'[CENTER][size=15px][font=Trebuchet MS]Ваша жалоба получает Статус: [Color=rgb(255, 155 ,0)]На рассмотрении.[/color][/size][/font][/CENTER]<br><br>' +
'[CENTER][size=15px][font=Trebuchet MS][size=15px][font=Trebuchet MS]С уважением, Администрация [COLOR=rgb(0,0,255)]1WMobile[/color].[/size][/font][/CENTER]',
	  prefix: PIN_PREFIX,
    status: false,
    },
	{
	  title: 'ОДОБРЕНО',
	  content:
'[CENTER][size=15px][font=Trebuchet MS][CENTER]Приветствую, уважаемый [COLOR=rgb(255,200,0)] {{ user.mention }}[/color].[/size][/font][/CENTER]<br><br>' +
'[CENTER][size=15px][font=Trebuchet MS]Мы рассмотрели вашу жалобу и приняли решение [COLOR=rgb(0, 255, 0)]в вашу пользу[/COLOR][/size][/font][/CENTER]<br><br>' +
'[CENTER][size=15px][font=Trebuchet MS]Мы уже приняли соответствующие меры в отношение нарушителя, чтобы обеспечить справедливую игровую среду.[/size][/font][/CENTER]<br><br>' +
'[CENTER][size=15px][font=Trebuchet MS]Ваша активная позиция и участие в создании безопасного и приятного игрового опыта очень важны для нас. Спасибо за ваше участие. [/size][/font][/CENTER]<br><br>' +
'[CENTER][size=15px][font=Trebuchet MS][size=15px][font=Trebuchet MS]С уважением, Администрация [COLOR=rgb(0,0,255)]1WMobile[/color].[/size][/font][/CENTER]',
    },
    { title: 'Админ выдал наказание верно',
	  content:
'[CENTER][size=15px][font=Trebuchet MS][CENTER]Приветствую, уважаемый игрок [COLOR=rgb(255,200,0)] {{ user.mention }}[/color].[/size][/font][/CENTER]<br><br>' +
'[CENTER][size=15px][font=Trebuchet MS]После проведения расследования мы пришли к выводу, что в данной жалобе администратор выдал наказание верно.[/size][/font][/CENTER]<br><br>' +
'[CENTER][size=15px][font=Trebuchet MS][size=15px][font=Trebuchet MS]С уважением, Администрация [COLOR=rgb(0,0,255)]1WMobile[/color].[/size][/font][/CENTER]',
	prefix: UNACCEPT_PREFIX,
    status: false,
    },
    {
	  title: 'Админ не нарушает',
	  content:
'[CENTER][size=15px][font=Trebuchet MS][CENTER]Приветствую, уважаемый игрок [COLOR=rgb(255,200,0)] {{ user.mention }}[/color].[/size][/font][/CENTER]<br><br>' +
'[CENTER][size=15px][font=Trebuchet MS]После проведения расследования мы пришли к выводу, что в данной жалобе администратор не нарушает правила администрирования[/size][/font][/CENTER]<br><br>' +
'[CENTER][size=15px][font=Trebuchet MS][size=15px][font=Trebuchet MS]С уважением, Администрация [COLOR=rgb(0,0,255)]1WMobile[/color].[/size][/font][/CENTER]',
	prefix: UNACCEPT_PREFIX,
    status: false,
    },
    {
	  title: 'Админ выдал неверно/нету док-в на наказание',
	  content:
'[CENTER][size=15px][font=Trebuchet MS][CENTER]Приветствую, уважаемый игрок [COLOR=rgb(255,200,0)] {{ user.mention }}[/color].[/size][/font][/CENTER]<br><br>' +
'[CENTER][size=15px][font=Trebuchet MS]После проведения расследования мы пришли к выводу, что в данной жалобе администратор сделал неправильное решение.[/size][/font][/CENTER]<br><br>' +
'[CENTER][size=15px][font=Trebuchet MS]Администратор будет наказан. [/size][/font][/CENTER]<br><br>' +
'[CENTER][size=15px][font=Trebuchet MS][size=15px][font=Trebuchet MS]С уважением, Администрация [COLOR=rgb(0,0,255)]1WMobile[/color].[/size][/font][/CENTER]',
	prefix: UNACCEPT_PREFIX,
    status: false,
    },
    {
	  title: 'Амнистия отказ',
	  content:
'[CENTER][size=15px][font=Trebuchet MS][CENTER]Приветствую, уважаемый игрок [COLOR=rgb(255,200,0)] {{ user.mention }}[/color].[/size][/font][/CENTER]<br><br>' +
'[CENTER][size=15px][font=Trebuchet MS]Мы рассмотрели вашу жалобу и приняли решение [COLOR=rgb(255,0,0)]отказа в амнистии.[/color][/size][/font][/CENTER]<br><br>' +
'[CENTER][size=15px][font=Trebuchet MS]Наказание выдано по разумному решению, чтобы обеспечить справедливую игровую среду. [/size][/font][/CENTER]<br><br>' +
'[CENTER][size=15px][font=Trebuchet MS]Спасибо за ваше обращение, а так-же спасибо за понимание![/size][/font][/CENTER]<br><br>' +
'[CENTER][size=15px][font=Trebuchet MS][size=15px][font=Trebuchet MS]С уважением, Администрация [COLOR=rgb(0,0,255)]1WMobile[/color].[/size][/font][/CENTER]',
	prefix: UNACCEPT_PREFIX,
    status: false,
    },
    {
	  title: 'Амнистия в пользу игрока',
	  content:
'[CENTER][size=15px][font=Trebuchet MS][CENTER]Приветствую, уважаемый игрок [COLOR=rgb(255,200,0)] {{ user.mention }}[/color].[/size][/font][/CENTER]<br><br>' +
'[CENTER][size=15px][font=Trebuchet MS]Мы рассмотрели вашу жалобу и приняли решение амнистии [COLOR=rgb(0,255,0)]в вашу пользу.[/color][/size][/font][/CENTER]<br><br>' +
'[CENTER][size=15px][font=Trebuchet MS]Наказание выдано по разумному решению, чтобы обеспечить справедливую игровую среду. [/size][/font][/CENTER]<br><br>' +
'[CENTER][size=15px][font=Trebuchet MS]Наказание будет смягчено, чтобы обеспечить справедливую игровую среду. Спасибо за ваше участие![/size][/font][/CENTER]<br><br>' +
'[CENTER][size=15px][font=Trebuchet MS][size=15px][font=Trebuchet MS]С уважением, Администрация [COLOR=rgb(0,0,255)]1WMobile[/color].[/size][/font][/CENTER]',
	prefix: ACCEPT_PREFIX,
    status: false,
    },
    {
	  title: 'Жалоба пустышка',
	  content:
'[CENTER][size=15px][font=Trebuchet MS][CENTER]Приветствую, уважаемый игрок [COLOR=rgb(255,200,0)] {{ user.mention }}[/color].[/size][/font][/CENTER]<br><br>' +
'[CENTER][size=15px][font=Trebuchet MS]Просим вас составить новую жалобу с подробным описанием ситуации и предоставленными доказательствами.[/size][/font][/CENTER]<br><br>' +
'[CENTER][size=15px][font=Trebuchet MS][size=15px][font=Trebuchet MS]С уважением, Администрация [COLOR=rgb(0,0,255)]1WMobile[/color].[/size][/font][/CENTER]',
	prefix: UNACCEPT_PREFIX,
    status: false,
    },
];

  'use strictt';
const PIN_PREFIXx = 2;
const UNACCEPT_PREFIXx = 4;
const ACCEPT_PREFIXx = 5;


  $(document).ready(() => {
    // Загрузка скрипта для обработки шаблонов
    $('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');

const buttonss = [
         {
      title: '---------------------------------------------Раздел модерации форума---------------------------------------------'
    },
    {
	  title: 'Био одобрена',
	  content:
'[CENTER][size=15px][font=Trebuchet MS][CENTER]Приветствую, уважаемый игрок [COLOR=rgb(255,200,0)] {{ user.mention }}[/color].[/size][/font][/CENTER]<br><br>' +
'[CENTER][size=15px][font=Trebuchet MS]Ваша биография получает Статус: [Color=rgb(0,255,0)]Одобрено.[/color][/size][/font][/CENTER]<br><br>' +
'[CENTER][size=15px][font=Trebuchet MS][size=15px][font=Trebuchet MS]С уважением, Администрация  [COLOR=rgb(0,0,255)]1WMobile[/color].[/size][/font][/CENTER]',
	  prefix: ACCEPT_PREFIXx,
    status: false,
    },
    {
	  title: 'Био отказана',
	  content:
'[CENTER][size=15px][font=Trebuchet MS][CENTER]Приветствую, уважаемый игрок [COLOR=rgb(255,200,0)] {{ user.mention }}[/color].[/size][/font][/CENTER]<br><br>' +
'[CENTER][size=15px][font=Trebuchet MS]Ваша биография получает Статус: [Color=rgb(255, 0 ,0)]Отказано.[/color][/size][/font][/CENTER]<br><br>' +
'[CENTER][size=15px][font=Trebuchet MS][size=15px][font=Trebuchet MS]С уважением, Администрация  [COLOR=rgb(0,0,255)]1WMobile[/color].[/size][/font][/CENTER]',
	prefix: UNACCEPT_PREFIXx,
    status: false,
    },
    {
	  title: 'На рассмотрение био',
	  content:
'[CENTER][size=15px][font=Trebuchet MS][CENTER]Приветствую, уважаемый игрок [COLOR=rgb(255,200,0)] {{ user.mention }}[/color].[/size][/font][/CENTER]<br><br>' +
'[CENTER][size=15px][font=Trebuchet MS]Ваша биография получает Статус: [Color=rgb(255, 155 ,0)]На рассмотрении.[/color][/size][/font][/CENTER]<br><br>' +
'[CENTER][size=15px][font=Trebuchet MS][size=15px][font=Trebuchet MS]С уважением, Администрация  [COLOR=rgb(0,0,255)]1WMobile[/color].[/size][/font][/CENTER]',
	  prefix: PIN_PREFIXx,
    status: false,
    },
    {
	  title: 'Био от 3го лица',
	  content:
'[CENTER][size=15px][font=Trebuchet MS][CENTER]Приветствую, уважаемый игрок [COLOR=rgb(255,200,0)] {{ user.mention }}[/color].[/size][/font][/CENTER]<br><br>' +
'[CENTER][size=15px][font=Trebuchet MS]Ваша биография получает Статус: [Color=rgb(255, 00 ,0)]Отказано.[/color][/size][/font][/CENTER]<br><br>' +
'[CENTER][size=15px][font=Trebuchet MS]Причиной тому послужило: Ваша RP Биография написана не от 3го лица игрового персонажа.[/size][/font][/CENTER]<br><br>' +
'[CENTER][size=15px][font=Trebuchet MS][size=15px][font=Trebuchet MS]С уважением, Администрация  [COLOR=rgb(0,0,255)]1WMobile[/color].[/size][/font][/CENTER]',
	  prefix: UNACCEPT_PREFIXx,
    status: false,
    },
    {
	  title: 'Био не по форме',
	  content:
'[CENTER][size=15px][font=Trebuchet MS][CENTER]Приветствую, уважаемый игрок [COLOR=rgb(255,200,0)] {{ user.mention }}[/color].[/size][/font][/CENTER]<br><br>' +
'[CENTER][size=15px][font=Trebuchet MS]Ваша биография получает Статус: [Color=rgb(255, 00 ,0)]Отказано.[/color][/size][/font][/CENTER]<br><br>' +
'[CENTER][size=15px][font=Trebuchet MS]Причиной тому послужило: Ваша RP Биография была составлена не по форме. Пожалуйста ознакомьтесь с правилами написания RP биографии.[/size][/font][/CENTER]<br><br>' +
'[CENTER][size=15px][font=Trebuchet MS][size=15px][font=Trebuchet MS]С уважением, Администрация  [COLOR=rgb(0,0,255)]1WMobile[/color].[/size][/font][/CENTER]',
	  prefix: UNACCEPT_PREFIXx,
    status: false,
    },
];



$(document).ready(() => {
  // Загрузка скрипта для обработки шаблонов
  $("body").append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');

  // Добавление кнопок при загрузке страницы
  addButtons("ОТВЕТЫ НА РП БИО", "select");

  // Поиск информации о теме
  const threadData = getThreadDataa();

  $(`button#select`).click(() => {
    XF.alert(buttonMarkup(buttonss), null, "Выберите ответ:");
    buttonss.forEach((btn, id) => {
 if (id > 0) {
          $(`button#answers-${id}`).click(() => pasteContent(id, threadData, true));
        }
        else {
          $(`button#answers-${id}`).click(() => pasteContent(id, threadData, false));
        }
    });
  });
});
  function addButtons(name, id) {
    $('.button--icon--reply').before(
      `<button type="button" class="button--primary button " id="${id}" style="margin: 3px;">${name}</button>`,
    );
  }

function buttonMarkup(buttonss) {
  return `<div class="select_answer">${buttonss
    .map(
      (btn, i) =>
        `<button id="answers-${i}" class="button--primary button ` +
        `rippleButton" style="margin:5px"><span class="button-text">${btn.title}</span></button>`
    )
    .join("")}</div>`;
}

function pasteContents(id, data = {}, send = false) {
  const template = Handlebars.compile(buttonss[id].content);
  if ($(".fr-element.fr-view p").text() === "") $(".fr-element.fr-view p").empty();

  $("span.fr-placeholder").empty();
  $("div.fr-element.fr-view p").append(template(data));
  $("a.overlay-titleCloser").trigger("click");
   if (send == true) {
      editThreadData(buttonss[id].prefix, buttonss[id].status);
      $('.button--icon.button--icon--reply.rippleButton').trigger('click');
    }
}

function getThreadDataa() {
  const authorID = $("a.username")[0].attributes["data-user-id"].nodeValue;
  const authorName = $("a.username").html();
  const hours = new Date().getHours();
  return {
    user: {
      id: authorID,
      name: authorName,
      mention: `[USER=${authorID}]${authorName}[/USER]`,
    },
  };
}






    // Добавление кнопок при загрузке страницы
  
    addButton('ОТВЕТЫ НА ЖАЛОБЫ', 'selectAnswer');
    // Поиск информации о теме
    const threadData = getThreadData();


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
      `<button type="button" class="button--primary button button--icon button--icon--reply rippleButton" id="${id}" style="margin: 3px;">${name}</button>`,
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