// ==UserScript==
// @name         скрипт для Жалоб на игроков
// @namespace    http://tampermonkey.net/
// @version      4.3
// @description  Для жалоб на игроков KALUGA (от 23.09.25)
// @author       ensemble mansory
// @match        https://forum.blackrussia.online/threads/*
// @grant        none
// @license 	 MIT
// @icon https://i.postimg.cc/VsSJ7tt9/23e18ee569ff78fc58e7512b68b5259d.jpg
// @downloadURL https://update.greasyfork.org/scripts/543795/%D1%81%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%20%D0%BD%D0%B0%20%D0%B8%D0%B3%D1%80%D0%BE%D0%BA%D0%BE%D0%B2.user.js
// @updateURL https://update.greasyfork.org/scripts/543795/%D1%81%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%20%D0%BD%D0%B0%20%D0%B8%D0%B3%D1%80%D0%BE%D0%BA%D0%BE%D0%B2.meta.js
// ==/UserScript==

(function() {
    'use strict';
const UNACCEPT_PREFIX = 4;
const ACCEPT_PREFIX = 8;
const RASSMOTENO_PREFIX = 9;
const PIN_PREFIX = 2;
const GA_PREFIX = 12;
const COMMAND_PREFIX = 10;
const DECIDED_PREFIX = 6;
const WAIT_PREFIX = 14;
const WATCHED_PREFIX = 9;
const CLOSE_PREFIX = 7;
const SPECY_PREFIX = 11;
const TEX_PREFIX = 13;
const buttons = [
    {
      title: 'свой ответ',
      content:
		'[CENTER][FONT=trebuchet ms]Здравствуйте.[/CENTER] <br>' +
        "[CENTER][FONT=trebuchet ms] Текст [/FONT][/CENTER]<br>" +
        '<br>[CENTER][FONT=trebuchet ms][COLOR=red]Закрыто.[/COLOR][/FONT][/CENTER]',
    },
    {
     title: '╴╴╴╴╴╴╴╴╴╴ На рассмотрение/передача ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
        title: 'На рассмотрении',
      content:
		'[CENTER][FONT=trebuchet ms]Здравствуйте.[/CENTER] <br>' +
        "[CENTER][FONT=trebuchet ms]Ваша жалоба взята [COLOR=orange]на рассмотрение.[/COLOR] Мы изучим ситуацию и дадим ответ.[/FONT][/CENTER]<br>" +
        '<br>[CENTER][FONT=trebuchet ms]Ожидайте ответа.[/FONT][/CENTER]',
        prefix: PIN_PREFIX,
      status: true,
    },
    {
      title: 'для ГА',
      content:
		'[CENTER][FONT=trebuchet ms]Здравствуйте.[/CENTER] <br>' +
        "[CENTER][FONT=trebuchet ms]Ваша жалоба передана на рассмотрение [Color=red]Главному Администратору.[/FONT][/COLOR][/CENTER] <br>" +
        '<br>[CENTER][FONT=trebuchet ms]Ожидайте ответа.[/FONT][/CENTER]',
      prefix: GA_PREFIX,
	  status: true,
    },
    {
      title: 'для теха',
      content:
		'[CENTER][FONT=trebuchet ms]Здравствуйте.[/CENTER] <br>' +
        "[CENTER][FONT=trebuchet ms]Ваша жалоба передана на рассмотрение [Color=ORANGE]Tехническому специалисту. [/FONT][/COLOR][/CENTER] <br>" +
        '<br>[CENTER][FONT=trebuchet ms]Ожидайте ответа.[/FONT][/CENTER]',
      prefix: TEX_PREFIX,
	  status: true,
    },
    {
        title: 'для ГКФ',
      content:
		'[CENTER][FONT=trebuchet ms]Здравствуйте.[/CENTER] <br>' +
        "[CENTER][FONT=trebuchet ms]Ваша жалоба передана на рассмотрение Главному куратору форума. Настоятельно просим не создавать дубликаты данной темы.[/FONT][/CENTER]<br>" +
        '<br>[CENTER][FONT=trebuchet ms]Ожидайте ответа.[/FONT][/CENTER]',
        prefix: PIN_PREFIX,
      status: true,
    },
    {
        title: 'укажите таймкоды',
      content:
		'[CENTER][FONT=trebuchet ms]Здравствуйте.[/CENTER] <br>' +
        "[CENTER][FONT=trebuchet ms]В течении 24-ех часов укажите [U]развернутые[/U] таймкоды нарушений и ключевых моментов на ваших доказательствах, иначе жалоба будет отказана. [/FONT][/CENTER]<br>" +
        '<br>[CENTER][FONT=trebuchet ms]Пример: 0:10 - договор, 0:20 - /time, 0:30 - игрок совершил обман. Тема открыта, ждем вашего ответа.[/CENTER]<br>',
        prefix: PIN_PREFIX,
      status: 123,
    },
    {
     title: '╴╴╴╴╴╴╴╴╴╴Жалоба одобрена (Правила игрового процесса) ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
        title: 'Будет забанен',
      content:
		'[CENTER][FONT=trebuchet ms]Здравствуйте.[/CENTER] <br>' +
        "[CENTER][FONT=trebuchet ms]Игрок будет заблокирован. Благодарим за обращение[/FONT][/CENTER] <br>" +
        '<br>[CENTER][FONT=trebuchet ms][COLOR=LIME]Одобрено.[/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
        title: 'nRP поведение',
      content:
		'[CENTER][FONT=trebuchet ms]Здравствуйте.[/CENTER] <br>' +
        "[CENTER][FONT=trebuchet ms]Игрок будет наказан по следующему пункту правил игрового процесса:[/FONT][/CENTER] <br>" +
        '[CENTER][FONT=trebuchet ms][COLOR=red]2.01.[/COLOR] Запрещено поведение, нарушающее нормы процессов Role Play режима игры [COLOR=red]| Jail 30 минут[/COLOR][/CENTER]<br>' +
        '<br>[CENTER][FONT=trebuchet ms][COLOR=LIME]Одобрено.[/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
        title: 'уход от РП',
      content:
		'[CENTER][FONT=trebuchet ms]Здравствуйте.[/CENTER] <br>' +
        "[CENTER][FONT=trebuchet ms]Игрок будет наказан по следующему пункту правил игрового процесса:[/FONT][/CENTER] <br>" +
        '[CENTER][FONT=trebuchet ms][COLOR=red]2.02.[/COLOR] Запрещено целенаправленно уходить от Role Play процесса всеразличными способами [COLOR=red]| Jail 30 минут / Warn[/COLOR][/CENTER]<br>' +
        '<br>[CENTER][FONT=trebuchet ms][COLOR=LIME]Одобрено.[/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
        title: 'nRP drive',
      content:
		'[CENTER][FONT=trebuchet ms]Здравствуйте.[/CENTER] <br>' +
        "[CENTER][FONT=trebuchet ms]Игрок будет наказан по следующему пункту правил игрового процесса:[/FONT][/CENTER] <br>" +
        '[CENTER][FONT=trebuchet ms][COLOR=red]2.03.[/COLOR] Запрещён NonRP Drive — вождение любого транспортного средства в невозможных для него условиях, а также вождение в неправдоподобной манере [COLOR=red]| Jail 30 минут [/COLOR][/CENTER]<br>' +
        '<br>[CENTER][FONT=trebuchet ms][COLOR=LIME]Одобрено.[/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
        title: 'помеха рп',
      content:
		'[CENTER][FONT=trebuchet ms]Здравствуйте.[/CENTER] <br>' +
        "[CENTER][FONT=trebuchet ms]Игрок будет наказан по следующему пункту правил игрового процесса:[/FONT][/CENTER] <br>" +
        '[CENTER][FONT=trebuchet ms][COLOR=red]2.04.[/COLOR]  Запрещены любые действия способные привести к помехам в игровом процессе, а также выполнению работ, если они этого не предусматривают и если эти действия выходят за рамки игрового процесса данной работы [COLOR=red]| Ban 10 дней / Обнуление аккаунта (при повторном нарушении) [/COLOR][/CENTER]<br>' +
        '<br>[CENTER][FONT=trebuchet ms][COLOR=LIME]Одобрено.[/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
        title: 'nRP обман',
      content:
		'[CENTER][FONT=trebuchet ms]Здравствуйте.[/CENTER] <br>' +
        "[CENTER][FONT=trebuchet ms]Игрок будет наказан по следующему пункту правил игрового процесса:[/FONT][/CENTER] <br>" +
        '[CENTER][FONT=trebuchet ms][COLOR=red]2.05.[/COLOR]  Запрещены любые OOC обманы и их попытки, а также любые IC обманы с нарушением Role Play правил и логики [COLOR=red]| Permban [/COLOR][/CENTER]<br>' +
        '[CENTER][FONT=trebuchet ms][COLOR=red]Пример:[/COLOR] после IC договоренности получить денежные средства и сразу же выйти из игры с целью обмана игрока, или же, договорившись через OOC чат (/n), точно также получить денежные средства и сразу же выйти из игры и тому подобные ситуации.[/CENTER]<br>' +
        '<br>[CENTER][FONT=trebuchet ms][COLOR=LIME]Одобрено.[/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
        title: 'аморал действия',
      content:
		'[CENTER][FONT=trebuchet ms]Здравствуйте.[/CENTER] <br>' +
        "[CENTER][FONT=trebuchet ms]Игрок будет наказан по следующему пункту правил игрового процесса:[/FONT][/CENTER] <br>" +
        '[CENTER][FONT=trebuchet ms][COLOR=red]2.08.[/COLOR] Запрещена любая форма аморальных действий сексуального характера в сторону игроков [COLOR=red]| Jail 30 минут / Warn [/COLOR][/CENTER]<br>' +
        '<br>[CENTER][FONT=trebuchet ms][COLOR=LIME]Одобрено.[/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
        title: 'слив склада',
      content:
		'[CENTER][FONT=trebuchet ms]Здравствуйте.[/CENTER] <br>' +
        "[CENTER][FONT=trebuchet ms]Игрок будет наказан по следующему пункту правил игрового процесса:[/FONT][/CENTER] <br>" +
        '[CENTER][FONT=trebuchet ms][COLOR=red]2.09.[/COLOR]  Запрещено сливать склад фракции / семьи путем взятия большого количества ресурсов или превышая допустимый лимит, установленный лидером  [COLOR=red]| Ban 15 - 30 дней / PermBan [/COLOR][/CENTER]<br>' +
        '[CENTER][FONT=trebuchet ms][COLOR=red]Примечание:[/COLOR] исключение всех или части игроков из состава семьи без ведома лидера также считается сливом.[/CENTER]<br>' +
        '<br>[CENTER][FONT=trebuchet ms][COLOR=LIME]Одобрено.[/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
        title: 'DB',
      content:
		'[CENTER][FONT=trebuchet ms]Здравствуйте.[/CENTER] <br>' +
        "[CENTER][FONT=trebuchet ms]Игрок будет наказан по следующему пункту правил игрового процесса:[/FONT][/CENTER] <br>" +
        '[CENTER][FONT=trebuchet ms][COLOR=red]2.13.[/COLOR] Запрещен DB (DriveBy) — намеренное убийство / нанесение урона без веской IC причины на любом виде транспорта [COLOR=red]| Jail 60 минут[/COLOR][/CENTER]<br>' +
        '<br>[CENTER][FONT=trebuchet ms][COLOR=LIME]Одобрено.[/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
        title: 'TK',
      content:
		'[CENTER][FONT=trebuchet ms]Здравствуйте.[/CENTER] <br>' +
        "[CENTER][FONT=trebuchet ms]Игрок будет наказан по следующему пункту правил игрового процесса:[/FONT][/CENTER] <br>" +
        '[CENTER][FONT=trebuchet ms][COLOR=red]2.15.[/COLOR] Запрещен TK (Team Kill) — убийство члена своей или союзной фракции, организации без наличия какой-либо IC причины [COLOR=red]| Jail 60 минут / Warn (за два и более убийства)[/COLOR][/CENTER]<br>' +
        '<br>[CENTER][FONT=trebuchet ms][COLOR=LIME]Одобрено.[/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
        title: 'MG',
      content:
		'[CENTER][FONT=trebuchet ms]Здравствуйте.[/CENTER] <br>' +
        "[CENTER][FONT=trebuchet ms]Игрок будет наказан по следующему пункту правил игрового процесса:[/FONT][/CENTER] <br>" +
        '[CENTER][FONT=trebuchet ms][COLOR=red]2.18.[/COLOR] Запрещен MG (MetaGaming) — использование ООС информации, которую Ваш персонаж никак не мог получить в IC процессе [COLOR=red]| Mute 30 минут[/COLOR][/CENTER]<br>' +
        '<br>[CENTER][FONT=trebuchet ms][COLOR=LIME]Одобрено.[/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
        title: 'DM',
      content:
		'[CENTER][FONT=trebuchet ms]Здравствуйте.[/CENTER] <br>' +
        "[CENTER][FONT=trebuchet ms]Игрок будет наказан по следующему пункту правил игрового процесса:[/FONT][/CENTER] <br>" +
        '[CENTER][FONT=trebuchet ms][COLOR=red]2.19.[/COLOR] Запрещен DM (DeathMatch) — убийство или нанесение урона без веской IC причины [COLOR=red]| Jail 60 минут[/COLOR][/CENTER]<br>' +
        '<br>[CENTER][FONT=trebuchet ms][COLOR=LIME]Одобрено.[/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
        title: 'Mass DM',
      content:
		'[CENTER][FONT=trebuchet ms]Здравствуйте.[/CENTER] <br>' +
        "[CENTER][FONT=trebuchet ms]Игрок будет наказан по следующему пункту правил игрового процесса:[/FONT][/CENTER] <br>" +
        '[CENTER][FONT=trebuchet ms][COLOR=red]2.20.[/COLOR] Запрещен Mass DM (Mass DeathMatch) — убийство или нанесение урона без веской IC причины трем игрокам и более [COLOR=red]| Warn / Ban 3 - 7 дней[/COLOR][/CENTER]<br>' +
        '<br>[CENTER][FONT=trebuchet ms][COLOR=LIME]Одобрено.[/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
        title: 'Читы/Сборки',
      content:
		'[CENTER][FONT=trebuchet ms]Здравствуйте.[/CENTER] <br>' +
        "[CENTER][FONT=trebuchet ms]Игрок будет наказан по следующему пункту правил игрового процесса:[/FONT][/CENTER] <br>" +
        '[CENTER][FONT=trebuchet ms][COLOR=red]2.22.[/COLOR]  Запрещено хранить / использовать / распространять стороннее программное обеспечение или любые другие средства, позволяющие получить преимущество над другими игроками [COLOR=red]| Ban 15 - 30 дней / PermBan[/COLOR][/CENTER]<br>' +
        '<br>[CENTER][FONT=trebuchet ms][COLOR=LIME]Одобрено.[/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
        title: 'продажа ив (попытка)',
      content:
		'[CENTER][FONT=trebuchet ms]Здравствуйте.[/CENTER] <br>' +
        "[CENTER][FONT=trebuchet ms]Игрок будет наказан по следующему пункту правил игрового процесса:[/FONT][/CENTER] <br>" +
        '[CENTER][FONT=trebuchet ms][COLOR=red]2.28.[/COLOR] Запрещена покупка/продажа внутриигровой валюты за реальные деньги в любом виде [COLOR=red]| PermBan с обнулением аккаунта.[/COLOR][/CENTER]<br>' +
        '[CENTER][FONT=trebuchet ms][COLOR=red]Примечание:[/COLOR] любые попытки купить или продать внутриигровую валюту, интересоваться этим у других игроков или обсуждать это – наказуемо.[/CENTER]<br>' +
        '<br>[CENTER][FONT=trebuchet ms][COLOR=LIME]Одобрено.[/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
        title: 'реклама соц сетей',
      content:
		'[CENTER][FONT=trebuchet ms]Здравствуйте.[/CENTER] <br>' +
        "[CENTER][FONT=trebuchet ms]Игрок будет наказан по следующему пункту правил игрового процесса:[/FONT][/CENTER] <br>" +
        '[CENTER][FONT=trebuchet ms][COLOR=red]2.31.[/COLOR] Запрещено рекламировать на серверах любые проекты, серверы, сайты, сторонние Discord-серверы, YouTube-каналы и тому подобное  [COLOR=red]| Ban 7 дней / PermBan[/COLOR][/CENTER]<br>' +
        '[CENTER][FONT=trebuchet ms][COLOR=red]Примечание:[/COLOR] если игрок не использует глобальный чат, чтобы дать свои контактные данные для связи, это не будет являться рекламой.[/CENTER]<br>' +
        '<br>[CENTER][FONT=trebuchet ms][COLOR=LIME]Одобрено.[/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
        title: 'нац. / религ. конфликты',
      content:
		'[CENTER][FONT=trebuchet ms]Здравствуйте.[/CENTER] <br>' +
        "[CENTER][FONT=trebuchet ms]Игрок будет наказан по следующему пункту правил игрового процесса:[/FONT][/CENTER] <br>" +
        '[CENTER][FONT=trebuchet ms][COLOR=red]2.35.[/COLOR] На игровых серверах запрещено устраивать IC и OOC конфликты на почве разногласия о национальности и / или религии совершенно в любом формате [COLOR=red]| Mute 120 минут / Ban 7 дней[/COLOR][/CENTER]<br>' +
        '<br>[CENTER][FONT=trebuchet ms][COLOR=LIME]Одобрено.[/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
        title: 'оос угрозы',
      content:
		'[CENTER][FONT=trebuchet ms]Здравствуйте.[/CENTER] <br>' +
        "[CENTER][FONT=trebuchet ms]Игрок будет наказан по следующему пункту правил игрового процесса:[/FONT][/CENTER] <br>" +
        '[CENTER][FONT=trebuchet ms][COLOR=red]2.37.[/COLOR] Запрещены OOC-угрозы, в том числе и завуалированные, а также угрозы наказанием со стороны администрации [COLOR=red]| Mute 120 минут / Ban 7 - 15 дней.[/COLOR][/CENTER]<br>' +
        '<br>[CENTER][FONT=trebuchet ms][COLOR=LIME]Одобрено.[/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
        title: 'оск проекта',
      content:
		'[CENTER][FONT=trebuchet ms]Здравствуйте.[/CENTER] <br>' +
        "[CENTER][FONT=trebuchet ms]Игрок будет наказан по следующему пункту правил игрового процесса:[/FONT][/CENTER] <br>" +
        '[CENTER][FONT=trebuchet ms][COLOR=red]2.40.[/COLOR] Запрещены совершенно любые деструктивные действия по отношению к проекту: неконструктивная критика, призывы покинуть проект, попытки нарушить развитие проекта или любые другие действия, способные привести к помехам в игровом процессе [COLOR=red]| Mute 300 минут / Ban 30 дней (Ban выдается по согласованию с главным администратором)[/COLOR][/CENTER]<br>' +
        '<br>[CENTER][FONT=trebuchet ms][COLOR=LIME]Одобрено.[/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
        title: 'nRP drive фура/инко',
      content:
		'[CENTER][FONT=trebuchet ms]Здравствуйте.[/CENTER] <br>' +
        "[CENTER][FONT=trebuchet ms]Игрок будет наказан по следующему пункту правил игрового процесса:[/FONT][/CENTER] <br>" +
        '[CENTER][FONT=trebuchet ms][COLOR=red]2.47.[/COLOR] Запрещено ездить по полям на грузовом транспорте, инкассаторских машинах (работа дальнобойщика, инкассатора) [COLOR=red]| Jail 60 минут[/COLOR][/CENTER]<br>' +
        '<br>[CENTER][FONT=trebuchet ms][COLOR=LIME]Одобрено.[/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
        title: 'арест в аукционе',
      content:
		'[CENTER][FONT=trebuchet ms]Здравствуйте.[/CENTER] <br>' +
        "[CENTER][FONT=trebuchet ms]Игрок будет наказан по следующему пункту правил игрового процесса:[/FONT][/CENTER] <br>" +
        '[CENTER][FONT=trebuchet ms][COLOR=red]2.50.[/COLOR] Запрещены задержания, аресты, а также любые действия со стороны игроков, состоящих во фракциях в интерьере аукциона, казино, а также во время системных мероприятий [COLOR=red]| Ban 7 - 15 дней + увольнение из организации[/COLOR][/CENTER]<br>' +
        '<br>[CENTER][FONT=trebuchet ms][COLOR=LIME]Одобрено.[/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
        title: 'nRP аксесуар',
      content:
		'[CENTER][FONT=trebuchet ms]Здравствуйте.[/CENTER] <br>' +
        "[CENTER][FONT=trebuchet ms]Игрок будет наказан по следующему пункту правил игрового процесса:[/FONT][/CENTER] <br>" +
        '[CENTER][FONT=trebuchet ms][COLOR=red]2.52.[/COLOR] Запрещено располагать аксессуары на теле персонажа, нарушая нормы морали и этики, увеличивать аксессуары до слишком большого размера. [COLOR=red]| При первом нарушении - обнуление аксессуаров, при повторном нарушении - обнуление аксессуаров + Jail 30 минут[/COLOR][/CENTER]<br>' +
        '<br>[CENTER][FONT=trebuchet ms][COLOR=LIME]Одобрено.[/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
        title: 'неуваж/оск адм',
      content:
		'[CENTER][FONT=trebuchet ms]Здравствуйте.[/CENTER] <br>' +
        "[CENTER][FONT=trebuchet ms]Игрок будет наказан по следующему пункту правил игрового процесса:[/FONT][/CENTER] <br>" +
        '[CENTER][FONT=trebuchet ms][COLOR=red]2.54.[/COLOR] Запрещено неуважительное обращение, оскорбление, неадекватное поведение, угрозы в любом их проявлении по отношению к администрации [COLOR=red]| Mute 180 минут[/COLOR][/CENTER]<br>' +
        '<br>[CENTER][FONT=trebuchet ms][COLOR=LIME]Одобрено.[/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
        title: 'сбив аним/темпа',
      content:
		'[CENTER][FONT=trebuchet ms]Здравствуйте.[/CENTER] <br>' +
        "[CENTER][FONT=trebuchet ms]Игрок будет наказан по следующему пункту правил игрового процесса:[/FONT][/CENTER] <br>" +
        '[CENTER][FONT=trebuchet ms][COLOR=red]2.55.[/COLOR]  Запрещается багоюз, связанный с анимацией в любых проявлениях. [COLOR=red]| Jail 120 минут[/COLOR][/CENTER]<br>' +
        '[CENTER][FONT=trebuchet ms][COLOR=red]Примечание:[/COLOR] наказание применяется в случаях, когда игрок, используя ошибку, получает преимущество перед другими игроками.[/CENTER]<br>' +
        '<br>[CENTER][FONT=trebuchet ms][COLOR=LIME]Одобрено.[/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
        title: 'невозврат долга',
      content:
		'[CENTER][FONT=trebuchet ms]Здравствуйте.[/CENTER] <br>' +
        "[CENTER][FONT=trebuchet ms]Игрок будет наказан по следующему пункту правил игрового процесса:[/FONT][/CENTER] <br>" +
        '[CENTER][FONT=trebuchet ms][COLOR=red]2.57.[/COLOR]  Запрещается брать в долг игровые ценности и не возвращать их. [COLOR=red]| Ban 30 дней / permban[/COLOR][/CENTER]<br>' +
        '[CENTER][FONT=trebuchet ms][COLOR=red]Примечание:[/COLOR] при невозврате игровых ценностей общей стоимостью менее 5 миллионов включительно аккаунт будет заблокирован на 30 дней, если более 5 миллионов, аккаунт будет заблокирован навсегда.[/CENTER]<br>' +
        '<br>[CENTER][FONT=trebuchet ms][COLOR=LIME]Одобрено.[/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
     title: '╴╴╴╴╴╴╴╴╴╴Жалоба одобрена (Правила Чата) ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
        title: 'CapsLock',
      content:
		'[CENTER][FONT=trebuchet ms]Здравствуйте.[/CENTER] <br>' +
        "[CENTER][FONT=trebuchet ms]Игрок будет наказан по следующему пункту правил игрового чата:[/FONT][/CENTER] <br>" +
        '[CENTER][FONT=trebuchet ms][COLOR=red]3.02.[/COLOR] Запрещено использование верхнего регистра (Caps Lock) при написании любого текста в любом чате [COLOR=red]| Mute 30 минут[/COLOR][/CENTER]<br>' +
        '<br>[CENTER][FONT=trebuchet ms][COLOR=LIME]Одобрено.[/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
        title: 'оск в оос',
      content:
		'[CENTER][FONT=trebuchet ms]Здравствуйте.[/CENTER] <br>' +
        "[CENTER][FONT=trebuchet ms]Игрок будет наказан по следующему пункту правил игрового чата:[/FONT][/CENTER] <br>" +
        '[CENTER][FONT=trebuchet ms][COLOR=red]3.03.[/COLOR] Любые формы оскорблений, издевательств, расизма, дискриминации, религиозной враждебности, сексизма в OOC чате запрещены [COLOR=red]| Mute 30 минут[/COLOR][/CENTER]<br>' +
        '<br>[CENTER][FONT=trebuchet ms][COLOR=LIME]Одобрено.[/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
        title: 'оск/упом родных',
      content:
		'[CENTER][FONT=trebuchet ms]Здравствуйте.[/CENTER] <br>' +
        "[CENTER][FONT=trebuchet ms]Игрок будет наказан по следующему пункту правил игрового чата:[/FONT][/CENTER] <br>" +
        '[CENTER][FONT=trebuchet ms][COLOR=red]3.04.[/COLOR] Запрещено оскорбление или косвенное упоминание родных вне зависимости от чата (IC или OOC) [COLOR=red]| Mute 120 минут / Ban 7 - 15 дней[/COLOR][/CENTER]<br>' +
        '[CENTER][FONT=trebuchet ms][COLOR=red]Примечание:[/COLOR] термины "MQ", "rnq" расценивается, как упоминание родных.[/CENTER]<br>' +
        '<br>[CENTER][FONT=trebuchet ms][COLOR=LIME]Одобрено.[/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
        title: 'флуд',
      content:
		'[CENTER][FONT=trebuchet ms]Здравствуйте.[/CENTER] <br>' +
        "[CENTER][FONT=trebuchet ms]Игрок будет наказан по следующему пункту правил игрового чата:[/FONT][/CENTER] <br>" +
        '[CENTER][FONT=trebuchet ms][COLOR=red]3.05.[/COLOR] Запрещен флуд — 3 и более повторяющихся сообщений от одного и того же игрока [COLOR=red]| Mute 30 минут[/COLOR][/CENTER]<br>' +
        '<br>[CENTER][FONT=trebuchet ms][COLOR=LIME]Одобрено.[/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
        title: 'злоуп символами',
      content:
		'[CENTER][FONT=trebuchet ms]Здравствуйте.[/CENTER] <br>' +
        "[CENTER][FONT=trebuchet ms]Игрок будет наказан по следующему пункту правил игрового чата:[/FONT][/CENTER] <br>" +
        '[CENTER][FONT=trebuchet ms][COLOR=red]3.05.[/COLOR] Запрещено злоупотребление знаков препинания и прочих символов [COLOR=red]| Mute 30 минут[/COLOR][/CENTER]<br>' +
        '<br>[CENTER][FONT=trebuchet ms][COLOR=LIME]Одобрено.[/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
        title: 'слив глобал чата',
      content:
		'[CENTER][FONT=trebuchet ms]Здравствуйте.[/CENTER] <br>' +
        "[CENTER][FONT=trebuchet ms]Игрок будет наказан по следующему пункту правил игрового чата:[/FONT][/CENTER] <br>" +
        '[CENTER][FONT=trebuchet ms][COLOR=red]3.08.[/COLOR] Запрещены любые формы «слива» посредством использования глобальных чатов [COLOR=red]| Permban[/COLOR][/CENTER]<br>' +
        '<br>[CENTER][FONT=trebuchet ms][COLOR=LIME]Одобрено.[/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
        title: 'выдача за адм',
      content:
		'[CENTER][FONT=trebuchet ms]Здравствуйте.[/CENTER] <br>' +
        "[CENTER][FONT=trebuchet ms]Игрок будет наказан по следующему пункту правил игрового чата:[/FONT][/CENTER] <br>" +
        '[CENTER][FONT=trebuchet ms][COLOR=red]3.10.[/COLOR] Запрещена выдача себя за администратора, если таковым не являетесь [COLOR=red]| Ban 7 - 15 дней.[/COLOR][/CENTER]<br>' +
        '<br>[CENTER][FONT=trebuchet ms][COLOR=LIME]Одобрено.[/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
        title: 'ввод в заблуждение',
      content:
		'[CENTER][FONT=trebuchet ms]Здравствуйте.[/CENTER] <br>' +
        "[CENTER][FONT=trebuchet ms]Игрок будет наказан по следующему пункту правил игрового чата:[/FONT][/CENTER] <br>" +
        '[CENTER][FONT=trebuchet ms][COLOR=red]3.11.[/COLOR] Запрещено введение игроков проекта в заблуждение путем злоупотребления командами [COLOR=red]| Ban 15 - 30 дней / PermBan[/COLOR][/CENTER]<br>' +
        '<br>[CENTER][FONT=trebuchet ms][COLOR=LIME]Одобрено.[/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
        title: 'музыка войс',
      content:
		'[CENTER][FONT=trebuchet ms]Здравствуйте.[/CENTER] <br>' +
        "[CENTER][FONT=trebuchet ms]Игрок будет наказан по следующему пункту правил игрового чата:[/FONT][/CENTER] <br>" +
        '[CENTER][FONT=trebuchet ms][COLOR=red]3.14.[/COLOR] Запрещено включать музыку в Voice Chat [COLOR=red]| Mute 60 минут[/COLOR][/CENTER]<br>' +
        '<br>[CENTER][FONT=trebuchet ms][COLOR=LIME]Одобрено.[/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
        title: 'шум войс',
      content:
		'[CENTER][FONT=trebuchet ms]Здравствуйте.[/CENTER] <br>' +
        "[CENTER][FONT=trebuchet ms]Игрок будет наказан по следующему пункту правил игрового чата:[/FONT][/CENTER] <br>" +
        '[CENTER][FONT=trebuchet ms][COLOR=red]3.16.[/COLOR] Запрещено создавать посторонние шумы или звуки [COLOR=red]| Mute 30 минут[/COLOR][/CENTER]<br>' +
        '<br>[CENTER][FONT=trebuchet ms][COLOR=LIME]Одобрено.[/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
        title: 'призыв к флуду, полит/религ пропаганда',
      content:
		'[CENTER][FONT=trebuchet ms]Здравствуйте.[/CENTER] <br>' +
        "[CENTER][FONT=trebuchet ms]Игрок будет наказан по следующему пункту правил игрового чата:[/FONT][/CENTER] <br>" +
        '[CENTER][FONT=trebuchet ms][COLOR=red]3.18.[/COLOR] Запрещено политическое и религиозное пропагандирование, а также провокация игроков к конфликтам, коллективному флуду или беспорядкам в любом из чатов [COLOR=red]| Mute 120 минут / Ban 10 дней[/COLOR][/CENTER]<br>' +
        '<br>[CENTER][FONT=trebuchet ms][COLOR=LIME]Одобрено.[/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
        title: 'транслит',
      content:
		'[CENTER][FONT=trebuchet ms]Здравствуйте.[/CENTER] <br>' +
        "[CENTER][FONT=trebuchet ms]Игрок будет наказан по следующему пункту правил игрового чата:[/FONT][/CENTER] <br>" +
        '[CENTER][FONT=trebuchet ms][COLOR=red]3.20.[/COLOR] Запрещено использование транслита в любом из чатов [COLOR=red]| Mute 30 минут[/COLOR][/CENTER]<br>' +
        '<br>[CENTER][FONT=trebuchet ms][COLOR=LIME]Одобрено.[/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
        title: 'реклама промо',
      content:
		'[CENTER][FONT=trebuchet ms]Здравствуйте.[/CENTER] <br>' +
        "[CENTER][FONT=trebuchet ms]Игрок будет наказан по следующему пункту правил игрового чата:[/FONT][/CENTER] <br>" +
        '[CENTER][FONT=trebuchet ms][COLOR=red]3.21.[/COLOR] Запрещается реклама промокодов в игре, а также их упоминание в любом виде во всех чатах. [COLOR=red]| Ban 30 дней[/COLOR][/CENTER]<br>' +
        '<br>[CENTER][FONT=trebuchet ms][COLOR=LIME]Одобрено.[/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
        title: 'обьявы ГОСС',
      content:
		'[CENTER][FONT=trebuchet ms]Здравствуйте.[/CENTER] <br>' +
        "[CENTER][FONT=trebuchet ms]Игрок будет наказан по следующему пункту правил игрового чата:[/FONT][/CENTER] <br>" +
        '[CENTER][FONT=trebuchet ms][COLOR=red]3.22.[/COLOR] Запрещено публиковать любые объявления в помещениях государственных организаций вне зависимости от чата (IC или OOC) [COLOR=red]| Mute 30 минут[/COLOR][/CENTER]<br>' +
        '<br>[CENTER][FONT=trebuchet ms][COLOR=LIME]Одобрено.[/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
        title: 'мат в VIP',
      content:
		'[CENTER][FONT=trebuchet ms]Здравствуйте.[/CENTER] <br>' +
        "[CENTER][FONT=trebuchet ms]Игрок будет наказан по следующему пункту правил игрового чата:[/FONT][/CENTER] <br>" +
        '[CENTER][FONT=trebuchet ms][COLOR=red]3.23.[/COLOR] Запрещено использование нецензурных слов, в том числе завуалированных и литературных в VIP чате [COLOR=red]| Mute 30 минут[/COLOR][/CENTER]<br>' +
        '<br>[CENTER][FONT=trebuchet ms][COLOR=LIME]Одобрено.[/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
     title: '╴╴╴╴╴╴╴╴╴╴Жалоба одобрена (Правила ГОСС/ОПГ) ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
        title: 'nRP edit (СМИ)',
      content:
		'[CENTER][FONT=trebuchet ms]Здравствуйте.[/CENTER] <br>' +
        "[CENTER][FONT=trebuchet ms]Игрок будет наказан по следующему пункту правил госс. организаций:[/FONT][/CENTER] <br>" +
        '[CENTER][FONT=trebuchet ms][COLOR=red]4.01.[/COLOR] Запрещено редактирование объявлений, не соответствующих ПРО [COLOR=red]| Mute 30 минут[/COLOR][/CENTER]<br>' +
        '<br>[CENTER][FONT=trebuchet ms][COLOR=LIME]Одобрено.[/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
        title: 'редакт в личных целях (СМИ)',
      content:
		'[CENTER][FONT=trebuchet ms]Здравствуйте.[/CENTER] <br>' +
        "[CENTER][FONT=trebuchet ms]Игрок будет наказан по следующему пункту правил госс. организаций:[/FONT][/CENTER] <br>" +
        '[CENTER][FONT=trebuchet ms][COLOR=red]4.04.[/COLOR] Запрещено редактировать поданные объявления в личных целях заменяя текст объявления на несоответствующий отправленному игроком [COLOR=red]| Ban 7 дней + ЧС организации[/COLOR][/CENTER]<br>' +
        '<br>[CENTER][FONT=trebuchet ms][COLOR=LIME]Одобрено.[/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
        title: 'nRP розыск (ГИБДД/УМВД/ФСБ)',
      content:
		'[CENTER][FONT=trebuchet ms]Здравствуйте.[/CENTER] <br>' +
        "[CENTER][FONT=trebuchet ms]Игрок будет наказан по следующему пункту правил госс. организаций:[/FONT][/CENTER] <br>" +
        '[CENTER][FONT=trebuchet ms][COLOR=red]6.02.[/COLOR] Запрещено выдавать розыск без Role Play причины [COLOR=red]| Warn[/COLOR][/CENTER]<br>' +
        '<br>[CENTER][FONT=trebuchet ms][COLOR=LIME]Одобрено.[/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
        title: 'nRP коп (ГИБДД/УМВД/ФСБ)',
      content:
		'[CENTER][FONT=trebuchet ms]Здравствуйте.[/CENTER] <br>' +
        "[CENTER][FONT=trebuchet ms]Игрок будет наказан по следующему пункту правил госс. организаций:[/FONT][/CENTER] <br>" +
        '[CENTER][FONT=trebuchet ms][COLOR=red]6.03.[/COLOR] Запрещено nRP поведение [COLOR=red]| Warn[/COLOR][/CENTER]<br>' +
        '[CENTER][FONT=trebuchet ms][COLOR=red]Пример:[/COLOR] открытие огня по игрокам без причины, расстрел машин без причины, нарушение ПДД без причины, сотрудник на служебном транспорте кричит о наборе в свою семью на спавне и тому подобные ситуации.[/CENTER]<br>' +
        '<br>[CENTER][FONT=trebuchet ms][COLOR=LIME]Одобрено.[/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
        title: 'nRP штраф (ГИБДД)',
      content:
		'[CENTER][FONT=trebuchet ms]Здравствуйте.[/CENTER] <br>' +
        "[CENTER][FONT=trebuchet ms]Игрок будет наказан по следующему пункту правил госс. организаций:[/FONT][/CENTER] <br>" +
        '[CENTER][FONT=trebuchet ms][COLOR=red]7.02.[/COLOR] Запрещено выдавать розыск, штраф без Role Play причины [COLOR=red]| Warn[/COLOR][/CENTER]<br>' +
        '<br>[CENTER][FONT=trebuchet ms][COLOR=LIME]Одобрено.[/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
        title: 'nRP изьятие прав (ГИБДД)',
      content:
		'[CENTER][FONT=trebuchet ms]Здравствуйте.[/CENTER] <br>' +
        "[CENTER][FONT=trebuchet ms]Игрок будет наказан по следующему пункту правил госс. организаций:[/FONT][/CENTER] <br>" +
        '[CENTER][FONT=trebuchet ms][COLOR=red]7.04.[/COLOR] Запрещено отбирать водительские права во время погони за нарушителем или без веской причины. [COLOR=red]| Warn[/COLOR][/CENTER]<br>' +
        '<br>[CENTER][FONT=trebuchet ms][COLOR=LIME]Одобрено.[/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
        title: 'nRP ВЧ (ОПГ)',
      content:
		'[CENTER][FONT=trebuchet ms]Здравствуйте.[/CENTER] <br>' +
        "[CENTER][FONT=trebuchet ms]Игрок будет наказан по следующему пункту правил госс. организаций:[/FONT][/CENTER] <br>" +
        '[CENTER][FONT=trebuchet ms][COLOR=red]2.[/COLOR] За нарушение правил нападения на Войсковую Часть выдаётся предупреждение [COLOR=red]| Jail 30 минут (NonRP нападение) / Warn (Для сотрудников ОПГ)[/COLOR][/CENTER]<br>' +
        '<br>[CENTER][FONT=trebuchet ms][COLOR=LIME]Одобрено.[/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴отказ жб ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
      title: 'нарушений нет',
      content:
		'[CENTER][FONT=trebuchet ms]Здравствуйте.[/CENTER] <br>' +
        "[CENTER][FONT=trebuchet ms]Нарушений со стороны игрока выявлено не было.[/FONT][/CENTER] <br>" +
        '<br>[CENTER][FONT=trebuchet ms][COLOR=red]Отказано.[/COLOR][/FONT][/CENTER]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'слот',
      content:
		'[CENTER][FONT=trebuchet ms]Здравствуйте.[/CENTER] <br>' +
        "[CENTER][FONT=trebuchet ms]Семейный слот не является элементом рыночных отношений. Передача, покупка и продажа семейных слотов напрямую между игроками не предусмотрена.[/FONT][/CENTER] <br>" +
        '<br>[CENTER][FONT=trebuchet ms][COLOR=red]Отказано.[/COLOR][/FONT][/CENTER]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'недостаточно докв',
      content:
		'[CENTER][FONT=trebuchet ms]Здравствуйте.[/CENTER] <br>' +
        "[CENTER][FONT=trebuchet ms]Предоставленных доказательств на нарушение от игрока недостаточно.[/FONT][/CENTER] <br>" +
        '<br>[CENTER][FONT=trebuchet ms][COLOR=red]Отказано.[/COLOR][/FONT][/CENTER]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'отсутствуют доква',
      content:
		'[CENTER][FONT=trebuchet ms]Здравствуйте.[/CENTER] <br>' +
        "[CENTER][FONT=trebuchet ms]В вашей жалобе отсутствуют доказательства.[/FONT][/CENTER] <br>" +
        '<br>[CENTER][FONT=trebuchet ms][COLOR=red]Отказано.[/COLOR][/FONT][/CENTER]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'не логируется/не найдено',
      content:
		'[CENTER][FONT=trebuchet ms]Здравствуйте.[/CENTER] <br>' +
        "[CENTER][FONT=trebuchet ms]Исходя из предоставленных доказательств, выдать наказание игроку не представляется возможным.[/FONT][/CENTER] <br>" +
        '<br>[CENTER][FONT=trebuchet ms][COLOR=red]Отказано.[/COLOR][/FONT][/CENTER]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'отредактированные док-ва',
      content:
		'[CENTER][FONT=trebuchet ms]Здравствуйте.[/CENTER] <br>' +
        "[CENTER][FONT=trebuchet ms]Доказательства, которые были подвергнуты редактированию рассмотрению не подлежат.[/FONT][/CENTER] <br>" +
        '<br>[CENTER][FONT=trebuchet ms][COLOR=red]Отказано.[/COLOR][/FONT][/CENTER]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'не по форме',
      content:
		'[CENTER][FONT=trebuchet ms]Здравствуйте.[/CENTER] <br>' +
        "[CENTER][FONT=trebuchet ms]Ваша жалоба составлена не по форме.<br>Убедительная просьба ознакомиться [URL='https://forum.blackrussia.online/threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BF%D0%BE%D0%B4%D0%B0%D1%87%D0%B8-%D0%B6%D0%B0%D0%BB%D0%BE%D0%B1-%D0%BD%D0%B0-%D0%B8%D0%B3%D1%80%D0%BE%D0%BA%D0%BE%D0%B2.3429394/']с правилами подачи жалоб на игроков (Нажмите сюда)[/URL].[/FONT][/CENTER] <br>" +
        '<br>[CENTER][FONT=trebuchet ms][COLOR=red]Отказано.[/COLOR][/FONT][/CENTER]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'нет /time',
      content:
		'[CENTER][FONT=trebuchet ms]Здравствуйте.[/CENTER] <br>' +
        "[CENTER][FONT=trebuchet ms]На ваших доказательствах отсутствует /time.[/FONT][/CENTER] <br>" +
        '<br>[CENTER][FONT=trebuchet ms][COLOR=red]Отказано.[/COLOR][/FONT][/CENTER]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'качество док-в',
      content:
		'[CENTER][FONT=trebuchet ms]Здравствуйте.[/CENTER] <br>' +
        "[CENTER][FONT=trebuchet ms]Доказательства предоставлены в плохом качестве. Повысьте качество доказательств или смените хостинг, затем создайте новую жалобу.[/FONT][/CENTER] <br>" +
        '<br>[CENTER][FONT=trebuchet ms][COLOR=red]Отказано.[/COLOR][/FONT][/CENTER]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'прошло 3 дня',
      content:
		'[CENTER][FONT=trebuchet ms]Здравствуйте.[/CENTER] <br>' +
        "[CENTER][FONT=trebuchet ms]С момента совершенного нарушения со стороны игрока прошло более 72 часов. Срок написания жалобы составляет три дня (72 часа) с момента совершенного нарушения со стороны игрока сервера.[/FONT][/CENTER] <br>" +
        '<br>[CENTER][FONT=trebuchet ms][COLOR=red]Отказано.[/COLOR][/FONT][/CENTER]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'некорректные условия',
      content:
		'[CENTER][FONT=trebuchet ms]Здравствуйте.[/CENTER] <br>' +
        "[CENTER][FONT=trebuchet ms]В ваших доказательствах отсутствуют, либо некорректно обговорены условия сделки.[/FONT][/CENTER] <br>" +
        '<br>[CENTER][FONT=trebuchet ms][COLOR=red]Отказано.[/COLOR][/FONT][/CENTER]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'нужен фрапс',
      content:
		'[CENTER][FONT=trebuchet ms]Здравствуйте.[/CENTER] <br>' +
        "[CENTER][FONT=trebuchet ms] В данной ситуации обязательно необходима запись экрана. Предоставленных доказательств недостаточно.[/FONT][/CENTER] <br>" +
        '<br>[CENTER][FONT=trebuchet ms][COLOR=red]Отказано.[/COLOR][/FONT][/CENTER]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'доквы не открываются',
      content:
		'[CENTER][FONT=trebuchet ms]Здравствуйте.[/CENTER] <br>' +
        "[CENTER][FONT=trebuchet ms]Ваши доказательства не открываются. Смените хостинг или перезагрузите доказательства, затем создайте новую жалобу.[/FONT][/CENTER] <br>" +
        '<br>[CENTER][FONT=trebuchet ms][COLOR=red]Закрыто.[/COLOR][/FONT][/CENTER]',
      prefix: CLOSE_PREFIX,
	  status: false,
    },
    {
      title: 'займ через трейд',
      content:
		'[CENTER][FONT=trebuchet ms]Здравствуйте.[/CENTER] <br>' +
        "[CENTER][FONT=trebuchet ms]Займ может быть осуществлен только через зачисление игровых ценностей на банковский счет.[/FONT][/CENTER] <br>" +
        '<br>[CENTER][FONT=trebuchet ms][COLOR=red]Отказано.[/COLOR][/FONT][/CENTER]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'нет условий склада',
      content:
		'[CENTER][FONT=trebuchet ms]Здравствуйте.[/CENTER] <br>' +
        "[CENTER][FONT=trebuchet ms]Вами не было предоставлено условий склада или доказательств, что вы являетесь лидером семьи. На данный момент жалоба не подлежит рассмотрению.[/FONT][/CENTER] <br>" +
        '<br>[CENTER][FONT=trebuchet ms][COLOR=red]Отказано.[/COLOR][/FONT][/CENTER]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'дублирование',
      content:
		'[CENTER][FONT=trebuchet ms]Здравствуйте.[/CENTER] <br>' +
        "[CENTER][FONT=trebuchet ms]Тема продублирована, просим вас воздержаться от создания дубликатов тем с подобным содержанием, в противном случае на ваш форумный аккаунт могут быть наложены санкции в виде блокировки. [/FONT][/CENTER] <br>" +
        '<br>[CENTER][FONT=trebuchet ms][COLOR=red]Закрыто.[/COLOR][/FONT][/CENTER]',
      prefix: CLOSE_PREFIX,
	  status: false,
    },
    {
      title: 'уже на рассмотрении',
      content:
		'[CENTER][FONT=trebuchet ms]Здравствуйте.[/CENTER] <br>' +
        "[CENTER][FONT=trebuchet ms]Жалоба такого же содержания от Вас уже находится на рассмотрении.<br> Ожидайте ответа в прошлой жалобе и не нужно дублировать ее. [/FONT][/CENTER] <br>" +
        '<br>[CENTER][FONT=trebuchet ms][COLOR=red]Закрыто.[/COLOR][/FONT][/CENTER]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'был наказан',
      content:
		'[CENTER][FONT=trebuchet ms]Здравствуйте.[/CENTER] <br>' +
        "[CENTER][FONT=trebuchet ms]Данный игрок уже был наказан администрацией сервера. Мы благодарны вам за содействие и бдительность.[/FONT][/CENTER] <br>" +
        '<br>[CENTER][FONT=trebuchet ms][COLOR=red]Отказано.[/COLOR][/FONT][/CENTER]',
      prefix: CLOSE_PREFIX,
	  status: false,
    },
    {
      title: 'в жб на сотрудников',
      content:
		'[CENTER][FONT=trebuchet ms]Здравствуйте.[/CENTER] <br>' +
        "[CENTER][FONT=trebuchet ms]Вы обратились не в тот раздел, обратитесь в «Жалобы на сотрудников» данной организации.[/FONT][/CENTER] <br>" +
        '<br>[CENTER][FONT=trebuchet ms][COLOR=red]Закрыто.[/COLOR][/FONT][/CENTER]',
      prefix: CLOSE_PREFIX,
	  status: false,
    },

];

  $(document).ready(() => {
	// Загрузка скрипта для обработки шаблонов
	$('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');

	// Добавление кнопок при загрузке страницы
    addButton('Ответы (Жб на игроков)', 'selectAnswer');

	// Поиск информации о теме
	const threadData = getThreadData();

	$('button#pin').click(() => pasteContent(16, threadData, true));
	$('button#Ga').click(() => pasteContent(8, threadData, true));
	$('button#accepted').click(() => editThreadData(ACCEPT_PREFIX, false));
	$('button#Texy').click(() => pasteContent(7, threadData, true));
	$('button#Rasmotreno').click(() => editThreadData(RASSMOTENO_PREFIX, false));
	$('button#Close').click(() => editThreadData(CLOSE_PREFIX, false));

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

function addButton(name, id) {
$('.button--icon--reply').before(
            `<button type="button" class="button--primary button rippleButton" id="${id}" style="border-radius: 0px 20px; border-color: green; border-style: dashed solid; margin-right: 7px; margin-bottom: 10px; background: green; text-decoration-style: wavy;">${name}</button>`,
);
}

function buttonsMarkup(buttons) {
return `<div class="select_answer">${buttons
  .map(
	(btn, i) =>
	  `<button id="answers-${i}" class="button--primary button ` +
	  `rippleButton" style="border-radius: 10px; margin-right: 10px; margin-bottom: 10px"><span class="button-text">${btn.title}</span></button>`,
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
            discussion_open: 0,
			sticky: 1,
			_xfToken: XF.config.csrf,
			_xfRequestUri: document.URL.split(XF.config.url.fullBase)[1],
			_xfWithData: 1,
			_xfResponseType: 'json',
		  }),
		}).then(() => location.reload());
	}
	if(pin == 123){
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