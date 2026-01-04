// ==UserScript==
// @name        Курирующий форума
// @namespace   https://forum.blackrussia.online
// @match       https://forum.blackrussia.online/threads/*
// @license 	 MIT
// @grant       none
// @icons https://icons.iconarchive.com/icons/gartoon-team/gartoon-action/256/help-about-star-fav-icon.png
// @version     1.0
// @author      DeLuna Mods
// @description 13.09.2024, 20:47:11
// @downloadURL https://update.greasyfork.org/scripts/508536/%D0%9A%D1%83%D1%80%D0%B8%D1%80%D1%83%D1%8E%D1%89%D0%B8%D0%B9%20%D1%84%D0%BE%D1%80%D1%83%D0%BC%D0%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/508536/%D0%9A%D1%83%D1%80%D0%B8%D1%80%D1%83%D1%8E%D1%89%D0%B8%D0%B9%20%D1%84%D0%BE%D1%80%D1%83%D0%BC%D0%B0.meta.js
// ==/UserScript==

(function () {
  'use strict';
const UNACCEPT_PREFIX = 4; // Prefix that will be set when thread closes
const ACCEPT_PREFIX = 8; // Prefix that will be set when thread accepted
const RESHENO_PREFIX = 6; // Prefix that will be set when solving the problem
const PIN_PREFIX = 2; // Prefix that will be set when thread pins
const GA_PREFIX = 12; // Prefix that will be set when thread send to ga
const COMMAND_PREFIX = 10; // Prefix that will be set when thread send to project team
const WATCHED_PREFIX = 9; // The prefix that will be set when considering
const TEX_PREFIX = 13; // Prefix that will be set when thread send to tex special
const CLOSE_PREFIX = 7; // Prefix that will be set when thread closed
const buttons = [
 {
      title: '――――――――――――――――――――――――Одобрено―――――――――――――――――――――――',
	},
 {
title: 'dm',
content:'[FONT=georgia][CENTER]Доброго времени суток, уважаемый (-ая) {{ user.mention }}[/CENTER]<br>' +
        "[CENTER]Ваша жалоба одобрена, игрок понесёт наказание по следующему пункту правил:[/CENTER]<br>" +
        "[CENTER][ISPOILER][COLOR=RED]2.19.[/COLOR] Запрещен DM (DeathMatch) — убийство или нанесение урона без веской IC причины |[COLOR=RED] Jail 60 минут[/COLOR][/ISPOILER][/CENTER]<br>" +
        "[CENTER]Одобрено, закрыто.[/CENTER]<br>" +
        "[CENTER]С уважением, администратор курирующий форум Wililams_Nakajima![/CENTER]<br>" +
        "[CENTER]Спасибо за обращение. Приятной игры на BLACK RUSSIA - [color=aqua]AQUA[/color][/CENTER][/FONT]<br>" +
        "[CENTER][IMG]https://i.postimg.cc/0KfbtZ0J/IMG-4116.gif[/IMG][/CENTER]<br>",
      prefix: ACCEPT_PREFIX,
	  status: false,
title: 'mass dm',
content:
        '[FONT=georgia][CENTER]Доброго времени суток, уважаемый (-ая) {{ user.mention }}[/CENTER]<br>' +
        "[CENTER]Ваша жалоба одобрена, игрок понесёт наказание по следующему пункту правил:[/CENTER]<br>" +
        "[CENTER][ISPOILER][COLOR=RED]2.20.[/COLOR] Запрещен Mass DM (Mass DeathMatch) — убийство или нанесение урона без веской IC причины трем игрокам и более [COLOR=RED]| Warn / Ban 3 - 7 дней 60 минут[/COLOR][/ISPOILER][/CENTER]<br>" +
        "[CENTER]Одобрено, закрыто.[/CENTER]<br>" +
        "[CENTER]С уважением, администратор курирующий форум Wililams_Nakajima![/CENTER]<br>" +
        "[CENTER]Спасибо за обращение. Приятной игры на BLACK RUSSIA - [color=aqua]AQUA[/color][/CENTER][/FONT]<br>" +
        "[CENTER][IMG]https://i.postimg.cc/0KfbtZ0J/IMG-4116.gif[/IMG][/CENTER]<br>",
      prefix: ACCEPT_PREFIX,
	  status: false,
},
 {
title: 'db',
content:
        '[FONT=georgia][CENTER]Доброго времени суток, уважаемый (-ая) {{ user.mention }}[/CENTER]<br>' +
        "[CENTER]Ваша жалоба одобрена, игрок понесёт наказание по следующему пункту правил:[/CENTER]<br>" +
        "[CENTER][ISPOILER][COLOR=RED]2.13.[/COLOR] Запрещен DB (DriveBy) — намеренное убийство / нанесение урона без веской IC причины на любом виде транспорта [COLOR=RED]| Jail 60 минут[/COLOR][/ISPOILER][/CENTER]<br>" +
        "[CENTER]Одобрено, закрыто.[/CENTER]<br>" +
        "[CENTER]С уважением, администратор курирующий форум Wililams_Nakajima![/CENTER]<br>" +
        "[CENTER]Спасибо за обращение. Приятной игры на BLACK RUSSIA - [color=aqua]AQUA[/color][/CENTER][/FONT]<br>" +
        "[CENTER][IMG]https://i.postimg.cc/0KfbtZ0J/IMG-4116.gif[/IMG][/CENTER]<br>",
      prefix: ACCEPT_PREFIX,
	  status: false,
},
   {
title: 'rk',
content:
        '[FONT=georgia][CENTER]Доброго времени суток, уважаемый (-ая) {{ user.mention }}[/CENTER]<br>' +
        "[CENTER]Ваша жалоба одобрена, игрок понесёт наказание по следующему пункту правил:[/CENTER]<br>" +
        "[CENTER][ISPOILER][COLOR=RED]2.14.[/COLOR] Запрещен RK (Revenge Kill) — убийство игрока с целью мести, возвращение на место смерти в течение 15 минут, а также использование в дальнейшем информации, которая привела Вас к смерти [COLOR=RED]| Jail 30 минут[/COLOR][/ISPOILER][/CENTER]<br>" +
        "[CENTER]Одобрено, закрыто.[/CENTER]<br>" +
        "[CENTER]С уважением, администратор курирующий форум Wililams_Nakajima![/CENTER]<br>" +
        "[CENTER]Спасибо за обращение. Приятной игры на BLACK RUSSIA - [color=aqua]AQUA[/color][/CENTER][/FONT]<br>" +
        "[CENTER][IMG]https://i.postimg.cc/0KfbtZ0J/IMG-4116.gif[/IMG][/CENTER]<br>",
      prefix: ACCEPT_PREFIX,
	  status: false,
},
   {
title: 'tk',
content:
        '[FONT=georgia][CENTER]Доброго времени суток, уважаемый (-ая) {{ user.mention }}[/CENTER]<br>' +
        "[CENTER]Ваша жалоба одобрена, игрок понесёт наказание по следующему пункту правил:[/CENTER]<br>" +
        "[CENTER][ISPOILER][COLOR=RED]2.15.[/COLOR] Запрещен TK (Team Kill) — убийство члена своей или союзной фракции, организации без наличия какой-либо IC причины [COLOR=RED]| Jail 60 минут / Warn (за два и более убийства)[/COLOR][/ISPOILER][/CENTER]<br>" +
        "[CENTER]Одобрено, закрыто.[/CENTER]<br>" +
        "[CENTER]С уважением, администратор курирующий форум Wililams_Nakajima![/CENTER]<br>" +
        "[CENTER]Спасибо за обращение. Приятной игры на BLACK RUSSIA - [color=aqua]AQUA[/color][/CENTER][/FONT]<br>" +
        "[CENTER][IMG]https://i.postimg.cc/0KfbtZ0J/IMG-4116.gif[/IMG][/CENTER]<br>",
      prefix: ACCEPT_PREFIX,
	  status: false,
},
   {
title: 'sk',
content:
        '[FONT=georgia][CENTER]Доброго времени суток, уважаемый (-ая) {{ user.mention }}[/CENTER]<br>' +
        "[CENTER]Ваша жалоба одобрена, игрок понесёт наказание по следующему пункту правил:[/CENTER]<br>" +
        "[CENTER][ISPOILER][COLOR=RED]2.16.[/COLOR] Запрещен SK (Spawn Kill) — убийство или нанесение урона на титульной территории любой фракции / организации, на месте появления игрока, а также на выходе из закрытых интерьеров и около них [COLOR=RED]| Jail 60 минут / Warn (за два и более убийства)[/COLOR][/ISPOILER][/CENTER]<br>" +
        "[CENTER]Одобрено, закрыто.[/CENTER]<br>" +
        "[CENTER]С уважением, администратор курирующий форум Wililams_Nakajima![/CENTER]<br>" +
        "[CENTER]Спасибо за обращение. Приятной игры на BLACK RUSSIA - [color=aqua]AQUA[/color][/CENTER][/FONT]<br>" +
        "[CENTER][IMG]https://i.postimg.cc/0KfbtZ0J/IMG-4116.gif[/IMG][/CENTER]<br>",
      prefix: ACCEPT_PREFIX,
	  status: false,
},
   {
title: 'pg',
content:
        '[FONT=georgia][CENTER]Доброго времени суток, уважаемый (-ая) {{ user.mention }}[/CENTER]<br>' +
        "[CENTER]Ваша жалоба одобрена, игрок понесёт наказание по следующему пункту правил:[/CENTER]<br>" +
        "[CENTER][ISPOILER][COLOR=RED]2.17.[/COLOR] Запрещен PG (PowerGaming) — присвоение свойств персонажу, не соответствующих реальности, отсутствие страха за свою жизнь [COLOR=RED]| Jail 30 минут[/COLOR][/ISPOILER][/CENTER]<br>" +
        "[CENTER]Одобрено, закрыто.[/CENTER]<br>" +
        "[CENTER]С уважением, администратор курирующий форум Wililams_Nakajima![/CENTER]<br>" +
        "[CENTER]Спасибо за обращение. Приятной игры на BLACK RUSSIA - [color=aqua]AQUA[/color][/CENTER][/FONT]<br>" +
        "[CENTER][IMG]https://i.postimg.cc/0KfbtZ0J/IMG-4116.gif[/IMG][/CENTER]<br>",
      prefix: ACCEPT_PREFIX,
	  status: false,
},
   {
title: 'mg',
content:
        '[FONT=georgia][CENTER]Доброго времени суток, уважаемый (-ая) {{ user.mention }}[/CENTER]<br>' +
        "[CENTER]Ваша жалоба одобрена, игрок понесёт наказание по следующему пункту правил:[/CENTER]<br>" +
        "[CENTER][ISPOILER][COLOR=RED]2.18.[/COLOR] Запрещен MG (MetaGaming) — использование ООС информации, которую Ваш персонаж никак не мог получить в IC процессе [COLOR=RED]| Mute 30 минут[/COLOR][/ISPOILER][/CENTER]<br>" +
        "[CENTER]Одобрено, закрыто.[/CENTER]<br>" +
        "[CENTER]С уважением, администратор курирующий форум Wililams_Nakajima![/CENTER]<br>" +
        "[CENTER]Спасибо за обращение. Приятной игры на BLACK RUSSIA - [color=aqua]AQUA[/color][/CENTER][/FONT]<br>" +
        "[CENTER][IMG]https://i.postimg.cc/0KfbtZ0J/IMG-4116.gif[/IMG][/CENTER]<br>",
      prefix: ACCEPT_PREFIX,
	  status: false,
},
   {
title: 'caps',
content:
        '[FONT=georgia][CENTER]Доброго времени суток, уважаемый (-ая) {{ user.mention }}[/CENTER]<br>' +
        "[CENTER]Ваша жалоба одобрена, игрок понесёт наказание по следующему пункту правил:[/CENTER]<br>" +
        "[CENTER][ISPOILER][COLOR=RED]3.02[/COLOR] Запрещено использование верхнего регистра (CapsLock) при написании любого текста в любом чате [COLOR=RED]| Mute 30 минут[/COLOR][/ISPOILER][/CENTER]<br>" +
        "[CENTER]Одобрено, закрыто.[/CENTER]<br>" +
        "[CENTER]С уважением, администратор курирующий форум Wililams_Nakajima![/CENTER]<br>" +
        "[CENTER]Спасибо за обращение. Приятной игры на BLACK RUSSIA - [color=aqua]AQUA[/color][/CENTER][/FONT]<br>" +
        "[CENTER][IMG]https://i.postimg.cc/0KfbtZ0J/IMG-4116.gif[/IMG][/CENTER]<br>",
      prefix: ACCEPT_PREFIX,
	  status: false,
},
   {
title: 'flood',
content:
        '[FONT=georgia][CENTER]Доброго времени суток, уважаемый (-ая) {{ user.mention }}[/CENTER]<br>' +
        "[CENTER]Ваша жалоба одобрена, игрок понесёт наказание по следующему пункту правил:[/CENTER]<br>" +
        "[CENTER][ISPOILER][COLOR=RED]3.05[/COLOR] Запрещен флуд — 3 и более повторяющихся сообщений от одного и того же игрока [COLOR=RED]| Mute 30 минут[/COLOR][/ISPOILER][/CENTER]<br>" +
        "[CENTER]Одобрено, закрыто.[/CENTER]<br>" +
        "[CENTER]С уважением, администратор курирующий форум Wililams_Nakajima![/CENTER]<br>" +
        "[CENTER]Спасибо за обращение. Приятной игры на BLACK RUSSIA - [color=aqua]AQUA[/color][/CENTER][/FONT]<br>" +
        "[CENTER][IMG]https://i.postimg.cc/0KfbtZ0J/IMG-4116.gif[/IMG][/CENTER]<br>",
      prefix: ACCEPT_PREFIX,
	  status: false,
},
   {
title: 'транслит',
content:
        '[FONT=georgia][CENTER]Доброго времени суток, уважаемый (-ая) {{ user.mention }}[/CENTER]<br>' +
        "[CENTER]Ваша жалоба одобрена, игрок понесёт наказание по следующему пункту правил:[/CENTER]<br>" +
        "[CENTER][ISPOILER][COLOR=RED]3.20[/COLOR] Запрещено использование транслита в любом из чатов [COLOR=RED]| Mute 30 минут[/COLOR][/ISPOILER][/CENTER]<br>" +
        "[CENTER]Одобрено, закрыто.[/CENTER]<br>" +
        "[CENTER]С уважением, администратор курирующий форум Wililams_Nakajima![/CENTER]<br>" +
        "[CENTER]Спасибо за обращение. Приятной игры на BLACK RUSSIA - [color=aqua]AQUA[/color][/CENTER][/FONT]<br>" +
        "[CENTER][IMG]https://i.postimg.cc/0KfbtZ0J/IMG-4116.gif[/IMG][/CENTER]<br>",
      prefix: ACCEPT_PREFIX,
	  status: false,
},
   {
title: 'osk/upom rod',
content:
        '[FONT=georgia][CENTER]Доброго времени суток, уважаемый (-ая) {{ user.mention }}[/CENTER]<br>' +
        "[CENTER]Ваша жалоба одобрена, игрок понесёт наказание по следующему пункту правил:[/CENTER]<br>" +
        "[CENTER][ISPOILER][COLOR=RED]3.04[/COLOR] Запрещено оскорбление или косвенное упоминание родных вне зависимости от чата (IC или OOC) [COLOR=RED]| Mute 120 минут / Ban 7 - 15 дней[/COLOR][/ISPOILER][/CENTER]<br>" +
        "[CENTER]Одобрено, закрыто.[/CENTER]<br>" +
        "[CENTER]С уважением, администратор курирующий форум Wililams_Nakajima![/CENTER]<br>" +
        "[CENTER]Спасибо за обращение. Приятной игры на BLACK RUSSIA - [color=aqua]AQUA[/color][/CENTER][/FONT]<br>" +
        "[CENTER][IMG]https://i.postimg.cc/0KfbtZ0J/IMG-4116.gif[/IMG][/CENTER]<br>",
      prefix: ACCEPT_PREFIX,
	  status: false,
},
   {
title: 'osk rod в voice',
content:
        '[FONT=georgia][CENTER]Доброго времени суток, уважаемый (-ая) {{ user.mention }}[/CENTER]<br>' +
        "[CENTER]Ваша жалоба одобрена, игрок понесёт наказание по следующему пункту правил:[/CENTER]<br>" +
        "[CENTER][ISPOILER][COLOR=RED]3.15[/COLOR] Запрещено оскорблять игроков или родных в Voice Chat [COLOR=RED]| Mute 120 минут / Ban 7 - 15 дней[/COLOR][/ISPOILER][/CENTER]<br>" +
        "[CENTER]Одобрено, закрыто.[/CENTER]<br>" +
        "[CENTER]С уважением, администратор курирующий форум Wililams_Nakajima![/CENTER]<br>" +
        "[CENTER]Спасибо за обращение. Приятной игры на BLACK RUSSIA - [color=aqua]AQUA[/color][/CENTER][/FONT]<br>" +
        "[CENTER][IMG]https://i.postimg.cc/0KfbtZ0J/IMG-4116.gif[/IMG][/CENTER]<br>",
      prefix: ACCEPT_PREFIX,
	  status: false,
},
   {
title: 'оск',
content:
        '[FONT=georgia][CENTER]Доброго времени суток, уважаемый (-ая) {{ user.mention }}[/CENTER]<br>' +
        "[CENTER]Ваша жалоба одобрена, игрок понесёт наказание по следующему пункту правил:[/CENTER]<br>" +
        "[CENTER][ISPOILER][COLOR=RED]3.07[/COLOR] Запрещены совершенно любые оскорбления или действия, порочащие честь и достоинства, несущие в себе подтекст сексуального характера вне зависимости от чата [COLOR=RED]| Mute 30 минут[/COLOR][/ISPOILER][/CENTER]<br>" +
        "[CENTER]Одобрено, закрыто.[/CENTER]<br>" +
        "[CENTER]С уважением, администратор курирующий форум Wililams_Nakajima![/CENTER]<br>" +
        "[CENTER]Спасибо за обращение. Приятной игры на BLACK RUSSIA - [color=aqua]AQUA[/color][/CENTER][/FONT]<br>" +
        "[CENTER][IMG]https://i.postimg.cc/0KfbtZ0J/IMG-4116.gif[/IMG][/CENTER]<br>",
      prefix: ACCEPT_PREFIX,
	  status: false,
},
   {
title: 'osk adm',
content:
        '[FONT=georgia][CENTER]Доброго времени суток, уважаемый (-ая) {{ user.mention }}[/CENTER]<br>' +
        "[CENTER]Ваша жалоба одобрена, игрок понесёт наказание по следующему пункту правил:[/CENTER]<br>" +
        "[CENTER][ISPOILER][COLOR=RED]2.54[/COLOR] Запрещено неуважительное обращение, оскорбление, неадекватное поведение, угрозы в любом их проявлении по отношению к администрации [COLOR=RED]| Mute 180 минут[/COLOR][/ISPOILER][/CENTER]<br>" +
        "[CENTER]Одобрено, закрыто.[/CENTER]<br>" +
        "[CENTER]С уважением, администратор курирующий форум Wililams_Nakajima![/CENTER]<br>" +
        "[CENTER]Спасибо за обращение. Приятной игры на BLACK RUSSIA - [color=aqua]AQUA[/color][/CENTER][/FONT]<br>" +
        "[CENTER][IMG]https://i.postimg.cc/0KfbtZ0J/IMG-4116.gif[/IMG][/CENTER]<br>",
      prefix: ACCEPT_PREFIX,
	  status: false,
},
   {
title: 'osk проекта',
content:
        '[FONT=georgia][CENTER]Доброго времени суток, уважаемый (-ая) {{ user.mention }}[/CENTER]<br>' +
        "[CENTER]Ваша жалоба одобрена, игрок понесёт наказание по следующему пункту правил:[/CENTER]<br>" +
        "[CENTER][ISPOILER][COLOR=RED]2.40[/COLOR] Запрещены совершенно любые деструктивные действия по отношению к проекту: неконструктивная критика, призывы покинуть проект, попытки нарушить развитие проекта или любые другие действия, способные привести к помехам в игровом процессе [COLOR=RED]| Mute 300 минут / Ban 30 дней (Ban выдается по согласованию с главным администратором)[/COLOR][/ISPOILER][/CENTER]<br>" +
        "[CENTER]Одобрено, закрыто.[/CENTER]<br>" +
        "[CENTER]С уважением, администратор курирующий форум Wililams_Nakajima![/CENTER]<br>" +
        "[CENTER]Спасибо за обращение. Приятной игры на BLACK RUSSIA - [color=aqua]AQUA[/color][/CENTER][/FONT]<br>" +
        "[CENTER][IMG]https://i.postimg.cc/0KfbtZ0J/IMG-4116.gif[/IMG][/CENTER]<br>",
      prefix: ACCEPT_PREFIX,
	  status: false,
},
  {
title: 'ndrive',
content:
        '[FONT=georgia][CENTER]Доброго времени суток, уважаемый (-ая) {{ user.mention }}[/CENTER]<br>' +
        "[CENTER]Ваша жалоба одобрена, игрок понесёт наказание по следующему пункту правил:[/CENTER]<br>" +
        "[CENTER][ISPOILER][COLOR=RED]2.03[/COLOR] Запрещен NonRP Drive — вождение любого транспортного средства в невозможных для него условиях, а также вождение в неправдоподобной манере [COLOR=RED]| Jail 30 минут[/COLOR][/ISPOILER][/CENTER]<br>" +
        "[CENTER]Одобрено, закрыто.[/CENTER]<br>" +
        "[CENTER]С уважением, администратор курирующий форум Wililams_Nakajima![/CENTER]<br>" +
        "[CENTER]Спасибо за обращение. Приятной игры на BLACK RUSSIA - [color=aqua]AQUA[/color][/CENTER][/FONT]<br>" +
        "[CENTER][IMG]https://i.postimg.cc/0KfbtZ0J/IMG-4116.gif[/IMG][/CENTER]<br>",
      prefix: ACCEPT_PREFIX,
	  status: false,
},
   {
title: 'ndrive фура/инко',
content:
        '[FONT=georgia][CENTER]Доброго времени суток, уважаемый (-ая) {{ user.mention }}[/CENTER]<br>' +
        "[CENTER]Ваша жалоба одобрена, игрок понесёт наказание по следующему пункту правил:[/CENTER]<br>" +
        "[CENTER][ISPOILER][COLOR=RED]2.47[/COLOR] Запрещено ездить по полям на грузовом транспорте, инкассаторских машинах (работа дальнобойщика, инкассатора) [COLOR=RED]| Jail 60 минут[/COLOR][/ISPOILER][/CENTER]<br>" +
        "[CENTER]Одобрено, закрыто.[/CENTER]<br>" +
        "[CENTER]С уважением, администратор курирующий форум Wililams_Nakajima![/CENTER]<br>" +
        "[CENTER]Спасибо за обращение. Приятной игры на BLACK RUSSIA - [color=aqua]AQUA[/color][/CENTER][/FONT]<br>" +
        "[CENTER][IMG]https://i.postimg.cc/0KfbtZ0J/IMG-4116.gif[/IMG][/CENTER]<br>",
      prefix: ACCEPT_PREFIX,
	  status: false,
},
   {
title: 'помеха ип',
content:
        '[FONT=georgia][CENTER]Доброго времени суток, уважаемый (-ая) {{ user.mention }}[/CENTER]<br>' +
        "[CENTER]Ваша жалоба одобрена, игрок понесёт наказание по следующему пункту правил:[/CENTER]<br>" +
        "[CENTER][ISPOILER][COLOR=RED]2.04[/COLOR] Запрещены любые действия способные привести к помехам в игровом процессе, а также выполнению работ, если они этого не предусматривают и если эти действия выходят за рамки игрового процесса данной работы. [COLOR=RED]| Ban 10 дней / Обнуление аккаунта (при повторном нарушении)[/COLOR][/ISPOILER][/CENTER]<br>" +
        "[CENTER]Одобрено, закрыто.[/CENTER]<br>" +
        "[CENTER]С уважением, администратор курирующий форум Wililams_Nakajima![/CENTER]<br>" +
        "[CENTER]Спасибо за обращение. Приятной игры на BLACK RUSSIA - [color=aqua]AQUA[/color][/CENTER][/FONT]<br>" +
        "[CENTER][IMG]https://i.postimg.cc/0KfbtZ0J/IMG-4116.gif[/IMG][/CENTER]<br>",
      prefix: ACCEPT_PREFIX,
	  status: false,
},
  {
title: 'уход от рп',
content:
        '[FONT=georgia][CENTER]Доброго времени суток, уважаемый (-ая) {{ user.mention }}[/CENTER]<br>' +
        "[CENTER]Ваша жалоба одобрена, игрок понесёт наказание по следующему пункту правил:[/CENTER]<br>" +
        "[CENTER][ISPOILER][COLOR=RED]2.02[/COLOR] Запрещено целенаправленно уходить от Role Play процесса всеразличными способами [COLOR=RED]| Jail 30 минут / Warn [/COLOR][/ISPOILER][/CENTER]<br>" +
        "[CENTER]Одобрено, закрыто.[/CENTER]<br>" +
        "[CENTER]С уважением, администратор курирующий форум Wililams_Nakajima![/CENTER]<br>" +
        "[CENTER]Спасибо за обращение. Приятной игры на BLACK RUSSIA - [color=aqua]AQUA[/color][/CENTER][/FONT]<br>" +
        "[CENTER][IMG]https://i.postimg.cc/0KfbtZ0J/IMG-4116.gif[/IMG][/CENTER]<br>",
      prefix: ACCEPT_PREFIX,
	  status: false,
},
   {
title: 'багаюз',
content:
        '[FONT=georgia][CENTER]Доброго времени суток, уважаемый (-ая) {{ user.mention }}[/CENTER]<br>' +
        "[CENTER]Ваша жалоба одобрена, игрок понесёт наказание по следующему пункту правил:[/CENTER]<br>" +
        "[CENTER][ISPOILER][COLOR=RED]2.21[/COLOR] Запрещено пытаться обходить игровую систему или использовать любые баги сервера [COLOR=RED]| Ban 15 - 30 дней / PermBan (по согласованию с ГА, ЗГА, руководством тех. специалистов)[/COLOR][/ISPOILER][/CENTER]<br>" +
        "[CENTER]Одобрено, закрыто.[/CENTER]<br>" +
        "[CENTER]С уважением, администратор курирующий форум Wililams_Nakajima![/CENTER]<br>" +
        "[CENTER]Спасибо за обращение. Приятной игры на BLACK RUSSIA - [color=aqua]AQUA[/color][/CENTER][/FONT]<br>" +
        "[CENTER][IMG]https://i.postimg.cc/0KfbtZ0J/IMG-4116.gif[/IMG][/CENTER]<br>",
      prefix: ACCEPT_PREFIX,
	  status: false,
},
  {
title: 'багаюз аним',
content:
        '[FONT=georgia][CENTER]Доброго времени суток, уважаемый (-ая) {{ user.mention }}[/CENTER]<br>' +
        "[CENTER]Ваша жалоба одобрена, игрок понесёт наказание по следующему пункту правил:[/CENTER]<br>" +
        "[CENTER][ISPOILER][COLOR=RED]2.55[/COLOR] Запрещается багоюз связанный с анимацией в любых проявлениях. [COLOR=RED]| Jail 60 / 120 минут[/COLOR][/ISPOILER][/CENTER]<br>" +
        "[CENTER]Одобрено, закрыто.[/CENTER]<br>" +
        "[CENTER]С уважением, администратор курирующий форум Wililams_Nakajima![/CENTER]<br>" +
        "[CENTER]Спасибо за обращение. Приятной игры на BLACK RUSSIA - [color=aqua]AQUA[/color][/CENTER][/FONT]<br>" +
        "[CENTER][IMG]https://i.postimg.cc/0KfbtZ0J/IMG-4116.gif[/IMG][/CENTER]<br>",
      prefix: ACCEPT_PREFIX,
	  status: false,
},
   {
title: 'угрозы наказ от адм',
content:
        '[FONT=georgia][CENTER]Доброго времени суток, уважаемый (-ая) {{ user.mention }}[/CENTER]<br>' +
        "[CENTER]Ваша жалоба одобрена, игрок понесёт наказание по следующему пункту правил:[/CENTER]<br>" +
        "[CENTER][ISPOILER][COLOR=RED]3.09[/COLOR] Запрещены любые угрозы о наказании игрока со стороны администрации. [COLOR=RED]| Mute 30 минут[/COLOR][/ISPOILER][/CENTER]<br>" +
        "[CENTER]Одобрено, закрыто.[/CENTER]<br>" +
        "[CENTER]С уважением, администратор курирующий форум Wililams_Nakajima![/CENTER]<br>" +
        "[CENTER]Спасибо за обращение. Приятной игры на BLACK RUSSIA - [color=aqua]AQUA[/color][/CENTER][/FONT]<br>" +
        "[CENTER][IMG]https://i.postimg.cc/0KfbtZ0J/IMG-4116.gif[/IMG][/CENTER]<br>",
      prefix: ACCEPT_PREFIX,
	  status: false,
},
   {
title: 'оос угрозы',
content:
        '[FONT=georgia][CENTER]Доброго времени суток, уважаемый (-ая) {{ user.mention }}[/CENTER]<br>' +
        "[CENTER]Ваша жалоба одобрена, игрок понесёт наказание по следующему пункту правил:[/CENTER]<br>" +
        "[CENTER][ISPOILER][COLOR=RED]2.37[/COLOR] Запрещены OOC угрозы, в том числе и завуалированные. [COLOR=RED]| Mute 120 минут / Ban 7 дней[/COLOR][/ISPOILER][/CENTER]<br>" +
        "[CENTER]Одобрено, закрыто.[/CENTER]<br>" +
        "[CENTER]С уважением, администратор курирующий форум Wililams_Nakajima![/CENTER]<br>" +
        "[CENTER]Спасибо за обращение. Приятной игры на BLACK RUSSIA - [color=aqua]AQUA[/color][/CENTER][/FONT]<br>" +
        "[CENTER][IMG]https://i.postimg.cc/0KfbtZ0J/IMG-4116.gif[/IMG][/CENTER]<br>",
      prefix: ACCEPT_PREFIX,
	  status: false,
},
  {
title: 'выдача за адм',
content:
        '[FONT=georgia][CENTER]Доброго времени суток, уважаемый (-ая) {{ user.mention }}[/CENTER]<br>' +
        "[CENTER]Ваша жалоба одобрена, игрок понесёт наказание по следующему пункту правил:[/CENTER]<br>" +
        "[CENTER][ISPOILER][COLOR=RED]3.10[/COLOR] Запрещена выдача себя за администратора, если таковым не являетесь [COLOR=RED]| Ban 7 - 15 + ЧС администрации[/COLOR][/ISPOILER][/CENTER]<br>" +
        "[CENTER]Одобрено, закрыто.[/CENTER]<br>" +
        "[CENTER]С уважением, администратор курирующий форум Wililams_Nakajima![/CENTER]<br>" +
        "[CENTER]Спасибо за обращение. Приятной игры на BLACK RUSSIA - [color=aqua]AQUA[/color][/CENTER][/FONT]<br>" +
        "[CENTER][IMG]https://i.postimg.cc/0KfbtZ0J/IMG-4116.gif[/IMG][/CENTER]<br>",
      prefix: ACCEPT_PREFIX,
	  status: false,
},
   {
title: 'ввод в заблужд командами',
content:
        '[FONT=georgia][CENTER]Доброго времени суток, уважаемый (-ая) {{ user.mention }}[/CENTER]<br>' +
        "[CENTER]Ваша жалоба одобрена, игрок понесёт наказание по следующему пункту правил:[/CENTER]<br>" +
        "[CENTER][ISPOILER][COLOR=RED]3.11[/COLOR] Запрещено введение игроков проекта в заблуждение путем злоупотребления командами [COLOR=RED]| Ban 15 - 30 дней / PermBan[/COLOR][/ISPOILER][/CENTER]<br>" +
        "[CENTER]Одобрено, закрыто.[/CENTER]<br>" +
        "[CENTER]С уважением, администратор курирующий форум Wililams_Nakajima![/CENTER]<br>" +
        "[CENTER]Спасибо за обращение. Приятной игры на BLACK RUSSIA - [color=aqua]AQUA[/color][/CENTER][/FONT]<br>" +
        "[CENTER][IMG]https://i.postimg.cc/0KfbtZ0J/IMG-4116.gif[/IMG][/CENTER]<br>",
      prefix: ACCEPT_PREFIX,
	  status: false,
},
   {
title: 'слив глобал чата',
content:
        '[FONT=georgia][CENTER]Доброго времени суток, уважаемый (-ая) {{ user.mention }}[/CENTER]<br>' +
        "[CENTER]Ваша жалоба одобрена, игрок понесёт наказание по следующему пункту правил:[/CENTER]<br>" +
        "[CENTER][ISPOILER][COLOR=RED]3.08[/COLOR] Запрещены любые формы «слива» посредством использования глобальных чатов [COLOR=RED]| PermBan[/COLOR][/ISPOILER][/CENTER]<br>" +
        "[CENTER]Одобрено, закрыто.[/CENTER]<br>" +
        "[CENTER]С уважением, администратор курирующий форум Wililams_Nakajima![/CENTER]<br>" +
        "[CENTER]Спасибо за обращение. Приятной игры на BLACK RUSSIA - [color=aqua]AQUA[/color][/CENTER][/FONT]<br>" +
        "[CENTER][IMG]https://i.postimg.cc/0KfbtZ0J/IMG-4116.gif[/IMG][/CENTER]<br>",
      prefix: ACCEPT_PREFIX,
	  status: false,
},
   {
title: 'слив склада',
content:
        '[FONT=georgia][CENTER]Доброго времени суток, уважаемый (-ая) {{ user.mention }}[/CENTER]<br>' +
        "[CENTER]Ваша жалоба одобрена, игрок понесёт наказание по следующему пункту правил:[/CENTER]<br>" +
        "[CENTER][ISPOILER][COLOR=RED]2.09[/COLOR] Запрещено сливать склад фракции / семьи путем взятия большого количества ресурсов или превышая допустимый лимит, установленный лидером [COLOR=RED]| Ban 15 - 30 дней / PermBan[/COLOR][/ISPOILER][/CENTER]<br>" +
        "[CENTER]Одобрено, закрыто.[/CENTER]<br>" +
        "[CENTER]С уважением, администратор курирующий форум Wililams_Nakajima![/CENTER]<br>" +
        "[CENTER]Спасибо за обращение. Приятной игры на BLACK RUSSIA - [color=aqua]AQUA[/color][/CENTER][/FONT]<br>" +
        "[CENTER][IMG]https://i.postimg.cc/0KfbtZ0J/IMG-4116.gif[/IMG][/CENTER]<br>",
      prefix: ACCEPT_PREFIX,
	  status: false,
},
   {
title: 'аморал',
content:
        '[FONT=georgia][CENTER]Доброго времени суток, уважаемый (-ая) {{ user.mention }}[/CENTER]<br>' +
        "[CENTER]Ваша жалоба одобрена, игрок понесёт наказание по следующему пункту правил:[/CENTER]<br>" +
        "[CENTER][ISPOILER][COLOR=RED]2.08[/COLOR] Запрещена любая форма аморальных действий сексуального характера в сторону игроков [COLOR=RED]| Jail 30 минут / Warn[/COLOR][/ISPOILER][/CENTER]<br>" +
        "[CENTER]Одобрено, закрыто.[/CENTER]<br>" +
        "[CENTER]С уважением, администратор курирующий форум Wililams_Nakajima![/CENTER]<br>" +
        "[CENTER]Спасибо за обращение. Приятной игры на BLACK RUSSIA - [color=aqua]AQUA[/color][/CENTER][/FONT]<br>" +
        "[CENTER][IMG]https://i.postimg.cc/0KfbtZ0J/IMG-4116.gif[/IMG][/CENTER]<br>",
      prefix: ACCEPT_PREFIX,
	  status: false,
},
  {
title: 'реклама',
content:
        '[FONT=georgia][CENTER]Доброго времени суток, уважаемый (-ая) {{ user.mention }}[/CENTER]<br>' +
        "[CENTER]Ваша жалоба одобрена, игрок понесёт наказание по следующему пункту правил:[/CENTER]<br>" +
        "[CENTER][ISPOILER][COLOR=RED]2.31[/COLOR] Запрещено рекламировать на серверах любые проекты, серверы, сайты, сторонние Discord-серверы, YouTube каналы и тому подобное [COLOR=RED]| Ban 7 дней / PermBan[/COLOR][/ISPOILER][/CENTER]<br>" +
        "[CENTER]Одобрено, закрыто.[/CENTER]<br>" +
        "[CENTER]С уважением, администратор курирующий форум Wililams_Nakajima![/CENTER]<br>" +
        "[CENTER]Спасибо за обращение. Приятной игры на BLACK RUSSIA - [color=aqua]AQUA[/color][/CENTER][/FONT]<br>" +
        "[CENTER][IMG]https://i.postimg.cc/0KfbtZ0J/IMG-4116.gif[/IMG][/CENTER]<br>",
      prefix: ACCEPT_PREFIX,
	  status: false,
},
   {
title: 'реклама промо',
content:
        '[FONT=georgia][CENTER]Доброго времени суток, уважаемый (-ая) {{ user.mention }}[/CENTER]<br>' +
        "[CENTER]Ваша жалоба одобрена, игрок понесёт наказание по следующему пункту правил:[/CENTER]<br>" +
        "[CENTER][ISPOILER][COLOR=RED]3.21[/COLOR] Запрещается реклама промокодов в игре, а также их упоминание в любом виде во всех чатах [COLOR=RED]| Ban 30 дней[/COLOR][/ISPOILER][/CENTER]<br>" +
        "[CENTER]Одобрено, закрыто.[/CENTER]<br>" +
        "[CENTER]С уважением, администратор курирующий форум Wililams_Nakajima![/CENTER]<br>" +
        "[CENTER]Спасибо за обращение. Приятной игры на BLACK RUSSIA - [color=aqua]AQUA[/color][/CENTER][/FONT]<br>" +
        "[CENTER][IMG]https://i.postimg.cc/0KfbtZ0J/IMG-4116.gif[/IMG][/CENTER]<br>",
      prefix: ACCEPT_PREFIX,
	  status: false,
},
   {
title: 'продажа промо',
content:
        '[FONT=georgia][CENTER]Доброго времени суток, уважаемый (-ая) {{ user.mention }}[/CENTER]<br>' +
        "[CENTER]Ваша жалоба одобрена, игрок понесёт наказание по следующему пункту правил:[/CENTER]<br>" +
        "[CENTER][ISPOILER][COLOR=RED]2.43[/COLOR] Запрещена продажа / обмен / покупка поощрительной составляющей от лица проекта, будь то бонус-код, либо промокод, который выдается безвозмездно игрокам в целях промоакций [COLOR=RED]| Mute 120 минут[/COLOR][/ISPOILER][/CENTER]<br>" +
        "[CENTER]Одобрено, закрыто.[/CENTER]<br>" +
        "[CENTER]С уважением, администратор курирующий форум Wililams_Nakajima![/CENTER]<br>" +
        "[CENTER]Спасибо за обращение. Приятной игры на BLACK RUSSIA - [color=aqua]AQUA[/color][/CENTER][/FONT]<br>" +
        "[CENTER][IMG]https://i.postimg.cc/0KfbtZ0J/IMG-4116.gif[/IMG][/CENTER]<br>",
      prefix: ACCEPT_PREFIX,
	  status: false,
},
   {
title: 'читы/сборка',
content:
        '[FONT=georgia][CENTER]Доброго времени суток, уважаемый (-ая) {{ user.mention }}[/CENTER]<br>' +
        "[CENTER]Ваша жалоба одобрена, игрок понесёт наказание по следующему пункту правил:[/CENTER]<br>" +
        "[CENTER][ISPOILER][COLOR=RED]2.22[/COLOR] Запрещено хранить / использовать / распространять стороннее программное обеспечение или любые другие средства, позволяющие получить преимущество над другими игроками [COLOR=RED]| Ban 15 - 30 дней / PermBan[/COLOR][/ISPOILER][/CENTER]<br>" +
        "[CENTER]Одобрено, закрыто.[/CENTER]<br>" +
        "[CENTER]С уважением, администратор курирующий форум Wililams_Nakajima![/CENTER]<br>" +
        "[CENTER]Спасибо за обращение. Приятной игры на BLACK RUSSIA - [color=aqua]AQUA[/color][/CENTER][/FONT]<br>" +
        "[CENTER][IMG]https://i.postimg.cc/0KfbtZ0J/IMG-4116.gif[/IMG][/CENTER]<br>",
      prefix: ACCEPT_PREFIX,
	  status: false,
},
   {
title: 'злоупотреб симвл',
content:
        '[FONT=georgia][CENTER]Доброго времени суток, уважаемый (-ая) {{ user.mention }}[/CENTER]<br>' +
        "[CENTER]Ваша жалоба одобрена, игрок понесёт наказание по следующему пункту правил:[/CENTER]<br>" +
        "[CENTER][ISPOILER][COLOR=RED]3.06[/COLOR] Запрещено злоупотребление знаков препинания и прочих символов [COLOR=RED]| Mute 30 минут[/COLOR][/ISPOILER][/CENTER]<br>" +
        "[CENTER]Одобрено, закрыто.[/CENTER]<br>" +
        "[CENTER]С уважением, администратор курирующий форум Wililams_Nakajima![/CENTER]<br>" +
        "[CENTER]Спасибо за обращение. Приятной игры на BLACK RUSSIA - [color=aqua]AQUA[/color][/CENTER][/FONT]<br>" +
        "[CENTER][IMG]https://i.postimg.cc/0KfbtZ0J/IMG-4116.gif[/IMG][/CENTER]<br>",
      prefix: ACCEPT_PREFIX,
	  status: false,
},
   {
title: 'злоупотреб нарушениями',
content:
        '[FONT=georgia][CENTER]Доброго времени суток, уважаемый (-ая) {{ user.mention }}[/CENTER]<br>' +
        "[CENTER]Ваша жалоба одобрена, игрок понесёт наказание по следующему пункту правил:[/CENTER]<br>" +
        "[CENTER][ISPOILER][COLOR=RED]2.39[/COLOR] Злоупотребление нарушениями правил сервера [COLOR=RED]| Ban 7 - 30 дней[/COLOR][/ISPOILER][/CENTER]<br>" +
        "[CENTER]Одобрено, закрыто.[/CENTER]<br>" +
        "[CENTER]С уважением, администратор курирующий форум Wililams_Nakajima![/CENTER]<br>" +
        "[CENTER]Спасибо за обращение. Приятной игры на BLACK RUSSIA - [color=aqua]AQUA[/color][/CENTER][/FONT]<br>" +
        "[CENTER][IMG]https://i.postimg.cc/0KfbtZ0J/IMG-4116.gif[/IMG][/CENTER]<br>",
      prefix: ACCEPT_PREFIX,
	  status: false,
},
   {
title: 'конфликты осс и ic',
content:
        '[FONT=georgia][CENTER]Доброго времени суток, уважаемый (-ая) {{ user.mention }}[/CENTER]<br>' +
        "[CENTER]Ваша жалоба одобрена, игрок понесёт наказание по следующему пункту правил:[/CENTER]<br>" +
        "[CENTER][ISPOILER][COLOR=RED]2.35[/COLOR] На игровых серверах запрещено устраивать IC и OOC конфликты на почве разногласия о национальности и / или религии совершенно в любом формате [COLOR=RED]| Mute 120 минут / Ban 7 дней[/COLOR][/ISPOILER][/CENTER]<br>" +
        "[CENTER]Одобрено, закрыто.[/CENTER]<br>" +
        "[CENTER]С уважением, администратор курирующий форум Wililams_Nakajima![/CENTER]<br>" +
        "[CENTER]Спасибо за обращение. Приятной игры на BLACK RUSSIA - [color=aqua]AQUA[/color][/CENTER][/FONT]<br>" +
        "[CENTER][IMG]https://i.postimg.cc/0KfbtZ0J/IMG-4116.gif[/IMG][/CENTER]<br>",
      prefix: ACCEPT_PREFIX,
	  status: false,
},
 {
title: 'перенос конфликта',
content:
        '[FONT=georgia][CENTER]Доброго времени суток, уважаемый (-ая) {{ user.mention }}[/CENTER]<br>' +
        "[CENTER]Ваша жалоба одобрена, игрок понесёт наказание по следующему пункту правил:[/CENTER]<br>" +
        "[CENTER][ISPOILER][COLOR=RED]2.36[/COLOR] Запрещено переносить конфликты из IC в OOC и наоборот [COLOR=RED]| Warn[/COLOR][/ISPOILER][/CENTER]<br>" +
        "[CENTER]Одобрено, закрыто.[/CENTER]<br>" +
        "[CENTER]С уважением, администратор курирующий форум Wililams_Nakajima![/CENTER]<br>" +
        "[CENTER]Спасибо за обращение. Приятной игры на BLACK RUSSIA - [color=aqua]AQUA[/color][/CENTER][/FONT]<br>" +
        "[CENTER][IMG]https://i.postimg.cc/0KfbtZ0J/IMG-4116.gif[/IMG][/CENTER]<br>",
      prefix: ACCEPT_PREFIX,
	  status: false,
},
 {
title: 'полит/религиоз пропаганда',
content:
        '[FONT=georgia][CENTER]Доброго времени суток, уважаемый (-ая) {{ user.mention }}[/CENTER]<br>' +
        "[CENTER]Ваша жалоба одобрена, игрок понесёт наказание по следующему пункту правил:[/CENTER]<br>" +
        "[CENTER][ISPOILER][COLOR=RED]3.18[/COLOR] Запрещено политическое и религиозное пропагандирование, а также провокация игроков к конфликтам, коллективному флуду или беспорядкам в любом из чатов [COLOR=RED]| Mute 120 минут / Ban 10 дней[/COLOR][/ISPOILER][/CENTER]<br>" +
        "[CENTER]Одобрено, закрыто.[/CENTER]<br>" +
        "[CENTER]С уважением, администратор курирующий форум Wililams_Nakajima![/CENTER]<br>" +
        "[CENTER]Спасибо за обращение. Приятной игры на BLACK RUSSIA - [color=aqua]AQUA[/color][/CENTER][/FONT]<br>" +
        "[CENTER][IMG]https://i.postimg.cc/0KfbtZ0J/IMG-4116.gif[/IMG][/CENTER]<br>",
      prefix: ACCEPT_PREFIX,
	  status: false,
},
   {
title: 'мат в vip',
content:
        '[FONT=georgia][CENTER]Доброго времени суток, уважаемый (-ая) {{ user.mention }}[/CENTER]<br>' +
        "[CENTER]Ваша жалоба одобрена, игрок понесёт наказание по следующему пункту правил:[/CENTER]<br>" +
        "[CENTER][ISPOILER][COLOR=RED]3.23[/COLOR] Запрещено использование нецензурных слов, в том числе завуалированных и литературных в VIP чате [COLOR=RED]| Mute 30 минут [/COLOR][/ISPOILER][/CENTER]<br>" +
        "[CENTER]Одобрено, закрыто.[/CENTER]<br>" +
        "[CENTER]С уважением, администратор курирующий форум Wililams_Nakajima![/CENTER]<br>" +
        "[CENTER]Спасибо за обращение. Приятной игры на BLACK RUSSIA - [color=aqua]AQUA[/color][/CENTER][/FONT]<br>" +
        "[CENTER][IMG]https://i.postimg.cc/0KfbtZ0J/IMG-4116.gif[/IMG][/CENTER]<br>",
      prefix: ACCEPT_PREFIX,
	  status: false,
},
  {
title: 'изменение голоса в voice',
content:
        '[FONT=georgia][CENTER]Доброго времени суток, уважаемый (-ая) {{ user.mention }}[/CENTER]<br>' +
        "[CENTER]Ваша жалоба одобрена, игрок понесёт наказание по следующему пункту правил:[/CENTER]<br>" +
        "[CENTER][ISPOILER][COLOR=RED]3.19[/COLOR] Запрещено использование любого софта для изменения голоса [COLOR=RED]| Mute 60 минут [/COLOR][/ISPOILER][/CENTER]<br>" +
        "[CENTER]Одобрено, закрыто.[/CENTER]<br>" +
        "[CENTER]С уважением, администратор курирующий форум Wililams_Nakajima![/CENTER]<br>" +
        "[CENTER]Спасибо за обращение. Приятной игры на BLACK RUSSIA - [color=aqua]AQUA[/color][/CENTER][/FONT]<br>" +
        "[CENTER][IMG]https://i.postimg.cc/0KfbtZ0J/IMG-4116.gif[/IMG][/CENTER]<br>",
      prefix: ACCEPT_PREFIX,
	  status: false,
},
 {
title: 'прогул р/д',
content:
        '[FONT=georgia][CENTER]Доброго времени суток, уважаемый (-ая) {{ user.mention }}[/CENTER]<br>' +
        "[CENTER]Ваша жалоба одобрена, игрок понесёт наказание по следующему пункту правил:[/CENTER]<br>" +
        "[CENTER][ISPOILER][COLOR=RED]1.13[/COLOR] Запрещено находиться в форме внутри казино, участвовать в битве за контейнеры, участвовать в захвате семейного контейнера, находится на Б/У рынке с целью покупки / продажи авто, а также устраиваться на сторонние работы в форме фракции [COLOR=RED]| Jail 30 минут [/COLOR][/ISPOILER][/CENTER]<br>" +
        "[CENTER]Одобрено, закрыто.[/CENTER]<br>" +
        "[CENTER]С уважением, администратор курирующий форум Wililams_Nakajima![/CENTER]<br>" +
        "[CENTER]Спасибо за обращение. Приятной игры на BLACK RUSSIA - [color=aqua]AQUA[/color][/CENTER][/FONT]<br>" +
        "[CENTER][IMG]https://i.postimg.cc/0KfbtZ0J/IMG-4116.gif[/IMG][/CENTER]<br>",
      prefix: ACCEPT_PREFIX,
	  status: false,
},
{
title: 'разговоры не на русс',
content:
        '[FONT=georgia][CENTER]Доброго времени суток, уважаемый (-ая) {{ user.mention }}[/CENTER]<br>' +
        "[CENTER]Ваша жалоба одобрена, игрок понесёт наказание по следующему пункту правил:[/CENTER]<br>" +
        "[CENTER][ISPOILER][COLOR=RED]3.01[/COLOR] Общепризнанный язык сервера — русский. Общение в IC чатах во всех Role Play ситуациях обязательно должно проходить исключительно на русском языке [COLOR=RED]| Устное замечание / Mute 30 минут [/COLOR][/ISPOILER][/CENTER]<br>" +
        "[CENTER]Одобрено, закрыто.[/CENTER]<br>" +
        "[CENTER]С уважением, администратор курирующий форум Wililams_Nakajima![/CENTER]<br>" +
        "[CENTER]Спасибо за обращение. Приятной игры на BLACK RUSSIA - [color=aqua]AQUA[/color][/CENTER][/FONT]<br>" +
        "[CENTER][IMG]https://i.postimg.cc/0KfbtZ0J/IMG-4116.gif[/IMG][/CENTER]<br>",
      prefix: ACCEPT_PREFIX,
	  status: false,
},
 {
title: 'edit в лич целях',
content:
        '[FONT=georgia][CENTER]Доброго времени суток, уважаемый (-ая) {{ user.mention }}[/CENTER]<br>' +
        "[CENTER]Ваша жалоба одобрена, игрок понесёт наказание по следующему пункту правил:[/CENTER]<br>" +
        "[CENTER][ISPOILER][COLOR=RED]4.04[/COLOR] Запрещено редактировать поданные объявления в личных целях заменяя текст объявления на несоответствующий отправленному игроком [COLOR=RED]| Ban 7 дней + ЧС организации [/COLOR][/ISPOILER][/CENTER]<br>" +
        "[CENTER]Одобрено, закрыто.[/CENTER]<br>" +
        "[CENTER]С уважением, администратор курирующий форум Wililams_Nakajima![/CENTER]<br>" +
        "[CENTER]Спасибо за обращение. Приятной игры на BLACK RUSSIA - [color=aqua]AQUA[/color][/CENTER][/FONT]<br>" +
        "[CENTER][IMG]https://i.postimg.cc/0KfbtZ0J/IMG-4116.gif[/IMG][/CENTER]<br>",
      prefix: ACCEPT_PREFIX,
	  status: false,
},
  {
title: 'nrp обман',
content:
        '[FONT=georgia][CENTER]Доброго времени суток, уважаемый (-ая) {{ user.mention }}[/CENTER]<br>' +
        "[CENTER]Ваша жалоба одобрена, игрок понесёт наказание по следующему пункту правил:[/CENTER]<br>" +
        "[CENTER][ISPOILER][COLOR=RED]2.05[/COLOR] Запрещены любые OOC обманы и их попытки, а также любые IC обманы с нарушением Role Play правил и логики [COLOR=RED]| PermBan [/COLOR][/ISPOILER][/CENTER]<br>" +
        "[CENTER]Одобрено, закрыто.[/CENTER]<br>" +
        "[CENTER]С уважением, администратор курирующий форум Wililams_Nakajima![/CENTER]<br>" +
        "[CENTER]Спасибо за обращение. Приятной игры на BLACK RUSSIA - [color=aqua]AQUA[/color][/CENTER][/FONT]<br>" +
        "[CENTER][IMG]https://i.postimg.cc/0KfbtZ0J/IMG-4116.gif[/IMG][/CENTER]<br>",
      prefix: ACCEPT_PREFIX,
	  status: false,
},
  {
title: 'nrp поведение',
content:
        '[FONT=georgia][CENTER]Доброго времени суток, уважаемый (-ая) {{ user.mention }}[/CENTER]<br>' +
        "[CENTER]Ваша жалоба одобрена, игрок понесёт наказание по следующему пункту правил:[/CENTER]<br>" +
        "[CENTER][ISPOILER][COLOR=RED]2.01[/COLOR] Запрещено поведение, нарушающее нормы процессов Role Play режима игры [COLOR=RED]| Jail 30 минут [/COLOR][/ISPOILER][/CENTER]<br>" +
        "[CENTER]Одобрено, закрыто.[/CENTER]<br>" +
        "[CENTER]С уважением, администратор курирующий форум Wililams_Nakajima![/CENTER]<br>" +
        "[CENTER]Спасибо за обращение. Приятной игры на BLACK RUSSIA - [color=aqua]AQUA[/color][/CENTER][/FONT]<br>" +
        "[CENTER][IMG]https://i.postimg.cc/0KfbtZ0J/IMG-4116.gif[/IMG][/CENTER]<br>",
      prefix: ACCEPT_PREFIX,
	  status: false,
},
   {
title: 'nrp коп',
content:
        '[FONT=georgia][CENTER]Доброго времени суток, уважаемый (-ая) {{ user.mention }}[/CENTER]<br>' +
        "[CENTER]Ваша жалоба одобрена, игрок понесёт наказание по следующему пункту правил:[/CENTER]<br>" +
        "[CENTER][ISPOILER][COLOR=RED]6.03[/COLOR] Запрещено nRP поведение [COLOR=RED]| Warn [/COLOR][/ISPOILER][/CENTER]<br>" +
        "[CENTER]Одобрено, закрыто.[/CENTER]<br>" +
        "[CENTER]С уважением, администратор курирующий форум Wililams_Nakajima![/CENTER]<br>" +
        "[CENTER]Спасибо за обращение. Приятной игры на BLACK RUSSIA - [color=aqua]AQUA[/color][/CENTER][/FONT]<br>" +
        "[CENTER][IMG]https://i.postimg.cc/0KfbtZ0J/IMG-4116.gif[/IMG][/CENTER]<br>",
      prefix: ACCEPT_PREFIX,
	  status: false,
},
  {
title: 'nrp вч',
content:
        '[FONT=georgia][CENTER]Доброго времени суток, уважаемый (-ая) {{ user.mention }}[/CENTER]<br>' +
        "[CENTER]Ваша жалоба одобрена, игрок понесёт наказание по следующему пункту правил:[/CENTER]<br>" +
        "[CENTER][ISPOILER][COLOR=RED]Пункт 2 Правил нападения на Военную часть[/COLOR] За нарушение правил нападения на Воинскую Часть выдаётся предупреждение [COLOR=RED]| Jail 30 минут (NonRP нападение) / Warn (Для сотрудников ОПГ) [/COLOR][/ISPOILER][/CENTER]<br>" +
        "[CENTER]Одобрено, закрыто.[/CENTER]<br>" +
        "[CENTER]С уважением, администратор курирующий форум Wililams_Nakajima![/CENTER]<br>" +
        "[CENTER]Спасибо за обращение. Приятной игры на BLACK RUSSIA - [color=aqua]AQUA[/color][/CENTER][/FONT]<br>" +
        "[CENTER][IMG]https://i.postimg.cc/0KfbtZ0J/IMG-4116.gif[/IMG][/CENTER]<br>",
      prefix: ACCEPT_PREFIX,
	  status: false,
},
    {
title: 'nrp акс',
content:
        '[FONT=georgia][CENTER]Доброго времени суток, уважаемый (-ая) {{ user.mention }}[/CENTER]<br>' +
        "[CENTER]Ваша жалоба одобрена, игрок понесёт наказание по следующему пункту правил:[/CENTER]<br>" +
        "[CENTER][ISPOILER][COLOR=RED]2.52[/COLOR] Запрещено располагать аксессуары на теле персонажа, нарушая нормы морали и этики, увеличивать аксессуары до слишком большого размера. [COLOR=RED]| При первом нарушении - обнуление аксессуаров, при повторном нарушении - обнуление аксессуаров + JAIL 30 минут[/COLOR][/ISPOILER][/CENTER]<br>" +
        "[CENTER]Одобрено, закрыто.[/CENTER]<br>" +
        "[CENTER]С уважением, администратор курирующий форум Wililams_Nakajima![/CENTER]<br>" +
        "[CENTER]Спасибо за обращение. Приятной игры на BLACK RUSSIA - [color=aqua]AQUA[/color][/CENTER][/FONT]<br>" +
        "[CENTER][IMG]https://i.postimg.cc/0KfbtZ0J/IMG-4116.gif[/IMG][/CENTER]<br>",
      prefix: ACCEPT_PREFIX,
	  status: false,
},
  {
      title: '――――――――――――――――――――――――Отказано――――――――――――――――――――――――',
  },
    {
title: 'нет условий сделки',
content:
        '[FONT=georgia][CENTER]Доброго времени суток, уважаемый (-ая) {{ user.mention }}[/CENTER]<br>' +
        "[CENTER]Ваша жалоба отказана, на вашей видеофиксации отсутствуют условия сделки.[/CENTER]<br>" +
        "[CENTER]Отказано, закрыто.[/CENTER]<br>" +
        "[CENTER]С уважением, администратор курирующий форум Wililams_Nakajima![/CENTER]<br>" +
        "[CENTER]Спасибо за обращение. Приятной игры на BLACK RUSSIA - [color=aqua]AQUA[/color][/CENTER][/FONT]<br>" +
        "[CENTER][IMG]https://i.postimg.cc/0KfbtZ0J/IMG-4116.gif[/IMG][/CENTER]<br>",
      prefix: UNACCEPT_PREFIX,
	  status: false,
},
  {
title: 'недостаточо док-в',
content:
        '[FONT=georgia][CENTER]Доброго времени суток, уважаемый (-ая) {{ user.mention }}[/CENTER]<br>' +
        "[CENTER]Ваша жалоба отказана, недостаточно доказательств для выноса вердикта.[/CENTER]<br>" +
        "[CENTER]Отказано, закрыто.[/CENTER]<br>" +
        "[CENTER]С уважением, администратор курирующий форум Wililams_Nakajima![/CENTER]<br>" +
        "[CENTER]Спасибо за обращение. Приятной игры на BLACK RUSSIA - [color=aqua]AQUA[/color][/CENTER][/FONT]<br>" +
        "[CENTER][IMG]https://i.postimg.cc/0KfbtZ0J/IMG-4116.gif[/IMG][/CENTER]<br>",
      prefix: UNACCEPT_PREFIX,
	  status: false,
},
  {
title: 'не работают доки',
content:
        '[FONT=georgia][CENTER]Доброго времени суток, уважаемый (-ая) {{ user.mention }}[/CENTER]<br>' +
        "[CENTER]Ваша жалоба отказана, ваши доказательства недоступны к просмотру.[/CENTER]<br>" +
        "[CENTER]Отказано, закрыто.[/CENTER]<br>" +
        "[CENTER]С уважением, администратор курирующий форум Wililams_Nakajima![/CENTER]<br>" +
        "[CENTER]Спасибо за обращение. Приятной игры на BLACK RUSSIA - [color=aqua]AQUA[/color][/CENTER][/FONT]<br>" +
        "[CENTER][IMG]https://i.postimg.cc/0KfbtZ0J/IMG-4116.gif[/IMG][/CENTER]<br>",
      prefix: UNACCEPT_PREFIX,
	  status: false,
},
  {
title: 'нет доков',
content:
        '[FONT=georgia][CENTER]Доброго времени суток, уважаемый (-ая) {{ user.mention }}[/CENTER]<br>' +
        "[CENTER]Ваша жалоба отказана, отсутствуют доказательства. Загрузите доказательства на фото/видео хостинг.[/CENTER]<br>" +
        "[CENTER]Отказано, закрыто.[/CENTER]<br>" +
        "[CENTER]С уважением, администратор курирующий форум Wililams_Nakajima![/CENTER]<br>" +
        "[CENTER]Спасибо за обращение. Приятной игры на BLACK RUSSIA - [color=aqua]AQUA[/color][/CENTER][/FONT]<br>" +
        "[CENTER][IMG]https://i.postimg.cc/0KfbtZ0J/IMG-4116.gif[/IMG][/CENTER]<br>",
      prefix: UNACCEPT_PREFIX,
	  status: false,
},
   {
title: 'док-ва в соц сетях',
content:
        '[FONT=georgia][CENTER]Доброго времени суток, уважаемый (-ая) {{ user.mention }}[/CENTER]<br>' +
        "[CENTER]Ваша жалоба отказана, доказательства загруженные в соц.сети (VK, Telegram и тому подобные) к просмотрам не допускаются. Загрузите доказательства на фото/видео хостинг.[/CENTER]<br>" +
        "[CENTER]Отказано, закрыто.[/CENTER]<br>" +
        "[CENTER]С уважением, администратор курирующий форум Wililams_Nakajima![/CENTER]<br>" +
        "[CENTER]Спасибо за обращение. Приятной игры на BLACK RUSSIA - [color=aqua]AQUA[/color][/CENTER][/FONT]<br>" +
        "[CENTER][IMG]https://i.postimg.cc/0KfbtZ0J/IMG-4116.gif[/IMG][/CENTER]<br>",
      prefix: UNACCEPT_PREFIX,
	  status: false,
},
   {
title: 'нет нарушений',
content:
        '[FONT=georgia][CENTER]Доброго времени суток, уважаемый (-ая) {{ user.mention }}[/CENTER]<br>' +
        "[CENTER]Ваша жалоба отказана, после просмотра ваших доказательств - нарушений от игрока найдено не было.[/CENTER]<br>" +
        "[CENTER]Отказано, закрыто.[/CENTER]<br>" +
        "[CENTER]С уважением, администратор курирующий форум Wililams_Nakajima![/CENTER]<br>" +
        "[CENTER]Спасибо за обращение. Приятной игры на BLACK RUSSIA - [color=aqua]AQUA[/color][/CENTER][/FONT]<br>" +
        "[CENTER][IMG]https://i.postimg.cc/0KfbtZ0J/IMG-4116.gif[/IMG][/CENTER]<br>",
      prefix: UNACCEPT_PREFIX,
	  status: false,
},
   {
title: 'нет нарушений после логов ГКФ/ЗГКФ',
content:
        '[FONT=georgia][CENTER]Доброго времени суток, уважаемый (-ая) {{ user.mention }}[/CENTER]<br>' +
        "[CENTER]Ваша жалоба отказана, после проверки системы логирования - нарушений найдено не было.[/CENTER]<br>" +
        "[CENTER]Отказано, закрыто.[/CENTER]<br>" +
        "[CENTER]С уважением, администратор курирующий форум Wililams_Nakajima![/CENTER]<br>" +
        "[CENTER]Спасибо за обращение. Приятной игры на BLACK RUSSIA - [color=aqua]AQUA[/color][/CENTER][/FONT]<br>" +
        "[CENTER][IMG]https://i.postimg.cc/0KfbtZ0J/IMG-4116.gif[/IMG][/CENTER]<br>",
      prefix: UNACCEPT_PREFIX,
	  status: false,
},
   {
title: 'нет time',
content:
        '[FONT=georgia][CENTER]Доброго времени суток, уважаемый (-ая) {{ user.mention }}[/CENTER]<br>' +
        "[CENTER]Ваша жалоба отказана, на ваших доказательствах отсутствует /time.[/CENTER]<br>" +
        "[CENTER]Отказано, закрыто.[/CENTER]<br>" +
        "[CENTER]С уважением, администратор курирующий форум Wililams_Nakajima![/CENTER]<br>" +
        "[CENTER]Спасибо за обращение. Приятной игры на BLACK RUSSIA - [color=aqua]AQUA[/color][/CENTER][/FONT]<br>" +
        "[CENTER][IMG]https://i.postimg.cc/0KfbtZ0J/IMG-4116.gif[/IMG][/CENTER]<br>",
      prefix: UNACCEPT_PREFIX,
	  status: false,
},
  {
title: 'док-ва отредакт',
content:
        '[FONT=georgia][CENTER]Доброго времени суток, уважаемый (-ая) {{ user.mention }}[/CENTER]<br>' +
        "[CENTER]Ваша жалоба отказана, доказательства были подвергнуты редактированию, к просмотрам не допускается. Вы можете быть наказаны по пункту - [ISPOILER][color=red]2.32.[/color] Запрещено введение в заблуждение, обман администрации на всех ресурсах проекта [color=red]| Ban 7 - 15 дней.[/color][/ISPOILER][/CENTER]<br>" +
        "[CENTER]Отказано, закрыто.[/CENTER]<br>" +
        "[CENTER]С уважением, администратор курирующий форум Wililams_Nakajima![/CENTER]<br>" +
        "[CENTER]Спасибо за обращение. Приятной игры на BLACK RUSSIA - [color=aqua]AQUA[/color][/CENTER][/FONT]<br>" +
        "[CENTER][IMG]https://i.postimg.cc/0KfbtZ0J/IMG-4116.gif[/IMG][/CENTER]<br>",
      prefix: UNACCEPT_PREFIX,
	  status: false,
},
   {
title: 'док-ва обрываются',
content:
        '[FONT=georgia][CENTER]Доброго времени суток, уважаемый (-ая) {{ user.mention }}[/CENTER]<br>' +
        "[CENTER]Ваша жалоба отказана, ваши доказательства обрываются. Загрузите полный фрапс на YouTube / любой другой видеохостинг.[/CENTER]<br>" +
        "[CENTER]Отказано, закрыто.[/CENTER]<br>" +
        "[CENTER]С уважением, администратор курирующий форум Wililams_Nakajima![/CENTER]<br>" +
        "[CENTER]Спасибо за обращение. Приятной игры на BLACK RUSSIA - [color=aqua]AQUA[/color][/CENTER][/FONT]<br>" +
        "[CENTER][IMG]https://i.postimg.cc/0KfbtZ0J/IMG-4116.gif[/IMG][/CENTER]<br>",
      prefix: UNACCEPT_PREFIX,
	  status: false,
},
   {
title: 'нет таймкодов',
content:
        '[FONT=georgia][CENTER]Доброго времени суток, уважаемый (-ая) {{ user.mention }}[/CENTER]<br>' +
        "[CENTER]Ваша жалоба отказана, на ваших доказательствах отсутствуют тайм-коды, согласно правил - Если видеодоказательство длится более 3 минут, Вы должны указать тайм-коды нарушений.[/CENTER]<br>" +
        "[CENTER]Отказано, закрыто.[/CENTER]<br>" +
        "[CENTER]С уважением, администратор курирующий форум Wililams_Nakajima![/CENTER]<br>" +
        "[CENTER]Спасибо за обращение. Приятной игры на BLACK RUSSIA - [color=aqua]AQUA[/color][/CENTER][/FONT]<br>" +
        "[CENTER][IMG]https://i.postimg.cc/0KfbtZ0J/IMG-4116.gif[/IMG][/CENTER]<br>",
      prefix: UNACCEPT_PREFIX,
	  status: false,
},
  {
title: 'прошло 72 часа',
content:
        '[FONT=georgia][CENTER]Доброго времени суток, уважаемый (-ая) {{ user.mention }}[/CENTER]<br>' +
        "[CENTER]Ваша жалоба отказана, с момента нарушения правил прошло более 72 часов.[/CENTER]<br>" +
        "[CENTER]Отказано, закрыто.[/CENTER]<br>" +
        "[CENTER]С уважением, администратор курирующий форум Wililams_Nakajima![/CENTER]<br>" +
        "[CENTER]Спасибо за обращение. Приятной игры на BLACK RUSSIA - [color=aqua]AQUA[/color][/CENTER][/FONT]<br>" +
        "[CENTER][IMG]https://i.postimg.cc/0KfbtZ0J/IMG-4116.gif[/IMG][/CENTER]<br>",
      prefix: UNACCEPT_PREFIX,
	  status: false,
},
   {
title: 'от 3-его лица',
content:
        '[FONT=georgia][CENTER]Доброго времени суток, уважаемый (-ая) {{ user.mention }}[/CENTER]<br>' +
        "[CENTER]Ваша жалоба отказана, написана от третьего лица.[/CENTER]<br>" +
        "[CENTER]Отказано, закрыто.[/CENTER]<br>" +
        "[CENTER]С уважением, администратор курирующий форум Wililams_Nakajima![/CENTER]<br>" +
        "[CENTER]Спасибо за обращение. Приятной игры на BLACK RUSSIA - [color=aqua]AQUA[/color][/CENTER][/FONT]<br>" +
        "[CENTER][IMG]https://i.postimg.cc/0KfbtZ0J/IMG-4116.gif[/IMG][/CENTER]<br>",
      prefix: UNACCEPT_PREFIX,
	  status: false,
},
    {
title: 'Уже был ответ',
content:
        '[FONT=georgia][CENTER]Доброго времени суток, уважаемый (-ая) {{ user.mention }}[/CENTER]<br>' +
        "[CENTER]Ваша жалоба отказана, ответ по вашей жалобе был дан ранее. Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/CENTER]<br>" +
        "[CENTER]Отказано, закрыто.[/CENTER]<br>" +
        "[CENTER]С уважением, администратор курирующий форум Wililams_Nakajima![/CENTER]<br>" +
        "[CENTER]Спасибо за обращение. Приятной игры на BLACK RUSSIA - [color=aqua]AQUA[/color][/CENTER][/FONT]<br>" +
        "[CENTER][IMG]https://i.postimg.cc/0KfbtZ0J/IMG-4116.gif[/IMG][/CENTER]<br>",
      prefix: UNACCEPT_PREFIX,
	  status: false,
},
  {
title: 'Уже был наказан',
content:
        '[FONT=georgia][CENTER]Доброго времени суток, уважаемый (-ая) {{ user.mention }}[/CENTER]<br>' +
        "[CENTER]Ваша жалоба отказана, игрок уже был наказан по этой причине.[/CENTER]<br>" +
        "[CENTER]Отказано, закрыто.[/CENTER]<br>" +
        "[CENTER]С уважением, администратор курирующий форум Wililams_Nakajima![/CENTER]<br>" +
        "[CENTER]Спасибо за обращение. Приятной игры на BLACK RUSSIA - [color=aqua]AQUA[/color][/CENTER][/FONT]<br>" +
        "[CENTER][IMG]https://i.postimg.cc/0KfbtZ0J/IMG-4116.gif[/IMG][/CENTER]<br>",
      prefix: UNACCEPT_PREFIX,
	  status: false,
},
  {
title: 'не по форме',
content:
        '[FONT=georgia][CENTER]Доброго времени суток, уважаемый (-ая) {{ user.mention }}[/CENTER]<br>' +
        "[CENTER]Ваша жалоба отказана, внимательно прочтите правила подачи жалобы на игроков, закрепленные в этом разделе.[/CENTER]<br>" +
        "[CENTER]Отказано, закрыто.[/CENTER]<br>" +
        "[CENTER]С уважением, администратор курирующий форум Wililams_Nakajima![/CENTER]<br>" +
        "[CENTER]Спасибо за обращение. Приятной игры на BLACK RUSSIA - [color=aqua]AQUA[/color][/CENTER][/FONT]<br>" +
        "[CENTER][IMG]https://i.postimg.cc/0KfbtZ0J/IMG-4116.gif[/IMG][/CENTER]<br>",
      prefix: UNACCEPT_PREFIX,
	  status: false,
},
    {
title: 'нет доступа',
content:
        '[FONT=georgia][CENTER]Доброго времени суток, уважаемый (-ая) {{ user.mention }}[/CENTER]<br>' +
        "[CENTER]Ваша жалоба отказана, отсутствует доступ к просмотру доказательств.[/CENTER]<br>" +
        "[CENTER]Отказано, закрыто.[/CENTER]<br>" +
        "[CENTER]С уважением, администратор курирующий форум Wililams_Nakajima![/CENTER]<br>" +
        "[CENTER]Спасибо за обращение. Приятной игры на BLACK RUSSIA - [color=aqua]AQUA[/color][/CENTER][/FONT]<br>" +
        "[CENTER][IMG]https://i.postimg.cc/0KfbtZ0J/IMG-4116.gif[/IMG][/CENTER]<br>",
      prefix: UNACCEPT_PREFIX,
	  status: false,
},
   {
title: 'нужен фрапс',
content:
        '[FONT=georgia][CENTER]Доброго времени суток, уважаемый (-ая) {{ user.mention }}[/CENTER]<br>' +
        "[CENTER]Ваша жалоба отказана, необходимы видео-доказательства, иначе ваша жалоба не допускается к рассмотрению.[/CENTER]<br>" +
        "[CENTER]Отказано, закрыто.[/CENTER]<br>" +
        "[CENTER]С уважением, администратор курирующий форум Wililams_Nakajima![/CENTER]<br>" +
        "[CENTER]Спасибо за обращение. Приятной игры на BLACK RUSSIA - [color=aqua]AQUA[/color][/CENTER][/FONT]<br>" +
        "[CENTER][IMG]https://i.postimg.cc/0KfbtZ0J/IMG-4116.gif[/IMG][/CENTER]<br>",
      prefix: UNACCEPT_PREFIX,
	  status: false,
},
  {
title: 'в жб на сотрудников',
content:
        '[FONT=georgia][CENTER]Доброго времени суток, уважаемый (-ая) {{ user.mention }}[/CENTER]<br>' +
        "[CENTER]Ваша жалоба отказана, обратитесь в раздел <Жалобы на сотрудников организации>.[/CENTER]<br>" +
        "[CENTER]Отказано, закрыто.[/CENTER]<br>" +
        "[CENTER]С уважением, администратор курирующий форум Wililams_Nakajima![/CENTER]<br>" +
        "[CENTER]Спасибо за обращение. Приятной игры на BLACK RUSSIA - [color=aqua]AQUA[/color][/CENTER][/FONT]<br>" +
        "[CENTER][IMG]https://i.postimg.cc/0KfbtZ0J/IMG-4116.gif[/IMG][/CENTER]<br>",
      prefix: UNACCEPT_PREFIX,
	  status: false,
},
   {
      title: '――――――――――――――――――――――――Передача――――――――――――――――――――――――',
	},
   {
title: 'на рассмотрении',
content:
        '[FONT=georgia][CENTER]Доброго времени суток, уважаемый (-ая) {{ user.mention }}[/CENTER]<br>' +
        "[CENTER]Ваша жалоба перенесена на стадию рассмотрения, ожидайте вердикта от администрации.[/CENTER]<br>" +
        "[CENTER]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/CENTER]<br>" +
        "[CENTER]С уважением, администратор курирующий форум Wililams_Nakajima![/CENTER]<br>" +
        "[CENTER]Спасибо за обращение. Приятной игры на BLACK RUSSIA - [color=aqua]AQUA[/color][/CENTER][/FONT]<br>" +
        "[CENTER][IMG]https://i.postimg.cc/0KfbtZ0J/IMG-4116.gif[/IMG][/CENTER]<br>",
      prefix: PIN_PREFIX,
	  status: true,
},
   {
title: 'передать гкф/згкф',
content:
        '[FONT=georgia][CENTER]Доброго времени суток, уважаемый (-ая) {{ user.mention }}[/CENTER]<br>' +
        "[CENTER]Ваша жалоба переадресована ГКФ/ЗГКФ, ожидайте вердикта от администрации.[/CENTER]<br>" +
        "[CENTER]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/CENTER]<br>" +
        "[CENTER]С уважением, администратор курирующий форум Wililams_Nakajima![/CENTER]<br>" +
        "[CENTER]Спасибо за обращение. Приятной игры на BLACK RUSSIA - [color=aqua]AQUA[/color][/CENTER][/FONT]<br>" +
        "[CENTER][IMG]https://i.postimg.cc/0KfbtZ0J/IMG-4116.gif[/IMG][/CENTER]<br>",
      prefix: PIN_PREFIX,
	  status: true,
},
   {
title: 'передать теху',
content:
        '[FONT=georgia][CENTER]Доброго времени суток, уважаемый (-ая) {{ user.mention }}[/CENTER]<br>' +
        "[CENTER]Ваша жалоба переадресована Техническому Специалисту, ожидайте вердикта от администрации.[/CENTER]<br>" +
        "[CENTER]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/CENTER]<br>" +
        "[CENTER]С уважением, администратор курирующий форум Wililams_Nakajima![/CENTER]<br>" +
        "[CENTER]Спасибо за обращение. Приятной игры на BLACK RUSSIA - [color=aqua]AQUA[/color][/CENTER][/FONT]<br>" +
        "[CENTER][IMG]https://i.postimg.cc/0KfbtZ0J/IMG-4116.gif[/IMG][/CENTER]<br>",
      prefix: TEX_PREFIX,
	  status: true,
},
   {
title: 'передать ГА/ЗГА',
content:
        '[FONT=georgia][CENTER]Доброго времени суток, уважаемый (-ая) {{ user.mention }}[/CENTER]<br>' +
        "[CENTER]Ваша жалоба переадресована ГА/ЗГА, ожидайте вердикта от главной администрации сервера.[/CENTER]<br>" +
        "[CENTER]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/CENTER]<br>" +
        "[CENTER]С уважением, администратор курирующий форум Wililams_Nakajima![/CENTER]<br>" +
        "[CENTER]Спасибо за обращение. Приятной игры на BLACK RUSSIA - [color=aqua]AQUA[/color][/CENTER][/FONT]<br>" +
        "[CENTER][IMG]https://i.postimg.cc/0KfbtZ0J/IMG-4116.gif[/IMG][/CENTER]<br>",
      prefix: GA_PREFIX,
	  status: true,
},
{
      title: '――――――――――――――――――――――РП БИОГРАФИИ――――――――――――――――――――――',
},
{
title: 'одобрено',
content:
        '[FONT=georgia][CENTER]Доброго времени суток, уважаемый (-ая) {{ user.mention }}[/CENTER]<br>' +
        "[CENTER]Ваша биография была внимательно проверена, устанавливается префикс - одобрено.[/CENTER]<br>" +
        "[CENTER]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/CENTER]<br>" +
        "[CENTER]С уважением, администратор курирующий форум Wililams_Nakajima![/CENTER]<br>" +
        "[CENTER]Спасибо за обращение. Приятной игры на BLACK RUSSIA - [color=aqua]AQUA[/color][/CENTER][/FONT]<br>" +
        "[CENTER][IMG]https://i.postimg.cc/0KfbtZ0J/IMG-4116.gif[/IMG][/CENTER]<br>",
      prefix: ACCEPT_PREFIX,
	  status: false,
},
   {
title: 'отказана',
content:
        '[FONT=georgia][CENTER]Доброго времени суток, уважаемый (-ая) {{ user.mention }}[/CENTER]<br>' +
        "[CENTER]Ваша биография была внимательно проверена, устанавливается префикс - отказано.[/CENTER]<br>" +
        '[CENTER]Причиной отказа послужило - [/CENTER]<br>' +
        "[CENTER]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/CENTER]<br>" +
        "[CENTER]С уважением, администратор курирующий форум Wililams_Nakajima![/CENTER]<br>" +
        "[CENTER]Спасибо за обращение. Приятной игры на BLACK RUSSIA - [color=aqua]AQUA[/color][/CENTER][/FONT]<br>" +
        "[CENTER][IMG]https://i.postimg.cc/0KfbtZ0J/IMG-4116.gif[/IMG][/CENTER]<br>",
      prefix: UNACCEPT_PREFIX,
	  status: false,
},
   {
title: 'не по форме',
content:
        '[FONT=georgia][CENTER]Доброго времени суток, уважаемый (-ая) {{ user.mention }}[/CENTER]<br>' +
        "[CENTER]Ваша биография была внимательно проверена, устанавливается префикс - отказано.[/CENTER]<br>" +
        '[CENTER]Причиной отказа послужило - заполнение не по форме, внимательно ознакомьтесь с правилами создания биографии. [/CENTER]<br>' +
        "[CENTER]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/CENTER]<br>" +
        "[CENTER]С уважением, администратор курирующий форум Wililams_Nakajima![/CENTER]<br>" +
        "[CENTER]Спасибо за обращение. Приятной игры на BLACK RUSSIA - [color=aqua]AQUA[/color][/CENTER][/FONT]<br>" +
        "[CENTER][IMG]https://i.postimg.cc/0KfbtZ0J/IMG-4116.gif[/IMG][/CENTER]<br>",
      prefix: UNACCEPT_PREFIX,
	  status: false,
},
   {
title: 'заголовок не по форме',
content:
        '[FONT=georgia][CENTER]Доброго времени суток, уважаемый (-ая) {{ user.mention }}[/CENTER]<br>' +
        "[CENTER]Ваша биография была внимательно проверена, устанавливается префикс - отказано.[/CENTER]<br>" +
        '[CENTER]Причиной отказа послужило - составление заголовка не по форме.[/CENTER]<br>' +
        "[CENTER]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/CENTER]<br>" +
        "[CENTER]С уважением, администратор курирующий форум Wililams_Nakajima![/CENTER]<br>" +
        "[CENTER]Спасибо за обращение. Приятной игры на BLACK RUSSIA - [color=aqua]AQUA[/color][/CENTER][/FONT]<br>" +
        "[CENTER][IMG]https://i.postimg.cc/0KfbtZ0J/IMG-4116.gif[/IMG][/CENTER]<br>",
      prefix: UNACCEPT_PREFIX,
	  status: false,
},
   {
title: 'не дополнил',
content:
        '[FONT=georgia][CENTER]Доброго времени суток, уважаемый (-ая) {{ user.mention }}[/CENTER]<br>' +
        "[CENTER]Ваша биография была внимательно проверена, устанавливается префикс - отказано.[/CENTER]<br>" +
        '[CENTER]Причиной отказа послужило - отсутствие изменений после выделенного срока на доработки от администратора. [/CENTER]<br>' +
        "[CENTER]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/CENTER]<br>" +
        "[CENTER]С уважением, администратор курирующий форум Wililams_Nakajima![/CENTER]<br>" +
        "[CENTER]Спасибо за обращение. Приятной игры на BLACK RUSSIA - [color=aqua]AQUA[/color][/CENTER][/FONT]<br>" +
        "[CENTER][IMG]https://i.postimg.cc/0KfbtZ0J/IMG-4116.gif[/IMG][/CENTER]<br>",
      prefix: UNACCEPT_PREFIX,
	  status: false,
},
   {
title: 'неграмотная',
content:
        '[FONT=georgia][CENTER]Доброго времени суток, уважаемый (-ая) {{ user.mention }}[/CENTER]<br>' +
        "[CENTER]Ваша биография была внимательно проверена, устанавливается префикс - отказано.[/CENTER]<br>" +
        '[CENTER]Причиной отказа послужило - неграмотное оформление биографии, внимательно проверьте наличие грамматических и пунктуационных ошибок в тексте. [/CENTER]<br>' +
        "[CENTER]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/CENTER]<br>" +
        "[CENTER]С уважением, администратор курирующий форум Wililams_Nakajima![/CENTER]<br>" +
        "[CENTER]Спасибо за обращение. Приятной игры на BLACK RUSSIA - [color=aqua]AQUA[/color][/CENTER][/FONT]<br>" +
        "[CENTER][IMG]https://i.postimg.cc/0KfbtZ0J/IMG-4116.gif[/IMG][/CENTER]<br>",
      prefix: UNACCEPT_PREFIX,
	  status: false,
},
  {
title: 'от 3-его лица',
content:
        '[FONT=georgia][CENTER]Доброго времени суток, уважаемый (-ая) {{ user.mention }}[/CENTER]<br>' +
        "[CENTER]Ваша биография была внимательно проверена, устанавливается префикс - отказано.[/CENTER]<br>" +
        '[CENTER]Причиной отказа послужило - оформление биографии от 3-го лица. [/CENTER]<br>' +
        "[CENTER]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/CENTER]<br>" +
        "[CENTER]С уважением, администратор курирующий форум Wililams_Nakajima![/CENTER]<br>" +
        "[CENTER]Спасибо за обращение. Приятной игры на BLACK RUSSIA - [color=aqua]AQUA[/color][/CENTER][/FONT]<br>" +
        "[CENTER][IMG]https://i.postimg.cc/0KfbtZ0J/IMG-4116.gif[/IMG][/CENTER]<br>",
      prefix: UNACCEPT_PREFIX,
	  status: false,
},
  {
title: 'уже одобрена',
content:
        '[FONT=georgia][CENTER]Доброго времени суток, уважаемый (-ая) {{ user.mention }}[/CENTER]<br>' +
        "[CENTER]Ваша биография была внимательно проверена, устанавливается префикс - отказано.[/CENTER]<br>" +
        '[CENTER]Причиной отказа послужило - ранее она была одобрена.[/CENTER]<br>' +
        "[CENTER]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/CENTER]<br>" +
        "[CENTER]С уважением, администратор курирующий форум Wililams_Nakajima![/CENTER]<br>" +
        "[CENTER]Спасибо за обращение. Приятной игры на BLACK RUSSIA - [color=aqua]AQUA[/color][/CENTER][/FONT]<br>" +
        "[CENTER][IMG]https://i.postimg.cc/0KfbtZ0J/IMG-4116.gif[/IMG][/CENTER]<br>",
      prefix: UNACCEPT_PREFIX,
	  status: false,
},
   {
title: 'супергерой',
content:
        '[FONT=georgia][CENTER]Доброго времени суток, уважаемый (-ая) {{ user.mention }}[/CENTER]<br>' +
        "[CENTER]Ваша биография была внимательно проверена, устанавливается префикс - отказано.[/CENTER]<br>" +
        '[CENTER]Причиной отказа послужило - Вы присвоили персонажу супер-способности, которыми он не может владеть.[/CENTER]<br>' +
        "[CENTER]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/CENTER]<br>" +
        "[CENTER]С уважением, администратор курирующий форум Wililams_Nakajima![/CENTER]<br>" +
        "[CENTER]Спасибо за обращение. Приятной игры на BLACK RUSSIA - [color=aqua]AQUA[/color][/CENTER][/FONT]<br>" +
        "[CENTER][IMG]https://i.postimg.cc/0KfbtZ0J/IMG-4116.gif[/IMG][/CENTER]<br>",
      prefix: UNACCEPT_PREFIX,
	  status: false,
},
   {
title: 'копипаст',
content:
        '[FONT=georgia][CENTER]Доброго времени суток, уважаемый (-ая) {{ user.mention }}[/CENTER]<br>' +
        "[CENTER]Ваша биография была внимательно проверена, устанавливается префикс - отказано.[/CENTER]<br>" +
        '[CENTER]Причиной отказа послужило - биография была скопирована.[/CENTER]<br>' +
        "[CENTER]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/CENTER]<br>" +
        "[CENTER]С уважением, администратор курирующий форум Wililams_Nakajima![/CENTER]<br>" +
        "[CENTER]Спасибо за обращение. Приятной игры на BLACK RUSSIA - [color=aqua]AQUA[/color][/CENTER][/FONT]<br>" +
        "[CENTER][IMG]https://i.postimg.cc/0KfbtZ0J/IMG-4116.gif[/IMG][/CENTER]<br>",
      prefix: UNACCEPT_PREFIX,
	  status: false,
},
   {
title: 'nrp ник',
content:
        '[FONT=georgia][CENTER]Доброго времени суток, уважаемый (-ая) {{ user.mention }}[/CENTER]<br>' +
        "[CENTER]Ваша биография была внимательно проверена, устанавливается префикс - отказано.[/CENTER]<br>" +
        '[CENTER]Причиной отказа послужило - в биографии используется никнейм, не соответствующий рамкам RolePlay процессов (NonRP NickName) [/CENTER]<br>' +
        "[CENTER]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/CENTER]<br>" +
        "[CENTER]С уважением, администратор курирующий форум Wililams_Nakajima![/CENTER]<br>" +
        "[CENTER]Спасибо за обращение. Приятной игры на BLACK RUSSIA - [color=aqua]AQUA[/color][/CENTER][/FONT]<br>" +
        "[CENTER][IMG]https://i.postimg.cc/0KfbtZ0J/IMG-4116.gif[/IMG][/CENTER]<br>",
      prefix: UNACCEPT_PREFIX,
	  status: false,
},
   {
title: 'ник на англ',
content:
        '[FONT=georgia][CENTER]Доброго времени суток, уважаемый (-ая) {{ user.mention }}[/CENTER]<br>' +
        "[CENTER]Ваша биография была внимательно проверена, устанавливается префикс - отказано.[/CENTER]<br>" +
        '[CENTER]Причиной отказа послужило - никнейм в биографии русским языком, например - Wililams_Nakajima - Уильямс Накадзима[/CENTER]<br>' +
        "[CENTER]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/CENTER]<br>" +
        "[CENTER]С уважением, администратор курирующий форум Wililams_Nakajima![/CENTER]<br>" +
        "[CENTER]Спасибо за обращение. Приятной игры на BLACK RUSSIA - [color=aqua]AQUA[/color][/CENTER][/FONT]<br>" +
        "[CENTER][IMG]https://i.postimg.cc/0KfbtZ0J/IMG-4116.gif[/IMG][/CENTER]<br>",
      prefix: UNACCEPT_PREFIX,
	  status: false,
},
   {
title: 'дата рождения с годом',
content:
        '[FONT=georgia][CENTER]Доброго времени суток, уважаемый (-ая) {{ user.mention }}[/CENTER]<br>' +
        "[CENTER]Ваша биография была внимательно проверена, устанавливается префикс - отказано.[/CENTER]<br>" +
        '[CENTER]Причиной отказа послужило - дата рождения не совпадает с возрастом персонажа.[/CENTER]<br>' +
        "[CENTER]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/CENTER]<br>" +
        "[CENTER]С уважением, администратор курирующий форум Wililams_Nakajima![/CENTER]<br>" +
        "[CENTER]Спасибо за обращение. Приятной игры на BLACK RUSSIA - [color=aqua]AQUA[/color][/CENTER][/FONT]<br>" +
        "[CENTER][IMG]https://i.postimg.cc/0KfbtZ0J/IMG-4116.gif[/IMG][/CENTER]<br>",
      prefix: UNACCEPT_PREFIX,
	  status: false,
},
   {
title: 'семья не полностью',
content:
        '[FONT=georgia][CENTER]Доброго времени суток, уважаемый (-ая) {{ user.mention }}[/CENTER]<br>' +
        "[CENTER]Ваша биография была внимательно проверена, устанавливается префикс - отказано.[/CENTER]<br>" +
        '[CENTER]Причиной отказа послужило - пункт <Семья> - расписан не полностью.[/CENTER]<br>' +
        "[CENTER]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/CENTER]<br>" +
        "[CENTER]С уважением, администратор курирующий форум Wililams_Nakajima![/CENTER]<br>" +
        "[CENTER]Спасибо за обращение. Приятной игры на BLACK RUSSIA - [color=aqua]AQUA[/color][/CENTER][/FONT]<br>" +
        "[CENTER][IMG]https://i.postimg.cc/0KfbtZ0J/IMG-4116.gif[/IMG][/CENTER]<br>",
      prefix: UNACCEPT_PREFIX,
	  status: false,
},
  {
title: 'дата рождения не полностью',
content:
        '[FONT=georgia][CENTER]Доброго времени суток, уважаемый (-ая) {{ user.mention }}[/CENTER]<br>' +
        "[CENTER]Ваша биография была внимательно проверена, устанавливается префикс - отказано.[/CENTER]<br>" +
        '[CENTER]Причиной отказа послужило - дата рождения написана не полностью.[/CENTER]<br>' +
        "[CENTER]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/CENTER]<br>" +
        "[CENTER]С уважением, администратор курирующий форум Wililams_Nakajima![/CENTER]<br>" +
        "[CENTER]Спасибо за обращение. Приятной игры на BLACK RUSSIA - [color=aqua]AQUA[/color][/CENTER][/FONT]<br>" +
        "[CENTER][IMG]https://i.postimg.cc/0KfbtZ0J/IMG-4116.gif[/IMG][/CENTER]<br>",
      prefix: UNACCEPT_PREFIX,
	  status: false,
},
    {
title: 'не туда',
content:
        '[FONT=georgia][CENTER]Доброго времени суток, уважаемый (-ая) {{ user.mention }}[/CENTER]<br>' +
        "[CENTER]Ваша биография была внимательно проверена, устанавливается префикс - отказано.[/CENTER]<br>" +
        '[CENTER]Причиной отказа послужило - Вы ошиблись разделом.[/CENTER]<br>' +
        "[CENTER]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/CENTER]<br>" +
        "[CENTER]С уважением, администратор курирующий форум Wililams_Nakajima![/CENTER]<br>" +
        "[CENTER]Спасибо за обращение. Приятной игры на BLACK RUSSIA - [color=aqua]AQUA[/color][/CENTER][/FONT]<br>" +
        "[CENTER][IMG]https://i.postimg.cc/0KfbtZ0J/IMG-4116.gif[/IMG][/CENTER]<br>",
      prefix: UNACCEPT_PREFIX,
	  status: false,
},
   {
title: 'на доработке',
content:
        '[FONT=georgia][CENTER]Доброго времени суток, уважаемый (-ая) {{ user.mention }}[/CENTER]<br>' +
        "[CENTER]Ваша биография была внимательно проверена, устанавливается префикс - на рассмотрение.[/CENTER]<br>" +
        '[CENTER]У вас имеется 24 часа на внесение изменений и дополнения информации в биографию.[/CENTER]<br>' +
        "[CENTER]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/CENTER]<br>" +
        "[CENTER]С уважением, администратор курирующий форум Wililams_Nakajima![/CENTER]<br>" +
        "[CENTER]Спасибо за обращение. Приятной игры на BLACK RUSSIA - [color=aqua]AQUA[/color][/CENTER][/FONT]<br>" +
        "[CENTER][IMG]https://i.postimg.cc/0KfbtZ0J/IMG-4116.gif[/IMG][/CENTER]<br>",
      prefix: PIN_PREFIX,
	  status: true,
},
   {
      title: '――――――――――――――――――――――РП ОРГАНИЗАЦИИ――――――――――――――――――――――',
	},
   {
title: 'одобрено',
content:
        '[FONT=georgia][CENTER]Доброго времени суток, уважаемый (-ая) {{ user.mention }}[/CENTER]<br>' +
        "[CENTER]Ваша организация была внимательно проверена, устанавливается префикс - одобрено.[/CENTER]<br>" +
        '[CENTER]Быстрого процветания, хороших финансовых возможностей на сервере.[/CENTER]<br>' +
        "[CENTER]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/CENTER]<br>" +
        "[CENTER]С уважением, администратор курирующий форум Wililams_Nakajima![/CENTER]<br>" +
        "[CENTER]Спасибо за обращение. Приятной игры на BLACK RUSSIA - [color=aqua]AQUA[/color][/CENTER][/FONT]<br>" +
        "[CENTER][IMG]https://i.postimg.cc/0KfbtZ0J/IMG-4116.gif[/IMG][/CENTER]<br>",
      prefix: ACCEPT_PREFIX,
	  status: false,
},
   {
title: 'отказана',
content:
        '[FONT=georgia][CENTER]Доброго времени суток, уважаемый (-ая) {{ user.mention }}[/CENTER]<br>' +
        "[CENTER]Ваша организация была внимательно проверена, устанавливается префикс - отказано.[/CENTER]<br>" +
        '[CENTER]Причиной отказа послужило - .[/CENTER]<br>' +
        "[CENTER]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/CENTER]<br>" +
        "[CENTER]С уважением, администратор курирующий форум Wililams_Nakajima![/CENTER]<br>" +
        "[CENTER]Спасибо за обращение. Приятной игры на BLACK RUSSIA - [color=aqua]AQUA[/color][/CENTER][/FONT]<br>" +
        "[CENTER][IMG]https://i.postimg.cc/0KfbtZ0J/IMG-4116.gif[/IMG][/CENTER]<br>",
      prefix: UNACCEPT_PREFIX,
	  status: false,
},
   {
title: 'не по форме',
content:
        '[FONT=georgia][CENTER]Доброго времени суток, уважаемый (-ая) {{ user.mention }}[/CENTER]<br>' +
        "[CENTER]Ваша организация была внимательно проверена, устанавливается префикс - отказано.[/CENTER]<br>" +
        '[CENTER]Причиной отказа послужило - неправильное оформление. Внимательно ознакомьтесь с правилами создания неофициальной организации.[/CENTER]<br>' +
        "[CENTER]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/CENTER]<br>" +
        "[CENTER]С уважением, администратор курирующий форум Wililams_Nakajima![/CENTER]<br>" +
        "[CENTER]Спасибо за обращение. Приятной игры на BLACK RUSSIA - [color=aqua]AQUA[/color][/CENTER][/FONT]<br>" +
        "[CENTER][IMG]https://i.postimg.cc/0KfbtZ0J/IMG-4116.gif[/IMG][/CENTER]<br>",
      prefix: UNACCEPT_PREFIX,
	  status: false,
},
   {
title: 'заголовок не по форме',
content:
        '[FONT=georgia][CENTER]Доброго времени суток, уважаемый (-ая) {{ user.mention }}[/CENTER]<br>' +
        "[CENTER]Ваша организация была внимательно проверена, устанавливается префикс - отказано.[/CENTER]<br>" +
        '[CENTER]Причиной отказа послужило - заголовок оформлен неправильно. .[/CENTER]<br>' +
        "[CENTER]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/CENTER]<br>" +
        "[CENTER]С уважением, администратор курирующий форум Wililams_Nakajima![/CENTER]<br>" +
        "[CENTER]Спасибо за обращение. Приятной игры на BLACK RUSSIA - [color=aqua]AQUA[/color][/CENTER][/FONT]<br>" +
        "[CENTER][IMG]https://i.postimg.cc/0KfbtZ0J/IMG-4116.gif[/IMG][/CENTER]<br>",
      prefix: UNACCEPT_PREFIX,
	  status: false,
},
   {
title: 'не дополнил',
content:
        '[FONT=georgia][CENTER]Доброго времени суток, уважаемый (-ая) {{ user.mention }}[/CENTER]<br>' +
        "[CENTER]Ваша организация была внимательно проверена, устанавливается префикс - отказано.[/CENTER]<br>" +
        '[CENTER]Причиной отказа послужило - после выделенного Вам времени - изменений не последовало.[/CENTER]<br>' +
        "[CENTER]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/CENTER]<br>" +
        "[CENTER]С уважением, администратор курирующий форум Wililams_Nakajima![/CENTER]<br>" +
        "[CENTER]Спасибо за обращение. Приятной игры на BLACK RUSSIA - [color=aqua]AQUA[/color][/CENTER][/FONT]<br>" +
        "[CENTER][IMG]https://i.postimg.cc/0KfbtZ0J/IMG-4116.gif[/IMG][/CENTER]<br>",
      prefix: UNACCEPT_PREFIX,
	  status: false,
},
   {
title: 'неграмотная',
content:
        '[FONT=georgia][CENTER]Доброго времени суток, уважаемый (-ая) {{ user.mention }}[/CENTER]<br>' +
        "[CENTER]Ваша организация была внимательно проверена, устанавливается префикс - отказано.[/CENTER]<br>" +
        '[CENTER]Причиной отказа послужило - внимательно проверьте текст вашей организации на наличие грамматических и пунктуационных ошибок.[/CENTER]<br>' +
        "[CENTER]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/CENTER]<br>" +
        "[CENTER]С уважением, администратор курирующий форум Wililams_Nakajima![/CENTER]<br>" +
        "[CENTER]Спасибо за обращение. Приятной игры на BLACK RUSSIA - [color=aqua]AQUA[/color][/CENTER][/FONT]<br>" +
        "[CENTER][IMG]https://i.postimg.cc/0KfbtZ0J/IMG-4116.gif[/IMG][/CENTER]<br>",
      prefix: UNACCEPT_PREFIX,
	  status: false,
},
   {
title: 'от 3-его лица',
content:
        '[FONT=georgia][CENTER]Доброго времени суток, уважаемый (-ая) {{ user.mention }}[/CENTER]<br>' +
        "[CENTER]Ваша организация была внимательно проверена, устанавливается префикс - отказано.[/CENTER]<br>" +
        '[CENTER]Причиной отказа послужило - оформление текста организации выполнено от третьего лица.[/CENTER]<br>' +
        "[CENTER]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/CENTER]<br>" +
        "[CENTER]С уважением, администратор курирующий форум Wililams_Nakajima![/CENTER]<br>" +
        "[CENTER]Спасибо за обращение. Приятной игры на BLACK RUSSIA - [color=aqua]AQUA[/color][/CENTER][/FONT]<br>" +
        "[CENTER][IMG]https://i.postimg.cc/0KfbtZ0J/IMG-4116.gif[/IMG][/CENTER]<br>",
      prefix: UNACCEPT_PREFIX,
	  status: false,
},
   {
title: 'уже одобрена',
content:
        '[FONT=georgia][CENTER]Доброго времени суток, уважаемый (-ая) {{ user.mention }}[/CENTER]<br>' +
        "[CENTER]Ваша организация была внимательно проверена, устанавливается префикс - отказано.[/CENTER]<br>" +
        '[CENTER]Причиной отказа послужило - ранее Ваша организация была одобрена.[/CENTER]<br>' +
        "[CENTER]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/CENTER]<br>" +
        "[CENTER]С уважением, администратор курирующий форум Wililams_Nakajima![/CENTER]<br>" +
        "[CENTER]Спасибо за обращение. Приятной игры на BLACK RUSSIA - [color=aqua]AQUA[/color][/CENTER][/FONT]<br>" +
        "[CENTER][IMG]https://i.postimg.cc/0KfbtZ0J/IMG-4116.gif[/IMG][/CENTER]<br>",
      prefix: UNACCEPT_PREFIX,
	  status: false,
},
   {
title: 'супергерой',
content:
        '[FONT=georgia][CENTER]Доброго времени суток, уважаемый (-ая) {{ user.mention }}[/CENTER]<br>' +
        "[CENTER]Ваша организация была внимательно проверена, устанавливается префикс - отказано.[/CENTER]<br>" +
        '[CENTER]Причиной отказа послужило - в биографии организации были присовены супер-возможности персонажу, которым он владеть не может.[/CENTER]<br>' +
        "[CENTER]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/CENTER]<br>" +
        "[CENTER]С уважением, администратор курирующий форум Wililams_Nakajima![/CENTER]<br>" +
        "[CENTER]Спасибо за обращение. Приятной игры на BLACK RUSSIA - [color=aqua]AQUA[/color][/CENTER][/FONT]<br>" +
        "[CENTER][IMG]https://i.postimg.cc/0KfbtZ0J/IMG-4116.gif[/IMG][/CENTER]<br>",
      prefix: UNACCEPT_PREFIX,
	  status: false,
},
   {
title: 'копипаст',
content:
        '[FONT=georgia][CENTER]Доброго времени суток, уважаемый (-ая) {{ user.mention }}[/CENTER]<br>' +
        "[CENTER]Ваша организация была внимательно проверена, устанавливается префикс - отказано.[/CENTER]<br>" +
        '[CENTER]Причиной отказа послужило - копирование организации у другого человека.[/CENTER]<br>' +
        "[CENTER]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/CENTER]<br>" +
        "[CENTER]С уважением, администратор курирующий форум Wililams_Nakajima![/CENTER]<br>" +
        "[CENTER]Спасибо за обращение. Приятной игры на BLACK RUSSIA - [color=aqua]AQUA[/color][/CENTER][/FONT]<br>" +
        "[CENTER][IMG]https://i.postimg.cc/0KfbtZ0J/IMG-4116.gif[/IMG][/CENTER]<br>",
      prefix: UNACCEPT_PREFIX,
	  status: false,
},
   {
title: 'nrp ник',
content:
        '[FONT=georgia][CENTER]Доброго времени суток, уважаемый (-ая) {{ user.mention }}[/CENTER]<br>' +
        "[CENTER]Ваша организация была внимательно проверена, устанавливается префикс - отказано.[/CENTER]<br>" +
        '[CENTER]Причиной отказа послужило - наличие NonRP NickName.[/CENTER]<br>' +
        "[CENTER]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/CENTER]<br>" +
        "[CENTER]С уважением, администратор курирующий форум Wililams_Nakajima![/CENTER]<br>" +
        "[CENTER]Спасибо за обращение. Приятной игры на BLACK RUSSIA - [color=aqua]AQUA[/color][/CENTER][/FONT]<br>" +
        "[CENTER][IMG]https://i.postimg.cc/0KfbtZ0J/IMG-4116.gif[/IMG][/CENTER]<br>",
      prefix: UNACCEPT_PREFIX,
	  status: false,
},
      {
title: 'не туда',
content:
        '[FONT=georgia][CENTER]Доброго времени суток, уважаемый (-ая) {{ user.mention }}[/CENTER]<br>' +
        "[CENTER]Ваша организация была внимательно проверена, устанавливается префикс - отказано.[/CENTER]<br>" +
        '[CENTER]Причиной отказа послужило - Вы ошиблись разделом.[/CENTER]<br>' +
        "[CENTER]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/CENTER]<br>" +
        "[CENTER]С уважением, администратор курирующий форум Wililams_Nakajima![/CENTER]<br>" +
        "[CENTER]Спасибо за обращение. Приятной игры на BLACK RUSSIA - [color=aqua]AQUA[/color][/CENTER][/FONT]<br>" +
        "[CENTER][IMG]https://i.postimg.cc/0KfbtZ0J/IMG-4116.gif[/IMG][/CENTER]<br>",
      prefix: UNACCEPT_PREFIX,
	  status: false,
},
     {
title: 'на доработке',
content:
        '[FONT=georgia][CENTER]Доброго времени суток, уважаемый (-ая) {{ user.mention }}[/CENTER]<br>' +
        "[CENTER]Ваша организация была внимательно проверена, устанавливается префикс - на рассмотрение.[/CENTER]<br>" +
        '[CENTER]Дополните информацию и сведения о вашей организации, на это Вам выделено 24 часа, в противном случае - префикс отказано.[/CENTER]<br>' +
        "[CENTER]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/CENTER]<br>" +
        "[CENTER]С уважением, администратор курирующий форум Wililams_Nakajima![/CENTER]<br>" +
        "[CENTER]Спасибо за обращение. Приятной игры на BLACK RUSSIA - [color=aqua]AQUA[/color][/CENTER][/FONT]<br>" +
        "[CENTER][IMG]https://i.postimg.cc/0KfbtZ0J/IMG-4116.gif[/IMG][/CENTER]<br>",
      prefix: PIN_PREFIX,
	  status: true,
},
    {
      title: '―――――――――――――――――――――――РП СИТУАЦИИ―――――――――――――――――――――――',
	},
   {
title: 'одобрено',
content:
        '[FONT=georgia][CENTER]Доброго времени суток, уважаемый (-ая) {{ user.mention }}[/CENTER]<br>' +
        "[CENTER]Ваша ситуация была внимательно проверена, устанавливается префикс - одобрено.[/CENTER]<br>" +
        '[CENTER]Спасибо за креативность, желание продвигать RP на нашем сервере.[/CENTER]<br>' +
        "[CENTER]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/CENTER]<br>" +
        "[CENTER]С уважением, администратор курирующий форум Wililams_Nakajima![/CENTER]<br>" +
        "[CENTER]Спасибо за обращение. Приятной игры на BLACK RUSSIA - [color=aqua]AQUA[/color][/CENTER][/FONT]<br>" +
        "[CENTER][IMG]https://i.postimg.cc/0KfbtZ0J/IMG-4116.gif[/IMG][/CENTER]<br>",
      prefix: ACCEPT_PREFIX,
	  status: false,
},
   {
title: 'отказана',
content:
        '[FONT=georgia][CENTER]Доброго времени суток, уважаемый (-ая) {{ user.mention }}[/CENTER]<br>' +
        "[CENTER]Ваша ситуация была внимательно проверена, устанавливается префикс - отказано.[/CENTER]<br>" +
        '[CENTER]Причиной отказа послужило - .[/CENTER]<br>' +
        "[CENTER]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/CENTER]<br>" +
        "[CENTER]С уважением, администратор курирующий форум Wililams_Nakajima![/CENTER]<br>" +
        "[CENTER]Спасибо за обращение. Приятной игры на BLACK RUSSIA - [color=aqua]AQUA[/color][/CENTER][/FONT]<br>" +
        "[CENTER][IMG]https://i.postimg.cc/0KfbtZ0J/IMG-4116.gif[/IMG][/CENTER]<br>",
      prefix: UNACCEPT_PREFIX,
	  status: false,
},
   {
title: 'не по форме',
content:
        '[FONT=georgia][CENTER]Доброго времени суток, уважаемый (-ая) {{ user.mention }}[/CENTER]<br>' +
        "[CENTER]Ваша ситуация была внимательно проверена, устанавливается префикс - отказано.[/CENTER]<br>" +
        '[CENTER]Причиной отказа послужило - оформление ситуации выполнено не по форме. Внимательно ознакомьтесь с правилами создания ситуации.[/CENTER]<br>' +
        "[CENTER]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/CENTER]<br>" +
        "[CENTER]С уважением, администратор курирующий форум Wililams_Nakajima![/CENTER]<br>" +
        "[CENTER]Спасибо за обращение. Приятной игры на BLACK RUSSIA - [color=aqua]AQUA[/color][/CENTER][/FONT]<br>" +
        "[CENTER][IMG]https://i.postimg.cc/0KfbtZ0J/IMG-4116.gif[/IMG][/CENTER]<br>",
      prefix: UNACCEPT_PREFIX,
	  status: false,
},
   {
title: 'заголовок не по форме',
content:
        '[FONT=georgia][CENTER]Доброго времени суток, уважаемый (-ая) {{ user.mention }}[/CENTER]<br>' +
        "[CENTER]Ваша ситуация была внимательно проверена, устанавливается префикс - отказано.[/CENTER]<br>" +
        '[CENTER]Причиной отказа послужило - заголовок ситуации заполнен не по форме.[/CENTER]<br>' +
        "[CENTER]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/CENTER]<br>" +
        "[CENTER]С уважением, администратор курирующий форум Wililams_Nakajima![/CENTER]<br>" +
        "[CENTER]Спасибо за обращение. Приятной игры на BLACK RUSSIA - [color=aqua]AQUA[/color][/CENTER][/FONT]<br>" +
        "[CENTER][IMG]https://i.postimg.cc/0KfbtZ0J/IMG-4116.gif[/IMG][/CENTER]<br>",
      prefix: UNACCEPT_PREFIX,
	  status: false,
},
   {
title: 'не дополнил',
content:
        '[FONT=georgia][CENTER]Доброго времени суток, уважаемый (-ая) {{ user.mention }}[/CENTER]<br>' +
        "[CENTER]Ваша ситуация была внимательно проверена, устанавливается префикс - отказано.[/CENTER]<br>" +
        '[CENTER]Причиной отказа послужило - по истечению 24х часов изменений не последовало.[/CENTER]<br>' +
        "[CENTER]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/CENTER]<br>" +
        "[CENTER]С уважением, администратор курирующий форум Wililams_Nakajima![/CENTER]<br>" +
        "[CENTER]Спасибо за обращение. Приятной игры на BLACK RUSSIA - [color=aqua]AQUA[/color][/CENTER][/FONT]<br>" +
        "[CENTER][IMG]https://i.postimg.cc/0KfbtZ0J/IMG-4116.gif[/IMG][/CENTER]<br>",
      prefix: UNACCEPT_PREFIX,
	  status: false,
},
   {
title: 'неграмотная',
content:
        '[FONT=georgia][CENTER]Доброго времени суток, уважаемый (-ая) {{ user.mention }}[/CENTER]<br>' +
        "[CENTER]Ваша ситуация была внимательно проверена, устанавливается префикс - отказано.[/CENTER]<br>" +
        '[CENTER]Причиной отказа послужило - оформление ситуации выполнено неграмотно, внимательно проверьте наличие орфографических и пунктуационных ошибок.[/CENTER]<br>' +
        "[CENTER]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/CENTER]<br>" +
        "[CENTER]С уважением, администратор курирующий форум Wililams_Nakajima![/CENTER]<br>" +
        "[CENTER]Спасибо за обращение. Приятной игры на BLACK RUSSIA - [color=aqua]AQUA[/color][/CENTER][/FONT]<br>" +
        "[CENTER][IMG]https://i.postimg.cc/0KfbtZ0J/IMG-4116.gif[/IMG][/CENTER]<br>",
      prefix: UNACCEPT_PREFIX,
	  status: false,
},
   {
title: 'от 3-его лица',
content:
        '[FONT=georgia][CENTER]Доброго времени суток, уважаемый (-ая) {{ user.mention }}[/CENTER]<br>' +
        "[CENTER]Ваша ситуация была внимательно проверена, устанавливается префикс - отказано.[/CENTER]<br>" +
        '[CENTER]Причиной отказа послужило - оформление ситуации от третьего лица.[/CENTER]<br>' +
        "[CENTER]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/CENTER]<br>" +
        "[CENTER]С уважением, администратор курирующий форум Wililams_Nakajima![/CENTER]<br>" +
        "[CENTER]Спасибо за обращение. Приятной игры на BLACK RUSSIA - [color=aqua]AQUA[/color][/CENTER][/FONT]<br>" +
        "[CENTER][IMG]https://i.postimg.cc/0KfbtZ0J/IMG-4116.gif[/IMG][/CENTER]<br>",
      prefix: UNACCEPT_PREFIX,
	  status: false,
},
   {
title: 'уже одобрена',
content:
        '[FONT=georgia][CENTER]Доброго времени суток, уважаемый (-ая) {{ user.mention }}[/CENTER]<br>' +
        "[CENTER]Ваша ситуация была внимательно проверена, устанавливается префикс - отказано.[/CENTER]<br>" +
        '[CENTER]Причиной отказа послужило - ранее ситуация уже получала одобрение.[/CENTER]<br>' +
        "[CENTER]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/CENTER]<br>" +
        "[CENTER]С уважением, администратор курирующий форум Wililams_Nakajima![/CENTER]<br>" +
        "[CENTER]Спасибо за обращение. Приятной игры на BLACK RUSSIA - [color=aqua]AQUA[/color][/CENTER][/FONT]<br>" +
        "[CENTER][IMG]https://i.postimg.cc/0KfbtZ0J/IMG-4116.gif[/IMG][/CENTER]<br>",
      prefix: UNACCEPT_PREFIX,
	  status: false,
},
   {
title: 'супергерой',
content:
        '[FONT=georgia][CENTER]Доброго времени суток, уважаемый (-ая) {{ user.mention }}[/CENTER]<br>' +
        "[CENTER]Ваша ситуация была внимательно проверена, устанавливается префикс - отказано.[/CENTER]<br>" +
        '[CENTER]Причиной отказа послужило - Вы присвоили персонажам, участвующим в ситуации, супер-способности, которыми владеть невозможно.[/CENTER]<br>' +
        "[CENTER]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/CENTER]<br>" +
        "[CENTER]С уважением, администратор курирующий форум Wililams_Nakajima![/CENTER]<br>" +
        "[CENTER]Спасибо за обращение. Приятной игры на BLACK RUSSIA - [color=aqua]AQUA[/color][/CENTER][/FONT]<br>" +
        "[CENTER][IMG]https://i.postimg.cc/0KfbtZ0J/IMG-4116.gif[/IMG][/CENTER]<br>",
      prefix: UNACCEPT_PREFIX,
	  status: false,
},
   {
title: 'копипаст',
content:
        '[FONT=georgia][CENTER]Доброго времени суток, уважаемый (-ая) {{ user.mention }}[/CENTER]<br>' +
        "[CENTER]Ваша ситуация была внимательно проверена, устанавливается префикс - отказано.[/CENTER]<br>" +
        '[CENTER]Причиной отказа послужило - ситуация была скопирована.[/CENTER]<br>' +
        "[CENTER]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/CENTER]<br>" +
        "[CENTER]С уважением, администратор курирующий форум Wililams_Nakajima![/CENTER]<br>" +
        "[CENTER]Спасибо за обращение. Приятной игры на BLACK RUSSIA - [color=aqua]AQUA[/color][/CENTER][/FONT]<br>" +
        "[CENTER][IMG]https://i.postimg.cc/0KfbtZ0J/IMG-4116.gif[/IMG][/CENTER]<br>",
      prefix: UNACCEPT_PREFIX,
	  status: false,
},
   {
title: 'nrp ник',
content:
        '[FONT=georgia][CENTER]Доброго времени суток, уважаемый (-ая) {{ user.mention }}[/CENTER]<br>' +
        "[CENTER]Ваша ситуация была внимательно проверена, устанавливается префикс - отказано.[/CENTER]<br>" +
        '[CENTER]Причиной отказа послужило - наличие NonRP NickName в ситуации.[/CENTER]<br>' +
        "[CENTER]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/CENTER]<br>" +
        "[CENTER]С уважением, администратор курирующий форум Wililams_Nakajima![/CENTER]<br>" +
        "[CENTER]Спасибо за обращение. Приятной игры на BLACK RUSSIA - [color=aqua]AQUA[/color][/CENTER][/FONT]<br>" +
        "[CENTER][IMG]https://i.postimg.cc/0KfbtZ0J/IMG-4116.gif[/IMG][/CENTER]<br>",
      prefix: UNACCEPT_PREFIX,
	  status: false,
},
      {
title: 'не туда',
content:
        '[FONT=georgia][CENTER]Доброго времени суток, уважаемый (-ая) {{ user.mention }}[/CENTER]<br>' +
        "[CENTER]Ваша ситуация была внимательно проверена, устанавливается префикс - отказано.[/CENTER]<br>" +
        '[CENTER]Причиной отказа послужило - Вы ошиблись разделом.[/CENTER]<br>' +
        "[CENTER]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/CENTER]<br>" +
        "[CENTER]С уважением, администратор курирующий форум Wililams_Nakajima![/CENTER]<br>" +
        "[CENTER]Спасибо за обращение. Приятной игры на BLACK RUSSIA - [color=aqua]AQUA[/color][/CENTER][/FONT]<br>" +
        "[CENTER][IMG]https://i.postimg.cc/0KfbtZ0J/IMG-4116.gif[/IMG][/CENTER]<br>",
      prefix: UNACCEPT_PREFIX,
	  status: false,
},
     {
title: 'на доработке',
content:
        '[FONT=georgia][CENTER]Доброго времени суток, уважаемый (-ая) {{ user.mention }}[/CENTER]<br>' +
        "[CENTER]Ваша ситуация была внимательно проверена, устанавливается префикс - на рассмотрение.[/CENTER]<br>" +
        '[CENTER]Вам дается 24 часа на дополнение информации, биографии и других аспектов ситуации.[/CENTER]<br>' +
        "[CENTER]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/CENTER]<br>" +
        "[CENTER]С уважением, администратор курирующий форум Wililams_Nakajima![/CENTER]<br>" +
        "[CENTER]Спасибо за обращение. Приятной игры на BLACK RUSSIA - [color=aqua]AQUA[/color][/CENTER][/FONT]<br>" +
        "[CENTER][IMG]https://i.postimg.cc/0KfbtZ0J/IMG-4116.gif[/IMG][/CENTER]<br>",
      prefix: PIN_PREFIX,
	  status: true,
       },



  ];


$(document).ready(() => {
	// Загрузка скрипта для обработки шаблонов
	$('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');

	// Добавление кнопок при загрузке страницы
	addButton('На рассмотрение', 'pin');
	addButton('Одобрено', 'accepted');
	addButton('Отказано', 'unaccept');
	addButton('Ответы', 'selectAnswer');

	// Поиск информации о теме
	const threadData = getThreadData();

	$('button#pin').click(() => editThreadData(PIN_PREFIX, true));
	$('button#accepted').click(() => editThreadData(ACCEPT_PREFIX, false));
	$('button#teamProject').click(() => editThreadData(COMMAND_PREFIX, true));
	$('button#unaccept').click(() => editThreadData(UNACCEPT_PREFIX, false));

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