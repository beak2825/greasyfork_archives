// ==UserScript==
// @name         скрипт
// @namespace    https://forum.blackrussia.online/
// @version      1.0
// @description  ¿¿¿
// @author       Raf Simons
// @match        https://forum.blackrussia.online/*
// @include      https://forum.blackrussia.online/
// @grant        none
// @license      MIT
// @icon https://i.postimg.cc/YqrNXDMv/1120b3454f429f3e9ffc94fb4f4becad.jpg
// @downloadURL https://update.greasyfork.org/scripts/533258/%D1%81%D0%BA%D1%80%D0%B8%D0%BF%D1%82.user.js
// @updateURL https://update.greasyfork.org/scripts/533258/%D1%81%D0%BA%D1%80%D0%B8%D0%BF%D1%82.meta.js
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
    color: 'black',
    content:
    "[CENTER][SIZE=14px][COLOR=rgb(255, 182, 193)]Здравствуйте, уважаемый[/COLOR] {{ user.mention }}.<br><br>" +
    "текст<br><br>" +
    "[COLOR=rgb(255, 182, 193)]На рассмотрении[/COLOR].[/CENTER][/SIZE]",
    prefix: PIN_PREFIX,
    status: true,
},
{
	title: '2.28',
    color: 'black',
    content:
    "Здравствуйте, {{ user.mention }}.<br><br>" +
    "Блокировка выдана за нарушение данного пункта правил:<br><br>[COLOR=rgb( 255, 0, 0)]2.28.[/COLOR] Запрещена покупка/продажа внутриигровой валюты в любых ее проявлениях за реальные деньги | [COLOR=rgb(255, 0, 0)]PermBan с обнулением аккаунта + ЧС проекта[/COLOR]",
},
{
	title: 'Дублирование',
    color: 'black',
    content:
    "[CENTER][SIZE=14px][COLOR=rgb(255, 182, 193)]Здравствуйте, уважаемый[/COLOR] {{ user.mention }}.<br><br>" +
	"Ваша тема является копией одной из прошлых — [URL='вставьте ссылку']нажмите.[/URL]<br>Пожалуйста, прекратите дублировать темы, иначе ваш форумный аккаунт может быть заблокирован.<br><br>" +
	"[COLOR=rgb(255, 182, 193)]Закрыто[/COLOR].[/CENTER][/SIZE]",
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
    "[CENTER][SIZE=14px][COLOR=rgb(255, 182, 193)]Здравствуйте, уважаемый[/COLOR] {{ user.mention }}.<br><br>" +
    "Ваша тема взята на рассмотрение.[/CENTER][/SIZE]",
	prefix: TECHADM_PREFIX,
	status: true,
},
{
	title: 'Передача Руководству',
    color: 'black',
    content:
    "[CENTER][SIZE=14px][COLOR=rgb(255, 182, 193)]Здравствуйте, уважаемый[/COLOR] {{ user.mention }}.<br><br>" +
	"Ваша тема закреплена и ожидает вердикта Куратора технических специалистов.[/SIZE][/CENTER]",
	prefix: PIN_PREFIX,
	status: true,
},
{
	title: 'Вам в Технический раздел',
    color: 'oswald: 3px; color: #7B68EE; background: #000000; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #FF0000',
	content:
    "[CENTER][SIZE=14px][COLOR=rgb(255, 182, 193)]Здравствуйте, уважаемый[/COLOR] {{ user.mention }}.<br><br>" +
	"Ваша тема не относится к жалобам на технических специалистов. Обратитесь в технический раздел вашего сервера - [URL='https://forum.blackrussia.online/index.php?forums/Технический-раздел.22/']нажмите.[/URL]<br><br>" +
	"[COLOR=rgb(255, 182, 193)]Закрыто[/COLOR].[/CENTER][/SIZE]",
	prefix: CLOSE_PREFIX,
	status: false,
},
{
	title: 'Нет окна блокировки',
    color: 'black',
    content:
    "[CENTER][SIZE=14px][COLOR=rgb(255, 182, 193)]Здравствуйте, уважаемый[/COLOR] {{ user.mention }}.<br><br>" +
	"Без окна блокировки тема рассмотрению не подлежит. Создайте новую тему, прикрепив окно блокировки с данных фото-хостингов:<br>[URL='https://yapx.ru/']yapx.ru[/URL], [URL='https://imgur.com/']imgur.com[/URL], [URL='https://imgbb.com']ImgBB.com[/URL]<br><br>" +
	"[COLOR=rgb(255, 182, 193)]Закрыто[/COLOR].[/CENTER][/SIZE]",
	prefix: CLOSE_PREFIX,
	status: false,
},
{
	title: 'Правила',
    color: 'black',
    content:
    "[CENTER][SIZE=14px][COLOR=rgb(255, 182, 193)]Здравствуйте, уважаемый[/COLOR] {{ user.mention }}.<br><br>" +
    "Пожалуйста, ознакомьтесь с назначением данного раздела, так как ваш запрос не относится к жалобам на технических специалистов.<br> Форма подачи и правила данного раздела — [URL='https://forum.blackrussia.online/threads/%D0%A8%D0%B0%D0%B1%D0%BB%D0%BE%D0%BD-%D0%B4%D0%BB%D1%8F-%D0%BF%D0%BE%D0%B4%D0%B0%D1%87%D0%B8-%D0%B6%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D1%82%D0%B5%D1%85%D0%BD%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%BE%D0%B3%D0%BE-%D1%81%D0%BF%D0%B5%D1%86%D0%B8%D0%B0%D0%BB%D0%B8%D1%81%D1%82%D0%B0.7551923/']нажмите[/URL]<br><br>" +
	"[COLOR=rgb(255, 182, 193)]Закрыто[/COLOR].[/CENTER][/SIZE]",
	prefix: CLOSE_PREFIX,
	status: false,
},
{
	title: 'Правила восстановлений',
    color: 'black',
    content:
    "[CENTER][SIZE=14px][COLOR=rgb(255, 182, 193)]Здравствуйте, уважаемый[/COLOR] {{ user.mention }}.<br><br>" +
	"Пожалуйста, убедительная просьба, ознакомьтесь с правилами восстановлений - [URL='https://forum.blackrussia.online/index.php?threads/В-каких-случаях-мы-не-восстанавливаем-игровое-имущество.25277/']нажмите[/URL]<br><br>" +
	"[COLOR=rgb(255, 182, 193)]Закрыто[/COLOR].[/CENTER][/SIZE]",
	prefix: CLOSE_PREFIX,
	status: false,
},
{
	title: 'Не относится',
    color: 'black',
    content:
    "[CENTER][SIZE=14px][COLOR=rgb(255, 182, 193)]Здравствуйте, уважаемый[/COLOR] {{ user.mention }}.<br><br>" +
    "Ваше обращение не относится к жалобам на технических специалистов.<br>Пожалуйста, ознакомьтесь с правилами данного раздела: [URL='https://forum.blackrussia.online/forums/Информация-для-игроков.231/']нажмите[/URL]<br><br>" +
	"[COLOR=rgb(255, 182, 193)]Закрыто[/COLOR].[/CENTER][/SIZE]",
	prefix: CLOSE_PREFIX,
	status: false,
},
{
	title: 'Игрок будет заблокирован',
  	color: 'oswald: 3px; color: #00FA9A; background: #000000; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #ffffff',
	content:
    "[CENTER][SIZE=14px][COLOR=rgb(255, 182, 193)]Здравствуйте, уважаемый[/COLOR] {{ user.mention }}.<br><br>" +
    "После проверки доказательств и системы логирования, вердикт: [COLOR=red]игрок будет заблокирован.[/COLOR]<br><br>" +
	"[COLOR=rgb(255, 182, 193)]Закрыто[/COLOR].[/CENTER][/SIZE]",
},
{
    title: 'Игрок не будет заблокирован',
    color: 'oswald: 3px; color: #FF0000 ; background: #000000; box-shadow: 0 02px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0.2); border: none; border-color: #ffffff',
    content:
    "[CENTER][SIZE=14px][COLOR=rgb(255, 182, 193)]Здравствуйте, уважаемый[/COLOR] {{ user.mention }}.<br><br>" +
    "Недостаточно доказательств для блокировки игрока.<br><br>" +
	"[COLOR=rgb(255, 182, 193)]Закрыто[/COLOR].[/CENTER][/SIZE]",
},
{
    title: 'Запросить привязки',
    color: 'black',
    content:
    "[CENTER][SIZE=14px][COLOR=rgb(255, 182, 193)]Здравствуйте, уважаемый[/COLOR] {{ user.mention }}.<br><br>" +
    "Заполните данную форму:" +
    "[QUOTE]1. Укажите ваш Telegram ID, если ваш игровой аккаунт был привязан к Telegram. Узнать его можно здесь: t.me/getmyid_bot<br><br>2. Укажите ваш оригинальный ID страницы ВКонтакте, которая привязана к аккаунту (взять его можно через данный сайт - https://regvk.com/ )<br><br>3. Укажите почту, которая привязана к аккаунту[/QUOTE][/SIZE][/CENTER]",
    prefix: TECHADM_PREFIX,
    status: true,
},
	{
	title: 'ᅠ ᅠᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠᅠ   FORUM  ᅠ ᅠ ᅠᅠ ᅠ ᅠ ᅠ    ᅠ ᅠ ᅠ  ᅠ ᅠ',
	color: 'oswald: 3px; color: #7B68EE; background: #000000; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
	},
{
    title: 'Форма',
    color: 'black',
	content:
	"[FONT=Trebuchet ms][SIZE=14px]Здравствуйте, {{ user.mention }}.<br><br>" +
    "Создайте новую тему и заполните данную форму:<br><br>[QUOTE]01. Ваш игровой никнейм:<br>02. Сервер, на котором Вы играете:<br>03. Суть Вашей возникшей проблемы (описать максимально подробно и раскрыто): <br>04. Любые скриншоты, которые могут помочь в решении проблемы (если таковые имеются):<br>05. Дата и время произошедшей технической проблемы (постарайтесь указать максимально точно):[/QUOTE][/FONT][/SIZE]",
	prefix: CLOSE_PREFIX,
	status: false,
},
{
	title: 'На тех. специалиста',
    color: 'black',
	content:
    "[CENTER][SIZE=14px][COLOR=rgb(255, 182, 193)]Здравствуйте, уважаемый[/COLOR] {{ user.mention }}.<br><br>" +
	"Данная тема не относится к техническому разделу. Обратитесь в раздел жалоб на технических специалистов - [URL='https://forum.blackrussia.online/index.php?forums/Жалобы-на-технических-специалистов.490/']нажмите.[/URL]<br><br>" +
	"[COLOR=rgb(255, 182, 193)]Закрыто[/COLOR].[/CENTER][/SIZE]",
	prefix: CLOSE_PREFIX,
	status: false,
},
{
	title: 'Нет доказательств',
    color: 'black',
    content:
    "[CENTER][SIZE=14px][COLOR=rgb(255, 182, 193)]Здравствуйте, уважаемый[/COLOR] {{ user.mention }}.<br><br>" +
	"Без доказательств (скриншоты или видео) – решить проблему не получится. Если доказательства найдутся, создайте новую тему и загрузите их на фото-хостинги:<br>[URL='https://yapx.ru/']yapx.ru[/URL], [URL='https://imgur.com/']imgur.com[/URL], [URL='https://www.youtube.com/']youtube.com[/URL], [URL='https://imgbb.com']ImgBB.com[/URL].<br><br>" +
	"[COLOR=rgb(255, 182, 193)]Закрыто[/COLOR].[/CENTER][/SIZE]",
	prefix: CLOSE_PREFIX,
	status: false,
},
{
	title: 'Правила',
    color: 'black',
	content:
	"[FONT=Trebuchet ms][SIZE=14px]Здравствуйте, {{ user.mention }}.<br><br>" +
	"[COLOR=rgb(209, 213, 216)]Ваше обращение не относится к техническому разделу.<br><br>Если возникли технические проблемы, которые так или иначе связаны с игровым модом, заполните данную форму:[/COLOR]<br><br>[QUOTE]<br>1. Ваш игровой никнейм:<br>2. Сервер, на котором вы играете:<br>3. Суть возникшей проблемы (описать максимально подробно и раскрыто):<br>3. Любые скриншоты, которые могут помочь в решении проблемы (если таковые имеются):<br>4. Дата и время произошедшей технической проблемы (постарайтесь указать максимально точно):[/QUOTE]<br><br>[COLOR=rgb(209, 213, 216)]Если возникли технические проблемы, которые так или иначе связаны с вылетами из игры и любыми другими проблемами клиента, заполните данную форму:[/COLOR]<br><br>[QUOTE]01. Ваш игровой ник:<br>02. Сервер:<br>03. Тип проблемы: Обрыв соединения | Проблема с ReCAPTCHA | Краш игры (закрытие игры) | Другое [Выбрать один вариант ответа]<br>04. Действия, которые привели к этому (при вылетах, по возможности предоставлять место сбоя):<br>5. Как часто данная проблема:<br>6. Полное название мобильного телефона:<br>7. Версия Android:<br>08. Дата и время (по МСК):<br>Связь с вами по Telegram/VK:[/QUOTE][/FONT][/SIZE]",
	prefix: 7,
	status: false,
},
{
	title: 'Передать логисту',
	color: 'oswald: 3px; color: black; background: lavender; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: black',
	content:
    "[CENTER][SIZE=14px][COLOR=rgb(255, 182, 193)]Здравствуйте, уважаемый[/COLOR] {{ user.mention }}.<br><br>" +
	"Ваша тема передана Техническому Специалисту по Логированию для дальнейшего вердикта, ожидайте ответ в данной теме.[/SIZE][/CENTER]",
	prefix: TECHADM_PREFIX,
	status: true,
},
{
	title: 'Доп. Информация',
    color: 'black',
	content:
	"Для дальнейшего рассмотрения темы, предоставьте:<br><br>[QUOTE]1. Скриншоты или видео, подтверждающие факт владения этим имуществом.<BR>2. Все детали пропажи: дата, время, после каких действий имущество пропало.<BR>3. Информация о том, как вы изначально получили это имущество:<BR>дата покупки<br>способ приобретения (у игрока, в магазине или через донат;<br>фрапс покупки (если есть);<br>никнейм игрока, у которого было приобретено имущество, если покупка была сделана не в магазине.[/QUOTE]",
	prefix: TECHADM_PREFIX,
	status: true,
},
{
 	title: 'Кик за ПО',
    color: 'black',
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
    "[CENTER][SIZE=14px][COLOR=rgb(255, 182, 193)]Здравствуйте, уважаемый[/COLOR] {{ user.mention }}.<br><br>" +
	"Если вы обезопасили свой аккаунт и привязали его к [U]странице во ВКонтакте[/U], то сбросить пароль или пин-код вы всегда сможете обратившись в официальное сообщество проекта - [URL='https://vk.com/blackrussia.online.']нажмите[/URL]<br> Либо обратитесь к боту в Telegram - [URL='https://t.me/br_helper_bot.']нажмите[/URL]<br><br>" +
    "Если вы [U]привязали аккаунт к почте[/U], то сбросить пароль или пин-код вы всегда сможете при вводе пароля на сервере. После подключения к серверу, нажмите на кнопку «Войти в аккаунт», затем выберите кнопку «Восстановить пароль», после чего на вашу почту будет отправлено письмо с одноразовым кодом восстановления.<br><br>" +
	"Если вы не обезопасили свой аккаунт, то вернуть его невозможно. Игрок самостоятельно несет отвественность за безопаность своего аккаунта.<br><br>" +
	"[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
	"[COLOR=rgb(255, 182, 193)]Закрыто[/COLOR].[/CENTER][/SIZE]",
	prefix: 7,
	status: false,
},
{
	title: 'Законопослушность',
    color: 'black',
	content:
    "[CENTER][SIZE=14px][COLOR=rgb(255, 182, 193)]Здравствуйте, уважаемый[/COLOR] {{ user.mention }}.<br><br>" +
	"К сожалению, администрация, технические специалисты и другие должностные лица BLACK RUSSIA не могут повлиять на законопослушность вашего аккаунта.<br><br>Повысить законопослушность можно тремя способами:<br><br>1. Каждый PayDay (00 минут каждого часа) вам начисляется одно очко законопослушности, если за прошедший час вы отыграли не менее 20 минут.<br>2. Приобрести законопослушность в /donate.<br>3. На работе Электрика: для этого нужно починить 5 фонарей и тогда вам дадут 5 законопослушности.<br><br>" +
	"[COLOR=rgb(255, 182, 193)]Закрыто[/COLOR].[/CENTER][/SIZE]",
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
    "[CENTER][SIZE=14px][COLOR=rgb(255, 182, 193)]Здравствуйте, уважаемый[/COLOR] {{ user.mention }}.<br><br>" +
	"Разработчикам уже известно о данной проблеме.<br>Спасибо за ваше обращение.<br><br>" +
	"[COLOR=rgb(255, 182, 193)]Закрыто[/COLOR].[/CENTER][/SIZE]",
	prefix: CLOSE_PREFIX,
	status: false,
},
{
	title: 'В ГОСС',
    color: 'black',
	content:
    "[CENTER][SIZE=14px][COLOR=rgb(255, 182, 193)]Здравствуйте, уважаемый[/COLOR] {{ user.mention }}.<br><br>" +
	"Ваша тема не относится к техническому разделу, пожалуйста, оставьте ваше заявление или жалобу в соответствующем разделе Государственных Организаций вашего сервера.<br><br>"+
	"[COLOR=rgb(255, 182, 193)]Закрыто[/COLOR].[/CENTER][/SIZE]",
	prefix: UNACCEPT_PREFIX,
	status: false,
},
{
	title: 'В ОПГ',
    color: 'black',
	content:
    "[CENTER][SIZE=14px][COLOR=rgb(255, 182, 193)]Здравствуйте, уважаемый[/COLOR] {{ user.mention }}.<br><br>" +
	"[Ваша тема не относится к техническому разделу, пожалуйста, оставьте ваше заявление или жалобу в соответствующем разделе Криминальных Организаций вашего сервера.<br><br>"+
	"[COLOR=rgb(255, 182, 193)]Закрыто[/COLOR].[/CENTER][/SIZE]",
	prefix: UNACCEPT_PREFIX,
	status: false,
},
{
     title: 'На администрацию',
     color: 'oswald: 3px; color: #FF0000; background: #000000; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #ffffff',
     content:
    "[CENTER][SIZE=14px][COLOR=rgb(255, 182, 193)]Здравствуйте, уважаемый[/COLOR] {{ user.mention }}.<br><br>" +
     "Данная тема не относится к жалобам на технических специалистов. Обратитесь в раздел жалоб на администрацию.<br>Форма для подачи жалобы: [URL='https://forum.blackrussia.online/index.php?threads/Правила-подачи-жалоб-на-администрацию.3429349/']нажмите[/URL]<br><br>" +
     "[COLOR=rgb(255, 182, 193)]Закрыто[/COLOR].[/CENTER][/SIZE]",

      prefix: CLOSE_PREFIX,
      status: false,
},
{
	title: 'На игроков',
	color: 'oswald: 3px; color: #1E90FF; background: #000000; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #FF0000',
    content:
    "[CENTER][SIZE=14px][COLOR=rgb(255, 182, 193)]Здравствуйте, уважаемый[/COLOR] {{ user.mention }}.<br><br>" +
    "Данная тема не относится к техническому разделу.<br>Обратитесь в «Жалобы на игроков» Вашего сервера.<br>Форма подачи жалобы: [URL='https://forum.blackrussia.online/index.php?threads/Правила-подачи-жалоб-на-игроков.3429394/']нажмите[/URL]<br><br>" +
	"[COLOR=rgb(255, 182, 193)]Закрыто[/COLOR].[/CENTER][/SIZE]",
    prefix: CLOSE_PREFIX,
    status: false,
},
{
	title: 'Обжалования',
	color: 'oswald: 3px; color: #FF0000; background: #000000; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #FF0000',
	content:
    "[CENTER][SIZE=14px][COLOR=rgb(255, 182, 193)]Здравствуйте, уважаемый[/COLOR] {{ user.mention }}.<br><br>" +
	"Вы получили наказание от администратора своего сервера. Обратитесь в раздел «Обжалования» своего сервера.<br> Форма подачи темы - [URL='https://forum.blackrussia.online/index.php?threads/Правила-подачи-заявки-на-обжалование-наказания.3429398/']нажмите[/URL]<br><br>" +
	"[COLOR=rgb(255, 182, 193)]Закрыто[/COLOR].[/CENTER][/SIZE]",
	prefix: CLOSE_PREFIX,
	status: false,
},
{
    title: 'На игроков!',
    color: 'black',
    content:
    "[FONT=Tahoma]Переношу вашу тему в нужный раздел.[/FONT]",
    prefix: 14,
    status: true,
},
{
    title: 'Отвязать привязку',
    color: 'black',
    content:
    "[CENTER][SIZE=14px][COLOR=rgb(255, 182, 193)]Здравствуйте, уважаемый[/COLOR] {{ user.mention }}.<br><br>" +
    "К сожалению, отвязать привязки от аккаунта не предоставляется возможным. Если на аккаунте присутствует чужая привязка, то он будет заблокирован.<br><br>" +
	"[COLOR=rgb(255, 182, 193)]Закрыто[/COLOR].[/CENTER][/SIZE]",
    prefix: CLOSE_PREFIX,
    status: false,
},
{
	title: 'Хочу занять должность',
    color: 'black',
	content:
    "[CENTER][SIZE=14px][COLOR=rgb(255, 182, 193)]Здравствуйте, уважаемый[/COLOR] {{ user.mention }}.<br><br>" +
	"Команда технических специалистов не решает назначение на какую-либо должность, которая присутствует на проекте.<br>Для этого существуют заявления в главном разделе форума - [URL='https://forum.blackrussia.online/forums/%D0%97%D0%90%D0%AF%D0%92%D0%9A%D0%98-%D0%9D%D0%90-%D0%94%D0%9E%D0%9B%D0%96%D0%9D%D0%9E%D0%A1%D0%A2%D0%98-%D0%9B%D0%98%D0%94%D0%95%D0%A0%D0%9E%D0%92-%D0%98-%D0%90%D0%93%D0%95%D0%9D%D0%A2%D0%9E%D0%92-%D0%9F%D0%9E%D0%94%D0%94%D0%95%D0%A0%D0%96%D0%9A%D0%98.3066/']нажмите[/URL]<br><br>" +
	"[COLOR=rgb(255, 182, 193)]Закрыто[/COLOR].[/CENTER][/SIZE]",
	prefix: CLOSE_PREFIX,
	status: false,
},
{
	title: 'На тестирование',
    color: 'black',
	content:
    "[CENTER][SIZE=14px][COLOR=rgb(255, 182, 193)]Здравствуйте, уважаемый[/COLOR] {{ user.mention }}.<br><br>" +
	"Ваша тема передана на тестирование.[/SIZE][/CENTER]",
	prefix: WAIT_PREFIX,
	status: false,
},
{
	title: 'Направить в тех. поддержку',
    color: 'black',
	content:
    "[CENTER][SIZE=14px][COLOR=rgb(255, 182, 193)]Здравствуйте, уважаемый[/COLOR] {{ user.mention }}.<br><br>" +
	'Для решения данной проблемы обратитесь в техническую поддержку.<br><br>1. Вконтакте — https://vk.com/br_tech<br>2. Телеграм — https://t.me/br_techBot<br><br>' +
	"[COLOR=rgb(255, 182, 193)]Закрыто[/COLOR].[/CENTER][/SIZE]",
	prefix: WATCHED_PREFIX,
	status: false,
},
];

	$(document).ready(() => {
	// Загрузка скрипта для обработки шаблонов
	$('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');

	// Добавление кнопок при загрузке страницы
        addButton('На рассмотрении', 'pin', 'border-radius: 13px; margin-right: 5px; margin-top: 12px; border: 2px solid; border-color: rgb(255,165,0, 0.5);');
        addButton('Техническому специалисту', 'techspec', 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(17, 92, 208, 0.5);');
        addButton('Команде проекта', 'command', 'border-radius: 13px; margin-right: 5px; margin-top: 9px; border: 2px solid; border-color: rgb(240, 230, 140, 0.5);');
        addButton('Закрыто', 'closed', 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5);');
        addAnswers();

	// Поиск информации о теме
	const threadData = getThreadData();

        $('button#pin').click(() => editThreadData(PIN_PREFIX, true));
        $('button#techspec').click(() => editThreadData(TECHADM_PREFIX, true));
        $('button#command').click(() => editThreadData(COMMAND_PREFIX, true));
        $('button#closed').click(() => editThreadData(CLOSE_PREFIX, false));

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
       $('.button--icon--reply').after(`<button type="button" class="button--cta uix_quickReply--button button button--icon button--icon--write rippleButton" id="selectAnswer" style="oswald: 4px; width: 65px; margin-left: 15px; margin-top: 9px; margin-bottom: 17px; color: black; background: lavender; border: 2px solid; border-radius: 13px;">ответы</button>`,
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
	moveThread(prefix, 1912);
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

const bgButtons = document.querySelector(".pageContent");
const buttonConfig = (text, href) => {
  const button = document.createElement("button");
  button.textContent = text;
  button.classList.add("bgButton");
  button.addEventListener("click", () => {
    window.location.href = href;
  });
  return button;
};

const Button2 = buttonConfig("ОПС", "https://forum.blackrussia.online/threads/Общие-правила-серверов.312571/");
const Button3 = buttonConfig("Технический раздел", "https://forum.blackrussia.online/forums/%D0%A2%D0%B5%D1%85%D0%BD%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%B8%D0%B9-%D1%80%D0%B0%D0%B7%D0%B4%D0%B5%D0%BB-makhachkala.1884/");
bgButtons.append(Button2);
bgButtons.append(Button3);

(function () {
    'use strict';
    
        function createAnimatedSnow() {
 
        const snowflakes = [];
 
        function setupCanvas() {
            const canvas = document.createElement('canvas');
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            canvas.id = 'snow-flakes';
            canvas.style.position = 'fixed';
            canvas.style.top = '0';
            canvas.style.left = '0';
            canvas.style.pointerEvents = 'none';
            canvas.style.zIndex = '99999';
            canvas.style.filter = 'blur(2px)';
            document.body.appendChild(canvas);
 
            return canvas.getContext('2d');
        }
 
        function createSnowflake(x, y) {
            const size = Math.random() * 2 + 1;
            const speedY = Math.random() * 1 + 1;
            const speedX = (Math.random() - 0.5) * 2;
 
            return { x, y, size, speedY, speedX };
        }
 
        function drawSnowflake(ctx, snowflake) {
            ctx.beginPath();
            ctx.arc(snowflake.x, snowflake.y, snowflake.size, 0, Math.PI * 2);
            ctx.fillStyle = 'white';
            ctx.fill();
            ctx.closePath();
        }
 
        function updateSnowflakes(ctx) {
            for (let i = 0; i < snowflakes.length; i++) {
                const snowflake = snowflakes[i];
 
                snowflake.y += snowflake.speedY;
                snowflake.x += snowflake.speedX;
 
                if (snowflake.y > window.innerHeight || snowflake.x > window.innerWidth) {
                    snowflakes[i] = createSnowflake(Math.random() * window.innerWidth, Math.random() * -window.innerHeight);
                }
 
                drawSnowflake(ctx, snowflake);
            }
        }
 
        function animateSnow() {
            const ctx = setupCanvas();
 
            for (let i = 0; i < 500; i++) {
                snowflakes.push(createSnowflake(Math.random() * window.innerWidth, Math.random() * window.innerHeight));
            }
 
            function animate() {
                ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
                updateSnowflakes(ctx);
                requestAnimationFrame(animate);
            }
 
            animate();
        }
 
        animateSnow();
 
    }
 
    function removeAnimatedSnow() {
        const snowCanvas = document.querySelector('#snow-flakes');
        document.body.removeChild(snowCanvas);
    }
 
    const uixLogo = document.querySelector('a.uix_logo img');
    uixLogo.src = 'https://i.postimg.cc/JzQPT4Wc/blackrussia.png';
    uixLogo.srcset = 'https://i.postimg.cc/JzQPT4Wc/blackrussia.png';
 
    const messageCellUser = document.querySelectorAll('.message-cell--user');
    messageCellUser.forEach(function (cell) {
        cell.style.background = '#29586c88';
    });
 
    const messageCellMain = document.querySelectorAll('.message-cell--main');
    messageCellMain.forEach(function (cell) {
        cell.style.background = '#15293788';
    });
 
    const scrollbarStyle = document.createElement('style');
    scrollbarStyle.id = 'style-scrollbar';
    scrollbarStyle.textContent = `
    `;
    document.head.appendChild(scrollbarStyle);
 
    const pageHeader = document.querySelector('.pageContent');
    const switchStyleBlock = document.createElement('label');
    switchStyleBlock.className = 'switch';
    switchStyleBlock.innerHTML = `
            <input type="checkbox" id="styleToggleCheck">
            <span class="slider round" style="padding-right: 20px;">
            <span class="addingText" style="display: block; width: max-content; margin: 5px; margin-left: 42px; margin-top: 2px;">Снег</span>
            </span>
        `;
    pageHeader.appendChild(switchStyleBlock);
 
    const styleToggleCheck = document.getElementById('styleToggleCheck');
    if (localStorage.getItem('snowEnabled') === 'true') {
        styleToggleCheck.checked = true;
        createAnimatedSnow();
    }
    styleToggleCheck.addEventListener('change', function () {
        if (styleToggleCheck.checked) {
            createAnimatedSnow();
            localStorage.setItem('snowEnabled', 'true');
        } else {
            removeAnimatedSnow();
            localStorage.setItem('snowEnabled', 'false');
        }
    });
 
    const sliderStyle = document.createElement('style');
    sliderStyle.id = 'slider-style';
    sliderStyle.textContent = `
    .switch {
        position: relative;
        display: inline-block;
        width: 40px;
        height: 20px;
        padding-left: 20px;
        margin: 0 30px 0 auto;
    }
    .switch input { display: none; }
    .slider {
        position: absolute;
        cursor: pointer;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        border: 1px solid #34aaeb;
        background-color: #212428;
        transition: all .4s ease;
    }
    .slider:hover{
        background-color: #29686d;
    }
    .slider:before {
        position: absolute;
        content: "";
        height: 14px;
        width: 14px;
        left: 2px;
        bottom: 2px;
        background-color: #32a0a8;
        box-shadow: 0 0 5px #000000;
        transition: all .4s ease;
    }
    input:checked + .slider {
        background-color: #212428;
    }
    input:checked + .slider:hover {
        background-color: #29686d;
    }
    input:focus + .slider {
        box-shadow: 0 0 5px #222222;
        background-color: #444444;
    }
    input:checked + .slider:before {
        transform: translateX(19px);
    }
    .slider.round {
        border-radius: 34px;
    }
    .slider.round:before {
        border-radius: 50%;
    }
`;
    document.head.appendChild(sliderStyle);
})();