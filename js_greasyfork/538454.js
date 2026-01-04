 // // ==UserScript==
// @name         Ufa | Скрипт для ГС/ЗГС
// @namespace    https://forum.blackrussia.online
// @version      2.0
// @description  Скрипт для Руководства направлений сервера Ufa
// @author       Adelina_Curtis
// @match        https://forum.blackrussia.online/threads/*
// @include      https://forum.blackrussia.online/threads/
// @grant        none
// @license      MIT
// @collaborator 
// @icon https://takocode.ru/assets/imgs/avatar.gif
// @downloadURL https://update.greasyfork.org/scripts/538454/Ufa%20%7C%20%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%93%D0%A1%D0%97%D0%93%D0%A1.user.js
// @updateURL https://update.greasyfork.org/scripts/538454/Ufa%20%7C%20%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%93%D0%A1%D0%97%D0%93%D0%A1.meta.js
// ==/UserScript==
  (function () {
    'use strict';
  const UNACCEPT_PREFIX = 4; // Prefix that will be set when thread closes
  const ACCEPT_PREFIX = 8; // Prefix that will be set when thread accepted
  const RESHENO_PREFIX = 6; // Prefix that will be set when solving the problem
  const PIN_PREFIX = 2; // Prefix that will be set when thread pins
  const GA_PREFIX = 12; // Prefix that will be set when thread send to ga
  const COMMAND_PREFIX = 10; // Prefix that will be set when thread send to project team
  const WATCHED_PREFIX = 9;
  const CLOSE_PREFIX = 7;
  const SA_PREFIX = 11;
  const buttons = [
  {
        title: 'На рассмотрении',
          content:
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]<br>' +
         '[CENTER][COLOR=rgb(255, 0, 255)][FONT=times new roman][SIZE=4][I]Доброго времени суток, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
          "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Запрошу доказательства у Лидера, ожидайте вердикта в данной теме.[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br>' +
          '[I][CENTER][SIZE=4][COLOR=rgb(255, 140, 0)][FONT=times new roman]На рассмотрение...[/SIZE][/CENTER][/COLOR][/FONT]',
          prefix: PIN_PREFIX,
          status: true,
        },
        {
          title : 'Прошло 48 часов',
          content:
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZ2f6V91/2.png[/img][/url][/CENTER]<br>' +
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]<br>' +
         '[CENTER][COLOR=rgb(255, 0, 255)][FONT=times new roman][SIZE=4][I]Доброго времени суток, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
          "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Ваша жалоба отказана, так как с момента выдачи наказания прошло более 48-и часов.[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
          '[I][CENTER][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=times new roman]Отказано.[/SIZE][/CENTER][/COLOR][/FONT]',
          prefix: UNACCEPT_PREFIX,
          status: false, 
        },
        {
          title : 'от 3-его лица',
          content:
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZ2f6V91/2.png[/img][/url][/CENTER]<br>' +
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]<br>' +
          '[CENTER][COLOR=rgb(255, 0, 255)][FONT=times new roman][SIZE=4][I]Доброго времени суток, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>' +          "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Ваша жалоба отказана, так как она написана от 3-его лица.[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
          '[I][CENTER][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=times new roman]Отказано, закрыто.[/SIZE][/CENTER][/COLOR][/FONT]',
          prefix: UNACCEPT_PREFIX,
          status: false, 
        },
        {
          title : 'Уже дан ответ',
          content:
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZ2f6V91/2.png[/img][/url][/CENTER]<br>' +
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]<br>' +
          '[CENTER][COLOR=rgb(255, 0, 255)][FONT=times new roman][SIZE=4][I]Доброго времени суток, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
          "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Вам уже был дан корректный ответ в прошлых темах.[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
          '[I][CENTER][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=times new roman]Закрыто.[/SIZE][/CENTER][/COLOR][/FONT]',
          prefix: CLOSE_PREFIX,
          status: false, 
        },
        {
          title : 'Наказание по ошибке',
          content:
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZ2f6V91/2.png[/img][/url][/CENTER]<br>' +
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]<br>' +
          '[CENTER][COLOR=rgb(255, 0, 255)][FONT=times new roman][SIZE=4][I]Доброго времени суток, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
          "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Вследствие беседы с Лидером было выяснено, что наказание было выдано по ошибке или невнимательности, наказание будет снято.[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
          '[I][CENTER][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=times new roman]Одобрено, закрыто.[/SIZE][/CENTER][/COLOR][/FONT]',
          prefix: ACCEPT_PREFIX,
          status: false,
         },
         {
          title : 'Беседа с ЛД',
          content:
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZ2f6V91/2.png[/img][/url][/CENTER]<br>' +
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]<br>' +
          '[CENTER][COLOR=rgb(255, 0, 255)][FONT=times new roman][SIZE=4][I]Доброго времени суток, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
          "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Ваша жалоба была одобрена, в сторону Лидера будут приняты необходимые меры.[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
          '[I][CENTER][[SIZE=4][COLOR=rgb(255, 0, 0)][FONT=times new roman]Одобрено, закрыто.[/SIZE][/CENTER][/COLOR][/FONT]',
          prefix: ACCEPT_PREFIX,
          status: false,
         },
         {
          title : 'Нет нарушений',
          content:
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZ2f6V91/2.png[/img][/url][/CENTER]<br>' +
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]<br>' +
          '[CENTER][COLOR=rgb(255, 0, 255)][FONT=times new roman][SIZE=4][I]Доброго времени суток, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
          "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Исходя из выше приложенных доказательств, нарушения со стороны Лидера не имеется.[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
          '[I][CENTER][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=times new roman]Отказано, закрыто.[/SIZE][/CENTER][/COLOR][/FONT]',
          prefix: UNACCEPT_PREFIX,
          status: false, 
        },
        {
          title : 'Наказание верное',
          content:
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZ2f6V91/2.png[/img][/url][/CENTER]<br>' +
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]<br>' +
          '[CENTER][COLOR=rgb(255, 0, 255)][FONT=times new roman][SIZE=4][I]Доброго времени суток, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
          "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Проверив доказательства Лидера, было принято решение, что наказание выдано верно.[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
          '[I][CENTER][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=times new roman]Закрыто.[/SIZE][/CENTER][/COLOR][/FONT]',
          prefix: CLOSE_PREFIX,
          status: false, 
         },
         {
          title : 'Не работает док-во ',
          content:
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZ2f6V91/2.png[/img][/url][/CENTER]<br>' +
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]<br>' +
          '[CENTER][COLOR=rgb(255, 0, 255)][FONT=times new roman][SIZE=4][I]Доброго времени суток, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
          "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Ваши доказательства не рабочие.[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
          '[I][CENTER][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=times new roman]Отказано, закрыто.[/SIZE][/CENTER][/COLOR][/FONT]',
          prefix: UNACCEPT_PREFIX,
          status: false, 
        },
        {
          title : 'ЖБ не по форме',
          content:
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZ2f6V91/2.png[/img][/url][/CENTER]<br>' +
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]<br>' +
          '[CENTER][COLOR=rgb(255, 0, 255)][FONT=times new roman][SIZE=4][I]Доброго времени суток, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
          "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Ваша жалоба составлена не по форме. Ознакомьтесь с правилами подачи жалобы - [/I][https://forum.blackrussia.online/threads/Правила-подачи-жалоб-на-лидеров.3429391/]*Нажмите сюда*[/URL][/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
          '[I][CENTER][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=times new roman]Отказано, закрыто.[/SIZE][/CENTER][/COLOR][/FONT]',
          prefix: UNACCEPT_PREFIX,
          status: false, 
         },
         {
          title : 'Недостаточно док-в в «Жалобе»',
          content:
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZ2f6V91/2.png[/img][/url][/CENTER]<br>' +
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]<br>' +
          '[CENTER][COLOR=rgb(255, 0, 255)][FONT=times new roman][SIZE=4][I]Доброго времени суток, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
          "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Недостаточно доказательств на нарушение со стороны Лидера.[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
          '[I][CENTER][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=times new roman]Отказано, закрыто.[/SIZE][/CENTER][/COLOR][/FONT]',
          prefix: UNACCEPT_PREFIX,
          status: false, 
         },
         {
          title : 'Редактор док-в',
          content:
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZ2f6V91/2.png[/img][/url][/CENTER]<br>' +
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]<br>' +
          '[CENTER][COLOR=rgb(255, 0, 255)][FONT=times new roman][SIZE=4][I]Доброго времени суток, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>' +          "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Доказательства предоставлены в плохом качестве, или подвергались редактированию, составьте повторно жалобу, с предоставлением доказательств без редактирования.[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
          '[I][CENTER][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=times new roman]Отказано, закрыто.[/SIZE][/CENTER][/COLOR][/FONT]',
          prefix: UNACCEPT_PREFIX,
          status: false, 
         },
         {
          title : 'Фейковые доказательства',
          content:
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZ2f6V91/2.png[/img][/url][/CENTER]<br>' +
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]<br>' +
          '[CENTER][COLOR=rgb(255, 0, 255)][FONT=times new roman][SIZE=4][I]Доброго времени суток, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
          "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Доказательства являются подделанными, Форумный аккаунт будет заблокирован.[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
          '[I][CENTER][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=times new roman]Отказано, закрыто.[/SIZE][/CENTER][/COLOR][/FONT]',
          prefix: UNACCEPT_PREFIX,
          status: false, 
         },
         {
          title : 'Док-во соц сети',
          content:
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZ2f6V91/2.png[/img][/url][/CENTER]<br>' +
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]<br>' +
          '[CENTER][COLOR=rgb(255, 0, 255)][FONT=times new roman][SIZE=4][I]Доброго времени суток, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
          "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Доказательства из каких-либо соц. сетей не принимаются, Требуется загрузить доказательства на какой-либо фото/видео хостинг.[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
          '[I][CENTER][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=times new roman]Отказано, закрыто.[/SIZE][/CENTER][/COLOR][/FONT]',
          prefix: UNACCEPT_PREFIX,
          status: false, 
         },
         {
          title : 'Нету /time',
          content:
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZ2f6V91/2.png[/img][/url][/CENTER]<br>' +
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]<br>' +
          '[CENTER][COLOR=rgb(255, 0, 255)][FONT=times new roman][SIZE=4][I]Доброго времени суток, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
          "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]На ваших доказательствах отсутствует /time.[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
          '[I][CENTER][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=times new roman]Отказано, закрыто.[/SIZE][/CENTER][/COLOR][/FONT]',
          prefix: UNACCEPT_PREFIX,
          status: false, 
         },
         {
          title: 'Передано ГА',
          content:
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZ2f6V91/2.png[/img][/url][/CENTER]<br>' +
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]<br>' +
          '[CENTER][COLOR=rgb(255, 69, 0)][FONT=times new roman][SIZE=4][I]Доброго времени суток, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
          "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Ваша жалоба переадресована [/SIZE][/FONT][/I][/COLOR][COLOR=rgb(255, 0, 0)][I][FONT=times new roman][SIZE=4]Главному администратору[/SIZE][/FONT][/I][/COLOR][COLOR=rgb(209, 213, 216)][I][FONT=times new roman][SIZE=4].[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br>' +
          '[I][CENTER][SIZE=4][COLOR=rgb(255, 140, 0)][FONT=times new roman]На рассмотрение...[/SIZE][/CENTER][/COLOR][/FONT]',
          prefix: GA_PREFIX,
          status: true,
        },
         { 
      title : 'не является лидером',
          content:
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZ2f6V91/2.png[/img][/url][/CENTER]<br>' +
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]<br>' +
          '[CENTER][COLOR=rgb(255, 0, 255)][FONT=times new roman][SIZE=4][I]Доброго времени суток, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>' +          "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Ваша жалоба отказана, так как указанный в жалобе игрок не является Лидером какой-либо организации, обратитесь в другой раздел.[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
          '[I][CENTER][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=times new roman]Отказано, закрыто.[/SIZE][/CENTER][/COLOR][/FONT]',
          prefix: UNACCEPT_PREFIX,
          status: false, 
         },
         { 
         },
        ]
        
 
          $(document).ready(() => {
            // Загрузка скрипта для обработки шаблонов
            $('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');
           
            // Добавление кнопок при загрузке страницы
            addButton('На рассмотрение', 'pin');
            addButton('КП', 'teamProject');
            addButton('Одобрено', 'accepted');
            addButton('Отказано', 'unaccept');
            addButton('Вердикты', 'selectAnswer');
           
            // Поиск информации о теме
            const threadData = getThreadData();
           
            $('button#pin').click(() => editThreadData(PIN_PREFIX, true));
            $('button#accepted').click(() => editThreadData(ACCEPT_PREFIX, false));
            $('button#teamProject').click(() => editThreadData(COMMAND_PREFIX, true));
            $('button#unaccept').click(() => editThreadData(UNACCEPT_PREFIX, false));
           
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