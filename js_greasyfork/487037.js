// ==UserScript==
// @name BLACK RUSSIA TECH SCRIPT by Dmiitirev
// @namespace https://forum.blackrussia.online
// @version 3.0.13
// @description Официальный скрипт на форум для технического отдела BLACK RUSSIA от Dmiitrieva
// @author Maksim_Dmiitirev
// @match https://forum.blackrussia.online/threads/*
// @include https://forum.blackrussia.online/threads/
// @grant Maksim_Dmiitirev
// @license Maksim_Dmiitirev
// @collaborator Maksim_Dmiitirev
// @icon https://i.yapx.ru/ViO6c.png
// @downloadURL https://update.greasyfork.org/scripts/487037/BLACK%20RUSSIA%20TECH%20SCRIPT%20by%20Dmiitirev.user.js
// @updateURL https://update.greasyfork.org/scripts/487037/BLACK%20RUSSIA%20TECH%20SCRIPT%20by%20Dmiitirev.meta.js
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
		title: 'Приветствие',
		color: '#8f3628',
		content:
		'[SIZE=4][FONT=Veranda][CENTER]Доброго времени суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		'[SIZE=4][FONT=Veranda][CENTER] текст [/CENTER][/FONT][/SIZE]<br><br>' +
		'[SIZE=4][FONT=Veranda][CENTER][B][COLOR=rgb(123, 104, 238)]Мы стараемся для вас![/COLOR][/B][/CENTER][/FONT][/SIZE]',
	},
	{
		title: 'Будете заблокированы',
		color: '#1e2745',
		content:
		'[SIZE=4][FONT=Veranda][CENTER]Доброго времени суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		'[SIZE=4][FONT=Veranda][CENTER]Игровой аккаунт будет [B][COLOR=rgb(0, 255, 0)]заблокирован.[/COLOR][/B][/CENTER][/FONT][/SIZE]<br><br>' +
		'[SIZE=4][FONT=Veranda][CENTER][B][COLOR=rgb(123, 104, 238)]Мы стараемся для вас![/COLOR][/B][/CENTER][/FONT][/SIZE]',
		prefix: WATCHED_PREFIX,
		status: false,
	},
    {
		title: 'Причастные будут заблокированы',
		color: '#1e2745',
		content:
		'[SIZE=4][FONT=Veranda][CENTER]Доброго времени суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		'[SIZE=4][FONT=Veranda][CENTER]Причастные будут [B][COLOR=rgb(0, 255, 0)]заблокированы.[/COLOR][/B][/CENTER][/FONT][/SIZE]<br><br>' +
		'[SIZE=4][FONT=Veranda][CENTER][B][COLOR=rgb(123, 104, 238)]Мы стараемся для вас![/COLOR][/B][/CENTER][/FONT][/SIZE]',
		prefix: WATCHED_PREFIX,
		status: false,
	},
	{
		title: 'Жалобы на игроков (Будет заблокирован)',
		color: '#1e4530',
		content:
		'[SIZE=4][FONT=Veranda][CENTER]Доброго времени суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		'[SIZE=4][FONT=Veranda][CENTER]Проверив ваши доказательства, собрав нужную информацию, аккаунт игрока будет [B][COLOR=rgb(0, 255, 0)]заблокирован.[/COLOR][/B][/CENTER][/FONT][/SIZE]<br><br>' +
		'[SIZE=4][FONT=Veranda][CENTER][B][COLOR=rgb(123, 104, 238)]Мы стараемся для вас![/COLOR][/B][/CENTER][/FONT][/SIZE]',
		status: false,
	},
	{
		title: 'Жалобы на игроков (Не будет заблокирован)',
		color: '#1e4530',
		content:
		'[SIZE=4][FONT=Veranda][CENTER]Доброго времени суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		'[SIZE=4][FONT=Veranda][CENTER]Проверив ваши доказательства, собрав нужную информацию, аккаунт игрока [B][COLOR=rgb(255, 0, 0)]не будет заблокирован.[/COLOR][/B][/CENTER][/FONT][/SIZE]<br>' +
        '[SIZE=4][FONT=Veranda][CENTER]Если у Вас имеется больше доказательств - создайте новую тему.[/CENTER][/FONT][/SIZE]<br><br>' +
        '[SIZE=4][FONT=Veranda][CENTER][B][COLOR=rgb(123, 104, 238)]Мы стараемся для вас![/COLOR][/B][/CENTER][/FONT][/SIZE]',
		status: false,
	},
	{
	    title: 'ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ  ᅠ  Жалобы на технических специалистов ᅠ ᅠ ᅠᅠ ᅠ ᅠ ᅠᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ',
        color: '#FF0000',
	},
	{
		title: 'Взято на рассмотрение',
		color: 'F4A460',
		content:
		'[SIZE=4][FONT=Veranda][CENTER]Доброго времени суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		'[CENTER]Ваша тема взята на рассмотрение, ожидайте ответ в ближайшее время<br>Часто рассмотрение темы может занять определенное время.<br>[CENTER][COLOR=rgb(255, 255, 0)]На рассмотрении[/COLOR][/CENTER][/FONT][/SIZE]',
		prefix: PIN_PREFIX,
		status: true,
	},
	{
		title: 'Не относится к жалобам на тех',
		color: '#6B8E23',
		content:
		'[SIZE=4][FONT=Veranda][CENTER]Доброго времени суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Ваше обращение не относится к жалобам на технических специалистов.<br> Пожалуйста ознакомьтесь с правилами данного раздела: [URL='https://forum.blackrussia.online/forums/Информация-для-игроков.231/']клик[/URL] <br>" +
		'[CENTER][I][COLOR=rgb(255,0,0)]Отказано[/COLOR][/I].[/CENTER][/FONT][/SIZE]<br><br>' +
		'[SIZE=4][FONT=Veranda][CENTER][B][COLOR=rgb(123, 104, 238)]Мы стараемся для вас![/COLOR][/B][/CENTER][/FONT][/SIZE]',
		prefix: UNACCEPT_PREFIX,
		status: false,
	},
	{
		title: 'Вам в технический раздел',
		color: '#6B8E23',
		content:
		'[SIZE=4][FONT=Veranda][CENTER]Доброго времени суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Ваша тема не как не относится к жалобам на технических специалистов, обратитесь с данной темой в <u>технический раздел вашего сервера</u> - [URL='https://forum.blackrussia.online/index.php?forums/Технический-раздел.22/']клик[/URL]<br><br>" +
		'[CENTER][I][COLOR=rgb(255,0,0)]Отказано[/COLOR][/I].[/CENTER][/FONT][/SIZE]<br><br>' +
		'[SIZE=4][FONT=Veranda][CENTER][B][COLOR=rgb(123, 104, 238)]Мы стараемся для вас![/COLOR][/B][/CENTER][/FONT][/SIZE]',
		prefix: UNACCEPT_PREFIX,
		status: false,
	},
	{
		title: 'Нет фото/видеофиксации',
		color: '#008080',
		content:
		'[SIZE=4][FONT=Veranda][CENTER]Доброго времени суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Без доказательств (в частности скриншоты или видео) – решить проблему не получится. Если доказательства найдутся - создайте новую тему, приложив доказательства с фото-хостинга<br>[URL='https://yapx.ru/']yapx.ru[/URL],<br>[URL='https://imgur.com/']imgur.com[/URL],<br>[URL='https://www.youtube.com/']youtube.com[/URL],<br>[URL='https://imgbb.com']ImgBB.com[/URL]<br>(все кликабельно).<br>" +
		'[CENTER][I][COLOR=rgb(255,0,0)]Закрыто[/COLOR][/I].[/CENTER][/FONT][/SIZE]<br><br>' +
		'[SIZE=4][FONT=Veranda][CENTER][B][COLOR=rgb(123, 104, 238)]Мы стараемся для вас![/COLOR][/B][/CENTER][/FONT][/SIZE]',
		prefix: CLOSE_PREFIX,
		status: false,
	},
	{
		title: 'Нет окна блокировки',
		color: '#008080',
		content:
		'[SIZE=4][FONT=Veranda][CENTER]Доброго времени суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Без окна о блокировке тема не подлежит рассмотрению - создайте новую тему, приложив окно блокировки с фото-хостинга<br>[URL='https://yapx.ru/']yapx.ru[/URL],<br>[URL='https://imgur.com/']imgur.com[/URL],<br>[URL='https://www.youtube.com/']youtube.com[/URL],<br>[URL='https://imgbb.com']ImgBB.com[/URL]<br>(все кликабетильно).<br>" +
		'[CENTER][CENTER][COLOR=rgb(255, 0, 0)]Закрыто[/COLOR].[/CENTER][/FONT][/SIZE]<br><br>' +
		'[SIZE=4][FONT=Veranda][CENTER][B][COLOR=rgb(123, 104, 238)]Мы стараемся для вас![/COLOR][/B][/CENTER][/FONT][/SIZE]',
		prefix: CLOSE_PREFIX,
		status: false,
	},
	{
		title: 'Ожидайте вердикта руководства',
		color: 'F4A460',
		content:
		'[SIZE=4][FONT=Veranda][CENTER]Доброго времени суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Ваша тема закреплена и ожидает вердикта <u>моего руководства.</u>.<br>" +
		'[CENTER]<u>Создавать подобные темы не нужно</u>.<br>[CENTER][COLOR=rgb(255, 255, 0)]На рассмотрении[/COLOR][/CENTER][/FONT][/SIZE]',
		prefix: PIN_PREFIX,
		status: true,
	},
	{
		title: 'Правила раздела жалоб на тех.',
		color: '#FA8072',
		content:
		'[SIZE=4][FONT=Veranda][CENTER]Доброго времени суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Пожалуйста, убедительная просьба, ознакомиться с назначением данного раздела в котором Вы создали тему, так как Ваш запрос не относится к жалобам на технических специалистов.<br>Что принимается в данном разделе:<br>Жалобы на технических специалистов, оформленные по форме подачи и не нарушающие правила подачи:<br> [FONT=verdana][SIZE=7][COLOR=rgb(226, 80, 65)][U]Правила подачи жалобы на технических специалистов[/U][/COLOR][/SIZE][/FONT][/CENTER]<br><br>[QUOTE][FONT=verdana][SIZE=4][COLOR=rgb(226, 80, 65)]01.[/COLOR] Ваш игровой никнейм:[FONT=verdana][SIZE=4][COLOR=rgb(226, 80, 65)]<br>02.[/COLOR] Игровой никнейм технического специалиста:[COLOR=rgb(226, 80, 65)]<br>03.[/COLOR] Сервер, на котором Вы играете:[COLOR=rgb(226, 80, 65)]<br>04.[/COLOR] Описание ситуации (описать максимально подробно и раскрыто):[COLOR=rgb(226, 80, 65)]<br>05.[/COLOR] Любые скриншоты, которые могут помочь в решении проблемы (если таковые имеются):[COLOR=rgb(226, 80, 65)]<br>06.[/COLOR] Дата и время произошедшей технической проблемы (постарайтесь указать максимально точно):[/SIZE][/FONT][/SIZE][/QUOTE]<br><br>[FONT=verdana][SIZE=4][FONT=verdana][SIZE=4][COLOR=rgb(226, 80, 65)]Примечание:[/COLOR] все оставленные заявки обращения в данный раздел обязательно должны быть составлены по шаблону предоставленному немного выше.<br>В ином случае, заявки обращения в данный раздел составленные не по форме — будут отклоняться.<br>Касательно названия заголовка темы — четких правил нет, но, желательно чтобы оно содержало лишь никнейм и сервер технического специалиста.<br>Заранее, настоятельно рекомендуем ознакомиться [U][B][URL='https://forum.blackrussia.online/index.php?forums/faq.231/']с данным разделом[/URL][/B][/U].[/SIZE][/FONT][/SIZE][/FONT]<br>[CENTER][FONT=verdana][SIZE=7][COLOR=rgb(226, 80, 65)][U]Какие жалобы не проверяются?[/U][/COLOR][/SIZE][/FONT][/CENTER]<br><br>[FONT=verdana][SIZE=4][COLOR=rgb(226, 80, 65)]—[/COLOR] Если в содержании темы присутствует оффтоп/оскорбления.<br>[SIZE=4][COLOR=rgb(226, 80, 65)]—[/COLOR] Если в заголовке темы отсутствует никнейм технического специалиста.<br>[COLOR=rgb(226, 80, 65)]—[/COLOR] С момента выдачи наказания прошло более 14 дней.[/SIZE][/SIZE][/FONT]<br>" +
		'[CENTER][I][COLOR=rgb(255,0,0)]Отказано[/COLOR][/I].[/CENTER][/FONT][/SIZE]<br><br>' +
		'[SIZE=4][FONT=Veranda][CENTER][B][COLOR=rgb(123, 104, 238)]Мы стараемся для вас![/COLOR][/B][/CENTER][/FONT][/SIZE]',
		prefix: UNACCEPT_PREFIX,
		status: false,
	},
	{
		title: 'Форма подачи жб на тех.',
		color: '#FA8072',
		content:
		'[SIZE=4][FONT=Veranda][CENTER]Доброго времени суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Пожалуйста, заполните форму, создав новую тему: Название темы с NickName технического специалиста<br>Пример:<br> Lev_Kalashnikov | махинации<br>Форма заполнения темы:<br>[code]01. Ваш игровой никнейм:<br>02. Игровой никнейм технического специалиста:<br>03. Сервер, на котором Вы играете:<br>04. Описание ситуации (описать максимально подробно и раскрыто):<br>05. Любые скриншоты, которые могут помочь в решении проблемы (если таковые имеются):<br>06. Дата и время произошедшей технической проблемы (постарайтесь указать максимально точно):[/code]<br>" +
		'[CENTER][I][COLOR=rgb(255,0,0)]Отказано[/COLOR][/I].[/CENTER][/FONT][/SIZE]<br><br>' +
		'[SIZE=4][FONT=Veranda][CENTER][B][COLOR=rgb(123, 104, 238)]Мы стараемся для вас![/COLOR][/B][/CENTER][/FONT][/SIZE]',
		prefix: UNACCEPT_PREFIX,
		status: false,
	},
	{
		title: 'Дублированное обращение',
		color: '#f00',
		content:
		'[SIZE=4][FONT=Veranda][CENTER]Доброго времени суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Данная тема является <u>дубликатом вашей предыдущей темы</u>.<br>Пожалуйста, <u><b>прекратите создавать идентичные или похожие темы - иначе Ваш форумный аккаунт может быть заблокирован</b></u>.<br><br>" +
		'[CENTER][I][COLOR=rgb(255, 0, 0)]Закрыто[/COLOR][/I].[/CENTER][/FONT][/SIZE]<br><br>' +
		'[SIZE=4][FONT=Veranda][CENTER][B][COLOR=rgb(123, 104, 238)]Мы стараемся для вас![/COLOR][/B][/CENTER][/FONT][/SIZE]',
		prefix: UNACCEPT_PREFIX,
		status: false,
	},
	{
		title: 'Срок подачи жалоб',
		color: '#FA8072',
		content:
		'[SIZE=4][FONT=Veranda][CENTER]Доброго времени суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		'[CENTER]С момента выдачи наказания от технического специалиста прошло более 14-ти дней.<br>Пересмотр/изменение меры наказания новозможно, вы можете попробывать написать обжалование через N-ый промежуток времени.<br><br>Обращаем ваше внимание на то, что некоторые наказания не подлежат не обжалованию,амнистии.[/center]<br><br>'+
		'[CENTER][I][COLOR=rgb(255,0,0)]Закрыто[/COLOR][/I].[/CENTER][/FONT][/SIZE]<br><br>' +
		'[SIZE=4][FONT=Veranda][CENTER][B][COLOR=rgb(123, 104, 238)]Мы стараемся для вас![/COLOR][/B][/CENTER][/FONT][/SIZE]',
		prefix: UNACCEPT_PREFIX,
		status: false,
	},
	{
		title: 'Будете разблокированы',
		color: '#0037ff',
		content:
		'[SIZE=4][FONT=Veranda][CENTER]Доброго времени суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		'[SIZE=4][FONT=Veranda][CENTER]Игровой аккаунт будет [B][COLOR=rgb(0, 255, 0)]разблокирован.[/COLOR][/B][/CENTER][/FONT][/SIZE]<br>' +
		'[SIZE=4][FONT=Veranda][CENTER]Ваша тема закреплена и ожидает вердикта <u>моего руководства</u>.[/CENTER][/FONT][/SIZE]<br><br>' +
		'[SIZE=4][FONT=Veranda][CENTER][B][COLOR=rgb(123, 104, 238)]Мы стараемся для вас![/COLOR][/B][/CENTER][/FONT][/SIZE]',
		prefix: PIN_PREFIX,
		status: true,
	},
	{
		title: 'ᅠ ᅠ ᅠ ᅠᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠᅠ ᅠ Получил бан за ᅠ ᅠ ᅠᅠ ᅠ ᅠ ᅠ ᅠᅠ ᅠ ᅠ ᅠᅠ ᅠ ᅠ ᅠ ',
        color: '#FF0000',
    },
	{
		title: 'Взломан (какие привязки)',
		color: '#3f0',
		content:
		'[SIZE=4][FONT=Veranda][CENTER]Доброго времени суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		'[SIZE=4][FONT=Veranda][CENTER]Какие привязки (Настройки безопасности) присутствуют на аккаунте?[/CENTER][/FONT][/SIZE]<br>' +
		'[SIZE=4][FONT=Veranda][CENTER]К каким у вас есть доступ?[/CENTER][/FONT][/SIZE]',
        prefix: TECHADM_PREFIX,
		status: true,
	},
	{
		title: 'Взломан (сброс пароля)',
		color: '#47b82a',
		content:
		'[SIZE=4][FONT=Veranda][CENTER]Доброго времени суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		'[SIZE=4][FONT=Veranda][CENTER]Сделаете сброс пароля, воспользовавшись соответствующей системой. После выполнения отпишите.[/CENTER][/FONT][/SIZE]',
        prefix: TECHADM_PREFIX,
		status: true,
	},
	{
		title: 'Взломан (сброс пароля не был осуществлен)',
		color: '#47b82a',
		content:
		'[SIZE=4][FONT=Veranda][CENTER]Доброго времени суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		'[SIZE=4][FONT=Veranda][CENTER]Сброс пароля не был осуществлен.[/CENTER][/FONT][/SIZE]<br>' +
		'[SIZE=4][FONT=Veranda][CENTER]Убедитесь в правильности выполнения сброса пароля, возможно Вы сбросили пароль другого аккаунта.<br><br>Если Вы допустили ошибку при сбросе - создайте новое обращение.[/CENTER][/FONT][/SIZE]<br>' +
        '[SIZE=4][FONT=Veranda][CENTER]На данный момент мы не можем убедиться о наличии доступа к привязке.[/CENTER][/FONT][/SIZE]<br><br>' +
        '[SIZE=4][FONT=Veranda][CENTER][B][COLOR=rgb(123, 104, 238)]Мы стараемся для вас![/COLOR][/B][/CENTER][/FONT][/SIZE]',
        prefix: UNACCEPT_PREFIX,
		status: false,
	},
	{
		title: 'Взломан (переход в лс)',
		color: '#4e943d',
		content:
		'[SIZE=4][FONT=Veranda][CENTER]Доброго времени суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		'[SIZE=4][FONT=Veranda][CENTER]Связался с вами [I]в личных сообщениях на форуме.[/I][/CENTER][/FONT][/SIZE]',
        prefix: TECHADM_PREFIX,
		status: true,
	},
	{
		title: 'Взломан (нет ответа в лс)',
		color: '#4e943d',
		content:
		'[SIZE=4][FONT=Veranda][CENTER]Доброго времени суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		'[SIZE=4][FONT=Veranda][CENTER]К сожалению не получаю от Вас ответа в [I]личных сообщения на форуме[/I][/CENTER][/FONT][/SIZE]<br>' +
        '[SIZE=4][FONT=Veranda][CENTER]Если проблема актуальна или возникший у Вас вопрос остался нерешен создайте новое обращение.[/CENTER][/FONT][/SIZE]<br><br>' +
        '[SIZE=4][FONT=Veranda][CENTER][B][COLOR=rgb(123, 104, 238)]Мы стараемся для вас![/COLOR][/B][/CENTER][/FONT][/SIZE]',
		prefix: UNACCEPT_PREFIX,
		status: false,
	},
	{
		title: 'Взломан (передано руководтсву)',
		color: '#4a753f',
		content:
		'[SIZE=4][FONT=Veranda][CENTER]Доброго времени суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		'[SIZE=4][FONT=Veranda][CENTER]Запросив дополнительную информацию в  [I]личных сообщения на форуме [/I], я сделал некие выводы.[/CENTER][/FONT][/SIZE]<br>' +
		'[SIZE=4][FONT=Veranda][CENTER][U]Передано руководству для окончательного вердикта.[/U][/CENTER][/FONT][/SIZE]',
		prefix: PIN_PREFIX,
		status: true,
	},
	{
		title: 'Махинации со взломом',
		color: '#367f61',
		content:
		'[SIZE=4][FONT=Veranda][CENTER]Доброго времени суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		'[SIZE=4][FONT=Veranda][CENTER]Вы обманули игрока, путем взлома и последующей передачи имущества на свои игровые аккаунты, впоследствии чего были заблокированы.[/CENTER][/FONT][/SIZE]<br><br>' +
		'[SIZE=4][FONT=Veranda][CENTER]Обманывать игроков и/или передавать/получать игровое имущество таким способом запрещено [URL=https://forum.blackrussia.online/threads/%D0%9E%D0%B1%D1%89%D0%B8%D0%B5-%D0%BF%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%B5%D1%80%D0%B2%D0%B5%D1%80%D0%BE%D0%B2.312571/]Правилами игры[/URL].[/CENTER][/FONT][/SIZE]<br>' +
		'[SIZE=4][FONT=Veranda][CENTER][I]У вас остались вопросы?[/I][/CENTER][/FONT][/SIZE]',
        prefix: TECHADM_PREFIX,
		status: true,
	},
	{
		title: 'Трансфер',
		color: '#0037ff',
		content:
		'[SIZE=4][FONT=Veranda][CENTER]Доброго времени суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		'[CENTER][SIZE=4][FONT=Veranda]Вы совершили передачу игрового имущества с одного игрового аккаунта на другой, впоследствии чего были заблокированы.[/CENTER][/FONT][/SIZE]<br>' +
		'[SIZE=4][FONT=Veranda][CENTER]Передавать игровое имущество с одного игрового аккаунта на другой запрещено [URL=https://forum.blackrussia.online/threads/%D0%9E%D0%B1%D1%89%D0%B8%D0%B5-%D0%BF%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%B5%D1%80%D0%B2%D0%B5%D1%80%D0%BE%D0%B2.312571/]Правилами игры[/URL].[/CENTER][/FONT][/SIZE]<br>' +
		'[SIZE=4][FONT=Veranda][CENTER][I]У вас остались вопросы?[/I][/CENTER][/FONT][/SIZE]',
        prefix: TECHADM_PREFIX,
		status: true,
	},
	{
		title: 'Купил ИВ',
		color: '#00d0ff',
		content:
		'[SIZE=4][FONT=Veranda][CENTER]Доброго времени суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		'[CENTER][SIZE=4][FONT=Veranda]Вы купили игровую валюту у продавца игровой валюты, впоследствии чего были заблокированы.[/CENTER][/FONT][/SIZE]<br>' +
		'[SIZE=4][FONT=Veranda][CENTER]Покупать и/или продавать игровую валюту запрещено [URL=https://forum.blackrussia.online/threads/%D0%9E%D0%B1%D1%89%D0%B8%D0%B5-%D0%BF%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%B5%D1%80%D0%B2%D0%B5%D1%80%D0%BE%D0%B2.312571/]Правилами игры[/URL].[/CENTER][/FONT][/SIZE]<br>' +
		'[SIZE=4][FONT=Veranda][CENTER][I]У вас остались вопросы?[/I][/CENTER][/FONT][/SIZE]',
        prefix: TECHADM_PREFIX,
		status: true,
	},
	{
		title: 'Продал ИВ',
		color: '#00d0ff',
		content:
		'[SIZE=4][FONT=Veranda][CENTER]Доброго времени суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		'[CENTER][SIZE=4][FONT=Veranda]Вы продали игровую валюту покупателю игровой валюты, впоследствии чего были заблокированы.[/CENTER][/FONT][/SIZE]<br>' +
		'[SIZE=4][FONT=Veranda][CENTER]Покупать и/или продавать игровую валюту запрещено [URL=https://forum.blackrussia.online/threads/%D0%9E%D0%B1%D1%89%D0%B8%D0%B5-%D0%BF%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%B5%D1%80%D0%B2%D0%B5%D1%80%D0%BE%D0%B2.312571/]Правилами игры[/URL].[/CENTER][/FONT][/SIZE]<br>' +
		'[SIZE=4][FONT=Veranda][CENTER][I]У вас остались вопросы?[/I][/CENTER][/FONT][/SIZE]',
        prefix: TECHADM_PREFIX,
		status: true,
	},
	{
		title: 'ППИВ - Трансфер',
		color: '#cc257e',
		content:
		'[SIZE=4][FONT=Veranda][CENTER]Доброго времени суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		'[CENTER][SIZE=4][FONT=Veranda]Вы передавали игровую валюту с одного игрового аккаунта на другой, впоследствии чего были заблокированы.[/CENTER][/FONT][/SIZE]<br>' +
		'[SIZE=4][FONT=Veranda][CENTER]Передавать игровое имущество с одного игрового аккаунта на другой запрещено [URL=https://forum.blackrussia.online/threads/%D0%9E%D0%B1%D1%89%D0%B8%D0%B5-%D0%BF%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%B5%D1%80%D0%B2%D0%B5%D1%80%D0%BE%D0%B2.312571/]Правилами игры[/URL].[/CENTER][/FONT][/SIZE]<br>' +
        '[CENTER][SIZE=4][FONT=Veranda]Причина блокировки будет изменена.[/CENTER][/FONT][/SIZE]<br>' +
        '[CENTER][SIZE=4][FONT=Veranda][I]У вас остались вопросы?[/I][/CENTER][/FONT][/SIZE]',
        prefix: TECHADM_PREFIX,
		status: true,
	},
	{
		title: 'Вы согласны с наказанием',
		color: '#377f36',
		content:
		'[SIZE=4][FONT=Veranda][CENTER]Доброго времени суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		'[SIZE=4][FONT=Veranda][CENTER]Вы согласны с выданным наказанием?[/CENTER][/FONT][/SIZE]',
		prefix: TECHADM_PREFIX,
		status: true,
	},
	{
		title: 'Аккаунт не заблокирован',
		color: '#b5de45',
		content:
		'[SIZE=4][FONT=Veranda][CENTER]Доброго времени суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		'[SIZE=4][FONT=Veranda][CENTER]Игровой аккаунт [B][COLOR=rgb(0, 255, 0)]не находится в блокировке.[/COLOR][/B][/CENTER][/FONT][/SIZE]<br>' +
		'[SIZE=4][FONT=Veranda][CENTER][B][COLOR=rgb(123, 104, 238)]Мы стараемся для вас![/COLOR][/B][/CENTER][/FONT][/SIZE]',
		prefix: WATCHED_PREFIX,
		status: false,
	},
	{
		title: 'Ранее разблокированы',
		color: '#2ff52c',
		content:
		'[SIZE=4][FONT=Veranda][CENTER]Доброго времени суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		'[SIZE=4][FONT=Veranda][CENTER]Игровой аккаунт не находится в блокировке, он был ранее разблокирован.[/CENTER][/FONT][/SIZE]<br>' +
		'[SIZE=4][FONT=Veranda][CENTER][B][COLOR=rgb(123, 104, 238)]Мы стараемся для вас![/COLOR][/B][/CENTER][/FONT][/SIZE]',
		prefix: WATCHED_PREFIX,
		status: false,
	},
	{
		title: 'NickName не найден',
		color: '#b5de45',
		content:
		'[SIZE=4][FONT=Veranda][CENTER]Доброго времени суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		'[SIZE=4][FONT=Veranda][CENTER]NickName который Вы указали [I]не зарегистророван на сервере.[/I][/CENTER][/FONT][/SIZE]<br><br>' +
		'[SIZE=4][FONT=Veranda][CENTER][B][COLOR=rgb(123, 104, 238)]Мы стараемся для вас![/COLOR][/B][/CENTER][/FONT][/SIZE]',
		prefix: WATCHED_PREFIX,
		status: false,
	},
	{
		title: 'Ответа нет',
		color: '#f52c43',
		content:
		'[SIZE=4][FONT=Veranda][CENTER]Доброго времени суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		'[SIZE=4][FONT=Veranda][CENTER]К сожалению, мы не получаем от Вас ответа, вынуждены закрыть обращение.[/CENTER][/FONT][/SIZE]<br>' +
		'[SIZE=4][FONT=Veranda][CENTER]Если проблема актуальна или возникший у Вас вопрос остался нерешен создайте новое обращение.[/CENTER][/FONT][/SIZE]<br><br>' +
		'[SIZE=4][FONT=Veranda][CENTER][B][COLOR=rgb(123, 104, 238)]Мы стараемся для вас![/COLOR][/B][/CENTER][/FONT][/SIZE]',
		prefix: UNACCEPT_PREFIX,
		status: false,
	},
	{
		title: 'Уточните',
		color: '#f1f52c',
		content:
		'[SIZE=4][FONT=Veranda][CENTER]Доброго времени суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		'[SIZE=4][FONT=Veranda][CENTER]Нам не совсем ясна суть, пожалуйста уточните.[/CENTER][/FONT][/SIZE]'
	},
	{
		        title: '------------------------------------------Перепутали разделы на форуме------------------------------------------',
        dpstyle: 'oswald: 3px;     color: #fff; background: #db2309; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
	},
	{
		title: 'Оффтоп.',
		content:
		'[SIZE=4][FONT=Veranda][CENTER]Доброго времени суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Ваше обращение содержит контент, который нарушает правила пользования форумом. Пожалуйста, прекратите создавать подобные обращения, иначе Ваш форумный аккаунт может быть наделен статусом временной или постоянной блокировки.<br>Ознакомиться с правилами пользования форумом Вы можете здесь: [URL='https://forum.blackrussia.online/threads/%D0%9E%D0%B1%D1%89%D0%B8%D0%B5-%D0%BF%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BD%D0%B0%D1%85%D0%BE%D0%B6%D0%B4%D0%B5%D0%BD%D0%B8%D1%8F-%D0%BD%D0%B0-%D1%84%D0%BE%D1%80%D1%83%D0%BC%D0%B5.304564/']клик[/URL] <br>" +
		'[CENTER][I][COLOR=rgb(255,0,0)]Закрыто[/COLOR][/I].[/CENTER][/FONT][/SIZE]',
		prefix: CLOSE_PREFIX,
		status: false,
	},
	{
		title: 'Вам в технический раздел',
		content:
		'[SIZE=4][FONT=Veranda][CENTER]Доброго времени суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Ваша тема не как не относится к жалобам на технических специалистов, обратитесь с данной темой в <u>технический раздел вашего сервера</u> - [URL='https://forum.blackrussia.online/index.php?forums/Технический-раздел.22/']клик[/URL]<br><br>" +
		'[CENTER][I][COLOR=rgb(255,0,0)]Отказано[/COLOR][/I].[/CENTER][/FONT][/SIZE]',
		prefix: UNACCEPT_PREFIX,
		status: false,
	},
	{
		title: 'Вам в жб на специалистов',
		content:
		'[SIZE=4][FONT=Veranda][CENTER]Доброго времени суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		'[CENTER]Вы получили наказание от технического специалиста Вашего сервера.<br>Вам следует обратиться в раздел «Жалобы на технических специалистов» — в случае, если Вы не согласны с наказанием.<br><br>' +
		"[CENTER]Ссылка на раздел, где можно оформить жалобу на технического специалиста - [URL='https://forum.blackrussia.online/index.php?forums/Жалобы-на-технических-специалистов.490/']клик[/URL] <br><br>" +
		'[CENTER][I][COLOR=rgb(255,0,0)]Отказано[/COLOR][/I].[/CENTER][/FONT][/SIZE]',
		prefix: UNACCEPT_PREFIX,
		status: false,
	},
	{
		title: 'Передача тестерам',
		content:
		'[SIZE=4][FONT=Veranda][CENTER]Доброго времени суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Ваша тема передана на тестирование.[/CENTER][/FONT][/SIZE]",
		  prefix: WAIT_PREFIX,
		  status: false,
	},
	{
		title: 'Вам в раздел государственных орг.',
		content:
		'[SIZE=4][FONT=Veranda][CENTER]Доброго времени суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		'[CENTER]Ваша тема не относится к техническому разделу, пожалуйста оставьте ваше заявление в соответствующем разделе Государственных Организаций вашего сервера.[/CENTER]<br><br>'+
		'[CENTER][I][COLOR=rgb(255, 0, 0)]Отказано[/COLOR][/I].[/CENTER][/FONT][/SIZE]',
		prefix: UNACCEPT_PREFIX,
		status: false,
	},
	{
		title: 'Вам в раздел криминальных орг.',
		content:
		'[SIZE=4][FONT=Veranda][CENTER]Доброго времени суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		'[CENTER]Ваша тема не относится к техническому разделу, пожалуйста оставьте ваше заявление в соответствующем разделе Криминальных Организаций вашего сервера [/CENTER]'+
		'[CENTER][I][COLOR=rgb(255,0,0)]Отказано[/COLOR][/I].[/CENTER][/FONT][/SIZE]',
		prefix: UNACCEPT_PREFIX,
		status: false,
	},
	{
		title: 'Вам в жб на адм.',
		content:
		'[SIZE=4][FONT=Veranda][CENTER]Доброго времени суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Вы получили наказание которое не относится к технической части, оно относится к Административной части.<br> Обратитесь в раздел Жалобы на администрацию вашего сервера.<br>Форма для подачи жалобы - [URL='https://forum.blackrussia.online/index.php?threads/Правила-подачи-жалоб-на-администрацию.3429349/']Клик[/URL]<br>" +
		'[CENTER][I][COLOR=rgb(255,0,0)]Закрыто[/COLOR][/I].[/CENTER][/FONT][/SIZE]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
	{
		title: 'Вам в жб на игроков',
		content:
		'[SIZE=4][FONT=Veranda][CENTER]Доброго времени суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Данная тема не относится к техническому разделу.<br>Данное действие было совершено игроком и нарушает правила сервера, пожалуйста обратитесь в <br>'Жалобы на игроков'<br>Вашего сервера.<br>Форма подачи жалобы - [URL='https://forum.blackrussia.online/index.php?threads/Правила-подачи-жалоб-на-игроков.3429394/']Клик[/URL]" +
		'[CENTER][I][COLOR=rgb(255,0,0)]Закрыто[/COLOR][/I].[/CENTER][/FONT][/SIZE]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
    {
		title: 'Вам в жб на лидеров',
		content:
		'[SIZE=4][FONT=Veranda][CENTER]Доброго времени суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Данная тема не относится к техническому разделу.<br>Данные действия были совершены лидером и нарушают регламент сервера, пожалуйста обратитесь в <br>'Жалобы на лидеров'<br>Вашего сервера.<br>Форма подачи жалобы - [URL='https://forum.blackrussia.online/threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BF%D0%BE%D0%B4%D0%B0%D1%87%D0%B8-%D0%B6%D0%B0%D0%BB%D0%BE%D0%B1-%D0%BD%D0%B0-%D0%BB%D0%B8%D0%B4%D0%B5%D1%80%D0%BE%D0%B2.3429391/']Клик[/URL]" +
		'[CENTER][I][COLOR=rgb(255,0,0)]Закрыто[/COLOR][/I].[/CENTER][/FONT][/SIZE]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
	{
		title: 'Вам в обжалования',
		content:
		'[SIZE=4][FONT=Veranda][CENTER]Доброго времени суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Вы получили наказание от администратора своего сервера.<br> Для его снижения/обжалования обратитесь в раздел<br><<Обжалования>> вашего сервера.<br>Форма подачи темы - [URL='https://forum.blackrussia.online/index.php?threads/Правила-подачи-заявки-на-обжалование-наказания.3429398/']Клик[/URL]" +
		'[CENTER][I][COLOR=rgb(255,0,0)]Закрыто[/COLOR][/I].[/CENTER][/FONT][/SIZE]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
	{
		title: 'Хочу занять должность',
		content:
		'[SIZE=4][FONT=Veranda][CENTER]Доброго времени суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Команда технических специалистов не решает назначение на какую-либо должность, которая присутствует на проекте.<br>Для этого существуют заявления в главном разделе Вашего игрового сервера или специальный раздел (находится выше раздела определнного сервера), где Вы можете ознакомиться с открытыми должностями и формами подач.<br>Приятной игры и желаем удачи в карьерной лестнице!<br><br>" +
		'[CENTER][I][COLOR=rgb(255,0,0)]Отказано[/COLOR][/I].[/CENTER][/FONT][/SIZE]',
		prefix: CLOSE_PREFIX,
		status: false,
	},
	{
		title: 'По предложениям по улучшению',
		content:
		'[SIZE=4][FONT=Veranda][CENTER]Доброго времени суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		'[CENTER]Ваша тема не относится к технической проблеме, если вы хотите предложить изменения в игровом моде - обратитесь в раздел <br> [URL="https://forum.blackrussia.online/index.php?categories/Предложения-по-улучшению.656/"] Предложения по улучшению → нажмите сюда[/URL].<br>[CENTER][I][COLOR=rgb(255,0,0)]Закрыто[/COLOR][/I].[/CENTER][/FONT][/SIZE]' ,
		prefix: CLOSE_PREFIX,
		status: false,
	},
	{
		title: 'Дублированное обращение',
		content:
		'[SIZE=4][FONT=Veranda][CENTER]Доброго времени суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Данная тема является <u>дубликатом вашей предыдущей темы</u>.<br>Пожалуйста, <u><b>прекратите создавать идентичные или похожие темы - иначе Ваш форумный аккаунт может быть заблокирован</b></u>.<br><br>" +
		'[CENTER][I][COLOR=rgb(255, 0, 0)]Закрыто[/COLOR][/I].[/CENTER][/FONT][/SIZE]',
		prefix: UNACCEPT_PREFIX,
		status: false,
	},
	{  
		        title: '-----------------------------------------------Технический раздел-----------------------------------------------',
        dpstyle: 'oswald: 3px;     color: #fff; background: #db2309; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
	},
	{
		title: 'Взято на рассмотрение',
		color: 'DarkOrange',
		content:
		'[SIZE=4][FONT=Veranda][CENTER]Доброго времени суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		'[CENTER]Ваша тема взята на рассмотрение, ожидайте ответ в ближайшее время<br>Часто рассмотрение темы может занять определенное время.<br>[CENTER][COLOR=rgb(255, 255, 0)]На рассмотрении[/COLOR][/CENTER][/FONT][/SIZE]',
		prefix: PIN_PREFIX,
		status: true,
	},
	{
		title: 'Как восстановить доступ к аккаунту',
		content:
		'[SIZE=4][FONT=Veranda][CENTER]Доброго времени суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Если Вы обезопасили Ваш аккаунт и [U]привязали его к странице во ВКонтакте[/U], то сбросить пароль или пин-код Вы всегда сможете обратившись в официальное сообщество проекта - https://vk.com/blackrussia.online.<br> Либо в телеграмм бот - https://t.me/br_helper_bot.<br> Напишите «Начать» в личные сообщения группы/бота, затем выберите нужные Вам функции.<br><br>" +
		"[CENTER][FONT=Veranda]Подробнее в данной теме - [URL='https://forum.blackrussia.online/index.php?threads/lime-Защита-игрового-аккаунта.1201253/']клик[/URL][/center]<br><br>" +
		"[CENTER]Если Вы обезопасили Ваш аккаунт и [U]привязали его к почте[/U], то сбросить пароль или пин-код Вы всегда сможете при вводе пароля на сервере. После подключения к серверу нажмите на кнопку «Войти в аккаунт», затем выберите кнопку «Восстановить пароль», после чего на Вашу почту будет отправлено письмо с одноразовым кодом восстановления.<br><br>" +
		"[CENTER]Если Вы [U]не обезопасили свой аккаунт - его невозможно вернуть[/U]. Игрок самостоятельно несет отвественность за безопаность своего аккаунта.<br><br>" +
		'[CENTER]К сожалению, иногда решение подобных вопросов требует много времени. Надеемся, что Вы сможете восстановить доступ к аккаунту!<br>' +
		'[I][COLOR=rgb(127, 255, 0)]Рассмотрено[/COLOR][/I].[/CENTER][/FONT][/SIZE]',
		prefix: WATCHED_PREFIX,
		status: false,
	},
	{
		title: 'Имущество не может быть восстановлено',
		content:
		'[SIZE=4][FONT=Veranda][CENTER]Доброго времени суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Пожалуйста, убедительная просьба, ознакомьтесь с правилами восстановлений - [URL='https://forum.blackrussia.online/index.php?threads/В-каких-случаях-мы-не-восстанавливаем-игровое-имущество.25277/']клик[/URL].<br> Вы создали тему, которая не относится к технической проблеме.[/CENTER]<br><br>" +
		'[CENTER][I][COLOR=rgb(255,0,0)]Отказано[/COLOR][/I].[/CENTER][/FONT][/SIZE]',
		prefix: UNACCEPT_PREFIX,
		status: false,
	},
	{
		title: 'Отказ в изменении законопослушности',
		content:
		'[SIZE=4][FONT=Veranda][CENTER]Доброго времени суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		'[CENTER]К сожалению, администрация, технические специалисты и другие должностные лица на BLACK RUSSIA не могут повлиять на Вашу законопослушность.<br>Вы можете повысить свою законопослушность двумя способами:<BR><BR>1. Каждый PayDay (00 минут каждого часа) вам начисляется одно очко законопослушности(Если только у вас нету PLATINUM VIP-статуса), если за прошедший час вы отыграли не менее 20 минут.<br>2. Приобрести законопослушность в /donate.<BR>[/CENTER]'+
		'[CENTER][I][COLOR=rgb(255,0,0)]Отказано[/COLOR][/I].[/CENTER][/FONT][/SIZE]',
		prefix: UNACCEPT_PREFIX,
		status: false,
	},
	{
	title: "Баг со штрафами",
	color: '',
	content:
	'[SIZE=4][FONT=Verdana][CENTER]Доброго времени суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
	'[center]У вас произошла ошибка со штрафами, для её исправления вам нужно совершить проезд на красный свет, переехать через сплошную и оплатить все штрафы в банке.<br>Тогда данный баг пропадет, Команде Проекта известно о данной недоработке и активно ведется иправление.<br><br>' +
	'[CENTER][I][COLOR=rgb(255, 0, 0)]Закрыто[/COLOR][/I][/CENTER][/FONT][/SIZE]',
	prefix: CLOSE_PREFIX,
	status: false,
    },
    {
	title: 'Команде проекта',
	color: '',
	content:
	'[SIZE=4][FONT=Verdana][CENTER]Доброго времени суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
	"[CENTER]Ваша тема закреплена и находится на рассмотрении у команды проекта. Пожалуйста, ожидайте выноса вердикта разработчиков."+
	"[CENTER]Создавать новые темы с данной проблемой — не нужно, ожидайте ответа в данной теме. Если проблема решится - Вы всегда можете оставить своё сообщение в этой теме.<br>",
	prefix: COMMAND_PREFIX,
	status: true,
    },
    {
	title: 'Известно КП',
	color: '',
	content:
	'[SIZE=4][FONT=Verdana][CENTER]Доброго времени суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
	"[CENTER]Команде проекта уже известно о данной проблеме, она обязательно будет рассмотрена и исправлена. Спасибо за Ваше обращение!<br><br>" +
	'[CENTER][I][COLOR=rgb(139, 0, 0)]Закрыто[/COLOR][/I][/CENTER][/FONT][/SIZE]',
	prefix: CLOSE_PREFIX,
	status: false,
    },
    {
	title: 'пропали все темы из раздела Жалобы',
	color: '',
	content:
	'[SIZE=4][FONT=Verdana][CENTER]Доброго времени суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
	"[CENTER]Раздел 'Жалобы' переведен в приватный режим, а именно:<br>Тему созданную пользователем пожет видеть <b>он сам</b> и <b>Администрация сервера</b>.<br>Ознакомиться с формой подачи тем в тот или иной раздел можно по данной ссылке: [URL='https://forum.blackrussia.online/index.php?forums/Правила-подачи-жалоб.202/']клик[/URL]<br>Приятного времяпрепровождения на нашем форуме<br>[CENTER][I][COLOR=rgb(139, 0, 0)]Закрыто[/COLOR][/I][/CENTER][/FONT][/SIZE]",
	prefix: CLOSE_PREFIX,
	status: false,
    },
	{
	title: 'Слетел аккаунт',
	color: '',
	content:
	'[SIZE=4][FONT=Verdana][CENTER]Доброго времени суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
	"[CENTER]Аккаунт не может пропасть или аннулироваться просто так. Даже если Вы меняете ник, используете кнопки «починить игру» или «сброс настроек» - Ваш аккаунт не удаляется. Система работает иначе.<br><br>" +
	"[CENTER]Проверьте ввод своих данных: пароль, никнейм и сервер. Зачастую игроки просто забывают ввести актуальные данные и считают, что их аккаунт был удален. Будьте внимательны!" +
	'[CENTER]Как ввести никнейм (на случай, если сменили в игре, но не поменяли в клиенте): https://youtu.be/c8rhVwkoFaU [/CENTER] <br><br>' +
	'[CENTER][I]Рассмотрено[/I][/CENTER][/FONT][/SIZE]',
	prefix: CLOSE_PREFIX,
	status: false,
    },
    {
	title: 'ТЕСТЕРАМ',
	color: '',
	content:
	'[SIZE=4][FONT=Verdana][CENTER]Доброго времени суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
	"[CENTER]Ваша тема передана на тестирование.[/CENTER][/FONT][/SIZE]",
	prefix: WAIT_PREFIX,
	status: false,
    },
    {
	title: 'Ответ от ТЕСТЕРОВ',
	color: '',
	content:
	'[SIZE=4][FONT=Verdana][CENTER]Доброго времени суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
	'[CENTER]Ответ от тестерского отдела дан выше.<br><br>' +
	'[CENTER][I][COLOR=rgb(255, 0, 0)]Закрыто[/COLOR][/I][/CENTER][/FONT][/SIZE]',
	prefix: CLOSE_PREFIX,
	status: false,
    },
    {
	title: 'Пропали вещи с аукциона',
	color: '',
	content:
	'[SIZE=4][FONT=Verdana][CENTER]Доброго времени суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
	'[CENTER]Если вы выставили свои вещи на аукцион а их никто не купил, то воспользуйтесь командой [COLOR=rgb(251, 160, 38)]/reward[/COLOR]<br> В случае отсутствии вещей там, приложите скриншоты с + /time в новой теме<br>[CENTER][I][COLOR=rgb(139, 0, 0)]Закрыто[/COLOR][/I][/CENTER][/FONT][/SIZE]',
	prefix: CLOSE_PREFIX,
	status: false,
    },
	{
	title: "Проблемы с Кешом",
	content:
	'[SIZE=4][FONT=Verdana][CENTER]Доброго времени суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
	'[center]Если вы столкнулись с проблемой загрузки страниц форума, пожалуйста, выполните следующие действия:<br><br>• Откройте "Настройки".<br>• Найдите во вкладке "Приложения" свой браузер, через который вы пользуетесь нашим сайтом форума.<br>• Нажмите на браузер, после чего внизу выберите "Очистить" -> "Очистить Кэш".<br><br>После следуйте данным инструкциям:<br>• Перейдите в настройки браузера.<br>• Выберите "Конфиденциальность и безопасность" -> "Очистить историю".<br>• В основных и дополнительных настройках поставьте галочку в пункте "Файлы cookie и данные сайтов".<br>После этого нажмите "Удалить данные".<br><br>Ниже прилагаем видео-инструкции описанного процесса для разных браузеров:<br>Для браузера CHROME: https://youtu.be/FaGp2rRru9s<br>Для браузера OPERA: https://youtube.com/shorts/eJOxkc3Br6A?feature=share'+ 
	'[CENTER][I][COLOR=rgb(255, 0, 0)]Закрыто[/COLOR][/I][/CENTER][/FONT][/SIZE]',
	prefix: CLOSE_PREFIX,
	status: false,
    },
	{
        title: 'По проблемам с донатом',
        content:
        '[SIZE=4][FONT=Veranda][CENTER]Доброго времени суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
        '[CENTER]Если не были зачислены BLACK COINS — вероятнее всего, была допущена ошибка при вводе реквизитов. К нашему сожалению, из-за большого количества попыток обмана, мы перестали рассматривать подобные обращения. Для проверки зачисления BLACK COINS необходимо ввести в игре команду: /donat.<br><br>' +
        '[CENTER][I]Вам необходимо быть внимательными при осуществлении покупок.[/I]<br>' +
        '[CENTER]Если Вы считаете, что ошибки быть не может и с момента оплаты не прошло более 14 дней — в обязательном порядке обратитесь в службу поддержки для дальнейшего решения: На сайте через виджет обратной связи или посредством месенджеров: ВКонтакте: vk.com/br_tech, Telegram: t.me/br_techBot<br><br>' +
        '[CENTER][COLOR=rgb(255,0,0)]Закрыто[/COLOR].[/CENTER][/FONT][/SIZE]',
      prefix: DECIDED_PREFIX,
      status: false,
	},
	{
		title: 'Имущество будет восстановлено',
		content:
		'[SIZE=4][FONT=Veranda][CENTER]Доброго времени суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Ваше игровое имущество/денежные средства будут восстановлены в течение двух недель. <br>Убедительная просьба, <b><u>не менять никнейм до момента восстановления</u></b>.<br>" +
		'[CENTER]Для активации восстановления используйте команды:[COLOR=rgb(255, 213, 51)]/roulette[/COLOR], [COLOR=rgb(255, 213, 51)]/recovery[/COLOR].[/CENTER]<br>' +
		'[CENTER][COLOR=rgb(127, 255, 0)]Решено[/COLOR].[/CENTER][/FONT][/SIZE]',
		status: false,
		prefix: DECIDED_PREFIX,
	},
	{
		title: 'Ознакомьтесь с правилами восстановления',
		content:
		'[SIZE=4][FONT=Veranda][CENTER]Доброго времени суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Пожалуйста, убедительная просьба, ознакомьтесь с правилами восстановлений - [URL='https://forum.blackrussia.online/index.php?threads/В-каких-случаях-мы-не-восстанавливаем-игровое-имущество.25277/']клик[/URL].<br>Вы создали тему, которая не относится к технической проблеме.[/CENTER]<br><br>" +
		'[CENTER][I][COLOR=rgb(255,0,0)]Отказано[/COLOR][/CENTER][/I].[/FONT][/SIZE]',
		prefix: UNACCEPT_PREFIX,
		status: false,
	},
	{
		title: 'Переустановите игру',
		content:
		'[SIZE=4][FONT=Veranda][CENTER]Доброго времени суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Возможно в файлах вашей игры присутствуют постороннее оборудование(дополнения/изменения).<br>" +
		"[CENTER]Рекомендуется удалить полностью лаунчер и связанные с ним файлы и установить игру заново с официального сайта - [URL='https://blackrussia.online']Клик[/URL].<br>" +
		'[CENTER][I][COLOR=rgb(127, 255, 0)]Рассмотрено[/COLOR][/I].[/CENTER][/FONT][/SIZE]',
		prefix: DECIDED_PREFIX,
		status: false,
	},
	{
		title: 'Проблема решилась',
		content:
		'[SIZE=4][FONT=Veranda][CENTER]Доброго времени суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Благодарим Вас за поддержание обратной связи! Мы искренне рады за то, что Ваша проблема была решена и мы смогли помочь Вам.<br>Если Вы вновь столкнетесь с той или иной проблемой или же недоработкой — обязательно обращайтесь в технический раздел. Приятной игры!<br><br>" +
		'[CENTER][I][COLOR=rgb(0,255,0)]Решено[/COLOR][/I].[/CENTER][/FONT][/SIZE]',
		prefix: DECIDED_PREFIX,
		status: false,
	},
	{
		title: 'Передано команде проекта',
		content:
		'[SIZE=4][FONT=Veranda][CENTER]Доброго времени суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Ваша тема закреплена и находится на рассмотрении у команды проекта. Пожалуйста, ожидайте выноса вердикта разработчиков."+
		"[CENTER]Создавать новые темы с данной проблемой — не нужно, ожидайте ответа в данной теме. Если проблема решится - Вы всегда можете оставить своё сообщение в этой теме.<br>",
		prefix: COMMAND_PREFIX,
		status: true,
	},
	{
		title: 'Проблема известна команде проекта',
		content:
		'[SIZE=4][FONT=Veranda][CENTER]Доброго времени суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Команде проекта уже известно о данной проблеме, она обязательно будет рассмотрена и исправлена. Спасибо за Ваше обращение!<br><br>" +
		'[CENTER][I][COLOR=rgb(255,0,0)]Закрыто[/COLOR][/I].[/CENTER][/FONT][/SIZE]',
		prefix: CLOSE_PREFIX,
		status: false,
	},
	{
		title: 'Не является багом',
		content:
		'[SIZE=4][FONT=Veranda][CENTER]Доброго времени суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		'[CENTER]Проблема, с которой Вы столкнулись, не является багом/ошибкой сервера.<br><br>[CENTER][I][COLOR=rgb(255, 0, 0)]Закрыто[/COLOR][/I].[/CENTER][/FONT][/SIZE]',
		prefix: UNACCEPT_PREFIX,
		status: false,
	},
	{
		title: 'Сервер не отвечает',
		content:
		'[SIZE=4][FONT=Veranda][CENTER]Доброго времени суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
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
 
		"[CENTER]📹 Включение продемонстрировано на видео: https://youtu.be/Wft0j69b9dk<br>[CENTER][I][COLOR=rgb(255,0,0)]Закрыто[/COLOR][/I].[/CENTER][/FONT][/SIZE]",
		prefix: CLOSE_PREFIX,
		status: false,
	},
    {
        title: 'Кикнули за ПО',
        content:
        '[SIZE=4][FONT=Veranda][CENTER]Доброго времени суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
        '[CENTER]Уважаемый игрок, если вы были отключены от сервера Античитом<br><br>[COLOR=rgb(255, 0, 0)]Пример[/COLOR]:<br><br> [IMG]https://i.ibb.co/FXXrcVS/image.png[/IMG],<br>пожалуйста, обратите внимания на значения PacketLoss и Ping.<br><br>PacketLoss - минимальное значение 0.000000, максимальное 1.000000. При показателе, выше нуля, это означает, что у вас происходит задержка/потеря передаваемых пакетов информации на сервер. Это означает, что ваш интернет не передает достаточное количество данных из вашего устройства на наш сервер, в следствие чего система отключает вас от игрового процесса.<br><br>Ping - Чем меньше значение в данном пункте, тем быстрее передаются данные на сервер, и наоборот. Если значение выше 100, вы можете наблюдать отставания в игровом процессе из-за нестабильности интернет-соединения.<br><br>Если вы не заметили проблем в данных пунктах, скорее всего - у вас произошел скачек пинга при выполнении действия в игре, в таком случае, античит также отключает игрока из-за подозрения в использовании посторонних программ.<br><br>Решение данной проблемы: постарайтесь стабилизировать ваше интернет-соединение, при необходимости - сообщите о проблемах своему провайдеру (поставщику услуг интернета).<br>[CENTER][COLOR=rgb(255, 0, 0)]Закрыто.[/COLOR][/CENTER][/FONT][/SIZE]',
        prefix: CLOSE_PREFIX,
        status: false,
	},
	{
		title: 'Исчезла статистика аккаунта',
		content:
		'[SIZE=4][FONT=Veranda][CENTER]Доброго времени суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Аккаунт не может пропасть или аннулироваться просто так. Даже если Вы меняете ник, используете кнопки «починить игру» или «сброс настроек» - Ваш аккаунт не удаляется. Система работает иначе.<br><br>" +
		"[CENTER]Проверьте ввод своих данных: пароль, никнейм и сервер. Зачастую игроки просто забывают ввести актуальные данные и считают, что их аккаунт был удален. Будьте внимательны!" +
		'[CENTER]Как ввести никнейм (на случай, если сменили в игре, но не поменяли в клиенте): https://youtu.be/c8rhVwkoFaU [/CENTER] <br><br>' +
		'[CENTER][I]Рассмотрено[/I].[/CENTER][/FONT][/SIZE]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
	{
		title: 'Сим карта',
		content:
		'[SIZE=4][FONT=Veranda][CENTER]Доброго времени суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +	"[CENTER] Если вы приобрели тариф [COLOR=rgb(0,0,0)] Black [/COLOR] [COLOR=rgb(255,0,0)]Russia[/COLOR], но награды  [COLOR=rgb(255, 247, 0)][U]не были зачислены[/U][/COLOR] или у Вас  [COLOR=rgb(255, 247, 0)][U]не получается активировать номер[/U][/COLOR] с тарифом [COLOR=rgb(0,0,0)] Black [/COLOR] [COLOR=rgb(255,0,0)]Russia[/COLOR], тогда [I]убедитесь в следующем:[/I]<br> 1. У вас тариф [COLOR=rgb(0,0,0)] Black [/COLOR] [COLOR=rgb(255,0,0)]Russia[/COLOR], а не другой тариф, например, тариф [COLOR=rgb(0,0,0)] Black[/COLOR]. <br> 2. Номер активирован. <br> 3. После активации номера [U]прошло более 48-ми часов.[/U] <br><br>Если пункты выше не описывают вашу ситуацию в обязательном порядке [COLOR=rgb(0, 255, 9)]обратитесь в службу поддержки[/COLOR] [I]для дальнейшего решения:[/I] <br>На сайте через виджет обратной связи или посредством месенджеров: ВКонтакте: vk.com/br_tech, Telegram: t.me/br_techBot<br>" +
		'[I][COLOR=rgb(127, 255, 0)]Рассмотрено[/COLOR][/I].[/CENTER][/FONT][/SIZE]',
		prefix: WATCHED_PREFIX,
		status: false,
	},
	{
	    title: 'Не грузит форум',
	    color: '',
	    content:
	    '[SIZE=4][FONT=Verdana][CENTER]Доброго времени суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
	    '[center]Если вы столкнулись с проблемой загрузки страниц форума, пожалуйста, выполните следующие действия:<br><br>• Откройте "Настройки".<br>• Найдите во вкладке "Приложения" свой браузер, через который вы пользуетесь нашим сайтом форума.<br>• Нажмите на браузер, после чего внизу выберите "Очистить" -> "Очистить Кэш".<br><br>После следуйте данным инструкциям:<br>• Перейдите в настройки браузера.<br>• Выберите "Конфиденциальность и безопасность" -> "Очистить историю".<br>• В основных и дополнительных настройках поставьте галочку в пункте "Файлы cookie и данные сайтов".<br>После этого нажмите "Удалить данные".<br><br>Ниже прилагаем видео-инструкции описанного процесса для разных браузеров:<br>Для браузера CHROME: https://youtu.be/FaGp2rRru9s<br>Для браузера OPERA: https://youtube.com/shorts/eJOxkc3Br6A?feature=share'+ 
	    '[CENTER][I][COLOR=rgb(255, 0, 0)]Закрыто[/COLOR][/I][/CENTER][/FONT][/SIZE]',
	    prefix: CLOSE_PREFIX,
	    status: false, 
	},
	];
 
	$(document).ready(() => {
	// Загрузка скрипта для обработки шаблонов
	$('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');
 
	// Добавление кнопок при загрузке страницы
	addButton('На рассмотрение', 'pin','border-radius: 20px; margin-right: 11px; border: 2px solid; border-color: rgb(255, 173, 51, 0.5);');
	addButton('КП', 'teamProject','border-radius: 20px; margin-right: 100x; border: 2px solid;  border-color: rgb(255, 240, 110, 0.5);');
	addButton('Рассмотрено', 'watched','border-radius: 13px; margin-right: 5px; border: 2px solid;  border-color: rgb(110, 192, 113, 0.5)');
	addButton('Отказано', 'unaccept','border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(220, 89, 89, 0.5);' );
	addButton('Решено', 'decided','border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(110, 192, 113, 0.5);');
	addButton('Закрыто', 'closed','border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(220, 89, 89, 0.5);');
	addButton('Тех. спецу', 'techspec', 'techspec', 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(17, 92, 208, 0.5);');
	addButton('CLOSE', 'closed_complaint','border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(220, 89, 89, 0.5);');
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
		
		function addButton(name, id, hex = "grey") {
		$('.button--icon--reply').before(
		`<button type="button" class="button--primary button rippleButton" id="${id}" style="border-radius: 25px; margin-right: 5px; background-color: ${hex}">${name}</button>`,
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