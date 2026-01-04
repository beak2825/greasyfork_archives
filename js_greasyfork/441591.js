// ==UserScript==
// @name         FOR KF | BLACK RUSSIA
// @namespace    https://forum.blackrussia.online
// @version      1.8
// @description  Always remember who you are!
// @author       fl0rence
// @match        https://forum.blackrussia.online/index.php?threads/*
// @include      https://forum.blackrussia.online/index.php?threads/
// @grant        none
// @license    MIT
// @collaborator fl0rence
// @icon https://icons.iconarchive.com/icons/papirus-team/papirus-apps/48/emerald-theme-manager-icon-icon.png
// @downloadURL https://update.greasyfork.org/scripts/441591/FOR%20KF%20%7C%20BLACK%20RUSSIA.user.js
// @updateURL https://update.greasyfork.org/scripts/441591/FOR%20KF%20%7C%20BLACK%20RUSSIA.meta.js
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
	  title: '_______________________________________ Для жалоб на игроков____________________________________ ',
	},
     {
      title: 'Приветствие',
      content: '[FONT=trebuchet ms][CENTER]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br>' + '[CENTER]  [/CENTER][/FONT]',
    },
     {
      title: 'СК',
      content:
		'[Color=#ffffff][FONT=trebuchet ms][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Игрок будет [COLOR=#ff0000]наказан[/COLOR] по данному пункту правил:<br>2.16. Запрещен SK (Spawn Kill) — убийство или нанесение урона на титульной территории любой фракции / организации, на месте появления игрока, а также на выходе из закрытых интерьеров и около них [Color=#ff0000]| Jail 30 минут / Warn (за два и более убийства)[/COLOR].[/CENTER]<br>" +
		'[Color=#00FF00][CENTER]Одобрено, закрыто.[/I][/CENTER][/color][/FONT]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'ДМ',
      content:
		'[Color=#ffffff][FONT=trebuchet ms][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Игрок будет[COLOR=#ff0000] наказан [/COLOR]по данному пункту правил:<br>2.19. Запрещен DM (DeathMatch) — убийство или нанесение урона без веской IC причины [Color=#ff0000]| Jail 60 минут[/COLOR].[/CENTER]<br>" +
		'[Color=#00FF00][CENTER]Одобрено, закрыто.[/I][/CENTER][/color][/FONT]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'ДБ',
      content:
		'[Color=#ffffff][FONT=trebuchet ms][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Игрок будет[COLOR=#ff0000] наказан [/COLOR]по данному пункту правил:<br>2.13. Запрещен DB (DriveBy) — намеренное убийство / нанесение урона без веской IC причины на любом виде транспорта [Color=#ff0000]| Jail 30 минут[/COLOR].[/CENTER]<br>" +
		'[Color=#00FF00][CENTER]Одобрено, закрыто.[/I][/CENTER][/color][/FONT]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'MG',
      content:
		'[Color=#ffffff][FONT=trebuchet ms][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Игрок будет[COLOR=#ff0000] наказан [/COLOR]по данному пункту правил:<br>2.18. Запрещен MG (MetaGaming) — использование ООС информации, которую Ваш персонаж никак не мог получить в IC процессе [Color=#ff0000]| Mute 30 минут[/COLOR].[/CENTER]<br>" +
		'[Color=#00FF00][CENTER]Одобрено, закрыто.[/I][/CENTER][/color][/FONT]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
	  title: 'Капс',
	  content:
		'[Color=#ffffff][FONT=trebuchet ms][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
		"[CENTER]Игрок будет[COLOR=#ff0000] наказан [/COLOR]по данному пункту правил:<br>3.02. Запрещено использование верхнего регистра (CapsLock) при написании любого текста в любом чате [Color=#ff0000]| Mute 30 минут[/COLOR].[/CENTER]<br>" +
		'[Color=#00FF00][CENTER]Одобрено, закрыто.[/I][/CENTER][/color][/FONT]',
      prefix: ACCEPT_PREFIX,
	  status: false,
	},
    {
	  title: 'Флуд',
	  content:
		'[Color=#ffffff][FONT=trebuchet ms][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
		"[CENTER]Игрок будет[COLOR=#ff0000] наказан [/COLOR]по данному пункту правил:<br>3.05. Запрещен флуд — 3 и более повторяющихся сообщений от одного и того же игрока [Color=#ff0000]| Mute 30 минут[/COLOR].[/CENTER]<br>" +
		'[Color=#00FF00][CENTER]Одобрено, закрыто.[/I][/CENTER][/color][/FONT]',
      prefix: ACCEPT_PREFIX,
	  status: false,
	},
    {
      title: 'Оск',
      content:
		'[Color=#ffffff][FONT=trebuchet ms][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Игрок будет[COLOR=#ff0000] наказан [/COLOR]по данному пункту правил:<br>3.03. Любые формы оскорблений, издевательств, расизма, дискриминации, религиозной враждебности, сексизма в OOC чате запрещены [Color=#ff0000]| Mute 30 минут[/COLOR].[/CENTER]<br>" +
		'[Color=#00FF00][CENTER]Одобрено, закрыто.[/I][/CENTER][/color][/FONT]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Оск/Упом родни',
      content:
		'[Color=#ffffff][FONT=trebuchet ms][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Игрок будет[COLOR=#ff0000] наказан [/COLOR]по данному пункту правил:<br>3.04. Запрещено оскорбление или косвенное упоминание родных вне зависимости от чата (IC или OOC) [Color=#ff0000]| Mute 120 минут / Ban 7 - 15 дней[/COLOR].[/CENTER]<br>" +
		'[Color=#00FF00][CENTER]Одобрено, закрыто.[/I][/CENTER][/color][/FONT]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'NonRP Обман',
      content:
		'[Color=#ffffff][FONT=trebuchet ms][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Игрок будет[COLOR=#ff0000] наказан [/COLOR]по данному пункту правил:<br>2.05. Запрещены любые OOC обманы и их попытки, а также любые IC обманы с нарушением Role Play правил и логики [Color=#ff0000]| PermBan[/COLOR].[/CENTER]<br>" +
		'[Color=#00FF00][CENTER]Одобрено, закрыто.[/I][/CENTER][/color][/FONT]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Масс ДМ',
      content:
		'[Color=#ffffff][FONT=trebuchet ms][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Игрок будет[COLOR=#ff0000] наказан [/COLOR]по данному пункту правил:<br>2.20. Запрещен Mass DM (Mass DeathMatch) — убийство или нанесение урона без веской IC причины более трем игрокам [Color=#ff0000]| Warn / Ban 7 - 15 дней[/COLOR].[/CENTER]<br>" +
		'[Color=#00FF00][CENTER]Одобрено, закрыто.[/I][/CENTER][/color][/FONT]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Реклама промо',
      content:
		'[Color=#ffffff][FONT=trebuchet ms][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Игрок будет[COLOR=#ff0000] наказан [/COLOR]по данному пункту правил:<br>3.21. Запрещается реклама промокодов в игре, а также их упоминание в любом виде во всех чатах. [Color=#ff0000]| Ban 30 дней[/Color].[/CENTER]<br>" +
		'[Color=#00FF00][CENTER]Одобрено, закрыто.[/I][/CENTER][/color][/FONT]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Неув обр. к адм',
      content:
		'[Color=#ffffff][FONT=trebuchet ms][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Игрок будет[COLOR=#ff0000] наказан [/COLOR]по данному пункту правил:<br>2.54. Запрещено неуважительное обращение, неадекватное поведение, угрозы в любом их проявлении по отношению к администрации [Color=#ff0000]| Mute 120 минут[/COLOR][/CENTER]<br>" +
		'[Color=#00FF00][CENTER]Одобрено, закрыто.[/I][/CENTER][/color][/FONT]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Оск адм',
      content:
		'[Color=#ffffff][FONT=trebuchet ms][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Игрок будет[COLOR=#ff0000] наказан [/COLOR]по данному пункту правил:<br>2.32. Запрещено введение в заблуждение, обман, оскорбление, неконструктивная критика администрации на всех ресурсах проекта [Color=#ff0000] | Ban 7 - 30 дней / PermBan[/COLOR][/CENTER]<br>" +
		'[Color=#00FF00][CENTER]Одобрено, закрыто.[/I][/CENTER][/color][/FONT]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Выдача себя за адм',
      content:
		'[Color=#ffffff][FONT=trebuchet ms][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Игрок будет[COLOR=#FFFF00] наказан [/COLOR]по данному пункту правил:<br>3.10. Запрещена выдача себя за администратора, если таковым не являетесь [Color=#ff0000]| Ban 15 - 30 + ЧС администрации[/COLOR][/CENTER]<br>" +
		'[Color=#00FF00][CENTER]Одобрено, закрыто.[/I][/CENTER][/color][/FONT]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
	  title: 'Нарушений не найдено',
	  content:
		'[Color=#ffffff][FONT=trebuchet ms][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
		"[CENTER]Нарушений со стороны данного игрока не было найдено.[/CENTER]<br>" +
		'[Color=#00FF00][CENTER]Отказано, закрыто.[/I][/CENTER][/color][/FONT]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
	},
    {
      title: 'Недостаточно доказательств',
      content:
		'[Color=#ffffff][FONT=trebuchet ms][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Недостаточно доказательств на нарушение от данного игрока.<br>Доказательства должны быть предоставлены в хорошем качестве и с полным процессом сделки или нарушения от какого-либо игрока.[/CENTER]<br>" +
		'[Color=#ff0000][CENTER]Отказано, закрыто.[/I][/CENTER][/color][/FONT]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Дублирование темы',
      content:
		'[Color=#ffffff][FONT=trebuchet ms][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Дублироване темы.<br>Если вы дальше будете заниматься данной деятельностью (дублированием тем), то ваш форумный аккаунт будет заблокирован на 3 дня и более.[/CENTER]<br>" +
		'[Color=#ff0000][CENTER]Отказано, закрыто.[/I][/CENTER][/color][/FONT]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'В жалобы на адм',
      content:
		'[Color=#ffffff][FONT=trebuchet ms][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Вы ошиблись разделом.<br>Обратитесь в раздел [Color=#ffff00]«Жалобы на администрацию»[/COLOR].[/CENTER]<br>" +
		'[Color=#ff0000][CENTER]Отказано, закрыто.[/I][/CENTER][/color][/FONT]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Форма темы',
      content:
		'[Color=#ffffff][FONT=trebuchet ms][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Ваша жалоба составлена не по форме.<br>Убедительная просьба ознакомиться с правилами подачи жалоб, закреплённые в этом разделе.[/CENTER]<br>" +
		'[Color=#ff0000][CENTER]Отказано, закрыто.[/I][/CENTER][/color][/FONT]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
	{
	  title: 'Нету /time',
	  content:
		'[Color=#ffffff][FONT=trebuchet ms][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
		"[CENTER]На ваших доказательствах отсутствует [COLOR=#00ff00]/time[/COLOR].[/CENTER]<br>" +
		'[Color=#ff0000][CENTER]Отказано, закрыто.[/I][/CENTER][/color][/FONT]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
	},
    {
      title: 'Жалоба на рассмотрении',
      content:
		'[Color=#ffffff][FONT=trebuchet ms][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Ваша жалоба взята на [COLOR=#ff4500]рассмотрение[/COLOR].<br>Просьба ожидать ответа и не создавать дубликаты данной темы.[/CENTER]<br>" +
		'[Color=#ff4500][CENTER]Ожидайте ответа.[/I][/CENTER][/color][/FONT]',
      prefix: PIN_PREFIX,
	  status: true,
    },
     {
      title: 'Гл.Адм',
      content:
		'[Color=#ffffff][FONT=trebuchet ms][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Ваша жалоба была передана [Color=#ff0000]Главной Администрации[/COLOR].<br>Просьба ожидать ответа и не создавать дубликаты данной темы.[/CENTER]<br>" +
		'[Color=#00FF00][CENTER]Ожидайте ответа.[/I][/CENTER][/color][/FONT]',
      prefix: GA_PREFIX,
	  status: true,
    },
    {
      title: 'Тех. спецу',
      content:
		'[Color=#ffffff][FONT=trebuchet ms][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Ваша жалоба была передана на рассмотрение техническому специалисту.[/CENTER]<br>" +
		'[Color=Flame][CENTER]Ожидайте ответа.[/I][/CENTER][/color][/FONT]',
      prefix: PIN_PREFIX,
	  status: true,
    },
     {
      title: 'Уход от РП',
      content:
		'[Color=#ffffff][FONT=trebuchet ms][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Игрок будет[COLOR=#ff0000] наказан [/COLOR]по данному пункту правил:<br>2.02 Запрещено целенаправленно уходить от Role Play процесса всеразличными способами [Color=#ff0000]| Jail 30 минут / Warn[/COLOR] <br>[Color=#ff0000]Примечание:[/COLOR] например, уходить в AFK при остановке транспортного средства правоохранительными органами, выходить из игры для избежания смерти, выходить из игры во время процесса задержания / ареста, полное игнорирование отыгровок другого игрока, которые так или иначе могут коснутся Вашего персонажа и так далее<br>.[/CENTER]<br>" +
		'[Color=#00FF00][CENTER]Одобрено, закрыто.[/I][/CENTER][/color][/FONT]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Политика',
      content:
		'[Color=#ffffff][FONT=trebuchet ms][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Игрок будет[COLOR=#ff0000] наказан [/COLOR]по данному пункту правил:<br>3.18. Запрещено политическое и религиозное пропагандирование [Color=#ff0000]| Mute 120 минут / Ban 10 дней[/COLOR][/CENTER]<br>" +
		'[Color=#00FF00][CENTER]Одобрено, закрыто.[/I][/CENTER][/color][/FONT]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
	  title: '_______________________________________ Для РП ситуаций и РП биографий____________________________________ ',
	},
    {
      title: 'био одобрено',
      content:
		'[Color=#ffffff][FONT=trebuchet ms][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Ваша РП биография получает статус: [Color=#00ff00]Одобрено.[/I][/CENTER][/color][/FONT]",
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'био отказ',
      content:
		'[Color=#ffffff][FONT=trebuchet ms][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Ваша РП биография получает статус: [Color=#ff0000]Отказано.[/color]<br>Причиной отказа могло послужить какое-либо нарушение из [URL='https://forum.blackrussia.online/index.php?threads/choco-%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%BE%D0%B7%D0%B4%D0%B0%D0%BD%D0%B8%D1%8F-%D0%B8-%D1%84%D0%BE%D1%80%D0%BC%D0%B0-roleplay-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8.1501811/']Правил создания RolePlay биографии[/URL].[/CENTER][/FONT]",
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'ситуация одобрено',
      content:
		'[Color=#ffffff][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Ваша РП ситуация получает статус: [Color=#00ff00]Одобрено.[/I][/CENTER][/color][/FONT]",
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'ситуация отказ',
      content:
		'[Color=#ffffff][FONT=trebuchet ms][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Ваша РП ситуация получает статус: [Color=#ff0000]Отказано.[/color]<br>Причиной отказа могло послужить какое-либо нарушение из [URL='https://forum.blackrussia.online/index.php?threads/choco-%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-roleplay-%D1%81%D0%B8%D1%82%D1%83%D0%B0%D1%86%D0%B8%D0%B9.1426093/']Правил создания RolePlay ситуации[/URL].[/CENTER][/FONT]",
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
	  title: '_______________________________________ Для Главных Следящих госс и опг____________________________________ ',
	},
     {
	  title: 'Беседа с ЛД',
	  content:
		'[Color=#ffffff][FONT=trebuchet ms][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
		"[CENTER]С лидером/заместителем будет проведена беседа..[/CENTER]<br>" +
		'[Color=#00FF00][CENTER]Приятной игры и времяпровождения..[/I][/CENTER][/color][/FONT]',
      prefix: RESHENO_PREFIX,
	  status: false,
	},
    {
	  title: 'ЛД Наказан',
	  content:
		'[Color=#ffffff][FONT=trebuchet ms][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
		"[CENTER]Данный лидер будет наказан.[/CENTER]<br>" +
		'[Color=#00FF00][CENTER]Приятной игры и времяпровождения..[/I][/CENTER][/color][/FONT]',
      prefix: RESHENO_PREFIX,
	  status: false,
	},
    {
	  title: 'Испр ЛД',
	  content:
		'[Color=#ffffff][FONT=trebuchet ms][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
		"[CENTER]Нарушения от лидера будут исправлены.Прошу прощения за данный инцидент.[/CENTER]<br>" +
		'[Color=#00FF00][CENTER]Приятной игры и времяпровождения.[/I][/CENTER][/color][/FONT]',
      prefix: ACCEPT_PREFIX,
	  status: false,
	},
    {
	  title: 'Зам Наказан',
	  content:
		'[Color=#ffffff][FONT=trebuchet ms][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
		"[CENTER]Заместитель лидера будет наказан.[/CENTER]<br>" +
		'[Color=#00FF00][CENTER]Приятной игры и времяпровождения..[/I][/CENTER][/color][/FONT]',
      prefix: RESHENO_PREFIX,
	  status: false,
	},
    {
      title: 'Мало доков',
      content:
		'[Color=#ffffff][FONT=trebuchet ms][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Недостаточно доказательств на нарушение от данного лидера/заместителя.<br>Доказательства должны быть предоставлены в хорошем качестве и с полным процессом сделки или нарушения от какого-либо игрока.[/CENTER]<br>" +
		'[Color=#ff0000][CENTER]Отказано, закрыто.[/I][/CENTER][/color][/FONT]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'на рассмотрении',
      content:
		'[Color=#ffffff][FONT=trebuchet ms][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Ваша жалоба взята на [COLOR=#ff4500]рассмотрение[/COLOR].<br>Просьба ожидать ответа и не создавать дубликаты данной темы.[/CENTER]<br>" +
		'[Color=#ff4500][CENTER]Ожидайте ответа.[/I][/CENTER][/color][/FONT]',
      prefix: PIN_PREFIX,
	  status: true,
    },

  ];

  $(document).ready(() => {
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
        11 < hours && hours <= 18 ?
        'Добрый день' :
        18 < hours && hours <= 22 ?
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
