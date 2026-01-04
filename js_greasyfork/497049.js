// ==UserScript==
// @name         КФЛ / CHOCO
// @namespace    https://forum.blackrussia.online
// @version      0.86
// @description  Always remember who you are!
// @author       Daniil_Neclemente
// @match        https://forum.blackrussia.online/threads/*
// @include      https://forum.blackrussia.online/threads/
// @grant        none
// @license 	 MIT
// @borator Daniil_Neclemente
// @icon https://icons.iconarchive.com/icons/papirus-team/papirus-apps/48/emerald-theme-manager-icon-icon.png
// @downloadURL https://update.greasyfork.org/scripts/497049/%D0%9A%D0%A4%D0%9B%20%20CHOCO.user.js
// @updateURL https://update.greasyfork.org/scripts/497049/%D0%9A%D0%A4%D0%9B%20%20CHOCO.meta.js
// ==/UserScript==
(function () {
  'use strict';
const UNACCEPT_PREFIX = 4; // Prefix that will be set when thread closes
const ACCEPT_PREFIX = 8; // Prefix that will be set when thread accepted
const RESHENO_PREFIX = 6; // Prefix that will be set when solving the problem
const PIN_PREFIX = 2; // Prefix that will be set when thread pins
const GA_PREFIX = 12; // Prefix that will be set when thread send to ga
const COMMAND_PREFIX = 10; // Prefix that will be set when thread send to project team
const WATCHED_PREFIX = 9;
const CLOSE_PREFIX = 7;
const TEX_PREFIX = 13;
const buttons = [
    {
	  title: '_____________________________________________ღ Жалобы на игроков ღ_____________________________________________ ',
	},
     {
      title: 'Приветствие',
     content:
        '[CENTER][COLOR=rgb(226, 207, 188)]{{ greeting }}, уважаемый(ая) {{ user.mention }}.[/FONT][/I][/COLOR][/CENTER][/SIZE]',
    },
       {
      title: 'NonRP поведение',
      content:
		'[CENTER][B][COLOR=rgb(226, 207, 188)][FONT=georgia][SIZE=3]Доброго времени суток, уважаемый(ая) {{ user.mention }}.[/SIZE][/COLOR]<br><br>' +
        "[CENTER]Ваша жалоба [COLOR=rgb(0, 255, 0)]одобрена[/COLOR]. Игрок будет[COLOR=#ff0000] наказан [/COLOR]по данному пункту правил:<br> [COLOR=#ff0000] 2.01 [/COLOR]. Запрещено поведение, нарушающее нормы процессов Role Play режима игры [Color=#ff0000] | Jail 30 минут[/COLOR].[/CENTER]<br>" +

        '[COLOR=rgb(226, 207, 188)][CENTER]Закрыто.[/CENTER][/COLOR][/FONT]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
     {
      title: 'Уход от РП',
      content:
		'[CENTER][B][COLOR=rgb(226, 207, 188)][FONT=georgia][SIZE=3]Доброго времени суток, уважаемый(ая) {{ user.mention }}.[/SIZE][/COLOR]<br><br>' +
        "[CENTER]Ваша жалоба [COLOR=rgb(0, 255, 0)]одобрена[/COLOR]. Игрок будет[COLOR=#ff0000] наказан [/COLOR]по данному пункту правил:<br> [COLOR=#ff0000] 2.02 [/COLOR]. Запрещено целенаправленно уходить от Role Play процесса всеразличными способами [Color=#ff0000] | Jail 30 минут / Warn[/COLOR] <br>[Color=#ff0000]Примечание:[/COLOR] например, уходить в AFK при остановке транспортного средства правоохранительными органами, выходить из игры для избежания смерти, выходить из игры во время процесса задержания / ареста, полное игнорирование отыгровок другого игрока, которые так или иначе могут коснутся Вашего персонажа и так далее<br>.[/CENTER]<br>" +

        '[COLOR=rgb(226, 207, 188)][CENTER]Закрыто.[/CENTER][/COLOR][/FONT]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
        {
 title: 'ЕПП',
      content:
		'[CENTER][B][COLOR=rgb(226, 207, 188)][FONT=georgia][SIZE=3]Доброго времени суток, уважаемый(ая) {{ user.mention }}.[/SIZE][/COLOR]<br><br>' +
        "[CENTER]Ваша жалоба [COLOR=rgb(0, 255, 0)]одобрена[/COLOR]. Игрок будет[COLOR=#ff0000] наказан [/COLOR]по данному пункту правил:<br> [COLOR=#ff0000] 2.03 [/COLOR]. Запрещен NonRP Drive — вождение любого транспортного средства в невозможных для него условиях, а также вождение в неправдоподобной манере [Color=#ff0000] | Jail 30 минут[/COLOR].[/CENTER]<br>" +

        '[COLOR=rgb(226, 207, 188)][CENTER]Закрыто.[/CENTER][/COLOR][/FONT]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
        {
title: 'ЕПП фура/инко',
      content:
		'[CENTER][B][COLOR=rgb(226, 207, 188)][FONT=georgia][SIZE=3]Доброго времени суток, уважаемый(ая) {{ user.mention }}.[/SIZE][/COLOR]<br><br>' +
        "[CENTER]Ваша жалоба [COLOR=rgb(0, 255, 0)]одобрена[/COLOR]. Игрок будет[COLOR=#ff0000] наказан [/COLOR]по данному пункту правил:<br> [COLOR=#ff0000] 2.47 [/COLOR]. Запрещено ездить по полям на грузовом транспорте, инкассаторских машинах ([COLOR=#20B2AA]работа дальнобойщика, инкассатора[/COLOR]) [Color=#ff0000] | Jail 60 минут[/COLOR].[/CENTER]<br>" +

        '[COLOR=rgb(226, 207, 188)][CENTER]Закрыто.[/CENTER][/COLOR][/FONT]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
        {
    title: 'NRP обман',
      content:
       '[CENTER][B][COLOR=rgb(226, 207, 188)][FONT=georgia][SIZE=3]Доброго времени суток, уважаемый(ая) {{ user.mention }}.[/SIZE][/COLOR]<br><br>' +
         "[CENTER]Ваша жалоба [COLOR=rgb(0, 255, 0)]одобрена[/COLOR].Игрок будет [COLOR=#ff0000]наказан[/COLOR] по данному пункту правил:<br>[COLOR=#ff0000] 2.05 [/COLOR].Запрещены любые OOC обманы и их попытки, а также любые IC обманы с нарушением Role Play правил и логики[COLOR=rgb(255, 0, 0)] | PermBan[/COLOR]<br><br>" +
             '[COLOR=rgb(226, 207, 188)][CENTER]Закрыто.[/CENTER][/COLOR][/FONT]',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: 'СК',
      content:
		'[CENTER][B][COLOR=rgb(226, 207, 188)][FONT=georgia][SIZE=3]Доброго времени суток, уважаемый(ая) {{ user.mention }}.[/SIZE][/COLOR]<br><br>' +
        "[CENTER]Игрок будет [COLOR=#ff0000]наказан[/COLOR] по данному пункту правил:<br> [COLOR=#ff0000] 2.16 [/COLOR].  Запрещен SK (Spawn Kill) — убийство или нанесение урона на титульной территории любой фракции / организации, на месте появления игрока, а также на выходе из закрытых интерьеров и около них [Color=#ff0000] | Jail 60 минут / Warn (за два и более убийства)[/COLOR].[/CENTER]<br>" +

        '[COLOR=rgb(226, 207, 188)][CENTER]Закрыто.[/CENTER][/COLOR][/FONT]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'ДМ',
      content:
		'[CENTER][B][COLOR=rgb(226, 207, 188)][FONT=georgia][SIZE=3]Доброго времени суток, уважаемый(ая) {{ user.mention }}.[/SIZE][/COLOR]<br><br>' +
        "[CENTER]Ваша жалоба [COLOR=rgb(0, 255, 0)]одобрена[/COLOR]. Игрок будет[COLOR=#ff0000] наказан [/COLOR]по данному пункту правил:<br> [COLOR=#ff0000] 2.19 [/COLOR]. Запрещен DM (DeathMatch) — убийство или нанесение урона без веской IC причины [Color=#ff0000] | Jail 60 минут[/COLOR].[/CENTER]<br>" +

        '[COLOR=rgb(226, 207, 188)][CENTER]Закрыто.[/CENTER][/COLOR][/FONT]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'ДБ',
      content:
		'[CENTER][B][COLOR=rgb(226, 207, 188)][FONT=georgia][SIZE=3]Доброго времени суток, уважаемый(ая) {{ user.mention }}.[/SIZE][/COLOR]<br><br>' +
        "[CENTER]Ваша жалоба [COLOR=rgb(0, 255, 0)]одобрена[/COLOR]. Игрок будет[COLOR=#ff0000] наказан [/COLOR]по данному пункту правил:<br> [COLOR=#ff0000] 2.13 [/COLOR]. Запрещен DB (DriveBy) — намеренное убийство / нанесение урона без веской IC причины на любом виде транспорта [Color=#ff0000] | Jail 60 минут[/COLOR].[/CENTER]<br>" +

        '[COLOR=rgb(226, 207, 188)][CENTER]Закрыто.[/CENTER][/COLOR][/FONT]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'MG',
      content:
		'[CENTER][B][COLOR=rgb(226, 207, 188)][FONT=georgia][SIZE=3]Доброго времени суток, уважаемый(ая) {{ user.mention }}.[/SIZE][/COLOR]<br><br>' +
        "[CENTER]Ваша жалоба [COLOR=rgb(0, 255, 0)]одобрена[/COLOR]. Игрок будет[COLOR=#ff0000] наказан [/COLOR]по данному пункту правил:<br> [COLOR=#ff0000] 2.18 [/COLOR]. Запрещен MG (MetaGaming) — использование ООС информации, которую Ваш персонаж никак не мог получить в IC процессе [Color=#ff0000] | Mute 30 минут[/COLOR].[/CENTER]<br>" +

        '[COLOR=rgb(226, 207, 188)][CENTER]Закрыто.[/CENTER][/COLOR][/FONT]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
	  title: 'Капс',
	  content:
		'[CENTER][B][COLOR=rgb(226, 207, 188)][FONT=georgia][SIZE=3]Доброго времени суток, уважаемый(ая) {{ user.mention }}.[/SIZE][/COLOR]<br><br>' +
		"[CENTER]Ваша жалоба [COLOR=rgb(0, 255, 0)]одобрена[/COLOR]. Игрок будет[COLOR=#ff0000] наказан [/COLOR]по данному пункту правил:<br> [COLOR=#ff0000] 3.02 [/COLOR]. Запрещено использование верхнего регистра (CapsLock) при написании любого текста в любом чате [Color=#ff0000] | Mute 30 минут[/COLOR].[/CENTER]<br>" +

        '[COLOR=rgb(226, 207, 188)][CENTER]Закрыто.[/CENTER][/COLOR][/FONT]',
      prefix: ACCEPT_PREFIX,
	  status: false,
	},
    {
	  title: 'Флуд',
	  content:
		'[CENTER][B][COLOR=rgb(226, 207, 188)][FONT=georgia][SIZE=3]Доброго времени суток, уважаемый(ая) {{ user.mention }}.[/SIZE][/COLOR]<br><br>' +
		"[CENTER]Ваша жалоба [COLOR=rgb(0, 255, 0)]одобрена[/COLOR]. Игрок будет[COLOR=#ff0000] наказан [/COLOR]по данному пункту правил:<br> [COLOR=#ff0000] 3.05 [/COLOR]. Запрещен флуд — 3 и более повторяющихся сообщений от одного и того же игрока [Color=#ff0000] | Mute 30 минут[/COLOR].[/CENTER]<br>" +

        '[COLOR=rgb(226, 207, 188)][CENTER]Закрыто.[/CENTER][/COLOR][/FONT]',
      prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
      title: 'злоуп симв/букв ',
      content:
		'[CENTER][B][COLOR=rgb(226, 207, 188)][FONT=georgia][SIZE=3]Доброго времени суток, уважаемый(ая) {{ user.mention }}.[/SIZE][/COLOR]<br><br>' +
        "[CENTER]Ваша жалоба [COLOR=rgb(0, 255, 0)]одобрена[/COLOR]. Игрок будет[COLOR=#ff0000] наказан [/COLOR]по данному пункту правил:<br> [COLOR=#ff0000] 3.06 [/COLOR]. Запрещено злоупотребление знаков препинания и прочих символов [Color=#ff0000] | Mute 30 минут[/COLOR].[/CENTER]<br>" +

        '[COLOR=rgb(226, 207, 188)][CENTER]Закрыто.[/CENTER][/COLOR][/FONT]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'угроза со стороны адм ',
      content:
		'[CENTER][B][COLOR=rgb(226, 207, 188)][FONT=georgia][SIZE=3]Доброго времени суток, уважаемый(ая) {{ user.mention }}.[/SIZE][/COLOR]<br><br>' +
        "[CENTER]Ваша жалоба [COLOR=rgb(0, 255, 0)]одобрена[/COLOR]. Игрок будет[COLOR=#ff0000] наказан [/COLOR]по данному пункту правил:<br> [COLOR=#ff0000] 3.09 [/COLOR]. Запрещены любые угрозы о наказании игрока со стороны администрации [Color=#ff0000] | Mute 30 минут[/COLOR].[/CENTER]<br>" +

        '[COLOR=rgb(226, 207, 188)][CENTER]Закрыто.[/CENTER][/COLOR][/FONT]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Оск в нонрп чат',
      content:
		'[CENTER][B][COLOR=rgb(226, 207, 188)][FONT=georgia][SIZE=3]Доброго времени суток, уважаемый(ая) {{ user.mention }}.[/SIZE][/COLOR]<br><br>' +
        "[CENTER]Ваша жалоба [COLOR=rgb(0, 255, 0)]одобрена[/COLOR]. Игрок будет[COLOR=#ff0000] наказан [/COLOR]по данному пункту правил:<br> [COLOR=#ff0000] 3.03 [/COLOR]. Любые формы оскорблений, издевательств, расизма, дискриминации, религиозной враждебности, сексизма в OOC чате запрещены [Color=#ff0000] | Mute 30 минут[/COLOR].[/CENTER]<br>" +

        '[COLOR=rgb(226, 207, 188)][CENTER]Закрыто.[/CENTER][/COLOR][/FONT]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Оск порчащие честь',
      content:
		'[CENTER][B][COLOR=rgb(226, 207, 188)][FONT=georgia][SIZE=3]Доброго времени суток, уважаемый(ая) {{ user.mention }}.[/SIZE][/COLOR]<br><br>' +
        "[CENTER]Ваша жалоба [COLOR=rgb(0, 255, 0)]одобрена[/COLOR]. Игрок будет[COLOR=#ff0000] наказан [/COLOR]по данному пункту правил:<br> [COLOR=#ff0000] 3.07 [/COLOR]. Запрещены совершенно любые оскорбления или действия, порочащие честь и достоинства, несущие в себе подтекст сексуального характера вне зависимости от чата [Color=#ff0000] | Mute 30 минут[/COLOR].[/CENTER]<br>" +

        '[COLOR=rgb(226, 207, 188)][CENTER]Закрыто.[/CENTER][/COLOR][/FONT]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Оск/Упом родни',
      content:
		'[CENTER][B][COLOR=rgb(226, 207, 188)][FONT=georgia][SIZE=3]Доброго времени суток, уважаемый(ая) {{ user.mention }}.[/SIZE][/COLOR]<br><br>' +
        "[CENTER]Ваша жалоба [COLOR=rgb(0, 255, 0)]одобрена[/COLOR]. Игрок будет[COLOR=#ff0000] наказан [/COLOR]по данному пункту правил:<br> [COLOR=#ff0000] 3.04 [/COLOR]. Запрещено оскорбление или косвенное упоминание родных вне зависимости от чата (IC или OOC) [Color=#ff0000] | Mute 120 минут / Ban 7 - 15 дней[/COLOR].[/CENTER]<br>" +

        '[COLOR=rgb(226, 207, 188)][CENTER]Закрыто.[/CENTER][/COLOR][/FONT]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
title: 'Постороннее ПО/Изм. Файлов игры',
      content:
		'[CENTER][B][COLOR=rgb(226, 207, 188)][FONT=georgia][SIZE=3]Доброго времени суток, уважаемый(ая) {{ user.mention }}.[/SIZE][/COLOR]<br><br>' +
        "[CENTER]Ваша жалоба [COLOR=rgb(0, 255, 0)]одобрена[/COLOR]. Игрок будет[COLOR=#ff0000] наказан [/COLOR]по данному пункту правил:<br> [COLOR=#ff0000] 2.22 [/COLOR]. Запрещено хранить / использовать / распространять стороннее программное обеспечение или любые другие средства, позволяющие получить преимущество над другими игроками [Color=#ff0000] |  Ban 15 - 30 дней / PermBan[/COLOR].[/CENTER]<br>" +

        '[COLOR=rgb(226, 207, 188)][CENTER]Закрыто.[/CENTER][/COLOR][/FONT]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
title: 'Обход системы',
      content:
		'[CENTER][B][COLOR=rgb(226, 207, 188)][FONT=georgia][SIZE=3]Доброго времени суток, уважаемый(ая) {{ user.mention }}.[/SIZE][/COLOR]<br><br>' +
        "[CENTER]Ваша жалоба [COLOR=rgb(0, 255, 0)]одобрена[/COLOR]. Игрок будет[COLOR=#ff0000] наказан [/COLOR]по данному пункту правил:<br> [COLOR=#ff0000] 2.21 [/COLOR]. Запрещено пытаться обходить игровую систему или использовать любые баги сервера [Color=#ff0000] | Ban 15 - 30 дней / PermBan (по согласованию с ГА, ЗГА, руководством тех. специалистов)[/COLOR].[/CENTER]<br>" +

		'[COLOR=rgb(226, 207, 188)][CENTER]Закрыто.[/CENTER][/COLOR][/FONT]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Масс ДМ',
      content:
		'[CENTER][B][COLOR=rgb(226, 207, 188)][FONT=georgia][SIZE=3]Доброго времени суток, уважаемый(ая) {{ user.mention }}.[/SIZE][/COLOR]<br><br>' +
        "[CENTER]Ваша жалоба [COLOR=rgb(0, 255, 0)]одобрена[/COLOR]. Игрок будет[COLOR=#ff0000] наказан [/COLOR]по данному пункту правил:<br> [COLOR=#ff0000] 2.20 [/COLOR]. Запрещен Mass DM (Mass DeathMatch) — убийство или нанесение урона без веской IC причины более трем игрокам [Color=#ff0000] | Warn / Ban 3 - 7 дней[/COLOR].[/CENTER]<br>" +

        '[COLOR=rgb(226, 207, 188)][CENTER]Закрыто.[/CENTER][/COLOR][/FONT]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Реклама промо',
      content:
		'[CENTER][B][COLOR=rgb(226, 207, 188)][FONT=georgia][SIZE=3]Доброго времени суток, уважаемый(ая) {{ user.mention }}.[/SIZE][/COLOR]<br><br>' +
        "[CENTER]Ваша жалоба [COLOR=rgb(0, 255, 0)]одобрена[/COLOR]. Игрок будет[COLOR=#ff0000] наказан [/COLOR]по данному пункту правил:<br> [COLOR=#ff0000] 3.21 [/COLOR]. Запрещается реклама промокодов в игре, а также их упоминание в любом виде во всех чатах. [Color=#ff0000] | Ban 30 дней[/Color].[/CENTER]<br>" +

        '[COLOR=rgb(226, 207, 188)][CENTER]Закрыто.[/CENTER][/COLOR][/FONT]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Продажа Промо',
      content:
		'[CENTER][B][COLOR=rgb(226, 207, 188)][FONT=georgia][SIZE=3]Доброго времени суток, уважаемый(ая) {{ user.mention }}.[/SIZE][/COLOR]<br><br>' +
        "[CENTER]Ваша жалоба [COLOR=rgb(0, 255, 0)]одобрена[/COLOR]. Игрок будет[COLOR=#ff0000] наказан [/COLOR]по данному пункту правил:<br> [COLOR=#ff0000] 2.43 [/COLOR] . Запрещена продажа / обмен / покупка поощрительной составляющей от лица проекта, будь то бонус-код, либо промокод, который выдается безвозмездно игрокам в целях промоакций [Color=#ff0000] | Mute 120 минут[/Color].[/CENTER]<br>" +

        '[COLOR=rgb(226, 207, 188)][CENTER]Закрыто.[/CENTER][/COLOR][/FONT]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Неув обр. к адм',
      content:
		'[CENTER][B][COLOR=rgb(226, 207, 188)][FONT=georgia][SIZE=3]Доброго времени суток, уважаемый(ая) {{ user.mention }}.[/SIZE][/COLOR]<br><br>' +
        "[CENTER]Ваша жалоба [COLOR=rgb(0, 255, 0)]одобрена[/COLOR]. Игрок будет[COLOR=#ff0000] наказан [/COLOR]по данному пункту правил:<br> [COLOR=#ff0000] 2.54 [/COLOR]. Запрещено неуважительное обращение, неадекватное поведение, угрозы в любом их проявлении по отношению к администрации [Color=#ff0000] | Mute 180 минут[/COLOR][/CENTER]<br>" +

        '[COLOR=rgb(226, 207, 188)][CENTER]Закрыто.[/CENTER][/COLOR][/FONT]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Оск. Администрации',
      content:
		'[CENTER][B][COLOR=rgb(226, 207, 188)][FONT=georgia][SIZE=3]Доброго времени суток, уважаемый(ая) {{ user.mention }}.[/SIZE][/COLOR]<br><br>' +
        "[CENTER]Ваша жалоба [COLOR=rgb(0, 255, 0)]одобрена[/COLOR]. Игрок будет[COLOR=#ff0000] наказан [/COLOR]по данному пункту правил:<br> [COLOR=#ff0000] 2.54 [/COLOR]. Запрещено неуважительное обращение, неадекватное поведение, угрозы в любом их проявлении по отношению к администрации [Color=#ff0000] | Mute 180 минут[/COLOR][/CENTER]<br>" +

        '[COLOR=rgb(226, 207, 188)][CENTER]Закрыто.[/CENTER][/COLOR][/FONT]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
title: 'Обман адм',
      content:
		'[CENTER][B][COLOR=rgb(226, 207, 188)][FONT=georgia][SIZE=3]Доброго времени суток, уважаемый(ая) {{ user.mention }}.[/SIZE][/COLOR]<br><br>' +
        "[CENTER]Ваша жалоба [COLOR=rgb(0, 255, 0)]одобрена[/COLOR]. Игрок будет[COLOR=#ff0000] наказан [/COLOR]по данному пункту правил:<br> [COLOR=#ff0000] 2.32 [/COLOR] . Запрещено введение в заблуждение, обман администрации на всех ресурсах проекта [Color=#ff0000] | Ban 7 - 15 дней / PermBan[/COLOR][/CENTER]<br>" +

        '[COLOR=rgb(226, 207, 188)][CENTER]Закрыто.[/CENTER][/COLOR][/FONT]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Выдача себя за адм',
      content:
		'[CENTER][B][COLOR=rgb(226, 207, 188)][FONT=georgia][SIZE=3]Доброго времени суток, уважаемый(ая) {{ user.mention }}.[/SIZE][/COLOR]<br><br>' +
        "[CENTER]Ваша жалоба [COLOR=rgb(0, 255, 0)]одобрена[/COLOR]. Игрок будет[COLOR=#ff0000] наказан [/COLOR]по данному пункту правил:<br> [COLOR=#ff0000] 3.10 [/COLOR]. Запрещена выдача себя за администратора, если таковым не являетесь [Color=#ff0000] | Ban 7 - 15 + ЧС администрации[/COLOR][/CENTER]<br>" +

        '[COLOR=rgb(226, 207, 188)][CENTER]Закрыто.[/CENTER][/COLOR][/FONT]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
 title: 'Оск. Проекта',
      content:
		'[CENTER][B][COLOR=rgb(226, 207, 188)][FONT=georgia][SIZE=3]Доброго времени суток, уважаемый(ая) {{ user.mention }}.[/SIZE][/COLOR]<br><br>' +
        "[CENTER]Ваша жалоба [COLOR=rgb(0, 255, 0)]одобрена[/COLOR]. Игрок будет[COLOR=#ff0000] наказан [/COLOR]по данному пункту правил:<br> [COLOR=#ff0000] 2.40 [/COLOR].  Запрещены совершенно любые деструктивные действия по отношению к проекту: неконструктивная критика, призывы покинуть проект, попытки нарушить развитие проекта или любые другие действия, способные привести к помехам в игровом процессе [Color=#ff0000] |Mute 300 минут / Ban 30 дней (Ban выдается по согласованию с главным администратором)[/COLOR][/CENTER]<br>" +

        '[COLOR=rgb(226, 207, 188)][CENTER]Закрыто.[/CENTER][/COLOR][/FONT]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
title: 'Призыв покинуть проект',
      content:
		'[CENTER][B][COLOR=rgb(226, 207, 188)][FONT=georgia][SIZE=3]Доброго времени суток, уважаемый(ая) {{ user.mention }}.[/SIZE][/COLOR]<br><br>' +
        "[CENTER]Ваша жалоба [COLOR=rgb(0, 255, 0)]одобрена[/COLOR]. Игрок будет[COLOR=#ff0000] наказан [/COLOR]по данному пункту правил:<br> [COLOR=#ff0000] 2.40 [/COLOR].  Запрещены совершенно любые деструктивные действия по отношению к проекту: неконструктивная критика, призывы покинуть проект, попытки нарушить развитие проекта или любые другие действия, способные привести к помехам в игровом процессе [Color=#ff0000] | Mute 300 минут / Ban 30 дней [/COLOR][COLOR=#FFFFFF]( [/COLOR][COLOR=#FF0000]Ban выдается по согласованию с главным администратором[/COLOR][COLOR=#FFFFFF] )[/COLOR][/CENTER]<br>" +

        '[COLOR=rgb(226, 207, 188)][CENTER]Закрыто.[/CENTER][/COLOR][/FONT]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Слив глабального чата',
      content:
		'[CENTER][B][COLOR=rgb(226, 207, 188)][FONT=georgia][SIZE=3]Доброго времени суток, уважаемый(ая) {{ user.mention }}.[/SIZE][/COLOR]<br><br>' +
        "[CENTER]Ваша жалоба [COLOR=rgb(0, 255, 0)]одобрена[/COLOR]. Игрок будет[COLOR=#ff0000] наказан [/COLOR]по данному пункту правил:<br>[COLOR=#ff0000] 3.08 [/COLOR]. Запрещены любые формы «слива» посредством использования глобальных чатов [Color=#ff0000] | PermBan[/COLOR].[/CENTER]<br>" +

        '[COLOR=rgb(226, 207, 188)][CENTER]Закрыто.[/CENTER][/COLOR][/FONT]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
        {
title: 'Багоюз аним',
      content:
        '[CENTER][B][COLOR=rgb(226, 207, 188)][FONT=georgia][SIZE=3]Доброго времени суток, уважаемый(ая) {{ user.mention }}.[/SIZE][/COLOR]<br><br>' +
        "Нарушитель буден наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I]<br><br>" +
        "[FONT=book antiqua][COLOR=rgb(255, 0, 0)]2.55. [/COLOR]Запрещается багоюз связанный с анимацией в любых проявлениях. [/COLOR][COLOR=rgb(255, 0, 0)] | Jail 60 / 120 минут[/COLOR][/FONT][/SIZE]<br><br>" +
        '[LIST]<br><br>' +
        "[*][FONT=book antiqua][COLOR=rgb(255, 0, 0)]Пример: [/COLOR]если игрок, используя баг, убирает ограничение на использование оружия в зеленой зоне, сбивает темп стрельбы, либо быстро перемещается во время войны за бизнес или во время перестрелки на мероприятии с семейными контейнерами, последует наказание в виде Jail на 120 минут. Данное наказание используется в случаях, когда, используя ошибку, было получено преимущество перед другими игроками.[/COLOR][/FONT][/SIZE]<br><br>" +
        "[*][FONT=book antiqua][COLOR=rgb(255, 0, 0)]Пример: [/COLOR]если игрок использует баги, связанные с анимацией, и при этом не влияет на игровой процесс других игроков, а также не получает преимущество перед другими игроками, последует наказание в виде Jail на 60 минут.[/COLOR][/FONT][/SIZE]<br><br>" +
        "[/LIST]<br><br>" +

        '[COLOR=rgb(0, 255, 255)] [Color=#00FF00]Одобрено, закрыто[/SIZE][/COLOR][/CENTER]',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: 'Политика',
      content:
		'[CENTER][B][COLOR=rgb(226, 207, 188)][FONT=georgia][SIZE=3]Доброго времени суток, уважаемый(ая) {{ user.mention }}.[/SIZE][/COLOR]<br><br>' +
        "[CENTER]Ваша жалоба [COLOR=rgb(0, 255, 0)]одобрена[/COLOR]. Игрок будет[COLOR=#ff0000] наказан [/COLOR]по данному пункту правил:<br> [COLOR=#ff0000] 3.18 [/COLOR]. Запрещено политическое и религиозное пропагандирование, а также провокация игроков к конфликтам, коллективному флуду или беспорядкам в любом из чатов [Color=#ff0000] | Mute 120 минут / Ban 10 дней[/COLOR][/CENTER]<br>" +

        '[COLOR=rgb(226, 207, 188)][CENTER]Закрыто.[/CENTER][/COLOR][/FONT]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
     {
	  title: '______________________________________________ღ Госс организации ღ______________________________________________ ',
     },
        {
 title: 'Работа в форме/казино',
      content:
       '[CENTER][B][COLOR=rgb(226, 207, 188)][FONT=georgia][SIZE=3]Доброго времени суток, уважаемый(ая) {{ user.mention }}.[/SIZE][/COLOR]<br><br>' +
        "Нарушитель буден наказан по следующему пункту правил государственных структур:[/SIZE][/FONT][/COLOR][/I]<br><br>" +
        "[COLOR=rgb(255, 0, 0)][FONT=book antiqua]1.13.[/FONT][/SIZE][/COLOR][FONT=book antiqua] Запрещено находиться в форме внутри казино, а также устраиваться на сторонние работы в форме фракции[/FONT][/SIZE][/COLOR][COLOR=rgb(255, 0, 0)][FONT=book antiqua] | Jail 30 минут[/FONT][/SIZE][/COLOR]<br><br>" +

        '[COLOR=rgb(255, 255, 0)][COLOR=#00FF00]Одобрено, закрыто[/SIZE][/FONT][/COLOR][/I][/CENTER]' ,
      prefix: ACCEPT_PREFIX,
      status: false,
    },
        {
        title: 'ИСП фрак т/с в ЛЦ',
     content:
       '[CENTER][B][COLOR=rgb(226, 207, 188)][FONT=georgia][SIZE=3]Доброго времени суток, уважаемый(ая) {{ user.mention }}.[/SIZE][/COLOR]<br><br>' +
        "[CENTER]Ваша жалоба [COLOR=rgb(0, 255, 0)]одобрена[/COLOR]. Игрок будет[COLOR=#ff0000] наказан [/COLOR]по данному пункту правил:<br> [COLOR=#ff0000] 1.08 [/COLOR]. Запрещено использование фракционного транспорта в личных целях [COLOR=#FF0000] | Jail 30 минут[/COLOR].[/CENTER]<br>" +

        '[COLOR=rgb(226, 207, 188)][CENTER]Закрыто.[/CENTER][/COLOR][/FONT]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
            {
        title: 'Задержание участников на БВ',
     content:
       '[CENTER][B][COLOR=rgb(226, 207, 188)][FONT=georgia][SIZE=3]Доброго времени суток, уважаемый(ая) {{ user.mention }}.[/SIZE][/COLOR]<br><br>' +
        "[CENTER]Ваша жалоба [COLOR=rgb(0, 255, 0)]одобрена[/COLOR]. Игрок будет[COLOR=#ff0000] наказан [/COLOR]по данному пункту правил:<br> [COLOR=#ff0000] 1.14 [/COLOR]. Сотрудникам правоохранительных органов запрещается задерживать состав участников войны за бизнес за [COLOR=#FF0000]10 минут[/COLOR] непосредственно до начала самого бизвара [COLOR=#FF0000] | Jail 30 минут[/COLOR].[/CENTER]<br>" +

        '[COLOR=rgb(226, 207, 188)][CENTER]Закрыто.[/CENTER][/COLOR][/FONT]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
	  title: '______________________________________________ღ Армия ღ______________________________________________ ',
     },
    {
     title: 'Нанесение урона на ТТ МО',
        content:
        '[CENTER][B][COLOR=rgb(226, 207, 188)][FONT=georgia][SIZE=3]Доброго времени суток, уважаемый(ая) {{ user.mention }}.[/SIZE][/COLOR]<br><br>' +
        "[CENTER]Ваша жалоба [COLOR=rgb(0, 255, 0)]одобрена[/COLOR]. Игрок будет[COLOR=#ff0000] наказан [/COLOR]по данному пункту правил:<br> [COLOR=#ff0000] 2.02 [/COLOR]. Наносить урон игрокам, которые находятся вне территории воинской части, запрещено [Color=#ff0000] | DM / Jail 60 минут / Warn.[/COLOR][/CENTER]<br>" +

        '[COLOR=rgb(226, 207, 188)][CENTER]Закрыто.[/CENTER][/COLOR][/FONT]',
              prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
	  title: '______________________________________________ღ СМИ ღ______________________________________________ ',
     },
        {
      title: 'Редакт не по ПРО',
      content:
		'[CENTER][B][COLOR=rgb(226, 207, 188)][FONT=georgia][SIZE=3]Доброго времени суток, уважаемый(ая) {{ user.mention }}.[/SIZE][/COLOR]<br><br>' +
        "[CENTER]Ваша жалоба [COLOR=rgb(0, 255, 0)]одобрена[/COLOR]. Игрок будет[COLOR=#ff0000] наказан [/COLOR]по данному пункту правил:<br> [COLOR=#ff0000] 4.01 [/COLOR]. Запрещено редактирование объявлений, не соответствующих ПРО [COLOR=#FF0000] | Mute 30 минут[/COLOR].[/CENTER]<br>" +
        "[CENTER][COLOR=#FF0000]Пример:[/COLOR]игрок отправил одно слово, а редактор вставил полноценное объявление.[/CENTER]<br>" +

        '[COLOR=rgb(226, 207, 188)][CENTER]Закрыто.[/CENTER][/COLOR][/FONT]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
     title: 'Проведение эфира не по RP',
     content:
     	'[CENTER][B][COLOR=rgb(226, 207, 188)][FONT=georgia][SIZE=3]Доброго времени суток, уважаемый(ая) {{ user.mention }}.[/SIZE][/COLOR]<br><br>' +
        "[CENTER]Ваша жалоба [COLOR=rgb(0, 255, 0)]одобрена[/COLOR]. Игрок будет[COLOR=#ff0000] наказан [/COLOR]по данному пункту правил:<br> [COLOR=#ff0000] 4.02 [/COLOR]. Запрещено проведение эфиров, не соответствующих Role Play правилам и логике [COLOR=#FF0000] | Mute 30 минут[/COLOR].[/CENTER]<br>" +

        '[COLOR=rgb(226, 207, 188)][CENTER]Закрыто.[/CENTER][/COLOR][/FONT]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
	  title: '______________________________________________ღ УМВД ღ______________________________________________ ',
     },
    {
     title: 'Нанесение урона на ТТ УМВД',
        content:
        '[CENTER][B][COLOR=rgb(226, 207, 188)][FONT=georgia][SIZE=3]Доброго времени суток, уважаемый(ая) {{ user.mention }}.[/SIZE][/COLOR]<br><br>' +
        "[CENTER]Ваша жалоба [COLOR=rgb(0, 255, 0)]одобрена[/COLOR]. Игрок будет[COLOR=#ff0000] наказан [/COLOR]по данному пункту правил:<br> [COLOR=#ff0000] 6.01 [/COLOR]. Запрещено наносить урон игрокам без Role Play причины на территории УМВД [Color=#ff0000] | DM / Jail 60 минут / Warn.[/COLOR][/CENTER]<br>" +

        '[COLOR=rgb(226, 207, 188)][CENTER]Закрыто.[/CENTER][/COLOR][/FONT]',
              prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Розыск без причины',
      content:
		'[CENTER][B][COLOR=rgb(226, 207, 188)][FONT=georgia][SIZE=3]Доброго времени суток, уважаемый(ая) {{ user.mention }}.[/SIZE][/COLOR]<br><br>' +
        "[CENTER]Ваша жалоба [COLOR=rgb(0, 255, 0)]одобрена[/COLOR]. Игрок будет[COLOR=#ff0000] наказан [/COLOR]по данному пункту правил:<br> [COLOR=#ff0000] 6.02 [/COLOR]. Запрещено выдавать розыск без Role Play причины. [Color=#ff0000] | Warn.[/COLOR][/CENTER]<br>" +

        '[COLOR=rgb(226, 207, 188)][CENTER]Закрыто.[/CENTER][/COLOR][/FONT]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
         {
      title: 'NonRP Поведение у полиции',
      content:
		'[CENTER][B][COLOR=rgb(226, 207, 188)][FONT=georgia][SIZE=3]Доброго времени суток, уважаемый(ая) {{ user.mention }}.[/SIZE][/COLOR]<br><br>' +
        "[CENTER]Ваша жалоба [COLOR=rgb(0, 255, 0)]одобрена[/COLOR]. Игрок будет[COLOR=#ff0000] наказан [/COLOR]по данному пункту правил:<br> [COLOR=#ff0000] 6.03 [/COLOR]. Запрещено nRP поведение [Color=#ff0000] | Warn[/COLOR].[/CENTER]<br>" +
"[CENTER][COLOR=#FF0000]Примечание:[/COLOR] поведение, не соответствующее сотруднику УМВД. [/CENTER]<br>" +
"[CENTER]Пример: [/CENTER]<br>" +
"[CENTER]- открытие огня по игрокам без причины, [/CENTER]<br>" +
"[CENTER]- расстрел машин без причины, [/CENTER]<br>" +
"[CENTER]- нарушение ПДД без причины, [/CENTER]<br>" +
"[CENTER]- сотрудник на служебном транспорте кричит о наборе в свою семью на спавне. [/CENTER]<br>" +

		'[COLOR=rgb(226, 207, 188)][CENTER]Закрыто.[/CENTER][/COLOR][/FONT]',
      prefix: ACCEPT_PREFIX,
	  status: false,
         },
    {
	  title: '______________________________________________ღ ГИБДД ღ______________________________________________ ',
     },
               {
     title: 'Нанесение урона на ТТ ГИБДД',
        content:
        '[CENTER][B][COLOR=rgb(226, 207, 188)][FONT=georgia][SIZE=3]Доброго времени суток, уважаемый(ая) {{ user.mention }}.[/SIZE][/COLOR]<br><br>' +
        "[CENTER]Ваша жалоба [COLOR=rgb(0, 255, 0)]одобрена[/COLOR]. Игрок будет[COLOR=#ff0000] наказан [/COLOR]по данному пункту правил:<br> [COLOR=#ff0000] 7.01 [/COLOR]. Запрещено наносить урон игрокам без Role Play причины на территории ГИБДД [Color=#ff0000] | DM / Jail 60 минут / Warn.[/COLOR][/CENTER]<br>" +

        '[COLOR=rgb(226, 207, 188)][CENTER]Закрыто.[/CENTER][/COLOR][/FONT]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
       {
     title: 'Розыск/Штраф без причины',
            content:
        '[CENTER][B][COLOR=rgb(226, 207, 188)][FONT=georgia][SIZE=3]Доброго времени суток, уважаемый(ая) {{ user.mention }}.[/SIZE][/COLOR]<br><br>' +
        "[CENTER]Ваша жалоба [COLOR=rgb(0, 255, 0)]одобрена[/COLOR]. Игрок будет[COLOR=#ff0000] наказан [/COLOR]по данному пункту правил:<br> [COLOR=#ff0000] 7.02 [/COLOR]. Запрещено выдавать розыск, штраф без Role Play причины [Color=#ff0000] | Warn.[/COLOR][/CENTER]<br>" +
        "[CENTER][COLOR=#FF0000]Примечание:[/COLOR] запрещено несоответствующее поведение по аналогии с пунктом 6.03. [/CENTER]<br>" +

        '[COLOR=rgb(226, 207, 188)][CENTER]Закрыто.[/CENTER][/COLOR][/FONT]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
       {
     title: 'Отбор прав при погоне',
            content:
        '[CENTER][B][COLOR=rgb(226, 207, 188)][FONT=georgia][SIZE=3]Доброго времени суток, уважаемый(ая) {{ user.mention }}.[/SIZE][/COLOR]<br><br>' +
        "[CENTER]Ваша жалоба [COLOR=rgb(0, 255, 0)]одобрена[/COLOR]. Игрок будет[COLOR=#ff0000] наказан [/COLOR]по данному пункту правил:<br> [COLOR=#ff0000] 7.04 [/COLOR]. Запрещено отбирать водительские права во время погони за нарушителем [Color=#ff0000] | Warn.[/COLOR][/CENTER]<br>" +

        '[COLOR=rgb(226, 207, 188)][CENTER]Закрыто.[/CENTER][/COLOR][/FONT]',
                 prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
	  title: '______________________________________________ღ ФСБ ღ______________________________________________ ',
     },
    {
    title: 'Нанесение урона на ТТ ФСБ',
        content:
        '[CENTER][B][COLOR=rgb(226, 207, 188)][FONT=georgia][SIZE=3]Доброго времени суток, уважаемый(ая) {{ user.mention }}.[/SIZE][/COLOR]<br><br>' +
        "[CENTER]Ваша жалоба [COLOR=rgb(0, 255, 0)]одобрена[/COLOR]. Игрок будет[COLOR=#ff0000] наказан [/COLOR]по данному пункту правил:<br> [COLOR=#ff0000] 8.01 [/COLOR]. Запрещено наносить урон игрокам без Role Play причины на территории ФСБ [Color=#ff0000] | DM / Jail 60 минут / Warn.[/COLOR][/CENTER]<br>" +

        '[COLOR=rgb(226, 207, 188)][CENTER]Закрыто.[/CENTER][/COLOR][/FONT]',
              prefix: ACCEPT_PREFIX,
	  status: false,
    },
        {
      title: 'Розыск без причины',
      content:
		'[CENTER][B][COLOR=rgb(226, 207, 188)][FONT=georgia][SIZE=3]Доброго времени суток, уважаемый(ая) {{ user.mention }}.[/SIZE][/COLOR]<br><br>' +
        "[CENTER]Ваша жалоба [COLOR=rgb(0, 255, 0)]одобрена[/COLOR]. Игрок будет[COLOR=#ff0000] наказан [/COLOR]по данному пункту правил:<br> [COLOR=#ff0000] 8.02 [/COLOR]. Запрещено выдавать розыск без Role Play причины. [Color=#ff0000] | Warn.[/COLOR][/CENTER]<br>" +

        '[COLOR=rgb(226, 207, 188)][CENTER]Закрыто.[/CENTER][/COLOR][/FONT]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
	  title: '______________________________________________ღ ФСИН ღ______________________________________________ ',
    },
        {
        title: 'Нанесение урона на ТТ ФСИН',
        content:
        '[CENTER][B][COLOR=rgb(226, 207, 188)][FONT=georgia][SIZE=3]Доброго времени суток, уважаемый(ая) {{ user.mention }}.[/SIZE][/COLOR]<br><br>' +
        "[CENTER]Ваша жалоба [COLOR=rgb(0, 255, 0)]одобрена[/COLOR]. Игрок будет[COLOR=#ff0000] наказан [/COLOR]по данному пункту правил:<br> [COLOR=#ff0000] 9.01 [/COLOR]. Запрещено наносить урон игрокам без Role Play причины на территории ФСИН [Color=#ff0000] | DM / Jail 60 минут / Warn.[/COLOR][/CENTER]<br>" +

        '[COLOR=rgb(226, 207, 188)][CENTER]Закрыто.[/CENTER][/COLOR][/FONT]',
                  prefix: ACCEPT_PREFIX,
	  status: false,
    },
         {
	  title: '______________________________________________ღ На рассмотрение ღ______________________________________________ ',
     },
     {
      title: 'Главной Администрации',
      content:
		'[CENTER][B][COLOR=rgb(226, 207, 188)][FONT=georgia][SIZE=3]Доброго времени суток, уважаемый(ая) {{ user.mention }}.[/SIZE][/COLOR]<br><br>' +
        "[CENTER]Ваша жалоба была передана [Color=#ff0000]Главной Администрации[/COLOR].<br>Просьба ожидать ответа и не создавать дубликаты данной темы.[/CENTER]<br>" +
		'[COLOR=rgb(226, 207, 188)][CENTER]Ожидайте ответа.[/CENTER][/COLOR][/FONT]',
      prefix: GA_PREFIX,
	  status: true,
    },
    {
      title: 'Тех.спецу',
      content:
		'[CENTER][B][COLOR=rgb(226, 207, 188)][FONT=georgia][SIZE=3]Доброго времени суток, уважаемый(ая) {{ user.mention }}.[/SIZE][/COLOR]<br><br>' +
        "[CENTER]Ваша жалоба была передана на рассмотрение [COLOR=#00BFFF] Техническому Специалисту.[/color][/CENTER]<br>" +
				'[COLOR=rgb(226, 207, 188)][CENTER]Ожидайте ответа.[/CENTER][/COLOR][/FONT]',
      prefix: TEX_PREFIX,
	  status: true,
    },

    {
      title: 'Жалоба на рассмотрении',
      content:
		'[CENTER][B][COLOR=rgb(226, 207, 188)][FONT=georgia][SIZE=3]Доброго времени суток, уважаемый(ая) {{ user.mention }}.[/SIZE][/COLOR]<br><br>' +
        "[CENTER]Ваша жалоба взята [COLOR=#FF0000]мной[/COLOR] на [COLOR=#ff4500]рассмотрение[/COLOR].<br>Просьба ожидать ответа и не создавать дубликаты данной темы.[/CENTER]<br>" +
				'[COLOR=rgb(226, 207, 188)][CENTER]Ожидайте ответа.[/CENTER][/COLOR][/FONT]',
      prefix: PIN_PREFIX,
	  status: true,
    },
    {
	  title: '__________________________________________________ღ Для отказа ღ__________________________________________________ ',
	},
    {
	  title: 'Нарушений не найдено',
	  content:
		'[CENTER][B][COLOR=rgb(226, 207, 188)][FONT=georgia][SIZE=3]Доброго времени суток, уважаемый(ая) {{ user.mention }}.[/SIZE][/COLOR]<br><br>' +
		"[CENTER]Нарушений со стороны данного игрока не было найдено.[/CENTER]<br>" +
		 '[COLOR=rgb(226, 207, 188)][CENTER]Закрыто.[/CENTER][/COLOR][/FONT]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
	},
    {
      title: 'Недостаточно доказательств',
      content:
		'[CENTER][B][COLOR=rgb(226, 207, 188)][FONT=georgia][SIZE=3]Доброго времени суток, уважаемый(ая) {{ user.mention }}.[/SIZE][/COLOR]<br><br>' +
        "[CENTER]Недостаточно доказательств на нарушение от данного игрока.<br>Доказательства должны быть предоставлены в хорошем качестве и с полным процессом сделки или нарушения от какого-либо игрока.[/CENTER]<br>" +
		 '[COLOR=rgb(226, 207, 188)][CENTER]Закрыто.[/CENTER][/COLOR][/FONT]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Доказательства не работают',
      content:
		'[CENTER][B][COLOR=rgb(226, 207, 188)][FONT=georgia][SIZE=3]Доброго времени суток, уважаемый(ая) {{ user.mention }}.[/SIZE][/COLOR]<br><br>' +
        "[CENTER]Ваши доказательства не работают.<br>Загрузите доказательства в другой портал ([COLOR=#FF0000]YouTube[/COLOR],[COLOR=#00FF00] ImGur[/COLOR]).[/CENTER]<br>" +
		 '[COLOR=rgb(226, 207, 188)][CENTER]Закрыто.[/CENTER][/COLOR][/FONT]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
title: 'Док-ва в соц. сетях',
      content:
        '[CENTER][B][COLOR=rgb(226, 207, 188)][FONT=georgia][SIZE=3]Доброго времени суток, уважаемый(ая) {{ user.mention }}.[/SIZE][/COLOR]<br><br>' +
        "Доказательства в социальных сетях и т.д. не принимаются. Загрузите доказательства на фото-видео хостинги YouTube,Imgur, Yapx и так далее.<br><br>" +
        "Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.<br><br>" +

 '[COLOR=rgb(226, 207, 188)][CENTER]Закрыто.[/CENTER][/COLOR][/FONT]',
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
title: 'Док-ва отредактированы',
      content:
		'[CENTER][B][COLOR=rgb(226, 207, 188)][FONT=georgia][SIZE=3]Доброго времени суток, уважаемый(ая) {{ user.mention }}.[/SIZE][/COLOR]<br><br>' +
        "[CENTER][B][FONT=georgia]Ваши докозательства отредактированы. Создайте жалобу с первоначальными доказательствами.[/CENTER]" +
		 '[COLOR=rgb(226, 207, 188)][CENTER]Закрыто.[/CENTER][/COLOR][/FONT]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
{
title: 'Нету условий сделки',
      content:
		'[CENTER][B][COLOR=rgb(226, 207, 188)][FONT=georgia][SIZE=3]Доброго времени суток, уважаемый(ая) {{ user.mention }}.[/SIZE][/COLOR]<br><br>' +
        "[CENTER][B][FONT=georgia]В данных доказательствах отсутствуют условия сделки[/CENTER]" +
		 '[COLOR=rgb(226, 207, 188)][CENTER]Закрыто.[/CENTER][/COLOR][/FONT]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
title: 'Укажите таймкоды',
	  content:
		'[CENTER][B][COLOR=rgb(226, 207, 188)][FONT=georgia][SIZE=3]Доброго времени суток, уважаемый(ая) {{ user.mention }}.[/SIZE][/COLOR]<br><br>' +
        "[CENTER]Ваше видео более 3х минут. [/CENTER]<br>" +
        "[CENTER]3.7 Если видеодоказательство длится более 3 минут, Вы должны указать тайм-коды нарушений.[/CENTER]<br>" +
		"[CENTER]Укажите тайм коды нарушений игрока и создайте новую жалобу. [/CENTER]<br>" +
		 '[COLOR=rgb(226, 207, 188)][CENTER]Закрыто.[/CENTER][/COLOR][/FONT]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
title: 'Нужна видеофиксация',
      content:
		'[CENTER][B][COLOR=rgb(226, 207, 188)][FONT=georgia][SIZE=3]Доброго времени суток, уважаемый(ая) {{ user.mention }}.[/SIZE][/COLOR]<br><br>' +
        "[CENTER][B][FONT=georgia]На данное нарушение требуется видеофиксация [/CENTER]" +
		 '[COLOR=rgb(226, 207, 188)][CENTER]Закрыто.[/CENTER][/COLOR][/FONT]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Дублирование',
      content:
        '[CENTER][B][COLOR=rgb(226, 207, 188)][FONT=georgia][SIZE=3]Доброго времени суток, уважаемый(ая) {{ user.mention }}.[/SIZE][/COLOR]<br><br>' +
        "Ранее вам уже был дан корректный ответ на подобную жалобу, просьба не создавать дубликаты этой темы, иначе ваш форумный аккаунт может быть [COLOR=#FF0000]заблокирован[/COLOR].<br>" +

      '[COLOR=rgb(226, 207, 188)][CENTER]Закрыто.[/CENTER][/COLOR][/FONT]',
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
      title: 'В жалобы на адм',
      content:
		'[CENTER][B][COLOR=rgb(226, 207, 188)][FONT=georgia][SIZE=3]Доброго времени суток, уважаемый(ая) {{ user.mention }}.[/SIZE][/COLOR]<br><br>' +
        "[CENTER]Вы ошиблись разделом.<br>Обратитесь в раздел «[COLOR=rgb(226, 207, 188)]Жалобы на администрацию[/COLOR]».[/CENTER]<br>" +
		 '[COLOR=rgb(226, 207, 188)][CENTER]Закрыто.[/CENTER][/COLOR][/FONT]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'В Обжалование наказаний',
      content:
		'[CENTER][B][COLOR=rgb(226, 207, 188)][FONT=georgia][SIZE=3]Доброго времени суток, уважаемый(ая) {{ user.mention }}.[/SIZE][/COLOR]<br><br>' +
        "[CENTER]Вы ошиблись разделом.<br>Обратитесь в раздел «[COLOR=rgb(226, 207, 188)]Обжалование наказаний[/COLOR]».[/CENTER]<br>" +
		 '[COLOR=rgb(226, 207, 188)][CENTER]Закрыто.[/CENTER][/COLOR][/FONT]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Не по форме',
      content:
		'[CENTER][B][COLOR=rgb(226, 207, 188)][FONT=georgia][SIZE=3]Доброго времени суток, уважаемый(ая) {{ user.mention }}.[/SIZE][/COLOR]<br><br>' +
        "[CENTER]Ваша жалоба составлена не по форме.<br>Убедительная просьба ознакомиться с правилами подачи жалоб:[/CENTER]<br>" +
"[CENTER]1. Ваш Nick_Name: [/CENTER]<br>" +
"[CENTER]2. Nick_Name игрока: [/CENTER]<br>" +
"[CENTER]3. Суть жалобы: [/CENTER]<br>" +
"[CENTER]4. Доказательство:[/CENTER]<br>" +
		 '[COLOR=rgb(226, 207, 188)][CENTER]Закрыто.[/CENTER][/COLOR][/FONT]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
	{
	  title: 'Нету /time',
	  content:
        '[CENTER][B][COLOR=rgb(226, 207, 188)][FONT=georgia][SIZE=3]Доброго времени суток, уважаемый(ая) {{ user.mention }}.[/SIZE][/COLOR]<br><br>' +
		"[CENTER]На ваших доказательствах отсутствует [COLOR=rgb(0, 255, 0)]/time[/COLOR].[/CENTER]<br>" +
		 '[COLOR=rgb(226, 207, 188)][CENTER]Закрыто.[/CENTER][/COLOR][/FONT]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
	},
    {
      title: 'Долг',
      content:
        '[CENTER][B][COLOR=rgb(226, 207, 188)][FONT=georgia][SIZE=3]Доброго времени суток, уважаемый(ая) {{ user.mention }}.[/SIZE][/COLOR]<br><br>' +
        "Долг дается на ваш страх и риск. Невозврат долга не наказуем  <br>" +
         '[COLOR=rgb(226, 207, 188)][CENTER]Закрыто.[/CENTER][/COLOR][/FONT]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    	{
	  title: 'Время ЖБ истекло',
	  content:
        '[CENTER][B][COLOR=rgb(226, 207, 188)][FONT=georgia][SIZE=3]Доброго времени суток, уважаемый(ая) {{ user.mention }}.[/SIZE][/COLOR]<br><br>' +
		"[CENTER]Срок написания жалобы составляет [COLOR=#FF0000] три дня [/COLOR] (72 часа) с момента совершенного нарушения со стороны игрока сервера.[/CENTER]<br>" +
		 '[COLOR=rgb(226, 207, 188)][CENTER]Закрыто.[/CENTER][/COLOR][/FONT]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
	},
    {
        title: 'В жалобы на техов',
	  content:

		'[CENTER][B][COLOR=rgb(226, 207, 188)][FONT=georgia][SIZE=3]Доброго времени суток, уважаемый(ая) {{ user.mention }}.[/SIZE][/COLOR]<br><br>' +
    "[CENTER]Вы ошиблись сервером.Обратитесь в раздел «[COLOR=#FF0000]Жалобы на Технических Специалистов[/COLOR]» Вашего игрового сервера:<br><br> [/CENTER]"+
 '[COLOR=rgb(226, 207, 188)][CENTER]Закрыто.[/CENTER][/COLOR][/FONT]',
        prefix: UNACCEPT_PREFIX,
        status: true,
	},
    {
       title: 'Ошибка сервером',
         content:

		'[CENTER][B][COLOR=rgb(226, 207, 188)][FONT=georgia][SIZE=3]Доброго времени суток, уважаемый(ая) {{ user.mention }}.[/SIZE][/COLOR]<br><br>' +
    "[CENTER]Вы ошиблись сервером.Обратитесь в раздел «[COLOR=#FF0000]Жалобы[/COLOR]» Вашего игрового сервера:<br><br> [/CENTER]" +
 '[COLOR=rgb(226, 207, 188)][CENTER]Закрыто.[/CENTER][/COLOR][/FONT]',
        prefix: UNACCEPT_PREFIX,
        status: true,
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
    $('button#unaccept').click(() => editThreadData(UNACCEPT_PREFIX, false));
    $('button#close').click(() => editThreadData(CLOSE_PREFIX, false));


    $(`button#selectAnswer`).click(() => {
        XF.alert(buttonsMarkup(buttons), null, 'Выберите ответ:');
        buttons.forEach((btn, id) => {
            if(id > 0) {
                $(`button#answers-${id}`).click(() => pasteContent(id, threadData, true));
            } else {
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
    6 < hours && hours <= 12
      ? 'Доброе утро'
      : 12 < hours && hours <= 18
      ? 'Добрый день'
      : 18 < hours && hours <= 24
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
// ==UserScript==
// @name         New Userscript
// @namespace    http://tampermonkey.net/
// @version      2024-06-04
// @description  try to take over the world!
// @author       You
// @match        http://*/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
})();