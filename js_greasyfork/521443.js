// ==UserScript==
// @name         script for me curator
// @namespace    https://forum.blackrussia.online
// @version      1.5
// @description  script for kуратор
// @author       Давид
// @match        https://forum.blackrussia.online/threads/*
// @include      https://forum.blackrussia.online/threads/
// @grant        none
// @license      MIT
// @collaborator
// @icon https://cdn.icon-icons.com/icons2/4155/PNG/512/adobe_after_effects_icon_261536.png
// @downloadURL https://update.greasyfork.org/scripts/521443/script%20for%20me%20curator.user.js
// @updateURL https://update.greasyfork.org/scripts/521443/script%20for%20me%20curator.meta.js
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
  const VAJNO_PREFIX = 1;
  const buttons = [
      {
        title: 'Свой ответ',
        content:
         '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/4NpY3Zyz/VID-20241110-141209-038.gif[/img][/url]<br>' +
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/t4QnvVgf/49224-CE2-6-B89-42-F1-8-B9-D-248-F3970945-F.gif[/img][/url][/CENTER]<br>' +
         '[CENTER][COLOR=#9365B8]{{ greeting }}, уважаемый {{ user.name }} <br><br>' +
         '[CENTER][COLOR=LightGray] Напиши <br><br>' +
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/t4QnvVgf/49224-CE2-6-B89-42-F1-8-B9-D-248-F3970945-F.gif[/img][/url][/CENTER]<br>'
        },
        {
          title: '_________________________________Жалобы на администрацию________________________________________',
        },
        {
          title: 'На рассмотрении',
          content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/4NpY3Zyz/VID-20241110-141209-038.gif[/img][/url]<br>' +
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/t4QnvVgf/49224-CE2-6-B89-42-F1-8-B9-D-248-F3970945-F.gif[/img][/url][/CENTER]<br>' +
         '[CENTER][COLOR=#9365B8]{{ greeting }}, уважаемый {{ user.name }} <br><br>' +
          "[CENTER][COLOR=rgb(230, 230, 250)][B][FONT=trebuchet ms]Жалоба взята [COLOR=ORANGE]на рассмотрение[COLOR=rgb(230, 230, 250)], ожидайте вердикта в данной теме.[/FONT][/COLOR][/CENTER]<br><br>" +
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/t4QnvVgf/49224-CE2-6-B89-42-F1-8-B9-D-248-F3970945-F.gif[/img][/url][/CENTER]<br>',
          prefix: PIN_PREFIX,
          status: true,
        },
        {
          title : 'Наказание по ошибке',
          content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/4NpY3Zyz/VID-20241110-141209-038.gif[/img][/url]<br>' +
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/t4QnvVgf/49224-CE2-6-B89-42-F1-8-B9-D-248-F3970945-F.gif[/img][/url][/CENTER]<br>' +
          '[CENTER][COLOR=#9365B8]{{ greeting }}, уважаемый {{ user.name }} <br><br>' +
          "[CENTER][COLOR=rgb(230, 230, 250)][B][FONT=trebuchet ms]Вследствие беседы с администратором было выяснено, что наказание было выдано по ошибке,наказание будет снято в ближайшее время.[/FONT][/COLOR][/CENTER]<br><br>" +
           "[CENTER][COLOR=rgb(230, 230, 250)][B][FONT=trebuchet ms]С администратором будет проведена необходимая работа.[/FONT][/COLOR][/CENTER]<br><br>" +
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/t4QnvVgf/49224-CE2-6-B89-42-F1-8-B9-D-248-F3970945-F.gif[/img][/url][/CENTER]<br>'+
           '[CENTER][url=https://postimages.org/][img]http://x-lines.ru/icp/bcW08/38B63C/1/30/Rodobreno.png[/img][/url][/CENTER]<br>',
          prefix: ACCEPT_PREFIX,
          status: false,
         },
         {
             title : 'Не верное наказание',
          content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/4NpY3Zyz/VID-20241110-141209-038.gif[/img][/url]<br>' +
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/t4QnvVgf/49224-CE2-6-B89-42-F1-8-B9-D-248-F3970945-F.gif[/img][/url][/CENTER]<br>' +
          '[CENTER][COLOR=#9365B8]{{ greeting }}, уважаемый {{ user.name }} <br><br>' +
          "[CENTER][COLOR=rgb(230, 230, 250)][B][FONT=trebuchet ms] После беседы с администратором было принято решение что наказание выдано не верно.[/FONT][/COLOR][/CENTER]<br><br>" +
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/t4QnvVgf/49224-CE2-6-B89-42-F1-8-B9-D-248-F3970945-F.gif[/img][/url][/CENTER]<br>'+
           '[CENTER][url=https://postimages.org/][img]http://x-lines.ru/icp/bcW08/38B63C/1/30/Rodobreno.png[/img][/url][/CENTER]<br>',
          prefix: ACCEPT_PREFIX,
          status: false,
        },
        {
          title : 'Меры в сторону адм',
          content:
             '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/4NpY3Zyz/VID-20241110-141209-038.gif[/img][/url]<br>' +
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/t4QnvVgf/49224-CE2-6-B89-42-F1-8-B9-D-248-F3970945-F.gif[/img][/url][/CENTER]<br>' +
          '[CENTER][COLOR=#9365B8]{{ greeting }}, уважаемый {{ user.name }} <br><br>' +
          "[CENTER][COLOR=rgb(230, 230, 250)][B][FONT=trebuchet ms]В сторону администратора будут приняты необходимые меры.[/FONT][/COLOR][/CENTER]<br><br>" +
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/t4QnvVgf/49224-CE2-6-B89-42-F1-8-B9-D-248-F3970945-F.gif[/img][/url][/CENTER]<br>'+
           '[CENTER][url=https://postimages.org/][img]http://x-lines.ru/icp/bcW08/38B63C/1/30/Rodobreno.png[/img][/url][/CENTER]<br>',
          prefix: ACCEPT_PREFIX,
          status: false,
         },
         {
          title : 'Нет нарушений',
          content:
             '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/4NpY3Zyz/VID-20241110-141209-038.gif[/img][/url]<br>' +
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/t4QnvVgf/49224-CE2-6-B89-42-F1-8-B9-D-248-F3970945-F.gif[/img][/url][/CENTER]<br>' +
          '[CENTER][COLOR=#9365B8]{{ greeting }}, уважаемый {{ user.name }} <br><br>' +
          "[CENTER][COLOR=rgb(230, 230, 250)][B][FONT=trebuchet ms]Исходя из выше приложенных доказательств, нарушения со стороны администратора - не имеется.[/FONT][/COLOR][/CENTER]<br><br>"+
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/t4QnvVgf/49224-CE2-6-B89-42-F1-8-B9-D-248-F3970945-F.gif[/img][/url][/CENTER]<br>'+
          '[CENTER][url=https://postimages.org/][img]http://x-lines.ru/icp/bcW08/CC0000/1/30/Rotkazano.png[/img][/url][/CENTER]<br>' ,
          prefix: UNACCEPT_PREFIX,
          status: false,
        },
        {
          title : 'ЖБ не по форме',
          content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/4NpY3Zyz/VID-20241110-141209-038.gif[/img][/url]<br>' +
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/t4QnvVgf/49224-CE2-6-B89-42-F1-8-B9-D-248-F3970945-F.gif[/img][/url][/CENTER]<br>' +
          '[CENTER][COLOR=#9365B8]{{ greeting }}, уважаемый {{ user.name }} <br><br>' +
          "[CENTER][COLOR=rgb(230, 230, 250)][B][FONT=trebuchet ms]Ваша жалоба составлена не по форме. Ознакомьтесь с правилами подачи жалобы - [URL='https://forum.blackrussia.online/threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BF%D0%BE%D0%B4%D0%B0%D1%87%D0%B8-%D0%B6%D0%B0%D0%BB%D0%BE%D0%B1-%D0%BD%D0%B0-%D0%B0%D0%B4%D0%BC%D0%B8%D0%BD%D0%B8%D1%81%D1%82%D1%80%D0%B0%D1%86%D0%B8%D1%8E.3429349/']*Нажмите сюда*[/URL][/FONT][/COLOR][/CENTER]<br><br>" +
         '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/t4QnvVgf/49224-CE2-6-B89-42-F1-8-B9-D-248-F3970945-F.gif[/img][/url][/CENTER]<br>'+
          '[CENTER][url=https://postimages.org/][img]http://x-lines.ru/icp/bcW08/CC0000/1/30/Rotkazano.png[/img][/url][/CENTER]<br>' ,
          prefix: UNACCEPT_PREFIX,
          status: false,
         },
         {
             title : 'Прошло 48 часов',
          content:
             '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/4NpY3Zyz/VID-20241110-141209-038.gif[/img][/url]<br>' +
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/t4QnvVgf/49224-CE2-6-B89-42-F1-8-B9-D-248-F3970945-F.gif[/img][/url][/CENTER]<br>' +
          '[CENTER][COLOR=#9365B8]{{ greeting }}, уважаемый {{ user.name }} <br><br>' +
          "[CENTER][COLOR=rgb(230, 230, 250)][B][FONT=trebuchet ms]С момента выдачи наказания прошло более 48-и часов.[/FONT][/COLOR][/CENTER]<br><br>" +
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/t4QnvVgf/49224-CE2-6-B89-42-F1-8-B9-D-248-F3970945-F.gif[/img][/url][/CENTER]<br>'+
          '[CENTER][url=https://postimages.org/][img]http://x-lines.ru/icp/bcW08/CC0000/1/30/Rotkazano.png[/img][/url][/CENTER]<br>' ,
          prefix: UNACCEPT_PREFIX,
          status: false,
        },
        {
            title : 'Доки не рабочие',
          content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/4NpY3Zyz/VID-20241110-141209-038.gif[/img][/url]<br>' +
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/t4QnvVgf/49224-CE2-6-B89-42-F1-8-B9-D-248-F3970945-F.gif[/img][/url][/CENTER]<br>' +
          '[CENTER][COLOR=#9365B8]{{ greeting }}, уважаемый {{ user.name }} <br><br>' +
          "[CENTER][COLOR=rgb(230, 230, 250)][B][FONT=trebuchet ms]Ваши доказательства не рабочие или же битая ссылка.[/FONT][/COLOR][/CENTER]<br><br>" +
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/t4QnvVgf/49224-CE2-6-B89-42-F1-8-B9-D-248-F3970945-F.gif[/img][/url][/CENTER]<br>'+
          '[CENTER][url=https://postimages.org/][img]http://x-lines.ru/icp/bcW08/CC0000/1/30/Rotkazano.png[/img][/url][/CENTER]<br>' ,
          prefix: UNACCEPT_PREFIX,
          status: false,
        },
        {
            title : 'Нет тайма',
          content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/4NpY3Zyz/VID-20241110-141209-038.gif[/img][/url]<br>' +
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/t4QnvVgf/49224-CE2-6-B89-42-F1-8-B9-D-248-F3970945-F.gif[/img][/url][/CENTER]<br>' +
          '[CENTER][COLOR=#9365B8]{{ greeting }}, уважаемый {{ user.name }} <br><br>' +
          "[CENTER][COLOR=rgb(230, 230, 250)][B][FONT=trebuchet ms]В предоставленных доказательствах отсутствует время (/time) , не подлежит рассмотрению.[/FONT][/COLOR][/CENTER]<br><br>" +
          '[CENTER][SIZE=3][COLOR=rgb(255, 0, 0)]Отказано.[/CENTER][/COLOR]' +
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/t4QnvVgf/49224-CE2-6-B89-42-F1-8-B9-D-248-F3970945-F.gif[/img][/url][/CENTER]<br>' ,
          prefix: UNACCEPT_PREFIX,
          status: false,
        },
        {
            title : 'Нет окна бана',
          content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/4NpY3Zyz/VID-20241110-141209-038.gif[/img][/url]<br>' +
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/t4QnvVgf/49224-CE2-6-B89-42-F1-8-B9-D-248-F3970945-F.gif[/img][/url][/CENTER]<br>' +
          '[CENTER][COLOR=#9365B8]{{ greeting }}, уважаемый {{ user.name }} <br><br>' +
          "[CENTER][COLOR=rgb(230, 230, 250)][B][FONT=trebuchet ms]Прикрепите в доказательства скриншот окна блокировки, которое появляется сразу после входа в игру[/FONT][/COLOR][/CENTER]<br><br>" +
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/t4QnvVgf/49224-CE2-6-B89-42-F1-8-B9-D-248-F3970945-F.gif[/img][/url][/CENTER]<br>'+
          '[CENTER][url=https://postimages.org/][img]http://x-lines.ru/icp/bcW08/CC0000/1/30/Rotkazano.png[/img][/url][/CENTER]<br>' ,
          prefix: UNACCEPT_PREFIX,
          status: false,
        },
        {
            title : 'Нет док-ов',
          content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/4NpY3Zyz/VID-20241110-141209-038.gif[/img][/url]<br>' +
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/t4QnvVgf/49224-CE2-6-B89-42-F1-8-B9-D-248-F3970945-F.gif[/img][/url][/CENTER]<br>' +
          '[CENTER][COLOR=#9365B8]{{ greeting }}, уважаемый {{ user.name }} <br><br>' +
          "[CENTER][COLOR=rgb(230, 230, 250)][B][FONT=trebuchet ms]В вашей жалобе отсутствуют доказательства. Загрузите их на imgur, yapix, google photo или любой другой фото / видео хостинг.[/FONT][/COLOR][/CENTER]<br><br>" +
         '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/t4QnvVgf/49224-CE2-6-B89-42-F1-8-B9-D-248-F3970945-F.gif[/img][/url][/CENTER]<br>'+
          '[CENTER][url=https://postimages.org/][img]http://x-lines.ru/icp/bcW08/CC0000/1/30/Rotkazano.png[/img][/url][/CENTER]<br>' ,
          prefix: UNACCEPT_PREFIX,
          status: false,
        },
        {
            title : 'Доки соц.сети',
          content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/4NpY3Zyz/VID-20241110-141209-038.gif[/img][/url]<br>' +
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/t4QnvVgf/49224-CE2-6-B89-42-F1-8-B9-D-248-F3970945-F.gif[/img][/url][/CENTER]<br>' +
          '[CENTER][COLOR=#9365B8]{{ greeting }}, уважаемый {{ user.name }} <br><br>' +
          "[CENTER][COLOR=rgb(230, 230, 250)][B][FONT=trebuchet ms]Доказательства предоставленные в соц. сетях по типу Twiter, Instagram, VKonakte, Telegram не принимаются.[/FONT][/COLOR][/CENTER]<br><br>" +
          "[CENTER][COLOR=rgb(230, 230, 250)][B][FONT=trebuchet ms]Загрузите свои доказательства на YouTube, Yapix, Imgur или любой другой фото/видео хостинг.[/FONT][/COLOR][/CENTER]<br><br>" +
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/t4QnvVgf/49224-CE2-6-B89-42-F1-8-B9-D-248-F3970945-F.gif[/img][/url][/CENTER]<br>'+
          '[CENTER][url=https://postimages.org/][img]http://x-lines.ru/icp/bcW08/CC0000/1/30/Rotkazano.png[/img][/url][/CENTER]<br>' ,
          prefix: UNACCEPT_PREFIX,
          status: false,
        },
        {
              title : 'Недостаточно доказательств',
          content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/4NpY3Zyz/VID-20241110-141209-038.gif[/img][/url]<br>' +
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/t4QnvVgf/49224-CE2-6-B89-42-F1-8-B9-D-248-F3970945-F.gif[/img][/url][/CENTER]<br>' +
          '[CENTER][COLOR=#9365B8]{{ greeting }}, уважаемый {{ user.name }} <br><br>' +
          "[CENTER][COLOR=rgb(230, 230, 250)][B][FONT=trebuchet ms]В вашей жалобе недостаточно доказательств для вынесения вердикта.[/FONT][/COLOR][/CENTER]<br><br>" +
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/t4QnvVgf/49224-CE2-6-B89-42-F1-8-B9-D-248-F3970945-F.gif[/img][/url][/CENTER]<br>'+
          '[CENTER][url=https://postimages.org/][img]http://x-lines.ru/icp/bcW08/CC0000/1/30/Rotkazano.png[/img][/url][/CENTER]<br>' ,
          prefix: UNACCEPT_PREFIX,
          status: false,
        },
        {
            title : 'Нужен скрин во время получения',
          content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/4NpY3Zyz/VID-20241110-141209-038.gif[/img][/url]<br>' +
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/t4QnvVgf/49224-CE2-6-B89-42-F1-8-B9-D-248-F3970945-F.gif[/img][/url][/CENTER]<br>' +
          '[CENTER][COLOR=#9365B8]{{ greeting }}, уважаемый {{ user.name }} <br><br>' +
          "[CENTER][COLOR=rgb(230, 230, 250)][B][FONT=trebuchet ms]Необходим скриншот во время получения наказания для рассмотрения и запроса доказательств от администратора.[/FONT][/COLOR][/CENTER]<br><br>" +
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/t4QnvVgf/49224-CE2-6-B89-42-F1-8-B9-D-248-F3970945-F.gif[/img][/url][/CENTER]<br>'+
          '[CENTER][url=https://postimages.org/][img]http://x-lines.ru/icp/bcW08/CC0000/1/30/Rotkazano.png[/img][/url][/CENTER]<br>' ,
          prefix: UNACCEPT_PREFIX,
          status: false,
        },
        {
             title : 'Не относиться к жб на адм',
          content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/4NpY3Zyz/VID-20241110-141209-038.gif[/img][/url]<br>' +
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/t4QnvVgf/49224-CE2-6-B89-42-F1-8-B9-D-248-F3970945-F.gif[/img][/url][/CENTER]<br>' +
          '[CENTER][COLOR=#9365B8]{{ greeting }}, уважаемый {{ user.name }} <br><br>' +
          "[CENTER][COLOR=rgb(230, 230, 250)][B][FONT=trebuchet ms]Ваша тема никак не относится к разделу жалоб на администрацию.[/FONT][/COLOR][/CENTER]<br><br>" +
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/t4QnvVgf/49224-CE2-6-B89-42-F1-8-B9-D-248-F3970945-F.gif[/img][/url][/CENTER]<br>'+
          '[CENTER][url=https://postimages.org/][img]http://x-lines.ru/icp/bcW08/CC0000/1/30/Rzakrqto.png[/img][/url][/CENTER]<br>' ,
          prefix: CLOSE_PREFIX,
          status: false,
        },
        {
             title : 'Уже дан ответ',
          content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/4NpY3Zyz/VID-20241110-141209-038.gif[/img][/url]<br>' +
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/t4QnvVgf/49224-CE2-6-B89-42-F1-8-B9-D-248-F3970945-F.gif[/img][/url][/CENTER]<br>' +
          '[CENTER][COLOR=#9365B8]{{ greeting }}, уважаемый {{ user.name }} <br><br>' +
          "[CENTER][COLOR=rgb(230, 230, 250)][B][FONT=trebuchet ms]Вам уже был дан корректный ответ в прошлых темах.[/FONT][/COLOR][/CENTER]<br><br>" +
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/t4QnvVgf/49224-CE2-6-B89-42-F1-8-B9-D-248-F3970945-F.gif[/img][/url][/CENTER]<br>'+
          '[CENTER][url=https://postimages.org/][img]http://x-lines.ru/icp/bcW08/CC0000/1/30/Rzakrqto.png[/img][/url][/CENTER]<br>' ,
          prefix: CLOSE_PREFIX,
          status: false,
        },
        {
              title : 'Адм снят/псж',
          content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/4NpY3Zyz/VID-20241110-141209-038.gif[/img][/url]<br>' +
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/t4QnvVgf/49224-CE2-6-B89-42-F1-8-B9-D-248-F3970945-F.gif[/img][/url][/CENTER]<br>' +
          '[CENTER][COLOR=#9365B8]{{ greeting }}, уважаемый {{ user.name }} <br><br>' +
          "[CENTER][COLOR=rgb(230, 230, 250)][B][FONT=trebuchet ms]Данный администратор снят/ушел ПСЖ.[/FONT][/COLOR][/CENTER]<br><br>" +
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/t4QnvVgf/49224-CE2-6-B89-42-F1-8-B9-D-248-F3970945-F.gif[/img][/url][/CENTER]<br>'+
          '[CENTER][url=https://postimages.org/][img]http://x-lines.ru/icp/bcW08/CC0000/1/30/Rzakrqto.png[/img][/url][/CENTER]<br>' ,
          prefix: CLOSE_PREFIX,
          status: false,
        },
        {
            title : 'Уже взято на рассмотрение',
          content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/4NpY3Zyz/VID-20241110-141209-038.gif[/img][/url]<br>' +
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/t4QnvVgf/49224-CE2-6-B89-42-F1-8-B9-D-248-F3970945-F.gif[/img][/url][/CENTER]<br>' +
          '[CENTER][COLOR=#9365B8]{{ greeting }}, уважаемый {{ user.name }} <br><br>' +
          "[CENTER][COLOR=rgb(230, 230, 250)][B][FONT=trebuchet ms]Ваша подобная тема уже взята на рассмотрение, просьба не создавать дубликаты и ожидать ответы в прошлой теме.[/FONT][/COLOR][/CENTER]<br><br>" +
         '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/t4QnvVgf/49224-CE2-6-B89-42-F1-8-B9-D-248-F3970945-F.gif[/img][/url][/CENTER]<br>'+
          '[CENTER][url=https://postimages.org/][img]http://x-lines.ru/icp/bcW08/CC0000/1/30/Rzakrqto.png[/img][/url][/CENTER]<br>' ,
          prefix: CLOSE_PREFIX,
          status: false,
        },
        {
            title : 'Верное наказание',
          content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/4NpY3Zyz/VID-20241110-141209-038.gif[/img][/url]<br>' +
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/t4QnvVgf/49224-CE2-6-B89-42-F1-8-B9-D-248-F3970945-F.gif[/img][/url][/CENTER]<br>' +
          '[CENTER][COLOR=#9365B8]{{ greeting }}, уважаемый {{ user.name }} <br><br>' +
          "[CENTER][COLOR=rgb(230, 230, 250)][B][FONT=trebuchet ms] Проверив доказательства данного администратора,было принято решение что наказание выдано верно.[/FONT][/COLOR][/CENTER]<br><br>" +
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/t4QnvVgf/49224-CE2-6-B89-42-F1-8-B9-D-248-F3970945-F.gif[/img][/url][/CENTER]<br>'+
          '[CENTER][url=https://postimages.org/][img]http://x-lines.ru/icp/bcW08/CC0000/1/30/Rzakrqto.png[/img][/url][/CENTER]<br>' ,
          prefix: CLOSE_PREFIX,
          status: false,
        },
        {
          title : 'В обжалования',
          content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/4NpY3Zyz/VID-20241110-141209-038.gif[/img][/url]<br>' +
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/t4QnvVgf/49224-CE2-6-B89-42-F1-8-B9-D-248-F3970945-F.gif[/img][/url][/CENTER]<br>' +
          '[CENTER][COLOR=#9365B8]{{ greeting }}, уважаемый {{ user.name }} <br><br>' +
          "[CENTER][COLOR=rgb(230, 230, 250)][B][FONT=trebuchet ms]Обратитесь в раздел обжалований наказаний - [URL='https://forum.blackrussia.online/forums/%D0%9E%D0%B1%D0%B6%D0%B0%D0%BB%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D0%B5-%D0%BD%D0%B0%D0%BA%D0%B0%D0%B7%D0%B0%D0%BD%D0%B8%D0%B9.2417/']*Нажмите сюда*[/URL][/FONT][/COLOR][/CENTER]<br><br>" +
         '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/t4QnvVgf/49224-CE2-6-B89-42-F1-8-B9-D-248-F3970945-F.gif[/img][/url][/CENTER]<br>'+
          '[CENTER][url=https://postimages.org/][img]http://x-lines.ru/icp/bcW08/CC0000/1/30/Rzakrqto.png[/img][/url][/CENTER]<br>' ,
          prefix: CLOSE_PREFIX,
          status: false,
         },
         {
          title : 'В тех. раздел',
          content:
             '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/4NpY3Zyz/VID-20241110-141209-038.gif[/img][/url]<br>' +
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/t4QnvVgf/49224-CE2-6-B89-42-F1-8-B9-D-248-F3970945-F.gif[/img][/url][/CENTER]<br>' +
          '[CENTER][COLOR=#9365B8]{{ greeting }}, уважаемый {{ user.name }} <br><br>' +
          "[CENTER][COLOR=rgb(230, 230, 250)][B][FONT=trebuchet ms]Обратитесь в технический раздел - [URL='https://forum.blackrussia.online/index.php?forums/Технический-раздел.22/']*Нажмите сюда*[/URL][/FONT][/COLOR][/CENTER]<br><br>" +
             '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/t4QnvVgf/49224-CE2-6-B89-42-F1-8-B9-D-248-F3970945-F.gif[/img][/url][/CENTER]<br>'+
          '[CENTER][url=https://postimages.org/][img]http://x-lines.ru/icp/bcW08/CC0000/1/30/Rzakrqto.png[/img][/url][/CENTER]<br>' ,
          prefix: CLOSE_PREFIX,
          status: false,
         },
		 {
          title : 'В жалобы на техов',
          content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/4NpY3Zyz/VID-20241110-141209-038.gif[/img][/url]<br>' +
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/t4QnvVgf/49224-CE2-6-B89-42-F1-8-B9-D-248-F3970945-F.gif[/img][/url][/CENTER]<br>' +
          '[CENTER][COLOR=#9365B8]{{ greeting }}, уважаемый {{ user.name }} <br><br>' +
          "[CENTER][COLOR=rgb(230, 230, 250)][B][FONT=trebuchet ms]Вам было выдано наказание техническим специалистом.[/FONT][/COLOR][/CENTER]<br><br>" +
          "[CENTER][COLOR=rgb(230, 230, 250)][B][FONT=trebuchet ms]Обратитесь в жалобы на технических специалистов - [URL='https://forum.blackrussia.online/forums/Сервер-№30-anapa.1415/']*Нажмите сюда*[/URL][/FONT][/COLOR][/CENTER]<br><br>" +
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/t4QnvVgf/49224-CE2-6-B89-42-F1-8-B9-D-248-F3970945-F.gif[/img][/url][/CENTER]<br>'+
          '[CENTER][url=https://postimages.org/][img]http://x-lines.ru/icp/bcW08/CC0000/1/30/Rzakrqto.png[/img][/url][/CENTER]<br>' ,
          prefix: CLOSE_PREFIX,
          status: false,
         },
         {
          title: 'Передано Специальной администрации',
          content:
             '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/4NpY3Zyz/VID-20241110-141209-038.gif[/img][/url]<br>' +
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/t4QnvVgf/49224-CE2-6-B89-42-F1-8-B9-D-248-F3970945-F.gif[/img][/url][/CENTER]<br>' +
          '[CENTER][COLOR=#9365B8]{{ greeting }}, уважаемый {{ user.name }} <br><br>' +
          "[CENTER][COLOR=rgb(230, 230, 250)][B][FONT=trebuchet ms]Жалоба передана Специальному Администратору, а так же его Заместителю пожалуйста ожидайте ответа[/FONT][/COLOR][/CENTER]<br><br>" +
          '[CENTER][SIZE=3][COLOR=rgb(255, 140, 0)]На рассмотрении.[/CENTER][/COLOR]' +
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/t4QnvVgf/49224-CE2-6-B89-42-F1-8-B9-D-248-F3970945-F.gif[/img][/url][/CENTER]<br>'+
             '[CENTER][url=https://postimages.org/][img]http://x-lines.ru/icp/bcW08/b3c80e/1/24/RspecialxnoIPRadministracii.png[/img][/url][/CENTER]<br>',
          prefix: SA_PREFIX,
          status: true,
        },
        {
        title: 'Передано ЗГА Фракции',
          content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/4NpY3Zyz/VID-20241110-141209-038.gif[/img][/url]<br>' +
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/t4QnvVgf/49224-CE2-6-B89-42-F1-8-B9-D-248-F3970945-F.gif[/img][/url][/CENTER]<br>' +
          '[CENTER][COLOR=#9365B8]{{ greeting }}, уважаемый {{ user.name }} <br><br>' +
          "[CENTER][COLOR=rgb(230, 230, 250)][B][FONT=trebuchet ms]Ваша жалоба передана [Color=#FFFF66]Заместителю Главного Администратора [Color=rgb(230, 230, 250)]по направлению [Color=SKYBLUE]Госс [Color=rgb(230, 230, 250)]/ [Color=#FF0011]ОПГ[/CENTER]<br><br>" +
          '[CENTER][SIZE=3][COLOR=rgb(255, 140, 0)]На рассмотрении.[/CENTER][/COLOR]' +
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/t4QnvVgf/49224-CE2-6-B89-42-F1-8-B9-D-248-F3970945-F.gif[/img][/url][/CENTER]<br>'+
           '[CENTER][url=https://postimages.org/][img]http://x-lines.ru/letters/i/cyrillicgothic/1066/e90c0c/20/1/4nm7brgouuejmwfb4ntpbggowmejmwr54nznbwru4np7brgo1mej5wr64nj7b8ty4nepbfgouuejtwr74ncpbeqowmekbwro4ntpb8sowdejy.png[/img][/url][/CENTER]<br>',
          prefix: PIN_PREFIX,
          status: true,
        },
      {
          title: 'Передано ЗГА АП',
          content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/4NpY3Zyz/VID-20241110-141209-038.gif[/img][/url]<br>' +
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/t4QnvVgf/49224-CE2-6-B89-42-F1-8-B9-D-248-F3970945-F.gif[/img][/url][/CENTER]<br>' +
          '[CENTER][COLOR=#9365B8]{{ greeting }}, уважаемый {{ user.name }} <br><br>' +
          "[CENTER][COLOR=rgb(230, 230, 250)][B][FONT=trebuchet ms]Ваша жалоба передана [Color=#FFFF66]Основному Заместителю Главного Администратора [Color=rgb(230, 230, 250)], который отвечает за направление [Color=SKYBLUE]АП[/CENTER]<br><br>" +
          "[CENTER][COLOR=rgb(230, 230, 250)][B][FONT=trebuchet ms]Ожидайте вердикта в данной тебе [/CENTER]<br><br>" +
          '[CENTER][SIZE=3][COLOR=rgb(255, 140, 0)]На рассмотрении.[/CENTER][/COLOR]' +
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/t4QnvVgf/49224-CE2-6-B89-42-F1-8-B9-D-248-F3970945-F.gif[/img][/url][/CENTER]<br>'+
          '[CENTER][url=https://postimages.org/][img]http://x-lines.ru/letters/i/cyrillicgothic/1066/e90c0c/20/1/4nm7brgouuejmwfb4ntpbggowmejmwr54nznbwru4np7brgo1mej5wr64nj7b8ty4nepbfgouuejtwr74ncpbeqowmekbwro4ntpb8sowdejy.png[/img][/url][/CENTER]<br>',
          prefix: PIN_PREFIX,
          status: true,
        },
      {
          title: 'Передано ГА',
          content:
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/4NpY3Zyz/VID-20241110-141209-038.gif[/img][/url]<br>' +
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/t4QnvVgf/49224-CE2-6-B89-42-F1-8-B9-D-248-F3970945-F.gif[/img][/url][/CENTER]<br>' +
          '[CENTER][COLOR=#9365B8]{{ greeting }}, уважаемый {{ user.name }} <br><br>' +
          "[CENTER][COLOR=rgb(230, 230, 250)][B][FONT=trebuchet ms]Ваша жалоба переадресована [/FONT][/COLOR][COLOR=rgb(255, 0, 0)][FONT=trebuchet ms][SIZE=4]Главному администратору[/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=trebuchet ms][SIZE=4].[/FONT][/COLOR][/CENTER]<br><br>" +
          '[CENTER][SIZE=3][COLOR=rgb(255, 140, 0)]На рассмотрении.[/CENTER][/COLOR]' +
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/t4QnvVgf/49224-CE2-6-B89-42-F1-8-B9-D-248-F3970945-F.gif[/img][/url][/CENTER]<br>'+
          '[CENTER][url=https://postimages.org/][img]http://x-lines.ru/icp/bcW08/CC0000/1/24/RglavnomuPRadministratoru.png[/img][/url][/CENTER]<br>',
          prefix: GA_PREFIX,
          status: true,
 },
        {
          title: '_________________________________Жалобы на игроков________________________________________',
            },
{
	  title: '| На рассмотрение |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/t4QnvVgf/49224-CE2-6-B89-42-F1-8-B9-D-248-F3970945-F.gif[/img][/url]<br>' +
		"[B][CENTER][COLOR=LightGrey]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=LightGrey] Ваша жалоба взята на [COLOR=Orange]рассмотрение[/COLOR], пожалуйста ожидайте ответа.<br><br>"+
                "[B][CENTER]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/t4QnvVgf/49224-CE2-6-B89-42-F1-8-B9-D-248-F3970945-F.gif[/img][/url]<br>",
    prefix: PIN_PREFIX,
	  status: true,
},
{
  title: '| Оск/Упом родни |',
	  content:

		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/t4QnvVgf/49224-CE2-6-B89-42-F1-8-B9-D-248-F3970945-F.gif[/img][/url]<br>' +
		"[B][CENTER][COLOR=LightGrey]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=LightGrey] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
                "[B][CENTER][Spoiler][COLOR=LightGrey][FONT=trebuchet ms][Color=#ff0000]3.04.[/color] Запрещено оскорбление или косвенное упоминание родных вне зависимости от чата [Color=#ff0000]| Mute 120 минут / Ban 7 - 15 дней[/color].[/COLOR]<br><br>"+
                "[*][FONT=book antiqua][SIZE=4][COLOR=rgb(255, 0, 0)]Примечание: [/COLOR][COLOR=LightGrey]термины «MQ», «rnq» расценивается, как упоминание родных.[/COLOR][/SIZE][/FONT]<br>" +
                "[*][FONT=book antiqua][SIZE=4][COLOR=rgb(255, 0, 0)]Исключение: [/COLOR][COLOR=LightGrey]если упоминание родных было совершено в ходе Role Play процесса и не содержало в себе прямого или завуалированного оскорбления.[/COLOR][/SIZE][/FONT][/Spoiler][/CENTER][/B]<br><br>"+
                "[B][CENTER]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/t4QnvVgf/49224-CE2-6-B89-42-F1-8-B9-D-248-F3970945-F.gif[/img][/url]<br>",
        prefix: ACCEPT_PREFIX,
	  status: false,
},
{
    title: '| NonRP Обман |',
	  content:

		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/t4QnvVgf/49224-CE2-6-B89-42-F1-8-B9-D-248-F3970945-F.gif[/img][/url]<br>' +
		"[B][CENTER][COLOR=LightGrey]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=LightGrey] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
                "[B][CENTER][Spoiler][COLOR=LightGrey][FONT=trebuchet ms][Color=#ff0000]2.05.[/color] Запрещены любые OOC обманы и их попытки, а также любые IC обманы с нарушением Role Play правил и логики [Color=#ff0000]| PermBan[/color].[/COLOR]<br><br>" +
                "[*][FONT=book antiqua][SIZE=4][COLOR=rgb(255, 0, 0)]Примечание: [/COLOR][COLOR=LightGrey]после IC договоренности получить денежные средства и сразу же выйти из игры с целью обмана игрока, или же, договорившись через OOC чат (/n), точно также получить денежные средства и сразу же выйти из игры и тому подобные ситуации.[/COLOR][/SIZE][/FONT]<br>" +
                "[*][FONT=book antiqua][SIZE=4][COLOR=rgb(255, 0, 0)]Примечание: [/COLOR][COLOR=LightGrey]разблокировка игрового аккаунта нарушителя будет возможна только в случае возврата полной суммы причиненного ущерба, либо непосредственно самого имущества, которое было украдено (по решению обманутой стороны).[/COLOR][/SIZE][/FONT][/Spoiler][/CENTER][/B]<br><br>"+
                "[B][CENTER]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/t4QnvVgf/49224-CE2-6-B89-42-F1-8-B9-D-248-F3970945-F.gif[/img][/url]<br>" ,

        prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: '|____________________________________________Отказ жалобы____________________________________________|'
},
{
	  title: '| Нарушений не найдено |',
	  content:

		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/t4QnvVgf/49224-CE2-6-B89-42-F1-8-B9-D-248-F3970945-F.gif[/img][/url]<br>' +
		"[B][CENTER][COLOR=LightGrey]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=LightGrey] Ваша жалоба [COLOR=#FF0000]отказана[/COLOR], так как нарушений со стороны данного игрока не было найдено. <br><br>"+
                "[B][CENTER][COLOR=LightGrey]Убедительная просьба ознакомиться с правилами подачи жалоб на игроков, закрепленные в данном разделе.<br>"+
                "[B][CENTER]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/t4QnvVgf/49224-CE2-6-B89-42-F1-8-B9-D-248-F3970945-F.gif[/img][/url]<br>",

    prefix: UNACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| Возврат средств |',
	  content:

		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/t4QnvVgf/49224-CE2-6-B89-42-F1-8-B9-D-248-F3970945-F.gif[/img][/url]<br>' +
		"[B][CENTER][COLOR=LightGrey]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=LightGrey] Ваша жалоба [COLOR=#FF0000]отказана[/COLOR], так как администрация сервера не несёт ответственности за утраченные Вами средства при обмане и т.д. <br><br>"+
                "[B][CENTER][COLOR=LightGrey]Убедительная просьба ознакомиться с правилами подачи жалоб на игроков, закрепленные в данном разделе.<br>"+
                "[B][CENTER]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/t4QnvVgf/49224-CE2-6-B89-42-F1-8-B9-D-248-F3970945-F.gif[/img][/url]<br>",

    prefix: UNACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| Недостаточно док-в |',
	  content:

		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/t4QnvVgf/49224-CE2-6-B89-42-F1-8-B9-D-248-F3970945-F.gif[/img][/url]<br>' +
		"[B][CENTER][COLOR=LightGrey]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=LightGrey] Ваша жалоба [COLOR=#FF0000]отказана[/COLOR], так как доказательств на нарушение от данного игрока  недостаточно. <br><br>"+
                "[B][CENTER][COLOR=LightGrey]Убедительная просьба ознакомиться с правилами подачи жалоб на игроков, закрепленные в данном разделе.<br>"+
                "[B][CENTER]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/t4QnvVgf/49224-CE2-6-B89-42-F1-8-B9-D-248-F3970945-F.gif[/img][/url]<br>",

    prefix: UNACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| Отсутствуют док-ва |',
	  content:

		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/t4QnvVgf/49224-CE2-6-B89-42-F1-8-B9-D-248-F3970945-F.gif[/img][/url]<br>' +
		"[B][CENTER][COLOR=LightGrey]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=LightGrey] Ваша жалоба [COLOR=#FF0000]отказана[/COLOR], так как доказательств на нарушение от данного игрока  отсутствуют. <br><br>"+
                "[B][CENTER][COLOR=LightGrey]Убедительная просьба ознакомиться с правилами подачи жалоб на игроков, закрепленные в данном разделе.<br>"+
                "[B][CENTER]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/t4QnvVgf/49224-CE2-6-B89-42-F1-8-B9-D-248-F3970945-F.gif[/img][/url]<br>",

    prefix: UNACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| Док-ва отредактированы |',
	  content:

		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/t4QnvVgf/49224-CE2-6-B89-42-F1-8-B9-D-248-F3970945-F.gif[/img][/url]<br>' +
		"[B][CENTER][COLOR=LightGrey]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=LightGrey] Ваша жалоба [COLOR=#FF0000]отказана[/COLOR], так как доказательств на нарушение от данного игрока  отредактированы. <br><br>"+
                "[B][CENTER][COLOR=LightGrey]Убедительная просьба ознакомиться с правилами подачи жалоб на игроков, закрепленные в данном разделе.<br>"+
                "[B][CENTER]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/t4QnvVgf/49224-CE2-6-B89-42-F1-8-B9-D-248-F3970945-F.gif[/img][/url]<br>",

    prefix: UNACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| Слив семьи |',
	  content:

		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/t4QnvVgf/49224-CE2-6-B89-42-F1-8-B9-D-248-F3970945-F.gif[/img][/url]<br>' +
		"[B][CENTER][COLOR=LightGrey]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=LightGrey] Ваша жалоба [COLOR=#FF0000]отказана[/COLOR], так как слив семьи никак не относится к правилам проекта, то есть если Лидер семьи дал игроку роль заместителя, то только он за это и отвечает, Администрация сервера не несет за это ответственность. <br><br>"+
                "[B][CENTER][COLOR=LightGrey]Убедительная просьба ознакомиться с правилами подачи жалоб на игроков, закрепленные в данном разделе.<br>"+
                "[B][CENTER]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/t4QnvVgf/49224-CE2-6-B89-42-F1-8-B9-D-248-F3970945-F.gif[/img][/url]<br>",

    prefix: UNACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| Не по форме |',
	  content:

		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/t4QnvVgf/49224-CE2-6-B89-42-F1-8-B9-D-248-F3970945-F.gif[/img][/url]<br>' +
		"[B][CENTER][COLOR=LightGrey]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=LightGrey] Ваша жалоба [COLOR=#FF0000]отказана[/COLOR], так как ваша жалоба составлена не по форме. <br><br>"+
                "[B][CENTER][COLOR=LightGrey]Убедительная просьба ознакомиться с правилами подачи жалоб на игроков, закрепленные в данном разделе.<br>"+
                "[B][CENTER]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/t4QnvVgf/49224-CE2-6-B89-42-F1-8-B9-D-248-F3970945-F.gif[/img][/url]<br>",

    prefix: UNACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| Нет /time |',
	  content:

		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/t4QnvVgf/49224-CE2-6-B89-42-F1-8-B9-D-248-F3970945-F.gif[/img][/url]<br>' +
		"[B][CENTER][COLOR=LightGrey]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=LightGrey] Ваша жалоба [COLOR=#FF0000]отказана[/COLOR], так как на ваших доказательствах отсутствует /time.  <br><br>"+
                "[B][CENTER][COLOR=LightGrey]Убедительная просьба ознакомиться с правилами подачи жалоб на игроков, закрепленные в данном разделе.<br>"+
                "[B][CENTER]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/t4QnvVgf/49224-CE2-6-B89-42-F1-8-B9-D-248-F3970945-F.gif[/img][/url]<br>",

    prefix: UNACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| Нет time кодов|',
	  content:

		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/t4QnvVgf/49224-CE2-6-B89-42-F1-8-B9-D-248-F3970945-F.gif[/img][/url]<br>' +
		"[B][CENTER][COLOR=LightGrey]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=LightGrey] Ваша жалоба [COLOR=#FF0000]отказана[/COLOR], так как отсутствует time коды. Если видео длится больше 3-ех минут - Вы должны указать time коды нарушений. <br><br>"+
                "[B][CENTER][COLOR=LightGrey]Убедительная просьба ознакомиться с правилами подачи жалоб на игроков, закрепленные в данном разделе.<br>"+
                "[B][CENTER]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/t4QnvVgf/49224-CE2-6-B89-42-F1-8-B9-D-248-F3970945-F.gif[/img][/url]<br>",

    prefix: UNACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| Более 72-х часов |',
	  content:

		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/t4QnvVgf/49224-CE2-6-B89-42-F1-8-B9-D-248-F3970945-F.gif[/img][/url]<br>' +
		"[B][CENTER][COLOR=LightGrey]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=LightGrey] Ваша жалоба [COLOR=#FF0000]отказана[/COLOR], так как с момента совершенного нарушения со стороны игрока прошло более 72 часов. Срок написания жалобы составляет три дня (72 часа) с момента совершенного нарушения со стороны игрока сервера.<br><br>"+
                "[B][CENTER][COLOR=LightGrey]Убедительная просьба ознакомиться с правилами подачи жалоб на игроков, закрепленные в данном разделе.<br>"+
                "[B][CENTER]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/t4QnvVgf/49224-CE2-6-B89-42-F1-8-B9-D-248-F3970945-F.gif[/img][/url]<br>",

    prefix: UNACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| Док-ва соц сеть |',
	  content:

		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/t4QnvVgf/49224-CE2-6-B89-42-F1-8-B9-D-248-F3970945-F.gif[/img][/url]<br>' +
		"[B][CENTER][COLOR=LightGrey]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=LightGrey] Ваша жалоба [COLOR=#FF0000]отказана[/COLOR], так как доказательства загружены в соц. сетях. Загрузка доказательств в соц. сети (ВКонтакте, instagram) запрещается, доказательства должны быть загружены на фото/видео хостинги (YouTube, Япикс, imgur). <br><br>"+
                "[B][CENTER][COLOR=LightGrey]Убедительная просьба ознакомиться с правилами подачи жалоб на игроков, закрепленные в данном разделе.<br>"+
                "[B][CENTER]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/t4QnvVgf/49224-CE2-6-B89-42-F1-8-B9-D-248-F3970945-F.gif[/img][/url]<br>",

    prefix: UNACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| Условия сделки |',
	  content:

		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/t4QnvVgf/49224-CE2-6-B89-42-F1-8-B9-D-248-F3970945-F.gif[/img][/url]<br>' +
		"[B][CENTER][COLOR=LightGrey]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=LightGrey] Ваша жалоба [COLOR=#FF0000]отказана[/COLOR], так как в Ваших доказательствах отсутствуют условия сделки. <br><br>"+
                "[B][CENTER][COLOR=LightGrey]Убедительная просьба ознакомиться с правилами подачи жалоб на игроков, закрепленные в данном разделе.<br>"+
                "[B][CENTER]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/t4QnvVgf/49224-CE2-6-B89-42-F1-8-B9-D-248-F3970945-F.gif[/img][/url]<br>",

    prefix: UNACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| Нужен фрапс |',
	  content:

		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/t4QnvVgf/49224-CE2-6-B89-42-F1-8-B9-D-248-F3970945-F.gif[/img][/url]<br>' +
		"[B][CENTER][COLOR=LightGrey]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=LightGrey] Ваша жалоба [COLOR=#FF0000]отказана[/COLOR], так как доказательств недостаточно. В данной ситуации необходим фрапс(запись экрана). <br><br>"+
                "[B][CENTER][COLOR=LightGrey]Убедительная просьба ознакомиться с правилами подачи жалоб на игроков, закрепленные в данном разделе.<br>"+
                "[B][CENTER]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/t4QnvVgf/49224-CE2-6-B89-42-F1-8-B9-D-248-F3970945-F.gif[/img][/url]<br>",

    prefix: UNACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| Фрапс обрывается |',
	  content:

		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/t4QnvVgf/49224-CE2-6-B89-42-F1-8-B9-D-248-F3970945-F.gif[/img][/url]<br>' +
		"[B][CENTER][COLOR=LightGrey]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=LightGrey] Ваша жалоба [COLOR=#FF0000]отказана[/COLOR], так как видео-доказательство обрывается. Загрузите полную видеозапись на видео-хостинг YouTube. <br><br>"+
                "[B][CENTER][COLOR=LightGrey]Убедительная просьба ознакомиться с правилами подачи жалоб на игроков, закрепленные в данном разделе.<br>"+
                "[B][CENTER]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/t4QnvVgf/49224-CE2-6-B89-42-F1-8-B9-D-248-F3970945-F.gif[/img][/url]<br>",

    prefix: UNACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| Док-ва не открываются |',
	  content:

		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/t4QnvVgf/49224-CE2-6-B89-42-F1-8-B9-D-248-F3970945-F.gif[/img][/url]<br>' +
		"[B][CENTER][COLOR=LightGrey]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=LightGrey] Ваша жалоба [COLOR=#FF0000]отказана[/COLOR], так как ваши доказательства не открываются. <br><br>"+
                "[B][CENTER][COLOR=LightGrey]Убедительная просьба ознакомиться с правилами подачи жалоб на игроков, закрепленные в данном разделе.<br>"+
                "[B][CENTER]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/t4QnvVgf/49224-CE2-6-B89-42-F1-8-B9-D-248-F3970945-F.gif[/img][/url]<br>",

    prefix: UNACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| Жалоба от 3-го лицо |',
	  content:

		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/t4QnvVgf/49224-CE2-6-B89-42-F1-8-B9-D-248-F3970945-F.gif[/img][/url]<br>' +
		"[B][CENTER][COLOR=LightGrey]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=LightGrey] Ваша жалоба [COLOR=#FF0000]отказана[/COLOR], так как Ваша жалоба написана от 3-го лица. Жалоба от третьего лица не принимается (жалоба должна быть подана участником ситуации). <br><br>"+
                "[B][CENTER][COLOR=LightGrey]Убедительная просьба ознакомиться с правилами подачи жалоб на игроков, закрепленные в данном разделе.<br>"+
                "[B][CENTER]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/t4QnvVgf/49224-CE2-6-B89-42-F1-8-B9-D-248-F3970945-F.gif[/img][/url]<br>",

    prefix: UNACCEPT_PREFIX,
	  status: false,
},
{
    	  title: '| Жалоба на 2-х и более игроков |',
	  content:

		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/t4QnvVgf/49224-CE2-6-B89-42-F1-8-B9-D-248-F3970945-F.gif[/img][/url]<br>' +
		"[B][CENTER][COLOR=LightGrey]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=LightGrey] Ваша жалоба [COLOR=#FF0000]отказана[/COLOR], так как ваша жалоба написана на 2-х или более игроков. <br><br>"+
                "[B][CENTER][COLOR=LightGrey]Убедительная просьба ознакомиться с правилами подачи жалоб на игроков, закрепленные в данном разделе.<br>"+
                "[B][CENTER]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/t4QnvVgf/49224-CE2-6-B89-42-F1-8-B9-D-248-F3970945-F.gif[/img][/url]<br>",

    prefix: UNACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| Ошиблись сервером |',
	  content:

		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/t4QnvVgf/49224-CE2-6-B89-42-F1-8-B9-D-248-F3970945-F.gif[/img][/url]<br>' +
		"[B][CENTER][COLOR=LightGrey]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=LightGrey] Вы ошиблись сервером, перенаправляю  вашу жалобу на нужный сервер. <br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/t4QnvVgf/49224-CE2-6-B89-42-F1-8-B9-D-248-F3970945-F.gif[/img][/url]<br>",

    prefix: UNACCEPT_PREFIX ,
	  status: false,
         },
        ];


          $(document).ready(() => {
            // Загрузка скрипта для обработки шаблонов
            $('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');

            // Добавление кнопок при загрузке страницы
            addButton('На рассмотрение', 'pin');
            addButton('КП', 'teamProject');
            addButton('Закрыто', 'close')
            addButton('Одобрено', 'accepted');
            addButton('Отказано', 'unaccept');
            addButton('Вердикты', 'selectAnswer');

            // Поиск информации о теме
            const threadData = getThreadData();

            $('button#pin').click(() => editThreadData(PIN_PREFIX, true));
            $('button#accepted').click(() => editThreadData(ACCEPT_PREFIX, false));
            $('button#teamProject').click(() => editThreadData(COMMAND_PREFIX, true));
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