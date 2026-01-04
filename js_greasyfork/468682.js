// ==UserScript==
// @name         Blue | Скрипт для Кураторов Форума
// @namespace    https://greasyfork.org/ru/users/1032828-crystalby
// @version      14.8
// @description  Идеи по улучшения скрипта в лс https://vk.com/asco771 !!! Частые обновления!!! 
// @author       Asco_Winner
// @match        https://forum.blackrussia.online/threads/*
// @include      https://forum.blackrussia.online/threads/
// @icon         https://icons.iconarchive.com/icons/papirus-team/papirus-apps/48/emerald-theme-manager-icon-icon.png
// @grant        none
// @license 	 MIT
// @downloadURL https://update.greasyfork.org/scripts/468682/Blue%20%7C%20%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%9A%D1%83%D1%80%D0%B0%D1%82%D0%BE%D1%80%D0%BE%D0%B2%20%D0%A4%D0%BE%D1%80%D1%83%D0%BC%D0%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/468682/Blue%20%7C%20%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%9A%D1%83%D1%80%D0%B0%D1%82%D0%BE%D1%80%D0%BE%D0%B2%20%D0%A4%D0%BE%D1%80%D1%83%D0%BC%D0%B0.meta.js
// ==/UserScript==
 
(function () {
    'use strict';
    const UNACCEPT_PREFIX = 4; // Префикс "Отказано"
    const ACCEPT_PREFIX = 8; // Префикс "Одобрено"
    const RESHENO_PREFIX = 6; // Префикс "Решено"
    const OJIDANIE_PREFIX = 14; // Префикс "Ожидание"
    const PIN_PREFIX = 2; // Префикс "На рассмотрении"
    const GA_PREFIX = 12; // Префикс "Главному Администратору"
    const COMMAND_PREFIX = 10; // Префикс "Команде Проекта"
    const WATCHED_PREFIX = 9; // Префикс "Рассмотрено"
    const CLOSE_PREFIX = 7; // Префикс "Закрыто"
    const TEX_PREFIX = 13; // Префикс "Тех специалисту"
    const SPECY_PREFIX=11; // Префикс "Специальному Администратору"
    const buttons = [
        {
           title: '---------------------------------------> Передача <---------------------------------------------------------------',
        },
        {
           title: 'Свой ответ', 
           content:
            "[CENTER][FONT=Verdana][Color=Yellow]{{greeting}}, уважаемый(-ая) {{ user.name }}.<br><br>"+
            "Ответ.<br>"+
            '[Color=Blue]Приятной игры на Blue. [/FONT][/CENTER]', 
            prefix: OJIDANIE_PREFIX, 
            status: false, 
         },
   {
            title: `На рассмотрении`,
	  content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=Lime]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/I] <br><br>' +
		 "[I][FONT=times new roman][COLOR=Lime][SIZE=5]Ваша жалоба взята на рассмотрении просьба ожидать ответа от администрации и не создавать копии этой темы [Color=Red]На рассмотрении. [Color=Blue]Blue[/COLOR][/FONT][/CENTER]<br><br>" +
	         "[url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/bvzbc50C/download-4.gif[/img][/url]<br>",
	     prefix: PIN_PREFIX,
	     status: true,
	       },
{
            title: 'Тех специалист',
            content:
            "[CENTER][FONT=Verdana][Color=Yellow]{{greeting}}, уважаемый(-ая) {{ user.name }}.<br><br>"+
            "Ваша жалоба передана на рассмотрение тех специалисту нашего сервера .<br>"+
            '[COLOR=RED]Ожидайте. [color=blue] BLUE[/FONT][/CENTER]',
            prefix: TEX_PREFIX,
            status: true,
        },
        {
            title: 'ГКФ/ЗГКФ',
            content:
            "[CENTER][FONT=Verdana][Color=Yellow]{{greeting}}, уважаемый(-ая) {{ user.name }}.<br><br>"+
            "Ваша жалоба передана на рассмотрение Главному Куратору Форума/Заместителю главного куратора Форума нашего сервера .<br>"+
            '[COLOR=RED]Ожидайте.[/FONT][/CENTER]',
            prefix: PIN_PREFIX,
            status: true,
        },
        {
         title: 'ГА',
            content:
            "[CENTER][FONT=Verdana][Color=Yellow]{{greeting}}, уважаемый(-ая) {{ user.name }}.<br><br>"+
            "Ваша жалоба передана на рассмотрение Главному Администратору нашего сервера [Color=ReD]@Rodion_Sergeev🌠.<br>"+
            '[COLOR=Purple]Ожидайте.[/FONT][/CENTER]',
            prefix: GA_PREFIX,
            status: true,
        },
        {
         title: 'Спецу',
            content:
            "[CENTER][FONT=Verdana][Color=Yellow]{{greeting}}, уважаемый(-ая) {{ user.name }}.<br><br>"+
            "Ваша жалоба передана на рассмотрение Специальному Администратору [Color=ReD]@Sander_Kligan🌠.<br>"+
            '[COLOR=Purple]Ожидайте.[/FONT][/CENTER]',
            prefix: SPECY_PREFIX,
            status: true,
        },
        {
         title: 'Команде Проекта',
            content:
            "[CENTER][FONT=Verdana][Color=Yellow]{{greeting}}, уважаемый(-ая) {{ user.name }}.<br><br>"+
            "Ваша жалоба передана на рассмотрение Команде Проекта🔱.<br>"+
            '[COLOR=Purple]Ожидайте.[/FONT][/CENTER]',
            prefix: COMMAND_PREFIX,
            status: true,
        },
        {
       title: '-------------- БИОГРАФИИ -----------------', 
           }, 
           {
            title: 'Био одобрено',
            content:
            "[CENTER][FONT=Verdana][Color=Yellow]{{greeting}}, уважаемый(-ая) {{ user.name }}.<br><br>"+
            "Биография получает статус одобрено.<br>"+
"[B][CENTER][COLOR=Yellow]Приятной игры на  [COLOR=blue]BLUE[/COLOR].<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/QCcBL2G0/image.gif [/img][/url]<br>",
            prefix: ACCEPT_PREFIX,
            status: false,
         }, 
         {
            title: 'Био отказ(3 лицо) ',
            content:
            "[CENTER][FONT=Verdana] [Color=Yellow] {{greeting}}, уважаемый(-ая) {{ user.name }}.<br><br>"+
            "Биография получает статус отказано так как она написана от 3-го лица.<br>"+
                         "[B][CENTER][COLOR=Red]Приятной игры на  [COLOR=blue]BLUE[/COLOR].<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/yNNSJpc8/2022-12-09-15-49-54.gif[/img][/url]<br>",
            prefix:  UNACCEPT_PREFIX,
            status: false,
         }, 
         {
           title: 'Био отказ(нет семьи)',
            content:
            "[CENTER][FONT=Verdana] [Color=Yellow] {{greeting}}, уважаемый(-ая) {{ user.name }}.<br><br>"+
            "Биография получает статус отказано т.к в графе Семья необходимо расписать имена и фамилии ближайших родственников..<br>"+
                         "[B][CENTER][COLOR=Red]Приятной игры на  [COLOR=blue]BLUE[/COLOR].<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/yNNSJpc8/2022-12-09-15-49-54.gif[/img][/url]<br>",
            prefix:  UNACCEPT_PREFIX,
            status: false,
         }, 
         {
     title: 'На доработку',
            content:
            "[CENTER][FONT=Verdana] [Color=Yellow] {{greeting}}, уважаемый(-ая) {{ user.name }}.<br><br>"+
            "Даю вам 24 часа на дополнение биографии в противном случае будет отказано.<br>"+
            '[COLOR=Lime]На доработке.[/FONT][/CENTER]',
            prefix:  PIN_PREFIX,
            status:  true,
         }, 
         {
        title: ' |Не дополнил |',
            content:
            "[CENTER][FONT=Verdana] [Color=Yellow] {{greeting}}, уважаемый(-ая) {{ user.name }}.<br><br>"+
            "Время на дополнение прошло.<br>"+
                         "[B][CENTER][COLOR=Red]Приятной игры на  [COLOR=blue]BLUE[/COLOR].<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/yNNSJpc8/2022-12-09-15-49-54.gif[/img][/url]<br>",
            prefix:  UNACCEPT_PREFIX,
            status: false,
         }, 
         {
    title: ' | Уже есть одобренная| ',
            content:
            "[CENTER][FONT=Verdana] [Color=Yellow] {{greeting}}, уважаемый(-ая) {{ user.name }}.<br><br>"+
            "Биография получает статус отказано , так как у вас уже есть одобренная биография.<br>"+
                         "[B][CENTER][COLOR=Red]Приятной игры на  [COLOR=blue]BLUE[/COLOR].<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/yNNSJpc8/2022-12-09-15-49-54.gif[/img][/url]<br>",
            prefix:  UNACCEPT_PREFIX,
            status: false,
         }, 
         {
            
             title: '| Семья не полностью |',
        content:
          "[B][CENTER][COLOR=Yellow][ICODE] {{greeting}}, уважаемый{{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
          "[B][CENTER][COLOR=lavender]Ваша RolePlay - биография отказана т.к в пункте (Семья) не достаточно информации. Внимательно прочитайте правила создания RP - биографий закрепленные в данном разделе. <br>"+
       "[B][CENTER][COLOR=lavender]Приятной игры на  [COLOR=blue]BLUE[/COLOR].<br><br>",
"[url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url]<br>":
		"[url=https://postimages.org/][img]https://i.postimg.cc/yNNSJpc8/2022-12-09-15-49-54.gif[/img][/url]<br>",
        prefix: UNACCEPT_PREFIX,
        status: false,
      },
       {
        title: 'Био отказ(нет 18) ',
            content:
            "[CENTER][FONT=Verdana] [Color=Yellow] {{greeting}}, уважаемый(-ая) {{ user.name }}.<br><br>"+
            "Биография получает статус отказано так как вашему персонажу нет 18 лет.<br>"+
                         "[B][CENTER][COLOR=Red]Приятной игры на  [COLOR=blue]BLUE[/COLOR].<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/yNNSJpc8/2022-12-09-15-49-54.gif[/img][/url]<br>",
            prefix:  UNACCEPT_PREFIX,
            status: false,
         }, 
         {
             
            title: 'Био отказ(нет пункта возраст)',
            content:
            "[CENTER][FONT=Verdana] [Color=Blue] {{greeting}}, уважаемый(-ая) {{ user.name }}.<br><br>"+
            "Биография получает статус отказано так как вашей биографии нет пункта возраст.<br>"+
                         "[B][CENTER][COLOR=Red]Приятной игры на  [COLOR=blue]BLUE[/COLOR].<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/yNNSJpc8/2022-12-09-15-49-54.gif[/img][/url]<br>",
            prefix:  UNACCEPT_PREFIX,
            status: false,
       
         }, 
         {

title: 'Био отказ(nRP имя) ',
            content:
            "[CENTER][FONT=Verdana] [Color=Yellow] {{greeting}}, уважаемый(-ая) {{ user.name }}.<br><br>"+
            "Биография получает статус отказано так как у вашего персонажа nonRP имя.<br>"+
                         "[B][CENTER][COLOR=Red]Приятной игры на  [COLOR=blue]BLUE[/COLOR].<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/yNNSJpc8/2022-12-09-15-49-54.gif[/img][/url]<br>",
            prefix:  UNACCEPT_PREFIX,
            status: false,
         }, 
         {
            title: 'Био отказ(нет пункта Детство и Юность) ',
            content:
            "[CENTER][FONT=Verdana] [Color=Yellow] {{greeting}}, уважаемый(-ая) {{ user.name }}.<br><br>"+
            "Биография получает статус отказано так как в ней отсутствует пункт Детство и Юность.<br>"+
                         "[B][CENTER][COLOR=Red]Приятной игры на  [COLOR=blue]BLUE[/COLOR].<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/yNNSJpc8/2022-12-09-15-49-54.gif[/img][/url]<br>",
            prefix:  UNACCEPT_PREFIX,
            status: false,
         }, 
         {
            title: 'Био отказ(нет пункта Взрослая жизнь (включая настоящее)) ',
            content:
            "[CENTER][FONT=Verdana] [Color=Yellow] {{greeting}}, уважаемый(-ая) {{ user.name }}.<br><br>"+
            "Биография получает статус отказано так как в ней отсутствует пункт Взрослая жизнь (включаяя настоящее.<br>"+
            
             "[B][CENTER][COLOR=Red]Приятной игры на  [COLOR=blue]BLUE[/COLOR].<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/yNNSJpc8/2022-12-09-15-49-54.gif[/img][/url]<br>",
            prefix:  UNACCEPT_PREFIX,
            status: false,
         }, 
         {
            title: 'Био отказ(нет пункта Хобби) ',
            content:
            "[CENTER][FONT=Verdana] [Color=Yellow] {{greeting}}, уважаемый(-ая) {{ user.name }}.<br><br>"+
            "Биография получает статус отказано так как в ней отсутствует пункт Хобби.<br>"+
                         "[B][CENTER][COLOR=Red]Приятной игры на  [COLOR=blue]BLUE[/COLOR].<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/yNNSJpc8/2022-12-09-15-49-54.gif[/img][/url]<br>",
            prefix:  UNACCEPT_PREFIX,
            status: false,
         }, 
         {
           
            title: 'Био отказ(грамм. ошибки)',
            content:
            "[CENTER][FONT=Verdana] [Color=Yellow] {{greeting}}, уважаемый(-ая) {{ user.name }}.<br><br>"+
            "Биография получает статус отказано так как в ней есть грамматические ошибки , создайте новую тему и исправьте ошибки.<br>"+
                         "[B][CENTER][COLOR=Red]Приятной игры на  [COLOR=blue]BLUE[/COLOR].<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/yNNSJpc8/2022-12-09-15-49-54.gif[/img][/url]<br>",
            prefix: UNACCEPT_PREFIX,
            status: false,
         }, 
         {
           title: 'Био отказ(Имя не совпадает) ',
            content:
            "[CENTER][FONT=Verdana] [Color=Yellow] {{greeting}}, уважаемый(-ая) {{ user.name }}.<br><br>"+
            "Биография получает статус отказано так как имя в заголовке не совпадает с именем в биографии.<br>"+
            
             "[B][CENTER][COLOR=Red]Приятной игры на  [COLOR=blue]BLUE[/COLOR].<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/yNNSJpc8/2022-12-09-15-49-54.gif[/img][/url]<br>",
            prefix:  UNACCEPT_PREFIX,
            status: false,
         }, 
         {
             title: 'Био отказано(не по форме)',
            content:
            "[CENTER][FONT=Verdana][Color=Yellow]{{greeting}}, уважаемый(-ая) {{ user.name }}.<br><br>"+
            "Биография получает статус отказано,так как она составлена не по форме.<br>"+
                         "[B][CENTER][COLOR=Red]Приятной игры на  [COLOR=blue]BLUE[/COLOR].<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/yNNSJpc8/2022-12-09-15-49-54.gif[/img][/url]<br>",
            prefix: UNACCEPT_PREFIX,
            status: false,
        },
        {
            title: 'Био отказано(скопировано)',
            content:
            "[CENTER][FONT=Verdana][Color=Yellow]{{greeting}}, уважаемый(-ая) {{ user.name }}.<br><br>"+
            "Биография получает статус отказано,так как она скопировано.<br>"+
                         "[B][CENTER][COLOR=Red]Приятной игры на  [COLOR=blue]BLUE[/COLOR].<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/yNNSJpc8/2022-12-09-15-49-54.gif[/img][/url]<br>",
            prefix: UNACCEPT_PREFIX,
            status: false,
        },
        {
           title: 'Био отказано(дата с рождения с годом) ',
            content:
            "[CENTER][FONT=Verdana][Color=Yellow]{{greeting}}, уважаемый(-ая) {{ user.name }}.<br><br>"+
            "Биография получает статус отказано,так как возвраст персонажа не совпадает с датой рождения.<br>"+
                         "[B][CENTER][COLOR=Red]Приятной игры на  [COLOR=blue]BLUE[/COLOR].<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/yNNSJpc8/2022-12-09-15-49-54.gif[/img][/url]<br>",
            prefix: UNACCEPT_PREFIX,
            status: false,
        },
        {
           title: 'Био отказано(заголовок)',
            content:
            "[CENTER][FONT=Verdana][Color=Yellow]{{greeting}}, уважаемый(-ая) {{ user.name }}.<br><br>"+
            "Биография получает статус отказано,так как она заголовок составлен не по форме.<br>"+
                         "[B][CENTER][COLOR=Red]Приятной игры на  [COLOR=blue]BLUE[/COLOR].<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/yNNSJpc8/2022-12-09-15-49-54.gif[/img][/url]<br>",
            prefix: UNACCEPT_PREFIX,
            status: false,
        },
        {
           title: 'Био отказано(мало инфы)',
            content:
            "[CENTER][FONT=Verdana][Color=Yellow]{{greeting}}, уважаемый(-ая) {{ user.name }}.<br><br>"+
            "Биография получает статус отказано,так как в ней мало Roleplay информации.<br>"+
                         "[B][CENTER][COLOR=Red]Приятной игры на  [COLOR=blue]BLUE[/COLOR].<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/yNNSJpc8/2022-12-09-15-49-54.gif[/img][/url]<br>",
            prefix: UNACCEPT_PREFIX,
            status: false,
        },
        {
          title: '---------------------Roleplay процесс-----------------', 
           } , 
          {
            title: 'DM',
      content:
        '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
        "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Нарушитель буден наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I]<br><br>" +
        "[COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4]2.19.[/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4] Запрещен DM (DeathMatch) — убийство или нанесение урона без веской IC причины[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4] | Jail 60 минут[/SIZE][/FONT][/COLOR]<br><br>" +
        "[LIST]<br><br>" +
        "[*][LEFT][FONT=book antiqua][COLOR=rgb(255, 0, 0)][SIZE=4]Примечание: [/SIZE][/COLOR][COLOR=rgb(209, 213, 216)][SIZE=4]разрешен ответный DM в целях защиты, обязательно иметь видео доказательство в случае наказания администрации, нанесение урона по транспорту также является нарушением данного пункта правил.[/SIZE][/COLOR][/FONT][/LEFT]<br><br>" +
        "[*][LEFT][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4]Примечание: [/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4]нанесение урона с целью защиты особняка или его территории, а также нанесение урона после ДТП не является веской IC причиной, для войны семей предусмотрено отдельное системное мероприятие.[/SIZE][/FONT][/COLOR][/LEFT]<br><br>" +
        "[/LIST]<br><br>" +
        "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA [/SIZE][/FONT][/COLOR][COLOR=Blue]Blue[/COLOR][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4].[/SIZE][/FONT][/COLOR][/I]<br><br>" +
        '[COLOR=rgb(51, 204, 51)][FONT=times new roman][SIZE=4][I]Одобрено.[/I][/SIZE][/FONT][/COLOR]',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
     title: '| Убийство при задержании |',
        content:
          "[B][CENTER][COLOR=#FFFF00][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
          "[B][CENTER][COLOR=lavender]Ваша жалоба была рассмотрена и одобрена, игрок получит следующие наказание.[Spoiler] | [color=lavender] Запрещено целенаправленно убивать преступника во время задержания без весомой Role Play причины.  [color=red]  | Warn [/Spoiler]<br>"+
          "[CENTER][COLOR=lavender] Наказание будет выдано в течение 24 часов.<br>"+
           "[B][CENTER][COLOR=lavender]Приятной игры на  [COLOR=blue]BLUE[/COLOR].<br><br>",
        prefix: ACCEPT_PREFIX,
        status: false,
      },
      {
 title: '| ЕПП фура/инко |',
        content:
          "[B][CENTER][COLOR=#FFFF00][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
          "[B][CENTER][COLOR=lavender]Ваша жалоба была рассмотрена и одобрена, игрок получит следующие наказание.[Spoiler][color=red]2.47 | [color=lavender] Запрещено ездить по полям на грузовом транспорте, инкассаторских машинах (работа дальнобойщика, инкассатора) [color=red]  | Jail 60 минут[/Spoiler]<br>"+
          "[CENTER][COLOR=lavender] Наказание будет выдано в течение 24 часов.<br>"+
       "[B][CENTER][COLOR=lavender]Приятной игры на  [COLOR=blue]BLUE[/COLOR].<br><br>",
        prefix: ACCEPT_PREFIX,
        status: false,
      },
      {
title: '| Системный промо |',
        content:
          "[B][CENTER][COLOR=#FFFF00][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
          "[B][CENTER][COLOR=lavender]Ваша жалоба была проверена и вердикт такой: данный промокод является системным, или был выпущен  разработчиками [/Spoiler]<br>"+
        "[B][CENTER][COLOR=lavender]Приятной игры на  [COLOR=blue]BLUE[/COLOR].<br><br>",
        prefix: UNACCEPT_PREFIX,
        status: false,
      },
      {
title: '| NonRP розыск |',
        content:
          "[B][CENTER][COLOR=#FFFF00][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
          "[B][CENTER][COLOR=lavender]Ваша жалоба была рассмотрена и одобрена, игрок получит следующие наказание.[Spoiler][color=red]* | [color=lavender] Запрещено выдавать розыск без Role Play причины[color=red]  | Warn / Jail 30 минут [/Spoiler]<br>"+
          "[CENTER][COLOR=lavender] Наказание будет выдано в течение 24 часов.<br>"+
       "[B][CENTER][COLOR=lavender]Приятной игры на  [COLOR=blue]BLUE[/COLOR].<br><br>",
        prefix: ACCEPT_PREFIX,
        status: false,
      },
          {
title: '| NonRP эфир |',
        content:
          "[B][CENTER][COLOR=#FFFF00][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
          "[B][CENTER][COLOR=lavender]Ваша жалоба была рассмотрена и одобрена, игрок получит следующие наказание.[Spoiler][color=red]* | [color=lavender] Запрещено проведение эфиров, не соответствующих Role Play правилам и логике[color=red]  | Mute 30 минут[/Spoiler]<br>"+
          "[CENTER][COLOR=lavender] Наказание будет выдано в течение 24 часов.<br>"+
       "[B][CENTER][COLOR=lavender]Приятной игры на  [COLOR=blue]BLUE[/COLOR].<br><br>",
        prefix: ACCEPT_PREFIX,
        status: false,
      },
      {
title: '| NonRP edit |',
        content:
          "[B][CENTER][COLOR=#FFFF00][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
          "[B][CENTER][COLOR=lavender]Ваша жалоба была рассмотрена и одобрена, игрок получит следующие наказание.[Spoiler][color=red]*  [color=lavender] Запрещено редактирование объявлений, не соответствующих ПРО[color=red]  | Mute 30 минут[/Spoiler]<br>"+
          "[CENTER][COLOR=lavender] Наказание будет выдано в течение 24 часов.<br>"+
       "[B][CENTER][COLOR=lavender]Приятной игры на  [COLOR=blue]BLUE[/COLOR].<br><br>",
        prefix: ACCEPT_PREFIX,
        status: false,
      },
  {
     title: 'MG',
      content:
        '[COLOR=Yellow(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
        "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Нарушитель буден наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I]<br><br>" +
        "[COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4]2.18. [/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4]Запрещен MG (MetaGaming) — использование ООС информации, которую Ваш персонаж никак не мог получить в IC процессе[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4] | Mute 30 минут[/SIZE][/FONT][/COLOR]<br><br>" +
        '[LIST]<br><br>' +
        "[*][COLOR=Yellow(255, 0, 0)][FONT=book antiqua][SIZE=4]Примечание: [/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4]использование смайлов в виде символов «))», «=D» запрещено в IC чате.[/SIZE][/FONT][/COLOR]<br><br>" +
        "[*][COLOR=Yellow(255, 0, 0)][FONT=book antiqua][SIZE=4]Примечание:[/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4] телефонное общение также является IC чатом.[/SIZE][/FONT][/COLOR]<br><br>" +
        "[/LIST]<br><br>" +
        "[I][COLOR=Yellow(209, 213, 216)][FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA [/SIZE][/FONT][/COLOR][COLOR=Blue]Blue[/COLOR][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4].[/SIZE][/FONT][/COLOR][/I]<br><br>" +
        '[COLOR=rgb(51, 204, 51)][FONT=times new roman][SIZE=4][I]Одобрено.[/I][/SIZE][/FONT][/COLOR]',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: 'ТК',
      content:
        '[COLOR=Yellow(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
        "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Нарушитель буден наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I]<br><br>" +
        "[COLOR=Yellow(255, 0, 0)][SIZE=4][FONT=book antiqua]2.15.[/FONT][/SIZE][/COLOR][COLOR=rgb(209, 213, 216)][SIZE=4][FONT=book antiqua] Запрещен TK (Team Kill) — убийство члена своей или союзной фракции, организации без наличия какой-либо IC причины[/FONT][/SIZE][/COLOR][COLOR=Yellow(255, 0, 0)][SIZE=4][FONT=book antiqua] | Jail 30 минут / Warn (за два и более убийства)[/FONT][/SIZE][/COLOR]<br><br>" +
        "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA [/SIZE][/FONT][/COLOR][COLOR=Blue]Blue[/COLOR][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4].[/SIZE][/FONT][/COLOR][/I]<br><br>" +
        '[COLOR=rgb(51, 204, 51)][FONT=times new roman][SIZE=4][I]Одобрено.[/I][/SIZE][/FONT][/COLOR]',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: 'SК',
      content:
        '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
        "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Нарушитель буден наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I]<br><br>" +
        "[COLOR=rgb(255, 0, 0)][SIZE=4][FONT=book antiqua]2.16. [/FONT][/SIZE][/COLOR][COLOR=rgb(209, 213, 216)][SIZE=4][FONT=book antiqua]Запрещен SK (Spawn Kill) — убийство или нанесение урона на титульной территории любой фракции / организации, на месте появления игрока, а также на выходе из закрытых интерьеров и около них[/FONT][/SIZE][/COLOR][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=book antiqua] | Jail 30 минут / Warn (за два и более убийства) [/FONT][/SIZE][/COLOR]<br><br>" +
        "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA [/SIZE][/FONT][/COLOR][COLOR=Blue]Blue[/COLOR][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4].[/SIZE][/FONT][/COLOR][/I]<br><br>" +
        '[COLOR=rgb(51, 204, 51)][FONT=times new roman][SIZE=4][I]Одобрено.[/I][/SIZE][/FONT][/COLOR]',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: 'Рынок в ГОСС',
      content:
        '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
        "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Нарушитель буден наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I]<br><br>" +
        "[COLOR=rgb(255, 0, 0)][SIZE=4][FONT=book antiqua]3.22. [/FONT][/SIZE][/COLOR][COLOR=rgb(209, 213, 216)][SIZE=4][FONT=book antiqua]Запрещено публиковать любые объявления в помещениях государственных организаций вне зависимости от чата (IC или OOC) [/FONT][/SIZE][/COLOR][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=book antiqua]| Mute 30 минут[/FONT][/SIZE][/COLOR]<br><br>" +
        '[LIST]<br><br>' +
        "[*][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=book antiqua]Пример: [/FONT][/SIZE][/COLOR][COLOR=rgb(209, 213, 216)][SIZE=4][FONT=book antiqua]в помещении центральной больницы писать в чат: «Продам эксклюзивную шапку дешево!!!»[/FONT][/SIZE][/COLOR]<br><br>" +
        "[/LIST]<br><br>" +
        "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA [/SIZE][/FONT][/COLOR][COLOR=Blue]Blue[/COLOR][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4].[/SIZE][/FONT][/COLOR][/I]<br><br>" +
        '[COLOR=rgb(51, 204, 51)][FONT=times new roman][SIZE=4][I]Одобрено.[/I][/SIZE][/FONT][/COLOR]',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: 'CAPS',
      content:
        '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
        "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Нарушитель буден наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I]<br><br>" +
        "[COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4]3.02. [/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4]Запрещено использование верхнего регистра (CapsLock) при написании любого текста в любом чате[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4] | Mute 30 минут [/SIZE][/FONT][/COLOR]<br><br>" +
        "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA [/SIZE][/FONT][/COLOR][COLOR=Blue]Blue[/COLOR][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4].[/SIZE][/FONT][/COLOR][/I]<br><br>" +
        '[COLOR=rgb(51, 204, 51)][FONT=times new roman][SIZE=4][I]Одобрено.[/I][/SIZE][/FONT][/COLOR]',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: 'DB',
      content:
        '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
        "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Нарушитель буден наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I]<br><br>" +
        "[COLOR=rgb(255, 0, 0)][FONT=book antiqua]2.13. [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua]Запрещен DB (DriveBy) — намеренное убийство / нанесение урона без веской IC причины на любом виде транспорта [/FONT][/COLOR][COLOR=rgb(255, 0, 0)][FONT=book antiqua]| Jail 30 минут[/FONT][/COLOR]<br><br>" +
        "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA [/SIZE][/FONT][/COLOR][COLOR=Blue]Blue[/COLOR][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4].[/SIZE][/FONT][/COLOR][/I]<br><br>" +
        '[COLOR=rgb(51, 204, 51)][FONT=times new roman][SIZE=4][I]Одобрено.[/I][/SIZE][/FONT][/COLOR]',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: 'NRP обман',
      content:
        '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
        "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Нарушитель буден наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I]<br><br>" +
        "[FONT=book antiqua][SIZE=4][COLOR=rgb(255, 0, 0)]2.05.[/COLOR][COLOR=rgb(209, 213, 216)] Запрещены любые OOC обманы и их попытки, а также любые IC обманы с нарушением Role Play правил и логики[/COLOR][COLOR=rgb(255, 0, 0)] | PermBan[/COLOR][/SIZE][/FONT]<br><br>" +
        '[LIST]<br><br>' +
        "[*][FONT=book antiqua][SIZE=4][COLOR=rgb(255, 0, 0)]Примечание: [/COLOR][COLOR=rgb(209, 213, 216)]после IC договоренности получить денежные средства и сразу же выйти из игры с целью обмана игрока, или же, договорившись через OOC чат (/n), точно также получить денежные средства и сразу же выйти из игры и тому подобные ситуации.[/COLOR][/SIZE][/FONT]<br><br>" +
        "[*][FONT=book antiqua][SIZE=4][COLOR=rgb(255, 0, 0)]Примечание: [/COLOR][COLOR=rgb(209, 213, 216)]разблокировка игрового аккаунта нарушителя будет возможна только в случае возврата полной суммы причиненного ущерба, либо непосредственно самого имущества, которое было украдено (по решению обманутой стороны).[/COLOR][/SIZE][/FONT]<br><br>" +
        "[/LIST]<br><br>" +
        "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA [/SIZE][/FONT][/COLOR][COLOR=Blue]Blue[/COLOR][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4].[/SIZE][/FONT][/COLOR][/I]<br><br>" +
        '[COLOR=rgb(51, 204, 51)][FONT=times new roman][SIZE=4][I]Одобрено.[/I][/SIZE][/FONT][/COLOR]',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
           title: 'NRP поведение',
      content:
        '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
        "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Нарушитель буден наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I]<br><br>" +
        "[SIZE=4][COLOR=rgb(255, 0, 0)][FONT=book antiqua]2.01. [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua]Запрещено поведение, нарушающее нормы процессов Role Play режима игры[/FONT][/COLOR][COLOR=rgb(255, 0, 0)][FONT=book antiqua] | Jail 30 минут[/FONT][/COLOR][/SIZE]<br><br>" +
        '[LIST]<br><br>' +
        "[*][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=book antiqua]Примечание: [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua]ездить на крышах транспортных средств, бегать или ходить по столам в казино, целенаправленная провокация сотрудников правоохранительных органов с целью развлечения, целенаправленная помеха в проведении различных собеседований и так далее.[/FONT][/COLOR][/SIZE]<br><br>" +
        "[/LIST]<br><br>" +
        "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA [/SIZE][/FONT][/COLOR][COLOR=Blue]Blue[/COLOR][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4].[/SIZE][/FONT][/COLOR][/I]<br><br>" +
        '[COLOR=rgb(51, 204, 51)][FONT=times new roman][SIZE=4][I]Одобрено.[/I][/SIZE][/FONT][/COLOR]',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: 'Уход от RP',
      content:
        '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
        "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Нарушитель буден наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I]<br><br>" +
        "[COLOR=rgb(255, 0, 0)][SIZE=4][FONT=book antiqua]2.02. [/FONT][/SIZE][/COLOR][COLOR=rgb(209, 213, 216)][SIZE=4][FONT=book antiqua]Запрещено целенаправленно уходить от Role Play процесса всеразличными способами [/FONT][/SIZE][/COLOR][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=book antiqua]| Jail 30 минут / Warn[/FONT][/SIZE][/COLOR]<br><br>" +
        '[LIST]<br><br>' +
        "[*][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=book antiqua]Примечание: [/FONT][/SIZE][/COLOR][COLOR=rgb(209, 213, 216)][SIZE=4][FONT=book antiqua]например, уходить в AFK при остановке транспортного средства правоохранительными органами, выходить из игры для избежания смерти, выходить из игры во время процесса задержания / ареста, полное игнорирование отыгровок другого игрока, которые так или иначе могут коснуться Вашего персонажа и так далее.[/FONT][/SIZE][/COLOR]<br><br>" +
        "[/LIST]<br><br>" +
        "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA [/SIZE][/FONT][/COLOR][COLOR=Blue]Blue[/COLOR][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4].[/SIZE][/FONT][/COLOR][/I]<br><br>" +
        '[COLOR=rgb(51, 204, 51)][FONT=times new roman][SIZE=4][I]Одобрено.[/I][/SIZE][/FONT][/COLOR]',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: 'NRP Drive',
      content:
        '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
        "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Нарушитель буден наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I]<br><br>" +
        "[COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4]2.03. [/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4]Запрещен NonRP Drive — вождение любого транспортного средства в невозможных для него условиях, а также вождение в неправдоподобной манере[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4] | Jail 30 минут[/SIZE][/FONT][/COLOR]<br><br>" +
        '[LIST]<br><br>' +
        "[*][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4]Примечание:[/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4] езда на скутере по горам, езда на любом транспортном средстве по встречным полосам, нарушая все правила дорожного движения без какой-либо причины, намеренное создание аварийных ситуаций на дорогах и так далее.[/SIZE][/FONT][/COLOR]<br><br>" +
        "[/LIST]<br><br>" +
        "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA [/SIZE][/FONT][/COLOR][COLOR=Blue]Blue[/COLOR][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4].[/SIZE][/FONT][/COLOR][/I]<br><br>" +
        '[COLOR=rgb(51, 204, 51)][FONT=times new roman][SIZE=4][I]Одобрено.[/I][/SIZE][/FONT][/COLOR]',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: 'Аморал',
      content:
        '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
        "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Нарушитель буден наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I]<br><br>" +
        "[SIZE=4][FONT=book antiqua][COLOR=rgb(255, 0, 0)]2.08. [/COLOR][COLOR=rgb(209, 213, 216)]Запрещена любая форма аморальных действий сексуального характера в сторону игроков[/COLOR][COLOR=rgb(255, 0, 0)] | Jail 30 минут / Warn[/COLOR][/FONT][/SIZE]<br><br>" +
        '[LIST]<br><br>' +
        "[*][SIZE=4][FONT=book antiqua][COLOR=rgb(255, 0, 0)]Исключение: [/COLOR][COLOR=rgb(209, 213, 216)]обоюдное согласие обеих сторон.[/COLOR][/FONT][/SIZE]<br><br>" +
        "[/LIST]<br><br>" +
        "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA [/SIZE][/FONT][/COLOR][COLOR=Blue]Blue[/COLOR][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4].[/SIZE][/FONT][/COLOR][/I]<br><br>" +
        '[COLOR=rgb(51, 204, 51)][FONT=times new roman][SIZE=4][I]Одобрено.[/I][/SIZE][/FONT][/COLOR]',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: 'Слив склада',
      content:
        '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
        "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Нарушитель буден наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I]<br><br>" +
        "[COLOR=rgb(255, 0, 0)][SIZE=4][FONT=book antiqua]2.09.[/FONT][/SIZE][/COLOR][COLOR=rgb(209, 213, 216)][SIZE=4][FONT=book antiqua] Запрещено сливать склад фракции / семьи путем взятия большого количестве ресурсов, или же брать больше, чем разрешили на самом деле[/FONT][/SIZE][/COLOR][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=book antiqua] | Ban 15 - 30 дней / PermBan[/FONT][/SIZE][/COLOR]<br><br>" +
        '[LIST]<br><br>' +
        "[*][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=book antiqua]Примечание:[/FONT][/SIZE][/COLOR][COLOR=rgb(209, 213, 216)][SIZE=4][FONT=book antiqua] разблокировка игрового аккаунта нарушителя будет возможна только в случае возврата полной суммы причиненного ущерба (по решению обманутой стороны).[/FONT][/SIZE][/COLOR]<br><br>" +
        "[/LIST]<br><br>" +
        "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA [/SIZE][/FONT][/COLOR][COLOR=Blue]Blue[/COLOR][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4].[/SIZE][/FONT][/COLOR][/I]<br><br>" +
        '[COLOR=rgb(51, 204, 51)][FONT=times new roman][SIZE=4][I]Одобрено.[/I][/SIZE][/FONT][/COLOR]',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: 'PG',
      content:
        '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
        "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Нарушитель буден наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I]<br><br>" +
        "[SIZE=4][FONT=book antiqua][COLOR=rgb(255, 0, 0)]2.17. [/COLOR][COLOR=rgb(209, 213, 216)]Запрещен PG (PowerGaming) — присвоение свойств персонажу, не соответствующих реальности, отсутствие страха за свою жизнь [/COLOR][COLOR=rgb(255, 0, 0)]| Jail 30 минут[/COLOR][/FONT][/SIZE]<br><br>" +
        "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA [/SIZE][/FONT][/COLOR][COLOR=Blue]Blue[/COLOR][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4].[/SIZE][/FONT][/COLOR][/I]<br><br>" +
        '[COLOR=rgb(51, 204, 51)][FONT=times new roman][SIZE=4][I]Одобрено.[/I][/SIZE][/FONT][/COLOR]',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: 'Mass DM',
      content:
        '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
        "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Нарушитель буден наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I]<br><br>" +
        "[FONT=book antiqua][SIZE=4][COLOR=rgb(255, 0, 0)]2.20. [/COLOR][COLOR=rgb(209, 213, 216)]Запрещен Mass DM (Mass DeathMatch) — убийство или нанесение урона без веской IC причины трем игрокам и более[/COLOR][COLOR=rgb(255, 0, 0)] | Warn / Ban 7 - 15 дней[/COLOR] [/SIZE][/FONT]<br><br>" +
        "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA [/SIZE][/FONT][/COLOR][COLOR=Blue]Blue[/COLOR][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4].[/SIZE][/FONT][/COLOR][/I]<br><br>" +
        '[COLOR=rgb(51, 204, 51)][FONT=times new roman][SIZE=4][I]Одобрено.[/I][/SIZE][/FONT][/COLOR]',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: 'Bagouse',
      content:
        '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
        "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Нарушитель буден наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I]<br><br>" +
        "[SIZE=4][FONT=book antiqua][COLOR=rgb(255, 0, 0)]2.21.[/COLOR][COLOR=rgb(209, 213, 216)] Запрещено пытаться обходить игровую систему или использовать любые баги сервера[/COLOR][COLOR=rgb(255, 0, 0)] | Ban 15 - 30 дней / PermBan[/COLOR][/FONT][/SIZE]<br><br>" +
        "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA [/SIZE][/FONT][/COLOR][COLOR=Blue]Blue[/COLOR][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4].[/SIZE][/FONT][/COLOR][/I]<br><br>" +
        '[COLOR=rgb(51, 204, 51)][FONT=times new roman][SIZE=4][I]Одобрено.[/I][/SIZE][/FONT][/COLOR]',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: 'Bagouse Anim',
      content:
        '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
        "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Нарушитель буден наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I]<br><br>" +
        "[SIZE=4][FONT=book antiqua][COLOR=rgb(255, 0, 0)]2.55. [/COLOR][COLOR=rgb(209, 213, 216)]Запрещается багоюз связанный с анимацией в любых проявлениях. [/COLOR][COLOR=rgb(255, 0, 0)]| Jail 60 / 120 минут[/COLOR][/FONT][/SIZE]<br><br>" +
        '[LIST]<br><br>' +
        "[*][SIZE=4][FONT=book antiqua][COLOR=rgb(255, 0, 0)]Пример: [/COLOR][COLOR=rgb(209, 213, 216)]если игрок, используя баг, убирает ограничение на использование оружия в зеленой зоне, сбивает темп стрельбы, либо быстро перемещается во время войны за бизнес или во время перестрелки на мероприятии с семейными контейнерами, последует наказание в виде Jail на 120 минут. Данное наказание используется в случаях, когда, используя ошибку, было получено преимущество перед другими игроками.[/COLOR][/FONT][/SIZE]<br><br>" +
        "[*][SIZE=4][FONT=book antiqua][COLOR=rgb(255, 0, 0)]Пример: [/COLOR][COLOR=rgb(209, 213, 216)]если игрок использует баги, связанные с анимацией, и при этом не влияет на игровой процесс других игроков, а также не получает преимущество перед другими игроками, последует наказание в виде Jail на 60 минут.[/COLOR][/FONT][/SIZE]<br><br>" +
        "[/LIST]<br><br>" +
        "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA [/SIZE][/FONT][/COLOR][COLOR=Blue]Blue[/COLOR][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4].[/SIZE][/FONT][/COLOR][/I]<br><br>" +
        '[COLOR=rgb(51, 204, 51)][FONT=times new roman][SIZE=4][I]Одобрено.[/I][/SIZE][/FONT][/COLOR]',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: 'OOC оск',
      content:
        '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
        "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Нарушитель буден наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I]<br><br>" +
        "[FONT=book antiqua][SIZE=4][COLOR=rgb(255, 0, 0)]3.03. [/COLOR][COLOR=rgb(209, 213, 216)]Любые формы оскорблений, издевательств, расизма, дискриминации, религиозной враждебности, сексизма в OOC чате запрещены[/COLOR][COLOR=rgb(255, 0, 0)] | Mute 30 минут[/COLOR] [/SIZE][/FONT]<br><br>" +
        "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA [/SIZE][/FONT][/COLOR][COLOR=blue]Blue[/COLOR][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4].[/SIZE][/FONT][/COLOR][/I]<br><br>" +
        '[COLOR=rgb(51, 204, 51)][FONT=times new roman][SIZE=4][I]Одобрено.[/I][/SIZE][/FONT][/COLOR]',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: 'Упом род',
      content:
        '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
        "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Нарушитель буден наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I]<br><br>" +
        "[FONT=book antiqua][SIZE=4][COLOR=rgb(255, 0, 0)]3.04. [/COLOR][COLOR=rgb(209, 213, 216)]Запрещено оскорбление или косвенное упоминание родных вне зависимости от чата (IC или OOC) [/COLOR][COLOR=rgb(255, 0, 0)]| Mute 120 минут / Ban 7 - 15 дней[/COLOR][/SIZE][/FONT]<br><br>" +
        '[LIST]<br><br>' +
        "[*][FONT=book antiqua][SIZE=4][COLOR=rgb(255, 0, 0)]Примечание:[/COLOR][COLOR=rgb(209, 213, 216)] термин «MQ» расценивается, как упоминание родных.[/COLOR][/SIZE][/FONT]<br><br>" +
        "[*][FONT=book antiqua][SIZE=4][COLOR=rgb(255, 0, 0)]Исключение: [/COLOR][COLOR=rgb(209, 213, 216)]если упоминание родных было совершено в ходе Role Play процесса и не содержало в себе прямого или завуалированного оскорбления.[/COLOR][/SIZE][/FONT]<br><br>" +
        "[/LIST]<br><br>" +
        "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA [/SIZE][/FONT][/COLOR][COLOR=BLue]Blue[/COLOR][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4].[/SIZE][/FONT][/COLOR][/I]<br><br>" +
        '[COLOR=rgb(51, 204, 51)][FONT=times new roman][SIZE=4][I]Одобрено.[/I][/SIZE][/FONT][/COLOR]',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
         title: 'Flood',
      content:
        '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
        "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Нарушитель буден наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I]<br><br>" +
        "[COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4]3.05.[/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4] Запрещен флуд — 3 и более повторяющихся сообщений от одного и того же игрока[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4] | Mute 30 минут[/SIZE][/FONT][/COLOR]<br><br>" +
        "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA [/SIZE][/FONT][/COLOR][COLOR=Blue]Blue[/COLOR][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4].[/SIZE][/FONT][/COLOR][/I]<br><br>" +
        '[COLOR=rgb(51, 204, 51)][FONT=times new roman][SIZE=4][I]Одобрено.[/I][/SIZE][/FONT][/COLOR]',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: 'IC оск (секс. хар-ра)',
      content:
        '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
        "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Нарушитель буден наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I]<br><br>" +
        "[COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4]3.07.[/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4] Запрещены совершенно любые оскорбления или действия, порочащие честь и достоинства, несущие в себе подтекст сексуального характера вне зависимости от чата[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4] | Mute 30 минут[/SIZE][/FONT][/COLOR]<br><br>" +
        '[LIST]<br><br>' +
        "[*][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4]Примечание: [/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4]«дырка», «шмара», «ведро», «мадагаскарский присосконог», «свиноногий бандикут», «скорострел» и так далее.[/SIZE][/FONT][/COLOR]<br><br>" +
        "[/LIST]<br><br>" +
        "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA [/SIZE][/FONT][/COLOR][COLOR=Blue]Blue[/COLOR][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4].[/SIZE][/FONT][/COLOR][/I]<br><br>" +
        '[COLOR=rgb(51, 204, 51)][FONT=times new roman][SIZE=4][I]Одобрено.[/I][/SIZE][/FONT][/COLOR]',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: 'Слив Глобального чата',
      content:
        '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
        "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Нарушитель буден наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I]<br><br>" +
        "[COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4]3.08. [/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4]Запрещены любые формы «слива» посредством использования глобальных чатов [/SIZE][/FONT][/COLOR][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4]| PermBan[/SIZE][/FONT][/COLOR]<br><br>" +
        "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA [/SIZE][/FONT][/COLOR][COLOR=Blue]Blue[/COLOR][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4].[/SIZE][/FONT][/COLOR][/I]<br><br>" +
        '[COLOR=rgb(51, 204, 51)][FONT=times new roman][SIZE=4][I]Одобрено.[/I][/SIZE][/FONT][/COLOR]',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: 'Угроза о наказ',
      content:
        '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
        "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Нарушитель буден наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I]<br><br>" +
        "[SIZE=4][FONT=book antiqua][COLOR=rgb(255, 0, 0)]3.09.[/COLOR][COLOR=rgb(209, 213, 216)] Запрещены любые угрозы о наказании игрока со стороны администрации [/COLOR][COLOR=rgb(255, 0, 0)]| Mute 30 минут[/COLOR][/FONT][/SIZE]<br><br>" +
        "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA [/SIZE][/FONT][/COLOR][COLOR=Blue]Blue[/COLOR][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4].[/SIZE][/FONT][/COLOR][/I]<br><br>" +
        '[COLOR=rgb(51, 204, 51)][FONT=times new roman][SIZE=4][I]Одобрено.[/I][/SIZE][/FONT][/COLOR]',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: 'Выдача за адм',
      content:
        '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
        "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Нарушитель буден наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I]<br><br>" +
        "[COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4]3.10.[/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4] Запрещена выдача себя за администратора, если таковым не являетесь [/SIZE][/FONT][/COLOR][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4]| Ban 15 - 30 + ЧС администрации[/SIZE][/FONT][/COLOR]<br><br>" +
        "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA [/SIZE][/FONT][/COLOR][COLOR=Blue]Blue[/COLOR][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4].[/SIZE][/FONT][/COLOR][/I]<br><br>" +
        '[COLOR=rgb(51, 204, 51)][FONT=times new roman][SIZE=4][I]Одобрено.[/I][/SIZE][/FONT][/COLOR]',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: 'Введение в заблуж',
      content:
        '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
        "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Нарушитель буден наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I]<br><br>" +
        "[COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4]3.11. [/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4]Запрещено введение игроков проекта в заблуждение путем злоупотребления командами [/SIZE][/FONT][/COLOR][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4]| Ban 15 - 30 дней / PermBan[/SIZE][/FONT][/COLOR]<br><br>" +
        '[LIST]<br><br>' +
        "[*][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4]Примечание: [/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4]/me чтобы поднять кошелек введите /pay 228 5000. Для продажи автомобиля введите /sellmycar id 2828 (счёт в банке) цена.[/SIZE][/FONT][/COLOR]<br><br>" +
        "[/LIST]<br><br>" +
        "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA [/SIZE][/FONT][/COLOR][COLOR=Blue]Blue[/COLOR][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4].[/SIZE][/FONT][/COLOR][/I]<br><br>" +
        '[COLOR=rgb(51, 204, 51)][FONT=times new roman][SIZE=4][I]Одобрено.[/I][/SIZE][/FONT][/COLOR]',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: 'Полит/религ пропаганда',
      content:
        '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
        "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Нарушитель буден наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I]<br><br>" +
        "[COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4]3.18.[/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4] Запрещено политическое и религиозное пропагандирование [/SIZE][/FONT][/COLOR][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4]| Mute 120 минут / Ban 10 дней[/SIZE][/FONT][/COLOR]<br><br>" +
        "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA [/SIZE][/FONT][/COLOR][COLOR=Blue]Blue[/COLOR][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4].[/SIZE][/FONT][/COLOR][/I]<br><br>" +
        '[COLOR=rgb(51, 204, 51)][FONT=times new roman][SIZE=4][I]Одобрено.[/I][/SIZE][/FONT][/COLOR]',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
         title: 'Транслит',
      content:
        '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
        "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Нарушитель буден наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I]<br><br>" +
        "[SIZE=4][COLOR=rgb(255, 0, 0)][FONT=book antiqua]3.20.[/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua] Запрещено использование транслита в любом из чатов[/FONT][/COLOR][COLOR=rgb(255, 0, 0)][FONT=book antiqua] | Mute 30 минут[/FONT][/COLOR][/SIZE]<br><br>" +
        '[LIST]<br><br>' +
        "[*][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=book antiqua]Пример: [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua]«Privet», «Kak dela», «Narmalna».[/FONT][/COLOR][/SIZE]<br><br>" +
        "[/LIST]<br><br>" +
        "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA [/SIZE][/FONT][/COLOR][COLOR=Blue]Blue[/COLOR][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4].[/SIZE][/FONT][/COLOR][/I]<br><br>" +
        '[COLOR=rgb(51, 204, 51)][FONT=times new roman][SIZE=4][I]Одобрено.[/I][/SIZE][/FONT][/COLOR]',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: 'Реклама промо',
      content:
        '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
        "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Нарушитель буден наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I]<br><br>" +
        "[COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4]3.21.[/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4] Запрещается реклама промокодов в игре, а также их упоминание в любом виде во всех чатах. [/SIZE][/FONT][/COLOR][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4]| Ban 30 дней[/SIZE][/FONT][/COLOR]<br><br>" +
        '[LIST]<br><br>' +
        "[*][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4]Примечание: [/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4]чаты семейные, строительных компаний, транспортных компаний, фракционные чаты, IC, OOC, VIP и так далее.[/SIZE][/FONT][/COLOR]<br><br>" +
        "[*][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4]Исключение: [/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4]промокоды, предоставленные разработчиками, а также распространяемые через официальные ресурсы проекта.[/SIZE][/FONT][/COLOR]<br><br>" +
        "[*][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4]Пример: [/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4]если игрок упомянет промокод, распространяемый через официальную публичную страницу ВКонтакте либо через официальный Discord в любом из чатов, наказание ему не выдается.[/SIZE][/FONT][/COLOR]<br><br>" +
        "[/LIST]<br><br>" +
        "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA [/SIZE][/FONT][/COLOR][COLOR=Blue]Blue[/COLOR][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4].[/SIZE][/FONT][/COLOR][/I]<br><br>" +
        '[COLOR=rgb(51, 204, 51)][FONT=times new roman][SIZE=4][I]Одобрено.[/I][/SIZE][/FONT][/COLOR]',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: 'Сборка/Читы',
      content:
        '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
        "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Нарушитель буден наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I]<br><br>" +
        "[COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4]2.22. [/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4]Запрещено хранить / использовать / распространять стороннее программное обеспечение или любые другие средства, позволяющие получить преимущество над другими игроками[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4] | Ban 15 - 30 дней / PermBan[/SIZE][/FONT][/COLOR]<br><br>" +
        '[LIST]<br><br>' +
        "[*][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4]Примечание: [/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4]запрещено внесение любых изменений в оригинальные файлы игры.[/SIZE][/FONT][/COLOR]<br><br>" +
        "[/LIST]<br><br>" +
        "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA [/SIZE][/FONT][/COLOR][COLOR=Blue]Blue[/COLOR][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4].[/SIZE][/FONT][/COLOR][/I]<br><br>" +
        '[COLOR=rgb(51, 204, 51)][FONT=times new roman][SIZE=4][I]Одобрено.[/I][/SIZE][/FONT][/COLOR]',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: 'Реклама',
      content:
        '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
        "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Нарушитель буден наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I]<br><br>" +
        "[COLOR=rgb(255, 0, 0)][SIZE=4][FONT=book antiqua]2.31. [/FONT][/SIZE][/COLOR][COLOR=rgb(209, 213, 216)][SIZE=4][FONT=book antiqua]Запрещено рекламировать на серверах любые проекты, серверы, сайты, сторонние Discord-серверы, YouTube каналы и тому подобное[/FONT][/SIZE][/COLOR][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=book antiqua] | PermBan [/FONT][/SIZE][/COLOR]<br><br>" +
        "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA [/SIZE][/FONT][/COLOR][COLOR=Blue]Blue[/COLOR][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4].[/SIZE][/FONT][/COLOR][/I]<br><br>" +
        '[COLOR=rgb(51, 204, 51)][FONT=times new roman][SIZE=4][I]Одобрено.[/I][/SIZE][/FONT][/COLOR]',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: 'Оск/обман адм',
      content:
        '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
        "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Нарушитель буден наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I]<br><br>" +
        "[FONT=book antiqua][SIZE=4][COLOR=rgb(255, 0, 0)]2.32. [/COLOR][COLOR=rgb(209, 213, 216)]Запрещено введение в заблуждение, обман, оскорбление, неконструктивная критика администрации на всех ресурсах проекта [/COLOR][COLOR=rgb(255, 0, 0)]| Ban 7 - 30 дней / PermBan[/COLOR][/SIZE][/FONT]<br><br>" +
        '[LIST]<br><br>' +
        "[*][FONT=book antiqua][SIZE=4][COLOR=rgb(255, 0, 0)]Пример: [/COLOR][COLOR=rgb(209, 213, 216)]подделка доказательств, искажение информации в свою пользу, оскорбление администрации в репорт, обвинение администраторов без доказательств и т.д.[/COLOR][/SIZE][/FONT]<br><br>" +
        "[/LIST]<br><br>" +
        "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA [/SIZE][/FONT][/COLOR][COLOR=Blue]Blue[/COLOR][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4].[/SIZE][/FONT][/COLOR][/I]<br><br>" +
        '[COLOR=rgb(51, 204, 51)][FONT=times new roman][SIZE=4][I]Одобрено.[/I][/SIZE][/FONT][/COLOR]',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: 'ЕПП',
      content:
        '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
        "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Нарушитель буден наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I]<br><br>" +
        "[COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4]2.46. [/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4]Запрещено ездить по полям на любом транспорте[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4] | Jail 30 минут[/SIZE][/FONT][/COLOR]<br><br>" +
        '[LIST]<br><br>' +
        "[*][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4]Исключение:[/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4] разрешено передвижение на кроссовых мотоциклах и внедорожниках.[/SIZE][/FONT][/COLOR]<br><br>" +
        "[/LIST]<br><br>" +
        "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA [/SIZE][/FONT][/COLOR][COLOR=Blue]Blue[/COLOR][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4].[/SIZE][/FONT][/COLOR][/I]<br><br>" +
        '[COLOR=rgb(51, 204, 51)][FONT=times new roman][SIZE=4][I]Одобрено.[/I][/SIZE][/FONT][/COLOR]',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      
      title: 'NRP Врач',
      content:
        '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
        "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Нарушитель буден наказан по следующему пункту правил государственных структур:[/SIZE][/FONT][/COLOR][/I]<br><br>" +
        "[SIZE=4][FONT=book antiqua][COLOR=rgb(255, 0, 0)]5.01. [/COLOR][COLOR=rgb(209, 213, 216)]Запрещено оказание медицинской помощи без Role Play отыгровок;[/COLOR][/FONT][/SIZE]<br><br>" +
        "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA [/SIZE][/FONT][/COLOR][COLOR=]Blue[/COLOR][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4].[/SIZE][/FONT][/COLOR][/I]<br><br>" +
        '[COLOR=rgb(51, 204, 51)][FONT=times new roman][SIZE=4][I]Одобрено.[/I][/SIZE][/FONT][/COLOR]',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      
      title: 'NRP В/Ч',
      content:
        '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
        "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Нарушитель буден наказан по следующему пункту правил нападения на военную часть:[/SIZE][/FONT][/COLOR][/I]<br><br>" +
        "[COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4]2. [/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4]За нарушение правил нападения на Военную Часть выдаётся предупреждение [/SIZE][/FONT][/COLOR][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4]| Jail 30 минут (NonRP нападение) / Warn (Для сотрудников ОПГ)[/SIZE][/FONT][/COLOR]<br><br>" +
        "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA [/SIZE][/FONT][/COLOR][COLOR=bLue]blue[/COLOR][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4].[/SIZE][/FONT][/COLOR][/I]<br><br>" +
        '[COLOR=rgb(51, 204, 51)][FONT=times new roman][SIZE=4][I]Одобрено.[/I][/SIZE][/FONT][/COLOR]',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: 'NRP ограб/похищение',
      content:
        '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
        "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Нарушитель буден наказан по общим правилам ограблений и похищений.[/SIZE][/FONT][/COLOR]<br><br>" +
        "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA [/SIZE][/FONT][/COLOR][COLOR=BlUe]Blue[/COLOR][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4].[/SIZE][/FONT][/COLOR][/I]<br><br>" +
        '[COLOR=rgb(51, 204, 51)][FONT=times new roman][SIZE=4][I]Одобрено.[/I][/SIZE][/FONT][/COLOR]',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
   title: 'ППИВ(Донат)',
      content:
        '[CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]Доброго времени суток, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
        "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Нарушитель буден наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I]<br><br>" +
        "[COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4]2.28.[/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4] Запрещена покупка/продажа внутриигровой валюты в любых ее проявлениях за реальные деньги[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4] | PermBan с обнулением аккаунта + ЧС проекта[/SIZE][/FONT][/COLOR]<br>" +
        "[LIST]<br>" +
        "[*][LEFT][FONT=book antiqua][COLOR=rgb(255, 0, 0)][SIZE=4]Примечание: [/SIZE][/COLOR][COLOR=rgb(209, 213, 216)][SIZE=4]любые попытки покупки/продажи, попытки поинтересоваться о ней у другого игрока и прочее - наказуемы.[/SIZE][/COLOR][/FONT][/LEFT]<br>" +
        "[*][LEFT][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4]Примечание: [/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4]также запрещен обмен доната на игровые ценности и наоборот;[/SIZE][/FONT][/COLOR][/LEFT]<br>" +
		"[*][LEFT][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4]Пример: [/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4]пополнение донат счет любого игрока взамен на игровые ценности;[/SIZE][/FONT][/COLOR][/LEFT]<br>" +
        "[*][LEFT][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4]Исключение: [/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4]официальная покупка через сайт[/SIZE][/FONT][/COLOR][/LEFT]<br>" +
		"[/LIST]<br>" +
		"[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA RolePlay.[/SIZE][/FONT][/COLOR]<br><br>" +
        '[COLOR=rgb(0, 255, 255)][FONT=times new roman][SIZE=4]Одобрено.[/SIZE][/FONT][/COLOR][/I][/CENTER]',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
     {
    title: 'П/П/В',
      content:
        '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
        "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Нарушитель буден наказан по пункту правил  Запрещена совершенно любая передача игровых аккаунтов третьим лицам [Color=#ff0000]| PermBan.[/SIZE][/FONT][/COLOR]<br><br>" +
        "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA [/SIZE][/FONT][/COLOR][COLOR=BlUe]Blue[/COLOR][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4].[/SIZE][/FONT][/COLOR][/I]<br><br>" +
        '[COLOR=rgb(51, 204, 51)][FONT=times new roman][SIZE=4][I]Одобрено.[/I][/SIZE][/FONT][/COLOR]',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
    title: '---------------- Отказы Жалоб --------------', 
        }, 
        {
            title: 'nRP коп(отыгровки) ',
            content:
            "[CENTER][FONT=Verdana][Color=Yellow]{{greeting}}, уважаемый(-ая) {{ user.name }}.<br><br>"+
            "Системной отыгровки достаточно.<br>"+
                         "[B][CENTER][COLOR=Red]Приятной игры на  [COLOR=blue]BLUE[/COLOR].<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/yNNSJpc8/2022-12-09-15-49-54.gif[/img][/url]<br>",
            prefix: UNACCEPT_PREFIX,
            status: false,
        },
        {
            title: 'Долг не через банк',
            content:
            "[CENTER][FONT=Verdana][Color=Yellow]{{greeting}}, уважаемый(-ая) {{ user.name }}.<br><br>"+
            "Долг был дан не через банк. Долги ,микрозаймы,займы зачисляются только через банк.<br>"+
                         "[B][CENTER][COLOR=Red]Приятной игры на  [COLOR=blue]BLUE[/COLOR].<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/yNNSJpc8/2022-12-09-15-49-54.gif[/img][/url]<br>",
            prefix: UNACCEPT_PREFIX,
            status: false,
        },
        {
            title: 'Ник не совпадает ',
            content:
            "[CENTER][FONT=Verdana][Color=Yellow]{{greeting}}, уважаемый(-ая) {{ user.name }}.<br><br>"+
            "Ник в доказательствах не соответствует Нику в жалобе.<br>"+
                         "[B][CENTER][COLOR=Red]Приятной игры на  [COLOR=blue]BLUE[/COLOR].<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/yNNSJpc8/2022-12-09-15-49-54.gif[/img][/url]<br>",
            prefix: UNACCEPT_PREFIX,
            status: false,
        },
        {           
               title: 'Игрок уже наказан',
            content:
            "[CENTER][FONT=Verdana][Color=Blue][FONT=Verdana]{{greeting}}, уважаемый(-ая) {{ user.name }}.<br><br>"+
            "Данный игрок уже наказан.<br>"+
            
                         "[B][CENTER][COLOR=Red]Приятной игры на  [COLOR=blue]BLUE[/COLOR].<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/yNNSJpc8/2022-12-09-15-49-54.gif[/img][/url]<br>",
            prefix: UNACCEPT_PREFIX,
            status: false,
        },
        {
title: 'Оскорбление в ic чат',
            content:
            "[CENTER][FONT=Verdana][Color=Blue][FONT=Verdana]{{greeting}}, уважаемый(-ая) {{ user.name }}.<br><br>"+
            "Оскорбление в ic чат не считается нарушением.<br>"+
            
                         "[B][CENTER][COLOR=Red]Приятной игры на  [COLOR=blue]BLUE[/COLOR].<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/yNNSJpc8/2022-12-09-15-49-54.gif[/img][/url]<br>",
            prefix: UNACCEPT_PREFIX,
            status: false,
        },
        {
           title: 'Дм (15 сек)',
            content:
            "[CENTER][FONT=Verdana][Color=Aqua][FONT=Verdana]{{greeting}}, уважаемый(-ая) {{ user.name }}.<br><br>"+
            "На фрапсе, подтверждающий ДМ, должна быть видна ситуация не менее чем за 15 секунд до самого ДМа.<br>"+
            
                         "[B][CENTER][COLOR=Red]Приятной игры на  [COLOR=blue]BLUE[/COLOR].<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/yNNSJpc8/2022-12-09-15-49-54.gif[/img][/url]<br>",
            prefix: UNACCEPT_PREFIX,
            status: false,
        },
        {
            title: 'Нет доступа к гугл диску',
            content:
            "[CENTER][FONT=Verdana][Color=Yellow][FONT=Verdana]{{greeting}}, уважаемый(-ая) {{ user.name }}.<br><br>"+
            "Доступ к доказательством закрыт загрузите через imgur, yapix .<br>"+
            
                         "[B][CENTER][COLOR=Red]Приятной игры на  [COLOR=blue]BLUE[/COLOR].<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/yNNSJpc8/2022-12-09-15-49-54.gif[/img][/url]<br>",
            prefix: UNACCEPT_PREFIX,
            status: false,
        },
        {
            title: 'Нет докв',
            content:
            "[CENTER][FONT=Verdana][Color=Yellow][FONT=Verdana]{{greeting}}, уважаемый(-ая) {{ user.name }}.<br><br>"+
            "Отсутствуют доказательства, если есть доказательства прикрепите в новой теме.<br>"+
            
                         "[B][CENTER][COLOR=Red]Приятной игры на  [COLOR=blue]BLUE[/COLOR].<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/yNNSJpc8/2022-12-09-15-49-54.gif[/img][/url]<br>",
            prefix: UNACCEPT_PREFIX,
            status: false,
        },
        {
            
            title: 'Уже на рассмотреннии',
            content:
            "[CENTER][FONT=Verdana][Color=Yellow][FONT=Verdana]{{greeting}}, уважаемый(-ая) {{ user.name }}.<br><br>"+
            "Подобная жалоба уже взята на рассмотрение.<br>"+
            
                         "[B][CENTER][COLOR=Red]Приятной игры на  [COLOR=blue]BLUE[/COLOR].<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/yNNSJpc8/2022-12-09-15-49-54.gif[/img][/url]<br>",
            prefix: UNACCEPT_PREFIX,
            status: false,
        },
        {
            title: 'Нет таймкодов',
            content:
            "[CENTER][FONT=Verdana][Color=Blue][FONT=Verdana]{{greeting}}, уважаемый(-ая) {{ user.name }}.<br><br>"+
            "Если видео длится более 3-ех минут надо указывать таймкоды т.к у вас нет жалоба отказана.<br>"+
            
                         "[B][CENTER][COLOR=Red]Приятной игры на  [COLOR=blue]BLUE[/COLOR].<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/yNNSJpc8/2022-12-09-15-49-54.gif[/img][/url]<br>",
            prefix: UNACCEPT_PREFIX,
            status: false,
        },
        {
          title: 'соц сеть',
          content:
		'[Color=Aqua][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/FONT][/CENTER]<br>' +
        "[CENTER][Color=Yellow][FONT=courier new]Загрузка доказательств в соц. сети (ВКонтакте, instagram) запрещается, доказательства должны быть загружены на фото/видео хостинги (YouTube, Япикс, imgur). [/COLOR][/FONT][/CENTER] <br>" +

"[url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url]<br>"+
		             "[B][CENTER][COLOR=Red]Приятной игры на [COLOR=blue]BLUE[/Color] .<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/yNNSJpc8/2022-12-09-15-49-54.gif[/img][/url]<br>",
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'нет условий сделки',
      content:
		'[Color=Yellow][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/FONT][/CENTER]<br>' +
        "[CENTER][Color=#00FFFF][FONT=courier new]В ваших доказательствах отсутствуют условия сделки [/COLOR][/FONT][/CENTER] <br>" +
 	             "[B][CENTER][COLOR=Red]Приятной игры на  [COLOR=blue]BLUE[/COLOR].<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/yNNSJpc8/2022-12-09-15-49-54.gif[/img][/url]<br>",
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
            title: 'Заголовок не по форме',
            content:
            "[CENTER][FONT=Verdana][Color=Yellow]{{greeting}}, уважаемый(-ая) {{ user.name }}.<br><br>"+
            "Заголовок вашей жалобы составлен не по форме, ознакомьтесь с правилами подачи жалоб.<br>"+
                         "[B][CENTER][COLOR=Red]Приятной игры на  [COLOR=blue]BLUE[/COLOR].<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/yNNSJpc8/2022-12-09-15-49-54.gif[/img][/url]<br>",
            prefix: UNACCEPT_PREFIX,
            status: false,
        },
        {
            title: 'Нет /time',
            content:
            "[CENTER][FONT=Verdana][Color=Yellow]{{greeting}}, уважаемый(-ая) {{ user.name }}.<br><br>"+
            "В предоставленных доказательствах отсутствует /time, жалоба не подлежит рассмотрению.<br>"+
                         "[B][CENTER][COLOR=Red]Приятной игры на  [COLOR=blue]BLUE[/COLOR].<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/yNNSJpc8/2022-12-09-15-49-54.gif[/img][/url]<br>",
            prefix: UNACCEPT_PREFIX,
            status: false,
        },
        {
            title: 'Недосточно доказательств',
            content:
            "[CENTER][FONT=Verdana][Color=Yellow][Color=Lime]{{greeting}}, уважаемый(-ая) {{ user.name }}.<br><br>"+
            "Недосточно доказательств.<br>"+
                         "[B][CENTER][COLOR=Red]Приятной игры на  [COLOR=blue]BLUE[/COLOR].<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/yNNSJpc8/2022-12-09-15-49-54.gif[/img][/url]<br>",
            prefix: UNACCEPT_PREFIX,
            status: false,
        },
        {
            title: 'От 3 лица',
            content:
            "[CENTER][FONT=Verdana][Color=Yellow]{{greeting}}, уважаемый(-ая) {{ user.name }}.<br><br>"+
            "Жалоба составлена от 3-го лица, жалобы подобного формата рассмотрению не подлежат.<br>"+
                         "[B][CENTER][COLOR=Red]Приятной игры на  [COLOR=blue]BLUE[/COLOR].<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/yNNSJpc8/2022-12-09-15-49-54.gif[/img][/url]<br>",
            prefix: UNACCEPT_PREFIX,
            status: false,
        },
        {
            title: 'Нужен фрапс',
            content:
            "[CENTER][FONT=Verdana][Color=Yellow]{{greeting}}, уважаемый(-ая) {{ user.name }}..<br><br>"+
            "В данной ситуации обязательно должен быть фрапс(видеофиксация) всех моментов, в противном случае жалоба будет отказана.<br>"+
                         "[B][CENTER][COLOR=Red]Приятной игры на  [COLOR=blue]BLUE[/COLOR].<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/yNNSJpc8/2022-12-09-15-49-54.gif[/img][/url]<br>",
            prefix: UNACCEPT_PREFIX,
            status: false,
        },
        {
            title: 'Неполный фрапс',
            content:
            "[CENTER][FONT=Verdana][Color=Yellow]{{greeting}}, уважаемый(-ая) {{ user.name }}.<br><br>"+
            "Фрапс обрезан.<br>"+
            "Если у вас есть полный фрапс,то создайте новую тему,прикрепив его.<br>"+
                         "[B][CENTER][COLOR=Red]Приятной игры на  [COLOR=blue]BLUE[/COLOR].<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/yNNSJpc8/2022-12-09-15-49-54.gif[/img][/url]<br>",
            prefix: UNACCEPT_PREFIX,
            status: false,
        },
        {
            title: 'Док-ва отредактированы',
            content:
            "[CENTER][FONT=Verdana][Color=Yellow]{{greeting}}, уважаемый(-ая) {{ user.name }}.<br><br>"+
            "Представленные доказательства были отредактированы, подобные жалобы рассмотрению не подлежат.<br>"+
                         "[B][CENTER][COLOR=Red]Приятной игры на  [COLOR=blue]BLUE[/COLOR].<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/yNNSJpc8/2022-12-09-15-49-54.gif[/img][/url]<br>",
            prefix: UNACCEPT_PREFIX,
            status: false,
        },
        {
            title: 'Плохое качество докв',
            content:
            "[CENTER][FONT=Verdana][Color=Yellow]{{greeting}}, уважаемый(-ая) {{ user.name }}.<br><br>"+
            "Доказательства были предоставлены в плохом качестве, пожалуйста прикрепите более качественные фото/видео.<br>"+
                         "[B][CENTER][COLOR=Red]Приятной игры на  [COLOR=blue]BLUE[/COLOR].<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/yNNSJpc8/2022-12-09-15-49-54.gif[/img][/url]<br>",
            prefix: UNACCEPT_PREFIX,
            status: false,
        },
        {
            title: 'Прошло более 72 часов',
            content:
            "[CENTER][FONT=Verdana][Color=Yellow]{{greeting}}, уважаемый(-ая) {{ user.name }}.<br><br>"+
            "С момента нарушения прошло более 72-х часов.<br>"+
                         "[B][CENTER][COLOR=Red]Приятной игры на  [COLOR=blue]BLUE[/COLOR].<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/yNNSJpc8/2022-12-09-15-49-54.gif[/img][/url]<br>",
            prefix: UNACCEPT_PREFIX,
            status: false,
        },
        {
            title: 'Отсутствуют доква',
            content:
            "[CENTER][FONT=Verdana][Color=Yellow]{{greeting}}, уважаемый(-ая) {{ user.name }}.<br><br>"+
            "В вашей жалобе отсутствуют доказательства для рассмотра. <br>"+
                         "[B][CENTER][COLOR=Red]Приятной игры на  [COLOR=blue]BLUE[/COLOR].<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/yNNSJpc8/2022-12-09-15-49-54.gif[/img][/url]<br>",
            prefix: UNACCEPT_PREFIX,
            status: false,
        },
        {
            title: 'Не рабочие док-ва',
            content:
            "[CENTER][FONT=Verdana][Color=Yellow]{{greeting}}, уважаемый(-ая) {{ user.name }}.<br><br>"+
            "Предоставленные вами доказательства нерабочие, создайте новую тему, прикрепив рабочую ссылку на док-ва.<br>"+
                         "[B][CENTER][COLOR=Red]Приятной игры на  [COLOR=blue]BLUE[/COLOR].<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/yNNSJpc8/2022-12-09-15-49-54.gif[/img][/url]<br>",
            prefix: UNACCEPT_PREFIX,
            status: false,
        },
        {
           title: 'Не по форме',
            content:
            "[CENTER][FONT=Verdana][Color=Yellow]{{greeting}}, уважаемый(-ая) {{ user.name }}.<br><br>"+
            "Ваша жалоба составлена не по форме, ознакомьтесь с правилами подачи жалоб.<br>"+
                         "[B][CENTER][COLOR=Red]Приятной игры на  [COLOR=blue]BLUE[/COLOR].<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/yNNSJpc8/2022-12-09-15-49-54.gif[/img][/url]<br>",
            prefix: UNACCEPT_PREFIX,
            status: false,
        },
        {
             title: 'Нет нарушений',
            content:
            "[CENTER][FONT=Verdana][Color=Yellow]{{greeting}}, уважаемый(-ая) {{ user.name }}.<br><br>"+
            "В предоставленных доказательствах не было найдено данного нарушения.<br>"+
                         "[B][CENTER][COLOR=Red]Приятной игры на  [COLOR=blue]BLUE[/COLOR].<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/yNNSJpc8/2022-12-09-15-49-54.gif[/img][/url]<br>",
            prefix: UNACCEPT_PREFIX,
            status: false,
        },
        {
             title: 'Ошиблись сервером',
            content:
            "[CENTER][FONT=Verdana][Color=Yellow]{{greeting}}, уважаемый(-ая) {{ user.name }}.<br><br>"+
            "Вы ошиблись сервером обратитесь в вашем сервер.<br>"+
                         "[B][CENTER][COLOR=Red]Приятной игры на  [COLOR=blue]BLUE[/COLOR].<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/yNNSJpc8/2022-12-09-15-49-54.gif[/img][/url]<br>",
            prefix: UNACCEPT_PREFIX,
            status: false,
        },
        {
            title: 'Не виден сервер',
            content:
            "[CENTER][FONT=Verdana][Color=Yellow]{{greeting}}, уважаемый(-ая) {{ user.name }}.<br><br>"+
            "В предоставленных доказательствах не виден сервер.<br>"+
                         "[B][CENTER][COLOR=Red]Приятной игры на  [COLOR=blue]BLUE[/COLOR].<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/yNNSJpc8/2022-12-09-15-49-54.gif[/img][/url]<br>",
            prefix: UNACCEPT_PREFIX,
            status: false,
        },
        {
            title: 'Не туда',
            content:
            "[CENTER][FONT=Verdana][Color=Yellow]{{greeting}}, уважаемый(-ая) {{ user.name }}.<br><br>"+
            "Вы не туда попали обратитесь нужный раздел.<br>"+
                         "[B][CENTER][COLOR=Red]Приятной игры на  [COLOR=blue]BLUE[/COLOR].<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/yNNSJpc8/2022-12-09-15-49-54.gif[/img][/url]<br>",
            prefix: UNACCEPT_PREFIX,
            status: false,
        },
        {
title: 'ОФФТОП',
            content:
            "[CENTER][FONT=Verdana][Color=Yellow]{{greeting}}, уважаемый(-ая) {{ user.name }}.<br><br>"+
            "Оффтоп.<br>"+
                         "[B][CENTER][COLOR=Red]Приятной игры на  [COLOR=blue]BLUE[/COLOR].<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/yNNSJpc8/2022-12-09-15-49-54.gif[/img][/url]<br>",
            prefix: UNACCEPT_PREFIX,
            status: false,
        },
        {
          title: 'Дублирование',
            content:
            "[CENTER][FONT=Verdana][Color=Yellow]{{greeting}}, уважаемый(-ая) {{ user.name }}.<br><br>"+
            "Ответ вам уже был дан в предыдущей теме. Напоминаю, за дублирование тем ваш форумный аккаунт может быть заблокирован.<br>"+
                         "[B][CENTER][COLOR=Red]Приятной игры на  [COLOR=blue]BLUE[/COLOR].<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/yNNSJpc8/2022-12-09-15-49-54.gif[/img][/url]<br>",
            prefix: UNACCEPT_PREFIX,
            status: false,
           }, 
           {
            title: '------------ РП ситуации--------', 
           },
           {
            title: 'РП ситуации одобрено',
            content:
            "[CENTER][FONT=Verdana][Color=GREEN]{{greeting}}, уважаемый(-ая) {{ user.name }}.<br><br>"+
             "Ваша РП ситуация одобрена.<br>"+
            "[B][CENTER][COLOR=Yellow]Приятной игры на  [COLOR=blue]BLUE[/COLOR].<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/QCcBL2G0/image.gif [/img][/url]<br>",
            title: 'РП сит отказ (не по форме)',
            content:
            "[CENTER][FONT=Verdana][Color=GREEN]{{greeting}}, уважаемый(-ая) {{ user.name }}.<br><br>"+
             "< Не по форме> .<br>"+
            '[COLOR=red]Закрыто.[/FONT][/CENTER]',
"[url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url]<br>":
		"[url=https://postimages.org/][img]https://i.postimg.cc/yNNSJpc8/2022-12-09-15-49-54.gif[/img][/url]<br>",
            prefix: UNACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'РП сит отказ (мало информации)',
            content:
            "[CENTER][FONT=Verdana][Color=GREEN]{{greeting}}, уважаемый(-ая) {{ user.name }}.<br><br>"+
            "Мало информации о ситуации.<br>"+
            '[COLOR=red]Закрыто.[/FONT][/CENTER]',
"[url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url]<br>":
		"[url=https://postimages.org/][img]https://i.postimg.cc/yNNSJpc8/2022-12-09-15-49-54.gif[/img][/url]<br>",
            prefix: UNACCEPT_PREFIX,
            status: false,
         },
         {
            title: 'РП сит отказ (Копипаст) ',
            content:
            "[CENTER][FONT=Verdana][Color=GREEN]{{greeting}}, уважаемый(-ая) {{ user.name }}.<br><br>"+
            "РП ситуация скопировано.<br>"+
            '[COLOR=red]Закрыто.[/FONT][/CENTER]',
"[url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url]<br>":
		"[url=https://postimages.org/][img]https://i.postimg.cc/yNNSJpc8/2022-12-09-15-49-54.gif[/img][/url]<br>",
            prefix: UNACCEPT_PREFIX,
            status: false,
            },
            {
            title: 'РП сит отказ (заголовок)',
            content:
            "[CENTER][FONT=Verdana][Color=GREEN]{{greeting}}, уважаемый(-ая) {{ user.name }}.<br><br>"+
            "Заголовок не по форме.<br>"+
            '[COLOR=red]Закрыто.[/FONT][/CENTER]',
"[url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url]<br>":
		"[url=https://postimages.org/][img]https://i.postimg.cc/yNNSJpc8/2022-12-09-15-49-54.gif[/img][/url]<br>",
            prefix: UNACCEPT_PREFIX,
            status: false,
            },
            {
            title: '----------- Неофициальные RP организации--------', 
            },
            {
            title: 'RP орг (одобрено)',
            content:
            "[CENTER][FONT=Verdana][Color=RED]{{greeting}}, уважаемый(-ая) {{ user.name }}.<br><br>"+
            "Ваша RP организация одобрена.<br>"+
            '[COLOR=red]Закрыто.[/FONT][/CENTER]',
"[url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url]<br>":
		"[url=https://postimages.org/][img]https://i.postimg.cc/QCcBL2G0/image.gif [/img][/url]<br>",
            prefix: ACCEPT_PREFIX,
            status: false,
           },
           {
            title: 'РП орг отказ (заголовок)',
            content:
            "[CENTER][FONT=Verdana][Color=RED]{{greeting}}, уважаемый(-ая) {{ user.name }}.<br><br>"+
            "Ваша RP организация отказано так как заголовок не по форме.<br>"+
            '[COLOR=red]Закрыто.[/FONT][/CENTER]',
            prefix: UNACCEPT_PREFIX,
            status: false,
            },
            {
             title: 'РП орг отказ (Копипаст) ',
            content:
            "[CENTER][FONT=Verdana][Color=RED]{{greeting}}, уважаемый(-ая) {{ user.name }}.<br><br>"+
            "РП организация скопировано.<br>"+
            '[COLOR=red]Закрыто.[/FONT][/CENTER]',
            prefix: UNACCEPT_PREFIX,
            status: false,
            },
            {
            title: 'РП орг отказ (мало информации)',
            content:
            "[CENTER][FONT=Verdana][Color=RED]{{greeting}}, уважаемый(-ая) {{ user.name }}.<br><br>"+
            "Ваша RP организация отказано так как в ней мало информации о ситуации.<br>"+
            '[COLOR=red]Закрыто.[/FONT][/CENTER]',
            prefix: UNACCEPT_PREFIX,
            status: false,
            }, 
            {
           title: 'РП организация отказ(не по форме)',
            content:
            "[CENTER][FONT=Verdana][Color=RED]{{greeting}}, уважаемый(-ая) {{ user.name }}.<br><br>"+
            "Ваша РП организация отказано, так как она составлена не по форме.<br>"+
            '[COLOR=red]Закрыто.[/FONT][/CENTER]',
            prefix: UNACCEPT_PREFIX,
            status: false, 
        }, 
        {
           title: '===============> В другой раздел <=======', 
        },
        { 
           title: ' В ЖБ на игроков', 
            content:
            "[CENTER][FONT=Verdana][Color=YELLOW]{{greeting}}, уважаемый(-ая) {{ user.name }}.<br><br>"+
            "Вы ошиблись разделом обратитесь в раздел Жалобы на игроков.<br>"+
            '[COLOR=red]Закрыто.[/FONT][/CENTER]',
"[url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url]<br>":
		"[url=https://postimages.org/][img]https://i.postimg.cc/yNNSJpc8/2022-12-09-15-49-54.gif[/img][/url]<br>",
            prefix: UNACCEPT_PREFIX,
            status: false, 
        }, 
        {
           title: ' В ЖБ на сотрудников', 
            content:
            "[CENTER][FONT=Verdana][Color=YELLOW]{{greeting}}, уважаемый(-ая) {{ user.name }}.<br><br>"+
            "Вы ошиблись разделом обратитесь в раздел Жалобы на сотрудников.<br>"+
            '[COLOR=red]Закрыто.[/FONT][/CENTER]',
"[url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url]<br>":
		"[url=https://postimages.org/][img]https://i.postimg.cc/yNNSJpc8/2022-12-09-15-49-54.gif[/img][/url]<br>",
            prefix: UNACCEPT_PREFIX,
            status: false, 
        }, 
        {
           title: ' В ОБЖ', 
            content:
            "[CENTER][FONT=Verdana][Color=YELLOW]{{greeting}}, уважаемый(-ая) {{ user.name }}.<br><br>"+
            "Вы ошиблись разделом обратитесь в раздел Обжалования наказаний.<br>"+
            '[COLOR=red]Закрыто.[/FONT][/CENTER]',
"[url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url]<br>":
		"[url=https://postimages.org/][img]https://i.postimg.cc/yNNSJpc8/2022-12-09-15-49-54.gif[/img][/url]<br>",
            prefix: UNACCEPT_PREFIX,
            status: false, 
        }, 
        {
           title: ' В ЖБ на АП', 
            content:
            "[CENTER][FONT=Verdana][Color=YELLOW]{{greeting}}, уважаемый(-ая) {{ user.name }}.<br><br>"+
            "Вы ошиблись разделом обратитесь в раздел Жалобы на  Агентов поддержки .<br>"+
            '[COLOR=red]Закрыто.[/FONT][/CENTER]',
"[url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url]<br>":
		"[url=https://postimages.org/][img]https://i.postimg.cc/yNNSJpc8/2022-12-09-15-49-54.gif[/img][/url]<br>",
            prefix: UNACCEPT_PREFIX,
            status: false, 
        }, 
        {
           title: ' В ЖБ на адм', 
            content:
            "[CENTER][FONT=Verdana][Color=YELLOW]{{greeting}}, уважаемый(-ая) {{ user.name }}.<br><br>"+
            "Вы ошиблись разделом обратитесь в раздел Жалобы на администрацию.<br>"+
            '[COLOR=red]Закрыто.[/FONT][/CENTER]',
"[url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url]<br>":
		"[url=https://postimages.org/][img]https://i.postimg.cc/yNNSJpc8/2022-12-09-15-49-54.gif[/img][/url]<br>",
            prefix: UNACCEPT_PREFIX,
            status: false, 
        }, 
        {
           title: 'В ЖБ на лидеров',
            content:
            "[CENTER][FONT=Verdana][Color=YELLOW]{{greeting}}, уважаемый(-ая) {{ user.name }}.<br><br>"+
             " Вы ошиблись разделом обратитесь в раздел Жалобы на лидеров.<br>"+
            '[COLOR=red]Закрыто.[/FONT][/CENTER]',
"[url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url]<br>":
		"[url=https://postimages.org/][img]https://i.postimg.cc/yNNSJpc8/2022-12-09-15-49-54.gif[/img][/url]<br>",
            prefix: UNACCEPT_PREFIX,
            status: false, 
        }, 
    ];
       
    $(document).ready(() => {
        // Загрузка скрипта для обработки шаблонов
        $('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');
 
        // Добавление кнопок при загрузке страницы
        addButton('💙Менюшка💙', 'selectAnswer');
        addButton('На рассмотрение', 'pin');
    addButton('КП', 'teamProject');
    addButton('Га', 'Ga');
    addButton('Спецу', 'Spec');
    addButton('Одобрено', 'accepted');
    addButton('Отказано', 'unaccept');
    addButton('Тех. Специалисту', ' TEX');
    addButton('Закрыто', 'close');
 
        // Поиск информации о теме
        const threadData = getThreadData();
 
        $('button#pin').click(() => editThreadData(PIN_PREFIX, true));
        $('button#accepted').click(() => editThreadData(ACCEPT_PREFIX, false));
        $(`button#teamProject`).click(() => editThreadData(COMMAND_PREFIX, true));
        $(`button#watched`).click(() => editThreadData(WATCHED_PREFIX, false));
        $(`button#unaccept`).click(() => editThreadData(UNACCEPT_PREFIX, false));
        $(`button#mainAdmin`).click(() => editThreadData(GA_PREFIX, true));
 
        $(`button#specialAdmin`).click(() => editThreadData(SPECIAL_PREFIX, true));
 
        $('button#unaccept').click(() => editThreadData(UNACCEPT_PREFIX, false));
 
        $(`button#selectAnswer`).click(() => {
            XF.alert(buttonsMarkup(buttons), null, 'Выберите ответ:');
            buttons.forEach((btn, id) => {
                if(id > 1) {
                    $(`button#answers-${id}`).click(() => pasteContent(id, threadData, true));
                } else {
                    $(`button#answers-${id}`).click(() => pasteContent(id, threadData, false));
                }
            });
        });
    });
 
    function addButton(name, id) {
        $('.button--icon--reply').before(
            `<button type="button" class="button--primary button rippleButton" id="${id}" style="border-radius: 30px; margin-right: 7px;">${name}</button>`,
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