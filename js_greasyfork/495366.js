// ==UserScript==
// @name         Скрипт для згс\гс ARKHANGELSK пк версия
// @namespace    по вопросам - https://vk.com/santaplend
// @version      0.04
// @description  server 56
// @author       Santa Aplend
// @match        https://forum.blackrussia.online/threads/*
// @include      https://forum.blackrussia.online/threads/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=greasyfork.org
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/495366/%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%B7%D0%B3%D1%81%5C%D0%B3%D1%81%20ARKHANGELSK%20%D0%BF%D0%BA%20%D0%B2%D0%B5%D1%80%D1%81%D0%B8%D1%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/495366/%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%B7%D0%B3%D1%81%5C%D0%B3%D1%81%20ARKHANGELSK%20%D0%BF%D0%BA%20%D0%B2%D0%B5%D1%80%D1%81%D0%B8%D1%8F.meta.js
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
            title: `Закрытие заявок`,
            content :  `[SIZE=5][FONT=georgia][CENTER] Доброго времени суток, уважаемые игроки.<br>`+
            `[CENTER] В данной теме вы узнаете список [color=lightgreen] одобренных [/color] и [COLOR=red] отказанных [/color] игроков на должность Лидера Фракции «  »<br>`+
            `[CENTER] В случае если вы не согласны с решениям Старшей Администрации то составьте свою претензию в раздел «Жалобы на Администрацию».<br><br>`+
            `[SIZE=6] [CENTER] [color=lightgreen] Список одобренных кандидат;[/color]<br>`+
            `[CENTER] [LIST=1]
             [*]
             [*]
             [*]
             [*]
             [*]
             [*]
             [*]
             [*]
             [*]
             [*]
             [*]
            [/LIST]<br><br>`+
            `[SIZE=6] [CENTER] [COLOR=red] Список отказанных игроков;[/color]<br>`+
             `[CENTER] [LIST]
             [*]  — [COLOR=red] Причина отказа: [/color]
             [*]  — [COLOR=red] Причина отказа: [/color]
             [*]  — [COLOR=red] Причина отказа: [/color]
             [*]  — [COLOR=red] Причина отказа: [/color]
             [*]  — [COLOR=red] Причина отказа: [/color]
             [*]  — [COLOR=red] Причина отказа: [/color]
             [*]  — [COLOR=red] Причина отказа: [/color]
             [*]  — [COLOR=red] Причина отказа: [/color]
             [*]  — [COLOR=red] Причина отказа: [/color]
             [*]  — [COLOR=red] Причина отказа: [/color]
             [*]  — [COLOR=red] Причина отказа: [/color]
            [/LIST]<br><br>`+
            `[CENTER] [SIZE=6] [COLOR=red] Примечание: [/COLOR] Число и время обзвона можно будет узнать в беседе кандидатов.
            Перед обзвоном кандидаты должны поставить следующий префикс в Discord ARKHANGELSK сервера: "префикс" ,
            Желаем всем кандидатам удачи! `
            },
{
title: '-----------------------------------------------------------------Одобрения----------------------------------------------------------------',
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
title: 'лд будет снят',
content:
'[CENTER][COLOR=AQUA][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR]<br><br>' +
"[B][URL='https://ibb.co/51gRYCr'][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/URL][/B]<br>"+
"[CENTER][SIZE=5][FONT=times new roman] Лидер будет снят со своей должности.<br><br> благодарим за обращение![/FONT]<br><br>"+
"[COLOR=lime] [FONT=georgia]Одобрено [/FONT][/COLOR][/SIZE][/CENTER]"+
"[B][URL='https://ibb.co/51gRYCr'][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/URL][/B][/CENTER]<br>",
prefix: ACCEPT_PREFIX,
status: false,
},
    {
title: '--------------------------------------------------------------------------------------Отказы---------------------------------------------------------------------------------',
},
    {
    title: 'лд дал док-ва',
content:
'[CENTER][COLOR=AQUA][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR]<br>' +
"[B][URL='https://ibb.co/51gRYCr'][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/URL][/B]<br><br>"+
   "[CENTER][SIZE=4][FONT=times new roman] Лидер предоставил доказательства. Наказание было выдано верно.<br><br>"+
    "[COLOR=red] Отказано [/COLOR]<br>"+
"[B][URL='https://ibb.co/51gRYCr'][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/URL][/CENTER][/B]<br><br>" ,
prefix: UNACCEPT_PREFIX,
status: false,
    },
     {
    title: 'зам дал док-ва',
content:
'[CENTER][COLOR=AQUA][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR]<br>' +
"[B][URL='https://ibb.co/51gRYCr'][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/URL][/B]<br><br>"+
   "[CENTER][SIZE=4][FONT=times new roman] Заместитель предоставил доказательства. Наказание было выдано верно.<br><br>"+
    "[COLOR=red] Отказано [/COLOR]<br>"+
"[B][URL='https://ibb.co/51gRYCr'][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/URL][/CENTER][/B]<br><br>" ,
prefix: UNACCEPT_PREFIX,
status: false,
    },
    {
    title: 'Недостаточно доква',
content:
'[CENTER][COLOR=AQUA][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR]<br>' +
"[B][URL='https://ibb.co/51gRYCr'][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/URL][/B]<br><br>"+
   "[CENTER][SIZE=4][FONT=times new roman]  Недостаточно доказателсьтв, которые потверждают нарушение лидера.[/FONT]<br><br>"+
    "[COLOR=red] Отказано [/COLOR]<br>"+
"[B][URL='https://ibb.co/51gRYCr'][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/URL][/CENTER][/B]<br><br>" ,
prefix: UNACCEPT_PREFIX,
status: false,
},
{
    title: 'Нет доква',
content:
'[CENTER][COLOR=AQUA][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR]<br>' +
"[B][URL='https://ibb.co/51gRYCr'][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/URL][/B]<br><br>"+
   "[CENTER][SIZE=4][FONT=times new roman]  В вашей жалобе отсутвуют доказательства - следовательно, рассмотрению не подлежит.<br><br> Загрузите доказательства на фото-видео хостинги YouTube, Imgur, Yapx [/FONT]<br><br>"+
    "[COLOR=red] Отказано [/COLOR]<br>"+
"[B][URL='https://ibb.co/51gRYCr'][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/URL][/CENTER][/B]<br><br>" ,
prefix: UNACCEPT_PREFIX,
status: false,
},
    {
title: 'не является замом',
content:
'[CENTER][COLOR=AQUA][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR]<br>' +
"[B][URL='https://ibb.co/51gRYCr'][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/URL][/B]<br><br>"+
    "[SIZE=4][FONT=times new roman] Данный игрок не является заместителем. [/FONT][/SIZE]<br><br>" +
"[FONT=times new roman][SIZE=4]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/SIZE][/FONT]<br><br>" +
"[B][CENTER][COLOR=red]Отказано[/COLOR][/B]<br><br>" +
"[B][URL='https://ibb.co/51gRYCr'][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/URL][/CENTER][/B]<br><br>" ,
prefix: UNACCEPT_PREFIX,
status: false,
},
{
title: 'не является лд',
content:
'[CENTER][COLOR=AQUA][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR]<br>' +
"[B][URL='https://ibb.co/51gRYCr'][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/URL][/B]<br><br>"+
    "[SIZE=4][FONT=times new roman] Данный игрок не является лидером. [/FONT][/SIZE]<br><br>" +
"[FONT=times new roman][SIZE=4]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/SIZE][/FONT][/COLOR]<br><br>" +
"[B][CENTER][COLOR=red]Отказано[/COLOR][/B]<br><br>" +
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
"[B][CENTER][COLOR=red]Отказано[/COLOR][/B]<br><br>" +
"[B][URL='https://ibb.co/51gRYCr'][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/URL][/CENTER][/B]<br><br>" ,
prefix: UNACCEPT_PREFIX,
status: false,
},
{
title: 'Нарушений нет лд',
content:
'[CENTER][COLOR=AQUA][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR]<br>' +
"[B][URL='https://ibb.co/51gRYCr'][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/URL][/B]<br><br>"+
"[CENTER][SIZE=5][FONT=times new roman][SIZE=4]Нарушений со стороны лидера не было замечено.<br><br>" +
"Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/SIZE][/FONT]<br><br>" +
"[B][CENTER][COLOR=red]Отказано[/COLOR][/B]<br><br>" +
"[B][URL='https://ibb.co/51gRYCr'][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/URL][/CENTER][/B]<br><br>" ,
status: false,
},
    {
title: 'Нарушений нет зам',
content:
'[CENTER][COLOR=AQUA][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR]<br>' +
"[B][URL='https://ibb.co/51gRYCr'][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/URL][/B]<br><br>"+
"[CENTER][SIZE=5][FONT=times new roman][SIZE=4]Нарушений со стороны заместителя не было замечено.<br><br>" +
"Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/SIZE][/FONT]<br><br>" +
"[B][CENTER][COLOR=red]Отказано[/COLOR][/B]<br><br>" +
"[B][URL='https://ibb.co/51gRYCr'][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/URL][/CENTER][/B]<br><br>" ,
status: false,
},
{
title: 'Нет time',
content:
'[CENTER][COLOR=AQUA][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR]<br>' +
"[B][URL='https://ibb.co/51gRYCr'][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/URL][/B]<br><br>"+
   "[FONT=times new roman][SIZE=4]На доказательствах отсутствуют дата и время ([/SIZE][/FONT][FONT=courier new][SIZE=4]/time[/SIZE][/FONT][FONT=times new roman][SIZE=4]) - следовательно, рассмотрению не подлежит.<br><br>" +
"Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/SIZE][/FONT]<br><br>" +
"[B][CENTER][COLOR=red]Отказано[/B]<br><br>" +
"[B][URL='https://ibb.co/51gRYCr'][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/URL][/CENTER][/B]<br><br>" ,
prefix: UNACCEPT_PREFIX,
status: false,
},
{
title: 'Док-ва отредакт',
content:
'[CENTER][COLOR=AQUA][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR]<br>' +
"[B][URL='https://ibb.co/51gRYCr'][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/URL][/B]<br><br>"+
    "[CENTER][SIZE=5][FONT=times new roman][SIZE=4]Доказательства были подвергнуты редактированию - следовательно, рассмотрению не подлежит.<br><br>" +
"Загрузите оригиналы видеозаписи/скриншотов, создав новую тему в данном разделе.<br><br>" +
"Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/SIZE][/FONT]<br><br>" +
"[B][CENTER][COLOR=red]Отказано[/COLOR][/B]<br><br>" +
"[B][URL='https://ibb.co/51gRYCr'][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/URL][/CENTER][/B]<br><br>" ,
prefix: UNACCEPT_PREFIX,
status: false,
},
{



title : 'прошло 3 дня' ,
content:
'[CENTER][COLOR=AQUA][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR]<br>' +
"[B][URL='https://ibb.co/51gRYCr'][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/URL][/B]<br><br>"+
    "[SIZE=4][FONT=times new roman]Ваша жалоба отказана, т.к с момента нарушения прошло более 72-ух часов.[/FONT][/SIZE]<br><br>" +
"[FONT=times new roman][SIZE=4][I]Просьба не создавать дубликаты этой темы, иначе ваш форумный аккаунт может быть заблокирован.[/SIZE][/FONT]<br> <br>" +
"[B][CENTER][COLOR=red]Отказано[/COLOR][/B]<br><br>" +
"[B][URL='https://ibb.co/51gRYCr'][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/URL][/CENTER][/B]<br><br>" ,
},

