// ==UserScript==
// @name   FF_ruk_script_by_support
// @name:ru script Кураторов семьи
// @description  Author FoX Factory | SUPPORT
// @description:ru Author FoX Factory | SUPPORT
// @autor FoX Factory | SUPPORT
// @version 1.1.1
// @namespace https://whg25211.vkweb.su
// @match        https://whg25211.vkweb.su/*
// @include      https://whg25211.vkweb.su/
// @grant        none
// @license   MIT
// @icon https://emoji.gg/assets/emoji/9372-blurple-boost-level-9.png
// @downloadURL https://update.greasyfork.org/scripts/496219/FF_ruk_script_by_support.user.js
// @updateURL https://update.greasyfork.org/scripts/496219/FF_ruk_script_by_support.meta.js
// ==/UserScript==

(function () {
  'use strict';
const UNACCСEPT_PREFIX = 3; // Prefix that will be set when thread closes
const ACCСEPT_PREFIX = 2; // Prefix that will be set when thread accepted
const RESHENO_PREFIX = 8; // Prefix that will be set when solving the problem
const PINN_PREFIX = 5; // Prefix that will be set when thread pins
const LD_PREFIX = 4; // Prefix that will be set when thread send to ld
const WATCHED_PREFIX = 16;
const CLOSE_PREFIX = 6;
const buttons = [
    {
     title: '- - - - - -  - - - - - - - - -  - - - - - - - - - - - - - - - - - Жалобы на заместителей - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -',
    },
    {
      title: 'Будет беседа с замом',
      content:
		'[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER][FONT=georgia][I][B]С заместитеоем будет проведена строгая беседа.<br>Спасибо за Ваше обращение.<br>Приятной игры. [/FONT][/I][/CENTER] " +
		'[Color=Green][CENTER]Одобрено, закрыто.[/I][/B][/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
      status: false,
    },
    {
      title: 'Будет беседа с замом и наказание будет снято',
      content:
		'[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER][FONT=georgia][I][B]С заместителем будет проведена строгая беседа.<br>Ваше наказание будет снято в течение нескольких часов.<br>Спасибо за Ваше обращение.<br>Приятной игры. [/FONT][/I][/CENTER] " +
		'[Color=Green][CENTER]Одобрено, закрыто.[/I][/B][/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'ЖБ на рассмотрении',
      content:
		'[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Запрошу доказательства у заместителя.<br>Ожидайте вынесения вердикта и не создавайте копии данной темы.[/CENTER]<br>" +
		'[Color=Orange][CENTER]На рассмотрении...[/I][/CENTER][/color][/FONT]',
      prefix: PINN_PREFIX,
	  status: false,
    },
    {
      title: 'С момента выдачи наказания более 24ч',
      content:
		'[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Срок написания жалобы составляет один день (24 часа) с момента совершенного нарушения со стороны заместителя семьи.<br>Приятной игры.[/CENTER]<br>" +
		'[Color=Red][CENTER]Отказано, закрыто.[/I][/CENTER][/color][/FONT]',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Зам предоставил док-ва',
      content:
		'[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER] Заместитель предоставил доказательства, наказание выдано верно.<br>Приятной игры.[/CENTER]<br>" +
		'[Color=Red][CENTER]Отказано, закрыто.[/I][/CENTER][/color][/FONT]',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Недостаточно док-в',
      content:
		'[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Недостаточно доказательств нарушения со стороны заместителя.<br>Благодарим вас за ваше обращение.<br>Приятной игры.[/CENTER]<br>" +
		'[Color=Red][CENTER]Отказано, закрыто.[/I][/CENTER][/color][/FONT]',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Нарушений со стороны зама нет',
      content:
		'[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Нарушений со стороны заместителя не было найдено.<br>Приятной игры.[/CENTER]<br>" +
		'[Color=Red][CENTER]Отказано, закрыто.[/I][/CENTER][/color][/FONT]',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'ЖБ не по форме',
      content:
		'[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Ваша жалоба составлена не по форме.<br>Убедительная просьба ознакомиться с правилами подачи жалоб на заместителей.[/CENTER]<br>" +
		'[Color=Red][CENTER]Отказано, закрыто.[/I][/CENTER][/color][/FONT]',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'В обжалования',
      content:
		'[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Вы ошиблись разделом.<br>Обратитесь в раздел Обжалование наказаний.[/CENTER]<br>" +
		'[Color=Red][CENTER]Отказано, закрыто.[/I][/CENTER][/color][/FONT]',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Передано ЛД',
      content:
		'[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Ваша жалоба была передана на рассмотрение [Color=Red]Лидеру[/color].<br>Ожидайте вынесения вердикта и не создавайте копии данной темы.[/CENTER]<br>" +
		'[Color=Flame][CENTER]Ожидайте ответа.[/I][/CENTER][/color][/FONT]',
      prefix: LD_PREFIX,
	  status: true,
    },
    {
      title: 'Дублирование темы',
      content:
		'[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Дублирование темы.<br>При дальнейшем дублировании подобных жалоб, ваш форумный аккаунт будет заблокирован за нарушение правил пользования форумом.[/CENTER]<br>" +
		'[Color=Red][CENTER]Отказано, закрыто.[/I][/CENTER][/color][/FONT]',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Ошиблись разделом',
      content:
		'[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]К сожалению Вы ошиблись разделом, переподайте жалобу в нужный раздел.[/CENTER]<br>",
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'ЖБ от 3-го лица',
      content:
		'[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER][B][I][FONT=georgia]Жалобы от 3-их лиц не принимаются.[/CENTER]" +
		'[Color=Red][CENTER]Отказано, закрыто.[/I][/CENTER][/color][/FONT]',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
	  title: 'Нету /time',
	  content:
		'[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
		"[CENTER]На ваших доказательствах отсутствует /time.[/CENTER]<br>" +
		'[Color=Red][CENTER]Отказано, закрыто.[/I][/CENTER][/color][/FONT]',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Док-ва в соц. сетях',
      content:
		'[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER][B][I][FONT=georgia] Прикрепление доказательств обязательно. Примечание: загрузка доказательств в соц. сети (ВКонтакте, instagram) запрещается, доказательства должны быть загружены на фото/видео хостинги (YouTube, Япикс, imgur).[/CENTER]" +
		'[Color=Red][CENTER]Отказано, закрыто.[/I][/CENTER][/color][/FONT]',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Не работают док-ва',
      content:
		'[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Не работают доказательства.[/CENTER]<br>" +
		'[Color=Flame][CENTER]Закрыто.[/I][/CENTER][/color][/FONT]',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Док-ва отредактированы',
      content:
		'[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER][B][I][FONT=georgia]Ваши доказательства отредактированы.[/CENTER]" +
		'[Color=Red][CENTER]Отказано, закрыто.[/I][/CENTER][/color][/FONT]',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
     title: '- - - - - -  - - - - - - - - -  - - - - - - - - - - - - - - - - - - - Обжалования наказаний - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -',
    },
    {
      title: 'Срок ЧС снижен до 30 дней',
      content:
		'[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Срок Черного Списка семьи будет снижен до 30 дней.<br>С момента снятия ЧС, не повторяйте подобных действий.<br>Приятной игры.[/CENTER]<br>" +
		'[Color=Green][CENTER]Одобрено, закрыто.[/I][/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Срок ЧС снижен до 15 дней',
      content:
		'[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Срок Черного Списка семьи будет снижен до 15 дней.<br>С момента снятия ЧС, не повторяйте подобных действий.<br>Приятной игры.[/CENTER]<br>" +
		'[Color=Green][CENTER]Одобрено, закрыто.[/I][/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Срок мута снижен до 60 минут',
      content:
		'[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Срок мута будет снижен до 60 минут.<br>С момента снятия мута, не повторяйте подобных действий.<br>Приятной игры.[/CENTER]<br>" +
		'[Color=Green][CENTER]Одобрено, закрыто.[/I][/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Срок мута снижен до 30 минут',
      content:
		'[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Срок мута будет снижен до 30 минут.<br>С момента снятия мута, не повторяйте подобных действий.<br>Приятной игры.[/CENTER]<br>" +
		'[Color=Green][CENTER]Одобрено, закрыто.[/I][/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Срок мута снижен до 15 минут',
      content:
		'[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Срок мута будет снижен до 15 минут.<br>С момента снятия мута, не повторяйте подобных действий.<br>Приятной игры.[/CENTER]<br>" +
		'[Color=Green][CENTER]Одобрено, закрыто.[/I][/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Обж отказано',
      content:
		'[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]К сожалению, вам отказано в смягчении наказания.<br>Не расстраивайтесь и всего вам доброго.<br>Приятной игры.[/CENTER]<br>" +
		'[Color=Red][CENTER]Отказано, закрыто.[/I][/CENTER][/color][/FONT]',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'В ЖБ на зама',
      content:
		'[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Вы ошиблись разделом.<br>Обратитесь в раздел жалобы на заместителей.<br>Приятной игры.[/CENTER]<br>" +
		'[Color=Red][CENTER]Отказано, закрыто.[/I][/CENTER][/color][/FONT]',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
];

  $(document).ready(() => {
    // Загрузка скрипта для обработки шаблонов
    $('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');
 
    // Добавление кнопок при загрузке страницы
    addButton('На рассмотрение', 'pin');
    addButton('Лидеру', 'ld');
    addButton('Отказано', 'unacccept');
    addButton('Одобрено', 'acccepted');
    addButton('👉 Ответы для рук.👈', 'selectAnswer');

    $('button#pin').click(() => editThreadData(PINN_PREFIX, true));
    $('button#accepted').click(() => editThreadData(ACCСEPT_PREFIX, false));
    $('button#ld').click(() => editThreadData(LD_PREFIX, true));
    $('button#unacccept').click(() => editThreadData(UNACCCEPT_PREFIX, false));

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