// ==UserScript==
// @name         Главные Кураторы форума Smolensk
// @namespace    https://forum.blackrussia.online/
// @version      5.4
// @description  Для ГКФ/ЗГКФ
// @author       Asya Kashtanova
// @match        https://forum.blackrussia.online/threads/*
// @include      https://forum.blackrussia.online/threads/
// @grant        none
// @license      MIT
// @icon https://icons.iconarchive.com/icons/aniket-suvarna/box-logo/128/bxl-baidu-icon.png
// @downloadURL https://update.greasyfork.org/scripts/485791/%D0%93%D0%BB%D0%B0%D0%B2%D0%BD%D1%8B%D0%B5%20%D0%9A%D1%83%D1%80%D0%B0%D1%82%D0%BE%D1%80%D1%8B%20%D1%84%D0%BE%D1%80%D1%83%D0%BC%D0%B0%20Smolensk.user.js
// @updateURL https://update.greasyfork.org/scripts/485791/%D0%93%D0%BB%D0%B0%D0%B2%D0%BD%D1%8B%D0%B5%20%D0%9A%D1%83%D1%80%D0%B0%D1%82%D0%BE%D1%80%D1%8B%20%D1%84%D0%BE%D1%80%D1%83%D0%BC%D0%B0%20Smolensk.meta.js
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
'[SIZE=3][FONT=Times New Roman][LEFT]Здравствуйте.[/LEFT]<br>'
	},
	{
	  title: '-----------------------------------------------------------Отказ жалобы-----------------------------------------------------------',
	},
	{
	  title: 'Форма подачи жалобы',
	  content:
'[SIZE=3][FONT=Times New Roman][LEFT]Здравствуйте.[/LEFT]<br>' +
		"[LEFT]Пожалуйста, убедительная просьба, ознакомится с формой подачи жалобы на игроков.[/LEFT]<br>" +
		'[LEFT][COLOR=#ff0000]Отказано, закрыто.[/COLOR][/LEFT][/FONT][/SIZE]',
      prefix: CLOSE_PREFIX,
	  status: false,
	},
	{
      title: 'Название жалобы не по форме',
	  content:
'[SIZE=3][FONT=Times New Roman][LEFT]Здравствуйте.[/LEFT]<br>' +
	"[LEFT]Название жалобы составлено не по форме. Внимательно прочитайте правила составления жалобы.[/LEFT]<br>" +
 	'[LEFT][COLOR=#ff0000]Отказано, закрыто.[/COLOR][/LEFT][/FONT][/SIZE]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
	{
	  title: 'Нет доказательств ',
	  content:
'[SIZE=3][FONT=Times New Roman][LEFT]Здравствуйте.[/LEFT]<br>' +
        "[LEFT]В вашей жалобе нет доказательств. [/LEFT]<br>" +
		'[LEFT][COLOR=#ff0000]Отказано, закрыто.[/COLOR][/LEFT][/FONT][/SIZE]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
	{
	  title: 'Не хватает /time',
	  content:
'[SIZE=3][FONT=Times New Roman][LEFT]Здравствуйте.[/LEFT]<br>' +
	"[LEFT]На доказательствах отсутствует /time.[/LEFT]<br>" +
	'[LEFT][COLOR=#ff0000]Отказано, закрыто.[/COLOR][/LEFT][/FONT][/SIZE]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
     },
	 {
	  title: 'Недостаточно доказательств',
	  content:
'[SIZE=3][FONT=Times New Roman][LEFT]Здравствуйте.[/LEFT]<br>' +
        "[LEFT]В вашей жалобе недостаточно доказательств. [/LEFT]<br>" +
	'[LEFT][COLOR=#ff0000]Отказано, закрыто.[/COLOR][/LEFT][/FONT][/SIZE]',
        prefix: UNACCEPT_PREFIX,
	  status: false,
    },
	{
	  title: 'Дублирование темы',
	  content:
'[SIZE=3][FONT=Times New Roman][LEFT]Здравствуйте.[/LEFT]<br>' +
	"[LEFT]Дублирование темы.<br>Напоминаем, при 3 дублированиях – форумный аккаунт будет заблокирован. [/LEFT]<br>" +
	'[LEFT][COLOR=#ff0000]Отказано, закрыто.[/COLOR][/LEFT][/FONT][/SIZE]',
      prefix: CLOSE_PREFIX,
	  status: false,
	},
	{
	  title: 'Не в тот раздел',
	  content:
'[SIZE=3][FONT=Times New Roman][LEFT]Здравствуйте.[/LEFT]<br>' +
	"[LEFT]Вы попали не в тот раздел, подайте жалобу в правильный раздел.[/LEFT]<br>" +
	'[LEFT][COLOR=#ff0000]Отказано, закрыто.[/COLOR][/LEFT][/FONT][/SIZE]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
	},
    {
	  title: 'Ник не соответствует',
	  content:
'[SIZE=3][FONT=Times New Roman][LEFT]Здравствуйте.[/LEFT]<br>' +
	"[LEFT] Nick_Name игрока не соответствует тому, который предоставлен в ваших доказательствах.[/LEFT]<br>" +
	'[LEFT][COLOR=#ff0000]Отказано, закрыто.[/COLOR][/LEFT][/FONT][/SIZE]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
	},
     {
	  title: 'Нарушений нет',
	  content:
'[SIZE=3][FONT=Times New Roman][LEFT]Здравствуйте.[/LEFT]<br>' +
"[LEFT]Не вижу нарушений со стороны данного игрока.[/LEFT]<br>" +
'[LEFT][COLOR=#ff0000]Отказано, закрыто.[/COLOR][/LEFT][/FONT][/SIZE]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
	},
    {
	  title: 'Док-ва более 3-х минут',
	  content:
'[SIZE=3][FONT=Times New Roman][LEFT]Здравствуйте.[/LEFT]<br>' +
 "[LEFT]Ваши доказательства длятся более 3-ëх минут. Нужны таймкоды.[/LEFT]<br>" +
	'[LEFT][COLOR=#ff0000]Отказано, закрыто.[/COLOR][/LEFT][/FONT][/SIZE]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
	},
    {
	  title: 'Док-ва в соц.сети',
	  content:
'[SIZE=3][FONT=Times New Roman][LEFT]Здравствуйте.[/LEFT]<br>' +
    "[LEFT]Доказательства должны быть загружены на фото/видео хостинги (YouTube, Япикс, imgur).[/LEFT]<br>" +
	'[LEFT][COLOR=#ff0000]Отказано, закрыто.[/COLOR][/LEFT][/FONT][/SIZE]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
     },
	 {
	  title: 'Без условий',
	  content:
'[SIZE=3][FONT=Times New Roman][LEFT]Здравствуйте.[/LEFT]<br>' +
	"[LEFT]В ваших доказательствах не было оговорено условий сделки.[/LEFT]<br>" +
	'[LEFT][COLOR=#ff0000]Отказано, закрыто.[/COLOR][/LEFT][/FONT][/SIZE]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
	},
    {
	  title: 'Док-ва обрываются',
	  content:
'[SIZE=3][FONT=Times New Roman][LEFT]Здравствуйте.[/LEFT]<br>' +
	"[LEFT]Ваши доказательства обрываются, подайте жалобу с загруженными доказательствами на YouTube, либо же другой хостинг.[/LEFT]<br>" +
	'[LEFT][COLOR=#ff0000]Отказано, закрыто.[/COLOR][/LEFT][/FONT][/SIZE]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
	},
    {
	  title: 'Фотошоп/Монтаж',
	  content:
'[SIZE=3][FONT=Times New Roman][LEFT]Здравствуйте.[/LEFT]<br>' +
	"[LEFT]Ваши доказательства были подвержены фотошопу, монтажу. Загрузите доказательства первоначального вида.[/LEFT]<br>" +
	'[LEFT][COLOR=#ff0000]Отказано, закрыто.[/COLOR][/LEFT][/FONT][/SIZE]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
	},
    {
	  title: 'Системные отыгровки',
	  content:
'[SIZE=3][FONT=Times New Roman][LEFT]Здравствуйте.[/LEFT]<br>' +
"[LEFT]Системных отыгровок достаточно при задержании.[/LEFT]<br>" +
	'[LEFT][COLOR=#ff0000]Отказано, закрыто.[/COLOR][/LEFT][/FONT][/SIZE]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
	},
   {
	  title: 'Жалоба от 3-го лица',
	  content:
'[SIZE=3][FONT=Times New Roman][LEFT]Здравствуйте.[/LEFT]<br>' +
"[LEFT]Ваша жалоба составлена от третьего лица. [/LEFT]<br>" +
'[LEFT][COLOR=#ff0000]Отказано, закрыто.[/COLOR][/LEFT][/FONT][/SIZE]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
	},
    {
	  title: 'нужен фрапс',
	  content:
'[SIZE=3][FONT=Times New Roman][LEFT]Здравствуйте.[/LEFT]<br>' +
"[LEFT]В таких случаях нужен фрапс. [/LEFT]<br>" +
'[LEFT][COLOR=#ff0000]Отказано, закрыто.[/COLOR][/LEFT][/FONT][/SIZE]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
	},
    {
          title: 'более 72 часов',
	  content:
'[SIZE=3][FONT=Times New Roman][LEFT]Здравствуйте.[/LEFT]<br>' +
"[LEFT]С момента нарушение прошло более 72 часов. [/LEFT]<br>" +
'[LEFT][COLOR=#ff0000]Отказано, закрыто.[/COLOR][/LEFT][/FONT][/SIZE]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
	},
    {
         title: 'уже наказан',
	  content:
'[SIZE=3][FONT=Times New Roman][LEFT]Здравствуйте.[/LEFT]<br>' +
"[LEFT]Игрок уже наказан.[/LEFT]<br>" +
'[LEFT][COLOR=#38ff4c]Одобрено, закрыто.[/COLOR][/LEFT][/FONT][/SIZE]',
      prefix: ACCEPT_PREFIX,
	  status: false,
	},
    {
          title: 'неполный фрапс',
	  content:
'[SIZE=3][FONT=Times New Roman][LEFT]Здравствуйте.[/LEFT]<br>' +
"[LEFT]Ваш фрапс неполный, загрузите его на youtube.[/LEFT]<br>" +
'[LEFT][COLOR=#ff0000]Отказано, закрыто.[/COLOR][/LEFT][/FONT][/SIZE]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
	},
    {
	  title: '-----------------------------------------------------------На рассмотрение-----------------------------------------------------------',
	},
	{
        title: 'Отправить на рассмотрение',
	  content:
'[SIZE=3][FONT=Times New Roman][LEFT]Здравствуйте.[/LEFT]<br>' +
"[LEFT]Ваша жалоба взята на рассмотрение. Пожалуйста, ожидайте ответа.[/LEFT]<br>" +
'[LEFT][COLOR=#ffd838]На рассмотрении…[/COLOR][/LEFT][/FONT][/SIZE]',
	  prefix: PIN_PREFIX,
	  status: true,
	},
	{
	  title: 'Рассмотрение для теха',
	  content:
'[SIZE=3][FONT=Times New Roman][LEFT]Здравствуйте.[/LEFT]<br>' +
	"[LEFT]Жалоба передана Техническому Специалисту. Ожидайте и не создавайте копий этой жалобы.[/LEFT]<br>" +
	'[LEFT][COLOR=#ffd838]На рассмотрении…[/COLOR][/LEFT][/FONT][/SIZE]',
        prefix: TEH_PREFIX,
	  status: true,
     },
	{
	  title: '-----------------------------------------------------------Правила РП процесса-----------------------------------------------------------',
	},
	{
	  title: 'нрп поведение',
	  content:
'[SIZE=3][FONT=Times New Roman][LEFT]Здравствуйте.[/LEFT]<br><br>' +
     "[LEFT]Игрок будет наказан по следующему пункту правил:<br>[COLOR=#ff0000]2.01.[/COLOR] Запрещено поведение, нарушающее нормы процессов Role Play режима игры [COLOR=#ff0000] | Jail 30 минут [/COLOR] [/LEFT]<br><br>" +
        	'[LEFT][COLOR=#38ff4c]Одобрено, закрыто.[/COLOR][/LEFT][/FONT][/SIZE]',
        prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: 'уход от рп',
	  content:
'[SIZE=3][FONT=Times New Roman][LEFT]Здравствуйте.[/LEFT]<br><br>' +
        "[LEFT]Игрок будет наказан по следующему пункту правил:<br>[COLOR=#ff0000]2.02.[/COLOR] Запрещено целенаправленно уходить от Role Play процесса всеразличными способами[COLOR=#ff0000] | Jail 30 минут / Warn [/COLOR] [/LEFT]<br><br>" +
        	'[LEFT][COLOR=#38ff4c]Одобрено, закрыто.[/COLOR][/LEFT][/FONT][/SIZE]',
        prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: 'nrp drive',
	  content:
'[SIZE=3][FONT=Times New Roman][LEFT]Здравствуйте.[/LEFT]<br><br>' +
"[LEFT]Игрок будет наказан по следующему пункту правил:<br>[COLOR=#ff0000]2.03.[/COLOR] Запрещен NonRP Drive — вождение любого транспортного средства в невозможных для него условиях, а также вождение в неправдоподобной манере [COLOR=#ff0000] | Jail 30 минут. [/COLOR] [/LEFT]<br><br>" +
	'[LEFT][COLOR=#38ff4c]Одобрено, закрыто.[/COLOR][/LEFT][/FONT][/SIZE]',
              prefix: ACCEPT_PREFIX,
	  status: false,
     },
	{
	  title: 'помеха',
	  content:
'[SIZE=3][FONT=Times New Roman][LEFT]Здравствуйте.[/LEFT]<br><br>' +
"[LEFT]Игрок будет наказан по следующему пункту правил:<br>[COLOR=#ff0000]2.04.[/COLOR]Запрещены любые действия способные привести к помехам в игровом процессе, а также выполнению работ, если они этого не предусматривают и если эти действия выходят за рамки игрового процесса данной работы. [COLOR=#ff0000] | Ban 10 дней / Обнуление аккаунта (при повторном нарушении) [/COLOR][/LEFT]<br><br>" +
        	        	'[LEFT][COLOR=#38ff4c]Одобрено, закрыто.[/COLOR][/LEFT][/FONT][/SIZE]',
        prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: 'нрп обман',
	  content:
'[SIZE=3][FONT=Times New Roman][LEFT]Здравствуйте.[/LEFT]<br><br>' +
"[LEFT]Игрок будет наказан по следующему пункту правил:<br>[COLOR=#ff0000]2.05.[/COLOR]Запрещены любые OOC обманы и их попытки, а также любые IC обманы с нарушением Role Play правил и логики[COLOR=#ff0000]| PermBan[/COLOR][/LEFT]<br><br>" +
        	        	'[LEFT][COLOR=#38ff4c]Одобрено, закрыто.[/COLOR][/LEFT][/FONT][/SIZE]',
        prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: 'отыгровка в свою пользу',
	  content:
'[SIZE=3][FONT=Times New Roman][LEFT]Здравствуйте.[/LEFT]<br><br>' +
"[LEFT]Игрок будет наказан по следующему пункту правил:<br>[COLOR=#ff0000]2.06. [/COLOR] Запрещены любые Role Play отыгровки в свою сторону или пользу [COLOR=#ff0000] | Jail 30 минут[/COLOR][/LEFT]<br><br>" +
               	'[LEFT][COLOR=#38ff4c]Одобрено, закрыто.[/COLOR][/LEFT][/FONT][/SIZE]',
        prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: 'аморал',
	  content:
'[SIZE=3][FONT=Times New Roman][LEFT]Здравствуйте.[/LEFT]<br><br>' +
"[LEFT]Игрок будет наказан по следующему пункту правил:<br>[COLOR=#ff0000]2.08. [/COLOR] Запрещена любая форма аморальных действий сексуального характера в сторону игроков [COLOR=#ff0000] | Jail 30 минут / Warn[/COLOR][/LEFT]<br><br>" +
               	'[LEFT][COLOR=#38ff4c]Одобрено, закрыто.[/COLOR][/LEFT][/FONT][/SIZE]',
        prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: 'слив склада',
	  content:
'[SIZE=3][FONT=Times New Roman][LEFT]Здравствуйте.[/LEFT]<br><br>' +
"[LEFT]Игрок будет наказан по следующему пункту правил:<br>[COLOR=#ff0000]2.09. [/COLOR] Запрещено сливать склад фракции / семьи путем взятия большого количестве ресурсов, или же брать больше, чем разрешили на самом деле [COLOR=#ff0000] | Ban 15 - 30 дней / PermBan[/COLOR][/LEFT]<br><br>" +
               	'[LEFT][COLOR=#38ff4c]Одобрено, закрыто.[/COLOR][/LEFT][/FONT][/SIZE]',
        prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: 'обман в /do',
	  content:
'[SIZE=3][FONT=Times New Roman][LEFT]Здравствуйте.[/LEFT]<br><br>' +
"[LEFT]Игрок будет наказан по следующему пункту правил:<br>[COLOR=#ff0000]2.10.[/COLOR]Запрещено в любой форме обманывать в /do, даже если это в дальнейшем негативно скажется на Вашем игровом персонаже [COLOR=#ff0000] | Jail 30 минут / Warn [/COLOR][/LEFT]<br><br>" +
        	        	'[LEFT][COLOR=#38ff4c]Одобрено, закрыто.[/COLOR][/LEFT][/FONT][/SIZE]',
        prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: 'затягивание рп',
	  content:
'[SIZE=3][FONT=Times New Roman][LEFT]Здравствуйте.[/LEFT]<br><br>' +
"[LEFT]Игрок будет наказан по следующему пункту правил:<br>[COLOR=#ff0000]2.12.[/COLOR]Запрещено целенаправленное затягивание Role Play процесса [COLOR=#ff0000] | Jail 30 минут[/COLOR][/LEFT]<br><br>" +
        	        	'[LEFT][COLOR=#38ff4c]Одобрено, закрыто.[/COLOR][/LEFT][/FONT][/SIZE]',
        prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: 'дб',
	  content:
'[SIZE=3][FONT=Times New Roman][LEFT]Здравствуйте.[/LEFT]<br><br>' +
"[LEFT]Игрок будет наказан по следующему пункту правил:<br>[COLOR=#ff0000]2.13.[/COLOR]Запрещен DB (DriveBy) — намеренное убийство / нанесение урона без веской IC причины на любом виде транспорта [COLOR=#ff0000] | Jail 60 минут [/COLOR][/LEFT]<br><br>" +
        	        	'[LEFT][COLOR=#38ff4c]Одобрено, закрыто.[/COLOR][/LEFT][/FONT][/SIZE]',
        prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: 'рк',
	  content:
'[SIZE=3][FONT=Times New Roman][LEFT]Здравствуйте.[/LEFT]<br><br>' +
"[LEFT]Игрок будет наказан по следующему пункту правил:<br>[COLOR=#ff0000]2.14.[/COLOR]Запрещен RK (Revenge Kill) — убийство игрока с целью мести, возвращение на место смерти в течение 15-ти минут, а также использование в дальнейшем информации, которая привела Вас к смерти [COLOR=#ff0000] | Jail 30 минут[/COLOR][/LEFT]<br><br>" +
        	        	'[LEFT][COLOR=#38ff4c]Одобрено, закрыто.[/COLOR][/LEFT][/FONT][/SIZE]',
        prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: 'тк',
	  content:
'[SIZE=3][FONT=Times New Roman][LEFT]Здравствуйте.[/LEFT]<br><br>' +
"[LEFT]Игрок будет наказан по следующему пункту правил:<br>[COLOR=#ff0000]2.15.[/COLOR]Запрещен TK (Team Kill) — убийство члена своей или союзной фракции, организации без наличия какой-либо IC причины [COLOR=#ff0000] | Jail 60 минут / Warn (за два и более убийства)[/COLOR][/LEFT]<br><br>" +
      '[LEFT][COLOR=#38ff4c]Одобрено, закрыто.[/COLOR][/LEFT][/FONT][/SIZE]',
        prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: 'ск',
	  content:
'[SIZE=3][FONT=Times New Roman][LEFT]Здравствуйте.[/LEFT]<br><br>' +
"[LEFT]Игрок будет наказан по следующему пункту правил:<br>[COLOR=#ff0000]2.16. [/COLOR]Запрещен SK (Spawn Kill) — убийство или нанесение урона на титульной территории любой фракции / организации, на месте появления игрока, а также на выходе из закрытых интерьеров и около них [COLOR=#ff0000] | Jail 60 минут / Warn (за два и более убийства)[/COLOR][/LEFT]<br><br>" +
       '[LEFT][COLOR=#38ff4c]Одобрено, закрыто.[/COLOR][/LEFT][/FONT][/SIZE]',
        prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: 'пг',
	  content:
'[SIZE=3][FONT=Times New Roman][LEFT]Здравствуйте.[/LEFT]<br><br>' +
"[LEFT]Игрок будет наказан по следующему пункту правил:<br>[COLOR=#ff0000]2.17.[/COLOR] Запрещен PG (PowerGaming) — присвоение свойств персонажу, не соответствующих реальности, отсутствие страха за свою жизнь [COLOR=#ff0000] | Jail 30 минут [/COLOR][/LEFT]<br><br>" +
        	        	'[LEFT][COLOR=#38ff4c]Одобрено, закрыто.[/COLOR][/LEFT][/FONT][/SIZE]',
        prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: 'мг',
	  content:
'[SIZE=3][FONT=Times New Roman][LEFT]Здравствуйте.[/LEFT]<br><br>' +
"[LEFT]Игрок будет наказан по следующему пункту правил:<br>[COLOR=#ff0000]2.18.[/COLOR] Запрещен MG (MetaGaming) — использование ООС информации, которую Ваш персонаж никак не мог получить в IC процессе [COLOR=#ff0000] | Mute 30 минут[/COLOR][/LEFT]<br><br>" +
        	        	'[LEFT][COLOR=#38ff4c]Одобрено, закрыто.[/COLOR][/LEFT][/FONT][/SIZE]',
        prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: 'дм',
	  content:
'[SIZE=3][FONT=Times New Roman][LEFT]Здравствуйте.[/LEFT]<br><br>' +
"[LEFT]Игрок будет наказан по следующему пункту правил:<br>[COLOR=#ff0000]2.19.[/COLOR] Запрещен DM (DeathMatch) — убийство или нанесение урона без веской IC причины [COLOR=#ff0000] | Jail 60 минут[/COLOR][/LEFT]<br><br>" +
  '[LEFT][COLOR=#38ff4c]Одобрено, закрыто.[/COLOR][/LEFT][/FONT][/SIZE]',
        prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: 'масс дм',
	  content:
'[SIZE=3][FONT=Times New Roman][LEFT]Здравствуйте.[/LEFT]<br><br>' +
"[LEFT]Игрок будет наказан по следующему пункту правил:<br>[COLOR=#ff0000]2.20. [/COLOR]Запрещен Mass DM (Mass DeathMatch) — убийство или нанесение урона без веской IC причины трем игрокам и более [COLOR=#ff0000] | Warn / Ban 3 - 7 дней[/COLOR][/LEFT]<br><br>" +
        	        	'[LEFT][COLOR=#38ff4c]Одобрено, закрыто.[/COLOR][/LEFT][/FONT][/SIZE]',
        prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: 'использование багов',
	  content:
'[SIZE=3][FONT=Times New Roman][LEFT]Здравствуйте.[/LEFT]<br><br>' +
"[LEFT]Игрок будет наказан по следующему пункту правил:<br>[COLOR=#ff0000]2.21. [/COLOR]Запрещено пытаться обходить игровую систему или использовать любые баги сервера [COLOR=#ff0000]| Ban 15 - 30 дней /PermBan (по согласованию с ГА, ЗГА, руководством тех. специалистов)[/COLOR][/LEFT]<br><br>" +
        	        	'[LEFT][COLOR=#38ff4c]Одобрено, закрыто.[/COLOR][/LEFT][/FONT][/SIZE]',
        prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	    	  title: 'читы',
	  content:
'[SIZE=3][FONT=Times New Roman][LEFT]Здравствуйте.[/LEFT]<br><br>' +
"[LEFT]Игрок будет наказан по следующему пункту правил:<br>[COLOR=#ff0000]2.22. [/COLOR]Запрещено хранить / использовать / распространять стороннее программное обеспечение или любые другие средства, позволяющие получить преимущество над другими игроками [COLOR=#ff0000]| Ban 15 - 30 дней / PermBan[/COLOR][/LEFT]<br><br>" +
	'[LEFT][COLOR=#38ff4c]Одобрено, закрыто.[/COLOR][/LEFT][/FONT][/SIZE]',
        prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	    	    	  title: 'слив адм инфы',
	  content:
'[SIZE=3][FONT=Times New Roman][LEFT]Здравствуйте.[/LEFT]<br><br>' +
"[LEFT]Игрок будет наказан по следующему пункту правил:<br>[COLOR=#ff0000]2.27. [/COLOR]Запрещено распространение информации и материалов, которые имеют непосредственное отношение к работе администрации проекта [COLOR=#ff0000]| PermBan + ЧС проекта[/COLOR][/LEFT]<br><br>" +
	'[LEFT][COLOR=#38ff4c]Одобрено, закрыто.[/COLOR][/LEFT][/FONT][/SIZE]',
        prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: 'реклама',
	  content:
'[SIZE=3][FONT=Times New Roman][LEFT]Здравствуйте.[/LEFT]<br><br>' +
"[LEFT]Игрок будет наказан по следующему пункту правил:<br>[COLOR=#ff0000]2.31. [/COLOR] Запрещено рекламировать на серверах любые проекты, серверы, сайты, сторонние Discord-серверы, YouTube каналы и тому подобное [COLOR=#ff0000] | Ban 7 дней / PermBan[/COLOR][/LEFT]<br><br>" +
        	        	'[LEFT][COLOR=#38ff4c]Одобрено, закрыто.[/COLOR][/LEFT][/FONT][/SIZE]',
        prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: 'обман адм',
	  content:
'[SIZE=3][FONT=Times New Roman][LEFT]Здравствуйте.[/LEFT]<br><br>' +
"[LEFT]Игрок будет наказан по следующему пункту правил:<br>[COLOR=#ff0000]2.32. [/COLOR]Запрещено введение в заблуждение, обман администрации на всех ресурсах проекта [COLOR=#ff0000] | Ban 7 - 15 дней[/COLOR][/LEFT]<br><br>" +
        	        	'[LEFT][COLOR=#38ff4c]Одобрено, закрыто.[/COLOR][/LEFT][/FONT][/SIZE]',
        prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: 'уязвимость',
	  content:
'[SIZE=3][FONT=Times New Roman][LEFT]Здравствуйте.[/LEFT]<br><br>' +
"[LEFT]Игрок будет наказан по следующему пункту правил:<br>[COLOR=#ff0000]2.33. [/COLOR]Запрещено пользоваться уязвимостью правил[COLOR=#ff0000] | Ban 15 дней[/COLOR][/LEFT]<br><br>" +
        	        	'[LEFT][COLOR=#38ff4c]Одобрено, закрыто.[/COLOR][/LEFT][/FONT][/SIZE]',
        prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: 'ic/ooc конфликты(религия)',
	  content:
'[SIZE=3][FONT=Times New Roman][LEFT]Здравствуйте.[/LEFT]<br><br>' +
"[LEFT]Игрок будет наказан по следующему пункту правил:<br>[COLOR=#ff0000]2.35. [/COLOR] На игровых серверах запрещено устраивать IC и OOC конфликты на почве разногласия о национальности и / или религии совершенно в любом формате[COLOR=#ff0000] | Mute 120 минут / Ban 7 дней[/COLOR][/LEFT]<br><br>" +
        	        	'[LEFT][COLOR=#38ff4c]Одобрено, закрыто.[/COLOR][/LEFT][/FONT][/SIZE]',
        prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: 'перенос конфликтов',
	  content:
'[SIZE=3][FONT=Times New Roman][LEFT]Здравствуйте.[/LEFT]<br><br>' +
"[LEFT]Игрок будет наказан по следующему пункту правил:<br>[COLOR=#ff0000]2.36. [/COLOR]Запрещено переносить конфликты из IC в OOC и наоборот[COLOR=#ff0000]| Warn[/COLOR][/LEFT]<br><br>" +
        	        	'[LEFT][COLOR=#38ff4c]Одобрено, закрыто.[/COLOR][/LEFT][/FONT][/SIZE]',
        prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: 'ooc угрозы',
	  content:
'[SIZE=3][FONT=Times New Roman][LEFT]Здравствуйте.[/LEFT]<br><br>' +
"[LEFT]Игрок будет наказан по следующему пункту правил:<br>[COLOR=#ff0000]2.37. [/COLOR] Запрещены OOC угрозы, в том числе и завуалированные[COLOR=#ff0000] | Mute 120 минут / Ban 7 дней[/COLOR][/LEFT]<br><br>" +
        	        	'[LEFT][COLOR=#38ff4c]Одобрено, закрыто.[/COLOR][/LEFT][/FONT][/SIZE]',
        prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: 'личная инфа',
	  content:
'[SIZE=3][FONT=Times New Roman][LEFT]Здравствуйте.[/LEFT]<br><br>' +
"[LEFT]Игрок будет наказан по следующему пункту правил:<br>[COLOR=#ff0000]2.38. [/COLOR] Запрещено распространять личную информацию игроков и их родственников[COLOR=#ff0000] | Ban 15 - 30 дней / PermBan[/COLOR][/LEFT]<br><br>" +
        	        	'[LEFT][COLOR=#38ff4c]Одобрено, закрыто.[/COLOR][/LEFT][/FONT][/SIZE]',
        prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: 'оск проекта',
	  content:
'[SIZE=3][FONT=Times New Roman][LEFT]Здравствуйте.[/LEFT]<br><br>' +
"[LEFT]Игрок будет наказан по следующему пункту правил:<br>[COLOR=#ff0000]2.40. [/COLOR]  Запрещены совершенно любые деструктивные действия по отношению к проекту: неконструктивная критика, призывы покинуть проект, попытки нарушить развитие проекта или любые другие действия, способные привести к помехам в игровом процессе[COLOR=#ff0000] | Mute 300 минут / Ban 30 дней (Ban выдается по согласованию с главным администратором)[/COLOR][/LEFT]<br><br>" +
        	        	'[LEFT][COLOR=#38ff4c]Одобрено, закрыто.[/COLOR][/LEFT][/FONT][/SIZE]',
        prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: 'продажа промо',
	  content:
'[SIZE=3][FONT=Times New Roman][LEFT]Здравствуйте.[/LEFT]<br><br>' +
"[LEFT]Игрок будет наказан по следующему пункту правил:<br>[COLOR=#ff0000]2.43. [/COLOR] Запрещена продажа / обмен / покупка поощрительной составляющей от лица проекта, будь то бонус-код, либо промокод, который выдается безвозмездно игрокам в целях промоакций[COLOR=#ff0000] | Mute 120 минут[/COLOR][/LEFT]<br><br>" +
        	        	'[LEFT][COLOR=#38ff4c]Одобрено, закрыто.[/COLOR][/LEFT][/FONT][/SIZE]',
        prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: 'епп',
	  content:
'[SIZE=3][FONT=Times New Roman][LEFT]Здравствуйте.[/LEFT]<br><br>' +
"[LEFT]Игрок будет наказан по следующему пункту правил:<br>[COLOR=#ff0000]2.46.[/COLOR] Запрещено ездить по полям на любом транспорте [COLOR=#ff0000] | Jail 30 минут[/COLOR][/LEFT]<br><br>" +
        	        	'[LEFT][COLOR=#38ff4c]Одобрено, закрыто.[/COLOR][/LEFT][/FONT][/SIZE]',
        prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: 'епп фура/инко',
	  content:
'[SIZE=3][FONT=Times New Roman][LEFT]Здравствуйте.[/LEFT]<br><br>' +
"[LEFT]Игрок будет наказан по следующему пункту правил:<br>[COLOR=#ff0000]2.47.[/COLOR] Запрещено ездить по полям на грузовом транспорте, инкассаторских машинах (работа дальнобойщика, инкассатора) [COLOR=#ff0000] | Jail 60 минут[/COLOR][/LEFT]<br><br>" +
        	        	'[LEFT][COLOR=#38ff4c]Одобрено, закрыто.[/COLOR][/LEFT][/FONT][/SIZE]',
        prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: 'нрп арест',
	  content:
'[SIZE=3][FONT=Times New Roman][LEFT]Здравствуйте.[/LEFT]<br><br>' +
"[LEFT]Игрок будет наказан по следующему пункту правил:<br>[COLOR=#ff0000]2.50.[/COLOR] Запрещены задержания, аресты, а также любые действия со стороны игроков, состоящих во фракциях в интерьере аукциона, казино, а также во время системных мероприятий [COLOR=#ff0000]| Ban 7 - 15 дней + увольнение из организации[/COLOR][/LEFT]<br><br>" +
        	        	'[LEFT][COLOR=#38ff4c]Одобрено, закрыто.[/COLOR][/LEFT][/FONT][/SIZE]',
        prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: 'вмешательство в рп',
	  content:
'[SIZE=3][FONT=Times New Roman][LEFT]Здравствуйте.[/LEFT]<br><br>' +
"[LEFT]Игрок будет наказан по следующему пункту правил:<br>[COLOR=#ff0000]2.51.[/COLOR]Запрещено вмешательство в Role Play процесс с целью помехи и препятствования дальнейшего развития Role Play процесса[COLOR=#ff0000]| Jail 30 минут[/COLOR][/LEFT]<br><br>" +
        	        	'[LEFT][COLOR=#38ff4c]Одобрено, закрыто.[/COLOR][/LEFT][/FONT][/SIZE]',
        prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: 'нрп акс',
	  content:
'[SIZE=3][FONT=Times New Roman][LEFT]Здравствуйте.[/LEFT]<br><br>' +
"[LEFT]Игрок будет наказан по следующему пункту правил:<br>[COLOR=#ff0000]2.52.[/COLOR]Запрещено располагать аксессуары на теле персонажа, нарушая нормы морали и этики, увеличивать аксессуары до слишком большого размера. [COLOR=#ff0000]| При первом нарушении - обнуление аксессуаров, при повторном нарушении - обнуление аксессуаров + JAIL 30 минут[/COLOR][/LEFT]<br><br>" +
        	        	'[LEFT][COLOR=#38ff4c]Одобрено, закрыто.[/COLOR][/LEFT][/FONT][/SIZE]',
        prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: 'оск адм',
	  content:
'[SIZE=3][FONT=Times New Roman][LEFT]Здравствуйте.[/LEFT]<br><br>' +
"[LEFT]Игрок будет наказан по следующему пункту правил:<br>[COLOR=#ff0000]2.54.[/COLOR]Запрещено неуважительное обращение, оскорбление, неадекватное поведение, угрозы в любом их проявлении по отношению к администрации[COLOR=#ff0000]| Mute 180 минут[/COLOR][/LEFT]<br><br>" +
        	        	'[LEFT][COLOR=#38ff4c]Одобрено, закрыто.[/COLOR][/LEFT][/FONT][/SIZE]',
        prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: 'баг аним',
	  content:
'[SIZE=3][FONT=Times New Roman][LEFT]Здравствуйте.[/LEFT]<br><br>' +
"[LEFT]Игрок будет наказан по следующему пункту правил:<br>[COLOR=#ff0000]2.55.[/COLOR]Запрещается багоюз связанный с анимацией в любых проявлениях. [COLOR=#ff0000] | Jail 60 / 120 минут[/COLOR][/LEFT]<br><br>" +
        	        	'[LEFT][COLOR=#38ff4c]Одобрено, закрыто.[/COLOR][/LEFT][/FONT][/SIZE]',
        prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: '-----------------------------------------------------------Игровые чаты-----------------------------------------------------------',
	},
	{
	  title: 'язык',
	  content:
'[SIZE=3][FONT=Times New Roman][LEFT]Здравствуйте.[/LEFT]<br><br>' +
"[LEFT]Игрок будет наказан по следующему пункту правил:<br>[COLOR=#ff0000]3.01.[/COLOR] Общепризнанный язык сервера — русский. Общение в IC чатах во всех Role Play ситуациях обязательно должно проходить исключительно на русском языке[COLOR=#ff0000] | Устное замечание / Mute 30 минут[/COLOR][/LEFT]<br><br>" +
        	        	'[LEFT][COLOR=#38ff4c]Одобрено, закрыто.[/COLOR][/LEFT][/FONT][/SIZE]',
        prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: 'капс',
	  content:
'[SIZE=3][FONT=Times New Roman][LEFT]Здравствуйте.[/LEFT]<br><br>' +
"[LEFT]Игрок будет наказан по следующему пункту правил:<br>[COLOR=#ff0000]3.02.[/COLOR] Запрещено использование верхнего регистра (CapsLock) при написании любого текста в любом чате[COLOR=#ff0000]| Mute 30 минут[/COLOR][/LEFT]<br><br>" +
        	        	'[LEFT][COLOR=#38ff4c]Одобрено, закрыто.[/COLOR][/LEFT][/FONT][/SIZE]',
        prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: 'оск в оос чат',
	  content:
'[SIZE=3][FONT=Times New Roman][LEFT]Здравствуйте.[/LEFT]<br><br>' +
"[LEFT]Игрок будет наказан по следующему пункту правил:<br>[COLOR=#ff0000]3.03.[/COLOR] Любые формы оскорблений, издевательств, расизма, дискриминации, религиозной враждебности, сексизма в OOC чате запрещены[COLOR=#ff0000] | Mute 30 минут[/COLOR][/LEFT]<br><br>" +
        	        	'[LEFT][COLOR=#38ff4c]Одобрено, закрыто.[/COLOR][/LEFT][/FONT][/SIZE]',
        prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: 'упом/оск родни',
	  content:
'[SIZE=3][FONT=Times New Roman][LEFT]Здравствуйте.[/LEFT]<br><br>' +
"[LEFT]Игрок будет наказан по следующему пункту правил:<br>[COLOR=#ff0000]3.04.[/COLOR] Запрещено оскорбление или косвенное упоминание родных вне зависимости от чата (IC или OOC)[COLOR=#ff0000]| Mute 120 минут / Ban 7 - 15 дней[/COLOR][/LEFT]<br><br>" +
        	        	'[LEFT][COLOR=#38ff4c]Одобрено, закрыто.[/COLOR][/LEFT][/FONT][/SIZE]',
        prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: 'флуд',
	  content:
'[SIZE=3][FONT=Times New Roman][LEFT]Здравствуйте.[/LEFT]<br><br>' +
"[LEFT]Игрок будет наказан по следующему пункту правил:<br>[COLOR=#ff0000]3.05.[/COLOR] Запрещен флуд — 3 и более повторяющихся сообщений от одного и того же игрока [COLOR=#ff0000] | Mute 30 минут[/COLOR][/LEFT]<br><br>" +
        	        	'[LEFT][COLOR=#38ff4c]Одобрено, закрыто.[/COLOR][/LEFT][/FONT][/SIZE]',
        prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: 'злоуп. знаками',
	  content:
'[SIZE=3][FONT=Times New Roman][LEFT]Здравствуйте.[/LEFT]<br><br>' +
"[LEFT]Игрок будет наказан по следующему пункту правил:<br>[COLOR=#ff0000]3.06.[/COLOR]Запрещено злоупотребление знаков препинания и прочих символов[COLOR=#ff0000] | Mute 30 минут[/COLOR][/LEFT]<br><br>" +
        	        	'[LEFT][COLOR=#38ff4c]Одобрено, закрыто.[/COLOR][/LEFT][/FONT][/SIZE]',
        prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: 'оск',
	  content:
'[SIZE=3][FONT=Times New Roman][LEFT]Здравствуйте.[/LEFT]<br><br>' +
"[LEFT]Игрок будет наказан по следующему пункту правил:<br>[COLOR=#ff0000]3.07.[/COLOR] Запрещены совершенно любые оскорбления или действия, порочащие честь и достоинства, несущие в себе подтекст сексуального характера вне зависимости от чата [COLOR=#ff0000] | Mute 30 минут[/COLOR][/LEFT]<br><br>" +
        	        	'[LEFT][COLOR=#38ff4c]Одобрено, закрыто.[/COLOR][/LEFT][/FONT][/SIZE]',
        prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: 'слив чата',
	  content:
'[SIZE=3][FONT=Times New Roman][LEFT]Здравствуйте.[/LEFT]<br><br>' +
"[LEFT]Игрок будет наказан по следующему пункту правил:<br>[COLOR=#ff0000]3.08.[/COLOR]Запрещены любые формы «слива» посредством использования глобальных чатов[COLOR=#ff0000] | PermBan[/COLOR][/LEFT]<br><br>" +
        	        	'[LEFT][COLOR=#38ff4c]Одобрено, закрыто.[/COLOR][/LEFT][/FONT][/SIZE]',
        prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: 'угрозы нак. со ст. адм',
	  content:
'[SIZE=3][FONT=Times New Roman][LEFT]Здравствуйте.[/LEFT]<br><br>' +
"[LEFT]Игрок будет наказан по следующему пункту правил:<br>[COLOR=#ff0000]3.09.[/COLOR] Запрещены любые угрозы о наказании игрока со стороны администрации[COLOR=#ff0000] | Mute 30 минут[/COLOR][/LEFT]<br><br>" +
        	        	'[LEFT][COLOR=#38ff4c]Одобрено, закрыто.[/COLOR][/LEFT][/FONT][/SIZE]',
        prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: 'выдача себя за адм',
	  content:
'[SIZE=3][FONT=Times New Roman][LEFT]Здравствуйте.[/LEFT]<br><br>' +
"[LEFT]Игрок будет наказан по следующему пункту правил:<br>[COLOR=#ff0000]3.10.[/COLOR] Запрещена выдача себя за администратора, если таковым не являетесь [COLOR=#ff0000] | Ban 7 - 15 + ЧС администрации[/COLOR][/LEFT]<br><br>" +
        	        	'[LEFT][COLOR=#38ff4c]Одобрено, закрыто.[/COLOR][/LEFT][/FONT][/SIZE]',
        prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: 'ввод в забл.(командами)',
	  content:
'[SIZE=3][FONT=Times New Roman][LEFT]Здравствуйте.[/LEFT]<br><br>' +
"[LEFT]Игрок будет наказан по следующему пункту правил:<br>[COLOR=#ff0000]3.11.[/COLOR] Запрещено введение игроков проекта в заблуждение путем злоупотребления командами[COLOR=#ff0000]| Ban 15 - 30 дней / PermBan[/COLOR][/LEFT]<br><br>" +
        	        	'[LEFT][COLOR=#38ff4c]Одобрено, закрыто.[/COLOR][/LEFT][/FONT][/SIZE]',
        prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: 'оффтоп/капс в реп',
	  content:
'[SIZE=3][FONT=Times New Roman][LEFT]Здравствуйте.[/LEFT]<br><br>' +
"[LEFT]Игрок будет наказан по следующему пункту правил:<br>[COLOR=#ff0000]3.12.[/COLOR] Запрещено подавать репорт написанный транслитом, с сообщением не по теме (Offtop), с включенным Caps Lock и повторять обращение (если ответ был уже дан ранее)[COLOR=#ff0000] | Report Mute 30 минут[/COLOR][/LEFT]<br><br>" +
        	        	'[LEFT][COLOR=#38ff4c]Одобрено, закрыто.[/COLOR][/LEFT][/FONT][/SIZE]',
        prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: 'мат в реп',
	  content:
'[SIZE=3][FONT=Times New Roman][LEFT]Здравствуйте.[/LEFT]<br><br>' +
"[LEFT]Игрок будет наказан по следующему пункту правил:<br>[COLOR=#ff0000]3.13.[/COLOR] Запрещено подавать репорт с использованием нецензурной брани[COLOR=#ff0000] | Report Mute 30 минут[/COLOR][/LEFT]<br><br>" +
        	        	'[LEFT][COLOR=#38ff4c]Одобрено, закрыто.[/COLOR][/LEFT][/FONT][/SIZE]',
        prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: 'музыка в войс',
	  content:
'[SIZE=3][FONT=Times New Roman][LEFT]Здравствуйте.[/LEFT]<br><br>' +
"[LEFT]Игрок будет наказан по следующему пункту правил:<br>[COLOR=#ff0000]3.14.[/COLOR] Запрещено включать музыку в Voice Chat [COLOR=#ff0000] | Mute 60 минут[/COLOR][/LEFT]<br><br>" +
        	        	'[LEFT][COLOR=#38ff4c]Одобрено, закрыто.[/COLOR][/LEFT][/FONT][/SIZE]',
        prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: 'оск игрок/родных в войс',
	  content:
'[SIZE=3][FONT=Times New Roman][LEFT]Здравствуйте.[/LEFT]<br><br>' +
"[LEFT]Игрок будет наказан по следующему пункту правил:<br>[COLOR=#ff0000]3.15.[/COLOR] Запрещено оскорблять игроков или родных в Voice Chat[COLOR=#ff0000] | Mute 120 минут / Ban 7 - 15 дней[/COLOR][/LEFT]<br><br>" +
        	        	'[LEFT][COLOR=#38ff4c]Одобрено, закрыто.[/COLOR][/LEFT][/FONT][/SIZE]',
        prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: 'шум в войс',
	  content:
'[SIZE=3][FONT=Times New Roman][LEFT]Здравствуйте.[/LEFT]<br><br>' +
"[LEFT]Игрок будет наказан по следующему пункту правил:<br>[COLOR=#ff0000]3.16.[/COLOR] Запрещено создавать посторонние шумы или звуки [COLOR=#ff0000]| Mute 30 минут[/COLOR][/LEFT]<br><br>" +
        	        	'[LEFT][COLOR=#38ff4c]Одобрено, закрыто.[/COLOR][/LEFT][/FONT][/SIZE]',
        prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: 'реклама в войс',
	  content:
'[SIZE=3][FONT=Times New Roman][LEFT]Здравствуйте.[/LEFT]<br><br>' +
"[LEFT]Игрок будет наказан по следующему пункту правил:<br>[COLOR=#ff0000]3.17.[/COLOR] Запрещена реклама в Voice Chat не связанная с игровым процессом[COLOR=#ff0000]| Ban 7 - 15 дней[/COLOR][/LEFT]<br><br>" +
        	        	'[LEFT][COLOR=#38ff4c]Одобрено, закрыто.[/COLOR][/LEFT][/FONT][/SIZE]',
        prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: 'пропаганда/провокация',
	  content:
'[SIZE=3][FONT=Times New Roman][LEFT]Здравствуйте.[/LEFT]<br><br>' +
"[LEFT]Игрок будет наказан по следующему пункту правил:<br>[COLOR=#ff0000]3.18.[/COLOR] Запрещено политическое и религиозное пропагандирование, а также провокация игроков к конфликтам, коллективному флуду или беспорядкам в любом из чатов[COLOR=#ff0000]| Mute 120 минут / Ban 10 дней[/COLOR][/LEFT]<br><br>" +
        	        	'[LEFT][COLOR=#38ff4c]Одобрено, закрыто.[/COLOR][/LEFT][/FONT][/SIZE]',
        prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: 'софт для изм. голоса',
	  content:
'[SIZE=3][FONT=Times New Roman][LEFT]Здравствуйте.[/LEFT]<br><br>' +
"[LEFT]Игрок будет наказан по следующему пункту правил:<br>[COLOR=#ff0000]3.19.[/COLOR] Запрещено использование любого софта для изменения голоса [COLOR=#ff0000]| Mute 60 минут[/COLOR][/LEFT]<br><br>" +
        	        	'[LEFT][COLOR=#38ff4c]Одобрено, закрыто.[/COLOR][/LEFT][/FONT][/SIZE]',
        prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: 'транслит',
	  content:
'[SIZE=3][FONT=Times New Roman][LEFT]Здравствуйте.[/LEFT]<br><br>' +
"[LEFT]Игрок будет наказан по следующему пункту правил:<br>[COLOR=#ff0000]3.20.[/COLOR] Запрещено использование транслита в любом из чатов[COLOR=#ff0000]| Mute 30 минут[/COLOR][/LEFT]<br><br>" +
        	        	'[LEFT][COLOR=#38ff4c]Одобрено, закрыто.[/COLOR][/LEFT][/FONT][/SIZE]',
        prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: 'реклама промо',
	  content:
'[SIZE=3][FONT=Times New Roman][LEFT]Здравствуйте.[/LEFT]<br><br>' +
"[LEFT]Игрок будет наказан по следующему пункту правил:<br>[COLOR=#ff0000]3.21.[/COLOR] Запрещается реклама промокодов в игре, а также их упоминание в любом виде во всех чатах.[COLOR=#ff0000]| Ban 30 дней[/COLOR][/LEFT]<br><br>" +
        	        	'[LEFT][COLOR=#38ff4c]Одобрено, закрыто.[/COLOR][/LEFT][/FONT][/SIZE]',
        prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: 'объявления на тт госс',
	  content:
'[SIZE=3][FONT=Times New Roman][LEFT]Здравствуйте.[/LEFT]<br><br>' +
"[LEFT]Игрок будет наказан по следующему пункту правил:<br>[COLOR=#ff0000]3.22.[/COLOR] Запрещено публиковать любые объявления в помещениях государственных организаций вне зависимости от чата (IC или OOC)[COLOR=#ff0000]| Mute 30 минут[/COLOR][/LEFT]<br><br>" +
        	        	'[LEFT][COLOR=#38ff4c]Одобрено, закрыто.[/COLOR][/LEFT][/FONT][/SIZE]',
        prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: 'маты в вип',
	  content:
'[SIZE=3][FONT=Times New Roman][LEFT]Здравствуйте.[/LEFT]<br><br>' +
"[LEFT]Игрок будет наказан по следующему пункту правил:<br>[COLOR=#ff0000]3.23.[/COLOR]Запрещено использование нецензурных слов, в том числе завуалированных и литературных в VIP чате[COLOR=#ff0000]| Mute 30 минут[/COLOR][/LEFT]<br><br>" +
        	        	'[LEFT][COLOR=#38ff4c]Одобрено, закрыто.[/COLOR][/LEFT][/FONT][/SIZE]',
        prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: '-----------------------------------------------------------Положение об игровых аккаунтах-----------------------------------------------------------',
	},
	{
	  title: 'нрп ник',
	  content:
'[SIZE=3][FONT=Times New Roman][LEFT]Здравствуйте.[/LEFT]<br><br>' +
"[LEFT]Игрок будет наказан по следующему пункту правил:<br>[COLOR=#ff0000]4.06.[/COLOR]Никнейм игрового аккаунта должен быть в формате Имя_Фамилия на английском языке[COLOR=#ff0000]| Устное замечание + смена игрового никнейма[/COLOR][/LEFT]<br><br>" +
        	        	'[LEFT][COLOR=#38ff4c]Одобрено, закрыто.[/COLOR][/LEFT][/FONT][/SIZE]',
        prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: '2+ заглавные буквы',
	  content:
'[SIZE=3][FONT=Times New Roman][LEFT]Здравствуйте.[/LEFT]<br><br>' +
"[LEFT]Игрок будет наказан по следующему пункту правил:<br>[COLOR=#ff0000]4.07.[/COLOR]В игровом никнейме запрещено использовать более двух заглавных букв[COLOR=#ff0000]| Устное замечание + смена игрового никнейма[/COLOR][/LEFT]<br><br>" +
        	        	'[LEFT][COLOR=#38ff4c]Одобрено, закрыто.[/COLOR][/LEFT][/FONT][/SIZE]',
        prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: 'выдуманный ник',
	  content:
'[SIZE=3][FONT=Times New Roman][LEFT]Здравствуйте.[/LEFT]<br><br>' +
"[LEFT]Игрок будет наказан по следующему пункту правил:<br>[COLOR=#ff0000]4.08.[/COLORЗапрещено использовать никнейм, который не соответствует реальным именам и фамилиям и не несет в себе абсолютно никакой смысловой нагрузки[COLOR=#ff0000]| Устное замечание + смена игрового никнейма[/COLOR][/LEFT]<br><br>" +
        	        	'[LEFT][COLOR=#38ff4c]Одобрено, закрыто.[/COLOR][/LEFT][/FONT][/SIZE]',
        prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: 'маты в нике',
	  content:
'[SIZE=3][FONT=Times New Roman][LEFT]Здравствуйте.[/LEFT]<br><br>' +
"[LEFT]Игрок будет наказан по следующему пункту правил:<br>[COLOR=#ff0000]4.09.[/COLOR] Запрещено использовать никнейм, содержащий в себе матерные слова или оскорбления (в том числе, завуалированные)[COLOR=#ff0000]| Устное замечание + смена игрового никнейма / PermBan[/COLOR][/LEFT]<br><br>" +
        	        	'[LEFT][COLOR=#38ff4c]Одобрено, закрыто.[/COLOR][/LEFT][/FONT][/SIZE]',
        prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: 'скопированный ник',
	  content:
'[SIZE=3][FONT=Times New Roman][LEFT]Здравствуйте.[/LEFT]<br><br>' +
"[LEFT]Игрок будет наказан по следующему пункту правил:<br>[COLOR=#ff0000]4.10.[/COLOR]Запрещено создавать никнейм, повторяющий или похожий на существующие никнеймы игроков или администраторов по их написанию[COLOR=#ff0000]| Устное замечание + смена игрового никнейма / PermBan[/COLOR][/LEFT]<br><br>" +
        	        	'[LEFT][COLOR=#38ff4c]Одобрено, закрыто.[/COLOR][/LEFT][/FONT][/SIZE]',
        prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: '-----------------------------------------------------------Правила ГОСС-----------------------------------------------------------',
	},
	{
	  title: 'госс подработка',
	  content:
'[SIZE=3][FONT=Times New Roman][LEFT]Здравствуйте.[/LEFT]<br><br>' +
"[LEFT]Игрок будет наказан по следующему пункту правил:<br>[COLOR=#ff0000]1.07.[/COLOR] Всем сотрудникам государственных организаций запрещено выполнять работы где-либо в форме, принадлежащей своей фракции [COLOR=#ff0000]| Jail 30 минут[/COLOR][/LEFT]<br><br>" +
	'[LEFT][COLOR=#38ff4c]Одобрено, закрыто.[/COLOR][/LEFT][/FONT][/SIZE]',
        prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: 'т/с в лич. целях',
	  content:
'[SIZE=3][FONT=Times New Roman][LEFT]Здравствуйте.[/LEFT]<br><br>' +
"[LEFT]Игрок будет наказан по следующему пункту правил:<br>[COLOR=#ff0000]2.11.[/COLOR] Запрещено использование рабочего или фракционного транспорта в личных целях [COLOR=#ff0000]| Jail 30 минут [/COLOR][/LEFT]<br><br>" +
        	        	'[LEFT][COLOR=#38ff4c]Одобрено, закрыто.[/COLOR][/LEFT][/FONT][/SIZE]',
        prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: 'одиночный патруль',
	  content:
'[SIZE=3][FONT=Times New Roman][LEFT]Здравствуйте.[/LEFT]<br><br>' +
"[LEFT]Игрок будет наказан по следующему пункту правил:<br>[COLOR=#ff0000]1.11.[/COLOR]Всем силовым структурам запрещен одиночный патруль или конвоирование, минимум 2 сотрудника [COLOR=#ff0000] | Jail 30 минут[/COLOR][/LEFT]<br><br>" +
        	        	'[LEFT][COLOR=#38ff4c]Одобрено, закрыто.[/COLOR][/LEFT][/FONT][/SIZE]',
        prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: 'госс казино/бу',
	  content:
'[SIZE=3][FONT=Times New Roman][LEFT]Здравствуйте.[/LEFT]<br><br>' +
"[LEFT]Игрок будет наказан по следующему пункту правил:<br>[COLOR=#ff0000]1.13.[/COLOR] Запрещено находиться в форме внутри казино, участвовать в битве за контейнеры, участвовать в захвате семейного контейнера, находится на Б/У рынке с целью покупки / продажи авто, а также устраиваться на сторонние работы в форме фракции [COLOR=#ff0000] | Jail 30 минут[/COLOR][/LEFT]<br><br>" +
        	        	'[LEFT][COLOR=#38ff4c]Одобрено, закрыто.[/COLOR][/LEFT][/FONT][/SIZE]',
        prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: 'арест на бв',
	  content:
'[SIZE=3][FONT=Times New Roman][LEFT]Здравствуйте.[/LEFT]<br><br>' +
"[LEFT]Игрок будет наказан по следующему пункту правил:<br>[COLOR=#ff0000]1.14.[/COLOR]Сотрудникам правоохранительных органов запрещается задерживать состав участников войны за бизнес за 10 минут непосредственно до начала самого бизвара. [COLOR=#ff0000]| Jail 30 минут. [/COLOR][/LEFT]<br><br>" +
        	        	'[LEFT][COLOR=#38ff4c]Одобрено, закрыто.[/COLOR][/LEFT][/FONT][/SIZE]',
        prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: 'масс дм (мо)',
	  content:
'[SIZE=3][FONT=Times New Roman][LEFT]Здравствуйте.[/LEFT]<br><br>' +
"[LEFT]Игрок будет наказан по следующему пункту правил:<br>[COLOR=#ff0000]2.02.[/COLOR] Наносить урон игрокам, которые находятся вне территории воинской части, запрещено [COLOR=#ff0000] | DM / Jail 60 минут / Warn[/COLOR][/LEFT]<br><br>" +
        	        	'[LEFT][COLOR=#38ff4c]Одобрено, закрыто.[/COLOR][/LEFT][/FONT][/SIZE]',
        prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
        	  title: 'нпро',
	  content:
'[SIZE=3][FONT=Times New Roman][LEFT]Здравствуйте.[/LEFT]<br><br>' +
"[LEFT]Игрок будет наказан по следующему пункту правил:<br>[COLOR=#ff0000]4.01.[/COLOR]Запрещено редактирование объявлений, не соответствующих ПРО[COLOR=#ff0000] | Mute 30 минут[/COLOR][/LEFT]<br><br>" +
        	        	'[LEFT][COLOR=#38ff4c]Одобрено, закрыто.[/COLOR][/LEFT][/FONT][/SIZE]',
        prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
                	  title: 'нрп эфир',
	  content:
'[SIZE=3][FONT=Times New Roman][LEFT]Здравствуйте.[/LEFT]<br><br>' +
"[LEFT]Игрок будет наказан по следующему пункту правил:<br>[COLOR=#ff0000]4.02.[/COLOR]Запрещено проведение эфиров, не соответствующих Role Play правилам и логике[COLOR=#ff0000] | Mute 30 минут[/COLOR][/LEFT]<br><br>" +
        	        	'[LEFT][COLOR=#38ff4c]Одобрено, закрыто.[/COLOR][/LEFT][/FONT][/SIZE]',
        prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
                	  title: 'замена объявл.',
	  content:
'[SIZE=3][FONT=Times New Roman][LEFT]Здравствуйте.[/LEFT]<br><br>' +
"[LEFT]Игрок будет наказан по следующему пункту правил:<br>[COLOR=#ff0000]4.04.[/COLOR]Запрещено редактировать поданные объявления в личных целях заменяя текст объявления на несоответствующий отправленному игроком[COLOR=#ff0000] | Ban 7 дней + ЧС организации[/COLOR][/LEFT]<br><br>" +
        	        	'[LEFT][COLOR=#38ff4c]Одобрено, закрыто.[/COLOR][/LEFT][/FONT][/SIZE]',
        prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: 'дм на тт умвд',
	  content:
'[SIZE=3][FONT=Times New Roman][LEFT]Здравствуйте.[/LEFT]<br><br>' +
"[LEFT]Игрок будет наказан по следующему пункту правил:<br>[COLOR=#ff0000]6.01.[/COLOR]Запрещено наносить урон игрокам без Role Play причины на территории УМВД [COLOR=#ff0000]| DM / Jail 60 минут / Warn[/COLOR][/LEFT]<br><br>" +
        	        	'[LEFT][COLOR=#38ff4c]Одобрено, закрыто.[/COLOR][/LEFT][/FONT][/SIZE]',
        prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: 'нрп розыск',
	  content:
'[SIZE=3][FONT=Times New Roman][LEFT]Здравствуйте.[/LEFT]<br><br>' +
"[LEFT]Игрок будет наказан по следующему пункту правил:<br>[COLOR=#ff0000]6.02.[/COLOR]Запрещено выдавать розыск без Role Play причины [COLOR=#ff0000] | Warn[/COLOR][/LEFT]<br><br>" +
        	        	'[LEFT][COLOR=#38ff4c]Одобрено, закрыто.[/COLOR][/LEFT][/FONT][/SIZE]',
        prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: 'нрп поведение (умвд)',
	  content:
'[SIZE=3][FONT=Times New Roman][LEFT]Здравствуйте.[/LEFT]<br><br>' +
"[LEFT]Игрок будет наказан по следующему пункту правил:<br>[COLOR=#ff0000]6.03.[/COLOR] Запрещено nRP поведение [COLOR=#ff0000]| Warn[/COLOR][/LEFT]<br><br>" +
        	        	'[LEFT][COLOR=#38ff4c]Одобрено, закрыто.[/COLOR][/LEFT][/FONT][/SIZE]',
        prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: 'дм на тт ГИБДД',
	  content:
'[SIZE=3][FONT=Times New Roman][LEFT]Здравствуйте.[/LEFT]<br><br>' +
"[LEFT]Игрок будет наказан по следующему пункту правил:<br>[COLOR=#ff0000]7.01.[/COLOR] Запрещено наносить урон игрокам без Role Play причины на территории ГИБДД [COLOR=#ff0000]| DM / Jail 60 минут / Warn[/COLOR][/LEFT]<br><br>" +
        	        	'[LEFT][COLOR=#38ff4c]Одобрено, закрыто.[/COLOR][/LEFT][/FONT][/SIZE]',
        prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: 'нрп розыск/штраф',
	  content:
'[SIZE=3][FONT=Times New Roman][LEFT]Здравствуйте.[/LEFT]<br><br>' +
"[LEFT]Игрок будет наказан по следующему пункту правил:<br>[COLOR=#ff0000]7.02.[/COLOR]Запрещено выдавать розыск, штраф без Role Play причины [COLOR=#ff0000]| Warn[/COLOR][/LEFT]<br><br>" +
        	        	'[LEFT][COLOR=#38ff4c]Одобрено, закрыто.[/COLOR][/LEFT][/FONT][/SIZE]',
        prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: 'нрп погоня',
	  content:
'[SIZE=3][FONT=Times New Roman][LEFT]Здравствуйте.[/LEFT]<br><br>' +
"[LEFT]Игрок будет наказан по следующему пункту правил:<br>[COLOR=#ff0000]7.04.[/COLOR] Запрещено отбирать водительские права во время погони за нарушителем [COLOR=#ff0000]| Warn[/COLOR][/LEFT]<br><br>" +
        	        	'[LEFT][COLOR=#38ff4c]Одобрено, закрыто.[/COLOR][/LEFT][/FONT][/SIZE]',
        prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: 'дм на тт фсб',
	  content:
'[SIZE=3][FONT=Times New Roman][LEFT]Здравствуйте.[/LEFT]<br><br>' +
"[LEFT]Игрок будет наказан по следующему пункту правил:<br>[COLOR=#ff0000]8.01.[/COLOR] Запрещено наносить урон игрокам без Role Play причины на территории ФСБ [COLOR=#ff0000] | DM / Jail 60 минут / Warn[/COLOR][/LEFT]<br><br>" +
        	        	'[LEFT][COLOR=#38ff4c]Одобрено, закрыто.[/COLOR][/LEFT][/FONT][/SIZE]',
        prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: 'нрп розыск(фсб)',
	  content:
'[SIZE=3][FONT=Times New Roman][LEFT]Здравствуйте.[/LEFT]<br><br>' +
"[LEFT]Игрок будет наказан по следующему пункту правил:<br>[COLOR=#ff0000]8.02.[/COLOR] Запрещено выдавать розыск без Role Play причины [COLOR=#ff0000]| Warn[/COLOR][/LEFT]<br><br>" +
        	        	'[LEFT][COLOR=#38ff4c]Одобрено, закрыто.[/COLOR][/LEFT][/FONT][/SIZE]',
        prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: 'дм на тт фсин',
	  content:
'[SIZE=3][FONT=Times New Roman][LEFT]Здравствуйте.[/LEFT]<br><br>' +
"[LEFT]Игрок будет наказан по следующему пункту правил:<br>[COLOR=#ff0000]9.01.[/COLOR]Запрещено наносить урон игрокам без Role Play причины на территории ФСИН [COLOR=#ff0000] | DM / Jail 60 минут / Warn[/COLOR][/LEFT]<br><br>" +
        	        	'[LEFT][COLOR=#38ff4c]Одобрено, закрыто.[/COLOR][/LEFT][/FONT][/SIZE]',
        prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: '-----------------------------------------------------------Правила ОПГ-----------------------------------------------------------',
	},
	{
	  title: 'нрп вч',
	  content:
'[SIZE=3][FONT=Times New Roman][LEFT]Здравствуйте.[/LEFT]<br><br>' +
"[LEFT]Игрок будет наказан по следующему пункту правил:<br>[COLOR=#ff0000]2.[/COLOR]За нарушение правил нападения на Войсковую Часть выдаётся предупреждение [COLOR=#ff0000]| Jail 30 минут (NonRP нападение) / Warn (Для сотрудников ОПГ)[/COLOR][/LEFT]<br><br>" +
        	        	'[LEFT][COLOR=#38ff4c]Одобрено, закрыто.[/COLOR][/LEFT][/FONT][/SIZE]',
        prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: 'нрп вч(через стену)',
	  content:
'[SIZE=3][FONT=Times New Roman][LEFT]Здравствуйте.[/LEFT]<br><br>' +
"[LEFT]Игрок будет наказан по следующему пункту правил:<br>[COLOR=#ff0000]15.[COLOR]Нападение на военную часть разрешено только через блокпост КПП с последовательностью взлома [COLOR=#ff0000]| /Warn NonRP В/Ч[/COLOR][/LEFT]<br><br>" +
        	        	'[LEFT][COLOR=#38ff4c]Одобрено, закрыто.[/COLOR][/LEFT][/FONT][/SIZE]',
        prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: 'нрп вч',
	  content:
'[SIZE=3][FONT=Times New Roman][LEFT]Здравствуйте.[/LEFT]<br><br>' +
		"[LEFT]Игрок будет наказан. в соответствии с этими правилами:[URL=https://forum.blackrussia.online/threads/Правила-ограблений-и-похищений.29/]*ТЫК*[/URL][/LEFT]<br><br>" +
        	        	'[LEFT][COLOR=#38ff4c]Одобрено, закрыто.[/COLOR][/LEFT][/FONT][/SIZE]',
        prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: '-----------------------------------------------------------РП биографии-----------------------------------------------------------',
	},
	{
	  title: 'одобрено',
	  content:
'[SIZE=3][FONT=Times New Roman][LEFT]Здравствуйте.[/LEFT]<br>' +
		"[LEFT]Ваша рп биография была проверена и получает статус одобрено. [/LEFT]<br><br>" +
        	        	'[LEFT][COLOR=#38ff4c]Одобрено, закрыто.[/COLOR][/LEFT][/FONT][/SIZE]',
        prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: 'копипаст',
	  content:
'[SIZE=3][FONT=Times New Roman][LEFT]Здравствуйте.[/LEFT]<br>' +
"[LEFT]Ваша рп биография была скопирована у другого человека. Убедительная просьба ознакомиться с правилами написания рп биографий.[/LEFT]<br>" +
	'[LEFT][COLOR=#ff0000]Отказано, закрыто.[/COLOR][/LEFT][/FONT][/SIZE]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
	},
   {
	  title: 'младше 18',
	  content:
'[SIZE=3][FONT=Times New Roman][LEFT]Здравствуйте.[/LEFT]<br>' +
"[LEFT]Слишком молод.<br>Убедительная просьба ознакомиться с правилами написания рп биографий.[/LEFT]<br>" +
	'[LEFT][COLOR=#ff0000]Отказано, закрыто.[/COLOR][/LEFT][/FONT][/SIZE]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
	},
   {
	  title: 'некорректная дата рож.',
	  content:
'[SIZE=3][FONT=Times New Roman][LEFT]Здравствуйте.[/LEFT]<br>' +
"[LEFT]Некорректная дата рождения.[/LEFT]<br>" +
	'[LEFT][COLOR=#ff0000]Отказано, закрыто.[/COLOR][/LEFT][/FONT][/SIZE]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
	},
   {
	  title: 'недостаточно рп инфо',
	  content:
'[SIZE=3][FONT=Times New Roman][LEFT]Здравствуйте.[/LEFT]<br>' +
"[LEFT]Недостаточно рп информации.[/LEFT]<br>" +
	'[LEFT][COLOR=#ff0000]Отказано, закрыто.[/COLOR][/LEFT][/FONT][/SIZE]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
	},
   {
	  title: 'ошибки',
	  content:
'[SIZE=3][FONT=Times New Roman][LEFT]Здравствуйте.[/LEFT]<br>' +
"[LEFT]В вашей рп биографии имеются ошибки, требующие исправления.[/LEFT]<br>" +
	'[LEFT][COLOR=#ff0000]Отказано, закрыто.[/COLOR][/LEFT][/FONT][/SIZE]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
	},
   {
	  title: 'от 3-его лица',
	  content:
'[SIZE=3][FONT=Times New Roman][LEFT]Здравствуйте.[/LEFT]<br>' +
"[LEFT]Ваша рп биография написана от 3-его лица.[/LEFT]<br>" +
	'[LEFT][COLOR=#ff0000]Отказано, закрыто.[/COLOR][/LEFT][/FONT][/SIZE]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
	},
   {
	  title: 'не совпал возраст',
	  content:
'[SIZE=3][FONT=Times New Roman][LEFT]Здравствуйте.[/LEFT]<br>' +
"[LEFT]В вашей рп биографии возникла нестыковка между возрастом и датой рождения.[/LEFT]<br>" +
	'[LEFT][COLOR=#ff0000]Отказано, закрыто.[/COLOR][/LEFT][/FONT][/SIZE]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
	},
   {
        title: 'на доработку',
	  content:
'[SIZE=3][FONT=Times New Roman][LEFT]Здравствуйте.[/LEFT]<br>' +
"[LEFT]У вас есть возможность доработать свою рп биографию. Есть 24 часа для того, чтобы внести дополнения.[/LEFT]<br>" +
	'[LEFT][COLOR=#ffd838]На рассмотрении…[/COLOR][/LEFT][/FONT][/SIZE]',
	  prefix: PIN_PREFIX,
	  status: true,
	},
	{
	  title: 'не доработал',
	  content:
'[SIZE=3][FONT=Times New Roman][LEFT]Здравствуйте.[/LEFT]<br>' +
"[LEFT]Вы не доработали свою рп биографию.[/LEFT]<br>" +
	'[LEFT][COLOR=#ff0000]Отказано, закрыто.[/COLOR][/LEFT][/FONT][/SIZE]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
	},
   {
	  title: 'нрп ник',
	  content:
'[SIZE=3][FONT=Times New Roman][LEFT]Здравствуйте.[/LEFT]<br>' +
"[LEFT]У вас NonRP NickName.[/LEFT]<br>" +
	'[LEFT][COLOR=#ff0000]Отказано, закрыто.[/COLOR][/LEFT][/FONT][/SIZE]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
	},
   {
	  title: 'не по форме',
	  content:
'[SIZE=3][FONT=Times New Roman][LEFT]Здравствуйте.[/LEFT]<br>' +
"[LEFT]Ваша рп биография написана не по форме. Убедительная просьба ознакомиться с правилами написания рп биографий.[/LEFT]<br>" +
	'[LEFT][COLOR=#ff0000]Отказано, закрыто.[/COLOR][/LEFT][/FONT][/SIZE]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
	},
   {
	  title: 'не по форме(заголовок)',
	  content:
'[SIZE=3][FONT=Times New Roman][LEFT]Здравствуйте.[/LEFT]<br>' +
"[LEFT]В вашей рп биографии заголовок написан не по форме. Убедительная просьба ознакомиться с правилами написания рп биографий.[/LEFT]<br>" +
	'[LEFT][COLOR=#ff0000]Отказано, закрыто.[/COLOR][/LEFT][/FONT][/SIZE]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
	},
   {
	  title: '-----------------------------------------------------------РП ситуации-----------------------------------------------------------',
	},
	{
	  title: 'одобрено',
	  content:
'[SIZE=3][FONT=Times New Roman][LEFT]Здравствуйте.[/LEFT]<br>' +
		"[LEFT]Ваша рп ситуация была проверена и получает статус одобрено.[/LEFT]<br>" +
        	        	'[LEFT][COLOR=#38ff4c]Одобрено, закрыто.[/COLOR][/LEFT][/FONT][/SIZE]',
        prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: 'отказано',
	  content:
'[SIZE=3][FONT=Times New Roman][LEFT]Здравствуйте.[/LEFT]<br>' +
"[LEFT]Ваша рп ситуация была проверена и получает статус отказано.[/LEFT]<br>" +
	'[LEFT][COLOR=#ff0000]Отказано, закрыто.[/COLOR][/LEFT][/FONT][/SIZE]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: 'копипаст',
	  content:
'[SIZE=3][FONT=Times New Roman][LEFT]Здравствуйте.[/LEFT]<br>' +
"[LEFT]Ваша рп ситуация была скопирована у другого человека. Убедительная просьба ознакомиться с правилами написания рп ситуаций.[/LEFT]<br>" +
	'[LEFT][COLOR=#ff0000]Отказано, закрыто.[/COLOR][/LEFT][/FONT][/SIZE]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: 'ошибки',
	  content:
'[SIZE=3][FONT=Times New Roman][LEFT]Здравствуйте.[/LEFT]<br>' +
"[LEFT]В вашей рп ситуации имеются ошибки, требующие исправления.[/LEFT]<br>" +
	'[LEFT][COLOR=#ff0000]Отказано, закрыто.[/COLOR][/LEFT][/FONT][/SIZE]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
	},
   {
        title: 'на доработку',
	  content:
'[SIZE=3][FONT=Times New Roman][LEFT]Здравствуйте.[/LEFT]<br>' +
"[LEFT]У вас есть возможность доработать свою рп ситуацию. Есть 24 часа для того, чтобы внести дополнения.[/LEFT]<br>" +
'[LEFT][COLOR=#ffd838]На рассмотрении…[/COLOR][/LEFT][/FONT][/SIZE]',
	  prefix: PIN_PREFIX,
	  status: true,
	},
	{
	  title: 'не доработал',
	  content:
'[SIZE=3][FONT=Times New Roman][LEFT]Здравствуйте.[/LEFT]<br>' +
"[LEFT]Вы не доработали свою рп ситуацию .[/LEFT]<br>" +
	'[LEFT][COLOR=#ff0000]Отказано, закрыто.[/COLOR][/LEFT][/FONT][/SIZE]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
	},
   {
	  title: 'не по форме',
	  content:
'[SIZE=3][FONT=Times New Roman][LEFT]Здравствуйте.[/LEFT]<br>' +
"[LEFT]Ваша рп ситуация написана не по форме. Убедительная просьба ознакомиться с правилами написания рп ситуаций.[/LEFT]<br>" +
	'[LEFT][COLOR=#ff0000]Отказано, закрыто.[/COLOR][/LEFT][/FONT][/SIZE]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
	},
   {
	  title: 'не по форме(заголовок)',
	  content:
'[SIZE=3][FONT=Times New Roman][LEFT]Здравствуйте.[/LEFT]<br>' +
"[LEFT]В вашей рп ситуации заголовок написан не по форме. Убедительная просьба ознакомиться с правилами написания рп ситуаций.[/LEFT]<br>" +
	'[LEFT][COLOR=#ff0000]Отказано, закрыто.[/COLOR][/LEFT][/FONT][/SIZE]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
	},
   {
	  title: '-----------------------------------------------------------РП организации-----------------------------------------------------------',
	},
	{
	  title: 'одобрено',
	  content:
'[SIZE=3][FONT=Times New Roman][LEFT]Здравствуйте.[/LEFT]<br>' +
		"[LEFT]Ваша рп организация была проверена и получает статус одобрено.[/LEFT]<br>" +
        	        	'[LEFT][COLOR=#38ff4c]Одобрено, закрыто.[/COLOR][/LEFT][/FONT][/SIZE]',
        prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: 'отказано',
	  content:
'[SIZE=3][FONT=Times New Roman][LEFT]Здравствуйте.[/LEFT]<br>' +
"[LEFT]Ваша рп организация была проверена и получает статус отказано.[/LEFT]<br>" +
	'[LEFT][COLOR=#ff0000]Отказано, закрыто.[/COLOR][/LEFT][/FONT][/SIZE]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
	},
	{
        title: 'на доработку',
	  content:
'[SIZE=3][FONT=Times New Roman][LEFT]Здравствуйте.[/LEFT]<br>' +
"[LEFT]У вас есть возможность доработать свою рп организацию. Есть 24 часа для того, чтобы внести дополнения.[/LEFT]<br>" +
'[LEFT][COLOR=#ffd838]На рассмотрении…[/COLOR][/LEFT][/FONT][/SIZE]',
	  prefix: PIN_PREFIX,
	  status: true,
	},
	{
	  title: 'не доработал',
	  content:
'[SIZE=3][FONT=Times New Roman][LEFT]Здравствуйте.[/LEFT]<br><br>' +
"[LEFT]Вы не доработали свою рп организацию.[/LEFT]<br>" +
	'[LEFT][COLOR=#ff0000]Отказано, закрыто.[/COLOR][/LEFT][/FONT][/SIZE]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
	},
   {
	  title: 'копипаст',
	  content:
'[SIZE=3][FONT=Times New Roman][LEFT]Здравствуйте.[/LEFT]<br>' +
"[LEFT]Ваша рп организация была скопирована у другого человека. Убедительная просьба ознакомиться с правилами написания рп организаций.[/LEFT]<br>" +
	'[LEFT][COLOR=#ff0000]Отказано, закрыто.[/COLOR][/LEFT][/FONT][/SIZE]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: 'ошибки',
	  content:
'[SIZE=3][FONT=Times New Roman][LEFT]Здравствуйте.[/LEFT]<br>' +
"[LEFT]В вашей рп организации имеются ошибки, требующие исправления.[/LEFT]<br>" +
	'[LEFT][COLOR=#ff0000]Отказано, закрыто.[/COLOR][/LEFT][/FONT][/SIZE]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
	},
   {
	  title: 'не по форме',
	  content:
'[SIZE=3][FONT=Times New Roman][LEFT]Здравствуйте.[/LEFT]<br>' +
"[LEFT]Ваша рп организация написана не по форме. Убедительная просьба ознакомиться с правилами написания рп организаций.[/LEFT]<br>" +
	'[LEFT][COLOR=#ff0000]Отказано, закрыто.[/COLOR][/LEFT][/FONT][/SIZE]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
	},
   {
	  title: 'не по форме(заголовок)',
	  content:
'[SIZE=3][FONT=Times New Roman][LEFT]Здравствуйте.[/LEFT]<br>' +
"[LEFT]В вашей рп организации заголовок написан не по форме. Убедительная просьба ознакомиться с правилами написания рп организаций.[/LEFT]<br>" +
	'[LEFT][COLOR=#ff0000]Отказано, закрыто.[/COLOR][/LEFT][/FONT][/SIZE]',
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