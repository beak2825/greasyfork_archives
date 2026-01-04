// ==UserScript==
// @name Для Максимки
// @version 0.2.0
// @description Кураторы форума
// @author Maksim_Vitalievich
// @match https://forum.blackrussia.online/threads/*
// @include https://forum.blackrussia.online/threads/
// @grant none
// @license MIT
// @namespace https://forum.blackrussia.online
// @collaborator !
// @downloadURL https://update.greasyfork.org/scripts/504304/%D0%94%D0%BB%D1%8F%20%D0%9C%D0%B0%D0%BA%D1%81%D0%B8%D0%BC%D0%BA%D0%B8.user.js
// @updateURL https://update.greasyfork.org/scripts/504304/%D0%94%D0%BB%D1%8F%20%D0%9C%D0%B0%D0%BA%D1%81%D0%B8%D0%BC%D0%BA%D0%B8.meta.js
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
title: 'Свой ответ',
content:
'[SIZE=4][FONT=Verdana][COLOR=#e393f8][CENTER][B]{{ greeting }}, уважаемый[/color] {{ user.mention }}!<br>'+
"[url=https://postimages.org/][img]https://i.postimg.cc/0QWKPkN2/image.png[/img][/url]<br>"+
" <br>"+
"[url=https://postimages.org/][img]https://i.postimg.cc/0QWKPkN2/image.png[/img][/url]<br>",
},
{
title: 'Свой ответ',
content:
'[SIZE=4][FONT=Verdana][COLOR=#e393f8][CENTER][B]{{ greeting }}, уважаемый[/color] {{ user.mention }}!<br>'+
"[url=https://postimages.org/][img]https://i.postimg.cc/0QWKPkN2/image.png[/img][/url]<br>"+
" <br>"+
"[url=https://postimages.org/][img]https://i.postimg.cc/0QWKPkN2/image.png[/img][/url]<br>",
},
{
title: '♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥ ЖАЛОБЫ НА ИГРОКОВ ♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥'
},
{
title: 'На рассмотрение',
content:
'[SIZE=4][FONT=Verdana][COLOR=#ff9800][CENTER][B]{{ greeting }}, уважаемый[/color] {{ user.mention }}!<br>'+
"[url=https://postimages.org/][img]https://i.postimg.cc/0QWKPkN2/image.png[/img][/url]<br>"+
"[CENTER]Ваша жалоба взята [Color=Orange]на рассмотрение[/Color], ожидайте ответа от администрации сервера.<br>Просьба не создавать подобных тем, иначе форумный аккаунт может быть [Color=Red]заблокирован.[/CENTER]"+
"[url=https://postimages.org/][img]https://i.postimg.cc/0QWKPkN2/image.png[/img][/url]<br>"+
"[url=http://x-lines.ru/][img]http://x-lines.ru/letters/i/cyrillicgothic/1066/fa9e29/16/1/4nq7brby4nopbrgow8ekdwrh4nxpbesowdejmwr74ncpbgy.png[/img][/url]",
prefix: PIN_PREFIX,
status: true,
},
{
title: 'Техническому специалисту',
content:
'[SIZE=4][FONT=verdana][COLOR=#e393f8][CENTER][B]{{ greeting }}, уважаемый[/color] {{ user.mention }}!<br>'+
"[url=https://postimages.org/][img]https://i.postimg.cc/0QWKPkN2/image.png[/img][/url]<br>"+
"[CENTER]Ваша жалоба передана [Color=Orange]на рассмотрение[/Color] техническому специалисту.<br>Просьба не создавать подобных тем, иначе форумный аккаунт может быть [Color=Red]заблокирован."+
"[url=https://postimages.org/][img]https://i.postimg.cc/0QWKPkN2/image.png[/img][/url]"+
'[url=http://x-lines.ru/][img]http://x-lines.ru/letters/i/cyrillicgothic/1066/1f56db/20/1/4ntpbfqowzej5wra4nu7bfqow8ejiwr64nqpbe3y4no7b86o1zekpwra4nepbg6oudekdwfn4nto.png[/img][/url]',
prefix: TEXU_PREFIX,
status: true,
},
{
title: 'Главному администратору',
content:
'[SIZE=4][FONT=verdana][COLOR=#ff0000][CENTER][B]{{ greeting }}, уважаемый[/color] {{ user.mention }}!<br>'+
"[url=https://postimages.org/][img]https://i.postimg.cc/0QWKPkN2/image.png[/img][/url]<br>"+
"[CENTER]Ваша жалоба передана [Color=Red]Главному администратору[/Color] сервера.<br>Просьба не создавать подобных тем, иначе форумный аккаунт может быть [Color=Red]заблокирован.[/CENTER]<br>"+
"[url=https://postimages.org/][img]https://i.postimg.cc/0QWKPkN2/image.png[/img][/url]"+
'[url=http://x-lines.ru/][img]http://x-lines.ru/letters/i/cyrillicgothic/1066/e90c0c/20/1/4nj7bg6o1dejfwr74nxpb8gowcopbrgo1uej3wra4nq7bggow8ekfwfy4nepbesou5ekbwfd.png[/img][/url]',
prefix: GA_PREFIX,
status: true,
},
{
title: 'Заместителю ГА',
content:
'[SIZE=4][FONT=verdana][COLOR=#ff0000][CENTER][B]{{ greeting }}, уважаемый[/color] {{ user.mention }}!<br>'+
"[url=https://postimages.org/][img]https://i.postimg.cc/0QWKPkN2/image.png[/img][/url]<br>"+
"[CENTER]Ваша жалоба передана [Color=Red]Заместителям главного администратора[/Color]. <br>Просьба не создавать подобных тем, иначе форумный аккаунт может быть [Color=Red]заблокирован.[/CENTER]<br>"+
"[url=https://postimages.org/][img]https://i.postimg.cc/0QWKPkN2/image.png[/img][/url]"+
'[url=http://x-lines.ru/][img]http://x-lines.ru/letters/i/cyrillicgothic/1066/ef060c/20/1/4nm7brgouuejmwfb4ntpbggowmejmwr54nznbwru4np7brgo1mej5wr64nj7b8ty4nepbfgouuejtwr74ncpbeqowmekbwro4ntpb8sowdejy.png[/img][/url]',
prefix: GA_PREFIX,
status: true,
},
{
title: 'Специальной администрации',
content:
'[SIZE=4][FONT=verdana][COLOR=#ff0000][CENTER][B]{{ greeting }}, уважаемый[/color] {{ user.mention }}!<br>'+
"[url=https://postimages.org/][img]https://i.postimg.cc/0QWKPkN2/image.png[/img][/url]<br>"+
"[CENTER]Ваша жалоба передана на рассмотрение [Color=Red] Специальной администрации — @Sander_Kligan [/Color], а также его заместителям – @Clarence Crown, @Dmitry Dmitrich, @Myron_Capone, @Liana_Mironova, @Gleb Xovirs <br>Просьба не создавать подобных тем, иначе форумный аккаунт может быть [Color=Red]заблокирован.[/CENTER]<br>"+
"[url=https://postimages.org/][img]https://i.postimg.cc/0QWKPkN2/image.png[/img][/url]<br>"+
"[url=http://x-lines.ru/][img]http://x-lines.ru/letters/i/cyrillicgothic/1066/f12229/20/1/4no7b86o1zekpwra4nepbg6oiuej5wr64nc1bwro4nkpb8goudej5wra4no7besowdejbwfg4ncpbgy.png[/img][/url]",
prefix: SA_PREFIX,
status: true,
},
{
title: '♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥ ОТКАЗАННЫЕ ♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥'
},
{
title: 'Долг',
content:
'[SIZE=4][FONT=Verdana][COLOR=red][CENTER][B]{{ greeting }}, уважаемый[/color]{{ user.mention }}!<br>'+
"[url=https://postimages.org/][img]https://i.postimg.cc/0QWKPkN2/image.png[/img][/url]<br>"+
"[CENTER]Долг выдается только через банк. Если долг выдан через /trade или другим способом — [color=red]не наказуемо[/color]."+
"[url=https://postimages.org/][img]https://i.postimg.cc/0QWKPkN2/image.png[/img][/url]<br>"+
"[url=http://x-lines.ru/][img]http://x-lines.ru/letters/i/cyrillicgothic/1066/CC0000/20/1/rdej7wfn4nppbrgo19ejbwr74nxy.png[/img][/url]",
prefix: UNACCEPT_PREFIX,
status: false,
},
{
title: 'Придержание условий сделки',
content:
'[SIZE=4][FONT=Verdana][COLOR=red][CENTER][B]{{ greeting }}, уважаемый[/color]{{ user.mention }}!<br>'+
"[url=https://postimages.org/][img]https://i.postimg.cc/0QWKPkN2/image.png[/img][/url]<br>"+
"[CENTER]Вы не придержались условий сделки - следовательно, жалоба рассмотрению не подлежит."+
"[url=https://postimages.org/][img]https://i.postimg.cc/0QWKPkN2/image.png[/img][/url]<br>"+
"[url=http://x-lines.ru/][img]http://x-lines.ru/letters/i/cyrillicgothic/1066/CC0000/20/1/rdej7wfn4nppbrgo19ejbwr74nxy.png[/img][/url]",
prefix: UNACCEPT_PREFIX,
status: false,
},
{
title: 'Слив склада (информация)',
content:
'[SIZE=4][FONT=Verdana][COLOR=red][CENTER][B]{{ greeting }}, уважаемый[/color]{{ user.mention }}!<br>'+
"[url=https://postimages.org/][img]https://i.postimg.cc/0QWKPkN2/image.png[/img][/url]<br>"+
"[CENTER] Нужен фрапс, где будет видно, что именно Вы являетесь лидером семьи, информация о том сколько можно брать патронов, логирование количества взятия патронов/материалов игрока и /time.<br>"+
"[url=https://postimages.org/][img]https://i.postimg.cc/0QWKPkN2/image.png[/img][/url]<br>"+
"[url=http://x-lines.ru/][img]http://x-lines.ru/letters/i/cyrillicgothic/1066/CC0000/20/1/rdej7wfn4nppbrgo19ejbwr74nxy.png[/img][/url]",
prefix: UNACCEPT_PREFIX,
status: false,
},
{
title: 'Слив семьи - склад (информация)',
content:
'[SIZE=4][FONT=Verdana][COLOR=red][CENTER][B]{{ greeting }}, уважаемый[/color]{{ user.mention }}!<br>'+
"[url=https://postimages.org/][img]https://i.postimg.cc/0QWKPkN2/image.png[/img][/url]<br>"+
"[CENTER] Необходим фрапс, где будет видно, что именно Вы являетесь лидером семьи, логирование действий игрока, которые доказывают слив и /time.<br>"+
"[url=https://postimages.org/][img]https://i.postimg.cc/0QWKPkN2/image.png[/img][/url]<br>"+
"[url=http://x-lines.ru/][img]http://x-lines.ru/letters/i/cyrillicgothic/1066/CC0000/20/1/rdej7wfn4nppbrgo19ejbwr74nxy.png[/img][/url]",
prefix: UNACCEPT_PREFIX,
status: false,
},
{
title: 'нет условия сделки',
content:
'[SIZE=4][FONT=Verdana][COLOR=red][CENTER][B]{{ greeting }}, уважаемый[/color]{{ user.mention }}!<br>'+
"[url=https://postimages.org/][img]https://i.postimg.cc/0QWKPkN2/image.png[/img][/url]<br>"+
"[CENTER]В доказательствах отсутствуют условия сделки — следовательно, рассмотрению жалоба не подлежит.<br>"+
"[url=https://postimages.org/][img]https://i.postimg.cc/0QWKPkN2/image.png[/img][/url]<br>"+
"[url=http://x-lines.ru/][img]http://x-lines.ru/letters/i/cyrillicgothic/1066/CC0000/20/1/rdej7wfn4nppbrgo19ejbwr74nxy.png[/img][/url]",
prefix: UNACCEPT_PREFIX,
status: false,
},
{
title: 'нет /time',
content:
'[SIZE=4][FONT=Verdana][COLOR=red][CENTER][B]{{ greeting }}, уважаемый[/color]{{ user.mention }}!<br>'+
"[url=https://postimages.org/][img]https://i.postimg.cc/0QWKPkN2/image.png[/img][/url]<br>"+
"[CENTER]В доказательствах нет /time.  <br>"+
"[url=https://postimages.org/][img]https://i.postimg.cc/0QWKPkN2/image.png[/img][/url]<br>"+
"[url=http://x-lines.ru/][img]http://x-lines.ru/letters/i/cyrillicgothic/1066/CC0000/20/1/rdej7wfn4nppbrgo19ejbwr74nxy.png[/img][/url]",
prefix: UNACCEPT_PREFIX,
status: false,
},
{
title: 'Заголовок не по форме.',
content:
'[SIZE=4][FONT=Verdana][COLOR=red][CENTER][B]{{ greeting }}, уважаемый[/color]{{ user.mention }}!<br>'+
"[url=https://postimages.org/][img]https://i.postimg.cc/0QWKPkN2/image.png[/img][/url]<br>"+
"[CENTER]Заголовок жалобы составлен не по форме. Ознакомьтесь с [URL='https://forum.blackrussia.online/index.php?threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BF%D0%BE%D0%B4%D0%B0%D1%87%D0%B8-%D0%B6%D0%B0%D0%BB%D0%BE%D0%B1-%D0%BD%D0%B0-%D0%B8%D0%B3%D1%80%D0%BE%D0%BA%D0%BE%D0%B2.3429394/'][COLOR=rgb(255,0,0)]«правилами подачи жалоб на игроков».[/color][/URL][/CENTER]<br>"+
"[url=https://postimages.org/][img]https://i.postimg.cc/0QWKPkN2/image.png[/img][/url]<br>"+
"[url=http://x-lines.ru/][img]http://x-lines.ru/letters/i/cyrillicgothic/1066/CC0000/20/1/rdej7wfn4nppbrgo19ejbwr74nxy.png[/img][/url]",
prefix: UNACCEPT_PREFIX,
status: false,
},
{
title: 'Жалоба не по форме',
content:
'[SIZE=4][FONT=Verdana][COLOR=red][CENTER][B]{{ greeting }}, уважаемый[/color]{{ user.mention }}!<br>'+
"[url=https://postimages.org/][img]https://i.postimg.cc/0QWKPkN2/image.png[/img][/url]<br>"+
"[CENTER]Жалоба составлена не по форме. Ознакомьтесь с [URL='https://forum.blackrussia.online/index.php?threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BF%D0%BE%D0%B4%D0%B0%D1%87%D0%B8-%D0%B6%D0%B0%D0%BB%D0%BE%D0%B1-%D0%BD%D0%B0-%D0%B8%D0%B3%D1%80%D0%BE%D0%BA%D0%BE%D0%B2.3429394/'][COLOR=rgb(255,0,0)]«правилами подачи жалоб на игроков».[/color][/URL][/CENTER]<br>"+
"[url=https://postimages.org/][img]https://i.postimg.cc/0QWKPkN2/image.png[/img][/url]<br>"+
"[url=http://x-lines.ru/][img]http://x-lines.ru/letters/i/cyrillicgothic/1066/CC0000/20/1/rdej7wfn4nppbrgo19ejbwr74nxy.png[/img][/url]",
prefix: UNACCEPT_PREFIX,
status: false,
},{
title: 'Жалоба от 3-его лица',
content:
'[SIZE=4][FONT=Verdana][COLOR=red][CENTER][B]{{ greeting }}, уважаемый[/color]{{ user.mention }}!<br>'+
"[url=https://postimages.org/][img]https://i.postimg.cc/0QWKPkN2/image.png[/img][/url]<br>"+
"[CENTER] Ваша жалоба от 3-го лица, что не подлежит рассмотрению. <br>"+
"[url=https://postimages.org/][img]https://i.postimg.cc/0QWKPkN2/image.png[/img][/url]<br>"+
"[url=http://x-lines.ru/][img]http://x-lines.ru/letters/i/cyrillicgothic/1066/CC0000/20/1/rdej7wfn4nppbrgo19ejbwr74nxy.png[/img][/url]",
prefix: UNACCEPT_PREFIX,
status: false,
},
{
title: 'прошло 72 часа',
content:
'[SIZE=4][FONT=Verdana][COLOR=red][CENTER][B]{{ greeting }}, уважаемый[/color]{{ user.mention }}!<br>'+
"[url=https://postimages.org/][img]https://i.postimg.cc/0QWKPkN2/image.png[/img][/url]<br>"+
"[CENTER] С момента нарушения игрока прошло 72 часа. Жалоба не может быть рассмотрена. <br>"+
"[url=https://postimages.org/][img]https://i.postimg.cc/0QWKPkN2/image.png[/img][/url]<br>"+
"[url=http://x-lines.ru/][img]http://x-lines.ru/letters/i/cyrillicgothic/1066/CC0000/20/1/rdej7wfn4nppbrgo19ejbwr74nxy.png[/img][/url]",
prefix: UNACCEPT_PREFIX,
status: false,
},
{
title: 'Не верные ники',
content:
'[SIZE=4][FONT=Verdana][COLOR=red][CENTER][B]{{ greeting }}, уважаемый[/color]{{ user.mention }}!<br>'+
"[url=https://postimages.org/][img]https://i.postimg.cc/0QWKPkN2/image.png[/img][/url]<br>"+
"[CENTER] Игровой ник автора жалобы, ник игрока, на которого подается жалоба, должны быть указаны в соответствии с правилами подачи жалоб, даже если эта информация присутствует на доказательствах или в тексте жалобы. <br>"+
"[url=https://postimages.org/][img]https://i.postimg.cc/0QWKPkN2/image.png[/img][/url]<br>"+
"[url=http://x-lines.ru/][img]http://x-lines.ru/letters/i/cyrillicgothic/1066/CC0000/20/1/rdej7wfn4nppbrgo19ejbwr74nxy.png[/img][/url]",
prefix: UNACCEPT_PREFIX,
status: false,
},
{
title: 'Отредактированы доказательства',
content:
'[SIZE=4][FONT=Verdana][COLOR=red][CENTER][B]{{ greeting }}, уважаемый[/color]{{ user.mention }}!<br>'+
"[url=https://postimages.org/][img]https://i.postimg.cc/0QWKPkN2/image.png[/img][/url]<br>"+
"[CENTER] Ваши доказательства отредактированы.<br> · Примечание: Доказательства должны быть в первоначальном виде. <br>"+
"[url=https://postimages.org/][img]https://i.postimg.cc/0QWKPkN2/image.png[/img][/url]<br>"+
"[url=http://x-lines.ru/][img]http://x-lines.ru/letters/i/cyrillicgothic/1066/CC0000/20/1/rdej7wfn4nppbrgo19ejbwr74nxy.png[/img][/url]",
prefix: UNACCEPT_PREFIX,
status: false,
},
{
title: 'В жалобы на сотрудников организации',
content:
'[SIZE=4][FONT=Verdana][COLOR=red][CENTER][B]{{ greeting }}, уважаемый[/color]{{ user.mention }}!<br>'+
"[url=https://postimages.org/][img]https://i.postimg.cc/0QWKPkN2/image.png[/img][/url]<br>"+
"[CENTER]Обратитесь в жалобы на сотрудников. Выберите нужную организацию, в которой заметили нарушение со стороны сотрудника:<br>[URL='https://vk.cc/cl0peI']Правительство (кликабельно)[/URL]<br>[URL='https://vk.cc/cl0q7P']ФСБ (кликабельно)[/URL]<br>[URL='https://vk.cc/cl0qkc']ГИБДД (кликабельно)[/URL]<br>[URL='https://vk.cc/cl0qmk']УМВД (кликабельно)[/URL]<br>[URL='https://vk.cc/cl0qAs']Армия (кликабельно)[/URL]<br>[URL='https://vk.cc/cl0qDY']Больница (кликабельно)[/URL]<br>[URL='https://vk.cc/cl0qIJ']СМИ (кликабельно)[/URL]<br>[URL='https://vk.cc/cl0qOr']ФСИН(кликабельно)[/URL]<br>"+
"[url=https://postimages.org/][img]https://i.postimg.cc/0QWKPkN2/image.png[/img][/url]<br>"+
"[url=http://x-lines.ru/][img]http://x-lines.ru/letters/i/cyrillicgothic/1066/CC0000/20/1/rdej7wfn4nppbrgo19ejbwr74nxy.png[/img][/url]",
prefix: UNACCEPT_PREFIX,
status: false,
},
{
title: 'В жб на адм',
content:
'[SIZE=4][FONT=Verdana][COLOR=red][CENTER][B]{{ greeting }}, уважаемый[/color]{{ user.mention }}!<br>'+
"[url=https://postimages.org/][img]https://i.postimg.cc/0QWKPkN2/image.png[/img][/url]<br>"+
"[CENTER] Обратитесь в раздел «Жалобы на администрацию». <br>"+
"[url=https://postimages.org/][img]https://i.postimg.cc/0QWKPkN2/image.png[/img][/url]<br>"+
"[url=http://x-lines.ru/][img]http://x-lines.ru/letters/i/cyrillicgothic/1066/CC0000/20/1/rdej7wfn4nppbrgo19ejbwr74nxy.png[/img][/url]",
prefix: UNACCEPT_PREFIX,
status: false,
},
{
title: 'В жалобы на лидеров',
content:
'[SIZE=4][FONT=Verdana][COLOR=red][CENTER][B]{{ greeting }}, уважаемый[/color]{{ user.mention }}!<br>'+
"[url=https://postimages.org/][img]https://i.postimg.cc/0QWKPkN2/image.png[/img][/url]<br>"+
"[CENTER] Обратитесь в раздел «Жалобы на лидеров».<br>"+
"[url=https://postimages.org/][img]https://i.postimg.cc/0QWKPkN2/image.png[/img][/url]<br>"+
"[url=http://x-lines.ru/][img]http://x-lines.ru/letters/i/cyrillicgothic/1066/CC0000/20/1/rdej7wfn4nppbrgo19ejbwr74nxy.png[/img][/url]",
prefix: UNACCEPT_PREFIX,
status: false,
},
{
title: 'Нет нарушений со стороны игрока',
content:
'[SIZE=4][FONT=Verdana][COLOR=red][CENTER][B]{{ greeting }}, уважаемый[/color]{{ user.mention }}!<br>'+
"[url=https://postimages.org/][img]https://i.postimg.cc/0QWKPkN2/image.png[/img][/url]<br>"+
"[CENTER]Проверив Ваши доказательства, нарушений со стороны игрока не было найдено.<br>"+
"[url=https://postimages.org/][img]https://i.postimg.cc/0QWKPkN2/image.png[/img][/url]<br>"+
"[url=http://x-lines.ru/][img]http://x-lines.ru/letters/i/cyrillicgothic/1066/CC0000/20/1/rdej7wfn4nppbrgo19ejbwr74nxy.png[/img][/url]",
prefix: UNACCEPT_PREFIX,
status: false,
},
{
title: 'Нужен фрапс',
content:
'[SIZE=4][FONT=Verdana][COLOR=red][CENTER][B]{{ greeting }}, уважаемый[/color]{{ user.mention }}!<br>'+
"[url=https://postimages.org/][img]https://i.postimg.cc/0QWKPkN2/image.png[/img][/url]<br>"+
"[CENTER] В данном случае нужен фрапс.<br>"+
"[url=https://postimages.org/][img]https://i.postimg.cc/0QWKPkN2/image.png[/img][/url]<br>"+
"[url=http://x-lines.ru/][img]http://x-lines.ru/letters/i/cyrillicgothic/1066/CC0000/20/1/rdej7wfn4nppbrgo19ejbwr74nxy.png[/img][/url]",
prefix: UNACCEPT_PREFIX,
status: false,
},
{
title: 'Нужен фрапс+промотка чата',
content:
'[SIZE=4][FONT=Verdana][COLOR=red][CENTER][B]{{ greeting }}, уважаемый[/color]{{ user.mention }}!<br>'+
"[url=https://postimages.org/][img]https://i.postimg.cc/0QWKPkN2/image.png[/img][/url]<br>"+
"[CENTER] Нужен фрапс и промотка чата.<br>"+
"[url=https://postimages.org/][img]https://i.postimg.cc/0QWKPkN2/image.png[/img][/url]<br>"+
"[url=http://x-lines.ru/][img]http://x-lines.ru/letters/i/cyrillicgothic/1066/CC0000/20/1/rdej7wfn4nppbrgo19ejbwr74nxy.png[/img][/url]",
prefix: UNACCEPT_PREFIX,
status: false,
},
{
title: 'Нету в логах',
content:
'[SIZE=4][FONT=Verdana][COLOR=red][CENTER][B]{{ greeting }}, уважаемый[/color]{{ user.mention }}!<br>'+
"[url=https://postimages.org/][img]https://i.postimg.cc/0QWKPkN2/image.png[/img][/url]<br>"+
"[CENTER]Скриншот/видео не соответствует действительности.<br>"+
"[url=https://postimages.org/][img]https://i.postimg.cc/0QWKPkN2/image.png[/img][/url]<br>"+
"[url=http://x-lines.ru/][img]http://x-lines.ru/letters/i/cyrillicgothic/1066/CC0000/20/1/rdej7wfn4nppbrgo19ejbwr74nxy.png[/img][/url]",
prefix: UNACCEPT_PREFIX,
status: false,
},
{
title: 'Недостаточно доказательств',
content:
'[SIZE=4][FONT=Verdana][COLOR=red][CENTER][B]{{ greeting }}, уважаемый[/color]{{ user.mention }}!<br>'+
"[url=https://postimages.org/][img]https://i.postimg.cc/0QWKPkN2/image.png[/img][/url]<br>"+
"[CENTER]Доказательств на нарушение от данного игрока недостаточно. Доказательства должны быть предоставлены в хорошем качестве и с полным процессом сделки или нарушения от какого-либо игрока.<br>"+
"[url=https://postimages.org/][img]https://i.postimg.cc/0QWKPkN2/image.png[/img][/url]<br>"+
"[url=http://x-lines.ru/][img]http://x-lines.ru/letters/i/cyrillicgothic/1066/CC0000/20/1/rdej7wfn4nppbrgo19ejbwr74nxy.png[/img][/url]",
prefix: UNACCEPT_PREFIX,
status: false,
},
{
title: 'таймкоды',
content:
'[SIZE=4][FONT=Verdana][COLOR=red][CENTER][B]{{ greeting }}, уважаемый[/color]{{ user.mention }}!<br>'+
"[url=https://postimages.org/][img]https://i.postimg.cc/0QWKPkN2/image.png[/img][/url]<br>"+
"[CENTER]Ваша жалоба отказана, т.к в ней нету таймкодов. Если видео длится больше 3-ех минут - Вы должны указать таймкоды нарушений.<br>"+
"[url=https://postimages.org/][img]https://i.postimg.cc/0QWKPkN2/image.png[/img][/url]<br>"+
"[url=http://x-lines.ru/][img]http://x-lines.ru/letters/i/cyrillicgothic/1066/CC0000/20/1/rdej7wfn4nppbrgo19ejbwr74nxy.png[/img][/url]",
prefix: UNACCEPT_PREFIX,
status: false,
},
{
title: 'Сборка на доказательствах',
content:
'[SIZE=4][FONT=Verdana][COLOR=red][CENTER][B]{{ greeting }}, уважаемый[/color]{{ user.mention }}!<br>'+
"[url=https://postimages.org/][img]https://i.postimg.cc/0QWKPkN2/image.png[/img][/url]<br>"+
"[CENTER]Вы используете не оригинальные файлы игры (сборку), поэтому ваша жалоба не подлежит рассмотрению.<br>"+
"[url=https://postimages.org/][img]https://i.postimg.cc/0QWKPkN2/image.png[/img][/url]<br>"+
"[url=http://x-lines.ru/][img]http://x-lines.ru/letters/i/cyrillicgothic/1066/CC0000/20/1/rdej7wfn4nppbrgo19ejbwr74nxy.png[/img][/url]",
prefix: UNACCEPT_PREFIX,
status: false,
},
{
title: 'Нету доказательств',
content:
'[SIZE=4][FONT=Verdana][COLOR=red][CENTER][B]{{ greeting }}, уважаемый[/color]{{ user.mention }}!<br>'+
"[url=https://postimages.org/][img]https://i.postimg.cc/0QWKPkN2/image.png[/img][/url]<br>"+
"[CENTER]Отсутствуют доказательства - следовательно, рассмотрению не подлежит. Загрузите доказательства на фото-видео хостинги YouTube, Imgur, Yapx и так далее.<br>"+
"[url=https://postimages.org/][img]https://i.postimg.cc/0QWKPkN2/image.png[/img][/url]<br>"+
"[url=http://x-lines.ru/][img]http://x-lines.ru/letters/i/cyrillicgothic/1066/CC0000/20/1/rdej7wfn4nppbrgo19ejbwr74nxy.png[/img][/url]",
prefix: UNACCEPT_PREFIX,
status: false,
},
{
title: 'Доказательства не работают',
content:
'[SIZE=4][FONT=Verdana][COLOR=red][CENTER][B]{{ greeting }}, уважаемый[/color]{{ user.mention }}!<br>'+
"[url=https://postimages.org/][img]https://i.postimg.cc/0QWKPkN2/image.png[/img][/url]<br>"+
"[CENTER]Ваши доказательства не работают.<br>"+
"[url=https://postimages.org/][img]https://i.postimg.cc/0QWKPkN2/image.png[/img][/url]<br>"+
"[url=http://x-lines.ru/][img]http://x-lines.ru/letters/i/cyrillicgothic/1066/CC0000/20/1/rdej7wfn4nppbrgo19ejbwr74nxy.png[/img][/url]",
prefix: UNACCEPT_PREFIX,
status: false,
},
{
title: 'На другой хостинг',
content:
'[SIZE=4][FONT=Verdana][COLOR=red][CENTER][B]{{ greeting }}, уважаемый[/color]{{ user.mention }}!<br>'+
"[url=https://postimages.org/][img]https://i.postimg.cc/0QWKPkN2/image.png[/img][/url]<br>"+
"[CENTER]Загрузите доказательства на нарушение игрока, на другой хостинг.<br>"+
"[url=https://postimages.org/][img]https://i.postimg.cc/0QWKPkN2/image.png[/img][/url]<br>"+
"[url=http://x-lines.ru/][img]http://x-lines.ru/letters/i/cyrillicgothic/1066/CC0000/20/1/rdej7wfn4nppbrgo19ejbwr74nxy.png[/img][/url]",
prefix: UNACCEPT_PREFIX,
status: false,
},
{
title: 'Дубликат темы',
content:
'[SIZE=4][FONT=Verdana][COLOR=red][CENTER][B]{{ greeting }}, уважаемый[/color]{{ user.mention }}!<br>'+
"[url=https://postimages.org/][img]https://i.postimg.cc/0QWKPkN2/image.png[/img][/url]<br>"+
"[CENTER]Дублирование темы. Если вы дальше будете заниматься данной деятельностью (дублированием тем), то ваш форумный аккаунт будет заблокирован на 3 дня и более.<br>"+
"[url=https://postimages.org/][img]https://i.postimg.cc/0QWKPkN2/image.png[/img][/url]<br>"+
"[url=http://x-lines.ru/][img]http://x-lines.ru/letters/i/cyrillicgothic/1066/CC0000/20/1/rdej7wfn4nppbrgo19ejbwr74nxy.png[/img][/url]",
prefix: UNACCEPT_PREFIX,
status: false,
},
{
title: 'Больше 1 чела',
content:
'[SIZE=4][FONT=Verdana][COLOR=red][CENTER][B]{{ greeting }}, уважаемый[/color]{{ user.mention }}!<br>'+
"[url=https://postimages.org/][img]https://i.postimg.cc/0QWKPkN2/image.png[/img][/url]<br>"+
"[CENTER]Ваша жалоба отказана по причине: нельзя писать одну жалобу на двух и более игроков (на каждого игрока отдельная жалоба).<br>"+
"[url=https://postimages.org/][img]https://i.postimg.cc/0QWKPkN2/image.png[/img][/url]<br>"+
"[url=http://x-lines.ru/][img]http://x-lines.ru/letters/i/cyrillicgothic/1066/CC0000/20/1/rdej7wfn4nppbrgo19ejbwr74nxy.png[/img][/url]",
prefix: UNACCEPT_PREFIX,
status: false,
},
{
title: 'Доки из соц сети',
content:
'[SIZE=4][FONT=Verdana][COLOR=red][CENTER][B]{{ greeting }}, уважаемый[/color]{{ user.mention }}!<br>'+
"[url=https://postimages.org/][img]https://i.postimg.cc/0QWKPkN2/image.png[/img][/url]<br>"+
"[CENTER]Доказательства в социальных сетях и т.д. не принимаются. Загрузите доказательства на фото-видео хостинги:<br>[URL='https://imgur.com/']IMGUR[/URL]<br>[URL='https://yapx.ru/']Yapix[/URL]<br>[URL='https://postimages.org/']postimages[/URL]<br>[URL='https://ru.imgbb.com/']IBB[/URL]<br>[URL='https://clck.ru/8pxGW']YouTube[/URL] и.т.д<br><br>Все ссылки [COLOR=rgb(255,0,0)]кликабельны[/color].[/CENTER]<br>"+
"[url=https://postimages.org/][img]https://i.postimg.cc/0QWKPkN2/image.png[/img][/url]<br>"+
"[url=http://x-lines.ru/][img]http://x-lines.ru/letters/i/cyrillicgothic/1066/CC0000/20/1/rdej7wfn4nppbrgo19ejbwr74nxy.png[/img][/url]",
prefix: UNACCEPT_PREFIX,
status: false,
},
{
title: 'Не по теме',
content:
'[SIZE=4][FONT=Verdana][COLOR=red][CENTER][B]{{ greeting }}, уважаемый[/color]{{ user.mention }}!<br>'+
"[url=https://postimages.org/][img]https://i.postimg.cc/0QWKPkN2/image.png[/img][/url]<br>"+
"[CENTER]Убедительная просьба, ознакомиться с назначение данного раздела, в котором Вы создали тема. Ваша жалоба никоим образом не относится к данному разделу.[/CENTER]<br>"+
"[url=https://postimages.org/][img]https://i.postimg.cc/0QWKPkN2/image.png[/img][/url]<br>"+
"[url=http://x-lines.ru/][img]http://x-lines.ru/letters/i/cyrillicgothic/1066/CC0000/20/1/rdej7wfn4nppbrgo19ejbwr74nxy.png[/img][/url]",
prefix: UNACCEPT_PREFIX,
status: false,
},
{
title: 'Не полный фрапс/обрывается',
content:
'[SIZE=4][FONT=Verdana][COLOR=red][CENTER][B]{{ greeting }}, уважаемый[/color]{{ user.mention }}!<br>'+
"[url=https://postimages.org/][img]https://i.postimg.cc/0QWKPkN2/image.png[/img][/url]<br>"+
"[CENTER] Не полный фрапс, или обрывается. Загрузите его на YouTube.<br>"+
"[url=https://postimages.org/][img]https://i.postimg.cc/0QWKPkN2/image.png[/img][/url]<br>"+
"[url=http://x-lines.ru/][img]http://x-lines.ru/letters/i/cyrillicgothic/1066/CC0000/20/1/rdej7wfn4nppbrgo19ejbwr74nxy.png[/img][/url]",
prefix: UNACCEPT_PREFIX,
status: false,
},
{
title: 'нету логотипа',
content:
'[SIZE=4][FONT=Verdana][COLOR=red][CENTER][B]{{ greeting }}, уважаемый[/color]{{ user.mention }}!<br>'+
"[url=https://postimages.org/][img]https://i.postimg.cc/0QWKPkN2/image.png[/img][/url]<br>"+
"[CENTER]Нет логитипа сервера — следовательно, рассмотрению жалоба не подлежит, так как нельзя понять, где происходят действия.<br>"+
"[url=https://postimages.org/][img]https://i.postimg.cc/0QWKPkN2/image.png[/img][/url]<br>"+
"[url=http://x-lines.ru/][img]http://x-lines.ru/letters/i/cyrillicgothic/1066/CC0000/20/1/rdej7wfn4nppbrgo19ejbwr74nxy.png[/img][/url]",
prefix: UNACCEPT_PREFIX,
status: false,
},
{
title: 'жб 3-е лицо',
content:
'[SIZE=4][FONT=Verdana][COLOR=red][CENTER][B]{{ greeting }}, уважаемый[/color]{{ user.mention }}!<br>'+
"[url=https://postimages.org/][img]https://i.postimg.cc/0QWKPkN2/image.png[/img][/url]<br>"+
"[CENTER]Жалоба составлена от 3-го лица, что не подлежит рассмотрению.[/CENTER]<br>"+
"[url=https://postimages.org/][img]https://i.postimg.cc/0QWKPkN2/image.png[/img][/url]<br>"+
"[url=http://x-lines.ru/][img]http://x-lines.ru/letters/i/cyrillicgothic/1066/CC0000/20/1/rdej7wfn4nppbrgo19ejbwr74nxy.png[/img][/url]",
prefix: UNACCEPT_PREFIX,
status: false,
},
{
title: 'Неадекватное содержание',
content:
'[SIZE=4][FONT=Verdana][COLOR=red][CENTER][B]{{ greeting }}, уважаемый[/color]{{ user.mention }}!<br>'+
"[url=https://postimages.org/][img]https://i.postimg.cc/0QWKPkN2/image.png[/img][/url]<br>"+
"[CENTER]Жалобы с подобным содержанием не подлежат рассмотрению.[/CENTER]<br>"+
"[url=https://postimages.org/][img]https://i.postimg.cc/0QWKPkN2/image.png[/img][/url]<br>"+
"[url=http://x-lines.ru/][img]http://x-lines.ru/letters/i/cyrillicgothic/1066/CC0000/20/1/rdej7wfn4nppbrgo19ejbwr74nxy.png[/img][/url]",
prefix: UNACCEPT_PREFIX,
status: false,
},
{
title: 'Время подачи вышло',
content:
'[SIZE=4][FONT=Verdana][COLOR=red][CENTER][B]{{ greeting }}, уважаемый[/color]{{ user.mention }}!<br>'+
"[url=https://postimages.org/][img]https://i.postimg.cc/0QWKPkN2/image.png[/img][/url]<br>"+
"[CENTER]Время подачи жалобы вышло. [/CENTER]<br>"+
"[url=https://postimages.org/][img]https://i.postimg.cc/0QWKPkN2/image.png[/img][/url]<br>"+
"[url=http://x-lines.ru/][img]http://x-lines.ru/letters/i/cyrillicgothic/1066/CC0000/20/1/rdej7wfn4nppbrgo19ejbwr74nxy.png[/img][/url]",
prefix: UNACCEPT_PREFIX,
status: false,
},
{
    title: 'Нет доступа к доказ (Гугл)',
content:
'[SIZE=4][FONT=Verdana][COLOR=red][CENTER][B]{{ greeting }}, уважаемый[/color]{{ user.mention }}!<br>'+
"[url=https://postimages.org/][img]https://i.postimg.cc/0QWKPkN2/image.png[/img][/url]<br>"+
"[CENTER]Доступ к доказательствам закрыт - <br> [url=https://postimages.org/][img]https://i.postimg.cc/BvxnD9yw/image.png[/img][/url][/CENTER]<br>"+
"[CENTER]Создайте новую жалобу и загрузите доказательства на фото/видео хостинги (YouTube, Япикс, imgur).[/CENTER]<br>"+
"[url=https://postimages.org/][img]https://i.postimg.cc/0QWKPkN2/image.png[/img][/url]<br>"+
"[url=http://x-lines.ru/][img]http://x-lines.ru/letters/i/cyrillicgothic/1066/CC0000/20/1/rdej7wfn4nppbrgo19ejbwr74nxy.png[/img][/url]",
prefix: UNACCEPT_PREFIX,
status: false,
},
{
title: 'Нет доступа к доказ (Ютуб)',
content:
'[SIZE=4][FONT=Verdana][COLOR=red][CENTER][B]{{ greeting }}, уважаемый[/color]{{ user.mention }}!<br>'+
"[url=https://postimages.org/][img]https://i.postimg.cc/0QWKPkN2/image.png[/img][/url]<br>"+
"[CENTER]Доступ к доказательствам закрыт - <br> [url=https://postimages.org/][img]https://i.postimg.cc/131G5gqy/image.png[/img][/url][/CENTER]<br>"+
"[CENTER]Создайте новую жалобу и загрузите доказательства на фото/видео хостинги (YouTube, Япикс, imgur).[/CENTER]<br>"+
"[url=https://postimages.org/][img]https://i.postimg.cc/0QWKPkN2/image.png[/img][/url]<br>"+
"[url=http://x-lines.ru/][img]http://x-lines.ru/letters/i/cyrillicgothic/1066/CC0000/20/1/rdej7wfn4nppbrgo19ejbwr74nxy.png[/img][/url]",
prefix: UNACCEPT_PREFIX,
status: false,
},
{
title: 'Доказательства обрываются',
content:
'[SIZE=4][FONT=Verdana][COLOR=red][CENTER][B]{{ greeting }}, уважаемый[/color]{{ user.mention }}!<br>'+
"[url=https://postimages.org/][img]https://i.postimg.cc/0QWKPkN2/image.png[/img][/url]<br>"+
"[CENTER]Загрузите доказательства на ютуб[/CENTER]<br>"+
"[url=https://postimages.org/][img]https://i.postimg.cc/0QWKPkN2/image.png[/img][/url]<br>"+
"[url=http://x-lines.ru/][img]http://x-lines.ru/letters/i/cyrillicgothic/1066/CC0000/20/1/rdej7wfn4nppbrgo19ejbwr74nxy.png[/img][/url]",
prefix: UNACCEPT_PREFIX,
status: false,
},
{
title: 'Ошиблись сервером',
content:
'[SIZE=4][FONT=Verdana][COLOR=red][CENTER][B]{{ greeting }}, уважаемый[/color]{{ user.mention }}!<br>'+
"[url=https://postimages.org/][img]https://i.postimg.cc/0QWKPkN2/image.png[/img][/url]<br>"+
"[CENTER]Вы ошиблись сервером. Перемещаю Вашу тему в нужный раздел<br><br>Ожидайте ответ от администрации Вашего сервера."+
"[url=https://postimages.org/][img]https://i.postimg.cc/0QWKPkN2/image.png[/img][/url]<br>",
},
{
title: 'На полный экран',
content:
'[SIZE=4][FONT=Verdana][COLOR=red][CENTER][B]{{ greeting }}, уважаемый[/color]{{ user.mention }}!<br>'+
"[url=https://postimages.org/][img]https://i.postimg.cc/0QWKPkN2/image.png[/img][/url]<br>"+
"[CENTER] Доказательства должны быть на полный экран.<br>"+
"[url=https://postimages.org/][img]https://i.postimg.cc/0QWKPkN2/image.png[/img][/url]<br>"+
"[url=http://x-lines.ru/][img]http://x-lines.ru/letters/i/cyrillicgothic/1066/CC0000/20/1/rdej7wfn4nppbrgo19ejbwr74nxy.png[/img][/url]",
prefix: UNACCEPT_PREFIX,
status: false,
},
{
title: '♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥ ОДОБРЕННЫЕ ♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥'
},
{
title: '♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥ Правила Role Play процесса ♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥'
},
{
title: 'NonRP Поведение',
content:
'[SIZE=4][FONT=Verdana][COLOR=#32CD32][CENTER][B]{{ greeting }}, уважаемый[/color]{{ user.mention }}!<br>'+
"[url=https://postimages.org/][img]https://i.postimg.cc/0QWKPkN2/image.png[/img][/url]<br>"+
"[CENTER]Нарушитель будет наказан по пункту регламента:<br>"+
"[Color=Red]2.01.[/Color] Запрещено поведение, нарушающее нормы процессов Role Play режима игры [Color=Red]| Jail 30 минут[/Color]<br>"+
"[url=https://postimages.org/][img]https://i.postimg.cc/0QWKPkN2/image.png[/img][/url]<br>"+
"[url=http://x-lines.ru/][img]http://x-lines.ru/letters/i/cyrillicgothic/1066/2BA94F/20/1/4nxpbfgou5ejdwfy4nk7b8qoua.png[/img][/url]",
prefix: ACCEPT_PREFIX,
status: false,
},
{
title: 'Уход от RP процесса',
content:
'[SIZE=4][FONT=Verdana][COLOR=#32CD32][CENTER][B]{{ greeting }}, уважаемый[/color]{{ user.mention }}!<br>'+
"[url=https://postimages.org/][img]https://i.postimg.cc/0QWKPkN2/image.png[/img][/url]<br>"+
"[CENTER]Нарушитель будет наказан по пункту регламента: <br>"+
"[Color=Red]2.02.[/Color] Запрещено целенаправленно уходить от Role Play процесса всеразличными способами [Color=Red]| Jail 30 минут / Warn[/Color]<br><br>"+
"[url=https://postimages.org/][img]https://i.postimg.cc/0QWKPkN2/image.png[/img][/url]<br>"+
"[url=http://x-lines.ru/][img]http://x-lines.ru/letters/i/cyrillicgothic/1066/2BA94F/20/1/4nxpbfgou5ejdwfy4nk7b8qoua.png[/img][/url]",
prefix: ACCEPT_PREFIX,
status: false,
},
{
title: 'Помеха РП процессу',
content:
'[SIZE=4][FONT=Verdana][COLOR=#32CD32][CENTER][B]{{ greeting }}, уважаемый[/color]{{ user.mention }}!<br>'+
"[url=https://postimages.org/][img]https://i.postimg.cc/0QWKPkN2/image.png[/img][/url]<br>"+
"[CENTER]Нарушитель будет наказан по пункту регламента: <br>"+
"[url=https://postimages.org/][img]https://i.postimg.cc/sXWGdyB9/image.png[/img][/url]"+
"[Color=Red]2.04.[/Color] Запрещены любые действия способные привести к помехам в игровом процессе, а также выполнению работ, если они этого не предусматривают и если эти действия выходят за рамки игрового процесса данной работы. [Color=Red]| Ban 10 дней / Обнуление аккаунта (при повторном нарушении)[/Color]<br>"+
"[url=https://postimages.org/][img]https://i.postimg.cc/0QWKPkN2/image.png[/img][/url]<br>"+
"[url=http://x-lines.ru/][img]http://x-lines.ru/letters/i/cyrillicgothic/1066/2BA94F/20/1/4nxpbfgou5ejdwfy4nk7b8qoua.png[/img][/url]",
prefix: ACCEPT_PREFIX,
status: false,
},
{
title: 'NonRP Drive',
content:
'[SIZE=4][FONT=Verdana][COLOR=#32CD32][CENTER][B]{{ greeting }}, уважаемый[/color]{{ user.mention }}!<br>'+
"[url=https://postimages.org/][img]https://i.postimg.cc/0QWKPkN2/image.png[/img][/url]<br>"+
"[url=https://postimages.org/][img]https://i.postimg.cc/sXWGdyB9/image.png[/img][/url]"+
"[Color=Red]2.03.[/Color] Запрещен NonRP Drive — вождение любого транспортного средства в невозможных для него условиях, а также вождение в неправдоподобной манере [Color=Red]| Jail 30 минут[/Color]<br>"+
"[url=https://postimages.org/][img]https://i.postimg.cc/0QWKPkN2/image.png[/img][/url]<br>"+
"[url=http://x-lines.ru/][img]http://x-lines.ru/letters/i/cyrillicgothic/1066/2BA94F/20/1/4nxpbfgou5ejdwfy4nk7b8qoua.png[/img][/url]",
prefix: ACCEPT_PREFIX,
status: false,
},
 
