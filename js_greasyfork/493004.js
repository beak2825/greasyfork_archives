// ==UserScript==
// @name         NOVOSIBIRSK скрипт для КФ by N.REGIS
// @namespace    https://forum-matrrp.vkweb.su/index.php
// @version     3.0
// @description  NOVOSIBIRSK для КФ
// @author       Nekit_Regis
// @match         https://forum-matrrp.vkweb.su/index.php*
// @license MIT
// @icon           https://forum-matrrp.vkweb.su/index.php
// @grant        none
// @icon         tbn0.gstatic.com/images?q=tbn:ANd9GcRgeBlAMtHufJKNxWuE5DJhTbp-tqs9gRdPmw&usqp=CAU
// @downloadURL https://update.greasyfork.org/scripts/493004/NOVOSIBIRSK%20%D1%81%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%9A%D0%A4%20by%20NREGIS.user.js
// @updateURL https://update.greasyfork.org/scripts/493004/NOVOSIBIRSK%20%D1%81%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%9A%D0%A4%20by%20NREGIS.meta.js
// ==/UserScript==

(function () {
  'use strict';
const UNACCСEPT_PREFIX = 4; // Prefix that will be set when thread closes
const ACCСEPT_PREFIX = 8; // Prefix that will be set when thread accepted
const RESHENO_PREFIX = 6; // Prefix that will be set when solving the problem
const PINN_PREFIX = 2; // Prefix that will be set when thread pins
const GA_PREFIX = 12; // Prefix that will be set when thread send to ga
const COMMAND_PREFIX = 10; // Prefix that will be set when thread send to project team
const WATCHED_PREFIX = 9;
const CLOSE_PREFIX = 7;
const SPECY_PREFIX = 11;
const TEXY_PREFIX = 13;
const OTKAZBIO_PREFIX = 4;
const ODOBRENOBIO_PREFIX = 8;
const NARASSMOTRENIIBIO_PREFIX = 2;
const OTKAZRP_PREFIX = 4;
const ODOBRENORP_PREFIX = 8;
const NARASSMOTRENIIRP_PREFIX = 2;
const OTKAZORG_PREFIX = 4;
const ODOBRENOORG_PREFIX = 8;
const NARASSMOTRENIIORG_PREFIX = 2;
const buttons = [
         {
             title: 'Приветствие',
      content:  '[FONT=Courier New][CENTER]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br>' + '[CENTER]  [/CENTER][/FONT]',
    },
     {
      title: 'Отказано, закрыто',
      content: '[Color=Red][CENTER][FONT=Georgia]Отказано, закрыто.[/CENTER][/color]' + '[CENTER]  [/CENTER]',
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
    {
      title: 'Одобрено, закрыто',
      content: '[Color=LimeGreen][FONT=Georgia][CENTER]Одобрено, закрыто.[/CENTER][/color]' + '[CENTER]  [/CENTER]',
      prefix: ACCСEPT_PREFIX,
	 status: false,
    },
    {
      title: 'На рассмотрении...',
      content:		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/VNTPGQsQ/image2-3-1-1-1-10.gif[/img][/url]<br>' +
        '[Color=Orange][CENTER][FONT=Georgia]Ваша жалоба взята на рассмотрение. Ожидайте ответа и не создавайте копии данной темы.[/CENTER][/color]' + '[CENTER]  [/CENTER]',
      prefix: WATCHED_PREFIX,
      status: false,
    },
    {
     title: '- - - - - -  - - - - - - - - -  - - - - - - - - - - - - - - - - - Правила Role Play процесса - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -',
    },
    {
      title: 'Игрок будет наказан',
      content:
		"[CENTER][COLOR=#ff0000]Доброго времени суток уважаемый {{ user.name }} [/COLOR][/CENTER]<br><br>"+
        '[CENTER][COLOR=orange]━━━━━━━━━━━━⊱⋆⊰━━━━━━━━━━━━[/CENTER][/COLOR]' +
        "[CENTER][COLOR=Red][FONT=Georgia]Игрок будет наказан[/COLOR][/CENTER]<br>" +
        '[CENTER][COLOR=orange]━━━━━━━━━━━━⊱⋆⊰━━━━━━━━━━━━[/CENTER][/COLOR]' +
		'[Color=AQUA][CENTER]Спасибо за Ваше обращение!<br>Приятной игры на NOVOSIBIRSK.[/CENTER][/color]' +
        '[COLOR=GREEN][CENTER]✿❯────「Одобрено ❖ Закрыто」────❮✿[/CENTER][/COLOR]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Багоюз',
      content:
		"[CENTER][COLOR=#ff0000]Доброго времени суток уважаемый {{ user.name }}[/COLOR][/CENTER]<br><br>"+
        '[CENTER][COLOR=Orange]━━━━━━━━━━━━⊱⋆⊰━━━━━━━━━━━━[/CENTER][/COLOR]' +
        "[CENTER][COLOR=#ffff00]Игрок будет наказан по пункту правил: [/CENTER]" +
        "[CENTER][COLOR=RED] 2.21.[/COLOR][COLOR=WHITE]Запрещено пытаться обходить игровую систему или использовать любые баги сервера[/color][Color=red]| Ban 15 - 30 дней / PermBan (по согласованию с ГА, ЗГА, руководством тех. специалистов).[/CENTER][/COLOR]"+
        "[CENTER][COLOR=Orange]━━━━━━━━━━━━⊱⋆⊰━━━━━━━━━━━━[/CENTER][/COLOR]" +
        '[Color=AQUA][CENTER]Спасибо за Ваше обращение!<br>Приятной игры на NOVOSIBIRSK.[/CENTER][/color]'+
        '[COLOR=GREEN][CENTER]✿❯────「Одобрено ❖ Закрыто」────❮✿[/CENTER][/COLOR]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'non-rp поведение',
      content:
		"[CENTER][COLOR=#ff0000]Доброго времени суток уважаемый {{ user.name }}[/COLOR][/CENTER]<br><br>"+
        '[CENTER][COLOR=violet]━━━━━━━━━━━━⊱⋆⊰━━━━━━━━━━━━[/CENTER][/COLOR]' +
        "[CENTER][COLOR=#ffff00]Игрок будет наказан по пункту правил: [/CENTER]" +
        "[CENTER][COLOR=RED]  2.01.[/COLOR][COLOR=WHITE]Запрещено поведение, нарушающее нормы процессов Role Play режима игры [/color][Color=red] | Jail 30 минут.[/CENTER][/COLOR]" +
        '[CENTER][COLOR=violet]━━━━━━━━━━━━⊱⋆⊰━━━━━━━━━━━━[/CENTER][/COLOR]' +
        '[Color=AQUA][CENTER]Спасибо за Ваше обращение!<br>Приятной игры на NOVOSIBIRSK.[/CENTER][/color]' +
        '[COLOR=GREEN][CENTER]✿❯────「Одобрено ❖ Закрыто」────❮✿[/CENTER][/COLOR]',
 
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Уход от РП',
      content:
		"[CENTER][COLOR=#ff0000]Доброго времени суток уважаемый {{ user.name }}. [/COLOR][/CENTER]<br><br>"+
        '[CENTER][COLOR=violet]━━━━━━━━━━━━⊱⋆⊰━━━━━━━━━━━━[/CENTER][/COLOR]' +
        "[CENTER][COLOR=#ffff00]Игрок будет наказан по данному пункту правил:[/CENTER][/COLOR]" +
        "[CENTER][COLOR=RED] 2.02. [/COLOR][COLOR=WHITE] Запрещено целенаправленно уходить от Role Play процесса всеразличными способами[/color][Color=red]| Jail 30 минут / Warn.[/COLOR] [/CENTER]<br>" +
        '[CENTER][COLOR=violet]━━━━━━━━━━━━⊱⋆⊰━━━━━━━━━━━━[/CENTER][/COLOR]' +
        '[Color=AQUA][CENTER]Спасибо за Ваше обращение!<br>Приятной игры на NOVOSIBIRSK.[/CENTER][/color]' +
        '[COLOR=GREEN][CENTER]✿❯────「Одобрено ❖ Закрыто」────❮✿[/CENTER][/COLOR]',
 
 
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'non-rp вождение',
      content:
		"[CENTER][COLOR=#ff0000]Доброго времени суток уважаемый {{ user.name }}[/COLOR][/CENTER]<br><br>"+
        '[CENTER][COLOR=violet]━━━━━━━━━━━━⊱⋆⊰━━━━━━━━━━━━[/CENTER][/COLOR]' +
        "[CENTER][COLOR=#FFFF00]Игрок будет наказан по данному пункту правил:[/CENTER][/COLOR]"+
        "[CENTER][COLOR=RED] 2.03. [/COLOR][COLOR=WHITE] Запрещен NonRP Drive — вождение любого транспортного средства в невозможных для него условиях, а также вождение в неправдоподобной манере [/color][Color=red] | Jail 30 минут[/COLOR][/CENTER]<br>"+
        '[CENTER][COLOR=violet]━━━━━━━━━━━━⊱⋆⊰━━━━━━━━━━━━[/CENTER][/COLOR]' +
		'[Color=AQUA][CENTER]Спасибо за Ваше обращение!<br>Приятной игры на NOVOSIBIRSK.[/CENTER][/color]' +
        '[COLOR=GREEN][CENTER]✿❯────「Одобрено ❖ Закрыто」────❮✿[/CENTER][/COLOR]',
 
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
        {
      title: 'NonRP Обман',
      content:
		"[CENTER][COLOR=#ff0000]Доброго времени суток уважаемый {{ user.name }} [/COLOR][/CENTER]<br><br>"+
        '[CENTER][COLOR=violet]━━━━━━━━━━━━⊱⋆⊰━━━━━━━━━━━━[/CENTER][/COLOR]' +
        "[CENTER][COLOR=#FFFF00]Игрок будет наказан по данному пункту правил:[/CENTER][/COLOR]"+
        "[CENTER][COLOR=RED] 2.05. [/COLOR][COLOR=WHITE] Запрещены любые OOC обманы и их попытки, а также любые IC обманы с нарушением Role Play правил и логики [/color][Color=red]| PermBan.[/COLOR][/CENTER]<br>" +
        '[CENTER][COLOR=violet]━━━━━━━━━━━━⊱⋆⊰━━━━━━━━━━━━[/CENTER][/COLOR]' +
		'[Color=AQUA][CENTER]Спасибо за Ваше обращение!<br>Приятной игры на NOVOSIBIRSK.[/CENTER][/color]' +
        '[COLOR=GREEN][CENTER]✿❯────「Одобрено ❖ Закрыто」────❮✿[/CENTER][/COLOR]',
 
 
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Аморал. действия',
      content:
		"[CENTER][COLOR=#ff0000]Доброго времени суток уважаемый {{ user.name }} [/COLOR][/CENTER]<br><br>"+
        '[CENTER][COLOR=violet]━━━━━━━━━━━━⊱⋆⊰━━━━━━━━━━━━[/CENTER][/COLOR]' +
        "[CENTER][COLOR=#FFFF00]Игрок будет наказан по данному пункту правил:[/CENTER][/COLOR]"+
        "[CENTER][COLOR=RED]2.08. [/COLOR][COLOR=WHITE]Запрещена любая форма аморальных действий сексуального характера в сторону игроков[/color][Color=red] | Jail 30 минут / Warn [/COLOR][/CENTER]<br>" +
        '[CENTER][COLOR=violet]━━━━━━━━━━━━⊱⋆⊰━━━━━━━━━━━━[/CENTER][/COLOR]' +
		'[Color=AQUA][CENTER]Спасибо за Ваше обращение!<br>Приятной игры на NOVOSIBIRSK.[/CENTER][/color]' +
        '[COLOR=GREEN][CENTER]✿❯────「Одобрено ❖ Закрыто」────❮✿[/CENTER][/COLOR]',
 
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Слив склада',
      content:
		"[CENTER][COLOR=#ff0000]Доброго времени суток уважаемый {{ user.name }} [/COLOR][/CENTER]<br><br>"+
        '[CENTER][COLOR=violet]━━━━━━━━━━━━⊱⋆⊰━━━━━━━━━━━━[/CENTER][/COLOR]' +
        "[CENTER][COLOR=#FFFF00]Игрок будет наказан по данному пункту правил:[/CENTER][/COLOR]" +
        "[CENTER][COLOR=RED] 2.09. [/COLOR][COLOR=WHITE] Запрещено сливать склад фракции / семьи путем взятия большого количестве ресурсов, или же брать больше, чем разрешили на самом деле [/color][Color=red]| Ban 15 - 30 дней / PermBan [/COLOR][/CENTER]<br>" +
        '[CENTER][COLOR=violet]━━━━━━━━━━━━⊱⋆⊰━━━━━━━━━━━━[/CENTER][/COLOR]' +
		'[Color=AQUA][CENTER]Спасибо за Ваше обращение!<br>Приятной игры на NOVOSIBIRSK.[/CENTER][/color]' +
        '[COLOR=GREEN][CENTER]✿❯────「Одобрено ❖ Закрыто」────❮✿[/CENTER][/COLOR]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'ДБ',
      content:
		"[CENTER][COLOR=#ff0000]Доброго времени суток уважаемый {{ user.name }}[/COLOR][/CENTER]<br><br>"+
        '[CENTER][COLOR=violet]━━━━━━━━━━━━⊱⋆⊰━━━━━━━━━━━━[/CENTER][/COLOR]' +
        "[CENTER][COLOR=#FFFF00]Игрок будет наказан по данному пункту правил:[/CENTER][/COLOR]"+
        "[CENTER][COLOR=RED]2.13.  [/COLOR][COLOR=WHITE]  Запрещен DB (DriveBy) — намеренное убийство / нанесение урона без веской IC причины на любом виде транспорта [/color][Color=red] | Jail 60 минут[/COLOR][/CENTER]<br>" +
        '[CENTER][COLOR=violet]━━━━━━━━━━━━⊱⋆⊰━━━━━━━━━━━━[/CENTER][/COLOR]' +
		'[Color=AQUA][CENTER]Спасибо за Ваше обращение!<br>Приятной игры на NOVOSIBIRSK.[/CENTER][/color]' +
        '[COLOR=GREEN][CENTER]✿❯────「Одобрено ❖ Закрыто」────❮✿[/CENTER][/COLOR]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'РК',
      content:
		"[CENTER][COLOR=#ff0000]Доброго времени суток уважаемый {{ user.name }} [/COLOR][/CENTER]<br><br>"+
        '[CENTER][COLOR=violet]━━━━━━━━━━━━⊱⋆⊰━━━━━━━━━━━━[/CENTER][/COLOR]' +
        "[CENTER][COLOR=#FFFF00]Игрок будет наказан по данному пункту правил:[/CENTER][/COLOR]"+
        "[CENTER][COLOR=RED] 2.14. [/COLOR][COLOR=WHITE] Запрещен RK (Revenge Kill) — убийство игрока с целью мести, возвращение на место смерти в течение 15-ти минут, а также использование в дальнейшем информации, которая привела Вас к смерти [/color][Color=red] | Jail 30 минут [/COLOR][/CENTER]<br>" +
        '[CENTER][COLOR=violet]━━━━━━━━━━━━⊱⋆⊰━━━━━━━━━━━━[/CENTER][/COLOR]' +
		'[Color=AQUA][CENTER]Спасибо за Ваше обращение!<br>Приятной игры на NOVOSIBIRSK.[/CENTER][/color]' +
        '[COLOR=GREEN][CENTER]✿❯────「Одобрено ❖ Закрыто」────❮✿[/CENTER][/COLOR]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'ТК',
      content:
		"[CENTER][COLOR=#ff0000]Доброго времени суток уважаемый {{ user.name }} [/COLOR][/CENTER]<br><br>"+
        '[CENTER][COLOR=violet]━━━━━━━━━━━━⊱⋆⊰━━━━━━━━━━━━[/CENTER][/COLOR]' +
        "[CENTER][COLOR=#FFFF00]Игрок будет наказан по данному пункту правил:[/CENTER][/COLOR]"+
        "[CENTER][COLOR=RED] 2.15. [/COLOR][COLOR=WHITE] Запрещен TK (Team Kill) — убийство члена своей или союзной фракции, организации без наличия какой-либо IC причины [/color][Color=red] | Jail 60 минут / Warn (за два и более убийства) [/COLOR][/CENTER]<br>" +
        '[CENTER][COLOR=violet]━━━━━━━━━━━━⊱⋆⊰━━━━━━━━━━━━[/CENTER][/COLOR]' +
		'[Color=AQUA][CENTER]Спасибо за Ваше обращение!<br>Приятной игры на NOVOSIBIRSK.[/CENTER][/color]' +
        '[COLOR=GREEN][CENTER]✿❯────「Одобрено ❖ Закрыто」────❮✿[/CENTER][/COLOR]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'СК',
      content:
		"[CENTER][COLOR=#ff0000]Доброго времени суток уважаемый {{ user.name }} [/COLOR][/CENTER]<br><br>"+
        '[CENTER][COLOR=violet]━━━━━━━━━━━━⊱⋆⊰━━━━━━━━━━━━[/CENTER][/COLOR]' +
        "[CENTER][COLOR=#FFFF00]Игрок будет наказан по данному пункту правил:[/CENTER][/COLOR]"+
        "[CENTER][COLOR=RED] 2.16.[/COLOR][COLOR=WHITE] Запрещен SK (Spawn Kill) — убийство или нанесение урона на титульной территории любой фракции / организации, на месте появления игрока, а также на выходе из закрытых интерьеров и около них [/color][Color=red] | Jail 60 минут / Warn (за два и более убийства)[/COLOR][/CENTER]<br>" +
        '[CENTER][COLOR=violet]━━━━━━━━━━━━⊱⋆⊰━━━━━━━━━━━━[/CENTER][/COLOR]' +
		'[Color=AQUA][CENTER]Спасибо за Ваше обращение!<br>Приятной игры на NOVOSIBIRSK.[/CENTER][/color]' +
        '[COLOR=GREEN][CENTER]✿❯────「Одобрено ❖ Закрыто」────❮✿[/CENTER][/COLOR]',
	  status: false,
    },
    {
      title: 'ПГ',
      content:
		"[CENTER][COLOR=#ff0000]Доброго времени суток уважаемый {{ user.name }} [/COLOR][/CENTER]<br><br>"+
        '[CENTER][COLOR=violet]━━━━━━━━━━━━⊱⋆⊰━━━━━━━━━━━━[/CENTER][/COLOR]' +
        "[CENTER][COLOR=#FFFF00]Игрок будет наказан по данному пункту правил:[/CENTER][/COLOR]"+
        "[CENTER][COLOR=RED] 2.17. [/COLOR][COLOR=WHITE] Запрещен PG (PowerGaming) — присвоение свойств персонажу, не соответствующих реальности, отсутствие страха за свою жизнь [/color][Color=red] | Jail 30 минут [/COLOR][/CENTER]<br>" +
        '[CENTER][COLOR=violet]━━━━━━━━━━━━⊱⋆⊰━━━━━━━━━━━━[/CENTER][/COLOR]' +
		'[Color=AQUA][CENTER]Спасибо за Ваше обращение!<br>Приятной игры на NOVOSIBIRSK.[/CENTER][/color]' +
        '[COLOR=GREEN][CENTER]✿❯────「Одобрено ❖ Закрыто」────❮✿[/CENTER][/COLOR]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'MG',
      content:
		"[CENTER][COLOR=#ff0000]Доброго времени суток уважаемый {{ user.name }} [/COLOR][/CENTER]<br><br>"+
        '[CENTER][COLOR=violet]━━━━━━━━━━━━⊱⋆⊰━━━━━━━━━━━━[/CENTER][/COLOR]' +
        "[CENTER][COLOR=#FFFF00]Игрок будет наказан по данному пункту правил:[/CENTER][/COLOR]"+
        "[CENTER][COLOR=RED] 2.18. [/COLOR][COLOR=WHITE] Запрещен MG (MetaGaming) — использование ООС информации, которую Ваш персонаж никак не мог получить в IC процессе [/color][Color=red] | Mute 30 минут [/COLOR][/CENTER]<br>" +
        '[CENTER][COLOR=violet]━━━━━━━━━━━━⊱⋆⊰━━━━━━━━━━━━[/CENTER][/COLOR]' +
		'[Color=AQUA][CENTER]Спасибо за Ваше обращение!<br>Приятной игры на NOVOSIBIRSK.[/CENTER][/color]' +
        '[COLOR=GREEN][CENTER]✿❯────「Одобрено ❖ Закрыто」────❮✿[/CENTER][/COLOR]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
        {
      title: 'ДМ',
      content:
		"[CENTER][COLOR=#ff0000]Доброго времени суток уважаемый {{ user.name }} [/COLOR][/CENTER]<br><br>"+
        '[CENTER][COLOR=violet]━━━━━━━━━━━━⊱⋆⊰━━━━━━━━━━━━[/CENTER][/COLOR]' +
        "[CENTER][COLOR=#FFFF00]Игрок будет наказан по данному пункту правил: [/CENTER][/COLOR]"+
        "[CENTER][COLOR=RED] 2.19. [/COLOR][COLOR=WHITE]  Запрещен DM (DeathMatch) — убийство или нанесение урона без веской IC причины [/color][Color=red] | Jail 60 минут [/COLOR][/CENTER]<br>" +
        '[CENTER][COLOR=violet]━━━━━━━━━━━━⊱⋆⊰━━━━━━━━━━━━[/CENTER][/COLOR]' +
		'[Color=AQUA][CENTER]Спасибо за Ваше обращение!<br>Приятной игры на NOVOSIBIRSK.[/CENTER][/color]' +
        '[COLOR=GREEN][CENTER]✿❯────「Одобрено ❖ Закрыто」────❮✿[/CENTER][/COLOR]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Масс ДМ',
      content:
		"[CENTER][COLOR=#ff0000]Доброго времени суток уважаемый {{ user.name }} [/COLOR][/CENTER]<br><br>"+
        '[CENTER][COLOR=violet]━━━━━━━━━━━━⊱⋆⊰━━━━━━━━━━━━[/CENTER][/COLOR]' +
        "[CENTER][COLOR=#FFFF00]Игрок будет наказан по данному пункту правил:[/CENTER][/COLOR]"+
        "[CENTER][COLOR=RED] 2.20. [/COLOR][COLOR=WHITE] Запрещен Mass DM (Mass DeathMatch) — убийство или нанесение урона без веской IC причины более трем игрокам [/color][Color=red] | Warn / Ban 3 - 7 дней [/COLOR][/CENTER]<br>" +
        '[CENTER][COLOR=violet]━━━━━━━━━━━━⊱⋆⊰━━━━━━━━━━━━[/CENTER][/COLOR]' +
		'[Color=AQUA][CENTER]Спасибо за Ваше обращение!<br>Приятной игры на NOVOSIBIRSK.[/CENTER][/color]' +
        '[COLOR=GREEN][CENTER]✿❯────「Одобрено ❖ Закрыто」────❮✿[/CENTER][/COLOR]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
        {
      title: 'Постороннее ПО',
      content:
		"[CENTER][COLOR=#ff0000]Доброго времени суток уважаемый {{ user.name }} [/COLOR][/CENTER]<br><br>"+
        '[CENTER][COLOR=orange]━━━━━━━━━━━━⊱⋆⊰━━━━━━━━━━━━[/CENTER][/COLOR]' +
        "[CENTER][COLOR=#FFFF00]Игрок будет наказан по пункту правил:[/CENTER][/COLOR]"+
        "[CENTER][COLOR=RED] 2.22. [/COLOR][COLOR=WHITE] Запрещено хранить / использовать / распространять стороннее программное обеспечение или любые другие средства, позволяющие получить преимущество над другими игроками [/color][Color=red] | Ban 15 - 30 дней / PermBan [/COLOR][/CENTER]<br>" +
        '[CENTER][COLOR=orange]━━━━━━━━━━━━⊱⋆⊰━━━━━━━━━━━━[/CENTER][/COLOR]' +
		'[Color=AQUA][CENTER]Спасибо за Ваше обращение!<br>Приятной игры на NOVOSIBIRSK.[/CENTER][/color]' +
        '[COLOR=GREEN][CENTER]✿❯────「Одобрено ❖ Закрыто」────❮✿[/CENTER][/COLOR]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Реклама сторонних ресурсов',
      content:
		"[CENTER][COLOR=#ff0000]Доброго времени суток уважаемый {{ user.name }} [/COLOR][/CENTER]<br><br>"+
        '[CENTER][COLOR=violet]━━━━━━━━━━━━⊱⋆⊰━━━━━━━━━━━━[/CENTER][/COLOR]' +
        "[CENTER][COLOR=#FFFF00]Игрок будет наказан по данному пункту правил:[/CENTER][/COLOR]"+
        "[CENTER][COLOR=RED] 2.31. [/COLOR][COLOR=WHITE] Запрещено рекламировать на серверах любые проекты, серверы, сайты, сторонние Discord-серверы, YouTube каналы и тому подобное [/color][Color=red] | Ban 7 дней / PermBan [/COLOR][/CENTER]<br>" +
        '[CENTER][COLOR=violet]━━━━━━━━━━━━⊱⋆⊰━━━━━━━━━━━━[/CENTER][/COLOR]' +
		'[Color=AQUA][CENTER]Спасибо за Ваше обращение!<br>Приятной игры на NOVOSIBIRSK.[/CENTER][/color]' +
        '[COLOR=GREEN][CENTER]✿❯────「Одобрено ❖ Закрыто」────❮✿[/CENTER][/COLOR]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Ввод в заблуждение',
      content:
		"[CENTER][COLOR=#ff0000]Доброго времени суток уважаемый {{ user.name }} [/COLOR][/CENTER]<br><br>"+
        '[CENTER][COLOR=violet]━━━━━━━━━━━━⊱⋆⊰━━━━━━━━━━━━[/CENTER][/COLOR]' +
        "[CENTER][COLOR=#FFFF00]Игрок будет наказан по данному пункту правил:[/CENTER][/COLOR]"+
        "[CENTER][COLOR=RED] 2.32. [/COLOR][COLOR=WHITE] Запрещено введение в заблуждение, обман, оскорбление, неконструктивная критика администрации на всех ресурсах проекта [/color][Color=red] | Ban 7 - 15 дней / PermBan [/COLOR][/CENTER]<br>" +
        '[CENTER][COLOR=violet]━━━━━━━━━━━━⊱⋆⊰━━━━━━━━━━━━[/CENTER][/COLOR]' +
		'[Color=AQUA][CENTER]Спасибо за Ваше обращение!<br>Приятной игры на NOVOSIBIRSK.[/CENTER][/color]' +
        '[COLOR=GREEN][CENTER]✿❯────「Одобрено ❖ Закрыто」────❮✿[/CENTER][/COLOR]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'IC и OCC угрозы',
      content:
		"[CENTER][COLOR=#ff0000]Доброго времени суток уважаемый {{ user.name }} [/COLOR][/CENTER]<br><br>"+
        '[CENTER][COLOR=violet]━━━━━━━━━━━━⊱⋆⊰━━━━━━━━━━━━[/CENTER][/COLOR]' +
        "[CENTER][COLOR=#FFFF00]Игрок будет наказан по данному пункту правил: [/CENTER][/COLOR]"+
        "[CENTER][COLOR=RED] 2.35. [/COLOR][COLOR=WHITE] На игровых серверах запрещено устраивать IC и OOC конфликты на почве разногласия о национальности и / или религии совершенно в любом формате [/color][Color=red] | Mute 120 минут / Ban 7 дней [/COLOR][/CENTER]<br>" +
        '[CENTER][COLOR=violet]━━━━━━━━━━━━⊱⋆⊰━━━━━━━━━━━━[/CENTER][/COLOR]' +
		'[Color=AQUA][CENTER]Спасибо за Ваше обращение!<br>Приятной игры на NOVOSIBIRSK.[/CENTER][/color]' +
        '[COLOR=GREEN][CENTER]✿❯────「Одобрено ❖ Закрыто」────❮✿[/CENTER][/COLOR]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Уход от наказания',
      content:
		"[CENTER][COLOR=#ff0000]Доброго времени суток уважаемый {{ user.name }} [/COLOR][/CENTER]<br><br>"+
        '[CENTER][COLOR=violet]━━━━━━━━━━━━⊱⋆⊰━━━━━━━━━━━━[/CENTER][/COLOR]' +
        "[CENTER][COLOR=#FFFF00]Игрок будет наказан по данному пункту правил:[/CENTER][/COLOR]"+
        "[CENTER][COLOR=RED] 2.34. [/COLOR][COLOR=WHITE] Запрещен уход от наказания [/color][Color=red] | Ban 15 - 30 дней (суммируется к общему наказанию дополнительно) [/COLOR][/CENTER]<br>" +
        '[CENTER][COLOR=violet]━━━━━━━━━━━━⊱⋆⊰━━━━━━━━━━━━[/CENTER][/COLOR]' +
		'[Color=AQUA][CENTER]Спасибо за Ваше обращение!<br>Приятной игры на NOVOSIBIRSK.[/CENTER][/color]' +
        '[COLOR=GREEN][CENTER]✿❯────「Одобрено ❖ Закрыто」────❮✿[/CENTER][/COLOR]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
     {
      title: 'Угрозы OOC',
      content:
		"[CENTER][COLOR=#ff0000]Доброго времени суток уважаемый {{ user.name }} [/COLOR][/CENTER]<br><br>"+
        '[CENTER][COLOR=violet]━━━━━━━━━━━━⊱⋆⊰━━━━━━━━━━━━[/CENTER][/COLOR]' +
        "[CENTER][COLOR=#FFFF00]Игрок будет наказан по пункту правил:[/CENTER][/COLOR]"+
        "[CENTER][COLOR=RED] 2.37. [/COLOR][COLOR=WHITE] Запрещены OOC угрозы, в том числе и завуалированные [/color][Color=red] | Mute 120 минут / Ban 7 дней [/COLOR][/CENTER]" +
        '[CENTER][COLOR=violet]━━━━━━━━━━━━⊱⋆⊰━━━━━━━━━━━━[/CENTER][/COLOR]' +
        '[Color=AQUA][CENTER]Спасибо за Ваше обращение!<br>Приятной игры на NOVOSIBIRSK.[/CENTER][/color]' +
        '[COLOR=GREEN][CENTER]✿❯────「Одобрено ❖ Закрыто」────❮✿[/CENTER][/COLOR]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Злоуп. наказаниями',
      content:
		"[CENTER][COLOR=#ff0000]Доброго времени суток уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br><br>"+
        '[CENTER][COLOR=violet]━━━━━━━━━━━━⊱⋆⊰━━━━━━━━━━━━[/CENTER][/COLOR]' +
        "[CENTER][COLOR=#FFFF00]Игрок будет наказан по пункту правил:[/CENTER][/COLOR]"+
        "[CENTER][COLOR=RED] 2.39. [/COLOR][COLOR=WHITE] Злоупотребление нарушениями правил сервера [/color][Color=red] | Ban 7 - 30 дней [/COLOR][/CENTER]" +
        '[CENTER][COLOR=violet]━━━━━━━━━━━━⊱⋆⊰━━━━━━━━━━━━[/CENTER][/COLOR]' +
        '[Color=AQUA][CENTER]Спасибо за Ваше обращение!<br>Приятной игры на NOVOSIBIRSK.[/CENTER][/color]' +
        '[COLOR=GREEN][CENTER]✿❯────「Одобрено ❖ Закрыто」────❮✿[/CENTER][/COLOR]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Оск проекта',
      content:
		"[CENTER][COLOR=#ff0000]Доброго времени суток уважаемый {{ user.name }} [/COLOR][/CENTER]<br><br>"+
        '[CENTER][COLOR=violet]━━━━━━━━━━━━⊱⋆⊰━━━━━━━━━━━━[/CENTER][/COLOR]' +
        "[CENTER][COLOR=#FFFF00] Игрок будет наказан по данному пункту правил:[/CENTER][/COLOR]" +
        "[CENTER][COLOR=RED] 2.40. [/COLOR][COLOR=WHITE] Запрещены совершенно любые деструктивные действия по отношению к проекту: неконструктивная критика, призывы покинуть проект, попытки нарушить развитие проекта или любые другие действия, способные привести к помехам в игровом процессе [/color][Color=red] | Mute 300 минут / Ban 30 дней (Ban выдается по согласованию с главным администратором) [/COLOR][/CENTER]<br>" +
        '[CENTER][COLOR=violet]━━━━━━━━━━━━⊱⋆⊰━━━━━━━━━━━━[/CENTER][/COLOR]' +
		'[Color=AQUA][CENTER] Спасибо за Ваше обращение!<br>Приятной игры на NOVOSIBIRSK.[/CENTER][/color]' +
        '[COLOR=GREEN][CENTER]✿❯────「Одобрено ❖ Закрыто」────❮✿[/CENTER][/COLOR]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Продажа промо',
      content:
		"[CENTER][COLOR=#ff0000]Доброго времени суток уважаемый {{ user.name }} [/COLOR][/CENTER]<br><br>"+
        '[CENTER][COLOR=violet]━━━━━━━━━━━━⊱⋆⊰━━━━━━━━━━━━[/CENTER][/COLOR]' +
        "[CENTER][COLOR=#FFFF00]Игрок будет наказан по данному пункту правил: [/CENTER][/COLOR]"+
        "[CENTER][COLOR=RED] 2.43. [/COLOR][COLOR=WHITE] Запрещена продажа / обмен / покупка поощрительной составляющей от лица проекта, будь то бонус-код, либо промокод, который выдается безвозмездно игрокам в целях промоакций [/color][Color=red] | Mute 120 минут [/COLOR][/CENTER]<br>" +
        '[CENTER][COLOR=violet]━━━━━━━━━━━━⊱⋆⊰━━━━━━━━━━━━[/CENTER][/COLOR]' +
		'[Color=AQUA][CENTER]Спасибо за Ваше обращение!<br>Приятной игры на NOVOSIBIRSK.[/CENTER][/color]' +
        '[COLOR=GREEN][CENTER]✿❯────「Одобрено ❖ Закрыто」────❮✿[/CENTER][/COLOR]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Помеха РП процессу',
      content:
		"[CENTER][COLOR=#ff0000]Доброго времени суток уважаемый {{ user.name }} [/COLOR][/CENTER]<br><br>"+
        '[CENTER][COLOR=violet]━━━━━━━━━━━━⊱⋆⊰━━━━━━━━━━━━[/CENTER][/COLOR]' +
        "[CENTER][COLOR=#FFFF00]Игрок будет наказан по данному пункту правил: [/CENTER][/COLOR]" +
        "[CENTER][COLOR=RED] 2.04. [/COLOR][COLOR=WHITE] Запрещено вмешательство в Role Play процесс с целью помехи и препятствования дальнейшего развития Role Play процесса [/color][Color=red] | Ban - 10 дней [/COLOR][/CENTER]<br>" +
        '[CENTER][COLOR=violet]━━━━━━━━━━━━⊱⋆⊰━━━━━━━━━━━━[/CENTER][/COLOR]' +
		'[Color=AQUA][CENTER]Спасибо за Ваше обращение!<br>Приятной игры на NOVOSIBIRSK.[/CENTER][/color]' +
        '[COLOR=GREEN][CENTER]✿❯────「Одобрено ❖ Закрыто」────❮✿[/CENTER][/COLOR]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Нонрп акс',
      content:
		"[CENTER][COLOR=#ff0000]Доброго времени суток уважаемый {{ user.name }} [/COLOR][/CENTER]<br><br>"+
        '[CENTER][COLOR=violet]━━━━━━━━━━━━⊱⋆⊰━━━━━━━━━━━━[/CENTER][/COLOR]' +
        "[CENTER][COLOR=#FFFF00]Игрок будет наказан по данному пункту правил:[/CENTER][/COLOR]"+
        "[CENTER][COLOR=RED] 2.52. [/COLOR][COLOR=WHITE] Запрещено располагать аксессуары на теле персонажа, нарушая нормы морали и этики, увеличивать аксессуары до слишком большого размера. [/color][Color=red] | При первом нарушении - обнуление аксессуаров, при повторном нарушении - обнуление аксессуаров + JAIL 30 минут [/COLOR][/CENTER]<br>" +
        '[CENTER][COLOR=violet]━━━━━━━━━━━━⊱⋆⊰━━━━━━━━━━━━[/CENTER][/COLOR]' +
		'[Color=AQUA][CENTER]Спасибо за Ваше обращение!<br>Приятной игры на NOVOSIBIRSK.[/CENTER][/color]' +
        '[COLOR=GREEN][CENTER]✿❯────「Одобрено ❖ Закрыто」────❮✿[/CENTER][/COLOR]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Неув обр. к адм',
      content:
		"[CENTER][COLOR=#ff0000]Доброго времени суток уважаемый {{ user.name }} [/COLOR][/CENTER]<br><br>"+
        '[CENTER][COLOR=violet]━━━━━━━━━━━━⊱⋆⊰━━━━━━━━━━━━[/CENTER][/COLOR]' +
        "[CENTER][COLOR=#FFFF00]Игрок будет наказан по данному пункту правил:[/CENTER][/COLOR]"+
        "[CENTER][COLOR=RED] 2.54. [/COLOR][COLOR=WHITE] Запрещено неуважительное обращение, неадекватное поведение, угрозы в любом их проявлении по отношению к администрации [/color][Color=red] | Mute 180 минут [/COLOR][/CENTER]<br>" +
        '[CENTER][COLOR=violet]━━━━━━━━━━━━⊱⋆⊰━━━━━━━━━━━━[/CENTER][/COLOR]' +
		'[Color=AQUA][CENTER]Спасибо за Ваше обращение!<br>Приятной игры на NOVOSIBIRSK.[/CENTER][/color]' +
        '[COLOR=GREEN][CENTER]✿❯────「Одобрено ❖ Закрыто」────❮✿[/CENTER][/COLOR]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Баг аним',
      content:
		"[CENTER][COLOR=#ff0000]Доброго времени суток уважаемый {{ user.name }} [/COLOR][/CENTER]<br><br>"+
        '[CENTER][COLOR=violet]━━━━━━━━━━━━⊱⋆⊰━━━━━━━━━━━━[/CENTER][/COLOR]' +
        "[CENTER][COLOR=#FFFF00]Игрок будет наказан по данному пункту правил:[/CENTER][/COLOR]"+
        "[CENTER][COLOR=RED] 2.55. [/COLOR][COLOR=WHITE] Запрещается багоюз связанный с анимацией в любых проявлениях. [/color][Color=red] | Jail 60 / 120 минут Пример: если игрок, используя баг, убирает ограничение на использование оружия в зеленой зоне, сбивает темп стрельбы, либо быстро перемещается во время войны за бизнес или во время перестрелки на мероприятии с семейными контейнерами, последует наказание в виде Jail на 120 минут. Данное наказание используется в случаях, когда, используя ошибку, было получено преимущество перед другими игроками. Пример: если игрок использует баги, связанные с анимацией, и при этом не влияет на игровой процесс других игроков, а также не получает преимущество перед другими игроками, последует наказание в виде Jail на 60 минут [/COLOR][/CENTER]<br>" +
        '[CENTER][COLOR=violet]━━━━━━━━━━━━⊱⋆⊰━━━━━━━━━━━━[/CENTER][/COLOR]' +
		'[Color=AQUA][CENTER]Спасибо за Ваше обращение!<br>Приятной игры на NOVOSIBIRSK.[/CENTER][/color]' +
        '[COLOR=GREEN][CENTER]✿❯────「Одобрено ❖ Закрыто」────❮✿[/CENTER][/COLOR]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
     title: '- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - Игровые чаты​ - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -',
    },
    {
      title: 'Транслит',
      content:
		"[CENTER][COLOR=#ff0000]Доброго времени суток уважаемый {{ user.name }} [/COLOR][/CENTER]<br><br>"+
        '[CENTER][COLOR=violet]━━━━━━━━━━━━⊱⋆⊰━━━━━━━━━━━━[/CENTER][/COLOR]' +
        "[CENTER][COLOR=#FFFF00]Игрок будет наказан по данному пункту правил: [/CENTER][/COLOR]"+
        "[CENTER][COLOR=RED] 3.01. [/COLOR][COLOR=WHITE] Общепризнанный язык сервера — русский. Общение в IC чатах во всех Role Play ситуациях обязательно должно проходить исключительно на русском языке [/color][Color=red] | Устное замечание / Mute 30 минут [/COLOR][/CENTER]<br>" +
        '[CENTER][COLOR=violet]━━━━━━━━━━━━⊱⋆⊰━━━━━━━━━━━━[/CENTER][/COLOR]' +
		'[Color=AQUA][CENTER]Спасибо за Ваше обращение!<br>Приятной игры на NOVOSIBIRSK.[/CENTER][/color]' +
        '[COLOR=GREEN][CENTER]✿❯────「Одобрено ❖ Закрыто」────❮✿[/CENTER][/COLOR]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
	  title: 'CapsLock',
	  content:
		"[CENTER][COLOR=#ff0000]Доброго времени суток уважаемый {{ user.name }} [/COLOR][/CENTER]<br><br>"+
        '[CENTER][COLOR=violet]━━━━━━━━━━━━⊱⋆⊰━━━━━━━━━━━━[/CENTER][/COLOR]' +
		"[CENTER][COLOR=#FFFF00]Игрок будет наказан по данному пункту правил: [/CENTER][/COLOR]"+
        "[CENTER][COLOR=RED] 3.02. [/COLOR][COLOR=WHITE] Запрещено использование верхнего регистра (CapsLock) при написании любого текста в любом чате [/color][Color=red] | Mute 30 минут [/COLOR][/CENTER]<br>" +
        '[CENTER][COLOR=violet]━━━━━━━━━━━━⊱⋆⊰━━━━━━━━━━━━[/CENTER][/COLOR]' +
		'[Color=AQUA][CENTER]Спасибо за Ваше обращение!<br>Приятной игры на NOVOSIBIRSK.[/CENTER][/color]' +
        '[COLOR=GREEN][CENTER]✿❯────「Одобрено ❖ Закрыто」────❮✿[/CENTER][/COLOR]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
	},
    {
      title: 'Оск в ООС',
      content:
		"[CENTER][COLOR=#ff0000]Доброго времени суток уважаемый {{ user.name }} [/COLOR][/CENTER]<br><br>"+
        '[CENTER][COLOR=violet]━━━━━━━━━━━━⊱⋆⊰━━━━━━━━━━━━[/CENTER][/COLOR]' +
        "[CENTER][COLOR=#FFFF00]Игрок будет наказан по данному пункту правил: [/CENTER][/COLOR]"+
        "[CENTER][COLOR=RED] 3.03. [/COLOR][COLOR=WHITE] Любые формы оскорблений, издевательств, расизма, дискриминации, религиозной враждебности, сексизма в OOC чате запрещены [/color][Color=red] | Mute 30 минут [/COLOR][/CENTER]<br>" +
        '[CENTER][COLOR=violet]━━━━━━━━━━━━⊱⋆⊰━━━━━━━━━━━━[/CENTER][/COLOR]' +
		'[Color=AQUA][CENTER]Спасибо за Ваше обращение!<br>Приятной игры на NOVOSIBIRSK.[/CENTER][/color]' +
        '[COLOR=GREEN][CENTER]✿❯────「Одобрено ❖ Закрыто」────❮✿[/CENTER][/COLOR]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
            },
    {
      title: 'Оск/Упом родни',
      content:
		"[CENTER][COLOR=#ff0000]Доброго времени суток уважаемый {{ user.name }} [/COLOR][/CENTER]<br><br>"+
        '[CENTER][COLOR=violet]━━━━━━━━━━━━⊱⋆⊰━━━━━━━━━━━━[/CENTER][/COLOR]' +
        "[CENTER][COLOR=#FFFF00]Игрок будет наказан по данному пункту правил:[/CENTER][/COLOR]"+
        "[CENTER][COLOR=RED] 3.04. [/COLOR][COLOR=WHITE] Запрещено оскорбление или косвенное упоминание родных вне зависимости от чата (IC или OOC) [/color][Color=red] | Mute 120 минут / Ban 7 - 15 дней [/COLOR][/CENTER]<br>" +
        '[CENTER][COLOR=violet]━━━━━━━━━━━━⊱⋆⊰━━━━━━━━━━━━[/CENTER][/COLOR]' +
		'[Color=AQUA][CENTER]Спасибо за Ваше обращение!<br>Приятной игры на NOVOSIBIRSK.[/CENTER][/color]' +
        '[COLOR=GREEN][CENTER]✿❯────「Одобрено ❖ Закрыто」────❮✿[/CENTER][/COLOR]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
	  title: 'Флуд',
	  content:
		"[CENTER][COLOR=#ff0000]Доброго времени суток уважаемый {{ user.name }} [/COLOR][/CENTER]<br><br>"+
        '[CENTER][COLOR=violet]━━━━━━━━━━━━⊱⋆⊰━━━━━━━━━━━━[/CENTER][/COLOR]' +
		"[CENTER][COLOR=#FFFF00]Игрок будет наказан по данному пункту правил:[/CENTER][/COLOR]"+
        "[CENTER][COLOR=RED] 3.05. [/COLOR][COLOR=WHITE] Запрещен флуд — 3 и более повторяющихся сообщений от одного и того же игрока [/color][Color=red] | Mute 30 минут [/COLOR][/CENTER]<br>" +
        '[CENTER][COLOR=violet]━━━━━━━━━━━━⊱⋆⊰━━━━━━━━━━━━[/CENTER][/COLOR]' +
		'[Color=AQUA][CENTER]Спасибо за Ваше обращение!<br>Приятной игры на NOVOSIBIRSK.[/CENTER][/color]' +
        '[COLOR=GREEN][CENTER]✿❯────「Одобрено ❖ Закрыто」────❮✿[/CENTER][/COLOR]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
	},
    {
      title: 'Злоуп. знаками',
      content:
		"[CENTER][COLOR=#ff0000]Доброго времени суток уважаемый {{ user.name }} [/COLOR][/CENTER]<br><br>"+
        '[CENTER][COLOR=violet]━━━━━━━━━━━━⊱⋆⊰━━━━━━━━━━━━[/CENTER][/COLOR]' +
        "[CENTER][COLOR=#FFFF00]Игрок будет наказан по данному пункту правил: [/CENTER][/COLOR]"+
        "[CENTER][COLOR=RED] 3.06. [/COLOR][COLOR=WHITE] Запрещено злоупотребление знаков препинания и прочих символов [/color][Color=red] | Mute 30 минут [/COLOR][/CENTER]<br>" +
        '[CENTER][COLOR=violet]━━━━━━━━━━━━⊱⋆⊰━━━━━━━━━━━━[/CENTER][/COLOR]' +
		'[Color=AQUA][CENTER]Спасибо за Ваше обращение!<br>Приятной игры на NOVOSIBIRSK.[/CENTER][/color]' +
        '[COLOR=GREEN][CENTER]✿❯────「Одобрено ❖ Закрыто」────❮✿[/CENTER][/COLOR]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Оскорбление',
      content:
		"[CENTER][COLOR=#ff0000]Доброго времени суток уважаемый {{ user.name }} [/COLOR][/CENTER]<br><br>"+
        '[CENTER][COLOR=violet]━━━━━━━━━━━━⊱⋆⊰━━━━━━━━━━━━[/CENTER][/COLOR]' +
        "[CENTER][COLOR=#FFFF00]Игрок будет наказан по данному пункту правил:[/CENTER][/COLOR]"+
        "[CENTER][COLOR=RED] 3.07. [/COLOR][COLOR=WHITE] Запрещены совершенно любые оскорбления или действия, порочащие честь и достоинства, несущие в себе подтекст сексуального характера вне зависимости от чата [/color][Color=red] | Mute 30 минут [/COLOR][/CENTER]<br>" +
        '[CENTER][COLOR=violet]━━━━━━━━━━━━⊱⋆⊰━━━━━━━━━━━━[/CENTER][/COLOR]' +
		'[Color=AQUA][CENTER]Спасибо за Ваше обращение!<br>Приятной игры на NOVOSIBIRSK.[/CENTER][/color]' +
        '[COLOR=GREEN][CENTER]✿❯────「Одобрено ❖ Закрыто」────❮✿[/CENTER][/COLOR]',
 
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Слив СМИ',
      content:
		"[CENTER][COLOR=#ff0000]Доброго времени суток уважаемый {{ user.name }} [/COLOR][/CENTER]<br><br>"+
        '[CENTER][COLOR=violet]━━━━━━━━━━━━⊱⋆⊰━━━━━━━━━━━━[/CENTER][/COLOR]' +
        "[CENTER][COLOR=#FFFF00]Игрок будет наказан по данному пункту правил:[/CENTER][/COLOR]"+
        "[CENTER][COLOR=RED] 3.08. [/COLOR][COLOR=WHITE] Запрещены любые формы «слива» посредством использования глобальных чатов [/color][Color=red] | PermBan [/COLOR][/CENTER]<br>" +
        '[CENTER][COLOR=violet]━━━━━━━━━━━━⊱⋆⊰━━━━━━━━━━━━[/CENTER][/COLOR]' +
		'[Color=AQUA][CENTER]Спасибо за Ваше обращение!<br>Приятной игры на NOVOSIBIRSK.[/CENTER][/color]' +
        '[COLOR=GREEN][CENTER]✿❯────「Одобрено ❖ Закрыто」────❮✿[/CENTER][/COLOR]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Угрозы о наказании со стороны адм',
      content:
		"[CENTER][COLOR=#ff0000]Доброго времени суток уважаемый {{ user.name }} [/COLOR][/CENTER]<br><br>"+
        '[CENTER][COLOR=violet]━━━━━━━━━━━━⊱⋆⊰━━━━━━━━━━━━[/CENTER][/COLOR]' +
        "[CENTER][COLOR=#FFFF00]Игрок будет наказан по пункту правил: [/CENTER][/COLOR]"+
        "[CENTER][COLOR=RED] 3.09. [/COLOR][COLOR=WHITE]  Запрещены любые угрозы о наказании игрока со стороны администрации [/color][Color=red] | Mute 30 минут [/COLOR][/CENTER]<br>" +
        '[CENTER][COLOR=violet]━━━━━━━━━━━━⊱⋆⊰━━━━━━━━━━━━[/CENTER][/COLOR]' +
		'[Color=AQUA][CENTER]Спасибо за Ваше обращение!<br>Приятной игры на NOVOSIBIRSK.[/CENTER][/color]' +
        '[COLOR=GREEN][CENTER]✿❯────「Одобрено ❖ Закрыто」────❮✿[/CENTER][/COLOR]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
        {
      title: 'Выдача себя за адм ',
      content:
		"[CENTER][COLOR=#ff0000]Доброго времени суток уважаемый {{ user.name }} [/COLOR][/CENTER]<br><br>"+
        '[CENTER][COLOR=violet]━━━━━━━━━━━━⊱⋆⊰━━━━━━━━━━━━[/CENTER][/COLOR]' +
        "[CENTER][COLOR=#FFFF00]Игрок будет наказан по данному пункту правил: [/CENTER][/COLOR]"+
        "[CENTER][COLOR=RED] 3.10. [/COLOR][COLOR=WHITE]  Запрещена выдача себя за администратора, если таковым не являетесь [/color][Color=red] | Ban 7 - 15 + ЧС администрации [/COLOR][/CENTER]<br>" +
        '[CENTER][COLOR=violet]━━━━━━━━━━━━⊱⋆⊰━━━━━━━━━━━━[/CENTER][/COLOR]' +
		'[Color=AQUA][CENTER]Спасибо за Ваше обращение!<br>Приятной игры на NOVOSIBIRSK.[/CENTER][/color]' +
        '[COLOR=GREEN][CENTER]✿❯────「Одобрено ❖ Закрыто」────❮✿[/CENTER][/COLOR]',
 
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Ввод в заблуждение',
      content:
		"[CENTER][COLOR=#ff0000]Доброго времени суток уважаемый {{ user.name }} [/COLOR][/CENTER]<br><br>"+
        '[CENTER][COLOR=violet]━━━━━━━━━━━━⊱⋆⊰━━━━━━━━━━━━[/CENTER][/COLOR]' +
        "[CENTER][COLOR=#FFFF00]Игрок будет наказан по данному пункту правил: [/CENTER][/COLOR]"+
        "[CENTER][COLOR=RED] 3.11. [/COLOR][COLOR=WHITE] Запрещено введение игроков проекта в заблуждение путем злоупотребления командами [/color][Color=red] | Ban 15 - 30 дней / PermBan [/COLOR][/CENTER]<br>" +
        '[CENTER][COLOR=violet]━━━━━━━━━━━━⊱⋆⊰━━━━━━━━━━━━[/CENTER][/COLOR]' +
		'[Color=AQUA][CENTER]Спасибо за Ваше обращение!<br>Приятной игры на NOVOSIBIRSK.[/CENTER][/color]' +
        '[COLOR=GREEN][CENTER]✿❯────「Одобрено ❖ Закрыто」────❮✿[/CENTER][/COLOR]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
     {
      title: 'Музыка в войс',
      content:
		"[CENTER][COLOR=#ff0000]Доброго времени суток уважаемый {{ user.name }} [/COLOR][/CENTER]<br><br>"+
        '[CENTER][COLOR=violet]━━━━━━━━━━━━⊱⋆⊰━━━━━━━━━━━━[/CENTER][/COLOR]' +
        "[CENTER][COLOR=#FFFF00]Игрок будет наказан по данному пункту правил:[/CENTER][/COLOR]"+
        "[CENTER][COLOR=RED] 3.14. [/COLOR][COLOR=WHITE] Запрещено включать музыку в Voice Chat [/color][Color=red] | Mute 60 минут [/COLOR][/CENTER]<br>" +
        '[CENTER][COLOR=violet]━━━━━━━━━━━━⊱⋆⊰━━━━━━━━━━━━[/CENTER][/COLOR]' +
		'[Color=AQUA][CENTER]Спасибо за Ваше обращение!<br>Приятной игры на NOVOSIBIRSK.[/CENTER][/color]' +
        '[COLOR=GREEN][CENTER]✿❯────「Одобрено ❖ Закрыто」────❮✿[/CENTER][/COLOR]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Оск/Упом род в войс',
      content:
		"[CENTER][COLOR=#ff0000]Доброго времени суток уважаемый {{ user.name }} [/COLOR][/CENTER]<br><br>"+
        '[CENTER][COLOR=violet]━━━━━━━━━━━━⊱⋆⊰━━━━━━━━━━━━[/CENTER][/COLOR]' +
        "[CENTER][COLOR=#FFFF00]Игрок будет наказан по данному пункту правил:[/CENTER][/COLOR]"+
        "[CENTER][COLOR=RED] 3.15. [/COLOR][COLOR=WHITE] Запрещено оскорблять игроков или родных в Voice Chat [/color][Color=red] | Mute 120 минут / Ban 7 - 15 дней [/COLOR][/CENTER]<br>" +
        '[CENTER][COLOR=violet]━━━━━━━━━━━━⊱⋆⊰━━━━━━━━━━━━[/CENTER][/COLOR]' +
		'[Color=AQUA][CENTER]Спасибо за Ваше обращение!<br>Приятной игры на NOVOSIBIRSK.[/CENTER][/color]' +
        '[COLOR=GREEN][CENTER]✿❯────「Одобрено ❖ Закрыто」────❮✿[/CENTER][/COLOR]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Шум в войс',
      content:
		"[CENTER][COLOR=#ff0000]Доброго времени суток уважаемый {{ user.name }} [/COLOR][/CENTER]<br><br>"+
        '[CENTER][COLOR=violet]━━━━━━━━━━━━⊱⋆⊰━━━━━━━━━━━━[/CENTER][/COLOR]' +
        "[CENTER][COLOR=#FFFF00]Игрок будет наказан по данному пункту правил:[/CENTER][/COLOR]"+
        "[CENTER][COLOR=RED] 3.16. [/COLOR][COLOR=WHITE] Запрещено создавать посторонние шумы или звуки [/color][Color=red] | Mute 30 минут [/COLOR][/CENTER]<br>" +
        '[CENTER][COLOR=violet]━━━━━━━━━━━━⊱⋆⊰━━━━━━━━━━━━[/CENTER][/COLOR]' +
		'[Color=AQUA][CENTER]Спасибо за Ваше обращение!<br>Приятной игры на NOVOSIBIRSK.[/CENTER][/color]' +
        '[COLOR=GREEN][CENTER]✿❯────「Одобрено ❖ Закрыто」────❮✿[/CENTER][/COLOR]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Реклама промо',
      content:
		"[CENTER][COLOR=#ff0000]Доброго времени суток уважаемый {{ user.name }} [/COLOR][/CENTER]<br><br>"+
        '[CENTER][COLOR=violet]━━━━━━━━━━━━⊱⋆⊰━━━━━━━━━━━━[/CENTER][/COLOR]' +
        "[CENTER][COLOR=#FFFF00]Игрок будет наказан по данному пункту правил:[/CENTER][/COLOR]"+
        "[CENTER][COLOR=RED] 3.21. [/COLOR][COLOR=WHITE] Запрещается реклама промокодов в игре, а также их упоминание в любом виде во всех чатах. [/color][Color=red] | Ban 30 дней [/COLOR][/CENTER]<br>" +
        '[CENTER][COLOR=violet]━━━━━━━━━━━━⊱⋆⊰━━━━━━━━━━━━[/CENTER][/COLOR]' +
		'[Color=AQUA][CENTER]Спасибо за Ваше обращение!<br>Приятной игры на NOVOSIBIRSK.[/CENTER][/color]' +
        '[COLOR=GREEN][CENTER]✿❯────「Одобрено ❖ Закрыто」────❮✿[/CENTER][/COLOR]',
 
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Торговля на тт госс',
      content:
		"[CENTER][COLOR=#ff0000]Доброго времени суток уважаемый {{ user.name }} [/COLOR][/CENTER]<br><br>"+
        '[CENTER][COLOR=violet]━━━━━━━━━━━━⊱⋆⊰━━━━━━━━━━━━[/CENTER][/COLOR]' +
        "[CENTER][COLOR=#FFFF00]Игрок будет наказан по данному пункту правил: [/CENTER][/COLOR]"+
        "[CENTER][COLOR=RED] 3.22. [/COLOR][COLOR=WHITE] Запрещено публиковать любые объявления в помещениях государственных организаций вне зависимости от чата (IC или OOC) [/color][Color=red] | Mute 30 минут [/COLOR][/CENTER]<br>" +
        '[CENTER][COLOR=violet]━━━━━━━━━━━━⊱⋆⊰━━━━━━━━━━━━[/CENTER][/COLOR]' +
		'[Color=AQUA][CENTER]Спасибо за Ваше обращение!<br>Приятной игры на NOVOSIBIRSK.[/CENTER][/color]' +
        '[COLOR=GREEN][CENTER]✿❯────「Одобрено ❖ Закрыто」────❮✿[/CENTER][/COLOR]',
 
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Религиозное и политическая пропаганда',
      content:
		"[CENTER][COLOR=#ff0000]Доброго времени суток уважаемый {{ user.name }} [/COLOR][/CENTER]<br><br>"+
        '[CENTER][COLOR=violet]━━━━━━━━━━━━⊱⋆⊰━━━━━━━━━━━━[/CENTER][/COLOR]' +
        "[CENTER][COLOR=#FFFF00]Игрок будет наказан по данному пункту правил:[/CENTER][/COLOR]"+
        "[CENTER][COLOR=RED] 3.18. [/COLOR][COLOR=WHITE] Запрещено политическое и религиозное пропагандирование [/color][Color=red] | Mute 120 минут / Ban 10 дней [/COLOR][/CENTER]<br>" +
        '[CENTER][COLOR=violet]━━━━━━━━━━━━⊱⋆⊰━━━━━━━━━━━━[/CENTER][/COLOR]' +
		'[Color=AQUA][CENTER]Спасибо за Ваше обращение!<br>Приятной игры на NOVOSIBIRSK.[/CENTER][/color]' +
        '[COLOR=GREEN][CENTER]✿❯────「Одобрено ❖ Закрыто」────❮✿[/CENTER][/COLOR]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
     title: '- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - Положение об игровых аккаунтах - - - - - - - - - - - - - - - - - - - - - - - - - - -',
    },
    {
      title: 'Фейк аккаунт',
      content:
		"[CENTER][COLOR=#ff0000]Доброго времени суток уважаемый {{ user.name }} [/COLOR][/CENTER]<br><br>"+
        '[CENTER][COLOR=violet]━━━━━━━━━━━━⊱⋆⊰━━━━━━━━━━━━[/CENTER][/COLOR]' +
        "[CENTER][COLOR=#FFFF00]Игрок будет наказан по данному пункту правил: [/CENTER][/COLOR]"+
        "[CENTER][COLOR=RED] 4.10. [/COLOR][COLOR=WHITE] Запрещено создавать никнейм, повторяющий или похожий на существующие никнеймы игроков или администраторов по их написанию [/color][Color=red] | Устное замечание + смена игрового никнейма / PermBan [/COLOR][/CENTER]<br>" +
        '[CENTER][COLOR=violet]━━━━━━━━━━━━⊱⋆⊰━━━━━━━━━━━━[/CENTER][/COLOR]' +
		'[Color=AQUA][CENTER]Спасибо за Ваше обращение!<br>Приятной игры на NOVOSIBIRSK.[/CENTER][/color]' +
        '[COLOR=GREEN][CENTER]✿❯────「Одобрено ❖ Закрыто」────❮✿[/CENTER][/COLOR]',
 
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
 
    {
     title: '- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - Передачи жалобы - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -',
    },
    {
      title: 'Техническому специалисту',
      content:
		"[CENTER][COLOR=#ff0000]Доброго времени суток уважаемый {{ user.name }} [/COLOR][/CENTER]<br><br>"+
        '[CENTER][COLOR=violet]━━━━━━━━━━━━⊱⋆⊰━━━━━━━━━━━━[/CENTER][/COLOR]' +
        "[CENTER][COLOR=#FFFF00]Ваша жалоба была передана на рассмотрение [/color][Color=red] техническому специалисту.[/COLOR][/CENTER]<br>" +
        '[CENTER][COLOR=violet]━━━━━━━━━━━━⊱⋆⊰━━━━━━━━━━━━[/CENTER][/COLOR]' +
        '[COLOR=Blue][CENTER]「Ожидайте ответа ❖ На рассмотрение」[/CENTER][/COLOR]',
 
 
      prefix: TEXY_PREFIX,
	  status: true,
    },
    {
      title: 'Передано ГА',
      content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[CENTER][COLOR=violet]━━━━━━━━━━━━⊱⋆⊰━━━━━━━━━━━━[/CENTER][/COLOR]' +
        "[CENTER][COLOR=#FFFF00]Ваша жалоба была передана на рассмотрение [/color][Color=red] Главному Администратору. @Kenzo_Fantasy[/COLOR][/CENTER]<br>" +
        '[CENTER][COLOR=violet]━━━━━━━━━━━━⊱⋆⊰━━━━━━━━━━━━[/CENTER][/COLOR]' +
        '[COLOR=Blue][CENTER]「Ожидайте ответа ❖ На рассмотрение」[/CENTER][/COLOR]',
 
 
      prefix: GA_PREFIX,
	  status: true,
    },
    {
      title: 'Передано Главному куратору форума ',
      content:
		"[CENTER][COLOR=#ff0000]Доброго времени суток уважаемый {{ user.name }} [/COLOR][/CENTER]<br><br>"+
        '[CENTER][COLOR=violet]━━━━━━━━━━━━⊱⋆⊰━━━━━━━━━━━━[/CENTER][/COLOR]' +
        "[CENTER][COLOR=#FFFF00]Ваша жалоба была передана на рассмотрение [/color][Color=red] Главному куратору форума. @Alex_Ryan.[/COLOR][/CENTER]<br>" +
        '[CENTER][COLOR=violet]━━━━━━━━━━━━⊱⋆⊰━━━━━━━━━━━━[/CENTER][/COLOR]' +
        '[COLOR=Blue][CENTER]「Ожидайте ответа ❖ На рассмотрение」[/CENTER][/COLOR]',
    },
    {
      title: 'Передано Куратору Администрации ',
      content:
		"[CENTER][COLOR=#ff0000]Доброго времени суток уважаемый {{ user.name }} [/COLOR][/CENTER]<br><br>"+
        '[CENTER][COLOR=violet]━━━━━━━━━━━━⊱⋆⊰━━━━━━━━━━━━[/CENTER][/COLOR]' +
        "[CENTER][COLOR=#FFFF00]Ваша жалоба была передана на рассмотрение [/color][Color=red] Куратору Администрации. @Smoth_Eclipse.[/COLOR][/CENTER]<br>" +
        '[CENTER][COLOR=violet]━━━━━━━━━━━━⊱⋆⊰━━━━━━━━━━━━[/CENTER][/COLOR]' +
        '[COLOR=Blue][CENTER]「Ожидайте ответа ❖ На рассмотрение」[/CENTER][/COLOR]',
    },
    {
      title: 'Передано Зам. ГА',
      content:
		"[CENTER][COLOR=#ff0000]Доброго времени суток уважаемый {{ user.name }} [/COLOR][/CENTER]<br><br>"+
        '[CENTER][COLOR=violet]━━━━━━━━━━━━⊱⋆⊰━━━━━━━━━━━━[/CENTER][/COLOR]' +
        "[CENTER][COLOR=#FFFF00]Ваша жалоба была передана на рассмотрение [/color][Color=red] Заместителю Главного Администратора. @Jack_Winstoned.[/COLOR][/CENTER]<br>" +
        '[CENTER][COLOR=violet]━━━━━━━━━━━━⊱⋆⊰━━━━━━━━━━━━[/CENTER][/COLOR]' +
        '[COLOR=Blue][CENTER]「Ожидайте ответа ❖ На рассмотрение」[/CENTER][/COLOR]',
    },
    {
      title: 'Передано Зам. Главного куратора форума',
      content:
		"[CENTER][COLOR=#ff0000]Доброго времени суток уважаемый {{ user.name }} [/COLOR][/CENTER]<br><br>"+
        '[CENTER][COLOR=violet]━━━━━━━━━━━━⊱⋆⊰━━━━━━━━━━━━[/CENTER][/COLOR]' +
        "[CENTER][COLOR=#FFFF00]Ваша жалоба была передана на рассмотрение [/color][Color=red] Зам. Главного куратора форума. @Nekit_Regis[/COLOR][/CENTER]<br>" +
        '[CENTER][COLOR=violet]━━━━━━━━━━━━⊱⋆⊰━━━━━━━━━━━━[/CENTER][/COLOR]' +
		'[COLOR=Blue][CENTER]「Ожидайте ответа ❖ На рассмотрение」[/CENTER][/COLOR]',
    },
    {
     title: '- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - Правила Гос.Структур - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - ',
    },
    {
      title: 'Исп. фрак т/с в личных целях',
      content:
		"[CENTER][COLOR=#ff0000]Доброго времени суток уважаемый {{ user.name }} [/COLOR][/CENTER]<br><br>"+
        '[CENTER][COLOR=violet]━━━━━━━━━━━━⊱⋆⊰━━━━━━━━━━━━[/CENTER][/COLOR]' +
        "[CENTER][COLOR=#FFFF00]Игрок будет наказан по пунтку правил: [/CENTER][/COLOR]"+
        "[CENTER][COLOR=RED] 1.08. [/COLOR][COLOR=WHITE] Запрещено использование фракционного транспорта в личных целях [/color][Color=red] | Jail 30 минут.[/COLOR][/CENTER]<br>" +
        '[CENTER][COLOR=violet]━━━━━━━━━━━━⊱⋆⊰━━━━━━━━━━━━[/CENTER][/COLOR]' +
		'[Color=AQUA][CENTER]Спасибо за Ваше обращение!<br>Приятной игры на NOVOSIBIRSK.[/CENTER][/color]' +
        '[COLOR=GREEN][CENTER]✿❯────「Одобрено ❖ Закрыто」────❮✿[/CENTER][/COLOR]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'ДМ/Масс дм от МО',
      content:
		"[CENTER][COLOR=#ff0000]Доброго времени суток уважаемый {{ user.name }} [/COLOR][/CENTER]<br><br>"+
        '[CENTER][COLOR=violet]━━━━━━━━━━━━⊱⋆⊰━━━━━━━━━━━━[/CENTER][/COLOR]' +
        "[CENTER][COLOR=#FFFF00]Игрок будет наказан по пунтку правил: [/CENTER][/COLOR]"+
        "[CENTER][COLOR=RED] 2.02. [/COLOR][COLOR=WHITE] Наносить урон игрокам, которые находятся вне территории воинской части, запрещено [/color][Color=red] | Jail 30 минут / Warn.[/COLOR][/CENTER]<br>" +
        '[CENTER][COLOR=violet]━━━━━━━━━━━━⊱⋆⊰━━━━━━━━━━━━[/CENTER][/COLOR]' +
		'[Color=AQUA][CENTER]Спасибо за Ваше обращение!<br>Приятной игры на NOVOSIBIRSK.[/CENTER][/color]' +
        '[COLOR=GREEN][CENTER]✿❯────「Одобрено ❖ Закрыто」────❮✿[/CENTER][/COLOR]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Н/П/Р/О (Объявы)',
      content:
		"[CENTER][COLOR=#ff0000]Доброго времени суток уважаемый {{ user.name }} [/COLOR][/CENTER]<br><br>"+
        '[CENTER][COLOR=violet]━━━━━━━━━━━━⊱⋆⊰━━━━━━━━━━━━[/CENTER][/COLOR]' +
        "[CENTER][COLOR=#FFFF00]Игрок будет наказан по пунтку правил: [/CENTER][/COLOR]"+
        "[CENTER][COLOR=RED] 4.01. [/COLOR][COLOR=WHITE]Запрещено редактирование объявлений, не соответствующих ПРО [/color][Color=red] | Mute 30 минут.[/COLOR][/CENTER]<br>" +
        '[CENTER][COLOR=violet]━━━━━━━━━━━━⊱⋆⊰━━━━━━━━━━━━[/CENTER][/COLOR]' +
		'[Color=AQUA][CENTER]Спасибо за Ваше обращение!<br>Приятной игры на NOVOSIBIRSK.[/CENTER][/color]' +
        '[COLOR=GREEN][CENTER]✿❯────「Одобрено ❖ Закрыто」────❮✿[/CENTER][/COLOR]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Н/П/П/Э (Эфиры)',
      content:
		"[CENTER][COLOR=#ff0000]Доброго времени суток уважаемый {{ user.name }} [/COLOR][/CENTER]<br><br>"+
        '[CENTER][COLOR=violet]━━━━━━━━━━━━⊱⋆⊰━━━━━━━━━━━━[/CENTER][/COLOR]' +
        "[CENTER][COLOR=#FFFF00]Игрок будет наказан по пунтку правил: [/CENTER][/COLOR]"+
        "[CENTER][COLOR=RED] 4.02. [/COLOR][COLOR=WHITE]Запрещено проведение эфиров, не соответствующих Role Play правилам и логике [/color][Color=red] | Mute 30 минут [/COLOR][/CENTER]<br>" +
        '[CENTER][COLOR=violet]━━━━━━━━━━━━⊱⋆⊰━━━━━━━━━━━━[/CENTER][/COLOR]' +
		'[Color=AQUA][CENTER]Спасибо за Ваше обращение!<br>Приятной игры на NOVOSIBIRSK.[/CENTER][/color]' +
        '[COLOR=GREEN][CENTER]✿❯────「Одобрено ❖ Закрыто」────❮✿[/CENTER][/COLOR]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'ДМ/Масс от УМВД',
      content:
		"[CENTER][COLOR=#ff0000]Доброго времени суток уважаемый {{ user.name }} [/COLOR][/CENTER]<br><br>"+
        '[CENTER][COLOR=violet]━━━━━━━━━━━━⊱⋆⊰━━━━━━━━━━━━[/CENTER][/COLOR]' +
        "[CENTER][COLOR=#FFFF00]Игрок будет наказан по пунтку правил: [/CENTER][/COLOR]"+
        "[CENTER][COLOR=RED] 6.01. [/COLOR][COLOR=WHITE]Запрещено наносить урон игрокам без Role Play причины на территории УМВД [/color][Color=red] | Jail 30 минут / Warn.[/COLOR][/CENTER]<br>" +
        '[CENTER][COLOR=violet]━━━━━━━━━━━━⊱⋆⊰━━━━━━━━━━━━[/CENTER][/COLOR]' +
		'[Color=AQUA][CENTER]Спасибо за Ваше обращение!<br>Приятной игры на NOVOSIBIRSK.[/CENTER][/color]' +
        '[COLOR=GREEN][CENTER]✿❯────「Одобрено ❖ Закрыто」────❮✿[/CENTER][/COLOR]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Розыск без причины(УМВД)',
      content:
		"[CENTER][COLOR=#ff0000]Доброго времени суток уважаемый {{ user.name }} [/COLOR][/CENTER]<br><br>"+
        '[CENTER][COLOR=violet]━━━━━━━━━━━━⊱⋆⊰━━━━━━━━━━━━[/CENTER][/COLOR]' +
        "[CENTER][COLOR=#FFFF00]Игрок будет наказан по пунтку правил: [/CENTER][/COLOR]"+
        "[CENTER][COLOR=RED] 6.02  [/COLOR][COLOR=WHITE]Запрещено выдавать розыск без Role Play причины [/color][Color=red] | Warn.[/COLOR][/CENTER]<br>" +
        '[CENTER][COLOR=violet]━━━━━━━━━━━━⊱⋆⊰━━━━━━━━━━━━[/CENTER][/COLOR]' +
		'[Color=AQUA][CENTER]Спасибо за Ваше обращение!<br>Приятной игры на NOVOSIBIRSK.[/CENTER][/color]' +
        '[COLOR=GREEN][CENTER]✿❯────「Одобрено ❖ Закрыто」────❮✿[/CENTER][/COLOR]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'nRP поведение (Умвд)',
      content:
		"[CENTER][COLOR=#ff0000]Доброго времени суток уважаемый {{ user.name }} [/COLOR][/CENTER]<br><br>"+
        '[CENTER][COLOR=violet]━━━━━━━━━━━━⊱⋆⊰━━━━━━━━━━━━[/CENTER][/COLOR]' +
        "[CENTER][COLOR=#FFFF00]Игрок будет наказан по пунтку правил: [/CENTER][/COLOR]"+
        "[CENTER][COLOR=RED] 6.03. [/COLOR][COLOR=WHITE]Запрещено nRP поведение [/color][Color=red] | Warn.[/COLOR][/CENTER]<br>" +
        '[CENTER][COLOR=violet]━━━━━━━━━━━━⊱⋆⊰━━━━━━━━━━━━[/CENTER][/COLOR]' +
		'[Color=AQUA][CENTER]Спасибо за Ваше обращение!<br>Приятной игры на NOVOSIBIRSK.[/CENTER][/color]' +
        '[COLOR=GREEN][CENTER]✿❯────「Одобрено ❖ Закрыто」────❮✿[/CENTER][/COLOR]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
 
    },
    {
      title: 'ДМ/Масс от ГИБДД',
      content:
		"[CENTER][COLOR=#ff0000]Доброго времени суток уважаемый {{ user.name }} [/COLOR][/CENTER]<br><br>"+
        '[CENTER][COLOR=violet]━━━━━━━━━━━━⊱⋆⊰━━━━━━━━━━━━[/CENTER][/COLOR]' +
        "[CENTER][COLOR=#FFFF00]Игрок будет наказан по пунтку правил: [/CENTER][/COLOR]"+
        "[CENTER][COLOR=RED] 7.01. [/COLOR][COLOR=WHITE]Запрещено наносить урон игрокам без Role Play причины на территории ГИБДД [/color][Color=red] | Jail 30 минут / Warn.[/COLOR][/CENTER]<br>" +
        '[CENTER][COLOR=violet]━━━━━━━━━━━━⊱⋆⊰━━━━━━━━━━━━[/CENTER][/COLOR]' +
		'[Color=AQUA][CENTER]Спасибо за Ваше обращение!<br>Приятной игры на NOVOSIBIRSK.[/CENTER][/color]' +
        '[COLOR=GREEN][CENTER]✿❯────「Одобрено ❖ Закрыто」────❮✿[/CENTER][/COLOR]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'nRP розыск',
      content:
		"[CENTER][COLOR=#ff0000]Доброго времени суток уважаемый {{ user.name }} [/COLOR][/CENTER]<br><br>"+
        '[CENTER][COLOR=violet]━━━━━━━━━━━━⊱⋆⊰━━━━━━━━━━━━[/CENTER][/COLOR]' +
        "[CENTER][COLOR=#FFFF00]Игрок будет наказан по пунтку правил: [/CENTER][/COLOR]"+
        "[CENTER][COLOR=RED] 7.02. [/COLOR][COLOR=WHITE]Запрещено выдавать розыск, штраф без Role Play причины [/color][Color=red] | Warn.[/COLOR][/CENTER]<br>" +
        '[CENTER][COLOR=violet]━━━━━━━━━━━━⊱⋆⊰━━━━━━━━━━━━[/CENTER][/COLOR]' +
		'[Color=AQUA][CENTER]Спасибо за Ваше обращение!<br>Приятной игры на NOVOSIBIRSK.[/CENTER][/color]' +
        '[COLOR=GREEN][CENTER]✿❯────「Одобрено ❖ Закрыто」────❮✿[/CENTER][/COLOR]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
 
    },
    {
      title: 'Забирание В/У во время погони(ГИБДД)',
      content:
		"[CENTER][COLOR=#ff0000]Доброго времени суток уважаемый {{ user.name }} [/COLOR][/CENTER]<br><br>"+
        '[CENTER][COLOR=violet]━━━━━━━━━━━━⊱⋆⊰━━━━━━━━━━━━[/CENTER][/COLOR]' +
        "[CENTER][COLOR=#FFFF00]Игрок будет наказан по пунтку правил: [/CENTER][/COLOR]"+
        "[CENTER][COLOR=RED] 7.04. [/COLOR][COLOR=WHITE]Запрещено отбирать водительские права во время погони за нарушителем [/color][Color=red] | Warn.[/COLOR][/CENTER]<br>" +
        '[CENTER][COLOR=violet]━━━━━━━━━━━━⊱⋆⊰━━━━━━━━━━━━[/CENTER][/COLOR]' +
		'[Color=AQUA][CENTER]Спасибо за Ваше обращение!<br>Приятной игры на NOVOSIBIRSK.[/CENTER][/color]' +
        '[COLOR=GREEN][CENTER]✿❯────「Одобрено ❖ Закрыто」────❮✿[/CENTER][/COLOR]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'ДМ/Масс от УФСБ',
      content:
		"[CENTER][COLOR=#ff0000]Доброго времени суток уважаемый {{ user.name }} [/COLOR][/CENTER]<br><br>"+
        '[CENTER][COLOR=violet]━━━━━━━━━━━━⊱⋆⊰━━━━━━━━━━━━[/CENTER][/COLOR]' +
        "[CENTER][COLOR=#FFFF00]Игрок будет наказан по пунтку правил: [/CENTER][/COLOR]"+
        "[CENTER][COLOR=RED] 8.01. [/COLOR][COLOR=WHITE]Запрещено наносить урон игрокам без Role Play причины на территории ФСБ [/color][Color=red] | Jail 30 минут / Warn.[/COLOR][/CENTER]<br>" +
        '[CENTER][COLOR=violet]━━━━━━━━━━━━⊱⋆⊰━━━━━━━━━━━━[/CENTER][/COLOR]' +
		'[Color=AQUA][CENTER]Спасибо за Ваше обращение!<br>Приятной игры на NOVOSIBIRSK.[/CENTER][/color]' +
        '[COLOR=GREEN][CENTER]✿❯────「Одобрено ❖ Закрыто」────❮✿[/CENTER][/COLOR]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
 
    },
    {
     title: '- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - Правила ОПГ - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -',
    },
    {
      title: 'Нарушение правил В/Ч',
      content:
		"[CENTER][COLOR=#ff0000]Доброго времени суток уважаемый {{ user.name }} [/COLOR][/CENTER]<br><br>"+
        '[CENTER][COLOR=violet]━━━━━━━━━━━━⊱⋆⊰━━━━━━━━━━━━[/CENTER][/COLOR]' +
        "[CENTER][COLOR=#FFFF00]Игрок будет наказан по пунтку правил:[/CENTER][/COLOR]"+
        "[CENTER][COLOR=WHITE] За нарушение правил нападения на Войсковую Часть выдаётся предупреждение [/color][Color=red] | Jail 30 минут (NonRP нападение) / Warn (Для сотрудников ОПГ).[/COLOR][/CENTER]<br>" +
        '[CENTER][COLOR=violet]━━━━━━━━━━━━⊱⋆⊰━━━━━━━━━━━━[/CENTER][/COLOR]' +
		'[Color=AQUA][CENTER]Спасибо за Ваше обращение!<br>Приятной игры на NOVOSIBIRSK.[/CENTER][/color]' +
        '[COLOR=GREEN][CENTER]✿❯────「Одобрено ❖ Закрыто」────❮✿[/CENTER][/COLOR]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Нападение на В/Ч через стену',
      content:
		"[CENTER][COLOR=#ff0000]Доброго времени суток уважаемый {{ user.name }} [/COLOR][/CENTER]<br><br>"+
        '[CENTER][COLOR=violet]━━━━━━━━━━━━⊱⋆⊰━━━━━━━━━━━━[/CENTER][/COLOR]' +
        "[CENTER][COLOR=WHITE]Нападение на военную часть разрешено только через блокпост КПП с последовательностью взлома [/color][Color=red] | /Warn NonRP В/Ч.[/COLOR][/CENTER]<br>" +
        '[CENTER][COLOR=violet]━━━━━━━━━━━━⊱⋆⊰━━━━━━━━━━━━[/CENTER][/COLOR]' +
		'[Color=AQUA][CENTER]Спасибо за Ваше обращение!<br>Приятной игры на NOVOSIBIRSK.[/CENTER][/color]' +
        '[COLOR=GREEN][CENTER]✿❯────「Одобрено ❖ Закрыто」────❮✿[/CENTER][/COLOR]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Похищение/Ограбления нарушение правил',
      content:
		"[CENTER][COLOR=#ff0000]Доброго времени суток уважаемый {{ user.name }} [/COLOR][/CENTER]<br><br>"+
        '[CENTER][COLOR=violet]━━━━━━━━━━━━⊱⋆⊰━━━━━━━━━━━━[/CENTER][/COLOR]' +
        "[CENTER][COLOR=#FFFF00]Игрок будет наказан за Нонрп Ограбление\Похищениее в соответствии с этими правилами [URL='https://forum.blackrussia.online/index.php?threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BE%D0%B3%D1%80%D0%B0%D0%B1%D0%BB%D0%B5%D0%BD%D0%B8%D0%B9-%D0%B8-%D0%BF%D0%BE%D1%85%D0%B8%D1%89%D0%B5%D0%BD%D0%B8%D0%B9.29/']Click[/URL][/COLOR][/CENTER]<br>" +
        '[CENTER][COLOR=violet]━━━━━━━━━━━━⊱⋆⊰━━━━━━━━━━━━[/CENTER][/COLOR]' +
		'[Color=AQUA][CENTER]Спасибо за Ваше обращение!<br>Приятной игры на NOVOSIBIRSK.[/CENTER][/color]' +
        '[COLOR=GREEN][CENTER]✿❯────「Одобрено ❖ Закрыто」────❮✿[/CENTER][/COLOR]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴Отсутствие пункта жалоб╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
	  title: 'Не все пункты в жалобе заполнены',
	  content:
		"[CENTER][COLOR=#ff0000]Доброго времени суток уважаемый {{ user.name }} [/COLOR][/CENTER]<br><br>"+
        '[CENTER][COLOR=violet]━━━━━━━━━━━━⊱⋆⊰━━━━━━━━━━━━[/CENTER][/COLOR]' +
		"[CENTER][COLOR=#FFFF00]Не все пункты жалобы заполнены.[/COLOR][/CENTER]<br>" +
        '[CENTER][COLOR=violet]━━━━━━━━━━━━⊱⋆⊰━━━━━━━━━━━━[/CENTER][/COLOR]' +
        '[Color=AQUA][CENTER]Приятной игры на NOVOSIBIRSK.[/CENTER][/color]' +
        '[COLOR=RED][CENTER]✿❯────「Отказано ❖ Закрыто」────❮✿[/CENTER][/COLOR]',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
	  title: 'Нарушений не найдено',
	  content:
		"[CENTER][COLOR=#ff0000]Доброго времени суток уважаемый {{ user.name }} [/COLOR][/CENTER]<br><br>"+
        '[CENTER][COLOR=violet]━━━━━━━━━━━━⊱⋆⊰━━━━━━━━━━━━[/CENTER][/COLOR]' +
		"[CENTER][COLOR=#FFFF00]Нарушений со стороны данного игрока не было найдено.[/COLOR][/CENTER]<br>" +
        '[CENTER][COLOR=violet]━━━━━━━━━━━━⊱⋆⊰━━━━━━━━━━━━[/CENTER][/COLOR]' +
        '[Color=AQUA][CENTER]Приятной игры на NOVOSIBIRSK.[/CENTER][/color]' +
        '[COLOR=RED][CENTER]✿❯────「Отказано ❖ Закрыто」────❮✿[/CENTER][/COLOR]',
 
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
	  title: 'Ответ дан в прошлой ЖБ',
	  content:
		"[CENTER][COLOR=#ff0000]Доброго времени суток уважаемый {{ user.name }} [/COLOR][/CENTER]<br><br>"+
        '[CENTER][COLOR=violet]━━━━━━━━━━━━⊱⋆⊰━━━━━━━━━━━━[/CENTER][/COLOR]' +
		"[CENTER][COLOR=#FFFF00]Ответ был дан в прошлой жалобе.[/COLOR][/CENTER]<br>" +
        '[CENTER][COLOR=violet]━━━━━━━━━━━━⊱⋆⊰━━━━━━━━━━━━[/CENTER][/COLOR]' +
        '[Color=AQUA][CENTER]Приятной игры на NOVOSIBIRSK.[/CENTER][/color]' +
        '[COLOR=RED][CENTER]✿❯────「Отказано ❖ Закрыто」────❮✿[/CENTER][/COLOR]',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Недостаточно доказательств',
      content:
		"[CENTER][COLOR=#ff0000]Доброго времени суток уважаемый {{ user.name }} [/COLOR][/CENTER]<br><br>"+
        '[CENTER][COLOR=violet]━━━━━━━━━━━━⊱⋆⊰━━━━━━━━━━━━[/CENTER][/COLOR]' +
        "[CENTER][COLOR=#FFFF00]Недостаточно доказательств на нарушение от данного игрока.<br>Доказательства должны быть предоставлены в хорошем качестве и с полным процессом сделки или нарушения от какого-либо игрока.[/COLOR][/CENTER]<br>" +
        '[CENTER][COLOR=violet]━━━━━━━━━━━━⊱⋆⊰━━━━━━━━━━━━[/CENTER][/COLOR]' +
        '[Color=AQUA][CENTER]Приятной игры на NOVOSIBIRSK.[/CENTER][/color]' +
        '[COLOR=RED][CENTER]✿❯────「Отказано ❖ Закрыто」────❮✿[/CENTER][/COLOR]',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Дублирование темы',
      content:
		"[CENTER][COLOR=#ff0000]Доброго времени суток уважаемый {{ user.name }} [/COLOR][/CENTER]<br><br>"+
        '[CENTER][COLOR=violet]━━━━━━━━━━━━⊱⋆⊰━━━━━━━━━━━━[/CENTER][/COLOR]' +
        "[CENTER][COLOR=#FFFF00]Дублирование темы.<br>Если вы дальше будете заниматься данной деятельностью (дублированием тем), то ваш форумный аккаунт будет заблокирован на 3 дня и более.[/COLOR][/CENTER]<br>" +
        '[CENTER][COLOR=violet]━━━━━━━━━━━━⊱⋆⊰━━━━━━━━━━━━[/CENTER][/COLOR]' +
        '[Color=AQUA][CENTER]Приятной игры на NOVOSIBIRSK.[/CENTER][/color]' +
        '[COLOR=RED][CENTER]✿❯────「Отказано ❖ Закрыто」────❮✿[/CENTER][/COLOR]',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'В жалобы на адм',
      content:
		"[CENTER][COLOR=#ff0000]Доброго времени суток уважаемый {{ user.name }} [/COLOR][/CENTER]<br><br>"+
        '[CENTER][COLOR=violet]━━━━━━━━━━━━⊱⋆⊰━━━━━━━━━━━━[/CENTER][/COLOR]' +
        "[CENTER][COLOR=#FFFF00]Вы ошиблись разделом.<br>Обратитесь в раздел [URL='https://forum.blackrussia.online/index.php?forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B0%D0%B4%D0%BC%D0%B8%D0%BD%D0%B8%D1%81%D1%82%D1%80%D0%B0%D1%86%D0%B8%D1%8E.1570/']Жалобы на администрацию[/URL].[/COLOR][/CENTER]<br>" +
        '[CENTER][COLOR=violet]━━━━━━━━━━━━⊱⋆⊰━━━━━━━━━━━━[/CENTER][/COLOR]' +
        '[Color=AQUA][CENTER]Приятной игры на NOVOSIBIRSK.[/CENTER][/color]' +
        '[COLOR=RED][CENTER]✿❯────「Отказано ❖ Закрыто」────❮✿[/CENTER][/COLOR]',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'В обжалования',
      content:
		"[CENTER][COLOR=#ff0000]Доброго времени суток уважаемый {{ user.name }} [/COLOR][/CENTER]<br><br>"+
        '[CENTER][COLOR=violet]━━━━━━━━━━━━⊱⋆⊰━━━━━━━━━━━━[/CENTER][/COLOR]' +
        "[CENTER][COLOR=#FFFF00]Вы ошиблись разделом.<br>Обратитесь в раздел [URL='https://forum.blackrussia.online/index.php?forums/%D0%9E%D0%B1%D0%B6%D0%B0%D0%BB%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D0%B5-%D0%BD%D0%B0%D0%BA%D0%B0%D0%B7%D0%B0%D0%BD%D0%B8%D0%B9.1573/']Обжалование наказаний[/URL].[/COLOR][/CENTER]<br>" +
        '[CENTER][COLOR=violet]━━━━━━━━━━━━⊱⋆⊰━━━━━━━━━━━━[/CENTER][/COLOR]' +
        '[Color=AQUA][CENTER]Приятной игры на NOVOSIBIRSK.[/CENTER][/color]' +
        '[COLOR=RED][CENTER]✿❯────「Отказано ❖ Закрыто」────❮✿[/CENTER][/COLOR]',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Форма темы',
      content:
		"[CENTER][COLOR=#ff0000]Доброго времени суток уважаемый {{ user.name }} [/COLOR][/CENTER]<br><br>"+
        '[CENTER][COLOR=violet]━━━━━━━━━━━━⊱⋆⊰━━━━━━━━━━━━[/CENTER][/COLOR]' +
        "[CENTER][COLOR=#FFFF00]Ваша жалоба составлена не по форме.<br>Убедительная просьба ознакомиться [URL='https://forum.blackrussia.online/index.php?threads/3429394/']с правилами подачи жалоб на игроков[/URL].[/CENTER]<br>" +
        '[CENTER][COLOR=violet]━━━━━━━━━━━━⊱⋆⊰━━━━━━━━━━━━[/CENTER][/COLOR]' +
        '[Color=AQUA][CENTER]Приятной игры на NOVOSIBIRSK.[/CENTER][/color]' +
        '[COLOR=RED][CENTER]✿❯────「Отказано ❖ Закрыто」────❮✿[/CENTER][/COLOR]',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
	{
	  title: 'Нету /time',
	  content:
		"[CENTER][COLOR=#ff0000]Доброго времени суток уважаемый {{ user.name }} [/COLOR][/CENTER]<br><br>"+
        '[CENTER][COLOR=violet]━━━━━━━━━━━━⊱⋆⊰━━━━━━━━━━━━[/CENTER][/COLOR]' +
		"[CENTER][COLOR=#FFFF00]На ваших доказательствах отсутствует /time.[/COLOR][/CENTER]<br>" +
        '[CENTER][COLOR=violet]━━━━━━━━━━━━⊱⋆⊰━━━━━━━━━━━━[/CENTER][/COLOR]' +
        '[Color=AQUA][CENTER]Приятной игры на NOVOSIBIRSK.[/CENTER][/color]' +
        '[COLOR=RED][CENTER]✿❯────「Отказано ❖ Закрыто」────❮✿[/CENTER][/COLOR]',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
	},
    {
	  title: 'Укажите тайм-коды',
	  content:
		"[CENTER][COLOR=#ff0000]Доброго времени суток уважаемый {{ user.name }} [/COLOR][/CENTER]<br><br>"+
        '[CENTER][COLOR=violet]━━━━━━━━━━━━⊱⋆⊰━━━━━━━━━━━━[/CENTER][/COLOR]' +
		"[CENTER][COLOR=#FFFF00]В течении 24х часов укажите тайм-коды, иначе жалоба будет отказана.[/COLOR][/CENTER]<br>" +
        '[CENTER][COLOR=violet]━━━━━━━━━━━━⊱⋆⊰━━━━━━━━━━━━[/CENTER][/COLOR]' +
        '[COLOR=Blue][CENTER]✿❯────「На рассмотрение」────❮✿[/CENTER][/COLOR]',
      prefix: PINN_PREFIX,
	  status: true,
	},
    {
      title: 'Жалоба на рассмотрении',
      content:
		"[CENTER][COLOR=#ff0000]Доброго времени суток уважаемый {{ user.name }} [/COLOR][/CENTER]<br><br>"+
        '[CENTER][COLOR=violet]━━━━━━━━━━━━⊱⋆⊰━━━━━━━━━━━━[/CENTER][/COLOR]' +
        "[CENTER][COLOR=#FFFF00]Ваша жалоба взята на рассмотрение.<br>Просьба ожидать ответа и не создавать дубликаты данной темы.[/COLOR][/CENTER]<br>" +
        '[CENTER][COLOR=violet]━━━━━━━━━━━━⊱⋆⊰━━━━━━━━━━━━[/CENTER][/COLOR]' +
        '[COLOR=RED][CENTER]✿❯────「На рассмотрение」────❮✿[/CENTER][/COLOR]',
      prefix: PINN_PREFIX,
	  status: false,
    },
      {
      title: 'Заголовок не по форме',
      content:
		"[CENTER][COLOR=#ff0000]Доброго времени суток уважаемый {{ user.name }} [/COLOR][/CENTER]<br><br>"+
        '[CENTER][COLOR=violet]━━━━━━━━━━━━⊱⋆⊰━━━━━━━━━━━━[/CENTER][/COLOR]' +
        "[CENTER][COLOR=#FFFF00]Заголовок вашей жалобы составлен не по форме. Убедительная просьба ознакомиться [URL='https://forum.blackrussia.online/index.php?threads/3429394/']с правилами подачи жалоб на игроков[/URL].[/CENTER]<br>" +
        '[CENTER][COLOR=violet]━━━━━━━━━━━━⊱⋆⊰━━━━━━━━━━━━[/CENTER][/COLOR]' +
        '[Color=AQUA][CENTER]Приятной игры на NOVOSIBIRSK.[/CENTER][/color]' +
        '[COLOR=RED][CENTER]✿❯────「Отказано ❖ Закрыто」────❮✿[/CENTER][/COLOR]',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
      {
      title: 'Более 72 часов',
      content:
		"[CENTER][COLOR=#ff0000]Доброго времени суток уважаемый {{ user.name }} [/COLOR][/CENTER]<br><br>"+
        '[CENTER][COLOR=violet]━━━━━━━━━━━━⊱⋆⊰━━━━━━━━━━━━[/CENTER][/COLOR]' +
        "[CENTER][COLOR=#FFFF00]С момента нарушения от игрока прошло более 72 часов.[/COLOR][/CENTER]<br>" +
        '[CENTER][COLOR=violet]━━━━━━━━━━━━⊱⋆⊰━━━━━━━━━━━━[/CENTER][/COLOR]' +
        '[Color=AQUA][CENTER]Приятной игры на NOVOSIBIRSK.[/CENTER][/color]' +
        '[COLOR=RED][CENTER]✿❯────「Отказано ❖ Закрыто」────❮✿[/CENTER][/COLOR]',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
      {
      title: 'Доква через запрет соц сети',
      content:
		"[CENTER][COLOR=#ff0000]Доброго времени суток уважаемый {{ user.name }} [/COLOR][/CENTER]<br><br>"+
        '[CENTER][COLOR=violet]━━━━━━━━━━━━⊱⋆⊰━━━━━━━━━━━━[/CENTER][/COLOR]' +
        "[CENTER][Color=red]3.6 Прикрепление доказательств обязательно. Примечание: загрузка доказательств в соц. сети (ВКонтакте, instagram) запрещается, доказательства должны быть загружены на фото/видео хостинги (YouTube, Япикс, imgur).[/CENTER]<br>" +
        '[CENTER][COLOR=violet]━━━━━━━━━━━━⊱⋆⊰━━━━━━━━━━━━[/CENTER][/COLOR]' +
        '[Color=AQUA][CENTER]Приятной игры на NOVOSIBIRSK.[/CENTER][/color]' +
        '[COLOR=RED][CENTER]✿❯────「Отказано ❖ Закрыто」────❮✿[/CENTER][/COLOR]',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Нету условий сделки',
      content:
		"[CENTER][COLOR=#ff0000]Доброго времени суток уважаемый {{ user.name }} [/COLOR][/CENTER]<br><br>"+
        '[CENTER][COLOR=violet]━━━━━━━━━━━━⊱⋆⊰━━━━━━━━━━━━[/CENTER][/COLOR]' +
        "[CENTER][COLOR=#FFFF00]В данных доказательствах отсутствуют условия сделки.[/COLOR][/CENTER]<br>" +
        '[CENTER][COLOR=violet]━━━━━━━━━━━━⊱⋆⊰━━━━━━━━━━━━[/CENTER][/COLOR]' +
        '[Color=AQUA][CENTER]Приятной игры на NOVOSIBIRSK.[/CENTER][/color]' +
        '[COLOR=RED][CENTER]✿❯────「Отказано ❖ Закрыто」────❮✿[/CENTER][/COLOR]',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Нужен фрапс',
      content:
		"[CENTER][COLOR=#ff0000]Доброго времени суток уважаемый {{ user.name }} [/COLOR][/CENTER]<br><br>"+
        '[CENTER][COLOR=violet]━━━━━━━━━━━━⊱⋆⊰━━━━━━━━━━━━[/CENTER][/COLOR]' +
        "[CENTER][COLOR=#FFFF00]В таких случаях нужен фрапс.[/COLOR][/CENTER]<br>" +
        '[CENTER][COLOR=violet]━━━━━━━━━━━━⊱⋆⊰━━━━━━━━━━━━[/CENTER][/COLOR]' +
        '[COLOR=AQUA][CENTER]Приятной игры на Novosibirsk.[/CENTER][/COLOR]'+
        '[COLOR=RED][CENTER]✿❯────「Отказано ❖ Закрыто」────❮✿[/CENTER][/COLOR]',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Нужен фарпс + промотка чата',
      content:
		"[CENTER][COLOR=#ff0000]Доброго времени суток уважаемый {{ user.name }} [/COLOR][/CENTER]<br><br>"+
        '[CENTER][COLOR=violet]━━━━━━━━━━━━⊱⋆⊰━━━━━━━━━━━━[/CENTER][/COLOR]' +
        "[CENTER][COLOR=#FFFF00]В таких случаях нужен фрапс + промотка чата.[/COLOR][[/CENTER]" +
        '[CENTER][COLOR=violet]━━━━━━━━━━━━⊱⋆⊰━━━━━━━━━━━━[/CENTER][/COLOR]' +
        '[Color=AQUA][CENTER]Приятной игры на NOVOSIBIRSK.[/CENTER][/color]' +
        '[COLOR=RED][CENTER]✿❯────「Отказано ❖ Закрыто」────❮✿[/CENTER][/COLOR]',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Нужна промотка чата',
      content:
		"[CENTER][COLOR=#ff0000]Доброго времени суток уважаемый {{ user.name }} [/COLOR][/CENTER]<br><br>"+
        '[CENTER][COLOR=violet]━━━━━━━━━━━━⊱⋆⊰━━━━━━━━━━━━[/CENTER][/COLOR]' +
        "[CENTER][COLOR=#FFFF00]В таких случаях нужна промотка чата.[/COLOR][/CENTER]" +
        '[CENTER][COLOR=violet]━━━━━━━━━━━━⊱⋆⊰━━━━━━━━━━━━[/CENTER][/COLOR]' +
        '[Color=AQUA][CENTER]Приятной игры на NOVOSIBIRSK.[/CENTER][/color]' +
        '[COLOR=RED][CENTER]✿❯────「Отказано ❖ Закрыто」────❮✿[/CENTER][/COLOR]',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Неполный фрапс',
      content:
		"[CENTER][COLOR=#ff0000]Доброго времени суток уважаемый {{ user.name }} [/COLOR][/CENTER]<br><br>"+
        '[CENTER][COLOR=violet]━━━━━━━━━━━━⊱⋆⊰━━━━━━━━━━━━[/CENTER][/COLOR]' +
        "[CENTER][COLOR=#FFFF00]Неполный фрапс. Загрузите полный фрапс на ютуб.[/COLOR][/CENTER]<br>" +
        '[CENTER][COLOR=violet]━━━━━━━━━━━━⊱⋆⊰━━━━━━━━━━━━[/CENTER][/COLOR]' +
        '[Color=AQUA][CENTER]Приятной игры на NOVOSIBIRSK.[/CENTER][/color]' +
        '[COLOR=RED][CENTER]✿❯────「Отказано ❖ Закрыто」────❮✿[/CENTER][/COLOR]',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Не работают доква',
      content:
		"[CENTER][COLOR=#ff0000]Доброго времени суток уважаемый {{ user.name }} [/COLOR][/CENTER]<br><br>"+
        '[CENTER][COLOR=violet]━━━━━━━━━━━━⊱⋆⊰━━━━━━━━━━━━[/CENTER][/COLOR]' +
        "[CENTER][COLOR=#FFFF00]Не работают доказательства.[/COLOR][/CENTER]<br>" +
        '[CENTER][COLOR=violet]━━━━━━━━━━━━⊱⋆⊰━━━━━━━━━━━━[/CENTER][/COLOR]' +
        '[Color=AQUA][CENTER]Приятной игры на NOVOSIBIRSK.[/CENTER][/color]' +
        '[COLOR=RED][CENTER]✿❯────「Отказано ❖ Закрыто」────❮✿[/CENTER][/COLOR]',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Док-ва отредактированы',
      content:
		"[CENTER][COLOR=#ff0000]Доброго времени суток уважаемый {{ user.name }} [/COLOR][/CENTER]<br><br>"+
        '[CENTER][COLOR=violet]━━━━━━━━━━━━⊱⋆⊰━━━━━━━━━━━━[/CENTER][/COLOR]' +
        "[CENTER][COLOR=#FFFF00]Ваши доказательства отредактированы.[/COLOR][/CENTER]" +
        '[CENTER][COLOR=violet]━━━━━━━━━━━━⊱⋆⊰━━━━━━━━━━━━[/CENTER][/COLOR]' +
        '[Color=AQUA][CENTER]Приятной игры на NOVOSIBIRSK.[/CENTER][/color]' +
        '[COLOR=RED][CENTER]✿❯────「Отказано ❖ Закрыто」────❮✿[/CENTER][/COLOR]',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'От 3-го лица',
      content:
		"[CENTER][COLOR=#ff0000]Доброго времени суток уважаемый {{ user.name }} [/COLOR][/CENTER]<br><br>"+
        '[CENTER][COLOR=violet]━━━━━━━━━━━━⊱⋆⊰━━━━━━━━━━━━[/CENTER][/COLOR]' +
        "[CENTER][COLOR=#FFFF00]Жалобы от 3-их лиц не принимаются.[/COLOR][/CENTER]<br>" +
        '[CENTER][COLOR=violet]━━━━━━━━━━━━⊱⋆⊰━━━━━━━━━━━━[/CENTER][/COLOR]' +
        '[Color=AQUA][CENTER]Приятной игры на NOVOSIBIRSK.[/CENTER][/color]' +
        '[COLOR=RED][CENTER]✿❯────「Отказано ❖ Закрыто」────❮✿[/CENTER][/COLOR]',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Ответный ДМ',
      content:
		"[CENTER][COLOR=#ff0000]Доброго времени суток уважаемый {{ user.name }} [/COLOR][/CENTER]<br><br>"+
        '[CENTER][COLOR=violet]━━━━━━━━━━━━⊱⋆⊰━━━━━━━━━━━━[/CENTER][/COLOR]' +
        "[CENTER][COLOR=#FFFF00]В случае ответного ДМ нужна видео-запись. Пересоздайте тему и прикрепите видео-запись.[/COLOR][/CENTER]<br>" +
        '[CENTER][COLOR=violet]━━━━━━━━━━━━⊱⋆⊰━━━━━━━━━━━━[/CENTER][/COLOR]' +
        '[Color=AQUA][CENTER]Приятной игры на NOVOSIBIRSK.[/CENTER][/color]' +
        '[COLOR=RED][CENTER]✿❯────「Отказано ❖ Закрыто」────❮✿[/CENTER][/COLOR]',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Ошиблись разделом',
      content:
		"[CENTER][COLOR=#ff0000]Доброго времени суток уважаемый {{ user.name }} [/COLOR][/CENTER]<br><br>"+
        '[CENTER][COLOR=violet]━━━━━━━━━━━━⊱⋆⊰━━━━━━━━━━━━[/CENTER][/COLOR]' +
        "[CENTER][COLOR=#FFFF00]Вы ошиблись сервером/разделом, переподайте жалобу в нужный раздел.[/COLOR][/CENTER]<br>" +
        '[CENTER][COLOR=violet]━━━━━━━━━━━━⊱⋆⊰━━━━━━━━━━━━[/CENTER][/COLOR]' +
        '[Color=AQUA][CENTER]Приятной игры на NOVOSIBIRSK.[/CENTER][/color]' +
        '[COLOR=RED][CENTER]✿❯────「Отказано ❖ Закрыто」────❮✿[/CENTER][/COLOR]',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
	  title: 'Док-ва не рабочие',
	  content:
		"[CENTER][COLOR=#ff0000]Доброго времени суток уважаемый {{ user.name }} [/COLOR][/CENTER]<br><br>"+
        '[CENTER][COLOR=violet]━━━━━━━━━━━━⊱⋆⊰━━━━━━━━━━━━[/CENTER][/COLOR]' +
		"[CENTER][COLOR=#FFFF00]Ваши доказательства не рабочие/обрезаные, перезалейте их правильно и без обрезаний.[/COLOR][/CENTER]<br>" +
        '[CENTER][COLOR=violet]━━━━━━━━━━━━⊱⋆⊰━━━━━━━━━━━━[/CENTER][/COLOR]' +
        '[Color=AQUA][CENTER]Приятной игры на NOVOSIBIRSK.[/CENTER][/color]' +
        '[COLOR=RED][CENTER]✿❯────「Отказано ❖ Закрыто」────❮✿[/CENTER][/COLOR]',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
	},
	{
	  title: 'Фотохостинги',
	  content:
		"[CENTER][COLOR=#ff0000]Доброго времени суток уважаемый {{ user.name }} [/CENTER]<br><br>"+
        '[CENTER][COLOR=violet]━━━━━━━━━━━━⊱⋆⊰━━━━━━━━━━━━[/CENTER][/COLOR]' +
		"[CENTER][COLOR=#FFFF00]Доказательства должны быть загружены на Yapx/Imgur/YouTube.[/CENTER]<br>" +
        '[CENTER][COLOR=violet]━━━━━━━━━━━━⊱⋆⊰━━━━━━━━━━━━[/CENTER][/COLOR]' +
        '[Color=AQUA][CENTER]Приятной игры на NOVOSIBIRSK.[/CENTER][/color]' +
        '[COLOR=RED][CENTER]✿❯────「Отказано ❖ Закрыто」────❮✿[/CENTER][/COLOR]',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
	},
    {
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴РП СИТУАЦИИ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
	  title: 'РП ситуация одобрено',
	  content:
		"[CENTER][COLOR=#ff0000]Доброго времени суток уважаемый {{ user.name }} [/COLOR][/CENTER]<br><br>"+
        '[CENTER][COLOR=violet]━━━━━━━━━━━━⊱⋆⊰━━━━━━━━━━━━[/CENTER][/COLOR]' +
		"[CENTER][COLOR=#FFFF00]Ваша РП ситуация была проверена и получает статус - [/color][Color=green]Одобрено.[/COLOR][/CENTER]<br>" +
        '[CENTER][COLOR=violet]━━━━━━━━━━━━⊱⋆⊰━━━━━━━━━━━━[/CENTER][/COLOR]' +
        '[Color=AQUA][CENTER][ICODE]Приятной игры на NOVOSIBIRSK.[/ICODE][/CENTER][/color]' +
        '[COLOR=GREEN][CENTER]✿❯────「Одобрено ❖ Закрыто」────❮✿[/CENTER][/COLOR]',
       prefix: ODOBRENORP_PREFIX ,
	  status: false,
     },
    {
	  title: 'РП ситуация на доработке',
	  content:
		"[CENTER][COLOR=#ff0000]Доброго времени суток уважаемый {{ user.name }} [/COLOR][/CENTER]<br><br>"+
        '[CENTER][COLOR=violet]━━━━━━━━━━━━⊱⋆⊰━━━━━━━━━━━━[/CENTER][/COLOR]' +
		"[CENTER][COLOR=#FFFF00]Вам дается 24 часа на дополнение Вашей РП ситуации [/COLOR][/CENTER]<br>" +
        '[CENTER][COLOR=violet]━━━━━━━━━━━━⊱⋆⊰━━━━━━━━━━━━[/CENTER][/COLOR]' +
        '[Color=AQUA][CENTER]Приятной игры на NOVOSIBIRSK.[/CENTER][/color]' +
        '[COLOR=Blue][CENTER]✿❯────「На рассмотрение」────❮✿[/CENTER][/COLOR]',
 
       prefix: NARASSMOTRENIIRP_PREFIX,
	  status: false,
      },
    {
	  title: 'РП ситуация нету видео',
	  content:
		"[CENTER][COLOR=#ff0000]Доброго времени суток уважаемый {{ user.name }} [/COLOR][/CENTER]<br><br>"+
        '[CENTER][COLOR=violet]━━━━━━━━━━━━⊱⋆⊰━━━━━━━━━━━━[/CENTER][/COLOR]' +
		"[CENTER][COLOR=#FFFF00]Ваша РП ситуация получает статус-[/color][Color=red] Отказано. [/color][Color=#FFFF00]'  Отсутствуют или не соотвествтуют описанию скриншоты или видео с RP ситуацией.[/COLOR][/CENTER]<br>" +
        '[CENTER][COLOR=violet]━━━━━━━━━━━━⊱⋆⊰━━━━━━━━━━━━[/CENTER][/COLOR]' +
        '[Color=AQUA][CENTER]Приятной игры на NOVOSIBIRSK.[/CENTER][/color]' +
        '[COLOR=RED][CENTER]✿❯────「Отказано ❖ Закрыто」────❮✿[/CENTER][/COLOR]',
       prefix: OTKAZRP_PREFIX,
	  status: false,
     },
{
	  title: 'РП ситуация отказ',
	  content:
		"[CENTER][COLOR=#ff0000]Доброго времени суток уважаемый {{ user.name }} [/COLOR][/CENTER]<br><br>"+
        '[CENTER][COLOR=violet]━━━━━━━━━━━━⊱⋆⊰━━━━━━━━━━━━[/CENTER][/COLOR]' +
		"[CENTER][COLOR=#FFFF00]Ваша РП ситуация получает статус-[/color][Color=red] Отказано. [/color][Color=#FFFF00]'Не соблюдение каких- либо правил RP Ситуаций.[/COLOR][/CENTER]<br>" +
        '[CENTER][COLOR=violet]━━━━━━━━━━━━⊱⋆⊰━━━━━━━━━━━━[/CENTER][/COLOR]' +
        '[Color=AQUA][CENTER]Приятной игры на NOVOSIBIRSK.[/CENTER][/color]' +
        '[COLOR=RED][CENTER]✿❯────「Отказано ❖ Закрыто」────❮✿[/CENTER][/COLOR]',
       prefix: OTKAZRP_PREFIX,
	  status: false,
     },
    {
title: 'РП ситуация скопирована',
	  content:
		"[CENTER][COLOR=#ff0000]Доброго времени суток уважаемый {{ user.name }} [/COLOR][/CENTER]<br><br>"+
        '[CENTER][COLOR=violet]━━━━━━━━━━━━⊱⋆⊰━━━━━━━━━━━━[/CENTER][/COLOR]' +
		"[CENTER][COLOR=#FFFF00]Ваша РП ситуация получает статус-[/color][Color=red]Отказано. Причина отказа - РП ситуация скопирована.[/COLOR][/CENTER]<br>" +
        '[CENTER][COLOR=violet]━━━━━━━━━━━━⊱⋆⊰━━━━━━━━━━━━[/CENTER][/COLOR]' +
        '[Color=AQUA][CENTER]Приятной игры на NOVOSIBIRSK.[/CENTER][/color]' +
        '[COLOR=Red][CENTER]✿❯────「Отказано ❖ Закрыто」────❮✿[/CENTER][/COLOR]',
       prefix: OTKAZRP_PREFIX,
	  status: false, 
     },
    {
	
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴Неофицал.орг.╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
     },
    {
	  title: 'Неофицальная Орг Одобрено',
	  content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/VNTPGQsQ/image2-3-1-1-1-10.gif[/img][/url]<br>'+
		"[CENTER][COLOR=#FFFF00][ICODE]Ваша рп ситуация получает статус-Одобрено.[/ICODE][/COLOR][/CENTER]<br>" +
		 '[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
        '[Color=AQUA][CENTER][ICODE]Приятной игры на NOVOSIBIRSK.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/VNTPGQsQ/image2-3-1-1-1-10.gif[/img][/url]<br>',
       prefix: ODOBRENOORG_PREFIX,
	  status: false,
     },
    {
	  title: 'Неофицальная Орг на доработке',
	  content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/VNTPGQsQ/image2-3-1-1-1-10.gif[/img][/url]<br>'+
		"[CENTER][COLOR=#FFFF00][ICODE]Вам дается 24 часа на дополнение Вашей неофицальной организации.[/ICODE][/COLOR][/CENTER]<br>" +
		 '[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
        '[Color=AQUA][CENTER][ICODE]Приятной игры на NOVOSIBIRSK.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/VNTPGQsQ/image2-3-1-1-1-10.gif[/img][/url]<br>',
       prefix: NARASSMOTRENIIORG_PREFIX ,
	  status: false,
     },
    {
	  title: 'Неофицальная Орг отказ',
	  content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/VNTPGQsQ/image2-3-1-1-1-10.gif[/img][/url]<br>'+
		"[CENTER][COLOR=#FFFF00][ICODE]Ваша РП ситуация получает статус-Отказано.'Причиной отказа могло послужить какое-либо нарушение из Правила создания неофицальной RolePlay организации./ICODE][/COLOR][/CENTER]<br>" +
		 '[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
        '[Color=AQUA][CENTER][ICODE]Приятной игры на NOVOSIBIRSK.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/VNTPGQsQ/image2-3-1-1-1-10.gif[/img][/url]<br>',
       prefix:  OTKAZORG_PREFIX,
	  status: false,
     },
    {
	
 
title: 'Неофициальная РП организация скопирована',
	  content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/VNTPGQsQ/image2-3-1-1-1-10.gif[/img][/url]<br>'+
		"[CENTER][COLOR=#FFFF00][ICODE]Ваша Неофициальная РП организация получает статус-Отказано. Причина отказа - Неофициальная РП организация  скопирована.[/ICODE][/COLOR][/CENTER]<br>" +
		 '[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
        '[Color=AQUA][CENTER][ICODE]Приятной игры на NOVOSIBIRSK.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/VNTPGQsQ/image2-3-1-1-1-10.gif[/img][/url]<br>',
       prefix: OTKAZRP_PREFIX,
	  status: false,
     },
    {
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴РП биография.╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
        {
	  title: 'РП биография Одобрено',
	  content:
		"[CENTER][COLOR=#ff0000]Доброго времени суток уважаемый {{ user.name }} [/COLOR][/CENTER]<br><br>"+
        '[CENTER][COLOR=violet]━━━━━━━━━━━━⊱⋆⊰━━━━━━━━━━━━[/CENTER][/COLOR]' +
		"[CENTER][COLOR=#FFFF00]Ваша RolePlay биография была проверена и получает статус - [/color][Color=green]Одобрено.[/COLOR][/CENTER]<br>" +
        '[CENTER][COLOR=violet]━━━━━━━━━━━━⊱⋆⊰━━━━━━━━━━━━[/CENTER][/COLOR]' +
        '[Color=AQUA][CENTER]Приятной игры на NOVOSIBIRSK.[/CENTER][/color]' +
        '[COLOR=GREEN][CENTER]✿❯────「Одобрено ❖ Закрыто」────❮✿[/CENTER][/COLOR]',
 
      prefix: ODOBRENOBIO_PREFIX,
	  status: false,
    },
    {
        title: 'Орф и пунктуац ошибки',
        content:
		"[CENTER][COLOR=#ff0000]Доброго времени суток уважаемый {{ user.name }} [/COLOR][/CENTER]<br><br>"+
        '[CENTER][COLOR=violet]━━━━━━━━━━━━⊱⋆⊰━━━━━━━━━━━━[/CENTER][/COLOR]' +
		"[CENTER][COLOR=#FFFF00]Ваша RolePlay биография была проверена и получает статус - [COLOR=#FF0000]Отказано.[/COLOR]<br>[COLOR=#FFFF00]Убедительная просьба ознакомиться[/COLOR] [URL='https://forum.blackrussia.online/index.php?threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%BE%D0%B7%D0%B4%D0%B0%D0%BD%D0%B8%D1%8F-roleplay-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8.3500136/']с правилами написания RolePlay биографий.[/URL][/CENTER]<br>" +
        '[CENTER][COLOR=#FFFF00]Причина отказа: [COLOR=#FFFFFF]Орфографические и пунктуационные ошибки.[/COLOR]' +
        '[CENTER][COLOR=violet]━━━━━━━━━━━━⊱⋆⊰━━━━━━━━━━━━[/CENTER][/COLOR]' +
        '[Color=AQUA][CENTER]Приятной игры на NOVOSIBIRSK.[/CENTER][/color]' +
        '[COLOR=RED][CENTER]✿❯────「Отказано ❖ Закрыто」────❮✿[/CENTER][/COLOR]',
 
      prefix: OTKAZBIO_PREFIX,
      status: false,
    },
    {
        title: 'Био от 1-го лица',
                content:
        "[CENTER][COLOR=#ff0000]Доброго времени суток уважаемый {{ user.name }} [/COLOR][/CENTER]<br><br>"+
        '[CENTER][COLOR=violet]━━━━━━━━━━━━⊱⋆⊰━━━━━━━━━━━━[/CENTER][/COLOR]' +
		"[CENTER][COLOR=#FFFF00]Ваша RolePlay биография была проверена и получает статус - [COLOR=#FF0000]Отказано.[/COLOR]<br>[COLOR=#FFFF00]Убедительная просьба ознакомиться[/COLOR] [URL='https://forum.blackrussia.online/index.php?threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%BE%D0%B7%D0%B4%D0%B0%D0%BD%D0%B8%D1%8F-roleplay-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8.3500136/']с правилами написания RolePlay биографий[/URL].[/CENTER]<br>" +
        '[CENTER][COLOR=#FFFF00]Причина отказа: [COLOR=#FFFFFF]Биография от 1-го лица.[/COLOR]' +
        '[CENTER][COLOR=violet]━━━━━━━━━━━━⊱⋆⊰━━━━━━━━━━━━[/CENTER][/COLOR]' +
        '[Color=AQUA][CENTER]Приятной игры на NOVOSIBIRSK.[/CENTER][/color]' +
        '[COLOR=RED][CENTER]✿❯────「Отказано ❖ Закрыто」────❮✿[/CENTER][/COLOR]',
 
      prefix: OTKAZBIO_PREFIX,
      status: false,
    },
    {
        title: 'Дата рождения некорректна',
        content:
        "[CENTER][COLOR=#ff0000]Доброго времени суток уважаемый {{ user.name }} [/COLOR][/CENTER]<br><br>"+
        '[CENTER][COLOR=violet]━━━━━━━━━━━━⊱⋆⊰━━━━━━━━━━━━[/CENTER][/COLOR]' +
		"[CENTER][COLOR=#FFFF00]Ваша RolePlay биография была проверена и получает статус - [COLOR=#FF0000]Отказано.[/COLOR]<br>[COLOR=#FFFF00]Убедительная просьба ознакомиться[/COLOR] [URL='https://forum.blackrussia.online/index.php?threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%BE%D0%B7%D0%B4%D0%B0%D0%BD%D0%B8%D1%8F-roleplay-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8.3500136/']с правилами написания RolePlay биографий[/URL].[/CENTER]<br>" +
        '[CENTER][COLOR=#FFFF00]Причина отказа: [COLOR=#FFFFFF]Дата рождения некорректна.[/COLOR]' +
        '[CENTER][COLOR=violet]━━━━━━━━━━━━⊱⋆⊰━━━━━━━━━━━━[/CENTER][/COLOR]' +
        '[Color=AQUA][CENTER]Приятной игры на NOVOSIBIRSK.[/CENTER][/color]' +
        '[COLOR=RED][CENTER]✿❯────「Отказано ❖ Закрыто」────❮✿[/CENTER][/COLOR]',
 
      prefix: OTKAZBIO_PREFIX,
      status: false,
    },
    {
        title: 'Информация не соответствует времени',
        content:
        "[CENTER][COLOR=#ff0000]Доброго времени суток уважаемый {{ user.name }} [/COLOR][/CENTER]<br><br>"+
        '[CENTER][COLOR=violet]━━━━━━━━━━━━⊱⋆⊰━━━━━━━━━━━━[/CENTER][/COLOR]' +
		"[CENTER][COLOR=#FFFF00]Ваша RolePlay биография была проверена и получает статус - [COLOR=#FF0000]Отказано.[/COLOR]<br>[COLOR=#FFFF00]Убедительная просьба ознакомиться[/COLOR] [URL='https://forum.blackrussia.online/index.php?threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%BE%D0%B7%D0%B4%D0%B0%D0%BD%D0%B8%D1%8F-roleplay-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8.3500136/']с правилами написания RolePlay биографий[/URL].[/CENTER]<br>" +
		'[CENTER][COLOR=violet]━━━━━━━━━━━━⊱⋆⊰━━━━━━━━━━━━[/CENTER][/COLOR]' +
		'[COLOR=RED][CENTER]✿❯────「Отказано ❖ Закрыто」────❮✿[/CENTER][/COLOR]',
      prefix: OTKAZBIO_PREFIX,
      status: false,
    },
    {
        title: 'Возраст не совпал',
        content:
        "[CENTER][COLOR=#ff0000]Доброго времени суток уважаемый {{ user.name }} [/COLOR][/CENTER]<br><br>"+
        '[CENTER][COLOR=violet]━━━━━━━━━━━━⊱⋆⊰━━━━━━━━━━━━[/CENTER][/COLOR]' +
		"[CENTER][COLOR=#FFFF00]Ваша RolePlay биография была проверена и получает статус - [COLOR=#FF0000]Отказано.[/COLOR]<br>[COLOR=#FFFF00]Убедительная просьба ознакомиться[/COLOR] [URL='https://forum.blackrussia.online/index.php?threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%BE%D0%B7%D0%B4%D0%B0%D0%BD%D0%B8%D1%8F-roleplay-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8.3500136/']с правилами написания RolePlay биографий[/URL].[/CENTER]<br>" +
        '[CENTER][COLOR=#FFFF00]Причина отказа: [COLOR=#FFFFFF]Возраст не совпадает с датой рождения.[/COLOR]' +
        '[CENTER][COLOR=violet]━━━━━━━━━━━━⊱⋆⊰━━━━━━━━━━━━[/CENTER][/COLOR]' +
        '[Color=AQUA][CENTER]Приятной игры на NOVOSIBIRSK.[/CENTER][/color]' +
        '[COLOR=RED][CENTER]✿❯────「Отказано ❖ Закрыто」────❮✿[/CENTER][/COLOR]',
 
      prefix: OTKAZBIO_PREFIX,
      status: false,
    },
    {
        title: 'Слишком молод',
        content:
        "[CENTER][COLOR=#ff0000]Доброго времени суток уважаемый {{ user.name }} [/COLOR][/CENTER]<br><br>"+
        '[CENTER][COLOR=violet]━━━━━━━━━━━━⊱⋆⊰━━━━━━━━━━━━[/CENTER][/COLOR]' +
		"[CENTER][COLOR=#FFFF00]Ваша RolePlay биография была проверена и получает статус - [COLOR=#FF0000]Отказано.[/COLOR]<br>[COLOR=#FFFF00]Убедительная просьба ознакомиться[/COLOR] [URL='https://forum.blackrussia.online/index.php?threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%BE%D0%B7%D0%B4%D0%B0%D0%BD%D0%B8%D1%8F-roleplay-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8.3500136/']с правилами написания RolePlay биографий[/URL].[/CENTER]<br>" +
        '[CENTER][COLOR=#FFFF00]Причина отказа: [COLOR=#FFFFFF]Некорректен возраст (слишком молод).[/COLOR]' +
        '[CENTER][COLOR=violet]━━━━━━━━━━━━⊱⋆⊰━━━━━━━━━━━━[/CENTER][/COLOR]' +
        '[Color=AQUA][CENTER]Приятной игры на NOVOSIBIRSK.[/CENTER][/color]' +
        '[COLOR=RED][CENTER]✿❯────「Отказано ❖ Закрыто」────❮✿[/CENTER][/COLOR]',
 
      prefix: OTKAZBIO_PREFIX,
      status: false,
    },
    {
        title: 'Биография скопирована',
        content:
        "[CENTER][COLOR=#ff0000]Доброго времени суток уважаемый {{ user.name }} [/COLOR][/CENTER]<br><br>"+
        '[CENTER][COLOR=violet]━━━━━━━━━━━━⊱⋆⊰━━━━━━━━━━━━[/CENTER][/COLOR]' +
		"[CENTER][COLOR=#FFFF00]Ваша RolePlay биография была проверена и получает статус - [COLOR=#FF0000]Отказано.[/COLOR]<br>[COLOR=#FFFF00]Убедительная просьба ознакомиться[/COLOR] [URL='https://forum.blackrussia.online/index.php?threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%BE%D0%B7%D0%B4%D0%B0%D0%BD%D0%B8%D1%8F-roleplay-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8.3500136/']с правилами написания RolePlay биографий[/URL].[/CENTER]<br>" +
        '[CENTER][COLOR=#FFFF00]Причина отказа: [COLOR=#FFFFFF]Биография скопирована.[/COLOR]' +
        '[CENTER][COLOR=violet]━━━━━━━━━━━━⊱⋆⊰━━━━━━━━━━━━[/CENTER][/COLOR]' +
        '[Color=AQUA][CENTER]Приятной игры на NOVOSIBIRSK.[/CENTER][/color]' +
        '[COLOR=RED][CENTER]✿❯────「Отказано ❖ Закрыто」────❮✿[/CENTER][/COLOR]',
 
      prefix: OTKAZBIO_PREFIX,
      status: false,
    },
    {
        title: 'Недостаточно РП информации',
        content:
        "[CENTER][COLOR=#ff0000]Доброго времени суток уважаемый {{ user.name }} [/COLOR][/CENTER]<br><br>"+
        '[CENTER][COLOR=violet]━━━━━━━━━━━━⊱⋆⊰━━━━━━━━━━━━[/CENTER][/COLOR]' +
		"[CENTER][COLOR=#FFFF00]Ваша RolePlay биография была проверена и получает статус - [COLOR=#FF0000]Отказано.[/COLOR]<br>[COLOR=#FFFF00]Убедительная просьба ознакомиться[/COLOR] [URL='https://forum.blackrussia.online/index.php?threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%BE%D0%B7%D0%B4%D0%B0%D0%BD%D0%B8%D1%8F-roleplay-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8.3500136/']с правилами написания RolePlay биографий[/URL].[/CENTER]<br>" +
        '[CENTER][COLOR=#FFFF00]Причина отказа: [COLOR=#FFFFFF]Недостаточно РП информации.[/COLOR]' +
        '[CENTER][COLOR=violet]━━━━━━━━━━━━⊱⋆⊰━━━━━━━━━━━━[/CENTER][/COLOR]' +
        '[Color=AQUA][CENTER]Приятной игры на NOVOSIBIRSK.[/CENTER][/color]' +
        '[COLOR=RED][CENTER]✿❯────「Отказано ❖ Закрыто」────❮✿[/CENTER][/COLOR]',
 
      prefix: OTKAZBIO_PREFIX,
      status: false,
    },
    {
        title: 'Не по форме',
        content:
        "[CENTER][COLOR=#ff0000]Доброго времени суток уважаемый {{ user.name }} [/COLOR][/CENTER]<br><br>"+
        '[CENTER][COLOR=violet]━━━━━━━━━━━━⊱⋆⊰━━━━━━━━━━━━[/CENTER][/COLOR]' +
		"[CENTER][COLOR=#FFFF00]Ваша RolePlay биография была проверена и получает статус - [COLOR=#FF0000]Отказано.[/COLOR]<br>[COLOR=#FFFF00]Убедительная просьба ознакомиться[/COLOR] [URL='https://forum.blackrussia.online/index.php?threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%BE%D0%B7%D0%B4%D0%B0%D0%BD%D0%B8%D1%8F-roleplay-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8.3500136/']с правилами написания RolePlay биографий[/URL].[/CENTER]<br>" +
        '[CENTER][COLOR=#FFFF00]Причина отказа: [COLOR=#FFFFFF]Биография не по форме.[/COLOR]' +
        '[CENTER][COLOR=violet]━━━━━━━━━━━━⊱⋆⊰━━━━━━━━━━━━[/CENTER][/COLOR]' +
        '[Color=AQUA][CENTER]Приятной игры на NOVOSIBIRSK.[/CENTER][/color]' +
        '[COLOR=RED][CENTER]✿❯────「Отказано ❖ Закрыто」────❮✿[/CENTER][/COLOR]',
 
      prefix: OTKAZBIO_PREFIX,
      status: false,
    },
    {
        title: 'Некоррект национальность',
        content:
        "[CENTER][COLOR=#ff0000]Доброго времени суток уважаемый {{ user.name }} [/COLOR][/CENTER]<br><br>"+
        '[CENTER][COLOR=violet]━━━━━━━━━━━━⊱⋆⊰━━━━━━━━━━━━[/CENTER][/COLOR]' +
		"[CENTER][COLOR=#FFFF00]Ваша RolePlay биография была проверена и получает статус - [COLOR=#FF0000]Отказано.[/COLOR]<br>[COLOR=#FFFF00]Убедительная просьба ознакомиться[/COLOR] [URL='https://forum.blackrussia.online/index.php?threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%BE%D0%B7%D0%B4%D0%B0%D0%BD%D0%B8%D1%8F-roleplay-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8.3500136/']с правилами написания RolePlay биографий[/URL].[/CENTER]<br>" +
        '[CENTER][COLOR=#FFFF00]Причина отказа: [COLOR=#FFFFFF]Некорректная национальность.[/COLOR]' +
        '[CENTER][COLOR=violet]━━━━━━━━━━━━⊱⋆⊰━━━━━━━━━━━━[/CENTER][/COLOR]' +
        '[Color=AQUA][CENTER]Приятной игры на NOVOSIBIRSK.[/CENTER][/color]' +
        '[COLOR=RED][CENTER]✿❯────「Отказано ❖ Закрыто」────❮✿[/CENTER][/COLOR]',
 
      prefix: OTKAZBIO_PREFIX,
      status: false,
    },
    {
        title: 'Заголовок не по форме',
        content:
        "[CENTER][COLOR=#ff0000]Доброго времени суток уважаемый {{ user.name }} [/COLOR][/CENTER]<br><br>"+
        '[CENTER][COLOR=violet]━━━━━━━━━━━━⊱⋆⊰━━━━━━━━━━━━[/CENTER][/COLOR]' +
		"[CENTER][COLOR=#FFFF00]Ваша RolePlay биография была проверена и получает статус - [COLOR=#FF0000]Отказано.[/COLOR]<br>[COLOR=#FFFF00]Убедительная просьба ознакомиться[/COLOR] [URL='https://forum.blackrussia.online/index.php?threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%BE%D0%B7%D0%B4%D0%B0%D0%BD%D0%B8%D1%8F-roleplay-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8.3500136/']с правилами написания RolePlay биографий[/URL].[/CENTER]<br>" +
        '[CENTER][COLOR=#FFFF00]Причина отказа: [COLOR=#FFFFFF]Заголовок темы не по форму.[/COLOR]' +
        '[CENTER][COLOR=violet]━━━━━━━━━━━━⊱⋆⊰━━━━━━━━━━━━[/CENTER][/COLOR]' +
        '[Color=AQUA][CENTER]Приятной игры на NOVOSIBIRSK.[/CENTER][/color]' +
        '[COLOR=RED][CENTER]✿❯────「Отказано ❖ Закрыто」────❮✿[/CENTER][/COLOR]',
 
      prefix: OTKAZBIO_PREFIX,
      status: false,
    }
 
  ];
 
  $(document).ready(() => {
    // Загрузка скрипта для обработки шаблонов
    $('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');
 
    // Добавление кнопок при загрузке страницы
    addButton('На рассмотрение😍', 'pin');
    addButton('Га😉', 'Ga');
    addButton('Спецу🫡', 'Spec');
    addButton('Одобрено✅', 'accepted');
    addButton('Отказано❌', 'unaccept');
    addButton('Тех. Специалисту😈', 'Texy');
    addButton('Решено😎', 'Resheno');
    addButton('Закрыто😔', 'Zakrito');
    addButton('Ответы🔥', 'selectAnswer');
 
    // Поиск информации о теме
    const threadData = getThreadData();
 
    $('button#pin').click(() => editThreadData(PINN_PREFIX, true));
    $('button#accepted').click(() => editThreadData(ACCСEPT_PREFIX, false));
    $('button#Ga').click(() => editThreadData(GA_PREFIX, true));
    $('button#Spec').click(() => editThreadData(SPECY_PREFIX, true));
    $('button#teamProject').click(() => editThreadData(COMMAND_PREFIX, true));
    $('button#unaccept').click(() => editThreadData(UNACCСEPT_PREFIX, false));
    $('button#Texy').click(() => editThreadData(TEXY_PREFIX, false));
    $('button#Resheno').click(() => editThreadData(RESHENO_PREFIX, false));
    $('button#Zakrito').click(() => editThreadData(CLOSE_PREFIX, false));
 
    $(`button#selectAnswer`).click(() => {
      XF.alert(buttonsMarkup(buttons), null, 'Выберите ответ:');
      buttons.forEach((btn, id) => {
        if (id > 0) {
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
	} else  {
		fetch(`${document.URL}edit`, {
		  method: 'POST',
		  body: getFormData({
			prefix_id: prefix,
			title: threadTitle,
			pin: 1,
			_xfToken: XF.config.csrf,
			_xfRequestUri: document.URL.split(XF.config.url.fullBase)[1],
			_xfWithData: 1,
			_xfResponseType: 'json',
		  }),
		}).then(() => location.reload());
	}
 
 
 
 
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
	} else  {
		fetch(`${document.URL}edit`, {
		  method: 'POST',
		  body: getFormData({
			prefix_id: prefix,
			title: threadTitle,
			pin: 1,
			_xfToken: XF.config.csrf,
			_xfRequestUri: document.URL.split(XF.config.url.fullBase)[1],
			_xfWithData: 1,
			_xfResponseType: 'json',
		  }),
		}).then(() => location.reload());
		   }
 
 
function moveThread(prefix, type) {
// Получаем заголовок темы, так как он необходим при запросе
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
    }
})();