// ==UserScript==
// @name         ANAPA | Скрипт главным следящим
// @namespace    https://forum.blackrussia.online/
// @version      1.0
// @description  Скрипт для ответа на жалобы игроков | Black Russia Anapa
// @author       Angel_Dark
// @match        https://forum.blackrussia.online/threads/*
// @include      https://forum.blackrussia.online/threads/
// @grant        none
// @license      MIT
// @icon https://icons.iconarchive.com/icons/papirus-team/papirus-apps/48/emerald-theme-manager-icon-icon.png
// @downloadURL https://update.greasyfork.org/scripts/537438/ANAPA%20%7C%20%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B3%D0%BB%D0%B0%D0%B2%D0%BD%D1%8B%D0%BC%20%D1%81%D0%BB%D0%B5%D0%B4%D1%8F%D1%89%D0%B8%D0%BC.user.js
// @updateURL https://update.greasyfork.org/scripts/537438/ANAPA%20%7C%20%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B3%D0%BB%D0%B0%D0%B2%D0%BD%D1%8B%D0%BC%20%D1%81%D0%BB%D0%B5%D0%B4%D1%8F%D1%89%D0%B8%D0%BC.meta.js
// ==/UserScript==
(function () {
  'use strict';
const UNACCEPT_PREFIX = 4; // Prefix that will be set when thread closes
const ACCEPT_PREFIX = 8; // Prefix that will be set when thread accepted
const PIN_PREFIX = 2; // Prefix that will be set when thread pins
const COMMAND_PREFIX = 10; // Prefix that will be set when thread send to project team
const WATCHED_PREFIX = 9;
const CLOSE_PREFIX = 7; // Prefix that will be set when thread closes.
const TEX_PREFIX = 13;
const GA_PREFIX = 12;
const V_PREFIX = 1;
const buttons = [
          {
            title: '______________________________________________✅️Рассмотрения✅️_______________________________________________',
          },
         {
          title: 'Беседа',
          content:
           '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/I][/SIZE][/FONT][/COLOR]<br><br>' +

           "[*][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4]На первый раз будет проведена беседа.[/SIZE][/FONT][/COLOR]<br><br>" +
           "[*][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4]При повторных нарушениях лидер понесет наказание.[/SIZE][/FONT][/COLOR]<br><br>" +

           "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA ANAPA [/SIZE][/FONT][/COLOR][COLOR=rgb(0, 140, 240)][FONT=times new roman][SIZE=4]Role Play[/SIZE][/FONT][/COLOR][COLOR=rgb(0, 140, 240)][FONT=times new roman][SIZE=4].[/SIZE][/FONT][/COLOR][/I]<br><br>" +
           '[url=https://postimages.org/][img]https://i.yapx.cc/QY7Mg.gif[/img][/url]',
          prefix: ACCEPT_PREFIX,
          status: false,
         },
         {
          title: 'Есть нарушение',
          content:
           '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/I][/SIZE][/FONT][/COLOR]<br><br>' +

           "[*][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4]Лидер понесет соотвесьвующее наказание.[/SIZE][/FONT][/COLOR]<br><br>" +

           "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA ANAPA [/SIZE][/FONT][/COLOR][COLOR=rgb(0, 140, 240)][FONT=times new roman][SIZE=4]Role Play[/SIZE][/FONT][/COLOR][COLOR=rgb(0, 140, 240)][FONT=times new roman][SIZE=4].[/SIZE][/FONT][/COLOR][/I]<br><br>" +
           '[url=https://postimages.org/][img]https://i.yapx.cc/QY7Mg.gif[/img][/url]',
          prefix: ACCEPT_PREFIX,
          status: false,
         },
         {
          title : 'Нет нарушений'  ,
          content:
            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/I][/SIZE][/FONT][/COLOR]<br><br>' +
             "[COLOR=rgb(209, 213, 216)][SIZE=4][FONT=times new roman][I]Рассмотрев ваши доказательства, нарушений со стороны лидера не были замечены.[/FONT][/SIZE]<br><br>" +
             "[FONT=times new roman][SIZE=4][I]Просьба не создавать дубликаты этой темы, иначе ваш форумный аккаунт может быть заблокирован.[/I][/SIZE][/FONT][/COLOR]<br> <br>" +
             "[FONT=times new roman][SIZE=4][COLOR=rgb(209, 213, 216)][I]Приятной игры на BLACK RUSSIA ANAPA [/I][/COLOR][I][COLOR=rgb(0, 140, 240)]Role Play[/COLOR][/SIZE][/FONT][COLOR=rgb(0, 140, 240)][FONT=book antiqua][SIZE=4][I].[/SIZE][/FONT][/COLOR]<br><br>" +
             '[url=https://postimages.org/][img]https://s4.hostingkartinok.com/uploads/images/2013/05/1a612be953e1187f103dc4ae3f1d2b32.gif[/img][/url]',
          prefix: UNACCEPT_PREFIX,
          status: false,
         },
        {
            title: '______________________________________________✅️Перенаправление✅️_______________________________________________',
        },
        {
         title: 'Передаю ГА',
         content:
            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/I][/SIZE][/FONT][/COLOR]<br><br>' +
             "[COLOR=rgb(209, 213, 216)][I][FONT=times new roman][SIZE=4]Ваша жалоба переадресована [/SIZE][/FONT][/I][/COLOR][COLOR=rgb(255, 0, 0)][I][FONT=times new roman][SIZE=4]Главному администратору[/SIZE][/FONT][/I][/COLOR][COLOR=rgb(209, 213, 216)][I][FONT=times new roman][SIZE=4], ожидайте ответа в данной теме.[/SIZE][/FONT]<br><br>" +
             "[FONT=times new roman][SIZE=4]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/SIZE][/FONT][/I][/COLOR]<br><br>" +
             '[url=https://postimages.org/][img]https://i.servimg.com/u/f52/20/33/14/69/12.gif[/img][/url]',
         prefix: TEX_PREFIX,
         status: true,
        },
        {
         title: 'В ЖБ на адм',
         content:
            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/I][/SIZE][/FONT][/COLOR]<br><br>' +
              "[COLOR=rgb(209, 213, 216)][SIZE=4][FONT=times new roman][I]Вы ошиблись разделом, обратитесь в раздел жалоб на администрацию - [/I][URL='https://forum.blackrussia.online/index.php?forums/Жалобы-на-администрацию.1442/']*Нажмите сюда*[/URL][/FONT][/SIZE]<br><br>" +
              "[FONT=times new roman][SIZE=4][I]Просьба не создавать дубликаты данной темы в этом разделе, иначе ваш форумный аккаунт может быть заблокирован.[/I][/SIZE][/FONT][/COLOR]<br><br>" +
              "[FONT=book antiqua][SIZE=4][COLOR=rgb(209, 213, 216)][I]Приятной игры на BLACK RUSSIA ANAPA [/I][/COLOR][I][COLOR=rgb(0, 140, 240)]Role Play[/COLOR][/I][/SIZE][/FONT][COLOR=rgb(0, 140, 240)][FONT=book antiqua][SIZE=4][I].[/I][/SIZE][/FONT][/COLOR]<br><br>" +
              '[url=https://postimages.org/][img]https://sun9-13.userapi.com/c627229/v627229095/1dbf2/niBXXem02v4.jpg[/img][/url]',
         prefix: UNACCEPT_PREFIX,
         status: false,
        },
        {
         title: 'В ЖБ на Хелперов',
         content:
            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/I][/SIZE][/FONT][/COLOR]<br><br>' +
              "[COLOR=rgb(209, 213, 216)][SIZE=4][FONT=times new roman][I]Вы ошиблись разделом, обратитесь в раздел жалоб на Агентов поддержки - [/I][URL='https://forum.blackrussia.online/index.php?threads/ekb-Жалобы-на-Агентов-Поддержки.4295218/']*Нажмите сюда*[/URL][/FONT][/SIZE]<br><br>" +
              "[FONT=times new roman][SIZE=4][I]Просьба не создавать дубликаты данной темы в этом разделе, иначе ваш форумный аккаунт может быть заблокирован.[/I][/SIZE][/FONT][/COLOR]<br><br>" +
              "[FONT=book antiqua][SIZE=4][COLOR=rgb(209, 213, 216)][I]Приятной игры на BLACK RUSSIA ANAPA [/I][/COLOR][I][COLOR=rgb(0, 140, 240)]Role Play[/COLOR][/I][/SIZE][/FONT][COLOR=rgb(0, 140, 240)][FONT=book antiqua][SIZE=4][I].[/I][/SIZE][/FONT][/COLOR]<br><br>" +
              '[COLOR=rgb(255, 0, 0)][SIZE=4][FONT=times new roman][I]Отказано.[/I][/FONT][/SIZE][/COLOR]',
         prefix: UNACCEPT_PREFIX,
         status: false,
        },
        {
         title: 'В ЖБ на сотрудников',
         content:
            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/I][/SIZE][/FONT][/COLOR]<br><br>' +
             "[COLOR=rgb(209, 213, 216)][SIZE=4][FONT=times new roman][I]Обратитесь в раздел на старший состав фракции. [/FONT][/SIZE]<br><br>" +
             "[FONT=times new roman][SIZE=4][I]Просьба не создавать дубликаты данной темы в этом разделе, иначе ваш форумный аккаунт может быть заблокирован.[/I][/SIZE][/FONT][/COLOR]<br><br>" +
             "[FONT=book antiqua][SIZE=4][COLOR=rgb(209, 213, 216)][I]Приятной игры на BLACK RUSSIA ANAPA [/I][/COLOR][I][COLOR=rgb(0, 140, 240)]Role Play[/COLOR][/I][/SIZE][/FONT][COLOR=rgb(0, 140, 240)][FONT=book antiqua][SIZE=4][I].[/I][/SIZE][/FONT][/COLOR]<br><br>",
         prefix: UNACCEPT_PREFIX,
         status: false,
        },
        {
         title: 'В ЖБ на сотрудников',
         content:
            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/I][/SIZE][/FONT][/COLOR]<br><br>' +
             "[COLOR=rgb(209, 213, 216)][SIZE=4][FONT=times new roman][I]Обратитесь в раздел на сотрудников фракции. [/FONT][/SIZE]<br><br>" +
             "[FONT=times new roman][SIZE=4][I]Просьба не создавать дубликаты данной темы в этом разделе, иначе ваш форумный аккаунт может быть заблокирован.[/I][/SIZE][/FONT][/COLOR]<br><br>" +
             "[FONT=book antiqua][SIZE=4][COLOR=rgb(209, 213, 216)][I]Приятной игры на BLACK RUSSIA ANAPA [/I][/COLOR][I][COLOR=rgb(0, 140, 240)]Role Play[/COLOR][/I][/SIZE][/FONT][COLOR=rgb(0, 140, 240)][FONT=book antiqua][SIZE=4][I].[/I][/SIZE][/FONT][/COLOR]<br><br>" +
             '[url=https://postimages.org/][img]https://i.yapx.cc/OBTvg.jpg[/img][/url]',
         prefix: UNACCEPT_PREFIX,
         status: false,
        },
        {
          title: 'В обжалование наказаний',
          content:
            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/I][/SIZE][/FONT][/COLOR]<br><br>' +
             "[COLOR=rgb(209, 213, 216)][SIZE=4][FONT=times new roman][I]Вы ошиблись разделом, обратитесь в раздел Обжалование наказаний - [/I][URL='https://forum.blackrussia.online/index.php?forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%BB%D0%B8%D0%B4%D0%B5%D1%80%D0%BE%D0%B2.351/']*Нажмите сюда*[/URL][/FONT][/SIZE]<br><br>" +
             "[FONT=times new roman][SIZE=4][I]Просьба не создавать дубликаты данной темы в этом разделе, иначе ваш форумный аккаунт может быть заблокирован.[/I][/SIZE][/FONT][/COLOR]<br><br>" +
             "[FONT=book antiqua][SIZE=4][COLOR=rgb(209, 213, 216)][I]Приятной игры на BLACK RUSSIA ANAPA [/I][/COLOR][I][COLOR=rgb(0, 140, 240)]Role Play[/COLOR][/I][/SIZE][/FONT][COLOR=rgb(0, 140, 240)][FONT=book antiqua][SIZE=4][I].[/I][/SIZE][/FONT][/COLOR]<br><br>" +
             '[COLOR=rgb(255, 0, 0)][SIZE=4][FONT=times new roman][I]Отказано.[/I][/FONT][/SIZE][/COLOR]',
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
			sticky: 1,
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