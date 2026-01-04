// ==UserScript==
// @name         Скрипт для лидеров/следящих форума ANAPA
// @namespace    http://tampermonkey.net/
// @version      3.15
// @description  По вопросам в ВК - https://vk.com/id859847308, туда же и по предложениям на улучшение скрипта)
// @author       Nekit_Donsckoy
// @match        https://forum.blackrussia.online/threads/*
// @icon         https://forum.blackrussia.online/data/avatars/o/11/11193.jpg?1680968342
// @grant        none
// @license    MIT
// @downloadURL https://update.greasyfork.org/scripts/538604/%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%BB%D0%B8%D0%B4%D0%B5%D1%80%D0%BE%D0%B2%D1%81%D0%BB%D0%B5%D0%B4%D1%8F%D1%89%D0%B8%D1%85%20%D1%84%D0%BE%D1%80%D1%83%D0%BC%D0%B0%20ANAPA.user.js
// @updateURL https://update.greasyfork.org/scripts/538604/%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%BB%D0%B8%D0%B4%D0%B5%D1%80%D0%BE%D0%B2%D1%81%D0%BB%D0%B5%D0%B4%D1%8F%D1%89%D0%B8%D1%85%20%D1%84%D0%BE%D1%80%D1%83%D0%BC%D0%B0%20ANAPA.meta.js
// ==/UserScript==

