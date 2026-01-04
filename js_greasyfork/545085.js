// ==UserScript==
// @name         КФ BY gates
// @namespace    https://forum.blackrussia.online/
// @version      1
// @description  Скрипт для работы кф
// @author       Shadowrase_Gates
// @match        https://forum.blackrussia.online/threads/*
// @icon         https://forum.blackrussia.online/threads/
// @grant        none
// @license      MIT
// @icon         https://img.icons8.com/nolan/452/beezy.pn
// @downloadURL https://update.greasyfork.org/scripts/545085/%D0%9A%D0%A4%20BY%20gates.user.js
// @updateURL https://update.greasyfork.org/scripts/545085/%D0%9A%D0%A4%20BY%20gates.meta.js
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
    const GA_PREFIX = 12; // Префикс "Главному Администратору"
	const TEX_PREFIX = 13; //  техническому специалисту
	const NO_PREFIX = 0;
	const IMPORTAN_PREFIX = 1;
	const buttons = [

	{
		title: 'Приветствие',
	    dpstyle: 'oswald: 3px;     color: #fff; background: #00ff09d4; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
		content:
	 '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый(-ая) {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
		'[CENTER]Здесь вставьте Ваш текст[/CENTER]',
	},
	{
        title: '------------------------------------------------------> Обычные темы регламента <------------------------------------------------------',
        dpstyle: 'oswald: 3px;     color: #fff; background: #6e38b0; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #7851A9',
	},
         {
            title: 'На рассмотрении',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k5Vd0G2H/image.png[/img][/url][/CENTER]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый(-ая) {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
            "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Ваша жалоба взята на рассмотрение, ожидайте ответа в данной теме.[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
            "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k5Vd0G2H/image.png[/img][/url][/CENTER]<br>' +
            '[I][CENTER][SIZE=1][COLOR=rgb(255, 140, 0)][ICODE]На рассмотрение...[/ICODE][/SIZE][/CENTER][/COLOR]',
            prefix: PIN_PREFIX,
            status: true,
          },
          {
            title: 'Не логируеться',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k5Vd0G2H/image.png[/img][/url][/CENTER]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый(-ая) {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
              "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][FONT=times new roman][SIZE=4]По данным доказательствам нельзя выдать наказание игроку. Все нарушения должны быть подтверждены через определенные ресурсы, а не только по предоставленным доказательствам.[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
               "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
              '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k5Vd0G2H/image.png[/img][/url][/CENTER]<br>' +
              "[I][CENTER][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=rgb(255, 165, 0)][B][SIZE=1]Role Play[/SIZE][/B][/COLOR]",
            prefix: UNACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'DM',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k5Vd0G2H/image.png[/img][/url][/CENTER]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый(-ая) {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
              "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][FONT=times new roman][SIZE=4][COLOR=Red] Нарушитель [COLOR=White] будет наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
              "[CENTER][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4]2.19.[/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4] Запрещен DM (DeathMatch) — убийство или нанесение урона без веской IC причины[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4] | Jail 60 минут[/SIZE][/FONT][/COLOR][/CENTER]<br><br>" +
              "[LIST]<br>" +
              "[*][LEFT][FONT=book antiqua][COLOR=rgb(255, 0, 0)][SIZE=4]Примечание: [/SIZE][/COLOR][COLOR=rgb(209, 213, 216)][SIZE=4]разрешен ответный DM в целях защиты, обязательно иметь видео доказательство в случае наказания администрации, нанесение урона по транспорту также является нарушением данного пункта правил.[/SIZE][/COLOR][/FONT][/LEFT]<br>" +
              "[*][LEFT][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4]Примечание: [/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4]нанесение урона с целью защиты особняка или его территории, а также нанесение урона после ДТП не является веской IC причиной, для войны семей предусмотрено отдельное системное мероприятие.[/SIZE][/FONT][/COLOR][/LEFT]<br>" +
              "[/LIST]<br>" +
              '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k5Vd0G2H/image.png[/img][/url][/CENTER]<br>' +
              "[I][CENTER][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=rgb(255, 165, 0)][B][SIZE=1]Role Play[/SIZE][/B][/COLOR]",
            prefix: ACCEPT_PREFIX,
            status: false,
          },
 {
            title: 'NRP поведение',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k5Vd0G2H/image.png[/img][/url][/CENTER]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый(-ая) {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
              "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][FONT=times new roman][SIZE=4][COLOR=Red] Нарушитель [COLOR=White] будет наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
              "[CENTER][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4]2.01.[/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4] Запрещено поведение, нарушающее нормы процессов Role Play режима игры[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4] | Jail 60 минут[/SIZE][/FONT][/COLOR][/CENTER]<br><br>" +
              "[LIST]<br>" +
              "[*][LEFT][FONT=book antiqua][COLOR=rgb(255, 0, 0)][SIZE=4]Примечание: [/SIZE][/COLOR][COLOR=rgb(209, 213, 216)][SIZE=4]ездить на крышах транспортных средств, бегать или ходить по столам в казино, целенаправленная провокация сотрудников правоохранительных органов с целью развлечения, целенаправленная помеха в проведении различных собеседований и так далее.[/SIZE][/COLOR][/FONT][/LEFT]<br>" +
              '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k5Vd0G2H/image.png[/img][/url][/CENTER]<br>' +
              "[I][CENTER][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=rgb(255, 165, 0)][B][SIZE=1]Role Play[/SIZE][/B][/COLOR]",
            prefix: ACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'Читы',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k5Vd0G2H/image.png[/img][/url][/CENTER]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый(-ая) {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
              "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][FONT=times new roman][SIZE=4][COLOR=Red] Нарушитель [COLOR=White] будет наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
              "[CENTER][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4]2.22.[/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4] Запрещено хранить / использовать / распространять стороннее программное обеспечение или любые другие средства, позволяющие получить преимущество над другими игроками[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4] | Ban 15 - 30 дней / PermBan[/SIZE][/FONT][/COLOR][/CENTER]<br><br>" +
              "[LIST]<br>" +
              "[*][LEFT][FONT=book antiqua][COLOR=rgb(255, 0, 0)][SIZE=4]Примечание: [/SIZE][/COLOR][COLOR=rgb(209, 213, 216)][SIZE=4]Запрещено внесение любых изменений в оригинальные файлы игры.[/SIZE][/COLOR][/FONT][/LEFT]<br>" +
              "[*][LEFT][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4]Исключение: [/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4]Разрешено изменение шрифта, его размера и длины чата (кол-во строк).[/SIZE][/COLOR][/FONT][/LEFT]<br>" +
              "[*][LEFT][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4]Исключение: [/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4]Блокировка за включенный счетчик FPS не выдается.[/SIZE][/FONT][/LEFT]<br>" +
              "[/LIST]<br>" +
              '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k5Vd0G2H/image.png[/img][/url][/CENTER]<br>' +
              "[I][CENTER][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=rgb(255, 165, 0)][B][SIZE=1]Role Play[/SIZE][/B][/COLOR]",
            prefix: ACCEPT_PREFIX,
            status: false,
          },
{
            title: 'Долг через трейд',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k5Vd0G2H/image.png[/img][/url][/CENTER]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый(-ая) {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
              "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][FONT=times new roman][SIZE=4]Займ может быть осуществлен только через зачисление игровых ценностей на банковский счет. На ваших доказательствах займ был осуществлен через обмен с игроком.[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
              '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k5Vd0G2H/image.png[/img][/url][/CENTER]<br>' +
              "[I][CENTER][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=rgb(255, 165, 0)][B][SIZE=1]Role Play[/SIZE][/B][/COLOR]",
            prefix: UNACCEPT_PREFIX,
            status: false,
          },
 {
            title: 'Продажа/Покупка ИВ',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k5Vd0G2H/image.png[/img][/url][/CENTER]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый(-ая) {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
              "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][FONT=times new roman][SIZE=4][COLOR=Red] Нарушитель [COLOR=White] будет наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
              "[CENTER][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4]2.28.[/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4] Запрещена покупка/продажа внутриигровой валюты в любых ее проявлениях за реальные деньги[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4] | PermBan с обнулением аккаунта + ЧС проекта[/SIZE][/FONT][/COLOR][/CENTER]<br><br>" +
              "[LIST]<br>" +
              "[*][LEFT][FONT=book antiqua][COLOR=rgb(255, 0, 0)][SIZE=4]Примечание: [/SIZE][/COLOR][COLOR=rgb(209, 213, 216)][SIZE=4]любые попытки покупки/продажи, попытки поинтересоваться о ней у другого игрока и прочее - наказуемы.[/SIZE][/COLOR][/FONT][/LEFT]<br>" +
              "[*][LEFT][FONT=book antiqua][COLOR=rgb(255, 0, 0)][SIZE=4]Примечание: [/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4]нельзя обменивать донат валюту (например, рубли, пополненные через сайт) на игровые ценности и наоборот. [/SIZE][/COLOR][/FONT][/LEFT]<br>" +
              "[*][LEFT][FONT=book antiqua][COLOR=rgb(255, 0, 0)][SIZE=4]Пример: [/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4]пополнение донат-счёта другого игрока в обмен на игровую валюту или другие ценности запрещено. [/SIZE][/COLOR][/FONT][/LEFT]<br>" +
              "[*][LEFT][FONT=book antiqua][COLOR=rgb(255, 0, 0)][SIZE=4]Примечание: [/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4]продавать или обменивать игровые ценности, которые были куплены за донат-валюту, не запрещено. [/SIZE][/COLOR][/FONT][/LEFT]<br>" +
              "[*][LEFT][FONT=book antiqua][COLOR=rgb(255, 0, 0)][SIZE=4]Исключение: [/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4]покупка игровой валюты или ценностей через официальный сайт разрешена. [/SIZE][/COLOR][/FONT][/LEFT]<br>" +
              "[/LIST]<br>" +
              '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k5Vd0G2H/image.png[/img][/url][/CENTER]<br>' +
              "[I][CENTER][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=rgb(255, 165, 0)][B][SIZE=1]Role Play[/SIZE][/B][/COLOR]",
            prefix: ACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'Mass DM',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k5Vd0G2H/image.png[/img][/url][/CENTER]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый(-ая) {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
              "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][FONT=times new roman][SIZE=4][COLOR=Red] Нарушитель [COLOR=White] будет наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
              "[CENTER][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4]2.20.[/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4] Запрещен Mass DM (Mass DeathMatch) — убийство или нанесение урона без веской IC причины трем игрокам и более[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4] | Warn / Ban 3 - 7 дней[/SIZE][/FONT][/COLOR][/CENTER]<br><br>" +
              '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k5Vd0G2H/image.png[/img][/url][/CENTER]<br>' +
              "[I][CENTER][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=rgb(255, 165, 0)][B][SIZE=1]Role Play[/SIZE][/B][/COLOR]",
            prefix: ACCEPT_PREFIX,
            status: false,
          },
{
            title: 'DM от ГОСС',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k5Vd0G2H/image.png[/img][/url][/CENTER]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый(-ая) {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
              "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Нарушитель будет наказан по следующему пункту общих правил госс организаций:[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
              "[CENTER][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4] 6.01. [/COLOR][COLOR=rgb(209, 213, 216)]Запрещено наносить урон игрокам без Role Play причины на территории госс.[/COLOR][COLOR=rgb(255, 0, 0)] | Ban 7 дней / PermBan[/SIZE][/FONT][/COLOR][/CENTER]<br><br>" +
              "[I][CENTER][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=rgb(255, 165, 0)][B][SIZE=1]Role Play[/SIZE][/CENTER][/B][/COLOR]<br>" +
              '[CENTER][url=https://postimages.org/][img]https://media.discordapp.net/attachments/1115566790790098944/1115597676717801482/standard_2.gif?width=514&height=66[/img][/url][/CENTER]',
            prefix: ACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'ДБ',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k5Vd0G2H/image.png[/img][/url][/CENTER]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый(-ая) {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
              "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][FONT=times new roman][SIZE=4][COLOR=Red] Нарушитель [COLOR=White] будет наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
              "[CENTER][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4]2.13.[/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4] Запрещен DB (DriveBy) — намеренное убийство / нанесение урона без веской IC причины на любом виде транспорта.[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4] | Jail 60 минут[/SIZE][/FONT][/COLOR][/CENTER]<br><br>" +
              '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k5Vd0G2H/image.png[/img][/url][/CENTER]<br>' +
              "[I][CENTER][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=rgb(255, 165, 0)][B][SIZE=1]Role Play[/SIZE][/B][/COLOR]",
            prefix: ACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'TK',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k5Vd0G2H/image.png[/img][/url][/CENTER]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый(-ая) {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
              "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][FONT=times new roman][SIZE=4][COLOR=Red] Нарушитель [COLOR=White] будет наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
              "[CENTER][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4]2.15.[/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4] Запрещен TK (Team Kill) — убийство члена своей или союзной фракции, организации без наличия какой-либо IC причины.[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4] | Jail 60 минут / Warn (за два и более убийства)[/SIZE][/FONT][/COLOR][/CENTER]<br><br>" +
              '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k5Vd0G2H/image.png[/img][/url][/CENTER]<br>' +
              "[I][CENTER][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=rgb(255, 165, 0)][B][SIZE=1]Role Play[/SIZE][/B][/COLOR]",
            prefix: ACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'CK',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k5Vd0G2H/image.png[/img][/url][/CENTER]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый(-ая) {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
              "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][FONT=times new roman][SIZE=4][COLOR=Red] Нарушитель [COLOR=White] будет наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
              "[CENTER][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4]2.16.[/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4]Запрещен SK (Spawn Kill) — убийство или нанесение урона на титульной территории любой фракции / организации, на месте появления игрока, а также на выходе из закрытых интерьеров и около них. [/SIZE][/FONT][/COLOR][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4] | Jail 60 минут / Warn (за два и более убийства)[/SIZE][/FONT][/COLOR][/CENTER]<br><br>" +
              '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k5Vd0G2H/image.png[/img][/url][/CENTER]<br>' +
              "[I][CENTER][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=rgb(255, 165, 0)][B][SIZE=1]Role Play[/SIZE][/B][/COLOR]",
            prefix: ACCEPT_PREFIX,
            status: false,
          },
            {
        title: '---------------------------------------------------------> Наказание   в   чате   игры <----------------------------------------------------------' ,
        dpstyle: 'oswald: 3px;     color: #fff; background: #6e38b0; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #7851A9',
       	},
        {
            title: 'MG',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k5Vd0G2H/image.png[/img][/url][/CENTER]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый(-ая) {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
              "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][FONT=times new roman][SIZE=4][COLOR=Red] Нарушитель [COLOR=White] будет наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
              "[CENTER][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4]2.18.[/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4] Запрещен MG (MetaGaming) — использование ООС информации, которую Ваш персонаж никак не мог получить в IC процессе[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4] | Mute 30 минут[/SIZE][/FONT][/COLOR][/CENTER]<br><br>" +
              "[LIST]<br>" +
              "[*][LEFT][FONT=book antiqua][COLOR=rgb(255, 0, 0)][SIZE=4]Примечание: [/SIZE][/COLOR][COLOR=rgb(209, 213, 216)][SIZE=4]использование смайлов в виде символов «))», «=D» запрещено в IC чате.[/SIZE][/COLOR][/FONT][/LEFT]<br>" +
              "[*][LEFT][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4]Примечание: [/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4] телефонное общение также является IC чатом.[/SIZE][/COLOR][/FONT][/LEFT]<br>" +
              "[/LIST]<br>" +
              '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k5Vd0G2H/image.png[/img][/url][/CENTER]<br>' +
              "[I][CENTER][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=rgb(255, 165, 0)][B][SIZE=1]Role Play[/SIZE][/B][/COLOR]",
            prefix: ACCEPT_PREFIX,
            status: false,
        },
{
            title: 'CAPS',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k5Vd0G2H/image.png[/img][/url][/CENTER]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый(-ая) {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
              "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][FONT=times new roman][SIZE=4][COLOR=Red] Нарушитель [COLOR=White] будет наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
              "[CENTER][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4]3.02.[/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4] Запрещено использование верхнего регистра (CapsLock) при написании любого текста в любом чате.[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4] | Mute 30 минут[/SIZE][/FONT][/COLOR][/CENTER]<br><br>" +
              "[LEFT][FONT=book antiqua][COLOR=rgb(255, 0, 0)][SIZE=4]Примечание: [/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4] ПрОдАм; куплю МАШИНУ; [/SIZE][/COLOR][/FONT][/LEFT]<br>" +
              '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k5Vd0G2H/image.png[/img][/url][/CENTER]<br>' +
              "[I][CENTER][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=rgb(255, 165, 0)][B][SIZE=1]Role Play[/SIZE][/B][/COLOR]",
            prefix: ACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'Flood',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k5Vd0G2H/image.png[/img][/url][/CENTER]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый(-ая) {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
              "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][FONT=times new roman][SIZE=4][COLOR=Red] Нарушитель [COLOR=White] будет наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
              "[CENTER][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4]3.05.[/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4] Запрещен флуд — 3 и более повторяющихся сообщений от одного и того же игрока[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4] | Mute 30 минут[/SIZE][/FONT][/COLOR][/CENTER]<br><br>" +
              '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k5Vd0G2H/image.png[/img][/url][/CENTER]<br>' +
              "[I][CENTER][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=rgb(255, 165, 0)][B][SIZE=1]Role Play[/SIZE][/B][/COLOR]",
            prefix: ACCEPT_PREFIX,
            status: false,
          },
{
            title: 'Мат в VIP',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k5Vd0G2H/image.png[/img][/url][/CENTER]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый(-ая) {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
              "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][FONT=times new roman][SIZE=4][COLOR=Red] Нарушитель [COLOR=White] будет наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
              "[CENTER][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4]3.23.[/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4] Запрещено использование нецензурных слов, в том числе завуалированных и литературных в VIP чате[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4] | Mute 30 минут[/SIZE][/FONT][/COLOR][/CENTER]<br><br>" +
              '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k5Vd0G2H/image.png[/img][/url][/CENTER]<br>' +
              "[I][CENTER][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=rgb(255, 165, 0)][B][SIZE=1]Role Play[/SIZE][/B][/COLOR]",
            prefix: ACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'Политика/Провокация VIP',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k5Vd0G2H/image.png[/img][/url][/CENTER]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый(-ая) {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
              "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][FONT=times new roman][SIZE=4][COLOR=Red] Нарушитель [COLOR=White] будет наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
              "[CENTER][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4]3.18.[/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4] Запрещено политическое и религиозное пропагандирование, а также провокация игроков к конфликтам, коллективному флуду или беспорядкам в любом из чатов.[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4] | Mute 120 минут / Ban 10 дней[/SIZE][/FONT][/COLOR][/CENTER]<br><br>" +
              '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k5Vd0G2H/image.png[/img][/url][/CENTER]<br>' +
              "[I][CENTER][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=rgb(255, 165, 0)][B][SIZE=1]Role Play[/SIZE][/B][/COLOR]",
            prefix: ACCEPT_PREFIX,
            status: false,
          },
{
            title: 'Рынок в  ГОСС',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k5Vd0G2H/image.png[/img][/url][/CENTER]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый(-ая) {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
              "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][FONT=times new roman][SIZE=4][COLOR=Red] Нарушитель [COLOR=White] будет наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
              "[CENTER][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4]3.22.[/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4] Запрещено публиковать любые объявления в помещениях государственных организаций вне зависимости от чата (IC или OOC).[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4] | Mute 30 минут[/SIZE][/FONT][/COLOR][/CENTER]<br><br>" +
              "[LIST]<br>" +
              "[*][LEFT][FONT=book antiqua][COLOR=rgb(255, 0, 0)][SIZE=4]Пример: [/SIZE][/COLOR][COLOR=rgb(209, 213, 216)][SIZE=4]ив помещении центральной больницы писать в чат: «Продам эксклюзивную шапку дешево!!!»[/SIZE][/COLOR][/FONT][/LEFT]<br>" +
              "[/LIST]<br>" +
              '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k5Vd0G2H/image.png[/img][/url][/CENTER]<br>' +
              "[I][CENTER][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=rgb(255, 165, 0)][B][SIZE=1]Role Play[/SIZE][/B][/COLOR]",
            prefix: ACCEPT_PREFIX,
            status: false,
        },
          {
            title: 'Упом род',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k5Vd0G2H/image.png[/img][/url][/CENTER]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый(-ая) {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
            "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][FONT=times new roman][SIZE=4][COLOR=Red] Нарушитель [COLOR=White] будет наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
            "[CENTER][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4]2.19.[/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4]Запрещено оскорбление или косвенное упоминание родных вне зависимости от чата (IC или OOC) [/COLOR][COLOR=rgb(255, 0, 0)]| Mute 120 минут / Ban 7 - 15 дней[/SIZE][/FONT][/COLOR][/CENTER]<br><br>" +
              '[LIST]<br><br>' +
              "[*][LEFT][FONT=book antiqua][COLOR=rgb(255, 0, 0)][SIZE=4]Примечание:[/COLOR][COLOR=rgb(209, 213, 216)] термин «MQ» расценивается, как упоминание родных.[/SIZE][/COLOR][/FONT][/LEFT]<br>" +
              "[*][LEFT][FONT=book antiqua][COLOR=rgb(255, 0, 0)][SIZE=4]Исключение: [/COLOR][COLOR=rgb(209, 213, 216)]если упоминание родных было совершено в ходе Role Play процесса и не содержало в себе прямого или завуалированного оскорбления.[/SIZE][/COLOR][/FONT][/LEFT]<br>" +
              "[/LIST]<br><br>" +
              '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k5Vd0G2H/image.png[/img][/url][/CENTER]<br>' +
              "[I][CENTER][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=rgb(255, 165, 0)][B][SIZE=1]Role Play[/SIZE][/CENTER][/B][/COLOR]<br>" ,
            prefix: ACCEPT_PREFIX,
            status: false,
          },
{
            title: 'оск проекта',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k5Vd0G2H/image.png[/img][/url][/CENTER]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый(-ая) {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
              "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][FONT=times new roman][SIZE=4][COLOR=Red] Нарушитель [COLOR=White] будет наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
              "[CENTER][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4]2.40.[/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4] Запрещены совершенно любые деструктивные действия по отношению к проекту: неконструктивная критика, призывы покинуть проект, попытки нарушить развитие проекта или любые другие действия, способные привести к помехам в игровом процессе.[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4] | Mute 300 минут / Ban 30 дней (Ban выдается по согласованию с главным администратором)[/SIZE][/FONT][/COLOR][/CENTER]<br><br>" +
              '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k5Vd0G2H/image.png[/img][/url][/CENTER]<br>' +
              "[I][CENTER][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=rgb(255, 165, 0)][B][SIZE=1]Role Play[/SIZE][/B][/COLOR]",
            prefix: ACCEPT_PREFIX,
            status: false,
        },
          {
            title: 'OOC оск',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k5Vd0G2H/image.png[/img][/url][/CENTER]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый(-ая) {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
              "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][FONT=times new roman][SIZE=4][COLOR=Red] Нарушитель [COLOR=White] будет наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
              "[CENTER][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4]3.03.[/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4] ЗЛюбые формы оскорблений, издевательств, расизма, дискриминации, религиозной враждебности, сексизма в OOC чате запрещены[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4] | Mute 30 минут[/SIZE][/FONT][/COLOR][/CENTER]<br><br>" +
              '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k5Vd0G2H/image.png[/img][/url][/CENTER]<br>' +
              "[I][CENTER][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=rgb(255, 165, 0)][B][SIZE=1]Role Play[/SIZE][/B][/COLOR]",
            prefix: ACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'Аморал',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k5Vd0G2H/image.png[/img][/url][/CENTER]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый(-ая) {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
            "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][FONT=times new roman][SIZE=4][COLOR=Red] Нарушитель [COLOR=White] будет наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
            "[CENTER][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4]2.08.[/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4]Запрещена любая форма аморальных действий сексуального характера в сторону игроков[/COLOR][COLOR=rgb(255, 0, 0)]| Jail 30 минут / Warn[/SIZE][/FONT][/COLOR][/CENTER]<br><br>" +
              '[LIST]<br><br>' +
              "[*][LEFT][FONT=book antiqua][COLOR=rgb(255, 0, 0)][SIZE=4]Исключение:[/COLOR][COLOR=rgb(209, 213, 216)] обоюдное согласие обеих сторон.[/SIZE][/COLOR][/FONT][/LEFT]<br>" +
              "[/LIST]<br><br>" +
              '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k5Vd0G2H/image.png[/img][/url][/CENTER]<br>' +
              "[I][CENTER][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=rgb(255, 165, 0)][B][SIZE=1]Role Play[/SIZE][/CENTER][/B][/COLOR]<br>" ,
            prefix: ACCEPT_PREFIX,
            status: false,
          },
           {
            title: 'мат в назв. фам/биз',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k5Vd0G2H/image.png[/img][/url][/CENTER]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый(-ая) {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
              "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][FONT=times new roman][SIZE=4][COLOR=Red] Нарушитель [COLOR=White] будет наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
              "[CENTER][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4]2.53.[/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4] Запрещено устанавливать названия для внутриигровых ценностей с использованием нецензурной лексики, оскорблений, слов политической или религиозной направленности.[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4] | Принудительная смена названия семьи / Ban 1 день / При повторном нарушении – обнуление бизнеса.[/SIZE][/FONT][/COLOR][/CENTER]<br><br>" +
              "[*][LEFT][FONT=book antiqua][COLOR=rgb(255, 0, 0)][SIZE=4]Примечание: [/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4]касается названий семей, бизнесов, компаний и т.д. [/SIZE][/COLOR][/FONT][/LEFT]<br>" +
              '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k5Vd0G2H/image.png[/img][/url][/CENTER]<br>' +
              "[I][CENTER][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=rgb(255, 165, 0)][B][SIZE=1]Role Play[/SIZE][/B][/COLOR]",
            prefix: ACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'неув к адм',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k5Vd0G2H/image.png[/img][/url][/CENTER]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый(-ая) {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
              "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][FONT=times new roman][SIZE=4][COLOR=Red] Нарушитель [COLOR=White] будет наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
              "[CENTER][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4]2.54.[/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4] Запрещено неуважительное обращение, оскорбление, неадекватное поведение, угрозы в любом их проявлении по отношению к администрации[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4] |   Mute 180 минут [/SIZE][/FONT][/COLOR][/CENTER]<br><br>" +
              '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k5Vd0G2H/image.png[/img][/url][/CENTER]<br>' +
              "[I][CENTER][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=rgb(255, 165, 0)][B][SIZE=1]Role Play[/SIZE][/B][/COLOR]",
            prefix: ACCEPT_PREFIX,
            status: false,
          },
{
            title: 'выдача за адм',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k5Vd0G2H/image.png[/img][/url][/CENTER]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый(-ая) {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
              "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][FONT=times new roman][SIZE=4][COLOR=Red] Нарушитель [COLOR=White] будет наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
              "[CENTER][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4]3.10.[/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4] Запрещена выдача себя за администратора, если таковым не являетесь[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4] |   Ban 7 - 15 [/SIZE][/FONT][/COLOR][/CENTER]<br><br>" +
              '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k5Vd0G2H/image.png[/img][/url][/CENTER]<br>' +
              "[I][CENTER][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=rgb(255, 165, 0)][B][SIZE=1]Role Play[/SIZE][/B][/COLOR]",
            prefix: ACCEPT_PREFIX,
            status: false,
          },
{
            title: 'Ввод в забл/обман АДМ',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][ICODE]{{ greeting }}, уважаемый(-ая) {{ user.name }}[/ICODE].[/I][/SIZE][/FONT][/COLOR]<br><br>' +
              "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Нарушитель будет наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I]<br><br>" +
              "[COLOR=rgb(255, 0, 0)][SIZE=4][FONT=book antiqua]2.32. [/FONT][/SIZE][/COLOR][COLOR=rgb(209, 213, 216)][SIZE=4][FONT=book antiqua]Запрещено введение в заблуждение, обман администрации на всех ресурсах проекта. [/FONT][/SIZE][/COLOR][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=book antiqua]|  Ban 7 - 15 дней[/FONT][/SIZE][/COLOR]<br><br>" +
              '[LIST]<br><br>' +
              "[*][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=book antiqua]Пример: [/FONT][/SIZE][/COLOR][COLOR=rgb(209, 213, 216)][SIZE=4][FONT=book antiqua]подделка доказательств, искажение информации в свою пользу, предоставление неполной информации о ситуации.[/FONT][/SIZE][/COLOR]<br><br>" +
              "[*][LEFT][FONT=book antiqua][COLOR=rgb(255, 0, 0)][SIZE=4]Примечание: [/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4]по решению руководства сервера может быть выдана перманентная блокировка как на аккаунт, с которого совершен обман, так и на все аккаунты нарушителя. [/FONT][/SIZE][/COLOR][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=book antiqua] | PermBan [/SIZE][/COLOR][/FONT][/LEFT]<br>" +
              "[*][LEFT][FONT=book antiqua][COLOR=rgb(255, 0, 0)][SIZE=4]Примечание: [/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4]за предоставление услуг по прохождению обзвонов на различные должности, а также за услуги, облегчающие процесс обзвона, может быть выдан чёрный список проекта. [/FONT][/SIZE][/COLOR][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=book antiqua] | PermBan + ЧС проекта [/SIZE][/COLOR][/FONT][/LEFT]<br>" +
              "[/LIST]<br><br>" +
              "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA [/SIZE][/FONT][/COLOR][COLOR=rgb(0, 140, 240)][FONT=times new roman][SIZE=4]Role Play[/SIZE][/FONT][/COLOR][COLOR=rgb(0, 140, 240)][FONT=times new roman][SIZE=4].[/SIZE][/FONT][/COLOR][/I]<br><br>" ,
            prefix: ACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'ooc угрозы',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k5Vd0G2H/image.png[/img][/url][/CENTER]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый(-ая) {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
              "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][FONT=times new roman][SIZE=4][COLOR=Red] Нарушитель [COLOR=White] будет наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
              "[CENTER][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4]2.37.[/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4]Запрещены OOC-угрозы, в том числе и завуалированные, а также угрозы наказанием со стороны администрации. [/SIZE][/FONT][/COLOR][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4] | Mute 120 минут / Ban 7 - 15 дней[/SIZE][/FONT][/COLOR][/CENTER]<br><br>" +
              "[*][LEFT][FONT=book antiqua][COLOR=rgb(255, 0, 0)][SIZE=4]Примечание: [/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4]блокировка аккаунта выдаётся в случае, если есть прямые угрозы жизни, здоровью игрока или его близким. По решению главного администратора может быть выдана перманентная блокировка. [/SIZE][/COLOR][/FONT][/LEFT]<br>" +
              '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k5Vd0G2H/image.png[/img][/url][/CENTER]<br>' +
              "[I][CENTER][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=rgb(255, 165, 0)][B][SIZE=1]Role Play[/SIZE][/B][/COLOR]",
            prefix: ACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'польз уязв правил',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k5Vd0G2H/image.png[/img][/url][/CENTER]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый(-ая) {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
              "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][FONT=times new roman][SIZE=4][COLOR=Red] Нарушитель [COLOR=White] будет наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
              "[CENTER][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4]2.33.[/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4]Запрещено пользоваться уязвимостью правил.[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4] | Ban 15 - 30 дней / PermBan [/SIZE][/FONT][/COLOR][/CENTER]<br><br>" +
              "[*][LEFT][FONT=book antiqua][COLOR=rgb(255, 0, 0)][SIZE=4]Примечание: [/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4]игрок объясняет свою невиновность тем, что какой-либо пункт правил недостаточно расписан, но вина очевидна. Либо его действия формально не нарушают конкретного пункта, но всё же наносят ущерб другим игрокам или игровой системе. [/SIZE][/COLOR][/FONT][/LEFT]<br>" +
              "[*][LEFT][FONT=book antiqua][COLOR=rgb(255, 0, 0)][SIZE=4]Пример: [/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4]игрок сознательно берёт долг через трейд, не планируя его возвращать, считая, что по правилам это не считается долгом и наказания не будет. [/SIZE][/COLOR][/FONT][/LEFT]<br>" +
              '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k5Vd0G2H/image.png[/img][/url][/CENTER]<br>' +
              "[I][CENTER][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=rgb(255, 165, 0)][B][SIZE=1]Role Play[/SIZE][/B][/COLOR]",
            prefix: ACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'конфликты ooc и ic',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k5Vd0G2H/image.png[/img][/url][/CENTER]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый(-ая) {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
              "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][FONT=times new roman][SIZE=4][COLOR=Red] Нарушитель [COLOR=White] будет наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
              "[CENTER][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4]2.35.[/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4]На игровых серверах запрещено устраивать IC и OOC конфликты на почве разногласия о национальности и / или религии совершенно в любом формате.[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4] | Mute 120 минут / Ban 7 дней[/SIZE][/FONT][/COLOR][/CENTER]<br><br>" +
              '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k5Vd0G2H/image.png[/img][/url][/CENTER]<br>' +
              "[I][CENTER][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=rgb(255, 165, 0)][B][SIZE=1]Role Play[/SIZE][/B][/COLOR]",
            prefix: ACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'злоуп нарушениями',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k5Vd0G2H/image.png[/img][/url][/CENTER]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый(-ая) {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
              "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][FONT=times new roman][SIZE=4][COLOR=Red] Нарушитель [COLOR=White] будет наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
              "[CENTER][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4]2.39.[/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4]Злоупотребление нарушениями правил сервера.[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4] | Ban 7 - 15 дней[/SIZE][/FONT][/COLOR][/CENTER]<br><br>" +
              "[*][LEFT][FONT=book antiqua][COLOR=rgb(255, 0, 0)][SIZE=4]Примечание: [/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4]неоднократное (от шести и более) нарушение правил серверов, которые были совершены за прошедшие 7 дней, с момента проверки истории наказаний игрока. [/SIZE][/COLOR][/FONT][/LEFT]<br>" +
              "[*][LEFT][FONT=book antiqua][COLOR=rgb(255, 0, 0)][SIZE=4]Примечание: [/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4]наказания выданные за нарушения правил текстовых чатов, помеху (kick) не учитываются. [/SIZE][/COLOR][/FONT][/LEFT]<br>" +
              "[*][LEFT][FONT=book antiqua][COLOR=rgb(255, 0, 0)][SIZE=4]Исключение: [/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4]пункты правил: 2.54, 3.04 учитываются в качестве злоупотребления нарушениями правил серверов. [/SIZE][/COLOR][/FONT][/LEFT]<br>" +
              "[*][LEFT][FONT=book antiqua][COLOR=rgb(255, 0, 0)][SIZE=4]Пример: [/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4]было получено пять наказаний за DM, шестое будет злоупотреблением. Если было получено одно наказание за упоминание родных, два наказания за DB и два наказания за DM, следующее будет считаться злоупотреблением. [/SIZE][/COLOR][/FONT][/LEFT]<br>" +
              '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k5Vd0G2H/image.png[/img][/url][/CENTER]<br>' +
              "[I][CENTER][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=rgb(255, 165, 0)][B][SIZE=1]Role Play[/SIZE][/B][/COLOR]",
            prefix: ACCEPT_PREFIX,
            status: false,
          },
         {
            title: 'злоуп символами',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k5Vd0G2H/image.png[/img][/url][/CENTER]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый(-ая) {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
            "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][FONT=times new roman][SIZE=4][COLOR=Red] Нарушитель [COLOR=White] будет наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
            "[CENTER][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4]3.06.[/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4]Запрещено злоупотребление знаков препинания и прочих символов[/COLOR][COLOR=rgb(255, 0, 0)]| Mute 30 минут[/SIZE][/FONT][/COLOR][/CENTER]<br><br>" +
              '[LIST]<br><br>' +
              "[*][LEFT][FONT=book antiqua][COLOR=rgb(255, 0, 0)][SIZE=4]Исключение:[/COLOR][COLOR=rgb(209, 213, 216)] «???????», «!!!!!!!», «Дааааааааааааааааааааааа» и так далее.[/SIZE][/COLOR][/FONT][/LEFT]<br>" +
              "[/LIST]<br><br>" +
              '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k5Vd0G2H/image.png[/img][/url][/CENTER]<br>' +
              "[I][CENTER][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=rgb(255, 165, 0)][B][SIZE=1]Role Play[/SIZE][/CENTER][/B][/COLOR]<br>" ,
            prefix: ACCEPT_PREFIX,
            status: false,
          },

          {
        title: '---------------------------------------------------------> Наказания за Рекламу <----------------------------------------------------------',
        dpstyle: 'oswald: 3px;     color: #fff; background: #6e38b0; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #7851A9',
      	},
          {
            title: 'Реклама промо',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k5Vd0G2H/image.png[/img][/url][/CENTER]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый(-ая) {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
              "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][FONT=times new roman][SIZE=4][COLOR=Red] Нарушитель [COLOR=White] будет наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
              "[CENTER][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4]3.21.[/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4] Запрещается реклама промокодов в игре, а также их упоминание в любом виде во всех чатах.[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4] | Ban 30 дней[/SIZE][/FONT][/COLOR][/CENTER]<br><br>" +
              "[LIST]<br>" +
              "[*][LEFT][FONT=book antiqua][COLOR=rgb(255, 0, 0)][SIZE=4]Примечание: [/SIZE][/COLOR][COLOR=rgb(209, 213, 216)][SIZE=4]чаты семейные, строительных компаний, транспортных компаний, фракционные чаты, IC, OOC, VIP и так далее.[/SIZE][/COLOR][/FONT][/LEFT]<br>" +
              "[*][LEFT][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4]Исключение: [/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4]промокоды, предоставленные разработчиками, а также распространяемые через официальные ресурсы проекта.[/SIZE][/COLOR][/FONT][/LEFT]<br>" +
              "[*][LEFT][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4]Пример: [/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4]если игрок упомянет промокод, распространяемый через официальную публичную страницу ВКонтакте либо через официальный Discord в любом из чатов, наказание ему не выдается.[/SIZE][/FONT][/LEFT]<br>" +
              "[/LIST]<br>" +
              '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k5Vd0G2H/image.png[/img][/url][/CENTER]<br>' +
              "[I][CENTER][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=rgb(255, 165, 0)][B][SIZE=1]Role Play[/SIZE][/B][/COLOR]",
            prefix: ACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'Системный промо',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k5Vd0G2H/image.png[/img][/url][/CENTER]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый(-ая) {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
              "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][FONT=times new roman][SIZE=4]Данный промокод является системным, или был выпущен  разработчиками[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
              '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k5Vd0G2H/image.png[/img][/url][/CENTER]<br>' +
              "[I][CENTER][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=rgb(255, 165, 0)][B][SIZE=1]Role Play[/SIZE][/B][/COLOR]",
            prefix: ACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'Реклама',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k5Vd0G2H/image.png[/img][/url][/CENTER]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый(-ая) {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
              "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][FONT=times new roman][SIZE=4][COLOR=Red] Нарушитель [COLOR=White] будет наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
              "[CENTER][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4]2.31.[/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4]Запрещено рекламировать на серверах любые проекты, серверы, сайты, сторонние Discord-серверы, YouTube каналы и тому подобное[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4] | Ban 7 дней / PermBan[/SIZE][/FONT][/COLOR][/CENTER]<br><br>" +
              "[*][LEFT][FONT=book antiqua][COLOR=rgb(255, 0, 0)][SIZE=4]Примечание: [/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4] если игрок не использует глобальный чат, чтобы дать свои контактные данные для связи, это не будет являться рекламой.[/SIZE][/COLOR][/FONT][/LEFT]<br>" +
              '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k5Vd0G2H/image.png[/img][/url][/CENTER]<br>' +
              "[I][CENTER][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=rgb(255, 165, 0)][B][SIZE=1]Role Play[/SIZE][/B][/COLOR]",
            prefix: ACCEPT_PREFIX,
            status: false,
          },
           {
        title: '-------------------------------------------------------> Наказание  за  NonRp  игры <-------------------------------------------------------' ,
        dpstyle: 'oswald: 3px;     color: #fff; background: #6e38b0; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #7851A9',
	},
    {
            title: 'Nrp Обман',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k5Vd0G2H/image.png[/img][/url][/CENTER]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый(-ая) {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
              "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][FONT=times new roman][SIZE=4][COLOR=Red] Нарушитель [COLOR=White] будет наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
              "[CENTER][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4]2.05.[/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4] Запрещены любые OOC обманы и их попытки, а также любые IC обманы с нарушением Role Play правил и логики[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4] | PermBan[/SIZE][/FONT][/COLOR][/CENTER]<br><br>" +
              "[LIST]<br>" +
              "[*][LEFT][FONT=book antiqua][COLOR=rgb(255, 0, 0)][SIZE=4]Примечание: [/SIZE][/COLOR][COLOR=rgb(209, 213, 216)][SIZE=4]после IC договоренности получить денежные средства и сразу же выйти из игры с целью обмана игрока, или же, договорившись через OOC чат (/n), точно также получить денежные средства и сразу же выйти из игры и тому подобные ситуации[/SIZE][/COLOR][/FONT][/LEFT]<br>" +
              "[*][LEFT][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4]Примечание: [/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4] разблокировка игрового аккаунта нарушителя будет возможна только в случае возврата полной суммы причиненного ущерба, либо непосредственно самого имущества, которое было украдено (по решению обманутой стороны).[/SIZE][/COLOR][/FONT][/LEFT]<br>" +
              "[/LIST]<br>" +
              '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k5Vd0G2H/image.png[/img][/url][/CENTER]<br>' +
              "[I][CENTER][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=rgb(255, 165, 0)][B][SIZE=1]Role Play[/SIZE][/B][/COLOR]",
            prefix: ACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'Nrp Врач',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k5Vd0G2H/image.png[/img][/url][/CENTER]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый(-ая) {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
              "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][FONT=times new roman][SIZE=4]Нарушитель будет наказан по следующему пункту правил государственных структур::[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
              "[CENTER][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4]5.01.[/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4]Запрещено оказание медицинской помощи без Role Play отыгровок.[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4] | Warn[/SIZE][/FONT][/COLOR][/CENTER]<br><br>" +
              '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k5Vd0G2H/image.png[/img][/url][/CENTER]<br>' +
              "[I][CENTER][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=rgb(255, 165, 0)][B][SIZE=1]Role Play[/SIZE][/B][/COLOR]",
            prefix: ACCEPT_PREFIX,
            status: false,
          },
             {
            title: 'Nrp cop',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k5Vd0G2H/image.png[/img][/url][/CENTER]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый(-ая) {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
              "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][FONT=times new roman][SIZE=4][COLOR=Red] Нарушитель [COLOR=White] будет наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
              "[CENTER][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4]6.03.[/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4] Запрещено nRP поведение [/SIZE][/FONT][/COLOR][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4] | Warn [/SIZE][/FONT][/COLOR][/CENTER]<br><br>" +
              "[LIST]<br>" +
              "[*][LEFT][FONT=book antiqua][COLOR=rgb(255, 0, 0)][SIZE=4]Примечание: [/SIZE][/COLOR][COLOR=rgb(209, 213, 216)][SIZE=4] поведение, не соответствующее сотруднику УМВД.[/SIZE][/COLOR][/FONT][/LEFT]<br>" +
              "[*][LEFT][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4]Пример: [/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4] открытие огня по игрокам без причины; расстрел машин без причины; нарушение ПДД без причины; сотрудник на служебном транспорте кричит о наборе в свою семью на спавне.[/SIZE][/COLOR][/FONT][/LEFT]<br>" +
              "[/LIST]<br>" +
              '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k5Vd0G2H/image.png[/img][/url][/CENTER]<br>' +
              "[I][CENTER][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=rgb(255, 165, 0)][B][SIZE=1]Role Play[/SIZE][/B][/COLOR]",
            prefix: ACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'Nrp Обыск',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k5Vd0G2H/image.png[/img][/url][/CENTER]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый(-ая) {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
              "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][FONT=times new roman][SIZE=4]Нарушитель будет наказан по следующему пункту правил государственных структур::[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
              "[CENTER][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4]8.06.[/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4]Запрещено проводить обыск без Role Play отыгровки.[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4] | Warn[/SIZE][/FONT][/COLOR][/CENTER]<br><br>" +
              '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k5Vd0G2H/image.png[/img][/url][/CENTER]<br>' +
              "[I][CENTER][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=rgb(255, 165, 0)][B][SIZE=1]Role Play[/SIZE][/B][/COLOR]",
            prefix: ACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'Nrp Розыск',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k5Vd0G2H/image.png[/img][/url][/CENTER]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый(-ая) {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
              "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][FONT=times new roman][SIZE=4]Нарушитель будет наказан по следующему пункту правил государственных структур:[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
              "[CENTER][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4]6.02.[/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4]Запрещено выдавать розыск без Role Play отыгровки.[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4] | Warn[/SIZE][/FONT][/COLOR][/CENTER]<br><br>" +
              '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k5Vd0G2H/image.png[/img][/url][/CENTER]<br>' +
              "[I][CENTER][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=rgb(255, 165, 0)][B][SIZE=1]Role Play[/SIZE][/B][/COLOR]",
            prefix: ACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'Nrp В/Ч',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k5Vd0G2H/image.png[/img][/url][/CENTER]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый(-ая) {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
              "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][FONT=times new roman][SIZE=4]Нарушитель будет наказан по следующему пункту правил нападения на Военскую часть:[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
              "[CENTER][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4]2.[/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4]За нарушение правил нападения на Военную Часть .[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4] | Jail 30 минут (NonRP нападение) / Warn (Для сотрудников ОПГ)[/SIZE][/FONT][/COLOR][/CENTER]<br><br>" +
              '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k5Vd0G2H/image.png[/img][/url][/CENTER]<br>' +
              "[I][CENTER][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=rgb(255, 165, 0)][B][SIZE=1]Role Play[/SIZE][/B][/COLOR]",
            prefix: ACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'Н/П/Р/О',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k5Vd0G2H/image.png[/img][/url][/CENTER]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый(-ая) {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
              "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][FONT=times new roman][SIZE=4]Нарушитель будет наказан по следующему пункту общих правил для государственных организаций:[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
              "[CENTER][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4]4.01.[/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4]Запрещено редактирование объявлений, не соответствующих ПРО..[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4] | Mute 30 минут [/SIZE][/FONT][/COLOR][/CENTER]<br><br>" +
              '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k5Vd0G2H/image.png[/img][/url][/CENTER]<br>' +
              "[I][CENTER][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=rgb(255, 165, 0)][B][SIZE=1]Role Play[/SIZE][/B][/COLOR]",
            prefix: ACCEPT_PREFIX,
            status: false,
          },
 {
            title: 'Редактирование в Л/Ц',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k5Vd0G2H/image.png[/img][/url][/CENTER]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый(-ая) {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
              "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][FONT=times new roman][SIZE=4][COLOR=Red] Нарушитель [COLOR=White] будет наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
              "[CENTER][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4]4.04.[/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4] Запрещено редактировать поданные объявления в личных целях заменяя текст объявления на несоответствующий отправленному игроком..[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4] | Ban 7 дней + ЧС организации [/SIZE][/FONT][/COLOR][/CENTER]<br><br>" +
              '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k5Vd0G2H/image.png[/img][/url][/CENTER]<br>' +
              "[I][CENTER][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=rgb(255, 165, 0)][B][SIZE=1]Role Play[/SIZE][/B][/COLOR]",
            prefix: ACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'Nrp Поведение',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k5Vd0G2H/image.png[/img][/url][/CENTER]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый(-ая) {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
            "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][FONT=times new roman][SIZE=4][COLOR=Red] Нарушитель [COLOR=White] будет наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
            "[CENTER][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4]2.01.[/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4]Запрещено поведение, нарушающее нормы процессов Role Play режима игры[/COLOR][COLOR=rgb(255, 0, 0)]| Jail 30 минут[/SIZE][/FONT][/COLOR][/CENTER]<br><br>" +
              '[LIST]<br><br>' +
              "[*][LEFT][FONT=book antiqua][COLOR=rgb(255, 0, 0)][SIZE=4] Примечание:[/COLOR][COLOR=rgb(209, 213, 216)] ездить на крышах транспортных средств, бегать или ходить по столам в казино, целенаправленная провокация сотрудников правоохранительных органов с целью развлечения, целенаправленная помеха в проведении различных собеседований и так далее.[/SIZE][/COLOR][/FONT][/LEFT]<br>" +
              "[/LIST]<br><br>" +
              '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k5Vd0G2H/image.png[/img][/url][/CENTER]<br>' +
              "[I][CENTER][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=rgb(255, 165, 0)][B][SIZE=1]Role Play[/SIZE][/CENTER][/B][/COLOR]<br>" ,
            prefix: ACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'Nrp AKC',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k5Vd0G2H/image.png[/img][/url][/CENTER]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый(-ая) {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
            "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][FONT=times new roman][SIZE=4][COLOR=Red] Нарушитель [COLOR=White] будет наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
            "[CENTER][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4]2.52.[/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4]Запрещено располагать аксессуары на теле персонажа, нарушая нормы морали и этики, увеличивать аксессуары до слишком большого размера.[/COLOR][COLOR=rgb(255, 0, 0)]| При первом нарушении - обнуление аксессуаров, при повторном нарушении - обнуление аксессуаров + JAIL 30 минут[/SIZE][/FONT][/COLOR][/CENTER]<br><br>" +
              '[LIST]<br><br>' +
              "[*][LEFT][FONT=book antiqua][COLOR=rgb(255, 0, 0)][SIZE=4]Исключение:[/COLOR][COLOR=rgb(209, 213, 216)] слишком большие аксессуары на голове персонажа, имитация гитарой половых органов и тому подобное.[/SIZE][/COLOR][/FONT][/LEFT]<br>" +
              "[/LIST]<br><br>" +
              '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k5Vd0G2H/image.png[/img][/url][/CENTER]<br>' +
              "[I][CENTER][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=rgb(255, 165, 0)][B][SIZE=1]Role Play[/SIZE][/CENTER][/B][/COLOR]<br>" ,
            prefix: ACCEPT_PREFIX,
            status: false,
          },
{
            title: 'Невозврат долга',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k5Vd0G2H/image.png[/img][/url][/CENTER]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый(-ая) {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
              "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][FONT=times new roman][SIZE=4][COLOR=Red] Нарушитель [COLOR=White] будет наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
              "[CENTER][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4]2.57.[/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4] Запрещается брать в долг игровые ценности и не возвращать их.[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4] |Ban 30 дней / permban[/SIZE][/FONT][/COLOR][/CENTER]<br><br>" +
              "[LIST]<br>" +
              "[*][LEFT][FONT=book antiqua][COLOR=rgb(255, 0, 0)][SIZE=4]Примечание: [/SIZE][/COLOR][COLOR=rgb(209, 213, 216)][SIZE=4] займ может быть осуществлен только через зачисление игровых ценностей на банковский счет, максимальный срок займа 30 календарных дней, если займ не был возвращен, аккаунт должника блокируется;[/SIZE][/COLOR][/FONT][/LEFT]<br>" +
              "[*][LEFT][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4]Примечание: [/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4]при невозврате игровых ценностей общей стоимостью менее 5 миллионов включительно аккаунт будет заблокирован на 30 дней, если более 5 миллионов, аккаунт будет заблокирован навсегда;[/SIZE][/COLOR][/FONT][/LEFT]<br>" +
              "[*][LEFT][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4]Примечание: [/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4]жалоба на игрока, который занял игровые ценности и не вернул в срок, подлежит рассмотрению только при наличии подтверждения суммы и условий займа в игровом процессе, меры в отношении должника могут быть приняты только при наличии жалобы и доказательств. Жалоба на должника подается в течение 10 дней после истечения срока займа. Договоры вне игры не будут считаться доказательствами.[/SIZE][/COLOR][/FONT][/LEFT]<br>" +
              "[/LIST]<br>" +
              '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k5Vd0G2H/image.png[/img][/url][/CENTER]<br>' +
              "[I][CENTER][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=rgb(255, 165, 0)][B][SIZE=1]Role Play[/SIZE][/B][/COLOR]",
            prefix: ACCEPT_PREFIX,
            status: false,
          },

           {
        title: '------------------------------------------------> Перенаправление в другой раздел <------------------------------------------------',
        dpstyle: 'oswald: 3px;     color: #fff; background: #6e38b0; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #7851A9',
	},
 {
            title: 'Главному куратору форума',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k5Vd0G2H/image.png[/img][/url][/CENTER]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый(-ая) {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
            "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Ваша жалоба переадресована [/SIZE][/FONT][/I][/COLOR][COLOR=rgb(0, 85, 255)][I][FONT=times new roman][SIZE=4]Главному куратору форума[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
            "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k5Vd0G2H/image.png[/img][/url][/CENTER]<br>' +
            '[I][CENTER][SIZE=1][COLOR=rgb(255, 140, 0)][ICODE]На рассмотрение...[/ICODE][/SIZE][/CENTER][/COLOR]',
            prefix: IMPORTAN_PREFIX,
            status: true,
          },
	 {
            title: 'Техническому Специалисту',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k5Vd0G2H/image.png[/img][/url][/CENTER]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый(-ая) {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
            "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Ваша жалоба переадресована [/SIZE][/FONT][/I][/COLOR][COLOR=rgb(255, 102, 0)][I][FONT=times new roman][SIZE=4]Техническому Специалисту[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
            "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k5Vd0G2H/image.png[/img][/url][/CENTER]<br>' +
            '[I][CENTER][SIZE=1][COLOR=rgb(255, 140, 0)][ICODE]На рассмотрение...[/ICODE][/SIZE][/CENTER][/COLOR]',
            prefix: TEX_PREFIX,
            status: true,
          },
          {
            title: 'Главному администратору',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k5Vd0G2H/image.png[/img][/url][/CENTER]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый(-ая) {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
            "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Ваша жалоба переадресована [/SIZE][/FONT][/I][/COLOR][COLOR=rgb(255, 0, 0)][I][FONT=times new roman][SIZE=4]Главному администратору[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
            "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k5Vd0G2H/image.png[/img][/url][/CENTER]<br>' +
            '[I][CENTER][SIZE=1][COLOR=rgb(255, 140, 0)][ICODE]На рассмотрение...[/ICODE][/SIZE][/CENTER][/COLOR]',
            prefix: GA_PREFIX,
            status: true,
          },
          {
            title: 'В жб на адм',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k5Vd0G2H/image.png[/img][/url][/CENTER]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый(-ая) {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
              "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][FONT=times new roman][SIZE=4]Вы ошиблись разделом, обратитесь в раздел жалоб на администрацию - [/I][URL='https://forum.blackrussia.online/forums/Жалобы-на-администрацию.2078/']*Нажмите сюда*[/URL][/SIZE][/FONT][/COLOR][/CENTER]<br><br>" +
              '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k5Vd0G2H/image.png[/img][/url][/CENTER]<br>' +
              "[I][CENTER][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=rgb(255, 165, 0)][B][SIZE=1]Role Play[/SIZE][/B][/COLOR]",
            prefix: UNACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'В жб на лидеров',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k5Vd0G2H/image.png[/img][/url][/CENTER]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый(-ая) {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
              "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][FONT=times new roman][SIZE=4]Вы ошиблись разделом, обратитесь в раздел жалоб на лидеров - [/I][URL='https://forum.blackrussia.online/forums/Жалобы-на-лидеров.2079/']*Нажмите сюда*[/URL][/SIZE][/FONT][/COLOR][/CENTER]<br><br>" +
              '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k5Vd0G2H/image.png[/img][/url][/CENTER]<br>' +
              "[I][CENTER][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=rgb(255, 165, 0)][B][SIZE=1]Role Play[/SIZE][/B][/COLOR]",
            prefix: UNACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'В жб на Хелперов',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k5Vd0G2H/image.png[/img][/url][/CENTER]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый(-ая) {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
              "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][FONT=times new roman][SIZE=4]Вы ошиблись разделом, обратитесь в раздел жалоб на Агентов поддержки - [/I][URL='https://forum.blackrussia.online/threads/chelyabinsk-Жалобы-на-Агентов-Поддержки.10608735/']*Нажмите сюда*[/URL][/SIZE][/FONT][/COLOR][/CENTER]<br><br>" +
              '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k5Vd0G2H/image.png[/img][/url][/CENTER]<br>' +
              "[I][CENTER][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=rgb(255, 165, 0)][B][SIZE=1]Role Play[/SIZE][/B][/COLOR]",
            prefix: UNACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'В жб на сотрудников орг',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k5Vd0G2H/image.png[/img][/url][/CENTER]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый(-ая) {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
              "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][FONT=times new roman][SIZE=4]Вы ошиблись разделом, обратитесь в жалобы на сотрудников фракции[/SIZE][/FONT][/COLOR][/CENTER]<br><br>" +
              '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k5Vd0G2H/image.png[/img][/url][/CENTER]<br>' +
              "[I][CENTER][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=rgb(255, 165, 0)][B][SIZE=1]Role Play[/SIZE][/B][/COLOR]",
            prefix: UNACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'В Обжалования наказания',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k5Vd0G2H/image.png[/img][/url][/CENTER]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый(-ая) {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
              "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][FONT=times new roman][SIZE=4]Вы ошиблись разделом, обратитесь в раздел Обжалование наказаний - [/I][URL='https://forum.blackrussia.online/forums/Обжалование-наказаний.2081/']*Нажмите сюда*[/URL][/SIZE][/FONT][/COLOR][/CENTER]<br><br>" +
              '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k5Vd0G2H/image.png[/img][/url][/CENTER]<br>' +
              "[I][CENTER][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=rgb(255, 165, 0)][B][SIZE=1]Role Play[/SIZE][/B][/COLOR]",
            prefix: UNACCEPT_PREFIX,
            status: false,
          },

           {
        title: '-----------------------------------------------------> Доказательства в жалобах <------------------------------------------------------',
        dpstyle: 'oswald: 3px;     color: #fff; background: #6e38b0; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #7851A9',
	},
    {
            title: 'Недостаточно док-в',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k5Vd0G2H/image.png[/img][/url][/CENTER]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый(-ая) {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
              "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][FONT=times new roman][SIZE=4]Недостаточно доказательств для корректного рассмотрения вашей жалобы.[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
              '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k5Vd0G2H/image.png[/img][/url][/CENTER]<br>' +
              "[I][CENTER][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=rgb(255, 165, 0)][B][SIZE=1]Role Play[/SIZE][/B][/COLOR]",
            prefix: UNACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'Отсутствуют док-ва',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k5Vd0G2H/image.png[/img][/url][/CENTER]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый(-ая) {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
              "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][FONT=times new roman][SIZE=4]Отсутствуют доказательства - следовательно, рассмотрению не подлежит. Загрузите доказательства на фото-видео хостинги YouTube, Imgur, Yapx и так далее.[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
              '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k5Vd0G2H/image.png[/img][/url][/CENTER]<br>' +
              "[I][CENTER][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=rgb(255, 165, 0)][B][SIZE=1]Role Play[/SIZE][/B][/COLOR]",
            prefix: UNACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'Не работает док-ва',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k5Vd0G2H/image.png[/img][/url][/CENTER]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый(-ая) {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
              "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][FONT=times new roman][SIZE=4]Ваши доказательства не рабочие или же битая ссылка. Загрузите доказательства на фото-видео хостинги YouTube, Imgur, Yapx и так далее.[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
              '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k5Vd0G2H/image.png[/img][/url][/CENTER]<br>' +
              "[I][CENTER][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=rgb(255, 165, 0)][B][SIZE=1]Role Play[/SIZE][/B][/COLOR]",
            prefix: UNACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'Док-ва обрываются',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k5Vd0G2H/image.png[/img][/url][/CENTER]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый(-ая) {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
              "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][FONT=times new roman][SIZE=4]Ваша видеозапись обрывается. Загрузите полную видеозапись на видео-хостинг YouTube, Imgur, Yapx и так далее.[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
              '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k5Vd0G2H/image.png[/img][/url][/CENTER]<br>' +
              "[I][CENTER][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=rgb(255, 165, 0)][B][SIZE=1]Role Play[/SIZE][/B][/COLOR]",
            prefix: UNACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'Док-ва отредакт',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k5Vd0G2H/image.png[/img][/url][/CENTER]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый(-ая) {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
              "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][FONT=times new roman][SIZE=4]Доказательства были подвергнуты редактированию - следовательно, рассмотрению не подлежит.[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
              '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k5Vd0G2H/image.png[/img][/url][/CENTER]<br>' +
              "[I][CENTER][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=rgb(255, 165, 0)][B][SIZE=1]Role Play[/SIZE][/B][/COLOR]",
            prefix: UNACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'Нужен фрапс',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k5Vd0G2H/image.png[/img][/url][/CENTER]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый(-ая) {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
              "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][FONT=times new roman][SIZE=4]В данной ситуации обязательнодолжен быть фрапс(видео фиксация)всех моментов.[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
              '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k5Vd0G2H/image.png[/img][/url][/CENTER]<br>' +
              "[I][CENTER][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=rgb(255, 165, 0)][B][SIZE=1]Role Play[/SIZE][/B][/COLOR]",
            prefix: UNACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'Док-ва в соц. сетях',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k5Vd0G2H/image.png[/img][/url][/CENTER]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый(-ая) {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
              "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][FONT=times new roman][SIZE=4] Доказательства в соц. сетях не принимаются. Загрузите доказательства на фото-видео хостинги YouTube, Imgur, Yapx и так далее.[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
              '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k5Vd0G2H/image.png[/img][/url][/CENTER]<br>' +
              "[I][CENTER][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=rgb(255, 165, 0)][B][SIZE=1]Role Play[/SIZE][/B][/COLOR]",
            prefix: UNACCEPT_PREFIX,
            status: false,
          },
{
            title: 'Док-ва в плохом качестве',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k5Vd0G2H/image.png[/img][/url][/CENTER]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый(-ая) {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
              "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][FONT=times new roman][SIZE=4]Предоставленные доказательства находятся в плохом качестве. Создайте новую тему с доказательствами в более лучшем качестве.[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
              '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k5Vd0G2H/image.png[/img][/url][/CENTER]<br>' +
              "[I][CENTER][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=rgb(255, 165, 0)][B][SIZE=1]Role Play[/SIZE][/B][/COLOR]",
            prefix: UNACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'Неполный фрапс',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k5Vd0G2H/image.png[/img][/url][/CENTER]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый(-ая) {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
              "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][FONT=times new roman][SIZE=4]Видео фиксация не полная либо же нет условий сделки.[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
              '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k5Vd0G2H/image.png[/img][/url][/CENTER]<br>' +
              "[I][CENTER][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=rgb(255, 165, 0)][B][SIZE=1]Role Play[/SIZE][/B][/COLOR]",
            prefix: UNACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'Нету time',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k5Vd0G2H/image.png[/img][/url][/CENTER]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый(-ая) {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
              "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][FONT=times new roman][SIZE=4]На доказательствах отсутствуют дата и время[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
              '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k5Vd0G2H/image.png[/img][/url][/CENTER]<br>' +
              "[I][CENTER][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=rgb(255, 165, 0)][B][SIZE=1]Role Play[/SIZE][/B][/COLOR]",
            prefix: UNACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'Отсутствуют таймкоды',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k5Vd0G2H/image.png[/img][/url][/CENTER]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый(-ая) {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
              "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][FONT=times new roman][SIZE=4]Ваша жалоба отказана, т.к в ней нету таймкодов. Если видео длится больше 3-ех минут - Вы должны указать таймкоды нарушений.[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
              '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k5Vd0G2H/image.png[/img][/url][/CENTER]<br>' +
              "[I][CENTER][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=rgb(255, 165, 0)][B][SIZE=1]Role Play[/SIZE][/B][/COLOR]",
            prefix: UNACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'Нет условий сделки',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k5Vd0G2H/image.png[/img][/url][/CENTER]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый(-ая) {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
              "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][FONT=times new roman][SIZE=4]В предоставленных доказательствах отсутствуют условия сделки.[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
              '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k5Vd0G2H/image.png[/img][/url][/CENTER]<br>' +
              "[I][CENTER][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=rgb(255, 165, 0)][B][SIZE=1]Role Play[/SIZE][/B][/COLOR]",
            prefix: UNACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'Нарушений нет',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k5Vd0G2H/image.png[/img][/url][/CENTER]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый(-ая) {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
              "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][FONT=times new roman][SIZE=4]Нарушений со стороны игрока не было замечено. [/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
              '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k5Vd0G2H/image.png[/img][/url][/CENTER]<br>' +
              "[I][CENTER][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=rgb(255, 165, 0)][B][SIZE=1]Role Play[/SIZE][/B][/COLOR]",
            prefix: UNACCEPT_PREFIX,
            status: false,
          },
 {
            title: 'От 3 лица',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k5Vd0G2H/image.png[/img][/url][/CENTER]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый(-ая) {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
              "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][FONT=times new roman][SIZE=4]Ваша жалоба написана от 3-его лица. Отказано[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
              '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k5Vd0G2H/image.png[/img][/url][/CENTER]<br>' +
              "[I][CENTER][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=rgb(255, 165, 0)][B][SIZE=1]Role Play[/SIZE][/B][/COLOR]",
            prefix: UNACCEPT_PREFIX,
            status: false,
          },
{
            title: 'Прошло 3 дня',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k5Vd0G2H/image.png[/img][/url][/CENTER]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый(-ая) {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
              "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][FONT=times new roman][SIZE=4]С моменты нарушения прошло более 72-х часов[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
              '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k5Vd0G2H/image.png[/img][/url][/CENTER]<br>' +
              "[I][CENTER][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=rgb(255, 165, 0)][B][SIZE=1]Role Play[/SIZE][/B][/COLOR]",
            prefix: UNACCEPT_PREFIX,
            status: false,
          },
{
            title: '2 и более игрока',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k5Vd0G2H/image.png[/img][/url][/CENTER]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый(-ая) {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
              "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][FONT=times new roman][SIZE=4]Ваша жалоба отказана по причине: нельзя писать одну жалобу на двух и более игроков ( на каждого игрока отдельная жалоба)[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
              '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k5Vd0G2H/image.png[/img][/url][/CENTER]<br>' +
              "[I][CENTER][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=rgb(255, 165, 0)][B][SIZE=1]Role Play[/SIZE][/B][/COLOR]",
            prefix: UNACCEPT_PREFIX,
            status: false,
          },
           {
        title: '--------------------------------------------------------> Прочие пункты правиал <--------------------------------------------------------',
        dpstyle: 'oswald: 3px;     color: #fff; background: #6e38b0; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #7851A9',
	},
	{
            title: 'Помеха Rp процессу',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k5Vd0G2H/image.png[/img][/url][/CENTER]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый(-ая) {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
              "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][FONT=times new roman][SIZE=4][COLOR=Red] Нарушитель [COLOR=White] будет наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
              "[CENTER][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4]2.04.[/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4] Запрещены любые действия способные привести к помехам в игровом процессе, а также выполнению работ, если они этого не предусматривают и если эти действия выходят за рамки игрового процесса данной работы.[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4] | Ban 10 дней / Обнуление аккаунта (при повторном нарушении)[/SIZE][/FONT][/COLOR][/CENTER]<br><br>" +
              "[LIST]<br>" +
              "[*][LEFT][FONT=book antiqua][COLOR=rgb(255, 0, 0)][SIZE=4]Пример: [/SIZE][/COLOR][COLOR=rgb(209, 213, 216)][SIZE=4]таран дальнобойщиков, инкассаторов под разными предлогами.[/SIZE][/COLOR][/FONT][/LEFT]<br>" +
              "[/LIST]<br>" +
              '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k5Vd0G2H/image.png[/img][/url][/CENTER]<br>' +
              "[I][CENTER][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=rgb(255, 165, 0)][B][SIZE=1]Role Play[/SIZE][/B][/COLOR]",
            prefix: ACCEPT_PREFIX,
            status: false,
          },
{
            title: 'Помеха работе блогеров',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k5Vd0G2H/image.png[/img][/url][/CENTER]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый(-ая) {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
              "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][FONT=times new roman][SIZE=4][COLOR=Red] Нарушитель [COLOR=White] будет наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
              "[CENTER][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4]2.12.[/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4] Запрещена помеха в работе блогеров, стримеров (медиа лиц), которые находятся на официальном сотрудничестве с проектом. [/SIZE][/FONT][/COLOR][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4] | Ban 7 дней [/SIZE][/FONT][/COLOR][/CENTER]<br><br>" +
              "[LIST]<br>" +
              "[*][LEFT][FONT=book antiqua][COLOR=rgb(255, 0, 0)][SIZE=4]Пример: [/SIZE][/COLOR][COLOR=rgb(209, 213, 216)][SIZE=4]спам в чат оскорблениями и провокационными сообщениями, мешая работе блогера в проведении трансляции и взаимодействии с аудиторией.[/SIZE][/COLOR][/FONT][/LEFT]<br>" +
              "[*][LEFT][FONT=book antiqua][COLOR=rgb(255, 0, 0)][SIZE=4]Пример: [/SIZE][/COLOR][COLOR=rgb(209, 213, 216)][SIZE=4]игрок умышленно убивает стримера в игре, создавая помеху в процессе стрима.[/SIZE][/COLOR][/FONT][/LEFT]<br>" +
              "[/LIST]<br>" +
              '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k5Vd0G2H/image.png[/img][/url][/CENTER]<br>' +
              "[I][CENTER][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=rgb(255, 165, 0)][B][SIZE=1]Role Play[/SIZE][/B][/COLOR]",
            prefix: ACCEPT_PREFIX,
            status: false,
          },
    {
            title: 'Уход от Рп',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k5Vd0G2H/image.png[/img][/url][/CENTER]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый(-ая) {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
            "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][FONT=times new roman][SIZE=4][COLOR=Red] Нарушитель [COLOR=White] будет наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
            "[CENTER][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4]2.02.[/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4]Запрещено целенаправленно уходить от Role Play процесса всеразличными способами.[/COLOR][COLOR=rgb(255, 0, 0)]| Jail 30 минут / Warn[/SIZE][/FONT][/COLOR][/CENTER]<br><br>" +
              '[LIST]<br><br>' +
              "[*][LEFT][FONT=book antiqua][COLOR=rgb(255, 0, 0)][SIZE=4]Пример:[/COLOR][COLOR=rgb(209, 213, 216)] уходить в AFK при остановке транспортного средства правоохранительными органами, выходить из игры для избежания смерти, выходить из игры во время процесса задержания / ареста, полное игнорирование отыгровок другого игрока, которые так или иначе могут коснуться Вашего персонажа и так далее..[/SIZE][/COLOR][/FONT][/LEFT]<br>" +
              "[/LIST]<br><br>" +
              '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k5Vd0G2H/image.png[/img][/url][/CENTER]<br>' +
              "[I][CENTER][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=rgb(255, 165, 0)][B][SIZE=1]Role Play[/SIZE][/CENTER][/B][/COLOR]<br>" ,
            prefix: ACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'Bagouse',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k5Vd0G2H/image.png[/img][/url][/CENTER]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый(-ая) {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
              "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][FONT=times new roman][SIZE=4][COLOR=Red] Нарушитель [COLOR=White] будет наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
              "[CENTER][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4]2.21.[/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4]Запрещено пытаться обходить игровую систему или использовать любые баги сервера[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4] | Ban 15 - 30 дней / PermBan (по согласованию с ГА, ЗГА, руководством тех. специалистов)[/SIZE][/FONT][/COLOR][/CENTER]<br><br>" +
              "[*][LEFT][FONT=book antiqua][COLOR=rgb(255, 0, 0)][SIZE=4]Примечание:[/COLOR][COLOR=rgb(209, 213, 216)] под игровой системой подразумеваются функции и возможности, которые реализованы в игре для взаимодействия между игроками, а также взаимодействия игроков с функциями, у которых есть свое конкретное предназначение.[/SIZE][/COLOR][/FONT][/LEFT]<br>" +
              "[LEFT][FONT=book antiqua][COLOR=rgb(255, 0, 0)][SIZE=4]Пример:[/COLOR][COLOR=rgb(209, 213, 216)] аптечка предназначена для пополнения уровня здоровья, доступна всем игрокам по фиксированной цене в любом магазине. Но она не предназначена для перепродажи по завышенной цене для передачи виртуальной валюты между игроками; Аксессуары предназначены для украшения внешнего вида персонажа, не предназначены для передачи виртуальной валюты между игроками; Банк и личные счета предназначены для передачи денежных средств между игроками; Транспортное средство предназначено для передвижения игроков, не предназначено для передачи денег тем или иным способом, включая обмен с завышенными доплатами.[/SIZE][/COLOR][/FONT][/LEFT]<br>" +
              '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k5Vd0G2H/image.png[/img][/url][/CENTER]<br>' +
              "[I][CENTER][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=rgb(255, 165, 0)][B][SIZE=1]Role Play[/SIZE][/B][/COLOR]",
            prefix: ACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'Bagouse Anim',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k5Vd0G2H/image.png[/img][/url][/CENTER]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый(-ая) {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
            "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][FONT=times new roman][SIZE=4][COLOR=Red] Нарушитель [COLOR=White] будет наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
            "[CENTER][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4]2.55.[/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4]Запрещается багоюз связанный с анимацией в любых проявлениях. [/COLOR][COLOR=rgb(255, 0, 0)]| Jail 60 / 120 минут[/SIZE][/FONT][/COLOR][/CENTER]<br><br>" +
              '[LIST]<br><br>' +
              "[*][LEFT][FONT=book antiqua][COLOR=rgb(255, 0, 0)][SIZE=4]Пример:[/COLOR][COLOR=rgb(209, 213, 216)] если игрок, используя баг, убирает ограничение на использование оружия в зеленой зоне, сбивает темп стрельбы, либо быстро перемещается во время войны за бизнес или во время перестрелки на мероприятии с семейными контейнерами, последует наказание в виде Jail на 120 минут. Данное наказание используется в случаях, когда, используя ошибку, было получено преимущество перед другими игроками[/SIZE][/COLOR][/FONT][/LEFT]<br>" +
              "[*][LEFT][FONT=book antiqua][COLOR=rgb(255, 0, 0)][SIZE=4]Пример: [/COLOR][COLOR=rgb(209, 213, 216)] если игрок использует баги, связанные с анимацией, и при этом не влияет на игровой процесс других игроков, а также не получает преимущество перед другими игроками, последует наказание в виде Jail на 60 минут.[/SIZE][/COLOR][/FONT][/LEFT]<br>" +
              "[/LIST]<br><br>" +
              '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k5Vd0G2H/image.png[/img][/url][/CENTER]<br>' +
              "[I][CENTER][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=rgb(255, 165, 0)][B][SIZE=1]Role Play[/SIZE][/CENTER][/B][/COLOR]<br>" +
              '[CENTER][url=https://postimages.org/][img]https://media.discordapp.net/attachments/1115566790790098944/1115597676717801482/standard_2.gif?width=514&height=66[/img][/url][/CENTER]',
            prefix: ACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'Фейк',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k5Vd0G2H/image.png[/img][/url][/CENTER]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый(-ая) {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
              "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][FONT=times new roman][SIZE=4][COLOR=Red] Нарушитель [COLOR=White] будет наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
              "[CENTER][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4]4.10.[/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4]Запрещено создавать никнейм, повторяющий или похожий на существующие никнеймы игроков или администраторов по их написанию[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4] | Устное замечание + смена игрового никнейма / PermBan[/SIZE][/FONT][/COLOR][/CENTER]<br><br>" +
              '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k5Vd0G2H/image.png[/img][/url][/CENTER]<br>' +
              "[I][CENTER][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=rgb(255, 165, 0)][B][SIZE=1]Role Play[/SIZE][/B][/COLOR]",
            prefix: ACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'Не по форме',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k5Vd0G2H/image.png[/img][/url][/CENTER]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый(-ая) {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
     "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][FONT=times new roman][SIZE=4]Ваша жалоба составлена не по форме. Внимательно прочитайте правила подачи жалоб на игроков. - [/I][URL='https://forum.blackrussia.online/threads/Правила-подачи-жалоб-на-игроков.3429394/']*Нажмите сюда*[/URL][/SIZE][/FONT][/COLOR][/CENTER]<br><br>" +
              '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k5Vd0G2H/image.png[/img][/url][/CENTER]<br>' +
              "[I][CENTER][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=rgb(255, 165, 0)][B][SIZE=1]Role Play[/SIZE][/B][/COLOR]",
            prefix: UNACCEPT_PREFIX,
            status: false,
          },
{
            title: 'Неадекватная жалоба',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k5Vd0G2H/image.png[/img][/url][/CENTER]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый(-ая) {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
              "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][FONT=times new roman][SIZE=4]Ваша жалоба составлена в неадекватном формате, рассмотрению не подлежит. Внимательно прочитайте правила подачи жалоб на игроков, закрепленные в этом разделе.[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
              '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k5Vd0G2H/image.png[/img][/url][/CENTER]<br>' +
              "[I][CENTER][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=rgb(255, 165, 0)][B][SIZE=1]Role Play[/SIZE][/B][/COLOR]",
            prefix: UNACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'Уже наказан',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k5Vd0G2H/image.png[/img][/url][/CENTER]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый(-ая) {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
              "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][FONT=times new roman][SIZE=4]Данный нарушитель уже был наказан ранее.[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
              '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k5Vd0G2H/image.png[/img][/url][/CENTER]<br>' +
              "[I][CENTER][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=rgb(255, 165, 0)][B][SIZE=1]Role Play[/SIZE][/B][/COLOR]",
            prefix: WATCHED_PREFIX,
            status: false,
          },
          {
            title: 'Уже был дан ответ',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k5Vd0G2H/image.png[/img][/url][/CENTER]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый(-ая) {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
              "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][FONT=times new roman][SIZE=4]Вам уже был дан ответ в прошлых жалобах[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
              '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k5Vd0G2H/image.png[/img][/url][/CENTER]<br>' +
              "[I][CENTER][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=rgb(255, 165, 0)][B][SIZE=1]Role Play[/SIZE][/B][/COLOR]",
            prefix: UNACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'Слив Глобального чата',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k5Vd0G2H/image.png[/img][/url][/CENTER]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый(-ая) {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
              "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][FONT=times new roman][SIZE=4][COLOR=Red] Нарушитель [COLOR=White] будет наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
              "[CENTER][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4]3.08.[/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4]Запрещены любые формы «слива» посредством использования глобальных чатов.[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4] | PermBan[/SIZE][/FONT][/COLOR][/CENTER]<br><br>" +
              '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k5Vd0G2H/image.png[/img][/url][/CENTER]<br>' +
              "[I][CENTER][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=rgb(255, 165, 0)][B][SIZE=1]Role Play[/SIZE][/B][/COLOR]",
            prefix: ACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'Слив склада',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k5Vd0G2H/image.png[/img][/url][/CENTER]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый(-ая) {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
              "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][FONT=times new roman][SIZE=4][COLOR=Red] Нарушитель [COLOR=White] будет наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
              "[CENTER][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4]2.09.[/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4]Запрещено сливать склад фракции / семьи путем взятия большого количестве ресурсов, или же брать больше, чем разрешили на самом деле.[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4] | Ban 15 - 30 дней / PermBan[/SIZE][/FONT][/COLOR][/CENTER]<br><br>" +
              "[*][LEFT][FONT=book antiqua][COLOR=rgb(255, 0, 0)][SIZE=4]Примечание:[/COLOR][COLOR=rgb(209, 213, 216)]  в описании семьи должны быть указаны условия взаимодействия со складом. Если лидер семьи предоставил неограниченный доступ к складу и забыл снять его, администрация не несет ответственности за возможные последствия. Жалобы по данному пункту правил принимаются только от лидера семьи.[/SIZE][/COLOR][/FONT][/LEFT]<br>" +
              "[*][LEFT][FONT=book antiqua][COLOR=rgb(255, 0, 0)][SIZE=4]Примечание:[/COLOR][COLOR=rgb(209, 213, 216)] исключение всех или части игроков из состава семьи без ведома лидера также считается сливом.[/SIZE][/COLOR][/FONT][/LEFT]<br>" +
              '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k5Vd0G2H/image.png[/img][/url][/CENTER]<br>' +
              "[I][CENTER][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=rgb(255, 165, 0)][B][SIZE=1]Role Play[/SIZE][/B][/COLOR]",
            prefix: ACCEPT_PREFIX,
            status: false,
          },
{
            title: 'Нет условий взаимодействия со складом',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k5Vd0G2H/image.png[/img][/url][/CENTER]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый(-ая) {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
              "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][FONT=times new roman][SIZE=4]В описании семьи должны быть указаны условия взаимодействия со складом на ваших доказательствах они отсутствуют. Если лидер семьи предоставил неограниченный доступ к складу и забыл снять его, администрация не несет ответственности за возможные последствия. Жалобы по данному пункту правил принимаются только от лидера семьи.[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
              '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k5Vd0G2H/image.png[/img][/url][/CENTER]<br>' +
              "[I][CENTER][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=rgb(255, 165, 0)][B][SIZE=1]Role Play[/SIZE][/B][/COLOR]",
            prefix: UNACCEPT_PREFIX,
            status: false,
          },
          {
        title: '-----------------------------------------------------------> Role Play Биография <-----------------------------------------------------------',
        dpstyle: 'oswald: 3px;     color: #fff; background: #f90; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #7851A9',
	   },
       {
            title: 'Одобрено',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k5Vd0G2H/image.png[/img][/url][/CENTER]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый(-ая) {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
            "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Ваша RolePlay Биография получает статус [/SIZE][/FONT][/I][/COLOR][COLOR=rgb(152, 251, 152)][I][FONT=times new roman][SIZE=4]Одобрено[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k5Vd0G2H/image.png[/img][/url][/CENTER]<br>' +
            "[I][CENTER][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=rgb(255, 165, 0)][B][SIZE=1]Role Play[/SIZE][/B][/COLOR]",
            prefix: ACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'Отказано',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k5Vd0G2H/image.png[/img][/url][/CENTER]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый(-ая) {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
            "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Ваша RolePlay Биография получает статус [/SIZE][/FONT][/I][/COLOR][COLOR=rgb(255, 0, 0)][I][FONT=times new roman][SIZE=4]Отказано[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k5Vd0G2H/image.png[/img][/url][/CENTER]<br>' +
            "[I][CENTER][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=rgb(255, 165, 0)][B][SIZE=1]Role Play[/SIZE][/B][/COLOR]",
            prefix: UNACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'Дополните информацию',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k5Vd0G2H/image.png[/img][/url][/CENTER]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый(-ая) {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
            "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]В пункте *Детство*, *Юность и Взрослая* жизнь мало информации.[/SIZE][/FONT][/I][/COLOR][COLOR=rgb(255, 0, 0)][I][FONT=times new roman][SIZE=4]Отказано[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k5Vd0G2H/image.png[/img][/url][/CENTER]<br>' +
            "[I][CENTER][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=rgb(255, 165, 0)][B][SIZE=1]Role Play[/SIZE][/B][/COLOR]",
            prefix: UNACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'Заголовок не по форме',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k5Vd0G2H/image.png[/img][/url][/CENTER]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый(-ая) {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
            "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]В вашей RolePlay Биографии заголовок написан не по форме, внимательно прочитайте правила РП Биографии в закрепленые в данном разделе[/SIZE][/FONT][/I][/COLOR][COLOR=rgb(255, 0, 0)][I][FONT=times new roman][SIZE=4]Отказано[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k5Vd0G2H/image.png[/img][/url][/CENTER]<br>' +
            "[I][CENTER][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=rgb(255, 165, 0)][B][SIZE=1]Role Play[/SIZE][/B][/COLOR]",
            prefix: UNACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'Не по форме',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k5Vd0G2H/image.png[/img][/url][/CENTER]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый(-ая) {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
            "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Ваша RolePlay Биография написана не по форме [/SIZE][/FONT][/I][/COLOR][COLOR=rgb(255, 0, 0)][I][FONT=times new roman][SIZE=4]Отказано[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k5Vd0G2H/image.png[/img][/url][/CENTER]<br>' +
            "[I][CENTER][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=rgb(255, 165, 0)][B][SIZE=1]Role Play[/SIZE][/B][/COLOR]",
            prefix: UNACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'Не дополнили',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k5Vd0G2H/image.png[/img][/url][/CENTER]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый(-ая) {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
            "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Вы не дополнили свою RolePlay Биографию [/SIZE][/FONT][/I][/COLOR][COLOR=rgb(255, 0, 0)][I][FONT=times new roman][SIZE=4]Отказано[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k5Vd0G2H/image.png[/img][/url][/CENTER]<br>' +
            "[I][CENTER][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=rgb(255, 165, 0)][B][SIZE=1]Role Play[/SIZE][/B][/COLOR]",
            prefix: UNACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'Не грамотная',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k5Vd0G2H/image.png[/img][/url][/CENTER]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый(-ая) {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
            "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Ваша RolePlay Биография оформлена неграмотно.[/SIZE][/FONT][/I][/COLOR][COLOR=rgb(255, 0, 0)][I][FONT=times new roman][SIZE=4]Отказано[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
            "[LIST]<br>" +
            "[*][LEFT][FONT=book antiqua][COLOR=rgb(255, 0, 0)][SIZE=4]Примечание: [/SIZE][/COLOR][COLOR=rgb(209, 213, 216)][SIZE=4]Грамматическая ошибка - это ошибка в структуре языковой единицы: в структуре слова, словосочетания или предложения; это нарушение какой-либо грамматической нормы - словообразовательной, морфологической, синтаксической.[/SIZE][/COLOR][/FONT][/LEFT]<br>" +
            "[/LIST]<br>" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k5Vd0G2H/image.png[/img][/url][/CENTER]<br>' +
            "[I][CENTER][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=rgb(255, 165, 0)][B][SIZE=1]Role Play[/SIZE][/B][/COLOR]",
            prefix: UNACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'Не грамотная(знаки препинания)',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k5Vd0G2H/image.png[/img][/url][/CENTER]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый(-ая) {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
            "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Ваша RolePlay Биография оформлена неграмотно.[/SIZE][/FONT][/I][/COLOR][COLOR=rgb(255, 0, 0)][I][FONT=times new roman][SIZE=4]Отказано[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
            "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][FONT=times new roman][SIZE=4] Обратите внимание на знаки препинания!.[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
            "[LIST]<br>" +
            "[*][LEFT][FONT=book antiqua][COLOR=rgb(255, 0, 0)][SIZE=4]Примечание: [/SIZE][/COLOR][COLOR=rgb(209, 213, 216)][SIZE=4]Пунктуационная ошибка - это неиспользование пишущим необходимого знака препинания или его употребление там, где он не требуется, а также необоснованная замена одного знака препинания другим.[/SIZE][/COLOR][/FONT][/LEFT]<br>" +
            "[/LIST]<br>" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k5Vd0G2H/image.png[/img][/url][/CENTER]<br>' +
            "[I][CENTER][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=rgb(255, 165, 0)][B][SIZE=1]Role Play[/SIZE][/B][/COLOR]",
            prefix: UNACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'От 3-го лица',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k5Vd0G2H/image.png[/img][/url][/CENTER]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый(-ая) {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
            "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Ваша RolePlay Биография написана от 3-его лица [/SIZE][/FONT][/I][/COLOR][COLOR=rgb(255, 0, 0)][I][FONT=times new roman][SIZE=4]Отказано[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k5Vd0G2H/image.png[/img][/url][/CENTER]<br>' +
            "[I][CENTER][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=rgb(255, 165, 0)][B][SIZE=1]Role Play[/SIZE][/B][/COLOR]",
            prefix: UNACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'Супергерой',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k5Vd0G2H/image.png[/img][/url][/CENTER]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый(-ая) {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
            "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Вы приписали своему персонажу суперспособности  [/SIZE][/FONT][/I][/COLOR][COLOR=rgb(255, 0, 0)][I][FONT=times new roman][SIZE=4]Отказано[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k5Vd0G2H/image.png[/img][/url][/CENTER]<br>' +
            "[I][CENTER][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=rgb(255, 165, 0)][B][SIZE=1]Role Play[/SIZE][/B][/COLOR]",
            prefix: UNACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'Копипаст',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k5Vd0G2H/image.png[/img][/url][/CENTER]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый(-ая) {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
            "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Ваша RolePlay Биография скопирована у другого человека[/SIZE][/FONT][/I][/COLOR][COLOR=rgb(255, 0, 0)][I][FONT=times new roman][SIZE=4]Отказано[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k5Vd0G2H/image.png[/img][/url][/CENTER]<br>' +
            "[I][CENTER][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=rgb(255, 165, 0)][B][SIZE=1]Role Play[/SIZE][/B][/COLOR]",
            prefix: UNACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'Nrp NickName',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k5Vd0G2H/image.png[/img][/url][/CENTER]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый(-ая) {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
            "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]У вас NonRp NickName [/SIZE][/FONT][/I][/COLOR][COLOR=rgb(255, 0, 0)][I][FONT=times new roman][SIZE=4]Отказано[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k5Vd0G2H/image.png[/img][/url][/CENTER]<br>' +
            "[I][CENTER][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=rgb(255, 165, 0)][B][SIZE=1]Role Play[/SIZE][/B][/COLOR]",
            prefix: UNACCEPT_PREFIX,
            status: false,
          },
{
            title: 'NickName на Анг',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k5Vd0G2H/image.png[/img][/url][/CENTER]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый(-ая) {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
            "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Ваша RolePlay - биография отказана т.к ваш NickName должен быть написан на русском языке. [/SIZE][/FONT][/I][/COLOR][COLOR=rgb(255, 0, 0)][I][FONT=times new roman][SIZE=4]Отказано[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k5Vd0G2H/image.png[/img][/url][/CENTER]<br>' +
            "[I][CENTER][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=rgb(255, 165, 0)][B][SIZE=1]Role Play[/SIZE][/B][/COLOR]",
            prefix: UNACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'Дата рождения с годом',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k5Vd0G2H/image.png[/img][/url][/CENTER]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый(-ая) {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
            "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]В вашей RolePlay Биографии не совпадает дата рождения с возрастом [/SIZE][/FONT][/I][/COLOR][COLOR=rgb(255, 0, 0)][I][FONT=times new roman][SIZE=4]Отказано[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k5Vd0G2H/image.png[/img][/url][/CENTER]<br>' +
            "[I][CENTER][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=rgb(255, 165, 0)][B][SIZE=1]Role Play[/SIZE][/B][/COLOR]",
            prefix: UNACCEPT_PREFIX,
            status: false,
          },
 {
            title: 'Дата рождения не полностью',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k5Vd0G2H/image.png[/img][/url][/CENTER]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый(-ая) {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
            "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]В ваша RolePlay Биографии дата рождения расписано не полностью [/SIZE][/FONT][/I][/COLOR][COLOR=rgb(255, 0, 0)][I][FONT=times new roman][SIZE=4]Отказано[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k5Vd0G2H/image.png[/img][/url][/CENTER]<br>' +
            "[I][CENTER][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=rgb(255, 165, 0)][B][SIZE=1]Role Play[/SIZE][/B][/COLOR]",
            prefix: UNACCEPT_PREFIX,
            status: false,
          },
         {
            title: 'Семья не полностью',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k5Vd0G2H/image.png[/img][/url][/CENTER]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый(-ая) {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
            "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]В вашей RolePlay Биографии семья расписано не полностью[/SIZE][/FONT][/I][/COLOR][COLOR=rgb(255, 0, 0)][I][FONT=times new roman][SIZE=4]Отказано[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k5Vd0G2H/image.png[/img][/url][/CENTER]<br>' +
            "[I][CENTER][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=rgb(255, 165, 0)][B][SIZE=1]Role Play[/SIZE][/B][/COLOR]",
            prefix: UNACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'На доработке',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k5Vd0G2H/image.png[/img][/url][/CENTER]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый(-ая) {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
            "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Ваша RolePlay Биография взята на доработку[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
            "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]У вас есть 24 часа чтобы дополнить RP Биографию[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k5Vd0G2H/image.png[/img][/url][/CENTER]<br>' +
            '[I][CENTER][SIZE=1][COLOR=rgb(255, 140, 0)][ICODE]На рассмотрение...[/ICODE][/SIZE][/CENTER][/COLOR]',
            prefix: PIN_PREFIX,
            status: true,
          },
  {
            title: 'Мало информации',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k5Vd0G2H/image.png[/img][/url][/CENTER]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый(-ая) {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
            "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]В вашей RolePlay - биографии крайне мало информации.[/SIZE][/FONT][/I][/COLOR][COLOR=rgb(255, 0, 0)][I][FONT=times new roman][SIZE=4]Отказано[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
            "[LIST]<br>" +
            "[*][LEFT][FONT=book antiqua][COLOR=rgb(255, 0, 0)][SIZE=4]Примечание: [/SIZE][/COLOR][COLOR=rgb(209, 213, 216)][SIZE=4]Внимательно прочитайте правила создания RP - биографий закрепленные в данном разделе и создайте новую тему, дополнив ее новой информацией.[/SIZE][/COLOR][/FONT][/LEFT]<br>" +
            "[/LIST]<br>" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k5Vd0G2H/image.png[/img][/url][/CENTER]<br>' +
            "[I][CENTER][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=rgb(255, 165, 0)][B][SIZE=1]Role Play[/SIZE][/B][/COLOR]",
            prefix: UNACCEPT_PREFIX,
            status: false,
          },
         {
            title: 'Нет личного фото',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k5Vd0G2H/image.png[/img][/url][/CENTER]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый(-ая) {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
            "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]В Вашей RolePlay Биографии отсутствует личное фото [/SIZE][/FONT][/I][/COLOR][COLOR=rgb(255, 0, 0)][I][FONT=times new roman][SIZE=4]Отказано[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k5Vd0G2H/image.png[/img][/url][/CENTER]<br>' +
            "[I][CENTER][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=rgb(255, 165, 0)][B][SIZE=1]Role Play[/SIZE][/B][/COLOR]",
            prefix: UNACCEPT_PREFIX,
            status: false,
           },
          {

        title: '------------------------------------------------------------> Role  Play  Ситуации <------------------------------------------------------------',
        dpstyle: 'oswald: 3px;     color: #fff; background: #f90; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #7851A9',
	},
      {
            title: 'Одобрено',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k5Vd0G2H/image.png[/img][/url][/CENTER]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый(-ая) {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
            "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Ваша RolePlay Ситуация получает статус [/SIZE][/FONT][/I][/COLOR][COLOR=rgb(152, 251, 152)][I][FONT=times new roman][SIZE=4]Одобрено[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k5Vd0G2H/image.png[/img][/url][/CENTER]<br>' +
            "[I][CENTER][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=rgb(255, 165, 0)][B][SIZE=1]Role Play[/SIZE][/B][/COLOR]",
            prefix: ACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'Не туда',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k5Vd0G2H/image.png[/img][/url][/CENTER]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый(-ая) {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
            "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Вы ошиблись разделом [/SIZE][/FONT][/I][/COLOR][COLOR=rgb(255, 0, 0)][I][FONT=times new roman][SIZE=4]Отказано[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k5Vd0G2H/image.png[/img][/url][/CENTER]<br>' +
            "[I][CENTER][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=rgb(255, 165, 0)][B][SIZE=1]Role Play[/SIZE][/B][/COLOR]",
            prefix: UNACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'Не по форме',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k5Vd0G2H/image.png[/img][/url][/CENTER]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый(-ая) {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
            "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Ваша RolePlay Ситуация написана не по форме [/SIZE][/FONT][/I][/COLOR][COLOR=rgb(255, 0, 0)][I][FONT=times new roman][SIZE=4]Отказано[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k5Vd0G2H/image.png[/img][/url][/CENTER]<br>' +
            "[I][CENTER][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=rgb(255, 165, 0)][B][SIZE=1]Role Play[/SIZE][/B][/COLOR]",
            prefix: UNACCEPT_PREFIX,
            status: false,
          },
         {
            title: 'Отказано',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k5Vd0G2H/image.png[/img][/url][/CENTER]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый(-ая) {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
            "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Ваша RolePlay Ситуация получает статус [/SIZE][/FONT][/I][/COLOR][COLOR=rgb(255, 0, 0)][I][FONT=times new roman][SIZE=4]Отказано[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k5Vd0G2H/image.png[/img][/url][/CENTER]<br>' +
            "[I][CENTER][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=rgb(255, 165, 0)][B][SIZE=1]Role Play[/SIZE][/B][/COLOR]",
            prefix: UNACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'На доработке',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k5Vd0G2H/image.png[/img][/url][/CENTER]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый(-ая) {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
            "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Ваша RolePlay Ситуация взята на доработку[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
            "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]У вас есть 24 часа чтобы дополнить свою RP Ситуацию[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k5Vd0G2H/image.png[/img][/url][/CENTER]<br>' +
            '[I][CENTER][SIZE=1][COLOR=rgb(255, 140, 0)][ICODE]На рассмотрение...[/ICODE][/SIZE][/CENTER][/COLOR]',
            prefix: PIN_PREFIX,
            status: true,
          },
          {
            title: 'Не грамотная',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k5Vd0G2H/image.png[/img][/url][/CENTER]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый(-ая) {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
            "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Ваша RolePlay Ситуация написана не грамотно т.е в ней много ошибок.[/SIZE][/FONT][/I][/COLOR][COLOR=rgb(255, 0, 0)][I][FONT=times new roman][SIZE=4]Отказано[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k5Vd0G2H/image.png[/img][/url][/CENTER]<br>' +
            "[I][CENTER][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=rgb(255, 165, 0)][B][SIZE=1]Role Play[/SIZE][/B][/COLOR]",
            prefix: UNACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'Копипаст',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k5Vd0G2H/image.png[/img][/url][/CENTER]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый(-ая) {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
            "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Ваша RolePlay Ситуация скопирована у другого человека[/SIZE][/FONT][/I][/COLOR][COLOR=rgb(255, 0, 0)][I][FONT=times new roman][SIZE=4]Отказано[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k5Vd0G2H/image.png[/img][/url][/CENTER]<br>' +
            "[I][CENTER][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=rgb(255, 165, 0)][B][SIZE=1]Role Play[/SIZE][/B][/COLOR]",
            prefix: UNACCEPT_PREFIX,
            status: false,
          },
         {
          title: 'Не дополнили',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k5Vd0G2H/image.png[/img][/url][/CENTER]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый(-ая) {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
            "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Вы не дополнили свою RolePlay Ситуацию [/SIZE][/FONT][/I][/COLOR][COLOR=rgb(255, 0, 0)][I][FONT=times new roman][SIZE=4]Отказано[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k5Vd0G2H/image.png[/img][/url][/CENTER]<br>' +
            "[I][CENTER][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=rgb(255, 165, 0)][B][SIZE=1]Role Play[/SIZE][/B][/COLOR]",
            prefix: UNACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'Заголовок не по форме',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k5Vd0G2H/image.png[/img][/url][/CENTER]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый(-ая) {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
            "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]В вашей RolePlay Ситуации заголовок написан не по форме, внимательно прочитайте правила РП Ситуации в закрепленые в данном разделе[/SIZE][/FONT][/I][/COLOR][COLOR=rgb(255, 0, 0)][I][FONT=times new roman][SIZE=4]Отказано[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k5Vd0G2H/image.png[/img][/url][/CENTER]<br>' +
            "[I][CENTER][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=rgb(255, 165, 0)][B][SIZE=1]Role Play[/SIZE][/B][/COLOR]",
            prefix: UNACCEPT_PREFIX,
            status: false,
          },
          {

        title: '---------------------------------------------------------> Role  Play  Организации <---------------------------------------------------------',
        dpstyle: 'oswald: 3px;     color: #fff; background: #f90; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: ##7851A9',
	},
         {
            title: 'Одобрено',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k5Vd0G2H/image.png[/img][/url][/CENTER]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый(-ая) {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
            "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Ваша RolePlay Организация получает статус [/SIZE][/FONT][/I][/COLOR][COLOR=rgb(152, 251, 152)][I][FONT=times new roman][SIZE=4]Одобрено[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k5Vd0G2H/image.png[/img][/url][/CENTER]<br>' +
            "[I][CENTER][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=rgb(255, 165, 0)][B][SIZE=1]Role Play[/SIZE][/B][/COLOR]",
            prefix: ACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'Не туда',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k5Vd0G2H/image.png[/img][/url][/CENTER]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый(-ая) {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
            "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Вы ошиблись разделом [/SIZE][/FONT][/I][/COLOR][COLOR=rgb(255, 0, 0)][I][FONT=times new roman][SIZE=4]Отказано[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k5Vd0G2H/image.png[/img][/url][/CENTER]<br>' +
            "[I][CENTER][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=rgb(255, 165, 0)][B][SIZE=1]Role Play[/SIZE][/B][/COLOR]",
            prefix: UNACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'Не по форме',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k5Vd0G2H/image.png[/img][/url][/CENTER]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый(-ая) {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
            "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Ваша RolePlay Организация написана не по форме [/SIZE][/FONT][/I][/COLOR][COLOR=rgb(255, 0, 0)][I][FONT=times new roman][SIZE=4]Отказано[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k5Vd0G2H/image.png[/img][/url][/CENTER]<br>' +
            "[I][CENTER][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=rgb(255, 165, 0)][B][SIZE=1]Role Play[/SIZE][/B][/COLOR]",
            prefix: UNACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'Отказано',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k5Vd0G2H/image.png[/img][/url][/CENTER]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый(-ая) {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
            "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Ваша RolePlay Организация получает статус [/SIZE][/FONT][/I][/COLOR][COLOR=rgb(255, 0, 0)][I][FONT=times new roman][SIZE=4]Отказано[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k5Vd0G2H/image.png[/img][/url][/CENTER]<br>' +
            "[I][CENTER][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=rgb(255, 165, 0)][B][SIZE=1]Role Play[/SIZE][/B][/COLOR]",
            prefix: UNACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'На доработке',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k5Vd0G2H/image.png[/img][/url][/CENTER]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый(-ая) {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
            "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Ваша RolePlay Организация взята на доработку[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
            "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]У вас есть 24 часа чтобы дополнить свою RP Организация [/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k5Vd0G2H/image.png[/img][/url][/CENTER]<br>' +
            '[I][CENTER][SIZE=1][COLOR=rgb(255, 140, 0)][ICODE]На рассмотрение...[/ICODE][/SIZE][/CENTER][/COLOR]',
            prefix: PIN_PREFIX,
            status: true,
          },
          {
            title: 'Не грамотная',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k5Vd0G2H/image.png[/img][/url][/CENTER]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый(-ая) {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
            "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Ваша RolePlay Организация написана не грамотно т.е вы допустили ней много ошибок.[/SIZE][/FONT][/I][/COLOR][COLOR=rgb(255, 0, 0)][I][FONT=times new roman][SIZE=4]Отказано[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k5Vd0G2H/image.png[/img][/url][/CENTER]<br>' +
            "[I][CENTER][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=rgb(255, 165, 0)][B][SIZE=1]Role Play[/SIZE][/B][/COLOR]",
            prefix: UNACCEPT_PREFIX,
            status: false,
          },
       {
            title: 'Копипаст',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k5Vd0G2H/image.png[/img][/url][/CENTER]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый(-ая) {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
            "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Ваша RolePlay Организация скопирована у другого человека[/SIZE][/FONT][/I][/COLOR][COLOR=rgb(255, 0, 0)][I][FONT=times new roman][SIZE=4]Отказано[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k5Vd0G2H/image.png[/img][/url][/CENTER]<br>' +
            "[I][CENTER][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=rgb(255, 165, 0)][B][SIZE=1]Role Play[/SIZE][/B][/COLOR]",
            prefix: UNACCEPT_PREFIX,
            status: false,
          },
         {
          title: 'Не дополнили',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k5Vd0G2H/image.png[/img][/url][/CENTER]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый(-ая) {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
            "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Вы не дополнили свою RolePlay Организацию [/SIZE][/FONT][/I][/COLOR][COLOR=rgb(255, 0, 0)][I][FONT=times new roman][SIZE=4]Отказано[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k5Vd0G2H/image.png[/img][/url][/CENTER]<br>' +
            "[I][CENTER][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=rgb(255, 165, 0)][B][SIZE=1]Role Play[/SIZE][/B][/COLOR]",
            prefix: UNACCEPT_PREFIX,
            status: false,
          },
         {
            title: 'Заголовок не по форме',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k5Vd0G2H/image.png[/img][/url][/CENTER]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый(-ая) {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
            "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]В вашей RolePlay Организации заголовок написан не по форме, внимательно прочитайте правила РП Организации в закрепленые в данном разделе[/SIZE][/FONT][/I][/COLOR][COLOR=rgb(255, 0, 0)][I][FONT=times new roman][SIZE=4]Отказано[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k5Vd0G2H/image.png[/img][/url][/CENTER]<br>' +
            "[I][CENTER][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=rgb(255, 165, 0)][B][SIZE=1]Role Play[/SIZE][/B][/COLOR]",
            prefix: UNACCEPT_PREFIX,
            status: false,
          },



	];

	$(document).ready(() => {
	// Загрузка скрипта для обработки шаблонов
	$('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');

	// Добавление кнопок при загрузке страницы
	addButton('На рассмотрении', 'pin', 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 183, 0, 0.5);');
    addButton('Отказано', 'unaccept', 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5);')
    addButton('Одобрено', 'accepted', 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 251, 152, 0.5);')
	addButton('Закрыто', 'closed', 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(138, 43, 226, 0.5);');
	addAnswers();

	// Поиск информации о теме
	const threadData = getThreadData();

	$(`button#ff`).click(() => pasteContent(8, threadData, true));
	$(`button#prr`).click(() => pasteContent(2, threadData, true));
	$(`button#zhb`).click(() => pasteContent(21, threadData, true));
	$('button#unaccept').click(() => editThreadData(UNACCEPT_PREFIX, false));
    $('button#accepted').click(() => editThreadData(ACCEPT_PREFIX, false));
	$('button#pin').click(() => editThreadData(PIN_PREFIX, true));
	$('button#teamProject').click(() => editThreadData(COMMAND_PREFIX, true));
	$('button#watched').click(() => editThreadData(WATCHED_PREFIX, false));
	$('button#decided').click(() => editThreadData(DECIDED_PREFIX, false));
	$('button#closed').click(() => editThreadData(CLOSE_PREFIX, false));
	$('button#closed_complaint').click(() => editThreadData(CLOSE_PREFIX, false, false));
	$('button#techspec').click(() => editThreadData(TEX_PREFIX, true));

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
