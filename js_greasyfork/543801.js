// ==UserScript==
// @name Ангельский скрипт для ГОСС | by Favorite Angel ☠
// @namespace https://forum.blackrussia.online
// @version 1.2.3
// @description kye
// @author Favorite_Angel
// @match https://forum.blackrussia.online/threads/*
// @include https://forum.blackrussia.online/threads/
// @grant none
// @license MIT
// @collaborator !
// @icon https://icons.iconarchive.com/icons/papirus-team/papirus-apps/48/emerald-theme-manager-icon-icon.png
// @downloadURL https://update.greasyfork.org/scripts/543801/%D0%90%D0%BD%D0%B3%D0%B5%D0%BB%D1%8C%D1%81%D0%BA%D0%B8%D0%B9%20%D1%81%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%93%D0%9E%D0%A1%D0%A1%20%7C%20by%20Favorite%20Angel%20%E2%98%A0.user.js
// @updateURL https://update.greasyfork.org/scripts/543801/%D0%90%D0%BD%D0%B3%D0%B5%D0%BB%D1%8C%D1%81%D0%BA%D0%B8%D0%B9%20%D1%81%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%93%D0%9E%D0%A1%D0%A1%20%7C%20by%20Favorite%20Angel%20%E2%98%A0.meta.js
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
title: '☠ СВОЙ ОТВЕТ ☠',
content:
"[url=https://postimages.org/][img]https://i.ibb.co/D1QkYF3/8P4g6gO.png[/img][/url]"+
'[SIZE=4][FONT=Times New Roman][CENTER][Color=rgb(0, 0, 0)][B]{{ greeting }},[/Color] уважаемый {{ user.mention }}!<br><br>'+
"[CENTER] твой текст [/CENTER]<br><br>"+
     "[Color=rgb(0, 0, 0)]Приятной игры и времяпровождения на сервере [COLOR=rgb(144,0,32)]CHERRY[/COLOR].[/FONT][/CENTER]"+
     "[url=https://postimages.org/][img]https://eu-markt.ru/image/catalog/description/222_0a77c632c31a320dd6c278f194992a21.png[/img][/url]",
},
{
title: '☠ На рассмотрение ☠',
content:
 "[url=https://postimages.org/][img]https://i.ibb.co/D1QkYF3/8P4g6gO.png[/img][/url]"+
'[SIZE=4][FONT=Times New Roman][CENTER][Color=rgb(0, 0, 0)][B]{{ greeting }},[/Color] уважаемый {{ user.mention }}!<br><br>'+
"[CENTER]Ваша жалоба взята на Рассмотрение. Просьба не создавать подобных тем, иначе ваш Форумный аккаунт может быть [U]заблокирован.[/U][/CENTER]<br><br>"+
'[CENTER][Color=rgb(0, 0, 0)]Ожидайте ответа от Администрации...[/CENTER][/B][/SIZE]'+
     "[Color=rgb(0, 0, 0)]Приятной игры и времяпровождения на сервере [COLOR=rgb(144,0,32)]CHERRY[/COLOR].[/FONT][/CENTER]"+
     "[url=https://postimages.org/][img]https://eu-markt.ru/image/catalog/description/222_0a77c632c31a320dd6c278f194992a21.png[/img][/url]",
prefix: PIN_PREFIX,
status: true,
},
{
    title: '☠ нет нарушений  ☠',
content:
 "[url=https://postimages.org/][img]https://i.ibb.co/D1QkYF3/8P4g6gO.png[/img][/url]"+
'[SIZE=4][FONT=Times New Roman][CENTER][Color=rgb(0, 0, 0)][B]{{ greeting }},[/Color] уважаемый {{ user.mention }}!<br><br>'+
"[CENTER] Нарушений со стороны лидера нет. [/CENTER]<br><br>"+
     "[Color=rgb(0, 0, 0)]Приятной игры и времяпровождения на сервере [COLOR=rgb(144,0,32)]CHERRY[/COLOR].[/FONT][/CENTER]"+
     "[url=https://postimages.org/][img]https://eu-markt.ru/image/catalog/description/222_0a77c632c31a320dd6c278f194992a21.png[/img][/url]",
prefix: UNACCEPT_PREFIX,
status: false,
},
{
title: '𓆩☠𓆪 𓆩☠𓆪 𓆩☠𓆪 𓆩☠𓆪 𓆩☠𓆪 𓆩☠𓆪 𓆩☠𓆪 𓆩☠𓆪 𓆩☠𓆪 Причины отказов 𓆩☠𓆪 𓆩☠𓆪 𓆩☠𓆪 𓆩☠𓆪 𓆩☠𓆪 𓆩☠𓆪 𓆩☠𓆪 𓆩☠𓆪 𓆩☠𓆪'
},
{
title: '♡ Отредакт доква ♡',
content:
 "[url=https://postimages.org/][img]https://i.ibb.co/D1QkYF3/8P4g6gO.png[/img][/url]"+
'[SIZE=4][FONT=Times New Roman][CENTER][Color=rgb(0, 0, 0)][B]{{ greeting }},[/Color] уважаемый {{ user.mention }}!<br><br>'+
"[CENTER] Рассмотрев ваши доказательства было замечено что доказетельства были отредактированы.[/CENTER]<br><br>"+
"[Color=rgb(0, 0, 0)]Примечание: Доказательства должны быть в первоначальном виде.<br><br>"+
     "[Color=rgb(0, 0, 0)]Приятной игры и времяпровождения на сервере [COLOR=rgb(144,0,32)]CHERRY[/COLOR].[/FONT][/CENTER]<br><br>"+
     "[CENTER] [Color=rgb(0, 0, 0)][I]Отказано.[/I][/CENTER]"+
     "[url=https://postimages.org/][img]https://eu-markt.ru/image/catalog/description/222_0a77c632c31a320dd6c278f194992a21.png[/img][/url]",
prefix: UNACCEPT_PREFIX,
status: false,
},
{
title: '☠ нет тайма ☠',
content:
 "[url=https://postimages.org/][img]https://i.ibb.co/D1QkYF3/8P4g6gO.png[/img][/url]"+
'[SIZE=4][FONT=Times New Roman][CENTER][Color=rgb(0, 0, 0)][B]{{ greeting }},[/Color] уважаемый {{ user.mention }}!<br><br>'+
"[CENTER] На предоставленных вами доказательствах отсутсвтует /time. При подачи жалобы, в доказательствах обязательно должен быть /time. [/CENTER]<br><br>"+
     "[Color=rgb(0, 0, 0)]Приятной игры и времяпровождения на сервере [COLOR=rgb(144,0,32)]CHERRY[/COLOR].[/FONT][/CENTER]<br><br>"+
     "[CENTER] [Color=rgb(0, 0, 0)][I]Отказано.[/I][/CENTER]"+
     "[url=https://postimages.org/][img]https://eu-markt.ru/image/catalog/description/222_0a77c632c31a320dd6c278f194992a21.png[/img][/url]",
prefix: UNACCEPT_PREFIX,
status: false,
},
{
title: '☠ ЖБ не по форме ☠',
content:
 "[url=https://postimages.org/][img]https://i.ibb.co/D1QkYF3/8P4g6gO.png[/img][/url]"+
'[SIZE=4][FONT=Times New Roman][CENTER][Color=rgb(0, 0, 0)][B]{{ greeting }},[/Color] уважаемый {{ user.mention }}!<br><br>'+
"[CENTER] Ваша жалоба составлена не по форме. Пожалуйста, ознакомьтесь с - [URL='https://forum.blackrussia.online/index.php?threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BF%D0%BE%D0%B4%D0%B0%D1%87%D0%B8-%D0%B6%D0%B0%D0%BB%D0%BE%D0%B1-%D0%BD%D0%B0-%D0%B8%D0%B3%D1%80%D0%BE%D0%BA%D0%BE%D0%B2.3429394/'][COLOR=rgb(0,0,0)]«Правилами подачи Жалоб на Игроков».[/color][/URL][/CENTER]<br><br>"+
     "[Color=rgb(0, 0, 0)]Приятной игры и времяпровождения на сервере [COLOR=rgb(144,0,32)]CHERRY[/COLOR].[/FONT][/CENTER]<br><br>"+
     "[CENTER] [Color=rgb(0, 0, 0)][I]Отказано.[/I][/CENTER]"+
     "[url=https://postimages.org/][img]https://eu-markt.ru/image/catalog/description/222_0a77c632c31a320dd6c278f194992a21.png[/img][/url]",
prefix: UNACCEPT_PREFIX,
status: false,
},
{
title: '☠ 3 дня ☠',
content:
 "[url=https://postimages.org/][img]https://i.ibb.co/D1QkYF3/8P4g6gO.png[/img][/url]"+
'[SIZE=4][FONT=Times New Roman][CENTER][Color=rgb(0, 0, 0)][B]{{ greeting }},[/Color] уважаемый {{ user.mention }}!<br><br>'+
"[CENTER] Ваша жалоба не подлежит рассмотрению, так как с момента нарушения от лидера прошло 72 часа [/CENTER]<br><br>"+
     "[Color=rgb(0, 0, 0)]Приятной игры и времяпровождения на сервере [COLOR=rgb(144,0,32)]CHERRY[/COLOR].[/FONT][/CENTER]<br><br>"+
     "[CENTER] [Color=rgb(0, 0, 0)][I]Отказано.[/I][/CENTER]"+
     "[url=https://postimages.org/][img]https://eu-markt.ru/image/catalog/description/222_0a77c632c31a320dd6c278f194992a21.png[/img][/url]",
prefix: UNACCEPT_PREFIX,
status: false,
},
    {
title: '☠ 3-е лицо ☠',
content:
 "[url=https://postimages.org/][img]https://i.ibb.co/D1QkYF3/8P4g6gO.png[/img][/url]"+
'[SIZE=4][FONT=Times New Roman][CENTER][Color=rgb(0, 0, 0)][B]{{ greeting }},[/Color] уважаемый {{ user.mention }}!<br><br>'+
"[CENTER] Ваша жалоба не подлежит рассмотрению, так как она составлена от третьего лица. [/CENTER]<br><br>"+
     "[Color=rgb(0, 0, 0)]Приятной игры и времяпровождения на сервере [COLOR=rgb(144,0,32)]CHERRY[/COLOR].[/FONT][/CENTER]<br><br>"+
     "[CENTER] [Color=rgb(0, 0, 0)][I]Отказано.[/I][/CENTER]"+
     "[url=https://postimages.org/][img]https://eu-markt.ru/image/catalog/description/222_0a77c632c31a320dd6c278f194992a21.png[/img][/url]",
prefix: UNACCEPT_PREFIX,
status: false,
},
{
title: '☠ тайм-коды ☠',
content:
 "[url=https://postimages.org/][img]https://i.ibb.co/D1QkYF3/8P4g6gO.png[/img][/url]"+
'[SIZE=4][FONT=Times New Roman][CENTER][Color=rgb(0, 0, 0)][B]{{ greeting }},[/Color] уважаемый {{ user.mention }}!<br><br>'+
"[CENTER] Ваша жалоба не подлежит рассмотрению, так как на видео-доказательствах отсутсвуют тайм-коды.  [/CENTER]<br><br>"+
    "[CENTER][U][SPOILER=][/U][COLOR=rgb(0, 0, 0)]Тайм-Код — это время начала определённого эпизода видеоролика. С помощью Тайм-Кода зритель сможет быстро найти нужный момент видео или перемотать к искомой части ролика.[/COLOR][/SPOILER]<br><br>"+
     "[Color=rgb(0, 0, 0)]Приятной игры и времяпровождения на сервере [COLOR=rgb(144,0,32)]CHERRY[/COLOR].[/FONT][/CENTER]<br><br>"+
     "[CENTER] [Color=rgb(0, 0, 0)][I]Отказано.[/I][/CENTER]"+
     "[url=https://postimages.org/][img]https://eu-markt.ru/image/catalog/description/222_0a77c632c31a320dd6c278f194992a21.png[/img][/url]",
prefix: UNACCEPT_PREFIX,
status: false,
},
{
title: '☠ Отредактированные док-ва ☠',
content:
 "[url=https://postimages.org/][img]https://i.ibb.co/D1QkYF3/8P4g6gO.png[/img][/url]"+
'[SIZE=4][FONT=Times New Roman][CENTER][Color=rgb(0, 0, 0)][B]{{ greeting }},[/Color] уважаемый {{ user.mention }}!<br><br>'+
"[CENTER] Ваша жалоба не подлежит рассмотрению, так как доказательства на нарушение игрока отредактированны. [/CENTER]<br><br>"+
     "[Color=rgb(0, 0, 0)]Приятной игры и времяпровождения на сервере [COLOR=rgb(144,0,32)]CHERRY[/COLOR].[/FONT][/CENTER]<br><br>"+
     "[CENTER] [Color=rgb(0, 0, 0)][I]Отказано.[/I][/CENTER]"+
     "[url=https://postimages.org/][img]https://eu-markt.ru/image/catalog/description/222_0a77c632c31a320dd6c278f194992a21.png[/img][/url]",
prefix: UNACCEPT_PREFIX,
status: false,
},
{
title: '☠ не лидер ☠',
content:
 "[url=https://postimages.org/][img]https://i.ibb.co/D1QkYF3/8P4g6gO.png[/img][/url]"+
'[SIZE=4][FONT=Times New Roman][CENTER][Color=rgb(0, 0, 0)][B]{{ greeting }},[/Color] уважаемый {{ user.mention }}!<br><br>'+
"[CENTER] Данный игрок не является лидером, обратитесь в раздел жалоб на сотрудников нужной вам организации. [/CENTER]<br><br>"+
     "[Color=rgb(0, 0, 0)]Приятной игры и времяпровождения на сервере [COLOR=rgb(144,0,32)]CHERRY[/COLOR].[/FONT][/CENTER]<br><br>"+
     "[CENTER] [Color=rgb(0, 0, 0)][I]Отказано.[/I][/CENTER]"+
     "[url=https://postimages.org/][img]https://eu-markt.ru/image/catalog/description/222_0a77c632c31a320dd6c278f194992a21.png[/img][/url]",
prefix: UNACCEPT_PREFIX,
status: false,
},
{
title: '☠ В Обжалование ☠',
content:
 "[url=https://postimages.org/][img]https://i.ibb.co/D1QkYF3/8P4g6gO.png[/img][/url]"+
'[SIZE=4][FONT=Times New Roman][CENTER][Color=rgb(0, 0, 0)][B]{{ greeting }},[/Color] уважаемый {{ user.mention }}!<br><br>'+
"[CENTER] Данный раздел не занимается обжалованиями наказаний, обратитесь в раздел [URL='https://forum.blackrussia.online/forums/%D0%9E%D0%B1%D0%B6%D0%B0%D0%BB%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D0%B5-%D0%BD%D0%B0%D0%BA%D0%B0%D0%B7%D0%B0%D0%BD%D0%B8%D0%B9.436/'][COLOR=rgb(0,0,0)]«Обжалования наказаний».[/color][/URL][/CENTER]<br><br>"+
     "[Color=rgb(0, 0, 0)]Приятной игры и времяпровождения на сервере [COLOR=rgb(144,0,32)]CHERRY[/COLOR].[/FONT][/CENTER]<br><br>"+
     "[CENTER] [Color=rgb(0, 0, 0)][I]Отказано.[/I][/CENTER]"+
     "[url=https://postimages.org/][img]https://eu-markt.ru/image/catalog/description/222_0a77c632c31a320dd6c278f194992a21.png[/img][/url]",
prefix: UNACCEPT_PREFIX,
status: false,
},
{
title: '☠ Другой сервак ☠',
content:
 "[url=https://postimages.org/][img]https://i.ibb.co/D1QkYF3/8P4g6gO.png[/img][/url]"+
'[SIZE=4][FONT=Times New Roman][CENTER][Color=rgb(0, 0, 0)][B]{{ greeting }},[/Color] уважаемый {{ user.mention }}!<br><br>'+
"[CENTER] Вы ошиблись сервером, переношу вашу жалобу на ваш сервер. [/CENTER]<br><br>"+
     "[Color=rgb(0, 0, 0)]Приятной игры и времяпровождения на сервере [COLOR=rgb(144,0,32)]CHERRY[/COLOR].[/FONT][/CENTER]<br><br>"+
     "[CENTER] [Color=rgb(0, 0, 0)][I][/I][/CENTER]"+
     "[url=https://postimages.org/][img]https://eu-markt.ru/image/catalog/description/222_0a77c632c31a320dd6c278f194992a21.png[/img][/url]",
},
{
title: '☠ нет докв ☠',
content:
 "[url=https://postimages.org/][img]https://i.ibb.co/D1QkYF3/8P4g6gO.png[/img][/url]"+
'[SIZE=4][FONT=Times New Roman][CENTER][Color=rgb(0, 0, 0)][B]{{ greeting }},[/Color] уважаемый {{ user.mention }}!<br><br>'+
"[CENTER] Вашей жалобе отказано, так как в ней отсутсвуют доказательства. [/CENTER]<br><br>"+
     "[Color=rgb(0, 0, 0)]Приятной игры и времяпровождения на сервере [COLOR=rgb(144,0,32)]CHERRY[/COLOR].[/FONT][/CENTER]<br><br>"+
     "[CENTER] [Color=rgb(0, 0, 0)][I]Отказано.[/I][/CENTER]"+
     "[url=https://postimages.org/][img]https://eu-markt.ru/image/catalog/description/222_0a77c632c31a320dd6c278f194992a21.png[/img][/url]",
prefix: UNACCEPT_PREFIX,
status: false,
},
{
title: '☠ дублирование тем ☠',
content:
 "[url=https://postimages.org/][img]https://i.ibb.co/D1QkYF3/8P4g6gO.png[/img][/url]"+
'[SIZE=4][FONT=Times New Roman][CENTER][Color=rgb(0, 0, 0)][B]{{ greeting }},[/Color] уважаемый {{ user.mention }}!<br><br>'+
"[CENTER] ДАнная жалоба является копией вашей преведущей жалобы. Если вы продолжите дублировать темы, ваш форумный аккаунт будет заблокирован. [/CENTER]<br><br>"+
     "[Color=rgb(0, 0, 0)]Приятной игры и времяпровождения на сервере [COLOR=rgb(144,0,32)]CHERRY[/COLOR].[/FONT][/CENTER]<br><br>"+
     "[CENTER] [Color=rgb(0, 0, 0)][I]Отказано.[/I][/CENTER]"+
     "[url=https://postimages.org/][img]https://eu-markt.ru/image/catalog/description/222_0a77c632c31a320dd6c278f194992a21.png[/img][/url]",
prefix: UNACCEPT_PREFIX,
status: false,
},
{
title: '☠ ненадежный хост ☠',
content:
 "[url=https://postimages.org/][img]https://i.ibb.co/D1QkYF3/8P4g6gO.png[/img][/url]"+
'[SIZE=4][FONT=Times New Roman][CENTER][Color=rgb(0, 0, 0)][B]{{ greeting }},[/Color] уважаемый {{ user.mention }}!<br><br>'+
"[CENTER] Ваша жалоба не подлежит рассмотрению, так как доказательства не из надежных источников. Воспользуйтесь другим хостингом, например: YouTube, Imgur, Yapix, Яндекс Диск и тд [/CENTER]<br><br>"+
     "[Color=rgb(0, 0, 0)]Приятной игры и времяпровождения на сервере [COLOR=rgb(144,0,32)]CHERRY[/COLOR].[/FONT][/CENTER]<br><br>"+
     "[CENTER] [Color=rgb(0, 0, 0)][I]Отказано.[/I][/CENTER]"+
     "[url=https://postimages.org/][img]https://eu-markt.ru/image/catalog/description/222_0a77c632c31a320dd6c278f194992a21.png[/img][/url]",
prefix: UNACCEPT_PREFIX,
status: false,
},
{
title: '☠ не полный/обравается ☠',
content:
 "[url=https://postimages.org/][img]https://i.ibb.co/D1QkYF3/8P4g6gO.png[/img][/url]"+
'[SIZE=4][FONT=Times New Roman][CENTER][Color=rgb(0, 0, 0)][B]{{ greeting }},[/Color] уважаемый {{ user.mention }}!<br><br>'+
"[CENTER] Ваша жалоба не подлежит рассмотрению, так как предоставленные вами доказательства не полны либо обрываются. Воспользуйтесь другим хостингом, например: YouTube, Imgur, Yapix, Яндекс Диск и тд. [/CENTER]<br><br>"+
     "[Color=rgb(0, 0, 0)]Приятной игры и времяпровождения на сервере [COLOR=rgb(144,0,32)]CHERRY[/COLOR].[/FONT][/CENTER]<br><br>"+
     "[CENTER] [Color=rgb(0, 0, 0)][I]Отказано.[/I][/CENTER]"+
     "[url=https://postimages.org/][img]https://eu-markt.ru/image/catalog/description/222_0a77c632c31a320dd6c278f194992a21.png[/img][/url]",
prefix: UNACCEPT_PREFIX,
status: false,
},
{
title: '☠ док-ва не работают ☠',
content:
 "[url=https://postimages.org/][img]https://i.ibb.co/D1QkYF3/8P4g6gO.png[/img][/url]"+
'[SIZE=4][FONT=Times New Roman][CENTER][Color=rgb(0, 0, 0)][B]{{ greeting }},[/Color] уважаемый {{ user.mention }}!<br><br>'+
"[CENTER] Ваша жалоба не подлежит рассмотрению, так как предоставленные вами доказательства не работают. Воспользуйтесь другим хостингом, например: YouTube, Imgur, Yapix, Яндекс Диск и тд. [/CENTER]<br><br>"+
     "[Color=rgb(0, 0, 0)]Приятной игры и времяпровождения на сервере [COLOR=rgb(144,0,32)]CHERRY[/COLOR].[/FONT][/CENTER]<br><br>"+
     "[CENTER] [Color=rgb(0, 0, 0)][I]Отказано.[/I][/CENTER]"+
     "[url=https://postimages.org/][img]https://eu-markt.ru/image/catalog/description/222_0a77c632c31a320dd6c278f194992a21.png[/img][/url]",
prefix: UNACCEPT_PREFIX,
status: false,
},
{
title: '☠ недостаточно докв ☠',
content:
 "[url=https://postimages.org/][img]https://i.ibb.co/D1QkYF3/8P4g6gO.png[/img][/url]"+
'[SIZE=4][FONT=Times New Roman][CENTER][Color=rgb(0, 0, 0)][B]{{ greeting }},[/Color] уважаемый {{ user.mention }}!<br><br>'+
"[CENTER] Ваша жалоба не подлежит рассмотрению, так как доказательств на нарушение со стороны лидера не достаточно. [/CENTER]<br><br>"+
     "[Color=rgb(0, 0, 0)]Приятной игры и времяпровождения на сервере [COLOR=rgb(144,0,32)]CHERRY[/COLOR].[/FONT][/CENTER]<br><br>"+
     "[CENTER] [Color=rgb(0, 0, 0)][I]Отказано.[/I][/CENTER]"+
     "[url=https://postimages.org/][img]https://eu-markt.ru/image/catalog/description/222_0a77c632c31a320dd6c278f194992a21.png[/img][/url]",
prefix: UNACCEPT_PREFIX,
status: false,
},
{
title: '☠ Не по теме ☠',
content:
 "[url=https://postimages.org/][img]https://i.ibb.co/D1QkYF3/8P4g6gO.png[/img][/url]"+
'[SIZE=4][FONT=Times New Roman][CENTER][Color=rgb(0, 0, 0)][B]{{ greeting }},[/Color] уважаемый {{ user.mention }}!<br><br>'+
"[CENTER] Ваша тема некоим образом не относится к назначению данного раздела. при повторном нарушении ваш форумный аккаунт может быть заблокирован. [/CENTER]<br><br>"+
     "[Color=rgb(0, 0, 0)]Приятной игры и времяпровождения на сервере [COLOR=rgb(144,0,32)]CHERRY[/COLOR].[/FONT][/CENTER]<br><br>"+
     "[CENTER] [Color=rgb(0, 0, 0)][I][/I][/CENTER]"+
     "[url=https://postimages.org/][img]https://eu-markt.ru/image/catalog/description/222_0a77c632c31a320dd6c278f194992a21.png[/img][/url]",
prefix: UNACCEPT_PREFIX,
status: false,
},
{
title: '☠ оск в жалобе ☠',
content:
 "[url=https://postimages.org/][img]https://i.ibb.co/D1QkYF3/8P4g6gO.png[/img][/url]"+
'[SIZE=4][FONT=Times New Roman][CENTER][Color=rgb(0, 0, 0)][B]{{ greeting }},[/Color] уважаемый {{ user.mention }}!<br><br>'+
"[CENTER] Ваша жалоба не подлежит рассмотрению, так как в ней присутствуют оскорбительные фразы/смайлики. [/CENTER]<br><br>"+
     "[Color=rgb(0, 0, 0)]Приятной игры и времяпровождения на сервере [COLOR=rgb(144,0,32)]CHERRY[/COLOR].[/FONT][/CENTER]<br><br>"+
     "[CENTER] [Color=rgb(0, 0, 0)][I]Отказано.[/I][/CENTER]"+
     "[url=https://postimages.org/][img]https://eu-markt.ru/image/catalog/description/222_0a77c632c31a320dd6c278f194992a21.png[/img][/url]",
prefix: UNACCEPT_PREFIX,
status: false,
},
    {
title: '☠ плохое качество ☠',
content:
 "[url=https://postimages.org/][img]https://i.ibb.co/D1QkYF3/8P4g6gO.png[/img][/url]"+
'[SIZE=4][FONT=Times New Roman][CENTER][Color=rgb(0, 0, 0)][B]{{ greeting }},[/Color] уважаемый {{ user.mention }}!<br><br>'+
"[CENTER] Ваша жалоба не подлежит рассмотрению, так как доказательства имеют плохое качество. Воспользуйтесь другим хостингом. [/CENTER]<br><br>"+
     "[Color=rgb(0, 0, 0)]Приятной игры и времяпровождения на сервере [COLOR=rgb(144,0,32)]CHERRY[/COLOR].[/FONT][/CENTER]<br><br>"+
     "[CENTER] [Color=rgb(0, 0, 0)][I]Отказано.[/I][/CENTER]"+
     "[url=https://postimages.org/][img]https://eu-markt.ru/image/catalog/description/222_0a77c632c31a320dd6c278f194992a21.png[/img][/url]",
prefix: UNACCEPT_PREFIX,
status: false,
},
{
title: '𓆩☠𓆪 𓆩☠𓆪 𓆩☠𓆪 𓆩☠𓆪 𓆩☠𓆪 𓆩☠𓆪 𓆩☠𓆪 𓆩☠𓆪 𓆩☠𓆪 Шаблоны для заявок на лд 𓆩☠𓆪 𓆩☠𓆪 𓆩☠𓆪 𓆩☠𓆪 𓆩☠𓆪 𓆩☠𓆪 𓆩☠𓆪 𓆩☠𓆪 𓆩☠𓆪'
},
 {
title: '☠ На рассмотрении ☠',
content:
"[url=https://postimages.org/][img]https://i.ibb.co/D1QkYF3/8P4g6gO.png[/img][/url]"+
'[SIZE=4][FONT=Times New Roman][CENTER][Color=rgb(0, 0, 0)][B]{{ greeting }},[/Color] уважаемые игроки!<br><br>'+
"[CENTER] Выше поданные заявки находятся на рассмотрении. Все что ниже будет отказано.[/CENTER]<br><br>"+
     "[CENTER] Ожидайте ответа от руководства ГОСС.[/CENTER]<br><br>"+
     "[Color=rgb(0, 0, 0)]Приятной игры и времяпровождения на сервере [COLOR=rgb(144,0,32)]CHERRY[/COLOR].[/FONT][/CENTER]"+
     "[url=https://postimages.org/][img]https://eu-markt.ru/image/catalog/description/222_0a77c632c31a320dd6c278f194992a21.png[/img][/url]",
},
{
title: '☠ Одобрено/Отказ ☠',
content:
"[url=https://postimages.org/][img]https://i.ibb.co/D1QkYF3/8P4g6gO.png[/img][/url]"+
'[SIZE=4][FONT=Times New Roman][CENTER][Color=rgb(0, 0, 0)][B]{{ greeting }}, уважаемые игроки![/Color]<br><br>'+
      "[CENTER] [url=https://postimages.org/][img]https://i.ibb.co/4FnVsC8/image.png[/img][/url] [CENTER]"+
"[CENTER] Кандидаты, которые подходят по всем критериям [/CENTER]<br><br>"+
    "[CENTER] СЮДА ОДОБРЕННЫХ [/CENTER]<br><br>"+
    "[CENTER] Кандидаты, которые не подходят по критериям [/CENTER]<br><br>"+
     "[CENTER] СЮДА ОТКАЗАНЫХ [/CENTER]<br><br>"+
    "[CENTER] [url=https://postimages.org/][img]https://i.ibb.co/4FnVsC8/image.png[/img][/url] [CENTER]"+
     "[CENTER] ❗Обзвон пройдет в официальном дискорде сервера CHERRY 🍒 Все одобренные кандидаты будут добавлены в закрытую беседу, где они получат всю необходимую информацию. Там будет указана точная дата и время проведения обзвона, а также размещены дополнительные инструкции, которые помогут лучше подготовиться. Просим внимательно следить за сообщениями в этой беседе, чтобы ничего не пропустить.❗.[/CENTER]<br><br>"+
     "Приятной игры и времяпровождения на сервере [COLOR=rgb(144,0,32)]CHERRY[/COLOR].[/FONT][/CENTER]"+
     "[url=https://postimages.org/][img]https://eu-markt.ru/image/catalog/description/222_0a77c632c31a320dd6c278f194992a21.png[/img][/url]",
},
]


$(document).ready(() => {
// Загрузка скрипта для обработки шаблонов
$('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');

// Добавление кнопок при загрузке страницы


addButton('♤ На Рассмотрение ♤', 'pin');
addButton('♤ Одобрено ♤', 'accepted');
addButton('♤ Отказано ♤', 'unaccept');
addButton('♤ Закрыто ♤', 'Zakrito');
addButton('♤ Ответы ♤', 'selectAnswer');

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