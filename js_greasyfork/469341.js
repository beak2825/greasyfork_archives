// ==UserScript==
// @name         Личный скрипт by Kuzy
// @namespace    http://tampermonkey.net/
// @version      6.8
// @description  По вопросам в ВК - https://vk.com/lukas_kuzy0, туда же и по предложениям на улучшение скрипта)
// @author       Lukas_Kuzy
// @match        https://forum.blackrussia.online/index.php?threads/*
// @grant        none
// @license 	 MIT
// @icon https://forum.blackrussia.online/data/avatars/o/11/11193.jpg
// @downloadURL https://update.greasyfork.org/scripts/469341/%D0%9B%D0%B8%D1%87%D0%BD%D1%8B%D0%B9%20%D1%81%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20by%20Kuzy.user.js
// @updateURL https://update.greasyfork.org/scripts/469341/%D0%9B%D0%B8%D1%87%D0%BD%D1%8B%D0%B9%20%D1%81%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20by%20Kuzy.meta.js
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
        '[CENTER][I][SIZE=4][FONT=arial][Color=#DC143C]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/I][/FONT][/SIZE]<br><br>' +
        "[CENTER][I][FONT=courier new][SIZE=5][COLOR=rgb(0, 255, 255)] *ТЕКСТ* [/COLOR][/SIZE][/FONT][/I][/CENTER]<br>" +
		'[CENTER][I][SIZE=4][FONT=arial][Color=#DC143C]Закрыто.[/COLOR][/I][/FONT][/SIZE]',
    },
      {
      title: 'ГМ',
      content:
		'[Color=#00FF00][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][Color=#98FB98][FONT=courier new]Нарушения, связанные с GodMod, в данный период времени НЕ наказуемы. <br>[/color][/FONT][/CENTER] <br>" +
		'[Color=Red][CENTER]Закрыто.[/CENTER][/color]' + '[CENTER]  [/CENTER]',
    },
    {
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴Поооооооооооооооооооон ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
      title: 'На рассмотрении',
      content:
        '[CENTER][I][SIZE=4][FONT=arial][COLOR=rgb(255, 140, 0)]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/I][/FONT][/SIZE]<br><br>' +
        "[SIZE=4][I][Color=#FFFF00][FONT=courier new]Ваша жалоба взята на рассмотрение.[/FONT][/COLOR][/SIZE][/I]<br>" +
        "[SIZE=4][I][Color=#00FF7F][FONT=courier new]Не нужно создавать копии этой жалобы, ожидайте ответа в этой теме.[/COLOR][/I][/FONT][/SIZE][/CENTER] <br><br>" +
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zByWk0xc/giphy-3.gif[/img][/url][/CENTER]',
        prefix: PIN_PREFIX,
      status: true,
    },
    {
      title: 'Заявки закрыты',
      content:
        '[CENTER][I][SIZE=4][FONT=arial][COLOR=rgb(255, 140, 0)]{{ greeting }}, уважаемые игроки.[/COLOR][/I][/FONT][/SIZE]<br><br>' +
        '[CENTER][Color=#00FFFF][FONT=courier new]Заявления на пост агента поддержки временно закрыты. [/COLOR][/FONT][/CENTER]',
        prefix: CLOSE_PREFIX,
      status: true,
    },
    {
      title: 'Заявки открыты',
      content:
        '[CENTER][I][SIZE=4][FONT=arial][COLOR=rgb(255, 140, 0)]{{ greeting }}, уважаемые игроки.[/COLOR][/I][/FONT][/SIZE]<br><br>' +
        '[CENTER][Color=#00FFFF][FONT=courier new]Заявления на пост агента поддержки вновь открыты.[/COLOR][/FONT][/CENTER]',
        prefix: PIN_PREFIX,
      status: 123,
    },
    {
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴передам ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
      title: 'для згкф/гкф',
      content:
		'[Color=#FFA500][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/FONT][/CENTER]<br>' +
        "[CENTER][Color=#00FFFF][FONT=courier new]Ваша жалоба была передана на рассмотрение  [COLOR=#00FF00]Заместителю Главного Куратора форума/[/COLOR][COLOR=#1E90FF]Главному Куратору Форума.[/COLOR] [/COLOR][/FONT][/CENTER] <br>" +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/WzS9J9zf/giphy-2.gif[/img][/url][/CENTER]',
      prefix: PIN_PREFIX,
	  status: true,
    },
    {
      title: 'для куратора',
      content:
		'[Color=#FFA500][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/FONT][/CENTER]<br>' +
        "[CENTER][Color=#00FFFF][FONT=courier new]Ваша жалоба была передана на рассмотрение [Color=#9365B8]Куратору Администрации.[/COLOR] [/COLOR][/FONT][/CENTER] <br>" +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/WzS9J9zf/giphy-2.gif[/img][/url][/CENTER]',
      prefix: PIN_PREFIX,
	  status: true,
    },
    {
      title: 'для зга',
      content:
		'[Color=#FFA500][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/FONT][/CENTER]<br>' +
        "[CENTER][Color=#00FFFF][FONT=courier new]Ваша жалоба была передана на рассмотрение [Color=#FFFF00]Заместителю Главного Администратора.[/COLOR] [/COLOR][/FONT][/CENTER] <br>" +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/WzS9J9zf/giphy-2.gif[/img][/url][/CENTER]',
      prefix: PIN_PREFIX,
	  status: true,
    },
    {
      title: 'для теха',
      content:
		'[Color=#FFA500][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/FONT][/CENTER]<br>' +
        "[CENTER][Color=#00FFFF][FONT=courier new]Ваша жалоба была передана на рассмотрение [Color=#FF4500]техническому специалисту.[/COLOR] [/COLOR][/FONT][/CENTER] <br>" +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/WzS9J9zf/giphy-2.gif[/img][/url][/CENTER]',
      prefix: TEX_PREFIX,
	  status: true,
    },
    {
      title: 'для га',
      content:
		'[Color=#FFA500][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/FONT][/CENTER]<br>' +
        "[CENTER][Color=#00FFFF][FONT=courier new]Ваша жалоба была передана на рассмотрение [Color=#DC143C]Главному Администратору.[/COLOR] [/COLOR][/FONT][/CENTER] <br>" +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/WzS9J9zf/giphy-2.gif[/img][/url][/CENTER]',
      prefix: GA_PREFIX,
	  status: true,
    },
    {
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴Правила рп процесса ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
      title: 'нрп поведение',
      content:
		'[Color=#00FF00][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/FONT][/CENTER]<br>' +
        "[CENTER][Color=#FFFF00][FONT=courier new]Игрок будет наказан по пункту правил:<br>[Color=#FF0000]2.01. [Color=#00FF7F]Запрещено поведение, нарушающее нормы процессов Role Play режима игры [Color=#FF0000]| Jail 30 минут[/color] <br> [Color=#FF0000][SPOILER=Примечание]ездить на крышах транспортных средств, бегать или ходить по столам в казино, целенаправленная провокация сотрудников правоохранительных органов с целью развлечения, целенаправленная помеха в проведении различных собеседований и так далее.[/SPOILER][/color] [/COLOR][/FONT][/CENTER] <br>" +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/XJ5Yp4yv/giphy.gif[/img][/url][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'уход от рп',
      content:
		'[Color=#00FF00][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][Color=#FFFF00][FONT=courier new]Игрок будет наказан по пункту правил:<br>[Color=#FF0000]2.02. [Color=#00FF7F]Запрещено целенаправленно уходить от Role Play процесса всеразличными способами [Color=#FF0000]| Jail 30 минут / Warn[/color] <br> [Color=#FF0000][SPOILER=Примечание]уходить в AFK при остановке транспортного средства правоохранительными органами, выходить из игры для избежания смерти, выходить из игры во время процесса задержания или ареста, полное игнорирование отыгровок другого игрока, которые так или иначе могут коснуться Вашего персонажа. Уходить в интерьер или зеленую зону во время перестрелки с целью избежать смерти или уйти от Role Play процесса и так далее.[/SPOILER][/color] [/COLOR][/FONT][/CENTER] <br>" +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/XJ5Yp4yv/giphy.gif[/img][/url][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'нрп драйв',
      content:
		'[Color=#00FF00][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][Color=#FFFF00][FONT=courier new]Игрок будет наказан по пункту правил:<br>[Color=#FF0000]2.03. [Color=#00FF7F]Запрещен NonRP Drive — вождение любого транспортного средства в невозможных для него условиях, а также вождение в неправдоподобной манере [Color=#FF0000]| Jail 30 минут[/color] <br> [Color=#FF0000][SPOILER=Примечание]езда на скутере по горам, езда на любом транспортном средстве по встречным полосам, нарушая все правила дорожного движения без какой-либо причины, намеренное создание аварийных ситуаций на дорогах и так далее.[/SPOILER][/color] [/COLOR][/FONT][/CENTER] <br>" +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/XJ5Yp4yv/giphy.gif[/img][/url][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'нрп развод',
      content:
		'[Color=#00FF00][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][Color=#FFFF00][FONT=courier new]Игрок будет наказан по пункту правил:<br>[Color=#FF0000]2.05. [Color=#00FF7F]Запрещены любые OOC обманы и их попытки, а также любые IC обманы с нарушением Role Play правил и логики [Color=#FF0000]| PermBan[/color] <br> [Color=#FF0000][SPOILER=Примечание]после IC договоренности получить денежные средства и сразу же выйти из игры с целью обмана игрока, или же, договорившись через OOC чат (/n), точно также получить денежные средства и сразу же выйти из игры и тому подобные ситуации.[/SPOILER][/color] <br> [Color=#FF0000][SPOILER=Примечание]разблокировка игрового аккаунта нарушителя будет возможна только в случае возврата полной суммы причиненного ущерба, либо непосредственно самого имущества, которое было украдено (по решению обманутой стороны).[/SPOILER][/color] [/COLOR][/FONT][/CENTER] <br>" +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/XJ5Yp4yv/giphy.gif[/img][/url][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'рп в свою сторону/пользу',
      content:
		'[Color=#00FF00][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][Color=#FFFF00][FONT=courier new]Игрок будет наказан по пункту правил:<br>[Color=#FF0000]2.06. [Color=#00FF7F]Запрещены любые Role Play отыгровки в свою сторону или пользу [Color=#FF0000]| Jail 30 минут[/color] <br> [Color=#FF0000][SPOILER=Примечание]при остановке Вашего транспортного средства правоохранительными органами у Вас очень резко и неожиданно заболевает сердце, ломаются руки, блокируются двери машины или окна и так далее.[/SPOILER][/color] [/COLOR][/FONT][/CENTER] <br>" +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/XJ5Yp4yv/giphy.gif[/img][/url][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'аморал действия',
      content:
		'[Color=#00FF00][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][Color=#FFFF00][FONT=courier new]Игрок будет наказан по пункту правил:<br>[Color=#FF0000]2.08. [Color=#00FF7F]Запрещена любая форма аморальных действий сексуального характера в сторону игроков [Color=#FF0000]| Jail 30 минут / Warn[/color] <br> [Color=#FFFF00][SPOILER=Исключение]обоюдное согласие обеих сторон.[/SPOILER][/color] [/COLOR][/FONT][/CENTER] <br>" +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/XJ5Yp4yv/giphy.gif[/img][/url][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'слив склада',
      content:
		'[Color=#00FF00][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][Color=#FFFF00][FONT=courier new]Игрок будет наказан по пункту правил:<br>[Color=#FF0000]2.09. [Color=#00FF7F]Запрещено сливать склад фракции / семьи путем взятия большого количестве ресурсов, или же брать больше, чем разрешили на самом деле [Color=#FF0000]| Ban 15 - 30 дней / PermBan[/color] [/COLOR][/FONT][/CENTER] <br>" +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/XJ5Yp4yv/giphy.gif[/img][/url][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'затягивание рп',
      content:
		'[Color=#00FF00][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][Color=#FFFF00][FONT=courier new]Игрок будет наказан по пункту правил:<br>[Color=#FF0000]2.12. [Color=#00FF7F]Запрещено целенаправленное затягивание Role Play процесса [Color=#FF0000] | Jail 30 минут[/color] <br> [Color=#FF0000][SPOILER=Примечание]/me начал доставать документы [1/100], начал доставать документы [2/100] и тому подобное.[/SPOILER][/color] [/COLOR][/FONT][/CENTER] <br>" +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/XJ5Yp4yv/giphy.gif[/img][/url][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'ДБ',
      content:
		'[Color=#00FF00][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][Color=#FFFF00][FONT=courier new]Игрок будет наказан по пункту правил:<br>[Color=#FF0000]2.13. [Color=#00FF7F]Запрещен DB (DriveBy) — намеренное убийство / нанесение урона без веской IC причины на любом виде транспорта [Color=#FF0000] | Jail 60 минут[/color] <br> [Color=#FFFF00][SPOILER=Исключение]разрешается на территории проведения мероприятия по захвату упавшего семейного контейнера.[/SPOILER][/color] [/COLOR][/FONT][/CENTER] <br>" +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/XJ5Yp4yv/giphy.gif[/img][/url][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'РК',
      content:
		'[Color=#00FF00][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][Color=#FFFF00][FONT=courier new]Игрок будет наказан по пункту правил:<br>[Color=#FF0000]2.14. [Color=#00FF7F]Запрещен RK (Revenge Kill) — убийство игрока с целью мести, возвращение на место смерти в течение 15-ти минут, а также использование в дальнейшем информации, которая привела Вас к смерти [Color=#FF0000] | Jail 30 минут[/color] [/COLOR][/FONT][/CENTER] <br>" +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/XJ5Yp4yv/giphy.gif[/img][/url][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'ТК',
      content:
		'[Color=#00FF00][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][Color=#FFFF00][FONT=courier new]Игрок будет наказан по пункту правил:<br>[Color=#FF0000]2.15. [Color=#00FF7F]Запрещен TK (Team Kill) — убийство члена своей или союзной фракции, организации без наличия какой-либо IC причины [Color=#FF0000] | Jail 60 минут / Warn (за два и более убийства)[/color] [/COLOR][/FONT][/CENTER] <br>" +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/XJ5Yp4yv/giphy.gif[/img][/url][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'СК',
      content:
		'[Color=#00FF00][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][Color=#FFFF00][FONT=courier new]Игрок будет наказан по пункту правил:<br>[Color=#FF0000]2.16. [Color=#00FF7F]Запрещен SK (Spawn Kill) — убийство или нанесение урона на титульной территории любой фракции / организации, на месте появления игрока, а также на выходе из закрытых интерьеров и около них [Color=#FF0000] | Jail 60 минут / Warn (за два и более убийства)[/color] [/COLOR][/FONT][/CENTER] <br>" +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/XJ5Yp4yv/giphy.gif[/img][/url][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'ПГ',
      content:
		'[Color=#00FF00][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][Color=#FFFF00][FONT=courier new]Игрок будет наказан по пункту правил:<br>[Color=#FF0000]2.17. [Color=#00FF7F]Запрещен PG (PowerGaming) — присвоение свойств персонажу, не соответствующих реальности, отсутствие страха за свою жизнь [Color=#FF0000] | Jail 30 минут [/color] [/COLOR][/FONT][/CENTER] <br>" +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/XJ5Yp4yv/giphy.gif[/img][/url][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'МГ',
      content:
		'[Color=#00FF00][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][Color=#FFFF00][FONT=courier new]Игрок будет наказан по пункту правил:<br>[Color=#FF0000]2.18. [Color=#00FF7F]Запрещен MG (MetaGaming) — использование ООС информации, которую Ваш персонаж никак не мог получить в IC процессе [Color=#FF0000] | Mute 30 минут [/color] <br> [Color=#FF0000][SPOILER=Примечание]использование смайлов в виде символов «))», «=D» запрещено в IC чате.[/SPOILER][/color] <br> [Color=#FF0000][SPOILER=Примечание]телефонное общение также является IC чатом.[/SPOILER][/color] <br> [Color=#FFFF00][SPOILER=Исключение]за написанный однократно вопросительный «?» или восклицательный «!» знак в IC чате, наказание не выдается.[/SPOILER][/color] [/COLOR][/FONT][/CENTER] <br>" +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/XJ5Yp4yv/giphy.gif[/img][/url][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'ДМ',
      content:
		'[Color=#00FF00][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][Color=#FFFF00][FONT=courier new]Игрок будет наказан по пункту правил:<br>[Color=#FF0000]2.19. [Color=#00FF7F]Запрещен DM (DeathMatch) — убийство или нанесение урона без веской IC причины [Color=#FF0000] | Jail 60 минут [/color] <br> [Color=#FF0000][SPOILER=Примечание]разрешен ответный DM в целях защиты, обязательно иметь видео доказательство в случае наказания администрации, нанесение урона по транспорту также является нарушением данного пункта правил.[/SPOILER][/color] <br> [Color=#FF0000][SPOILER=Примечание]нанесение урона с целью защиты особняка или его территории, а также нанесение урона после ДТП не является веской IC причиной, для войны семей предусмотрено отдельное системное мероприятие.[/SPOILER][/color] [/COLOR][/FONT][/CENTER] <br>" +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/XJ5Yp4yv/giphy.gif[/img][/url][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'масс ДМ',
      content:
		'[Color=#00FF00][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][Color=#FFFF00][FONT=courier new]Игрок будет наказан по пункту правил:<br>[Color=#FF0000]2.20. [Color=#00FF7F]Запрещен Mass DM (Mass DeathMatch) — убийство или нанесение урона без веской IC причины трем игрокам и более [Color=#FF0000] | Warn / Ban 3 - 7 дней [/color] [/COLOR][/FONT][/CENTER] <br>" +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/XJ5Yp4yv/giphy.gif[/img][/url][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'богоюз',
      content:
		'[Color=#00FF00][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][Color=#00FFFF][FONT=courier new]Игрок будет наказан по пункту правил:<br>2.21. Запрещено пытаться обходить игровую систему или использовать любые баги сервера [Color=#00FF00] | Ban 15 - 30 дней / PermBan [/color] <br> [Color=#FF0000][SPOILER=Примечание]под игровой системой подразумеваются функции и возможности, которые реализованы в игре для взаимодействия между игроками, а также взаимодействия игроков с функциями, у которых есть свое конкретное предназначение.[/SPOILER][/color] <br> [Color=#00FF00][SPOILER=Пример]аптечка предназначена для пополнения уровня здоровья, доступна всем игрокам по фиксированной цене в любом магазине. Но она не предназначена для перепродажи по завышенной цене с целью передачи виртуальной валюты между игроками; <br> Аксессуары предназначены для украшения внешнего вида персонажа, не предназначены для передачи виртуальной валюты между игроками; <br> Банк и личные счета предназначены для передачи денежных средств между игроками; <br> Транспортное средство предназначено для передвижения игроков, не предназначено для передачи денег тем или иным способом, включая обмен с завышенными доплатами.[/SPOILER][/color] [/COLOR][/FONT][/CENTER] <br>" +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/XJ5Yp4yv/giphy.gif[/img][/url][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'сторонее по',
      content:
		'[Color=#00FF00][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][Color=#00FFFF][FONT=courier new]Игрок будет наказан по пункту правил:<br>2.22. Запрещено хранить / использовать / распространять стороннее программное обеспечение или любые другие средства, позволяющие получить преимущество над другими игроками [Color=#00FF00] | Ban 15 - 30 дней / PermBan [/color] <br> [Color=#FF0000][SPOILER=Примечание]запрещено внесение любых изменений в оригинальные файлы игры.[/SPOILER][/color] <br> [Color=#FFFF00][SPOILER=Исключение]разрешено изменение шрифта, его размера и длины чата (кол-во строк).[/SPOILER][/color] <br> [Color=#FFFF00][SPOILER=Исключение]блокировка за включенный счетчик FPS не выдается.[/SPOILER][/color]  [/COLOR][/FONT][/CENTER] <br>" +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/XJ5Yp4yv/giphy.gif[/img][/url][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'реклама',
      content:
		'[Color=#00FF00][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][Color=#00FFFF][FONT=courier new]Игрок будет наказан по пункту правил:<br>2.31. Запрещено рекламировать на серверах любые проекты, серверы, сайты, сторонние Discord-серверы, YouTube каналы и тому подобное [Color=#00FF00] | Ban 7 дней / PermBan [/color] [/COLOR][/FONT][/CENTER] <br>" +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/XJ5Yp4yv/giphy.gif[/img][/url][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'уход от наказания',
      content:
		'[Color=#00FF00][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][Color=#00FFFF][FONT=courier new]Игрок будет наказан по пункту правил:<br>2.34. Запрещен уход от наказания [Color=#00FF00] | Ban 15 - 30 дней (суммируется к общему наказанию дополнительно) [/color] [Color=#FF0000][SPOILER=Примечание]зная, что в данный момент игроку может быть выдано наказание за какое-либо нарушение, изменение никнейма или передача своего имущества на другие аккаунты и тому подобное.[/SPOILER][/color] [Color=#FF0000][SPOILER=Примечание]выход игрока из игры не является уходом от наказания.[/SPOILER][/color] [/COLOR][/FONT][/CENTER] <br>" +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/XJ5Yp4yv/giphy.gif[/img][/url][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'OОC угрозы',
      content:
		'[Color=#00FF00][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][Color=#00FFFF][FONT=courier new]Игрок будет наказан по пункту правил:<br>2.37. Запрещены OOC угрозы, в том числе и завуалированные [Color=#00FF00] | Mute 120 минут / Ban 7 дней [/color] [/COLOR][/FONT][/CENTER] <br>" +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/XJ5Yp4yv/giphy.gif[/img][/url][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'злоуп наказаниями',
      content:
		'[Color=#00FF00][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][Color=#00FFFF][FONT=courier new]Игрок будет наказан по пункту правил:<br>2.39. Злоупотребление нарушениями правил сервера [Color=#00FF00] | Ban 7 - 30 дней [/color] [Color=#FF0000][SPOILER=Примечание]неоднократное (от шести и более) нарушение правил сервера, которые были совершены за прошедшие 7 дней.[/SPOILER][/color] [Color=#FF0000][SPOILER=Примечание]наказания выданные за нарушения правил текстовых чатов, помеху (kick) в учет не идут.[/SPOILER][/color] <br> [Color=#00FF00][SPOILER=Пример]было получено пять наказаний за DM, шестое будет злоупотреблением. Если было получено одно наказание за упоминание родных, два наказания за DB и два наказания за DM, следующее будет считаться злоупотреблением.[/SPOILER][/color] [/COLOR][/FONT][/CENTER] <br>" +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/XJ5Yp4yv/giphy.gif[/img][/url][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'оск проекта',
      content:
		'[Color=#00FF00][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][Color=#00FFFF][FONT=courier new]Игрок будет наказан по пункту правил:<br>2.40. Запрещены совершенно любые деструктивные действия по отношению к проекту: неконструктивная критика, призывы покинуть проект, попытки нарушить развитие проекта или любые другие действия, способные привести к помехам в игровом процессе [Color=#00FF00] | Mute 300 минут / Ban 30 дней (Ban выдается по согласованию с главным администратором) [/color] [/COLOR][/FONT][/CENTER] <br>" +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/XJ5Yp4yv/giphy.gif[/img][/url][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'продажа промо',
      content:
		'[Color=#00FF00][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][Color=#00FFFF][FONT=courier new]Игрок будет наказан по пункту правил:<br>2.43. Запрещена продажа / обмен / покупка поощрительной составляющей от лица проекта, будь то бонус-код, либо промокод, который выдается безвозмездно игрокам в целях промоакций [Color=#00FF00] |  Mute 120 минут [/color] [/COLOR][/FONT][/CENTER] <br>" +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/XJ5Yp4yv/giphy.gif[/img][/url][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'ЕПП фура',
      content:
		'[Color=#00FF00][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][Color=#00FFFF][FONT=courier new]Игрок будет наказан по пункту правил:<br>2.47. Запрещено ездить по полям на грузовом транспорте, инкассаторских машинах (работа дальнобойщика, инкассатора) [Color=#00FF00] |  Jail 60 минут [/color] [/COLOR][/FONT][/CENTER] <br>" +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/XJ5Yp4yv/giphy.gif[/img][/url][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'арест в инте',
      content:
		'[Color=#00FF00][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][Color=#00FFFF][FONT=courier new]Игрок будет наказан по пункту правил:<br>2.50. Запрещены задержания, аресты, а также любые действия со стороны игроков, состоящих во фракциях в интерьере аукциона, казино, а также во время системных мероприятий [Color=#00FF00] |  Ban 7 - 15 дней + увольнение из организации [/color] [/COLOR][/FONT][/CENTER] <br>" +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/XJ5Yp4yv/giphy.gif[/img][/url][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'нрп аксесуар',
      content:
		'[Color=#00FF00][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][Color=#00FFFF][FONT=courier new]Игрок будет наказан по пункту правил:<br>2.52. Запрещено располагать аксессуары на теле персонажа, нарушая нормы морали и этики, увеличивать аксессуары до слишком большого размера. [Color=#00FF00] | При первом нарушении - обнуление аксессуаров, при повторном нарушении - обнуление аксессуаров + JAIL 30 минут [/color] <br> [Color=#00FF00][SPOILER=Пример]слишком большие аксессуары на голове персонажа, имитация гитарой половых органов и тому подобное.[/SPOILER][/color]  [/COLOR][/FONT][/CENTER] <br>" +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/XJ5Yp4yv/giphy.gif[/img][/url][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'оск адм',
      content:
		'[Color=#00FF00][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][Color=#00FFFF][FONT=courier new]Игрок будет наказан по пункту правил:<br>2.54. Запрещено неуважительное обращение, оскорбление, неадекватное поведение, угрозы в любом их проявлении по отношению к администрации [Color=#00FF00] | Mute 180 минут [/color] <br> [Color=#00FF00][SPOILER=Пример]оформление жалобы в игре с текстом: Быстро починил меня, Админы вы задрали уже когда работать будете меня тут ДБшат я 3 жалобы уже подал!!!!!!!!, МОЗГИ ВКЛЮЧИТЕ Я УВОЛЮ ВАС ЩА и т.д. и т.п., а также при взаимодействии с другими игроками.[/SPOILER][/color] <br> [Color=#00FF00][SPOILER=Пример]оскорбление администрации в любой чат, включая репорт подлежит наказанию в виде блокировки доступа к использованию всех видов чатов - [Color=#FF0000] | Mute 180 минут [/color][/SPOILER][/color] [/COLOR][/FONT][/CENTER] <br>" +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/XJ5Yp4yv/giphy.gif[/img][/url][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'баг с аним',
      content:
		'[Color=#00FF00][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][Color=#00FFFF][FONT=courier new]Игрок будет наказан по пункту правил:<br>2.55. Запрещается багоюз связанный с анимацией в любых проявлениях. [Color=#00FF00] | Jail 60 / 120 минут [/color] <br> [Color=#00FF00][SPOILER=Пример]если игрок, используя баг, убирает ограничение на использование оружия в зеленой зоне, сбивает темп стрельбы, либо быстро перемещается во время войны за бизнес или во время перестрелки на мероприятии с семейными контейнерами, последует наказание в виде [Color=#FF0000] Jail на 120 минут. [/color] Данное наказание используется в случаях, когда, используя ошибку, было получено преимущество перед другими игроками.[/SPOILER][/color] <br> [Color=#00FF00][SPOILER=Пример]если игрок использует баги, связанные с анимацией, и при этом не влияет на игровой процесс других игроков, а также не получает преимущество перед другими игроками, последует наказание в виде [Color=#FF0000] Jail на 60 минут. [/color][/SPOILER][/color] [/COLOR][/FONT][/CENTER] <br>" +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/XJ5Yp4yv/giphy.gif[/img][/url][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴казик/ночной клуб╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
      title: 'принятие за деньги',
      content:
		'[Color=#00FF00][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][Color=#00FFFF][FONT=courier new]Игрок будет наказан по пункту правил:<br>2.01. Владельцу и менеджерам казино и ночного клуба запрещено принимать работников за денежные средства на должность охранника, крупье или механика [Color=#00FF00] | Ban 3 - 5 дней. [/color] [/COLOR][/FONT][/CENTER] <br>" +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/XJ5Yp4yv/giphy.gif[/img][/url][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'налог за должность',
      content:
		'[Color=#00FF00][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][Color=#00FFFF][FONT=courier new]Игрок будет наказан по пункту правил:<br>2.02. Владельцу и менеджерам казино и ночного клуба запрещено взимать у работников налоги в виде денежных средств за должность в казино [Color=#00FF00] | Ban 3 - 5 дней. [/color] [/COLOR][/FONT][/CENTER] <br>" +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/XJ5Yp4yv/giphy.gif[/img][/url][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'ставка больше чем просят',
      content:
		'[Color=#00FF00][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][Color=#00FFFF][FONT=courier new]Игрок будет наказан по пункту правил:<br>2.04. Крупье запрещено делать ставку выше, чем просят игроки [Color=#00FF00] | Увольнение с должности. [/color] [/COLOR][/FONT][/CENTER] <br>" +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/XJ5Yp4yv/giphy.gif[/img][/url][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴Чат ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
      title: 'разговор не на русском',
      content:
		'[Color=#00FF00][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/FONT][/CENTER]<br>' +
        "[CENTER][Color=#00FFFF][FONT=courier new]Игрок будет наказан по пункту правил:<br>3.01. Общепризнанный язык сервера — русский. Общение в IC чатах во всех Role Play ситуациях обязательно должно проходить исключительно на русском языке [Color=#00FF00] | Устное замечание / Mute 30 минут [/color] [/COLOR][/FONT][/CENTER] <br>" +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/XJ5Yp4yv/giphy.gif[/img][/url][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'капс',
      content:
		'[Color=#00FF00][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/FONT][/CENTER]<br>' +
        "[CENTER][Color=#00FFFF][FONT=courier new]Игрок будет наказан по пункту правил:<br>3.02. Запрещено использование верхнего регистра (CapsLock) при написании любого текста в любом чате [Color=#00FF00] | Mute 30 минут [/color] [/COLOR][/FONT][/CENTER] <br>" +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/XJ5Yp4yv/giphy.gif[/img][/url][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'оск в OOC',
      content:
		'[Color=#00FF00][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/FONT][/CENTER]<br>' +
        "[CENTER][Color=#00FFFF][FONT=courier new]Игрок будет наказан по пункту правил:<br>3.03. Любые формы оскорблений, издевательств, расизма, дискриминации, религиозной враждебности, сексизма в OOC чате запрещены [Color=#00FF00] | Mute 30 минут [/color] [/COLOR][/FONT][/CENTER] <br>" +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/XJ5Yp4yv/giphy.gif[/img][/url][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
     {
      title: 'Мат в VIP чат',
      content:
		'[Color=#00FF00][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/FONT][/CENTER]<br>' +
        "[CENTER][Color=#00FFFF][FONT=courier new]Игрок будет наказан по пункту правил:<br>3.23. Запрещено использование нецензурных слов, в том числе завуалированных и литературных в VIP чате [Color=#00FF00] | Mute 30 минут [/color] [/COLOR][/FONT][/CENTER] <br>" +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/XJ5Yp4yv/giphy.gif[/img][/url][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'оск/упом род',
      content:
		'[Color=#00FF00][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/FONT][/CENTER]<br>' +
        "[CENTER][Color=#00FFFF][FONT=courier new]Игрок будет наказан по пункту правил:<br>3.04. Запрещено оскорбление или косвенное упоминание родных вне зависимости от чата (IC или OOC) [Color=#00FF00] | Mute 120 минут / Ban 7 - 15 дней [/color] <br> [Color=#FF0000][SPOILER=Примечание]термины (MQ), (rnq) расценивается, как упоминание родных.[/SPOILER][/color] <br> [Color=#FFFF00][SPOILER=Исключение]если упоминание родных было совершено в ходе Role Play процесса и не содержало в себе прямого или завуалированного оскорбления.[/SPOILER][/color] [/COLOR][/FONT][/CENTER] <br>" +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/XJ5Yp4yv/giphy.gif[/img][/url][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'флуд',
      content:
		'[Color=#00FF00][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/FONT][/CENTER]<br>' +
        "[CENTER][Color=#00FFFF][FONT=courier new]Игрок будет наказан по пункту правил:<br>3.05. Запрещен флуд — 3 и более повторяющихся сообщений от одного и того же игрока [Color=#00FF00] | Mute 30 минут [/color] [/COLOR][/FONT][/CENTER] <br>" +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/XJ5Yp4yv/giphy.gif[/img][/url][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'злоуп символами',
      content:
		'[Color=#00FF00][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/FONT][/CENTER]<br>' +
        "[CENTER][Color=#00FFFF][FONT=courier new]Игрок будет наказан по пункту правил:<br>3.06. Запрещено злоупотребление знаков препинания и прочих символов [Color=#00FF00] | Mute 30 минут [/color] <br> [Color=#00FF00][SPOILER=Пример]«???????», «!!!!!!!», «Дааааааааааааааааааааааа» и так далее.[/SPOILER][/color] [/COLOR][/FONT][/CENTER] <br>" +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/XJ5Yp4yv/giphy.gif[/img][/url][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'оск 18+',
      content:
		'[Color=#00FF00][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/FONT][/CENTER]<br>' +
        "[CENTER][Color=#00FFFF][FONT=courier new]Игрок будет наказан по пункту правил:<br>3.07. Запрещены совершенно любые оскорбления или действия, порочащие честь и достоинства, несущие в себе подтекст сексуального характера вне зависимости от чата [Color=#00FF00] | Mute 30 минут [/color] <br> [Color=#FF0000][SPOILER=Примечание]«дырка», «шмара», «ведро», «мадагаскарский присосконог», «свиноногий бандикут», «скорострел» и так далее.[/SPOILER][/color] [/COLOR][/FONT][/CENTER] <br>" +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/XJ5Yp4yv/giphy.gif[/img][/url][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'слив',
      content:
		'[Color=#00FF00][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/FONT][/CENTER]<br>' +
        "[CENTER][Color=#00FFFF][FONT=courier new]Игрок будет наказан по пункту правил:<br>3.08. Запрещены любые формы «слива» посредством использования глобальных чатов [Color=#00FF00] | PermBan [/color] [/COLOR][/FONT][/CENTER] <br>" +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/XJ5Yp4yv/giphy.gif[/img][/url][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'угроза наказанием со стороны адм',
      content:
		'[Color=#00FF00][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/FONT][/CENTER]<br>' +
        "[CENTER][Color=#00FFFF][FONT=courier new]Игрок будет наказан по пункту правил:<br>3.09. Запрещены любые угрозы о наказании игрока со стороны администрации [Color=#00FF00] | Mute 30 минут [/color] [/COLOR][/FONT][/CENTER] <br>" +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/XJ5Yp4yv/giphy.gif[/img][/url][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'выдача себя за адм',
      content:
		'[Color=#00FF00][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/FONT][/CENTER]<br>' +
        "[CENTER][Color=#00FFFF][FONT=courier new]Игрок будет наказан по пункту правил:<br>3.10. Запрещена выдача себя за администратора, если таковым не являетесь [Color=#00FF00] | Ban 7 - 15 + ЧС администрации[/color] [/COLOR][/FONT][/CENTER] <br>" +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/XJ5Yp4yv/giphy.gif[/img][/url][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'ввод в заблуждение',
      content:
		'[Color=#00FF00][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/FONT][/CENTER]<br>' +
        "[CENTER][Color=#00FFFF][FONT=courier new]Игрок будет наказан по пункту правил:<br>3.11. Запрещено введение игроков проекта в заблуждение путем злоупотребления командами [Color=#00FF00] | Ban 15 - 30 дней / PermBan[/color] <br> [Color=#FF0000][SPOILER=Примечание]/me чтобы поднять кошелек введите /pay 228 5000. Для продажи автомобиля введите /sellmycar id 2828 (счёт в банке) цена.[/SPOILER][/color] [/COLOR][/FONT][/CENTER] <br>" +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/XJ5Yp4yv/giphy.gif[/img][/url][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'оффтоп в реп',
      content:
		'[Color=#00FF00][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/FONT][/CENTER]<br>' +
        "[CENTER][Color=#00FFFF][FONT=courier new]Игрок будет наказан по пункту правил:<br>3.12. Запрещено подавать репорт написанный транслитом, с сообщением не по теме (Offtop), с включенным Caps Lock и повторять обращение (если ответ был уже дан ранее) [Color=#00FF00] | Report Mute 30 минут [/color] [/COLOR][/FONT][/CENTER] <br>" +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/XJ5Yp4yv/giphy.gif[/img][/url][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'нецензурная брань в реп',
      content:
		'[Color=#00FF00][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/FONT][/CENTER]<br>' +
        "[CENTER][Color=#00FFFF][FONT=courier new]Игрок будет наказан по пункту правил:<br>3.13. Запрещено подавать репорт с использованием нецензурной брани [Color=#00FF00] | Report Mute 30 минут [/color] [/COLOR][/FONT][/CENTER] <br>" +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/XJ5Yp4yv/giphy.gif[/img][/url][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'музыка',
      content:
		'[Color=#00FF00][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/FONT][/CENTER]<br>' +
        "[CENTER][Color=#00FFFF][FONT=courier new]Игрок будет наказан по пункту правил:<br>3.14. Запрещено включать музыку в Voice Chat [Color=#00FF00] | Mute 60 минут [/color] [/COLOR][/FONT][/CENTER] <br>" +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/XJ5Yp4yv/giphy.gif[/img][/url][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'оск/упом род в воис',
      content:
		'[Color=#00FF00][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/FONT][/CENTER]<br>' +
        "[CENTER][Color=#00FFFF][FONT=courier new]Игрок будет наказан по пункту правил:<br>3.15. Запрещено оскорблять игроков или родных в Voice Chat [Color=#00FF00]| | Mute 120 минут / Ban 7 - 15 дней [/color] [/COLOR][/FONT][/CENTER] <br>" +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/XJ5Yp4yv/giphy.gif[/img][/url][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'шумы в воис',
      content:
		'[Color=#00FF00][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/FONT][/CENTER]<br>' +
        "[CENTER][Color=#00FFFF][FONT=courier new]Игрок будет наказан по пункту правил:<br>3.16. Запрещено создавать посторонние шумы или звуки [Color=#00FF00] | Mute 30 минут [/color] <br> [Color=#FF0000][SPOILER=Примечание]Посторонние звуки на фоне речи, мешающие взаимодействию игроков посредством голосового чата. Сильное искажение звука, исходящее из микрофона плохого качества. Намеренно портить игру другим игрокам (кричать, перебивать)[/SPOILER][/color] [/COLOR][/FONT][/CENTER] <br>" +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/XJ5Yp4yv/giphy.gif[/img][/url][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'реклама в воис',
      content:
		'[Color=#00FF00][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/FONT][/CENTER]<br>' +
        "[CENTER][Color=#00FFFF][FONT=courier new]Игрок будет наказан по пункту правил:<br>3.17. Запрещена реклама в Voice Chat не связанная с игровым процессом [Color=#00FF00] | Ban 7 - 15 дней [/color] <br> [Color=#00FF00][SPOILER=Пример]реклама Discord серверов, групп, сообществ, ютуб каналов и т.д.[/SPOILER][/color] [/COLOR][/FONT][/CENTER] <br>" +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/XJ5Yp4yv/giphy.gif[/img][/url][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'полит/религ пропоганда',
      content:
		'[Color=#00FF00][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/FONT][/CENTER]<br>' +
        "[CENTER][Color=#00FFFF][FONT=courier new]Игрок будет наказан по пункту правил:<br>3.18. Запрещено политическое и религиозное пропагандирование [Color=#00FF00] | Mute 120 минут / Ban 10 дней [/color] [/COLOR][/FONT][/CENTER] <br>" +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/XJ5Yp4yv/giphy.gif[/img][/url][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'изменение голоса софтом',
      content:
		'[Color=#00FF00][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/FONT][/CENTER]<br>' +
        "[CENTER][Color=#00FFFF][FONT=courier new]Игрок будет наказан по пункту правил:<br>3.19. Запрещено использование любого софта для изменения голоса [Color=#00FF00] | Mute 60 минут [/color] [/COLOR][/FONT][/CENTER] <br>" +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/XJ5Yp4yv/giphy.gif[/img][/url][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'транслит',
      content:
		'[Color=#00FF00][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/FONT][/CENTER]<br>' +
        "[CENTER][Color=#00FFFF][FONT=courier new]Игрок будет наказан по пункту правил:<br>3.20. Запрещено использование транслита в любом из чатов [Color=#00FF00] | Mute 30 минут [/color] <br> [Color=#00FF00][SPOILER=Пример]«Privet», «Kak dela», «Narmalna».[/SPOILER][/color] [/COLOR][/FONT][/CENTER] <br>" +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/XJ5Yp4yv/giphy.gif[/img][/url][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'реклама промо',
      content:
		'[Color=#00FF00][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/FONT][/CENTER]<br>' +
        "[CENTER][Color=#00FFFF][FONT=courier new]Игрок будет наказан по пункту правил:<br>3.21. Запрещается реклама промокодов в игре, а также их упоминание в любом виде во всех чатах. [Color=#00FF00] | Ban 30 дней [/color] <br> [Color=#FF0000][SPOILER=Примечание]чаты семейные, строительных компаний, транспортных компаний, фракционные чаты, IC, OOC, VIP и так далее.[/SPOILER][/color] <br> [Color=#FFFF00][SPOILER=Исключение]промокоды, предоставленные разработчиками, а также распространяемые через официальные ресурсы проекта.[/SPOILER][/color] <br> [Color=#00FF00][SPOILER=Пример]если игрок упомянет промокод, распространяемый через официальную публичную страницу ВКонтакте либо через официальный Discord в любом из чатов, наказание ему не выдается.[/SPOILER][/color]  [/COLOR][/FONT][/CENTER] <br>" +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/XJ5Yp4yv/giphy.gif[/img][/url][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'обьява в гос орг',
      content:
		'[Color=#00FF00][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/FONT][/CENTER]<br>' +
        "[CENTER][Color=#00FFFF][FONT=courier new]Игрок будет наказан по пункту правил:<br>3.22. Запрещено публиковать любые объявления в помещениях государственных организаций вне зависимости от чата (IC или OOC) [Color=#00FF00] | Mute 30 минут [/color] <br> [Color=#00FF00][SPOILER=Пример]в помещении центральной больницы писать в чат: «Продам эксклюзивную шапку дешево»[/SPOILER][/color] [/COLOR][/FONT][/CENTER] <br>" +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/XJ5Yp4yv/giphy.gif[/img][/url][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'помеха игр процессу',
      content:
		'[Color=#00FF00][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/FONT][/CENTER]<br>' +
        "[CENTER][Color=#00FFFF][FONT=courier new]Игрок будет наказан за помеху игровому процессу [Color=#00FF00] | Mute 300 минут [/color] [/color] <br><br>" +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/XJ5Yp4yv/giphy.gif[/img][/url][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴ники ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
      title: 'нрп ник',
      content:
		'[Color=#00FF00][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/FONT][/CENTER]<br>' +
        "[CENTER][Color=#00FFFF][FONT=courier new]Игрок будет наказан по пункту правил:<br>4.06. Никнейм игрового аккаунта должен быть в формате Имя_Фамилия на английском языке [Color=#00FF00] | Устное замечание + смена игрового никнейма [/color] <br> [Color=#00FF00][SPOILER=Пример]John_Scatman — это правильный Role Play игровой никнейм, в котором не содержится ошибок.[/SPOILER][/color] <br> [Color=#00FF00][SPOILER=Пример]_scatman_John — это неправильный Role Play игровой никнейм, в котором содержатся определенные ошибки.[/SPOILER][/color] [/COLOR][/FONT][/CENTER] <br>" +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/XJ5Yp4yv/giphy.gif[/img][/url][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'оск ник',
      content:
		'[Color=#00FF00][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/FONT][/CENTER]<br>' +
        "[CENTER][Color=#00FFFF][FONT=courier new]Игрок будет наказан по пункту правил:<br>4.09. Запрещено использовать никнейм, содержащий в себе матерные слова или оскорбления (в том числе, завуалированные) [Color=#00FF00] | Устное замечание + смена игрового никнейма / PermBan [/color] [/COLOR][/FONT][/CENTER] <br>" +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/XJ5Yp4yv/giphy.gif[/img][/url][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'фейк',
      content:
		'[Color=#00FF00][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/FONT][/CENTER]<br>' +
        "[CENTER][Color=#00FFFF][FONT=courier new]Игрок будет наказан по пункту правил:<br>4.10. Запрещено создавать никнейм, повторяющий или похожий на существующие никнеймы игроков или администраторов по их написанию [Color=#00FF00] | Устное замечание + смена игрового никнейма / PermBan [/color] <br> [Color=#00FF00][SPOILER=Пример]подменять букву i на L и так далее, по аналогии.[/SPOILER][/color] [/COLOR][/FONT][/CENTER] <br>" +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/XJ5Yp4yv/giphy.gif[/img][/url][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴правила форума ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
      title: 'неадекват',
      content:
		'[Color=#00FF00][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/FONT][/CENTER]<br>' +
        "[CENTER][Color=#00FFFF][FONT=courier new]Игрок будет наказан по пункту правил пользования форумом:<br>2.02. Запрещено неадекватное поведение в любой возможной форме, от оскорблений простых пользователей, до оскорбления администрации или других членов команды проекта. [/COLOR][/FONT][/CENTER] <br>" +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/XJ5Yp4yv/giphy.gif[/img][/url][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'травля пользователя',
      content:
		'[Color=#00FF00][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/FONT][/CENTER]<br>' +
        "[CENTER][Color=#00FFFF][FONT=courier new]Игрок будет наказан по пункту правил пользования форумом:<br>2.03. Запрещена массовая травля, то есть агрессивное преследование одного из пользователей данного форума. [/COLOR][/FONT][/CENTER] <br>" +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/XJ5Yp4yv/giphy.gif[/img][/url][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'провокация, розжик конфликта',
      content:
		'[Color=#00FF00][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/FONT][/CENTER]<br>' +
        "[CENTER][Color=#00FFFF][FONT=courier new]Игрок будет наказан по пункту правил пользования форумом:<br>2.04. Запрещены латентные, то есть скрытные (завуалированные), саркастические сообщения/действия, созданные в целях оскорбления того или иного лица, либо для его провокации и дальнейшего розжига конфликта. [/COLOR][/FONT][/CENTER] <br>" +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/XJ5Yp4yv/giphy.gif[/img][/url][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'реклама',
      content:
		'[Color=#00FF00][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/FONT][/CENTER]<br>' +
        "[CENTER][Color=#00FFFF][FONT=courier new]Игрок будет наказан по пункту правил пользования форумом:<br>2.05. Запрещена совершенно любая реклама любого направления. [/COLOR][/FONT][/CENTER] <br>" +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/XJ5Yp4yv/giphy.gif[/img][/url][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: '18+',
      content:
		'[Color=#00FF00][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/FONT][/CENTER]<br>' +
        "[CENTER][Color=#00FFFF][FONT=courier new]Игрок будет наказан по пункту правил пользования форумом:<br>2.06. Запрещено размещение любого возрастного контента, которые несут в себе интимный, либо насильственный характер, также фотографии содержащие в себе шок-контент, на примере расчленения и тому подобного. [/COLOR][/FONT][/CENTER] <br>" +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/XJ5Yp4yv/giphy.gif[/img][/url][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'флуд, оффтоп',
      content:
		'[Color=#00FF00][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/FONT][/CENTER]<br>' +
        "[CENTER][Color=#00FFFF][FONT=courier new]Игрок будет наказан по пункту правил пользования форумом:<br>2.07. Запрещено флудить, оффтопить во всех разделах которые имеют строгое назначение. [/COLOR][/FONT][/CENTER] <br>" +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/XJ5Yp4yv/giphy.gif[/img][/url][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'религия/политика',
      content:
		'[Color=#00FF00][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/FONT][/CENTER]<br>' +
        "[CENTER][Color=#00FFFF][FONT=courier new]Игрок будет наказан по пункту правил пользования форумом:<br>2.09. Запрещены споры на тему религии/политики. [/COLOR][/FONT][/CENTER] <br>" +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/XJ5Yp4yv/giphy.gif[/img][/url][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'помеха развитию проекта',
      content:
		'[Color=#00FF00][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/FONT][/CENTER]<br>' +
        "[CENTER][Color=#00FFFF][FONT=courier new]Игрок будет наказан по пункту правил пользования форумом:<br>2.14. Запрещены деструктивные действия по отношению к проекту: неконструктивная критика, призывы покинуть проект, попытки нарушить развитие проекта или любые другие действия, способные привести к помехам в игровом процессе. [/COLOR][/FONT][/CENTER] <br>" +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/XJ5Yp4yv/giphy.gif[/img][/url][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'попрошайничество',
      content:
		'[Color=#00FF00][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/FONT][/CENTER]<br>' +
        "[CENTER][Color=#00FFFF][FONT=courier new]Игрок будет наказан по пункту правил пользования форумом:<br>2.16. Запрещено вымогательство или попрошайничество во всех возможных проявлениях. [/COLOR][/FONT][/CENTER] <br>" +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/XJ5Yp4yv/giphy.gif[/img][/url][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'злоуп капсом/транслитом',
      content:
		'[Color=#00FF00][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/FONT][/CENTER]<br>' +
        "[CENTER][Color=#00FFFF][FONT=courier new]Игрок будет наказан по пункту правил пользования форумом:<br>2.17. Запрещено злоупотребление Caps Lock`ом или транслитом. [/COLOR][/FONT][/CENTER] <br>" +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/XJ5Yp4yv/giphy.gif[/img][/url][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'дубликат тем',
      content:
		'[Color=#00FF00][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/FONT][/CENTER]<br>' +
        "[CENTER][Color=#00FFFF][FONT=courier new]Игрок будет наказан по пункту правил пользования форумом:<br>2.18. Запрещена публикация дублирующихся тем. [/COLOR][/FONT][/CENTER] <br>" +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/XJ5Yp4yv/giphy.gif[/img][/url][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'бесмысленый/оск ник фа',
      content:
		'[Color=#00FF00][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/FONT][/CENTER]<br>' +
        "[CENTER][Color=#00FFFF][FONT=courier new]Игрок будет наказан по пункту правил пользования форумом:<br>3.02. Запрещено регистрировать аккаунты с бессмысленными никнеймами и содержащие нецензурные выражения. [/COLOR][/FONT][/CENTER] <br>" +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/XJ5Yp4yv/giphy.gif[/img][/url][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'похож ник фа на адм',
      content:
		'[Color=#00FF00][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/FONT][/CENTER]<br>' +
        "[CENTER][Color=#00FFFF][FONT=courier new]Игрок будет наказан по пункту правил пользования форумом:<br>3.03. Запрещено регистрировать аккаунты с никнеймами похожими на никнеймы администрации. [/COLOR][/FONT][/CENTER] <br>" +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/XJ5Yp4yv/giphy.gif[/img][/url][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴правила гос ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
      title: 'работа в форме',
      content:
		'[Color=#00FF00][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/FONT][/CENTER]<br>' +
        "[CENTER][Color=#00FFFF][FONT=courier new]Игрок будет наказан по пункту правил:<br>1.07. Всем сотрудникам государственных организаций запрещено выполнять работы где-либо в форме, принадлежащей своей фракции [Color=#00FF00] | Jail 30 минут [/color] [/COLOR][/FONT][/CENTER] <br>" +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/XJ5Yp4yv/giphy.gif[/img][/url][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'т/с в личн целях',
      content:
		'[Color=#00FF00][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/FONT][/CENTER]<br>' +
        "[CENTER][Color=#00FFFF][FONT=courier new]Игрок будет наказан по пункту правил:<br>1.08. Запрещено использование фракционного транспорта в личных целях [Color=#00FF00] | Jail 30 минут [/color] [/COLOR][/FONT][/CENTER] <br>" +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/XJ5Yp4yv/giphy.gif[/img][/url][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'патруль в одинучку',
      content:
		'[Color=#00FF00][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/FONT][/CENTER]<br>' +
        "[CENTER][Color=#00FFFF][FONT=courier new]Игрок будет наказан по пункту правил:<br>1.11. Всем силовым структурам запрещен одиночный патруль или конвоирование, минимум 2 сотрудника [Color=#00FF00] | Jail 30 минут [/color] [/COLOR][/FONT][/CENTER] <br>" +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/XJ5Yp4yv/giphy.gif[/img][/url][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'прогул рд',
      content:
		'[Color=#00FF00][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/FONT][/CENTER]<br>' +
        "[CENTER][Color=#00FFFF][FONT=courier new]Игрок будет наказан по пункту правил:<br>1.13. Запрещено находиться в форме внутри казино, участвовать в битве за контейнеры, участвовать в захвате семейного контейнера, находится на Б/У рынке с целью покупки / продажи авто, а также устраиваться на сторонние работы в форме фракции [Color=#00FF00] | Jail 30 минут [/color] [/COLOR][/FONT][/CENTER] <br>" +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/XJ5Yp4yv/giphy.gif[/img][/url][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'урон вне теры военки (армия)',
      content:
		'[Color=#00FF00][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/FONT][/CENTER]<br>' +
        "[CENTER][Color=#00FFFF][FONT=courier new]Игрок будет наказан по пункту правил:<br>2.02. Наносить урон игрокам, которые находятся вне территории воинской части, запрещено [Color=#00FF00] | DM / Jail 60 минут / Warn [/color] [/COLOR][/FONT][/CENTER] <br>" +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/XJ5Yp4yv/giphy.gif[/img][/url][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'лицензия без рп (право)',
      content:
		'[Color=#00FF00][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/FONT][/CENTER]<br>' +
        "[CENTER][Color=#00FFFF][FONT=courier new]Игрок будет наказан по пункту правил:<br>3.01. Запрещена выдача лицензий без Role Play отыгровок; [/COLOR][/FONT][/CENTER] <br>" +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/XJ5Yp4yv/giphy.gif[/img][/url][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'адвокат без рп (право)',
      content:
		'[Color=#00FF00][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/FONT][/CENTER]<br>' +
        "[CENTER][Color=#00FFFF][FONT=courier new]Игрок будет наказан по пункту правил:<br>3.02. Запрещено оказание услуг адвоката без Role Play отыгровок. [/COLOR][/FONT][/CENTER] <br>" +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/XJ5Yp4yv/giphy.gif[/img][/url][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Не по ПРО (СМИ)',
      content:
		'[Color=#00FF00][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/FONT][/CENTER]<br>' +
        "[CENTER][Color=#00FFFF][FONT=courier new]Игрок будет наказан по пункту правил:<br>4.01. Запрещено редактирование объявлений, не соответствующих ПРО | [Color=#00FF00] | Mute 30 минут [/color] [/COLOR][/FONT][/CENTER] <br>" +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/XJ5Yp4yv/giphy.gif[/img][/url][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Не по ППЭ (СМИ)',
      content:
		'[Color=#00FF00][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/FONT][/CENTER]<br>' +
        "[CENTER][Color=#00FFFF][FONT=courier new]Игрок будет наказан по пункту правил:<br>4.02. Запрещено проведение эфиров, не соответствующих Role Play правилам и логике [Color=#00FF00] | Mute 30 минут [/color] [/COLOR][/FONT][/CENTER] <br>" +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/XJ5Yp4yv/giphy.gif[/img][/url][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'замена текста обьявки (СМИ)',
      content:
		'[Color=#00FF00][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/FONT][/CENTER]<br>' +
        "[CENTER][Color=#00FFFF][FONT=courier new]Игрок будет наказан по пункту правил:<br>4.04. Запрещено редактировать поданные объявления в личных целях заменяя текст объявления на несоответствующий отправленному игроком [Color=#00FF00] | Ban 7 дней + ЧС организации [/color] [/COLOR][/FONT][/CENTER] <br>" +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/XJ5Yp4yv/giphy.gif[/img][/url][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'оружие в форме (цб)',
      content:
		'[Color=#00FF00][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/FONT][/CENTER]<br>' +
        "[CENTER][Color=#00FFFF][FONT=courier new]Игрок будет наказан по пункту правил:<br>5.01. Запрещено использование оружия в рабочей форме.; [/COLOR][/FONT][/CENTER] <br>" +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/XJ5Yp4yv/giphy.gif[/img][/url][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Урон без рп причины (УМВД/ГИБДД/ФСБ/ФСИН)',
      content:
		'[Color=#00FF00][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/FONT][/CENTER]<br>' +
        "[CENTER][Color=#00FFFF][FONT=courier new]Игрок будет наказан по пункту правил:<br> Запрещено наносить урон игрокам без Role Play причины на территории УМВД/ГИБДД/ФСБ/ФСИН [Color=#00FF00] | DM / Jail 60 минут / Warn [/color] [/COLOR][/FONT][/CENTER] <br>" +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/XJ5Yp4yv/giphy.gif[/img][/url][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'розыск без причины (УМВД/ФСБ/ГИБДД)',
      content:
		'[Color=#00FF00][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/FONT][/CENTER]<br>' +
        "[CENTER][Color=#00FFFF][FONT=courier new]Игрок будет наказан по пункту правил:<br> 7.02. Запрещено выдавать розыск, штраф без Role Play причины [Color=#00FF00] | Warn [/color] [/COLOR][/FONT][/CENTER] <br>" +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/XJ5Yp4yv/giphy.gif[/img][/url][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'нрп коп (УМВД/ГИБДД/ФСБ)',
      content:
		'[Color=#00FF00][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/FONT][/CENTER]<br>' +
        "[CENTER][Color=#00FFFF][FONT=courier new]Игрок будет наказан по пункту правил:<br> Запрещено nRP поведение [Color=#00FF00] |  Warn [/color] [Color=#FF0000][SPOILER=Примечание]поведение, не соответствующее сотруднику УМВД/ГИБДД/ФСБ.[/SPOILER][/color] <br> [Color=#00FF00][SPOILER=Пример]- открытие огня по игрокам без причины <br> - расстрел машин без причины <br> - нарушение ПДД без причины <br> - сотрудник на служебном транспорте кричит о наборе в свою семью на спавне[/SPOILER][/color] [/COLOR][/FONT][/CENTER]<br>" +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/XJ5Yp4yv/giphy.gif[/img][/url][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'отбор вод прав при погоне (ГИБДД)',
      content:
		'[Color=#00FF00][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/FONT][/CENTER]<br>' +
        "[CENTER][Color=#00FFFF][FONT=courier new]Игрок будет наказан по пункту правил:<br> 7.05. Запрещено отбирать водительские права во время погони за нарушителем [Color=#00FF00] |  Warn [/color] [/COLOR][/FONT][/CENTER] <br>" +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/XJ5Yp4yv/giphy.gif[/img][/url][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'остановка и осмотр т/с без рп (ГИБДД)',
      content:
		'[Color=#00FF00][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/FONT][/CENTER]<br>' +
        "[CENTER][Color=#00FFFF][FONT=courier new]Игрок будет наказан по пункту правил:<br> 7.04. Запрещено останавливать и осматривать транспортное средство без Role Play отыгровки; [/COLOR][/FONT][/CENTER] <br>" +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/XJ5Yp4yv/giphy.gif[/img][/url][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'маскировка в лич целях (ФСБ)',
      content:
		'[Color=#00FF00][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/FONT][/CENTER]<br>' +
        "[CENTER][Color=#00FFFF][FONT=courier new]Игрок будет наказан по пункту правил:<br> 8.04. Запрещено использовать маскировку в личных целях; [/COLOR][/FONT][/CENTER] <br>" +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/XJ5Yp4yv/giphy.gif[/img][/url][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'обыск без рп (ФСБ)',
      content:
		'[Color=#00FF00][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/FONT][/CENTER]<br>' +
        "[CENTER][Color=#00FFFF][FONT=courier new]Игрок будет наказан по пункту правил:<br> 8.06. Запрещено проводить обыск игрока без Role Play отыгровки. [/COLOR][/FONT][/CENTER] <br>" +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/XJ5Yp4yv/giphy.gif[/img][/url][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴правила опг ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
      title: 'провокация гос',
      content:
		'[Color=#00FF00][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/FONT][/CENTER]<br>' +
        "[CENTER][Color=#00FFFF][FONT=courier new]Игрок будет наказан по пункту правил:<br> 2. Запрещено провоцировать сотрудников государственных организаций [Color=#00FF00] |  Jail 30 минут [/color][/COLOR][/FONT][/CENTER] <br>" +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/XJ5Yp4yv/giphy.gif[/img][/url][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'провокация опг на их тере',
      content:
		'[Color=#00FF00][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/FONT][/CENTER]<br>' +
        "[CENTER][Color=#00FFFF][FONT=courier new]Игрок будет наказан по пункту правил:<br> 3. Запрещено провоцировать сотрудников криминальных организаций возле или на территории вражеской группировки [Color=#00FF00] |  Jail 30 минут [/color][/COLOR][/FONT][/CENTER] <br>" +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/XJ5Yp4yv/giphy.gif[/img][/url][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'урон без причины на тере',
      content:
		'[Color=#00FF00][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/FONT][/CENTER]<br>' +
        "[CENTER][Color=#00FFFF][FONT=courier new]Игрок будет наказан по пункту правил:<br> 4. Запрещено без причины наносить урон игрокам на территории ОПГ [Color=#00FF00] |  Jail 60 минут [/color][/COLOR][/FONT][/CENTER] <br>" +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/XJ5Yp4yv/giphy.gif[/img][/url][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'дуэли',
      content:
		'[Color=#00FF00][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/FONT][/CENTER]<br>' +
        "[CENTER][Color=#00FFFF][FONT=courier new]Игрок будет наказан по пункту правил:<br> 5. Запрещено устраивать дуэли где-либо, а также на территории ОПГ [Color=#00FF00] |  Jail 30 минут [/color][/COLOR][/FONT][/CENTER] <br>" +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/XJ5Yp4yv/giphy.gif[/img][/url][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'перестрелки в людных местах',
      content:
		'[Color=#00FF00][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/FONT][/CENTER]<br>' +
        "[CENTER][Color=#00FFFF][FONT=courier new]Игрок будет наказан по пункту правил:<br> 6. Запрещено устраивать перестрелки с другими ОПГ в людных местах [Color=#00FF00] |  Jail 60 минут [/color][/COLOR][/FONT][/CENTER] <br>" +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/XJ5Yp4yv/giphy.gif[/img][/url][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'реклама в /f',
      content:
		'[Color=#00FF00][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/FONT][/CENTER]<br>' +
        "[CENTER][Color=#00FFFF][FONT=courier new]Игрок будет наказан по пункту правил:<br> 7. Запрещена любая реклама (семей, транспортных и строительных компаний и т.д.), предложения о купле, продаже, обмене чего-либо в чате организации [Color=#00FF00] |  Mute 30 минут [/color][/COLOR][/FONT][/CENTER] <br>" +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/XJ5Yp4yv/giphy.gif[/img][/url][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'cкрыться от копа на базе',
      content:
		'[Color=#00FF00][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/FONT][/CENTER]<br>' +
        "[CENTER][Color=#00FFFF][FONT=courier new]Игрок будет наказан по пункту правил:<br> 8. Запрещено уходить от погони со стороны правоохранительных органов путем заезда на территорию своей банды для того чтобы скрыться или получить численное преимущество [Color=#00FF00] |  Jail 30 минут [/color][/COLOR][/FONT][/CENTER] <br>" +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/XJ5Yp4yv/giphy.gif[/img][/url][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'нон рп вч',
      content:
		'[Color=#00FF00][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/FONT][/CENTER]<br>' +
        "[CENTER][Color=#00FFFF][FONT=courier new]Игрок будет наказан по пункту правил:<br> За нарушение правил нападения на Войсковую Часть выдаётся предупреждение [Color=#00FF00] | Jail 30 минут (NonRP нападение) / Warn (Для сотрудников ОПГ) [/color] [/COLOR][/FONT][/CENTER] <br>" +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/XJ5Yp4yv/giphy.gif[/img][/url][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'находится на тере бв лишний',
      content:
		'[Color=#00FF00][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/FONT][/CENTER]<br>' +
        "[CENTER][Color=#00FFFF][FONT=courier new]Игрок будет наказан по пункту правил:<br> 1.06. На территории проведения бизвара может находиться только сторона атаки и сторона защиты [Color=#00FF00] | Jail 30 минут [/color] [/COLOR][/FONT][/CENTER] <br>" +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/XJ5Yp4yv/giphy.gif[/img][/url][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'нон рп ограбление/похищение(джаил)',
      content:
		'[Color=#00FF00][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/FONT][/CENTER]<br>' +
        "[CENTER][Color=#00FFFF][FONT=courier new]Игрок получит наказание в виде деморгана за нарушение правил ограблений/похищений [/COLOR][/FONT][/CENTER] <br>" +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/XJ5Yp4yv/giphy.gif[/img][/url][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'нон рп ограбление/похищение(варн)',
      content:
		'[Color=#00FF00][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/FONT][/CENTER]<br>' +
        "[CENTER][Color=#00FFFF][FONT=courier new]Игрок получит наказание в виде предупреждения за нарушение правил ограблений/похищений [/COLOR][/FONT][/CENTER] <br>" +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/XJ5Yp4yv/giphy.gif[/img][/url][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'нон рп ограбление/похищение(бан)',
      content:
		'[Color=#00FF00][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/FONT][/CENTER]<br>' +
        "[CENTER][Color=#00FFFF][FONT=courier new]Игрок получит наказание в виде блокировки аккаунта за нарушение правил ограблений/похищений [/COLOR][/FONT][/CENTER] <br>" +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/XJ5Yp4yv/giphy.gif[/img][/url][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴другой раздел ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
      title: 'в жб на адм',
      content:
		'[Color=#DC143C][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/FONT][/CENTER]<br>' +
        "[CENTER][Color=#00FFFF][FONT=courier new]Вы ошиблись разделом.<br>Обратитесь в раздел [URL='https://forum.blackrussia.online/index.php?forums/Жалобы-на-администрацию.638/']Жалобы на администрацию[/URL]. [/COLOR][/FONT][/CENTER] <br>" +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/LXK0dYGv/giphy-1.gif[/img][/url][/CENTER]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'в жб на лд',
      content:
		'[Color=#DC143C][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/FONT][/CENTER]<br>' +
        "[CENTER][Color=#00FFFF][FONT=courier new]Вы ошиблись разделом.<br>Обратитесь в раздел [URL='https://forum.blackrussia.online/index.php?forums/Жалобы-на-лидеров.639/']Жалобы на лидеров[/URL]. [/COLOR][/FONT][/CENTER] <br>" +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/LXK0dYGv/giphy-1.gif[/img][/url][/CENTER]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'в обжалования',
      content:
		'[Color=#DC143C][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/FONT][/CENTER]<br>' +
        "[CENTER][Color=#00FFFF][FONT=courier new]Вы ошиблись разделом.<br>Обратитесь в раздел [URL='https://forum.blackrussia.online/index.php?forums/Обжалование-наказаний.641/']Обжалование наказаний[/URL]. [/COLOR][/FONT][/CENTER] <br>" +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/LXK0dYGv/giphy-1.gif[/img][/url][/CENTER]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'в тех раздел',
      content:
		'[Color=#DC143C][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/FONT][/CENTER]<br>' +
        "[CENTER][Color=#00FFFF][FONT=courier new]Вы ошиблись разделом.<br>Обратитесь в [URL='https://forum.blackrussia.online/index.php?forums/Технический-раздел.22/']Технический раздел[/URL]. [/COLOR][/FONT][/CENTER] <br>" +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/LXK0dYGv/giphy-1.gif[/img][/url][/CENTER]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'в жб на теха',
      content:
		'[Color=#DC143C][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/FONT][/CENTER]<br>' +
        "[CENTER][Color=#00FFFF][FONT=courier new]Вы ошиблись разделом.<br>Обратитесь в [URL='https://forum.blackrussia.online/index.php?forums/Жалобы-на-технических-специалистов.490/']Жалобы на технических специалистов[/URL]. [/COLOR][/FONT][/CENTER] <br>" +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/LXK0dYGv/giphy-1.gif[/img][/url][/CENTER]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'в жб на сотрудников орги',
      content:
		'[Color=#DC143C][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/FONT][/CENTER]<br>' +
        "[CENTER][Color=#00FFFF][FONT=courier new]Вы ошиблись разделом.<br>Обратитесь в раздел жалоб на сотрудников данной организации. [/COLOR][/FONT][/CENTER] <br>" +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/LXK0dYGv/giphy-1.gif[/img][/url][/CENTER]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴отказ жб ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
      title: 'нарушений не найдено',
      content:
		'[Color=#DC143C][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/FONT][/CENTER]<br>' +
        "[CENTER][Color=#00FF7F][FONT=courier new]Нарушений со стороны данного игрока не было найдено. [/COLOR][/FONT][/CENTER] <br>" +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/LXK0dYGv/giphy-1.gif[/img][/url][/CENTER]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'мало докв',
      content:
		'[Color=#DC143C][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/FONT][/CENTER]<br>' +
        "[CENTER][Color=#00FF7F][FONT=courier new]Недостаточно доказательств на нарушение от данного игрока. [/COLOR][/FONT][/CENTER] <br>" +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/LXK0dYGv/giphy-1.gif[/img][/url][/CENTER]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'дубликат',
      content:
		'[Color=#DC143C][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/FONT][/CENTER]<br>' +
        "[CENTER][Color=#FFFF00][FONT=courier new]Дублирование темы.<br>[Color=#00FF7F]Если вы дальше будете заниматься данной деятельностью (дублированием тем), то ваш форумный аккаунт будет [Color=#FF0000]заблокирован. [/COLOR][/FONT][/CENTER] <br>" +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/LXK0dYGv/giphy-1.gif[/img][/url][/CENTER]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'не по форме',
      content:
		'[Color=#DC143C][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/FONT][/CENTER]<br>' +
        "[CENTER][FONT=courier new][Color=#FFFF00]Ваша жалоба составлена не по форме.<br>[Color=#00FF7F]Убедительная просьба ознакомиться [URL='https://forum.blackrussia.online/index.php?threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BF%D0%BE%D0%B4%D0%B0%D1%87%D0%B8-%D0%B6%D0%B0%D0%BB%D0%BE%D0%B1-%D0%BD%D0%B0-%D0%B8%D0%B3%D1%80%D0%BE%D0%BA%D0%BE%D0%B2.3429394/']с правилами подачи жалоб на игроков[/URL]. [/COLOR][/FONT][/CENTER] <br>" +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/LXK0dYGv/giphy-1.gif[/img][/url][/CENTER]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'нет тайма',
      content:
		'[Color=#DC143C][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/FONT][/CENTER]<br>' +
        "[CENTER][Color=#00FF7F][FONT=courier new]На ваших доказательствах отсутствует [Color=#FFFF00]/time. [/COLOR][/FONT][/CENTER] <br>" +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/LXK0dYGv/giphy-1.gif[/img][/url][/CENTER]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'укажите таймкоды',
      content:
        '[Color=#FFA500][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/FONT][/CENTER]<br>' +
        "[CENTER][Color=#00FF7F][FONT=courier new]Ваше видеодоказательство длится [Color=#FFFF00]более 3-х минут, [Color=#00FF7F]поэтому укажите тайм-коды в течении [Color=#FFFF00]24-х часов.<br>[Color=#00FF7F]В противном случае жалоба будет [Color=#FF0000]отказана. <br> [COLOR=#FFFF00][SPOILER=Тайм-коды это]Определённый отрезок времени из видеозаписи, в котором произошли ключевые моменты. <br> Пример: <br> 0:37 - Условия сделки. <br> 0:50 - Сам обмен. <br> 1:50 - Конец обмена. <br>2:03 - Сабвуфера нет. <br>2:06 - /time. [/SPOILER][/COLOR] [/COLOR][/FONT][/CENTER] <br>" +
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zByWk0xc/giphy-3.gif[/img][/url][/CENTER]',
      prefix: PIN_PREFIX,
	  status: 123,
    },
    {
      title: 'более 72 часов',
      content:
		'[Color=#DC143C][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/FONT][/CENTER]<br>' +
        "[CENTER][Color=#00FF7F][FONT=courier new]Срок написания жалобы составляет [Color=#FFFF00]три дня (72 часа) [Color=#00FF7F]с момента совершенного нарушения со стороны игрока сервера. [/COLOR][/FONT][/CENTER] <br>" +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/LXK0dYGv/giphy-1.gif[/img][/url][/CENTER]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'соц сеть',
      content:
		'[Color=#DC143C][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/FONT][/CENTER]<br>' +
        "[CENTER][Color=#00FF7F][FONT=courier new]Загрузка доказательств в соц. сети [Color=#FFFF00](ВКонтакте, instagram) [Color=#FF0000]запрещается, [Color=#00FF7F]доказательства должны быть загружены на фото/видео хостинги [Color=#FFFF00](YouTube, Япикс, imgur). [/COLOR][/FONT][/CENTER] <br>" +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/LXK0dYGv/giphy-1.gif[/img][/url][/CENTER]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'нет условий сделки',
      content:
		'[Color=#DC143C][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/FONT][/CENTER]<br>' +
        "[CENTER][Color=#00FF7F][FONT=courier new]В ваших доказательствах отсутствуют условия сделки. [/COLOR][/FONT][/CENTER] <br>" +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/LXK0dYGv/giphy-1.gif[/img][/url][/CENTER]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'нужен фрапс',
      content:
		'[Color=#DC143C][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/FONT][/CENTER]<br>' +
        "[CENTER][Color=#00FF7F][FONT=courier new]В таких случаях нужен [Color=#FFFF00]фрапс. [/COLOR][/FONT][/CENTER] <br>" +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/LXK0dYGv/giphy-1.gif[/img][/url][/CENTER]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'нужен фрапс + промотка чата',
      content:
		'[Color=#DC143C][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/FONT][/CENTER]<br>' +
        "[CENTER][Color=#00FF7F][FONT=courier new]В таких случаях нужен [Color=#FFFF00]фрапс + промотка чата. [/COLOR][/FONT][/CENTER] <br>" +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/LXK0dYGv/giphy-1.gif[/img][/url][/CENTER]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'нужна промотка чата',
      content:
		'[Color=#DC143C][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/FONT][/CENTER]<br>' +
        "[CENTER][Color=#00FF7F][FONT=courier new]В таких случаях нужна [Color=#FFFF00]промотка чата. [/COLOR][/FONT][/CENTER] <br>" +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/LXK0dYGv/giphy-1.gif[/img][/url][/CENTER]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'фрапс обрывается',
      content:
		'[Color=#DC143C][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/FONT][/CENTER]<br>' +
        "[CENTER][Color=#00FF7F][FONT=courier new]Ваш фрапс обрывается, загрузите полный фрапс на [Color=#FFFF00]Ютуб. [/COLOR][/FONT][/CENTER] <br>" +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/LXK0dYGv/giphy-1.gif[/img][/url][/CENTER]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'не работают доки',
      content:
		'[Color=#DC143C][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/FONT][/CENTER]<br>' +
        "[CENTER][Color=#00FF7F][FONT=courier new]Доказательства не работают. [/COLOR][/FONT][/CENTER] <br>" +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/LXK0dYGv/giphy-1.gif[/img][/url][/CENTER]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'нет докв',
      content:
		'[Color=#DC143C][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/FONT][/CENTER]<br>' +
        "[CENTER][Color=#00FF7F][FONT=courier new]В вашей жалобе отсутствуют [Color=#FFFF00]доказательства. [/COLOR][/FONT][/CENTER] <br>" +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/LXK0dYGv/giphy-1.gif[/img][/url][/CENTER]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'доква отредактированы',
      content:
		'[Color=#DC143C][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/FONT][/CENTER]<br>' +
        "[CENTER][Color=#00FF7F][FONT=courier new]Ваши доказательства [Color=#FFFF00]отредактированы. [/COLOR][/FONT][/CENTER] <br>" +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/LXK0dYGv/giphy-1.gif[/img][/url][/CENTER]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: '3-е лицо',
      content:
		'[Color=#DC143C][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/FONT][/CENTER]<br>' +
        "[CENTER][Color=#00FF7F][FONT=courier new]Жалоба от третьего лица не принимается [Color=#FFFF00](жалоба должна быть подана участником ситуации). [/COLOR][/FONT][/CENTER] <br>" +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/LXK0dYGv/giphy-1.gif[/img][/url][/CENTER]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'долг',
      content:
		'[Color=#DC143C][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/FONT][/CENTER]<br>' +
        "[CENTER][Color=#00FF7F][FONT=courier new]Долг дается на ваш страх и риск. [Color=#FFFF00]Невозврат долга не наказуем. [/COLOR][/FONT][/CENTER] <br>" +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/LXK0dYGv/giphy-1.gif[/img][/url][/CENTER]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'не тот сервер',
      content:
		'[Color=#DC143C][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/FONT][/CENTER]<br>' +
        "[CENTER][Color=#00FF7F][FONT=courier new][Color=#FFFF00]Вы ошиблись сервером.<br> [Color=#00FF7F]Обратитесь в раздел жалоб на игроков вашего сервера. [/COLOR][/FONT][/CENTER] <br>" +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/LXK0dYGv/giphy-1.gif[/img][/url][/CENTER]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'не написал ник',
      content:
		'[Color=#DC143C][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/FONT][/CENTER]<br>' +
        "[CENTER][FONT=courier new][Color=#FFFF00]Игровой ник автора жалобы, ник игрока, на которого подается жалоба, должны быть указаны [Color=#00FF7F]в соответствии с правилами подачи жалоб, даже если эта информация присутствует на доказательствах или в тексте жалобы. [/COLOR][/FONT][/CENTER] <br>" +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/LXK0dYGv/giphy-1.gif[/img][/url][/CENTER]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'не подтвердил условия сделки',
      content:
		'[Color=#DC143C][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/FONT][/CENTER]<br>' +
        "[CENTER][Color=#00FF7F][FONT=courier new]Игрок не подтвердил условия вашей сделки. [/COLOR][/FONT][/CENTER] <br>" +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/LXK0dYGv/giphy-1.gif[/img][/url][/CENTER]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'закрыт доступ к гугл диску',
      content:
		'[Color=#DC143C][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/FONT][/CENTER]<br>' +
        "[CENTER][Color=#00FF7F][FONT=courier new]К гугл диску [Color=#FF0000]закрыт [Color=#00FF7F]доступ, пожалуйста откройте доступ, либо загрузите доказательства на фотохостинг[Color=#FFFF00](YouTube, Япикс, imgur). <br> [SPOILER=Скрин][url=https://postimages.org/][img]https://i.postimg.cc/FRpfsF2k/image.png[/img][/url][/SPOILER] [/COLOR][/FONT][/CENTER] <br>" +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/LXK0dYGv/giphy-1.gif[/img][/url][/CENTER]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'закрыт доступ к яндекс диску',
      content:
		'[Color=#DC143C][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/FONT][/CENTER]<br>' +
        "[CENTER][Color=#00FF7F][FONT=courier new]К яндекс диску [Color=#FF0000]закрыт [Color=#00FF7F]доступ, пожалуйста откройте доступ, либо загрузите доказательства на фотохостинг[Color=#FFFF00](YouTube, Япикс, imgur). <br> [SPOILER=Скрин][url=https://postimages.org/][img]https://i.postimg.cc/7YvGNcwR/image.png[/img][/url][/SPOILER] [/COLOR][/FONT][/CENTER] <br>" +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/LXK0dYGv/giphy-1.gif[/img][/url][/CENTER]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'не доказал что владелец фамы',
      content:
		'[Color=#DC143C][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/FONT][/CENTER]<br>' +
        "[CENTER][Color=#00FF7F][FONT=courier new]Нет доказательств того, что вы являетесь владельцем семьи. [/COLOR][/FONT][/CENTER] <br>" +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/LXK0dYGv/giphy-1.gif[/img][/url][/CENTER]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'не указал тайм-коды',
      content:
		'[Color=#DC143C][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/FONT][/CENTER]<br>' +
        "[CENTER][Color=#00FF7F][FONT=courier new]Тайм-коды не были указаны [Color=#FFFF00]за 24 часа, [Color=#00FF7F]соответственно жалоба получает статус - [Color=#FF0000]Отказано.[/color] [/COLOR][/FONT][/CENTER] <br>" +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/LXK0dYGv/giphy-1.gif[/img][/url][/CENTER]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'ответный дм',
      content:
		'[Color=#00FF00][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/FONT][/CENTER]<br>' +
        "[CENTER][Color=#00FF7F][FONT=courier new]На видео видно как вы первые начали стрельбу, он лишь начал обороняться [Color=#FFFF00](тоесть ответный ДМ). <br> [Color=#00FFFF]Вы будете наказаны по пункту правил:<br>[Color=#FF0000]2.19. [Color=#00FF7F]Запрещен DM (DeathMatch) — убийство или нанесение урона без веской IC причины [Color=#FF0000] | Jail 60 минут [/color] [/COLOR][/FONT][/CENTER] <br>" +
		'[CENTER][I][SIZE=4][FONT=arial][Color=#7CFC00][ICODE]Рассмотрено, закрыто.[/ICODE][/COLOR][/I][/FONT][/SIZE]',
      prefix: RASSMOTENO_PREFIX,
	  status: false,
    },
    {
      title: 'уже на рассмотрении',
      content:
		'[Color=#DC143C][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/FONT][/CENTER]<br>' +
        "[CENTER][Color=#00FF7F][FONT=courier new]Жалоба такого же содержания уже находится на рассмотрении.<br> [Color=#FFFF00]Ожидайте ответа в прошлой жалобе и не нужно дублировать ее. [/COLOR][/FONT][/CENTER] <br>" +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/LXK0dYGv/giphy-1.gif[/img][/url][/CENTER]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },


];

$(document).ready(() => {
	// Загрузка скрипта для обработки шаблонов
	$('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');

	// Добавление кнопок при загрузке страницы
    addButton('На рассмотрение 🍁', 'pin');
    addButton('Га 🐰', 'Ga');
    addButton('Одобрено ✅', 'accepted');
    addButton('Тех. Специалисту 🐣', 'Texy');
    addButton('Рассмотрено 👍', 'Rasmotreno');
    addButton('Закрыто 🏚', 'Close');
    addButton('*Быстрый ответ*', 'selectAnswer');

	// Поиск информации о теме
	const threadData = getThreadData();

	$('button#pin').click(() => pasteContent(2, threadData, true));
	$('button#Ga').click(() => pasteContent(10, threadData, true));
	$('button#accepted').click(() => editThreadData(ACCEPT_PREFIX, false));
	$('button#Texy').click(() => pasteContent(9, threadData, true));
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


(function() {
    'use strict';
const BIOUNACCEPT_PREFIX = 4;
const BIOACCEPT_PREFIX = 8;
const BIOPIN_PREFIX = 2;
const buttons2 = [
    {
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴Поооооооооооооооооооон ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
      title: 'не трогать, плохая кнопка',
      content:
        'хеееееееееее<br><br>' +
        "пон<br>" +
        'тест хы',
        prefix: BIOPIN_PREFIX,
      status: false,
    },
    {
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴биографии ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
      title: 'био одобрено',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#FFFF00]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#FFFF00][SIZE=5]Ваша РП биография получает статус - [Color=#00FF00]Одобрено.[/color] <br> Приятной игры на сервере [Color=violet]VORONEZH.[/COLOR] [/COLOR][/FONT][/CENTER] <br>",
      prefix: BIOACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'био на доработке',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#FFFF00]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#FFFF00][SIZE=5]Вам даётся 24 часа на дополнение вашей РП биографии, в противном случае она получит статус - [Color=#FF0000]Отказано.[/color] [/COLOR][/FONT][/CENTER] <br>",
      prefix: BIOPIN_PREFIX,
	  status: 123,
    },
    {
      title: 'био отказ',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#FFFF00]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#FFFF00][SIZE=5]Ваша РП биография получает статус - [Color=#FF0000]Отказано.[/color]<br>Причиной отказа послужило нарушение [URL='https://forum.blackrussia.online/index.php?threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BF%D0%BE%D0%B4%D0%B0%D1%87%D0%B8-rp-%D0%91%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8.4597417/']Правил написания RP биографий[/URL]. <br><br> Приятной игры на сервере [Color=violet]VORONEZH.[/COLOR] [/COLOR][/FONT][/CENTER] <br>",
      prefix: BIOUNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'био отказ(плагиат)',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#FFFF00]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#FFFF00][SIZE=5]Ваша РП биография получает статус - [Color=#FF0000]Отказано.[/color]<br>Причиной отказа послужило - Плагиат. <br><br> Приятной игры на сервере [Color=violet]VORONEZH.[/COLOR] [/COLOR][/FONT][/CENTER] <br>",
      prefix: BIOUNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'много  ошибок',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#FFFF00]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#FFFF00][SIZE=5]Ваша РП биография получает статус - [Color=#FF0000]Отказано.[/color]<br>Причиной отказа послужило: Слишком много ошибок. <br><br> Приятной игры на сервере [Color=violet]VORONEZH.[/COLOR] [/COLOR][/FONT][/CENTER] <br>",
      prefix: BIOUNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'био пустая',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#FFFF00]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#FFFF00][SIZE=5]Ваша РП биография получает статус - [Color=#FF0000]Отказано.[/color]<br>Причиной отказа послужило: Очень маленькая Биография. <br><br> Приятной игры на сервере [Color=violet]VORONEZH.[/COLOR] [/COLOR][/FONT][/CENTER] <br>",
      prefix: BIOUNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: '3 лицо',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#FFFF00]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#FFFF00][SIZE=5]Ваша РП биография получает статус - [Color=#FF0000]Отказано.[/color]<br>Причиной отказа послужило - Ваша биография написана от третьего лица. <br><br> Приятной игры на сервере [Color=violet]VORONEZH.[/COLOR] [/COLOR][/FONT][/CENTER] <br>",
      prefix: BIOUNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'меньше 18 лет',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#FFFF00]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#FFFF00][SIZE=5]Ваша РП биография получает статус - [Color=#FF0000]Отказано.[/color]<br>Причиной отказа послужило - Минимальный возраст для составления биографии: 18 лет. <br><br> Приятной игры на сервере [Color=violet]VORONEZH.[/COLOR] [/COLOR][/FONT][/CENTER] <br>",
      prefix: BIOUNACCEPT_PREFIX,
	  status: false,
    },
     {
      title: 'супер способности',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#FFFF00]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#FFFF00][SIZE=5]Ваша РП биография получает статус - [Color=#FF0000]Отказано.[/color]<br>Причиной отказа послужило - Запрещено приписывание своему персонажу супер-способностей. <br><br> Приятной игры на сервере [Color=violet]VORONEZH.[/COLOR] [/COLOR][/FONT][/CENTER] <br>",
      prefix: BIOUNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'заголовок не по теме',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#FFFF00]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#FFFF00][SIZE=5]Ваша РП биография получает статус - [Color=#FF0000]Отказано.[/color]<br>Причиной отказа послужило - Заголовок Role Play Биографии составлен не по форме.<br>-Заголовок создаваемой темы должен быть написан строго по данной форме: “ RolePlay биография гражданина Имя Фамилия. <br><br> Приятной игры на сервере [Color=violet]VORONEZH.[/COLOR] [/COLOR][/FONT][/CENTER] <br>",
      prefix: BIOUNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'био отказ(не дополнил)',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#FFFF00]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#FFFF00][SIZE=5]Ваша РП биография получает статус - [Color=#FF0000]Отказано.[/color]<br>Причиной отказа послужило - Не дополнили биографию в течение 24-х часов. <br><br> Приятной игры на сервере [Color=violet]VORONEZH.[/COLOR] [/COLOR][/FONT][/CENTER] <br>",
      prefix: BIOUNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'био отказ(возарст не совпадает с датой)',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#FFFF00]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#FFFF00][SIZE=5]Ваша РП биография получает статус - [Color=#FF0000]Отказано.[/color]<br>Причиной отказа послужило - возраст не совпадает с датой рождения. <br><br> Приятной игры на сервере [Color=violet]VORONEZH.[/COLOR] [/COLOR][/FONT][/CENTER] <br>",
      prefix: BIOUNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'био отказ(уже на рассмотрении)',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#FFFF00]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#FFFF00][SIZE=5]Ваша РП биография уже находится на рассмотрении, дополните ее в предыдущей теме. <br><br> Приятной игры на сервере [Color=violet]VORONEZH.[/COLOR] [/COLOR][/FONT][/CENTER] <br>",
      prefix: BIOUNACCEPT_PREFIX,
	  status: false,
    },
];

$(document).ready(() => {
	// Загрузка скрипта для обработки шаблонов
	$('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');

	// Добавление кнопок при загрузке страницы
    addButton('*Биография*', 'selectAnswer2');


	// Поиск информации о теме
	const threadData = getThreadData();


$(`button#selectAnswer2`).click(() => {
XF.alert(buttonsMarkup(buttons2), null, 'ВЫБЕРИТЕ ОТВЕТ');
buttons2.forEach((btn, id) => {
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
  `<button type="button" class="button rippleButton" id="${id}" style="margin: 3px;">${name}</button>`,
);
}

function buttonsMarkup(buttons2) {
return `<div class="select_answer">${buttons2
  .map(
	(btn, i) =>
	  `<button id="answers-${i}" class="button--primary button ` +
	  `rippleButton" style="margin:5px"><span class="button-text">${btn.title}</span></button>`,
  )
  .join('')}</div>`;
}

function pasteContent(id, data = {}, send = false) {
	const template = Handlebars.compile(buttons2[id].content);
	if ($('.fr-element.fr-view p').text() === '') $('.fr-element.fr-view p').empty();

	$('span.fr-placeholder').empty();
	$('div.fr-element.fr-view p').append(template(data));
	$('a.overlay-titleCloser').trigger('click');

	if(send == true){
		editThreadData(buttons2[id].prefix, buttons2[id].status);
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
	if(prefix == BIOUNACCEPT_PREFIX) {
		moveThread(prefix, 647);
	}
	if(prefix == BIOACCEPT_PREFIX) {
		moveThread(prefix, 645);
	}
	if(prefix == BIOPIN_PREFIX) {
		moveThread(prefix, 646);
	}
}


function moveThread(prefix, type) {
// Перемещение темы
const threadTitle = $('.p-title-value')[0].lastChild.textContent;


}

function getFormData(data) {
	const formData = new FormData();
	Object.entries(data).forEach(i => formData.append(i[0], i[1]));
	return formData;
  }
})();


(function() {
    'use strict';
const SITAUNACCEPT_PREFIX = 4;
const SITAACCEPT_PREFIX = 8;
const SITAPIN_PREFIX = 2;
const buttons3 = [
    {
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴Поооооооооооооооооооон ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
      title: 'не трогать, плохая кнопка',
      content:
        'хеееееееееее<br><br>' +
        "пон<br>" +
        'тест хы',
        prefix: SITAACCEPT_PREFIX,
      status: false,
    },
    {
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴ситуации ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
      title: 'сита одобрена',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#FFFF00]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#FFFF00][SIZE=5]Ваша РП ситуация получает статус - [Color=#00FF00]Одобрено.[/color] <br> Приятной игры на сервере [Color=#DC143C]VORONEZH.[/COLOR] [/COLOR][/FONT][/CENTER] <br>",
      prefix: SITAACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'сита на доработке',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#FFFF00]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#FFFF00][SIZE=5]Вам даётся 24 часа на дополнение вашей РП ситуации, в противном случае она получит статус - [Color=#FF0000]Отказано.[/color] [/COLOR][/FONT][/CENTER] <br>",
      prefix: SITAPIN_PREFIX,
	  status: 123,
    },
    {
      title: 'сита отказ',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#FFFF00]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#FFFF00][SIZE=5]Ваша РП ситуация получает статус - [Color=#FF0000]Отказано[/color] <br> Приятной игры на сервере [Color=#DC143C]VORONEZH.[/COLOR] [/COLOR][/FONT][/CENTER] <br>",
      prefix: SITAUNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'сита одобрена+денег не дам',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#FFFF00]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#FFFF00][SIZE=5]Ваша РП ситуация получает статус - [Color=#00FF00]Одобрено.[/color] <br> [QUOTE]Так же хочу отметить, что игровую валюту вы не получите за ограбление чего-либо по РП.[/QUOTE] <br> Приятной игры на сервере [Color=#DC143C]VORONEZH.[/COLOR] [/COLOR][/FONT][/CENTER] <br>",
      prefix: SITAACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'сита отказ+денег не дам',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#FFFF00]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#FFFF00][SIZE=5]Ваша РП ситуация получает статус - [Color=#FF0000]Отказано[/color] <br> [QUOTE]Так же хочу отметить, что игровую валюту вы не получите за ограбление чего-либо по РП.[/QUOTE] <br> Приятной игры на сервере [Color=#DC143C]VORONEZH.[/COLOR] [/COLOR][/FONT][/CENTER] <br>",
      prefix: SITAUNACCEPT_PREFIX,
	  status: false,
    },
];

$(document).ready(() => {
	// Загрузка скрипта для обработки шаблонов
	$('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');

	// Добавление кнопок при загрузке страницы
    addButton('*РП ситуации*', 'selectAnswer3');


	// Поиск информации о теме
	const threadData = getThreadData();


$(`button#selectAnswer3`).click(() => {
XF.alert(buttonsMarkup(buttons3), null, 'ВЫБЕРИТЕ ОТВЕТ');
buttons3.forEach((btn, id) => {
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
  `<button type="button" class="button rippleButton" id="${id}" style="margin: 3px;">${name}</button>`,
);
}

function buttonsMarkup(buttons3) {
return `<div class="select_answer">${buttons3
  .map(
	(btn, i) =>
	  `<button id="answers-${i}" class="button--primary button ` +
	  `rippleButton" style="margin:5px"><span class="button-text">${btn.title}</span></button>`,
  )
  .join('')}</div>`;
}

function pasteContent(id, data = {}, send = false) {
	const template = Handlebars.compile(buttons3[id].content);
	if ($('.fr-element.fr-view p').text() === '') $('.fr-element.fr-view p').empty();

	$('span.fr-placeholder').empty();
	$('div.fr-element.fr-view p').append(template(data));
	$('a.overlay-titleCloser').trigger('click');

	if(send == true){
		editThreadData(buttons3[id].prefix, buttons3[id].status);
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
	if(prefix == SITAPIN_PREFIX) {
		moveThread(prefix, 643);
	}
	if(prefix == SITAACCEPT_PREFIX) {
		moveThread(prefix, 642);
	}
	if(prefix == SITAUNACCEPT_PREFIX) {
		moveThread(prefix, 644);
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


(function() {
    'use strict';
const NEOFUNACCEPT_PREFIX = 4;
const NEOFACCEPT_PREFIX = 8;
const NEOFPIN_PREFIX = 2;
const buttons4 = [
    {
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴Поооооооооооооооооооон ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
      title: 'не трогать, плохая кнопка',
      content:
        'хеееееееееее<br><br>' +
        "пон<br>" +
        'тест хы',
        prefix: NEOFPIN_PREFIX,
      status: false,
    },
    {
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴Неофициальные RP организации ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
      title: 'неоф орг одобрена',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#FFFF00]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#FFFF00][SIZE=5]Ваша Неофициальная RP организация получает статус - [Color=#00FF00]Одобрено.[/color] <br> Приятной игры на сервере [Color=#DC143C]VORONEZH.[/COLOR] [/COLOR][/FONT][/CENTER] <br>",
      prefix: NEOFACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'неоф на доработке',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#FFFF00]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#FFFF00][SIZE=5]Вам даётся 24 часа на дополнение вашей неофициальной RP организации, в противном случае она получит статус - [Color=#FF0000]Отказано.[/color] [/COLOR][/FONT][/CENTER] <br>",
      prefix: NEOFPIN_PREFIX,
	  status: 123,
    },
    {
      title: 'неоф орг отказ',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#FFFF00]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#FFFF00][SIZE=5]Ваша Неофициальная RP организация получает статус - [Color=#FF0000]Отказано[/color] <br> Приятной игры на сервере [Color=#DC143C]VORONEZH.[/COLOR] [/COLOR][/FONT][/CENTER] <br>",
      prefix: NEOFUNACCEPT_PREFIX,
	  status: false,
    },
];

$(document).ready(() => {
	// Загрузка скрипта для обработки шаблонов
	$('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');

	// Добавление кнопок при загрузке страницы
    addButton('*Неофициальные орг*', 'selectAnswer4');



	// Поиск информации о теме
	const threadData = getThreadData();




$(`button#selectAnswer4`).click(() => {
XF.alert(buttonsMarkup(buttons4), null, 'ВЫБЕРИТЕ ОТВЕТ');
buttons4.forEach((btn, id) => {
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
  `<button type="button" class="button rippleButton" id="${id}" style="margin: 3px;">${name}</button>`,
);
}

function buttonsMarkup(buttons4) {
return `<div class="select_answer">${buttons4
  .map(
	(btn, i) =>
	  `<button id="answers-${i}" class="button--primary button ` +
	  `rippleButton" style="margin:5px"><span class="button-text">${btn.title}</span></button>`,
  )
  .join('')}</div>`;
}

function pasteContent(id, data = {}, send = false) {
	const template = Handlebars.compile(buttons4[id].content);
	if ($('.fr-element.fr-view p').text() === '') $('.fr-element.fr-view p').empty();

	$('span.fr-placeholder').empty();
	$('div.fr-element.fr-view p').append(template(data));
	$('a.overlay-titleCloser').trigger('click');

	if(send == true){
		editThreadData(buttons4[id].prefix, buttons4[id].status);
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
	if(prefix == NEOFACCEPT_PREFIX) {
		moveThread(prefix, 635);
	}
	if(prefix == NEOFPIN_PREFIX) {
		moveThread(prefix, 636);
	}
	if(prefix == NEOFUNACCEPT_PREFIX) {
		moveThread(prefix, 637);
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
