// ==UserScript==
// @name         Форумный скрипт
// @namespace    https://forum.blackrussia.online
// @version      1.4
// @description  Для кураторов форума;) | By. B.dlades
// @author       Maksim Marihyanin
// @match        https://forum.blackrussia.online/threads/*
// @include      https://forum.blackrussia.online/threads/
// @grant        none
// @license      MIT
// @icon
// @downloadURL
// @updateURL
// @downloadURL https://update.greasyfork.org/scripts/485252/%D0%A4%D0%BE%D1%80%D1%83%D0%BC%D0%BD%D1%8B%D0%B9%20%D1%81%D0%BA%D1%80%D0%B8%D0%BF%D1%82.user.js
// @updateURL https://update.greasyfork.org/scripts/485252/%D0%A4%D0%BE%D1%80%D1%83%D0%BC%D0%BD%D1%8B%D0%B9%20%D1%81%D0%BA%D1%80%D0%B8%D0%BF%D1%82.meta.js
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
const TEX_PREFIX = 13;
const GA_PREFIX = 12;
const V_PREFIX = 1;
const buttons = [
      {
      title: 'Ручной шаблон',
      content:
        '[SIZE=4][COLOR=rgb(255, 51, 102)][I][FONT=times new roman]{{ greeting }}, уважаемый {{ user.mention }}.[/FONT][/I][/COLOR][/SIZE]',
      },
      {



      title: 'RP биографии:',
    },
    {
      title: 'Одобрена',
      content:
        '[IMG]https://i.postimg.cc/gkK7Mw0C/5-20240113081629.png[/IMG]' +
        '[CENTER][COLOR=rgb(255, 51, 102)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>[/CENTER]' +
        "[CENTER][SIZE=4][FONT=times new roman][I][COLOR=rgb(209, 213, 216)]Ваша RolePlay - биография[/COLOR][/I][/FONT][COLOR=rgb(51, 255, 0)[FONT=times new roman][I] одобрена.[/I][/COLOR][/FONT][/SIZE][/CENTER] <br><br>" +
        '[CENTER][FONT=book antiqua][SIZE=4][COLOR=rgb(209, 213, 216)][I]Приятной игры на BLACK RUSSIA [/I][/COLOR][I][COLOR=rgb(0, 255, 255)]OREL[/COLOR][/I][/SIZE][/FONT][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4][I].[/I][/SIZE][/FONT][/COLOR][/CENTER]',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: 'Детство',
      content:
        '[IMG]https://i.postimg.cc/gkK7Mw0C/5-20240113081629.png[/IMG]' +
        '[CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/CENTER]<br><br>' +
        "[CENTER][I][FONT=times new roman]Ваша RolePlay биография[/FONT][/I] [FONT=tahoma][I][COLOR=rgb(255, 0, 51)]Отказана[/COLOR]![/I][/FONT][/CENTER]<br><br>" +
        '[CENTER][COLOR=rgb(255, 0, 102)]Причина[/COLOR]: [I][FONT=times new roman]Мало информации в пункте:[/FONT][/I] [COLOR=rgb(102, 255, 255)]Детство[/COLOR][/CENTER] <br></br>' +
          "[CENTER][I][FONT=times new roman]Прошу вас, ещё раз [U]прочитать[/U] правила Создания [COLOR=rgb(0, 255, 0)]Role[/COLOR][COLOR=rgb(255, 255, 0)]Play[/COLOR] - [COLOR=rgb(255, 51, 255)]Биографий[/COLOR] в теме закреплённой сверху![/FONT][/I][/CENTER]<br><br>" +
        '[CENTER][FONT=book antiqua][SIZE=4][COLOR=rgb(209, 213, 216)][I]Приятной игры на сервере [/I][/COLOR][I][COLOR=rgb(255, 255, 0)]OREL[/COLOR][/I][/SIZE][/FONT][/CENTER][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4][I].[/I][/SIZE][/FONT][/COLOR]',
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
      title : 'Заголовок не по форме'  ,
    content:
        '[IMG]https://i.postimg.cc/gkK7Mw0C/5-20240113081629.png[/IMG]' +
        '[CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/CENTER]<br><br>' +
        "[CENTER][I][FONT=times new roman]Ваша RolePlay биография[/FONT][/I] [FONT=tahoma][I][COLOR=rgb(255, 0, 51)]Отказана[/COLOR]![/I][/FONT][/CENTER]<br><br>" +
        '[CENTER][COLOR=rgb(255, 0, 102)]Причина[/COLOR]: [I][FONT=times new roman]Заголовок составлен не по форме.[/FONT][/I][/CENTER] <br></br>' +
          "[CENTER][I][FONT=times new roman]Прошу вас, ещё раз [U]прочитать[/U] правила Создания [COLOR=rgb(0, 255, 0)]Role[/COLOR][COLOR=rgb(255, 255, 0)]Play[/COLOR] - [COLOR=rgb(255, 51, 255)]Биографий[/COLOR] в теме закреплённой сверху![/FONT][/I][/CENTER]<br><br>" +
        '[CENTER][FONT=book antiqua][SIZE=4][COLOR=rgb(209, 213, 216)][I]Приятной игры на сервере [/I][/COLOR][I][COLOR=rgb(255, 255, 0)]OREL[/COLOR][/I][/SIZE][/FONT][/CENTER][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4][I].[/I][/SIZE][/FONT][/COLOR]',
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
      title : 'Не по шаблону'  ,
    content:
        '[IMG]https://i.postimg.cc/gkK7Mw0C/5-20240113081629.png[/IMG]' +
        '[CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/CENTER]<br><br>' +
        "[CENTER][I][FONT=times new roman]Ваша RolePlay биография[/FONT][/I] [FONT=tahoma][I][COLOR=rgb(255, 0, 51)]Отказана[/COLOR]![/I][/FONT][/CENTER]<br><br>" +
        '[CENTER][COLOR=rgb(255, 0, 102)]Причина[/COLOR]: [I][FONT=times new roman]RolePlay Биография составлена не по шаблону, который указан в закрепленной теме.[/FONT][/I][/CENTER] <br></br>' +
          "[CENTER][I][FONT=times new roman]Прошу вас, ещё раз [U]прочитать[/U] правила Создания [COLOR=rgb(0, 255, 0)]Role[/COLOR][COLOR=rgb(255, 255, 0)]Play[/COLOR] - [COLOR=rgb(255, 51, 255)]Биографий[/COLOR] в теме закреплённой сверху![/FONT][/I][/CENTER]<br><br>" +
        '[CENTER][FONT=book antiqua][SIZE=4][COLOR=rgb(209, 213, 216)][I]Приятной игры на сервере [/I][/COLOR][I][COLOR=rgb(255, 255, 0)]OREL[/COLOR][/I][/SIZE][/FONT][/CENTER][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4][I].[/I][/SIZE][/FONT][/COLOR]',
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
      title : 'Юная и Взрослая жизнь'  ,
    content:
        '[IMG]https://i.postimg.cc/gkK7Mw0C/5-20240113081629.png[/IMG]' +
        '[CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/CENTER]<br><br>' +
        "[CENTER][I][FONT=times new roman]Ваша RolePlay биография[/FONT][/I] [FONT=tahoma][I][COLOR=rgb(255, 0, 51)]Отказана[/COLOR]![/I][/FONT][/CENTER]<br><br>" +
        '[CENTER][COLOR=rgb(255, 0, 102)]Причина[/COLOR]: [I][FONT=times new roman]Мало информации в пункте:[/FONT][/I] [COLOR=rgb(102, 255, 255)]Юная и Взрослая жизнь.[/COLOR][/CENTER] <br></br>' +
          "[CENTER][I][FONT=times new roman]Прошу вас, ещё раз [U]прочитать[/U] правила Создания [COLOR=rgb(0, 255, 0)]Role[/COLOR][COLOR=rgb(255, 255, 0)]Play[/COLOR] - [COLOR=rgb(255, 51, 255)]Биографий[/COLOR] в теме закреплённой сверху![/FONT][/I][/CENTER]<br><br>" +
        '[CENTER][FONT=book antiqua][SIZE=4][COLOR=rgb(209, 213, 216)][I]Приятной игры на сервере [/I][/COLOR][I][COLOR=rgb(255, 255, 0)]OREL[/COLOR][/I][/SIZE][/FONT][/CENTER][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4][I].[/I][/SIZE][/FONT][/COLOR]',
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
      title : 'Неграмотная'  ,
     content:
        '[IMG]https://i.postimg.cc/gkK7Mw0C/5-20240113081629.png[/IMG]' +
        '[CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/CENTER]<br><br>' +
        "[CENTER][I][FONT=times new roman]Ваша RolePlay биография[/FONT][/I] [FONT=tahoma][I][COLOR=rgb(255, 0, 51)]Отказана[/COLOR]![/I][/FONT][/CENTER]<br><br>" +
        '[CENTER][COLOR=rgb(255, 0, 102)]Причина[/COLOR]: [I][FONT=times new roman]Ваша RolePlay Биография составлена неграмотно, просмотрите написанный текст вами и исправьте ошибки.  [/FONT][/I][/CENTER] <br></br>' +
          "[CENTER][I][FONT=times new roman]Прошу вас, ещё раз [U]прочитать[/U] правила Создания [COLOR=rgb(0, 255, 0)]Role[/COLOR][COLOR=rgb(255, 255, 0)]Play[/COLOR] - [COLOR=rgb(255, 51, 255)]Биографий[/COLOR] в теме закреплённой сверху![/FONT][/I][/CENTER]<br><br>" +
        '[CENTER][FONT=book antiqua][SIZE=4][COLOR=rgb(209, 213, 216)][I]Приятной игры на сервере [/I][/COLOR][I][COLOR=rgb(255, 255, 0)]OREL[/COLOR][/I][/SIZE][/FONT][/CENTER][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4][I].[/I][/SIZE][/FONT][/COLOR]',
       prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
      title : 'От 3-его лица'  ,
    content:
        '[IMG]https://i.postimg.cc/gkK7Mw0C/5-20240113081629.png[/IMG]' +
        '[CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/CENTER]<br><br>' +
        "[CENTER][I][FONT=times new roman]Ваша RolePlay биография[/FONT][/I] [FONT=tahoma][I][COLOR=rgb(255, 0, 51)]Отказана[/COLOR]![/I][/FONT][/CENTER]<br><br>" +
        '[CENTER][COLOR=rgb(255, 0, 102)]Причина[/COLOR]: [I][FONT=times new roman]Ваша RolePlay Биография составлена с описанием от 3-го лица.[/FONT][/I][/CENTER] <br></br>' +
          "[CENTER][I][FONT=times new roman]Прошу вас, ещё раз [U]прочитать[/U] правила Создания [COLOR=rgb(0, 255, 0)]Role[/COLOR][COLOR=rgb(255, 255, 0)]Play[/COLOR] - [COLOR=rgb(255, 51, 255)]Биографий[/COLOR] в теме закреплённой сверху![/FONT][/I][/CENTER]<br><br>" +
        '[CENTER][FONT=book antiqua][SIZE=4][COLOR=rgb(209, 213, 216)][I]Приятной игры на сервере [/I][/COLOR][I][COLOR=rgb(255, 255, 0)]OREL[/COLOR][/I][/SIZE][/FONT][/CENTER][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4][I].[/I][/SIZE][/FONT][/COLOR]',
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
      title : 'Уже одобрена'  ,
    content:
        '[IMG]https://i.postimg.cc/gkK7Mw0C/5-20240113081629.png[/IMG]' +
        '[CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/CENTER]<br><br>' +
        "[CENTER][I][FONT=times new roman]Ваша RolePlay биография[/FONT][/I] [FONT=tahoma][I][COLOR=rgb(255, 0, 51)]Отказана[/COLOR]![/I][/FONT][/CENTER]<br><br>" +
        '[CENTER][COLOR=rgb(255, 0, 102)]Причина[/COLOR]: [I][FONT=times new roman]Ваша RolePlay была уже одобрена ранее.[/FONT][/I][/CENTER] <br></br>' +
          "[CENTER][I][FONT=times new roman]Прошу вас, ещё раз [U]прочитать[/U] правила Создания [COLOR=rgb(0, 255, 0)]Role[/COLOR][COLOR=rgb(255, 255, 0)]Play[/COLOR] - [COLOR=rgb(255, 51, 255)]Биографий[/COLOR] в теме закреплённой сверху![/FONT][/I][/CENTER]<br><br>" +
        '[CENTER][FONT=book antiqua][SIZE=4][COLOR=rgb(209, 213, 216)][I]Приятной игры на сервере [/I][/COLOR][I][COLOR=rgb(255, 255, 0)]OREL[/COLOR][/I][/SIZE][/FONT][/CENTER][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4][I].[/I][/SIZE][/FONT][/COLOR]',
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
      title : 'Супергерой'  ,
     content:
        '[IMG]https://i.postimg.cc/gkK7Mw0C/5-20240113081629.png[/IMG]' +
        '[CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/CENTER]<br><br>' +
        "[CENTER][I][FONT=times new roman]Ваша RolePlay биография[/FONT][/I] [FONT=tahoma][I][COLOR=rgb(255, 0, 51)]Отказана[/COLOR]![/I][/FONT][/CENTER]<br><br>" +
        '[CENTER][COLOR=rgb(255, 0, 102)]Причина[/COLOR]: [I][FONT=times new roman]Вы присвоили своему персонажу возможности, которые не могу быть осуществлены в жизни.[/FONT][/I][/CENTER] <br></br>' +
          "[CENTER][I][FONT=times new roman]Прошу вас, ещё раз [U]прочитать[/U] правила Создания [COLOR=rgb(0, 255, 0)]Role[/COLOR][COLOR=rgb(255, 255, 0)]Play[/COLOR] - [COLOR=rgb(255, 51, 255)]Биографий[/COLOR] в теме закреплённой сверху![/FONT][/I][/CENTER]<br><br>" +
        '[CENTER][FONT=book antiqua][SIZE=4][COLOR=rgb(209, 213, 216)][I]Приятной игры на сервере [/I][/COLOR][I][COLOR=rgb(255, 255, 0)]OREL[/COLOR][/I][/SIZE][/FONT][/CENTER][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4][I].[/I][/SIZE][/FONT][/COLOR]',
     prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
      title : 'Копипаст',
      content:
        '[IMG]https://i.postimg.cc/gkK7Mw0C/5-20240113081629.png[/IMG]' +
        '[CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/CENTER]<br><br>' +
        "[CENTER][I][FONT=times new roman]Ваша RolePlay биография[/FONT][/I] [FONT=tahoma][I][COLOR=rgb(255, 0, 51)]Отказана[/COLOR]![/I][/FONT][/CENTER]<br><br>" +
        '[CENTER][COLOR=rgb(255, 0, 102)]Причина[/COLOR]: [I][FONT=times new roman]Ваша RolePlay Биография была скопирована у другого  человека.[/FONT][/I][/CENTER] <br></br>' +
          "[CENTER][I][FONT=times new roman]Прошу вас, ещё раз [U]прочитать[/U] правила Создания [COLOR=rgb(0, 255, 0)]Role[/COLOR][COLOR=rgb(255, 255, 0)]Play[/COLOR] - [COLOR=rgb(255, 51, 255)]Биографий[/COLOR] в теме закреплённой сверху![/FONT][/I][/CENTER]<br><br>" +
        '[CENTER][FONT=book antiqua][SIZE=4][COLOR=rgb(209, 213, 216)][I]Приятной игры на сервере [/I][/COLOR][I][COLOR=rgb(255, 255, 0)]OREL[/COLOR][/I][/SIZE][/FONT][/CENTER][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4][I].[/I][/SIZE][/FONT][/COLOR]',
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
      title : 'Nonrp ник'  ,
     content:
        '[IMG]https://i.postimg.cc/gkK7Mw0C/5-20240113081629.png[/IMG]' +
        '[CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/CENTER]<br><br>' +
        "[CENTER][I][FONT=times new roman]Ваша RolePlay биография[/FONT][/I] [FONT=tahoma][I][COLOR=rgb(255, 0, 51)]Отказана[/COLOR]![/I][/FONT][/CENTER]<br><br>" +
        '[CENTER][COLOR=rgb(255, 0, 102)]Причина[/COLOR]: [I][FONT=times new roman]У вашего персонажа Nonrp NickName.[/FONT][/I][/CENTER] <br></br>' +
          "[CENTER][I][FONT=times new roman]Прошу вас, ещё раз [U]прочитать[/U] правила Создания [COLOR=rgb(0, 255, 0)]Role[/COLOR][COLOR=rgb(255, 255, 0)]Play[/COLOR] - [COLOR=rgb(255, 51, 255)]Биографий[/COLOR] в теме закреплённой сверху![/FONT][/I][/CENTER]<br><br>" +
        '[CENTER][FONT=book antiqua][SIZE=4][COLOR=rgb(209, 213, 216)][I]Приятной игры на сервере [/I][/COLOR][I][COLOR=rgb(255, 255, 0)]OREL[/COLOR][/I][/SIZE][/FONT][/CENTER][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4][I].[/I][/SIZE][/FONT][/COLOR]',
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
      title : 'ник в заголовке англ'  ,
     content:
        '[IMG]https://i.postimg.cc/gkK7Mw0C/5-20240113081629.png[/IMG]' +
        '[CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/CENTER]<br><br>' +
        "[CENTER][I][FONT=times new roman]Ваша RolePlay биография[/FONT][/I] [FONT=tahoma][I][COLOR=rgb(255, 0, 51)]Отказана[/COLOR]![/I][/FONT][/CENTER]<br><br>" +
        '[CENTER][COLOR=rgb(255, 0, 102)]Причина[/COLOR]: [I][FONT=times new roman]Имя персонажа в заголовке написан на английском [/FONT][/I][/CENTER] <br></br>' +
          "[CENTER][I][FONT=times new roman]Прошу вас, ещё раз [U]прочитать[/U] правила Создания [COLOR=rgb(0, 255, 0)]Role[/COLOR][COLOR=rgb(255, 255, 0)]Play[/COLOR] - [COLOR=rgb(255, 51, 255)]Биографий[/COLOR] в теме закреплённой сверху![/FONT][/I][/CENTER]<br><br>" +
        '[CENTER][FONT=book antiqua][SIZE=4][COLOR=rgb(209, 213, 216)][I]Приятной игры на сервере [/I][/COLOR][I][COLOR=rgb(255, 255, 0)]OREL[/COLOR][/I][/SIZE][/FONT][/CENTER][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4][I].[/I][/SIZE][/FONT][/COLOR]',
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
         title : 'Возраст не совпадает'  ,
     content:
        '[IMG]https://i.postimg.cc/gkK7Mw0C/5-20240113081629.png[/IMG]' +
        '[CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/CENTER]<br><br>' +
        "[CENTER][I][FONT=times new roman]Ваша RolePlay биография[/FONT][/I] [FONT=tahoma][I][COLOR=rgb(255, 0, 51)]Отказана[/COLOR]![/I][/FONT][/CENTER]<br><br>" +
        '[CENTER][COLOR=rgb(255, 0, 102)]Причина[/COLOR]: [I][FONT=times new roman]Возраст персонажа не совпадает с датой рождения.[/FONT][/I][/CENTER] <br></br>' +
          "[CENTER][I][FONT=times new roman]Прошу вас, ещё раз [U]прочитать[/U] правила Создания [COLOR=rgb(0, 255, 0)]Role[/COLOR][COLOR=rgb(255, 255, 0)]Play[/COLOR] - [COLOR=rgb(255, 51, 255)]Биографий[/COLOR] в теме закреплённой сверху![/FONT][/I][/CENTER]<br><br>" +
        '[CENTER][FONT=book antiqua][SIZE=4][COLOR=rgb(209, 213, 216)][I]Приятной игры на сервере [/I][/COLOR][I][COLOR=rgb(255, 255, 0)]OREL[/COLOR][/I][/SIZE][/FONT][/CENTER][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4][I].[/I][/SIZE][/FONT][/COLOR]',
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
        title : 'Семья'  ,
     content:
        '[IMG]https://i.postimg.cc/gkK7Mw0C/5-20240113081629.png[/IMG]' +
        '[CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/CENTER]<br><br>' +
        "[CENTER][I][FONT=times new roman]Ваша RolePlay биография[/FONT][/I] [FONT=tahoma][I][COLOR=rgb(255, 0, 51)]Отказана[/COLOR]![/I][/FONT][/CENTER]<br><br>" +
        '[CENTER][COLOR=rgb(255, 0, 102)]Причина[/COLOR]: [I][FONT=times new roman]Мало информации в пункте:[/FONT][/I] [COLOR=rgb(102, 255, 255)]Семья[/COLOR][/CENTER] <br></br>' +
          "[CENTER][I][FONT=times new roman]Прошу вас, ещё раз [U]прочитать[/U] правила Создания [COLOR=rgb(0, 255, 0)]Role[/COLOR][COLOR=rgb(255, 255, 0)]Play[/COLOR] - [COLOR=rgb(255, 51, 255)]Биографий[/COLOR] в теме закреплённой сверху![/FONT][/I][/CENTER]<br><br>" +
        '[CENTER][FONT=book antiqua][SIZE=4][COLOR=rgb(209, 213, 216)][I]Приятной игры на сервере [/I][/COLOR][I][COLOR=rgb(255, 255, 0)]OREL[/COLOR][/I][/SIZE][/FONT][/CENTER][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4][I].[/I][/SIZE][/FONT][/COLOR]',
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
        title : 'дата рождения не по форме'  ,
     content:
        '[IMG]https://i.postimg.cc/gkK7Mw0C/5-20240113081629.png[/IMG]' +
        '[CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/CENTER]<br><br>' +
        "[CENTER][I][FONT=times new roman]Ваша RolePlay биография[/FONT][/I] [FONT=tahoma][I][COLOR=rgb(255, 0, 51)]Отказана[/COLOR]![/I][/FONT][/CENTER]<br><br>" +
        '[CENTER][COLOR=rgb(255, 0, 102)]Причина[/COLOR]: [I][FONT=times new roman]Дата рождения составлена не по форме.[/FONT][/I][/CENTER] <br></br>' +
          "[CENTER][I][FONT=times new roman]Прошу вас, ещё раз [U]прочитать[/U] правила Создания [COLOR=rgb(0, 255, 0)]Role[/COLOR][COLOR=rgb(255, 255, 0)]Play[/COLOR] - [COLOR=rgb(255, 51, 255)]Биографий[/COLOR] в теме закреплённой сверху![/FONT][/I][/CENTER]<br><br>" +
        '[CENTER][FONT=book antiqua][SIZE=4][COLOR=rgb(209, 213, 216)][I]Приятной игры на сервере [/I][/COLOR][I][COLOR=rgb(255, 255, 0)]OREL[/COLOR][/I][/SIZE][/FONT][/CENTER][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4][I].[/I][/SIZE][/FONT][/COLOR]',
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
      title: 'Настоящее время',
      content:
        '[IMG]https://i.postimg.cc/gkK7Mw0C/5-20240113081629.png[/IMG]' +
        '[CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/CENTER]<br><br>' +
        "[CENTER][I][FONT=times new roman]Ваша RolePlay биография[/FONT][/I] [FONT=tahoma][I][COLOR=rgb(255, 0, 51)]Отказана[/COLOR]![/I][/FONT][/CENTER]<br><br>" +
        '[CENTER][COLOR=rgb(255, 0, 102)]Причина[/COLOR]: [I][FONT=times new roman]Мало информации в пункте:[/FONT][/I] [COLOR=rgb(102, 255, 255)]Настоящее время.[/COLOR][/CENTER] <br></br>' +
          "[CENTER][I][FONT=times new roman]Прошу вас, ещё раз [U]прочитать[/U] правила Создания [COLOR=rgb(0, 255, 0)]Role[/COLOR][COLOR=rgb(255, 255, 0)]Play[/COLOR] - [COLOR=rgb(255, 51, 255)]Биографий[/COLOR] в теме закреплённой сверху![/FONT][/I][/CENTER]<br><br>" +
        '[CENTER][FONT=book antiqua][SIZE=4][COLOR=rgb(209, 213, 216)][I]Приятной игры на сервере [/I][/COLOR][I][COLOR=rgb(255, 255, 0)]OREL[/COLOR][/I][/SIZE][/FONT][/CENTER][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4][I].[/I][/SIZE][/FONT][/COLOR]',
      prefix: PIN_PREFIX,
      status: true,
    },
    {
        title: 'Нелогичность',
        content:
          '[IMG]https://i.postimg.cc/gkK7Mw0C/5-20240113081629.png[/IMG]' +
        '[CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/CENTER]<br><br>' +
        "[CENTER][I][FONT=times new roman]Ваша RolePlay биография[/FONT][/I] [FONT=tahoma][I][COLOR=rgb(255, 0, 51)]Отказана[/COLOR]![/I][/FONT][/CENTER]<br><br>" +
        '[CENTER][COLOR=rgb(255, 0, 102)]Причина[/COLOR]: [I][FONT=times new roman]Ваша RolePlay биография не имеет логичности жизни персонажа.[/FONT][/I][/CENTER] <br></br>' +
          "[CENTER][I][FONT=times new roman]Прошу вас, ещё раз [U]прочитать[/U] правила Создания [COLOR=rgb(0, 255, 0)]Role[/COLOR][COLOR=rgb(255, 255, 0)]Play[/COLOR] - [COLOR=rgb(255, 51, 255)]Биографий[/COLOR] в теме закреплённой сверху![/FONT][/I][/CENTER]<br><br>" +
        '[CENTER][FONT=book antiqua][SIZE=4][COLOR=rgb(209, 213, 216)][I]Приятной игры на сервере [/I][/COLOR][I][COLOR=rgb(255, 255, 0)]OREL[/COLOR][/I][/SIZE][/FONT][/CENTER][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4][I].[/I][/SIZE][/FONT][/COLOR]',
        prefix: UNACCEPT_PREFIX,
        status: false,
    },

    {
      title: '_________________________________RP организации________________________________________'
    },
    {
      title: 'одобрено',
      content:
        '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/FONT][/COLOR]<br><br>' +
        "[SIZE=4][FONT=times new roman][I][COLOR=rgb(209, 213, 216)]Ваша RolePlay - организация одобрена.[/COLOR][/I][/FONT][/SIZE]<br><br>" +
        '[FONT=book antiqua][SIZE=4][COLOR=rgb(209, 213, 216)][I]Приятной игры на BLACK RUSSIA [/I][/COLOR][I][COLOR=rgb(0, 255, 255)]OREL[/COLOR][/I][/SIZE][/FONT][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4][I].[/SIZE][/FONT][/COLOR]',
      prefix: ACCEPT_PREFIX,
      status: false,

    },
    {
      title : 'не туда'  ,
      content:
        '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/FONT][/COLOR]<br><br>' +
        "[SIZE=4][FONT=times new roman][I][COLOR=rgb(209, 213, 216)]Ваша RolePlay - организация отказана т.к вы не туда попали. [/COLOR]<br><br>" +
        '[FONT=book antiqua][SIZE=4][COLOR=rgb(209, 213, 216)][I]Приятной игры на BLACK RUSSIA [/I][/COLOR][I][COLOR=rgb(0, 255, 255)]OREL[/COLOR][/I][/SIZE][/FONT][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4][I].[/SIZE][/FONT][/COLOR]',
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
      title : 'не по форме'  ,
      content:
        '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/FONT][/COLOR]<br><br>' +
        "[SIZE=4][FONT=times new roman][I][COLOR=rgb(209, 213, 216)]Ваша RolePlay - организация отказана т.к она составлена не по форме. [/COLOR]<br><br>"+
        '[FONT=book antiqua][SIZE=4][COLOR=rgb(209, 213, 216)][I]Приятной игры на BLACK RUSSIA [/I][/COLOR][I][COLOR=rgb(0, 255, 255)]OREL[/COLOR][/I][/SIZE][/FONT][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4][I].[/SIZE][/FONT][/COLOR]',
     prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
      title : 'отказ'  ,
      content:
        '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/FONT][/COLOR]<br><br>' +
        "[SIZE=4][FONT=times new roman][I][COLOR=rgb(209, 213, 216)]Ваша RolePlay - организация отказана. [/COLOR]<br><br>" +
        '[FONT=book antiqua][SIZE=4][COLOR=rgb(209, 213, 216)][I]Приятной игры на BLACK RUSSIA [/I][/COLOR][I][COLOR=rgb(0, 255, 255)]OREL[/COLOR][/I][/SIZE][/FONT][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4][I].[/SIZE][/FONT][/COLOR]',
     prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
     title: 'На доработке',
      content:
        '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/FONT][/COLOR]<br><br>' +
        "[COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4][I]В вашей RolePlay - организации недостаточно информации.<br><br>" +
        "Даю вам 24 часа на ее дополнение.[/I][/SIZE][/FONT][/COLOR]<br><br>" +
        '[FONT=book antiqua][SIZE=4][COLOR=rgb(209, 213, 216)][I]Приятной игры на BLACK RUSSIA [/I][/COLOR][I][COLOR=rgb(0, 255, 255)]OREL[/COLOR][/I][/SIZE][/FONT][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4][I].[/SIZE][/FONT][/COLOR]',
      prefix: PIN_PREFIX,
      status: true,
    },
    {
        title : 'ник англ'  ,
     content:
        '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/FONT][/COLOR]<br><br>' +
        "[SIZE=4][FONT=times new roman][I][COLOR=rgb(209, 213, 216)]Ваша RolePlay - организация отказана т.к ваш все никнеймы должны быть написаны на русском языке. [/COLOR]<br><br>" +
       "[COLOR=rgb(209, 213, 216)]Внимательно прочитайте правила создания RP - организаций закрепленные в данном разделе [/COLOR][/I][COLOR=rgb(209, 213, 216)][/COLOR][/FONT][/SIZE]<br><br>" +
        '[FONT=book antiqua][SIZE=4][COLOR=rgb(209, 213, 216)][I]Приятной игры на BLACK RUSSIA [/I][/COLOR][I][COLOR=rgb(0, 255, 255)]OREL[/COLOR][/I][/SIZE][/FONT][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4][I].[/SIZE][/FONT][/COLOR]',
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
        title : 'Неграмотная'  ,
     content:
        '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/FONT][/COLOR]<br><br>' +
        "[SIZE=4][FONT=times new roman][I][COLOR=rgb(209, 213, 216)]Ваша RolePlay - организаций отказана т.к она оформлена неграмотно. [/COLOR]<br><br>" +
        "[COLOR=rgb(209, 213, 216)]Внимательно прочитайте правила создания RP - организаций закрепленные в данном разделе [/COLOR][/I][COLOR=rgb(209, 213, 216)][/COLOR][/FONT][/SIZE]<br><br>" +
        '[FONT=book antiqua][SIZE=4][COLOR=rgb(209, 213, 216)][I]Приятной игры на BLACK RUSSIA [/I][/COLOR][I][COLOR=rgb(0, 255, 255)]OREL[/COLOR][/I][/SIZE][/FONT][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4][I].[/SIZE][/FONT][/COLOR]',
       prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
        title : 'Копипаст'  ,
      content:
        '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{{ greeting }}, уважаемый {{ user.mention }}.[/I][/FONT][/COLOR]<br><br>' +
        "[SIZE=4][FONT=times new roman][I][COLOR=rgb(209, 213, 216)]Ваша RolePlay - организация отказана т.к вы ее скопировали у другого человека. [/COLOR]<br><br>" +
       "[COLOR=rgb(209, 213, 216)]Внимательно прочитайте правила создания RP - организаций закрепленные в данном разделе [/COLOR][/I][COLOR=rgb(209, 213, 216)][/COLOR][/FONT][/SIZE]<br><br>" +
        '[FONT=book antiqua][SIZE=4][COLOR=rgb(209, 213, 216)][I]Приятной игры на BLACK RUSSIA [/I][/COLOR][I][COLOR=rgb(0, 255, 255)]OREL[/COLOR][/I][/SIZE][/FONT][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4][I].[/SIZE][/FONT][/COLOR]',
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
         title : 'Не дополнил'  ,
    content:
        '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/FONT][/COLOR]<br><br>' +
        "[SIZE=4][FONT=times new roman][I][COLOR=rgb(209, 213, 216)]Ваша RolePlay - организация отказана т.к вы ее не дополнили. [/COLOR]<br><br>" +
          "[COLOR=rgb(209, 213, 216)]Внимательно прочитайте правила создания RP - организаций закрепленные в данном разделе [/COLOR][/I][COLOR=rgb(209, 213, 216)][/COLOR][/FONT][/SIZE]<br><br>" +
        '[FONT=book antiqua][SIZE=4][COLOR=rgb(209, 213, 216)][I]Приятной игры на BLACK RUSSIA [/I][/COLOR][I][COLOR=rgb(0, 255, 255)]OREL[/COLOR][/I][/SIZE][/FONT][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4][I].[/SIZE][/FONT][/COLOR]',
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
         title : 'Заголовок не по форме'  ,
    content:
        '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/FONT][/COLOR]<br><br>' +
        "[SIZE=4][FONT=times new roman][I][COLOR=rgb(209, 213, 216)]Ваша RolePlay - организация отказана т.к заголовок оформлен неправильно. [/COLOR]<br><br>" +
          "[COLOR=rgb(209, 213, 216)]Внимательно прочитайте правила создания RP - организаций закрепленные в данном разделе [/COLOR][/I][COLOR=rgb(209, 213, 216)][/COLOR][/FONT][/SIZE]<br><br>" +
        '[FONT=book antiqua][SIZE=4][COLOR=rgb(209, 213, 216)][I]Приятной игры на BLACK RUSSIA [/I][/COLOR][I][COLOR=rgb(0, 255, 255)]OREL[/COLOR][/I][/SIZE][/FONT][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4][I].[/SIZE][/FONT][/COLOR]',
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
        title: '_________________________________RP ситуации________________________________________'
    },
    {
              title: 'одобрено',
      content:
        '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/FONT][/COLOR]<br><br>' +
        "[SIZE=4][FONT=times new roman][I][COLOR=rgb(209, 213, 216)]Ваша RolePlay - ситуация одобрена.[/COLOR][/I][/FONT][/SIZE]<br><br>" +
        '[FONT=book antiqua][SIZE=4][COLOR=rgb(209, 213, 216)][I]Приятной игры на BLACK RUSSIA [/I][/COLOR][I][COLOR=rgb(0, 255, 255)]OREL[/COLOR][/I][/SIZE][/FONT][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4][I].[/SIZE][/FONT][/COLOR]',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
title : 'не туда'  ,
     content:
        '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/FONT][/COLOR]<br><br>' +
        "[SIZE=4][FONT=times new roman][I][COLOR=rgb(209, 213, 216)]Ваша RolePlay - ситуация отказана т.к вы не туда попали. [/COLOR]<br><br>" +
        '[FONT=book antiqua][SIZE=4][COLOR=rgb(209, 213, 216)][I]Приятной игры на BLACK RUSSIA [/I][/COLOR][I][COLOR=rgb(0, 255, 255)]OREL[/COLOR][/I][/SIZE][/FONT][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4][I].[/SIZE][/FONT][/COLOR]',
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
  title : 'не по форме'  ,
     content:
        '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/FONT][/COLOR]<br><br>' +
        "[SIZE=4][FONT=times new roman][I][COLOR=rgb(209, 213, 216)]Ваша RolePlay - ситуация отказана т.к она составлена не по форме. [/COLOR]<br><br>" +
        '[FONT=book antiqua][SIZE=4][COLOR=rgb(209, 213, 216)][I]Приятной игры на BLACK RUSSIA [/I][/COLOR][I][COLOR=rgb(0, 255, 255)]OREL[/COLOR][/I][/SIZE][/FONT][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4][I].[/SIZE][/FONT][/COLOR]',
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
      title : 'отказ'  ,
      content:
        '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/FONT][/COLOR]<br><br>' +
        "[SIZE=4][FONT=times new roman][I][COLOR=rgb(209, 213, 216)]Ваша RolePlay - ситуация отказана. [/COLOR]<br><br>" +
        '[FONT=book antiqua][SIZE=4][COLOR=rgb(209, 213, 216)][I]Приятной игры на BLACK RUSSIA [/I][/COLOR][I][COLOR=rgb(0, 255, 255)]OREL[/COLOR][/I][/SIZE][/FONT][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4][I].[/SIZE][/FONT][/COLOR]',
     prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
     title: 'На доработке',
      content:
        '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/FONT][/COLOR]<br><br>' +
        "[COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4][I]В вашей RolePlay - ситуации недостаточно информации.<br><br>" +
        "Даю вам 24 часа на ее дополнение.[/I][/SIZE][/FONT][/COLOR]<br><br>" +
        '[FONT=book antiqua][SIZE=4][COLOR=rgb(209, 213, 216)][I]Приятной игры на BLACK RUSSIA [/I][/COLOR][I][COLOR=rgb(0, 255, 255)]OREL[/COLOR][/I][/SIZE][/FONT][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4][I].[/SIZE][/FONT][/COLOR]',
      prefix: PIN_PREFIX,
      status: true,
    },
    {
        title : 'ник англ'  ,
     content:
        '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/FONT][/COLOR]<br><br>' +
        "[SIZE=4][FONT=times new roman][I][COLOR=rgb(209, 213, 216)]Ваша RolePlay - ситуация отказана т.к ваш все никнеймы должны быть написаны на русском языке. [/COLOR]<br><br>" +
       "[COLOR=rgb(209, 213, 216)]Внимательно прочитайте правила создания RP - ситуаций закрепленные в данном разделе [/COLOR][/I][COLOR=rgb(209, 213, 216)][/COLOR][/FONT][/SIZE]<br><br>" +
        '[FONT=book antiqua][SIZE=4][COLOR=rgb(209, 213, 216)][I]Приятной игры на BLACK RUSSIA [/I][/COLOR][I][COLOR=rgb(0, 255, 255)]OREL[/COLOR][/I][/SIZE][/FONT][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4][I].[/SIZE][/FONT][/COLOR]',
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
       title : 'Неграмотная'  ,
     content:
        '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/FONT][/COLOR]<br><br>' +
        "[SIZE=4][FONT=times new roman][I][COLOR=rgb(209, 213, 216)]Ваша RolePlay - ситуация отказана т.к она оформлена неграмотно. [/COLOR]<br><br>" +
        "[COLOR=rgb(209, 213, 216)]Внимательно прочитайте правила создания RP - ситуаций закрепленные в данном разделе [/COLOR][/I][COLOR=rgb(209, 213, 216)][/COLOR][/FONT][/SIZE]<br><br>" +
        '[FONT=book antiqua][SIZE=4][COLOR=rgb(209, 213, 216)][I]Приятной игры на BLACK RUSSIA [/I][/COLOR][I][COLOR=rgb(0, 255, 255)]OREL[/COLOR][/I][/SIZE][/FONT][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4][I].[/SIZE][/FONT][/COLOR]',
       prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
        title : 'Копипаст'  ,
      content:
        '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{{ greeting }}, уважаемый {{ user.mention }}.[/I][/FONT][/COLOR]<br><br>' +
        "[SIZE=4][FONT=times new roman][I][COLOR=rgb(209, 213, 216)]Ваша RolePlay - ситуация отказана т.к вы ее скопировали у другого человека. [/COLOR]<br><br>" +
       "[COLOR=rgb(209, 213, 216)]Внимательно прочитайте правила создания RP - ситуаций закрепленные в данном разделе [/COLOR][/I][COLOR=rgb(209, 213, 216)][/COLOR][/FONT][/SIZE]<br><br>" +
        '[FONT=book antiqua][SIZE=4][COLOR=rgb(209, 213, 216)][I]Приятной игры на BLACK RUSSIA [/I][/COLOR][I][COLOR=rgb(0, 255, 255)]OREL[/COLOR][/I][/SIZE][/FONT][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4][I].[/SIZE][/FONT][/COLOR]',
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
         title : 'Не дополнил'  ,
    content:
        '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/FONT][/COLOR]<br><br>' +
        "[SIZE=4][FONT=times new roman][I][COLOR=rgb(209, 213, 216)]Ваша RolePlay - ситуация отказана т.к вы ее не дополнили. [/COLOR]<br><br>" +
          "[COLOR=rgb(209, 213, 216)]Внимательно прочитайте правила создания RP - ситуаций закрепленные в данном разделе [/COLOR][/I][COLOR=rgb(209, 213, 216)][/COLOR][/FONT][/SIZE]<br><br>" +
        '[FONT=book antiqua][SIZE=4][COLOR=rgb(209, 213, 216)][I]Приятной игры на BLACK RUSSIA [/I][/COLOR][I][COLOR=rgb(0, 255, 255)]OREL[/COLOR][/I][/SIZE][/FONT][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4][I].[/SIZE][/FONT][/COLOR]',
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
         title : 'Заголовок не по форме'  ,
    content:
        '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/FONT][/COLOR]<br><br>' +
        "[SIZE=4][FONT=times new roman][I][COLOR=rgb(209, 213, 216)]Ваша RolePlay - ситуация отказана т.к заголовок оформлен неправильно. [/COLOR]<br><br>" +
          "[COLOR=rgb(209, 213, 216)]Внимательно прочитайте правила создания RP - ситуаций закрепленные в данном разделе [/COLOR][/I][COLOR=rgb(209, 213, 216)][/COLOR][/FONT][/SIZE]<br><br>" +
        '[FONT=book antiqua][SIZE=4][COLOR=rgb(209, 213, 216)][I]Приятной игры на BLACK RUSSIA [/I][/COLOR][I][COLOR=rgb(0, 255, 255)]OREL[/COLOR][/I][/SIZE][/FONT][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4][I].[/SIZE][/FONT][/COLOR]',
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
        'Доброе утречко' :
        11 < hours && hours <= 15 ?
        'Добрый денечек' :
        15 < hours && hours <= 21 ?
        'Добрый вечерок' :
        'Приятного будущего сна',
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