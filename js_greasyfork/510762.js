// ==UserScript==
// @name Bratck [74]
// @namespace https://forum.blackrussia.online
// @version 10.1.4
// @description Kurator [F]
// @author Dmitry_Nekrasov
// @updateversion Создан 29 Сентября
// @match https://forum.blackrussia.online/threads/*
// @include https://forum.blackrussia.online/threads/
// @grant none
// @license MIT
// @copyright 2025
// @icon https://avatars.steamstatic.com/001f944740a77eede46dc5ffac55c101ddb9c637_medium.jpg
// @downloadURL https://update.greasyfork.org/scripts/510762/Bratck%20%5B74%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/510762/Bratck%20%5B74%5D.meta.js
// ==/UserScript==

(function () {
'esversion 6' ;
const FAIL_PREFIX = 4;
const OKAY_PREFIX = 8;
const WAIT_PREFIX = 2;
const TECH_PREFIX = 13;
const WATCH_PREFIX = 9;
const CLOSE_PREFIX = 7;
const GA_PREFIX = 12;
const SA_PREFIX = 11;
const CP_PREFIX = 10;
const buttons = [
    {
    title: '«««««««««««««««««««««««««««««««««««« ГС/ЗГС  »»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»',
    dpstyle: 'oswald: 3px;     color: #fff; background: #6f02db; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #FF0000',
    },
{
        title: 'Жб на СС',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
	  content:
		'[CENTER][SIZE=4][FONT=Book Antiqua][COLOR=rgb(111, 0, 255)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/FONT][/CENTER]<br>' +
     "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/rmf4CLVn/1.png[/img][/url]<br>"+
	"[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Внимательно изучив и рассмотрев вашу жалобу.[/COLOR][/FONT][/CENTER]<br>" +
    "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Мною было принято следующее решение.[/COLOR][/FONT][/CENTER]<br>" +
     "[CENTER][SIZE=4][COLOR=#9d52ff][ICODE]Утвержденный вердикт[/ICODE][/COLOR][/CENTER]<br>" +
    "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Нарушений с стороны лидера нет.[/COLOR][/FONT][/CENTER]<br>" +
    "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Обратитесь в раздел жалоб на старший состав данной организации.[/COLOR][/FONT][/CENTER]<br>" +
    "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/rmf4CLVn/1.png[/img][/url]<br>"+
	 "[CENTER][SIZE=4][COLOR=#ff0a0a][ICODE]Закрыто[/ICODE][/COLOR][/SIZE][/CENTER]<br"+
        '[CENTER][SIZE=4][FONT=Times New Roman]Приятной игры на нашем сервере [COLOR=#ff7b00] Bratsk (74).[/COLOR][/FONT][/SIZE][/CENTER]',
	  prefix: FAIL_PREFIX,
	  status: false,
    },
{
      title: 'На рассмотрение',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 255, 0, 0.5); font-family: UtromPressKachat',
	  content:
		'[CENTER][SIZE=4][FONT=Book Antiqua][COLOR=rgb(111, 0, 255)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/FONT][/CENTER]<br>'+
     "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/rmf4CLVn/1.png[/img][/url]<br>"+
	"[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Ваша жалоба зарегистрирована и находится на рассмотрении. Ответ будет предоставлен в этой теме в кратчайшие сроки.[/COLOR][/FONT][/CENTER]<br>" +
	 "[CENTER][SIZE=4][COLOR=#fff705][ICODE]Ожидание вердикта[/ICODE][/COLOR][/CENTER]<br>" +
    "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Во избежание негативных последствий, убедительно просим Вас не дублировать данную тему.[/COLOR][/FONT][/CENTER]<br>" +
    "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Злоупотребление может привести к блокировке вашего аккаунта.[/COLOR][/FONT][/CENTER]<br>" +
    "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/rmf4CLVn/1.png[/img][/url]<br>"+
	 "[CENTER][SIZE=4][COLOR=#fbff00][ICODE]Ожидайте ответа[/ICODE][/COLOR][/CENTER]<br>"+
        '[CENTER][SIZE=4][FONT=Times New Roman]Приятной игры на нашем сервере [COLOR=#ff7b00] Bratsk (74).[/COLOR][/FONT][/SIZE][/CENTER]',
      prefix: WAIT_PREFIX,
	  status: true,
	 },
{
       title: 'Итоги на лд',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(2,11,147, 0.5); font-family: UtromPressKachat',
	  content:
		"[CENTER][SIZE=4][FONT=Book Antiqua][COLOR=rgb(111, 0, 255)]Доброго времени суток, уважаемые игроки.[/COLOR][/FONT][/CENTER]<br>" +
     "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/rmf4CLVn/1.png[/img][/url]<br>"+
	"[CENTER][FONT=Times New Roman]На основании тщательного анализа представленных Вами анкет, принято следующее решение.[/FONT][/CENTER]<br>" +
    "[CENTER][FONT=Times New Roman]Список успешно утвержденных для обзвона на пост лидера следующий:[/FONT][/CENTER]<br>" +
    "[CENTER][FONT=Times New Roman][COLOR=14f72b]1)[/COLOR][/FONT][/CENTER]<br>" +
    "[CENTER][FONT=Times New Roman][COLOR=14f72b]2)[/COLOR][/FONT][/CENTER]<br>" +
    "[CENTER][FONT=Times New Roman][COLOR=14f72b]3)[/COLOR][/FONT][/CENTER]<br>" +
    "[CENTER][FONT=Times New Roman]Список кандидатов, не прошедших отбор для обзвона на должность:[/FONT][/CENTER]<br>" +
    "[CENTER][FONT=Times New Roman][COLOR=#f71414]1)(причина)[/COLOR][/FONT][/CENTER]<br>" +
    "[CENTER][FONT=Times New Roman][COLOR=#f71414]2)(причина)[/COLOR][/FONT][/CENTER]<br>" +
    "[CENTER][FONT=Times New Roman][COLOR=#f8fc05]Точное время проведения обзвона будет сообщено дополнительно в беседе, предназначенной для кандидатов.[/COLOR][/CENTER][/FONT]<br>"+ 
    "[CENTER][FONT=Times New Roman]Сам обзвон будет проходить в официальном Discord-канале нашего сервера [COLOR=#ff7b00]Bratsk (74)[/COLOR] — [url= https://discord.gg/qQDa44vEbg]«кликабельно»[/url][/FONT][/CENTER]<br>"+
    "[CENTER][FONT=Times New Roman]По всем вопросам обращаться к руководству Государственных структур.[/FONT][/CENTER]<br>" +
    "[CENTER][FONT=Times New Roman]ГС ГОСС:[url= https://vk.com/d.kabirov24] «кликабельно»[/url][/FONT][/CENTER]<br>" +
    "[CENTER][FONT=Times New Roman]ЗГС ГОСС:[url= https://vk.com/dmitry_volzhsky] «кликабельно»[/url][/FONT][/CENTER]<br>" +
    "[CENTER][FONT=Times New Roman][COLOR=#f71414]Администрация сервера никогда не запросит пароль от аккаунта. [/COLOR][/FONT][/CENTER]<br>" +
    "[CENTER][FONT=Times New Roman][COLOR=#f71414]При просьбе скинуть логин и пароль от аккаунт - моментально блокируйте человека! [/COLOR][/FONT][/CENTER]<br>" +
     "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/rmf4CLVn/1.png[/img][/url]<br>"+
     "[CENTER][SIZE=4][COLOR=#ff0a0a][ICODE]Закрыто[/ICODE][/COLOR][/CENTER]<br>"+
        "[CENTER][SIZE=4][FONT=Times New Roman]Приятной игры на нашем сервере [COLOR=#ff7b00]Bratsk (74).[/COLOR][/FONT][/SIZE][/CENTER]<br>",
	   status: true,
	  },
{
        title: 'Одобрено',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(0, 255, 0, 0.5); font-family: UtromPressKachat',
	  content:
		'[CENTER][SIZE=4][FONT=Book Antiqua][COLOR=rgb(111, 0, 255)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/FONT][/CENTER]<br>' +
     "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/rmf4CLVn/1.png[/img][/url]<br>"+
    "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Внимательно изучив и рассмотрев вашу жалобу.[/COLOR][/FONT][/CENTER]<br>" +
    "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Мною было принято следующее решение.[/COLOR][/FONT][/CENTER]<br>" +
     "[CENTER][SIZE=4][COLOR=#9d52ff][ICODE]Утвержденный вердикт[/ICODE][/COLOR][/CENTER]<br>" +
    "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Лидер будет привлечен к ответственности. Будет выдано соответствующее наказание.[/COLOR][/FONT][/CENTER]<br>" +
    "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Выражаю свою благодарность, что связались с нами.[/COLOR][/FONT][/CENTER]<br>" +
     "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/rmf4CLVn/1.png[/img][/url]<br>"+
     "[CENTER][SIZE=4][COLOR=#70fc05][ICODE]Одобрено[/ICODE][/COLOR][/CENTER]<br>"+
    '[CENTER][SIZE=4][FONT=Times New Roman]Приятной игры на сервере [COLOR=#ff7b00] Bratsk (74).[/COLOR][/FONT][/SIZE][/CENTER]',
	  prefix: OKAY_PREFIX,
	  status: false,
      },
{
          title: 'Отказано',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
	  content:
	    '[CENTER][SIZE=4][FONT=Book Antiqua][COLOR=rgb(111, 0, 255)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/FONT][/CENTER]<br>' +
     "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/rmf4CLVn/1.png[/img][/url]<br>"+
    "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Внимательно изучив и рассмотрев вашу жалобу.[/COLOR][/FONT][/CENTER]<br>" +
    "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Мною было принято следующее решение.[/COLOR][/FONT][/CENTER]<br>" +
     "[CENTER][SIZE=4][COLOR=#9d52ff][ICODE]Утвержденный вердикт[/ICODE][/COLOR][/CENTER]<br>" +
    "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]К лидеру данной фракции претензий по поводу нарушений не имеется.[/COLOR][/FONT][/CENTER]<br>" +
     "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/rmf4CLVn/1.png[/img][/url]<br>"+
     "[CENTER][SIZE=4][COLOR=#ff0a0a][ICODE]Закрыто[/ICODE][/COLOR][/CENTER]<br>"+
        '[CENTER][SIZE=4][FONT=Times New Roman]Приятной игры на сервере [COLOR=#ff7b00] Bratsk (74).[/COLOR][/FONT][/SIZE][/CENTER]',
	  prefix: FAIL_PREFIX,
	  status: false,
      },
{
    title: '«««««««««««««««««««««««««««««««««««« Передача тем на рассмотрение »»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»',
    dpstyle: 'oswald: 3px;     color: #fff; background: #6f02db; box-shadow: 0 0 2px 0 rgba(148, 0, 201,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #FF0000',
	},
       {
	title: 'Главному Администратору',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
	  content:
		"[CENTER][SIZE=4][FONT=Book Antiqua][COLOR=rgb(111, 0, 255)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/FONT][/CENTER]<br>" +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/rmf4CLVn/1.png[/img][/url]<br>"+
    "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Ваша жалоба передана на рассмотрение Главному Администратору сервера[/COLOR][COLOR=rgb(247, 2, 2)] - @Dmitry_Lugovsky 👑 [/COLOR][/FONT][/CENTER]<br>" +
         "[CENTER][SIZE=4][COLOR=#fff705][ICODE]Ожидание вердикта[/ICODE][/COLOR][/CENTER]<br>" +
    "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Во избежание негативных последствий, убедительно просим Вас не дублировать данную тему.[/COLOR][/FONT][/CENTER]<br>" +
    "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Злоупотребление может привести к [/COLOR][COLOR=#ff0a0a]блокировке вашего аккаунта.[/COLOR][/FONT][/CENTER]<br>" +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/rmf4CLVn/1.png[/img][/url]<br>"+
        "[CENTER][SIZE=4][COLOR=#fbff00][ICODE]Ожидайте ответа[/ICODE][/COLOR][/CENTER]<br>"+
    "[CENTER][SIZE=4][FONT=Times New Roman]Приятной игры на нашем сервере [COLOR=#f70202]Volgograd[/COLOR][COLOR=#000]([/COLOR][COLOR=#f70202]39[COLOR=#000])[/COLOR].[/FONT][/SIZE][/CENTER]",
      prefix: GA_PREFIX,
	  status: true,
	         },
       {
	title: 'Техническому специалисту',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(2,11,147, 0.5); font-family: UtromPressKachat',
	  content:
		"[CENTER][SIZE=4][FONT=Book Antiqua][COLOR=rgb(111, 0, 255)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/FONT][/CENTER]<br>" +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/rmf4CLVn/1.png[/img][/url]<br>"+
    "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Ваша жалоба передана на рассмотрение Техническому специалисту сервера - @Dmitry_Tenside [/COLOR][/FONT][/CENTER]<br>" +
    "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Во избежание негативных последствий, убедительно просим Вас не дублировать данную тему.[/COLOR][/FONT][/CENTER]<br>" +
    "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Злоупотребление может привести к [/COLOR][COLOR=#ff0a0a]блокировке вашего аккаунта.[/COLOR][/FONT][/CENTER]<br>" +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/rmf4CLVn/1.png[/img][/url]<br>"+
		    "[CENTER][SIZE=4][COLOR=#fbff00][ICODE]Ожидайте ответа[/ICODE][/COLOR][/CENTER]<br>"+
    "[CENTER][SIZE=4][FONT=Times New Roman]Приятной игры на нашем сервере [COLOR=#ff7b00] Bratsk (74).[/COLOR][/FONT][/SIZE][/CENTER]",
	  prefix: TECH_PREFIX,
	  status: true,
         	 },
        {
	 title: 'На рассмотрение',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 255, 0, 0.5); font-family: UtromPressKachat',
	  content:
		"[CENTER][SIZE=4][FONT=Book Antiqua][COLOR=rgb(111, 0, 255)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/FONT][/CENTER]<br>" +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/rmf4CLVn/1.png[/img][/url]<br>"+
	"[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Ваша жалоба зарегистрирована и находится на рассмотрении. Ответ будет предоставлен в этой теме в кратчайшие сроки.[/COLOR][/FONT][/CENTER]<br>" +
                "[CENTER][SIZE=4][COLOR=#fff705][ICODE]Ожидание вердикта[/ICODE][/COLOR][/CENTER]<br>" +
        "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Во избежание негативных последствий, убедительно просим Вас не дублировать данную тему.[/COLOR][/FONT][/CENTER]<br>" +
        "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Злоупотребление может привести к [/COLOR][COLOR=#ff0a0a]блокировке вашего аккаунта.[/COLOR][/FONT][/CENTER]<br>" +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/rmf4CLVn/1.png[/img][/url]<br>"+
		"[CENTER][SIZE=4][COLOR=#fbff00][ICODE]Ожидайте ответа[/ICODE][/COLOR][/CENTER]<br>"+
        "[CENTER][SIZE=4][FONT=Times New Roman]Приятной игры на нашем сервере [COLOR=#ff7b00] Bratsk (74).[/COLOR][/FONT][/SIZE][/CENTER]",
      prefix: WAIT_PREFIX,
	  status: true,
	},
{
    title: '««««««««««««««««««««««««««««««««««««««««««««««« Отказ жалоб »»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»',
    dpstyle: 'oswald: 3px;     color: #fff; background: #6f02db; box-shadow: 0 0 2px 0 rgba(148, 0, 201,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #FF0000',
	},
     {
	  title: 'Ответ дан в прошлой теме',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
	  content:
		"[CENTER][SIZE=4][FONT=Book Antiqua][COLOR=rgb(111, 0, 255)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/FONT][/CENTER]<br>" +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/rmf4CLVn/1.png[/img][/url]"+
             "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Внимательно изучив и рассмотрев вашу жалобу.[/COLOR][/FONT][/CENTER]<br>" +
             "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Мною было принято следующее решение.[/COLOR][/FONT][/CENTER]<br>" +
        "[CENTER][SIZE=4][COLOR=#9d52ff][ICODE]Утвержденный вердикт[/ICODE][/COLOR][/CENTER]<br>" +
             "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Вам был дан ответ в прошлой теме. [/COLOR][/FONT][/CENTER]<br>" +
             "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Ознакомиться с правилами составления жалобы можете здесь:[/COLOR][/FONT][FONT=Times New Roman] [URL=https://forum.blackrussia.online/threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BF%D0%BE%D0%B4%D0%B0%D1%87%D0%B8-%D0%B6%D0%B0%D0%BB%D0%BE%D0%B1-%D0%BD%D0%B0-%D0%B8%D0%B3%D1%80%D0%BE%D0%BA%D0%BE%D0%B2.3429394/] «Жалобы на игроков» [/URL][/COLOR][/FONT][/CENTER]<br>" +
        "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Во избежание негативных последствий, убедительно просим Вас не дублировать данную тему.[/COLOR][/FONT][/CENTER]<br>" +
        "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Злоупотребление может привести к [/COLOR][COLOR=#ff0a0a]блокировке вашего аккаунта.[/COLOR][/FONT][/CENTER]<br>" +
        "[CENTER][img]https://i.postimg.cc/rmf4CLVn/1.png[/img]<br>"+
      	"[CENTER][SIZE=4][COLOR=#ff0a0a][ICODE]Закрыто[/ICODE][/COLOR][/CENTER]<br>"+
             "[CENTER][SIZE=4][FONT=Times New Roman]Приятной игры на сервере [COLOR=#ff7b00] Bratsk (74).[/COLOR][/FONT][/SIZE][/CENTER]",
      prefix: WAIT_PREFIX,
	  status: false,
	},
{
	  title: 'В ЖБ на АДМ',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
	  content:
		"[CENTER][SIZE=4][FONT=Book Antiqua][COLOR=rgb(111, 0, 255)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/FONT][/CENTER]<br>" +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/rmf4CLVn/1.png[/img][/url]"+
             "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Внимательно изучив и рассмотрев вашу жалобу.[/COLOR][/FONT][/CENTER]<br>" +
             "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Мною было принято следующее решение.[/COLOR][/FONT][/CENTER]<br>" +
        "[CENTER][SIZE=4][COLOR=#9d52ff][ICODE]Утвержденный вердикт[/ICODE][/COLOR][/CENTER]<br>" +
             "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Вам необходимо обратиться в следующий раздел жалоб:[/COLOR][/FONT][FONT=Times New Roman] [URL=https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B0%D0%B4%D0%BC%D0%B8%D0%BD%D0%B8%D1%81%D1%82%D1%80%D0%B0%D1%86%D0%B8%D1%8E.3342/] «Жалобы на Администрацию» [/URL][/FONT][/CENTER]<br>" +
        "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Во избежание негативных последствий, убедительно просим Вас не дублировать данную тему.[/COLOR][/FONT][/CENTER]<br>" +
        "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Злоупотребление может привести к [/COLOR][COLOR=#ff0a0a]блокировке вашего аккаунта.[/COLOR][/FONT][/CENTER]<br>" +
        "[CENTER][img]https://i.postimg.cc/rmf4CLVn/1.png[/img]<br>"+
      	"[CENTER][SIZE=4][COLOR=#ff0a0a][ICODE]Закрыто[/ICODE][/COLOR][/CENTER]<br>"+
             "[CENTER][SIZE=4][FONT=Times New Roman]Приятной игры на сервере [COLOR=#ff7b00] Bratsk (74).[/COLOR][/FONT][/SIZE][/CENTER]",
      prefix: WAIT_PREFIX,
	  status: false,
	},
{
	  title: 'В ЖБ на Тех спец',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
	  content:
		"[CENTER][SIZE=4][FONT=Book Antiqua][COLOR=rgb(111, 0, 255)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/FONT][/CENTER]<br>" +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/rmf4CLVn/1.png[/img][/url]"+
             "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Внимательно изучив и рассмотрев вашу жалобу.[/COLOR][/FONT][/CENTER]<br>" +
             "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Мною было принято следующее решение.[/COLOR][/FONT][/CENTER]<br>" +
        "[CENTER][SIZE=4][COLOR=#9d52ff][ICODE]Утвержденный вердикт[/ICODE][/COLOR][/CENTER]<br>" +
             "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Вам необходимо обратиться в следующий раздел жалоб:[/COLOR][/FONT][FONT=Times New Roman] [URL=https://forum.blackrussia.online/forums/%D0%A1%D0%B5%D1%80%D0%B2%D0%B5%D1%80-%E2%84%9674-bratsk.3323/] «Жалобы на Технических специалистов» [/URL][/FONT][/CENTER]<br>" +
        "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Во избежание негативных последствий, убедительно просим Вас не дублировать данную тему.[/COLOR][/FONT][/CENTER]<br>" +
        "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Злоупотребление может привести к [/COLOR][COLOR=#ff0a0a]блокировке вашего аккаунта.[/COLOR][/FONT][/CENTER]<br>" +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/rmf4CLVn/1.png[/img][/url]<br>"+
        "[CENTER][SIZE=4][COLOR=#ff0a0a][ICODE]Закрыто[/ICODE][/COLOR][/CENTER]<br>"+
             "[CENTER][SIZE=4][FONT=Times New Roman]Приятной игры на сервере [COLOR=#ff7b00] Bratsk (74).[/COLOR][/FONT][/SIZE][/CENTER]",
	  prefix: FAIL_PREFIX,
	  status: false,
	},
{
	  title: 'В ЖБ на ЛД',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
	  content:
		"[CENTER][SIZE=4][FONT=Book Antiqua][COLOR=rgb(111, 0, 255)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/FONT][/CENTER]<br>" +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/rmf4CLVn/1.png[/img][/url]"+
             "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Внимательно изучив и рассмотрев вашу жалобу.[/COLOR][/FONT][/CENTER]<br>" +
             "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Мною было принято следующее решение.[/COLOR][/FONT][/CENTER]<br>" +
        "[CENTER][SIZE=4][COLOR=#9d52ff][ICODE]Утвержденный вердикт[/ICODE][/COLOR][/CENTER]<br>" +
             "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Вам необходимо обратиться в следующий раздел жалоб:[/COLOR][/FONT][FONT=Times New Roman] [URL=https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%BB%D0%B8%D0%B4%D0%B5%D1%80%D0%BE%D0%B2.3343/] «Жалобы на Лидеров» [/URL][/FONT][/CENTER]<br>" +
        "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Во избежание негативных последствий, убедительно просим Вас не дублировать данную тему.[/COLOR][/FONT][/CENTER]<br>" +
        "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Злоупотребление может привести к [/COLOR][COLOR=#ff0a0a]блокировке вашего аккаунта.[/COLOR][/FONT][/CENTER]<br>" +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/rmf4CLVn/1.png[/img][/url]<br>"+
        "[CENTER][SIZE=4][COLOR=#ff0a0a][ICODE]Закрыто[/ICODE][/COLOR][/CENTER]<br>"+
             "[CENTER][SIZE=4][FONT=Times New Roman]Приятной игры на сервере [COLOR=#ff7b00] Bratsk (74).[/COLOR][/FONT][/SIZE][/CENTER]",
	  prefix: FAIL_PREFIX,
	  status: false,
	},
{
	  title: 'Жалоба не по форме',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
	  content:
		"[CENTER][SIZE=4][FONT=Book Antiqua][COLOR=rgb(111, 0, 255)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/FONT][/CENTER]<br>" +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/rmf4CLVn/1.png[/img][/url]"+
             "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Внимательно изучив и рассмотрев вашу жалобу.[/COLOR][/FONT][/CENTER]<br>" +
             "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Мною было принято следующее решение.[/COLOR][/FONT][/CENTER]<br>" +
        "[CENTER][SIZE=4][COLOR=#9d52ff][ICODE]Утвержденный вердикт[/ICODE][/COLOR][/CENTER]<br>" +
             "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Ваша жалоба составлена не по форме.[/COLOR][/FONT][/CENTER]<br>" +
	     "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Заполните данную форму и подайте новую жалобу:[/COLOR][/FONT][/CENTER]<br>" +
        "[CENTER][QUOTE][FONT=Times New Roman][SIZE=4]1. Ваш Nick_Name:<br>2. Nick_Name игрока:<br>3. Суть жалобы:<br>4. Доказательство:[/FONT][/SIZE][/QUOTE][/CENTER]<br>" +
             "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Сделайте необходимый критерий и составьте жалобу повторно.[/COLOR][/FONT][/CENTER]<br>" +
             "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Ознакомиться с правилами составления жалобы можете здесь:[/COLOR][/FONT][FONT=Times New Roman] [URL=https://forum.blackrussia.online/threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BF%D0%BE%D0%B4%D0%B0%D1%87%D0%B8-%D0%B6%D0%B0%D0%BB%D0%BE%D0%B1-%D0%BD%D0%B0-%D0%B8%D0%B3%D1%80%D0%BE%D0%BA%D0%BE%D0%B2.3429394/] «Жалобы на игроков» [/URL][/FONT][/CENTER]<br>" +
        "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Во избежание негативных последствий, убедительно просим Вас не дублировать данную тему.[/COLOR][/FONT][/CENTER]<br>" +
        "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Злоупотребление может привести к [/COLOR][COLOR=#ff0a0a]блокировке вашего аккаунта.[/COLOR][/FONT][/CENTER]<br>" +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/rmf4CLVn/1.png[/img][/url]" +
        "[CENTER][SIZE=4][COLOR=#ff0a0a][ICODE]Закрыто[/ICODE][/COLOR][/CENTER]<br>"+
            "[CENTER][SIZE=4][FONT=Times New Roman]Приятной игры на сервере [COLOR=#ff7b00] Bratsk (74).[/COLOR][/FONT][/SIZE][/CENTER]",
	  prefix: FAIL_PREFIX,
	  status: false,
	},
{
	  title: 'Не тот сервер',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
	  content:
		"[CENTER][SIZE=4][FONT=Book Antiqua][COLOR=rgb(111, 0, 255)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/FONT][/CENTER]<br>" +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/rmf4CLVn/1.png[/img][/url]"+
             "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Внимательно изучив и рассмотрев вашу жалобу.[/COLOR][/FONT][/CENTER]<br>" +
             "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Мною было принято следующее решение.[/COLOR][/FONT][/CENTER]<br>" +
        "[CENTER][SIZE=4][COLOR=#9d52ff][ICODE]Утвержденный вердикт[/ICODE][/COLOR][/CENTER]<br>" +
             "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]При составлении жалобы, Вы ошиблись сервером.[/COLOR][/FONT][/CENTER]<br>" +
	     "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Перевожу Вашу жалобу в соответствующий раздел вашего игрового сервера.[/COLOR][/FONT][/CENTER]<br>" +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/rmf4CLVn/1.png[/img][/url]<br>"+
        "[CENTER][SIZE=4][COLOR=#ff0a0a][ICODE]Закрыто[/ICODE][/COLOR][/CENTER]<br>"+
             "[CENTER][SIZE=4][FONT=Times New Roman]Приятной игры на сервере [COLOR=#ff7b00] Bratsk (74).[/COLOR][/FONT][/SIZE][/CENTER]",
	  prefix: FAIL_PREFIX,
	  status: false,
	},
{
	  title: 'В ЖБ на сотрудников',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
	  content:
		"[CENTER][SIZE=4][FONT=Book Antiqua][COLOR=rgb(111, 0, 255)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/FONT][/CENTER]<br>" +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/rmf4CLVn/1.png[/img][/url]"+
             "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Внимательно изучив и рассмотрев вашу жалобу.[/COLOR][/FONT][/CENTER]<br>" +
             "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Мною было принято следующее решение.[/COLOR][/FONT][/CENTER]<br>" +
        "[CENTER][SIZE=4][COLOR=#9d52ff][ICODE]Утвержденный вердикт[/ICODE][/COLOR][/CENTER]<br>" +
             "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Обратитесь в соответствующий раздел жалоб на сотрудников той или иной организации.[/COLOR][/FONT][/CENTER]<br>" +
             "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Ознакомиться с правилами составления жалобы Вы можете здесь:[/COLOR][/FONT][FONT=Times New Roman] [URL=https://forum.blackrussia.online/threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BF%D0%BE%D0%B4%D0%B0%D1%87%D0%B8-%D0%B6%D0%B0%D0%BB%D0%BE%D0%B1-%D0%BD%D0%B0-%D0%B8%D0%B3%D1%80%D0%BE%D0%BA%D0%BE%D0%B2.3429394/] «Жалобы на игроков» [/URL][/FONT][/CENTER]<br>" +
        "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Во избежание негативных последствий, убедительно просим Вас не дублировать данную тему.[/COLOR][/FONT][/CENTER]<br>" +
        "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Злоупотребление может привести к [/COLOR][COLOR=#ff0a0a]блокировке вашего аккаунта.[/COLOR][/FONT][/CENTER]<br>" +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/rmf4CLVn/1.png[/img][/url]<br>"+
	"[CENTER][SIZE=4][COLOR=#ff0a0a][ICODE]Закрыто[/ICODE][/COLOR][/CENTER]<br>"+
            "[CENTER][SIZE=4][FONT=Times New Roman]Приятной игры на сервере [COLOR=#ff7b00] Bratsk (74).[/COLOR][/FONT][/SIZE][/CENTER]",
	  prefix: FAIL_PREFIX,
	  status: false,
	},
{
         title: 'Nick_Name',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
	  content:
		"[CENTER][SIZE=4][FONT=Book Antiqua][COLOR=rgb(111, 0, 255)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/FONT][/CENTER]<br>" +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/rmf4CLVn/1.png[/img][/url]"+
             "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Внимательно изучив и рассмотрев вашу жалобу.[/COLOR][/FONT][/CENTER]<br>" +
             "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Мною было принято следующее решение.[/COLOR][/FONT][/CENTER]<br>" +
        "[CENTER][SIZE=4][COLOR=#9d52ff][ICODE]Утвержденный вердикт[/ICODE][/COLOR][/CENTER]<br>" +
             "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Nick_Name нарушителя, указанный в жалобе, не соответствует Nick_Name, фигурирующему в ваших доказательствах.[/COLOR][/FONT][/CENTER]<br>" +
             "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Убедитесь, что Nick_Name нарушителя написан точно так, как он отображается в системе. Затем заполните форму жалобы заново.[/COLOR][/FONT][/CENTER]<br>" +
             "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Сделайте необходимый критерий и составьте жалобу повторно.[/COLOR][/FONT][/CENTER]<br>" +
             "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Ознакомиться с правилами составления жалобы можете здесь:[/COLOR][/FONT][FONT=Times New Roman] [URL=https://forum.blackrussia.online/threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BF%D0%BE%D0%B4%D0%B0%D1%87%D0%B8-%D0%B6%D0%B0%D0%BB%D0%BE%D0%B1-%D0%BD%D0%B0-%D0%B8%D0%B3%D1%80%D0%BE%D0%BA%D0%BE%D0%B2.3429394/] «Жалобы на игроков» [/URL][/FONT][/CENTER]<br>" +
        "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Во избежание негативных последствий, убедительно просим Вас не дублировать данную тему.[/COLOR][/FONT][/CENTER]<br>" +
        "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Злоупотребление может привести к [/COLOR][COLOR=#ff0a0a]блокировке вашего аккаунта.[/COLOR][/FONT][/CENTER]<br>" +

        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/rmf4CLVn/1.png[/img][/url]<br>"+
	"[CENTER][SIZE=4][COLOR=#ff0a0a][ICODE]Закрыто[/ICODE][/COLOR][/CENTER]<br>"+
             "[CENTER][SIZE=4][FONT=Times New Roman]Приятной игры на сервере [COLOR=#ff7b00] Bratsk (74).[/COLOR][/FONT][/SIZE][/CENTER]",
	   prefix: FAIL_PREFIX,
      status: false,
	},
{
	  title: 'Нет time',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
	  content:
		"[CENTER][SIZE=4][FONT=Book Antiqua][COLOR=rgb(111, 0, 255)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/FONT][/CENTER]<br>" +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/rmf4CLVn/1.png[/img][/url]"+
             "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Внимательно изучив и рассмотрев вашу жалобу.[/COLOR][/FONT][/CENTER]<br>" +
             "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Мною было принято следующее решение.[/COLOR][/FONT][/CENTER]<br>" +
        "[CENTER][SIZE=4][COLOR=#9d52ff][ICODE]Утвержденный вердикт[/ICODE][/COLOR][/CENTER]<br>" +
             "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Для рассмотрения вашей жалобы необходимо предоставить доказательство, содержащее требуемую команду[SIZE=4][FONT=Times New Roman](/time)[/SIZE][/FONT].[FONT=Book Antiqua][COLOR=#d1d5d8]В вашем случае она отсутствует.[/COLOR][/FONT][/CENTER]<br>" +
             "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Сделайте необходимый критерий и составьте жалобу повторно.[/COLOR][/FONT][/CENTER]<br>" +
             "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Ознакомиться с правилами составления жалобы можете здесь:[/COLOR][/FONT][FONT=Times New Roman] [URL=https://forum.blackrussia.online/threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BF%D0%BE%D0%B4%D0%B0%D1%87%D0%B8-%D0%B6%D0%B0%D0%BB%D0%BE%D0%B1-%D0%BD%D0%B0-%D0%B8%D0%B3%D1%80%D0%BE%D0%BA%D0%BE%D0%B2.3429394/] «Жалобы на игроков» [/URL][/FONT][/CENTER]<br>" +
        "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Во избежание негативных последствий, убедительно просим Вас не дублировать данную тему.[/COLOR][/FONT][/CENTER]<br>" +
        "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Злоупотребление может привести к [/COLOR][COLOR=#ff0a0a]блокировке вашего аккаунта.[/COLOR][/FONT][/CENTER]<br>" +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/rmf4CLVn/1.png[/img][/url]<br>"+
        "[CENTER][SIZE=4][COLOR=#ff0a0a][ICODE]Закрыто[/ICODE][/COLOR][/CENTER]<br>"+
             "[CENTER][SIZE=4][FONT=Times New Roman]Приятной игры на сервере [COLOR=#ff7b00] Bratsk (74).[/COLOR][/FONT][/SIZE][/CENTER]",
	  prefix: FAIL_PREFIX,
	  status: false,
	},
{
	  title: 'Нет таймкодов',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
	  content:
		"[CENTER][SIZE=4][FONT=Book Antiqua][COLOR=rgb(111, 0, 255)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/FONT][/CENTER]<br>" +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/rmf4CLVn/1.png[/img][/url]"+
             "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Внимательно изучив и рассмотрев вашу жалобу.[/COLOR][/FONT][/CENTER]<br>" +
             "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Мною было принято следующее решение.[/COLOR][/FONT][/CENTER]<br>" +
        "[CENTER][SIZE=4][COLOR=#9d52ff][ICODE]Утвержденный вердикт[/ICODE][/COLOR][/CENTER]<br>" +
             "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Для рассмотрения вашей жалобы необходимо предоставить доказательство, содержащее требуемую команду [/COLOR][/FONT][FONT=Times New Roman][/SIZE=4](/time)[/SIZE][/FONT][/CENTER]<br>"+
             "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Укажите временные интервалы, в которых были зафиксированы нарушения с необходимой командой.[/COLOR][/FONT][/CENTER]<br>" +
             "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Сделайте необходимый критерий и составьте жалобу повторно.[/COLOR][/FONT][/CENTER]<br>" +
             "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Ознакомиться с правилами составления жалобы можете здесь:[/COLOR][/FONT][FONT=Times New Roman] [URL=https://forum.blackrussia.online/threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BF%D0%BE%D0%B4%D0%B0%D1%87%D0%B8-%D0%B6%D0%B0%D0%BB%D0%BE%D0%B1-%D0%BD%D0%B0-%D0%B8%D0%B3%D1%80%D0%BE%D0%BA%D0%BE%D0%B2.3429394/] «Жалобы на игроков» [/URL][/FONT][/CENTER]<br>" +
        "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Во избежание негативных последствий, убедительно просим Вас не дублировать данную тему.[/COLOR][/FONT][/CENTER]<br>" +
        "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Злоупотребление может привести к [/COLOR][COLOR=#ff0a0a]блокировке вашего аккаунта.[/COLOR][/FONT][/CENTER]<br>" +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/rmf4CLVn/1.png[/img][/url]<br>"+
	    	"[CENTER][SIZE=4][COLOR=#ff0a0a][ICODE]Закрыто[/ICODE][/COLOR][/CENTER]<br>"+
    "[CENTER][SIZE=4][FONT=Times New Roman]Приятной игры на сервере [COLOR=#ff7b00] Bratsk (74).[/COLOR][/FONT][/SIZE][/CENTER]",
	  prefix: FAIL_PREFIX,
	  status: false,
	},
    {
	  title: '3+ дня',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
	  content:
		"[CENTER][SIZE=4][FONT=Book Antiqua][COLOR=rgb(111, 0, 255)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/FONT][/CENTER]<br>" +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/rmf4CLVn/1.png[/img][/url]"+
             "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Внимательно изучив и рассмотрев вашу жалобу.[/COLOR][/FONT][/CENTER]<br>" +
             "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Мною было принято следующее решение.[/COLOR][/FONT][/CENTER]<br>" +
        "[CENTER][SIZE=4][COLOR=#9d52ff][ICODE]Утвержденный вердикт[/ICODE][/COLOR][/CENTER]<br>" +
             "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]К сожалению, ваши доказательства не могут быть приняты к рассмотрению, так как они были предоставлены по истечению трехдневного срока подачи жалобы.[/COLOR][/FONT][/CENTER]<br>" +
             "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Сделайте необходимый критерий и составьте жалобу повторно.[/COLOR][/FONT][/CENTER]<br>" +
             "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Ознакомиться с правилами составления жалобы можете здесь:[/COLOR][/FONT][FONT=Times New Roman] [URL=https://forum.blackrussia.online/threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BF%D0%BE%D0%B4%D0%B0%D1%87%D0%B8-%D0%B6%D0%B0%D0%BB%D0%BE%D0%B1-%D0%BD%D0%B0-%D0%B8%D0%B3%D1%80%D0%BE%D0%BA%D0%BE%D0%B2.3429394/] «Жалобы на игроков» [/URL][/FONT][/CENTER]<br>" +
             "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Во избежание негативных последствий, убедительно просим Вас не дублировать данную тему.[/COLOR][/FONT][/CENTER]<br>" +
        "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Злоупотребление может привести к [/COLOR][COLOR=#ff0a0a]блокировке вашего аккаунта.[/COLOR][/FONT][/CENTER]<br>" +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/rmf4CLVn/1.png[/img][/url]<br>"+
	    	"[CENTER][SIZE=4][COLOR=#ff0a0a][ICODE]Закрыто[/ICODE][/COLOR][/CENTER]<br>"+
    "[CENTER][SIZE=4][FONT=Times New Roman]Приятной игры на сервере [COLOR=#ff7b00] Bratsk (74).[/COLOR][/FONT][/SIZE][/CENTER]",
	  prefix: FAIL_PREFIX,
	  status: false,
	},
    {
	  title: 'Док-ва в соц сетях',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
	  content:
		"[CENTER][SIZE=4][FONT=Book Antiqua][COLOR=rgb(111, 0, 255)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/FONT][/CENTER]<br>" +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/rmf4CLVn/1.png[/img][/url]"+
             "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Внимательно изучив и рассмотрев вашу жалобу.[/COLOR][/FONT][/CENTER]<br>" +
             "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Мною было принято следующее решение.[/COLOR][/FONT][/CENTER]<br>" +
        "[CENTER][SIZE=4][COLOR=#9d52ff][ICODE]Утвержденный вердикт[/ICODE][/COLOR][/CENTER]<br>" +
              "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Загрузка доказательств в соц. сети ([COLOR=#021bf7]Vkontakte[/COLOR], [COLOR=#f75c02]Ins[/COLOR][COLOR=#02f7db]ta[/COLOR][COLOR=#020bf7]gram[/COLOR])[FONT=Book Antiqua][COLOR=#d1d5d8] запрещается.[/COLOR][/FONT][/CENTER]<br>" +
 "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Ваши доказательства должны быть загружены на видео/фото хостинги ([COLOR=#f70202]YouTube[/COLOR], Япикс, Imgur).[/COLOR][/FONT][/CENTER]<br>" +
             "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Сделайте необходимый критерий и составьте жалобу повторно.[/COLOR][/FONT][/CENTER]<br>" +
             "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Ознакомиться с правилами составления жалобы можете здесь:[/COLOR][/FONT][FONT=Times New Roman] [URL=https://forum.blackrussia.online/threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BF%D0%BE%D0%B4%D0%B0%D1%87%D0%B8-%D0%B6%D0%B0%D0%BB%D0%BE%D0%B1-%D0%BD%D0%B0-%D0%B8%D0%B3%D1%80%D0%BE%D0%BA%D0%BE%D0%B2.3429394/] «Жалобы на игроков» [/URL][/FONT][/CENTER]<br>" +
 "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/rmf4CLVn/1.png[/img][/url]<br>"+
    "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Во избежание негативных последствий, убедительно просим Вас не дублировать данную тему.[/COLOR][/FONT][/CENTER]<br>" +
        "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Злоупотребление может привести к [/COLOR][COLOR=#ff0a0a]блокировке вашего аккаунта.[/COLOR][/FONT][/CENTER]<br>" +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/rmf4CLVn/1.png[/img][/url]<br>"+
		    "[CENTER][SIZE=4][COLOR=#ff0a0a][ICODE]Закрыто[/ICODE][/COLOR][/CENTER]<br>"+
    "[CENTER][SIZE=4][FONT=Times New Roman]Приятной игры на сервере [COLOR=#ff7b00] Bratsk (74).[/COLOR][/FONT][/SIZE][/CENTER]",
	  prefix: FAIL_PREFIX,
	  status: false,
	},
    {
	  title: 'Жалоба от 3-го лица',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
	  content:
		"[CENTER][SIZE=4][FONT=Book Antiqua][COLOR=rgb(111, 0, 255)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/FONT][/CENTER]<br>" +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/rmf4CLVn/1.png[/img][/url]"+
             "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Внимательно изучив и рассмотрев вашу жалобу.[/COLOR][/FONT][/CENTER]<br>" +
             "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Мною было принято следующее решение.[/COLOR][/FONT][/CENTER]<br>" +
        "[CENTER][SIZE=4][COLOR=#9d52ff][ICODE]Утвержденный вердикт[/ICODE][/COLOR][/CENTER]<br>" +
             "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Ваша жалоба составлена от 3-его лица.[/COLOR][/FONT][/CENTER]<br>" +
             "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Сделайте необходимый критерий и составьте жалобу повторно.[/COLOR][/FONT][/CENTER]<br>" +
             "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Ознакомиться с правилами составления жалобы можете здесь:[/COLOR][/FONT][FONT=Times New Roman] [URL=https://forum.blackrussia.online/threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BF%D0%BE%D0%B4%D0%B0%D1%87%D0%B8-%D0%B6%D0%B0%D0%BB%D0%BE%D0%B1-%D0%BD%D0%B0-%D0%B8%D0%B3%D1%80%D0%BE%D0%BA%D0%BE%D0%B2.3429394/] «Жалобы на игроков» [/URL][/FONT][/CENTER]<br>" +
   "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Во избежание негативных последствий, убедительно просим Вас не дублировать данную тему.[/COLOR][/FONT][/CENTER]<br>" +
        "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Злоупотребление может привести к [/COLOR][COLOR=#ff0a0a]блокировке вашего аккаунта.[/COLOR][/FONT][/CENTER]<br>" +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/rmf4CLVn/1.png[/img][/url]<br>"+
		    "[CENTER][SIZE=4][COLOR=#ff0a0a][ICODE]Закрыто[/ICODE][/COLOR][/CENTER]<br>"+
    "[CENTER][SIZE=4][FONT=Times New Roman]Приятной игры на сервере [COLOR=#ff7b00] Bratsk (74).[/COLOR][/FONT][/SIZE][/CENTER]",
	  prefix: FAIL_PREFIX,
	  status: false,
	},
    {
	  title: 'Ответ был дан в предыдущей теме',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
	  content:
		"[CENTER][SIZE=4][FONT=Book Antiqua][COLOR=rgb(111, 0, 255)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/FONT][/CENTER]<br>" +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/rmf4CLVn/1.png[/img][/url]"+
             "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Внимательно изучив и рассмотрев вашу жалобу.[/COLOR][/FONT][/CENTER]<br>" +
             "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Мною было принято следующее решение.[/COLOR][/FONT][/CENTER]<br>" +
        "[CENTER][SIZE=4][COLOR=#9d52ff][ICODE]Утвержденный вердикт[/ICODE][/COLOR][/CENTER]<br>" +
             "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Ответ на вашу жалобу был дан в Вашей последней теме профиля.[/COLOR][/FONT][/CENTER]<br>" +
             "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Ознакомиться с правилами составления жалобы можете здесь:[/COLOR][/FONT][FONT=Times New Roman] [URL=https://forum.blackrussia.online/threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BF%D0%BE%D0%B4%D0%B0%D1%87%D0%B8-%D0%B6%D0%B0%D0%BB%D0%BE%D0%B1-%D0%BD%D0%B0-%D0%B8%D0%B3%D1%80%D0%BE%D0%BA%D0%BE%D0%B2.3429394/] «Жалобы на игроков» [/URL][/FONT][/CENTER]<br>" +
             "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Во избежание негативных последствий, убедительно просим Вас не дублировать данную тему.[/COLOR][/FONT][/CENTER]<br>" +
        "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Злоупотребление может привести к [/COLOR][COLOR=#ff0a0a]блокировке вашего аккаунта.[/COLOR][/FONT][/CENTER]<br>" +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/rmf4CLVn/1.png[/img][/url]<br>"+
		    "[CENTER][SIZE=4][COLOR=#ff0a0a][ICODE]Закрыто[/ICODE][/COLOR][/CENTER]<br>"+
    "[CENTER][SIZE=4][FONT=Times New Roman]Приятной игры на сервере [COLOR=#ff7b00] Bratsk (74).[/COLOR][/FONT][/SIZE][/CENTER]",
	  prefix: FAIL_PREFIX,
	  status: false,
	},
    {
	  title: 'Нет нарушений',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
	  content:
		"[CENTER][SIZE=4][FONT=Book Antiqua][COLOR=rgb(111, 0, 255)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/FONT][/CENTER]<br>" +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/rmf4CLVn/1.png[/img][/url]"+
             "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Внимательно изучив и рассмотрев вашу жалобу.[/COLOR][/FONT][/CENTER]<br>" +
             "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Мною было принято следующее решение.[/COLOR][/FONT][/CENTER]<br>" +
        "[CENTER][SIZE=4][COLOR=#9d52ff][ICODE]Утвержденный вердикт[/ICODE][/COLOR][/CENTER]<br>" +
             "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]На Ваших доказательствах отсутствуют нарушения проекта с стороны данного игрока.[/COLOR][/FONT][/CENTER]<br>" +
             "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Ознакомиться с правилами составления жалобы можете здесь:[/COLOR][/FONT][FONT=Times New Roman] [URL=https://forum.blackrussia.online/threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BF%D0%BE%D0%B4%D0%B0%D1%87%D0%B8-%D0%B6%D0%B0%D0%BB%D0%BE%D0%B1-%D0%BD%D0%B0-%D0%B8%D0%B3%D1%80%D0%BE%D0%BA%D0%BE%D0%B2.3429394/] «Жалобы на игроков» [/URL][/FONT][/CENTER]<br>" +
             "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Во избежание негативных последствий, убедительно просим Вас не дублировать данную тему.[/COLOR][/FONT][/CENTER]<br>" +
        "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Злоупотребление может привести к [/COLOR][COLOR=#ff0a0a]блокировке вашего аккаунта.[/COLOR][/FONT][/CENTER]<br>" +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/rmf4CLVn/1.png[/img][/url]" +
		    "[CENTER][SIZE=4][COLOR=#ff0a0a][ICODE]Закрыто[/ICODE][/COLOR][/CENTER]<br>"+
    "[CENTER][SIZE=4][FONT=Times New Roman]Приятной игры на сервере [COLOR=#ff7b00] Bratsk (74).[/COLOR][/FONT][/SIZE][/CENTER]",
	  prefix: FAIL_PREFIX,
	  status: false,
	},
    {
	  title: 'Недостаточно доказательств',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
	  content:
		"[CENTER][SIZE=4][FONT=Book Antiqua][COLOR=rgb(111, 0, 255)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/FONT][/CENTER]<br>" +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/rmf4CLVn/1.png[/img][/url]"+
             "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Внимательно изучив и рассмотрев вашу жалобу.[/COLOR][/FONT][/CENTER]<br>" +
             "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Мною было принято следующее решение.[/COLOR][/FONT][/CENTER]<br>" +
        "[CENTER][SIZE=4][COLOR=#9d52ff][ICODE]Утвержденный вердикт[/ICODE][/COLOR][/CENTER]<br>" +
	"[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]В Вашей жалобе недостаточно доказательств на нарушение.[/COLOR][/FONT][/CENTER]<br>" +
    "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Пожалуйста, перепишите жалобу по форме и убедитесь, что приложенные доказательства четко и однозначно демонстрируют нарушения, совершенные игроком.[/COLOR][/FONT][/CENTER]<br>" +
   "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Ознакомиться с правилами составления жалобы Вы можете здесь:[/COLOR][/FONT][FONT=Times New Roman] [URL=https://forum.blackrussia.online/threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BF%D0%BE%D0%B4%D0%B0%D1%87%D0%B8-%D0%B6%D0%B0%D0%BB%D0%BE%D0%B1-%D0%BD%D0%B0-%D0%B8%D0%B3%D1%80%D0%BE%D0%BA%D0%BE%D0%B2.3429394/] «Жалобы на игроков» [/URL][/FONT][/CENTER]<br>" +
             "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Во избежание негативных последствий, убедительно просим Вас не дублировать данную тему.[/COLOR][/FONT][/CENTER]<br>" +
        "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Злоупотребление может привести к [/COLOR][COLOR=#ff0a0a]блокировке вашего аккаунта.[/COLOR][/FONT][/CENTER]<br>" +        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/rmf4CLVn/1.png[/img][/url]" +
		    "[CENTER][SIZE=4][COLOR=#ff0a0a][ICODE]Закрыто[/ICODE][/COLOR][/CENTER]<br>"+
    "[CENTER][SIZE=4][FONT=Times New Roman]Приятной игры на сервере [COLOR=#ff7b00] Bratsk (74).[/COLOR][/FONT][/SIZE][/CENTER]",
	  prefix: FAIL_PREFIX,
	  status: false,
	},
	    {
	  title: 'Ссылка не работает',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
	  content:
		"[CENTER][SIZE=4][FONT=Book Antiqua][COLOR=rgb(111, 0, 255)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/FONT][/CENTER]<br>" +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/rmf4CLVn/1.png[/img][/url]"+
             "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Внимательно изучив и рассмотрев вашу жалобу.[/COLOR][/FONT][/CENTER]<br>" +
             "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Мною было принято следующее решение.[/COLOR][/FONT][/CENTER]<br>" +
        "[CENTER][SIZE=4][COLOR=#9d52ff][ICODE]Утвержденный вердикт[/ICODE][/COLOR][/CENTER]<br>" +
	"[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Ссылка с доказательствами нерабочая или содержит в себе системную ошибку.[/COLOR][/FONT][/CENTER]<br>" +
    "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Проверьте работоспособность ссылки и составьте новую жалобу по форме.[/COLOR][/FONT][/CENTER]<br>" +
   "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Ознакомиться с правилами составления жалобы Вы можете здесь:[/COLOR][/FONT][FONT=Times New Roman] [URL=https://forum.blackrussia.online/threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BF%D0%BE%D0%B4%D0%B0%D1%87%D0%B8-%D0%B6%D0%B0%D0%BB%D0%BE%D0%B1-%D0%BD%D0%B0-%D0%B8%D0%B3%D1%80%D0%BE%D0%BA%D0%BE%D0%B2.3429394/] «Жалобы на игроков» [/URL][/FONT][/CENTER]<br>" +
             "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Во избежание негативных последствий, убедительно просим Вас не дублировать данную тему.[/COLOR][/FONT][/CENTER]<br>" +
        "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Злоупотребление может привести к [/COLOR][COLOR=#ff0a0a]блокировке вашего аккаунта.[/COLOR][/FONT][/CENTER]<br>" +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/rmf4CLVn/1.png[/img][/url]<br>"+
		    "[CENTER][SIZE=4][COLOR=#ff0a0a][ICODE]Закрыто[/ICODE][/COLOR][/CENTER]<br>"+
    "[CENTER][SIZE=4][FONT=Times New Roman]Приятной игры на сервере [COLOR=#ff7b00] Bratsk (74).[/COLOR][/FONT][/SIZE][/CENTER]",
	  prefix: FAIL_PREFIX,
	  status: false,
	},
    {
	  title: 'Доказательства отредактированы',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
	  content:
		"[CENTER][SIZE=4][FONT=Book Antiqua][COLOR=rgb(111, 0, 255)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/FONT][/CENTER]<br>" +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/rmf4CLVn/1.png[/img][/url]"+
             "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Внимательно изучив и рассмотрев вашу жалобу.[/COLOR][/FONT][/CENTER]<br>" +
             "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Мною было принято следующее решение.[/COLOR][/FONT][/CENTER]<br>" +
        "[CENTER][SIZE=4][COLOR=#9d52ff][ICODE]Утвержденный вердикт[/ICODE][/COLOR][/CENTER]<br>" +
	"[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Видео-доказательства, которые были отредактированы, повреждены,[/COLOR][/FONT][/CENTER]<br>" +
    "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]На которых присутствует: посторонняя музыка, неадекватная речь, нецензурные слова или выражения, не рассматриваются в качестве доказательств.[/COLOR][/FONT][/CENTER]<br>" +
   "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Ознакомиться с правилами составления жалобы Вы можете здесь:[/COLOR][/FONT][FONT=Times New Roman] [URL=https://forum.blackrussia.online/threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BF%D0%BE%D0%B4%D0%B0%D1%87%D0%B8-%D0%B6%D0%B0%D0%BB%D0%BE%D0%B1-%D0%BD%D0%B0-%D0%B8%D0%B3%D1%80%D0%BE%D0%BA%D0%BE%D0%B2.3429394/] «Жалобы на игроков» [/URL][/FONT][/CENTER]<br>" +
          "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Во избежание негативных последствий, убедительно просим Вас не дублировать данную тему.[/COLOR][/FONT][/CENTER]<br>" +
        "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Злоупотребление может привести к [/COLOR][COLOR=#ff0a0a]блокировке вашего аккаунта.[/COLOR][/FONT][/CENTER]<br>" +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/rmf4CLVn/1.png[/img][/url]" +
		    "[CENTER][SIZE=4][COLOR=#ff0a0a][ICODE]Закрыто[/ICODE][/COLOR][/CENTER]<br>"+
    "[CENTER][SIZE=4][FONT=Times New Roman]Приятной игры на сервере [COLOR=#ff7b00] Bratsk (74).[/COLOR][/FONT][/SIZE][/CENTER]",
	  prefix: FAIL_PREFIX,
	  status: false,
	},
        {
	  title: 'Фрапс обрывыется',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
	  content:
		"[CENTER][SIZE=4][FONT=Book Antiqua][COLOR=rgb(111, 0, 255)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/FONT][/CENTER]<br>" +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/rmf4CLVn/1.png[/img][/url]"+
             "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Внимательно изучив и рассмотрев вашу жалобу.[/COLOR][/FONT][/CENTER]<br>" +
             "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Мною было принято следующее решение.[/COLOR][/FONT][/CENTER]<br>" +
        "[CENTER][SIZE=4][COLOR=#9d52ff][ICODE]Утвержденный вердикт[/ICODE][/COLOR][/CENTER]<br>" +
         "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Доказательства в вашей жалобе обрываются.[/COLOR][/FONT][/CENTER]<br>" +
    "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Важно! Для подачи жалобы необходимо предоставить полную видеозапись нарушения правил игрока.[/COLOR][/FONT][/CENTER]<br>" +
	"[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Видео-доказательства, которые были отредактированы, повреждены,[/COLOR][/FONT][/CENTER]<br>" +
    "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]На которых присутствует: посторонняя музыка, неадекватная речь, нецензурные слова или выражения, не рассматриваются в качестве доказательств.[/COLOR][/FONT][/CENTER]<br>" +
   "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Ознакомиться с правилами составления жалобы Вы можете здесь:[/COLOR][/FONT][FONT=Times New Roman] [URL=https://forum.blackrussia.online/threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BF%D0%BE%D0%B4%D0%B0%D1%87%D0%B8-%D0%B6%D0%B0%D0%BB%D0%BE%D0%B1-%D0%BD%D0%B0-%D0%B8%D0%B3%D1%80%D0%BE%D0%BA%D0%BE%D0%B2.3429394/] «Жалобы на игроков» [/URL][/FONT][/CENTER]<br>" +
          "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Во избежание негативных последствий, убедительно просим Вас не дублировать данную тему.[/COLOR][/FONT][/CENTER]<br>" +
        "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Злоупотребление может привести к [/COLOR][COLOR=#ff0a0a]блокировке вашего аккаунта.[/COLOR][/FONT][/CENTER]<br>" +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/rmf4CLVn/1.png[/img][/url]" +
		    "[CENTER][SIZE=4][COLOR=#ff0a0a][ICODE]Закрыто[/ICODE][/COLOR][/CENTER]<br>"+
    "[CENTER][SIZE=4][FONT=Times New Roman]Приятной игры на сервере [COLOR=#ff7b00] Bratsk (74).[/COLOR][/FONT][/SIZE][/CENTER]",
	  prefix: FAIL_PREFIX,
	  status: false,
	},
        {
	  title: 'Нету док-в',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
	  content:
		"[CENTER][SIZE=4][FONT=Book Antiqua][COLOR=rgb(111, 0, 255)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/FONT][/CENTER]<br>" +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/rmf4CLVn/1.png[/img][/url]"+
             "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Внимательно изучив и рассмотрев вашу жалобу.[/COLOR][/FONT][/CENTER]<br>" +
             "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Мною было принято следующее решение.[/COLOR][/FONT][/CENTER]<br>" +
        "[CENTER][SIZE=4][COLOR=#9d52ff][ICODE]Утвержденный вердикт[/ICODE][/COLOR][/CENTER]<br>" +
         "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]В вашей жалобе отсутствуют доказательства на нарушения данного игрока.[/COLOR][/FONT][/CENTER]<br>" +
    "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Создайте новую жалобу, загрузив доказательства с нарушениями.[/COLOR][/FONT][/CENTER]<br>" +
   "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Ознакомиться с правилами составления жалобы Вы можете здесь:[/COLOR][/FONT][FONT=Times New Roman] [URL=https://forum.blackrussia.online/threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BF%D0%BE%D0%B4%D0%B0%D1%87%D0%B8-%D0%B6%D0%B0%D0%BB%D0%BE%D0%B1-%D0%BD%D0%B0-%D0%B8%D0%B3%D1%80%D0%BE%D0%BA%D0%BE%D0%B2.3429394/] «Жалобы на игроков» [/URL][/FONT][/CENTER]<br>" +
          "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Во избежание негативных последствий, убедительно просим Вас не дублировать данную тему.[/COLOR][/FONT][/CENTER]<br>" +
        "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Злоупотребление может привести к [/COLOR][COLOR=#ff0a0a]блокировке вашего аккаунта.[/COLOR][/FONT][/CENTER]<br>" +
		    "[CENTER][SIZE=4][COLOR=#ff0a0a][ICODE]Закрыто[/ICODE][/COLOR][/CENTER]<br>"+
    "[CENTER][SIZE=4][FONT=Times New Roman]Приятной игры на сервере [COLOR=#ff7b00] Bratsk (74).[/COLOR][/FONT][/SIZE][/CENTER]",
	  prefix: FAIL_PREFIX,
	  status: false,
	},
{
	  title: '««««««««««««««««««««««««««««««««««««««« Правила Текстового Чата »»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»',
      dpstyle: 'oswald: 3px;     color: #fff; background: #6f02db; box-shadow: 0 0 2px 0 rgba(148, 0, 201,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #FF0000',
	},
 {
	  title: 'CapsLock',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(0, 255, 0, 0.5); font-family: UtromPressKachat',
	  content:
		"[CENTER][SIZE=4][FONT=Book Antiqua][COLOR=rgb(111, 0, 255)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/FONT][/CENTER]<br>" +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/rmf4CLVn/1.png[/img][/url]"+
             "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Внимательно изучив и рассмотрев вашу жалобу.[/COLOR][/FONT][/CENTER]<br>" +
             "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Мною было принято следующее решение.[/COLOR][/FONT][/CENTER]<br>" +
        "[CENTER][SIZE=4][COLOR=#9d52ff][ICODE]Утвержденный вердикт[/ICODE][/COLOR][/CENTER]<br>" +
             "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Следующий пункт правил определяет меры, которые будут применены к нарушителю.[/COLOR][QUOTE][SIZE=4][FONT=Times New Roman][COLOR=rgb(255, 0, 0)]3.02.[/COLOR] Запрещено использование верхнего регистра (CapsLock) при написании любого текста в любом чате | [COLOR=rgb(255, 0, 0)]Mute 30 минут. [/COLOR][/FONT][/SIZE][/QUOTE][/CENTER]<br>" +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/rmf4CLVn/1.png[/img][/url]"+
        "[CENTER][SIZE=4][COLOR=#70fc05][ICODE]Одобрено[/ICODE][/COLOR][/CENTER]<br>"+
    "[CENTER][SIZE=4][FONT=Times New Roman]Приятной игры на сервере [COLOR=#ff7b00] Bratsk (74).[/COLOR][/FONT][/SIZE][/CENTER]",
	  prefix: OKAY_PREFIX,
	  status: false,
	},
 {
	  title: 'Россизм',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(0, 255, 0, 0.5); font-family: UtromPressKachat',
	  content:
		"[CENTER][SIZE=4][FONT=Book Antiqua][COLOR=rgb(111, 0, 255)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/FONT][/CENTER]<br>" +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/rmf4CLVn/1.png[/img][/url]"+
             "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Внимательно изучив и рассмотрев вашу жалобу.[/COLOR][/FONT][/CENTER]<br>" +
             "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Мною было принято следующее решение.[/COLOR][/FONT][/CENTER]<br>" +
        "[CENTER][SIZE=4][COLOR=#9d52ff][ICODE]Утвержденный вердикт[/ICODE][/COLOR][/CENTER]<br>" +
             "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Следующий пункт правил определяет меры, которые будут применены к нарушителю.[/COLOR][QUOTE][SIZE=4][FONT=Times New Roman][COLOR=rgb(255, 0, 0)]3.03.[/COLOR] Любые формы оскорблений, издевательств, расизма, дискриминации, религиозной враждебности, сексизма в OOC чате запрещены | [COLOR=rgb(255, 0, 0)]Mute 30 минут. [/COLOR][/SIZE][/QUOTE][/CENTER]" +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/rmf4CLVn/1.png[/img][/url]"+
        "[CENTER][SIZE=4][COLOR=#70fc05][ICODE]Одобрено[/ICODE][/COLOR][/CENTER]<br>"+
    "[CENTER][SIZE=4][FONT=Times New Roman]Приятной игры на сервере [COLOR=#ff7b00] Bratsk (74).[/COLOR][/FONT][/SIZE][/CENTER]",
	  prefix: OKAY_PREFIX,
	  status: false,
	},
 {
	  title: 'Упом/Оск Родни',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(0, 255, 0, 0.5); font-family: UtromPressKachat',
	  content:
		"[CENTER][SIZE=4][FONT=Book Antiqua][COLOR=rgb(111, 0, 255)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/FONT][/CENTER]<br>" +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/rmf4CLVn/1.png[/img][/url]"+
             "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Внимательно изучив и рассмотрев вашу жалобу.[/COLOR][/FONT][/CENTER]<br>" +
             "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Мною было принято следующее решение.[/COLOR][/FONT][/CENTER]<br>" +
        "[CENTER][SIZE=4][COLOR=#9d52ff][ICODE]Утвержденный вердикт[/ICODE][/COLOR][/CENTER]<br>" +
             "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Следующий пункт правил определяет меры, которые будут применены к нарушителю.[/COLOR][QUOTE][SIZE=4][FONT=Times New Roman][COLOR=rgb(255, 0, 0)]3.04.[/COLOR] Запрещено оскорбление или косвенное упоминание родных вне зависимости от чата (IC или OOC) | [COLOR=rgb(255, 0, 0)]Mute 120 минут / Ban 7 - 15 дней. [/COLOR][/SIZE][/FONT][/QUOTE][/CENTER]<br>" +
             "[CENTER][FONT=Times New Roman][COLOR=rgb(255, 0, 0)]Примечание:[/COLOR][/FONT][FONT=Book Antiqua][COLOR=#d1d5d8] термины 'MQ', 'rnq' расценивается, как упоминание родных.[/COLOR][/FONT][/CENTER]<br>" +
             "[CENTER][FONT=Times New Roman][COLOR=rgb(255, 0, 0)]Исключение:[/COLOR][/FONT][FONT=Book Antiqua][COLOR=#d1d5d8] если упоминание родных было совершено в ходе Role Play процесса и не содержало в себе прямого или завуалированного оскорбления.[/COLOR][/FONT][/CENTER]<br>" +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/rmf4CLVn/1.png[/img][/url]"+
        "[CENTER][SIZE=4][COLOR=#70fc05][ICODE]Одобрено[/ICODE][/COLOR][/CENTER]<br>"+
    "[CENTER][SIZE=4][FONT=Times New Roman]Приятной игры на сервере [COLOR=#ff7b00] Bratsk (74).[/COLOR][/FONT][/SIZE][/CENTER]",
	  prefix: OKAY_PREFIX,
	  status: false,
	},
 {
	  title: 'FLOOD',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(0, 255, 0, 0.5); font-family: UtromPressKachat',
	  content:
		"[CENTER][SIZE=4][FONT=Book Antiqua][COLOR=rgb(111, 0, 255)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/FONT][/CENTER]<br>" +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/rmf4CLVn/1.png[/img][/url]"+
             "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Внимательно изучив и рассмотрев вашу жалобу.[/COLOR][/FONT][/CENTER]<br>" +
             "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Мною было принято следующее решение.[/COLOR][/FONT][/CENTER]<br>" +
        "[CENTER][SIZE=4][COLOR=#9d52ff][ICODE]Утвержденный вердикт[/ICODE][/COLOR][/CENTER]<br>" +
             "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Следующий пункт правил определяет меры, которые будут применены к нарушителю.[/COLOR][QUOTE][SIZE=4][FONT=Times New Roman][COLOR=rgb(255, 0, 0)]3.05.[/COLOR] Запрещен флуд — 3 и более повторяющихся сообщений от одного и того же игрока | [COLOR=rgb(255, 0, 0)]Mute 30 минут. [/COLOR][/SIZE][/QUOTE][/CENTER]" +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/rmf4CLVn/1.png[/img][/url]"+
        "[CENTER][SIZE=4][COLOR=#70fc05][ICODE]Одобрено[/ICODE][/COLOR][/CENTER]<br>"+
    "[CENTER][SIZE=4][FONT=Times New Roman]Приятной игры на сервере [COLOR=#ff7b00] Bratsk (74).[/COLOR][/FONT][/SIZE][/CENTER]",
	  prefix: OKAY_PREFIX,
	  status: false,
	},
 {
	  title: 'Злоуп Символами',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(0, 255, 0, 0.5); font-family: UtromPressKachat',
	  content:
		"[CENTER][SIZE=4][FONT=Book Antiqua][COLOR=rgb(111, 0, 255)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/FONT][/CENTER]<br>" +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/rmf4CLVn/1.png[/img][/url]"+
             "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Внимательно изучив и рассмотрев вашу жалобу.[/COLOR][/FONT][/CENTER]<br>" +
             "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Мною было принято следующее решение.[/COLOR][/FONT][/CENTER]<br>" +
        "[CENTER][SIZE=4][COLOR=#9d52ff][ICODE]Утвержденный вердикт[/ICODE][/COLOR][/CENTER]<br>" +
             "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Следующий пункт правил определяет меры, которые будут применены к нарушителю.[/COLOR][QUOTE][SIZE=4][FONT=Times New Roman][COLOR=rgb(255, 0, 0)]3.06.[/COLOR] Запрещено злоупотребление знаков препинания и прочих символов | [COLOR=rgb(255, 0, 0)]Mute 30 минут. [/COLOR][/SIZE][/QUOTE][/CENTER]" +
             "[CENTER][FONT=Times New Roman][COLOR=rgb(255, 0, 0)]Пример:[/FONT][/COLOR][FONT=Book Antiqua][COLOR=#d1d5d8] «???????», «!!!!!!!», «Дааааааааааааааааааааааа» и так далее.[/COLOR][/FONT][/CENTER]<br>" +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/rmf4CLVn/1.png[/img][/url]"+
        "[CENTER][SIZE=4][COLOR=#70fc05][ICODE]Одобрено[/ICODE][/COLOR][/CENTER]<br>"+
    "[CENTER][SIZE=4][FONT=Times New Roman]Приятной игры на сервере [COLOR=#ff7b00] Bratsk (74).[/COLOR][/FONT][/SIZE][/CENTER]",
	  prefix: OKAY_PREFIX,
	  status: false,
	},
 {
	  title: 'Слив Глоб Чатов',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(0, 255, 0, 0.5); font-family: UtromPressKachat',
	  content:
		"[CENTER][SIZE=4][FONT=Book Antiqua][COLOR=rgb(111, 0, 255)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/FONT][/CENTER]<br>" +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/rmf4CLVn/1.png[/img][/url]"+
             "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Внимательно изучив и рассмотрев вашу жалобу.[/COLOR][/FONT][/CENTER]<br>" +
             "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Мною было принято следующее решение.[/COLOR][/FONT][/CENTER]<br>" +
        "[CENTER][SIZE=4][COLOR=#9d52ff][ICODE]Утвержденный вердикт[/ICODE][/COLOR][/CENTER]<br>" +
             "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Следующий пункт правил определяет меры, которые будут применены к нарушителю.[/COLOR][QUOTE][SIZE=4][FONT=Times New Roman][COLOR=rgb(255, 0, 0)]3.08.[/COLOR] Запрещены любые формы «слива» посредством использования глобальных чатов | [COLOR=rgb(255, 0, 0)]PermBan. [/SIZE][/QUOTE][/COLOR][/CENTER]" +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/rmf4CLVn/1.png[/img][/url]"+
        "[CENTER][SIZE=4][COLOR=#70fc05][ICODE]Одобрено[/ICODE][/COLOR][/CENTER]<br>"+
    "[CENTER][SIZE=4][FONT=Times New Roman]Приятной игры на сервере [COLOR=#ff7b00] Bratsk (74).[/COLOR][/FONT][/SIZE][/CENTER]",
	  prefix: OKAY_PREFIX,
	  status: false,
	},
 { 
	  title: 'Выдача себя за адм',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(0, 255, 0, 0.5); font-family: UtromPressKachat',
	  content:
		"[CENTER][SIZE=4][FONT=Book Antiqua][COLOR=rgb(111, 0, 255)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/FONT][/CENTER]<br>" +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/rmf4CLVn/1.png[/img][/url]"+
             "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Внимательно изучив и рассмотрев вашу жалобу.[/COLOR][/FONT][/CENTER]<br>" +
             "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Мною было принято следующее решение.[/COLOR][/FONT][/CENTER]<br>" +
        "[CENTER][SIZE=4][COLOR=#9d52ff][ICODE]Утвержденный вердикт[/ICODE][/COLOR][/CENTER]<br>" +
             "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Следующий пункт правил определяет меры, которые будут применены к нарушителю.[/COLOR][QUOTE][SIZE=4][FONT=Times New Roman][COLOR=rgb(255, 0, 0)]3.10.[/COLOR] Запрещена выдача себя за администратора, если таковым не являетесь | [COLOR=rgb(255, 0, 0)]Ban 7 - 15 + ЧС администрации. [/SIZE][/QUOTE][/COLOR][/CENTER]" +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/rmf4CLVn/1.png[/img][/url]<br>"+
        "[CENTER][SIZE=4][COLOR=#70fc05][ICODE]Одобрено[/ICODE][/COLOR][/CENTER]<br>"+
    "[CENTER][SIZE=4][FONT=Times New Roman]Приятной игры на сервере [COLOR=#ff7b00] Bratsk (74).[/COLOR][/FONT][/SIZE][/CENTER]",
	  prefix: OKAY_PREFIX,
	  status: false,
	},
 {
	  title: 'Злоуп командами',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(0, 255, 0, 0.5); font-family: UtromPressKachat',
	  content:
		"[CENTER][SIZE=4][FONT=Book Antiqua][COLOR=rgb(111, 0, 255)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/FONT][/CENTER]<br>" +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/rmf4CLVn/1.png[/img][/url]"+
             "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Внимательно изучив и рассмотрев вашу жалобу.[/COLOR][/FONT][/CENTER]<br>" +
             "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Мною было принято следующее решение.[/COLOR][/FONT][/CENTER]<br>" +
        "[CENTER][SIZE=4][COLOR=#9d52ff][ICODE]Утвержденный вердикт[/ICODE][/COLOR][/CENTER]<br>" +
             "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Следующий пункт правил определяет меры, которые будут применены к нарушителю.[/COLOR][QUOTE][SIZE=4][FONT=Times New Roman][COLOR=rgb(255, 0, 0)]3.11.[/COLOR] Запрещено введение игроков проекта в заблуждение путем злоупотребления командами | [COLOR=rgb(255, 0, 0)]Ban 15 - 30 дней / PermBan. [/SIZE][/QUOTE][/COLOR][/CENTER]" +
             "[CENTER][FONT=Times New Roman][COLOR=rgb(255, 0, 0)]Примечание:[/FONT][/COLOR][FONT=Book Antiqua][COLOR=#d1d5d8] /me чтобы поднять кошелек введите /pay 228 5000. Для продажи автомобиля введите /sellmycar id 2828 (счёт в банке) цена.[/COLOR][/FONT][/CENTER]" +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/rmf4CLVn/1.png[/img][/url]<br>"+
        "[CENTER][SIZE=4][COLOR=#70fc05][ICODE]Одобрено[/ICODE][/COLOR][/CENTER]<br>"+
    "[CENTER][SIZE=4][FONT=Times New Roman]Приятной игры на сервере [COLOR=#ff7b00] Bratsk (74).[/COLOR][/FONT][/SIZE][/CENTER]",
	  prefix: OKAY_PREFIX,
	  status: false,
	},
 {
	  title: 'Наруш в репорт',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(0, 255, 0, 0.5); font-family: UtromPressKachat',
	  content:
		"[CENTER][SIZE=4][FONT=Book Antiqua][COLOR=rgb(111, 0, 255)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/FONT][/CENTER]<br>" +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/rmf4CLVn/1.png[/img][/url]"+
             "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Внимательно изучив и рассмотрев вашу жалобу.[/COLOR][/FONT][/CENTER]<br>" +
             "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Мною было принято следующее решение.[/COLOR][/FONT][/CENTER]<br>" +
        "[CENTER][SIZE=4][COLOR=#9d52ff][ICODE]Утвержденный вердикт[/ICODE][/COLOR][/CENTER]<br>" +
             "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Следующий пункт правил определяет меры, которые будут применены к нарушителю.[/COLOR][QUOTE][SIZE=4][FONT=Times New Roman][COLOR=rgb(255, 0, 0)]3.12.[/COLOR] Запрещено подавать репорт написанный транслитом, с сообщением не по теме (Offtop), с включенным Caps Lock и повторять обращение (если ответ был уже дан ранее) | [COLOR=rgb(255, 0, 0)]Report Mute 30 минут. [/SIZE][/QUOTE][/COLOR][/CENTER]" +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/rmf4CLVn/1.png[/img][/url]<br>"+
        "[CENTER][SIZE=4][COLOR=#70fc05][ICODE]Одобрено[/ICODE][/COLOR][/CENTER]<br>"+
    "[CENTER][SIZE=4][FONT=Times New Roman]Приятной игры на сервере [COLOR=#ff7b00] Bratsk (74).[/COLOR][/FONT][/SIZE][/CENTER]",
	  prefix: OKAY_PREFIX,
	  status: false,
	},
 {
	  title: 'Музыка в Voice чат',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(0, 255, 0, 0.5); font-family: UtromPressKachat',
	  content:
		"[CENTER][SIZE=4][FONT=Book Antiqua][COLOR=rgb(111, 0, 255)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/FONT][/CENTER]<br>" +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/rmf4CLVn/1.png[/img][/url]"+
             "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Внимательно изучив и рассмотрев вашу жалобу.[/COLOR][/FONT][/CENTER]<br>" +
             "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Мною было принято следующее решение.[/COLOR][/FONT][/CENTER]<br>" +
        "[CENTER][SIZE=4][COLOR=#9d52ff][ICODE]Утвержденный вердикт[/ICODE][/COLOR][/CENTER]<br>" +
             "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Следующий пункт правил определяет меры, которые будут применены к нарушителю.[/COLOR][QUOTE][SIZE=4][FONT=Times New Roman][COLOR=rgb(255, 0, 0)]3.14.[/COLOR] Запрещено включать музыку в Voice Chat | [COLOR=rgb(255, 0, 0)]Mute 60 минут. [/SIZE][/QUOTE][/COLOR][/CENTER]" +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/rmf4CLVn/1.png[/img][/url]<br>"+
        "[CENTER][SIZE=4][COLOR=#70fc05][ICODE]Одобрено[/ICODE][/COLOR][/CENTER]<br>"+
    "[CENTER][SIZE=4][FONT=Times New Roman]Приятной игры на сервере [COLOR=#ff7b00] Bratsk (74).[/COLOR][/FONT][/SIZE][/CENTER]",
	  prefix: OKAY_PREFIX,
	  status: false,
	},
 {
	  title: 'Шумы',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(0, 255, 0, 0.5); font-family: UtromPressKachat',
	  content:
		"[CENTER][SIZE=4][FONT=Book Antiqua][COLOR=rgb(111, 0, 255)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/FONT][/CENTER]<br>" +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/rmf4CLVn/1.png[/img][/url]"+
             "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Внимательно изучив и рассмотрев вашу жалобу.[/COLOR][/FONT][/CENTER]<br>" +
             "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Мною было принято следующее решение.[/COLOR][/FONT][/CENTER]<br>" +
        "[CENTER][SIZE=4][COLOR=#9d52ff][ICODE]Утвержденный вердикт[/ICODE][/COLOR][/CENTER]<br>" +
             "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Следующий пункт правил определяет меры, которые будут применены к нарушителю.[/COLOR][QUOTE][SIZE=4][FONT=Times New Roman][COLOR=rgb(255, 0, 0)]3.16.[/COLOR] Запрещено создавать посторонние шумы или звуки | [COLOR=rgb(255, 0, 0)]Mute 30 минут. [/SIZE][/QUOTE][/COLOR][/CENTER]" +
             "[CENTER][FONT=Times New Roman][COLOR=rgb(255, 0, 0)]Примечание:[/FONT][/COLOR][FONT=Book Antiqua][COLOR=#d1d5d8] Посторонние звуки на фоне речи, мешающие взаимодействию игроков посредством голосового чата. Сильное искажение звука, исходящее из микрофона плохого качества. Намеренно портить игру другим игрокам (кричать, перебивать)[/COLOR][/FONT][/CENTER]<br>" +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/rmf4CLVn/1.png[/img][/url]<br>"+
        "[CENTER][SIZE=4][COLOR=#70fc05][ICODE]Одобрено[/ICODE][/COLOR][/CENTER]<br>"+
    "[CENTER][SIZE=4][FONT=Times New Roman]Приятной игры на сервере [COLOR=#ff7b00] Bratsk (74).[/COLOR][/FONT][/SIZE][/CENTER]",
	  prefix: OKAY_PREFIX,
	  status: false,
	},
 {
	  title: 'Политика/Религия',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(0, 255, 0, 0.5); font-family: UtromPressKachat',
	  content:
		"[CENTER][SIZE=4][FONT=Book Antiqua][COLOR=rgb(111, 0, 255)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/FONT][/CENTER]<br>" +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/rmf4CLVn/1.png[/img][/url]"+
             "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Внимательно изучив и рассмотрев вашу жалобу.[/COLOR][/FONT][/CENTER]<br>" +
             "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Мною было принято следующее решение.[/COLOR][/FONT][/CENTER]<br>" +
        "[CENTER][SIZE=4][COLOR=#9d52ff][ICODE]Утвержденный вердикт[/ICODE][/COLOR][/CENTER]<br>" +
             "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Следующий пункт правил определяет меры, которые будут применены к нарушителю.[/COLOR][QUOTE][SIZE=4][FONT=Times New Roman][COLOR=rgb(255, 0, 0)]3.18.[/COLOR] Запрещено политическое и религиозное пропагандирование, а также провокация игроков к конфликтам, коллективному флуду или беспорядкам в любом из чатов | [COLOR=rgb(255, 0, 0)]Mute 120 минут / Ban 10 дней. [/SIZE][/QUOTE][/COLOR][/CENTER]" +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/rmf4CLVn/1.png[/img][/url]<br>"+
        "[CENTER][SIZE=4][COLOR=#70fc05][ICODE]Одобрено[/ICODE][/COLOR][/CENTER]<br>"+
    "[CENTER][SIZE=4][FONT=Times New Roman]Приятной игры на сервере [COLOR=#ff7b00] Bratsk (74).[/COLOR][/FONT][/SIZE][/CENTER]",
	  prefix: OKAY_PREFIX,
	  status: false,
	},
 {
	  title: 'Софт для голоса',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(0, 255, 0, 0.5); font-family: UtromPressKachat',
	  content:
		"[CENTER][SIZE=4][FONT=Book Antiqua][COLOR=rgb(111, 0, 255)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/FONT][/CENTER]<br>" +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/rmf4CLVn/1.png[/img][/url]"+
             "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Внимательно изучив и рассмотрев вашу жалобу.[/COLOR][/FONT][/CENTER]<br>" +
             "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Мною было принято следующее решение.[/COLOR][/FONT][/CENTER]<br>" +
        "[CENTER][SIZE=4][COLOR=#9d52ff][ICODE]Утвержденный вердикт[/ICODE][/COLOR][/CENTER]<br>" +
             "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Следующий пункт правил определяет меры, которые будут применены к нарушителю.[/COLOR][QUOTE][SIZE=4][FONT=Times New Roman][COLOR=rgb(255, 0, 0)]3.19.[/COLOR] Запрещено использование любого софта для изменения голоса | [COLOR=rgb(255, 0, 0)]Mute 60 минут. [/SIZE][/QUOTE][/COLOR][/CENTER]" +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/rmf4CLVn/1.png[/img][/url]<br>"+
        "[CENTER][SIZE=4][COLOR=#70fc05][ICODE]Одобрено[/ICODE][/COLOR][/CENTER]<br>"+
    "[CENTER][SIZE=4][FONT=Times New Roman]Приятной игры на сервере [COLOR=#ff7b00] Bratsk (74).[/COLOR][/FONT][/SIZE][/CENTER]",
	  prefix: OKAY_PREFIX,
	  status: false,
	},
 {
	  title: 'Транслит',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(0, 255, 0, 0.5); font-family: UtromPressKachat',
	  content:
		"[CENTER][SIZE=4][FONT=Book Antiqua][COLOR=rgb(111, 0, 255)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/FONT][/CENTER]<br>" +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/rmf4CLVn/1.png[/img][/url]"+
             "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Внимательно изучив и рассмотрев вашу жалобу.[/COLOR][/FONT][/CENTER]<br>" +
             "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Мною было принято следующее решение.[/COLOR][/FONT][/CENTER]<br>" +
        "[CENTER][SIZE=4][COLOR=#9d52ff][ICODE]Утвержденный вердикт[/ICODE][/COLOR][/CENTER]<br>" +
             "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Следующий пункт правил определяет меры, которые будут применены к нарушителю.[/COLOR][QUOTE][SIZE=4][FONT=Times New Roman][COLOR=rgb(255, 0, 0)]3.20.[/COLOR] Запрещено использование транслита в любом из чатов | [COLOR=rgb(255, 0, 0)]Mute 30 минут. [/SIZE][/QUOTE][/COLOR][/CENTER]" +
             "[CENTER][FONT=Times New Roman][COLOR=rgb(255, 0, 0)]Примечание:[/FONT][/COLOR][FONT=Book Antiqua][COLOR=#d1d5d8]Пример: «Privet», «Kak dela», «Narmalna».[/COLOR][/FONT][/CENTER]<br>" +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/rmf4CLVn/1.png[/img][/url]<br>"+
        "[CENTER][SIZE=4][COLOR=#70fc05][ICODE]Одобрено[/ICODE][/COLOR][/CENTER]<br>"+
    "[CENTER][SIZE=4][FONT=Times New Roman]Приятной игры на сервере [COLOR=#ff7b00] Bratsk (74).[/COLOR][/FONT][/SIZE][/CENTER]",
	  prefix: OKAY_PREFIX,
	  status: false,
	},
 {
	  title: 'Реклама Промо',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(0, 255, 0, 0.5); font-family: UtromPressKachat',
	  content:
		"[CENTER][SIZE=4][FONT=Book Antiqua][COLOR=rgb(111, 0, 255)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/FONT][/CENTER]<br>" +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/rmf4CLVn/1.png[/img][/url]"+
             "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Внимательно изучив и рассмотрев вашу жалобу.[/COLOR][/FONT][/CENTER]<br>" +
             "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Мною было принято следующее решение.[/COLOR][/FONT][/CENTER]<br>" +
        "[CENTER][SIZE=4][COLOR=#9d52ff][ICODE]Утвержденный вердикт[/ICODE][/COLOR][/CENTER]<br>" +
             "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Следующий пункт правил определяет меры, которые будут применены к нарушителю.[/COLOR][QUOTE][SIZE=4][FONT=Times New Roman][COLOR=rgb(255, 0, 0)]3.21.[/COLOR] Запрещается реклама промокодов в игре, а также их упоминание в любом виде во всех чатах. | [COLOR=rgb(255, 0, 0)]Ban 30 дней. [/SIZE][/QUOTE][/COLOR][/CENTER]" +
             "[CENTER][FONT=Times New Roman][COLOR=rgb(255, 0, 0)]Примечание:[/FONT][/COLOR][FONT=Book Antiqua][COLOR=#d1d5d8] чаты семейные, строительных компаний, транспортных компаний, фракционные чаты, IC, OOC, VIP и так далее.[/COLOR][/FONT][/CENTER]<br>" +
             "[CENTER][FONT=Times New Roman][COLOR=rgb(255, 0, 0)]Исключение:[/FONT][/COLOR][FONT=Book Antiqua][COLOR=#d1d5d8] промокоды, предоставленные разработчиками, а также распространяемые через официальные ресурсы проекта.[/COLOR][/FONT][/CENTER]<br>" +
             "[CENTER][FONT=Times New Roman][COLOR=rgb(255, 0, 0)]Пример:[/FONT][/COLOR][FONT=Book Antiqua][COLOR=#d1d5d8] если игрок упомянет промокод, распространяемый через официальную публичную страницу ВКонтакте либо через официальный Discord в любом из чатов, наказание ему не выдается.[/COLOR][/FONT][/CENTER]<br>" +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/rmf4CLVn/1.png[/img][/url]<br>"+
        "[CENTER][SIZE=4][COLOR=#70fc05][ICODE]Одобрено[/ICODE][/COLOR][/CENTER]<br>"+
    "[CENTER][SIZE=4][FONT=Times New Roman]Приятной игры на сервере [COLOR=#ff7b00] Bratsk (74).[/COLOR][/FONT][/SIZE][/CENTER]",
	  prefix: OKAY_PREFIX,
	  status: false,
	},
 {
	  title: 'ГОСС обьявления',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(0, 255, 0, 0.5); font-family: UtromPressKachat',
	  content:
		"[CENTER][SIZE=4][FONT=Book Antiqua][COLOR=rgb(111, 0, 255)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/FONT][/CENTER]<br>" +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/rmf4CLVn/1.png[/img][/url]"+
             "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Внимательно изучив и рассмотрев вашу жалобу.[/COLOR][/FONT][/CENTER]<br>" +
             "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Мною было принято следующее решение.[/COLOR][/FONT][/CENTER]<br>" +
        "[CENTER][SIZE=4][COLOR=#9d52ff][ICODE]Утвержденный вердикт[/ICODE][/COLOR][/CENTER]<br>" +
             "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Следующий пункт правил определяет меры, которые будут применены к нарушителю.[/COLOR][QUOTE][SIZE=4][FONT=Times New Roman][COLOR=rgb(255, 0, 0)]3.22.[/COLOR] Запрещено публиковать любые объявления в помещениях государственных организаций вне зависимости от чата (IC или OOC) | [COLOR=rgb(255, 0, 0)]Mute 30 минут. [/SIZE][/QUOTE][/COLOR][/CENTER]" +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/rmf4CLVn/1.png[/img][/url]<br>"+
        "[CENTER][SIZE=4][COLOR=#70fc05][ICODE]Одобрено[/ICODE][/COLOR][/CENTER]<br>"+
    "[CENTER][SIZE=4][FONT=Times New Roman]Приятной игры на сервере [COLOR=#ff7b00] Bratsk (74).[/COLOR][/FONT][/SIZE][/CENTER]",
	  prefix: OKAY_PREFIX,
	  status: false,
	},
 {
	  title: 'Мат в VIP чат',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(0, 255, 0, 0.5); font-family: UtromPressKachat',
	  content:
		"[CENTER][SIZE=4][FONT=Book Antiqua][COLOR=rgb(111, 0, 255)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/FONT][/CENTER]<br>" +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/rmf4CLVn/1.png[/img][/url]"+
             "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Внимательно изучив и рассмотрев вашу жалобу.[/COLOR][/FONT][/CENTER]<br>" +
             "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Мною было принято следующее решение.[/COLOR][/FONT][/CENTER]<br>" +
        "[CENTER][SIZE=4][COLOR=#9d52ff][ICODE]Утвержденный вердикт[/ICODE][/COLOR][/CENTER]<br>" +
             "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Следующий пункт правил определяет меры, которые будут применены к нарушителю.[/COLOR][QUOTE][SIZE=4][FONT=Times New Roman][COLOR=rgb(255, 0, 0)]3.23.[/COLOR] Запрещено использование нецензурных слов, в том числе завуалированных и литературных в VIP чате | [COLOR=rgb(255, 0, 0)]Mute 30 минут. [/SIZE][/QUOTE][/COLOR][/CENTER]" +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/rmf4CLVn/1.png[/img][/url]<br>"+
        "[CENTER][SIZE=4][COLOR=#70fc05][ICODE]Одобрено[/ICODE][/COLOR][/CENTER]<br>"+
    "[CENTER][SIZE=4][FONT=Times New Roman]Приятной игры на сервере [COLOR=#ff7b00] Bratsk (74).[/COLOR][/FONT][/SIZE][/CENTER]",
	  prefix: OKAY_PREFIX,
	  status: false,
	},
   {
	  title: '«««««««««««««««««««««««««««««««««««««« Правила RolePlay Процесса »»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»',
      dpstyle: 'oswald: 3px;     color: #fff; background: #6f02db; box-shadow: 0 0 2px 0 rgba(148, 0, 201,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #FF0000',
       },
 {
	  title: 'nRP повидение',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(0, 255, 0, 0.5); font-family: UtromPressKachat',
	  content:
		"[CENTER][SIZE=4][FONT=Book Antiqua][COLOR=rgb(111, 0, 255)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/FONT][/CENTER]<br>" +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/rmf4CLVn/1.png[/img][/url]"+
             "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Внимательно изучив и рассмотрев вашу жалобу.[/COLOR][/FONT][/CENTER]<br>" +
             "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Мною было принято следующее решение.[/COLOR][/FONT][/CENTER]<br>" +
        "[CENTER][SIZE=4][COLOR=#9d52ff][ICODE]Утвержденный вердикт[/ICODE][/COLOR][/CENTER]<br>" +
	     "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Нарушитель будет наказан по пункту правил:[/COLOR][/FONT][QUOTE][SIZE=4][FONT=Times New Roman][COLOR=rgb(255, 0, 0)]2.01.[/COLOR] Запрещено поведение, нарушающее нормы процессов Role Play режима игры | [COLOR=rgb(255, 0, 0)]Jail 30 минут.[/COLOR][/SIZE][/QUOTE][/CENTER]" +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/rmf4CLVn/1.png[/img][/url]<br>"+
        "[CENTER][SIZE=4][COLOR=#70fc05][ICODE]Одобрено[/ICODE][/COLOR][/CENTER]<br>"+
             "[CENTER][SIZE=4][FONT=Times New Roman]Приятной игры на сервере [COLOR=#ff7b00] Bratsk (74).[/COLOR][/FONT][/SIZE][/CENTER]",
	  prefix: OKAY_PREFIX,
	  status: false,
	},
 {
      title: 'nRP Cop',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(0, 255, 0, 0.5); font-family: UtromPressKachat',
	  content:
		"[CENTER][SIZE=4][FONT=Book Antiqua][COLOR=rgb(111, 0, 255)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/FONT][/CENTER]<br>" +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/rmf4CLVn/1.png[/img][/url]"+
             "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Внимательно изучив и рассмотрев вашу жалобу.[/COLOR][/FONT][/CENTER]<br>" +
             "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Мною было принято следующее решение.[/COLOR][/FONT][/CENTER]<br>" +
        "[CENTER][SIZE=4][COLOR=#9d52ff][ICODE]Утвержденный вердикт[/ICODE][/COLOR][/CENTER]<br>" +
	     "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Нарушитель будет наказан по пункту правил:[/COLOR][/FONT][QUOTE][SIZE=4][FONT=Times New Roman][COLOR=rgb(255, 0, 0)]2.01.[/COLOR] Запрещено поведение, нарушающее нормы процессов Role Play режима игры | [COLOR=rgb(255, 0, 0)]Warn.[/COLOR][/SIZE][/QUOTE][/CENTER]" +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/rmf4CLVn/1.png[/img][/url]<br>"+
        "[CENTER][SIZE=4][COLOR=#70fc05][ICODE]Одобрено[/ICODE][/COLOR][/CENTER]<br>"+
    "[CENTER][SIZE=4][FONT=Times New Roman]Приятной игры на сервере [COLOR=#ff7b00] Bratsk (74).[/COLOR][/FONT][/SIZE][/CENTER]",
	  prefix: OKAY_PREFIX,
	  status: false,
	},
 {
	  title: 'Уход от RP',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(0, 255, 0, 0.5); font-family: UtromPressKachat',
	  content:
		"[CENTER][SIZE=4][FONT=Book Antiqua][COLOR=rgb(111, 0, 255)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/FONT][/CENTER]<br>" +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/rmf4CLVn/1.png[/img][/url]"+
             "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Внимательно изучив и рассмотрев вашу жалобу.[/COLOR][/FONT][/CENTER]<br>" +
             "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Мною было принято следующее решение.[/COLOR][/FONT][/CENTER]<br>" +
        "[CENTER][SIZE=4][COLOR=#9d52ff][ICODE]Утвержденный вердикт[/ICODE][/COLOR][/CENTER]<br>" +
	     "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Нарушитель будет наказан по пункту правил:[/COLOR][/FONT][QUOTE][SIZE=4][FONT=Times New Roman][COLOR=rgb(255, 0, 0)]2.02.[/COLOR] Запрещено целенаправленно уходить от Role Play процесса все различными способами | [COLOR=rgb(255, 0, 0)]Jail 30 минут / Warn.[/COLOR][/SIZE][/QUOTE][/CENTER]" +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/rmf4CLVn/1.png[/img][/url]<br>"+
        "[CENTER][SIZE=4][COLOR=#70fc05][ICODE]Одобрено[/ICODE][/COLOR][/CENTER]<br>"+
    "[CENTER][SIZE=4][FONT=Times New Roman]Приятной игры на сервере [COLOR=#ff7b00] Bratsk (74).[/COLOR][/FONT][/SIZE][/CENTER]",
	  prefix: OKAY_PREFIX,
	  status: false,
	},
 {
	  title: 'NonRP Drive',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(0, 255, 0, 0.5); font-family: UtromPressKachat',
	  content:
		"[CENTER][SIZE=4][FONT=Book Antiqua][COLOR=rgb(111, 0, 255)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/FONT][/CENTER]<br>" +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/rmf4CLVn/1.png[/img][/url]"+
             "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Внимательно изучив и рассмотрев вашу жалобу.[/COLOR][/FONT][/CENTER]<br>" +
             "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Мною было принято следующее решение.[/COLOR][/FONT][/CENTER]<br>" +
        "[CENTER][SIZE=4][COLOR=#9d52ff][ICODE]Утвержденный вердикт[/ICODE][/COLOR][/CENTER]<br>" +
	     "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Нарушитель будет наказан по пункту правил:[/COLOR][/FONT][QUOTE][SIZE=4][FONT=Times New Roman][COLOR=rgb(255, 0, 0)]2.03.[/COLOR] Запрещен NonRP Drive — вождение любого транспортного средства в невозможных для него условиях, а также вождение в неправдоподобной манере | [COLOR=rgb(255, 0, 0)]Jail 30 минут.[/COLOR][/SIZE][/QUOTE][/CENTER]" +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/rmf4CLVn/1.png[/img][/url]<br>"+
        "[CENTER][SIZE=4][COLOR=#70fc05][ICODE]Одобрено[/ICODE][/COLOR][/CENTER]<br>"+
    "[CENTER][SIZE=4][FONT=Times New Roman]Приятной игры на сервере [COLOR=#ff7b00] Bratsk (74).[/COLOR][/FONT][/SIZE][/CENTER]",
	  prefix: OKAY_PREFIX,
	  status: false,
	},
 {
	  title: 'Помеха RP',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(0, 255, 0, 0.5); font-family: UtromPressKachat',
	  content:
		"[CENTER][SIZE=4][FONT=Book Antiqua][COLOR=rgb(111, 0, 255)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/FONT][/CENTER]<br>" +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/rmf4CLVn/1.png[/img][/url]"+
             "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Внимательно изучив и рассмотрев вашу жалобу.[/COLOR][/FONT][/CENTER]<br>" +
             "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Мною было принято следующее решение.[/COLOR][/FONT][/CENTER]<br>" +
        "[CENTER][SIZE=4][COLOR=#9d52ff][ICODE]Утвержденный вердикт[/ICODE][/COLOR][/CENTER]<br>" +
	     "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Нарушитель будет наказан по пункту правил:[/COLOR][/FONT][QUOTE][SIZE=4][FONT=Times New Roman][COLOR=rgb(255, 0, 0)]2.04.[/COLOR] Запрещены любые действия способные привести к помехам в игровом процессе, а также выполнению работ, если они этого не предусматривают и если эти действия выходят за рамки игрового процесса данной работы. | [COLOR=rgb(255, 0, 0)]Ban 10 дней / Обнуление аккаунта (при повторном нарушении).[/COLOR][/SIZE][/QUOTE][/CENTER]" +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/rmf4CLVn/1.png[/img][/url]<br>"+
        "[CENTER][SIZE=4][COLOR=#70fc05][ICODE]Одобрено[/ICODE][/COLOR][/CENTER]<br>"+
    "[CENTER][SIZE=4][FONT=Times New Roman]Приятной игры на сервере [COLOR=#ff7b00] Bratsk (74).[/COLOR][/FONT][/SIZE][/CENTER]",
	  prefix: OKAY_PREFIX,
	  status: false,
	},
 {
	  title: 'nRP обман ',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(0, 255, 0, 0.5); font-family: UtromPressKachat',
	  content:
		"[CENTER][SIZE=4][FONT=Book Antiqua][COLOR=rgb(111, 0, 255)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/FONT][/CENTER]<br>" +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/rmf4CLVn/1.png[/img][/url]"+
             "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Внимательно изучив и рассмотрев вашу жалобу.[/COLOR][/FONT][/CENTER]<br>" +
             "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Мною было принято следующее решение.[/COLOR][/FONT][/CENTER]<br>" +
        "[CENTER][SIZE=4][COLOR=#9d52ff][ICODE]Утвержденный вердикт[/ICODE][/COLOR][/CENTER]<br>" +
	     "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Нарушитель будет наказан по пункту правил:[/COLOR][/FONT][QUOTE][SIZE=4][FONT=Times New Roman][COLOR=rgb(255, 0, 0)]2.05.[/COLOR]Запрещены любые OOC обманы и их попытки, а также любые IC обманы с нарушением Role Play правил и логики | [COLOR=rgb(255, 0, 0)]PermBan.[/COLOR][/SIZE][/QUOTE][/CENTER]" +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/rmf4CLVn/1.png[/img][/url]<br>"+
        "[CENTER][SIZE=4][COLOR=#70fc05][ICODE]Одобрено[/ICODE][/COLOR][/CENTER]<br>"+
    "[CENTER][SIZE=4][FONT=Times New Roman]Приятной игры на сервере [COLOR=#ff7b00] Bratsk (74).[/COLOR][/FONT][/SIZE][/CENTER]",
	  prefix: OKAY_PREFIX,
	  status: false,
	},
 {
	  title: 'AFK без ESC ',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(0, 255, 0, 0.5); font-family: UtromPressKachat',
	  content:
		"[CENTER][SIZE=4][FONT=Book Antiqua][COLOR=rgb(111, 0, 255)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/FONT][/CENTER]<br>" +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/rmf4CLVn/1.png[/img][/url]"+
             "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Внимательно изучив и рассмотрев вашу жалобу.[/COLOR][/FONT][/CENTER]<br>" +
             "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Мною было принято следующее решение.[/COLOR][/FONT][/CENTER]<br>" +
        "[CENTER][SIZE=4][COLOR=#9d52ff][ICODE]Утвержденный вердикт[/ICODE][/COLOR][/CENTER]<br>" +
	     "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Нарушитель будет наказан по пункту правил:[/COLOR][/FONT][QUOTE][SIZE=4][FONT=Times New Roman][COLOR=rgb(255, 0, 0)]2.07.[/COLOR] Запрещено нахождение в AFK без включенного ESC, создавая помеху другим игрокам | [COLOR=rgb(255, 0, 0)]Kick.[/COLOR][/SIZE][/QUOTE][/CENTER]" +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/rmf4CLVn/1.png[/img][/url]<br>"+
        "[CENTER][SIZE=4][COLOR=#70fc05][ICODE]Одобрено[/ICODE][/COLOR][/CENTER]<br>"+
    "[CENTER][SIZE=4][FONT=Times New Roman]Приятной игры на сервере [COLOR=#ff7b00] Bratsk (74).[/COLOR][/FONT][/SIZE][/CENTER]",
	  prefix: OKAY_PREFIX,
	  status: false,
	},
 {
	  title: 'Аморальные действия',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(0, 255, 0, 0.5); font-family: UtromPressKachat',
	  content:
		"[CENTER][SIZE=4][FONT=Book Antiqua][COLOR=rgb(111, 0, 255)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/FONT][/CENTER]<br>" +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/rmf4CLVn/1.png[/img][/url]"+
             "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Внимательно изучив и рассмотрев вашу жалобу.[/COLOR][/FONT][/CENTER]<br>" +
             "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Мною было принято следующее решение.[/COLOR][/FONT][/CENTER]<br>" +
        "[CENTER][SIZE=4][COLOR=#9d52ff][ICODE]Утвержденный вердикт[/ICODE][/COLOR][/CENTER]<br>" +
	     "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Нарушитель будет наказан по пункту правил:[/COLOR][/FONT][QUOTE][SIZE=4][FONT=Times New Roman][COLOR=rgb(255, 0, 0)]2.08.[/COLOR] Запрещена любая форма аморальных действий сексуального характера в сторону игроков | [COLOR=rgb(255, 0, 0)]Jail 30 минут / Warn.[/COLOR][/SIZE][/QUOTE][/CENTER]" +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/rmf4CLVn/1.png[/img][/url]<br>"+
        "[CENTER][SIZE=4][COLOR=#70fc05][ICODE]Одобрено[/ICODE][/COLOR][/CENTER]<br>"+
    "[CENTER][SIZE=4][FONT=Times New Roman]Приятной игры на сервере [COLOR=#ff7b00] Bratsk (74).[/COLOR][/FONT][/SIZE][/CENTER]",
	  prefix: OKAY_PREFIX,
	  status: false,
	},
 {
	  title: 'Обман в /do ',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(0, 255, 0, 0.5); font-family: UtromPressKachat',
	  content:
		"[CENTER][SIZE=4][FONT=Book Antiqua][COLOR=rgb(111, 0, 255)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/FONT][/CENTER]<br>" +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/rmf4CLVn/1.png[/img][/url]"+
             "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Внимательно изучив и рассмотрев вашу жалобу.[/COLOR][/FONT][/CENTER]<br>" +
             "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Мною было принято следующее решение.[/COLOR][/FONT][/CENTER]<br>" +
        "[CENTER][SIZE=4][COLOR=#9d52ff][ICODE]Утвержденный вердикт[/ICODE][/COLOR][/CENTER]<br>" +
	     "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Нарушитель будет наказан по пункту правил:[/COLOR][/FONT][QUOTE][SIZE=4][FONT=Times New Roman][COLOR=rgb(255, 0, 0)]2.10.[/COLOR] Запрещено в любой форме обманывать в /do, даже если это в дальнейшем негативно скажется на Вашем игровом персонаже | [COLOR=rgb(255, 0, 0)]Jail 30 минут / Warn[/COLOR][/SIZE][/QUOTE][/CENTER]<br>" +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/rmf4CLVn/1.png[/img][/url]<br>"+
        "[CENTER][SIZE=4][COLOR=#70fc05][ICODE]Одобрено[/ICODE][/COLOR][/CENTER]<br>"+
    "[CENTER][SIZE=4][FONT=Times New Roman]Приятной игры на сервере [COLOR=#ff7b00] Bratsk (74).[/COLOR][/FONT][/SIZE][/CENTER]",
	  prefix: OKAY_PREFIX,
	  status: false,
	},
{
	  title: 'Фракционный тс в личных целях ',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(0, 255, 0, 0.5); font-family: UtromPressKachat',
	  content:
		"[CENTER][SIZE=4][FONT=Book Antiqua][COLOR=rgb(111, 0, 255)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/FONT][/CENTER]<br>" +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/rmf4CLVn/1.png[/img][/url]"+
             "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Внимательно изучив и рассмотрев вашу жалобу.[/COLOR][/FONT][/CENTER]<br>" +
             "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Мною было принято следующее решение.[/COLOR][/FONT][/CENTER]<br>" +
        "[CENTER][SIZE=4][COLOR=#9d52ff][ICODE]Утвержденный вердикт[/ICODE][/COLOR][/CENTER]<br>" +
	     "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Нарушитель будет наказан по пункту правил:[/COLOR][/FONT][QUOTE][SIZE=4][FONT=Times New Roman][COLOR=rgb(255, 0, 0)]2.11.[/COLOR] Запрещено использование рабочего или фракционного транспорта в личных целях | [COLOR=rgb(255, 0, 0)]Jail 30 минут.[/COLOR][/SIZE][/QUOTE][/CENTER]" +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/rmf4CLVn/1.png[/img][/url]<br>"+
        "[CENTER][SIZE=4][COLOR=#70fc05][ICODE]Одобрено[/ICODE][/COLOR][/CENTER]<br>"+
    "[CENTER][SIZE=4][FONT=Times New Roman]Приятной игры на сервере [COLOR=#ff7b00] Bratsk (74).[/COLOR][/FONT][/SIZE][/CENTER]",
	  prefix: OKAY_PREFIX,
	  status: false,
	},
{
	  title: 'Затягивание RP',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(0, 255, 0, 0.5); font-family: UtromPressKachat',
	  content:
		"[CENTER][SIZE=4][FONT=Book Antiqua][COLOR=rgb(111, 0, 255)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/FONT][/CENTER]<br>" +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/rmf4CLVn/1.png[/img][/url]"+
             "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Внимательно изучив и рассмотрев вашу жалобу.[/COLOR][/FONT][/CENTER]<br>" +
             "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Мною было принято следующее решение.[/COLOR][/FONT][/CENTER]<br>" +
        "[CENTER][SIZE=4][COLOR=#9d52ff][ICODE]Утвержденный вердикт[/ICODE][/COLOR][/CENTER]<br>" +
	     "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Нарушитель будет наказан по пункту правил:[/COLOR][/FONT][QUOTE][SIZE=4][FONT=Times New Roman][COLOR=rgb(255, 0, 0)]2.12.[/COLOR] Запрещено целенаправленное затягивание Role Play процесса | [COLOR=rgb(255, 0, 0)]Jail 30 минут.[/COLOR][/SIZE][/QUOTE][/CENTER]" +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/rmf4CLVn/1.png[/img][/url]<br>"+
        "[CENTER][SIZE=4][COLOR=#70fc05][ICODE]Одобрено[/ICODE][/COLOR][/CENTER]<br>"+
    "[CENTER][SIZE=4][FONT=Times New Roman]Приятной игры на сервере [COLOR=#ff7b00] Bratsk (74).[/COLOR][/FONT][/SIZE][/CENTER]",
	  prefix: OKAY_PREFIX,
	  status: false,
	},
{
	  title: 'DB ',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(0, 255, 0, 0.5); font-family: UtromPressKachat',
	  content:
		"[CENTER][SIZE=4][FONT=Book Antiqua][COLOR=rgb(111, 0, 255)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/FONT][/CENTER]<br>" +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/rmf4CLVn/1.png[/img][/url]"+
             "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Внимательно изучив и рассмотрев вашу жалобу.[/COLOR][/FONT][/CENTER]<br>" +
             "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Мною было принято следующее решение.[/COLOR][/FONT][/CENTER]<br>" +
        "[CENTER][SIZE=4][COLOR=#9d52ff][ICODE]Утвержденный вердикт[/ICODE][/COLOR][/CENTER]<br>" +
	     "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Нарушитель будет наказан по пункту правил:[/COLOR][/FONT][QUOTE][SIZE=4][FONT=Times New Roman][COLOR=rgb(255, 0, 0)]2.13.[/COLOR] Запрещен DB (DriveBy) — намеренное убийство / нанесение урона без веской IC причины на любом виде транспорта | [COLOR=rgb(255, 0, 0)]Jail 60 минут.[/COLOR][/SIZE][/QUOTE][/CENTER]<br>" +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/rmf4CLVn/1.png[/img][/url]<br>"+
        "[CENTER][SIZE=4][COLOR=#70fc05][ICODE]Одобрено[/ICODE][/COLOR][/CENTER]<br>"+
    "[CENTER][SIZE=4][FONT=Times New Roman]Приятной игры на сервере [COLOR=#ff7b00] Bratsk (74).[/COLOR][/FONT][/SIZE][/CENTER]",
	  prefix: OKAY_PREFIX,
	  status: false,
	},
{
	  title: 'TK ',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(0, 255, 0, 0.5); font-family: UtromPressKachat',
	  content:
		"[CENTER][SIZE=4][FONT=Book Antiqua][COLOR=rgb(111, 0, 255)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/FONT][/CENTER]<br>" +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/rmf4CLVn/1.png[/img][/url]"+
             "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Внимательно изучив и рассмотрев вашу жалобу.[/COLOR][/FONT][/CENTER]<br>" +
             "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Мною было принято следующее решение.[/COLOR][/FONT][/CENTER]<br>" +
        "[CENTER][SIZE=4][COLOR=#9d52ff][ICODE]Утвержденный вердикт[/ICODE][/COLOR][/CENTER]<br>" +
	     "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Нарушитель будет наказан по пункту правил:[/COLOR][/FONT][QUOTE][SIZE=4][FONT=Times New Roman][COLOR=rgb(255, 0, 0)]2.15.[/COLOR] Запрещен TK (Team Kill) — убийство члена своей или союзной фракции, организации без наличия какой-либо IC причины | [COLOR=rgb(255, 0, 0)]Jail 60 минут / Warn (за два и более убийства).[/COLOR][/SIZE][/QUOTE][/CENTER]" +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/rmf4CLVn/1.png[/img][/url]<br>"+
        "[CENTER][SIZE=4][COLOR=#70fc05][ICODE]Одобрено[/ICODE][/COLOR][/CENTER]<br>"+
    "[CENTER][SIZE=4][FONT=Times New Roman]Приятной игры на сервере [COLOR=#ff7b00] Bratsk (74).[/COLOR][/FONT][/SIZE][/CENTER]",
	  prefix: OKAY_PREFIX,
	  status: false,
	},
{
	  title: 'SK ',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(0, 255, 0, 0.5); font-family: UtromPressKachat',
	  content:
		"[CENTER][SIZE=4][FONT=Book Antiqua][COLOR=rgb(111, 0, 255)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/FONT][/CENTER]<br>" +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/rmf4CLVn/1.png[/img][/url]"+
             "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Внимательно изучив и рассмотрев вашу жалобу.[/COLOR][/FONT][/CENTER]<br>" +
             "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Мною было принято следующее решение.[/COLOR][/FONT][/CENTER]<br>" +
        "[CENTER][SIZE=4][COLOR=#9d52ff][ICODE]Утвержденный вердикт[/ICODE][/COLOR][/CENTER]<br>" +
	     "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Нарушитель будет наказан по пункту правил:[/COLOR][/FONT][QUOTE][SIZE=4][FONT=Times New Roman][COLOR=rgb(255, 0, 0)]2.16.[/COLOR] Запрещен SK (Spawn Kill) — убийство или нанесение урона на титульной территории любой фракции / организации, на месте появления игрока, а также на выходе из закрытых интерьеров и около них | [COLOR=rgb(255, 0, 0)]Jail 60 минут / Warn (за два и более убийства).[/COLOR][/SIZE][/QUOTE][/CENTER]" +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/rmf4CLVn/1.png[/img][/url]<br>"+
        "[CENTER][SIZE=4][COLOR=#70fc05][ICODE]Одобрено[/ICODE][/COLOR][/CENTER]<br>"+
    "[CENTER][SIZE=4][FONT=Times New Roman]Приятной игры на сервере [COLOR=#ff7b00] Bratsk (74).[/COLOR][/FONT][/SIZE][/CENTER]",
	  prefix: OKAY_PREFIX,
	  status: false,
	},
{
	  title: 'MG',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(0, 255, 0, 0.5); font-family: UtromPressKachat',
	  content:
		"[CENTER][SIZE=4][FONT=Book Antiqua][COLOR=rgb(111, 0, 255)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/FONT][/CENTER]<br>" +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/rmf4CLVn/1.png[/img][/url]"+
             "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Внимательно изучив и рассмотрев вашу жалобу.[/COLOR][/FONT][/CENTER]<br>" +
             "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Мною было принято следующее решение.[/COLOR][/FONT][/CENTER]<br>" +
        "[CENTER][SIZE=4][COLOR=#9d52ff][ICODE]Утвержденный вердикт[/ICODE][/COLOR][/CENTER]<br>" +
	     "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Нарушитель будет наказан по пункту правил:[/COLOR][/FONT][QUOTE][SIZE=4][FONT=Times New Roman][COLOR=rgb(255, 0, 0)]2.18.[/COLOR] Запрещен MG (MetaGaming) — использование ООС информации, которую Ваш персонаж никак не мог получить в IC процессе | [COLOR=rgb(255, 0, 0)]Mute 30 минут.[/COLOR][/SIZE][/QUOTE][/CENTER]" +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/rmf4CLVn/1.png[/img][/url]<br>"+
        "[CENTER][SIZE=4][COLOR=#70fc05][ICODE]Одобрено[/ICODE][/COLOR][/CENTER]<br>"+
    "[CENTER][SIZE=4][FONT=Times New Roman]Приятной игры на сервере [COLOR=#ff7b00] Bratsk (74).[/COLOR][/FONT][/SIZE][/CENTER]",
	  prefix: OKAY_PREFIX,
	  status: false,
	},
{
	  title: 'DM',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(0, 255, 0, 0.5); font-family: UtromPressKachat',
	  content:
		"[CENTER][SIZE=4][FONT=Book Antiqua][COLOR=rgb(111, 0, 255)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/FONT][/CENTER]<br>" +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/rmf4CLVn/1.png[/img][/url]"+
             "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Внимательно изучив и рассмотрев вашу жалобу.[/COLOR][/FONT][/CENTER]<br>" +
             "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Мною было принято следующее решение.[/COLOR][/FONT][/CENTER]<br>" +
        "[CENTER][SIZE=4][COLOR=#9d52ff][ICODE]Утвержденный вердикт[/ICODE][/COLOR][/CENTER]<br>" +
	     "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Нарушитель будет наказан по пункту правил:[/COLOR][/FONT][QUOTE][SIZE=4][FONT=Times New Roman][COLOR=rgb(255, 0, 0)]2.19.[/COLOR] Запрещен DM (DeathMatch) — убийство или нанесение урона без веской IC причины | [COLOR=rgb(255, 0, 0)]Jail 60 минут.[/COLOR][/SIZE][/QUOTE][/CENTER]" +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/rmf4CLVn/1.png[/img][/url]<br>"+
        "[CENTER][SIZE=4][COLOR=#70fc05][ICODE]Одобрено[/ICODE][/COLOR][/CENTER]<br>"+
    "[CENTER][SIZE=4][FONT=Times New Roman]Приятной игры на сервере [COLOR=#ff7b00] Bratsk (74).[/COLOR][/FONT][/SIZE][/CENTER]",
	  prefix: OKAY_PREFIX,
	  status: false,
	},
{
	  title: 'Mass DM',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(0, 255, 0, 0.5); font-family: UtromPressKachat',
	  content:
		"[CENTER][SIZE=4][FONT=Book Antiqua][COLOR=rgb(111, 0, 255)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/FONT][/CENTER]<br>" +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/rmf4CLVn/1.png[/img][/url]"+
             "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Внимательно изучив и рассмотрев вашу жалобу.[/COLOR][/FONT][/CENTER]<br>" +
             "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Мною было принято следующее решение.[/COLOR][/FONT][/CENTER]<br>" +
        "[CENTER][SIZE=4][COLOR=#9d52ff][ICODE]Утвержденный вердикт[/ICODE][/COLOR][/CENTER]<br>" +
	     "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Нарушитель будет наказан по пункту правил:[/COLOR][/FONT][QUOTE][SIZE=4][FONT=Times New Roman][COLOR=rgb(255, 0, 0)]2.20.[/COLOR] Запрещен Mass DM (Mass DeathMatch) — убийство или нанесение урона без веской IC причины трем игрокам и более | [COLOR=rgb(255, 0, 0)]Warn / Ban 3 - 7 дней.[/COLOR][/SIZE][/QUOTE][/CENTER]" +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/rmf4CLVn/1.png[/img][/url]<br>"+
        "[CENTER][SIZE=4][COLOR=#70fc05][ICODE]Одобрено[/ICODE][/COLOR][/CENTER]<br>"+
    "[CENTER][SIZE=4][FONT=Times New Roman]Приятной игры на сервере [COLOR=#ff7b00] Bratsk (74).[/COLOR][/FONT][/SIZE][/CENTER]",
	  prefix: OKAY_PREFIX,
	  status: false,
	},
{
	  title: 'Постороннее ПО',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(0, 255, 0, 0.5); font-family: UtromPressKachat',
	  content:
		"[CENTER][SIZE=4][FONT=Book Antiqua][COLOR=rgb(111, 0, 255)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/FONT][/CENTER]<br>" +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/rmf4CLVn/1.png[/img][/url]"+
             "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Внимательно изучив и рассмотрев вашу жалобу.[/COLOR][/FONT][/CENTER]<br>" +
             "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Мною было принято следующее решение.[/COLOR][/FONT][/CENTER]<br>" +
        "[CENTER][SIZE=4][COLOR=#9d52ff][ICODE]Утвержденный вердикт[/ICODE][/COLOR][/CENTER]<br>" +
	     "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Нарушитель будет наказан по пункту правил:[/COLOR][/FONT][QUOTE][SIZE=4][FONT=Times New Roman][COLOR=rgb(255, 0, 0)]2.22.[/COLOR] Запрещено хранить / использовать / распространять стороннее программное обеспечение или любые другие средства, позволяющие получить преимущество над другими игроками | [COLOR=rgb(255, 0, 0)]Ban 15 - 30 дней / PermBan.[/COLOR][/SIZE][/QUOTE][/CENTER]" +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/rmf4CLVn/1.png[/img][/url]<br>"+
        "[CENTER][SIZE=4][COLOR=#70fc05][ICODE]Одобрено[/ICODE][/COLOR][/CENTER]<br>"+
    "[CENTER][SIZE=4][FONT=Times New Roman]Приятной игры на сервере [COLOR=#ff7b00] Bratsk (74).[/COLOR][/FONT][/SIZE][/CENTER]",
	  prefix: OKAY_PREFIX,
	  status: false,
	},
{
	  title: 'Скрытие багов',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(0, 255, 0, 0.5); font-family: UtromPressKachat',
	  content:
		"[CENTER][SIZE=4][FONT=Book Antiqua][COLOR=rgb(111, 0, 255)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/FONT][/CENTER]<br>" +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/rmf4CLVn/1.png[/img][/url]"+
             "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Внимательно изучив и рассмотрев вашу жалобу.[/COLOR][/FONT][/CENTER]<br>" +
             "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Мною было принято следующее решение.[/COLOR][/FONT][/CENTER]<br>" +
        "[CENTER][SIZE=4][COLOR=#9d52ff][ICODE]Утвержденный вердикт[/ICODE][/COLOR][/CENTER]<br>" +
	     "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Нарушитель будет наказан по пункту правил:[/COLOR][/FONT][QUOTE][SIZE=4][FONT=Times New Roman][COLOR=rgb(255, 0, 0)]2.23.[/COLOR] Запрещено скрывать от администрации баги системы, а также распространять их игрокам | [COLOR=rgb(255, 0, 0)]Ban 15 - 30 дней / PermBan.[/COLOR][/SIZE][/QUOTE][/CENTER]" +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/rmf4CLVn/1.png[/img][/url]<br>"+
        "[CENTER][SIZE=4][COLOR=#70fc05][ICODE]Одобрено[/ICODE][/COLOR][/CENTER]<br>"+
    "[CENTER][SIZE=4][FONT=Times New Roman]Приятной игры на сервере [COLOR=#ff7b00] Bratsk (74).[/COLOR][/FONT][/SIZE][/CENTER]",
	  prefix: OKAY_PREFIX,
	  status: false,
	},
{
	  title: 'Скрытие от администрации нарушителей',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(0, 255, 0, 0.5); font-family: UtromPressKachat',
	  content:
		"[CENTER][SIZE=4][FONT=Book Antiqua][COLOR=rgb(111, 0, 255)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/FONT][/CENTER]<br>" +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/rmf4CLVn/1.png[/img][/url]"+
             "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Внимательно изучив и рассмотрев вашу жалобу.[/COLOR][/FONT][/CENTER]<br>" +
             "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Мною было принято следующее решение.[/COLOR][/FONT][/CENTER]<br>" +
        "[CENTER][SIZE=4][COLOR=#9d52ff][ICODE]Утвержденный вердикт[/ICODE][/COLOR][/CENTER]<br>" +
	     "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Нарушитель будет наказан по пункту правил:[/COLOR][/FONT][QUOTE][SIZE=4][FONT=Times New Roman][COLOR=rgb(255, 0, 0)]2.24.[/COLOR] Запрещено скрывать от администрации нарушителей или злоумышленников | [COLOR=rgb(255, 0, 0)]Ban 15 - 30 дней / PermBan + ЧС проекта.[/COLOR][/SIZE][/QUOTE][/CENTER]" +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/rmf4CLVn/1.png[/img][/url]<br>"+
        "[CENTER][SIZE=4][COLOR=#70fc05][ICODE]Одобрено[/ICODE][/COLOR][/CENTER]<br>"+
    "[CENTER][SIZE=4][FONT=Times New Roman]Приятной игры на сервере [COLOR=#ff7b00] Bratsk (74).[/COLOR][/FONT][/SIZE][/CENTER]",
	  prefix: OKAY_PREFIX,
	  status: false,
	},
{
	  title: 'Вред репутиции проекта',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(0, 255, 0, 0.5); font-family: UtromPressKachat',
	  content:
		"[CENTER][SIZE=4][FONT=Book Antiqua][COLOR=rgb(111, 0, 255)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/FONT][/CENTER]<br>" +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/rmf4CLVn/1.png[/img][/url]"+
             "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Внимательно изучив и рассмотрев вашу жалобу.[/COLOR][/FONT][/CENTER]<br>" +
             "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Мною было принято следующее решение.[/COLOR][/FONT][/CENTER]<br>" +
        "[CENTER][SIZE=4][COLOR=#9d52ff][ICODE]Утвержденный вердикт[/ICODE][/COLOR][/CENTER]<br>" +
	     "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Нарушитель будет наказан по пункту правил:[/COLOR][/FONT][QUOTE][SIZE=4][FONT=Times New Roman][COLOR=rgb(255, 0, 0)]2.25.[/COLOR] Запрещены попытки или действия, которые могут навредить репутации проекта | [COLOR=rgb(255, 0, 0)]PermBan + ЧС проекта.[/COLOR][/SIZE][/QUOTE][/CENTER]" +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/rmf4CLVn/1.png[/img][/url]<br>"+
        "[CENTER][SIZE=4][COLOR=#70fc05][ICODE]Одобрено[/ICODE][/COLOR][/CENTER]<br>"+
    "[CENTER][SIZE=4][FONT=Times New Roman]Приятной игры на сервере [COLOR=#ff7b00] Bratsk (74).[/COLOR][/FONT][/SIZE][/CENTER]",
	  prefix: OKAY_PREFIX,
	  status: false,
	},
{
	  title: 'Вред ресурсам проекта',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(0, 255, 0, 0.5); font-family: UtromPressKachat',
	  content:
		"[CENTER][SIZE=4][FONT=Book Antiqua][COLOR=rgb(111, 0, 255)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/FONT][/CENTER]<br>" +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/rmf4CLVn/1.png[/img][/url]"+
             "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Внимательно изучив и рассмотрев вашу жалобу.[/COLOR][/FONT][/CENTER]<br>" +
             "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Мною было принято следующее решение.[/COLOR][/FONT][/CENTER]<br>" +
        "[CENTER][SIZE=4][COLOR=#9d52ff][ICODE]Утвержденный вердикт[/ICODE][/COLOR][/CENTER]<br>" +
	     "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Нарушитель будет наказан по пункту правил:[/COLOR][/FONT][QUOTE][SIZE=4][FONT=Times New Roman][COLOR=rgb(255, 0, 0)]2.26.[/COLOR] Запрещено намеренно наносить вред ресурсам проекта (игровые серверы, форум, официальные Discord-серверы и так далее) | [COLOR=rgb(255, 0, 0)]PermBan + ЧС проекта.[/COLOR][/SIZE][/QUOTE][/CENTER]" +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/rmf4CLVn/1.png[/img][/url]<br>"+
        "[CENTER][SIZE=4][COLOR=#70fc05][ICODE]Одобрено[/ICODE][/COLOR][/CENTER]<br>"+
    "[CENTER][SIZE=4][FONT=Times New Roman]Приятной игры на сервере [COLOR=#ff7b00] Bratsk (74).[/COLOR][/FONT][/SIZE][/CENTER]",
	  prefix: OKAY_PREFIX,
	  status: false,
	},
{
	  title: 'Cлив админ инфы',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(0, 255, 0, 0.5); font-family: UtromPressKachat',
	  content:
		"[CENTER][SIZE=4][FONT=Book Antiqua][COLOR=rgb(111, 0, 255)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/FONT][/CENTER]<br>" +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/rmf4CLVn/1.png[/img][/url]"+
             "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Внимательно изучив и рассмотрев вашу жалобу.[/COLOR][/FONT][/CENTER]<br>" +
             "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Мною было принято следующее решение.[/COLOR][/FONT][/CENTER]<br>" +
        "[CENTER][SIZE=4][COLOR=#9d52ff][ICODE]Утвержденный вердикт[/ICODE][/COLOR][/CENTER]<br>" +
	     "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Нарушитель будет наказан по пункту правил:[/COLOR][/FONT][QUOTE][SIZE=4][FONT=Times New Roman][COLOR=rgb(255, 0, 0)]2.27.[/COLOR] Запрещено распространение информации и материалов, непосредственно связанных с деятельностью администрации проекта, которые могут повлиять на работу и систему администрации |  [COLOR=rgb(255, 0, 0)]PermBan + ЧС проекта[/COLOR][/SIZE][/QUOTE][/FONT][/CENTER]" +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/rmf4CLVn/1.png[/img][/url]<br>"+
        "[CENTER][SIZE=4][COLOR=#70fc05][ICODE]Одобрено[/ICODE][/COLOR][/CENTER]<br>"+
    "[CENTER][SIZE=4][FONT=Times New Roman]Приятной игры на сервере [COLOR=#ff7b00] Bratsk (74).[/COLOR][/FONT][/SIZE][/CENTER]",
	  prefix: OKAY_PREFIX,
	  status: false,
	},
{
          title: 'ППИВ',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(0, 255, 0, 0.5); font-family: UtromPressKachat',
	  content:
		"[CENTER][SIZE=4][FONT=Book Antiqua][COLOR=rgb(111, 0, 255)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/FONT][/CENTER]<br>" +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/rmf4CLVn/1.png[/img][/url]"+
             "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Внимательно изучив и рассмотрев вашу жалобу.[/COLOR][/FONT][/CENTER]<br>" +
             "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Мною было принято следующее решение.[/COLOR][/FONT][/CENTER]<br>" +
        "[CENTER][SIZE=4][COLOR=#9d52ff][ICODE]Утвержденный вердикт[/ICODE][/COLOR][/CENTER]<br>" +
	     "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Нарушитель будет наказан по пункту правил:[/COLOR][/FONT][QUOTE][SIZE=4][FONT=Times New Roman][COLOR=rgb(255, 0, 0)]2.28.[/COLOR] Запрещена покупка/продажа внутриигровой валюты за реальные деньги в любом виде |[COLOR=rgb(255, 0, 0)]PermBan с обнулением аккаунта + ЧС проекта.[/COLOR][/SIZE][/QUOTE][/FONT][/CENTER]" +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/rmf4CLVn/1.png[/img][/url]<br>"+
        "[CENTER][SIZE=4][COLOR=#70fc05][ICODE]Одобрено[/ICODE][/COLOR][/CENTER]<br>"+
    "[CENTER][SIZE=4][FONT=Times New Roman]Приятной игры на сервере [COLOR=#ff7b00] Bratsk (74).[/COLOR][/FONT][/SIZE][/CENTER]",
	  prefix: OKAY_PREFIX,
	  status: false,
	},
{
          title: 'Порча ЭКО',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(0, 255, 0, 0.5); font-family: UtromPressKachat',
	  content:
		"[CENTER][SIZE=4][FONT=Book Antiqua][COLOR=rgb(111, 0, 255)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/FONT][/CENTER]<br>" +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/rmf4CLVn/1.png[/img][/url]"+
             "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Внимательно изучив и рассмотрев вашу жалобу.[/COLOR][/FONT][/CENTER]<br>" +
             "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Мною было принято следующее решение.[/COLOR][/FONT][/CENTER]<br>" +
        "[CENTER][SIZE=4][COLOR=#9d52ff][ICODE]Утвержденный вердикт[/ICODE][/COLOR][/CENTER]<br>" +
	     "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Нарушитель будет наказан по пункту правил:[/COLOR][/FONT][QUOTE][SIZE=4][FONT=Times New Roman][COLOR=rgb(255, 0, 0)]2.30.[/COLOR] Запрещено пытаться нанести ущерб экономике сервера | [COLOR=rgb(255, 0, 0)]Ban 15 - 30 дней / PermBan[/COLOR][/SIZE][/QUOTE][/FONT][/CENTER]" +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/rmf4CLVn/1.png[/img][/url]<br>"+
        "[CENTER][SIZE=4][COLOR=#70fc05][ICODE]Одобрено[/ICODE][/COLOR][/CENTER]<br>"+
    "[CENTER][SIZE=4][FONT=Times New Roman]Приятной игры на сервере [COLOR=#ff7b00] Bratsk (74).[/COLOR][/FONT][/SIZE][/CENTER]",
	  prefix: OKAY_PREFIX,
	  status: false,
	},
{
	  title: 'Реклама соц сетей',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(0, 255, 0, 0.5); font-family: UtromPressKachat',
	  content:
		"[CENTER][SIZE=4][FONT=Book Antiqua][COLOR=rgb(111, 0, 255)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/FONT][/CENTER]<br>" +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/rmf4CLVn/1.png[/img][/url]"+
             "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Внимательно изучив и рассмотрев вашу жалобу.[/COLOR][/FONT][/CENTER]<br>" +
             "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Мною было принято следующее решение.[/COLOR][/FONT][/CENTER]<br>" +
        "[CENTER][SIZE=4][COLOR=#9d52ff][ICODE]Утвержденный вердикт[/ICODE][/COLOR][/CENTER]<br>" +
	     "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Нарушитель будет наказан по пункту правил:[/COLOR][/FONT][QUOTE][SIZE=4][FONT=Times New Roman][COLOR=rgb(255, 0, 0)]2.31.[/COLOR] Запрещено рекламировать на серверах любые проекты, серверы, сайты, сторонние Discord-серверы, YouTube каналы и тому подобное | [COLOR=rgb(255, 0, 0)]Ban 7 дней / PermBan.[/COLOR][/SIZE][/QUOTE][/CENTER]" +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/rmf4CLVn/1.png[/img][/url]<br>"+
        "[CENTER][SIZE=4][COLOR=#70fc05][ICODE]Одобрено[/ICODE][/COLOR][/CENTER]<br>"+
    "[CENTER][SIZE=4][FONT=Times New Roman]Приятной игры на сервере [COLOR=#ff7b00] Bratsk (74).[/COLOR][/FONT][/SIZE][/CENTER]",
	  prefix: OKAY_PREFIX,
	  status: false,
	},
{
	  title: 'Обман администрации',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(0, 255, 0, 0.5); font-family: UtromPressKachat',
	  content:
		"[CENTER][SIZE=4][FONT=Book Antiqua][COLOR=rgb(111, 0, 255)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/FONT][/CENTER]<p>"+
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/rmf4CLVn/1.png[/img][/url]"+
             "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Внимательно изучив и рассмотрев вашу жалобу.[/COLOR][/FONT][/CENTER]<p>"+
             "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Мною было принято следующее решение.[/COLOR][/FONT][/CENTER]<p>"+
        "[CENTER][SIZE=4][COLOR=#6f00ff][ICODE]Утвержденный вердикт[/ICODE][/COLOR][/CENTER]<p>"+
	     "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Нарушитель будет наказан по пункту правил:[/COLOR][/FONT][QUOTE][SIZE=4][FONT=Times New Roman][COLOR=rgb(255, 0, 0)]2.32.[/COLOR] Запрещено введение в заблуждение, обман администрации на всех ресурсах проекта | [COLOR=rgb(255, 0, 0)]Ban 7 - 15 дней.[/COLOR][/SIZE][/QUOTE][/CENTER]"+
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/rmf4CLVn/1.png[/img][/url]<p>"+
        "[CENTER][SIZE=4][COLOR=#70fc05][ICODE]Одобрено[/ICODE][/COLOR][/CENTER]<p>"+
        "[CENTER][SIZE=4][FONT=Times New Roman]Приятной игры на сервере [COLOR=#ff7b00] Bratsk (74).[/COLOR][/FONT][/SIZE][/CENTER]",
	  prefix: OKAY_PREFIX,
	  status: false,
	},
{
	  title: 'Уязвимость правил',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(0, 255, 0, 0.5); font-family: UtromPressKachat',
	  content:
		"[CENTER][SIZE=4][FONT=Book Antiqua][COLOR=rgb(111, 0, 255)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/FONT][/CENTER]<br>" +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/rmf4CLVn/1.png[/img][/url]"+
             "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Внимательно изучив и рассмотрев вашу жалобу.[/COLOR][/FONT][/CENTER]<br>" +
             "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Мною было принято следующее решение.[/COLOR][/FONT][/CENTER]<br>" +
        "[CENTER][SIZE=4][COLOR=#9d52ff][ICODE]Утвержденный вердикт[/ICODE][/COLOR][/CENTER]<br>" +
	     "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Нарушитель будет наказан по пункту правил:[/COLOR][/FONT][QUOTE][SIZE=4][FONT=Times New Roman][COLOR=rgb(255, 0, 0)]2.33.[/COLOR] Запрещено пользоваться уязвимостью правил | [COLOR=rgb(255, 0, 0)]Ban 15-30 дней / PermBan.[/COLOR][/SIZE][/QUOTE][/CENTER]<br>" +
            "[CENTER][SIZE=4][FONT=Times New Roman][COLOR=rgb(255, 0, 0)]Пример: [/COLOR]подделка доказательств, искажение информации в свою пользу, предоставление неполной информации о ситуации.[/FONT][/CENTER]<br>" +
             "[CENTER][SIZE=4][FONT=Times New Roman][COLOR=rgb(255, 0, 0)]Примечание: [/COLOR]по решению руководства сервера может быть выдана перманентная блокировка как на аккаунт, с которого совершен обман, так и на все аккаунты нарушителя. | [COLOR=rgb(255, 0, 0)]PermBan[/COLOR][/FONT][/CENTER]<br>" +
             "[CENTER][SIZE=4][FONT=Times New Roman][COLOR=rgb(255, 0, 0)]Примечание:[/COLOR] за предоставление услуг по прохождению обзвонов на различные должности, а также за услуги, облегчающие процесс обзвона, может быть выдан чёрный список проекта | [COLOR=rgb(255, 0, 0)]PermBan + ЧС проекта[/COLOR][/SIZE][/QUOTE][/FONT][/CENTER]" +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/rmf4CLVn/1.png[/img][/url]<br>"+
        "[CENTER][SIZE=4][COLOR=#70fc05][ICODE]Одобрено[/ICODE][/COLOR][/CENTER]<br>"+
    "[CENTER][SIZE=4][FONT=Times New Roman]Приятной игры на сервере [COLOR=#ff7b00] Bratsk (74).[/COLOR][/FONT][/SIZE][/CENTER]",
	  prefix: OKAY_PREFIX,
	  status: false,
	},
{
	  title: 'Конфликты о национальности',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(0, 255, 0, 0.5); font-family: UtromPressKachat',
	  content:
		"[CENTER][SIZE=4][FONT=Book Antiqua][COLOR=rgb(111, 0, 255)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/FONT][/CENTER]<br>" +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/rmf4CLVn/1.png[/img][/url]"+
             "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Внимательно изучив и рассмотрев вашу жалобу.[/COLOR][/FONT][/CENTER]<br>" +
             "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Мною было принято следующее решение.[/COLOR][/FONT][/CENTER]<br>" +
        "[CENTER][SIZE=4][COLOR=#9d52ff][ICODE]Утвержденный вердикт[/ICODE][/COLOR][/CENTER]<br>" +
	     "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Нарушитель будет наказан по пункту правил:[/COLOR][/FONT][QUOTE][SIZE=4][FONT=Times New Roman][COLOR=rgb(255, 0, 0)]2.35.[/COLOR]. На игровых серверах запрещено устраивать IC и OOC конфликты на почве разногласия о национальности и / или религии совершенно в любом формате | [COLOR=rgb(255, 0, 0)]Mute 120 минут / Ban 7 дней.[/COLOR][/SIZE][/QUOTE][/CENTER]" +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/rmf4CLVn/1.png[/img][/url]<br>"+
        "[CENTER][SIZE=4][COLOR=#70fc05][ICODE]Одобрено[/ICODE][/COLOR][/CENTER]<br>"+
    "[CENTER][SIZE=4][FONT=Times New Roman]Приятной игры на сервере [COLOR=#ff7b00] Bratsk (74).[/COLOR][/FONT][/SIZE][/CENTER]",
	  prefix: OKAY_PREFIX,
	  status: false,
	},
{
	  title: 'OOC угрозы',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(0, 255, 0, 0.5); font-family: UtromPressKachat',
	  content:
		"[CENTER][SIZE=4][FONT=Book Antiqua][COLOR=rgb(111, 0, 255)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/FONT][/CENTER]<p>"+
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/rmf4CLVn/1.png[/img][/url]"+
             "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Внимательно изучив и рассмотрев вашу жалобу.[/COLOR][/FONT][/CENTER]<p>"+
             "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Мною было принято следующее решение.[/COLOR][/FONT][/CENTER]<p>"+
        "[CENTER][SIZE=4][COLOR=#6f00ff][ICODE]Утвержденный вердикт[/ICODE][/COLOR][/CENTER]<p>"+
	     "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Нарушитель будет наказан по пункту правил:[/COLOR][/FONT][QUOTE][SIZE=4][FONT=Times New Roman][COLOR=rgb(255, 0, 0)]2.37.[/COLOR] Запрещены OOC угрозы, в том числе и завуалированные | [COLOR=rgb(255, 0, 0)]Mute 120 минут / Ban 7 дней.[/COLOR][/SIZE][/QUOTE][/CENTER]"+
             "[CENTER][SIZE=4][FONT=Times New Roman][COLOR=rgb(255, 0, 0)]Примечание:[/COLOR] блокировка аккаунта выдаётся в случае, если есть прямые угрозы жизни, здоровью игрока или его близким. По решению главного администратора может быть выдана перманентная блокировка.[/FONT][/CENTER]<p>"+
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/rmf4CLVn/1.png[/img][/url]<p>"+
        "[CENTER][SIZE=4][COLOR=#70fc05][ICODE]Одобрено[/ICODE][/COLOR][/CENTER]<p>"+
    "[CENTER][SIZE=4][FONT=Times New Roman]Приятной игры на сервере [COLOR=#ff7b00] Bratsk (74).[/COLOR][/FONT][/SIZE][/CENTER]",
	  prefix: OKAY_PREFIX,
	  status: false,
	},
{
	  title: 'Распространение личной информации',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(0, 255, 0, 0.5); font-family: UtromPressKachat',
	  content:
		"[CENTER][SIZE=4][FONT=Book Antiqua][COLOR=rgb(111, 0, 255)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/FONT][/CENTER]<p>"+
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/rmf4CLVn/1.png[/img][/url]"+
             "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Внимательно изучив и рассмотрев вашу жалобу.[/COLOR][/FONT][/CENTER]<p>"+
             "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Мною было принято следующее решение.[/COLOR][/FONT][/CENTER]<p>"+
        "[CENTER][SIZE=4][COLOR=#6f00ff][ICODE]Утвержденный вердикт[/ICODE][/COLOR][/CENTER]<p>"+
	     "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Нарушитель будет наказан по пункту правил:[/COLOR][/FONT][QUOTE][SIZE=4][FONT=Times New Roman][COLOR=rgb(255, 0, 0)]2.38.[/COLOR] Запрещено распространять личную информацию игроков и их родственников | [COLOR=rgb(255, 0, 0)]Ban 15 - 30 дней / PermBan.[/COLOR][/SIZE][/QUOTE][/CENTER]"+
             "[CENTER][SIZE=4][FONT=Times New Roman][COLOR=rgb(255, 0, 0)]Примечание:[/COLOR] распространение личной информации пользователя без его согласия запрещено.[/FONT][/CENTER]<p>"+
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/rmf4CLVn/1.png[/img][/url]<p>"+
        "[CENTER][SIZE=4][COLOR=#70fc05][ICODE]Одобрено[/ICODE][/COLOR][/CENTER]<p>"+
    "[CENTER][SIZE=4][FONT=Times New Roman]Приятной игры на сервере [COLOR=#ff7b00] Bratsk (74).[/COLOR][/FONT][/SIZE][/CENTER]",
	  prefix: OKAY_PREFIX,
	  status: false,
	},
{
	  title: 'Злоупотребление нарушениями',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(0, 255, 0, 0.5); font-family: UtromPressKachat',
	  content:
		"[CENTER][SIZE=4][FONT=Book Antiqua][COLOR=rgb(111, 0, 255)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/FONT][/CENTER]<p>" +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/rmf4CLVn/1.png[/img][/url]"+
             "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Внимательно изучив и рассмотрев вашу жалобу.[/COLOR][/FONT][/CENTER]<p>"+
             "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Мною было принято следующее решение.[/COLOR][/FONT][/CENTER]<p>"+
        "[CENTER][SIZE=4][COLOR=#6f00ff][ICODE]Утвержденный вердикт[/ICODE][/COLOR][/CENTER]<p>"+
	     "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Нарушитель будет наказан по пункту правил:[/COLOR][/FONT][QUOTE][SIZE=4][FONT=Times New Roman][COLOR=rgb(255, 0, 0)]2.39.[/COLOR] Злоупотребление нарушениями правил сервера | [COLOR=rgb(255, 0, 0)]Ban 7 - 30 дней.[/COLOR][/SIZE][/QUOTE][/CENTER]<p>"+
             "[SIZE=4][FONT=Times New Roman][COLOR=rgb(255, 0, 0)]Примечание:[/COLOR]неоднократное (от шести и более) нарушение правил серверов, которые были совершены за прошедшие 7 дней, с момента проверки истории наказаний игрока.[/FONT][/CENTER]"+
             "[CENTER][SIZE=4][FONT=Times New Roman][COLOR=rgb(255, 0, 0)]Примечание:[/COLOR] наказания выданные за нарушения правил текстовых чатов, помеху (kick) не учитываются.[/FONT][/SIZE][/CENTER]<p>"+
             "[CENTER][SIZE=4][FONT=Times New Roman][COLOR=rgb(255, 0, 0)]Исключение:[/COLOR] пункты правил: [COLOR=rgb(255, 0, 0)]2.54[/COLOR], [COLOR=rgb(255, 0, 0)]3.04[/COLOR] учитываются в качестве злоупотребления нарушениями правил серверов.[/FONT][/SIZE][/CENTER]<p>"+
             "[CENTER][SIZE=4][FONT=Times New Roman][COLOR=rgb(255, 0, 0)]Пример:[/COLOR] было получено пять наказаний за DM, шестое будет злоупотреблением. Если было получено одно наказание за упоминание родных, два наказания за DB и два наказания за DM, следующее будет считаться злоупотреблением.[/FONT][/SIZE][/CENTER]<p>"+
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/rmf4CLVn/1.png[/img][/url]<p>"+
        "[CENTER][SIZE=4][COLOR=#70fc05][ICODE]Одобрено[/ICODE][/COLOR][/CENTER]<p>"+
    "[CENTER][SIZE=4][FONT=Times New Roman]Приятной игры на сервере [COLOR=#ff7b00] Bratsk (74).[/COLOR][/FONT][/SIZE][/CENTER]",
	  prefix: OKAY_PREFIX,
	  status: false,
	},
{
	  title: 'Критика проекта',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(0, 255, 0, 0.5); font-family: UtromPressKachat',
	  content:
		"[CENTER][SIZE=4][FONT=Book Antiqua][COLOR=rgb(111, 0, 255)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/FONT][/CENTER]<p>"+
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/rmf4CLVn/1.png[/img][/url]"+
             "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Внимательно изучив и рассмотрев вашу жалобу.[/COLOR][/FONT][/CENTER]<p>"+
             "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Мною было принято следующее решение.[/COLOR][/FONT][/CENTER]<p>"+
        "[CENTER][SIZE=4][COLOR=#6f00ff][ICODE]Утвержденный вердикт[/ICODE][/COLOR][/CENTER]<p>"+
	     "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Нарушитель будет наказан по пункту правил:[/COLOR][/FONT][QUOTE][SIZE=4][FONT=Times New Roman][COLOR=rgb(255, 0, 0)]2.40.[/COLOR] Запрещены совершенно любые деструктивные действия по отношению к проекту: неконструктивная критика, призывы покинуть проект, попытки нарушить развитие проекта или любые другие действия, способные привести к помехам в игровом процессе | [COLOR=rgb(255, 0, 0)]Mute 300 минут / Ban 30 дней (Ban выдается по согласованию с главным администратором).[/COLOR][/SIZE][/QUOTE][/CENTER]"+
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/rmf4CLVn/1.png[/img][/url]<p>"+
        "[CENTER][SIZE=4][COLOR=#70fc05][ICODE]Одобрено[/ICODE][/COLOR][/CENTER]<p>"+
    "[CENTER][SIZE=4][FONT=Times New Roman]Приятной игры на сервере [COLOR=#ff7b00] Bratsk (74).[/COLOR][/FONT][/SIZE][/CENTER]",
	  prefix: OKAY_PREFIX,
	  status: false,
	},
{
          title: 'ПП за реал. валюту',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(0, 255, 0, 0.5); font-family: UtromPressKachat',
	  content:
		"[CENTER][SIZE=4][FONT=Book Antiqua][COLOR=rgb(111, 0, 255)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/FONT][/CENTER]<p>" +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/rmf4CLVn/1.png[/img][/url]"+
             "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Внимательно изучив и рассмотрев вашу жалобу.[/COLOR][/FONT][/CENTER]<p>" +
             "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Мною было принято следующее решение.[/COLOR][/FONT][/CENTER]<p>" +
        "[CENTER][SIZE=4][COLOR=#6f00ff][ICODE]Утвержденный вердикт[/ICODE][/COLOR][/CENTER]<p>" +
	     "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Нарушитель будет наказан по пункту правил:[/COLOR][/FONT][QUOTE][SIZE=4][FONT=Times New Roman][COLOR=rgb(255, 0, 0)]2.42.[/COLOR] Попытка продажи любого игрового имущества или игрового аккаунта за реальные деньги | [COLOR=rgb(255, 0, 0)]PermBan[/COLOR].[/SIZE][/QUOTE][/CENTER]" +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/rmf4CLVn/1.png[/img][/url]<p>"+
        "[CENTER][SIZE=4][COLOR=#70fc05][ICODE]Одобрено[/ICODE][/COLOR][/CENTER]<p>"+
    "[CENTER][SIZE=4][FONT=Times New Roman]Приятной игры на сервере [COLOR=#ff7b00] Bratsk (74).[/COLOR][/FONT][/SIZE][/CENTER]",
	  prefix: OKAY_PREFIX,
	  status: false,
	},
{
          title: 'Реклама промо',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(0, 255, 0, 0.5); font-family: UtromPressKachat',
	  content:
		"[CENTER][SIZE=4][FONT=Book Antiqua][COLOR=rgb(111, 0, 255)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/FONT][/CENTER]<p>" +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/rmf4CLVn/1.png[/img][/url]"+
             "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Внимательно изучив и рассмотрев вашу жалобу.[/COLOR][/FONT][/CENTER]<p>" +
             "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Мною было принято следующее решение.[/COLOR][/FONT][/CENTER]<p>" +
        "[CENTER][SIZE=4][COLOR=#6f00ff][ICODE]Утвержденный вердикт[/ICODE][/COLOR][/CENTER]<p>"+
	     "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Нарушитель будет наказан по пункту правил:[/COLOR][/FONT][QUOTE][SIZE=4][FONT=Times New Roman][COLOR=rgb(255, 0, 0)]2.43.[/COLOR]  Запрещена продажа / обмен / покупка поощрительной составляющей от лица проекта, будь то бонус-код, либо промокод, который выдается безвозмездно игрокам в целях промоакций | [COLOR=rgb(255, 0, 0)]Mute 120 минут[/COLOR].[/SIZE][/QUOTE][/CENTER]"+
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/rmf4CLVn/1.png[/img][/url]<p>"+
        "[CENTER][SIZE=4][COLOR=#70fc05][ICODE]Одобрено[/ICODE][/COLOR][/CENTER]<p>"+
    "[CENTER][SIZE=4][FONT=Times New Roman]Приятной игры на сервере [COLOR=#ff7b00] Bratsk (74).[/COLOR][/FONT][/SIZE][/CENTER]",
	  prefix: OKAY_PREFIX,
	  status: false,
	},
{
	  title: 'nRP сон',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(0, 255, 0, 0.5); font-family: UtromPressKachat',
	  content:
		"[CENTER][SIZE=4][FONT=Book Antiqua][COLOR=rgb(111, 0, 255)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/FONT][/CENTER]<br>" +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/rmf4CLVn/1.png[/img][/url]"+
             "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Внимательно изучив и рассмотрев вашу жалобу.[/COLOR][/FONT][/CENTER]<br>" +
             "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Мною было принято следующее решение.[/COLOR][/FONT][/CENTER]<br>" +
        "[CENTER][SIZE=4][COLOR=#9d52ff][ICODE]Утвержденный вердикт[/ICODE][/COLOR][/CENTER]<br>" +
	     "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Нарушитель будет наказан по пункту правил:[/COLOR][/FONT][QUOTE][SIZE=4][FONT=Times New Roman][COLOR=rgb(255, 0, 0)]2.44.[/COLOR] На серверах проекта запрещен Role Play сон (нахождение в AFK без ESC) | [COLOR=rgb(255, 0, 0)]Kick.[/COLOR][/SIZE][/QUOTE][/CENTER]" +
             "[CENTER][SIZE=4][FONT=Times New Roman][COLOR=rgb(255, 0, 0)]Исключение:[/COLOR] сон разрешается с [COLOR=rgb(2, 11, 247)]23:00[/COLOR] до [COLOR=rgb(2, 11, 247)]6:00[/COLOR] в совершенно любых местах, но только на соответствующих и привычных для этого объектах (скамейки, кровати и так далее).[/FONT][/CENTER]<br>" +
             "[CENTER][SIZE=4][FONT=Times New Roman][COLOR=rgb(255, 0, 0)]Примечание:[/COLOR] сон запрещается в тех местах, где он может оказывать любую помеху другим игрокам сервера.[/FONT][/CENTER]<br>" +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/rmf4CLVn/1.png[/img][/url]<br>"+
        "[CENTER][SIZE=4][COLOR=#70fc05][ICODE]Одобрено[/ICODE][/COLOR][/CENTER]<br>"+
    "[CENTER][SIZE=4][FONT=Times New Roman]Приятной игры на сервере [COLOR=#ff7b00] Bratsk (74).[/COLOR][/FONT][/SIZE][/CENTER]",
	  prefix: OKAY_PREFIX,
	  status: false,
	},
{
	  title: 'ЕПП инко/дально',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(0, 255, 0, 0.5); font-family: UtromPressKachat',
	  content:
"[CENTER][SIZE=4][FONT=Book Antiqua][COLOR=rgb(111, 0, 255)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/FONT][/CENTER]<p>" +
"[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/rmf4CLVn/1.png[/img][/url]"+
"[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Внимательно изучив и рассмотрев вашу жалобу.[/COLOR][/FONT][/CENTER]<p>"+
"[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Мною было принято следующее решение.[/COLOR][/FONT][/CENTER]<p>"+
"[CENTER][SIZE=4][COLOR=#6f00ff][ICODE]Утвержденный вердикт[/ICODE][/COLOR][/CENTER]<p>"+
"[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Нарушитель будет наказан по пункту правил:[/COLOR][/FONT][QUOTE][SIZE=4][FONT=Times New Roman][COLOR=rgb(255, 0, 0)]2.47.[/COLOR] Запрещено ездить по полям на грузовом транспорте, инкассаторских машинах (работа дальнобойщика, инкассатора) | [COLOR=rgb(255, 0, 0)]Jail 60 минут.[/COLOR][/SIZE][/QUOTE][/CENTER]"+
"[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/rmf4CLVn/1.png[/img][/url]<p>"+
"[CENTER][SIZE=4][COLOR=#70fc05][ICODE]Одобрено[/ICODE][/COLOR][/CENTER]<p>"+
"[CENTER][SIZE=4][FONT=Times New Roman]Приятной игры на сервере [COLOR=#ff7b00] Bratsk (74).[/COLOR][/FONT][/SIZE][/CENTER]<p>",
	  prefix: OKAY_PREFIX,
	  status: false,
	},
{
	  title: 'Аресты в интерьере',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(0, 255, 0, 0.5); font-family: UtromPressKachat',
	  content:
		"[CENTER][SIZE=4][FONT=Book Antiqua][COLOR=rgb(111, 0, 255)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/FONT][/CENTER]<p>" +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/rmf4CLVn/1.png[/img][/url]"+
             "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Внимательно изучив и рассмотрев вашу жалобу.[/COLOR][/FONT][/CENTER]<p>" +
             "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Мною было принято следующее решение.[/COLOR][/FONT][/CENTER]<p>" +
        "[CENTER][SIZE=4][COLOR=#6f00ff][ICODE]Утвержденный вердикт[/ICODE][/COLOR][/CENTER]<p>" +
	     "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Нарушитель будет наказан по пункту правил:[/COLOR][/FONT][QUOTE][SIZE=4][FONT=Times New Roman][COLOR=rgb(255, 0, 0)]2.50.[/COLOR] Запрещены задержания, аресты, а также любые действия со стороны игроков, состоящих во фракциях в интерьере аукциона, казино, а также во время системных мероприятий | [COLOR=rgb(255, 0, 0)]Ban 7 - 15 дней + увольнение из организации.[/COLOR][/SIZE][/QUOTE][/CENTER]"+ 
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/rmf4CLVn/1.png[/img][/url]<p>"+
        "[CENTER][SIZE=4][COLOR=#70fc05][ICODE]Одобрено[/ICODE][/COLOR][/CENTER]<p>"+
    "[CENTER][SIZE=4][FONT=Times New Roman]Приятной игры на сервере [COLOR=#ff7b00] Bratsk (74).[/COLOR][/FONT][/SIZE][/CENTER]",
	  prefix: OKAY_PREFIX,
	  status: false,
	},
{
	  title: 'nRP аксессуар',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(0, 255, 0, 0.5); font-family: UtromPressKachat',
	  content:
		"[CENTER][SIZE=4][FONT=Book Antiqua][COLOR=rgb(111, 0, 255)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/FONT][/CENTER]<p>" +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/rmf4CLVn/1.png[/img][/url]"+
             "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Внимательно изучив и рассмотрев вашу жалобу.[/COLOR][/FONT][/CENTER]<p>" +
             "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Мною было принято следующее решение.[/COLOR][/FONT][/CENTER]<p>" +
        "[CENTER][SIZE=4][COLOR=#6f00ff][ICODE]Утвержденный вердикт[/ICODE][/COLOR][/CENTER]<p>" +
	     "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Нарушитель будет наказан по пункту правил:[/COLOR][/FONT][QUOTE][SIZE=4][FONT=Times New Roman][COLOR=rgb(255, 0, 0)]2.52.[/COLOR] Запрещено располагать аксессуары на теле персонажа, нарушая нормы морали и этики, увеличивать аксессуары до слишком большого размера. | [COLOR=rgb(255, 0, 0)]При первом нарушении - обнуление аксессуаров, при повторном нарушении - обнуление аксессуаров + JAIL 30 минут.[/COLOR][/SIZE][/QUOTE][/CENTER]" +
             "[SIZE=4][FONT=Times New Roman][COLOR=rgb(255, 0, 0)]Пример:[/COLOR] слишком большие аксессуары на голове персонажа, имитация гитарой половых органов и тому подобное.[/FONT][/CENTER]<p>" +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/rmf4CLVn/1.png[/img][/url]<p>"+
        "[CENTER][SIZE=4][COLOR=#70fc05][ICODE]Одобрено[/ICODE][/COLOR][/CENTER]<p>"+
    "[CENTER][SIZE=4][FONT=Times New Roman]Приятной игры на сервере [COLOR=#ff7b00] Bratsk (74).[/COLOR][/FONT][/SIZE][/CENTER]",
	  prefix: OKAY_PREFIX,
	  status: false,
	},
{
	  title: 'Оск адм',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(0, 255, 0, 0.5); font-family: UtromPressKachat',
	  content:
		"[CENTER][SIZE=4][FONT=Book Antiqua][COLOR=rgb(111, 0, 255)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/FONT][/CENTER]<p>" +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/rmf4CLVn/1.png[/img][/url]"+
             "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Внимательно изучив и рассмотрев вашу жалобу.[/COLOR][/FONT][/CENTER]<p>" +
             "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Мною было принято следующее решение.[/COLOR][/FONT][/CENTER]<p>" +
        "[CENTER][SIZE=4][COLOR=#6f00ff][ICODE]Утвержденный вердикт[/ICODE][/COLOR][/CENTER]<p>" +
	     "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Нарушитель будет наказан по пункту правил:[/COLOR][/FONT][QUOTE][SIZE=4][FONT=Times New Roman][COLOR=rgb(255, 0, 0)]2.54.[/COLOR] Запрещено неуважительное обращение, оскорбление, неадекватное поведение, угрозы в любом их проявлении по отношению к администрации | [COLOR=rgb(255, 0, 0)]Mute 180 минут.[/COLOR][/SIZE][/QUOTE][/CENTER]<p>" +
             "[CENTER][SIZE=4][FONT=Times New Roman][COLOR=rgb(255, 0, 0)]Пример:[/COLOR] оформление жалобы в игре с текстом: {Быстро починил меня}, {Админы вы задрали уже когда работать будете меня тут ДБшат я 3 жалобы уже подал!!!!!!!!}, {МОЗГИ ВКЛЮЧИТЕ Я УВОЛЮ ВАС ЩА} и т.д. и т.п., а также при взаимодействии с другими игроками.[/FONT][/SIZE][/CENTER]" +
             "[CENTER][SIZE=4][FONT=Times New Roman][COLOR=rgb(255, 0, 0)]Пример:[/COLOR] оскорбление администрации в любой чат, включая репорт подлежит наказанию в виде блокировки доступа к использованию всех видов чатов - [COLOR=rgb(255, 0, 0)]Mute 180 минут.[/COLOR][/FONT][/SIZE][/CENTER]<p>" +
       "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/rmf4CLVn/1.png[/img][/url]<p>"+
       "[CENTER][SIZE=4][COLOR=#70fc05][ICODE]Одобрено[/ICODE][/COLOR][/CENTER]<p>"+
             "[CENTER][SIZE=4][FONT=Times New Roman]Приятной игры на сервере [COLOR=#ff7b00] Bratsk (74).[/COLOR][/FONT][/SIZE][/CENTER]",
	  prefix: OKAY_PREFIX,
	  status: false,
	},
{
	  title: 'Багаюз с аним',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(0, 255, 0, 0.5); font-family: UtromPressKachat',
	  content:
		"[CENTER][SIZE=4][FONT=Book Antiqua][COLOR=rgb(111, 0, 255)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/FONT][/CENTER]<p>" +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/rmf4CLVn/1.png[/img][/url]"+
             "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Внимательно изучив и рассмотрев вашу жалобу.[/COLOR][/FONT][/CENTER]<br>" +
             "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Мною было принято следующее решение.[/COLOR][/FONT][/CENTER]<br>" +
        "[CENTER][SIZE=4][COLOR=#9d52ff][ICODE]Утвержденный вердикт[/ICODE][/COLOR][/CENTER]<br>" +
	     "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Нарушитель будет наказан по пункту правил:[/COLOR][/FONT][QUOTE][SIZE=4][FONT=Times New Roman][COLOR=rgb(255, 0, 0)]2.55.[/COLOR] Запрещается багоюз связанный с анимацией в любых проявлениях. | [COLOR=rgb(255, 0, 0)]Jail 60 / 120 минут.[/COLOR][/SIZE][/QUOTE][/CENTER]"+
            "[SIZE=4][FONT=Times New Roman][COLOR=rgb(255, 0, 0)]Примечание:[/COLOR] наказание применяется в случаях, когда, используя ошибку, игрок получает преимущество перед другими игроками.[/FONT][/SIZE]"+
"<br>" +
            "[SIZE=4][FONT=Times New Roman][COLOR=rgb(255, 0, 0)]Пример:[/COLOR] если игрок, используя баг, убирает ограничение на использование оружия в зелёной зоне, сбивает темп стрельбы, либо быстро перемещается во время войны за бизнес, перестрелки на мероприятии с семейными контейнерами или на мероприятии от администрации.[/FONT][/SIZE]"+
"<br>" +
            "[SIZE=4][FONT=Times New Roman][COLOR=rgb(255, 0, 0)]Исключение:[/COLOR] разрешается использование сбива темпа стрельбы в войне за бизнес при согласии обеих сторон и с уведомлением следящего администратора в соответствующей беседе.[/FONT][/SIZE]"+
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/rmf4CLVn/1.png[/img][/url]<br>"+
        "[CENTER][SIZE=4][COLOR=#70fc05][ICODE]Одобрено[/ICODE][/COLOR][/CENTER]<br>"+
    "[CENTER][SIZE=4][FONT=Times New Roman]Приятной игры на сервере [COLOR=#ff7b00] Bratsk (74).[/COLOR][/FONT][/SIZE][/CENTER]",
	  prefix: OKAY_PREFIX,
	  status: false,
	},
     {
          title: 'Долг',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(0, 255, 0, 0.5); font-family: UtromPressKachat',
	  content:
		"[CENTER][SIZE=4][FONT=Book Antiqua][COLOR=rgb(111, 0, 255)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/FONT][/CENTER]" +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/rmf4CLVn/1.png[/img][/url]<p>"+
             "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Внимательно изучив и рассмотрев вашу жалобу.[/COLOR][/FONT][/CENTER]<p>"+
             "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Мною было принято следующее решение.[/COLOR][/FONT][/CENTER]<p>"+
        "[CENTER][SIZE=4][COLOR=#6f00ff][ICODE]Утвержденный вердикт[/ICODE][/COLOR][/CENTER]<p>"+
	     "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Нарушитель будет наказан по пункту правил:[/COLOR][/FONT][QUOTE][SIZE=4][FONT=Times New Roman][COLOR=rgb(255, 0, 0)]2.57.[/COLOR]  Запрещается брать в долг игровые ценности и не возвращать их. | [COLOR=rgb(255, 0, 0)]Ban 30 дней / Permban[/COLOR][/SIZE][/QUOTE][/CENTER]"+
            "[SIZE=4][FONT=Times New Roman][COLOR=rgb(255, 0, 0)]Примечание:[/COLOR] займ может быть осуществлен только через зачисление игровых ценностей на банковский счет, максимальный срок займа 30 календарных дней, если займ не был возвращен, аккаунт должника блокируется;[/FONT][/SIZE]" +
"<p>" +
            "[SIZE=4][FONT=Times New Roman][COLOR=rgb(255, 0, 0)]Примечание:[/COLOR] при невозврате игровых ценностей общей стоимостью менее 5 миллионов включительно аккаунт будет заблокирован на 30 дней, если более 5 миллионов, аккаунт будет заблокирован навсегда;[/FONT][/SIZE]" +
"<p>" +
            "[SIZE=4][FONT=Times New Roman][COLOR=rgb(255, 0, 0)]Исключение:[/COLOR] жалоба на игрока, который занял игровые ценности и не вернул в срок, подлежит рассмотрению только при наличии подтверждения суммы и условий займа в игровом процессе, меры в отношении должника могут быть приняты только при наличии жалобы и доказательств. Жалоба на должника подается в течение 10 дней после истечения срока займа. Договоры вне игры не будут считаться доказательствами.[/FONT][/SIZE]" +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/rmf4CLVn/1.png[/img][/url]<p>"+
        "[CENTER][SIZE=4][COLOR=#70fc05][ICODE]Одобрено[/ICODE][/COLOR][/CENTER]<p>"+
            "[CENTER][SIZE=4][FONT=Times New Roman]Приятной игры на сервере [COLOR=#ff7b00] Bratsk (74).[/COLOR][/FONT][/SIZE][/CENTER]",
          prefix: OKAY_PREFIX,
	  status: false,
	},
     {
    title: '«««««««««««««««««««««««««««««««««««««««««« RolePlay Биографии »»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»',
    dpstyle: 'oswald: 3px;     color: #fff; background: #6f02db; box-shadow: 0 0 2px 0 rgba(148, 0, 201,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #FF0000',
	},
     {
	  title: 'Биография одобрена',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(0, 255, 0, 0.5); font-family: UtromPressKachat',
	  content:
		"[CENTER][SIZE=4][FONT=Book Antiqua][COLOR=rgb(111, 0, 255)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/FONT][/CENTER]" +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/rmf4CLVn/1.png[/img][/url]<p>"+
             "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Внимательно изучив и рассмотрев вашу жалобу.[/COLOR][/FONT][/CENTER]<p>"+
            "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Основываясь на информации, предоставленной в вашей RolePlay биографии.[/COLOR][/FONT][/CENTER]<br>" +
             "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Мною было принято следующее решение.[/COLOR][/FONT][/CENTER]<p>"+
        "[CENTER][SIZE=4][COLOR=#6f00ff][ICODE]Утвержденный вердикт[/ICODE][/COLOR][/CENTER]<p>"+
         "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Ваша биография соответствует установленным требованиям.[/COLOR][/FONT][/CENTER]<p>"+
        "[CENTER][img]https://i.postimg.cc/rmf4CLVn/1.png[/img]<br>"+
      	"[CENTER][SIZE=4][COLOR=#70fc05][ICODE]Одобрено[/ICODE][/COLOR][/CENTER]<br>"+
    "[CENTER][SIZE=4][FONT=Times New Roman]Приятной игры на сервере [COLOR=#ff7b00] Bratsk (74).[/COLOR][/FONT][/SIZE][/CENTER]",
	  prefix: OKAY_PREFIX,
	  status: false,
	},
    {
	  title: 'Биография отказана',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
	  content:
		"[CENTER][SIZE=4][FONT=Book Antiqua][COLOR=rgb(111, 0, 255)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/FONT][/CENTER]" +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/rmf4CLVn/1.png[/img][/url]<p>"+
             "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Внимательно изучив и рассмотрев вашу жалобу.[/COLOR][/FONT][/CENTER]<p>"+
            "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Основываясь на информации, предоставленной в вашей RolePlay биографии.[/COLOR][/FONT][/CENTER]<br>" +
             "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Мною было принято следующее решение.[/COLOR][/FONT][/CENTER]<p>"+
        "[CENTER][SIZE=4][COLOR=#6f00ff][ICODE]Утвержденный вердикт[/ICODE][/COLOR][/CENTER]<p>"+
		"[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Ваша RolePlay биография получает статус[/COLOR] [COLOR=rgb(255, 0, 0)]Отказано.[/COLOR][/FONT] <br>" +
                "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Ознакомиться с правилами подачи RolePlay биографией можно тут:[/COLOR][FONT=Times New Roman] [URL=https://forum.blackrussia.online/threads/bratsk-%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BD%D0%B0%D0%BF%D0%B8%D1%81%D0%B0%D0%BD%D0%B8%D1%8F-rp-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8.12611792/] «Правила подачи RolePlay биографий»[/URL][/FONT][/CENTER]<br>" +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/rmf4CLVn/1.png[/img][/url]<br>"+
		 "[CENTER][SIZE=4][COLOR=#ff0a0a][ICODE]Закрыто[/ICODE][/COLOR][/CENTER]<br>"+
    "[CENTER][SIZE=4][FONT=Times New Roman]Приятной игры на сервере [COLOR=#ff7b00] Bratsk (74).[/COLOR][/FONT][/SIZE][/CENTER]",
	  prefix: FAIL_PREFIX,
	  status: false,
	},
    {
	  title: 'Мало инфо',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
	  content:
		"[CENTER][SIZE=4][FONT=Book Antiqua][COLOR=rgb(111, 0, 255)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/FONT][/CENTER]" +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/rmf4CLVn/1.png[/img][/url]<p>"+
             "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Внимательно изучив и рассмотрев вашу жалобу.[/COLOR][/FONT][/CENTER]<p>"+
            "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Основываясь на информации, предоставленной в вашей RolePlay биографии.[/COLOR][/FONT][/CENTER]<br>" +
             "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Мною было принято следующее решение.[/COLOR][/FONT][/CENTER]<p>"+
        "[CENTER][SIZE=4][COLOR=#6f00ff][ICODE]Утвержденный вердикт[/ICODE][/COLOR][/CENTER]<p>"+
		"[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Ваша RolePlay биография получает статус[/COLOR] [COLOR=rgb(255, 0, 0)]Отказано.[/COLOR][/FONT] <br>" +
             "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]RolePlay биография не соответствует требованиям, поскольку в ней содержится мало информации. [/COLOR][/FONT][/CENTER]<br>" +
                "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Предоставьте более подробное описание каждого пункта.[/COLOR][/FONT][/CENTER] <br>" +
                 "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Ознакомиться с правилами подачи RolePlay биографией можно тут:[/COLOR][FONT=Times New Roman] [URL=https://forum.blackrussia.online/threads/bratsk-%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BD%D0%B0%D0%BF%D0%B8%D1%81%D0%B0%D0%BD%D0%B8%D1%8F-rp-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8.12611792/] «Правила подачи RolePlay биографий»[/URL][/FONT][/CENTER]<br>" +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/rmf4CLVn/1.png[/img][/url]<br>"+
		"[CENTER][SIZE=4][COLOR=#ff0a0a][ICODE]Закрыто[/ICODE][/COLOR][/CENTER]<br>"+
    "[CENTER][SIZE=4][FONT=Times New Roman]Приятной игры на сервере [COLOR=#ff7b00] Bratsk (74).[/COLOR][/FONT][/SIZE][/CENTER]",
	  prefix: FAIL_PREFIX,
	  status: false,
	},
    {
	  title: 'Дата не сходится',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
	  content:
		"[CENTER][SIZE=4][FONT=Book Antiqua][COLOR=rgb(111, 0, 255)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/FONT][/CENTER]" +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/rmf4CLVn/1.png[/img][/url]<p>"+
             "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Внимательно изучив и рассмотрев вашу жалобу.[/COLOR][/FONT][/CENTER]<p>"+
            "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Основываясь на информации, предоставленной в вашей RolePlay биографии.[/COLOR][/FONT][/CENTER]<br>" +
             "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Мною было принято следующее решение.[/COLOR][/FONT][/CENTER]<p>"+
        "[CENTER][SIZE=4][COLOR=#6f00ff][ICODE]Утвержденный вердикт[/ICODE][/COLOR][/CENTER]<p>"+
		"[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Ваша RolePlay биография получает статус[/COLOR] [COLOR=rgb(255, 0, 0)]Отказано.[/COLOR][/FONT] <br>" +
              "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Поскольку дата рождения не соответствует указанному возрасту или указана не полностью.[/COLOR][/FONT][/CENTER] <br>" +
            "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Ознакомиться с правилами подачи RolePlay биографией можно тут:[/COLOR][FONT=Times New Roman] [URL=https://forum.blackrussia.online/threads/bratsk-%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BD%D0%B0%D0%BF%D0%B8%D1%81%D0%B0%D0%BD%D0%B8%D1%8F-rp-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8.12611792/] «Правила подачи RolePlay биографий»[/URL][/FONT][/CENTER]<br>" +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/rmf4CLVn/1.png[/img][/url]<br>"+
		  "[CENTER][SIZE=4][COLOR=#ff0a0a][ICODE]Закрыто[/ICODE][/COLOR][/CENTER]<br>"+
    "[CENTER][SIZE=4][FONT=Times New Roman]Приятной игры на сервере [COLOR=#ff7b00] Bratsk (74).[/COLOR][/FONT][/SIZE][/CENTER]",
	  prefix: FAIL_PREFIX,
	  status: false,
	},
    {
	  title: 'Дубликат',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
	  content:
		"[CENTER][SIZE=4][FONT=Book Antiqua][COLOR=rgb(111, 0, 255)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/FONT][/CENTER]" +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/rmf4CLVn/1.png[/img][/url]<p>"+
             "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Внимательно изучив и рассмотрев вашу жалобу.[/COLOR][/FONT][/CENTER]<p>"+
            "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Основываясь на информации, предоставленной в вашей RolePlay биографии.[/COLOR][/FONT][/CENTER]<br>" +
             "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Мною было принято следующее решение.[/COLOR][/FONT][/CENTER]<p>"+
        "[CENTER][SIZE=4][COLOR=#6f00ff][ICODE]Утвержденный вердикт[/ICODE][/COLOR][/CENTER]<p>"+
		"[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Ваша RolePlay биография получает статус[/COLOR] [COLOR=rgb(255, 0, 0)]Отказано.[/COLOR][/FONT] <br>" +
             "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Для каждого аккаунта предусмотрена возможность создания только одной RolePlay биографии.[/COLOR][/FONT][/CENTER]<br>"+
          "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Ознакомиться с правилами подачи RolePlay биографией можно тут:[/COLOR][FONT=Times New Roman] [URL=https://forum.blackrussia.online/threads/bratsk-%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BD%D0%B0%D0%BF%D0%B8%D1%81%D0%B0%D0%BD%D0%B8%D1%8F-rp-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8.12611792/] «Правила подачи RolePlay биографий»[/URL][/FONT][/CENTER]<br>" +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/rmf4CLVn/1.png[/img][/url]<br>"+
		"[CENTER][SIZE=4][COLOR=#ff0a0a][ICODE]Закрыто[/ICODE][/COLOR][/CENTER]<br>"+
    "[CENTER][SIZE=4][FONT=Times New Roman]Приятной игры на сервере [COLOR=#ff7b00] Bratsk (74).[/COLOR][/FONT][/SIZE][/CENTER]",
	  prefix: FAIL_PREFIX,
	  status: false,
    },
    {
         title: 'NickName',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
	  content:
		"[CENTER][SIZE=4][FONT=Book Antiqua][COLOR=rgb(111, 0, 255)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/FONT][/CENTER]" +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/rmf4CLVn/1.png[/img][/url]<p>"+
             "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Внимательно изучив и рассмотрев вашу жалобу.[/COLOR][/FONT][/CENTER]<p>"+
            "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Основываясь на информации, предоставленной в вашей RolePlay биографии.[/COLOR][/FONT][/CENTER]<br>" +
             "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Мною было принято следующее решение.[/COLOR][/FONT][/CENTER]<p>"+
        "[CENTER][SIZE=4][COLOR=#6f00ff][ICODE]Утвержденный вердикт[/ICODE][/COLOR][/CENTER]<p>"+
		"[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Ваша RolePlay биография получает статус[/COLOR] [COLOR=rgb(255, 0, 0)]Отказано.[/COLOR][/FONT] <br>" +
               "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]К сожалению, ваша биография была отклонена из-за несоответствия Nick_Name вашего персонажа правилам RolePlay (nRP).[/COLOR][/FONT][/CENTER]<br>" +
               "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Ознакомиться с правилами подачи RolePlay биографией можно тут:[/COLOR][FONT=Times New Roman] [URL=https://forum.blackrussia.online/threads/bratsk-%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BD%D0%B0%D0%BF%D0%B8%D1%81%D0%B0%D0%BD%D0%B8%D1%8F-rp-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8.12611792/] «Правила подачи RolePlay биографий»[/URL][/FONT][/CENTER]<br>" +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/rmf4CLVn/1.png[/img][/url]<br>"+
		"[CENTER][SIZE=4][COLOR=#ff0a0a][ICODE]Закрыто[/ICODE][/COLOR][/CENTER]<br>"+
    "[CENTER][SIZE=4][FONT=Times New Roman]Приятной игры на сервере [COLOR=#ff7b00] Bratsk (74).[/COLOR][/FONT][/SIZE][/CENTER]",
	  prefix: FAIL_PREFIX,
	  status: false,
	},
    {
	  title: '3-е лицо',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
	  content:
		"[CENTER][SIZE=4][FONT=Book Antiqua][COLOR=rgb(111, 0, 255)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/FONT][/CENTER]" +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/rmf4CLVn/1.png[/img][/url]<p>"+
             "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Внимательно изучив и рассмотрев вашу жалобу.[/COLOR][/FONT][/CENTER]<p>"+
            "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Основываясь на информации, предоставленной в вашей RolePlay биографии.[/COLOR][/FONT][/CENTER]<br>" +
             "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Мною было принято следующее решение.[/COLOR][/FONT][/CENTER]<p>"+
        "[CENTER][SIZE=4][COLOR=#6f00ff][ICODE]Утвержденный вердикт[/ICODE][/COLOR][/CENTER]<p>"+
		"[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Ваша RolePlay биография получает статус[/COLOR] [COLOR=rgb(255, 0, 0)]Отказано.[/COLOR]т.к. она написана от третьего лица.[/FONT]<br>" +
                "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Ознакомиться с правилами подачи RolePlay биографией можно тут:[/COLOR][FONT=Times New Roman] [URL=https://forum.blackrussia.online/threads/bratsk-%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BD%D0%B0%D0%BF%D0%B8%D1%81%D0%B0%D0%BD%D0%B8%D1%8F-rp-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8.12611792/] «Правила подачи RolePlay биографий»[/URL][/FONT][/CENTER]<br>" +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/rmf4CLVn/1.png[/img][/url]<br>"+
		"[CENTER][SIZE=4][COLOR=#ff0a0a][ICODE]Закрыто[/ICODE][/COLOR][/CENTER]<br>"+
    "[CENTER][SIZE=4][FONT=Times New Roman]Приятной игры на сервере [COLOR=#ff7b00] Bratsk (74).[/COLOR][/FONT][/SIZE][/CENTER]",
	  prefix: FAIL_PREFIX,
	  status: false,
	},
    {
	  title: 'Заголовок',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
	  content:
		"[CENTER][SIZE=4][FONT=Book Antiqua][COLOR=rgb(111, 0, 255)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/FONT][/CENTER]" +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/rmf4CLVn/1.png[/img][/url]<p>"+
             "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Внимательно изучив и рассмотрев вашу жалобу.[/COLOR][/FONT][/CENTER]<p>"+
            "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Основываясь на информации, предоставленной в вашей RolePlay биографии.[/COLOR][/FONT][/CENTER]<br>" +
             "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Мною было принято следующее решение.[/COLOR][/FONT][/CENTER]<p>"+
        "[CENTER][SIZE=4][COLOR=#6f00ff][ICODE]Утвержденный вердикт[/ICODE][/COLOR][/CENTER]<p>"+
		"[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Ваша RolePlay биография получает статус[/COLOR] [COLOR=rgb(255, 0, 0)]Отказано.[/COLOR][/FONT] <br>" +
                "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Поскольку Ваш заголовок не соответствует установленным требованиям.[/COLOR][/FONT][/CENTER] <br>" + 
                 "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Ознакомиться с правилами подачи RolePlay биографией можно тут:[/COLOR][FONT=Times New Roman] [URL=https://forum.blackrussia.online/threads/bratsk-%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BD%D0%B0%D0%BF%D0%B8%D1%81%D0%B0%D0%BD%D0%B8%D1%8F-rp-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8.12611792/] «Правила подачи RolePlay биографий»[/URL][/FONT][/CENTER]<br>" +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/rmf4CLVn/1.png[/img][/url]<br>"+
		"[CENTER][SIZE=4][COLOR=#ff0a0a][ICODE]Закрыто[/ICODE][/COLOR][/CENTER]<br>"+
    "[CENTER][SIZE=4][FONT=Times New Roman]Приятной игры на сервере [COLOR=#ff7b00] Bratsk (74).[/COLOR][/FONT][/SIZE][/CENTER]",
	  prefix: FAIL_PREFIX,
	  status: false,
	},
    {
	  title: 'Ошибки',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
	  content:
		"[CENTER][SIZE=4][FONT=Book Antiqua][COLOR=rgb(111, 0, 255)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/FONT][/CENTER]" +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/rmf4CLVn/1.png[/img][/url]<p>"+
             "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Внимательно изучив и рассмотрев вашу жалобу.[/COLOR][/FONT][/CENTER]<p>"+
            "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Основываясь на информации, предоставленной в вашей RolePlay биографии.[/COLOR][/FONT][/CENTER]<br>" +
             "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Мною было принято следующее решение.[/COLOR][/FONT][/CENTER]<p>"+
        "[CENTER][SIZE=4][COLOR=#6f00ff][ICODE]Утвержденный вердикт[/ICODE][/COLOR][/CENTER]<p>"+
		"[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Ваша RolePlay биография получает статус[/COLOR] [COLOR=rgb(255, 0, 0)]Отказано.[/COLOR][/FONT] <br>" +
            "[CENTER][FONT=Book Antiqua]Поскольку в тексте присутствует большое количество грамматических ошибок.[/COLOR][/FONT][/CENTER]<p>"+
                "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Ознакомиться с правилами подачи RolePlay биографией можно тут:[/COLOR][FONT=Times New Roman] [URL=https://forum.blackrussia.online/threads/bratsk-%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BD%D0%B0%D0%BF%D0%B8%D1%81%D0%B0%D0%BD%D0%B8%D1%8F-rp-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8.12611792/] «Правила подачи RolePlay биографий»[/URL][/FONT][/CENTER]<br>" +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/rmf4CLVn/1.png[/img][/url]<br>"+
		"[CENTER][SIZE=4][COLOR=#ff0a0a][ICODE]Закрыто[/ICODE][/COLOR][/CENTER]<br>"+
    "[CENTER][SIZE=4][FONT=Times New Roman]Приятной игры на сервере [COLOR=#ff7b00] Bratsk (74).[/COLOR][/FONT][/SIZE][/CENTER]",
	  prefix: FAIL_PREFIX,
	  status: false,
	},
    {
	  title: 'Копипаст',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
	  content:
		"[CENTER][SIZE=4][FONT=Book Antiqua][COLOR=rgb(111, 0, 255)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/FONT][/CENTER]" +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/rmf4CLVn/1.png[/img][/url]<p>"+
             "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Внимательно изучив и рассмотрев вашу жалобу.[/COLOR][/FONT][/CENTER]<p>"+
            "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Основываясь на информации, предоставленной в вашей RolePlay биографии.[/COLOR][/FONT][/CENTER]<br>" +
             "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Мною было принято следующее решение.[/COLOR][/FONT][/CENTER]<p>"+
        "[CENTER][SIZE=4][COLOR=#6f00ff][ICODE]Утвержденный вердикт[/ICODE][/COLOR][/CENTER]<p>"+
		"[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Ваша RolePlay биография получает статус[/COLOR] [COLOR=rgb(255, 0, 0)]Отказано.[/COLOR][/FONT] <br>" +
              "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Представленные биографии должны быть оригинальными; скопированные материалы будут отклонены.[/COLOR][/FONT][/CENTER]<p>"+  
             "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Ознакомиться с правилами подачи RolePlay биографией можно тут:[/COLOR][FONT=Times New Roman] [URL=https://forum.blackrussia.online/threads/bratsk-%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BD%D0%B0%D0%BF%D0%B8%D1%81%D0%B0%D0%BD%D0%B8%D1%8F-rp-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8.12611792/] «Правила подачи RolePlay биографий»[/URL][/FONT][/CENTER]<br>" +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/rmf4CLVn/1.png[/img][/url]<br>"+
		"[CENTER][SIZE=4][COLOR=#ff0a0a][ICODE]Закрыто[/ICODE][/COLOR][/CENTER]<br>"+
    "[CENTER][SIZE=4][FONT=Times New Roman]Приятной игры на сервере [COLOR=#ff7b00] Bratsk (74).[/COLOR][/FONT][/SIZE][/CENTER]",
	  prefix: FAIL_PREFIX,
	  status: false,
	},
     {
	  title: 'ОФФТОП',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
	  content:
		"[CENTER][SIZE=4][FONT=Book Antiqua][COLOR=rgb(111, 0, 255)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/FONT][/CENTER]" +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/rmf4CLVn/1.png[/img][/url]<p>"+
             "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Внимательно изучив и рассмотрев вашу жалобу.[/COLOR][/FONT][/CENTER]<p>"+
            "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Основываясь на информации, предоставленной в вашей RolePlay биографии.[/COLOR][/FONT][/CENTER]<br>" +
             "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Мною было принято следующее решение.[/COLOR][/FONT][/CENTER]<p>"+
        "[CENTER][SIZE=4][COLOR=#6f00ff][ICODE]Утвержденный вердикт[/ICODE][/COLOR][/CENTER]<p>"+
		"[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Ваша RolePlay биография получает статус[/COLOR] [COLOR=rgb(255, 0, 0)]Отказано.[/COLOR][/FONT] <br>" +
           "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Ваша тема не относится к данному разделу.[/COLOR][/FONT][/CENTER]<p>"+  
         "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Ознакомиться с правилами подачи RolePlay биографией можно тут:[/COLOR][FONT=Times New Roman] [URL=https://forum.blackrussia.online/threads/bratsk-%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BD%D0%B0%D0%BF%D0%B8%D1%81%D0%B0%D0%BD%D0%B8%D1%8F-rp-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8.12611792/] «Правила подачи RolePlay биографий»[/URL][/FONT][/CENTER]<br>" +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/rmf4CLVn/1.png[/img][/url]<br>"+
		"[CENTER][SIZE=4][COLOR=#ff0a0a][ICODE]Закрыто[/ICODE][/COLOR][/CENTER]<br>"+
    "[CENTER][SIZE=4][FONT=Times New Roman]Приятной игры на сервере [COLOR=#ff7b00] Bratsk (74).[/COLOR][/FONT][/SIZE][/CENTER]",
	  prefix: FAIL_PREFIX,
	  status: false,
	},
     {
	  title: 'Неадекватная Биография',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
	  content:
		"[CENTER][SIZE=4][FONT=Book Antiqua][COLOR=rgb(111, 0, 255)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/FONT][/CENTER]" +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/rmf4CLVn/1.png[/img][/url]<p>"+
             "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Внимательно изучив и рассмотрев вашу жалобу.[/COLOR][/FONT][/CENTER]<p>"+
            "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Основываясь на информации, предоставленной в вашей RolePlay биографии.[/COLOR][/FONT][/CENTER]<br>" +
             "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Мною было принято следующее решение.[/COLOR][/FONT][/CENTER]<p>"+
        "[CENTER][SIZE=4][COLOR=#6f00ff][ICODE]Утвержденный вердикт[/ICODE][/COLOR][/CENTER]<p>"+
		"[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Ваша RolePlay биография получает статус[/COLOR] [COLOR=rgb(255, 0, 0)]Отказано.[/COLOR][/FONT] <br>" +
               "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Из-за использования в тексте непристойных выражений или оскорбительных слов.[/COLOR][/FONT][/CENTER]<p>"+
         "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Ознакомиться с правилами подачи RolePlay биографией можно тут:[/COLOR][FONT=Times New Roman] [URL=https://forum.blackrussia.online/threads/bratsk-%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BD%D0%B0%D0%BF%D0%B8%D1%81%D0%B0%D0%BD%D0%B8%D1%8F-rp-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8.12611792/] «Правила подачи RolePlay биографий»[/URL][/FONT][/CENTER]<br>" +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/rmf4CLVn/1.png[/img][/url]<br>"+
		"[CENTER][SIZE=4][COLOR=#ff0a0a][ICODE]Закрыто[/ICODE][/COLOR][/CENTER]<br>"+
    "[CENTER][SIZE=4][FONT=Times New Roman]Приятной игры на сервере [COLOR=#ff7b00] Bratsk (74).[/COLOR][/FONT][/SIZE][/CENTER]",
	  prefix: FAIL_PREFIX,
	  status: false,
	},
   {
	  title: 'Повтор',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
	  content:
		"[CENTER][SIZE=4][FONT=Book Antiqua][COLOR=rgb(111, 0, 255)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/FONT][/CENTER]" +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/rmf4CLVn/1.png[/img][/url]<p>"+
             "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Внимательно изучив и рассмотрев вашу жалобу.[/COLOR][/FONT][/CENTER]<p>"+
            "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Основываясь на информации, предоставленной в вашей RolePlay биографии.[/COLOR][/FONT][/CENTER]<br>" +
             "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Мною было принято следующее решение.[/COLOR][/FONT][/CENTER]<p>"+
        "[CENTER][SIZE=4][COLOR=#6f00ff][ICODE]Утвержденный вердикт[/ICODE][/COLOR][/CENTER]<p>"+
		"[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Ваша RolePlay биография получает статус[/COLOR] [COLOR=rgb(255, 0, 0)]Отказано.[/COLOR][/FONT] <br>" +
                 "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Подробная информация была предоставлена в предыдущей теме.[/COLOR][/FONT][/CENTER]<p>"+
		"[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Ознакомиться с правилами подачи RolePlay биографией можно тут:[/COLOR][FONT=Times New Roman] [URL=https://forum.blackrussia.online/threads/bratsk-%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BD%D0%B0%D0%BF%D0%B8%D1%81%D0%B0%D0%BD%D0%B8%D1%8F-rp-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8.12611792/] «Правила подачи RolePlay биографий»[/URL][/FONT][/CENTER]<br>" +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/rmf4CLVn/1.png[/img][/url]<br>"+
		"[CENTER][SIZE=4][COLOR=#ff0a0a][ICODE]Закрыто[/ICODE][/COLOR][/CENTER]<br>"+
    "[CENTER][SIZE=4][FONT=Times New Roman]Приятной игры на сервере [COLOR=#ff7b00] Bratsk (74).[/COLOR][/FONT][/SIZE][/CENTER]",
	  prefix: FAIL_PREFIX,
	  status: false,
	},
     {
	  title: 'не по форме',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
	  content:
		"[CENTER][SIZE=4][FONT=Book Antiqua][COLOR=rgb(111, 0, 255)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/FONT][/CENTER]<p>" +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/rmf4CLVn/1.png[/img][/url]"+
             "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Внимательно изучив и рассмотрев вашу жалобу.[/COLOR][/FONT][/CENTER]<p>" +
             "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Мною было принято следующее решение.[/COLOR][/FONT][/CENTER]<p>" +
        "[CENTER][SIZE=4][COLOR=#6f00ff][ICODE]Утвержденный вердикт[/ICODE][/COLOR][/CENTER]<p>" +
            "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Основываясь на информации, предоставленной в вашей RolePlay биографии.[/COLOR][/FONT][/CENTER]<br>" +
        "[CENTER][SIZE=4][COLOR=#6f00ff][ICODE]Утвержденный вердикт[/ICODE][/COLOR][/CENTER]<p>"+
		"[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Ваша RolePlay биография получает статус[/COLOR] [COLOR=rgb(255, 0, 0)]Отказано.[/COLOR][/FONT] <br>" +
		"[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Создайте новую Биографию по форме.[/COLOR][/FONT][/CENTER]<p>"+
        "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Ознакомиться с правилами подачи RolePlay биографией можно тут:[/COLOR][FONT=Times New Roman] [URL=https://forum.blackrussia.online/threads/bratsk-%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BD%D0%B0%D0%BF%D0%B8%D1%81%D0%B0%D0%BD%D0%B8%D1%8F-rp-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8.12611792/] «Правила подачи RolePlay биографий»[/URL][/FONT][/CENTER]<br>" +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/rmf4CLVn/1.png[/img][/url]<br>"+
		"[CENTER][SIZE=4][COLOR=#ff0a0a][ICODE]Закрыто[/ICODE][/COLOR][/CENTER]<br>"+
    "[CENTER][SIZE=4][FONT=Times New Roman]Приятной игры на сервере [COLOR=#ff7b00] Bratsk (74).[/COLOR][/FONT][/SIZE][/CENTER]",
	  prefix: FAIL_PREFIX,
	  status: false,
	},
     {
    title: '««««««««««««««««««««««««««««««««««««««««««««« RolePlay Ситуации »»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»',
    dpstyle: 'oswald: 3px;     color: #fff; background: #6f02db; box-shadow: 0 0 2px 0 rgba(148, 0, 201,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #FF0000',
	},
    {
	  title: 'Ситуация одобрена',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(0, 255, 0, 0.5); font-family: UtromPressKachat',
	  content:
		"[CENTER][SIZE=4][FONT=Book Antiqua][COLOR=rgb(111, 0, 255)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/FONT][/CENTER]<p>" +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/rmf4CLVn/1.png[/img][/url]"+
             "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Внимательно изучив и рассмотрев вашу жалобу.[/COLOR][/FONT][/CENTER]<p>" +
             "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Мною было принято следующее решение.[/COLOR][/FONT][/CENTER]<p>" +
        "[CENTER][SIZE=4][COLOR=#6f00ff][ICODE]Утвержденный вердикт[/ICODE][/COLOR][/CENTER]<p>" +
             "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Основываясь на детальном изучении вашей ролевой ситуации, Я выношу свой вердикт.[/COLOR][/CENTER][/FONT]" +
            "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Ваша RolePlay ситуация успешно прошла модерацию.[/COLOR][/CENTER][/FONT]" +
        "[CENTER][img]https://i.postimg.cc/rmf4CLVn/1.png[/img]<br>"+
      	"[CENTER][SIZE=4][COLOR=#70fc05][ICODE]Одобрено[/ICODE][/COLOR][/CENTER]<br>"+
    "[CENTER][SIZE=4][FONT=Times New Roman]Приятной игры на сервере [COLOR=#ff7b00] Bratsk (74).[/COLOR][/FONT][/SIZE][/CENTER]",
	  prefix: OKAY_PREFIX,
	  status: false,
	},
    {
	  title: 'Ситуация отказана',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
	  content:
		"[CENTER][SIZE=4][FONT=Book Antiqua][COLOR=rgb(111, 0, 255)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/FONT][/CENTER]<p>" +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/rmf4CLVn/1.png[/img][/url]"+
             "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Внимательно изучив и рассмотрев вашу жалобу.[/COLOR][/FONT][/CENTER]<p>" +
             "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Мною было принято следующее решение.[/COLOR][/FONT][/CENTER]<p>" +
        "[CENTER][SIZE=4][COLOR=#6f00ff][ICODE]Утвержденный вердикт[/ICODE][/COLOR][/CENTER]<p>" +
                 "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Основываясь на детальном изучении вашей ролевой ситуации, Я выношу свой вердикт.[/COLOR][/CENTER][/FONT]"+
		 "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Ваша RolePlay ситуация [/FONT][/COLOR][COLOR=rgb(255, 0, 0)][FONT=Times New Roman]не прошла проверку.[/COLOR][/CENTER][/FONT]" +
                 "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Ознакомиться с правилами подачи RolePlay ситуаций можно тут:[/COLOR][/FONT][FONT=Times New Roman] [URL=https://forum.blackrussia.online/threads/bratsk-%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BF%D0%BE%D0%B4%D0%B0%D1%87%D0%B8-roleplay-%D1%81%D0%B8%D1%82%D1%83%D0%B0%D1%86%D0%B8%D0%B9.12543158/] «Правила подачи RolePlay ситуаций» [/URL][/FONT][/CENTER]<p>" +
              "[CENTER][img]https://i.postimg.cc/rmf4CLVn/1.png[/img]<br>"+
		"[CENTER][SIZE=4][COLOR=#ff0a0a][ICODE]Закрыто[/ICODE][/COLOR][/CENTER]<br>"+
    "[CENTER][SIZE=4][FONT=Times New Roman]Приятной игры на сервере [COLOR=#ff7b00] Bratsk (74).[/COLOR][/FONT][/SIZE][/CENTER]",
	  prefix: FAIL_PREFIX,
	  status: false,
	},
     {
    title: '««««««««««««««««««««««««««««««««««««««« Неоф. RolePlay организация »»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»',
    dpstyle: 'oswald: 3px;     color: #fff; background: #6f02db; box-shadow: 0 0 2px 0 rgba(148, 0, 201,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #FF0000',
	},
     {
	  title: 'Орг-ция одобрена',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(0, 255, 0, 0.5); font-family: UtromPressKachat',
	  content:
		"[CENTER][SIZE=4][FONT=Book Antiqua][COLOR=rgb(111, 0, 255)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/FONT][/CENTER]<p>" +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/rmf4CLVn/1.png[/img][/url]"+
             "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Внимательно изучив и рассмотрев вашу жалобу.[/COLOR][/FONT][/CENTER]<p>" +
             "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Мною было принято следующее решение.[/COLOR][/FONT][/CENTER]<p>" +
        "[CENTER][SIZE=4][COLOR=#6f00ff][ICODE]Утвержденный вердикт[/ICODE][/COLOR][/CENTER]<p>" +
                "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Основываясь на детальном изучении вашей RolePlay организации, Я выношу свой вердикт.[/COLOR][/CENTER][/FONT]" +
		"[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Ваша неофициальная RolePlay организация признана успешной.[/COLOR][/CENTER][/FONT]" +
		"[CENTER][img]https://i.postimg.cc/rmf4CLVn/1.png[/img]<p>" +
      	"[CENTER][SIZE=4][COLOR=#70fc05][ICODE]Одобрено[/ICODE][/COLOR][/CENTER]<br>"+
    "[CENTER][SIZE=4][FONT=Times New Roman]Приятной игры на сервере [COLOR=#ff7b00] Bratsk (74).[/COLOR][/FONT][/SIZE][/CENTER]",
	  prefix: OKAY_PREFIX,
	  status: false,
	},
    {
	  title: 'Орг-ция отказана',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=4][FONT=Georgia][CENTER][COLOR=rgb(138, 43, 226)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/rmf4CLVn/1.png[/img][/url]<br>"+
		"[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Основываясь на детальном изучении вашей RolePlay организации, Я выношу следующий вердикт.[/COLOR][/CENTER][/FONT]" +
                  "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Ваша RolePlay организация получает статус[/COLOR][/FONT] [FONT=Times New Roman][COLOR=rgb(255, 0, 0)]Отказано[/COLOR][/FONT][/CENTER]<p>" +
             "[CENTER][FONT=Book Antiqua][COLOR=#d1d5d8]Ознакомиться с правилами подачи RolePlay организацией можно тут:[/COlOR] [URL=hhttps://forum.blackrussia.online/threads/bratsk-%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%BE%D0%B7%D0%B4%D0%B0%D0%BD%D0%B8%D1%8F-%D0%BD%D0%B5%D0%BE%D1%84%D0%B8%D1%86%D0%B8%D0%B0%D0%BB%D1%8C%D0%BD%D0%BE%D0%B9-roleplay-%D0%BE%D1%80%D0%B3%D0%B0%D0%BD%D0%B8%D0%B7%D0%B0%D1%86%D0%B8%D0%B8.12543136/] «Правила подачи RolePlay организаций»[/URL][/FONT][/CENTER]<p>" +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/rmf4CLVn/1.png[/img]<p>" +
		  "[CENTER][SIZE=4][COLOR=#ff0a0a][ICODE]Закрыто[/ICODE][/COLOR][/CENTER]<br>"+
    "[CENTER][SIZE=4][FONT=Times New Roman]Приятной игры на сервере [COLOR=#ff7b00] Bratsk (74).[/COLOR][/FONT][/SIZE][/CENTER]",
	  prefix: FAIL_PREFIX,
	  status: false,
	},
];

