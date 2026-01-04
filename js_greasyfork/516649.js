// ==UserScript==
// @name         script for пупок балбесина где гифки
// @namespace    https://forum.blackrussia.online
// @version      1.4
// @description  script for kуратор
// @author       Давид
// @match        https://forum.blackrussia.online/threads/*
// @include      https://forum.blackrussia.online/threads/
// @grant        none
// @license      MIT
// @collaborator
// @icon https://cdn.icon-icons.com/icons2/4155/PNG/512/adobe_after_effects_icon_261536.png
// @downloadURL https://update.greasyfork.org/scripts/516649/script%20for%20%D0%BF%D1%83%D0%BF%D0%BE%D0%BA%20%D0%B1%D0%B0%D0%BB%D0%B1%D0%B5%D1%81%D0%B8%D0%BD%D0%B0%20%D0%B3%D0%B4%D0%B5%20%D0%B3%D0%B8%D1%84%D0%BA%D0%B8.user.js
// @updateURL https://update.greasyfork.org/scripts/516649/script%20for%20%D0%BF%D1%83%D0%BF%D0%BE%D0%BA%20%D0%B1%D0%B0%D0%BB%D0%B1%D0%B5%D1%81%D0%B8%D0%BD%D0%B0%20%D0%B3%D0%B4%D0%B5%20%D0%B3%D0%B8%D1%84%D0%BA%D0%B8.meta.js
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
          '[CENTER][url=https://postimages.org/][img]https://i.ibb.co/rF87DNV/23e304932c71453a.png[/img][/url][/CENTER]<br>' +
         '[CENTER][COLOR=#9365B8]{{ greeting }}, уважаемый {{ user.name }} <br><br>' +
         '[CENTER][COLOR=LightGray] Напиши <br><br>' +
          '[CENTER][url=https://postimages.org/][img]https://i.ibb.co/rF87DNV/23e304932c71453a.png[/img][/url][/CENTER]<br>' +
          '[CENTER][url=https://postimages.org/][img]https://share.creavite.co/673091d2b23406fceac1380b.gif[/img][/url][/CENTER]<br>'
        },
        {
        title: 'Одобрено',
        content:
         '[CENTER][SIZE=7][COLOR=GREEN] ОДОБРЕНО[/SIZE][/COLOR]<br><br>' +
         '[CENTER]свой ответ <br><br>',
            prefix: VAJNO_PREFIX,
          status: true,
        },
        {
        title: 'Отказано',
        content:
         '[CENTER][SIZE=7][COLOR=RED] ОТКАЗАНО[/SIZE][/COLOR]<br><br>' +
         '[CENTER]свой ответ <br><br>',
            prefix: VAJNO_PREFIX,
          status: true,
        },
        {


          title: '_________________________________Жалобы на администрацию________________________________________',
        },
        {
          title: 'На рассмотрении',
          content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/4NpY3Zyz/VID-20241110-141209-038.gif[/img][/url]<br>' +
          '[CENTER][url=https://postimages.org/][img]https://i.ibb.co/rF87DNV/23e304932c71453a.png[/img][/url][/CENTER]<br>' +
         '[CENTER][COLOR=#9365B8]{{ greeting }}, уважаемый {{ user.name }} <br><br>' +
          "[CENTER][COLOR=rgb(230, 230, 250)][B][FONT=times new roman]Жалоба взята [COLOR=ORANGE]на рассмотрение[COLOR=rgb(230, 230, 250)], ожидайте вердикта в данной теме.[/FONT][/COLOR][/CENTER]<br><br>" +
          '[CENTER][url=https://postimages.org/][img]https://i.ibb.co/rF87DNV/23e304932c71453a.png[/img][/url][/CENTER]<br>' +
           '[CENTER][url=https://postimages.org/][img]https://share.creavite.co/673091d2b23406fceac1380b.gif[/img][/url][/CENTER]<br>' ,
          prefix: PIN_PREFIX,
          status: true,
        },
        {
          title : 'Наказание по ошибке',
          content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/4NpY3Zyz/VID-20241110-141209-038.gif[/img][/url]<br>' +
          '[CENTER][url=https://postimages.org/][img]https://i.ibb.co/rF87DNV/23e304932c71453a.png[/img][/url][/CENTER]<br>' +
          '[CENTER][COLOR=#9365B8]{{ greeting }}, уважаемый {{ user.name }} <br><br>' +
          "[CENTER][COLOR=rgb(230, 230, 250)][B][FONT=times new roman]Вследствие беседы с администратором было выяснено, что наказание было выдано по ошибке,наказание будет снято в ближайшее время.[/FONT][/COLOR][/CENTER]<br><br>" +
           "[CENTER][COLOR=rgb(230, 230, 250)][B][FONT=times new roman]С администратором будет проведена необходимая работа.[/FONT][/COLOR][/CENTER]<br><br>" +
          '[CENTER][SIZE=3][COLOR=rgb(57, 255, 20)]Одобрено.[/CENTER][/COLOR]'+
          '[CENTER][url=https://postimages.org/][img]https://i.ibb.co/rF87DNV/23e304932c71453a.png[/img][/url][/CENTER]<br>' +
          '[CENTER][url=https://postimages.org/][img]https://share.creavite.co/673091d2b23406fceac1380b.gif[/img][/url][/CENTER]<br>',
          prefix: ACCEPT_PREFIX,
          status: false,
         },
         {
          title : 'Меры в сторону адм',
          content:
             '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/4NpY3Zyz/VID-20241110-141209-038.gif[/img][/url]<br>' +
          '[CENTER][url=https://postimages.org/][img]https://i.ibb.co/rF87DNV/23e304932c71453a.png[/img][/url][/CENTER]<br>' +
          '[CENTER][COLOR=#9365B8]{{ greeting }}, уважаемый {{ user.name }} <br><br>' +
          "[CENTER][COLOR=rgb(230, 230, 250)][B][FONT=times new roman]В сторону администратора будут приняты необходимые меры.[/FONT][/COLOR][/CENTER]<br><br>" +
         '[CENTER][SIZE=3][COLOR=rgb(57, 255, 20)]Одобрено.[/CENTER][/COLOR]'+
          '[CENTER][url=https://postimages.org/][img]https://i.ibb.co/rF87DNV/23e304932c71453a.png[/img][/url][/CENTER]<br>' +
          '[CENTER][url=https://postimages.org/][img]https://share.creavite.co/673091d2b23406fceac1380b.gif[/img][/url][/CENTER]<br>',
          prefix: ACCEPT_PREFIX,
          status: false,
         },
         {
          title : 'Нет нарушений',
          content:
             '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/4NpY3Zyz/VID-20241110-141209-038.gif[/img][/url]<br>' +
          '[CENTER][url=https://postimages.org/][img]https://i.ibb.co/rF87DNV/23e304932c71453a.png[/img][/url][/CENTER]<br>' +
          '[CENTER][COLOR=#9365B8]{{ greeting }}, уважаемый {{ user.name }} <br><br>' +
          "[CENTER][COLOR=rgb(230, 230, 250)][B][FONT=times new roman]Исходя из выше приложенных доказательств, нарушения со стороны администратора - не имеется.[/FONT][/COLOR][/CENTER]<br><br>"+
          '[CENTER][SIZE=3][COLOR=rgb(255, 0, 0)]Отказано.[/CENTER][/COLOR]' +
          '[CENTER][url=https://postimages.org/][img]https://i.ibb.co/rF87DNV/23e304932c71453a.png[/img][/url][/CENTER]<br>' +
          '[CENTER][url=https://postimages.org/][img]https://share.creavite.co/673091d2b23406fceac1380b.gif[/img][/url][/CENTER]<br>' ,
          prefix: UNACCEPT_PREFIX,
          status: false,
        },
        {
          title : 'ЖБ не по форме',
          content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/4NpY3Zyz/VID-20241110-141209-038.gif[/img][/url]<br>' +
          '[CENTER][url=https://postimages.org/][img]https://i.ibb.co/rF87DNV/23e304932c71453a.png[/img][/url][/CENTER]<br>' +
          '[CENTER][COLOR=#9365B8]{{ greeting }}, уважаемый {{ user.name }} <br><br>' +
          "[CENTER][COLOR=rgb(230, 230, 250)][B][FONT=times new roman]Ваша жалоба составлена не по форме. Ознакомьтесь с правилами подачи жалобы - [URL='https://forum.blackrussia.online/threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BF%D0%BE%D0%B4%D0%B0%D1%87%D0%B8-%D0%B6%D0%B0%D0%BB%D0%BE%D0%B1-%D0%BD%D0%B0-%D0%B0%D0%B4%D0%BC%D0%B8%D0%BD%D0%B8%D1%81%D1%82%D1%80%D0%B0%D1%86%D0%B8%D1%8E.3429349/']*Нажмите сюда*[/URL][/FONT][/COLOR][/CENTER]<br><br>" +
          '[CENTER][url=https://postimages.org/][img]https://i.ibb.co/rF87DNV/23e304932c71453a.png[/img][/url][/CENTER]<br>' +
          '[CENTER][SIZE=3][COLOR=rgb(255, 0, 0)]Отказано.[/CENTER][/COLOR]' +
          '[CENTER][url=https://postimages.org/][img]https://i.ibb.co/rF87DNV/23e304932c71453a.png[/img][/url][/CENTER]<br>' +
          '[CENTER][url=https://postimages.org/][img]https://share.creavite.co/673091d2b23406fceac1380b.gif[/img][/url][/CENTER]<br>' ,
          prefix: UNACCEPT_PREFIX,
          status: false,
         },
         {
             title : 'Прошло 48 часов',
          content:
             '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/4NpY3Zyz/VID-20241110-141209-038.gif[/img][/url]<br>' +
          '[CENTER][url=https://postimages.org/][img]https://i.ibb.co/rF87DNV/23e304932c71453a.png[/img][/url][/CENTER]<br>' +
          '[CENTER][COLOR=#9365B8]{{ greeting }}, уважаемый {{ user.name }} <br><br>' +
          "[CENTER][COLOR=rgb(230, 230, 250)][B][FONT=times new roman]С момента выдачи наказания прошло более 48-и часов.[/FONT][/COLOR][/CENTER]<br><br>" +
          '[CENTER][SIZE=3][COLOR=rgb(255, 0, 0)]Отказано.[/CENTER][/COLOR]' +
          '[CENTER][url=https://postimages.org/][img]https://i.ibb.co/rF87DNV/23e304932c71453a.png[/img][/url][/CENTER]<br>' +
          '[CENTER][url=https://postimages.org/][img]https://share.creavite.co/673091d2b23406fceac1380b.gif[/img][/url][/CENTER]<br>' ,
          prefix: UNACCEPT_PREFIX,
          status: false,
        },
        {
            title : 'Доки не рабочие',
          content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/4NpY3Zyz/VID-20241110-141209-038.gif[/img][/url]<br>' +
          '[CENTER][url=https://postimages.org/][img]https://i.ibb.co/rF87DNV/23e304932c71453a.png[/img][/url][/CENTER]<br>' +
          '[CENTER][COLOR=#9365B8]{{ greeting }}, уважаемый {{ user.name }} <br><br>' +
          "[CENTER][COLOR=rgb(230, 230, 250)][B][FONT=times new roman]Ваши доказательства не рабочие или же битая ссылка.[/FONT][/COLOR][/CENTER]<br><br>" +
          '[CENTER][SIZE=3][COLOR=rgb(255, 0, 0)]Отказано.[/CENTER][/COLOR]' +
          '[CENTER][url=https://postimages.org/][img]https://i.ibb.co/rF87DNV/23e304932c71453a.png[/img][/url][/CENTER]<br>' +
          '[CENTER][url=https://postimages.org/][img]https://share.creavite.co/673091d2b23406fceac1380b.gif[/img][/url][/CENTER]<br>' ,
          prefix: UNACCEPT_PREFIX,
          status: false,
        },
        {
            title : 'Нет тайма',
          content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/4NpY3Zyz/VID-20241110-141209-038.gif[/img][/url]<br>' +
          '[CENTER][url=https://postimages.org/][img]https://i.ibb.co/rF87DNV/23e304932c71453a.png[/img][/url][/CENTER]<br>' +
          '[CENTER][COLOR=#9365B8]{{ greeting }}, уважаемый {{ user.name }} <br><br>' +
          "[CENTER][COLOR=rgb(230, 230, 250)][B][FONT=times new roman]В предоставленных доказательствах отсутствует время (/time) , не подлежит рассмотрению.[/FONT][/COLOR][/CENTER]<br><br>" +
          '[CENTER][SIZE=3][COLOR=rgb(255, 0, 0)]Отказано.[/CENTER][/COLOR]' +
          '[CENTER][url=https://postimages.org/][img]https://i.ibb.co/rF87DNV/23e304932c71453a.png[/img][/url][/CENTER]<br>' +
          '[CENTER][url=https://postimages.org/][img]https://share.creavite.co/673091d2b23406fceac1380b.gif[/img][/url][/CENTER]<br>' ,
          prefix: UNACCEPT_PREFIX,
          status: false,
        },
        {
            title : 'Нет окна бана',
          content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/4NpY3Zyz/VID-20241110-141209-038.gif[/img][/url]<br>' +
          '[CENTER][url=https://postimages.org/][img]https://i.ibb.co/rF87DNV/23e304932c71453a.png[/img][/url][/CENTER]<br>' +
          '[CENTER][COLOR=#9365B8]{{ greeting }}, уважаемый {{ user.name }} <br><br>' +
          "[CENTER][COLOR=rgb(230, 230, 250)][B][FONT=times new roman]Прикрепите в доказательства скриншот окна блокировки, которое появляется сразу после входа в игру[/FONT][/COLOR][/CENTER]<br><br>" +
          '[CENTER][SIZE=3][COLOR=rgb(255, 0, 0)]Отказано.[/CENTER][/COLOR]' +
          '[CENTER][url=https://postimages.org/][img]https://i.ibb.co/rF87DNV/23e304932c71453a.png[/img][/url][/CENTER]<br>' +
          '[CENTER][url=https://postimages.org/][img]https://share.creavite.co/673091d2b23406fceac1380b.gif[/img][/url][/CENTER]<br>' ,
          prefix: UNACCEPT_PREFIX,
          status: false,
        },
        {
            title : 'Нет док-ов',
          content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/4NpY3Zyz/VID-20241110-141209-038.gif[/img][/url]<br>' +
          '[CENTER][url=https://postimages.org/][img]https://i.ibb.co/rF87DNV/23e304932c71453a.png[/img][/url][/CENTER]<br>' +
          '[CENTER][COLOR=#9365B8]{{ greeting }}, уважаемый {{ user.name }} <br><br>' +
          "[CENTER][COLOR=rgb(230, 230, 250)][B][FONT=times new roman]В вашей жалобе отсутствуют доказательства. Загрузите их на imgur, yapix, google photo или любой другой фото / видео хостинг.[/FONT][/COLOR][/CENTER]<br><br>" +
          '[CENTER][SIZE=3][COLOR=rgb(255, 0, 0)]Отказано.[/CENTER][/COLOR]' +
          '[CENTER][url=https://postimages.org/][img]https://i.ibb.co/rF87DNV/23e304932c71453a.png[/img][/url][/CENTER]<br>' +
          '[CENTER][url=https://postimages.org/][img]https://share.creavite.co/673091d2b23406fceac1380b.gif[/img][/url][/CENTER]<br>' ,
          prefix: UNACCEPT_PREFIX,
          status: false,
        },
        {
            title : 'Доки соц.сети',
          content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/4NpY3Zyz/VID-20241110-141209-038.gif[/img][/url]<br>' +
          '[CENTER][url=https://postimages.org/][img]https://i.ibb.co/rF87DNV/23e304932c71453a.png[/img][/url][/CENTER]<br>' +
          '[CENTER][COLOR=#9365B8]{{ greeting }}, уважаемый {{ user.name }} <br><br>' +
          "[CENTER][COLOR=rgb(230, 230, 250)][B][FONT=times new roman]Доказательства предоставленные в соц. сетях по типу Twiter, Instagram, VKonakte, Telegram не принимаются.[/FONT][/COLOR][/CENTER]<br><br>" +
          "[CENTER][COLOR=rgb(230, 230, 250)][B][FONT=times new roman]Загрузите свои доказательства на YouTube, Yapix, Imgur или любой другой фото/видео хостинг.[/FONT][/COLOR][/CENTER]<br><br>" +
          '[CENTER][SIZE=3][COLOR=rgb(255, 0, 0)]Отказано.[/CENTER][/COLOR]' +
          '[CENTER][url=https://postimages.org/][img]https://i.ibb.co/rF87DNV/23e304932c71453a.png[/img][/url][/CENTER]<br>' +
          '[CENTER][url=https://postimages.org/][img]https://share.creavite.co/673091d2b23406fceac1380b.gif[/img][/url][/CENTER]<br>' ,
          prefix: UNACCEPT_PREFIX,
          status: false,
        },
        {
             title : 'Уже дан ответ',
          content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/4NpY3Zyz/VID-20241110-141209-038.gif[/img][/url]<br>' +
          '[CENTER][url=https://postimages.org/][img]https://i.ibb.co/rF87DNV/23e304932c71453a.png[/img][/url][/CENTER]<br>' +
          '[CENTER][COLOR=#9365B8]{{ greeting }}, уважаемый {{ user.name }} <br><br>' +
          "[CENTER][COLOR=rgb(230, 230, 250)][B][FONT=times new roman]Вам уже был дан корректный ответ в прошлых темах.[/FONT][/COLOR][/CENTER]<br><br>" +
          '[CENTER][SIZE=3][COLOR=rgb(255, 0, 0)]Закрыто.[/CENTER][/COLOR]' +
          '[CENTER][url=https://postimages.org/][img]https://i.ibb.co/rF87DNV/23e304932c71453a.png[/img][/url][/CENTER]<br>' +
          '[CENTER][url=https://postimages.org/][img]https://share.creavite.co/673091d2b23406fceac1380b.gif[/img][/url][/CENTER]<br>' ,
          prefix: CLOSE_PREFIX,
          status: false,
        },
        {
            title : 'Уже взято на рассмотрение',
          content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/4NpY3Zyz/VID-20241110-141209-038.gif[/img][/url]<br>' +
          '[CENTER][url=https://postimages.org/][img]https://i.ibb.co/rF87DNV/23e304932c71453a.png[/img][/url][/CENTER]<br>' +
          '[CENTER][COLOR=#9365B8]{{ greeting }}, уважаемый {{ user.name }} <br><br>' +
          "[CENTER][COLOR=rgb(230, 230, 250)][B][FONT=times new roman]Ваша подобная тема уже взята на рассмотрение, просьба не создавать дубликаты и ожидать ответы в прошлой теме.[/FONT][/COLOR][/CENTER]<br><br>" +
          '[CENTER][SIZE=3][COLOR=rgb(255, 0, 0)]Закрыто.[/CENTER][/COLOR]' +
          '[CENTER][url=https://postimages.org/][img]https://i.ibb.co/rF87DNV/23e304932c71453a.png[/img][/url][/CENTER]<br>' +
          '[CENTER][url=https://postimages.org/][img]https://share.creavite.co/673091d2b23406fceac1380b.gif[/img][/url][/CENTER]<br>' ,
          prefix: CLOSE_PREFIX,
          status: false,
        },
        {
            title : 'Верное наказание',
          content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/4NpY3Zyz/VID-20241110-141209-038.gif[/img][/url]<br>' +
          '[CENTER][url=https://postimages.org/][img]https://i.ibb.co/rF87DNV/23e304932c71453a.png[/img][/url][/CENTER]<br>' +
          '[CENTER][COLOR=#9365B8]{{ greeting }}, уважаемый {{ user.name }} <br><br>' +
          "[CENTER][COLOR=rgb(230, 230, 250)][B][FONT=times new roman] Проверив доказательства данного администратора,было принято решение что наказание выдано верно.[/FONT][/COLOR][/CENTER]<br><br>" +
          '[CENTER][SIZE=3][COLOR=rgb(255, 0, 0)]Закрыто.[/CENTER][/COLOR]' +
          '[CENTER][url=https://postimages.org/][img]https://i.ibb.co/rF87DNV/23e304932c71453a.png[/img][/url][/CENTER]<br>' +
          '[CENTER][url=https://postimages.org/][img]https://share.creavite.co/673091d2b23406fceac1380b.gif[/img][/url][/CENTER]<br>' ,
          prefix: CLOSE_PREFIX,
          status: false,
        },
        {
          title : 'В обжалования',
          content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/4NpY3Zyz/VID-20241110-141209-038.gif[/img][/url]<br>' +
          '[CENTER][url=https://postimages.org/][img]https://i.ibb.co/rF87DNV/23e304932c71453a.png[/img][/url][/CENTER]<br>' +
          '[CENTER][COLOR=#9365B8]{{ greeting }}, уважаемый {{ user.name }} <br><br>' +
          "[CENTER][COLOR=rgb(230, 230, 250)][B][FONT=times new roman]Обратитесь в раздел обжалований наказаний - [URL='https://forum.blackrussia.online/forums/%D0%9E%D0%B1%D0%B6%D0%B0%D0%BB%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D0%B5-%D0%BD%D0%B0%D0%BA%D0%B0%D0%B7%D0%B0%D0%BD%D0%B8%D0%B9.2417/']*Нажмите сюда*[/URL][/FONT][/COLOR][/CENTER]<br><br>" +
          '[CENTER][SIZE=3][COLOR=rgb(255, 0, 0)]Закрыто.[/CENTER][/COLOR]' +
          '[CENTER][url=https://postimages.org/][img]https://i.ibb.co/rF87DNV/23e304932c71453a.png[/img][/url][/CENTER]<br>' +
          '[CENTER][url=https://postimages.org/][img]https://share.creavite.co/673091d2b23406fceac1380b.gif[/img][/url][/CENTER]<br>' ,
          prefix: CLOSE_PREFIX,
          status: false,
         },
         {
          title : 'В тех. раздел',
          content:
             '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/4NpY3Zyz/VID-20241110-141209-038.gif[/img][/url]<br>' +
          '[CENTER][url=https://postimages.org/][img]https://i.ibb.co/rF87DNV/23e304932c71453a.png[/img][/url][/CENTER]<br>' +
          '[CENTER][COLOR=#9365B8]{{ greeting }}, уважаемый {{ user.name }} <br><br>' +
          "[CENTER][COLOR=rgb(230, 230, 250)][B][FONT=times new roman]Обратитесь в технический раздел - [URL='https://forum.blackrussia.online/index.php?forums/Технический-раздел.22/']*Нажмите сюда*[/URL][/FONT][/COLOR][/CENTER]<br><br>" +
          '[CENTER][SIZE=3][COLOR=rgb(255, 0, 0)]Закрыто.[/CENTER][/COLOR]' +
          '[CENTER][url=https://postimages.org/][img]https://i.ibb.co/rF87DNV/23e304932c71453a.png[/img][/url][/CENTER]<br>' +
          '[CENTER][url=https://postimages.org/][img]https://share.creavite.co/673091d2b23406fceac1380b.gif[/img][/url][/CENTER]<br>' ,
          prefix: CLOSE_PREFIX,
          status: false,
         },
		 {
          title : 'В жалобы на техов',
          content:
             '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/4NpY3Zyz/VID-20241110-141209-038.gif[/img][/url]<br>' +
          '[CENTER][url=https://postimages.org/][img]https://i.ibb.co/rF87DNV/23e304932c71453a.png[/img][/url][/CENTER]<br>' +
          '[CENTER][COLOR=#9365B8]{{ greeting }}, уважаемый {{ user.name }} <br><br>' +
          "[CENTER][COLOR=rgb(230, 230, 250)][B][FONT=times new roman]Обратитесь жалобы на Технических Специалистов - [URL='https://forum.blackrussia.online/forums/Сервер-№30-anapa.1415/']*Нажмите сюда*[/URL][/FONT][/COLOR][/CENTER]<br><br>" +
          '[CENTER][SIZE=3][COLOR=rgb(255, 0, 0)]Закрыто.[/CENTER][/COLOR]' +
          '[CENTER][url=https://postimages.org/][img]https://i.ibb.co/rF87DNV/23e304932c71453a.png[/img][/url][/CENTER]<br>' +
          '[CENTER][url=https://postimages.org/][img]https://share.creavite.co/673091d2b23406fceac1380b.gif[/img][/url][/CENTER]<br>' ,
          prefix: UNACCEPT_PREFIX,
          status: false,
         },
         {
          title: 'Передано Специальной администрации',
          content:
             '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/4NpY3Zyz/VID-20241110-141209-038.gif[/img][/url]<br>' +
          '[CENTER][url=https://postimages.org/][img]https://i.ibb.co/rF87DNV/23e304932c71453a.png[/img][/url][/CENTER]<br>' +
          '[CENTER][COLOR=#9365B8]{{ greeting }}, уважаемый {{ user.name }} <br><br>' +
          "[CENTER][COLOR=rgb(230, 230, 250)][B][FONT=times new roman]Жалоба передана Специальному Администратору, а так же его Заместителю пожалуйста ожидайте ответа[/FONT][/COLOR][/CENTER]<br><br>" +
          '[CENTER][SIZE=3][COLOR=rgb(255, 140, 0)]На рассмотрении.[/CENTER][/COLOR]' +
          '[CENTER][url=https://postimages.org/][img]https://i.ibb.co/rF87DNV/23e304932c71453a.png[/img][/url][/CENTER]<br>' +
          '[CENTER][url=https://postimages.org/][img]https://share.creavite.co/673091d2b23406fceac1380b.gif[/img][/url][/CENTER]<br>' ,
          prefix: SA_PREFIX,
          status: true,
        },
        {
        title: 'Передано ЗГА Фракции',
          content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/4NpY3Zyz/VID-20241110-141209-038.gif[/img][/url]<br>' +
          '[CENTER][url=https://postimages.org/][img]https://i.ibb.co/rF87DNV/23e304932c71453a.png[/img][/url][/CENTER]<br>' +
          '[CENTER][COLOR=#9365B8]{{ greeting }}, уважаемый {{ user.name }} <br><br>' +
          "[CENTER][COLOR=rgb(230, 230, 250)][B][FONT=times new roman]Ваша жалоба передана [Color=#FFFF66]Заместителю Главного Администратора [Color=rgb(230, 230, 250)]по направлению [Color=SKYBLUE]Госс [Color=rgb(230, 230, 250)]/ [Color=#FF0011]ОПГ[/CENTER]<br><br>" +
          '[CENTER][SIZE=3][COLOR=rgb(255, 140, 0)]На рассмотрении.[/CENTER][/COLOR]' +
          '[CENTER][url=https://postimages.org/][img]https://i.ibb.co/rF87DNV/23e304932c71453a.png[/img][/url][/CENTER]<br>' +
          '[CENTER][url=https://postimages.org/][img]https://share.creavite.co/673091d2b23406fceac1380b.gif[/img][/url][/CENTER]<br>' ,
          prefix: PIN_PREFIX,
          status: true,
        },
      {
          title: 'Передано ГА',
          content:
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/4NpY3Zyz/VID-20241110-141209-038.gif[/img][/url]<br>' +
          '[CENTER][url=https://postimages.org/][img]https://i.ibb.co/rF87DNV/23e304932c71453a.png[/img][/url][/CENTER]<br>' +
          '[CENTER][COLOR=#9365B8]{{ greeting }}, уважаемый {{ user.name }} <br><br>' +
          "[CENTER][COLOR=rgb(230, 230, 250)][B][FONT=times new roman]Ваша жалоба переадресована [/FONT][/COLOR][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]Главному администратору[/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4].[/FONT][/COLOR][/CENTER]<br><br>" +
          '[CENTER][SIZE=3][COLOR=rgb(255, 140, 0)]На рассмотрении.[/CENTER][/COLOR]' +
          '[CENTER][url=https://postimages.org/][img]https://i.ibb.co/rF87DNV/23e304932c71453a.png[/img][/url][/CENTER]<br>' +
          '[CENTER][url=https://postimages.org/][img]https://share.creavite.co/673091d2b23406fceac1380b.gif[/img][/url][/CENTER]<br>' ,
          prefix: GA_PREFIX,
          status: true,
         },
        ];


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