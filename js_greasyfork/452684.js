// ==UserScript==
// @name         BLACK RUSSIA | YELLOW
// @namespace    https://forum.blackrussia.online
// @version      1.13
// @description  Always remember who you are!
// @author       Aegis Pon da?
// @match        https://forum.blackrussia.online/index.php?threads/*
// @include      https://forum.blackrussia.online/index.php?threads/
// @grant        none
// @license    MIT
// @collaborator Aegis Pon da?
// @icon https://icons.iconarchive.com/icons/papirus-team/papirus-apps/48/emerald-theme-manager-icon-icon.png
// @downloadURL https://update.greasyfork.org/scripts/452684/BLACK%20RUSSIA%20%7C%20YELLOW.user.js
// @updateURL https://update.greasyfork.org/scripts/452684/BLACK%20RUSSIA%20%7C%20YELLOW.meta.js
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
	  title: '_______________________________________ Для жалоб на игроков____________________________________ ',
	},
     {
      title: 'Приветствие',
     content:
        '[SIZE=4][COLOR=rgb(0, 255, 255)][I][FONT=times new roman]{{ greeting }}, уважаемый {{ user.mention }}.[/FONT][/I][/COLOR][/SIZE]',
    },
    {
      title: 'СК',
      content:
		'[CENTER][B][COLOR=rgb(255, 255, 0)][SIZE=3]Доброго времени суток, уважаемый(ая) {{ user.mention }}.[/SIZE][/COLOR]<br><br>' +
        "[CENTER]Игрок будет [COLOR=#ff0000]наказан[/COLOR] по данному пункту правил:<br>2.16. Запрещен SK (Spawn Kill) — убийство или нанесение урона на титульной территории любой фракции / организации, на месте появления игрока, а также на выходе из закрытых интерьеров и около них [Color=#ff0000]| Jail 60 минут / Warn (за два и более убийства)[/COLOR].[/CENTER]<br>" +
		'[Color=#00FF00][CENTER]Одобрено, закрыто.[/CENTER][/color]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'ДМ',
      content:
		'[CENTER][B][COLOR=rgb(255, 255, 0)][SIZE=3]Доброго времени суток, уважаемый(ая) {{ user.mention }}.[/SIZE][/COLOR]<br><br>' +
        "[CENTER]Игрок будет[COLOR=#ff0000] наказан [/COLOR]по данному пункту правил:<br>2.19. Запрещен DM (DeathMatch) — убийство или нанесение урона без веской IC причины [Color=#ff0000]| Jail 60 минут[/COLOR].[/CENTER]<br>" +
		'[Color=#00FF00][CENTER]Одобрено, закрыто.[/CENTER][/color]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'ТК',
      content:
		'[CENTER][B][COLOR=rgb(255, 255, 0)][SIZE=3]Доброго времени суток, уважаемый(ая) {{ user.mention }}.[/SIZE][/COLOR]<br><br>' +
        "[CENTER]Игрок будет[COLOR=#ff0000] наказан [/COLOR]по данному пункту правил:<br>2.15. Запрещен TK (Team Kill) — убийство члена своей или союзной фракции, организации без наличия какой-либо IC причины | Jail 60 минут / Warn (за два и более убийства)[/CENTER]<br>" +
		'[Color=#00FF00][CENTER]Одобрено, закрыто.[/CENTER][/color]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'ДБ',
      content:
		'[CENTER][B][COLOR=rgb(255, 255, 0)][SIZE=3]Доброго времени суток, уважаемый(ая) {{ user.mention }}.[/SIZE][/COLOR]<br><br>' +
        "[CENTER]Игрок будет[COLOR=#ff0000] наказан [/COLOR]по данному пункту правил:<br>2.13. Запрещен DB (DriveBy) — намеренное убийство / нанесение урона без веской IC причины на любом виде транспорта [Color=#ff0000]| Jail 60 минут[/COLOR].[/CENTER]<br>" +
		'[Color=#00FF00][CENTER]Одобрено, закрыто.[/CENTER][/color]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'MG',
      content:
		'[CENTER][B][COLOR=rgb(255, 255, 0)][SIZE=3]Доброго времени суток, уважаемый(ая) {{ user.mention }}.[/SIZE][/COLOR]<br><br>' +
        "[CENTER]Игрок будет[COLOR=#ff0000] наказан [/COLOR]по данному пункту правил:<br>2.18. Запрещен MG (MetaGaming) — использование ООС информации, которую Ваш персонаж никак не мог получить в IC процессе [Color=#ff0000]| Mute 30 минут[/COLOR].[/CENTER]<br>" +
		'[Color=#00FF00][CENTER]Одобрено, закрыто.[/CENTER][/color]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
	  title: 'Капс',
	  content:
		'[CENTER][B][COLOR=rgb(255, 255, 0)][SIZE=3]Доброго времени суток, уважаемый(ая) {{ user.mention }}.[/SIZE][/COLOR]<br><br>' +
		"[CENTER]Игрок будет[COLOR=#ff0000] наказан [/COLOR]по данному пункту правил:<br>3.02. Запрещено использование верхнего регистра (CapsLock) при написании любого текста в любом чате [Color=#ff0000]| Mute 30 минут[/COLOR].[/CENTER]<br>" +
		'[Color=#00FF00][CENTER]Одобрено, закрыто.[/CENTER][/color]',
      prefix: ACCEPT_PREFIX,
	  status: false,
	},
    {
	  title: 'Флуд',
	  content:
		'[CENTER][B][COLOR=rgb(255, 255, 0)][SIZE=3]Доброго времени суток, уважаемый(ая) {{ user.mention }}.[/SIZE][/COLOR]<br><br>' +
		"[CENTER]Игрок будет[COLOR=#ff0000] наказан [/COLOR]по данному пункту правил:<br>3.05. Запрещен флуд — 3 и более повторяющихся сообщений от одного и того же игрока [Color=#ff0000]| Mute 30 минут[/COLOR].[/CENTER]<br>" +
		'[Color=#00FF00][CENTER]Одобрено, закрыто.[/CENTER][/color]',
      prefix: ACCEPT_PREFIX,
	  status: false,
	},
    {
      title: 'Оск',
      content:
		'[CENTER][B][COLOR=rgb(255, 255, 0)][SIZE=3]Доброго времени суток, уважаемый(ая) {{ user.mention }}.[/SIZE][/COLOR]<br><br>' +
        "[CENTER]Игрок будет[COLOR=#ff0000] наказан [/COLOR]по данному пункту правил:<br>3.03. Любые формы оскорблений, издевательств, расизма, дискриминации, религиозной враждебности, сексизма в OOC чате запрещены [Color=#ff0000]| Mute 30 минут[/COLOR].[/CENTER]<br>" +
		'[Color=#00FF00][CENTER]Одобрено, закрыто.[/CENTER][/color]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Оск порчащие честь',
      content:
		'[CENTER][B][COLOR=rgb(255, 255, 0)][SIZE=3]Доброго времени суток, уважаемый(ая) {{ user.mention }}.[/SIZE][/COLOR]<br><br>' +
        "[CENTER]Игрок будет[COLOR=#ff0000] наказан [/COLOR]по данному пункту правил:<br>3.07. Запрещены совершенно любые оскорбления или действия, порочащие честь и достоинства, несущие в себе подтекст сексуального характера вне зависимости от чата [Color=#ff0000]| Mute 30 минут[/COLOR].[/CENTER]<br>" +
		'[Color=#00FF00][CENTER]Одобрено, закрыто.[/CENTER][/color]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Редакт не по ПРО',
      content:
		'[CENTER][B][COLOR=rgb(255, 255, 0)][SIZE=3]Доброго времени суток, уважаемый(ая) {{ user.mention }}.[/SIZE][/COLOR]<br><br>' +
        "[CENTER]Игрок будет[COLOR=#ff0000] наказан [/COLOR]по данному пункту правил:<br>4.01. Запрещено редактирование объявлений, не соответствующих ПРО | Mute 30 минут[/COLOR].[/CENTER]<br>" +
		'[Color=#00FF00][CENTER]Одобрено, закрыто.[/CENTER][/color]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Оск/Упом родни',
      content:
		'[CENTER][B][COLOR=rgb(255, 255, 0)][SIZE=3]Доброго времени суток, уважаемый(ая) {{ user.mention }}.[/SIZE][/COLOR]<br><br>' +
        "[CENTER]Игрок будет[COLOR=#ff0000] наказан [/COLOR]по данному пункту правил:<br>3.04. Запрещено оскорбление или косвенное упоминание родных вне зависимости от чата (IC или OOC) [Color=#ff0000]| Mute 120 минут / Ban 7 - 15 дней[/COLOR].[/CENTER]<br>" +
		'[Color=#00FF00][CENTER]Одобрено, закрыто.[/CENTER][/color]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
 title: 'NonRP поведение',
      content:
		'[CENTER][B][COLOR=rgb(255, 255, 0)][SIZE=3]Доброго времени суток, уважаемый(ая) {{ user.mention }}.[/SIZE][/COLOR]<br><br>' +
        "[CENTER]Игрок будет[COLOR=#ff0000] наказан [/COLOR]по данному пункту правил:<br>2.01 Запрещено поведение, нарушающее нормы процессов Role Play режима игры [Color=#ff0000]| Jail 30 минут[/COLOR].[/CENTER]<br>" +
		'[Color=#00FF00][CENTER]Одобрено, закрыто.[/CENTER][/color]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
 title: 'ЕПП',
      content:
		'[CENTER][B][COLOR=rgb(255, 255, 0)][SIZE=3]Доброго времени суток, уважаемый(ая) {{ user.mention }}.[/SIZE][/COLOR]<br><br>' +
        "[CENTER]Игрок будет[COLOR=#ff0000] наказан [/COLOR]по данному пункту правил:<br>2.03. Запрещен NonRP Drive — вождение любого транспортного средства в невозможных для него условиях, а также вождение в неправдоподобной манере [Color=#ff0000]| Jail 30 минут[/COLOR].[/CENTER]<br>" +
		'[Color=#00FF00][CENTER]Одобрено, закрыто.[/CENTER][/color]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
title: 'ЕПП фура/инко',
      content:
		'[CENTER][B][COLOR=rgb(255, 255, 0)][SIZE=3]Доброго времени суток, уважаемый(ая) {{ user.mention }}.[/SIZE][/COLOR]<br><br>' +
        "[CENTER]Игрок будет[COLOR=#ff0000] наказан [/COLOR]по данному пункту правил:<br>2.47. Запрещено ездить по полям на грузовом транспорте, инкассаторских машинах (работа дальнобойщика, инкассатора) [Color=#ff0000]| Jail 60 минут[/COLOR].[/CENTER]<br>" +
		'[Color=#00FF00][CENTER]Одобрено, закрыто.[/CENTER][/color]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
title: 'Постороннее ПО/Изм. Файлов игры',
      content:
		'[CENTER][B][COLOR=rgb(255, 255, 0)][SIZE=3]Доброго времени суток, уважаемый(ая) {{ user.mention }}.[/SIZE][/COLOR]<br><br>' +
        "[CENTER]Игрок будет[COLOR=#ff0000] наказан [/COLOR]по данному пункту правил:<br>2.22. Запрещено хранить / использовать / распространять стороннее программное обеспечение или любые другие средства, позволяющие получить преимущество над другими игроками [Color=#ff0000]|  Ban 15 - 30 дней / PermBan[/COLOR].[/CENTER]<br>" +
		'[Color=#00FF00][CENTER]Одобрено, закрыто.[/CENTER][/color]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
    title: 'NRP обман',
      content:
       '[CENTER][B][COLOR=rgb(255, 255, 0)][SIZE=3]Доброго времени суток, уважаемый(ая) {{ user.mention }}.[/SIZE][/COLOR]<br><br>' +
        "[CENTER][I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Нарушитель буден наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I]<br><br>" +
        "[CENTER][FONT=book antiqua][SIZE=4][COLOR=rgb(255, 0, 0)]2.05.[/COLOR][COLOR=rgb(209, 213, 216)] Запрещены любые OOC обманы и их попытки, а также любые IC обманы с нарушением Role Play правил и логики[/COLOR][COLOR=rgb(255, 0, 0)] | PermBan[/COLOR][/SIZE][/FONT]<br><br>" +
        '[LIST]<br><br>' +
        "[CENTER][FONT=book antiqua][SIZE=4][COLOR=rgb(255, 0, 0)]Примечание: [/COLOR][COLOR=rgb(209, 213, 216)]после IC договоренности получить денежные средства и сразу же выйти из игры с целью обмана игрока, или же, договорившись через OOC чат (/n), точно также получить денежные средства и сразу же выйти из игры и тому подобные ситуации.[/COLOR][/SIZE][/FONT]<br><br>" +
        "[CENTER][FONT=book antiqua][SIZE=4][COLOR=rgb(255, 0, 0)]Примечание: [/COLOR][COLOR=rgb(209, 213, 216)]разблокировка игрового аккаунта нарушителя будет возможна только в случае возврата полной суммы причиненного ущерба, либо непосредственно самого имущества, которое было украдено (по решению обманутой стороны).[/COLOR][/SIZE][/FONT]<br><br>" +
        "[CENTER][/LIST]<br><br>" +
        "[CENTER][I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA RolePlay.[/SIZE][/FONT][/COLOR]<br><br>" +
        '[Color=#00FF00][CENTER]Одобрено.[/COLOR]',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
title: 'Нету условий сделки',
      content:
		'[CENTER][B][COLOR=rgb(255, 255, 0)][SIZE=3]Доброго времени суток, уважаемый(ая) {{ user.mention }}.[/SIZE][/COLOR]<br><br>' +
        "[CENTER][B][I][FONT=georgia]В данных доказательствах отсутствуют условия сделки[/CENTER]" +
		'[Color=Red][CENTER]Отказано, закрыто.[/CENTER][/color]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
title: 'Укажите таймкоды',
	  content:
		'[CENTER][B][COLOR=rgb(255, 255, 0)][SIZE=3]Доброго времени суток, уважаемый(ая) {{ user.mention }}.[/SIZE][/COLOR]<br><br>' +
        "[CENTER]Ваше видео более 3х минут. [/CENTER]<br>" +
        "[CENTER]3.7 Если видеодоказательство длится более 3 минут, Вы должны указать тайм-коды нарушений.[/CENTER]<br>" +
		"[CENTER]Укажите тайм коды нарушений игрока и создайте новую жалобу. [/CENTER]<br>" +
		'[Color=Red][CENTER]Отказано, закрыто.[/CENTER][/color]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
title: 'Нужна видеофиксация',
      content:
		'[CENTER][B][COLOR=rgb(255, 255, 0)][SIZE=3]Доброго времени суток, уважаемый(ая) {{ user.mention }}.[/SIZE][/COLOR]<br><br>' +
        "[CENTER][B][I][FONT=georgia]В таких случаях нужна видеофиксация нарушения. [/CENTER]" +
		'[Color=Red][CENTER]Отказано, закрыто.[/CENTER][/color]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Масс ДМ',
      content:
		'[CENTER][B][COLOR=rgb(255, 255, 0)][SIZE=3]Доброго времени суток, уважаемый(ая) {{ user.mention }}.[/SIZE][/COLOR]<br><br>' +
        "[CENTER]Игрок будет[COLOR=#ff0000] наказан [/COLOR]по данному пункту правил:<br>2.20. Запрещен Mass DM (Mass DeathMatch) — убийство или нанесение урона без веской IC причины более трем игрокам [Color=#ff0000]| Warn / Ban 3 - 7 дней[/COLOR].[/CENTER]<br>" +
		'[Color=#00FF00][CENTER]Одобрено, закрыто.[/CENTER][/color]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Реклама промо',
      content:
		'[CENTER][B][COLOR=rgb(255, 255, 0)][SIZE=3]Доброго времени суток, уважаемый(ая) {{ user.mention }}.[/SIZE][/COLOR]<br><br>' +
        "[CENTER]Игрок будет[COLOR=#ff0000] наказан [/COLOR]по данному пункту правил:<br>3.21. Запрещается реклама промокодов в игре, а также их упоминание в любом виде во всех чатах. [Color=#ff0000]| Ban 30 дней[/Color].[/CENTER]<br>" +
		'[Color=#00FF00][CENTER]Одобрено, закрыто.[/CENTER][/color]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Продажа Промо',
      content:
		'[CENTER][B][COLOR=rgb(255, 255, 0)][SIZE=3]Доброго времени суток, уважаемый(ая) {{ user.mention }}.[/SIZE][/COLOR]<br><br>' +
        "[CENTER]Игрок будет[COLOR=#ff0000] наказан [/COLOR]по данному пункту правил:<br>2.43. Запрещена продажа / обмен / покупка поощрительной составляющей от лица проекта, будь то бонус-код, либо промокод, который выдается безвозмездно игрокам в целях промоакций [Color=#ff0000]| Mute 120 минут[/Color].[/CENTER]<br>" +
		'[Color=#00FF00][CENTER]Одобрено, закрыто.[/CENTER][/color]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Неув обр. к адм',
      content:
		'[CENTER][B][COLOR=rgb(255, 255, 0)][SIZE=3]Доброго времени суток, уважаемый(ая) {{ user.mention }}.[/SIZE][/COLOR]<br><br>' +
        "[CENTER]Игрок будет[COLOR=#ff0000] наказан [/COLOR]по данному пункту правил:<br>2.54. Запрещено неуважительное обращение, неадекватное поведение, угрозы в любом их проявлении по отношению к администрации [Color=#ff0000]| Mute 180 минут[/COLOR][/CENTER]<br>" +
		'[Color=#00FF00][CENTER]Одобрено, закрыто.[/CENTER][/color]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Оск. Администрации',
      content:
		'[CENTER][B][COLOR=rgb(255, 255, 0)][SIZE=3]Доброго времени суток, уважаемый(ая) {{ user.mention }}.[/SIZE][/COLOR]<br><br>' +
        "[CENTER]Игрок будет[COLOR=#ff0000] наказан [/COLOR]по данному пункту правил:<br>2.54. Запрещено неуважительное обращение, неадекватное поведение, угрозы в любом их проявлении по отношению к администрации [Color=#ff0000]| Mute 180 минут[/COLOR][/CENTER]<br>" +
		'[Color=#00FF00][CENTER]Одобрено, закрыто.[/CENTER][/color]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
title: 'Обман адм',
      content:
		'[CENTER][B][COLOR=rgb(255, 255, 0)][SIZE=3]Доброго времени суток, уважаемый(ая) {{ user.mention }}.[/SIZE][/COLOR]<br><br>' +
        "[CENTER]Игрок будет[COLOR=#ff0000] наказан [/COLOR]по данному пункту правил:<br>2.32. Запрещено введение в заблуждение, обман администрации на всех ресурсах проекта [Color=#ff0000]| Ban 7 - 15 дней / PermBan[/COLOR][/CENTER]<br>" +
		'[Color=#00FF00][CENTER]Одобрено, закрыто.[/CENTER][/color]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Выдача себя за адм',
      content:
		'[CENTER][B][COLOR=rgb(255, 255, 0)][SIZE=3]Доброго времени суток, уважаемый(ая) {{ user.mention }}.[/SIZE][/COLOR]<br><br>' +
        "[CENTER]Игрок будет[COLOR=#FF0000] наказан [/COLOR]по данному пункту правил:<br>3.10. Запрещена выдача себя за администратора, если таковым не являетесь [Color=#ff0000]| Ban 15 - 30 + ЧС администрации[/COLOR][/CENTER]<br>" +
		'[Color=#00FF00][CENTER]Одобрено, закрыто.[/CENTER][/color]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
 title: 'Оск. Проекта',
      content:
		'[CENTER][B][COLOR=rgb(255, 255, 0)][SIZE=3]Доброго времени суток, уважаемый(ая) {{ user.mention }}.[/SIZE][/COLOR]<br><br>' +
        "[CENTER]Игрок будет[COLOR=#FF0000] наказан [/COLOR]по данному пункту правил:<br>2.40.  Запрещены совершенно любые деструктивные действия по отношению к проекту: неконструктивная критика, призывы покинуть проект, попытки нарушить развитие проекта или любые другие действия, способные привести к помехам в игровом процессе [Color=#ff0000]|Mute 300 минут / Ban 30 дней (Ban выдается по согласованию с главным администратором)[/COLOR][/CENTER]<br>" +
		'[Color=#00FF00][CENTER]Одобрено, закрыто.[/CENTER][/color]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
title: 'Призыв покинуть проект',
      content:
		'[CENTER][B][COLOR=rgb(255, 255, 0)][SIZE=3]Доброго времени суток, уважаемый(ая) {{ user.mention }}.[/SIZE][/COLOR]<br><br>' +
        "[CENTER]Игрок будет[COLOR=#FF0000] наказан [/COLOR]по данному пункту правил:<br>2.40.  Запрещены совершенно любые деструктивные действия по отношению к проекту: неконструктивная критика, призывы покинуть проект, попытки нарушить развитие проекта или любые другие действия, способные привести к помехам в игровом процессе [Color=#ff0000]|Mute 300 минут / Ban 30 дней (Ban выдается по согласованию с главным администратором)[/COLOR][/CENTER]<br>" +
		'[Color=#00FF00][CENTER]Одобрено, закрыто.[/CENTER][/color]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
title: 'NonRP Врач',
      content:
        '[CENTER][B][COLOR=rgb(255, 255, 0)][SIZE=3]Доброго времени суток, уважаемый(ая) {{ user.mention }}.[/SIZE][/COLOR]<br><br>' +
        "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Нарушитель буден наказан по следующему пункту правил государственных структур:[/SIZE][/FONT][/COLOR][/I]<br><br>" +
        "[SIZE=4][FONT=book antiqua][COLOR=rgb(255, 0, 0)]5.01. [/COLOR][COLOR=rgb(209, 213, 216)]Запрещено оказание медицинской помощи без Role Play отыгровок;[/COLOR][/FONT][/SIZE]<br><br>" +
        "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA RolePlay.[/SIZE][/FONT][/COLOR]<br><br>" +
        '[COLOR=rgb(0, 255, 255)][FONT=times new roman][SIZE=4]Одобрено.[/SIZE][/COLOR][/CENTER]',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
 title: 'Работа в форме/казино',
      content:
       '[CENTER][B][COLOR=rgb(255, 255, 0)][SIZE=3]Доброго времени суток, уважаемый(ая) {{ user.mention }}.[/SIZE][/COLOR]<br><br>' +
        "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Нарушитель буден наказан по следующему пункту правил государственных структур:[/SIZE][/FONT][/COLOR][/I]<br><br>" +
        "[COLOR=rgb(255, 0, 0)][SIZE=4][FONT=book antiqua]1.13.[/FONT][/SIZE][/COLOR][COLOR=rgb(209, 213, 216)][SIZE=4][FONT=book antiqua] Запрещено находиться в форме внутри казино, а также устраиваться на сторонние работы в форме фракции[/FONT][/SIZE][/COLOR][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=book antiqua] | Jail 30 минут[/FONT][/SIZE][/COLOR]<br><br>" +
        "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA RolePlay.[/SIZE][/FONT][/COLOR]<br><br>" +
        '[COLOR=rgb(0, 255, 255)][FONT=times new roman][SIZE=4]Одобрено.[/SIZE][/FONT][/COLOR][/I][/CENTER]',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
	  title: 'Нарушений не найдено',
	  content:
		'[CENTER][B][COLOR=rgb(255, 255, 0)][SIZE=3]Доброго времени суток, уважаемый(ая) {{ user.mention }}.[/SIZE][/COLOR]<br><br>' +
		"[CENTER]Нарушений со стороны данного игрока не было найдено.[/CENTER]<br>" +
		'[Color=#FF0000][CENTER]Отказано, закрыто.[/CENTER][/color]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
	},
    {
      title: 'Недостаточно доказательств',
      content:
		'[CENTER][B][COLOR=rgb(255, 255, 0)][SIZE=3]Доброго времени суток, уважаемый(ая) {{ user.mention }}.[/SIZE][/COLOR]<br><br>' +
        "[CENTER]Недостаточно доказательств на нарушение от данного игрока.<br>Доказательства должны быть предоставлены в хорошем качестве и с полным процессом сделки или нарушения от какого-либо игрока.[/CENTER]<br>" +
		'[Color=#ff0000][CENTER]Отказано, закрыто.[/CENTER][/color]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Доказательства не работают',
      content:
		'[CENTER][B][COLOR=rgb(255, 255, 0)][SIZE=3]Доброго времени суток, уважаемый(ая) {{ user.mention }}.[/SIZE][/COLOR]<br><br>' +
        "[CENTER]Ваши доказательства не работают.<br>Загрузите доказательства в другой портал (YouTube, ImGur).[/CENTER]<br>" +
		'[Color=#ff0000][CENTER]Отказано, закрыто.[/CENTER][/color]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Дублирование',
      content:
        '[CENTER][B][COLOR=rgb(255, 255, 0)][SIZE=3]Доброго времени суток, уважаемый(ая) {{ user.mention }}.[/SIZE][/COLOR]<br><br>' +
        "[FONT=times new roman][COLOR=rgb(209, 213, 216)][I]Ранее вам уже был дан корректный ответ на подобную жалобу, просьба не создавать дубликаты этой темы, иначе ваш форумный аккаунт может быть заблокирован.<br>" +
        "Приятной игры на BLACK RUSSIA RolePlay.[/I][/COLOR][/FONT]<br>" +
        '[I][FONT=times new roman][COLOR=rgb(255, 0, 0)]Отказано.[/COLOR][/CENTER]',
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
        {
title: 'Bagouse Anim',
      content:
        '[CENTER][B][COLOR=rgb(255, 255, 0)][SIZE=3]Доброго времени суток, уважаемый(ая) {{ user.mention }}.[/SIZE][/COLOR]<br><br>' +
        "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Нарушитель буден наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I]<br><br>" +
        "[SIZE=4][FONT=book antiqua][COLOR=rgb(255, 0, 0)]2.55. [/COLOR][COLOR=rgb(209, 213, 216)]Запрещается багоюз связанный с анимацией в любых проявлениях. [/COLOR][COLOR=rgb(255, 0, 0)]| Jail 60 / 120 минут[/COLOR][/FONT][/SIZE]<br><br>" +
        '[LIST]<br><br>' +
        "[*][SIZE=4][FONT=book antiqua][COLOR=rgb(255, 0, 0)]Пример: [/COLOR][COLOR=rgb(209, 213, 216)]если игрок, используя баг, убирает ограничение на использование оружия в зеленой зоне, сбивает темп стрельбы, либо быстро перемещается во время войны за бизнес или во время перестрелки на мероприятии с семейными контейнерами, последует наказание в виде Jail на 120 минут. Данное наказание используется в случаях, когда, используя ошибку, было получено преимущество перед другими игроками.[/COLOR][/FONT][/SIZE]<br><br>" +
        "[*][SIZE=4][FONT=book antiqua][COLOR=rgb(255, 0, 0)]Пример: [/COLOR][COLOR=rgb(209, 213, 216)]если игрок использует баги, связанные с анимацией, и при этом не влияет на игровой процесс других игроков, а также не получает преимущество перед другими игроками, последует наказание в виде Jail на 60 минут.[/COLOR][/FONT][/SIZE]<br><br>" +
        "[/LIST]<br><br>" +
        "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA RolePlay.[/SIZE][/FONT][/COLOR]<br><br>" +
        '[COLOR=rgb(0, 255, 255)][FONT=times new roman][SIZE=4]Одобрено.[/SIZE][/COLOR][/CENTER]',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: 'В жалобы на адм',
      content:
		'[CENTER][B][COLOR=rgb(255, 255, 0)][SIZE=3]Доброго времени суток, уважаемый(ая) {{ user.mention }}.[/SIZE][/COLOR]<br><br>' +
        "[CENTER]Вы ошиблись разделом.<br>Обратитесь в раздел [Color=#ff0000]«Жалобы на администрацию»[/COLOR].[/CENTER]<br>" +
		'[Color=#ff0000][CENTER]Отказано, закрыто.[/CENTER][/color]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Форма темы',
      content:
		'[CENTER][B][COLOR=rgb(255, 255, 0)][SIZE=3]Доброго времени суток, уважаемый(ая) {{ user.mention }}.[/SIZE][/COLOR]<br><br>' +
        "[CENTER]Ваша жалоба составлена не по форме.<br>Убедительная просьба ознакомиться с правилами подачи жалоб:[/CENTER]<br>" +
"[CENTER]1. Ваш Nick_Name: [/CENTER]<br>" +
"[CENTER]2. Nick_Name игрока: [/CENTER]<br>" +
"[CENTER]3. Суть жалобы: [/CENTER]<br>" +
"[CENTER]4. Доказательство:[/CENTER]<br>" +
		'[Color=#ff0000][CENTER]Отказано, закрыто.[/CENTER][/color]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
	{
	  title: 'Нету /time',
	  content:
        '[CENTER][B][COLOR=rgb(255, 255, 0)][SIZE=3]Доброго времени суток, уважаемый(ая) {{ user.mention }}.[/SIZE][/COLOR]<br><br>' +
		"[CENTER]На ваших доказательствах отсутствует [COLOR=#ffff00]/time[/COLOR].[/CENTER]<br>" +
		'[Color=#ff0000][CENTER]Отказано, закрыто.[/CENTER][/color]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
	},
    {
      title: 'Жалоба на рассмотрении',
      content:
		'[CENTER][B][COLOR=rgb(255, 255, 0)][SIZE=3]Доброго времени суток, уважаемый(ая) {{ user.mention }}.[/SIZE][/COLOR]<br><br>' +
        "[CENTER]Ваша жалоба взята на [COLOR=#ff4500]рассмотрение[/COLOR].<br>Просьба ожидать ответа и не создавать дубликаты данной темы.[/CENTER]<br>" +
		'[Color=#ff4500][CENTER]Ожидайте ответа.[/CENTER][/color]',
      prefix: PIN_PREFIX,
	  status: true,
    },
     {
      title: 'Гл.Адм',
      content:
		'[CENTER][B][COLOR=rgb(255, 255, 0)][SIZE=3]Доброго времени суток, уважаемый(ая) {{ user.mention }}.[/SIZE][/COLOR]<br><br>' +
        "[CENTER]Ваша жалоба была передана [Color=#ff0000]Главной Администрации[/COLOR].<br>Просьба ожидать ответа и не создавать дубликаты данной темы.[/CENTER]<br>" +
		'[Color=#00FF00][CENTER][COLOR=#ff4500]Ожидайте ответа.[/COLOR][/CENTER][/color]',
      prefix: GA_PREFIX,
	  status: true,
    },
    {
      title: 'Тех. спецу',
      content:
		'[CENTER][B][COLOR=rgb(255, 255, 0)][SIZE=3]Доброго времени суток, уважаемый(ая) {{ user.mention }}.[/SIZE][/COLOR]<br><br>' +
        "[CENTER]Ваша жалоба была передана на рассмотрение [COLOR=#0000ff] Техническому Специалисту.[/color][/CENTER]<br>" +
		'[Color=Flame][CENTER][COLOR=#ff4500]Ожидайте ответа.[/COLOR][/CENTER][/color]',
      prefix: TEX_PREFIX,
	  status: true,
    },
     {
      title: 'Уход от РП',
      content:
		'[CENTER][B][COLOR=rgb(255, 255, 0)][SIZE=3]Доброго времени суток, уважаемый(ая) {{ user.mention }}.[/SIZE][/COLOR]<br><br>' +
        "[CENTER]Игрок будет[COLOR=#ff0000] наказан [/COLOR]по данному пункту правил:<br>2.02 Запрещено целенаправленно уходить от Role Play процесса всеразличными способами [Color=#ff0000]| Jail 30 минут / Warn[/COLOR] <br>[Color=#ff0000]Примечание:[/COLOR] например, уходить в AFK при остановке транспортного средства правоохранительными органами, выходить из игры для избежания смерти, выходить из игры во время процесса задержания / ареста, полное игнорирование отыгровок другого игрока, которые так или иначе могут коснутся Вашего персонажа и так далее<br>.[/CENTER]<br>" +
		'[Color=#00FF00][CENTER]Одобрено, закрыто.[/CENTER][/color]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Политика',
      content:
		'[CENTER][B][COLOR=rgb(255, 255, 0)][SIZE=3]Доброго времени суток, уважаемый(ая) {{ user.mention }}.[/SIZE][/COLOR]<br><br>' +
        "[CENTER]Игрок будет[COLOR=#ff0000] наказан [/COLOR]по данному пункту правил:<br>3.18. Запрещено политическое и религиозное пропагандирование [Color=#ff0000]| Mute 120 минут / Ban 10 дней[/COLOR][/CENTER]<br>" +
		'[Color=#00FF00][CENTER]Одобрено, закрыто.[/CENTER][/color]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
title: 'Док-ва в соц. сетях',
      content:
        '[CENTER][B][COLOR=rgb(255, 255, 0)][SIZE=3]Доброго времени суток, уважаемый(ая) {{ user.mention }}.[/SIZE][/COLOR]<br><br>' +
        "[COLOR=rgb(209, 213, 216)][SIZE=4][FONT=times new roman][I]Доказательства в социальных сетях и т.д. не принимаются. Загрузите доказательства на фото-видео хостинги YouTube,Imgur, Yapx и так далее.[/I][/FONT][/SIZE]<br><br>" +
        "[FONT=times new roman][SIZE=4][I]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/I][/SIZE][/FONT][/COLOR]<br><br>" +
        "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA RolePlay.[/SIZE][/FONT][/COLOR]<br><br>" +
        '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]Отказано.[/SIZE][/COLOR][/CENTER]',
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
title: 'Доква отредактированы',
      content:
		'[CENTER][B][COLOR=rgb(255, 255, 0)][SIZE=3]Доброго времени суток, уважаемый(ая) {{ user.mention }}.[/SIZE][/COLOR]<br><br>' +
        "[CENTER][B][I][FONT=georgia]Ваши докозательства отредоктированы. Создайте жалобу с первоначальными доказательствами.[/CENTER]" +
		'[Color=Red][CENTER]Отказано, закрыто.[/CENTER][/color]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
 title: 'ГМ/ЗГМ',
      content:
		'[CENTER][B][COLOR=rgb(255, 255, 0)][SIZE=3]Доброго времени суток, уважаемый(ая) {{ user.mention }}.[/SIZE][/COLOR]<br><br>' +
        "[CENTER]Ваша жалоба взята на [COLOR=#ff4500]рассмотрение[/COLOR] [COLOR=#ff0000]Главному Модератору форума/Заместителю Главного Модератора форума[/COLOR].<br>Просьба ожидать ответа и не создавать дубликаты данной темы.[/CENTER]<br>" +
		'[Color=#ff4500][CENTER]Ожидайте ответа.[/CENTER][/color]',
      prefix: PIN_PREFIX,
	  status: true,
    },
    {
 title: 'ГС ГОСС/ЗГС',
      content:
		'[CENTER][B][COLOR=rgb(255, 255, 0)][SIZE=3]Доброго времени суток, уважаемый(ая) {{ user.mention }}.[/SIZE][/COLOR]<br><br>' +
        "[CENTER]Ваша жалоба взята на [COLOR=#ff4500]рассмотрение[/COLOR] [COLOR=#ff0000]ГС ГОСС/Заместителю ГС ГОСС[/COLOR].<br>Просьба ожидать ответа и не создавать дубликаты данной темы.[/CENTER]<br>" +
		'[Color=#ff4500][CENTER]Ожидайте ответа.[/CENTER][/color]',
      prefix: PIN_PREFIX,
	  status: true,
    },
     {
	  title: '_______________________________________ Для РП биографий____________________________________ ',
	},
    {
      title: 'био одобрено',
      content:
		'[CENTER][B][COLOR=rgb(255, 255, 0)][SIZE=3]Доброго времени суток, уважаемый(ая) {{ user.mention }}.[/SIZE][/COLOR]<br><br>' +
        "[CENTER]Ваша РП биография получает статус: [Color=#00ff00]Одобрено.[/CENTER][/color]",
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
           title: '3е лицо',
      content:
		'[CENTER][B][COLOR=rgb(255, 255, 0)][SIZE=3]Доброго времени суток, уважаемый(ая) {{ user.mention }}.[/SIZE][/COLOR]<br><br>' +
        "[CENTER]Ваша РП биография получает статус: [Color=Red]Отказано.[/color]<br>Причиной отказа могло послужить создание биографии от 3го лица.[/CENTER]",
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
title: 'Заголовок темы',
      content:
		'[CENTER][B][COLOR=rgb(255, 255, 0)][SIZE=3]Доброго времени суток, уважаемый(ая) {{ user.mention }}.[/SIZE][/COLOR]<br><br>' +
        "[CENTER]Ваша РП биография получает статус: [Color=Red]Отказано.[/color]<br>Причиной отказа могло послужить неправильное заполнение загловка темы.[/CENTER]",
      prefix:UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'био отказ',
      content:
		'[CENTER][B][COLOR=rgb(255, 255, 0)][SIZE=3]Доброго времени суток, уважаемый(ая) {{ user.mention }}.[/SIZE][/COLOR]<br><br>' +
        "[CENTER]Ваша РП биография получает статус: [Color=#ff0000]Отказано.[/color]<br>Причиной отказа могло послужить какое-либо нарушение из правил для составления RP Биографий.[/CENTER]",
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
    12 < hours && hours <= 18
      ? 'Доброе утро'
      : 18 < hours && hours <= 21
      ? 'Добрый день'
      : 21 < hours && hours <= 4
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
 