$(document).ready(() => {
	// Загрузка скрипта для обработки шаблонов
	$('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');


// addButton('На рассмотрение', 'pin');
// addButton('Тех. спецу', 'tech');
	addButton('На рассмотрении', 'pin', 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255,165,0, 0.5);');
    addButton('Отказано', 'unaccept', 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5);')
    addButton('Одобрено', 'accepted', 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 251, 152, 0.5);')
	addButton('Тех. спецу', 'tech', 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(0,0,255, 0.5);');
	addAnswers();

	// Поиск информации о теме
	const threadData = getThreadData();

 $('button#pin').click(() => editThreadData(WAIT_PREFIX, true));
 $('button#tech').click(() => editThreadData(TECH_PREFIX, true));
 $('button#accepted').click(() => editThreadData(OKAY_PREFIX, false));
 $('button#watch').click(() => editThreadData(WATCH_PREFIX, false));
 $('button#close').click(() => editThreadData(CLOSE_PREFIX, false));
 $('button#unaccept').click(() => editThreadData(FAIL_PREFIX, false));

	$(`button#selectAnswer`).click(() => {
	XF.alert(buttonsMarkup(buttons), null, 'ОТВЕТЫ');
	buttons.forEach((btn, id) => {
	if (id > 1) {
	$(`button#answers-${id}`).click(() => pasteContent(id, threadData, true));
	}
	else {
	$(`button#answers-${id}`).click(() => pasteContent(id, threadData, false));
	}
	});
	});
	});

    function addButton(name, id, style) {
         $('.button--icon--reply').before(
	`<button type="button" class="button--primary button rippleButton" id="${id}" style="${style}">${name}</button>`,
	);
	}
	function addAnswers() {
		$('.button--icon--reply').after(`<button type="button" class="button--cta uix_quickReply--button button button--icon button--icon--write rippleButton" id="selectAnswer" style="oswald: 3px; margin-left: 5px; margin-top: 10px; border-radius: 13px;">ОТВЕТЫ</button>`,
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
	 3 < hours && hours <=9
	  ? 'Доброе утро'
	  : 9 <hours && hours <= 15
	  ? 'Добрый день'
	  : 15 <hours && hours <= 21
	  ? 'Добрый вечер'
      : 21 <hours && hours <= 3
	  ? 'Доброй ночи'
	  : 'Доброй ночи'
}
    };
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