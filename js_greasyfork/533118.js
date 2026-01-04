// ==UserScript==
// @name         Скрипт для КФ | VLADIMIR
// @namespace    https://forum.blackrussia.online/
// @version      3.34
// @description  Версия для сервера VLADIMIR
// @author       Pavel Bewerly
// @match        https://forum.blackrussia.online/threads/*
// @include      https://forum.blackrussia.online/threads/
// @grant        none
// @license      MIT
// @icon https://forum.blackrussia.online/data/avatars/o/11/11193.jpg?1680968342
// @downloadURL https://update.greasyfork.org/scripts/533118/%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%9A%D0%A4%20%7C%20VLADIMIR.user.js
// @updateURL https://update.greasyfork.org/scripts/533118/%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%9A%D0%A4%20%7C%20VLADIMIR.meta.js
// ==/UserScript==
 
(function () {
	'use strict';
	const UNACCEPT_PREFIX = 4; // префикс отказано
	const ACCEPT_PREFIX = 8; // префикс одобрено
	const PIN_PREFIX = 2; //  префикс закрепить
	const COMMAND_PREFIX = 10; // команде проекта
	const CLOSE_PREFIX = 7; // префикс закрыто
	const DECIDED_PREFIX = 6; // префикс решено
	const WATCHED_PREFIX = 9; // рассмотрено
    const OJIDANIE_PREFIX = 14; // ожидание
	const TEX_PREFIX = 13; //  техническому специалисту
    const GA_PREFIX = 12; // Prefix that will be set when thread send to ga
	const NO_PREFIX = 0;
      const biography = [
           {
       title: '    . . . . .. . . . .. . . . .. . . . .. . . . .. . . . .. . . . .. . . . . . . . . . Свой ответ для жалоб . . . . .. . . . .. . . . .. . . . .. . . . .. . . . . . .. ',
	   dpstyle: 'oswald: 3px;   color: #fff; background: #7851A9; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #7851A9',
    },
{
	  title: 'Одобрено',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 251, 152, 0.5)',
	  content:
'[COLOR=#FF00FF][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][COLOR=ffffff]Ваш текст<br><br>"+
      '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][COLOR=#45fc03]Одобрено.[/COLOR]<br><br>",
},
{
      title: 'На рассмотрении',
       dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
	  content:
'[COLOR=#FF00FF][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][COLOR=ffffff]Ваш текст<br><br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][COLOR=#FFFF00]На рассмотрении.[/COLOR]<br><br>",
},
{
      title: 'Отказ',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5)',
	  content:
'[COLOR=#FF00FF][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][COLOR=ffffff]Ваш текст<br><br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][COLOR=#FF0000]Отказано.[/COLOR]<br><br>",
},
{
	  title: 'Закрыто',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5)',
	  content:
'[COLOR=#FF00FF][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][COLOR=ffffff]Ваш текст<br><br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][COLOR=#FF0000]Закрыто.[/COLOR]<br><br>",
},
  {
       title: '  . . . . .. . . . .. . . . .. . . . .. . . . .. . . . .   . . . . . Свой ответ для РП биографии . . . . .. . . . .. . . . .. . . . .. . . . .. . . . .. . . . .     ',
	   dpstyle: 'oswald: 3px;   color: #fff; background: #7851A9; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #7851A9',
    },
 
       {
      title: 'Отказ (Несколько ошибок)',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5)',
	  content:
'[COLOR=#FF00FF][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][COLOR=ffffff][ICODE]В вашей биографии присутсвует несколько ошибок:[/ICODE]<br><br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][COLOR=#FF0000][ICODE]Отказано.[/ICODE][/COLOR]<br><br>"+
         "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] Vladimir[/SIZE][/B][/COLOR]",
},
       {
        title: 'Отказ (Причина)',
        dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5)',
        content:
    "[B][CENTER][COLOR=#FF69B4][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
    "[B][CENTER][FONT=times new roman][COLOR=ffffff][ICODE]Ваша RolePlay биография была проверена и получает статус - [/ICODE][COLOR=#FF0000][ICODE]Отказано.[/ICODE]<br><br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
    "[B][CENTER][FONT=times new roman][ICODE]Причина отказа: [/ICODE][COLOR=#ffffff][ICODE]Ваш текст[/ICODE][/COLOR]<br><br>"+
    "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] Vladimir[/SIZE][/B][/COLOR]",
    },
       {
      title: 'Отказ (Свой текст)',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5)',
	  content:
'[COLOR=#FF00FF][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][COLOR=ffffff]Ваш текст[/ICODE]<br><br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][COLOR=#FF0000][ICODE]Отказано.[/ICODE][/COLOR]<br><br>"+
         "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] Vladimir[/SIZE][/B][/COLOR]",
},
       {
      title: 'Отказ (Несколько ошибок)',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5)',
	  content:
'[COLOR=#FF00FF][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][COLOR=ffffff][ICODE]В вашей биографии присутсвует несколько ошибок:[/ICODE]<br><br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][COLOR=#FF0000][ICODE]Отказано.[/ICODE][/COLOR]<br><br>" +
        "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] Vladimir[/SIZE][/B][/COLOR]",
},
       {
       title: '   . . . . .. . . . .. . . . .. . . . .. . . . .. . . . .. . . . .. . . . . . . . . . На доработку (своими словами) . . . . .. . . . .. . . . .. . . . .. ',
              dpstyle: 'oswald: 3px;     color: #fff; background: #7851A9; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #7851A9',
    },
       {
      title: 'На рассмотрении',
       dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
	  content:
'[COLOR=#FF00FF][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][COLOR=ffffff][ICODE]Ваша RolePlay биография (ваш текст). У вас есть 24 часа на исправление своей биографии.[/ICODE]<br><br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][COLOR=#FFFF00][ICODE]На рассмотрении.[/ICODE][/COLOR]<br><br>" +
           "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] Vladimir[/SIZE][/B][/COLOR]",
},
       ];
       const buttons = [
            {
       title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴✅️Статус одобрено✅️╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴'
    },
 
{
	  title: 'DM',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 251, 152, 0.5)',
	  content:
		'[COLOR=#FF00FF][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
		 "[B][CENTER][FONT=times new roman][COLOR=ffffff][ICODE]Игрок будет наказан по следующему пункту правил:[/ICODE]<br><br>"+
         "[B][CENTER][FONT=times new roman][COLOR=#FF0000][ICODE]2.19<br>Запрещен DM (DeathMatch)[/ICODE][/COLOR] — [ICODE] убийство или нанесение урона без веской IC причины[/ICODE] [Color=#ff0000][ICODE] | Jail 60 минут[/ICODE][/COLOR]<br><br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
         "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#45fc03][ICODE]Одобрено.[/ICODE][/SIZE][/COLOR]<br><br>" +
    "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] Vladimir[/SIZE][/B][/COLOR]",
        prefix: ACCEPT_PREFIX,
	  status: false,
},
    {
	  title: 'DB',
        dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 251, 152, 0.5)',
	  content:
	'[COLOR=#FF00FF][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][ICODE]Игрок будет наказан по следующему пункту правил:[/ICODE]<br><br>"+
        "[B][CENTER][FONT=times new roman][COLOR=#FF0000][ICODE]2.13<br>Запрещен  DB (DriveBy)[/ICODE][/COLOR]  — [ICODE]намеренное убийство / нанесение урона без веской IC причины на любом виде транспорта[/ICODE] [Color=#ff0000][ICODE]| Jail 60 минут [/ICODE][/COLOR]<br><br>"+
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#45fc03][ICODE]Одобрено.[/ICODE][/COLOR][/SIZE]<br><br>"+
        "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] Vladimir[/SIZE][/B][/COLOR]",
     prefix: ACCEPT_PREFIX,
	  status: false,
},
 
{
	  title: 'TK',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 251, 152, 0.5)',
	  content:
'[COLOR=#FF00FF][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE]Игрок будет наказан по следующему пункту правил:[/ICODE][/SIZE]<br><br>"+
    "[B][CENTER][FONT=times new roman][COLOR=#FF0000][ICODE]2.15<br>Запрещен TK (Team Kill) [/ICODE][/COLOR] — [ICODE]убийство члена своей или союзной фракции, организации без наличия какой-либо IC причины [/ICODE][Color=#ff0000][ICODE]| Jail 60 минут / Warn (за два и более убийства)[/ICODE][/COLOR]<br><br>"+
      '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][COLOR=#45fc03][ICODE]Одобрено.[/ICODE][/COLOR]<br><br>" +
    "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] Vladimir[/SIZE][/B][/COLOR]",
      prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: 'SK',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 251, 152, 0.5)',
	  content:
'[COLOR=#FF00FF][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE]Игрок будет наказан по следующему пункту правил:[/ICODE][/SIZE]<br><br>"+
    "[B][CENTER][FONT=times new roman][COLOR=#FF0000][ICODE]2.16<br>Запрещен SK (Spawn Kill)[/ICODE][/COLOR] — [ICODE]убийство или нанесение урона на титульной территории любой фракции / организации, на месте появления игрока, а также на выходе из закрытых интерьеров и около них[/ICODE][Color=#ff0000][ICODE]Jail 60 минут / Warn (за два и более убийства)[/ICODE][/COLOR]<br><br>"+
      '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#45fc03][ICODE]Одобрено.[/ICODE][/COLOR][/SIZE]<br><br>"+
    "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] Vladimir[/SIZE][/B][/COLOR]",
      prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: 'Mass DM',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 251, 152, 0.5)',
	  content:
'[COLOR=#FF00FF][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE]Игрок будет наказан по следующему пункту правил:[/ICODE][/SIZE]<br><br>"+
    "[B][CENTER][FONT=times new roman][COLOR=#FF0000][ICODE]2.20<br>Запрещен Mass DM (Mass DeathMatch)[/ICODE][/COLOR] — [ICODE] убийство или нанесение урона без веской IC причины трем игрокам и более [/ICODE][Color=#ff0000][ICODE] Warn / Ban 3 - 7 дней[/ICODE][/COLOR]<br><br>"+
      '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#45fc03][ICODE]Одобрено.[/ICODE][/SIZE][/COLOR]<br><br>" +
    "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] Vladimir[/SIZE][/B][/COLOR]",
      prefix: ACCEPT_PREFIX,
	  status: false,
},
    {
	  title: 'помеха работе игрокам',
        dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 251, 152, 0.5)',
	  content:
'[COLOR=#FF00FF][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE]Игрок будет наказан по следующему пункту правил:[/ICODE][/SIZE]<br><br>"+
      "[B][CENTER][FONT=times new roman][COLOR=#FF0000][ICODE]2.04<br>[/ICODE][/COLOR][ICODE] Запрещены любые действия способные привести к помехам в игровом процессе, а также выполнению работ, если они этого не предусматривают и если эти действия выходят за рамки игрового процесса данной работы. [/ICODE][Color=#ff0000][ICODE]Ban 10 дней / Обнуление аккаунта (при повторном нарушении)[/ICODE][/COLOR]<br><br>"+
      '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#45fc03][ICODE]Одобрено.[/ICODE][/SIZE][/COLOR]<br><br>"+
        "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] Vladimir[/SIZE][/B][/COLOR]",
      prefix: ACCEPT_PREFIX,
	  status: false,
},
              {
      title: 'NonRP Обман',
     dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 251, 152, 0.5)',
      content:
'[COLOR=#FF00FF][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
       "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE]Игрок будет наказан по следующему пункту правил:[/ICODE][/SIZE]<br><br>"+
       "[B][CENTER][FONT=times new roman][COLOR=#FF0000][ICODE]2.05.<br>[/ICODE][/COLOR] — [ICODE]  Запрещены любые OOC обманы и их попытки, а также любые IC обманы с нарушением Role Play правил и логики [/ICODE][Color=#ff0000][ICODE] | PermBan [/ICODE][/COLOR]<br><br>"+
     '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#45fc03]Одобрено.[/SIZE][/COLOR]<br><br>"+
                  "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] Vladimir[/SIZE][/B][/COLOR]",
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
{
	  title: 'NonRP Поведение',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 251, 152, 0.5)',
	  content:
'[COLOR=#FF00FF][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE]Игрок будет наказан по следующему пункту правил:[/ICODE][/SIZE]<br><br>"+
    "[B][CENTER][FONT=times new roman][COLOR=#FF0000][ICODE]2.01.<br>[/ICODE][/COLOR] — [ICODE] Запрещено поведение, нарушающее нормы процессов Role Play режима игры [/ICODE][Color=#ff0000][ICODE]Jail 30 минут[/ICODE][/COLOR]<br><br>"+
      '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#45fc03][ICODE]Одобрено.[/ICODE][/SIZE][/COLOR]<br><br>"+
     "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] Vladimir[/SIZE][/B][/COLOR]",
       prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: 'NonRP Drive',
     dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 251, 152, 0.5)',
	  content:
