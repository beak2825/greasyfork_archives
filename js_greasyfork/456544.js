// // ==UserScript==
// @name         Скрипт для  Алексея Кравцова | CRIMSON
// @namespace    https://forum.blackrussia.online
// @version      2.5
// @description  Скрипт для ЗГА
// @author       Jesus White
// @match        https://forum.blackrussia.online/index.php?threads/*
// @include      https://forum.blackrussia.online/index.php?threads/
// @grant        none
// @license      MIT
// @icon         https://klike.net/uploads/posts/2021-12/1638345168_12.jpg
// @downloadURL https://update.greasyfork.org/scripts/456544/%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%20%D0%90%D0%BB%D0%B5%D0%BA%D1%81%D0%B5%D1%8F%20%D0%9A%D1%80%D0%B0%D0%B2%D1%86%D0%BE%D0%B2%D0%B0%20%7C%20CRIMSON.user.js
// @updateURL https://update.greasyfork.org/scripts/456544/%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%20%D0%90%D0%BB%D0%B5%D0%BA%D1%81%D0%B5%D1%8F%20%D0%9A%D1%80%D0%B0%D0%B2%D1%86%D0%BE%D0%B2%D0%B0%20%7C%20CRIMSON.meta.js
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
      title: 'Приветствие',
      content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]https://i.postimg.cc/ZRCBYwFP/JVROV-1.png[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
        '[SIZE=4][COLOR=rgb(0, 255, 255)][I][FONT=times new roman]{{ greeting }}, уважаемый {{ user.mention }}.[/FONT][/I][/COLOR][/SIZE]',
    },
    {
             title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴Жалоба на рассмотрении ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
      title: 'Запрошу док-ва',
      content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]https://i.postimg.cc/ZRCBYwFP/JVROV-1.png[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
        		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +

        '[CENTER][FONT=times new roman][SIZE=4][I][COLOR=rgb(255, 0, 0)]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/I][/SIZE][/FONT]<br><br>' +
        "[SIZE=4][I][COLOR=rgb(209, 213, 216)][FONT=times new roman]Запрошу доказательства у администратора. [/FONT][/COLOR][/I]<br>" +
        "[FONT=times new roman][I][COLOR=rgb(209, 213, 216)]Ожидайте, пожалуйста, ответа от администрации и не нужно создавать копии этой темы С уважение заместитель главного администратора Mitsuhiro_Miyake[/COLOR][/I][/FONT][/SIZE][/CENTER]<br>" +
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zByWk0xc/giphy-3.gif[/img][/url][/CENTER]',
        prefix: PIN_PREFIX,
      status: true,
    },
    {
      title: 'На рассмотрении',
      content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]https://i.postimg.cc/ZRCBYwFP/JVROV-1.png[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
        		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +

        '[CENTER][SIZE=4][FONT=times new roman][I][COLOR=rgb(255, 0, 0)]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/I][/FONT][/SIZE]<br><br>' +
        "[I][SIZE=4][COLOR=rgb(209, 213, 216)][FONT=times new roman]Ваша жалоба взята на рассмотрение.[/FONT][/COLOR][/SIZE][/I]<br>" +
        "[SIZE=4][FONT=times new roman][I][COLOR=rgb(209, 213, 216)]Не нужно создавать копии этой жалобы, ожидайте ответа в этой теме.[/COLOR][/I][/FONT][/SIZE][/CENTER]<br>" +
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zByWk0xc/giphy-3.gif[/img][/url][/CENTER]',
        prefix: PIN_PREFIX,
      status: true,
    },
    {
             title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴Жалоба одобрена ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
      title: 'Док-ва предоставлены',
      content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]https://i.postimg.cc/ZRCBYwFP/JVROV-1.png[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
        		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +

        '[CENTER][I][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/FONT][/COLOR][/I]<br><br>' +
        "[FONT=times new roman][SIZE=4][COLOR=rgb(209, 213, 216)][I]Доказательства предоставлены, наказание выдано верно.[/I][/COLOR]<br>" +
        "[I][COLOR=rgb(209, 213, 216)]Внимательно прочтите общие правила серверов и впредь, пожалуйста, не нарушайте - [/COLOR][/I][COLOR=rgb(209, 213, 216)][URL='https://forum.blackrussia.online/index.php?threads/%D0%9E%D0%B1%D1%89%D0%B8%D0%B5-%D0%BF%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%B5%D1%80%D0%B2%D0%B5%D1%80%D0%BE%D0%B2.312571/']*Нажмите сюда*[/URL][/COLOR][/SIZE][/FONT]<br><br>" +
        "[SIZE=4][FONT=times new roman][COLOR=rgb(209, 213, 216)][I]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован С уважение заместитель главного администратора Mitsuhiro_Miyake[/I][/COLOR][/FONT][/SIZE]<br><br>" +
        '[I][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]Закрыто.[/SIZE][/FONT][/COLOR][/I][/CENTER]]<br>' +
                        "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=CRIMSON]CRIMSON[/COLOR].<br><br>"+

        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/XJ5Yp4yv/giphy.gif[/img][/url][/CENTER]',
      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
      title: 'Админ ошибся',
      content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]https://i.postimg.cc/ZRCBYwFP/JVROV-1.png[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
        		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +

        '[CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
        "[SIZE=4][FONT=times new roman][I][COLOR=rgb(209, 213, 216)]Администратор допустил ошибку.[/COLOR]<br><br>" +
        "[COLOR=rgb(209, 213, 216)]Приносим свои извинения за доставленные неудобства.[/COLOR]<br>" +
        "[COLOR=rgb(209, 213, 216)]Приятной игры на [/COLOR][/I][COLOR=rgb(209, 213, 216)][I]BLACK RUSSIA .<br>" +
        "Ваше наказание будет снято в течение 6-ти часов. С уважение заместитель главного администратора Mitsuhiro_Miyake.[/I][/COLOR][/FONT][/SIZE]<br><br>" +
        '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]Закрыто.[/I][/SIZE][/FONT][/COLOR][/CENTER]<br>' +
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/XJ5Yp4yv/giphy.gif[/img][/url][/CENTER]',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
              title: 'Админ не прав',
      content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]https://i.postimg.cc/ZRCBYwFP/JVROV-1.png[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
        		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +

        '[CENTER][FONT=times new roman][COLOR=rgb(255, 0, 0)][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/COLOR][/FONT]<br><br>' +
        "[SIZE=4][FONT=times new roman][I][COLOR=rgb(209, 213, 216)]С администратором будет проведена беседа.[/COLOR][/I][/FONT][/SIZE]<br>" +
        "[FONT=times new roman][COLOR=#d1d5d8][SIZE=4][I]Приносим свои извинения за доставленные неудобства.С уважение заместитель главного администратора Mitsuhiro_Miyake.<br>" +
        "Приятной игры на BLACK RUSSIA.[/I][/SIZE][/COLOR][/FONT]<br><br>" +
        '[COLOR=rgb(209, 213, 216)][FONT=times new roman][COLOR=rgb(255, 0, 0)][SIZE=4][I]Закрыто.[/I][/SIZE][/COLOR][/FONT][/COLOR][/CENTER]<br>' +
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/XJ5Yp4yv/giphy.gif[/img][/url][/CENTER]',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
             title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴Передача жалобы ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
              title: 'Передано ГА',
      content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]https://i.postimg.cc/ZRCBYwFP/JVROV-1.png[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
        		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +

        '[CENTER][FONT=times new roman][SIZE=4][I][COLOR=rgb(255, 0, 0)]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/I][/SIZE][/FONT]<br><br>' +
        "[COLOR=rgb(209, 213, 216)][I][FONT=times new roman][SIZE=4]Ваша жалоба переадресована [/SIZE][/FONT][/I][/COLOR][COLOR=rgb(255, 0, 0)][I][FONT=times new roman][SIZE=4]Главному Администратору[/SIZE][/FONT][/I][/COLOR][COLOR=rgb(209, 213, 216)][I][FONT=times new roman][SIZE=4].[/SIZE][/FONT][/I][/COLOR]<br>" +
        "[FONT=times new roman][SIZE=4][I][COLOR=rgb(209, 213, 216)]Ожидайте ответа в данной теме, копии создавать не нужно.[/COLOR][/I][/SIZE][/FONT][/CENTER]<br>" +
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/WzS9J9zf/giphy-2.gif[/img][/url][/CENTER]',
      prefix: GA_PREFIX,
      status: true,
    },
    {
              title: 'Передано СА',
      content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]https://i.postimg.cc/ZRCBYwFP/JVROV-1.png[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
        		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +

        '[CENTER][FONT=times new roman][SIZE=4][I][COLOR=rgb(255, 0, 0)]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/I][/SIZE][/FONT]<br><br>' +
        "[COLOR=rgb(209, 213, 216)][I][FONT=times new roman][SIZE=4]Ваша жалоба переадресована [/SIZE][/FONT][/I][/COLOR][COLOR=rgb(255, 0, 0)][I][FONT=times new roman][SIZE=4]Специальному Администратору[/SIZE][/FONT][/I][/COLOR][COLOR=rgb(209, 213, 216)][I][FONT=times new roman][SIZE=4].[/SIZE][/FONT][/I][/COLOR]<br><br>" +
        "[FONT=times new roman][SIZE=4][I][COLOR=rgb(209, 213, 216)]Ожидайте ответа в данной теме, копии создавать не нужно.[/COLOR][/I][/SIZE][/FONT][/CENTER]<br>" +
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/WzS9J9zf/giphy-2.gif[/img][/url][/CENTER]',
      prefix: SA_PREFIX,
      status: true,
    },
    {
                      title: 'Передано КП',
      content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]https://i.postimg.cc/ZRCBYwFP/JVROV-1.png[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
        		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +

        '[CENTER][FONT=times new roman][SIZE=4][I][COLOR=rgb(255, 0, 0)]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/I][/SIZE][/FONT]<br><br>' +
        "[COLOR=rgb(209, 213, 216)][I][FONT=times new roman][SIZE=4]Ваша жалоба переадресована [/SIZE][/FONT][/I][/COLOR][COLOR=rgb(255, 0, 0)][I][FONT=times new roman][SIZE=4]Команде Проекта[/SIZE][/FONT][/I][/COLOR][COLOR=rgb(209, 213, 216)][I][FONT=times new roman][SIZE=4].[/SIZE][/FONT][/I][/COLOR]<br><br>" +
        "[FONT=times new roman][SIZE=4][I][COLOR=rgb(209, 213, 216)]Ожидайте ответа в данной теме, копии создавать не нужно.[/COLOR][/I][/SIZE][/FONT][/CENTER]<br>" +
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/WzS9J9zf/giphy-2.gif[/img][/url][/CENTER]',
      prefix: SA_PREFIX,
      status: true,
    },
    {
             title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴Отказ жалобы ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
      title: 'Не по теме',
      content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]https://i.postimg.cc/ZRCBYwFP/JVROV-1.png[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
        		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +

        '[CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
        "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Ваше сообщение никоим образом не относится к предназначению данного раздела.С уважение заместитель главного администратора Mitsuhiro_Miyake.[/SIZE][/FONT][/COLOR][/I]<br><br>" +
         ',[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]Закрыто.[/I][/SIZE][/FONT][/COLOR][/CENTER]<br>' +
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/LXK0dYGv/giphy-1.gif[/img][/url][/CENTER]',
      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
              title: 'Ответ дан раннее',
      content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]https://i.postimg.cc/ZRCBYwFP/JVROV-1.png[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
        		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +

        '[CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
        "[I][SIZE=4][FONT=times new roman][COLOR=rgb(209, 213, 216)]Вам уже ранее был дан корректный ответ, за создание дубликатов этой темы ваш форумный аккаунт может быть заблокирован.С уважение заместитель главного администратора Mitsuhiro_Miyake.[/COLOR][/FONT][/SIZE][/I]<br><br>" +
        '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]Закрыто.[/I][/SIZE][/FONT][/COLOR][/CENTER]<br>' +
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/LXK0dYGv/giphy-1.gif[/img][/url][/CENTER]',
      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
              title: 'Жалобу на Теха',
      content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]https://i.postimg.cc/ZRCBYwFP/JVROV-1.png[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
        '[CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
        "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Обратитесь в раздел жалоб на Технических специалистов - [/SIZE][/FONT][/COLOR][/I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4][URL='https://forum.blackrussia.online/index.php?forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D1%82%D0%B5%D1%85%D0%BD%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%B8%D1%85-%D1%81%D0%BF%D0%B5%D1%86%D0%B8%D0%B0%D0%BB%D0%B8%D1%81%D1%82%D0%BE%D0%B2.490/']*Нажмите сюда*[/URL][/SIZE][/FONT][/COLOR]<br><br>" +
        '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]Закрыто.[/I][/SIZE][/FONT][/COLOR][/CENTER]<br>' +
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/LXK0dYGv/giphy-1.gif[/img][/url][/CENTER]',
      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
      title: 'Недостаточно док-ев',
      content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]https://i.postimg.cc/ZRCBYwFP/JVROV-1.png[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
        		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +

        '[CENTER][I][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/FONT][/COLOR][/I]<br><br>' +
        "[COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4][I]Недостаточно доказательств для корректного рассмотрения вашего обращения.[/I][/SIZE][/FONT][/COLOR]<br><br>" +
        '[I][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]Закрыто.[/SIZE][/FONT][/COLOR][/I][/CENTER]<br>' +
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/LXK0dYGv/giphy-1.gif[/img][/url][/CENTER]',
      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
      title: 'Нужен фрапс',
      content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]https://i.postimg.cc/ZRCBYwFP/JVROV-1.png[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
        		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +

        '[CENTER][I][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/FONT][/COLOR][/I]<br><br>' +
        '[COLOR=rgb(209, 213, 216)][I][FONT=times new roman][SIZE=4]Недостаточно доказательств для корректного рассмотрения жалобы. В данном случае требуются видео - доказательства.[/SIZE][/FONT]<br>' +
        '[FONT=times new roman][SIZE=4]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.С уважение заместитель главного администратора Mitsuhiro_Miyake.[/SIZE][/FONT][/I][/COLOR]<br><br>' +
        '[FONT=times new roman][SIZE=4][I][COLOR=rgb(255, 0, 0)]Закрыто.[/COLOR][/I][/SIZE][/FONT][/CENTER]<br>' +
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/LXK0dYGv/giphy-1.gif[/img][/url][/CENTER]',
      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
      title: 'Док-ва отред.',
      content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]https://i.postimg.cc/ZRCBYwFP/JVROV-1.png[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
        '[CENTER][I][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/FONT][/COLOR][/I]<br><br>' +
        '[COLOR=rgb(209, 213, 216)][I][FONT=times new roman][SIZE=4]Ваши доказательства были подвергнуты изменениям (редактированию), прикрепите оригинальные файлы.[/SIZE][/FONT]<br>' +
        '[FONT=times new roman][SIZE=4]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.С уважение заместитель главного администратора Mitsuhiro_Miyake.[/SIZE][/FONT][/I][/COLOR]<br><br>' +
        '[FONT=times new roman][SIZE=4][I][COLOR=rgb(255, 0, 0)]Закрыто.[/COLOR][/I][/SIZE][/FONT][/CENTER]<br>' +
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/LXK0dYGv/giphy-1.gif[/img][/url][/CENTER]',
      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
      title: 'Отсутствуют док-ва',
      content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]https://i.postimg.cc/ZRCBYwFP/JVROV-1.png[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
        		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +

        '[CENTER][I][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/FONT][/COLOR][/I]<br><br>' +
        "[COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4][I]Отсутствуют доказательства - следовательно, рассмотрению не подлежит.[/I][/SIZE][/FONT][/COLOR]<br>" +
        "[SIZE=4][COLOR=rgb(209, 213, 216)][FONT=times new roman][I]Загрузите доказательства на фото-видео хостинги YouTube, Imgur, Yapx и так далее.С уважение заместитель главного администратора Mitsuhiro_Miyake[/I][/FONT][/COLOR][/SIZE]<br><br>" +
        '[I][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]Закрыто.[/SIZE][/FONT][/COLOR][/I][/CENTER]<br>' +
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/LXK0dYGv/giphy-1.gif[/img][/url][/CENTER]',
      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
      title: 'В обжалования',
      content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]https://i.postimg.cc/ZRCBYwFP/JVROV-1.png[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
        		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +

        '[CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
        "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Обратитесь в раздел обжалований наказаний. С уважение заместитель главного администратора Mitsuhiro_Miyake.[/SIZE][/FONT][/COLOR][/I]<br><br>" +
        '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]Закрыто.[/I][/SIZE][/FONT][/COLOR][/CENTER]<br>' +
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/LXK0dYGv/giphy-1.gif[/img][/url][/CENTER]',
      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
      title: 'Прошло 24 часа',
      content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]https://i.postimg.cc/ZRCBYwFP/JVROV-1.png[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
        		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +

        '[CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
        "[COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4][I]Срок написания жалобы - 24 часа с момента выдачи наказания.[/I][/SIZE][/FONT]<br>" +
        "[I][FONT=times new roman][SIZE=4]Внимательно прочитайте правила составления жалоб, которые закреплены в этом разделе. С уважение заместитель главного администратора Mitsuhiro_Miyake.[/SIZE][/FONT][/I][/COLOR]<br><br>" +
        '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]Закрыто.[/I][/SIZE][/FONT][/COLOR][/CENTER]<br>' +
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/LXK0dYGv/giphy-1.gif[/img][/url][/CENTER]',
      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
      title: 'Не по форме',
      content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]https://i.postimg.cc/ZRCBYwFP/JVROV-1.png[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
        		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +

        '[CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
        "[SIZE=4][FONT=times new roman][I][COLOR=rgb(209, 213, 216)]Ваша жалоба составлена не по форме.[/COLOR]<br><br>" +
        "[COLOR=rgb(209, 213, 216)]Внимательно прочитайте правила составления жалоб, которые закреплены в этом разделе.С уважение заместитель главного администратора Mitsuhiro_Miyake.[/COLOR][/I][/FONT][/SIZE]<br><br>" +
        '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]Закрыто.[/I][/SIZE][/FONT][/COLOR][/CENTER]<br>' +
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/LXK0dYGv/giphy-1.gif[/img][/url][/CENTER]',
      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
      title: 'Док-ва в соц. сетях',
      content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]https://i.postimg.cc/ZRCBYwFP/JVROV-1.png[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
        '[CENTER][FONT=times new roman][COLOR=rgb(255, 0, 0)][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/COLOR][/FONT]<br><br>' +
        "[COLOR=rgb(209, 213, 216)][I][SIZE=4][FONT=times new roman]Доказательства в социальных сетях и т.д. не принимаются.[/FONT][/SIZE]<br>" +
        "[SIZE=4][FONT=times new roman]Загрузите доказательства на фото-видео хостинги YouTube, Imgur, Yapx и так далее.С уважение заместитель главного администратора Mitsuhiro_Miyake.[/FONT][/SIZE][/I][/COLOR]<br><br>" +
        '[FONT=times new roman][COLOR=rgb(255, 0, 0)][SIZE=4][I]Закрыто.[/I][/SIZE][/COLOR][/FONT][/CENTER]<br>' +
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/LXK0dYGv/giphy-1.gif[/img][/url][/CENTER]',
      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
      title: 'Админ прав',
      content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]https://i.postimg.cc/ZRCBYwFP/JVROV-1.png[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
        		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +

        '[CENTER][FONT=times new roman][COLOR=rgb(255, 0, 0)][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/COLOR][/FONT]<br><br>' +
        "[COLOR=rgb(209, 213, 216)][I][SIZE=4][FONT=times new roman]Нарушений со стороны администратора нет.С уважение заместитель главного администратора Mitsuhiro_Miyake.[/FONT][/SIZE]<br><br>" +
        '[FONT=times new roman][COLOR=rgb(255, 0, 0)][SIZE=4][I]Закрыто.[/I][/SIZE][/COLOR][/FONT][/CENTER]<br>' +
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/LXK0dYGv/giphy-1.gif[/img][/url][/CENTER]',
      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
      title: 'Выдано верно',
      content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]https://i.postimg.cc/ZRCBYwFP/JVROV-1.png[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
        '[CENTER][FONT=times new roman][COLOR=rgb(255, 0, 0)][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/COLOR][/FONT]<br><br>' +
        "[COLOR=rgb(209, 213, 216)][I][SIZE=4][FONT=times new roman]Нарушений со стороны администратора нет.[/FONT][/SIZE]<br>" +
        "[SIZE=4][FONT=times new roman]Наказание выдано верно.[/FONT][/SIZE][/I][/COLOR]<br><br>" +
        '[FONT=times new roman][COLOR=rgb(255, 0, 0)][SIZE=4][I]Закрыто.[/I][/SIZE][/COLOR][/FONT][/CENTER]<br>' +
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/LXK0dYGv/giphy-1.gif[/img][/url][/CENTER]',
      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
             title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴Обжалования ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
      title: 'Обжалование отказано',
      content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]https://i.postimg.cc/ZRCBYwFP/JVROV-1.png[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
        '[CENTER][FONT=times new roman][COLOR=rgb(255, 0, 0)][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/COLOR][/FONT]<br><br>' +
        "[COLOR=rgb(209, 213, 216)][I][SIZE=4][FONT=times new roman]Администрация не готова сократить или снять вам наказание.[/FONT][/SIZE]<br>" +
        "[SIZE=4][FONT=times new roman]В обжаловании отказано.[/FONT][/SIZE][/I][/COLOR]<br><br>" +
        "[FONT=times new roman][COLOR=#d1d5d8][SIZE=4][I]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.С уважение заместитель главного администратора Mitsuhiro_Miyake.[/I][/SIZE][/COLOR][/FONT]<br><br>" +
        '[FONT=times new roman][COLOR=rgb(255, 0, 0)][SIZE=4][I]Закрыто.[/I][/SIZE][/COLOR]<br>' +
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/LXK0dYGv/giphy-1.gif[/img][/url][/CENTER]',
      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
      title: 'Обжалование не подлежит',
      content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]https://i.postimg.cc/ZRCBYwFP/JVROV-1.png[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
        '[CENTER][FONT=times new roman][COLOR=rgb(255, 0, 0)][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/COLOR][/FONT]<br><br>' +
        "[COLOR=#ff0000][SIZE=4][I][FONT=times new roman][COLOR=rgb(209, 213, 216)]Данное нарушение обжалованию не подлежит.[/COLOR][/FONT][/I][/SIZE][/COLOR]<br>" +
        "[FONT=times new roman][COLOR=#d1d5d8][SIZE=4][I]Внимательно прочитайте правила подачи обжалования, закреплённые в данном разделе.<br>" +
        "В обжаловании отказано.<br><br>" +
        "Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/I][/SIZE][/COLOR][/FONT]<br><br>" +
        '[COLOR=rgb(255, 0, 0)][SIZE=4][I][FONT=times new roman]Закрыто.[/FONT][/I][/SIZE][/COLOR][/CENTER]<br>' +
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/LXK0dYGv/giphy-1.gif[/img][/url][/CENTER]',
      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
      title: 'Обжалование не по форме',
      content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]https://i.postimg.cc/ZRCBYwFP/JVROV-1.png[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
        '[CENTER][FONT=times new roman][COLOR=rgb(255, 0, 0)][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/COLOR][/FONT]<br><br>' +
        "[COLOR=rgb(209, 213, 216)][I][SIZE=4][FONT=times new roman]Обжалование составлено не по форме.[/FONT][/SIZE]<br>" +
        "[SIZE=4][FONT=times new roman]Внимательно прочитайте правила составления обжалований - [/FONT][/SIZE][/I][/COLOR][SIZE=4][FONT=times new roman][URL='https://forum.blackrussia.online/index.php?threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BF%D0%BE%D0%B4%D0%B0%D1%87%D0%B8-%D0%B7%D0%B0%D1%8F%D0%B2%D0%BA%D0%B8-%D0%BD%D0%B0-%D0%BE%D0%B1%D0%B6%D0%B0%D0%BB%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D0%B5-%D0%BD%D0%B0%D0%BA%D0%B0%D0%B7%D0%B0%D0%BD%D0%B8%D1%8F.1158794/']*Нажмите сюда*[/URL].[/FONT][/SIZE]<br><br>" +
        '[COLOR=rgb(209, 213, 216)][I][FONT=times new roman][COLOR=rgb(255, 0, 0)][SIZE=4][I]Закрыто.[/I][/SIZE][/COLOR][/FONT][/I][/COLOR][/CENTER]<br>' +
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/LXK0dYGv/giphy-1.gif[/img][/url][/CENTER]',
      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
      title: 'Обжалование передано ГА',
      content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]https://i.postimg.cc/ZRCBYwFP/JVROV-1.png[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
        '[CENTER][FONT=times new roman][SIZE=4][I][COLOR=rgb(255, 0, 0)]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/I][/SIZE][/FONT]<br><br>' +
        "[COLOR=rgb(209, 213, 216)][I][FONT=times new roman][SIZE=4]Ваше обжалование переадресовано[/SIZE][/FONT][/I][/COLOR][COLOR=rgb(255, 0, 0)][I][FONT=times new roman][SIZE=4] Главному Администратору[/SIZE][/FONT][/I][/COLOR][COLOR=rgb(209, 213, 216)][I][FONT=times new roman][SIZE=4].[/SIZE][/FONT][/I][/COLOR]<br>" +
        '[FONT=times new roman][SIZE=4][I][COLOR=rgb(209, 213, 216)]Ожидайте ответа в данной теме, копии создавать не нужно.С уважение заместитель главного администратора Mitsuhiro_Miyake.[/COLOR][/I][/SIZE][/FONT][/CENTER]<br>' +
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/WzS9J9zf/giphy-2.gif[/img][/url][/CENTER]',
      prefix: GA_PREFIX,
      status: true,
    },
    {
      title: 'Обжалование одобрено',
      content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]https://i.postimg.cc/ZRCBYwFP/JVROV-1.png[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
        '[CENTER][FONT=times new roman][COLOR=rgb(255, 0, 0)][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/COLOR][/FONT]<br><br>' +
        "[COLOR=rgb(209, 213, 216)][I][SIZE=4][FONT=times new roman]Ваше наказание будет снято / снижено в ближайшее время.[/FONT][/SIZE]<br>" +
        "[FONT=times new roman][COLOR=#d1d5d8][SIZE=4][I]Пожалуйста, впредь не повторяйте ошибок, которые могут привести к таким последствиям, а также внимательно изучите общие правила серверов - [/I][URL='https://forum.blackrussia.online/index.php?threads/%D0%9E%D0%B1%D1%89%D0%B8%D0%B5-%D0%BF%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%B5%D1%80%D0%B2%D0%B5%D1%80%D0%BE%D0%B2.312571/']*Нажмите сюда*[/URL].[/SIZE][/COLOR][/FONT]<br><br>" +
        "[COLOR=rgb(209, 213, 216)][I][SIZE=4][FONT=times new roman]Обжалование одобрено.С уважение заместитель главного администратора Mitsuhiro_Miyake.[/FONT][/SIZE]<br><br>" +
        '[FONT=times new roman][COLOR=rgb(255, 0, 0)][SIZE=4][I]Закрыто.[/I][/SIZE][/COLOR][/FONT][/I][/COLOR][/CENTER]<br>' +
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/XJ5Yp4yv/giphy.gif[/img][/url][/CENTER]',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: 'Снижено до 30 дней',
      content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]https://i.postimg.cc/ZRCBYwFP/JVROV-1.png[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
        '[CENTER][FONT=times new roman][COLOR=rgb(255, 0, 0)][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/COLOR][/FONT]<br><br>' +
        "[COLOR=rgb(209, 213, 216)][I][SIZE=4][FONT=times new roman]Ваше наказание будет снижено до бана на 30 дней в ближайшее время.[/FONT][/SIZE]<br>" +
        "[FONT=times new roman][COLOR=#d1d5d8][SIZE=4][I]Пожалуйста, впредь не повторяйте ошибок, которые могут привести к таким последствиям, а также внимательно изучите общие правила серверов - [/I][URL='https://forum.blackrussia.online/index.php?threads/%D0%9E%D0%B1%D1%89%D0%B8%D0%B5-%D0%BF%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%B5%D1%80%D0%B2%D0%B5%D1%80%D0%BE%D0%B2.312571/']*Нажмите сюда*[/URL].[/SIZE][/COLOR][/FONT]<br><br>" +
        "[COLOR=rgb(209, 213, 216)][I][SIZE=4][FONT=times new roman]Обжалование одобрено.[/FONT][/SIZE]<br><br>" +
        '[FONT=times new roman][COLOR=rgb(255, 0, 0)][SIZE=4][I]Закрыто.[/I][/SIZE][/COLOR][/FONT][/I][/COLOR][/CENTER]<br>' +
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/XJ5Yp4yv/giphy.gif[/img][/url][/CENTER]',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: 'Снижено до 15 дней',
      content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]https://i.postimg.cc/ZRCBYwFP/JVROV-1.png[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
        '[CENTER][FONT=times new roman][COLOR=rgb(255, 0, 0)][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/COLOR][/FONT]<br><br>' +
        "[COLOR=rgb(209, 213, 216)][I][SIZE=4][FONT=times new roman]Ваше наказание будет снижено до бана на 15 дней в ближайшее время.[/FONT][/SIZE]<br>" +
        "[FONT=times new roman][COLOR=#d1d5d8][SIZE=4][I]Пожалуйста, впредь не повторяйте ошибок, которые могут привести к таким последствиям, а также внимательно изучите общие правила серверов - [/I][URL='https://forum.blackrussia.online/index.php?threads/%D0%9E%D0%B1%D1%89%D0%B8%D0%B5-%D0%BF%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%B5%D1%80%D0%B2%D0%B5%D1%80%D0%BE%D0%B2.312571/']*Нажмите сюда*[/URL].[/SIZE][/COLOR][/FONT]<br><br>" +
        "[COLOR=rgb(209, 213, 216)][I][SIZE=4][FONT=times new roman]Обжалование одобрено.[/FONT][/SIZE]<br><br>" +
        '[FONT=times new roman][COLOR=rgb(255, 0, 0)][SIZE=4][I]Закрыто.[/I][/SIZE][/COLOR][/FONT][/I][/COLOR][/CENTER]<br>' +
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/XJ5Yp4yv/giphy.gif[/img][/url][/CENTER]',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: 'Снижено до 7 дней',
      content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]https://i.postimg.cc/ZRCBYwFP/JVROV-1.png[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
        '[CENTER][FONT=times new roman][COLOR=rgb(255, 0, 0)][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/COLOR][/FONT]<br><br>' +
        "[COLOR=rgb(209, 213, 216)][I][SIZE=4][FONT=times new roman]Ваше наказание будет снижено до бана на 7 дней в ближайшее время.[/FONT][/SIZE]<br>" +
        "[FONT=times new roman][COLOR=#d1d5d8][SIZE=4][I]Пожалуйста, впредь не повторяйте ошибок, которые могут привести к таким последствиям, а также внимательно изучите общие правила серверов - [/I][URL='https://forum.blackrussia.online/index.php?threads/%D0%9E%D0%B1%D1%89%D0%B8%D0%B5-%D0%BF%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%B5%D1%80%D0%B2%D0%B5%D1%80%D0%BE%D0%B2.312571/']*Нажмите сюда*[/URL].[/SIZE][/COLOR][/FONT]<br><br>" +
        "[COLOR=rgb(209, 213, 216)][I][SIZE=4][FONT=times new roman]Обжалование одобрено.[/FONT][/SIZE]<br><br>" +
        '[FONT=times new roman][COLOR=rgb(255, 0, 0)][SIZE=4][I]Закрыто.[/I][/SIZE][/COLOR][/FONT][/I][/COLOR][/CENTER]<br>' +
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/XJ5Yp4yv/giphy.gif[/img][/url][/CENTER]',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: 'Снижено до 120 мута',
      content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]https://i.postimg.cc/ZRCBYwFP/JVROV-1.png[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
        '[CENTER][FONT=times new roman][COLOR=rgb(255, 0, 0)][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/COLOR][/FONT]<br><br>' +
        "[COLOR=rgb(209, 213, 216)][I][SIZE=4][FONT=times new roman]Ваше наказание будет снижено до мута в 120 минут в ближайшее время.[/FONT][/SIZE]<br>" +
        "[FONT=times new roman][COLOR=#d1d5d8][SIZE=4][I]Пожалуйста, впредь не повторяйте ошибок, которые могут привести к таким последствиям, а также внимательно изучите общие правила серверов - [/I][URL='https://forum.blackrussia.online/index.php?threads/%D0%9E%D0%B1%D1%89%D0%B8%D0%B5-%D0%BF%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%B5%D1%80%D0%B2%D0%B5%D1%80%D0%BE%D0%B2.312571/']*Нажмите сюда*[/URL].[/SIZE][/COLOR][/FONT]<br><br>" +
        "[COLOR=rgb(209, 213, 216)][I][SIZE=4][FONT=times new roman]Обжалование одобрено.[/FONT][/SIZE]<br><br>" +
        '[FONT=times new roman][COLOR=rgb(255, 0, 0)][SIZE=4][I]Закрыто.[/I][/SIZE][/COLOR][/FONT][/I][/COLOR][/CENTER]<br>' +
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/XJ5Yp4yv/giphy.gif[/img][/url][/CENTER]',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
	  title: ' Уже есть мин. наказания ',
	  content:
                '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]https://i.postimg.cc/ZRCBYwFP/JVROV-1.png[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
		"[B][CENTER][COLOR=#EE82EE][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Вам было выдано минимальное наказание, обжалованию не подлежит.<br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG]<br>"+
		'[B][CENTER][COLOR=RED][ICODE]Отказано[/ICODE][/COLOR][/CENTER][/B]<br>' +
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/LXK0dYGv/giphy-1.gif[/img][/url][/CENTER]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
	{
      title: 'Обжалование не по форме',
      content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]https://i.postimg.cc/ZRCBYwFP/JVROV-1.png[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
        '[CENTER][FONT=times new roman][COLOR=rgb(255, 0, 0)][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/COLOR][/FONT]<br><br>' +
        "[COLOR=rgb(209, 213, 216)][I][SIZE=4][FONT=times new roman]Обжалование составлено не по форме.[/FONT][/SIZE]<br>" +
        "[SIZE=4][FONT=times new roman]Внимательно прочитайте правила составления обжалований, которые закреплены в этом разделе.[/FONT][/SIZE]<br><br>" +
        '[FONT=times new roman][COLOR=rgb(255, 0, 0)][SIZE=4][I]Закрыто.[/I][/SIZE][/COLOR][/FONT][/I][/COLOR][/CENTER]<br>' +
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/LXK0dYGv/giphy-1.gif[/img][/url][/CENTER]',
      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
      title: 'Уже обжалован',
      content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]https://i.postimg.cc/ZRCBYwFP/JVROV-1.png[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
        '[CENTER][FONT=times new roman][COLOR=rgb(255, 0, 0)][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/COLOR][/FONT]<br><br>' +
        "[COLOR=#d1d5d8][SIZE=4][I][FONT=times new roman]Ранее вам уже было одобрено обжалование и ваше наказание было снижено - повторного обжалования не будет.[/FONT]<br>" +
        "[FONT=times new roman]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/FONT][/I][/SIZE][/COLOR]<br><br>" +
        '[COLOR=rgb(209, 213, 216)][I][FONT=times new roman][COLOR=rgb(255, 0, 0)][SIZE=4][I]Закрыто.[/I][/SIZE][/COLOR][/FONT][/I][/COLOR][/CENTER]<br>' +
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/LXK0dYGv/giphy-1.gif[/img][/url][/CENTER]',
      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
      title: 'В жалобы на администратора',
      content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]https://i.postimg.cc/ZRCBYwFP/JVROV-1.png[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
        '[CENTER][FONT=times new roman][COLOR=rgb(255, 0, 0)][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/COLOR][/FONT]<br><br>' +
        "[COLOR=rgb(209, 213, 216)][I][SIZE=4][FONT=times new roman]Если вы не согласны с решением администратора, обратитесь в раздел жалоб на администрацию.[/FONT][/SIZE]<br><br>" +
        '[FONT=times new roman][COLOR=rgb(255, 0, 0)][SIZE=4][I]Закрыто.[/I][/SIZE][/COLOR][/FONT][/I][/COLOR][/CENTER]<br>' +
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/LXK0dYGv/giphy-1.gif[/img][/url][/CENTER]',
      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
      title: 'Обжалование на рассмотрении',
      content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]https://i.postimg.cc/ZRCBYwFP/JVROV-1.png[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
        '[CENTER][FONT=times new roman][COLOR=rgb(255, 0, 0)][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/COLOR][/FONT]<br><br>' +
        "[COLOR=rgb(209, 213, 216)][I][SIZE=4][FONT=times new roman]Ваше обжалование взято на рассмотрение.[/FONT][/SIZE]<br>" +
        '[SIZE=4][FONT=times new roman]Создавать копии не нужно, ожидайте ответа в данной теме.[/FONT][/SIZE]<br>' +
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zByWk0xc/giphy-3.gif[/img][/url][/CENTER]',
      prefix: PIN_PREFIX,
      status: true,
    },
    {
      title: 'Просрочка ЖБ',
      content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]https://i.postimg.cc/ZRCBYwFP/JVROV-1.png[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
        '[CENTER][FONT=times new roman][COLOR=rgb(255, 0, 0)][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/COLOR]<br><br>' +
        "[COLOR=#d1d5d8][SIZE=4][I]В вашем случае нужно было сразу реагировать на выданное наказание и обращаться в раздел жалоб на администрацию, в настоящий момент срок написания жалобы прошел.[/I][/SIZE][/COLOR]<br>" +
        "[SIZE=4][COLOR=#d1d5d8][I]Если вы все же согласны с решением администратора - составьте новую тему, предварительно прочитав правила подачи обжалований, закреплённые в данном разделе.[/I][/COLOR][/SIZE]<br>" +
        "[COLOR=#d1d5d8][SIZE=4][I]Просьба не создавать копии данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/I][/SIZE][/COLOR][/FONT]<br><br>" +
        '[COLOR=rgb(255, 0, 0)][SIZE=4][I][FONT=times new roman]Закрыто.[/FONT][/I][/SIZE][/COLOR][/CENTER]<br>' +
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/LXK0dYGv/giphy-1.gif[/img][/url][/CENTER]',
      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
      title: 'NonRP обман',
      content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]https://i.postimg.cc/ZRCBYwFP/JVROV-1.png[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
        '[CENTER][FONT=times new roman][SIZE=4][I][COLOR=rgb(255, 0, 0)]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR]<br><br>' +
        "[COLOR=rgb(209, 213, 216)]Обжалование в вашу пользу должен писать игрок, которого вы обманули.[/COLOR]<br>" +
        "[COLOR=rgb(209, 213, 216)]В доказательствах должны иметься: окно блокировки вашего аккаунта, переписка с обманутым игроком, где вы решили на какую компенсацию он согласен и ваше сообщение, в котором вы признаете совершенную ошибку и впредь обязуетесь не повторять ее.[/COLOR]<br>" +
        "[COLOR=rgb(209, 213, 216)]После всего этого главная администрация рассмотрит обжалование, но это не гарантирует того, что вас обжалуют.[/COLOR]<br><br>" +
        '[COLOR=rgb(255, 0, 0)]Закрыто.[/COLOR][/I][/SIZE][/FONT][/CENTER]',
      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
      title: 'NonRP обман 2',
      content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]https://i.postimg.cc/ZRCBYwFP/JVROV-1.png[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
       'https://i.yapx.cc/QqZnC.jpg' +
      '[CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
      "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Ваша задача написать мне в личные сообщения ВКонтакте для определения времени, в которое мы сможем провести операцию по возвращению нажитого, нечестным путем, имущества обманутой стороне.[/SIZE][/FONT][/COLOR][/I]<br>" +
      "[FONT=times new roman][COLOR=#d1d5d8][SIZE=4][I]Написать должны обе стороны.[/I][/SIZE][/COLOR][/FONT]<br>" +
      "[COLOR=rgb(0, 255, 255)][URL='https://vk.com/synlex_empresso'][SIZE=4][FONT=times new roman]*ВКонтакте*[/FONT][/SIZE][/URL][/COLOR]<br><br>" +
      '[COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4][I]По-прежнему на рассмотрении.[/I][/SIZE][/FONT][/COLOR][/CENTER]',
      prefix: PIN_PREFIX,
      status: true,
    },
    {
      title: 'VK',
      content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]https://i.postimg.cc/ZRCBYwFP/JVROV-1.png[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
      '[CENTER][FONT=times new roman][SIZE=4][I][COLOR=rgb(255, 0, 0)]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR]<br><br>' +
      "[COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4][I]Напишите мне в личные сообщения - [/I][/SIZE][/FONT][URL='https://vk.com/synlex_empresso'][FONT=times new roman][SIZE=4]*ВКонтакте*[/SIZE][/FONT][/URL][FONT=times new roman][SIZE=4][I].<br><br>" +
      'По-прежнему на рассмотрении.[/I][/SIZE][/FONT][/COLOR][/CENTER]',
      prefix: PIN_PREFIX,
      status: true,
    },
    {
      title: 'Использование ПО',
      content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]https://i.postimg.cc/ZRCBYwFP/JVROV-1.png[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
        '[CENTER][FONT=times new roman][COLOR=rgb(255, 0, 0)][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/COLOR][/FONT]<br><br>' +
        "[COLOR=rgb(209, 213, 216)][I][SIZE=4][FONT=times new roman]Ваш игровой акаунт был заблокирован навсегда за использование стороннего ПО.[/FONT][/SIZE]<br>" +
        "[SIZE=4][FONT=times new roman]В обжаловании отказано.[/FONT][/SIZE][/I][/COLOR]<br><br>" +
        "[FONT=times new roman][COLOR=#d1d5d8][SIZE=4][I]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/I][/SIZE][/COLOR][/FONT]<br><br>" +
        '[FONT=times new roman][COLOR=rgb(255, 0, 0)][SIZE=4][I]Закрыто.[/I][/SIZE][/COLOR]<br>' +
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/LXK0dYGv/giphy-1.gif[/img][/url][/CENTER]',
      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
      title: 'Окно бана',
      content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]https://i.postimg.cc/ZRCBYwFP/JVROV-1.png[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
        		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +

        '[CENTER][FONT=times new roman][SIZE=4][I][COLOR=rgb(255, 0, 0)]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR]<br><br>' +
        '[COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4][I]Прикрепите в доказательства скриншот окна блокировки, которое появляется сразу после входа в игру.<br>' +
        'Приятной игры на BLACK RUSSIA на сервере Gray.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
        '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]Закрыто.[/I][/SIZE][/FONT][/COLOR][/CENTER]<br>' +
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/LXK0dYGv/giphy-1.gif[/img][/url][/CENTER]',
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
    addButton('Спецу', 'Spec');
    addButton('КП', 'teamProject');
    addButton('Решено', 'Resheno');
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