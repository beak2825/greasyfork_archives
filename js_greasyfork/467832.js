// ==UserScript==
// @name TECH
// @namespace https://forum.blackrussia.online
// @version 1.31
// @description типа важно
// @author Gleb
// @match https://forum.blackrussia.online/threads/*
// @include https://forum.blackrussia.online/threads/
// @grant none
// @license MIT
// @collaborator
// @downloadURL https://update.greasyfork.org/scripts/467832/TECH.user.js
// @updateURL https://update.greasyfork.org/scripts/467832/TECH.meta.js
// ==/UserScript==

(function () {
'use strict';
const UNACCEPT_PREFIX = 4; // префикс отказано
const PIN_PREFIX = 2; //  префикс закрепить
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
	title: 'ПРИВЕТСТВИЕ',
content:
	 	'[Color=yellow][SIZE=4][FONT=Times new roman][CENTER]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
	'[CENTER]  [/CENTER]',
},
{
	  title: '-',
content:
	 	'[Color=yellow][SIZE=4][FONT=Times new roman][CENTER]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
	    "[CENTER]Ваша тема закреплена и находиться на проверке у технического специалиста по направлению- Логи. Пожалуйста, ожидайте ответа в данной теме.<br><br>" +
	    '[CENTER]Создавать новые темы с данной проблемой — не нужно.[/CENTER]',
    prefix: TECHADM_PREFIX,
	status: true,
	},
{
title: 'Не по теме',
	  content:
		'[Color=yellow][SIZE=4][FONT=Times new roman][CENTER]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
		"[CENTER]Ваше сообщение никоим образом не относится к теме раздела.[/CENTER]<br><br>" +
		'[Color=Red][CENTER]Отказано, закрыто.[/CENTER][/color][/FONT]',
	 	prefix: UNACCEPT_PREFIX,
	status: false,
},
{
	title: 'МНОГОКР-ОЕ СОЗДАНИЕ ТЕМ',
content:
		 	'[Color=yellow][SIZE=4][FONT=Times new roman][CENTER]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
		"[CENTER]В случае, если Вы продолжите создавать темы с однотипным контентом, [/CENTER]<br>" +
		"[CENTER]Ваш форумный аккаунт будет заблокирован.<br><br>" +
		'[Color=Red][CENTER]Отказано, закрыто.[/CENTER][/color][/FONT]',
	prefix: UNACCEPT_PREFIX,
	status: false,
},
{
title: 'На рассмотрении',
content:
	     	'[Color=yellow][SIZE=4][FONT=Times new roman][CENTER]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
	    "[CENTER]Ваша тема закреплена и находиться на проверке. Пожалуйста, ожидайте ответа в данной теме.<br><br>" +
	    '[CENTER]Создавать новые темы с данной проблемой — не нужно.[/CENTER]',
	prefix: PIN_PREFIX,
	status: true,
},
{
title: 'ВОССТАНОВЛЕНИЕ',
content:
		 	'[Color=yellow][SIZE=4][FONT=Times new roman][CENTER]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
		"[CENTER]Если Вы обезопасили Ваш аккаунт и [U]привязали его к странице во ВКонтакте[/U], то сбросить пароль или пин-код Вы всегда сможете обратившись в официальное сообщество проекта - https://vk.com/blackrussia.online. Напишите «Начать» в личные сообщения группы, затем выберите нужные Вам функции.<br><br>" +
		"[CENTER]Если Вы обезопасили Ваш аккаунт и [U]привязали его к почте[/U], то сбросить пароль или пин-код Вы всегда сможете при вводе пароля на сервере. После подключения к серверу нажмите на кнопку «Войти в аккаунт», затем выберите кнопку «Восстановить пароль», после чего на Вашу почту будет отправлено письмо с кодом восстановления.<br><br>" +
        "[CENTER]Если Вы [U]не обезопасили свой аккаунт - его невозможно вернуть[/U]. Игрок самостоятельно несет отвественность за безопаность своего аккаунта.<br><br>" +
        '[CENTER]К сожалению, иногда решение подобных вопросов требует много времени. Надеемся, что Вы сможете восстановить доступ к аккаунту! [/CENTER]',
	prefix: WATCHED_PREFIX,
	status: false,
},
{
title: 'ВОССТАНОВЛЕНИЕ ФА',
content:
		 	'[Color=yellow][SIZE=4][FONT=Times new roman][CENTER]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]На данный момент, форумное восстановление не работает.<br>О сроках исправления, увы, неизвестно.<br><br>" +
        '[Color=Red][CENTER]Закрыто.[/CENTER][/color][/FONT]',
	prefix: CLOSE_PREFIX,
	status: false,
},
{
	title: 'КРАШ/ВЫЛЕТ',
content:
		 	'[Color=yellow][SIZE=4][FONT=Times new roman][CENTER]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
		"[CENTER]В том случае, если Вы вылетели из игры во время игрового процесса (произошел краш), в обязательном порядке необходимо обратиться в данную тему - https://forum.blackrussia.online/index.php?threads/%D0%92%D1%8B%D0%BB%D0%B5%D1%82%D1%8B-%D0%BE%D1%82%D1%81%D0%BE%D0%B5%D0%B4%D0%B8%D0%BD%D0%B5%D0%BD%D0%B8%D1%8F-recaptcha-%E2%80%94-%D0%BE%D1%81%D1%82%D0%B0%D0%B2%D0%BB%D1%8F%D0%B9%D1%82%D0%B5-%D0%B7%D0%B0%D1%8F%D0%B2%D0%BA%D1%83-%D0%B2-%D1%8D%D1%82%D0%BE%D0%B9-%D1%82%D0%B5%D0%BC%D0%B5.600056/unread [/CENTER]<br>" +
		"[CENTER][CODE]01. Ваш игровой никнейм: <br> 02. Сервер: <br> 03. Тип проблемы: Обрыв соединения | Проблема с ReCAPTCHA | Краш игры (закрытие игры) | Другое [Выбрать один вариант ответа] <br> 04. Действия, которые привели к этому (при вылетах, по возможности предоставлять место сбоя): <br> 05. Как часто данная проблема: <br> 06. Полное название мобильного телефона: <br> 07. Версия Android: <br> 08. Дата и время (по МСК): <br> 09. Связь с Вами по Telegram/VK:[/CODE]<br><br>" +
		'[Color=Red][CENTER]Отказано, закрыто.[/CENTER][/color][/FONT]',
	prefix: UNACCEPT_PREFIX,
	status: false,
},
{
 title: 'Не по форме',
	  content:
		 	'[Color=yellow][SIZE=4][FONT=Times new roman][CENTER]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
		"[CENTER]Ваше сообщение составлено не по форме.[/CENTER]<br><br>" +
        '[CENTER]Если вы подаёте заявку в техническом разделе, заполните данную форму:[/CENTER]<br>' +
        '[LEFT][QUOTE]01. Ваш игровой никнейм:<br>02. Сервер, на котором Вы играете:<br>03. Суть возникшей проблемы (описать максимально подробно и раскрыто):<br>04. Любые скриншоты, которые могут помочь в решении проблемы (если таковые имеются):<br>05.Дата и время произошедшей технической проблемы (постарайтесь указать максимально точно):[/QUOTE][/LEFT]<br><br>' +
        '[CENTER]Если вы подаёте жалобу на тех. специалиста, заполните данную форму:[/CENTER]<br>' +
        '[LEFT][QUOTE]01. Ваш игровой никнейм:<br>02. Игровой никнейм технического специалиста:<br>03. Сервер, на котором Вы играете:<br>04. Описание ситуации (описать максимально подробно и раскрыто):<br>05. Любые скриншоты, которые могут помочь в решении проблемы (если таковые имеются):<br>06.Дата и время произошедшей технической проблемы (постарайтесь указать максимально точно):[/QUOTE][/LEFT]<br><br>' +
		'[Color=Red][CENTER]Отказано, закрыто.[/CENTER][/color][/FONT]',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
},
{
	  title: 'НЕТ ДОК-В',
	  content:
		 	'[Color=yellow][SIZE=4][FONT=Times new roman][CENTER]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
		"[CENTER]Без доказательств (в частности скриншоты или видео) – решить проблему не получится. Если доказательства найдутся - создайте новую тему, приложив доказательства с фото-хостинга yapx.ru или imgur.com<br><br>" +
		'[Color=Red][CENTER]Отказано, закрыто.[/CENTER][/color][/FONT]',
	prefix: UNACCEPT_PREFIX,
	status: false,
},
{
	  title: 'ХОЧУ СТАТЬ АДМ/ХЕЛПЕРОМ',
	  content:
		 	'[Color=yellow][SIZE=4][FONT=Times new roman][CENTER]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
		"[CENTER]Команда технических специалистов не решает назначение на какую-либо должность, которая присутствует на проекте. Для этого существуют заявления в главном разделе Вашего игрового сервера, где Вы можете ознакомиться с открытыми должностями и формами подач. Приятной игры и желаем удачи в карьерной лестнице!<br><br>" +
		'[Color=Red][CENTER]Закрыто.[/CENTER][/color][/FONT]',
			prefix: CLOSE_PREFIX,
			status: false,
},
{
title: 'Команде проекта',
content:  	'[Color=yellow][SIZE=4][FONT=Times new roman][CENTER]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
"[CENTER]Ваша тема закреплена и находится на рассмотрении у [Color=Gold]Команды проекта.[/color] Пожалуйста, ожидайте выноса вердикта разработчиков."+
"[CENTER] Создавать новые темы с данной проблемой — не нужно, ожидайте ответа в данной теме. Если проблема решится - Вы всегда можете оставить своё сообщение в этой теме.<br>",
	prefix: COMMAND_PREFIX,
	status: true,
},
{
title: 'Исправлено',
content:
		 	'[Color=yellow][SIZE=4][FONT=Times new roman][CENTER]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
		"[CENTER]Данная недоработка была исправлена. Спасибо, ценим Ваш вклад.<br><br>" +
		'[Color=lime][CENTER]Рассмотрено, закрыто.[/CENTER][/color][/FONT]',
    status: false,
	prefix: WATCHED_PREFIX,
},
{
title: 'Будет исправленно',
content:
		 	'[Color=yellow][SIZE=4][FONT=Times new roman][CENTER]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
		"[CENTER]Данная недоработка будет проверена и исправлена. Спасибо, ценим Ваш вклад.<br><br>" +
		'[Color=lime][CENTER]Рассмотрено, закрыто.[/CENTER][/color][/FONT]',
	prefix: WATCHED_PREFIX,
	status: false,
},
{
title: 'Актуально?',
content:  	'[Color=yellow][SIZE=4][FONT=Times new roman][CENTER]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
"[CENTER]Ваше обращение актуально?",
    prefix: PIN_PREFIX,
	status: true,
},
{
title: 'ЖБ на ТЕХОВ',
content:
		 	'[Color=yellow][SIZE=4][FONT=Times new roman][CENTER]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
		'[CENTER]Вы получили наказание от технического специалиста Вашего сервера. Вам следует обратиться в раздел «Жалобы на технических специалистов» — в случае, если Вы не согласны с наказанием.<br><br>' +
        '[CENTER]Ссылка на раздел, где можно оформить жалобу на технического специалиста: https://forum.blackrussia.online/index.php?forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D1%82%D0%B5%D1%85%D0%BD%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%B8%D1%85-%D1%81%D0%BF%D0%B5%D1%86%D0%B8%D0%B0%D0%BB%D0%B8%D1%81%D1%82%D0%BE%D0%B2.490/ <br><br>' +
        '[Color=Red][CENTER]Отказано, закрыто.[/CENTER][/color][/FONT]',
prefix: UNACCEPT_PREFIX,
status: false,
},
{
title: 'Известно КП',
content:
		 	'[Color=yellow][SIZE=4][FONT=Times new roman][CENTER]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
		"[CENTER][Color=Gold]Команде проекта[/color] уже известно о данной проблеме, она обязательно будет рассмотрена и исправлена. Спасибо за Ваше обращение!<br><br>" +
		'[Color=Red][CENTER]Закрыто.[/CENTER][/color][/FONT]',
	prefix: CLOSE_PREFIX,
	status: false,
},
{
	  title: 'ТЕСТЕРАМ',
	  content:
		 	'[Color=yellow][SIZE=4][FONT=Times new roman][CENTER]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
		"[CENTER]Ваша тема передана на тестирование.<br><br>[/CENTER]",
    prefix: WAIT_PREFIX,
    status: false,
},
{
	title: 'Переустановите игру',
	content:  	'[Color=yellow][SIZE=4][FONT=Times new roman][CENTER]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
	"[CENTER]Возможно в файлах вашей игры присутствуют постороннее оборудование(дополнения/изменения).<br>" +
	"[CENTER]Рекомендуется удалить полностью лаунчер и связанные с ним файлы и установить игру заново с официального сайта - [URL='http://brussia-new.reactnet.site/launcher.apk']перейти[/URL]. <br>" +
	'[Color=lime][CENTER]Решено.[/CENTER][/color][/FONT]',
	prefix: DECIDED_PREFIX,
	status: false,
},
   {
	  title: 'Донат',
	  content:
		 	'[Color=yellow][SIZE=4][FONT=Times new roman][CENTER]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
		'[CENTER]Система построена таким образом, что деньги не спишутся, пока наша платформа не уведомит платежную систему о зачислении BLACK COINS. Для проверки зачисления BLACK COINS необходимо ввести в игре команду: /donat.<br><br>' +
        '[CENTER]В остальных же случаях, если не были зачислены BLACK COINS — вероятнее всего, была допущена ошибка при вводе реквизитов. К нашему сожалению, из-за большого количества попыток обмана, мы перестали рассматривать подобные жалобы. Вам необходимо быть внимательными при осуществлении покупок. <br><br>' +
        '[CENTER]Если Вы считаете, что ошибки быть не может и с момента оплаты не прошло более 7 дней, то в обязательном порядке обратитесь в данное сообщество для дальнейшего решения: https://vk.com/br_tech.<br><br>' +

       '[Color=lime][CENTER]Решено.[/CENTER][/color][/FONT]',
	prefix: DECIDED_PREFIX,
	status: false,
},
{
title: 'Отсутствие ответа',
content:  	'[Color=yellow][SIZE=4][FONT=Times new roman][CENTER]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
"[CENTER]По техническими соображениям было принято решение закрыть данное обращение.<br><br>" +
"[CENTER] Пожалуйста, если данная проблема все ещё актуальна, оставьте новую заявку в данном разделе." +
'[Color=Red][CENTER]Закрыто.[/CENTER][/color][/FONT]',
	prefix: CLOSE_PREFIX,
	status: false,
},
{
	title: 'Жалобы',
			content:
			 	'[Color=yellow][SIZE=4][FONT=Times new roman][CENTER]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +

		"[LEFT]Обратитесь в раздел «Жалобы» Вашего сервера:<br>[URL='https://forum.blackrussia.online/index.php?categories/Жалобы.54/'][B]Сервер №1 | Red[/B] → нажмите сюда[/URL]<br>[URL='https://forum.blackrussia.online/index.php?categories/Жалобы.98/'][B]Сервер №2 | Green[/B] → нажмите сюда[/URL]<br>[URL='https://forum.blackrussia.online/index.php?categories/Жалобы.138/'][B]Сервер №3 | Blue[/B] → нажмите сюда[/URL]<br>[URL='https://forum.blackrussia.online/index.php?categories/Жалобы.174/'][B]Сервер №4 | Yellow[/B] → нажмите сюда[/URL]<br>[URL='https://forum.blackrussia.online/index.php?categories/Жалобы.251/'][B]Сервер №5 | Orange[/B] → нажмите сюда[/URL]<br>[URL='https://forum.blackrussia.online/index.php?categories/Жалобы.291/'][B]Сервер №6 | Purple[/B] → нажмите сюда[/URL]<br>[URL='https://forum.blackrussia.online/index.php?categories/Жалобы.331/'][B]Сервер №7 | Lime[/B] → нажмите сюда[/URL]<br>[URL='https://forum.blackrussia.online/index.php?categories/Жалобы.373/'][B]Сервер №8 | Pink[/B] → нажмите сюда[/URL]<br>[URL='https://forum.blackrussia.online/index.php?categories/Жалобы.414/'][B]Сервер №9 | Cherry[/B] → нажмите сюда[/URL]<br>[URL='https://forum.blackrussia.online/index.php?categories/Жалобы.467/'][B]Сервер №10 | Black[/B] → нажмите сюда[/URL]<br>[URL='https://forum.blackrussia.online/index.php?categories/Жалобы.498/'][B]Сервер №11 | Indigo[/B] → нажмите сюда[/URL]<br>[URL='https://forum.blackrussia.online/index.php?categories/Жалобы.654/'][B]Сервер №12 | White[/B] → нажмите сюда[/URL]<br>[URL='https://forum.blackrussia.online/index.php?categories/Жалобы.655/'][B]Сервер №13 | Magenta[/B] → нажмите сюда[/URL]<br>[URL='https://forum.blackrussia.online/index.php?forums/Жалобы.619/'][B]Сервер №14 | Crimson[/B] → нажмите сюда[/URL]<br>[URL='https://forum.blackrussia.online/index.php?categories/Жалобы.700/'][B]Сервер №15 | Gold[/B] → нажмите сюда[/URL]<br>[URL='https://forum.blackrussia.online/index.php?categories/Жалобы.720/'][B]Сервер №16 | Azure[/B] → нажмите сюда[/URL]<br>[URL='https://forum.blackrussia.online/index.php?categories/Жалобы.763/'][B]Сервер №17 | Platinum[/B] → нажмите сюда[/URL]<br>[URL='https://forum.blackrussia.online/index.php?forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B.822/'] [B] Сервер №18 | Aqua[/B] → нажмите сюда[/URL]<br>[URL='https://forum.blackrussia.online/index.php?forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B.863/'][B]Сервер №19 | Gray[/B] → нажмите сюда[/URL]<br>[URL='https://forum.blackrussia.online/index.php?forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B.932/'] [B]Сервер №20 | Ice [/B] → нажмите сюда[/URL]<br>[URL='https://forum.blackrussia.online/index.php?forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B.972/'] [B]Сервер №21 | Chilli [/B] → нажмите сюда[/URL]<br>[URL='https://forum.blackrussia.online/index.php?forums/Жалобы.1014/'] [B]Сервер №22 | Choco [/B] → нажмите сюда[/URL]<br>[URL='https://forum.blackrussia.online/index.php?forums/Жалобы.1060/'] [B]Сервер №23 | Moscow[/B] → нажмите сюда[/URL]<br>[URL='https://forum.blackrussia.online/index.php?forums/Жалобы.1102/'] [B]Сервер №24 | SPB[/B] → нажмите сюда[/URL]<br>[URL='https://forum.blackrussia.online/index.php?forums/Жалобы.1145/']Сервер №25 | UFA → нажмите сюда[/URL]<br>[URL='https://forum.blackrussia.online/index.php?forums/Жалобы.1212/']Сервер №26 | SOCHI → нажмите сюда[/URL]<br>[URL='https://forum.blackrussia.online/index.php?forums/Жалобы.1254/']Сервер №27 | KAZAN → нажмите сюда[/URL]<br>[URL='https://forum.blackrussia.online/index.php?forums/Жалобы.1298/']Сервер №28 | SAMARA → нажмите сюда[/URL]<br>[URL='https://forum.blackrussia.online/index.php?forums/Жалобы.1340/']Сервер №29 | ROSTOV → нажмите сюда[/URL]<br>[URL='https://forum.blackrussia.online/index.php?forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B.1380/']Сервер №30 | ANAPA → нажмите сюда[/URL]<br>[URL='https://forum.blackrussia.online/index.php?forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B.1422/']Сервер №31 | EKB → нажмите сюда[/URL]<br>[URL='https://forum.blackrussia.online/index.php?forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B.1466/']Сервер №32 | KRASNODAR → нажмите сюда[/URL]<br>[URL='https://forum.blackrussia.online/index.php?forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B.1508/']Сервер №33 | ARZAMAS → нажмите сюда[/URL]<br>[URL='https://forum.blackrussia.online/index.php?forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B.1550/']Сервер №34 | NOVOSIBIRSK → нажмите сюда[/URL]<br>[URL='https://forum.blackrussia.online/index.php?forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B.1592/']Сервер №35 | GROZNY → нажмите сюда[/URL]<br>[URL='https://forum.blackrussia.online/index.php?forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B.1634/']Сервер №36 | SARATOV → нажмите сюда[/URL]<br>[URL='https://forum.blackrussia.online/index.php?forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B.1676/']Сервер №37 | OMSK → нажмите сюда[/URL]<br>[URL='https://forum.blackrussia.online/index.php?forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B.1718/']Сервер №38 | IRKUTSK → нажмите сюда[/URL]<br>[URL='https://forum.blackrussia.online/index.php?forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B.1764/']Сервер №39 | VOLGOGRAD → нажмите сюда[/URL]<br>[URL='https://forum.blackrussia.online/index.php?forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B.1806/']Сервер №40 | VORONEZH → нажмите сюда[/URL]<br>[URL='https://forum.blackrussia.online/index.php?forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B.1848/']Сервер №41 | BELGOROD → нажмите сюда[/URL]<br>[URL='https://forum.blackrussia.online/index.php?forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B.1890/']Сервер №42 | MAKHACHKALA → нажмите сюда[/URL]<br>[URL='https://forum.blackrussia.online/index.php?forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B.1931/']Сервер №43 | VLADIKAVKAZ → нажмите сюда[/URL]<br>[URL='https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B.1974/']Сервер №44 | VLADIVOSTOK → нажмите сюда[/URL]<br>" +
	'[Color=Red][CENTER]Отказано, закрыто.[/CENTER][/color][/FONT]',
		prefix: UNACCEPT_PREFIX,
		status: false,
},
        {
	  title: 'Наказание по МСК',
	  content:
		 	'[Color=yellow][SIZE=4][FONT=Times new roman][CENTER]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
		'[CENTER]Наказание любого вида снимается в соответствии с московским часовым поясом. <br><br>' +
        '[Color=Red][CENTER]Отказано, закрыто.[/CENTER][/color][/FONT]',
	prefix: UNACCEPT_PREFIX,
	status: false,
	},
    {
	  title: 'Ответ от ТЕСТЕРОВ',
	  content:
		 	'[Color=yellow][SIZE=4][FONT=Times new roman][CENTER]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
		'[CENTER]Ответ от тестерского отдела дан выше. <br><br>' +
        '[Color=Red][CENTER]Закрыто.[/CENTER][/color][/FONT]',
	prefix: CLOSE_PREFIX,
	status: false,
	},
    {
	  title: 'Отвязка привязок',
	  content:
		 	'[Color=yellow][SIZE=4][FONT=Times new roman][CENTER]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
		'[CENTER]К сожалению, почту, VK, Telegram отвязать не представляется возможным. <br><br>' +
        '[Color=Red][CENTER]Отказано, закрыто.[/CENTER][/color][/FONT]',
	prefix: UNACCEPT_PREFIX,
	status: false,
	},
    {
	  title: 'потеря имущества зл-ками',
	  content:
		 	'[Color=yellow][SIZE=4][FONT=Times new roman][CENTER]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
		'[CENTER]К сожалению, вероятнее всего, Ваш аккаунт был взломан злоумышленниками и поэтому мы никоем образом не сможем восстановить потерянное имущество. <br><br>' +
        '[CENTER]Впредь позаботьтесь о безопасности своего аккаунта. Приятной игры! <br><br>' +
 '[Color=Red][CENTER]Отказано, закрыто.[/CENTER][/color][/FONT]',
	prefix: UNACCEPT_PREFIX,
	status: false,
	},
    {
	  title: 'Правила восстановления',
	  content:
		 	'[Color=yellow][SIZE=4][FONT=Times new roman][CENTER]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
		"[CENTER]Пожалуйста, убедительная просьба, ознакомьтесь с правилами восстановлений: https://forum.blackrussia.online/index.php?threads/%D0%92-%D0%BA%D0%B0%D0%BA%D0%B8%D1%85-%D1%81%D0%BB%D1%83%D1%87%D0%B0%D1%8F%D1%85-%D0%BC%D1%8B-%D0%BD%D0%B5-%D0%B2%D0%BE%D1%81%D1%81%D1%82%D0%B0%D0%BD%D0%B0%D0%B2%D0%BB%D0%B8%D0%B2%D0%B0%D0%B5%D0%BC-%D0%B8%D0%B3%D1%80%D0%BE%D0%B2%D0%BE%D0%B5-%D0%B8%D0%BC%D1%83%D1%89%D0%B5%D1%81%D1%82%D0%B2%D0%BE.25277/. Вы создали тему, которая никоим образом не относится к технической проблеме. Имущество не будет восстановлено.[/CENTER]<br><br>" +
		'[Color=Red][CENTER]Отказано, закрыто.[/CENTER][/color][/FONT]',
        prefix: UNACCEPT_PREFIX,
	status: false,
	},
    {
	  title: 'КП без закрепа',
	  content:
		 	'[Color=yellow][SIZE=4][FONT=Times new roman][CENTER]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
		'[CENTER]Ваша тема перадана команде проекта. <br><br>' +
        '[Color=lime][CENTER]Рассмотрено, закрыто.[/CENTER][/color][/FONT]',
	prefix: WATCHED_PREFIX,
	status: false,
	},
    {
	  title: 'Сервер не отвечает',
	  content:
	     	'[Color=yellow][SIZE=4][FONT=Times new roman][CENTER]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
	    "[CENTER]Если у Вас встречаются такие проблемы, как «Сервер не отвечает», не отображаются сервера в лаунчере, не удаётся выполнить вход на сайт/форум, попробуйте совершить следующие действия: <br><br>" +
	    "[LEFT]• Сменить IP-адрес любыми средствами; <br>" +
   "[LEFT]• Переключиться на Wi-Fi/мобильный интернет или на любую доступную сеть; <br>"+
    "[LEFT]• Использование VPN; <br>"+
    "[LEFT]• Перезагрузка роутера.<br><br>" +

"[CENTER]Если методы выше не помогли, то переходим к следующим шагам: <br><br>" +

  '[LEFT]1. Устанавливаем приложение «1.1.1.1: Faster & Safer Internet»<br>'+
  '[LEFT]2. Соглашаемся со всей политикой приложения.<br>'+
  '[LEFT]3. Нажимаем на ползунок и ждем, когда текст изменится на «Подключено».<br>'+
  '[LEFT]4. Проверяем: Отображаются ли серверы? Удается ли выполнить вход в игру? Работают ли другие источники (сайт, форум)? <br><br>' +

  "[CENTER]Включение продемонстрировано на видео: https://youtu.be/Wft0j69b9dk <br><br>" +
	    '[Color=lime][CENTER]Рассмотрено, закрыто.[/CENTER][/color][/FONT]',
	prefix: WATCHED_PREFIX,
	status: false,
	},
    {
	  title: 'Слетел аккаунт',
	  content:
         	'[Color=yellow][SIZE=4][FONT=Times new roman][CENTER]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Аккаунт не может пропасть или аннулироваться просто так. Даже если Вы меняете ник, используете кнопки «починить игру» или «сброс настроек» - Ваш аккаунт не удаляется. Система работает иначе.<br><br>" +
        "[CENTER]Проверьте ввод своих данных: пароль, никнейм и сервер. Зачастую игроки просто забывают ввести актуальные данные и считают, что их аккаунт был удален. Будьте внимательны!" +
        '[CENTER]Как ввести никнейм (на случай, если сменили в игре, но не поменяли в клиенте): https://youtu.be/c8rhVwkoFaU [/CENTER] <br><br>' +
       '[Color=lime][CENTER]Рассмотрено, закрыто.[/CENTER][/color][/FONT]',
	prefix: WATCHED_PREFIX,
	status: false,
	},
    {
	  title: 'НЕ МОГУ ЗАГРУЗИТЬ ДОК-ВО (большой вес файла)',
	  content:
         	'[Color=yellow][SIZE=4][FONT=Times new roman][CENTER]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Для загрузки доказательств используйте такие сервисы, как [URL='https://yapx.ru/']yapx.ru[/URL], [URL='https://imgur.com/']imgur.com[/URL], [URL='https://www.youtube.com/']youtube.com[/URL].<br><br>" +
        '[Color=Red][CENTER]Закрыто.[/CENTER][/color][/FONT]',
        status: false,
        prefix: CLOSE_PREFIX,
	},
    {
         title: 'Не тех проблема',
	  content:
		  	'[Color=yellow][SIZE=4][FONT=Times new roman][CENTER]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
		"[CENTER]Не является технической проблемой.[/CENTER]<br><br>" +
	  '[Color=Red][CENTER]Закрыто.[/CENTER][/color][/FONT]',
	  prefix: CLOSE_PREFIX,
	  status: false,
        },
    {
        title: 'Не тот сервер',
	  content:
		  	'[Color=yellow][SIZE=4][FONT=Times new roman][CENTER]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
		"[CENTER]Вы ошиблись сервером.[/CENTER]<br><br>" +
	'[Color=Red][CENTER]Отказано, закрыто.[/CENTER][/color][/FONT]',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
    {
         title: 'SELLCAR',
	  content:
		  	'[Color=yellow][SIZE=4][FONT=Times new roman][CENTER]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
		"[CENTER]Всем автомобилям, которые были приобретены до 02 июня 05:00, будет добавлена возможность продажи по старой государственной цене.[/CENTER]<br><br>" +
        "[CENTER]Обращаем внимание, что в случае, если автомобиль будет продан на руки, государственная стоимость обновится до новой, то есть продажа автомобиля государству будет дешевле.[/CENTER]<br><br>" +
		  '[Color=Red][CENTER]Закрыто.[/CENTER][/color][/FONT]',
	  prefix: CLOSE_PREFIX,
	  status: true,
        },
    {
         title: 'Log',
content:
	     	'[Color=yellow][SIZE=4][FONT=Times new roman][CENTER]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
	    "[CENTER]Ваша тема закреплена и находиться на проверке у технического специалиста по направлению- Логи. Пожалуйста, ожидайте ответа в данной теме.<br><br>" +
	    '[CENTER]Создавать новые темы с данной проблемой — не нужно.[/CENTER]',
	prefix: TECHADM_PREFIX,
	status: true,
        },
    {
        title: 'Пропали вещи с аукциона',
	content:
	  	'[Color=yellow][SIZE=4][FONT=Times new roman][CENTER]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
	'[CENTER]Если Вы выставили свои вещи на аукцион а их никто не купил, то воспользуйтесь командой [COLOR=rgb(251, 160, 38)]/reward[/COLOR]<br> В случае отсутствии вещей там, приложите скриншоты с /time в новой теме<br>Закрыто. [/CENTER][/FONT]',
	prefix: CLOSE_PREFIX,
	status: false,
},
{
    title: 'Улучшения для серверов',
	content:
	  	'[Color=yellow][SIZE=4][FONT=Times new roman][CENTER]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
	'[CENTER] Ваша тема не относится к технической проблеме, если вы хотите предложить изменения в игровом моде - обратитесь в раздел <br> [URL="https://forum.blackrussia.online/index.php?categories/Предложения-по-улучшению.656/"] Предложения по улучшению → нажмите сюда[/URL].<br> [/CENTER][/FONT]' ,
prefix: CLOSE_PREFIX,
	status: false,
},
{
    title: 'Вам нужны все прошивки',
	content:
	  	'[Color=yellow][SIZE=4][FONT=Times new roman][CENTER]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
	'[CENTER] Для активации какой-либо прошивки необходимо поставить все детали данного типа "SPORT" "SPORT+" и т.п.<br>Закрыто[/CENTER][/FONT]',
	prefix: CLOSE_PREFIX,
	status: false,
    },
{
    title: 'Почему у меня пропали все темы из раздела Жалобы?',
	content:
'[Color=yellow][SIZE=4][FONT=Times new roman][CENTER]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
	"[CENTER]Раздел 'Жалобы' переводен в приватный режим, а именно:<br>Тему созданную пользователем пожет видеть <b>он</b> сам и <b>администрация сервера</b>.<br>Ознакомиться с формой подачи тем в тот или иной раздел можно по данной ссылке: [URL='https://forum.blackrussia.online/index.php?forums/Правила-подачи-жалоб.202/']клик[/URL]<br>Приятного времяприпровождения на нашем форуме<br><i>Закрыто</i>. [/CENTER][/FONT][/SIZE]",
	prefix: CLOSE_PREFIX,
	status: false,
},
{
    title: 'Если не работают ссылки',
	content:
	'[SIZE=4][FONT=Veranda][CENTER]Доброе время суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
	"[CENTER]По техническим причинам данное действие невозможно, пожалуйста воспользуйтесь копированием ссылки от сюда:<br>[img]https://i.ibb.co/SX77Fgw/photo-2022-08-20-16-31-57.jpg[/img]<br>Если данный способ не помогает, то используйте сервис сокращения ссылок [URL='https://clck.ru']клик[/URL][/CENTER]"+
	'[CENTER][I]Закрыто[/I].[/CENTER][/FONT][/SIZE]',
	prefix: CLOSE_PREFIX,
	status: false,
},
{
	  title: '________________________ ДЛЯ ТЕХНИЧЕСКИХ СПЕЦИАЛИСТОВ ПО ИГРЕ ________________________',
	},
	{
	  title: 'Компенсация',
	  content:
         	'[Color=yellow][SIZE=4][FONT=Times new roman][CENTER]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
		"[CENTER]Ваше игровое имущество/денежные средства будут восстановлены в течение месяца. <br>Убедительная просьба, не менять никнейм до момента восстановления.<br><br>" +
        '[CENTER]Для активации восстановления используйте команды: /roulette, /recovery.[/CENTER]<br><br>' +
		'[Color=lime][CENTER]Решено.[/CENTER][/color][/FONT]',
        status: false,
        prefix: DECIDED_PREFIX,
	},
    {
	  title: 'Сброс прописки',
	  content:
		  	'[Color=yellow][SIZE=4][FONT=Times new roman][CENTER]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Ваша прописка будет сброшена, в течении месяца.<br>" +
        "[CENTER]Убедительная просьба, не меняйте игровой никнейм до момента сброса. <br>" +
        '[CENTER]@Ryan_Imanaliev<br><br>' +
        '[Color=Lime][CENTER]Решено, закрыто.[/CENTER][/color][/FONT]',
       prefix: DECIDED_PREFIX,
	status: false,
	},
{
    title: 'Баг ФСИН',
	  content:
		  	'[Color=yellow][SIZE=4][FONT=Times new roman][CENTER]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
		"[CENTER]Выпустим в ближайшее время, ожидайте.[/CENTER]<br><br>" +
	    '[Color=Lime][CENTER]Решено, закрыто.[/CENTER][/color][/FONT]',
        status: false,
        prefix: DECIDED_PREFIX,
	},
{
	  title: '________________________ ДЛЯ ЖАЛОБ НА ТЕХНИЧЕСКИХ СПЕЦИАЛИСТОВ ________________________',
	},
{
title: 'НАЗВАНИЕ ТЕМЫ',
content:
		 	'[Color=yellow][SIZE=4][FONT=Times new roman][CENTER]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        '[CENTER]В названии вашей жалобы отсутствует NickName технического специалиста.<br>' +
		"[CENTER]Пожалуйста, ознакомьтесь с правилами подачи жалоб на технических специалистов [URL='https://forum.blackrussia.online/index.php?threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BF%D0%BE%D0%B4%D0%B0%D1%87%D0%B8-%D0%B6%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D1%82%D0%B5%D1%85%D0%BD%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%B8%D1%85-%D1%81%D0%BF%D0%B5%D1%86%D0%B8%D0%B0%D0%BB%D0%B8%D1%81%D1%82%D0%BE%D0%B2.168934/'][I]кликабельно[/I][/URL]. <br><br>" +
		'[Color=Red][CENTER]Отказано, закрыто.[/CENTER][/color][/FONT]',
	prefix: UNACCEPT_PREFIX,
	status: false,
},
{
	title: 'Вам в Технический раздел',
	content:
     	'[Color=yellow][SIZE=4][FONT=Times new roman][CENTER]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
	"[CENTER]Ваша тема никоим образом не относится к жалобам на технических специалистов, обратитесь с данной темой в <u>технический раздел вашего сервера</u>  [URL='https://forum.blackrussia.online/index.php?forums/%D0%A2%D0%B5%D1%85%D0%BD%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%B8%D0%B9-%D1%80%D0%B0%D0%B7%D0%B4%D0%B5%D0%BB-azure.701/']клик[/URL]<br>" +
    '[Color=Red][CENTER]Отказано, закрыто.[/CENTER][/color][/FONT]',
	prefix: UNACCEPT_PREFIX,
	status: false,
},
{
title: 'НЕ ОТНОСИТСЯ',
content:
		 	'[Color=yellow][SIZE=4][FONT=Times new roman][CENTER]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        '[CENTER]Ваше обращение никоем образом не относится к жалобам на технических специалистов.<br>' +
        '[Color=Red][CENTER]Отказано, закрыто.[/CENTER][/color][/FONT]',
	prefix: UNACCEPT_PREFIX,
	status: false,
},
{
    title: 'Срок написания',
content:
		 	'[Color=yellow][SIZE=4][FONT=Times new roman][CENTER]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        '[CENTER]Срок написания жалобы составляет 7 дней с момента выдачи наказания.<br><br>' +
        '[Color=Red][CENTER]Отказано, закрыто.[/CENTER][/color][/FONT]',
	prefix: UNACCEPT_PREFIX,
	status: false,
},
{
    title: 'На рассмотрении',
content:
	     	'[Color=yellow][SIZE=4][FONT=Times new roman][CENTER]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
	    "[CENTER]Ваша тема закреплена и находиться на рассмотрении. Пожалуйста, ожидайте ответа в данной теме.<br><br>" +
	    '[CENTER]Создавать копии данной темы- не нужно.[/CENTER]',
	prefix: PIN_PREFIX,
	status: true,
},
{
    title: 'Передать ГТ',
content:
	     	'[Color=yellow][SIZE=4][FONT=Times new roman][CENTER]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
	    "[CENTER]Ваша тема закреплена и находиться на рассмотрении у [Color=Gold]Главного технического специалиста .[/color] Пожалуйста, ожидайте ответа в данной теме.<br><br>" +
	    '[CENTER]Создавать копии данной темы- не нужно.[/CENTER]',
	prefix: COMMAND_PREFIX,
	status: true,
},
{
    	  title: 'Выдано верно',
	  content:
		 	'[Color=yellow][SIZE=4][FONT=Times new roman][CENTER]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
		'[CENTER]Технический специалист предоставил доказательства, наказание выдано верно. <br><br>' +
 '[Color=Red][CENTER]Отказано, закрыто.[/CENTER][/color][/FONT]',
	prefix: UNACCEPT_PREFIX,
	status: false,
	},
    {
	  title: 'Выдано не верно ',
	  content:
		 	'[Color=yellow][SIZE=4][FONT=Times new roman][CENTER]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
		"[CENTER] Технический специалист допустил ошибку, наказание будет снято.[/CENTER]<br><br>" +
		'[Color=lime][CENTER]Одобрено, закрыто.[/CENTER][/color][/FONT]',
        prefix: OD_PREFIX,
	status: false,
	},
    {
	  title: 'обж отказ',
	  content:
		 	'[Color=yellow][SIZE=4][FONT=Times new roman][CENTER]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
		'[CENTER]В обжаловании [Color=Red]отказано.[/CENTER][/color][/FONT]',
	prefix: UNACCEPT_PREFIX,
	status: false,
    },
{
        title: 'обж одобрено',
	  content:
	    	'[Color=yellow][SIZE=4][FONT=Times new roman][CENTER]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
"[CENTER] Ваше наказание будет снято / снижено в ближайшее время.[/CENTER]<br><br>" +
"[CENTER]Пожалуйста, впредь не повторяйте ошибок, которые могут привести к таким последствиям, а также внимательно изучите общие правила серверов.[/CENTER]<br><br>" +
'[CENTER]В обжаловании [Color=Lime]одобрено.[/CENTER][/color][/FONT]',
 prefix: OD_PREFIX,
	status: false,
	},
    {
         title: 'обж не подлежит',
	  content:
	    	'[Color=yellow][SIZE=4][FONT=Times new roman][CENTER]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
		'[CENTER]Выданное вам наказание [Color=Red]обжалованию не подлежит.[/CENTER][/color][/FONT]',
prefix: UNACCEPT_PREFIX,
	status: false,
	},
    {
      title: 'Ответ дан выше',
	  content:
	    	'[Color=yellow][SIZE=4][FONT=Times new roman][CENTER]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
		'[CENTER]Подробный ответ от технического специалиста дан выше.[/CENTER][/FONT]',
prefix: CLOSE_PREFIX,
	status: false,
        },
    {
        title: 'Отсутствует окно блокировки',
	  content:
	    	'[Color=yellow][SIZE=4][FONT=Times new roman][CENTER]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
		'[CENTER]Отсутствует скриншот окна блокировки.<br><br>' +
 '[Color=Red][CENTER]Отказано, закрыто.[/CENTER][/color][/FONT]',
prefix: UNACCEPT_PREFIX,
	status: false,
	},
    {
        title: 'Будете разблокированы',
	content:
  	'[Color=yellow][SIZE=4][FONT=Times new roman][CENTER]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
	'[CENTER]Произошла ошибка, будете разблокированы, приношу извинения за предоставленные неудобства.[/CENTER][/FONT][/SIZE]<br?'+
	 '[Color=Lime][CENTER]Решено, закрыто.[/CENTER][/color][/FONT]',
	prefix: CLOSE_PREFIX,
	status: false,
},
{
title: 'ДУБЛИРОВАНИЕ',
content:
		 	'[Color=yellow][SIZE=4][FONT=Times new roman][CENTER]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
		"[CENTER]Данная тема является дубликатом вашей предыдущей жалобы. <br>Пожалуйста, прекратите создавать идентичные или похожие темы - иначе Ваш форумный аккаунт может быть заблокирован.<br><br>" +
		'[Color=Red][CENTER]Отказано, закрыто.[/CENTER][/color][/FONT]',
	prefix: UNACCEPT_PREFIX,
	status: false,

    },
];

$(document).ready(() => {
$('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');

addButton('Ф', 'ff');
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
$('button#unaccept').click(() => editThreadData(UNACCEPT_PREFIX, false));
$('button#pin').click(() => editThreadData(PIN_PREFIX, true));
$('button#teamProject').click(() => editThreadData(COMMAND_PREFIX, true));
$('button#odb').click(() => editThreadData(OD_PREFIX, false));
$('button#watched').click(() => editThreadData(WATCHED_PREFIX, false));
$('button#decided').click(() => editThreadData(DECIDED_PREFIX, false));
$('button#closed').click(() => editThreadData(CLOSE_PREFIX, false));
$('button#techspec').click(() => editThreadData(TECHADM_PREFIX, true));

$(`button#selectAnswer`).click(() => {
XF.alert(buttonsMarkup(buttons), null, 'ВЫБЕРИТЕ ОТВЕТ');
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

function addButton(name, id) {
$('.button--icon--reply').before(
`<button type="button" class="button rippleButton" id="${id}" style="oswald: 3px;">${name}</button>`,
);
}

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