'[COLOR=#FF00FF][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE]Игрок будет наказан по следующему пункту правил:[/ICODE][/SIZE]<br><br>"+
     "[B][CENTER][FONT=times new roman][COLOR=#FF0000][ICODE]2.03.<br>Запрещен NonRP Drive [/ICODE][/COLOR] — [ICODE] вождение любого транспортного средства в невозможных для него условиях, а также вождение в неправдоподобной манере [/ICODE][Color=#ff0000][ICODE]Jail 30 минут[/ICODE][/COLOR]<br><br>"+
      '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
         "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#45fc03][ICODE]Одобрено.[/ICODE][/SIZE][/COLOR]<br><br>"+
    "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] Vladimir[/SIZE][/B][/COLOR]",
      prefix: ACCEPT_PREFIX,
	  status: false,
},
              {
      title: 'Игрок будет наказан',
     dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 251, 152, 0.5)',
      content:
'[COLOR=#FF00FF][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
       "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE]Игрок будет наказан [/ICODE][/SIZE]<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
         "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#45fc03][ICODE]Одобрено.[/ICODE][/SIZE][/COLOR]<br><br>"+
            "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] Vladimir[/SIZE][/B][/COLOR]",
      prefix: ACCEPT_PREFIX ,
	  status: false,
    },
 
 
              {
      title: 'Стороннеe ПО',
     dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 251, 152, 0.5)',
      content:
 
'[COLOR=#FF00FF][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE]Игрок будет наказан по следующему пункту правил:[/ICODE][/SIZE]<br><br>"+
        "[B][CENTER][FONT=times new roman][COLOR=#FF0000][ICODE]2.22.<br> [/ICODE][/COLOR] — [ICODE]Запрещено хранить / использовать / распространять стороннее программное обеспечение или любые другие средства, позволяющие получить преимущество над другими игроками  [/ICODE][Color=#ff0000][ICODE]Ban 15 - 30 дней / PermBan[/ICODE][/COLOR]<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#45fc03][ICODE]Одобрено.[/ICODE][/SIZE][/COLOR]<br><br>"+
            "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] Vladimir[/SIZE][/B][/COLOR]",
      prefix: ACCEPT_PREFIX ,
	  status: false,
    },
{
	  title: 'Розыск без причины',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 251, 152, 0.5)',
	  content:
'[COLOR=#FF00FF][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE]Игрок будет наказан по следующему пункту правил:[/ICODE][/SIZE]<br><br>"+
         "[B][CENTER][FONT=times new roman][COLOR=#FF0000][ICODE]<br>[/ICODE][/COLOR] [ICODE] Запрещено выдавать розыск без Role Play причины [/ICODE][Color=#ff0000][ICODE]Warn.[/ICODE][/COLOR]<br><br>"+
      '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
         "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#45fc03][ICODE]Одобрено.[/ICODE][/SIZE][/COLOR]<br><br>"+
    "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] Vladimir[/SIZE][/B][/COLOR]",
      prefix: ACCEPT_PREFIX ,
	  status: false,
},
{
	  title: 'Штраф без причины',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 251, 152, 0.5)',
	  content:
'[COLOR=#FF00FF][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE]Игрок будет наказан по следующему пункту правил:[/ICODE][/SIZE]<br><br>"+
      "[B][CENTER][FONT=times new roman][COLOR=#FF0000][ICODE]7.02 <br>-[/ICODE][/COLOR] [ICODE] Запрещено выдавать штраф без Role Play причины [/ICODE][Color=#ff0000][ICODE]Warn.[/ICODE][/COLOR]<br><br>"+
      '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
         "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#45fc03][ICODE]Одобрено.[/ICODE][/SIZE][/COLOR]<br><br>"+
    "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] Vladimir[/SIZE][/B][/COLOR]",
      prefix: ACCEPT_PREFIX,
	  status: false,
},
           {
	  title: 'Запрещено распространение информации ',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 251, 152, 0.5)',
	  content:
'[COLOR=#FF00FF][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE]Игрок будет наказан по следующему пункту правил:[/ICODE][/SIZE]<br><br>"+
      "[B][CENTER][FONT=times new roman][COLOR=#FF0000][ICODE]2.27 <br>[/ICODE][/COLOR] [ICODE] Запрещено распространение информации и материалов, непосредственно связанных с деятельностью администрации проекта, которые могут повлиять на работу и систему администрации [/ICODE][Color=#ff0000][ICODE]PermBan + ЧС проекта.[/ICODE][/COLOR]<br><br>"+
      '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
         "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#45fc03][ICODE]Одобрено.[/ICODE][/SIZE][/COLOR]<br><br>"+
    "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] Vladimir[/SIZE][/B][/COLOR]",
      prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: 'Права без причины',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 251, 152, 0.5)',
	  content:
'[COLOR=#FF00FF][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE]Игрок будет наказан по следующему пункту правил:[/ICODE][/SIZE]<br><br>"+
      "[B][CENTER][FONT=times new roman][COLOR=#FF0000][ICODE]<br>[/ICODE][/COLOR] [ICODE] Запрещено отбирать водительские права без Role Play причины[/ICODE][Color=#ff0000][ICODE] Warn // Jail 30.[/ICODE][/COLOR]<br><br>"+
      '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
         "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#45fc03][ICODE]Одобрено.[/ICODE][/SIZE][/COLOR]<br><br>"+
    "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] Vladimir[/SIZE][/B][/COLOR]",
      prefix: ACCEPT_PREFIX,
	  status: false,
},
           {
	  title: 'Права в погоне',
     dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 251, 152, 0.5)',
	  content:
'[COLOR=#FF00FF][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE]Игрок будет наказан по следующему пункту правил:[/ICODE][/SIZE]<br><br>"+
      "[B][CENTER][FONT=times new roman][COLOR=#FF0000][ICODE]6.02<br>-[/ICODE][/COLOR] [ICODE] Запрещено отбирать водительские права во время погони за нарушителем[/ICODE][Color=#ff0000][ICODE] Warn.[/ICODE][/COLOR]<br><br>"+
      '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
         "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#45fc03][ICODE]Одобрено.[/ICODE][/SIZE][/COLOR]<br><br>"+
               "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] Vladimir[/SIZE][/B][/COLOR]",
      prefix: ACCEPT_PREFIX,
	  status: false,
},
 
{
	  title: 'Одиночный патруль',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 251, 152, 0.5)',
	  content:
'[COLOR=#FF00FF][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE]Игрок будет наказан по следующему пункту правил:[/ICODE][/SIZE]<br><br>"+
      "[B][CENTER][FONT=times new roman][COLOR=#FF0000][ICODE]1.11.<br>-[/ICODE][/COLOR] [ICODE] Всем силовым структурам запрещен одиночный патруль или конвоирование, минимум 2 сотрудника [/ICODE][Color=#ff0000][ICODE] Jail 30 минут.[/ICODE][/COLOR]<br><br>"+
      '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#45fc03][ICODE]Одобрено.[/ICODE][/SIZE][/COLOR]<br><br>"+
    "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] Vladimir[/SIZE][/B][/COLOR]",
      prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: 'Обыск без отыгровки // причины',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 251, 152, 0.5)',
	  content:
'[COLOR=#FF00FF][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE]Игрок будет наказан по следующему пункту правил:[/ICODE][/SIZE]<br><br>"+
      "[B][CENTER][FONT=times new roman][COLOR=#FF0000][ICODE]<br>[/ICODE][/COLOR] [ICODE] Запрещено проводить обыск игрока без Role Play отыгровки и причины[/ICODE][Color=#ff0000][ICODE] Warn.[/ICODE][/COLOR]<br><br>"+
      '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
         "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#45fc03][ICODE]Одобрено.[/ICODE][/SIZE][/COLOR]<br><br>"+
    "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] Vladimir[/SIZE][/B][/COLOR]",
      prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: 'Задержаниие без отыгровки',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 251, 152, 0.5)',
	  content:
'[COLOR=#FF00FF][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff]Нарушитель буден наказан по следующему пункту правил государственных структур:[/SIZE]<br><br>"+
          "[B][CENTER][FONT=times new roman][COLOR=#FF0000][ICODE]<br>[/ICODE][/COLOR] [ICODE] Запрещено оказывать задержание без Role Play отыгровки[/ICODE][Color=#ff0000][ICODE] Warn.[/ICODE][/COLOR]<br><br>"+
      '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
         "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#45fc03][ICODE]Одобрено.[/ICODE][/SIZE][/COLOR]<br><br>"+
    "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] Vladimir[/SIZE][/B][/COLOR]",
      prefix: ACCEPT_PREFIX,
	  status: false,
},
    {
	  title: 'NonRP Коп',
        dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 251, 152, 0.5)',
	  content:
'[COLOR=#FF00FF][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE]Игрок будет наказан по следующему пункту правил:[/ICODE][/SIZE]<br><br>"+
        "[B][CENTER][FONT=times new roman][COLOR=#FF0000][ICODE]<br>[/ICODE][/COLOR] [ICODE]Запрещено оказывать задержание без Role Play отыгровки[/ICODE][Color=#ff0000][ICODE] Warn.[/ICODE][/COLOR]<br><br>"+
      '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#45fc03][ICODE]Одобрено.[/ICODE][/SIZE][/COLOR]<br><br>"+
        "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] Vladimir[/SIZE][/B][/COLOR]",
      prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: 'NonRP ВЧ',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 251, 152, 0.5)',
	  content:
'[COLOR=#FF00FF][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
            "[B][CENTER][FONT=times new roman][COLOR=#FF0000][ICODE]<br>[/ICODE][/COLOR] [ICODE]Игрок будет наказан за нарушение правил нападения на воинскую часть [/ICODE][Color=#ff0000][ICODE] Warn.[/ICODE][/COLOR]<br><br>"+
      '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
         "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#45fc03][ICODE]Одобрено.[/ICODE][/SIZE][/COLOR]<br><br>"+
    "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] Vladimir[/SIZE][/B][/COLOR]",
      prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: 'NonRP ВЧ (Гражданский)',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 251, 152, 0.5)',
	  content:
'[COLOR=#FF00FF][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
           "[B][CENTER][FONT=times new roman][COLOR=#FF0000][ICODE]<br>[/ICODE][/COLOR] [ICODE]Игрок будет наказан за нарушение правил нападения на воинскую часть[/ICODE][Color=#ff0000][ICODE]Jail 30 минут.[/ICODE][/COLOR]<br><br>"+
      '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
         "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#45fc03][ICODE]Одобрено.[/ICODE][/SIZE][/COLOR]<br><br>"+
    "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] Vladimir[/SIZE][/B][/COLOR]",
      prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: 'NonRP Огр. // Похищение',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 251, 152, 0.5)',
	  content:
'[COLOR=#FF00FF][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE]Игрок будет наказан по следующему пункту правил:[/ICODE][/SIZE]<br><br>"+
               "[B][CENTER][FONT=times new roman][COLOR=#FF0000][ICODE]<br>[/ICODE][/COLOR] [ICODE]Нарушение одного из пунктов Общих правил ограблений и похищений[/ICODE][Color=#ff0000][ICODE]Jail (от 10 до 60 минут) // Warn // Ban.[/ICODE][/COLOR]<br><br>"+
      '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
         "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#45fc03][ICODE]Одобрено.[/ICODE][/SIZE][/COLOR]<br><br>"+
    "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] Vladimir[/SIZE][/B][/COLOR]",
      prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: 'Уход от RP',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 251, 152, 0.5)',
	  content:
'[COLOR=#FF00FF][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE]Игрок будет наказан по следующему пункту правил:[/ICODE][/SIZE]<br><br>"+
              "[B][CENTER][FONT=times new roman][COLOR=#FF0000][ICODE]2.02.<br>[/ICODE][/COLOR] [ICODE]Запрещено целенаправленно уходить от Role Play процесса всеразличными способами[/ICODE][Color=#ff0000][ICODE]Jail 30 минут / Warn.[/ICODE][/COLOR]<br><br>"+
      '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#45fc03]Одобрено.[/SIZE][/COLOR]<br><br>"+
    "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] Vladimir[/SIZE][/B][/COLOR]",
   prefix: ACCEPT_PREFIX,
	  status: false,
},
 
 
{
	  title: 'Аморал',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 251, 152, 0.5)',
	  content:
'[COLOR=#FF00FF][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE]Игрок будет наказан по следующему пункту правил:[/ICODE][/SIZE]<br><br>"+
    "[B][CENTER][FONT=times new roman][COLOR=#FF0000][ICODE]2.08.<br>[/ICODE][/COLOR] [ICODE] Запрещена любая форма аморальных действий сексуального характера в сторону игроков[/ICODE][Color=#ff0000][ICODE]Jail 30 минут / Warn.[/ICODE][/COLOR]<br><br>"+
      '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
         "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#45fc03][ICODE]Одобрено.[/ICODE][/SIZE][/COLOR]<br><br>"+
    "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] Vladimir[/SIZE][/B][/COLOR]",
      prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: 'Затягивание RP',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 251, 152, 0.5)',
	  content:
