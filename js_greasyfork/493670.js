// // ==UserScript==
// @name         Скрипт I Rostov Private by Daniel_Park
// @namespace    https://forum.blackrussia.online
// @version      4.6
// @description  Always remember who you are!
// @author       Ilya_Armonuk
// @match        https://forum.blackrussia.online/threads/*
// @include      https://forum.blackrussia.online/threads/
// @grant        none
// @license      MIT
// @collaborator Ilya_Armonuk
// @icon https://forum.blackrussia.online/data/avatars/o/936/936243.jpg?1675602359
// @downloadURL https://update.greasyfork.org/scripts/493670/%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20I%20Rostov%20Private%20by%20Daniel_Park.user.js
// @updateURL https://update.greasyfork.org/scripts/493670/%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20I%20Rostov%20Private%20by%20Daniel_Park.meta.js
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
      title: 'Одобрено,репорт изъят',
      content:
        '[I][B][SIZE=5][FONT=times new roman][COLOR=rgb(15, 253, 118)]Одобрено, баллы изъяты![/COLOR][/FONT][/SIZE][/B][/I]',
    },
    {
      title: 'Одобрено,после рд',
      content:
        '[I][B][SIZE=5][FONT=times new roman][COLOR=rgb(15, 253, 118)]Одобрено, но после рабочего дня![/COLOR][/FONT][/SIZE][/B][/I]',
    },
    {
      title: 'Отказано',
      content:
        '[I][COLOR=rgb(255, 78, 15)][B][FONT=times new roman]Отказано![/FONT][/B][/COLOR][/I]',
    },
    {
      title: '+ баллов',
      content:
        '[I][B][SIZE=5][FONT=times new roman][COLOR=rgb(15, 253, 118)]Одобрено, + n баллов![/COLOR][/FONT][/SIZE][/B][/I]',
    },
     {
title: '_________________________________:Жалобы на администрацию________________________________________',
     },
    {
      title: 'Запрошу док-ва',
      content:
        '[CENTER][FONT=times new roman][SIZE=4][I][COLOR=rgb(255, 0, 0)]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/I][/SIZE][/FONT]<br><br>' +
        "[SIZE=4][I][COLOR=rgb(209, 213, 216)][FONT=times new roman]Запрошу доказательства у администратора. [/FONT][/COLOR][/I]<br>" +
        '[FONT=times new roman][I][COLOR=rgb(209, 213, 216)]Ожидайте, пожалуйста, ответа от администрации и не нужно создавать копии этой темы.[/COLOR][/I][/FONT][/SIZE][/CENTER]',
      prefix: PIN_PREFIX,
      status: true,
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
        "[FONT=times new roman][SIZE=4][COLOR=rgb(209, 213, 216)][I]Доказательства предоставлены, наказание выдано верно.[/I][/COLOR]<br>" +
        "[I][COLOR=rgb(209, 213, 216)]Внимательно прочтите общие правила серверов и впредь, пожалуйста, не нарушайте - [/COLOR][/I][COLOR=rgb(209, 213, 216)][URL='https://forum.blackrussia.online/index.php?threads/%D0%9E%D0%B1%D1%89%D0%B8%D0%B5-%D0%BF%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%B5%D1%80%D0%B2%D0%B5%D1%80%D0%BE%D0%B2.312571/']*Нажмите сюда*[/URL][/COLOR][/SIZE][/FONT]<br><br>" +
        "[SIZE=4][FONT=times new roman][COLOR=rgb(209, 213, 216)][I]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/I][/COLOR][/FONT][/SIZE]<br><br>" +
        '[I][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]Отказано, закрыто.[/SIZE][/FONT][/COLOR][/I][/CENTER]',
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
      title: 'Админ ошибся',
      content:
        '[CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
        "[SIZE=4][FONT=times new roman][I][COLOR=rgb(209, 213, 216)]Администратор допустил ошибку.[/COLOR]<br><br>" +
        "[COLOR=rgb(209, 213, 216)]Приносим свои извинения за доставленные неудобства.[/COLOR]<br>" +
        "[COLOR=rgb(209, 213, 216)]Приятной игры на [/COLOR][/I][COLOR=rgb(209, 213, 216)][I]BLACK RUSSIA ROSTOV.<br>" +
        "Ваше наказание будет снято в течение 6-ти часов.[/I][/COLOR][/FONT][/SIZE]<br><br>" +
        '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]Закрыто.[/I][/SIZE][/FONT][/COLOR][/CENTER]',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: 'Недостаточно док-в',
      content:
        '[CENTER][I][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/FONT][/COLOR][/I]<br><br>' +
        "[COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4][I]Недостаточно доказательств для корректного рассмотрения вашего обращения.[/I][/SIZE][/FONT][/COLOR]<br><br>" +
        '[I][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]Отказано, закрыто.[/SIZE][/FONT][/COLOR][/I][/CENTER]',
      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
      title: 'Нужен фрапс',
      content:
        '[CENTER][I][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/FONT][/COLOR][/I]<br><br>' +
        '[COLOR=rgb(209, 213, 216)][I][FONT=times new roman][SIZE=4]Недостаточно доказательств для корректного рассмотрения жалобы. В данном случае требуются видео - доказательства.[/SIZE][/FONT]<br>' +
        '[FONT=times new roman][SIZE=4]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/SIZE][/FONT][/I][/COLOR]<br><br>' +
        '[FONT=times new roman][SIZE=4][I][COLOR=rgb(255, 0, 0)]Отказано, закрыто.[/COLOR][/I][/SIZE][/FONT][/CENTER]',
      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
      title: 'Док-ва отред.',
      content:
        '[CENTER][I][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/FONT][/COLOR][/I]<br><br>' +
        '[COLOR=rgb(209, 213, 216)][I][FONT=times new roman][SIZE=4]Ваши доказательства были подвергнуты изменениям (редактированию), прикрепите оригинальные файлы.[/SIZE][/FONT]<br>' +
        '[FONT=times new roman][SIZE=4]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/SIZE][/FONT][/I][/COLOR]<br><br>' +
        '[FONT=times new roman][SIZE=4][I][COLOR=rgb(255, 0, 0)]Отказано, закрыто.[/COLOR][/I][/SIZE][/FONT][/CENTER]',
      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
 
      title: 'Отсутст. док-ва',
      content:
        '[CENTER][I][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/FONT][/COLOR][/I]<br><br>' +
        "[COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4][I]Отсутствуют доказательства - следовательно, рассмотрению не подлежит.[/I][/SIZE][/FONT][/COLOR]<br>" +
        "[SIZE=4][COLOR=rgb(209, 213, 216)][FONT=times new roman][I]Загрузите доказательства на фото-видео хостинги YouTube, Imgur, Yapx и так далее.[/I][/FONT][/COLOR][/SIZE]<br><br>" +
        '[I][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]Отказано, закрыто.[/SIZE][/FONT][/COLOR][/I][/CENTER]',
      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
      title: 'Тех. спец.',
      content:
        '[CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
        "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Обратитесь в раздел жалоб на Технических специалистов - [/SIZE][/FONT][/COLOR][/I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4][URL='https://forum.blackrussia.online/index.php?forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D1%82%D0%B5%D1%85%D0%BD%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%B8%D1%85-%D1%81%D0%BF%D0%B5%D1%86%D0%B8%D0%B0%D0%BB%D0%B8%D1%81%D1%82%D0%BE%D0%B2.490/']*Нажмите сюда*[/URL][/SIZE][/FONT][/COLOR]<br><br>" +
        '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]Отказано, закрыто.[/I][/SIZE][/FONT][/COLOR][/CENTER]',
      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
      title: 'Не по теме',
      content:
        '[CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
        "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Ваше сообщение никоим образом не относится к предназначению данного раздела.[/SIZE][/FONT][/COLOR][/I]<br><br>" +
        '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]Отказано, закрыто.[/I][/SIZE][/FONT][/COLOR][/CENTER]',
      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
      title: 'В обжалования',
      content:
        '[CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
        "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Обратитесь в раздел обжалований наказаний.[/SIZE][/FONT][/COLOR][/I]<br><br>" +
        '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]Отказано, закрыто.[/I][/SIZE][/FONT][/COLOR][/CENTER]',
      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
      title: 'Прошло 48 часов',
      content:
        '[CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
        "[COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4][I]Срок написания жалобы - 48 часов с момента выдачи наказания.[/I][/SIZE][/FONT]<br>" +
        "[I][FONT=times new roman][SIZE=4]Внимательно прочитайте правила составления жалоб, которые закреплены в этом разделе.[/SIZE][/FONT][/I][/COLOR]<br><br>" +
        '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]Отказано, закрыто.[/I][/SIZE][/FONT][/COLOR][/CENTER]',
      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
      title: 'Не предоставляет док-ва',
      content:
        '[CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
        "[COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4][I]Администрация не предоставляет доказательства обычным игрокам. В прошлой жалобе вам дали ответ относительно корректности наказания.[/I][/SIZE][/FONT]<br>" +
        "[I][FONT=times new roman][SIZE=4]Если вы не согласны с решением члена руководства, то напишите жалобу на него.[/SIZE][/FONT][/I][/COLOR]<br><br>" +
        '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]Отказано, закрыто.[/I][/SIZE][/FONT][/COLOR][/CENTER]',
      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
      title: 'Ответный ДМ',
      content:
        '[CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
        "[COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4][I]Исходя из доказательств администратора, наказание выдано верно.[/I][/SIZE][/FONT]<br>" +
        "[COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4][I]Если у вас есть видеофиксация того, как вам наносили урон, то предоставьте их в следующей жалобе.[/I][/SIZE][/FONT]<br><br>" +
        '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]Отказано, закрыто.[/I][/SIZE][/FONT][/COLOR][/CENTER]',
      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
      title: 'Не по форме',
      content:
        '[CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
        "[SIZE=4][FONT=times new roman][I][COLOR=rgb(209, 213, 216)]Ваша жалоба составлена не по форме.[/COLOR]<br><br>" +
        "[COLOR=rgb(209, 213, 216)]Внимательно прочитайте правила составления жалоб, которые закреплены в этом разделе.[/COLOR][/I][/FONT][/SIZE]<br><br>" +
        '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]Отказано, закрыто.[/I][/SIZE][/FONT][/COLOR][/CENTER]',
      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
      title: 'Передано СА',
      content:
        '[CENTER][FONT=times new roman][SIZE=4][I][COLOR=rgb(255, 0, 0)]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/I][/SIZE][/FONT]<br><br>' +
        "[COLOR=rgb(209, 213, 216)][I][FONT=times new roman][SIZE=4]Ваша жалоба переадресована [/SIZE][/FONT][/I][/COLOR][COLOR=rgb(255, 0, 0)][I][FONT=times new roman][SIZE=4]Специальному Администратору[/SIZE][/FONT][/I][/COLOR][COLOR=rgb(209, 213, 216)][I][FONT=times new roman][SIZE=4].[/SIZE][/FONT][/I][/COLOR]<br><br>" +
        '[FONT=times new roman][SIZE=4][I][COLOR=rgb(209, 213, 216)]Ожидайте ответа в данной теме, копии создавать не нужно.[/COLOR][/I][/SIZE][/FONT][/CENTER]',
      prefix: SA_PREFIX,
      status: true,
    },
    {
      title: 'Док-ва в соц. сетях',
      content:
        '[CENTER][FONT=times new roman][COLOR=rgb(255, 0, 0)][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/COLOR][/FONT]<br><br>' +
        "[COLOR=rgb(209, 213, 216)][I][SIZE=4][FONT=times new roman]Доказательства в социальных сетях и т.д. не принимаются.[/FONT][/SIZE]<br>" +
        "[SIZE=4][FONT=times new roman]Загрузите доказательства на фото-видео хостинги YouTube, Imgur, Yapx и так далее.[/FONT][/SIZE][/I][/COLOR]<br><br>" +
        '[FONT=times new roman][COLOR=rgb(255, 0, 0)][SIZE=4][I]Отказано, закрыто.[/I][/SIZE][/COLOR][/FONT][/CENTER]',
      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
      title: 'Админ прав',
      content:
        '[CENTER][FONT=times new roman][COLOR=rgb(255, 0, 0)][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/COLOR][/FONT]<br><br>' +
        "[COLOR=rgb(209, 213, 216)][I][SIZE=4][FONT=times new roman]Нарушений со стороны администратора нет.[/FONT][/SIZE]<br><br>" +
        '[FONT=times new roman][COLOR=rgb(255, 0, 0)][SIZE=4][I]Отказано, закрыто.[/I][/SIZE][/COLOR][/FONT][/CENTER]',
      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
      title: 'Выдано верно',
      content:
        '[CENTER][FONT=times new roman][COLOR=rgb(255, 0, 0)][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/COLOR][/FONT]<br><br>' +
        "[COLOR=rgb(209, 213, 216)][I][SIZE=4][FONT=times new roman]Нарушений со стороны администратора нет.[/FONT][/SIZE]<br>" +
        "[SIZE=4][FONT=times new roman]Наказание выдано верно.[/FONT][/SIZE][/I][/COLOR]<br><br>" +
        '[FONT=times new roman][COLOR=rgb(255, 0, 0)][SIZE=4][I]Отказано, закрыто.[/I][/SIZE][/COLOR][/FONT][/CENTER]',
      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
      title: 'Админ не прав',
      content:
        '[CENTER][FONT=times new roman][COLOR=rgb(255, 0, 0)][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/COLOR][/FONT]<br><br>' +
        "[SIZE=4][FONT=times new roman][I][COLOR=rgb(209, 213, 216)]В отношении адмиинистратора будут приняты меры.[/COLOR][/I][/FONT][/SIZE]<br>" +
        "[FONT=times new roman][COLOR=#d1d5d8][SIZE=4][I]Приносим свои извинения за доставленные неудобства.<br>" +
        "Приятной игры на BLACK RUSSIA ROSTOV.[/I][/SIZE][/COLOR][/FONT]<br><br>" +
        '[COLOR=rgb(209, 213, 216)][FONT=times new roman][COLOR=lime][SIZE=4][I]Одобрено, закрыто.[/I][/SIZE][/COLOR][/FONT][/COLOR][/CENTER]',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: 'Админ будет наказн',
      content:
        '[CENTER][FONT=times new roman][COLOR=rgb(255, 0, 0)][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/COLOR][/FONT]<br><br>' +
        "[SIZE=4][FONT=times new roman][I][COLOR=rgb(209, 213, 216)]Администратор будет наказан.[/COLOR][/I][/FONT][/SIZE]<br>" +
        "[FONT=times new roman][COLOR=#d1d5d8][SIZE=4][I]Приносим свои извинения за доставленные неудобства.<br>" +
        "Приятной игры на BLACK RUSSIA ROSTOV.[/I][/SIZE][/COLOR][/FONT]<br><br>" +
        '[COLOR=rgb(209, 213, 216)][FONT=times new roman][COLOR=rgb(255, 0, 0)][SIZE=4][I]Закрыто.[/I][/SIZE][/COLOR][/FONT][/COLOR][/CENTER]',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: 'Дублирование',
      content:
        '[CENTER][FONT=times new roman][COLOR=rgb(255, 0, 0)][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/COLOR][/FONT]<br><br>' +
        "[SIZE=4][FONT=times new roman][I][COLOR=rgb(209, 213, 216)]Ответ был дан вам ранее.[/COLOR][/I][/FONT][/SIZE]<br>" +
        "[FONT=times new roman][COLOR=#d1d5d8][SIZE=4][I]Прекратите дублировать темы, в ином случае вам будет выдана блокировка.<br>" +
        "Приятной игры на BLACK RUSSIA ROSTOV.[/I][/SIZE][/COLOR][/FONT]<br><br>" +
        '[COLOR=rgb(209, 213, 216)][FONT=times new roman][COLOR=rgb(255, 0, 0)][SIZE=4][I]Отказано, закрыто.[/I][/SIZE][/COLOR][/FONT][/COLOR][/CENTER]',
      prefix: CLOSE_PREFIX,
      status: false,
    },
 
    {
      title: 'VK',
      content:
      '[CENTER][FONT=times new roman][SIZE=4][I][COLOR=rgb(255, 0, 0)]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR]<br><br>' +
      "[COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4][I]Напишите мне в личные сообщения - [/I][/SIZE][/FONT][URL='https://vk.com/iarmonik'][FONT=times new roman][SIZE=4]*ВКонтакте*[/SIZE][/FONT][/URL][FONT=times new roman][SIZE=4][I].<br><br>" +
      'По-прежнему на рассмотрении.[/I][/SIZE][/FONT][/COLOR][/CENTER]',
      prefix: PIN_PREFIX,
      status: true,
    },
    {
      title: 'Окно бана',
      content:
        '[CENTER][FONT=times new roman][SIZE=4][I][COLOR=rgb(255, 0, 0)]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR]<br><br>' +
        '[COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4][I]Прикрепите в доказательства скриншот окна блокировки, которое появляется сразу после входа в игру.<br>' +
        'Приятной игры на BLACK RUSSIA на сервере ROSTOV.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
        '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]Отказано, закрыто.[/I][/SIZE][/FONT][/COLOR][/CENTER]',
      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
      title: 'ТАЙМ',
      content:
        '[CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
        "[SIZE=4][FONT=times new roman][I][COLOR=rgb(209, 213, 216)]Ваша жалоба составлена не по форме.[/COLOR]<br><br>" +
        "[COLOR=rgb(209, 213, 216)]В предоставленных доказательств отсутствует время (/time), не подлежит рассмотрению. Внимательно прочитайте правила составления жалоб, которые закреплены в этом разделе.[/COLOR][/I][/FONT][/SIZE]<br><br>" +
        '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]Отказано, закрыто.[/I][/SIZE][/FONT][/COLOR][/CENTER]',
      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
            title: '_________________________________:Жалобы на игроков________________________________________',
     },
    {
      title: 'Нужен фрапс',
      content:
        '[CENTER][I][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/FONT][/COLOR][/I]<br><br>' +
        '[COLOR=rgb(209, 213, 216)][I][FONT=times new roman][SIZE=4]Недостаточно доказательств для корректного рассмотрения жалобы. В данном случае требуются видео - доказательства.[/SIZE][/FONT]<br>' +
        '[FONT=times new roman][SIZE=4]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/SIZE][/FONT][/I][/COLOR]<br><br>' +
        '[FONT=times new roman][SIZE=4][I][COLOR=rgb(255, 0, 0)]Отказано, закрыто.[/COLOR][/I][/SIZE][/FONT][/CENTER]',
      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
      title: 'Игрок будет наказан',
      content:
        '[CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
        "[SIZE=4][FONT=times new roman][I][COLOR=rgb(209, 213, 216)]Игрок получит соответствующее наказание.[/COLOR]<br>" +
        "[COLOR=rgb(209, 213, 216)]Приятной игры на [/COLOR][/I][COLOR=rgb(209, 213, 216)][I]BLACK RUSSIA ROSTOV.<br>" +
        '[COLOR=lime][FONT=times new roman][SIZE=4][I]Одобрено.[/I][/SIZE][/FONT][/COLOR][/CENTER]',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
        {
      title: 'Игрок был наказан',
      content:
        '[CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
        "[SIZE=4][FONT=times new roman][I][COLOR=rgb(209, 213, 216)]Игрок был ранее наказан.[/COLOR]<br>" +
        "[COLOR=rgb(209, 213, 216)]Приятной игры на [/COLOR][/I][COLOR=rgb(209, 213, 216)][I]BLACK RUSSIA ROSTOV.<br>" +
        '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]Закрыто.[/I][/SIZE][/FONT][/COLOR][/CENTER]',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
        {
      title: 'Коды',
      content:
        '[CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
        "[SIZE=4][FONT=times new roman][I][COLOR=rgb(209, 213, 216)]Если видео длится более 3 минут, то неоходимо предоставить таймкоды ключевых моментов фрапса.[/COLOR]<br>" +
        "[COLOR=rgb(209, 213, 216)]Например:0:30 - условия сделки, 1:00 - обман. При этом не нужно создавать лишних таймкодов. Например: 0:45 - чихнул.[/COLOR]<br>" +
        "[COLOR=rgb(209, 213, 216)]Приятной игры на [/COLOR][/I][COLOR=rgb(209, 213, 216)][I]BLACK RUSSIA ROSTOV.<br>" +
        '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]Отказано, закрыто.[/I][/SIZE][/FONT][/COLOR][/CENTER]',
      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
      title: 'единый фрапс',
      content:
        '[CENTER][FONT=times new roman][COLOR=rgb(255, 0, 0)][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/COLOR][/FONT]<br><br>' +
        "[COLOR=rgb(209, 213, 216)][I][SIZE=4][FONT=times new roman]Ваши доказательства состоят из нескольких частей.[/FONT][/SIZE]<br>" +
        "[SIZE=4][FONT=times new roman]Загрузите доказательства на фото-видео хостинги в первоизданном виде.[/FONT][/SIZE][/I][/COLOR]<br><br>" +
        '[FONT=times new roman][COLOR=rgb(255, 0, 0)][SIZE=4][I]Закрыто.[/I][/SIZE][/COLOR][/FONT][/CENTER]',
      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
      title: 'Заколовок по форме',
      content:
        '[CENTER][I][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/FONT][/COLOR][/I]<br><br>' +
        '[COLOR=rgb(209, 213, 216)][I][FONT=times new roman][SIZE=4]Составьте заголовок темы по форме, указанной в этой разделе - https://forum.blackrussia.online/index.php?threads/Правила-подачи-жалоб-на-игроков.3429394/ .[/SIZE][/FONT]<br>' +
        '[FONT=times new roman][SIZE=4]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/SIZE][/FONT][/I][/COLOR]<br><br>' +
        '[FONT=times new roman][SIZE=4][I][COLOR=rgb(255, 0, 0)]Закрыто.[/COLOR][/I][/SIZE][/FONT][/CENTER]',
      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
      title: 'Нарушений нету',
      content:
        '[CENTER][I][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/FONT][/COLOR][/I]<br><br>' +
        '[COLOR=rgb(209, 213, 216)][I][FONT=times new roman][SIZE=4]Со стороны игрока нарушений нет.[/SIZE][/FONT]<br>' +
        '[FONT=times new roman][SIZE=4]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/SIZE][/FONT][/I][/COLOR]<br><br>' +
        '[FONT=times new roman][SIZE=4][I][COLOR=rgb(255, 0, 0)]Отказано, закрыто.[/COLOR][/I][/SIZE][/FONT][/CENTER]',
      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
      title: 'Обрывается фрапс',
      content:
        '[CENTER][I][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/FONT][/COLOR][/I]<br><br>' +
        '[COLOR=rgb(209, 213, 216)][I][FONT=times new roman][SIZE=4]Пересоздайте жалобу с полным фрапсом(нынешний фрапс обрывается).[/SIZE][/FONT]<br>' +
        '[FONT=times new roman][SIZE=4]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/SIZE][/FONT][/I][/COLOR]<br><br>' +
        '[FONT=times new roman][SIZE=4][I][COLOR=rgb(255, 0, 0)]Отказано, закрыто.[/COLOR][/I][/SIZE][/FONT][/CENTER]',
      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
      title: 'Недостаточно док-в',
      content:
        '[CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
        "[SIZE=4][FONT=times new roman][I][COLOR=rgb(209, 213, 216)]Ваших доказательств недостаточно для рассмотрения жалобы на игрока.[/COLOR]<br><br>" +
        '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]Закрыто.[/I][/SIZE][/FONT][/COLOR][/CENTER]',
      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
      title: 'Не по форме',
      content:
        '[CENTER][I][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/FONT][/COLOR][/I]<br><br>' +
        '[COLOR=rgb(209, 213, 216)][I][FONT=times new roman][SIZE=4]Составьте жалобу по форме, указанной в этой разделе - https://forum.blackrussia.online/index.php?threads/Правила-подачи-жалоб-на-игроков.3429394/ .[/SIZE][/FONT]<br>' +
        '[FONT=times new roman][SIZE=4]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/SIZE][/FONT][/I][/COLOR]<br><br>' +
        '[FONT=times new roman][SIZE=4][I][COLOR=rgb(255, 0, 0)]Закрыто.[/COLOR][/I][/SIZE][/FONT][/CENTER]',
      prefix: CLOSE_PREFIX,
      status: false,
    },
     {
      title: 'Хелперы',
      content:
        '[CENTER][I][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/FONT][/COLOR][/I]<br><br>' +
        '[COLOR=rgb(209, 213, 216)][I][FONT=times new roman][SIZE=4]Обратитесь в раздел жалоб на хелперов.[/SIZE][/FONT]<br>' +
        '[FONT=times new roman][SIZE=4]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/SIZE][/FONT][/I][/COLOR]<br><br>' +
        '[FONT=times new roman][SIZE=4][I][COLOR=rgb(255, 0, 0)]Закрыто.[/COLOR][/I][/SIZE][/FONT][/CENTER]',
      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
      title: 'сотрудник',
      content:
        '[CENTER][I][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/FONT][/COLOR][/I]<br><br>' +
        '[COLOR=rgb(209, 213, 216)][I][FONT=times new roman][SIZE=4]Обратитесь в раздел жалоб на сотрудников фракции.[/SIZE][/FONT]<br>' +
        '[FONT=times new roman][SIZE=4]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/SIZE][/FONT][/I][/COLOR]<br><br>' +
        '[FONT=times new roman][SIZE=4][I][COLOR=rgb(255, 0, 0)]Закрыто.[/COLOR][/I][/SIZE][/FONT][/CENTER]',
      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
    title: 'Теху',
      content:
        '[CENTER][I][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/FONT][/COLOR][/I]<br><br>' +
        '[COLOR=rgb(209, 213, 216)][I][FONT=times new roman][SIZE=4]Ваша жалоба передана техническому специалисту.[/SIZE][/FONT]<br>' +
        '[FONT=times new roman][SIZE=4]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/SIZE][/FONT][/I][/COLOR]<br><br>' +
        '[FONT=times new roman][SIZE=4][I][COLOR=rgb(255, 0, 0)]Закрыто.[/COLOR][/I][/SIZE][/FONT][/CENTER]',
      prefix: PIN_PREFIX,
      status: false,
    },
    {
    title: 'Ник',
      content:
        '[CENTER][I][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/FONT][/COLOR][/I]<br><br>' +
        '[COLOR=rgb(209, 213, 216)][I][FONT=times new roman][SIZE=4]Вы не указали Nick_Name нарушителя.[/SIZE][/FONT]<br>' +
        '[FONT=times new roman][SIZE=4]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/SIZE][/FONT][/I][/COLOR]<br><br>' +
        '[FONT=times new roman][SIZE=4][I][COLOR=rgb(255, 0, 0)]Закрыто.[/COLOR][/I][/SIZE][/FONT][/CENTER]',
      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
    title: 'Долг',
      content:
        '[CENTER][I][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/FONT][/COLOR][/I]<br><br>' +
        '[COLOR=rgb(209, 213, 216)][I][FONT=times new roman][SIZE=4]Срок займа ещё не подошёл к концу.[/SIZE][/FONT]<br>' +
        '[FONT=times new roman][SIZE=4]Ознакомьтесь с пунктом 2.57 правил серверов[link=https://forum.blackrussia.online/index.php?threads/Общие-правила-серверов.312571/][/link].[/SIZE][/FONT][/I][/COLOR]<br><br>' +
        '[FONT=times new roman][SIZE=4][I][COLOR=rgb(255, 0, 0)]Закрыто.[/COLOR][/I][/SIZE][/FONT][/CENTER]',
      prefix: CLOSE_PREFIX,
      status: false,
    },
{
    title: 'Могли ознакомиться',
      content:
        '[CENTER][I][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/FONT][/COLOR][/I]<br><br>' +
        '[COLOR=rgb(209, 213, 216)][I][FONT=times new roman][SIZE=4]Вы могли ознакомиться с условиями сделки в контекстном меню.[/SIZE][/FONT]<br>' +
        '[FONT=times new roman][SIZE=4][I][COLOR=rgb(255, 0, 0)]Закрыто.[/COLOR][/I][/SIZE][/FONT][/CENTER]',
      prefix: CLOSE_PREFIX,
      status: false,
    },
        {
    title: 'Отдельно',
      content:
        '[CENTER][I][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/FONT][/COLOR][/I]<br><br>' +
        '[COLOR=rgb(209, 213, 216)][I][FONT=times new roman][SIZE=4]Напишите жалобу на каждого игрока по отдельности.[/SIZE][/FONT]<br>' +
        '[FONT=times new roman][SIZE=4]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/SIZE][/FONT][/I][/COLOR]<br><br>' +
        '[FONT=times new roman][SIZE=4][I][COLOR=rgb(255, 0, 0)]Закрыто.[/COLOR][/I][/SIZE][/FONT][/CENTER]',
      prefix: CLOSE_PREFIX,
      status: false,
    },
     {
      title: 'DeathMatch',
      content:
        '[CENTER][I][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/FONT][/COLOR][/I]<br><br>' +
        '[COLOR=rgb(209, 213, 216)][I][FONT=times new roman][SIZE=4]Игрок будет наказан по следующиму пункту правил [SPOILER=Пункт][COLOR=red]2.19[/COLOR]. Запрещен DM (DeathMatch) — убийство или нанесение урона без веской IC причины | [COLOR=red]Jail 60 минут[/COLOR][/SPOILER][/SIZE][/FONT]<br>' +
        '[FONT=times new roman][SIZE=4]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/SIZE][/FONT][/I][/COLOR]<br><br>' +
        '[FONT=times new roman][SIZE=4][I][COLOR=rgb(255, 0, 0)]Отказано, закрыто.[/COLOR][/I][/SIZE][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
            title: '_________________________________:Обжалования________________________________________',
     },
        {
      title: 'Не по форме',
      content:
        '[CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
        "[SIZE=4][FONT=times new roman][I][COLOR=rgb(209, 213, 216)]Ваше обжалование составлено не по форме.[/COLOR]<br><br>" +
        "[COLOR=rgb(209, 213, 216)]Внимательно прочитайте правила составления жалоб, которые закреплены в этом разделе.[/COLOR][/I][/FONT][/SIZE]<br><br>" +
        '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]Закрыто.[/I][/SIZE][/FONT][/COLOR][/CENTER]',
      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
      title: '3е лицо',
      content:
        '[CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
        "[SIZE=4][FONT=times new roman][I][COLOR=rgb(209, 213, 216)]Ваше обращение составлено от третьего лица и рассмотрению не подлежит.[/COLOR]<br><br>" +
        "[COLOR=rgb(209, 213, 216)]Внимательно прочитайте правила составления жалоб, которые закреплены в этом разделе.[/COLOR][/I][/FONT][/SIZE]<br><br>" +
        '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]Закрыто.[/I][/SIZE][/FONT][/COLOR][/CENTER]',
      prefix: CLOSE_PREFIX,
      status: false,
    },
      {
    title: 'Не подлежит',
      content:
        '[CENTER][I][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/FONT][/COLOR][/I]<br><br>' +
        '[COLOR=rgb(209, 213, 216)][I][FONT=times new roman][SIZE=4]Данное наказание не подлежит обжалованию.[/SIZE][/FONT]<br>' +
        '[FONT=times new roman][SIZE=4][I][COLOR=rgb(255, 0, 0)]Закрыто.[/COLOR][/I][/SIZE][/FONT][/CENTER]',
      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
    title: 'Отказано',
      content:
        '[CENTER][I][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/FONT][/COLOR][/I]<br><br>' +
        '[COLOR=rgb(209, 213, 216)][I][FONT=times new roman][SIZE=4]В обжаловании отказано.[/SIZE][/FONT]<br>' +
        '[FONT=times new roman][SIZE=4][I][COLOR=rgb(255, 0, 0)]Закрыто.[/COLOR][/I][/SIZE][/FONT][/CENTER]',
      prefix: CLOSE_PREFIX,
      status: false,
    },
    {    title: 'На рассмотрении',
      content:
        '[CENTER][I][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/FONT][/COLOR][/I]<br><br>' +
        '[FONT=times new roman][SIZE=4][I][COLOR=rgb(255, 0, 0)]На рассмотрении...[/COLOR][/I][/SIZE][/FONT][/CENTER]',
      prefix: PIN_PREFIX,
      status: false,
    },
    {
      title: 'В жб на адм',
      content:
        '[CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
        "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Обратитесь в раздел жалоб на администрацию сервера.[/SIZE][/FONT][/COLOR][/I]<br><br>" +
        '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]Закрыто.[/I][/SIZE][/FONT][/COLOR][/CENTER]',
      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
      title: 'Возврат долга',
      content:
        '[CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
        "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Здравствуйте, у вас есть 24 часа на выполнение требований, форумный аккаунт обманутой стороны - [COLOR=rgb(184, 178, 206)]кликабельно[/COLOR],<br>" +
        "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]свяжитесь с ним через сообщения на стене профиля и договоритесь о возврате имущества, когда вы и обманутая сторона будут согласны на обмен, то вы должны отписать сообщением ниже.[/SIZE][/FONT][/COLOR][/I]<br>" +
        '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]Закрыто.[/I][/SIZE][/FONT][/COLOR][/CENTER]',
      prefix: PIN_PREFIX,
      status: false,
    },
];
 
 
$(document).ready(() => {
    // Загрузка скрипта для обработки шаблонов
    $('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');
 
 
    // Добавление кнопок при загрузке страницы
    addButton('Закрыто', 'close');
    addButton('На рассмотрение', 'pin');
    addButton('Одобрено', 'important');
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
            if(id > 3) {
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
      ? 'Доброго времени суток'
      : 18 < hours && hours <= 21
      ? 'Доброго времени суток'
      : 21 < hours && hours <= 4
      ? 'Доброго времени суток'
      : 'Доброго времени суток',
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
 