// // ==UserScript== 
// @name         Скрипт куратора Alexander_Devil
// @namespace    https://forum.blackrussia.online
// @version      4.5
// @description  The best revenge is a huge success. 
// @author       Michael_Fiend
// @match        https://forum.blackrussia.online/threads/*
// @include      https://forum.blackrussia.online/threads/
// @grant        none
// @license      MIT
// @collaborator Devil
// @icon https://icons.iconarchive.com/icons/google/noto-emoji-people-bodyparts/256/11960-victory-hand-light-skin-tone-icon.png
// @downloadURL https://update.greasyfork.org/scripts/464393/%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%BA%D1%83%D1%80%D0%B0%D1%82%D0%BE%D1%80%D0%B0%20Alexander_Devil.user.js
// @updateURL https://update.greasyfork.org/scripts/464393/%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%BA%D1%83%D1%80%D0%B0%D1%82%D0%BE%D1%80%D0%B0%20Alexander_Devil.meta.js
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

      title: 'Запрошу док-ва',
      content:
        '[CENTER][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый игрок.[/I][/SIZE][/FONT]<br><br>' +
        "[SIZE=4][I][FONT=times new roman] Запрошу доказательства у администратора. [/FONT][/I]<br>" +
        '[FONT=times new roman][I]Ожидайте, пожалуйста, ответа от администрации и не нужно создавать копии этой темы.[/I][/FONT][/SIZE][/CENTER]',
      prefix: PIN_PREFIX,
      status: true,
    },
    {
      title: 'На рассмотрении',
      content:
        '[CENTER][SIZE=4][FONT=times new roman][I]{{ greeting }}, уважаемый игрок.[/I][/FONT][/SIZE]<br><br>' +
        "[I][SIZE=4][FONT=times new roman]Ваша жалоба взята на рассмотрение.[/FONT][/SIZE][/I]<br>" +
        '[SIZE=4][FONT=times new roman][I]Не нужно создавать копии этой жалобы, ожидайте ответа в этой теме.[/I][/FONT][/SIZE][/CENTER]',
      prefix: PIN_PREFIX,
      status: true,
    },
    {
      title: 'Док-ва предоставлены',
      content:
        '[CENTER][I][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый игрок.[/SIZE][/FONT][/I]<br><br>' +
        "[FONT=times new roman][SIZE=4][I]Доказательства предоставлены, наказание выдано верно.[/I]<br>" +
        "[I]Внимательно прочтите общие правила серверов и впредь, пожалуйста, не нарушайте - [/I][URL='https://forum.blackrussia.online/index.php?threads/%D0%9E%D0%B1%D1%89%D0%B8%D0%B5-%D0%BF%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%B5%D1%80%D0%B2%D0%B5%D1%80%D0%BE%D0%B2.312571/']*Нажмите сюда*[/URL][/SIZE][/FONT]<br><br>" +
       '[FONT=times new roman][SIZE=4][I]Приятной игры и времяпровождения на сервере [/I][I][COLOR=rgb(0, 255, 255)]Irkutsk [/COLOR][/I][/SIZE][/FONT][FONT=times new roman][SIZE=4][I].[/I][/SIZE][/FONT]<br><br>' +
        '[I][FONT=times new roman][SIZE=4]Закрыто.[/SIZE][/FONT][/I][/CENTER]<br>',
      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
      title: 'Передано ГА',
      content:
        '[CENTER][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый игрок.[/I][/SIZE][/FONT]<br><br>' +
        "[FONT=times new roman][SIZE=4]Ваша жалоба переадресована на рассмотрение [/SIZE][/FONT][FONT=times new roman][SIZE=4]Главному Администратору[/SIZE][/FONT][FONT=times new roman][SIZE=4].[/SIZE][/FONT]<br><br>" +
        '[FONT=times new roman][SIZE=4]Ожидайте ответа в данной теме, копии создавать не нужно.[/SIZE][/FONT][/CENTER]<br>',
      prefix: GA_PREFIX,
      status: true,
    },
    {
title: 'дата',
      content:
       '[CENTER][I][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый игрок.[/SIZE][/FONT][/I]<br><br>' +
        "[I][SIZE=4][FONT=times new roman]3.5. Игровой ник автора жалобы, ник администратора, на которого подается жалоба, дата выдачи наказания должны быть указаны в соответствии с правилами подачи жалоб, даже если эта информация присутствует на доказательствах или в тексте жалобы.[/FONT][/SIZE][/I]<br><br>" +
        '[FONT=times new roman][SIZE=4][I]Приятной игры и времяпровождения на сервере [/I][I][COLOR=rgb(0, 255, 255)]Irkutsk [/COLOR][/I][/SIZE][/FONT][FONT=times new roman][SIZE=4][I].[/I][/SIZE][/FONT]<br><br>' +
        '[I][FONT=times new roman][SIZE=4]Закрыто.[/SIZE][/FONT][/I][/CENTER]<br>',
      prefix: CLOSE_PREFIX,
      status: false,
 },
    {
      title: 'Ответ дан раннее',
      content:
       '[CENTER][I][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый игрок.[/SIZE][/FONT][/I]<br><br>' +
        "[I][SIZE=4][FONT=times new roman]Вам уже ранее был дан корректный ответ, за создание дубликатов этой темы ваш форумный аккаунт может быть заблокирован.[/FONT][/SIZE][/I]<br><br>" +
        '[FONT=times new roman][SIZE=4][I]Приятной игры и времяпровождения на сервере [/I][I][COLOR=rgb(0, 255, 255)]Irkutsk [/COLOR][/I][/SIZE][/FONT][FONT=times new roman][SIZE=4][I].[/I][/SIZE][/FONT]<br><br>' +
        '[I][FONT=times new roman][SIZE=4]Закрыто.[/SIZE][/FONT][/I][/CENTER]<br>',
      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
      title: 'наказание будет снято',
      content:
        '[CENTER][I][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый игрок.[/SIZE][/FONT][/I]<br><br>' +
        "[SIZE=4][FONT=times new roman][I]Администратор допустил ошибку.<br>" +
        "Приносим свои извинения за доставленные неудобства.<br>" +
        "Ваше наказание будет снято в течение 6-ти часов.[/I][/FONT][/SIZE]<br>" +
        '[FONT=times new roman][SIZE=4][I]Приятной игры и времяпровождения на сервере [/I][I][COLOR=rgb(0, 255, 255)]Irkutsk [/COLOR][/I][/SIZE][/FONT][FONT=times new roman][SIZE=4][I].[/I][/SIZE][/FONT]<br><br>' +
        '[I][FONT=times new roman][SIZE=4]Закрыто.[/SIZE][/FONT][/I][/CENTER]<br>',
      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
      title: 'Недостаточно док-в',
      content:
       '[CENTER][I][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый игрок.[/SIZE][/FONT][/I]<br><br>' +
        "[FONT=times new roman][SIZE=4][I]Недостаточно доказательств для корректного рассмотрения вашего обращения.[/I][/SIZE][/FONT]<br><br>" +
        '[FONT=times new roman][SIZE=4][I]Приятной игры и времяпровождения на сервере [/I][I][COLOR=rgb(0, 255, 255)]Irkutsk [/COLOR][/I][/SIZE][/FONT][FONT=times new roman][SIZE=4][I].[/I][/SIZE][/FONT]<br><br>' +
        '[I][FONT=times new roman][SIZE=4]Закрыто.[/SIZE][/FONT][/I][/CENTER]<br>',
      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
      title: 'Нужен фрапс',
      content:
       '[CENTER][I][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый игрок.[/SIZE][/FONT][/I]<br><br>' +
        '[I][FONT=times new roman][SIZE=4]Недостаточно доказательств для корректного рассмотрения жалобы. В данном случае требуются видео - доказательства.[/SIZE][/FONT<br>]<br>' +
        '[FONT=times new roman][SIZE=4][I]Приятной игры и времяпровождения на сервере [/I][I][COLOR=rgb(0, 255, 255)]Irkutsk [/COLOR][/I][/SIZE][/FONT][FONT=times new roman][SIZE=4][I].[/I][/SIZE][/FONT]<br><br>' +
        '[I][FONT=times new roman][SIZE=4]Закрыто.[/SIZE][/FONT][/I][/CENTER]<br>',
      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
      title: 'Док-ва отред.',
      content:
        '[CENTER][I][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый игрок.[/SIZE][/FONT][/I]<br><br>' +
        '[I][FONT=times new roman][SIZE=4]Ваши доказательства были подвергнуты изменениям (редактированию), прикрепите оригинальные файлы.[/SIZE][/FONT]<br><br>' +
        '[FONT=times new roman][SIZE=4][I]Закрыто.[/I][/SIZE][/FONT][/CENTER]<br>',
      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
 
      title: 'Отсутст. док-ва',
      content:
        '[CENTER][I][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый игрок.[/SIZE][/FONT][/I]<br><br>' +
        "[FONT=times new roman][SIZE=4][I]Отсутствуют доказательства - следовательно, рассмотрению не подлежит.[/I][/SIZE][/FONT]<br>" +
        "[SIZE=4][FONT=times new roman][I]Загрузите доказательства на фото-видео хостинги YouTube, Imgur, Yapx и так далее.[/I][/FONT][/SIZE]<br><br>" +
        '[I][FONT=times new roman][SIZE=4]Закрыто.[/SIZE][/FONT][/I][/CENTER]',
      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
      title: 'Тех. спец.',
      content:
        '[CENTER][I][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый игрок.[/SIZE][/FONT][/I]<br><br>' +
        "[I][FONT=times new roman][SIZE=4]Обратитесь в раздел жалоб на Технических специалистов - [/SIZE][/FONT][/I][FONT=times new roman][SIZE=4][URL='https://forum.blackrussia.online/index.php?forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D1%82%D0%B5%D1%85%D0%BD%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%B8%D1%85-%D1%81%D0%BF%D0%B5%D1%86%D0%B8%D0%B0%D0%BB%D0%B8%D1%81%D1%82%D0%BE%D0%B2.490/']*Нажмите сюда*[/URL][/SIZE][/FONT]<br><br>" +
       '[FONT=times new roman][SIZE=4][I]Приятной игры и времяпровождения на сервере [/I][I][COLOR=rgb(0, 255, 255)]Irkutsk [/COLOR][/I][/SIZE][/FONT][FONT=times new roman][SIZE=4][I].[/I][/SIZE][/FONT]<br><br>' +
        '[I][FONT=times new roman][SIZE=4]Закрыто.[/SIZE][/FONT][/I][/CENTER]<br>',
      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
      title: 'Не по теме',
      content:
       '[CENTER][I][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый игрок.[/SIZE][/FONT][/I]<br><br>' +
        "[I][FONT=times new roman][SIZE=4]Ваше сообщение никоим образом не относится к предназначению данного раздела.[/SIZE][/FONT][/I]<br><br>" +
        '[FONT=times new roman][SIZE=4][I]Приятной игры и времяпровождения на сервере [/I][I][COLOR=rgb(0, 255, 255)]Irkutsk [/COLOR][/I][/SIZE][/FONT][FONT=times new roman][SIZE=4][I].[/I][/SIZE][/FONT]<br><br>' +
        '[I][FONT=times new roman][SIZE=4]Закрыто.[/SIZE][/FONT][/I][/CENTER]<br>',
      prefix: CLOSE_PREFIX,
      status: false,    },
    {
      title: 'В обжалования',
      content:
        '[CENTER][I][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый игрок.[/SIZE][/FONT][/I]<br><br>' +
        "[I][FONT=times new roman][SIZE=4]Обратитесь в раздел обжалований наказаний.[/SIZE][/FONT][/I]<br><br>" +
        '[FONT=times new roman][SIZE=4][I]Приятной игры и времяпровождения на сервере [/I][I][COLOR=rgb(0, 255, 255)]Irkutsk [/COLOR][/I][/SIZE][/FONT][FONT=times new roman][SIZE=4][I].[/I][/SIZE][/FONT]<br><br>' +
        '[I][FONT=times new roman][SIZE=4]Закрыто.[/SIZE][/FONT][/I][/CENTER]<br>',
      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
      title: 'Прошло 48 часов',
      content:
       '[CENTER][I][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый игрок.[/SIZE][/FONT][/I]<br><br>' +
        "[FONT=times new roman][SIZE=4][I]Срок написания жалобы - 48 часа с момента выдачи наказания.[/I][/SIZE][/FONT]<br>" +
        "[I][FONT=times new roman][SIZE=4]Внимательно прочитайте правила составления жалоб, которые закреплены в этом разделе.[/SIZE][/FONT][/I]<br><br>" +
        '[FONT=times new roman][SIZE=4][I]Приятной игры и времяпровождения на сервере [/I][I][COLOR=rgb(0, 255, 255)]Irkutsk [/COLOR][/I][/SIZE][/FONT][FONT=times new roman][SIZE=4][I].[/I][/SIZE][/FONT]<br><br>' +
        '[I][FONT=times new roman][SIZE=4]Закрыто.[/SIZE][/FONT][/I][/CENTER]<br>',
      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
      title: 'ЖБ Не по форме',
      content:
       '[CENTER][I][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый игрок.[/SIZE][/FONT][/I]<br><br>' +
        "[SIZE=4][FONT=times new roman][I]Ваша жалоба составлена не по форме.<br><br>" +
        "Внимательно прочитайте правила составления жалоб, которые закреплены в этом разделе.[/I][/FONT][/SIZE]<br><br>" +
        '[FONT=times new roman][SIZE=4][I]Закрыто.[/I][/SIZE][/FONT][/CENTER]',
      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
      title: 'Передано СА',
      content:
        '[CENTER][I][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый игрок.[/SIZE][/FONT][/I]<br><br>' +
        "[I][FONT=times new roman][SIZE=4]Ваша жалоба переадресована [/SIZE][/FONT][/I][I][FONT=times new roman][SIZE=4]Специальному Администратору[/SIZE][/FONT][/I][I][FONT=times new roman][SIZE=4].[/SIZE][/FONT][/I]<br><br>" +
        '[FONT=times new roman][SIZE=4][I]Ожидайте ответа в данной теме, копии создавать не нужно.[/I][/SIZE][/FONT][/CENTER]',
      prefix: SA_PREFIX,
      status: true,
    },
    {
      title: 'Док-ва в соц. сетях',
      content:
       '[CENTER][I][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый игрок.[/SIZE][/FONT][/I]<br><br>' +
        "[SIZE=4][FONT=Arial]Доказательства в социальных сетях и т.д. не принимаются.[/FONT][/SIZE]<br>" +
        "[SIZE=4][FONT=Arial]Загрузите доказательства на фото-видео хостинги YouTube, Imgur, Yapx и так далее.[/FONT][/SIZE]<br><br>" +
        '[FONT=Arial[SIZE=4]Закрыто.[/SIZE][/FONT]',
      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
      title: 'нет нарушений от адм',
      content:
       '[CENTER][I][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый игрок.[/SIZE][/FONT][/I]<br><br>' +
        "[I][SIZE=4][FONT=times new roman]Нарушений со стороны администратора нет.[/FONT][/SIZE]<br><br>" +
        '[FONT=times new roman][SIZE=4][I]Приятной игры и времяпровождения на сервере [/I][I][COLOR=rgb(0, 255, 255)]Irkutsk [/COLOR][/I][/SIZE][/FONT][FONT=times new roman][SIZE=4][I].[/I][/SIZE][/FONT]<br><br>' +
        '[I][FONT=times new roman][SIZE=4]Закрыто.[/SIZE][/FONT][/I][/CENTER]<br>',
      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
      title: 'Выдано верно',
      content:
       '[CENTER][I][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый игрок.[/SIZE][/FONT][/I]<br><br>' +
        "[I][SIZE=4][FONT=times new roman]Нарушений со стороны администратора нет.[/FONT][/SIZE]<br>" +
        "[SIZE=4][FONT=times new roman]Наказание выдано верно.[/FONT][/SIZE][/I]<br><br>" +
       '[FONT=times new roman][SIZE=4][I]Приятной игры и времяпровождения на сервере [/I][I][COLOR=rgb(0, 255, 255)]Irkutsk [/COLOR][/I][/SIZE][/FONT][FONT=times new roman][SIZE=4][I].[/I][/SIZE][/FONT]<br><br>' +
        '[I][FONT=times new roman][SIZE=4]Закрыто.[/SIZE][/FONT][/I][/CENTER]<br>',
      prefix: CLOSE_PREFIX,
      status: false,
   },
    {
      title: 'Окно бана',
      content:
        '[CENTER][I][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый игрок.[/SIZE][/FONT][/I]<br><br>' +
        '[FONT=times new roman][SIZE=4][I]Прикрепите в доказательства скриншот окна блокировки, которое появляется сразу после входа в игру.<br><br>' +
        '[FONT=times new roman][SIZE=4][I]Закрыто.[/I][/SIZE][/FONT][/CENTER]<br>',
      prefix: CLOSE_PREFIX,
      status: false,

    },
    {
      title: 'беседа с адм',
      content:
        '[CENTER][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый игрок.[/I][/SIZE][/FONT]<br><br>' +
        "[SIZE=4][FONT=times new roman][I]С администратором будет проведена беседа.[/I][/FONT][/SIZE]<br>" +
        "[FONT=times new roman][SIZE=4][I]Приносим свои извинения за доставленные неудобства.<br><br>" +
'[FONT=times new roman][SIZE=4][I]Спасибо за информацию, приятной игры и времяпровождения на сервере [/I][I][COLOR=rgb(0, 255, 255)]Irkutsk [/COLOR][/I][/SIZE][/FONT][FONT=times new roman][SIZE=4][I].[/I][/SIZE][/FONT]<br><br>' +
        '[I][FONT=times new roman][SIZE=4]Закрыто.[/SIZE][/FONT][/I][/CENTER]<br>',
      prefix: CLOSE_PREFIX,
      status: false,
  },
      {
	  title: '| _________Раздел обжалования_________ |',
	},
    {
      title: 'Обж. отказано',
      content:
        '[CENTER][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT]<br><br>' +
        "[FONT=times new roman][SIZE=4][FONT=times new roman]В обжаловании отказано.[/FONT][/SIZE]<br><br>" +
        '[FONT=times new roman][SIZE=4][I]Закрыто.[/I][/SIZE]',
      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
      title: 'Обж. не подлежит',
      content:
        '[CENTER][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT]<br><br>' +
        "[SIZE=4][I][FONT=times new roman]Данное нарушение обжалованию не подлежит.[/FONT][/I][/SIZE]<br>" +
        "[FONT=times new roman][SIZE=4][I]Внимательно прочитайте правила подачи обжалования, закреплённые в данном разделе.<br>" +
        "В обжаловании отказано.<br><br>" +
        '[SIZE=4][I][FONT=times new roman]Закрыто.[/FONT][/I][/SIZE][/CENTER]',
      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
      title: 'Обж. не по форме',
      content:
        '[CENTER][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT]<br><br>' +
        "[I][SIZE=4][FONT=times new roman]Обжалование составлено не по форме.[/FONT][/SIZE]<br>" +
        "[SIZE=4][FONT=times new roman]Внимательно прочитайте правила составления обжалований - [/FONT][/SIZE][/I][SIZE=4][FONT=times new roman][URL='https://forum.blackrussia.online/index.php?threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BF%D0%BE%D0%B4%D0%B0%D1%87%D0%B8-%D0%B7%D0%B0%D1%8F%D0%B2%D0%BA%D0%B8-%D0%BD%D0%B0-%D0%BE%D0%B1%D0%B6%D0%B0%D0%BB%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D0%B5-%D0%BD%D0%B0%D0%BA%D0%B0%D0%B7%D0%B0%D0%BD%D0%B8%D1%8F.1158794/']*Нажмите сюда*[/URL].[/FONT][/SIZE]<br><br>" +
        '[I][FONT=times new roman][SIZE=4][I]Закрыто.[/I][/SIZE][/FONT][/I][/CENTER]',
      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
      title: 'Обж. передано ГА',
      content:
        '[CENTER][FONT=times new roman]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT]<br><br>' +
        "[I][FONT=times new roman][SIZE=4]Ваше обжалование переадресовано[/SIZE][/FONT][/I][I][FONT=times new roman][SIZE=4] Главному Администратору[/SIZE][/FONT][/I][I][FONT=times new roman][SIZE=4].[/SIZE][/FONT][/I]<br>" +
        '[FONT=times new roman][SIZE=4][I]Ожидайте ответа в данной теме, копии создавать не нужно.[/I][/SIZE][/FONT][/CENTER]',
      prefix: GA_PREFIX,
      status: true,
    },
    {
title: 'Ответ дан раннее',
      content:
        '[CENTER][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT]<br><br>' +
        "[I][SIZE=4][FONT=times new roman]Вам уже ранее был дан корректный ответ, за создание дубликатов этой темы ваш форумный аккаунт может быть заблокирован.[/FONT][/SIZE][/I]<br><br>" +
        '[FONT=times new roman][SIZE=4][I]Закрыто.[/I][/SIZE][/FONT][/CENTER]',
      prefix: CLOSE_PREFIX,
      status: false,
    
    },
    {
      title: 'Обж. одобрено',
      content:
        '[CENTER][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT]<br><br>' +
        "[I][SIZE=4][FONT=times new roman]Ваше наказание будет снято / снижено в ближайшее время.[/FONT][/SIZE]<br>" +
        "[FONT=times new roman][SIZE=4][I]Пожалуйста, впредь не повторяйте ошибок, которые могут привести к таким последствиям, а также внимательно изучите общие правила серверов - [/I][URL='https://forum.blackrussia.online/index.php?threads/%D0%9E%D0%B1%D1%89%D0%B8%D0%B5-%D0%BF%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%B5%D1%80%D0%B2%D0%B5%D1%80%D0%BE%D0%B2.312571/']*Нажмите сюда*[/URL].[/SIZE][/FONT]<br><br>" +
        "[I][SIZE=4][FONT=times new roman]Обжалование одобрено.[/FONT][/SIZE]<br><br>" +
        '[FONT=times new roman][SIZE=4][I]Закрыто.[/I][/SIZE][/FONT][/I][/CENTER]',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: 'Обж не по форме',
      content:
        '[CENTER][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT]<br><br>' +
        "[I][SIZE=4][FONT=times new roman]Обжалование составлено не по форме.[/FONT][/SIZE]<br>" +
        "[SIZE=4][FONT=times new roman]Внимательно прочитайте правила составления обжалований, которые закреплены в этом разделе.[/FONT][/SIZE]<br><br>" +
        '[FONT=times new roman][SIZE=4][I]Закрыто.[/I][/SIZE][/FONT][/I][/CENTER]',
      prefix: CLOSE_PREFIX,
      status: false,
     },
    {
title: 'в жб Тех. спец.',
      content:
        '[CENTER][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT]<br><br>' +
        "[I][FONT=times new roman][SIZE=4]Обратитесь в раздел жалоб на Технических специалистов - [/SIZE][/FONT][/I][FONT=times new roman][SIZE=4][URL='https://forum.blackrussia.online/index.php?forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D1%82%D0%B5%D1%85%D0%BD%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%B8%D1%85-%D1%81%D0%BF%D0%B5%D1%86%D0%B8%D0%B0%D0%BB%D0%B8%D1%81%D1%82%D0%BE%D0%B2.490/']*Нажмите сюда*[/URL][/SIZE][/FONT]<br><br>" +
        '[FONT=times new roman][SIZE=4][I]Закрыто.[/I][/SIZE][/FONT][/CENTER]',
      prefix: CLOSE_PREFIX,
      status: false,
},
    {
      title: 'Уже обжалован',
      content:
        '[CENTER][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT]<br><br>' +
        "[SIZE=4][I][FONT=times new roman]Ранее вам уже было одобрено обжалование и ваше наказание было снижено - повторного обжалования не будет.[/FONT]<br>" +
        '[I][FONT=times new roman][SIZE=4][I]Закрыто.[/I][/SIZE][/FONT][/I][/CENTER]',
      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
      title: 'ЖБ на адм',
      content:
        '[CENTER][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT]<br><br>' +
        "[I][SIZE=4][FONT=times new roman]Если вы не согласны с решением администратора, обратитесь в раздел жалоб на администрацию.[/FONT][/SIZE]<br><br>" +
        '[FONT=times new roman][SIZE=4][I]Закрыто.[/I][/SIZE][/FONT][/I][/CENTER]',
      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
      title: 'Обж на рассмотрении',
      content:
        '[CENTER][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT]<br><br>' +
        "[I][SIZE=4][FONT=times new roman]Ваше обжалование взято на рассмотрение.[/FONT][/SIZE]<br>" +
        '[SIZE=4][FONT=times new roman]Создавать копии не нужно, ожидайте ответа в данной теме.[/FONT][/SIZE]',
      prefix: PIN_PREFIX,
      status: true,
    },
    {
      title: 'NonRP обман',
      content:
        '[CENTER][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.<br><br>' +
        "Обжалование в вашу пользу должен писать игрок, которого вы обманули.<br>" +
        "В доказательствах должны иметься: окно блокировки вашего аккаунта, переписка с обманутым игроком, где вы решили на какую компенсацию он согласен и ваше сообщение, в котором вы признаете совершенную ошибку и впредь обязуетесь не повторять ее.<br>" +
        "После всего этого главная администрация рассмотрит обжалование, но это не гарантирует того, что вас обжалуют.<br><br>" +
        'Закрыто.[/I][/SIZE][/FONT][/CENTER]',
      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
      title: 'NonRP обман 2',
      content:
      '[CENTER][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT]<br><br>' +
      "[I][FONT=times new roman][SIZE=4]Ваша задача написать мне в личные сообщения ВКонтакте для определения времени, в которое мы сможем провести операцию по возвращению нажитого, нечестным путем, имущества обманутой стороне.[/SIZE][/FONT][/I]<br>" +
      "[FONT=times new roman][SIZE=4][I]Написать должны обе стороны.[/I][/SIZE][/FONT]<br>" +
      "[URL='https://vk.com/synlex_empresso'][SIZE=4][FONT=times new roman]*ВКонтакте*[/FONT][/SIZE][/URL]<br><br>" +
      '[FONT=times new roman][SIZE=4][I]По-прежнему на рассмотрении.[/I][/SIZE][/FONT][/CENTER]',
      prefix: PIN_PREFIX,
      status: true,
    },
    {
      title: 'VK',
      content:
      '[CENTER][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.<br><br>' +
      "[FONT=times new roman][SIZE=4][I]Напишите мне в личные сообщения - [/I][/SIZE][/FONT][URL='https://vk.com/vishnekov_00'][FONT=times new roman][SIZE=4]*ВКонтакте*[/SIZE][/FONT][/URL][FONT=times new roman][SIZE=4][I].<br><br>" +
      'По-прежнему на рассмотрении.[/I][/SIZE][/FONT][/CENTER]',
      prefix: PIN_PREFIX,
      status: true,
    },
    {
      title: 'СПО',
      content:
        '[CENTER][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT]<br><br>' +
        "[I][SIZE=4][FONT=times new roman]Ваш игровой акаунт был заблокирован навсегда за использование стороннего ПО.[/FONT][/SIZE]<br>" +
        "[SIZE=4][FONT=times new roman]В обжаловании отказано.[/FONT][/SIZE][/I]<br><br>" +
        '[FONT=times new roman][SIZE=4][I]Закрыто.[/I][/SIZE]',
      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
      title: 'Окно бана',
      content:
        '[CENTER][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.<br><br>' +
        '[FONT=times new roman][SIZE=4][I]Прикрепите в доказательства скриншот окна блокировки, которое появляется сразу после входа в игру.<br>' +
        '[FONT=times new roman][SIZE=4][I]Закрыто.[/I][/SIZE][/FONT][/CENTER]',
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
        4 < hours && hours <= 12 ?
        'Доброе утро' :
        12 < hours && hours <= 19 ?
        'Добрый день' :
        19 < hours && hours <= 23 ?
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