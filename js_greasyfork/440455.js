// ==UserScript==
// @name Маленьким мальчикам
// @namespace https://forum.blackrussia.online
// @version 1.4.8
// @description Кураторы
// @author Danila Fererra + Samuel_Maps
// @match https://forum.blackrussia.online/index.php?threads/*
// @include https://forum.blackrussia.online/index.php?threads/
// @grant none
// @license MIT
// @collaborator 
// @icon https://icons.iconarchive.com/icons/thesquid.ink/free-flat-sample/128/support-icon.png
// @downloadURL https://update.greasyfork.org/scripts/440455/%D0%9C%D0%B0%D0%BB%D0%B5%D0%BD%D1%8C%D0%BA%D0%B8%D0%BC%20%D0%BC%D0%B0%D0%BB%D1%8C%D1%87%D0%B8%D0%BA%D0%B0%D0%BC.user.js
// @updateURL https://update.greasyfork.org/scripts/440455/%D0%9C%D0%B0%D0%BB%D0%B5%D0%BD%D1%8C%D0%BA%D0%B8%D0%BC%20%D0%BC%D0%B0%D0%BB%D1%8C%D1%87%D0%B8%D0%BA%D0%B0%D0%BC.meta.js
// ==/UserScript==
 
(function () {
'use strict';
const UNACCEPT_PREFIX = 4; // префикс отказано
const ACCEPT_PREFIX = 8; // префикс одобрено
const PIN_PREFIX = 2; //  префикс закрепить	
const TECHADM_PREFIX = 13 // техническому специалисту
const buttons = [
{
title: 'Приветствие',
content:
	'[SIZE=4][FONT=Courier New][CENTER]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br><br>' + 
	'[CENTER]  [/CENTER][/FONT][/SIZE]',
},
{
	title: 'Рассмотрение',
  content:
	'[SIZE=4][FONT=courier new][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
	"[CENTER]Ваша жалоба находиться в стадии рассмотрении, ожидайте ответа в данной теме, создавать подобные темы не нужно.[/CENTER]<br><br>" +
	'[CENTER][ICODE]Ожидайте ответа.[/ICODE][/CENTER][/FONT][/SIZE]',
  prefix: PIN_PREFIX,
  status: true,
},
{
	  title: 'Форма подачи жалобы',
	  content:
		'[SIZE=4][FONT=Courier New][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
		"[CENTER]Пожалуйста, убедительная просьба, ознакомится с формой подачи жалобы на игроков:[URL=https://forum.blackrussia.online/index.php?threads/Правила-подачи-жалобы-на-игрока-если-не-по-форме-—-отказ.193402/]*ТЫК*[/URL][/CENTER]<br><br>" +
		'[CENTER][ICODE]Отказано, закрыто.[/ICODE][/CENTER][/FONT][/SIZE]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
},
{
      title: 'Некоректное название',
	  content:
		'[SIZE=4][FONT=courier new][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
		"[CENTER]Название жалобы составлено не по форме. Внимательно прочитайте правила составления жалобы:[URL=https://forum.blackrussia.online/index.php?threads/Правила-подачи-жалобы-на-игрока-если-не-по-форме-—-отказ.193402/]*ТЫК*[/URL][/CENTER]<br>" +
        "[CENTER] В названии темы необходимо написать: “Nick_Name | Суть жалобы“[/CENTER]<br><br>" +
		'[CENTER][ICODE]Отказано, закрыто.[/ICODE][/CENTER][/FONT][/SIZE]',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
},
{
	title: 'Жалоба от 3-го лица',
	content:
	  '[SIZE=4][FONT=Courier New][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
	  "[CENTER]Жалоба составлена от третьего лица, данная жалоба не будет рассмотена. [/CENTER]<br><br>" +
	  '[CENTER][ICODE]Отказано, закрыто.[/ICODE][/CENTER][/FONT][/SIZE]',
	prefix: UNACCEPT_PREFIX,
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
	  title: 'Дублирование темы',
	  content:
		'[SIZE=4][FONT=Courier New][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
		"[CENTER]Дублирование темы. Напоминаем, при 3 дублированиях – форумный аккаунт будет заблокирован.<br><br>" +
		'[CENTER][ICODE]Отказано, закрыто.[/ICODE][/CENTER][/FONT][/SIZE]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
},
{
	title: 'Идите в технический раздел',
	content: '[SIZE=4][FONT=Courier New][CENTER]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br><br>' +
	 "[CENTER]Обратитесь в технический раздел, сервера Lime - [URL='https://forum.blackrussia.online/index.php?forums/Технический-раздел-lime.365/']клик[/URL] [/CENTER]<br><br>" +
	 '[CENTER]Закрыто.[/CENTER][/FONT]',
	prefix: UNACCEPT_PREFIX,
	status: false,
},
{
	title: 'Идите в жалобы на техов',
	content:  '[SIZE=4][FONT=Courier New][CENTER]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br><br>' +
		  "[CENTER]Если вы считаете что наказание было выдано неверно обратитесь в раздел жалобы на технических специалистов - [URL='https://forum.blackrussia.online/index.php?forums/Жалобы-на-технических-специалистов.490/']клик[/URL]<br><br>" +
		  '[CENTER]Закрыто.[/CENTER][/FONT]',
	prefix: UNACCEPT_PREFIX,
	status: false,
},
{
	title: 'Идите в жалобы на сотрудников',
	content: '[SIZE=4][FONT=Courier New][CENTER]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br><br>' +
	 "[CENTER]Пишите жалобу на сотрудников. [/CENTER]<br><br>" +
	 '[CENTER]Закрыто.[/CENTER][/FONT]',
	prefix: UNACCEPT_PREFIX,
	status: false,
},
{
	title: 'Идите в админ раздел',
	content: '[SIZE=4][FONT=Courier New][CENTER]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br><br>' +
	 "[CENTER]Обратитесь в раздел жалобы на администраторов, сервера Lime - [URL='https://forum.blackrussia.online/index.php?forums/Жалобы-на-администрацию.350/']клик[/URL] [/CENTER]<br><br>" +
	 '[CENTER]Закрыто.[/CENTER][/FONT]',
	prefix: UNACCEPT_PREFIX,
	status: false,
},
{
	title: 'Идите в жалобы на лидеров',
	content: '[SIZE=4][FONT=Courier New][CENTER]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br><br>' +
	 "[CENTER]Обратитесь в раздел жалобы на лидеров, сервера Lime - [URL='https://forum.blackrussia.online/index.php?forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%BB%D0%B8%D0%B4%D0%B5%D1%80%D0%BE%D0%B2.351/']клик[/URL] [/CENTER]<br><br>" +
	 '[CENTER]Закрыто.[/CENTER][/FONT]',
	prefix: UNACCEPT_PREFIX,
	status: false,
},
{
	title: 'Идите в раздел обжалования',
	content: '[SIZE=4][FONT=Courier New][CENTER]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br><br>' +
	 "[CENTER]Обратитесь в раздел Обжалование наказаний, сервера Lime - [URL='https://forum.blackrussia.online/index.php?forums/%D0%9E%D0%B1%D0%B6%D0%B0%D0%BB%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D0%B5-%D0%BD%D0%B0%D0%BA%D0%B0%D0%B7%D0%B0%D0%BD%D0%B8%D0%B9.353/']клик[/URL] [/CENTER]<br><br>" +
	 '[CENTER]Закрыто.[/CENTER][/FONT]',
	prefix: UNACCEPT_PREFIX,
	status: false,
},
{
	  title: 'Нету условия',
	  content:
        '[SIZE=4][FONT=Courier New][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
        "[CENTER]В вашей жалобе нету условия Продажи/Обмена. [/CENTER]<br><br>" +
        '[CENTER][ICODE]Отказано, закрыто.[/ICODE][/CENTER][/FONT][/SIZE]',
    prefix: UNACCEPT_PREFIX,
	status: false,
},
{
	  title: 'Нет доказательств',
	  content:
        '[SIZE=4][FONT=Courier New][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
        "[CENTER]В вашей жалобе нет доказательств, загрузите их на фото/видеохостинг Imgur/Yapix/Youtube и прикрепите их в новой теме. [/CENTER]<br><br>" +
        '[CENTER][ICODE]Отказано, закрыто.[/ICODE][/CENTER][/FONT][/SIZE]',
    prefix: UNACCEPT_PREFIX,
	status: false,
},
{
	title: 'Нету нарушений',
	content:
	  '[SIZE=4][FONT=Courier New][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
	  "[CENTER] В вашей жалобе нету конкретных нарушений. [/CENTER]<br><br>" +
	  '[CENTER][ICODE]Отказано, закрыто.[/ICODE][/CENTER][/FONT][/SIZE]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
},
{
	title: 'Нету Тайм-Кодов',
	content:
	  '[SIZE=4][FONT=Courier New][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
	  "[CENTER] В вашей жалобе нету Тайм-кодов. [/CENTER]<br><br>" +
	  '[CENTER][ICODE]Отказано, закрыто.[/ICODE][/CENTER][/FONT][/SIZE]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
},
{
	  title: 'Не хватает /time',
	  content:
		'[SIZE=4][FONT=Courier New][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
		"[CENTER]Статус жалобы - отказ. [/CENTER]<br><br>" +
		"[CENTER]На скриншоте отсутствует /time.<br><br>" +
		'[CENTER][ICODE]Отказано, закрыто.[/ICODE][/CENTER][/FONT][/SIZE]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
},
{
	title: 'Нужен фрапс 3.4',
	content:
		'[SIZE=4][FONT=Courier New][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
		"[CENTER] Вам отказано в жалобе по причине пункта правил подачи 3.4[/CENTER]<br>" +
		"[CENTER] 3.4. Жалобы, в которых требуются доказательства не только скриншотом, но и видео, должны содержать его.[/CENTER]<br>" +
		"[CENTER]Пример: nRP обман, DB, ответный DM и так далее.[/CENTER]<br>" +
		'[CENTER][ICODE]Отказано, закрыто.[/ICODE][/CENTER][/FONT][/SIZE]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
},											
{
	  title: 'Мало доказательств',
	  content:
        '[SIZE=4][FONT=Courier New][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
        "[CENTER]В вашей жалобе недостаточно доказательсты для выдачи наказания. [/CENTER]<br><br>" +
        '[CENTER][ICODE]Отказано, закрыто.[/ICODE][/CENTER][/FONT][/SIZE]',
               prefix: UNACCEPT_PREFIX,
	  status: false,
},
{
    title: 'Оффтоп',
	content:
        '[SIZE=4][FONT=Courier New][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
		"[CENTER] Ваша жалоба не несет смысловой нагрузки и является оффтопом в данном разделе, поэтому рассмотрена не будет. [/CENTER]<br><br>"+
		'[CENTER][ICODE] Отказано, закрыто.[/ICODE][/CENTER][/FONT][/SIZE]',
		prefix: UNACCEPT_PREFIX,
		status: false,
},
{
	title: 'Уход от РП[2.02]',
	content:
	  '[SIZE=4][FONT=Courier New][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
	  "[CENTER]Игрок получит наказание по пункту 2.02 [/CENTER]<br><br>" +
	  "[CENTER]Запрещено целенаправленно уходить от Role Play процесса всеразличными способами | Jail 30 минут / Warn.[/CENTER]<br><br>" +
	  '[CENTER][ICODE]Одобрено, закрыто.[/ICODE][/CENTER][/FONT][/SIZE]',
	prefix: ACCEPT_PREFIX,
	status: false,
},
{
	title: 'ЕПП[2.03]',
	content:
	  '[SIZE=4][FONT=Courier New][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
	  "[CENTER]Данный игрок будет наказан по пункту 2.03.[/CENTER]<br><br>" +
	  "[CENTER]Запрещен NonRP Drive — вождение любого транспортного средства в невозможных для него условиях, а также вождение в неправдоподобной манере | Jail 30 минут [/CENTER]<br><br>" +
	  "[CENTER] Примечание: езда на скутере по горам, езда на любом транспортном средстве по встречным полосам, нарушая все правила дорожного движения без какой-либо причины, намеренное создание аварийных ситуаций на дорогах и так далее.[/CENTER]<br><br>" +
	  '[CENTER][ICODE]Одобрено, закрыто.[/ICODE][/CENTER][/FONT][/SIZE]',
	prefix: ACCEPT_PREFIX,
	status: false,
},
{
	title: 'NonRP Развод[2.05]',
	content:
	  '[SIZE=4][FONT=Courier New][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
	  "[CENTER]Игрок получит наказание по пункту 2.05. [/CENTER]<br><br>" +
	  "[CENTER]2.05. Запрещены любые OOC обманы, а также любые IC обманы с нарушением Role Play правил и логики | PermBan [/CENTER]<br><br>" +
	  "[CENTER] Примечание: после IC договоренности получить денежные средства и сразу же выйти из игры с целью обмана игрока, или же договорившись через OOC чат (/n) точно также [/CENTER]<br><br>" +
	  "[CENTER] получить денежные средства и сразу же выйти из игры, а также тому подобные ситуации. [/CENTER]<br><br>" +
	  "[CENTER] Примечание: разблокировка игрового аккаунта нарушителя будет возможна только в случае возврата полной суммы причиненного ущерба, либо непосредственно самого [/CENTER]<br><br>" +
	  "[CENTER]имущества, которое было украденого (по решению обманутой стороны). [/CENTER]<br>" +
	  '[CENTER][ICODE]Одобрено, закрыто.[/ICODE][/CENTER][/FONT][/SIZE]',
	prefix: ACCEPT_PREFIX,
	status: false,
},
{
	title: 'Слив склада[2.09]',
	content:
	  '[SIZE=4][FONT=Courier New][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
	  "[CENTER]Данный игрок будет наказан по пункту 2.09 [/CENTER]<br><br>" +
	  "[CENTER]Запрещено сливать склад фракции / семьи путем взятия большого количестве ресурсов, или же брать больше, чем разрешили на самом деле | Ban 15 - 30 дней / PermBan[/CENTER]<br><br>" +
	  '[CENTER][ICODE]Одобрено, закрыто.[/ICODE][/CENTER][/FONT][/SIZE]',
	prefix: ACCEPT_PREFIX,
	status: false,
},
{
	title: 'DB[2.13]',
	content:
	  '[SIZE=4][FONT=Courier New][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
	  "[CENTER]Данный игрок будет наказан по пункту 2.13 [/CENTER]<br><br>" +
	  "[CENTER]Запрещен DB (DriveBy) — намеренное убийство / нанесение урона без веской IC причины на любом виде транспорта | Jail 30 минут [/CENTER]<br><br>" +
	  '[CENTER][ICODE]Одобрено, закрыто.[/ICODE][/CENTER][/FONT][/SIZE]',
			 prefix: ACCEPT_PREFIX,
	status: false,
},
{
	title: 'TK[2.15]',
	content:
	  '[SIZE=4][FONT=Courier New][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
	  "[CENTER]Данный игрок получит наказание по пункту 2.15 [/CENTER]<br><br>" +
	  "[CENTER]Запрещен TK (Team Kill) — убийство члена своей или союзной фракции, организации без наличия какой-либо IC причины | Jail 30 минут / Warn (за два и более убийства) [/CENTER]<br><br>" +
	  '[CENTER][ICODE]Одобрено, закрыто.[/ICODE][/CENTER][/FONT][/SIZE]',
	prefix: ACCEPT_PREFIX,
	status: false,
},
{
	title: 'МГ[2.18]',
	content:
	  '[SIZE=4][FONT=Courier New][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
	  "[CENTER]Данный игрок будет наказан по пункту 2.18 [/CENTER]<br><br>" +
	  "[CENTER]Запрещен MG (MetaGaming) — использование ООС информации, которую Ваш персонаж никак не мог получить в IC процессе | Mute 30 минут [/CENTER]<br><br>" +
	  '[CENTER][ICODE]Одобрено, закрыто.[/ICODE][/CENTER][/FONT][/SIZE]',
	prefix: ACCEPT_PREFIX,
	status: false,
},
{
	  title: 'ДМ[2.19]',
	  content:
		`[SIZE=4][FONT=Courier New][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>[CENTER]2.19. Запрещен DM (DeathMatch) — убийство или нанесение урона без веской IC причины | Jail 60 минут. [/CENTER]<br><br>[CENTER]Примечание: разрешен ответный DM в целях защиты, обязательно иметь видео доказательство в случае наказания администрации, нанесение урона по транспорту также является нарушением данного пункта правил.[/CENTER]<br><br>[Center] Примечание: нанесение урона с целью защиты особняка или его территории, а также нанесение урона после ДТП не является веской IC причиной, для войны семей предусмотрено отдельное системное мероприятие.[/Center]<br>[CENTER][ICODE]Одобрено, закрыто.[/ICODE][/CENTER][/FONT][/SIZE]`,
    prefix: ACCEPT_PREFIX,
	status: false,
},
{
	  title: 'Исп. Багов[2.21]',
	  content:
        '[SIZE=4][FONT=Courier New][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
        "[CENTER]Данный игрок будет наказан по пункту 2.21 [/CENTER]<br><br>" +
        "[CENTER]Запрещено пытаться обходить игровую систему или использовать любые баги сервера | Ban 15 - 30 дней / PermBan [/CENTER]<br><br>" +
        '[CENTER][ICODE]Одобрено, закрыто.[/ICODE][/CENTER][/FONT][/SIZE]',
      prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	title: 'Оскорбление Администрации[2.32]',
	content:
	  '[SIZE=4][FONT=Courier New][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
	  "[CENTER]Данный игрок будет наказан по пункту 2.32 [/CENTER]<br><br>" +
	  "[CENTER]Запрещен обман администрации, ее оскорбление, неуважительное отношение, неконструктивная критика, унижение чести и достоинства и так далее | Ban 15 - 30 дней / PermBan [/CENTER]<br><br>" +
	  '[CENTER][ICODE]Одобрено, закрыто.[/ICODE][/CENTER][/FONT][/SIZE]',
	prefix: ACCEPT_PREFIX,
	status: false,
},
{
	title: 'Перенос кофликта[2.36]',
	content:
		'[SIZE=4][FONT=Courier New][CENTER]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br><br>' + 
		'[CENTER] 2.36. Запрещено переносить конфликты из IC в OOC, и наоборот | Warn / Ban 15 - 30 дней<br> Примечание: все межфракционные конфликты решаются главными следящими администраторами [/CENTER][/FONT][/SIZE]',
	prefix: ACCEPT_PREFIX,
	status: false,
	},
{
	title: 'ООС угрозы[2.37]',
	content:
		'[SIZE=4][FONT=Courier New][CENTER]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br><br>' + 
		'[CENTER] Игрок будет наказан по пункту правил 2.37<br> Запрещены OOC угрозы, в том числе и завуалированные | Ban 15 - 30 дней / PermBan<br>Одобрено, закрыто. [/CENTER][/FONT][/SIZE]',
	},
{
	title: 'Оск проекта[2.40]',
	content:
	  '[SIZE=4][FONT=Courier New][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
	  "[CENTER]Данный игрок будет наказан по пункту 2.40 [/CENTER]<br><br>" +
	  "[CENTER]Запрещено пытаться навредить репутации проекта | PermBan + ЧС проекта [/CENTER]<br><br>" +
	  '[CENTER][ICODE]Одобрено, закрыто.[/ICODE][/CENTER][/FONT][/SIZE]',
	prefix: ACCEPT_PREFIX,
	status: false,
},
{
	title: 'MASS DM[2.20]',
	content:
	  '[SIZE=4][FONT=Courier New][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
	  "[CENTER]Данный игрок будет наказан по пункту 2.20 [/CENTER]<br><br>" +
	  "[CENTER]Запрещен Mass DM (Mass DeathMatch) — убийство или нанесение урона без веской IC причины более трем игрокам | Warn / Ban 7 - 15 дней [/CENTER]<br><br>" +
	  '[CENTER][ICODE]Одобрено, закрыто.[/ICODE][/CENTER][/FONT][/SIZE]',
	  prefix: ACCEPT_PREFIX,
	status: false,
},
{
	title: 'Реклама, Пиар[2.31]',
	content:
	  '[SIZE=4][FONT=Courier New][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
	  "[CENTER]Данный игрок будет наказан по пункту 2.31 [/CENTER]<br><br>" +
	  "[CENTER]Запрещено рекламировать на сервере любые проекты, сервера, сайты, сторонние Discord-сервера, YouTube каналы и так далее | PermBan [/CENTER]<br><br>" +
	  '[CENTER][ICODE]Одобрено, закрыто.[/ICODE][/CENTER][/FONT][/SIZE]',
			prefix: ACCEPT_PREFIX,
	status: false,
},
{
	title: 'Caps[3.02]',
	content:
	  '[SIZE=4][FONT=Courier New][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
	  "[CENTER]Данный игрок будет наказан по пункту 3.02 [/CENTER]<br><br>" +
	  "[CENTER]Запрещено использование верхнего регистра (CapsLock) при написании любого текста в чате | Mute 30 минут [/CENTER]<br><br>" +
	  '[CENTER][ICODE]Одобрено, закрыто.[/ICODE][/CENTER][/FONT][/SIZE]',
			prefix: ACCEPT_PREFIX,
	status: false,
},
{
	title: 'Оск игроков[3.03]',
	content:
	  '[SIZE=4][FONT=Courier New][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
	  "[CENTER]Данный игрок будет наказан по пункту 3.03 [/CENTER]<br><br>" +
	  "[CENTER]3.03. Любые формы оскорблений, издевательств, расизма, дискриминации, религиозной враждебности, сексизма в OOC чате запрещены | Mute 30 минут. [/CENTER]<br><br>" +
	  '[CENTER][ICODE]Одобрено, закрыто.[/ICODE][/CENTER][/FONT][/SIZE]',
			prefix: ACCEPT_PREFIX,
	status: false,
},
{
	  title: 'Упоминание Родных[3.04]',
	  content:
		'[SIZE=4][FONT=Courier New][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
		"[CENTER]Игрок получит наказание по пункту 3.04. [/CENTER]<br><br>" +
        "[CENTER]3.04. Запрещено оскорбление или косвенное упоминание кровных родных вне зависимости от чата (IC или OOC)| Mute 120 минут / Ban 7 - 15 дней. [/CENTER]<br><br>" +
		'[CENTER][ICODE]Одобрено, закрыто.[/ICODE][/CENTER][/FONT][/SIZE]',
      prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	title: 'FLOOD[3.05]',
	content:
	  '[SIZE=4][FONT=Courier New][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
	  "[CENTER]Данный игрок будет наказан по пункту 3.05 [/CENTER]<br><br>" +
	  "[CENTER]Запрещен флуд — 3 и более повторяющихся сообщений от одного и того же игрока | Mute 30 минут [/CENTER]<br><br>" +
	  '[CENTER][ICODE]Одобрено, закрыто.[/ICODE][/CENTER][/FONT][/SIZE]',
	prefix: ACCEPT_PREFIX,
	status: false,
},
{
	title: 'Слив[3.08]',
	content:
	  '[SIZE=4][FONT=Courier New][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
	  "[CENTER]Данный игрок будет наказан по пункту 3.08 [/CENTER]<br><br>" +
	  "[CENTER]Запрещены любые формы «слива» посредством использования глобальных чатов | PermBan [/CENTER]<br><br>" +
	  '[CENTER][ICODE]Одобрено, закрыто.[/ICODE][/CENTER][/FONT][/SIZE]',
			 prefix: ACCEPT_PREFIX,
	status: false,
},
{
	title: 'Огроза выдачи нак.[3.09]',
	content:
		'[SIZE=4][FONT=Courier New][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
	  "[CENTER]Данный игрок будет наказан по пункту 3.09 [/CENTER]<br><br>" +
	  "[CENTER]3.09. Запрещены любые угрозы о наказании игрока со стороны администрации | Mute 30 минут [/CENTER]<br><br>" +
	  '[CENTER][ICODE]Одобрено, закрыто.[/ICODE][/CENTER][/FONT][/SIZE]',
		prefix: ACCEPT_PREFIX,
status: false,		
	},
{
	title: 'Выдача себя за Администратора[3.10]',
	content:
	  '[SIZE=4][FONT=Courier New][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
	  "[CENTER]Данный игрок будет наказан по пункту 3.10 [/CENTER]<br><br>" +
	  "[CENTER]Запрещена выдача себя за администратора, если таковым не являетесь | Ban 15 - 30 + ЧС администрации [/CENTER]<br><br>" +
	  '[CENTER][ICODE]Одобрено, закрыто.[/ICODE][/CENTER][/FONT][/SIZE]',
	prefix: ACCEPT_PREFIX,
	status: false,
},
{
	title: 'Реклама промокода[3.21]',
	content:
	'[SIZE=4] [FONT=Courier New] [CENTER] {{ greeting }}, уважаемый {{ user.mention}} [/CENTER]<br><br>' +
	"[CENTER]Данный игрок будет наказан по пункту 3.21 [/CENTER]<br><br>" +
	"[CENTER]3.21. Запрещается реклама промокодов в игре, а также их упоминание в любом виде во всех чатах. | Ban 30 дней <br>" +
	"[CENTER]Примечание: чаты семейные, строительных компаний, транспортных компаний, фракционные чаты, IC, OOC, VIP и так далее. [/CENTER]<br><br>" +
	'[CENTER][ICODE]Одобрено, закрыто.[/ICODE][/CENTER][/FONT][/SIZE]',
 prefix: ACCEPT_PREFIX,
 status: false,
},
{
      title: 'NonRP Cop (отыгровки)',
	  content:
		'[SIZE=4][FONT=Courier New][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
        "[CENTER]Игрок будет наказан по пункту 6.03 [/CENTER]<br><br>" +
		"[CENTER]Запрещено оказывать задержание без Role Play отыгровки | Warn [/CENTER]<br><br>" +
		'[CENTER][ICODE]Одобрено, закрыто.[/ICODE][/CENTER][/FONT][/SIZE]',
      prefix: ACCEPT_PREFIX,
	  status: false,
},
{
      title: 'Рп био одобрено',
	  content:
		'[SIZE=4][FONT=Courier New][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
		"[CENTER]Внимательно ознакомившись с вашей рп биографией, было принято решение дать вашей биографии статут одобрено.[/CENTER]<br><br>" +
		'[CENTER][ICODE]Одобрено, закрыто.[/ICODE][/CENTER][/FONT][/SIZE]',
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
        "[CENTER]Причина: Название рп биографии не по форме. Внимательно прочитайте правила составления жалобы:[URL=https://forum.blackrussia.online/index.php?threads/Правила-создания-и-форма-roleplay-биографии-lime.111129/]*ТЫК*[/URL][/CENTER]<br>" +
        "[CENTER]Заголовок создаваемой темы должен быть написан строго по данной форме: “RolePlay биография гражданина Имя Фамилия.“[/CENTER]<br><br>" +
		'[CENTER][ICODE]Отказано, закрыто.[/ICODE][/CENTER][/FONT][/SIZE]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
},
{
        title: 'Рп био на расмотрении',
	  content:
		'[SIZE=4][FONT=Courier New][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
		"[CENTER]Внимательно ознакомившись с вашей рп биографией, было принято решение что бы вы доаполнили пункт .[/CENTER]<br><br>" +
		'[CENTER][ICODE]Отказано, закрыто.[/ICODE][/CENTER][/FONT][/SIZE]',
      prefix: PIN_PREFIX,
	  status: false,
},
{
        title: 'РП сит на рассмт',
	  content:
		'[SIZE=4][FONT=Courier New][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
		"[CENTER]Внимательно ознакомившись с вашей рп ситуацией, было принято решение что бы вы дополнили пункт .[/CENTER]<br><br>" +
		'[CENTER][ICODE]Отказано, закрыто.[/ICODE][/CENTER][/FONT][/SIZE]',
      prefix: PIN_PREFIX,
	  status: false,
},
{
        title: 'Рп сит +',
	  content:
		'[SIZE=4][FONT=Courier New][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
		"[CENTER]Внимательно ознакомившись с вашей рп ситуацией, дать вашей ситуации статут одобрено.[/CENTER]<br><br>" +
		'[CENTER][ICODE]Одобрено, закрыто.[/ICODE][/CENTER][/FONT][/SIZE]',
      prefix: ACCEPT_PREFIX,
	  status: false,
},
{
      title: 'Рп Сит -',
	  content:
		'[SIZE=4][FONT=Courier New][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
		"[CENTER]Внимательно ознакомившись с вашей рп ситуацией, было принято решение дать вашей ситуации статут отказано.[/CENTER]<br><br>" +
		'[CENTER][ICODE]Отказано, закрыто.[/ICODE][/CENTER][/FONT][/SIZE]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
},
];
 
$(document).ready(() => {
// Загрузка скрипта для обработки шаблонов
$('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');
 
// Добавление кнопок при загрузке страницы
addButton('Отказано', 'unaccept');
addButton('Одобрено', 'accepted');
addButton('На рассмотрение', 'pin');
addButton('Техническому спецалисту', 'techspec');
addButton('Ответы', 'selectAnswer');
 
// Поиск информации о теме
const threadData = getThreadData();
 
$('button#unaccept').click(() => editThreadData(UNACCEPT_PREFIX, false));
$('button#accepted').click(() => editThreadData(ACCEPT_PREFIX, false));
$('button#pin').click(() => editThreadData(PIN_PREFIX, true));
$('button#techspec').click(() => editThreadData(TECHADM_PREFIX, true));
 
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