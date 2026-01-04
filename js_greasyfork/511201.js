// ==UserScript==
// @name Руководство ARKHANGELSK
// @namespace https://forum.blackrussia.online
// @version 1.5
// @description ❤
// @author Persona_Makaravll
// @match https://forum.blackrussia.online/threads/*
// @include https://forum.blackrussia.online/threads/
// @grant none
// @license MIT
// @collaborator ya
// @icon 
// @downloadURL https://update.greasyfork.org/scripts/511201/%D0%A0%D1%83%D0%BA%D0%BE%D0%B2%D0%BE%D0%B4%D1%81%D1%82%D0%B2%D0%BE%20ARKHANGELSK.user.js
// @updateURL https://update.greasyfork.org/scripts/511201/%D0%A0%D1%83%D0%BA%D0%BE%D0%B2%D0%BE%D0%B4%D1%81%D1%82%D0%B2%D0%BE%20ARKHANGELSK.meta.js
// ==/UserScript==
 
(function () {
'use strict';
const UNACCEPT_PREFIX = 4; // Prefix that will be set when thread closes
const ACCEPT_PREFIX = 8; // Prefix that will be set when thread accepted
const RESHENO_PREFIX = 6; // Prefix that will be set when solving the problem
const PIN_PREFIX = 2; // Prefix that will be set when thread pins
const GA_PREFIX = 12; // Prefix that will be set when thread send to ga
const COMMAND_PREFIX = 10; // Prefix that will be set when thread send to project team
const WATCHED_PREFIX = 9;
const CLOSE_PREFIX = 7;
const SA_PREFIX = 11;
const TEXU_PREFIX = 13;
const buttons = [
{
title: ' Свой Ответ ',
content:
'[SIZE=4][FONT=Times New Roman][CENTER][Color=rgb(255, 0, 255)][B]{{ greeting }},[/Color] уважаемый {{ user.mention }}!<br><br>'+
"Твой текст <br><br>",
},
{
title: ' На рассмотрение (запрос докв) ',
content:
'[SIZE=4][FONT=Times New Roman][CENTER][Color=rgb(255, 0, 255)]{{ greeting }},[/Color] уважаемый {{ user.mention }}!<br><br>'+
"[CENTER]Запрошу доказательства у администратора. Просьба не создавать подобных тем, иначе ваш Форумный аккаунт может быть [Color=rgb(255, 0, 0)][U]заблокирован.[/U][/Color][/CENTER]<br><br>"+
'[CENTER][Color=rgb(255, 255, 0)]На Рассмотрении...[/Color][/CENTER][/SIZE]',
prefix: PIN_PREFIX,
status: true,
},
{
title: ' На рассмотрение ',
content:
'[SIZE=4][FONT=Times New Roman][CENTER][Color=rgb(255, 0, 255)]{{ greeting }},[/Color] уважаемый {{ user.mention }}!<br><br>'+
"[CENTER]Ваша жалоба взята на рассмотрение. Просьба не создавать подобных тем, иначе ваш Форумный аккаунт может быть [Color=rgb(255, 0, 0)][U]заблокирован.[/U][/Color][/CENTER]<br><br>"+
'[CENTER][Color=rgb(255, 255, 0)]На Рассмотрении...[/Color][/CENTER][/SIZE]',
prefix: PIN_PREFIX,
status: true,
},
{
title: '𓆩𓆩𓆩𓆩𓆩𓆩𓆩𓆩𓆩𓆩𓆩𓆩𓆩𓆩𓆩𓆩𓆩𓆩𓆩𓆩𓆩𓆩𓆩𓆩𓆩𓆩𓆩𓆩𓆩𓆩𓆩𓆩𓆩𓆩𓆩𓆩𓆩𓆩𓆩𓆩𓆩𓆩𓆩𓆩ОТКАЗЫ𓆪𓆪𓆪𓆪𓆪𓆪𓆪𓆪𓆪𓆪𓆪𓆪𓆪𓆪𓆪𓆪𓆪𓆪𓆪𓆪𓆪𓆪𓆪𓆪𓆪𓆪𓆪𓆪𓆪𓆪𓆪𓆪𓆪𓆪𓆪𓆪𓆪𓆪𓆪𓆪𓆪𓆪𓆪𓆪'
},
{
title: ' Не по Форме ',
content:
'[SIZE=4][FONT=Times New Roman][CENTER][Color=rgb(255, 0, 255)]{{ greeting }},[/color] уважаемый {{ user.mention }}!<br><br>'+
"[CENTER]Ваша жалоба составлена не по форме.<br>"+
"[CENTER]Ознакомьтесь с [URL='https://forum.blackrussia.online/threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BF%D0%BE%D0%B4%D0%B0%D1%87%D0%B8-%D0%B6%D0%B0%D0%BB%D0%BE%D0%B1-%D0%BD%D0%B0-%D0%B0%D0%B4%D0%BC%D0%B8%D0%BD%D0%B8%D1%81%D1%82%D1%80%D0%B0%D1%86%D0%B8%D1%8E.3429349/'][COLOR=rgb(255,0,0)]«правилами подачи жалоб на администрацию».[/color][/URL][/CENTER]<br><br>"+
"[CENTER][Color=rgb(255, 0, 0)]Отказано.[/color]<br>"+
'[CENTER]Приятной игры и времяпровождения на сервере [COLOR=rgb(204, 216, 174)]ARKHANGELSK[/COLOR].[/CENTER][/SIZE]',
prefix: UNACCEPT_PREFIX,
status: false,
},
{
title: ' Подделка докв, обман адм ',
content:
'[SIZE=4][FONT=Times New Roman][CENTER][Color=rgb(255, 0, 255)]{{ greeting }},[/color] уважаемый {{ user.mention }}!<br><br>'+
"[CENTER]В вашей жалобе подделаны доказательства Ваш форумный аккаунт будет заблокирован за обман администрации.<br>"+
"[CENTER][Color=rgb(255, 0, 0)]Отказано.[/color]<br>"+
'[CENTER]Приятной игры и времяпровождения на сервере [COLOR=rgb(204, 216, 174)]ARKHANGELSK[/COLOR].[/CENTER][/SIZE]',
prefix: UNACCEPT_PREFIX,
status: false,
},
{
title: ' Нет Док-в ',
content:
'[SIZE=4][FONT=Times New Roman][CENTER][Color=rgb(255, 0, 255)]{{ greeting }},[/Color] уважаемый {{ user.mention }}!<br><br>'+
"[CENTER]В жалобе отсутствуют доказательство о нарушении от администратора. Создайте повторную жалобу и прикрепите доказательства.<br><br>"+
"[CENTER][Color=rgb(255, 0, 0)]Отказано.[/color]<br>"+
'[CENTER]Приятной игры и времяпровождения на сервере [COLOR=rgb(204, 216, 174)]ARKHANGELSK[/COLOR].[/CENTER][/SIZE]',
prefix: UNACCEPT_PREFIX,
status: false,
},
{
title: ' Наказание выдано верно ',
content:
'[SIZE=4][FONT=Times New Roman][CENTER][Color=rgb(255, 0, 255)]{{ greeting }},[/color] уважаемый {{ user.mention }}!<br><br>'+
"[CENTER]Проверив доказательства администратора, было принято решение, что наказание выдано верно.<br>"+
"[CENTER]Впредь не нарушайте правила сервера, ознакомиться можно по ссылке - [URL='https://forum.blackrussia.online/threads/%D0%9E%D0%B1%D1%89%D0%B8%D0%B5-%D0%BF%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%B5%D1%80%D0%B2%D0%B5%D1%80%D0%BE%D0%B2.312571/'][COLOR=rgb(255,0,0)]««Общие правила серверов»».[/color][/URL][/CENTER]<br><br>"+
"[CENTER][Color=rgb(255, 0, 0)]Отказано.[/color]<br>"+
'[CENTER]Приятной игры и времяпровождения на сервере [COLOR=rgb(204, 216, 174)]ARKHANGELSK[/COLOR].[/CENTER][/SIZE]',
prefix: UNACCEPT_PREFIX,
status: false,
},
{
title: ' Прошло 72 часа ',
content:
'[SIZE=4][FONT=Times New Roman][CENTER][Color=rgb(255, 0, 255)]{{ greeting }},[/Color] уважаемый {{ user.mention }}!<br><br>'+
"[CENTER] С момента получения наказания прошло [Color=rgb(255, 0, 0)]72 часа[/color],жалоба не подлежит рассмотрению. <br><br>"+
"[CENTER][Color=rgb(255, 0, 0)]Отказано.[/color]<br>"+
'[CENTER]Приятной игры и времяпровождения на сервере [COLOR=rgb(204, 216, 174)]ARKHANGELSK[/COLOR].[/CENTER][/SIZE]',
prefix: UNACCEPT_PREFIX,
status: false,
},
{
title: ' Недостаточно Док-в ',
content:
'[SIZE=4][FONT=Times New Roman][CENTER][Color=rgb(255, 0, 255)]{{ greeting }},[/Color] уважаемый {{ user.mention }}!<br><br>'+
"[CENTER] Недостаточно доказательств, чтобы корректно рассмотреть данную жалобу.<br><br>"+
"[CENTER][Color=rgb(255, 0, 0)]Отказано.[/color]<br>"+
'[CENTER]Приятной игры и времяпровождения на сервере [COLOR=rgb(204, 216, 174)]ARKHANGELSK[/COLOR].[/CENTER][/SIZE]',
prefix: UNACCEPT_PREFIX,
status: false,
},
{
title: ' Ошиблись Разделом/Сервером ',
content:
'[SIZE=4][FONT=Times New Roman][CENTER][Color=rgb(255, 0, 255)]{{ greeting }},[/Color] уважаемый {{ user.mention }}!<br><br>'+
"[CENTER] Вы ошиблись разделом / сервером. Переподайте жалобу в нужный раздел / сервер.<br><br>"+
"[CENTER][Color=rgb(255, 0, 0)]Отказано.[/color]<br>"+
'[CENTER]Приятной игры и времяпровождения на сервере [COLOR=rgb(204, 216, 174)]ARKHANGELSK[/COLOR].[/CENTER][/SIZE]',
prefix: UNACCEPT_PREFIX,
status: false,
},
{
title: ' Не работают Док-ва ',
content:
'[SIZE=4][FONT=Times New Roman][CENTER][Color=rgb(255, 0, 255)]{{ greeting }},[/Color] уважаемый {{ user.mention }}!<br><br>'+
"[CENTER] Не работают доказательства.<br><br>"+
"[CENTER][Color=rgb(255, 0, 0)]Отказано.[/color]<br>"+
'[CENTER]Приятной игры и времяпровождения на сервере [COLOR=rgb(204, 216, 174)]ARKHANGELSK[/COLOR].[/CENTER][/SIZE]',
prefix: UNACCEPT_PREFIX,
status: false,
},
{
title: ' Дубликат ',
content:
'[SIZE=4][FONT=Times New Roman][CENTER][Color=rgb(255, 0, 255)]{{ greeting }},[/Color] уважаемый {{ user.mention }}!<br><br>'+
"[CENTER] Прекратите создавать дубликаты жалоб. В дальнейшем, ваш форумный аккаунт будет заблокирован.<br><br>"+
"[CENTER][Color=rgb(255, 0, 0)]Отказано.[/color]<br>"+
'[CENTER]Приятной игры и времяпровождения на сервере [COLOR=rgb(204, 216, 174)]ARKHANGELSK[/COLOR].[/CENTER][/SIZE]',
prefix: UNACCEPT_PREFIX,
status: false,
},
{
title: ' Нет Нарушений АДМ ',
content:
'[SIZE=4][FONT=Times New Roman][CENTER][Color=rgb(255, 0, 255)]{{ greeting }},[/Color] уважаемый {{ user.mention }}!<br><br>'+
"[CENTER]Нарушений со стороны администратора нет.<br><br>"+
"[CENTER][Color=rgb(255, 0, 0)]Отказано.[/color]<br>"+
'[CENTER]Приятной игры и времяпровождения на сервере [COLOR=rgb(204, 216, 174)]ARKHANGELSK[/COLOR].[/CENTER][/SIZE]',
prefix: UNACCEPT_PREFIX,
status: false,
},
{
title: ' Жб от 3 лица ',
content:
'[SIZE=4][FONT=Times New Roman][CENTER][Color=rgb(255, 0, 255)]{{ greeting }},[/Color] уважаемый {{ user.mention }}!<br><br>'+
"[CENTER]Жалоба составлена от 3 лица. Соответственно рассмотрению - не подлежит.<br><br>"+
"[CENTER][Color=rgb(255, 0, 0)]Отказано.[/color]<br>"+
'[CENTER]Приятной игры и времяпровождения на сервере [COLOR=rgb(204, 216, 174)]ARKHANGELSK[/COLOR].[/CENTER][/SIZE]',
prefix: UNACCEPT_PREFIX,
status: false,
},
{
title: ' В Обжалование Наказаний ',
content:
'[SIZE=4][FONT=Times New Roman][CENTER][Color=rgb(255, 0, 255)]{{ greeting }},[/Color] уважаемый {{ user.mention }}!<br><br>'+
"[CENTER]В вашем случае нужно было сразу реагировать на выданное наказание и обращаться в раздел жалоб на администрацию, в настоящий момент срок написания жалобы прошел.<br>"+
"[CENTER]Обратитесь в раздел [URL='https://forum.blackrussia.online/forums/%D0%9E%D0%B1%D0%B6%D0%B0%D0%BB%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D0%B5-%D0%BD%D0%B0%D0%BA%D0%B0%D0%B7%D0%B0%D0%BD%D0%B8%D0%B9.2501/'][COLOR=rgb(255,0,0)]««Обжалование наказаний»».[/color][/URL][/CENTER].<br><br>"+
"[CENTER][Color=rgb(255, 0, 0)]Отказано.[/color]<br>"+
'[CENTER]Приятной игры и времяпровождения на сервере [COLOR=rgb(204, 216, 174)]ARKHANGELSK[/COLOR].[/CENTER][/SIZE]',
prefix: UNACCEPT_PREFIX,
status: false,
},
{
title: ' Уже Был Дан Ответ ',
content:
'[SIZE=4][FONT=Times New Roman][CENTER][Color=rgb(255, 0, 255)]{{ greeting }},[/Color] уважаемый {{ user.mention }}!<br><br>'+
"[CENTER]Вам уже ранее был дан корректный ответ, за создание дубликатов этой темы ваш форумный аккаунт может быть заблокирован.<br><br>"+
"[CENTER][Color=rgb(255, 0, 0)]Отказано.[/color]<br>"+
'[CENTER]Приятной игры и времяпровождения на сервере [COLOR=rgb(204, 216, 174)]ARKHANGELSK[/COLOR].[/CENTER][/SIZE]',
prefix: UNACCEPT_PREFIX,
status: false,
},
{
title: ' Нужна ссылка на отказ Куратора ',
content:
'[SIZE=4][FONT=Times New Roman][CENTER][Color=rgb(255, 0, 255)]{{ greeting }},[/Color] уважаемый {{ user.mention }}!<br><br>'+
"[CENTER]Создайте повторно тему,прикрепив в ней ссылку на отказанную жалобу от Куратора.<br><br>"+
"[CENTER][Color=rgb(255, 0, 0)]Отказано.[/color]<br>"+
'[CENTER]Приятной игры и времяпровождения на сервере [COLOR=rgb(204, 216, 174)]ARKHANGELSK[/COLOR].[/CENTER][/SIZE]',
prefix: UNACCEPT_PREFIX,
status: false,
},
{
title: ' Окно Блокировки ',
content:
'[SIZE=4][FONT=Times New Roman][CENTER][Color=rgb(255, 0, 255)]{{ greeting }},[/Color] уважаемый {{ user.mention }}!<br><br>'+
"[CENTER]Прикрепите в новой жалобе окно блокировки игрового аккаунта при входе в игру.<br><br>"+
"[CENTER][Color=rgb(255, 0, 0)]Отказано.[/color]<br>"+
'[CENTER]Приятной игры и времяпровождения на сервере [COLOR=rgb(204, 216, 174)]ARKHANGELSK[/COLOR].[/CENTER][/SIZE]',
prefix: UNACCEPT_PREFIX,
status: false,
},
{
title: ' ЖБ На Теха ',
content:
'[SIZE=4][FONT=Times New Roman][CENTER][Color=rgb(255, 0, 255)]{{ greeting }},[/Color] уважаемый {{ user.mention }}!<br><br>'+
"[CENTER]Данный администратор является или являлся техническим специалистом, поэтому вам необходимо обратиться в раздел [URL='https://forum.blackrussia.online/forums/%D0%A1%D0%B5%D1%80%D0%B2%D0%B5%D1%80-%E2%84%9656-arkhangelsk.2471/'][COLOR=rgb(255,0,0)]««Жалобы на технических специалистов»».[/color][/URL][/CENTER].<br><br>"+
"[CENTER][Color=rgb(255, 0, 0)]Отказано.[/color]<br>"+
'[CENTER]Приятной игры и времяпровождения на сервере [COLOR=rgb(204, 216, 174)]ARKHANGELSK[/COLOR].[/CENTER][/SIZE]',
prefix: UNACCEPT_PREFIX,
status: false,
},
{
title: ' Неадекватное Содержание ',
content:
'[SIZE=4][FONT=Times New Roman][CENTER][Color=rgb(255, 0, 255)]{{ greeting }},[/Color] уважаемый {{ user.mention }}!<br><br>'+
"[CENTER]Жалобы с подобным содержанием не подлежат рассмотрению.<br><br>"+
"[CENTER][Color=rgb(255, 0, 0)]Отказано.[/color]<br>"+
'[CENTER]Приятной игры и времяпровождения на сервере [COLOR=rgb(204, 216, 174)]ARKHANGELSK[/COLOR].[/CENTER][/SIZE]',
prefix: UNACCEPT_PREFIX,
status: false,
},
{
title: ' На Скрине Читы/Сборка ',
content:
'[SIZE=4][FONT=Times New Roman][CENTER][Color=rgb(255, 0, 255)]{{ greeting }},[/Color] уважаемый {{ user.mention }}!<br><br>'+
"[CENTER]Ваша Жалоба НЕ подлежит Рассмотрению, поскольку вы используете НЕ Оригинальные файлы Игры. (Сборка/Постороннее ПО)<br><br>"+
"[CENTER][Color=rgb(255, 0, 0)]Отказано.[/color]<br>"+
'[CENTER]Приятной игры и времяпровождения на сервере [COLOR=rgb(204, 216, 174)]ARKHANGELSK[/COLOR].[/CENTER][/SIZE]',
prefix: UNACCEPT_PREFIX,
status: false,
},
{
title: ' Наказание Выдано По Форуму,Верно ',
content:
'[SIZE=4][FONT=Times New Roman][CENTER][Color=rgb(255, 0, 255)]{{ greeting }},[/color] уважаемый {{ user.mention }}!<br><br>'+
"[CENTER]Наказание было выдано по жалобе на форуме. Проверив доказательство, было принято решение, что наказание выдано верно.<br>"+
"[CENTER]Впредь не нарушайте правила сервера, ознакомиться можно по ссылке - [URL='https://forum.blackrussia.online/threads/%D0%9E%D0%B1%D1%89%D0%B8%D0%B5-%D0%BF%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%B5%D1%80%D0%B2%D0%B5%D1%80%D0%BE%D0%B2.312571/'][COLOR=rgb(255,0,0)]««Общие правила серверов».».[/color][/URL][/CENTER]<br><br>"+
"[CENTER][Color=rgb(255, 0, 0)]Отказано.[/color]<br>"+
'[CENTER]Приятной игры и времяпровождения на сервере [COLOR=rgb(204, 216, 174)]ARKHANGELSK[/COLOR].[/CENTER][/SIZE]',
prefix: UNACCEPT_PREFIX,
status: false,
},
{
title: '𓆩𓆩𓆩𓆩𓆩𓆩𓆩𓆩𓆩𓆩𓆩𓆩𓆩𓆩𓆩𓆩𓆩𓆩𓆩𓆩𓆩𓆩𓆩𓆩𓆩𓆩𓆩𓆩𓆩𓆩𓆩𓆩𓆩𓆩𓆩𓆩ОДОБРЕНИЯ𓆪𓆪𓆪𓆪𓆪𓆪𓆪𓆪𓆪𓆪𓆪𓆪𓆪𓆪𓆪𓆪𓆪𓆪𓆪𓆪𓆪𓆪𓆪𓆪𓆪𓆪𓆪𓆪𓆪𓆪𓆪𓆪𓆪𓆪𓆪𓆪'
},
{
title: ' Одобрено,беседа ',
content:
'[SIZE=4][FONT=Times New Roman][CENTER][Color=rgb(255, 0, 255)]{{ greeting }},[/Color] уважаемый {{ user.mention }}!<br><br>'+
"[CENTER]Ваша жалоба была одобрена. С администратором будет проведена беседа.<br><br>"+
"[CENTER][COLOR=rgb(0, 255, 0)]Одобрено.[/color]<br>"+
'[CENTER]Приятной игры и времяпровождения на сервере [COLOR=rgb(204, 216, 174)]ARKHANGELSK[/COLOR].[/CENTER][/SIZE]',
prefix: ACCEPT_PREFIX,
status: false,
},
{
title: ' Наказание будет снято ',
content:
'[SIZE=4][FONT=Times New Roman][CENTER][Color=rgb(255, 0, 255)]{{ greeting }},[/Color] уважаемый {{ user.mention }}!<br><br>'+
"[CENTER]Наказание будет снято. С администратором проведена беседа.<br><br>"+
"[CENTER][COLOR=rgb(0, 255, 0)]Одобрено.[/color]<br>"+
'[CENTER]Приятной игры и времяпровождения на сервере [COLOR=rgb(204, 216, 174)]ARKHANGELSK[/COLOR].[/CENTER][/SIZE]',
prefix: ACCEPT_PREFIX,
status: false,
},
{
title: ' [Forum] Жалобы будут пересмотрены ',
content:
'[SIZE=4][FONT=Times New Roman][CENTER][Color=rgb(255, 0, 255)]{{ greeting }},[/Color] уважаемый {{ user.mention }}!<br><br>'+
"[CENTER]Жалобы будут пересмотрены, с администратором будет проведена беседа.<br><br>"+
"[CENTER][COLOR=rgb(0, 255, 0)]Одобрено.[/color]<br>"+
'[CENTER]Приятной игры и времяпровождения на сервере [COLOR=rgb(204, 216, 174)]ARKHANGELSK[/COLOR].[/CENTER][/SIZE]',
prefix: ACCEPT_PREFIX,
status: false,
},
{
title: ' [Forum] Ответ будет исправлен ',
content:
'[SIZE=4][FONT=Times New Roman][CENTER][Color=rgb(255, 0, 255)]{{ greeting }},[/Color] уважаемый {{ user.mention }}!<br><br>'+
"[CENTER]Ответ в жалобе будет исправлен.<br><br>"+
"[CENTER][COLOR=rgb(0, 255, 0)]Одобрено.[/color]<br>"+
'[CENTER]Приятной игры и времяпровождения на сервере [COLOR=rgb(204, 216, 174)]ARKHANGELSK[/COLOR].[/CENTER][/SIZE]',
prefix: ACCEPT_PREFIX,
status: false,
},
{
title: '𓆩𓆩𓆩𓆩𓆩𓆩𓆩𓆩𓆩𓆩𓆩𓆩𓆩𓆩𓆩𓆩𓆩𓆩𓆩𓆩𓆩𓆩𓆩𓆩𓆩𓆩𓆩𓆩𓆩𓆩𓆩𓆩𓆩𓆩𓆩𓆩𓆩𓆩𓆩𓆩𓆩𓆩𓆩𓆩НА РАССМОТРЕНИЕ𓆪𓆪𓆪𓆪𓆪𓆪𓆪𓆪𓆪𓆪𓆪𓆪𓆪𓆪𓆪𓆪𓆪𓆪𓆪𓆪𓆪𓆪𓆪𓆪𓆪𓆪𓆪𓆪𓆪𓆪𓆪𓆪𓆪𓆪𓆪𓆪𓆪𓆪𓆪𓆪𓆪𓆪𓆪𓆪'
},
{
title: ' ГА ',
content:
'[SIZE=4][FONT=Times New Roman][CENTER][Color=rgb(255, 0, 255)]{{ greeting }},[/Color] уважаемый {{ user.mention }}!<br><br>'+
"[CENTER]Ваша жалоба будет передана [Color=rgb(255, 0, 0)]Главному администратору[/Color] - @Candy_Rotmans на рассмотрение.<br>"+
"[CENTER]Просьба не создавать подобных тем, иначе форумный аккаунт может быть заблокирован.<br><br>"+
'[CENTER][Color=rgb(255, 255, 0)]На Рассмотрении...[/Color][/CENTER][/SIZE]',
prefix: GA_PREFIX,
status: true,
},
{
title: ' ЗГА ',
content:
'[SIZE=4][FONT=Times New Roman][CENTER][Color=rgb(255, 0, 255)]{{ greeting }},[/Color] уважаемый {{ user.mention }}!<br><br>'+
"[CENTER]Ваша жалоба будет передана [Color=rgb(255, 0, 0)]Заместителям Главного Администратора[/Color] -  @Nikita Makaravll @Igor Legends на рассмотрение.<br>"+
"[CENTER]Просьба не создавать подобных тем, иначе форумный аккаунт может быть заблокирован.<br><br>"+
'[CENTER][Color=rgb(255, 255, 0)]На Рассмотрении...[/Color][/CENTER][/SIZE]',
prefix: PIN_PREFIX,
status: true,
},
{
title: ' СПЕЦ.АДМ ',
content:
'[SIZE=4][FONT=Times New Roman][CENTER][Color=rgb(255, 0, 255)]{{ greeting }},[/Color] уважаемый {{ user.mention }}!<br><br>'+
"[CENTER]Ваша жалоба будет передана [Color=rgb(255, 0, 0)]Специальной Администрации[/Color] -︎  @Sander_Kligan, @Clarence Crown, @Dmitry Dmitrich, @Myron_Capone @Liana_Mironova на рассмотрение.<br>"+
"[CENTER]Просьба не создавать подобных тем, иначе форумный аккаунт может быть заблокирован.<br><br>"+
'[CENTER][Color=rgb(255, 255, 0)]На Рассмотрении...[/Color][/CENTER][/SIZE]',
prefix: SA_PREFIX,
status: true,
},
]
 
 
$(document).ready(() => {
// Загрузка скрипта для обработки шаблонов
$('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');
 
// Добавление кнопок при загрузке страницы
 
 
addButton(' Рассмотрение ', 'pin');
addButton(' Одобрено ', 'accepted');
addButton(' Отказано ', 'unaccept');
addButton(' ГА ', 'Ga');
addButton(' Закрыто ', 'Zakrito');
addButton(' Ответы ', 'selectAnswer');
 
// Поиск информации о теме
const threadData = getThreadData();
 
$('button#pin').click(() => editThreadData(PIN_PREFIX, true));
$('button#accepted').click(() => editThreadData(ACCEPT_PREFIX, false));
$('button#teamProject').click(() => editThreadData(COMMAND_PREFIX, true));
$('button#unaccept').click(() => editThreadData(UNACCEPT_PREFIX, false));
$('button#Zakrito').click(() => editThreadData(CLOSE_PREFIX, false));
$('button#Ga').click(() => editThreadData(GA_PREFIX, true));
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
12 < hours && hours <= 18
? 'Доброго времени Суток'
: 18 < hours && hours <= 21
? 'Доброго времени Суток'
: 21 < hours && hours <= 4
? 'Доброго времени Суток'
: 'Доброго времени Суток',
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