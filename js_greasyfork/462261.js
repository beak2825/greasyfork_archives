// ==UserScript==
// @name Для Руководства VORONEZH (40)
// @namespace https://forum.blackrussia.online
// @version 0.0.5
// @description kye
// @author Maksim_Vitalievich
// @match https://forum.blackrussia.online/threads/*
// @include https://forum.blackrussia.online/threads/
// @grant none
// @license MIT
// @collaborator !
// @icon https://icons.iconarchive.com/icons/papirus-team/papirus-apps/48/emerald-theme-manager-icon-icon.png
// @downloadURL https://update.greasyfork.org/scripts/462261/%D0%94%D0%BB%D1%8F%20%D0%A0%D1%83%D0%BA%D0%BE%D0%B2%D0%BE%D0%B4%D1%81%D1%82%D0%B2%D0%B0%20VORONEZH%20%2840%29.user.js
// @updateURL https://update.greasyfork.org/scripts/462261/%D0%94%D0%BB%D1%8F%20%D0%A0%D1%83%D0%BA%D0%BE%D0%B2%D0%BE%D0%B4%D1%81%D1%82%D0%B2%D0%B0%20VORONEZH%20%2840%29.meta.js
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
const buttons = [
{
title: 'СВОЙ ОТВЕТ',
content:
'[SIZE=4][FONT=Courier New][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}!<br><br>'+
"Твой текст <br><br>"+
'[CENTER]Приятной игры и времяпровождение на сервере [COLOR=rgb(255,255,0)]VORONEZH[/COLOR].[/CENTER][/B][/SIZE]',
 
},
{
title: '╴╴╴╴╴╴╴╴╴╴╴ЖАЛОБЫ НА АДМИНИСТРАЦИЮ ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴'
},
{
title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴Жалобы на рассмотрении ╴╴╴╴ ╴╴╴╴╴╴╴╴╴╴'
},
{
title: 'Запрошу доказательства',
content:
'[SIZE=4][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}!<br><br>'+
"[CENTER]Запрошу доказательства у администратора. Просьба не создавать подобных тем, иначе форумный аккаунт может быть заблокирован.[/CENTER]<br><br>"+
'[CENTER][Color=Orange]На рассмотрении.[/Color][/CENTER][/B][/SIZE]',
prefix: PIN_PREFIX,
status: true,
},
{
title: 'На рассмотрении',
content:
'[SIZE=4][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}!<br><br>'+
"[CENTER]Ваша жалоба взята [Color=Orange]на рассмотрение[/Color]. Просьба не создавать подобных тем, иначе форумный аккаунт может быть заблокирован[/CENTER]<br><br>"+
'[CENTER]Ожидайте ответа.[/CENTER][/B][/SIZE]',
prefix: PIN_PREFIX,
status: true,
},
{
title: '╴╴╴╴╴╴╴╴╴╴╴╴Одобробренные / [Закрыто] жалобы ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴'
},
{
title: 'Доки предоставлены (наказание снято)',
content:
'[SIZE=4][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}!<br><br>'+
"[CENTER]Ваша жалоба была одобрена. С администратором будет проведена беседа.<br>Наказание будет снято.[/CENTER]<br><br>"+
'[CENTER]Приятной игры и времяпровождение на сервере [COLOR=rgb(255,255,0)]VORONEZH[/COLOR].[/CENTER][/B][/SIZE]',
prefix: ACCEPT_PREFIX,
status: false,
},
{
title: 'ПРОСТО НАКАЗАНИЕ СНЯТО.',
content:
'[SIZE=4][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}!<br><br>'+
"[CENTER]Наказание будет снято.[/CENTER]<br><br>"+
'[CENTER]Приятной игры и времяпровождение на сервере [COLOR=rgb(255,255,0)]VORONEZH[/COLOR].[/CENTER][/B][/SIZE]',
prefix: ACCEPT_PREFIX,
status: false,
},
{
title: 'Наказание снято и GW',
content:
'[SIZE=4][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}!<br><br>'+
"[CENTER]Ваша жалоба была одобрена. Наказание будет снято, GunWarn тоже.[/CENTER]<br><br>"+
'[CENTER]Приятной игры и времяпровождение на сервере [COLOR=rgb(255,255,0)]VORONEZH[/COLOR].[/CENTER][/B][/SIZE]',
prefix: ACCEPT_PREFIX,
status: false,
},
{
title: 'проинструктирован',
content:
'[SIZE=4][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}!<br><br>'+
"[CENTER]Спасибо за обращение. Администратор будет проинструктирован.[/CENTER]<br><br>"+
'[CENTER]Приятной игры и времяпровождение на сервере [COLOR=rgb(255,255,0)]VORONEZH[/COLOR].[/CENTER][/B][/SIZE]',
prefix: ACCEPT_PREFIX,
status: false,
},
{
title: 'Будет проведена беседа с Администратором',
content:
'[SIZE=4][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}!<br><br>'+
"[CENTER]Ваша жалоба была одобрена. С администратором будет проведена беседа.[/CENTER]<br><br>"+
'[CENTER]Приятной игры и времяпровождение на сервере [COLOR=rgb(255,255,0)]VORONEZH[/COLOR].[/CENTER][/B][/SIZE]',
prefix: ACCEPT_PREFIX,
status: false,
},
{
title: 'Будет проведена беседа с Администратором(строгая)',
content:
'[SIZE=4][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}!<br><br>'+
"[CENTER]Ваша жалоба была одобрена. С администратором будет проведена строгая беседа.[/CENTER]<br><br>"+
'[CENTER]Приятной игры и времяпровождение на сервере [COLOR=rgb(255,255,0)]VORONEZH[/COLOR].[/CENTER][/B][/SIZE]',
prefix: ACCEPT_PREFIX,
status: false,
},
{
title: 'Будет проведена беседа с Администратором, ответ будет исправлен (КФ)',
content:
'[SIZE=4][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}!<br><br>'+
"[CENTER]Ваша жалоба была одобрена.<br>Ответ в жалобе будет исправлен.[/CENTER]<br><br>"+
'[CENTER]Приятной игры и времяпровождение на сервере [COLOR=rgb(255,255,0)]VORONEZH[/COLOR].[/CENTER][/B][/SIZE]',
prefix: ACCEPT_PREFIX,
status: false,
},
{
title: 'Администратор ошибся ',
content:
'[SIZE=4][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}!<br><br>'+
"[CENTER]Администратор допустил ошибку. Приносим извинения за предоставленные неудобства.[/CENTER]<br><br>"+
'[CENTER]Приятной игры и времяпровождение на сервере [COLOR=rgb(255,255,0)]VORONEZH[/COLOR].[/CENTER][/B][/SIZE]',
prefix: CLOSE_PREFIX,
status: false,
},
{
title: 'Администратор снят',
content:
'[SIZE=4][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}!<br><br>'+
"[CENTER]Администратор снят.[/CENTER]<br><br>"+
'[CENTER]Приятной игры и времяпровождение на сервере [COLOR=rgb(255,255,0)]VORONEZH[/COLOR].[/CENTER][/B][/SIZE]',
prefix: CLOSE_PREFIX,
status: false,
},
{
title: 'Игрок не является администратором',
content:
'[SIZE=4][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}!<br><br>'+
"[CENTER]Данный игрок не является администратором.[/CENTER]<br><br>"+
'[CENTER]Приятной игры и времяпровождение на сервере [COLOR=rgb(255,255,0)]VORONEZH[/COLOR].[/CENTER][/B][/SIZE]',
prefix: CLOSE_PREFIX,
status: false,
},
{
title: 'Проф беседа',
content:
'[SIZE=4][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}!<br><br>'+
"[CENTER]С администратором будет проведена профилактическая беседа.[/CENTER]<br><br>"+
'[CENTER]Приятной игры и времяпровождение на сервере [COLOR=rgb(255,255,0)]VORONEZH[/COLOR].[/CENTER][/B][/SIZE]',
prefix: ACCEPT_PREFIX,
status: false,
},
{
title: 'Информация будет проверена.',
content:
'[SIZE=4][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}!<br><br>'+
"[CENTER]Информация будет проверена, в случае подтверждения информации администратор получит соответствующее наказание.[/CENTER]<br><br>"+
'[CENTER]Приятной игры и времяпровождение на сервере [COLOR=rgb(255,255,0)]VORONEZH[/COLOR].[/CENTER][/B][/SIZE]',
prefix: WATCHED_PREFIX,
status: false,
},
{
title: 'Наказание адм',
content:
'[SIZE=4][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}!<br><br>'+
"[CENTER]Администратор получит соответсвующее наказание.[/CENTER]<br><br>"+
'[CENTER]Приятной игры и времяпровождение на сервере [COLOR=rgb(255,255,0)]VORONEZH[/COLOR].[/CENTER][/B][/SIZE]',
prefix: ACCEPT_PREFIX,
status: false,
},
{
title: 'Не помог с репортом',
content:
'[SIZE=4][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}!<br><br>'+
"[CENTER]У администратора произошли проблемы, из-за которых он вам не смог помочь. Приносим извинения за предоставленные неудобства. [/CENTER]<br><br>"+
'[CENTER]Приятной игры и времяпровождение на сервере [COLOR=rgb(255,255,0)]VORONEZH[/COLOR].[/CENTER][/B][/SIZE]',
prefix: ACCEPT_PREFIX,
status: false,
},
{
title: 'Не успел зафиксировать, наруш не выдал',
content:
'[SIZE=4][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}!<br><br>'+
"[CENTER]К сожалению администратор не успел зафиксировать наказание, поэтому наказание игроку не было выдано. Балта нет.[/CENTER]<br><br>"+
'[CENTER]Приятной игры и времяпровождение на сервере [COLOR=rgb(255,255,0)]VORONEZH[/COLOR].[/CENTER][/B][/SIZE]',
prefix: CLOSE_PREFIX,
status: false,
},
{
title: 'СНЯТО, перевыдано',
content:
'[SIZE=4][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}!<br><br>'+
"[CENTER]Ваше наказание было снято / перевыдано чуть позже, когда администратор увидел ошибку.[/CENTER]<br><br>"+
'[CENTER]Приятной игры и времяпровождение на сервере [COLOR=rgb(255,255,0)]VORONEZH[/COLOR].[/CENTER][/B][/SIZE]',
prefix: CLOSE_PREFIX,
status: false,
},
{
title: 'Не достал / починил',
content:
'[SIZE=4][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}!<br><br>'+
"[CENTER]Администратор не обязан доставать автомобиль из воды, или же чинить, т.к это является Role Play процессом. К примеру, Вы можете воспользоваться услугами такси, автобуса, либо попросить знакомых.<br>Нарушений со стороны администратора нет. [/CENTER]<br><br>"+
'[CENTER]Приятной игры и времяпровождение на сервере [COLOR=rgb(255,255,0)]VORONEZH[/COLOR].[/CENTER][/B][/SIZE]',
prefix: CLOSE_PREFIX,
status: false,
},
{
title: ' типо блат, но сокращено с вип',
content:
'[SIZE=4][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}!<br><br>'+
"[CENTER] Прежде чем составлять подобные жалобы, нужно грамотно изучить мод игры. Игрокам с VIP статусом наказание снижается автоматически при его выдачи. То есть, администратор выдает наказание по регламенту, а система сама, исходя из пропорций снижает наказание. <br> Блата тут нет, нарушений тоже. [/CENTER]<br><br>"+
'[CENTER]Приятной игры и времяпровождение на сервере [COLOR=rgb(255,255,0)]VORONEZH[/COLOR].[/CENTER][/B][/SIZE]',
prefix: CLOSE_PREFIX,
status: false,
},
{
title: 'будет исправлены (Заявки)',
content:
'[SIZE=4][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}!<br><br>'+
"[CENTER]Скоро будет все исправлено.[/CENTER]<br><br>"+
'[CENTER]Приятной игры и времяпровождение на сервере [COLOR=rgb(255,255,0)]VORONEZH[/COLOR].[/CENTER][/B][/SIZE]',
prefix: CLOSE_PREFIX,
status: false,
},
{
title: 'будет рассмотрены (Заявки)',
content:
'[SIZE=4][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}!<br><br>'+
"[CENTER]Скоро будет все рассмотрено..[/CENTER]<br><br>"+
'[CENTER]Приятной игры и времяпровождение на сервере [COLOR=rgb(255,255,0)]VORONEZH[/COLOR].[/CENTER][/B][/SIZE]',
prefix: CLOSE_PREFIX,
status: false,
},
{
title: 'скоро будут рассмотрены (жалобы/обж/био/сит)',
content:
'[SIZE=4][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}!<br><br>'+
"[CENTER]Скоро все будет рассмотрено, сроки рассмотрения не нарушаются.[/CENTER]<br><br>"+
'[CENTER]Приятной игры и времяпровождение на сервере [COLOR=rgb(255,255,0)]VORONEZH[/COLOR].[/CENTER][/B][/SIZE]',
prefix: CLOSE_PREFIX,
status: false,
},
{
title: 'ограничение vmute / rmute',
content:
'[SIZE=4][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}!<br><br>'+
"[CENTER]Выдача голосового чата только максимально 60 минут.<br> Выдача блокировки репорта максимально 120 минут.<br>Нарушений со стороны администратора нет.[/CENTER]<br><br>"+
'[CENTER]Приятной игры и времяпровождение на сервере [COLOR=rgb(255,255,0)]VORONEZH[/COLOR].[/CENTER][/B][/SIZE]',
prefix: CLOSE_PREFIX,
status: false,
},
{
title: '╴╴╴╴╴╴╴╴╴╴╴╴Отказанные жалобы ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴'
},
{
title: 'Доки предоставлены, наказание выдано верно',
content:
'[SIZE=4][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}!<br><br>'+
"[CENTER]Проверив доказательства администратора, было принято решение, что наказание выдано верно.<br>Впредь не нарушайте правила сервера, ознакомиться можно по ссылке - [URL='https://forum.blackrussia.online/index.php?threads/%D0%9E%D0%B1%D1%89%D0%B8%D0%B5-%D0%BF%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%B5%D1%80%D0%B2%D0%B5%D1%80%D0%BE%D0%B2.312571/'][Color=rgb(255,0,0)]«Общие правила серверов»[/color].[/URL][/CENTER]<br><br>"+
'[CENTER]Приятной игры и времяпровождение на сервере [COLOR=rgb(255,255,0)]VORONEZH[/COLOR].[/CENTER][/B][/SIZE]',
prefix: UNACCEPT_PREFIX,
status: false,
},
{
title: 'Доки предоставлены, наказание выдано по жб на ф',
content:
'[SIZE=4][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}!<br><br>'+
"[CENTER]Наказание было выдано по жалобе на форуме. Проверив доказательство, было принято решение, что наказание выдано верно.<br>Впредь не нарушайте правила сервера, ознакомиться можно по ссылке - [URL='https://forum.blackrussia.online/index.php?threads/%D0%9E%D0%B1%D1%89%D0%B8%D0%B5-%D0%BF%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%B5%D1%80%D0%B2%D0%B5%D1%80%D0%BE%D0%B2.312571/'][Color=rgb(255,0,0)]«Общие правила серверов»[/color].[/URL][/CENTER]<br><br>"+
'[CENTER]Приятной игры и времяпровождение на сервере [COLOR=rgb(255,255,0)]VORONEZH[/COLOR].[/CENTER][/B][/SIZE]',
prefix: UNACCEPT_PREFIX,
status: false,
},
{
title: 'Не по форме',
content:
'[SIZE=4][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}!<br><br>'+
"[CENTER]Ваша жалоба составлена не по форме. Ознакомьтесь с [URL='https://clck.ru/32xaDF'][COLOR=rgb(255,0,0)]«правилами подачи жалоб на администрацию».[/color][/URL][/CENTER]<br><br>"+
'[CENTER]Приятной игры и времяпровождение на сервере [COLOR=rgb(255,255,0)]VORONEZH[/COLOR].[/CENTER][/B][/SIZE]',
prefix: UNACCEPT_PREFIX,
status: false,
},
{
title: 'В жалобы на тех.спец',
content:
'[SIZE=4][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}!<br><br>'+
"[CENTER]Обратитесь в раздел [URL='https://clck.ru/33pz4X']«Жалобы на технических Специалистов [Color=rgb(255,255,0)]VORONEZH[/color]».[/URL][/CENTER]<br><br>"+
'[CENTER]Приятной игры и времяпровождение на сервере [COLOR=rgb(255,255,0)]VORONEZH[/COLOR].[/CENTER][/B][/SIZE]',
prefix: UNACCEPT_PREFIX,
status: false,
},
{
title: 'В тех раздел',
content:
'[SIZE=4][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}!<br><br>'+
"[CENTER]Обратитесь со своей проблемой в  [URL='https://clck.ru/33pyEQ']«Технический раздел [Color=rgb(255,255,0)]VORONEZH[/COLOR]».[/URL][/CENTER]<br><br>"+
'[CENTER]Приятной игры и времяпровождение на сервере [COLOR=rgb(255,255,0)]VORONEZH[/COLOR].[/CENTER][/B][/SIZE]',
prefix: UNACCEPT_PREFIX,
status: false,
},
{
title: 'Вы ошиблись разделом/сервером',
content:
'[SIZE=4][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}!<br><br>'+
"[CENTER]Вы ошиблись разделом / сервером. Переподайте жалобу в нужный раздел / сервер.[/CENTER]<br><br>"+
'[CENTER]Приятной игры и времяпровождение на сервере [COLOR=rgb(255,255,0)]VORONEZH[/COLOR].[/CENTER][/B][/SIZE]',
prefix: UNACCEPT_PREFIX,
status: false,
},
{
title: 'жб 3-е лицо',
content:
'[SIZE=4][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}!<br><br>'+
"[CENTER]Жалоба составлена от 3-го лица, что не подлежит рассмотрению.[/CENTER]<br><br>"+
'[CENTER]Приятной игры и времяпровождение на сервере [COLOR=rgb(255,255,0)]VORONEZH[/COLOR].[/CENTER][/B][/SIZE]',
prefix: UNACCEPT_PREFIX,
status: false,
},
{
title: 'Отсутствуют доки',
content:
'[SIZE=4][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}!<br><br>'+
"[CENTER]В жалобе отсутствуют доказательство о нарушении от администратора. Создайте повторную жалобу и прикрепите доказательства.[/CENTER]<br><br>"+
'[CENTER]Приятной игры и времяпровождение на сервере [COLOR=rgb(255,255,0)]VORONEZH[/COLOR].[/CENTER][/B][/SIZE]',
prefix: UNACCEPT_PREFIX,
status: false,
},
{
title: 'Прикрепление ссылки (КФ))',
content:
'[SIZE=4][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}!<br><br>'+
"[CENTER]Прикрепите в новой жалобе ссылку, где не согласны с вердиктом администратора.[/CENTER]<br><br>"+
'[CENTER]Приятной игры и времяпровождение на сервере [COLOR=rgb(255,255,0)]VORONEZH[/COLOR].[/CENTER][/B][/SIZE]',
prefix: UNACCEPT_PREFIX,
status: false,
},
{
title: 'Недостаточно доказательств «ЖБ»',
content:
'[SIZE=4][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}!<br><br>'+
"[CENTER]Недостаточно доказательств, чтобы корректно рассмотреть данную жалобу.[/CENTER]<br><br>"+
'[CENTER]Приятной игры и времяпровождение на сервере [COLOR=rgb(255,255,0)]VORONEZH[/COLOR].[/CENTER][/B][/SIZE]',
prefix: UNACCEPT_PREFIX,
status: false,
},
{
title: 'плохие/обрезанные',
content:
'[SIZE=4][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}!<br><br>'+
"[CENTER]Ваши доказательства подверглись редактированию, создайте повторную тему и прикрепите доказательства в первоначальном виде.[/CENTER]<br><br>"+
'[CENTER]Приятной игры и времяпровождение на сервере [COLOR=rgb(255,255,0)]VORONEZH[/COLOR].[/CENTER][/B][/SIZE]',
prefix: UNACCEPT_PREFIX,
status: false,
},
{
title: 'не раб доки',
content:
'[SIZE=4][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}!<br><br>'+
"[CENTER]Не работают доказательства.[/CENTER]<br><br>"+
'[CENTER]Приятной игры и времяпровождение на сервере [COLOR=rgb(255,255,0)]VORONEZH[/COLOR].[/CENTER][/B][/SIZE]',
prefix: UNACCEPT_PREFIX,
status: false,
},
{
title: 'Смайлик клоуна, оск в жб',
content:
'[SIZE=4][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}!<br><br>'+
"[CENTER]Жалобы с подобным содержанием не подлежат рассмотрению.[/CENTER]<br><br>"+
'[CENTER]Приятной игры и времяпровождение на сервере [COLOR=rgb(255,255,0)]VORONEZH[/COLOR].[/CENTER][/B][/SIZE]',
prefix: UNACCEPT_PREFIX,
status: false,
},
{
title: 'Нарушений со стороны администратора нет.',
content:
'[SIZE=4][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}!<br><br>'+
"[CENTER]Нарушений со стороны администратора нет.[/CENTER]<br><br>"+
'[CENTER]Приятной игры и времяпровождение на сервере [COLOR=rgb(255,255,0)]VORONEZH[/COLOR].[/CENTER][/B][/SIZE]',
prefix: UNACCEPT_PREFIX,
status: false,
},
{
title: 'Дублирование темы',
content:
'[SIZE=4][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}!<br><br>'+
"[CENTER]Вам уже ранее был дан корректный ответ, за создание дубликатов этой темы ваш форумный аккаунт может быть заблокирован.[/CENTER]<br><br>"+
'[CENTER]Приятной игры и времяпровождение на сервере [COLOR=rgb(255,255,0)]VORONEZH[/COLOR].[/CENTER][/B][/SIZE]',
prefix: UNACCEPT_PREFIX,
status: false,
},
{
title: 'прошло время+в обж',
content:
'[SIZE=4][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}!<br><br>'+
"[CENTER]В вашем случае нужно было сразу реагировать на выданное наказание и обращаться в раздел жалоб на администрацию, в настоящий момент срок написания жалобы прошел.<br>Обратитесь в раздел Обжалование наказаний.<br>Просьба не создавать копии данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/CENTER]<br><br>"+
'[CENTER]Приятной игры и времяпровождение на сервере [COLOR=rgb(255,255,0)]VORONEZH[/COLOR].[/CENTER][/B][/SIZE]',
prefix: UNACCEPT_PREFIX,
status: false,
},
{
title: 'В ОБЖ',
content:
'[SIZE=4][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}!<br><br>'+
"[CENTER]Если хотите как-то снизить свое наказание, то можете написать в раздел [URL='https://clck.ru/33pzHE'][Color=rgb(255,0,0)]«Обжалование наказаний»[/COLOR][/URL], но не факт, что обжалование одобрят.<br> Перед написанием обжалования внимательно ознакомьтесь с правилами подачи заявок на обжалование наказания[/CENTER]<br><br>"+
'[CENTER]Приятной игры и времяпровождение на сервере [COLOR=rgb(255,255,0)]VORONEZH[/COLOR].[/CENTER][/B][/SIZE]',
prefix: UNACCEPT_PREFIX,
status: false,
},
{
title: 'Окно бана.',
content:
'[SIZE=4][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}!<br><br>'+
"[CENTER]Прикрепите в новой жалобе окно блокировки игрового аккаунта при входе в игру.[/CENTER]<br><br>"+
'[CENTER]Приятной игры и времяпровождение на сервере [COLOR=rgb(255,255,0)]VORONEZH[/COLOR].[/CENTER][/B][/SIZE]',
prefix: UNACCEPT_PREFIX,
status: false,
},
{
title: 'бан IP',
content:
'[SIZE=4][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}!<br><br>'+
"[CENTER]Перезагрузите роутер или переключите на другой провайдер, если блокировка IP останется, то напишите повторную жалобу. [/CENTER]<br><br>"+
'[CENTER]Приятной игры и времяпровождение на сервере [COLOR=rgb(255,255,0)]VORONEZH[/COLOR].[/CENTER][/B][/SIZE]',
prefix: UNACCEPT_PREFIX,
status: false,
},
{
title: '48 часов',
content:
'[SIZE=4][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}!<br><br>'+
"[CENTER]С момента получения наказание прошло 48 часов.[/CENTER]<br><br>"+
'[CENTER]Приятной игры и времяпровождение на сервере [COLOR=rgb(255,255,0)]VORONEZH[/COLOR].[/CENTER][/B][/SIZE]',
prefix: UNACCEPT_PREFIX,
status: false,
},
{
title: 'Доки из соц сети',
content:
'[SIZE=4][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}!<br><br>'+
"[CENTER]Доказательства в социальных сетях и т.д. не принимаются. Загрузите доказательства на фото-видео хостинги YouTube, Imgur, Yapx и так далее.[/CENTER]<br><br>"+
'[CENTER]Приятной игры и времяпровождение на сервере [COLOR=rgb(255,255,0)]VORONEZH[/COLOR].[/CENTER][/B][/SIZE]',
prefix: UNACCEPT_PREFIX,
status: false,
},
{
title: 'Нету /myreports',
content:
'[SIZE=4][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}!<br><br>'+
"[CENTER]В доказательствах нету  /myreports.[/CENTER]<br><br>"+
'[CENTER]Приятной игры и времяпровождение на сервере [COLOR=rgb(255,255,0)]VORONEZH[/COLOR].[/CENTER][/B][/SIZE]',
prefix: UNACCEPT_PREFIX,
status: false,
},
{
title: 'Не по теме',
content:
'[SIZE=4][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}!<br><br>'+
"[CENTER]Убедительная просьба, ознакомиться с назначение данного раздела, в котором Вы создали тема. Ваша жалоба никоим образом не относится к данному разделу.[/CENTER]<br><br>"+
'[CENTER]Приятной игры и времяпровождение на сервере [COLOR=rgb(255,255,0)]VORONEZH[/COLOR].[/CENTER][/B][/SIZE]',
prefix: UNACCEPT_PREFIX,
status: false,
},
{
title: 'Нет доступа к доказ (Гугл)',
content:
'[SIZE=4][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}!<br><br>'+
"[CENTER]Доступ к доказательствам закрыт - <br> [url=https://postimages.org/][img]https://i.postimg.cc/BvxnD9yw/image.png[/img][/url][/CENTER]<br>"+
"[CENTER]Создайте новую жалобу и загрузите доказательства на фото/видео хостинги (YouTube, Япикс, imgur).[/CENTER]<br><br>"+
'[CENTER]Приятной игры и времяпровождение на сервере [COLOR=rgb(255,255,0)]VORONEZH[/COLOR].[/CENTER][/B][/SIZE]',
prefix: UNACCEPT_PREFIX,
status: false,
},
{
title: 'Нет доступа к доказ (Ютуб)',
content:
'[SIZE=4][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}!<br><br>'+
"[CENTER]Доступ к доказательствам закрыт - <br> [url=https://postimages.org/][img]https://i.postimg.cc/131G5gqy/image.png[/img][/url][/CENTER]<br>"+
"[CENTER]Создайте новую жалобу и загрузите доказательства на фото/видео хостинги (YouTube, Япикс, imgur).[/CENTER]<br><br>"+
'[CENTER]Приятной игры и времяпровождение на сервере [COLOR=rgb(255,255,0)]VORONEZH[/COLOR].[/CENTER][/B][/SIZE]',
prefix: UNACCEPT_PREFIX,
status: false,
},
{
title: 'уже есть на рассмотрении',
content:
'[SIZE=4][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}!<br><br>'+
"[CENTER]Подобная жалоба уже закреплена на рассмотрение. Ожидайте ответа там и не создавайте подобных, иначе форумный аккаунт может быть заблокирован.[/CENTER]<br><br>"+
'[CENTER]Приятной игры и времяпровождение на сервере [COLOR=rgb(255,255,0)]VORONEZH[/COLOR].[/CENTER][/B][/SIZE]',
prefix: UNACCEPT_PREFIX,
status: false,
},
{
title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴Переданные ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴'
},
{
title: 'Рук Модер ДС',
content:
'[SIZE=4][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}!<br><br>'+
"[CENTER]Ваша жалоба будет передана [COLOR=rgb(43,108,196)]Руководителю модераторов Forum/Discord[/color] - @sakaro [Color=Orange]на рассмотрение[/color]. Просьба не создавать подобных тем.[/CENTER]<br>",
prefix: PIN_PREFIX,
status: true,
},
{
title: 'ГА',
content:
'[SIZE=4][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}!<br><br>'+
"[CENTER]Ваша жалоба будет передана [Color=Red]Главному Администратору[/color] -  @Jennie Carter[Color=Orange] на рассмотрение[/color]. Просьба не создавать подобных тем.[/CENTER]<br>",
prefix: GA_PREFIX,
status: true,
},
{
title: 'ЗГА',
content:
'[SIZE=4][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}!<br><br>'+
"[CENTER]Ваша жалоба будет передана [Color=Red]ЗГА[/color] - @Nikolay_Perojkov [Color=Orange]на рассмотрение[/color]. Просьба не создавать подобных тем.[/CENTER]<br>",
prefix: PIN_PREFIX,
status: true,
},
{
title: 'Специальной Администрации',
content:
'[SIZE=4][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}!<br><br>'+
"[CENTER]Ваша жалобу будет передана [COLOR=rgb(204,6,5)]Специальной Администрации[/color] - @Sander_Kligan, @Clarence Crown[/CENTER]<br><br>"+
'[CENTER][Color=Orange]На рассмотрении.[/Color][/CENTER][/B][/SIZE]',
prefix: SA_PREFIX,
status: true,
},
{
title: 'Команде проекта',
content:
'[SIZE=4][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}!<br><br>'+
"[CENTER]Ваша жалоба будет передана [COLOR=rgb(239,211,52)]Команде проекта.[/color][/CENTER]<br><br>"+
'[CENTER][Color=Orange]На рассмотрении.[/Color][/CENTER][/B][/SIZE]',
prefix: COMMAND_PREFIX,
status: true,
},
{
title: '╴╴╴╴╴╴╴╴╴╴╴╴ОБЖАЛОВАНИЕ НАКАЗАНИЙ- - - - - - - - -  -  - --- - — — - - - - — — -'
},
{
title: 'На рассмотрении',
content:
'[SIZE=4][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}!<br><br>'+
"[CENTER]Ваше обжалование взятo [Color=Orange]на рассмотрение[/Color]. Просьба не создавать подобных тем.[/CENTER]<br><br>"+
'[CENTER]Ожидайте ответа.[/CENTER][/B][/SIZE]',
prefix: PIN_PREFIX,
status: true,
},
{
title: 'В жалобы на адм',
content:
'[SIZE=4][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}!<br><br>'+
"[CENTER]Внимательно ознакомившись с вашим обжалованием, было решено, что вам нужно обратится в раздел жалоб на администрацию.[/CENTER]<br><br>"+
'[CENTER]Приятной игры и времяпровождение на сервере [COLOR=rgb(255,255,0)]VORONEZH[/COLOR].[/CENTER][/B][/SIZE]',
prefix: UNACCEPT_PREFIX,
status: false,
},
{
title: 'Одобрено + полностью снято',
content:
'[SIZE=4][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}!<br><br>'+
"[CENTER]Ваше обжалование одобрено и ваше наказание будет полностью снято.[/CENTER]<br><br>"+
'[CENTER]Приятной игры и времяпровождение на сервере [COLOR=rgb(255,255,0)]VORONEZH[/COLOR].[/CENTER][/B][/SIZE]',
prefix: ACCEPT_PREFIX,
status: false,
},
{
title: 'В жалобы на тех',
content:
'[SIZE=4][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}!<br><br>'+
"[CENTER]Вы получили наказание от технического специалиста Вашего сервера. Вам следует обратиться в раздел жалоб на технических специалистов в случае, если Вы не согласны с наказанием.[/CENTER]<br><br>"+
'[CENTER]Приятной игры и времяпровождение на сервере [COLOR=rgb(255,255,0)]VORONEZH[/COLOR].[/CENTER][/B][/SIZE]',
prefix: UNACCEPT_PREFIX,
status: false,
},
{
title: 'ППВ',
content:
'[SIZE=4][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}!<br><br>'+
"[CENTER]Воспользуйтесь одним из способов восстановления вашего игрового аккаунта, затем создайте повторное обжалование и прикрепите все необходимые доказательства, предварительно закройте конфиденциальную информацию.[/CENTER]<br><br>"+
'[CENTER]Приятной игры и времяпровождение на сервере [COLOR=rgb(255,255,0)]VORONEZH[/COLOR].[/CENTER][/B][/SIZE]',
prefix: UNACCEPT_PREFIX,
status: false,
},
{
title: 'Одобрено до мин.срока',
content:
'[SIZE=4][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}!<br><br>'+
"[CENTER]Ваше обжалование одобрено и ваше наказание будет снижено до минимального срока.[/CENTER]<br><br>"+
'[CENTER]Приятной игры и времяпровождение на сервере [COLOR=rgb(255,255,0)]VORONEZH[/COLOR].[/CENTER][/B][/SIZE]',
prefix: ACCEPT_PREFIX,
status: false,
},
{
title: 'Уже снизили',
content:
'[SIZE=4][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}!<br><br>'+
"[CENTER]Вам итак уже снизили наказание.[/CENTER]<br><br>"+
'[CENTER]Приятной игры и времяпровождение на сервере [COLOR=rgb(255,255,0)]VORONEZH[/COLOR].[/CENTER][/B][/SIZE]',
prefix: UNACCEPT_PREFIX,
status: false,
},
{
title: 'У вас мин.нак',
content:
'[SIZE=4][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}!<br><br>'+
"[CENTER]Вам итак выдано минимальное наказание.[/CENTER]<br><br>"+
'[CENTER]Приятной игры и времяпровождение на сервере [COLOR=rgb(255,255,0)]VORONEZH[/COLOR].[/CENTER][/B][/SIZE]',
prefix: UNACCEPT_PREFIX,
status: false,
},
{
title: 'Отказано',
content:
'[SIZE=4][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}!<br><br>'+
"[CENTER]Данному обжалованию отказано.[/CENTER]<br><br>"+
'[CENTER]Приятной игры и времяпровождение на сервере [COLOR=rgb(255,255,0)]VORONEZH[/COLOR].[/CENTER][/B][/SIZE]',
prefix: UNACCEPT_PREFIX,
status: false,
},
{
title: 'Не готовы',
content:
'[SIZE=4][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}!<br><br>'+
"[CENTER]Администрация не готова снизить вам наказание.[/CENTER]<br><br>"+
'[CENTER]Приятной игры и времяпровождение на сервере [COLOR=rgb(255,255,0)]VORONEZH[/COLOR].[/CENTER][/B][/SIZE]',
prefix: UNACCEPT_PREFIX,
status: false,
},
{
title: '3-е лицо',
content:
'[SIZE=4][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}!<br><br>'+
"[CENTER]Обжалование от 3-го лица.[/CENTER]<br><br>"+
'[CENTER]Приятной игры и времяпровождение на сервере [COLOR=rgb(255,255,0)]VORONEZH[/COLOR].[/CENTER][/B][/SIZE]',
prefix: UNACCEPT_PREFIX,
status: false,
},
{
title: 'Окно бана',
content:
'[SIZE=4][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}!<br><br>'+
"[CENTER]Прикрепите окно бана при входе в игру.[/CENTER]<br><br>"+
'[CENTER]Приятной игры и времяпровождение на сервере [COLOR=rgb(255,255,0)]VORONEZH[/COLOR].[/CENTER][/B][/SIZE]',
prefix: UNACCEPT_PREFIX,
status: false,
},
{
title: 'Скриншот переписки',
content:
'[SIZE=4][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}!<br><br>'+
"[CENTER]Прикрепите скриншот с перепиской.[/CENTER]<br><br>"+
'[CENTER]Приятной игры и времяпровождение на сервере [COLOR=rgb(255,255,0)]VORONEZH[/COLOR].[/CENTER][/B][/SIZE]',
prefix: UNACCEPT_PREFIX,
status: false,
},
{
title: 'Окно бана+скрин переписки',
content:
'[SIZE=4][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}!<br><br>'+
"[CENTER]Прикрепите окно бана при входе в игру. И скриншот переписки.[/CENTER]<br><br>"+
'[CENTER]Приятной игры и времяпровождение на сервере [COLOR=rgb(255,255,0)]VORONEZH[/COLOR].[/CENTER][/B][/SIZE]',
prefix: UNACCEPT_PREFIX,
status: false,
},
{
title: 'nRP obman(обманщик написал)',
content:
'[SIZE=4][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}!<br><br>'+
"[CENTER]Обжалование в вашу пользу должен писать игрок, которого вы обманули.<br>В доказательствах должны иметься: окно блокировки вашего аккаунта, переписка с обманутым игроком, где вы решили на какую компенсацию он согласен и ваше сообщение, в котором вы признаете совершенную ошибку и впредь обязуетесь не повторять ее.<br>После всего этого главная администрация рассмотрит обжалование, но это не гарантирует того, что вас обжалуют.[/CENTER]<br><br>"+
'[CENTER]Приятной игры и времяпровождение на сервере [COLOR=rgb(255,255,0)]VORONEZH[/COLOR].[/CENTER][/B][/SIZE]',
prefix: UNACCEPT_PREFIX,
status: false,
},
{
title: 'nRP obman(вк отписать)',
content:
'[SIZE=4][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}!<br><br>'+
"[CENTER]Ваша задача отписать мне в вконтакте: <br>[QUOTE]https://vk.com/maksim_vitalievich - Максим Мельников.[/QUOTE][/CENTER]<br><br>"+
'[CENTER]Приятной игры и времяпровождение на сервере [COLOR=rgb(255,255,0)]VORONEZH[/COLOR].[/CENTER][/B][/SIZE]',
prefix: PIN_PREFIX,
status: false,
},
{
title: 'Не по форме',
content:
'[SIZE=4][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}!<br><br>'+
"[CENTER]Ваше обжалование составлено не по форме. Ознакомьтесь с [URL='https://forum.blackrussia.online/index.php?threads/Правила-подачи-заявки-на-обжалование-на%D0%BA%D0%B0%D0%B7%D0%B0%D0%BD%D0%B8%D1%8F.3429398/'][COLOR=rgb(255,0,0)]«Правила подачи заявки на обжалование наказания».[/color][/URL][/CENTER]<br><br>"+
'[CENTER]Приятной игры и времяпровождение на сервере [COLOR=rgb(255,255,0)]VORONEZH[/COLOR].[/CENTER][/B][/SIZE]',
prefix: UNACCEPT_PREFIX,
status: false,
},
{
title: 'Рук Модер ДС',
content:
'[SIZE=4][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}!<br><br>'+
"[CENTER]Ваше обжалование будет передано [COLOR=rgb(43,108,196)]Руководителю модераторов Forum/Discord[/color] - @sakaro [Color=Orange]на рассмотрение[/color]. Просьба не создавать подобных тем.[/CENTER]<br>",
prefix: PIN_PREFIX,
status: true,
},
{
title: 'ГА',
content:
'[SIZE=4][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}!<br><br>'+
"[CENTER]Ваше обжалование будет передано [Color=Red]Главному Администратору[/color] - @Jennie Carter[Color=Orange] на рассмотрение[/color]. Просьба не создавать подобных тем.[/CENTER]<br>",
prefix: GA_PREFIX,
status: true,
},
{
title: 'Специальной Администрации',
content:
'[SIZE=4][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}!<br><br>'+
"[CENTER]Ваше обжалование будет передано[COLOR=rgb(204,6,5)]Специальной Администрации[/color] - @Sander_Kligan, @Clarence Crown[/CENTER]<br><br>"+
'[CENTER][Color=Orange]На рассмотрении.[/Color][/CENTER][/B][/SIZE]',
prefix: SA_PREFIX,
status: true,
},
{
title: 'Команде проекта',
content:
'[SIZE=4][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}!<br><br>'+
"[CENTER]Ваше обжалование будет передано [COLOR=rgb(239,211,52)]Команде проекта.[/color][/CENTER]<br><br>"+
'[CENTER][Color=Orange]На рассмотрении.[/Color][/CENTER][/B][/SIZE]',
prefix: COMMAND_PREFIX,
status: true,
},

]
 
 
$(document).ready(() => {
// Загрузка скрипта для обработки шаблонов
$('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');
 
// Добавление кнопок при загрузке страницы
 
 
addButton('На рассмотрение', 'pin');
addButton('Одобрено', 'accepted');
addButton('Отказано', 'unaccept');
addButton('Закрыто', 'Zakrito');
addButton('ГА', 'GA');
addButton('Ответы КА', 'selectAnswer');
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
? 'Доброго времени суток'
: 18 < hours && hours <= 21
? 'Доброго времени суток'
: 21 < hours && hours <= 4
? 'Доброго времени суток'
: 'Доброго времени суток',
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