// ==UserScript==
// @name         KAZAN || Скрипт для Кураторов Форума
// @namespace    https://https://forum.arizonawerenzon.ru
// @version      1.0.8
// @description  По вопросам обратная связь в Вк: vk.com/gdz_po_algebre_3_klass
// @author       Bones_Wick
// @match       https://forum.arizonawerenzon.ru/threads/*
// @include      https://forum.arizonawerenzon.ru/threads/
// @grant        none
// @license      MIT
// @icon https://emoji.gg/assets/emoji/9372-blurple-boost-level-9.png
// @downloadURL https://update.greasyfork.org/scripts/488132/KAZAN%20%7C%7C%20%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%9A%D1%83%D1%80%D0%B0%D1%82%D0%BE%D1%80%D0%BE%D0%B2%20%D0%A4%D0%BE%D1%80%D1%83%D0%BC%D0%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/488132/KAZAN%20%7C%7C%20%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%9A%D1%83%D1%80%D0%B0%D1%82%D0%BE%D1%80%D0%BE%D0%B2%20%D0%A4%D0%BE%D1%80%D1%83%D0%BC%D0%B0.meta.js
// ==/UserScript==
 
(function () {
    'use strict';
  const UNACCСEPT_PREFIX = 2; // Prefix that will be set when thread closes
  const ACCСEPT_PREFIX = 1; // Prefix that will be set when thread accepted
  const RESHENO_PREFIX = 1; // Prefix that will be set when solving the problem
  const PINN_PREFIX = 7; // Prefix that will be set when thread pins
  const GA_PREFIX = 6; // Prefix that will be set when thread send to ga
  const COMMAND_PREFIX = 6; // Prefix that will be set when thread send to project team
  const WATCHED_PREFIX = 9;
  const CLOSE_PREFIX = 2;
  const SPECY_PREFIX = 6;
  const TEXY_PREFIX = 13;
  const OTKAZBIO_PREFIX = 4;
  const ODOBRENOBIO_PREFIX = 8;
  const NARASSMOTRENIIBIO_PREFIX = 2;
  const OTKAZRP_PREFIX = 4;
  const ODOBRENORP_PREFIX = 8;
  const NARASSMOTRENIIRP_PREFIX = 2;
  const OTKAZORG_PREFIX = 4;
  const ODOBRENOORG_PREFIX = 8;
  const NARASSMOTRENIIORG_PREFIX = 2;
  const buttons = [
      {
       title: '- - - - - -  - - - - - - - - -  - - - - - - - - - - - - - - - - - Жалобы на администрацию - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -',
      },
      {
        title: 'Будет беседа с админом',
        content:
          '[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
          "[CENTER][FONT=georgia][I][B]С администратором будет проведена строгая беседа.<br>Спасибо за Ваше обращение.<br>Приятной игры на просторах сервера Blue. [/FONT][/I][/CENTER] " +
          '[Color=Green][CENTER]Одобрено, закрыто.[/I][/B][/CENTER][/color][/FONT]',
        prefix: ACCСEPT_PREFIX,
        status: false,
      },
      {
        title: 'Будет беседа с админом и наказание будет снято',
        content:
          '[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
          "[CENTER][FONT=georgia][I][B]С администратором будет проведена строгая беседа.<br>Ваше наказание будет снято в течение нескольких часов.<br>Спасибо за Ваше обращение.<br>Приятной игры на просторах сервера Blue. [/FONT][/I][/CENTER] " +
          '[Color=Green][CENTER]Одобрено, закрыто.[/I][/B][/CENTER][/color][/FONT]',
        prefix: ACCСEPT_PREFIX,
        status: false,
      },
      {
        title: 'ЖБ на рассмотрении',
        content:
          '[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
          "[CENTER]Запрошу доказательства у администратора.<br>Ожидайте вынесения вердикта и не создавайте копии данной темы.[/CENTER]<br>" +
          '[Color=Orange][CENTER]На рассмотрении...[/I][/CENTER][/color][/FONT]',
        prefix: WATCHED_PREFIX,
        status: false,
      },
      {
        title: 'С момента выдачи наказания более 24ч',
        content:
          '[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
          "[CENTER]Срок написания жалобы составляет один день (24 часа) с момента совершенного нарушения со стороны администратора сервера.<br>Приятной игры на просторах сервера Blue.[/CENTER]<br>" +
          '[Color=Red][CENTER]Отказано, закрыто.[/I][/CENTER][/color][/FONT]',
        prefix: UNACCСEPT_PREFIX,
        status: false,
      },
      {
        title: 'Адм предоставил док-ва',
        content:
          '[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
          "[CENTER]Администратор предоставил доказательства, наказание выдано верно.<br>Приятной игры на просторах сервера Blue.[/CENTER]<br>" +
          '[Color=Red][CENTER]Отказано, закрыто.[/I][/CENTER][/color][/FONT]',
        prefix: UNACCСEPT_PREFIX,
        status: false,
      },
      {
        title: 'дата в жб отличается от даты в скрине',
        content:
          '[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
          "[CENTER]Дата указанная в жалобе, отличается от даты на скриншоте.<br>Приятной игры на просторах сервера Blue.[/CENTER]<br>" +
          '[Color=Red][CENTER]Отказано, закрыто.[/I][/CENTER][/color][/FONT]',
        prefix: UNACCСEPT_PREFIX,
        status: false,
      },
      {
        title: 'Недостаточно док-в',
        content:
          '[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
          "[CENTER]Недостаточно доказательств нарушения со стороны администратора.<br>Благодарим вас за ваше обращение.<br>Приятной игры на просторах сервера Blue.[/CENTER]<br>" +
          '[Color=Red][CENTER]Отказано, закрыто.[/I][/CENTER][/color][/FONT]',
        prefix: UNACCСEPT_PREFIX,
        status: false,
      },
      {
        title: 'Нарушений со стороны адм нет',
        content:
          '[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
          "[CENTER]Нарушений со стороны администратора не было найдено.<br>Приятной игры на просторах сервера Blue.[/CENTER]<br>" +
          '[Color=Red][CENTER]Отказано, закрыто.[/I][/CENTER][/color][/FONT]',
        prefix: UNACCСEPT_PREFIX,
        status: false,
      },
      {
        title: 'Нужен Скрин бана',
        content:
          '[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
          "[CENTER]Как доказательство прикладывается скриншот окна бана при входе на сервер.<br>Подайте новую жалобу и прикрепите такой скриншот, если он у вас имеется.<br>Благодарим вас за обращение.<br>Приятной игры на просторах сервера Blue.[/CENTER]<br>" +
          '[Color=Red][CENTER]Отказано, закрыто.[/I][/CENTER][/color][/FONT]',
        prefix: UNACCСEPT_PREFIX,
        status: false,
      },
      {
        title: 'ЖБ не по форме',
        content:
          '[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
          "[CENTER]Ваша жалоба составлена не по форме.<br>Убедительная просьба ознакомиться [URL='https://forum.blackrussia.online/index.php?threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BF%D0%BE%D0%B4%D0%B0%D1%87%D0%B8-%D0%B6%D0%B0%D0%BB%D0%BE%D0%B1-%D0%BD%D0%B0-%D0%B0%D0%B4%D0%BC%D0%B8%D0%BD%D0%B8%D1%81%D1%82%D1%80%D0%B0%D1%86%D0%B8%D1%8E.193316/']*с правилами подачи жалоб на игроков*[/URL].[/CENTER]<br>" +
          '[Color=Red][CENTER]Отказано, закрыто.[/I][/CENTER][/color][/FONT]',
        prefix: UNACCСEPT_PREFIX,
        status: false,
      },
      {
        title: 'В обжалования',
        content:
          '[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
          "[CENTER]Вы ошиблись разделом.<br>Обратитесь в раздел [URL='https://forum.blackrussia.online/index.php?forums/%D0%9E%D0%B1%D0%B6%D0%B0%D0%BB%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D0%B5-%D0%BD%D0%B0%D0%BA%D0%B0%D0%B7%D0%B0%D0%BD%D0%B8%D0%B9.157/']*Обжалование наказаний*[/URL].[/CENTER]<br>" +
          '[Color=Red][CENTER]Отказано, закрыто.[/I][/CENTER][/color][/FONT]',
        prefix: UNACCСEPT_PREFIX,
        status: false,
      },
      {
        title: 'Техническому специалисту',
        content:
          '[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
          "[CENTER]Ваша жалоба была передана на рассмотрение техническому специалисту.<br>Ожидайте вынесения вердикта и не создавайте копии данной темы.[/CENTER]<br>" +
          '[Color=Flame][CENTER]Ожидайте ответа.[/I][/CENTER][/color][/FONT]',
        prefix: TEXY_PREFIX,
        status: true,
      },
      {
        title: 'Передано ГА',
        content:
          '[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
          "[CENTER]Ваша жалоба была передана на рассмотрение Главному Администратору.<br>Ожидайте вынесения вердикта и не создавайте копии данной темы.[/CENTER]<br>" +
          '[Color=Flame][CENTER]Ожидайте ответа.[/I][/CENTER][/color][/FONT]',
        prefix: GA_PREFIX,
        status: true,
      },
      {
        title: 'Передано Специальному администратору',
        content:
          '[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
          "[CENTER]Ваша жалоба была передана на рассмотрение Специальному администратору.<br>Ожидайте вынесения вердикта и не создавайте копии данной темы.[/CENTER]<br>" +
          '[Color=Flame][CENTER]Ожидайте ответа.[/I][/CENTER][/color][/FONT]',
        prefix: SPECY_PREFIX,
        status: true,
      },
      {
        title: 'В тех. раздел',
        content:
          '[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
          "[CENTER]Вы ошиблись разделом.<br>Обратитесь в [URL='https://forum.blackrussia.online/index.php?forums/%D0%A2%D0%B5%D1%85%D0%BD%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%B8%D0%B9-%D1%80%D0%B0%D0%B7%D0%B4%D0%B5%D0%BB-blue.228/']*технический раздел*[/URL].[/CENTER]<br>" +
          '[Color=Red][CENTER]Отказано, закрыто.[/I][/CENTER][/color][/FONT]',
        prefix: UNACCСEPT_PREFIX,
        status: false,
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
          "[CENTER]Вы ошиблись сервером/разделом, переподайте жалобу в нужный раздел.[/CENTER]<br>",
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
          "[CENTER][B][I][FONT=georgia]3.6. Прикрепление доказательств обязательно. Примечание: загрузка доказательств в соц. сети (ВКонтакте, instagram) запрещается, доказательства должны быть загружены на фото/видео хостинги (YouTube, Япикс, imgur).[/CENTER]" +
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
        title: 'Срок снижен до 30 дней',
        content:
          '[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
          "[CENTER]Срок блокировки аккаунта будет снижен до 30 дней.<br>С момента разблокировки аккаунта, не повторяйте подобных действий.<br>Приятной игры на просторах сервера Blue.[/CENTER]<br>" +
          '[Color=Green][CENTER]Одобрено, закрыто.[/I][/CENTER][/color][/FONT]',
        prefix: ACCСEPT_PREFIX,
        status: false,
      },
      {
        title: 'Срок снижен до 15 дней',
        content:
          '[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
          "[CENTER]Срок блокировки аккаунта будет снижен до 15 дней.<br>С момента разблокировки аккаунта, не повторяйте подобных действий.<br>Приятной игры на просторах сервера Blue.[/CENTER]<br>" +
          '[Color=Green][CENTER]Одобрено, закрыто.[/I][/CENTER][/color][/FONT]',
        prefix: ACCСEPT_PREFIX,
        status: false,
      },
      {
        title: 'Срок снижен до 7 дней',
        content:
          '[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
          "[CENTER]Срок блокировки аккаунта будет снижен до 7 дней.<br>С момента разблокировки аккаунта, не повторяйте подобных действий.<br>Приятной игры на просторах сервера Blue.[/CENTER]<br>" +
          '[Color=Green][CENTER]Одобрено, закрыто.[/I][/CENTER][/color][/FONT]',
        prefix: ACCСEPT_PREFIX,
        status: false,
      },
      {
        title: 'Срок снижен до 3 дней',
        content:
          '[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
          "[CENTER]Срок блокировки аккаунта будет снижен до 3 дней.<br>С момента разблокировки аккаунта, не повторяйте подобных действий.<br>Приятной игры на просторах сервера Blue.[/CENTER]<br>" +
          '[Color=Green][CENTER]Одобрено, закрыто.[/I][/CENTER][/color][/FONT]',
        prefix: ACCСEPT_PREFIX,
        status: false,
      },
      {
        title: 'Обж отказано',
        content:
          '[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
          "[CENTER]К сожалению, вам отказано в смягчении наказания.<br>Не расстраивайтесь и всего вам доброго.<br>Приятной игры на просторах сервера Blue.[/CENTER]<br>" +
          '[Color=Red][CENTER]Отказано, закрыто.[/I][/CENTER][/color][/FONT]',
        prefix: UNACCСEPT_PREFIX,
        status: false,
      },
      {
        title: '24ч на возврат имущества',
        content:
          '[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
          "[CENTER]Тема будет находится в закреплении, у вас есть 24 часа на возвращение имущества, и предъявления видеофиксации.<br>Обманутая сторона также может отписать о возвращении оговоренного имущества.[/CENTER]<br>" +
          '[Color=Orange][CENTER]На рассмотрении...[/I][/CENTER][/color][/FONT]',
        prefix: WATCHED_PREFIX,
        status: false,
      },
      {
        title: 'В ЖБ на адм',
        content:
          '[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
          "[CENTER]Вы ошиблись разделом.<br>Обратитесь в раздел [URL='https://forum.blackrussia.online/index.php?forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B0%D0%B4%D0%BC%D0%B8%D0%BD%D0%B8%D1%81%D1%82%D1%80%D0%B0%D1%86%D0%B8%D1%8E.154/']*жалобы на администрацию*[/URL].Приятной игры на просторах сервера Blue.[/CENTER]<br>" +
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