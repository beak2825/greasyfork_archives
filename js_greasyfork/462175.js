// ==UserScript==
// @name Скрипт для рассмотрения Обжалований
// @namespace https://forum.blackrussia.online
// @version 1.8(upd)
// @description A script for the convenient handiling of appeals on the forum, for Timofey
// @author Maxim Akhmatovich (VK: @max.beteille)
// @match https://forum.blackrussia.online/index.php?threads/*
// @include https://forum.blackrussia.online/index.php?threads/
// @grant none
// @license 	 MIT
// @collaborator none
// @icon https://yapx.ru/v/SS8wT
// @copyright 2022,
// @downloadURL https://update.greasyfork.org/scripts/462175/%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D1%80%D0%B0%D1%81%D1%81%D0%BC%D0%BE%D1%82%D1%80%D0%B5%D0%BD%D0%B8%D1%8F%20%D0%9E%D0%B1%D0%B6%D0%B0%D0%BB%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D0%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/462175/%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D1%80%D0%B0%D1%81%D1%81%D0%BC%D0%BE%D1%82%D1%80%D0%B5%D0%BD%D0%B8%D1%8F%20%D0%9E%D0%B1%D0%B6%D0%B0%D0%BB%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D0%B9.meta.js
// ==/UserScript==   

(function () { 
	'use strict';
const FAIL_PREFIX = 4;
const OKAY_PREFIX = 8;
const WAIT_PREFIX = 2;
const TECH_PREFIX = 13;
const WATCH_PREFIX = 9;
const CLOSE_PREFIX = 7;
const GA_PREFIX = 12;
const SA_PREFIX = 11;
const CP_PREFIX = 10;
const buttons = [
	{
	 title: '------Приветствие------', 
	 content:
		'[SIZE=3][FONT=Georgia][CENTER]Здравствуйте, уважаемый игрок.[/CENTER]<br><br>' +
       "[CENTER]пиши всемто этого[/CENTER]<br><br>" +
        '[CENTER][/CENTER][/FONT][/SIZE]',	},
	{	
     title: '------Закрепить------',	
    },
	{	 
     title: 'На рассмотрение',	 
     content:
		'[FONT=Georgia][SIZE=3][CENTER]Здравствуйте, уважаемый игрок.[/CENTER]<br><br>' +
        "[CENTER]Ваше обжалование взято на рассмотрение. Ожидайте ответа от администрации и не нужно создавать копии этой темы.[/CENTER]<br>" + 
         '[CENTER]Ожидайте ответа.[/CENTER][/SIZE][/FONT]',	 
         prefix: WAIT_PREFIX,	 
         status: true,
	},
   {
	 title: 'Передать ГА',	 
    content:		
         '[SIZE=3][FONT=Georgia][CENTER]Здравствуйте, уважаемый игрок.[/CENTER]<br><br>' + 
        "[CENTER]Ваше обжалование передано на рассмотрение Главному Администратору.[/CENTER]<br>" +
        "[CENTER]Убедительнаяя просьба не создавать копий данной темы.[/CENTER]<br><br>" +		
        '[CENTER]Ожидайте ответа.[/CENTER][/FONT][/SIZE]',	 
         prefix: GA_PREFIX,	 
         status: true ,
	},	
   {	 title: 'Передать Спец. Адм.',	 
         content:	
    	'[SIZE=3][FONT=Georgia][CENTER]Здравствуйте, уважаемый игрок.[/CENTER]<br><br>' + 
       "[CENTER]Ваше обжалование передано на рассмотрение Специальному Администратору.[/CENTER]<br>" +
       "[CENTER]Убедительнаяя просьба не создавать копий данной темы.[/CENTER]<br><br>" +		
        '[CENTER]Ожидайте ответа.[/CENTER][/FONT][/SIZE]',	 
         prefix: SA_PREFIX,	 
         status: true,
	},	
   {	 
         title: 'Передать Команде Проекта',	
         content:	
	    '[SIZE=3][FONT=Georgia][CENTER]Здравствуйте, уважаемый игрок.[/CENTER]<br><br>' + 
       "[CENTER]Ваше обжалование передано на рассмотрение Команде Проекта.[/CENTER]<br>" +
       "[CENTER]Убедительнаяя просьба не создавать копий данной темы.[/CENTER]<br><br>" +	
    	'[CENTER]Ожидайте ответа.[/CENTER][/FONT][/SIZE]',	
         prefix: CP_PREFIX,	 
         status: true,	 
    }, 
    {	 title: '------Отказы------',	
    }, 
	{     title: 'Дублирование темы',
           content: 
          '[CENTER][SIZE=3][FONT=Georgia] Здравствуйте уважаемый игрок.[/CENTER]<br><br>'+
          '[CENTER]Напоминаю, за дублирование тем ваш форумный аккаунт может быть заблокирован.[/CENTER]<br><br>'+ 
           '[CENTER]Отказано, Закрыто.[/CENTER][/FONT][/SIZE]', 
            prefix: FAIL_PREFIX, 
            status: false,
     },
     {	 
             title: ' В обжаловании отказано',
        	 content:	
        	'[SIZE=3][FONT=Georgia][CENTER] Здравствуйте уважаемый игрок.[/CENTER]<br><br>' +
            "[CENTER]В вашем обжаловании отказано.[/CENTER]<br><br>" +
            '[CENTER]Закрыто.[/CENTER][/FONT][/SIZE]',	
             prefix: FAIL_PREFIX,	 
             status: false,
  	},
     {	 title: 'Обжалованию не подлежит',
      	 content:	
      	'[SIZE=3][FONT=Georgia][CENTER] Здравствуйте уважаемый игрок.[/CENTER]<br><br>' + 
         "[CENTER]Данное наказание не подлежит обжалованию.[/CENTER]<br><br>" +
          '[CENTER]Закрыто.[/CENTER][/FONT][/SIZE]',	 
           prefix: FAIL_PREFIX,	
           status: false,
       	},  
           {	 title: 'Уже и так мин. наказание',	
                 content:	
             	'[SIZE=3][FONT=Georgia][CENTER] Здравствуйте уважаемый игрок.[/CENTER]<br><br>' + 
                "[CENTER]Вам и так выдано минимальное наказание за данное нарушение.[/CENTER]<br><br>" +
                 '[CENTER]Закрыто.[/CENTER][/FONT][/SIZE]',	 
                  prefix: FAIL_PREFIX,	
                  status: false,
       	}, 
           {	 title: 'Не по форме',	 
                 content:	
             	'[SIZE=3][FONT=Georgia][CENTER] Здравствуйте уважаемый игрок.[/CENTER]<br><br>' +
                "[CENTER]Обжалование составлено не по форме. Внимательно прочитайте правила составления обжалования, которые закреплены в этом разделе.[/CENTER]<br><br>" +
                 '[CENTER]Закрыто.[/CENTER][/FONT][/SIZE]',
            	 prefix: FAIL_PREFIX,	 
                 status: false,
       	},
           {	 title: 'Заголовок не по форме',	 
                 content:	
            	'[SIZE=3][FONT=Georgia][CENTER] Здравствуйте уважаемый игрок.[/CENTER]<br><br>' + 
                "[CENTER]Заголовок обжалования не по форме. Внимательно прочитайте правила составления обжалования, которые закреплены в этом разделе.[/CENTER]<br><br>" +
                '[CENTER]Закрыто.[/CENTER][/FONT][/SIZE]',	
                prefix: FAIL_PREFIX,	
                status: false,
       	},
{title: 'Жалоба на теха',content:'[SIZE=3][FONT=Georgia][CENTER]Здравствуйте.[/CENTER]<br><br>' +"[CENTER]Обратитесь в раздел Жалобы на технических специалистов.<br><br>" +'[CENTER]Отказано.[/CENTER][/FONT][/SIZE]',prefix: FAIL_PREFIX,status: false,},	
           {	 title: 'Направить в раздел ЖБ на Адм',
            	 content:	
             	'[SIZE=3][FONT=Georgia][CENTER] Здравствуйте уважаемый игрок.[/CENTER]<br><br>' +
                 "[CENTER] Внимательно ознакомившись с вашим обжалованием, было решено,что вам нужно обратиться в раздел Жалоб на администрацию.[/CENTER]<br><br>" +
                 '[CENTER]Закрыто.[/CENTER][/FONT][/SIZE]',
            	 prefix: FAIL_PREFIX,	
                 status: false,	
           }, 
          {
	              title: '------Одобрения------',
      	}, 
         { 
                  title:'Наказание сократить на половину', 
                  content:
                 '[SIZE=3][FONT=Georgia][CENTER] Здравствуйте уважаемый игрок.[/CENTER]<br><br>' +
                 "[CENTER]Ваше обжалование было рассмотрено и принято решение о сокращении вашего наказания на половину.[/CENTER]<br><br>" +
                 '[CENTER]Закрыто[/CENTER][/FONT][/SIZE]',
                 prefix: OKAY_PREFIX, 
                 status: false, 
           },
           {	 title: 'Наказание будет снято полностью',
            	 content:	
             	'[SIZE=3][FONT=Georgia][CENTER] Здравствуйте уважаемый игрок.[/CENTER]<br><br>' +
                "[CENTER]Ваше обжалование одобрено и наказание будет полностью снято.[/CENTER]<br><br>" + 
                '[CENTER]Закрыто.[/CENTER][/FONT][/SIZE]',
            	 prefix: OKAY_PREFIX,
           	 status: false,
         	},	
             {	 title: 'Наказание сократить до минимума',	
                   content:	
              	'[SIZE=3][FONT=Georgia][CENTER] Здравствуйте уважаемый игрок.[/CENTER]<br><br>' + 
                 "[CENTER]Ваше обжалование было рассмотрено и принято решение о сокращении вашего наказания до минимальных мер.[/CENTER]<br><br>" +
                  '[CENTER]Закрыто.[/CENTER][/FONT][/SIZE]',	 
                   prefix: OKAY_PREFIX,
             	 status: false,
           	},
              {	 title: '==Приятной работы на форуме ;) ==',
          	},
              {     title: 'Поздравляю, 2 года на ЗГА 12!',
              },
 ]; 

$(document).ready(() => {

$('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');

addButton('На рассмотрение', 'pin');

addButton('Одобрено', 'accepted');

addButton('Отказано', 'unaccept');

addButton('Рассмотрено', 'watch');

addButton('Закрыто', 'close');

addButton('|•|', '');

addButton('Меню ответов', 'selectAnswer');

addButton('|•|', '');

const threadData = getThreadData();

$('button#pin').click(() => editThreadData(WAIT_PREFIX, true));

$('button#accepted').click(() => editThreadData(OKAY_PREFIX, false));

$('button#watch').click(() => editThreadData(WATCH_PREFIX, false));

$('button#close').click(() => editThreadData(CLOSE_PREFIX, false));

$('button#unaccept').click(() => editThreadData(FAIL_PREFIX, false));

$(`button#selectAnswer`).click(() => {

XF.alert(buttonsMarkup(buttons), null, 'Выберите ответ:');

buttons.forEach((btn, id) => {

if((id > 0) && (id < 64)) {

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

ticky: 1, 

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