// // ==UserScript==
// @name         Script for complaints about leaders
// @namespace    https://forum.blackrussia.online
// @version      1.6
// @description  Always remember who you are!
// @author       keitashi
// @match        https://forum.blackrussia.online/threads/*
// @include      https://forum.blackrussia.online/threads/
// @grant        none
// @license      MIT
// @collaborator keitashi
// @icon https://icons.iconarchive.com/icons/iconarchive/incognito-animal-2/256/Cat-Cool-icon.png
// @downloadURL https://update.greasyfork.org/scripts/474903/Script%20for%20complaints%20about%20leaders.user.js
// @updateURL https://update.greasyfork.org/scripts/474903/Script%20for%20complaints%20about%20leaders.meta.js
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
      title: '|',
      content:
        '[SIZE=4][COLOR=rgb(0, 255, 255)][I][FONT=times new roman]{{ greeting }}, уважаемый {{ user.mention }}.[/FONT][/I][/COLOR][/SIZE]',
    },
    {
      title: 'На рассмотрении',
      content:
        '[CENTER][SIZE=4][FONT=times new roman][I][COLOR=rgb(255, 0, 0)]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/I][/FONT][/SIZE]<br><br>' +
        "[I][SIZE=4][COLOR=rgb(209, 213, 216)][FONT=times new roman]Ваша жалоба взята на рассмотрение.[/FONT][/COLOR][/SIZE][/I]<br>" +
        '[SIZE=4][FONT=times new roman][I][COLOR=rgb(209, 213, 216)]Не нужно создавать копии этой жалобы, ожидайте ответа в этой теме.[/COLOR][/I][/FONT][/SIZE][/CENTER]',
      prefix: PIN_PREFIX,
      status: true,
    },
    {
      title: 'Док-ва предоставлены',
      content:
        '[CENTER][I][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/FONT][/COLOR][/I]<br><br>' +
        "[FONT=times new roman][SIZE=4][COLOR=rgb(209, 213, 216)][I]Лидер предоставил доказательства на ваше нарушения, с его стороны нет нарушения.[/I][/COLOR]<br>" +
        "[SIZE=4][FONT=times new roman][COLOR=rgb(209, 213, 216)][I]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/I][/COLOR][/FONT][/SIZE]<br><br>" +
        '[I][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]Закрыто.[/SIZE][/FONT][/COLOR][/I][/CENTER]',
      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
      title: 'Передано ГА',
      content:
        '[CENTER][FONT=times new roman][SIZE=4][I][COLOR=rgb(255, 0, 0)]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/I][/SIZE][/FONT]<br><br>' +
        "[COLOR=rgb(209, 213, 216)][I][FONT=times new roman][SIZE=4]Ваша жалоба переадресована [/SIZE][/FONT][/I][/COLOR][COLOR=rgb(255, 0, 0)][I][FONT=times new roman][SIZE=4]Главному Администратору[/SIZE][/FONT][/I][/COLOR][COLOR=rgb(209, 213, 216)][I][FONT=times new roman][SIZE=4].[/SIZE][/FONT][/I][/COLOR]<br>" +
        '[FONT=times new roman][SIZE=4][I][COLOR=rgb(209, 213, 216)]Ожидайте ответа в данной теме, копии создавать не нужно.[/COLOR][/I][/SIZE][/FONT][/CENTER]',
      prefix: GA_PREFIX,
      status: true,
    },
    {
      title: 'Ответ дан раннее',
      content:
        '[CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
        "[I][SIZE=4][FONT=times new roman][COLOR=rgb(209, 213, 216)]Вам уже ранее был дан корректный ответ, за создание дубликатов этой темы ваш форумный аккаунт может быть заблокирован.[/COLOR][/FONT][/SIZE][/I]<br><br>" +
        '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]Закрыто.[/I][/SIZE][/FONT][/COLOR][/CENTER]',
      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
      title: 'Лидер ошибся',
      content:
        '[CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
        "[SIZE=4][FONT=times new roman][I][COLOR=rgb(209, 213, 216)]Лидер допустил ошибку.[/COLOR]<br><br>" +
        "[COLOR=rgb(209, 213, 216)]Приносим свои извинения за доставленные неудобства.[/COLOR]<br>" +
        "[COLOR=rgb(209, 213, 216)]Приятной игры на [/COLOR][/I][COLOR=rgb(209, 213, 216)][I]BLACK RUSSIA ICE.<br>" +
        '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]Закрыто.[/I][/SIZE][/FONT][/COLOR][/CENTER]',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: 'Недостаточно док-в',
      content:
        '[CENTER][I][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/FONT][/COLOR][/I]<br><br>' +
        "[COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4][I]Недостаточно доказательств для корректного рассмотрения вашего обращения.[/I][/SIZE][/FONT][/COLOR]<br><br>" +
        '[I][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]Закрыто.[/SIZE][/FONT][/COLOR][/I][/CENTER]',
      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
      title: 'Нужен фрапс',
      content:
        '[CENTER][I][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/FONT][/COLOR][/I]<br><br>' +
        '[COLOR=rgb(209, 213, 216)][I][FONT=times new roman][SIZE=4]Недостаточно доказательств для корректного рассмотрения жалобы. В данном случае требуются видео - доказательства.[/SIZE][/FONT]<br>' +
        '[FONT=times new roman][SIZE=4]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/SIZE][/FONT][/I][/COLOR]<br><br>' +
        '[FONT=times new roman][SIZE=4][I][COLOR=rgb(255, 0, 0)]Закрыто.[/COLOR][/I][/SIZE][/FONT][/CENTER]',
      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
      title: 'Док-ва отред.',
      content:
        '[CENTER][I][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/FONT][/COLOR][/I]<br><br>' +
        '[COLOR=rgb(209, 213, 216)][I][FONT=times new roman][SIZE=4]Ваши доказательства были подвергнуты изменениям (редактированию), прикрепите оригинальные файлы.[/SIZE][/FONT]<br>' +
        '[FONT=times new roman][SIZE=4]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/SIZE][/FONT][/I][/COLOR]<br><br>' +
        '[FONT=times new roman][SIZE=4][I][COLOR=rgb(255, 0, 0)]Закрыто.[/COLOR][/I][/SIZE][/FONT][/CENTER]',
      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
 
      title: 'Отсутст. док-ва',
      content:
        '[CENTER][I][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/FONT][/COLOR][/I]<br><br>' +
        "[COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4][I]Отсутствуют доказательства - следовательно, рассмотрению не подлежит.[/I][/SIZE][/FONT][/COLOR]<br>" +
        "[SIZE=4][COLOR=rgb(209, 213, 216)][FONT=times new roman][I]Загрузите доказательства на фото-видео хостинги YouTube, Imgur, Yapx и так далее.[/I][/FONT][/COLOR][/SIZE]<br><br>" +
        '[I][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]Закрыто.[/SIZE][/FONT][/COLOR][/I][/CENTER]',
      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
      title: 'Не по теме',
      content:
        '[CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
        "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Ваше сообщение никоим образом не относится к предназначению данного раздела.[/SIZE][/FONT][/COLOR][/I]<br><br>" +
        '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]Закрыто.[/I][/SIZE][/FONT][/COLOR][/CENTER]',
      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
      title: 'Прошло 48 часа',
      content:
        '[CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
        "[COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4][I]Срок написания жалобы - 48 часа с момента выдачи наказания.[/I][/SIZE][/FONT]<br>" +
        "[I][FONT=times new roman][SIZE=4]Внимательно прочитайте правила составления жалоб - [/I][COLOR=rgb(209, 213, 216)][URL='https://forum.blackrussia.online/threads/Правила-подачи-жалоб-на-лидеров.1188116/']*Нажмите сюда*[/URL][/COLOR][/SIZE][/FONT]<br><br>" +
        '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]Закрыто.[/I][/SIZE][/FONT][/COLOR][/CENTER]',
      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
      title: 'Не по форме',
      content:
        '[CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
        "[SIZE=4][FONT=times new roman][I][COLOR=rgb(209, 213, 216)]Ваша жалоба составлена не по форме.[/COLOR]<br><br>" +
        "[I][FONT=times new roman][SIZE=4]Внимательно прочитайте правила составления жалоб - [/I][COLOR=rgb(209, 213, 216)][URL='https://forum.blackrussia.online/threads/Правила-подачи-жалоб-на-лидеров.1188116/']*Нажмите сюда*[/URL][/COLOR][/SIZE][/FONT]<br><br>" +
        '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]Закрыто.[/I][/SIZE][/FONT][/COLOR][/CENTER]',
      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
      title: 'Док-ва в соц. сетях',
      content:
        '[CENTER][FONT=times new roman][COLOR=rgb(255, 0, 0)][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/COLOR][/FONT]<br><br>' +
        "[COLOR=rgb(209, 213, 216)][I][SIZE=4][FONT=times new roman]Доказательства в социальных сетях и т.д. не принимаются.[/FONT][/SIZE]<br>" +
        "[SIZE=4][FONT=times new roman]Загрузите доказательства на фото-видео хостинги YouTube, Imgur, Yapx и так далее.[/FONT][/SIZE][/I][/COLOR]<br><br>" +
        '[FONT=times new roman][COLOR=rgb(255, 0, 0)][SIZE=4][I]Закрыто.[/I][/SIZE][/COLOR][/FONT][/CENTER]',
      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
      title: 'Лидер прав',
      content:
        '[CENTER][FONT=times new roman][COLOR=rgb(255, 0, 0)][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/COLOR][/FONT]<br><br>' +
        "[COLOR=rgb(209, 213, 216)][I][SIZE=4][FONT=times new roman]Нарушений со стороны лидера нет.[/FONT][/SIZE]<br><br>" +
        '[FONT=times new roman][COLOR=rgb(255, 0, 0)][SIZE=4][I]Закрыто.[/I][/SIZE][/COLOR][/FONT][/CENTER]',
      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
      title: 'Выдано верно',
      content:
        '[CENTER][FONT=times new roman][COLOR=rgb(255, 0, 0)][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/COLOR][/FONT]<br><br>' +
        "[COLOR=rgb(209, 213, 216)][I][SIZE=4][FONT=times new roman]Нарушений со стороны лидера нет.[/FONT][/SIZE]<br>" +
        "[SIZE=4][FONT=times new roman]Наказание выдано верно.[/FONT][/SIZE][/I][/COLOR]<br><br>" +
        '[FONT=times new roman][COLOR=rgb(255, 0, 0)][SIZE=4][I]Закрыто.[/I][/SIZE][/COLOR][/FONT][/CENTER]',
      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
      title: 'Лидер не прав',
      content:
        '[CENTER][FONT=times new roman][COLOR=rgb(255, 0, 0)][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/COLOR][/FONT]<br><br>' +
        "[SIZE=4][FONT=times new roman][I][COLOR=rgb(209, 213, 216)]С лидером будет проведена беседа.[/COLOR][/I][/FONT][/SIZE]<br>" +
        "[FONT=times new roman][COLOR=#d1d5d8][SIZE=4][I]Приносим свои извинения за доставленные неудобства.<br>" +
        "Приятной игры на BLACK RUSSIA ICE.[/I][/SIZE][/COLOR][/FONT]<br><br>" +
        '[COLOR=rgb(209, 213, 216)][FONT=times new roman][COLOR=rgb(255, 0, 0)][SIZE=4][I]Закрыто.[/I][/SIZE][/COLOR][/FONT][/COLOR][/CENTER]',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
     {
      title: 'Нет /time',
      content:
        '[CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
        "[SIZE=4][FONT=times new roman][I][COLOR=rgb(209, 213, 216)]Отсутствует /time на доказательстве, следовательно рассмотрению не подлежит.[/COLOR]<br><br>" +
       "[I][FONT=times new roman][SIZE=4]Внимательно прочитайте правила составления жалоб - [/I][COLOR=rgb(209, 213, 216)][URL='https://forum.blackrussia.online/threads/Правила-подачи-жалоб-на-лидеров.1188116/']*Нажмите сюда*[/URL][/COLOR][/SIZE][/FONT]<br><br>" +
        '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]Закрыто.[/I][/SIZE][/FONT][/COLOR][/CENTER]',
      prefix: CLOSE_PREFIX,
      status: false,
     },
     {
      title: 'Передано ЗГА',
      content:
        '[CENTER][SIZE=4][FONT=times new roman][I][COLOR=rgb(255, 0, 0)]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/I][/FONT][/SIZE]<br><br>' +
        "[I][SIZE=4][COLOR=rgb(209, 213, 216)][FONT=times new roman]Ваша жалоба будет передана Заместителю Главного Администратора.[/FONT][/COLOR][/SIZE][/I]<br>" +
        '[SIZE=4][FONT=times new roman][I][COLOR=rgb(209, 213, 216)]Не нужно создавать копии этой жалобы, ожидайте ответа в этой теме.[/COLOR][/I][/FONT][/SIZE][/CENTER]',
      prefix: PIN_PREFIX,
      status: true,
    },
    {
      title: 'Жалоба на рассмтр',
      content:
        '[CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
        "[I][SIZE=4][FONT=times new roman][COLOR=rgb(209, 213, 216)]Ваша жалоба уже взята на рассмотрение, за создание дубликатов этой темы ваш форумный аккаунт может быть заблокирован.[/COLOR][/FONT][/SIZE][/I]<br><br>" +
        '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]Закрыто.[/I][/SIZE][/FONT][/COLOR][/CENTER]',
      prefix: CLOSE_PREFIX,
      status: false,
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
    addButton('Ответы', 'selectAnswer');
 
 
 
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
    6 < hours && hours <= 10
      ? 'Доброе утро'
      : 10 < hours && hours <= 18
      ? 'Добрый день'
      : 18 < hours && hours <= 6
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