// ==UserScript==
// @name         Для Кураторов Форума | Yellow
// @namespace    https://forum.blackrussia.online
// @description:ru Предложения по улучшению скрипта писать сюда ---> https://vk.com/artyr.com4
// @version      0.7.8
// @description  Скрипт для кураторов форума желтого сервера
// @author       Dima_Bills
// @match        https://forum.blackrussia.online/index.php?threads/*
// @include      https://forum.blackrussia.online/index.php?threads/
// @grant        none
// @license    Bills
// @collaborator Bills
// @icon https://icons.iconarchive.com/icons/goescat/macaron/64/telegram-icon.png
// @downloadURL https://update.greasyfork.org/scripts/454419/%D0%94%D0%BB%D1%8F%20%D0%9A%D1%83%D1%80%D0%B0%D1%82%D0%BE%D1%80%D0%BE%D0%B2%20%D0%A4%D0%BE%D1%80%D1%83%D0%BC%D0%B0%20%7C%20Yellow.user.js
// @updateURL https://update.greasyfork.org/scripts/454419/%D0%94%D0%BB%D1%8F%20%D0%9A%D1%83%D1%80%D0%B0%D1%82%D0%BE%D1%80%D0%BE%D0%B2%20%D0%A4%D0%BE%D1%80%D1%83%D0%BC%D0%B0%20%7C%20Yellow.meta.js
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
	  title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴ Для жалоб на игроков ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴ ',
	},
    {
      title: 'РК',
      content:
		'[CENTER][B][COLOR=rgb(255, 255, 0)][SIZE=3]Доброго времени суток, {{ user.mention }}.[/SIZE][/COLOR]<br><br>' +
        "[CENTER]Игрок будет [COLOR=#ff0000]наказан[/COLOR] по данному пункту правил:<br>2.14.  Запрещен RK (Revenge Kill) — убийство игрока с целью мести, возвращение на место смерти в течение 15-ти минут, а также использование в дальнейшем информации, которая привела Вас к смерти [Color=#ff0000]| Jail 30 минут[/COLOR].[/CENTER]<br>" +
        "[CENTER] [/CENTER]<br>" +
		'[Color=#00FF00][CENTER]Одобрено, закрыто.[/CENTER][/color]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'СК',
      content:
		'[CENTER][B][COLOR=rgb(255, 255, 0)][SIZE=3]Доброго времени суток, {{ user.mention }}.[/SIZE][/COLOR]<br><br>' +
        "[CENTER]Игрок будет [COLOR=#ff0000]наказан[/COLOR] по данному пункту правил:<br>2.16. Запрещен SK (Spawn Kill) — убийство или нанесение урона на титульной территории любой фракции / организации, на месте появления игрока, а также на выходе из закрытых интерьеров и около них [Color=#ff0000]| Jail 60 минут / Warn (за два и более убийства)[/COLOR].[/CENTER]<br>" +
        "[CENTER] [/CENTER]<br>" +
		'[Color=#00FF00][CENTER]Одобрено, закрыто.[/CENTER][/color]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'ПГ',
      content:
		'[CENTER][B][COLOR=rgb(255, 255, 0)][SIZE=3]Доброго времени суток, {{ user.mention }}.[/SIZE][/COLOR]<br><br>' +
        "[CENTER]Игрок будет [COLOR=#ff0000]наказан[/COLOR] по данному пункту правил:<br>2.17. Запрещен PG (PowerGaming) — присвоение свойств персонажу, не соответствующих реальности, отсутствие страха за свою жизнь [Color=#ff0000]| Jail 30 минут[/COLOR].[/CENTER]<br>" +
        "[CENTER] [/CENTER]<br>" +
		'[Color=#00FF00][CENTER]Одобрено, закрыто.[/CENTER][/color]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'ДМ',
      content:
		'[CENTER][B][COLOR=rgb(255, 255, 0)][SIZE=3]Доброго времени суток, {{ user.mention }}.[/SIZE][/COLOR]<br><br>' +
        "[CENTER]Игрок будет[COLOR=#ff0000] наказан [/COLOR]по данному пункту правил:<br>2.19. Запрещен DM (DeathMatch) — убийство или нанесение урона без веской IC причины [Color=#ff0000]| Jail 60 минут[/COLOR].[/CENTER]<br>" +
        "[CENTER] [/CENTER]<br>" +
		'[Color=#00FF00][CENTER]Одобрено, закрыто.[/CENTER][/color]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
     {
      title: 'Масс ДМ',
      content:
		'[CENTER][B][COLOR=rgb(255, 255, 0)][SIZE=3]Доброго времени суток, {{ user.mention }}.[/SIZE][/COLOR]<br><br>' +
        "[CENTER]Игрок будет[COLOR=#ff0000] наказан [/COLOR]по данному пункту правил:<br>2.20. Запрещен Mass DM (Mass DeathMatch) — убийство или нанесение урона без веской IC причины более трем игрокам [Color=#ff0000]| Warn / Ban 3 - 7 дней[/COLOR].[/CENTER]<br>" +
        "[CENTER] [/CENTER]<br>" +
		'[Color=#00FF00][CENTER]Одобрено, закрыто.[/CENTER][/color]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
     {
      title: 'ТК',
      content:
		'[CENTER][B][COLOR=rgb(255, 255, 0)][SIZE=3]Доброго времени суток, {{ user.mention }}.[/SIZE][/COLOR]<br><br>' +
        "[CENTER]Игрок будет[COLOR=#ff0000] наказан [/COLOR]по данному пункту правил:<br>2.15. Запрещен TK (Team Kill) — убийство члена своей или союзной фракции, организации без наличия какой-либо IC причины [Color=#ff0000]| Jail 60 минут / Warn (за два и более убийства)[/COLOR].[/CENTER]<br>" +
        "[CENTER] [/CENTER]<br>" +
		'[Color=#00FF00][CENTER]Одобрено, закрыто.[/CENTER][/color]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'ДБ',
      content:
		'[CENTER][B][COLOR=rgb(255, 255, 0)][SIZE=3]Доброго времени суток, {{ user.mention }}.[/SIZE][/COLOR]<br><br>' +
        "[CENTER]Игрок будет[COLOR=#ff0000] наказан [/COLOR]по данному пункту правил:<br>2.13. Запрещен DB (DriveBy) — намеренное убийство / нанесение урона без веской IC причины на любом виде транспорта [Color=#ff0000]| Jail 60 минут[/COLOR].[/CENTER]<br>" +
        "[CENTER] [/CENTER]<br>" +
		'[Color=#00FF00][CENTER]Одобрено, закрыто.[/CENTER][/color]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'MG',
      content:
		'[CENTER][B][COLOR=rgb(255, 255, 0)][SIZE=3]Доброго времени суток, {{ user.mention }}.[/SIZE][/COLOR]<br><br>' +
        "[CENTER]Игрок будет[COLOR=#ff0000] наказан [/COLOR]по данному пункту правил:<br>2.18. Запрещен MG (MetaGaming) — использование ООС информации, которую Ваш персонаж никак не мог получить в IC процессе [Color=#ff0000]| Mute 30 минут[/COLOR].[/CENTER]<br>" +
        "[CENTER] [/CENTER]<br>" +
		'[Color=#00FF00][CENTER]Одобрено, закрыто.[/CENTER][/color]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
	  title: 'Капс',
	  content:
		'[CENTER][B][COLOR=rgb(255, 255, 0)][SIZE=3]Доброго времени суток, {{ user.mention }}.[/SIZE][/COLOR]<br><br>' +
		"[CENTER]Игрок будет[COLOR=#ff0000] наказан [/COLOR]по данному пункту правил:<br>3.02. Запрещено использование верхнего регистра (CapsLock) при написании любого текста в любом чате [Color=#ff0000]| Mute 30 минут[/COLOR].[/CENTER]<br>" +
        "[CENTER] [/CENTER]<br>" +
		'[Color=#00FF00][CENTER]Одобрено, закрыто.[/CENTER][/color]',
      prefix: ACCEPT_PREFIX,
	  status: false,
	},
    {
	  title: 'Флуд',
	  content:
		'[CENTER][B][COLOR=rgb(255, 255, 0)][SIZE=3]Доброго времени суток, {{ user.mention }}.[/SIZE][/COLOR]<br><br>' +
		"[CENTER]Игрок будет[COLOR=#ff0000] наказан [/COLOR]по данному пункту правил:<br>3.05. Запрещен флуд — 3 и более повторяющихся сообщений от одного и того же игрока [Color=#ff0000]| Mute 30 минут[/COLOR].[/CENTER]<br>" +
        "[CENTER] [/CENTER]<br>" +
		'[Color=#00FF00][CENTER]Одобрено, закрыто.[/CENTER][/color]',
      prefix: ACCEPT_PREFIX,
	  status: false,
	},
     {
	  title: 'Злоупотребление знаками',
	  content:
		'[CENTER][B][COLOR=rgb(255, 255, 0)][SIZE=3]Доброго времени суток, {{ user.mention }}.[/SIZE][/COLOR]<br><br>' +
		"[CENTER]Игрок будет[COLOR=#ff0000] наказан [/COLOR]по данному пункту правил:<br>3.06. Запрещено злоупотребление знаков препинания и прочих символов [Color=#ff0000]| Mute 30 минут[/COLOR].[/CENTER]<br>" +
        "[CENTER][Color=Red]Пример[/color]: «???????», «!!!!!!!», «Дааааааааааааааааааааааа» и так далее.[/CENTER]<br>" +
        "[CENTER] [/CENTER]<br>" +
		'[Color=#00FF00][CENTER]Одобрено, закрыто.[/CENTER][/color]',
      prefix: ACCEPT_PREFIX,
	  status: false,
	},
     {
	  title: 'Транслит',
	  content:
		'[CENTER][B][COLOR=rgb(255, 255, 0)][SIZE=3]Доброго времени суток, {{ user.mention }}.[/SIZE][/COLOR]<br><br>' +
		"[CENTER]Игрок будет[COLOR=#ff0000] наказан [/COLOR]по данному пункту правил:<br>3.20. Запрещено использование транслита в любом из чатов [Color=#ff0000]| Mute 30 минут[/COLOR].[/CENTER]<br>" +
        "[CENTER][Color=Red]Пример[/color]: «Privet», «Kak dela», «Narmalna».[/CENTER]<br>" +
        "[CENTER] [/CENTER]<br>" +
		'[Color=#00FF00][CENTER]Одобрено, закрыто.[/CENTER][/color]',
      prefix: ACCEPT_PREFIX,
	  status: false,
	},
    {
      title: 'Оск в нрп чат',
      content:
		'[CENTER][B][COLOR=rgb(255, 255, 0)][SIZE=3]Доброго времени суток {{ user.mention }}.[/SIZE][/COLOR]<br><br>' +
        "[CENTER]Игрок будет[COLOR=#ff0000] наказан [/COLOR]по данному пункту правил:<br>3.03. Любые формы оскорблений, издевательств, расизма, дискриминации, религиозной враждебности, сексизма в OOC чате запрещены [Color=#ff0000]| Mute 30 минут[/COLOR].[/CENTER]<br>" +
        "[CENTER] [/CENTER]<br>" +
		'[Color=#00FF00][CENTER]Одобрено, закрыто.[/CENTER][/color]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
     {
      title: 'Оск в рп чат',
      content:
		'[CENTER][B][COLOR=rgb(255, 255, 0)][SIZE=3]Доброго времени суток {{ user.mention }}.[/SIZE][/COLOR]<br><br>' +
        "[CENTER]Игрок будет[COLOR=#ff0000] наказан [/COLOR]по данному пункту правил:<br>3.07.  Запрещены совершенно любые оскорбления или действия, порочащие честь и достоинства, несущие в себе подтекст сексуального характера вне зависимости от чата [Color=#ff0000]| Mute 30 минут[/COLOR].[/CENTER]<br>" +
        "[CENTER] [/CENTER]<br>" +
		'[Color=#00FF00][CENTER]Одобрено, закрыто.[/CENTER][/color]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Угрозы в OOC',
      content:
		'[CENTER][B][COLOR=rgb(255, 255, 0)][SIZE=3]Доброго времени суток {{ user.mention }}.[/SIZE][/COLOR]<br><br>' +
        "[CENTER]Игрок будет[COLOR=#ff0000] наказан [/COLOR]по данному пункту правил:<br>2.37. Запрещены OOC угрозы, в том числе и завуалированные [Color=#ff0000]| Mute 120 минут / Ban 7 дней[/COLOR].[/CENTER]<br>" +
        "[CENTER] [/CENTER]<br>" +
		'[Color=#00FF00][CENTER]Одобрено, закрыто.[/CENTER][/color]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Упом/оск родни',
      content:
		'[CENTER][B][COLOR=rgb(255, 255, 0)][SIZE=3]Доброго времени суток, {{ user.mention }}.[/SIZE][/COLOR]<br><br>' +
        "[CENTER]Игрок будет[COLOR=#ff0000] наказан [/COLOR]по данному пункту правил:<br>3.04. Запрещено оскорбление или косвенное упоминание родных вне зависимости от чата (IC или OOC) [Color=#ff0000]| Mute 120 минут / Ban 7 - 15 дней[/COLOR].[/CENTER]<br>" +
        "[CENTER] [/CENTER]<br>" +
		'[Color=#00FF00][CENTER]Одобрено, закрыто.[/CENTER][/color]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
     {
      title: 'Упом/оск родни в ГЧ',
      content:
		'[CENTER][B][COLOR=rgb(255, 255, 0)][SIZE=3]Доброго времени суток, {{ user.mention }}.[/SIZE][/COLOR]<br><br>' +
        "[CENTER]Игрок будет[COLOR=#ff0000] наказан [/COLOR]по данному пункту правил:<br>3.15. Запрещено оскорблять игроков или родных в Voice Chat [Color=#ff0000]| Mute 120 минут / Ban 7 - 15 дней[/COLOR].[/CENTER]<br>" +
        "[CENTER] [/CENTER]<br>" +
		'[Color=#00FF00][CENTER]Одобрено, закрыто.[/CENTER][/color]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Музыка в ГЧ',
      content:
		'[CENTER][B][COLOR=rgb(255, 255, 0)][SIZE=3]Доброго времени суток, {{ user.mention }}.[/SIZE][/COLOR]<br><br>' +
        "[CENTER]Игрок будет[COLOR=#ff0000] наказан [/COLOR]по данному пункту правил:<br>3.14. Запрещено включать музыку в Voice Chat [Color=#ff0000]| Mute 60 минут[/COLOR].[/CENTER]<br>" +
        "[CENTER] [/CENTER]<br>" +
		'[Color=#00FF00][CENTER]Одобрено, закрыто.[/CENTER][/color]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Шум в ГЧ',
      content:
		'[CENTER][B][COLOR=rgb(255, 255, 0)][SIZE=3]Доброго времени суток, {{ user.mention }}.[/SIZE][/COLOR]<br><br>' +
        "[CENTER]Игрок будет[COLOR=#ff0000] наказан [/COLOR]по данному пункту правил:<br>3.16. Запрещено создавать посторонние шумы или звуки [Color=#ff0000]| Mute 30 минут[/COLOR].[/CENTER]<br>" +
        "[CENTER][Color=Red]Примечание[/color]: Посторонние звуки на фоне речи, мешающие взаимодействию игроков посредством голосового чата. Сильное искажение звука, исходящее из микрофона плохого качества. Намеренно портить игру другим игрокам (кричать, перебивать)[/CENTER]<br>" +
        "[CENTER] [/CENTER]<br>" +
		'[Color=#00FF00][CENTER]Одобрено, закрыто.[/CENTER][/color]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Обьявление в госс помещении',
      content:
		'[CENTER][B][COLOR=rgb(255, 255, 0)][SIZE=3]Доброго времени суток, {{ user.mention }}.[/SIZE][/COLOR]<br><br>' +
        "[CENTER]Игрок будет[COLOR=#ff0000] наказан [/COLOR]по данному пункту правил:<br>2.22. Запрещено публиковать любые объявления в помещениях государственных организаций вне зависимости от чата (IC или OOC) [Color=#ff0000]| Mute 30 минут[/COLOR].[/CENTER]<br>" +
        "[CENTER][Color=Red]Пример[/color]: в помещении центральной больницы писать в чат: 'Продам эксклюзивную шапку дешево!!!'[/CENTER]<br>" +
        "[CENTER] [/CENTER]<br>" +
		'[Color=#00FF00][CENTER]Одобрено, закрыто.[/CENTER][/color]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
 title: 'NonRP поведение',
      content:
		'[CENTER][B][COLOR=rgb(255, 255, 0)][SIZE=3]Доброго времени суток, {{ user.mention }}.[/SIZE][/COLOR]<br><br>' +
        "[CENTER]Игрок будет[COLOR=#ff0000] наказан [/COLOR]по данному пункту правил:<br>2.01 Запрещено поведение, нарушающее нормы процессов Role Play режима игры [Color=#ff0000]| Jail 30 минут[/COLOR].[/CENTER]<br>" +
        "[CENTER] [/CENTER]<br>" +
		'[Color=#00FF00][CENTER]Одобрено, закрыто.[/CENTER][/color]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
 title: 'NonRP вождение',
      content:
		'[CENTER][B][COLOR=rgb(255, 255, 0)][SIZE=3]Доброго времени суток, {{ user.mention }}.[/SIZE][/COLOR]<br><br>' +
        "[CENTER]Игрок будет[COLOR=#ff0000] наказан [/COLOR]по данному пункту правил:<br>2.03. Запрещен NonRP Drive — вождение любого транспортного средства в невозможных для него условиях, а также вождение в неправдоподобной манере [Color=#ff0000]| Jail 30 минут[/COLOR].[/CENTER]<br>" +
        "[CENTER] [/CENTER]<br>" +
		'[Color=#00FF00][CENTER]Одобрено, закрыто.[/CENTER][/color]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
title: 'ЕПП фура/инко',
      content:
		'[CENTER][B][COLOR=rgb(255, 255, 0)][SIZE=3]Доброго времени суток, {{ user.mention }}.[/SIZE][/COLOR]<br><br>' +
        "[CENTER]Игрок будет[COLOR=#ff0000] наказан [/COLOR]по данному пункту правил:<br>2.47. Запрещено ездить по полям на грузовом транспорте, инкассаторских машинах (работа дальнобойщика, инкассатора) [Color=#ff0000]| Jail 60 минут[/COLOR].[/CENTER]<br>" +
        "[CENTER] [/CENTER]<br>" +
		'[Color=#00FF00][CENTER]Одобрено, закрыто.[/CENTER][/color]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
title: 'Постороннее ПО/Изм. Файлов игры',
      content:
		'[CENTER][B][COLOR=rgb(255, 255, 0)][SIZE=3]Доброго времени суток, {{ user.mention }}.[/SIZE][/COLOR]<br><br>' +
        "[CENTER]Игрок будет[COLOR=#ff0000] наказан [/COLOR]по данному пункту правил:<br>2.22. Запрещено хранить / использовать / распространять стороннее программное обеспечение или любые другие средства, позволяющие получить преимущество над другими игроками [Color=#ff0000]|  Ban 15 - 30 дней / PermBan[/COLOR].[/CENTER]<br>" +
        "[CENTER] [COLOR=#ff0000]Примечание:[/COLOR] запрещено внесение любых изменений в оригинальные файлы игры. [/CENTER]<br>" +
        "[CENTER] [COLOR=#ff0000]Исключение:[/COLOR] разрешено изменение шрифта, его размера и длины чата (кол-во строк). [/CENTER]<br>" +
        "[CENTER] [COLOR=#ff0000]Исключение:[/COLOR] блокировка за включенный счетчик FPS не выдается. [/CENTER]<br>" +
        "[CENTER] [/CENTER]<br>" +
		'[Color=#00FF00][CENTER]Одобрено, закрыто.[/CENTER][/color]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
    title: 'NRP обман',
      content:
       '[CENTER][B][COLOR=rgb(255, 255, 0)][SIZE=3]Доброго времени суток, {{ user.mention }}.[/SIZE][/COLOR]<br><br>' +
        "[CENTER]Нарушитель буден наказан по следующему пункту общих правил серверов:<br><br>" +
        "[CENTER][COLOR=rgb(255, 0, 0)]2.05.[/COLOR] Запрещены любые OOC обманы и их попытки, а также любые IC обманы с нарушением Role Play правил и логики[COLOR=#ff0000] | PermBan[/COLOR]<br><br>" +
        '[LIST]<br><br>' +
        "[CENTER][COLOR=rgb(255, 0, 0)]Примечание:[/COLOR] после IC договоренности получить денежные средства и сразу же выйти из игры с целью обмана игрока, или же, договорившись через OOC чат (/n), точно также получить денежные средства и сразу же выйти из игры и тому подобные ситуации.<br><br>" +
        "[CENTER][COLOR=rgb(255, 0, 0)]Примечание:[/COLOR] разблокировка игрового аккаунта нарушителя будет возможна только в случае возврата полной суммы причиненного ущерба, либо непосредственно самого имущества, которое было украдено (по решению обманутой стороны).<br><br>" +
        "[CENTER][/LIST]<br><br>" +
        '[Color=#00FF00][CENTER]Одобрено.[/COLOR]',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
title: 'Нету условий сделки',
      content:
		'[CENTER][B][COLOR=rgb(255, 255, 0)][SIZE=3]Доброго времени суток, {{ user.mention }}.[/SIZE][/COLOR]<br><br>' +
        "[CENTER][B]В данных доказательствах отсутствуют условия сделки[/CENTER]" +
        "[CENTER] [/CENTER]<br>" +
		'[Color=Red][CENTER]Отказано, закрыто.[/CENTER][/color]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
title: 'Укажите таймкоды',
	  content:
		'[CENTER][B][COLOR=rgb(255, 255, 0)][SIZE=3]Доброго времени суток, {{ user.mention }}.[/SIZE][/COLOR]<br><br>' +
        "[CENTER]Ваше видео более 3х минут. [/CENTER]<br>" +
        "[CENTER]3.7 Если видеодоказательство длится более 3 минут, Вы должны указать тайм-коды нарушений.[/CENTER]<br>" +
		"[CENTER]Укажите тайм коды нарушений игрока и создайте новую жалобу. [/CENTER]<br>" +
        "[CENTER] [/CENTER]<br>" +
		'[Color=Red][CENTER]Отказано, закрыто.[/CENTER][/color]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
title: 'Нужна видеофиксация',
      content:
		'[CENTER][B][COLOR=rgb(255, 255, 0)][SIZE=3]Доброго времени суток, {{ user.mention }}.[/SIZE][/COLOR]<br><br>' +
        "[CENTER][B]В таких случаях нужна видеофиксация нарушения.[/CENTER]" +
        "[CENTER] [/CENTER]<br>" +
		'[Color=Red][CENTER]Отказано, закрыто.[/CENTER][/color]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Реклама промо',
      content:
		'[CENTER][B][COLOR=rgb(255, 255, 0)][SIZE=3]Доброго времени суток, {{ user.mention }}.[/SIZE][/COLOR]<br><br>' +
        "[CENTER]Игрок будет[COLOR=#ff0000] наказан [/COLOR]по данному пункту правил:<br>3.21. Запрещается реклама промокодов в игре, а также их упоминание в любом виде во всех чатах. [Color=#ff0000]| Ban 30 дней[/Color].[/CENTER]<br>" +
        "[CENTER] [/CENTER]<br>" +
		'[Color=#00FF00][CENTER]Одобрено, закрыто.[/CENTER][/color]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Продажа Промо',
      content:
		'[CENTER][B][COLOR=rgb(255, 255, 0)][SIZE=3]Доброго времени суток, {{ user.mention }}.[/SIZE][/COLOR]<br><br>' +
        "[CENTER]Игрок будет[COLOR=#ff0000] наказан [/COLOR]по данному пункту правил:<br>2.43. Запрещена продажа / обмен / покупка поощрительной составляющей от лица проекта, будь то бонус-код, либо промокод, который выдается безвозмездно игрокам в целях промоакций [Color=#ff0000]| Mute 120 минут[/Color].[/CENTER]<br>" +
        "[CENTER] [/CENTER]<br>" +
		'[Color=#00FF00][CENTER]Одобрено, закрыто.[/CENTER][/color]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Неув обр. к адм/оск адм',
      content:
		'[CENTER][B][COLOR=rgb(255, 255, 0)][SIZE=3]Доброго времени суток, {{ user.mention }}.[/SIZE][/COLOR]<br><br>' +
        "[CENTER]Игрок будет[COLOR=#ff0000] наказан [/COLOR]по данному пункту правил:<br>2.54. Запрещено неуважительное обращение, неадекватное поведение, угрозы в любом их проявлении по отношению к администрации [Color=#ff0000]| Mute 180 минут[/COLOR][/CENTER]<br>" +
        "[CENTER] [/CENTER]<br>" +
		'[Color=#00FF00][CENTER]Одобрено, закрыто.[/CENTER][/color]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
title: 'Обман адм',
      content:
		'[CENTER][B][COLOR=rgb(255, 255, 0)][SIZE=3]Доброго времени суток, {{ user.mention }}.[/SIZE][/COLOR]<br><br>' +
        "[CENTER]Игрок будет[COLOR=#ff0000] наказан [/COLOR]по данному пункту правил:<br>2.32. Запрещено введение в заблуждение, обман администрации на всех ресурсах проекта [Color=#ff0000]| Ban 7 - 15 дней / PermBan[/COLOR][/CENTER]<br>" +
        "[CENTER] [/CENTER]<br>" +
		'[Color=#00FF00][CENTER]Одобрено, закрыто.[/CENTER][/color]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Выдача себя за адм',
      content:
		'[CENTER][B][COLOR=rgb(255, 255, 0)][SIZE=3]Доброго времени суток, {{ user.mention }}.[/SIZE][/COLOR]<br><br>' +
        "[CENTER]Игрок будет[COLOR=#FF0000] наказан [/COLOR]по данному пункту правил:<br>3.10. Запрещена выдача себя за администратора, если таковым не являетесь [Color=#ff0000]| Ban 15 - 30 + ЧС администрации[/COLOR][/CENTER]<br>" +
        "[CENTER] [/CENTER]<br>" +
		'[Color=#00FF00][CENTER]Одобрено, закрыто.[/CENTER][/color]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
 title: 'Оск. Проекта',
      content:
		'[CENTER][B][COLOR=rgb(255, 255, 0)][SIZE=3]Доброго времени суток, {{ user.mention }}.[/SIZE][/COLOR]<br><br>' +
        "[CENTER]Игрок будет[COLOR=#FF0000] наказан [/COLOR]по данному пункту правил:<br>2.40.  Запрещены совершенно любые деструктивные действия по отношению к проекту: неконструктивная критика, призывы покинуть проект, попытки нарушить развитие проекта или любые другие действия, способные привести к помехам в игровом процессе [Color=#ff0000]|Mute 300 минут / Ban 30 дней (Ban выдается по согласованию с главным администратором)[/COLOR][/CENTER]<br>" +
        "[CENTER] [/CENTER]<br>" +
		'[Color=#00FF00][CENTER]Одобрено, закрыто.[/CENTER][/color]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
title: 'Призыв покинуть проект',
      content:
		'[CENTER][B][COLOR=rgb(255, 255, 0)][SIZE=3]Доброго времени суток, {{ user.mention }}.[/SIZE][/COLOR]<br><br>' +
        "[CENTER]Игрок будет[COLOR=#FF0000] наказан [/COLOR]по данному пункту правил:<br>2.40.  Запрещены совершенно любые деструктивные действия по отношению к проекту: неконструктивная критика, призывы покинуть проект, попытки нарушить развитие проекта или любые другие действия, способные привести к помехам в игровом процессе [Color=#ff0000]|Mute 300 минут / Ban 30 дней (Ban выдается по согласованию с главным администратором)[/COLOR][/CENTER]<br>" +
        "[CENTER] [/CENTER]<br>" +
		'[Color=#00FF00][CENTER]Одобрено, закрыто.[/CENTER][/color]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
title: 'задержание без РП',
      content:
       '[CENTER][B][COLOR=rgb(255, 255, 0)][SIZE=3]Доброго времени суток, {{ user.mention }}.[/SIZE][/COLOR]<br><br>' +
        "[COLOR=rgb(209, 213, 216)][SIZE=4]Нарушитель буден наказан по следующему пункту правил государственных структур:[/SIZE][/COLOR]<br><br>" +
        "[COLOR=rgb(255, 0, 0)][SIZE=4]6.03. [/SIZE][/COLOR][COLOR=rgb(209, 213, 216)][SIZE=4]Запрещено оказывать задержание без Role Play отыгровки[/SIZE][/COLOR][COLOR=rgb(255, 0, 0)][SIZE=4] | Warn[/SIZE][/COLOR]<br><br>" +
        "[CENTER] [/CENTER]<br>" +
        '[COLOR=rgb(0, 255, 255)][SIZE=4]Одобрено.[/SIZE][/COLOR][/CENTER]',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
 title: 'Работа в форме/казино',
      content:
       '[CENTER][B][COLOR=rgb(255, 255, 0)][SIZE=3]Доброго времени суток, {{ user.mention }}.[/COLOR]<br><br>' +
        "Нарушитель буден наказан по следующему пункту правил государственных структур:<br><br>" +
        "[Color=#ff0000]1.13.[/COLOR] Запрещено находиться в форме внутри казино, а также устраиваться на сторонние работы в форме фракции'[Color=#ff0000] | Jail 30 минут[/COLOR]<br><br>" +
        "[CENTER] [/CENTER]<br>" +
        '[COLOR=rgb(0, 255, 255)][SIZE=4]Одобрено.[/COLOR][/CENTER]',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
	  title: 'Нарушений не найдено',
	  content:
		'[CENTER][B][COLOR=rgb(255, 255, 0)][SIZE=3]Доброго времени суток, {{ user.mention }}.[/SIZE][/COLOR]<br><br>' +
		"[CENTER]Нарушений со стороны данного игрока не было найдено.[/CENTER]<br>" +
        "[CENTER] [/CENTER]<br>" +
		'[Color=#FF0000][CENTER]Отказано, закрыто.[/CENTER][/color]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
	},
{
      title: 'Недостаточно доказательств',
      content:
		'[CENTER][B][COLOR=rgb(255, 255, 0)][SIZE=3]Доброго времени суток, {{ user.mention }}.[/SIZE][/COLOR]<br><br>' +
        "[CENTER]Недостаточно доказательств на нарушение от данного игрока.<br>Доказательства должны быть предоставлены в хорошем качестве и с полным процессом сделки или нарушения от какого-либо игрока.[/CENTER]<br>" +
        "[CENTER] [/CENTER]<br>" +
		'[Color=#ff0000][CENTER]Отказано, закрыто.[/CENTER][/color]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Дублирование',
      content:
        '[CENTER][B][COLOR=rgb(255, 255, 0)][SIZE=3]Доброго времени суток, {{ user.mention }}.[/SIZE][/COLOR]<br><br>' +
        "Ранее вам уже был дан ответ на подобную жалобу, просьба не создавать дубликаты этой темы, иначе ваш форумный аккаунт может быть заблокирован.<br>" +
        "[CENTER] [/CENTER]<br>" +
        '[COLOR=rgb(255, 0, 0)]Отказано.[/COLOR][/CENTER]',
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
title: 'Bagouse Anim',
      content:
        '[CENTER][B][COLOR=rgb(255, 255, 0)][SIZE=3]Доброго времени суток, {{ user.mention }}.[/COLOR]<br><br>' +
        "Нарушитель буден наказан по следующему пункту общих правил серверов:[/SIZE]<br><br>" +
        "[COLOR=rgb(255, 0, 0)]2.55. [/COLOR]Запрещается багоюз связанный с анимацией в любых проявлениях. [COLOR=rgb(255, 0, 0)]| Jail 60 / 120 минут[/COLOR]<br><br>" +
        '[LIST]<br><br>' +
        "[*][COLOR=rgb(255, 0, 0)]Пример: [/COLOR]если игрок, используя баг, убирает ограничение на использование оружия в зеленой зоне, сбивает темп стрельбы, либо быстро перемещается во время войны за бизнес или во время перестрелки на мероприятии с семейными контейнерами, последует наказание в виде Jail на 120 минут. Данное наказание используется в случаях, когда, используя ошибку, было получено преимущество перед другими игроками.<br><br>" +
        "[*][COLOR=rgb(255, 0, 0)]Пример: [/COLOR]если игрок использует баги, связанные с анимацией, и при этом не влияет на игровой процесс других игроков, а также не получает преимущество перед другими игроками, последует наказание в виде Jail на 60 минут.<br><br>" +
        "[/LIST]<br><br>" +
        '[Color=#00FF00][CENTER]Одобрено, закрыто.[/CENTER][/color]',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
     {
title: 'Bagouse',
      content:
        '[CENTER][B][COLOR=rgb(255, 255, 0)][SIZE=3]Доброго времени суток, {{ user.mention }}.[/COLOR]<br><br>' +
        "Нарушитель буден наказан по следующему пункту общих правил серверов:[/SIZE]<br><br>" +
        "[COLOR=rgb(255, 0, 0)]2.21. [/COLOR]Запрещено пытаться обходить игровую систему или использовать любые баги сервера [COLOR=rgb(255, 0, 0)]| Ban 15 - 30 дней / PermBan [/COLOR]<br><br>" +
        "[CENTER] [/CENTER]<br>" +
        '[Color=#00FF00][CENTER]Одобрено, закрыто.[/CENTER][/color]',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: 'В жалобы на адм',
      content:
		'[CENTER][B][COLOR=rgb(255, 255, 0)][SIZE=3]Доброго времени суток, {{ user.mention }}.[/SIZE][/COLOR]<br><br>' +
        "[CENTER]Вы ошиблись разделом.<br>Обратитесь в раздел [Color=#ff0000]Жалобы на администрацию[/COLOR] - [URL='https://forum.blackrussia.online/index.php?forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B0%D0%B4%D0%BC%D0%B8%D0%BD%D0%B8%D1%81%D1%82%D1%80%D0%B0%D1%86%D0%B8%D1%8E.192/']*Клик*[/URL].[/CENTER]<br>" +
        "[CENTER] [/CENTER]<br>" +
		'[Color=#ff0000][CENTER]Отказано, закрыто.[/CENTER][/color]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
     {
      title: 'В обжалование',
      content:
		'[CENTER][B][COLOR=rgb(255, 255, 0)][SIZE=3]Доброго времени суток, {{ user.mention }}.[/SIZE][/COLOR]<br><br>' +
        "[CENTER]Вы ошиблись разделом.<br>Обратитесь в раздел Обжалования: [URL='https://forum.blackrussia.online/index.php?forums/%D0%9E%D0%B1%D0%B6%D0%B0%D0%BB%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D0%B5-%D0%BD%D0%B0%D0%BA%D0%B0%D0%B7%D0%B0%D0%BD%D0%B8%D0%B9.195/']*Клик*[/URL].[/CENTER]<br>" +
        "[CENTER] [/CENTER]<br>" +
		'[Color=#ff0000][CENTER]Отказано, закрыто.[/CENTER][/color]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Жалоба не по форме',
      content:
		'[CENTER][B][COLOR=rgb(255, 255, 0)][SIZE=3]Доброго времени суток, {{ user.mention }}.[/SIZE][/COLOR]<br><br>' +
        "[CENTER]Ваша жалоба составлена не по форме.<br>Убедительная просьба ознакомиться с правилами подачи жалоб: [URL='https://forum.blackrussia.online/index.php?threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BF%D0%BE%D0%B4%D0%B0%D1%87%D0%B8-%D0%B6%D0%B0%D0%BB%D0%BE%D0%B1-%D0%BD%D0%B0-%D0%B8%D0%B3%D1%80%D0%BE%D0%BA%D0%BE%D0%B2.3429394/']*Клик*[/URL][/CENTER]<br>" +
        "[CENTER] [/CENTER]<br>" +
		'[Color=#ff0000][CENTER]Отказано, закрыто.[/CENTER][/color]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
	{
	  title: 'Нету /time',
	  content:
        '[CENTER][B][COLOR=rgb(255, 255, 0)][SIZE=3]Доброго времени суток, {{ user.mention }}.[/SIZE][/COLOR]<br><br>' +
        "[CENTER] [/CENTER]<br>" +
		"[CENTER]На ваших доказательствах отсутствует [COLOR=#ffff00]/time[/COLOR].[/CENTER]<br>" +
		'[Color=#ff0000][CENTER]Отказано, закрыто.[/CENTER][/color]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
	},
    {
      title: 'Жалоба на рассмотрении',
      content:
		'[CENTER][B][COLOR=rgb(255, 255, 0)][SIZE=3]Доброго времени суток, {{ user.mention }}.[/SIZE][/COLOR]<br><br>' +
        "[CENTER]Ваша жалоба взята на [COLOR=#ff4500]рассмотрение[/COLOR].<br>Просьба ожидать ответа и не создавать дубликаты данной темы.[/CENTER]<br>" +
        "[CENTER] [/CENTER]<br>" +
		'[Color=#ff4500][CENTER]Ожидайте ответа.[/CENTER][/color]',
      prefix: PIN_PREFIX,
	  status: true,
    },
     {
      title: 'Гл.Адм',
      content:
		'[CENTER][B][COLOR=rgb(255, 255, 0)][SIZE=3]Доброго времени суток, {{ user.mention }}.[/SIZE][/COLOR]<br><br>' +
        "[CENTER]Ваша жалоба была передана [Color=#ff0000]Главной Администрации[/COLOR].<br>Просьба ожидать ответа и не создавать дубликаты данной темы.[/CENTER]<br>" +
         "[CENTER] [/CENTER]<br>" +
		'[Color=#00FF00][CENTER][COLOR=#ff4500]Ожидайте ответа.[/COLOR][/CENTER][/color]',
      prefix: GA_PREFIX,
	  status: true,
    },
    {
      title: 'Тех. спецу',
      content:
		'[CENTER][B][COLOR=rgb(255, 255, 0)][SIZE=3]Доброго времени суток, {{ user.mention }}.[/SIZE][/COLOR]<br><br>' +
        "[CENTER]Ваша жалоба была передана на рассмотрение [COLOR=#0000ff] Техническому Специалисту.[/color][/CENTER]<br>" +
        "[CENTER] [/CENTER]<br>" +
		'[Color=Flame][CENTER][COLOR=#ff4500]Ожидайте ответа.[/COLOR][/CENTER][/color]',
      prefix: TEX_PREFIX,
	  status: true,
    },
     {
 title: 'ГКФ/ЗГКФ',
      content:
		'[CENTER][B][COLOR=rgb(255, 255, 0)][SIZE=3]Доброго времени суток, {{ user.mention }}.[/SIZE][/COLOR]<br><br>' +
        "[CENTER]Ваша жалоба взята на [COLOR=#ff4500]рассмотрение[/COLOR] [COLOR=#ff0000]Главному Куратору форума/Заместителю Главного Куратора форума[/COLOR].<br>Просьба ожидать ответа и не создавать дубликаты данной А.[/CENTER]<br>" +
		'[Color=#ff4500][CENTER]Ожидайте ответа.[/CENTER][/color]'+
        "[CENTER][size=1][ISPOILER]@Dima_Bills, @Amir_Shafigullin. [/ISPOILER][/size][/CENTER]<br>" ,
      prefix: PIN_PREFIX,
	  status: true,
    },
     {
 title: 'ГС ГОСС',
      content:
		'[CENTER][B][COLOR=rgb(255, 255, 0)][SIZE=3]Доброго времени суток, {{ user.mention }}.[/SIZE][/COLOR]<br><br>' +
        "[CENTER]Ваша жалоба взята на [COLOR=#ff4500]рассмотрение[/COLOR] [COLOR=#ff0000]ГС ГОСС[/COLOR].<br>Просьба ожидать ответа и не создавать дубликаты данной темы.[/CENTER]<br>" +
		'[Color=#ff4500][CENTER]Ожидайте ответа.[/CENTER][/color]' +
        "[CENTER][ISPOILER]@Ayaz_Bagirzade[/ISPOILER][/CENTER]<br>" ,
      prefix: PIN_PREFIX,
	  status: true,
    },
     {
 title: 'на рассмотрение себе',
      content:
		'[CENTER][B][COLOR=rgb(255, 255, 0)][SIZE=3]Доброго времени суток, {{ user.mention }}.[/SIZE][/COLOR]<br><br>' +
        "[CENTER]Ваша жалоба взята на [COLOR=#ff4500]Рассмотрение[/COLOR].<br>Просьба ожидать ответа и не создавать дубликаты данной темы.[/CENTER]<br>" +
        "[CENTER] [/CENTER]<br>" +
		'[Color=#ff4500][CENTER]Ожидайте ответа.[/CENTER][/color]',
      prefix: PIN_PREFIX,
	  status: true,
    },
     {
      title: 'Уход от РП',
      content:
		'[CENTER][B][COLOR=rgb(255, 255, 0)][SIZE=3]Доброго времени суток, {{ user.mention }}.[/SIZE][/COLOR]<br><br>' +
        "[CENTER]Игрок будет[COLOR=#ff0000] наказан [/COLOR]по данному пункту правил:<br>2.02 Запрещено целенаправленно уходить от Role Play процесса всеразличными способами [Color=#ff0000]| Jail 30 минут / Warn[/COLOR] <br>[Color=#ff0000]Примечание:[/COLOR] например, уходить в AFK при остановке транспортного средства правоохранительными органами, выходить из игры для избежания смерти, выходить из игры во время процесса задержания / ареста, полное игнорирование отыгровок другого игрока, которые так или иначе могут коснутся Вашего персонажа и так далее<br>.[/CENTER]<br>" +
         "[CENTER] [/CENTER]<br>" +
		'[Color=#00FF00][CENTER]Одобрено, закрыто.[/CENTER][/color]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Политика',
      content:
		'[CENTER][COLOR=rgb(255, 255, 0)][SIZE=3]Доброго времени суток, {{ user.mention }}.[/SIZE][/COLOR]<br><br>' +
        "[CENTER]Игрок будет[COLOR=#ff0000] наказан [/COLOR]по данному пункту правил:<br>3.18. Запрещено политическое и религиозное пропагандирование [Color=#ff0000]| Mute 120 минут / Ban 10 дней[/COLOR][/CENTER]<br>" +
        "[CENTER] [/CENTER]<br>" +
		'[Color=#00FF00][CENTER]Одобрено, закрыто.[/CENTER][/color]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
title: 'Док-ва в соц. сетях',
      content:
        '[CENTER][COLOR=rgb(255, 255, 0)][SIZE=3]Доброго времени суток, {{ user.mention }}.[/SIZE][/COLOR]<br><br>' +
        "Доказательства в социальных сетях и т.д. не принимаются. Загрузите доказательства на фото-видео хостинги YouTube,Imgur, Yapx и так далее.<br><br>" +
        "Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.<br><br>" +
        "[CENTER] [/CENTER]<br>" +
        '[COLOR=rgb(255, 0, 0)]Отказано.[/COLOR][/CENTER]',
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
title: 'Доква отредактированы',
      content:
		'[CENTER][COLOR=rgb(255, 255, 0)][SIZE=3]Доброго времени суток, {{ user.mention }}.[/SIZE][/COLOR]<br><br>' +
        "[CENTER]Ваши доказательства отредактированы. Создайте жалобу с первоначальными доказательствами.[/CENTER]" +
        "[CENTER] [/CENTER]<br>" +
		'[Color=Red][CENTER]Отказано, закрыто.[/CENTER][/color]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'охранник казик',
      content:
		'[CENTER][B][COLOR=rgb(255, 255, 0)][SIZE=3]Доброго времени суток, {{ user.mention }}.[/SIZE][/COLOR]<br><br>' +
        "[CENTER]Игрок будет[COLOR=#ff0000] наказан [/COLOR]по данному пункту правил:<br>2.03. Охраннику казино запрещено выгонять игрока без причины [Color=#ff0000]| Увольнение с должности | Jail 30 минут[/COLOR].[/CENTER]<br>" +
        "[CENTER] [/CENTER]<br>" +
		'[Color=#00FF00][CENTER]Одобрено, закрыто.[/CENTER][/color]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
	  title: 'Жалоба на госс сотрудников',
	  content:
        '[CENTER][B][COLOR=rgb(255, 255, 0)][SIZE=3]Доброго времени суток, {{ user.mention }}.[/SIZE][/COLOR]<br><br>' +
		"[CENTER]Вы ошиблись разделом, обратитесь в раздел жалоб на сотрудников[COLOR=#ffff00] фракции[/COLOR].[/CENTER]<br>" +
        "[CENTER] [/CENTER]<br>" +
        "[CENTER]Правительство - [URL='https://forum.blackrussia.online/index.php?forums/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D1%82%D0%B5%D0%BB%D1%8C%D1%81%D1%82%D0%B2%D0%BE.179/']*Клик*[/URL][/CENTER]<br>" +
        "[CENTER]ФСБ - [URL='https://forum.blackrussia.online/index.php?forums/%D0%A4%D0%A1%D0%91.180/']*Клик*[/URL][/CENTER]<br>" +
        "[CENTER]ГИБДД - [URL='https://forum.blackrussia.online/index.php?forums/%D0%93%D0%98%D0%91%D0%94%D0%94.181/']*Клик*[/URL][/CENTER]<br>" +
        "[CENTER]УМВД - [URL='https://forum.blackrussia.online/index.php?forums/%D0%A3%D0%9C%D0%92%D0%94.182/']*Клик*[/URL][/CENTER]<br>" +
        "[CENTER]Армия - [URL='https://forum.blackrussia.online/index.php?forums/%D0%90%D1%80%D0%BC%D0%B8%D1%8F.183/']*Клик*[/URL][/CENTER]<br>" +
        "[CENTER]Больница - [URL='https://forum.blackrussia.online/index.php?forums/%D0%91%D0%BE%D0%BB%D1%8C%D0%BD%D0%B8%D1%86%D0%B0.184/']*Клик*[/URL][/CENTER]<br>" +
        "[CENTER]СМИ - [URL='https://forum.blackrussia.online/index.php?forums/%D0%A1%D0%9C%D0%98.185/']*Клик*[/URL][/CENTER]<br>" +
        "[CENTER]ФСИН - [URL='https://forum.blackrussia.online/index.php?forums/%D0%A4%D0%A1%D0%98%D0%9D.744/']*Клик*[/URL][/CENTER]<br>" +
        "[CENTER] [/CENTER]<br>" +
        "[CENTER]                                                      [size=1][ISPOILER]By: Dima_Bills[/ISPOILER][/size][/CENTER]<br>" +
		'[Color=#ff0000][CENTER]Отказано, закрыто.[/CENTER][/color]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
	},
     {
      title: 'форма госс в каз/б/у',
      content:
		'[CENTER][B][COLOR=rgb(255, 255, 0)][SIZE=3]Доброго времени суток, {{ user.mention }}.[/SIZE][/COLOR]<br><br>' +
        "[CENTER]Игрок будет[COLOR=#ff0000] наказан [/COLOR]по данному пункту правил:<br>1.13. Запрещено находиться в форме внутри казино, участвовать в битве за контейнеры, участвовать в захвате семейного контейнера, находится на Б/У рынке с целью покупки / продажи авто, а также устраиваться на сторонние работы в форме фракции [Color=#ff0000] | Jail 30 минут[/COLOR].[/CENTER]<br>" +
        "[CENTER] [/CENTER]<br>" +
		'[Color=#00FF00][CENTER]Одобрено, закрыто.[/CENTER][/color]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
	  title: 'Нету доков',
	  content:
        '[CENTER][B][COLOR=rgb(255, 255, 0)][SIZE=3]Доброго времени суток, {{ user.mention }}.[/SIZE][/COLOR]<br><br>' +
		"[CENTER]В вашей жалобе отсутствуют доказательства.[/CENTER]<br>" +
        "[CENTER]Создайте новую жалобу с доказательствами.[/CENTER]<br>" +
        "[CENTER] [/CENTER]<br>" +
		'[Color=#ff0000][CENTER]Отказано, закрыто.[/CENTER][/color]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
	},
    {
	  title: 'Не работают доки',
	  content:
        '[CENTER][B][COLOR=rgb(255, 255, 0)][SIZE=3]Доброго времени суток, {{ user.mention }}.[/SIZE][/COLOR]<br><br>' +
		"[CENTER]У вас не работают доказательства.[/CENTER]<br>" +
        "[CENTER]Создайте новую жалобу с рабочими доказательствами.[/CENTER]<br>" +
        "[CENTER] [/CENTER]<br>" +
		'[Color=#ff0000][CENTER]Отказано, закрыто.[/CENTER][/color]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
	},
   {
	  title: 'жалоба от 3 лица',
	  content:
        '[CENTER][B][COLOR=rgb(255, 255, 0)][SIZE=3]Доброго времени суток, {{ user.mention }}.[/SIZE][/COLOR]<br><br>' +
		"[CENTER]Ваша жалоба будет отказана.[/CENTER]<br>" +
        "[CENTER]3.3. Жалоба от третьего лица не принимается (жалоба должна быть подана участником ситуации).[/CENTER]<br>" +
        "[CENTER] [/CENTER]<br>" +
		'[Color=#ff0000][CENTER]Отказано.[/CENTER][/color]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
	 },
    {
	  title: 'более 3 суток',
	  content:
        '[CENTER][B][COLOR=rgb(255, 255, 0)][SIZE=3]Доброго времени суток, {{ user.mention }}.[/SIZE][/COLOR]<br><br>' +
		"[CENTER]3.1. Срок написания жалобы составляет три дня (72 часа) с момента совершенного нарушения со стороны игрока сервера.[/CENTER]<br>" +
        "[CENTER] [/CENTER]<br>" +
		'[Color=#ff0000][CENTER]Отказано.[/CENTER][/color]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
	},
    {
	  title: 'название темы',
	  content:
        '[CENTER][B][COLOR=rgb(255, 255, 0)][SIZE=3]Доброго времени суток, {{ user.mention }}.[/SIZE][/COLOR]<br><br>' +
		"[CENTER][Color=#ff0000]1.2.[/color] В названии темы необходимо указать никнейм игрока, на которого подается жалоба, и суть жалобы.[/CENTER]<br>" +
        "[CENTER][Color=#ff0000]Пример:[/color] Bruce_Banner | nRP Drive[/CENTER]<br>" +
        "[CENTER] [/CENTER]<br>" +
		'[Color=#ff0000][CENTER]Отказано.[/CENTER][/color]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
	 },
      {
	  title: 'неадекватное поведение в жалобе',
	  content:
        '[CENTER][B][COLOR=rgb(255, 255, 0)][SIZE=3]Доброго времени суток, {{ user.mention }}.[/SIZE][/COLOR]<br><br>' +
        "[CENTER]Ваша жалоба будет отказана, по пункту из правил подачи жалобы[/CENTER]<br>" +
		"[CENTER][Color=#ff0000]2.3.[/color] Неадекватное поведение.[/CENTER]<br>" +
        "[CENTER] [/CENTER]<br>" +
		'[Color=#ff0000][CENTER]Отказано.[/CENTER][/color]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
	 },
     {
	  title: 'матерная брань в жалобе',
	  content:
        '[CENTER][B][COLOR=rgb(255, 255, 0)][SIZE=3]Доброго времени суток, {{ user.mention }}.[/SIZE][/COLOR]<br><br>' +
        "[CENTER]В вашей жалобе присутствует матерная брань.[/CENTER]<br>" +
        "[CENTER] [/CENTER]<br>" +
		'[Color=#ff0000][CENTER]Отказано[/CENTER][/color]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
	 },
    {
      title: 'Редакт не по ПРО',
      content:
		'[CENTER][B][COLOR=rgb(255, 255, 0)][SIZE=3]Доброго времени суток, {{ user.mention }}.[/SIZE][/COLOR]<br><br>' +
        "[CENTER]Игрок будет[COLOR=#ff0000] наказан [/COLOR]по данному пункту правил:<br>4.01. Запрещено редактирование объявлений, не соответствующих ПРО[COLOR=#ff0000] | Mute 30 минут.[/COLOR][/CENTER]<br>" +
        "[CENTER] [/CENTER]<br>" +
		'[Color=#00FF00][CENTER]Одобрено, закрыто.[/CENTER][/color]',
      prefix: ACCEPT_PREFIX,
	  status: false,
     },
    {
	  title: 'закрыт доступ к докам',
	  content:
        '[CENTER][B][COLOR=rgb(255, 255, 0)][SIZE=3]Доброго времени суток, {{ user.mention }}.[/SIZE][/COLOR]<br><br>' +
		"[CENTER]Доступ к вашим доказательствам закрыт.[/CENTER]<br>" +
        "[CENTER]Пересоздайте жалобу с открытыми доказательствами.[/CENTER]<br>" +
        "[CENTER] [/CENTER]<br>" +
		'[Color=#ff0000][CENTER]Отказано.[/CENTER][/color]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
	 },
    {
      title: 'ввод в заблуждение игроков',
      content:
		'[CENTER][B][COLOR=rgb(255, 255, 0)][SIZE=3]Доброго времени суток, {{ user.mention }}.[/SIZE][/COLOR]<br><br>' +
        "[CENTER]Игрок будет[COLOR=#ff0000] наказан [/COLOR]по данному пункту правил:<br>3.11. Запрещено введение игроков проекта в заблуждение путем злоупотребления командами[COLOR=#ff0000] | Ban 15 - 30 дней / PermBan.[/COLOR][/CENTER]<br>" +
        "[CENTER][Color=#ff0000]Примечание:[/color] /me чтобы поднять кошелек введите /pay 228 5000. Для продажи автомобиля введите /sellmycar id 2828 (счёт в банке) цена. [/CENTER]<br>" +
        "[CENTER] [/CENTER]<br>" +
		'[Color=#00FF00][CENTER]Одобрено, закрыто.[/CENTER][/color]',
      prefix: ACCEPT_PREFIX,
	  status: false,
     },
    {
      title: 'угроза наказанием от адм',
      content:
		'[CENTER][B][COLOR=rgb(255, 255, 0)][SIZE=3]Доброго времени суток, {{ user.mention }}.[/SIZE][/COLOR]<br><br>' +
        "[CENTER]Игрок будет[COLOR=#ff0000] наказан [/COLOR]по данному пункту правил:<br>3.09. Запрещены любые угрозы о наказании игрока со стороны администрации[COLOR=#ff0000] | Mute 30 минут[/COLOR][/CENTER]<br>" +
        "[CENTER] [/CENTER]<br>" +
		'[Color=#00FF00][CENTER]Одобрено, закрыто.[/CENTER][/color]',
      prefix: ACCEPT_PREFIX,
	  status: false,
     },
     {
      title: 'NonRP Поведение у сотрудника УМВД',
      content:
		'[CENTER][B][COLOR=rgb(255, 255, 0)][SIZE=3]Доброго времени суток, {{ user.mention }}.[/SIZE][/COLOR]<br><br>' +
        "[CENTER]Игрок будет[COLOR=#ff0000] наказан [/COLOR]по данному пункту правил:<br>6.03. Запрещено nRP поведение [Color=#ff0000]| Warn[/COLOR].[/CENTER]<br>" +
        "[CENTER]Примечание: поведение, не соответствующее сотруднику УМВД. [/CENTER]<br>" +
        "[CENTER]Пример: [/CENTER]<br>" +
        "[CENTER]- открытие огня по игрокам без причины, [/CENTER]<br>" +
        "[CENTER]- расстрел машин без причины, [/CENTER]<br>" +
        "[CENTER]- нарушение ПДД без причины, [/CENTER]<br>" +
        "[CENTER]- сотрудник на служебном транспорте кричит о наборе в свою семью на спавне. [/CENTER]<br>" +
        "[CENTER] [/CENTER]<br>" +
		'[Color=#00FF00][CENTER]Одобрено, закрыто.[/CENTER][/color]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
     {
      title: 'арест в инте (аук, каз)',
      content:
		'[CENTER][B][COLOR=rgb(255, 255, 0)][SIZE=3]Доброго времени суток, {{ user.mention }}.[/SIZE][/COLOR]<br><br>' +
        "[CENTER]Игрок будет[COLOR=#ff0000] наказан [/COLOR]по данному пункту правил:<br>2.50. Запрещены задержания, аресты, а также любые действия со стороны игроков, состоящих во фракциях в интерьере аукциона, казино, а также во время системных мероприятий [Color=#ff0000]| Ban 7 - 15 дней + увольнение из организации[/COLOR].[/CENTER]<br>" +
        "[CENTER] [/CENTER]<br>" +
		'[Color=#00FF00][CENTER]Одобрено, закрыто.[/CENTER][/color]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
     {
      title: 'розыск без рп причины',
      content:
		'[CENTER][B][COLOR=rgb(255, 255, 0)][SIZE=3]Доброго времени суток, {{ user.mention }}.[/SIZE][/COLOR]<br><br>' +
        "[CENTER]Игрок будет[COLOR=#ff0000] наказан [/COLOR]по данному пункту правил:<br>6.02. Запрещено выдавать розыск без Role Play причины [Color=#ff0000]| Warn[/COLOR].[/CENTER]<br>" +
        "[CENTER] [/CENTER]<br>" +
		'[Color=#00FF00][CENTER]Одобрено, закрыто.[/CENTER][/color]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
      {
      title: 'забрали права (во время погони)',
      content:
		'[CENTER][B][COLOR=rgb(255, 255, 0)][SIZE=3]Доброго времени суток, {{ user.mention }}.[/SIZE][/COLOR]<br><br>' +
        "[CENTER]Игрок будет[COLOR=#ff0000] наказан [/COLOR]по данному пункту правил:<br>7.04. Запрещено отбирать водительские права во время погони за нарушителем [Color=#ff0000]| Warn[/COLOR].[/CENTER]<br>" +
        "[CENTER] [/CENTER]<br>" +
		'[Color=#00FF00][CENTER]Одобрено, закрыто.[/CENTER][/color]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
     {
      title: 'подделка ника',
      content:
		'[CENTER][B][COLOR=rgb(255, 255, 0)][SIZE=3]Доброго времени суток, {{ user.mention }}.[/SIZE][/COLOR]<br><br>' +
        "[CENTER]Игрок будет[COLOR=#ff0000] наказан [/COLOR]по данному пункту правил:<br>4.10. Запрещено создавать никнейм, повторяющий или похожий на существующие никнеймы игроков или администраторов по их написанию[COLOR=#ff0000] | Устное замечание + смена игрового никнейма / PermBan[/COLOR][/CENTER]<br>" +
        "[CENTER] [/CENTER]<br>" +
		'[Color=#00FF00][CENTER]Одобрено, закрыто.[/CENTER][/color]',
      prefix: ACCEPT_PREFIX,
	  status: false,
     },
     {
      title: 'NRP аксессуар',
      content:
		'[CENTER][B][COLOR=rgb(255, 255, 0)][SIZE=3]Доброго времени суток, {{ user.mention }}.[/SIZE][/COLOR]<br><br>' +
        "[CENTER]Игрок будет[COLOR=#ff0000] наказан [/COLOR]по данному пункту правил:<br>2.52. Запрещено располагать аксессуары на теле персонажа, нарушая нормы морали и этики, увеличивать аксессуары до слишком большого размера[COLOR=#ff0000] | При первом нарушении - обнуление аксессуаров, при повторном нарушении - обнуление аксессуаров + JAIL 30 минут[/COLOR][/CENTER]<br>" +
        "[CENTER] [/CENTER]<br>" +
		'[Color=#00FF00][CENTER]Одобрено, закрыто.[/CENTER][/color]',
      prefix: ACCEPT_PREFIX,
	  status: false,
     },
       {
      title: 'аморальные действия',
      content:
		'[CENTER][B][COLOR=rgb(255, 255, 0)][SIZE=3]Доброго времени суток, {{ user.mention }}.[/SIZE][/COLOR]<br><br>' +
        "[CENTER]Игрок будет[COLOR=#ff0000] наказан [/COLOR]по данному пункту правил:<br>2.08. Запрещена любая форма аморальных действий сексуального характера в сторону игроков[COLOR=#ff0000] | Jail 30 минут / Warn[/COLOR][/CENTER]<br>" +
        "[CENTER] [/CENTER]<br>" +
		'[Color=#00FF00][CENTER]Одобрено, закрыто.[/CENTER][/color]',
      prefix: ACCEPT_PREFIX,
	  status: false,
     },
    {
      title: 'редактированиче в лч',
      content:
		'[CENTER][B][COLOR=rgb(255, 255, 0)][SIZE=3]Доброго времени суток, {{ user.mention }}.[/SIZE][/COLOR]<br><br>' +
        "[CENTER]Игрок будет[COLOR=#ff0000] наказан [/COLOR]по данному пункту правил:<br>4.04. Запрещено редактировать поданные объявления в личных целях заменяя текст объявления на несоответствующий отправленному игроком[COLOR=#ff0000] | Ban 7 дней + ЧС организации[/COLOR][/CENTER]<br>" +
        "[CENTER] [/CENTER]<br>" +
		'[Color=#00FF00][CENTER]Одобрено, закрыто.[/CENTER][/color]',
      prefix: ACCEPT_PREFIX,
	  status: false,
     },
    {
      title: 'фейк ник игрока',
      content:
		'[CENTER][B][COLOR=rgb(255, 255, 0)][SIZE=3]Доброго времени суток, {{ user.mention }}.[/SIZE][/COLOR]<br><br>' +
        "[CENTER]Игрок будет[COLOR=#ff0000] наказан [/COLOR]по данному пункту правил:<br>4.10. Запрещено создавать никнейм, повторяющий или похожий на существующие никнеймы игроков или администраторов по их написанию[COLOR=#ff0000] | Устное замечание + смена игрового никнейма / PermBan[/COLOR][/CENTER]<br>" +
        "[CENTER] [/CENTER]<br>" +
		'[Color=#00FF00][CENTER]Одобрено, закрыто.[/CENTER][/color]',
      prefix: ACCEPT_PREFIX,
	  status: false,
     },
    {
	  title: 'жалоба с другого серва',
	  content:
        '[CENTER][B][COLOR=rgb(255, 255, 0)][SIZE=3]Доброго времени суток, {{ user.mention }}.[/SIZE][/COLOR]<br><br>' +
		"[CENTER]Вы ошиблись разделом сервера, обратитесь в раздел жалоб своего сервера.[/CENTER]<br>" +
        "[CENTER] [/CENTER]<br>" +
        "[CENTER]Red - [URL='https://forum.blackrussia.online/index.php?forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B8%D0%B3%D1%80%D0%BE%D0%BA%D0%BE%D0%B2.88/']*Клик*[/URL][/CENTER]<br>" +
        "[CENTER]Green - [URL='https://forum.blackrussia.online/index.php?forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B8%D0%B3%D1%80%D0%BE%D0%BA%D0%BE%D0%B2.119/']*Клик*[/URL][/CENTER]<br>" +
        "[CENTER]Blue - [URL='https://forum.blackrussia.online/index.php?forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B8%D0%B3%D1%80%D0%BE%D0%BA%D0%BE%D0%B2.156/']*Клик*[/URL][/CENTER]<br>" +
        "[CENTER]Orange - [URL='https://forum.blackrussia.online/index.php?forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B8%D0%B3%D1%80%D0%BE%D0%BA%D0%BE%D0%B2.273/']*Клик*[/URL][/CENTER]<br>" +
        "[CENTER]Purple - [URL='https://forum.blackrussia.online/index.php?forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B8%D0%B3%D1%80%D0%BE%D0%BA%D0%BE%D0%B2.312/']*Клик*[/URL][/CENTER]<br>" +
        "[CENTER]Lime - [URL='https://forum.blackrussia.online/index.php?forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B8%D0%B3%D1%80%D0%BE%D0%BA%D0%BE%D0%B2.352/']*Клик*[/URL][/CENTER]<br>" +
        "[CENTER]Pink - [URL='https://forum.blackrussia.online/index.php?forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B8%D0%B3%D1%80%D0%BE%D0%BA%D0%BE%D0%B2.394/']*Клик*[/URL][/CENTER]<br>" +
        "[CENTER]Cherry - [URL='https://forum.blackrussia.online/index.php?forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B8%D0%B3%D1%80%D0%BE%D0%BA%D0%BE%D0%B2.435/']*Клик*[/URL][/CENTER]<br>" +
        "[CENTER]Black - [URL='https://forum.blackrussia.online/index.php?forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B8%D0%B3%D1%80%D0%BE%D0%BA%D0%BE%D0%B2.470/']*Клик*[/URL][/CENTER]<br>" +
        "[CENTER]Indigo - [URL='https://forum.blackrussia.online/index.php?forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B8%D0%B3%D1%80%D0%BE%D0%BA%D0%BE%D0%B2.519/']*Клик*[/URL][/CENTER]<br>" +
        "[CENTER]White - [URL='https://forum.blackrussia.online/index.php?forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B8%D0%B3%D1%80%D0%BE%D0%BA%D0%BE%D0%B2.560/']*Клик*[/URL][/CENTER]<br>" +
        "[CENTER]Magenta - [URL='https://forum.blackrussia.online/index.php?forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B8%D0%B3%D1%80%D0%BE%D0%BA%D0%BE%D0%B2.599/']*Клик*[/URL][/CENTER]<br>" +
        "[CENTER]Crimson - [URL='https://forum.blackrussia.online/index.php?forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B8%D0%B3%D1%80%D0%BE%D0%BA%D0%BE%D0%B2.640/']*Клик*[/URL][/CENTER]<br>" +
        "[CENTER]Gold - [URL='https://forum.blackrussia.online/index.php?forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B8%D0%B3%D1%80%D0%BE%D0%BA%D0%BE%D0%B2.682/']*Клик*[/URL][/CENTER]<br>" +
        "[CENTER]Azure - [URL='https://forum.blackrussia.online/index.php?forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B8%D0%B3%D1%80%D0%BE%D0%BA%D0%BE%D0%B2.723/']*Клик*[/URL][/CENTER]<br>" +
        "[CENTER]Platinum - [URL='https://forum.blackrussia.online/index.php?forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B8%D0%B3%D1%80%D0%BE%D0%BA%D0%BE%D0%B2.785/']*Клик*[/URL][/CENTER]<br>" +
        "[CENTER]Aqua - [URL='https://forum.blackrussia.online/index.php?forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B8%D0%B3%D1%80%D0%BE%D0%BA%D0%BE%D0%B2.844/']*Клик*[/URL][/CENTER]<br>" +
        "[CENTER]Gray - [URL='https://forum.blackrussia.online/index.php?forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B8%D0%B3%D1%80%D0%BE%D0%BA%D0%BE%D0%B2.885/']*Клик*[/URL][/CENTER]<br>" +
        "[CENTER]ICE - [URL='https://forum.blackrussia.online/index.php?forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B8%D0%B3%D1%80%D0%BE%D0%BA%D0%BE%D0%B2.954/']*Клик*[/URL][/CENTER]<br>" +
        "[CENTER]Chilli - [URL='https://forum.blackrussia.online/index.php?forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B8%D0%B3%D1%80%D0%BE%D0%BA%D0%BE%D0%B2.994/']*Клик*[/URL][/CENTER]<br>" +
        "[CENTER]Choco - [URL='https://forum.blackrussia.online/index.php?forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B8%D0%B3%D1%80%D0%BE%D0%BA%D0%BE%D0%B2.1036/']*Клик*[/URL][/CENTER]<br>" +
        "[CENTER]Moscow - [URL='https://forum.blackrussia.online/index.php?forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B8%D0%B3%D1%80%D0%BE%D0%BA%D0%BE%D0%B2.1082/']*Клик*[/URL][/CENTER]<br>" +
        "[CENTER]SPB - [URL='https://forum.blackrussia.online/index.php?forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B8%D0%B3%D1%80%D0%BE%D0%BA%D0%BE%D0%B2.1124/']*Клик*[/URL][/CENTER]<br>" +
        "[CENTER]UFA - [URL='https://forum.blackrussia.online/index.php?forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B8%D0%B3%D1%80%D0%BE%D0%BA%D0%BE%D0%B2.1167/']*Клик*[/URL][/CENTER]<br>" +
        "[CENTER]Sochi - [URL='https://forum.blackrussia.online/index.php?forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B8%D0%B3%D1%80%D0%BE%D0%BA%D0%BE%D0%B2.1234/']*Клик*[/URL][/CENTER]<br>" +
        "[CENTER]Kazan - [URL='https://forum.blackrussia.online/index.php?forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B8%D0%B3%D1%80%D0%BE%D0%BA%D0%BE%D0%B2.1276/']*Клик*[/URL][/CENTER]<br>" +
        "[CENTER]Samara - [URL='https://forum.blackrussia.online/index.php?forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B8%D0%B3%D1%80%D0%BE%D0%BA%D0%BE%D0%B2.1320/']*Клик*[/URL][/CENTER]<br>" +
        "[CENTER]Rostov - [URL='https://forum.blackrussia.online/index.php?forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B8%D0%B3%D1%80%D0%BE%D0%BA%D0%BE%D0%B2.1362/']*Клик*[/URL][/CENTER]<br>" +
        "[CENTER]Anapa - [URL='https://forum.blackrussia.online/index.php?forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B8%D0%B3%D1%80%D0%BE%D0%BA%D0%BE%D0%B2.1402/']*Клик*[/URL][/CENTER]<br>" +
        "[CENTER]EKB - [URL='https://forum.blackrussia.online/index.php?forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B8%D0%B3%D1%80%D0%BE%D0%BA%D0%BE%D0%B2.1444/']*Клик*[/URL][/CENTER]<br>" +
        "[CENTER]Krasnodar - [URL='https://forum.blackrussia.online/index.php?forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B8%D0%B3%D1%80%D0%BE%D0%BA%D0%BE%D0%B2.1488/']*Клик*[/URL][/CENTER]<br>" +
        "[CENTER]Arzamas - [URL='https://forum.blackrussia.online/index.php?forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B8%D0%B3%D1%80%D0%BE%D0%BA%D0%BE%D0%B2.1531/']*Клик*[/URL][/CENTER]<br>" +
        "[CENTER]Novosibirsk - [URL='https://forum.blackrussia.online/index.php?forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B8%D0%B3%D1%80%D0%BE%D0%BA%D0%BE%D0%B2.1572/']*Клик*[/URL][/CENTER]<br>" +
        "[CENTER]Grozny - [URL='https://forum.blackrussia.online/index.php?forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B8%D0%B3%D1%80%D0%BE%D0%BA%D0%BE%D0%B2.1614/']*Клик*[/URL][/CENTER]<br>" +
        "[CENTER]Saratov - [URL='https://forum.blackrussia.online/index.php?forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B8%D0%B3%D1%80%D0%BE%D0%BA%D0%BE%D0%B2.1656/']*Клик*[/URL][/CENTER]<br>" +
        "[CENTER]Omsk - [URL='https://forum.blackrussia.online/index.php?forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B8%D0%B3%D1%80%D0%BE%D0%BA%D0%BE%D0%B2.1698/']*Клик*[/URL][/CENTER]<br>" +
        "[CENTER]Irkutsk - [URL='https://forum.blackrussia.online/index.php?forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B8%D0%B3%D1%80%D0%BE%D0%BA%D0%BE%D0%B2.1740/']*Клик*[/URL][/CENTER]<br>" +
        "[CENTER] [/CENTER]<br>" +
        "[CENTER]                                                      [size=1][ISPOILER]By: Dima_Bills[/ISPOILER][/size][/CENTER]<br>" +
		'[Color=#ff0000][CENTER]Закрыто.[/CENTER][/color]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
	 },
     {
	  title: 'дал в долг',
	  content:
        '[CENTER][B][COLOR=rgb(255, 255, 0)][SIZE=3]Доброго времени суток, {{ user.mention }}.[/SIZE][/COLOR]<br><br>' +
		"[CENTER]Долг - РП Процесс и администрация не несёт никакой ответственности за него.[/CENTER]<br>" +
        "[CENTER] [/CENTER]<br>" +
		'[Color=#ff0000][CENTER]Отказано, закрыто.[/CENTER][/color]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
	 },
     {
      title: 'слив склада',
      content:
		'[CENTER][B][COLOR=rgb(255, 255, 0)][SIZE=3]Доброго времени суток, {{ user.mention }}.[/COLOR]<br><br>' +
        "[CENTER]Игрок будет[COLOR=#ff0000] наказан [/COLOR]по данному пункту правил:<br>2.09. Запрещено сливать склад фракции / семьи путем взятия большого количестве ресурсов, или же брать больше, чем разрешили на самом деле[COLOR=#ff0000] | Ban 15 - 30 дней / PermBan[/COLOR][/CENTER]<br>" +
        "[CENTER] [/CENTER]<br>" +
		'[Color=#00FF00][CENTER]Одобрено, закрыто.[/CENTER][/color]',
      prefix: ACCEPT_PREFIX,
	  status: false,
     },
    {
      title: 'нрп вч',
      content:
		'[CENTER][B][COLOR=rgb(255, 255, 0)][SIZE=3]Доброго времени суток, {{ user.mention }}.[/COLOR]<br><br>' +
        "[CENTER]Игрок будет[COLOR=#ff0000] наказан [/COLOR]по данному пункту правил:<br> За нарушение правил нападения на Войсковую Часть выдаётся предупреждение[COLOR=#ff0000] | Jail 30 минут (NonRP нападение) / Warn (Для сотрудников ОПГ)[/COLOR][/CENTER]<br>" +
        "[CENTER] [/CENTER]<br>" +
		'[Color=#00FF00][CENTER]Одобрено, закрыто.[/CENTER][/color]',
      prefix: ACCEPT_PREFIX,
	  status: false,
     },
     {
      title: 'Покупка/Продажа ИВ',
      content:
		'[CENTER][B][COLOR=rgb(255, 255, 0)][SIZE=3]Доброго времени суток, {{ user.mention }}.[/COLOR]<br><br>' +
        "[CENTER]Игрок будет[COLOR=#ff0000] наказан [/COLOR]по данному пункту правил:<br>2.28 Запрещена покупка/продажа внутриигровой валюты в любых ее проявлениях за реальные деньги[COLOR=#ff0000] | PermBan с обнулением аккаунта + ЧС проекта[/COLOR][/CENTER]<br>" +
        "[CENTER] [/CENTER]<br>" +
		'[Color=#00FF00][CENTER]Одобрено, закрыто.[/CENTER][/color]',
      prefix: ACCEPT_PREFIX,
	  status: false,
     },
    {
	  title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴ РП биографии ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
	},
    {
      title: 'био одобрено',
      content:
		'[CENTER][B][COLOR=rgb(255, 255, 0)][SIZE=3]Доброго времени суток, {{ user.mention }}.[/SIZE][/COLOR]<br><br>' +
        "[CENTER]Ваша РП биография получает статус: [Color=#00ff00]Одобрено.[/CENTER][/color]",
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
      {
 title: 'био на доработке',
      content:
		'[CENTER][B][COLOR=rgb(255, 255, 0)][SIZE=3]Доброго времени суток, {{ user.mention }}.[/SIZE][/COLOR]<br><br>' +
        "[CENTER]Вам даётся 24 часа на дополнение вашей РП биографии.[/CENTER]<br>" +
        "[CENTER] [/CENTER]<br>" +
		'[Color=#ff4500][CENTER]Ожидайте ответа.[/CENTER][/color]',
      prefix: PIN_PREFIX,
	  status: true,
    },
     {
           title: 'био отказ (не дополнил)',
      content:
		'[CENTER][B][COLOR=rgb(255, 255, 0)][SIZE=3]Доброго времени суток, {{ user.mention }}.[/SIZE][/COLOR]<br><br>' +
        "[CENTER]Ваша РП биография получает статус: [Color=Red]Отказано.[/color]<br>Вы не дополнили вашу Биографию.<br>[/CENTER]",
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
           title: 'био отказ (3е лицо)',
      content:
		'[CENTER][B][COLOR=rgb(255, 255, 0)][SIZE=3]Доброго времени суток, {{ user.mention }}.[/SIZE][/COLOR]<br><br>' +
        "[CENTER]Ваша РП биография получает статус: [Color=Red]Отказано.[/color]<br>Причиной отказа могло послужить создание биографии от 3го лица.<br>[/CENTER]",
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
title: 'био отказ (заголовок темы)',
      content:
		'[CENTER][B][COLOR=rgb(255, 255, 0)][SIZE=3]Доброго времени суток, {{ user.mention }}.[/SIZE][/COLOR]<br><br>' +
        "[CENTER]Ваша РП биография получает статус: [Color=Red]Отказано.[/color]<br>Причиной отказа могло послужить неправильное заполнение заголовка темы.<br>[/CENTER]",
      prefix:UNACCEPT_PREFIX,
	  status: false,
    },
     {
      title: 'био украдено',
      content:
		'[CENTER][B][COLOR=rgb(255, 255, 0)][SIZE=3]Доброго времени суток,  {{ user.mention }}.[/SIZE][/COLOR]<br><br>' +
        "[CENTER]РП биография получает статус: [Color=#ff0000]Отказано.[/color]<br>РП Биография украдена.<br>[/CENTER]",
      prefix:UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'био отказ',
      content:
		'[CENTER][B][COLOR=rgb(255, 255, 0)][SIZE=3]Доброго времени суток,  {{ user.mention }}.[/SIZE][/COLOR]<br><br>' +
        "[CENTER]Ваша РП биография получает статус: [Color=#ff0000]Отказано.[/color]<br>Причиной отказа могло послужить какое-либо нарушение из правил для составления RP Биографий.<br>[/CENTER]",
      prefix:UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'био отказ (не по форме)',
      content:
		'[CENTER][B][COLOR=rgb(255, 255, 0)][SIZE=3]Доброго времени суток,  {{ user.mention }}.[/SIZE][/COLOR]<br><br>' +
        "[CENTER]РП биография получает статус: [Color=#ff0000]Отказано.[/color]<br>Биография не по форме.<br>[/CENTER]",
      prefix:UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'био отказ (не совпадает возвраст)',
      content:
		'[CENTER][B][COLOR=rgb(255, 255, 0)][SIZE=3]Доброго времени суток,  {{ user.mention }}.[/SIZE][/COLOR]<br><br>' +
        "[CENTER]Ваша РП биография получает статус: [Color=#ff0000]Отказано.[/color]<br>Возвраст персонажа и дата рождения не совпадают.<br>[/CENTER]",
      prefix:UNACCEPT_PREFIX,
	  status: false,
    },{
      title: 'био отказ (мало инфы)',
      content:
		'[CENTER][B][COLOR=rgb(255, 255, 0)][SIZE=3]Доброго времени суток,  {{ user.mention }}.[/SIZE][/COLOR]<br><br>' +
        "[CENTER]Ваша РП биография получает статус: [Color=#ff0000]Отказано.[/color]<br>В вашей Биографии мало информации.<br>[/CENTER]",
      prefix:UNACCEPT_PREFIX,
	  status: false,
    },
     {
      title: 'био отказ (грамм ошибки)',
      content:
		'[CENTER][B][COLOR=rgb(255, 255, 0)][SIZE=3]Доброго времени суток,  {{ user.mention }}.[/SIZE][/COLOR]<br><br>' +
        "[CENTER]Ваша РП биография получает статус: [Color=#ff0000]Отказано.[/color]<br>В вашей Биографии присутствуют большое кол-во грамматических ошибок.<br>[CENTER]",
      prefix:UNACCEPT_PREFIX,
	  status: false,
    },
     {
      title: 'био отказ (меньше 18)',
      content:
		'[CENTER][B][COLOR=rgb(255, 255, 0)][SIZE=3]Доброго времени суток,  {{ user.mention }}.[/SIZE][/COLOR]<br><br>' +
        "[CENTER]Ваша РП биография получает статус: [Color=#ff0000]Отказано.[/color]<br>Вашему персонажу меньше 18-ти лет.<br>[CENTER]",
      prefix:UNACCEPT_PREFIX,
	  status: false,
    },
     {
      title: 'био отказ (нету даты рождения)',
      content:
		'[CENTER][B][COLOR=rgb(255, 255, 0)][SIZE=3]Доброго времени суток,  {{ user.mention }}.[/SIZE][/COLOR]<br><br>' +
        "[CENTER]Ваша РП биография получает статус: [Color=#ff0000]Отказано.[/color]<br>В вашей Биографии не указана Дата рождения.<br>[/CENTER]",
      prefix:UNACCEPT_PREFIX,
	  status: false,
    },
     {
      title: 'био отказ (нет места рождения)',
      content:
		'[CENTER][B][COLOR=rgb(255, 255, 0)][SIZE=3]Доброго времени суток,  {{ user.mention }}.[/SIZE][/COLOR]<br><br>' +
        "[CENTER]Ваша РП биография получает статус: [Color=#ff0000]Отказано.[/color]<br>В вашей Биографии не указано место рождения'.<br>[/CENTER]",
      prefix:UNACCEPT_PREFIX,
	  status: false,
    },
     {
      title: 'био отказ (ник на разных языках)',
      content:
		'[CENTER][B][COLOR=rgb(255, 255, 0)][SIZE=3]Доброго времени суток,  {{ user.mention }}.[/SIZE][/COLOR]<br><br>' +
        "[CENTER]Ваша РП биография получает статус: [Color=#ff0000]Отказано.[/color]<br>В названии биографии и в самой биографии Имя Фамилия указаны на разных языках.<br>[CENTER]",
      prefix:UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'нету пункта настоящее время',
      content:
		'[CENTER][B][COLOR=rgb(255, 255, 0)][SIZE=3]Доброго времени суток,  {{ user.mention }}.[/SIZE][/COLOR]<br><br>' +
        "[CENTER]Ваша РП биография получает статус: [Color=#ff0000]Отказано.[/color]<br>Нету пункта 'Настоящее время'.<br>[/CENTER]",
      prefix:UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'нету пункта юность и взрослая жизнь',
      content:
		'[CENTER][B][COLOR=rgb(255, 255, 0)][SIZE=3]Доброго времени суток,  {{ user.mention }}.[/SIZE][/COLOR]<br><br>' +
        "[CENTER]Ваша РП биография получает статус: [Color=#ff0000]Отказано.[/color]<br>Нету пункта 'Юность и взрослая жизнь'.<br>[/CENTER]",
      prefix:UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'нету пункта детство',
      content:
		'[CENTER][B][COLOR=rgb(255, 255, 0)][SIZE=3]Доброго времени суток,  {{ user.mention }}.[/SIZE][/COLOR]<br><br>' +
        "[CENTER]Ваша РП биография получает статус: [Color=#ff0000]Отказано.[/color]<br>Нету пункта 'Детство'.<br>[/CENTER]",
      prefix:UNACCEPT_PREFIX,
	  status: false,
    },
     {
      title: 'нету пункта хобби',
      content:
		'[CENTER][B][COLOR=rgb(255, 255, 0)][SIZE=3]Доброго времени суток,  {{ user.mention }}.[/SIZE][/COLOR]<br><br>' +
        "[CENTER]Ваша РП биография получает статус: [Color=#ff0000]Отказано.[/color]<br>Нету пункта 'Настоящее время'.<br>[/CENTER]",
      prefix:UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴ РП ситуации ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
      title: 'Одобрена',
      content:
        '[CENTER][B][COLOR=rgb(255, 255, 0)][SIZE=3]Доброго времени суток, {{ user.mention }}.[/COLOR]<br><br>' +
        "[Color=#00ff00]Одобрено.[/color]<br><br>",
      prefix: ACCEPT_PREFIX,
      status: false,
    },
  {
title: 'переделайте ситуацию',
      content:
		'[CENTER][B][COLOR=rgb(255, 255, 0)][SIZE=3]Доброго времени суток, {{ user.mention }}.[/COLOR]<br><br>' +
        "[CENTER]Переделайте вашу РП ситуацию, добавьте больше информации / красивого оформления.[/CENTER]",
      prefix:UNACCEPT_PREFIX,
	  status: false,
    },
     {
title: 'Не по форме',
      content:
		'[CENTER][B][COLOR=rgb(255, 255, 0)][SIZE=3]Доброго времени суток, {{ user.mention }}.[/COLOR]<br><br>' +
        "[CENTER]РП ситуация не по форме.[/CENTER]",
      prefix:UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'На доработке',
      content:
        '[CENTER][B][COLOR=rgb(255, 255, 0)][SIZE=3]Доброго времени суток, {{ user.mention }}.[/COLOR]<br><br>' +
        "В вашей РП ситуации недостаточно информации.<br><br>" +
        "Даю вам 24 часа на ее дополнение.<br><br>",
      prefix: PIN_PREFIX,
    },
     {
title: 'ошиблись разделом',
      content:
		'[CENTER][B][COLOR=rgb(255, 255, 0)][SIZE=3]Доброго времени суток, {{ user.mention }}.[/COLOR]<br><br>' +
        "[CENTER]Вы ошиблись разделом.[/CENTER]",
      prefix:UNACCEPT_PREFIX,
	  status: false,
    },
      {
title: 'счёт',
      content:
		'[CENTER][B][COLOR=rgb(255, 255, 0)][SIZE=3]Доброго времени суток, {{ user.mention }}.[/COLOR]<br><br>' +
        "[CENTER]Уберите номер банковского счёта. Деньги не выдаем.[/CENTER]",
      prefix:UNACCEPT_PREFIX,
	  status: false,
    },
  ];
$(document).ready(() => {
    // Загрузка скрипта для обработки шаблонов
    $('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');


    // Добавление кнопок при загрузке страницы
    addButton('🛑Закрыто', 'close');
    addButton('☣На рассмотрение', 'pin');
    addButton('✅Одобрено', 'accepted');
    addButton('❌Отказано', 'unaccept');
    addButton('💬Ответы', 'selectAnswer');



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