'[COLOR=#FF00FF][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE]Игрок будет наказан по следующему пункту правил:[/ICODE][/SIZE]<br><br>"+
     "[B][CENTER][FONT=times new roman][COLOR=#FF0000][ICODE]<br>[/ICODE][/COLOR] [ICODE]  Запрещено целенаправленное затягивание Role Play процесса[/ICODE][Color=#ff0000][ICODE]Jail 30 минут .[/ICODE][/COLOR]<br><br>"+
      '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
         "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#45fc03][ICODE]Одобрено.[/ICODE][/SIZE][/COLOR]<br><br>"+
    "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] Vladimir[/SIZE][/B][/COLOR]",
      prefix: ACCEPT_PREFIX,
	  status: false,
},
           {
	  title: 'помеха в работе блогеров',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 251, 152, 0.5)',
	  content:
'[COLOR=#FF00FF][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE]Игрок будет наказан по следующему пункту правил:[/ICODE][/SIZE]<br><br>"+
     "[B][CENTER][FONT=times new roman][COLOR=#FF0000][ICODE]2.12.<br>[/ICODE][/COLOR] [ICODE]  Запрещена помеха в работе блогеров, стримеров (медиа лиц), которые находятся на официальном сотрудничестве с проектом[/ICODE][Color=#ff0000][ICODE]Ban 7 дней.[/ICODE][/COLOR]<br><br>"+
      '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
         "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#45fc03][ICODE]Одобрено.[/ICODE][/SIZE][/COLOR]<br><br>"+
    "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] Vladimir[/SIZE][/B][/COLOR]",
      prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: 'NonRP Nick',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 251, 152, 0.5)',
	  content:
'[COLOR=#FF00FF][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE]Игрок будет наказан по следующему пункту правил:[/ICODE][/SIZE]<br><br>"+
    "[B][CENTER][FONT=times new roman][COLOR=#FF0000][ICODE]4.06.<br>[/ICODE][/COLOR] [ICODE]  Никнейм игрового аккаунта должен быть в формате Имя_Фамилия на английском языке [/ICODE][Color=#ff0000][ICODE]Устное замечание + смена игрового никнейм.[/ICODE][/COLOR]<br><br>"+
      '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
         "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#45fc03][ICODE]Одобрено.[/ICODE][/SIZE][/COLOR]<br><br>"+
    "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] Vladimir[/SIZE][/B][/COLOR]",
      prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: 'Oск. Nick',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 251, 152, 0.5)',
	  content:
'[COLOR=#FF00FF][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE]Игрок будет наказан по следующему пункту правил:[/ICODE][/SIZE]<br><br>"+
       "[B][CENTER][FONT=times new roman][COLOR=#FF0000][ICODE]4.09.<br>[/ICODE][/COLOR] [ICODE]Запрещено использовать никнейм, содержащий в себе матерные слова или оскорбления (в том числе, завуалированные)[/ICODE][Color=#ff0000][ICODE]Устное замечание + смена игрового никнейма / PermBan[/ICODE][/COLOR]<br><br>"+
      '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#45fc03][ICODE]Одобрено.[/ICODE][/SIZE][/COLOR]<br><br>"+
    "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] Vladimir[/SIZE][/B][/COLOR]",
      prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: 'Fake',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 251, 152, 0.5)',
	  content:
'[COLOR=#FF00FF][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE]Игрок будет наказан по следующему пункту правил:[/ICODE][/SIZE]<br><br>"+
           "[B][CENTER][FONT=times new roman][COLOR=#FF0000][ICODE]4.10.<br>[/ICODE][/COLOR] [ICODE] Запрещено создавать никнейм, повторяющий или похожий на существующие никнеймы игроков или администраторов по их написанию [/ICODE][Color=#ff0000][ICODE] Устное замечание + смена игрового никнейма / PermBan[/ICODE][/COLOR]<br><br>"+
      '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
         "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#45fc03][ICODE]Одобрено.[/ICODE][/SIZE][/COLOR]<br><br>"+
    "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] Vladimir[/SIZE][/B][/COLOR]",
      prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: 'Запрещено уязвимостью правил ',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 251, 152, 0.5)',
	  content:
'[COLOR=#FF00FF][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE]Игрок будет наказан по следующему пункту правил:[/ICODE][/SIZE]<br><br>"+
      "[B][CENTER][FONT=times new roman][COLOR=#FF0000][ICODE]2.33.<br>[/ICODE][/COLOR] [ICODE]Запрещено пользоваться уязвимостью правил [/ICODE][Color=#ff0000][ICODE] Ban 15 - 30 дней / PermBan[/ICODE][/COLOR]<br><br>"+
      '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
         "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#45fc03][ICODE]Одобрено.[/ICODE][/SIZE][/COLOR]<br><br>"+
    "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] Vladimir[/SIZE][/B][/COLOR]",
     prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: 'ЕПП',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 251, 152, 0.5)',
	  content:
'[COLOR=#FF00FF][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][COLOR=ffffff]Игрок будет наказан по следующему пункту правил:[/SIZE]<br><br>"+
          "[B][CENTER][FONT=times new roman][COLOR=#FF0000][ICODE]2.47.<br>[/ICODE][/COLOR] [ICODE] Запрещено ездить по полям на грузовом транспорте, инкассаторских машинах (работа дальнобойщика, инкассатора) [/ICODE][Color=#ff0000][ICODE]  Jail 60 минут[/ICODE][/COLOR]<br><br>"+
      '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
         "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#45fc03][ICODE]Одобрено.[/ICODE][/SIZE][/COLOR]<br><br>"+
    "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] Vladimir[/SIZE][/B][/COLOR]",
         prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: 'Арест на аукционе',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 251, 152, 0.5)',
	  content:
'[COLOR=#FF00FF][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE]Игрок будет наказан по следующему пункту правил:[/ICODE][/SIZE]<br><br>"+
     "[B][CENTER][FONT=times new roman][COLOR=#FF0000][ICODE]2.50.<br>[/ICODE][/COLOR] [ICODE] Запрещены задержания, аресты, а также любые действия со стороны игроков, состоящих во фракциях в интерьере аукциона [/ICODE][Color=#ff0000][ICODE]  Ban 7 - 15 дней + увольнение из организации[/ICODE][/COLOR]<br><br>"+
      '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
         "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#45fc03][ICODE]Одобрено.[/ICODE][/SIZE][/COLOR]<br><br>"+
    "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] Vladimir[/SIZE][/B][/COLOR]",
      prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: 'NonRP аксессуар',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 251, 152, 0.5)',
	  content:
'[COLOR=#FF00FF][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE]Игрок будет наказан по следующему пункту правил:[/ICODE][/SIZE]<br><br>"+
         "[B][CENTER][FONT=times new roman][COLOR=#FF0000][ICODE]2.52.<br>[/ICODE][/COLOR] [ICODE]  Запрещено располагать аксессуары на теле персонажа, нарушая нормы морали и этики, увеличивать аксессуары до слишком большого размера[/ICODE][Color=#ff0000][ICODE]  При первом нарушении - обнуление аксессуаров, при повторном нарушении - обнуление аксессуаров + JAIL 30 минут [/ICODE][/COLOR]<br><br>"+
      '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
         "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#45fc03][ICODE]Одобрено.[/ICODE][/SIZE][/COLOR]<br><br>"+
  "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] Vladimir[/SIZE][/B][/COLOR]",
      prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: 'Мат в названии Бизнеса',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 251, 152, 0.5)',
	  content:
'[COLOR=#FF00FF][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE]Игрок будет наказан по следующему пункту правил:[/ICODE][/SIZE]<br><br>"+
        "[B][CENTER][FONT=times new roman][COLOR=#FF0000][ICODE]2.53.<br>[/ICODE][/COLOR] [ICODE] Запрещено устанавливать названия для внутриигровых ценностей с использованием нецензурной лексики, оскорблений, слов политической или религиозной направленности [/ICODE][Color=#ff0000][ICODE]Принудительная смена названия семьи / Ban 1 день / При повторном нарушении – обнуление бизнеса.[/ICODE][/COLOR]<br><br>"+
      '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
         "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#45fc03][ICODE]Одобрено.[/ICODE][/SIZE][/COLOR]<br><br>"+
    "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] Vladimir[/SIZE][/B][/COLOR]",
      prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: 'Багоюз анимации',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 251, 152, 0.5)',
	  content:
'[COLOR=#FF00FF][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff]Игрок будет наказан по следующему пункту правил:<br><br>"+
         "[B][CENTER][FONT=times new roman][COLOR=#FF0000][ICODE]2.55.<br>[/ICODE][/COLOR] [ICODE] Запрещается багоюз связанный с анимацией в любых проявлениях[/ICODE][Color=#ff0000][ICODE]Jail 60 / 120 минут[/ICODE][/COLOR]<br><br>"+
      '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
         "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#45fc03][ICODE]Одобрено.[/ICODE][/SIZE][/COLOR]<br><br>"+
    "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] Vladimir[/SIZE][/B][/COLOR]",
      prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: 'Работа в форме',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 251, 152, 0.5)',
	  content:
'[COLOR=#FF00FF][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE]Игрок будет наказан по следующему пункту правил:[/ICODE][/SIZE]<br><br>"+
    "[B][CENTER][FONT=times new roman][COLOR=#FF0000][ICODE].<br>[/ICODE][/COLOR] [ICODE] Всем сотрудникам государственных организаций запрещено выполнять работы где-либо в форме, принадлежащей своей фракции [/ICODE][Color=#ff0000][ICODE] Jail 30 минут[/ICODE][/COLOR]<br><br>"+
      '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
         "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#45fc03][ICODE]Одобрено.[/ICODE][/SIZE][/COLOR]<br><br>"+
    "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] Vladimir[/SIZE][/B][/COLOR]",
      prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: 'Казино в форме',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 251, 152, 0.5)',
	  content:
'[COLOR=#FF00FF][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE]Игрок будет наказан по следующему пункту правил:[/ICODE][/SIZE]<br><br>"+
        "[B][CENTER][FONT=times new roman][COLOR=#FF0000][ICODE]1.13.<br>[/ICODE][/COLOR] [ICODE] Запрещено находиться в форме внутри казино, а также устраиваться на сторонние работы в форме фракции [/ICODE][Color=#ff0000][ICODE] Jail 30 минут[/ICODE][/COLOR]<br><br>"+
      '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
         "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#45fc03][ICODE]Одобрено.[/ICODE][/SIZE][/COLOR]<br><br>"+
    "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] Vladimir[/SIZE][/B][/COLOR]",
      prefix: ACCEPT_PREFIX,
	  status: false,
},
     {
	  title: 'Помеха медиалицам',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 251, 152, 0.5)',
	  content:
'[COLOR=#FF00FF][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE]Игрок будет наказан по следующему пункту правил:[/ICODE][/SIZE]<br><br>"+
                 "[B][CENTER][FONT=times new roman][COLOR=#FF0000][ICODE]2.12.<br>[/ICODE][/COLOR] [ICODE]Запрещена помеха в работе блогеров, стримеров (медиа лиц), которые находятся на официальном сотрудничестве с проектом[/ICODE][Color=#ff0000][ICODE]Ban 7 дней.[/ICODE][/COLOR]<br><br>"+
      '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
         "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#45fc03][ICODE]Одобрено.[/ICODE][/SIZE][/COLOR]<br><br>"+
         "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] Vladimir[/SIZE][/B][/COLOR]",
      prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: 'Т/С в личных целях',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 251, 152, 0.5)',
	  content:
'[COLOR=#FF00FF][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE]Игрок будет наказан по следующему пункту правил:[/ICODE][/SIZE]<br><br>"+
    "[B][CENTER][FONT=times new roman][COLOR=#FF0000][ICODE]1.08.<br>[/ICODE][/COLOR] [ICODE]Запрещено использование фракционного транспорта в личных целях[/ICODE][Color=#ff0000][ICODE] Jail 30 минут[/ICODE][/COLOR]<br><br>"+
      '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
         "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#45fc03][ICODE]Одобрено.[/ICODE][/SIZE][/COLOR]<br><br>"+
    "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] Vladimir[/SIZE][/B][/COLOR]",
      prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: 'Редактирование в личных целях /ad',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 251, 152, 0.5)',
	  content:
