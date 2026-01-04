// ==UserScript==
// @name         Forum Script ГС/ЗГС 🦩
// @namespace    https://forum.blackrussia.online
// @version      2.0
// @description  Для ГС/ЗГС :)
// @author       Sogeking
// @match        https://forum.blackrussia.online/index.php?threads/*
// @include      https://forum.blackrussia.online/index.php?threads/
// @icon         https://sun9-north.userapi.com/sun9-78/s/v1/ig2/lmx7wrjUY9ADt1rLWlItXCFMfSeB-XL6s-iwGSmkVGGdaCr2PSQRrjphE1RyNlif8bVVOpdPV8fl3ifwf3dCY7Ll.jpg?size=1536x1536&quality=95&type=album
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/460398/Forum%20Script%20%D0%93%D0%A1%D0%97%D0%93%D0%A1%20%F0%9F%A6%A9.user.js
// @updateURL https://update.greasyfork.org/scripts/460398/Forum%20Script%20%D0%93%D0%A1%D0%97%D0%93%D0%A1%20%F0%9F%A6%A9.meta.js
// ==/UserScript==

(async function () {
    `use strict`;
    const UNACCEPT_PREFIX = 4; // Prefix that will be set when thread closes
    const ACCEPT_PREFIX = 8; // Prefix that will be set when thread accepted
    const PIN_PREFIX = 2; // Prefix that will be set when thread pins
    const COMMAND_PREFIX = 10; // Prefix that will be set when thread send to project team
    const WATCHED_PREFIX = 9;
    const CLOSE_PREFIX = 7;
    const data = await getThreadData(),
        greeting = data.greeting,
        user = data.user;
    const buttons = [
         {
      title: 'Приветствие',
      content: '[FONT=Courier New][CENTER]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br>' + '[CENTER]  [/CENTER][/FONT]',
    },
    {

   title: '- - - - - -  - - - - - - - - -  - - - - - - - - - - - - - - - - - Жалобы на лидеров - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -',
     },
        {
            title: `На рассмотрении`,
            content:
            "[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fy4k2Vjj/RvBD5.gif[/img][/url]<br>' +
        "[CENTER][COLOR=#ffff00][ICODE]Ваша жалоба взята на рассмотрение.<br>Ожидайте вынесения вердикта и не создавайте копии данной темы.[/ICODE][/CENTER][/COLOR]<br>" +
         '[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>'+
		'[Color=Orange][CENTER][ICODE]На рассмотрении...[/ICODE][/CENTER][/color]'+
        '[url=https://postimages.org/][img]https://i.postimg.cc/fy4k2Vjj/RvBD5.gif[/img][/url]',
            prefix: PIN_PREFIX,
            status: true,
        },
        {
            title: `Проведена беседа`,
            content:
           "[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fy4k2Vjj/RvBD5.gif[/img][/url]<br>' +
             "[CENTER][COLOR=#ffff00][ICODE] С лидером будет проведена профилактическая беседа.<br>Благодарим за ваше обращение![/icode][/CENTER][/COLOR]<br>"+
             '[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>'+
         '[Color=AQUA][CENTER][ICODE]Спасибо за Ваше обращение!<br>Приятной игры на NOVOSIBIRSK.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/fy4k2Vjj/RvBD5.gif[/img][/url]<br>'+
		'[Color=#ff00ff][CENTER][I][ICODE]Одобрено, закрыто.[/ICODE][/I][/CENTER][/color]',
               
            prefix: ACCEPT_PREFIX,
            status: false,
        },
        {
	  title: '| Нужен фрапс |',
	  content:
		 "[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fy4k2Vjj/RvBD5.gif[/img][/url]<br>' +
		"[CENTER][COLOR=#ffff00][ICODE]В данной ситуации обязательно должен быть фрапс (видео фиксация) всех моментов, в противном случае жалоба будет отказано.[/icode][/center][/COLOR]<br>"+
		 '[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>'+
        '[Color=AQUA][CENTER][ICODE]Спасибо за Ваше обращение!<br>Приятной игры на NOVOSIBIRSK.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/fy4k2Vjj/RvBD5.gif[/img][/url]<br>'+
		'[Color=#FF0000][CENTER][I][ICODE]Отказано, закрыто.[/ICODE][/I][/CENTER][/color]',
	  prefix: CLOSE_PREFIX,
	  status: false,
        },
        {
            title: `Получит наказание`,
            content:
            "[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
          '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fy4k2Vjj/RvBD5.gif[/img][/url]<br>' +
          '[CENTER][COLOR=#ffff00][ICODE]Лидер получит соответствующие наказание.[/ICODE][/CENTER][/COLOR]<br>' +
             '[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>'+
         '[Color=AQUA][CENTER][ICODE]Спасибо за Ваше обращение!<br>Приятной игры на NOVOSIBIRSK.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/fy4k2Vjj/RvBD5.gif[/img][/url]<br>'+
		'[Color=#ff00ff][CENTER][I][ICODE]Одобрено, закрыто.[/ICODE][/I][/CENTER][/color]',
            prefix: ACCEPT_PREFIX,
            status: false,
        },
        {
            title: `Жалоба не по форме`,
            content:
               "[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
          '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fy4k2Vjj/RvBD5.gif[/img][/url]<br>' +
                "[CENTER][COLOR=#ffff00][ICODE]Жалоба составлена не по форме. Внимательно прочитайте правила составления жалобы, которые закреплены в этом разделе.[/ICODE][/CENTER][/COLOR]<br>" +
                '[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>'+
         '[Color=AQUA][CENTER][ICODE]Спасибо за Ваше обращение!<br>Приятной игры на NOVOSIBIRSK.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/fy4k2Vjj/RvBD5.gif[/img][/url]<br>'+
		'[Color=#ff00ff][CENTER][I][ICODE]Отказано, закрыто.[/ICODE][/I][/CENTER][/color]',
            prefix: CLOSE_PREFIX,
            status: false,
        },
        {
            title: `В раздел ЖБ на сотрудников`,
            content:
             "[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
          '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fy4k2Vjj/RvBD5.gif[/img][/url]<br>' +
                `[CENTER][COLOR=#ffff00][ICODE]Ошиблись разделом,пожалуйста напишите свою жалобу в раздел «Жалобы на сотрудников»Х.[/ICODE][/CENTER][/COLOR]<br>` +
             '[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>'+
         '[Color=AQUA][CENTER][ICODE]Спасибо за Ваше обращение!<br>Приятной игры на NOVOSIBIRSK.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/fy4k2Vjj/RvBD5.gif[/img][/url]<br>'+
		'[Color=#ff00ff][CENTER][I][ICODE]Отказано, закрыто.[/ICODE][/I][/CENTER][/color]',
               
            prefix: CLOSE_PREFIX,
            status: false,
        },
        {
            title: ` Не являеться ЛД`,
            content:
              "[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
          '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fy4k2Vjj/RvBD5.gif[/img][/url]<br>' +
                `[CENTER][COLOR=#ffff00][ICODE]Данный игрок не являеться лидером.[/ICODE][/CENTER][/COLOR]<br>` +
               '[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>'+
         '[Color=AQUA][CENTER][ICODE]Спасибо за Ваше обращение!<br>Приятной игры на NOVOSIBIRSK.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/fy4k2Vjj/RvBD5.gif[/img][/url]<br>'+
		'[Color=#ff00ff][CENTER][I][ICODE]Отказано, закрыто.[/ICODE][/I][/CENTER][/color]',
            prefix: CLOSE_PREFIX,
            status: false,
        },
        {
     
            title: `Нарушении нет`,
            content:
              "[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
          '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fy4k2Vjj/RvBD5.gif[/img][/url]<br>' +
            `[CENTER][COLOR=#ffff00][ICODE]Исходя из выше приложенных доказательств,нарушение со стороны лидера - не имееться![/ICODE][/CENTER][/COLOR]<br>`+
          '[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
        '[Color=AQUA][CENTER][ICODE]Приятной игры на NOVOSIBIRSK.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/fy4k2Vjj/RvBD5.gif[/img][/url]<br>'+
        '[Color=#FF00FF][FONT=times new roman][CENTER][I][ICODE]Отказано, закрыто.[/ICODE][/I][/CENTER][/color][/FONT]',
            prefix: UNACCEPT_PREFIX,
            status: false,
        },
        {
        title: `Опра в соц.сети`,
        content:
            "[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fy4k2Vjj/RvBD5.gif[/img][/url]<br>'+
        "[CENTER][COLOR=#FFFF00][ICODE]3.6. Прикрепление доказательств обязательно. Примечание: загрузка доказательств в соц. сети (ВКонтакте, instagram) запрещается, доказательства должны быть загружены на фото/видео хостинги (YouTube, Япикс, imgur).[/ICODE][/COLOR][/CENTER]" +
		'[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
        '[Color=AQUA][CENTER][ICODE]Приятной игры на NOVOSIBIRSK.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/fy4k2Vjj/RvBD5.gif[/img][/url]<br>'+
        '[Color=#FF00FF][FONT=times new roman][CENTER][I][ICODE]Отказано, закрыто.[/ICODE][/I][/CENTER][/color][/FONT]',

    },
        {
            title: `Правила раздела`,
            content:
            "[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
          '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fy4k2Vjj/RvBD5.gif[/img][/url]<br>' +
            `[CENTER][COLOR=#FFFF00][ICODE]Пожалуйста, убедительная просьба, ознакомится с назначением данного раздела в котором Вы создали тему, так как ваш запрос никоим образом не относится к предназначению данного раздела.[/ICODE][/CENTER][/COLOR]`+
		    '[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
        '[Color=AQUA][CENTER][ICODE]Приятной игры на NOVOSIBIRSK.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/fy4k2Vjj/RvBD5.gif[/img][/url]<br>'+
        '[Color=#FF00FF][FONT=times new roman][CENTER][I][ICODE]Отказано, закрыто.[/ICODE][/I][/CENTER][/color][/FONT]',
            prefix: UNACCEPT_PREFIX,
            status:false,
        },
        {
        title: `Лидер был снят`,
        content:
            "[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
          '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fy4k2Vjj/RvBD5.gif[/img][/url]<br>' +
          `[CENTER][COLOR=#FFFF00][ICODE]Данный лидер был снят с поста.[/ICODE][/CENTER][/COLOR]`+
             '[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>'+
         '[Color=AQUA][CENTER][ICODE]Спасибо за Ваше обращение!<br>Приятной игры на NOVOSIBIRSK.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/fy4k2Vjj/RvBD5.gif[/img][/url]<br>'+
		'[Color=#ff00ff][CENTER][I][ICODE]Одобрено, закрыто.[/ICODE][/I][/CENTER][/color]',
           prefix: ACCEPT_PREFIX,
            status: false,
        },
        {
        title: `Недостаточно док-вы`,
        content:
              "[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
          '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fy4k2Vjj/RvBD5.gif[/img][/url]<br>' +
            `[CENTER][COLOR=#FFFF00][ICODE]Недостаточно доказательств, которые подтверждают нарушение лидера.[/ICODE][/CENTER][/COLOR]`+
            '[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
        '[Color=AQUA][CENTER][ICODE]Приятной игры на NOVOSIBIRSK.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/fy4k2Vjj/RvBD5.gif[/img][/url]<br>'+
        '[Color=#FF00FF][FONT=times new roman][CENTER][I][ICODE]Отказано, закрыто.[/ICODE][/I][/CENTER][/color][/FONT]',
                 prefix: UNACCEPT_PREFIX,
            status:false,
          }

  ];


    $(document).ready(() => {
        // Загрузка скрипта для обработки шаблонов
        $(`body`).append(`<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>`);

        // Добавление кнопок при загрузке страницы
        addButton(`На рассмотрение`, `pin`);
        addButton(`Одобрено`, `accepted`);
        addButton(`Отказано`, `unaccept`);
        addButton(`Ответы`, `selectAnswer`);


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