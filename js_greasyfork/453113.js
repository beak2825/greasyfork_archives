// ==UserScript==
// @name         Скрипт для Технических специалистов | Purple
// @namespace    https://forum.blackrussia.online
// @version      2.1
// @description  Скрипт для Тех.Специалистов
// @author       Timofei_Oleinik
// @match        https://forum.blackrussia.online/index.php?threads/*
// @include      https://forum.blackrussia.online/index.php?threads/
// @grant        none
// @license 	 MIT
// @collaborator Basis of Antonio Carrizo and consultant Rosenfeld
// @icon https://icons.iconarchive.com/icons/thesquid.ink/free-flat-sample/128/support-icon.png
// @copyright 2022, BLACK RUSSIA (https://vk.com/blackrussia.online)
// @downloadURL https://update.greasyfork.org/scripts/453113/%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%A2%D0%B5%D1%85%D0%BD%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%B8%D1%85%20%D1%81%D0%BF%D0%B5%D1%86%D0%B8%D0%B0%D0%BB%D0%B8%D1%81%D1%82%D0%BE%D0%B2%20%7C%20Purple.user.js
// @updateURL https://update.greasyfork.org/scripts/453113/%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%A2%D0%B5%D1%85%D0%BD%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%B8%D1%85%20%D1%81%D0%BF%D0%B5%D1%86%D0%B8%D0%B0%D0%BB%D0%B8%D1%81%D1%82%D0%BE%D0%B2%20%7C%20Purple.meta.js
// ==/UserScript==
(function () {
  'use strict';
const UNACCEPT_PREFIX = 4; // Prefix that will be set when thread closes
const ACCEPT_PREFIX = 6; // Prefix that will be set when thread solved
const PIN_PREFIX = 2; // Prefix that will be set when thread pins
const COMMAND_PREFIX = 10; // Prefix that will be set when thread send to project team
const WATCHED_PREFIX = 9;
const CLOSE_PREFIX = 7;
const buttons = [
	{
	  title: 'Приветствие',
	  content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
		'[CENTER]{{ greeting }}, уважаемый(-ая)[B] {{ user.name }}[/B]![/CENTER]<br><br>' +
        '[CENTER][/CENTER]'
	},
	{
	  title: 'Правила раздела',
	  content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
		'[CENTER]{{ greeting }}, уважаемый(-ая)[B] {{ user.name }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Пожалуйста, убедительная просьба, ознакомиться с назначением данного раздела в котором Вы создали тему, так как Ваш запрос никоим образом не относится к технической проблеме.[/CENTER]<br><br>" +
        '[CENTER]Отказано, закрыто.[/CENTER]',

        status: false,
	},
    {
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴Правила RP процесса ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
	  	},
        {
                  title: 'NonRP Обман',
      content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
		'[Color=#00FF00][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER][Color=#00FFFF][FONT=courier new]Игрок будет наказан по пункту правил:<br>2.05. Запрещены любые OOC обманы и их попытки, а также любые IC обманы с нарушением Role Play правил и логики [Color=#00FF00]| PermBan[/color] [/COLOR][/FONT][/CENTER] <br>" +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/XJ5Yp4yv/giphy.gif[/img][/url][/CENTER]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
              title: 'сборка',
      content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
		'[Color=#00FF00][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER][Color=#00FFFF][FONT=courier new]Игрок будет наказан по пункту правил:<br>2.22. Запрещено хранить / использовать / распространять стороннее программное обеспечение или любые другие средства, позволяющие получить преимущество над другими игроками [Color=#00FF00] | Ban 15 - 30 дней / PermBan [/color] [/COLOR][/FONT][/CENTER] <br>" +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/XJ5Yp4yv/giphy.gif[/img][/url][/CENTER]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
           title: 'мат в названии',
      content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
		'[Color=#00FF00][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER][Color=#00FFFF][FONT=courier new]Игрок будет наказан по пункту правил:<br>2.53. Запрещено устанавливать названия для внутриигровых ценностей с использованием нецензурной лексики, оскорблений, слов политической или религиозной наклонности [Color=#00FF00] | Ban 1 день / При повторном нарушении обнуление бизнеса [/color] [/COLOR][/FONT][/CENTER] <br>" +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/XJ5Yp4yv/giphy.gif[/img][/url][/CENTER]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
              title: 'баг с аним',
      content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
		'[Color=#00FF00][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER][Color=#00FFFF][FONT=courier new]Игрок будет наказан по пункту правил:<br>2.55. Запрещается багоюз связанный с анимацией в любых проявлениях. [Color=#00FF00] | Jail 60 / 120 минут [/color] [/COLOR][/FONT][/CENTER] <br>" +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/XJ5Yp4yv/giphy.gif[/img][/url][/CENTER]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
             title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴Chat ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
              title: 'слив',
      content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
		'[Color=#00FF00][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/FONT][/CENTER]<br>' +
        "[CENTER][Color=#00FFFF][FONT=courier new]Игрок будет наказан по пункту правил:<br>3.08. Запрещены любые формы «слива» посредством использования глобальных чатов [Color=#00FF00] | PermBan [/color] [/COLOR][/FONT][/CENTER] <br>" +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/XJ5Yp4yv/giphy.gif[/img][/url][/CENTER]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
              title: 'ввод в заблуждение',
      content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
		'[Color=#00FF00][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/FONT][/CENTER]<br>' +
        "[CENTER][Color=#00FFFF][FONT=courier new]Игрок будет наказан по пункту правил:<br>3.11. Запрещено введение игроков проекта в заблуждение путем злоупотребления командами [Color=#00FF00] | Ban 15 - 30 дней / PermBan[/color] [/COLOR][/FONT][/CENTER] <br>" +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/XJ5Yp4yv/giphy.gif[/img][/url][/CENTER]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
              title: 'полит/религ пропоганда',
      content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
		'[Color=#00FF00][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/FONT][/CENTER]<br>' +
        "[CENTER][Color=#00FFFF][FONT=courier new]Игрок будет наказан по пункту правил:<br>3.18. Запрещено политическое и религиозное пропагандирование [Color=#00FF00] | Mute 120 минут / Ban 10 дней [/color] [/COLOR][/FONT][/CENTER] <br>" +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/XJ5Yp4yv/giphy.gif[/img][/url][/CENTER]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
             title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴NikName ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
              title: 'оск NikName',
      content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
		'[Color=#00FF00][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/FONT][/CENTER]<br>' +
        "[CENTER][Color=#00FFFF][FONT=courier new]Игрок будет наказан по пункту правил:<br>4.09. Запрещено использовать никнейм, содержащий в себе матерные слова или оскорбления (в том числе, завуалированные) [Color=#00FF00] | Устное замечание + смена игрового никнейма / PermBan [/color] [/COLOR][/FONT][/CENTER] <br>" +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/XJ5Yp4yv/giphy.gif[/img][/url][/CENTER]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
              title: 'Feik',
      content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
		'[Color=#00FF00][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/FONT][/CENTER]<br>' +
        "[CENTER][Color=#00FFFF][FONT=courier new]Игрок будет наказан по пункту правил:<br>4.10. Запрещено создавать никнейм, повторяющий или похожий на существующие никнеймы игроков или администраторов по их написанию [Color=#00FF00] | Устное замечание + смена игрового никнейма / PermBan [/color] [/COLOR][/FONT][/CENTER] <br>" +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/XJ5Yp4yv/giphy.gif[/img][/url][/CENTER]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
             title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴Правила форума ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
              title: 'неадекват',
      content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
		'[Color=#00FF00][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/FONT][/CENTER]<br>' +
        "[CENTER][Color=#00FFFF][FONT=courier new]Игрок будет наказан по пункту правил пользования форумом:<br>2.02. Запрещено неадекватное поведение в любой возможной форме, от оскорблений простых пользователей, до оскорбления администрации или других членов команды проекта. [/COLOR][/FONT][/CENTER] <br>" +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/XJ5Yp4yv/giphy.gif[/img][/url][/CENTER]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'травля пользователя',
      content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
		'[Color=#00FF00][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/FONT][/CENTER]<br>' +
        "[CENTER][Color=#00FFFF][FONT=courier new]Игрок будет наказан по пункту правил пользования форумом:<br>2.03. Запрещена массовая травля, то есть агрессивное преследование одного из пользователей данного форума. [/COLOR][/FONT][/CENTER] <br>" +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/XJ5Yp4yv/giphy.gif[/img][/url][/CENTER]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'провокация, розжиг конфликта',
      content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
		'[Color=#00FF00][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/FONT][/CENTER]<br>' +
        "[CENTER][Color=#00FFFF][FONT=courier new]Игрок будет наказан по пункту правил пользования форумом:<br>2.04. Запрещены латентные, то есть скрытные (завуалированные), саркастические сообщения/действия, созданные в целях оскорбления того или иного лица, либо для его провокации и дальнейшего розжига конфликта. [/COLOR][/FONT][/CENTER] <br>" +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/XJ5Yp4yv/giphy.gif[/img][/url][/CENTER]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'реклама',
      content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
		'[Color=#00FF00][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/FONT][/CENTER]<br>' +
        "[CENTER][Color=#00FFFF][FONT=courier new]Игрок будет наказан по пункту правил пользования форумом:<br>2.05. Запрещена совершенно любая реклама любого направления. [/COLOR][/FONT][/CENTER] <br>" +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/XJ5Yp4yv/giphy.gif[/img][/url][/CENTER]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: '18+',
      content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
		'[Color=#00FF00][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/FONT][/CENTER]<br>' +
        "[CENTER][Color=#00FFFF][FONT=courier new]Игрок будет наказан по пункту правил пользования форумом:<br>2.06. Запрещено размещение любого возрастного контента, которые несут в себе интимный, либо насильственный характер, также фотографии содержащие в себе шок-контент, на примере расчленения и тому подобного. [/COLOR][/FONT][/CENTER] <br>" +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/XJ5Yp4yv/giphy.gif[/img][/url][/CENTER]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Flood Offtop',
      content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
		'[Color=#00FF00][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/FONT][/CENTER]<br>' +
        "[CENTER][Color=#00FFFF][FONT=courier new]Игрок будет наказан по пункту правил пользования форумом:<br>2.07. Запрещено флудить, оффтопить во всех разделах которые имеют строгое назначение. [/COLOR][/FONT][/CENTER] <br>" +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/XJ5Yp4yv/giphy.gif[/img][/url][/CENTER]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'религия/политика',
      content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
		'[Color=#00FF00][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/FONT][/CENTER]<br>' +
        "[CENTER][Color=#00FFFF][FONT=courier new]Игрок будет наказан по пункту правил пользования форумом:<br>2.09. Запрещены споры на тему религии/политики. [/COLOR][/FONT][/CENTER] <br>" +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/XJ5Yp4yv/giphy.gif[/img][/url][/CENTER]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'помеха развитию проекта',
      content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
		'[Color=#00FF00][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/FONT][/CENTER]<br>' +
        "[CENTER][Color=#00FFFF][FONT=courier new]Игрок будет наказан по пункту правил пользования форумом:<br>2.14. Запрещены деструктивные действия по отношению к проекту: неконструктивная критика, призывы покинуть проект, попытки нарушить развитие проекта или любые другие действия, способные привести к помехам в игровом процессе. [/COLOR][/FONT][/CENTER] <br>" +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/XJ5Yp4yv/giphy.gif[/img][/url][/CENTER]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'попрошайничество',
      content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
		'[Color=#00FF00][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/FONT][/CENTER]<br>' +
        "[CENTER][Color=#00FFFF][FONT=courier new]Игрок будет наказан по пункту правил пользования форумом:<br>2.16. Запрещено вымогательство или попрошайничество во всех возможных проявлениях. [/COLOR][/FONT][/CENTER] <br>" +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/XJ5Yp4yv/giphy.gif[/img][/url][/CENTER]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'злоуп CapsLock/транслитом',
      content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
		'[Color=#00FF00][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/FONT][/CENTER]<br>' +
        "[CENTER][Color=#00FFFF][FONT=courier new]Игрок будет наказан по пункту правил пользования форумом:<br>2.17. Запрещено злоупотребление Caps Lock`ом или транслитом. [/COLOR][/FONT][/CENTER] <br>" +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/XJ5Yp4yv/giphy.gif[/img][/url][/CENTER]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'дубликат тем',
      content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
		'[Color=#00FF00][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/FONT][/CENTER]<br>' +
        "[CENTER][Color=#00FFFF][FONT=courier new]Игрок будет наказан по пункту правил пользования форумом:<br>2.18. Запрещена публикация дублирующихся тем. [/COLOR][/FONT][/CENTER] <br>" +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/XJ5Yp4yv/giphy.gif[/img][/url][/CENTER]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'бесмысленый/оск NikName фа',
      content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
		'[Color=#00FF00][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/FONT][/CENTER]<br>' +
        "[CENTER][Color=#00FFFF][FONT=courier new]Игрок будет наказан по пункту правил пользования форумом:<br>3.02. Запрещено регистрировать аккаунты с бессмысленными никнеймами и содержащие нецензурные выражения. [/COLOR][/FONT][/CENTER] <br>" +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/XJ5Yp4yv/giphy.gif[/img][/url][/CENTER]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Копия NikName фа на администратоа',
      content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
		'[Color=#00FF00][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/FONT][/CENTER]<br>' +
        "[CENTER][Color=#00FFFF][FONT=courier new]Игрок будет наказан по пункту правил пользования форумом:<br>3.03. Запрещено регистрировать аккаунты с никнеймами похожими на никнеймы администрации. [/COLOR][/FONT][/CENTER] <br>" +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/XJ5Yp4yv/giphy.gif[/img][/url][/CENTER]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
         title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴другой раздел ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
      title: 'в жб на адм',
      content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
		'[Color=#DC143C][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/FONT][/CENTER]<br>' +
        "[CENTER][Color=#00FFFF][FONT=courier new]Вы ошиблись разделом.<br>Обратитесь в раздел [URL='https://forum.blackrussia.online/index.php?forums/Жалобы-на-администрацию.1318/']Жалобы на администрацию[/URL]. [/COLOR][/FONT][/CENTER] <br>" +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/LXK0dYGv/giphy-1.gif[/img][/url][/CENTER]',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'в жб на лд',
      content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
		'[Color=#DC143C][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/FONT][/CENTER]<br>' +
        "[CENTER][Color=#00FFFF][FONT=courier new]Вы ошиблись разделом.<br>Обратитесь в раздел [URL='https://forum.blackrussia.online/index.php?forums/Жалобы-на-лидеров.1319/']Жалобы на лидеров[/URL]. [/COLOR][/FONT][/CENTER] <br>" +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/LXK0dYGv/giphy-1.gif[/img][/url][/CENTER]',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'в обжалования',
      content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
		'[Color=#DC143C][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/FONT][/CENTER]<br>' +
        "[CENTER][Color=#00FFFF][FONT=courier new]Вы ошиблись разделом.<br>Обратитесь в раздел [URL='https://forum.blackrussia.online/index.php?forums/Обжалование-наказаний.1321/']Обжалование наказаний[/URL]. [/COLOR][/FONT][/CENTER] <br>" +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/LXK0dYGv/giphy-1.gif[/img][/url][/CENTER]',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {

      title: 'в жб на теха',
      content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
		'[Color=#DC143C][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/FONT][/CENTER]<br>' +
        "[CENTER][Color=#00FFFF][FONT=courier new]Вы ошиблись разделом.<br>Обратитесь в [URL='https://forum.blackrussia.online/index.php?forums/Жалобы-на-технических-специалистов.490/']Жалобы на технических специалистов[/URL]. [/COLOR][/FONT][/CENTER] <br>" +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/LXK0dYGv/giphy-1.gif[/img][/url][/CENTER]',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
        title: 'Жалобы сервера',
	  content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
		'[CENTER]{{ greeting }}, уважаемый(-ая)[B] {{ user.name }}[/B]![/CENTER]<br><br>' +

    "[LEFT]Обратитесь в раздел «Жалобы» Вашего сервера:<br><br>[URL='https://forum.blackrussia.online/index.php?categories/Жалобы.54/'][B]Сервер №1 | Red[/B] → нажмите сюда[/URL]<br>[URL='https://forum.blackrussia.online/index.php?categories/Жалобы.98/'][B]Сервер №2 | Green[/B] → нажмите сюда[/URL]<br>[URL='https://forum.blackrussia.online/index.php?categories/Жалобы.138/'][B]Сервер №3 | Blue[/B] → нажмите сюда[/URL]<br>[URL='https://forum.blackrussia.online/index.php?categories/Жалобы.174/'][B]Сервер №4 | Yellow[/B] → нажмите сюда[/URL]<br>[URL='https://forum.blackrussia.online/index.php?categories/Жалобы.251/'][B]Сервер №5 | Orange[/B] → нажмите сюда[/URL]<br>[URL='https://forum.blackrussia.online/index.php?categories/Жалобы.291/'][B]Сервер №6 | Purple[/B] → нажмите сюда[/URL]<br>[URL='https://forum.blackrussia.online/index.php?categories/Жалобы.331/'][B]Сервер №7 | Lime[/B] → нажмите сюда[/URL]<br>[URL='https://forum.blackrussia.online/index.php?categories/Жалобы.373/'][B]Сервер №8 | Pink[/B] → нажмите сюда[/URL]<br>[URL='https://forum.blackrussia.online/index.php?categories/Жалобы.414/'][B]Сервер №9 | Cherry[/B] → нажмите сюда[/URL]<br>[URL='https://forum.blackrussia.online/index.php?categories/Жалобы.467/'][B]Сервер №10 | Black[/B] → нажмите сюда[/URL]<br>[URL='https://forum.blackrussia.online/index.php?categories/Жалобы.498/'][B]Сервер №11 | Indigo[/B] → нажмите сюда[/URL]<br>[URL='https://forum.blackrussia.online/index.php?categories/Жалобы.654/'][B]Сервер №12 | White[/B] → нажмите сюда[/URL]<br>[URL='https://forum.blackrussia.online/index.php?categories/Жалобы.655/'][B]Сервер №13 | Magenta[/B] → нажмите сюда[/URL]<br>[URL='https://forum.blackrussia.online/index.php?forums/Жалобы.619/'][B]Сервер №14 | Crimson[/B] → нажмите сюда[/URL]<br>[URL='https://forum.blackrussia.online/index.php?categories/Жалобы.700/'][B]Сервер №15 | Gold[/B] → нажмите сюда[/URL]<br>[URL='https://forum.blackrussia.online/index.php?categories/Жалобы.720/'][B]Сервер №16 | Azure[/B] → нажмите сюда[/URL]<br>[URL='https://forum.blackrussia.online/index.php?categories/Жалобы.763/'][B]Сервер №17 | Platinum[/B] → нажмите сюда[/URL]<br>[URL='https://forum.blackrussia.online/index.php?forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B.822/'] [B] Сервер №18 | Aqua[/B] → нажмите сюда[/URL]<br>[URL='https://forum.blackrussia.online/index.php?forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B.863/'][B]Сервер №19 | Gray[/B] → нажмите сюда[/URL]<br>[URL='https://forum.blackrussia.online/index.php?forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B.932/'] [B]Сервер №20 | Ice [/B] → нажмите сюда[/URL]<br>[URL='https://forum.blackrussia.online/index.php?forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B.972/'] [B]Сервер №21 | Chilli [/B] → нажмите сюда[/URL]<br>[URL='https://forum.blackrussia.online/index.php?forums/Сервер-№22-choco.1009/'] [B]Сервер №22 | Choco [/B] → нажмите сюда[/URL]<br><br>" +
        '[CENTER]Отказано, закрыто.[/CENTER]',
        prefix: UNACCEPT_PREFIX,
        status: true,
	},
	{
             title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴Проблемы сервера ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
	  title: 'Краш/вылет',
	  content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
		'[CENTER]{{ greeting }}, уважаемый(-ая)[B] {{ user.name }}[/B]![/CENTER]<br><br>' +
		"[CENTER]В том случае, если Вы вылетели из игры во время игрового процесса (произошел краш), в обязательном порядке необходимо обратиться в данную тему - https://clck.ru/aqMZu [/CENTER]<br>" +
		"[CENTER][CODE]01. Ваш игровой никнейм: <br> 02. Сервер: <br> 03. Тип проблемы: Обрыв соединения | Проблема с ReCAPTCHA | Краш игры (закрытие игры) | Другое [Выбрать один вариант ответа] <br> 04. Действия, которые привели к этому (при вылетах, по возможности предоставлять место сбоя): <br> 05. Как часто данная проблема: <br> 06. Полное название мобильного телефона: <br> 07. Версия Android: <br> 08. Дата и время (по МСК): <br> 09. Связь с Вами по Telegram/VK:[/CODE]<br><br>" +
		'[CENTER]Решено, заполните данную форму в теме, указанной выше.[/CENTER]',
	},
	{

	  title: 'Сервер не отвечает',
	  content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
	    '[CENTER]{{ greeting }}, уважаемый(-ая)[B] {{ user.name }}[/B]![/CENTER]<br><br>' +
	    "[CENTER]Если у Вас встречаются такие проблемы, как «Сервер не отвечает», не отображаются сервера в лаунчере, не удаётся выполнить вход на сайт/форум, попробуйте совершить следующие действия: <br><br>" +
	    "[LEFT]• Сменить IP-адрес любыми средствами; <br>" +
   "[LEFT]• Переключиться на Wi-Fi/мобильный интернет или на любую доступную сеть; <br>"+
    "[LEFT]• Использование VPN; <br>"+
    "[LEFT]• Перезагрузка роутера.<br><br>" +

"[CENTER]Если методы выше не помогли, то переходим к следующим шагам: <br><br>" +

  '[LEFT]1. Устанавливаем приложение «1.1.1.1: Faster & Safer Internet» Ссылка: https://clck.ru/ZP6Av и переходим в него.<br>'+
  '[LEFT]2. Соглашаемся со всей политикой приложения.<br>'+
  '[LEFT]3. Нажимаем на ползунок и ждем, когда текст изменится на «Подключено».<br>'+
  '[LEFT]4. Проверяем: Отображаются ли серверы? Удается ли выполнить вход в игру? Работают ли другие источники (сайт, форум)? <br><br>' +

  "[CENTER]📹 Включение продемонстрировано на видео: https://youtu.be/Wft0j69b9dk <br><br>" +
	    '[CENTER]Рассмотрено.[/CENTER]',
	},
	{
	  title: 'Проблема будет исправлена',
	  content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
		'[CENTER]{{ greeting }}, уважаемый(-ая)[B] {{ user.name }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Данная недоработка будет проверена и исправлена. Спасибо, ценим Ваш вклад.<br><br>" +
		'[CENTER]Рассмотрено.[/CENTER]',
	},
	{
	  title: 'Известно о проблеме',
	  content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
		'[CENTER]{{ greeting }}, уважаемый(-ая)[B] {{ user.name }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Команде проекта уже известно о данной проблеме, она обязательно будет рассмотрена и исправлена. Спасибо за Ваше обращение!<br><br>" +
		'[CENTER]Закрыто.[/CENTER]',
	},
  {
           title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴Передача жалобы ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
	  title: 'Передано на тестирование',
	  content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
		'[CENTER]{{ greeting }}, уважаемый(-ая)[B] {{ user.name }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Благодарим за уведомление о недоработке. Ваша тема  находится в процессе тестирования.<br><br>" +
		'[CENTER]На рассмотрении.[/CENTER]',
	},
	{
	  title: 'Команде проекта',
	  content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
		'[CENTER]{{ greeting }}, уважаемый(-ая)[B] {{ user.name }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Ваша тема закреплена и находится на рассмотрении. Пожалуйста, ожидайте выноса вердикта команды проекта.<br><br>" +
		'[CENTER]Создавать новые темы с данной проблемой — не нужно, ожидайте ответа в данной теме. Если проблема решится - Вы всегда можете уведомить нас о ее решении.[/CENTER]',
	},
	{
	  title: 'Логировщику',
	  content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
	    '[CENTER]{{ greeting }}, уважаемый(-ая)[B] {{ user.name }}[/B]![/CENTER]<br><br>' +
	    "[CENTER]Ваша тема закреплена и находится на проверке и выявление недоработки. Пожалуйста, ожидайте ответа в данной теме.<br><br>" +
	    '[CENTER]Создавать новые темы с данной проблемой — не нужно.[/CENTER]',
	},
	{
             title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴отказ жалобы ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
      title: 'Мало док-ев',
      content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
		'[Color=#DC143C][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/FONT][/CENTER]<br>' +
        "[CENTER][Color=#00FFFF][FONT=courier new]Недостаточно доказательств на нарушение от данного игрока. [/COLOR][/FONT][/CENTER] <br>" +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/LXK0dYGv/giphy-1.gif[/img][/url][/CENTER]',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Дубликат',
      content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
		'[Color=#DC143C][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/FONT][/CENTER]<br>' +
        "[CENTER][Color=#00FFFF][FONT=courier new]Дублироване темы.<br>Если вы дальше будете заниматься данной деятельностью (дублированием тем), то ваш форумный аккаунт будет заблокирован. [/COLOR][/FONT][/CENTER] <br>" +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/LXK0dYGv/giphy-1.gif[/img][/url][/CENTER]',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'не по форме',
      content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
		'[Color=#DC143C][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/FONT][/CENTER]<br>' +
        "[CENTER][Color=#00FFFF][FONT=courier new]Ваша жалоба составлена не по форме.<br>Убедительная просьба ознакомиться [URL='https://forum.blackrussia.online/index.php?threads/Правила-подачи-жалоб-на-игроков.2639619/']с правилами подачи жалоб на игроков[/URL]. [/COLOR][/FONT][/CENTER] <br>" +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/LXK0dYGv/giphy-1.gif[/img][/url][/CENTER]',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'заголовок не по форме',
      content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
		'[Color=#DC143C][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/FONT][/CENTER]<br>' +
        "[CENTER][Color=#00FFFF][FONT=courier new]Заголовок вашей жалобы составлен не по форме.<br>Убедительная просьба ознакомиться [URL='https://forum.blackrussia.online/index.php?threads/Правила-подачи-жалоб-на-игроков.2639619/']с правилами подачи жалоб на игроков[/URL]. [/COLOR][/FONT][/CENTER] <br>" +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/LXK0dYGv/giphy-1.gif[/img][/url][/CENTER]',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'нет /time',
      content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
		'[Color=#DC143C][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/FONT][/CENTER]<br>' +
        "[CENTER][Color=#00FFFF][FONT=courier new]На ваших доказательствах отсутствует /time. [/COLOR][/FONT][/CENTER] <br>" +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/LXK0dYGv/giphy-1.gif[/img][/url][/CENTER]',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'более 72-х часов',
      content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
		'[Color=#DC143C][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/FONT][/CENTER]<br>' +
        "[CENTER][Color=#00FFFF][FONT=courier new]Срок написания жалобы составляет три дня (72 часа) с момента совершенного нарушения со стороны игрока сервера. [/COLOR][/FONT][/CENTER] <br>" +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/LXK0dYGv/giphy-1.gif[/img][/url][/CENTER]',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Док-ва соц сеть',
      content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
		'[Color=#DC143C][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/FONT][/CENTER]<br>' +
        "[CENTER][Color=#00FFFF][FONT=courier new]Загрузка доказательств в соц. сети (ВКонтакте, instagram) запрещается, доказательства должны быть загружены на фото/видео хостинги (YouTube, Япикс, imgur). [/COLOR][/FONT][/CENTER] <br>" +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/LXK0dYGv/giphy-1.gif[/img][/url][/CENTER]',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'нет условий сделки',
      content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
		'[Color=#DC143C][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/FONT][/CENTER]<br>' +
        "[CENTER][Color=#00FFFF][FONT=courier new]В ваших доказательствах отсутствуют условия сделки [/COLOR][/FONT][/CENTER] <br>" +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/LXK0dYGv/giphy-1.gif[/img][/url][/CENTER]',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'нужен фрапс',
      content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
		'[Color=#DC143C][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/FONT][/CENTER]<br>' +
        "[CENTER][Color=#00FFFF][FONT=courier new]В таких случаях нужен фрапс. [/COLOR][/FONT][/CENTER] <br>" +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/LXK0dYGv/giphy-1.gif[/img][/url][/CENTER]',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'фрапс обрывается',
      content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
		'[Color=#DC143C][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/FONT][/CENTER]<br>' +
        "[CENTER][Color=#00FFFF][FONT=courier new]Ваш фрапс обрывается, загрузите полный фрапс на ютуб. [/COLOR][/FONT][/CENTER] <br>" +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/LXK0dYGv/giphy-1.gif[/img][/url][/CENTER]',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Док-ва не рабочие',
      content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
		'[Color=#DC143C][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/FONT][/CENTER]<br>' +
        "[CENTER][Color=#00FFFF][FONT=courier new]Доказательства не работают. [/COLOR][/FONT][/CENTER] <br>" +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/LXK0dYGv/giphy-1.gif[/img][/url][/CENTER]',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Нет док-ев',
      content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
		'[Color=#DC143C][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/FONT][/CENTER]<br>' +
        "[CENTER][Color=#00FFFF][FONT=courier new]В вашей жалобе отсутствуют доказательства. [/COLOR][/FONT][/CENTER] <br>" +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/LXK0dYGv/giphy-1.gif[/img][/url][/CENTER]',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Док-ва отредактированы',
      content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
		'[Color=#DC143C][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/FONT][/CENTER]<br>' +
        "[CENTER][Color=#00FFFF][FONT=courier new]Ваши доказательства отредактированы. [/COLOR][/FONT][/CENTER] <br>" +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/LXK0dYGv/giphy-1.gif[/img][/url][/CENTER]',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Жалоба от 3-го лицо',
      content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
		'[Color=#DC143C][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/FONT][/CENTER]<br>' +
        "[CENTER][Color=#00FFFF][FONT=courier new]Жалоба от третьего лица не принимается (жалоба должна быть подана участником ситуации). [/COLOR][/FONT][/CENTER] <br>" +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/LXK0dYGv/giphy-1.gif[/img][/url][/CENTER]',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Долг',
      content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
		'[Color=#DC143C][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/FONT][/CENTER]<br>' +
        "[CENTER][Color=#00FFFF][FONT=courier new]Долг дается на ваш страх и риск. Невозврат долга не наказуем [/COLOR][/FONT][/CENTER] <br>" +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/LXK0dYGv/giphy-1.gif[/img][/url][/CENTER]',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Ошибка сервера',
      content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
		'[Color=#DC143C][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/FONT][/CENTER]<br>' +
        "[CENTER][Color=#00FFFF][QUOTE][FONT=courier new]Вы шиблись сервером, перенаправляю  вашу жалобу на нужный сервер. [/COLOR][/QUOTE][/FONT][/CENTER] <br>",
	  status: false,
            },
            {
             title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴Аккаунт игрока ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
	  title: 'Компенсация',
	  content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
		'[CENTER]{{ greeting }}, уважаемый(-ая)[B] {{ user.name }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Ваше игровое имущество/денежные средства будут восстановлены в течение месяца. Убедительная просьба, не менять никнейм до момента восстановления.<br><br>" +
        '[CENTER]Для активации восстановления используйте команды: /roulette, /recovery.[/CENTER]<br><br>' +
		'[CENTER]Решено.[/CENTER]',
	},
	{
	  title: 'Правила восстановления',
	  content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
		'[CENTER]{{ greeting }}, уважаемый(-ая)[B] {{ user.name }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Пожалуйста, убедительная просьба, ознакомьтесь с правилами восстановлений: https://clck.ru/NeHEQ. Вы создали тему, которая никоим образом не относится к технической проблеме. Имущество не будет восстановлено.[/CENTER]<br><br>" +
		'[CENTER]Отказано, закрыто.[/CENTER]',
	},
    {
	  title: 'Донат',
	  content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
		'[CENTER]{{ greeting }}, уважаемый(-ая)[B] {{ user.name }}[/B]![/CENTER]<br><br>' +
		'[CENTER]Система построена таким образом, что деньги не спишутся, пока наша платформа не уведомит платежную систему о зачислении BLACK COINS. Для проверки зачисления BLACK COINS необходимо ввести в игре команду: /donat.<br><br>' +
        '[CENTER]В остальных же случаях, если не были зачислены BLACK COINS — вероятнее всего, была допущена ошибка при вводе реквизитов. К нашему сожалению, из-за большого количества попыток обмана, мы перестали рассматривать подобные жалобы. Вам необходимо быть внимательными при осуществлении покупок. <br><br>' +
        '[CENTER]Если Вы считаете, что ошибки быть не может и с момента оплаты не прошло более 7 дней, то в обязательном порядке обратитесь в данное сообщество для дальнейшего решения: https://vk.com/br_tech.<br><br>' +
        '[CENTER]Решено.[/CENTER]',
	},
    {
        	  title: 'Восстановление аккаунта',
	  content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
		'[CENTER]{{ greeting }}, уважаемый(-ая)[B] {{ user.name }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Если Вы обезопасили Ваш аккаунт и [U]привязали его к странице во ВКонтакте[/U], то сбросить пароль или пин-код Вы всегда сможете обратившись в официальное сообщество проекта - https://vk.com/blackrussia.online. Напишите «Начать» в личные сообщения группы, затем выберите нужные Вам функции.<br><br>" +
		"[CENTER]Если Вы обезопасили Ваш аккаунт и [U]привязали его к почте[/U], то сбросить пароль или пин-код Вы всегда сможете при вводе пароля на сервере. Выберите кнопку «восст», затем выберите нужные Вам функции.<br><br>" +
        "[CENTER]Если Вы [U]не обезопасили свой аккаунт - его невозможно вернуть[/U]. Игрок самостоятельно несет отвественность за безопаность своего аккаунта. Аккаунт будет заблокирован навсегда.<br><br>" +
        '[CENTER]К сожалению, иногда решение подобных вопросов требует много времени. Надеемся, что Вы сможете восстановить доступ к аккаунту! Рассмотрено.[/CENTER]',
	},
    {
    	  title: 'Слетел аккаунт',
	    content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
        '[CENTER]{{ greeting }}, уважаемый(-ая)[B] {{ user.name }}[/B]![/CENTER]<br><br>' +
        "[CENTER]Аккаунт не может пропасть или аннулироваться просто так. Даже если Вы меняете ник, используете кнопки «починить игру» или «сброс настроек» - Ваш аккаунт не удаляется. Система работает иначе.<br><br>" +
        "[CENTER]Проверьте ввод своих данных: пароль, никнейм и сервер. Зачастую игроки просто забывают ввести актуальные данные и считают, что их аккаунт был удален. Будьте внимательны! Рассмотрено.<br><br>" +
        '[CENTER]Как ввести никнейм (на случай, если сменили в игре, но не поменяли в клиенте): https://youtu.be/c8rhVwkoFaU[/CENTER]'
 },
];

$(document).ready(() => {
// Загрузка скрипта для обработки шаблонов
$('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');

// Добавление кнопок при загрузке страницы
addButton('На рассмотрении', 'pin');
addButton('КП', 'teamProject');
addButton('Отказано', 'unaccept');
addButton('Рассмотрено', 'watched');
addButton('Решено', 'accepted');
addButton('Закрыто', 'closed');
addButton('Ответы', 'selectAnswer');


// Поиск информации о теме
const threadData = getThreadData();

$('button#unaccept').click(() => editThreadData(UNACCEPT_PREFIX, false));
$('button#pin').click(() => editThreadData(PIN_PREFIX, true));
$('button#accepted').click(() => editThreadData(ACCEPT_PREFIX, false));
$('button#teamProject').click(() => editThreadData(COMMAND_PREFIX, true));
$('button#watched').click(() => editThreadData(WATCHED_PREFIX, false));
$('button#closed').click(() => editThreadData(CLOSE_PREFIX, false));

$(`button#selectAnswer`).click(() => {
  XF.alert(buttonsMarkup(buttons), null, 'Добавьте ответ:');
  buttons.forEach((btn, id) => {
	$(`button#answers-${id}`).click(() => pasteContent(id, threadData));
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

function pasteContent(id, data = {}) {
const template = Handlebars.compile(buttons[id].content);
if ($('.fr-element.fr-view p').text() === '') $('.fr-element.fr-view p').empty();

$('span.fr-placeholder').empty();
$('div.fr-element.fr-view p').append(template(data));
$('a.overlay-titleCloser').trigger('click');
}

// Приветствие и время суток
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
	  : 11 < hours && hours <= 17
	  ? 'Добрый день'
	  : 17 < hours && hours <= 23
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
            discussion_open: 1,
			sticky: 1,
			_xfToken: XF.config.csrf,
			_xfRequestUri: document.URL.split(XF.config.url.fullBase)[1],
			_xfWithData: 1,
			_xfResponseType: 'json',
		  }),
		}).then(() => location.reload());
	}
	if(prefix == UNACCEPT_PREFIX || prefix == ACCEPT_PREFIX || prefix == CLOSE_PREFIX || prefix == WATCHED_PREFIX) {
		moveThread(prefix, 230);
	}
}

function moveThread(prefix, type) {
// Перемещение темы в раздел окончательных ответов
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
