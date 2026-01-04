// ==UserScript==
// @name         PODOLSK | Скрипт для Кенджи | 1.0 версия
// @namespace    https://forum.blackrussia.online
// @version      1.0
// @description  Специально для Кенджи | PODOLSK |  K.Malior
// @author       R.Abduragimov
// @match        https://forum.blackrussia.online/threads/*
// @include      https://forum.blackrussia.online/threads/
// @grant        none
// @license      MITblackrussia
// @collaborator R.Abduragimov
// @icon https://icons.iconarchive.com/icons/google/noto-emoji-people-bodyparts/512/12003-OK-hand-light-skin-tone-icon.png
// @downloadURL https://update.greasyfork.org/scripts/523754/PODOLSK%20%7C%20%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%9A%D0%B5%D0%BD%D0%B4%D0%B6%D0%B8%20%7C%2010%20%D0%B2%D0%B5%D1%80%D1%81%D0%B8%D1%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/523754/PODOLSK%20%7C%20%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%9A%D0%B5%D0%BD%D0%B4%D0%B6%D0%B8%20%7C%2010%20%D0%B2%D0%B5%D1%80%D1%81%D0%B8%D1%8F.meta.js
// ==/UserScript==

(function () {
  'use strict';
'esversion 6' ;
const UNACCEPT_PREFIX = 4; // Префикс, который будет установлен при закрытии потока
const ACCEPT_PREFIX = 8; // Префикс, который будет установлен при принятии потока
const PIN_PREFIX = 2; // Префикс, который будет установлен при намотке штифтов
const COMMAND_PREFIX = 10; // Префикс, который будет установлен при отправке потока команде проекта
const WATCHED_PREFIX = 9;
const CLOSE_PREFIX = 7; // Префикс, который будет установлен при закрытии потока.
const TEX_PREFIX = 13;
const GA_PREFIX = 12;
const V_PREFIX = 1;
const buttons = [
     {
      title: '_______________________________________ღ  Ответы ღ_______________________________________',
          color: 'oswald: 3px; color: #FFFF00; background: #000000; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #FFFF00',
         },
    {
        title: 'С админом будет беседа',
      content:
        "[CENTER][IMG]https://i.postimg.cc/qBxHzKGL/IMG-4847.png[/IMG]"+
    "[center][I][COLOR=rgb(255, 0, 0)]Здравствуйте, уважаемый игрок![/COLOR][/I][center]" +
    "[IMG]https://i.postimg.cc/bNbkG5MT/IMG-4848.png[/IMG]" +
    "[I]С администратором будет проведена беседа, приносим свои извинения. Ваше наказание будет снято![/I]"+
    "[IMG]https://i.postimg.cc/bNbkG5MT/IMG-4848.png[/IMG]" +
    "[I][COLOR=rgb(204, 204, 204)]Ваша жалоба получает вердикт «Одобрено», закрыто.[/COLOR][/I]" +
    "[IMG]https://i.postimg.cc/bNbkG5MT/IMG-4848.png[/IMG]" +
    "[center][I][COLOR=rgb(247, 218, 100)]Приятной игры на «PODOLSK»![center]" +
    "[center][IMG]https://i.postimg.cc/qBxHzKGL/IMG-4847.png[/IMG][/COLOR][/I][/CENTER]" ,
       prefix: ACCEPT_PREFIX,
      status: false,
    },
     {
        title: 'ЗАПРОШУ ДОК-ВА',
      content:
        "[CENTER][IMG]https://i.postimg.cc/qBxHzKGL/IMG-4847.png[/IMG]"+
    "[center][I][COLOR=rgb(255, 0, 0)]Здравствуйте, уважаемый игрок![/COLOR][/I]" +
    "[IMG]https://i.postimg.cc/bNbkG5MT/IMG-4848.png[/IMG]" +
    "[center][I]Запрошу доказательства у администратора, Ожидайте ответа.[/I]" +
    "[IMG]https://i.postimg.cc/bNbkG5MT/IMG-4848.png[/IMG]"+
    "[center][I][COLOR=rgb(204, 204, 204)]На рассмотрении.[/COLOR][/I]" +
    "[IMG]https://i.postimg.cc/bNbkG5MT/IMG-4848.png[/IMG]" +
     "[center][I][COLOR=rgb(247, 218, 100)]Приятной игры на «PODOLSK»![center]" +
    "[center][IMG]https://i.postimg.cc/qBxHzKGL/IMG-4847.png[/IMG][/COLOR][/I][/CENTER]" ,
       prefix: PIN_PREFIX,
      status: false,
    },
    {
        title: 'В ОБЖАЛОВАНИЕ',
      content:
        "[CENTER][IMG]https://i.postimg.cc/qBxHzKGL/IMG-4847.png[/IMG]"+
    "[center][I][COLOR=rgb(255, 0, 0)]Здравствуйте, уважаемый игрок![/COLOR][/I][center]" +
    "[center][IMG]https://i.postimg.cc/bNbkG5MT/IMG-4848.png[/IMG][center]" +
    "[center][I]Перемещаю Вашу жалобу в более правильный раздел «Обжалование наказаний»[/I][center]" +
    "[center][IMG]https://i.postimg.cc/bNbkG5MT/IMG-4848.png[/IMG][center]"+
    "[center][I][COLOR=rgb(204, 204, 204)]На рассмотрении.[/COLOR][/I][center]" +
    "[center][IMG]https://i.postimg.cc/bNbkG5MT/IMG-4848.png[/IMG][center]" +
     "[center][I][COLOR=rgb(247, 218, 100)]Приятной игры на «PODOLSK»![center]" +
    "[center][IMG]https://i.postimg.cc/qBxHzKGL/IMG-4847.png[/IMG][/COLOR][/I][/CENTER]" ,
      prefix: PIN_PREFIX,
       status: false,
    },
    {
        title: 'Прошло 72 часа с выдачи',
      content:
        "[CENTER][IMG]https://i.postimg.cc/qBxHzKGL/IMG-4847.png[/IMG]"+
    "[center][I][COLOR=rgb(255, 0, 0)]Здравствуйте, уважаемый игрок![/COLOR][/I][center]" +
    "[center][IMG]https://i.postimg.cc/bNbkG5MT/IMG-4848.png[/IMG][center]" +
    "[center][I]К сожалению, с момента выдачи наказания прошло 72 часа. Обратитесь в раздел «Обжалование наказаний».[/I][center]" +
    "[center][IMG]https://i.postimg.cc/bNbkG5MT/IMG-4848.png[/IMG][center]"+
    "[center][I][COLOR=rgb(204, 204, 204)]В жалобе отказано. Закрыто.[/COLOR][/I][center]" +
    "[center][IMG]https://i.postimg.cc/bNbkG5MT/IMG-4848.png[/IMG][center]" +
     "[center][I][COLOR=rgb(247, 218, 100)]Приятной игры на «PODOLSK»![center]" +
    "[center][IMG]https://i.postimg.cc/qBxHzKGL/IMG-4847.png[/IMG][/COLOR][/I][/CENTER]" ,
      prefix: UNACCEPT_PREFIX,
    },
     {
      title: '_______________________________________ღ  Ответы ღ_______________________________________',
          color: 'oswald: 3px; color: #FFFF00; background: #000000; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #FFFF00',
      },
    {
        title: 'Док-ва предоставлены',
      content:
        "[CENTER][IMG]https://i.postimg.cc/qBxHzKGL/IMG-4847.png[/IMG][center]"+
    "[center][I][COLOR=rgb(255, 0, 0)]Здравствуйте, уважаемый игрок![/COLOR][/I][center]" +
    "[center][IMG]https://i.postimg.cc/bNbkG5MT/IMG-4848.png[/IMG][center]" +
    "[center][I]Администратор предоставил доказательства Вашего нарушения. Основательно проверив их выношу вердикт, что наказание выдано верно.[/I][center]" +
    "[center][IMG]https://i.postimg.cc/bNbkG5MT/IMG-4848.png[/IMG][center]"+
    "[center][I][COLOR=rgb(204, 204, 204)]В жалобе отказано. Закрыто.[/COLOR][/I][center]" +
    "[center][IMG]https://i.postimg.cc/bNbkG5MT/IMG-4848.png[/IMG][center]" +
     "[center][I][COLOR=rgb(247, 218, 100)]Приятной игры на «PODOLSK»![center]" +
    "[IMG]https://i.postimg.cc/qBxHzKGL/IMG-4847.png[/IMG][/COLOR][/I][/CENTER]" ,
      prefix: UNACCEPT_PREFIX,
        status: false,
    },
    {
        title: 'передана руководству',
      content:
        "[CENTER][IMG]https://i.postimg.cc/qBxHzKGL/IMG-4847.png[/IMG][center]"+
    "[center][I][COLOR=rgb(255, 0, 0)]Здравствуйте, уважаемый игрок![/COLOR][/I][center]" +
    "[center][IMG]https://i.postimg.cc/bNbkG5MT/IMG-4848.png[/IMG][center]" +
    "[center][I]Ваша жалоба передана на рассмотрение Руководства нашего сервера, ожидайте скорейшего ответа![/I][center]" +
    "[center][IMG]https://i.postimg.cc/bNbkG5MT/IMG-4848.png[/IMG][center]"+
    "[center][I][COLOR=rgb(204, 204, 204)]На рассмотрении. Просьба не создавать копии этой темы, уже скоро Вы получите ответ.[/COLOR][/I][center]" +
    "[center][IMG]https://i.postimg.cc/bNbkG5MT/IMG-4848.png[/IMG][center]" +
     "[center][I][COLOR=rgb(247, 218, 100)]Приятной игры на «PODOLSK»![center]" +
    "[center][IMG]https://i.postimg.cc/qBxHzKGL/IMG-4847.png[/IMG][/COLOR][/I][/CENTER]" ,
      prefix: PIN_PREFIX,
        status: false,
    },
    {
        title: 'не по форме',
      content:
        "[CENTER][IMG]https://i.postimg.cc/qBxHzKGL/IMG-4847.png[/IMG][center]"+
    "[center][I][COLOR=rgb(255, 0, 0)]Здравствуйте, уважаемый игрок![/COLOR][/I][center]" +
    "[center][IMG]https://i.postimg.cc/bNbkG5MT/IMG-4848.png[/IMG][center]" +
    "[center][I]К сожалению, Ваша жалоба составлена не по форме. Ознакомьтесь с правилами написания жалоб на Администрацию, закрепленную в этом разделе.[/I][center]" +
    "[center][IMG]https://i.postimg.cc/bNbkG5MT/IMG-4848.png[/IMG][center]"+
    "[center][I][COLOR=rgb(204, 204, 204)]В жалобе Отказано. Закрыто.[/COLOR][/I][center]" +
    "[center][IMG]https://i.postimg.cc/bNbkG5MT/IMG-4848.png[/IMG][center]" +
     "[center][I][COLOR=rgb(247, 218, 100)]Приятной игры на «PODOLSK»![center]" +
    "[center][IMG]https://i.postimg.cc/qBxHzKGL/IMG-4847.png[/IMG][/COLOR][/I][/CENTER]" ,
      prefix: UNACCEPT_PREFIX,
    },
    {
        title: 'В тех раздел',
      content:
        "[CENTER][IMG]https://i.postimg.cc/qBxHzKGL/IMG-4847.png[/IMG][center]"+
    "[center][I][COLOR=rgb(255, 0, 0)]Здравствуйте, уважаемый игрок![/COLOR][/I][center]" +
    "[center][IMG]https://i.postimg.cc/bNbkG5MT/IMG-4848.png[/IMG][center]" +
    "[center][I]Администратор являлся или является Техническим специалистом, пожалуйста обратитесь в Технический раздел.[/I][center]" +
    "[center][IMG]https://i.postimg.cc/bNbkG5MT/IMG-4848.png[/IMG][center]"+
    "[center][I][COLOR=rgb(204, 204, 204)]В жалобе Отказано. Закрыто.[/COLOR][/I][center]" +
    "[center][IMG]https://i.postimg.cc/bNbkG5MT/IMG-4848.png[/IMG][center]" +
    "[center][I][COLOR=rgb(247, 218, 100)]Приятной игры на «PODOLSK»![center]"+
    "[center][IMG]https://i.postimg.cc/qBxHzKGL/IMG-4847.png[/IMG][/COLOR][/I]" ,
       prefix: UNACCEPT_PREFIX,
        status: false,
    },
     {
      title: '_______________________________________ღ  Все ради любимого кенджи ღ_______________________________________',
          color: 'oswald: 3px; color: #FFFF00; background: #000000; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #FFFF00',
         },





    ];
      $(document).ready(() => {
    // Загрузка скрипта для обработки шаблонов
    $('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');

              // Добавление кнопок при загрузке страницы
          addButton('Тыкни сюда кенджи', 'selectAnswer');

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

 function addButton(name, id, hex = "white") {
		$('.button--icon--reply').before(
		`<button type="button" class="button--primary button rippleButton" id="${id}" style="border-radius: 25px; margin-right: 5px; background-color: ${hex}">${name}</button>`,
		);
  }

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