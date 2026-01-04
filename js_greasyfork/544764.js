// ==UserScript==
// @name         Скрипт для жалоб по форуму
// @namespace    http://tampermonkey.net/
// @version      3.2
// @description  Скрипт для КФ ЖБ
// @author       D.Toretto
// @match        https://forum.blackrussia.online/threads/*
// @icon         none
// @grant        none
// @license    MIT
// @downloadURL https://update.greasyfork.org/scripts/544764/%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%B6%D0%B0%D0%BB%D0%BE%D0%B1%20%D0%BF%D0%BE%20%D1%84%D0%BE%D1%80%D1%83%D0%BC%D1%83.user.js
// @updateURL https://update.greasyfork.org/scripts/544764/%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%B6%D0%B0%D0%BB%D0%BE%D0%B1%20%D0%BF%D0%BE%20%D1%84%D0%BE%D1%80%D1%83%D0%BC%D1%83.meta.js
// ==/UserScript==

(function () {
	'use strict';
	const UNACCEPT_PREFIX = 4; // префикс отказано
	const ACCEPT_PREFIX = 8; // префикс одобрено
	const PIN_PREFIX = 2; //  префикс закрепить
	const SPECADM_PREFIX = 11; // специальному администратору
	const MAINADM_PREFIX = 12; // главному адамнистратору
    const CLOSE_PREFIX = 7;
    const TEXY_PREFIX = 13;
    const REALIZOVANO_PREFIX = 5;
    const VAJNO_PREFIX = 1;
    const OJIDANIE_PREFIX = 14;
const OTKAZBIO_PREFIX = 4;
const ODOBRENOBIO_PREFIX = 8;
const NARASSMOTRENIIBIO_PREFIX = 2;
const PREFIKS = 0;
const KACHESTVO = 15;
const RASSMOTRENO_PREFIX = 9;
const OTKAZRP_PREFIX = 4;
const ODOBRENORP_PREFIX = 8;
const NARASSMOTRENIIRP_PREFIX = 2;
const OTKAZORG_PREFIX = 4;
const ODOBRENOORG_PREFIX = 8;
const NARASSMOTRENIIORG_PREFIX = 2;
const KOMANDE_PREFIX = 10;
const buttons = [
       {
        title: '------------------------------------------------------------ рассмотрение ---------------------------------------------------------------',
                                   },
                                   
        {
        title: '| На рассмотрении |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]<br>' +
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Ваша жалоба находится на рассмотрении. Просьба не создавать дубликаты этой темы.<br>Ожидайте ответа от администрации.[/CENTER]<br><br>" +    
        "[CENTER][Color=rgb(255, 165, 0)] На рассмотрении[/color].[/I][/CENTER][/FONT]",
               prefix: NARASSMOTRENIIORG_PREFIX,
      status: false,
                       },
                       
        {
        title: '------------------------------------------------------------ одобрено(чаты/voice) ----------------------------------------------------------------',
                                   },

        {
        title: '| caps |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]<br>' +
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Нарушитель будет наказан по данному пункту правил:<br> [Color=Red]3.02[/color]. Запрещено использование верхнего регистра (Caps Lock) при написании любого текста в любом чате | [Color=Red]Mute 30 минут[/color].[/CENTER]<br>" +
        '[Color=Lime][CENTER]Одобрено, закрыто.[/CENTER][/color]<br>' +
        "[CENTER] Приятной игры на [Color=Red]Black Russia [/I][/CENTER][/color][/FONT]",
               prefix: ACCEPT_PREFIX,
      status: false,
                       },
            {
        title: '| оск |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]<br>' +
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Нарушитель будет наказан по данному пункту правил:<br> [Color=Red]3.03[/color]. Любые формы оскорблений, издевательств, расизма, дискриминации, религиозной враждебности, сексизма в OOC чате запрещены | [Color=Red]Mute 30 минут[/color].[/CENTER]<br>" +
        '[Color=Lime][CENTER]Одобрено, закрыто.[/CENTER][/color] <br> '+
        "[CENTER] Приятной игры на [Color=Red]Black Russia [/I][/CENTER][/color][/FONT]",
               prefix: ACCEPT_PREFIX,
      status: false,
                       },
            {
        title: '| упом/оск род |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]<br>' +
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Нарушитель будет наказан по данному пункту правил:<br> [Color=Red]3.04[/color]. Запрещено оскорбление или косвенное упоминание родных вне зависимости от чата (IC или OOC) | [Color=Red]Mute 120 минут / Ban 7 - 15 дней[/color].[/CENTER]<br>" +
        '[Color=Lime][CENTER]Одобрено, закрыто.[/CENTER][/color] <br>' +
        "[CENTER] Приятной игры на [Color=Red]Black Russia [/I][/CENTER][/color][/FONT]",
               prefix: ACCEPT_PREFIX,
      status: false,
                       },
            {
        title: '| flood |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]<br>' +
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Нарушитель будет наказан по данному пункту правил:<br> [Color=Red]3.05[/color]. Запрещен флуд — 3 и более повторяющихся сообщений от одного и того же игрока | [Color=Red]Mute 30 минут[/color].[/CENTER]<br>" +
        '[Color=Lime][CENTER]Одобрено, закрыто.[/CENTER][/color] <br>' +
        "[CENTER] Приятной игры на [Color=Red]Black Russia [/I][/CENTER][/color][/FONT]",
               prefix: ACCEPT_PREFIX,
      status: false,
                       },
                {
        title: '| злоупотребление знаками |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]<br>' +
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Нарушитель будет наказан по данному пункту правил:<br> [Color=Red]3.06[/color]. Запрещено злоупотребление знаков препинания и прочих символов | [Color=Red]Mute 30 минут[/color].[/CENTER]<br>" +
        '[Color=Lime][CENTER]Одобрено, закрыто.[/CENTER][/color] <br> '+
        "[CENTER] Приятной игры на [Color=Red]Black Russia [/I][/CENTER][/color][/FONT]",
               prefix: ACCEPT_PREFIX,
      status: false,
                       },
                    {
        title: '| слив глобального чата |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]<br>' +
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Нарушитель будет наказан по данному пункту правил:<br> [Color=Red]3.08[/color]. Запрещены любые формы «слива» посредством использования глобальных чатов | [Color=Red]PermBan[/color].[/CENTER]<br>" +
        '[Color=Lime][CENTER]Одобрено, закрыто.[/CENTER][/color] <br>' +
        "[CENTER] Приятной игры на [Color=Red]Black Russia [/I][/CENTER][/color][/FONT]",
               prefix: ACCEPT_PREFIX,
      status: false,
                       },
                    {
        title: '| выдача себя за адм |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]<br>' +
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Нарушитель будет наказан по данному пункту правил:<br> [Color=Red]3.10[/color]. Запрещена выдача себя за администратора, если таковым не являетесь | [Color=Red]Ban 7 - 15 дней[/color].[/CENTER]<br>" +
        '[Color=Lime][CENTER]Одобрено, закрыто.[/CENTER][/color] <br>' +
        "[CENTER] Приятной игры на [Color=Red]Black Russia [/I][/CENTER][/color][/FONT]",
               prefix: ACCEPT_PREFIX,
      status: false,
                       },
                    {
        title: '| введение в забл командами |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]<br>' +
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Нарушитель будет наказан по данному пункту правил:<br> [Color=Red]3.11[/color]. Запрещено введение игроков проекта в заблуждение путем злоупотребления командами | [Color=Red]Ban 15 - 30 дней / PermBan[/color].[/CENTER]<br>" +
        '[Color=Lime][CENTER]Одобрено, закрыто.[/CENTER][/color] <br>' +
        "[CENTER] Приятной игры на [Color=Red]Black Russia [/I][/CENTER][/color][/FONT]",
               prefix: ACCEPT_PREFIX,
      status: false,
                       },
                    {
        title: '| музыка войс |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]<br>' +
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Нарушитель будет наказан по данному пункту правил:<br> [Color=Red]3.14[/color]. Запрещено включать музыку в Voice Chat | [Color=Red]Mute 60 минут[/color].[/CENTER]<br>" +
        '[Color=Lime][CENTER]Одобрено, закрыто.[/CENTER][/color] <br>' +
        "[CENTER] Приятной игры на [Color=Red]Black Russia [/I][/CENTER][/color][/FONT]",
               prefix: ACCEPT_PREFIX,
      status: false,
                       },
                    {
        title: '| шум войс |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]<br>' +
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Нарушитель будет наказан по данному пункту правил:<br> [Color=Red]3.16[/color]. Запрещено создавать посторонние шумы или звуки | [Color=Red]Mute 30 минут[/color].[/CENTER]<br>" +
        '[Color=Lime][CENTER]Одобрено, закрыто.[/CENTER][/color] <br>' +
        "[CENTER] Приятной игры на [Color=Red]Black Russia [/I][/CENTER][/color][/FONT]",
               prefix: ACCEPT_PREFIX,
      status: false,
                       },
                    {
        title: '| политик/религиоз пропаганда/провокация |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]<br>' +
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Нарушитель будет наказан по данному пункту правил:<br> [Color=Red]3.18[/color]. Запрещено политическое и религиозное пропагандирование, а также провокация игроков к конфликтам, коллективному флуду или беспорядкам в любом из чатов | [Color=Red]Mute 120 минут / Ban 10 дней[/color].[/CENTER]<br>" +
        '[Color=Lime][CENTER]Одобрено, закрыто.[/CENTER][/color] <br> '+
        "[CENTER] Приятной игры на [Color=Red]Black Russia [/I][/CENTER][/color][/FONT]",
               prefix: ACCEPT_PREFIX,
      status: false,
                       },
                    {
        title: '| изменеие голоса войс |',
	  content:
		"[B][FONT=GEORGIA][CENTER][COLOR=yellow]{{ greeting }}, уважаемый игрок. [/COLOR][/CENTER][/B]<br><br>"+
'[CENTER][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/CENTER]<br><br>' +
        "[B][CENTER][COLOR=WHITE]Ваша жалоба была одобрена и игрок будет наказан по следующим пунктам правил проекта:<br> [color=red]3.19.[/color] Запрещено использование любого софта для изменения голоса [color=red]| Mute 60 минут[/color] <br><br> Одобрено, закрыто."+
"[CENTER][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/CENTER]<br>",
               prefix: ACCEPT_PREFIX,
      status: false,
                       },
                    {
        title: '| транслит |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]<br>' +
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Нарушитель будет наказан по данному пункту правил:<br> [Color=Red]3.20[/color]. Запрещено использование транслита в любом из чатов | [Color=Red]Mute 30 минут[/color].[/CENTER]<br>" +
        '[Color=Lime][CENTER]Одобрено, закрыто.[/CENTER]<br>' +
        "[CENTER] Приятной игры на [Color=Red]Black Russia [/I][/CENTER][/color][/FONT]",
               prefix: ACCEPT_PREFIX,
      status: false,
                       },
                    {
        title: '| реклама промкода |',
	  content:
		"[B][FONT=GEORGIA][CENTER][COLOR=yellow]{{ greeting }}, уважаемый игрок. [/COLOR][/CENTER][/B]<br><br>"+
'[CENTER][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/CENTER]<br><br>' +
        "[B][CENTER][COLOR=WHITE]Ваша жалоба была одобрена и игрок будет наказан по следующим пунктам правил проекта:<br> [color=red]3.21.[/color] Запрещается реклама промокодов в игре, а также их упоминание в любом виде во всех чатах. [color=red]| Ban 30 дней[/color] <br><br> Одобрено, закрыто."+
"[CENTER][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/CENTER]<br>",
               prefix: ACCEPT_PREFIX,
      status: false,
                       },
                    {
        title: '| объявление в госс помещениях |',
	  content:
		"[B][FONT=GEORGIA][CENTER][COLOR=yellow]{{ greeting }}, уважаемый игрок. [/COLOR][/CENTER][/B]<br><br>"+
'[CENTER][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/CENTER]<br><br>' +
        "[B][CENTER][COLOR=WHITE]Ваша жалоба была одобрена и игрок будет наказан по следующим пунктам правил проекта:<br> [color=red]3.22.[/color] Запрещено публиковать любые объявления в помещениях государственных организаций вне зависимости от чата (IC или OOC) [color=red]| Mute 30 минут[/color] <br><br> Одобрено, закрыто."+
"[CENTER][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/CENTER]<br>",
               prefix: ACCEPT_PREFIX,
      status: false,
                       },
                    {
        title: '| мат в vip |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]<br>' +
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Нарушитель будет наказан по данному пункту правил:<br> [Color=Red]3.23[/color]. Запрещено использование нецензурных слов, в том числе завуалированных и литературных в VIP чате | [Color=Red]Mute 30 минут[/color].[/CENTER]<br>" +
        '[Color=Lime][CENTER]Одобрено, закрыто.[/CENTER][/color] <br> '+
        "[CENTER] Приятной игры на [Color=Red]Black Russia [/I][/CENTER][/color][/FONT]",
               prefix: ACCEPT_PREFIX,
      status: false,
                       },
            {
        title: '------------------------------------------------------------ одобрено(рп процесс) ----------------------------------------------------------------',
                                   },
                    {
        title: '| nrp поведение |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]<br>' +
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][FONT=georgia][I][B]Нарушитель будет наказан по пункту правил:<br> [Color=Red]2.01[/COLOR]. Запрещено поведение, нарушающее нормы процессов Role Play режима игры | [Color=Red]Jail 30 минут [/color].[/FONT][/I][/B][/CENTER] " +
        '[Color=Lime][CENTER]Одобрено, закрыто[/color].<br> ' +
        "[CENTER] Приятной игры на [Color=Red]Black Russia [/I][/CENTER][/color][/FONT]",
               prefix: ACCEPT_PREFIX,
      status: false,
                       },
                    {
        title: '| уход от RP |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]<br>' +
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Нарушитель будет наказан по данному пункту правил:<br>[Color=Red]2.02[/COLOR]. Запрещено целенаправленно уходить от Role Play процесса всеразличными способами | [Color=Red]Jail 30 минут / Warn[/color].[/CENTER]<br>" +
        '[Color=Lime][CENTER]Одобрено, закрыто.[/CENTER][/color] <br>' +
        "[CENTER] Приятной игры на [Color=Red]Black Russia [/I][/CENTER][/color][/FONT]",
               prefix: ACCEPT_PREFIX,
      status: false,
                       },
                    {
        title: '| nrp drive |',
	  content:
		"[B][FONT=GEORGIA][CENTER][COLOR=yellow]{{ greeting }}, уважаемый игрок. [/COLOR][/CENTER][/B]<br><br>"+
'[CENTER][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/CENTER]<br><br>' +
        "[B][CENTER][COLOR=WHITE]Ваша жалоба была одобрена и игрок будет наказан по следующим пунктам правил проекта:<br> [color=red]2.03.[/color] Запрещён NonRP Drive — вождение любого транспортного средства в невозможных для него условиях, а также вождение в неправдоподобной манере [color=red]| Jail 30 минут[/color] <br><br> Одобрено, закрыто."+
"[CENTER][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/CENTER]<br>",
               prefix: ACCEPT_PREFIX,
      status: false,
                       },
                       {
        title: '| nrp в/ч |',
	  content:
		"[B][FONT=GEORGIA][CENTER][COLOR=yellow]{{ greeting }}, уважаемый игрок. [/COLOR][/CENTER][/B]<br><br>"+
'[CENTER][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/CENTER]<br><br>' +
        "[B][CENTER][COLOR=WHITE]Ваша жалоба была одобрена и игрок будет наказан по следующим пунктам правил нападений на военную часть:<br> [color=red]2.[/color] За нарушение правил нападения на Войсковую Часть выдаётся предупреждение [color=red]| Jail 30 минут (NonRP нападение) / Warn (Для сотрудников ОПГ)[/color] <br><br> Одобрено, закрыто."+
"[CENTER][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/CENTER]<br>",
               prefix: ACCEPT_PREFIX,
      status: false,
                       },
                        {
        title: '| Nrp drive на фуре/инкос |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]<br>' +
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Нарушитель будет наказан по данному пункту правил:<br> [Color=Red]2.47[/color]. Запрещено ездить по полям на грузовом транспорте, инкассаторских машинах (работа дальнобойщика, инкассатора) | [Color=Red]Jail 60 минут[/color].[/CENTER]<br>" +
        '[Color=Lime][CENTER]Одобрено, закрыто.[/CENTER][/color] <br>' +
        "[CENTER] Приятной игры на [Color=Red]Black Russia [/I][/CENTER][/color][/FONT]",
               prefix: ACCEPT_PREFIX,
      status: false,
                       },
                    {
        title: '| помеха игровому процессу |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]<br>' +
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Нарушитель будет наказан по данному пункту правил:<br> [Color=Red]2.04[/color]. Запрещены любые действия способные привести к помехам в игровом процессе, а также выполнению работ, если они этого не предусматривают и если эти действия выходят за рамки игрового процесса данной работы. | [Color=Red]Ban 10 дней / Обнуление аккаунта (при повторном нарушении)[/color].[/CENTER]<br>" +
        '[Color=Lime][CENTER]Одобрено, закрыто.[/CENTER][/color] <br>' +
        "[CENTER] Приятной игры на [Color=Red]Black Russia [/I][/CENTER][/color][/FONT]",
               prefix: ACCEPT_PREFIX,
      status: false,
                       },
                    {
        title: '| NRP обман/попытка |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]<br>' +
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Нарушитель будет наказан по данному пункту правил:<br> [Color=Red]2.05[/color]. Запрещены любые OOC обманы и их попытки, а также любые IC обманы с нарушением Role Play правил и логики | [Color=Red]PermBan[/color].[/CENTER]<br>" +
        '[Color=Lime][CENTER]Одобрено, закрыто.[/CENTER][/color] <br>' +
        "[CENTER] Приятной игры на [Color=Red]Black Russia [/I][/CENTER][/color][/FONT]",
               prefix: ACCEPT_PREFIX,
      status: false,
                       },
                    {
        title: '| аморал |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]<br>' +
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Нарушитель будет наказан по данному пункту правил:<br> [Color=Red]2.08[/color]. Запрещена любая форма аморальных действий сексуального характера в сторону игроков | [Color=Red]Jail 30 минут / Warn[/color].[/CENTER]<br>" +
        '[Color=Lime][CENTER]Одобрено, закрыто.[/CENTER][/color] <br>' +
        "[CENTER] Приятной игры на [Color=Red]Black Russia [/I][/CENTER][/color][/FONT]",
               prefix: ACCEPT_PREFIX,
      status: false,
                       },
                    {
        title: '| слив склада фрак/семьи |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]<br>' +
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Нарушитель будет наказан по данному пункту правил:<br> [Color=Red]2.09[/color]. Запрещено сливать склад фракции / семьи путем взятия большого количества ресурсов, или же брать больше, чем разрешили на самом деле | [Color=Red]Ban 15 - 30 дней / PermBan[/color].[/CENTER]<br>" +
        '[Color=Lime][CENTER]Одобрено, закрыто.[/CENTER][/color]<br>' +
        "[CENTER] Приятной игры на [Color=Red]Black Russia [/I][/CENTER][/color][/FONT]",
               prefix: ACCEPT_PREFIX,
      status: false,
                       },
                    {
        title: '| обман в /do |',
	  content:
		"[B][FONT=GEORGIA][CENTER][COLOR=yellow]{{ greeting }}, уважаемый игрок. [/COLOR][/CENTER][/B]<br><br>"+
'[CENTER][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/CENTER]<br><br>' +
        "[B][CENTER][COLOR=WHITE]Ваша жалоба была одобрена и игрок будет наказан по следующим пунктам правил проекта:<br> [color=red]2.10.[/color] Запрещено в любой форме обманывать в /do, даже если это в дальнейшем негативно скажется на Вашем игровом персонаже [color=red]| Jail 30 минут / Warn[/color] <br><br> Одобрено, закрыто."+
"[CENTER][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/CENTER]<br>",
               prefix: ACCEPT_PREFIX,
      status: false,
                       },
                    {
        title: '| рабочий транспорт в лц |',
	  content:
		"[B][FONT=GEORGIA][CENTER][COLOR=yellow]{{ greeting }}, уважаемый игрок. [/COLOR][/CENTER][/B]<br><br>"+
'[CENTER][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/CENTER]<br><br>' +
        "[B][CENTER][COLOR=WHITE]Ваша жалоба была одобрена и игрок будет наказан по следующим пунктам правил проекта:<br> [color=red]2.11.[/color] Запрещено использование рабочего или фракционного транспорта в личных целях [color=red]| Jail 30 минут[/color] <br><br> Одобрено, закрыто."+
"[CENTER][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/CENTER]<br>",
               prefix: ACCEPT_PREFIX,
      status: false,
                       },
                    {
        title: '| помеха работе блогерам |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]<br>' +
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Нарушитель будет наказан по данному пункту правил:<br> [Color=Red]2.12[/color]. Запрещена помеха в работе блогеров, стримеров (медиа лиц), которые находятся на официальном сотрудничестве с проектом | [Color=Red]Ban 7 дней[/color].[/CENTER]<br>" +
        '[Color=Lime][CENTER]Одобрено, закрыто.[/CENTER][/color] <br>' +
        "[CENTER] Приятной игры на [Color=Red]Black Russia [/I][/CENTER][/color][/FONT]",
               prefix: ACCEPT_PREFIX,
      status: false,
                       },
                    {
        title: '| DB (DriveBy] |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]<br>' +
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Нарушитель будет наказан по данному пункту правил:<br> [Color=Red]2.13[/color]. Запрещен DB (DriveBy) — намеренное убийство / нанесение урона без веской IC причины на любом виде транспорта | [Color=Red]Jail 60 минут[/color].[/CENTER]<br>" +
        '[Color=Lime][CENTER]Одобрено, закрыто.[/CENTER][/color] <br>' +
        "[CENTER] Приятной игры на [Color=Red]Black Russia [/I][/CENTER][/color][/FONT]",
               prefix: ACCEPT_PREFIX,
      status: false,
                       },
                    {
        title: '| TK (teamkill) |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]<br>' +
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Нарушитель будет наказан по данному пункту правил:<br> [Color=Red]2.15[/color]. Запрещен TK (Team Kill) — убийство члена своей или союзной фракции, организации без наличия какой-либо IC причины | [Color=Red]Jail 60 минут / Warn[/color] ([Color=Orange]за два и более убийства[/color])[/CENTER]<br>" +
        '[Color=Lime][CENTER]Одобрено, закрыто.[/CENTER][/color] <br>' +
        "[CENTER] Приятной игры на [Color=Red]Black Russia [/I][/CENTER][/color][/FONT]",
               prefix: ACCEPT_PREFIX,
      status: false,
                       },
                    {
        title: '| SK (spawnkill) |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]<br>' +
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Нарушитель будет наказан по данному пункту правил:<br> [Color=Red]2.16[/color]. Запрещен SK (Spawn Kill) — убийство или нанесение урона на титульной территории любой фракции / организации, на месте появления игрока, а также на выходе из закрытых интерьеров и около них | [Color=Red]Jail 60 минут / Warn[/color] ([Color=Orange]за два и более убийства[/color]).[/CENTER]<br>" +
        '[Color=Lime][CENTER]Одобрено, закрыто.[/CENTER][/color] <br>' +
        "[CENTER] Приятной игры на [Color=Red]Black Russia [/I][/CENTER][/color][/FONT]",
               prefix: ACCEPT_PREFIX,
      status: false,
                       },
                    {
        title: '| MG |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]<br>' +
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Нарушитель будет наказан по данному пункту правил:<br> [Color=Red]2.18[/color]. Запрещен MG (MetaGaming) — использование ООС информации, которую Ваш персонаж никак не мог получить в IC процессе | [Color=Red]Mute 30 минут[/color].[/CENTER]<br>" +
        '[Color=Lime][CENTER]Одобрено, закрыто.[/CENTER][/color] <br>' +
        "[CENTER] Приятной игры на [Color=Red]Black Russia [/I][/CENTER][/color][/FONT]",
               prefix: ACCEPT_PREFIX,
      status: false,
                       },
                    {
        title: '| DM (DeathMatch) |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]<br>' +
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Нарушитель будет наказан по данному пункту правил:<br> [Color=Red]2.19[/color]. Запрещен DM (DeathMatch) — убийство или нанесение урона без веской IC причины | [Color=Red]Jail 60 минут[/color].[/CENTER]<br>" +
        '[Color=Lime][CENTER]Одобрено, закрыто.[/CENTER][/color] <br>' +
        "[CENTER] Приятной игры на [Color=Red]Black Russia [/I][/CENTER][/color][/FONT]",
               prefix: ACCEPT_PREFIX,
      status: false,
                       },
                    {
        title: '| MASS DM |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]<br>' +
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Нарушитель будет наказан по данному пункту правил:<br> [Color=Red]2.20[/color]. Запрещен Mass DM (Mass DeathMatch) — убийство или нанесение урона без веской IC причины трем игрокам и более | [Color=Red]Warn / Ban 3 - 7 дней[/color].[/CENTER]<br>" +
        '[Color=Lime][CENTER]Одобрено, закрыто.[/CENTER][/color]<br>' +
        "[CENTER] Приятной игры на [Color=Red]Black Russia [/I][/CENTER][/color][/FONT]",
               prefix: ACCEPT_PREFIX,
      status: false,
                       },
                    {
        title: '| обход системы |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]<br>' +
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Нарушитель будет наказан по данному пункту правил:<br> [Color=Red]2.21[/color]. Запрещено пытаться обходить игровую систему или использовать любые баги сервера | [Color=Red]Ban 15 - 30 дней / PermBan (по согласованию с ГА, ЗГА, руководством тех. специалистов)[/color].[/CENTER]<br>" +
        '[Color=Lime][CENTER]Одобрено, закрыто.[/CENTER][/color] <br>' +
        "[CENTER] Приятной игры на [Color=Red]Black Russia [/I][/CENTER][/color][/FONT]",
               prefix: ACCEPT_PREFIX,
      status: false,
                       },
                    {
        title: '| читы |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]<br>' +
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][FONT=georgia][B][I]Нарушитель будет наказан по пункту правил:<br> [Color=Red]2.22[/color]. Запрещено хранить / использовать / распространять стороннее программное обеспечение или любые другие средства, позволяющие получить преимущество над другими игроками | [Color=Red] Ban 15 - 30 дней / PermBan[/color] <br>" +
        '[Color=Lime][CENTER]Одобрено, закрыто.[/CENTER][/color] <br>' +
        "[CENTER] Приятной игры на [Color=Red]Black Russia [/I][/CENTER][/color][/FONT]",
               prefix: ACCEPT_PREFIX,
      status: false,
                       },
                    {
        title: '| сокрытие багов от администрации |',
	  content:
		"[B][FONT=GEORGIA][CENTER][COLOR=yellow]{{ greeting }}, уважаемый игрок. [/COLOR][/CENTER][/B]<br><br>"+
'[CENTER][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/CENTER]<br><br>' +
        "[B][CENTER][COLOR=WHITE]Ваша жалоба была одобрена и игрок будет наказан по следующим пунктам правил проекта:<br> [color=red]2.23.[/color] Запрещено скрывать от администрации ошибки игровых систем, а также распространять их игрокам [color=red]| Ban 15 - 30 дней / PermBan[/color] <br><br> Одобрено, закрыто."+
"[CENTER][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/CENTER]<br>",
               prefix: ACCEPT_PREFIX,
      status: false,
                       },
                    {
        title: '| сокрытие нарушителей |',
	  content:
		"[B][FONT=GEORGIA][CENTER][COLOR=yellow]{{ greeting }}, уважаемый игрок. [/COLOR][/CENTER][/B]<br><br>"+
'[CENTER][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/CENTER]<br><br>' +
        "[B][CENTER][COLOR=WHITE]Ваша жалоба была одобрена и игрок будет наказан по следующим пунктам правил проекта:<br> [color=red]2.24.[/color] Запрещено скрывать от администрации нарушителей или злоумышленников [color=red]| Ban 15 - 30 дней / PermBan + ЧС проекта[/color] <br><br> Одобрено, закрыто."+
"[CENTER][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/CENTER]<br>",
               prefix: ACCEPT_PREFIX,
      status: false,
                       },
                    {
        title: '| реклама |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]<br>' +
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Нарушитель будет наказан по данному пункту правил:<br> [Color=Red]2.31[/color]. Запрещено рекламировать на серверах любые проекты, серверы, сайты, сторонние Discord-серверы, YouTube каналы и тому подобное | [Color=Red]Ban 7 дней / PermBan[/color].[/CENTER]<br>" +
        '[Color=Lime][CENTER]Одобрено, закрыто.[/CENTER][/color] <br>' +
        "[CENTER] Приятной игры на [Color=Red]Black Russia [/I][/CENTER][/color][/FONT]",
               prefix: ACCEPT_PREFIX,
      status: false,
                       },
                    {
        title: '| обман/ввод в заблуждение администрацию  |',
	  content:
		"[B][FONT=GEORGIA][CENTER][COLOR=yellow]{{ greeting }}, уважаемый игрок. [/COLOR][/CENTER][/B]<br><br>"+
'[CENTER][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/CENTER]<br><br>' +
        "[B][CENTER][COLOR=WHITE]Ваша жалоба была одобрена и игрок будет наказан по следующим пунктам правил проекта:<br> [color=red]2.32.[/color] Запрещено введение в заблуждение, обман администрации на всех ресурсах проекта [color=red]| Ban 7 - 15 дней[/color] <br><br> Одобрено, закрыто."+
"[CENTER][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/CENTER]<br>",
               prefix: ACCEPT_PREFIX,
      status: false,
                       },
                    {
        title: '| конфликты на почве разногласий национальности |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]<br>' +
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Нарушитель будет наказан по данному пункту правил:<br> [Color=Red]2.35[/color]. На игровых серверах запрещено устраивать IC и OOC конфликты на почве разногласия о национальности и / или религии совершенно в любом формате | [Color=Red]Mute 120 минут / Ban 7 дней[/color].[/CENTER]<br>" +
        '[Color=Lime][CENTER]Одобрено, закрыто.[/CENTER][/color] <br>' +
        "[CENTER] Приятной игры на [Color=Red]Black Russia [/I][/CENTER][/color][/FONT]",
               prefix: ACCEPT_PREFIX,
      status: false,
                       },
                    {
        title: '| OOC Угрозы |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]<br>' +
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Нарушитель будет наказан по пункту правил:<br> [Color=Red]2.37[/color]. Запрещены OOC-угрозы, в том числе и завуалированные, а также угрозы наказанием со стороны администрации | [Color=Red]Mute 120 минут / Ban 7 - 15 дней.[/color]<br>" +
        '[Color=Lime][CENTER]Одобрено, закрыто.[/CENTER][/color] <br>' +
        "[CENTER]Приятной игры на [Color=Red]Black Russia [/I][/CENTER][/color][/FONT][/B]",
               prefix: ACCEPT_PREFIX,
      status: false,
                       },
                    {
        title: '| распростронение информации игроков |',
	  content:
		"[B][FONT=GEORGIA][CENTER][COLOR=yellow]{{ greeting }}, уважаемый игрок. [/COLOR][/CENTER][/B]<br><br>"+
'[CENTER][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/CENTER]<br><br>' +
        "[B][CENTER][COLOR=WHITE]Ваша жалоба была одобрена и игрок будет наказан по следующим пунктам правил проекта:<br> [color=red]2.38.[/color] Запрещено распространять личную информацию игроков и их родственников [color=red]| Ban 15 - 30 дней / PermBan + ЧС проекта[/color] <br><br> Одобрено, закрыто."+
"[CENTER][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/CENTER]<br>",
               prefix: ACCEPT_PREFIX,
      status: false,
                       },
                    {
        title: '| злоупотребление правил серверов |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]<br>' +
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][B][I][FONT=georgia]Нарушитель будет наказан по пункту правил:<br> [Color=Red]2.39[/color]. Злоупотребление нарушениями правил сервера | [Color=Red]Ban 7 - 15 дней [/color].[/CENTER]" +
        '[Color=Lime][CENTER]Одобрено, закрыто.[/CENTER][/color] <br>' +
        "[CENTER] Приятной игры на [Color=Red]Black Russia [/I][/CENTER][/color][/FONT]",
               prefix: ACCEPT_PREFIX,
      status: false,
                       },
                    {
        title: '| критика проекта |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]<br>' +
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Нарушитель будет наказан по данному пункту правил:<br> [Color=Red]2.40[/color]. Запрещены совершенно любые деструктивные действия по отношению к проекту: неконструктивная критика, призывы покинуть проект, попытки нарушить развитие проекта или любые другие действия, способные привести к помехам в игровом процессе | [Color=Red]Mute 300 минут / Ban 30 дней[/color] ([Color=Cyan]Ban выдается по согласованию с главным администратором[/color])[/CENTER]<br>" +
        '[Color=Lime][CENTER]Одобрено, закрыто.[/CENTER][/color] <br>' +
        "[CENTER] Приятной игры на [Color=Red]Black Russia [/I][/CENTER][/color][/FONT]",
               prefix: ACCEPT_PREFIX,
      status: false,
                       },
                    {
        title: '| продажа имущества за реал средства |',
	  content:
		"[B][FONT=GEORGIA][CENTER][COLOR=yellow]{{ greeting }}, уважаемый игрок. [/COLOR][/CENTER][/B]<br><br>"+
'[CENTER][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/CENTER]<br><br>' +
        "[B][CENTER][COLOR=WHITE]Ваша жалоба была одобрена и игрок будет наказан по следующим пунктам правил проекта:<br> [color=red]2.42.[/color] Попытка продажи любого игрового имущества или игрового аккаунта за реальные деньги [color=red]| PermBan[/color] <br><br> Одобрено, закрыто."+
"[CENTER][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/CENTER]<br>",
               prefix: ACCEPT_PREFIX,
      status: false,
                       },
                    {
        title: '| продажа системного промокода |',
	  content:
		"[B][FONT=GEORGIA][CENTER][COLOR=yellow]{{ greeting }}, уважаемый игрок. [/COLOR][/CENTER][/B]<br><br>"+
'[CENTER][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/CENTER]<br><br>' +
        "[B][CENTER][COLOR=WHITE]Ваша жалоба была одобрена и игрок будет наказан по следующим пунктам правил проекта:<br> [color=red]2.43.[/color] Запрещена продажа / обмен / покупка поощрительной составляющей от лица проекта, будь то бонус-код, либо промокод, который выдается безвозмездно игрокам в целях промоакций [color=red]| Mute 120 минут[/color] <br><br> Одобрено, закрыто."+
"[CENTER][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/CENTER]<br>",
               prefix: ACCEPT_PREFIX,
      status: false,
                       },
                {
        title: '| арест в в интерьере аук, каз, сист. мероприятия |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]<br>' +
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Нарушитель будет наказан по данному пункту правил:<br> [Color=Red]2.50[/color]. Запрещены задержания, аресты, а также любые действия со стороны игроков, состоящих во фракциях в интерьере аукциона, казино, а также во время системных мероприятий  | [Color=Red]Ban 7 - 15 дней + увольнение из организации[/color].[/CENTER]<br>" +
        '[Color=Lime][CENTER]Одобрено, закрыто.[/CENTER][/color] <br>' +
        "[CENTER] Приятной игры на [Color=Red]Black Russia [/I][/CENTER][/color][/FONT]",
               prefix: ACCEPT_PREFIX,
      status: false,
                       },
                    {
        title: '| неуважение к администрации |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]<br>' +
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Нарушитель будет наказан по данному пункту правил:<br> [Color=Red]2.54[/color]. Запрещено неуважительное обращение, оскорбление, неадекватное поведение, угрозы в любом проявлении по отношению к администрации. | [Color=Red]Mute 180 минут[/CENTER]<br>" +
        '[Color=Lime][CENTER]Одобрено, закрыто.[/CENTER][/color] <br>' +
        "[CENTER] Приятной игры на [Color=Red]Black Russia [/I][/CENTER][/color][/FONT]",
               prefix: ACCEPT_PREFIX,
      status: false,
                       },
                    {
        title: '| багоюз с анимацией |',
	  content:
		"[B][FONT=GEORGIA][CENTER][COLOR=yellow]{{ greeting }}, уважаемый игрок. [/COLOR][/CENTER][/B]<br><br>"+
'[CENTER][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/CENTER]<br><br>' +
        "[B][CENTER][COLOR=WHITE]Ваша жалоба была одобрена и игрок будет наказан по следующим пунктам правил проекта:<br> [color=red]2.55.[/color] Запрещается багоюз, связанный с анимацией в любых проявлениях. [color=red]| Jail 120 минут[/color] <br><br> Одобрено, закрыто."+
"[CENTER][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/CENTER]<br>",
               prefix: ACCEPT_PREFIX,
      status: false,
                       },

                {
        title: '-------------------------------------------------------------- передача ------------------------------------------------------------------',
                                   },
                        {
        title: '| ГА |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]<br>' +
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Ваша жалоба была передана на рассмотрение [COLOR=rgb(255, 0, 0)]Главному Администратору[/COLOR].[/CENTER]<br>" +
        '[Color=Flame][CENTER]Ожидайте ответа.[/I][/CENTER][/color][/FONT]',
               prefix: MAINADM_PREFIX,
      status: true,
                       },
                            {
        title: '| ЗГА |',
	  content:
		"[B][FONT=GEORGIA][CENTER][COLOR=yellow]{{ greeting }}, уважаемый игрок. [/COLOR][/CENTER][/B]<br><br>"+
'[CENTER][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/CENTER]<br><br>' +
        "[B][CENTER][COLOR=WHITE]Ваша жалоба была передана на рассмотрение [color=red]Заместителю главного администратора[/color] <br><br> Ожидайте ответа в данной теме и не создавайте её дубликатов."+
"[CENTER][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/CENTER]<br>",
               prefix: PIN_PREFIX,
      status: true,
                       },
                            {
        title: '| теху |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]<br>' +
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Ваша жалоба была передана на рассмотрение [COLOR=rgb(0, 0, 255)]техническому специалисту[/COLOR].[/CENTER]<br>" +
        '[Color=Flame][CENTER]Ожидайте ответа.[/I][/CENTER][/color][/FONT]',
               prefix: TEXY_PREFIX,
      status: true,
                       },
            {
        title: '----------------------------------------------------------------- отказы --------------------------------------------------------------------------',
                                   },
                    {
        title: '| не по форме |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]<br>' +
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Ваша жалоба составлена не по форме. Убедительная просьба ознакомиться [Color=Red]с правилами подачи жалоб на игроков[/color].[/CENTER]<br>" +
        '[Color=Red][CENTER]Отказано, закрыто.[/I][/CENTER][/color][/FONT]',
               prefix: UNACCEPT_PREFIX,
      status: false,
                       },
                        {
        title: '| нет докв |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]<br>' +
         '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
          "[CENTER]В вашей жалобе отсутствуют какие-либо доказательства.[/CENTER]<br>" +
        '[Color=Red][CENTER]Закрыто.[/I][/CENTER][/color][/FONT]',
               prefix: UNACCEPT_PREFIX,
      status: false,
                       },
                            {
        title: '| не работают доквы |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]<br>' +
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Ваши доказательства не рабочие/обрезанные, перезалейте их правильно и без обрезаний.[/CENTER]<br>" +
        '[Color=Red][CENTER]Отказано, закрыто.[/I][/CENTER][/color][/FONT]',
               prefix: UNACCEPT_PREFIX,
      status: false,
                       },
                            {
        title: '| нужен фрапс |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]<br>' +
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][B][I][FONT=georgia]В таких случаях нужен фрапс.[/CENTER]" +
        '[Color=Red][CENTER]Отказано, закрыто.[/I][/CENTER][/color][/FONT]',
               prefix: UNACCEPT_PREFIX,
      status: false,
                       },
                            {
        title: '| оффтоп |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]<br>' +
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Вы ошиблись разделом, переподайте жалобу в нужный раздел.[/CENTER]<br>",
               prefix: UNACCEPT_PREFIX,
      status: false,
                       },
                            {
        title: '| дубликат |',
	  content:
		"[B][FONT=GEORGIA][CENTER][COLOR=yellow]{{ greeting }}, уважаемый игрок. [/COLOR][/CENTER][/B]<br><br>"+
'[CENTER][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/CENTER]<br><br>' +
        "[B][CENTER][COLOR=WHITE]Подобная жалоба уже была рассмотрена. Просьба не создавать подобные копии тем. <br><br> Отказано, закрыто."+
"[CENTER][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/CENTER]<br>",
               prefix: UNACCEPT_PREFIX,
      status: false,
                       },
                            {
        title: '| неадекват жалоба |',
	  content:
		"[B][FONT=GEORGIA][CENTER][COLOR=yellow]{{ greeting }}, уважаемый игрок. [/COLOR][/CENTER][/B]<br><br>"+
'[CENTER][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/CENTER]<br><br>' +
        "[B][CENTER][COLOR=WHITE]Ваша жалоба составлена неадекватно. <br><br> Отказано, закрыто."+
"[CENTER][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/CENTER]<br>",
               prefix: UNACCEPT_PREFIX,
      status: false,
                       },
                            {
        title: '| более 72 часов |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]<br>' +
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][B][I][FONT=georgia]С момента получения наказания прошло более 72 часов.[/CENTER]" +
        '[Color=Red][CENTER]Отказано, закрыто.[/I][/CENTER][/color][/FONT]',
               prefix: UNACCEPT_PREFIX,
      status: false,
                       },
                       {
      title: '| Нету /time |',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]<br>' +
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]На ваших доказательствах отсутствует /time.[/CENTER]<br>" +
        '[Color=Red][CENTER]Отказано, закрыто.[/I][/CENTER][/color][/FONT]',
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
      title: '| Нету условий сделки |',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]<br>' +
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][B][I][FONT=georgia]В данных доказательствах отсутствуют условия сделки[/CENTER]" +
        '[Color=Red][CENTER]Отказано, закрыто.[/I][/CENTER][/color][/FONT]',
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
      title: '| Нарушений не найдено |',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]<br>' +
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Нарушений со стороны данного игрока не было найдено.[/CENTER]<br>" +
        '[Color=Red][CENTER]Отказано, закрыто.[/I][/CENTER][/color][/FONT]',
      prefix: UNACCEPT_PREFIX,
      status: false,
        },




];

	$(document).ready(() => {
	// Загрузка скрипта для обработки шаблонов
	$('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');

	// Добавление кнопок при загрузке страницы
        	addButton('Ответы💥', 'selectAnswer');
	addButton('На рассмотрение', 'pin');
	addButton('Отказано⛔', 'unaccept');
	addButton('Одобрено✅', 'accepted');
	addButton('Специальному Администратору💥', 'specadm');
    addButton('Теху', 'Texy');
	addButton('Главному Администратору💥', 'mainadm');
    addButton('Закрыто⛔', 'Zakrito');
    addButton('Решено✅', 'Resheno');
    addButton('Закрыто⛔', 'Zakrito');
    addButton('Реализовано💫', 'Realizovano');
    addButton('Рассмотрено✅', 'Rassmotreno');
    addButton('Ожидание', 'Ojidanie');
    addButton('Без префикса⛔', 'Prefiks');
    addButton('Проверено контролем качества', 'Kachestvo');

	// Поиск информации о теме
	const threadData = getThreadData();

	$('button#unaccept').click(() => editThreadData(UNACCEPT_PREFIX, false));
	$('button#pin').click(() => editThreadData(PIN_PREFIX, true));
	$('button#accepted').click(() => editThreadData(ACCEPT_PREFIX, false));
	$('button#specadm').click(() => editThreadData(SPECADM_PREFIX, true));
	$('button#mainadm').click(() => editThreadData(MAINADM_PREFIX, true));
     $('button#Texy').click(() => editThreadData(TEXY_PREFIX, false));
    $('button#Zakrito').click(() => editThreadData(CLOSE_PREFIX, false));
	$('button#watched').click(() => editThreadData(WATCHED_PREFIX, false));
	$('button#decided').click(() => editThreadData(DECIDED_PREFIX, false));
    $('button#Resheno').click(() => editThreadData(RESHENO_PREFIX, false));
    $('button#Zakrito').click(() => editThreadData(CLOSE_PREFIX, false));
    $('button#Realizovano').click(() => editThreadData(REALIZOVANO_PREFIX, false));
    $('button#Vajno').click(() => editThreadData(VAJNO_PREFIX, false));
    $('button#Rassmotreno').click(() => editThreadData(RASSMOTRENO_PREFIX, false));
    $('button#Ojidanie').click(() => editThreadData(OJIDANIE_PREFIX, false));
    $('button#Prefiks').click(() => editThreadData(PREFIKS, false));
    $('button#Kachestvo').click(() => editThreadData(KACHESTVO, false));


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
	11 < hours && hours <= 18 ?
	'Добрый день' :
	18 < hours && hours <= 21 ?
	'Добрый вечер' :
	'Доброй ночи',
	};
	}

	function editThreadData(prefix, pin = false) {
	// Получаем заголовок темы, так как он необходим при запросе
	const threadTitle = $('.p-title-value')[0].lastChild.textContent;

	if (pin == false) {
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
	if (pin == true) {
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