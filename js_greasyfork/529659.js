// ==UserScript==
// @name        Для Кураторов Форума AQUA 
// @namespace   LibertyBear Scripts
// @match      https://forum.blackrussia.online/threads/*
// @grant       none
// @version     1.1
// @license 	 MIT
// @author      Ilia Krylov
// @description 13.03.2025 0:00:00
// @downloadURL https://update.greasyfork.org/scripts/529659/%D0%94%D0%BB%D1%8F%20%D0%9A%D1%83%D1%80%D0%B0%D1%82%D0%BE%D1%80%D0%BE%D0%B2%20%D0%A4%D0%BE%D1%80%D1%83%D0%BC%D0%B0%20AQUA.user.js
// @updateURL https://update.greasyfork.org/scripts/529659/%D0%94%D0%BB%D1%8F%20%D0%9A%D1%83%D1%80%D0%B0%D1%82%D0%BE%D1%80%D0%BE%D0%B2%20%D0%A4%D0%BE%D1%80%D1%83%D0%BC%D0%B0%20AQUA.meta.js
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

title: 'DM',
content:
 '[CENTER][IMG]https://i.postimg.cc/FRfvPzcN/Ltjtv-TM-1.png[/IMG]<br>' +
     '[CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman][ICODE]Доброго времени суток, уважаемый(-ая) {{ user.name }} [/ICODE][/FONT][/COLOR]<br>' +
'[CENTER][FONT=times new roman]Ваша жалоба [COLOR=rgb(0, 255, 0)]одобрена[/COLOR], игрок получит своё наказание по пункту правил:[/FONT]' +
'[SPOILER="*Нажмите*"][COLOR=rgb(255, 0, 0)]2.19.[/COLOR] [FONT=courier new]Запрещен DM (DeathMatch) — убийство или нанесение урона без веской IC причины. | [COLOR=rgb(255, 0, 0)]Jail 60 минут[/COLOR].' +
    '[CENTER][B][COLOR=rgb(255, 0, 0)]Примечание:[/COLOR] разрешен ответный DM в целях защиты, обязательно иметь видео доказательство в случае наказания администрации, нанесение урона по транспорту также является нарушением данного пункта правил.[/B]' +
    '[CENTER][B][COLOR=rgb(255, 0, 0)]Примечание:[/COLOR] нанесение урона с целью защиты особняка или его территории, а также нанесение урона после ДТП не является веской IC причиной, для войны семей предусмотрено отдельное системное мероприятие.[/B][/SPOILER]<br>' +
     '[FONT=times new roman][B]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/B][/FONT]<br>' +
