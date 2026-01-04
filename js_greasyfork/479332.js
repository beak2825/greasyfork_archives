// ==UserScript==
// @name   for magenta
// @name:ru Магенты ГА/ЗГА
// @description  Suggestions for improving the script write here ---> https://vk.com/shamrjk
// @description:ru Предложения по улучшению скрипта писать сюда ---> https://vk.com/shamrjk
// @description:uk Пропозиції щодо покращення скрипту писати сюди ---> https://vk.com/shamrjk
// @version 1.1
// @namespace https://forum.blackrussia.online
// @match        https://forum.blackrussia.online/threads/*
// @include      https://forum.blackrussia.online/threads/
// @grant        none
// @license   MIT
// @supportURL https://vk.com/shamrjk
// @icon https://emoji.gg/assets/emoji/9372-blurple-boost-level-9.png
// @downloadURL https://update.greasyfork.org/scripts/479332/for%20magenta.user.js
// @updateURL https://update.greasyfork.org/scripts/479332/for%20magenta.meta.js
// ==/UserScript==

(function () {
  'use strict';
const UNACCСEPT_PREFIX = 4; // Prefix that will be set when thread closes
const ACCСEPT_PREFIX = 8; // Prefix that will be set when thread accepted
const RESHENO_PREFIX = 6; // Prefix that will be set when solving the problem
const PINN_PREFIX = 2; // Prefix that will be set when thread pins
const GA_PREFIX = 12; // Prefix that will be set when thread send to ga
const COMMAND_PREFIX = 10; // Prefix that will be set when thread send to project team
const WATCHED_PREFIX = 9;
const CLOSE_PREFIX = 7;
const SPECY_PREFIX = 11;
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
 title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴Ответы Одобрено ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
      title: 'До минимальных мер',
      content:
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]<br>" +
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][FONT=georgia][I][B]Ваше обжалование было рассмотрено и принято решение о сокращении вашего наказания до минимальных мер.[/FONT][/I][/B][/CENTER] " +
        "[CENTER][B][COLOR=rgb(0, 255, 0)][SIZE=4][FONT=times new roman]✿❯────「Одобрено ❖ Закрыто」────❮✿ [/FONT][/SIZE][/COLOR][/B][/CENTER]",
      prefix: ACCСEPT_PREFIX,
      status: false,
    },
    {
      title: 'Наказание снято',
      content:
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]<br>" +
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][FONT=georgia][I][B]Наказание будет снято.[/FONT][/I][/B][/CENTER] " +
        "[CENTER][B][COLOR=rgb(0, 255, 0)][SIZE=4][FONT=times new roman]✿❯────「Одобрено ❖ Закрыто」────❮✿ [/FONT][/SIZE][/COLOR][/B][/CENTER]",
      prefix: ACCСEPT_PREFIX,
      status: false,
    },
    {
      title: 'Приняты меры к адм',
      content:
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]<br>" +
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][FONT=georgia][I][B]К администратору предприняты меры, приносим свои извинения. <br> Ваша Жалоба будет пересмотрена.[/FONT][/I][/B][/CENTER] " +
        "[CENTER][B][COLOR=rgb(0, 255, 0)][SIZE=4][FONT=times new roman]✿❯────「Одобрено ❖ Закрыто」────❮✿ [/FONT][/SIZE][/COLOR][/B][/CENTER]",
      prefix: ACCСEPT_PREFIX,
      status: false,
    },
    {
      title: '',
      content:
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]<br>" +
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][FONT=georgia][I][B]  [/FONT][/I][/B][/CENTER] " +
        '[CENTER][B][SIZE=4][FONT=times new roman]Приятной игры на [/FONT][FONT=courier new]Black Russia[/FONT] [/SIZE][COLOR=rgb(222, 143, 255)][SIZE=4][FONT=courier new]Magenta[/FONT][/SIZE][/COLOR][COLOR=rgb(222, 143, 255)][SIZE=4][FONT=courier new]![/FONT][/SIZE][/COLOR][/B][/CENTER]<br><br>' +
        "[CENTER][B][COLOR=rgb(0, 255, 0)][SIZE=4][FONT=times new roman]✿❯────「Одобрено ❖ Закрыто」────❮✿ [/FONT][/SIZE][/COLOR][/B][/CENTER]",
      prefix: ACCСEPT_PREFIX,
      status: false,
    },


  {
 title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴На рассмотрении╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
      title: 'Жалоба на рассмотрении',
      content:
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]<br>" +
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Ваша жалоба взята на рассмотрение.<br>Просьба ожидать ответа и не создавать дубликаты данной темы.[/CENTER]<br><br>" +
        '[Color=Flame][CENTER]Ожидайте ответа.[/I][/CENTER][/color][/FONT]',
      prefix: PINN_PREFIX,
      status: false,
    },
    {
      title: 'Передано ГА',
      content:
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]<br>" +
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Ваша жалоба была передана на рассмотрение Главному Администратору.[/CENTER]<br><br>" +
        '[Color=Flame][CENTER]Ожидайте ответа.[/I][/CENTER][/color][/FONT]',
      prefix: GA_PREFIX,
      status: true,
    },
  {
      title: 'Смена Ника',
      content:
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]<br>" +
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Ваш аккаунт разблокирован, у вас есть 24 часа на смену игрового никнейма. При игнорировании отведённого Вам времени на смену ника, Ваш ИА будет заблокирован и обжалелованию не будет подлежать.[/CENTER]<br><br>" +
        '[Color=Flame][CENTER]Тема открыта, после смены никнейма отпишитесь в данной теме.[/I][/CENTER][/color][/FONT]',
      prefix: GA_PREFIX,
      status: true,
    },
    {
      title: 'Спец.администратору',
      content:
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]<br>" +
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Ваша жалоба была передана на рассмотрение Специальному администратору.[/CENTER]<br><br>" +
        '[Color=Flame][CENTER]Ожидайте ответа.[/I][/CENTER][/color][/FONT]',
      prefix: SPECY_PREFIX,
      status: true,
    },
  {
 title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴Отказ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
      {
      title: 'Отказано',
      content:
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]<br>" +
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][B][I][FONT=georgia]В Обжаловании отказано.[/CENTER]<br><br>" +
        '[CENTER][B][COLOR=rgb(255, 0, 0)]✿❯────「[SIZE=4][COLOR=rgb(255, 0, 0)][FONT=times new roman] Закрыто. [/FONT][/COLOR][/SIZE]」────❮✿ [/COLOR][/B] [/CENTER]',
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
      {
      title: 'Сливы',
      content:
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]<br>" +
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][B][I][FONT=georgia]Различные формы `слива` обжалованию не подлежат. Закрыто.[/CENTER]<br><br>" +
        '[CENTER][B][COLOR=rgb(255, 0, 0)]✿❯────「[SIZE=4][COLOR=rgb(255, 0, 0)][FONT=times new roman]Отказано. ❖  Закрыто.[/FONT][/COLOR][/SIZE]」────❮✿ [/COLOR][/B] [/CENTER]',
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
      {
      title: 'Неув контекст',
      content:
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]<br>" +
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][B][I][FONT=georgia]Обжалование с неуважительным контекстом, неуважением к Администрации рассмотрению не подлежат.[/CENTER]<br><br>" +
        '[CENTER][B][COLOR=rgb(255, 0, 0)]✿❯────「[SIZE=4][COLOR=rgb(255, 0, 0)][FONT=times new roman]Отказано. ❖  Закрыто.[/FONT][/COLOR][/SIZE]」────❮✿ [/COLOR][/B] [/CENTER]',
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
    {
      title: 'Нет доказательств',
      content:
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]<br>" +
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Нет каких-либо доказательств на выданное наказание от данного Администратора.[/CENTER]<br><br>" +
        '[CENTER][B][COLOR=rgb(255, 0, 0)]✿❯────「[SIZE=4][COLOR=rgb(255, 0, 0)][FONT=times new roman]Отказано. ❖  Закрыто.[/FONT][/COLOR][/SIZE]」────❮✿ [/COLOR][/B] [/CENTER]',
      prefix: UNACCСEPT_PREFIX,
      status: false,
     },
    {
      title: 'Нет /time',
      content:
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]<br>" +
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][B][I][FONT=georgia]На Ваших доказательствах отсутствует /time[/CENTER]<br><br>" +
        '[CENTER][B][COLOR=rgb(255, 0, 0)]✿❯────「[SIZE=4][COLOR=rgb(255, 0, 0)][FONT=times new roman]Отказано. ❖  Закрыто.[/FONT][/COLOR][/SIZE]」────❮✿ [/COLOR][/B] [/CENTER]',
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
    {
      title: 'Неполный фрапс',
      content:
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]<br>" +
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][B][I][FONT=georgia]Фрапс обрывается. Загрузите полный фрапс на YouTube.[/CENTER]<br><br>" +
        '[CENTER][B][COLOR=rgb(255, 0, 0)]✿❯────「[SIZE=4][COLOR=rgb(255, 0, 0)][FONT=times new roman]Отказано. ❖  Закрыто.[/FONT][/COLOR][/SIZE]」────❮✿ [/COLOR][/B] [/CENTER]',
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
    {
      title: 'Не работают доква',
      content:
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]<br>" +
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Не работают докaзательства[/CENTER]<br><br>" +
        '[CENTER][B][COLOR=rgb(255, 0, 0)]✿❯────「[SIZE=4][COLOR=rgb(255, 0, 0)][FONT=times new roman]Отказано. ❖  Закрыто.[/FONT][/COLOR][/SIZE]」────❮✿ [/COLOR][/B] [/CENTER]',
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
    {
      title: 'Не по форме',
      content:
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]<br>" +
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Обжалование составлено не по форме. [Color=Red]Внимательно прочитайте правила составления Обжалования.[/color].[/CENTER]<br><br>" +
        '[CENTER][B][COLOR=rgb(255, 0, 0)]✿❯────「[SIZE=4][COLOR=rgb(255, 0, 0)][FONT=times new roman]Отказано. ❖  Закрыто.[/FONT][/COLOR][/SIZE]」────❮✿ [/COLOR][/B] [/CENTER]',
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
    {
      title: 'Доква отредактированы',
      content:
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]<br>" +
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][B][I][FONT=georgia]Ваши доказательства отредактированы.[/CENTER]<br><br>" +
        '[CENTER][B][COLOR=rgb(255, 0, 0)]✿❯────「[SIZE=4][COLOR=rgb(255, 0, 0)][FONT=times new roman]Отказано. ❖  Закрыто.[/FONT][/COLOR][/SIZE]」────❮✿ [/COLOR][/B] [/CENTER]',
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
    {
      title: 'От 3-го лица',
      content:
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]<br>" +
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][B][I][FONT=georgia]Жалобы от 3-их лиц не принимаются[/CENTER]<br>" +
        '[CENTER][B][COLOR=rgb(255, 0, 0)]✿❯────「[SIZE=4][COLOR=rgb(255, 0, 0)][FONT=times new roman]Отказано. ❖  Закрыто.[/FONT][/COLOR][/SIZE]」────❮✿ [/COLOR][/B] [/CENTER]',
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
    {
      title: 'Фотохостинги',
      content:
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]<br>" +
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Доказательства должны быть загружены на Yapx/Imgur/YouTube.[/CENTER]<br><br>" +
        '[CENTER][B][COLOR=rgb(255, 0, 0)]✿❯────「[SIZE=4][COLOR=rgb(255, 0, 0)][FONT=times new roman]Отказано. ❖  Закрыто.[/FONT][/COLOR][/SIZE]」────❮✿ [/COLOR][/B] [/CENTER]',
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
     {
      title: 'Дублирование темы',
      content:
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]<br>" +
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Дублироване темы. Если Вы дальше будете заниматься данной деятельностью (дублированием тем), то Ваш форумный аккаунт будет заблокирован на 3 дня и более.[/CENTER]<br><br>" +
        '[CENTER][B][COLOR=rgb(255, 0, 0)]✿❯────「[SIZE=4][COLOR=rgb(255, 0, 0)][FONT=times new roman]Отказано. ❖  Закрыто.[/FONT][/COLOR][/SIZE]」────❮✿ [/COLOR][/B] [/CENTER]',
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
    {
      title: 'В жб на теха',
      content:
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]<br>" +
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Обратитесь в раздел жалоб на Технических специалистов.[/color].[/CENTER]<br><br>" +
        '[CENTER][B][COLOR=rgb(255, 0, 0)]✿❯────「[SIZE=4][COLOR=rgb(255, 0, 0)][FONT=times new roman]Отказано. ❖  Закрыто.[/FONT][/COLOR][/SIZE]」────❮✿ [/COLOR][/B] [/CENTER]',
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
    {
      title: 'Обжалование не подлежат',
      content:
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]<br>" +
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Наказания подобного типа обжалованию не подлежат.[/CENTER]<br><br>" +
        '[CENTER][B][COLOR=rgb(255, 0, 0)]✿❯────「[SIZE=4][COLOR=rgb(255, 0, 0)][FONT=times new roman]Отказано. ❖  Закрыто.[/FONT][/COLOR][/SIZE]」────❮✿ [/COLOR][/B] [/CENTER]',
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
    {
      title: 'Отказано, нет нарушений',
      content:
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]<br>" +
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][B][I][FONT=georgia]Наказание выдано верно, нарушения со стороны администора нет.[/CENTER]<br><br>" +
        '[CENTER][B][COLOR=rgb(255, 0, 0)]✿❯────「[SIZE=4][COLOR=rgb(255, 0, 0)][FONT=times new roman] Закрыто. [/FONT][/COLOR][/SIZE]」────❮✿ [/COLOR][/B] [/CENTER]',
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
  ];

 $(document).ready(() => {
    // Загрузка скрипта для обработки шаблонов
    $('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');

    // Добавление кнопок при загрузке страницы
    addButton('На адм', 'selectAnswer');

    // Поиск информации о теме
    const threadData = getThreadData();

    $('button#pin').click(() => editThreadData(PINN_PREFIX, true));
    $('button#Ga').click(() => editThreadData(GA_PREFIX, true));
    $('button#Spec').click(() => editThreadData(SPECY_PREFIX, true));
    $('button#teamProject').click(() => editThreadData(COMMAND_PREFIX, true));

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