(function () {
    'use strict';
  const FAIL_PREFIX = 4;
  const OKAY_PREFIX = 8;
  const WAIT_PREFIX = 2;
  const TECH_PREFIX = 13;
  const WATCH_PREFIX = 9;
  const CLOSE_PREFIX = 7;
  const UNACCСEPT_PREFIX = 4;
  const PIN_PREFIX = 2; // Prefix that will be set when thread closes
  const ACCСEPT_PREFIX = 8; // Prefix that will be set when thread accepted
  const RESHENO_PREFIX = 6; // Prefix that will be set when solving the problem
  const PINN_PREFIX = 2; // Prefix that will be set when thread pins
  const GA_PREFIX = 12; // Prefix that will be set when thread send to ga
  const COMMAND_PREFIX = 10; // Prefix that will be set when thread send to project team
  const WATCHED_PREFIX = 9;
  const SPECY_PREFIX = 11;
  const TEXY_PREFIX = 13;
  const OJIDANIE_PREFIX = 14;
  const OTKAZBIO_PREFIX = 4;
  const ODOBRENOBIO_PREFIX = 8;
  const NARASSMOTRENIIBIO_PREFIX = 2;
  const REALIZOVANO_PREFIX = 5;
  const VAJNO_PREFIX = 1;
  const PREFIKS = 0;
  const KACHESTVO = 15;
  const RASSMOTRENO_PREFIX = 9;
  const OTKAZRP_PREFIX = 4;
  const ODOBRENORP_PREFIX = 8;
  const NARASSMOTRENIIRP_PREFIX = 2;
  const OTKAZORG_PREFIX = 4;
  const ODOBRENOORG_PREFIX = 8;
  const NARASSMOTRENIIORG_PREFIX = 2;

  const START_DECOR = `<div style="text-align: center"><span style="font-family: 'Courier New'">`
  const END_DECOR = `</span></div>`


  const buttons = [
      {
       title: '_______________________________________________✅️Система баллов✅️_______________________________________________'
    },
   {
       title: '_______________________________________________✅️Одобрено✅️_______________________________________________'
    },
      {
     title: 'Рулетка',
	  content:

		"[B][CENTER][COLOR=RED]{{ greeting }} [/COLOR][/CENTER][/B]<br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][COLOR=lavender][FONT=times new roman][Color=#ff0000][/color] У вас будет снято 25 баллов.[/color].[/CENTER][/B]<br><br>"+
      '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][COLOR=#ff0026] Одобрено.[/CENTER]<br><br>" +
         '[CENTER][CENTER][FONT=times new roman][COLOR=	#ffc6b4]С уважением by N.Donsckoy![/CENTER][/FONT]',
     },
      {
      title: 'Выговор',
	  content:

		"[B][CENTER][COLOR=RED]{{ greeting }} [/COLOR][/CENTER][/B]<br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][COLOR=lavender][FONT=times new roman][Color=#ff0000][/color] У вас будет снято 40 баллов.[/color].[/CENTER][/B]<br><br>"+
        "[B][CENTER][COLOR=lavender][FONT=times new roman][Color=#ff0000][/color] Вам будет добавлен Иммунитет от выговора.[/color].[/CENTER][/B]<br><br>"+
      '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][COLOR=#ff0026] Одобрено.[/CENTER]<br><br>" +
         '[CENTER][CENTER][FONT=times new roman][COLOR=	#ffc6b4]С уважением by N.Donsckoy![/CENTER][/FONT]',
     },
      {
      title: 'Предупреждение',
	  content:

		"[B][CENTER][COLOR=RED]{{ greeting }} [/COLOR][/CENTER][/B]<br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][COLOR=lavender][FONT=times new roman][Color=#ff0000][/color] У вас будет снято 30 баллов.[/color].[/CENTER][/B]<br><br>"+
        "[B][CENTER][COLOR=lavender][FONT=times new roman][Color=#ff0000][/color] Вам будет добавлен Иммунитет от предупреждения.[/color].[/CENTER][/B]<br><br>"+
      '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][COLOR=#ff0026] Одобрено.[/CENTER]<br><br>" +
         '[CENTER][CENTER][FONT=times new roman][COLOR=	#ffc6b4]С уважением by N.Donsckoy![/CENTER][/FONT]',
     },
      {
      title: 'Роспись',
	  content:

		"[B][CENTER][COLOR=RED]{{ greeting }} [/COLOR][/CENTER][/B]<br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][COLOR=lavender][FONT=times new roman][Color=#ff0000][/color] У вас будет снято 20 баллов.[/color].[/CENTER][/B]<br><br>"+
        "[B][CENTER][COLOR=lavender][FONT=times new roman][Color=#ff0000][/color] У вас в течении 24 чалов распишутся ГС/ЗГС/С на форумном аккаунте.[/color].[/CENTER][/B]<br><br>"+
      '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][COLOR=#ff0026] Одобрено.[/CENTER]<br><br>" +
         '[CENTER][CENTER][FONT=times new roman][COLOR=	#ffc6b4]С уважением by N.Donsckoy![/CENTER][/FONT]',
     },
      {
      title: 'Банер',
	  content:

		"[B][CENTER][COLOR=RED]{{ greeting }} [/COLOR][/CENTER][/B]<br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][COLOR=lavender][FONT=times new roman][Color=#ff0000][/color] У вас будет снято 25 баллов.[/color].[/CENTER][/B]<br><br>"+
        "[B][CENTER][COLOR=lavender][FONT=times new roman][Color=#ff0000][/color] Обратитесь к следящему вашей организации.[/color].[/CENTER][/B]<br><br>"+
      '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][COLOR=#ff0026] Одобрено.[/CENTER]<br><br>" +
         '[CENTER][CENTER][FONT=times new roman][COLOR=	#ffc6b4]С уважением by N.Donsckoy![/CENTER][/FONT]',
     },
      {
      title: 'Статус',
	  content:

		"[B][CENTER][COLOR=RED]{{ greeting }} [/COLOR][/CENTER][/B]<br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][COLOR=lavender][FONT=times new roman][Color=#ff0000][/color] У вас будет снято 25 баллов.[/color].[/CENTER][/B]<br><br>"+
        "[B][CENTER][COLOR=lavender][FONT=times new roman][Color=#ff0000][/color] Обратитесь к следящему вашей организации.[/color].[/CENTER][/B]<br><br>"+
      '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][COLOR=#ff0026] Одобрено.[/CENTER]<br><br>" +
         '[CENTER][CENTER][FONT=times new roman][COLOR=	#ffc6b4]С уважением by N.Donsckoy![/CENTER][/FONT]',
     },
      {
      title: 'Выговор',
	  content:

		"[B][CENTER][COLOR=RED]{{ greeting }} [/COLOR][/CENTER][/B]<br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][COLOR=lavender][FONT=times new roman][Color=#ff0000][/color] У вас будет снято 16 баллов.[/color].[/CENTER][/B]<br><br>"+
        "[B][CENTER][COLOR=lavender][FONT=times new roman][Color=#ff0000][/color] У вас будет анулирован выговор.[/color].[/CENTER][/B]<br><br>"+
      '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][COLOR=#ff0026] Одобрено.[/CENTER]<br><br>" +
         '[CENTER][CENTER][FONT=times new roman][COLOR=	#ffc6b4]С уважением by N.Donsckoy![/CENTER][/FONT]',
     },
      {
      title: 'Предупреждение',
	  content:

		"[B][CENTER][COLOR=RED]{{ greeting }} [/COLOR][/CENTER][/B]<br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][COLOR=lavender][FONT=times new roman][Color=#ff0000][/color] У вас будет снято 8 баллов.[/color].[/CENTER][/B]<br><br>"+
        "[B][CENTER][COLOR=lavender][FONT=times new roman][Color=#ff0000][/color] У вас будет анулирован выговор.[/color].[/CENTER][/B]<br><br>"+
      '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][COLOR=#ff0026] Одобрено.[/CENTER]<br><br>" +
         '[CENTER][CENTER][FONT=times new roman][COLOR=	#ffc6b4]С уважением by N.Donsckoy![/CENTER][/FONT]',
     },
      {
       title: '_______________________________________________✅️Отказано✅️_______________________________________________'
    },
      {
      title: 'Нехватает быллов',
	  content:

		"[B][CENTER][COLOR=RED]{{ greeting }} [/COLOR][/CENTER][/B]<br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][COLOR=lavender][FONT=times new roman][Color=#ff0000][/color] У вас не хватает баллов на преобретения чего либо.[/color].[/CENTER][/B]<br><br>"+
      '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][COLOR=#ff0026] Отказано.[/CENTER]<br><br>" +
         '[CENTER][CENTER][FONT=times new roman][COLOR=	#ffc6b4]С уважением by N.Donsckoy![/CENTER][/FONT]',
     },
     {
      title: 'Время',
	  content:

		"[B][CENTER][COLOR=RED]{{ greeting }} [/COLOR][/CENTER][/B]<br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][COLOR=lavender][FONT=times new roman][Color=#ff0000][/color] У вас не прошел минимальный срок для снятия наказаний.[/color].[/CENTER][/B]<br><br>"+
      '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][COLOR=#ff0026] Отказано.[/CENTER]<br><br>" +
         '[CENTER][CENTER][FONT=times new roman][COLOR=	#ffc6b4]С уважением by N.Donsckoy![/CENTER][/FONT]',
     },
    {
       title: '_______________________________________________✅️Для жалоб✅️_______________________________________________'
    },
      {
       title: '_______________________________________________✅️Одобрено✅️_______________________________________________'
    },
      {
            title: 'Разговор',
            content:
            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/I][/SIZE][/FONT][/COLOR]<br><br>' +
            "[COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4][I]С сотрудником будет проведена беседа.<br><br>" +
            "[FONT=book antiqua][SIZE=4][COLOR=rgb(209, 213, 216)][I]Приятной игры на BLACK RUSSIA ANAPA [/I][/COLOR][I][COLOR=rgb(0, 140, 240)]Role Play[/COLOR][/I][/SIZE][/FONT][COLOR=rgb(0, 140, 240)][FONT=book antiqua][SIZE=4][I].[/I][/SIZE][/FONT][/COLOR]<br><br>" +
            '[url=https://postimages.org/][img]https://s4.hostingkartinok.com/uploads/images/2013/05/1a612be953e1187f103dc4ae3f1d2b32.gif[/img][/url]',
           },
      {
       title: 'Предупреждение',
            content:
            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/I][/SIZE][/FONT][/COLOR]<br><br>' +
            "[COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4][I]Сотруднику будет выдано предупреждение.<br><br>" +
            "[FONT=book antiqua][SIZE=4][COLOR=rgb(209, 213, 216)][I]Приятной игры на BLACK RUSSIA ANAPA [/I][/COLOR][I][COLOR=rgb(0, 140, 240)]Role Play[/COLOR][/I][/SIZE][/FONT][COLOR=rgb(0, 140, 240)][FONT=book antiqua][SIZE=4][I].[/I][/SIZE][/FONT][/COLOR]<br><br>" +
            '[url=https://postimages.org/][img]https://s4.hostingkartinok.com/uploads/images/2013/05/1a612be953e1187f103dc4ae3f1d2b32.gif[/img][/url]',
           },
      {
       title: 'Выговор',
            content:
            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/I][/SIZE][/FONT][/COLOR]<br><br>' +
            "[COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4][I]Сотруднику будет выдан выгвор.<br><br>" +
            "[FONT=book antiqua][SIZE=4][COLOR=rgb(209, 213, 216)][I]Приятной игры на BLACK RUSSIA ANAPA [/I][/COLOR][I][COLOR=rgb(0, 140, 240)]Role Play[/COLOR][/I][/SIZE][/FONT][COLOR=rgb(0, 140, 240)][FONT=book antiqua][SIZE=4][I].[/I][/SIZE][/FONT][/COLOR]<br><br>" +
            '[url=https://postimages.org/][img]https://s4.hostingkartinok.com/uploads/images/2013/05/1a612be953e1187f103dc4ae3f1d2b32.gif[/img][/url]',
           },
      {
       title: 'Разговор',
            content:
            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/I][/SIZE][/FONT][/COLOR]<br><br>' +
            "[COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4][I]Сотруднику будет уволен. <br><br>" +
            "[FONT=book antiqua][SIZE=4][COLOR=rgb(209, 213, 216)][I]Приятной игры на BLACK RUSSIA ANAPA [/I][/COLOR][I][COLOR=rgb(0, 140, 240)]Role Play[/COLOR][/I][/SIZE][/FONT][COLOR=rgb(0, 140, 240)][FONT=book antiqua][SIZE=4][I].[/I][/SIZE][/FONT][/COLOR]<br><br>" +
            '[url=https://postimages.org/][img]https://s4.hostingkartinok.com/uploads/images/2013/05/1a612be953e1187f103dc4ae3f1d2b32.gif[/img][/url]',
           },
     {
       title: '_______________________________________________✅️Отказано✅️_______________________________________________'
    },
      {
      title: 'Время',
	  content:

		"[B][CENTER][COLOR=RED]{{ greeting }} уважаемый игрок. [/COLOR][/CENTER][/B]<br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][COLOR=lavender][FONT=times new roman][Color=#ff0000][/color] С момента нарушения прошло более 3-х дней.[/color][/CENTER][/B]<br><br>"+
      '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][COLOR=#ff0026] Отказано.[/CENTER]<br><br>" +
         '[CENTER][CENTER][FONT=times new roman][COLOR=	#ffc6b4]С уважением by N.Donsckoy![/CENTER][/FONT]',
     },
      {
            title: 'Недостаточно док-в',
            content:
            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/I][/SIZE][/FONT][/COLOR]<br><br>' +
             "[COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4][I]Недостаточно доказательств для корректного рассмотрения вашей жалобы.[/I][/SIZE][/FONT]<br><br>" +
             "[I][FONT=times new roman][SIZE=4]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/SIZE][/FONT][/I][/COLOR]<br><br>" +
             "[FONT=book antiqua][SIZE=4][COLOR=rgb(209, 213, 216)][I]Приятной игры на BLACK RUSSIA ANAPA [/I][/COLOR][I][COLOR=rgb(0, 140, 240)]Role Play[/COLOR][/I][/SIZE][/FONT][COLOR=rgb(0, 140, 240)][FONT=book antiqua][SIZE=4][I].[/I][/SIZE][/FONT][/COLOR]<br><br>" +
             '[url=https://postimages.org/][img]https://s4.hostingkartinok.com/uploads/images/2013/05/1a612be953e1187f103dc4ae3f1d2b32.gif[/img][/url]',
           },
           {
            title: 'Отсутствуют док-ва',
            content:
            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/I][/SIZE][/FONT][/COLOR]<br><br>' +
             "[COLOR=rgb(209, 213, 216)][SIZE=4][FONT=times new roman][I]Отсутствуют доказательства - следовательно, рассмотрению не подлежит. Загрузите доказательства на фото-видео хостинги YouTube, Imgur, Yapx и так далее.[/I][/FONT][/SIZE]<br><br>" +
             "[I][FONT=times new roman][SIZE=4]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/SIZE][/FONT][/I][/COLOR]<br><br>" +
             "[FONT=book antiqua][SIZE=4][COLOR=rgb(209, 213, 216)][I]Приятной игры на BLACK RUSSIA ANAPA [/I][/COLOR][I][COLOR=rgb(0, 140, 240)]Role Play[/COLOR][/I][/SIZE][/FONT][COLOR=rgb(0, 140, 240)][FONT=book antiqua][SIZE=4][I].[/I][/SIZE][/FONT][/COLOR]<br><br>" +
             '[url=https://postimages.org/][img]https://s4.hostingkartinok.com/uploads/images/2013/05/1a612be953e1187f103dc4ae3f1d2b32.gif[/img][/url]',
           },
           {
            title: 'Не работает док-во',
            content:
            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/I][/SIZE][/FONT][/COLOR]<br><br>' +
             "[COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4][I]]Ваши доказательства не рабочие или же битая ссылка.[/I][/SIZE][/FONT]<br><br>" +
             "[I][FONT=times new roman][SIZE=4]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/SIZE][/FONT][/I][/COLOR]<br><br>" +
             "[FONT=book antiqua][SIZE=4][COLOR=rgb(209, 213, 216)][I]Приятной игры на BLACK RUSSIA ANAPA [/I][/COLOR][I][COLOR=rgb(0, 140, 240)]Role Play[/COLOR][/I][/SIZE][/FONT][COLOR=rgb(0, 140, 240)][FONT=book antiqua][SIZE=4][I].[/I][/SIZE][/FONT][/COLOR]<br><br>" +
             '[url=https://postimages.org/][img]https://s4.hostingkartinok.com/uploads/images/2013/05/1a612be953e1187f103dc4ae3f1d2b32.gif[/img][/url]',
           },
           {
            title: 'Док-ва отредакт',
            content:
            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/I][/SIZE][/FONT][/COLOR]<br><br>' +
             "[COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4][I]Доказательства были подвергнуты редактированию - следовательно, рассмотрению не подлежит.<br><br>" +
             "Загрузите оригиналы видеозаписи/скриншотов, создав новую тему в данном разделе.<br><br>" +
             "Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/I][/SIZE][/FONT][/COLOR]<br><br>" +
             "[FONT=book antiqua][SIZE=4][COLOR=rgb(209, 213, 216)][I]Приятной игры на BLACK RUSSIA ANAPA [/I][/COLOR][I][COLOR=rgb(0, 140, 240)]Role Play[/COLOR][/I][/SIZE][/FONT][COLOR=rgb(0, 140, 240)][FONT=book antiqua][SIZE=4][I].[/I][/SIZE][/FONT][/COLOR]<br><br>" +
             '[url=https://postimages.org/][img]https://s4.hostingkartinok.com/uploads/images/2013/05/1a612be953e1187f103dc4ae3f1d2b32.gif[/img][/url]',
           },
           {
            title: 'Док-ва обрываются',
            content:
            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/I][/SIZE][/FONT][/COLOR]<br><br>' +
            "[COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4][I]Ваша видеозапись обрывается. Загрузите полную видеозапись на видео-хостинг YouTube.<br><br>" +
            "Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/I][/SIZE][/FONT][/COLOR]<br><br>" +
            "[FONT=book antiqua][SIZE=4][COLOR=rgb(209, 213, 216)][I]Приятной игры на BLACK RUSSIA ANAPA [/I][/COLOR][I][COLOR=rgb(0, 140, 240)]Role Play[/COLOR][/I][/SIZE][/FONT][COLOR=rgb(0, 140, 240)][FONT=book antiqua][SIZE=4][I].[/I][/SIZE][/FONT][/COLOR]<br><br>" +
            '[url=https://postimages.org/][img]https://s4.hostingkartinok.com/uploads/images/2013/05/1a612be953e1187f103dc4ae3f1d2b32.gif[/img][/url]',
           },
           {
            title: 'Док-ва в соц. сетях',
            content:
            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/I][/SIZE][/FONT][/COLOR]<br><br>' +
             "[COLOR=rgb(209, 213, 216)][SIZE=4][FONT=times new roman][I]Доказательства в социальных сетях и т.д. не принимаются. Загрузите доказательства на фото-видео хостинги YouTube,Imgur, Yapx и так далее.[/I][/FONT][/SIZE]<br><br>" +
             "[FONT=times new roman][SIZE=4][I]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/I][/SIZE][/FONT][/COLOR]<br><br>" +
             "[FONT=book antiqua][SIZE=4][COLOR=rgb(209, 213, 216)][I]Приятной игры на BLACK RUSSIA ANAPA [/I][/COLOR][I][COLOR=rgb(0, 140, 240)]Role Play[/COLOR][/I][/SIZE][/FONT][COLOR=rgb(0, 140, 240)][FONT=book antiqua][SIZE=4][I].[/I][/SIZE][/FONT][/COLOR]<br><br>" +
             '[url=https://postimages.org/][img]https://s4.hostingkartinok.com/uploads/images/2013/05/1a612be953e1187f103dc4ae3f1d2b32.gif[/img][/url]',
           },
           {
            title: 'Нужен Фрапс',
            content:
            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/I][/SIZE][/FONT][/COLOR]<br><br>' +
             "[COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4][I]В данной ситуации обязательнодолжен быть фрапс(видео фиксация)всех моментов.[/I][/SIZE][/FONT]<br><br>" +
             "[I][FONT=times new roman][SIZE=4]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/SIZE][/FONT][/I][/COLOR]<br><br>" +
             "[FONT=book antiqua][SIZE=4][COLOR=rgb(209, 213, 216)][I]Приятной игры на BLACK RUSSIA ANAPA [/I][/COLOR][I][COLOR=rgb(0, 140, 240)]Role Play[/COLOR][/I][/SIZE][/FONT][COLOR=rgb(0, 140, 240)][FONT=book antiqua][SIZE=4][I].[/I][/SIZE][/FONT][/COLOR]<br><br>" +
             '[url=https://postimages.org/][img]https://s4.hostingkartinok.com/uploads/images/2013/05/1a612be953e1187f103dc4ae3f1d2b32.gif[/img][/url]',
           },
           {
            title: 'Неполный Фрапс',
            content:
            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/I][/SIZE][/FONT][/COLOR]<br><br>' +
             "[COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4][I]Видео фиксация не полная либо же нет условий сделки.[/I][/SIZE][/FONT]<br><br>" +
             "[I][FONT=times new roman][SIZE=4]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/SIZE][/FONT][/I][/COLOR]<br><br>" +
             "[FONT=book antiqua][SIZE=4][COLOR=rgb(209, 213, 216)][I]Приятной игры на BLACK RUSSIA ANAPA [/I][/COLOR][I][COLOR=rgb(0, 140, 240)]Role Play[/COLOR][/I][/SIZE][/FONT][COLOR=rgb(0, 140, 240)][FONT=book antiqua][SIZE=4][I].[/I][/SIZE][/FONT][/COLOR]<br><br>" +
             '[url=https://postimages.org/][img]https://s4.hostingkartinok.com/uploads/images/2013/05/1a612be953e1187f103dc4ae3f1d2b32.gif[/img][/url]',
           },
           {
            title: 'Нет time',
            content:
            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/I][/SIZE][/FONT][/COLOR]<br><br>' +
             "[COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4][I]На доказательствах отсутствуют дата и время [/I]([/SIZE][/FONT][FONT=courier new][SIZE=4]/time[/SIZE][/FONT][FONT=times new roman][SIZE=4])[I] - следовательно, рассмотрению не подлежит.<br><br>" +
             "Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/I][/SIZE][/FONT][/COLOR]<br><br>" +
             "[FONT=book antiqua][SIZE=4][COLOR=rgb(209, 213, 216)][I]Приятной игры на BLACK RUSSIA ANAPA [/I][/COLOR][I][COLOR=rgb(0, 140, 240)]Role Play[/COLOR][/I][/SIZE][/FONT][COLOR=rgb(0, 140, 240)][FONT=book antiqua][SIZE=4][I].[/I][/SIZE][/FONT][/COLOR]<br><br>" +
             '[url=https://postimages.org/][img]https://s4.hostingkartinok.com/uploads/images/2013/05/1a612be953e1187f103dc4ae3f1d2b32.gif[/img][/url]',
           },
           {
            title : 'Нет таймкодов'  ,
            content:
            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/I][/SIZE][/FONT][/COLOR]<br><br>' +
             "[COLOR=rgb(209, 213, 216)][SIZE=4][FONT=times new roman][I]Ваша жалоба отказана, т.к в ней нету таймкодов. Если видео длится больше 3-ех минут - Вы должны указать таймкоды нарушений.[/FONT][/SIZE]<br><br>" +
             "[FONT=times new roman][SIZE=4][I]Просьба не создавать дубликаты этой темы, иначе ваш форумный аккаунт может быть заблокирован.[/I][/SIZE][/FONT][/COLOR]<br> <br>" +
             "[FONT=times new roman][SIZE=4][COLOR=rgb(209, 213, 216)][I]Приятной игры на BLACK RUSSIA ANAPA [/I][/COLOR][I][COLOR=rgb(0, 140, 240)]Role Play[/COLOR][/SIZE][/FONT][COLOR=rgb(0, 140, 240)][FONT=book antiqua][SIZE=4][I].[/SIZE][/FONT][/COLOR]<br><br>" +
             '[url=https://postimages.org/][img]https://s4.hostingkartinok.com/uploads/images/2013/05/1a612be953e1187f103dc4ae3f1d2b32.gif[/img][/url]',
           },
           {
            title: 'Нарушений нет',
            content:
            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/I][/SIZE][/FONT][/COLOR]<br><br>' +
            "[COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4][I]Нарушений со стороны игрока не было замечено.<br><br>" +
            "Внимательно изучите общие правила серверов - [/I][URL='https://forum.blackrussia.online/index.php?threads/%D0%9E%D0%B1%D1%89%D0%B8%D0%B5-%D0%BF%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%B5%D1%80%D0%B2%D0%B5%D1%80%D0%BE%D0%B2.312571/']*Нажмите сюда*[/URL]<br><br>" +
            "[I]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/I][/SIZE][/FONT][/COLOR]<br><br>" +
            "[FONT=book antiqua][SIZE=4][COLOR=rgb(209, 213, 216)][I]Приятной игры на BLACK RUSSIA ANAPA [/I][/COLOR][I][COLOR=rgb(0, 140, 240)]Role Play[/COLOR][/I][/SIZE][/FONT][COLOR=rgb(0, 140, 240)][FONT=book antiqua][SIZE=4][I].[/I][/SIZE][/FONT][/COLOR]<br><br>" +
            '[url=https://postimages.org/][img]https://s4.hostingkartinok.com/uploads/images/2013/05/1a612be953e1187f103dc4ae3f1d2b32.gif[/img][/url]',
           },
  ];

   $(document).ready(() => {
    // Загрузка скрипта для обработки шаблонов
    $('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');

    // Добавление кнопок при загрузке страницы

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
})();