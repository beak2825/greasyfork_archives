// ==UserScript==
// @name         Жалобы на игроков
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  yes
// @author       P.Moroznik
// @match        https://forum.blackrussia.online/threads/*
// @icon         https://avatars.mds.yandex.net/i?id=70fa275caf117351350b8ae6ac6116b2d1fc55e3-3752383-images-thumbs&n=13
// @grant        none
// @license    MIT
// @downloadURL https://update.greasyfork.org/scripts/543875/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B%20%D0%BD%D0%B0%20%D0%B8%D0%B3%D1%80%D0%BE%D0%BA%D0%BE%D0%B2.user.js
// @updateURL https://update.greasyfork.org/scripts/543875/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B%20%D0%BD%D0%B0%20%D0%B8%D0%B3%D1%80%D0%BE%D0%BA%D0%BE%D0%B2.meta.js
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
        title: '------------------------------------------------------------ одобрено(чаты/voice) ----------------------------------------------------------------',
                                   },

        {
        title: '| caps |',
	  content:
		"[B][FONT=GEORGIA][CENTER][COLOR=yellow]{{ greeting }}, уважаемый игрок. [/COLOR][/CENTER][/B]<br><br>"+
'[CENTER][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/CENTER]<br><br>' +
        "[B][CENTER][COLOR=WHITE]Ваша жалоба была одобрена и игрок будет наказан по следующим пунктам правил проекта:<br> [color=red]3.02.[/color] Запрещено использование верхнего регистра (CapsLock) при написании любого текста в любом чате [color=red]| Mute 30 минут[/color] <br><br> Одобрено, закрыто."+
"[CENTER][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/CENTER]<br>",
               prefix: ACCEPT_PREFIX,
      status: false,
                       },
            {
        title: '| оск в OOC |',
	  content:
		"[B][FONT=GEORGIA][CENTER][COLOR=yellow]{{ greeting }}, уважаемый игрок. [/COLOR][/CENTER][/B]<br><br>"+
'[CENTER][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/CENTER]<br><br>' +
        "[B][CENTER][COLOR=WHITE]Ваша жалоба была одобрена и игрок будет наказан по следующим пунктам правил проекта:<br> [color=red]3.03.[/color] Любые формы оскорблений, издевательств, расизма, дискриминации, религиозной враждебности, сексизма в OOC чате запрещены [color=red]| Mute 30 минут[/color] <br><br> Одобрено, закрыто."+
"[CENTER][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/CENTER]<br>",
               prefix: ACCEPT_PREFIX,
      status: false,
                       },
            {
        title: '| упом/оск род |',
	  content:
		"[B][FONT=GEORGIA][CENTER][COLOR=yellow]{{ greeting }}, уважаемый игрок. [/COLOR][/CENTER][/B]<br><br>"+
'[CENTER][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/CENTER]<br><br>' +
        "[B][CENTER][COLOR=WHITE]Ваша жалоба была одобрена и игрок будет наказан по следующим пунктам правил проекта:<br> [color=red]3.04.[/color] Запрещено оскорбление или косвенное упоминание родных вне зависимости от чата (IC или OOC) [color=red]| Mute 120 минут / Ban 7 - 15 дней[/color] <br><br> Одобрено, закрыто."+
"[CENTER][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/CENTER]<br>",
               prefix: ACCEPT_PREFIX,
      status: false,
                       },
            {
        title: '| flood |',
	  content:
		"[B][FONT=GEORGIA][CENTER][COLOR=yellow]{{ greeting }}, уважаемый игрок. [/COLOR][/CENTER][/B]<br><br>"+
'[CENTER][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/CENTER]<br><br>' +
        "[B][CENTER][COLOR=WHITE]Ваша жалоба была одобрена и игрок будет наказан по следующим пунктам правил проекта:<br> [color=red]3.05.[/color] Запрещен флуд — 3 и более повторяющихся сообщений от одного и того же игрока [color=red]| Mute 30 минут[/color] <br><br> Одобрено, закрыто."+
"[CENTER][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/CENTER]<br>",
               prefix: ACCEPT_PREFIX,
      status: false,
                       },
                {
        title: '| злоупотребление знаками |',
	  content:
		"[B][FONT=GEORGIA][CENTER][COLOR=yellow]{{ greeting }}, уважаемый игрок. [/COLOR][/CENTER][/B]<br><br>"+
'[CENTER][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/CENTER]<br><br>' +
        "[B][CENTER][COLOR=WHITE]Ваша жалоба была одобрена и игрок будет наказан по следующим пунктам правил проекта:<br> [color=red]3.06.[/color] Запрещено злоупотребление знаков препинания и прочих символов [color=red]| Mute 30 минут[/color] <br><br> Одобрено, закрыто."+
"[CENTER][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/CENTER]<br>",
               prefix: ACCEPT_PREFIX,
      status: false,
                       },
                    {
        title: '| слив глобального чата |',
	  content:
		"[B][FONT=GEORGIA][CENTER][COLOR=yellow]{{ greeting }}, уважаемый игрок. [/COLOR][/CENTER][/B]<br><br>"+
'[CENTER][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/CENTER]<br><br>' +
        "[B][CENTER][COLOR=WHITE]Ваша жалоба была одобрена и игрок будет наказан по следующим пунктам правил проекта:<br> [color=red]3.08.[/color] Запрещены любые формы «слива» посредством использования глобальных чатов [color=red]| PermBan[/color] <br><br> Одобрено, закрыто."+
"[CENTER][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/CENTER]<br>",
               prefix: ACCEPT_PREFIX,
      status: false,
                       },
                    {
        title: '| выдача себя за адм |',
	  content:
		"[B][FONT=GEORGIA][CENTER][COLOR=yellow]{{ greeting }}, уважаемый игрок. [/COLOR][/CENTER][/B]<br><br>"+
'[CENTER][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/CENTER]<br><br>' +
        "[B][CENTER][COLOR=WHITE]Ваша жалоба была одобрена и игрок будет наказан по следующим пунктам правил проекта:<br> [color=red]3.10.[/color] Запрещена выдача себя за администратора, если таковым не являетесь [color=red]| Ban 7 - 15 дней.[/color] <br><br> Одобрено, закрыто."+
"[CENTER][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/CENTER]<br>",
               prefix: ACCEPT_PREFIX,
      status: false,
                       },
                    {
        title: '| введение в забл командами |',
	  content:
		"[B][FONT=GEORGIA][CENTER][COLOR=yellow]{{ greeting }}, уважаемый игрок. [/COLOR][/CENTER][/B]<br><br>"+
'[CENTER][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/CENTER]<br><br>' +
        "[B][CENTER][COLOR=WHITE]Ваша жалоба была одобрена и игрок будет наказан по следующим пунктам правил проекта:<br> [color=red]3.11.[/color] Запрещено введение игроков проекта в заблуждение путем злоупотребления командами [color=red]| Ban 15 - 30 дней / PermBan[/color] <br><br> Одобрено, закрыто."+
"[CENTER][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/CENTER]<br>",
               prefix: ACCEPT_PREFIX,
      status: false,
                       },
                    {
        title: '| музыка войс |',
	  content:
		"[B][FONT=GEORGIA][CENTER][COLOR=yellow]{{ greeting }}, уважаемый игрок. [/COLOR][/CENTER][/B]<br><br>"+
'[CENTER][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/CENTER]<br><br>' +
        "[B][CENTER][COLOR=WHITE]Ваша жалоба была одобрена и игрок будет наказан по следующим пунктам правил проекта:<br> [color=red]3.14.[/color] Запрещено включать музыку в Voice Chat [color=red]| Mute 60 минут[/color] <br><br> Одобрено, закрыто."+
"[CENTER][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/CENTER]<br>",
               prefix: ACCEPT_PREFIX,
      status: false,
                       },
                    {
        title: '| шум войс |',
	  content:
		"[B][FONT=GEORGIA][CENTER][COLOR=yellow]{{ greeting }}, уважаемый игрок. [/COLOR][/CENTER][/B]<br><br>"+
'[CENTER][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/CENTER]<br><br>' +
        "[B][CENTER][COLOR=WHITE]Ваша жалоба была одобрена и игрок будет наказан по следующим пунктам правил проекта:<br> [color=red]3.16.[/color] Запрещено создавать посторонние шумы или звуки [color=red]| Mute 30 минут[/color] <br><br> Одобрено, закрыто."+
"[CENTER][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/CENTER]<br>",
               prefix: ACCEPT_PREFIX,
      status: false,
                       },
                    {
        title: '| политик/религиоз пропаганда/провокация |',
	  content:
		"[B][FONT=GEORGIA][CENTER][COLOR=yellow]{{ greeting }}, уважаемый игрок. [/COLOR][/CENTER][/B]<br><br>"+
'[CENTER][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/CENTER]<br><br>' +
        "[B][CENTER][COLOR=WHITE]Ваша жалоба была одобрена и игрок будет наказан по следующим пунктам правил проекта:<br> [color=red]3.18.[/color] Запрещено политическое и религиозное пропагандирование, а также провокация игроков к конфликтам, коллективному флуду или беспорядкам в любом из чатов [color=red]| Mute 120 минут / Ban 10 дней[/color] <br><br> Одобрено, закрыто."+
"[CENTER][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/CENTER]<br>",
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
		"[B][FONT=GEORGIA][CENTER][COLOR=yellow]{{ greeting }}, уважаемый игрок. [/COLOR][/CENTER][/B]<br><br>"+
'[CENTER][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/CENTER]<br><br>' +
        "[B][CENTER][COLOR=WHITE]Ваша жалоба была одобрена и игрок будет наказан по следующим пунктам правил проекта:<br> [color=red]3.20.[/color] Запрещено использование транслита в любом из чатов [color=red]| Mute 30 минут[/color] <br><br> Одобрено, закрыто."+
"[CENTER][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/CENTER]<br>",
               prefix: ACCEPT_PREFIX,
      status: false,
                       },
                    {
        title: '| реклама ютуб промкода |',
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
        title: '| мат в вип |',
	  content:
		"[B][FONT=GEORGIA][CENTER][COLOR=yellow]{{ greeting }}, уважаемый игрок. [/COLOR][/CENTER][/B]<br><br>"+
'[CENTER][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/CENTER]<br><br>' +
        "[B][CENTER][COLOR=WHITE]Ваша жалоба была одобрена и игрок будет наказан по следующим пунктам правил проекта:<br> [color=red]3.23.[/color] Запрещено использование нецензурных слов, в том числе завуалированных и литературных в VIP чате [color=red]| Mute 30 минут[/color] <br><br> Одобрено, закрыто."+
"[CENTER][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/CENTER]<br>",
               prefix: ACCEPT_PREFIX,
      status: false,
                       },
            {
        title: '------------------------------------------------------------ одобрено(рп процесс) ----------------------------------------------------------------',
                                   },
                    {
        title: '| nrp поведение |',
	  content:
		"[B][FONT=GEORGIA][CENTER][COLOR=yellow]{{ greeting }}, уважаемый игрок. [/COLOR][/CENTER][/B]<br><br>"+
'[CENTER][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/CENTER]<br><br>' +
        "[B][CENTER][COLOR=WHITE]Ваша жалоба была одобрена и игрок будет наказан по следующим пунктам правил проекта:<br> [color=red]2.01.[/color] Запрещено поведение, нарушающее нормы процессов Role Play режима игры [color=red]| Jail 30 минут[/color] <br><br> Одобрено, закрыто."+
"[CENTER][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/CENTER]<br>",
               prefix: ACCEPT_PREFIX,
      status: false,
                       },
                    {
        title: '| уход от RP |',
	  content:
		"[B][FONT=GEORGIA][CENTER][COLOR=yellow]{{ greeting }}, уважаемый игрок. [/COLOR][/CENTER][/B]<br><br>"+
'[CENTER][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/CENTER]<br><br>' +
        "[B][CENTER][COLOR=WHITE]Ваша жалоба была одобрена и игрок будет наказан по следующим пунктам правил проекта:<br> [color=red]2.02.[/color] Запрещено целенаправленно уходить от Role Play процесса всеразличными способами [color=red]| Jail 30 минут / Warn[/color] <br><br> Одобрено, закрыто."+
"[CENTER][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/CENTER]<br>",
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
        title: '| Nrp drive на фуре/инкос |',
	  content:
		"[B][FONT=GEORGIA][CENTER][COLOR=yellow]{{ greeting }}, уважаемый игрок. [/COLOR][/CENTER][/B]<br><br>"+
'[CENTER][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/CENTER]<br><br>' +
        "[B][CENTER][COLOR=WHITE]Ваша жалоба была одобрена и игрок будет наказан по следующим пунктам правил проекта:<br> [color=red]2.47.[/color] Запрещено ездить по полям на грузовом транспорте, инкассаторских машинах (работа дальнобойщика, инкассатора) [color=red]| Jail 60 минут[/color] <br><br> Одобрено, закрыто."+
"[CENTER][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/CENTER]<br>",
               prefix: ACCEPT_PREFIX,
      status: false,
                       },
                    {
        title: '| помеха игровому процессу |',
	  content:
		"[B][FONT=GEORGIA][CENTER][COLOR=yellow]{{ greeting }}, уважаемый игрок. [/COLOR][/CENTER][/B]<br><br>"+
'[CENTER][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/CENTER]<br><br>' +
        "[B][CENTER][COLOR=WHITE]Ваша жалоба была одобрена и игрок будет наказан по следующим пунктам правил проекта:<br> [color=red]2.04.[/color] Запрещены любые действия способные привести к помехам в игровом процессе, а также выполнению работ, если они этого не предусматривают и если эти действия выходят за рамки игрового процесса данной работы. [color=red]| Ban 10 дней / Обнуление аккаунта (при повторном нарушении)[/color] <br><br> Одобрено, закрыто."+
"[CENTER][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/CENTER]<br>",
               prefix: ACCEPT_PREFIX,
      status: false,
                       },
                    {
        title: '| NRP обман/попытка |',
	  content:
		"[B][FONT=GEORGIA][CENTER][COLOR=yellow]{{ greeting }}, уважаемый игрок. [/COLOR][/CENTER][/B]<br><br>"+
'[CENTER][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/CENTER]<br><br>' +
        "[B][CENTER][COLOR=WHITE]Ваша жалоба была одобрена и игрок будет наказан по следующим пунктам правил проекта:<br> [color=red]2.05.[/color] Запрещены любые OOC обманы и их попытки, а также любые IC обманы с нарушением Role Play правил и логики [color=red]| PermBan[/color] <br><br> Одобрено, закрыто."+
"[CENTER][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/CENTER]<br>",
               prefix: ACCEPT_PREFIX,
      status: false,
                       },
                    {
        title: '| аморал |',
	  content:
		"[B][FONT=GEORGIA][CENTER][COLOR=yellow]{{ greeting }}, уважаемый игрок. [/COLOR][/CENTER][/B]<br><br>"+
'[CENTER][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/CENTER]<br><br>' +
        "[B][CENTER][COLOR=WHITE]Ваша жалоба была одобрена и игрок будет наказан по следующим пунктам правил проекта:<br> [color=red]2.08.[/color] Запрещена любая форма аморальных действий сексуального характера в сторону игроков [color=red]| Jail 30 минут / Warn[/color] <br><br> Одобрено, закрыто."+
"[CENTER][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/CENTER]<br>",
               prefix: ACCEPT_PREFIX,
      status: false,
                       },
                    {
        title: '| слив склада фрак/семьи |',
	  content:
		"[B][FONT=GEORGIA][CENTER][COLOR=yellow]{{ greeting }}, уважаемый игрок. [/COLOR][/CENTER][/B]<br><br>"+
'[CENTER][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/CENTER]<br><br>' +
        "[B][CENTER][COLOR=WHITE]Ваша жалоба была одобрена и игрок будет наказан по следующим пунктам правил проекта:<br> [color=red]2.09.[/color] Запрещено сливать склад фракции / семьи путем взятия большого количества ресурсов или превышая допустимый лимит, установленный лидером [color=red]| Ban 15 - 30 дней / PermBan[/color] <br><br> Одобрено, закрыто."+
"[CENTER][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/CENTER]<br>",
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
        title: '| помеха работе медиа лиц на сотрудн. |',
	  content:
		"[B][FONT=GEORGIA][CENTER][COLOR=yellow]{{ greeting }}, уважаемый игрок. [/COLOR][/CENTER][/B]<br><br>"+
'[CENTER][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/CENTER]<br><br>' +
        "[B][CENTER][COLOR=WHITE]Ваша жалоба была одобрена и игрок будет наказан по следующим пунктам правил проекта:<br> [color=red]2.12.[/color] Запрещена помеха в работе блогеров, стримеров (медиа лиц), которые находятся на официальном сотрудничестве с проектом [color=red]| Ban 7 дней[/color] <br><br> Одобрено, закрыто."+
"[CENTER][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/CENTER]<br>",
               prefix: ACCEPT_PREFIX,
      status: false,
                       },
                    {
        title: '| DB (DriveBy] |',
	  content:
		"[B][FONT=GEORGIA][CENTER][COLOR=yellow]{{ greeting }}, уважаемый игрок. [/COLOR][/CENTER][/B]<br><br>"+
'[CENTER][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/CENTER]<br><br>' +
        "[B][CENTER][COLOR=WHITE]Ваша жалоба была одобрена и игрок будет наказан по следующим пунктам правил проекта:<br> [color=red]2.13.[/color] Запрещен DB (DriveBy) — намеренное убийство / нанесение урона без веской IC причины на любом виде транспорта [color=red]| Jail 60 минут[/color] <br><br> Одобрено, закрыто."+
"[CENTER][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/CENTER]<br>",
               prefix: ACCEPT_PREFIX,
      status: false,
                       },
                    {
        title: '| tk (teamkill) |',
	  content:
		"[B][FONT=GEORGIA][CENTER][COLOR=yellow]{{ greeting }}, уважаемый игрок. [/COLOR][/CENTER][/B]<br><br>"+
'[CENTER][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/CENTER]<br><br>' +
        "[B][CENTER][COLOR=WHITE]Ваша жалоба была одобрена и игрок будет наказан по следующим пунктам правил проекта:<br> [color=red]2.15.[/color] Запрещен TK (Team Kill) — убийство члена своей или союзной фракции, организации без наличия какой-либо IC причины [color=red] Jail 60 минут / Warn (за два и более убийства)[/color] <br><br> Одобрено, закрыто."+
"[CENTER][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/CENTER]<br>",
               prefix: ACCEPT_PREFIX,
      status: false,
                       },
                    {
        title: '| sk (spawnkill) |',
	  content:
		"[B][FONT=GEORGIA][CENTER][COLOR=yellow]{{ greeting }}, уважаемый игрок. [/COLOR][/CENTER][/B]<br><br>"+
'[CENTER][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/CENTER]<br><br>' +
        "[B][CENTER][COLOR=WHITE]Ваша жалоба была одобрена и игрок будет наказан по следующим пунктам правил проекта:<br> [color=red]2.16.[/color] Запрещен SK (Spawn Kill) — убийство или нанесение урона на титульной территории любой фракции / организации, на месте появления игрока, а также на выходе из закрытых интерьеров и около них [color=red]| Jail 60 минут / Warn (за два и более убийства)[/color] <br><br> Одобрено, закрыто."+
"[CENTER][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/CENTER]<br>",
               prefix: ACCEPT_PREFIX,
      status: false,
                       },
                    {
        title: '| MG |',
	  content:
		"[B][FONT=GEORGIA][CENTER][COLOR=yellow]{{ greeting }}, уважаемый игрок. [/COLOR][/CENTER][/B]<br><br>"+
'[CENTER][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/CENTER]<br><br>' +
        "[B][CENTER][COLOR=WHITE]Ваша жалоба была одобрена и игрок будет наказан по следующим пунктам правил проекта:<br> [color=red]2.18.[/color] Запрещен MG (MetaGaming) — использование ООС информации, которую Ваш персонаж никак не мог получить в IC процессе [color=red]| Mute 30 минут[/color] <br><br> Одобрено, закрыто."+
"[CENTER][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/CENTER]<br>",
               prefix: ACCEPT_PREFIX,
      status: false,
                       },
                    {
        title: '| DM (DeathMatch |',
	  content:
		"[B][FONT=GEORGIA][CENTER][COLOR=yellow]{{ greeting }}, уважаемый игрок. [/COLOR][/CENTER][/B]<br><br>"+
'[CENTER][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/CENTER]<br><br>' +
        "[B][CENTER][COLOR=WHITE]Ваша жалоба была одобрена и игрок будет наказан по следующим пунктам правил проекта:<br> [color=red]2.19.[/color] Запрещен DM (DeathMatch) — убийство или нанесение урона без веской IC причины [color=red]| Jail 60 минут[/color] <br><br> Одобрено, закрыто."+
"[CENTER][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/CENTER]<br>",
               prefix: ACCEPT_PREFIX,
      status: false,
                       },
                    {
        title: '| MASS DM |',
	  content:
		"[B][FONT=GEORGIA][CENTER][COLOR=yellow]{{ greeting }}, уважаемый игрок. [/COLOR][/CENTER][/B]<br><br>"+
'[CENTER][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/CENTER]<br><br>' +
        "[B][CENTER][COLOR=WHITE]Ваша жалоба была одобрена и игрок будет наказан по следующим пунктам правил проекта:<br> [color=red]2.20.[/color] Запрещен Mass DM (Mass DeathMatch) — убийство или нанесение урона без веской IC причины трем игрокам и более [color=red]| Warn / Ban 3 - 7 дней[/color] <br><br> Одобрено, закрыто."+
"[CENTER][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/CENTER]<br>",
               prefix: ACCEPT_PREFIX,
      status: false,
                       },
                    {
        title: '| обход системы |',
	  content:
		"[B][FONT=GEORGIA][CENTER][COLOR=yellow]{{ greeting }}, уважаемый игрок. [/COLOR][/CENTER][/B]<br><br>"+
'[CENTER][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/CENTER]<br><br>' +
        "[B][CENTER][COLOR=WHITE]Ваша жалоба была одобрена и игрок будет наказан по следующим пунктам правил проекта:<br> [color=red]2.21.[/color] Запрещено пытаться обходить игровую систему или использовать любые баги сервера [color=red]| Ban 15 - 30 дней / PermBan (по согласованию с ГА, ЗГА, руководством тех. специалистов)[/color] <br><br> Одобрено, закрыто."+
"[CENTER][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/CENTER]<br>",
               prefix: ACCEPT_PREFIX,
      status: false,
                       },
                    {
        title: '| читы |',
	  content:
		"[B][FONT=GEORGIA][CENTER][COLOR=yellow]{{ greeting }}, уважаемый игрок. [/COLOR][/CENTER][/B]<br><br>"+
'[CENTER][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/CENTER]<br><br>' +
        "[B][CENTER][COLOR=WHITE]Ваша жалоба была одобрена и игрок будет наказан по следующим пунктам правил проекта:<br> [color=red]2.22.[/color] Запрещено хранить / использовать / распространять стороннее программное обеспечение или любые другие средства, позволяющие получить преимущество над другими игроками [color=red]| Ban 15 - 30 дней / PermBan[/color] <br><br> Одобрено, закрыто."+
"[CENTER][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/CENTER]<br>",
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
		"[B][FONT=GEORGIA][CENTER][COLOR=yellow]{{ greeting }}, уважаемый игрок. [/COLOR][/CENTER][/B]<br><br>"+
'[CENTER][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/CENTER]<br><br>' +
        "[B][CENTER][COLOR=WHITE]Ваша жалоба была одобрена и игрок будет наказан по следующим пунктам правил проекта:<br> [color=red]2.31.[/color] Запрещено рекламировать на серверах любые проекты, серверы, сайты, сторонние Discord-серверы, YouTube-каналы и тому подобное [color=red]| Ban 7 дней / PermBan[/color] <br><br> Одобрено, закрыто."+
"[CENTER][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/CENTER]<br>",
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
		"[B][FONT=GEORGIA][CENTER][COLOR=yellow]{{ greeting }}, уважаемый игрок. [/COLOR][/CENTER][/B]<br><br>"+
'[CENTER][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/CENTER]<br><br>' +
        "[B][CENTER][COLOR=WHITE]Ваша жалоба была одобрена и игрок будет наказан по следующим пунктам правил проекта:<br> [color=red]2.35.[/color] На игровых серверах запрещено устраивать IC и OOC конфликты на почве разногласия о национальности и / или религии совершенно в любом формате [color=red]| Mute 120 минут / Ban 7 дней[/color] <br><br> Одобрено, закрыто."+
"[CENTER][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/CENTER]<br>",
               prefix: ACCEPT_PREFIX,
      status: false,
                       },
                    {
        title: '| OOC Угрозы |',
	  content:
		"[B][FONT=GEORGIA][CENTER][COLOR=yellow]{{ greeting }}, уважаемый игрок. [/COLOR][/CENTER][/B]<br><br>"+
'[CENTER][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/CENTER]<br><br>' +
        "[B][CENTER][COLOR=WHITE]Ваша жалоба была одобрена и игрок будет наказан по следующим пунктам правил проекта:<br> [color=red]2.37.[/color] Запрещены OOC-угрозы, в том числе и завуалированные, а также угрозы наказанием со стороны администрации [color=red]| Mute 120 минут / Ban 7 - 15 дней.[/color] <br><br> Одобрено, закрыто."+
"[CENTER][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/CENTER]<br>",
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
		"[B][FONT=GEORGIA][CENTER][COLOR=yellow]{{ greeting }}, уважаемый игрок. [/COLOR][/CENTER][/B]<br><br>"+
'[CENTER][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/CENTER]<br><br>' +
        "[B][CENTER][COLOR=WHITE]Ваша жалоба была одобрена и игрок будет наказан по следующим пунктам правил проекта:<br> [color=red]2.39.[/color] Злоупотребление нарушениями правил сервера [color=red]| Ban 7 - 15 дней[/color] <br><br> Одобрено, закрыто."+
"[CENTER][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/CENTER]<br>",
               prefix: ACCEPT_PREFIX,
      status: false,
                       },
                    {
        title: '| критика проекта |',
	  content:
		"[B][FONT=GEORGIA][CENTER][COLOR=yellow]{{ greeting }}, уважаемый игрок. [/COLOR][/CENTER][/B]<br><br>"+
'[CENTER][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/CENTER]<br><br>' +
        "[B][CENTER][COLOR=WHITE]Ваша жалоба была одобрена и игрок будет наказан по следующим пунктам правил проекта:<br> [color=red]2.40.[/color] Запрещены совершенно любые деструктивные действия по отношению к проекту: неконструктивная критика, призывы покинуть проект, попытки нарушить развитие проекта или любые другие действия, способные привести к помехам в игровом процессе [color=red]| Mute 300 минут / Ban 30 дней (Ban выдается по согласованию с главным администратором)[/color] <br><br> Одобрено, закрыто."+
"[CENTER][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/CENTER]<br>",
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
		"[B][FONT=GEORGIA][CENTER][COLOR=yellow]{{ greeting }}, уважаемый игрок. [/COLOR][/CENTER][/B]<br><br>"+
'[CENTER][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/CENTER]<br><br>' +
        "[B][CENTER][COLOR=WHITE]Ваша жалоба была одобрена и игрок будет наказан по следующим пунктам правил проекта:<br> [color=red]2.50.[/color] Запрещены задержания, аресты, а также любые действия со стороны игроков, состоящих во фракциях в интерьере аукциона, казино, а также во время системных мероприятий [color=red]| Ban 7 - 15 дней + увольнение из организации[/color] <br><br> Одобрено, закрыто."+
"[CENTER][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/CENTER]<br>",
               prefix: ACCEPT_PREFIX,
      status: false,
                       },
                    {
        title: '| неуважение к администрации |',
	  content:
		"[B][FONT=GEORGIA][CENTER][COLOR=yellow]{{ greeting }}, уважаемый игрок. [/COLOR][/CENTER][/B]<br><br>"+
'[CENTER][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/CENTER]<br><br>' +
        "[B][CENTER][COLOR=WHITE]Ваша жалоба была одобрена и игрок будет наказан по следующим пунктам правил проекта:<br> [color=red]2.54.[/color] Запрещено неуважительное обращение, оскорбление, неадекватное поведение, угрозы в любом их проявлении по отношению к администрации [color=red]| Mute 180 минут[/color] <br><br> Одобрено, закрыто."+
"[CENTER][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/CENTER]<br>",
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
		"[B][FONT=GEORGIA][CENTER][COLOR=yellow]{{ greeting }}, уважаемый игрок. [/COLOR][/CENTER][/B]<br><br>"+
'[CENTER][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/CENTER]<br><br>' +
        "[B][CENTER][COLOR=WHITE]Ваша жалоба была передана на рассмотрение [color=red]Главному администратору[/color] <br><br> Ожидайте ответа в данной теме и не создавайте её дубликатов."+
"[CENTER][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/CENTER]<br>",
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
		"[B][FONT=GEORGIA][CENTER][COLOR=yellow]{{ greeting }}, уважаемый игрок. [/COLOR][/CENTER][/B]<br><br>"+
'[CENTER][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/CENTER]<br><br>' +
        "[B][CENTER][COLOR=WHITE]Ваша жалоба была передана на рассмотрение [color=blue]Техническому специалисту[/color] <br><br> Ожидайте ответа в данной теме и не создавайте её дубликатов."+
"[CENTER][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/CENTER]<br>",
               prefix: TEXY_PREFIX,
      status: true,
                       },
            {
        title: '----------------------------------------------------------------- отказы --------------------------------------------------------------------------',
                                   },
                    {
        title: '| не по форме |',
	  content:
		"[B][FONT=GEORGIA][CENTER][COLOR=yellow]{{ greeting }}, уважаемый игрок. [/COLOR][/CENTER][/B]<br><br>"+
'[CENTER][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/CENTER]<br><br>' +
        "[B][CENTER][COLOR=WHITE]Ваша жалоба составлена не по форме. Пожалуйста, ознакомьтесь с формой подачи здесь - [URL='https://forum.blackrussia.online/threads/Правила-подачи-жалоб-на-игроков.3429394']кликабельно[/URL] <br><br> Отказано, закрыто."+
"[CENTER][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/CENTER]<br>",
               prefix: UNACCEPT_PREFIX,
      status: false,
                       },
                        {
        title: '| нет докв |',
	  content:
		"[B][FONT=GEORGIA][CENTER][COLOR=yellow]{{ greeting }}, уважаемый игрок. [/COLOR][/CENTER][/B]<br><br>"+
'[CENTER][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/CENTER]<br><br>' +
        "[B][CENTER][COLOR=WHITE]В вашей жалобе отсутствуют доказательства <br><br> Отказано, закрыто."+
"[CENTER][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/CENTER]<br>",
               prefix: UNACCEPT_PREFIX,
      status: false,
                       },
                            {
        title: '| не работают доквы |',
	  content:
		"[B][FONT=GEORGIA][CENTER][COLOR=yellow]{{ greeting }}, уважаемый игрок. [/COLOR][/CENTER][/B]<br><br>"+
'[CENTER][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/CENTER]<br><br>' +
        "[B][CENTER][COLOR=WHITE]В вашей жалобе доказательства не работают. Перепроверьте правильность ссылки. <br><br> Отказано, закрыто."+
"[CENTER][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/CENTER]<br>",
               prefix: UNACCEPT_PREFIX,
      status: false,
                       },
                            {
        title: '| нужен фрапс |',
	  content:
		"[B][FONT=GEORGIA][CENTER][COLOR=yellow]{{ greeting }}, уважаемый игрок. [/COLOR][/CENTER][/B]<br><br>"+
'[CENTER][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/CENTER]<br><br>' +
        "[B][CENTER][COLOR=WHITE]В подобных случаях нужна видеозапись <br><br> Отказано, закрыто."+
"[CENTER][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/CENTER]<br>",
               prefix: UNACCEPT_PREFIX,
      status: false,
                       },
                            {
        title: '| оффтоп |',
	  content:
		"[B][FONT=GEORGIA][CENTER][COLOR=yellow]{{ greeting }}, уважаемый игрок. [/COLOR][/CENTER][/B]<br><br>"+
'[CENTER][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/CENTER]<br><br>' +
        "[B][CENTER][COLOR=WHITE]Ваша тема никоем образом не относится к данному разделу. <br><br> Отказано, закрыто."+
"[CENTER][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/CENTER]<br>",
               prefix: UNACCEPT_PREFIX,
      status: false,
                       },
                            {
        title: '| дубликат |',
	  content:
		"[B][FONT=GEORGIA][CENTER][COLOR=yellow]{{ greeting }}, уважаемый игрок. [/COLOR][/CENTER][/B]<br><br>"+
'[CENTER][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/CENTER]<br><br>' +
        "[B][CENTER][COLOR=WHITE]Подобная жалобы уже была рассмотрена. <br><br> Отказано, закрыто."+
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
        title: '| прошло 3 дня |',
	  content:
		"[B][FONT=GEORGIA][CENTER][COLOR=yellow]{{ greeting }}, уважаемый игрок. [/COLOR][/CENTER][/B]<br><br>"+
'[CENTER][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/CENTER]<br><br>' +
        "[B][CENTER][COLOR=WHITE]С момента нарушения прошло более 72-ух часов. <br><br> Отказано, закрыто."+
"[CENTER][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/CENTER]<br>",
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