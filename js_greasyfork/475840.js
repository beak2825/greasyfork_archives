// ==UserScript==
// @name         Кураторы форума
// @namespace    https://forum.blackrussia.online/
// @version      0.1
// @description  Скрипт для Кураторов Форума 
// @author       Vladislav_Sokol
// @match        https://forum.blackrussia.online/threads/*
// @include      https://forum.blackrussia.online/threads/
// @grant        none
// @license      MIT
// @icon https://icons8.com/icon/OU4Yl0pLhXBS/stone-island
// @downloadURL https://update.greasyfork.org/scripts/475840/%D0%9A%D1%83%D1%80%D0%B0%D1%82%D0%BE%D1%80%D1%8B%20%D1%84%D0%BE%D1%80%D1%83%D0%BC%D0%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/475840/%D0%9A%D1%83%D1%80%D0%B0%D1%82%D0%BE%D1%80%D1%8B%20%D1%84%D0%BE%D1%80%D1%83%D0%BC%D0%B0.meta.js
// ==/UserScript==
(function () {
  'use strict';
const UNACCEPT_PREFIX = 4; // Prefix that will be set when thread closes
const ACCEPT_PREFIX = 8; // Prefix that will be set when thread accepted
const PIN_PREFIX = 2; // Prefix that will be set when thread pins
const COMMAND_PREFIX = 10; // Prefix that will be set when thread send to project team
const WATCHED_PREFIX = 9;
const CLOSE_PREFIX = 7; // Prefix that will be set when thread closes.
const TEX_PREFIX = 13;
const GA_PREFIX = 12;
const V_PREFIX = 1;
const buttons = [
    {
    title: '_________________________________RolePlay ситуации________________________________________'
         },
         {
          title: 'одобрено',
          content:
          "[CENTER][COLOR=rgb(0, 255, 215)][FONT=courier new][SIZE=4][I][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/I][/SIZE][/FONT][/COLOR][/CENTER]<br><br>" +
            '[SIZE=4][FONT=courier new][I][COLOR=rgb(0, 255, 169)]Ваша RolePlay - ситуация [COLOR=GREEN]одобрена[/COLOR][/I][/FONT][/SIZE][CENTER]' +
           "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=WHITE]RUSSIA[/COLOR] [COLOR=rgb(14, 245, 150)]OMSK[/COLOR].<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>',
          prefix: ACCEPT_PREFIX,
          status: false,
         },
         {
          title : 'не туда',
          content:
          '[CENTER][COLOR=rgb(0, 255, 215)][FONT=courier new][SIZE=4][I][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/I][/SIZE][/FONT][/COLOR][/CENTER]<br><br>' +
            "[CENTER][SIZE=4][FONT=courier new][I][COLOR=rgb(209, 213, 216)]Ваша RolePlay - ситуация [COLOR=rgb(255, 0, 67)]отказана[/COLOR] т.к вы не туда попали.[/CENTER] [/COLOR]<br><br>" +
            "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=WHITE]RUSSIA[/COLOR] [COLOR=rgb(14, 245, 150)]OMSK[/COLOR].<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>',
          prefix: UNACCEPT_PREFIX,
          status: false,
         },
         {
          title : 'не по форме' ,
          content:
          '[CENTER][COLOR=rgb(0, 255, 215)][FONT=courier new][SIZE=4][I][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE][/I][/SIZE][/FONT][/COLOR][/CENTER]<br><br>' +
            "[CENTER][SIZE=4][FONT=courier new][I][COLOR=rgb(209, 213, 216)]Ваша RolePlay - ситуация [COLOR=rgb(255, 0, 67)]отказана[/COLOR] т.к она составлена не по форме. [/COLOR][/CENTER]<br><br>" +
            "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=WHITE]RUSSIA[/COLOR] [COLOR=rgb(14, 245, 150)]OMSK[/COLOR].<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>',
          prefix: UNACCEPT_PREFIX,
          status: false,
         },
         {
          title : 'отказ' ,
          content:
          '[CENTER][COLOR=rgb(0, 255, 215)][FONT=courier new][SIZE=4][I][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/I][/SIZE][/FONT][/COLOR[/CENTER]br><br>' +
            "[CENTER][SIZE=4][FONT=courier new][I][COLOR=rgb(209, 213, 216)]Ваша RolePlay - ситуация [COLOR=rgb(255, 0, 67)]отказана[/COLOR]. [/COLOR][/CENTER]<br><br>" +
             "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=WHITE]RUSSIA[/COLOR] [COLOR=rgb(14, 245, 150)]OMSK[/COLOR].<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>',
           prefix: UNACCEPT_PREFIX,
             status: false,
         },
         {
          title: 'На доработке',
          content:
          '[CENTER][COLOR=rgb(0, 255, 215)][FONT=courier new][SIZE=4][I][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/I][/SIZE][/FONT][/COLOR][/CENTER]<br><br>' +
            "[CENTER][COLOR=rgb(209, 213, 216)][FONT=courier new][SIZE=4][I]В вашей RolePlay - ситуации недостаточно информации.[/CENTER]<br><br>" +
            "[CENTER]даю вам ровно  24 часа на ее дополнение.[/I][/SIZE][/FONT][/COLOR][/CENTER]<br><br>" +
              "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=WHITE]RUSSIA[/COLOR] [COLOR=rgb(14, 245, 150)]OMSK[/COLOR].<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>',
          prefix: PIN_PREFIX,
          status: true,
         },
         {
          title : 'ник англ' ,
          content:
          '[CENTER][COLOR=rgb(0, 255, 215)][FONT=courier new][SIZE=4][I][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/I][/SIZE][/FONT][/COLOR][/CENTER]<br><br>' +
            "[CENTER][SIZE=4][FONT=courier new][I][COLOR=rgb(209, 213, 216)]Ваша RolePlay - ситуация [COLOR=rgb(255, 0, 67)]отказана[/COLOR] т.к ваш все никнеймы должны быть написаны на русском языке. [/COLOR][/CENTER]<br><br>" +
           	"[CENTER][FONT=TIMES NEW ROMAN] [I][SIZE=3][COLOR=LightSlateGray]  Ознакомиться с правилами создания РП ситуаций [/COLOR][URL='https://forum.blackrussia.online/threads/omsk-%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-role-play-%D1%81%D0%B8%D1%82%D1%83%D0%B0%D1%86%D0%B8%D0%B9.3946501/'][Color=crimson][U]*тут*[/U][/color][/URL][/CENTER]<br><br>" +
              "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=WHITE]RUSSIA[/COLOR] [COLOR=rgb(14, 245, 150)]OMSK[/COLOR].<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>',
          prefix: UNACCEPT_PREFIX,
          status: false,
         },
         {
          title : 'Неграмотная' ,
          content:
          '[CENTER][COLOR=rgb(0, 255, 215)][FONT=courier new][SIZE=4][I][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/I][/SIZE][/FONT][/COLOR]<br><br>' +
            "[CENTER][SIZE=4][FONT=courier new][I][COLOR=rgb(209, 213, 216)]Ваша RolePlay - ситуация [COLOR=rgb(255, 0, 67)]отказана[/COLOR] т.к она оформлена неграмотно. [/COLOR]<br><br>" +
          "[CENTER][FONT=TIMES NEW ROMAN] [I][SIZE=3][COLOR=LightSlateGray]  Ознакомиться с правилами создания РП ситуаций [/COLOR][URL='https://forum.blackrussia.online/threads/omsk-%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-role-play-%D1%81%D0%B8%D1%82%D1%83%D0%B0%D1%86%D0%B8%D0%B9.3946501/'][Color=crimson][U]*тут*[/U][/color][/URL][/CENTER]<br><br>" +
             "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=WHITE]RUSSIA[/COLOR] [COLOR=rgb(14, 245, 150)]OMSK[/COLOR].<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>',
          prefix: UNACCEPT_PREFIX,
          status: false,
         },
         {
          title : 'Копипаст' ,
          content:
          '[CENTER][COLOR=rgb(0, 255, 215)][FONT=courier new][SIZE=4][I][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/I][/SIZE][/FONT][/COLOR]<br><br>' +
            "[CENTER][SIZE=4][FONT=courier new][I][COLOR=rgb(209, 213, 216)]Ваша RolePlay - ситуация [COLOR=rgb(255, 0, 67)]отказана[/COLOR] т.к вы ее скопировали у другого человека. [/COLOR]<br><br>" +
          "[CENTER][FONT=TIMES NEW ROMAN] [I][SIZE=3][COLOR=LightSlateGray]  Ознакомиться с правилами создания РП ситуаций [/COLOR][URL='https://forum.blackrussia.online/threads/omsk-%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-role-play-%D1%81%D0%B8%D1%82%D1%83%D0%B0%D1%86%D0%B8%D0%B9.3946501/'][Color=crimson][U]*тут*[/U][/color][/URL][/CENTER]<br><br>" +
             "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=WHITE]RUSSIA[/COLOR] [COLOR=rgb(14, 245, 150)]OMSK[/COLOR].<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>',
          prefix: UNACCEPT_PREFIX,
          status: false,
         },
         {
          title : 'Не дополнил' ,
          content:
          '[CENTER][COLOR=rgb(0, 255, 215)][FONT=courier new][SIZE=4][I][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/I][/SIZE][/FONT][/COLOR]<br><br>' +
            "[CENTER][SIZE=4][FONT=courier new][I][COLOR=rgb(209, 213, 216)]Ваша RolePlay - ситуация [COLOR=rgb(255, 0, 67)]отказана[/COLOR] т.к вы ее не дополнили. [/COLOR]<br><br>" +
          "[CENTER][FONT=TIMES NEW ROMAN] [I][SIZE=3][COLOR=LightSlateGray]  Ознакомиться с правилами создания РП ситуаций [/COLOR][URL='https://forum.blackrussia.online/threads/omsk-%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-role-play-%D1%81%D0%B8%D1%82%D1%83%D0%B0%D1%86%D0%B8%D0%B9.3946501/'][Color=crimson][U]*тут*[/U][/color][/URL][/CENTER]<br><br>" +
              "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=WHITE]RUSSIA[/COLOR] [COLOR=rgb(14, 245, 150)]OMSK[/COLOR].<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>',
          prefix: UNACCEPT_PREFIX,
          status: false,
         },
         {
          title : 'Заголовок не по форме' ,
          content:
          '[CENTER][COLOR=rgb(0, 255, 215)][FONT=courier new][SIZE=4][I][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/I][/SIZE][/FONT][/COLOR]<br><br>' +
            "[CENTER][SIZE=4][FONT=courier new][I][COLOR=rgb(209, 213, 216)]Ваша RolePlay - ситуация [COLOR=rgb(255, 0, 67)]отказана[/COLOR] т.к заголовок оформлен неправильно. [/COLOR]<br><br>" +
          "[CENTER][FONT=TIMES NEW ROMAN] [I][SIZE=3][COLOR=LightSlateGray]  Ознакомиться с правилами создания РП ситуаций [/COLOR][URL='https://forum.blackrussia.online/threads/omsk-%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-role-play-%D1%81%D0%B8%D1%82%D1%83%D0%B0%D1%86%D0%B8%D0%B9.3946501/'][Color=crimson][U]*тут*[/U][/color][/URL][/CENTER]<br><br>" +
              "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=WHITE]RUSSIA[/COLOR] [COLOR=rgb(14, 245, 150)]OMSK[/COLOR].<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>',
          prefix: UNACCEPT_PREFIX,
          status: false,
         },
    {
        title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴биографии ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
  title: 'био одобрено',
      content:
		'[Color=rgb(202, 0, 255)][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/FONT][/CENTER]<br>' +
        "[CENTER][Color=rgb(0, 255, 184)][FONT=courier new]Ваша РП биография получает статус - [Color=rgb(3, 255, 0)]Одобрено[/color]. [/COLOR][/FONT][/CENTER] <br>"+
             "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=WHITE]RUSSIA[/COLOR] [COLOR=rgb(14, 245, 150)]OMSK[/COLOR].<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>',
        prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: ' на доработке',
      content:
		'[Color=rgb(255, 0, 132)][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/FONT][/CENTER]<br>' +
        "[CENTER][Color=rgb(0, 255, 184)][FONT=courier new]Вам даётся 24 часа на дополнение вашей РП биографии, в противном случае она получит статус - [Color=#DC143C]Отказано[/color]. [/COLOR][/FONT][/CENTER] <br>"+
         "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=WHITE]RUSSIA[/COLOR] [COLOR=rgb(14, 245, 150)]OMSK[/COLOR].<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>',
      prefix: PIN_PREFIX,
    },


        {
           title: ' отказ (3е лицо)',
      content:
		'[Color=#DC143C][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/FONT][/CENTER]<br>' +
        "[CENTER][Color=rgb(0, 255, 184)][FONT=courier new]Ваша РП биография получает статус - [Color=#DC143C]Отказано[/color].<br>Причиной отказа могло послужить создание биографии от 3го лица.[/COLOR][/FONT][/CENTER] <br>" +
        "[CENTER][FONT=TIMES NEW ROMAN] [I][SIZE=3][COLOR=LightSlateGray]  Ознакомиться с правилами создания РП Биографий [/COLOR][URL='https://forum.blackrussia.online/threads/omsk-%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%BE%D0%B7%D0%B4%D0%B0%D0%BD%D0%B8%D1%8F-%D0%B8-%D1%84%D0%BE%D1%80%D0%BC%D0%B0-role-play-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8.3946367/'][Color=crimson][U]*тут*[/U][/color][/URL][/CENTER]<br><br>" +
             "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=WHITE]RUSSIA[/COLOR] [COLOR=rgb(14, 245, 150)]OMSK[/COLOR].<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>',

      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
           title: ' отказ (заголовок темы)',
      content:
		'[Color=#DC143C][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/FONT][/CENTER]<br>' +
        "[CENTER][Color=rgb(0, 255, 184)][FONT=courier new]Ваша РП биография получает статус - [Color=#DC143C]Отказано[/color].<br>Причиной отказа могло послужить неправильное заполнение заголовка темы.[/COLOR][/FONT][/CENTER] <br>"+
        "[CENTER][FONT=TIMES NEW ROMAN] [I][SIZE=3][COLOR=LightSlateGray]  Ознакомиться с правилами создания РП Биографий [/COLOR][URL='https://forum.blackrussia.online/threads/omsk-%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%BE%D0%B7%D0%B4%D0%B0%D0%BD%D0%B8%D1%8F-%D0%B8-%D1%84%D0%BE%D1%80%D0%BC%D0%B0-role-play-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8.3946367/'][Color=crimson][U]*тут*[/U][/color][/URL][/CENTER]<br><br>" +
             "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=WHITE]RUSSIA[/COLOR] [COLOR=rgb(14, 245, 150)]OMSK[/COLOR].<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: ' отказ(плагиат)',
      content:
		'[Color=#DC143C][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/FONT][/CENTER]<br>' +
        "[CENTER][Color=rgb(0, 255, 184)][FONT=courier new]Ваша РП биография получает статус - [Color=#DC143C]Отказано[/color].<br>Причиной отказа послужило - Плагиат. [/COLOR][/FONT][/CENTER] <br>"+
        "[CENTER][FONT=TIMES NEW ROMAN] [I][SIZE=3][COLOR=LightSlateGray]  Ознакомиться с правилами создания РП Биографий [/COLOR][URL='https://forum.blackrussia.online/threads/omsk-%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%BE%D0%B7%D0%B4%D0%B0%D0%BD%D0%B8%D1%8F-%D0%B8-%D1%84%D0%BE%D1%80%D0%BC%D0%B0-role-play-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8.3946367/'][Color=crimson][U]*тут*[/U][/color][/URL][/CENTER]<br><br>" +
             "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=WHITE]RUSSIA[/COLOR] [COLOR=rgb(14, 245, 150)]OMSK[/COLOR].<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: ' отказ(не дополнил)',
      content:
		'[Color=#DC143C][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/FONT][/CENTER]<br>' +
        "[CENTER][Color=rgb(0, 255, 184)][FONT=courier new]Ваша РП биография получает статус - [Color=#DC143C]Отказано[/color].<br>Причиной отказа послужило - Не дополнили биографию в течение 24-х часов. [/COLOR][/FONT][/CENTER] <br>"+
        "[CENTER][FONT=TIMES NEW ROMAN] [I][SIZE=3][COLOR=LightSlateGray]  Ознакомиться с правилами создания РП Биографий [/COLOR][URL='https://forum.blackrussia.online/threads/omsk-%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%BE%D0%B7%D0%B4%D0%B0%D0%BD%D0%B8%D1%8F-%D0%B8-%D1%84%D0%BE%D1%80%D0%BC%D0%B0-role-play-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8.3946367/'][Color=crimson][U]*тут*[/U][/color][/URL][/CENTER]<br><br>" +
             "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=WHITE]RUSSIA[/COLOR] [COLOR=rgb(14, 245, 150)]OMSK[/COLOR].<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: ' отказ (не совпадает возвраст)',
      content:
		'[Color=#DC143C][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/FONT][/CENTER]<br>' +
        "[CENTER][Color=rgb(0, 255, 184)][FONT=courier new]Ваша РП биография получает статус - [Color=#DC143C]Отказано[/color].<br>Возвраст персонажа и дата рождения не совпадают.[/COLOR][/FONT][/CENTER] <br>"+
        "[CENTER][FONT=TIMES NEW ROMAN] [I][SIZE=3][COLOR=LightSlateGray]  Ознакомиться с правилами создания РП Биографий [/COLOR][URL='https://forum.blackrussia.online/threads/omsk-%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%BE%D0%B7%D0%B4%D0%B0%D0%BD%D0%B8%D1%8F-%D0%B8-%D1%84%D0%BE%D1%80%D0%BC%D0%B0-role-play-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8.3946367/'][Color=crimson][U]*тут*[/U][/color][/URL][/CENTER]<br><br>" +
             "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=WHITE]RUSSIA[/COLOR] [COLOR=rgb(14, 245, 150)]OMSK[/COLOR].<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: ' отказ (мало инфы)',
      content:
		'[Color=#DC143C][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/FONT][/CENTER]<br>' +
        "[CENTER][Color=rgb(0, 255, 184)][FONT=courier new]Ваша РП биография получает статус - [Color=#DC143C]Отказано[/color].<br>В вашей Биографии мало информации.[/COLOR][/FONT][/CENTER] <br>"+
        "[CENTER][FONT=TIMES NEW ROMAN] [I][SIZE=3][COLOR=LightSlateGray]  Ознакомиться с правилами создания РП Биографий [/COLOR][URL='https://forum.blackrussia.online/threads/omsk-%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%BE%D0%B7%D0%B4%D0%B0%D0%BD%D0%B8%D1%8F-%D0%B8-%D1%84%D0%BE%D1%80%D0%BC%D0%B0-role-play-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8.3946367/'][Color=crimson][U]*тут*[/U][/color][/URL][/CENTER]<br><br>" +
             "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=WHITE]RUSSIA[/COLOR] [COLOR=rgb(14, 245, 150)]OMSK[/COLOR].<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
     {
      title: ' отказ (меньше 18)',
      content:
		'[Color=#DC143C][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/FONT][/CENTER]<br>' +
        "[CENTER][Color=rgb(0, 255, 184)][FONT=courier new]Ваша РП биография получает статус - [Color=#DC143C]Отказано[/color].<br>Вашему персонажу меньше 18-ти лет.[/COLOR][/FONT][/CENTER] <br>"+
         "[CENTER][FONT=TIMES NEW ROMAN] [I][SIZE=3][COLOR=LightSlateGray]  Ознакомиться с правилами создания РП Биографий [/COLOR][URL='https://forum.blackrussia.online/threads/omsk-%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%BE%D0%B7%D0%B4%D0%B0%D0%BD%D0%B8%D1%8F-%D0%B8-%D1%84%D0%BE%D1%80%D0%BC%D0%B0-role-play-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8.3946367/'][Color=crimson][U]*тут*[/U][/color][/URL][/CENTER]<br><br>" +
             "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=WHITE]RUSSIA[/COLOR] [COLOR=rgb(14, 245, 150)]OMSK[/COLOR].<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
     {
      title: '  (нету даты рождения)',
      content:
		'[Color=#DC143C][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/FONT][/CENTER]<br>' +
        "[CENTER][Color=rgb(0, 255, 184)][FONT=courier new]Ваша РП биография получает статус - [Color=#DC143C]Отказано[/color].<br>В вашей Биографии не указана Дата рождения.[/COLOR][/FONT][/CENTER] <br>"+
         "[CENTER][FONT=TIMES NEW ROMAN] [I][SIZE=3][COLOR=LightSlateGray]  Ознакомиться с правилами создания РП Биографий [/COLOR][URL='https://forum.blackrussia.online/threads/omsk-%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%BE%D0%B7%D0%B4%D0%B0%D0%BD%D0%B8%D1%8F-%D0%B8-%D1%84%D0%BE%D1%80%D0%BC%D0%B0-role-play-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8.3946367/'][Color=crimson][U]*тут*[/U][/color][/URL][/CENTER]<br><br>" +
             "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=WHITE]RUSSIA[/COLOR] [COLOR=rgb(14, 245, 150)]OMSK[/COLOR].<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
     {
      title: '  (нет места рождения)',
      content:
		'[Color=#DC143C][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/FONT][/CENTER]<br>' +
        "[CENTER][Color=rgb(0, 255, 184)][FONT=courier new]Ваша РП биография получает статус - [Color=#DC143C]Отказано[/color].<br>В вашей Биографии не указано место рождения'.[/COLOR][/FONT][/CENTER] <br>"+
         "[CENTER][FONT=TIMES NEW ROMAN] [I][SIZE=3][COLOR=LightSlateGray]  Ознакомиться с правилами создания РП Биографий [/COLOR][URL='https://forum.blackrussia.online/threads/omsk-%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%BE%D0%B7%D0%B4%D0%B0%D0%BD%D0%B8%D1%8F-%D0%B8-%D1%84%D0%BE%D1%80%D0%BC%D0%B0-role-play-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8.3946367/'][Color=crimson][U]*тут*[/U][/color][/URL][/CENTER]<br><br>" +
             "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=WHITE]RUSSIA[/COLOR] [COLOR=rgb(14, 245, 150)]OMSK[/COLOR].<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
     {
      title: ' (ник на разных языках)',
      content:
		'[Color=#DC143C][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/FONT][/CENTER]<br>' +
        "[CENTER][Color=rgb(0, 255, 184)][FONT=courier new]Ваша РП биография получает статус - [Color=#DC143C]Отказано[/color].<br>В названии биографии и в самой биографии Имя Фамилия указаны на разных языках.[/COLOR][/FONT][/CENTER] <br>"+
         "[CENTER][FONT=TIMES NEW ROMAN] [I][SIZE=3][COLOR=LightSlateGray]  Ознакомиться с правилами создания РП Биографий [/COLOR][URL='https://forum.blackrussia.online/threads/omsk-%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%BE%D0%B7%D0%B4%D0%B0%D0%BD%D0%B8%D1%8F-%D0%B8-%D1%84%D0%BE%D1%80%D0%BC%D0%B0-role-play-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8.3946367/'][Color=crimson][U]*тут*[/U][/color][/URL][/CENTER]<br><br>" +
             "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=WHITE]RUSSIA[/COLOR] [COLOR=rgb(14, 245, 150)]OMSK[/COLOR].<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Ник с нижнем подчеркиванием',
      content:
        '[Color=#DC143C][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/FONT][/CENTER]<br>' +
        "[CENTER][Color=rgb(0, 255, 184)][FONT=courier new]Ваша РП биография получает статус - [Color=#DC143C]Отказано[/color].<br>В нике присуствует нижнее подчеркивание.[/COLOR][/FONT][/CENTER] <br>"+
        "[CENTER][FONT=TIMES NEW ROMAN] [I][SIZE=3][COLOR=LightSlateGray]  Ознакомиться с правилами создания РП Биографий [/COLOR][URL='https://forum.blackrussia.online/threads/omsk-%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%BE%D0%B7%D0%B4%D0%B0%D0%BD%D0%B8%D1%8F-%D0%B8-%D1%84%D0%BE%D1%80%D0%BC%D0%B0-role-play-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8.3946367/'][Color=crimson][U]*тут*[/U][/color][/URL][/CENTER]<br><br>" +
             "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=WHITE]RUSSIA[/COLOR] [COLOR=rgb(14, 245, 150)]OMSK[/COLOR].<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'нет пункта настоящее время',
      content:
		'[Color=#DC143C][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/FONT][/CENTER]<br>' +
        "[CENTER][Color=rgb(0, 255, 184)][FONT=courier new]Ваша РП биография получает статус - [Color=#DC143C]Отказано[/color].<br>Нету пункта 'Настоящее время'.[/COLOR][/FONT][/CENTER] <br>"+
        "[CENTER][FONT=TIMES NEW ROMAN] [I][SIZE=3][COLOR=LightSlateGray]  Ознакомиться с правилами создания РП Биографий [/COLOR][URL='https://forum.blackrussia.online/threads/omsk-%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%BE%D0%B7%D0%B4%D0%B0%D0%BD%D0%B8%D1%8F-%D0%B8-%D1%84%D0%BE%D1%80%D0%BC%D0%B0-role-play-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8.3946367/'][Color=crimson][U]*тут*[/U][/color][/URL][/CENTER]<br><br>" +
             "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=WHITE]RUSSIA[/COLOR] [COLOR=rgb(14, 245, 150)]OMSK[/COLOR].<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'нет пункта юность и взрослая жизнь',
      content:
		'[Color=#DC143C][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/FONT][/CENTER]<br>' +
        "[CENTER][Color=rgb(0, 255, 184)][FONT=courier new]Ваша РП биография получает статус - [Color=#DC143C]Отказано[/color].<br>Нету пункта 'Юность и взрослая жизнь'.[/COLOR][/FONT][/CENTER] <br>"+
        "[CENTER][FONT=TIMES NEW ROMAN] [I][SIZE=3][COLOR=LightSlateGray]  Ознакомиться с правилами создания РП Биографий [/COLOR][URL='https://forum.blackrussia.online/threads/omsk-%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%BE%D0%B7%D0%B4%D0%B0%D0%BD%D0%B8%D1%8F-%D0%B8-%D1%84%D0%BE%D1%80%D0%BC%D0%B0-role-play-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8.3946367/'][Color=crimson][U]*тут*[/U][/color][/URL][/CENTER]<br><br>" +
             "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=WHITE]RUSSIA[/COLOR] [COLOR=rgb(14, 245, 150)]OMSK[/COLOR].<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'нет пункта детство',
      content:
		'[Color=#DC143C][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/FONT][/CENTER]<br>' +
        "[CENTER][Color=rgb(0, 255, 184)][FONT=courier new]Ваша РП биография получает статус - [Color=#DC143C]Отказано[/color].<br>Нету пункта 'Детство'.[/COLOR][/FONT][/CENTER] <br>"+
        "[CENTER][FONT=TIMES NEW ROMAN] [I][SIZE=3][COLOR=LightSlateGray]  Ознакомиться с правилами создания РП Биографий [/COLOR][URL='https://forum.blackrussia.online/threads/omsk-%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%BE%D0%B7%D0%B4%D0%B0%D0%BD%D0%B8%D1%8F-%D0%B8-%D1%84%D0%BE%D1%80%D0%BC%D0%B0-role-play-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8.3946367/'][Color=crimson][U]*тут*[/U][/color][/URL][/CENTER]<br><br>" +
             "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=WHITE]RUSSIA[/COLOR] [COLOR=rgb(14, 245, 150)]OMSK[/COLOR].<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
     {
      title: 'нет пункта хобби',
      content:
		'[Color=#DC143C][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/FONT][/CENTER]<br>' +
         "[CENTER][Color=rgb(0, 255, 184)][FONT=courier new]Ваша РП биография получает статус - [Color=#DC143C]Отказано[/color].<br>Нету пункта 'Хобби'.[/COLOR][/FONT][/CENTER] <br>"+
         "[CENTER][FONT=TIMES NEW ROMAN] [I][SIZE=3][COLOR=LightSlateGray]  Ознакомиться с правилами создания РП Биографий [/COLOR][URL='https://forum.blackrussia.online/threads/omsk-%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%BE%D0%B7%D0%B4%D0%B0%D0%BD%D0%B8%D1%8F-%D0%B8-%D1%84%D0%BE%D1%80%D0%BC%D0%B0-role-play-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8.3946367/'][Color=crimson][U]*тут*[/U][/color][/URL][/CENTER]<br><br>" +
             "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=WHITE]RUSSIA[/COLOR] [COLOR=rgb(14, 245, 150)]OMSK[/COLOR].<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: ' отказ (не по форме)',
      content:
		'[Color=#DC143C][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/FONT][/CENTER]<br>' +
        "[CENTER][Color=rgb(0, 255, 184)][FONT=courier new]РП биография получает статус - [Color=#DC143C]Отказано[/color].<br>Биография не по форме.[/COLOR][/FONT][/CENTER] <br>" +
        "[CENTER][FONT=TIMES NEW ROMAN] [I][SIZE=3][COLOR=LightSlateGray]  Ознакомиться с правилами создания РП Биографий [/COLOR][URL='https://forum.blackrussia.online/threads/omsk-%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%BE%D0%B7%D0%B4%D0%B0%D0%BD%D0%B8%D1%8F-%D0%B8-%D1%84%D0%BE%D1%80%D0%BC%D0%B0-role-play-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8.3946367/'][Color=crimson][U]*тут*[/U][/color][/URL][/CENTER]<br><br>" +
             "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=WHITE]RUSSIA[/COLOR] [COLOR=rgb(14, 245, 150)]OMSK[/COLOR].<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>',
      prefix:UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: ' отказ (в нике нижнее подчеркивание)',
      content:
		'[Color=#DC143C][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/FONT][/CENTER]<br>' +
        "[CENTER][Color=rgb(0, 255, 184)][FONT=courier new]Ваша РП биография получает статус - [Color=#DC143C]Отказано[/color].<br>В названии биографии или в самой биографии Имя Фамилия указаны с нижним подчеркиванием.[/COLOR][/FONT][/CENTER] <br>" +
  "[CENTER][FONT=TIMES NEW ROMAN] [I][SIZE=3][COLOR=LightSlateGray]  Ознакомиться с правилами создания РП Биографий [/COLOR][URL='https://forum.blackrussia.online/threads/omsk-%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%BE%D0%B7%D0%B4%D0%B0%D0%BD%D0%B8%D1%8F-%D0%B8-%D1%84%D0%BE%D1%80%D0%BC%D0%B0-role-play-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8.3946367/'][Color=crimson][U]*тут*[/U][/color][/URL][/CENTER]<br><br>" +
             "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=WHITE]RUSSIA[/COLOR] [COLOR=rgb(14, 245, 150)]OMSK[/COLOR].<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>',
        prefix: UNACCEPT_PREFIX,
	  status: false,

    },
    {
  title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴Неофициальные RP организации ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
      title: 'неоф орг одобрена',
      content:
		'[Color=rgb(122, 0, 255)][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/FONT][/CENTER]<br>' +
        "[CENTER][Color=rgb(255, 0, 197)][FONT=courier new]Ваша Неофициальная RP организация получает статус - [Color=rgb(48, 227, 54)]Одобрено[/color][/COLOR][/FONT][/CENTER] <br>"+
          "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=WHITE]RUSSIA[/COLOR] [COLOR=rgb(14, 245, 150)]OMSK[/COLOR].<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'неоф орг отказ(не тот сервер)',
      content:
		'[Color=#DC143C][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/FONT][/CENTER]<br>' +
        "[CENTER][Color=rgb(122, 0, 255)][FONT=courier new]Вы ошиблись разделом. Напишите в тот раздел который вам нужен! - [Color=#DC143C]Отказано[/color][/COLOR][/FONT][/CENTER] <br>"+
        "[CENTER][FONT=TIMES NEW ROMAN] [I][SIZE=3][COLOR=LightSlateGray]  Ознакомиться с правилами создания Неофициальных RP организаций [/COLOR][URL='https://forum.blackrussia.online/threads/omsk-%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%BE%D0%B7%D0%B4%D0%B0%D0%BD%D0%B8%D1%8F-%D0%BD%D0%B5%D0%BE%D1%84%D0%B8%D1%86%D0%B8%D0%B0%D0%BB%D1%8C%D0%BD%D0%BE%D0%B9-roleplay-%D0%BE%D1%80%D0%B3%D0%B0%D0%BD%D0%B8%D0%B7%D0%B0%D1%86%D0%B8%D0%B8.3946634/'][Color=crimson][U]*тут*[/U][/color][/URL][/CENTER]<br><br>" +
             "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=WHITE]RUSSIA[/COLOR] [COLOR=rgb(14, 245, 150)]OMSK[/COLOR].<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'неоф орг на доработке',
      content:
		'[Color=#DC143C][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/FONT][/CENTER]<br>' +
       "[CENTER][Color=rgb(122, 0, 255)][FONT=courier new]Вам даётся 24 часа на дополнение вашей Неофициальной RP организации, в противном случае она получит статус - [Color=#DC143C]Отказано[/color][/COLOR][/FONT][/CENTER] <br>"+
             "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=WHITE]RUSSIA[/COLOR] [COLOR=rgb(14, 245, 150)]OMSK[/COLOR].<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>',
      prefix: PIN_PREFIX,
    },
    {
      title: 'неоф орг отказ',
      content:
		'[Color=#DC143C][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/FONT][/CENTER]<br>' +
        "[CENTER][Color=rgb(122, 0, 255)][FONT=courier new]Ваша Неофициальная RP организация получает статус - [Color=#DC143C]Отказано[/color][/COLOR][/FONT][/CENTER] <br>"+
          "[CENTER][FONT=TIMES NEW ROMAN] [I][SIZE=3][COLOR=LightSlateGray]  Ознакомиться с правилами создания Неофициальных RP организаций [/COLOR][URL='https://forum.blackrussia.online/threads/omsk-%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%BE%D0%B7%D0%B4%D0%B0%D0%BD%D0%B8%D1%8F-%D0%BD%D0%B5%D0%BE%D1%84%D0%B8%D1%86%D0%B8%D0%B0%D0%BB%D1%8C%D0%BD%D0%BE%D0%B9-roleplay-%D0%BE%D1%80%D0%B3%D0%B0%D0%BD%D0%B8%D0%B7%D0%B0%D1%86%D0%B8%D0%B8.3946634/'][Color=crimson][U]*тут*[/U][/color][/URL][/CENTER]<br><br>" +
             "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=WHITE]RUSSIA[/COLOR] [COLOR=rgb(14, 245, 150)]OMSK[/COLOR].<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>',
      prefix: UNACCEPT_PREFIX,
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },

];


  $(document).ready(() => {
    // Загрузка скрипта для обработки шаблонов
    $('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');

    // Добавление кнопок при загрузке страницы
    addButton('Закрыто', 'close');
    addButton('На рассмотрение', 'pin');
    addButton('Одобрено', 'accepted');
    addButton('Отказано', 'unaccept');
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

    function editThreadData(prefix, pin = false) {
// 
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
// 
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