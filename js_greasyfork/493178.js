// ==UserScript==
// @name         Скрипт для згс\гс ARKHANGELSK
// @namespace    по вопросам - https://vk.com/santaplend
// @version      0.01
// @description  server 56
// @author       Santa Aplend
// @match        https://forum.blackrussia.online/threads/*
// @include      https://forum.blackrussia.online/threads/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=greasyfork.org
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/493178/%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%B7%D0%B3%D1%81%5C%D0%B3%D1%81%20ARKHANGELSK.user.js
// @updateURL https://update.greasyfork.org/scripts/493178/%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%B7%D0%B3%D1%81%5C%D0%B3%D1%81%20ARKHANGELSK.meta.js
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
const TEX_PREFIX = 13;
const CLOSE_PREFIX = 7;
const buttons = [


{
title: '-----------------------------------------------------------------------Одобрения-----------------------------------------------------------------------',
},
{
title: 'Беседа с лд',
content:
'[CENTER][COLOR=AQUA][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR]<br><br>'+
"[CENTER][SIZE=5][FONT=times new roman]С лидером будет проведена профилактическая беседа.<br> благодарим за обращение![/FONT]<br><br>"+
"[COLOR=lime] [FONT=georgia]Одобрено [/FONT][/COLOR][/SIZE][/CENTER]",
  prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
title: 'Необходимые меры(пред)',
content:
'[CENTER][COLOR=AQUA][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR]<br><br>' +
 "[CENTER][SIZE=5][FONT=times new roman] В сторону лидера будут приняты необходимые меры.<br> благодарим за обращение![/FONT]<br><br>"+
"[COLOR=lime] [FONT=georgia]Одобрено [/FONT][/COLOR][/SIZE][/CENTER]",
prefix: ACCEPT_PREFIX,
status: false,
},
{
title: 'Строгая беседа (выг)',
content:
'[CENTER][COLOR=AQUA][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR]<br><br>' +
"[B][URL='https://ibb.co/51gRYCr'][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/URL][/B]<br>"+
"[CENTER][SIZE=5][FONT=times new roman] C лидером будет проведена строгая профилактическая беседа.<br><br> благодарим за обращение![/FONT]<br><br>"+
"[COLOR=lime] [FONT=georgia]Одобрено [/FONT][/COLOR][/SIZE][/CENTER]"+
"[B][URL='https://ibb.co/51gRYCr'][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/URL][/B][/CENTER]<br>",
prefix: ACCEPT_PREFIX,
status: false,
},
    {
title: '--------------------------------------------------------------------------Отказы--------------------------------------------------------------------------',
},
{
    title: 'Нет доква',
content:
'[CENTER][COLOR=AQUA][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR]<br>' +
"[B][URL='https://ibb.co/51gRYCr'][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/URL][/B]<br><br>"+
   "[CENTER][SIZE=5][FONT=times new roman]  В вашей жалобе отсутвуют доказательства[/FONT]<br><br>"+
    "[COLOR=red] Отказано [/COLOR]"+
"[B][URL='https://ibb.co/51gRYCr'][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/URL][/CENTER][/B]<br><br>" ,
prefix: UNACCEPT_PREFIX,
status: false,
},
{
title: 'Отсутствуют док-ва',
content:
'[CENTER][COLOR=AQUA][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR]<br>' +
"[B][URL='https://ibb.co/51gRYCr'][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/URL][/B]<br><br>"+
    "[COLOR=rgb(209, 213, 216)][SIZE=4][FONT=times new roman][I]Отсутствуют доказательства - следовательно, рассмотрению не подлежит. Загрузите доказательства на фото-видео хостинги YouTube, Imgur, Yapx и так далее.[/I][/FONT][/SIZE]<br><br>" +
"[I][FONT=times new roman][SIZE=4]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/SIZE][/FONT][/I][/COLOR]<br><br>" +
"[B][CENTER][COLOR=red][ICODE]Отказано[/ICODE][/COLOR][/B]<br><br>" +
"[B][URL='https://ibb.co/51gRYCr'][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/URL][/CENTER][/B]<br><br>" ,
prefix: UNACCEPT_PREFIX,
status: false,
},
{
title: 'Док-ва в соц. сетях',
content:
'[CENTER][COLOR=AQUA][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR]<br>' +
"[B][URL='https://ibb.co/51gRYCr'][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/URL][/B]<br><br>"+
    "[COLOR=rgb(209, 213, 216)][SIZE=4][FONT=times new roman][I]Доказательства в социальных сетях и т.д. не принимаются. Загрузите доказательства на фото-видео хостинги YouTube,Imgur, Yapx и так далее.[/I][/FONT][/SIZE]<br><br>" +
"[FONT=times new roman][SIZE=4][I]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/I][/SIZE][/FONT][/COLOR]<br><br>" +
"[B][CENTER][COLOR=red][ICODE]Отказано[/ICODE][/COLOR][/B]<br><br>" +
"[B][URL='https://ibb.co/51gRYCr'][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/URL][/CENTER][/B]<br><br>" ,
prefix: UNACCEPT_PREFIX,
status: false,
},
{
title: 'Нарушений нет',
content:
'[CENTER][COLOR=AQUA][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR]<br>' +
"[B][URL='https://ibb.co/51gRYCr'][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/URL][/B]<br><br>"+
"[COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4][I]Нарушений со стороны игрока не было замечено.<br><br>" +
"Внимательно изучите общие правила серверов - [/I][URL='https://forum.blackrussia.online/index.php?threads/Общие-правила-серверов.312571/']*Нажмите сюда*[/URL]<br><br>" +
"[I]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/I][/SIZE][/FONT][/COLOR]<br><br>" +
"[B][CENTER][COLOR=red][ICODE]Отказано[/ICODE][/COLOR][/B]<br><br>" +
"[B][URL='https://ibb.co/51gRYCr'][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/URL][/CENTER][/B]<br><br>" ,
status: false,
},
{
title: 'Нет time',
content:
'[CENTER][COLOR=AQUA][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR]<br>' +
"[B][URL='https://ibb.co/51gRYCr'][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/URL][/B]<br><br>"+
    "[COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4][I]На доказательствах отсутствуют дата и время [/I]([/SIZE][/FONT][FONT=courier new][SIZE=4]/time[/SIZE][/FONT][FONT=times new roman][SIZE=4])[I] - следовательно, рассмотрению не подлежит.<br><br>" +
"Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/I][/SIZE][/FONT][/COLOR]<br><br>" +
"[B][CENTER][COLOR=red][ICODE]Отказано[/ICODE][/COLOR][/B]<br><br>" +
"[B][URL='https://ibb.co/51gRYCr'][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/URL][/CENTER][/B]<br><br>" ,
prefix: UNACCEPT_PREFIX,
status: false,
},
{
title: 'Док-ва отредакт',
content:
'[CENTER][COLOR=AQUA][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR]<br>' +
"[B][URL='https://ibb.co/51gRYCr'][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/URL][/B]<br><br>"+
    "[COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4][I]Доказательства были подвергнуты редактированию - следовательно, рассмотрению не подлежит.<br><br>" +
"Загрузите оригиналы видеозаписи/скриншотов, создав новую тему в данном разделе.<br><br>" +
"Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/I][/SIZE][/FONT][/COLOR]<br><br>" +
"[B][CENTER][COLOR=red][ICODE]Отказано[/ICODE][/COLOR][/B]<br><br>" +
"[B][URL='https://ibb.co/51gRYCr'][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/URL][/CENTER][/B]<br><br>" ,
prefix: UNACCEPT_PREFIX,
status: false,
},
{
title: 'Док-ва обрываются',
content:
'[CENTER][COLOR=AQUA][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR]<br>' +
"[B][URL='https://ibb.co/51gRYCr'][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/URL][/B]<br><br>"+
    "[COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4][I]Ваша видеозапись обрывается. Загрузите полную видеозапись на видео-хостинг YouTube.<br><br>" +
"Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/I][/SIZE][/FONT][/COLOR]<br><br>" +
"[B][CENTER][COLOR=red][ICODE]Отказано[/ICODE][/COLOR][/B]<br><br>" +
"[B][URL='https://ibb.co/51gRYCr'][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/URL][/CENTER][/B]<br><br>" ,
prefix: UNACCEPT_PREFIX,
status: false,
},
{
title : 'Некорректный текст оск мат' ,
content:
'[CENTER][COLOR=AQUA][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR]<br>' +
"[B][URL='https://ibb.co/51gRYCr'][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/URL][/B]<br><br>"+
    "[COLOR=rgb(209, 213, 216)][SIZE=4][FONT=times new roman][I]В вашей жалобе присутствует некорректный текст.[/FONT][/SIZE]<br><br>" +
"[FONT=times new roman][SIZE=4][I]Просьба не создавать дубликаты этой темы, иначе ваш форумный аккаунт может быть заблокирован.[/I][/SIZE][/FONT][/COLOR]<br> <br>" +
"[B][CENTER][COLOR=red][ICODE]Отказано[/ICODE][/COLOR][/B]<br><br>" +
"[B][URL='https://ibb.co/51gRYCr'][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/URL][/CENTER][/B]<br><br>",
prefix: UNACCEPT_PREFIX,
status: false,
},
{
title : 'Нет таймкодов' ,
content:
'[CENTER][COLOR=AQUA][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR]<br>' +
"[B][URL='https://ibb.co/51gRYCr'][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/URL][/B]<br><br>"+
    "[COLOR=rgb(209, 213, 216)][SIZE=4][FONT=times new roman][I]Ваша жалоба отказана, т.к в ней нету таймкодов. Если видео длится больше 3-ех минут - Вы должны указать таймкоды нарушений.[/FONT][/SIZE]<br><br>" +
"[FONT=times new roman][SIZE=4][I]Просьба не создавать дубликаты этой темы, иначе ваш форумный аккаунт может быть заблокирован.[/I][/SIZE][/FONT][/COLOR]<br> <br>" +
"[B][CENTER][COLOR=red][ICODE]Отказано[/ICODE][/COLOR][/B]<br><br>" +
"[B][URL='https://ibb.co/51gRYCr'][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/URL][/CENTER][/B]<br><br>" ,
prefix: UNACCEPT_PREFIX,
status: false,
},
{
title : 'прошло 3 дня' ,
content:
'[CENTER][COLOR=AQUA][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR]<br>' +
"[B][URL='https://ibb.co/51gRYCr'][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/URL][/B]<br><br>"+
    "[COLOR=rgb(209, 213, 216)][SIZE=4][FONT=times new roman][I]Ваша жалоба отказана, т.к с момента нарушения прошло более 72-ух часов.[/FONT][/SIZE]<br><br>" +
"[FONT=times new roman][SIZE=4][I]Просьба не создавать дубликаты этой темы, иначе ваш форумный аккаунт может быть заблокирован.[/I][/SIZE][/FONT][/COLOR]<br> <br>" +
"[B][CENTER][COLOR=red][ICODE]Отказано[/ICODE][/COLOR][/B]<br><br>" +
"[B][URL='https://ibb.co/51gRYCr'][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/URL][/CENTER][/B]<br><br>" ,
},
{
title : 'от 3-его лица' ,
content:
'[CENTER][COLOR=AQUA][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR]<br>' +
"[B][URL='https://ibb.co/51gRYCr'][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/URL][/B]<br><br>"+
    "[COLOR=rgb(209, 213, 216)][SIZE=4][FONT=times new roman][I]Ваша жалоба отказана, т.к она написана от 3-его лица.[/FONT][/SIZE]<br><br>" +
"[FONT=times new roman][SIZE=4][I]Просьба не создавать дубликаты этой темы, иначе ваш форумный аккаунт может быть заблокирован.[/I][/SIZE][/FONT][/COLOR]<br> <br>" +
"[B][CENTER][COLOR=red][ICODE]Отказано[/ICODE][/COLOR][/B]<br><br>" +
"[B][URL='https://ibb.co/51gRYCr'][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/URL][/CENTER][/B]<br><br>" ,
prefix: UNACCEPT_PREFIX,
status: false,
},
{
title : 'уже был ответ' ,
content:
'[CENTER][COLOR=AQUA][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR]<br>' +
"[B][URL='https://ibb.co/51gRYCr'][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/URL][/B]<br><br>"+
    "[COLOR=rgb(209, 213, 216)][SIZE=4][FONT=times new roman][I]Ваша жалоба отказана, т.к ранее уже был дан ответ.[/FONT][/SIZE]<br><br>" +
"[FONT=times new roman][SIZE=4][I]Просьба не создавать дубликаты этой темы, иначе ваш форумный аккаунт может быть заблокирован.[/I][/SIZE][/FONT][/COLOR]<br> <br>" +
"[B][CENTER][COLOR=red][ICODE]Отказано[/ICODE][/COLOR][/B]<br><br>" +
"[B][URL='https://ibb.co/51gRYCr'][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/URL][/CENTER][/B]<br><br>" ,
prefix: UNACCEPT_PREFIX,
status: false,
},
{
title : 'уже был наказан' ,
content:
'[CENTER][COLOR=AQUA][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR]<br>' +
"[B][URL='https://ibb.co/51gRYCr'][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/URL][/B]<br><br>"+
    "[COLOR=rgb(209, 213, 216)][SIZE=4][FONT=times new roman][I]Ваша жалоба отказана, т.к нарушитель уже был наказан ранее.[/FONT][/SIZE]<br><br>" +
"[FONT=times new roman][SIZE=4][I]Просьба не создавать дубликаты этой темы, иначе ваш форумный аккаунт может быть заблокирован.[/I][/SIZE][/FONT][/COLOR]<br> <br>" +
"[B][CENTER][COLOR=red][ICODE]Отказано[/ICODE][/COLOR][/B]<br><br>" +
"[B][URL='https://ibb.co/51gRYCr'][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/URL][/CENTER][/B]<br><br>" ,
prefix: UNACCEPT_PREFIX,
status: false,
},
{
title: 'Не по форме',
content:
'[CENTER][COLOR=AQUA][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR]<br>' +
"[B][URL='https://ibb.co/51gRYCr'][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/URL][/B]<br><br>"+
    "[COLOR=rgb(209, 213, 216)][SIZE=4][FONT=times new roman][I]Ваша жалоба составлена не по форме. Внимательно прочитайте правила подачи жалоб на игроков, закрепленные в этом разделе.[/I][/FONT][/SIZE]<br><br>" +
"[FONT=times new roman][SIZE=4][I]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/I][/SIZE][/FONT][/COLOR]<br><br>" +
"[B][CENTER][COLOR=red][ICODE]Отказано[/ICODE][/COLOR][/B]<br><br>" +
"[B][URL='https://ibb.co/51gRYCr'][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/URL][/CENTER][/B]<br><br>" ,
prefix: UNACCEPT_PREFIX,
status: false,
},
{
title: 'Нет доступа',
content:
'[CENTER][COLOR=AQUA][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR]<br>' +
"[B][URL='https://ibb.co/51gRYCr'][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/URL][/B]<br><br>"+
    "[COLOR=rgb(209, 213, 216)][SIZE=4][FONT=times new roman][I]Ваши доказательства не доступны к просмотру. Загрузите доказательства на фото-видео хостинги YouTube,Imgur, Yapx и так далее.[/I][/FONT][/SIZE]<br><br>" +
"[FONT=times new roman][SIZE=4][I]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/I][/SIZE][/FONT][/COLOR]<br><br>" +
"[B][CENTER][COLOR=red][ICODE]Отказано[/ICODE][/COLOR][/B]<br><br>" +
"[B][URL='https://ibb.co/51gRYCr'][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/URL][/CENTER][/B]<br><br>" ,
prefix: UNACCEPT_PREFIX,
status: false,
},
{
title: 'Жб на сотрудников',
content:
'[CENTER][COLOR=AQUA][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR]<br>' +
"[B][URL='https://ibb.co/51gRYCr'][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/URL][/B]<br><br>"+
    "[COLOR=rgb(209, 213, 216)][SIZE=4][FONT=times new roman][I]Напишите вашу жалобу в раздел 'Жалобы на сотрудников'. [/I][/FONT][/SIZE]<br><br>" +
"[FONT=times new roman][SIZE=4][I]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/I][/SIZE][/FONT][/COLOR]<br><br>" +
"[B][CENTER][COLOR=red][ICODE]Отказано[/ICODE][/COLOR][/B]<br><br>" +
"[B][URL='https://ibb.co/51gRYCr'][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/URL][/CENTER][/B]<br><br>" ,
prefix: UNACCEPT_PREFIX,
status: false,
},
{
title: 'В ЖБ на адм',
content:
'[CENTER][COLOR=AQUA][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR]<br>' +
"[B][URL='https://ibb.co/51gRYCr'][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/URL][/B]<br><br>"+
    "[COLOR=rgb(209, 213, 216)][SIZE=4][FONT=times new roman][I]Вы ошиблись разделом, обратитесь в раздел жалоб на администрацию - [/I][URL='https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B0%D0%B4%D0%BC%D0%B8%D0%BD%D0%B8%D1%81%D1%82%D1%80%D0%B0%D1%86%D0%B8%D1%8E.842/']*Нажмите сюда*[/URL][/FONT][/SIZE]<br><br>" +
"[FONT=times new roman][SIZE=4][I]Просьба не создавать дубликаты данной темы в этом разделе, иначе ваш форумный аккаунт может быть заблокирован.[/I][/SIZE][/FONT][/COLOR]<br><br>" +
"[B][CENTER][COLOR=red][ICODE]Отказано[/ICODE][/COLOR][/B]<br><br>" +
"[B][URL='https://ibb.co/51gRYCr'][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/URL][/CENTER][/B]<br><br>" ,
prefix: UNACCEPT_PREFIX,
status: false,
},
{
title: 'Нужен фрапс',
content:
'[CENTER][COLOR=AQUA][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR]<br>' +
"[B][URL='https://ibb.co/51gRYCr'][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/URL][/B]<br><br>"+
"[COLOR=rgb(209, 213, 216)][SIZE=4][FONT=times new roman][I]Для рассмотрения вашей жалобы нужно видео-доказательство. [/I][/FONT][/SIZE]<br><br>" +
"[FONT=times new roman][SIZE=4][I]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/I][/SIZE][/FONT][/COLOR]<br><br>" +
"[B][CENTER][COLOR=red][ICODE]Отказано[/ICODE][/COLOR][/B]<br><br>" +
"[B][URL='https://ibb.co/51gRYCr'][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/URL][/CENTER][/B]<br><br>" ,
prefix: UNACCEPT_PREFIX,
status: false,
},
   {

	  title: '------------------------------------------------Ниже Рассмотрение/передача в другой раздел-----------------------------------'

	    	},

	    {
	  title: '| На рассмотрение |',
	  content:
		'[CENTER]Приветствую уважаемый  {{ user.name }} <br>'+
"[COLOR=rgb(247, 218, 100)][FONT=times new roman]Ваша жалоба взята на рассмотрение, просьба не создавать дубликатов.[/FONT][/COLOR]<br><br>"+

"[COLOR=rgb(250, 197, 28)][FONT=times new roman][I]На расмотрении..[/I][/FONT][/COLOR][/CENTER]"+
            "[CENTER][IMG]https://i.ibb.co/6BJj94d/3-W72119s5-Bj-WMGm4-Xa2-Mv-D5-AT2b-Js-SA8-F9-We-C71v1s1f-Kf-Gk-K9m-MKuc3-Lcv-F4-Kigb-Wg9-Usrp-EPG8-Z.png[/IMG][/CENTER]",

   prefix: PIN_PREFIX,
	  status: true,
	},
	    {
	  title: '|Для ЗГКФ/ГКФ |',
	  content:
		'[CENTER][COLOR=AQUA][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR]<br>' +
"[B][URL='https://ibb.co/51gRYCr'][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/URL][/B]<br><br>"+

		"[B][COLOR=rgb(209, 213, 216)][I][FONT=times new roman][SIZE=4]Ваша жалоба переадресована [/SIZE][/FONT][/COLOR][I][FONT=times new roman][SIZE=4][COLOR=REd]ЗГКФ/ГКФ[/SIZE][/FONT][/I][/COLOR][I]<br>"+
"[B][CENTER][COLOR=rgb(209, 213, 216)]Пожалуйста не создавайте дубликатов. Ожидайте ответа.[/COLOR][/B]<br>"+
		      "[B][URL='https://ibb.co/51gRYCr'][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/URL][/B][/CENTER]<br>",

	  prefix: PIN_PREFIX,

	  status: true,

	},

	{

	  title: '| Передать Тех |',

	  content:

		'[CENTER][COLOR=AQUA][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR]<br>' +
"[B][URL='https://ibb.co/51gRYCr'][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/URL][/B]<br><br>"+
		"[B][CENTER]Ваша жалоба была передана Техническому специалисту сервера. @Vadim Laimov Ожидайте ответа.<br>"+

"[B][URL='https://ibb.co/51gRYCr'][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/URL][/B][/CENTER]<br>",
	  prefix: TEX_PREFIX,

	  status: true,

	},
  {
title: '--------------------------------------------------------------------РП БИО-----------------------------------------------------------------------------',
},
{
title: 'Одобрена',
content:
'[CENTER][COLOR=AQUA][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR]<br>' +
"[B][URL='https://ibb.co/51gRYCr'][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/URL][/B]<br>"+
    "[SIZE=4][FONT=times new roman][I][COLOR=rgb(209, 213, 216)]Ваша RolePlay - биография одобрена.[/COLOR][/I][/FONT][/SIZE]<br><br>" ,
prefix: ACCEPT_PREFIX,
status: false,
},
{
title: 'Отказана',
content:
'[CENTER][COLOR=AQUA][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR]<br>' +
"[B][URL='https://ibb.co/51gRYCr'][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/URL][/B]<br>"+
    "[SIZE=4][FONT=times new roman][I][COLOR=rgb(209, 213, 216)]Ваша RolePlay - биография отказана.[/COLOR]<br><br>" +
"[COLOR=rgb(209, 213, 216)]Внимательно прочитайте правила создания RP - биографий закрепленные в данном разделе [/COLOR][/I][COLOR=rgb(209, 213, 216)][/COLOR][/FONT][/SIZE]<br><br>" ,
prefix: UNACCEPT_PREFIX,
status: false,
},
{
title : 'Заголовок не по форме' ,
content:
'[CENTER][COLOR=AQUA][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR]<br>' +
"[B][URL='https://ibb.co/51gRYCr'][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/URL][/B]<br>"+
    "[SIZE=4][FONT=times new roman][I][COLOR=rgb(209, 213, 216)]Ваша RolePlay - биография отказана т.к заголовок оформлен неправильно. [/COLOR]<br><br>" +
"[COLOR=rgb(209, 213, 216)]Внимательно прочитайте правила создания RP - биографий закрепленные в данном разделе [/COLOR][/I][COLOR=rgb(209, 213, 216)][/COLOR][/FONT][/SIZE]<br><br>" ,
prefix: UNACCEPT_PREFIX,
status: false,
},
{
title : 'Не по форме' ,
content:
'[CENTER][COLOR=AQUA][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR]<br>' +
"[B][URL='https://ibb.co/51gRYCr'][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/URL][/B]<br>"+
    "[SIZE=4][FONT=times new roman][I][COLOR=rgb(209, 213, 216)]Ваша RolePlay - биография отказана т.к она составлена не по форме. [/COLOR]<br><br>" +
"[COLOR=rgb(209, 213, 216)]Внимательно прочитайте правила создания RP - биографий закрепленные в данном разделе [/COLOR][/I][COLOR=rgb(209, 213, 216)][/COLOR][/FONT][/SIZE]<br><br>" ,
prefix: UNACCEPT_PREFIX,
status: false,
},
{
title : 'Не дополнил' ,
content:
'[CENTER][COLOR=AQUA][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR]<br>' +
"[B][URL='https://ibb.co/51gRYCr'][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/URL][/CENTER][/B]<br><br>"+
    "[SIZE=4][FONT=times new roman][I][COLOR=rgb(209, 213, 216)]Ваша RolePlay - биография отказана т.к вы ее не дополнили. [/COLOR]<br><br>" +
"[COLOR=rgb(209, 213, 216)]Внимательно прочитайте правила создания RP - биографий закрепленные в данном разделе [/COLOR][/I][COLOR=rgb(209, 213, 216)][/COLOR][/FONT][/SIZE]<br><br>" ,

prefix: UNACCEPT_PREFIX,
status: false,
},
{
title : 'Неграмотная' ,
content:
'[CENTER][COLOR=AQUA][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR]<br>' +
"[B][URL='https://ibb.co/51gRYCr'][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/URL][/B]<br>"+
    "[SIZE=4][FONT=times new roman][I][COLOR=rgb(209, 213, 216)]Ваша RolePlay - биография отказана т.к она оформлена неграмотно. [/COLOR]<br><br>" +
"[COLOR=rgb(209, 213, 216)]Внимательно прочитайте правила создания RP - биографий закрепленные в данном разделе [/COLOR][/I][COLOR=rgb(209, 213, 216)][/COLOR][/FONT][/SIZE]<br><br>" ,
prefix: UNACCEPT_PREFIX,
status: false,
},
{
title : 'От 3-его лица' ,
content:
'[CENTER][COLOR=AQUA][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR]<br>' +
"[B][URL='https://ibb.co/51gRYCr'][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/URL][/B]<br>"+
    "[SIZE=4][FONT=times new roman][I][COLOR=rgb(209, 213, 216)]Ваша RolePlay - биография отказана т.к она написана от 3-его лица. [/COLOR]<br><br>" +
"[COLOR=rgb(209, 213, 216)]Внимательно прочитайте правила создания RP - биографий закрепленные в данном разделе [/COLOR][/I][COLOR=rgb(209, 213, 216)][/COLOR][/FONT][/SIZE]<br><br>" ,
prefix: UNACCEPT_PREFIX,
status: false,
},
{
title : 'Уже одобрена' ,
content:
'[CENTER][COLOR=AQUA][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR]<br>' +
"[B][URL='https://ibb.co/51gRYCr'][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/URL][/B]<br>"+
    "[SIZE=4][FONT=times new roman][I][COLOR=rgb(209, 213, 216)]Ваша RolePlay - биография отказана т.к она уже была одобрена. [/COLOR]<br><br>" ,
prefix: UNACCEPT_PREFIX,
status: false,
},
{
title : 'Супергерой' ,
content:
'[CENTER][COLOR=AQUA][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR]<br>' +
"[B][URL='https://ibb.co/51gRYCr'][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/URL][/B]<br>"+
    "[SIZE=4][FONT=times new roman][I][COLOR=rgb(209, 213, 216)]Ваша RolePlay - биография отказана т.к вы приписали суперспособности своему персонажу. [/COLOR]<br><br>" +
"[COLOR=rgb(209, 213, 216)]Внимательно прочитайте правила создания RP - биографий закрепленные в данном разделе [/COLOR][/I][COLOR=rgb(209, 213, 216)][/COLOR][/FONT][/SIZE]<br><br>" ,
prefix: UNACCEPT_PREFIX,
status: false,
},
{
title : 'Копипаст' ,
content:
'[CENTER][COLOR=AQUA][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR]<br>' +
"[B][URL='https://ibb.co/51gRYCr'][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/URL][/B]<br>"+
    "[SIZE=4][FONT=times new roman][I][COLOR=rgb(209, 213, 216)]Ваша RolePlay - биография отказана т.к вы ее скопировали у другого человека. [/COLOR]<br><br>" +
"[COLOR=rgb(209, 213, 216)]Внимательно прочитайте правила создания RP - биографий закрепленные в данном разделе [/COLOR][/I][COLOR=rgb(209, 213, 216)][/COLOR][/FONT][/SIZE]<br><br>" ,
prefix: UNACCEPT_PREFIX,
status: false,
 },
{
title : 'нонрп ник' ,
content:
'[CENTER][COLOR=AQUA][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR]<br>' +
"[B][URL='https://ibb.co/51gRYCr'][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/URL][/B]<br>"+

    "[SIZE=4][FONT=times new roman][I][COLOR=rgb(209, 213, 216)]Ваша RolePlay - биография отказана т.к у вас NonRP NickName. [/COLOR]<br><br>" +
"[COLOR=rgb(209, 213, 216)]Внимательно прочитайте правила создания RP - биографий закрепленные в данном разделе [/COLOR][/I][COLOR=rgb(209, 213, 216)][/COLOR][/FONT][/SIZE]<br><br>" ,
prefix: UNACCEPT_PREFIX,
status: false,
},
{
title : 'ник англ' ,
content:
'[CENTER][COLOR=AQUA][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR]<br>' +
"[B][URL='https://ibb.co/51gRYCr'][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/URL][/B]<br>"+
    "[SIZE=4][FONT=times new roman][I][COLOR=rgb(209, 213, 216)]Ваша RolePlay - биография отказана т.к ваш NickName должен быть написан на русском языке. [/COLOR]<br><br>" +
"[COLOR=rgb(209, 213, 216)]Внимательно прочитайте правила создания RP - биографий закрепленные в данном разделе [/COLOR][/I][COLOR=rgb(209, 213, 216)][/COLOR][/FONT][/SIZE]<br><br>" ,
prefix: UNACCEPT_PREFIX,
status: false,
},
{
title : 'дата рождения с годом' ,
content:
'[CENTER][COLOR=AQUA][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR]<br>' +
"[B][URL='https://ibb.co/51gRYCr'][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/URL][/B]<br>"+
    "[SIZE=4][FONT=times new roman][I][COLOR=rgb(209, 213, 216)]Ваша RolePlay - биография отказана т.к дата рождения не совпадает с возрастом. [/COLOR]<br><br>" +
"[COLOR=rgb(209, 213, 216)]Внимательно прочитайте правила создания RP - биографий закрепленные в данном разделе [/COLOR][/I][COLOR=rgb(209, 213, 216)][/COLOR][/FONT][/SIZE]<br><br>" ,
prefix: UNACCEPT_PREFIX,
status: false,
},
{
title : 'семья не полнос.' ,
content:
'[CENTER][COLOR=AQUA][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR]<br>' +
"[B][URL='https://ibb.co/51gRYCr'][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/URL][/B]<br>"+
    "[SIZE=4][FONT=times new roman][I][COLOR=rgb(209, 213, 216)]Ваша RolePlay - биография отказана т.к ваша семья расписана не полностью. [/COLOR]<br><br>" +
"[COLOR=rgb(209, 213, 216)]Внимательно прочитайте правила создания RP - биографий закрепленные в данном разделе [/COLOR][/I][COLOR=rgb(209, 213, 216)][/COLOR][/FONT][/SIZE]<br><br>" ,
prefix: UNACCEPT_PREFIX,
status: false,
},
{
title : 'дата рождения не полнос.' ,
content:
'[CENTER][COLOR=AQUA][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR]<br>' +
"[B][URL='https://ibb.co/51gRYCr'][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/URL][/B]<br>"+
    "[SIZE=4][FONT=times new roman][I][COLOR=rgb(209, 213, 216)]Ваша RolePlay - биография отказана т.к ваша дата рождения расписана не полностью. [/COLOR]<br><br>" +
"[COLOR=rgb(209, 213, 216)]Внимательно прочитайте правила создания RP - биографий закрепленные в данном разделе [/COLOR][/I][COLOR=rgb(209, 213, 216)][/COLOR][/FONT][/SIZE]<br><br>" ,
prefix: UNACCEPT_PREFIX,
status: false,
},
{
title: 'На доработке',
content:
'[CENTER][COLOR=AQUA][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR]<br>' +
"[B][URL='https://ibb.co/51gRYCr'][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/URL][/B]<br>"+
    "[COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4][I]В вашей RolePlay - биографии недостаточно информации.<br><br>" +
"Даю вам 24 часа на ее дополнение.[/I][/SIZE][/FONT][/COLOR]<br><br>" ,
prefix: PIN_PREFIX,
status: true,
},
{
title: '--------------------------------------------------------------------РП Организации--------------------------------------------------------------------'
},
{
title: 'одобрено',
content:
'[CENTER][COLOR=AQUA][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR]<br>' +
"[B][URL='https://ibb.co/51gRYCr'][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/URL][/B]<br>"+
    "[SIZE=4][FONT=times new roman][I][COLOR=rgb(209, 213, 216)]Ваша RolePlay - организация одобрена.[/COLOR][/I][/FONT][/SIZE]<br><br>" ,
prefix: ACCEPT_PREFIX,
status: false,

},
{
title : 'не туда' ,
content:
'[CENTER][COLOR=AQUA][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR]<br>' +
"[B][URL='https://ibb.co/51gRYCr'][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/URL][/B]<br>"+
    "[SIZE=4][FONT=times new roman][I][COLOR=rgb(209, 213, 216)]Ваша RolePlay - организация отказана т.к вы не туда попали. [/COLOR]<br><br>" ,
prefix: UNACCEPT_PREFIX,
status: false,
},
{
title : 'не по форме' ,
content:
'[CENTER][COLOR=AQUA][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR]<br>' +
"[B][URL='https://ibb.co/51gRYCr'][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/URL][/B]<br>"+
    "[SIZE=4][FONT=times new roman][I][COLOR=rgb(209, 213, 216)]Ваша RolePlay - организация отказана т.к она составлена не по форме. [/COLOR]<br><br>",
prefix: UNACCEPT_PREFIX,
status: false,
},
{
title : 'отказ' ,
content:
'[CENTER][COLOR=AQUA][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR]<br>' +
"[B][URL='https://ibb.co/51gRYCr'][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/URL][/B]<br>"+
    "[SIZE=4][FONT=times new roman][I][COLOR=rgb(209, 213, 216)]Ваша RolePlay - организация отказана. [/COLOR]<br><br>" ,
prefix: UNACCEPT_PREFIX,
status: false,
},
{
title: 'На доработке',
content:
'[CENTER][COLOR=AQUA][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR]<br>' +
"[B][URL='https://ibb.co/51gRYCr'][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/URL][/B]<br>"+
    "[COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4][I]В вашей RolePlay - организации недостаточно информации.<br><br>" +
"Даю вам 24 часа на ее дополнение.[/I][/SIZE][/FONT][/COLOR]<br><br>",
prefix: PIN_PREFIX,
status: true,
},
{
title : 'ник англ' ,
content:
'[CENTER][COLOR=AQUA][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR]<br>' +
"[B][URL='https://ibb.co/51gRYCr'][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/URL][/B]<br>"+
    "[SIZE=4][FONT=times new roman][I][COLOR=rgb(209, 213, 216)]Ваша RolePlay - организация отказана т.к ваш все никнеймы должны быть написаны на русском языке. [/COLOR]<br><br>" +
"[COLOR=rgb(209, 213, 216)]Внимательно прочитайте правила создания RP - организаций закрепленные в данном разделе [/COLOR][/I][COLOR=rgb(209, 213, 216)][/COLOR][/FONT][/SIZE]<br><br>" ,
prefix: UNACCEPT_PREFIX,
status: false,
},
{
title : 'Неграмотная' ,
content:
'[CENTER][COLOR=AQUA][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR]<br>' +
"[B][URL='https://ibb.co/51gRYCr'][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/URL][/B]<br>"+
    "[SIZE=4][FONT=times new roman][I][COLOR=rgb(209, 213, 216)]Ваша RolePlay - организаций отказана т.к она оформлена неграмотно. [/COLOR]<br><br>" +
"[COLOR=rgb(209, 213, 216)]Внимательно прочитайте правила создания RP - организаций закрепленные в данном разделе [/COLOR][/I][COLOR=rgb(209, 213, 216)][/COLOR][/FONT][/SIZE]<br><br>" ,
prefix: UNACCEPT_PREFIX,
status: false,
},
{
title : 'Копипаст' ,
content:
'[CENTER][COLOR=AQUA][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR]<br>' +
"[B][URL='https://ibb.co/51gRYCr'][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/URL][/B]<br>"+
    "[SIZE=4][FONT=times new roman][I][COLOR=rgb(209, 213, 216)]Ваша RolePlay - организация отказана т.к вы ее скопировали у другого человека. [/COLOR]<br><br>" +
"[COLOR=rgb(209, 213, 216)]Внимательно прочитайте правила создания RP - организаций закрепленные в данном разделе [/COLOR][/I][COLOR=rgb(209, 213, 216)][/COLOR][/FONT][/SIZE]<br><br>" ,
prefix: UNACCEPT_PREFIX,
status: false,
},
{
title : 'Не дополнил' ,
content:
'[CENTER][COLOR=AQUA][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR]<br>' +
"[B][URL='https://ibb.co/51gRYCr'][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/URL][/B]<br>"+
    "[SIZE=4][FONT=times new roman][I][COLOR=rgb(209, 213, 216)]Ваша RolePlay - организация отказана т.к вы ее не дополнили. [/COLOR]<br><br>" +
"[COLOR=rgb(209, 213, 216)]Внимательно прочитайте правила создания RP - организаций закрепленные в данном разделе [/COLOR][/I][COLOR=rgb(209, 213, 216)][/COLOR][/FONT][/SIZE]<br><br>" ,

prefix: UNACCEPT_PREFIX,
status: false,
},
{
title : 'Заголовок не по форме' ,
content:
'[CENTER][COLOR=AQUA][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR]<br>' +
"[B][URL='https://ibb.co/51gRYCr'][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/URL][/B]<br>"+
    "[SIZE=4][FONT=times new roman][I][COLOR=rgb(209, 213, 216)]Ваша RolePlay - организация отказана т.к заголовок оформлен неправильно. [/COLOR]<br><br>" +
"[COLOR=rgb(209, 213, 216)]Внимательно прочитайте правила создания RP - организаций закрепленные в данном разделе [/COLOR][/I][COLOR=rgb(209, 213, 216)][/COLOR][/FONT][/SIZE]<br><br>" ,
prefix: UNACCEPT_PREFIX,
status: false,
},
{
title: '--------------------------------------------------------------------РП Ситуации--------------------------------------------------------------------'
},
{
title: 'одобрено',
content:
'[CENTER][COLOR=AQUA][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR]<br>' +
"[B][URL='https://ibb.co/51gRYCr'][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/URL][/B]<br>"+
    "[SIZE=4][FONT=times new roman][I][COLOR=rgb(209, 213, 216)]Ваша RolePlay - ситуация одобрена.[/COLOR][/I][/FONT][/SIZE]<br><br>" ,
prefix: ACCEPT_PREFIX,
status: false,
},
{
title : 'не туда' ,
content:
'[CENTER][COLOR=AQUA][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR]<br>' +
"[B][URL='https://ibb.co/51gRYCr'][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/URL][/B]<br>"+
    "[SIZE=4][FONT=times new roman][I][COLOR=rgb(209, 213, 216)]Ваша RolePlay - ситуация отказана т.к вы не туда попали. [/COLOR]<br><br>" ,
prefix: UNACCEPT_PREFIX,
status: false,
},
{
title : 'не по форме' ,
content:
'[CENTER][COLOR=AQUA][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR]<br>' +
"[B][URL='https://ibb.co/51gRYCr'][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/URL][/B]<br>"+
    "[SIZE=4][FONT=times new roman][I][COLOR=rgb(209, 213, 216)]Ваша RolePlay - ситуация отказана т.к она составлена не по форме. [/COLOR]<br><br>" ,
prefix: UNACCEPT_PREFIX,
status: false,
},
{
title : 'отказ' ,
content:
'[CENTER][COLOR=AQUA][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR]<br>' +
"[B][URL='https://ibb.co/51gRYCr'][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/URL][/B]<br>"+
    "[SIZE=4][FONT=times new roman][I][COLOR=rgb(209, 213, 216)]Ваша RolePlay - ситуация отказана. [/COLOR]<br><br>" ,
prefix:
UNACCEPT_PREFIX,
status: false,
},
{
title: 'На доработке',
content:
'[CENTER][COLOR=AQUA][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR]<br>' +
"[B][URL='https://ibb.co/51gRYCr'][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/URL][/B]<br>"+
    "[COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4][I]В вашей RolePlay - ситуации недостаточно информации.<br><br>" +
"Даю вам 24 часа на ее дополнение.[/I][/SIZE][/FONT][/COLOR]<br><br>" ,
prefix: PIN_PREFIX,
status: true,
},
{
title : 'ник англ' ,
content:
'[CENTER][COLOR=AQUA][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR]<br>' +
"[B][URL='https://ibb.co/51gRYCr'][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/URL][/B]<br>"+
    "[SIZE=4][FONT=times new roman][I][COLOR=rgb(209, 213, 216)]Ваша RolePlay - ситуация отказана т.к ваш все никнеймы должны быть написаны на русском языке. [/COLOR]<br><br>" +
"[COLOR=rgb(209, 213, 216)]Внимательно прочитайте правила создания RP - ситуаций закрепленные в данном разделе [/COLOR][/I][COLOR=rgb(209, 213, 216)][/COLOR][/FONT][/SIZE]<br><br>" ,
prefix: UNACCEPT_PREFIX,
status: false,
},
{
title : 'Неграмотная' ,
content:
'[CENTER][COLOR=AQUA][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR]<br>' +
"[B][URL='https://ibb.co/51gRYCr'][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/URL][/B]<br>"+
    "[SIZE=4][FONT=times new roman][I][COLOR=rgb(209, 213, 216)]Ваша RolePlay - ситуация отказана т.к она оформлена неграмотно. [/COLOR]<br><br>" +
"[COLOR=rgb(209, 213, 216)]Внимательно прочитайте правила создания RP - ситуаций закрепленные в данном разделе [/COLOR][/I][COLOR=rgb(209, 213, 216)][/COLOR][/FONT][/SIZE]<br><br>" ,
prefix: UNACCEPT_PREFIX,
status: false,
},
{
title : 'Копипаст' ,
content:
'[CENTER][COLOR=AQUA][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR]<br>' +
"[B][URL='https://ibb.co/51gRYCr'][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/URL][/B]<br>"+
    "[SIZE=4][FONT=times new roman][I][COLOR=rgb(209, 213, 216)]Ваша RolePlay - ситуация отказана т.к вы ее скопировали у другого человека. [/COLOR]<br><br>" +
"[COLOR=rgb(209, 213, 216)]Внимательно прочитайте правила создания RP - ситуаций закрепленные в данном разделе [/COLOR][/I][COLOR=rgb(209, 213, 216)][/COLOR][/FONT][/SIZE]<br><br>" ,
prefix: UNACCEPT_PREFIX,
status: false,
},
{
title : 'Не дополнил' ,
content:
'[CENTER][COLOR=AQUA][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR]<br>' +
"[B][URL='https://ibb.co/51gRYCr'][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/URL][/B]<br>"+
    "[SIZE=4][FONT=times new roman][I][COLOR=rgb(209, 213, 216)]Ваша RolePlay - ситуация отказана т.к вы ее не дополнили. [/COLOR]<br><br>" +
"[COLOR=rgb(209, 213, 216)]Внимательно прочитайте правила создания RP - ситуаций закрепленные в данном разделе [/COLOR][/I][COLOR=rgb(209, 213, 216)][/COLOR][/FONT][/SIZE]<br><br>" ,
prefix: UNACCEPT_PREFIX,
status: false,
},
{
title : 'Заголовок не по форме' ,
content:
'[CENTER][COLOR=AQUA][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR]<br>' +
"[B][URL='https://ibb.co/51gRYCr'][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/URL][/B]<br>"+
    "[SIZE=4][FONT=times new roman][I][COLOR=rgb(209, 213, 216)]Ваша RolePlay - ситуация отказана т.к заголовок оформлен неправильно. [/COLOR]<br><br>" +
"[COLOR=rgb(209, 213, 216)]Внимательно прочитайте правила создания RP - ситуаций закрепленные в данном разделе [/COLOR][/I][COLOR=rgb(209, 213, 216)][/COLOR][/FONT][/SIZE]<br><br>" ,
prefix: UNACCEPT_PREFIX,
status: false,
},


	];

$(document).ready(() => {
	// Загрузка скрипта для обработки шаблонов
	$('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');

	// Добавление кнопок при загрузке страницы
	addButton('Меню', 'selectAnswer');
	addButton('Одобрить', 'accepted');
	addButton('Отказать', 'unaccept');
       addButton('Закрыть', 'close');

	// Поиск информации о теме
	const threadData = getThreadData();

	$('button#pin').click(() => editThreadData(PIN_PREFIX, true));
	$('button#accepted').click(() => editThreadData(ACCEPT_PREFIX, false));
	$('button#teamProject').click(() => editThreadData(COMMAND_PREFIX, true));
	$('button#unaccept').click(() => editThreadData(UNACCEPT_PREFIX, false));
	$('button#close').click(() => editThreadData(CLOSE_PREFIX, false));

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