{
title : 'уже был ответ' ,
content:
'[CENTER][COLOR=AQUA][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR]<br>' +
"[B][URL='https://ibb.co/51gRYCr'][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/URL][/B]<br><br>"+
    "[SIZE=4][FONT=times new roman]Ваша жалоба отказана, т.к ранее уже был дан ответ.[/FONT][/SIZE]<br><br>" +
"[FONT=times new roman][SIZE=4]Просьба не создавать дубликаты этой темы, иначе ваш форумный аккаунт может быть заблокирован.[/SIZE][/FONT]<br> <br>" +
"[B][CENTER][COLOR=red]Отказано[/COLOR][/B]<br><br>" +
"[B][URL='https://ibb.co/51gRYCr'][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/URL][/CENTER][/B]<br><br>" ,
prefix: UNACCEPT_PREFIX,
status: false,
},
  {
title: 'Не по форме',
content:
'[CENTER][COLOR=AQUA][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR]<br>' +
"[B][URL='https://ibb.co/51gRYCr'][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/URL][/B]<br><br>"+
    "[SIZE=4][FONT=times new roman]Ваша жалоба составлена не по форме. Внимательно прочитайте правила подачи жалоб на лидеров, закрепленные в этом разделе.[/FONT][/SIZE]<br><br>" +
"[FONT=times new roman][SIZE=4][I]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/I][/SIZE][/FONT]<br><br>" +
"[B][CENTER][COLOR=red]Отказано [/COLOR][/B]<br><br>" +
"[B][URL='https://ibb.co/51gRYCr'][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/URL][/CENTER][/B]<br><br>" ,
prefix: UNACCEPT_PREFIX,
status: false,
},
{
title: 'Нет доступа к док-ва',
content:
'[CENTER][COLOR=AQUA][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR]<br>' +
"[B][URL='https://ibb.co/51gRYCr'][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/URL][/B]<br><br>"+
    "[SIZE=4][FONT=times new roman]Ваши доказательства не доступны к просмотру. Загрузите доказательства на фото-видео хостинги YouTube,Imgur, Yapx и так далее.[/FONT][/SIZE]<br><br>" +
"[FONT=times new roman][SIZE=4]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/SIZE][/FONT]<br><br>" +
"[B][CENTER][COLOR=red]Отказано[/COLOR][/B]<br><br>" +
"[B][URL='https://ibb.co/51gRYCr'][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/URL][/CENTER][/B]<br><br>" ,
prefix: UNACCEPT_PREFIX,
status: false,
},
    {
title: 'Жб на игроков',
content:
'[CENTER][COLOR=AQUA][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR]<br>' +
"[B][URL='https://ibb.co/51gRYCr'][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/URL][/B]<br><br>"+
    "[SIZE=4][FONT=times new roman]Напишите вашу жалобу в раздел 'Жалобы на игроков'.[/FONT][/SIZE]<br><br>" +
"[FONT=times new roman][SIZE=4]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/SIZE][/FONT]<br><br>" +
"[B][CENTER][COLOR=red]Отказано[/COLOR][/B]<br><br>" +
"[B][URL='https://ibb.co/51gRYCr'][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/URL][/CENTER][/B]<br><br>" ,
prefix: UNACCEPT_PREFIX,
status: false,
},

