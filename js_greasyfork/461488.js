// ==UserScript==
// @name П*зда админам
// @namespace https://forum.blackrussia.online
// @version 1.6
// @description Жб АДМ+ОБЖ
// @author Danila_Fererra
// @match https://forum.blackrussia.online/index.php?threads/*
// @include https://forum.blackrussia.online/index.php?threads/
// @grant none
// @license MIT
// @collaborator 
// @icon https://icons.iconarchive.com/icons/thesquid.ink/free-flat-sample/128/support-icon.png
// @downloadURL https://update.greasyfork.org/scripts/461488/%D0%9F%2A%D0%B7%D0%B4%D0%B0%20%D0%B0%D0%B4%D0%BC%D0%B8%D0%BD%D0%B0%D0%BC.user.js
// @updateURL https://update.greasyfork.org/scripts/461488/%D0%9F%2A%D0%B7%D0%B4%D0%B0%20%D0%B0%D0%B4%D0%BC%D0%B8%D0%BD%D0%B0%D0%BC.meta.js
// ==/UserScript==
 
(function () {
	'use strict';
	const UNACCEPT_PREFIX = 4; // префикс отказано
	const ACCEPT_PREFIX = 8; // префикс одобрено
	const PIN_PREFIX = 2; //  префикс закрепить
	const SPECADM_PREFIX = 11; // специальному администратору
	const MAINADM_PREFIX = 12; // главному адамнистратору
	const buttons = [
{
	title: 'Приветсвие',
	content:
	'[SIZE=4][FONT=Veranda][CENTER]Доброе время суток, уважаемый {{ user.mention }}![/CENTER]<br><br>' + 
	'[CENTER] текст [/CENTER][/FONT][/SIZE]',
},
{
	title: 'ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠᅠ Жалобы на Администрацию ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠᅠ ᅠ',
},
{
	title: 'ЖБ на рассмотрении',
	content: 
	'[SIZE=4][FONT=Veranda][CENTER]Доброе время суток, уважаемый {{ user.mention }}![/CENTER]<br><br>' + 
	"[CENTER]Ваша жалоба взята на рассмотрение. Ожидайте дальнейшего ответа, создавать копии данной темы не нужно.[/CENTER]<br><br>" +
	'[CENTER]Ожидайте ответа.[/CENTER][/FONT]',
	prefix: PIN_PREFIX,
	status: true,
},
{
	title: 'Название жалобы составлено не по форме',
	content:
	'[SIZE=4][FONT=Veranda][CENTER]Доброе время суток, уважаемый {{ user.mention }}![/CENTER]<br><br>' + 
	"[CENTER]Название жалобы составлено не по форме. Внимательно прочитайте правила составления жалобы на Админстратрацию:[URL='https://forum.blackrussia.online/index.php?threads/Правила-подачи-жалоб-на-администрацию.3429349/']*ТЫК*[/URL] <br>В названии темы необходимо написать: “Nick_Name администратора | Суть жалобы<br>Пример: Danila_Fererra | Nrp Drive<br><br>Форма для составление темы<br>[CODE]1. Ваш Nick_Name:<br>2. Nick_Name администратора:<br>3. Дата выдачи/получения наказания:<br>4. Суть жалобы:<br>5. Доказательство:[/CODE]<br>" +
	'[CENTER][ICODE]Отказано, закрыто.[/ICODE][/CENTER][/FONT][/SIZE]',
	prefix: UNACCEPT_PREFIX,
	status: false,
},
{
	title: 'Запрос доказательств',
	content:
	'[SIZE=4][FONT=Veranda][CENTER]Доброе время суток, уважаемый {{ user.mention }}![/CENTER]<br><br>' + 
	"[CENTER]У администратора были запрошены доказательства.[/CENTER]<br>" +
	'[CENTER]На рассмотрении[/CENTER][/FONT]',
	prefix: PIN_PREFIX,
	status: true,
},
{
	title: 'Наказание выдано верно',
	content: 
	'[SIZE=4][FONT=Veranda][CENTER]Доброе время суток, уважаемый {{ user.mention }}![/CENTER]<br><br>' + 
	"[CENTER]Админстратор предоставил доказательства вашего нарушения.<br>Нарушений со стороны администратора нет.[/CENTER]<br><br>" +
	'[CENTER]Закрыто[/CENTER][/FONT]',
	prefix: UNACCEPT_PREFIX,
	status: false,
},
{
	title: 'Ошибка Админа',
	content:
	'[SIZE=4][FONT=Veranda][CENTER]Доброе время суток, уважаемый {{ user.mention }}![/CENTER]<br><br>' + 
	'[CENTER]Ваше наказание снято, с администратором проведена беседа.<br>Приятного времяприпровождения.[/CENTER][/SIZE]<br>' +
	'[CENTER]Закрыто[/CENTER][/FONT]',	 
	prefix: ACCEPT_PREFIX,
	status: false,	 
},
{
	title: 'Беседа с администратором',
	content: 
	'[SIZE=4][FONT=Veranda][CENTER]Доброе время суток, уважаемый {{ user.mention }}![/CENTER]<br><br>' + 
	"[CENTER]С данным администратором будет проведенна строгая профилактическая беседа.[/CENTER]<br>" +
	'[CENTER]Решено.[/CENTER][/FONT]',
	prefix: ACCEPT_PREFIX,
	status: false,
},
{
	title: 'Передача ГА',
	content:
	'[SIZE=4][FONT=Veranda][CENTER]Доброе время суток, уважаемый {{ user.mention }}![/CENTER]<br><br>' + 
	'[CENTER]Ваша жалоба передана Главному Администратору.[/CENTER]<br>'+
	'[CENTER][ICODE]Ожидайте ответа.[/ICODE][/CENTER][/FONT][/SIZE]',
	prefix: MAINADM_PREFIX,
	status: true,
},
{
	title: 'Идите в технический раздел',
	content: 
	'[SIZE=4][FONT=Veranda][CENTER]Доброе время суток, уважаемый {{ user.mention }}![/CENTER]<br><br>' + 
	"[CENTER]Ваша тема не относиться к жалобам на администрацию, вам в технический раздел нашего сервера Purple[06] - [URL='https://forum.blackrussia.online/index.php?forums/Технический-раздел-purple.325/']клик[/URL] [/CENTER]<br>" +
	'[CENTER]Закрыто.[/CENTER][/FONT]',
	prefix: UNACCEPT_PREFIX,
	status: false,
},
{
	title: 'Идите в жб на техов',
	content: 
	'[SIZE=4][FONT=Veranda][CENTER]Доброе время суток, уважаемый {{ user.mention }}![/CENTER]<br><br>' + 
	"[CENTER]Вам было выдано наказание от технического специалиста, обратитесь в раздел 'Жалобы на технических специалистов' нашего сервера Puple[06] -[URL='https://forum.blackrussia.online/index.php?forums/Сервер-№6-purple.1187/']клик[/URL]<br>" +
	'[CENTER]Закрыто.[/CENTER][/FONT]',
	prefix: UNACCEPT_PREFIX,
	status: false,
},
{
	title: 'Жалобы от 3-его лица',
	content: 
	'[SIZE=4][FONT=Veranda][CENTER]Доброе время суток, уважаемый {{ user.mention }}![/CENTER]<br><br>' + 
	"[CENTER]Жалоба оформлена от 3-го лица.[/CENTER]<br>" +
	'[CENTER]Закрыто.[/CENTER][/FONT]',
	prefix: UNACCEPT_PREFIX,
	status: false,
},
{
	title: 'Присутвуют редактирования',
	content:
	'[SIZE=4][FONT=Veranda][CENTER]Доброе время суток, уважаемый {{ user.mention }}![/CENTER]<br><br>' + 
	"[CENTER]Доказательства должны быть в первоначальном виде, без присутствия редактирования с помощью сторонних программ.[/CENTER]<br>" +
	'[CENTER]Закрыто.[/CENTER][/FONT]',
	prefix: UNACCEPT_PREFIX,
	status: false,
},
{
	title: 'Нет окна блокировки',
	content:
	'[SIZE=4][FONT=Veranda][CENTER]Доброе время суток, уважаемый {{ user.mention }}![/CENTER]<br><br>' +
	"[CENTER]Без окна о блокирвке тема не подлежит рассмотрению - создайте новую тему, приложив окно блокировки с фото-хостинга<br>[URL='https://yapx.ru/']yapx.ru[/URL],<br>[URL='https://imgur.com/']imgur.com[/URL],<br>[URL='https://www.youtube.com/']youtube.com[/URL],<br>[URL='https://imgbb.com']ImgBB.com[/URL]<br>(все кликабельно).<br>" +
	'[CENTER]Закрыто.[/CENTER][/FONT][/SIZE]',
	prefix: UNACCEPT_PREFIX,
	status: false,
},
{
	title: 'Нет /time',
	content: 
	'[SIZE=4][FONT=Veranda][CENTER]Доброе время суток, уважаемый {{ user.mention }}![/CENTER]<br><br>' + 
	"[CENTER]В вашем доказательстве отсутствует /time.[/CENTER]<br>" +
	'[CENTER]Закрыто.[/CENTER][/FONT]',
	prefix: UNACCEPT_PREFIX,
	status: false,
},
{
	title: 'Прошло более 48 часов',
	content:
	'[SIZE=4][FONT=Veranda][CENTER]Доброе время суток, уважаемый {{ user.mention }}![/CENTER]<br><br>' + 
	"[CENTER]Ваша жалоба рассмотрению не подлежит так как после момента выдачи наказания прошло более 48 часов.[/CENTER]<br>" +
	'[CENTER]Закрыто.[/CENTER][/FONT]',
	prefix: UNACCEPT_PREFIX,
	status: false,
},
{
	title: 'В обжалование',
	content: 
	'[SIZE=4][FONT=Veranda][CENTER]Доброе время суток, уважаемый {{ user.mention }}![/CENTER]<br><br>' + 
	"[CENTER]Обратитесь в раздел Обжалование наказаний  нашего сервера Purple[06]- [URL='https://forum.blackrussia.online/index.php?forums/Обжалование-наказаний.313/']клик[/URL][/CENTER]<br>" +
	'[CENTER]Закрыто.[/CENTER][/FONT]',
	prefix: UNACCEPT_PREFIX,
	status: false,
},
{
	title: 'Доква с соц сетей не принимаются',
	content: 
	'[SIZE=4][FONT=Veranda][CENTER]Доброе время суток, уважаемый {{ user.mention }}![/CENTER]<br><br>' + 
	"[CENTER]Доказательства путем использования соц.сетей ( ВК, Инстаграм ) запрещенны.[/CENTER]<br>" +
	'[CENTER]Закрыто.[/CENTER][/FONT]',
	prefix: UNACCEPT_PREFIX,
	status: false,
},
{
	title: 'Правила раздела',
	content: 
	'[SIZE=4][FONT=Veranda][CENTER]Доброе время суток, уважаемый {{ user.mention }}![/CENTER]<br><br>' + 
	"[CENTER]Созданная тема никоим образом не относится к назначению и задачам данного раздела.[/CENTER]<br>" +
	'[CENTER]Закрыто.[/CENTER][/FONT]',
	prefix: UNACCEPT_PREFIX,
	status: false,
},
{
	title: 'Дублирование темы',
	content: 
	'[SIZE=4][FONT=Veranda][CENTER]Доброе время суток, уважаемый {{ user.mention }}![/CENTER]<br><br>' + 
	"[CENTER]Данная ема является дубликатом предыдущей, при 3-ем дублировании ваш форумный аккаунт будет заблокирован.[/CENTER]<br>" +
	'[CENTER]Закрыто.[/CENTER][/FONT]',
	prefix: UNACCEPT_PREFIX,
	status: false,
},
{
	title: 'Недостаточно доказательств',
	content: 
	'[SIZE=4][FONT=Veranda][CENTER]Доброе время суток, уважаемый {{ user.mention }}![/CENTER]<br><br>' + 
	"[CENTER]Недостаточно доказательств на нарушение от данного администратора.[/CENTER]<br>" +
	'[CENTER]Закрыто.[/CENTER][/FONT]',
	prefix: UNACCEPT_PREFIX,
	status: false,
},
{
	title: 'ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠᅠ ᅠРаздел Обжалования ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠᅠ ᅠ',
},
{
	title: 'Обжалование на рассмотрении',
	content: 
	'[SIZE=4][FONT=Veranda][CENTER]Доброе время суток, уважаемый {{ user.mention }}![/CENTER]<br><br>' + 
	"[CENTER]Ваше обжалование взято на рассмотрение. Не нужно создавать копии этой темы.[/CENTER]<br>" +
	'[CENTER]Ожидайте ответа.[/CENTER][/FONT]',
	prefix: PIN_PREFIX,
	status: true,
},
{
	title: 'Обжалованию не подлежит',
	content: 
	'[SIZE=4][FONT=Veranda][CENTER]Доброе время суток, уважаемый {{ user.mention }}![/CENTER]<br><br>' + 
	"[CENTER]Данному обжалованию отказано.<br>" +
	'[CENTER]Отказано.[/CENTER][/FONT][/SIZE]',
	prefix: UNACCEPT_PREFIX,
	status: false,
},
{
	title: 'Направить в раздел жб на адм',
	content: 
	'[SIZE=4][FONT=Veranda][CENTER]Доброе время суток, уважаемый {{ user.mention }}![/CENTER]<br><br>' + 
	"[CENTER]Если вы считаете что наказание было выдано неверно обратитесь в раздел жалоб на администрацию - [URL='https://forum.blackrussia.online/index.php?forums/Жалобы-на-администрацию.310/']клик[/URL].<br>" +
	'[CENTER]Отказано.[/CENTER][/FONT][/SIZE]',
	prefix: UNACCEPT_PREFIX,
	status: false,
},
{
	title: 'Идите в жб на техов',
	content: 
	'[SIZE=4][FONT=Veranda][CENTER]Доброе время суток, уважаемый {{ user.mention }}![/CENTER]<br><br>' + 
	"[CENTER]Вам было выдано наказание от технического специалиста, обратитесь в раздел 'Жалобы на технических специалистов' нашего сервера Puple[06] -[URL='https://forum.blackrussia.online/index.php?forums/Сервер-№6-purple.1187/']клик[/URL]<br>" +
	'[CENTER]Закрыто.[/CENTER][/FONT]',
	prefix: UNACCEPT_PREFIX,
	status: false,
},
{
	title: 'Жалобы от 3-его лица',
	content: 
	'[SIZE=4][FONT=Veranda][CENTER]Доброе время суток, уважаемый {{ user.mention }}![/CENTER]<br><br>' + 
	"[CENTER]Обжалование составлено от 3-го лица.[/CENTER]<br>" +
	'[CENTER]Закрыто.[/CENTER][/FONT]',
	prefix: UNACCEPT_PREFIX,
	status: false,
},
{
	title: 'Присутвуют редактирования',
	content: 
	'[SIZE=4][FONT=Veranda][CENTER]Доброе время суток, уважаемый {{ user.mention }}![/CENTER]<br><br>' + 
	"[CENTER]Доказательства должны быть в первоначальном виде, без присутствия редактирования с помощью сторонних программ.[/CENTER]<br>" +
	'[CENTER]Закрыто.[/CENTER][/FONT]',
	prefix: UNACCEPT_PREFIX,
	status: false,
},
{
	title: 'Нет окна блокировки',
	content:
	'[SIZE=4][FONT=Veranda][CENTER]Доброе время суток, уважаемый {{ user.mention }}![/CENTER]<br><br>' +
	"[CENTER]Без окна о блокирвке тема не подлежит рассмотрению - создайте новую тему, приложив окно блокировки	 с фото-хостинга<br>[URL='https://yapx.ru/']yapx.ru[/URL],<br>[URL='https://imgur.com/']imgur.com[/URL],<br>[URL='https://www.youtube.com/']youtube.com[/URL],<br>[URL='https://imgbb.com']ImgBB.com[/URL]<br>(все кликабельно).<br>" +
	'[CENTER]Закрыто.[/CENTER][/FONT][/SIZE]',
	prefix: UNACCEPT_PREFIX,
	status: false,
},
{
	title: 'Обжалование не по форме',
	content: 
	'[SIZE=4][FONT=Veranda][CENTER]Доброе время суток, уважаемый {{ user.mention }}![/CENTER]<br><br>' + 
	"[CENTER] Ваше обжалование составлено не по форме. Пожалуйста создайте новую тему соблюдая форму подачи:<br>Ваш никнейм и причина блокировки, пример:<br>Bruce_Banner | Массовый DM.<br>и форму обжалований:<br>[ICODE][B]1. Ваш Nick_Name:<br>2. Nick_Name администратора:<br>3. Дата выдачи/получения наказания:<br>4. Суть заявки:<br>5. Доказательство:[/B][/ICODE]<br>" +
	'[CENTER]Закрыто.[/CENTER][/FONT]',
	prefix: UNACCEPT_PREFIX,
	status: false,
},
{
	title: 'Доква с соц сетей не принимаются',
	content: 
	'[SIZE=4][FONT=Veranda][CENTER]Доброе время суток, уважаемый {{ user.mention }}![/CENTER]<br><br>' + 
	"[CENTER]Доказательства с соц.сетей, не принимаются.<br>Загрузите их на фото-хостинг [URL='https://yapx.ru/']yapx.ru[/URL], [URL='https://imgur.com/']imgur.com[/URL], [URL='https://www.youtube.com/']youtube.com[/URL],[URL='https://imgbb.com']ImgBB.com[/URL](все кликабетильно).<br><br>" +
	'[CENTER]Закрыто.[/CENTER][/FONT]',
	prefix: UNACCEPT_PREFIX,
	status: false,
},
{
	title: 'Оффтоп',
	content: 	
	'[SIZE=4][FONT=Veranda][CENTER]Доброе время суток, уважаемый {{ user.mention }}![/CENTER]<br><br>' + 
	"[CENTER]Созданная тема никоим образом не относится к назначению и задачам данного раздела.[/CENTER]<br>" +
	'[CENTER]Закрыто.[/CENTER][/FONT]',
	prefix: UNACCEPT_PREFIX,
	status: false,
},
{
	title: 'Дублирование темы',
	content: 
	'[SIZE=4][FONT=Veranda][CENTER]Доброе время суток, уважаемый {{ user.mention }}![/CENTER]<br><br>' + 
	"[CENTER]Дублирование темы. При дальнейших дублированиях тем ваш форумный аккаунт будет заблокирован.[/CENTER]<br>" +
	'[CENTER]Закрыто.[/CENTER][/FONT]',
	prefix: UNACCEPT_PREFIX,
	status: false,
},
{
	title: 'Обжалование НОНРП ОБМАН',
	content:
	'[SIZE=4][FONT=Veranda][CENTER]Доброе время суток, уважаемый {{ user.mention }}![/CENTER]<br><br>' + 
	"[CENTER] Если вы готовы возместить ущерб игроку, то прошу вас связаться с ним, обговорить все детали, после предоставить все доказательства в новой теме, так же с подтверждением игрока в новой теме.[/CENTER]<br>" +
	'[CENTER] Решено.[/CENTER][/FONT]',
	prefix: UNACCEPT_PREFIX,
	status: false,
},	
{
	title: 'будете обжалованы',
	content:
	'[SIZE=4][FONT=Veranda][CENTER]Доброе время суток, уважаемый {{ user.mention }}![/CENTER]<br><br>' + 
	"[CENTER]Рассмотрев важе наказание было принято решение о снятие наказания.[/CENTER]<br>" +
	'[CENTER]Одобрено, закрыто.[/CENTER][/FONT][/SIZE]',
	prefix: ACCEPT_PREFIX,
	status: false,
},
{
	title: 'уже обжалованы',
	content: 
	'[SIZE=4][FONT=Veranda][CENTER]Доброе время суток, уважаемый {{ user.mention }}![/CENTER]<br><br>' + 
	"[CENTER]Вам уже было выдано обжалование.[/CENTER]<br>" +
	'[CENTER]Закрыто.[/CENTER][/FONT][/SIZE]',
	prefix: UNACCEPT_PREFIX,
	status: false,
},
{
	title: 'обжалование не подлежит вообще',
	content: 
	'[SIZE=4][FONT=Veranda][CENTER]Доброе время суток, уважаемый {{ user.mention }}![/CENTER]<br><br>' + 
	"[CENTER]Ваше наказание обжалованию не подлежит.<br>" +
	'[CENTER]Закрыто.[/CENTER][/FONT][/SIZE]',
	prefix: UNACCEPT_PREFIX,
	status: false,
},
{
	title: 'Обжалованию не подлежит',
	content: 
	'[SIZE=4][FONT=Veranda][CENTER]Доброе время суток, уважаемый {{ user.mention }}![/CENTER]<br><br>' + 
	"[CENTER]Ваше обжалование не будет рассматриваться и будет закрыто так как ваше наказание соответствует причинам которые обжалованию не подлежат: различные формы слива, продажа игровой валюты, махинации, целенаправленный багоюз, продажа, передача аккаунта, сокрытие ошибок, багов системы, использование стороннего программного обеспечения, распространение конфиденциальной информации, обман администрации.<br>" +
	'[CENTER]Отказано.[/CENTER][/FONT][/SIZE]',
	prefix: UNACCEPT_PREFIX,
	status: false,
},
{
	title: 'МЫ НЕ ГОТОВЫ ВООБЩЕ',
	content: 
	'[SIZE=4][FONT=Veranda][CENTER]Доброе время суток, уважаемый {{ user.mention }}![/CENTER]<br><br>' + 
	"[CENTER]На данный момент мы не готовы пойти вам навстречу.<br>" +
	'[CENTER]Закрыто.[/CENTER][/FONT][/SIZE]',
	prefix: UNACCEPT_PREFIX,
	status: false,
},
{
	title: 'Обжалование до минималки',
	content: 
	'[SIZE=4][FONT=Veranda][CENTER]Доброе время суток, уважаемый {{ user.mention }}![/CENTER]<br><br>' + 
	"[CENTER]Ваше обжалование было рассмотрено и принято решение о сокращении вашего наказания.<br>" +
	'[CENTER]Одобрено.[/CENTER][/FONT][/SIZE]',
	prefix: ACCEPT_PREFIX,
	status: false,
},
{
	title: 'некоторое время',
	content: 
	'[SIZE=4][FONT=Veranda][CENTER]Доброе время суток, уважаемый {{ user.mention }}![/CENTER]<br><br>' + 
	"[CENTER] На данный момент времени ваше обжалование не имеет шансов получить положительный ответ. Спустя некоторое время подайте его повторно.<br>" +
	'[CENTER]Закрыто.[/CENTER][/FONT][/SIZE]',
	prefix: UNACCEPT_PREFIX,
	status: false,
},
];
	
	$(document).ready(() => {
	// Загрузка скрипта для обработки шаблонов
	$('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');
	
	// Добавление кнопок при загрузке страницы
	addButton('На рассмотрение', 'pin');
	addButton('Отказано', 'unaccept');
	addButton('Одобрено', 'accepted');
	addButton('Специальному Администратору', 'specadm');
	addButton('Главному Администратору', 'mainadm');
	addButton('Ответы', 'selectAnswer');
	
	// Поиск информации о теме
	const threadData = getThreadData();
	
	$('button#unaccept').click(() => editThreadData(UNACCEPT_PREFIX, false));
	$('button#pin').click(() => editThreadData(PIN_PREFIX, true));
	$('button#accepted').click(() => editThreadData(ACCEPT_PREFIX, false));
	$('button#specadm').click(() => editThreadData(SPECADM_PREFIX, true));
	$('button#mainadm').click(() => editThreadData(MAINADM_PREFIX, true));
	$('button#watched').click(() => editThreadData(WATCHED_PREFIX, false));
	$('button#decided').click(() => editThreadData(DECIDED_PREFIX, false));
	
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