// ==UserScript==
// @name         scripts for ГС / ЗГС АП by Normin
// @namespace    https://forum.blackrussia.online
// @version      1.00
// @description  скрипт для ГС / ЗГС АП
// @author       normin
// @match        https://forum.blackrussia.online/threads/*
// @include      https://forum.blackrussia.online/threads/
// @grant        none
// @license      MIT
// @collaborator none
// @icon        https://sun9-27.userapi.com/s/v1/if2/CJnbLwBh1IqYRD0Q9zGvA_4Mwl7gFL8FoZmn3ePTEjmSHmUGXM9e5iT7YpyPF3YSCkcsTd0v6OD1H17--sn67pR2.jpg?quality=95&as=32x28,48x42,72x62,108x93,160x138,240x208,360x311,480x415,540x467,640x553,720x623,1080x934,1280x1107,1440x1245,2560x2214&from=bu&cs=2560x0
// @downloadURL https://update.greasyfork.org/scripts/549245/scripts%20for%20%D0%93%D0%A1%20%20%D0%97%D0%93%D0%A1%20%D0%90%D0%9F%20by%20Normin.user.js
// @updateURL https://update.greasyfork.org/scripts/549245/scripts%20for%20%D0%93%D0%A1%20%20%D0%97%D0%93%D0%A1%20%D0%90%D0%9F%20by%20Normin.meta.js
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
      title: '-----------------------------------------------------------снятие наказание------------------------------------------------------',
    },

    {
      title: 'одобрено снятие наказание',
content:
        '[FONT=Verdana]Приветствую.<br><br>' +
        'Ваше наказание было снято.<br><br>',
    },

    {
      title: 'отказано снятие наказние | нет наказания',
      content:
       '[FONT=Verdana]Приветствую.<br><br>' +
       'У вас отсуствует наказание.<br><br>',
      status: false,
    },

     {
      title: 'отказано снятие наказние | док - тв нет',
      content:
       '[FONT=Verdana]Приветствую.<br><br>' +
       'Доказательства, не были предоставлены.<br><br>',
      status: false,
    },
      {
      title: 'отказано снятие наказние | не по форме',
      content:
       '[FONT=Verdana]Приветствую.<br><br>' +
       'Заявление составлено не по форме.<br>'+
 'Ниже указана действующая форма подачи заявления на снятие наказания.<br><br>' +
          '[hr][/hr]<br><br>'+
'[CENTER]1. Ваш Nick_Name :<br>'+
'2. Наказание ( Выговор / Предупреждение ) :<br>' +
'3. Дата получения наказания :<br>' +
'4. За что получили наказание :<br>' +
'5. Дата, когда выполнялось задание для снятия наказания :<br>' +
'6. Осознаете ли вы что нарушили правила :<br>' +
'7. Скриншот /hstats, загруженный на фотохостинг :<br><br>',
      status: false,
    },
   {
      title: 'отказано снятие наказние | 1 день',
      content:
       '[FONT=Verdana]Приветствую.<br><br>' +
       'Снять наказание можно только через 1 день, после выдачи.<br><br>',
      status: false,
    },
       {
      title: 'отказано снятие наказние | /time',
      content:
       'Приветствую.<br><br>' +
        'На вашем скриншоте отсутствует /time.<br><br>',
      status: false,
    },
     {
      title: '------------------------------------------------------ жалоба на АП ------------------------------------------------',
         },
   {
      title: 'одобренная жалоба на АП',
      content:
       '[FONT=Verdana]Приветствую.<br><br>' +
       'В сторону Агента Поддержки будут приняты необходимые меры.<br><br>' +
       'Профилактическая беседа будет проведена.<br><br>' +
        'Благодарим за информацию.<br><br>',
      status: false,
    },
      {
      title: 'отказано жалоба на АП | недостаточно док - ва',
      content:
       '[FONT=Verdana]Приветствую.<br><br>' +
       'Недостаточно доказательств.<br><br>',
      status: false,
    },
           {
      title: 'отказано жалоба на АП | /time',
      content:
       '[FONT=Verdana]Приветствую.<br><br>' +
       'На вашем скриншоте отсутствует /time.<br><br>',
      status: false,
    },
         {
      title: 'отказано жалоба на АП | нарушений не замечано',
      content:
       '[FONT=Verdana]Приветствую. [/I][/SIZE][/FONT][/COLOR]<br><br>' +
       'Со стороны Агента поддержки, нарушений не замечано.<br><br>',
      status: false,
    },
     {
      title: '---------------------------------------------------------- отрботка неактива -------------------------------------------------------',
    },
     {
      title: 'одобрена отработка неактива',
      content:
       '[FONT=Verdana]Приветствую.<br><br>' +
       'Ваш неактив был убран, вместо него стоит норма.<br><br>',
      status: false,
    },
         {
      title: 'отказано отработка неактива | time',
      content:
       '[FONT=Verdana]Приветствую.<br><br>'+
       'На вашем скриншоте отсутствует /time.<br><br>',
      status: false,
    },
         {
      title: 'отказано отработка неактива | требования',
      content:
       '[FONT=Verdana]Приветствую.<br><br>' +
       'Вы не вполнили требования для одобрения.<br><br>' +
       'Внимательно прочитайте, и ознакомтесь с требованиями, для одобрения отработки неактива.<br><br>',
      status: false,
    },
       {
      title: 'отказано отработка неактива | нет доступа',
      content:
       '[FONT=Verdana]Приветствую.<br><br>' +
       'Нет доступа, к фотографии статистики.<br><br>' +
           'Если у вас возникают какие - либо трудности с открытием доступа, напишите мне, я вас проинструктирую.<br><br>',
      status: false,
    },
     {
      title: '----------------------------------------------- отработка недо норматива ------------------------------------------------------------',
    },
        {
      title: 'одобрена отработка недо норматива',
                content:
       '[FONT=Verdana]Приветствую.<br><br>' +
       'Ваша недонорма была убрана, вместо нее стоит норма.<br><br>',
      status: false,
    },
             {
      title: 'отказано отработка недо норматива | time',
      content:
       '[FONT=Verdana]Приветствую.<br><br>' +
       'На вашем скриншоте отсутствует /time.<br><br>',
      status: false,
    },
      {
      title: 'отказано отработка недо норматива | требования',
      content:
       '[FONT=Verdana]Приветствую.<br><br>' +
       'Вы не вполнили требования для одобрения.<br><br>' +
       'Внимательно прочитайте, и ознакомтесь с требованиями, для одобрения отработки недонорматива.<br><br>',
      status: false,
    },
        {
      title: 'отказано отработка недо норматив | нет доступа',
      content:
       '[FONT=Verdana]Приветствую.<br><br>' +
       'Нет доступа, к фотографии статистики.<br><br>' +
           'Если у вас возникают какие - либо трудности с открытием доступа, напишите мне, я вас проинструктирую.<br><br>',
      status: false,
    },
       {
      title: '------------------------------------------------------------------заявки на ап-----------------------------------------------------------',
    content:
       '[CENTER][FONT=Verdana][SIZE=5][COLOR=rgb(127, 199, 255)]Приветствую.[/COLOR][/SIZE]<br><br>' +
       'Просмотрев ваши заявления, выношу вердикт:<br><br>' +
           '[HR][/HR]<br><br>' +
       '[COLOR=rgb(0,255,0)][SIZE=5]список допущенных к обзвону :[/COLOR]<br><br><br>' +
           '[HR][/HR]<br><br>' +
        '[COLOR=rgb(255, 17, 17)]список не допущенных к обзвону, и причина :[/SIZE][/COLOR]<br><br><br>'+
        '[HR][/HR]<br><br>' +
           '[SIZE=4]ВСЕ КТО ОДОБРЕНЫ, В БЛИЖАЙШЕЕ ВРЕМЯ ВЫ БУДЕТЕ ДОБАВЛЕНЫ В БЕСЕДУ КАНДИДАТОВ.<br>'+
        'ОТКРОЙТЕ ЛИЧНЫЕ СООБЩЕНИЯ, ДЛЯ СВЯЗИ С ВАМИ.<br><br>'+
           'ОБЗВОН БУДЕТ ПРОИСХОДИТЬ В ОФИЦИАЛЬНОМ ДИСКОРД КАНАЛЕ [COLOR=rgb(147, 112, 216)]SAMARA[/COLOR] [URL=https://discord.com/invite/9p6DPBR6mk]НАЖМИТЕ.[/URL] [/size]<br><br>'+
           '[HR][/HR]<br><br>'+
       ' [I][COLOR=rgb(255, 17, 17)][FONT=georgia][SIZE=6]! WARNING ![/FONT]<br>'+
       '[FONT=Verdana]АДМИНИСТРАЦИЯ, НИКОГДА НЕ ПРОСИТ ВАШ ПАРОЛЬ ОТ АККАУНТА[/SIZE][/COLOR]<br><br>',
       status: false,
   },
  ];
$(document).ready(() => {
    // Загрузка скрипта для обработки шаблонов
    $('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');


    // Добавление кнопок при загрузке страницы
    addButton('ответы', 'selectAnswer');

    // Поиск информации о теме
    const threadData = getThreadData();


    $('button#pin').click(() => editThreadData(PIN_PREFIX, true));
    $('button#accepted').click(() => editThreadData(ACCEPT_PREFIX, false));
    $('button#unaccept').click(() => editThreadData(UNACCEPT_PREFIX, false));
    $('button#close').click(() => editThreadData(CLOSE_PREFIX, false));


    $(`button#selectAnswer`).click(() => {
        XF.alert(buttonsMarkup(buttons), null, 'Выберите ответ');
        buttons.forEach((btn, id) => {
            if(id > 0) {
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
        //editThreadData(buttons[id].prefix, buttons[id].status);//
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
    12 < hours && hours <= 18
      ? 'Доброе утро'
      : 18 < hours && hours <= 21
      ? 'Добрый день'
      : 21 < hours && hours <= 4
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