// ==UserScript==
// @name         KF SKRIPT /by D.Crow 
// @namespace    https://forum.blackrussia.online
// @version      1.0.1.1
// @description  Always remember who you are!
// @author       Richards
// @match        https://forum.blackrussia.online/index.php?threads/*
// @include      https://forum.blackrussia.online/index.php?threads/
// @grant        none
// @license    MIT
// @collaborator spotiBlack
// @icon https://icons.iconarchive.com/icons/papirus-team/papirus-apps/48/emerald-theme-manager-icon-icon.png
// @downloadURL https://update.greasyfork.org/scripts/445472/KF%20SKRIPT%20by%20DCrow.user.js
// @updateURL https://update.greasyfork.org/scripts/445472/KF%20SKRIPT%20by%20DCrow.meta.js
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
const buttons = [
    {
      title: 'Не тот сервер',
      content:	'[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
   "[CENTER]Вы ошиблись разделом сервера.[/CENTER]<br>"+
  '[Color=Red][CENTER]Отказано, закрыто.[/I][/CENTER][/color][/FONT]',
     prefix: UNACCEPT_PREFIX,
     status: false,
	  
    },
    {
      title: 'СК',
      content:
		'[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Игрок будет наказан по данному пункту правил:[QUOTE]<br>2.16. Запрещен SK (Spawn Kill) — убийство или нанесение урона на титульной территории любой фракции / организации, на месте появления игрока, а также на выходе из закрытых интерьеров и около них | Jail 30 минут / Warn (за два и более убийства).[/QUOTE][/CENTER]<br>" +
		'[Color=Green][CENTER]Одобрено, закрыто.[/I][/CENTER][/color][/FONT]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'нрп задержание',
      content:
		'[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Игрок будет наказан по данному пункту правил:[QUOTE]<br>6.03. Запрещено оказывать задержание без Role Play отыгровки | Warn[/QUOTE][/CENTER]<br>" +
		'[Color=Green][CENTER]Одобрено, закрыто.[/I][/CENTER][/color][/FONT]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'ДМ',
      content:
		'[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Игрок будет наказан по данному пункту правил:[QUOTE]<br>2.19. Запрещен DM (DeathMatch) — убийство или нанесение урона без веской IC причины | Jail 60 минут.[/QUOTE][/CENTER]<br>" +
		'[Color=Green][CENTER]Одобрено, закрыто.[/I][/CENTER][/color][/FONT]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'ДБ',
      content:
		'[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Игрок будет наказан по данному пункту правил:[QUOTE]<br>2.13. Запрещен DB (DriveBy) — намеренное убийство / нанесение урона без веской IC причины на любом виде транспорта | Jail 30 минут.[/QUOTE][/CENTER]<br>" +
		'[Color=Green][CENTER]Одобрено, закрыто.[/I][/CENTER][/color][/FONT]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'NonRP Обман',
      content:
		'[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Игрок будет наказан по данному пункту правил:[QUOTE]<br>2.05. Запрещены любые OOC обманы и их попытки, а также любые IC обманы с нарушением Role Play правил и логики | PermBan.[/QUOTE][/CENTER]<br>"+'[Color=Green][CENTER]Одобрено, закрыто.[/I][/CENTER][/color][/FONT]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Масс ДМ',
      content:
		'[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Игрок будет наказан по данному пункту правил:[QUOTE]<br>2.20. Запрещен Mass DM (Mass DeathMatch) — убийство или нанесение урона без веской IC причины более трем игрокам | Warn / Ban 7 - 15 дней.[/QUOTE][/CENTER]<br>" +
'[Color=Green][CENTER]Одобрено, закрыто.[/I][/CENTER][/color][/FONT]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Оск/Упом родни',
      content:
		'[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Игрок будет наказан по данному пункту правил:[QUOTE]<br>3.04. Запрещено оскорбление или косвенное упоминание родных вне зависимости от чата (IC или OOC) | Mute 120 минут / Ban 7 - 15 дней.[/QUOTE][/CENTER]<br>" +
		'[Color=Green][CENTER]Одобрено, закрыто.[/I][/CENTER][/color][/FONT]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Оскорбление',
      content:
		'[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Игрок будет наказан по данному пункту правил:[QUOTE]<br>3.03. Любые формы оскорблений, издевательств, расизма, дискриминации, религиозной враждебности, сексизма в OOC чате запрещены | Mute 30 минут.[/QUOTE][/CENTER]<br>" +
		'[Color=Green][CENTER]Одобрено, закрыто.[/I][/CENTER][/color][/FONT]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'MG',
      content:
		'[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Игрок будет наказан по данному пункту правил:[QUOTE]<br>2.18. Запрещен MG (MetaGaming) — использование ООС информации, которую Ваш персонаж никак не мог получить в IC процессе | Mute 30 минут.[/QUOTE][/CENTER]<br>" +
		'[Color=Green][CENTER]Одобрено, закрыто.[/I][/CENTER][/color][/FONT]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
     {
	  title: 'CAPSLOCK',
	  content:
		'[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
		"[CENTER]Игрок будет наказан по данному пункту правил:[QUOTE]<br>3.02. Запрещено использование верхнего регистра (CapsLock) при написании любого текста в любом чате | Mute 30 минут.[/QUOTE][/CENTER]<br>" +
		'[Color=Green][CENTER]Одобрено, закрыто.[/I][/CENTER][/color][/FONT]',
      prefix: ACCEPT_PREFIX,
	  status: false,
	},
    {
	  title: 'Flood',
	  content:
		'[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
		"[CENTER]Игрок будет наказан по данному пункту правил:[QUOTE]<br>3.05. Запрещен флуд — 3 и более повторяющихся сообщений от одного и того же игрока | Mute 30 минут.[/QUOTE][/CENTER]<br>" +
		'[Color=Green][CENTER]Одобрено, закрыто.[/I][/CENTER][/color][/FONT]',
      prefix: ACCEPT_PREFIX,
	  status: false,
	},
    {
      title: 'Реклама промо',
      content:
		'[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Игрок будет наказан по данному пункту правил:[QUOTE]<br>3.21. Запрещается реклама промокодов в игре, а также их упоминание в любом виде во всех чатах. | Ban 30 дней.[/QUOTE][/CENTER]<br>" +
		'[Color=Green][CENTER]Одобрено, закрыто.[/I][/CENTER][/color][/FONT]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Неув обр. к адм',
      content:
		'[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Игрок будет наказан по данному пункту правил:[QUOTE]<br>2.54. Запрещено неуважительное обращение, неадекватное поведение, угрозы в любом их проявлении по отношению к администрации | Mute 120 минут[/QUOTE][/CENTER]<br>" +
		'[Color=Green][CENTER]Одобрено, закрыто.[/I][/CENTER][/color][/FONT]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Оск адм',
      content:
		'[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Игрок будет наказан по данному пункту правил:[QUOTE]<br>2.32. Запрещено введение в заблуждение, обман, оскорбление, неконструктивная критика администрации на всех ресурсах проекта | Ban 7 - 30 дней / PermBan[/QUOTE][/CENTER]<br>" +
		'[Color=Green][CENTER]Одобрено, закрыто.[/I][/CENTER][/color][/FONT]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Выдача себя за адм',
      content:
		'[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Игрок будет наказан по данному пункту правил:[QUOTE]<br>3.10. Запрещена выдача себя за администратора, если таковым не являетесь | Ban 15 - 30 + ЧС администрации[/QUOTE][/CENTER]<br>" +
		'[Color=Green][CENTER]Одобрено, закрыто.[/I][/CENTER][/color][/FONT]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
	  title: 'Нарушений не найдено',
	  content:
		'[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
		"[CENTER]Нарушений со стороны данного игрока не было найдено.[/CENTER]<br>" +
		'[Color=Red][CENTER]Отказано, закрыто.[/I][/CENTER][/color][/FONT]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
	},
    {
      title: 'Недостаточно доказательств',
      content:
		'[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Недостаточно доказательств на нарушение от данного игрока.<br>Доказательства должны быть предоставлены в хорошем качестве и с полным процессом сделки или нарушения от какого-либо игрока.[/CENTER]<br>" +
		'[Color=Red][CENTER]Отказано, закрыто.[/I][/CENTER][/color][/FONT]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Дублирование темы',
      content:
		'[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Дублироване темы.<br>Если вы дальше будете заниматься данной деятельностью (дублированием тем), то ваш форумный аккаунт будет заблокирован на 3 дня и более.[/CENTER]<br>" +
		'[Color=Red][CENTER]Отказано, закрыто.[/I][/CENTER][/color][/FONT]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'В жалобы на адм',
      content:
		'[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Вы ошиблись разделом.<br>Обратитесь в раздел «Жалобы на администрацию».[/CENTER]<br>" +
		'[Color=Red][CENTER]Отказано, закрыто.[/I][/CENTER][/color][/FONT]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Форма темы',
      content:
		'[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Ваша жалоба составлена не по форме.<br>Убедительная просьба ознакомиться с правилами подачи жалоб, закреплённые в этом разделе.[/CENTER]<br>" +
		'[Color=Red][CENTER]Отказано, закрыто.[/I][/CENTER][/color][/FONT]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
	{
	  title: 'Нету /time',
	  content:
		'[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
		"[CENTER]На ваших доказательствах отсутствует /time.[/CENTER]<br>" +
		'[Color=Red][CENTER]Отказано, закрыто.[/I][/CENTER][/color][/FONT]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
	},
    {
title: 'ЖБ На рассмотрении',
  title: 'ЖБ На рассмотрении',
      content:
        '[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Ваша жалоба взята на рассмотрение.<br>Просьба ожидать ответа и не создавать дубликаты данной темы.[/CENTER]<br>" +
        '[Color=Flame][CENTER]Ожидайте ответа.[/I][/CENTER][/color][/FONT]',
prefix: PIN_PREFIX,
status: true,
    },
    {
      title: 'Тех. спецу',
      content:
		'[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Ваша жалоба была передана на рассмотрение техническому специалисту.[/CENTER]<br>" +
		'[Color=Flame][CENTER]Ожидайте ответа.[/I][/CENTER][/color][/FONT]',
      prefix: PIN_PREFIX,
	  status: false,
    },
    {
      title: 'био одобрено',
      content:
		'[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Ваша РП биография получает статус: [Color=Green]Одобрено.[/I][/CENTER][/color][/FONT]",
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'био отказ',
      content:
		'[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Ваша РП биография получает статус: [Color=Red]Отказано.[/color]<br>Причиной отказа могло послужить какое-либо нарушение из [https://forum.blackrussia.online/index.php?threads/choco-%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%BE%D0%B7%D0%B4%D0%B0%D0%BD%D0%B8%D1%8F-%D0%B8-%D1%84%D0%BE%D1%80%D0%BC%D0%B0-roleplay-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8.1738602/']Правил создания RolePlay биографии[/URL].[/CENTER][/FONT]",
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'ситуация одобрено',
      content:
		'[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Ваша РП ситуация получает статус: [Color=Green]Одобрено.[/I][/CENTER][/color][/FONT]",
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'ситуация отказ',
      content:
		'[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Ваша РП ситуация получает статус: [Color=Red]Отказано.[/color]<br>Причиной отказа могло послужить какое-либо нарушение из [https://forum.blackrussia.online/index.php?threads/choco-%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-roleplay-%D1%81%D0%B8%D1%82%D1%83%D0%B0%D1%86%D0%B8%D0%B9.1738587/']Правил создания RolePlay ситуации[/URL].[/CENTER][/FONT]",
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'более 3-х дней',
      content:
		'[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Ваша жалоба отказана по причине: Вашему доказательству более 3-трех дней.[/CENTER]<br>" +
		'[Color=Red][CENTER]Отказано, закрыто.[/I][/CENTER][/color][/FONT]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Распоростр ПО',
      content:
        '[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
         "[CENTER]Игрок будет наказан по данному пункту правил:[QUOTE]<br>2.22. Запрещено хранить / использовать / распространять стороннее программное обеспечение или любые другие средства, позволяющие получить преимущество над другими игроками | Ban 15 - 30 дней / PermBan[/QUOTE][/CENTER]<br>" +
		'[Color=Green][CENTER]Одобрено, закрыто.[/I][/CENTER][/color][/FONT]',
         prefix: ACCEPT_PREFIX,
	  status: false,
   },
   {
        title: 'ОСК ПРОЕКТА',
      content:
        '[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Игрок будет наказан по данному пункту правил:[QUOTE]<br>Запрещены совершенно любые деструктивные действия по отношению к проекту: неконструктивная критика, призывы покинуть проект, попытки нарушить развитие проекта или любые другие действия, способные привести к помехам в игровом процессе[COLOR=rgb(226, 80, 65)] | Ban 15 - 30 дней / PermBan[/QUOTE][/CENTER]<br>" +
		'[Color=Green][CENTER]Одобрено, закрыто.[/I][/CENTER][/color][/FONT]',
      prefix: ACCEPT_PREFIX,
	  status: false,
   },
   {
        title: 'Нонрп вождение',
      content:  
     '[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
     "[CENTER]Игрок будет наказан по данному пункту правил:[QUOTE]<br>2.03. Запрещен NonRP Drive — вождение любого транспортного средства в невозможных для него условиях, а также вождение в неправдоподобной манере | Jail 30 минут[/QUOTE][/CENTER]<br>" +
     '[Color=Green][CENTER]Одобрено, закрыто.[/I][/CENTER][/color][/FONT]',
      prefix: ACCEPT_PREFIX,
 	  status: false,
   },
   {
   
        title: 'ТОРГОВЛЯ В ЦБ',
      content: '[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
  "[CENTER]Игрок будет наказан по данному пункту правил:[QUOTE]<br>3.22. Запрещено публиковать любые объявления в помещениях государственных организаций вне зависимости от чата (IC или OOC) [/QUOTE]| Mute 30 минут [/CENTER]<br>" +
		'[Color=Green][CENTER]Одобрено, закрыто.[/I][/CENTER][/color][/FONT]',
         prefix: ACCEPT_PREFIX,
       status: false,
  },
  {
   
        title: 'Реклама промо',
      content: '[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
   "[CENTER]Игрок будет наказан по данному пункту правил:[QUOTE]<br>3.21. Запрещается реклама промокодов в игре, а также их упоминание в любом виде во всех чатах. |  Ban 30 дней  [/QUOTE][/CENTER]<br>" +
		'[Color=Green][CENTER]Одобрено, закрыто.[/I][/CENTER][/color][/FONT]',
         prefix: ACCEPT_PREFIX, 
       status: false, 
    },
    {      
        title: 'ППВ',
      content: '[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
   "[CENTER]Игрок будет наказан по данному пункту правил:[QUOTE]<br>4.03. Запрещена совершенно любая передача игровых аккаунтов третьим лицам | PermBan [/QUOTE][/CENTER]<br>" +
		'[Color=Green][CENTER]Одобрено, закрыто.[/I][/CENTER][/color][/FONT]',
         prefix: ACCEPT_PREFIX, 
       status: false, 
    },
    {      
        title: 'РЕКЛАМА',
      content: '[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
   "[CENTER]Игрок будет наказан по данному пункту правил:[QUOTE]<br>2.31. Запрещено рекламировать на серверах любые проекты, серверы, сайты, сторонние Discord-серверы, YouTube каналы и тому подобное | PermBan [/QUOTE][/CENTER]<br>" +
		'[Color=Green][CENTER]Одобрено, закрыто.[/I][/CENTER][/color][/FONT]',
         prefix: ACCEPT_PREFIX, 
       status: false, 
    },
    {
        title: 'НЕ ЗАГРУЖЕНО НЕ НА ХОСТИНГ',
      content: '[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
     "[CENTER]Ваша жалоба отказана по причине: доказательство не загружено на разрешеный хостинг. (загрузка доказательств в соц. сети (ВКонтакте, instagram) запрещается, доказательства должны быть загружены на фото/видео хостинги (YouTube, Япикс, imgur). .[/CENTER]<br>" +
		'[Color=Red][CENTER]Отказано, закрыто.[/I][/CENTER][/color][/FONT]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {      
        title: 'ФЕЙК',
      content: '[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
   "[CENTER]Игрок будет наказан по данному пункту правил:[QUOTE]<br>4.10. Запрещено создавать никнейм, повторяющий или похожий на существующие никнеймы игроков или администраторов по их написанию | Устное замечание + смена игрового никнейма / PermBan [/QUOTE][/CENTER]<br>" +
		'[Color=Green][CENTER]Одобрено, закрыто.[/I][/CENTER][/color][/FONT]',
         prefix: ACCEPT_PREFIX, 
       status: false, 
    },
    {
        title: 'Одобрено закрыто',
      content: '[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Игрок будет наказан [/CENTER]<br>" +
		'[Color=Green][CENTER]Одобрено, закрыто.[/I][/CENTER][/color][/FONT]',

         prefix: ACCEPT_PREFIX,
       status: false,
 },
 {
        title: 'ВРЕД ЭКОНОМИКЕ',
     content: '[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
      "[CENTER]Игрок будет наказан по данному пункту правил:[QUOTE]<br>2.30. Запрещено пытаться нанести ущерб экономике сервера | Ban 15 - 30 дней / PermBan Пример: имея достаточное количество денег и имущества игрок начинает раздавать денежные средства и имущество другим игрокам. [/QUOTE][/CENTER]<br>" +
		'[Color=Green][CENTER]Одобрено, закрыто.[/I][/CENTER][/color][/FONT]',
         prefix: ACCEPT_PREFIX,
       status: false,
      },
     {
        title: 'Оск нации ',
     content: '[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
      "[CENTER]Игрок будет наказан по данному пункту правил:[QUOTE]3.18. Запрещено политическое и религиозное пропагандирование | Mute 120 минут / Ban 10 дней [/QUOTE][/CENTER]<br>" +
		'[Color=Green][CENTER]Одобрено, закрыто.[/I][/CENTER][/color][/FONT]',
         prefix: ACCEPT_PREFIX,
       status: false,
     },
     {
        title: 'Транслит',
     content: '[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
      "[CENTER]Игрок будет наказан по данному пункту правил:[QUOTE]3.20. Запрещено использование транслита в любом из чатов | Mute 30 минут [/QUOTE][/CENTER]<br>" +
		'[Color=Green][CENTER]Одобрено, закрыто.[/I][/CENTER][/color][/FONT]',
         prefix: ACCEPT_PREFIX,
       status: false,
     },
     {
        title: 'OOC угрозы',
     content: '[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
      "[CENTER]Игрок будет наказан по данному пункту правил:[QUOTE]2.37. Запрещены OOC угрозы, в том числе и завуалированные | Ban 15 - 30 дней / PermBan  [/QUOTE][/CENTER]<br>" +
		'[Color=Green][CENTER]Одобрено, закрыто.[/I][/CENTER][/color][/FONT]',
         prefix: ACCEPT_PREFIX,
       status: false,
       },
     {
        title: 'IC и OOC конфликты',
     content: '[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
      "[CENTER]Игрок будет наказан по данному пункту правил:[QUOTE]2.35. На игровых серверах запрещено устраивать IC и OOC конфликты на почве разногласия о национальности и / или религии совершенно в любом формате | Mute 30 минут / Ban 7 - 15 дней [/QUOTE][/CENTER]<br>" +
		'[Color=Green][CENTER]Одобрено, закрыто.[/I][/CENTER][/color][/FONT]',
         prefix: ACCEPT_PREFIX,
       status: false,
    },
    {
      title: 'Тайм коды',
      content:'[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
		"[CENTER][FONT=times new roman]На вашем доказательстве более трех минут фрапса, прикрепите тайм коды в новой жалобе.[/CENTER]<br>" +
		'[Color=Red][CENTER]Отказано, закрыто.[/I][/CENTER][/color][/FONT]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
   }, 
   {
      title: 'Не тот раздел ',
      content:'[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
		"[CENTER][FONT=times new roman]Вы ошиблись разделом[/CENTER]<br>" +
		'[Color=Red][CENTER]Отказано, закрыто.[/I][/CENTER][/color][/FONT]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
   },  
   {
        title: 'Аморал',
     content: '[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
      "[CENTER]Игрок будет наказан по данному пункту правил:[QUOTE]2.08. Запрещена любая форма аморальных действий сексуального характера в сторону игроков | Jail 30 минут / Warn [/QUOTE][/CENTER]<br>" +
		'[Color=Green][CENTER]Одобрено, закрыто.[/I][/CENTER][/color][/FONT]',
         prefix: ACCEPT_PREFIX,
       status: false,
   },
   {
        title: 'Масс ДМ',
     content: '[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
      "[CENTER]Игрок будет наказан по данному пункту правил:[QUOTE]2.20. Запрещен Mass DM (Mass DeathMatch) — убийство или нанесение урона без веской IC причины трем игрокам и более | Warn / Ban 7 - 15 дней  [/QUOTE][/CENTER]<br>" +
		'[Color=Green][CENTER]Одобрено, закрыто.[/I][/CENTER][/color][/FONT]',
         prefix: ACCEPT_PREFIX,
       status: false,
   },
    {
	  title: 'Прошло три дня ',
	  content:
		'[Color=Red][CENTER][B]{{ greeting }}, уважаемый игрок.[/color][/CENTER][/B]' +
		"[CENTER]С момента нарушение игрока прошло более трех дней.[/CENTER]<br><br>" +
		'[Color=Red][CENTER][B] Отказано, Закрыто.[/CENTER][/color][/B]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
      {
        title: 'Исп  авто в лц',
     content: '[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
      "[CENTER]Игрок будет наказан по данному пункту правил:[QUOTE]2.11. Запрещено использование рабочего или фракционного транспорта в личных целях | Jail 30 минут [/QUOTE][/CENTER]<br>" +
		'[Color=Green][CENTER]Одобрено, закрыто.[/I][/CENTER][/color][/FONT]',
         prefix: ACCEPT_PREFIX,
       status: false,
   },
      {
        title: 'Полит пропаганда',
     content: '[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
      "[CENTER]Игрок будет наказан по данному пункту правил:[QUOTE]3.18. Запрещено политическое и религиозное пропагандирование | Mute 120 минут / Ban 10 дней [/QUOTE][/CENTER]<br>" +
		'[Color=Green][CENTER]Одобрено, закрыто.[/I][/CENTER][/color][/FONT]',
         prefix: ACCEPT_PREFIX,
       status: false,
   },
      {
        title: 'слив склада',
     content: '[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
      "[CENTER]Игрок будет наказан по данному пункту правил:[QUOTE]2.09. Запрещено сливать склад фракции / семьи путем взятия большого количестве ресурсов, или же брать больше, чем разрешили на самом деле | Ban 15 - 30 дней / PermBan [/QUOTE][/CENTER]<br>" +
		'[Color=Green][CENTER]Одобрено, закрыто.[/I][/CENTER][/color][/FONT]',
         prefix: ACCEPT_PREFIX,
       status: false,
   },
      {
        title: 'нон рп поведение ',
     content: '[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
      "[CENTER]Игрок будет наказан по данному пункту правил:[QUOTE]2.01. Запрещено поведение, нарушающее нормы процессов Role Play режима игры | Jail 30 минут [/QUOTE][/CENTER]<br>" +
		'[Color=Green][CENTER]Одобрено, закрыто.[/I][/CENTER][/color][/FONT]',
         prefix: ACCEPT_PREFIX,
       status: false,
   },


    
       ];  
  $(document).ready(() => 
       {
     // Загрузка скрипта для обработки шаблонов
    $('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');

     // Добавление кнопок при загрузке страницы
    addButton('На рассмотрение', 'pin');
    addButton('КП', 'teamProject');
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

