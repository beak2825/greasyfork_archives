// ==UserScript==
// @name Caprio tech ahuenni
// @namespace https://forum.blackrussia.online
// @version 1.4
// @description Для технических шоколadov capriojozz
// @author caprio
// @match https://forum.blackrussia.online/threads/*
// @include https://forum.blackrussia.online/threads/
// @grant Caprio
// @license  caprio
// @collaborator caprio
// @downloadURL https://update.greasyfork.org/scripts/477535/Caprio%20tech%20ahuenni.user.js
// @updateURL https://update.greasyfork.org/scripts/477535/Caprio%20tech%20ahuenni.meta.js
// ==/UserScript==
 
(function () {
	'use strict';
	const UNACCEPT_PREFIX = 4; // префикс отказано
	const PIN_PREFIX = 2; //  префикс закрепить
	const COMMAND_PREFIX = 10; // команде проекта
	const CLOSE_PREFIX = 7; // префикс закрыто
	const DECIDED_PREFIX = 6; // префикс решено
	const TECHADM_PREFIX = 13 // теху администратору
	const WATCHED_PREFIX = 9; // рассмотрено
	const WAIT_PREFIX = 14; // ожидание (для переноса в баг-трекер)
	const NO_PREFIX = 0;
	const buttons = [
	{
		title: 'Приветсвие',
		content:
		'[SIZE=4][FONT=Veranda][CENTER]Доброго времени суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		'[CENTER] текст [/CENTER][/FONT][/SIZE]',
	},
	{
	  title: 'ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠᅠ ᅠ  Для Логирования ᅠ ᅠ ᅠᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ',
	},
	{
		title: 'на рассмотрение поставлю ',
		content:
		'[SIZE=4][FONT=Veranda][CENTER]Доброго времени суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		'[CENTER]Ваша тема взята на рассмотрение, ожидайте ответ в ближайшее время<br>Часто рассмотрение темы может занять определенное время.<br>[CENTER][COLOR=rgb(255, 255, 0)]На рассмотрении[/COLOR][/CENTER][/FONT][/SIZE]',
		prefix: PIN_PREFIX,
		status: true,
	},
	{
		title: 'Ожидайте вердикта Куратора',
		content:
		'[SIZE=4][FONT=GEORGIA][CENTER]Доброго времени суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Ваша тема закреплена и ожидает вердикта <u>Куратора Технических специалистов</u>.<br>" +
		'[CENTER]<u>Создавать подобные темы не нужно</u>.<br>[CENTER][COLOR=rgb(255, 255, 0)]На рассмотрении[/COLOR][/CENTER][/FONT][/SIZE]'+
		"[CENTER][FONT=GEORGIA]С уважением [COLOR=rgb(255, 69, 0)]Технический Специалист [/COLOR][URL='https://vk.com/hrnwtrrrr']Jesus Caprio[/URL][/FONT][/CENTER]<br>" ,
		prefix: PIN_PREFIX,
		status: true,
	},
	{
		title: 'ДУБЛИРОВАНИЕ ',
		content:
		'[SIZE=4][FONT=Georgia][CENTER]Доброго времени суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Данная тема является <u>дубликатом вашей предыдущей темы</u>.<br>Пожалуйста, <u><b>прекратите создавать идентичные или похожие темы - иначе Ваш форумный аккаунт может быть заблокирован</b></u>.<br><br>" +
		'[CENTER][I][COLOR=rgb(255, 0, 0)]Закрыто[/COLOR][/I].[/CENTER][/FONT][/SIZE]'+
				"[CENTER][FONT=GEORGIA] С уважением [COLOR=rgb(210, 105, 30)]Технический Специалист [/COLOR][URL='https://vk.com/hrnwtrrrr']Jesus Caprio[/URL][/FONT][/CENTER]<br>" , 
		prefix: UNACCEPT_PREFIX,
		status: false,
	},

		
	{
		title: 'Форма подачи "ЖБ НА ТЕХ"',
		content:
		'[SIZE=4][FONT=GEORGIA][CENTER]Доброго времени суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Пожалуйста, заполните форму, создав новую тему: Название темы с NickName технического специалиста<br>Пример:<br> Lev_Kalashnikov | махинации<br>Форма заполнения темы:<br>[code]01. Ваш игровой никнейм:<br>02. Игровой никнейм технического специалиста:<br>03. Сервер, на котором Вы играете:<br>04. Описание ситуации (описать максимально подробно и раскрыто):<br>05. Любые скриншоты, которые могут помочь в решении проблемы (если таковые имеются):<br>06. Дата и время произошедшей технической проблемы (постарайтесь указать максимально точно):[/code]<br>" +
		'[CENTER][I][COLOR=rgb(139, 0, 0)]Отказано[/COLOR][/I].[/CENTER][/FONT][/SIZE]'+
		"[CENTER][FONT=GEORGIA]С уважением [COLOR=rgb(255, 69, 0)]Технический Специалист [/COLOR][URL='https://vk.com/hrnwtrrrr']Jesus Caprio[/URL][/FONT][/CENTER]<br>" ,
		prefix: UNACCEPT_PREFIX,
		status: false,
	},
	{
		title: 'учи правила подачи ',
		content:
		'[SIZE=4][FONT=GEORGIA][CENTER]Доброго времени суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Пожалуйста, убедительная просьба, ознакомиться с назначением данного раздела в котором Вы создали тему, так как Ваш запрос не относится к жалобам на технических специалистов.<br>Что принимается в данном разделе:<br>Жалобы на технических специалистов, оформленные по форме подачи и не нарушающие правила подачи:<br> [FONT=verdana][SIZE=7][COLOR=rgb(226, 80, 65)][U]Правила подачи жалобы на технических специалистов[/U][/COLOR][/SIZE][/FONT][/CENTER]<br><br>[QUOTE][FONT=verdana][SIZE=4][COLOR=rgb(226, 80, 65)]01.[/COLOR] Ваш игровой никнейм:[FONT=verdana][SIZE=4][COLOR=rgb(226, 80, 65)]<br>02.[/COLOR] Игровой никнейм технического специалиста:[COLOR=rgb(226, 80, 65)]<br>03.[/COLOR] Сервер, на котором Вы играете:[COLOR=rgb(226, 80, 65)]<br>04.[/COLOR] Описание ситуации (описать максимально подробно и раскрыто):[COLOR=rgb(226, 80, 65)]<br>05.[/COLOR] Любые скриншоты, которые могут помочь в решении проблемы (если таковые имеются):[COLOR=rgb(226, 80, 65)]<br>06.[/COLOR] Дата и время произошедшей технической проблемы (постарайтесь указать максимально точно):[/SIZE][/FONT][/SIZE][/QUOTE]<br><br>[FONT=verdana][SIZE=4][FONT=verdana][SIZE=4][COLOR=rgb(226, 80, 65)]Примечание:[/COLOR] все оставленные заявки обращения в данный раздел обязательно должны быть составлены по шаблону предоставленному немного выше.<br>В ином случае, заявки обращения в данный раздел составленные не по форме — будут отклоняться.<br>Касательно названия заголовка темы — четких правил нет, но, желательно чтобы оно содержало лишь никнейм и сервер технического специалиста.<br>Заранее, настоятельно рекомендуем ознакомиться [U][B][URL='https://forum.blackrussia.online/index.php?forums/faq.231/']с данным разделом[/URL][/B][/U].[/SIZE][/FONT][/SIZE][/FONT]<br>[CENTER][FONT=verdana][SIZE=7][COLOR=rgb(226, 80, 65)][U]Какие жалобы не проверяются?[/U][/COLOR][/SIZE][/FONT][/CENTER]<br><br>[FONT=verdana][SIZE=4][COLOR=rgb(226, 80, 65)]—[/COLOR] Если в содержании темы присутствует оффтоп/оскорбления.<br>[SIZE=4][COLOR=rgb(226, 80, 65)]—[/COLOR] Если в заголовке темы отсутствует никнейм технического специалиста.<br>[COLOR=rgb(226, 80, 65)]—[/COLOR] С момента выдачи наказания прошло более 7 дней.[/SIZE][/SIZE][/FONT]<br>" +
		'[CENTER][I][COLOR=rgb(139, 0, 0)]Отказано[/COLOR][/I].[/CENTER][/FONT][/SIZE]'+
		"[CENTER][FONT=GEORGIA]С уважением [COLOR=rgb(255, 69, 0)]Технический Специалист [/COLOR][URL='https://vk.com/hrnwtrrrr']Jesus Caprio[/URL][/FONT][/CENTER]<br>" ,
		prefix: UNACCEPT_PREFIX,
		status: false,
	},
	{
		title: 'Срок подачи закончился ',
		content:
		'[SIZE=4][FONT=GEORGIA][CENTER]Доброго времени суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		'[CENTER]С момента выдачи наказания от технического специалиста прошло более 7-ми дней.<br>Пересмотр/изменение меры наказания новозможно, вы можете попробывать написать обжалование через N-ый промежуток времени.<br><br>Обращаем ваше внимание на то, что некоторые наказания не подлежат не обжалованию,амнистии.[/center]<br><br>'+
		'[CENTER][I][COLOR=rgb(139, 0, 0)]Закрыто[/COLOR][/I].[/CENTER][/FONT][/SIZE]'+
		"[CENTER][FONT=GEORGIA]С уважением [COLOR=rgb(255, 69, 0)]Технический Специалист [/COLOR][URL='https://vk.com/hrnwtrrrr']Jesus Caprio[/URL][/FONT][/CENTER]<br>" ,
		prefix: UNACCEPT_PREFIX,
		status: false,
	},
	

	{
		title: 'в тех раздел иди ',
		content:
		'[SIZE=4][FONT=GEORGIA][CENTER]Доброго времени суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Ваша тема не как не относится к жалобам на технических специалистов, обратитесь с данной темой в <u>технический раздел вашего сервера</u> - [URL='https://forum.blackrussia.online/index.php?forums/Технический-раздел.22/']клик[/URL]<br><br>" +
		'[CENTER][I][COLOR=rgb(139, 0, 0)]Отказано[/COLOR][/I].[/CENTER][/FONT][/SIZE]'+
		"[CENTER][FONT=GEORGIA]С уважением [COLOR=rgb(255, 69, 0)]Технический Специалист [/COLOR][URL='https://vk.com/hrnwtrrrr']Jesus Caprio[/URL][/FONT][/CENTER]<br>" ,
		prefix: UNACCEPT_PREFIX,
		status: false,
	},


	{
		title: 'доступ к акку',
		content:
		'[SIZE=4][FONT=GEORGIA][CENTER]Доброго времени суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Если Вы обезопасили Ваш аккаунт и [U]привязали его к странице во ВКонтакте[/U], то сбросить пароль или пин-код Вы всегда сможете обратившись в официальное сообщество проекта - https://vk.com/blackrussia.online.<br> Либо в телеграмм бот - https://t.me/br_helper_bot.<br> Напишите «Начать» в личные сообщения группы/бота, затем выберите нужные Вам функции.<br><br>" +
		"[CENTER][FONT=Veranda]Подробнее в данной теме - [URL='https://forum.blackrussia.online/index.php?threads/lime-Защита-игрового-аккаунта.1201253/']клик[/URL][/center]<br><br>" +
		"[CENTER]Если Вы обезопасили Ваш аккаунт и [U]привязали его к почте[/U], то сбросить пароль или пин-код Вы всегда сможете при вводе пароля на сервере. После подключения к серверу нажмите на кнопку «Войти в аккаунт», затем выберите кнопку «Восстановить пароль», после чего на Вашу почту будет отправлено письмо с одноразовым кодом восстановления.<br><br>" +
		"[CENTER]Если Вы [U]не обезопасили свой аккаунт - его невозможно вернуть[/U]. Игрок самостоятельно несет отвественность за безопаность своего аккаунта.<br><br>" +
		'[CENTER]К сожалению, иногда решение подобных вопросов требует много времени. Надеемся, что Вы сможете восстановить доступ к аккаунту!<br>' +
		'[I][COLOR=rgb(127, 255, 0)]Рассмотрено[/COLOR][/I].[/CENTER][/FONT][/SIZE]'+
	"[CENTER][FONT=GEORGIA]С уважением [COLOR=rgb(255, 69, 0)]Технический Специалист [/COLOR][URL='https://vk.com/hrnwtrrrr']Jesus Caprio[/URL][/FONT][/CENTER]<br>" ,
		prefix: WATCHED_PREFIX,
		status: false,
	},
	{
		title: 'окно бана дай',
		content:
		'[SIZE=4][FONT=GEORGIA][CENTER]Доброго времени суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Без окна о блокировке тема не подлежит рассмотрению - создайте новую тему, приложив окно блокировки с фото-хостинга<br>[URL='https://yapx.ru/']yapx.ru[/URL],<br>[URL='https://imgur.com/']imgur.com[/URL],<br>[URL='https://www.youtube.com/']youtube.com[/URL],<br>[URL='https://imgbb.com']ImgBB.com[/URL]<br>(все кликабетильно).<br>" +
		'[CENTER][CENTER][COLOR=rgb(255, 0, 0)]Закрыто[/COLOR].[/CENTER][/FONT][/SIZE]'+
		"[CENTER][FONT=GEORGIA]С уважением [COLOR=rgb(255, 69, 0)]Технический Специалист [/COLOR][URL='https://vk.com/hrnwtrrrr']Jesus Caprio[/URL][/FONT][/CENTER]<br>" ,
		prefix: CLOSE_PREFIX,
		status: false,
	},
	{
		title: 'Правила восстановления',
		content:
		'[SIZE=4][FONT=GEORGIA][CENTER]Доброго времени суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Пожалуйста, убедительная просьба, ознакомьтесь с правилами восстановлений - [URL='https://forum.blackrussia.online/index.php?threads/В-каких-случаях-мы-не-восстанавливаем-игровое-имущество.25277/']клик[/URL].<br> Вы создали тему, которая не относится к технической проблеме.[/CENTER]<br><br>" +
		'[CENTER][I][COLOR=rgb(139, 0, 0)]Отказано[/COLOR][/I].[/CENTER][/FONT][/SIZE]'+
		"[CENTER][FONT=GEORGIA]С уважением [COLOR=rgb(255, 69, 0)]Технический Специалист [/COLOR][URL='https://vk.com/hrnwtrrrr']Jesus Caprio[/URL][/FONT][/CENTER]<br>" ,
		prefix: UNACCEPT_PREFIX,
		status: false,
	},
	{
		title: 'донат не пришёл? есть решение',
		content:
		'[SIZE=4][FONT=GEORGIA][CENTER]Доброго времени суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		'[CENTER]Система построена таким образом, что <b>деньги не спишутся, пока наша платформа не уведомит платежную систему о зачислении BLACK COINS</b>. Для проверки зачисления BLACK COINS необходимо ввести в игре команду: <u>/donat</u>.<br>' +
		'[CENTER]В остальных же случаях, <b>если не были зачислены BLACK COINS — вероятнее всего, была допущена ошибка при вводе реквизитов</b>. К нашему сожалению, из-за большого количества попыток обмана, мы перестали рассматривать подобные жалобы.<br><i>Вам необходимо быть внимательными при осуществлении покупок</i>.<br>' +
		'[CENTER]Если Вы считаете, что ошибки быть не может и с момента оплаты не прошло более 14 дней, то в обязательном порядке обратитесь в данное сообщество для дальнейшего решения: https://vk.com/br_tech.<br>' +
		'[CENTER][I][COLOR=rgb(139, 0, 0)]Закрыто[/COLOR][/I].[/CENTER][/FONT][/SIZE]'+
		"[CENTER][FONT=GEORGIA]С уважением [COLOR=rgb(255, 69, 0)]Технический Специалист [/COLOR][URL='https://vk.com/hrnwtrrrr']Jesus Caprio[/URL][/FONT][/CENTER]<br>" ,
		prefix: CLOSE_PREFIX,
		status: false,
	},
	{
        title: 'Донат',
        content:
        '[SIZE=4][FONT=Veranda][CENTER]Доброго времени суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
        '[CENTER]Система построена таким образом, что деньги не спишутся, пока наша платформа не уведомит платежную систему о зачислении BLACK COINS. Для проверки зачисления BLACK COINS необходимо ввести в игре команду: /donat.<br>' +
        '[CENTER]В остальных же случаях, если не были зачислены BLACK COINS — вероятнее всего, была допущена ошибка при вводе реквизитов. К нашему сожалению, из-за большого количества попыток обмана, мы перестали рассматривать подобные жалобы. Вам необходимо быть внимательными при осуществлении покупок.<br>' +
        '[CENTER]Если Вы считаете, что ошибки быть не может и с момента оплаты не прошло более 14 дней, то в обязательном порядке обратитесь в данное сообщество для дальнейшего решения: https://vk.com/br_tech.<br>' +
        '[CENTER][I]Решено[/I].[/CENTER][/FONT][/SIZE]',
      prefix: DECIDED_PREFIX,
      status: false,
	},
	{
		title: 'Выдача компенсации',
		content:
		'[SIZE=4][FONT=GEORGIA][CENTER]Доброго времени суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Ваше игровое имущество/денежные средства будут восстановлены в течение двух недель. <br>Убедительная просьба, <b><u>не менять никнейм до момента восстановления</u></b>.<br>" +
		'[CENTER]Для активации восстановления используйте команды:[COLOR=rgb(255, 213, 51)]/roulette[/COLOR], [COLOR=rgb(255, 213, 51)]/recovery[/COLOR].[/CENTER]<br>' +
		'[CENTER][COLOR=rgb(127, 255, 0)]Решено[/COLOR].[/CENTER][/FONT][/SIZE]'+
		"[CENTER][FONT=GEORGIA]С уважением [COLOR=rgb(255, 69, 0)]Технический Специалист [/COLOR][URL='https://vk.com/hrnwtrrrr']Jesus Caprio[/URL][/FONT][/CENTER]<br>" ,
		status: false,
		prefix: DECIDED_PREFIX,
	},
	{
		title: 'игру переустанови  ',
		content:
		'[SIZE=4][FONT=GEORGIA][CENTER]Доброго времени суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Возможно в файлах вашей игры присутствуют постороннее оборудование(дополнения/изменения).<br>" +
		"[CENTER]Рекомендуется удалить полностью лаунчер и связанные с ним файлы и установить игру заново с официального сайта - [URL='https://blackrussia.online']перейти[/URL].<br>" +
		'[CENTER][I][COLOR=rgb(127, 255, 0)]Рассмотрено[/COLOR][/I].[/CENTER][/FONT][/SIZE]'+
		"[CENTER][FONT=GEORGIA]С уважением [COLOR=rgb(255, 69, 0)]Технический Специалист [/COLOR][URL='https://vk.com/hrnwtrrrr']Jesus Caprio[/URL][/FONT][/CENTER]<br>" ,
		prefix: DECIDED_PREFIX,
		status: false,
	},
	{
		title: 'К ЖБ ТЕХОВ ЭТО НЕ ОТНОСИТСЯ',
		content:
		'[SIZE=4][FONT=GEORGIA][CENTER]Доброго времени суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Ваше обращение не относится к жалобам на технических специалистов.<br> Пожалуйста ознакомьтесь с праивилами данного раздела: [URL='https://forum.blackrussia.online/forums/Информация-для-игроков.231/']клик[/URL] <br>" +
		'[CENTER][I][COLOR=rgb(139, 0, 0)]Отказано[/COLOR][/I].[/CENTER][/FONT][/SIZE]'+
		"[CENTER][FONT=GEORGIA]С уважением [COLOR=rgb(255, 69, 0)]Технический Специалист [/COLOR][URL='https://vk.com/hrnwtrrrr']Jesus Caprio[/URL][/FONT][/CENTER]<br>" ,
		prefix: UNACCEPT_PREFIX,
		status: false,
	},


	{
		title: 'ᅠ ᅠᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠᅠ ᅠ ᅠ  Для Форумников  ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠᅠ ᅠ ᅠ',
	},
	{
		title: 'ФОРМА',
		content:
		'[SIZE=4][FONT=GEORGIA][CENTER]Доброго времени суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Пожалуйста, заполните форму, создав новую тему: <br>[CODE]01. Ваш игровой никнейм:<br>02. Сервер, на котором Вы играете:<br>03. Суть Вашей возникшей проблемы (описать максимально подробно и раскрыто): <br>04. Любые скриншоты, которые могут помочь в решении проблемы (если таковые имеются):<br>05. Дата и время произошедшей технической проблемы (постарайтесь указать максимально точно):[/CODE]<br><br>" +
		'[CENTER][I][COLOR=rgb(139, 0, 0)]Отказано[/COLOR][/CENTER][/I].[/FONT][/SIZE]'+
		"[CENTER][FONT=GEORGIA]С уважением [COLOR=rgb(255, 69, 0)]Технический Специалист [/COLOR][URL='https://vk.com/hrnwtrrrr']Jesus Caprio[/URL][/FONT][/CENTER]<br>" ,
		prefix: UNACCEPT_PREFIX,
		status: false,
	},
	{
		title: 'ПРАВИЛА РАЗДЕЛА',
		content:
		'[SIZE=4][FONT=GEORGIA][CENTER]Доброго времени суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Пожалуйста, убедительная просьба, ознакомиться с назначением данного раздела в котором Вы создали тему, так как Ваш запрос не относится к технической проблеме.<br>Что принимается в тех разделе:<br>Если возникли технические проблемы, которые так или иначе связаны с игровым модом<br>Форма заполнения:<br>[QUOTE]<br>[FONT=verdana][SIZE=4][COLOR=rgb(226, 80, 65)]01.[/COLOR] Ваш игровой никнейм:<br>[COLOR=rgb(226, 80, 65)]02.[/COLOR] Сервер, на котором Вы играете:<br>[COLOR=rgb(226, 80, 65)]03.[/COLOR] Суть возникшей проблемы (описать максимально подробно и раскрыто):<br>[COLOR=rgb(226, 80, 65)]04.[/COLOR] Любые скриншоты, которые могут помочь в решении проблемы (если таковые имеются):<br>[COLOR=rgb(226, 80, 65)]05.[/COLOR] Дата и время произошедшей технической проблемы (постарайтесь указать максимально точно):[/SIZE][/FONT][/QUOTE]<br>[/CENTER]<br><br>[CENTER][FONT=verdana][SIZE=7][COLOR=rgb(226, 80, 65)][U]Если возникли технические проблемы, которые так или иначе связаны с вылетами из игры и любыми другими проблемами клиента[/U][/COLOR][/SIZE][/FONT][/CENTER]<br><br>[QUOTE]<br>[FONT=verdana][SIZE=4][COLOR=rgb(226, 80, 65)]01. [/COLOR]Ваш игровой ник:<br>[COLOR=rgb(226, 80, 65)]02. [/COLOR]Сервер:<br>[COLOR=rgb(226, 80, 65)]03.[/COLOR] Тип проблемы: Обрыв соединения | Проблема с ReCAPTCHA | Краш игры (закрытие игры) | Другое [Выбрать один вариант ответа]<br>[COLOR=rgb(226, 80, 65)]04. [/COLOR]Действия, которые привели к этому (при вылетах, по возможности предоставлять место сбоя):<br>[COLOR=rgb(226, 80, 65)]05.[/COLOR] Как часто данная проблема:<br>[COLOR=rgb(226, 80, 65)]06.[/COLOR] Полное название мобильного телефона:<br>[COLOR=rgb(226, 80, 65)]07.[/COLOR] Версия Android:<br>[COLOR=rgb(226, 80, 65)]08. [/COLOR]Дата и время (по МСК):<br>[COLOR=rgb(226, 80, 65)]09. [/COLOR]Связь с Вами по Telegram/VK:[/SIZE][/FONT][/QUOTE]" +
		'[CENTER][I][COLOR=rgb(139, 0, 0)]Отказано[/COLOR][/I].[/CENTER][/FONT][/SIZE]'+
		"[CENTER][FONT=GEORGIA]С уважением [COLOR=rgb(255, 69, 0)]Технический Специалист [/COLOR][URL='https://vk.com/hrnwtrrrr']Jesus Caprio[/URL][/FONT][/CENTER]<br>" ,
		prefix: UNACCEPT_PREFIX,
		status: false,
	},
	{
		title: 'Передано логисту для проверки',
		content:
		'[SIZE=4][FONT=GEORGIA][CENTER]Доброго времени суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Ваша тема закреплена и передана <u>Техническому специалисту по логированию</u> для дальнейшего вердикта,ожидайте ответ в данной теме.<br><br>" +
		'[CENTER]Создавать новые темы с данной проблемой — не нужно.[/CENTER][/FONT][/SIZE]'+
		"[CENTER][FONT=GEORGIA]С уважением [COLOR=rgb(255, 69, 0)]Технический Специалист [/COLOR][URL='https://vk.com/hrnwtrrrr']Jesus Caprio[/URL][/FONT][/CENTER]<br>" ,
		prefix: TECHADM_PREFIX,
		status: true,
	},
	{
		title: 'Доп.Информация',
		content:
		'[SIZE=4][FONT=GEORGIA][CENTER]Доброго времени суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		'[CENTER] Для дальнейшего рассмотрения темы, предоставьте:<br><BR>[QUOTE][SIZE=5][FONT=Veranda]1. Скриншоты или видео, подтверждающие факт владения этим имуществом.<BR>2. Все детали пропажи: дата, время, после каких действий имущество пропало.<BR>3. Информация о том, как вы изначально получили это имущество:<BR>дата покупки<br>способ приобретения (у игрока, в магазине или через донат;<br>фрапс покупки (если есть);<br>никнейм игрока, у которого было приобретено имущество, если покупка была сделана не в магазине.[/QUOTE]<BR>[/CENTER]'+
		'[CENTER][COLOR=rgb(255, 255, 0)]На рассмотрении[/COLOR][/CENTER][/FONT][/SIZE]'+
		"[CENTER][FONT=GEORGIA]С уважением [COLOR=rgb(255, 69, 0)]Технический Специалист [/COLOR][URL='https://vk.com/hrnwtrrrr']Jesus Caprio[/URL][/FONT][/CENTER]<br>" ,
		prefix: PIN_PREFIX,
		status: true,
	},
	{
	title: "Проблемы с Кешом",
	content:
	'[SIZE=4][FONT=GEORGIA][CENTER]Доброго времени суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
	'[center]Если вы столкнулись с проблемой загрузки страниц форума, пожалуйста, выполните следующие действия:<br><br>• Откройте "Настройки".<br>• Найдите во вкладке "Приложения" свой браузер, через который вы пользуетесь нашим сайтом форума.<br>• Нажмите на браузер, после чего внизу выберите "Очистить" -> "Очистить Кэш".<br><br>После следуйте данным инструкциям:<br>• Перейдите в настройки браузера.<br>• Выберите "Конфиденциальность и безопасность" -> "Очистить историю".<br>• В основных и дополнительных настройках поставьте галочку в пункте "Файлы cookie и данные сайтов".<br>После этого нажмите "Удалить данные".<br><br>Ниже прилагаем видео-инструкции описанного процесса для разных браузеров:<br>Для браузера CHROME: https://youtu.be/FaGp2rRru9s<br>Для браузера OPERA: https://youtube.com/shorts/eJOxkc3Br6A?feature=share'+ 
	'[CENTER][I][COLOR=rgb(255, 0, 0)]Закрыто[/COLOR][/I].[/CENTER][/FONT][/SIZE]'+
	"[CENTER][FONT=GEORGIA]С уважением [COLOR=rgb(255, 69, 0)]Технический Специалист [/COLOR][URL='https://vk.com/hrnwtrrrr']Jesus Caprio[/URL][/FONT][/CENTER]<br>" ,
	prefix: CLOSE_PREFIX,
	status: false,		
	},	
	{
		title: 'Законопослушность',
		content:
		'[SIZE=4][FONT=GEORGIA][CENTER]Доброго времени суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		'[CENTER]К сожалению, администрация, технические специалисты и другие должностные лица BLACK RUSSIA не могут повлиять на законопослушность вашего аккаунта.<br>Повысить законопослушность можно двумя способами:<BR><BR>1. Каждый PayDay (00 минут каждого часа) вам начисляется одно очко законопослушности(Если только у вас нету PLATINUM VIP-статуса), если за прошедший час вы отыграли не менее 20 минут.<br>2. Приобрести законопослушность в /donate.<BR>[/CENTER]'+
		'[CENTER][I][COLOR=rgb(139, 0, 0)]Отказано[/COLOR][/I].[/CENTER][/FONT][/SIZE]'+
		"[CENTER][FONT=GEORGIA]С уважением [COLOR=rgb(255, 69, 0)]Технический Специалист [/COLOR][URL='https://vk.com/hrnwtrrrr']Jesus Caprio[/URL][/FONT][/CENTER]<br>" ,
		prefix: UNACCEPT_PREFIX,
		status: false,
	},
	{
	title: "Баг со штрафами",
	content:
	'[SIZE=4][FONT=GEORGIA][CENTER]Доброго времени суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
	'[center]У вас произошла ошибка со штрафами, для её исправления вам нужно совершить проезд на красный свет, переехать через сплошную и оплатить все штрафы в банке.<br>Тогда данный баг пропадет, Команде Проекто известно о данной недоработке и активно ведется иправление.<br><br>' +
	'[CENTER][I][COLOR=rgb(255, 0, 0)]Закрыто[/COLOR][/I].[/CENTER][/FONT][/SIZE]'+
	"[CENTER][FONT=GEORGIA]С уважением [COLOR=rgb(255, 69, 0)]Технический Специалист [/COLOR][URL='https://vk.com/hrnwtrrrr']Jesus Caprio[/URL][/FONT][/CENTER]<br>" ,
	prefix: CLOSE_PREFIX,
	status: false,
},
	{
		title: 'Антивирус при установке',
		content:
		'[SIZE=4][FONT=GEORGIA][CENTER]Доброго времени суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		'[CENTER]При установке старого игрового клиента антивирусные программы вашего устройства могут ругаться, ничего в этом нету страшного.<br>Нажмите на "Дополнительно" и "Все равно установить" и наслаждайтесь игрой, либо установите Новый Клиент.<BR><BR>[/CENTER][/FONT][/SIZE]'+
		'[CENTER][I][COLOR=rgb(255, 0, 0)]Закрыто[/COLOR][/I].[/CENTER][/FONT][/SIZE]'+
		"[CENTER][FONT=GEORGIA]С уважением [COLOR=rgb(255, 69, 0)]Технический Специалист [/COLOR][URL='https://vk.com/hrnwtrrrr']Jesus Caprio[/URL][/FONT][/CENTER]<br>" ,
	  prefix: CLOSE_PREFIX,
	  status: false,	
	},
	{
		title: 'ЖБ на ТЕХОВ',
		content:
		'[SIZE=4][FONT=GEORGIA][CENTER]Доброго времени суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		'[CENTER]Вы получили наказание от технического специалиста Вашего сервера.<br>Вам следует обратиться в раздел «Жалобы на технических специалистов» — в случае, если Вы не согласны с наказанием.<br><br>' +
		"[CENTER]Ссылка на раздел, где можно оформить жалобу на технического специалиста - [URL='https://forum.blackrussia.online/index.php?forums/Жалобы-на-технических-специалистов.490/']клик[/URL] <br><br>" +
		'[CENTER][I][COLOR=rgb(139, 0, 0)]Отказано[/COLOR][/I].[/CENTER][/FONT][/SIZE]'+
		"[CENTER][FONT=GEORGIA]С уважением [COLOR=rgb(255, 69, 0)]Технический Специалист [/COLOR][URL='https://vk.com/hrnwtrrrr']Jesus Caprio[/URL][/FONT][/CENTER]<br>" ,
		prefix: UNACCEPT_PREFIX,
		status: false,
	},
	{
		title: 'Команде проекта',
		content:
		'[SIZE=4][FONT=GEORGIA][CENTER]Доброго времени суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Ваша тема закреплена и находится на рассмотрении у команды проекта. Пожалуйста, ожидайте выноса вердикта разработчиков."+
		"[CENTER]Создавать новые темы с данной проблемой — не нужно, ожидайте ответа в данной теме. Если проблема решится - Вы всегда можете оставить своё сообщение в этой теме.<br>"+
		"[CENTER][FONT=GEORGIA]С уважением [COLOR=rgb(255, 69, 0)]Технический Специалист [/COLOR][URL='https://vk.com/hrnwtrrrr']Jesus Caprio[/URL][/FONT][/CENTER]<br>" ,
		prefix: COMMAND_PREFIX,
		status: true,
	},
	{
		title: 'Известно КП',
		content:
		'[SIZE=4][FONT=GEORGIA][CENTER]Доброго времени суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Команде проекта уже известно о данной проблеме, она обязательно будет рассмотрена и исправлена. Спасибо за Ваше обращение!<br><br>" +
		'[CENTER][I][COLOR=rgb(139, 0, 0)]Закрыто[/COLOR][/I].[/CENTER][/FONT][/SIZE]'+
		"[CENTER][FONT=GEORGIA]С уважением [COLOR=rgb(255, 69, 0)]Технический Специалист [/COLOR][URL='https://vk.com/hrnwtrrrr']Jesus Caprio[/URL][/FONT][/CENTER]<br>" ,
		prefix: CLOSE_PREFIX,
		status: false,
	},
	{
		title: 'Для ошибок во время ОБТ',
		content:
		'[SIZE=4][FONT=GEORGIA][CENTER]Доброго времени суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' + 
		"[CENTER]Если вы нашли какую-либо ошибку во время Открытого Бэта Тестирования то сделайте следующие действия.<br><br>1. Отправьте пожалуйста найденную недоработку в данную форму - [URL='https://docs.google.com/forms/d/e/1FAIpQLSexVwEcvQ9gI6KDjvb65M5A6Yoc5QLyVGWcHjBb21_4BKaX4w/viewform']клик[/URL]<br>2. Передайте данную форму своим друзьям, для ускорения процесса по сбору багов для их исправления.<br><br>Спасибо за ваш вклад в развитие игры!<br>[CENTER][I][COLOR=rgb(139, 0, 0)]Закрыто[/COLOR][/I].[/CENTER][/FONT][/SIZE]"+
		"[CENTER][FONT=GEORGIA]С уважением [COLOR=rgb(255, 69, 0)]Технический Специалист [/COLOR][URL='https://vk.com/hrnwtrrrr']Jesus Caprio[/URL][/FONT][/CENTER]<br>" ,
		prefix: CLOSE_PREFIX,
		status: false,
	},
	{
		title: 'Для ошибок во время ОБТ на IOS',
		content:
		'[SIZE=4][FONT=GEORGIA][CENTER]Доброго времени суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' + 
		"[CENTER]Если вы нашли какую-либо ошибку во время Открытого Бэта Тестирования на IOS то сделайте следующие действия.<br><br>1. Отправьте пожалуйста найденную недоработку в данную форму - [URL='https://forms.gle/4adcNvKisfKF59Fi8']клик[/URL]<br>2. Передайте данную форму своим друзьям, для ускорения процесса по сбору багов для их исправления.<br><br>Спасибо за ваш вклад в развитие игры!<br>[CENTER][I][COLOR=rgb(139, 0, 0)]Закрыто[/COLOR][/I].[/CENTER][/FONT][/SIZE]",
		prefix: CLOSE_PREFIX,
		status: false,
	},
	{
		title: 'Почему у меня пропали все темы из раздела Жалобы?',
		content:
		'[SIZE=4][FONT=Veranda][CENTER]Доброго времени суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Раздел 'Жалобы' переведен в приватный режим, а именно:<br>Тему созданную пользователем пожет видеть <b>он сам</b> и <b>Администрация сервера</b>.<br>Ознакомиться с формой подачи тем в тот или иной раздел можно по данной ссылке: [URL='https://forum.blackrussia.online/index.php?forums/Правила-подачи-жалоб.202/']клик[/URL]<br>Приятного времяпрепровождения на нашем форуме<br>[CENTER][I][COLOR=rgb(139, 0, 0)]Закрыто[/COLOR][/I].[/CENTER][/FONT][/SIZE]"+
		"[CENTER][FONT=GEORGIA]С уважением [COLOR=rgb(255, 69, 0)]Технический Специалист [/COLOR][URL='https://vk.com/hrnwtrrrr']Jesus Caprio[/URL][/FONT][/CENTER]<br>" ,
		prefix: CLOSE_PREFIX,
		status: false,
	},
	{
		title: 'Не весь рейтинг за груз',
		content:
		'[SIZE=4][FONT=GEORGIA][CENTER]Доброго времени суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' + 
		'[CENTER]Наша система постоена следующим образом<br>Рейтинг зависит от поломки автомобиля чем серьёзнее поломка, тем меньше будет засчитан рейтинг.<br>Поломка учитывается вся за время рейса с грузом, в независимости от того если Вы почините Ваш автомобиль, поломка до, будет учтена.<br>[CENTER][I][COLOR=rgb(255, 0, 0)]Закрыто[/COLOR][/I].[/CENTER][/FONT][/SIZE]'+
		"[CENTER][FONT=GEORGIA]С уважением [COLOR=rgb(255, 69, 0)]Технический Специалист [/COLOR][URL='https://vk.com/hrnwtrrrr']Jesus Caprio[/URL][/FONT][/CENTER]<br>" ,
	},
 	{
		title: 'Не является багом',
		content:
		'[SIZE=4][FONT=GEORGIA][CENTER]Доброго времени суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		'[CENTER]Проблема с которой вы столкнулись не является багом, ошибкой сервера.<br><br>[CENTER][I][COLOR=rgb(255, 0, 0)]Закрыто[/COLOR][/I].[/CENTER][/FONT][/SIZE]'+
		"[CENTER][FONT=GEORGIA]С уважением [COLOR=rgb(255, 69, 0)]Технический Специалист [/COLOR][URL='https://vk.com/hrnwtrrrr']Jesus Caprio[/URL][/FONT][/CENTER]<br>" ,
		prefix: UNACCEPT_PREFIX,
		status: false,
	},
	{
		title: 'ТЕСТЕРАМ',
		content:
		'[SIZE=4][FONT=GEORGIA][CENTER]Доброго времени суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Ваша тема передана на тестирование.[/CENTER][/FONT][/SIZE]"+
		"[CENTER][FONT=GEORGIA]С уважением [COLOR=rgb(255, 69, 0)]Технический Специалист [/COLOR][URL='https://vk.com/hrnwtrrrr']Jesus Caprio[/URL][/FONT][/CENTER]<br>" ,
		  prefix: WAIT_PREFIX,
		  status: false,
	},
	{
		title: 'Ответ от ТЕСТЕРОВ',
		content:
		'[SIZE=4][FONT=GEORGIA][CENTER]Доброго времени суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		'[CENTER]Ответ от тестерского отдела дан выше.<br><br>' +
		'[CENTER][I][COLOR=rgb(255, 0, 0)]Закрыто[/COLOR][/I].[/CENTER][/FONT][/SIZE]'+
		"[CENTER][FONT=GEORGIA]С уважением [COLOR=rgb(255, 69, 0)]Технический Специалист [/COLOR][URL='https://vk.com/hrnwtrrrr']Jesus Caprio[/URL][/FONT][/CENTER]<br>" ,
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
	{
		title: 'Пропали вещи с аукциона',
		content:
		'[SIZE=4][FONT=GEORGIA][CENTER]Доброго времени суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		'[CENTER]Если вы выставили свои вещи на аукцион а их никто не купил, то воспользуйтесь командой [COLOR=rgb(251, 160, 38)]/reward[/COLOR]<br> В случае отсутствии вещей там, приложите скриншоты с + /time в новой теме<br>[CENTER][I][COLOR=rgb(139, 0, 0)]Закрыто[/COLOR][/I].[/CENTER][/FONT][/SIZE]'+
		"[CENTER][FONT=GEORGIA]С уважением [COLOR=rgb(255, 69, 0)]Технический Специалист [/COLOR][URL='https://vk.com/hrnwtrrrr']Jesus Caprio[/URL][/FONT][/CENTER]<br>" ,
		prefix: CLOSE_PREFIX,
		status: false,
	},
	{
		title: 'Если не работают ссылки',
		content:
		'[SIZE=4][FONT=GEORGIA][CENTER]Доброго времени суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]По техническим причинам данное действие невозможно, пожалуйста воспользуйтесь копированием ссылки от сюда:<br>[img]https://i.ibb.co/SX77Fgw/photo-2022-08-20-16-31-57.jpg[/img]<br>Если данный способ не помогает, то используйте сервис сокращения ссылок https://clck.ru<br> Либо попробуйте вот так:<br>1) загрузка скриншота биографии на фотохостинг<br>2) в описание прикрепить ссылку с форума<br>3) скопировать пост с фотохостинга<br><br>2 способ:<br>Сократите ссылки для Ваших скриншотов и RP биографии, сделать можно тут goo.su  также Iformation замените на русский текст, просмотрите еще текст полностью и постарайтесь уменьшить такие знаки как !?<br>goo.su[/CENTER]<br>"+
		'[CENTER][I][COLOR=rgb(255, 0, 0)]Закрыто[/COLOR][/I].[/CENTER][/FONT][/SIZE]'+
		"[CENTER][FONT=GEORGIA]С уважением [COLOR=rgb(255, 69, 0)]Технический Специалист [/COLOR][URL='https://vk.com/hrnwtrrrr']Jesus Caprio[/URL][/FONT][/CENTER]<br>" ,
		prefix: CLOSE_PREFIX,
		status: false,
	},
	{
		title: 'В раздел Госс Организаций.',
		content:
		'[SIZE=4][FONT=GEORGIA][CENTER]Доброго времени суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		'[CENTER]Ваша тема не относится к техническому разделу, пожалуйста оставьте ваше заявление в соответствующем разделе Государственных Организаций вашего сервера.[/CENTER]<br><br>'+
		'[CENTER][I][COLOR=rgb(139, 0, 0)]Отказано[/COLOR][/I].[/CENTER][/FONT][/SIZE]'+
		"[CENTER][FONT=GEORGIA]С уважением [COLOR=rgb(255, 69, 0)]Технический Специалист [/COLOR][URL='https://vk.com/hrnwtrrrr']Jesus Caprio[/URL][/FONT][/CENTER]<br>" ,
		prefix: UNACCEPT_PREFIX,
		status: false,
	},
	{
		title: 'В раздел Криминальных Организаций',
		content:
		'[SIZE=4][FONT=GEORGIA][CENTER]Доброго времени суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		'[CENTER]Ваша тема не относится к техническому разделу, пожалуйста оставьте ваше заявление в соответствующем разделе Криминальных Организаций вашего сервера [/CENTER]'+
		'[CENTER][I][COLOR=rgb(139, 0, 0)]Отказано[/COLOR][/I].[/CENTER][/FONT][/SIZE]'+
		"[CENTER][FONT=GEORGIA]С уважением [COLOR=rgb(255, 69, 0)]Технический Специалист [/COLOR][URL='https://vk.com/hrnwtrrrr']Jesus Caprio[/URL][/FONT][/CENTER]<br>" ,
		prefix: UNACCEPT_PREFIX,
		status: false,
	},
	{
		title: 'Жб на адм',
		content:
		'[SIZE=4][FONT=GEORGIA][CENTER]Доброго времени суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Вы получили наказание которое не относится к технической части, оно относится к Административной части.<br> Обратитесь в раздел Жалобы на администрацию вашего сервера.<br>Форма для подачи жалобы - [URL='https://forum.blackrussia.online/index.php?threads/Правила-подачи-жалоб-на-администрацию.3429349/']тут[/URL]<br>" +
		'[CENTER][I][COLOR=rgb(139, 0, 0)]Закрыто[/COLOR][/I].[/CENTER][/FONT][/SIZE]'+
		"[CENTER][FONT=GEORGIA]С уважением [COLOR=rgb(255, 69, 0)]Технический Специалист [/COLOR][URL='https://vk.com/hrnwtrrrr']Jesus Caprio[/URL][/FONT][/CENTER]<br>" ,
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
	{
		title: 'Жб на игроков',
		content:
		'[SIZE=4][FONT=GEORGIA][CENTER]Доброго времени суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Данная тема не относится к техническому разделу.<br>Данное действие было совершено игроком и нарушает правила сервера, пожалуйста обратитесь в <br>'Жалобы на игроков'<br>Вашего сервера.<br>Форма подачи жалобы - [URL='https://forum.blackrussia.online/index.php?threads/Правила-подачи-жалоб-на-игроков.3429394/']тык[/URL]" +
		'[CENTER][I][COLOR=rgb(139, 0, 0)]Закрыто[/COLOR][/I].[/CENTER][/FONT][/SIZE]'+
		"[CENTER][FONT=GEORGIA]С уважением [COLOR=rgb(255, 69, 0)]Технический Специалист [/COLOR][URL='https://vk.com/hrnwtrrrr']Jesus Caprio[/URL][/FONT][/CENTER]<br>" ,
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
	{
		title: 'Обжалования',
		content:
		'[SIZE=4][FONT=GEORGIA][CENTER]Доброго времени суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Вы получили наказание от администратора своего сервера.<br> Для его снижения/обжалования обратитесь в раздел<br><<Обжалования>> вашего сервера.<br>Форма подачи темы - [URL='https://forum.blackrussia.online/index.php?threads/Правила-подачи-заявки-на-обжалование-наказания.3429398/']клик[/URL]" +
		'[CENTER][I][COLOR=rgb(139, 0, 0)]Закрыто[/COLOR][/I].[/CENTER][/FONT][/SIZE]'+
		"[CENTER][FONT=GEORGIA]С уважением [COLOR=rgb(255, 69, 0)]Технический Специалист [/COLOR][URL='https://vk.com/hrnwtrrrr']Jesus Caprio[/URL][/FONT][/CENTER]<br>" ,
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
	{
		title: 'Сервер не отвечает',
		content:
		'[SIZE=4][FONT=GEORGIA][CENTER]Доброго времени суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Если у Вас встречаются такие проблемы, как «Сервер не отвечает», не отображаются сервера в лаунчере, не удаётся выполнить вход на сайт/форум, попробуйте совершить следующие действия: <br><br>" +
		"[LEFT]• Сменить IP-адрес любыми средствами; <br>" +
		"[LEFT]• Переключиться на Wi-Fi/мобильный интернет или на любую доступную сеть; <br>"+
		"[LEFT]• Использование VPN; <br>"+
		"[LEFT]• Перезагрузка роутера.<br><br>" +
	
		"[CENTER]Если методы выше не помогли, то переходим к следующим шагам: <br><br>" +
	
		'[LEFT]1. Устанавливаем приложение «1.1.1.1: Faster & Safer Internet» Ссылка: https://clck.ru/ZP6Av и переходим в него.<br>'+
		'[LEFT]2. Соглашаемся со всей политикой приложения.<br>'+
		'[LEFT]3. Нажимаем на ползунок и ждем, когда текст изменится на «Подключено».<br>'+
		'[LEFT]4. Проверяем: Отображаются ли серверы? Удается ли выполнить вход в игру? Работают ли другие источники (сайт, форум)? <br>' +
	
		"[CENTER]📹 Включение продемонстрировано на видео: https://youtu.be/Wft0j69b9dk<br>[CENTER][I][COLOR=rgb(139, 0, 0)]Закрыто[/COLOR][/I].[/CENTER][/FONT][/SIZE]"+
		"[CENTER][FONT=GEORGIA]С уважением [COLOR=rgb(255, 69, 0)]Технический Специалист [/COLOR][URL='https://vk.com/hrnwtrrrr']Jesus Caprio[/URL][/FONT][/CENTER]<br>" ,
		prefix: CLOSE_PREFIX,
		status: false,
	},
{
	title: 'Кик за ПО',
	content:
	'[SIZE=4][FONT=GEORGIA][CENTER]Доброго времени суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
	'[CENTER]Уважаемый игрок, если вы были отключены от сервера Античитом<br><br>[COLOR=rgb(255, 0, 0)]Пример[/COLOR]:<br><br> [IMG]https://i.ibb.co/FXXrcVS/image.png[/IMG],<br>пожалуйста, обратите внимания на значения PacketLoss и Ping.<br><br>PacketLoss - минимальное значение 0.000000, максимальное 1.000000. При показателе, выше нуля, это означает, что у вас происходит задержка/потеря передаваемых пакетов информации на сервер. Это означает, что ваш интернет не передает достаточное количество данных из вашего устройства на наш сервер, в следствие чего система отключает вас от игрового процесса.<br><br>Ping - Чем меньше значение в данном пункте, тем быстрее передаются данные на сервер, и наоборот. Если значение выше 100, вы можете наблюдать отставания в игровом процессе из-за нестабильности интернет-соединения.<br><br>Если вы не заметили проблем в данных пунктах, скорее всего - у вас произошел скачек пинга при выполнении действия в игре, в таком случае, античит также отключает игрока из-за подозрения в использовании посторонних программ.<br><br>Решение данной проблемы: постарайтесь стабилизировать ваше интернет-соединение, при необходимости - сообщите о проблемах своему провайдеру (поставщику услуг интернета).<br>[CENTER][COLOR=rgb(255, 0, 0)]Закрыто.[/COLOR][/CENTER][/FONT][/SIZE]'+
	"[CENTER][FONT=GEORGIA]С уважением [COLOR=rgb(255, 69, 0)]Технический Специалист [/COLOR][URL='https://vk.com/hrnwtrrrr']Jesus Caprio[/URL][/FONT][/CENTER]<br>" ,
	prefix: CLOSE_PREFIX,
	status: false,
	},
	{
		title: 'Если не пришел донат',
		content:
		'[SIZE=4][FONT=GEORGIA][CENTER]Доброго времени суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		'[CENTER]Система построена таким образом, что <b>деньги не спишутся, пока наша платформа не уведомит платежную систему о зачислении BLACK COINS</b>. Для проверки зачисления BLACK COINS необходимо ввести в игре команду: <u>/donat</u>.<br>' +
		'[CENTER]В остальных же случаях, <b>если не были зачислены BLACK COINS — вероятнее всего, была допущена ошибка при вводе реквизитов</b>. К нашему сожалению, из-за большого количества попыток обмана, мы перестали рассматривать подобные жалобы.<br><i>Вам необходимо быть внимательными при осуществлении покупок</i>.<br>' +
		'[CENTER]Если Вы считаете, что ошибки быть не может и с момента оплаты не прошло более 14 дней, то в обязательном порядке обратитесь в данное сообщество для дальнейшего решения: https://vk.com/br_tech.<br>' +
		'[CENTER][I][COLOR=rgb(139, 0, 0)]Закрыто[/COLOR][/I].[/CENTER][/FONT][/SIZE]'+
		"[CENTER][FONT=GEORGIA]С уважением [COLOR=rgb(255, 69, 0)]Технический Специалист [/COLOR][URL='https://vk.com/hrnwtrrrr']Jesus Caprio[/URL][/FONT][/CENTER]<br>" ,
		prefix: CLOSE_PREFIX,
		status: false,
	},
	{
        title: 'Донат',
        content:
        '[SIZE=4][FONT=GEORGIA][CENTER]Доброго времени суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
        '[CENTER]Система построена таким образом, что деньги не спишутся, пока наша платформа не уведомит платежную систему о зачислении BLACK COINS. Для проверки зачисления BLACK COINS необходимо ввести в игре команду: /donat.<br>' +
        '[CENTER]В остальных же случаях, если не были зачислены BLACK COINS — вероятнее всего, была допущена ошибка при вводе реквизитов. К нашему сожалению, из-за большого количества попыток обмана, мы перестали рассматривать подобные жалобы. Вам необходимо быть внимательными при осуществлении покупок.<br>' +
        '[CENTER]Если Вы считаете, что ошибки быть не может и с момента оплаты не прошло более 14 дней, то в обязательном порядке обратитесь в данное сообщество для дальнейшего решения: https://vk.com/br_tech.<br>' +
        '[CENTER][I]Решено[/I].[/CENTER][/FONT][/SIZE]'+
        "[CENTER][FONT=GEORGIA]С уважением [COLOR=rgb(255, 69, 0)]Технический Специалист [/COLOR][URL='https://vk.com/hrnwtrrrr']Jesus Caprio[/URL][/FONT][/CENTER]<br>" ,
      prefix: DECIDED_PREFIX,
      status: false,
	},
	{
		title: 'Слетел аккаунт',
		content:
		'[SIZE=4][FONT=GEORGIA][CENTER]Доброго времени суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Аккаунт не может пропасть или аннулироваться просто так. Даже если Вы меняете ник, используете кнопки «починить игру» или «сброс настроек» - Ваш аккаунт не удаляется. Система работает иначе.<br><br>" +
		"[CENTER]Проверьте ввод своих данных: пароль, никнейм и сервер. Зачастую игроки просто забывают ввести актуальные данные и считают, что их аккаунт был удален. Будьте внимательны!" +
		'[CENTER]Как ввести никнейм (на случай, если сменили в игре, но не поменяли в клиенте): https://youtu.be/c8rhVwkoFaU [/CENTER] <br><br>' +
		'[CENTER][I]Рассмотрено[/I].[/CENTER][/FONT][/SIZE]'+
		"[CENTER][FONT=GEORGIA]С уважением [COLOR=rgb(255, 69, 0)]Технический Специалист [/COLOR][URL='https://vk.com/hrnwtrrrr']Jesus Caprio[/URL][/FONT][/CENTER]<br>" ,
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
	{
		title: 'Если нет скринов/видео',
		content:
		'[SIZE=4][FONT=GEORGIA][CENTER]Доброго времени суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Без доказательств (в частности скриншоты или видео) – решить проблему не получится. Если доказательства найдутся - создайте новую тему, приложив доказательства с фото-хостинга<br>[URL='https://yapx.ru/']yapx.ru[/URL],<br>[URL='https://imgur.com/']imgur.com[/URL],<br>[URL='https://www.youtube.com/']youtube.com[/URL],<br>[URL='https://imgbb.com']ImgBB.com[/URL]<br>(все кликабельно).<br>" +
		'[CENTER][I][COLOR=rgb(139, 0, 0)]Закрыто[/COLOR][/I].[/CENTER][/FONT][/SIZE]'+
		"[CENTER][FONT=GEORGIA]С уважением [COLOR=rgb(255, 69, 0)]Технический Специалист [/COLOR][URL='https://vk.com/hrnwtrrrr']Jesus Caprio[/URL][/FONT][/CENTER]<br>" ,
		prefix: CLOSE_PREFIX,
		status: false,
	},
	{
		title: 'Будет исправленно',
		content:
		'[SIZE=4][FONT=GEORGIA][CENTER]Доброго времени суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Данная недоработка будет проверена и исправлена.<br> Спасибо, ценим Ваш вклад в развите проекта.<br>" +
		'[CENTER][I]Рассмотрено[/I].[/CENTER][/FONT][/SIZE]'+
		"[CENTER][FONT=GEORGIA]С уважением [COLOR=rgb(255, 69, 0)]Технический Специалист [/COLOR][URL='https://vk.com/hrnwtrrrr']Jesus Caprio[/URL][/FONT][/CENTER]<br>" ,
		prefix: WATCHED_PREFIX,
		status: false,
	},
	{
		title: 'Правила восстановления',
		content:
		'[SIZE=4][FONT=GEORGIA][CENTER]Доброго времени суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Пожалуйста, убедительная просьба, ознакомьтесь с правилами восстановлений - [URL='https://forum.blackrussia.online/index.php?threads/В-каких-случаях-мы-не-восстанавливаем-игровое-имущество.25277/']клик[/URL].<br>Вы создали тему, которая не относится к технической проблеме.[/CENTER]<br><br>" +
		'[CENTER][I][COLOR=rgb(139, 0, 0)]Отказано[/COLOR][/CENTER][/I].[/FONT][/SIZE]'+
		
	"[CENTER][FONT=GEORGIA]С уважением [COLOR=rgb(255, 69, 0)]Технический Специалист [/COLOR][URL='https://vk.com/hrnwtrrrr']Jesus Caprio[/URL][/FONT][/CENTER]<br>" ,
		prefix: UNACCEPT_PREFIX,
		status: false,
	},
	{
		title: 'КРАШ/ВЫЛЕТ',
		content:
		'[SIZE=4][FONT=GEORGIA][CENTER]Доброго времени суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]В том случае, если Вы вылетели из игры во время игрового процесса (произошел краш), в обязательном порядке необходимо обратиться в данную тему в любом техническом разделе [img]https://i.ibb.co/sPhBGjx/NVIDIA-Share-1-Tde-EHim0u.png[/img][/CENTER]<br>" +
		"[CENTER][CODE]01. Ваш игровой никнейм: <br> 02. Сервер: <br> 03. Тип проблемы: Обрыв соединения | Проблема с ReCAPTCHA | Краш игры (закрытие игры) | Другое [Выбрать один вариант ответа] <br> 04. Действия, которые привели к этому (при вылетах, по возможности предоставлять место сбоя): <br> 05. Как часто данная проблема: <br> 06. Полное название мобильного телефона: <br> 07. Версия Android: <br> 08. Дата и время (по МСК): <br> 09. Связь с Вами по Telegram/VK:[/CODE]<br><br>" +
		'[CENTER][I][COLOR=rgb(139, 0, 0)]Отказано[/COLOR][/CENTER][/I].[/FONT][/SIZE]'+
		"[CENTER][FONT=GEORGIA]С уважением [COLOR=rgb(255, 69, 0)]Технический Специалист [/COLOR][URL='https://vk.com/hrnwtrrrr']Jesus Caprio[/URL][/FONT][/CENTER]<br>" ,
		prefix: UNACCEPT_PREFIX,
		status: false,
	},
	{
		title: 'Баг ФСИН(не выпустило)',
		content:
		'[SIZE=4][FONT=GEORGIA][CENTER]Доброго времени суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		'[CENTER]Скоро будете выпущены,ожидайте.[/CENTER][/FONT][/SIZE]'+
		"[CENTER][FONT=GEORGIA]С уважением [COLOR=rgb(255, 69, 0)]Технический Специалист [/COLOR][URL='https://vk.com/hrnwtrrrr']Jesus Caprio[/URL][/FONT][/CENTER]<br>" ,
		prefix: CLOSE_PREFIX,
		status: false,
	},
	{
		title: 'ХОЧУ СТАТЬ АДМ/ХЕЛПЕРОМ',
		content:
		'[SIZE=4][FONT=GEORGIA][CENTER]Доброго времени суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Команда технических специалистов не решает назначение на какую-либо должность, которая присутствует на проекте.<br>Для этого существуют заявления в главном разделе Вашего игрового сервера, где Вы можете ознакомиться с открытыми должностями и формами подач.<br>Приятной игры и желаем удачи в карьерной лестнице!<br><br>" +
		'[CENTER][I][COLOR=rgb(139, 0, 0)]Отказано[/COLOR][/I].[/CENTER][/FONT][/SIZE]'+
		"[CENTER][FONT=GEORGIA]С уважением [COLOR=rgb(255, 69, 0)]Технический Специалист [/COLOR][URL='https://vk.com/hrnwtrrrr']Jesus Caprio[/URL][/FONT][/CENTER]<br>" ,
		prefix: CLOSE_PREFIX,
		status: false,
	},
	{
		title: 'Улучшения для серверов',
		content:
		'[SIZE=4][FONT=GEORGIA][CENTER]Доброго времени суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		'[CENTER]Ваша тема не относится к технической проблеме, если вы хотите предложить изменения в игровом моде - обратитесь в раздел <br> [URL="https://forum.blackrussia.online/index.php?categories/Предложения-по-улучшению.656/"] Предложения по улучшению → нажмите сюда[/URL].<br>[CENTER][I][COLOR=rgb(139, 0, 0)]Закрыто[/COLOR][/I].[/CENTER][/FONT][/SIZE]' +
		"[CENTER][FONT=GEORGIA]С уважением [COLOR=rgb(255, 69, 0)]Технический Специалист [/COLOR][URL='https://vk.com/hrnwtrrrr']Jesus Caprio[/URL][/FONT][/CENTER]<br>" ,
		prefix: CLOSE_PREFIX,
		status: false,
	},
	{
		title: 'Вам нужны все прошивки',
		content:
		'[SIZE=4][FONT=GEORGIA][CENTER]Доброго времени суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		'[CENTER] Для активации какой либо прошивки необходимо поставить все детали данного типа "SPORT" "SPORT+" и т.п.<br>[CENTER][I][COLOR=rgb(139, 0, 0)]Закрыто[/COLOR][/I].[/CENTER][/FONT][/SIZE]'+
		"[CENTER][FONT=GEORGIA]С уважением [COLOR=rgb(255, 69, 0)]Технический Специалист [/COLOR][URL='https://vk.com/hrnwtrrrr']Jesus Caprio[/URL][/FONT][/CENTER]<br>" ,
		prefix: CLOSE_PREFIX,
		status: false,
	},
	];
	
	$(document).ready(() => {
	// Загрузка скрипта для обработки шаблонов
	$('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');
	
	// Добавление кнопок при загрузке страницы
	addButton('На рассмотрении', 'pin');
	addButton('КП', 'teamProject');
	addButton('Рассмотрено', 'watched');
	addButton('Отказано', 'unaccept');
	addButton('Решено', 'decided');
	addButton('Закрыто', 'closed');
	addButton('Тех. спецу', 'techspec');
	addButton('CLOSE', 'closed_complaint');
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
	`<button type="button" class="button--primary button rippleButton" id="${id}" style="border-radius: 25px; margin-right: 5px;">${name}</button>`,
	);
	}
	function addAnswers() {
		$('.button--icon--reply').after(`<button type="button" class="button--cta uix_quickReply--button button button--icon button--icon--write rippleButton" id="selectAnswer" style="oswald: 3px; margin-left: 15px; border-radius: 25px;">ОТВЕТЫ</button>`,
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
	'Добрый день' :
	15 < hours && hours <= 21 ?
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