// ==UserScript==
// @name         Cheef Scirpt
// @namespace    https://forum.blackrussia.online/
// @version      2.3
// @description  Скрипт для Руководства сервера | Black Russia по всем вопросам на счет скрипта VK - https://vk.com/kizlearsexxx , последнее глобальное обновление 06.02.2024. Последний Фикс 09.02.2024
// @author       Santiago_Jackovic
// @match        https://forum.blackrussia.online/threads/*
// @include      https://forum.blackrussia.online/threads/
// @grant        none
// @license      MIT
// @icon https://freepngimg.com/thumb/eagle/20-eagle-black-siluet-png-image-download-thumb.png
// @downloadURL https://update.greasyfork.org/scripts/495489/Cheef%20Scirpt.user.js
// @updateURL https://update.greasyfork.org/scripts/495489/Cheef%20Scirpt.meta.js
// ==/UserScript==

(function () {
'use strict';
const UNACCEPT_PREFIX = 4; // Prefix that will be set when thread closes
const ACCEPT_PREFIX = 8; // Prefix that will be set when thread accepted
const PIN_PREFIX = 2; // Prefix that will be set when thread pins
const COMMAND_PREFIX = 10; // Prefix that will be set when thread send to project team
const WATCHED_PREFIX = 9;
const CLOSE_PREFIX = 7;
const buttons = [
{
title: 'Приветствие ',
content:
'[SIZE=4][FONT=courier new][CENTER]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br>' + '[CENTER] [/CENTER][/FONT][/SIZE]',
},
{
title: 'Запросить доква',
content:
'[SIZE=4][FONT=courier new][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
"[CENTER]Запрошу доказательства у администратора.[/CENTER]<br><br>" +
"[CENTER]Ожидайте ответа.[/CENTER]<br><br>" +
'[CENTER]Приятной игры на сервере ORENBURG.[/CENTER][/FONT][/SIZE]',
prefix: PIN_PREFIX,
status: true,
},
{
title: 'Наказание за форум',
content:
'[SIZE=4][FONT=courier new][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
"[CENTER]Игрок написал на вас жалобу, исходя из этой жалобы вам было выдано наказание.[/CENTER]<br><br>" +
"[CENTER]Проверю верность вредикта куратора форума , ожидайте ответа.[/CENTER]<br><br>" +
'[CENTER]Приятной игры на сервере ORENBURG.[/CENTER][/FONT][/SIZE]',
prefix: PIN_PREFIX,
status: true,
},
{
title: 'Отправить на рассмотрение',
content:
'[SIZE=4][FONT=courier new][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
"[CENTER]Ваша жалоба взята на рассмотрение. Ожидайте, пожалуйста, ответа от администрации и не нужно создавать копии этой темы.[/CENTER]<br><br>" +
"[CENTER]Ожидайте ответа.<br><br>" +
'[CENTER]Приятной игры на сервере ORENBURG[/CENTER][/FONT][/SIZE]',
prefix: PIN_PREFIX,
status: true,
},
{
title: 'Жалоба одобрена в сторону игрока',
content:
'[SIZE=4][FONT=courier new][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
"[CENTER]Ваша жалоба была одобрена и будет проведена беседа с администратором.<br>Ваше наказание будет снято.[/CENTER]<br><br>" +
'[CENTER]Приятной игры на сервере ORENBURG.[/CENTER][/FONT][/SIZE]',
prefix: WATCHED_PREFIX,
status: false,
},
{
title: 'Наказать адм',
content:
'[SIZE=4][FONT=courier new][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
"[CENTER]Ваша жалоба была одобрена и администратор будет наказан,Cпасибо за информацию.[/CENTER]<br><br>" +
'[CENTER]Приятной игры на сервере ORENBURG.[/CENTER][/FONT][/SIZE]',
prefix: WATCHED_PREFIX,
status: false,
},
{
title: 'Дублирование темы ',
content:
'[SIZE=4][FONT=courier new][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
"[CENTER]Если вы дальше будете дублировать темы, то ваш форумный аккаунт будет заблокирован на 3 дня и более.[/CENTER]<br><br>" +
"[CENTER]Приятной игры на нашем сервере.[/CENTER]<br><br>" +
'[CENTER]Отказано, закрыто.[/CENTER][/FONT][/SIZE]',
prefix: UNACCEPT_PREFIX,
status: false,
},
{
title: 'Ответ в прошлой жалобе ',
content:
'[SIZE=4][FONT=courier new][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
"[CENTER]Ответ был дан в прошлой теме [/CENTER]<br><br>" +
"[CENTER]Приятной игры на нашем сервере.[/CENTER]<br><br>" +
'[CENTER]Отказано, закрыто.[/CENTER][/FONT][/SIZE]',
prefix: UNACCEPT_PREFIX,
status: false,
},
{
title: 'Беседа с админом',
content:
'[SIZE=4][FONT=courier new][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
"[CENTER]С администратором будет проведена беседа, Cпасибо за информацию.[/CENTER]<br><br>" +
"[CENTER]Приятной игры на сервере ORENBURG.[/CENTER]<br><br>" +
'[CENTER]Закрыто.[/CENTER][/FONT][/SIZE]',
prefix: CLOSE_PREFIX,
status: false,
},
{
title: 'Ошиблись сервером',
content:
'[SIZE=4][FONT=courier new][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
"[CENTER]Вы ошиблись сервером. Подайте жалобу в разделе своего форума.[/CENTER]<br><br>" +
'[CENTER]Закрыто.[/CENTER][/FONT][/SIZE]',
prefix: CLOSE_PREFIX,
status: false,
},
{
title: 'Качество докв',
content:
'[SIZE=4][FONT=courier new][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
"[CENTER]Пересоздайте жалобу и прикрепите туда доказательства в нормальном качестве[/CENTER]<br><br>" +
"[CENTER]Приятной игры на сервере ORENBURG.[/CENTER]<br><br>" +
'[CENTER]Закрыто.[/CENTER][/FONT][/SIZE]',
prefix: CLOSE_PREFIX,
status: false,
},
{
title: 'отсутствует скриншот окна блокировки аккаунта',
content:
'[SIZE=4][FONT=courier new][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
"[CENTER]В вашей жалобе отсутствует скриншот окна блокировки аккаунта.[/CENTER]<br><br>" +
"[CENTER]Приятной игры на сервере ORENBURG.[/CENTER]<br><br>" +
'[CENTER]Отказано.[/CENTER][/FONT][/SIZE]',
prefix: CLOSE_PREFIX,
status: false,
},
{
title: 'Админ прав',
content:
'[SIZE=4][FONT=courier new][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
"[CENTER]Проверив доказательства администратора, было принято решение, что наказание выдано верно.[/CENTER]<br><br>" +
"[CENTER]Приятной игры на сервере ORENBURG.[/CENTER]<br><br>" +
'[CENTER]Закрыто.[/CENTER][/FONT][/SIZE]',
prefix: CLOSE_PREFIX,
status: false,
},
{
title: 'Админ прав,опру на самооборону',
content:
'[SIZE=4][FONT=courier new][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
"[CENTER]Проверив доказательства администратора, было принято решение, что наказание выдано верно.[/CENTER]<br><br>" +
"[CENTER]Если Dm и вправду был ответным вы должны предоставить доказательства[/CENTER]<br><br>" +
"[CENTER][COLOR=rgb(255, 0, 0)]2.19.[/COLOR] Запрещен DM (DeathMatch) — убийство или нанесение урона без веской IC причины [COLOR=rgb(255, 0, 0)]| Jail 60 минут[/COLOR][/CENTER]<br><br>" +
"[CENTER][COLOR=rgb(255, 0, 0)]Примечание:[/COLOR] разрешен ответный DM в целях защиты, обязательно иметь видео доказательство в случае наказания администрации, нанесение урона по транспорту также является нарушением данного пункта правил.[/CENTER]<br><br>" +
"[CENTER]Переподайте жалобу с прикреплёнными доказательствами[/CENTER]<br><br>" +
"[CENTER]Приятной игры на сервере ORENBURG.[/CENTER]<br><br>" +
'[CENTER]Закрыто.[/CENTER][/FONT][/SIZE]',
prefix: CLOSE_PREFIX,
status: false,
},
{
title: 'КФ прав',
content:
'[SIZE=4][FONT=courier new][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
"[CENTER]Проверив поданную жалобу на вас от игрока, было принято решение, что наказание выдано верно.[/CENTER]<br><br>" +
"[CENTER]Приятной игры на сервере ORENBURG.[/CENTER]<br><br>" +
'[CENTER]Закрыто.[/CENTER][/FONT][/SIZE]',
prefix: CLOSE_PREFIX,
status: false,
},
{
title: 'Жалоба не по форме',
content:
'[SIZE=4][FONT=courier new][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
"[CENTER]Жалоба составлена не по форме. Внимательно прочитайте правила составления жалобы, которые закреплены в этом разделе. <br><br>" +
"[CENTER]Приятной игры на сервере ORENBURG.[/CENTER]" +
'[CENTER]Отказано, закрыто.[/CENTER][/FONT][/SIZE]',
prefix: CLOSE_PREFIX,
status: false,
},
{
title: 'Доква не в имгур япикс',
content:
'[SIZE=4][FONT=courier new][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
"[CENTER]Доказательства должны быть загружены на фото/видео хостинги (YouTube, Япикс, imgur). <br><br>" +
"[CENTER]Приятной игры на сервере ORENBURG.[/CENTER]<br><br>" +
'[CENTER]Отказано, закрыто.[/CENTER][/FONT][/SIZE]',
prefix: CLOSE_PREFIX,
status: false,
},
{
title: 'Отстутствуют доказательств',
content:
'[SIZE=4][FONT=courier new][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
"[CENTER]В вашей жалобе отсутствуют доказательства.<br><br>" +
"[CENTER]Приятной игры на сервере ORENBURG.[/CENTER]<br><br>" +
'[CENTER]Закрыто.[/CENTER][/FONT][/SIZE]',
prefix: CLOSE_PREFIX,
status: false,
},
{
title: 'Недостаточно доказательст',
content:
'[SIZE=4][FONT=courier new][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
"[CENTER]В вашей жалобе недостаточно доказательств.<br><br>" +
"[CENTER]Приятной игры на сервере ORENBURG.[/CENTER]<br><br>" +
'[CENTER]Отказано.[/CENTER][/FONT][/SIZE]',
prefix: CLOSE_PREFIX,
status: false,
},
{
title: 'направить в Технический раздел',
content:
'[SIZE=4][FONT=courier new][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
"[CENTER]Внимательно ознакомившись с вашей жалобой, было решено, что вам нужно обраться в технический раздел.[/CENTER]<br><br>" +
"[CENTER]Приятной игры на сервере ORENBURG.[/CENTER]<br><br>" +
'[CENTER]Закрыто.[/CENTER][/FONT][/SIZE]',
prefix: CLOSE_PREFIX,
status: false,
},
{
title: 'Более 48 часов',
content:
'[SIZE=4][FONT=courier new][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
"[CENTER]С момента выдачи наказания прошло более 48 часов.[/CENTER]<br><br>" +
"[CENTER]Приятной игры на сервере ORENBURG.[/CENTER]<br><br>" +
'[CENTER]Закрыто.[/CENTER][/FONT][/SIZE]',
prefix: CLOSE_PREFIX,
status: false,
},
{
title: 'отсутствует скриншот выдачи наказания.',
content:
'[SIZE=4][FONT=courier new][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
"[CENTER]В вашей жалобе отсутствует скриншот выдачи наказания.<br><br>" +
"[CENTER]Приятной игры на сервере ORENBURG.[/CENTER]<br><br>" +
'[CENTER]Отказано, закрыто.[/CENTER][/FONT][/SIZE]',
prefix: CLOSE_PREFIX,
status: false,
},
{
title: 'Передано ЗГА',
content:
'[SIZE=4][FONT=courier new][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
"[CENTER]Ваша жалоба будет передана Заместителю Главного Администратора на рассмотрение. Ожидайте его ответа.<br><br>" +
'[CENTER]Приятной игры на сервере ORENBURG.[/CENTER][/FONT][/SIZE]',
prefix: PIN_PREFIX,
status: true,
},
{
title: 'Передано ГА',
content:
'[SIZE=4][FONT=courier new][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
"[CENTER]Ваша жалоба будет передана Главному Администратору на рассмотрение. Ожидайте его ответа.<br><br>" +
'[CENTER]Приятной игры на сервере ORENBURG.[/CENTER][/FONT][/SIZE]',
prefix: PIN_PREFIX,
status: true,
},
{
title: 'Передано СА',
content:
'[SIZE=4][FONT=courier new][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
"[CENTER]Ваша жалоба передана [COLOR=rgb(255, 0, 0)]Специальной администрации[/COLOR] <br><br>" +
"[CENTER] @Sander_Kligan @Clarence Crown @Myron_Capone @Dmitry Dmitrich [/CENTER] <br><br>" +
"[CENTER] Ответ может занять более 48 часов. [/CENTER] <br><br>" +
'[CENTER]Приятной игры на сервере ORENBURG.[/CENTER][/FONT][/SIZE]',
prefix: PIN_PREFIX,
status: true,
},
{
title: 'Передано Sakaro',
content:
'[SIZE=4][FONT=courier new][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
"[CENTER]Ваша жалоба передана [COLOR=rgb(44, 130, 201)]Руководителю модерации Discord [/COLOR] <br><br>" +
"[CENTER] @sakaro [/CENTER] <br><br>" +
"[CENTER] Ответ может занять более 48 часов. [/CENTER] <br><br>" +
'[CENTER]Приятной игры на сервере ORENBURG.[/CENTER][/FONT][/SIZE]',
prefix: PIN_PREFIX,
status: true,
},
{
title: 'Направить в раздел Обжалование',
content:
'[SIZE=4][FONT=courier new][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
"[CENTER]Внимательно ознакомившись с вашей жалобой, было решено, что вам нужно обраться в раздел Обжалование наказаний.<br><br>" +
"[CENTER]Приятной игры на сервере ORENBURG.[/CENTER]<br><br>" +
'[CENTER]Отказано.[/CENTER][/FONT][/SIZE]',
prefix: UNACCEPT_PREFIX,
status: false,
},

{
title: 'Снять админа',
content:
'[SIZE=4][FONT=courier new][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
"[CENTER]Администратор будет снят со своего поста.<br><br>" +
"[CENTER]Приятной игры сервере ORENBURG.[/CENTER]<br><br>" +
'[CENTER]Закрыто.[/CENTER][/FONT][/SIZE]',
prefix: CLOSE_PREFIX,
status: false,
},
{
title: 'Беседа с кф',
content:
'[SIZE=4][FONT=courier new][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
"[CENTER]С куратором форума будет проведена беседа, ваша жалоба будет перерассмотрена.<br><br>" +
"[CENTER]Приятной игры на сервере ORENBURG.[/CENTER]<br><br>" +
'[CENTER]Закрыто.[/CENTER][/FONT][/SIZE]',
prefix: CLOSE_PREFIX,
status: false,
},
{
title: 'Наказать кф',
content:
'[SIZE=4][FONT=courier new][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
"[CENTER]Куратор форума будет наказан, ваша жалоба будет перерассмотрена.<br><br>" +
"[CENTER]Приятной игры на сервере ORENBURG.[/CENTER]<br><br>" +
'[CENTER]Закрыто.[/CENTER][/FONT][/SIZE]',
prefix: CLOSE_PREFIX,
status: false,
},
{
title: 'Жалоба от 3 лица',
content:
'[SIZE=4][FONT=courier new][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
"[CENTER]Ваша жалоба составлена от 3-го лица.<br><br>" +
"[CENTER]Приятной игры на сервере ORENBURG.[/CENTER]<br><br>" +
'[CENTER]Закрыто.[/CENTER][/FONT][/SIZE]',
prefix: CLOSE_PREFIX,
status: false,
},
{
title: 'Жб с редактом',
content:
'[SIZE=4][FONT=courier new][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
"[CENTER]Доказательства должны быть без обрезок/замазок.<br><br>" +
"[CENTER]Приятной игры на сервере ORENBURG.[/CENTER]<br><br>" +
'[CENTER]Закрыто.[/CENTER][/FONT][/SIZE]',
prefix: CLOSE_PREFIX,
status: false,
},
{
title: 'Оскорбительная жалоба',
content:
'[SIZE=4][FONT=courier new][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
"[CENTER]В вашей жалобе имеется слова оскорбительного характера, данная тема рассмотрению не подлежит.<br><br>" +
'[CENTER]Закрыто.[/CENTER][/FONT][/SIZE]',
prefix: CLOSE_PREFIX,
status: false,
},
{
title: 'Некликабельная ссылка',
content:
'[SIZE=4][FONT=courier new][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
"[CENTER]Ссылка на ваше доказательство не кликабельная, создайте новую тему с нормальной ссылкой.<br><br>" +
"[CENTER]Приятной игры на сервере ORENBURG.[/CENTER]<br><br>" +
'[CENTER]Закрыто.[/CENTER][/FONT][/SIZE]',
prefix: CLOSE_PREFIX,
status: false,
},
{
title: 'Не работают доказательства',
content:
'[SIZE=4][FONT=courier new][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
"[CENTER]Ссылка на ваше доказательство работает, создайте новую тему с нормальной ссылкой.<br><br>" +
"[CENTER]Приятной игры на сервере ORENBURG.[/CENTER]<br><br>" +
'[CENTER]Закрыто.[/CENTER][/FONT][/SIZE]',
prefix: CLOSE_PREFIX,
status: false,
},
{
title: 'Нарушений от адм нету',
content:
'[SIZE=4][FONT=courier new][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
"[CENTER]Нарушений со стороны администратора нет.[/CENTER]<br><br>" +
"[CENTER]Приятной игры на сервере ORENBURG.[/CENTER]<br><br>" +
'[CENTER]Закрыто.[/CENTER][/FONT][/SIZE]',
prefix: CLOSE_PREFIX,
status: false,
},
{
title: 'Смена наказания',
content:
'[SIZE=4][FONT=courier new][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
"[CENTER]Ваше наказание будет заменено на другое.[/CENTER]<br><br>" +
"[CENTER]Приятной игры на сервере ORENBURG.[/CENTER]<br><br>" +
'[CENTER]Закрыто.[/CENTER][/FONT][/SIZE]',
prefix: CLOSE_PREFIX,
status: false,
},
{
title: 'Снять наказание',
content:
'[SIZE=4][FONT=courier new][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
"[CENTER]Ваше наказание снято.<br><br>" +
"[CENTER]Приятной игры на сервере ORENBURG.[/CENTER]<br><br>" +
'[CENTER]Закрыто.[/CENTER][/FONT][/SIZE]',
prefix: CLOSE_PREFIX,
status: false,
},
{
title: 'Нету ссылки на жб',
content:
'[SIZE=4][FONT=courier new][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
"[CENTER]Нужно предоставить ссылку на вашу жалобу.<br><br>" +
"[CENTER]Приятной игры на сервере ORENBURG.[/CENTER]<br><br>" +
'[CENTER]Закрыто.[/CENTER][/FONT][/SIZE]',
prefix: CLOSE_PREFIX,
status: false,
},
{
title: 'Нету /time',
content:
'[SIZE=4][FONT=courier new][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
"[CENTER]В вашей жалобе отсутствует /time.<br><br>" +
"[CENTER]Приятной игры на сервере ORENBURG.[/CENTER]<br><br>" +
'[CENTER]Закрыто.[/CENTER][/FONT][/SIZE]',
prefix: CLOSE_PREFIX,
status: false,
},

{
title: 'Жалоба оффтоп',
content:
'[SIZE=4][FONT=courier new][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
"[CENTER]Ваша тема никак не отностится к разделу жалобы на администрацию.<br><br>" +
"[CENTER]Приятной игры на сервере ORENBURG.[/CENTER]<br><br>" +
'[CENTER]Закрыто.[/CENTER][/FONT][/SIZE]',
prefix: CLOSE_PREFIX,
status: false,
},
{
title: 'Наказать админа и снять наказание',
content:
'[SIZE=4][FONT=courier new][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
"[CENTER]Ваша жалоба одобрена, администратор будет наказан.<br>Ваше наказание будет снято.[/CENTER]<br><br>" +
'[CENTER]Приятной игры на сервере ORENBURG.[/CENTER]',
prefix: WATCHED_PREFIX,
status: false,
},
{
title: 'Подделка докв',
content:
'[SIZE=4][FONT=courier new][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
"[CENTER]Ваши доказательства подделаны, форумный аккаунт будет заблокирован.[/CENTER]<br><br>" +
'[CENTER]Закрыто.[/CENTER][/FONT][/SIZE]',
prefix: WATCHED_PREFIX,
status: false,
},
{
	  title: '----------  Обжалования  ------------------------------------------------------------------------------------------------------------------------',
	},
	{
	  title: 'Приветствие',
	  content:
		'[SIZE=4][FONT=book antiqua][CENTER]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br>' + '[CENTER]                       [/CENTER][/FONT][/SIZE]',
	},
    {
	  title: 'Отправить на рассмотрение',
	  content:
		'[SIZE=4][FONT=book antiqua][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
		"[CENTER]Ваше обжалование взято на рассмотрение. Ожидайте, пожалуйста, ответа от администрации и не нужно создавать копии этой темы.[/CENTER]<br><br>" +
		'[CENTER][Color=Orange]Ожидайте ответа.[/CENTER][/FONT][/SIZE][/color]',
	  prefix: PIN_PREFIX,
	  status: true,
	},
    {
	  title: 'грубое нарушение',
	  content:
		'[SIZE=4][FONT=book antiqua][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
		"[CENTER]В обжаловании отказано. Так как ваше наказание было слишком грубым. (Например: большое количество нарушенных правил сервреа, грубое нарушение с вашей стороны и т.д.)<br><br>" +
		'[CENTER][Color=Red]Отказано, закрыто.[/CENTER][/FONT][/SIZE][/color]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
    {
	  title: 'Обжалование нонрп обман',
	  content:
		'[SIZE=4][FONT=book antiqua][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
		"[CENTER]Если вы хотите хотите обжаловать наказание за НонРП обман вы должны сами связаться с человеком, которого обманули,После чего он должен написать на вас обжалование прикрепив доказательства договора о возврате имущества,ссылку на жалобу которую писал на вас, скриншот окна блокировки обманувшего, ссылки на ВК обеих сторон,По другому вы никак не сможете обжаловать наказание за НонРП обман.<br><br>" +
	  	'[CENTER][Color=Red]Отказано, закрыто.[/CENTER][/FONT][/SIZE][/color]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
    {
	  title: 'Обжалование ник',
	  content:
		'[SIZE=4][FONT=book antiqua][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
		"[CENTER]Ваш аккаунт будет разблокирован ровно на 24 часа, если в течении 24 часа вы не смените свой никнейм, то вы будете заново заблокированы, для смены ника используйте /mm 10, доказательство прикрепить сюда.<br><br>" +
		'[CENTER][Color=Orange]Ожидаю вашего ответа.[/CENTER][/FONT][/SIZE][/color]',
	  prefix: PIN_PREFIX,
	  status: true,
	},
	{
	  title: 'Запрос ссылки вк',
	  content:
		'[SIZE=4][FONT=book antiqua][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
		"[CENTER]Прикрепите ссылку на ваш Вконтакте.<br><br>" +
		'[CENTER][Color=Orange]Ожидаю вашего ответа.[/CENTER][/FONT][/SIZE][/color]',
	  prefix: PIN_PREFIX,
	  status: true,
	},
    {
	  title: 'Обжалование ппв',
	  content:
		'[SIZE=4][FONT=book antiqua][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
		'[CENTER]Восстановите пароль через группу в ВК и пересоздайте жалобу. Также приложите скриншот из ВК, что вы изменили пароль, но не забудьте замазать сам пароль.[/CENTER][/FONT][/SIZE][/color]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
 {
	  title: 'Не осознали вину',
	  content:
		'[SIZE=4][FONT=book antiqua][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
		"[CENTER]В обжалование отказано, в данный момент мы не уверены что вы осознали свой поступок.<br><br>" +
		'[CENTER][Color=Red]Отказано, закрыто.[/CENTER][/FONT][/SIZE][/color]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
	 {
	  title: 'Не готовы пойти на встречу',
	  content:
		'[SIZE=4][FONT=book antiqua][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
		"[CENTER]В обжалование отказано, в данный момент мы не готовы пойти на встречу и амнистировать ваше наказание.<br><br>" +
		'[CENTER][Color=Red]Отказано, закрыто.[/CENTER][/FONT][/SIZE][/color]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
    {
	  title: 'Обжалованию не подлежит',
	  content:
        '[SIZE=4][FONT=book antiqua][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
		"[CENTER]Данное наказание не подлежит обжалованию.<br><br>" +
		'[CENTER][Color=Red]Отказано, закрыто.[/CENTER][/FONT][/SIZE][/color]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
    {
	  title: 'Одобрить обжалование',
	  content:
		'[SIZE=4][FONT=book antiqua][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
		"[CENTER]Ваше обжалование одобрено и ваше наказание будет полностью снято.<br><br>" +
		'[CENTER][Color=Green]Одобрено.[/CENTER][/FONT][/SIZE][/color]<br><br>',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
    {
	  title: 'Отказать обжалование',
	  content:
		'[SIZE=4][FONT=book antiqua][CENTER] {{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
		"[CENTER]В обжаловании отказано.<br><br>" +
		'[CENTER][Color=Red]Закрыто.[/CENTER][/FONT][/SIZE][/color]',
	   prefix: CLOSE_PREFIX,
	  status: false,
	},
     {
	  title: 'Снизить наказание до минимальных мер',
	  content:
		'[SIZE=4][FONT=book antiqua][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
		"[CENTER]Ваше наказание будет снижено до минимальных мер.<br><br>" +
		'[CENTER][Color=#AEF359]Одобрено.[/CENTER][/FONT][/SIZE][/color]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
     {
	  title: 'Отстутствуют доказательства',
	  content:
		'[SIZE=4][FONT=book antiqua][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
	"[CENTER]В вашем обжаловании отсутствуют доказательства.<br><br>" +
		'[CENTER][Color=Red]Закрыто.[/CENTER][/FONT][/SIZE][/color]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
    {
	  title: 'Отписал не тот игрок',
	  content:
		'[SIZE=4][FONT=book antiqua][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
		"[CENTER]Вам в профиле написал не тот игрок которого вы обманули.<br><br>" +
		'[CENTER][Color=Red]Закрыто.[/CENTER][/FONT][/SIZE][/color]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
     {
	  title: 'Отстутствует скрин окна бана',
	  content:
		'[SIZE=4][FONT=book antiqua][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
		"[CENTER]В вашем обжаловании отсутствует скриншот окна блокировки аккаунта.<br><br>" +
		'[CENTER][Color=Red]Закрыто.[/CENTER][/FONT][/SIZE][/color]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
    {
	  title: 'Дублирование тем',
	  content:
		'[SIZE=4][FONT=book antiqua][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
		"[CENTER]Если вы дальше будете дублировать темы в данном разделе, то ваш форумный аккаунт будет заблокирован.<br><br>" +
		'[CENTER][Color=Red]Закрыто.[/CENTER][/FONT][/SIZE][/color]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
    {
	  title: 'Доква подделаны',
	  content:
		'[SIZE=4][FONT=courier new][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
    "[CENTER]Ваши доказательства подделаны, форумный аккаунт будет заблокирован.[/CENTER]<br><br>" +
    '[CENTER]Закрыто.[/CENTER][/FONT][/SIZE]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
    {
	  title: 'Уже есть мин. наказание',
	  content:
		'[SIZE=4][FONT=book antiqua][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
		"[CENTER]Вам итак выдано минимальное наказание за нарушение.<br><br>" +
		'[CENTER][Color=Red]Закрыто.[/CENTER][/FONT][/SIZE][/color]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
    {
	  title: 'Снизить до 30 дней',
	  content:
		'[SIZE=4][FONT=book antiqua][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
		"[CENTER]Ваше наказание будет снижено до 30 дней.<br><br>" +
		'[CENTER][Color=green]Одобрено.[/CENTER][/FONT][/SIZE][/color]',
      prefix: ACCEPT_PREFIX,
	  status: false,
	},
	 {
	  title: 'Снизить до 15 дней',
	  content:
		'[SIZE=4][FONT=book antiqua][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
		"[CENTER]Ваше наказание будет снижено до 15 дней.<br><br>" +
		'[CENTER][Color=green]Одобрено.[/CENTER][/FONT][/SIZE][/color]',
      prefix: ACCEPT_PREFIX,
	  status: false,
	},
	 {
	  title: 'Снизить до 7 дней',
	  content:
		'[SIZE=4][FONT=book antiqua][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
		"[CENTER]Ваше наказание будет снижено до 7 дней.<br><br>" +
		'[CENTER][Color=green]Одобрено.[/CENTER][/FONT][/SIZE][/color]',
      prefix: ACCEPT_PREFIX,
	  status: false,
	},
    {
	  title: 'Обжалование не по форме',
	  content:
		'[SIZE=4][FONT=book antiqua][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
		"[CENTER]Обжалование составлено не по форме. Внимательно прочитайте правила составления обжалования по этой ссылке [COLOR=rgb(226, 80, 65)][URL='https://forum.blackrussia.online/index.php?threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BF%D0%BE%D0%B4%D0%B0%D1%87%D0%B8-%D0%B7%D0%B0%D1%8F%D0%B2%D0%BA%D0%B8-%D0%BD%D0%B0-%D0%BE%D0%B1%D0%B6%D0%B0%D0%BB%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D0%B5-%D0%BD%D0%B0%D0%BA%D0%B0%D0%B7%D0%B0%D0%BD%D0%B8%D1%8F.3429398/']*Правила подачи*[/URL][/COLOR].<br><br>" +
		'[CENTER][Color=Red]Закрыто.[/CENTER][/FONT][/SIZE][/color]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
    {
	  title: 'Направить в раздел жб на адм',
	  content:
		'[SIZE=4][FONT=book antiqua][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
		"[CENTER]Внимательно ознакомившись с вашим обжалованием, было решено, что вам нужно обраться в раздел жалоб на администрацию.<br><br>" +
		'[CENTER][Color=Red]Отказано.[/CENTER][/FONT][/color][/SIZE]',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
    {
        title: 'Направить в раздел жб на тех',
	  content:
		'[SIZE=4][FONT=book antiqua][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
		"[CENTER]Внимательно ознакомившись с вашим обжалованием, было решено, что вам нужно обратиться в раздел жалоб на технических специалистов (наказания выданны техническим специалистом не подлежат обжалованию.).<br><br>" +
		'[CENTER][Color=Red]Отказано.[/CENTER][/FONT][/SIZE][/color]',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
    {
      title: 'Доказательство в соц сети',
	  content:
		'[SIZE=4][FONT=book antiqua][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
		"[CENTER]Загрузка доказательств в соц. сети (ВКонтакте, instagram) запрещается, доказательства должны быть загружены на фото/видео хостинги (YouTube, Япикс, imgur). <br><br>" +
		'[CENTER][Color=Red]Отказано, закрыто.[/CENTER][/FONT][/SIZE][/color]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
    {
	  title: 'Ошиблись сервером',
	  content:
		'[SIZE=4][FONT=book antiqua][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
		"[CENTER]Вы ошиблись сервером. Подайте обжалование в разделе своего форума.[/CENTER]<br><br>" +
		'[CENTER][Color=Red]Закрыто.[/CENTER][/FONT][/SIZE][/color]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
    {
	  title: 'NRP обман 24 часа',
	  content:
		'[SIZE=4][FONT=book antiqua][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
		"[CENTER]Аккаунт будет разблокирован. если в течении 24-ех часов ущерб не будет возмещён владельцу согласно вашей договоренности акканут будет заблокирован навсегда.[/CENTER]<br><br>" +
		'[CENTER]Вы должны прислать видео доказательство возврата имущества в данную тему.[/CENTER][/FONT][/SIZE]',
	  prefix: PIN_PREFIX,
	  status: true,
	},
    {
	  title: 'Игрок вернул ущерб',
	  content:
		'[SIZE=4][FONT=book antiqua][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
		"[CENTER]Спасибо за содействие, впредь не повтряйте данных ошибок ведь шанса на обжалование больше не будет.[/CENTER]<br><br>" +
		'[CENTER][Color=GREEN]Одобрено.[/CENTER][/FONT][/SIZE][/color]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
    {
      title: 'Мут/джаил',
	  content:
		'[SIZE=4][FONT=book antiqua][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
		"[CENTER]Ваше наказание не столь строгое для обжалования. <br><br>" +
		'[CENTER][Color=Red]Закрыто.[/CENTER][/FONT][/SIZE][/color]',
	  prefix: CLOSE_PREFIX,
	  status: false,
     },
     {
      title: 'Обжалование оффтоп',
	  content:
		'[SIZE=4][FONT=book antiqua][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
		"[CENTER]Ваша тема никак не отностится к разделу обжалования наказаний. <br><br>" +
		'[CENTER][Color=Red]Закрыто.[/CENTER][/FONT][/SIZE][/color]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
     {
	  title: 'Передать ГА',
	  content:
		'[SIZE=4][FONT=book antiqua][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
		"[CENTER]Ваше обжалование передано Главному администратору.[/CENTER]<br><br>" +
		'[CENTER][Color=#ED7014]Ожидайте ответа.[/CENTER][/FONT][/SIZE][/color]',
	  prefix: PIN_PREFIX,
	  status: true,
	},
     {
	  title: 'Передать СА',
	  content:
		'[SIZE=4][FONT=book antiqua][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
		"[CENTER]Ваше обжалование передано Специальной администрации.[/CENTER]<br><br>" +
		'[CENTER][Color=#ED7014]Ожидайте ответа.[/CENTER][/FONT][/SIZE][/color]',
	  prefix: PIN_PREFIX,
	  status: true,
	},
];

$(document).ready(() => {
// Загрузка скрипта для обработки шаблонов
$('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');

// Добавление кнопок при загрузке страницы
addButton('На рассмотрение', 'pin');
addButton('КП', 'teamProject');
addButton('Одобрено', 'accepted');
addButton('Отказано', 'unaccept');
addButton('Закрыто', 'close');
addButton('Ответы', 'selectAnswer');

// Поиск информации о теме
const threadData = getThreadData();

$('button#pin').click(() => editThreadData(PIN_PREFIX, true));
$('button#accepted').click(() => editThreadData(ACCEPT_PREFIX, false));
$('button#teamProject').click(() => editThreadData(COMMAND_PREFIX, true));
$('button#close').click(() => editThreadData(CLOSE_PREFIX, false));
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
const threadTitle =
$('.p-title-value')[0].lastChild.textContent;

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