{
title: 'NonRP обман',
content:
'[SIZE=4][FONT=Verdana][COLOR=#32CD32][CENTER][B]{{ greeting }}, уважаемый[/color]{{ user.mention }}!<br>'+
"[url=https://postimages.org/][img]https://i.postimg.cc/0QWKPkN2/image.png[/img][/url]<br>"+
"[CENTER]Нарушитель будет наказан по пункту регламента: <br>"+
"[Color=Red]2.05.[/Color] Запрещены любые OOC обманы и их попытки, а также любые IC обманы с нарушением Role Play правил и логики [Color=Red]| PermBan[/Color]<br>"+
"[url=https://postimages.org/][img]https://i.postimg.cc/0QWKPkN2/image.png[/img][/url]<br>"+
"[url=http://x-lines.ru/][img]http://x-lines.ru/letters/i/cyrillicgothic/1066/2BA94F/20/1/4nxpbfgou5ejdwfy4nk7b8qoua.png[/img][/url]",
prefix: ACCEPT_PREFIX,
status: false,
},
{
title: 'RP отыгровки в свою пользу',
content:
'[SIZE=4][FONT=Verdana][COLOR=#32CD32][CENTER][B]{{ greeting }}, уважаемый[/color]{{ user.mention }}!<br>'+
"[url=https://postimages.org/][img]https://i.postimg.cc/0QWKPkN2/image.png[/img][/url]<br>"+
"[CENTER]Нарушитель будет наказан по пункту регламента: <br>"+
"[Color=Red]2.06.[/Color] Запрещены любые Role Play отыгровки в свою сторону или пользу [Color=Red]| Jail 30 минут[/Color]<br>"+
"[url=https://postimages.org/][img]https://i.postimg.cc/0QWKPkN2/image.png[/img][/url]<br>"+
"[url=http://x-lines.ru/][img]http://x-lines.ru/letters/i/cyrillicgothic/1066/2BA94F/20/1/4nxpbfgou5ejdwfy4nk7b8qoua.png[/img][/url]",
prefix: ACCEPT_PREFIX,
status: false,
},
{
title: 'AFK no ESC',
content:
'[SIZE=4][FONT=Verdana][COLOR=#32CD32][CENTER][B]{{ greeting }}, уважаемый[/color]{{ user.mention }}!<br>'+
"[url=https://postimages.org/][img]https://i.postimg.cc/0QWKPkN2/image.png[/img][/url]<br>"+
"[CENTER]Нарушитель будет наказан по пункту регламента: <br>"+
"[Color=Red]2.07.[/Color] Запрещено нахождение в AFK без включенного ESC, создавая помеху другим игрокам [Color=Red]| Kick[/Color]<br>"+
"[url=https://postimages.org/][img]https://i.postimg.cc/0QWKPkN2/image.png[/img][/url]<br>"+
"[url=http://x-lines.ru/][img]http://x-lines.ru/letters/i/cyrillicgothic/1066/2BA94F/20/1/4nxpbfgou5ejdwfy4nk7b8qoua.png[/img][/url]",
prefix: ACCEPT_PREFIX,
status: false,
},
{
title: 'Аморальные поведения',
content:
'[SIZE=4][FONT=Verdana][COLOR=#32CD32][CENTER][B]{{ greeting }}, уважаемый[/color]{{ user.mention }}!<br>'+
"[url=https://postimages.org/][img]https://i.postimg.cc/0QWKPkN2/image.png[/img][/url]<br>"+
"[CENTER]Нарушитель будет наказан по пункту регламента: <br>"+
"[Color=Red]2.08.[/Color] Запрещена любая форма аморальных действий сексуального характера в сторону игроков [Color=Red]| Jail 30 минут / Warn[/Color]<br>"+
"[url=https://postimages.org/][img]https://i.postimg.cc/0QWKPkN2/image.png[/img][/url]<br>"+
"[url=http://x-lines.ru/][img]http://x-lines.ru/letters/i/cyrillicgothic/1066/2BA94F/20/1/4nxpbfgou5ejdwfy4nk7b8qoua.png[/img][/url]",
prefix: ACCEPT_PREFIX,
status: false,
},
{
title: 'Слив склада',
content:
'[SIZE=4][FONT=Verdana][COLOR=#32CD32][CENTER][B]{{ greeting }}, уважаемый[/color]{{ user.mention }}!<br>'+
"[url=https://postimages.org/][img]https://i.postimg.cc/0QWKPkN2/image.png[/img][/url]<br>"+
"[CENTER]Нарушитель будет наказан по пункту регламента: <br>"+
"[Color=Red]2.09.[/Color] Запрещено сливать склад фракции / семьи путем взятия большого количестве ресурсов, или же брать больше, чем разрешили на самом деле [Color=Red]| Ban 15 - 30 дней / PermBan[/Color]<br>"+
"[url=https://postimages.org/][img]https://i.postimg.cc/0QWKPkN2/image.png[/img][/url]<br>"+
"[url=http://x-lines.ru/][img]http://x-lines.ru/letters/i/cyrillicgothic/1066/2BA94F/20/1/4nxpbfgou5ejdwfy4nk7b8qoua.png[/img][/url]",
prefix: ACCEPT_PREFIX,
status: false,
},
{
title: 'Обман в /do',
content:
'[SIZE=4][FONT=Verdana][COLOR=#32CD32][CENTER][B]{{ greeting }}, уважаемый[/color]{{ user.mention }}!<br>'+
"[url=https://postimages.org/][img]https://i.postimg.cc/0QWKPkN2/image.png[/img][/url]<br>"+"[CENTER]Нарушитель будет наказан по пункту регламента: <br>"+
"[Color=Red]2.10.[/Color] Запрещено в любой форме обманывать в /do, даже если это в дальнейшем негативно скажется на Вашем игровом персонаже [Color=Red]| Jail 30 минут / Warn[/Color]<br>"+
"[url=https://postimages.org/][img]https://i.postimg.cc/0QWKPkN2/image.png[/img][/url]<br>"+
"[url=http://x-lines.ru/][img]http://x-lines.ru/letters/i/cyrillicgothic/1066/2BA94F/20/1/4nxpbfgou5ejdwfy4nk7b8qoua.png[/img][/url]",
prefix: ACCEPT_PREFIX,
status: false,
},
{
title: 'Фракц тс в л/ц',
content:
'[SIZE=4][FONT=Verdana][COLOR=#32CD32][CENTER][B]{{ greeting }}, уважаемый[/color]{{ user.mention }}!<br>'+
"[url=https://postimages.org/][img]https://i.postimg.cc/0QWKPkN2/image.png[/img][/url]<br>"+
"[CENTER]Нарушитель будет наказан по пункту регламента: <br>"+
"[url=https://postimages.org/][img]https://i.postimg.cc/sXWGdyB9/image.png[/img][/url]"+
"[Color=Red]2.11.[/Color] Запрещено использование рабочего или фракционного транспорта в личных целях [Color=Red]| Jail 30 минут[/Color]<br>"+
"[url=https://postimages.org/][img]https://i.postimg.cc/0QWKPkN2/image.png[/img][/url]<br>"+
"[url=http://x-lines.ru/][img]http://x-lines.ru/letters/i/cyrillicgothic/1066/2BA94F/20/1/4nxpbfgou5ejdwfy4nk7b8qoua.png[/img][/url]",
prefix: ACCEPT_PREFIX,
status: false,
},
{
title: 'Затягивание RP процесса',
content:
'[SIZE=4][FONT=Verdana][COLOR=#32CD32][CENTER][B]{{ greeting }}, уважаемый[/color]{{ user.mention }}!<br>'+
"[url=https://postimages.org/][img]https://i.postimg.cc/0QWKPkN2/image.png[/img][/url]<br>"+
"[CENTER]Нарушитель будет наказан по пункту регламента: <br>"+
"[Color=Red]2.12.[/Color] Запрещено целенаправленное затягивание Role Play процесса [Color=Red]| Jail 30 минут[/Color]<br>"+
"[url=https://postimages.org/][img]https://i.postimg.cc/0QWKPkN2/image.png[/img][/url]<br>"+
"[url=http://x-lines.ru/][img]http://x-lines.ru/letters/i/cyrillicgothic/1066/2BA94F/20/1/4nxpbfgou5ejdwfy4nk7b8qoua.png[/img][/url]",
prefix: ACCEPT_PREFIX,
status: false,
},
{
title: 'DB',
content:
'[SIZE=4][FONT=Verdana][COLOR=#32CD32][CENTER][B]{{ greeting }}, уважаемый[/color]{{ user.mention }}!<br>'+
"[url=https://postimages.org/][img]https://i.postimg.cc/0QWKPkN2/image.png[/img][/url]<br>"+
"[CENTER]Нарушитель будет наказан по пункту регламента: <br>"+
"[Color=Red]2.13.[/Color] Запрещен DB (DriveBy) — намеренное убийство / нанесение урона без веской IC причины на любом виде транспорта [Color=Red]| Jail 60 минут[/Color]<br>"+
"[url=https://postimages.org/][img]https://i.postimg.cc/0QWKPkN2/image.png[/img][/url]<br>"+
"[url=http://x-lines.ru/][img]http://x-lines.ru/letters/i/cyrillicgothic/1066/2BA94F/20/1/4nxpbfgou5ejdwfy4nk7b8qoua.png[/img][/url]",
prefix: ACCEPT_PREFIX,
status: false,
},
{
title: 'RK',
content:
'[SIZE=4][FONT=Verdana][COLOR=#32CD32][CENTER][B]{{ greeting }}, уважаемый[/color]{{ user.mention }}!<br>'+
"[url=https://postimages.org/][img]https://i.postimg.cc/0QWKPkN2/image.png[/img][/url]<br>"+
"[CENTER]Нарушитель будет наказан по пункту регламента: <br>"+
"[Color=Red]2.14.[/Color] Запрещен RK (Revenge Kill) — убийство игрока с целью мести, возвращение на место смерти в течение 15-ти минут, а также использование в дальнейшем информации, которая привела Вас к смерти [Color=Red]| Jail 30 минут[/Color]<br>"+
"[url=https://postimages.org/][img]https://i.postimg.cc/0QWKPkN2/image.png[/img][/url]<br>"+
"[url=http://x-lines.ru/][img]http://x-lines.ru/letters/i/cyrillicgothic/1066/2BA94F/20/1/4nxpbfgou5ejdwfy4nk7b8qoua.png[/img][/url]",
prefix: ACCEPT_PREFIX,
status: false,
},
{
title: 'TK',
content:
'[SIZE=4][FONT=Verdana][COLOR=#32CD32][CENTER][B]{{ greeting }}, уважаемый[/color]{{ user.mention }}!<br>'+
"[url=https://postimages.org/][img]https://i.postimg.cc/0QWKPkN2/image.png[/img][/url]<br>"+
"[CENTER]Нарушитель будет наказан по пункту регламента: <br>"+
"[Color=Red]2.15.[/Color] Запрещен TK (Team Kill) — убийство члена своей или союзной фракции, организации без наличия какой-либо IC причины [Color=Red]| Jail 60 минут / Warn[/Color] [Color=Orange](за два и более убийства)[/Color]<br>"+
"[url=https://postimages.org/][img]https://i.postimg.cc/0QWKPkN2/image.png[/img][/url]<br>"+
"[url=http://x-lines.ru/][img]http://x-lines.ru/letters/i/cyrillicgothic/1066/2BA94F/20/1/4nxpbfgou5ejdwfy4nk7b8qoua.png[/img][/url]",
prefix: ACCEPT_PREFIX,
status: false,
},
{
title: 'SK',
content:
'[SIZE=4][FONT=Verdana][COLOR=#32CD32][CENTER][B]{{ greeting }}, уважаемый[/color]{{ user.mention }}!<br>'+
"[url=https://postimages.org/][img]https://i.postimg.cc/0QWKPkN2/image.png[/img][/url]<br>"+
"[CENTER]Нарушитель будет наказан по пункту регламента: <br>"+
"[Color=Red]2.16.[/Color] Запрещен SK (Spawn Kill) — убийство или нанесение урона на титульной территории любой фракции / организации, на месте появления игрока, а также на выходе из закрытых интерьеров и около них [Color=Red]| Jail 60 минут / Warn[/Color] [Color=Orange](за два и более убийства)[/Color]<br>"+
"[url=https://postimages.org/][img]https://i.postimg.cc/0QWKPkN2/image.png[/img][/url]<br>"+
"[url=http://x-lines.ru/][img]http://x-lines.ru/letters/i/cyrillicgothic/1066/2BA94F/20/1/4nxpbfgou5ejdwfy4nk7b8qoua.png[/img][/url]",
prefix: ACCEPT_PREFIX,
status: false,
},
{
title: 'PG',
content:
'[SIZE=4][FONT=Verdana][COLOR=#32CD32][CENTER][B]{{ greeting }}, уважаемый[/color]{{ user.mention }}!<br>'+
"[url=https://postimages.org/][img]https://i.postimg.cc/0QWKPkN2/image.png[/img][/url]<br>"+
"[CENTER]Нарушитель будет наказан по пункту регламента: <br>"+
"[Color=Red]2.17.[/Color]Запрещен PG (PowerGaming) — присвоение свойств персонажу, не соответствующих реальности, отсутствие страха за свою жизнь [Color=Red]| Jail 30 минут[/Color]<br>"+
"[url=https://postimages.org/][img]https://i.postimg.cc/0QWKPkN2/image.png[/img][/url]<br>"+
"[url=http://x-lines.ru/][img]http://x-lines.ru/letters/i/cyrillicgothic/1066/2BA94F/20/1/4nxpbfgou5ejdwfy4nk7b8qoua.png[/img][/url]",
prefix: ACCEPT_PREFIX,
status: false,
},
{
title: 'MG',
content:
'[SIZE=4][FONT=Verdana][COLOR=#32CD32][CENTER][B]{{ greeting }}, уважаемый[/color]{{ user.mention }}!<br>'+
"[url=https://postimages.org/][img]https://i.postimg.cc/0QWKPkN2/image.png[/img][/url]<br>"+
"[CENTER]Нарушитель будет наказан по пункту регламента: <br>"+
"[Color=Red]2.18.[/Color] Запрещен MG (MetaGaming) — использование ООС информации, которую Ваш персонаж никак не мог получить в IC процессе [Color=Red]| Mute 30 минут[/Color]<br>"+
"[url=https://postimages.org/][img]https://i.postimg.cc/0QWKPkN2/image.png[/img][/url]<br>"+
"[url=http://x-lines.ru/][img]http://x-lines.ru/letters/i/cyrillicgothic/1066/2BA94F/20/1/4nxpbfgou5ejdwfy4nk7b8qoua.png[/img][/url]",
prefix: ACCEPT_PREFIX,
status: false,
},
{
title: 'DM',
content:
'[SIZE=4][FONT=Verdana][COLOR=#32CD32][CENTER][B]{{ greeting }}, уважаемый[/color]{{ user.mention }}!<br>'+
"[url=https://postimages.org/][img]https://i.postimg.cc/0QWKPkN2/image.png[/img][/url]<br>"+
"[CENTER]Нарушитель будет наказан по пункту регламента: <br>"+
"[Color=Red]2.19.[/Color] Запрещен DM (DeathMatch) — убийство или нанесение урона без веской IC причины [Color=Red]| Jail 60 минут[/Color]<br>"+
"[url=https://postimages.org/][img]https://i.postimg.cc/0QWKPkN2/image.png[/img][/url]<br>"+
"[url=http://x-lines.ru/][img]http://x-lines.ru/letters/i/cyrillicgothic/1066/2BA94F/20/1/4nxpbfgou5ejdwfy4nk7b8qoua.png[/img][/url]",
prefix: ACCEPT_PREFIX,
status: false,
},
{
title: 'Mass DM',
content:
'[SIZE=4][FONT=Verdana][COLOR=#32CD32][CENTER][B]{{ greeting }}, уважаемый[/color]{{ user.mention }}!<br>'+
"[url=https://postimages.org/][img]https://i.postimg.cc/0QWKPkN2/image.png[/img][/url]<br>"+
"[CENTER]Нарушитель будет наказан по пункту регламента: <br>"+
"[Color=Red]2.20.[/Color] Запрещен Mass DM (Mass DeathMatch) — убийство или нанесение урона без веской IC причины трем игрокам и более [Color=Red]| Warn / Ban 3 - 7 дней[/Color]<br>"+
"[url=https://postimages.org/][img]https://i.postimg.cc/0QWKPkN2/image.png[/img][/url]<br>"+
"[url=http://x-lines.ru/][img]http://x-lines.ru/letters/i/cyrillicgothic/1066/2BA94F/20/1/4nxpbfgou5ejdwfy4nk7b8qoua.png[/img][/url]",
prefix: ACCEPT_PREFIX,
status: false,
},
{
title: 'Попытка обхода багов',
content:
'[SIZE=4][FONT=Verdana][COLOR=#32CD32][CENTER][B]{{ greeting }}, уважаемый[/color]{{ user.mention }}!<br>'+
"[url=https://postimages.org/][img]https://i.postimg.cc/0QWKPkN2/image.png[/img][/url]<br>"+
"[CENTER]Нарушитель будет наказан по пункту регламента: <br>"+
"[Color=Red]2.21.[/Color] Запрещено пытаться обходить игровую систему или использовать любые баги сервера [Color=Red]| Ban 15 - 30 дней / PermBan[/Color]<br>"+
"[url=https://postimages.org/][img]https://i.postimg.cc/0QWKPkN2/image.png[/img][/url]<br>"+
"[url=http://x-lines.ru/][img]http://x-lines.ru/letters/i/cyrillicgothic/1066/2BA94F/20/1/4nxpbfgou5ejdwfy4nk7b8qoua.png[/img][/url]",
prefix: ACCEPT_PREFIX,
status: false,
},
{
title: 'СБОРКА',
content:
'[SIZE=4][FONT=Verdana][COLOR=#32CD32][CENTER][B]{{ greeting }}, уважаемый[/color]{{ user.mention }}!<br>'+
"[url=https://postimages.org/][img]https://i.postimg.cc/0QWKPkN2/image.png[/img][/url]<br>"+
"[CENTER]Нарушитель будет наказан по пункту регламента: <br>"+
"[Color=Red]2.22.[/Color] Запрещено хранить / использовать / распространять стороннее программное обеспечение или любые другие средства, позволяющие получить преимущество над другими игроками [Color=Red]| Ban 15 - 30 дней / PermBan[/Color]<br>"+
"[url=https://postimages.org/][img]https://i.postimg.cc/0QWKPkN2/image.png[/img][/url]<br>"+
"[url=http://x-lines.ru/][img]http://x-lines.ru/letters/i/cyrillicgothic/1066/2BA94F/20/1/4nxpbfgou5ejdwfy4nk7b8qoua.png[/img][/url]",
prefix: ACCEPT_PREFIX,
status: false,
},
{
title: 'Сокрытие багов от администрации',
content:
'[SIZE=4][FONT=Verdana][COLOR=#32CD32][CENTER][B]{{ greeting }}, уважаемый[/color]{{ user.mention }}!<br>'+
"[url=https://postimages.org/][img]https://i.postimg.cc/0QWKPkN2/image.png[/img][/url]<br>"+
"[CENTER]Нарушитель будет наказан по пункту регламента: <br>"+
"[Color=Red]2.23.[/Color] Запрещено скрывать от администрации баги системы, а также распространять их игрокам [Color=Red]| Ban 15 - 30 дней / PermBan[/Color]<br>"+
"[url=https://postimages.org/][img]https://i.postimg.cc/0QWKPkN2/image.png[/img][/url]<br>"+
"[url=http://x-lines.ru/][img]http://x-lines.ru/letters/i/cyrillicgothic/1066/2BA94F/20/1/4nxpbfgou5ejdwfy4nk7b8qoua.png[/img][/url]",
prefix: ACCEPT_PREFIX,
status: false,
},
{
title: 'Репутация проекта',
content:
'[SIZE=4][FONT=Verdana][COLOR=#32CD32][CENTER][B]{{ greeting }}, уважаемый[/color]{{ user.mention }}!<br>'+
"[url=https://postimages.org/][img]https://i.postimg.cc/0QWKPkN2/image.png[/img][/url]<br>"+
"[CENTER]Нарушитель будет наказан по пункту регламента: <br>"+
"[Color=Red]2.25.[/Color] Запрещены попытки или действия, которые могут навредить репутации проекта [Color=Red]| PermBan + ЧС проекта[/Color]<br><br>"+
"[url=https://postimages.org/][img]https://i.postimg.cc/0QWKPkN2/image.png[/img][/url]<br>"+
"[url=http://x-lines.ru/][img]http://x-lines.ru/letters/i/cyrillicgothic/1066/2BA94F/20/1/4nxpbfgou5ejdwfy4nk7b8qoua.png[/img][/url]",
prefix: ACCEPT_PREFIX,
status: false,
},
{
title: 'Вред ресурсам',
content:
'[SIZE=4][FONT=Verdana][COLOR=#32CD32][CENTER][B]{{ greeting }}, уважаемый[/color]{{ user.mention }}!<br>'+
"[url=https://postimages.org/][img]https://i.postimg.cc/0QWKPkN2/image.png[/img][/url]<br>"+
"[CENTER]Нарушитель будет наказан по пункту регламента: <br>"+
"[Color=Red]2.26.[/Color] Запрещено намеренно наносить вред ресурсам проекта (игровые серверы, форум, официальные Discord-серверы и так далее) [Color=Red]| PermBan + ЧС проекта[/Color]<br>"+
"[url=https://postimages.org/][img]https://i.postimg.cc/0QWKPkN2/image.png[/img][/url]<br>"+
"[url=http://x-lines.ru/][img]http://x-lines.ru/letters/i/cyrillicgothic/1066/2BA94F/20/1/4nxpbfgou5ejdwfy4nk7b8qoua.png[/img][/url]",
prefix: ACCEPT_PREFIX,
status: false,
},
{
title: 'Распространение информации',
content:
'[SIZE=4][FONT=Verdana][COLOR=#32CD32][CENTER][B]{{ greeting }}, уважаемый[/color]{{ user.mention }}!<br>'+
"[url=https://postimages.org/][img]https://i.postimg.cc/0QWKPkN2/image.png[/img][/url]<br>"+
"[CENTER]Нарушитель будет наказан по пункту регламента: <br>"+
"[Color=Red]2.27.[/Color] Запрещено распространение информации и материалов, которые имеют непосредственное отношение к работе администрации проекта [Color=Red]| PermBan + ЧС проекта[/Color]<br>"+
"[url=https://postimages.org/][img]https://i.postimg.cc/0QWKPkN2/image.png[/img][/url]<br>"+
"[url=http://x-lines.ru/][img]http://x-lines.ru/letters/i/cyrillicgothic/1066/2BA94F/20/1/4nxpbfgou5ejdwfy4nk7b8qoua.png[/img][/url]",
prefix: ACCEPT_PREFIX,
status: false,
},
{
title: 'покупка/продажа внутриигровой',
content:
'[SIZE=4][FONT=Verdana][COLOR=#32CD32][CENTER][B]{{ greeting }}, уважаемый[/color]{{ user.mention }}!<br>'+
"[url=https://postimages.org/][img]https://i.postimg.cc/0QWKPkN2/image.png[/img][/url]<br>"+
"[CENTER]Нарушитель будет наказан по пункту регламента: <br>"+
"[Color=Red]2.28.[/Color] Запрещена покупка/продажа внутриигровой валюты в любых ее проявлениях за реальные деньги [Color=Red]| PermBan с обнулением аккаунта + ЧС проекта[/Color]<br>"+
"[url=https://postimages.org/][img]https://i.postimg.cc/0QWKPkN2/image.png[/img][/url]<br>"+
"[url=http://x-lines.ru/][img]http://x-lines.ru/letters/i/cyrillicgothic/1066/2BA94F/20/1/4nxpbfgou5ejdwfy4nk7b8qoua.png[/img][/url]",
prefix: ACCEPT_PREFIX,
status: false,
},
{
title: 'Трансфер',
content:
'[SIZE=4][FONT=Verdana][COLOR=#32CD32][CENTER][B]{{ greeting }}, уважаемый[/color]{{ user.mention }}!<br>'+
"[url=https://postimages.org/][img]https://i.postimg.cc/0QWKPkN2/image.png[/img][/url]<br>"+
"[CENTER]Нарушитель будет наказан по пункту регламента: <br>"+
"[Color=Red]2.29.[/Color] Запрещен трансфер имущества между серверами проекта [Color=Red]| PermBan с обнулением аккаунта[/Color]<br>"+
"[url=https://postimages.org/][img]https://i.postimg.cc/0QWKPkN2/image.png[/img][/url]<br>"+
"[url=http://x-lines.ru/][img]http://x-lines.ru/letters/i/cyrillicgothic/1066/2BA94F/20/1/4nxpbfgou5ejdwfy4nk7b8qoua.png[/img][/url]",
prefix: ACCEPT_PREFIX,
status: false,
},
{
title: 'Реклама серверов, дискорд',
content:
'[SIZE=4][FONT=Verdana][COLOR=#32CD32][CENTER][B]{{ greeting }}, уважаемый[/color]{{ user.mention }}!<br>'+
"[url=https://postimages.org/][img]https://i.postimg.cc/0QWKPkN2/image.png[/img][/url]<br>"+
"[CENTER]Нарушитель будет наказан по пункту регламента: <br>"+
"[Color=Red]2.31.[/Color] Запрещено рекламировать на серверах любые проекты, серверы, сайты, сторонние Discord-серверы, YouTube каналы и тому подобное [Color=Red]| Ban 7 дней / PermBan[/Color]<br>"+
"[url=https://postimages.org/][img]https://i.postimg.cc/0QWKPkN2/image.png[/img][/url]<br>"+
"[url=http://x-lines.ru/][img]http://x-lines.ru/letters/i/cyrillicgothic/1066/2BA94F/20/1/4nxpbfgou5ejdwfy4nk7b8qoua.png[/img][/url]",
prefix: ACCEPT_PREFIX,
status: false,
},
{
title: 'Введение в заблуждение обман информации',
content:
'[SIZE=4][FONT=Verdana][COLOR=#32CD32][CENTER][B]{{ greeting }}, уважаемый[/color]{{ user.mention }}!<br>'+
"[url=https://postimages.org/][img]https://i.postimg.cc/0QWKPkN2/image.png[/img][/url]<br>"+
"[CENTER]Нарушитель будет наказан по пункту регламента: <br>"+
"[Color=Red]2.32.[/Color] Запрещено введение в заблуждение, обман администрации на всех ресурсах проекта [Color=Red]| Ban 7 - 15 дней[/Color]<br>"+
"[url=https://postimages.org/][img]https://i.postimg.cc/0QWKPkN2/image.png[/img][/url]<br>"+
"[url=http://x-lines.ru/][img]http://x-lines.ru/letters/i/cyrillicgothic/1066/2BA94F/20/1/4nxpbfgou5ejdwfy4nk7b8qoua.png[/img][/url]",
prefix: ACCEPT_PREFIX,
status: false,
},
{
title: 'IC и OOC конфликты о нац или религ',
content:
'[SIZE=4][FONT=Verdana][COLOR=#32CD32][CENTER][B]{{ greeting }}, уважаемый[/color]{{ user.mention }}!<br>'+
"[url=https://postimages.org/][img]https://i.postimg.cc/0QWKPkN2/image.png[/img][/url]<br>"+
"[CENTER]Нарушитель будет наказан по пункту регламента: <br>"+
"[Color=Red]2.35.[/Color] На игровых серверах запрещено устраивать IC и OOC конфликты на почве разногласия о национальности и / или религии совершенно в любом формате [Color=Red]| Mute 120 минут / Ban 7 дней[/Color]<br>"+
"[url=https://postimages.org/][img]https://i.postimg.cc/0QWKPkN2/image.png[/img][/url]<br>"+
"[url=http://x-lines.ru/][img]http://x-lines.ru/letters/i/cyrillicgothic/1066/2BA94F/20/1/4nxpbfgou5ejdwfy4nk7b8qoua.png[/img][/url]",
prefix: ACCEPT_PREFIX,
status: false,
},
{
title: 'OOC угрозы',
content:
'[SIZE=4][FONT=Verdana][COLOR=#32CD32][CENTER][B]{{ greeting }}, уважаемый[/color]{{ user.mention }}!<br>'+
"[url=https://postimages.org/][img]https://i.postimg.cc/0QWKPkN2/image.png[/img][/url]<br>"+
"[CENTER]Нарушитель будет наказан по пункту регламента: <br>"+
"[Color=Red]2.37.[/Color] Запрещены OOC угрозы, в том числе и завуалированные [Color=Red]| Mute 120 минут / Ban 7 дней[/Color]<br>"+
"[url=https://postimages.org/][img]https://i.postimg.cc/0QWKPkN2/image.png[/img][/url]<br>"+
"[url=http://x-lines.ru/][img]http://x-lines.ru/letters/i/cyrillicgothic/1066/2BA94F/20/1/4nxpbfgou5ejdwfy4nk7b8qoua.png[/img][/url]",
prefix: ACCEPT_PREFIX,
status: false,
},
{
title: 'Оск проекта',
content:
'[SIZE=4][FONT=Verdana][COLOR=#32CD32][CENTER][B]{{ greeting }}, уважаемый[/color]{{ user.mention }}!<br>'+
"[url=https://postimages.org/][img]https://i.postimg.cc/0QWKPkN2/image.png[/img][/url]<br>"+
"[CENTER]Нарушитель будет наказан по пункту регламента: <br>"+
"[Color=Red]2.40.[/Color] Запрещены совершенно любые деструктивные действия по отношению к проекту: неконструктивная критика, призывы покинуть проект, попытки нарушить развитие проекта или любые другие действия, способные привести к помехам в игровом процессе [Color=Red]| Mute 300 минут / Ban 30 дней [/Color][Color=Orange](Ban выдается по согласованию с главным администратором)[/Color]<br>"+
"[url=https://postimages.org/][img]https://i.postimg.cc/0QWKPkN2/image.png[/img][/url]<br>"+
"[url=http://x-lines.ru/][img]http://x-lines.ru/letters/i/cyrillicgothic/1066/2BA94F/20/1/4nxpbfgou5ejdwfy4nk7b8qoua.png[/img][/url]",
prefix: ACCEPT_PREFIX,
status: false,
},
{
title: 'ЕПП на любом виде транспорта',
content:
'[SIZE=4][FONT=Verdana][COLOR=#32CD32][CENTER][B]{{ greeting }}, уважаемый[/color]{{ user.mention }}!<br>'+
"[url=https://postimages.org/][img]https://i.postimg.cc/0QWKPkN2/image.png[/img][/url]<br>"+
"[CENTER]Нарушитель будет наказан по пункту регламента: <br>"+
"[Color=Red]2.46.[/Color] Запрещено ездить по полям на любом транспорте [Color=Red]| Jail 30 минут[/Color]<br>"+
"[url=https://postimages.org/][img]https://i.postimg.cc/0QWKPkN2/image.png[/img][/url]<br>"+
"[url=http://x-lines.ru/][img]http://x-lines.ru/letters/i/cyrillicgothic/1066/2BA94F/20/1/4nxpbfgou5ejdwfy4nk7b8qoua.png[/img][/url]",
prefix: ACCEPT_PREFIX,
status: false,
},
{
title: 'ЕПП инко / фура',
content:
'[SIZE=4][FONT=Verdana][COLOR=#32CD32][CENTER][B]{{ greeting }}, уважаемый[/color]{{ user.mention }}!<br>'+
"[url=https://postimages.org/][img]https://i.postimg.cc/0QWKPkN2/image.png[/img][/url]<br>"+
"[CENTER]Нарушитель будет наказан по пункту регламента: <br>"+
"[Color=Red]2.47.[/Color] Запрещено ездить по полям на грузовом транспорте, инкассаторских машинах (работа дальнобойщика, инкассатора) [Color=Red]| Jail 60 минут[/Color]<br>"+
"[url=https://postimages.org/][img]https://i.postimg.cc/0QWKPkN2/image.png[/img][/url]<br>"+
"[url=http://x-lines.ru/][img]http://x-lines.ru/letters/i/cyrillicgothic/1066/2BA94F/20/1/4nxpbfgou5ejdwfy4nk7b8qoua.png[/img][/url]",
prefix: ACCEPT_PREFIX,
status: false,
},
{
title: 'Зад-е в каз,аукц,мп',
content:
'[SIZE=4][FONT=Verdana][COLOR=#32CD32][CENTER][B]{{ greeting }}, уважаемый[/color]{{ user.mention }}!<br>'+
"[url=https://postimages.org/][img]https://i.postimg.cc/0QWKPkN2/image.png[/img][/url]<br>"+
"[CENTER]Нарушитель будет наказан по пункту регламента: <br>"+
"[Color=Red]2.50.[/Color] Запрещены задержания, аресты, а также любые действия со стороны игроков, состоящих во фракциях в интерьере аукциона, казино, а также во время системных мероприятий [Color=Red]| Ban 7 - 15 дней + увольнение из организации[/Color]<br>"+
"[url=https://postimages.org/][img]https://i.postimg.cc/0QWKPkN2/image.png[/img][/url]<br>"+
"[url=http://x-lines.ru/][img]http://x-lines.ru/letters/i/cyrillicgothic/1066/2BA94F/20/1/4nxpbfgou5ejdwfy4nk7b8qoua.png[/img][/url]",
prefix: ACCEPT_PREFIX,
status: false,
},
{
title: 'Неув общение к адм',
content:
'[SIZE=4][FONT=Verdana][COLOR=#32CD32][CENTER][B]{{ greeting }}, уважаемый[/color]{{ user.mention }}!<br>'+
"[url=https://postimages.org/][img]https://i.postimg.cc/0QWKPkN2/image.png[/img][/url]<br>"+
"[CENTER]Нарушитель будет наказан по пункту регламента: <br>"+
"[Color=Red]2.54.[/Color] Запрещено неуважительное обращение, оскорбление, неадекватное поведение, угрозы в любом их проявлении по отношению к администрации [Color=Red]| Mute 180 минут[/Color]<br>"+
"[url=https://postimages.org/][img]https://i.postimg.cc/0QWKPkN2/image.png[/img][/url]<br>"+
"[url=http://x-lines.ru/][img]http://x-lines.ru/letters/i/cyrillicgothic/1066/2BA94F/20/1/4nxpbfgou5ejdwfy4nk7b8qoua.png[/img][/url]",
prefix: ACCEPT_PREFIX,
status: false,
},
{
title: 'Багаюз с аним',
content:
'[SIZE=4][FONT=Verdana][COLOR=#32CD32][CENTER][B]{{ greeting }}, уважаемый[/color]{{ user.mention }}!<br>'+
"[url=https://postimages.org/][img]https://i.postimg.cc/0QWKPkN2/image.png[/img][/url]<br>"+
"[CENTER]Нарушитель будет наказан по пункту регламента: <br>"+
"[Color=Red]2.55.[/Color] Запрещается багоюз связанный с анимацией в любых проявлениях. [Color=Red]| Jail 60 / 120 минут[/Color]<br>"+
"[url=https://postimages.org/][img]https://i.postimg.cc/0QWKPkN2/image.png[/img][/url]<br>"+
"[url=http://x-lines.ru/][img]http://x-lines.ru/letters/i/cyrillicgothic/1066/2BA94F/20/1/4nxpbfgou5ejdwfy4nk7b8qoua.png[/img][/url]",
prefix: ACCEPT_PREFIX,
status: false,
},
{
title: '♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥ Игровые чаты ♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥'
},
{
title: 'ЯЗЫК',
content:
'[SIZE=4][FONT=Verdana][COLOR=#32CD32][CENTER][B]{{ greeting }}, уважаемый[/color]{{ user.mention }}!<br>'+
"[url=https://postimages.org/][img]https://i.postimg.cc/0QWKPkN2/image.png[/img][/url]<br>"+
"[CENTER]Нарушитель будет наказан по пункту регламента: <br>"+
"[Color=Red]3.01.[/Color] Общепризнанный язык сервера — русский. Общение в IC чатах во всех Role Play ситуациях обязательно должно проходить исключительно на русском языке [Color=Red]| Устное замечание / Mute 30 минут[/Color]<br>"+
"[url=https://postimages.org/][img]https://i.postimg.cc/0QWKPkN2/image.png[/img][/url]<br>"+
"[url=http://x-lines.ru/][img]http://x-lines.ru/letters/i/cyrillicgothic/1066/2BA94F/20/1/4nxpbfgou5ejdwfy4nk7b8qoua.png[/img][/url]",
prefix: ACCEPT_PREFIX,
status: false,
},
{
title: 'CAPSLOCK',
content:
'[SIZE=4][FONT=Verdana][COLOR=#32CD32][CENTER][B]{{ greeting }}, уважаемый[/color]{{ user.mention }}!<br>'+
"[url=https://postimages.org/][img]https://i.postimg.cc/0QWKPkN2/image.png[/img][/url]<br>"+
"[CENTER]Нарушитель будет наказан по пункту регламента: <br>"+
"[Color=Red]3.02.[/Color] Запрещено использование верхнего регистра (CapsLock) при написании любого текста в любом чате [Color=Red]| Mute 30 минут[/Color]<br>"+
"[url=https://postimages.org/][img]https://i.postimg.cc/0QWKPkN2/image.png[/img][/url]<br>"+
"[url=http://x-lines.ru/][img]http://x-lines.ru/letters/i/cyrillicgothic/1066/2BA94F/20/1/4nxpbfgou5ejdwfy4nk7b8qoua.png[/img][/url]",
prefix: ACCEPT_PREFIX,
status: false,
},
{
title: 'любой оск сексизма в OOC',
content:
'[SIZE=4][FONT=Verdana][COLOR=#32CD32][CENTER][B]{{ greeting }}, уважаемый[/color]{{ user.mention }}!<br>'+
"[url=https://postimages.org/][img]https://i.postimg.cc/0QWKPkN2/image.png[/img][/url]<br>"+
"[CENTER]Нарушитель будет наказан по пункту регламента: <br>"+
"[Color=Red]3.03.[/Color] Любые формы оскорблений, издевательств, расизма, дискриминации, религиозной враждебности, сексизма в OOC чате запрещены [Color=Red]| Mute 30 минут[/Color]<br>"+
"[url=https://postimages.org/][img]https://i.postimg.cc/0QWKPkN2/image.png[/img][/url]<br>"+
"[url=http://x-lines.ru/][img]http://x-lines.ru/letters/i/cyrillicgothic/1066/2BA94F/20/1/4nxpbfgou5ejdwfy4nk7b8qoua.png[/img][/url]",
prefix: ACCEPT_PREFIX,
status: false,
},
{
title: 'Упоминание / оск род',
content:
'[SIZE=4][FONT=Verdana][COLOR=#32CD32][CENTER][B]{{ greeting }}, уважаемый[/color]{{ user.mention }}!<br>'+
"[url=https://postimages.org/][img]https://i.postimg.cc/0QWKPkN2/image.png[/img][/url]<br>"+
"[CENTER]Нарушитель будет наказан по пункту регламента: <br>"+
"[Color=Red]3.04.[/Color] Запрещено оскорбление или косвенное упоминание родных вне зависимости от чата (IC или OOC) [Color=Red]| Mute 120 минут / Ban 7 - 15 дней[/Color]<br>"+
"[url=https://postimages.org/][img]https://i.postimg.cc/0QWKPkN2/image.png[/img][/url]<br>"+
"[url=http://x-lines.ru/][img]http://x-lines.ru/letters/i/cyrillicgothic/1066/2BA94F/20/1/4nxpbfgou5ejdwfy4nk7b8qoua.png[/img][/url]",
prefix: ACCEPT_PREFIX,
status: false,
},
{
title: 'Флуд',
content:
'[SIZE=4][FONT=Verdana][COLOR=#32CD32][CENTER][B]{{ greeting }}, уважаемый[/color]{{ user.mention }}!<br>'+
"[url=https://postimages.org/][img]https://i.postimg.cc/0QWKPkN2/image.png[/img][/url]<br>"+
"[CENTER]Нарушитель будет наказан по пункту регламента: <br>"+
"[Color=Red]3.05.[/Color] Запрещен флуд — 3 и более повторяющихся сообщений от одного и того же игрока [Color=Red]| Mute 30 минут[/Color]<br>"+
"[url=https://postimages.org/][img]https://i.postimg.cc/0QWKPkN2/image.png[/img][/url]<br>"+
"[url=http://x-lines.ru/][img]http://x-lines.ru/letters/i/cyrillicgothic/1066/2BA94F/20/1/4nxpbfgou5ejdwfy4nk7b8qoua.png[/img][/url]",
prefix: ACCEPT_PREFIX,
status: false,
},
{
title: 'Злоуп.знаков',
content:
'[SIZE=4][FONT=Verdana][COLOR=#32CD32][CENTER][B]{{ greeting }}, уважаемый[/color]{{ user.mention }}!<br>'+
"[url=https://postimages.org/][img]https://i.postimg.cc/0QWKPkN2/image.png[/img][/url]<br>"+
"[CENTER]Нарушитель будет наказан по пункту регламента: <br>"+
"[Color=Red]3.06.[/Color] Запрещено злоупотребление знаков препинания и прочих символов [Color=Red]| Mute 30 минут[/Color]<br>"+
"[url=https://postimages.org/][img]https://i.postimg.cc/0QWKPkN2/image.png[/img][/url]<br>"+
"[url=http://x-lines.ru/][img]http://x-lines.ru/letters/i/cyrillicgothic/1066/2BA94F/20/1/4nxpbfgou5ejdwfy4nk7b8qoua.png[/img][/url]",
prefix: ACCEPT_PREFIX,
status: false,
},
{
title: 'Оск секс',
content:
'[SIZE=4][FONT=Verdana][COLOR=#32CD32][CENTER][B]{{ greeting }}, уважаемый[/color]{{ user.mention }}!<br>'+
"[url=https://postimages.org/][img]https://i.postimg.cc/0QWKPkN2/image.png[/img][/url]<br>"+
"[CENTER]Нарушитель будет наказан по пункту регламента: <br>"+
"[Color=Red]3.07.[/Color] Запрещены совершенно любые оскорбления или действия, порочащие честь и достоинства, несущие в себе подтекст сексуального характера вне зависимости от чата [Color=Red]| Mute 30 минут[/Color]<br>"+
"[url=https://postimages.org/][img]https://i.postimg.cc/0QWKPkN2/image.png[/img][/url]<br>"+
"[url=http://x-lines.ru/][img]http://x-lines.ru/letters/i/cyrillicgothic/1066/2BA94F/20/1/4nxpbfgou5ejdwfy4nk7b8qoua.png[/img][/url]",
prefix: ACCEPT_PREFIX,
status: false,
},
{
title: 'Слив ГЧ',
content:
'[SIZE=4][FONT=Verdana][COLOR=#32CD32][CENTER][B]{{ greeting }}, уважаемый[/color]{{ user.mention }}!<br>'+
"[url=https://postimages.org/][img]https://i.postimg.cc/0QWKPkN2/image.png[/img][/url]<br>"+
"[CENTER]Нарушитель будет наказан по пункту регламента: <br>"+
"[Color=Red]3.08.[/Color] Запрещены любые формы «слива» посредством использования глобальных чатов [Color=Red]| PermBan[/Color]<br>"+
"[url=https://postimages.org/][img]https://i.postimg.cc/0QWKPkN2/image.png[/img][/url]<br>"+
"[url=http://x-lines.ru/][img]http://x-lines.ru/letters/i/cyrillicgothic/1066/2BA94F/20/1/4nxpbfgou5ejdwfy4nk7b8qoua.png[/img][/url]",
prefix: ACCEPT_PREFIX,
status: false,
},
{
title: 'Угрозы со стороны админ',
content:
'[SIZE=4][FONT=Verdana][COLOR=#32CD32][CENTER][B]{{ greeting }}, уважаемый[/color]{{ user.mention }}!<br>'+
"[url=https://postimages.org/][img]https://i.postimg.cc/0QWKPkN2/image.png[/img][/url]<br>"+
"[CENTER]Нарушитель будет наказан по пункту регламента: <br>"+
"[Color=Red]3.09.[/Color] Запрещены любые угрозы о наказании игрока со стороны администрации [Color=Red]| Mute 30 минут[/Color]<br>"+
"[url=https://postimages.org/][img]https://i.postimg.cc/0QWKPkN2/image.png[/img][/url]<br>"+
"[url=http://x-lines.ru/][img]http://x-lines.ru/letters/i/cyrillicgothic/1066/2BA94F/20/1/4nxpbfgou5ejdwfy4nk7b8qoua.png[/img][/url]",
prefix: ACCEPT_PREFIX,
status: false,
},
{
title: 'Выдача адм',
content:
'[SIZE=4][FONT=Verdana][COLOR=#32CD32][CENTER][B]{{ greeting }}, уважаемый[/color]{{ user.mention }}!<br>'+
"[url=https://postimages.org/][img]https://i.postimg.cc/0QWKPkN2/image.png[/img][/url]<br>"+
"[CENTER]Нарушитель будет наказан по пункту регламента: <br>"+
"[Color=Red]3.10.[/Color] Запрещена выдача себя за администратора, если таковым не являетесь [Color=Red]| Ban 7 - 15 + ЧС администрации[/Color]<br>"+
"[url=https://postimages.org/][img]https://i.postimg.cc/0QWKPkN2/image.png[/img][/url]<br>"+
"[url=http://x-lines.ru/][img]http://x-lines.ru/letters/i/cyrillicgothic/1066/2BA94F/20/1/4nxpbfgou5ejdwfy4nk7b8qoua.png[/img][/url]",
prefix: ACCEPT_PREFIX,
status: false,
},
{
title: 'Введение игроков путем злоуп ком',
content:
'[SIZE=4][FONT=Verdana][COLOR=#32CD32][CENTER][B]{{ greeting }}, уважаемый[/color]{{ user.mention }}!<br>'+
"[url=https://postimages.org/][img]https://i.postimg.cc/0QWKPkN2/image.png[/img][/url]<br>"+
"[CENTER]Нарушитель будет наказан по пункту регламента: <br>"+
"[Color=Red]3.11.[/Color] Запрещено введение игроков проекта в заблуждение путем злоупотребления командами [Color=Red]| Ban 15 - 30 дней / PermBan[/Color]<br>"+
"[url=https://postimages.org/][img]https://i.postimg.cc/0QWKPkN2/image.png[/img][/url]<br>"+
"[url=http://x-lines.ru/][img]http://x-lines.ru/letters/i/cyrillicgothic/1066/2BA94F/20/1/4nxpbfgou5ejdwfy4nk7b8qoua.png[/img][/url]",
prefix: ACCEPT_PREFIX,
status: false,
},
{
title: 'нарушение в репорт',
content:
'[SIZE=4][FONT=Verdana][COLOR=#32CD32][CENTER][B]{{ greeting }}, уважаемый[/color]{{ user.mention }}!<br>'+
"[url=https://postimages.org/][img]https://i.postimg.cc/0QWKPkN2/image.png[/img][/url]<br>"+
"[CENTER]Нарушитель будет наказан по пункту регламента: <br>"+
"[Color=Red]3.12.[/Color] Запрещено подавать репорт написанный транслитом, с сообщением не по теме (Offtop), с включенным Caps Lock и повторять обращение (если ответ был уже дан ранее) [Color=Red]| Report Mute 30 минут[/Color]<br>"+
"[url=https://postimages.org/][img]https://i.postimg.cc/0QWKPkN2/image.png[/img][/url]<br>"+
"[url=http://x-lines.ru/][img]http://x-lines.ru/letters/i/cyrillicgothic/1066/2BA94F/20/1/4nxpbfgou5ejdwfy4nk7b8qoua.png[/img][/url]",
prefix: ACCEPT_PREFIX,
status: false,
},
{
title: 'Нецензурная брань в репорт',
content:
'[SIZE=4][FONT=Verdana][COLOR=#32CD32][CENTER][B]{{ greeting }}, уважаемый[/color]{{ user.mention }}!<br>'+
"[url=https://postimages.org/][img]https://i.postimg.cc/0QWKPkN2/image.png[/img][/url]<br>"+
"[CENTER]Нарушитель будет наказан по пункту регламента: <br>"+
"[Color=Red]3.13.[/Color] Запрещено подавать репорт с использованием нецензурной брани [Color=Red]| Report Mute 30 минут[/Color]<br>"+
"[url=https://postimages.org/][img]https://i.postimg.cc/0QWKPkN2/image.png[/img][/url]<br>"+
"[url=http://x-lines.ru/][img]http://x-lines.ru/letters/i/cyrillicgothic/1066/2BA94F/20/1/4nxpbfgou5ejdwfy4nk7b8qoua.png[/img][/url]",
prefix: ACCEPT_PREFIX,
status: false,
},
{
title: 'Музыка в войс',
content:
'[SIZE=4][FONT=Verdana][COLOR=#32CD32][CENTER][B]{{ greeting }}, уважаемый[/color]{{ user.mention }}!<br>'+
"[url=https://postimages.org/][img]https://i.postimg.cc/0QWKPkN2/image.png[/img][/url]<br>"+
"[CENTER]Нарушитель будет наказан по пункту регламента: <br>"+
"[Color=Red]3.14.[/Color] Запрещено включать музыку в Voice Chat [Color=Red]| Mute 60 минут[/Color]<br>"+
"[url=https://postimages.org/][img]https://i.postimg.cc/0QWKPkN2/image.png[/img][/url]<br>"+
"[url=http://x-lines.ru/][img]http://x-lines.ru/letters/i/cyrillicgothic/1066/2BA94F/20/1/4nxpbfgou5ejdwfy4nk7b8qoua.png[/img][/url]",
prefix: ACCEPT_PREFIX,
status: false,
},
{
title: 'Оск игроков / родню в войс ',
content:
'[SIZE=4][FONT=Verdana][COLOR=#32CD32][CENTER][B]{{ greeting }}, уважаемый[/color]{{ user.mention }}!<br>'+
"[url=https://postimages.org/][img]https://i.postimg.cc/0QWKPkN2/image.png[/img][/url]<br>"+
"[CENTER]Нарушитель будет наказан по пункту регламента: <br>"+
"[Color=Red]3.15.[/Color] Запрещено оскорблять игроков или родных в Voice Chat [Color=Red]| Mute 120 минут / Ban 7 - 15 дней[/Color]<br><br>"+
"[url=https://postimages.org/][img]https://i.postimg.cc/0QWKPkN2/image.png[/img][/url]<br>"+
"[url=http://x-lines.ru/][img]http://x-lines.ru/letters/i/cyrillicgothic/1066/2BA94F/20/1/4nxpbfgou5ejdwfy4nk7b8qoua.png[/img][/url]",
prefix: ACCEPT_PREFIX,
status: false,
},
{
title: 'Шумы в войс',
content:
'[SIZE=4][FONT=Verdana][COLOR=#32CD32][CENTER][B]{{ greeting }}, уважаемый[/color]{{ user.mention }}!<br>'+
"[url=https://postimages.org/][img]https://i.postimg.cc/0QWKPkN2/image.png[/img][/url]<br>"+
"[CENTER]Нарушитель будет наказан по пункту регламента: <br>"+
"[Color=Red]3.16.[/Color] Запрещено создавать посторонние шумы или звуки [Color=Red]| Mute 30 минут[/Color]<br><br>"+
"[url=https://postimages.org/][img]https://i.postimg.cc/0QWKPkN2/image.png[/img][/url]<br>"+
"[url=http://x-lines.ru/][img]http://x-lines.ru/letters/i/cyrillicgothic/1066/2BA94F/20/1/4nxpbfgou5ejdwfy4nk7b8qoua.png[/img][/url]",
prefix: ACCEPT_PREFIX,
status: false,
},
{
title: 'Реклама в войс',
content:
'[SIZE=4][FONT=Verdana][COLOR=#32CD32][CENTER][B]{{ greeting }}, уважаемый[/color]{{ user.mention }}!<br>'+
"[url=https://postimages.org/][img]https://i.postimg.cc/0QWKPkN2/image.png[/img][/url]<br>"+
"[CENTER]Нарушитель будет наказан по пункту регламента: <br>"+
"[Color=Red]3.17.[/Color] Запрещена реклама в Voice Chat не связанная с игровым процессом [Color=Red]| Ban 7 - 15 дней[/Color]<br><br>"+
"[url=https://postimages.org/][img]https://i.postimg.cc/0QWKPkN2/image.png[/img][/url]<br>"+
"[url=http://x-lines.ru/][img]http://x-lines.ru/letters/i/cyrillicgothic/1066/2BA94F/20/1/4nxpbfgou5ejdwfy4nk7b8qoua.png[/img][/url]",
prefix: ACCEPT_PREFIX,
status: false,
},
{
title: 'Политика',
content:
'[SIZE=4][FONT=Verdana][COLOR=#32CD32][CENTER][B]{{ greeting }}, уважаемый[/color]{{ user.mention }}!<br>'+
"[url=https://postimages.org/][img]https://i.postimg.cc/0QWKPkN2/image.png[/img][/url]<br>"+
"[CENTER]Нарушитель будет наказан по пункту регламента: <br>"+
"[Color=Red]3.18.[/Color] Запрещено политическое и религиозное пропагандирование [Color=Red]| Mute 120 минут / Ban 10 дней[/Color]<br><br>"+
"[url=https://postimages.org/][img]https://i.postimg.cc/0QWKPkN2/image.png[/img][/url]<br>"+
"[url=http://x-lines.ru/][img]http://x-lines.ru/letters/i/cyrillicgothic/1066/2BA94F/20/1/4nxpbfgou5ejdwfy4nk7b8qoua.png[/img][/url]",
prefix: ACCEPT_PREFIX,
status: false,
},
{
title: 'Транслит',
content:
'[SIZE=4][FONT=Verdana][COLOR=#32CD32][CENTER][B]{{ greeting }}, уважаемый[/color]{{ user.mention }}!<br>'+
"[url=https://postimages.org/][img]https://i.postimg.cc/0QWKPkN2/image.png[/img][/url]<br>"+
"[CENTER]Нарушитель будет наказан по пункту регламента: <br>"+
"[Color=Red]3.20.[/Color] Запрещено использование транслита в любом из чатов [Color=Red]| Mute 30 минут[/Color]<br><br>"+
"[url=https://postimages.org/][img]https://i.postimg.cc/0QWKPkN2/image.png[/img][/url]<br>"+
"[url=http://x-lines.ru/][img]http://x-lines.ru/letters/i/cyrillicgothic/1066/2BA94F/20/1/4nxpbfgou5ejdwfy4nk7b8qoua.png[/img][/url]",
prefix: ACCEPT_PREFIX,
status: false,
},
{
title: 'Реклама промо',
content:
'[SIZE=4][FONT=Verdana][COLOR=#32CD32][CENTER][B]{{ greeting }}, уважаемый[/color]{{ user.mention }}!<br>'+
"[url=https://postimages.org/][img]https://i.postimg.cc/0QWKPkN2/image.png[/img][/url]<br>"+
"[CENTER]Нарушитель будет наказан по пункту регламента: <br>"+
"[Color=Red]3.21.[/Color] Запрещается реклама промокодов в игре, а также их упоминание в любом виде во всех чатах. [Color=Red]| Ban 30 дней[/Color]<br><br>"+
"[url=https://postimages.org/][img]https://i.postimg.cc/0QWKPkN2/image.png[/img][/url]<br>"+
"[url=http://x-lines.ru/][img]http://x-lines.ru/letters/i/cyrillicgothic/1066/2BA94F/20/1/4nxpbfgou5ejdwfy4nk7b8qoua.png[/img][/url]",
prefix: ACCEPT_PREFIX,
status: false,
},
{
title: 'торговля в помещении',
content:
'[SIZE=4][FONT=Verdana][COLOR=#32CD32][CENTER][B]{{ greeting }}, уважаемый[/color]{{ user.mention }}!<br>'+
"[url=https://postimages.org/][img]https://i.postimg.cc/0QWKPkN2/image.png[/img][/url]<br>"+
"[CENTER]Нарушитель будет наказан по пункту регламента: <br>"+
"[Color=Red]3.22.[/Color] Запрещено публиковать любые объявления в помещениях государственных организаций вне зависимости от чата (IC или OOC) [Color=Red]| Mute 30 минут[/Color]<br>"+
"[url=https://postimages.org/][img]https://i.postimg.cc/0QWKPkN2/image.png[/img][/url]<br>"+
"[url=http://x-lines.ru/][img]http://x-lines.ru/letters/i/cyrillicgothic/1066/2BA94F/20/1/4nxpbfgou5ejdwfy4nk7b8qoua.png[/img][/url]",
prefix: ACCEPT_PREFIX,
status: false,
},
{
title: '♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥ Положение об игровых аккаунтах ♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥'
},
{
title: 'Передача аккаунта 3-м лицам',
content:
'[SIZE=4][FONT=Verdana][COLOR=#32CD32][CENTER][B]{{ greeting }}, уважаемый[/color]{{ user.mention }}!<br>'+
"[url=https://postimages.org/][img]https://i.postimg.cc/0QWKPkN2/image.png[/img][/url]<br>"+
"[CENTER]Нарушитель будет наказан по пункту регламента: <br>"+
"[Color=Red]4.03[/Color] Запрещена совершенно любая передача игровых аккаунтов третьим лицам [Color=Red]| Permban[/Color]<br>"+
"[url=https://postimages.org/][img]https://i.postimg.cc/0QWKPkN2/image.png[/img][/url]<br>"+
"[url=http://x-lines.ru/][img]http://x-lines.ru/letters/i/cyrillicgothic/1066/2BA94F/20/1/4nxpbfgou5ejdwfy4nk7b8qoua.png[/img][/url]",
prefix: ACCEPT_PREFIX,
status: false,
},
{
title: 'Мультиаккаунты',
content:
'[SIZE=4][FONT=Verdana][COLOR=#32CD32][CENTER][B]{{ greeting }}, уважаемый[/color]{{ user.mention }}!<br>'+
"[url=https://postimages.org/][img]https://i.postimg.cc/0QWKPkN2/image.png[/img][/url]<br>"+
"[CENTER]Нарушитель будет наказан по пункту регламента: <br>"+
"[Color=Red]4.04[/Color] Разрешается зарегистрировать максимально только три игровых аккаунта на сервере [Color=Red]| Permban[/Color]<br>"+
"[LIST][*][color=red]Примечание:[/color] блокировке подлежат все аккаунты созданные после третьего твинка.[/LIST]"+
"[url=https://postimages.org/][img]https://i.postimg.cc/0QWKPkN2/image.png[/img][/url]<br>"+
"[url=http://x-lines.ru/][img]http://x-lines.ru/letters/i/cyrillicgothic/1066/2BA94F/20/1/4nxpbfgou5ejdwfy4nk7b8qoua.png[/img][/url]",
prefix: ACCEPT_PREFIX,
status: false,
},
{
title: 'Оскорбительный Nick_Name',
content:
'[SIZE=4][FONT=Verdana][COLOR=#32CD32][CENTER][B]{{ greeting }}, уважаемый[/color]{{ user.mention }}!<br>'+
"[url=https://postimages.org/][img]https://i.postimg.cc/0QWKPkN2/image.png[/img][/url]<br>"+
"[CENTER]Нарушитель будет наказан по пункту регламента: <br>"+
"[Color=Red]4.09[/Color] Запрещено использовать никнейм, содержащий в себе матерные слова или оскорбления (в том числе, завуалированные)  [Color=Red]| Устное замечание + смена игрового никнейма / PermBan[/Color]<br>"+
"[url=https://postimages.org/][img]https://i.postimg.cc/0QWKPkN2/image.png[/img][/url]<br>"+
"[url=http://x-lines.ru/][img]http://x-lines.ru/letters/i/cyrillicgothic/1066/2BA94F/20/1/4nxpbfgou5ejdwfy4nk7b8qoua.png[/img][/url]",
prefix: ACCEPT_PREFIX,
status: false,
},
{
title: 'Оскорбительный Nick_Name',
content:
'[SIZE=4][FONT=Verdana][COLOR=#32CD32][CENTER][B]{{ greeting }}, уважаемый[/color]{{ user.mention }}!<br>'+
"[url=https://postimages.org/][img]https://i.postimg.cc/0QWKPkN2/image.png[/img][/url]<br>"+
"[CENTER]Нарушитель будет наказан по пункту регламента: <br>"+
"[Color=Red]4.09[/Color] Запрещено использовать никнейм, содержащий в себе матерные слова или оскорбления (в том числе, завуалированные)  [Color=Red]| Устное замечание + смена игрового никнейма / PermBan[/Color]<br>"+
"[url=https://postimages.org/][img]https://i.postimg.cc/0QWKPkN2/image.png[/img][/url]<br>"+
"[url=http://x-lines.ru/][img]http://x-lines.ru/letters/i/cyrillicgothic/1066/2BA94F/20/1/4nxpbfgou5ejdwfy4nk7b8qoua.png[/img][/url]",
prefix: ACCEPT_PREFIX,
status: false,
},
{
title: 'Fake аккаунт',
content:
'[SIZE=4][FONT=Verdana][COLOR=#32CD32][CENTER][B]{{ greeting }}, уважаемый[/color]{{ user.mention }}!<br>'+
"[url=https://postimages.org/][img]https://i.postimg.cc/0QWKPkN2/image.png[/img][/url]<br>"+
"[CENTER]Нарушитель будет наказан по пункту регламента: <br>"+
"[Color=Red]4.10[/Color] Запрещено создавать никнейм, повторяющий или похожий на существующие никнеймы игроков или администраторов по их написанию [Color=Red]| Устное замечание + смена игрового никнейма / PermBan[/Color]<br>"+
"[url=https://postimages.org/][img]https://i.postimg.cc/0QWKPkN2/image.png[/img][/url]<br>"+
"[url=http://x-lines.ru/][img]http://x-lines.ru/letters/i/cyrillicgothic/1066/2BA94F/20/1/4nxpbfgou5ejdwfy4nk7b8qoua.png[/img][/url]",
prefix: ACCEPT_PREFIX,
status: false,
},
 
