// ==UserScript==
// @name br_tech_actual
// @namespace https://forum.blackrussia.online
// @version 1.6.11
// @description text
// @author Gleb
// @match https://forum.blackrussia.online/threads/*
// @include https://forum.blackrussia.online/threads/
// @grant none
// @license MIT
// @collaborator
// @downloadURL https://update.greasyfork.org/scripts/472736/br_tech_actual.user.js
// @updateURL https://update.greasyfork.org/scripts/472736/br_tech_actual.meta.js
// ==/UserScript==

(function () {
'use strict';
const UNACCEPT_PREFIX = 4; // префикс отказано
const PIN_PREFIX = 2; //  префикс на рассмотрении
const COMMAND_PREFIX = 10; // команде проекта
const CLOSE_PREFIX = 7; // префикс закрыто
const OD_PREFIX = 8; // префикс одобрено
const DECIDED_PREFIX = 6; // префикс решено
const TECHADM_PREFIX = 13 // теху администратору
const WATCHED_PREFIX = 9; // рассмотрено
const WAIT_PREFIX = 14; // ожидание (для переноса в баг-трекер)
const NO_PREFIX = 0;
const buttons = [
    {
	title: '[color=red]ПРИВЕТСТВИЕ',
content:
	 	'Здравствуйте!<br>' +
	'  ',
},
{
	  title: '<font color="FF0000"> <strike> - </strike>',
	 	/*'Здравствуйте!<br>' +
	    "Ваша тема закреплена и находиться на проверке у технического специалиста по направлению - Логи. Пожалуйста, ожидайте ответа в данной теме.<br><br>" +
	    'Создавать новые темы с данной проблемой — не нужно.',
    prefix: TECHADM_PREFIX,
	status: true, */
	},
{
title: 'Не по теме',
	  content:
		'Здравствуйте!<br>' +
		"Ваше сообщение никоим образом не относится к теме раздела.<br><br>" +
		'Отказано.',
	 	prefix: UNACCEPT_PREFIX,
	status: false,
},
{
	title: 'МНОГОКР-ОЕ СОЗДАНИЕ ТЕМ',
content:
		 	'Здравствуйте!<br>' +
		"Дубль темы. В случае, если Вы будете создавать темы с однотипным контентом - Ваш форумный аккаунт может быть заблокирован. <br>" +
		'Отказано.',
	prefix: UNACCEPT_PREFIX,
	status: false,
},
{
title: 'На рассмотрении',
content:
	     	'Здравствуйте!<br>' +
	    "На рассмотрении.<br><br>" +
	    'Создавать новые темы с данной проблемой — не нужно.',
	prefix: PIN_PREFIX,
	status: true,
},
{
title: 'ВОССТАНОВЛЕНИЕ',
content:
		 	'Здравствуйте!<br>' +
		"Если Вы обезопасили Ваш аккаунт и [U]привязали его к странице во ВКонтакте[/U], то сбросить пароль или пин-код Вы всегда сможете обратившись в официальное сообщество проекта - https://vk.com/blackrussia.online. Напишите «Начать» в личные сообщения группы, затем выберите нужные Вам функции.<br><br>" +
        "Если Вы обезопасили Ваш аккаунт и [U]привязали его к аккаунту Telegram[/U], то сбросить пароль или пин-код Вы всегда сможете обратившись к официальному боту проекта - https://t.me/br_helper_bot. Напишите «/start» в личные сообщения с помощником, затем выберите нужные Вам функции.<br><br>" +
		"Если Вы обезопасили Ваш аккаунт и [U]привязали его к почте[/U], то сбросить пароль или пин-код Вы всегда сможете при вводе пароля на сервере. После подключения к серверу нажмите на кнопку «Войти в аккаунт», затем выберите кнопку «Восстановить пароль», после чего на Вашу почту будет отправлено письмо с кодом восстановления.<br><br>" +
        "Если Вы [U]не обезопасили свой аккаунт - его невозможно вернуть[/U]. Игрок самостоятельно несет отвественность за безопаность своего аккаунта.<br><br>" +
        'Надеемся, что Вы сможете восстановить доступ к аккаунту! ',
	prefix: WATCHED_PREFIX,
	status: false,
},
{
title: 'del twink',
content:
		 	'Здравствуйте!<br>' +
        "Данная тема не подлежит рассмотрению. Мы не блокируем игровые аккаунты по просьбам игроков.<br>" +
        'Закрыто.',
	prefix: CLOSE_PREFIX,
	status: false,
},
{
	title: 'КРАШ/ВЫЛЕТ',
content:
		 	'Здравствуйте!<br>' +
		"В том случае, если Вы вылетели из игры во время игрового процесса (произошел краш) [B][U][color=red]на старом движке[/B][/U][/color], обратиться в данную тему - [URL='https://forum.blackrussia.online/threads/%D0%92%D1%8B%D0%BB%D0%B5%D1%82%D1%8B-%D0%BE%D1%82%D1%81%D0%BE%D0%B5%D0%B4%D0%B8%D0%BD%D0%B5%D0%BD%D0%B8%D1%8F-recaptcha-%E2%80%94-%D0%BE%D1%81%D1%82%D0%B0%D0%B2%D0%BB%D1%8F%D0%B9%D1%82%D0%B5-%D0%B7%D0%B0%D1%8F%D0%B2%D0%BA%D1%83-%D0%B2-%D1%8D%D1%82%D0%BE%D0%B9-%D1%82%D0%B5%D0%BC%D0%B5.1045960/']Нажмите[/URL]  по форме:<br>" +
		"[CODE]01. Ваш игровой никнейм: <br> 02. Сервер: <br> 03. Тип проблемы: Обрыв соединения | Проблема с ReCAPTCHA | Краш игры (закрытие игры) | Другое [Выбрать один вариант ответа] <br> 04. Действия, которые привели к этому (при вылетах, по возможности предоставлять место сбоя): <br> 05. Как часто данная проблема: <br> 06. Полное название мобильного телефона: <br> 07. Версия Android: <br> 08. Дата и время (по МСК): <br> 09. Связь с Вами по Telegram/VK:[/CODE]<br><br><br>" +
	"В том случае, если Вы вылетели из игры во время игрового процесса (произошел краш) [B][U][color=red]на новом движке[/B][/U][/color], информация отправится автоматически <br>" +
    'Закрыто..',
	prefix: CLOSE_PREFIX,
	status: false,
},
{
 title: 'Не по форме / тех р.',
	  content:
		 	'Здравствуйте!<br>' +
		"Ваше обращение составлено не по форме.<br><br>" +
        'Форма подачи: <br>' +
        '[LEFT][QUOTE]01. Ваш игровой никнейм:<br>02. Сервер, на котором Вы играете:<br>03. Суть возникшей проблемы (описать максимально подробно и раскрыто):<br>04. Любые скриншоты, которые могут помочь в решении проблемы (если таковые имеются):<br>05.Дата и время произошедшей технической проблемы (постарайтесь указать максимально точно):[/QUOTE][/LEFT]<br><br>' +
		'Отказано.',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
},
{
	  title: 'НЕТ ДОК-В',
	  content:
		 	'Здравствуйте!<br>' +
		"Без доказательств (в частности скриншоты или видео) – решить проблему не получится. Если доказательства найдутся - создайте новую тему, приложив доказательства с фото-хостинга yapx.ru, imgur.com или youtube.com <br><br>" +
		'Отказано.',
	prefix: UNACCEPT_PREFIX,
	status: false,
},
{
	  title: 'ХОЧУ СТАТЬ АДМ/ХЕЛПЕРОМ',
	  content:
		 	'Здравствуйте!<br>' +
		"Команда технических специалистов не решает назначение на какую-либо должность, которая присутствует на проекте. Для этого существуют заявления в главном разделе Вашего игрового сервера, где Вы можете ознакомиться с открытыми должностями и формами подач.<br><br>" +
		"Приятной игры и времяпровождения!",
			prefix: CLOSE_PREFIX,
			status: false,
},
{
title: 'Команде проекта',
content:  	'Здравствуйте!<br>' +
"Ваша тема передана команде проекта. Пожалуйста, ожидайте выноса вердикта разработчиков."+
"Создавать новые темы с данной проблемой — не требуется, ожидайте ответа в данной теме. Если проблема решится - Вы всегда можете оставить своё сообщение в этой теме.<br>",
	prefix: COMMAND_PREFIX,
	status: true,
},
{
title: 'Исправлено',
content:
		 	'Здравствуйте!<br>' +
		"Данная недоработка была исправлена.<br>" +
        "Приятной игры и времяпровождения!",
    status: false,
	prefix: WATCHED_PREFIX,
},
{
title: 'Будет исправленно',
content:
		 	'Здравствуйте!<br>' +
		"Данная недоработка будет проверена и исправлена. Спасибо, ценим Ваш вклад.<br>" +
    "Приятной игры и времяпровождения!",
	prefix: WATCHED_PREFIX,
	status: false,
},
{
title: 'Актуально?',
content:  	'Здравствуйте!<br>' +
"Ваше обращение актуально?",
    prefix: PIN_PREFIX,
	status: true,
},
{
	  title: '<font color="FF0000"> <strike> - </strike>',
		 	/*'Здравствуйте!<br>' +
		'Вы получили наказание от технического специалиста Вашего сервера. Вам следует обратиться в раздел «Жалобы на технических специалистов» — в случае, если Вы не согласны с наказанием.<br><br>' +
        'Ссылка на раздел, где можно оформить жалобу на технического специалиста: https://forum.blackrussia.online/index.php?forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D1%82%D0%B5%D1%85%D0%BD%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%B8%D1%85-%D1%81%D0%BF%D0%B5%D1%86%D0%B8%D0%B0%D0%BB%D0%B8%D1%81%D1%82%D0%BE%D0%B2.490/ <br><br>' +
        'Отказано.',
prefix: UNACCEPT_PREFIX,
status: false, */
},
{
title: 'Известно КП',
content:
		 	'Здравствуйте!<br>' +
		"Команде проекта уже известно о данной проблеме, она обязательно будет рассмотрена и исправлена. Спасибо за Ваше обращение!<br>" +
    "Приятной игры и времяпровождения!",
	prefix: CLOSE_PREFIX,
	status: false,
},
{
	  title: 'ТЕСТЕРАМ',
	  content:
		 	'Здравствуйте!<br>' +
		"Ваша тема передана на тестирование.<br><br>",
    prefix: WAIT_PREFIX,
    status: false,
},
{
	title: 'Переустановите игру',
	content:  	'Здравствуйте!<br>' +
	"Возможно в файлах вашей игры присутствуют постороннее оборудование(дополнения/изменения).<br>" +
	"Рекомендуется удалить полностью лаунчер и связанные с ним файлы и установить игру заново с официального сайта - [URL='http://brussia-new.reactnet.site/launcher.apk']перейти[/URL]. <br>" +
	'Решено.',
	prefix: DECIDED_PREFIX,
	status: false,
},
   {
	  title: 'Донат',
	  content:
		 	'Здравствуйте!<br>' +
            "По проблемам доната писать сюда - [URL='https://vk.com/br_tech'][B][U][COLOR=rgb(209, 213, 216)]https://vk.com/br_tech[/COLOR][/U][/B][/URL] [COLOR=rgb(250, 197, 28)][B]или [/B][/COLOR][URL='https://t.me/br_techBot'][U][B][COLOR=rgb(209, 213, 216)]https://t.me/br_techBot[/COLOR][/B][/U][/URL] <br>" +
       "Приятной игры и времяпровождения!",
	prefix: DECIDED_PREFIX,
	status: false,
},
{
title: 'Отсутствие ответа',
content:  	'Здравствуйте!<br>' +
"Закрыто в связи с отсутствием ответа. <br>" +
"Пожалуйста, если данная проблема все ещё актуальна, оставьте новую заявку в данном разделе.",
	prefix: CLOSE_PREFIX,
	status: false,
},
{
	title: 'Жалобы',
			content:
			 	'Здравствуйте!<br>' +

    "[LEFT]Обратитесь в раздел «Жалобы» Вашего сервера:<br>[URL='https://forum.blackrussia.online/index.php?categories/Жалобы.54/'][B]Сервер №1 | Red → нажмите сюда[/URL]<br>[URL='https://forum.blackrussia.online/index.php?categories/Жалобы.98/'][B]Сервер №2 | Green → нажмите сюда[/URL]<br>[URL='https://forum.blackrussia.online/index.php?categories/Жалобы.138/'][B]Сервер №3 | Blue → нажмите сюда[/URL]<br>[URL='https://forum.blackrussia.online/index.php?categories/Жалобы.174/'][B]Сервер №4 | Yellow → нажмите сюда[/URL]<br>[URL='https://forum.blackrussia.online/index.php?categories/Жалобы.251/'][B]Сервер №5 | Orange → нажмите сюда[/URL]<br>[URL='https://forum.blackrussia.online/index.php?categories/Жалобы.291/'][B]Сервер №6 | Purple → нажмите сюда[/URL]<br>[URL='https://forum.blackrussia.online/index.php?categories/Жалобы.331/'][B]Сервер №7 | Lime → нажмите сюда[/URL]<br>[URL='https://forum.blackrussia.online/index.php?categories/Жалобы.373/'][B]Сервер №8 | Pink → нажмите сюда[/URL]<br>[URL='https://forum.blackrussia.online/index.php?categories/Жалобы.414/'][B]Сервер №9 | Cherry → нажмите сюда[/URL]<br>[URL='https://forum.blackrussia.online/index.php?categories/Жалобы.467/'][B]Сервер №10 | Black → нажмите сюда[/URL]<br>[URL='https://forum.blackrussia.online/index.php?categories/Жалобы.498/'][B]Сервер №11 | Indigo → нажмите сюда[/URL]<br>[URL='https://forum.blackrussia.online/index.php?categories/Жалобы.654/'][B]Сервер №12 | White → нажмите сюда[/URL]<br>[URL='https://forum.blackrussia.online/index.php?categories/Жалобы.655/'][B]Сервер №13 | Magenta → нажмите сюда[/URL]<br>[URL='https://forum.blackrussia.online/index.php?forums/Жалобы.619/'][B]Сервер №14 | Crimson → нажмите сюда[/URL]<br>[URL='https://forum.blackrussia.online/index.php?categories/Жалобы.700/'][B]Сервер №15 | Gold → нажмите сюда[/URL]<br>[URL='https://forum.blackrussia.online/index.php?categories/Жалобы.720/'][B]Сервер №16 | Azure → нажмите сюда[/URL]<br>[URL='https://forum.blackrussia.online/index.php?categories/Жалобы.763/'][B]Сервер №17 | Platinum → нажмите сюда[/URL]<br>[URL='https://forum.blackrussia.online/index.php?forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B.822/'] [B] Сервер №18 | Aqua → нажмите сюда[/URL]<br>[URL='https://forum.blackrussia.online/index.php?forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B.863/'][B]Сервер №19 | Gray → нажмите сюда[/URL]<br>[URL='https://forum.blackrussia.online/index.php?forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B.932/'] [B]Сервер №20 | Ice  → нажмите сюда[/URL]<br>[URL='https://forum.blackrussia.online/index.php?forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B.972/'] [B]Сервер №21 | Chilli  → нажмите сюда[/URL]<br>[URL='https://forum.blackrussia.online/index.php?forums/Жалобы.1014/'] [B]Сервер №22 | Choco  → нажмите сюда[/URL]<br>[URL='https://forum.blackrussia.online/index.php?forums/Жалобы.1060/'] [B]Сервер №23 | Moscow → нажмите сюда[/URL]<br>[URL='https://forum.blackrussia.online/index.php?forums/Жалобы.1102/'] [B]Сервер №24 | SPB → нажмите сюда[/URL]<br>[URL='https://forum.blackrussia.online/index.php?forums/Жалобы.1145/']Сервер №25 | UFA → нажмите сюда[/URL]<br>[URL='https://forum.blackrussia.online/index.php?forums/Жалобы.1212/']Сервер №26 | SOCHI → нажмите сюда[/URL]<br>[URL='https://forum.blackrussia.online/index.php?forums/Жалобы.1254/']Сервер №27 | KAZAN → нажмите сюда[/URL]<br>[URL='https://forum.blackrussia.online/index.php?forums/Жалобы.1298/']Сервер №28 | SAMARA → нажмите сюда[/URL]<br>[URL='https://forum.blackrussia.online/index.php?forums/Жалобы.1340/']Сервер №29 | ROSTOV → нажмите сюда[/URL]<br>[URL='https://forum.blackrussia.online/index.php?forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B.1380/']Сервер №30 | ANAPA → нажмите сюда[/URL]<br>[URL='https://forum.blackrussia.online/index.php?forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B.1422/']Сервер №31 | EKB → нажмите сюда[/URL]<br>[URL='https://forum.blackrussia.online/index.php?forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B.1466/']Сервер №32 | KRASNODAR → нажмите сюда[/URL]<br>[URL='https://forum.blackrussia.online/index.php?forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B.1508/']Сервер №33 | ARZAMAS → нажмите сюда[/URL]<br>[URL='https://forum.blackrussia.online/index.php?forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B.1550/']Сервер №34 | NOVOSIBIRSK → нажмите сюда[/URL]<br>[URL='https://forum.blackrussia.online/index.php?forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B.1592/']Сервер №35 | GROZNY → нажмите сюда[/URL]<br>[URL='https://forum.blackrussia.online/index.php?forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B.1634/']Сервер №36 | SARATOV → нажмите сюда[/URL]<br>[URL='https://forum.blackrussia.online/index.php?forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B.1676/']Сервер №37 | OMSK → нажмите сюда[/URL]<br>[URL='https://forum.blackrussia.online/index.php?forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B.1718/']Сервер №38 | IRKUTSK → нажмите сюда[/URL]<br>[URL='https://forum.blackrussia.online/index.php?forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B.1764/']Сервер №39 | VOLGOGRAD → нажмите сюда[/URL]<br>[URL='https://forum.blackrussia.online/index.php?forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B.1806/']Сервер №40 | VORONEZH → нажмите сюда[/URL]<br>[URL='https://forum.blackrussia.online/index.php?forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B.1848/']Сервер №41 | BELGOROD → нажмите сюда[/URL]<br>[URL='https://forum.blackrussia.online/index.php?forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B.1890/']Сервер №42 | MAKHACHKALA → нажмите сюда[/URL]<br>[URL='https://forum.blackrussia.online/index.php?forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B.1931/']Сервер №43 | VLADIKAVKAZ → нажмите сюда[/URL]<br>[URL='https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B.1974/']Сервер №44 | VLADIVOSTOK → нажмите сюда[/URL]<br>[URL='https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B.2016/']Сервер №45 | KALININGRAD → нажмите сюда[/URL]<br>[URL='https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B.2058/']Сервер №46 | СHELYABINSK → нажмите сюда[/URL]<br>[URL='https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B.2100/']Сервер №47 | KRASNOYARSK → нажмите сюда[/URL]<br>[URL='https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B.2142/']Сервер №48 | CHEBOKSARY → нажмите сюда[/URL]<br>[URL='https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B.2184/'] Сервер №49 KHABAROVSK → нажмите сюда[/URL]<br>[URL='https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B.2226/'] Сервер №50 | PERM → нажмите сюда[/URL]<br>[URL='https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B.2268/'] Сервер №51 | TULA → нажмите сюда[/URL]<br>[URL='https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B.2310/'] Сервер №52 | RYAZAN → нажмите сюда[/URL]<br>[URL='https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B.2352/'] Сервер №53 | MURMANSK → нажмите сюда[/URL]<br>[URL='https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B.2394/'] Сервер №54 | PENZA  → нажмите сюда[/URL]<br>[URL='https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B.2436/'] Сервер №55 | KURSK  → нажмите сюда[/URL]<br>[URL='https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B.2478/'] Сервер №56 | ARKHANGELSK  → нажмите сюда[/URL]<br>[URL='https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B.2523/'] Сервер №57 | ORENBURG  → нажмите сюда[/URL]<br>[URL='https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B.2562/'] Сервер №58 | KIROV  → нажмите сюда[/URL]<br>[URL='https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B.2604/'] Сервер №59 | KEMEROVO  → нажмите сюда[/URL]<br>[URL='https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B.2660/'] Сервер №60 | TYUMEN  → нажмите сюда[/URL]<br>[URL='https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B.2699/'] Сервер №61 | TOLYATTI  → нажмите сюда[/URL]<br>[URL='https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B.2732/'] Сервер №62 | IVANOVO  → нажмите сюда[/URL]<br>[URL='https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B.2764/'] Сервер №63 | STAVROPOL  → нажмите сюда[/URL]<br>[URL='https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B.2796/'] Сервер №64 | SMOLENSK  → нажмите сюда[/URL]<br>[URL='https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B.2828/'] Сервер №65 | PSKOV  → нажмите сюда[/URL]<br>[URL='https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B.2860/'] Сервер №66 | BRYANSK  → нажмите сюда[/URL]<br>[URL='https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B.2892/'] Сервер №67 | OREL  → нажмите сюда[/URL]<br>[URL='https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B.2924/'] Сервер №68 | YAROSLAVL  → нажмите сюда[/URL]<br>[URL='https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B.2956/'] Сервер №69 | BARNAUL  → нажмите сюда[/URL]<br>[URL='https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B.2988/'] Сервер №70 | LIPETSK  → нажмите сюда[/URL]<br>[URL='https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B.3020/'] Сервер №71 | ULYANOVSK  → нажмите сюда[/URL]<br>" +
    'Отказано.',
		prefix: UNACCEPT_PREFIX,
		status: false,
},
        {
	  title: 'Наказание по МСК',
	  content:
		 	'Здравствуйте!<br>' +
		'Наказание любого вида снимается в соответствии с московским часовым поясом. <br><br>' +
"Приятной игры и времяпровождения!",
	prefix: CLOSE_PREFIX,
	status: false,
	},
    {
	  title: 'Ответ от ТЕСТЕРОВ',
	  content:
		 	'Здравствуйте!<br>' +
		'Ответ от тестерского отдела дан выше. <br><br>' +
        'Закрыто.',
	prefix: CLOSE_PREFIX,
	status: false,
	},
    {
	  title: 'Отвязка привязок',
	  content:
		 	'Здравствуйте!<br>' +
		'К сожалению, почту, VK, Telegram, Discord отвязать от аккаунта не представляется возможным. <br><br>' +
        'Закрыто.',
	prefix: CLOSE_PREFIX,
	status: false,
	},
    {
	  title: 'потеря имущества зл-ками',
	  content:
		 	'Здравствуйте!<br>' +
		'К сожалению, Ваш аккаунт был взломан злоумышленниками и поэтому мы никоем образом не сможем восстановить потерянное имущество. <br><br>' +
        'Впредь позаботьтесь о безопасности своего аккаунта. Приятной игры! <br><br>' +
"Приятной игры и времяпровождения!",
	prefix: UNACCEPT_PREFIX,
	status: false,
	},
    {
	  title: 'Правила восстановления',
	  content:
		 	'Здравствуйте!<br>' +
		"Пожалуйста, убедительная просьба, ознакомьтесь с правилами восстановлений: https://forum.blackrussia.online/index.php?threads/%D0%92-%D0%BA%D0%B0%D0%BA%D0%B8%D1%85-%D1%81%D0%BB%D1%83%D1%87%D0%B0%D1%8F%D1%85-%D0%BC%D1%8B-%D0%BD%D0%B5-%D0%B2%D0%BE%D1%81%D1%81%D1%82%D0%B0%D0%BD%D0%B0%D0%B2%D0%BB%D0%B8%D0%B2%D0%B0%D0%B5%D0%BC-%D0%B8%D0%B3%D1%80%D0%BE%D0%B2%D0%BE%D0%B5-%D0%B8%D0%BC%D1%83%D1%89%D0%B5%D1%81%D1%82%D0%B2%D0%BE.25277/. <br> Вы создали тему, которая никоим образом не относится к технической проблеме. Имущество не будет восстановлено.<br><br>" +
		'Отказано.',
        prefix: UNACCEPT_PREFIX,
	status: false,
	},
    {
	  title: 'КП без закрепа',
	  content:
		 	'Здравствуйте!<br>' +
		'Ваша тема будет перадана команде проекта. <br>',
	prefix: WATCHED_PREFIX,
	status: false,
	},
    {
	  title: 'Сервер не отвечает',
	  content:
	     	'Здравствуйте!<br>' +
	    "Если у Вас встречаются такие проблемы, как «Сервер не отвечает», не отображаются сервера в лаунчере, не удаётся выполнить вход на сайт/форум, попробуйте совершить следующие действия: <br><br>" +
	    "[LEFT]• Сменить IP-адрес любыми средствами; <br>" +
   "[LEFT]• Переключиться на Wi-Fi/мобильный интернет или на любую доступную сеть; <br>"+
    "[LEFT]• Использование VPN; <br>"+
    "[LEFT]• Перезагрузка роутера.<br><br>" +

"Если методы выше не помогли, то переходим к следующим шагам: <br><br>" +

  '[LEFT]1. Устанавливаем приложение «1.1.1.1: Faster & Safer Internet»<br>'+
  '[LEFT]2. Соглашаемся со всей политикой приложения.<br>'+
  '[LEFT]3. Нажимаем на ползунок и ждем, когда текст изменится на «Подключено».<br>'+
  '[LEFT]4. Проверяем: Отображаются ли серверы? Удается ли выполнить вход в игру? Работают ли другие источники (сайт, форум)? <br><br>' +

  "Включение продемонстрировано на видео: https://youtu.be/Wft0j69b9dk <br><br>" +
"Приятной игры и времяпровождения!",
	prefix: WATCHED_PREFIX,
	status: false,
	},
    {
	  title: 'Слетел аккаунт',
	  content:
         	'Здравствуйте!<br>' +
        "Аккаунт не может пропасть или аннулироваться просто так. Даже если Вы меняете ник, используете кнопки «починить игру» или «сброс настроек» - Ваш аккаунт не удаляется. Система работает иначе.<br><br>" +
        "Проверьте ввод своих данных: пароль, никнейм и сервер. Зачастую игроки просто забывают ввести актуальные данные и считают, что их аккаунт был удален. Будьте внимательны!" +
        'Как ввести никнейм (на случай, если сменили в игре, но не поменяли в клиенте): https://youtu.be/c8rhVwkoFaU  <br><br>' +
"Приятной игры и времяпровождения!",
	prefix: WATCHED_PREFIX,
	status: false,
	},
    {
	  title: 'НЕ МОГУ ЗАГРУЗИТЬ ДОК-ВО (большой вес файла)',
	  content:
         	'Здравствуйте!<br>' +
        "Для загрузки доказательств используйте такие сервисы, как [URL='https://yapx.ru/']yapx.ru[/URL], [URL='https://imgur.com/']imgur.com[/URL], [URL='https://www.youtube.com/']youtube.com[/URL].<br><br>" +
        'Закрыто.',
        status: false,
        prefix: CLOSE_PREFIX,
	},
    {
         title: 'Не тех проблема',
	  content:
		  	'Здравствуйте!<br>' +
		"Не является технической проблемой.<br><br>" +
	  'Закрыто.',
	  prefix: CLOSE_PREFIX,
	  status: false,
        },
    {
        title: 'Не тот сервер',
	  content:
		  	'Здравствуйте!<br>' +
		"Вы ошиблись сервером.<br><br>" +
	'Отказано.',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
    {
	  title: '<font color="FF0000"> <strike> - </strike>',
		  	/*'Здравствуйте!<br>' +
		"Всем автомобилям, которые были приобретены до 02 июня  05:00, будет добавлена возможность продажи по старой государственной цене.<br><br>" +
        "Обращаем внимание, что в случае, если автомобиль будет продан на руки, государственная стоимость обновится до новой, то есть продажа автомобиля государству будет дешевле.<br><br>" +
		  'Закрыто.',
	  prefix: CLOSE_PREFIX,
	  status: true, */
        },
    {
         title: 'Log',
content:
	     	'Здравствуйте!<br>' +
	    "Ваша тема передана техническому специалисту по игре. Ожидайте ответ в данной теме.<br>",
	prefix: TECHADM_PREFIX,
	status: true,
        },
    {
        title: 'Пропали вещи с аукциона',
	content:
	  	'Здравствуйте!<br>' +
	'Если Вы выставили свои вещи на аукцион, а их никто не купил, то воспользуйтесь командой [COLOR=rgb(251, 160, 38)]/reward[/COLOR]<br> В случае отсутствии вещей там, приложите скриншоты с /time в новой теме<br>' +
        "Приятной игры и времяпровождения!",
	prefix: CLOSE_PREFIX,
	status: false,
},
{
    title: 'Улучшения для серверов',
	content:
	  	'Здравствуйте!<br>' +
	' Ваша тема не относится к технической проблеме, если вы хотите предложить улучшение для серверов - обратитесь в раздел <br> [URL="https://forum.blackrussia.online/index.php?categories/Предложения-по-улучшению.656/"] Предложения по улучшению → нажмите сюда[/URL].<br>' +
    "Приятной игры и времяпровождения!",
prefix: CLOSE_PREFIX,
	status: false,
},
{
    title: 'Вам нужны все прошивки',
	content:
	  	'Здравствуйте!<br>' +
	' Для активации какой-либо прошивки необходимо поставить все детали данного типа "SPORT" "SPORT+" и т.п.<br>' +
    "Приятной игры и времяпровождения!",
	prefix: CLOSE_PREFIX,
	status: false,
    },
{
    title: 'Почему у меня пропали все темы из раздела Жалобы?',
	content:
'Здравствуйте!<br>' +
	"Раздел 'Жалобы' переводен в приватный режим, а именно:<br>Тему созданную пользователем может видеть <b>он</b> сам и <b>администрация сервера</b>.<br>Ознакомиться с формой подачи тем в тот или иной раздел можно по данной ссылке: [URL='https://forum.blackrussia.online/index.php?forums/Правила-подачи-жалоб.202/']Нажмите сюда[/URL]<br>" +
    "Приятной игры и времяпровождения!",
	prefix: CLOSE_PREFIX,
	status: false,
},
{
	  title: '<font color="FF0000"> <strike> - </strike>',
/*
	'Доброго времени суток!<br><br>' +
	"По техническим причинам данное действие невозможно, пожалуйста воспользуйтесь копированием ссылки от сюда:<br>[img]https://i.ibb.co/SX77Fgw/photo-2022-08-20-16-31-57.jpg[/img]<br>Если данный способ не помогает, то используйте сервис сокращения ссылок [URL='https://clck.ru']клик[/URL]"+
	'Закрыто.',
	prefix: CLOSE_PREFIX,
	status: false,*/
},
{
	  title: '________________________ ДЛЯ ТЕХНИЧЕСКИХ СПЕЦИАЛИСТОВ ПО ИГРЕ ________________________',
	},
	{
	  title: 'Компенсация',
	  content:
         	'Здравствуйте!<br>' +
		"Ваше игровое имущество/денежные средства будут восстановлены в течение месяца. <br>Убедительная просьба, не менять никнейм до момента восстановления.<br><br>" +
        'Для активации восстановления используйте команды: /roulette, /recovery, /reward. <br><br>' +
		'Решено.',
        status: false,
        prefix: DECIDED_PREFIX,
	},
    {
	  title: 'Сброс прописки',
	  content:
		  	'Здравствуйте!<br>' +
        "Ваша прописка будет сброшена, в течении месяца.<br>" +
        "Убедительная просьба, не меняйте игровой никнейм до момента сброса. <br>" +
        'Решено, закрыто.',
       prefix: DECIDED_PREFIX,
	status: false,
	},
{
    title: 'Баг ФСИН',
	  content:
		  	'Здравствуйте!<br>' +
		"Выпустим в ближайшее время, ожидайте.<br><br>" +
	    'Решено, закрыто.',
        status: false,
        prefix: DECIDED_PREFIX,
	},
{
        title: 'BAN IP',
	  content:
		  	'Здравствуйте!<br>' +
		"Смените IP адрес путем перезагрузки роутера.",
        status: false,
        prefix: CLOSE_PREFIX,
	},
{
	  title: '________________________ ДЛЯ ЖАЛОБ НА ТЕХНИЧЕСКИХ СПЕЦИАЛИСТОВ ________________________',
    	},
{
title: 'Передать куратору',
content:
		 	'Здравствуйте!<br>' +
        'Передано куратору.',
	prefix: PIN_PREFIX,
	status: true,
},
{
title: 'НАЗВАНИЕ ТЕМЫ',
content:
		 	'Здравствуйте!<br>' +
        'В названии вашей жалобы отсутствует NickName технического специалиста.<br>' +
		"Пожалуйста, ознакомьтесь с правилами подачи жалоб на технических специалистов [URL='https://forum.blackrussia.online/index.php?threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BF%D0%BE%D0%B4%D0%B0%D1%87%D0%B8-%D0%B6%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D1%82%D0%B5%D1%85%D0%BD%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%B8%D1%85-%D1%81%D0%BF%D0%B5%D1%86%D0%B8%D0%B0%D0%BB%D0%B8%D1%81%D1%82%D0%BE%D0%B2.168934/'][I]кликабельно[/I][/URL]. <br><br>" +
		'Отказано.',
	prefix: UNACCEPT_PREFIX,
	status: false,
},
{
	title: 'Вам в Технический раздел',
	content:
     	'Здравствуйте!<br>' +
	"Ваша тема никоим образом не относится к жалобам на технических специалистов, обратитесь с данной темой в <u>технический раздел вашего сервера</u>  [URL='https://forum.blackrussia.online/index.php?forums/%D0%A2%D0%B5%D1%85%D0%BD%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%B8%D0%B9-%D1%80%D0%B0%D0%B7%D0%B4%D0%B5%D0%BB-azure.701/']клик[/URL]<br>" +
    'Отказано.',
	prefix: UNACCEPT_PREFIX,
	status: false,
},
{
title: 'НЕ ОТНОСИТСЯ',
content:
		 	'Здравствуйте!<br>' +
        'Ваше обращение никоем образом не относится к жалобам на технических специалистов.<br>' +
        'Отказано.',
	prefix: UNACCEPT_PREFIX,
	status: false,
},
{
    title: 'Срок написания',
content:
		 	'Здравствуйте!<br>' +
        'Срок написания жалобы составляет 7 дней с момента выдачи наказания.<br><br>' +
        'Отказано.',
	prefix: UNACCEPT_PREFIX,
	status: false,
},
{
    title: 'На рассмотрении',
content:
	     	'Здравствуйте!<br>' +
	    "Ваша тема закреплена и находиться на рассмотрении. Пожалуйста, ожидайте ответа в данной теме.<br><br>" +
	    'Создавать копии данной темы- не нужно.',
	prefix: PIN_PREFIX,
	status: true,
},
{
    title: 'Передать ГТ',
content:
	     	'Здравствуйте!<br>' +
	    "Ваша тема закреплена и находиться на рассмотрении у [Color=Gold]Главного технического специалиста .[/color] Пожалуйста, ожидайте ответа в данной теме.<br><br>" +
	    'Создавать копии данной темы- не нужно.',
	prefix: COMMAND_PREFIX,
	status: true,
},
{
    	  title: 'Выдано верно',
	  content:
		 	'Здравствуйте!<br>' +
		'Технический специалист предоставил доказательства, наказание выдано верно. <br><br>' +
 'Отказано.',
	prefix: UNACCEPT_PREFIX,
	status: false,
	},
    {
	  title: 'Выдано не верно ',
	  content:
		 	'Здравствуйте!<br>' +
		" Технический специалист допустил ошибку, наказание будет снято.<br><br>" +
		'[Color=lime]Одобрено, закрыто.',
        prefix: OD_PREFIX,
	status: false,
	},
    {
	  title: 'обж отказ',
	  content:
		 	'Здравствуйте!<br>' +
		'В обжаловании отказано.',
	prefix: UNACCEPT_PREFIX,
	status: false,
    },
{
        title: 'обж одобрено',
	  content:
	    	'Здравствуйте!<br>' +
" Ваше наказание будет снято / снижено в ближайшее время.<br><br>" +
"Пожалуйста, впредь не повторяйте ошибок, которые могут привести к таким последствиям, а также внимательно изучите общие правила серверов.<br><br>" +
'В обжаловании [Color=Lime]одобрено.',
 prefix: OD_PREFIX,
	status: false,
	},
    {
         title: 'обж не подлежит',
	  content:
	    	'Здравствуйте!<br>' +
		'Выданное вам наказание обжалованию не подлежит.',
prefix: UNACCEPT_PREFIX,
	status: false,
	},
    {
      title: 'Ответ дан выше',
	  content:
	    	'Здравствуйте!<br>' +
		'Подробный ответ от технического специалиста дан выше.[/FONT]',
prefix: CLOSE_PREFIX,
	status: false,
        },
    {
        title: 'Отсутствует окно блокировки',
	  content:
	    	'Здравствуйте!<br>' +
		'Отсутствует скриншот окна блокировки.<br><br>' +
 'Отказано.',
prefix: UNACCEPT_PREFIX,
	status: false,
	},
    {
        title: 'Будете разблокированы',
	content:
  	'Здравствуйте!<br>' +
	'Произошла ошибка, будете разблокированы, приношу извинения за предоставленные неудобства.[/FONT][/SIZE]<br?'+
	 '[Color=Lime]Решено, закрыто.',
	prefix: CLOSE_PREFIX,
	status: false,
},
{
     title: 'Не по форме / жб тех',
	  content:
		 	'Здравствуйте!<br>' +
		"Ваше сообщение составлено не по форме.<br><br>" +
        'Форма подачи: <br>' +
        '[LEFT][QUOTE]01. Ваш игровой никнейм:<br>02. Игровой никнейм технического специалиста:<br>03. Сервер, на котором Вы играете:<br>04. Описание ситуации (описать максимально подробно и раскрыто):<br>05. Любые скриншоты, которые могут помочь в решении проблемы (если таковые имеются):<br>06.Дата и время произошедшей технической проблемы (постарайтесь указать максимально точно):[/QUOTE][/LEFT]<br><br>' +
		'Отказано.',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
},
{
title: 'ДУБЛИРОВАНИЕ',
content:
		 	'Здравствуйте!<br>' +
		"Данная тема является дубликатом вашей предыдущей жалобы. <br>Пожалуйста, прекратите создавать идентичные или похожие темы - иначе Ваш форумный аккаунт может быть заблокирован.<br><br>" +
		'Отказано.',
	prefix: UNACCEPT_PREFIX,
	status: false,

    },
];

$(document).ready(() => {
$('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');

addButton('Ф/Т', 'ff');
addButton('Ф/Ж', 'fzh');
addButton('ПР', 'prr');
addButton('ЖБ', 'zhb');
addButton('|', '');
addButton('На рассмотрение', 'pin');
addButton('КП', 'teamProject');
addButton('Рассмотрено', 'watched');
addButton('Отказано', 'unaccept');
addButton('Решено', 'decided');
addButton('Закрыто', 'closed');
addButton('Тех. спецу', 'techspec');
addButton('|', '');
addButton('Меню', 'selectAnswer');

const threadData = getThreadData();

$(`button#ff`).click(() => pasteContent(8, threadData, true));
$(`button#prr`).click(() => pasteContent(2, threadData, true));
$(`button#zhb`).click(() => pasteContent(21, threadData, true));
$(`button#fzh`).click(() => pasteContent(61, threadData, true));
$('button#unaccept').click(() => editThreadData(UNACCEPT_PREFIX, false));
$('button#pin').click(() => editThreadData(PIN_PREFIX, true));
$('button#teamProject').click(() => editThreadData(COMMAND_PREFIX, true));
$('button#odb').click(() => editThreadData(OD_PREFIX, false));
$('button#watched').click(() => editThreadData(WATCHED_PREFIX, false));
$('button#decided').click(() => editThreadData(DECIDED_PREFIX, false));
$('button#closed').click(() => editThreadData(CLOSE_PREFIX, false));
$('button#techspec').click(() => editThreadData(TECHADM_PREFIX, true));

$(`button#selectAnswer`).click(() => {
XF.alert(buttonsMarkup(buttons), null, '<font color="FFFFFF"><strong>ВЫБЕРИТЕ ОТВЕТ </color><br><font color="DAA520"><font size="0,2"><p align="right">version new 21.08.23 23:38:42');
buttons.forEach((btn, id) => {
if (id > 2) {
$(`button#answers-${id}`).click(() => pasteContent(id, threadData, true));
}
else {
$(`button#answers-${id}`).click(() => pasteContent(id, threadData, false));
}
});
});
});

/*function addButton(name, id) {
$('.button--icon--reply').before(
`<button type="button" class="button rippleButton" id="${id}" style="oswald: 3px;">${name}</button>`,
);
} */
 function addButton(name, id) {
	$('.button--icon--reply').before(
	`<button type="button" class="button--primary button rippleButton" id="${id}" style="border-radius: 5px;: 25px; margin-right: 5px;">${name}</button>`,
	);
	}

    /*	function addAnswers() {
		$('.button--icon--reply').after(`<button type="button" class="button--cta uix_quickReply--button button button--icon button--icon--write rippleButton" id="selectAnswer" style="oswald: 3px; margin-left: 15px; border-radius: 25px;">ОТВЕТЫ</button>`,
	);
	} */

function buttonsMarkup(buttons) {
return `<div class="select_answer">${buttons
.map(
(btn, i) =>
`<button id="answers-${i}" class="button--primary button ` +
`rippleButton" style="margin:4px"><span class="button-text">${btn.title}</span></button>`,
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
'Здравствуйте' :
15 < hours && hours <= 22 ?
'Добрый вечер' :
'Доброй ночи',
};
}

function editThreadData(prefix, pin = false) {
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
	if(prefix == UNACCEPT_PREFIX || prefix == WATCHED_PREFIX || prefix == CLOSE_PREFIX || prefix == DECIDED_PREFIX || prefix == OD_PREFIX) {
		moveThread(prefix, 230); }

    if(prefix == WAIT_PREFIX) {
		moveThread(prefix, 917);
	}
}

function moveThread(prefix, type) {
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
