// ==UserScript==
// @name Для руководства | vk: jj0nes
// @namespace https://forum.blackrussia.online
// @version 1.0
// @description New vision
// @author joseph_jones
// @match https://forum.blackrussia.online/threads/*
// @include https://forum.blackrussia.online/threads/
// @grant none
// @license MIT
// @collaborator none
// @icon https://icons.iconarchive.com/icons/google/noto-emoji-people-bodyparts/256/11960-victory-hand-light-skin-tone-icon.png
// @downloadURL https://update.greasyfork.org/scripts/542972/%D0%94%D0%BB%D1%8F%20%D1%80%D1%83%D0%BA%D0%BE%D0%B2%D0%BE%D0%B4%D1%81%D1%82%D0%B2%D0%B0%20%7C%20vk%3A%20jj0nes.user.js
// @updateURL https://update.greasyfork.org/scripts/542972/%D0%94%D0%BB%D1%8F%20%D1%80%D1%83%D0%BA%D0%BE%D0%B2%D0%BE%D0%B4%D1%81%D1%82%D0%B2%D0%B0%20%7C%20vk%3A%20jj0nes.meta.js
// ==/UserScript==

(function () {
'use strict';
'esversion 6' ;
const UNACCEPT_PREFIX = 4; // Prefix that will be set when thread closes
const ACCEPT_PREFIX = 8; // Prefix that will be set when thread accepted
const PIN_PREFIX = 2; // Prefix that will be set when thread pins
const COMMAND_PREFIX = 10; // Prefix that will be set when thread send to project team
const WATCHED_PREFIX = 9;
const CLOSE_PREFIX = 7; // Prefix that will be set when thread closes.
const SA_PREFIX = 11;
const TEX_PREFIX = 13;
const GA_PREFIX = 12;
const V_PREFIX = 1;
const buttons = [
   {
  title: '--------------------------------------------------------------------Рассмотрение--------------------------------------------------------------------',
  },
     {
      title: 'Запрошу док-ва',
      content:
        '[CENTER][FONT=times new roman][SIZE=4][I][COLOR=rgb(255, 0, 0)]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/I][/SIZE][/FONT]<br><br>' +
        "[SIZE=4][I][COLOR=rgb(209, 213, 216)][FONT=times new roman]Запрошу доказательства у администратора. [/FONT][/COLOR][/I]<br>" +
        "[FONT=times new roman][I][COLOR=rgb(209, 213, 216)]Ожидайте ответ в данной теме и не создавайте её копии.[/COLOR][/I][/FONT][/SIZE]<br><br>" +
        '[FONT=times new roman][I][COLOR=orange]На рассмотрении.[/COLOR][/I][/FONT][/CENTER]',
      prefix: PIN_PREFIX,
      status: true,
    },
    {
      title: 'На рассмотрении',
      content:
        '[CENTER][SIZE=4][FONT=times new roman][I][COLOR=rgb(255, 0, 0)]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/I][/FONT][/SIZE]<br><br>' +
        "[I][SIZE=4][COLOR=rgb(209, 213, 216)][FONT=times new roman]Ваша жалоба взята на рассмотрение.[/FONT][/COLOR][/SIZE][/I]<br>" +
        "[FONT=times new roman][I][COLOR=rgb(209, 213, 216)]Ожидайте ответ в данной теме и не создавайте её копии.[/COLOR]<br><br>" +
        '[FONT=times new roman][I][COLOR=orange]На рассмотрении.[/COLOR][/I][/FONT][/CENTER]',
      prefix: PIN_PREFIX,
      status: true,
    },
    {
   title: '-----------------------------------------------------------------------Одобрение-----------------------------------------------------------------------',
  },
    {
      title: 'Админ ошибся',
      content:
        '[CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
        "[SIZE=4][FONT=times new roman][I][COLOR=rgb(209, 213, 216)]Администратор допустил ошибку.[/COLOR]<br>" +
        "[COLOR=rgb(209, 213, 216)]Приносим свои извинения за предоставленные неудобства.[/COLOR]<br><br>" +
        '[COLOR=#00FA9A][FONT=times new roman][SIZE=4][I]Одобрено[/COLOR], [COLOR=rgb(209, 213, 216)]закрыто.[/I][/SIZE][/FONT][/COLOR][/CENTER]',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
  {
      title: 'Беседа с адм.',
      content:
        '[CENTER][FONT=times new roman][COLOR=rgb(255, 0, 0)][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/COLOR][/FONT]<br><br>' +
        "[SIZE=4][FONT=times new roman][I][COLOR=rgb(209, 213, 216)]Наказание будет снято в течении 24 часов.[/COLOR][/I][/FONT][/SIZE]<br>" +
        "[FONT=times new roman][COLOR=#d1d5d8][SIZE=4][I]С администратором проведена профилактическая беседа.<br><br>" +
        '[COLOR=#00FA9A][FONT=times new roman][SIZE=4][I]Одобрено[/COLOR], [COLOR=rgb(209, 213, 216)]закрыто.[/I][/SIZE][/FONT][/COLOR][/CENTER]',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
     {
    title: `Наказание будет смягчено`,
    content:
    '[CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
    "[I][SIZE=4][FONT=times new roman][COLOR=rgb(209, 213, 216)]Мера наказания подобрана некорректно и будет смегчена.[/COLOR][/FONT][/SIZE][/I]<br><br>" +
    '[COLOR=#00FA9A][FONT=times new roman][SIZE=4][I]Одобрено[/COLOR], [COLOR=rgb(209, 213, 216)]закрыто.[/I][/SIZE][/FONT][/COLOR][/CENTER]',
    prefix: ACCEPT_PREFIX,
    status: false,
    },
    {
      title: 'Приняты меры',
      content:
        '[CENTER][FONT=times new roman][COLOR=rgb(255, 0, 0)][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/COLOR][/FONT]<br><br>' +
        "[SIZE=4][FONT=times new roman][I][COLOR=rgb(209, 213, 216)]В сторону администратора приняты меры.[/COLOR][/I][/FONT][/SIZE]<br>" +
        "[FONT=times new roman][COLOR=#d1d5d8][SIZE=4][I]Желаем приятной игры и хорошего настроения.<br><br>" +
        '[COLOR=#00FA9A][FONT=times new roman][SIZE=4][I]Одобрено[/COLOR], [COLOR=rgb(209, 213, 216)]закрыто.[/I][/SIZE][/FONT][/COLOR][/CENTER]',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
     {
    title: `бан айпи`,
    content:
     '[CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
     "[I][SIZE=4][FONT=times new roman][COLOR=rgb(209, 213, 216)]Перезагрузите роутер или смените интернет-подключение.[/COLOR][/FONT][/SIZE][/I]<br>" +
     "[I][SIZE=4][FONT=times new roman][COLOR=rgb(209, 213, 216)]Если проблема останется, создайте новое обращение.[/COLOR][/FONT][/SIZE][/I]<br><br>" +
     '[COLOR=#00FA9A][FONT=times new roman][SIZE=4][I]Рассмотрено[/COLOR], [COLOR=rgb(209, 213, 216)]закрыто.[/I][/SIZE][/FONT][/COLOR][/CENTER]',
    prefix: CLOSE_PREFIX,
    status: false,
    },
  {
  title: '--------------------------------------------------------------------------Отказы--------------------------------------------------------------------------',
  },
    {
      title: 'Ответ дан раннее',
      content:
        '[CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
        "[I][SIZE=4][FONT=times new roman][COLOR=rgb(209, 213, 216)]Ответ на ваше обращение дан в предыдущей теме.[/COLOR][/FONT][/SIZE][/I]<br>" +
        "[I][SIZE=4][FONT=times new roman][COLOR=rgb(209, 213, 216)]За создание дубликатов тем ваш форумный аккаунт может быть заблокирован.[/COLOR][/FONT][/SIZE][/I]<br><br>" +
        '[COLOR=red][FONT=times new roman][SIZE=4][I]Отказано[/COLOR], [COLOR=rgb(209, 213, 216)]закрыто.[/I][/SIZE][/FONT][/COLOR][/CENTER]',
      prefix: CLOSE_PREFIX,
      status: false,
    },
      {
      title: 'Недостаточно док-в',
      content:
        '[CENTER][I][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/FONT][/COLOR][/I]<br><br>' +
        "[COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4][I]Недостаточно доказательств для корректного рассмотрения вашего обращения.[/I][/SIZE][/FONT][/COLOR]<br><br>" +
        '[COLOR=red][FONT=times new roman][SIZE=4][I]Отказано[/COLOR], [COLOR=rgb(209, 213, 216)]закрыто.[/I][/SIZE][/FONT][/COLOR][/CENTER]',
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
     {
      title: 'Нужен фрапс',
      content:
        '[CENTER][I][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/FONT][/COLOR][/I]<br><br>' +
        '[COLOR=rgb(209, 213, 216)][I][FONT=times new roman][SIZE=4]Недостаточно доказательств для рассмотрения жалобы.[/SIZE][/FONT]<br>' +
        "[I][SIZE=4][FONT=times new roman][COLOR=rgb(209, 213, 216)]В данном случае требуются видео - доказательства.[/COLOR][/FONT][/SIZE][/I]<br><br>" +
        '[COLOR=red][FONT=times new roman][SIZE=4][I]Отказано[/COLOR], [COLOR=rgb(209, 213, 216)]закрыто.[/I][/SIZE][/FONT][/COLOR][/CENTER]',
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
     {
      title: 'Док-ва отред.',
      content:
        '[CENTER][I][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/FONT][/COLOR][/I]<br><br>' +
        '[COLOR=rgb(209, 213, 216)][I][FONT=times new roman][SIZE=4]Ваши доказательства были подвергнуты изменениям (редактированию), прикрепите оригинальные файлы.[/SIZE][/FONT]<br><br>' +
        '[COLOR=red][FONT=times new roman][SIZE=4][I]Отказано[/COLOR], [COLOR=rgb(209, 213, 216)]закрыто.[/I][/SIZE][/FONT][/COLOR][/CENTER]',
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
      title: 'Отсутст. док-ва',
      content:
        '[CENTER][I][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/FONT][/COLOR][/I]<br><br>' +
        "[COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4][I]Отсутствуют доказательства - следовательно, рассмотрению не подлежит.[/I][/SIZE][/FONT][/COLOR]<br>" +
        "[SIZE=4][COLOR=rgb(209, 213, 216)][FONT=times new roman][I]Загрузите доказательства на фото-видео хостинги YouTube, Imgur, Yapix или PostImage.[/I][/FONT][/COLOR][/SIZE]<br><br>" +
        '[COLOR=red][FONT=times new roman][SIZE=4][I]Отказано[/COLOR], [COLOR=rgb(209, 213, 216)]закрыто.[/I][/SIZE][/FONT][/COLOR][/CENTER]',
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
      title: 'Тех. спец.',
      content:
        '[CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
        "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Обратитесь в раздел жалоб на Технических специалистов - [/SIZE][/FONT][/COLOR][/I][COLOR=rgb(209, 213, 216)][FONT=times new roman][COLOR=rgb(209, 213, 216)][SIZE=4][URL='https://forum.blackrussia.online/index.php?forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D1%82%D0%B5%D1%85%D0%BD%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%B8%D1%85-%D1%81%D0%BF%D0%B5%D1%86%D0%B8%D0%B0%D0%BB%D0%B8%D1%81%D1%82%D0%BE%D0%B2.490/'][I]*Нажмите сюда*[/I][/URL][/SIZE][/COLOR][/FONT][/COLOR]<br><br>" +
        '[COLOR=red][FONT=times new roman][SIZE=4][I]Отказано[/COLOR], [COLOR=rgb(209, 213, 216)]закрыто.[/I][/SIZE][/FONT][/COLOR][/CENTER]',
      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
      title: 'Не по теме',
      content:
        '[CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
        "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Ваше сообщение никоим образом не относится к предназначению данного раздела.[/SIZE][/FONT][/COLOR][/I]<br><br>" +
        '[COLOR=red][FONT=times new roman][SIZE=4][I]Отказано[/COLOR], [COLOR=rgb(209, 213, 216)]закрыто.[/I][/SIZE][/FONT][/COLOR][/CENTER]',
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
     {
      title: 'Прошло 48 часа',
      content:
        '[CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
        "[COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4][I]Срок написания жалобы - 48 часа с момента выдачи наказания.[/I][/SIZE][/FONT]<br>" +
        "[I][FONT=times new roman][SIZE=4]Рекомендую ознакомиться с правилами составления жалоб на администрацию.[/SIZE][/FONT][/I][/COLOR]<br><br>" +
        '[COLOR=red][FONT=times new roman][SIZE=4][I]Отказано[/COLOR], [COLOR=rgb(209, 213, 216)]закрыто.[/I][/SIZE][/FONT][/COLOR][/CENTER]',
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
      title: 'Не по форме',
      content:
        '[CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
        "[SIZE=4][FONT=times new roman][I][COLOR=rgb(209, 213, 216)]Ваша жалоба составлена не по форме.[/COLOR]<br>" +
        "[COLOR=rgb(209, 213, 216)]Рекомендую ознакомиться с правилами составления жалоб .[/COLOR][/I][/FONT][/SIZE]<br><br>" +
        '[COLOR=red][FONT=times new roman][SIZE=4][I]Отказано[/COLOR], [COLOR=rgb(209, 213, 216)]закрыто.[/I][/SIZE][/FONT][/COLOR][/CENTER]',
      prefix: CLOSE_PREFIX,
      status: false,
    },
     {
      title: 'Док-ва в соц. сетях',
      content:
        '[CENTER][FONT=times new roman][COLOR=rgb(255, 0, 0)][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/COLOR][/FONT]<br><br>' +
        "[COLOR=rgb(209, 213, 216)][I][SIZE=4][FONT=times new roman]Доказательства в социальных сетях не принимаются.[/FONT][/SIZE]<br>" +
        "[SIZE=4][FONT=times new roman]Загрузите доказательства на фото-видео хостинги YouTube, Imgur, Yapix или PostImage.[/FONT][/SIZE][/I][/COLOR]<br><br>" +
        '[COLOR=red][FONT=times new roman][SIZE=4][I]Отказано[/COLOR], [COLOR=rgb(209, 213, 216)]закрыто.[/I][/SIZE][/FONT][/COLOR][/CENTER]',
      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
      title: 'Нет нарушений от адм.',
      content:
        '[CENTER][FONT=times new roman][COLOR=rgb(255, 0, 0)][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/COLOR][/FONT]<br><br>' +
        "[COLOR=rgb(209, 213, 216)][I][SIZE=4][FONT=times new roman]Нарушений со стороны администратора нет.[/FONT][/SIZE]<br><br>" +
        '[COLOR=red][FONT=times new roman][SIZE=4][I]Отказано[/COLOR], [COLOR=rgb(209, 213, 216)]закрыто.[/I][/SIZE][/FONT][/COLOR][/CENTER]',
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
      title: 'Выдано верно',
      content:
        '[CENTER][FONT=times new roman][COLOR=rgb(255, 0, 0)][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/COLOR][/FONT]<br><br>' +
        "[COLOR=rgb(209, 213, 216)][I][SIZE=4][FONT=times new roman]Наказание выдано верно.[/FONT][/SIZE]<br>" +
        "[COLOR=rgb(209, 213, 216)][I][SIZE=4][FONT=times new roman]Нарушений от администратора нет.[/FONT][/SIZE]<br><br>" +
        '[COLOR=red][FONT=times new roman][SIZE=4][I]Отказано[/COLOR], [COLOR=rgb(209, 213, 216)]закрыто.[/I][/SIZE][/FONT][/COLOR][/CENTER]',
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
      title: 'Нужно окно бана',
      content:
        '[CENTER][FONT=times new roman][SIZE=4][I][COLOR=rgb(255, 0, 0)]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR]<br><br>' +
        "[COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4][I]Прикрепите в доказательства скриншот окна блокировки, которое появляется сразу после входа в игру.<br><br>" +
        '[COLOR=red][FONT=times new roman][SIZE=4][I]Отказано[/COLOR], [COLOR=rgb(209, 213, 216)]закрыто.[/I][/SIZE][/FONT][/COLOR][/CENTER]',
      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
   title : 'Оск/мат в жб' ,
   content:
       '[CENTER][FONT=times new roman][SIZE=4][I][COLOR=rgb(255, 0, 0)]{{ greeting }}, {{ user.mention }}.[/COLOR]<br><br>' +
       "[COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4][I]В жалобе отказано, составлена в оскорбительном характере.<br><br>" +
       '[COLOR=red][FONT=times new roman][SIZE=4][I]Отказано[/COLOR], [COLOR=rgb(209, 213, 216)]закрыто.[/I][/SIZE][/FONT][/COLOR][/CENTER]',
   prefix: UNACCEPT_PREFIX,
   status: false,
   },
    {
   title: 'Нет доступа',
   content:
   '[CENTER][FONT=times new roman][COLOR=rgb(255, 0, 0)][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/COLOR][/FONT]<br><br>' +
   "[COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4][I]Ваши доказательства не доступны к просмотру.<br>" +
   "[COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4][I]Загрузите доказательства на фото-видео хостинги YouTube,Imgur, Yapix или PostImage.<br><br>" +
   '[COLOR=red][FONT=times new roman][SIZE=4][I]Отказано[/COLOR], [COLOR=rgb(209, 213, 216)]закрыто.[/I][/SIZE][/FONT][/COLOR][/CENTER]',
   prefix: CLOSE_PREFIX,
   status: false,
   },
      {
  title: '--------------------------------------------------------------------------Обжалования--------------------------------------------------------------------------',
  },
     {
      title: 'Не по форме',
      content:
        '[CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
        "[SIZE=4][FONT=times new roman][I][COLOR=rgb(209, 213, 216)]В обжаловании блокировки отказано, составлено не по форме.[/COLOR]<br>" +
        "[COLOR=rgb(209, 213, 216)]Рекомендую ознакомиться с правилами составления обжалований.[/COLOR][/I][/FONT][/SIZE]<br><br>" +
        '[COLOR=red][FONT=times new roman][SIZE=4][I]Отказано[/COLOR], [COLOR=rgb(209, 213, 216)]закрыто.[/I][/SIZE][/FONT][/COLOR][/CENTER]',
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
     {
      title: 'Обж отказ',
      content:
        '[CENTER][FONT=times new roman][COLOR=rgb(255, 0, 0)][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/COLOR][/FONT]<br><br>' +
        "[COLOR=rgb(209, 213, 216)][I][SIZE=4][FONT=times new roman]На данный момент в обжаловании отказано.[/FONT][/SIZE]<br><br>" +
   '[COLOR=red][FONT=times new roman][SIZE=4][I]Отказано[/COLOR], [COLOR=rgb(209, 213, 216)]закрыто.[/I][/SIZE][/FONT][/COLOR][/CENTER]',
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
     {
      title: 'Не готовы сниз',
      content:
        '[CENTER][FONT=times new roman][COLOR=rgb(255, 0, 0)][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/COLOR][/FONT]<br><br>' +
        "[COLOR=rgb(209, 213, 216)][I][SIZE=4][FONT=times new roman]Администрация сервера не готова снизить вам наказание.[/FONT][/SIZE]<br><br>" +
        '[COLOR=red][FONT=times new roman][SIZE=4][I]Отказано[/COLOR], [COLOR=rgb(209, 213, 216)]закрыто.[/I][/SIZE][/FONT][/COLOR][/CENTER]',
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
     {
      title: 'nRP обман',
      content:
        '[CENTER][FONT=times new roman][COLOR=rgb(255, 0, 0)][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/COLOR][/FONT]<br><br>' +
        "[COLOR=rgb(209, 213, 216)][I][SIZE=4][FONT=times new roman]Чтобы попытаться обжаловать наказание, вы должны быть готовы вернуть все обманутое имущество игроку.[/FONT][/SIZE]<br><br>" +
        '[COLOR=red][FONT=times new roman][SIZE=4][I]Отказано[/COLOR], [COLOR=rgb(209, 213, 216)]закрыто.[/I][/SIZE][/FONT][/COLOR][/CENTER]',
      prefix: CLOSE_PREFIX,
      status: false,
    },
 {
      title: 'Обж не подлежит',
      content:
        '[CENTER][FONT=times new roman][COLOR=rgb(255, 0, 0)][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/COLOR][/FONT]<br><br>' +
        "[COLOR=rgb(209, 213, 216)][I][SIZE=4][FONT=times new roman]Данное наказание не подлежит обжалованию.[/FONT][/SIZE]<br><br>" +
        '[COLOR=red][FONT=times new roman][SIZE=4][I]Отказано[/COLOR], [COLOR=rgb(209, 213, 216)]закрыто.[/I][/SIZE][/FONT][/COLOR][/CENTER]',
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
      title: 'Наказания смягчено',
      content:
        '[CENTER][FONT=times new roman][COLOR=rgb(255, 0, 0)][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/COLOR][/FONT]<br><br>' +
        "[COLOR=rgb(209, 213, 216)][I][SIZE=4][FONT=times new roman]Ваше наказание будет смягчено, впредь не совершайте подобных ошибок.[/FONT][/SIZE]<br><br>" +
        '[COLOR=#00FA9A][FONT=times new roman][SIZE=4][I]Одобрено[/COLOR], [COLOR=rgb(209, 213, 216)]закрыто.[/I][/SIZE][/FONT][/COLOR][/CENTER]',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
  {
      title: 'Смена ника 24ч',
      content:
        '[CENTER][FONT=times new roman][COLOR=rgb(255, 0, 0)][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/COLOR][/FONT]<br><br>' +
        "[COLOR=rgb(209, 213, 216)][I][SIZE=4][FONT=times new roman]Ваш аккаунт будет разблокирован на 24 часа для смены игрового ника.[/FONT][/SIZE]<br><br>" +
        '[FONT=times new roman][I][COLOR=orange]На рассмотрении.[/COLOR][/I][/FONT][/CENTER]',
      prefix: PIN_PREFIX,
      status: true,
    },
{
      title: 'Возврат имущ 24ч',
      content:
        '[CENTER][FONT=times new roman][COLOR=rgb(255, 0, 0)][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/COLOR][/FONT]<br><br>' +
        "[COLOR=rgb(209, 213, 216)][I][SIZE=4][FONT=times new roman]Аккаунт будет разблокирован на 24 часа для возраста имущества.[/FONT][/SIZE]<br>" +
        "[COLOR=rgb(209, 213, 216)][I][SIZE=4][FONT=times new roman]Запишите на запись экрана с /time, как данный игрок возвращает  имущество, после этого предоставить ссылку на данное видео в этой теме.[/FONT][/SIZE]<br><br>" +
        '[FONT=times new roman][I][COLOR=orange]На рассмотрении.[/COLOR][/I][/FONT][/CENTER]',
      prefix: PIN_PREFIX,
      status: true,
    },
{
      title: 'На рассм',
      content:
        '[CENTER][FONT=times new roman][COLOR=rgb(255, 0, 0)][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/COLOR][/FONT]<br><br>' +
        "[COLOR=rgb(209, 213, 216)][I][SIZE=4][FONT=times new roman]Ваше обжалование взято на рассмотрение.[/FONT][/SIZE]<br><br>" +
        '[FONT=times new roman][I][COLOR=orange]На рассмотрении.[/COLOR][/I][/FONT][/CENTER]',
      prefix: PIN_PREFIX,
      status: true,
    },
    {
      title: 'Обжалован',
      content:
        '[CENTER][FONT=times new roman][COLOR=rgb(255, 0, 0)][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/COLOR][/FONT]<br><br>' +
        "[COLOR=rgb(209, 213, 216)][I][SIZE=4][FONT=times new roman]Ваше обжалование одобрено, впредь не совершайте подобных ошибок.[/FONT][/SIZE]<br><br>" +
    '[COLOR=#00FA9A][FONT=times new roman][SIZE=4][I]Одобрено[/COLOR], [COLOR=rgb(209, 213, 216)]закрыто.[/I][/SIZE][/FONT][/COLOR][/CENTER]',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
     {
    title: '--------------------------------------------------------------------------Передача--------------------------------------------------------------------------',
     },
     {
      title: 'Передано СА',
      content:
        '[CENTER][FONT=times new roman][SIZE=4][I][COLOR=rgb(255, 0, 0)]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/I][/SIZE][/FONT]<br><br>' +
        "[I][SIZE=4][COLOR=rgb(209, 213, 216)][FONT=times new roman]Ваша жалоба передана Специальному Администратору.[/COLOR][/FONT][/SIZE][/I]<br><br>" +
        '[FONT=times new roman][I][COLOR=orange]На рассмотрении.[/COLOR][/I][/FONT][/CENTER]',
      prefix: SA_PREFIX,
      status: true,
    },
    {
      title: 'Передано ГА',
      content:
        '[CENTER][FONT=times new roman][SIZE=4][I][COLOR=rgb(255, 0, 0)]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/I][/SIZE][/FONT]<br><br>' +
        "[I][SIZE=4][COLOR=rgb(209, 213, 216)][FONT=times new roman]Ваша жалоба передана Главному Администратору.[/FONT][/COLOR][/SIZE][/I]<br><br>" +
        '[FONT=times new roman][I][COLOR=orange]На рассмотрении.[/COLOR][/I][/FONT][/CENTER]',
      prefix: GA_PREFIX,
      status: true,
    },
    {
      title: 'Передано ЗГА',
      content:
        '[CENTER][SIZE=4][FONT=times new roman][I][COLOR=rgb(255, 0, 0)]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/I][/FONT][/SIZE]<br><br>' +
        "[I][SIZE=4][COLOR=rgb(209, 213, 216)][FONT=times new roman]Ваша жалоба будет передана Заместителю Главного Администратора.[/FONT][/COLOR][/SIZE][/I]<br><br>" +
        '[FONT=times new roman][I][COLOR=orange]На рассмотрении.[/COLOR][/I][/FONT][/CENTER]',
      prefix: PIN_PREFIX,
      status: true,
    },
     {
      title: 'На другой сервер',
      content:
       '[CENTER][SIZE=4][FONT=times new roman][I][COLOR=rgb(255, 0, 0)]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/I][/FONT][/SIZE]<br><br>' +
        "[I][SIZE=4][COLOR=rgb(209, 213, 216)][FONT=times new roman]Ваша жалоба будет перенесена в необходимый раздел.[/FONT][/COLOR][/SIZE][/I]<br><br>" +
        '[FONT=times new roman][I][COLOR=orange]На рассмотрении.[/COLOR][/I][/FONT][/CENTER]',
    }
];


$(document).ready(() => {
// Загрузка скрипта для обработки шаблонов
$('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');

// Добавление кнопок при загрузке страницы
addButton('Закрыто', 'Zakrito');
addButton('На рассмотрение', 'pin');
addButton('Одобрено', 'accepted');
addButton('Ответы', 'selectAnswer');

// Поиск информации о теме
const threadData = getThreadData();

$('button#pin').click(() => editThreadData(PIN_PREFIX, true));
$('button#accepted').click(() => editThreadData(ACCEPT_PREFIX, false));
$('button#Ga').click(() => editThreadData(GA_PREFIX, true));
$('button#teamProject').click(() => editThreadData(COMMAND_PREFIX, true));
$('button#unaccept').click(() => editThreadData(UNACCEPT_PREFIX, false));
$('button#Texy').click(() => editThreadData(TEX_PREFIX, false));
$('button#Zakrito').click(() => editThreadData(CLOSE_PREFIX, false));

$(`button#selectAnswer`).click(() => {
XF.alert(buttonsMarkup(buttons), null, 'Выберите ответ:');
buttons.forEach((btn, id) => {
if (id > 0) {
$(`button#answers-${id}`).click(() => pasteContent(id, threadData, true));
}else {
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
method:

'POST',
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