'[FONT=times new roman][B]С уважением состав Кураторов Форума сервера [COLOR=rgb(0, 255, 255)]AQUA[/COLOR][/B][/FONT]<br>'+
      '[FONT=times new roman][COLOR=rgb(0, 255, 255)][ICODE]Благодарим вас за ваше обращение.[/ICODE]' +
    '[img]https://i.postimg.cc/jjSt7ZSW/H0px-Zrw4d-BTldu-AMYAYTDk-Am-Xv-I7-XIB2-M-Bj-ENl-LY908-Ecrrlr-ZFNa-P6vw-SJf-Dsmmv-Bzi-V0-Tbj-C0s3bg5-Jz-Io-Xw.png[/img]<br>'+
       '[CENTER][FONT=courier new][COLOR=rgb(0, 255, 0)]Одобрено,[/FONT][/COLOR] [COLOR=rgb(255, 0, 0)]закрыто[/COLOR][/CENTER]<br>',
      prefix: ACCEPT_PREFIX,
	  status: false,
},
   {
title: 'Mass DM',
content:
 '[CENTER][IMG]https://i.postimg.cc/FRfvPzcN/Ltjtv-TM-1.png[/IMG]<br>' +
     '[CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman][ICODE]Доброго времени суток, уважаемый(-ая) {{ user.name }} [/ICODE][/FONT][/COLOR]<br>' +
'[CENTER][FONT=times new roman]Ваша жалоба [COLOR=rgb(0, 255, 0)]одобрена[/COLOR], игрок получит своё наказание по пункту правил:[/FONT]' +
'[SPOILER="*Нажмите*"][COLOR=rgb(255, 0, 0)]2.20.[/COLOR] [FONT=courier new]Запрещен Mass DM (Mass DeathMatch) — убийство или нанесение урона без веской IC причины трем игрокам и более. | [COLOR=rgb(255, 0, 0)]Warn / Ban 3 - 7 дней[/COLOR].[/FONT][/SPOILER]<br>' +
     '[FONT=times new roman][B]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/B][/FONT]<br>' +
'[FONT=times new roman][B]С уважением состав Кураторов Форума сервера [COLOR=rgb(0, 255, 255)]AQUA[/COLOR][/B][/FONT]<br>'+
      '[FONT=times new roman][COLOR=rgb(0, 255, 255)][ICODE]Благодарим вас за ваше обращение.[/ICODE]' +
    '[img]https://i.postimg.cc/jjSt7ZSW/H0px-Zrw4d-BTldu-AMYAYTDk-Am-Xv-I7-XIB2-M-Bj-ENl-LY908-Ecrrlr-ZFNa-P6vw-SJf-Dsmmv-Bzi-V0-Tbj-C0s3bg5-Jz-Io-Xw.png[/img]<br>'+
       '[CENTER][FONT=courier new][COLOR=rgb(0, 255, 0)]Одобрено,[/FONT][/COLOR] [COLOR=rgb(255, 0, 0)]закрыто[/COLOR][/CENTER]<br>',
      prefix: ACCEPT_PREFIX,
	  status: false,
},
 {
title: 'DB',
content:
 '[CENTER][IMG]https://i.postimg.cc/FRfvPzcN/Ltjtv-TM-1.png[/IMG]<br>' +
     '[CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman][ICODE]Доброго времени суток, уважаемый(-ая) {{ user.name }} [/ICODE][/FONT][/COLOR]<br>' +
'[CENTER][FONT=times new roman]Ваша жалоба [COLOR=rgb(0, 255, 0)]одобрена[/COLOR], игрок получит своё наказание по пункту правил:[/FONT]' +
'[SPOILER="*Нажмите*"][COLOR=rgb(255, 0, 0)]2.13.[/COLOR] [FONT=courier new]Запрещен DB (DriveBy) — намеренное убийство / нанесение урона без веской IC причины на любом виде транспорта. | [COLOR=rgb(255, 0, 0)]Jail 60 минут[/COLOR].[/FONT][/SPOILER]<br>' +
     '[FONT=times new roman][B]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/B][/FONT]<br>' +
'[FONT=times new roman][B]С уважением состав Кураторов Форума сервера [COLOR=rgb(0, 255, 255)]AQUA[/COLOR][/B][/FONT]<br>'+
      '[FONT=times new roman][COLOR=rgb(0, 255, 255)][ICODE]Благодарим вас за ваше обращение.[/ICODE]' +
    '[img]https://i.postimg.cc/jjSt7ZSW/H0px-Zrw4d-BTldu-AMYAYTDk-Am-Xv-I7-XIB2-M-Bj-ENl-LY908-Ecrrlr-ZFNa-P6vw-SJf-Dsmmv-Bzi-V0-Tbj-C0s3bg5-Jz-Io-Xw.png[/img]<br>'+
       '[CENTER][FONT=courier new][COLOR=rgb(0, 255, 0)]Одобрено,[/FONT][/COLOR] [COLOR=rgb(255, 0, 0)]закрыто[/COLOR][/CENTER]<br>',
      prefix: ACCEPT_PREFIX,
	  status: false,
},
   {
title: 'TK',
content:
 '[CENTER][IMG]https://i.postimg.cc/FRfvPzcN/Ltjtv-TM-1.png[/IMG]<br>' +
     '[CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman][ICODE]Доброго времени суток, уважаемый(-ая) {{ user.name }} [/ICODE][/FONT][/COLOR]<br>' +
'[CENTER][FONT=times new roman]Ваша жалоба [COLOR=rgb(0, 255, 0)]одобрена[/COLOR], игрок получит своё наказание по пункту правил:[/FONT]' +
'[SPOILER="*Нажмите*"][COLOR=rgb(255, 0, 0)]2.15.[/COLOR] [FONT=courier new]Запрещен TK (Team Kill) — убийство члена своей или союзной фракции, организации без наличия какой-либо IC причины. | [COLOR=rgb(255, 0, 0)]Jail 60 минут / Warn (за два и более убийства)[/COLOR].[/FONT][/SPOILER]<br>' +
     '[FONT=times new roman][B]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/B][/FONT]<br>' +
'[FONT=times new roman][B]С уважением состав Кураторов Форума сервера [COLOR=rgb(0, 255, 255)]AQUA[/COLOR][/B][/FONT]<br>'+
      '[FONT=times new roman][COLOR=rgb(0, 255, 255)][ICODE]Благодарим вас за ваше обращение.[/ICODE]' +
    '[img]https://i.postimg.cc/jjSt7ZSW/H0px-Zrw4d-BTldu-AMYAYTDk-Am-Xv-I7-XIB2-M-Bj-ENl-LY908-Ecrrlr-ZFNa-P6vw-SJf-Dsmmv-Bzi-V0-Tbj-C0s3bg5-Jz-Io-Xw.png[/img]<br>'+
       '[CENTER][FONT=courier new][COLOR=rgb(0, 255, 0)]Одобрено,[/FONT][/COLOR] [COLOR=rgb(255, 0, 0)]закрыто[/COLOR][/CENTER]<br>',
      prefix: ACCEPT_PREFIX,
	  status: false,
},
   {
title: 'SK',
content:
 '[CENTER][IMG]https://i.postimg.cc/FRfvPzcN/Ltjtv-TM-1.png[/IMG]<br>' +
     '[CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman][ICODE]Доброго времени суток, уважаемый(-ая) {{ user.name }} [/ICODE][/FONT][/COLOR]<br>' +
'[CENTER][FONT=times new roman]Ваша жалоба [COLOR=rgb(0, 255, 0)]одобрена[/COLOR], игрок получит своё наказание по пункту правил:[/FONT]' +
'[SPOILER="*Нажмите*"][COLOR=rgb(255, 0, 0)]2.16.[/COLOR] [FONT=courier new]Запрещен SK (Spawn Kill) — убийство или нанесение урона на титульной территории любой фракции / организации, на месте появления игрока, а также на выходе из закрытых интерьеров и около них. | [COLOR=rgb(255, 0, 0)]Jail 60 минут / Warn (за два и более убийства)[/COLOR].[/FONT][/SPOILER]<br>' +
     '[FONT=times new roman][B]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/B][/FONT]<br>' +
'[FONT=times new roman][B]С уважением состав Кураторов Форума сервера [COLOR=rgb(0, 255, 255)]AQUA[/COLOR][/B][/FONT]<br>'+
      '[FONT=times new roman][COLOR=rgb(0, 255, 255)][ICODE]Благодарим вас за ваше обращение.[/ICODE]' +
    '[img]https://i.postimg.cc/jjSt7ZSW/H0px-Zrw4d-BTldu-AMYAYTDk-Am-Xv-I7-XIB2-M-Bj-ENl-LY908-Ecrrlr-ZFNa-P6vw-SJf-Dsmmv-Bzi-V0-Tbj-C0s3bg5-Jz-Io-Xw.png[/img]<br>'+
       '[CENTER][FONT=courier new][COLOR=rgb(0, 255, 0)]Одобрено,[/FONT][/COLOR] [COLOR=rgb(255, 0, 0)]закрыто[/COLOR][/CENTER]<br>',
      prefix: ACCEPT_PREFIX,
	  status: false,
},
   {
title: 'MG',
content:
 '[CENTER][IMG]https://i.postimg.cc/FRfvPzcN/Ltjtv-TM-1.png[/IMG]<br>' +
     '[CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman][ICODE]Доброго времени суток, уважаемый(-ая) {{ user.name }} [/ICODE][/FONT][/COLOR]<br>' +
'[CENTER][FONT=times new roman]Ваша жалоба [COLOR=rgb(0, 255, 0)]одобрена[/COLOR], игрок получит своё наказание по пункту правил:[/FONT]' +
'[SPOILER="*Нажмите*"][COLOR=rgb(255, 0, 0)]2.18.[/COLOR] [FONT=courier new]Запрещен MG (MetaGaming) — использование ООС информации, которую Ваш персонаж никак не мог получить в IC процессе. | [COLOR=rgb(255, 0, 0)]Mute 30 минут[/COLOR].[/FONT][/SPOILER]<br>' +
     '[FONT=times new roman][B]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/B][/FONT]<br>' +
'[FONT=times new roman][B]С уважением состав Кураторов Форума сервера [COLOR=rgb(0, 255, 255)]AQUA[/COLOR][/B][/FONT]<br>'+
      '[FONT=times new roman][COLOR=rgb(0, 255, 255)][ICODE]Благодарим вас за ваше обращение.[/ICODE]' +
    '[img]https://i.postimg.cc/jjSt7ZSW/H0px-Zrw4d-BTldu-AMYAYTDk-Am-Xv-I7-XIB2-M-Bj-ENl-LY908-Ecrrlr-ZFNa-P6vw-SJf-Dsmmv-Bzi-V0-Tbj-C0s3bg5-Jz-Io-Xw.png[/img]<br>'+
       '[CENTER][FONT=courier new][COLOR=rgb(0, 255, 0)]Одобрено,[/FONT][/COLOR] [COLOR=rgb(255, 0, 0)]закрыто[/COLOR][/CENTER]<br>',
      prefix: ACCEPT_PREFIX,
	  status: false,
},
   {
title: 'CAPS',
content:
 '[CENTER][IMG]https://i.postimg.cc/FRfvPzcN/Ltjtv-TM-1.png[/IMG]<br>' +
     '[CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman][ICODE]Доброго времени суток, уважаемый(-ая) {{ user.name }} [/ICODE][/FONT][/COLOR]<br>' +
'[CENTER][FONT=times new roman]Ваша жалоба [COLOR=rgb(0, 255, 0)]одобрена[/COLOR], игрок получит своё наказание по пункту правил:[/FONT]' +
'[SPOILER="*Нажмите*"][COLOR=rgb(255, 0, 0)]3.02.[/COLOR] [FONT=courier new]Запрещено использование верхнего регистра (CapsLock) при написании любого текста в любом чате. | [COLOR=rgb(255, 0, 0)]Mute 30 минут[/COLOR].[/FONT][/SPOILER]<br>' +
     '[FONT=times new roman][B]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/B][/FONT]<br>' +
'[FONT=times new roman][B]С уважением состав Кураторов Форума сервера [COLOR=rgb(0, 255, 255)]AQUA[/COLOR][/B][/FONT]<br>'+
      '[FONT=times new roman][COLOR=rgb(0, 255, 255)][ICODE]Благодарим вас за ваше обращение.[/ICODE]' +
    '[img]https://i.postimg.cc/jjSt7ZSW/H0px-Zrw4d-BTldu-AMYAYTDk-Am-Xv-I7-XIB2-M-Bj-ENl-LY908-Ecrrlr-ZFNa-P6vw-SJf-Dsmmv-Bzi-V0-Tbj-C0s3bg5-Jz-Io-Xw.png[/img]<br>'+
       '[CENTER][FONT=courier new][COLOR=rgb(0, 255, 0)]Одобрено,[/FONT][/COLOR] [COLOR=rgb(255, 0, 0)]закрыто[/COLOR][/CENTER]<br>',
      prefix: ACCEPT_PREFIX,
	  status: false,
},
   {
title: 'Flood',
content:
 '[CENTER][IMG]https://i.postimg.cc/FRfvPzcN/Ltjtv-TM-1.png[/IMG]<br>' +
     '[CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman][ICODE]Доброго времени суток, уважаемый(-ая) {{ user.name }} [/ICODE][/FONT][/COLOR]<br>' +
'[CENTER][FONT=times new roman]Ваша жалоба [COLOR=rgb(0, 255, 0)]одобрена[/COLOR], игрок получит своё наказание по пункту правил:[/FONT]' +
'[SPOILER="*Нажмите*"][COLOR=rgb(255, 0, 0)]3.05.[/COLOR] [FONT=courier new]Запрещен флуд — 3 и более повторяющихся сообщений от одного и того же игрока. | [COLOR=rgb(255, 0, 0)]Mute 30 минут[/COLOR].[/FONT][/SPOILER]<br>' +
     '[FONT=times new roman][B]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/B][/FONT]<br>' +
'[FONT=times new roman][B]С уважением состав Кураторов Форума сервера [COLOR=rgb(0, 255, 255)]AQUA[/COLOR][/B][/FONT]<br>'+
      '[FONT=times new roman][COLOR=rgb(0, 255, 255)][ICODE]Благодарим вас за ваше обращение.[/ICODE]' +
    '[img]https://i.postimg.cc/jjSt7ZSW/H0px-Zrw4d-BTldu-AMYAYTDk-Am-Xv-I7-XIB2-M-Bj-ENl-LY908-Ecrrlr-ZFNa-P6vw-SJf-Dsmmv-Bzi-V0-Tbj-C0s3bg5-Jz-Io-Xw.png[/img]<br>'+
       '[CENTER][FONT=courier new][COLOR=rgb(0, 255, 0)]Одобрено,[/FONT][/COLOR] [COLOR=rgb(255, 0, 0)]закрыто[/COLOR][/CENTER]<br>',
      prefix: ACCEPT_PREFIX,
	  status: false,
},
   {
title: 'Транслит',
content:
 '[CENTER][IMG]https://i.postimg.cc/FRfvPzcN/Ltjtv-TM-1.png[/IMG]<br>' +
     '[CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman][ICODE]Доброго времени суток, уважаемый(-ая) {{ user.name }} [/ICODE][/FONT][/COLOR]<br>' +
'[CENTER][FONT=times new roman]Ваша жалоба [COLOR=rgb(0, 255, 0)]одобрена[/COLOR], игрок получит своё наказание по пункту правил:[/FONT]' +
'[SPOILER="*Нажмите*"][COLOR=rgb(255, 0, 0)]3.20.[/COLOR] [FONT=courier new]Запрещено использование транслита в любом из чатов. | [COLOR=rgb(255, 0, 0)]Mute 30 минут[/COLOR].[/FONT][/SPOILER]<br>' +
     '[FONT=times new roman][B]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/B][/FONT]<br>' +
'[FONT=times new roman][B]С уважением состав Кураторов Форума сервера [COLOR=rgb(0, 255, 255)]AQUA[/COLOR][/B][/FONT]<br>'+
      '[FONT=times new roman][COLOR=rgb(0, 255, 255)][ICODE]Благодарим вас за ваше обращение.[/ICODE]' +
    '[img]https://i.postimg.cc/jjSt7ZSW/H0px-Zrw4d-BTldu-AMYAYTDk-Am-Xv-I7-XIB2-M-Bj-ENl-LY908-Ecrrlr-ZFNa-P6vw-SJf-Dsmmv-Bzi-V0-Tbj-C0s3bg5-Jz-Io-Xw.png[/img]<br>'+
       '[CENTER][FONT=courier new][COLOR=rgb(0, 255, 0)]Одобрено,[/FONT][/COLOR] [COLOR=rgb(255, 0, 0)]закрыто[/COLOR][/CENTER]<br>',
      prefix: ACCEPT_PREFIX,
	  status: false,
},
   {
title: 'osk/upom rod',
content:
 '[CENTER][IMG]https://i.postimg.cc/FRfvPzcN/Ltjtv-TM-1.png[/IMG]<br>' +
     '[CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman][ICODE]Доброго времени суток, уважаемый(-ая) {{ user.name }} [/ICODE][/FONT][/COLOR]<br>' +
'[CENTER][FONT=times new roman]Ваша жалоба [COLOR=rgb(0, 255, 0)]одобрена[/COLOR], игрок получит своё наказание по пункту правил:[/FONT]' +
     '[CENTER][B][COLOR=rgb(255, 0, 0)]Примечание:[/COLOR] термины "MQ", "rnq" расценивается, как упоминание родных.[/B]' +
     '[CENTER][B][COLOR=rgb(255, 0, 0)]Исключение:[/COLOR] если упоминание родных было совершено в ходе Role Play процесса и не содержало в себе прямого или завуалированного оскорбления.[/B][/SPOILER]<br>' +
'[SPOILER="*Нажмите*"][COLOR=rgb(255, 0, 0)]3.04.[/COLOR] [FONT=courier new]Запрещено оскорбление или косвенное упоминание родных вне зависимости от чата. | [COLOR=rgb(255, 0, 0)]Mute 120 минут / Ban 7 - 15 дней[/COLOR].[/FONT][/SPOILER]<br>' +
     '[FONT=times new roman][B]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/B][/FONT]<br>' +
'[FONT=times new roman][B]С уважением состав Кураторов Форума сервера [COLOR=rgb(0, 255, 255)]AQUA[/COLOR][/B][/FONT]<br>'+
      '[FONT=times new roman][COLOR=rgb(0, 255, 255)][ICODE]Благодарим вас за ваше обращение.[/ICODE]' +
    '[img]https://i.postimg.cc/jjSt7ZSW/H0px-Zrw4d-BTldu-AMYAYTDk-Am-Xv-I7-XIB2-M-Bj-ENl-LY908-Ecrrlr-ZFNa-P6vw-SJf-Dsmmv-Bzi-V0-Tbj-C0s3bg5-Jz-Io-Xw.png[/img]<br>'+
       '[CENTER][FONT=courier new][COLOR=rgb(0, 255, 0)]Одобрено,[/FONT][/COLOR] [COLOR=rgb(255, 0, 0)]закрыто[/COLOR][/CENTER]<br>',
      prefix: ACCEPT_PREFIX,
	  status: false,
},
   {
title: 'osk rod в voice',
content:
 '[CENTER][IMG]https://i.postimg.cc/FRfvPzcN/Ltjtv-TM-1.png[/IMG]<br>' +
     '[CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman][ICODE]Доброго времени суток, уважаемый(-ая) {{ user.name }} [/ICODE][/FONT][/COLOR]<br>' +
'[CENTER][FONT=times new roman]Ваша жалоба [COLOR=rgb(0, 255, 0)]одобрена[/COLOR], игрок получит своё наказание по пункту правил:[/FONT]' +
'[SPOILER="*Нажмите*"][COLOR=rgb(255, 0, 0)]3.15.[/COLOR] [FONT=courier new]Запрещено оскорблять игроков или родных в Voice Chat. | [COLOR=rgb(255, 0, 0)]Ban 7 - 15 дней[/COLOR].[/FONT][/SPOILER]<br>' +
     '[FONT=times new roman][B]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/B][/FONT]<br>' +
'[FONT=times new roman][B]С уважением состав Кураторов Форума сервера [COLOR=rgb(0, 255, 255)]AQUA[/COLOR][/B][/FONT]<br>'+
      '[FONT=times new roman][COLOR=rgb(0, 255, 255)][ICODE]Благодарим вас за ваше обращение.[/ICODE]' +
    '[img]https://i.postimg.cc/jjSt7ZSW/H0px-Zrw4d-BTldu-AMYAYTDk-Am-Xv-I7-XIB2-M-Bj-ENl-LY908-Ecrrlr-ZFNa-P6vw-SJf-Dsmmv-Bzi-V0-Tbj-C0s3bg5-Jz-Io-Xw.png[/img]<br>'+
       '[CENTER][FONT=courier new][COLOR=rgb(0, 255, 0)]Одобрено,[/FONT][/COLOR] [COLOR=rgb(255, 0, 0)]закрыто[/COLOR][/CENTER]<br>',
      prefix: ACCEPT_PREFIX,
	  status: false,
},
   {
title: 'оск в ООС',
content:
 '[CENTER][IMG]https://i.postimg.cc/FRfvPzcN/Ltjtv-TM-1.png[/IMG]<br>' +
     '[CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman][ICODE]Доброго времени суток, уважаемый(-ая) {{ user.name }} [/ICODE][/FONT][/COLOR]<br>' +
'[CENTER][FONT=times new roman]Ваша жалоба [COLOR=rgb(0, 255, 0)]одобрена[/COLOR], игрок получит своё наказание по пункту правил:[/FONT]' +
'[SPOILER="*Нажмите*"][COLOR=rgb(255, 0, 0)]3.03.[/COLOR] [FONT=courier new]Любые формы оскорблений, издевательств, расизма, дискриминации, религиозной враждебности, сексизма в OOC чате запрещены | [COLOR=rgb(255, 0, 0)]Mute 30 минут[/COLOR].[/FONT][/SPOILER]<br>' +
     '[FONT=times new roman][B]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/B][/FONT]<br>' +
'[FONT=times new roman][B]С уважением состав Кураторов Форума сервера [COLOR=rgb(0, 255, 255)]AQUA[/COLOR][/B][/FONT]<br>'+
      '[FONT=times new roman][COLOR=rgb(0, 255, 255)][ICODE]Благодарим вас за ваше обращение.[/ICODE]' +
    '[img]https://i.postimg.cc/jjSt7ZSW/H0px-Zrw4d-BTldu-AMYAYTDk-Am-Xv-I7-XIB2-M-Bj-ENl-LY908-Ecrrlr-ZFNa-P6vw-SJf-Dsmmv-Bzi-V0-Tbj-C0s3bg5-Jz-Io-Xw.png[/img]<br>'+
       '[CENTER][FONT=courier new][COLOR=rgb(0, 255, 0)]Одобрено,[/FONT][/COLOR] [COLOR=rgb(255, 0, 0)]закрыто[/COLOR][/CENTER]<br>',
      prefix: ACCEPT_PREFIX,
	  status: false,
},
   {
title: 'osk adm',
content:
 '[CENTER][IMG]https://i.postimg.cc/FRfvPzcN/Ltjtv-TM-1.png[/IMG]<br>' +
     '[CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman][ICODE]Доброго времени суток, уважаемый(-ая) {{ user.name }} [/ICODE][/FONT][/COLOR]<br>' +
'[CENTER][FONT=times new roman]Ваша жалоба [COLOR=rgb(0, 255, 0)]одобрена[/COLOR], игрок получит своё наказание по пункту правил:[/FONT]' +
'[SPOILER="*Нажмите*"][COLOR=rgb(255, 0, 0)]2.54.[/COLOR] [FONT=courier new]Запрещено неуважительное обращение, оскорбление, неадекватное поведение, угрозы в любом их проявлении по отношению к администрации. | [COLOR=rgb(255, 0, 0)]Mute 180 минут[/COLOR].[/FONT][/SPOILER]<br>' +
     '[FONT=times new roman][B]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/B][/FONT]<br>' +
'[FONT=times new roman][B]С уважением состав Кураторов Форума сервера [COLOR=rgb(0, 255, 255)]AQUA[/COLOR][/B][/FONT]<br>'+
      '[FONT=times new roman][COLOR=rgb(0, 255, 255)][ICODE]Благодарим вас за ваше обращение.[/ICODE]' +
    '[img]https://i.postimg.cc/jjSt7ZSW/H0px-Zrw4d-BTldu-AMYAYTDk-Am-Xv-I7-XIB2-M-Bj-ENl-LY908-Ecrrlr-ZFNa-P6vw-SJf-Dsmmv-Bzi-V0-Tbj-C0s3bg5-Jz-Io-Xw.png[/img]<br>'+
       '[CENTER][FONT=courier new][COLOR=rgb(0, 255, 0)]Одобрено,[/FONT][/COLOR] [COLOR=rgb(255, 0, 0)]закрыто[/COLOR][/CENTER]<br>',
      prefix: ACCEPT_PREFIX,
	  status: false,
},
   {
title: 'osk проекта',
content:
 '[CENTER][IMG]https://i.postimg.cc/FRfvPzcN/Ltjtv-TM-1.png[/IMG]<br>' +
     '[CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman][ICODE]Доброго времени суток, уважаемый(-ая) {{ user.name }} [/ICODE][/FONT][/COLOR]<br>' +
'[CENTER][FONT=times new roman]Ваша жалоба [COLOR=rgb(0, 255, 0)]одобрена[/COLOR], игрок получит своё наказание по пункту правил:[/FONT]' +
'[SPOILER="*Нажмите*"][COLOR=rgb(255, 0, 0)]2.40.[/COLOR] [FONT=courier new]Запрещены совершенно любые деструктивные действия по отношению к проекту: неконструктивная критика, призывы покинуть проект, попытки нарушить развитие проекта или любые другие действия, способные привести к помехам в игровом процессе. | [COLOR=rgb(255, 0, 0)]Mute 300 минут / Ban 30 дней (Ban выдается по согласованию с главным администратором)[/COLOR].[/FONT][/SPOILER]<br>' +
     '[FONT=times new roman][B]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/B][/FONT]<br>' +
'[FONT=times new roman][B]С уважением состав Кураторов Форума сервера [COLOR=rgb(0, 255, 255)]AQUA[/COLOR][/B][/FONT]<br>'+
      '[FONT=times new roman][COLOR=rgb(0, 255, 255)][ICODE]Благодарим вас за ваше обращение.[/ICODE]' +
    '[img]https://i.postimg.cc/jjSt7ZSW/H0px-Zrw4d-BTldu-AMYAYTDk-Am-Xv-I7-XIB2-M-Bj-ENl-LY908-Ecrrlr-ZFNa-P6vw-SJf-Dsmmv-Bzi-V0-Tbj-C0s3bg5-Jz-Io-Xw.png[/img]<br>'+
       '[CENTER][FONT=courier new][COLOR=rgb(0, 255, 0)]Одобрено,[/FONT][/COLOR] [COLOR=rgb(255, 0, 0)]закрыто[/COLOR][/CENTER]<br>',
      prefix: ACCEPT_PREFIX,
	  status: false,
},
  {
title: 'ndrive',
content:
 '[CENTER][IMG]https://i.postimg.cc/FRfvPzcN/Ltjtv-TM-1.png[/IMG]<br>' +
     '[CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman][ICODE]Доброго времени суток, уважаемый(-ая) {{ user.name }} [/ICODE][/FONT][/COLOR]<br>' +
'[CENTER][FONT=times new roman]Ваша жалоба [COLOR=rgb(0, 255, 0)]одобрена[/COLOR], игрок получит своё наказание по пункту правил:[/FONT]' +
'[SPOILER="*Нажмите*"][COLOR=rgb(255, 0, 0)]2.03.[/COLOR] [FONT=courier new]Запрещен NonRP Drive — вождение любого транспортного средства в невозможных для него условиях, а также вождение в неправдоподобной манере. | [COLOR=rgb(255, 0, 0)]Jail 30 минут[/COLOR].[/FONT][/SPOILER]<br>' +
     '[FONT=times new roman][B]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/B][/FONT]<br>' +
'[FONT=times new roman][B]С уважением состав Кураторов Форума сервера [COLOR=rgb(0, 255, 255)]AQUA[/COLOR][/B][/FONT]<br>'+
      '[FONT=times new roman][COLOR=rgb(0, 255, 255)][ICODE]Благодарим вас за ваше обращение.[/ICODE]' +
    '[img]https://i.postimg.cc/jjSt7ZSW/H0px-Zrw4d-BTldu-AMYAYTDk-Am-Xv-I7-XIB2-M-Bj-ENl-LY908-Ecrrlr-ZFNa-P6vw-SJf-Dsmmv-Bzi-V0-Tbj-C0s3bg5-Jz-Io-Xw.png[/img]<br>'+
       '[CENTER][FONT=courier new][COLOR=rgb(0, 255, 0)]Одобрено,[/FONT][/COLOR] [COLOR=rgb(255, 0, 0)]закрыто[/COLOR][/CENTER]<br>',
      prefix: ACCEPT_PREFIX,
	  status: false,
},
   {
title: 'ndrive фура/инко',
content:
 '[CENTER][IMG]https://i.postimg.cc/FRfvPzcN/Ltjtv-TM-1.png[/IMG]<br>' +
     '[CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman][ICODE]Доброго времени суток, уважаемый(-ая) {{ user.name }} [/ICODE][/FONT][/COLOR]<br>' +
'[CENTER][FONT=times new roman]Ваша жалоба [COLOR=rgb(0, 255, 0)]одобрена[/COLOR], игрок получит своё наказание по пункту правил:[/FONT]' +
'[SPOILER="*Нажмите*"][COLOR=rgb(255, 0, 0)]2.47.[/COLOR] [FONT=courier new]Запрещено ездить по полям на грузовом транспорте, инкассаторских машинах (работа дальнобойщика, инкассатора). | [COLOR=rgb(255, 0, 0)]Jail 60 минут[/COLOR].[/FONT][/SPOILER]<br>' +
     '[FONT=times new roman][B]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/B][/FONT]<br>' +
'[FONT=times new roman][B]С уважением состав Кураторов Форума сервера [COLOR=rgb(0, 255, 255)]AQUA[/COLOR][/B][/FONT]<br>'+
      '[FONT=times new roman][COLOR=rgb(0, 255, 255)][ICODE]Благодарим вас за ваше обращение.[/ICODE]' +
    '[img]https://i.postimg.cc/jjSt7ZSW/H0px-Zrw4d-BTldu-AMYAYTDk-Am-Xv-I7-XIB2-M-Bj-ENl-LY908-Ecrrlr-ZFNa-P6vw-SJf-Dsmmv-Bzi-V0-Tbj-C0s3bg5-Jz-Io-Xw.png[/img]<br>'+
       '[CENTER][FONT=courier new][COLOR=rgb(0, 255, 0)]Одобрено,[/FONT][/COLOR] [COLOR=rgb(255, 0, 0)]закрыто[/COLOR][/CENTER]<br>',
      prefix: ACCEPT_PREFIX,
	  status: false,
},
   {
title: 'помеха ип',
content:
 '[CENTER][IMG]https://i.postimg.cc/FRfvPzcN/Ltjtv-TM-1.png[/IMG]<br>' +
     '[CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman][ICODE]Доброго времени суток, уважаемый(-ая) {{ user.name }} [/ICODE][/FONT][/COLOR]<br>' +
'[CENTER][FONT=times new roman]Ваша жалоба [COLOR=rgb(0, 255, 0)]одобрена[/COLOR], игрок получит своё наказание по пункту правил:[/FONT]' +
'[SPOILER="*Нажмите*"][COLOR=rgb(255, 0, 0)]2.04.[/COLOR] [FONT=courier new]Запрещены любые действия способные привести к помехам в игровом процессе, а также выполнению работ, если они этого не предусматривают и если эти действия выходят за рамки игрового процесса данной работы. | [COLOR=rgb(255, 0, 0)]Ban 10 дней / Обнуление аккаунта (при повторном нарушении)[/COLOR].[/FONT][/SPOILER]<br>' +
     '[FONT=times new roman][B]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/B][/FONT]<br>' +
'[FONT=times new roman][B]С уважением состав Кураторов Форума сервера [COLOR=rgb(0, 255, 255)]AQUA[/COLOR][/B][/FONT]<br>'+
      '[FONT=times new roman][COLOR=rgb(0, 255, 255)][ICODE]Благодарим вас за ваше обращение.[/ICODE]' +
    '[img]https://i.postimg.cc/jjSt7ZSW/H0px-Zrw4d-BTldu-AMYAYTDk-Am-Xv-I7-XIB2-M-Bj-ENl-LY908-Ecrrlr-ZFNa-P6vw-SJf-Dsmmv-Bzi-V0-Tbj-C0s3bg5-Jz-Io-Xw.png[/img]<br>'+
       '[CENTER][FONT=courier new][COLOR=rgb(0, 255, 0)]Одобрено,[/FONT][/COLOR] [COLOR=rgb(255, 0, 0)]закрыто[/COLOR][/CENTER]<br>',
      prefix: ACCEPT_PREFIX,
	  status: false,
},
  {
title: 'уход от рп',
content:
 '[CENTER][IMG]https://i.postimg.cc/FRfvPzcN/Ltjtv-TM-1.png[/IMG]<br>' +
     '[CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman][ICODE]Доброго времени суток, уважаемый(-ая) {{ user.name }} [/ICODE][/FONT][/COLOR]<br>' +
'[CENTER][FONT=times new roman]Ваша жалоба [COLOR=rgb(0, 255, 0)]одобрена[/COLOR], игрок получит своё наказание по пункту правил:[/FONT]' +
'[SPOILER="*Нажмите*"][COLOR=rgb(255, 0, 0)]2.02.[/COLOR] [FONT=courier new]Запрещено целенаправленно уходить от Role Play процесса всеразличными способами. | [COLOR=rgb(255, 0, 0)]Jail 30 минут / Warn[/COLOR].[/FONT][/SPOILER]<br>' +
     '[FONT=times new roman][B]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/B][/FONT]<br>' +
'[FONT=times new roman][B]С уважением состав Кураторов Форума сервера [COLOR=rgb(0, 255, 255)]AQUA[/COLOR][/B][/FONT]<br>'+
      '[FONT=times new roman][COLOR=rgb(0, 255, 255)][ICODE]Благодарим вас за ваше обращение.[/ICODE]' +
    '[img]https://i.postimg.cc/jjSt7ZSW/H0px-Zrw4d-BTldu-AMYAYTDk-Am-Xv-I7-XIB2-M-Bj-ENl-LY908-Ecrrlr-ZFNa-P6vw-SJf-Dsmmv-Bzi-V0-Tbj-C0s3bg5-Jz-Io-Xw.png[/img]<br>'+
       '[CENTER][FONT=courier new][COLOR=rgb(0, 255, 0)]Одобрено,[/FONT][/COLOR] [COLOR=rgb(255, 0, 0)]закрыто[/COLOR][/CENTER]<br>',
      prefix: ACCEPT_PREFIX,
	  status: false,
},
   {
title: 'багоюз',
content:
 '[CENTER][IMG]https://i.postimg.cc/FRfvPzcN/Ltjtv-TM-1.png[/IMG]<br>' +
     '[CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman][ICODE]Доброго времени суток, уважаемый(-ая) {{ user.name }} [/ICODE][/FONT][/COLOR]<br>' +
'[CENTER][FONT=times new roman]Ваша жалоба [COLOR=rgb(0, 255, 0)]одобрена[/COLOR], игрок получит своё наказание по пункту правил:[/FONT]' +
'[SPOILER="*Нажмите*"][COLOR=rgb(255, 0, 0)]2.21.[/COLOR] [FONT=courier new]Запрещено пытаться обходить игровую систему или использовать любые баги сервера. | [COLOR=rgb(255, 0, 0)]Ban 15 - 30 дней / PermBan[/COLOR].[/FONT][/SPOILER]<br>' +
     '[FONT=times new roman][B]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/B][/FONT]<br>' +
'[FONT=times new roman][B]С уважением состав Кураторов Форума сервера [COLOR=rgb(0, 255, 255)]AQUA[/COLOR][/B][/FONT]<br>'+
      '[FONT=times new roman][COLOR=rgb(0, 255, 255)][ICODE]Благодарим вас за ваше обращение.[/ICODE]' +
    '[img]https://i.postimg.cc/jjSt7ZSW/H0px-Zrw4d-BTldu-AMYAYTDk-Am-Xv-I7-XIB2-M-Bj-ENl-LY908-Ecrrlr-ZFNa-P6vw-SJf-Dsmmv-Bzi-V0-Tbj-C0s3bg5-Jz-Io-Xw.png[/img]<br>'+
       '[CENTER][FONT=courier new][COLOR=rgb(0, 255, 0)]Одобрено,[/FONT][/COLOR] [COLOR=rgb(255, 0, 0)]закрыто[/COLOR][/CENTER]<br>',
      prefix: ACCEPT_PREFIX,
	  status: false,
},
  {
title: 'багоюз аним',
content:
 '[CENTER][IMG]https://i.postimg.cc/FRfvPzcN/Ltjtv-TM-1.png[/IMG]<br>' +
     '[CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman][ICODE]Доброго времени суток, уважаемый(-ая) {{ user.name }} [/ICODE][/FONT][/COLOR]<br>' +
'[CENTER][FONT=times new roman]Ваша жалоба [COLOR=rgb(0, 255, 0)]одобрена[/COLOR], игрок получит своё наказание по пункту правил:[/FONT]' +
'[SPOILER="*Нажмите*"][COLOR=rgb(255, 0, 0)]2.55.[/COLOR] [FONT=courier new]Запрещается багоюз связанный с анимацией в любых проявлениях. | [COLOR=rgb(255, 0, 0)]Jail 60 / 120 минут[/COLOR].[/FONT][/SPOILER]<br>' +
     '[FONT=times new roman][B]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/B][/FONT]<br>' +
'[FONT=times new roman][B]С уважением состав Кураторов Форума сервера [COLOR=rgb(0, 255, 255)]AQUA[/COLOR][/B][/FONT]<br>'+
      '[FONT=times new roman][COLOR=rgb(0, 255, 255)][ICODE]Благодарим вас за ваше обращение.[/ICODE]' +
    '[img]https://i.postimg.cc/jjSt7ZSW/H0px-Zrw4d-BTldu-AMYAYTDk-Am-Xv-I7-XIB2-M-Bj-ENl-LY908-Ecrrlr-ZFNa-P6vw-SJf-Dsmmv-Bzi-V0-Tbj-C0s3bg5-Jz-Io-Xw.png[/img]<br>'+
       '[CENTER][FONT=courier new][COLOR=rgb(0, 255, 0)]Одобрено,[/FONT][/COLOR] [COLOR=rgb(255, 0, 0)]закрыто[/COLOR][/CENTER]<br>',
      prefix: ACCEPT_PREFIX,
	  status: false,
},
   {
title: 'ООС угрозы',
content:
 '[CENTER][IMG]https://i.postimg.cc/FRfvPzcN/Ltjtv-TM-1.png[/IMG]<br>' +
     '[CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman][ICODE]Доброго времени суток, уважаемый(-ая) {{ user.name }} [/ICODE][/FONT][/COLOR]<br>' +
'[CENTER][FONT=times new roman]Ваша жалоба [COLOR=rgb(0, 255, 0)]одобрена[/COLOR], игрок получит своё наказание по пункту правил:[/FONT]' +
'[SPOILER="*Нажмите*"][COLOR=rgb(255, 0, 0)]2.37.[/COLOR] [FONT=courier new]Запрещены OOC угрозы, в том числе и завуалированные. | [COLOR=rgb(255, 0, 0)]Mute 120 минут / Ban 7 - 15 дней[/COLOR].[/FONT][/SPOILER]<br>' +
     '[FONT=times new roman][B]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/B][/FONT]<br>' +
'[FONT=times new roman][B]С уважением состав Кураторов Форума сервера [COLOR=rgb(0, 255, 255)]AQUA[/COLOR][/B][/FONT]<br>'+
      '[FONT=times new roman][COLOR=rgb(0, 255, 255)][ICODE]Благодарим вас за ваше обращение.[/ICODE]' +
    '[img]https://i.postimg.cc/jjSt7ZSW/H0px-Zrw4d-BTldu-AMYAYTDk-Am-Xv-I7-XIB2-M-Bj-ENl-LY908-Ecrrlr-ZFNa-P6vw-SJf-Dsmmv-Bzi-V0-Tbj-C0s3bg5-Jz-Io-Xw.png[/img]<br>'+
       '[CENTER][FONT=courier new][COLOR=rgb(0, 255, 0)]Одобрено,[/FONT][/COLOR] [COLOR=rgb(255, 0, 0)]закрыто[/COLOR][/CENTER]<br>',
      prefix: ACCEPT_PREFIX,
	  status: false,
},
  {
title: 'Выдача за адм',
content:
 '[CENTER][IMG]https://i.postimg.cc/FRfvPzcN/Ltjtv-TM-1.png[/IMG]<br>' +
     '[CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman][ICODE]Доброго времени суток, уважаемый(-ая) {{ user.name }} [/ICODE][/FONT][/COLOR]<br>' +
'[CENTER][FONT=times new roman]Ваша жалоба [COLOR=rgb(0, 255, 0)]одобрена[/COLOR], игрок получит своё наказание по пункту правил:[/FONT]' +
'[SPOILER="*Нажмите*"][COLOR=rgb(255, 0, 0)]3.10.[/COLOR] [FONT=courier new]Запрещена выдача себя за администратора, если таковым не являетесь. | [COLOR=rgb(255, 0, 0)]Ban 7 - 15 + ЧС администрации[/COLOR].[/FONT][/SPOILER]<br>' +
     '[FONT=times new roman][B]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/B][/FONT]<br>' +
'[FONT=times new roman][B]С уважением состав Кураторов Форума сервера [COLOR=rgb(0, 255, 255)]AQUA[/COLOR][/B][/FONT]<br>'+
      '[FONT=times new roman][COLOR=rgb(0, 255, 255)][ICODE]Благодарим вас за ваше обращение.[/ICODE]' +
    '[img]https://i.postimg.cc/jjSt7ZSW/H0px-Zrw4d-BTldu-AMYAYTDk-Am-Xv-I7-XIB2-M-Bj-ENl-LY908-Ecrrlr-ZFNa-P6vw-SJf-Dsmmv-Bzi-V0-Tbj-C0s3bg5-Jz-Io-Xw.png[/img]<br>'+
       '[CENTER][FONT=courier new][COLOR=rgb(0, 255, 0)]Одобрено,[/FONT][/COLOR] [COLOR=rgb(255, 0, 0)]закрыто[/COLOR][/CENTER]<br>',
      prefix: ACCEPT_PREFIX,
	  status: false,
},
   {
title: 'Ввод в заблужд',
content:
 '[CENTER][IMG]https://i.postimg.cc/FRfvPzcN/Ltjtv-TM-1.png[/IMG]<br>' +
     '[CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman][ICODE]Доброго времени суток, уважаемый(-ая) {{ user.name }} [/ICODE][/FONT][/COLOR]<br>' +
'[CENTER][FONT=times new roman]Ваша жалоба [COLOR=rgb(0, 255, 0)]одобрена[/COLOR], игрок получит своё наказание по пункту правил:[/FONT]' +
'[SPOILER="*Нажмите*"][COLOR=rgb(255, 0, 0)]3.11.[/COLOR] [FONT=courier new]Запрещено введение игроков проекта в заблуждение путем злоупотребления командами. | [COLOR=rgb(255, 0, 0)]Ban 15 - 30 дней / PermBan[/COLOR].[/FONT][/SPOILER]<br>' +
     '[FONT=times new roman][B]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/B][/FONT]<br>' +
'[FONT=times new roman][B]С уважением состав Кураторов Форума сервера [COLOR=rgb(0, 255, 255)]AQUA[/COLOR][/B][/FONT]<br>'+
      '[FONT=times new roman][COLOR=rgb(0, 255, 255)][ICODE]Благодарим вас за ваше обращение.[/ICODE]' +
    '[img]https://i.postimg.cc/jjSt7ZSW/H0px-Zrw4d-BTldu-AMYAYTDk-Am-Xv-I7-XIB2-M-Bj-ENl-LY908-Ecrrlr-ZFNa-P6vw-SJf-Dsmmv-Bzi-V0-Tbj-C0s3bg5-Jz-Io-Xw.png[/img]<br>'+
       '[CENTER][FONT=courier new][COLOR=rgb(0, 255, 0)]Одобрено,[/FONT][/COLOR] [COLOR=rgb(255, 0, 0)]закрыто[/COLOR][/CENTER]<br>',
      prefix: ACCEPT_PREFIX,
	  status: false,
},
   {
title: 'Слив глобал чата',
content:
 '[CENTER][IMG]https://i.postimg.cc/FRfvPzcN/Ltjtv-TM-1.png[/IMG]<br>' +
     '[CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman][ICODE]Доброго времени суток, уважаемый(-ая) {{ user.name }} [/ICODE][/FONT][/COLOR]<br>' +
'[CENTER][FONT=times new roman]Ваша жалоба [COLOR=rgb(0, 255, 0)]одобрена[/COLOR], игрок получит своё наказание по пункту правил:[/FONT]' +
'[SPOILER="*Нажмите*"][COLOR=rgb(255, 0, 0)]3.08.[/COLOR] [FONT=courier new]Запрещены любые формы «слива» посредством использования глобальных чатов. | [COLOR=rgb(255, 0, 0)]PermBan[/COLOR].[/FONT][/SPOILER]<br>' +
     '[FONT=times new roman][B]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/B][/FONT]<br>' +
'[FONT=times new roman][B]С уважением состав Кураторов Форума сервера [COLOR=rgb(0, 255, 255)]AQUA[/COLOR][/B][/FONT]<br>'+
      '[FONT=times new roman][COLOR=rgb(0, 255, 255)][ICODE]Благодарим вас за ваше обращение.[/ICODE]' +
    '[img]https://i.postimg.cc/jjSt7ZSW/H0px-Zrw4d-BTldu-AMYAYTDk-Am-Xv-I7-XIB2-M-Bj-ENl-LY908-Ecrrlr-ZFNa-P6vw-SJf-Dsmmv-Bzi-V0-Tbj-C0s3bg5-Jz-Io-Xw.png[/img]<br>'+
       '[CENTER][FONT=courier new][COLOR=rgb(0, 255, 0)]Одобрено,[/FONT][/COLOR] [COLOR=rgb(255, 0, 0)]закрыто[/COLOR][/CENTER]<br>',
      prefix: ACCEPT_PREFIX,
	  status: false,
},
   {
title: 'Слив склада',
content:
 '[CENTER][IMG]https://i.postimg.cc/FRfvPzcN/Ltjtv-TM-1.png[/IMG]<br>' +
     '[CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman][ICODE]Доброго времени суток, уважаемый(-ая) {{ user.name }} [/ICODE][/FONT][/COLOR]<br>' +
'[CENTER][FONT=times new roman]Ваша жалоба [COLOR=rgb(0, 255, 0)]одобрена[/COLOR], игрок получит своё наказание по пункту правил:[/FONT]' +
'[SPOILER="*Нажмите*"][COLOR=rgb(255, 0, 0)]2.09.[/COLOR] [FONT=courier new]Запрещено сливать склад фракции / семьи путем взятия большого количества ресурсов или превышая допустимый лимит, установленный лидером. | [COLOR=rgb(255, 0, 0)]Ban 15 - 30 дней / PermBan[/COLOR].[/FONT][/SPOILER]<br>' +
    '[CENTER][B][COLOR=rgb(255, 0, 0)]Примечание:[/COLOR] в описании семьи должны быть указаны условия взаимодействия со складом. Если лидер семьи предоставил неограниченный доступ к складу и забыл снять его, администрация не несет ответственности за возможные последствия. Жалобы по данному пункту правил принимаются только от лидера семьи.[/B]' +
     '[CENTER][B][COLOR=rgb(255, 0, 0)]Примечание:[/COLOR] исключение всех или части игроков из состава семьи без ведома лидера также считается сливом.[/B][/SPOILER]<br>' +
     '[FONT=times new roman][B]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/B][/FONT]<br>' +
'[FONT=times new roman][B]С уважением состав Кураторов Форума сервера [COLOR=rgb(0, 255, 255)]AQUA[/COLOR][/B][/FONT]<br>'+
      '[FONT=times new roman][COLOR=rgb(0, 255, 255)][ICODE]Благодарим вас за ваше обращение.[/ICODE]' +
    '[img]https://i.postimg.cc/jjSt7ZSW/H0px-Zrw4d-BTldu-AMYAYTDk-Am-Xv-I7-XIB2-M-Bj-ENl-LY908-Ecrrlr-ZFNa-P6vw-SJf-Dsmmv-Bzi-V0-Tbj-C0s3bg5-Jz-Io-Xw.png[/img]<br>'+
       '[CENTER][FONT=courier new][COLOR=rgb(0, 255, 0)]Одобрено,[/FONT][/COLOR] [COLOR=rgb(255, 0, 0)]закрыто[/COLOR][/CENTER]<br>',
      prefix: ACCEPT_PREFIX,
	  status: false,
},
   {
title: 'Аморал',
content:
 '[CENTER][IMG]https://i.postimg.cc/FRfvPzcN/Ltjtv-TM-1.png[/IMG]<br>' +
     '[CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman][ICODE]Доброго времени суток, уважаемый(-ая) {{ user.name }} [/ICODE][/FONT][/COLOR]<br>' +
'[CENTER][FONT=times new roman]Ваша жалоба [COLOR=rgb(0, 255, 0)]одобрена[/COLOR], игрок получит своё наказание по пункту правил:[/FONT]' +
'[SPOILER="*Нажмите*"][COLOR=rgb(255, 0, 0)]2.08.[/COLOR] [FONT=courier new]Запрещена любая форма аморальных действий сексуального характера в сторону игроков. | [COLOR=rgb(255, 0, 0)]Jail 30 минут / Warn[/COLOR].[/FONT][/SPOILER]<br>' +
     '[FONT=times new roman][B]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/B][/FONT]<br>' +
'[FONT=times new roman][B]С уважением состав Кураторов Форума сервера [COLOR=rgb(0, 255, 255)]AQUA[/COLOR][/B][/FONT]<br>'+
      '[FONT=times new roman][COLOR=rgb(0, 255, 255)][ICODE]Благодарим вас за ваше обращение.[/ICODE]' +
    '[img]https://i.postimg.cc/jjSt7ZSW/H0px-Zrw4d-BTldu-AMYAYTDk-Am-Xv-I7-XIB2-M-Bj-ENl-LY908-Ecrrlr-ZFNa-P6vw-SJf-Dsmmv-Bzi-V0-Tbj-C0s3bg5-Jz-Io-Xw.png[/img]<br>'+
       '[CENTER][FONT=courier new][COLOR=rgb(0, 255, 0)]Одобрено,[/FONT][/COLOR] [COLOR=rgb(255, 0, 0)]закрыто[/COLOR][/CENTER]<br>',
      prefix: ACCEPT_PREFIX,
	  status: false,
},
  {
title: 'Реклама',
content:
 '[CENTER][IMG]https://i.postimg.cc/FRfvPzcN/Ltjtv-TM-1.png[/IMG]<br>' +
     '[CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman][ICODE]Доброго времени суток, уважаемый(-ая) {{ user.name }} [/ICODE][/FONT][/COLOR]<br>' +
'[CENTER][FONT=times new roman]Ваша жалоба [COLOR=rgb(0, 255, 0)]одобрена[/COLOR], игрок получит своё наказание по пункту правил:[/FONT]' +
'[SPOILER="*Нажмите*"][COLOR=rgb(255, 0, 0)]2.31.[/COLOR] [FONT=courier new]Запрещено рекламировать на серверах любые проекты, серверы, сайты, сторонние Discord-серверы, YouTube каналы и тому подобное. | [COLOR=rgb(255, 0, 0)]Ban 7 дней / PermBan[/COLOR].[/FONT]<br>' +
    '[COLOR=rgb(255, 0, 0)]Примечание:[/COLOR][FONT=times new roman] если игрок не использует глобальный чат, чтобы дать свои контактные данные для связи, это не будет являться рекламой.[/SPOILER][/FONT]<br>' +
     '[FONT=times new roman][B]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/B][/FONT]<br>' +
'[FONT=times new roman][B]С уважением состав Кураторов Форума сервера [COLOR=rgb(0, 255, 255)]AQUA[/COLOR][/B][/FONT]<br>'+
      '[FONT=times new roman][COLOR=rgb(0, 255, 255)][ICODE]Благодарим вас за ваше обращение.[/ICODE]' +
    '[img]https://i.postimg.cc/jjSt7ZSW/H0px-Zrw4d-BTldu-AMYAYTDk-Am-Xv-I7-XIB2-M-Bj-ENl-LY908-Ecrrlr-ZFNa-P6vw-SJf-Dsmmv-Bzi-V0-Tbj-C0s3bg5-Jz-Io-Xw.png[/img]<br>'+
       '[CENTER][FONT=courier new][COLOR=rgb(0, 255, 0)]Одобрено,[/FONT][/COLOR] [COLOR=rgb(255, 0, 0)]закрыто[/COLOR][/CENTER]<br>',
      prefix: ACCEPT_PREFIX,
	  status: false,
},
   {
title: 'Реклама промо',
content:
 '[CENTER][IMG]https://i.postimg.cc/FRfvPzcN/Ltjtv-TM-1.png[/IMG]<br>' +
     '[CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman][ICODE]Доброго времени суток, уважаемый(-ая) {{ user.name }} [/ICODE][/FONT][/COLOR]<br>' +
'[CENTER][FONT=times new roman]Ваша жалоба [COLOR=rgb(0, 255, 0)]одобрена[/COLOR], игрок получит своё наказание по пункту правил:[/FONT]' +
'[SPOILER="*Нажмите*"][COLOR=rgb(255, 0, 0)]3.21.[/COLOR] [FONT=courier new]Запрещается реклама промокодов в игре, а также их упоминание в любом виде во всех чатах. | [COLOR=rgb(255, 0, 0)]Ban 30 дней[/COLOR].[/FONT][/SPOILER]<br>' +
     '[FONT=times new roman][B]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/B][/FONT]<br>' +
'[FONT=times new roman][B]С уважением состав Кураторов Форума сервера [COLOR=rgb(0, 255, 255)]AQUA[/COLOR][/B][/FONT]<br>'+
      '[FONT=times new roman][COLOR=rgb(0, 255, 255)][ICODE]Благодарим вас за ваше обращение.[/ICODE]' +
    '[img]https://i.postimg.cc/jjSt7ZSW/H0px-Zrw4d-BTldu-AMYAYTDk-Am-Xv-I7-XIB2-M-Bj-ENl-LY908-Ecrrlr-ZFNa-P6vw-SJf-Dsmmv-Bzi-V0-Tbj-C0s3bg5-Jz-Io-Xw.png[/img]<br>'+
       '[CENTER][FONT=courier new][COLOR=rgb(0, 255, 0)]Одобрено,[/FONT][/COLOR] [COLOR=rgb(255, 0, 0)]закрыто[/COLOR][/CENTER]<br>',
      prefix: ACCEPT_PREFIX,
	  status: false,
},
   {
title: 'Продажа промо',
content:
 '[CENTER][IMG]https://i.postimg.cc/FRfvPzcN/Ltjtv-TM-1.png[/IMG]<br>' +
     '[CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman][ICODE]Доброго времени суток, уважаемый(-ая) {{ user.name }} [/ICODE][/FONT][/COLOR]<br>' +
'[CENTER][FONT=times new roman]Ваша жалоба [COLOR=rgb(0, 255, 0)]одобрена[/COLOR], игрок получит своё наказание по пункту правил:[/FONT]' +
'[SPOILER="*Нажмите*"][COLOR=rgb(255, 0, 0)]2.43.[/COLOR] [FONT=courier new]Запрещена продажа / обмен / покупка поощрительной составляющей от лица проекта, будь то бонус-код, либо промокод, который выдается безвозмездно игрокам в целях промоакций. | [COLOR=rgb(255, 0, 0)]Mute 120 минут[/COLOR].[/FONT][/SPOILER]<br>' +
     '[FONT=times new roman][B]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/B][/FONT]<br>' +
'[FONT=times new roman][B]С уважением состав Кураторов Форума сервера [COLOR=rgb(0, 255, 255)]AQUA[/COLOR][/B][/FONT]<br>'+
      '[FONT=times new roman][COLOR=rgb(0, 255, 255)][ICODE]Благодарим вас за ваше обращение.[/ICODE]' +
    '[img]https://i.postimg.cc/jjSt7ZSW/H0px-Zrw4d-BTldu-AMYAYTDk-Am-Xv-I7-XIB2-M-Bj-ENl-LY908-Ecrrlr-ZFNa-P6vw-SJf-Dsmmv-Bzi-V0-Tbj-C0s3bg5-Jz-Io-Xw.png[/img]<br>'+
       '[CENTER][FONT=courier new][COLOR=rgb(0, 255, 0)]Одобрено,[/FONT][/COLOR] [COLOR=rgb(255, 0, 0)]закрыто[/COLOR][/CENTER]<br>',
      prefix: ACCEPT_PREFIX,
	  status: false,
},
   {
title: 'Читы/сборка',
content:
 '[CENTER][IMG]https://i.postimg.cc/FRfvPzcN/Ltjtv-TM-1.png[/IMG]<br>' +
     '[CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman][ICODE]Доброго времени суток, уважаемый(-ая) {{ user.name }} [/ICODE][/FONT][/COLOR]<br>' +
'[CENTER][FONT=times new roman]Ваша жалоба [COLOR=rgb(0, 255, 0)]одобрена[/COLOR], игрок получит своё наказание по пункту правил:[/FONT]' +
'[SPOILER="*Нажмите*"][COLOR=rgb(255, 0, 0)]2.22.[/COLOR] [FONT=courier new]Запрещено хранить / использовать / распространять стороннее программное обеспечение или любые другие средства, позволяющие получить преимущество над другими игроками. | [COLOR=rgb(255, 0, 0)]Ban 15 - 30 дней / PermBan[/COLOR].[/FONT][/SPOILER]<br>' +
     '[FONT=times new roman][B]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/B][/FONT]<br>' +
'[FONT=times new roman][B]С уважением состав Кураторов Форума сервера [COLOR=rgb(0, 255, 255)]AQUA[/COLOR][/B][/FONT]<br>'+
      '[FONT=times new roman][COLOR=rgb(0, 255, 255)][ICODE]Благодарим вас за ваше обращение.[/ICODE]' +
    '[img]https://i.postimg.cc/jjSt7ZSW/H0px-Zrw4d-BTldu-AMYAYTDk-Am-Xv-I7-XIB2-M-Bj-ENl-LY908-Ecrrlr-ZFNa-P6vw-SJf-Dsmmv-Bzi-V0-Tbj-C0s3bg5-Jz-Io-Xw.png[/img]<br>'+
       '[CENTER][FONT=courier new][COLOR=rgb(0, 255, 0)]Одобрено,[/FONT][/COLOR] [COLOR=rgb(255, 0, 0)]закрыто[/COLOR][/CENTER]<br>',
      prefix: ACCEPT_PREFIX,
	  status: false,
     	},
  {
title: 'Покупка/продажа ив',
content:
 '[CENTER][IMG]https://i.postimg.cc/FRfvPzcN/Ltjtv-TM-1.png[/IMG]<br>' +
     '[CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman][ICODE]Доброго времени суток, уважаемый(-ая) {{ user.name }} [/ICODE][/FONT][/COLOR]<br>' +
'[CENTER][FONT=times new roman]Ваша жалоба [COLOR=rgb(0, 255, 0)]одобрена[/COLOR], игрок получит своё наказание по пункту правил:[/FONT]' +
'[SPOILER="*Нажмите*"][COLOR=rgb(255, 0, 0)]2.28.[/COLOR] [FONT=courier new] Запрещена покупка, продажа внутриигровой валюты за реальные деньги в любом виде | [COLOR=rgb(255, 0, 0)]PermBan с обнулением аккаунта + ЧС проекта.[/COLOR].' +
    '[CENTER][B][COLOR=rgb(255, 0, 0)]Примечание:[/COLOR] любые попытки купить или продать внутриигровую валюту, интересоваться этим у других игроков или обсуждать это – наказуемо.[/B]' +
    '[CENTER][B][COLOR=rgb(255, 0, 0)]Примечание:[/COLOR] нельзя обменивать донат валюту (например, рубли, пополненные через сайт) на игровые ценности и наоборот.[/B]' +
    '[CENTER][B][COLOR=rgb(255, 0, 0)]Пример:[/COLOR] пополнение донат-счёта другого игрока в обмен на игровую валюту или другие ценности запрещено.[/B]' +
    '[CENTER][B][COLOR=rgb(255, 0, 0)]Примечание:[/COLOR] продавать или обменивать игровые ценности, которые были куплены за донат-валюту, не запрещено.[/B]' +
    '[CENTER][B][COLOR=rgb(255, 0, 0)]Исключение:[/COLOR] покупка игровой валюты или ценностей через официальный сайт разрешена.[/B][/SPOILER]<br>' +
     '[FONT=times new roman][B]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/B][/FONT]<br>' +
'[FONT=times new roman][B]С уважением состав Кураторов Форума сервера [COLOR=rgb(0, 255, 255)]AQUA[/COLOR][/B][/FONT]<br>'+
      '[FONT=times new roman][COLOR=rgb(0, 255, 255)][ICODE]Благодарим вас за ваше обращение.[/ICODE]' +
    '[img]https://i.postimg.cc/jjSt7ZSW/H0px-Zrw4d-BTldu-AMYAYTDk-Am-Xv-I7-XIB2-M-Bj-ENl-LY908-Ecrrlr-ZFNa-P6vw-SJf-Dsmmv-Bzi-V0-Tbj-C0s3bg5-Jz-Io-Xw.png[/img]<br>'+
       '[CENTER][FONT=courier new][COLOR=rgb(0, 255, 0)]Одобрено,[/FONT][/COLOR] [COLOR=rgb(255, 0, 0)]закрыто[/COLOR][/CENTER]<br>',
      prefix: ACCEPT_PREFIX,
	  status: false,
},
   {
title: 'Злоупотреб симвл',
content:
 '[CENTER][IMG]https://i.postimg.cc/FRfvPzcN/Ltjtv-TM-1.png[/IMG]<br>' +
     '[CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman][ICODE]Доброго времени суток, уважаемый(-ая) {{ user.name }} [/ICODE][/FONT][/COLOR]<br>' +
'[CENTER][FONT=times new roman]Ваша жалоба [COLOR=rgb(0, 255, 0)]одобрена[/COLOR], игрок получит своё наказание по пункту правил:[/FONT]' +
'[SPOILER="*Нажмите*"][COLOR=rgb(255, 0, 0)]3.06.[/COLOR] [FONT=courier new]Запрещено злоупотребление знаков препинания и прочих символов. | [COLOR=rgb(255, 0, 0)]Mute 30 минут[/COLOR].[/FONT][/SPOILER]<br>' +
     '[FONT=times new roman][B]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/B][/FONT]<br>' +
'[FONT=times new roman][B]С уважением состав Кураторов Форума сервера [COLOR=rgb(0, 255, 255)]AQUA[/COLOR][/B][/FONT]<br>'+
      '[FONT=times new roman][COLOR=rgb(0, 255, 255)][ICODE]Благодарим вас за ваше обращение.[/ICODE]' +
    '[img]https://i.postimg.cc/jjSt7ZSW/H0px-Zrw4d-BTldu-AMYAYTDk-Am-Xv-I7-XIB2-M-Bj-ENl-LY908-Ecrrlr-ZFNa-P6vw-SJf-Dsmmv-Bzi-V0-Tbj-C0s3bg5-Jz-Io-Xw.png[/img]<br>'+
       '[CENTER][FONT=courier new][COLOR=rgb(0, 255, 0)]Одобрено,[/FONT][/COLOR] [COLOR=rgb(255, 0, 0)]закрыто[/COLOR][/CENTER]<br>',
      prefix: ACCEPT_PREFIX,
	  status: false,
},
   {
title: 'Злоупотреб нарушениями',
content:
 '[CENTER][IMG]https://i.postimg.cc/FRfvPzcN/Ltjtv-TM-1.png[/IMG]<br>' +
     '[CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman][ICODE]Доброго времени суток, уважаемый(-ая) {{ user.name }} [/ICODE][/FONT][/COLOR]<br>' +
'[CENTER][FONT=times new roman]Ваша жалоба [COLOR=rgb(0, 255, 0)]одобрена[/COLOR], игрок получит своё наказание по пункту правил:[/FONT]' +
'[SPOILER="*Нажмите*"][COLOR=rgb(255, 0, 0)]2.39.[/COLOR] [FONT=courier new]Запрещено злоупотребление нарушениями правил сервера. | [COLOR=rgb(255, 0, 0)]Ban 7 - 15 дней[/COLOR].[/FONT][/SPOILER]<br>' +
     '[FONT=times new roman][B]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/B][/FONT]<br>' +
'[FONT=times new roman][B]С уважением состав Кураторов Форума сервера [COLOR=rgb(0, 255, 255)]AQUA[/COLOR][/B][/FONT]<br>'+
      '[FONT=times new roman][COLOR=rgb(0, 255, 255)][ICODE]Благодарим вас за ваше обращение.[/ICODE]' +
    '[img]https://i.postimg.cc/jjSt7ZSW/H0px-Zrw4d-BTldu-AMYAYTDk-Am-Xv-I7-XIB2-M-Bj-ENl-LY908-Ecrrlr-ZFNa-P6vw-SJf-Dsmmv-Bzi-V0-Tbj-C0s3bg5-Jz-Io-Xw.png[/img]<br>'+
       '[CENTER][FONT=courier new][COLOR=rgb(0, 255, 0)]Одобрено,[/FONT][/COLOR] [COLOR=rgb(255, 0, 0)]закрыто[/COLOR][/CENTER]<br>',
      prefix: ACCEPT_PREFIX,
	  status: false,
},
   {
title: 'Конфликты осс и ic',
content:
 '[CENTER][IMG]https://i.postimg.cc/FRfvPzcN/Ltjtv-TM-1.png[/IMG]<br>' +
     '[CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman][ICODE]Доброго времени суток, уважаемый(-ая) {{ user.name }} [/ICODE][/FONT][/COLOR]<br>' +
'[CENTER][FONT=times new roman]Ваша жалоба [COLOR=rgb(0, 255, 0)]одобрена[/COLOR], игрок получит своё наказание по пункту правил:[/FONT]' +
'[SPOILER="*Нажмите*"][COLOR=rgb(255, 0, 0)]2.35.[/COLOR] [FONT=courier new]На игровых серверах запрещено устраивать IC и OOC конфликты на почве разногласия о национальности и / или религии совершенно в любом формате. | [COLOR=rgb(255, 0, 0)]Mute 120 минут / Ban 7 дней[/COLOR].[/FONT][/SPOILER]<br>' +
     '[FONT=times new roman][B]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/B][/FONT]<br>' +
'[FONT=times new roman][B]С уважением состав Кураторов Форума сервера [COLOR=rgb(0, 255, 255)]AQUA[/COLOR][/B][/FONT]<br>'+
      '[FONT=times new roman][COLOR=rgb(0, 255, 255)][ICODE]Благодарим вас за ваше обращение.[/ICODE]' +
    '[img]https://i.postimg.cc/jjSt7ZSW/H0px-Zrw4d-BTldu-AMYAYTDk-Am-Xv-I7-XIB2-M-Bj-ENl-LY908-Ecrrlr-ZFNa-P6vw-SJf-Dsmmv-Bzi-V0-Tbj-C0s3bg5-Jz-Io-Xw.png[/img]<br>'+
       '[CENTER][FONT=courier new][COLOR=rgb(0, 255, 0)]Одобрено,[/FONT][/COLOR] [COLOR=rgb(255, 0, 0)]закрыто[/COLOR][/CENTER]<br>',
      prefix: ACCEPT_PREFIX,
	  status: false,
},
 {
title: 'полит/религиоз пропаганда',
content:
 '[CENTER][IMG]https://i.postimg.cc/FRfvPzcN/Ltjtv-TM-1.png[/IMG]<br>' +
     '[CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman][ICODE]Доброго времени суток, уважаемый(-ая) {{ user.name }} [/ICODE][/FONT][/COLOR]<br>' +
'[CENTER][FONT=times new roman]Ваша жалоба [COLOR=rgb(0, 255, 0)]одобрена[/COLOR], игрок получит своё наказание по пункту правил:[/FONT]' +
'[SPOILER="*Нажмите*"][COLOR=rgb(255, 0, 0)]3.18.[/COLOR] [FONT=courier new]Запрещено политическое и религиозное пропагандирование, а также провокация игроков к конфликтам, коллективному флуду или беспорядкам в любом из чатов. | [COLOR=rgb(255, 0, 0)]Mute 120 минут / Ban 10 дней[/COLOR].[/FONT][/SPOILER]<br>' +
     '[FONT=times new roman][B]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/B][/FONT]<br>' +
'[FONT=times new roman][B]С уважением состав Кураторов Форума сервера [COLOR=rgb(0, 255, 255)]AQUA[/COLOR][/B][/FONT]<br>'+
      '[FONT=times new roman][COLOR=rgb(0, 255, 255)][ICODE]Благодарим вас за ваше обращение.[/ICODE]' +
    '[img]https://i.postimg.cc/jjSt7ZSW/H0px-Zrw4d-BTldu-AMYAYTDk-Am-Xv-I7-XIB2-M-Bj-ENl-LY908-Ecrrlr-ZFNa-P6vw-SJf-Dsmmv-Bzi-V0-Tbj-C0s3bg5-Jz-Io-Xw.png[/img]<br>'+
       '[CENTER][FONT=courier new][COLOR=rgb(0, 255, 0)]Одобрено,[/FONT][/COLOR] [COLOR=rgb(255, 0, 0)]закрыто[/COLOR][/CENTER]<br>',
      prefix: ACCEPT_PREFIX,
	  status: false,
},
   {
title: 'мат в vip',
content:
 '[CENTER][IMG]https://i.postimg.cc/FRfvPzcN/Ltjtv-TM-1.png[/IMG]<br>' +
     '[CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman][ICODE]Доброго времени суток, уважаемый(-ая) {{ user.name }} [/ICODE][/FONT][/COLOR]<br>' +
'[CENTER][FONT=times new roman]Ваша жалоба [COLOR=rgb(0, 255, 0)]одобрена[/COLOR], игрок получит своё наказание по пункту правил:[/FONT]' +
'[SPOILER="*Нажмите*"][COLOR=rgb(255, 0, 0)]3.23.[/COLOR] [FONT=courier new]Запрещено использование нецензурных слов, в том числе завуалированных и литературных в VIP чате. | [COLOR=rgb(255, 0, 0)]Mute 30 минут[/COLOR].[/FONT][/SPOILER]<br>' +
     '[FONT=times new roman][B]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/B][/FONT]<br>' +
'[FONT=times new roman][B]С уважением состав Кураторов Форума сервера [COLOR=rgb(0, 255, 255)]AQUA[/COLOR][/B][/FONT]<br>'+
      '[FONT=times new roman][COLOR=rgb(0, 255, 255)][ICODE]Благодарим вас за ваше обращение.[/ICODE]' +
    '[img]https://i.postimg.cc/jjSt7ZSW/H0px-Zrw4d-BTldu-AMYAYTDk-Am-Xv-I7-XIB2-M-Bj-ENl-LY908-Ecrrlr-ZFNa-P6vw-SJf-Dsmmv-Bzi-V0-Tbj-C0s3bg5-Jz-Io-Xw.png[/img]<br>'+
       '[CENTER][FONT=courier new][COLOR=rgb(0, 255, 0)]Одобрено,[/FONT][/COLOR] [COLOR=rgb(255, 0, 0)]закрыто[/COLOR][/CENTER]<br>',
      prefix: ACCEPT_PREFIX,
	  status: false,
},
  {
title: 'шум в voice',
content:
 '[CENTER][IMG]https://i.postimg.cc/FRfvPzcN/Ltjtv-TM-1.png[/IMG]<br>' +
     '[CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman][ICODE]Доброго времени суток, уважаемый(-ая) {{ user.name }} [/ICODE][/FONT][/COLOR]<br>' +
'[CENTER][FONT=times new roman]Ваша жалоба [COLOR=rgb(0, 255, 0)]одобрена[/COLOR], игрок получит своё наказание по пункту правил:[/FONT]' +
'[SPOILER="*Нажмите*"][COLOR=rgb(255, 0, 0)]3.16.[/COLOR] [FONT=courier new]Запрещено создавать посторонние шумы или звуки в Voice Chat. | [COLOR=rgb(255, 0, 0)]Mute 60 минут[/COLOR].[/FONT][/SPOILER]<br>' +
     '[FONT=times new roman][B]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/B][/FONT]<br>' +
'[FONT=times new roman][B]С уважением состав Кураторов Форума сервера [COLOR=rgb(0, 255, 255)]AQUA[/COLOR][/B][/FONT]<br>'+
      '[FONT=times new roman][COLOR=rgb(0, 255, 255)][ICODE]Благодарим вас за ваше обращение.[/ICODE]' +
    '[img]https://i.postimg.cc/jjSt7ZSW/H0px-Zrw4d-BTldu-AMYAYTDk-Am-Xv-I7-XIB2-M-Bj-ENl-LY908-Ecrrlr-ZFNa-P6vw-SJf-Dsmmv-Bzi-V0-Tbj-C0s3bg5-Jz-Io-Xw.png[/img]<br>'+
       '[CENTER][FONT=courier new][COLOR=rgb(0, 255, 0)]Одобрено,[/FONT][/COLOR] [COLOR=rgb(255, 0, 0)]закрыто[/COLOR][/CENTER]<br>',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
  {
title: 'музыка в voice',
content:
 '[CENTER][IMG]https://i.postimg.cc/FRfvPzcN/Ltjtv-TM-1.png[/IMG]<br>' +
     '[CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman][ICODE]Доброго времени суток, уважаемый(-ая) {{ user.name }} [/ICODE][/FONT][/COLOR]<br>' +
'[CENTER][FONT=times new roman]Ваша жалоба [COLOR=rgb(0, 255, 0)]одобрена[/COLOR], игрок получит своё наказание по пункту правил:[/FONT]' +
'[SPOILER="*Нажмите*"][COLOR=rgb(255, 0, 0)]3.14.[/COLOR] [FONT=courier new]Запрещено включать музыку в Voice Chat. | [COLOR=rgb(255, 0, 0)]Mute 60 минут[/COLOR].[/FONT][/SPOILER]<br>' +
     '[FONT=times new roman][B]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/B][/FONT]<br>' +
'[FONT=times new roman][B]С уважением состав Кураторов Форума сервера [COLOR=rgb(0, 255, 255)]AQUA[/COLOR][/B][/FONT]<br>'+
      '[FONT=times new roman][COLOR=rgb(0, 255, 255)][ICODE]Благодарим вас за ваше обращение.[/ICODE]' +
    '[img]https://i.postimg.cc/jjSt7ZSW/H0px-Zrw4d-BTldu-AMYAYTDk-Am-Xv-I7-XIB2-M-Bj-ENl-LY908-Ecrrlr-ZFNa-P6vw-SJf-Dsmmv-Bzi-V0-Tbj-C0s3bg5-Jz-Io-Xw.png[/img]<br>'+
       '[CENTER][FONT=courier new][COLOR=rgb(0, 255, 0)]Одобрено,[/FONT][/COLOR] [COLOR=rgb(255, 0, 0)]закрыто[/COLOR][/CENTER]<br>',
      prefix: ACCEPT_PREFIX,
	  status: false,
},
 {
title: 'арест в каз/аук',
content:
 '[CENTER][IMG]https://i.postimg.cc/FRfvPzcN/Ltjtv-TM-1.png[/IMG]<br>' +
     '[CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman][ICODE]Доброго времени суток, уважаемый(-ая) {{ user.name }} [/ICODE][/FONT][/COLOR]<br>' +
'[CENTER][FONT=times new roman]Ваша жалоба [COLOR=rgb(0, 255, 0)]одобрена[/COLOR], игрок получит своё наказание по пункту правил:[/FONT]' +
'[SPOILER="*Нажмите*"][COLOR=rgb(255, 0, 0)]2.50.[/COLOR] [FONT=courier new]Запрещены задержания, аресты, а также любые действия со стороны игроков, состоящих во фракциях в интерьере аукциона, казино, а также во время системных мероприятий | [COLOR=rgb(255, 0, 0)]Ban 7 - 15 дней + увольнение из организации[/COLOR].[/FONT][/SPOILER]<br>' +
     '[FONT=times new roman][B]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/B][/FONT]<br>' +
'[FONT=times new roman][B]С уважением состав Кураторов Форума сервера [COLOR=rgb(0, 255, 255)]AQUA[/COLOR][/B][/FONT]<br>'+
      '[FONT=times new roman][COLOR=rgb(0, 255, 255)][ICODE]Благодарим вас за ваше обращение.[/ICODE]' +
    '[img]https://i.postimg.cc/jjSt7ZSW/H0px-Zrw4d-BTldu-AMYAYTDk-Am-Xv-I7-XIB2-M-Bj-ENl-LY908-Ecrrlr-ZFNa-P6vw-SJf-Dsmmv-Bzi-V0-Tbj-C0s3bg5-Jz-Io-Xw.png[/img]<br>'+
       '[CENTER][FONT=courier new][COLOR=rgb(0, 255, 0)]Одобрено,[/FONT][/COLOR] [COLOR=rgb(255, 0, 0)]закрыто[/COLOR][/CENTER]<br>',
      prefix: ACCEPT_PREFIX,
	  status: false,
},
 {
title: 'edit в лич целях',
content:
 '[CENTER][IMG]https://i.postimg.cc/FRfvPzcN/Ltjtv-TM-1.png[/IMG]<br>' +
     '[CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman][ICODE]Доброго времени суток, уважаемый(-ая) {{ user.name }} [/ICODE][/FONT][/COLOR]<br>' +
'[CENTER][FONT=times new roman]Ваша жалоба [COLOR=rgb(0, 255, 0)]одобрена[/COLOR], игрок получит своё наказание по пункту правил:[/FONT]' +
'[SPOILER="*Нажмите*"][COLOR=rgb(255, 0, 0)]2.18.[/COLOR] [FONT=courier new]Запрещено редактировать поданные объявления в личных целях заменяя текст объявления на несоответствующий отправленному игроком. | [COLOR=rgb(255, 0, 0)]Ban 7 дней + ЧС организации[/COLOR].[/FONT][/SPOILER]<br>' +
     '[FONT=times new roman][B]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/B][/FONT]<br>' +
'[FONT=times new roman][B]С уважением состав Кураторов Форума сервера [COLOR=rgb(0, 255, 255)]AQUA[/COLOR][/B][/FONT]<br>'+
      '[FONT=times new roman][COLOR=rgb(0, 255, 255)][ICODE]Благодарим вас за ваше обращение.[/ICODE]' +
    '[img]https://i.postimg.cc/jjSt7ZSW/H0px-Zrw4d-BTldu-AMYAYTDk-Am-Xv-I7-XIB2-M-Bj-ENl-LY908-Ecrrlr-ZFNa-P6vw-SJf-Dsmmv-Bzi-V0-Tbj-C0s3bg5-Jz-Io-Xw.png[/img]<br>'+
       '[CENTER][FONT=courier new][COLOR=rgb(0, 255, 0)]Одобрено,[/FONT][/COLOR] [COLOR=rgb(255, 0, 0)]закрыто[/COLOR][/CENTER]<br>',
      prefix: ACCEPT_PREFIX,
	  status: false,
},
  {
title: 'nrp обман',
content:
 '[CENTER][IMG]https://i.postimg.cc/FRfvPzcN/Ltjtv-TM-1.png[/IMG]<br>' +
     '[CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman][ICODE]Доброго времени суток, уважаемый(-ая) {{ user.name }} [/ICODE][/FONT][/COLOR]<br>' +
'[CENTER][FONT=times new roman]Ваша жалоба [COLOR=rgb(0, 255, 0)]одобрена[/COLOR], игрок получит своё наказание по пункту правил:[/FONT]' +
'[SPOILER="*Нажмите*"][COLOR=rgb(255, 0, 0)]2.05.[/COLOR] [FONT=courier new]Запрещены любые OOC обманы и их попытки, а также любые IC обманы с нарушением Role Play правил и логики. | [COLOR=rgb(255, 0, 0)]PermBan[/COLOR].<br>' +
    '[CENTER][B][COLOR=rgb(255, 0, 0)]Примечание:[/COLOR] после IC договоренности получить денежные средства и сразу же выйти из игры с целью обмана игрока, или же, договорившись через OOC чат (/n), точно также получить денежные средства и сразу же выйти из игры и тому подобные ситуации.[/B]' +
    '[CENTER][B][COLOR=rgb(255, 0, 0)]Примечание:[/COLOR] разблокировка игрового аккаунта нарушителя будет возможна только в случае возврата полной суммы причиненного ущерба, либо непосредственно самого имущества, которое было украдено (по решению обманутой стороны).[/B][/FONT][/SPOILER]<br>' +
     '[FONT=times new roman][B]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/B][/FONT]<br>' +
'[FONT=times new roman][B]С уважением состав Кураторов Форума сервера [COLOR=rgb(0, 255, 255)]AQUA[/COLOR][/B][/FONT]<br>'+
      '[FONT=times new roman][COLOR=rgb(0, 255, 255)][ICODE]Благодарим вас за ваше обращение.[/ICODE]' +
    '[img]https://i.postimg.cc/jjSt7ZSW/H0px-Zrw4d-BTldu-AMYAYTDk-Am-Xv-I7-XIB2-M-Bj-ENl-LY908-Ecrrlr-ZFNa-P6vw-SJf-Dsmmv-Bzi-V0-Tbj-C0s3bg5-Jz-Io-Xw.png[/img]<br>'+
       '[CENTER][FONT=courier new][COLOR=rgb(0, 255, 0)]Одобрено,[/FONT][/COLOR] [COLOR=rgb(255, 0, 0)]закрыто[/COLOR][/CENTER]<br>',
      prefix: ACCEPT_PREFIX,
	  status: false,
},
  {
title: 'nrp поведение',
content:
 '[CENTER][IMG]https://i.postimg.cc/FRfvPzcN/Ltjtv-TM-1.png[/IMG]<br>' +
     '[CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman][ICODE]Доброго времени суток, уважаемый(-ая) {{ user.name }} [/ICODE][/FONT][/COLOR]<br>' +
'[CENTER][FONT=times new roman]Ваша жалоба [COLOR=rgb(0, 255, 0)]одобрена[/COLOR], игрок получит своё наказание по пункту правил:[/FONT]' +
'[SPOILER="*Нажмите*"][COLOR=rgb(255, 0, 0)]2.01.[/COLOR] [FONT=courier new]Запрещено поведение, нарушающее нормы процессов Role Play режима игры. | [COLOR=rgb(255, 0, 0)]Jail 30 минут[/COLOR].[/FONT][/SPOILER]<br>' +
     '[FONT=times new roman][B]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/B][/FONT]<br>' +
'[FONT=times new roman][B]С уважением состав Кураторов Форума сервера [COLOR=rgb(0, 255, 255)]AQUA[/COLOR][/B][/FONT]<br>'+
      '[FONT=times new roman][COLOR=rgb(0, 255, 255)][ICODE]Благодарим вас за ваше обращение.[/ICODE]' +
    '[img]https://i.postimg.cc/jjSt7ZSW/H0px-Zrw4d-BTldu-AMYAYTDk-Am-Xv-I7-XIB2-M-Bj-ENl-LY908-Ecrrlr-ZFNa-P6vw-SJf-Dsmmv-Bzi-V0-Tbj-C0s3bg5-Jz-Io-Xw.png[/img]<br>'+
       '[CENTER][FONT=courier new][COLOR=rgb(0, 255, 0)]Одобрено,[/FONT][/COLOR] [COLOR=rgb(255, 0, 0)]закрыто[/COLOR][/CENTER]<br>',
      prefix: ACCEPT_PREFIX,
	  status: false,
},
   {
title: 'nrp коп',
content:
 '[CENTER][IMG]https://i.postimg.cc/FRfvPzcN/Ltjtv-TM-1.png[/IMG]<br>' +
     '[CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman][ICODE]Доброго времени суток, уважаемый(-ая) {{ user.name }} [/ICODE][/FONT][/COLOR]<br>' +
'[CENTER][FONT=times new roman]Ваша жалоба [COLOR=rgb(0, 255, 0)]одобрена[/COLOR], игрок получит своё наказание по пункту правил:[/FONT]' +
'[SPOILER="*Нажмите*"][COLOR=rgb(255, 0, 0)]6.02.[/COLOR] [FONT=courier new]Запрещено выдавать розыск без Role Play причины. | [COLOR=rgb(255, 0, 0)]Warn[/COLOR].[/FONT][/SPOILER]<br>' +
     '[FONT=times new roman][B]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/B][/FONT]<br>' +
'[FONT=times new roman][B]С уважением состав Кураторов Форума сервера [COLOR=rgb(0, 255, 255)]AQUA[/COLOR][/B][/FONT]<br>'+
      '[FONT=times new roman][COLOR=rgb(0, 255, 255)][ICODE]Благодарим вас за ваше обращение.[/ICODE]' +
    '[img]https://i.postimg.cc/jjSt7ZSW/H0px-Zrw4d-BTldu-AMYAYTDk-Am-Xv-I7-XIB2-M-Bj-ENl-LY908-Ecrrlr-ZFNa-P6vw-SJf-Dsmmv-Bzi-V0-Tbj-C0s3bg5-Jz-Io-Xw.png[/img]<br>'+
       '[CENTER][FONT=courier new][COLOR=rgb(0, 255, 0)]Одобрено,[/FONT][/COLOR] [COLOR=rgb(255, 0, 0)]закрыто[/COLOR][/CENTER]<br>',
      prefix: ACCEPT_PREFIX,
	  status: false,
},
  {
title: 'nrp вч',
content:
 '[CENTER][IMG]https://i.postimg.cc/FRfvPzcN/Ltjtv-TM-1.png[/IMG]<br>' +
     '[CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman][ICODE]Доброго времени суток, уважаемый(-ая) {{ user.name }} [/ICODE][/FONT][/COLOR]<br>' +
'[CENTER][FONT=times new roman]Ваша жалоба [COLOR=rgb(0, 255, 0)]одобрена[/COLOR], игрок получит своё наказание по пункту правил:[/FONT]' +
'[SPOILER="*Нажмите*"][COLOR=rgb(255, 0, 0)]2.[/COLOR] [FONT=courier new]Запрещено нападать на военную часть нарушая Role Play. | [COLOR=rgb(255, 0, 0)]Warn (для ОПГ) / Jail 30 минут (для Гражданских)[/COLOR].[/FONT][/SPOILER]<br>' +
     '[FONT=times new roman][B]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/B][/FONT]<br>' +
'[FONT=times new roman][B]С уважением состав Кураторов Форума сервера [COLOR=rgb(0, 255, 255)]AQUA[/COLOR][/B][/FONT]<br>'+
      '[FONT=times new roman][COLOR=rgb(0, 255, 255)][ICODE]Благодарим вас за ваше обращение.[/ICODE]' +
    '[img]https://i.postimg.cc/jjSt7ZSW/H0px-Zrw4d-BTldu-AMYAYTDk-Am-Xv-I7-XIB2-M-Bj-ENl-LY908-Ecrrlr-ZFNa-P6vw-SJf-Dsmmv-Bzi-V0-Tbj-C0s3bg5-Jz-Io-Xw.png[/img]<br>'+
       '[CENTER][FONT=courier new][COLOR=rgb(0, 255, 0)]Одобрено,[/FONT][/COLOR] [COLOR=rgb(255, 0, 0)]закрыто[/COLOR][/CENTER]<br>',
      prefix: ACCEPT_PREFIX,
	  status: false,
},
    {
title: 'nrp акс',
content:
 '[CENTER][IMG]https://i.postimg.cc/FRfvPzcN/Ltjtv-TM-1.png[/IMG]<br>' +
     '[CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman][ICODE]Доброго времени суток, уважаемый(-ая) {{ user.name }} [/ICODE][/FONT][/COLOR]<br>' +
'[CENTER][FONT=times new roman]Ваша жалоба [COLOR=rgb(0, 255, 0)]одобрена[/COLOR], игрок получит своё наказание по пункту правил:[/FONT]' +
'[SPOILER="*Нажмите*"][COLOR=rgb(255, 0, 0)]2.52.[/COLOR] [FONT=courier new]Запрещено располагать аксессуары на теле персонажа, нарушая нормы морали и этики, увеличивать аксессуары до слишком большого размера. | [COLOR=rgb(255, 0, 0)]При первом нарушении - обнуление аксессуаров, при повторном нарушении - обнуление аксессуаров + JAIL 30 минут[/COLOR].[/FONT][/SPOILER]<br>' +
     '[FONT=times new roman][B]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/B][/FONT]<br>' +
'[FONT=times new roman][B]С уважением состав Кураторов Форума сервера [COLOR=rgb(0, 255, 255)]AQUA[/COLOR][/B][/FONT]<br>'+
      '[FONT=times new roman][COLOR=rgb(0, 255, 255)][ICODE]Благодарим вас за ваше обращение.[/ICODE]' +
    '[img]https://i.postimg.cc/jjSt7ZSW/H0px-Zrw4d-BTldu-AMYAYTDk-Am-Xv-I7-XIB2-M-Bj-ENl-LY908-Ecrrlr-ZFNa-P6vw-SJf-Dsmmv-Bzi-V0-Tbj-C0s3bg5-Jz-Io-Xw.png[/img]<br>'+
       '[CENTER][FONT=courier new][COLOR=rgb(0, 255, 0)]Одобрено,[/FONT][/COLOR] [COLOR=rgb(255, 0, 0)]закрыто[/COLOR][/CENTER]<br>',
      prefix: ACCEPT_PREFIX,
	  status: false,
},
   {
title: 'фейк ник',
content:
 '[CENTER][IMG]https://i.postimg.cc/FRfvPzcN/Ltjtv-TM-1.png[/IMG]<br>' +
     '[CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman][ICODE]Доброго времени суток, уважаемый(-ая) {{ user.name }} [/ICODE][/FONT][/COLOR]<br>' +
'[CENTER][FONT=times new roman]Ваша жалоба [COLOR=rgb(0, 255, 0)]одобрена[/COLOR], игрок получит своё наказание по пункту правил:[/FONT]' +
'[SPOILER="*Нажмите*"][COLOR=rgb(255, 0, 0)]4.10.[/COLOR] [FONT=courier new]Запрещено создавать никнейм, повторяющий или похожий на существующие никнеймы игроков или администраторов по их написанию. | [COLOR=rgb(255, 0, 0)]Устное замечание + смена игрового никнейма / PermBan[/COLOR].[/FONT][/SPOILER]<br>' +
     '[FONT=times new roman][B]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/B][/FONT]<br>' +
'[FONT=times new roman][B]С уважением состав Кураторов Форума сервера [COLOR=rgb(0, 255, 255)]AQUA[/COLOR][/B][/FONT]<br>'+
      '[FONT=times new roman][COLOR=rgb(0, 255, 255)][ICODE]Благодарим вас за ваше обращение.[/ICODE]' +
    '[img]https://i.postimg.cc/jjSt7ZSW/H0px-Zrw4d-BTldu-AMYAYTDk-Am-Xv-I7-XIB2-M-Bj-ENl-LY908-Ecrrlr-ZFNa-P6vw-SJf-Dsmmv-Bzi-V0-Tbj-C0s3bg5-Jz-Io-Xw.png[/img]<br>'+
       '[CENTER][FONT=courier new][COLOR=rgb(0, 255, 0)]Одобрено,[/FONT][/COLOR] [COLOR=rgb(255, 0, 0)]закрыто[/COLOR][/CENTER]<br>',
      prefix: ACCEPT_PREFIX,
	  status: false,
},
    {
title: 'оск ник',
content:
 '[CENTER][IMG]https://i.postimg.cc/FRfvPzcN/Ltjtv-TM-1.png[/IMG]<br>' +
     '[CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman][ICODE]Доброго времени суток, уважаемый(-ая) {{ user.name }} [/ICODE][/FONT][/COLOR]<br>' +
'[CENTER][FONT=times new roman]Ваша жалоба [COLOR=rgb(0, 255, 0)]одобрена[/COLOR], игрок получит своё наказание по пункту правил:[/FONT]' +
'[SPOILER="*Нажмите*"][COLOR=rgb(255, 0, 0)]4.09.[/COLOR] [FONT=courier new]Запрещено использовать никнейм, содержащий в себе матерные слова или оскорбления (в том числе, завуалированные). | [COLOR=rgb(255, 0, 0)]Устное замечание + смена игрового никнейма / PermBan[/COLOR].[/FONT][/SPOILER]<br>' +
     '[FONT=times new roman][B]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/B][/FONT]<br>' +
'[FONT=times new roman][B]С уважением состав Кураторов Форума сервера [COLOR=rgb(0, 255, 255)]AQUA[/COLOR][/B][/FONT]<br>'+
      '[FONT=times new roman][COLOR=rgb(0, 255, 255)][ICODE]Благодарим вас за ваше обращение.[/ICODE]' +
    '[img]https://i.postimg.cc/jjSt7ZSW/H0px-Zrw4d-BTldu-AMYAYTDk-Am-Xv-I7-XIB2-M-Bj-ENl-LY908-Ecrrlr-ZFNa-P6vw-SJf-Dsmmv-Bzi-V0-Tbj-C0s3bg5-Jz-Io-Xw.png[/img]<br>'+
       '[CENTER][FONT=courier new][COLOR=rgb(0, 255, 0)]Одобрено,[/FONT][/COLOR] [COLOR=rgb(255, 0, 0)]закрыто[/COLOR][/CENTER]<br>',
      prefix: ACCEPT_PREFIX,
	  status: false,
},
  {
      title: '――――――――――――――――――――――――Отказано――――――――――――――――――――――――',
	},
   {
title: 'нет условий сделки',
content:
 '[CENTER][IMG]https://i.postimg.cc/FRfvPzcN/Ltjtv-TM-1.png[/IMG]<br>' +
     '[CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman][ICODE]Доброго времени суток, уважаемый(-ая) {{ user.name }} [/ICODE][/FONT][/COLOR]<br>' +
'[CENTER][FONT=times new roman]Ваша жалоба [COLOR=rgb(255, 0, 0)]отказана[/COLOR], причиной на это стало:[/FONT]' +
'[SPOILER="*Нажмите*"][FONT=courier new][B]На вашей видеофиксации отсутствуют условия сделки.[/B][/FONT][/SPOILER]<br>' +
     '[FONT=times new roman][B]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/B][/FONT]<br>' +
'[FONT=times new roman][B]С уважением состав Кураторов Форума сервера [COLOR=rgb(0, 255, 255)]AQUA[/COLOR][/B][/FONT]<br>'+
       '[FONT=times new roman][COLOR=rgb(0, 255, 255)][ICODE]Благодарим вас за вашу бдительность.[/ICODE]' +
    '[img]https://i.postimg.cc/jjSt7ZSW/H0px-Zrw4d-BTldu-AMYAYTDk-Am-Xv-I7-XIB2-M-Bj-ENl-LY908-Ecrrlr-ZFNa-P6vw-SJf-Dsmmv-Bzi-V0-Tbj-C0s3bg5-Jz-Io-Xw.png[/img]<br>'+
       '[CENTER][FONT=courier new][COLOR=rgb(255, 0, 0)]Отказано,[/FONT][/COLOR] [COLOR=rgb(255, 0, 0)]закрыто[/COLOR][/CENTER]<br>',
      prefix: UNACCEPT_PREFIX,
	  status: false,
},
  {
title: 'недостаточо док-в',
content:
 '[CENTER][IMG]https://i.postimg.cc/FRfvPzcN/Ltjtv-TM-1.png[/IMG]<br>' +
     '[CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman][ICODE]Доброго времени суток, уважаемый(-ая) {{ user.name }} [/ICODE][/FONT][/COLOR]<br>' +
'[CENTER][FONT=times new roman]Ваша жалоба [COLOR=rgb(255, 0, 0)]отказана[/COLOR], причиной на это стало:[/FONT]' +
'[SPOILER="*Нажмите*"][FONT=courier new][B]Недостаточно доказательств для корректного рассмотрения вашей жалобы.[/B][/FONT][/SPOILER]<br>' +
     '[FONT=times new roman][B]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/B][/FONT]<br>' +
'[FONT=times new roman][B]С уважением состав Кураторов Форума сервера [COLOR=rgb(0, 255, 255)]AQUA[/COLOR][/B][/FONT]<br>'+
       '[FONT=times new roman][COLOR=rgb(0, 255, 255)][ICODE]Благодарим вас за вашу бдительность.[/ICODE]' +
    '[img]https://i.postimg.cc/jjSt7ZSW/H0px-Zrw4d-BTldu-AMYAYTDk-Am-Xv-I7-XIB2-M-Bj-ENl-LY908-Ecrrlr-ZFNa-P6vw-SJf-Dsmmv-Bzi-V0-Tbj-C0s3bg5-Jz-Io-Xw.png[/img]<br>'+
       '[CENTER][FONT=courier new][COLOR=rgb(255, 0, 0)]Отказано,[/FONT][/COLOR] [COLOR=rgb(255, 0, 0)]закрыто[/COLOR][/CENTER]<br>',
      prefix: UNACCEPT_PREFIX,
	  status: false,
},
  {
title: 'не работают доки',
content:
 '[CENTER][IMG]https://i.postimg.cc/FRfvPzcN/Ltjtv-TM-1.png[/IMG]<br>' +
     '[CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman][ICODE]Доброго времени суток, уважаемый(-ая) {{ user.name }} [/ICODE][/FONT][/COLOR]<br>' +
'[CENTER][FONT=times new roman]Ваша жалоба [COLOR=rgb(255, 0, 0)]отказана[/COLOR], причиной на это стало:[/FONT]' +
'[SPOILER="*Нажмите*"][FONT=courier new][B]Доказательства недоступны к просмотру - следовательно, рассмотрению ваша жалоба не подлежит.[/B][/FONT][/SPOILER]<br>' +
     '[FONT=times new roman][B]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/B][/FONT]<br>' +
'[FONT=times new roman][B]С уважением состав Кураторов Форума сервера [COLOR=rgb(0, 255, 255)]AQUA[/COLOR][/B][/FONT]<br>'+
       '[FONT=times new roman][COLOR=rgb(0, 255, 255)][ICODE]Благодарим вас за вашу бдительность.[/ICODE]' +
    '[img]https://i.postimg.cc/jjSt7ZSW/H0px-Zrw4d-BTldu-AMYAYTDk-Am-Xv-I7-XIB2-M-Bj-ENl-LY908-Ecrrlr-ZFNa-P6vw-SJf-Dsmmv-Bzi-V0-Tbj-C0s3bg5-Jz-Io-Xw.png[/img]<br>'+
       '[CENTER][FONT=courier new][COLOR=rgb(255, 0, 0)]Отказано,[/FONT][/COLOR] [COLOR=rgb(255, 0, 0)]закрыто[/COLOR][/CENTER]<br>',
      prefix: UNACCEPT_PREFIX,
	  status: false,
},
  {
title: 'отсутствуют доки',
content:
 '[CENTER][IMG]https://i.postimg.cc/FRfvPzcN/Ltjtv-TM-1.png[/IMG]<br>' +
     '[CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman][ICODE]Доброго времени суток, уважаемый(-ая) {{ user.name }} [/ICODE][/FONT][/COLOR]<br>' +
'[CENTER][FONT=times new roman]Ваша жалоба [COLOR=rgb(255, 0, 0)]отказана[/COLOR], причиной на это стало:[/FONT]' +
'[SPOILER="*Нажмите*"][FONT=courier new][B]Отсутствуют доказательства - следовательно, рассмотрению не подлежит. Загрузите доказательства на фото-видео хостинги YouTube, Imgur, Yapx и так далее.[/B][/FONT][/SPOILER]<br>' +
     '[FONT=times new roman][B]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/B][/FONT]<br>' +
'[FONT=times new roman][B]С уважением состав Кураторов Форума сервера [COLOR=rgb(0, 255, 255)]AQUA[/COLOR][/B][/FONT]<br>'+
       '[FONT=times new roman][COLOR=rgb(0, 255, 255)][ICODE]Благодарим вас за вашу бдительность.[/ICODE]' +
    '[img]https://i.postimg.cc/jjSt7ZSW/H0px-Zrw4d-BTldu-AMYAYTDk-Am-Xv-I7-XIB2-M-Bj-ENl-LY908-Ecrrlr-ZFNa-P6vw-SJf-Dsmmv-Bzi-V0-Tbj-C0s3bg5-Jz-Io-Xw.png[/img]<br>'+
       '[CENTER][FONT=courier new][COLOR=rgb(255, 0, 0)]Отказано,[/FONT][/COLOR] [COLOR=rgb(255, 0, 0)]закрыто[/COLOR][/CENTER]<br>',
      prefix: UNACCEPT_PREFIX,
	  status: false,
},
   {
title: 'док-ва в соц сетях',
content:
 '[CENTER][IMG]https://i.postimg.cc/FRfvPzcN/Ltjtv-TM-1.png[/IMG]<br>' +
     '[CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman][ICODE]Доброго времени суток, уважаемый(-ая) {{ user.name }} [/ICODE][/FONT][/COLOR]<br>' +
'[CENTER][FONT=times new roman]Ваша жалоба [COLOR=rgb(255, 0, 0)]отказана[/COLOR], причиной на это стало:[/FONT]' +
'[SPOILER="*Нажмите*"][FONT=courier new][B]Доказательства в социальных сетях и т.д. не принимаются. Загрузите доказательства на фото-видео хостинги YouTube,Imgur, Yapx и так далее.[/B][/FONT][/SPOILER]<br>' +
     '[FONT=times new roman][B]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/B][/FONT]<br>' +
'[FONT=times new roman][B]С уважением состав Кураторов Форума сервера [COLOR=rgb(0, 255, 255)]AQUA[/COLOR][/B][/FONT]<br>'+
       '[FONT=times new roman][COLOR=rgb(0, 255, 255)][ICODE]Благодарим вас за вашу бдительность.[/ICODE]' +
    '[img]https://i.postimg.cc/jjSt7ZSW/H0px-Zrw4d-BTldu-AMYAYTDk-Am-Xv-I7-XIB2-M-Bj-ENl-LY908-Ecrrlr-ZFNa-P6vw-SJf-Dsmmv-Bzi-V0-Tbj-C0s3bg5-Jz-Io-Xw.png[/img]<br>'+
       '[CENTER][FONT=courier new][COLOR=rgb(255, 0, 0)]Отказано,[/FONT][/COLOR] [COLOR=rgb(255, 0, 0)]закрыто[/COLOR][/CENTER]<br>',
      prefix: UNACCEPT_PREFIX,
	  status: false,
},
   {
title: 'нет нарушений',
content:
 '[CENTER][IMG]https://i.postimg.cc/FRfvPzcN/Ltjtv-TM-1.png[/IMG]<br>' +
     '[CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman][ICODE]Доброго времени суток, уважаемый(-ая) {{ user.name }} [/ICODE][/FONT][/COLOR]<br>' +
'[CENTER][FONT=times new roman]Ваша жалоба [COLOR=rgb(255, 0, 0)]отказана[/COLOR], причиной на это стало:[/FONT]' +
'[SPOILER="*Нажмите*"][FONT=courier new][B]После проверки представленных представленных вами доказательств - нарушений со стороны игрока выявлено не было.[/B][/FONT][/SPOILER]<br>' +
     '[FONT=times new roman][B]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/B][/FONT]<br>' +
'[FONT=times new roman][B]С уважением состав Кураторов Форума сервера [COLOR=rgb(0, 255, 255)]AQUA[/COLOR][/B][/FONT]<br>'+
       '[FONT=times new roman][COLOR=rgb(0, 255, 255)][ICODE]Благодарим вас за вашу бдительность.[/ICODE]' +
    '[img]https://i.postimg.cc/jjSt7ZSW/H0px-Zrw4d-BTldu-AMYAYTDk-Am-Xv-I7-XIB2-M-Bj-ENl-LY908-Ecrrlr-ZFNa-P6vw-SJf-Dsmmv-Bzi-V0-Tbj-C0s3bg5-Jz-Io-Xw.png[/img]<br>'+
       '[CENTER][FONT=courier new][COLOR=rgb(255, 0, 0)]Отказано,[/FONT][/COLOR] [COLOR=rgb(255, 0, 0)]закрыто[/COLOR][/CENTER]<br>',
      prefix: UNACCEPT_PREFIX,
	  status: false,
},
   {
title: 'нет time',
content:
 '[CENTER][IMG]https://i.postimg.cc/FRfvPzcN/Ltjtv-TM-1.png[/IMG]<br>' +
     '[CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman][ICODE]Доброго времени суток, уважаемый(-ая) {{ user.name }} [/ICODE][/FONT][/COLOR]<br>' +
'[CENTER][FONT=times new roman]Ваша жалоба [COLOR=rgb(255, 0, 0)]отказана[/COLOR], причиной на это стало:[/FONT]' +
'[SPOILER="*Нажмите*"][FONT=courier new][B]На ваших доказательствах отсутствует /time.[/B][/FONT][/SPOILER]<br>' +
     '[FONT=times new roman][B]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/B][/FONT]<br>' +
'[FONT=times new roman][B]С уважением состав Кураторов Форума сервера [COLOR=rgb(0, 255, 255)]AQUA[/COLOR][/B][/FONT]<br>'+
       '[FONT=times new roman][COLOR=rgb(0, 255, 255)][ICODE]Благодарим вас за вашу бдительность.[/ICODE]' +
    '[img]https://i.postimg.cc/jjSt7ZSW/H0px-Zrw4d-BTldu-AMYAYTDk-Am-Xv-I7-XIB2-M-Bj-ENl-LY908-Ecrrlr-ZFNa-P6vw-SJf-Dsmmv-Bzi-V0-Tbj-C0s3bg5-Jz-Io-Xw.png[/img]<br>'+
       '[CENTER][FONT=courier new][COLOR=rgb(255, 0, 0)]Отказано,[/FONT][/COLOR] [COLOR=rgb(255, 0, 0)]закрыто[/COLOR][/CENTER]<br>',
      prefix: UNACCEPT_PREFIX,
	  status: false,
},
  {
title: 'док-ва отредакт',
content:
 '[CENTER][IMG]https://i.postimg.cc/FRfvPzcN/Ltjtv-TM-1.png[/IMG]<br>' +
     '[CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman][ICODE]Доброго времени суток, уважаемый(-ая) {{ user.name }} [/ICODE][/FONT][/COLOR]<br>' +
'[CENTER][FONT=times new roman]Ваша жалоба [COLOR=rgb(255, 0, 0)]отказана[/COLOR], причиной на это стало:[/FONT]' +
'[SPOILER="*Нажмите*"][FONT=courier new][B]Ваши доказательства были подвергнуты редактированию - следовательно, рассмотрению не подлежит.[/B][/FONT][/SPOILER]<br>' +
     '[FONT=times new roman][B]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/B][/FONT]<br>' +
'[FONT=times new roman][B]С уважением состав Кураторов Форума сервера [COLOR=rgb(0, 255, 255)]AQUA[/COLOR][/B][/FONT]<br>'+
       '[FONT=times new roman][COLOR=rgb(0, 255, 255)][ICODE]Благодарим вас за вашу бдительность.[/ICODE]' +
    '[img]https://i.postimg.cc/jjSt7ZSW/H0px-Zrw4d-BTldu-AMYAYTDk-Am-Xv-I7-XIB2-M-Bj-ENl-LY908-Ecrrlr-ZFNa-P6vw-SJf-Dsmmv-Bzi-V0-Tbj-C0s3bg5-Jz-Io-Xw.png[/img]<br>'+
       '[CENTER][FONT=courier new][COLOR=rgb(255, 0, 0)]Отказано,[/FONT][/COLOR] [COLOR=rgb(255, 0, 0)]закрыто[/COLOR][/CENTER]<br>',
      prefix: UNACCEPT_PREFIX,
	  status: false,
},
   {
title: 'док-ва обрываются',
content:
 '[CENTER][IMG]https://i.postimg.cc/FRfvPzcN/Ltjtv-TM-1.png[/IMG]<br>' +
     '[CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman][ICODE]Доброго времени суток, уважаемый(-ая) {{ user.name }} [/ICODE][/FONT][/COLOR]<br>' +
'[CENTER][FONT=times new roman]Ваша жалоба [COLOR=rgb(255, 0, 0)]отказана[/COLOR], причиной на это стало:[/FONT]' +
'[SPOILER="*Нажмите*"][FONT=courier new][B]Ваша видеозапись обрывается. Загрузите полную видеозапись на видео-хостинг YouTube.[/B][/FONT][/SPOILER]<br>' +
     '[FONT=times new roman][B]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/B][/FONT]<br>' +
'[FONT=times new roman][B]С уважением состав Кураторов Форума сервера [COLOR=rgb(0, 255, 255)]AQUA[/COLOR][/B][/FONT]<br>'+
       '[FONT=times new roman][COLOR=rgb(0, 255, 255)][ICODE]Благодарим вас за вашу бдительность.[/ICODE]' +
    '[img]https://i.postimg.cc/jjSt7ZSW/H0px-Zrw4d-BTldu-AMYAYTDk-Am-Xv-I7-XIB2-M-Bj-ENl-LY908-Ecrrlr-ZFNa-P6vw-SJf-Dsmmv-Bzi-V0-Tbj-C0s3bg5-Jz-Io-Xw.png[/img]<br>'+
       '[CENTER][FONT=courier new][COLOR=rgb(255, 0, 0)]Отказано,[/FONT][/COLOR] [COLOR=rgb(255, 0, 0)]закрыто[/COLOR][/CENTER]<br>',
      prefix: UNACCEPT_PREFIX,
	  status: false,
},
   {
title: 'нет таймкодов',
content:
 '[CENTER][IMG]https://i.postimg.cc/FRfvPzcN/Ltjtv-TM-1.png[/IMG]<br>' +
     '[CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman][ICODE]Доброго времени суток, уважаемый(-ая) {{ user.name }} [/ICODE][/FONT][/COLOR]<br>' +
'[CENTER][FONT=times new roman]Ваша жалоба [COLOR=rgb(255, 0, 0)]отказана[/COLOR], причиной на это стало:[/FONT]' +
'[SPOILER="*Нажмите*"][FONT=courier new][B]Ваша жалоба отказана, т.к в ней нету таймкодов. Если видео длится больше 3-ех минут - Вы должны указать таймкоды нарушений.[/B][/FONT][/SPOILER]<br>' +
     '[FONT=times new roman][B]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/B][/FONT]<br>' +
'[FONT=times new roman][B]С уважением состав Кураторов Форума сервера [COLOR=rgb(0, 255, 255)]AQUA[/COLOR][/B][/FONT]<br>'+
       '[FONT=times new roman][COLOR=rgb(0, 255, 255)][ICODE]Благодарим вас за вашу бдительность.[/ICODE]' +
    '[img]https://i.postimg.cc/jjSt7ZSW/H0px-Zrw4d-BTldu-AMYAYTDk-Am-Xv-I7-XIB2-M-Bj-ENl-LY908-Ecrrlr-ZFNa-P6vw-SJf-Dsmmv-Bzi-V0-Tbj-C0s3bg5-Jz-Io-Xw.png[/img]<br>'+
       '[CENTER][FONT=courier new][COLOR=rgb(255, 0, 0)]Отказано,[/FONT][/COLOR] [COLOR=rgb(255, 0, 0)]закрыто[/COLOR][/CENTER]<br>',
      prefix: UNACCEPT_PREFIX,
	  status: false,
},
  {
title: 'прошло 72 часа',
content:
 '[CENTER][IMG]https://i.postimg.cc/FRfvPzcN/Ltjtv-TM-1.png[/IMG]<br>' +
     '[CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman][ICODE]Доброго времени суток, уважаемый(-ая) {{ user.name }} [/ICODE][/FONT][/COLOR]<br>' +
'[CENTER][FONT=times new roman]Ваша жалоба [COLOR=rgb(255, 0, 0)]отказана[/COLOR], причиной на это стало:[/FONT]' +
'[SPOILER="*Нажмите*"][FONT=courier new][B]Ваша жалоба отказана, т.к с момента нарушения прошло более 72-ух часов.[/B][/FONT][/SPOILER]<br>' +
     '[FONT=times new roman][B]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/B][/FONT]<br>' +
'[FONT=times new roman][B]С уважением состав Кураторов Форума сервера [COLOR=rgb(0, 255, 255)]AQUA[/COLOR][/B][/FONT]<br>'+
       '[FONT=times new roman][COLOR=rgb(0, 255, 255)][ICODE]Благодарим вас за вашу бдительность.[/ICODE]' +
    '[img]https://i.postimg.cc/jjSt7ZSW/H0px-Zrw4d-BTldu-AMYAYTDk-Am-Xv-I7-XIB2-M-Bj-ENl-LY908-Ecrrlr-ZFNa-P6vw-SJf-Dsmmv-Bzi-V0-Tbj-C0s3bg5-Jz-Io-Xw.png[/img]<br>'+
       '[CENTER][FONT=courier new][COLOR=rgb(255, 0, 0)]Отказано,[/FONT][/COLOR] [COLOR=rgb(255, 0, 0)]закрыто[/COLOR][/CENTER]<br>',
      prefix: UNACCEPT_PREFIX,
	  status: false,
},
   {
title: 'от 3-его лица',
content:
 '[CENTER][IMG]https://i.postimg.cc/FRfvPzcN/Ltjtv-TM-1.png[/IMG]<br>' +
     '[CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman][ICODE]Доброго времени суток, уважаемый(-ая) {{ user.name }} [/ICODE][/FONT][/COLOR]<br>' +
'[CENTER][FONT=times new roman]Ваша жалоба [COLOR=rgb(255, 0, 0)]отказана[/COLOR], причиной на это стало:[/FONT]' +
'[SPOILER="*Нажмите*"][FONT=courier new][B]Ваша жалоба отказана, так как она написана от 3-его лица.[/B][/FONT][/SPOILER]<br>' +
     '[FONT=times new roman][B]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/B][/FONT]<br>' +
'[FONT=times new roman][B]С уважением состав Кураторов Форума сервера [COLOR=rgb(0, 255, 255)]AQUA[/COLOR][/B][/FONT]<br>'+
       '[FONT=times new roman][COLOR=rgb(0, 255, 255)][ICODE]Благодарим вас за вашу бдительность.[/ICODE]' +
    '[img]https://i.postimg.cc/jjSt7ZSW/H0px-Zrw4d-BTldu-AMYAYTDk-Am-Xv-I7-XIB2-M-Bj-ENl-LY908-Ecrrlr-ZFNa-P6vw-SJf-Dsmmv-Bzi-V0-Tbj-C0s3bg5-Jz-Io-Xw.png[/img]<br>'+
       '[CENTER][FONT=courier new][COLOR=rgb(255, 0, 0)]Отказано,[/FONT][/COLOR] [COLOR=rgb(255, 0, 0)]закрыто[/COLOR][/CENTER]<br>',
      prefix: UNACCEPT_PREFIX,
	  status: false,
},
    {
title: 'Уже был ответ',
content:
 '[CENTER][IMG]https://i.postimg.cc/FRfvPzcN/Ltjtv-TM-1.png[/IMG]<br>' +
     '[CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman][ICODE]Доброго времени суток, уважаемый(-ая) {{ user.name }} [/ICODE][/FONT][/COLOR]<br>' +
'[CENTER][FONT=times new roman]Ваша жалоба [COLOR=rgb(255, 0, 0)]отказана[/COLOR], причиной на это стало:[/FONT]' +
'[SPOILER="*Нажмите*"][FONT=courier new][B]Ваша жалоба отказана, так как ответ вам уже был ранее.[/B][/FONT][/SPOILER]<br>' +
     '[FONT=times new roman][B]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/B][/FONT]<br>' +
'[FONT=times new roman][B]С уважением состав Кураторов Форума сервера [COLOR=rgb(0, 255, 255)]AQUA[/COLOR][/B][/FONT]<br>'+
       '[FONT=times new roman][COLOR=rgb(0, 255, 255)][ICODE]Благодарим вас за вашу бдительность.[/ICODE]' +
    '[img]https://i.postimg.cc/jjSt7ZSW/H0px-Zrw4d-BTldu-AMYAYTDk-Am-Xv-I7-XIB2-M-Bj-ENl-LY908-Ecrrlr-ZFNa-P6vw-SJf-Dsmmv-Bzi-V0-Tbj-C0s3bg5-Jz-Io-Xw.png[/img]<br>'+
       '[CENTER][FONT=courier new][COLOR=rgb(255, 0, 0)]Отказано,[/FONT][/COLOR] [COLOR=rgb(255, 0, 0)]закрыто[/COLOR][/CENTER]<br>',
      prefix: UNACCEPT_PREFIX,
	  status: false,
},
  {
title: 'Уже был наказан',
content:
 '[CENTER][IMG]https://i.postimg.cc/FRfvPzcN/Ltjtv-TM-1.png[/IMG]<br>' +
     '[CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman][ICODE]Доброго времени суток, уважаемый(-ая) {{ user.name }} [/ICODE][/FONT][/COLOR]<br>' +
'[CENTER][FONT=times new roman]Ваша жалоба [COLOR=rgb(255, 0, 0)]отказана[/COLOR], причиной на это стало:[/FONT]' +
'[SPOILER="*Нажмите*"][FONT=courier new][B]Ваша жалоба отказана, так как игрок уже был наказан ранее.[/B][/FONT][/SPOILER]<br>' +
     '[FONT=times new roman][B]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/B][/FONT]<br>' +
'[FONT=times new roman][B]С уважением состав Кураторов Форума сервера [COLOR=rgb(0, 255, 255)]AQUA[/COLOR][/B][/FONT]<br>'+
       '[FONT=times new roman][COLOR=rgb(0, 255, 255)][ICODE]Благодарим вас за вашу бдительность.[/ICODE]' +
    '[img]https://i.postimg.cc/jjSt7ZSW/H0px-Zrw4d-BTldu-AMYAYTDk-Am-Xv-I7-XIB2-M-Bj-ENl-LY908-Ecrrlr-ZFNa-P6vw-SJf-Dsmmv-Bzi-V0-Tbj-C0s3bg5-Jz-Io-Xw.png[/img]<br>'+
       '[CENTER][FONT=courier new][COLOR=rgb(255, 0, 0)]Отказано,[/FONT][/COLOR] [COLOR=rgb(255, 0, 0)]закрыто[/COLOR][/CENTER]<br>',
      prefix: UNACCEPT_PREFIX,
	  status: false,
},
  {
title: 'не по форме',
content:
 '[CENTER][IMG]https://i.postimg.cc/FRfvPzcN/Ltjtv-TM-1.png[/IMG]<br>' +
     '[CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman][ICODE]Доброго времени суток, уважаемый(-ая) {{ user.name }} [/ICODE][/FONT][/COLOR]<br>' +
'[CENTER][FONT=times new roman]Ваша жалоба [COLOR=rgb(255, 0, 0)]отказана[/COLOR], причиной на это стало:[/FONT]' +
'[SPOILER="*Нажмите*"][FONT=courier new][B]Ваша жалоба составлена не по форме. Внимательно прочитайте правила подачи жалоб на игроков, закрепленные в этом разделе.[/B][/FONT][/SPOILER]<br>' +
     '[FONT=times new roman][B]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/B][/FONT]<br>' +
'[FONT=times new roman][B]С уважением состав Кураторов Форума сервера [COLOR=rgb(0, 255, 255)]AQUA[/COLOR][/B][/FONT]<br>'+
       '[FONT=times new roman][COLOR=rgb(0, 255, 255)][ICODE]Благодарим вас за вашу бдительность.[/ICODE]' +
    '[img]https://i.postimg.cc/jjSt7ZSW/H0px-Zrw4d-BTldu-AMYAYTDk-Am-Xv-I7-XIB2-M-Bj-ENl-LY908-Ecrrlr-ZFNa-P6vw-SJf-Dsmmv-Bzi-V0-Tbj-C0s3bg5-Jz-Io-Xw.png[/img]<br>'+
       '[CENTER][FONT=courier new][COLOR=rgb(255, 0, 0)]Отказано,[/FONT][/COLOR] [COLOR=rgb(255, 0, 0)]закрыто[/COLOR][/CENTER]<br>',
      prefix: UNACCEPT_PREFIX,
	  status: false,
},
    {
title: 'доки не работают',
content:
 '[CENTER][IMG]https://i.postimg.cc/FRfvPzcN/Ltjtv-TM-1.png[/IMG]<br>' +
     '[CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman][ICODE]Доброго времени суток, уважаемый(-ая) {{ user.name }} [/ICODE][/FONT][/COLOR]<br>' +
'[CENTER][FONT=times new roman]Ваша жалоба [COLOR=rgb(255, 0, 0)]отказана[/COLOR], причиной на это стало:[/FONT]' +
'[SPOILER="*Нажмите*"][FONT=courier new][B]Ваши доказательства не доступны к просмотру. Загрузите доказательства на фото-видео хостинги YouTube,Imgur, Yapx и так далее.[/B][/FONT][/SPOILER]<br>' +
     '[FONT=times new roman][B]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/B][/FONT]<br>' +
'[FONT=times new roman][B]С уважением состав Кураторов Форума сервера [COLOR=rgb(0, 255, 255)]AQUA[/COLOR][/B][/FONT]<br>'+
       '[FONT=times new roman][COLOR=rgb(0, 255, 255)][ICODE]Благодарим вас за вашу бдительность.[/ICODE]' +
    '[img]https://i.postimg.cc/jjSt7ZSW/H0px-Zrw4d-BTldu-AMYAYTDk-Am-Xv-I7-XIB2-M-Bj-ENl-LY908-Ecrrlr-ZFNa-P6vw-SJf-Dsmmv-Bzi-V0-Tbj-C0s3bg5-Jz-Io-Xw.png[/img]<br>'+
       '[CENTER][FONT=courier new][COLOR=rgb(255, 0, 0)]Отказано,[/FONT][/COLOR] [COLOR=rgb(255, 0, 0)]закрыто[/COLOR][/CENTER]<br>',
      prefix: UNACCEPT_PREFIX,
	  status: false,
},
   {
title: 'нужен фрапс',
content:
 '[CENTER][IMG]https://i.postimg.cc/FRfvPzcN/Ltjtv-TM-1.png[/IMG]<br>' +
     '[CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman][ICODE]Доброго времени суток, уважаемый(-ая) {{ user.name }} [/ICODE][/FONT][/COLOR]<br>' +
'[CENTER][FONT=times new roman]Ваша жалоба [COLOR=rgb(255, 0, 0)]отказана[/COLOR], причиной на это стало:[/FONT]' +
'[SPOILER="*Нажмите*"][FONT=courier new][B]Для рассмотрения вашей жалобы нужно прикрепить видео-доказательство.[/B][/FONT][/SPOILER]<br>' +
     '[FONT=times new roman][B]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/B][/FONT]<br>' +
'[FONT=times new roman][B]С уважением состав Кураторов Форума сервера [COLOR=rgb(0, 255, 255)]AQUA[/COLOR][/B][/FONT]<br>'+
       '[FONT=times new roman][COLOR=rgb(0, 255, 255)][ICODE]Благодарим вас за вашу бдительность.[/ICODE]' +
    '[img]https://i.postimg.cc/jjSt7ZSW/H0px-Zrw4d-BTldu-AMYAYTDk-Am-Xv-I7-XIB2-M-Bj-ENl-LY908-Ecrrlr-ZFNa-P6vw-SJf-Dsmmv-Bzi-V0-Tbj-C0s3bg5-Jz-Io-Xw.png[/img]<br>'+
       '[CENTER][FONT=courier new][COLOR=rgb(255, 0, 0)]Отказано,[/FONT][/COLOR] [COLOR=rgb(255, 0, 0)]закрыто[/COLOR][/CENTER]<br>',
      prefix: UNACCEPT_PREFIX,
	  status: false,
},
  {
title: 'в жб на сотрудников',
content:
 '[CENTER][IMG]https://i.postimg.cc/FRfvPzcN/Ltjtv-TM-1.png[/IMG]<br>' +
     '[CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman][ICODE]Доброго времени суток, уважаемый(-ая) {{ user.name }} [/ICODE][/FONT][/COLOR]<br>' +
'[CENTER][FONT=times new roman]Ваша жалоба [COLOR=rgb(255, 0, 0)]отказана[/COLOR], причиной на это стало:[/FONT]' +
'[SPOILER="*Нажмите*"][FONT=courier new][B]Напишите вашу жалобу в раздел "Жалобы на сотрудников".[/B][/FONT][/SPOILER]<br>' +
     '[FONT=times new roman][B]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/B][/FONT]<br>' +
'[FONT=times new roman][B]С уважением состав Кураторов Форума сервера [COLOR=rgb(0, 255, 255)]AQUA[/COLOR][/B][/FONT]<br>'+
       '[FONT=times new roman][COLOR=rgb(0, 255, 255)][ICODE]Благодарим вас за вашу бдительность.[/ICODE]' +
    '[img]https://i.postimg.cc/jjSt7ZSW/H0px-Zrw4d-BTldu-AMYAYTDk-Am-Xv-I7-XIB2-M-Bj-ENl-LY908-Ecrrlr-ZFNa-P6vw-SJf-Dsmmv-Bzi-V0-Tbj-C0s3bg5-Jz-Io-Xw.png[/img]<br>'+
       '[CENTER][FONT=courier new][COLOR=rgb(255, 0, 0)]Отказано,[/FONT][/COLOR] [COLOR=rgb(255, 0, 0)]закрыто[/COLOR][/CENTER]<br>',
      prefix: UNACCEPT_PREFIX,
	  status: false,
},
   {
title: 'плохое качество',
content:
 '[CENTER][IMG]https://i.postimg.cc/FRfvPzcN/Ltjtv-TM-1.png[/IMG]<br>' +
     '[CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman][ICODE]Доброго времени суток, уважаемый(-ая) {{ user.name }} [/ICODE][/FONT][/COLOR]<br>' +
'[CENTER][FONT=times new roman]Ваша жалоба [COLOR=rgb(255, 0, 0)]отказана[/COLOR], причиной на это стало:[/FONT]' +
'[SPOILER="*Нажмите*"][FONT=courier new][B]Ваши доказательства в плохом качестве - загрузите на другой хостинг.[/B][/FONT][/SPOILER]<br>' +
     '[FONT=times new roman][B]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/B][/FONT]<br>' +
'[FONT=times new roman][B]С уважением состав Кураторов Форума сервера [COLOR=rgb(0, 255, 255)]AQUA[/COLOR][/B][/FONT]<br>'+
       '[FONT=times new roman][COLOR=rgb(0, 255, 255)][ICODE]Благодарим вас за вашу бдительность.[/ICODE]' +
    '[img]https://i.postimg.cc/jjSt7ZSW/H0px-Zrw4d-BTldu-AMYAYTDk-Am-Xv-I7-XIB2-M-Bj-ENl-LY908-Ecrrlr-ZFNa-P6vw-SJf-Dsmmv-Bzi-V0-Tbj-C0s3bg5-Jz-Io-Xw.png[/img]<br>'+
       '[CENTER][FONT=courier new][COLOR=rgb(255, 0, 0)]Отказано,[/FONT][/COLOR] [COLOR=rgb(255, 0, 0)]закрыто[/COLOR][/CENTER]<br>',
      prefix: UNACCEPT_PREFIX,
	  status: false,
},
   {
title: 'ник не совпадает',
content:
 '[CENTER][IMG]https://i.postimg.cc/FRfvPzcN/Ltjtv-TM-1.png[/IMG]<br>' +
     '[CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman][ICODE]Доброго времени суток, уважаемый(-ая) {{ user.name }} [/ICODE][/FONT][/COLOR]<br>' +
'[CENTER][FONT=times new roman]Ваша жалоба [COLOR=rgb(255, 0, 0)]отказана[/COLOR], причиной на это стало:[/FONT]' +
'[SPOILER="*Нажмите*"][FONT=courier new][B]Nick_Name игрока указаный вами в жалобе не совпадает с Nick_Name игрока на доказательствах.[/B][/FONT][/SPOILER]<br>' +
     '[FONT=times new roman][B]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/B][/FONT]<br>' +
'[FONT=times new roman][B]С уважением состав Кураторов Форума сервера [COLOR=rgb(0, 255, 255)]AQUA[/COLOR][/B][/FONT]<br>'+
       '[FONT=times new roman][COLOR=rgb(0, 255, 255)][ICODE]Благодарим вас за вашу бдительность.[/ICODE]' +
    '[img]https://i.postimg.cc/jjSt7ZSW/H0px-Zrw4d-BTldu-AMYAYTDk-Am-Xv-I7-XIB2-M-Bj-ENl-LY908-Ecrrlr-ZFNa-P6vw-SJf-Dsmmv-Bzi-V0-Tbj-C0s3bg5-Jz-Io-Xw.png[/img]<br>'+
       '[CENTER][FONT=courier new][COLOR=rgb(255, 0, 0)]Отказано,[/FONT][/COLOR] [COLOR=rgb(255, 0, 0)]закрыто[/COLOR][/CENTER]<br>',
      prefix: UNACCEPT_PREFIX,
	  status: false,
},
   {
      title: '――――――――――――――――――――――――ГКФ/ЗГКФ――――――――――――――――――――――――',
	},
   {  
     title: 'osk/upom rod',
content:
 '[CENTER][IMG]https://i.postimg.cc/FRfvPzcN/Ltjtv-TM-1.png[/IMG]<br>' +
     '[CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman][ICODE]Доброго времени суток, уважаемый(-ая) {{ user.name }} [/ICODE][/FONT][/COLOR]<br>' +
'[CENTER][FONT=times new roman]Ваша жалоба [COLOR=rgb(0, 255, 0)]одобрена[/COLOR], игрок получит своё наказание по пункту правил:[/FONT]' +
     '[CENTER][B][COLOR=rgb(255, 0, 0)]Примечание:[/COLOR] термины "MQ", "rnq" расценивается, как упоминание родных.[/B]' +
     '[CENTER][B][COLOR=rgb(255, 0, 0)]Исключение:[/COLOR] если упоминание родных было совершено в ходе Role Play процесса и не содержало в себе прямого или завуалированного оскорбления.[/B][/SPOILER]<br>' +
'[SPOILER="*Нажмите*"][COLOR=rgb(255, 0, 0)]3.04.[/COLOR] [FONT=courier new]Запрещено оскорбление или косвенное упоминание родных вне зависимости от чата. | [COLOR=rgb(255, 0, 0)]Mute 120 минут / Ban 7 - 15 дней[/COLOR].[/FONT][/SPOILER]<br>' +
     '[FONT=times new roman][B]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/B][/FONT]<br>' +
'[FONT=times new roman][B]С уважением состав Кураторов Форума сервера [COLOR=rgb(0, 255, 255)]AQUA[/COLOR][/B][/FONT]<br>'+
      '[FONT=times new roman][COLOR=rgb(0, 255, 255)][ICODE]Благодарим вас за ваше обращение.[/ICODE]' +
    '[img]https://i.postimg.cc/jjSt7ZSW/H0px-Zrw4d-BTldu-AMYAYTDk-Am-Xv-I7-XIB2-M-Bj-ENl-LY908-Ecrrlr-ZFNa-P6vw-SJf-Dsmmv-Bzi-V0-Tbj-C0s3bg5-Jz-Io-Xw.png[/img]<br>'+
       '[CENTER][FONT=courier new][COLOR=rgb(0, 255, 0)]Одобрено,[/FONT][/COLOR] [COLOR=rgb(255, 0, 0)]закрыто[/COLOR][/CENTER]<br>',
      prefix: ACCEPT_PREFIX,
	  status: false,
},
   {
title: 'долг',
content:
 '[CENTER][IMG]https://i.postimg.cc/FRfvPzcN/Ltjtv-TM-1.png[/IMG]<br>' +
     '[CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman][ICODE]Доброго времени суток, уважаемый(-ая) {{ user.name }} [/ICODE][/FONT][/COLOR]<br>' +
'[CENTER][FONT=times new roman]Ваша жалоба [COLOR=rgb(0, 255, 0)]одобрена[/COLOR], игрок получит своё наказание по пункту правил:[/FONT]' +
'[SPOILER="*Нажмите*"][COLOR=rgb(255, 0, 0)]2.57.[/COLOR] [FONT=courier new]Запрещается брать в долг игровые ценности и не возвращать их. | [COLOR=rgb(255, 0, 0)]Ban 30 дней / permban[/COLOR].<br>' +
     '[CENTER][B][COLOR=rgb(255, 0, 0)]Примечание:[/COLOR] займ может быть осуществлен только через зачисление игровых ценностей на банковский счет, максимальный срок займа 30 календарных дней, если займ не был возвращен, аккаунт должника блокируется;[/B]' +
     '[CENTER][B][COLOR=rgb(255, 0, 0)]Примечание:[/COLOR] при невозврате игровых ценностей общей стоимостью менее 5 миллионов включительно аккаунт будет заблокирован на 30 дней, если более 5 миллионов, аккаунт будет заблокирован навсегда;[/B]' +
     '[CENTER][B][COLOR=rgb(255, 0, 0)]Примечание:[/COLOR] жалоба на игрока, который занял игровые ценности и не вернул в срок, подлежит рассмотрению только при наличии подтверждения суммы и условий займа в игровом процессе, меры в отношении должника могут быть приняты только при наличии жалобы и доказательств. Жалоба на должника подается в течение 10 дней после истечения срока займа. Договоры вне игры не будут считаться доказательствами.[/B][/FONT][/SPOILER]<br>' +
     '[FONT=times new roman][B]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/B][/FONT]<br>' +
'[FONT=times new roman][B]С уважением состав Кураторов Форума сервера [COLOR=rgb(0, 255, 255)]AQUA[/COLOR][/B][/FONT]<br>'+
      '[FONT=times new roman][COLOR=rgb(0, 255, 255)][ICODE]Благодарим вас за ваше обращение.[/ICODE]' +
    '[img]https://i.postimg.cc/jjSt7ZSW/H0px-Zrw4d-BTldu-AMYAYTDk-Am-Xv-I7-XIB2-M-Bj-ENl-LY908-Ecrrlr-ZFNa-P6vw-SJf-Dsmmv-Bzi-V0-Tbj-C0s3bg5-Jz-Io-Xw.png[/img]<br>'+
       '[CENTER][FONT=courier new][COLOR=rgb(0, 255, 0)]Одобрено,[/FONT][/COLOR] [COLOR=rgb(255, 0, 0)]закрыто[/COLOR][/CENTER]<br>',
      prefix: ACCEPT_PREFIX,
	  status: false,
},
   {
title: 'нет нарушений после логов',
content:
 '[CENTER][IMG]https://i.postimg.cc/FRfvPzcN/Ltjtv-TM-1.png[/IMG]<br>' +
     '[CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman][ICODE]Доброго времени суток, уважаемый(-ая) {{ user.name }} [/ICODE][/FONT][/COLOR]<br>' +
'[CENTER][FONT=times new roman]Ваша жалоба [COLOR=rgb(255, 0, 0)]отказана[/COLOR], причиной на это стало:[/FONT]' +
'[SPOILER="*Нажмите*"][FONT=courier new][B]После проверки системы логирования - нарушений со стороны игрока не было выявлено; проверьте верно ли вы указали NickName нарушителя.[/B][/FONT][/SPOILER]<br>' +
     '[FONT=times new roman][B]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/B][/FONT]<br>' +
'[FONT=times new roman][B]С уважением состав Кураторов Форума сервера [COLOR=rgb(0, 255, 255)]AQUA[/COLOR][/B][/FONT]<br>'+
    '[img]https://i.postimg.cc/jjSt7ZSW/H0px-Zrw4d-BTldu-AMYAYTDk-Am-Xv-I7-XIB2-M-Bj-ENl-LY908-Ecrrlr-ZFNa-P6vw-SJf-Dsmmv-Bzi-V0-Tbj-C0s3bg5-Jz-Io-Xw.png[/img]<br>'+
       '[CENTER][FONT=courier new][COLOR=rgb(255, 0, 0)]Отказано,[/FONT][/COLOR] [COLOR=rgb(255, 0, 0)]закрыто[/COLOR][/CENTER]<br>',
      prefix: UNACCEPT_PREFIX,
	  status: false,
},
   {
      title: '――――――――――――――――――――――――Передача――――――――――――――――――――――――',
	},
   {
title: 'на рассмотрении',
content:
 '[CENTER][IMG]https://i.postimg.cc/FRfvPzcN/Ltjtv-TM-1.png[/IMG]<br>' +
     '[CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman][ICODE]Доброго времени суток, уважаемый(-ая) {{ user.name }} [/ICODE][/FONT][/COLOR]<br>' +
'[CENTER][FONT=times new roman]Ваша жалоба взята [COLOR=rgb(255, 255, 0)]на рассмотрение[/COLOR], ожидайте ответа.[/FONT]<br>' +
'[FONT=times new roman][B]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован[/B][/FONT]<br>'+
'[FONT=times new roman][B]С уважением состав Кураторов Форума сервера [COLOR=rgb(0, 255, 255)]AQUA[/COLOR][/B][/FONT]<br>'+
       '[FONT=times new roman][COLOR=rgb(0, 255, 255)][ICODE]Благодарим вас за вашу бдительность.[/ICODE]' +
    '[img]https://i.postimg.cc/jjSt7ZSW/H0px-Zrw4d-BTldu-AMYAYTDk-Am-Xv-I7-XIB2-M-Bj-ENl-LY908-Ecrrlr-ZFNa-P6vw-SJf-Dsmmv-Bzi-V0-Tbj-C0s3bg5-Jz-Io-Xw.png[/img]<br>'+
       '[CENTER][FONT=courier new][COLOR=rgb(255, 255, 0)]На рассмотрении[/FONT][/COLOR][/CENTER]<br>',
      prefix: PIN_PREFIX,
	  status: true,
},
   {
title: 'передать гкф/згкф',
content:
 '[CENTER][IMG]https://i.postimg.cc/FRfvPzcN/Ltjtv-TM-1.png[/IMG]<br>' +
     '[CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman][ICODE]Доброго времени суток, уважаемый(-ая) {{ user.name }} [/ICODE][/FONT][/COLOR]<br>' +
'[CENTER][FONT=times new roman]Ваша жалоба переадресована [COLOR=rgb(255, 0, 0)]ГКФ/ЗГКФ[/COLOR], ожидайте ответа.[/FONT]<br>' +
'[FONT=times new roman][B]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован[/B][/FONT]<br>'+
'[FONT=times new roman][B]С уважением состав Кураторов Форума сервера [COLOR=rgb(0, 255, 255)]AQUA[/COLOR][/B][/FONT]<br>'+
       '[FONT=times new roman][COLOR=rgb(0, 255, 255)][ICODE]Благодарим вас за вашу бдительность.[/ICODE]' +
    '[img]https://i.postimg.cc/jjSt7ZSW/H0px-Zrw4d-BTldu-AMYAYTDk-Am-Xv-I7-XIB2-M-Bj-ENl-LY908-Ecrrlr-ZFNa-P6vw-SJf-Dsmmv-Bzi-V0-Tbj-C0s3bg5-Jz-Io-Xw.png[/img]<br>'+
       '[CENTER][FONT=courier new][COLOR=rgb(255, 255, 0)]На рассмотрении[/FONT][/COLOR][/CENTER]<br>',
      prefix: PIN_PREFIX,
	  status: true,
},
   {
title: 'передать теху',
content:
 '[CENTER][IMG]https://i.postimg.cc/FRfvPzcN/Ltjtv-TM-1.png[/IMG]<br>' +
     '[CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman][ICODE]Доброго времени суток, уважаемый(-ая) {{ user.name }} [/ICODE][/FONT][/COLOR]<br>' +
'[CENTER][FONT=times new roman]Ваша жалоба переадресована [COLOR=rgb(255,165,0)]техническому специалисту[/COLOR], ожидайте ответа.[/FONT]<br>' +
'[FONT=times new roman][B]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован[/B][/FONT]<br>'+
'[FONT=times new roman][B]С уважением состав Кураторов Форума сервера [COLOR=rgb(0, 255, 255)]AQUA[/COLOR][/B][/FONT]<br>'+
       '[FONT=times new roman][COLOR=rgb(0, 255, 255)][ICODE]Благодарим вас за вашу бдительность.[/ICODE]' +
    '[img]https://i.postimg.cc/jjSt7ZSW/H0px-Zrw4d-BTldu-AMYAYTDk-Am-Xv-I7-XIB2-M-Bj-ENl-LY908-Ecrrlr-ZFNa-P6vw-SJf-Dsmmv-Bzi-V0-Tbj-C0s3bg5-Jz-Io-Xw.png[/img]<br>'+
       '[CENTER][FONT=courier new][COLOR=rgb(255, 255, 0)]На рассмотрении[/FONT][/COLOR][/CENTER]<br>',
      prefix: TEX_PREFIX,
	  status: true,
},
   {
title: 'передать ГА/ЗГА',
content:
 '[CENTER][IMG]https://i.postimg.cc/FRfvPzcN/Ltjtv-TM-1.png[/IMG]<br>' +
     '[CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman][ICODE]Доброго времени суток, уважаемый(-ая) {{ user.name }} [/ICODE][/FONT][/COLOR]<br>' +
'[CENTER][FONT=times new roman]Ваша жалоба переадресована [COLOR=rgb(255, 0, 0)]ГА/ЗГА[/COLOR], ожидайте ответа.[/FONT]<br>' +
'[FONT=times new roman][B]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован[/B][/FONT]<br>'+
'[FONT=times new roman][B]С уважением состав Кураторов Форума сервера [COLOR=rgb(0, 255, 255)]AQUA[/COLOR][/B][/FONT]<br>'+
       '[FONT=times new roman][COLOR=rgb(0, 255, 255)][ICODE]Благодарим вас за вашу бдительность.[/ICODE]' +
    '[img]https://i.postimg.cc/jjSt7ZSW/H0px-Zrw4d-BTldu-AMYAYTDk-Am-Xv-I7-XIB2-M-Bj-ENl-LY908-Ecrrlr-ZFNa-P6vw-SJf-Dsmmv-Bzi-V0-Tbj-C0s3bg5-Jz-Io-Xw.png[/img]<br>'+
       '[CENTER][FONT=courier new][COLOR=rgb(255, 255, 0)]На рассмотрении[/FONT][/COLOR][/CENTER]<br>',
      prefix: GA_PREFIX,
	  status: true,
},
     {
      title: '――――――――――――――――――――――РП БИОГРАФИИ――――――――――――――――――――――',
	},
 {
title: 'одобрено',
content:
 '[CENTER][IMG]https://i.postimg.cc/FRfvPzcN/Ltjtv-TM-1.png[/IMG]<br>' +
     '[CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman][ICODE]Доброго времени суток, уважаемый(-ая) {{ user.name }} [/ICODE][/FONT][/COLOR]<br>' +
'[CENTER][FONT=times new roman]Ваша Role Play Биография получает статус - [COLOR=rgb(0, 255, 0)]одобрено[/COLOR].[/FONT]<br>' +
     '[FONT=times new roman][B]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/B][/FONT]<br>' +
'[FONT=times new roman][B]С уважением состав Кураторов Форума сервера [COLOR=rgb(0, 255, 255)]AQUA[/COLOR][/B][/FONT]<br>'+
       '[CENTER][FONT=times new roman][COLOR=rgb(0, 255, 0)]Одобрено,[/COLOR] [COLOR=rgb(255, 0, 0)]закрыто[/COLOR][/FONT][/CENTER]<br>',
      prefix: ACCEPT_PREFIX,
	  status: false,
},
   {
     title: '――――――――――――――――――――――――ОТКАЗ (РП БИО)――――――――――――――――――――――',
 	},
 {    
title: 'отказано (универсал,юзать в искл. случаях)',
content:
 '[CENTER][IMG]https://i.postimg.cc/FRfvPzcN/Ltjtv-TM-1.png[/IMG]<br>' +
     '[CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman][ICODE]Доброго времени суток, уважаемый(-ая) {{ user.name }} [/ICODE][/FONT][/COLOR]<br>' +
'[CENTER][FONT=times new roman]Ваша Role Play Биография получает статус - [COLOR=rgb(255, 0, 0)]отказано[/COLOR].[/FONT]<br>' +
     '[SPOILER="*Нажмите*"][FONT=courier new][COLOR=rgb(255, 0, 0)]Ваша Role Play Биография не соответствует одному из пунктов правил создания Role Play Биографий[/COLOR].[/FONT][/SPOILER]<br>' +
     '[FONT=times new roman][B]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/B][/FONT]<br>' +
'[FONT=times new roman][B]С уважением состав Кураторов Форума сервера [COLOR=rgb(0, 255, 255)]AQUA[/COLOR][/B][/FONT]<br>'+
       '[CENTER][FONT=times new roman][COLOR=rgb(255, 0, 0)]Отказано,[/COLOR] [COLOR=rgb(255, 0, 0)]закрыто[/COLOR][/FONT][/CENTER]<br>',
      prefix: UNACCEPT_PREFIX,
	  status: false,
 },
   {  
   title: 'заголовок',
content:
 '[CENTER][IMG]https://i.postimg.cc/FRfvPzcN/Ltjtv-TM-1.png[/IMG]<br>' +
     '[CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman][ICODE]Доброго времени суток, уважаемый(-ая) {{ user.name }} [/ICODE][/FONT][/COLOR]<br>' +
'[CENTER][FONT=times new roman]Ваша Role Play Биография получает статус - [COLOR=rgb(255, 0, 0)]отказано[/COLOR].[/FONT]<br>' +
     '[SPOILER="*Нажмите*"][FONT=courier new][COLOR=rgb(255, 0, 0)]Заголовок вашей Role Play биографии оформлен неправильно[/COLOR].[/FONT][/SPOILER]<br>' +
     '[FONT=times new roman][B]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/B][/FONT]<br>' +
'[FONT=times new roman][B]С уважением состав Кураторов Форума сервера [COLOR=rgb(0, 255, 255)]AQUA[/COLOR][/B][/FONT]<br>'+
       '[CENTER][FONT=times new roman][COLOR=rgb(255, 0, 0)]Отказано,[/COLOR] [COLOR=rgb(255, 0, 0)]закрыто[/COLOR][/FONT][/CENTER]<br>',
      prefix: UNACCEPT_PREFIX,
	  status: false,
      },
   {  
   title: 'нрп ник',
content:
 '[CENTER][IMG]https://i.postimg.cc/FRfvPzcN/Ltjtv-TM-1.png[/IMG]<br>' +
     '[CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman][ICODE]Доброго времени суток, уважаемый(-ая) {{ user.name }} [/ICODE][/FONT][/COLOR]<br>' +
'[CENTER][FONT=times new roman]Ваша Role Play Биография получает статус - [COLOR=rgb(255, 0, 0)]отказано[/COLOR].[/FONT]<br>' +
     '[SPOILER="*Нажмите*"][FONT=courier new][COLOR=rgb(255, 0, 0)]У Вас NonRolePlay никнейм[/COLOR].[/FONT][/SPOILER]<br>' +
     '[FONT=times new roman][B]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/B][/FONT]<br>' +
'[FONT=times new roman][B]С уважением состав Кураторов Форума сервера [COLOR=rgb(0, 255, 255)]AQUA[/COLOR][/B][/FONT]<br>'+
       '[CENTER][FONT=times new roman][COLOR=rgb(255, 0, 0)]Отказано,[/COLOR] [COLOR=rgb(255, 0, 0)]закрыто[/COLOR][/FONT][/CENTER]<br>',
      prefix: UNACCEPT_PREFIX,
	  status: false,
  },
   {  
   title: 'написана от 1-го лица',
content:
 '[CENTER][IMG]https://i.postimg.cc/FRfvPzcN/Ltjtv-TM-1.png[/IMG]<br>' +
     '[CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman][ICODE]Доброго времени суток, уважаемый(-ая) {{ user.name }} [/ICODE][/FONT][/COLOR]<br>' +
'[CENTER][FONT=times new roman]Ваша Role Play Биография получает статус - [COLOR=rgb(255, 0, 0)]отказано[/COLOR].[/FONT]<br>' +
     '[SPOILER="*Нажмите*"][FONT=courier new][COLOR=rgb(255, 0, 0)]Ваша Role Play биография написана от 1-го лица[/COLOR].[/FONT][/SPOILER]<br>' +
     '[FONT=times new roman][B]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/B][/FONT]<br>' +
'[FONT=times new roman][B]С уважением состав Кураторов Форума сервера [COLOR=rgb(0, 255, 255)]AQUA[/COLOR][/B][/FONT]<br>'+
       '[CENTER][FONT=times new roman][COLOR=rgb(255, 0, 0)]Отказано,[/COLOR] [COLOR=rgb(255, 0, 0)]закрыто[/COLOR][/FONT][/CENTER]<br>',
      prefix: UNACCEPT_PREFIX,
	  status: false,
      },
   {  
   title: 'не по форме',
content:
 '[CENTER][IMG]https://i.postimg.cc/FRfvPzcN/Ltjtv-TM-1.png[/IMG]<br>' +
     '[CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman][ICODE]Доброго времени суток, уважаемый(-ая) {{ user.name }} [/ICODE][/FONT][/COLOR]<br>' +
'[CENTER][FONT=times new roman]Ваша Role Play Биография получает статус - [COLOR=rgb(255, 0, 0)]отказано[/COLOR].[/FONT]<br>' +
     '[SPOILER="*Нажмите*"][FONT=courier new][COLOR=rgb(255, 0, 0)]Ваша Role Play биография составлена не по форме[/COLOR].[/FONT][/SPOILER]<br>' +
     '[FONT=times new roman][B]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/B][/FONT]<br>' +
'[FONT=times new roman][B]С уважением состав Кураторов Форума сервера [COLOR=rgb(0, 255, 255)]AQUA[/COLOR][/B][/FONT]<br>'+
       '[CENTER][FONT=times new roman][COLOR=rgb(255, 0, 0)]Отказано,[/COLOR] [COLOR=rgb(255, 0, 0)]закрыто[/COLOR][/FONT][/CENTER]<br>',
      prefix: UNACCEPT_PREFIX,
	  status: false,
 },
   {  
   title: 'копипаст',
content:
 '[CENTER][IMG]https://i.postimg.cc/FRfvPzcN/Ltjtv-TM-1.png[/IMG]<br>' +
     '[CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman][ICODE]Доброго времени суток, уважаемый(-ая) {{ user.name }} [/ICODE][/FONT][/COLOR]<br>' +
'[CENTER][FONT=times new roman]Ваша Role Play Биография получает статус - [COLOR=rgb(255, 0, 0)]отказано[/COLOR].[/FONT]<br>' +
     '[SPOILER="*Нажмите*"][FONT=courier new][COLOR=rgb(255, 0, 0)]Ваша Role Play биография скопирована у другого человека[/COLOR].[/FONT][/SPOILER]<br>' +
     '[FONT=times new roman][B]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/B][/FONT]<br>' +
'[FONT=times new roman][B]С уважением состав Кураторов Форума сервера [COLOR=rgb(0, 255, 255)]AQUA[/COLOR][/B][/FONT]<br>'+
       '[CENTER][FONT=times new roman][COLOR=rgb(255, 0, 0)]Отказано,[/COLOR] [COLOR=rgb(255, 0, 0)]закрыто[/COLOR][/FONT][/CENTER]<br>',
      prefix: UNACCEPT_PREFIX,
	  status: false,
},
   {
title: 'на дополнении',
content:
 '[CENTER][IMG]https://i.postimg.cc/FRfvPzcN/Ltjtv-TM-1.png[/IMG]<br>' +
     '[CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman][ICODE]Доброго времени суток, уважаемый(-ая) {{ user.name }} [/ICODE][/FONT][/COLOR]<br>' +
'[CENTER][FONT=times new roman]Ваша Role Play Биография получает статус - [COLOR=rgb(255, 255, 0)]на рассмотрении[/COLOR].[/FONT]<br>' +
     '[SPOILER="*Нажмите*"][FONT=courier new][COLOR=rgb(255, 0, 0)]В вашей Role Play Биографии недостаточно информации для одобрения, у вас есть 24 часа чтобы дополнить свою биографию[/COLOR].[/FONT][/SPOILER]<br>' +
     '[FONT=times new roman][B]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/B][/FONT]<br>' +
'[FONT=times new roman][B]С уважением состав Кураторов Форума сервера [COLOR=rgb(0, 255, 255)]AQUA[/COLOR][/B][/FONT]<br>'+
       '[CENTER][FONT=times new roman][COLOR=rgb(255, 255, 0)]На рассмотрении,[/COLOR] [COLOR=rgb(0, 255, 0)]открыто[/COLOR][/FONT][/CENTER]<br>',
      prefix: PIN_PREFIX,
	  status: true,
},
   {
title: 'не дополнил',
content:
 '[CENTER][IMG]https://i.postimg.cc/FRfvPzcN/Ltjtv-TM-1.png[/IMG]<br>' +
     '[CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman][ICODE]Доброго времени суток, уважаемый(-ая) {{ user.name }} [/ICODE][/FONT][/COLOR]<br>' +
'[CENTER][FONT=times new roman]Ваша Role Play Биография получает статус - [COLOR=rgb(255, 0, 0)]отказано[/COLOR].[/FONT]<br>' +
     '[SPOILER="*Нажмите*"][FONT=courier new][COLOR=rgb(255, 0, 0)]Спустя сутки ваша Role Play Биография не была дополнена[/COLOR].[/FONT][/SPOILER]<br>' +
     '[FONT=times new roman][B]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/B][/FONT]<br>' +
'[FONT=times new roman][B]С уважением состав Кураторов Форума сервера [COLOR=rgb(0, 255, 255)]AQUA[/COLOR][/B][/FONT]<br>'+
       '[CENTER][FONT=times new roman][COLOR=rgb(255, 0, 0)]Отказано,[/COLOR] [COLOR=rgb(0, 255, 0)]закрыто[/COLOR][/FONT][/CENTER]<br>',
      prefix: UNACCEPT_PREFIX,
	  status: false,
},
   {
      title: '――――――――――――――――――Неофициальные RP организации――――――――――――――――――',
	},
   {
title: 'одобрено',
content:
 '[CENTER][IMG]https://i.postimg.cc/FRfvPzcN/Ltjtv-TM-1.png[/IMG]<br>' +
     '[CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman][ICODE]Доброго времени суток, уважаемый(-ая) {{ user.name }} [/ICODE][/FONT][/COLOR]<br>' +
'[CENTER][FONT=times new roman]Ваша Неофициальная RP организация получает статус - [COLOR=rgb(0, 255, 0)]одобрено[/COLOR].[/FONT]<br>' +
     '[FONT=times new roman][B]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/B][/FONT]<br>' +
'[FONT=times new roman][B]С уважением состав Кураторов Форума сервера [COLOR=rgb(0, 255, 255)]AQUA[/COLOR][/B][/FONT]<br>'+
       '[CENTER][FONT=times new roman][COLOR=rgb(0, 255, 0)]Одобрено,[/COLOR] [COLOR=rgb(255, 0, 0)]закрыто[/COLOR][/FONT][/CENTER]<br>',
      prefix: ACCEPT_PREFIX,
	  status: false,
},
   {
title: 'отказано',
content:
 '[CENTER][IMG]https://i.postimg.cc/FRfvPzcN/Ltjtv-TM-1.png[/IMG]<br>' +
     '[CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman][ICODE]Доброго времени суток, уважаемый(-ая) {{ user.name }} [/ICODE][/FONT][/COLOR]<br>' +
'[CENTER][FONT=times new roman]Ваша Неофициальая RP организация получает статус - [COLOR=rgb(255, 0, 0)]отказано[/COLOR].[/FONT]<br>' +
     '[SPOILER="*Нажмите*"][FONT=courier new][COLOR=rgb(255, 0, 0)]Ваша Неофициальная RP организация не соответствует одному из пунктов правил создания Неофициальных RP организаций[/COLOR].[/FONT][/SPOILER]<br>' +
     '[FONT=times new roman][B]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/B][/FONT]<br>' +
'[FONT=times new roman][B]С уважением состав Кураторов Форума сервера [COLOR=rgb(0, 255, 255)]AQUA[/COLOR][/B][/FONT]<br>'+
       '[CENTER][FONT=times new roman][COLOR=rgb(255, 0, 0)]Отказано,[/COLOR] [COLOR=rgb(255, 0, 0)]закрыто[/COLOR][/FONT][/CENTER]<br>',
      prefix: UNACCEPT_PREFIX,
	  status: false,
},
  {
title: 'на дополнении',
content:
 '[CENTER][IMG]https://i.postimg.cc/FRfvPzcN/Ltjtv-TM-1.png[/IMG]<br>' +
     '[CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman][ICODE]Доброго времени суток, уважаемый(-ая) {{ user.name }} [/ICODE][/FONT][/COLOR]<br>' +
'[CENTER][FONT=times new roman]Ваша Неофициальная RP организация получает статус - [COLOR=rgb(255, 255, 0)]на рассмотрении[/COLOR].[/FONT]<br>' +
     '[SPOILER="*Нажмите*"][FONT=courier new][COLOR=rgb(255, 0, 0)]В вашей Неофициальной RP организации недостаточно информации для одобрения, у вас есть 24 часа чтобы дополнить организацию[/COLOR].[/FONT][/SPOILER]<br>' +
     '[FONT=times new roman][B]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/B][/FONT]<br>' +
'[FONT=times new roman][B]С уважением состав Кураторов Форума сервера [COLOR=rgb(0, 255, 255)]AQUA[/COLOR][/B][/FONT]<br>'+
       '[CENTER][FONT=times new roman][COLOR=rgb(255, 255, 0)]На рассмотрении,[/COLOR] [COLOR=rgb(0, 255, 0)]открыто[/COLOR][/FONT][/CENTER]<br>',
      prefix: PIN_PREFIX,
	  status: true,
},
   {
title: 'не дополнил',
content:
 '[CENTER][IMG]https://i.postimg.cc/FRfvPzcN/Ltjtv-TM-1.png[/IMG]<br>' +
     '[CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman][ICODE]Доброго времени суток, уважаемый(-ая) {{ user.name }} [/ICODE][/FONT][/COLOR]<br>' +
'[CENTER][FONT=times new roman]Ваша Неофициальная RP организация получает статус - [COLOR=rgb(255, 0, 0)]отказано[/COLOR].[/FONT]<br>' +
     '[SPOILER="*Нажмите*"][FONT=courier new][COLOR=rgb(255, 0, 0)]Спустя сутки ваша Неофициальная RP организация не была дополнена[/COLOR].[/FONT][/SPOILER]<br>' +
     '[FONT=times new roman][B]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/B][/FONT]<br>' +
'[FONT=times new roman][B]С уважением состав Кураторов Форума сервера [COLOR=rgb(0, 255, 255)]AQUA[/COLOR][/B][/FONT]<br>'+
       '[CENTER][FONT=times new roman][COLOR=rgb(255, 0, 0)]Отказано,[/COLOR] [COLOR=rgb(0, 255, 0)]закрыто[/COLOR][/FONT][/CENTER]<br>',
      prefix: UNACCEPT_PREFIX,
	  status: false,
},
    {
      title: '―――――――――――――――――――――――РП СИТУАЦИИ―――――――――――――――――――――――',
	},
  {
title: 'одобрено',
content:
 '[CENTER][IMG]https://i.postimg.cc/FRfvPzcN/Ltjtv-TM-1.png[/IMG]<br>' +
     '[CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman][ICODE]Доброго времени суток, уважаемый(-ая) {{ user.name }} [/ICODE][/FONT][/COLOR]<br>' +
'[CENTER][FONT=times new roman]Ваша Role Play ситуация получает статус - [COLOR=rgb(0, 255, 0)]одобрено[/COLOR].[/FONT]<br>' +
     '[FONT=times new roman][B]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/B][/FONT]<br>' +
'[FONT=times new roman][B]С уважением состав Кураторов Форума сервера [COLOR=rgb(0, 255, 255)]AQUA[/COLOR][/B][/FONT]<br>'+
       '[CENTER][FONT=times new roman][COLOR=rgb(0, 255, 0)]Одобрено,[/COLOR] [COLOR=rgb(255, 0, 0)]закрыто[/COLOR][/FONT][/CENTER]<br>',
      prefix: ACCEPT_PREFIX,
	  status: false,
},
    {
title: 'отказано',
content:
 '[CENTER][IMG]https://i.postimg.cc/FRfvPzcN/Ltjtv-TM-1.png[/IMG]<br>' +
     '[CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman][ICODE]Доброго времени суток, уважаемый(-ая) {{ user.name }} [/ICODE][/FONT][/COLOR]<br>' +
'[CENTER][FONT=times new roman]Ваша Role Play ситуация получает статус - [COLOR=rgb(255, 0, 0)]отказано[/COLOR].[/FONT]<br>' +
     '[SPOILER="*Нажмите*"][FONT=courier new][COLOR=rgb(255, 0, 0)]Ваша Role Play ситуация не соответствует одному из пунктов правил создания Role Play ситуаций[/COLOR].[/FONT][/SPOILER]<br>' +
     '[FONT=times new roman][B]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/B][/FONT]<br>' +
'[FONT=times new roman][B]С уважением состав Кураторов Форума сервера [COLOR=rgb(0, 255, 255)]AQUA[/COLOR][/B][/FONT]<br>'+
       '[CENTER][FONT=times new roman][COLOR=rgb(255, 0, 0)]Отказано,[/COLOR] [COLOR=rgb(255, 0, 0)]закрыто[/COLOR][/FONT][/CENTER]<br>',
      prefix: UNACCEPT_PREFIX,
	  status: false,
},
   {
title: 'на дополнении',
content:
 '[CENTER][IMG]https://i.postimg.cc/FRfvPzcN/Ltjtv-TM-1.png[/IMG]<br>' +
     '[CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman][ICODE]Доброго времени суток, уважаемый(-ая) {{ user.name }} [/ICODE][/FONT][/COLOR]<br>' +
'[CENTER][FONT=times new roman]Ваша Role Play ситуация получает статус - [COLOR=rgb(255, 255, 0)]на рассмотрении[/COLOR].[/FONT]<br>' +
     '[SPOILER="*Нажмите*"][FONT=courier new][COLOR=rgb(255, 0, 0)]В вашей Role Play ситуации недостаточно информации для одобрения, у вас есть 24 часа чтобы дополнить ситуацию[/COLOR].[/FONT][/SPOILER]<br>' +
     '[FONT=times new roman][B]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/B][/FONT]<br>' +
'[FONT=times new roman][B]С уважением состав Кураторов Форума сервера [COLOR=rgb(0, 255, 255)]AQUA[/COLOR][/B][/FONT]<br>'+
       '[CENTER][FONT=times new roman][COLOR=rgb(255, 255, 0)]На рассмотрении,[/COLOR] [COLOR=rgb(0, 255, 0)]открыто[/COLOR][/FONT][/CENTER]<br>',
      prefix: PIN_PREFIX,
	  status: true,
},
   {
title: 'не дополнил',
content:
 '[CENTER][IMG]https://i.postimg.cc/FRfvPzcN/Ltjtv-TM-1.png[/IMG]<br>' +
     '[CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman][ICODE]Доброго времени суток, уважаемый(-ая) {{ user.name }} [/ICODE][/FONT][/COLOR]<br>' +
'[CENTER][FONT=times new roman]Ваша Role Play ситуация получает статус - [COLOR=rgb(255, 0, 0)]отказано[/COLOR].[/FONT]<br>' +
     '[SPOILER="*Нажмите*"][FONT=courier new][COLOR=rgb(255, 0, 0)]Спустя сутки ваша Role Play ситуация не была дополнена[/COLOR].[/FONT][/SPOILER]<br>' +
     '[FONT=times new roman][B]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/B][/FONT]<br>' +
'[FONT=times new roman][B]С уважением состав Кураторов Форума сервера [COLOR=rgb(0, 255, 255)]AQUA[/COLOR][/B][/FONT]<br>'+
       '[CENTER][FONT=times new roman][COLOR=rgb(255, 0, 0)]Отказано,[/COLOR] [COLOR=rgb(0, 255, 0)]закрыто[/COLOR][/FONT][/CENTER]<br>',
      prefix: UNACCEPT_PREFIX,
	  status: false,
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