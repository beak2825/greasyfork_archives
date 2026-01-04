// ==UserScript==
// @name         Скрипт ЖБ КФ Black Russia [not actual].
// @namespace    https://forum.blackrussia.online
// @version      6.4
// @description  РП путём
// @author       I.Drag
// @match        https://forum.blackrussia.online/threads/*
// @include      https://forum.blackrussia.online/threads/
// @grant        none
// @license    MIT
// @icon         https://sun9-76.userapi.com/impg/rEBGQfiaFZnbUofS8UOFXmokbnWSxJaLR-1Ycg/rxEn_aPc0wc.jpg?size=530x530&quality=95&sign=9ca94b62b95b588d510bc19a4290a530&type=album
// @downloadURL https://update.greasyfork.org/scripts/539092/%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%96%D0%91%20%D0%9A%D0%A4%20Black%20Russia%20%5Bnot%20actual%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/539092/%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%96%D0%91%20%D0%9A%D0%A4%20Black%20Russia%20%5Bnot%20actual%5D.meta.js
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
      content: '[FONT=Courier New][CENTER]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br>' + '[CENTER]  [/CENTER][/FONT]',
    },
    {
      title: 'На рассмотрении...',
      content: '[FONT=Courier New][CENTER]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br>'+
        '[CENTER] Ваша жалоба находится на рассмотрении. [/CENTER]<br>'+
        '[CENTER] Ожидайте ответа от администрации. [/CENTER][/FONT]',
      prefix: PINN_PREFIX,
	  status: true,
    },
    {
     title: '- - - - - -  - - - - - - - - -  - - - - - - - - - - - - - - - - - - - - - - - - Одобрено - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -',
    },
    {
     title: '- - - - - -  - - - - - - - - -  - - - - - - - - - - - - - - - - - - - - - - - - Глава 2 - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -',
    },
    {
      title: 'Игрок будет наказан',
      content:
		'[FONT=Courier New][CENTER]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br>'+
        '[CENTER] Игрок будет наказан. [/CENTER]<br>'+
        '[CENTER] Одобрено. Закрыто. [/CENTER][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'nRP поведение [2.01]',
      content:
		'[FONT=Courier New][CENTER]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br><br>'+
        '[CENTER] Игрок будет наказан по следующему пункту правил: [/CENTER]<br>'+
        '[CENTER] 2.01. Запрещено поведение, нарушающее нормы процессов Role Play режима игры | Jail 30 минут [/CENTER]<br><br>'+
        '[CENTER] Одобрено. Закрыто. [/CENTER][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Уход от РП [2.02]',
      content:
		'[FONT=Courier New][CENTER]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br><br>'+
        '[CENTER] Игрок будет наказан по следующему пункту правил: [/CENTER]<br>'+
        '[CENTER] 2.02. Запрещено целенаправленно уходить от Role Play процесса всеразличными способами | Jail 30 минут / Warn [/CENTER]<br><br>'+
        '[CENTER] Одобрено. Закрыто. [/CENTER][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'nRP drive [2.03]',
      content:
		'[FONT=Courier New][CENTER]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br><br>'+
        '[CENTER] Игрок будет наказан по следующему пункту правил: [/CENTER]<br>'+
        '[CENTER] 2.03. Запрещен NonRP Drive — вождение любого транспортного средства в невозможных для него условиях, а также вождение в неправдоподобной манере | Jail 30 минут [/CENTER]<br><br>'+
        '[CENTER] Одобрено. Закрыто. [/CENTER][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Помеха ИП [2.04]',
      content:
        '[FONT=Courier New][CENTER]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br><br>'+
        '[CENTER] Игрок будет наказан по следующему пункту правил: [/CENTER]<br>'+
        '[CENTER] 2.04. Запрещены любые действия способные привести к помехам в игровом процессе, а также выполнению работ, если они этого не предусматривают и если эти действия выходят за рамки игрового процесса данной работы. | Ban 10 дней / Обнуление аккаунта (при повторном нарушении) [/CENTER]<br><br>'+
        '[CENTER] Одобрено. Закрыто. [/CENTER][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'nRP обман [2.05]',
      content:
		'[FONT=Courier New][CENTER]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br><br>'+
        '[CENTER] Игрок будет наказан по следующему пункту правил: [/CENTER]<br>'+
        '[CENTER] 2.05. Запрещены любые OOC обманы и их попытки, а также любые IC обманы с нарушением Role Play правил и логики | PermBan [/CENTER]<br><br>'+
        '[CENTER] Одобрено. Закрыто. [/CENTER][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Аморал. действия [2.08]',
      content:
		'[FONT=Courier New][CENTER]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br><br>'+
        '[CENTER] Игрок будет наказан по следующему пункту правил: [/CENTER]<br>'+
        '[CENTER] 2.08. Запрещена любая форма аморальных действий сексуального характера в сторону игроков | Jail 30 минут / Warn [/CENTER]<br><br>'+
        '[CENTER] Одобрено. Закрыто. [/CENTER][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Слив склада [2.09]',
      content:
		'[FONT=Courier New][CENTER]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br><br>'+
        '[CENTER] Игрок будет наказан по следующему пункту правил: [/CENTER]<br>'+
        '[CENTER] 2.09. Запрещено сливать склад фракции / семьи путем взятия большого количества ресурсов или превышая допустимый лимит, установленный лидером | Ban 15 - 30 дней / PermBan [/CENTER]<br><br>'+
        '[CENTER] Одобрено. Закрыто. [/CENTER][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Помеха блогерам [2.12]',
      content:
        '[FONT=Courier New][CENTER]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br><br>'+
        '[CENTER] Игрок будет наказан по следующему пункту правил: [/CENTER]<br>'+
        '[CENTER] 2.12. Запрещена помеха в работе блогеров, стримеров (медиа лиц), которые находятся на официальном сотрудничестве с проектом | Ban 7 дней [/CENTER]<br><br>'+
        '[CENTER] Одобрено. Закрыто. [/CENTER][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'DB [2.13]',
      content:
		'[FONT=Courier New][CENTER]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br><br>'+
        '[CENTER] Игрок будет наказан по следующему пункту правил: [/CENTER]<br>'+
        '[CENTER] 2.13. Запрещен DB (DriveBy) — намеренное убийство / нанесение урона без веской IC причины на любом виде транспорта | Jail 60 минут [/CENTER]<br><br>'+
        '[CENTER] Одобрено. Закрыто. [/CENTER][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'TK [2.15]',
      content:
        '[FONT=Courier New][CENTER]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br><br>'+
        '[CENTER] Игрок будет наказан по следующему пункту правил: [/CENTER]<br>'+
        '[CENTER] 2.15. Запрещен TK (Team Kill) — убийство члена своей или союзной фракции, организации без наличия какой-либо IC причины | Jail 60 минут / Warn (за два и более убийства) [/CENTER]<br><br>'+
        '[CENTER] Одобрено. Закрыто. [/CENTER][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'SK [2.16]',
      content:
        '[FONT=Courier New][CENTER]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br><br>'+
        '[CENTER] Игрок будет наказан по следующему пункту правил: [/CENTER]<br>'+
        '[CENTER] 2.16. Запрещен SK (Spawn Kill) — убийство или нанесение урона на титульной территории любой фракции / организации, на месте появления игрока, а также на выходе из закрытых интерьеров и около них | Jail 60 минут / Warn (за два и более убийства) [/CENTER]<br><br>'+
        '[CENTER] Одобрено. Закрыто. [/CENTER][/FONT]',
	  status: false,
    },
    {
      title: 'MG [2.18]',
      content:
        '[FONT=Courier New][CENTER]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br><br>'+
        '[CENTER] Игрок будет наказан по следующему пункту правил: [/CENTER]<br>'+
        '[CENTER] 2.18. Запрещен MG (MetaGaming) — использование ООС информации, которую Ваш персонаж никак не мог получить в IC процессе | Mute 30 минут [/CENTER]<br><br>'+
        '[CENTER] Одобрено. Закрыто. [/CENTER][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
        {
      title: 'DM [2.19]',
      content:
        '[FONT=Courier New][CENTER]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br><br>'+
        '[CENTER] Игрок будет наказан по следующему пункту правил: [/CENTER]<br>'+
        '[CENTER] 2.19. Запрещен DM (DeathMatch) — убийство или нанесение урона без веской IC причины | Jail 60 минут [/CENTER]<br><br>'+
        '[CENTER] Одобрено. Закрыто. [/CENTER][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Mass DM [2.20]',
      content:
        '[FONT=Courier New][CENTER]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br><br>'+
        '[CENTER] Игрок будет наказан по следующему пункту правил: [/CENTER]<br>'+
        '[CENTER] 2.20. Запрещен Mass DM (Mass DeathMatch) — убийство или нанесение урона без веской IC причины трем игрокам и более | Warn / Ban 3 - 7 дней [/CENTER]<br><br>'+
        '[CENTER] Одобрено. Закрыто. [/CENTER][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Багоюз [2.21]',
      content:
		'[FONT=Courier New][CENTER]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br><br>'+
        '[CENTER] Игрок будет наказан по следующему пункту правил: [/CENTER]<br>'+
        '[CENTER] 2.21. Запрещено пытаться обходить игровую систему или использовать любые баги сервера | Ban 15 - 30 дней / PermBan (по согласованию с ГА, ЗГА, руководством тех. специалистов) [/CENTER]<br><br>'+
        '[CENTER] Одобрено. Закрыто. [/CENTER][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Стороннее ПО [2.22]',
      content:
		'[FONT=Courier New][CENTER]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br><br>'+
        '[CENTER] Игрок будет наказан по следующему пункту правил: [/CENTER]<br>'+
        '[CENTER] 2.22. Запрещено хранить / использовать / распространять стороннее программное обеспечение или любые другие средства, позволяющие получить преимущество над другими игроками | Ban 15 - 30 дней / PermBan [/CENTER]<br><br>'+
        '[CENTER] Одобрено. Закрыто. [/CENTER][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Реклама [2.31]',
      content:
        '[FONT=Courier New][CENTER]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br><br>'+
        '[CENTER] Игрок будет наказан по следующему пункту правил: [/CENTER]<br>'+
        '[CENTER] 2.31. Запрещено рекламировать на серверах любые проекты, серверы, сайты, сторонние Discord-серверы, YouTube-каналы и тому подобное | Ban 7 дней / PermBan [/CENTER]<br><br>'+
        '[CENTER] Одобрено. Закрыто. [/CENTER][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Обман администрации [2.32]',
      content:
        '[FONT=Courier New][CENTER]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br><br>'+
        '[CENTER] Игрок будет наказан по следующему пункту правил: [/CENTER]<br>'+
        '[CENTER] 2.32. Запрещено введение в заблуждение, обман администрации на всех ресурсах проекта | Ban 7 - 15 дней [/CENTER]<br><br>'+
        '[CENTER] Одобрено. Закрыто. [/CENTER][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Полит/религ конфликты [2.35]',
      content:
        '[FONT=Courier New][CENTER]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br><br>'+
        '[CENTER] Игрок будет наказан по следующему пункту правил: [/CENTER]<br>'+
        '[CENTER] 2.35. На игровых серверах запрещено устраивать IC и OOC конфликты на почве разногласия о национальности и / или религии совершенно в любом формате | Mute 120 минут / Ban 7 дней [/CENTER]<br><br>'+
        '[CENTER] Одобрено. Закрыто. [/CENTER][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'OOC угрозы [2.37]',
      content:
        '[FONT=Courier New][CENTER]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br><br>'+
        '[CENTER] Игрок будет наказан по следующему пункту правил: [/CENTER]<br>'+
        '[CENTER] 2.37. Запрещены OOC-угрозы, в том числе и завуалированные, а также угрозы наказанием со стороны администрации | Mute 120 минут / Ban 7 - 15 дней. [/CENTER]<br><br>'+
        '[CENTER] Одобрено. Закрыто. [/CENTER][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Злоуп. нарушениями [2.39]',
      content:
        '[FONT=Courier New][CENTER]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br><br>'+
        '[CENTER] Игрок будет наказан по следующему пункту правил: [/CENTER]<br>'+
        '[CENTER] 2.39. Злоупотребление нарушениями правил сервера | Ban 7 - 15 дней [/CENTER]<br><br>'+
        '[CENTER] Одобрено. Закрыто. [/CENTER][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Оск проекта [2.40]',
      content:
        '[FONT=Courier New][CENTER]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br><br>'+
        '[CENTER] Игрок будет наказан по следующему пункту правил: [/CENTER]<br>'+
        '[CENTER] 2.40. Запрещены совершенно любые деструктивные действия по отношению к проекту: неконструктивная критика, призывы покинуть проект, попытки нарушить развитие проекта или любые другие действия, способные привести к помехам в игровом процессе | Mute 300 минут / Ban 30 дней (Ban выдается по согласованию с главным администратором) [/CENTER]<br><br>'+
        '[CENTER] Одобрено. Закрыто. [/CENTER][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Продажа промо [2.43]',
      content:
        '[FONT=Courier New][CENTER]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br><br>'+
        '[CENTER] Игрок будет наказан по следующему пункту правил: [/CENTER]<br>'+
        '[CENTER] 2.43. Запрещена продажа / обмен / покупка поощрительной составляющей от лица проекта, будь то бонус-код, либо промокод, который выдается безвозмездно игрокам в целях промоакций | Mute 120 минут [/CENTER]<br><br>'+
        '[CENTER] Одобрено. Закрыто. [/CENTER][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Арест в казино [2.50]',
      content:
        '[FONT=Courier New][CENTER]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br><br>'+
        '[CENTER] Игрок будет наказан по следующему пункту правил: [/CENTER]<br>'+
        '[CENTER] 2.50. Запрещены задержания, аресты, а также любые действия со стороны игроков, состоящих во фракциях в интерьере аукциона, казино, а также во время системных мероприятий | Ban 7 - 15 дней + увольнение из организации [/CENTER]<br><br>'+
        '[CENTER] Одобрено. Закрыто. [/CENTER][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'nRP аксессуар [2.52]',
      content:
        '[FONT=Courier New][CENTER]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br><br>'+
        '[CENTER] Игрок будет наказан по следующему пункту правил: [/CENTER]<br>'+
        '[CENTER] 2.52. Запрещено располагать аксессуары на теле персонажа, нарушая нормы морали и этики, увеличивать аксессуары до слишком большого размера. | При первом нарушении - обнуление аксессуаров, при повторном нарушении - обнуление аксессуаров + JAIL 30 минут [/CENTER]<br><br>'+
        '[CENTER] Одобрено. Закрыто. [/CENTER][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Оск. администрации [2.54]',
      content:
        '[FONT=Courier New][CENTER]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br><br>'+
        '[CENTER] Игрок будет наказан по следующему пункту правил: [/CENTER]<br>'+
        '[CENTER] 2.54. Запрещено неуважительное обращение, оскорбление, неадекватное поведение, угрозы в любом их проявлении по отношению к администрации | Mute 180 минут [/CENTER]<br><br>'+
        '[CENTER] Одобрено. Закрыто. [/CENTER][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Багоюз анимации [2.55]',
      content:
        '[FONT=Courier New][CENTER]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br><br>'+
        '[CENTER] Игрок будет наказан по следующему пункту правил: [/CENTER]<br>'+
        '[CENTER] 2.55. Запрещается багоюз связанный с анимацией в любых проявлениях. | Jail 60 / 120 минут [/CENTER]<br><br>'+
        '[CENTER] Одобрено. Закрыто. [/CENTER][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Невозврат долга [2.57]',
      content:
        '[FONT=Courier New][CENTER]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br><br>'+
        '[CENTER] Игрок будет наказан по следующему пункту правил: [/CENTER]<br>'+
        '[CENTER] 2.57. Запрещается брать в долг игровые ценности и не возвращать их. | Ban 30 дней / permban [/CENTER]<br><br>'+
        '[CENTER] Одобрено. Закрыто. [/CENTER][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
     title: '- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - Глава 3 - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -',
    },
    {
	  title: 'CapsLock [3.02]',
	  content:
        '[FONT=Courier New][CENTER]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br><br>'+
        '[CENTER] Игрок будет наказан по следующему пункту правил: [/CENTER]<br>'+
        '[CENTER] 3.02. Запрещено использование верхнего регистра (Caps Lock) при написании любого текста в любом чате | Mute 30 минут. [/CENTER]<br><br>'+
        '[CENTER] Одобрено. Закрыто. [/CENTER][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
	},
    {
      title: 'Оск в ООС [3.03]',
      content:
        '[FONT=Courier New][CENTER]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br><br>'+
        '[CENTER] Игрок будет наказан по следующему пункту правил: [/CENTER]<br>'+
        '[CENTER] 3.03. Любые формы оскорблений, издевательств, расизма, дискриминации, религиозной враждебности, сексизма в OOC чате запрещены | Mute 30 минут [/CENTER]<br><br>'+
        '[CENTER] Одобрено. Закрыто. [/CENTER][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Оск/Упом родни [3.04]',
      content:
        '[FONT=Courier New][CENTER]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br><br>'+
        '[CENTER] Игрок будет наказан по следующему пункту правил: [/CENTER]<br>'+
        '[CENTER] 3.04. Запрещено оскорбление или косвенное упоминание родных вне зависимости от чата (IC или OOC) | Mute 120 минут / Ban 7 - 15 дней [/CENTER]<br><br>'+
        '[CENTER] Одобрено. Закрыто. [/CENTER][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
	  title: 'Флуд [3.05]',
	  content:
        '[FONT=Courier New][CENTER]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br><br>'+
        '[CENTER] Игрок будет наказан по следующему пункту правил: [/CENTER]<br>'+
        '[CENTER] 3.05. Запрещен флуд — 3 и более повторяющихся сообщений от одного и того же игрока | Mute 30 минут [/CENTER]<br><br>'+
        '[CENTER] Одобрено. Закрыто. [/CENTER][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
	},
    {
      title: 'Злоуп. знаками [3.06]',
      content:
        '[FONT=Courier New][CENTER]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br><br>'+
        '[CENTER] Игрок будет наказан по следующему пункту правил: [/CENTER]<br>'+
        '[CENTER] 3.06. Запрещено злоупотребление знаков препинания и прочих символов | Mute 30 минут [/CENTER]<br><br>'+
        '[CENTER] Одобрено. Закрыто. [/CENTER][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Слив СМИ [3.08]',
      content:
        '[FONT=Courier New][CENTER]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br><br>'+
        '[CENTER] Игрок будет наказан по следующему пункту правил: [/CENTER]<br>'+
        '[CENTER] 3.08. Запрещены любые формы «слива» посредством использования глобальных чатов | PermBan [/CENTER]<br><br>'+
        '[CENTER] Одобрено. Закрыто. [/CENTER][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Выдача себя за адм [3.10]',
      content:
        '[FONT=Courier New][CENTER]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br><br>'+
        '[CENTER] Игрок будет наказан по следующему пункту правил: [/CENTER]<br>'+
        '[CENTER] 3.10. Запрещена выдача себя за администратора, если таковым не являетесь | Ban 7 - 15 дней. [/CENTER]<br><br>'+
        '[CENTER] Одобрено. Закрыто. [/CENTER][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Ввод в забл. командами [3.11]',
      content:
        '[FONT=Courier New][CENTER]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br><br>'+
        '[CENTER] Игрок будет наказан по следующему пункту правил: [/CENTER]<br>'+
        '[CENTER] 3.11. Запрещено введение игроков проекта в заблуждение путем злоупотребления командами | Ban 15 - 30 дней / PermBan [/CENTER]<br><br>'+
        '[CENTER] Одобрено. Закрыто. [/CENTER][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Музыка в voice [3.14]',
      content:
        '[FONT=Courier New][CENTER]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br><br>'+
        '[CENTER] Игрок будет наказан по следующему пункту правил: [/CENTER]<br>'+
        '[CENTER] 3.14. Запрещено включать музыку в Voice Chat | Mute 60 минут [/CENTER]<br><br>'+
        '[CENTER] Одобрено. Закрыто. [/CENTER][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Шум в voice [3.16]',
      content:
        '[FONT=Courier New][CENTER]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br><br>'+
        '[CENTER] Игрок будет наказан по следующему пункту правил: [/CENTER]<br>'+
        '[CENTER] 3.16. Запрещено создавать посторонние шумы или звуки | Mute 30 минут [/CENTER]<br><br>'+
        '[CENTER] Одобрено. Закрыто. [/CENTER][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Полит/религ пропаганда [3.18]',
      content:
        '[FONT=Courier New][CENTER]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br><br>'+
        '[CENTER] Игрок будет наказан по следующему пункту правил: [/CENTER]<br>'+
        '[CENTER] 3.18. Запрещено политическое и религиозное пропагандирование, а также провокация игроков к конфликтам, коллективному флуду или беспорядкам в любом из чатов | Mute 120 минут / Ban 10 дней [/CENTER]<br><br>'+
        '[CENTER] Одобрено. Закрыто. [/CENTER][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Транслит [3.20]',
      content:
        '[FONT=Courier New][CENTER]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br><br>'+
        '[CENTER] Игрок будет наказан по следующему пункту правил: [/CENTER]<br>'+
        '[CENTER] 3.20. Запрещено использование транслита в любом из чатов | Mute 30 минут [/CENTER]<br><br>'+
        '[CENTER] Одобрено. Закрыто. [/CENTER][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Реклама промокода [3.21]',
      content:
        '[FONT=Courier New][CENTER]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br><br>'+
        '[CENTER] Игрок будет наказан по следующему пункту правил: [/CENTER]<br>'+
        '[CENTER] 3.21. Запрещается реклама промокодов в игре, а также их упоминание в любом виде во всех чатах. | Ban 30 дней [/CENTER]<br><br>'+
        '[CENTER] Одобрено. Закрыто. [/CENTER][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Торговля в ГОСС [3.22]',
      content:
        '[FONT=Courier New][CENTER]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br><br>'+
        '[CENTER] Игрок будет наказан по следующему пункту правил: [/CENTER]<br>'+
        '[CENTER] 3.22. Запрещено публиковать любые объявления в помещениях государственных организаций вне зависимости от чата (IC или OOC) | Mute 30 минут [/CENTER]<br><br>'+
        '[CENTER] Одобрено. Закрыто. [/CENTER][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Фейк-аккаунт [4.10]',
      content:
        '[FONT=Courier New][CENTER]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br><br>'+
        '[CENTER] Игрок будет наказан по следующему пункту правил: [/CENTER]<br>'+
        '[CENTER] 4.10. Запрещено создавать никнейм, повторяющий или похожий на существующие никнеймы игроков или администраторов по их написанию | Устное замечание + смена игрового никнейма / PermBan [/CENTER]<br><br>'+
        '[CENTER] Одобрено. Закрыто. [/CENTER][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },

    {
     title: '- - - - - - - - - - - - - - - - - - - - - - - - - Передачи жалобы - - - - - - - - - - - - - - - - - - - - - - - - - - - - -',
    },
    {
      title: 'Техническому специалисту',
      content:
        '[FONT=Courier New][CENTER]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br>'+
        '[CENTER] Ваша жалоба была передана на рассмотение Техническому специалисту по логированию [/CENTER]<br>'+
        '[CENTER] Ожидайте ответа.[/CENTER][/FONT]',
      prefix: TEXY_PREFIX,
	  status: true,
    },
    {
      title: 'Передано ГА',
      content:
        '[FONT=Courier New][CENTER]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br>'+
        '[CENTER] Ваша жалоба была передана на рассмотение Главному Администратору сервера [/CENTER]<br>'+
        '[CENTER] Ожидайте ответа.[/CENTER][/FONT]',
      prefix: GA_PREFIX,
	  status: true,
    },
    {
     title: '- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - Отказано - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -',
    },
    {
	  title: 'Нарушений не найдено',
	  content:
        '[FONT=Courier New][CENTER]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br>'+
        '[CENTER] Нарушений со стороны данного игрока не было найдено. [/CENTER]<br>'+
        '[CENTER] Отказано. Закрыто. [/CENTER][/FONT]',

      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
	  title: 'Дублирование ЖБ',
	  content:
        '[FONT=Courier New][CENTER]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br>'+
        '[CENTER] Вы уже подавали жалобу на этого игрока. [/CENTER]<br>'+
        '[CENTER] За дублирование тем ваш форумный аккаунт может быть заблокирован. [/CENTER]<br>'+
        '[CENTER] Отказано. Закрыто. [/CENTER][/FONT]',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Недостаточно доказательств',
      content:
        '[FONT=Courier New][CENTER]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br><br>'+
        '[CENTER] Недостаточно доказательств на нарушение от данного игрока. [/CENTER]<br>'+
        '[CENTER] Доказательства должны быть предоставлены в хорошем качестве и с полным процессом сделки или нарушения от какого-либо игрока. [/CENTER]<br><br>'+
        '[CENTER] Отказано. Закрыто. [/CENTER][/FONT]',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Не по форме',
      content:
        '[FONT=Courier New][CENTER]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br>'+
        '[CENTER] Жалоба составлена не по форме.[/CENTER]<br>'+
        '[CENTER] Ознакомьтесь с правилами подачи жалоб.[/CENTER]<br>'+
        '[CENTER] Отказано. Закрыто. [/CENTER][/FONT]',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
	{
	  title: 'Нету /time',
	  content:
        '[FONT=Courier New][CENTER]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br>'+
        '[CENTER] На ваших доказательствах отсутствует /time. [/CENTER]<br>'+
        '[CENTER] Отказано. Закрыто. [/CENTER][/FONT]',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
	},
    {
	  title: 'Укажите тайм-коды',
	  content:
        '[FONT=Courier New][CENTER]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br>'+
        '[CENTER] Фрапс длится более 3 минут, необходимо указать таймкоды. [/CENTER]<br>'+
        '[CENTER] Отказано. Закрыто. [/CENTER][/FONT]',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
	},
    {
      title: 'Более 72 часов',
      content:
        '[FONT=Courier New][CENTER]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br>'+
        '[CENTER] С момента нарушения прошло более 72 часов. [/CENTER]<br>'+
        '[CENTER] Отказано. Закрыто. [/CENTER][/FONT]',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Нет условий сделки',
      content:
        '[FONT=Courier New][CENTER]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br>'+
        '[CENTER] На ваших доказательствах отсутствуют условия сделки. [/CENTER]<br>'+
        '[CENTER] Отказано. Закрыто. [/CENTER][/FONT]',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Нужен фрапс',
      content:
        '[FONT=Courier New][CENTER]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br>'+
        '[CENTER] В таких случаях необходим фрапс (запись экрана) [/CENTER]<br>'+
        '[CENTER] Отказано. Закрыто. [/CENTER][/FONT]',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Неполный фрапс',
      content:
        '[FONT=Courier New][CENTER]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br>'+
        '[CENTER] Фрапс обрывается. Загрузите полный фрапс на YouTube/RuTube [/CENTER]<br>'+
        '[CENTER] Отказано. Закрыто. [/CENTER][/FONT]',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Не работают док-ва',
      content:
        '[FONT=Courier New][CENTER]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br>'+
        '[CENTER] Доказательства не рабочие. [/CENTER]<br>'+
        '[CENTER] Отказано. Закрыто. [/CENTER][/FONT]',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Док-ва отредактированы',
      content:
        '[FONT=Courier New][CENTER]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br>'+
        '[CENTER] Ваши доказательства были отредактированы. [/CENTER]<br>'+
        '[CENTER] Отказано. Закрыто. [/CENTER][/FONT]',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Ошиблись разделом',
      content:
        '[FONT=Courier New][CENTER]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br>'+
        '[CENTER] Вы ошиблись сервером / разделом. [/CENTER]<br>'+
        '[CENTER] Отказано. Закрыто. [/CENTER][/FONT]',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
     title: '- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - Доп. вердикты - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -',
    },
    {
      title: 'RP обманы',
      content:
        '[FONT=Courier New][CENTER]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br><br>'+
        '[CENTER] Предложение обмена через /changeprop является RolePlay обманом или попыткой, так как все условия обмена есть у обоих игроков перед глазами [/CENTER]<br>'+
        '[CENTER] Является nRP обманом только в том случае, если обменивается т/с с идентичным названием другого [/CENTER]<br>'+
        '[CENTER] (например продажа обычной приоры VAZ 2172 под видом ППС приоры VAZ 2172) [/CENTER]<br><br>'+
        '[CENTER] Отказано. Закрыто. [/CENTER][/FONT]',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Нет в логах',
      content:
        '[FONT=Courier New][CENTER]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br><br>'+
        '[CENTER] Любое нарушение проверяется через логи [/CENTER]<br>'+
        '[CENTER] На данный момент мы не можем доказать данное нарушение [/CENTER]<br><br>'+
        '[CENTER] Отказано. Закрыто. [/CENTER][/FONT]',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },


  ];

  $(document).ready(() => {
    // Загрузка скрипта для обработки шаблонов
    $('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');

    // Добавление кнопок при загрузке страницы
    addButton('На рассмотрение', 'pin');
    addButton('КП', 'teamProject');
    addButton('Га', 'Ga');
    addButton('Спецу', 'Spec');
    addButton('Одобрено', 'accepted');
    addButton('Отказано', 'unaccept');
    addButton('Тех. Специалисту', 'Texy');
    addButton('Решено', 'Resheno');
    addButton('Закрыто', 'Zakrito');
    addButton('Ответы', 'selectAnswer');

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