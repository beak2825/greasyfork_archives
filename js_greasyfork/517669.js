// ==UserScript==
// @name         Кураторы форума | PSKOV 
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  По вопросам в ВК - https://vk.com/id796529644, туда же и по предложениям на улучшение скрипта)
// @author       Persona_Capone
// @match        https://forum.blackrussia.online/threads/*
// @grant        none
// @license 	 MIT
// @icon https://forum.blackrussia.online/data/avatars/o/2229/2229459.jpg?1729110068
// @downloadURL https://update.greasyfork.org/scripts/517669/%D0%9A%D1%83%D1%80%D0%B0%D1%82%D0%BE%D1%80%D1%8B%20%D1%84%D0%BE%D1%80%D1%83%D0%BC%D0%B0%20%7C%20PSKOV.user.js
// @updateURL https://update.greasyfork.org/scripts/517669/%D0%9A%D1%83%D1%80%D0%B0%D1%82%D0%BE%D1%80%D1%8B%20%D1%84%D0%BE%D1%80%D1%83%D0%BC%D0%B0%20%7C%20PSKOV.meta.js
// ==/UserScript==

(function() {
    'use strict';
const UNACCEPT_PREFIX = 4;
const ACCEPT_PREFIX = 8;
const RASSMOTENO_PREFIX = 9;
const PIN_PREFIX = 2;
const GA_PREFIX = 12;
const COMMAND_PREFIX = 10;
const DECIDED_PREFIX = 6;
const WAIT_PREFIX = 14;
const WATCHED_PREFIX = 9;
const CLOSE_PREFIX = 7;
const SPECY_PREFIX = 11;
const TEX_PREFIX = 13;
const buttons = [
    {
      title: 'Свой ответ',
      content:
		'[CENTER][SIZE=4][FONT=times new roman][COLOR=#FFFFFF]{{ greeting }}, уважаемый(-ая) {{ user.mention }}.[/COLOR][/FONT][/SIZE] <br><br>' +
        "[FONT=times new roman][COLOR=#FFFFFF][SIZE=4]Текст [/color][/FONT][B][IMG width=695px]https://i.postimg.cc/mrnnkJw9/1000015253.png[/IMG][/B][/CENTER] <br>" +
        '[CENTER][FONT=times new roman][SIZE=5][SIZE=4][FONT=arial][COLOR=#FF0000][ICODE]Закрыто. [/ICODE][/COLOR][/FONT][/SIZE][/SIZE][/FONT][/CENTER]',
    },
    {
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴Ответы на РП биографии ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
      title: 'Биография одобрена',
      content:
		'[CENTER][SIZE=4][FONT=times new roman][COLOR=#FFFFFF]{{ greeting }}, уважаемый(-ая) {{ user.mention }}.[/COLOR][/FONT][/SIZE] <br><br>' +
        "[FONT=times new roman][COLOR=#FFFFFF][SIZE=4]Ваша RolePlay биография получает статус – [COLOR=#00FF00]Одобрено. [/color][/FONT][B][IMG width=695px]https://i.postimg.cc/mrnnkJw9/1000015253.png[/IMG][/B][/CENTER] <br>" +
        '[CENTER][FONT=times new roman][SIZE=5][SIZE=4][FONT=arial][COLOR=#FFFF00][ICODE]Приятной игры и времяпровождения. [/ICODE][/COLOR][/FONT][/SIZE][/SIZE][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Биография отказана',
      content:
		'[CENTER][SIZE=4][FONT=times new roman][COLOR=#FFFFFF]{{ greeting }}, уважаемый(-ая) {{ user.mention }}.[/COLOR][/FONT][/SIZE] <br><br>' +
        "[FONT=times new roman][COLOR=#FFFFFF][SIZE=4]Ваша RolePlay биография получает статус – [COLOR=#FF0000]Отказано. [/color]<br>Причиной отказа послужило – [URL=https://forum.blackrussia.online/threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%B7%D0%B0%D0%BF%D0%BE%D0%BB%D0%BD%D0%B5%D0%BD%D0%B8%D1%8F-%D0%A0%D0%9F-%D0%91%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B9.9357934/]нарушение правила написания RolePlay биографий[/URL].[/FONT][B][IMG width=695px]https://i.postimg.cc/mrnnkJw9/1000015253.png[/IMG][/B][/CENTER] <br>" +
        '[CENTER][FONT=times new roman][SIZE=5][SIZE=4][FONT=arial][COLOR=#FF0000][ICODE]Закрыто. [/ICODE][/COLOR][/FONT][/SIZE][/SIZE][/FONT][/CENTER]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Биография на доработку',
      content:
		'[CENTER][SIZE=4][FONT=times new roman][COLOR=#FFFFFF]{{ greeting }}, уважаемый(-ая) {{ user.mention }}.[/COLOR][/FONT][/SIZE] <br><br>' +
        "[FONT=times new roman][COLOR=#FFFFFF][SIZE=4]Вам даётся 24 часа на дополнение вашей RolePlay биографии, в противном случае она получит статус – [COLOR=#FF0000]Отказано[/color].[/FONT][B][IMG width=695px]https://i.postimg.cc/mrnnkJw9/1000015253.png[/IMG][/B][/CENTER] <br>" +
        '[CENTER][FONT=times new roman][SIZE=5][SIZE=4][FONT=arial][COLOR=#FFFF00][ICODE]На рассмотрении. [/ICODE][/COLOR][/FONT][/SIZE][/SIZE][/FONT][/CENTER]',
      prefix: PIN_PREFIX,
	  status: 123,
    },
    {
      title: 'Биография на доработку пункта «Детство»',
      content:
		'[CENTER][SIZE=4][FONT=times new roman][COLOR=#FFFFFF]{{ greeting }}, уважаемый(-ая) {{ user.mention }}.[/COLOR][/FONT][/SIZE] <br><br>' +
        "[FONT=times new roman][COLOR=#FFFFFF][SIZE=4]Вам даётся 24 часа на дополнение пункта – «Детство», в противном случае биография получит статус – [COLOR=#FF0000]Отказано[/color].[/FONT][B][IMG width=695px]https://i.postimg.cc/mrnnkJw9/1000015253.png[/IMG][/B][/CENTER] <br>" +
        '[CENTER][FONT=times new roman][SIZE=5][SIZE=4][FONT=arial][COLOR=#FFFF00][ICODE]На рассмотрении. [/ICODE][/COLOR][/FONT][/SIZE][/SIZE][/FONT][/CENTER]',
      prefix: PIN_PREFIX,
	  status: 123,
    },
    {
      title: 'Биография на доработку пункта «Юность и взрослая жизнь»',
      content:
		'[CENTER][SIZE=4][FONT=times new roman][COLOR=#FFFFFF]{{ greeting }}, уважаемый(-ая) {{ user.mention }}.[/COLOR][/FONT][/SIZE] <br><br>' +
        "[FONT=times new roman][COLOR=#FFFFFF][SIZE=4]Вам даётся 24 часа на дополнение пункта – «Юность и взрослая жизнь», в противном случае биография получит статус – [COLOR=#FF0000]Отказано[/color].[/FONT][B][IMG width=695px]https://i.postimg.cc/mrnnkJw9/1000015253.png[/IMG][/B][/CENTER] <br>" +
        '[CENTER][FONT=times new roman][SIZE=5][SIZE=4][FONT=arial][COLOR=#FFFF00][ICODE]На рассмотрении. [/ICODE][/COLOR][/FONT][/SIZE][/SIZE][/FONT][/CENTER]',
      prefix: PIN_PREFIX,
	  status: 123,
    },
    {
      title: 'Биография на доработку пункта «Настоящее время»',
      content:
		'[CENTER][SIZE=4][FONT=times new roman][COLOR=#FFFFFF]{{ greeting }}, уважаемый(-ая) {{ user.mention }}.[/COLOR][/FONT][/SIZE] <br><br>' +
        "[FONT=times new roman][COLOR=#FFFFFF][SIZE=4]Вам даётся 24 часа на дополнение пункта – «Настоящее время», в противном случае биография получит статус – [COLOR=#FF0000]Отказано[/color].[/FONT][B][IMG width=695px]https://i.postimg.cc/mrnnkJw9/1000015253.png[/IMG][/B][/CENTER] <br>" +
        '[CENTER][FONT=times new roman][SIZE=5][SIZE=4][FONT=arial][COLOR=#FFFF00][ICODE]На рассмотрении. [/ICODE][/COLOR][/FONT][/SIZE][/SIZE][/FONT][/CENTER]',
      prefix: PIN_PREFIX,
	  status: 123,
    },
    {
      title: 'Биография на исправление грамм ошибок',
      content:
		'[CENTER][SIZE=4][FONT=times new roman][COLOR=#FFFFFF]{{ greeting }}, уважаемый(-ая) {{ user.mention }}.[/COLOR][/FONT][/SIZE] <br><br>' +
        "[FONT=times new roman][COLOR=#FFFFFF][SIZE=4]Вам даётся 24 часа на исправление грамматических ошибок, в противном случае биография получит статус – [COLOR=#FF0000]Отказано[/color].[/FONT][B][IMG width=695px]https://i.postimg.cc/mrnnkJw9/1000015253.png[/IMG][/B][/CENTER] <br>" +
        '[CENTER][FONT=times new roman][SIZE=5][SIZE=4][FONT=arial][COLOR=#FFFF00][ICODE]На рассмотрении. [/ICODE][/COLOR][/FONT][/SIZE][/SIZE][/FONT][/CENTER]',
      prefix: PIN_PREFIX,
	  status: 123,
    },
    {
      title: 'Отказ биографии (Не дополнил)',
      content:
		'[CENTER][SIZE=4][FONT=times new roman][COLOR=#FFFFFF]{{ greeting }}, уважаемый(-ая) {{ user.mention }}.[/COLOR][/FONT][/SIZE] <br><br>' +
        "[FONT=times new roman][COLOR=#FFFFFF][SIZE=4]Ваша RolePlay биография получает статус – [COLOR=#FF0000]Отказано[/color].<br>Причиной отказа послужило – Не дополнили биографию в течение 24-х часов.[/FONT][B][IMG width=695px]https://i.postimg.cc/mrnnkJw9/1000015253.png[/IMG][/B][/CENTER] <br>" +
        '[CENTER][FONT=times new roman][SIZE=5][SIZE=4][FONT=arial][COLOR=#FF0000][ICODE]Закрыто. [/ICODE][/COLOR][/FONT][/SIZE][/SIZE][/FONT][/CENTER]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Отказ биографии (Плагиат)',
      content:
		'[CENTER][SIZE=4][FONT=times new roman][COLOR=#FFFFFF]{{ greeting }}, уважаемый(-ая) {{ user.mention }}.[/COLOR][/FONT][/SIZE] <br><br>' +
        "[FONT=times new roman][COLOR=#FFFFFF][SIZE=4]Ваша RolePlay биография получает статус – [COLOR=#FF0000]Отказано[/color].<br>Причиной отказа послужило – Плагиат.<br>[SPOILER=Примечание]Запрещено полное и частичное копирование биографий из данного раздела или из разделов RP биографий других серверов.[/SPOILER][/FONT][B][IMG width=695px]https://i.postimg.cc/mrnnkJw9/1000015253.png[/IMG][/B][/CENTER] <br>" +
        '[CENTER][FONT=times new roman][SIZE=5][SIZE=4][FONT=arial][COLOR=#FF0000][ICODE]Закрыто. [/ICODE][/COLOR][/FONT][/SIZE][/SIZE][/FONT][/CENTER]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Отказ биографии (Мало информации)',
      content:
		'[CENTER][SIZE=4][FONT=times new roman][COLOR=#FFFFFF]{{ greeting }}, уважаемый(-ая) {{ user.mention }}.[/COLOR][/FONT][/SIZE] <br><br>' +
        "[FONT=times new roman][COLOR=#FFFFFF][SIZE=4]Ваша RolePlay биография получает статус – [COLOR=#FF0000]Отказано[/color].<br>Причиной отказа послужило – Недостаточно RP информации.<br>[SPOILER=Примечание]Пункты «Детство», «Юность и взрослая жизнь», «Настоящее время» требуется расписать максимально подробно.[/SPOILER][/FONT][B][IMG width=695px]https://i.postimg.cc/mrnnkJw9/1000015253.png[/IMG][/B][/CENTER] <br>" +
        '[CENTER][FONT=times new roman][SIZE=5][SIZE=4][FONT=arial][COLOR=#FF0000][ICODE]Закрыто. [/ICODE][/COLOR][/FONT][/SIZE][/SIZE][/FONT][/CENTER]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
},
    {
      title: 'Отказ биографии (не по форме)',
      content:
		'[CENTER][SIZE=4][FONT=times new roman][COLOR=#FFFFFF]{{ greeting }}, уважаемый(-ая) {{ user.mention }}.[/COLOR][/FONT][/SIZE] <br><br>' +
        "[FONT=times new roman][COLOR=#FFFFFF][SIZE=4]Ваша RolePlay биография получает статус – [COLOR=#FF0000]Отказано[/color].<br>Причиной отказа послужило – биография составлена не по форме.<br>[SPOILER=Форма подачи биографии]Имя Фамилия:<br>Пол:<br>Национальность:<br>Возраст:<br>Дата и место рождения:<br>Семья:<br>Место текущего проживания:<br>Описание внешности:<br>Особенности характера:<br>Детство:<br>Юность и взрослая жизнь:<br>Настоящее время:<br>Хобби:​[/SPOILER][/FONT][B][IMG width=695px]https://i.postimg.cc/mrnnkJw9/1000015253.png[/IMG][/B][/CENTER] <br>" +
        '[CENTER][FONT=times new roman][SIZE=5][SIZE=4][FONT=arial][COLOR=#FF0000][ICODE]Закрыто. [/ICODE][/COLOR][/FONT][/SIZE][/SIZE][/FONT][/CENTER]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
     },
    {
      title: 'Отказ биографии (Не от 1-го лица)',
      content:
		'[CENTER][SIZE=4][FONT=times new roman][COLOR=#FFFFFF]{{ greeting }}, уважаемый(-ая) {{ user.mention }}.[/COLOR][/FONT][/SIZE] <br><br>' +
        "[FONT=times new roman][COLOR=#FFFFFF][SIZE=4]Ваша RolePlay биография получает статус – [COLOR=#FF0000]Отказано[/color].<br>Причиной отказа послужило – написание биографии от 3-его лица.<br>[SPOILER=Примечание] Биография должна быть написана от первого лица персонажа.[/SPOILER][/FONT][B][IMG width=695px]https://i.postimg.cc/mrnnkJw9/1000015253.png[/IMG][/B][/CENTER] <br>" +
        '[CENTER][FONT=times new roman][SIZE=5][SIZE=4][FONT=arial][COLOR=#FF0000][ICODE]Закрыто. [/ICODE][/COLOR][/FONT][/SIZE][/SIZE][/FONT][/CENTER]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Отказ биографии (NonRP nickname)',
      content:
		'[CENTER][SIZE=4][FONT=times new roman][COLOR=#FFFFFF]{{ greeting }}, уважаемый(-ая) {{ user.mention }}.[/COLOR][/FONT][/SIZE] <br><br>' +
        "[FONT=times new roman][COLOR=#FFFFFF][SIZE=4]Ваша RolePlay биография получает статус – [COLOR=#FF0000]Отказано[/color].<br>Причиной отказа послужило – У вашего персонажа NonRP nickname.<br>[SPOILER=Примечание] Запрещено создание Role Play биографии, если у Вас NonRolePlay никнейм.[/SPOILER][/FONT][B][IMG width=695px]https://i.postimg.cc/mrnnkJw9/1000015253.png[/IMG][/B][/CENTER] <br>" +
        '[CENTER][FONT=times new roman][SIZE=5][SIZE=4][FONT=arial][COLOR=#FF0000][ICODE]Закрыто. [/ICODE][/COLOR][/FONT][/SIZE][/SIZE][/FONT][/CENTER]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Биаграфия отказ (Заголовок не по форме)',
      content:
		'[CENTER][SIZE=4][FONT=times new roman][COLOR=#FFFFFF]{{ greeting }}, уважаемый(-ая) {{ user.mention }}.[/COLOR][/FONT][/SIZE] <br><br>' +
        "[FONT=times new roman][COLOR=#FFFFFF][SIZE=4]Ваша RolePlay биография получает статус – [COLOR=#FF0000]Отказано[/color].<br>Причиной отказа послужило – не правильное написание заголовка биографии.<br>[SPOILER=Примечание] Заголовок создаваемой темы должен быть написан строго по данной форме: “RolePlay биография гражданина Имя Фамилия.“[/SPOILER][/FONT][B][IMG width=695px]https://i.postimg.cc/mrnnkJw9/1000015253.png[/IMG][/B][/CENTER] <br>" +
        '[CENTER][FONT=times new roman][SIZE=5][SIZE=4][FONT=arial][COLOR=#FF0000][ICODE]Закрыто. [/ICODE][/COLOR][/FONT][/SIZE][/SIZE][/FONT][/CENTER]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Отказ биографии (возраст не совпадает с датой)',
      content:
		'[CENTER][SIZE=4][FONT=times new roman][COLOR=#FFFFFF]{{ greeting }}, уважаемый(-ая) {{ user.mention }}.[/COLOR][/FONT][/SIZE] <br><br>' +
        "[FONT=times new roman][COLOR=#FFFFFF][SIZE=4]Ваша RolePlay биография получает статус – [COLOR=#FF0000]Отказано[/color].<br>Причиной отказа послужило – возраст не совпадает с датой рождения.[/FONT][B][IMG width=695px]https://i.postimg.cc/mrnnkJw9/1000015253.png[/IMG][/B][/CENTER] <br>" +
        '[CENTER][FONT=times new roman][SIZE=5][SIZE=4][FONT=arial][COLOR=#FF0000][ICODE]Закрыто. [/ICODE][/COLOR][/FONT][/SIZE][/SIZE][/FONT][/CENTER]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
       },
    {
      title: 'Отказ биографии (возраст менее 18)',
      content:
		'[CENTER][SIZE=4][FONT=times new roman][COLOR=#FFFFFF]{{ greeting }}, уважаемый(-ая) {{ user.mention }}.[/COLOR][/FONT][/SIZE] <br><br>' +
        "[FONT=times new roman][COLOR=#FFFFFF][SIZE=4]Ваша RolePlay биография получает статус – [COLOR=#FF0000]Отказано[/color].<br>Причиной отказа послужило – возраст персонажа менее 18 лет.[/FONT][B][IMG width=695px]https://i.postimg.cc/mrnnkJw9/1000015253.png[/IMG][/B][/CENTER] <br>" +
        '[CENTER][FONT=times new roman][SIZE=5][SIZE=4][FONT=arial][COLOR=#FF0000][ICODE]Закрыто. [/ICODE][/COLOR][/FONT][/SIZE][/SIZE][/FONT][/CENTER]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Отказ биографии (живет не в Нижегородской области)',
      content:
		'[CENTER][SIZE=4][FONT=times new roman][COLOR=#FFFFFF]{{ greeting }}, уважаемый(-ая) {{ user.mention }}.[/COLOR][/FONT][/SIZE] <br><br>' +
        "[FONT=times new roman][COLOR=#FFFFFF][SIZE=4]Ваша RolePlay биография получает статус – [COLOR=#FF0000]Отказано[/color].<br>Причиной отказа послужило – место проживания не в Нижегородской области. [/FONT][B][IMG width=695px]https://i.postimg.cc/mrnnkJw9/1000015253.png[/IMG][/B][/CENTER] <br>" +
        '[CENTER][FONT=times new roman][SIZE=5][SIZE=4][FONT=arial][COLOR=#FF0000][ICODE]Закрыто. [/ICODE][/COLOR][/FONT][/SIZE][/SIZE][/FONT][/CENTER]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Отказ биографии (Грам. ошибки)',
      content:
		'[CENTER][SIZE=4][FONT=times new roman][COLOR=#FFFFFF]{{ greeting }}, уважаемый(-ая) {{ user.mention }}.[/COLOR][/FONT][/SIZE] <br><br>' +
        "[FONT=times new roman][COLOR=#FFFFFF][SIZE=4]Ваша RolePlay биография получает статус – [COLOR=#FF0000]Отказано[/color].<br>Причиной отказа послужило – грамматические ошибки.[/FONT][B][IMG width=695px]https://i.postimg.cc/mrnnkJw9/1000015253.png[/IMG][/B][/CENTER] <br>" +
        '[CENTER][FONT=times new roman][SIZE=5][SIZE=4][FONT=arial][COLOR=#FF0000][ICODE]Закрыто. [/ICODE][/COLOR][/FONT][/SIZE][/SIZE][/FONT][/CENTER]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Отказ биографии (Не все заполнил)',
      content:
		'[CENTER][SIZE=4][FONT=times new roman][COLOR=#FFFFFF]{{ greeting }}, уважаемый(-ая) {{ user.mention }}.[/COLOR][/FONT][/SIZE] <br><br>' +
        "[FONT=times new roman][COLOR=#FFFFFF][SIZE=4]Ваша RolePlay биография получает статус – [COLOR=#FF0000]Отказано[/color].<br>Причиной отказа послужило – не полное заполнение предоставленной формы.[/FONT][B][IMG width=695px]https://i.postimg.cc/mrnnkJw9/1000015253.png[/IMG][/B][/CENTER] <br>" +
        '[CENTER][FONT=times new roman][SIZE=5][SIZE=4][FONT=arial][COLOR=#FF0000][ICODE]Закрыто. [/ICODE][/COLOR][/FONT][/SIZE][/SIZE][/FONT][/CENTER]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Отказ биографии (Изображение из себя героя)',
      content:
		'[CENTER][SIZE=4][FONT=times new roman][COLOR=#FFFFFF]{{ greeting }}, уважаемый(-ая) {{ user.mention }}.[/COLOR][/FONT][/SIZE] <br><br>' +
        "[FONT=times new roman][COLOR=#FFFFFF][SIZE=4]Ваша RolePlay биография получает статус – [COLOR=#FF0000]Отказано[/color].<br>Причиной отказа послужило – Изображение из себя героя.[/FONT][B][IMG width=695px]https://i.postimg.cc/mrnnkJw9/1000015253.png[/IMG][/B][/CENTER] <br>" +
        '[CENTER][FONT=times new roman][SIZE=5][SIZE=4][FONT=arial][COLOR=#FF0000][ICODE]Закрыто. [/ICODE][/COLOR][/FONT][/SIZE][/SIZE][/FONT][/CENTER]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Отказ биографии (Уже на рассмотрении)',
      content:
		'[CENTER][SIZE=4][FONT=times new roman][COLOR=#FFFFFF]{{ greeting }}, уважаемый(-ая) {{ user.mention }}.[/COLOR][/FONT][/SIZE] <br><br>' +
        "[FONT=times new roman][COLOR=#FFFFFF][SIZE=4]Ваша RolePlay биография уже находится на рассмотрении, дополните её в предыдущей теме[/COLOR].[/FONT][B][IMG width=695px]https://i.postimg.cc/mrnnkJw9/1000015253.png[/IMG][/B][/CENTER] <br>" +
        '[CENTER][FONT=times new roman][SIZE=5][SIZE=4][FONT=arial][COLOR=#FF0000][ICODE]Закрыто. [/ICODE][/COLOR][/FONT][/SIZE][/SIZE][/FONT][/CENTER]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Отказ биографии (Оффтоп)',
      content:
		'[CENTER][SIZE=4][FONT=times new roman][COLOR=#FFFFFF]{{ greeting }}, уважаемый(-ая) {{ user.mention }}.[/COLOR][/FONT][/SIZE] <br><br>' +
        "[FONT=times new roman][COLOR=#FFFFFF][SIZE=4]Ваше обращение никак не относится к сути данного раздела[/color].[/FONT][B][IMG width=695px]https://i.postimg.cc/mrnnkJw9/1000015253.png[/IMG][/B][/CENTER] <br>" +
        '[CENTER][FONT=times new roman][SIZE=5][SIZE=4][FONT=arial][COLOR=#FF0000][ICODE]Закрыто. [/ICODE][/COLOR][/FONT][/SIZE][/SIZE][/FONT][/CENTER]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
     },
    {
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴Ответы на РП ситуации ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
      title: 'РП сита одобрена',
      content:
		'[CENTER][SIZE=4][FONT=times new roman][COLOR=#FFFFFF]{{ greeting }}, уважаемый(-ая) {{ user.mention }}.[/COLOR][/FONT][/SIZE] <br><br>' +
        "[FONT=times new roman][COLOR=#FFFFFF][SIZE=4]Ваша RolePlay ситуация получает статус – [COLOR=#00FF00]Одобрено[/color].[/FONT][B][IMG width=695px]https://i.postimg.cc/mrnnkJw9/1000015253.png[/IMG][/B][/CENTER] <br>" +
        '[CENTER][FONT=times new roman][SIZE=5][SIZE=4][FONT=arial][COLOR=#FFFF00][ICODE]Приятной игры и времяпровождения. [/ICODE][/COLOR][/FONT][/SIZE][/SIZE][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'РП сита отказ',
      content:
		'[CENTER][SIZE=4][FONT=times new roman][COLOR=#FFFFFF]{{ greeting }}, уважаемый(-ая) {{ user.mention }}.[/COLOR][/FONT][/SIZE] <br><br>' +
        "[FONT=times new roman][COLOR=#FFFFFF][SIZE=4]Ваша RolePlay ситуация получает статус – [COLOR=#FF0000]Отказано[/color].[/FONT][B][IMG width=695px]https://i.postimg.cc/mrnnkJw9/1000015253.png[/IMG][/B][/CENTER] <br>" +
        '[CENTER][FONT=times new roman][SIZE=5][SIZE=4][FONT=arial][COLOR=#FF0000][ICODE]Закрыто. [/ICODE][/COLOR][/FONT][/SIZE][/SIZE][/FONT][/CENTER]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'РП сита на доработку',
      content:
		'[CENTER][SIZE=4][FONT=times new roman][COLOR=#FFFFFF]{{ greeting }}, уважаемый(-ая) {{ user.mention }}.[/COLOR][/FONT][/SIZE] <br><br>' +
        "[FONT=times new roman][COLOR=#FFFFFF][SIZE=4]Вам даётся 24 часа на дополнение вашей RolePlay ситуации, в противном случае она получит статус – [COLOR=#FF0000]Отказано[/color].[/FONT][B][IMG width=695px]https://i.postimg.cc/mrnnkJw9/1000015253.png[/IMG][/B][/CENTER] <br>" +
        '[CENTER][FONT=times new roman][SIZE=5][SIZE=4][FONT=arial][COLOR=#FFFF00][ICODE]На рассмотрении. [/ICODE][/COLOR][/FONT][/SIZE][/SIZE][/FONT][/CENTER]',
      prefix: PIN_PREFIX,
	  status: 123,
     },
    {
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴Ответы на Неоф РП орги ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
      title: 'Неоф орг одобрена',
      content:
		'[CENTER][SIZE=4][FONT=times new roman][COLOR=#FFFFFF]{{ greeting }}, уважаемый(-ая) {{ user.mention }}.[/COLOR][/FONT][/SIZE] <br><br>' +
        "[FONT=times new roman][COLOR=#FFFFFF][SIZE=4]Ваша неофициальная RP организация получает статус – [COLOR=#00FF00]Одобрено[/color].[/FONT][B][IMG width=695px]https://i.postimg.cc/mrnnkJw9/1000015253.png[/IMG][/B][/CENTER] <br>" +
        '[CENTER][FONT=times new roman][SIZE=5][SIZE=4][FONT=arial][COLOR=#FFFF00][ICODE]Приятной игры и времяпровождения. [/ICODE][/COLOR][/FONT][/SIZE][/SIZE][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Неоф орг отказ',
      content:
		'[CENTER][SIZE=4][FONT=times new roman][COLOR=#FFFFFF]{{ greeting }}, уважаемый(-ая) {{ user.mention }}.[/COLOR][/FONT][/SIZE] <br><br>' +
        "[FONT=times new roman][COLOR=#FFFFFF][SIZE=4]Ваша Неофициальная RP организация получает статус – [COLOR=#FF0000]Отказано[/color].[/FONT][B][IMG width=695px]https://i.postimg.cc/mrnnkJw9/1000015253.png[/IMG][/B][/CENTER] <br>" +
        '[CENTER][FONT=times new roman][SIZE=5][SIZE=4][FONT=arial][COLOR=#FF0000][ICODE]Закрыто. [/ICODE][/COLOR][/FONT][/SIZE][/SIZE][/FONT][/CENTER]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Неоф орг на доработке',
      content:
		'[CENTER][SIZE=4][FONT=times new roman][COLOR=#FFFFFF]{{ greeting }}, уважаемый(-ая) {{ user.mention }}.[/COLOR][/FONT][/SIZE] <br><br>' +
        "[FONT=times new roman][COLOR=#FFFFFF][SIZE=4]Вам даётся 24 часа на дополнение вашей Неофициальной RP организации, в противном случае она получит статус – [COLOR=#FF0000]Отказано[/color].[/FONT][B][IMG width=695px]https://i.postimg.cc/mrnnkJw9/1000015253.png[/IMG][/B][/CENTER] <br>" +
        '[CENTER][FONT=times new roman][SIZE=5][SIZE=4][FONT=arial][COLOR=#FFFF00][ICODE]На рассмотрении. [/ICODE][/COLOR][/FONT][/SIZE][/SIZE][/FONT][/CENTER]',
      prefix: PIN_PREFIX,
	  status: 123,
      },
    {
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴ В другой раздел ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',  
    },
    {
      title: 'Переношу вашу тему в нужный раздел',
      content:
		'[CENTER][SIZE=4][FONT=times new roman][COLOR=#FFFFFF]{{ greeting }}, уважаемый(-ая) {{ user.mention }}.[/COLOR][/FONT][/SIZE] <br><br>' +
        "[FONT=times new roman][COLOR=#FFFFFF][SIZE=4]Вы ошиблись разделом, переношу вашу тему в нужный раздел.[/color][/FONT][B][IMG width=695px]https://i.postimg.cc/mrnnkJw9/1000015253.png[/IMG][/B][/CENTER] <br>" +
        '[CENTER][FONT=times new roman][SIZE=5][SIZE=4][FONT=arial][COLOR=#FF0000][ICODE]Перемещено. [/ICODE][/COLOR][/FONT][/SIZE][/SIZE][/FONT][/CENTER]',
    },
    {
      title: 'В жалобы на Адм',
      content:
		'[CENTER][SIZE=4][FONT=times new roman][COLOR=#FFFFFF]{{ greeting }}, уважаемый(-ая) {{ user.mention }}.[/COLOR][/FONT][/SIZE] <br><br>' +
        "[FONT=times new roman][COLOR=#FFFFFF][SIZE=4]Вы ошиблись разделом.<br>Обратитесь в раздел жалоб на администрацию – [URL=https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B0%D0%B4%D0%BC%D0%B8%D0%BD%D0%B8%D1%81%D1%82%D1%80%D0%B0%D1%86%D0%B8%D1%8E.2829/]кликабельно[/URL].[/color][/FONT][B][IMG width=695px]https://i.postimg.cc/mrnnkJw9/1000015253.png[/IMG][/B][/CENTER] <br>" +
        '[CENTER][FONT=times new roman][SIZE=5][SIZE=4][FONT=arial][COLOR=#FF0000][ICODE]Закрыто. [/ICODE][/COLOR][/FONT][/SIZE][/SIZE][/FONT][/CENTER]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'В жалобы на Лидеров',
      content:
		'[CENTER][SIZE=4][FONT=times new roman][COLOR=#FFFFFF]{{ greeting }}, уважаемый(-ая) {{ user.mention }}.[/COLOR][/FONT][/SIZE] <br><br>' +
        "[FONT=times new roman][COLOR=#FFFFFF][SIZE=4]Вы ошиблись разделом.<br>Обратитесь в раздел жалоб на лидеров – [URL=https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%BB%D0%B8%D0%B4%D0%B5%D1%80%D0%BE%D0%B2.2830/]кликабельно[/URL].[/color][/FONT][B][IMG width=695px]https://i.postimg.cc/mrnnkJw9/1000015253.png[/IMG][/B][/CENTER] <br>" +
        '[CENTER][FONT=times new roman][SIZE=5][SIZE=4][FONT=arial][COLOR=#FF0000][ICODE]Закрыто. [/ICODE][/COLOR][/FONT][/SIZE][/SIZE][/FONT][/CENTER]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'В жалобы на игроков',
      content:
		'[CENTER][SIZE=4][FONT=times new roman][COLOR=#FFFFFF]{{ greeting }}, уважаемый(-ая) {{ user.mention }}.[/COLOR][/FONT][/SIZE] <br><br>' +
        "[FONT=times new roman][COLOR=#FFFFFF][SIZE=4]Вы ошиблись разделом.<br>Обратитесь в раздел жалоб на игроков – [URL=https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B8%D0%B3%D1%80%D0%BE%D0%BA%D0%BE%D0%B2.2831/]кликабельно[/URL].[/color][/FONT][B][IMG width=695px]https://i.postimg.cc/mrnnkJw9/1000015253.png[/IMG][/B][/CENTER] <br>" +
        '[CENTER][FONT=times new roman][SIZE=5][SIZE=4][FONT=arial][COLOR=#FF0000][ICODE]Закрыто. [/ICODE][/COLOR][/FONT][/SIZE][/SIZE][/FONT][/CENTER]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'В обжалование наказаний',
      content:
		'[CENTER][SIZE=4][FONT=times new roman][COLOR=#FFFFFF]{{ greeting }}, уважаемый(-ая) {{ user.mention }}.[/COLOR][/FONT][/SIZE] <br><br>' +
        "[FONT=times new roman][COLOR=#FFFFFF][SIZE=4]Вы ошиблись разделом.<br>Обратитесь в раздел обжалований наказаний – [URL=https://forum.blackrussia.online/forums/%D0%9E%D0%B1%D0%B6%D0%B0%D0%BB%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D0%B5-%D0%BD%D0%B0%D0%BA%D0%B0%D0%B7%D0%B0%D0%BD%D0%B8%D0%B9.2832/]кликабельно[/URL].[/color][/FONT][B][IMG width=695px]https://i.postimg.cc/mrnnkJw9/1000015253.png[/IMG][/B][/CENTER] <br>" +
        '[CENTER][FONT=times new roman][SIZE=5][SIZE=4][FONT=arial][COLOR=#FF0000][ICODE]Закрыто. [/ICODE][/COLOR][/FONT][/SIZE][/SIZE][/FONT][/CENTER]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'В жалобы на тех. спецов',
      content:
		'[CENTER][SIZE=4][FONT=times new roman][COLOR=#FFFFFF]{{ greeting }}, уважаемый(-ая) {{ user.mention }}.[/COLOR][/FONT][/SIZE] <br><br>' +
        "[FONT=times new roman][COLOR=#FFFFFF][SIZE=4]Вы ошиблись разделом.<br>Обратитесь в раздел жалоб на технических специалистов – [URL=https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D1%82%D0%B5%D1%85%D0%BD%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%B8%D1%85-%D1%81%D0%BF%D0%B5%D1%86%D0%B8%D0%B0%D0%BB%D0%B8%D1%81%D1%82%D0%BE%D0%B2.490/]кликабельно[/URL][/color][/FONT][B][IMG width=695px]https://i.postimg.cc/mrnnkJw9/1000015253.png[/IMG][/B][/CENTER] <br>" +
        '[CENTER][FONT=times new roman][SIZE=5][SIZE=4][FONT=arial][COLOR=#FF0000][ICODE]Закрыто. [/ICODE][/COLOR][/FONT][/SIZE][/SIZE][/FONT][/CENTER]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'В тех. раздел',
      content:
		'[CENTER][SIZE=4][FONT=times new roman][COLOR=#FFFFFF]{{ greeting }}, уважаемый(-ая) {{ user.mention }}.[/COLOR][/FONT][/SIZE] <br><br>' +
        "[FONT=times new roman][COLOR=#FFFFFF][SIZE=4]Вы ошиблись разделом.<br>Обратитесь в технический раздел – [URL=https://forum.blackrussia.online/forums/%D0%A2%D0%B5%D1%85%D0%BD%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%B8%D0%B9-%D1%80%D0%B0%D0%B7%D0%B4%D0%B5%D0%BB.22/]кликабельно[/URL].[/color][/FONT][B][IMG width=695px]https://i.postimg.cc/mrnnkJw9/1000015253.png[/IMG][/B][/CENTER] <br>" +
        '[CENTER][FONT=times new roman][SIZE=5][SIZE=4][FONT=arial][COLOR=#FF0000][ICODE]Закрыто. [/ICODE][/COLOR][/FONT][/SIZE][/SIZE][/FONT][/CENTER]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'В жалобы на сотрудников орги',
      content:
		'[CENTER][SIZE=4][FONT=times new roman][COLOR=#FFFFFF]{{ greeting }}, уважаемый(-ая) {{ user.mention }}.[/COLOR][/FONT][/SIZE] <br><br>' +
        "[FONT=times new roman][COLOR=#FFFFFF][SIZE=4]Вы ошиблись разделом.<br>Обратитесь в раздел жалоб на сотрудников данной организации.[/color][/FONT][B][IMG width=695px]https://i.postimg.cc/mrnnkJw9/1000015253.png[/IMG][/B][/CENTER] <br>" +
        '[CENTER][FONT=times new roman][SIZE=5][SIZE=4][FONT=arial][COLOR=#FF0000][ICODE]Закрыто. [/ICODE][/COLOR][/FONT][/SIZE][/SIZE][/FONT][/CENTER]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'В жалобы на Хелперов',
      content:
		'[CENTER][SIZE=4][FONT=times new roman][COLOR=#FFFFFF]{{ greeting }}, уважаемый(-ая) {{ user.mention }}.[/COLOR][/FONT][/SIZE] <br><br>' +
        "[FONT=times new roman][COLOR=#FFFFFF][SIZE=4]Вы ошиблись разделом.<br>Обратитесь в раздел жалоб на Агентов поддержки – [URL=https://forum.blackrussia.online/threads/pskov-helpers-%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%90%D0%B3%D0%B5%D0%BD%D1%82%D0%BE%D0%B2-%D0%9F%D0%BE%D0%B4%D0%B4%D0%B5%D1%80%D0%B6%D0%BA%D0%B8-%D0%94%D0%BB%D1%8F-%D0%93%D0%A1-%D0%97%D0%93%D0%A1.10495167/]кликабельно [/URL].[/color][/FONT][B][IMG width=695px]https://i.postimg.cc/mrnnkJw9/1000015253.png[/IMG][/B][/CENTER] <br>" +
        '[CENTER][FONT=times new roman][SIZE=5][SIZE=4][FONT=arial][COLOR=#FF0000][ICODE]Закрыто. [/ICODE][/COLOR][/FONT][/SIZE][/SIZE][/FONT][/CENTER]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },


];

$(document).ready(() => {
	// Загрузка скрипта для обработки шаблонов
	$('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');

	// Добавление кнопок при загрузке страницы
    addButton('Ответы', 'selectAnswer');

	// Поиск информации о теме
	const threadData = getThreadData();

	$('button#pin').click(() => pasteContent(2, threadData, true));
	$('button#Ga').click(() => pasteContent(8, threadData, true));
	$('button#Rasmotreno').click(() => editThreadData(RASSMOTENO_PREFIX, false));
	$('button#Close').click(() => editThreadData(CLOSE_PREFIX, false));
	$('button#unaccept').click(() => editThreadData(UNACCEPT_PREFIX, false));


$(`button#selectAnswer`).click(() => {
XF.alert(buttonsMarkup(buttons), null, 'ВЫБЕРИТЕ ОТВЕТ');
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

function addButton(name, id) {
$('.button--icon--reply').before(
            `<button type="button" class="button--primary button rippleButton" id="${id}" style="border-radius: 0px 20px; border-color: green; border-style: dashed solid; margin-right: 7px; margin-bottom: 10px; background: green; text-decoration-style: wavy;">${name}</button>`,
);
}

function buttonsMarkup(buttons) {
return `<div class="select_answer">${buttons
  .map(
	(btn, i) =>
	  `<button id="answers-${i}" class="button--primary button ` +
	  `rippleButton" style="border-radius: 10px; margin-right: 10px; margin-bottom: 10px"><span class="button-text">${btn.title}</span></button>`,
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
	  ? 'Здравствуйте'
	  : 11 < hours && hours <= 15
	  ? 'Здравствуйте'
	  : 15 < hours && hours <= 21
	  ? 'Здравствуйте'
	  : 'Здравствуйте',
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
            discussion_open: 0,
			sticky: 1,
			_xfToken: XF.config.csrf,
			_xfRequestUri: document.URL.split(XF.config.url.fullBase)[1],
			_xfWithData: 1,
			_xfResponseType: 'json',
		  }),
		}).then(() => location.reload());
	}
	if(pin == 123){
		fetch(`${document.URL}edit`, {
		  method: 'POST',
		  body: getFormData({
			prefix_id: prefix,
			title: threadTitle,
            discussion_open: 1,
			sticky: 1,
			_xfToken: XF.config.csrf,
			_xfRequestUri: document.URL.split(XF.config.url.fullBase)[1],
			_xfWithData: 1,
			_xfResponseType: 'json',
		  }),
		}).then(() => location.reload());
	}

}


function moveThread(prefix, type) {
// Перемещение темы
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