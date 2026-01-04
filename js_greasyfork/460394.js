// ==UserScript==
// @name         Скрипт для ЗГА/ГА/Куратор.
// @namespace    https://forum.blackrussia.online
// @version      1.6
// @description 🏛️
// @author      J. Hoffm
// @match        https://forum.blackrussia.online/index.php?threads/*
// @include      https://forum.blackrussia.online/index.php?threads/
// @grant        none
// @license    MIT
// @icon   https://icons.iconarchive.com/icons/papirus-team/papirus-apps/48/emerald-theme-manager-icon-icon.png
// @downloadURL https://update.greasyfork.org/scripts/460394/%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%97%D0%93%D0%90%D0%93%D0%90%D0%9A%D1%83%D1%80%D0%B0%D1%82%D0%BE%D1%80.user.js
// @updateURL https://update.greasyfork.org/scripts/460394/%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%97%D0%93%D0%90%D0%93%D0%90%D0%9A%D1%83%D1%80%D0%B0%D1%82%D0%BE%D1%80.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
const UNACCEPT_PREFIX = 4; // Prefix that will be set when thread closes
const ACCEPT_PREFIX = 8; // Prefix that will be set when thread accepted
const RASSMOTENO_PREFIX = 9; // Prefix that will be set when solving the problem
const PIN_PREFIX = 2; // Prefix that will be set when thread pins
const GA_PREFIX = 12; // Prefix that will be set when thread send to ga
const COMMAND_PREFIX = 10; // Prefix that will be set when thread send to project team
const WATCHED_PREFIX = 9;
const SA_PREFIX = 11;
const CLOSE_PREFIX = 7;
const SPECY_PREFIX = 11;
const TEX_PREFIX = 13;
const buttons = [
    {
        title: ' ======================================================================= ',
    },
    {
        
        title: ' На ГА ',
        content:
        '[CENTER][COLOR=rgb(255, 0, 0)][FONT=georgia]{{ greeting }}, уважаемый {{ user.mention }}.[/FONT][/COLOR][/CENTER]<br><br>' +
        "[CENTER][FONT=georgia]Ваша жалоба переадресована [COLOR=rgb(255, 0, 0)]Главному Администратору .[/COLOR]<br><br>" +
        '[COLOR=rgb(255, 255, 0)][ICODE]Ожидайте ответа.[/ICODE][/COLOR][/FONT][/CENTER]',
         prefix: GA_PREFIX,
         status: true,
    },
    {
        title: ' На рассмотрении ',
        content: 
        '[CENTER][COLOR=rgb(255, 0, 0)][FONT=georgia]{{ greeting }}, уважаемый {{ user.mention }}.[/FONT][/COLOR][/CENTER]<br><br>' +
        "[CENTER][FONT=georgia]Ваша жалоба находится на рассмотрении.[/FONT]<br><br>" +
        '[COLOR=rgb(255, 255, 0)][FONT=georgia][ICODE]Ожидайте моего ответа.[/ICODE][/FONT][/COLOR][/CENTER]',
        prefix: PIN_PREFIX,
        status: false,
    },
    {
  
        title: ' На спец адм ',
        content:
        '[CENTER][COLOR=rgb(255, 0, 0)][FONT=georgia]{{ greeting }}, уважаемый {{ user.mention }}.[/FONT][/COLOR][/CENTER]<br><br>' +
        "[CENTER][FONT=georgia]Ваша жалоба была передана [COLOR=rgb(255, 0, 0)]специальному администратору. [/COLOR][/FONT]<br><br>" +
        '[COLOR=rgb(255, 255, 0)][FONT=georgia][ICODE]Ожидайте ответа.[/ICODE][/FONT][/COLOR][/CENTER]',
        prefix: SA_PREFIX,
       status: true,
    },
    {
        title: ' На команде проекта ' ,
        content: 
        '[CENTER][COLOR=rgb(255, 0, 0)][FONT=georgia]{{ greeting }}, уважаемый {{ user.mention }}.[/FONT][/COLOR][/CENTER]<br><br>' +
        "[CENTER][FONT=georgia]Ваша жалоба была передана [COLOR=rgb(255, 255, 136)]команде проекта.[/COLOR][/FONT]<br><br>" +
        '[COLOR=rgb(255, 255, 0)][FONT=georgia][ICODE]Ожидайте ответа.[/ICODE][/FONT][/COLOR][/CENTER]',
        prefix: COMMAND_PREFIX,
        status: true,
    },
    {
        title: '____________________________________________________________________________',
    },
    {
        title: ' Запрошу доказательства у админа ',
        content: 
        '[CENTER][COLOR=rgb(255, 0, 0)][FONT=georgia]{{ greeting }}, уважаемый {{ user.mention }}.[/FONT][/COLOR][/CENTER]<br><br>' +
        "[CENTER][FONT=georgia]Запрошу доказательства у администратора. Просьба не создавать подобных тем, иначе форумный аккаунт может быть заблокирован[COLOR=rgb(209, 213, 216)].[/COLOR][/FONT][/CENTER]<br><br>" +
        '[CENTER][COLOR=rgb(255, 255, 0)][FONT=georgia]На рассмотрении.[/FONT][/COLOR][/CENTER]',
       
    },
    {
        title: ' Беседа с админом ',
        content: 
        '[CENTER][COLOR=rgb(255, 0, 0)][FONT=georgia]{{ greeting }}, уважаемый {{ user.mention }}.[/FONT][/COLOR][/CENTER]<br><br>' +
        "[CENTER][FONT=georgia]Ваша жалоба была одобрена. С администратором будет проведена беседа.Наказание будет снято.[/FONT][/CENTER]<br><br>" +
        '[COLOR=rgb(0, 255, 0)]Одобрено[/COLOR], Закрыто.[/FONT][/CENTER]',
        prefix: ACCEPT_PREFIX,
        status: false,
    },
    {
        title: ' Нет нарушений от адм ',
        content: 
'[CENTER][COLOR=rgb(255, 0, 0)][FONT=georgia]{{ greeting }}, уважаемый {{ user.mention }}.[/FONT][/COLOR][/CENTER]<br><br>' +
"[CENTER][FONT=georgia]Нарушений со стороны Администратора не было обнаружено.[/FONT][/CENTER]<br><br>" +
'[CENTER][FONT=georgia][COLOR=rgb(255, 0, 0)]Отказано, Закрыто[/COLOR][/FONT].[/CENTER]',
        prefix: CLOSE_PREFIX,
        status: false,
        
    },
    {
        
        title: ' Наказание выдана верно.',
        content:
        '[CENTER][COLOR=rgb(255, 0, 0)][FONT=georgia]{{ greeting }}, уважаемый {{ user.mention }}.[/FONT][/COLOR][/CENTER]<br><br>' +
        "[CENTER][FONT=georgia][COLOR=rgb(239, 239, 239)]Проверив[/COLOR] доказательства администратора, было принято решение, что наказание выдано верно[COLOR=rgb(239, 239, 239)].[/COLOR]<br><br>" +
        '[COLOR=rgb(255, 0, 0)]Отказано[/COLOR][COLOR=rgb(255, 255, 255)], [/COLOR][COLOR=rgb(255, 0, 0)]Закрыто[/COLOR][COLOR=rgb(255, 255, 255)].[/COLOR][/FONT][/CENTER]',
         prefix: CLOSE_PREFIX,
         status: false,
    },
    {
        title: ' Админ ошибся ',
        content:
        '[CENTER][COLOR=rgb(255, 0, 0)][FONT=georgia]{{ greeting }}, уважаемый {{ user.mention }}.[/FONT][/COLOR][/CENTER]<br><br>' +
        "[CENTER][FONT=georgia][COLOR=rgb(239, 239, 239)]А[/COLOR]дминистратор допустил ошибку. Приносим свои извинения за доставленные неудобства.<br> Ваше наказание будет снято[COLOR=rgb(204, 204, 204)].[/COLOR]<br><br>" +
        '[COLOR=rgb(0, 255, 0)]Одобрено[/COLOR], [COLOR=rgb(239, 239, 239)]Закрыто.[/COLOR][/FONT][/CENTER]',
        prefix: ACCEPT_PREFIX,
        status: false,
    },
    {
        title: '______________________________Отказы_________________________',
        
    },
    {
        title: ' Не по форме ',
        content: 
        '[CENTER][COLOR=rgb(255, 0, 0)][FONT=georgia]{{ greeting }}, уважаемый {{ user.mention }}.[/FONT][/COLOR][/CENTER]<br><br>' +
        "[CENTER][FONT=georgia][COLOR=rgb(239, 239, 239)]В[/COLOR]аша жалоба составленa не по форме[COLOR=rgb(204, 204, 204)].[/COLOR]<br>" +
        "[COLOR=rgb(239, 239, 239)]О[/COLOR]знакомьтесь правилами подачи жалобы на администратора[COLOR=rgb(204, 204, 204)].[/COLOR][/FONT]<br><br>" +
        '[COLOR=rgb(255, 0, 0)][FONT=georgia]Отказано[/FONT][/COLOR][COLOR=rgb(255, 255, 255)][FONT=georgia],[/FONT][/COLOR][COLOR=rgb(255, 0, 0)][FONT=georgia] Закрыто[/FONT][/COLOR][COLOR=rgb(239, 239, 239)].[/COLOR][/CENTER]',
        prefix: UNACCEPT_PREFIX,
        status: false,
    },
    {
        title: ' Док-ва соц-сетях  ',
        content: 
        '[CENTER][COLOR=rgb(255, 0, 0)][FONT=georgia]{{ greeting }}, уважаемый {{ user.mention }}.[/FONT][/COLOR][/CENTER]<br><br>' +
        "[CENTER][FONT=georgia][COLOR=rgb(239, 239, 239)]Д[/COLOR]оказательства в социальных сетях и т.д. не принимаются. Загрузите доказательства на фото-видео хостинги YouTube,Imgur, Yapx и так далее[COLOR=rgb(209, 213, 216)].[/COLOR][/FONT]<br><br>" +
        '[COLOR=rgb(255, 0, 0)][FONT=georgia]Отказано[/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=georgia], [/FONT][/COLOR][COLOR=rgb(255, 0, 0)][FONT=georgia]Закрыто[/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=georgia].[/FONT][/COLOR][/CENTER]',
        prefix: UNACCEPT_PREFIX,
        status: false,
    },
    {
        title: ' Отсутствует доказательствo ',
        content: 
        '[CENTER][COLOR=rgb(255, 0, 0)][FONT=georgia]{{ greeting }}, уважаемый {{ user.mention }}.[/FONT][/COLOR][/CENTER]<br><br>' +
        "[CENTER][FONT=georgia]В вашей жалобе отсутствуют доказательства.[/FONT][/CENTER]<br><br>" +
        '[COLOR=rgb(255, 0, 0)][FONT=georgia]Отказано[/FONT][/COLOR][COLOR=rgb(239, 239, 239)][FONT=georgia],[/FONT][/COLOR][COLOR=rgb(255, 0, 0)][FONT=georgia] Закрыто[/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=georgia].[/FONT][/COLOR][/CENTER]',
       prefix: UNACCEPT_PREFIX,
       status: false,
    },
    {
        title: 'Более 48-и часов ',
        content: 
        '[CENTER][COLOR=rgb(255, 0, 0)][FONT=georgia]{{ greeting }}, уважаемый {{ user.mention }}.[/FONT][/COLOR][/CENTER]<br><br>' +
        "[CENTER][FONT=georgia][COLOR=rgb(239, 239, 239)]С[/COLOR] момента выдачи наказание прошло более 48-и часов, жалоба не подлежит рассмотрению[COLOR=rgb(204, 204, 204)].[/COLOR]<br><br>" +
        '[/FONT][COLOR=rgb(255, 0, 0)][FONT=georgia]Отказано[/FONT][/COLOR][COLOR=rgb(239, 239, 239)][FONT=georgia], [/FONT][/COLOR][COLOR=rgb(255, 0, 0)][FONT=georgia]Закрыто[/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=georgia].[/FONT][/COLOR][/CENTER]',
      prefix: UNACCEPT_PREFIX,
      status: false,
        
    },
    {
        title: ' Дубликат ',
        content: 
        '[CENTER][COLOR=rgb(255, 0, 0)][FONT=georgia]{{ greeting }}, уважаемый {{ user.mention }}.[/FONT][/COLOR][/CENTER]<br><br>' +
        "[CENTER][FONT=georgia]Напоминаю, прекратите дублирование,иначе ваш форумный аккаунт будет заблокирован[COLOR=rgb(204, 204, 204)].[/COLOR][/FONT]<br><br>" +
        '[COLOR=rgb(255, 0, 0)][FONT=georgia]Закрыто.[/FONT][/COLOR][/CENTER]',
     prefix: UNACCEPT_PREFIX,
     status: false,
    },
    {
        title: ' Не рабочий ссылка ',
        content:
        '[CENTER][COLOR=rgb(255, 0, 0)][FONT=georgia]{{ greeting }}, уважаемый {{ user.mention }}.[/FONT][/COLOR][/CENTER]<br><br>' +
        "[CENTER][FONT=georgia]Ваша ссылка не работает! Прикрепите рабочую ссылку[COLOR=rgb(209, 213, 216)].[/COLOR]<br><br>" +
        '[COLOR=rgb(255, 0, 0)]Отказано[/COLOR][COLOR=rgb(239, 239, 239)],[/COLOR][COLOR=rgb(255, 0, 0)] Закрыто[/COLOR][COLOR=rgb(209, 213, 216)].[/COLOR][/FONT][/CENTER]',
      prefix: UNACCEPT_PREFIX,
      status: false,
    
    },
    {
        title: ' в обжалования ',
        content: 
        '[CENTER][COLOR=rgb(255, 0, 0)][FONT=georgia]{{ greeting }}, уважаемый {{ user.mention }}.[/FONT][/COLOR][/CENTER]<br><br>' +
        "[CENTER][FONT=georgia]Обратитесь в раздел обжалований наказаний[COLOR=rgb(209, 213, 216)].[/COLOR]<br><br>" +
        '[COLOR=rgb(255, 0, 0)]Закрыто[/COLOR][COLOR=rgb(209, 213, 216)].[/COLOR][/FONT][/CENTER]',
       prefix: UNACCEPT_PREFIX,
       status: false,
    },
    {
        title: ' На тех спец ',
        content:
        '[CENTER][COLOR=rgb(255, 0, 0)][FONT=georgia]{{ greeting }}, уважаемый {{ user.mention }}.[/FONT][/COLOR][/CENTER]<br><br>' +
        "[CENTER][FONT=georgia]Обратитесь в раздел жалоб на Технических Специалистов [URL='https://forum.blackrussia.online/index.php?forums/%D0%A2%D0%B5%D1%85%D0%BD%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%B8%D0%B9-%D1%80%D0%B0%D0%B7%D0%B4%D0%B5%D0%BB.22/']*нажмите*[/URL][/FONT][/CENTER]<br><br>" +
        '[COLOR=rgb(255, 0, 0)][FONT=georgia]Закрыто.[/FONT][/COLOR][/CENTER]',
       prefix: CLOSE_PREFIX,
       status: false,
    },
    {
        title: ' Недосточна доказательства ',
        content: 
        '[CENTER][COLOR=rgb(255, 0, 0)][FONT=georgia]{{ greeting }}, уважаемый {{ user.mention }}.[/FONT][/COLOR][/CENTER]<br><br>' +
        "[CENTER][FONT=georgia][COLOR=rgb(239, 239, 239)]Н[/COLOR]едостаточно доказательств, которые подтверждают нарушение Администратора[COLOR=rgb(209, 213, 216)].[/COLOR]<br><br>" +
        '[COLOR=rgb(255, 0, 0)]Отказано[/COLOR][COLOR=rgb(239, 239, 239)],[/COLOR][COLOR=rgb(255, 0, 0)] Закрыто[/COLOR][COLOR=rgb(209, 213, 216)].[/COLOR][/FONT][/CENTER]',
      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
        title: '___________________________________Раздел Обжалования наказании_______________________________',
    },
    {
        
        title: ' Обжалования одобрено ',
        content: 
        '[CENTER][COLOR=rgb(255, 0, 0)][FONT=georgia]{{ greeting }}, уважаемый {{ user.mention }}.[/FONT][/COLOR][/CENTER]<br><br>' +
        "[CENTER][FONT=georgia]Ваша обжалование одобрено[COLOR=rgb(204, 204, 204)].[/COLOR]<br>" +
        "[CENTER][FONT=georgia]В скором времени наказание будет снято.[/FONT][/CENTER]<br><br>" +
        '[COLOR=rgb(0, 255, 0)]Одобрено[/COLOR], Закрыто[COLOR=rgb(209, 213, 216)].[/COLOR][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
        title: ' Обжалования отказано ',
        content:
        '[CENTER][COLOR=rgb(255, 0, 0)][FONT=georgia]{{ greeting }}, уважаемый {{ user.mention }}.[/FONT][/COLOR][/CENTER]<br><br>' +
        "[CENTER][FONT=georgia]В обжаловании отказано.[/FONT][/CENTER]<br><br>" +
        '[CENTER][FONT=georgia][COLOR=rgb(255, 0, 0)]Закрыто.[/COLOR][/FONT][/CENTER]',
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
        title: ' Обжалования на рассмотрении ',
        content:
        '[CENTER][COLOR=rgb(255, 0, 0)][FONT=georgia]{{ greeting }}, уважаемый {{ user.mention }}.[/FONT][/COLOR][/CENTER]<br><br>' +
        "[CENTER][FONT=georgia][COLOR=rgb(239, 239, 239)]В[/COLOR]аша обжалование взято на рассмотрение[COLOR=rgb(209, 213, 216)].[/COLOR][/FONT]<br><br>" +
        '[COLOR=rgb(255, 255, 0)][FONT=georgia][ICODE]Ожидайте ответа.[/ICODE][/FONT][/COLOR][/CENTER]',
       prefix: PIN_PREFIX,
       status: false,
    },
    {
        title: ' На ГА ',
        content: 
        '[CENTER][COLOR=rgb(255, 0, 0)][FONT=georgia]{{ greeting }}, уважаемый {{ user.mention }}.[/FONT][/COLOR][/CENTER]<br><br>' +
        "[CENTER][FONT=georgia]Ваше обжалование передано на рассмотрение Главному Администратору.[/FONT][/CENTER]<br><br>" +
        '[COLOR=rgb(255, 255, 0)][FONT=georgia][ICODE]Ожидайте ответа.[/ICODE][/FONT][/COLOR][/CENTER]',
      prefix: GA_PREFIX,
      status: true,
    },
    {
        title: ' На СА ',
        content: 
        '[CENTER][COLOR=rgb(255, 0, 0)][FONT=georgia]{{ greeting }}, уважаемый {{ user.mention }}.[/FONT][/COLOR][/CENTER]<br><br>' +
        "[CENTER][FONT=georgia]Ваше обжалование передано на рассмотрение [COLOR=rgb(255, 0, 0)]Специальной Администрации.[/COLOR][/FONT][/CENTER]<br><br>" +
        '[COLOR=rgb(255, 255, 0)][FONT=georgia][ICODE]Ожидайте ответа.[/ICODE][/FONT][/COLOR][/CENTER]',
       prefix: SA_PREFIX,
       status: true
    },
    {
        title: ' На КП ',
        content:
        '[CENTER][COLOR=rgb(255, 0, 0)][FONT=georgia]{{ greeting }}, уважаемый {{ user.mention }}.[/FONT][/COLOR][/CENTER]<br><br>' +
        "[CENTER][FONT=georgia]Ваше обжалование передано на рассмотрение [COLOR=rgb(255, 255, 51)]Команде Проекта[/COLOR].[/FONT][/CENTER]<br><br>" +
        '[COLOR=rgb(255, 255, 0)][FONT=georgia][ICODE]Ожидайте ответа.[/ICODE][/FONT][/COLOR][/CENTER]',
       prefix: COMMAND_PREFIX,
       status: true,
    },
    {
        title: ' ________________________________________________________________________',
        

    

    }
        
    
    ];
 
