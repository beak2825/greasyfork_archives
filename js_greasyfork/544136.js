// ==UserScript==
// @name         Форумный скрипт для технического специалиста
// @namespace    https://forum.blackrussia.online
// @version      1.2
// @description  50 perm
// @author       no
// @match        https://forum.blackrussia.online/*
// @include      https://forum.blackrussia.online/
// @license      Kumiho on avtor
// @icon         https://i.yapx.ru/ViO6c.png
// @downloadURL
// @updateURL
// @downloadURL https://update.greasyfork.org/scripts/544136/%D0%A4%D0%BE%D1%80%D1%83%D0%BC%D0%BD%D1%8B%D0%B9%20%D1%81%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D1%82%D0%B5%D1%85%D0%BD%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%BE%D0%B3%D0%BE%20%D1%81%D0%BF%D0%B5%D1%86%D0%B8%D0%B0%D0%BB%D0%B8%D1%81%D1%82%D0%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/544136/%D0%A4%D0%BE%D1%80%D1%83%D0%BC%D0%BD%D1%8B%D0%B9%20%D1%81%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D1%82%D0%B5%D1%85%D0%BD%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%BE%D0%B3%D0%BE%20%D1%81%D0%BF%D0%B5%D1%86%D0%B8%D0%B0%D0%BB%D0%B8%D1%81%D1%82%D0%B0.meta.js
// ==/UserScript==