{
title: '♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥ Гос. организации / ОПГ​ ♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥'
},
{
title: 'Фракц.т/с в л/ц',
content:
'[SIZE=4][FONT=Verdana][COLOR=#32CD32][CENTER][B]{{ greeting }}, уважаемый[/color]{{ user.mention }}!<br>'+
"[url=https://postimages.org/][img]https://i.postimg.cc/0QWKPkN2/image.png[/img][/url]<br>"+
"[CENTER]Нарушитель будет наказан по пункту регламента: <br>"+
"[Color=Red]1.08.[/COLOR] Запрещено использование фракционного транспорта в личных целях [Color=Red]| Jail 30 минут[/COLOR]<br><br>"+
"[url=https://postimages.org/][img]https://i.postimg.cc/0QWKPkN2/image.png[/img][/url]<br>"+
"[url=http://x-lines.ru/][img]http://x-lines.ru/letters/i/cyrillicgothic/1066/2BA94F/20/1/4nxpbfgou5ejdwfy4nk7b8qoua.png[/img][/url]",
prefix: ACCEPT_PREFIX,
status: false,
},
{
title: 'Одиночный патруль',
content:
'[SIZE=4][FONT=Verdana][COLOR=#32CD32][CENTER][B]{{ greeting }}, уважаемый[/color]{{ user.mention }}!<br>'+
"[url=https://postimages.org/][img]https://i.postimg.cc/0QWKPkN2/image.png[/img][/url]<br>"+
"[CENTER]Нарушитель будет наказан по пункту регламента: <br>"+
"[Color=Red]1.11.[/COLOR] Всем силовым структурам запрещен одиночный патруль или конвоирование, минимум 2 сотрудника [Color=Red]| Jail 30 минут[/COLOR]<br>"+
"[url=https://postimages.org/][img]https://i.postimg.cc/0QWKPkN2/image.png[/img][/url]<br>"+
"[url=http://x-lines.ru/][img]http://x-lines.ru/letters/i/cyrillicgothic/1066/2BA94F/20/1/4nxpbfgou5ejdwfy4nk7b8qoua.png[/img][/url]",
prefix: ACCEPT_PREFIX,
status: false,
},
{
title: 'ДМ вне тт в/ч [Армия]',
content:
'[SIZE=4][FONT=Verdana][COLOR=#32CD32][CENTER][B]{{ greeting }}, уважаемый[/color]{{ user.mention }}!<br>'+
"[url=https://postimages.org/][img]https://i.postimg.cc/0QWKPkN2/image.png[/img][/url]<br>"+
"[CENTER]Нарушитель будет наказан по пункту регламента: <br>"+
"[Color=Red]2.02.[/COLOR] Наносить урон игрокам, которые находятся вне территории воинской части, запрещено [Color=Red]| DM / Jail 60 минут / Warn[/COLOR]"+
"Примечание: предупреждение (Warn) выдается только в случае Mass DM.<br>"+
"[url=https://postimages.org/][img]https://i.postimg.cc/0QWKPkN2/image.png[/img][/url]<br>"+
"[url=http://x-lines.ru/][img]http://x-lines.ru/letters/i/cyrillicgothic/1066/2BA94F/20/1/4nxpbfgou5ejdwfy4nk7b8qoua.png[/img][/url]",
PREFIX: ACCEPT_PREFIX,
status: false,
},
{
title: 'НПРО',
content:
'[SIZE=4][FONT=Verdana][COLOR=#32CD32][CENTER][B]{{ greeting }}, уважаемый[/color]{{ user.mention }}!<br>'+
"[url=https://postimages.org/][img]https://i.postimg.cc/0QWKPkN2/image.png[/img][/url]<br>"+
"[CENTER]Нарушитель будет наказан по пункту регламента: <br>"+
"[Color=Red]4.01.[/COLOR] Запрещено редактирование объявлений, не соответствующих ПРО [Color=Red]| Mute 30 минут[/COLOR]<br>"+
"[url=https://postimages.org/][img]https://i.postimg.cc/0QWKPkN2/image.png[/img][/url]<br>"+
"[url=http://x-lines.ru/][img]http://x-lines.ru/letters/i/cyrillicgothic/1066/2BA94F/20/1/4nxpbfgou5ejdwfy4nk7b8qoua.png[/img][/url]",
prefix: ACCEPT_PREFIX,
status: false,
},
{
title: 'ПРЭ',
content:
'[SIZE=4][FONT=Verdana][COLOR=#32CD32][CENTER][B]{{ greeting }}, уважаемый[/color]{{ user.mention }}!<br>'+
"[url=https://postimages.org/][img]https://i.postimg.cc/0QWKPkN2/image.png[/img][/url]<br>"+
"[CENTER]Нарушитель будет наказан по пункту регламента: <br>"+
"[Color=Red]4.02.[/COLOR] Запрещено проведение эфиров, не соответствующих Role Play правилам и логике [Color=Red]| Mute 30 минут[/COLOR]<br>"+
"[url=https://postimages.org/][img]https://i.postimg.cc/0QWKPkN2/image.png[/img][/url]<br>"+
"[url=http://x-lines.ru/][img]http://x-lines.ru/letters/i/cyrillicgothic/1066/2BA94F/20/1/4nxpbfgou5ejdwfy4nk7b8qoua.png[/img][/url]",
prefix: ACCEPT_PREFIX,
status: false,
},
{
title: 'Редактирование в л/ц',
content:
'[SIZE=4][FONT=Verdana][COLOR=#32CD32][CENTER][B]{{ greeting }}, уважаемый[/color]{{ user.mention }}!<br>'+
"[url=https://postimages.org/][img]https://i.postimg.cc/0QWKPkN2/image.png[/img][/url]<br>"+
"[CENTER]Нарушитель будет наказан по пункту регламента: <br>"+
"[Color=Red]4.04.[/COLOR] Запрещено редактировать поданные объявления в личных целях заменяя текст объявления на несоответствующий отправленному игроком [Color=Red]| Ban 7 дней + ЧС организации[/COLOR]<br>"+
"[url=https://postimages.org/][img]https://i.postimg.cc/0QWKPkN2/image.png[/img][/url]<br>"+
"[url=http://x-lines.ru/][img]http://x-lines.ru/letters/i/cyrillicgothic/1066/2BA94F/20/1/4nxpbfgou5ejdwfy4nk7b8qoua.png[/img][/url]",
prefix: ACCEPT_PREFIX,
status: false,
},
{
title: 'Урон игрокам без РП причины на тт Гос',
content:
'[SIZE=4][FONT=Verdana][COLOR=#32CD32][CENTER][B]{{ greeting }}, уважаемый[/color]{{ user.mention }}!<br>'+
"[url=https://postimages.org/][img]https://i.postimg.cc/0QWKPkN2/image.png[/img][/url]<br>"+
"[CENTER]Нарушитель будет наказан по пункту регламента: <br>"+
"[Color=Red]6.01.|7.01.|8.01.|9.01.[/COLOR] Запрещено наносить урон игрокам без Role Play причины на территории УМВД | ГИБДД | ФСБ | ФСИН [Color=Red]| DM / Jail 60 минут / Warn[/COLOR]<br>"+
"[url=https://postimages.org/][img]https://i.postimg.cc/0QWKPkN2/image.png[/img][/url]<br>"+
"[url=http://x-lines.ru/][img]http://x-lines.ru/letters/i/cyrillicgothic/1066/2BA94F/20/1/4nxpbfgou5ejdwfy4nk7b8qoua.png[/img][/url]",
prefix: ACCEPT_PREFIX,
status: false,
},
{
title: 'Розыск без РП',
content:
'[SIZE=4][FONT=Verdana][COLOR=#32CD32][CENTER][B]{{ greeting }}, уважаемый[/color]{{ user.mention }}!<br>'+
"[url=https://postimages.org/][img]https://i.postimg.cc/0QWKPkN2/image.png[/img][/url]<br>"+
"[CENTER]Нарушитель будет наказан по пункту регламента: <br>"+
"[Color=Red]6.02.[/COLOR] Запрещено выдавать розыск без Role Play причины [Color=Red]| Warn[/COLOR]<br>"+
"[url=https://postimages.org/][img]https://i.postimg.cc/0QWKPkN2/image.png[/img][/url]<br>"+
"[url=http://x-lines.ru/][img]http://x-lines.ru/letters/i/cyrillicgothic/1066/2BA94F/20/1/4nxpbfgou5ejdwfy4nk7b8qoua.png[/img][/url]",
prefix: ACCEPT_PREFIX,
status: false,
},
{
title: 'НРП Поведение ГОСС',
content:
'[SIZE=4][FONT=Verdana][COLOR=#32CD32][CENTER][B]{{ greeting }}, уважаемый[/color]{{ user.mention }}!<br>'+
"[url=https://postimages.org/][img]https://i.postimg.cc/0QWKPkN2/image.png[/img][/url]<br>"+
"[CENTER]Нарушитель будет наказан по пункту регламента: <br>"+
"[Color=Red]6.03.[/COLOR] Запрещено nRP поведение [Color=Red]| Warn[/COLOR]<br>"+
"[url=https://postimages.org/][img]https://i.postimg.cc/0QWKPkN2/image.png[/img][/url]<br>"+
"[url=http://x-lines.ru/][img]http://x-lines.ru/letters/i/cyrillicgothic/1066/2BA94F/20/1/4nxpbfgou5ejdwfy4nk7b8qoua.png[/img][/url]",
prefix: ACCEPT_PREFIX,
status: false,
},
{
title: 'Провокация сотрудника госс [ОПГ]',
content:
'[SIZE=4][FONT=Verdana][COLOR=#32CD32][CENTER][B]{{ greeting }}, уважаемый[/color]{{ user.mention }}!<br>'+
"[url=https://postimages.org/][img]https://i.postimg.cc/0QWKPkN2/image.png[/img][/url]<br>"+
"[CENTER]Нарушитель будет наказан по пункту регламента: <br>"+
"Запрещено провоцировать сотрудников государственных организаций [Color=Red]| Jail 30 минут[/COLOR]<br>"+
"[url=https://postimages.org/][img]https://i.postimg.cc/0QWKPkN2/image.png[/img][/url]<br>"+
"[url=http://x-lines.ru/][img]http://x-lines.ru/letters/i/cyrillicgothic/1066/2BA94F/20/1/4nxpbfgou5ejdwfy4nk7b8qoua.png[/img][/url]",
prefix: ACCEPT_PREFIX,
status: false,
},
{
title: 'ДМ без причины [ОПГ]',
content:
'[SIZE=4][FONT=Verdana][COLOR=#32CD32][CENTER][B]{{ greeting }}, уважаемый[/color]{{ user.mention }}!<br>'+
"[url=https://postimages.org/][img]https://i.postimg.cc/0QWKPkN2/image.png[/img][/url]<br>"+
"[CENTER]Нарушитель будет наказан по пункту регламента: <br>"+
"Запрещено без причины наносить урон игрокам на территории ОПГ [Color=Red]| Jail 60 минут[/COLOR]<br>"+
"[url=https://postimages.org/][img]https://i.postimg.cc/0QWKPkN2/image.png[/img][/url]<br>"+
"[url=http://x-lines.ru/][img]http://x-lines.ru/letters/i/cyrillicgothic/1066/2BA94F/20/1/4nxpbfgou5ejdwfy4nk7b8qoua.png[/img][/url]",
prefix: ACCEPT_PREFIX,
status: false,
},
{
title: 'Дуэли [ОПГ]',
content:
'[SIZE=4][FONT=Verdana][COLOR=#32CD32][CENTER][B]{{ greeting }}, уважаемый[/color]{{ user.mention }}!<br>'+
"[url=https://postimages.org/][img]https://i.postimg.cc/0QWKPkN2/image.png[/img][/url]<br>"+
"[CENTER]Нарушитель будет наказан по пункту регламента: <br>"+
"Запрещено устраивать дуэли где-либо, а также на территории ОПГ [Color=Red]| Jail 30 минут[/COLOR]<br>"+
"[url=https://postimages.org/][img]https://i.postimg.cc/0QWKPkN2/image.png[/img][/url]<br>"+
"[url=http://x-lines.ru/][img]http://x-lines.ru/letters/i/cyrillicgothic/1066/2BA94F/20/1/4nxpbfgou5ejdwfy4nk7b8qoua.png[/img][/url]",
prefix: ACCEPT_PREFIX,
status: false,
},
{
title: 'nRP В/Ч',
content:
'[SIZE=4][FONT=Verdana][COLOR=#32CD32][CENTER][B]{{ greeting }}, уважаемый[/color]{{ user.mention }}!<br>'+
"[url=https://postimages.org/][img]https://i.postimg.cc/0QWKPkN2/image.png[/img][/url]<br>"+
"[CENTER]Нарушитель будет наказан по пункту регламента: <br>"+
"За нарушение правил нападения на Войсковую Часть выдаётся предупреждение [Color=Red]| Jail 30 минут (NonRP нападение) / Warn[/COLOR] [Color=Orange](Для сотрудников ОПГ)[/COLOR]<br>"+
"[url=https://postimages.org/][img]https://i.postimg.cc/0QWKPkN2/image.png[/img][/url]<br>"+
"[url=http://x-lines.ru/][img]http://x-lines.ru/letters/i/cyrillicgothic/1066/2BA94F/20/1/4nxpbfgou5ejdwfy4nk7b8qoua.png[/img][/url]",
prefix: ACCEPT_PREFIX,
status: false,
},
{
title: '♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥ Role Play биографии ♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥'
},
{
title: 'Одобрено',
content:
'[SIZE=4][FONT=Verdana][COLOR=red][CENTER][B]{{ greeting }}, уважаемый[/color]{{ user.mention }}!<br>'+
"[url=https://postimages.org/][img]https://i.postimg.cc/0QWKPkN2/image.png[/img][/url]<br>"+
"Ваша Role Play биография получает статус:<br><br>"+
"[url=http://x-lines.ru/][img]http://x-lines.ru/letters/i/cyrillicgothic/1066/21ca49/20/1/4nxpbfgou5ejdwfy4nk7b8qoua.png[/img][/url]<br>"+
"[url=https://postimages.org/][img]https://i.postimg.cc/0QWKPkN2/image.png[/img][/url]<br>"+
'[CENTER]Приятной игры и времяпровождение на сервере TOMSK.[/CENTER][/B][/SIZE]',
prefix: ACCEPT_PREFIX,
status: false,
},
{
title: '3 лицо',
content:
'[SIZE=4][FONT=Verdana][COLOR=red][CENTER][B]{{ greeting }}, уважаемый[/color]{{ user.mention }}!<br>'+
"[url=https://postimages.org/][img]https://i.postimg.cc/0QWKPkN2/image.png[/img][/url]<br>"+
"Биография должна быть написана от первого лица персонажа.<br>"+
"[url=https://postimages.org/][img]https://i.postimg.cc/0QWKPkN2/image.png[/img][/url]<br>"+
"[url=http://x-lines.ru/][img]http://x-lines.ru/letters/i/cyrillicgothic/1066/f70810/20/1/rdej7wfn4nppbrgo19ejbwr74nxy.png[/img][/url]",
prefix: UNACCEPT_PREFIX,
status: false,
},
{
title: 'Мало информации',
content:
'[SIZE=4][FONT=Verdana][COLOR=red][CENTER][B]{{ greeting }}, уважаемый[/color]{{ user.mention }}!<br>'+
"[url=https://postimages.org/][img]https://i.postimg.cc/0QWKPkN2/image.png[/img][/url]<br>"+
"Рассмотрев Вашу RolePlay биографию, было приятно решение, что она получает статус - [color=red]отказано[/color].<br>Причиной послужило малое кол-во информации.<br><br>[color=red]Что-же такое RolePlay биография?[/color] Прежде чем дать ответ на данный вопрос, давайте обратимся к определению:<br>Биография - это описание жизни человека, сделанное другими людьми или им самим (автобиография).<br><br>А теперь давайте ответим на вопрос, что-же такое RolePlay Биография.<br>[color=red]RolePlay биография[/color] - это автобиография персонажа, которую составляет игрок, который им управляет. Важно запомнить, что недопустимо в RP-биографии выбирать себе роль мульт-героев, наделять своего персонажа сверхъестественными способностями.<br>Основная задача при создании RP - Сама RolePlay биография и её содержание и замысел зависит только от Вас, и от того, какую роль Вы играете на сервере, но увы, вы этим не воспользовались.<br>[color=red]Рекомендую[/color], задуматься над созданием новой историей вашего игрового персонажа.<br>"+
"[url=https://postimages.org/][img]https://i.postimg.cc/0QWKPkN2/image.png[/img][/url]<br>"+
"[url=http://x-lines.ru/][img]http://x-lines.ru/letters/i/cyrillicgothic/1066/f70810/20/1/rdej7wfn4nppbrgo19ejbwr74nxy.png[/img][/url]",
prefix: UNACCEPT_PREFIX,
status: false,
},
{
title: 'Скопирована / украдена',
content:
'[SIZE=4][FONT=Verdana][COLOR=red][CENTER][B]{{ greeting }}, уважаемый[/color]{{ user.mention }}!<br>'+
"[url=https://postimages.org/][img]https://i.postimg.cc/0QWKPkN2/image.png[/img][/url]<br>"+
"Запрещено полное и частичное копирование биографий из данного раздела или из разделов RP биографий других серверов.<br>"+
"[url=https://postimages.org/][img]https://i.postimg.cc/0QWKPkN2/image.png[/img][/url]<br>"+
"[url=http://x-lines.ru/][img]http://x-lines.ru/letters/i/cyrillicgothic/1066/f70810/20/1/rdej7wfn4nppbrgo19ejbwr74nxy.png[/img][/url]",
prefix: UNACCEPT_PREFIX,
status: false,
},
{
title: 'Не по форме',
content:
'[SIZE=4][FONT=Verdana][COLOR=red][CENTER][B]{{ greeting }}, уважаемый[/color]{{ user.mention }}!<br>'+
"[url=https://postimages.org/][img]https://i.postimg.cc/0QWKPkN2/image.png[/img][/url]<br>"+
"Ваша Role Play биография создана не по форме. <br>[color=red]Заголовок:[/color] «RolePlay биография гражданина Имя Фамилия.»<br>[color=red]Форма самой биографии[/color]:<br>Имя Фамилия<br>Пол:<br>Национальность:<br>Возраст:<br>Дата и место рождения:<br>Семья:<br>Место текущего проживания:<br>Описание внешности:<br>Особенности характера:<br>(От сюда требуется расписать каждый из пунктов) Детство:<br>Юность и взрослая жизнь:<br>Настоящее время:<br>Хобби:<br>"+
"[url=https://postimages.org/][img]https://i.postimg.cc/0QWKPkN2/image.png[/img][/url]<br>"+
"[url=http://x-lines.ru/][img]http://x-lines.ru/letters/i/cyrillicgothic/1066/f70810/20/1/rdej7wfn4nppbrgo19ejbwr74nxy.png[/img][/url]",
prefix: UNACCEPT_PREFIX,
status: false,
},
{
title: 'Не исправил ошибки',
content:
'[SIZE=4][FONT=Verdana][COLOR=red][CENTER][B]{{ greeting }}, уважаемый[/color]{{ user.mention }}!<br>'+
"[url=https://postimages.org/][img]https://i.postimg.cc/0QWKPkN2/image.png[/img][/url]<br>"+
"Вы не исправили вышеперечисленные ошибки.<br>"+
"[url=https://postimages.org/][img]https://i.postimg.cc/0QWKPkN2/image.png[/img][/url]<br>"+
"[url=http://x-lines.ru/][img]http://x-lines.ru/letters/i/cyrillicgothic/1066/f70810/20/1/rdej7wfn4nppbrgo19ejbwr74nxy.png[/img][/url]",
prefix: UNACCEPT_PREFIX,
status: false,
},
{
title: 'Нет 18 нет',
content:
'[SIZE=4][FONT=Verdana][COLOR=red][CENTER][B]{{ greeting }}, уважаемый[/color]{{ user.mention }}!<br>'+
"[url=https://postimages.org/][img]https://i.postimg.cc/0QWKPkN2/image.png[/img][/url]<br>"+
"В Вашей Role Play биографии возраст Вашего персонажа меньше 18-ти лет.<br>"+
"[url=https://postimages.org/][img]https://i.postimg.cc/0QWKPkN2/image.png[/img][/url]<br>"+
"[url=http://x-lines.ru/][img]http://x-lines.ru/letters/i/cyrillicgothic/1066/f70810/20/1/rdej7wfn4nppbrgo19ejbwr74nxy.png[/img][/url]",
prefix: UNACCEPT_PREFIX,
status: false,
},
{
title: '2-ая биография на аккаунте',
content:
'[SIZE=4][FONT=Verdana][COLOR=red][CENTER][B]{{ greeting }}, уважаемый[/color]{{ user.mention }}!<br>'+
"[url=https://postimages.org/][img]https://i.postimg.cc/0QWKPkN2/image.png[/img][/url]<br>"+
"У Вас уже есть Role Play биография. Вторую создавать на аккаунте - [color=red]запрещено[/color].<br>"+
"[url=https://postimages.org/][img]https://i.postimg.cc/0QWKPkN2/image.png[/img][/url]<br>"+
"[url=http://x-lines.ru/][img]http://x-lines.ru/letters/i/cyrillicgothic/1066/f70810/20/1/rdej7wfn4nppbrgo19ejbwr74nxy.png[/img][/url]",
prefix: UNACCEPT_PREFIX,
status: false,
},
{
title: 'Супер-способности',
content:
'[SIZE=4][FONT=Verdana][COLOR=red][CENTER][B]{{ greeting }}, уважаемый[/color]{{ user.mention }}!<br>'+
"[url=https://postimages.org/][img]https://i.postimg.cc/0QWKPkN2/image.png[/img][/url]<br>"+
"Запрещено приписывание своему персонажу супер-способностей.<br>"+
"[url=https://postimages.org/][img]https://i.postimg.cc/0QWKPkN2/image.png[/img][/url]<br>"+
"[url=http://x-lines.ru/][img]http://x-lines.ru/letters/i/cyrillicgothic/1066/f70810/20/1/rdej7wfn4nppbrgo19ejbwr74nxy.png[/img][/url]",
prefix: UNACCEPT_PREFIX,
status: false,
},
{
title: 'Религ или нац взг / высказ',
content:
'[SIZE=4][FONT=Verdana][COLOR=red][CENTER][B]{{ greeting }}, уважаемый[/color]{{ user.mention }}!<br>'+
"[url=https://postimages.org/][img]https://i.postimg.cc/0QWKPkN2/image.png[/img][/url]<br>"+
"Запрещена пропаганда религиозных или националистических взглядов или высказываний.<br>"+
"[url=https://postimages.org/][img]https://i.postimg.cc/0QWKPkN2/image.png[/img][/url]<br>"+
"[url=http://x-lines.ru/][img]http://x-lines.ru/letters/i/cyrillicgothic/1066/f70810/20/1/rdej7wfn4nppbrgo19ejbwr74nxy.png[/img][/url]",
prefix: UNACCEPT_PREFIX,
status: false,
},
 
 
]
 
 
$(document).ready(() => {
// Загрузка скрипта для обработки шаблонов
$('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');
 
// Добавление кнопок при загрузке страницы
 
 
addButton('На рассмотрение', 'pin', 'border-radius: 11px; margin-right: 4px; border: 2px solid; border-color: rgb(255, 173, 51, 0.5);');
addButton('Одобрено', 'accepted', 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(76, 175, 80, 0.5);');
addButton('Отказано', 'unaccept', 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(211, 47, 47, 0.5);');
addButton('Закрыто', 'Zakrito', 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(211, 47, 47, 0.5);');
addButton('ГА', 'GA', 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(211, 47, 47, 0.5);');
addButton('Теху', 'TEXU_PREFIX', 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(0, 0, 255, 0.5);');
addButton('Ответы', 'selectAnswer');

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