{
title: 'Жб на сотрудников',
content:
'[CENTER][COLOR=AQUA][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR]<br>' +
"[B][URL='https://ibb.co/51gRYCr'][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/URL][/B]<br><br>"+
    "[SIZE=4][FONT=times new roman]Напишите вашу жалобу в раздел 'Жалобы на сотрудников'.[/FONT][/SIZE]<br><br>" +
"[FONT=times new roman][SIZE=4]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/SIZE][/FONT]<br><br>" +
"[B][CENTER][COLOR=red]Отказано[/COLOR][/B]<br><br>" +
"[B][URL='https://ibb.co/51gRYCr'][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/URL][/CENTER][/B]<br><br>" ,
prefix: UNACCEPT_PREFIX,
status: false,
},
{
title: 'В ЖБ на адм',
content:
'[CENTER][COLOR=AQUA][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR]<br>' +
"[B][URL='https://ibb.co/51gRYCr'][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/URL][/B]<br><br>"+
    "[SIZE=4][FONT=times new roman]Вы ошиблись разделом, обратитесь в раздел жалоб на администрацию - [URL='https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B0%D0%B4%D0%BC%D0%B8%D0%BD%D0%B8%D1%81%D1%82%D1%80%D0%B0%D1%86%D0%B8%D1%8E.842/']*Нажмите сюда*[/URL][/FONT][/SIZE]<br><br>" +
"[FONT=times new roman][SIZE=4]Просьба не создавать дубликаты данной темы в этом разделе, иначе ваш форумный аккаунт может быть заблокирован.[/SIZE][/FONT]<br><br>" +
"[B][CENTER][COLOR=red]Отказано[/COLOR][/B]<br><br>" +
"[B][URL='https://ibb.co/51gRYCr'][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/URL][/CENTER][/B]<br><br>" ,
prefix: UNACCEPT_PREFIX,
status: false,
},
{
title: 'Нужен фрапс',
content:
'[CENTER][COLOR=AQUA][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR]<br>' +
"[B][URL='https://ibb.co/51gRYCr'][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/URL][/B]<br><br>"+
"[SIZE=4][FONT=times new roman]Для рассмотрения вашей жалобы нужно видео-доказательство. [/FONT][/SIZE]<br><br>" +
"[FONT=times new roman][SIZE=4]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/SIZE][/FONT]<br><br>" +
"[B][CENTER][COLOR=red]Отказано[/COLOR][/B]<br><br>" +
"[B][URL='https://ibb.co/51gRYCr'][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/URL][/CENTER][/B]<br><br><br><br>" ,
prefix: UNACCEPT_PREFIX,
status: false,
},
   {

	  title: '-------------------------------------------------------------- рассмотрение/передача --------------------------------------------------------------------'

	    	},



    {
	  title: '| На рассмотрение |',
	  content:
		'[CENTER][COLOR=AQUA][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR]<br>' +
"[B][URL='https://ibb.co/51gRYCr'][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/URL][/B]<br><br>"+
		"[B][CENTER]Ваша жалоба взята на рассмотрение, пожалуйста не создавайте дубликатов. Ожидайте ответа.<br><br>"+
    "[COLOR=rgb(250, 197, 28)][SIZE=5][FONT=times new roman]на рассмотрении...[/FONT][/SIZE][/COLOR]<br><br>"+
"[B][URL='https://ibb.co/51gRYCr'][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/URL][/B][/CENTER]<br>",
	  prefix: PIN_PREFIX,
	  status: true,
	},
     {
	  title: '| на другой серв|',
	  content:
		'[CENTER][COLOR=AQUA][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR]<br>' +
"[B][URL='https://ibb.co/51gRYCr'][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/URL][/B]<br><br>"+

		"[B][CENTER]Переношу вашу жалобу в нужный вам сервер. <br><br>"+
"[B][URL='https://ibb.co/51gRYCr'][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/URL][/B][/CENTER]<br>",
	     prefix: PIN_PREFIX,
	  status: true,
	},
  {
title: '-------------------------------------------------------------------------Одобрения - замы-------------------------------------------------------------------'
  },
{
title: 'Беседа с замом',
content:
'[CENTER][COLOR=AQUA][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR]<br><br>'+
"[CENTER][SIZE=5][FONT=times new roman]С заместителем будет проведена профилактическая беседа. Лидер будет проинформирован.<br> благодарим за обращение![/FONT]<br><br>"+
"[COLOR=lime] [FONT=georgia]Одобрено [/FONT][/COLOR][/SIZE][/CENTER]",
  prefix: ACCEPT_PREFIX,
	  status: false,
	},
{
title: 'Необходимые меры(пред)',
content:
'[CENTER][COLOR=AQUA][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR]<br><br>' +
 "[CENTER][SIZE=5][FONT=times new roman] В сторону заместителя будут приняты необходимые меры. Лидер будет проинформирован.<br> благодарим за обращение![/FONT]<br><br>"+
"[COLOR=lime] [FONT=georgia]Одобрено [/FONT][/COLOR][/SIZE][/CENTER]",
prefix: ACCEPT_PREFIX,
status: false,
},
{
title: 'Строгая беседа (выг)',
content:
'[CENTER][COLOR=AQUA][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR]<br><br>' +
"[B][URL='https://ibb.co/51gRYCr'][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/URL][/B]<br>"+
"[CENTER][SIZE=5][FONT=times new roman] C заместителем будет проведена строгая профилактическая беседа. Лидер будет проинформирован.<br><br> благодарим за обращение![/FONT]<br><br>"+
"[COLOR=lime] [FONT=georgia]Одобрено [/FONT][/COLOR][/SIZE][/CENTER]"+
"[B][URL='https://ibb.co/51gRYCr'][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/URL][/B][/CENTER]<br>",
prefix: ACCEPT_PREFIX,
status: false,
},
    {
title: 'зам будет снят',
content:
'[CENTER][COLOR=AQUA][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR]<br><br>' +
"[B][URL='https://ibb.co/51gRYCr'][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/URL][/B]<br>"+
"[CENTER][SIZE=5][FONT=times new roman] Заместитель будет снят со своей должности.<br><br> благодарим за обращение![/FONT]<br><br>"+
"[COLOR=lime] [FONT=georgia]Одобрено [/FONT][/COLOR][/SIZE][/CENTER]"+
"[B][URL='https://ibb.co/51gRYCr'][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/URL][/B][/CENTER]<br>",
prefix: ACCEPT_PREFIX,
status: false,
},



	];

$(document).ready(() => {
	// Загрузка скрипта для обработки шаблонов
	$('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');

	// Добавление кнопок при загрузке страницы
     addButton(`расмотрение`, `pin`);
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