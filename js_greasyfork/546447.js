// ==UserScript==
// @name         Скрипт для ГС/ЗГС ГОСС
// @namespace    https://forum.blackrussia.online/
// @version      3.46
// @description  Версия для сервера AQUA
// @author       Fantom_Stark Вк-https://vk.com/ha1333ha
// @match        https://forum.blackrussia.online/threads/*
// @include      https://forum.blackrussia.online/threads/
// @grant        none
// @license      MIT
// @icon https://forum.blackrussia.online/data/avatars/o/11/11193.jpg?1680968342
// @downloadURL https://update.greasyfork.org/scripts/546447/%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%93%D0%A1%D0%97%D0%93%D0%A1%20%D0%93%D0%9E%D0%A1%D0%A1.user.js
// @updateURL https://update.greasyfork.org/scripts/546447/%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%93%D0%A1%D0%97%D0%93%D0%A1%20%D0%93%D0%9E%D0%A1%D0%A1.meta.js
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
	   dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(0, 255, 255, 0.5)',
    },
{
	  title: 'Одобрено',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 251, 152, 0.5)',
	  content:
		'[COLOR=#FF00FF][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][COLOR=ffffff][ICODE]Ваш текст<br><br>"+
      '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][COLOR=#00FF00]Одобрено.[/ICODE][/COLOR]<br><br>",

},

{
      title: 'На рассмотрении',
       dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
	  content:
		'[COLOR=#FF00FF][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
    '[CENTER][url=https://postimages.org/][img] https://postimg.cc/qtJYhRPJ[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][COLOR=ffffff][ICODE]Ваш текст<br><br>"+
    '[CENTER][url=https://postimages.org/][img] https://postimg.cc/qtJYhRPJ[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][COLOR=#00FF00][ICODE]На рассмотрении.[/ICODE][/COLOR]<br><br>",
},
{
      title: 'Отказ',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5)',
	  content:
		'[COLOR=#FF00FF][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][COLOR=ffffff][ICODE]Ваш текст<br><br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][COLOR=#00FF00][ICODE]Отказано.[/ICODE][/COLOR]<br><br>",
},
{
	  title: 'Закрыто',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5)',
	  content:
		'[COLOR=#FF00FF][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][COLOR=ffffff][ICODE]Ваш текст<br><br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][COLOR=#ff0000][ICODE]Закрыто.[/ICODE][/COLOR]<br><br>",
},
           {
       title: '    . . . . .. . . . .. . . . .. . . . .. . . . .. . . . .. . . . .. . . . . . . . . .  проверка заявлений на  ЛД . . . . .. . . . .. . . . .. . . . .. . . . .. . . . . . .. ',
	   dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(0, 255, 255, 0.5)',
    },
       {
     title: " проверка заявлений на  ЛД",
           dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
     content:
    "[B][CENTER][COLOR=#FF1493]Доброго времени суток уважаемые игроки. Пришло время подвести итоги.[/CENTER][/B]<br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
    "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE]Рассмотрев ваши Заявки я готов вынести вердикт.[/ICODE]<br><br>"+
     "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#00FF7F][ICODE]Список допущенных к обзвону: [/ICODE][/COLOR]<br><br>"+
      "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#00FF7F][ICODE] ВОТ СЮДА ВПИСАТЬ НИКИ КТО ОДОБРЕН[/ICODE][/COLOR]<br><br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
    "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#FF0000][ICODE]Список не допущенных к обзвону: [/ICODE][/COLOR]<br><br>"+
     "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE] ВОТ СЮДА ВПИСАТЬ НИКИ КОМУ ОТКАЗ [/ICODE][/COLOR]<br><br>"+
     '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
           "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=Red][ICODE]Обзвон состоится ДАТА.МЕС.ГОД в ВРЕМЯ по МСК.[/ICODE][/COLOR][COLOR=#FFFFFF][ICODE] Он будет проходить в официальном дискорд канале сервера Vladimer За 10-5 минут до обзвона вам необходимо поставить префикс в дискорде [/ICODE][COLOR=#FFFFFF][ICODE] [K/L/] Nick_Name. Всем удачи на обзвоне![/ICODE]<br><br>"+
      "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE]Обзвон будет проходит на официальном дискорд канале [/ICODE][COLOR=ffffff] [URL=' https://discord.gg/cYxVBHwPjc']*Кликабельно*[/URL] [/COLOR]<br><br>"+
   "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] Vladimir[/SIZE][/B][/COLOR]",
 },
     {
      title: 'Ваша норма была проверена',
       dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 255, 0.5)',
	  content:
		"[B][CENTER][COLOR=#98FB98][ICODE]Доброго времени суток уважаемый лидер [/ICODE][/CENTER][/B]<br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][COLOR=#ffffff][ICODE] Ваша норма была проверена и выставлена в таблицу [/ICODE]<br><br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]',
},

       ];