$(document).ready(() => {
	// Загрузка скрипта для обработки шаблонов
	$('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');
 
	// Добавление кнопок при загрузке страницы
    addButton('На рассмотрение 🍁', 'pin');
    addButton('КП', 'teamProject');
    addButton('Га', 'Ga');
    addButton('Одобрено', 'accepted');
    addButton('Отказано', 'unaccept' );
    addButton('Рассмотрено', 'Rasmotreno');
    addButton('Закрыто','Close');
    addButton('Вердикты', 'selectAnswer');
 
 
	// Поиск информации о теме
	const threadData = getThreadData();
 
	$('button#pin').click(() => editThreadData(PIN_PREFIX, true));
	$('button#teamProject').click(() => editThreadData(COMMAND_PREFIX, true));
	$('button#Ga').click(() => editThreadData(GA_PREFIX, true));
	$('button#Spec').click(() => editThreadData(SPECY_PREFIX, true));
	$('button#accepted').click(() => editThreadData(ACCEPT_PREFIX, false));
	$('button#unaccept').click(() => editThreadData(UNACCEPT_PREFIX, false));
	$('button#Texy').click(() => editThreadData(TEX_PREFIX, true));
	$('button#Rasmotreno').click(() => editThreadData(RASSMOTENO_PREFIX, false));
	$('button#Close').click(() => editThreadData(CLOSE_PREFIX, false));
 
	$(`button#selectAnswer`).click(() => {
		XF.alert(buttonsMarkup(buttons), null, 'Выберите ответ:');
		buttons.forEach((btn, id) => {
			if(id > 1) {
				$(`button#answers-${id}`).click(() => pasteContent(id, threadData, true));
			} else {
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
 
	if(send == true){
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
	4 < hours && hours <= 11
	  ? 'Доброе утро'
	  : 11 < hours && hours <= 15
	  ? 'Добрый день'
	  : 15 < hours && hours <= 21
	  ? 'Добрый вечер'
	  : 'Доброй ночи',
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
}
 
function getFormData(data) {
	const formData = new FormData();
	Object.entries(data).forEach(i => formData.append(i[0], i[1]));
	return formData;
  }
})();
 