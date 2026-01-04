// ==UserScript==
// @name         Кураторы Форума | by N.Amenre.
// @namespace    https://forum.blackrussia.online
// @version      1.0.2.1.4.2.1.3.2.4.3
// @description  Привет
// @author       Amenre
// @match        https://forum.blackrussia.online/threads/*
// @include      https://forum.blackrussia.online/threads/
// @grant        none
// @license    MIT
// @icon         https://sun9-76.userapi.com/impg/rEBGQfiaFZnbUofS8UOFXmokbnWSxJaLR-1Ycg/rxEn_aPc0wc.jpg?size=530x530&quality=95&sign=9ca94b62b95b588d510bc19a4290a530&type=album
// @downloadURL https://update.greasyfork.org/scripts/540417/%D0%9A%D1%83%D1%80%D0%B0%D1%82%D0%BE%D1%80%D1%8B%20%D0%A4%D0%BE%D1%80%D1%83%D0%BC%D0%B0%20%7C%20by%20NAmenre.user.js
// @updateURL https://update.greasyfork.org/scripts/540417/%D0%9A%D1%83%D1%80%D0%B0%D1%82%D0%BE%D1%80%D1%8B%20%D0%A4%D0%BE%D1%80%D1%83%D0%BC%D0%B0%20%7C%20by%20NAmenre.meta.js
// ==/UserScript==
(function () {
  'use strict';
const UNACCEPT_PREFIX = 4; // отказ
const ACCEPT_PREFIX = 8; // одобрен
const RESHENO_PREFIX = 6; // решено
const PIN_PREFIX = 2; // закреплено, на рассмотрении
const GA_PREFIX = 12; // главному админу
const COMMAND_PREFIX = 10; // команде проекта
const WATCHED_PREFIX = 9; // ожидание
const CLOSE_PREFIX = 7; // закрыто
const TEX_PREFIX = 13; // тех спецу
const buttons = [
    {
        
        title: '______________РП Биографии____________'
    },
    {
      
      title: 'Одобрено',
      content:
        '[CENTER][IMG width="613px"]http://postimg.su/image/QoSIOu1h/1676563497_catherineasquithgallery-com-p-zelenii-razdelitel-prozrachnii-fon-241.png[/IMG]<br><br>' +
        '[FONT=times new roman][SIZE=5]{{ greeting }}, уважаемый {{ user.name }}![/SIZE][/FONT]<br><br>'+

        '[SIZE=5][FONT=times new roman]Рассмотрев вашу RolePlay биографию, я выношу вердикт:[/FONT][/SIZE]<br>' +
        '[COLOR=rgb(97, 189, 109)][SIZE=5][FONT=times new roman]Одобрено[/FONT][/SIZE][/COLOR]<br>' +
        '[COLOR=rgb(255, 255, 255)][SIZE=5][FONT=times new roman]Приятной игры на BLACK RUSSIA [/FONT][/SIZE][/COLOR][COLOR=rgb(235, 107, 86)][SIZE=5][FONT=times new roman]VOLOGDA.[/FONT][/SIZE][/COLOR][/CENTER]',
      prefix: ACCEPT_PREFIX,
	    status: false,
    },
    {
        
      title: 'На доработку(дата рождения)',
      content:
        '[CENTER][IMG width="613px"]http://postimg.su/image/QoSIOu1h/1676563497_catherineasquithgallery-com-p-zelenii-razdelitel-prozrachnii-fon-241.png[/IMG]<br><br>' +
        '[FONT=times new roman][SIZE=5]{{ greeting }}, уважаемый {{ user.name }}![/SIZE][/FONT]<br><br>'+

        '[SIZE=5][FONT=times new roman]Рассмотрев вашу RolePlay биографию, я выношу вердикт:[/FONT][/SIZE]<br>' +
        '[FONT=times new roman][COLOR=rgb(251, 160, 38)][SIZE=5]На доработку, срок 24 часа.[/SIZE][/COLOR]<br>' +
        '[COLOR=rgb(255, 255, 255)][SIZE=5]Причина: несоответствие возраста и даты рождения[/SIZE][/COLOR][/FONT]<br><br>' +
        '[COLOR=rgb(255, 255, 255)][SIZE=5][FONT=times new roman]Приятной игры на BLACK RUSSIA [/FONT][/SIZE][/COLOR][COLOR=rgb(235, 107, 86)][SIZE=5][FONT=times new roman]VOLOGDA.[/FONT][/SIZE][/COLOR][/CENTER]',
      prefix: PIN_PREFIX,
	    status: true,
    },
    {
        
      title: 'На доработку(заголовок)',
      content:
        '[CENTER][IMG width="613px"]http://postimg.su/image/QoSIOu1h/1676563497_catherineasquithgallery-com-p-zelenii-razdelitel-prozrachnii-fon-241.png[/IMG]<br><br>' +
        '[FONT=times new roman][SIZE=5]{{ greeting }}, уважаемый {{ user.name }}![/SIZE][/FONT]<br><br>'+

        '[SIZE=5][FONT=times new roman]Рассмотрев вашу RolePlay биографию, я выношу вердикт:[/FONT][/SIZE]<br>' +
        '[FONT=times new roman][COLOR=rgb(251, 160, 38)][SIZE=5]На доработку.[/SIZE][/COLOR]<br>' +
        '[COLOR=rgb(255, 255, 255)][SIZE=5]Причина: неправильный формат заголовка. Правильно будет:  "RolePlay биография гражданина (Ваш никнейм в родительном падеже на русском без нижнего подчеркивания(_).)[/SIZE][/COLOR][/FONT]<br><br>' +
        '[COLOR=rgb(255, 255, 255)][SIZE=5][FONT=times new roman]Приятной игры на BLACK RUSSIA [/FONT][/SIZE][/COLOR][COLOR=rgb(235, 107, 86)][SIZE=5][FONT=times new roman]VOLOGDA.[/FONT][/SIZE][/COLOR][/CENTER]',
      prefix: PIN_PREFIX,
	    status: true,
    },
    {
        
      title: 'На доработку(детство)',
      content:
        '[CENTER][IMG width="613px"]http://postimg.su/image/QoSIOu1h/1676563497_catherineasquithgallery-com-p-zelenii-razdelitel-prozrachnii-fon-241.png[/IMG]<br><br>' +
        '[FONT=times new roman][SIZE=5]{{ greeting }}, уважаемый {{ user.name }}![/SIZE][/FONT]<br><br>'+

        '[SIZE=5][FONT=times new roman]Рассмотрев вашу RolePlay биографию, я выношу вердикт:[/FONT][/SIZE]<br>' +
        '[FONT=times new roman][COLOR=rgb(251, 160, 38)][SIZE=5]На доработку.[/SIZE][/COLOR]<br>' +
        '[COLOR=rgb(255, 255, 255)][SIZE=5]Причина: Мало информации в блоке (Детство)[/SIZE][/COLOR][/FONT]<br><br>' +
        '[COLOR=rgb(255, 255, 255)][SIZE=5][FONT=times new roman]Приятной игры на BLACK RUSSIA [/FONT][/SIZE][/COLOR][COLOR=rgb(235, 107, 86)][SIZE=5][FONT=times new roman]VOLOGDA.[/FONT][/SIZE][/COLOR][/CENTER]',
      prefix: PIN_PREFIX,
	    status: true,
    },
    {
        
      title: 'На доработку(юность и взрослая жизнь)',
      content:
        '[CENTER][IMG width="613px"]http://postimg.su/image/QoSIOu1h/1676563497_catherineasquithgallery-com-p-zelenii-razdelitel-prozrachnii-fon-241.png[/IMG]<br><br>' +
        '[FONT=times new roman][SIZE=5]{{ greeting }}, уважаемый {{ user.name }}![/SIZE][/FONT]<br><br>'+

        '[SIZE=5][FONT=times new roman]Рассмотрев вашу RolePlay биографию, я выношу вердикт:[/FONT][/SIZE]<br>' +
        '[FONT=times new roman][COLOR=rgb(251, 160, 38)][SIZE=5]На доработку.[/SIZE][/COLOR]<br>' +
        '[COLOR=rgb(255, 255, 255)][SIZE=5]Причина: Мало информации в блоке (Юность и взрослая жизнь)[/SIZE][/COLOR][/FONT]<br><br>' +
        '[COLOR=rgb(255, 255, 255)][SIZE=5][FONT=times new roman]Приятной игры на BLACK RUSSIA [/FONT][/SIZE][/COLOR][COLOR=rgb(235, 107, 86)][SIZE=5][FONT=times new roman]VOLOGDA.[/FONT][/SIZE][/COLOR][/CENTER]',
      prefix: PIN_PREFIX,
	    status: true,
    },
    {
        
      title: 'На доработку(Настоящее время)',
      content:
        '[CENTER][IMG width="613px"]http://postimg.su/image/QoSIOu1h/1676563497_catherineasquithgallery-com-p-zelenii-razdelitel-prozrachnii-fon-241.png[/IMG]<br><br>' +
        '[FONT=times new roman][SIZE=5]{{ greeting }}, уважаемый {{ user.name }}![/SIZE][/FONT]<br><br>'+

        '[SIZE=5][FONT=times new roman]Рассмотрев вашу RolePlay биографию, я выношу вердикт:[/FONT][/SIZE]<br>' +
        '[FONT=times new roman][COLOR=rgb(251, 160, 38)][SIZE=5]На доработку.[/SIZE][/COLOR]<br>' +
        '[COLOR=rgb(255, 255, 255)][SIZE=5]Причина: Мало информации в блоке (Настоящее время)[/SIZE][/COLOR][/FONT]<br><br>' +
        '[COLOR=rgb(255, 255, 255)][SIZE=5][FONT=times new roman]Приятной игры на BLACK RUSSIA [/FONT][/SIZE][/COLOR][COLOR=rgb(235, 107, 86)][SIZE=5][FONT=times new roman]VOLOGDA.[/FONT][/SIZE][/COLOR][/CENTER]',
      prefix: PIN_PREFIX,
	    status: true,
    },
    {
        
      title: 'На доработку(детство+ юность)',
      content:
        '[CENTER][IMG width="613px"]http://postimg.su/image/QoSIOu1h/1676563497_catherineasquithgallery-com-p-zelenii-razdelitel-prozrachnii-fon-241.png[/IMG]<br><br>' +
        '[FONT=times new roman][SIZE=5]{{ greeting }}, уважаемый {{ user.name }}![/SIZE][/FONT]<br><br>'+

        '[SIZE=5][FONT=times new roman]Рассмотрев вашу RolePlay биографию, я выношу вердикт:[/FONT][/SIZE]<br>' +
        '[FONT=times new roman][COLOR=rgb(251, 160, 38)][SIZE=5]На доработку.[/SIZE][/COLOR]<br>' +
        '[COLOR=rgb(255, 255, 255)][SIZE=5]Причина: Мало информации в блоке (Детство, Юность и Взрослая жизнь)[/SIZE][/COLOR][/FONT]<br><br>' +
        '[COLOR=rgb(255, 255, 255)][SIZE=5][FONT=times new roman]Приятной игры на BLACK RUSSIA [/FONT][/SIZE][/COLOR][COLOR=rgb(235, 107, 86)][SIZE=5][FONT=times new roman]VOLOGDA.[/FONT][/SIZE][/COLOR][/CENTER]',
      prefix: PIN_PREFIX,
	    status: true,
    },
    {
        
      title: 'Отказ(копипаст)',
      content:
        '[CENTER][IMG width="613px"]http://postimg.su/image/QoSIOu1h/1676563497_catherineasquithgallery-com-p-zelenii-razdelitel-prozrachnii-fon-241.png[/IMG]<br><br>' +
        '[FONT=times new roman][SIZE=5]{{ greeting }}, уважаемый {{ user.name }}![/SIZE][/FONT]<br><br>'+

        '[SIZE=5][FONT=times new roman]Рассмотрев вашу RolePlay биографию, я выношу вердикт:<br>' +
        '[COLOR=rgb(235, 107, 86)]Отказано[/COLOR][/FONT][/SIZE]<br>' +
        '[FONT=times new roman][COLOR=rgb(255, 255, 255)][SIZE=5]Причина: Ваша RolePlay биография скопирована/украдена.[/SIZE][/COLOR][/FONT]<br><br>' +
        '[COLOR=rgb(255, 255, 255)][SIZE=5][FONT=times new roman]Приятной игры на BLACK RUSSIA [/FONT][/SIZE][/COLOR][COLOR=rgb(235, 107, 86)][SIZE=5][FONT=times new roman]VOLOGDA.[/FONT][/SIZE][/COLOR][/CENTER]',
      prefix: UNACCEPT_PREFIX,
	    status: false,
    },
    {
        
      title: 'Отказ(уже есть одобренная)',
      content:
        '[CENTER][IMG width="613px"]http://postimg.su/image/QoSIOu1h/1676563497_catherineasquithgallery-com-p-zelenii-razdelitel-prozrachnii-fon-241.png[/IMG]<br><br>' +
        '[FONT=times new roman][SIZE=5]{{ greeting }}, уважаемый {{ user.name }}![/SIZE][/FONT]<br><br>'+

        '[SIZE=5][FONT=times new roman]Рассмотрев вашу RolePlay биографию, я выношу вердикт:<br>' +
        '[COLOR=rgb(235, 107, 86)]Отказано[/COLOR][/FONT][/SIZE]<br>' +
        '[FONT=times new roman][COLOR=rgb(255, 255, 255)][SIZE=5]Причина: У вас уже есть одобренная RolePlay биография на этом сервере.[/SIZE][/COLOR][/FONT]<br><br>' +
        '[COLOR=rgb(255, 255, 255)][SIZE=5][FONT=times new roman]Приятной игры на BLACK RUSSIA [/FONT][/SIZE][/COLOR][COLOR=rgb(235, 107, 86)][SIZE=5][FONT=times new roman]VOLOGDA.[/FONT][/SIZE][/COLOR][/CENTER]',
      prefix: UNACCEPT_PREFIX,
	    status: false,
    },
    {
        
      title: 'Отказ(не по форме)',
      content:
        '[CENTER][IMG width="613px"]http://postimg.su/image/QoSIOu1h/1676563497_catherineasquithgallery-com-p-zelenii-razdelitel-prozrachnii-fon-241.png[/IMG]<br><br>' +
        '[FONT=times new roman][SIZE=5]{{ greeting }}, уважаемый {{ user.name }}![/SIZE][/FONT]<br><br>'+

        '[SIZE=5][FONT=times new roman]Рассмотрев вашу RolePlay биографию, я выношу вердикт:<br>' +
        '[COLOR=rgb(235, 107, 86)]Отказано[/COLOR][/FONT][/SIZE]<br>' +
        '[FONT=times new roman][COLOR=rgb(255, 255, 255)][SIZE=5]Причина: Ваша RolePlay биография составлена не по форме.[/SIZE][/COLOR][/FONT]<br><br>' +
        '[COLOR=rgb(255, 255, 255)][SIZE=5][FONT=times new roman]Приятной игры на BLACK RUSSIA [/FONT][/SIZE][/COLOR][COLOR=rgb(235, 107, 86)][SIZE=5][FONT=times new roman]VOLOGDA.[/FONT][/SIZE][/COLOR][/CENTER]',
      prefix: UNACCEPT_PREFIX,
	    status: false,
    },
    {
        
      title: 'Отказ(от 3 лица)',
      content:
        '[CENTER][IMG width="613px"]http://postimg.su/image/QoSIOu1h/1676563497_catherineasquithgallery-com-p-zelenii-razdelitel-prozrachnii-fon-241.png[/IMG]<br><br>' +
        '[FONT=times new roman][SIZE=5]{{ greeting }}, уважаемый {{ user.name }}![/SIZE][/FONT]<br><br>'+

        '[SIZE=5][FONT=times new roman]Рассмотрев вашу RolePlay биографию, я выношу вердикт:<br>' +
        '[COLOR=rgb(235, 107, 86)]Отказано[/COLOR][/FONT][/SIZE]<br>' +
        '[FONT=times new roman][COLOR=rgb(255, 255, 255)][SIZE=5]Причина: Ваша RolePlay биография написана от 3 лица.[/SIZE][/COLOR][/FONT]<br><br>' +
        '[COLOR=rgb(255, 255, 255)][SIZE=5][FONT=times new roman]Приятной игры на BLACK RUSSIA [/FONT][/SIZE][/COLOR][COLOR=rgb(235, 107, 86)][SIZE=5][FONT=times new roman]VOLOGDA.[/FONT][/SIZE][/COLOR][/CENTER]',
      prefix: UNACCEPT_PREFIX,
	    status: false,
    },
    {
        
      title: 'Отказ(много ошибок)',
      content:
        '[CENTER][IMG width="613px"]http://postimg.su/image/QoSIOu1h/1676563497_catherineasquithgallery-com-p-zelenii-razdelitel-prozrachnii-fon-241.png[/IMG]<br><br>' +
        '[FONT=times new roman][SIZE=5]{{ greeting }}, уважаемый {{ user.name }}![/SIZE][/FONT]<br><br>'+

        '[SIZE=5][FONT=times new roman]Рассмотрев вашу RolePlay биографию, я выношу вердикт:<br>' +
        '[COLOR=rgb(235, 107, 86)]Отказано[/COLOR][/FONT][/SIZE]<br>' +
        '[FONT=times new roman][COLOR=rgb(255, 255, 255)][SIZE=5]Причина: В Вашей RolePlay биографии присутствует много орфаграфический/пунктуационных ошибок.[/SIZE][/COLOR][/FONT]<br><br>' +
        '[COLOR=rgb(255, 255, 255)][SIZE=5][FONT=times new roman]Приятной игры на BLACK RUSSIA [/FONT][/SIZE][/COLOR][COLOR=rgb(235, 107, 86)][SIZE=5][FONT=times new roman]VOLOGDA.[/FONT][/SIZE][/COLOR][/CENTER]',
      prefix: UNACCEPT_PREFIX,
	    status: false,
    },
    {
        
      title: 'Отказ(нет логики)',
      content:
        '[CENTER][IMG width="613px"]http://postimg.su/image/QoSIOu1h/1676563497_catherineasquithgallery-com-p-zelenii-razdelitel-prozrachnii-fon-241.png[/IMG]<br><br>' +
        '[FONT=times new roman][SIZE=5]{{ greeting }}, уважаемый {{ user.name }}![/SIZE][/FONT]<br><br>'+

        '[SIZE=5][FONT=times new roman]Рассмотрев вашу RolePlay биографию, я выношу вердикт:<br>' +
        '[COLOR=rgb(235, 107, 86)]Отказано[/COLOR][/FONT][/SIZE]<br>' +
        '[FONT=times new roman][COLOR=rgb(255, 255, 255)][SIZE=5]Причина: В Вашей RolePlay биографии пристутствуют логические ошибки.[/SIZE][/COLOR][/FONT]<br><br>' +
        '[COLOR=rgb(255, 255, 255)][SIZE=5][FONT=times new roman]Приятной игры на BLACK RUSSIA [/FONT][/SIZE][/COLOR][COLOR=rgb(235, 107, 86)][SIZE=5][FONT=times new roman]VOLOGDA.[/FONT][/SIZE][/COLOR][/CENTER]',
      prefix: UNACCEPT_PREFIX,
	    status: false,
    },
    
  ];
$(document).ready(() => {
    // Загрузка скрипта для обработки шаблонов
    $('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');
 
    // Добавление кнопок при загрузке страницы
    addButton('На рассмотрение', 'pin');
    addButton('КП', 'teamProject');
    addButton('Га', 'Ga');
    addButton('Спецу', 'Spec');
    addButton('Одобрено', 'accepted');
    addButton('Отказано', 'unaccept');
    addButton('Тех. Специалисту', 'Texy');
    addButton('Решено', 'Resheno');
    addButton('Закрыто', 'Zakrito');
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