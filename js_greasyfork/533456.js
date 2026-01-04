// ==UserScript==
// @name         Скрипт на ответы [by I.Belov]
// @namespace    https://f.hr-rp.ru/
// @version      1.1
// @description  Для любимых админчиков
// @author       Ignat Belov
// @match        https://f.hr-rp.ru/*
// @include      https://f.hr-rp.ru/
// @license     S.Toretto
// @icon       https://i.yapx.ru/Yvu67.jpg
// @downloadURL
// @updateURL
// @downloadURL
// @updateURL
// @downloadURL https://update.greasyfork.org/scripts/533456/%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%BD%D0%B0%20%D0%BE%D1%82%D0%B2%D0%B5%D1%82%D1%8B%20%5Bby%20IBelov%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/533456/%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%BD%D0%B0%20%D0%BE%D1%82%D0%B2%D0%B5%D1%82%D1%8B%20%5Bby%20IBelov%5D.meta.js
// ==/UserScript==

    (function () {
	'use strict';
	const PIN_PREFIX = 2; //  префикс закрепить
	const COMMAND_PREFIX = 10; // команде проекта
	const CLOSE_PREFIX = 7; // префикс закрыто
	const DECIDED_PREFIX = 6; // префикс решено
	const TECHADM_PREFIX = 13 // Игнатику
	const WATCHED_PREFIX = 9; // рассмотрено
	const WAIT_PREFIX = 14; // ожидание
    const ACCEPT_PREFIX = 8; // префикс одобрено
    const UNACCEPT_PREFIX = 4; // префикс отказано
    const GA_PREFIX = 12; // передать га
    const VAJNO_PREFIX = 1; // передать Игнату
    const NO_PREFIX = 0;
	const buttons = [
       {
    title: '|-(--(->------ Передача жалоб ------<-)--)-|',
      color: 'oswald: 3px; color: #FFFF00; background: #000000; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #FFFF00',
    },
	{
	  title: '| Главному администратору |',
	  content:

		'[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
            "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Ваша жалоба переадресована [/SIZE][/FONT][/I][/COLOR][COLOR=rgb(255, 0, 0)][I][FONT=times new roman][SIZE=4]Главному администратору[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
            "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br>' +
            '[I][CENTER][SIZE=1][COLOR=rgb(255, 140, 0)][ICODE]На рассмотрение...[/ICODE][/SIZE][/CENTER][/COLOR]',
	  prefix: PIN_PREFIX,
	  status: false,
	},
 	{
	  title: '| Спец.администратору |',
	  content:

		'[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
            "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Ваша жалоба переадресована [/SIZE][/FONT][/I][/COLOR][COLOR=rgb(255, 0, 0)][I][FONT=times new roman][SIZE=4]Спец администратору[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
            "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br>' +
            '[I][CENTER][SIZE=1][COLOR=rgb(255, 140, 0)][ICODE]На рассмотрение...[/ICODE][/SIZE][/CENTER][/COLOR]',
	  prefix: PIN_PREFIX,
	  status: false,
	},
 	{
	  title: '| Помощнику руководителя проекта |',
	  content:

		'[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
            "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Ваша жалоба переадресована [/SIZE][/FONT][/I][/COLOR][COLOR=rgb(255, 0, 0)][I][FONT=times new roman][SIZE=4]Помощнику руководителя проекта[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
            "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br>' +
            '[I][CENTER][SIZE=1][COLOR=rgb(255, 140, 0)][ICODE]На рассмотрение...[/ICODE][/SIZE][/CENTER][/COLOR]' +
		'[B][CENTER][COLOR=#FF0000]Отказано.<br>',
	  prefix: PIN_PREFIX,
	  status: false,
	},
  	{
	  title: '| Руководителю проекта |',
	  content:

		'[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
            "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Ваша жалоба переадресована [/SIZE][/FONT][/I][/COLOR][COLOR=rgb(255, 0, 0)][I][FONT=times new roman][SIZE=4]Руководителю проекта[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
            "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br>' +
            '[I][CENTER][SIZE=1][COLOR=rgb(255, 140, 0)][ICODE]На рассмотрение...[/ICODE][/SIZE][/CENTER][/COLOR]' +
		'[B][CENTER][COLOR=#FF0000]Отказано.<br>',
	  prefix: PIN_PREFIX,
	  status: false,
	},
          {
    title: '|-(--(->------ RolePlay Биографии ------<-)--)-|',
      color: 'oswald: 3px; color: #FFFF00; background: #000000; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #FFFF00',
    },
    {
	  title: '| Уже одобрена |',
	  content:

		'[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
              "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][FONT=times new roman][SIZE=4]Ваше RolePlay Биография была одобрена.[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
              '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br>' +
              "[I][CENTER][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] HARSH RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=rgb(255, 165, 0)][B][SIZE=1]Role Play[/SIZE][/B][/COLOR]" +
		'[B][CENTER][COLOR=#FF0000]Отказано.<br>',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
     	{
	  title: '| Отказано |',
	  content:

		'[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
              "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][FONT=times new roman][SIZE=4]Ваше RolePlay Биография была отказана.[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
              '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br>' +
              "[I][CENTER][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] HARSH RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=rgb(255, 165, 0)][B][SIZE=1]Role Play[/SIZE][/B][/COLOR]" +
		'[B][CENTER][COLOR=#FF0000]Отказано.<br>',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
    	{
	  title: '| Не по форме |',
	  content:

		'[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
              "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][FONT=times new roman][SIZE=4]Ваше RolePlay Биография была отклонена. Составлена не по форме.[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
              '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br>' +
              "[I][CENTER][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] HARSH RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=rgb(255, 165, 0)][B][SIZE=1]Role Play[/SIZE][/B][/COLOR]" +
		'[B][CENTER][COLOR=#FF0000]Отказано.<br>',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
    {
      title: '|-(--(->---- Жалобы ----<-)--)-|',
      color: 'oswald: 3px; color: #FFFF00; background: #000000; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #FFFF00',
    },
    {
	  title: '| DM |',
	  content:

		'[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
              "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][FONT=times new roman][SIZE=4]Нарушитель буден наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
              "[CENTER][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4]2.19.[/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4] Запрещен DM (DeathMatch) — убийство или нанесение урона без веской IC причины[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4] | Jail 15 минут[/SIZE][/FONT][/COLOR][/CENTER]<br><br>" +
              "[LIST]<br>" +
              "[*][LEFT][CENTER][FONT=book antiqua][COLOR=rgb(255, 0, 0)][SIZE=4]Примечание: [/SIZE][/COLOR][COLOR=rgb(209, 213, 216)][SIZE=4]разрешен ответный DM в целях защиты, обязательно иметь видео доказательство в случае наказания администрации, нанесение урона по транспорту также является нарушением данного пункта правил.[/SIZE][/COLOR][/FONT][/CENTER][/LEFT]<br>" +
              "[*][LEFT][CENTER][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4]Примечание: [/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4]нанесение урона с целью защиты особняка или его территории, а также нанесение урона после ДТП не является веской IC причиной, для войны семей предусмотрено отдельное системное мероприятие.[/SIZE][/FONT][/COLOR][/CENTER][/LEFT]<br>" +
              "[/LIST]<br>" +
              '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br>' +
              '[I][CENTER][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] HARSH RUSSIA[/B][/COLOR]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
    	{
	  title: '| Cheat |',
	  content:

		'[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
              "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][FONT=times new roman][SIZE=4]Нарушитель буден наказан по общим правилам серверов:[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
              "[CENTER][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4][/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4] Запрещено хранить / использовать / распространять стороннее программное обеспечение или любые другие средства, позволяющие получить преимущество над другими игроками[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4] | Ban 60 дней / PermBan / Удаление аккаунта[/SIZE][/FONT][/COLOR][/CENTER]<br><br>" +
              "[LIST]<br>" +
              "[*][LEFT][CENTER][FONT=book antiqua][COLOR=rgb(255, 0, 0)][SIZE=4]Примечание: [/SIZE][/COLOR][COLOR=rgb(209, 213, 216)][SIZE=4]Запрещено внесение любых изменений в оригинальные файлы игры.[/SIZE][/COLOR][/FONT][/CENTER][/LEFT]<br>" +
              "[*][LEFT][CENTER][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4]Исключение: [/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4]Разрешено изменение шрифта, его размера и длины чата (кол-во строк).[/SIZE][/FONT][/COLOR][/CENTER][/LEFT]<br>" +
              "[*][LEFT][CENTER][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4]Исключение: [/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4]Блокировка за включенный счетчик FPS не выдается.[/SIZE][/FONT][/CENTER][/LEFT]<br>" +
              "[/LIST]<br>" +
              '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br>' +
              '[I][CENTER][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] HARSH RUSSIA[/B][/COLOR]',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
       {
	  title: '| Масс DM |',
	  content:

		'[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
              "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][FONT=times new roman][SIZE=4]Нарушитель буден наказан по общим правилам серверов:[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
              "[CENTER][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4][/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4] Запрещен Mass DM (Mass DeathMatch) — убийство или нанесение урона без веской IC причины трем игрокам и более[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4] Jail 60 минут  / Warn / Ban 7 дней[/SIZE][/FONT][/COLOR][/CENTER]<br><br>" +
              '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br>' +
              '[I][CENTER][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] HARSH RUSSIA[/B][/COLOR]',
	  prefix: PIN_PREFIX,
	  status: true,
	},
    {
	  title: '| Обман игроков |',
	  content:

		'[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
              "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][FONT=times new roman][SIZE=4]Нарушитель буден наказан по общим правилам серверов:[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
              "[CENTER][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4][/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4] Обман игрока[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4] Ban 15 дней[/SIZE][/FONT][/COLOR][/CENTER]<br><br>" +
              '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br>' +
              '[I][CENTER][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] HARSH RUSSIA[/B][/COLOR]' +
		'[B][CENTER][COLOR=#FF0000]Отказано.<br>',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
  	{
	  title: '| DB |',
	  content:

		'[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
              "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][FONT=times new roman][SIZE=4]Нарушитель буден наказан по общим правилам серверов:[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
              "[CENTER][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4][/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4] Запрещен DB (DriveBy) — намеренное убийство / нанесение урона без веской IC причины на любом виде транспорта.[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4] | Jail 15 минут[/SIZE][/FONT][/COLOR][/CENTER]<br><br>" +
              '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br>' +
              "[I][CENTER][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] HARSH RUSSIA[/B][/COLOR]",
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
 	{
	  title: '| TK |',
	  content:

		'[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
              "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][FONT=times new roman][SIZE=4]Нарушитель буден наказан по общим правилам серверов:[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
              "[CENTER][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4][/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4]Запрещен SK (Spawn Kill) — убийство или нанесение урона на титульной территории любой фракции / организации, на месте появления игрока, а также на выходе из закрытых интерьеров и около них. [/SIZE][/FONT][/COLOR][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4] | Jail 60 минут / Warn (за два и более убийства)[/SIZE][/FONT][/COLOR][/CENTER]<br><br>" +
              '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br>' +
              "[I][CENTER][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] HARSH RUSSIA[/B][/COLOR]" +
		'[B][CENTER][COLOR=#FF0000]Отказано.<br>',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
  	{
	  title: '| PG |',
	  content:

		'[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
              "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][FONT=times new roman][SIZE=4]Нарушитель буден наказан по общим правилам серверов:[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
              "[CENTER][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4][/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4] Запрещен PG (PowerGaming) — присвоение свойств персонажу, не соответствующих реальности, отсутствие страха за свою жизнь.[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4] | Jail 20 минут[/SIZE][/FONT][/COLOR][/CENTER]<br><br>" +
              '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br>' +
              "[I][CENTER][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] HARSH RUSSIA[/B][/COLOR]" +
		'[B][CENTER][COLOR=#FF0000]Отказано.<br>',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
 	{
	  title: '| CapsLock |',
	  content:

		'[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
              "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][FONT=times new roman][SIZE=4]Нарушитель буден наказан по общим правилам серверов:[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
              "[CENTER][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4][/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4] Запрещено использование верхнего регистра (CapsLock) при написании любого текста в любом чате.[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4] | Mute 15 минут [/SIZE][/FONT][/COLOR][/CENTER]<br><br>" +
              '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br>' +
              "[I][CENTER][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] HARSH RUSSIA[/B][/COLOR]",
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
    {
	  title: '| Flood |',
	  content:

		'[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
              "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][FONT=times new roman][SIZE=4]Нарушитель буден наказан по общим правилам серверов:[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
              "[CENTER][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4][/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4] Запрещено использование команды /try не по назначени(игры на имущество или деньги)[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4] | Mute 15 минут[/SIZE][/FONT][/COLOR][/CENTER]<br><br>" +
              '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br>' +
              "[I][CENTER][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] HARSH RUSSIA[/B][/COLOR]",
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
    {
	  title: '| Упом.родных |',
	  content:

		'[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
            "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Нарушитель буден наказан по общим правилам серверов:[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
            "[CENTER][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4][/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4]Запрещено оскорбление или косвенное упоминание родных вне зависимости от чата (IC или OOC) [/COLOR][COLOR=rgb(255, 0, 0)]| Mute 60 минут / Ban 3 дня[/SIZE][/FONT][/COLOR][/CENTER]<br><br>" +
              '[LIST]<br><br>' +
              "[*][LEFT][CENTER][FONT=book antiqua][COLOR=rgb(255, 0, 0)][SIZE=4]Примечание:[/COLOR][COLOR=rgb(209, 213, 216)] упоминание родгых может расцениваться как и терминами так и на прямую[/SIZE][/COLOR][/FONT][/CENTER][/LEFT]<br>" +
              "[*][LEFT][CENTER][FONT=book antiqua][COLOR=rgb(255, 0, 0)][SIZE=4]Исключение: [/COLOR][COLOR=rgb(209, 213, 216)]если упоминание родных было совершено в ходе Role Play процесса и не содержало в себе прямого или завуалированного оскорбления.[/SIZE][/COLOR][/FONT][/CENTER][/LEFT]<br>" +
              "[/LIST]<br><br>" +
              '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br>' +
              "[I][CENTER][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] HARSH RUSSIA[/B][/COLOR]",
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
    {
	  title: '| Osk.Adm |',
	  content:

		'[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/I][/SIZE][/FONT][/COLOR]<br><br>' +
              "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Нарушитель буден наказан по общим правилам серверов:[/SIZE][/FONT][/COLOR][/I]<br><br>" +
              "[COLOR=rgb(255, 0, 0)][SIZE=4][FONT=book antiqua][/FONT][/SIZE][/COLOR][COLOR=rgb(209, 213, 216)][SIZE=4][FONT=book antiqua]Запрещено введение в заблуждение, обман, оскорбление, неконструктивная критика администрации на всех ресурсах проекта[/FONT][/SIZE][/COLOR][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=book antiqua]| Ban 3 дня[/FONT][/SIZE][/COLOR]<br><br>" +
              '[LIST]<br><br>' +
              "[*][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=book antiqua]Пример: [/FONT][/SIZE][/COLOR][COLOR=rgb(209, 213, 216)][SIZE=4][FONT=book antiqua]подделка доказательств, искажение информации в свою пользу, оскорбление администрации в репорт, обвинение администраторов без доказательств и т.д.[/FONT][/SIZE][/COLOR]<br><br>" +
              "[/LIST]<br><br>" +
              "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Приятной игры на HARSH RUSSIA [/SIZE][/FONT][/COLOR][COLOR=rgb(0, 140, 240)][FONT=times new roman][SIZE=4]Role Play[/SIZE][/FONT][/COLOR][COLOR=rgb(0, 140, 240)][FONT=times new roman][SIZE=4].[/SIZE][/FONT][/COLOR][/I]<br><br>",
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
     {
	  title: '| Реклама |',
	  content:

		'[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
              "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][FONT=times new roman][SIZE=4]Нарушитель буден наказан по общим правилам серверов:[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
              "[CENTER][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4][/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4]Запрещено рекламировать на серверах любые проекты, серверы, сайты, сторонние Discord-серверы, YouTube каналы и тому подобное[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4] | Ban 15 дней [/SIZE][/FONT][/COLOR][/CENTER]<br><br>" +
              '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br>' +
              "[I][CENTER][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] HARSH RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=rgb(255, 165, 0)][B][SIZE=1]Role Play[/SIZE][/B][/COLOR]",
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
     {
	  title: '| NonRP ВЧ |',
	  content:

		'[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
              "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][FONT=times new roman][SIZE=4]Нарушитель буден наказан по правилам нападениям на Военскую часть:[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
              "[CENTER][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4][/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4]За нарушение правил нападения на Военную Часть .[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4] | Jail 20 минут (NonRP нападение)[/SIZE][/FONT][/COLOR][/CENTER]<br><br>" +
              '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br>' +
              "[I][CENTER][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] HARSH RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=rgb(255, 165, 0)][B][SIZE=1]Role Play[/SIZE][/B][/COLOR]",
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
     {
	  title: '| НПРО |',
	  content:

		'[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
              "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][FONT=times new roman][SIZE=4]Нарушитель буден наказан по общим правилам серверов:[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
              "[CENTER][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4][/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4]Запрещено писать по своему, не по правилам редактирования..[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4] | Mute 15 минут / Увольнение[/SIZE][/FONT][/COLOR][/CENTER]<br><br>" +
              '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br>' +
              "[I][CENTER][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] HARSH RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=rgb(255, 165, 0)][B][SIZE=1]Role Play[/SIZE][/B][/COLOR]",
	  prefix: UNACCEPT_PREFIX,
	  status: false,
     },
     {
	  title: '| Недостаточно доказательств |',
	  content:

		'[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
              "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][FONT=times new roman][SIZE=4]Недостаточно доказательств для корректного рассмотрения вашей жалобы.[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
              '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br>' +
              "[I][CENTER][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] HARSH RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=rgb(255, 165, 0)][B][SIZE=1]Role Play[/SIZE][/B][/COLOR]",
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
    {
	  title: '| Отсутствуют доказательства |',
	  content:

		'[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
              "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][FONT=times new roman][SIZE=4]Отсутствуют доказательства - следовательно, рассмотрению не подлежит. Загрузите доказательства на фото-видео хостинги YouTube, Imgur, Yapx и так далее.[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
              '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br>' +
              "[I][CENTER][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] HARSH RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=rgb(255, 165, 0)][B][SIZE=1]Role Play[/SIZE][/B][/COLOR]",
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
     {
	  title: '| Не работает доказательства |',
	  content:

		'[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
              "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][FONT=times new roman][SIZE=4]Ваши доказательства не рабочие или же битая ссылка.[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
              '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br>' +
              "[I][CENTER][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] HARSH RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=rgb(255, 165, 0)][B][SIZE=1]Role Play[/SIZE][/B][/COLOR]",
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
    {
	  title: '| Нужен fraps |',
	  content:

		'[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
              "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][FONT=times new roman][SIZE=4]В данной ситуации обязательнодолжен быть фрапс(видео фиксация)всех моментов.[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
              '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br>' +
              "[I][CENTER][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] HARSH RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=rgb(255, 165, 0)][B][SIZE=1]Role Play[/SIZE][/B][/COLOR]",
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
     {
	  title: '| Не полный fraps |',
	  content:

		'[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
              "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][FONT=times new roman][SIZE=4]Видео фиксация не полная либо же нет условий сделки.[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
              '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br>' +
              "[I][CENTER][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] HARSH RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=rgb(255, 165, 0)][B][SIZE=1]Role Play[/SIZE][/B][/COLOR]",
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
    {
	  title: '| Нужен time |',
	  content:

		'[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
              "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][FONT=times new roman][SIZE=4]На доказательствах отсутствуют дата и время[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
              '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br>' +
              "[I][CENTER][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] HARSH RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=rgb(255, 165, 0)][B][SIZE=1]Role Play[/SIZE][/B][/COLOR]",
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
    {
	  title: '| Нет нарушений |',
	  content:

		'[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
              "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][FONT=times new roman][SIZE=4]Нарушений со стороны игрока не было замечено. [/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
              '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br>' +
              "[I][CENTER][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] HARSH RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=rgb(255, 165, 0)][B][SIZE=1]Role Play[/SIZE][/B][/COLOR]",
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
     {
	  title: '| Не правильный заголовок |',
	  content:

		'[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
              "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][FONT=times new roman][SIZE=4]Ваш заголовок составлен не по форме. Внимательно прочтите правила создания темы, прикрепленные в этом разделе.[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
              '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br>' +
              "[I][CENTER][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] HARSH RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=rgb(255, 165, 0)][B][SIZE=1]Role Play[/SIZE][/B][/COLOR]",
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
    {
	  title: '| Данный администратор получит наказание |',
	  content:

		'[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
              "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][FONT=times new roman][SIZE=4]Данный администратор понесет наказание.[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
              '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br>' +
              "[I][CENTER][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] HARSH RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=rgb(255, 165, 0)][B][SIZE=1]Role Play[/SIZE][/B][/COLOR]",
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
    {
	  title: '| Не полный fraps |',
	  content:

		'[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
              "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][FONT=times new roman][SIZE=4]Данный игрок понесет наказание.[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
              '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br>' +
              "[I][CENTER][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] HARSH RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=rgb(255, 165, 0)][B][SIZE=1]Role Play[/SIZE][/B][/COLOR]",
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
];
    	$(document).ready(() => {
	// Загрузка скрипта для обработки шаблонов
	$('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');

	// Добавление кнопок при загрузке страницs
	addButton('Одобрено', 'accept', 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(110, 192, 113, 0.5);');
	addButton('Отказано', 'unaccept', 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(220, 89, 89, 0.5);');
	addAnswers();

	// Поиск информации о теме
	const threadData = getThreadData();

	$(`button#ff`).click(() => pasteContent(8, threadData, true));
	$(`button#prr`).click(() => pasteContent(2, threadData, true));
	$(`button#zhb`).click(() => pasteContent(21, threadData, true));
	$('button#unaccept').click(() => editThreadData(UNACCEPT_PREFIX, false));
	$('button#pin').click(() => editThreadData(PIN_PREFIX, true));
	$('button#teamProject').click(() => editThreadData(COMMAND_PREFIX, true));
	$('button#watched').click(() => editThreadData(WATCHED_PREFIX, false));
	$('button#decided').click(() => editThreadData(DECIDED_PREFIX, false));
	$('button#closed').click(() => editThreadData(CLOSE_PREFIX, false));
	$('button#closed_complaint').click(() => editThreadData(CLOSE_PREFIX, false, false));
    $('button#accept').click(() => editThreadData(ACCEPT_PREFIX, false));
	$('button#techspec').click(() => editThreadData(TECHADM_PREFIX, true));
    $('button#ga').click(() => editThreadData(GA_PREFIX, true));
    $('button#vajno').click(() => editThreadData(VAJNO_PREFIX, true));

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

   function addButton(name, id, hex = "grey") {
		$('.button--icon--reply').before(
		`<button type="button" class="button--primary button rippleButton" id="${id}" style="border-radius: 25px; margin-right: 5px; background-color: ${hex}">${name}</button>`,
		);
	}
	function addAnswers() {
		$('.button--icon--reply').after(`<button type="button" class="button--cta uix_quickReply--button button button--icon button--icon--write rippleButton" id="selectAnswer" style="oswald: 3px; margin-left: 5px; margin-top: 10px; border-radius: 13px;">Шаблончики</button>`,
	);
	}

	function buttonsMarkup(buttons) {
		return `<div class="select_answer">${buttons
		  .map(
			(btn, i) =>
			  `<button id="answers-${i}" class="button--primary button ` +
			  `rippleButton" style="margin:5px; background-color: ${btn.color || "grey"}"><span class="button-text">${btn.title}</span></button>`,
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


         function editThreadData(prefix, pin = false, kumiho = true) {
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

const bgButtons = document.querySelector(".pageContent");
const buttonConfig = (text, href) => {
  const button = document.createElement("button");
  button.textContent = text;
  button.classList.add("bgButton");
  button.addEventListener("click", () => {
    window.location.href = href;
  });
  return button;
};

    const Button2 = buttonConfig("ПФ", "https://f.hr-rp.ru/threads/hr-pravila-foruma.54946/");

    bgButtons.append(Button2);


(function () {
    'use strict';

    function createAnimatedSnow() {

        const snowflakes = [];

        function setupCanvas() {
            const canvas = document.createElement('canvas');
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            canvas.id = 'snow-flakes';
            canvas.style.position = 'fixed';
            canvas.style.top = '0';
            canvas.style.left = '0';
            canvas.style.pointerEvents = 'none';
            canvas.style.zIndex = '99999';
            canvas.style.filter = 'blur(2px)';
            document.body.appendChild(canvas);

            return canvas.getContext('2d');
        }

        function createSnowflake(x, y) {
            const size = Math.random() * 2 + 1;
            const speedY = Math.random() * 1 + 1;
            const speedX = (Math.random() - 0.5) * 2;

            return { x, y, size, speedY, speedX };
        }

        function drawSnowflake(ctx, snowflake) {
            ctx.beginPath();
            ctx.arc(snowflake.x, snowflake.y, snowflake.size, 0, Math.PI * 2);
            ctx.fillStyle = 'white';
            ctx.fill();
            ctx.closePath();
        }

        function updateSnowflakes(ctx) {
            for (let i = 0; i < snowflakes.length; i++) {
                const snowflake = snowflakes[i];

                snowflake.y += snowflake.speedY;
                snowflake.x += snowflake.speedX;

                if (snowflake.y > window.innerHeight || snowflake.x > window.innerWidth) {
                    snowflakes[i] = createSnowflake(Math.random() * window.innerWidth, Math.random() * -window.innerHeight);
                }

                drawSnowflake(ctx, snowflake);
            }
        }

        function animateSnow() {
            const ctx = setupCanvas();

            for (let i = 0; i < 500; i++) {
                snowflakes.push(createSnowflake(Math.random() * window.innerWidth, Math.random() * window.innerHeight));
            }

            function animate() {
                ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
                updateSnowflakes(ctx);
                requestAnimationFrame(animate);
            }

            animate();
        }

        animateSnow();

    }

    function removeAnimatedSnow() {
        const snowCanvas = document.querySelector('#snow-flakes');
        document.body.removeChild(snowCanvas);
    }

    const uixLogo = document.querySelector('a.uix_logo img');
    uixLogo.src = 'https://i.postimg.cc/JzQPT4Wc/blackrussia.png';
    uixLogo.srcset = 'https://i.postimg.cc/JzQPT4Wc/blackrussia.png';

    const messageCellUser = document.querySelectorAll('.message-cell--user');
    messageCellUser.forEach(function (cell) {
        cell.style.background = '#29586c88';
    });

    const messageCellMain = document.querySelectorAll('.message-cell--main');
    messageCellMain.forEach(function (cell) {
        cell.style.background = '#15293788';
    });

    const scrollbarStyle = document.createElement('style');
    scrollbarStyle.id = 'style-scrollbar';
    scrollbarStyle.textContent = `
    `;
    document.head.appendChild(scrollbarStyle);

    const pageHeader = document.querySelector('.pageContent');
    const switchStyleBlock = document.createElement('label');
    switchStyleBlock.className = 'switch';
    switchStyleBlock.innerHTML = `
            <input type="checkbox" id="styleToggleCheck">
            <span class="slider round" style="padding-right: 20px;">
            <span class="addingText" style="display: block; width: max-content; margin: 5px; margin-left: 42px; margin-top: 2px;">[Снег]</span>
            </span>
        `;
    pageHeader.appendChild(switchStyleBlock);

    const styleToggleCheck = document.getElementById('styleToggleCheck');
    if (localStorage.getItem('snowEnabled') === 'true') {
        styleToggleCheck.checked = true;
        createAnimatedSnow();
    }
    styleToggleCheck.addEventListener('change', function () {
        if (styleToggleCheck.checked) {
            createAnimatedSnow();
            localStorage.setItem('snowEnabled', 'true');
        } else {
            removeAnimatedSnow();
            localStorage.setItem('snowEnabled', 'false');
        }
    });

    const sliderStyle = document.createElement('style');
    sliderStyle.id = 'slider-style';
    sliderStyle.textContent = `
    .switch {
        position: relative;
        display: inline-block;
        width: 40px;
        height: 20px;
        padding-left: 20px;
        margin: 0 30px 0 auto;
    }
    .switch input { display: none; }
    .slider {
        position: absolute;
        cursor: pointer;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        border: 1px solid #34aaeb;
        background-color: #212428;
        transition: all .4s ease;
    }
    .slider:hover{
        background-color: #29686d;
    }
    .slider:before {
        position: absolute;
        content: "";
        height: 14px;
        width: 14px;
        left: 2px;
        bottom: 2px;
        background-color: #32a0a8;
        box-shadow: 0 0 5px #000000;
        transition: all .4s ease;
    }
    input:checked + .slider {
        background-color: #212428;
    }
    input:checked + .slider:hover {
        background-color: #29686d;
    }
    input:focus + .slider {
        box-shadow: 0 0 5px #222222;
        background-color: #444444;
    }
    input:checked + .slider:before {
        transform: translateX(19px);
    }
    .slider.round {
        border-radius: 34px;
    }
    .slider.round:before {
        border-radius: 50%;
    }
`;
    document.head.appendChild(sliderStyle);
})();