(function () {
	'use strict';
	const PIN_PREFIX = 2; //  префикс закрепить
	const COMMAND_PREFIX = 10; // команде проекта
	const CLOSE_PREFIX = 7; // префикс закрыто
	const DECIDED_PREFIX = 6; // префикс решено
	const TECHADM_PREFIX = 13 // теху администратору
	const WATCHED_PREFIX = 9; // рассмотрено
	const WAIT_PREFIX = 14; // ожидание (для переноса в баг-трекер)
    const ACCEPT_PREFIX = 8; // префикс одобрено (жб на игроков)
    const UNACCEPT_PREFIX = 4; // префикс Закрыто (жб на игроков)
	const TRANSFER_PREFIX1 = 16; // перенос в тр
    const TRANSFER_PREFIX2 = 17; // перенос в жб на тех
    const TRANSFER_PREFIX3 = 18; // перенос в жб на адм
    const TRANSFER_PREFIX4 = 19; // перенос в жб на игроков
    const TRANSFER_PREFIX5 = 20; // перенос в жб на лидеров
    const TRANSFER_PREFIX6 = 21; // перенос в обжалования
    const NO_PREFIX = 0;
	const buttons = [
	{
		title: 'ОТВЕТ',
		content:
		"[CENTER][IMG width=695px]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/IMG]<br>"+
        '[CENTER]<br>' +
		'[SIZE=4][FONT=Veranda][CENTER][COLOR=#FF8800]{{ greeting }}, уважаемый[/COLOR][B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		'[CENTER]ТЕКСТ[/CENTER][/FONT][/SIZE]'+

        '[CENTER]<br>' ,
	},
	{
        title: '|-(-->--> Для направления логирования <--<--)-|',
        color: 'oswald: 3px; color: #FFFF00; background: #000000; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #FFFF00',
	},

	{
		title: 'На рассмотрение',
		content:
        "[CENTER][IMG width=695px]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/IMG]<br>"+
        '[CENTER]<br>' +
		'[SIZE=4][FONT=Veranda][CENTER][COLOR=#FF8800]{{ greeting }}, уважаемый[/COLOR][B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
        '[CENTER]<br>' +
		'[CENTER]Ваша тема взята на рассмотрение, ожидайте ответ в ближайшее время<br>Часто рассмотрение темы может занять определенное время.<br>[CENTER][COLOR=rgb(255, 255, 0)]На рассмотрении[/COLOR][/CENTER][/FONT][/SIZE]'+
        '[CENTER]<br>' ,
        prefix: TECHADM_PREFIX,
		status: true,
	},
	{
		title: 'Передано руководству',
		content:
       "[CENTER][IMG width=695px]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/IMG]<br>"+
        '[CENTER]<br>' +
		'[SIZE=4][FONT=Veranda][CENTER][COLOR=#FF8800]{{ greeting }}, уважаемый[/COLOR][B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
        '[CENTER]<br>' +
		"[CENTER]Ваша тема закреплена и ожидает вердикта Заместителя Куратора Технических Специалистов и / или Куратора Технических Специалистов.<br>" +
		'[CENTER]<u>Создавать подобные темы не нужно</u>.<br>[CENTER][COLOR=rgb(255, 255, 0)]На рассмотрении[/COLOR][/CENTER][/FONT][/SIZE]'+
        '[CENTER]<br>' ,
		prefix: PIN_PREFIX,
		status: true,
	},
	{
		title: 'Дубликат',
		content:
       "[CENTER][IMG width=695px]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/IMG]<br>"+
        '[CENTER]<br>' +
		'[SIZE=4][FONT=Veranda][CENTER][COLOR=#FF8800]{{ greeting }}, уважаемый[/COLOR][B] {{ user.mention }}[/B]![/CENTER]<br><br>' +

        '[CENTER]<br>' +
		"[CENTER]Данная тема является <u>дубликатом вашей предыдущей темы</u>.<br>Пожалуйста, <u><b>прекратите создавать идентичные или похожие темы - иначе Ваш форумный аккаунт может быть заблокирован</b></u>.<br><br>" +
		'[CENTER][I][COLOR=rgb(255, 0, 0)]Закрыто[/COLOR][/I].[/CENTER][/FONT][/SIZE]'+

        '[CENTER]<br>' ,
		prefix: CLOSE_PREFIX,
		status: false,
	},
{
		title: 'Правила раздела',
		content:
       "[CENTER][IMG width=695px]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/IMG]<br>"+
        '[CENTER]<br>' +
		'[SIZE=4][FONT=Veranda][CENTER][COLOR=#FF8800]{{ greeting }}, уважаемый[/COLOR][B] {{ user.mention }}[/B]![/CENTER]<br><br>' +

        '[CENTER]<br>' +
		"[CENTER]Пожалуйста, убедительная просьба, ознакомиться с назначением данного раздела в котором Вы создали тему, так как Ваш запрос не относится к жалобам на технических специалистов.<br>Что принимается в данном разделе:<br>Жалобы на технических специалистов, оформленные по форме подачи и не нарушающие правила подачи:<br> [FONT=verdana][SIZE=7][COLOR=rgb(226, 80, 65)][U]Правила подачи жалобы на технических специалистов[/U][/COLOR][/SIZE][/FONT][/CENTER]<br><br>[QUOTE][FONT=verdana][SIZE=4][COLOR=rgb(226, 80, 65)]01.[/COLOR] Ваш игровой никнейм:[FONT=verdana][SIZE=4][COLOR=rgb(226, 80, 65)]<br>02.[/COLOR] Игровой никнейм технического специалиста:[COLOR=rgb(226, 80, 65)]<br>03.[/COLOR] Сервер, на котором Вы играете:[COLOR=rgb(226, 80, 65)]<br>04.[/COLOR] Описание ситуации (описать максимально подробно и раскрыто):[COLOR=rgb(226, 80, 65)]<br>05.[/COLOR] Любые скриншоты, которые могут помочь в решении проблемы (если таковые имеются):[COLOR=rgb(226, 80, 65)]<br>06.[/COLOR] Дата и время произошедшей технической проблемы (постарайтесь указать максимально точно):[/SIZE][/FONT][/SIZE][/QUOTE]<br><br>[FONT=verdana][SIZE=4][FONT=verdana][SIZE=4][COLOR=rgb(226, 80, 65)]Примечание:[/COLOR] все оставленные заявки обращения в данный раздел обязательно должны быть составлены по шаблону предоставленному немного выше.<br>В ином случае, заявки обращения в данный раздел составленные не по форме — будут отклоняться.<br>Касательно названия заголовка темы — четких правил нет, но, желательно чтобы оно содержало лишь никнейм и сервер технического специалиста.<br>Заранее, настоятельно рекомендуем ознакомиться [U][B][URL='https://forum.blackrussia.online/index.php?forums/faq.231/']с данным разделом[/URL][/B][/U].[/SIZE][/FONT][/SIZE][/FONT]<br>[CENTER][FONT=verdana][SIZE=7][COLOR=rgb(226, 80, 65)][U]Какие жалобы не проверяются?[/U][/COLOR][/SIZE][/FONT][/CENTER]<br><br>[FONT=verdana][SIZE=4][COLOR=rgb(226, 80, 65)]—[/COLOR] Если в содержании темы присутствует оффтоп/оскорбления.<br>[SIZE=4][COLOR=rgb(226, 80, 65)]—[/COLOR] Если в заголовке темы отсутствует никнейм технического специалиста.<br>[COLOR=rgb(226, 80, 65)]—[/COLOR] С момента выдачи наказания прошло более 7 дней.[/SIZE][/SIZE][/FONT]<br>" +
		'[CENTER][I][COLOR=rgb(255,0,0)]Закрыто[/COLOR][/I].[/CENTER][/FONT][/SIZE]'+

        '[CENTER]<br>' ,
		prefix: CLOSE_PREFIX,
		status: false,
	},
	{
		title: 'Форма подачи',
		content:
       "[CENTER][IMG width=695px]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/IMG]<br>"+
        '[CENTER]<br>' +
		'[SIZE=4][FONT=Veranda][CENTER][COLOR=#FF8800]{{ greeting }}, уважаемый[/COLOR][B] {{ user.mention }}[/B]![/CENTER]<br><br>' +

        '[CENTER]<br>' +
		"[CENTER]Пожалуйста, заполните форму, создав новую тему: Название темы с NickName технического специалиста<br>Пример:<br> Lev_Kalashnikov | махинации<br>Форма заполнения темы:<br>[code]01. Ваш игровой никнейм:<br>02. Игровой никнейм технического специалиста:<br>03. Сервер, на котором Вы играете:<br>04. Описание ситуации (описать максимально подробно и раскрыто):<br>05. Любые скриншоты, которые могут помочь в решении проблемы (если таковые имеются):<br>06. Дата и время произошедшей технической проблемы (постарайтесь указать максимально точно):[/code]<br>" +
		'[CENTER][I][COLOR=rgb(255,0,0)]Закрыто[/COLOR][/I].[/CENTER][/FONT][/SIZE]'+

        '[CENTER]<br>' ,
		prefix: CLOSE_PREFIX,
		status: false,
	},
{
		title: 'Не относится',
		content:
       "[CENTER][IMG width=695px]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/IMG]<br>"+
        '[CENTER]<br>' +
		'[SIZE=4][FONT=Veranda][CENTER][COLOR=#FF8800]{{ greeting }}, уважаемый[/COLOR][B] {{ user.mention }}[/B]![/CENTER]<br><br>' +

        '[CENTER]<br>' +
		"[CENTER]Ваше обращение не относится к жалобам на технических специалистов.<br> Пожалуйста ознакомьтесь с правилами данного раздела: [URL='https://forum.blackrussia.online/forums/Информация-для-игроков.231/']клик[/URL] <br>" +
		'[CENTER][I][COLOR=rgb(255,0,0)]Закрыто[/COLOR][/I].[/CENTER][/FONT][/SIZE]'+

        '[CENTER]<br>' ,
		prefix: CLOSE_PREFIX,
		status: false,
	},
{
		title: 'Нет окна бана',
		content:
       "[CENTER][IMG width=695px]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/IMG]<br>"+
        '[CENTER]<br>' +
		'[SIZE=4][FONT=Veranda][CENTER][COLOR=#FF8800]{{ greeting }}, уважаемый[/COLOR][B] {{ user.mention }}[/B]![/CENTER]<br><br>' +

        '[CENTER]<br>' +
		"[CENTER]Без окна о блокировке тема не подлежит рассмотрению - создайте новую тему, приложив окно блокировки с фото-хостинга<br>[URL='https://yapx.ru/']yapx.ru[/URL],<br>[URL='https://imgur.com/']imgur.com[/URL],<br>[URL='https://www.youtube.com/']youtube.com[/URL],<br>[URL='https://imgbb.com']ImgBB.com[/URL]<br>(все кликабетильно).<br>" +
		'[CENTER][CENTER][COLOR=rgb(255, 0, 0)]Закрыто[/COLOR].[/CENTER][/FONT][/SIZE]'+

        '[CENTER]<br>' ,
		prefix: CLOSE_PREFIX,
		status: false,
	},
	{
		title: 'Срок подачи жб',
		content:
       "[CENTER][IMG width=695px]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/IMG]<br>"+
        '[CENTER]<br>' +
		'[SIZE=4][FONT=Veranda][CENTER][COLOR=#FF8800]{{ greeting }}, уважаемый[/COLOR][B] {{ user.mention }}[/B]![/CENTER]<br><br>' +

        '[CENTER]<br>' +
		'[CENTER]С момента выдачи наказания от технического специалиста прошло более 14-ти дней.<br>Пересмотр/изменение меры наказания новозможно, вы можете попробывать написать обжалование через N-ый промежуток времени.<br><br>Обращаем ваше внимание на то, что некоторые наказания не подлежат не обжалованию,амнистии.[/center]<br><br>'+
		'[CENTER][I][COLOR=rgb(255,0,0)]Закрыто[/COLOR][/I].[/CENTER][/FONT][/SIZE]'+

        '[CENTER]<br>' ,
		prefix: CLOSE_PREFIX,
		status: false,
	},
	{
		title: 'Не обжалуется',
		content:
       "[CENTER][IMG width=695px]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/IMG]<br>"+
        '[CENTER]<br>' +
		'[SIZE=4][FONT=Veranda][CENTER][COLOR=#FF8800]{{ greeting }}, уважаемый[/COLOR][B] {{ user.mention }}[/B]![/CENTER]<br><br>' +

        '[CENTER]<br>' +
		"[CENTER]Блокировка вашего аккаунта содержит серьёзное нарушение правил сервера.<br>Вы получили блокировку за серьезное нарушение, мы не в силах снизить срок вашего наказания/обнулить/амнистировать вас.<br>" +
		'[CENTER][I][COLOR=rgb(255,0,0)]Закрыто[/COLOR][/I].[/CENTER][/FONT][/SIZE]'+

        '[CENTER]<br>' ,
		prefix: CLOSE_PREFIX,
		status: false,
	},
	{
		title: 'Док-ва на отсутствие трансфера',
		content:
       "[CENTER][IMG width=695px]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/IMG]<br>"+
        '[CENTER]<br>' +
		'[SIZE=4][FONT=Veranda][CENTER][COLOR=#FF8800]{{ greeting }}, уважаемый[/COLOR][B] {{ user.mention }}[/B]![/CENTER]<br><br>' +

        '[CENTER]<br>' +
		'[CENTER] Доказать отсутствие трансфера можно исключительно одним способом.<br>Вы должны взять 2 устройства, зайти на аккаунты и сделать фотографию окон блокировки на двух устройствах.<br><br><u>Важно, чтобы в кадр попало 2 устройства и окна блокировки.</u><br>Ожидаю вашего ответа. [/CENTER]<br><br>'+
		'[CENTER][COLOR=rgb(255, 255, 0)]На рассмотрении[/COLOR][/CENTER][/FONT][/SIZE]'+

        '[CENTER]<br>' ,
		prefix: TECHADM_PREFIX,
		status: true,
	},
	{
		title: 'Срок блокировки будет снижен',
		content:
       "[CENTER][IMG width=695px]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/IMG]<br>"+
        '[CENTER]<br>' +
		'[SIZE=4][FONT=Veranda][CENTER][COLOR=#FF8800]{{ greeting }}, уважаемый[/COLOR][B] {{ user.mention }}[/B]![/CENTER]<br><br>' +

        '[CENTER]<br>' +
		"[CENTER]Проверив вашу историю наказаний, было принято решение о снижении срока блокировки аккаунта.<br>Будьте аккуратнее в следующие разы, ведь на встречу пойти мы врятли сможем.<br>" +
		'[CENTER][CENTER][COLOR=rgb(255, 0, 0)]Закрыто[/COLOR].[/CENTER][/FONT][/SIZE]'+

        '[CENTER]<br>' ,
		prefix: CLOSE_PREFIX,
		status: false,
	},
    {
		title: 'Вам в технический раздел',
		content:
       "[CENTER][IMG width=695px]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/IMG]<br>"+
        '[CENTER]<br>' +
		'[SIZE=4][FONT=Veranda][CENTER][COLOR=#FF8800]{{ greeting }}, уважаемый[/COLOR][B] {{ user.mention }}[/B]![/CENTER]<br><br>' +

        '[CENTER]<br>' +
		"[CENTER]Ваша тема не как не относится к жалобам на технических специалистов, обратитесь с данной темой в <u>технический раздел вашего сервера</u> - [URL='https://forum.blackrussia.online/index.php?forums/Технический-раздел.22/']клик[/URL]<br><br>" +
		'[CENTER][I][COLOR=rgb(255,0,0)]Закрыто[/COLOR][/I].[/CENTER][/FONT][/SIZE]'+

        '[CENTER]<br>' ,
		prefix: CLOSE_PREFIX,
		status: false,
	},
   {
        title: 'Запрос привязок',
		content:
       "[CENTER][IMG width=695px]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/IMG]<br>"+
       '[CENTER]<br>' +
       '[SIZE=4][FONT=Veranda][CENTER][COLOR=#FF8800]{{ greeting }}, уважаемый[/COLOR][B] {{ user.mention }}[/B]![/CENTER]<br><br>'+
       '[CENTER]<br>' +
       '[CENTER]Для проверки, вам нужно прикрепить ссылки на привязки Gmail, VK и Telegram, следуйте этим шагам:<br>' +
       '[CENTER]<br>' +
       '[CENTER][SIZE=5][B]Для привязки Gmail:[/SIZE][/B]<br>' +
       '[CENTER]<br>' +
       '[CENTER]*Откройте ваш аккаунт Google (Gmail).<br>' +
       '[CENTER]*Перейдите в настройки Gmail (иконка шестерёнки в правом верхнем углу).<br>' +
       '[CENTER]*В разделе [B]"Аккаунты и импорт"[/B] выберите [B]"Изменить настройки доступа"[/B].<br>' +
       '[CENTER]*Здесь вы сможете добавить свой аккаунт Gmail или привязать другой аккаунт, если это необходимо.<br>' +
       '[CENTER]<br>' +
       '[CENTER]Если вам нужно прикрепить ссылку на ваш Gmail в профиле игры, достаточно вставить ссылку в формате: mailto:[EMAIL]example@gmail.com[/EMAIL].<br>' +
       '[CENTER]<br>' +
       '[CENTER][SIZE=5][B]Для привязки VK (ВКонтакте):[/SIZE][/B]<br>' +
       '[CENTER]<br>' +
       '[CENTER]*Откройте ваш аккаунт ВКонтакте.<br>' +
       '[CENTER]*Перейдите в настройки профиля (иконка в виде трёх точек или шестерёнки в правом верхнем углу).<br>' +
       '[CENTER]*В разделе [B]"Личная информация"[/B] найдите поле, в котором вы можете добавить ссылку на ваш профиль.<br>' +
       '[CENTER]*Скопируйте ссылку на свой профиль, которая будет выглядеть как https://vk.com/username.<br>' +
       '[CENTER]<br>' +
       '[CENTER][SIZE=5][B]Для привязки Telegram:[/SIZE][/B]<br>' +
       '[CENTER]<br>' +
       '[CENTER]*Откройте приложение Telegram.<br>' +
       '[CENTER]*Перейдите в свой профиль (нажмите на ваше имя или фотографию).<br>' +
       '[CENTER]*В вашем профиле будет указана ссылка на ваш Telegram, которая будет выглядеть как https://t.me/username.<br>' +
       '[CENTER]*Скопируйте эту ссылку.<br>' +
       '[CENTER]<br>' +
       '[CENTER][COLOR=rgb(255, 255, 0)]На рассмотрении[/COLOR][/CENTER][/FONT][/SIZE]'+
       '[CENTER]<br>' ,
        prefix: TECHADM_PREFIX,
		status: true,
},
{
		title: 'Имущество будет восстановлено',
		content:
       "[CENTER][IMG width=695px]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/IMG]<br>"+
        '[CENTER]<br>' +
		'[SIZE=4][FONT=Veranda][CENTER][COLOR=#FF8800]{{ greeting }}, уважаемый[/COLOR][B] {{ user.mention }}[/B]![/CENTER]<br><br>' +

        '[CENTER]<br>' +
		"[CENTER]Ваше игровое имущество/денежные средства будут восстановлены в течение двух недель. <br>Убедительная просьба, <b><u>не менять никнейм до момента восстановления</u></b>.<br>" +
		'[CENTER]Для активации восстановления используйте команды: [COLOR=rgb(255, 213, 51)]/roulette[/COLOR], [COLOR=rgb(255, 213, 51)]/recovery[/COLOR].[/CENTER]<br>' +
		'[CENTER][COLOR=rgb(255, 255, 0)]На рассмотрении[/COLOR].[/CENTER][/FONT][/SIZE]'+

        '[CENTER]<br>' ,
		status: false,
		prefix: COMMAND_PREFIX,
	},
	{
		title: 'Имущество не будет восстановлено',
		content:
       "[CENTER][IMG width=695px]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/IMG]<br>"+
        '[CENTER]<br>' +
		'[SIZE=4][FONT=Veranda][CENTER][COLOR=#FF8800]{{ greeting }}, уважаемый[/COLOR][B] {{ user.mention }}[/B]![/CENTER]<br><br>' +

        '[CENTER]<br>' +
		"[CENTER]Пожалуйста, убедительная просьба, ознакомьтесь с правилами восстановлений - [URL='https://forum.blackrussia.online/index.php?threads/В-каких-случаях-мы-не-восстанавливаем-игровое-имущество.25277/']клик[/URL].<br> Вы создали тему, которая не относится к технической проблеме.[/CENTER]<br><br>" +
		'[CENTER][I][COLOR=rgb(255,0,0)]Закрыто[/COLOR][/I].[/CENTER][/FONT][/SIZE]'+

        '[CENTER]<br>' ,
		prefix: CLOSE_PREFIX,
		status: false,
	},
	{
		title: 'Аккаунт игрока будет заблокирован',
		content:
       "[CENTER][IMG width=695px]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/IMG]<br>"+
        '[CENTER]<br>' +
		'[SIZE=4][FONT=Veranda][CENTER][COLOR=#FF8800]{{ greeting }}, уважаемый[/COLOR][B] {{ user.mention }}[/B]![/CENTER]<br><br>' +

        '[CENTER]<br>' +
		"[CENTER][SIZE=4][FONT=Veranda]После тщательной проверки вашего обращения, доказательств, а также системы логирования выношу вердикт:<br><br>[COLOR=#00FF00][FONT=verdana]Игрок будет заблокирован[/COLOR].[/CENTER]<br><br>" +
		"[CENTER][SIZE=4][FONT=Veranda][I][COLOR=rgb(255, 0, 0)]Одобрено[/COLOR][/I].[/FONT][/CENTER]<br>"+

        '[CENTER]<br>' ,
		prefix: ACCEPT_PREFIX,
        status: false,
	},
	{
		title: 'Аккаунт игрока не будет заблокирован',
		content:
       "[CENTER][IMG width=695px]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/IMG]<br>"+
        '[CENTER]<br>' +
		'[SIZE=4][FONT=Veranda][CENTER][COLOR=#FF8800]{{ greeting }}, уважаемый[/COLOR][B] {{ user.mention }}[/B]![/CENTER]<br><br>' +

        '[CENTER]<br>' +
		"[CENTER][SIZE=4][FONT=Veranda]После тщательной проверки вашего обращения, доказательств, а также системы логирования выношу вердикт:<br><br>[COLOR=#00FF00][FONT=verdana]Игрок не будет заблокирован[/COLOR].[/CENTER]<br><br>" +
		"[CENTER][SIZE=4][FONT=Veranda][I][COLOR=rgb(255, 0, 0)]Отказано[/COLOR][/I].[/FONT][/CENTER]<br>" +

        '[CENTER]<br>' ,
        prefix: UNACCEPT_PREFIX,
        status: false,
     	},
        {
        title: '|-(-->-->--> Перенаправление в раздел <--<--<--)-|',
        color: 'oswald: 3px; color: #FFFF00; background: #000000; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #FFFF00',
	},
         {
		title: 'Вам в тех раздел 34',
		content:
       "[CENTER][IMG width=695px]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/IMG]<br>"+
        '[CENTER]<br>' +
		'[SIZE=4][FONT=Veranda][CENTER][COLOR=#FF8800]{{ greeting }}, уважаемый[/COLOR][B] {{ user.mention }}[/B]![/CENTER]<br><br>' +

        '[CENTER]<br>' +
		'[CENTER]Вы ошиблись разделом, вам необходимо обратиться в технический раздел.<br> Переношу ваше обращение в необходимый раздел.<br><br>' +
		'[CENTER][I][COLOR=rgb(255, 255, 0)]На рассмотрении[/COLOR][/I].[/CENTER][/FONT][/SIZE]'+

        '[CENTER]<br>' ,
		prefix: TRANSFER_PREFIX1,
		status: false,
	},
        {
		title: 'Вам в жб на тех 34',
		content:
       "[CENTER][IMG width=695px]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/IMG]<br>"+
        '[CENTER]<br>' +
		'[SIZE=4][FONT=Veranda][CENTER][COLOR=#FF8800]{{ greeting }}, уважаемый[/COLOR][B] {{ user.mention }}[/B]![/CENTER]<br><br>' +

        '[CENTER]<br>' +
		'[CENTER]Вы получили наказание от технического специалиста Вашего сервера.<br>Переношу ваше обращение в необходимый раздел.<br><br>' +
		'[CENTER][I][COLOR=rgb(255, 255, 0)]На рассмотрении[/COLOR][/I].[/CENTER][/FONT][/SIZE]'+

        '[CENTER]<br>' ,
		prefix: TRANSFER_PREFIX2,
		status: false,
	},
{
		title: 'Вам в жб на адм.',
		content:
        "[CENTER][IMG width=695px]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/IMG]<br>"+
        '[CENTER]<br>' +
		'[SIZE=4][FONT=Veranda][CENTER][COLOR=#FF8800]{{ greeting }}, уважаемый[/COLOR][B] {{ user.mention }}[/B]![/CENTER]<br><br>' +

        '[CENTER]<br>' +
        '[CENTER]Вы получили наказание которое не относится к технической части, оно относится к Административной части.<br> Переношу ваше обращение в необходимый раздел.<br><br>' +
 		'[CENTER][I][COLOR=rgb(255, 255, 0)]На рассмотрении[/COLOR][/I].[/CENTER][/FONT][/SIZE]'+

        '[CENTER]<br>' ,
	  prefix: TRANSFER_PREFIX3,
	  status: false,
	},
	{
		title: 'Вам в жб на игроков',
		content:
       "[CENTER][IMG width=695px]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/IMG]<br>"+
        '[CENTER]<br>' +
		'[SIZE=4][FONT=Veranda][CENTER][COLOR=#FF8800]{{ greeting }}, уважаемый[/COLOR][B] {{ user.mention }}[/B]![/CENTER]<br><br>' +

        '[CENTER]<br>' +
		'[CENTER]Данная тема не относится к техническому разделу.<br>Данное действие было совершено игроком и нарушает правила сервера.<br> Переношу ваше обращение в раздел жалоб на игроков вашего сервера.<br>'+
		'[CENTER][I][COLOR=rgb(255, 255, 0)]На рассмотрении[/COLOR][/I].[/CENTER][/FONT][/SIZE]'+

        '[CENTER]<br>' ,
	  prefix: TRANSFER_PREFIX4,
	  status: false,
	},
    {
		title: 'Вам в жб на лд',
		content:
       "[CENTER][IMG width=695px]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/IMG]<br>"+
        '[CENTER]<br>' +
		'[SIZE=4][FONT=Veranda][CENTER][COLOR=#FF8800]{{ greeting }}, уважаемый[/COLOR][B] {{ user.mention }}[/B]![/CENTER]<br><br>' +

        '[CENTER]<br>' +
		'[CENTER]Данная тема не относится к техническому разделу.<br>Данные действия были совершены лидером и нарушают правила сервера.<br> Переношу ваше обращение в раздел жалоб на лидера вашего сервера.<br>'+
		'[CENTER][I][COLOR=rgb(255, 255, 0)]На рассмотрении[/COLOR][/I].[/CENTER][/FONT][/SIZE]'+

        '[CENTER]<br>' ,
	  prefix: TRANSFER_PREFIX5,
	  status: false,
	},
	{
		title: 'Вам в обжалования',
		content:
       "[CENTER][IMG width=695px]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/IMG]<br>"+
        '[CENTER]<br>' +
		'[SIZE=4][FONT=Veranda][CENTER][COLOR=#FF8800]{{ greeting }}, уважаемый[/COLOR][B] {{ user.mention }}[/B]![/CENTER]<br><br>' +

        '[CENTER]<br>' +
		'[CENTER]Вы получили наказание от администратора своего сервера.<br> Переношу ваше обращение в раздел обжалований наказаний вашего сервера.<br>'+
		'[CENTER][I][COLOR=rgb(255, 255, 0)]На рассмотрении[/COLOR][/I].[/CENTER][/FONT][/SIZE]'+

        '[CENTER]<br>' ,
	  prefix: TRANSFER_PREFIX6,
	  status: false,
	},
	    {
		title: '|--(-->-->--> Для направления форума <--<--<--)--|',
        color: 'oswald: 3px; color: #FFFF00; background: #000000; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
	     },
        {
		title: 'Правила раздела',
		content:
            "[CENTER][IMG width=695px]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/IMG]<br>"+
        '[CENTER]<br>' +
		'[SIZE=4][FONT=Veranda][CENTER][COLOR=#FF8800]{{ greeting }}, уважаемый[/COLOR][B] {{ user.mention }}[/B]![/CENTER]<br><br>' +

        '[CENTER]<br>' +
		"[CENTER]Пожалуйста, убедительная просьба, ознакомиться с назначением данного раздела в котором Вы создали тему, так как Ваш запрос не относится к технической проблеме.<br>Что принимается в тех разделе:<br>Если возникли технические проблемы, которые так или иначе связаны с игровым модом<br>Форма заполнения:<br>[QUOTE]<br>[FONT=verdana][SIZE=4][COLOR=rgb(226, 80, 65)]01.[/COLOR] Ваш игровой никнейм:<br>[COLOR=rgb(226, 80, 65)]02.[/COLOR] Сервер, на котором Вы играете:<br>[COLOR=rgb(226, 80, 65)]03.[/COLOR] Суть возникшей проблемы (описать максимально подробно и раскрыто):<br>[COLOR=rgb(226, 80, 65)]04.[/COLOR] Любые скриншоты, которые могут помочь в решении проблемы (если таковые имеются):<br>[COLOR=rgb(226, 80, 65)]05.[/COLOR] Дата и время произошедшей технической проблемы (постарайтесь указать максимально точно):[/SIZE][/FONT][/QUOTE]<br>[/CENTER]<br><br>[CENTER][FONT=verdana][SIZE=7][COLOR=rgb(226, 80, 65)][U]Если возникли технические проблемы, которые так или иначе связаны с вылетами из игры и любыми другими проблемами клиента[/U][/COLOR][/SIZE][/FONT][/CENTER]<br><br>[QUOTE]<br>[FONT=verdana][SIZE=4][COLOR=rgb(226, 80, 65)]01. [/COLOR]Ваш игровой ник:<br>[COLOR=rgb(226, 80, 65)]02. [/COLOR]Сервер:<br>[COLOR=rgb(226, 80, 65)]03.[/COLOR] Тип проблемы: Обрыв соединения | Проблема с ReCAPTCHA | Краш игры (закрытие игры) | Другое [Выбрать один вариант ответа]<br>[COLOR=rgb(226, 80, 65)]04. [/COLOR]Действия, которые привели к этому (при вылетах, по возможности предоставлять место сбоя):<br>[COLOR=rgb(226, 80, 65)]05.[/COLOR] Как часто данная проблема:<br>[COLOR=rgb(226, 80, 65)]06.[/COLOR] Полное название мобильного телефона:<br>[COLOR=rgb(226, 80, 65)]07.[/COLOR] Версия Android:<br>[COLOR=rgb(226, 80, 65)]08. [/COLOR]Дата и время (по МСК):<br>[COLOR=rgb(226, 80, 65)]09. [/COLOR]Связь с Вами по Telegram/VK:[/SIZE][/FONT][/QUOTE]" +
		'[CENTER][I][COLOR=rgb(255,0,0)]Закрыто[/COLOR][/I].[/CENTER][/FONT][/SIZE]'+

        '[CENTER]<br>' ,
		prefix: CLOSE_PREFIX,
		status: false,
     	},
    	{
		title: 'Форма подачи',
		content:
            "[CENTER][IMG width=695px]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/IMG]<br>"+
        '[CENTER]<br>' +
		'[SIZE=4][FONT=Veranda][CENTER][COLOR=#FF8800]{{ greeting }}, уважаемый[/COLOR][B] {{ user.mention }}[/B]![/CENTER]<br><br>' +

        '[CENTER]<br>' +
		"[CENTER]Пожалуйста, заполните форму, создав новую тему: <br>[CODE]01. Ваш игровой никнейм:<br>02. Сервер, на котором Вы играете:<br>03. Суть Вашей возникшей проблемы (описать максимально подробно и раскрыто): <br>04. Любые скриншоты, которые могут помочь в решении проблемы (если таковые имеются):<br>05. Дата и время произошедшей технической проблемы (постарайтесь указать максимально точно):[/CODE]<br><br>" +
		'[CENTER][I][COLOR=rgb(255,0,0)]Закрыто[/COLOR][/CENTER][/I].[/FONT][/SIZE]'+

        '[CENTER]<br>' ,
		prefix: CLOSE_PREFIX,
		status: false,
	    },
		{title: 'Передано логисту',
		content:
       "[CENTER][IMG width=695px]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/IMG]<br>"+
        '[CENTER]<br>' +
		'[SIZE=4][FONT=Veranda][CENTER][COLOR=#FF8800]{{ greeting }}, уважаемый[/COLOR][B] {{ user.mention }}[/B]![/CENTER]<br><br>' +

        '[CENTER]<br>' +
		"[CENTER]Ваша тема закреплена и передана <u>Техническому специалисту по логированию</u> для дальнейшего вердикта,ожидайте ответ в данной теме.<br><br>" +
		'[CENTER]Создавать новые темы с данной проблемой — не нужно.[/CENTER][/FONT][/SIZE]'+

        '[CENTER]<br>' ,
		prefix: TECHADM_PREFIX,
		status: true,
	},
{
		title: 'Дубликат',
		content:
       "[CENTER][IMG width=695px]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/IMG]<br>"+
        '[CENTER]<br>' +
		'[SIZE=4][FONT=Veranda][CENTER][COLOR=#FF8800]{{ greeting }}, уважаемый[/COLOR][B] {{ user.mention }}[/B]![/CENTER]<br><br>' +

        '[CENTER]<br>' +
		"[CENTER]Ваше обращение содержит контент, который нарушает правила пользования форумом. Пожалуйста, прекратите создавать подобные обращения, иначе Ваш форумный аккаунт может быть наделен статусом временной или постоянной блокировки.<br>Ознакомиться с правилами пользования форумом Вы можете здесь: [URL='https://forum.blackrussia.online/threads/%D0%9E%D0%B1%D1%89%D0%B8%D0%B5-%D0%BF%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BD%D0%B0%D1%85%D0%BE%D0%B6%D0%B4%D0%B5%D0%BD%D0%B8%D1%8F-%D0%BD%D0%B0-%D1%84%D0%BE%D1%80%D1%83%D0%BC%D0%B5.304564/']клик[/URL] <br>" +
		'[CENTER][I][COLOR=rgb(255,0,0)]Закрыто[/COLOR][/I].[/CENTER][/FONT][/SIZE]'+

        '[CENTER]<br>' ,
		prefix: CLOSE_PREFIX,
		status: false,
	},
    {
		title: 'Не относится к разделу',
		content:
       "[CENTER][IMG width=695px]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/IMG]<br>"+
        '[CENTER]<br>' +
		'[SIZE=4][FONT=Veranda][CENTER][COLOR=#FF8800]{{ greeting }}, уважаемый[/COLOR][B] {{ user.mention }}[/B]![/CENTER]<br><br>' +

        '[CENTER]<br>' +
		"[CENTER]Ваше обращение не относится к техничекому разделу.<br> Пожалуйста ознакомьтесь с правилами данного раздела: [URL='https://forum.blackrussia.online/forums/Информация-для-игроков.231/']клик[/URL] <br>" +
		'[CENTER][I][COLOR=rgb(255,0,0)]Закрыто[/COLOR][/I].[/CENTER][/FONT][/SIZE]'+

        '[CENTER]<br>' ,
		prefix: CLOSE_PREFIX,
		status: false,
	},
	{
		title: 'Доп. инфа',
		content:
       "[CENTER][IMG width=695px]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/IMG]<br>"+
        '[CENTER]<br>' +
		'[SIZE=4][FONT=Veranda][CENTER][COLOR=#FF8800]{{ greeting }}, уважаемый[/COLOR][B] {{ user.mention }}[/B]![/CENTER]<br><br>' +

        '[CENTER]<br>' +
		'[CENTER] Для дальнейшего рассмотрения темы, предоставьте:<br><BR>[QUOTE][SIZE=5][FONT=Veranda]1. Скриншоты или видео, подтверждающие факт владения этим имуществом.<BR>2. Все детали пропажи: дата, время, после каких действий имущество пропало.<BR>3. Информация о том, как вы изначально получили это имущество:<BR>дата покупки<br>способ приобретения (у игрока, в магазине или через донат;<br>фрапс покупки (если есть);<br>никнейм игрока, у которого было приобретено имущество, если покупка была сделана не в магазине.[/QUOTE]<BR>[/CENTER]'+
		'[CENTER][COLOR=rgb(255, 255, 0)]На рассмотрении[/COLOR][/CENTER][/FONT][/SIZE]'+

        '[CENTER]<br>' ,
		prefix: PIN_PREFIX,
		status: true,
	},
{
		title: 'Нет фото/видео',
		content:
       "[CENTER][IMG width=695px]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/IMG]<br>"+
        '[CENTER]<br>' +
		'[SIZE=4][FONT=Veranda][CENTER][COLOR=#FF8800]{{ greeting }}, уважаемый[/COLOR][B] {{ user.mention }}[/B]![/CENTER]<br><br>' +

        '[CENTER]<br>' +
		"[CENTER]Без доказательств (в частности скриншоты или видео) – решить проблему не получится. Если доказательства найдутся - создайте новую тему, приложив доказательства с фото-хостинга<br>[URL='https://yapx.ru/']yapx.ru[/URL],<br>[URL='https://imgur.com/']imgur.com[/URL],<br>[URL='https://www.youtube.com/']youtube.com[/URL],<br>[URL='https://imgbb.com']ImgBB.com[/URL]<br>(все кликабельно).<br>" +
		'[CENTER][I][COLOR=rgb(255,0,0)]Закрыто[/COLOR][/I].[/CENTER][/FONT][/SIZE]'+

        '[CENTER]<br>' ,
		prefix: CLOSE_PREFIX,
		status: false,
	},
{
		title: 'Передано тестерам',
		content:
       "[CENTER][IMG width=695px]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/IMG]<br>"+
        '[CENTER]<br>' +
		'[SIZE=4][FONT=Veranda][CENTER][COLOR=#FF8800]{{ greeting }}, уважаемый[/COLOR][B] {{ user.mention }}[/B]![/CENTER]<br><br>' +

        '[CENTER]<br>' +
		"[CENTER]Ваша тема передана на тестирование.[/CENTER][/FONT][/SIZE]"+

        '[CENTER]<br>' ,
		  prefix: WAIT_PREFIX,
		  status: false,
	},
{
		title: 'Передано КП',
		content:
       "[CENTER][IMG width=695px]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/IMG]<br>"+
        '[CENTER]<br>' +
		'[SIZE=4][FONT=Veranda][CENTER][COLOR=#FF8800]{{ greeting }}, уважаемый[/COLOR][B] {{ user.mention }}[/B]![/CENTER]<br><br>' +

        '[CENTER]<br>' +
		"[CENTER]Ваша тема закреплена и находится на рассмотрении у команды проекта. Пожалуйста, ожидайте выноса вердикта разработчиков."+
		"[CENTER]Создавать новые темы с данной проблемой — не нужно, ожидайте ответа в данной теме. Если проблема решится - Вы всегда можете оставить своё сообщение в этой теме.<br>"+

        '[CENTER]<br>' ,
		prefix: COMMAND_PREFIX,
		status: true,
	},
{
		title: 'Известно КП',
		content:
       "[CENTER][IMG width=695px]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/IMG]<br>"+
        '[CENTER]<br>' +
		'[SIZE=4][FONT=Veranda][CENTER][COLOR=#FF8800]{{ greeting }}, уважаемый[/COLOR][B] {{ user.mention }}[/B]![/CENTER]<br><br>' +

        '[CENTER]<br>' +
		"[CENTER]Команде проекта уже известно о данной проблеме, она обязательно будет рассмотрена и исправлена. Спасибо за Ваше обращение!<br><br>" +
		'[CENTER][I][COLOR=rgb(255,0,0)]Закрыто[/COLOR][/I].[/CENTER][/FONT][/SIZE]'+

        '[CENTER]<br>' ,
		prefix: CLOSE_PREFIX,
		status: false,
	},
	{
		title: 'Баг будет исправлен',
		content:
       "[CENTER][IMG width=695px]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/IMG]<br>"+
        '[CENTER]<br>' +
		'[SIZE=4][FONT=Veranda][CENTER][COLOR=#FF8800]{{ greeting }}, уважаемый[/COLOR][B] {{ user.mention }}[/B]![/CENTER]<br><br>' +

        '[CENTER]<br>' +
		"[CENTER]Данная недоработка будет проверена и исправлена.<br> Спасибо, ценим Ваш вклад в развите проекта.<br>" +
		'[CENTER][I]Рассмотрено[/I].[/CENTER][/FONT][/SIZE]'+

        '[CENTER]<br>' ,
		prefix: WATCHED_PREFIX,
		status: false,
	},
{
		title: 'Не является багом',
		content:
       "[CENTER][IMG width=695px]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/IMG]<br>"+
        '[CENTER]<br>' +
		'[SIZE=4][FONT=Veranda][CENTER][COLOR=#FF8800]{{ greeting }}, уважаемый[/COLOR][B] {{ user.mention }}[/B]![/CENTER]<br><br>' +

        '[CENTER]<br>' +
		'[CENTER]Проблема, с которой Вы столкнулись, не является багом/ошибкой сервера.<br><br>[CENTER][I][COLOR=rgb(255, 0, 0)]Закрыто[/COLOR][/I].[/CENTER][/FONT][/SIZE]'+

        '[CENTER]<br>' ,
		prefix: CLOSE_PREFIX,
		status: false,
	},
{
		title: 'Заявки на АП/ЛД',
		content:
       "[CENTER][IMG width=695px]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/IMG]<br>"+
        '[CENTER]<br>' +
		'[SIZE=4][FONT=Veranda][CENTER][COLOR=#FF8800]{{ greeting }}, уважаемый[/COLOR][B] {{ user.mention }}[/B]![/CENTER]<br><br>' +

        '[CENTER]<br>' +
		"[CENTER]Команда технических специалистов не решает назначение на какую-либо должность, которая присутствует на проекте.<br>Для этого существует отдельный раздел на форуме, где Вы можете ознакомиться с открытыми должностями и формами подач.<br>Приятной игры и желаем удачи в карьерной лестнице!<br><br>" +
		'[CENTER][I][COLOR=rgb(255,0,0)]Закрыто[/COLOR][/I].[/CENTER][/FONT][/SIZE]'+

        '[CENTER]<br>' ,
		prefix: CLOSE_PREFIX,
		status: false,
	},
{
		title: 'Вам гос. раздел',
		content:
       "[CENTER][IMG width=695px]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/IMG]<br>"+
        '[CENTER]<br>' +
		'[SIZE=4][FONT=Veranda][CENTER][COLOR=#FF8800]{{ greeting }}, уважаемый[/COLOR][B] {{ user.mention }}[/B]![/CENTER]<br><br>' +

        '[CENTER]<br>' +
		'[CENTER]Ваша тема не относится к техническому разделу, пожалуйста оставьте ваше заявление в соответствующем разделе Государственных Организаций вашего сервера.[/CENTER]<br><br>'+
		'[CENTER][I][COLOR=rgb(255, 0, 0)]Закрыто[/COLOR][/I].[/CENTER][/FONT][/SIZE]'+

        '[CENTER]<br>' ,
		prefix: CLOSE_PREFIX,
		status: false,
	},
	{
		title: 'Вам в раздел опг',
		content:
       "[CENTER][IMG width=695px]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/IMG]<br>"+
        '[CENTER]<br>' +
		'[SIZE=4][FONT=Veranda][CENTER][COLOR=#FF8800]{{ greeting }}, уважаемый[/COLOR][B] {{ user.mention }}[/B]![/CENTER]<br><br>' +

        '[CENTER]<br>' +
		'[CENTER]Ваша тема не относится к техническому разделу, пожалуйста оставьте ваше заявление в соответствующем разделе Криминальных Организаций вашего сервера [/CENTER]'+
		'[CENTER][I][COLOR=rgb(255,0,0)]Закрыто[/COLOR][/I].[/CENTER][/FONT][/SIZE]'+

        '[CENTER]<br>' ,
		prefix: CLOSE_PREFIX,
		status: false,
	},
    {
		title: 'Проблема решилась',
		content:
       "[CENTER][IMG width=695px]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/IMG]<br>"+
        '[CENTER]<br>' +
		'[SIZE=4][FONT=Veranda][CENTER][COLOR=#FF8800]{{ greeting }}, уважаемый[/COLOR][B] {{ user.mention }}[/B]![/CENTER]<br><br>' +

        '[CENTER]<br>' +
		"[CENTER]Благодарим Вас за поддержание обратной связи! Мы искренне рады за то, что Ваша проблема была решена и мы смогли помочь Вам.<br>Если Вы вновь столкнетесь с той или иной проблемой или же недоработкой — обязательно обращайтесь в технический раздел. Приятной игры!<br><br>" +
		'[CENTER][I][COLOR=rgb(0,255,0)]Решено[/COLOR][/I].[/CENTER][/FONT][/SIZE]'+

        '[CENTER]<br>' ,
		prefix: DECIDED_PREFIX,
		status: false,
	},
    {
		title: 'Отвязка привязок',
		content:
       "[CENTER][IMG width=695px]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/IMG]<br>"+
        '[CENTER]<br>' +
		'[SIZE=4][FONT=Veranda][CENTER][COLOR=#FF8800]{{ greeting }}, уважаемый[/COLOR][B] {{ user.mention }}[/B]![/CENTER]<br><br>' +

        '[CENTER]<br>' +
		"[CENTER]Удалить установленные на аккаунт привязки не представляется возможным. В том случае, если на Ваш игровой аккаунт были установлены привязки взломщиком — он будет перманентно заблокирован с причиной «Чужая привязка». В данном случае дальнейшая разблокировка игрового аккаунта невозможна во избежание повторных случаев взлома — наша команда не может быть уверена в том, что злоумышленник не воспользуется установленной им привязкой в своих целях. <br><br>" +
		'[CENTER][I][COLOR=rgb(255,0,0)]Закрыто[/COLOR][/I].[/CENTER][/FONT][/SIZE]'+

        '[CENTER]<br>' ,
		prefix: CLOSE_PREFIX,
		status: false,
	},
{
		title: 'Переуст. игру',
		content:
       "[CENTER][IMG width=695px]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/IMG]<br>"+
        '[CENTER]<br>' +
		'[SIZE=4][FONT=Veranda][CENTER][COLOR=#FF8800]{{ greeting }}, уважаемый[/COLOR][B] {{ user.mention }}[/B]![/CENTER]<br><br>' +

        '[CENTER]<br>' +
		"[CENTER]Возможно в файлах вашей игры присутствуют постороннее оборудование(дополнения/изменения).<br>" +
		"[CENTER]Рекомендуется удалить полностью лаунчер и связанные с ним файлы и установить игру заново с официального сайта - [URL='https://blackrussia.online']Клик[/URL].<br>" +
		'[CENTER][I][COLOR=rgb(127, 255, 0)]Рассмотрено[/COLOR][/I].[/CENTER][/FONT][/SIZE]'+

        '[CENTER]<br>' ,
		prefix: DECIDED_PREFIX,
		status: false,
	},
	{
		title: 'Изменение законки',
		content:
       "[CENTER][IMG width=695px]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/IMG]<br>"+
        '[CENTER]<br>' +
		'[SIZE=4][FONT=Veranda][CENTER][COLOR=#FF8800]{{ greeting }}, уважаемый[/COLOR][B] {{ user.mention }}[/B]![/CENTER]<br><br>' +

        '[CENTER]<br>' +
		'[CENTER]К сожалению, администрация, технические специалисты и другие должностные лица на BLACK RUSSIA не могут повлиять на Вашу законопослушность.<br>Вы можете повысить свою законопослушность двумя способами:<BR><BR>1. Каждый PayDay (00 минут каждого часа) вам начисляется одно очко законопослушности(Если только у вас нету PLATINUM VIP-статуса), если за прошедший час вы отыграли не менее 20 минут.<br>2. Приобрести законопослушность в /donate.<BR>[/CENTER]'+
		'[CENTER][I][COLOR=rgb(255,0,0)]Закрыто[/COLOR][/I].[/CENTER][/FONT][/SIZE]'+

        '[CENTER]<br>' ,
		prefix: CLOSE_PREFIX,
		status: false,
	},
{
		title: 'Восстановление доступа к аккаунту',
		content:
       "[CENTER][IMG width=695px]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/IMG]<br>"+
        '[CENTER]<br>' +
		'[SIZE=4][FONT=Veranda][CENTER][COLOR=#FF8800]{{ greeting }}, уважаемый[/COLOR][B] {{ user.mention }}[/B]![/CENTER]<br><br>' +

        '[CENTER]<br>' +
		"[CENTER]Если Вы обезопасили Ваш аккаунт и [U]привязали его к странице во ВКонтакте[/U], то сбросить пароль или пин-код Вы всегда сможете обратившись в официальное сообщество проекта - https://vk.com/blackrussia.online.<br> Либо в телеграмм бот - https://t.me/br_helper_bot.<br> Напишите «Начать» в личные сообщения группы/бота, затем выберите нужные Вам функции.<br><br>" +
		"[CENTER][FONT=Veranda]Подробнее в данной теме - [URL='https://forum.blackrussia.online/index.php?threads/lime-Защита-игрового-аккаунта.1201253/']клик[/URL][/center]<br><br>" +
		"[CENTER]Если Вы обезопасили Ваш аккаунт и [U]привязали его к почте[/U], то сбросить пароль или пин-код Вы всегда сможете при вводе пароля на сервере. После подключения к серверу нажмите на кнопку «Войти в аккаунт», затем выберите кнопку «Восстановить пароль», после чего на Вашу почту будет отправлено письмо с одноразовым кодом восстановления.<br><br>" +
		"[CENTER]Если Вы [U]не обезопасили свой аккаунт - его невозможно вернуть[/U]. Игрок самостоятельно несет отвественность за безопаность своего аккаунта.<br><br>" +
		'[CENTER]К сожалению, иногда решение подобных вопросов требует много времени. Надеемся, что Вы сможете восстановить доступ к аккаунту!<br>' +
		'[I][COLOR=rgb(127, 255, 0)]Рассмотрено[/COLOR][/I].[/CENTER][/FONT][/SIZE]'+

        '[CENTER]<br>' ,
		prefix: WATCHED_PREFIX,
		status: false,
	},
	{
        title: "Не грузит форум",
        content:
       "[CENTER][IMG width=695px]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/IMG]<br>"+
        '[CENTER]<br>' +
        '[SIZE=4][FONT=Veranda][CENTER][COLOR=#FF8800]{{ greeting }}, уважаемый[/COLOR][B] {{ user.mention }}[/B]![/CENTER]<br><br>' +

        '[CENTER]<br>' +
        '[center]Если вы столкнулись с проблемой загрузки страниц форума, пожалуйста, выполните следующие действия:<br><br>• Откройте "Настройки".<br>• Найдите во вкладке "Приложения" свой браузер, через который вы пользуетесь нашим сайтом форума.<br>• Нажмите на браузер, после чего внизу выберите "Очистить" -> "Очистить Кэш".<br><br>После следуйте данным инструкциям:<br>• Перейдите в настройки браузера.<br>• Выберите "Конфиденциальность и безопасность" -> "Очистить историю".<br>• В основных и дополнительных настройках поставьте галочку в пункте "Файлы cookie и данные сайтов".<br>После этого нажмите "Удалить данные".<br><br>Ниже прилагаем видео-инструкции описанного процесса для разных браузеров:<br>Для браузера CHROME: https://youtu.be/FaGp2rRru9s<br>Для браузера OPERA: https://youtube.com/shorts/eJOxkc3Br6A?feature=share'+
        '[CENTER][I][COLOR=rgb(255, 0, 0)]Закрыто[/COLOR][/I].[/CENTER][/FONT][/SIZE]'+

        '[CENTER]<br>' ,
        prefix: CLOSE_PREFIX,
        status: false,
	},
	{
        title: "Пропали штрафы",
        content:
       "[CENTER][IMG width=695px]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/IMG]<br>"+
        '[CENTER]<br>' +
        '[SIZE=4][FONT=Veranda][CENTER][COLOR=#FF8800]{{ greeting }}, уважаемый[/COLOR][B] {{ user.mention }}[/B]![/CENTER]<br><br>' +

        '[CENTER]<br>' +
        '[center]У Вас произошла ошибка со штрафами. Чтобы ошибка была исключена — Вам необходимо совершить проезд на красный свет или переехать через сплошную, получить за это штраф и оплатить все штрафы в банке.<br>Команде Проекта известно о данной недоработке и активно ведется иправление.<br><br>' +
        '[CENTER][I][COLOR=rgb(255, 0, 0)]Закрыто[/COLOR][/I].[/CENTER][/FONT][/SIZE]'+

        '[CENTER]<br>' ,
        prefix: CLOSE_PREFIX,
        status: false,
    },
	{
		title: 'Форма для ошибок во время ОБТ на IOS',
		content:
       "[CENTER][IMG width=695px]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/IMG]<br>"+
        '[CENTER]<br>' +
		'[SIZE=4][FONT=Veranda][CENTER][COLOR=#FF8800]{{ greeting }}, уважаемый[/COLOR][B] {{ user.mention }}[/B]![/CENTER]<br><br>' +

        '[CENTER]<br>' +
		"[CENTER]Если вы нашли какую-либо ошибку во время Открытого Бэта Тестирования на IOS то сделайте следующие действия.<br><br>1. Отправьте пожалуйста найденную недоработку в данную форму - [URL='https://forms.gle/4adcNvKisfKF59Fi8']клик[/URL]<br>2. Передайте данную форму своим друзьям, для ускорения процесса по сбору багов для их исправления.<br><br>Спасибо за ваш вклад в развитие игры!<br>[CENTER][I][COLOR=rgb(255,0,0)]Закрыто[/COLOR][/I].[/CENTER][/FONT][/SIZE]"+

        '[CENTER]<br>' ,
        prefix: CLOSE_PREFIX,
		status: false,
	},
	{
		title: 'Нет рейта за груз',
		content:
       "[CENTER][IMG width=695px]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/IMG]<br>"+
        '[CENTER]<br>' +
		'[SIZE=4][FONT=Veranda][CENTER][COLOR=#FF8800]{{ greeting }}, уважаемый[/COLOR][B] {{ user.mention }}[/B]![/CENTER]<br><br>' +

        '[CENTER]<br>' +
		'[CENTER]Наша система построена следующим образом:<br>Рейтинг зависит от поломки автомобиля чем серьёзнее поломка, тем меньше будет засчитан рейтинг.<br>Поломка учитывается вся за время рейса с грузом, в независимости от того если Вы почините Ваш автомобиль, поломка до, будет учтена.<br>[CENTER][I][COLOR=rgb(255, 0, 0)]Закрыто[/COLOR][/I].[/CENTER][/FONT][/SIZE]'+

        '[CENTER]<br>' ,
 prefix: CLOSE_PREFIX,
	},
	{
		title: 'Пропали вещи с аука',
		content:
        "[CENTER][IMG width=695px]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/IMG]<br>"+
        '[CENTER]<br>' +
		'[SIZE=4][FONT=Veranda][CENTER][COLOR=#FF8800]{{ greeting }}, уважаемый[/COLOR][B] {{ user.mention }}[/B]![/CENTER]<br><br>' +

        '[CENTER]<br>' +
		'[CENTER]Если вы выставили свои вещи на аукцион, а по истечении времени действия лота их никто не купил — воспользуйтесь командой [COLOR=rgb(251, 160, 38)]/reward[/COLOR]<br> В случае отсутствии вещей там — приложите видеофиксацию с использованием команды /time в данном обращении<br>[CENTER][I][COLOR=rgb(255,255,0)]На рассмотрении[/COLOR][/I].[/CENTER][/FONT][/SIZE]'+

        '[CENTER]<br>' ,
prefix: PIN_PREFIX,
		status: false,
	},
{
		title: 'Приват режим жб',
		content:
       "[CENTER][IMG width=695px]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/IMG]<br>"+
        '[CENTER]<br>' +
		'[SIZE=4][FONT=Veranda][CENTER][COLOR=#FF8800]{{ greeting }}, уважаемый[/COLOR][B] {{ user.mention }}[/B]![/CENTER]<br><br>' +

        '[CENTER]<br>' +
		"[CENTER]Раздел 'Жалобы' переведен в приватный режим.<br>Тему, созданную тем или иным пользователем, может видеть лишь <b>он сам</b> и <b>Администрация сервера</b>.<br>Ознакомиться с формой подачи тем в тот или иной раздел можно в данной теме: [URL='https://forum.blackrussia.online/index.php?forums/Правила-подачи-жалоб.202/']Клик[/URL]<br>Приятного времяпрепровождения на нашем форуме<br>[CENTER][I][COLOR=rgb(255,0,0)]Закрыто[/COLOR][/I].[/CENTER][/FONT][/SIZE]"+

        '[CENTER]<br>' ,
prefix: CLOSE_PREFIX,
		status: false,
	},
	{
		title: 'Не работают ссылки',
		content:
        "[CENTER][IMG width=695px]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/IMG]<br>"+
        '[CENTER]<br>' +
		'[SIZE=4][FONT=Veranda][CENTER][COLOR=#FF8800]{{ greeting }}, уважаемый[/COLOR][B] {{ user.mention }}[/B]![/CENTER]<br><br>' +

        '[CENTER]<br>' +
		"[CENTER]По техническим причинам данное действие невозможно, пожалуйста воспользуйтесь копированием ссылки от сюда:<br>[img]https://i.ibb.co/SX77Fgw/photo-2022-08-20-16-31-57.jpg[/img]<br>Если данный способ не помогает, то используйте сервис сокращения ссылок https://clck.ru<br> Либо попробуйте вот так:<br>1) загрузка скриншота биографии на фотохостинг<br>2) в описание прикрепить ссылку с форума<br>3) скопировать пост с фотохостинга<br><br>2 способ:<br>Сократите ссылки для Ваших скриншотов и RP биографии, сделать можно тут goo.su  также Iformation замените на русский текст, просмотрите еще текст полностью и постарайтесь уменьшить такие знаки как !?<br>goo.su[/CENTER]<br>"+
		'[CENTER][I][COLOR=rgb(255, 0, 0)]Закрыто[/COLOR][/I].[/CENTER][/FONT][/SIZE]'+

        '[CENTER]<br>' ,
		prefix: CLOSE_PREFIX,
		status: false,
	},
	{
		title: 'Сервер не отвечает',
		content:
       "[CENTER][IMG width=695px]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/IMG]<br>"+
        '[CENTER]<br>' +
		'[SIZE=4][FONT=Veranda][CENTER][COLOR=#FF8800]{{ greeting }}, уважаемый[/COLOR][B] {{ user.mention }}[/B]![/CENTER]<br><br>' +

        '[CENTER]<br>' +
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

		"[CENTER]📹 Включение продемонстрировано на видео: https://youtu.be/Wft0j69b9dk<br>[CENTER][I][COLOR=rgb(255,0,0)]Закрыто[/COLOR][/I].[/CENTER][/FONT][/SIZE]"+

        '[CENTER]<br>' ,
		prefix: CLOSE_PREFIX,
		status: false,
	},
    {
        title: 'Кикнули за ПО',
        content:
       "[CENTER][IMG width=695px]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/IMG]<br>"+
        '[CENTER]<br>' +
        '[SIZE=4][FONT=Veranda][CENTER][COLOR=#FF8800]{{ greeting }}, уважаемый[/COLOR][B] {{ user.mention }}[/B]![/CENTER]<br><br>' +

        '[CENTER]<br>' +
        '[CENTER]Уважаемый игрок, если вы были отключены от сервера Античитом<br><br>[COLOR=rgb(255, 0, 0)]Пример[/COLOR]:<br><br> [IMG]https://i.ibb.co/FXXrcVS/image.png[/IMG],<br>пожалуйста, обратите внимания на значения PacketLoss и Ping.<br><br>PacketLoss - минимальное значение 0.000000, максимальное 1.000000. При показателе, выше нуля, это означает, что у вас происходит задержка/потеря передаваемых пакетов информации на сервер. Это означает, что ваш интернет не передает достаточное количество данных из вашего устройства на наш сервер, в следствие чего система отключает вас от игрового процесса.<br><br>Ping - Чем меньше значение в данном пункте, тем быстрее передаются данные на сервер, и наоборот. Если значение выше 100, вы можете наблюдать отставания в игровом процессе из-за нестабильности интернет-соединения.<br><br>Если вы не заметили проблем в данных пунктах, скорее всего - у вас произошел скачек пинга при выполнении действия в игре, в таком случае, античит также отключает игрока из-за подозрения в использовании посторонних программ.<br><br>Решение данной проблемы: постарайтесь стабилизировать ваше интернет-соединение, при необходимости - сообщите о проблемах своему провайдеру (поставщику услуг интернета).<br>[CENTER][COLOR=rgb(255, 0, 0)]Закрыто.[/COLOR][/CENTER][/FONT][/SIZE]'+

        '[CENTER]<br>' ,
 prefix: CLOSE_PREFIX,
        status: false,
	},
	{
        title: 'Проблемы доната',
        content:
       "[CENTER][IMG width=695px]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/IMG]<br>"+
        '[CENTER]<br>' +
        '[SIZE=4][FONT=Veranda][CENTER][COLOR=#FF8800]{{ greeting }}, уважаемый[/COLOR][B] {{ user.mention }}[/B]![/CENTER]<br><br>' +

        '[CENTER]<br>' +
        '[CENTER]Если не были зачислены BLACK COINS — вероятнее всего, была допущена ошибка при вводе реквизитов. К нашему сожалению, из-за большого количества попыток обмана, мы перестали рассматривать подобные обращения. Для проверки зачисления BLACK COINS необходимо ввести в игре команду: /donat.<br><br>' +
        '[CENTER][I]Вам необходимо быть внимательными при осуществлении покупок.[/I]<br>' +
        '[CENTER]Если Вы считаете, что ошибки быть не может и с момента оплаты не прошло более 14 дней — в обязательном порядке обратитесь в службу поддержки для дальнейшего решения: На сайте через виджет обратной связи или посредством месенджеров: ВКонтакте: vk.com/br_tech, Telegram: t.me/br_techBot<br><br>' +
        '[CENTER][COLOR=rgb(255,0,0)]Закрыто[/COLOR].[/CENTER][/FONT][/SIZE]'+

        '[CENTER]<br>' ,
      prefix: DECIDED_PREFIX,
      status: false,
	},
	{
		title: 'Исчезла стата акка',
		content:
       "[CENTER][IMG width=695px]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/IMG]<br>"+
        '[CENTER]<br>' +
		'[SIZE=4][FONT=Veranda][CENTER][COLOR=#FF8800]{{ greeting }}, уважаемый[/COLOR][B] {{ user.mention }}[/B]![/CENTER]<br><br>' +

        '[CENTER]<br>' +
		"[CENTER]Аккаунт не может пропасть или аннулироваться просто так. Даже если Вы меняете ник, используете кнопки «починить игру» или «сброс настроек» - Ваш аккаунт не удаляется. Система работает иначе.<br><br>" +
		"[CENTER]Проверьте ввод своих данных: пароль, никнейм и сервер. Зачастую игроки просто забывают ввести актуальные данные и считают, что их аккаунт был удален. Будьте внимательны!" +
		'[CENTER]Как ввести никнейм (на случай, если сменили в игре, но не поменяли в клиенте): https://youtu.be/c8rhVwkoFaU [/CENTER] <br><br>' +
		'[CENTER][I]Рассмотрено[/I].[/CENTER][/FONT][/SIZE]'+

        '[CENTER]<br>' ,
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
	{
		title: 'Правила системы восстановлений',
		content:
        "[CENTER][IMG width=695px]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/IMG]<br>"+
        '[CENTER]<br>' +
		'[SIZE=4][FONT=Veranda][CENTER][COLOR=#FF8800]{{ greeting }}, уважаемый[/COLOR][B] {{ user.mention }}[/B]![/CENTER]<br><br>' +

        '[CENTER]<br>' +
		"[CENTER]Пожалуйста, убедительная просьба, ознакомьтесь с правилами восстановлений - [URL='https://forum.blackrussia.online/index.php?threads/В-каких-случаях-мы-не-восстанавливаем-игровое-имущество.25277/']клик[/URL].<br>Вы создали тему, которая не относится к технической проблеме.[/CENTER]<br><br>" +
		'[CENTER][I][COLOR=rgb(255,0,0)]Закрыто[/COLOR][/CENTER][/I].[/FONT][/SIZE]'+

        '[CENTER]<br>' ,
		prefix: CLOSE_PREFIX,
		status: false,
	},
	{
		title: 'Не выпустило из ФСИН после срока',
		content:
       "[CENTER][IMG width=695px]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/IMG]<br>"+
        '[CENTER]<br>' +
		'[SIZE=4][FONT=Veranda][CENTER][COLOR=#FF8800]{{ greeting }}, уважаемый[/COLOR][B] {{ user.mention }}[/B]![/CENTER]<br><br>' +

        '[CENTER]<br>' +
		'[CENTER]Скоро будете выпущены, ожидайте.[/CENTER][/FONT][/SIZE]'+

        '[CENTER]<br>' ,
		prefix: CLOSE_PREFIX,
		status: false,
	},
{
		title: 'Нужны все детали для прошивки авто',
		content:
       "[CENTER][IMG width=695px]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/IMG]<br>"+
        '[CENTER]<br>' +
		'[SIZE=4][FONT=Veranda][CENTER][COLOR=#FF8800]{{ greeting }}, уважаемый[/COLOR][B] {{ user.mention }}[/B]![/CENTER]<br><br>' +

        '[CENTER]<br>' +
		'[CENTER] Для активации какой либо прошивки необходимо поставить все детали данного типа "SPORT" "SPORT+" и т.п.<br>[CENTER][I][COLOR=rgb(255,0,0)]Закрыто[/COLOR][/I].[/CENTER][/FONT][/SIZE]'+

        '[CENTER]<br>' ,
    prefix: CLOSE_PREFIX,
		status: false,
	},
    {
        title: 'Перенаправление в поддержку',
        content:
       "[CENTER][IMG width=695px]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/IMG]<br>"+         '[CENTER]<br>' +
        '[SIZE=4][FONT=Veranda][CENTER][COLOR=#FF8800]{{ greeting }}, уважаемый[/COLOR][B] {{ user.mention }}[/B]![/CENTER]<br><br>' +

        '[CENTER]<br>' +
        '[CENTER]Пожалуйста, обратитесь в Техническую поддежку проекта.<br><br>Конктактная информация:[/CENTER]<br>'+
        '[CENTER]Телеграмм -  [URL=http://t.me/br_techBot]t.me/br_techBot[/URL][/CENTER]<br>'+
        '[CENTER]ВКонтакте - [URL= https://forum.blackrussia.online/redirect?to=aHR0cHM6Ly92ay5jb20vYnJfdGVjaA==]vk.com/br_tech[/URL] [/CENTER]<br>'+
		'[COLOR=rgb(127, 255, 0)]Рассмотрено.[/COLOR][/CENTER]'+
        '[CENTER]<br>' +

        '[SIZE=4][FONT=Veranda][CENTER][COLOR=#FF0000]С уважением Памирский Rupcak, Kumiho_Legenda.[/COLOR][/CENTER][/FONT][/SIZE]',
        prefix: WATCHED_PREFIX,
        status: false,
    },
	{
		title: 'Раздел предложений по улучшению',
		content:
       "[CENTER][IMG width=695px]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/IMG]<br>"+
        '[CENTER]<br>' +
		'[SIZE=4][FONT=Veranda][CENTER][COLOR=#FF8800]{{ greeting }}, уважаемый[/COLOR][B] {{ user.mention }}[/B]![/CENTER]<br><br>' +

        '[CENTER]<br>' +
		'[CENTER]Ваша тема не относится к технической проблеме, если вы хотите предложить изменения в игровом моде - обратитесь в раздел <br> [URL="https://forum.blackrussia.online/index.php?categories/Предложения-по-улучшению.656/"] Предложения по улучшению → нажмите сюда[/URL].<br>[CENTER][I][COLOR=rgb(255,0,0)]Закрыто[/COLOR][/I].[/CENTER][/FONT][/SIZE]'+

        '[CENTER]<br>' ,
        prefix: CLOSE_PREFIX,
		status: false,
	},
	];

	$(document).ready(() => {
	// Загрузка скрипта для обработки шаблонов
	$('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');

	// Добавление кнопок при загрузке страницы
	addButton('На рассмотрении', 'pin', 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 173, 51, 0.5);');
	addButton('Команде проекта', 'teamProject', 'border-radius: 13px; margin-right: 5px; border: 2px solid;  border-color: rgb(255, 240, 110, 0.5);');
    addButton('Тех. специалисту', 'techspec', 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(17, 92, 208, 0.5);');
	addButton('Рассмотрено', 'watched', 'border-radius: 13px; margin-right: 5px; border: 2px solid;  border-color: rgb(110, 192, 113, 0.5)');
	addButton('Решено', 'decided', 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(110, 192, 113, 0.5);');
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
    $('button#close').click(() => editThreadData(ACCEPT_PREFIX, false));
	$('button#techspec').click(() => editThreadData(TECHADM_PREFIX, true));
    $('button#trans1').click(() => editThreadData(TRANSFER_PREFIX1, false));
    $('button#trans2').click(() => editThreadData(TRANSFER_PREFIX2, false));
    $('button#trans3').click(() => editThreadData(TRANSFER_PREFIX3, false));
    $('button#trans4').click(() => editThreadData(TRANSFER_PREFIX4, false));
    $('button#trans5').click(() => editThreadData(TRANSFER_PREFIX5, false));
    $('button#trans6').click(() => editThreadData(TRANSFER_PREFIX6, false));

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
		$('.button--icon--reply').after(`<button type="button" class="button--cta uix_quickReply--button button button--icon button--icon--write rippleButton" id="selectAnswer" style="oswald: 3px; margin-left: 5px; margin-top: 10px; border-radius: 13px;">ОТВЕТЫ</button>`,
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


         function editThreadData(prefix, pin = false, kumiho = true) {
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
		if(kumiho === true) {
			if(prefix == WATCHED_PREFIX || prefix == CLOSE_PREFIX || prefix == DECIDED_PREFIX) {
				moveThread(prefix, 230); }

			if(prefix == WAIT_PREFIX) {
				moveThread(prefix, 917);
			}
            if(prefix == TRANSFER_PREFIX1) {
				moveThread(prefix, 1544);
            }
            if(prefix == TRANSFER_PREFIX2) {
				moveThread(prefix, 1543);
			}
            if(prefix == TRANSFER_PREFIX3) {
				moveThread(prefix, 1570);
			}
            if(prefix == TRANSFER_PREFIX4) {
				moveThread(prefix, 1572);
			}
            if(prefix == TRANSFER_PREFIX5) {
				moveThread(prefix, 1571);
            }
            if(prefix == TRANSFER_PREFIX6) {
				moveThread(prefix, 1573);
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

const Button52 = buttonConfig("ТР 50", "https://forum.blackrussia.online/forums/Технический-раздел-perm.2220/");
const Button53 = buttonConfig("ЖБ 50", "https://forum.blackrussia.online/forums/Сервер-№50-perm.2219/");
const Button54 = buttonConfig("Игроки 50", "https://forum.blackrussia.online/forums/Жалобы-на-игроков.2248/");
const Button55 = buttonConfig("ОПС", "https://forum.blackrussia.online/threads/Общие-правила-серверов.312571/")

bgButtons.append(Button52);
bgButtons.append(Button53);
bgButtons.append(Button54);
bgButtons.append(Button55);


 //Снег
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
    /* Стили для полосы прокрутки */
    ::-webkit-scrollbar {
        width: 16px;
    }

    /* Дорожка (track) */
    ::-webkit-scrollbar-track {
        background-color: #171e29;
    }

    /* Стиль полосы прокрутки */
    ::-webkit-scrollbar-thumb {
        background-color: #1f2b3b;
        border-radius: 0px;
        transition-duration: .3s;
    }

    /* Стиль полосы прокрутки при наведении */
    ::-webkit-scrollbar-thumb:hover {
        background-color: #2f4b6b;
        transition-duration: .3s;
    }
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