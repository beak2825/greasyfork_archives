// ==UserScript==
// @name         BLACK RUSSIA GOVERNMENT ORANGE
// @namespace    https://forum.blackrussia.online
// @version      1.37
// @description  BLACK RUSSIA ORANGE 
// @author      Pavel_Bewerly
// @match        https://forum.blackrussia.online/threads/*
// @grant        none
// @license      MIT
// @icon https://icons.iconarchive.com/icons/arturo-wibawa/akar/256/circle-alert-fill-icon.png
// @downloadURL https://update.greasyfork.org/scripts/469596/BLACK%20RUSSIA%20GOVERNMENT%20ORANGE.user.js
// @updateURL https://update.greasyfork.org/scripts/469596/BLACK%20RUSSIA%20GOVERNMENT%20ORANGE.meta.js
// ==/UserScript==
(function () {
  'use strict';
/*const UNACCEPT_PREFIX = 4;  Prefix that will be set when thread close
const ACCEPT_PREFIX = 8; Prefix that will be set when thread accepted
const PIN_PREFIX = 3; Префикс, который будет установлен при закреплении нити
const COMMAND_PREFIX = 10; Prefix that will be set when thread send to project team
const WATCHED_PREFIX = 9;
const CLOSE_PREFIX = 7; Prefix that will be set when thread closes.
const TEX_PREFIX = 13;
const GA_PREFIX = 12;
const V_PREFIX = 1;*/

const buttons = [
      {
      title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴Заявления ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
      title: '╴╴╴╴╴╴╴╴На рассмотрении ╴╴╴╴╴╴╴╴',
      content:
        '[CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемые кандидаты.[/I][/SIZE][/FONT][/COLOR][/CENTER]<br><br>' +
        "[CENTER][COLOR=rgb(209, 213, 216)][I][FONT=times new roman][SIZE=4]Заявления были закрыты на рассмотрение, ожидайте ответа в данной теме.[/SIZE][/FONT][/CENTER]<br><br>" +
        "[CENTER][FONT=times new roman][SIZE=4]Просьба не писать в личные сообщения о быстрой проверке заявок.[/SIZE][/FONT][/I][/COLOR]<br><br>" +
        '[CENTER][FONT=times new roman][SIZE=4][COLOR=rgb(209, 213, 216)][I]Приятной игры на BLACK RUSSIA [/I][/COLOR][I][COLOR=rgb(255, 165, 0)]ORANGE[/COLOR][/FONT][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4][I].[/I][/SIZE][/FONT][/COLOR][/CENTER]',
      status: true,
    },
    {
      title: '╴╴╴╴╴╴╴╴Донабор ╴╴╴╴╴╴╴╴',
      content:
        '[CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемые кандидаты.[/I][/SIZE][/FONT][/COLOR][/CENTER]<br><br>' +
        "[CENTER][COLOR=rgb(209, 213, 216)][I][FONT=times new roman][SIZE=4]Заявления были открыты на донабор кандидатов.[/SIZE][/FONT][/CENTER]<br><br>" +
        "[CENTER][FONT=times new roman][SIZE=4] Заявления будут рассмотрены как только наберется нужное количество кандидатов.[/SIZE][/FONT][/I][/COLOR]<br><br>" +
        '[CENTER][FONT=times new roman][SIZE=4][COLOR=rgb(209, 213, 216)][I]Приятной игры на BLACK RUSSIA [/I][/COLOR][I][COLOR=rgb(255, 165, 0)]ORANGE[/COLOR][/FONT][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4][I].[/I][/SIZE][/FONT][/COLOR][/CENTER]',
    },
	{
 title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴Одобрение жалобы ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
      title: 'Будет проведена беседа с заместителем',
      content:
		'[Color=White][SIZE=4][FONT=Georgia][CENTER][B]{{ greeting }}, уважаемый игрок.[/color][/SIZE][/CENTER][/B]' +
        '[Color=White][SIZE=4][FONT=Georgia][CENTER][B]Ваша жалоба была одобрена, с заместителем проведена беседа! Спасибо за информацию.[/color][/SIZE][/CENTER][/B]' +
		'[Color=Green][SIZE=4][FONT=Georgia][CENTER][B]Одобрено, закрыто.[/color][/SIZE][/CENTER][/B]' +
          "[I][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR][/I][COLOR=rgb(255, 165, 0)]ORANGE[/COLOR][/FONT]",
    },
    {
        title:'Будет проведена беседа с СС',
        content:
       '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        '[Color=White][SIZE=4][FONT=Georgia][CENTER][B]Ваша жалоба была одобрена, с депутатом проведена беседа! Спасибо за информацию.[/color][/SIZE][/CENTER][/B]' +
		'[Color=Green][SIZE=4][FONT=Georgia][CENTER][B]Одобрено, закрыто.[/color][/SIZE][/CENTER][/B]' +
          "[I][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR][/I][COLOR=rgb(255, 165, 0)]ORANGE[/COLOR][/FONT]",
        },
    {

     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴Отказ жалобы ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
        title:'Отсутствует /time',
        content:
       '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        '[Color=White][SIZE=4][FONT=Georgia][CENTER][B]На доказательствах отсуствует /time.[/color][/SIZE][/CENTER][/B]' +
		'[Color=Red][SIZE=4][FONT=Georgia][CENTER][B]Отказано, закрыто.[/color][/SIZE][/CENTER][/B]' +
          "[I][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR][/I][COLOR=rgb(255, 165, 0)]ORANGE[/COLOR][/FONT]",
    },
    {
        title:'Срок написания жалобы составляет два дня',
        content:
       '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        '[Color=White][SIZE=4][FONT=Georgia][CENTER][B]3.1. Срок написания жалобы составляет два дня (48 часов) с момента совершенного нарушения со стороны сотрудника сервера.[/color][/SIZE][/CENTER][/B]' +
		'[Color=Red][SIZE=4][FONT=Georgia][CENTER][B]Закрыто.[/color][/SIZE][/CENTER][/B]' +
           "[I][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR][/I][COLOR=rgb(255, 165, 0)]ORANGE[/COLOR][/FONT]",
    },
     {
        title:'Жалоба от 3-го лица',
        content:
       '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        '[Color=White][SIZE=4][FONT=Georgia][CENTER][B]3.3. Жалоба от третьего лица не принимается (жалоба должна быть подана участником ситуации).[/color][/SIZE][/CENTER][/B]' +
		'[Color=Red][SIZE=4][FONT=Georgia][CENTER][B]Закрыто.[/color][/SIZE][/CENTER][/B]' +
           "[I][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR][/I][COLOR=rgb(255, 165, 0)]ORANGE[/COLOR][/FONT]",
    },
     {
         title:'Отсутствуют доказательства',
        content:
       '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        '[Color=White][SIZE=4][FONT=Georgia][CENTER][B]В вашей жалобе отсутсвуют доказательства о нарушении сотрудников.[/color][/SIZE][/CENTER][/B]' +
		'[Color=Red][SIZE=4][FONT=Georgia][CENTER][B]Закрыто.[/color][/SIZE][/CENTER][/B]' +
               "[I][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR][/I][COLOR=rgb(255, 165, 0)]ORANGE[/COLOR][/FONT]",
    },
    {
        title:'Проверив доказательства от заместителя выговор были выданы верно',
        content:
       '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        '[Color=White][SIZE=4][FONT=Georgia][CENTER][B]Проверив опровержение заместителя, выговор вам был выдан верно.[/color][/SIZE][/CENTER][/B]' +
		'[Color=Red][SIZE=4][FONT=Georgia][CENTER][B]Отказано, закрыто.[/color][/SIZE][/CENTER][/B]' +
          "[I][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR][/I][COLOR=rgb(255, 165, 0)]ORANGE[/COLOR][/FONT]",
     },
     {
        title:'Ошибка разделом, Вам в жалобы на сотрудников',
        content:
       '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        '[Color=White][SIZE=4][FONT=Georgia][CENTER][B]Вы ошиблись разделом, ваш в жалобы на Младший Состав[/color][/SIZE][/CENTER][/B]' +
		'[Color=Red][SIZE=4][FONT=Georgia][CENTER][B]Отказано, закрыто.[/color][/SIZE][/CENTER][/B]' +
          "[I][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR][/I][COLOR=rgb(255, 165, 0)]ORANGE[/COLOR][/FONT]",
     },
     {
        title:'Ошибка разделом, Вам в жалобы на Старший Состав',
        content:
       '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        '[Color=White][SIZE=4][FONT=Georgia][CENTER][B]Вы ошиблись разделом, вам в жалобы на Старший Состав[/color][/SIZE][/CENTER][/B]' +
		'[Color=Red][SIZE=4][FONT=Georgia][CENTER][B]Отказано, закрыто.[/color][/SIZE][/CENTER][/B]' +
          "[I][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR][/I][COLOR=rgb(255, 165, 0)]ORANGE[/COLOR][/FONT]",
     },
    {
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴Правила Гос.Структур╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴Правительство╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
     {
      title: 'Запрещено выдавать лицензии без Role PLay отыгровок (одобрено)',
      content:
		'[Color=White][SIZE=4][FONT=Georgia][CENTER][B]{{ greeting }}, уважаемый игрок.[/color][/SIZE][/CENTER][/B]' +
        '[Color=White][SIZE=4][FONT=Georgia][CENTER][B]Так же вы будете проинструктированы по данному пункту правил: 3.01. Запрещена выдача лицензий без Role Play отыгровок.[/color][/SIZE][/CENTER][/B]' +
		'[Color=Green][SIZE=4][FONT=Georgia][CENTER][B]Одобрено, закрыто.[/color][/SIZE][/CENTER][/B]' +
           "[I][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR][/I][COLOR=rgb(255, 165, 0)]ORANGE[/COLOR][/FONT]",
    },
     {
      title: 'Запрещено выдавать лицензии без Role PLay отыгровок (отказано)',
      content:
		'[Color=White][SIZE=4][FONT=Georgia][CENTER][B]{{ greeting }}, уважаемый игрок.[/color][/SIZE][/CENTER][/B]' +
        '[Color=White][SIZE=4][FONT=Georgia][CENTER][B]Так же вы будете проинструктированы по данному пункту правил: 3.01. Запрещена выдача лицензий без Role Play отыгровок.[/color][/SIZE][/CENTER][/B]' +
		'[Color=Red][SIZE=4][FONT=Georgia][CENTER][B]Отказано, закрыто.[/color][/SIZE][/CENTER][/B]' +
           "[I][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR][/I][COLOR=rgb(255, 165, 0)]ORANGE[/COLOR][/FONT]",
    },
    {
      title: 'Запрещено оказывать услуги адвоката без Role PLay отыгровок (одобрено)',
      content:
		'[Color=White][SIZE=4][FONT=Georgia][CENTER][B]{{ greeting }}, уважаемый игрок.[/color][/SIZE][/CENTER][/B]' +
        '[Color=White][SIZE=4][FONT=Georgia][CENTER][B]Так же вы будете проинструктированы по данному пункту правил: 3.02. Запрещено оказание услуг адвоката без Role Play отыгровок.[/color][/SIZE][/CENTER][/B]' +
		'[Color=Green][SIZE=4][FONT=Georgia][CENTER][B]Одобрено, закрыто.[/color][/SIZE][/CENTER][/B]' +
          "[I][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR][/I][COLOR=rgb(255, 165, 0)]ORANGE[/COLOR][/FONT]",
    },
      {
      title: 'Запрещено оказывать услуги адвоката без Role PLay отыгровок (отказано)',
      content:
		'[Color=White][SIZE=4][FONT=Georgia][CENTER][B]{{ greeting }}, уважаемый игрок.[/color][/SIZE][/CENTER][/B]' +
        '[Color=White][SIZE=4][FONT=Georgia][CENTER][B]Так же вы будете проинструктированы по данному пункту правил: 3.02. Запрещено оказание услуг адвоката без Role Play отыгровок.[/color][/SIZE][/CENTER][/B]' +
		'[Color=Red][SIZE=4][FONT=Georgia][CENTER][B]Отказано, закрыто.[/color][/SIZE][/CENTER][/B]' +
            "[I][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR][/I][COLOR=rgb(255, 165, 0)]ORANGE[/COLOR][/FONT]",
      },
   ];
 
 
  $(document).ready(() => {
    // Загрузка скрипта для обработки шаблонов
    $('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');
 
    // Добавление кнопок при загрузке страницы
    addButton('🔗ОТВЕТЫ', 'selectAnswer');
 
    // Поиск информации о теме
    const threadData = getThreadData();
 
    $('button#pin').click(() => editThreadData(PIN_PREFIX, true));
    $('button#accepted').click(() => editThreadData(ACCEPT_PREFIX, false));
    $('button#Ga').click(() => editThreadData(GA_PREFIX, true));
    $('button#teamProject').click(() => editThreadData(COMMAND_PREFIX, true));
    $('button#unaccept').click(() => editThreadData(UNACCEPT_PREFIX, false));
    $('button#Texy').click(() => editThreadData(TEX_PREFIX, false));
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
        'Доброй ночи' ,
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