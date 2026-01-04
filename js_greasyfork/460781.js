// ==UserScript==
// @name         Скрипт / Куратор/ЗГА
// @namespace    https://forum.blackrussia.online
// @version      1.2
// @description 🏛️
// @author      J. Hoffm
// @match        https://forum.blackrussia.online/index.php?threads/*
// @include      https://forum.blackrussia.online/index.php?threads/
// @grant        none
// @license    MIT
// @icon   https://icons.iconarchive.com/icons/papirus-team/papirus-apps/48/emerald-theme-manager-icon-icon.png
// @downloadURL https://update.greasyfork.org/scripts/460781/%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%20%D0%9A%D1%83%D1%80%D0%B0%D1%82%D0%BE%D1%80%D0%97%D0%93%D0%90.user.js
// @updateURL https://update.greasyfork.org/scripts/460781/%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%20%D0%9A%D1%83%D1%80%D0%B0%D1%82%D0%BE%D1%80%D0%97%D0%93%D0%90.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
const UNACCEPT_PREFIX = 4; // Prefix that will be set when thread closes
const ACCEPT_PREFIX = 8; // Prefix that will be set when thread accepted
const RASSMOTENO_PREFIX = 9; // Prefix that will be set when solving the problem
const PIN_PREFIX = 2; // Prefix that will be set when thread pins
const GA_PREFIX = 12; // Prefix that will be set when thread send to ga
const COMMAND_PREFIX = 10; // Prefix that will be set when thread send to project team
const SA_PREFIX = 11;
const WATCHED_PREFIX = 9;
const CLOSE_PREFIX = 7;
const SPECY_PREFIX = 11;
const TEX_PREFIX = 13;
const buttons = [
    {
        title: ' Приветвия ',
        content:
        'Здравствуйте, {{ user.mention }}.',
        
    },
    {
        title: ' На ГА ',
        content:
       'Здравствуйте, {{ user.mention }}.<br><br>' +
        "Передано Главному администратору.<br><br>" +
        'Ожидайте ответа',
   prefix: GA_PREFIX,
   status: true,
    },
    {
        title: ' На СА ',
        content:
        'Здравствуйте, {{ user.mention }}.<br><br>' +
        "Передано специальному администратору.<br><br>" +
        'Ожидайте ответа.',
    prefix: SA_PREFIX,
    status: true,
    },
{
    title: ' На рассмотрении ',
    content:
    'Здравствуйте, {{ user.mention }}.<br><br>' +
    "На рассмотрении.<br><br>" +
    'Ожидайте ответа.',
prefix: PIN_PREFIX,
status: false,
    
},
{
    title: ' Команде проекта ',
    content:
    'Здравствуйте, {{ user.mention }}.<br><br>' +
    "Передано Команде проекта.<br><br>" +
    'Ожидайте ответа. ',
prefix: COMMAND_PREFIX,
status: true,
    
},
{
    title: '______________________________________________________________________ ',
},
{
    title: ' Запросил док-ва ',
    content:
    'Здравствуйте, {{ user.mention }}.<br><br>' +
    "Запросил доказательства у администратора.<br><br>" +
    'На рассмотрении.',
 prefix: PIN_PREFIX,
 status: false,
    
},
{
    title: ' Выдано верно',
    content:
    'Здравствуйте, {{ user.mention }}.<br><br>' +
    "Наказание выдано верно.<br><br>" +
    'Отказано.',
prefix: UNACCEPT_PREFIX,
status: false,
    
},
{
    title: 'Беседа с адм ',
    content:
    'Здравствуйте, {{ user.mention }}.<br><br>' +
    "С администратором будет проведена беседа.<br><br>" +
    'Ваше наказание будет снято.',
prefix: ACCEPT_PREFIX,
status: false,
    
},
{
    title: ' Нет нарушений от адм ',
    content:
    'Здравствуйте, {{ user.mention }}.<br><br>' +
    "Нарушений со стороны Администратора не было обнаружено.<br><br>" +
    'Отказано, Закрыто.',
prefix: UNACCEPT_PREFIX,
status: false
    
},
{
    title: ' Админ ошибся ',
    content:
    'Здравствуйте, {{ user.mention }}.<br><br>' +
    "Администратор допустил ошибку.<br>" +
    "Приносим свои извинения за доставленные неудобства.<br>" +
    "Ваше наказание будет снято.<br><br>" +
    'Одобрено',
    prefix: ACCEPT_PREFIX,
    status: false,
},
{
    title: ' Док-ва предоставлены ',
    content:
    'Здравствуйте, {{ user.mention }}.<br><br>' +
    "Доказательства предоставлены.<br><br>" +
    'Отказано, Закрыто.',
    prefix: UNACCEPT_PREFIX,
    status: false,
},
{
    title: '_______________________________________________________________________',
},
{
    title: ' Не по форме ',
    content:
    'Здравствуйте, {{ user.mention }}.<br><br>' +
    "Ваша жалоба составлена не по форме. Пожалуйста ознакомьтесь с правилами подачи жалобы на администрацию.<br><br>" +
    'Закрыто',
    prefix: UNACCEPT_PREFIX,
    status: false,
},
{
    title: ' Более 48-и часов ',
    content: 
    'Здравствуйте, {{ user.mention }}.<br><br>' +
    "Срок подачи жалобы вышел.<br><br>" +
    'Отказано, Закрыто.',
    prefix: UNACCEPT_PREFIX,
    status: false,
},
{
    title: 'На тех раздел жб на тех-спец',
    content:
    'Здравствуйте, {{ user.mention }}.<br><br>' +
    "Если вы считаете что наказание было выдано неверно обратитесь в раздел Жалобы на Технических Специалистов.<br><br>" +
    'Закрыто.',
    prefix: CLOSE_PREFIX,
    status: false,
},
{
    title: ' В обж ',
    content:
    'Здравствуйте, {{ user.mention }}.<br><br>' +
    "Если вы считаете что наказание было выдано неверно обратитесь в раздел Обжалование наказании.<br><br>" +
    'Закрыто.',
    prefix: CLOSE_PREFIX,
    status: false,
},
{
    title: ' Не рабочий ссылка',
    content:
    'Здравствуйте, {{ user.mention }}.<br><br>' +
    "Ваша ссылка не работает! Прикрепите рабочую ссылку.<br><br>" +
    'Отказано, Закрыто.',
    prefix: UNACCEPT_PREFIX,
    status: false,
},
{
    title: 'Дубликат',
    content:
    'Здравствуйте, {{ user.mention }}.<br><br>' +
    "Напоминаю, прекратите дублирование, иначе ваш форумный аккаунт будет заблокирован.<br><br>" +
    'Отказано, Закрыто.',
    prefix: UNACCEPT_PREFIX,
    status: false,
},
{
    title: ' Отсутствует док-ва',
    content:
    'Здравствуйте, {{ user.mention }}.<br><br>' +
    "В вашей жалобе отсутствуют доказательства.<br><br>" +
    'Отказано, Закрыто.',
    prefix: UNACCEPT_PREFIX,
    status: false,
}
];
 
  $(document).ready(() => {
    // Загрузка скрипта для обработки шаблонов
    $('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');
 
    // Добавление кнопок при загрузке страницы
    addButton('На рассмотрение', 'pin');
    addButton('КП', 'teamProject');
    addButton('Одобрено', 'accepted');
    addButton('Отказано', 'unaccept');
    addButton('Ответы', 'selectAnswer');
 
    // Поиск информации о теме
    const threadData = getThreadData();
 
    $('button#pin').click(() => editThreadData(PIN_PREFIX, true));
    $('button#accepted').click(() => editThreadData(ACCEPT_PREFIX, false));
    $('button#teamProject').click(() => editThreadData(COMMAND_PREFIX, true));
    $('button#unaccept').click(() => editThreadData(UNACCEPT_PREFIX, false));
 
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
        11 < hours && hours <= 18 ?
        'Добрый день' :
        18 < hours && hours <= 22 ?
        'Добрый вечер' :
        'Доброй ночи',
    };
  }
 
  function editThreadData(prefix, pin = false) {
    // Получаем заголовок темы, так как он необходим при запросе
    const threadTitle = $('.p-title-value')[0].lastChild.textContent;
 
    if (pin == false) {
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
    if (pin == true) {
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