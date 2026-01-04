// ==UserScript==
// @name         Кураторы форума Smolensk
// @namespace    https://forum.blackrussia.online/
// @version      5.4
// @description  Для Кураторов форума
// @author       Asya Kashtanova
// @match        https://forum.blackrussia.online/threads/*
// @include      https://forum.blackrussia.online/threads/
// @grant        none
// @license      MIT
// @icon https://icons.iconarchive.com/icons/graphicloads/flat-finance/128/certificate-icon.png
// @downloadURL https://update.greasyfork.org/scripts/485758/%D0%9A%D1%83%D1%80%D0%B0%D1%82%D0%BE%D1%80%D1%8B%20%D1%84%D0%BE%D1%80%D1%83%D0%BC%D0%B0%20Smolensk.user.js
// @updateURL https://update.greasyfork.org/scripts/485758/%D0%9A%D1%83%D1%80%D0%B0%D1%82%D0%BE%D1%80%D1%8B%20%D1%84%D0%BE%D1%80%D1%83%D0%BC%D0%B0%20Smolensk.meta.js
// ==/UserScript==
 
(function () {
	'use strict';
	const UNACCEPT_PREFIX = 4; // префикс отказано
	const ACCEPT_PREFIX = 8; // префикс одобрено
	const PIN_PREFIX = 2; //  префикс закрепить
	const COMMAND_PREFIX = 10; // команде проекта
	const WATCHED_PREFIX = 9; // рассмотрено
                const CLOSE_PREFIX = 7; // префикс закрыто
	const TEH_PREFIX = 13; //  техническому специалисту
	const buttons = [
	{
		title: 'Приветствие',
		content:
'[CENTER][url=https://postimg.cc/18bVwz6h][img]https://i.postimg.cc/zfGwmbGB/image.png[/img][/url]<br>' +
'[SIZE=4][FONT=Times New Roman][COLOR=#db7093][CENTER]{{ greeting }}, уважаемый(ая) {{ user.mention }}![/COLOR][/CENTER]<br>'
	},
	{
      title: '-----------------------------------------------------------Отказ/одобрение жалобы-----------------------------------------------------------',
	},
       {
          title: 'Форма подачи жалобы',
          content:
           '[CENTER][url=https://postimg.cc/18bVwz6h][img]https://i.postimg.cc/zfGwmbGB/image.png[/img][/url]<br>' +
'[SIZE=4][FONT=Times New Roman][COLOR=#db7093][CENTER]{{ greeting }}, уважаемый(ая) {{ user.mention }}![/COLOR][/CENTER]<br>'+
		"[CENTER]Пожалуйста, убедительная просьба, ознакомится с формой подачи жалобы на игроков.[/CENTER]<br><br>" +
		'[CENTER][COLOR=#ff0000]Отказано, закрыто.[/COLOR][/CENTER][/FONT][/SIZE]',
     prefix: CLOSE_PREFIX,
	  status: false,
        },
        {
          title: 'Название жалобы не по форме',
   content:
            '[CENTER][url=https://postimg.cc/18bVwz6h][img]https://i.postimg.cc/zfGwmbGB/image.png[/img][/url]<br>' +
'[SIZE=4][FONT=Times New Roman][COLOR=#db7093][CENTER]{{ greeting }}, уважаемый(ая) {{ user.mention }}![/COLOR][/CENTER]<br>' +
	"[CENTER]Название жалобы составлено не по форме.<br>Внимательно прочитайте правила составления жалобы[/CENTER]<br>" +
	'[CENTER][COLOR=#ff0000]Отказано, закрыто.[/COLOR][/CENTER][/FONT][/SIZE]',
	  prefix: CLOSE_PREFIX,
	  status: false,
        },
        {          title: 'неполный фрапс',
   content:
            '[CENTER][url=https://postimg.cc/18bVwz6h][img]https://i.postimg.cc/zfGwmbGB/image.png[/img][/url]<br>' +
'[SIZE=4][FONT=Times New Roman][COLOR=#db7093][CENTER]{{ greeting }}, уважаемый(ая) {{ user.mention }}![/COLOR][/CENTER]<br>' +
	"[CENTER]Ваш фрапс неполный, загрузите его на youtube.[/CENTER]<br>" +
	'[CENTER][COLOR=#ff0000]Отказано, закрыто.[/COLOR][/CENTER][/FONT][/SIZE]',
	  prefix: CLOSE_PREFIX,
	  status: false,
        },
        {
          title: 'Нет доказательств',
   content:
'[CENTER][url=https://postimg.cc/18bVwz6h][img]https://i.postimg.cc/zfGwmbGB/image.png[/img][/url]<br>' +
'[SIZE=4][FONT=Times New Roman][COLOR=#db7093][CENTER]{{ greeting }}, уважаемый(ая) {{ user.mention }}![/COLOR][/CENTER]<br>' +
       "[CENTER]В вашей жалобе нет доказательств. [/CENTER]<br><br>" +
		'[CENTER][COLOR=#ff0000]Отказано, закрыто.[/COLOR][/CENTER][/FONT][/SIZE]',
     prefix: UNACCEPT_PREFIX,
	  status: false,
        },
        {
          title: 'Не хватает /time',
   content:
'[CENTER][url=https://postimg.cc/18bVwz6h][img]https://i.postimg.cc/zfGwmbGB/image.png[/img][/url]<br>' +
'[SIZE=4][FONT=Times New Roman][COLOR=#db7093][CENTER]{{ greeting }}, уважаемый(ая) {{ user.mention }}![/COLOR][/CENTER]<br>' +
	"[CENTER]На доказательствах отсутствует /time.[/CENTER]<br><br>" +
	'[CENTER][COLOR=#ff0000]Отказано, закрыто.[/COLOR][/CENTER][/FONT][/SIZE]',
     prefix: UNACCEPT_PREFIX,
	  status: false,
        },
        {
          title: 'Недостаточно доказательств',
   content:
'[CENTER][url=https://postimg.cc/18bVwz6h][img]https://i.postimg.cc/zfGwmbGB/image.png[/img][/url]<br>' +
'[SIZE=4][FONT=Times New Roman][COLOR=#db7093][CENTER]{{ greeting }}, уважаемый(ая) {{ user.mention }}![/COLOR][/CENTER]<br>' +
       "[CENTER]В вашей жалобе недостаточно доказательств. [/CENTER]<br><br>" +
	'[CENTER][COLOR=#ff0000]Отказано, закрыто.[/COLOR][/CENTER][/FONT][/SIZE]',
       prefix: UNACCEPT_PREFIX,
	  status: false,
        },
{
              title: 'Дублирование',
content:
'[CENTER][url=https://postimg.cc/18bVwz6h][img]https://i.postimg.cc/zfGwmbGB/image.png[/img][/url]<br>' +
'[SIZE=4][FONT=Times New Roman][COLOR=#db7093][CENTER]{{ greeting }}, уважаемый(ая) {{ user.mention }}![/COLOR][/CENTER]<br>' +
	"[CENTER]Дублирование темы.<br>Напоминаем, при 3 дублированиях – форумный аккаунт будет заблокирован. [/CENTER]<br><br>" +
	'[CENTER][COLOR=#ff0000]Отказано, закрыто.[/COLOR][/CENTER][/FONT][/SIZE]',
     prefix: CLOSE_PREFIX,
	  status: false,
        },
        {
          title: 'Не в тот раздел',
    content:
'[CENTER][url=https://postimg.cc/18bVwz6h][img]https://i.postimg.cc/zfGwmbGB/image.png[/img][/url]<br>' +
'[SIZE=4][FONT=Times New Roman][COLOR=#db7093][CENTER]{{ greeting }}, уважаемый(ая) {{ user.mention }}![/COLOR][/CENTER]<br>' +
	"[CENTER]Вы попали не в тот раздел, подайте жалобу в правильный раздел.[/CENTER]<br><br>" +
	'[CENTER][COLOR=#ff0000]Отказано, закрыто.[/COLOR][/CENTER][/FONT][/SIZE]',
     prefix: UNACCEPT_PREFIX,
	  status: false,
        },
        {
          title: 'Ник не соответствует',
content:
'[CENTER][url=https://postimg.cc/18bVwz6h][img]https://i.postimg.cc/zfGwmbGB/image.png[/img][/url]<br>' +
'[SIZE=4][FONT=Times New Roman][COLOR=#db7093][CENTER]{{ greeting }}, уважаемый(ая) {{ user.mention }}![/COLOR][/CENTER]<br>' +
	"[CENTER] Nick_Name игрока не соответствует тому, который предоставлен в ваших доказательствах.[/CENTER]<br><br>" +
	'[CENTER][COLOR=#ff0000]Отказано, закрыто.[/COLOR][/CENTER][/FONT][/SIZE]',
     prefix: UNACCEPT_PREFIX,
	  status: false,
        },
        {
          title: 'Нарушений нет',
content:
'[CENTER][url=https://postimg.cc/18bVwz6h][img]https://i.postimg.cc/zfGwmbGB/image.png[/img][/url]<br>' +
'[SIZE=4][FONT=Times New Roman][COLOR=#db7093][CENTER]{{ greeting }}, уважаемый(ая) {{ user.mention }}![/COLOR][/CENTER]<br>'+
"[CENTER]Не вижу нарушений со стороны данного игрока.[/CENTER]<br><br>" +
'[CENTER][COLOR=#ff0000]Отказано, закрыто.[/COLOR][/CENTER][/FONT][/SIZE]',
     prefix: UNACCEPT_PREFIX,
	  status: false,
        },
        {
          title: 'Док-ва более 3-х минут',
   content:
'[CENTER][url=https://postimg.cc/18bVwz6h][img]https://i.postimg.cc/zfGwmbGB/image.png[/img][/url]<br>' +
'[SIZE=4][FONT=Times New Roman][COLOR=#db7093][CENTER]{{ greeting }}, уважаемый(ая) {{ user.mention }}![/COLOR][/CENTER]<br>' +
"[CENTER]Ваши доказательства длятся более 3-ëх минут. Нужны таймкоды.[/CENTER]<br><br>" +
	'[CENTER][COLOR=#ff0000]Отказано, закрыто.[/COLOR][/CENTER][/FONT][/SIZE]',
     prefix: UNACCEPT_PREFIX,
	  status: false,
        },
          {
          title: 'Док-ва в соц.сети',
        content:
'[CENTER][url=https://postimg.cc/18bVwz6h][img]https://i.postimg.cc/zfGwmbGB/image.png[/img][/url]<br>' +
'[SIZE=4][FONT=Times New Roman][COLOR=#db7093][CENTER]{{ greeting }}, уважаемый(ая) {{ user.mention }}![/COLOR][/CENTER]<br>'+
   "[CENTER]Доказательства должны быть загружены на фото/видео хостинги (YouTube, Япикс, imgur). [/CENTER]<br><br>" +
	'[CENTER][COLOR=#ff0000]Отказано, закрыто.[/COLOR][/CENTER][/FONT][/SIZE]',
     prefix: UNACCEPT_PREFIX,
	  status: false,
      },
{
          title: 'Без условий',
   content:
'[CENTER][url=https://postimg.cc/18bVwz6h][img]https://i.postimg.cc/zfGwmbGB/image.png[/img][/url]<br>' +
'[SIZE=4][FONT=Times New Roman][COLOR=#db7093][CENTER]{{ greeting }}, уважаемый(ая) {{ user.mention }}![/COLOR][/CENTER]<br>' +
	"[CENTER]В ваших доказательствах не было оговорено условий сделки. [/CENTER]<br><br>" +
	'[CENTER][COLOR=#ff0000]Отказано, закрыто.[/COLOR][/CENTER][/FONT][/SIZE]',
     prefix: UNACCEPT_PREFIX,
	  status: false,
        },
        {
          title: 'Док-ва обрываются',
  content:		'[CENTER][url=https://postimg.cc/18bVwz6h][img]https://i.postimg.cc/zfGwmbGB/image.png[/img][/url]<br>' +
'[SIZE=4][FONT=Times New Roman][COLOR=#db7093][CENTER]{{ greeting }}, уважаемый(ая) {{ user.mention }}![/COLOR][/CENTER]<br>' +
	"[CENTER]Ваши доказательства обрываются, подайте жалобу с загруженными доказательствами на YouTube, либо же другой хостинг.[/CENTER]<br><br>" +
	'[CENTER][COLOR=#ff0000]Отказано, закрыто.[/COLOR][/CENTER][/FONT][/SIZE]',
     prefix: UNACCEPT_PREFIX,
	  status: false,
        },
        {
	  title: 'Фотошоп/Монтаж',
 content:		'[CENTER][url=https://postimg.cc/18bVwz6h][img]https://i.postimg.cc/zfGwmbGB/image.png[/img][/url]<br>' +
'[SIZE=4][FONT=Times New Roman][COLOR=#db7093][CENTER]{{ greeting }}, уважаемый(ая) {{ user.mention }}![/COLOR][/CENTER]<br>' +
	"[CENTER]Ваши доказательства были подвержены фотошопу, монтажу. Загрузите доказательства первоначального вида.[/CENTER]<br><br>" +
	'[CENTER][COLOR=#ff0000]Отказано, закрыто.[/COLOR][/CENTER][/FONT][/SIZE]',
     prefix: UNACCEPT_PREFIX,
	  status: false,
        },
{
	  title: 'Системные отыгровки',
 content:		'[CENTER][url=https://postimg.cc/18bVwz6h][img]https://i.postimg.cc/zfGwmbGB/image.png[/img][/url]<br>' +
'[SIZE=4][FONT=Times New Roman][COLOR=#db7093][CENTER]{{ greeting }}, уважаемый(ая) {{ user.mention }}![/COLOR][/CENTER]<br>' +
"[CENTER]Системных отыгровок достаточно при задержании.[/CENTER]<br><br>" +
	'[CENTER][COLOR=#ff0000]Отказано, закрыто.[/COLOR][/CENTER][/FONT][/SIZE]',
     prefix: UNACCEPT_PREFIX,
	  status: false,
      },
        {
	  title: 'Жалоба от 3-го лица',
 content:
'[CENTER][url=https://postimg.cc/18bVwz6h][img]https://i.postimg.cc/zfGwmbGB/image.png[/img][/url]<br>' +
'[SIZE=4][FONT=Times New Roman][COLOR=#db7093][CENTER]{{ greeting }}, уважаемый(ая) {{ user.mention }}![/COLOR][/CENTER]<br>' +
"[CENTER]Ваша жалоба составлена от третьего лица. [/CENTER]<br><br>" +
'[CENTER][COLOR=#ff0000]Отказано, закрыто.[/COLOR][/CENTER][/FONT][/SIZE]',
     prefix: UNACCEPT_PREFIX,
	  status: false,
        },
       {
	  title: 'нужен фрапс',
 content:
'[CENTER][url=https://postimg.cc/18bVwz6h][img]https://i.postimg.cc/zfGwmbGB/image.png[/img][/url]<br>' +
'[SIZE=4][FONT=Times New Roman][COLOR=#db7093][CENTER]{{ greeting }}, уважаемый(ая) {{ user.mention }}![/COLOR][/CENTER]<br>' +
"[CENTER]В таких случаях нужен фрапс.[/CENTER]<br><br>" +
'[CENTER][COLOR=#ff0000]Отказано, закрыто.[/COLOR][/CENTER][/FONT][/SIZE]',
     prefix: UNACCEPT_PREFIX,
	  status: false,
        },
       {
	  title: 'более 72 часов',
 content:
'[CENTER][url=https://postimg.cc/18bVwz6h][img]https://i.postimg.cc/zfGwmbGB/image.png[/img][/url]<br>' +
'[SIZE=4][FONT=Times New Roman][COLOR=#db7093][CENTER]{{ greeting }}, уважаемый(ая) {{ user.mention }}![/COLOR][/CENTER]<br>' +
"[CENTER]С момента нарушения прошло более 72 часов.[/CENTER]<br><br>" +
'[CENTER][COLOR=#ff0000]Отказано, закрыто.[/COLOR][/CENTER][/FONT][/SIZE]',
     prefix: UNACCEPT_PREFIX,
	  status: false,
        },
       {
title: 'будет наказан',
 content:
'[CENTER][url=https://postimg.cc/18bVwz6h][img]https://i.postimg.cc/zfGwmbGB/image.png[/img][/url]<br>' +
'[SIZE=4][FONT=Times New Roman][COLOR=#db7093][CENTER]{{ greeting }}, уважаемый(ая) {{ user.mention }}![/COLOR][/CENTER]<br>' +
"[CENTER]Игрок будет наказан.[/CENTER]<br><br>" +
'[CENTER][COLOR=#38ff4c]Одобрено, закрыто.[/COLOR][/CENTER][/FONT][/SIZE]',
             prefix: ACCEPT_PREFIX,
	  status: false,
        },
        {
      title: '-----------------------------------------------------------На рассмотрение-----------------------------------------------------------',
        },
        {
       title: 'Отправить на рассмотрение',
 content:		'[CENTER][url=https://postimg.cc/18bVwz6h][img]https://i.postimg.cc/zfGwmbGB/image.png[/img][/url]<br>' +
'[SIZE=4][FONT=Times New Roman][COLOR=#db7093][CENTER]{{ greeting }}, уважаемый(ая) {{ user.mention }}![/COLOR][/CENTER]<br>' +
"[CENTER]Ваша жалоба взята на рассмотрение. Пожалуйста, ожидайте ответа.[/CENTER]<br><br>" +
'[CENTER][COLOR=#ffd838]На рассмотрении…[/COLOR][/CENTER][/FONT][/SIZE]',
	  prefix: PIN_PREFIX,
	  status: true,
        },
        {
	  title: 'Рассмотрение для теха',
 content:
'[CENTER][url=https://postimg.cc/18bVwz6h][img]https://i.postimg.cc/zfGwmbGB/image.png[/img][/url]<br>' +
'[SIZE=4][FONT=Times New Roman][COLOR=#db7093][CENTER]{{ greeting }}, уважаемый(ая) {{ user.mention }}![/COLOR][/CENTER]<br>' +
	"[CENTER]Жалоба передана Техническому Специалисту. Ожидайте и не создавайте копий этой жалобы.[/CENTER]<br><br>" +
	'[CENTER][COLOR=#ffd838]На рассмотрении…[/COLOR][/CENTER][/FONT][/SIZE]',
       prefix: TEH_PREFIX,
	  status: true,
        },
        {
	  title: '-----------------------------------------------------------Правила РП процесса-----------------------------------------------------------',
        },
        {
	  title: 'нрп поведение',
	  content:
'[CENTER][url=https://postimg.cc/18bVwz6h][img]https://i.postimg.cc/zfGwmbGB/image.png[/img][/url]<br>' +
'[SIZE=4][FONT=Times New Roman][COLOR=#db7093][CENTER]{{ greeting }}, уважаемый(ая) {{ user.mention }}![/COLOR][/CENTER]<br>' +
"[CENTER]Игрок будет наказан по следующему пункту правил:[/CENTER]<br><br>" +
	"[CENTER][COLOR=#ff0000]2.01.[/COLOR] Запрещено поведение, нарушающее нормы процессов Role Play режима игры [COLOR=#ff0000] | Jail 30 минут [/COLOR] [/CENTER]<br><br>" +
       	'[CENTER][COLOR=#38ff4c]Одобрено, закрыто.[/COLOR][/CENTER][/FONT][/SIZE]',
       prefix: ACCEPT_PREFIX,
	  status: false,
        },
         {
	  title: 'nrp drive',
 content:		'[CENTER][url=https://postimg.cc/18bVwz6h][img]https://i.postimg.cc/zfGwmbGB/image.png[/img][/url]<br>' +
'[SIZE=4][FONT=Times New Roman][COLOR=#db7093][CENTER]{{ greeting }}, уважаемый(ая) {{ user.mention }}![/COLOR][/CENTER]<br>' +
"[CENTER]Игрок будет наказан по следующему пункту правил:[/CENTER]<br><br>" +
"[CENTER][COLOR=#ff0000]2.03.[/COLOR] Запрещен NonRP Drive — вождение любого транспортного средства в невозможных для него условиях, а также вождение в неправдоподобной манере [COLOR=#ff0000] | Jail 30 минут. [/COLOR] [/CENTER]<br><br>" +
	'[CENTER][COLOR=#38ff4c]Одобрено, закрыто.[/COLOR][/CENTER][/FONT][/SIZE]',
             prefix: ACCEPT_PREFIX,
	  status: false,
        },
        {
	  title: 'помеха',
 content:
'[CENTER][url=https://postimg.cc/18bVwz6h][img]https://i.postimg.cc/zfGwmbGB/image.png[/img][/url]<br>' +
'[SIZE=4][FONT=Times New Roman][COLOR=#db7093][CENTER]{{ greeting }}, уважаемый(ая) {{ user.mention }}![/COLOR][/CENTER]<br>' +
"[CENTER]Игрок будет наказан по следующему пункту правил:[/CENTER]<br><br>" +
	"[CENTER][COLOR=#ff0000]2.04.[/COLOR]Запрещены любые действия способные привести к помехам в игровом процессе, а также выполнению работ, если они этого не предусматривают и если эти действия выходят за рамки игрового процесса данной работы. [COLOR=#ff0000] | Ban 10 дней / Обнуление аккаунта (при повторном нарушении) [/COLOR][/CENTER]<br><br>" +
       	        	'[CENTER][COLOR=#38ff4c]Одобрено, закрыто.[/COLOR][/CENTER][/FONT][/SIZE]',
       prefix: ACCEPT_PREFIX,
	  status: false,
        },
        {
	  title: 'аморал',
 content:
'[CENTER][url=https://postimg.cc/18bVwz6h][img]https://i.postimg.cc/zfGwmbGB/image.png[/img][/url]<br>' +
'[SIZE=4][FONT=Times New Roman][COLOR=#db7093][CENTER]{{ greeting }}, уважаемый(ая) {{ user.mention }}![/COLOR][/CENTER]<br>' +
"[CENTER]Игрок будет наказан по следующему пункту правил:[/CENTER]<br><br>" +
"[CENTER][COLOR=#ff0000]2.08. [/COLOR] Запрещена любая форма аморальных действий сексуального характера в сторону игроков [COLOR=#ff0000] | Jail 30 минут / Warn[/COLOR][/CENTER]<br><br>" +
              	'[CENTER][COLOR=#38ff4c]Одобрено, закрыто.[/COLOR][/CENTER][/FONT][/SIZE]',
       prefix: ACCEPT_PREFIX,
	  status: false,
        },
{
	  title: 'дб',
 content:
'[CENTER][url=https://postimg.cc/18bVwz6h][img]https://i.postimg.cc/zfGwmbGB/image.png[/img][/url]<br>' +
'[SIZE=4][FONT=Times New Roman][COLOR=#db7093][CENTER]{{ greeting }}, уважаемый(ая) {{ user.mention }}![/COLOR][/CENTER]<br>' +
"[CENTER]Игрок будет наказан по следующему пункту правил:[/CENTER]<br><br>" +
	"[CENTER][COLOR=#ff0000]2.13.[/COLOR]Запрещен DB (DriveBy) — намеренное убийство / нанесение урона без веской IC причины на любом виде транспорта [COLOR=#ff0000] | Jail 60 минут [/COLOR][/CENTER]<br><br>" +
       	        	'[CENTER][COLOR=#38ff4c]Одобрено, закрыто.[/COLOR][/CENTER][/FONT][/SIZE]',
       prefix: ACCEPT_PREFIX,
	  status: false,
        },
{
	  title: 'рк',
 content:
'[CENTER][url=https://postimg.cc/18bVwz6h][img]https://i.postimg.cc/zfGwmbGB/image.png[/img][/url]<br>' +
'[SIZE=4][FONT=Times New Roman][COLOR=#db7093][CENTER]{{ greeting }}, уважаемый(ая) {{ user.mention }}![/COLOR][/CENTER]<br>' +
"[CENTER]Игрок будет наказан по следующему пункту правил:[/CENTER]<br><br>" +
	"[CENTER][COLOR=#ff0000]2.14.[/COLOR]Запрещен RK (Revenge Kill) — убийство игрока с целью мести, возвращение на место смерти в течение 15-ти минут, а также использование в дальнейшем информации, которая привела Вас к смерти [COLOR=#ff0000] | Jail 30 минут[/COLOR][/CENTER]<br><br>" +
       	        	'[CENTER][COLOR=#38ff4c]Одобрено, закрыто.[/COLOR][/CENTER][/FONT][/SIZE]',
       prefix: ACCEPT_PREFIX,
	  status: false,
        },
{
	  title: 'тк',
 content:
'[CENTER][url=https://postimg.cc/18bVwz6h][img]https://i.postimg.cc/zfGwmbGB/image.png[/img][/url]<br>' +
'[SIZE=4][FONT=Times New Roman][COLOR=#db7093][CENTER]{{ greeting }}, уважаемый(ая) {{ user.mention }}![/COLOR][/CENTER]<br>' +
"[CENTER]Игрок будет наказан по следующему пункту правил:[/CENTER]<br><br>" +
	"[CENTER][COLOR=#ff0000]2.15.[/COLOR]Запрещен TK (Team Kill) — убийство члена своей или союзной фракции, организации без наличия какой-либо IC причины [COLOR=#ff0000] | Jail 60 минут / Warn (за два и более убийства)[/COLOR][/CENTER]<br><br>" +
     '[CENTER][COLOR=#38ff4c]Одобрено, закрыто.[/COLOR][/CENTER][/FONT][/SIZE]',
       prefix: ACCEPT_PREFIX,
	  status: false,
        },
        {
	  title: 'ск',
 content:
'[CENTER][url=https://postimg.cc/18bVwz6h][img]https://i.postimg.cc/zfGwmbGB/image.png[/img][/url]<br>' +
'[SIZE=4][FONT=Times New Roman][COLOR=#db7093][CENTER]{{ greeting }}, уважаемый(ая) {{ user.mention }}![/COLOR][/CENTER]<br>' +
"[CENTER]Игрок будет наказан по следующему пункту правил:[/CENTER]<br><br>" +
	"[CENTER][COLOR=#ff0000]2.16. [/COLOR]Запрещен SK (Spawn Kill) — убийство или нанесение урона на титульной территории любой фракции / организации, на месте появления игрока, а также на выходе из закрытых интерьеров и около них [COLOR=#ff0000] | Jail 60 минут / Warn (за два и более убийства)[/COLOR][/CENTER]<br><br>" +
      '[CENTER][COLOR=#38ff4c]Одобрено, закрыто.[/COLOR][/CENTER][/FONT][/SIZE]',
       prefix: ACCEPT_PREFIX,
	  status: false,
        },
        {
	  title: 'пг',
 content:
'[CENTER][url=https://postimg.cc/18bVwz6h][img]https://i.postimg.cc/zfGwmbGB/image.png[/img][/url]<br>' +
'[SIZE=4][FONT=Times New Roman][COLOR=#db7093][CENTER]{{ greeting }}, уважаемый(ая) {{ user.mention }}![/COLOR][/CENTER]<br>' +
"[CENTER]Игрок будет наказан по следующему пункту правил:[/CENTER]<br><br>" +
	"[CENTER][COLOR=#ff0000]2.17.[/COLOR] Запрещен PG (PowerGaming) — присвоение свойств персонажу, не соответствующих реальности, отсутствие страха за свою жизнь [COLOR=#ff0000] | Jail 30 минут [/COLOR][/CENTER]<br><br>" +
       	        	'[CENTER][COLOR=#38ff4c]Одобрено, закрыто.[/COLOR][/CENTER][/FONT][/SIZE]',
       prefix: ACCEPT_PREFIX,
	  status: false,
        },
        {
	  title: 'дм',
 content:
'[CENTER][url=https://postimg.cc/18bVwz6h][img]https://i.postimg.cc/zfGwmbGB/image.png[/img][/url]<br>' +
'[SIZE=4][FONT=Times New Roman][COLOR=#db7093][CENTER]{{ greeting }}, уважаемый(ая) {{ user.mention }}![/COLOR][/CENTER]<br>' +
"[CENTER]Игрок будет наказан по следующему пункту правил:[/CENTER]<br><br>" +
	"[CENTER]2.19. Запрещен DM (DeathMatch) — убийство или нанесение урона без веской IC причины [COLOR=#ff0000] | Jail 60 минут[/COLOR][/CENTER]<br><br>" +
       	        	'[CENTER][COLOR=#38ff4c]Одобрено, закрыто.[/COLOR][/CENTER][/FONT][/SIZE]',
       prefix: ACCEPT_PREFIX,
	  status: false,
        },
        {
	  title: 'масс дм',
 content:
'[CENTER][url=https://postimg.cc/18bVwz6h][img]https://i.postimg.cc/zfGwmbGB/image.png[/img][/url]<br>' +
'[SIZE=4][FONT=Times New Roman][COLOR=#db7093][CENTER]{{ greeting }}, уважаемый(ая) {{ user.mention }}![/COLOR][/CENTER]<br>' +
"[CENTER]Игрок будет наказан по следующему пункту правил:[/CENTER]<br><br>" +
	"[CENTER][COLOR=#ff0000]2.20. [/COLOR]Запрещен Mass DM (Mass DeathMatch) — убийство или нанесение урона без веской IC причины трем игрокам и более [COLOR=#ff0000] | Warn / Ban 3 - 7 дней[/COLOR][/CENTER]<br><br>" +
       	        	'[CENTER][COLOR=#38ff4c]Одобрено, закрыто.[/COLOR][/CENTER][/FONT][/SIZE]',
       prefix: ACCEPT_PREFIX,
	  status: false,
        },
        {
	  title: 'епп',
 content:
'[CENTER][url=https://postimg.cc/18bVwz6h][img]https://i.postimg.cc/zfGwmbGB/image.png[/img][/url]<br>' +
'[SIZE=4][FONT=Times New Roman][COLOR=#db7093][CENTER]{{ greeting }}, уважаемый(ая) {{ user.mention }}![/COLOR][/CENTER]<br>' +
"[CENTER]Игрок будет наказан по следующему пункту правил:[/CENTER]<br><br>" +
	"[CENTER][COLOR=#ff0000]2.46.[/COLOR] Запрещено ездить по полям на любом транспорте [COLOR=#ff0000] | Jail 30 минут[/COLOR][/CENTER]<br><br>" +
       	        	'[CENTER][COLOR=#38ff4c]Одобрено, закрыто.[/COLOR][/CENTER][/FONT][/SIZE]',
       prefix: ACCEPT_PREFIX,
	  status: false,
        },
       {
	  title: 'епп фура/инко',
 content:
'[CENTER][url=https://postimg.cc/18bVwz6h][img]https://i.postimg.cc/zfGwmbGB/image.png[/img][/url]<br>' +
'[SIZE=4][FONT=Times New Roman][COLOR=#db7093][CENTER]{{ greeting }}, уважаемый(ая) {{ user.mention }}![/COLOR][/CENTER]<br>' +
"[CENTER]Игрок будет наказан по следующему пункту правил:[/CENTER]<br><br>" +
	"[CENTER][COLOR=#ff0000]2.47.[/COLOR] Запрещено ездить по полям на грузовом транспорте, инкассаторских машинах (работа дальнобойщика, инкассатора) [COLOR=#ff0000] | Jail 60 минут[/COLOR][/CENTER]<br><br>" +
       	        	'[CENTER][COLOR=#38ff4c]Одобрено, закрыто.[/COLOR][/CENTER][/FONT][/SIZE]',
       prefix: ACCEPT_PREFIX,
	  status: false,
        },
        {
	  title: 'нрп арест',
 content:
'[CENTER][url=https://postimg.cc/18bVwz6h][img]https://i.postimg.cc/zfGwmbGB/image.png[/img][/url]<br>' +
'[SIZE=4][FONT=Times New Roman][COLOR=#db7093][CENTER]{{ greeting }}, уважаемый(ая) {{ user.mention }}![/COLOR][/CENTER]<br>' +
"[CENTER]Игрок будет наказан по следующему пункту правил:[/CENTER]<br><br>" +
	"[CENTER][COLOR=#ff0000]2.50.[/COLOR] Запрещены задержания, аресты, а также любые действия со стороны игроков, состоящих во фракциях в интерьере аукциона, казино, а также во время системных мероприятий [COLOR=#ff0000]| Ban 7 - 15 дней + увольнение из организации[/COLOR][/CENTER]<br><br>" +
       	        	'[CENTER][COLOR=#38ff4c]Одобрено, закрыто.[/COLOR][/CENTER][/FONT][/SIZE]',
       prefix: ACCEPT_PREFIX,
	  status: false,
        },
        {
	  title: 'нрп акс',
 content:
'[CENTER][url=https://postimg.cc/18bVwz6h][img]https://i.postimg.cc/zfGwmbGB/image.png[/img][/url]<br>' +
'[SIZE=4][FONT=Times New Roman][COLOR=#db7093][CENTER]{{ greeting }}, уважаемый(ая) {{ user.mention }}![/COLOR][/CENTER]<br>' +
"[CENTER]Игрок будет наказан по следующему пункту правил:[/CENTER]<br><br>" +
	"[CENTER][COLOR=#ff0000]2.52.[/COLOR]Запрещено располагать аксессуары на теле персонажа, нарушая нормы морали и этики, увеличивать аксессуары до слишком большого размера. [COLOR=#ff0000]| При первом нарушении - обнуление аксессуаров, при повторном нарушении - обнуление аксессуаров + JAIL 30 минут[/COLOR][/CENTER]<br><br>" +
       	        	'[CENTER][COLOR=#38ff4c]Одобрено, закрыто.[/COLOR][/CENTER][/FONT][/SIZE]',
       prefix: ACCEPT_PREFIX,
	  status: false,
        },
        {
	  title: 'баг аним',
 content:
'[CENTER][url=https://postimg.cc/18bVwz6h][img]https://i.postimg.cc/zfGwmbGB/image.png[/img][/url]<br>' +
'[SIZE=4][FONT=Times New Roman][COLOR=#db7093][CENTER]{{ greeting }}, уважаемый(ая) {{ user.mention }}![/COLOR][/CENTER]<br>' +
"[CENTER]Игрок будет наказан по следующему пункту правил:[/CENTER]<br><br>" +
	"[CENTER][COLOR=#ff0000]2.55.[/COLOR]Запрещается багоюз связанный с анимацией в любых проявлениях. [COLOR=#ff0000] | Jail 60 / 120 минут[/COLOR][/CENTER]<br><br>" +
       	        	'[CENTER][COLOR=#38ff4c]Одобрено, закрыто.[/COLOR][/CENTER][/FONT][/SIZE]',
       prefix: ACCEPT_PREFIX,
	  status: false,
        },
        {
	  title: '-----------------------------------------------------------Игровые чаты-----------------------------------------------------------',
        },
        {
	  title: 'музыка в войс',
 content:
'[CENTER][url=https://postimg.cc/18bVwz6h][img]https://i.postimg.cc/zfGwmbGB/image.png[/img][/url]<br>' +
'[SIZE=4][FONT=Times New Roman][COLOR=#db7093][CENTER]{{ greeting }}, уважаемый(ая) {{ user.mention }}![/COLOR][/CENTER]<br>' +
"[CENTER]Игрок будет наказан по следующему пункту правил:[/CENTER]<br><br>" +
	"[CENTER][COLOR=#ff0000]3.14.[/COLOR] Запрещено включать музыку в Voice Chat [COLOR=#ff0000] | Mute 60 минут[/COLOR][/CENTER]<br><br>" +
       	        	'[CENTER][COLOR=#38ff4c]Одобрено, закрыто.[/COLOR][/CENTER][/FONT][/SIZE]',
       prefix: ACCEPT_PREFIX,
	  status: false,
        },
         {
	  title: 'шум в войс',
 content:
'[CENTER][url=https://postimg.cc/18bVwz6h][img]https://i.postimg.cc/zfGwmbGB/image.png[/img][/url]<br>' +
'[SIZE=4][FONT=Times New Roman][COLOR=#db7093][CENTER]{{ greeting }}, уважаемый(ая) {{ user.mention }}![/COLOR][/CENTER]<br>' +
"[CENTER]Игрок будет наказан по следующему пункту правил:[/CENTER]<br><br>" +
	"[CENTER][COLOR=#ff0000]3.16.[/COLOR] Запрещено создавать посторонние шумы или звуки [COLOR=#ff0000]| Mute 30 минут[/COLOR][/CENTER]<br><br>" +
       	        	'[CENTER][COLOR=#38ff4c]Одобрено, закрыто.[/COLOR][/CENTER][/FONT][/SIZE]',
       prefix: ACCEPT_PREFIX,
	  status: false,
        },
        {
	  title: '-----------------------------------------------------------Правила ГОСС-----------------------------------------------------------',
        },
        {
	  title: 'госс подработка',
    content:
'[CENTER][url=https://postimg.cc/18bVwz6h][img]https://i.postimg.cc/zfGwmbGB/image.png[/img][/url]<br>' +
'[SIZE=4][FONT=Times New Roman][COLOR=#db7093][CENTER]{{ greeting }}, уважаемый(ая) {{ user.mention }}![/COLOR][/CENTER]<br>' +
"[CENTER]Игрок будет наказан по следующему пункту правил:[/CENTER]<br><br>" +
	"[CENTER][COLOR=#ff0000]1.07.[/COLOR] Всем сотрудникам государственных организаций запрещено выполнять работы где-либо в форме, принадлежащей своей фракции [COLOR=#ff0000]| Jail 30 минут[/COLOR][/CENTER]<br><br>" +
	'[CENTER][COLOR=#38ff4c]Одобрено, закрыто.[/COLOR][/CENTER][/FONT][/SIZE]',
       prefix: ACCEPT_PREFIX,
	  status: false,
        },
        {
	  title: 'т/с в лич. целях',
 content:
'[CENTER][url=https://postimg.cc/18bVwz6h][img]https://i.postimg.cc/zfGwmbGB/image.png[/img][/url]<br>' +
'[SIZE=4][FONT=Times New Roman][COLOR=#db7093][CENTER]{{ greeting }}, уважаемый(ая) {{ user.mention }}![/COLOR][/CENTER]<br>' +
"[CENTER]Игрок будет наказан по следующему пункту правил:[/CENTER]<br><br>" +
	"[CENTER][COLOR=#ff0000]2.11.[/COLOR] Запрещено использование рабочего или фракционного транспорта в личных целях [COLOR=#ff0000]| Jail 30 минут [/COLOR][/CENTER]<br><br>" +
       	        	'[CENTER][COLOR=#38ff4c]Одобрено, закрыто.[/COLOR][/CENTER][/FONT][/SIZE]',
       prefix: ACCEPT_PREFIX,
	  status: false,
        },
        {
	  title: 'одиночный патруль',
 content:
'[CENTER][url=https://postimg.cc/18bVwz6h][img]https://i.postimg.cc/zfGwmbGB/image.png[/img][/url]<br>' +
'[SIZE=4][FONT=Times New Roman][COLOR=#db7093][CENTER]{{ greeting }}, уважаемый(ая) {{ user.mention }}![/COLOR][/CENTER]<br>' +
"[CENTER]Игрок будет наказан по следующему пункту правил:[/CENTER]<br><br>" +
	"[CENTER][COLOR=#ff0000]1.11.[/COLOR]Всем силовым структурам запрещен одиночный патруль или конвоирование, минимум 2 сотрудника [COLOR=#ff0000] | Jail 30 минут[/COLOR][/CENTER]<br><br>" +
       	        	'[CENTER][COLOR=#38ff4c]Одобрено, закрыто.[/COLOR][/CENTER][/FONT][/SIZE]',
       prefix: ACCEPT_PREFIX,
	  status: false,
        },
        {
	  title: 'госс казино/бу',
  content:
'[CENTER][url=https://postimg.cc/18bVwz6h][img]https://i.postimg.cc/zfGwmbGB/image.png[/img][/url]<br>' +
'[SIZE=4][FONT=Times New Roman][COLOR=#db7093][CENTER]{{ greeting }}, уважаемый(ая) {{ user.mention }}![/COLOR][/CENTER]<br>' +
"[CENTER]Игрок будет наказан по следующему пункту правил:[/CENTER]<br><br>" +
	"[CENTER][COLOR=#ff0000]1.13.[/COLOR] Запрещено находиться в форме внутри казино, участвовать в битве за контейнеры, участвовать в захвате семейного контейнера, находится на Б/У рынке с целью покупки / продажи авто, а также устраиваться на сторонние работы в форме фракции [COLOR=#ff0000] | Jail 30 минут[/COLOR][/CENTER]<br><br>" +
       	        	'[CENTER][COLOR=#38ff4c]Одобрено, закрыто.[/COLOR][/CENTER][/FONT][/SIZE]',
       prefix: ACCEPT_PREFIX,
	  status: false,
        },
        {
	  title: 'арест на бв',
 content:
'[CENTER][url=https://postimg.cc/18bVwz6h][img]https://i.postimg.cc/zfGwmbGB/image.png[/img][/url]<br>' +
'[SIZE=4][FONT=Times New Roman][COLOR=#db7093][CENTER]{{ greeting }}, уважаемый(ая) {{ user.mention }}![/COLOR][/CENTER]<br>' +
"[CENTER]Игрок будет наказан по следующему пункту правил:[/CENTER]<br><br>" +
	"[CENTER][COLOR=#ff0000]1.14.[/COLOR]Сотрудникам правоохранительных органов запрещается задерживать состав участников войны за бизнес за 10 минут непосредственно до начала самого бизвара. [COLOR=#ff0000]| Jail 30 минут. [/COLOR][/CENTER]<br><br>" +
       	        	'[CENTER][COLOR=#38ff4c]Одобрено, закрыто.[/COLOR][/CENTER][/FONT][/SIZE]',
       prefix: ACCEPT_PREFIX,
	  status: false,
        },
        {
	  title: 'масс дм (мо)',
 content:
'[CENTER][url=https://postimg.cc/18bVwz6h][img]https://i.postimg.cc/zfGwmbGB/image.png[/img][/url]<br>' +
'[SIZE=4][FONT=Times New Roman][COLOR=#db7093][CENTER]{{ greeting }}, уважаемый(ая) {{ user.mention }}![/COLOR][/CENTER]<br>' +
"[CENTER]Игрок будет наказан по следующему пункту правил:[/CENTER]<br><br>" +
	"[CENTER][COLOR=#ff0000]2.02.[/COLOR] Наносить урон игрокам, которые находятся вне территории воинской части, запрещено [COLOR=#ff0000] | DM / Jail 60 минут / Warn[/COLOR][/CENTER]<br><br>" +
       	        	'[CENTER][COLOR=#38ff4c]Одобрено, закрыто.[/COLOR][/CENTER][/FONT][/SIZE]',
       prefix: ACCEPT_PREFIX,
	  status: false,
        },
        {
	  title: 'дм на тт умвд',
 content:
'[CENTER][url=https://postimg.cc/18bVwz6h][img]https://i.postimg.cc/zfGwmbGB/image.png[/img][/url]<br>' +
'[SIZE=4][FONT=Times New Roman][COLOR=#db7093][CENTER]{{ greeting }}, уважаемый(ая) {{ user.mention }}![/COLOR][/CENTER]<br>' +
"[CENTER]Игрок будет наказан по следующему пункту правил:[/CENTER]<br><br>" +
	"[CENTER][COLOR=#ff0000]6.01.[/COLOR]Запрещено наносить урон игрокам без Role Play причины на территории УМВД [COLOR=#ff0000]| DM / Jail 60 минут / Warn[/COLOR][/CENTER]<br><br>" +
       	        	'[CENTER][COLOR=#38ff4c]Одобрено, закрыто.[/COLOR][/CENTER][/FONT][/SIZE]',
       prefix: ACCEPT_PREFIX,
	  status: false,
        },
        {
	  title: 'нрп розыск',
   content:
'[CENTER][url=https://postimg.cc/18bVwz6h][img]https://i.postimg.cc/zfGwmbGB/image.png[/img][/url]<br>' +
'[SIZE=4][FONT=Times New Roman][COLOR=#db7093][CENTER]{{ greeting }}, уважаемый(ая) {{ user.mention }}![/COLOR][/CENTER]<br>' +
"[CENTER]Игрок будет наказан по следующему пункту правил:[/CENTER]<br><br>" +
	"[CENTER][COLOR=#ff0000]6.02.[/COLOR]Запрещено выдавать розыск без Role Play причины [COLOR=#ff0000] | Warn[/COLOR][/CENTER]<br><br>" +
       	        	'[CENTER][COLOR=#38ff4c]Одобрено, закрыто.[/COLOR][/CENTER][/FONT][/SIZE]',
       prefix: ACCEPT_PREFIX,
	  status: false,
        },
        {
	  title: 'нрп поведение (умвд)',
 content:
'[CENTER][url=https://postimg.cc/18bVwz6h][img]https://i.postimg.cc/zfGwmbGB/image.png[/img][/url]<br>' +
'[SIZE=4][FONT=Times New Roman][COLOR=#db7093][CENTER]{{ greeting }}, уважаемый(ая) {{ user.mention }}![/COLOR][/CENTER]<br>' +
"[CENTER]Игрок будет наказан по следующему пункту правил:[/CENTER]<br><br>" +
	"[CENTER][COLOR=#ff0000]6.03.[/COLOR] Запрещено nRP поведение [COLOR=#ff0000]| Warn[/COLOR][/CENTER]<br><br>" +
       	        	'[CENTER][COLOR=#38ff4c]Одобрено, закрыто.[/COLOR][/CENTER][/FONT][/SIZE]',
       prefix: ACCEPT_PREFIX,
	  status: false,
        },
         {
	  title: 'дм на тт ГИБДД',
 content:
'[CENTER][url=https://postimg.cc/18bVwz6h][img]https://i.postimg.cc/zfGwmbGB/image.png[/img][/url]<br>' +
'[SIZE=4][FONT=Times New Roman][COLOR=#db7093][CENTER]{{ greeting }}, уважаемый(ая) {{ user.mention }}![/COLOR][/CENTER]<br>' +
"[CENTER]Игрок будет наказан по следующему пункту правил:[/CENTER]<br><br>" +
	"[CENTER][COLOR=#ff0000]7.01.[/COLOR] Запрещено наносить урон игрокам без Role Play причины на территории ГИБДД [COLOR=#ff0000]| DM / Jail 60 минут / Warn[/COLOR][/CENTER]<br><br>" +
       	        	'[CENTER][COLOR=#38ff4c]Одобрено, закрыто.[/COLOR][/CENTER][/FONT][/SIZE]',
       prefix: ACCEPT_PREFIX,
	  status: false,
        },
        {
	  title: 'нрп розыск/штраф',
 content:
'[CENTER][url=https://postimg.cc/18bVwz6h][img]https://i.postimg.cc/zfGwmbGB/image.png[/img][/url]<br>' +
'[SIZE=4][FONT=Times New Roman][COLOR=#db7093][CENTER]{{ greeting }}, уважаемый(ая) {{ user.mention }}![/COLOR][/CENTER]<br>' +
"[CENTER]Игрок будет наказан по следующему пункту правил:[/CENTER]<br><br>" +
	"[CENTER][COLOR=#ff0000]7.02.[/COLOR]Запрещено выдавать розыск, штраф без Role Play причины [COLOR=#ff0000]| Warn[/COLOR][/CENTER]<br><br>" +
       	        	'[CENTER][COLOR=#38ff4c]Одобрено, закрыто.[/COLOR][/CENTER][/FONT][/SIZE]',
       prefix: ACCEPT_PREFIX,
	  status: false,
        },
        {
	  title: 'нрп погоня',
 content:
'[CENTER][url=https://postimg.cc/18bVwz6h][img]https://i.postimg.cc/zfGwmbGB/image.png[/img][/url]<br>' +
'[SIZE=4][FONT=Times New Roman][COLOR=#db7093][CENTER]{{ greeting }}, уважаемый(ая) {{ user.mention }}![/COLOR][/CENTER]<br>' +
"[CENTER]Игрок будет наказан по следующему пункту правил:[/CENTER]<br><br>" +
	"[CENTER][COLOR=#ff0000]7.04.[/COLOR] Запрещено отбирать водительские права во время погони за нарушителем [COLOR=#ff0000]| Warn[/COLOR][/CENTER]<br><br>" +
       	        	'[CENTER][COLOR=#38ff4c]Одобрено, закрыто.[/COLOR][/CENTER][/FONT][/SIZE]',
       prefix: ACCEPT_PREFIX,
	  status: false,
        },
        {
	  title: 'дм на тт фсб',
 content:
'[CENTER][url=https://postimg.cc/18bVwz6h][img]https://i.postimg.cc/zfGwmbGB/image.png[/img][/url]<br>' +
'[SIZE=4][FONT=Times New Roman][COLOR=#db7093][CENTER]{{ greeting }}, уважаемый(ая) {{ user.mention }}![/COLOR][/CENTER]<br>' +
"[CENTER]Игрок будет наказан по следующему пункту правил:[/CENTER]<br><br>" +
"[CENTER][COLOR=#ff0000]8.01.[/COLOR] Запрещено наносить урон игрокам без Role Play причины на территории ФСБ [COLOR=#ff0000] | DM / Jail 60 минут / Warn[/COLOR][/CENTER]<br><br>" +
      '[CENTER][COLOR=#38ff4c]Одобрено, закрыто.[/COLOR][/CENTER][/FONT][/SIZE]',
       prefix: ACCEPT_PREFIX,
	  status: false,
        },
        {
	  title: 'нрп розыск(фсб)',
  content:
'[CENTER][url=https://postimg.cc/18bVwz6h][img]https://i.postimg.cc/zfGwmbGB/image.png[/img][/url]<br>' +
'[SIZE=4][FONT=Times New Roman][COLOR=#db7093][CENTER]{{ greeting }}, уважаемый(ая) {{ user.mention }}![/COLOR][/CENTER]<br>' +
"[CENTER]Игрок будет наказан по следующему пункту правил:[/CENTER]<br><br>" +
	"[CENTER][COLOR=#ff0000]8.02.[/COLOR] Запрещено выдавать розыск без Role Play причины [COLOR=#ff0000]| Warn[/COLOR][/CENTER]<br><br>" +
       	        	'[CENTER][COLOR=#38ff4c]Одобрено, закрыто.[/COLOR][/CENTER][/FONT][/SIZE]',
       prefix: ACCEPT_PREFIX,
	  status: false,
        },
        {
	  title: 'дм на тт фсин',
 content:
'[CENTER][url=https://postimg.cc/18bVwz6h][img]https://i.postimg.cc/zfGwmbGB/image.png[/img][/url]<br>' +
'[SIZE=4][FONT=Times New Roman][COLOR=#db7093][CENTER]{{ greeting }}, уважаемый(ая) {{ user.mention }}![/COLOR][/CENTER]<br>' +
"[CENTER]Игрок будет наказан по следующему пункту правил:[/CENTER]<br><br>" +
	"[CENTER][COLOR=#ff0000]9.01.[/COLOR]Запрещено наносить урон игрокам без Role Play причины на территории ФСИН [COLOR=#ff0000] | DM / Jail 60 минут / Warn[/COLOR][/CENTER]<br><br>" +
       	        	'[CENTER][COLOR=#38ff4c]Одобрено, закрыто.[/COLOR][/CENTER][/FONT][/SIZE]',
       prefix: ACCEPT_PREFIX,
	  status: false,
        },
        {
	  title: '-----------------------------------------------------------Правила ОПГ-----------------------------------------------------------',
	},
  {
	  title: 'нрп вч',
 content:
'[CENTER][url=https://postimg.cc/18bVwz6h][img]https://i.postimg.cc/zfGwmbGB/image.png[/img][/url]<br>' +
'[SIZE=4][FONT=Times New Roman][COLOR=#db7093][CENTER]{{ greeting }}, уважаемый(ая) {{ user.mention }}![/COLOR][/CENTER]<br>' +
"[CENTER]Игрок будет наказан по следующему пункту правил:[/CENTER]<br><br>" +
	"[CENTER][COLOR=#ff0000]2.[/COLOR]За нарушение правил нападения на Войсковую Часть выдаётся предупреждение [COLOR=#ff0000]| Jail 30 минут (NonRP нападение) / Warn (Для сотрудников ОПГ)[/COLOR][/CENTER]<br><br>" +
       	        	'[CENTER][COLOR=#38ff4c]Одобрено, закрыто.[/COLOR][/CENTER][/FONT][/SIZE]',
       prefix: ACCEPT_PREFIX,
	  status: false,
        },
         {
	  title: 'нрп вч(через стену)',
 content:
'[CENTER][url=https://postimg.cc/18bVwz6h][img]https://i.postimg.cc/zfGwmbGB/image.png[/img][/url]<br>' +
'[SIZE=4][FONT=Times New Roman][COLOR=#db7093][CENTER]{{ greeting }}, уважаемый(ая) {{ user.mention }}![/COLOR][/CENTER]<br>' +
"[CENTER]Игрок будет наказан по следующему пункту правил:[/CENTER]<br><br>" +
	"[CENTER][COLOR=#ff0000]15.[COLOR]Нападение на военную часть разрешено только через блокпост КПП с последовательностью взлома [COLOR=#ff0000]| /Warn NonRP В/Ч[/COLOR][/CENTER]<br><br>" +
       	        	'[CENTER][COLOR=#38ff4c]Одобрено, закрыто.[/COLOR][/CENTER][/FONT][/SIZE]',
       prefix: ACCEPT_PREFIX,
	  status: false,
        },
        {
	  title: 'нрп вч',
 content:
'[CENTER][url=https://postimg.cc/18bVwz6h][img]https://i.postimg.cc/zfGwmbGB/image.png[/img][/url]<br>' +
'[SIZE=4][FONT=Times New Roman][COLOR=#db7093][CENTER]{{ greeting }}, уважаемый(ая) {{ user.mention }}![/COLOR][/CENTER]<br>' +
		"[CENTER]Игрок будет наказан. в соответствии с этими правилами:[URL=https://forum.blackrussia.online/threads/Правила-ограблений-и-похищений.29/]*ТЫК*[/URL][/CENTER]<br><br>" +
       	        	'[CENTER][COLOR=#38ff4c]Одобрено, закрыто.[/COLOR][/CENTER][/FONT][/SIZE]',
       prefix: ACCEPT_PREFIX,
	  status: false,
        },
          {
	  title: '-----------------------------------------------------------РП биографии-----------------------------------------------------------',
	},
  {
	  title: 'одобрено',
 content:
'[CENTER][url=https://postimg.cc/18bVwz6h][img]https://i.postimg.cc/zfGwmbGB/image.png[/img][/url]<br>' +
'[SIZE=4][FONT=Times New Roman][COLOR=#db7093][CENTER]{{ greeting }}, уважаемый(ая) {{ user.mention }}![/COLOR][/CENTER]<br>' +
		"[CENTER]Ваша рп биография была проверена и получает статус одобрено. [/CENTER]<br><br>" +
       	        	'[CENTER][COLOR=#38ff4c]Одобрено, закрыто.[/COLOR][/CENTER][/FONT][/SIZE]',
       prefix: ACCEPT_PREFIX,
	  status: false,
        },
        {
	  title: 'копипаст',
 content:		'[CENTER][url=https://postimg.cc/18bVwz6h][img]https://i.postimg.cc/zfGwmbGB/image.png[/img][/url]<br>' +
'[SIZE=4][FONT=Times New Roman][COLOR=#db7093][CENTER]{{ greeting }}, уважаемый(ая) {{ user.mention }}![/COLOR][/CENTER]<br>' +
"[CENTER]Ваша рп биография была скопирована у другого человека.<br>Убедительная просьба ознакомиться с правилами написания рп биографий.[/CENTER]<br><br>" +
	'[CENTER][COLOR=#ff0000]Отказано, закрыто.[/COLOR][/CENTER][/FONT][/SIZE]',
     prefix: UNACCEPT_PREFIX,
	  status: false,
        },
        {
	  title: 'младше 18',
 content:		'[CENTER][url=https://postimg.cc/18bVwz6h][img]https://i.postimg.cc/zfGwmbGB/image.png[/img][/url]<br>' +
'[SIZE=4][FONT=Times New Roman][COLOR=#db7093][CENTER]{{ greeting }}, уважаемый(ая) {{ user.mention }}![/COLOR][/CENTER]<br>' +
"[CENTER]Слишком молод.<br>Убедительная просьба ознакомиться с правилами написания рп биографий.[/CENTER]<br><br>" +
	'[CENTER][COLOR=#ff0000]Отказано, закрыто.[/COLOR][/CENTER][/FONT][/SIZE]',
     prefix: UNACCEPT_PREFIX,
	  status: false,
        },
        {
	  title: 'некорректная дата рож.',
 content:		'[CENTER][url=https://postimg.cc/18bVwz6h][img]https://i.postimg.cc/zfGwmbGB/image.png[/img][/url]<br>' +
'[SIZE=4][FONT=Times New Roman][COLOR=#db7093][CENTER]{{ greeting }}, уважаемый(ая) {{ user.mention }}![/COLOR][/CENTER]<br>' +
"[CENTER]Некорректная дата рождения.[/CENTER]<br><br>" +
'[CENTER][COLOR=#ff0000]Отказано, закрыто.[/COLOR][/CENTER][/FONT][/SIZE]',
     prefix: UNACCEPT_PREFIX,
	  status: false,
        },
        {
	  title: 'недостаточно рп инфо',
 content:		'[CENTER][url=https://postimg.cc/18bVwz6h][img]https://i.postimg.cc/zfGwmbGB/image.png[/img][/url]<br>' +
'[SIZE=4][FONT=Times New Roman][COLOR=#db7093][CENTER]{{ greeting }}, уважаемый(ая) {{ user.mention }}![/COLOR][/CENTER]<br>' +
"[CENTER]Недостаточно рп информации.[/CENTER]<br><br>" +
'[CENTER][COLOR=#ff0000]Отказано, закрыто.[/COLOR][/CENTER][/FONT][/SIZE]',
     prefix: UNACCEPT_PREFIX,
	  status: false,
        },
        {
	  title: 'ошибки',
 content:		'[CENTER][url=https://postimg.cc/18bVwz6h][img]https://i.postimg.cc/zfGwmbGB/image.png[/img][/url]<br>' +
'[SIZE=4][FONT=Times New Roman][COLOR=#db7093][CENTER]{{ greeting }}, уважаемый(ая) {{ user.mention }}![/COLOR][/CENTER]<br>' +
"[CENTER]В вашей рп биографии имеются ошибки, требующие исправления.[/CENTER]<br><br>" +
	'[CENTER][COLOR=#ff0000]Отказано, закрыто.[/COLOR][/CENTER][/FONT][/SIZE]',
     prefix: UNACCEPT_PREFIX,
	  status: false,
        },
        {
	  title: 'от 3-его лица',
 content:  '[CENTER][url=https://postimg.cc/18bVwz6h][img]https://i.postimg.cc/zfGwmbGB/image.png[/img][/url]<br>' +
'[SIZE=4][FONT=Times New Roman][COLOR=#db7093][CENTER]{{ greeting }}, уважаемый(ая) {{ user.mention }}![/COLOR][/CENTER]<br>' +
"[CENTER]Ваша рп биография написана от 3-его лица.[/CENTER]<br><br>" +
	'[CENTER][COLOR=#ff0000]Отказано, закрыто.[/COLOR][/CENTER][/FONT][/SIZE]',
     prefix: UNACCEPT_PREFIX,
	  status: false,
        },
        {
	  title: 'не совпал возраст',
	  content:  '[CENTER][url=https://postimg.cc/18bVwz6h][img]https://i.postimg.cc/zfGwmbGB/image.png[/img][/url]<br>' +
'[SIZE=4][FONT=Times New Roman][COLOR=#db7093][CENTER]{{ greeting }}, уважаемый(ая) {{ user.mention }}![/COLOR][/CENTER]<br>' +
"[CENTER]В вашей рп биографии возникла нестыковка между возрастом и датой рождения.[/CENTER]<br><br>" +
	'[CENTER][COLOR=#ff0000]Отказано, закрыто.[/COLOR][/CENTER][/FONT][/SIZE]',
     prefix: UNACCEPT_PREFIX,
	  status: false,
        },
        {
       title: 'на доработку',
 content:		'[CENTER][url=https://postimg.cc/18bVwz6h][img]https://i.postimg.cc/zfGwmbGB/image.png[/img][/url]<br>' +
'[SIZE=4][FONT=Times New Roman][COLOR=#db7093][CENTER]{{ greeting }}, уважаемый(ая) {{ user.mention }}![/COLOR][/CENTER]<br>' +
"[CENTER]У вас есть возможность доработать свою рп биографию. Есть 24 часа для того, чтобы внести дополнения.[/CENTER]<br><br>" +
	'[CENTER][COLOR=#ffd838]На рассмотрении…[/COLOR][/CENTER][/FONT][/SIZE]',
	  prefix: PIN_PREFIX,
	  status: true,
        },
        {
	  title: 'не доработал',
  content:		'[CENTER][url=https://postimg.cc/18bVwz6h][img]https://i.postimg.cc/zfGwmbGB/image.png[/img][/url]<br>' +
'[SIZE=4][FONT=Times New Roman][COLOR=#db7093][CENTER]{{ greeting }}, уважаемый(ая) {{ user.mention }}![/COLOR][/CENTER]<br>' +
"[CENTER]Вы не доработали свою рп биографию.[/CENTER]<br><br>" +
	'[CENTER][COLOR=#ff0000]Отказано, закрыто.[/COLOR][/CENTER][/FONT][/SIZE]',
     prefix: UNACCEPT_PREFIX,
	  status: false,
        },
        {
	  title: 'нрп ник',
 content:		'[CENTER][url=https://postimg.cc/18bVwz6h][img]https://i.postimg.cc/zfGwmbGB/image.png[/img][/url]<br>' +
'[SIZE=4][FONT=Times New Roman][COLOR=#db7093][CENTER]{{ greeting }}, уважаемый(ая) {{ user.mention }}![/COLOR][/CENTER]<br>' +
"[CENTER]У вас NonRP NickName.[/CENTER]<br><br>" +
	'[CENTER][COLOR=#ff0000]Отказано, закрыто.[/COLOR][/CENTER][/FONT][/SIZE]',
     prefix: UNACCEPT_PREFIX,
	  status: false,
        },
        {
	  title: 'не по форме',
  content:		'[CENTER][url=https://postimg.cc/18bVwz6h][img]https://i.postimg.cc/zfGwmbGB/image.png[/img][/url]<br>' +
'[SIZE=4][FONT=Times New Roman][COLOR=#db7093][CENTER]{{ greeting }}, уважаемый(ая) {{ user.mention }}![/COLOR][/CENTER]<br>' +
"[CENTER]Ваша рп биография написана не по форме.<br>Убедительная просьба ознакомиться с правилами написания рп биографий.[/CENTER]<br><br>" +
	'[CENTER][COLOR=#ff0000]Отказано, закрыто.[/COLOR][/CENTER][/FONT][/SIZE]',
     prefix: UNACCEPT_PREFIX,
	  status: false,
        },
        {
	  title: 'не по форме(заголовок)',
 content:		'[CENTER][url=https://postimg.cc/18bVwz6h][img]https://i.postimg.cc/zfGwmbGB/image.png[/img][/url]<br>' +
'[SIZE=4][FONT=Times New Roman][COLOR=#db7093][CENTER]{{ greeting }}, уважаемый(ая) {{ user.mention }}![/COLOR][/CENTER]<br>' +
"[CENTER]В вашей рп биографии заголовок написан не по форме.<br>Убедительная просьба ознакомиться с правилами написания рп биографий.[/CENTER]<br><br>" +
	'[CENTER][COLOR=#ff0000]Отказано, закрыто.[/COLOR][/CENTER][/FONT][/SIZE]',
     prefix: UNACCEPT_PREFIX,
	  status: false,
        },
        {
	  title: '-----------------------------------------------------------РП ситуации-----------------------------------------------------------',
	},
  {
	  title: 'одобрено',
 content:
'[CENTER][url=https://postimg.cc/18bVwz6h][img]https://i.postimg.cc/zfGwmbGB/image.png[/img][/url]<br>' +
'[SIZE=4][FONT=Times New Roman][COLOR=#db7093][CENTER]{{ greeting }}, уважаемый(ая) {{ user.mention }}![/COLOR][/CENTER]<br>' +
		"[CENTER]Ваша рп ситуация была проверена и получает статус одобрено. [/CENTER]<br><br>" +
       	        	'[CENTER][COLOR=#38ff4c]Одобрено, закрыто.[/COLOR][/CENTER][/FONT][/SIZE]',
       prefix: ACCEPT_PREFIX,
	  status: false,
        },
         {
	  title: 'копипаст',
 content:		'[CENTER][url=https://postimg.cc/18bVwz6h][img]https://i.postimg.cc/zfGwmbGB/image.png[/img][/url]<br>' +
'[SIZE=4][FONT=Times New Roman][COLOR=#db7093][CENTER]{{ greeting }}, уважаемый(ая) {{ user.mention }}![/COLOR][/CENTER]<br>' +
"[CENTER]Ваша рп ситуация была скопирована у другого человека.<br>Убедительная просьба ознакомиться с правилами написания рп ситуаций.[/CENTER]<br><br>" +
	'[CENTER][COLOR=#ff0000]Отказано, закрыто.[/COLOR][/CENTER][/FONT][/SIZE]',
     prefix: UNACCEPT_PREFIX,
	  status: false,
        },
        {
	  title: 'ошибки',
 content:		'[CENTER][url=https://postimg.cc/18bVwz6h][img]https://i.postimg.cc/zfGwmbGB/image.png[/img][/url]<br>' +
'[SIZE=4][FONT=Times New Roman][COLOR=#db7093][CENTER]{{ greeting }}, уважаемый(ая) {{ user.mention }}![/COLOR][/CENTER]<br>' +
"[CENTER]В вашей рп ситуации имеются ошибки, требующие исправления.[/CENTER]<br><br>" +
	'[CENTER][COLOR=#ff0000]Отказано, закрыто.[/COLOR][/CENTER][/FONT][/SIZE]',
     prefix: UNACCEPT_PREFIX,
	  status: false,
        },
        {
       title: 'на доработку',
 content:		'[CENTER][url=https://postimg.cc/18bVwz6h][img]https://i.postimg.cc/zfGwmbGB/image.png[/img][/url]<br>' +
'[SIZE=4][FONT=Times New Roman][COLOR=#db7093][CENTER]{{ greeting }}, уважаемый(ая) {{ user.mention }}![/COLOR][/CENTER]<br>' +
"[CENTER]У вас есть возможность доработать свою рп ситуацию. Есть 24 часа для того, чтобы внести дополнения.[/CENTER]<br><br>" +
'[CENTER][COLOR=#ffd838]На рассмотрении…[/COLOR][/CENTER][/FONT][/SIZE]',
	  prefix: PIN_PREFIX,
	  status: true,
        },
        {
	  title: 'не доработал',
 content:		'[CENTER][url=https://postimg.cc/18bVwz6h][img]https://i.postimg.cc/zfGwmbGB/image.png[/img][/url]<br>' +
'[SIZE=4][FONT=Times New Roman][COLOR=#db7093][CENTER]{{ greeting }}, уважаемый(ая) {{ user.mention }}![/COLOR][/CENTER]<br>' +
"[CENTER]Вы не доработали свою рп ситуацию .[/CENTER]<br><br>" +
	'[CENTER][COLOR=#ff0000]Отказано, закрыто.[/COLOR][/CENTER][/FONT][/SIZE]',
     prefix: UNACCEPT_PREFIX,
	  status: false,
        },
        {
	  title: 'не по форме',
 content:		'[CENTER][url=https://postimg.cc/18bVwz6h][img]https://i.postimg.cc/zfGwmbGB/image.png[/img][/url]<br>' +
'[SIZE=4][FONT=Times New Roman][COLOR=#db7093][CENTER]{{ greeting }}, уважаемый(ая) {{ user.mention }}![/COLOR][/CENTER]<br>' +
"[CENTER]Ваша рп ситуация написана не по форме.<br>Убедительная просьба ознакомиться с правилами написания рп ситуаций.[/CENTER]<br><br>" +
	'[CENTER][COLOR=#ff0000]Отказано, закрыто.[/COLOR][/CENTER][/FONT][/SIZE]',
     prefix: UNACCEPT_PREFIX,
	  status: false,
        },
        {
	  title: 'не по форме(заголовок)',
  content:		'[CENTER][url=https://postimg.cc/18bVwz6h][img]https://i.postimg.cc/zfGwmbGB/image.png[/img][/url]<br>' +
'[SIZE=4][FONT=Times New Roman][COLOR=#db7093][CENTER]{{ greeting }}, уважаемый(ая) {{ user.mention }}![/COLOR][/CENTER]<br>' +
"[CENTER]В вашей рп ситуации заголовок написан не по форме.<br>Убедительная просьба ознакомиться с правилами написания рп ситуаций.[/CENTER]<br><br>" +
	'[CENTER][COLOR=#ff0000]Отказано, закрыто.[/COLOR][/CENTER][/FONT][/SIZE]',
     prefix: UNACCEPT_PREFIX,
	  status: false,
        },
        {
	  title: '-----------------------------------------------------------РП организации-----------------------------------------------------------',
	},
  {
	  title: 'одобрено',
 content:
'[CENTER][url=https://postimg.cc/18bVwz6h][img]https://i.postimg.cc/zfGwmbGB/image.png[/img][/url]<br>' +
'[SIZE=4][FONT=Times New Roman][COLOR=#db7093][CENTER]{{ greeting }}, уважаемый(ая) {{ user.mention }}![/COLOR][/CENTER]<br>' +
"[CENTER]Ваша рп организация была проверена и получает статус одобрено.[/CENTER]<br><br>" +
       	        	'[CENTER][COLOR=#38ff4c]Одобрено, закрыто.[/COLOR][/CENTER][/FONT][/SIZE]',
       prefix: ACCEPT_PREFIX,
	  status: false,
        },
        {
       title: 'на доработку',
 content:		'[CENTER][url=https://postimg.cc/18bVwz6h][img]https://i.postimg.cc/zfGwmbGB/image.png[/img][/url]<br>' +
'[SIZE=4][FONT=Times New Roman][COLOR=#db7093][CENTER]{{ greeting }}, уважаемый(ая) {{ user.mention }}![/COLOR][/CENTER]<br>' +
"[CENTER]У вас есть возможность доработать свою рп организацию. Есть 24 часа для того, чтобы внести дополнения.[/CENTER]<br><br>" +
'[CENTER][COLOR=#ffd838]На рассмотрении…[/COLOR][/CENTER][/FONT][/SIZE]',
	  prefix: PIN_PREFIX,
	  status: true,
        },
        {
	  title: 'не доработал',
 content:		'[CENTER][url=https://postimg.cc/18bVwz6h][img]https://i.postimg.cc/zfGwmbGB/image.png[/img][/url]<br>' +
'[SIZE=4][FONT=Times New Roman][COLOR=#db7093][CENTER]{{ greeting }}, уважаемый(ая) {{ user.mention }}![/COLOR][/CENTER]<br>' +
"[CENTER]Вы не доработали свою рп организацию.[/CENTER]<br><br>" +
	'[CENTER][COLOR=#ff0000]Отказано, закрыто.[/COLOR][/CENTER][/FONT][/SIZE]',
     prefix: UNACCEPT_PREFIX,
	  status: false,
        },
        {
	  title: 'копипаст',
 content:		'[CENTER][url=https://postimg.cc/18bVwz6h][img]https://i.postimg.cc/zfGwmbGB/image.png[/img][/url]<br>' +
'[SIZE=4][FONT=Times New Roman][COLOR=#db7093][CENTER]{{ greeting }}, уважаемый(ая) {{ user.mention }}![/COLOR][/CENTER]<br>' +
"[CENTER]Ваша рп организация была скопирована у другого человека.<br>Убедительная просьба ознакомиться с правилами написания рп организаций.[/CENTER]<br><br>" +
	'[CENTER][COLOR=#ff0000]Отказано, закрыто.[/COLOR][/CENTER][/FONT][/SIZE]',
     prefix: UNACCEPT_PREFIX,
	  status: false,
        },
        {
	  title: 'ошибки',
 content:		'[CENTER][url=https://postimg.cc/18bVwz6h][img]https://i.postimg.cc/zfGwmbGB/image.png[/img][/url]<br>' +
'[SIZE=4][FONT=Times New Roman][COLOR=#db7093][CENTER]{{ greeting }}, уважаемый(ая) {{ user.mention }}![/COLOR][/CENTER]<br>' +
"[CENTER]В вашей рп организации имеются ошибки, требующие исправления.[/CENTER]<br><br>" +
	'[CENTER][COLOR=#ff0000]Отказано, закрыто.[/COLOR][/CENTER][/FONT][/SIZE]',
     prefix: UNACCEPT_PREFIX,
	  status: false,
        },
        {
	  title: 'не по форме',
 content:		'[CENTER][url=https://postimg.cc/18bVwz6h][img]https://i.postimg.cc/zfGwmbGB/image.png[/img][/url]<br>' +
'[SIZE=4][FONT=Times New Roman][COLOR=#db7093][CENTER]{{ greeting }}, уважаемый(ая) {{ user.mention }}![/COLOR][/CENTER]<br>' +
"[CENTER]Ваша рп организация написана не по форме.<br>Убедительная просьба ознакомиться с правилами написания рп организаций.[/CENTER]<br><br>" +
	'[CENTER][COLOR=#ff0000]Отказано, закрыто.[/COLOR][/CENTER][/FONT][/SIZE]',
     prefix: UNACCEPT_PREFIX,
	  status: false,
        },
        {
	  title: 'не по форме(заголовок)',
 content:		'[CENTER][url=https://postimg.cc/18bVwz6h][img]https://i.postimg.cc/zfGwmbGB/image.png[/img][/url]<br>' +
'[SIZE=4][FONT=Times New Roman][COLOR=#db7093][CENTER]{{ greeting }}, уважаемый(ая) {{ user.mention }}![/COLOR][/CENTER]<br>' +
"[CENTER]В вашей рп организации заголовок написан не по форме.<br>Убедительная просьба ознакомиться с правилами написания рп организаций.[/CENTER]<br><br>" +
	'[CENTER][COLOR=#ff0000]Отказано, закрыто.[/COLOR][/CENTER][/FONT][/SIZE]',
     prefix: UNACCEPT_PREFIX,
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
