// // ==UserScript== 
// @name         Скрипт ЗГА Ilya_Vishnekov irkutsk by Devil
// @namespace    https://forum.blackrussia.online
// @version      4.5
// @description  The best revenge is a huge success. 
// @author       Michael_Fiend
// @match        https://forum.blackrussia.online/index.php?threads/*
// @include      https://forum.blackrussia.online/index.php?threads/
// @grant        none
// @license      MIT
// @collaborator Devil
// @icon https://icons.iconarchive.com/icons/google/noto-emoji-people-bodyparts/256/11960-victory-hand-light-skin-tone-icon.png
// @downloadURL https://update.greasyfork.org/scripts/464385/%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%97%D0%93%D0%90%20Ilya_Vishnekov%20irkutsk%20by%20Devil.user.js
// @updateURL https://update.greasyfork.org/scripts/464385/%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%97%D0%93%D0%90%20Ilya_Vishnekov%20irkutsk%20by%20Devil.meta.js
// ==/UserScript==
 
(function () {
  'use strict';
const UNACCEPT_PREFIX = 4; // Prefix that will be set when thread closes
const ACCEPT_PREFIX = 8; // Prefix that will be set when thread accepted
const PIN_PREFIX = 2; // Prefix that will be set when thread pins
const COMMAND_PREFIX = 10; // Prefix that will be set when thread send to project team
const WATCHED_PREFIX = 9;
const CLOSE_PREFIX = 7; // Prefix that will be set when thread closes.
const SA_PREFIX = 11;
const GA_PREFIX = 12;
const V_PREFIX = 1;
const buttons = [
    {
     
	                                   title: '| _________Раздел Жалобы на администрацию_________ |',
	},
    {
  title: 'Приветствие',
      content:
        '[FONT=Arial]{{ greeting }}, уважаемый {{ user.mention }}.[/FONT][/I]',
    },
    {   
   title: 'Запрошу док-ва',
      content:
        '[FONT=Arial][SIZE=4]{{ greeting }}[/SIZE][/FONT]<br><br>' +
        "[SIZE=4][FONT=Arial] Запрошу доказательства у администратора.[/FONT]<br><br>" +
        '[FONT=Arial]Ожидайте, пожалуйста, ответа.[/FONT][/SIZE]<br>',
      prefix: PIN_PREFIX,
      status: true,
    },
    {
      title: 'на рассмотрение',
      content:
        '[SIZE=4][FONT=Arial]{{ greeting }}[/FONT][/SIZE]<br><br>' +
        "[SIZE=4][FONT=Arial]Ваша жалоба взята на рассмотрение.[/FONT][/SIZE]<br><br>" +
        '[SIZE=4][FONT=Arial]Oжидайте ответа в этой теме.[/FONT][/SIZE]<br>',
      prefix: PIN_PREFIX,
      status: true,
    },
    {
      title: 'док ва предоставлены',
      content:
        '[FONT=Arial][SIZE=4]{{ greeting }}[/SIZE][/FONT]<br><br>' +
       
 "[FONT=Arial][SIZE=4]Доказательства предоставлены, наказание выдано верно.[/SIZE][/FONT]<br><br>" +
        
'[FONT=Arial][SIZE=4]Отказано.[/SIZE][/FONT]<br>',
      prefix: UNACCEPT_PREFIX,
      status: false
    },
    {
      title: 'Передано ГА',
      content:
        '[FONT=Arial][SIZE=4]{{ greeting }}[/SIZE][/FONT]<br><br>' +
        "[FONT=Arial][SIZE=4]Ваша жалоба переадресована на рассмотрение [/SIZE][/FONT][FONT=Arial][SIZE=4] Главному Администратору[/SIZE][/FONT][FONT=Arial][SIZE=4].[/SIZE][/FONT]<br><br>" +
        '[FONT=Arial][SIZE=4]Ожидайте ответа в данной теме, копии создавать не нужно.[/SIZE][/FONT]<br>',
      prefix: GA_PREFIX,
      status: true,
    },
    {
       title: 'Ответ дан раннее',
      content:
        '[FONT=Arial][SIZE=4]{{ greeting }}[/SIZE][/FONT]<br><br>' +
        "[SIZE=4][FONT=Arial]Вам уже ранее был дан корректный ответ в прошлой теме, за создание дубликатов этой темы ваш форумный аккаунт может быть заблокирован.[/FONT][/SIZE]<br><br>" +
        '[FONT=Arial][SIZE=4]Закрыто.[/SIZE][/FONT]<br>',
      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
        title: 'наказание будет снято',
      content:
        '[FONT=Arial][SIZE=4]{{ greeting }}[/SIZE][/FONT]<br><br>' +
        "[SIZE=4][FONT=Arial]Администратор допустил ошибку.<br><br>" +
        "[FONT=Arial][SIZE=4]Ваше наказание будет снято.[/SIZE][/FONT]<br><br>" +
        '[FONT=Arial][SIZE=4]Закрыто.[/SIZE][/FONT]<br>',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
       title: 'Недостаточно док-в',
      content:
        '[FONT=Arial][SIZE=4]{{ greeting }}[/SIZE][/FONT]<br><br>' +
        "[FONT=Arial][SIZE=4]Недостаточно доказательств для корректного рассмотрение жалобы.[/SIZE][/FONT]<br><br>" +
        '[FONT=Arial][SIZE=4]Закрыто.[/SIZE][/FONT]<br>',
      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
      title: 'Док-ва отред.',
      content:
        '[FONT=Arial][SIZE=4]{{ greeting }}[/SIZE][/FONT]<br><br>' +
        
'[FONT=Arial][SIZE=4]Ваши доказательства были подвергнуты изменениям (редактированию), прикрепите оригинальные файлы.[/SIZE][/FONT]<br><br>' +
        
'[FONT=Arial][SIZE=4]Отказано.[/SIZE][/FONT]<br>',
      prefix: UNACCEPT_PREFIX,
      status: false
    },
    {
 
      title: 'Отсутст. док-ва',
      content:
        '[FONT=Arial][SIZE=4]{{ greeting }}[/SIZE][/FONT]<br><br>' +
        "[FONT=Arial][SIZE=4]Отсутствуют доказательства - следовательно, рассмотрению не подлежит.[/SIZE][/FONT]<br><br>" +
        '[FONT=Arial][SIZE=4]Отказано.[/SIZE][/FONT]<br>',
      prefix: UNACCEPT_PREFIX,
      status: false
    },
    {
      title: 'Тех. спец.',
      content:
        '[FONT=Arial][SIZE=4]{{ greeting }}[/SIZE][/FONT]<br><br>' +
        
"[FONT=Arial][SIZE=4]Обратитесь в раздел жалоб на Технических специалистов[/SIZE][/FONT][FONT=Arial][SIZE=4][/SIZE][/FONT]<br><br>" +
 
'[FONT=Arial][SIZE=4]Отказано.[/SIZE][/FONT]<br>',
     prefix: UNACCEPT_PREFIX,
      status: false
    },
    {
     title: 'Не по теме',
      content:
        '[FONT=Arial][SIZE=4]{{ greeting }}[/SIZE][/FONT]<br><br>' +
        
"[FONT=Arial][SIZE=4]Ваше сообщение никоим образом не относится к предназначению данного раздела.[/SIZE][/FONT]<br><br>" +
        
'[FONT=Arial][SIZE=4]Отказано.[/SIZE][/FONT]<br>',
    prefix: UNACCEPT_PREFIX,
      status: false
    },
    {
      title: 'В обжалования',
      content:
        '[FONT=Arial][SIZE=4]{{ greeting }}[/SIZE][/FONT]<br><br>' +
       
 "[FONT=Arial][SIZE=4]Обратитесь в раздел обжалований наказаний.[/SIZE][/FONT]<br><br>" +
        
'[FONT=Arial][SIZE=4]Отказано.[/SIZE][/FONT]<br>',
      prefix: UNACCEPT_PREFIX,
      status: false
    },
    {
      title: 'Прошло 48 часов',
      content:
      '[FONT=Arial][SIZE=4]{{ greeting }}[/SIZE][/FONT]<br><br>' +
        "[FONT=Arial][SIZE=4]Срок написания жалобы - 48 часа с момента выдачи наказания.[/SIZE][/FONT]<br><br>" +
        "[FONT=Arial][SIZE=4]Внимательно прочитайте правила составления жалоб, которые закреплены в этом разделе.[/SIZE][/FONT]<br><br>" +
        '[FONT=Arial][SIZE=4]Закрыто.[/SIZE][/FONT]<br>',
      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
      title: 'ЖБ Не по форме',
      content:
        '[FONT=Arial][SIZE=4]{{ greeting }}[/SIZE][/FONT]<br><br>' +
        
"[SIZE=4][FONT=Arial]Ваша жалоба составлена не по форме.<br><br>" +

        '[FONT=Arial][SIZE=4]Отказано.[/SIZE][/FONT]<br>',
      prefix: UNACCEPT_PREFIX,
      status: false
    },
    {
      title: 'Передано СА',
      content:
        '[FONT=Arial][SIZE=4]{{ greeting }}[/SIZE][/FONT]<br><br>' +
        
"[FONT=Arial][SIZE=4]Ваша жалоба переадресована [/SIZE][/FONT][/I][I][FONT=Arial][SIZE=4]Специальному Администратору[/SIZE][/FONT][FONT=Arial][SIZE=4].[/SIZE][/FONT]<br><br>" +
        
'[FONT=Arial][SIZE=4]Ожидайте ответа в данной теме, копии создавать не нужно.[/SIZE][/FONT]<br>',
      prefix: SA_PREFIX,
      status: true,
    },
    {
      title: 'Док-ва в соц. сетях',
      content:
        '[FONT=Arial][SIZE=4]{{ greeting }}[/SIZE][/FONT]<br><br>' +
        "[SIZE=4][FONT=Arial]Доказательства в социальных сетях и т.д. не принимаются.[/FONT][/SIZE]<br><br>" +
        "[SIZE=4][FONT=Arial]Загрузите доказательства на фото-видео хостинги YouTube, Imgur, Yapx и так далее.[/FONT][/SIZE]<br><br>" +
        '[FONT=Arial][SIZE=4]Закрыто.[/SIZE][/FONT]<br>',
      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
      title: 'нет нарушений от адм',
      content:
        '[FONT=Arial][SIZE=4]{{ greeting }}[/SIZE][/FONT]<br><br>' +
        "[SIZE=4][FONT=Arial]Нарушений со стороны администратора нет.[/FONT][/SIZE]<br><br>" +
        '[FONT=Arial][SIZE=4]Отказано.[/SIZE][/FONT]<br>',
      prefix: UNACCEPT_PREFIX,
      status: false
    },
    {
      title: 'Выдано верно',
      content:
        '[FONT=Arial][SIZE=4]{{ greeting }}[/SIZE][/FONT]<br><br>' +
        "[SIZE=4][FONT=Arial]Доказательства предоставлены наказание выдано верно.[/FONT][/SIZE]<br><br>" +
              
        '[FONT=Arial][SIZE=4]Отказано.[/SIZE][/FONT]<br>',
      prefix: UNACCEPT_PREFIX,
      status: false
   },
    {
      title: 'Окно бана',
      content:
        '[FONT=Arial][SIZE=4]{{ greeting }}<br><br>' +
        '[FONT=Arial][SIZE=4]Прикрепите в доказательства скриншот окна блокировки, которое появляется сразу после входа в игру.<br><br>' +
        '[FONT=Arial][SIZE=4]Отказано.[/SIZE][/FONT]<br>',
      prefix: UNACCEPT_PREFIX,
      status: false
},
      {
         title: 'будет наказан',
         content:
        '[FONT=Arial][SIZE=4]{{ greeting }}[/SIZE][/FONT]<br><br>' +
        "[SIZE=4][FONT=Arial]Администратор будет наказан.[/FONT][/SIZE]<br><br>" +
        "[FONT=Arial][SIZE=4]Приносим свои извинения за доставленные неудобства.<br><br>" +
        '[FONT=Arial][SIZE=4]Одобрено.[/SIZE][/FONT]<br>',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: 'беседа с адм',
      content:
        '[FONT=Arial][SIZE=4]{{ greeting }}[/SIZE][/FONT]<br><br>' +
        "[SIZE=4][FONT=Arial]С администратором будет проведена беседа.[/FONT][/SIZE]<br><br>" +
        '[FONT=Arial][SIZE=4]Закрыто.[/SIZE][/FONT]<br>',
      prefix: ACCEPT_PREFIX,
      status: false,
  },
      {
	  title: '| _________Раздел обжалования_________ |',
	},
    {
      title: 'Приветствие',
      content:
        '[I][FONT=Courier New]{{ greeting }}[/FONT][/I]',
},
    {
      title: 'Обж. отказано',
      content:
        '[FONT=Arial][SIZE=4]{{ greeting }}[/SIZE][/FONT]<br><br>' +
        
         "[FONT=Arial][SIZE=4][FONT=Arial]В обжаловании отказано.[/FONT][/SIZE]<br><br>" +
        
        '[FONT=Arial][SIZE=4]Закрыто.[/SIZE]<br>',
      prefix: CLOSE_PREFIX,
      status: false
    },
    {
      title: 'Обж. не подлежит',
      content:
        '[FONT=Arial][SIZE=4]{{ greeting }}[/SIZE][/FONT]<br><br>' +
        "[SIZE=4][FONT=Arial]Данное нарушение обжалованию не подлежит.[/FONT][/SIZE]<br><br>" +
        '[SIZE=4][FONT=Arial]Закрыто.[/FONT][/SIZE]<br>',
    prefix: CLOSE_PREFIX,
      status: false
    },
    {
      title: 'Обж. не по форме',
      content:
        '[FONT=Arial][SIZE=4]{{ greeting }}[/SIZE][/FONT]<br><br>' +
        
        "[SIZE=4][FONT=Arial]Обжалование составлено не по форме.[/FONT][/SIZE]<br><br>" +
        
        "[SIZE=4][FONT=Arial]Внимательно прочитайте правила составления обжалований[/FONT][/SIZE][SIZE=4][FONT=Arial][/FONT][/SIZE]<br><br>" +
        
        '[FONT=Arial][SIZE=4]Отказано.[/SIZE][/FONT]<br>',
     prefix: UNACCEPT_PREFIX,
      status: false
    },
    {
      title: 'Обж. передано ГА',
      content:
       '[FONT=Arial][SIZE=4]{{ greeting }}[/SIZE][/FONT]<br><br>' +
        "[FONT=Arial][SIZE=4]Ваше обжалование переадресовано на рассмотрение[/SIZE][/FONT][FONT=Arial][SIZE=4] Главному Администратору[/SIZE][/FONT].[/SIZE][/FONT]<br><br>" +
        '[FONT=Arial][SIZE=4]Ожидайте ответа в данной теме, копии создавать не нужно.<br>',
      prefix: GA_PREFIX,
      status: true,
    },
    {
title: 'Ответ дан раннее',
      content:
        '[FONT=Arial][SIZE=4]{{ greeting }}[/SIZE][/FONT]<br><br>' +
        
        "[SIZE=4][FONT=Arial]Вам уже ранее был дан корректный ответ, за создание дубликатов этой темы ваш форумный аккаунт может быть заблокирован.[/FONT][/SIZE]<br><br>" +
        
        '[FONT=Arial][SIZE=4]Отказано.[/SIZE][/FONT]<br>',
      prefix: CLOSE_PREFIX,
      status: false,
    
    },
    {
      title: 'Обж. одобрено',
      content:
        '[FONT=Arial][SIZE=4]{{ greeting }}[/SIZE][/FONT]<br><br>' +
        
        "[SIZE=4][FONT=Arial]Ваше наказание будет снижено либо снято вовсе.[/FONT][/SIZE]<br><br>" +
        
        "[SIZE=4][FONT=Arial]В обжаловании одобрено.[/FONT][/SIZE]<br><br>" +
       
        '[FONT=Arial][SIZE=4]Закрыто.[/SIZE][/FONT]<br>',
       prefix: ACCEPT_PREFIX,
      status: false,
     },
    {
title: 'в жб Тех. спец.',
      content:
        '[FONT=Arial][SIZE=4]{{ greeting }}[/SIZE][/FONT]<br><br>' +
        
        "[FONT=Arial][SIZE=4]Обратитесь в раздел жалоб на Технических специалистов [/SIZE][/FONT][FONT=Arial][SIZE=4][/SIZE][/FONT]<br><br>" +
       
        '[FONT=Arial][SIZE=4]Закрыто.[/SIZE][/FONT]<br>',
      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
       title: 'ЖБ на адм',
      content:
        '[FONT=Arial][SIZE=4]{{ greeting }}[/SIZE][/FONT]<br><br>' +
        
        "[SIZE=4][FONT=Arial]Если вы не согласны с решением администратора, обратитесь в раздел жалоб на администрацию.[/FONT][/SIZE]<br><br>" +
        
        '[FONT=Arial][SIZE=4]Закрыто.[/SIZE][/FONT]<br>',
      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
      title: 'Обж на рассмотрении',
      content:
        '[FONT=Arial][SIZE=4]{{ greeting }}[/SIZE][/FONT]<br><br>' +
        "[SIZE=4][FONT=Arial]Ваше обжалование взято на рассмотрение.[/FONT][/SIZE]<br><br>" +
        '[SIZE=4][FONT=Arial]Создавать копии не нужно, ожидайте ответа в данной теме.[/FONT][/SIZE]<br>',
      prefix: PIN_PREFIX,
      status: true,
    },
    { 
      title: 'NonRP обман 1 ',
      content:
        '[FONT=Arial][SIZE=4]{{ greeting }}[/SIZE][/FONT]<br><br>' +
        "[SIZE=4][FONT=Arial]Ваш аккаунт будет разблокирован на 24 часа.<br><br>" +
        "[FONT=Arial][SIZE=4]Ваша задача найти игрока которого вы обманули,и под видеозапись фиксировать ваш разговор, и то как вы передаёте нажитое имущество нечестным путём,далее прикрепляете видеозапись в этой теме.[/SIZE][/FONT]<br><br>" +
        '[FONT=Arial][SIZE=4]На рассмотрении.[/SIZE][/FONT]<br>',
     prefix: PIN_PREFIX,
      status: true,
    },
    {
      title: 'СПО',
      content:
        '[FONT=Arial][SIZE=4]{{ greeting }}[/SIZE][/FONT]<br><br>' +
        "[SIZE=4][FONT=Arial]Ваш игровой акаунт был заблокирован навсегда за использование стороннего ПО.[/FONT][/SIZE]<br><br>" +
        '[FONT=Arial][SIZE=4]Отказано.[/SIZE]<br>',
     prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
      title: 'Окно бана',
      content:
        '[FONT=Arial][SIZE=4]{{ greeting }}.<br><br>' +
        '[FONT=Arial][SIZE=4]Прикрепите в доказательства скриншот окна блокировки, которое появляется сразу после входа в игру.<br>' +
        
        '[FONT=Arial][SIZE=4]Закрыто.[/SIZE][/FONT][/CENTER]<br>',
      prefix: CLOSE_PREFIX,
      status: false,
 
	  title: '| _________Админ Раздел_________ |',
	},
    {
      title: 'неактив одобрено',
      content:
  '[COLOR=rgb(51, 204, 51)][FONT=times new roman][SIZE=1][I]Одобрено.[/I][/SIZE][/FONT][/COLOR]',
},
    {
      title: 'снять уснт выг',
      content:
  "[FONT=times new roman][COLOR=#d1d5d8][SIZE=1][I]-10 баллов.[/I][/SIZE][/COLOR][/FONT]<br><br>" +
 '[COLOR=rgb(51, 204, 51)][FONT=times new roman][SIZE=1][I]Одобрено.[/I][/SIZE][/FONT][/COLOR]',
},
    {
      title: 'на одобрение продажу отказ',
      content:
 '[COLOR=rgb(255, 0, 0)][SIZE=1][FONT=times new roman][I]Отказано.[/I][/FONT][/SIZE][/COLOR]',
},
    {
      title: 'на одобрение продажу одобрено',
      content:
 '[COLOR=rgb(51, 204, 51)][FONT=times new roman][SIZE=1][I]Одобрено.[/I][/SIZE][/FONT][/COLOR]'
},
    {
      title: 'снять выг',
      content:
  "[FONT=times new roman][COLOR=#d1d5d8][SIZE=4][I]-20 баллов.[/I][/SIZE][/COLOR][/FONT]<br><br>" +
 '[COLOR=rgb(51, 204, 51)][FONT=times new roman][SIZE=1][I]Одобрено.[/I][/SIZE][/FONT][/COLOR]',
  },
     {   
      title: 'неактив отказ',
      content:
 '[COLOR=rgb(255, 0, 0)][SIZE=4][FONT=times new roman][I]Отказано.[/I][/FONT][/SIZE][/COLOR]',
    }
];
 
$(document).ready(() => {
    // Загрузка скрипта для обработки шаблонов
    $('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');
 
 
    // Добавление кнопок при загрузке страницы
    addButton('Закрыто', 'close');
    addButton('На рассмотрение', 'pin');
    addButton('Одобрено', 'accepted');
    addButton('Отказано', 'unaccept');
    addButton('Click me', 'selectAnswer');
 
 
 
    // Поиск информации о теме
    const threadData = getThreadData();
 
 
    $('button#pin').click(() => editThreadData(PIN_PREFIX, true));
    $('button#accepted').click(() => editThreadData(ACCEPT_PREFIX, false));
    $('button#unaccept').click(() => editThreadData(UNACCEPT_PREFIX, false));
    $('button#close').click(() => editThreadData(CLOSE_PREFIX, false));
 
 
    $(`button#selectAnswer`).click(() => {
        XF.alert(buttonsMarkup(buttons), null, 'Выберите ответ:');
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
    12 < hours && hours <= 18
      ? 'Здравствуйте.'
      : 18 < hours && hours <= 21
      ? 'Здравствуйте.'
      : 21 < hours && hours <= 4
      ? 'Здравствуйте.'
      : 'Здравствуйте.',
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