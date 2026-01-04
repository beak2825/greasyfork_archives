// ==UserScript==
// @name         старая версия tech
// @namespace    https://forum.blackrussia.online/
// @version      0.1
// @description  ¿¿¿
// @author       rafsimons
// @match        https://forum.blackrussia.online/*
// @include      https://forum.blackrussia.online/
// @grant        none
// @license      MIT
// @icon https://i.postimg.cc/YqrNXDMv/1120b3454f429f3e9ffc94fb4f4becad.jpg
// @downloadURL https://update.greasyfork.org/scripts/526108/%D1%81%D1%82%D0%B0%D1%80%D0%B0%D1%8F%20%D0%B2%D0%B5%D1%80%D1%81%D0%B8%D1%8F%20tech.user.js
// @updateURL https://update.greasyfork.org/scripts/526108/%D1%81%D1%82%D0%B0%D1%80%D0%B0%D1%8F%20%D0%B2%D0%B5%D1%80%D1%81%D0%B8%D1%8F%20tech.meta.js
// ==/UserScript==

	(function () {
	'use strict';
	const UNACCEPT_PREFIX = 4; // префикс отказано
	const PIN_PREFIX = 2; //  префикс закрепить
	const COMMAND_PREFIX = 10; // команде проекта
	const CLOSE_PREFIX = 7; // префикс закрыто
	const DECIDED_PREFIX = 6; // префикс решено
	const TECHADM_PREFIX = 13 // тех администратору
	const WATCHED_PREFIX = 9; // рассмотрено
	const WAIT_PREFIX = 14; // ожидание (для переноса в баг-трекер)
	const NO_PREFIX = 0;
	const buttons = [

{
	title: 'Приветствие',
    color: 'oswald: 3px; color: #FFFFFF; background: #000000; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #FF0000',
	content:
    "Здравствуйте, {{ user.mention }}.",
},
{
	title: '2.28',
    color: 'oswald: 3px; color: #FFFFFF; background: #000000; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #FF0000',
	content:
    "Здравствуйте, {{ user.mention }}.<br>" +
    "Блокировка выдана за нарушение данного пункта правил:<br>[COLOR=rgb( 255, 0, 0)]2.28.[/COLOR] Запрещена покупка/продажа внутриигровой валюты в любых ее проявлениях за реальные деньги | [COLOR=rgb(255, 0, 0)]PermBan с обнулением аккаунта + ЧС проекта[/COLOR]",
},
{
	title: 'Дублирование',
    color: 'oswald: 3px; color: #FFFFFF; background: #000000; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #FF0000',
	content:
	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=Trebuchet ms][SIZE=14px]{{ greeting }}, [/COLOR][COLOR=rgb(123, 104, 238)][ICODE]{{ user.name }}[/ICODE][/COLOR].<br><br>" +
	"[COLOR=rgb(209, 213, 216)]Ваша тема является копией одной из прошлых — [URL='вставьте ссылку']нажмите.[/URL]<br>Пожалуйста, прекратите дублировать темы, иначе ваш форумный аккаунт может быть заблокирован." +
    "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
	'[COLOR=rgb(255, 0, 0)]Закрыто.[/COLOR][/CENTER][/FONT][/SIZE]',
	prefix: CLOSE_PREFIX,
	status: false,
},
	{
	title: 'ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ LOGS ᅠ ᅠ  ᅠ  ᅠ ᅠᅠ ᅠ  ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ',
    color: 'oswald: 3px; color: #1E90FF; background: #000000; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #FF0000',

},
{
	title: 'Форма',
    color: 'oswald: 3px; color: #FFFFFF; background: #000000; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #FF0000',
	content:
	"[FONT=Trebuchet ms][SIZE=14px]Здравствуйте, {{ user.mention }}.<br><br>" +
	"Создайте новую тему и заполните данную форму:<br><br>[QUOTE]1. Ваш игровой никнейм:<br>2. Игровой никнейм технического специалиста:<br>3. Сервер, на котором Вы играете:<br>4. Описание ситуации (описать максимально подробно и раскрыто):<br>5. Любые скриншоты, которые могут помочь в решении проблемы (если таковые имеются):<br>6. Дата и время произошедшей технической проблемы (постарайтесь указать максимально точно):[/QUOTE][/FONT][/SIZE]<br>" ,
	prefix: CLOSE_PREFIX,
	status: false,
},
{
	title: 'Рассмотрение',
	color: 'oswald: 3px; color: #DAA520; background: #000000; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
	content:
    "Здравствуйте, {{ user.mention }}.<br><br>На рассмотрении",
	prefix: TECHADM_PREFIX,
	status: true,
},
{
	title: 'Передача Руководству',
   	color: 'oswald: 3px; color: #FFFFFF; background: #000000; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #FF0000',
	content:
	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=Trebuchet ms][SIZE=14px]{{ greeting }}, [/COLOR][COLOR=rgb(123, 104, 238)][ICODE]{{ user.name }}[/ICODE][/COLOR].<br><br>" +
	"[COLOR=rgb(209, 213, 216)]Ваша тема закреплена и ожидает вердикта Куратора технических специалистов.[/COLOR]<br>" +
    "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
	'[COLOR=rgb(255, 0, 0)]На рассмотрении..[/COLOR][/CENTER][/FONT][/SIZE]',
	prefix: PIN_PREFIX,
	status: true,
},
{
	title: 'Вам в Технический раздел',
    color: 'oswald: 3px; color: #7B68EE; background: #000000; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #FF0000',
	content:
	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=Trebuchet ms][SIZE=14px]{{ greeting }}, [/COLOR][COLOR=rgb(123, 104, 238)][ICODE]{{ user.name }}[/ICODE][/COLOR].<br><br>" +
	"[COLOR=rgb(209, 213, 216)]Ваша тема не относится к жалобам на технических специалистов. Обратитесь в технический раздел вашего сервера -[/COLOR] [URL='https://forum.blackrussia.online/index.php?forums/Технический-раздел.22/']нажмите[/URL]<br>" +
    "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
	'[COLOR=rgb(255, 0, 0)]Закрыто.[/COLOR][/CENTER][/FONT][/SIZE]',
	prefix: CLOSE_PREFIX,
	status: false,
},
{
	title: 'Нет окна блокировки',
    color: 'oswald: 3px; color: #FFFFFF; background: #000000; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #FF0000',
	content:
	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=Trebuchet ms][SIZE=14px]{{ greeting }}, [/COLOR][COLOR=rgb(123, 104, 238)][ICODE]{{ user.name }}[/ICODE][/COLOR].<br><br>" +
	"[COLOR=rgb(209, 213, 216)]Без окна блокировки тема рассмотрению не подлежит. Создайте новую тему, прикрепив окно блокировки с данных фото-хостингов:<br>[URL='https://yapx.ru/']yapx.ru[/URL], [URL='https://imgur.com/']imgur.com[/URL], [URL='https://imgbb.com']ImgBB.com[/URL][/COLOR]<br>" +
    "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
	'[COLOR=rgb(255, 0, 0)]Закрыто.[/COLOR][/CENTER][/FONT][/SIZE]',
	prefix: CLOSE_PREFIX,
	status: false,
},
{
	title: 'Будете разблокированы',
    color: 'oswald: 3px; color: #FFFFFF; background: #000000; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #FF0000',
	content:
	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=Trebuchet ms][SIZE=14px]{{ greeting }}, [/COLOR][COLOR=rgb(123, 104, 238)][ICODE]{{ user.name }}[/ICODE][/COLOR].<br><br>" +
	'[COLOR=rgb(209, 213, 216)]Ваш аккаунт будет разблокирован в течение 24-х часов.[/COLOR]<br>'+
    "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
	'[COLOR=rgb(255, 204, 0)]На рассмотрении.[/COLOR][/CENTER][/FONT][/SIZE]',
	prefix: PIN_PREFIX,
	status: true,
},
{
	title: 'Правила',
    color: 'oswald: 3px; color: #FFFFFF; background: #000000; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #FF0000',
	content:
	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=Trebuchet ms][SIZE=14px]{{ greeting }}, [/COLOR][COLOR=rgb(123, 104, 238)][ICODE]{{ user.name }}[/ICODE][/COLOR].<br><br>" +
    "[COLOR=rgb(209, 213, 216)]Пожалуйста, ознакомьтесь с назначением данного раздела, так как ваш запрос не относится к жалобам на технических специалистов.<br> Форма подачи и правила данного раздела — [URL='https://forum.blackrussia.online/threads/%D0%A8%D0%B0%D0%B1%D0%BB%D0%BE%D0%BD-%D0%B4%D0%BB%D1%8F-%D0%BF%D0%BE%D0%B4%D0%B0%D1%87%D0%B8-%D0%B6%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D1%82%D0%B5%D1%85%D0%BD%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%BE%D0%B3%D0%BE-%D1%81%D0%BF%D0%B5%D1%86%D0%B8%D0%B0%D0%BB%D0%B8%D1%81%D1%82%D0%B0.7551923/']нажмите[/URL][/COLOR]<br>" +
	"[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
	'[COLOR=rgb(255, 0, 0)]Закрыто.[/COLOR][/CENTER][/FONT][/SIZE]',
	prefix: CLOSE_PREFIX,
	status: false,
},
{
	title: 'Срок подачи',
    color: 'oswald: 3px; color: #FFFFFF; background: #000000; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #FF0000',
	content:
	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=Trebuchet ms][SIZE=14px]{{ greeting }}, [/COLOR][COLOR=rgb(123, 104, 238)][ICODE]{{ user.name }}[/ICODE][/COLOR].<br><br>" +
	"[COLOR=rgb(209, 213, 216)]С момента выдачи наказания прошло более 14 дней.<br>В настоящее время изменить меру наказания невозможно, однако вы можете попробовать написать заявление на обжалование через определенный период времени.<br><br>Обратите внимание, что некоторые наказания не подлежат обжалованию или амнистии. Подробнее: [URL='https://forum.blackrussia.online/threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BE%D0%B1%D0%B6%D0%B0%D0%BB%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D1%8F-%D0%BD%D0%B0%D1%80%D1%83%D1%88%D0%B5%D0%BD%D0%B8%D1%8F-%D0%BF%D1%80%D0%B8-%D0%B2%D1%8B%D0%B4%D0%B0%D1%87%D0%B5-%D0%BD%D0%B0%D0%BA%D0%B0%D0%B7%D0%B0%D0%BD%D0%B8%D1%8F-%D0%BE%D1%82-%D1%82%D0%B5%D1%85%D0%BD%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%BE%D0%B3%D0%BE-%D1%81%D0%BF%D0%B5%D1%86%D0%B8%D0%B0%D0%BB%D0%B8%D1%81%D1%82%D0%B0.7552345/']нажмите[/URL][/COLOR]<br>" +
    "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
    '[COLOR=rgb(255, 204, 0)]Передано руководству.[/COLOR][/CENTER][/FONT][/SIZE]',
	prefix: PIN_PREFIX,
	status: true,
},
{
	title: 'Правила восстановления',
	color: 'oswald: 3px; color: #FFFFFF; background: #000000; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #FF0000',
	content:
	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=Trebuchet ms][SIZE=14px]{{ greeting }}, [/COLOR][COLOR=rgb(123, 104, 238)][ICODE]{{ user.name }}[/ICODE][/COLOR].<br><br>" +
	"[COLOR=rgb(209, 213, 216)]Пожалуйста, убедительная просьба, ознакомьтесь с правилами восстановлений - [URL='https://forum.blackrussia.online/index.php?threads/В-каких-случаях-мы-не-восстанавливаем-игровое-имущество.25277/']нажмите[/URL][/COLOR]<br>" +
    "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
	'[COLOR=rgb(255, 0, 0)]Закрыто.[/COLOR][/CENTER][/FONT][/SIZE]',
	prefix: CLOSE_PREFIX,
	status: false,
},
{
	title: 'Не относится',
    color: 'oswald: 3px; color: #FFFFFF; background: #000000; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #FF0000',
	content:
	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=Trebuchet ms][SIZE=14px]{{ greeting }}, [/COLOR][COLOR=rgb(123, 104, 238)][ICODE]{{ user.name }}[/ICODE][/COLOR].<br><br>" +
	"[COLOR=rgb(209, 213, 216)]Ваше обращение не относится к жалобам на технических специалистов.<br>Пожалуйста, ознакомьтесь с правилами данного раздела: [URL='https://forum.blackrussia.online/forums/Информация-для-игроков.231/']нажмите[/URL][/COLOR]<br>" +
    "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
	'[COLOR=rgb(255, 0, 0)]Закрыто.[/COLOR][/CENTER][/FONT][/SIZE]',
	prefix: CLOSE_PREFIX,
	status: false,
},
{
	title: 'Игрок будет заблокирован',
  	color: 'oswald: 3px; color: #00FA9A; background: #000000; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #ffffff',
	content:
	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=Trebuchet ms][SIZE=14px]{{ greeting }}, [/COLOR][COLOR=rgb(123, 104, 238)][ICODE]{{ user.name }}[/ICODE][/COLOR].<br><br>" +
	"[COLOR=rgb(209, 213, 216)]После проверки доказательств и системы логирования выношу вердикт:[/COLOR]<br><br>[COLOR=rgb(65, 168, 95)]Игрок будет заблокирован.[/COLOR]<br>" +
    "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
	"[COLOR=rgb(255, 0, 0)]Закрыто.[/SIZE][/COLOR][/FONT][/CENTER]",
},
{
    title: 'Игрок не будет заблокирован',
    color: 'oswald: 3px; color: #FF0000 ; background: #000000; box-shadow: 0 02px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0.2); border: none; border-color: #ffffff',
    content:
    "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Trebuchet ms][SIZE=14px]{{ greeting }}, [/COLOR][COLOR=rgb(123, 104, 238)][ICODE]{{ user.name }}[/ICODE][/COLOR].<br><br>" +
    "[COLOR=rgb(209, 213, 216)]После проверки доказательств и системы логирования выношу вердикт:[/COLOR]<br><br>[COLOR=rgb(255, 0, 0)] Недостаточно доказательств для блокировки игрока.[/COLOR]<br>" +
    "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
    '[COLOR=rgb(255, 0, 0)]Закрыто.[/FONT][/SIZE][/CENTER][/COLOR]',
},
{
    title: 'Запросить привязки',
    color: 'oswald: 3px; color: #FFFFFF; background: #000000; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 0 (rgba(0,0,0,0.2); border: none; border-color: #FF0000',
    content:
    "[CENTER]Здравствуйте, {{ user.mention }}.<br><br>" +
    '1. Укажите ваш Telegram ID, если ваш игровой аккаунт был привязан к Telegram. Узнать его можно здесь: t.me/getmyid_bot<br><br>2. Укажите ваш оригинальный ID страницы ВКонтакте, которая привязана к аккаунту (взять его можно через данный сайт - https://regvk.com/ )<br><br>3. Укажите почту, которая привязана к аккаунту[/CENTER]',
    prefix: TECHADM_PREFIX,
    status: true,
},
	{
	title: 'ᅠ ᅠᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠᅠ   FORUM  ᅠ ᅠ ᅠᅠ ᅠ ᅠ ᅠ    ᅠ ᅠ ᅠ  ᅠ ᅠ',
	color: 'oswald: 3px; color: #7B68EE; background: #000000; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
	},
{
    title: 'Форма',
    color: 'oswald: 3px; color: #FFFFFF; background: #000000; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #FF0000',
	content:
	"[FONT=Trebuchet ms][SIZE=14px]Здравствуйте, {{ user.mention }}.<br><br>" +
    "Создайте новую тему и заполните данную форму:<br><br>[QUOTE]01. Ваш игровой никнейм:<br>02. Сервер, на котором Вы играете:<br>03. Суть Вашей возникшей проблемы (описать максимально подробно и раскрыто): <br>04. Любые скриншоты, которые могут помочь в решении проблемы (если таковые имеются):<br>05. Дата и время произошедшей технической проблемы (постарайтесь указать максимально точно):[/QUOTE][/FONT][/SIZE]",
	prefix: CLOSE_PREFIX,
	status: false,
},
{
	title: 'На тех. специалиста',
    color: 'oswald: 3px; color: #FFFFFF; background: #000000; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #FF0000',
	content:
	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=Trebuchet ms][SIZE=14px]{{ greeting }}, [/COLOR][COLOR=rgb(123, 104, 238)][ICODE]{{ user.name }}[/ICODE][/COLOR].<br><br>" +
	"[COLOR=rgb(209, 213, 216)]Данная тема не относится к техническому разделу.<br>Обратитесь в раздел жалоб на технических специалистов - [URL='https://forum.blackrussia.online/index.php?forums/Жалобы-на-технических-специалистов.490/']нажмите.[/URL][/COLOR]<br>" +
	"[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
	'[COLOR=rgb(255, 0, 0)]Закрыто.[/COLOR][/CENTER][/FONT][/SIZE]',
	prefix: CLOSE_PREFIX,
	status: false,
},
{
	title: 'Нет доказательств',
	color: 'oswald: 3px; color: #FFFFFF; background: #000000; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #FF0000',
    content:
	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=Trebuchet ms][SIZE=14px]{{ greeting }}, [/COLOR][COLOR=rgb(123, 104, 238)]{{ user.mention }}[/COLOR].<br><br>" +
	"[COLOR=rgb(209, 213, 216)]Без доказательств (скриншоты или видео) – решить проблему не получится. Если доказательства найдутся, создайте новую тему, загрузив их на фото-хостинги:<br>[URL='https://yapx.ru/']yapx.ru[/URL], [URL='https://imgur.com/']imgur.com[/URL], [URL='https://www.youtube.com/']youtube.com[/URL], [URL='https://imgbb.com']ImgBB.com[/URL].[/COLOR]<br>" +
	"[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
	'[COLOR=rgb(255, 0, 0)]Закрыто.[/COLOR][/CENTER][/FONT][/SIZE]',
	prefix: CLOSE_PREFIX,
	status: false,
},
{
	title: 'Правила',
    color: 'oswald: 3px; color: #FFFFFF; background: #000000; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #FF0000',
	content:
	"[FONT=Trebuchet ms][SIZE=14px]Здравствуйте, {{ user.mention }}.<br><br>" +
	"[COLOR=rgb(209, 213, 216)]Ваше обращение не относится к техническому разделу.<br><br>Если возникли технические проблемы, которые так или иначе связаны с игровым модом, заполните данную форму:[/COLOR]<br><br>[QUOTE]<br>1. Ваш игровой никнейм:<br>2. Сервер, на котором вы играете:<br>3. Суть возникшей проблемы (описать максимально подробно и раскрыто):<br>3. Любые скриншоты, которые могут помочь в решении проблемы (если таковые имеются):<br>4. Дата и время произошедшей технической проблемы (постарайтесь указать максимально точно):[/QUOTE]<br><br>[COLOR=rgb(209, 213, 216)]Если возникли технические проблемы, которые так или иначе связаны с вылетами из игры и любыми другими проблемами клиента, заполните данную форму:[/COLOR]<br><br>[QUOTE]01. Ваш игровой ник:<br>02. Сервер:<br>03. Тип проблемы: Обрыв соединения | Проблема с ReCAPTCHA | Краш игры (закрытие игры) | Другое [Выбрать один вариант ответа]<br>04. Действия, которые привели к этому (при вылетах, по возможности предоставлять место сбоя):<br>5. Как часто данная проблема:<br>6. Полное название мобильного телефона:<br>7. Версия Android:<br>08. Дата и время (по МСК):<br>Связь с вами по Telegram/VK:[/QUOTE][/FONT][/SIZE]",
	prefix: WATCHED_PREFIX,
	status: false,
},
{
	title: 'Передано логисту',
	color: 'oswald: 3px; color: #7B68EE; background: #000000; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #FF0000',
	content:
	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=Trebuchet ms][SIZE=14px]{{ greeting }}, [/COLOR][COLOR=rgb(123, 104, 238)][ICODE]{{ user.name }}[/ICODE][/COLOR].<br><br>" +
	"[COLOR=rgb(209, 213, 216)]Ваша тема передана Техническому Специалисту по Логированию для дальнейшего вердикта, ожидайте ответ в данной теме.<br>" +
	"[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
    '[COLOR=rgb(255, 0, 0)]На рассмотрении..[/COLOR][/CENTER][/FONT][/SIZE]',
	prefix: TECHADM_PREFIX,
	status: true,
},
{
	title: 'Доп. Информация',
	color: 'oswald: 3px; color: #FFFFFF; background: #000000; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #FF0000',
	content:
	'Для дальнейшего рассмотрения темы, предоставьте:<br><br>[QUOTE]1. Скриншоты или видео, подтверждающие факт владения этим имуществом.<BR>2. Все детали пропажи: дата, время, после каких действий имущество пропало.<BR>3. Информация о том, как вы изначально получили это имущество:<BR>дата покупки<br>способ приобретения (у игрока, в магазине или через донат;<br>фрапс покупки (если есть);<br>никнейм игрока, у которого было приобретено имущество, если покупка была сделана не в магазине.[/QUOTE]<br>'+
    "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
	'На рассмотрении...',
	prefix: TECHADM_PREFIX,
	status: true,
},
{
 	title: 'Кик за ПО',
    color: 'oswald: 3px; color: #FFFFFF; background: #000000; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #FF0000',
 	content:
 	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=Trebuchet ms][SIZE=14px]{{ greeting }}, [/COLOR][COLOR=rgb(123, 104, 238)][ICODE]{{ user.name }}[/ICODE][/COLOR].<br><br>" +
 	'[COLOR=rgb(209, 213, 216)]Если вы были отключены от сервера Античитом, то обратите внимание на значение PacketLoss и Ping.[/COLOR]<br><br> [IMG]https://i.ibb.co/FXXrcVS/image.png[/IMG]<br><br>[COLOR=rgb(209, 213, 216)]PacketLoss - минимальное значение 0.000000, максимальное 1.000000. При показателе, выше нуля, это означает, что у вас происходит задержка/потеря передаваемых пакетов информации на сервер. Это означает, что ваш интернет не передает достаточное количество данных из вашего устройства на наш сервер, в следствие чего система отключает вас от игрового процесса.<br><br>Ping - Чем меньше значение в данном пункте, тем быстрее передаются данные на сервер, и наоборот. Если значение выше 100, вы можете наблюдать отставания в игровом процессе из-за нестабильности интернет-соединения.<br><br>Если вы не заметили проблем в данных пунктах, скорее всего - у вас произошел скачек пинга при выполнении действия в игре, в таком случае, античит также отключает игрока из-за подозрения в использовании посторонних программ.<br><br>Решение данной проблемы: постарайтесь стабилизировать ваше интернет-соединение, при необходимости - сообщите о проблемах своему провайдеру (поставщику услуг интернета).[/COLOR]<br><br>' +
	"[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
	'[CENTER][COLOR=rgb(255, 0, 0)]Закрыто.[/COLOR][/CENTER][/FONT][/SIZE]',
 	prefix: CLOSE_PREFIX,
 	status: false,
},
{
	title: 'Восст. доступа к аккаунту',
	color: 'oswald: 3px; color: #FFFFFF; background: #000000; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #FF0000',
	content:
	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=Trebuchet ms][SIZE=14px]{{ greeting }}, [/COLOR][COLOR=rgb(123, 104, 238)][ICODE]{{ user.name }}[/ICODE][/COLOR].<br><br>" +
	"[COLOR=rgb(209, 213, 216)]Если вы обезопасили свой аккаунт и привязали его к [U]странице во ВКонтакте[/U], то сбросить пароль или пин-код вы всегда сможете обратившись в официальное сообщество проекта - [URL='https://vk.com/blackrussia.online.']нажмите[/URL]<br> Либо обратитесь к боту в Telegram - [URL='https://t.me/br_helper_bot.']нажмите[/URL]<br><br>" +
    "[COLOR=rgb(209, 213, 216)]Если вы [U]привязали аккаунт к почте[/U], то сбросить пароль или пин-код вы всегда сможете при вводе пароля на сервере. После подключения к серверу, нажмите на кнопку «Войти в аккаунт», затем выберите кнопку «Восстановить пароль», после чего на вашу почту будет отправлено письмо с одноразовым кодом восстановления.[/COLOR]<br><br>" +
	"[COLOR=rgb(209, 213, 216)]Если вы не обезопасили свой аккаунт, то вернуть его невозможно. Игрок самостоятельно несет отвественность за безопаность своего аккаунта.[/COLOR]<br><br>" +
	"[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
	'[COLOR=rgb(60, 179, 113)]Рассмотрено.[/COLOR][/CENTER][/FONT][/SIZE]',
	prefix: WATCHED_PREFIX,
	status: false,
},
{
	title: 'Баги IOS',
    color: 'oswald: 3px; color: #FFFFFF; background: #000000; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #FF0000',
	content:
	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=Trebuchet ms][SIZE=14px]{{ greeting }}, [/COLOR][COLOR=rgb(123, 104, 238)][ICODE]{{ user.name }}[/ICODE][/COLOR].<br><br>" +
	'[COLOR=rgb(209, 213, 216)]Если вы нашли какую-либо ошибку во время Открытого Бета Тестирования на IOS, то отправьте, пожалуйста, найденную недоработку в данную форму - [URL="https://forms.gle/4adcNvKisfKF59Fi8"]нажмите[/URL][/COLOR]<br>' +
	"[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
	'[COLOR=rgb(60, 179, 113)]Рассмотрено.[/COLOR][/CENTER][/FONT][/SIZE]',
	prefix: CLOSE_PREFIX,
	status: false,
},
{
	title: 'Законопослушность',
	color: 'oswald: 3px; color: #FFFFFF; background: #000000; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #FF0000',
	content:
	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=Trebuchet ms][SIZE=14px]{{ greeting }}, [/COLOR][COLOR=rgb(123, 104, 238)][ICODE]{{ user.name }}[/ICODE][/COLOR].<br><br>" +
	'[COLOR=rgb(209, 213, 216)]К сожалению, администрация, технические специалисты и другие должностные лица BLACK RUSSIA не могут повлиять на законопослушность вашего аккаунта.<br><br>Повысить законопослушность можно тремя способами:<br><br>1. Каждый PayDay (00 минут каждого часа) вам начисляется одно очко законопослушности, если за прошедший час вы отыграли не менее 20 минут.<br>2. Приобрести законопослушность в /donate.<br>3. На работе "Электрика": для этого нужно починить 5 фонарей и тогда вам дадут 5 законопослушности.<br><br>'+
	"[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
	'[COLOR=rgb(60, 179, 113)]Рассмотрено.[/COLOR][/CENTER][/FONT][/SIZE]',
	prefix: WATCHED_PREFIX,
	status: false,
},
{
	title: 'Команде проекта',
	color: 'oswald: 3px; color: #DAA520; background: #000000; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #FF0000',
	content:
	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=Trebuchet ms][SIZE=14px]{{ greeting }}, [/COLOR][COLOR=rgb(255, 204, 0)][ICODE]{{ user.name }}[/ICODE][/COLOR].<br><br>" +
	"[COLOR=rgb(209, 213, 216)]Ваша тема закреплена и находится на рассмотрении у команды проекта. Пожалуйста, ожидайте выноса вердикта разработчиков.<br>"+
	"Создавать новые темы с данной проблемой - не нужно.[/COLOR]<br>" +
    "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
	'[COLOR=rgb(255, 215, 0)]На рассмотрении..[/COLOR][/CENTER][/FONT][/SIZE]',
	prefix: COMMAND_PREFIX,
	status: true,
},
{
	title: 'Известно КП',
	color: 'oswald: 3px; color: #DAA520; background: #000000; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #FF0000',
	content:
	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=Trebuchet ms][SIZE=14px]{{ greeting }}, [/COLOR][COLOR=rgb(255, 204, 0)][ICODE]{{ user.name }}[/ICODE][/COLOR].<br><br>" +
	"[COLOR=rgb(209, 213, 216)]Команде проекта уже известно о данной проблеме.<br> Спасибо за ваше обращение.[/COLOR]<br>" +
    "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
	'[COLOR=rgb(255, 0, 0)]Закрыто.[/COLOR][/CENTER][/FONT][/SIZE]',
	prefix: CLOSE_PREFIX,
	status: false,
},
{
	title: 'Не является багом',
	color: 'oswald: 3px; color: #FFFFFF; background: #000000; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #FF0000',
	content:
	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=Trebuchet ms][SIZE=14px]{{ greeting }}, [/COLOR][COLOR=rgb(123, 104, 238)][ICODE]{{ user.name }}[/ICODE][/COLOR].<br><br>" +
	'[COLOR=rgb(209, 213, 216)]Проблема, с которой вы столкнулись, не является багом или ошибкой сервера.<br>' +
    "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
	'[COLOR=rgb(60, 179, 113)]Рассмотрено.[/COLOR][/CENTER][/FONT][/SIZE]',
	prefix: WATCHED_PREFIX,
	status: false,
},
{
	title: 'В раздел Госс. Организаций',
	color: 'oswald: 3px; color: #FFFFFF; background: #000000; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #FF0000',
	content:
	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=Trebuchet ms][SIZE=14px]{{ greeting }}, [/COLOR][COLOR=rgb(123, 104, 238)][ICODE]{{ user.name }}[/ICODE][/COLOR].<br><br>" +
	'[COLOR=rgb(209, 213, 216)]Ваша тема не относится к техническому разделу, пожалуйста, оставьте ваше заявление или жалобу в соответствующем разделе Государственных Организаций вашего сервера.[/COLOR]<br>'+
    "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
	'[COLOR=rgb(255, 0, 0)]Закрыто.[/COLOR][/CENTER][/FONT][/SIZE]',
	prefix: UNACCEPT_PREFIX,
	status: false,
},
{
	title: 'В раздел Криминальных Организаций',
	color: 'oswald: 3px; color: #FFFFFF; background: #000000; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #FF0000',
	content:
	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=Trebuchet ms][SIZE=14px]{{ greeting }}, [/COLOR][COLOR=rgb(123, 104, 238)][ICODE]{{ user.name }}[/ICODE][/COLOR].<br><br>" +
	'[COLOR=rgb(209, 213, 216)]Ваша тема не относится к техническому разделу, пожалуйста, оставьте ваше заявление или жалобу в соответствующем разделе Криминальных Организаций вашего сервера.[/COLOR]'+
	"[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
	'[COLOR=rgb(255, 0, 0)]Закрыто.[/COLOR][/CENTER][/FONT][/SIZE]',
	prefix: UNACCEPT_PREFIX,
	status: false,
},
{
     title: 'На администрацию',
     color: 'oswald: 3px; color: #FF0000; background: #000000; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #ffffff',
     content:
     "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Trebuchet ms][SIZE=14px]{{ greeting }}, [/COLOR][COLOR=rgb(123, 104, 238)][ICODE]{{ user.name }}[/ICODE][/COLOR].<br><br>" +
     "[COLOR=rgb(209, 213, 216)]Вы получили наказание, которое выдал не технический специалист. Обратитесь в раздел жалоб на администрацию Вашего сервера.<br>Форма для подачи жалобы: [URL='https://forum.blackrussia.online/index.php?threads/Правила-подачи-жалоб-на-администрацию.3429349/']нажмите[/URL][/COLOR]<br>" +
     "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
     '[COLOR=rgb(255, 0, 0)]Закрыто.[/FONT][/SIZE][/CENTER][/COLOR]',
      prefix: CLOSE_PREFIX,
      status: false,
},
{
	title: 'На лидеров',
	color: 'oswald: 3px; color: #FFFFFF; background: #000000; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #FF0000',
	content:
	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=Trebuchet ms][SIZE=14px]{{ greeting }}, [/COLOR][COLOR=rgb(123, 104, 238)][ICODE]{{ user.name }}[/ICODE][/COLOR].<br><br>" +
	"[COLOR=rgb(209, 213, 216)]Данная тема не относится к техническому разделу, пожалуйста, обратитесь в раздел жалоб на лидеров.<br>Форма подачи жалобы - [URL='https://forum.blackrussia.online/threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BF%D0%BE%D0%B4%D0%B0%D1%87%D0%B8-%D0%B6%D0%B0%D0%BB%D0%BE%D0%B1-%D0%BD%D0%B0-%D0%BB%D0%B8%D0%B4%D0%B5%D1%80%D0%BE%D0%B2.3429391/']нажмите[/URL][/COLOR]<br>" +
	"[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
	'[COLOR=rgb(255, 0, 0)]Закрыто.[/COLOR][/CENTER][/FONT][/SIZE]',
	prefix: CLOSE_PREFIX,
	status: false,
},
{
	title: 'На игроков',
	color: 'oswald: 3px; color: #1E90FF; background: #000000; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #FF0000',
    content:
     "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Trebuchet ms][SIZE=14px]{{ greeting }}, [/COLOR][COLOR=rgb(123, 104, 238)][ICODE]{{ user.name }}[/ICODE][/COLOR].<br><br>" +
     "[COLOR=rgb(209, 213, 216)]Данная тема не относится к техническому разделу. Данное действие было совершено игроком и нарушает правила сервера, пожалуйста, обратитесь в «Жалобы на игроков» Вашего сервера.<br>Форма подачи жалобы: [URL='https://forum.blackrussia.online/index.php?threads/Правила-подачи-жалоб-на-игроков.3429394/']нажмите[/URL] [/COLOR]<br>" +
     "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
     '[COLOR=rgb(255, 0, 0)]Закрыто.[/FONT][/SIZE][/CENTER][/COLOR]',
    prefix: CLOSE_PREFIX,
    status: false,
},
{
	title: 'Обжалования',
	color: 'oswald: 3px; color: #FF0000; background: #000000; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #FF0000',
	content:
	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=Trebuchet ms][SIZE=14px]{{ greeting }}, [/COLOR][COLOR=rgb(123, 104, 238)][ICODE]{{ user.name }}[/ICODE][/COLOR].<br><br>"+
	"[COLOR=rgb(209, 213, 216)]Вы получили наказание от администратора своего сервера. Обратитесь в раздел «Обжалования» своего сервера.<br> Форма подачи темы - [URL='https://forum.blackrussia.online/index.php?threads/Правила-подачи-заявки-на-обжалование-наказания.3429398/']нажмите[/URL][/COLOR]<br>" +
    "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
    '[COLOR=rgb(255, 0, 0)]Закрыто.[/COLOR][/CENTER][/FONT][/SIZE]',
	prefix: CLOSE_PREFIX,
	status: false,
},
{
	title: 'Сервер не отвечает',
	color: 'oswald: 3px; color: #FFFFFF; background: #000000; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #FF0000',
	content:
	"[COLOR=rgb(209, 213, 216)][FONT=Trebuchet ms][SIZE=14px]{{ greeting }}, [/COLOR][COLOR=rgb(255, 204, 0)][ICODE]{{ user.name }}[/ICODE][/COLOR].<br><br>" +
	"[COLOR=rgb(209, 213, 216)]Если у вас встречаются такие проблемы, как «Сервер не отвечает», не отображаются сервера в лаунчере, не удаётся выполнить вход на сайт/форум, попробуйте совершить следующие действия:[/COLOR]<br><br>" +
	"[QUOTE]• Сменить IP-адрес любыми средствами; <br>" +
	"• Переключиться на Wi-Fi/мобильный интернет или на любую доступную сеть; <br>"+
	"• Использование VPN; <br>"+
	"• Перезагрузка роутера.[/QUOTE]<br><br>" +

	"[COLOR=rgb(209, 213, 216)]Если методы выше не помогли, то переходим к следующим шагам:[/COLOR]<br><br>" +

	'[QUOTE]1. Устанавливаем приложение «1.1.1.1: Faster & Safer Internet» Ссылка: https://clck.ru/ZP6Av и переходим в него.<br>'+
	'2. Соглашаемся со всей политикой приложения.<br>'+
	'3. Нажимаем на ползунок и ждем, когда текст изменится на «Подключено».<br>'+
	'4. Проверяем: Отображаются ли серверы? Удается ли выполнить вход в игру? Работают ли другие источники (сайт, форум)? [/QUOTE]<br>' +

	'[CENTER]📹[COLOR=rgb(209, 213, 216)] Включение продемонстрировано на видео:[/COLOR] [URL="https://youtu.be/Wft0j69b9dk"]нажмите[/URL]<br>'+
	"[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
	'[COLOR=rgb(60, 179, 113)]Рассмотрено.[/COLOR][/CENTER][/FONT][/SIZE]',
	prefix: WATCHED_PREFIX,
	status: false,
},
{
    title: 'Донат',
	color: 'oswald: 3px; color: #FFFFFF; background: #000000; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #FF0000',
    content:
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]<br>' +
    "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)][ICODE]{{ user.name }}[/ICODE][/COLOR].[/CENTER][/SIZE]<br><br>" +
    "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px]Если не были зачислены BLACK COINS — вероятнее всего, была допущена ошибка при вводе реквизитов. К нашему сожалению, из-за большого количества попыток обмана, мы перестали рассматривать подобные обращения. Для проверки зачисления BLACK COINS необходимо ввести в игре команду: /donat.[/SIZE][/FONT][/COLOR][/CENTER]<br>" +
     "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px]Вам необходимо быть внимательными при осуществлении покупок.[/SIZE][/FONT][/COLOR][/CENTER]<br>" +
      "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px]Если Вы считаете, что ошибки быть не может и с момента оплаты не прошло более 14 дней — в обязательном порядке обратитесь в службу поддержки для дальнейшего решения: На сайте через виджет обратной связи или посредством месенджеров: ВКонтакте: vk.com/br_tech, Telegram: t.me/br_techBot[/SIZE][/FONT][/COLOR][/CENTER]<br>" +
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br>' +
      '[CENTER][SIZE=15px][COLOR=rgb(255, 0, 0)][ICODE]Закрыто.[/ICODE][/SIZE][/CENTER][/COLOR]',
    prefix: DECIDED_PREFIX,
    status: false,
},
{
	title: 'Слетел аккаунт',
	color: 'oswald: 3px; color: #FFFFFF; background: #000000; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #FF0000',
	content:
	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=Trebuchet ms][SIZE=14px]{{ greeting }}, [/COLOR][COLOR=rgb(255, 204, 0)][ICODE]{{ user.name }}[/ICODE][/COLOR].<br><br>" +
	"[COLOR=rgb(209, 213, 216)]Проверьте ввод своих данных: пароль, никнейм и сервер. Зачастую игроки просто забывают ввести актуальные данные и считают, что их аккаунт был удален. Будьте внимательны![/COLOR]<br>" +
    "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
	'[COLOR=rgb(60, 170, 113)]Рассмотрено.[/COLOR][/CENTER][/FONT][/SIZE]',
	prefix: WATCHED_PREFIX,
	status: false,
},
{
    title: 'Отвязать привязку',
    color: 'oswald: 3px; color: #FFFFFF; background: #000000; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #FF0000',

    content:
    "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Trebuchet ms][SIZE=14px]{{ greeting }}, [/COLOR][COLOR=rgb(123, 104, 238)][ICODE]{{ user.name }}[/ICODE][/COLOR].<br><br>" +
    '[COLOR=rgb(209, 213, 216)]К сожалению, отвязать привязки от аккаунта не предоставляется возможным. Если на аккаунте присутствует чужая привязка, то он будет заблокирован.[/COLOR]<br>' +
    "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
    '[COLOR=rgb(255, 0, 0)]Закрыто.[/COLOR][/FONT][/SIZE]',
    prefix: CLOSE_PREFIX,
    status: false,
},
{
	title: 'Хочу занять должность',
	color: 'oswald: 3px; color: #FFFFFF; background: #000000; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #FF0000',
	content:
	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=Trebuchet ms][SIZE=14px]{{ greeting }}, [/COLOR][COLOR=rgb(123, 104, 238)][ICODE]{{ user.name }}[/ICODE][/COLOR].<br><br>" +
	"[COLOR=rgb(209, 213, 216)]Команда технических специалистов не решает назначение на какую-либо должность, которая присутствует на проекте.<br>Для этого существуют заявления в главном разделе форума - [URL='https://forum.blackrussia.online/forums/%D0%97%D0%90%D0%AF%D0%92%D0%9A%D0%98-%D0%9D%D0%90-%D0%94%D0%9E%D0%9B%D0%96%D0%9D%D0%9E%D0%A1%D0%A2%D0%98-%D0%9B%D0%98%D0%94%D0%95%D0%A0%D0%9E%D0%92-%D0%98-%D0%90%D0%93%D0%95%D0%9D%D0%A2%D0%9E%D0%92-%D0%9F%D0%9E%D0%94%D0%94%D0%95%D0%A0%D0%96%D0%9A%D0%98.3066/']нажмите[/URL][/COLOR]<br>" +
	"[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
	'[COLOR=rgb(255, 0, 0)]Закрыто.[/COLOR][/CENTER][/FONT][/SIZE]',
	prefix: CLOSE_PREFIX,
	status: false,
},
{
	title: 'Улучшения для серверов',
	color: 'oswald: 3px; color: #FFFFFF; background: #000000; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #FF0000',
	content:
	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=Trebuchet ms][SIZE=14px]{{ greeting }}, [/COLOR][COLOR=rgb(123, 104, 238)][ICODE]{{ user.name }}[/ICODE][/COLOR].<br><br>" +
	'[COLOR=rgb(209, 213, 216)]Данная тема не относится к техническому разделу.<br>Предложить улучшение можно тут - [URL="https://forum.blackrussia.online/index.php?categories/Предложения-по-улучшению.656/"]нажмите[/URL][/COLOR]<br>' +
	"[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
	'[COLOR=rgb(255, 0, 0)]Закрыто.[/COLOR][/CENTER][/FONT][/SIZE]' ,
	prefix: CLOSE_PREFIX,
	status: false,
},
{
	title: 'Вам нужны все прошивки',
	color: 'oswald: 3px; color: #FFFFFF; background: #000000; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #FF0000',
	content:
	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=Trebuchet ms][SIZE=14px]{{ greeting }}, [/COLOR][COLOR=rgb(123, 104, 238)][ICODE]{{ user.name }}[/ICODE][/COLOR].<br><br>" +
	'[COLOR=rgb(209, 213, 216)]Для активации какой-либо прошивки, необходимо приобрести все детали данного типа "SPORT" "SPORT+" и т.п.[/COLOR]<br>' +
	"[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
	'[COLOR=rgb(255, 0, 0)]Закрыто.[/COLOR][/CENTER][/FONT][/SIZE]',
	prefix: CLOSE_PREFIX,
	status: false,
},
{
	title: 'Тестерам',
	color: 'oswald: 3px; color: #FFFFFF; background: #000000; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #FF0000',
	content:
	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=Trebuchet ms][SIZE=14px]{{ greeting }}, [/COLOR][COLOR=rgb(123, 104, 238)][ICODE]{{ user.name }}[/ICODE][/COLOR].<br><br>" +
	"[COLOR=rgb(209, 213, 216)]Ваша тема передана на тестирование.[/COLOR][/CENTER][/FONT][/SIZE]" +
	"[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>",
	prefix: WAIT_PREFIX,
	status: false,
},
{
	title: 'Ответ от Тестеров',
	color: 'oswald: 3px; color: #FFFFFF; background: #000000; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #FF0000',
	content:
	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=Trebuchet ms][SIZE=14px]{{ greeting }}, [/COLOR][COLOR=rgb(123, 104, 238)][ICODE]{{ user.name }}[/ICODE][/COLOR].<br><br>" +
	'[COLOR=rgb(209, 213, 216)]Ответ от тестерского отдела дан выше.[/COLOR]<br>' +
	"[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
	'[COLOR=rgb(60, 170, 113)]Рассмотрено.[/COLOR][/CENTER][/FONT][/SIZE]',
	prefix: WATCHED_PREFIX,
	status: false,
},
{
	title: 'Пропали вещи с аукциона',
	color: 'oswald: 3px; color: #FFFFFF; background: #000000; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #FF0000',
	content:
	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=Trebuchet ms][SIZE=14px]{{ greeting }}, [/COLOR][COLOR=rgb(123, 104, 238)][ICODE]{{ user.name }}[/ICODE][/COLOR].<br><br>" +
	'[COLOR=rgb(209, 213, 216)]Если вы выставили свои вещи на аукцион, а их никто не купил, воспользуйтесь командой - [/COLOR][COLOR=rgb(60, 170, 113)]/reward[/COLOR]<br>[COLOR=rgb(209, 213, 216)]В случае отсутствия вещей там, создайте новую тему, приложив доказательства.[/COLOR]<br>'+
	"[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
	'[COLOR=rgb(255, 0, 0)]Закрыто.[/COLOR][/CENTER][/FONT][/SIZE]',
	prefix: CLOSE_PREFIX,
	status: false,
},
{
	title: 'Направить в тех. поддержку',
	color: 'oswald: 3px; color: #FFFFFF; background: #000000; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #FF0000',
	content:
	"[FONT=Trebuchet ms][SIZE=14px]Здравствуйте, {{ user.mention }}.<br><br>" +
	'Для решения данной проблемы обратитесь в техническую поддержку.<br><br>1. Через виджет на официальном сайте — https://blackrussia.online/<br>2. Вконтакте — https://vk.com/br_tech<br>3. Телеграм — https://t.me/br_techBot<br><br>' +
	'Закрыто.[/FONT][/SIZE]',
	prefix: WATCHED_PREFIX,
	status: false,
},
];

	$(document).ready(() => {
	// Загрузка скрипта для обработки шаблонов
	$('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');

	// Добавление кнопок при загрузке страницы
        addButton('На рассмотрении', 'pin', 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 173, 51, 0.5);');
        addButton('Команде проекта', 'teamProject', 'border-radius: 13px; margin-right: 5px; border: 2px solid;  border-color: rgb(255, 240, 110, 0.5);');
        addButton('Техническому специалисту', 'techspec', 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(17, 92, 208, 0.5);');
        addButton('Рассмотрено', 'watched', 'border-radius: 13px; margin-right: 5px; border: 2px solid;  border-color: rgb(110, 192, 113, 0.5)');
        addButton('Решено', 'decided', 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(110, 192, 113, 0.5);');
        addButton('Отказано', 'unaccept', 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(220, 89, 89, 0.5);');
        addButton('Закрыто', 'closed', 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(220, 89, 89, 0.5);');
        addAnswers();

	// Поиск информации о теме
	const threadData = getThreadData();

	$(`button#ff`).click(() => pasteContent(8, threadData, true));
	$(`button#prr`).click(() => pasteContent(2, threadData, true));
	$(`button#zhb`).click(() => pasteContent(21, threadData, true));
	$('button#unaccept').click(() => editThreadData(UNACCEPT_PREFIX, false));
	$('button#pin').click(() => editThreadData(PIN_PREFIX, true));
	$('button#teamProject').click(() => editThreadData(COMMAND_PREFIX, true));
	$('button#watched').click(() => editThreadData(WATCHED_PREFIX, false));
	$('button#decided').click(() => editThreadData(DECIDED_PREFIX, false));
	$('button#closed').click(() => editThreadData(CLOSE_PREFIX, false));
	$('button#closed_complaint').click(() => editThreadData(CLOSE_PREFIX, false, false));
	$('button#techspec').click(() => editThreadData(TECHADM_PREFIX, true));

	$(`button#selectAnswer`).click(() => {
		XF.alert(buttonsMarkup(buttons), null, '¿¿¿');
		buttons.forEach((btn, id) => {
		if (id > 3) {
		$(`button#answers-${id}`).click(() => pasteContent(id, threadData, true));
		}
		else {
		$(`button#answers-${id}`).click(() => pasteContent(id, threadData, false));
        }
		});
		});
		});


		function addButton(name, id, hex = "grey") {
		$('.button--icon--reply').before(
		`<button type="button" class="button--primary button rippleButton" id="${id}" style="border-radius: 25px; margin-right: 5px; background-color: ${hex}">${name}</button>`,
		);
		}
		function addAnswers() {
			$('.button--icon--reply').after(`<button type="button" class="button--cta uix_quickReply--button button button--icon button--icon--write rippleButton" id="selectAnswer" style="oswald: 3px; margin-left: 15px; background: #000000; border-radius: 25px;">???</button>`,
		);
		}
		function buttonsMarkup(buttons) {
		return `<div class="select_answer">${buttons
		  .map(
			(btn, i) =>
			  `<button id="answers-${i}" class="button--primary button ` +
			  `rippleButton" style="margin:5px; background-color: ${btn.color || "grey"}"><span class="button-text">${btn.title}</span></button>`,
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
	4 < hours && hours <= 11 ?
	'Доброе утро' :
	11 < hours && hours <= 17 ?
	'Добрый день' :
	17 < hours && hours <= 23 ?
	'Добрый вечер' :
	'Доброй ночи',
	};
	}

	function editThreadData(prefix, pin = false, may_lens = true) {
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
	discussion_open: 1,
	sticky: 1,
	_xfToken: XF.config.csrf,
	_xfRequestUri: document.URL.split(XF.config.url.fullBase)[1],
	_xfWithData: 1,
	_xfResponseType: 'json',
	}),
	}).then(() => location.reload());
	}
	if(may_lens === true) {
	if(prefix == UNACCEPT_PREFIX || prefix == WATCHED_PREFIX || prefix == CLOSE_PREFIX || prefix == DECIDED_PREFIX) {
	moveThread(prefix, 230); }

	if(prefix == WAIT_PREFIX) {
	moveThread(prefix, 917);
	}
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