const buttons = [
   {
     title: `------------------------------------------------------>>>>>   Одобрение заявок <<<<<------------------------------------------------------`,
       dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(0, 255, 255, 0.5)',
        },


    {
      title: 'Будет проведена беседа с лидером',
        dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 251, 152, 0.5)',
      content:
		'[COLOR=#FF00FF][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
         "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE]С лидером будет проведена беседа, по данной жалобе [/ICODE][/SIZE]<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
         "[B][CENTER][FONT=times new roman][COLOR=#00FF00][ICODE]Одобрено[/ICODE][/CENTER]<br><br>" +
        '[CENTER][CENTER][FONT=Trebuchet MS][COLOR=#00FFFF][ICODE]✿❯──── Закрыто ────❮✿[/ICODE][/CENTER][/FONT]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
       {
      title: 'Заместитель получит наказание',
        dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 251, 152, 0.5)',
      content:
		'[COLOR=#FF00FF][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
         "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE]Заместитель получит наказание. [/ICODE][/SIZE]<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
         "[B][CENTER][FONT=times new roman][COLOR=#00FF00][ICODE]Одобрено[/ICODE][/CENTER]<br><br>" +
        '[CENTER][CENTER][FONT=Trebuchet MS][COLOR=#00FFFF][ICODE]✿❯──── Закрыто ────❮✿[/ICODE][/CENTER][/FONT]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Лидер будет снят',
        dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 251, 152, 0.5)',
      content:
		'[COLOR=#FF00FF][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
         "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE]Лидер был снят [/ICODE][/SIZE]<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
         "[B][CENTER][FONT=times new roman][COLOR=#00FF00][ICODE]Одобрено[/ICODE][/CENTER]<br><br>" +
        '[CENTER][CENTER][FONT=Trebuchet MS][COLOR=#00FFFF][ICODE]✿❯──── Закрыто ────❮✿[/ICODE][/CENTER][/FONT]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
       {
      title: 'Тема будет подкорректирована',
           dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 251, 152, 0.5)',
      content:
		"[B][CENTER][COLOR=#FF1493]{{ greeting }}, уважаемый [/COLOR]  {{ user.name }}[/CENTER][/B]<br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
         "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE] Тема будет подкорректирована [/ICODE][/SIZE]<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
         "[B][CENTER][FONT=times new roman][COLOR=#00FF00][ICODE]Одобрено[/ICODE][/CENTER]<br><br>" +
           '[CENTER][CENTER][FONT=Trebuchet MS][COLOR=#00FFFF][ICODE]✿❯──── Закрыто ────❮✿[/ICODE][/CENTER][/FONT]',
      prefix: WATCHED_PREFIX,
	  status: false,
    },
       {
      title: 'Спасибо за инфу',
           dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 251, 152, 0.5)',
      content:
		'[COLOR=#FF00FF][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
         "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE] Благодарим вас за предоставленную информацию.[/SIZE]<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
         "[B][CENTER][FONT=times new roman][COLOR=#00FF00][ICODE]Одобрено[/ICODE][/CENTER]<br><br>" +
           '[CENTER][CENTER][FONT=Trebuchet MS][COLOR=#00FFFF][ICODE]✿❯──── Закрыто ────❮✿[/ICODE][/CENTER][/FONT]',
      prefix: WATCHED_PREFIX,
	  status: false,
    },
    {
      title: 'Будет проведена работа по данной жалобе',
        dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 251, 152, 0.5)',
      content:
		'[COLOR=#FF00FF][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE]С лидером будет проведена работа, по данной жалобе [/ICODE][/SIZE]<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][COLOR=#00FF00][ICODE]Одобрено[/ICODE][/CENTER]<br><br>" +
        '[CENTER][CENTER][FONT=Trebuchet MS][COLOR=#00FFFF][ICODE]✿❯──── Закрыто ────❮✿[/ICODE][/CENTER][/FONT]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
     {
      title: 'Лидер получит наказание',
         dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 251, 152, 0.5)',
      content:
		'[COLOR=#FF00FF][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE]Лидер получит наказание [/ICODE][/SIZE]<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][COLOR=#00FF00][ICODE]Одобрено[/ICODE][/CENTER]<br><br>" +
         '[CENTER][CENTER][FONT=Trebuchet MS][COLOR=#00FFFF][ICODE]✿❯──── Закрыто ────❮✿[/ICODE][/CENTER][/FONT]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Лидер получит соответствующее наказание',
        dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 251, 152, 0.5)',
      content:
		'[COLOR=#FF00FF][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE]Лидер получит соответствующее  наказание [/ICODE][/SIZE]<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][COLOR=#00FF00][ICODE]Одобрено[/ICODE][/CENTER]<br><br>" +
        '[CENTER][CENTER][FONT=Trebuchet MS][COLOR=#00FFFF][ICODE]✿❯──── Закрыто ────❮✿[/ICODE][/CENTER][/FONT]',
      prefix: ACCEPT_PREFIX,
	  status: false,
        },
         {
    title: `--------------------------------------------------------->>>>>    На рассмотрение   <<<<<--------------------------------------------------------`,
             dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(0, 255, 255, 0.5)',
},
     {
        title:'На рассмотрении заявки лд',
                 dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
        content:
        "[B][CENTER][COLOR=#FF00FF]{{ greeting }}, уважаемые [/COLOR] Игроки [/CENTER][/B]<br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
         "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#FF0000][ICODE] Закрыто [/ICODE][/COLOR][COLOR=#FFFF00] [ICODE]На рассмотрение.  [/ICODE][/COLOR][/SIZE]<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
            "[B][CENTER][FONT=times new roman][COLOR=#FFFF00][ICODE]На рассмотрении[/ICODE][/CENTER]<br><br>" ,
        prefix:PIN_PREFIX,
        status: true,
    },

            {
      title: 'На рассмотрение',
                 dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
      content:
		'[COLOR=#FF00FF][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
         '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
         "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE]Ваша жалоба взята на рассмотрение, пожалуйста не создавайте дубликатов. Ожидайте ответа.. [/ICODE][/SIZE]<br><br>"+
         '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
             "[B][CENTER][FONT=times new roman][COLOR=#FFFF00][ICODE]На рассмотрении.[/ICODE][/CENTER]<br><br>" ,
	  prefix: PIN_PREFIX,
	  status: true,
	},
            {
        title:'Запросил доказательства',
                 dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
        content:
        '[COLOR=#FF00FF][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
         "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE] Запросил доказательства у лидера. Просьба не создавать подобных тем.  [/ICODE][/SIZE]<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
            "[B][CENTER][FONT=times new roman][COLOR=#FFFF00][ICODE]На рассмотрении[/ICODE][/CENTER]<br><br>" ,
        prefix:PIN_PREFIX,
        status: true,
    },

      {
     title: '--------------------------------------------------------->>>>>  Отказ жалобы  <<<<<------------------------------------------------------',
          dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(0, 255, 255, 0.5)',
    },
     {
        title:'Отсутствует /time',
         dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5)',
        content:
        '[COLOR=#FF00FF][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
         "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE]На доказательствах отсуствует /time. [/ICODE][/SIZE]<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
            "[B][CENTER][FONT=times new roman][COLOR=#FF0000][ICODE]Отказано.[/ICODE][/CENTER]<br><br>" +
         '[CENTER][CENTER][FONT=Trebuchet MS][COLOR=#00FFFF][ICODE]✿❯──── Закрыто ────❮✿[/ICODE][/CENTER][/FONT]',
        prefix:UNACCEPT_PREFIX,
        status: false,
    },
    {
        title:'Нарушений со стороны лидера нет',
        dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5)',
        content:
        '[COLOR=#FF00FF][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
         "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE]Нарушений со стороны лидера нет.[/SIZE]<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
            "[B][CENTER][FONT=times new roman][COLOR=#FF0000][ICODE]Отказано.[/ICODE][/CENTER]<br><br>" +
        '[CENTER][CENTER][FONT=Trebuchet MS][COLOR=#00FFFF][ICODE]✿❯──── Закрыто ────❮✿[/ICODE][/CENTER][/FONT]',
        prefix:UNACCEPT_PREFIX,
        status: false,
    },
    {
        title:'В жалобы на игроков',
        dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5)',
        content:
        '[COLOR=#FF00FF][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
         "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE]Вы ошиблись разделом. Обратитесь в раздел Жалобы на игроков.  [/ICODE][/SIZE]<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
            "[B][CENTER][FONT=times new roman][COLOR=#FF0000][ICODE]Отказано.[/ICODE][/CENTER]<br><br>" +
        '[CENTER][CENTER][FONT=Trebuchet MS][COLOR=#00FFFF][ICODE]✿❯──── Закрыто ────❮✿[/ICODE][/CENTER][/FONT]',
        prefix:UNACCEPT_PREFIX,
        status: false,
    },
      {
        title:'В жалобы на адм',
          dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5)',
        content:
        '[COLOR=#FF00FF][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
         "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE] Вы ошиблись разделом. Обратитесь в раздел Жалобы на администрацию.[/SIZE]<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
            "[B][CENTER][FONT=times new roman][COLOR=#FF0000][ICODE]Отказано.[/ICODE][/CENTER]<br><br>" +
          '[CENTER][CENTER][FONT=Trebuchet MS][COLOR=#00FFFF][ICODE]✿❯──── Закрыто ────❮✿[/ICODE][/CENTER][/FONT]',
        prefix:UNACCEPT_PREFIX,
        status: false,
    },
      {
        title:'`В обжалование наказаний',
          dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5)',
        content:
        '[COLOR=#FF00FF][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
         "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE]Вы ошиблись разделом. Обратитесь в раздел Обжалование наказаний. [/ICODE][/SIZE]<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
            "[B][CENTER][FONT=times new roman][COLOR=#FF0000][ICODE]Отказано.[/ICODE][/CENTER]<br><br>" +
          '[CENTER][CENTER][FONT=Trebuchet MS][COLOR=#00FFFF][ICODE]✿❯──── Закрыто ────❮✿[/ICODE][/CENTER][/FONT]',
        prefix:UNACCEPT_PREFIX,
        status: false,
    },
     {
        title:'Проверив доказательства от лидера наказание было выданы верно',
         dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5)',
        content:
        '[COLOR=#FF00FF][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
         '[Color=ffffff][SIZE=4][FONT=Georgia][CENTER][COLOR=ffffff][ICODE]Проверив опровержение лидера, наказание вам был выдан верно. [/ICODE][/color][/SIZE][/CENTER]' +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
		 "[B][CENTER][FONT=times new roman][COLOR=#FF0000][ICODE]Закрыто.[/ICODE][/CENTER]<br><br>" +
         '[CENTER][CENTER][FONT=Trebuchet MS][COLOR=#00FFFF][ICODE]✿❯──── Закрыто ────❮✿[/ICODE][/CENTER][/FONT]',
        prefix:UNACCEPT_PREFIX,
        status: false,
    },
      {
        title:'В жалобы на Ст. состав',
          dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5)',
        content:
       '[COLOR=#FF00FF][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
         "[B][CENTER][FONT=times new roman][COLOR=ffffff][ICODE]Обратитесь в жалобы на сотродников или в жалобы на старший состав [/ICODE][/SIZE]<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
            "[B][CENTER][FONT=times new roman][COLOR=#FF0000][ICODE]Отказано.[/ICODE][/CENTER]<br><br>" +
          '[CENTER][CENTER][FONT=Trebuchet MS][COLOR=#00FFFF][ICODE]✿❯──── Закрыто ────❮✿[/ICODE][/CENTER][/FONT]',
        prefix:UNACCEPT_PREFIX,
        status: false,
    },
    {
       title:'В жалобы  на сотрудников',
        dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5)',
        content:
        '[COLOR=#FF00FF][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
         "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE] Данный игрок не является лидером фракции. Обратитесь в жалобы на сотрудников. [/ICODE][/SIZE]<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
            "[B][CENTER][FONT=times new roman][COLOR=#FF0000][ICODE]Отказано.[/ICODE][/CENTER]<br><br>" +
        '[CENTER][CENTER][FONT=Trebuchet MS][COLOR=#00FFFF][ICODE]✿❯──── Закрыто ────❮✿[/ICODE][/CENTER][/FONT]',
        prefix:UNACCEPT_PREFIX,
        status: false,
    },
      {
        title:'Повторная жалоба',
          dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5)',
        content:
        '[COLOR=#FF00FF][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
         "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE]Прекратите создавать копии жалобы, иначе ваш форумный аккаунт будет заблокирован [/ICODE][/SIZE]<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
            "[B][CENTER][FONT=times new roman][COLOR=#FF0000][ICODE]Отказано.[/ICODE][/CENTER]<br><br>" +
          '[CENTER][CENTER][FONT=Trebuchet MS][COLOR=#00FFFF][ICODE]✿❯──── Закрыто ────❮✿[/ICODE][/CENTER][/FONT]',
        prefix:UNACCEPT_PREFIX,
        status: false,
    },

    {
        title:'Отстутсвует nickname лидера в заголовке жалобы',
        dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5)',
        content:
         '[COLOR=#FF00FF][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE]1.2. В названии темы необходимо указать никнейм лидера, на которого подается жалоба, и суть жалобы: Nick_Name | Суть жалобы.  [/ICODE][/SIZE]<br><br>"+
      '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
		 "[B][CENTER][FONT=times new roman][COLOR=#FF0000][ICODE]Отказано.[/ICODE][/CENTER]<br><br>" +
        '[CENTER][CENTER][FONT=Trebuchet MS][COLOR=#00FFFF][ICODE]✿❯──── Закрыто ────❮✿[/ICODE][/CENTER][/FONT]',
        prefix:CLOSE_PREFIX,
        status: false,
    },
     {
        title:'Срок написания жалобы составляет два дня',
         dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5)',
        content:
        '[COLOR=#FF00FF][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
         '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
         "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE]3.1. Срок написания жалобы составляет два дня (48 часов) с момента совершенного нарушения со стороны лидера сервера. [/ICODE]<br><br>"+
         '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][COLOR=#FF0000][ICODE]Отказано.[/ICODE][/CENTER]<br><br>" +
         '[CENTER][CENTER][FONT=Trebuchet MS][COLOR=#00FFFF][ICODE]✿❯──── Закрыто ────❮✿[/ICODE][/CENTER][/FONT]',
        prefix:CLOSE_PREFIX,
        status: false,
    },
     {
        title:'Жалоба от 3-го лица',
         dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5)',
        content:
      '[COLOR=#FF00FF][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
         '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
        '[Color=ffffff][SIZE=4][FONT=Georgia][CENTER][B][ICODE]3.3. Жалоба от третьего лица не принимается (жалоба должна быть подана участником ситуации). [/ICODE][/color][/SIZE][/CENTER][/B]' +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
		 "[B][CENTER][FONT=times new roman][COLOR=#FF0000][ICODE]Отказано.[/ICODE][/CENTER]<br><br>" +
         '[CENTER][CENTER][FONT=Trebuchet MS][COLOR=#00FFFF][ICODE]✿❯──── Закрыто ────❮✿[/ICODE][/CENTER][/FONT]',
        prefix:CLOSE_PREFIX,
        status: false,
    },
         {
        title:'Доказательства предоставлены не в первоначальном виде',
             dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5)',
        content:
        '[COLOR=#FF00FF][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
         '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
           '[Color=ffffff][SIZE=4][FONT=Georgia][CENTER][B][ICODE]3.7. Доказательства должны быть в первоначальном виде. [/ICODE][/color][/SIZE][/CENTER][/B]' +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
		 "[B][CENTER][FONT=times new roman][COLOR=#FF0000][ICODE]Отказано.[/ICODE][/CENTER]<br><br>" +
             '[CENTER][CENTER][FONT=Trebuchet MS][COLOR=#00FFFF][ICODE]✿❯──── Закрыто ────❮✿[/ICODE][/CENTER][/FONT]',
        prefix:CLOSE_PREFIX,
        status: false,
    },
         {
        title:'Отсутствуют доказательства',
             dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5)',
        content:
         '[COLOR=#FF00FF][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
             '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
            '[Color=ffffff][SIZE=4][FONT=Georgia][CENTER][B][ICODE]В вашей жалобе отсутсвуют доказательства о нарушении лидера/заместителя [/ICODE][/color][/SIZE][/CENTER][/B]' +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
		 "[B][CENTER][FONT=times new roman][COLOR=#FF0000][ICODE]Отказано.[/ICODE][/CENTER]<br><br>" +
             '[CENTER][CENTER][FONT=Trebuchet MS][COLOR=#00FFFF][ICODE]✿❯──── Закрыто ────❮✿[/ICODE][/CENTER][/FONT]',
        prefix:CLOSE_PREFIX,
        status: false,
    },
    {
        title:'Проверив доказательства от лидера выговор были выданы верно',
        dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5)',
        content:
       '[COLOR=#FF00FF][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
         '[Color=ffffff][SIZE=4][FONT=Georgia][CENTER][B][ICODE]Проверив опровержение лидера, выговор вам был выдан верно. [/ICODE][/color][/SIZE][/CENTER][/B]' +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
		 "[B][CENTER][FONT=times new roman][COLOR=#FF0000][ICODE]Закрыто.[/ICODE][/CENTER]<br><br>" +
        '[CENTER][CENTER][FONT=Trebuchet MS][COLOR=#00FFFF][ICODE]✿❯──── Закрыто ────❮✿[/ICODE][/CENTER][/FONT]',
        prefix:UNACCEPT_PREFIX,
        status: false,
    },
     {
        title:'Проверив доказательства от лидера выговоры были выданы верно',
         dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5)',
        content:
        '[COLOR=#FF00FF][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
         '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
         '[Color=ffffff][SIZE=4][FONT=Georgia][CENTER][B][ICODE]Проверив опровержение лидера, выговоры вам был выдан верно. [/ICODE][/color][/SIZE][/CENTER][/B]' +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
		 "[B][CENTER][FONT=times new roman][COLOR=#FF0000][ICODE]Отказано.[/ICODE][/CENTER]<br><br>" +
         '[CENTER][CENTER][FONT=Trebuchet MS][COLOR=#00FFFF][ICODE]✿❯──── Закрыто ────❮✿[/ICODE][/CENTER][/FONT]',
        prefix:UNACCEPT_PREFIX,
        status: false,
    },
         {
        title:'Проверив доказательства от лидера розыск был выдан верно',
             dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5)',
        content:
        '[COLOR=#FF00FF][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
         '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
         '[Color=ffffff][SIZE=4][FONT=Georgia][CENTER][B][ICODE]Проверив опровержение лидера, розыск вам был выдан верно. [/ICODE][/color][/SIZE][/CENTER][/B]' +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
		 "[B][CENTER][FONT=times new roman][COLOR=#FF0000][ICODE]Отказано.[/ICODE][/CENTER]<br><br>" +
             '[CENTER][CENTER][FONT=Trebuchet MS][COLOR=#00FFFF][ICODE]✿❯──── Закрыто ────❮✿[/ICODE][/CENTER][/FONT]',
        prefix:UNACCEPT_PREFIX,
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
      addButton('Aвтор:Fantom_Stark', '', 'border-radius: 13px; margin-right: 5px; margin-bottom: 5px; border: 2px solid; border-color: rgb(235, 21, 21, 0.5);');
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