'[COLOR=#FF00FF][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE]Игрок будет наказан по следующему пункту правил:[/ICODE][/SIZE]<br><br>"+
        "[B][CENTER][FONT=times new roman][COLOR=#FF0000][ICODE]4.04.<br>[/ICODE][/COLOR] [ICODE] Запрещено редактировать поданные объявления в личных целях заменяя текст объявления на несоответствующий отправленному игроком [/ICODE][Color=#ff0000][ICODE]Ban 7 дней + ЧС организации[/ICODE][/COLOR]<br><br>"+
      '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
         "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#45fc03][ICODE]Одобрено.[/ICODE][/SIZE][/COLOR]<br><br>"+
    "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] Vladimir[/SIZE][/B][/COLOR]",
      prefix: ACCEPT_PREFIX,
	  status: false,
},
           {
	  title: 'Редактирование в личных целях /ad',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 251, 152, 0.5)',
	  content:
'[COLOR=#FF00FF][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE]Игрок будет наказан по следующему пункту правил:[/ICODE][/SIZE]<br><br>"+
        "[B][CENTER][FONT=times new roman][COLOR=#FF0000][ICODE]4.05.<br>[/ICODE][/COLOR] [ICODE] Запрещена передача либо трансфер игровых ценностей, между игровыми аккаунтами либо серверами, а также в целях удержания имущества [/ICODE][Color=#ff0000][ICODE]Ban 15 - 30 дней / PermBan[/ICODE][/COLOR]<br><br>"+
      '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
         "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#45fc03][ICODE]Одобрено.[/ICODE][/SIZE][/COLOR]<br><br>"+
    "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] Vladimir[/SIZE][/B][/COLOR]",
      prefix: ACCEPT_PREFIX,
	  status: false,
},
{
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴✅️На рассмотрение✅️╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴'
},
               {
	  title: 'На рассмотрении',
       dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
	  content:
 
'[COLOR=#FF00FF][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE]Ваша жалоба взята на рассмотрение, пожалуйста ожидайте ответа и не нужно создавать повторные темы.[/ICODE][/SIZE]<br><br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
       "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#ffff00][ICODE]На рассмотрении.[/ICODE][/SIZE][/CENTER]<br><br>" +
                   "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] Vladimir[/SIZE][/B][/COLOR]",
	  prefix: PIN_PREFIX,
	  status: true,
},
 
{
    	  title: 'Передано ГКФ-у',
     dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
	  content:
 
'[COLOR=#FF00FF][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE]Ваша жалоба передана Главному Куратору Форума, пожалуйста ожидайте ответа и не нужно создавать повторные темы.[/ICODE][/SIZE]<br><br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
       "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#ffff00][ICODE]На рассмотрении.[/ICODE][/SIZE][/CENTER]<br><br>" +
    "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] Vladimir[/SIZE][/B][/COLOR]",
	  prefix: PIN_PREFIX,
	  status: true,
},{
    	  title: 'Передано ЗГКФ-у',
     dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
	  content:
 
'[COLOR=#FF00FF][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE]Ваша жалоба передана Заместителю Главного Куратора Форума, пожалуйста, ожидайте ответа, и не нужно создавать повторные темы..[/ICODE][/SIZE]<br><br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
       "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#ffff00][ICODE]На рассмотрении.[/ICODE][/SIZE][/CENTER]<br><br>" +
    "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] Vladimir[/SIZE][/B][/COLOR]",
	  prefix: PIN_PREFIX,
	  status: true,
},
           {
    	  title: 'Передано ГКФ-у- ЗГКФ',
     dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
	  content:
'[COLOR=#FF00FF][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE]Ваша жалоба передана Главному Куратору Форума // Заместителю Главного Куратора Форума, пожалуйста ожидайте ответа и не нужно создавать повторные темы.[/ICODE][/SIZE]<br><br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
       "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#ffff00][ICODE]На рассмотрении.[/ICODE][/SIZE][/CENTER]<br><br>" +
    "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] Vladimir[/SIZE][/B][/COLOR]",
	  prefix: PIN_PREFIX,
	  status: true,
},
{
	  title: 'Передано Тех. спецу',
     dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
	  content:
 
'[COLOR=#FF00FF][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE]Ваша жалоба передана Техническому Специалисту, пожалуйста ожидайте ответа и не нужно создавать повторные темы.[/ICODE][/SIZE]<br><br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#0000ff][ICODE]Техническому Специалисту.[/ICODE][/SIZE][/COLOR]<br><br>" +
    "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] Vladimir[/SIZE][/B][/COLOR]",
      prefix: TEX_PREFIX,
	  status: true,
},
{
	  title: 'Передано ГА',
     dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
	  content:
 
'[COLOR=#FF00FF][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE]Ваша жалоба передана Главному Администратору, пожалуйста ожидайте ответа и не нужно создавать повторные темы.[/ICODE][/SIZE]<br><br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#ff0000][ICODE]Главному Администратору.[/ICODE][/SIZE][/COLOR]<br><br>" +
    "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] Vladimir[/SIZE][/B][/COLOR]",
	  prefix: GA_PREFIX,
	  status: true,
},
{
      title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴✅️Жалобы для ГКФ✅️╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴'
 
},
{
	  title: 'Оскорбление // Упом. родни',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 251, 152, 0.5)',
	  content:
'[COLOR=#FF00FF][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE]Игрок будет наказан по следующему пункту правил:[/ICODE][/SIZE]<br><br>"+
         "[B][CENTER][FONT=times new roman][COLOR=#FF0000][ICODE]3.04.<br>[/ICODE][/COLOR] [ICODE] Запрещено оскорбление или косвенное упоминание родных вне зависимости от чата [/ICODE][Color=#ff0000][ICODE] Mute 120 минут / Ban 7 - 15 дней[/ICODE][/COLOR]<br><br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
         "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#45fc03][ICODE]Одобрено.[/ICODE][/SIZE][/COLOR]<br><br>"+
    "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] Vladimir[/SIZE][/B][/COLOR]",
      prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: 'Оскорбление',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 251, 152, 0.5)',
	  content:
'[COLOR=#FF00FF][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE]Игрок будет наказан по следующему пункту правил:[/ICODE][/SIZE]<br><br>"+
     "[B][CENTER][FONT=times new roman][COLOR=#FF0000][ICODE]3.03.<br>[/ICODE][/COLOR] [ICODE] Любые формы оскорблений, издевательств, расизма, дискриминации, религиозной враждебности, сексизма в OOC чате запрещены[/ICODE][Color=#ff0000][ICODE]  Mute 30 минут[/ICODE][/COLOR]<br><br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
         "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#45fc03][ICODE]Одобрено.[/ICODE][/SIZE][/COLOR]<br><br>"+
    "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] Vladimir[/SIZE][/B][/COLOR]",
        prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: 'Оск. Адм',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 251, 152, 0.5)',
	  content:
'[COLOR=#FF00FF][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE]Игрок будет наказан по следующему пункту правил:[/ICODE][/SIZE]<br><br>"+
         "[B][CENTER][FONT=times new roman][COLOR=#FF0000][ICODE]2.54.<br>[/ICODE][/COLOR] [ICODE] Запрещено неуважительное обращение, оскорбление, неадекватное поведение, угрозы в любом их проявлении по отношению к администрации[/ICODE][Color=#ff0000][ICODE]  Mute 180 минут[/ICODE][/COLOR]<br><br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
         "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#45fc03][ICODE]Одобрено.[/ICODE][/SIZE][/COLOR]<br><br>"+
    "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] Vladimir[/SIZE][/B][/COLOR]",
      prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: 'Оск. проекта',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 251, 152, 0.5)',
	  content:
'[COLOR=#FF00FF][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE]Игрок будет наказан по следующему пункту правил:[/ICODE][/SIZE]<br><br>"+
             "[B][CENTER][FONT=times new roman][COLOR=#FF0000][ICODE]2.40.<br>[/ICODE][/COLOR] [ICODE] Запрещены совершенно любые деструктивные действия по отношению к проекту: неконструктивная критика, призывы покинуть проект, попытки нарушить развитие проекта или любые другие действия, способные привести к помехам в игровом процессе[/ICODE][Color=#ff0000][ICODE]   Mute 300 минут / Ban 30 дней[/ICODE][/COLOR]<br><br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
         "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#45fc03][ICODE]Одобрено.[/ICODE][/SIZE][/COLOR]<br><br>"+
    "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] Vladimir[/SIZE][/B][/COLOR]",
      prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: 'CapsLock',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 251, 152, 0.5)',
	  content:
'[COLOR=#FF00FF][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE]Игрок будет наказан по следующему пункту правил:[/ICODE][/SIZE]<br><br>"+
      "[B][CENTER][FONT=times new roman][COLOR=#FF0000][ICODE]3.02.<br>[/ICODE][/COLOR] [ICODE]Запрещено использование верхнего регистра (CapsLock) при написании любого текста в любом чате [/ICODE][Color=#ff0000][ICODE]  Mute 30 минут[/ICODE][/COLOR]<br><br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
         "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#45fc03][ICODE]Одобрено.[/ICODE][/SIZE][/COLOR]<br><br>"+
    "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] Vladimir[/SIZE][/B][/COLOR]",
      prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: 'Flood',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 251, 152, 0.5)',
	  content:
'[COLOR=#FF00FF][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE]Игрок будет наказан по следующему пункту правил:[/ICODE][/SIZE]<br><br>"+
    "[B][CENTER][FONT=times new roman][COLOR=#FF0000][ICODE]3.05.<br>[/ICODE][/COLOR] [ICODE]Запрещен флуд — 3 и более повторяющихся сообщений от одного и того же игрока [/ICODE][Color=#ff0000][ICODE]   Mute 30 минут[/ICODE][/COLOR]<br><br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
         "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#45fc03][ICODE]Одобрено.[/ICODE][/SIZE][/COLOR]<br><br>"+
    "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] Vladimir[/SIZE][/B][/COLOR]",
         prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: 'Meta Gaming',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 251, 152, 0.5)',
	  content:
'[COLOR=#FF00FF][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE]Игрок будет наказан по следующему пункту правил:[/ICODE][/SIZE]<br><br>"+
        "[B][CENTER][FONT=times new roman][COLOR=#FF0000][ICODE]2.18.<br>Запрещен MG (MetaGaming)[/ICODE][/COLOR] [ICODE]использование ООС информации, которую Ваш персонаж никак не мог получить в IC процессе[/ICODE][Color=#ff0000][ICODE]   Mute 30 минут[/ICODE][/COLOR]<br><br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
         "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#45fc03][ICODE]Одобрено.[/ICODE][/SIZE][/COLOR]<br><br>"+
    "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] Vladimir[/SIZE][/B][/COLOR]",
      prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: 'Политическая // Религ. пропоганда',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 251, 152, 0.5)',
	  content:
'[COLOR=#FF00FF][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE]Игрок будет наказан по следующему пункту правил:[/ICODE][/SIZE]<br><br>"+
            "[B][CENTER][FONT=times new roman][COLOR=#FF0000][ICODE]3.18.<br>)[/ICODE][/COLOR] [ICODE]Запрещено политическое и религиозное пропагандирование, а также провокация игроков к конфликтам, коллективному флуду или беспорядкам в любом из чатов[/ICODE][Color=#ff0000][ICODE]Mute 120 минут / Ban 10 дней[/ICODE][/COLOR]<br><br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
         "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#45fc03][ICODE]Одобрено.[/ICODE][/SIZE][/COLOR]<br><br>"+
    "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] Vladimir[/SIZE][/B][/COLOR]",
      prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: 'Н/ПРО',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 251, 152, 0.5)',
	  content:
'[COLOR=#FF00FF][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE]Игрок будет наказан по следующему пункту правил:[/ICODE][/SIZE]<br><br>"+
     "[B][CENTER][FONT=times new roman][COLOR=#FF0000][ICODE]4.01.<br>[/ICODE][/COLOR][ICODE] Запрещено редактирование объявлений, не соответствующих ПРО[/ICODE][Color=#ff0000][ICODE] Mute 30 минут[/ICODE][/COLOR]<br><br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
         "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#45fc03][ICODE]Одобрено.[/ICODE][/SIZE][/COLOR]<br><br>"+
    "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] Vladimir[/SIZE][/B][/COLOR]",
      prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: 'Объявления в ГОСС',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 251, 152, 0.5)',
	  content:
'[COLOR=#FF00FF][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE]Игрок будет наказан по следующему пункту правил:[/ICODE][/SIZE]<br><br>"+
         "[B][CENTER][FONT=times new roman][COLOR=#FF0000][ICODE]3.22.<br>[/ICODE][/COLOR][ICODE]Запрещено публиковать любые объявления в помещениях государственных организаций вне зависимости от чата (IC или OOC)[/ICODE][Color=#ff0000][ICODE] Mute 30 минут[/ICODE][/COLOR]<br><br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
         "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#45fc03][ICODE]Одобрено.[/ICODE][/SIZE][/COLOR]<br><br>"+
    "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] Vladimir[/SIZE][/B][/COLOR]",
      prefix: ACCEPT_PREFIX,
	  status: false,
},
           {
	  title: 'Запрещено скрывать баги системы',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 251, 152, 0.5)',
	  content:
'[COLOR=#FF00FF][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE]Игрок будет наказан по следующему пункту правил:[/ICODE][/SIZE]<br><br>"+
         "[B][CENTER][FONT=times new roman][COLOR=#FF0000][ICODE]2.23.<br>[/ICODE][/COLOR][ICODE]Запрещено скрывать от администрации ошибки игровых систем, а также распространять их игрокам[/ICODE][Color=#ff0000][ICODE]Ban 15 - 30 дней / PermBan[/ICODE][/COLOR]<br><br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
         "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#45fc03][ICODE]Одобрено.[/ICODE][/SIZE][/COLOR]<br><br>"+
    "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] Vladimir[/SIZE][/B][/COLOR]",
      prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: 'Выдача себя за администратора',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 251, 152, 0.5)',
	  content:
'[COLOR=#FF00FF][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE]Игрок будет наказан по следующему пункту правил:[/ICODE][/SIZE]<br><br>"+
      "[B][CENTER][FONT=times new roman][COLOR=#FF0000][ICODE]3.10.<br>[/ICODE][/COLOR][ICODE]Запрещена выдача себя за администратора, если таковым не являетесь[/ICODE][Color=#ff0000][ICODE] Ban 7 - 15 а[/ICODE][/COLOR]<br><br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
         "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#45fc03][ICODE]Одобрено.[/ICODE][/SIZE][/COLOR]<br><br>"+
    "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] Vladimir[/SIZE][/B][/COLOR]",
      prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: 'Реклама промо',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 251, 152, 0.5)',
	  content:
'[COLOR=#FF00FF][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE]Игрок будет наказан по следующему пункту правил:[/ICODE][/SIZE]<br><br>"+
          "[B][CENTER][FONT=times new roman][COLOR=#FF0000][ICODE]2.31.<br>[/ICODE][/COLOR][ICODE] Запрещено рекламировать на серверах любые проекты, серверы, сайты, сторонние Discord-серверы, YouTube-каналы и тому подобное[/ICODE][Color=#ff0000][ICODE] Ban 7 дней / PermBan[/ICODE][/COLOR]<br><br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
         "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#45fc03][ICODE]Одобрено.[/ICODE][/SIZE][/COLOR]<br><br>"+
    "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] Vladimir[/SIZE][/B][/COLOR]",
      prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: 'Продажа промо',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 251, 152, 0.5)',
	  content:
'[COLOR=#FF00FF][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE]Игрок будет наказан по следующему пункту правил:[/ICODE][/SIZE]<br><br>"+
              "[B][CENTER][FONT=times new roman][COLOR=#FF0000][ICODE]2.43.<br>[/ICODE][/COLOR][ICODE]Запрещена продажа / обмен / покупка поощрительной составляющей от лица проекта, будь то бонус-код, либо промокод, который выдается безвозмездно игрокам в целях промоакций[/ICODE][Color=#ff0000][ICODE]Mute 120 минут[/ICODE][/COLOR]<br><br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
         "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#45fc03][ICODE]Одобрено.[/ICODE][/SIZE][/COLOR]<br><br>"+
    "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] Vladimir[/SIZE][/B][/COLOR]",
      prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: 'OОC угрозы',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 251, 152, 0.5)',
	  content:
'[COLOR=#FF00FF][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE]Игрок будет наказан по следующему пункту правил:[/ICODE][/SIZE]<br><br>"+
         "[B][CENTER][FONT=times new roman][COLOR=#FF0000][ICODE]2.37.<br>[/ICODE][/COLOR][ICODE]Запрещены OOC-угрозы, в том числе и завуалированные, а также угрозы наказанием со стороны администрации[/ICODE][Color=#ff0000][ICODE] Mute 120 минут / Ban 7 - 15 дней.[/ICODE][/COLOR]<br><br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
         "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#45fc03][ICODE]Одобрено.[/ICODE][/SIZE][/COLOR]<br><br>"+
    "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] Vladimir[/SIZE][/B][/COLOR]",
      prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: 'Попытка ПИВ',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 251, 152, 0.5)',
	  content:
'[COLOR=#FF00FF][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE]Игрок будет наказан по следующему пункту правил:[/ICODE][/SIZE]<br><br>"+
             "[B][CENTER][FONT=times new roman][COLOR=#FF0000][ICODE]2.28.<br>[/ICODE][/COLOR][ICODE]Запрещена покупка/продажа внутриигровой валюты в любых ее проявлениях за реальные деньги [/ICODE][Color=#ff0000][ICODE]PermBan с обнулением аккаунта + ЧС проекта.[/ICODE][/COLOR]<br><br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
         "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#45fc03][ICODE]Одобрено.[/ICODE][/SIZE][/COLOR]<br><br>"+
    "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] Vladimir[/SIZE][/B][/COLOR]",
      prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: 'Обман администрации',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 251, 152, 0.5)',
	  content:
'[COLOR=#FF00FF][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE]Игрок будет наказан по следующему пункту правил:[/ICODE][/SIZE]<br><br>"+
          "[B][CENTER][FONT=times new roman][COLOR=#FF0000][ICODE]2.32.<br>[/ICODE][/COLOR][ICODE]Запрещено введение в заблуждение, обман администрации на всех ресурсах проекта  [/ICODE][Color=#ff0000][ICODE]  Ban 7 - 15 дней|PermBan + ЧС проекта[/ICODE][/COLOR]<br><br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
          "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#45fc03][ICODE]Одобрено.[/ICODE][/SIZE][/COLOR]<br><br>"+
    "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] Vladimir[/SIZE][/B][/COLOR]",
      prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: 'Обход системы',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 251, 152, 0.5)',
	  content:
'[COLOR=#FF00FF][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE]Игрок будет наказан по следующему пункту правил:[/ICODE][/SIZE]<br><br>"+
     "[B][CENTER][FONT=times new roman][COLOR=#FF0000][ICODE]2.21.<br>[/ICODE][/COLOR][ICODE]Запрещено пытаться обходить игровую систему или использовать любые баги сервера [/ICODE][Color=#ff0000][ICODE] Ban 15 - 30 дней / PermBan[/ICODE][/COLOR]<br><br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
         "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#45fc03][ICODE]Одобрено.[/ICODE][/SIZE][/COLOR]<br><br>"+
    "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] Vladimir[/SIZE][/B][/COLOR]",
      prefix: ACCEPT_PREFIX,
	  status: false,
},
           {
	  title: 'распространять лич инф игроков',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 251, 152, 0.5)',
	  content:
'[COLOR=#FF00FF][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE]Игрок будет наказан по следующему пункту правил:[/ICODE][/SIZE]<br><br>"+
     "[B][CENTER][FONT=times new roman][COLOR=#FF0000][ICODE]2.38.<br>[/ICODE][/COLOR][ICODE] Запрещено распространять личную информацию игроков и их родственников  [/ICODE][Color=#ff0000][ICODE]Ban 15 - 30 дней / PermBan + ЧС проекта[/ICODE][/COLOR]<br><br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
         "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#45fc03][ICODE]Одобрено.[/ICODE][/SIZE][/COLOR]<br><br>"+
    "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] Vladimir[/SIZE][/B][/COLOR]",
      prefix: ACCEPT_PREFIX,
	  status: false,
},
 
           {
	  title: 'Мат в Vip',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 251, 152, 0.5)',
	  content:
'[COLOR=#FF00FF][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE]Игрок будет наказан по следующему пункту правил:[/ICODE][/SIZE]<br><br>"+
    "[B][CENTER][FONT=times new roman][COLOR=#FF0000][ICODE]3.23.<br>[/ICODE][/COLOR][ICODE]Запрещено использование нецензурных слов, в том числе завуалированных и литературных в VIP чате   [/ICODE][Color=#ff0000][ICODE] Mute 30 минут[/ICODE][/COLOR]<br><br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
         "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#45fc03][ICODE]Одобрено.[/ICODE][/SIZE][/COLOR]<br><br>"+
    "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] Vladimir[/SIZE][/B][/COLOR]",
      prefix: ACCEPT_PREFIX,
	  status: false,
},
 
{
	  title: 'Злоуп. символами',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 251, 152, 0.5)',
	  content:
'[COLOR=#FF00FF][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
   '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE]Игрок будет наказан по следующему пункту правил:[/ICODE][/SIZE]<br><br>"+
     "[B][CENTER][FONT=times new roman][COLOR=#FF0000][ICODE]3.06.<br>[/ICODE][/COLOR][ICODE]Запрещено злоупотребление знаков препинания и прочих символов[/ICODE][Color=#ff0000][ICODE]  Mute 30 минут[/ICODE][/COLOR]<br><br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
         "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#45fc03][ICODE]Одобрено.[/ICODE][/SIZE][/COLOR]<br><br>"+
    "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] Vladimir[/SIZE][/B][/COLOR]",
      prefix: ACCEPT_PREFIX,
	  status: false,
},
 
{
	  title: 'Слив гл. чата (СМИ)',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 251, 152, 0.5)',
	  content:
'[COLOR=#FF00FF][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE]Игрок будет наказан по следующему пункту правил:[/ICODE][/SIZE]<br><br>"+
         "[B][CENTER][FONT=times new roman][COLOR=#FF0000][ICODE]3.08.<br>[/ICODE][/COLOR][ICODE]Запрещены любые формы «слива» посредством использования глобальных чатов[/ICODE][Color=#ff0000][ICODE] PermBan[/ICODE][/COLOR]<br><br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
         "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#45fc03][ICODE]Одобрено.[/ICODE][/SIZE][/COLOR]<br><br>"+
    "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] Vladimir[/SIZE][/B][/COLOR]",
      prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: 'Ввод в заблуждение командами',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 251, 152, 0.5)',
	  content:
'[COLOR=#FF00FF][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE]Игрок будет наказан по следующему пункту правил:[/ICODE][/SIZE]<br><br>"+
    "[B][CENTER][FONT=times new roman][COLOR=#FF0000][ICODE]3.11.<br>[/ICODE][/COLOR][ICODE]Запрещено введение игроков проекта в заблуждение путем злоупотребления командами  [/ICODE][Color=#ff0000][ICODE] | Ban 15 - 30 дней / PermBan[/ICODE][/COLOR]<br><br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
         "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#45fc03][ICODE]Одобрено.[/ICODE][/SIZE][/COLOR]<br><br>"+
    "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] Vladimir[/SIZE][/B][/COLOR]",
      prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: 'Транслит',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 251, 152, 0.5)',
	  content:
'[COLOR=#FF00FF][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE]Игрок будет наказан по следующему пункту правил:[/ICODE][/SIZE]<br><br>"+
        "[B][CENTER][FONT=times new roman][COLOR=#FF0000][ICODE]3.20.<br>[/ICODE][/COLOR][ICODE]Запрещено использование транслита в любом из чатов  [/ICODE][Color=#ff0000][ICODE] |Mute 30 минут[/ICODE][/COLOR]<br><br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
         "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#45fc03][ICODE]Одобрено.[/ICODE][/SIZE][/COLOR]<br><br>"+
    "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] Vladimir[/SIZE][/B][/COLOR]",
      prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: 'NonRP эфир',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 251, 152, 0.5)',
	  content:
'[COLOR=#FF00FF][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE]Игрок будет наказан по следующему пункту правил:[/ICODE][/SIZE]<br><br>"+
            "[B][CENTER][FONT=times new roman][COLOR=#FF0000][ICODE]4.02.<br>[/ICODE][/COLOR][ICODE]Запрещено проведение эфиров, не соответствующих Role Play правилам и логике [/ICODE][Color=#ff0000][ICODE] |Mute 30 минут[/ICODE][/COLOR]<br><br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
         "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#45fc03][ICODE]Одобрено.[/ICODE][/SIZE][/COLOR]<br><br>"+
    "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] Vladimir[/SIZE][/B][/COLOR]",
      prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: 'Слив склада',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 251, 152, 0.5)',
	  content:
'[COLOR=#FF00FF][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE]Игрок будет наказан по следующему пункту правил:[/ICODE][/SIZE]<br><br>"+
     "[B][CENTER][FONT=times new roman][COLOR=#FF0000][ICODE]2.09.<br>[/ICODE][/COLOR][ICODE]Запрещено сливать склад фракции / семьи путем взятия большого количестве ресурсов, или же брать больше, чем разрешили на самом деле [/ICODE][Color=#ff0000][ICODE] |Ban 15 - 30 дней / PermBan[/ICODE][/COLOR]<br><br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
         "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#45fc03][ICODE]Одобрено.[/ICODE][/SIZE][/COLOR]<br><br>"+
    "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] Vladimir[/SIZE][/B][/COLOR]",
      prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: 'Музыка в Voice',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 251, 152, 0.5)',
	  content:
'[COLOR=#FF00FF][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE]Игрок будет наказан по следующему пункту правил:[/ICODE][/SIZE]<br><br>"+
         "[B][CENTER][FONT=times new roman][COLOR=#FF0000][ICODE]3.14.<br>[/ICODE][/COLOR][ICODE]Запрещено включать музыку в Voice Chat[/ICODE][Color=#ff0000][ICODE] |Mute 60 минут[/ICODE][/COLOR]<br><br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
         "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#45fc03][ICODE]Одобрено.[/ICODE][/SIZE][/COLOR]<br><br>"+
    "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] Vladimir[/SIZE][/B][/COLOR]",
      prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: 'Шумы в Voice',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 251, 152, 0.5)',
	  content:
'[COLOR=#FF00FF][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE]Игрок будет наказан по следующему пункту правил:[/ICODE][/SIZE]<br><br>"+
    "[B][CENTER][FONT=times new roman][COLOR=#FF0000][ICODE]3.16.<br>[/ICODE][/COLOR][ICODE] Запрещено создавать посторонние шумы или звуки[/ICODE][Color=#ff0000][ICODE] | Mute 30 минут[/ICODE][/COLOR]<br><br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
         "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#45fc03][ICODE]Одобрено.[/ICODE][/SIZE][/COLOR]<br><br>"+
    "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] Vladimir[/SIZE][/B][/COLOR]",
      prefix: ACCEPT_PREFIX,
	  status: false,
},
 
           {
	  title: 'Нац. // Рел. конфликт',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 251, 152, 0.5)',
	  content:
'[COLOR=#FF00FF][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE]Игрок будет наказан по следующему пункту правил:[/ICODE][/SIZE]<br><br>"+
               "[B][CENTER][FONT=times new roman][COLOR=#FF0000][ICODE]2.35.<br>[/ICODE][/COLOR][ICODE] На игровых серверах запрещено устраивать IC и OOC конфликты на почве разногласия о национальности и / или религии совершенно в любом формате[/ICODE][Color=#ff0000][ICODE] | Mute 120 минут / Ban 7 дней [/ICODE][/COLOR]<br><br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
         "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#45fc03][ICODE]Одобрено.[/ICODE][/SIZE][/COLOR]<br><br>"+
               "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] Vladimir[/SIZE][/B][/COLOR]",
      prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: 'Изменение голоса софтом',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 251, 152, 0.5)',
	  content:
'[COLOR=#FF00FF][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE]Игрок будет наказан по следующему пункту правил:[/ICODE][/SIZE]<br><br>"+
            "[B][CENTER][FONT=times new roman][COLOR=#FF0000][ICODE]3.19..<br>[/ICODE][/COLOR][ICODE]  Запрещено использование любого софта для изменения голоса [/ICODE][Color=#ff0000][ICODE] | Mute 60 минут[/ICODE][/COLOR]<br><br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
         "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#45fc03][ICODE]Одобрено.[/ICODE][/SIZE][/COLOR]<br><br>"+
    "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] Vladimir[/SIZE][/B][/COLOR]",
      prefix: ACCEPT_PREFIX,
	  status: false,
},
{
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴✅️Перенаправление жалоб✅️╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴'
},
{
	  title: 'В ЖБ на Адм.',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5)',
	  content:
'[COLOR=#FF00FF][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE]Вы ошиблись разделом. Обратитесь в раздел «Жалобы на администрацию». [/ICODE][/SIZE]<br><br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#ff0000][ICODE]Закрыто.[/ICODE][/SIZE][/COLOR]<br><br>" +
    "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] Vladimir[/SIZE][/B][/COLOR]",
      prefix: CLOSE_PREFIX,
	  status: false,
},
{
	  title: 'В ЖБ на ЛД',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5)',
	  content:
'[COLOR=#FF00FF][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE]Вы ошиблись разделом. Обратитесь в раздел «Жалобы на лидеров». [/ICODE][/SIZE]<br><br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#ff0000][ICODE]Закрыто.[/ICODE][/SIZE][/COLOR]<br><br>" +
    "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] Vladimir[/SIZE][/B][/COLOR]",
      prefix: CLOSE_PREFIX,
	  status: false,
},
{
	  title: 'В обжалования',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5)',
	  content:
'[COLOR=#FF00FF][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE]Вы ошиблись разделом. Обратитесь в раздел «Обжалование наказаний».[/ICODE][/SIZE] <br><br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#ff0000][ICODE]Закрыто.[/ICODE][/SIZE][/COLOR]<br><br>" +
    "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] Vladimir[/SIZE][/B][/COLOR]",
      prefix: CLOSE_PREFIX,
	  status: false,
},
{
	  title: 'В тех. раздел',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5)',
	  content:
'[COLOR=#FF00FF][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE]Вы ошиблись разделом. Обратитесь в технический раздел.[/ICODE][/SIZE] <br><br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#ff0000][ICODE]Закрыто.[/ICODE][/SIZE][/COLOR]<br><br>" +
    "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] Vladimir[/SIZE][/B][/COLOR]",
      prefix: CLOSE_PREFIX,
	  status: false,
},
{
	  title: 'В ЖБ на тех. спец.',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5)',
	  content:
'[COLOR=#FF00FF][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE]Вы ошиблись разделом. Обратитесь в раздел «Жалобы на технических специалистов».[/ICODE][/SIZE] <br><br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#ff0000][ICODE]Закрыто.[/ICODE][/SIZE][/COLOR]<br><br>" +
    "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] Vladimir[/SIZE][/B][/COLOR]",
      prefix: CLOSE_PREFIX,
	  status: false,
},
{
	  title: 'В ЖБ на СС',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5)',
	  content:
'[COLOR=#FF00FF][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE]Вы ошиблись разделом. Обратитесь в раздел соответствующей фракции в «Жалобы на Старший Состав».[/ICODE][/SIZE] <br><br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#ff0000][ICODE]Закрыто.[/ICODE][/SIZE][/COLOR]<br><br>" +
    "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] Vladimir[/SIZE][/B][/COLOR]",
      prefix: CLOSE_PREFIX,
	  status: false,
},
{
	  title: 'В ЖБ на МС',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5)',
	  content:
'[COLOR=#FF00FF][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE]Вы ошиблись разделом. Обратитесь в раздел соответствующей фракции в «Жалобы на сотрудников».[/ICODE][/SIZE] <br><br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#ff0000][ICODE]Закрыто.[/ICODE][/SIZE][/COLOR]<br><br>" +
    "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] Vladimir[/SIZE][/B][/COLOR]",
      prefix: CLOSE_PREFIX,
	  status: false,
},
{
      title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴✅️Отказ в жалобе✅️╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴'
},
           {
	  title: 'через трейд незя',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5)',
	  content:
'[COLOR=#FF00FF][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
    		"[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE]Займ может быть осуществлен только через зачисление игровых ценностей на банковский счет.[/ICODE][/SIZE] <br><br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
      "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#ff0026][ICODE]Отказано.[/ICODE][/SIZE][/COLOR]<br><br>" +
    "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] Vladimir[/SIZE][/B][/COLOR]",
      prefix: UNACCEPT_PREFIX,
	  status: false,
},
            {
     title: 'Администрация не может выдать наказание',
        dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5)',
	  content:
'[COLOR=#FF00FF][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
        "[B][CENTER][COLOR=ffffff][FONT=times new roman][SIZE=4][Color=#ff0000][/color] Администрация не может выдать наказание по вашим доказательствам[/color].[/SIZE][/CENTER][/B]<br><br>"+
        "[B][CENTER][FONT=times new roman][COLOR=#FF0000][ICODE]<br>[/ICODE][/COLOR][ICODE]  Администрация не может выдать наказание по вашим доказательствам[/ICODE][Color=#ff0000][ICODE][/ICODE][/COLOR]<br><br>"+
      '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#ff0026][ICODE]Отказано.[/ICODE][/SIZE][/COLOR]<br><br>" +
                "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] Vladimir[/SIZE][/B][/COLOR]",
      prefix: UNACCEPT_PREFIX,
	  status: false,
     },
{
	  title: 'Нарушений не найдено',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5)',
	  content:
'[COLOR=#FF00FF][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff]Нарушений со стороны данного игрока не было найдено.[/SIZE] <br><br>"+
    		"[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE]Нарушений со стороны данного игрока не было найдено.[/ICODE][/SIZE] <br><br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
      "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#ff0026][ICODE]Отказано.[/ICODE][/SIZE][/COLOR]<br><br>" +
    "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] Vladimir[/SIZE][/B][/COLOR]",
      prefix: UNACCEPT_PREFIX,
	  status: false,
},
{
	  title: 'Наказание уже выдано',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5)',
	  content:
'[COLOR=#FF00FF][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff]Наказание уже было выдано.[/SIZE] <br><br>"+
        		"[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE]Наказание уже было выдано.[/ICODE][/SIZE] <br><br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#ff0000][ICODE]Закрыто.[/ICODE][/SIZE][/COLOR]<br><br>" +
    "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] Vladimir[/SIZE][/B][/COLOR]",
      prefix: CLOSE_PREFIX,
	  status: false,
},
{
    title: 'Дубликат жалобы',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5)',
      content:
'[COLOR=#FF00FF][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff]Данная жалоба - дубликат вашей прошлой жалобы.[/COLOR][/FONT][/SIZE][/CENTER][/B]<br><br>"+
    "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE]Убедительная просьба ознакомиться с правилами подачи жалоб на игроков, закрепленные в данном разделе.[/ICODE][/SIZE] <br><br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
      "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#ff0026][ICODE]Отказано.[/ICODE][/SIZE][/COLOR]<br><br>" +
    "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] Vladimir[/SIZE][/B][/COLOR]",
      prefix: UNACCEPT_PREFIX,
      status: false,
},
{
      title: 'Разные ники',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5)',
      content:
'[COLOR=#FF00FF][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
    "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE]НикНеймы в жалобе и доказательствах отличаются.[/ICODE][/SIZE] <br><br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
      "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#ff0026][ICODE]Отказано.[/ICODE][/SIZE][/COLOR]<br><br>" +
    "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] Vladimir[/SIZE][/B][/COLOR]",
      prefix: UNACCEPT_PREFIX,
    status: false,
},
{
	  title: 'Возврат средств',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5)',
	  content:
'[COLOR=#FF00FF][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE]Администрация сервера не несёт ответственности за утраченные Вами средства при обмане и т.д.[/ICODE][/SIZE] <br><br>"+
    "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE]Убедительная просьба ознакомиться с правилами подачи жалоб на игроков, закрепленные в данном разделе[/ICODE][/SIZE] <br><br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#ff0000][ICODE]Закрыто.[/ICODE][/SIZE][/COLOR]<br><br>" +
    "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] Vladimir[/SIZE][/B][/COLOR]",
      prefix: CLOSE_PREFIX,
	  status: false,
},
{
	  title: 'Недостаточно док-в',
     dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5)',
	  content:
'[COLOR=#FF00FF][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
            "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE]Доказательств на нарушение от данного игрока  недостаточно.[/ICODE][/SIZE] <br><br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
      "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#ff0026][ICODE]Отказано.[/ICODE][/SIZE][/COLOR]<br><br>" +
    "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] Vladimir[/SIZE][/B][/COLOR]",
     prefix: UNACCEPT_PREFIX,
	  status: false,
},
{
	  title: 'Отсутствуют док-ва',
     dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5)',
	  content:
'[COLOR=#FF00FF][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
       "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE]Доказательства на нарушение от данного игрока  отсутствуют.[/ICODE][/SIZE] <br><br>"+
     "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE]Убедительная просьба ознакомиться с правилами подачи жалоб на игроков, закрепленные в данном разделе[/ICODE][/SIZE] <br><br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
      "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#ff0026][ICODE]Отказано.[/ICODE][/SIZE][/COLOR]<br><br>" +
    "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] Vladimir[/SIZE][/B][/COLOR]",
      prefix: UNACCEPT_PREFIX,
	  status: false,
},
{
	  title: 'Док-ва отредактированы',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5)',
	  content:
'[COLOR=#FF00FF][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE]Доказательства на нарушение от данного игрока  отредактированы.[/ICODE][/SIZE] <br><br>"+
		"[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE]Убедительная просьба ознакомиться с правилами подачи жалоб на игроков, закрепленные в данном разделе.[/ICODE][/SIZE]<br><br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
      "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#ff0026][ICODE]Отказано.[/ICODE][/SIZE][/COLOR]<br><br>" +
    "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] Vladimir[/SIZE][/B][/COLOR]",
      prefix: UNACCEPT_PREFIX,
	  status: false,
},
{
	  title: 'Слив семьи (Отказ)',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5)',
	  content:
'[COLOR=#FF00FF][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
     "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE]Доказательств на нарушение от данного игрока недостаточны.Согласно [Color=#ff0000] 2.09 [/color]  пункту общих правил серверов в описании семьи должны быть указаны условия взаимодействия со складом. Если лидер семьи предоставил неограниченный доступ к складу и забыл снять его, администрация не несет ответственности за возможные последствия. Жалобы по данному пункту правил принимаются только от лица лидера семьи. То есть, лидер должен написать жалобу от своего лица, прикрепить видеодоказательство с /time, показать как он заходить в описание семьи, логи взаимодействия со складом семьи и пролистивает до момента нарушения. Жалобы от члена семьи или заместителя лидера семьи не принимаются. [/ICODE][/SIZE] <br><br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#ff0000][ICODE]Закрыто.[/ICODE][/SIZE][/COLOR]<br><br>" +
    "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] Vladimir[/SIZE][/B][/COLOR]",
      prefix: CLOSE_PREFIX,
	  status: false,
},
{
	  title: 'Не по форме',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5)',
	  content:
'[COLOR=#FF00FF][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE]Ваша жалоба составлена не по форме. [/ICODE][/SIZE]<br><br>"+
		"[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE]Убедительная просьба ознакомиться с правилами подачи жалоб на игроков, закрепленные в данном разделе.[/ICODE][/SIZE]<br><br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
      "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#ff0026][ICODE]Отказано.[/ICODE][/SIZE][/COLOR]<br><br>" +
    "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] Vladimir[/SIZE][/B][/COLOR]",
      prefix: UNACCEPT_PREFIX,
	  status: false,
},
{
	  title: 'Нет /time',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5)',
	  content:
'[COLOR=#FF00FF][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE]На ваших доказательствах отсутствует /time. [/ICODE][/SIZE] <br><br>"+
		"[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE]Убедительная просьба ознакомиться с правилами подачи жалоб на игроков, закрепленные в данном разделе.[/ICODE][/SIZE]<br><br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
      "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#ff0026][ICODE]Отказано.[/ICODE][/SIZE][/COLOR]<br><br>" +
    "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] Vladimir[/SIZE][/B][/COLOR]",
      prefix: UNACCEPT_PREFIX,
	  status: false,
},
{
	  title: 'Нет time кодов',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5)',
	  content:
'[COLOR=#FF00FF][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE]На ваших доказательствах отсутствуют time коды. Если видео длится больше 3-ех минут - Вы должны указать time коды нарушений.[/ICODE][/SIZE] <br><br>"+
		"[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE]Убедительная просьба ознакомиться с правилами подачи жалоб на игроков, закрепленные в данном разделе.[/ICODE][/SIZE]<br><br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
      "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#ff0026][ICODE]Отказано.[/ICODE][/SIZE][/COLOR]<br><br>" +
    "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] Vladimir[/SIZE][/B][/COLOR]",
      prefix: UNACCEPT_PREFIX,
	  status: false,
},
{
	  title: 'Более 72-х часов',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5)',
	  content:
'[COLOR=#FF00FF][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE]С момента совершенного нарушения со стороны игрока прошло более 72 часов. Срок написания жалобы составляет три дня (72 часа) с момента совершенного нарушения со стороны игрока сервера.[/ICODE][/SIZE]<br><br>"+
        "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE]Убедительная просьба ознакомиться с правилами подачи жалоб на игроков, закрепленные в данном разделе.[/ICODE][/SIZE]<br><br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#ff0000][ICODE]Закрыто.[/ICODE][/SIZE][/COLOR]<br><br>" +
    "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] Vladimir[/SIZE][/B][/COLOR]",
      prefix: CLOSE_PREFIX,
	  status: false,
},
{
	  title: 'Док-ва загружены не там',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5)',
	  content:
'[COLOR=#FF00FF][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE]Доказательства загружены в постороннем приложении. Загрузка доказательств в Соц. Сетях и т.п. запрещается, доказательства должны быть загружены исключительно на фото/видео хостинге (YouTube, Yapx, Imgur).[/ICODE][/SIZE] <br><br>"+
        "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE]Убедительная просьба ознакомиться с правилами подачи жалоб на игроков, закрепленные в данном разделе.[/ICODE]<br><br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
      "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#ff0026][ICODE]Отказано.[/ICODE][/SIZE][/COLOR]<br><br>" +
    "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] Vladimir[/SIZE][/B][/COLOR]",
      prefix: UNACCEPT_PREFIX,
	  status: false,
},
{
	  title: 'Условия сделки',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5)',
	  content:
'[COLOR=#FF00FF][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE]В ваших доказательствах отсутствуют условия сделки.[/ICODE][/SIZE] <br><br>"+
        "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE]Убедительная просьба ознакомиться с правилами подачи жалоб на игроков, закрепленные в данном разделе.[/ICODE][/SIZE]<br><br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
      "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#ff0026][ICODE]Отказано.[/ICODE][/SIZE][/COLOR]<br><br>" +
    "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] Vladimir[/SIZE][/B][/COLOR]",
      prefix: UNACCEPT_PREFIX,
	  status: false,
},
{
	  title: 'Нужен фрапс',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5)',
	  content:
'[COLOR=#FF00FF][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE]Доказательств на нарушение от данного игрока недостаточно. В данной ситуации необходим фрапс (запись экрана).[/ICODE][/SIZE] <br><br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
      "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#ff0026][ICODE]Отказано.[/ICODE][/SIZE][/COLOR]<br><br>" +
    "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] Vladimir[/SIZE][/B][/COLOR]",
      prefix: UNACCEPT_PREFIX,
	  status: false,
},
{
    	  title: 'Промотка чата',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5)',
	  content:
'[COLOR=#FF00FF][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
    	"[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE]Доказательств на нарушение от данного игрока недостаточно, необходим фрапс (запись экрана) + промотка чата.[/ICODE][/SIZE] <br><br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
      "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#ff0026][ICODE]Отказано.[/ICODE][/SIZE][/COLOR]<br><br>" +
    "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] Vladimir[/SIZE][/B][/COLOR]",
      prefix: UNACCEPT_PREFIX,
	  status: false,
},
{
	  title: 'Фрапс обрывается',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5)',
	  content:
'[COLOR=#FF00FF][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
    "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE]Видео-доказательства обрываются. Загрузите полную видеозапись на видео-хостинг YouTube.[/ICODE][/SIZE] <br><br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
      "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#ff0026][ICODE]Отказано.[/ICODE][/SIZE][/COLOR]<br><br>" +
    "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] Vladimir[/SIZE][/B][/COLOR]",
      prefix: UNACCEPT_PREFIX,
	  status: false,
},
{
	  title: 'Док-ва не открываются',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5)',
	  content:
'[COLOR=#FF00FF][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
    "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE]Ваши доказательства не открываются.[/ICODE][/SIZE] <br><br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
      "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#ff0026][ICODE]Отказано.[/ICODE][/SIZE][/COLOR]<br><br>" +
    "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] Vladimir[/SIZE][/B][/COLOR]",
      prefix: UNACCEPT_PREFIX,
	  status: false,
},
{
	  title: 'Жалоба от 3-го лица',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5)',
	  content:
'[COLOR=#FF00FF][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff]Ваша жалоба написана от 3-го лица. Жалоба от третьего лица не принимается (жалоба должна быть подана участником ситуации)..[/ICODE][/SIZE] <br><br>"+
        "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff]Убедительная просьба ознакомиться с правилами подачи жалоб на игроков, закрепленные в данном разделе..[/ICODE][/SIZE]<br><br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#ff0000][ICODE]Закрыто.[/ICODE][/SIZE][/COLOR]<br><br>" +
    "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] Vladimir[/SIZE][/B][/COLOR]",
     prefix: CLOSE_PREFIX,
	  status: false,
},
{
	  title: 'Ошиблись сервером',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5)',
	  content:
'[COLOR=#FF00FF][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE]Вы ошиблись сервером, перенаправляю  вашу жалобу на нужный сервер..[/ICODE][/SIZE] <br><br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#ff0000][ICODE]Жалоба закрыта от оффтопа и находится на рассмотрении администрации вашего сервера..[/ICODE][/SIZE][/COLOR]<br><br>" +
    "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] Vladimir[/SIZE][/B][/COLOR]",
      prefix: UNACCEPT_PREFIX,
	  status: false,
},
           {
      title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴✅️RolePlay Биографии✅️╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴'
},
       {
      title: 'Биография одобрена',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 251, 152, 0.5)',
	  content:
'[COLOR=#FF00FF][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE]Рассмотрев вашу RolePlay биографию я готов вынести вердикт.[/ICODE][/SIZE]<br><br>"+
        "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#45fc03]Одобрено.[/SIZE][/COLOR]<br><br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
           "[B]<br><br>" +
           "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] Vladimir[/SIZE][/B][/COLOR]",
      prefix: ACCEPT_PREFIX,
	  status: false,
},
           {
      title: 'На доработку',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
	  content:
'[COLOR=#FF00FF][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE]В вашей RolePlay - биографии недостаточно информации. Даю вам 24 часа на ее дополнение/исправление, иначе РП биография будет отказана.[/ICODE][/SIZE]<br><br>"+
        "[B][CENTER][FONT=times new roman][COLOR=ffffff] <br><br>"+
        "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#45fc03]На рассмотрении..[/SIZE][/COLOR]<br><br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
        "[B]<br><br>" +
               "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] Vladimir[/SIZE][/B][/COLOR]",
      prefix: PIN_PREFIX,
	  status: true,
},
{
      title: 'На дополнение',
       dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
	  content:
'[COLOR=#FF00FF][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE]Ваша RolePlay биография нарушает правила подачи RolePlay биографий. У вас есть 24 часа на исправление своей биографии.[/ICODE][/SIZE]<br><br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#FF0000]На дополнении.[/SIZE][/COLOR]<br><br>" +
    "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] Vladimir[/SIZE][/B][/COLOR]",
      prefix: PIN_PREFIX,
	  status: true,
},
{
      title: 'Отказ (Не по форме)',
       dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5)',
	  content:
'[COLOR=#FF00FF][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE]Ваша RolePlay биография написана не по форме.[/ICODE][/SIZE]<br><br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
      "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#ff0026][ICODE]Отказано.[/ICODE][/SIZE][/COLOR]<br><br>" +
    "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] Vladimir[/SIZE][/B][/COLOR]",
      prefix: UNACCEPT_PREFIX,
	  status: false,
},
           {
        title: 'Отказ (Нон рп ник)',
              dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5)',
        content:
        "[B][CENTER][COLOR=#FF69B4][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
          "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE]Ваша RolePlay биография была проверена и получает статус - Причина отказа: NonRp NickName.[/ICODE][/SIZE]<br><br>"+
 '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
      "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#ff0026][ICODE]Отказано.[/ICODE][/SIZE][/COLOR]<br><br>" +
             "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] Vladimir[/SIZE][/B][/COLOR]",
 
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
{
      title: 'Отказ (Не заполнена)',
       dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5)',
	  content:
'[COLOR=#FF00FF][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE]Форма RolePlay биографии не заполнена частично либо вовсе не заполнена.[/ICODE][/SIZE]<br><br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
      "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#ff0026][ICODE]Отказано.[/ICODE][/SIZE][/COLOR]<br><br>" +
    "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] Vladimir[/SIZE][/B][/COLOR]",
      prefix: UNACCEPT_PREFIX,
	  status: false,
},
{
      title: 'Отказ (Мало информации)',
       dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5)',
	  content:
'[COLOR=#FF00FF][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE]Недостаточное количество RolePlay информации о вашем персонаже. [/ICODE][/SIZE]<br><br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
      "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#ff0026][ICODE]Отказано.[/ICODE][/SIZE][/COLOR]<br><br>" +
    "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] Vladimir[/SIZE][/B][/COLOR]",
      prefix: UNACCEPT_PREFIX,
	  status: false,
},
{
      title: 'Отказ (Скопирована)',
       dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5)',
	  content:
'[COLOR=#FF00FF][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE]Ваша RolePlay биография скопирована.[/ICODE] [/SIZE]<br><br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
      "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#ff0026][ICODE]Отказано.[/ICODE][/SIZE][/COLOR]<br><br>" +
    "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] Vladimir[/SIZE][/B][/COLOR]",
      prefix: UNACCEPT_PREFIX,
	  status: false,
},
{
      title: 'Отказ (Заголовок)',
       dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5)',
	  content:
'[COLOR=#FF00FF][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE]У вашей RolePlay биографии не верный заголовок.[/ICODE][/SIZE] <br><br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
      "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#ff0026][ICODE]Отказано.[/ICODE][/SIZE][/COLOR]<br><br>" +
    "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] Vladimir[/SIZE][/B][/COLOR]",
      prefix: UNACCEPT_PREFIX,
	  status: false,
},
{
      title: 'Отказ (От 3-го лица)',
       dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5)',
	  content:
'[COLOR=#FF00FF][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE]Ваша RolePlay биография написана от 3-го лица. [/ICODE][/SIZE]<br><br>"+
     '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
      "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#ff0026][ICODE]Отказано.[/ICODE][/SIZE][/COLOR]<br><br>" +
    "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] Vladimir[/SIZE][/B][/COLOR]",
      prefix: UNACCEPT_PREFIX,
	  status: false,
},
          {
        title: ' Отказ (Недостаточно РП информации)',
                 dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5)',
        content:
    "[B][CENTER][COLOR=#FF69B4][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
    "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE]Ваша RolePlay биография была проверена и получает статус - Причина отказа:Недостаточно РП информации.[/ICODE][/SIZE]<br><br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
  "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#ff0026][ICODE]Отказано.[/ICODE][/SIZE][/COLOR]<br><br>" +
    "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] Vladimir[/SIZE][/B][/COLOR]",
 
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
{
  	  title: 'Отказ (Возраст не совпал)',
       dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5)',
	  content:
'[COLOR=#FF00FF][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE]Возраст не совпадает с датой рождения.[/ICODE][/SIZE]<br><br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
      "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#ff0026][ICODE]Отказано.[/ICODE][/SIZE][/COLOR]<br><br>" +
    "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] Vladimir[/SIZE][/B][/COLOR]",
      prefix: UNACCEPT_PREFIX,
	  status: false,
},
{
      title: 'Отказ (Ошибки)',
       dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5)',
	  content:
'[COLOR=#FF00FF][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE]В вашей RolePlay биографии присутствуют грамматические либо пунктуационные ошибки.[/ICODE][/SIZE] <br><br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
      "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#ff0026][ICODE]Отказано.[/ICODE][/SIZE][/COLOR]<br><br>" +
    "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] Vladimir[/SIZE][/B][/COLOR]",
      prefix: UNACCEPT_PREFIX,
	  status: false,
},
       {
      title: 'Отказ (Юность и Взрослая)',
              dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5)',
	  content:
'[COLOR=#FF00FF][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE]Юность и Взрослая жизнь должна начинаться с 18 лет.[/ICODE][/SIZE] <br><br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
      "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#ff0026][ICODE]Отказано.[/ICODE][/SIZE][/COLOR]<br><br>" +
           "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] Vladimir[/SIZE][/B][/COLOR]",
      prefix: UNACCEPT_PREFIX,
	  status: false,
},
       {
      title: 'Отказ (Опечатки)',
              dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5)',
	  content:
'[COLOR=#FF00FF][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE]В вашей RolePlay биографии присутствуют опечатки в словах.[/ICODE][/SIZE] <br><br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
      "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#ff0026][ICODE]Отказано.[/ICODE][/SIZE][/COLOR]<br><br>" +
           "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] Vladimir[/SIZE][/B][/COLOR]",
      prefix: UNACCEPT_PREFIX,
	  status: false,
},
          {
        title: 'Отказ (Орф и пунктуац ошибки)',
                 dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5)',
        content:
                 	"[B][CENTER][COLOR=#FF69B4][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE]Ваша RolePlay биография была проверена и получает статус - Отказано Причина отказа: Орфографические и пунктуационные ошибки.[/ICODE][/SIZE]  <br><br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
      "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#ff0026][ICODE]Отказано.[/ICODE][/SIZE][/COLOR]<br><br>" +
           "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] Vladimir[/SIZE][/B][/COLOR]",
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
       {
        title: 'Отказ (Орфографические ошибки)',
              dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5)',
        content:
           	"[B][CENTER][COLOR=#FF69B4][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE]Ваша RolePlay биография была проверена и получает статус -Отказано Причина отказа:Орфографические ошибки.  [/ICODE][/SIZE]<br><br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
      "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#ff0026][ICODE]Отказано.[/ICODE][/SIZE][/COLOR]<br><br>" +
           "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] Vladimir[/SIZE][/B][/COLOR]",
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
       {
        title: 'Отказ (Пунктуационные ошибки)',
              dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5)',
        content:
        "[B][CENTER][COLOR=#FF69B4][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE]Ваша RolePlay биография была проверена и получает статус - Причина отказа:Пунктуационные ошибки.[/ICODE][/SIZE] <br><br>"+
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
       "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#ff0026][ICODE]Отказано.[/ICODE][/SIZE][/COLOR]<br><br>" +
           "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] Vladimir[/SIZE][/B][/COLOR]",
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
        {
        title: 'Отказ (Вымышленные действия персонажа)',
               dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5)',
        content:
        "[B][CENTER][COLOR=#FF69B4][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE]Ваша RolePlay биография была проверена и получает статус -Причина отказа:Вымышленные действия персонажа [/ICODE][/SIZE]<br><br>"+
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
      "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#ff0026][ICODE]Отказано.[/ICODE][/SIZE][/COLOR]<br><br>" +
            "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] Vladimir[/SIZE][/B][/COLOR]",
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
       {
        title: 'Отказ (Слишком молод)',
              dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5)',
        content:
        "[B][CENTER][COLOR=#FF69B4][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
          "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE]Ваша RolePlay биография была проверена и получает статус -Причина отказа:Некорректен возраст (слишком молод).[/ICODE][/SIZE]<br><br>"+
 '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
      "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#ff0026][ICODE]Отказано.[/ICODE][/SIZE][/COLOR]<br><br>" +
             "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] Vladimir[/SIZE][/B][/COLOR]",
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
          {
        title: 'Отказ (Некоррект национальность)',
                 dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5)',
        content:
        '[COLOR=#FF00FF][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
              "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE]Ваша RolePlay биография была проверена и получает статус -Причина отказа:Некорректная национальность. [/ICODE][/SIZE] <br><br>"+
                '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
          "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#ff0026][ICODE]Отказано.[/ICODE][/SIZE][/COLOR]<br><br>" +
                "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] Vladimir[/SIZE][/B][/COLOR]",
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
           {
      title: 'Отказ (Не по форме) RP ситуация',
       dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5)',
	  content:
'[COLOR=#FF00FF][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE]Выношу следующий вердикт  Отказано.<br>Ваша RP ситуация написана не по форме..[/ICODE][/SIZE]<br><br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
      "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#ff0026][ICODE]Отказано.[/ICODE][/SIZE][/COLOR]<br><br>" +
    "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] Vladimir[/SIZE][/B][/COLOR]",
      prefix: UNACCEPT_PREFIX,
	  status: false,
},
              ];
    $(document).ready(() => {
      // Загрузка скрипта для обработки шаблонов
      $('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');
 
      addAnswers();
      addButton('Свой ответ', 'selectBiographyAnswer', 'border-radius: 13px; margin-right: 5px; margin-left: 5px; margin-bottom: 5px; border: none; background: #483D8B');
      addButton('На рассмотрении', 'pin', 'border-radius: 13px; margin-right: 5px; margin-bottom: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5);');
      addButton('Одобрено', 'accepted', 'border-radius: 13px; margin-right: 5px; margin-bottom: 5px; border: 2px solid; border-color: rgb(152, 251, 152, 0.5);');
      addButton('Отказано', 'unaccept', 'border-radius: 13px; margin-right: 5px; margin-bottom: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5);');
      addButton('Закрыто', 'closed', 'border-radius: 13px; margin-right: 5px; margin-bottom: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5);');
      addButton('Теху', 'techspec', 'border-radius: 13px; margin-right: 5px; margin-bottom: 5px; border: 2px solid; border-color: rgb(36, 33, 209, 0.5);');
      addButton('ГА', 'mainadm', 'border-radius: 13px; margin-right: 5px; margin-bottom: 5px; border: 2px solid; border-color: rgb(235, 21, 21, 0.5);');
	// Поиск информации о теме
		const threadData = getThreadData();
 
	$(`button#ff`).click(() => pasteContent(8, threadData, true));
	$(`button#prr`).click(() => pasteContent(2, threadData, true));
	$(`button#zhb`).click(() => pasteContent(21, threadData, true));
	$('button#unaccept').click(() => editThreadData2(UNACCEPT_PREFIX, false));
	$('button#accepted').click(() => editThreadData2(ACCEPT_PREFIX, false));
	$('button#pin').click(() => editThreadData2(PIN_PREFIX, true));
	$('button#teamProject').click(() => editThreadData2(COMMAND_PREFIX, true));
	$('button#watched').click(() => editThreadData2(WATCHED_PREFIX, false));
	$('button#decided').click(() => editThreadData2(DECIDED_PREFIX, false));
	$('button#closed').click(() => editThreadData2(CLOSE_PREFIX, false));
	$('button#closed_complaint').click(() => editThreadData2(CLOSE_PREFIX, false, false));
	$('button#techspec').click(() => editThreadData2(TEX_PREFIX, true));
    $('button#mainadm').click(() => editThreadData2(GA_PREFIX, true));
     $('button#Ojidanie').click(() => editThreadData(OJIDANIE_PREFIX, false));
 
    $(`button#selectComplaintAnswer`).click(() => {
          XF.alert(buttonsMarkup(buttons), null, 'Выберите ответ:');
          buttons.forEach((btn, id) => {
              if (id > 0) {
                  $(`button#answers-${id}`).click(() => pasteContent(id, threadData, true));
              } else {
                  $(`button#answers-${id}`).click(() => pasteContent(id, threadData, false));
              }
          });
      });
      $(`button#selectBiographyAnswer`).click(() => {
        XF.alert(buttonsMarkup(biography), null, 'Выберите ответ:');
        biography.forEach((btn, id) => {
            if (id > 1) {
                $(`button#answers-${id}`).click(() => pasteContent2(id, threadData, true));
            } else {
                $(`button#answers-${id}`).click(() => pasteContent2(id, threadData, true));
            }
        });
      });
          $(`button#selectMoveTask`).click(() => {
        XF.alert(tasksMarkup(tasks), null, 'Выберите действие:');
        tasks.forEach((btn, id) => {
            $(`button#answers-${id}`).click(() => moveThread(tasks[id].prefix, tasks[id].move));
        });
      });
  });
 
      function addButton(name, id, style) {
         $('.button--icon--reply').before(
	`<button type="button" class="button--primary button rippleButton" id="${id}" style="${style}">${name}</button>`,
	);
  }
  function addAnswers() {
		$('.button--icon--reply').before(`<button type="button" class="button--cta uix_quickReply--button button button--icon button--icon--write rippleButton" id="selectComplaintAnswer" style="oswald: 3px; margin-bottom: 5px; border-radius: 13px;">ОТВЕТЫ</button>`,
	);
	}
 
function buttonsMarkup(buttons) {
	return `<div class="select_answer">${buttons
	.map(
	(btn, i) =>
	`<button id="answers-${i}" class="button--primary button ` +
	`rippleButton" style="margin:4px; ${btn.dpstyle}"><span class="button-text">${btn.title}</span></button>`,
	)
	.join('')}</div>`;
	}
 
  function tasksMarkup(buttons) {
  return `<div class="select_answer">${buttons
    .map(
      (btn, i) =>
        `<button id="answers-${i}" class="button--primary button ` +
        `rippleButton" style="margin:6px; width:300px; ${btn.dpstyle}"><span class="button-text">${btn.title}</span></button>`,
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
          editThreadData(buttons[id].move, buttons[id].prefix, buttons[id].status, buttons[id].open);
          $('.button--icon.button--icon--reply.rippleButton').trigger('click');
      }
  }
 
  function pasteContent2(id, data = {}, send = false) {
    const template = Handlebars.compile(biography[id].content);
    if ($('.fr-element.fr-view p').text() === '') $('.fr-element.fr-view p').empty();
 
    $('span.fr-placeholder').empty();
    $('div.fr-element.fr-view p').append(template(data));
    $('a.overlay-titleCloser').trigger('click');
 
    if (send == false) {
        editThreadData(biography[id].move, biography[id].prefix, biography[id].status, biography[id].open);
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
 
 const Button2 = buttonConfig("ОПС", "https://forum.blackrussia.online/threads/Общие-правила-серверов.312571/");
 
    bgButtons.append(Button2);
 
  function editThreadData(move, prefix, pin = false, open = false) {
  // Получаем заголовок темы, так как он необходим при запросе
      const threadTitle = $('.p-title-value')[0].lastChild.textContent;
 
      if (pin == false) {
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
      } else if (pin == true && open) {
        fetch(`${document.URL}edit`, {
          method: 'POST',
          body: getFormData({
          prefix_id: prefix,
          discussion_open: 1,
          title: threadTitle,
          sticky: 1,
          _xfToken: XF.config.csrf,
          _xfRequestUri: document.URL.split(XF.config.url.fullBase)[1],
          _xfWithData: 1,
          _xfResponseType: 'json',
          }),
        }).then(() => location.reload());
      } else {
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
      if (move > 0) {
        moveThread(prefix, move);
      }
  }
 
    function editThreadData2(prefix, pin = false) {
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
  // Функция перемещения тем
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
  })();