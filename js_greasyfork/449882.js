 //==UserScript==
// @name         SAMARA | Script for Forum
// @namespace    https://forum.blackrussia.online
// @version      1.0.5
// @description  try to take over the world!
// @author       Roy_Climber
// @match        https://forum.blackrussia.online/index.php?threads/*
// @include      https://forum.blackrussia.online/index.php?threads/
// @grant        none
// @license 	 MIT
// @collaborator
// @icon https://icons.iconarchive.com/icons/aha-soft/iron-man/48/Ironman-Mask-3-Old-icon.png
// @copyright 2022,
// @updateURL https://openuserjs.org/meta/Intcaro/BR_Script_for_Forum.meta.js
// ==/UserScript==

(function () {
  'use strict';
const UNACCEPT_PREFIX = 4; // Prefix that will be set when thread closes
const ACCEPT_PREFIX = 8; // одобрено
const PIN_PREFIX = 2; // Prefix that will be set when thread pins
const COMMAND_PREFIX = 10; // Prefix that will be set when thread send to project team
const WATCHED_PREFIX = 9;
const CLOSE_PREFIX = 7;
    const TEH_PREFIX = 13;
const buttons = [
	{
	  title: 'Приветствие',
	  content:
		'[SIZE=4][FONT=Courier New][CENTER]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br><br>' + '[CENTER]  [/CENTER][/FONT][/SIZE]',
	},
	{
	  title: 'Форма подачи жалобы',
	  content:
		'[SIZE=4][FONT=Courier New][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
		"[CENTER]Пожалуйста, убедительная просьба, ознакомится с формой подачи жалобы на игроков:[URL=https://forum.blackrussia.online/index.php?threads/Правила-подачи-жалобы-на-игрока-если-не-по-форме-—-отказ.193402/]*ТЫК*[/URL][/CENTER]<br><br>" +
		'[CENTER][ICODE]Отказано, закрыто.[/ICODE][/CENTER][/FONT][/SIZE]',
      prefix: CLOSE_PREFIX,
	  status: false,
	},
	{
      title: 'Название жалобы не по форме',
	  content:
		'[SIZE=4][FONT=courier new][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
		"[CENTER]Название жалобы составлено не по форме. Внимательно прочитайте правила составления жалобы:[URL=https://forum.blackrussia.online/index.php?threads/Правила-подачи-жалоб-на-игроков.2639619/]*ТЫК*[/URL][/CENTER]<br>" +
        "[CENTER] В названии темы необходимо написать: “Nick_Name | Суть жалобы“[/CENTER]<br><br>" +
		'[CENTER][ICODE]Отказано, закрыто.[/ICODE][/CENTER][/FONT][/SIZE]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
	{
	  title: 'Нет доказательств ',
	  content:
        '[SIZE=4][FONT=Courier New][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
        "[CENTER]В вашей жалобе нет доказательств. [/CENTER]<br><br>" +
		'[CENTER][ICODE]Отказано, закрыто.[/ICODE][/CENTER][/FONT][/SIZE]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
	  title: 'Нет нарушений ',
	  content:
        '[SIZE=4][FONT=Courier New][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
        "[CENTER]В вашей жалобе нет нарушений со стороны игрока. [/CENTER]<br><br>" +
		'[CENTER][ICODE]Отказано, закрыто.[/ICODE][/CENTER][/FONT][/SIZE]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
	{
	  title: 'Не хватает /time',
	  content:
		'[SIZE=4][FONT=Courier New][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
		"[CENTER]К сожалению вам отказано в жалобе. [/CENTER]<br><br>" +
		"[CENTER]На скриншоте отсутствует /time.<br><br>" +
		'[CENTER][ICODE]Отказано, закрыто.[/ICODE][/CENTER][/FONT][/SIZE]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
     },
	 {
	  title: 'Недостаточно доказательств',
	  content:
        '[SIZE=4][FONT=Courier New][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
        "[CENTER]В вашей жалобе недостаточно доказательств. [/CENTER]<br><br>" +
		'[CENTER][ICODE]Отказано, закрыто.[/ICODE][/CENTER][/FONT][/SIZE]',
        prefix: UNACCEPT_PREFIX,
	  status: false,
    },
	 {
	  title: 'Прошло 3 дня',
	  content:
        '[SIZE=4][FONT=Courier New][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
        "[CENTER]С момента нарушения игрока прошло более трех суток. [/CENTER]<br><br>" +
		'[CENTER][ICODE]Отказано, закрыто.[/ICODE][/CENTER][/FONT][/SIZE]',
        prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    	 {
	  title: 'Жалоба на адм',
	  content:
        '[SIZE=4][FONT=Courier New][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
        "[CENTER]Обратитесь в раздел - Жалобы на администрацию. [/CENTER]<br><br>" +
		'[CENTER][ICODE]Отказано, закрыто.[/ICODE][/CENTER][/FONT][/SIZE]',
        prefix: UNACCEPT_PREFIX,
	  status: false,
    },
	{
        title: 'Отправить на рассмотрение',
	  content:
		'[SIZE=4][FONT=courier new][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
		"[CENTER]Ваша жалоба взята на рассмотрение. Ожидайте, пожалуйста, ответа от администрации и не нужно создавать копии этой темы.[/CENTER]<br><br>" +
		'[CENTER][ICODE]Ожидайте ответа.[/ICODE][/CENTER][/FONT][/SIZE]<br>',
	  prefix: PIN_PREFIX,
	  status: true,
	},
	{
	  title: 'Дублирование темы',
	  content:
		'[SIZE=4][FONT=Courier New][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
		"[CENTER]Дублирование темы. Напоминаем, при 3 дублированиях – форумный аккаунт будет заблокирован.<br><br>" +
		'[CENTER][ICODE]Отказано, закрыто.[/ICODE][/CENTER][/FONT][/SIZE]',
      prefix: CLOSE_PREFIX,
	  status: false,
	},
	{
	  title: 'НонРП ВЧ (ОПГ)',
	  content:
		'[SIZE=4][FONT=Courier New][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
		"[CENTER]Игрок будет наказан.[/CENTER]<br><br>" +
        "[CENTER] За нарушение правил нападения на Войсковую Часть выдаётся предупреждение Warn (Для сотрудников ОПГ)[/CENTER]<br><br>" +
		'[CENTER][ICODE]Одобрено, закрыто.[/ICODE][/CENTER][/FONT][/SIZE]<br>',
        prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: 'НонРП ВЧ (Игрок)',
	  content:
		'[SIZE=4][FONT=Courier New][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
		"[CENTER]Игрок будет наказан.[/CENTER]<br><br>" +
        "[CENTER] За нарушение правил нападения на Войсковую Часть выдаётся предупреждение | Jail 30 минут(NonRP, нападение)[/CENTER]<br><br>" +
		'[CENTER][ICODE]Одобрено, закрыто.[/ICODE][/CENTER][/FONT][/SIZE]<br>',
        prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: 'DM',
	  content:
		'[SIZE=4][FONT=Courier New][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
		"[CENTER]2.19. Запрещен DM (DeathMatch) — убийство или нанесение урона без веской IC причины | Jail 60 минут. [/CENTER]<br><br>" +
        "[CENTER] Примечание: разрешен ответный DM в целях защиты, обязательно иметь видеодоказательство в случае наказания администрации.[/CENTER]<br><br>" +
		'[CENTER][ICODE]Одобрено, закрыто.[/ICODE][/CENTER][/FONT][/SIZE]<br>',
        prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: 'УРП',
	  content:
		'[SIZE=4][FONT=Courier New][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
		"[CENTER]2.02. Запрещено целенаправленно уходить от Role Play процесса всеразличными способами | Jail 30 минут / Warn [/CENTER]<br><br>" +
		'[CENTER][ICODE]Одобрено, закрыто.[/ICODE][/CENTER][/FONT][/SIZE]<br>',
        prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: 'DB',
	  content:
        '[SIZE=4][FONT=Courier New][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
        "[CENTER]Данный игрок будет наказан по пункту 2.13 [/CENTER]<br><br>" +
        "[CENTER]Запрещен DB (DriveBy) — намеренное убийство / нанесение урона без веской IC причины на любом виде транспорта | Jail 60 минут [/CENTER]<br><br>" +
		'[CENTER][ICODE]Одобрено, закрыто.[/ICODE][/CENTER][/FONT][/SIZE]<br>',
               prefix: ACCEPT_PREFIX,
	  status: false,
     },
	{
	  title: 'TK',
	  content:
		'[SIZE=4][FONT=Courier New][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
		"[CENTER]Данный игрок получит наказание по пункту 2.15 [/CENTER]<br><br>" +
        "[CENTER]Запрещен TK (Team Kill) — убийство члена своей или союзной фракции, организации без наличия какой-либо IC причины | Jail 60 минут / Warn (за два и более убийства) [/CENTER]<br><br>" +
		'[CENTER][ICODE]Одобрено, закрыто.[/ICODE][/CENTER][/FONT][/SIZE]<br>',
              prefix: ACCEPT_PREFIX,
	  status: false,
     },
	{
	  title: 'SK',
	  content:
		'[SIZE=4][FONT=Courier New][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
		"[CENTER]Данный игрок получит наказание по пункту 2.16 [/CENTER]<br><br>" +
        "[CENTER]Запрещен SK (Spawn Kill) — убийство или нанесение урона на титульной территории любой фракции / организации, на месте появления игрока, а также на выходе из закрытых интерьеров и около них | Jail 60 минут / Warn (за два и более убийства) [/CENTER]<br><br>" +
		'[CENTER][ICODE]Одобрено, закрыто.[/ICODE][/CENTER][/FONT][/SIZE]<br>',
              prefix: ACCEPT_PREFIX,
	  status: false,
     },
	{
	  title: 'PG',
	  content:
		'[SIZE=4][FONT=Courier New][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
		"[CENTER]Данный игрок получит наказание по пункту 2.17 [/CENTER]<br><br>" +
        "[CENTER]Запрещен PG (PowerGaming) присвоение свойств персонажу, не соответствующих реальности, отсутствие страха за свою жизнь | Jail 30 минут [/CENTER]<br><br>" +
		'[CENTER][ICODE]Одобрено, закрыто.[/ICODE][/CENTER][/FONT][/SIZE]<br>',
              prefix: ACCEPT_PREFIX,
	  status: false,
     },
	{
	  title: 'RK',
	  content:
		'[SIZE=4][FONT=Courier New][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
		"[CENTER]Данный игрок получит наказание по пункту 2.14 [/CENTER]<br><br>" +
        "[CENTER]Запрещен RK (Revenge, Kill) убийство игрока с целью мести, возвращение на место смерти в течение 15 - ти минут, а также использование в дальнейшем информации, которая привела вас к смерти | Jail 30 минут [/CENTER]<br><br>" +
		'[CENTER][ICODE]Одобрено, закрыто.[/ICODE][/CENTER][/FONT][/SIZE]<br>',
              prefix: ACCEPT_PREFIX,
	  status: false,
     },
	{
	  title: 'MG',
	  content:
		'[SIZE=4][FONT=Courier New][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
		"[CENTER]Данный игрок будет наказан по пункту 2.18 [/CENTER]<br><br>" +
        "[CENTER]Запрещен MG (MetaGaming) — использование ООС информации, которую Ваш персонаж никак не мог получить в IC процессе | Mute 30 минут [/CENTER]<br><br>" +
		'[CENTER][ICODE]Одобрено, закрыто.[/ICODE][/CENTER][/FONT][/SIZE]<br>',
              prefix: ACCEPT_PREFIX,
	  status: false,
     },
	{
	  title: 'ЕПП (Грузовик)',
	  content:
		'[SIZE=4][FONT=Courier New][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
		"[CENTER]Данный игрок получит наказание по пункту 2.47 [/CENTER]<br><br>" +
        "[CENTER]Запрещено ездить по полям на грузовом транспорте, инкассаторских машинах (работа дальнобойщика, инкассатора) | Jail 60 минут [/CENTER]<br><br>" +
		'[CENTER][ICODE]Одобрено, закрыто.[/ICODE][/CENTER][/FONT][/SIZE]<br>',
              prefix: ACCEPT_PREFIX,
	  status: false,
     },
	{
	  title: 'ЕПП (Обычный)',
	  content:
		'[SIZE=4][FONT=Courier New][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
		"[CENTER]Данный игрок получит наказание по пункту 2.46 [/CENTER]<br><br>" +
        "[CENTER]2.46.Запрещено ездить по полям на любом транспорте | Jail 30 минут [/CENTER]<br><br>" +
		"[CENTER]Исключение: разрешено передвижение на кроссовых мотоциклах и внедорожниках. [/CENTER]<br><br>" +
		'[CENTER][ICODE]Одобрено, закрыто.[/ICODE][/CENTER][/FONT][/SIZE]<br>',
              prefix: ACCEPT_PREFIX,
	  status: false,
     },
	{
	  title: 'NRD',
	  content:
		'[SIZE=4][FONT=Courier New][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
		"[CENTER]Данный игрок получит наказание по пункту 2.03 [/CENTER]<br><br>" +
        "[CENTER]Запрещен NonRP; Drive вождение любого транспортного средства в невозможных для него условиях, а также вождение в неправдоподобной манере | Jail 30 минут [/CENTER]<br><br>" +
		"[CENTER]Примечание: езда на скутере по горам, езда на любом транспортном средстве по встречным полосам, нарушая все правила дорожного движения без какой - либо причины, намеренное создание аварийных ситуаций на дорогах и так далее. [/CENTER]<br><br>" +
		'[CENTER][ICODE]Одобрено, закрыто.[/ICODE][/CENTER][/FONT][/SIZE]<br>',
              prefix: ACCEPT_PREFIX,
	  status: false,
     },
	{
	  title: 'Док-ва в соц.сети',
	  content:
		'[SIZE=4][FONT=Courier New][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
		"[CENTER]Согласно пункту правил 3.6. при создании жалоб на игроков: [/CENTER]<br><br>" +
	"[CENTER]3.6. Прикрепление доказательств обязательно.[/CENTER]<br><br>" +
		"[CENTER]Примечание: загрузка доказательств в соц. сети (ВКонтакте, instagram) запрещается, доказательства должны быть загружены на фото/видео хостинги (YouTube, Япикс, imgur). [/CENTER]<br><br>" +
		'[CENTER][ICODE]Отказано, закрыто.[/ICODE][/CENTER][/FONT][/SIZE]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
     },
	 {
	  title: 'Flood',
	  content:
		'[SIZE=4][FONT=Courier New][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
		"[CENTER]Данный игрок будет наказан по пункту 3.05 [/CENTER]<br><br>" +
        "[CENTER]Запрещен флуд — 3 и более повторяющихся сообщений от одного и того же игрока | Mute 30 минут [/CENTER]<br><br>" +
		'[CENTER][ICODE]Одобрено, закрыто.[/ICODE][/CENTER][/FONT][/SIZE]',
              prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: 'CapsLock',
	  content:
		'[SIZE=4][FONT=Courier New][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
		"[CENTER]Данный игрок будет наказан по пункту 3.02 [/CENTER]<br><br>" +
        "[CENTER]Запрещено использование верхнего регистра (CapsLock) при написании любого текста в чате | Mute 30 минут [/CENTER]<br><br>" +
		'[CENTER][ICODE]Одобрено, закрыто.[/ICODE][/CENTER][/FONT][/SIZE]<br>',
              prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: 'Упоминание Родных',
	  content:
		'[SIZE=4][FONT=Courier New][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
		"[CENTER]Игрок получит наказание по пункту 3.04. [/CENTER]<br><br>" +
        "[CENTER]3.04. Запрещено оскорбление или косвенное упоминание кровных родных вне зависимости от чата (IC или OOC)| Mute 120 минут / Ban 7 - 15 дней. [/CENTER]<br><br>" +
		'[CENTER][ICODE]Одобрено, закрыто.[/ICODE][/CENTER][/FONT][/SIZE]<br>',
      prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: 'Уход от наказания',
	  content:
		'[SIZE=4][FONT=Courier New][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
		"[CENTER]Игрок получит наказание по пункту 2.34. [/CENTER]<br><br>" +
        "[CENTER]Запрещен уход от наказания | Ban 15 - 30 дней (суммируется к общему наказанию дополнительно) [/CENTER]<br><br>" +
        "[CENTER]Примечание: зная, что в данный момент игроку может быть выдано наказание за какое - либо нарушение, изменение никнейма или передача своего имущества на другие аккаунты и тому подобное. [/CENTER]<br><br>" +
        "[CENTER]Примечание: выход игрока из игры не является уходом от наказания. [/CENTER]<br><br>" +
		'[CENTER][ICODE]Одобрено, закрыто.[/ICODE][/CENTER][/FONT][/SIZE]<br>',
      prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: 'РП в свою сторону',
	  content:
		'[SIZE=4][FONT=Courier New][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
		"[CENTER]Игрок получит наказание по пункту 2.06. [/CENTER]<br><br>" +
        "[CENTER]Запрещены любые Role Play отыгровки в свою сторону или пользу | Jail 30 минут [/CENTER]<br><br>" +
		'[CENTER][ICODE]Одобрено, закрыто.[/ICODE][/CENTER][/FONT][/SIZE]<br>',
      prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: 'Задержание на аукционне',
	  content:
		'[SIZE=4][FONT=Courier New][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
		"[CENTER]Игрок получит наказание по пункту 2.50. [/CENTER]<br><br>" +
        "[CENTER]Запрещены задержания, аресты, а также любые действия со стороны игроков, состоящих во фракциях в интерьере аукциона | Ban 7 - 15 дней + увольнение из организации. [/CENTER]<br><br>" +
		'[CENTER][ICODE]Одобрено, закрыто.[/ICODE][/CENTER][/FONT][/SIZE]<br>',
      prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: 'Вмешательство в РП',
	  content:
		'[SIZE=4][FONT=Courier New][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
		"[CENTER]Игрок получит наказание по пункту 2.51. [/CENTER]<br><br>" +
        "[CENTER]Запрещено вмешательство в Role Play процесс с целью помехи и препятствования дальнейшего развития Role Play процесса | Jail 30 минут [/CENTER]<br><br>" +
        "[CENTER]Пример: вмешательство в Role Play процесс при задержании игрока сотрудниками ГИБДД, вмешательство в проведение тренировки или мероприятия какой - либо фракции и тому подобные ситуации. [/CENTER]<br><br>" +
		'[CENTER][ICODE]Одобрено, закрыто.[/ICODE][/CENTER][/FONT][/SIZE]<br>',
      prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: 'Злоупотребление знаками',
	  content:
		'[SIZE=4][FONT=Courier New][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
		"[CENTER]Игрок получит наказание по пункту 3.06. [/CENTER]<br><br>" +
        "[CENTER]Запрещено злоупотребление знаков препинания и прочих символов | Mute 30 минут [/CENTER]<br><br>" +
        "[CENTER]Пример: ??  ??  ??  ?, !!!!!!!, Дааааааааааааааааааааааа и так далее. [/CENTER]<br><br>" +
		'[CENTER][ICODE]Одобрено, закрыто.[/ICODE][/CENTER][/FONT][/SIZE]<br>',
      prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: 'NonRP Развод',
	  content:
		'[SIZE=4][FONT=Courier New][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
		"[CENTER]Игрок получит наказание по пункту 2.05. [/CENTER]<br><br>" +
        "[CENTER]2.05. Запрещены любые OOC обманы и их попытки, а также любые IC обманы с нарушением Role Play правил и логики | PermBan [/CENTER]<br><br>" +
        "[CENTER] Примечание: после IC договоренности получить денежные средства и сразу же выйти из игры с целью обмана игрока, или же договорившись через OOC чат (/n) точно также [/CENTER]<br><br>" +
        "[CENTER] получить денежные средства и сразу же выйти из игры, а также тому подобные ситуации. [/CENTER]<br><br>" +
        "[CENTER] Примечание: разблокировка игрового аккаунта нарушителя будет возможна только в случае возврата полной суммы причиненного ущерба, либо непосредственно самого [/CENTER]<br><br>" +
        "[CENTER]имущества, которое было украденого (по решению обманутой стороны). [/CENTER]<br>" +
		'[CENTER][ICODE]Одобрено, закрыто.[/ICODE][/CENTER][/FONT][/SIZE]<br>',
      prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
		title: 'НонРП акс',
		content:
	'[SIZE=4][FONT=Courier New][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
	"[CENTER] Данный игрок будет наказан по пункт правил 2.52 <br><br>" +
	" 2.52. Запрещено располагать аксессуары на теле персонажа, нарушая нормы морали и этики, увеличивать аксессуары до слишком большого размера. | При первом нарушении - обнуление аксессуаров, при повторном нарушении - обнуление аксессуаров + JAIL 30 минут <br><br>" +
	" Пример: слишком большие аксессуары на голове персонажа, имитация гитарой половых органов и тому подобное. [/CENTER] <br><br>" +
	'[CENTER][ICODE]Одобрено, закрыто.[/ICODE][/CENTER][/FONT][/SIZE]',
              prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
		title: 'Реклама промокода',
        content:
		'[SIZE=4] [FONT=Courier New] [CENTER] {{ greeting }}, уважаемый {{ user.mention}} [/CENTER]<br><br>' +
        "[CENTER]Данный игрок будет наказан по пункту 3.21 [/CENTER]<br><br>" +
		"[CENTER]3.21. Запрещается реклама промокодов в игре, а также их упоминание в любом виде во всех чатах. | Ban 30 дней <br>" +
		"[CENTER]Примечание: чаты семейные, строительных компаний, транспортных компаний, фракционные чаты, IC, OOC, VIP и так далее. [/CENTER]<br><br>" +
		"[CENTER]Исключение: промокоды, предоставленные разработчиками, а также распространяемые через официальные ресурсы проекта. [/CENTER]<br><br>" +
		'[CENTER][ICODE]Одобрено, закрыто.[/ICODE][/CENTER][/FONT][/SIZE]<br>',
     prefix: ACCEPT_PREFIX,
	 status: false,
    },
	{
		title: 'ПО',
        content:
		'[SIZE=4] [FONT=Courier New] [CENTER] {{ greeting }}, уважаемый {{ user.mention}} [/CENTER]<br><br>' +
        "[CENTER]Данный игрок будет наказан по пункту 2.22 [/CENTER]<br><br>" +
		"[CENTER]Запрещено хранить / использовать / распространять стороннее программное обеспечение или любые другие средства, позволяющие получить преимущество над другими игроками | Ban 15 - 30 дней / PermBan | Ban 30 дней <br>" +
		"[CENTER]Примечание: запрещено внесение любых изменений в оригинальные файлы игры. [/CENTER]<br><br>" +
		"[CENTER]Исключение: разрешено изменение шрифта, его размера и длины чата (кол-во строк). [/CENTER]<br><br>" +
		'[CENTER][ICODE]Одобрено, закрыто.[/ICODE][/CENTER][/FONT][/SIZE]<br>',
     prefix: ACCEPT_PREFIX,
	 status: false,
    },
	{
	  title: 'Оск игроков',
	  content:
		'[SIZE=4][FONT=Courier New][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
		"[CENTER]Данный игрок будет наказан по пункту 3.03 [/CENTER]<br><br>" +
		"[CENTER]3.03. Любые формы оскорблений, издевательств, расизма, дискриминации, религиозной враждебности, сексизма в OOC чате запрещены | Mute 30 минут. [/CENTER]<br><br>" +
		'[CENTER][ICODE]Одобрено, закрыто.[/ICODE][/CENTER][/FONT][/SIZE]<br>',
              prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: 'Оск секс характера',
	  content:
		'[SIZE=4][FONT=Courier New][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
		"[CENTER]Данный игрок будет наказан по пункту 3.07 [/CENTER]<br><br>" +
		"[CENTER]Запрещены совершенно любые оскорбления или действия, порочащие честь и достоинства, несущие в себе подтекст сексуального характера вне зависимости от чата | Mute 30 минут [/CENTER]<br><br>" +
		"[CENTER]Примечание: дырка, шмара, ведро, мадагаскарский присосконог, свиноногий бандикут, скорострел и так далее. [/CENTER]<br><br>" +
		'[CENTER][ICODE]Одобрено, закрыто.[/ICODE][/CENTER][/FONT][/SIZE]<br>',
              prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: 'Реклама на госс',
	  content:
		'[SIZE=4][FONT=Courier New][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
		"[CENTER]Данный игрок будет наказан по пункту 3.22 [/CENTER]<br><br>" +
		"[CENTER]Запрещено публиковать любые объявления в помещениях государственных организаций вне зависимости от чата (IC или OOC) | Mute 30 минут [/CENTER]<br><br>" +
		"[CENTER]Пример: в помещении центральной больницы писать в чат: Продам эксклюзивную шапку дешево [/CENTER]<br><br>" +
		'[CENTER][ICODE]Одобрено, закрыто.[/ICODE][/CENTER][/FONT][/SIZE]<br>',
              prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: 'Нрп ник',
	  content:
		'[SIZE=4][FONT=Courier New][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
		"[CENTER]Данный игрок будет наказан по пункту 4.06 [/CENTER]<br><br>" +
		"[CENTER]Никнейм игрового аккаунта должен быть в формате Имя_Фамилия на английском языке | Устное замечание + смена игрового никнейма [/CENTER]<br><br>" +
		"[CENTER]Пример: John_Scatman — это правильный Role Play игровой никнейм, в котором не содержится ошибок. [/CENTER]<br><br>" +
		'[CENTER][ICODE]Одобрено, закрыто.[/ICODE][/CENTER][/FONT][/SIZE]<br>',
              prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: 'Оск ник',
	  content:
		'[SIZE=4][FONT=Courier New][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
		"[CENTER]Данный игрок будет наказан по пункту 4.09 [/CENTER]<br><br>" +
		"[CENTER]Запрещено использовать никнейм, содержащий в себе матерные слова или оскорбления (в том числе завуалированные) | Устное замечание + смена игрового никнейма / PermBan [/CENTER]<br><br>" +
		'[CENTER][ICODE]Одобрено, закрыто.[/ICODE][/CENTER][/FONT][/SIZE]<br>',
              prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: 'Похож ник',
	  content:
		'[SIZE=4][FONT=Courier New][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
		"[CENTER]Данный игрок будет наказан по пункту 4.10 [/CENTER]<br><br>" +
		"[CENTER]Запрещено создавать никнейм, повторяющий или похожий на существующие никнеймы игроков или администраторов по их написанию | Устное замечание + смена игрового никнейма / PermBan [/CENTER]<br><br>" +
		"[CENTER]Пример: подменять букву i на L и так далее, по аналогии. [/CENTER]<br><br>" +
		'[CENTER][ICODE]Одобрено, закрыто.[/ICODE][/CENTER][/FONT][/SIZE]<br>',
              prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: 'Форма госс в казе',
	  content:
		'[SIZE=4][FONT=Courier New][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
		"[CENTER]Данный игрок будет наказан по пункту 1.13 [/CENTER]<br><br>" +
		"[CENTER]Запрещено находиться в форме внутри казино, а также устраиваться на сторонние работы в форме фракции | Jail 30 минут [/CENTER]<br><br>" +
		'[CENTER][ICODE]Одобрено, закрыто.[/ICODE][/CENTER][/FONT][/SIZE]<br>',
              prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: 'Рассмотрение для теха',
	  content:
		'[SIZE=4][FONT=Courier New][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
		"[CENTER]Жалоба передана Техническому Специалисту, ожидайте и не создавайте копий этой жалобы. [/CENTER]<br><br>" +
		'[CENTER][ICODE] Закрыто, на расмотрении.[/ICODE][/CENTER][/FONT][/SIZE]<br>',
        prefix: TEH_PREFIX,
	  status: true,
     },
	{
	  title: 'Жалоба от 3-го лица',
	  content:
		'[SIZE=4][FONT=Courier New][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
		"[CENTER]Ваша жалоба составлена от третьего лица. [/CENTER]<br><br>" +
		'[CENTER][ICODE]Отказано, закрыто.[/ICODE][/CENTER][/FONT][/SIZE]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
	},
    {
	  title: 'Mass DM',
	  content:
        '[SIZE=4][FONT=Courier New][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
        "[CENTER]Данный игрок будет наказан по пункту 2.20 [/CENTER]<br><br>" +
        "[CENTER]Запрещен Mass DM (Mass DeathMatch) — убийство или нанесение урона без веской IC причины трем игрокам и более | Warn / Ban 3 - 7 дней [/CENTER]<br><br>" +
		'[CENTER][ICODE]Одобрено, закрыто.[/ICODE][/CENTER][/FONT][/SIZE]<br>',
        prefix: ACCEPT_PREFIX,
	  status: false,
     },
	{
	  title: 'Заблуждение',
	  content:
        '[SIZE=4][FONT=Courier New][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
        "[CENTER]Данный игрок будет наказан по пункту 2.32 [/CENTER]<br><br>" +
        "[CENTER]Запрещено введение в заблуждение, обман администрации на всех ресурсах проекта | Ban 7 - 15 дней [/CENTER]<br><br>" +
		'[CENTER][ICODE]Одобрено, закрыто.[/ICODE][/CENTER][/FONT][/SIZE]<br>',
        prefix: ACCEPT_PREFIX,
	  status: false,
     },
	{
	  title: 'Уязвимость правил',
	  content:
        '[SIZE=4][FONT=Courier New][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
        "[CENTER]Данный игрок будет наказан по пункту 2.33 [/CENTER]<br><br>" +
        "[CENTER]Запрещено пользоваться уязвимостью правил | Ban 15 дней [/CENTER]<br><br>" +
		'[CENTER][ICODE]Одобрено, закрыто.[/ICODE][/CENTER][/FONT][/SIZE]<br>',
        prefix: ACCEPT_PREFIX,
	  status: false,
     },
	{
	  title: 'ООС угрозы',
	  content:
        '[SIZE=4][FONT=Courier New][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
        "[CENTER]Данный игрок будет наказан по пункту 2.37 [/CENTER]<br><br>" +
        "[CENTER]Запрещены OOC угрозы, в том числе и завуалированные | Mute 120 минут / Ban 7 дней [/CENTER]<br><br>" +
		'[CENTER][ICODE]Одобрено, закрыто.[/ICODE][/CENTER][/FONT][/SIZE]<br>',
        prefix: ACCEPT_PREFIX,
	  status: false,
     },
    {
	  title: 'Реклама, Пиар',
	  content:
        '[SIZE=4][FONT=Courier New][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
        "[CENTER]Данный игрок будет наказан по пункту 2.31 [/CENTER]<br><br>" +
        "[CENTER]Запрещено рекламировать на серверах любые проекты, серверы, сайты, сторонние Discord-серверы, YouTube каналы и тому подобное | Ban 7 дней / PermBan [/CENTER]<br><br>" +
		'[CENTER][ICODE]Одобрено, закрыто.[/ICODE][/CENTER][/FONT][/SIZE]<br>',
              prefix: ACCEPT_PREFIX,
	  status: false,
             },
    {
        title: 'Оск нации',
        content:
        '[SIZE=4][FONT=Courier New][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
        "[CENTER]2.35. На игровых серверах запрещено устраивать IC и OOC конфликты на почве разногласия о национальности и / или религии совершенно в любом формате | Mute 120 минут / Ban 7 дней [/CENTER]<br><br>" +
        '[CENTER][ICODE]Одобрено, закрыто.[/ICODE][/CENTER][/FONT][/SIZE]<br>',
        prefix: ACCEPT_PREFIX,
        status: false,
    },
    {
        title: 'Политика',
        content:
        '[SIZE=4][FONT=Courier New][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
        "[CENTER]3.18. Запрещено политическое и религиозное пропагандирование | Mute 120 минут / Ban 10 дней[/CENTER]<br><br>" +
        '[CENTER][ICODE]Одобрено, закрыто.[/ICODE][/CENTER][/FONT][/SIZE]<br>',
        prefix: ACCEPT_PREFIX,
        status: false,
    },
    {
         title: 'Слив склада',
        content:
        '[SIZE=4][FONT=Courier New][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
        "[CENTER]2.09. Запрещено сливать склад фракции / семьи путем взятия большого количестве ресурсов, или же брать больше, чем разрешили на самом деле | Ban 15 - 30 дней / PermBan [/CENTER]<br><br>" +
        '[CENTER][ICODE]Одобрено, закрыто.[/ICODE][/CENTER][/FONT][/SIZE]<br>',
        prefix: ACCEPT_PREFIX,
        status: false,
    },
    {
        title: 'Слив чата',
        content:
        '[SIZE=4][FONT=Courier New][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
        "[CENTER]3.08. Запрещены любые формы «слива» посредством использования глобальных чатов | PermBan[/CENTER]<br><br>" +
        '[CENTER][ICODE]Одобрено, закрыто.[/ICODE][/CENTER][/FONT][/SIZE]<br>',
        prefix: ACCEPT_PREFIX,
        status: false,
    },
    {
        title: 'НонРП Коп/ФСБ',
        content:
        '[SIZE=4][FONT=Courier New][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
        "[CENTER]6.04. Запрещено nRP поведение | Warn [/CENTER]<br><br>" +
       "[CENTER]Примечание: поведение, не соответствующее сотруднику УМВД/ГИБДД/ФСБ. [/CENTER]<br><br>" +
       "[CENTER]Пример: открытие огня по игрокам без причины, расстрел машины без причины, задержание без отыгровко и тому подобное. [/CENTER]<br><br>" +
        '[CENTER][ICODE]Одобрено, закрыто.[/ICODE][/CENTER][/FONT][/SIZE]<br>',
        prefix: ACCEPT_PREFIX,
        status: false,
    },
    {
        title: 'НонРП коп Розыск/Штраф',
        content:
        '[SIZE=4][FONT=Courier New][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
        "[CENTER]7.02. Запрещено выдавать розыск/штраф без Role Play причины | Jail 30 минут [/CENTER]<br><br>" +
        '[CENTER][ICODE]Одобрено, закрыто.[/ICODE][/CENTER][/FONT][/SIZE]<br>',
        prefix: ACCEPT_PREFIX,
        status: false,
    },
    {
        title: 'НонРП коп Задержание',
        content:
        '[SIZE=4][FONT=Courier New][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
        "[CENTER]6.03. Запрещено оказывать задержание без Role Play отыгровки | Warn [/CENTER]<br><br>" +
        '[CENTER][ICODE]Одобрено, закрыто.[/ICODE][/CENTER][/FONT][/SIZE]<br>',
        prefix: ACCEPT_PREFIX,
        status: false,
    },
    {
        title: 'НонРП Охрана',
        content:
        '[SIZE=4][FONT=Courier New][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
        "[CENTER]2.03. Охраннику казино запрещено выгонять игрока без причины | Увольнение с должности | Jail 30 минут. [/CENTER]<br><br>" +
        '[CENTER][ICODE]Одобрено, закрыто.[/ICODE][/CENTER][/FONT][/SIZE]<br>',
        prefix: ACCEPT_PREFIX,
        status: false,
    },
     {
	  title: 'Выдача себя за Администратора',
	  content:
        '[SIZE=4][FONT=Courier New][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
        "[CENTER]Данный игрок будет наказан по пункту 3.10 [/CENTER]<br><br>" +
        "[CENTER]Запрещена выдача себя за администратора, если таковым не являетесь | Ban 7 - 15 + ЧС администрации [/CENTER]<br><br>" +
		'[CENTER][ICODE]Одобрено, закрыто.[/ICODE][/CENTER][/FONT][/SIZE]<br>',
      prefix: ACCEPT_PREFIX,
	  status: false,
             },
       {
	  title: 'Оск проекта',
	  content:
        '[SIZE=4][FONT=Courier New][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
        "[CENTER]Данный игрок будет наказан по пункту 2.40 [/CENTER]<br><br>" +
        "[CENTER]Запрещены совершенно любые деструктивные действия по отношению к проекту: неконструктивная критика, призывы покинуть проект, попытки нарушить развитие проекта или любые другие действия, способные привести к помехам в игровом процессе | Mute 300 минут / Ban 30 дней [/CENTER]<br><br>" +
		'[CENTER][ICODE]Одобрено, закрыто.[/ICODE][/CENTER][/FONT][/SIZE]<br>' ,
                 prefix: ACCEPT_PREFIX,
	  status: false,
      },
        {
	  title: 'Оскорбление Администрации',
	  content:
        '[SIZE=4][FONT=Courier New][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
        "[CENTER]Данный игрок будет наказан по пункту 2.54 [/CENTER]<br><br>" +
        "[CENTER]Запрещено неуважительное обращение, оскорбление, неадекватное поведение, угрозы в любом их проявлении по отношению к администрации | Mute 180 минут [/CENTER]<br><br>" +
		'[CENTER][ICODE]Одобрено, закрыто.[/ICODE][/CENTER][/FONT][/SIZE]<br>',
                  prefix: ACCEPT_PREFIX,
	  status: false,
        },
		{
      title: 'Рп био одобрено',
	  content:
		'[SIZE=4][FONT=Courier New][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
		"[CENTER]Внимательно ознакомившись с вашей рп биографией, было принято решение дать вашей биографии статут одобрено.[/CENTER]<br><br>" +
		'[CENTER][ICODE]Одобрено, закрыто.[/ICODE][/CENTER][/FONT][/SIZE]<br>',
      prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
      title: 'Рп био отказано',
	  content:
		'[SIZE=4][FONT=Courier New][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
		"[CENTER]Внимательно ознакомившись с вашей рп биографией, было принято решение дать вашей биографии статут отказано.[/CENTER]<br><br>" +
		'[CENTER][ICODE]Отказано, закрыто.[/ICODE][/CENTER][/FONT][/SIZE]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
	},
	{
        title: 'Рп био отказано название',
	  content:
		'[SIZE=4][FONT=Courier New][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
		"[CENTER]Внимательно ознакомившись с вашей рп биографией, было принято решение дать вашей биографии статут отказано.[/CENTER]<br><br>" +
        "[CENTER]Причина: Название рп биографии не по форме. Внимательно прочитайте правила составления жалобы:[URL=https://forum.blackrussia.online/index.php?threads/samara-Правила-создания-и-форма-roleplay-биографии.2623145/]*ТЫК*[/URL][/CENTER]<br>" +
        "[CENTER]Заголовок создаваемой темы должен быть написан строго по данной форме: “RolePlay биография гражданина Имя Фамилия.“[/CENTER]<br><br>" +
		'[CENTER][ICODE]Отказано, закрыто.[/ICODE][/CENTER][/FONT][/SIZE]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
	},
	{
        title: 'Рп био на расмотрении',
	  content:
		'[SIZE=4][FONT=Courier New][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
		"[CENTER]Внимательно ознакомившись с вашей рп биографией, было принято решение что бы вы внимательно изучили вашу РП-Биографию и дополнили пункт .[/CENTER]<br><br>" +
		'[CENTER][ICODE] На рассмотрение[/ICODE][/CENTER][/FONT][/SIZE]<br>',
      prefix: PIN_PREFIX,
	  status: false,
	},
    {
        title: 'РП сит-я ОДОБОЕНО',
        content:
        '[SIZE=4][FONT=Courier New][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
        "[CENTER]Внимательно ознакомившись с вашей рп ситуацией, было принято решение дать вашей рп ситуацие статус одобрено.[/CENTER]<br><br>" +
        '[CENTER][ICODE]Одобрено, закрыто.[/ICODE][/CENTER][/FONT][/SIZE]<br>',
        prefix: ACCEPT_PREFIX,
        status: false,
    },
    {
        title: 'РП сит-я ОТКАЗАНО',
        content:
        '[SIZE=4][FONT=Courier New][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
        "[CENTER]Внимательно ознакомившись с вашей рп ситуацией, было принято решение дать вашей рп ситуацие статус отказано.[/CENTER]<br><br>" +
        '[CENTER][ICODE]Отказано, закрыто.[/ICODE][/CENTER][/FONT][/SIZE]<br>',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
        title: 'РП орг-ия ОДОБРЕНО',
        content:
        '[SIZE=4][FONT=Courier New][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
        "[CENTER]Внимательно ознакомившись с вашей неофициальной рп организацией, было принято решение дать вашей организацие статут одобрено.[/CENTER]<br><br>" +
        '[CENTER][ICODE]Одобрено, закрыто.[/ICODE][/CENTER][/FONT][/SIZE]<br>',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
        title: 'РП орг-ия ОТКАЗАНО',
        content:
        '[SIZE=4][FONT=Courier New][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
        "[CENTER]Внимательно ознакомившись с вашей неофициальной рп организацией, было принято решение дать вашей организацие статут отказано.[/CENTER]<br><br>" +
        '[CENTER][ICODE]Одобрено, закрыто.[/ICODE][/CENTER][/FONT][/SIZE]<br>',
      prefix: ACCEPT_PREFIX,
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
