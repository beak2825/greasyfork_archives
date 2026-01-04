// ==UserScript==
// @name КФ, КА, ЗГА, ГА
// @namespace Frank Rolex
// @version 2.3
// @description Рабочая версия
// @author Frank_Rolex
// @match https://forum.blackrussia.online/threads/*
// @include https://forum.blackrussia.online/threads/
// @grant none
// @license MIT
// @collaborator
// @icon https://sfunpay.com/s/file/6e/jc/black_russia.6ejchs09le.jpg
// @updateURL
// @downloadURL https://update.greasyfork.org/scripts/526795/%D0%9A%D0%A4%2C%20%D0%9A%D0%90%2C%20%D0%97%D0%93%D0%90%2C%20%D0%93%D0%90.user.js
// @updateURL https://update.greasyfork.org/scripts/526795/%D0%9A%D0%A4%2C%20%D0%9A%D0%90%2C%20%D0%97%D0%93%D0%90%2C%20%D0%93%D0%90.meta.js
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
const SPECIAL_PREFIX = 11;
const TECH_PREFIX = 13;
const buttons = [
{
title: 'Доброго времени суток',
content:
'[CENTER][FONT=times new roman][SIZE=4][I][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый {{ user.mention }}.[/COLOR][/I][/SIZE][/FONT]<br><br>',
},
{
title: 'Переношу жалобу',
content:
'[CENTER][I][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]Доброго времени суток, уважаемый {{ user.mention }}.[/SIZE][/FONT][/COLOR][/I]<br><br>' +
'[COLOR=rgb(209, 213, 216)][I][FONT=times new roman][SIZE=4]Вы ошиблись разделом/сервером, переношу вашу тему в необходимый раздел.[/SIZE][/FONT]<br>',
},
{
title: '-----------------------------------------------------------Жалобы на игроков-----------------------------------------------------------',
},
{
title: 'На рассмотрении',
content:
'[CENTER][SIZE=4][FONT=times new roman][I][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый {{ user.mention }}.[/COLOR][/I][/FONT][/SIZE]<br><br>' +
"[I][SIZE=4][COLOR=rgb(209, 213, 216)][FONT=times new roman]Ваша жалоба взята на рассмотрение.[/FONT][/COLOR][/SIZE][/I]<br>" +
'[SIZE=4][FONT=times new roman][I][COLOR=rgb(209, 213, 216)]Не нужно создавать копии этой жалобы, ожидайте ответа в этой теме.[/COLOR][/I][/FONT][/SIZE][/CENTER]',
prefix: PIN_PREFIX,
status: true,
},
{
title: 'Нет /time',
content:
'[CENTER][I][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]Доброго времени суток, уважаемый {{ user.mention }}.[/SIZE][/FONT][/COLOR][/I]<br><br>' +
'[COLOR=rgb(209, 213, 216)][I][FONT=times new roman][SIZE=4]На ваших доказательствах отсутствует /time - следовательно рассмотрению не подлежит.[/SIZE][/FONT]<br>' +
'[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]Закрыто.',
prefix: CLOSE_PREFIX,
status: false,
},
{
title: 'Не по форме',
content:
'[CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]Доброго времени суток, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
"[SIZE=4][FONT=times new roman][I][COLOR=rgb(209, 213, 216)]Ваша жалоба составлена не по форме.[/COLOR]<br><br>" +
"[COLOR=rgb(209, 213, 216)]Внимательно прочитайте правила подачи жалоб на игроков в соответствующем разделе форума.[/COLOR][/I][/FONT][/SIZE]<br><br>" +
'[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]Закрыто.[/I][/SIZE][/FONT][/COLOR][/CENTER]',
prefix: CLOSE_PREFIX,
status: false,
},
{
title: 'Док-ва в соц. сетях',
content:
'[CENTER][FONT=times new roman][COLOR=rgb(255, 0, 0)][SIZE=4][I]Доброго времени суток, уважаемый {{ user.mention }}.[/I][/SIZE][/COLOR][/FONT]<br><br>' +
"[COLOR=rgb(209, 213, 216)][I][SIZE=4][FONT=times new roman]Доказательства в социальных сетях и т.д. не принимаются.[/FONT][/SIZE]<br>" +
"[SIZE=4][FONT=times new roman]Загрузите доказательства на фото-видео хостинги YouTube, Imgur, Yapx и так далее.[/FONT][/SIZE][/I][/COLOR]<br><br>" +
'[FONT=times new roman][COLOR=rgb(255, 0, 0)][SIZE=4][I]Закрыто.[/I][/SIZE][/COLOR][/FONT][/CENTER]',
prefix: CLOSE_PREFIX,
status: false,
},
{
title: 'Прошло 72 часа',
content:
'[CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]Доброго времени суток, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
"[COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4][I]Срок написания жалобы на игрока - 72 часа с момента нарушения.[/I][/SIZE][/FONT]<br>" +
"[I][FONT=times new roman][SIZE=4]Внимательно прочитайте правила составления жалоб.[/SIZE][/FONT][/I][/COLOR]<br><br>" +
'[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]Закрыто.[/I][/SIZE][/FONT][/COLOR][/CENTER]',
prefix: CLOSE_PREFIX,
status: false,
},
{
 
title: 'Нерабочие. док-ва',
content:
'[CENTER][FONT=times new roman][COLOR=rgb(255, 0, 0)][SIZE=4][I]Доброго времени суток, уважаемый {{ user.mention }}.[/I][/SIZE][/COLOR][/FONT]<br><br>' +
"[COLOR=rgb(209, 213, 216)][I][SIZE=4][FONT=times new roman]Не работают доказательства - следовательно рассмотрению не подлежит.[/FONT][/SIZE]<br>" +
"[SIZE=4][FONT=times new roman]Загрузите доказательства на фото-видео хостинги YouTube, Imgur, Yapx и так далее.[/FONT][/SIZE][/I][/COLOR]<br><br>" +
'[FONT=times new roman][COLOR=rgb(255, 0, 0)][SIZE=4][I]Закрыто.[/I][/SIZE][/COLOR][/FONT][/CENTER]',
prefix: CLOSE_PREFIX,
status: false,
},
{
title: 'Недостаточно доказательств',
content:
'[CENTER][I][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]Доброго времени суток, уважаемый {{ user.mention }}.[/SIZE][/FONT][/COLOR][/I]<br><br>' +
'[COLOR=rgb(209, 213, 216)][I][FONT=times new roman][SIZE=4]Недостаточно доказательтств для выдачи наказания данному игроку.[/SIZE][/FONT]<br>' +
'[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]Закрыто.',
prefix: CLOSE_PREFIX,
status: false,
},
{
title: 'Нет нарушений',
content:
'[CENTER][I][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]Доброго времени суток, уважаемый {{ user.mention }}.[/SIZE][/FONT][/COLOR][/I]<br><br>' +
'[COLOR=rgb(209, 213, 216)][I][FONT=times new roman][SIZE=4]Нарушений со стороны игрока не найдено.[/SIZE][/FONT]<br>' +
'[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]Закрыто.',
prefix: CLOSE_PREFIX,
status: false,
},
{
title: 'Передать Теху',
content:
'[CENTER][FONT=times new roman][SIZE=4][I][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый {{ user.mention }}.[/COLOR][/I][/SIZE][/FONT]<br><br>' +
"[COLOR=rgb(209, 213, 216)][I][FONT=times new roman][SIZE=4]Ваша жалоба переадресована [/SIZE][/FONT][/I][/COLOR][COLOR=rgb(255, 0, 0)][I][FONT=times new roman][SIZE=4]Техническому специалисту.[/SIZE][/FONT][/I][/COLOR][COLOR=rgb(209, 213, 216)][I][FONT=times new roman][SIZE=4][/SIZE][/FONT][/I][/COLOR]<br>" +
'[FONT=times new roman][SIZE=4][I][COLOR=rgb(209, 213, 216)]Ожидайте ответа в данной теме, копии создавать не нужно.[/COLOR][/I][/SIZE][/FONT][/CENTER]',
prefix: TECH_PREFIX,
status: true,
},
{
title: 'Нужен фрапс',
content:
'[CENTER][I][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]Доброго времени суток, уважаемый {{ user.mention }}.[/SIZE][/FONT][/COLOR][/I]<br><br>' +
'[COLOR=rgb(209, 213, 216)][I][FONT=times new roman][SIZE=4]Недостаточно доказательств для корректного рассмотрения жалобы. В данном случае требуются видео - доказательства.[/SIZE][/FONT]<br>' +
'[FONT=times new roman][SIZE=4]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/SIZE][/FONT][/I][/COLOR]<br><br>' +
'[FONT=times new roman][SIZE=4][I][COLOR=rgb(255, 0, 0)]Закрыто.[/COLOR][/I][/SIZE][/FONT][/CENTER]',
prefix: CLOSE_PREFIX,
status: false,
},
{
title: 'Игрок будет наказан',
content:
'[CENTER][I][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]Доброго времени суток, уважаемый {{ user.mention }}.[/SIZE][/FONT][/COLOR][/I]<br><br>' +
"[COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4][I]Здравствуйте, игрок будет наказан.[/I][/SIZE][/FONT][/COLOR]<br>" +
"[SIZE=4][COLOR=rgb(209, 213, 216)][FONT=times new roman][I]Приятной игры на проекте Black Russia.[/I][/FONT][/COLOR][/SIZE]<br><br>" +
'[I][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]Закрыто.[/SIZE][/FONT][/COLOR][/I][/CENTER]',
prefix: ACCEPT_PREFIX,
status: false,
},
{
title: '-----------------------------------------------------------Жалобы на администрацию-----------------------------------------------------------',
},
{
title: 'Запрошу док-ва',
content:
'[CENTER][FONT=times new roman][SIZE=4][I][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый {{ user.mention }}.[/COLOR][/I][/SIZE][/FONT]<br><br>' +
"[SIZE=4][I][COLOR=rgb(209, 213, 216)][FONT=times new roman]Запрошу доказательства у администратора. [/FONT][/COLOR][/I]<br>" +
'[FONT=times new roman][I][COLOR=rgb(209, 213, 216)]Ожидайте, пожалуйста, ответа от администрации и не нужно создавать копии этой темы.[/COLOR][/I][/FONT][/SIZE][/CENTER]',
prefix: PIN_PREFIX,
status: true,
},
{
title: 'Док-ва предоставлены',
content:
'[CENTER][I][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]Доброго времени суток, уважаемый {{ user.mention }}.[/SIZE][/FONT][/COLOR][/I]<br><br>' +
"[FONT=times new roman][SIZE=4][COLOR=rgb(209, 213, 216)][I]Доказательства предоставлены, наказание выдано верно.[/I][/COLOR]<br>" +
"[I][COLOR=rgb(209, 213, 216)]Внимательно прочтите общие правила серверов и впредь, пожалуйста, не нарушайте - [/COLOR][/I][COLOR=rgb(209, 213, 216)][URL='https://forum.blackrussia.online/index.php?threads/%D0%9E%D0%B1%D1%89%D0%B8%D0%B5-%D0%BF%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%B5%D1%80%D0%B2%D0%B5%D1%80%D0%BE%D0%B2.312571/']*нажмите сюда*[/URL][/COLOR][/SIZE][/FONT]<br><br>" +
"[SIZE=4][FONT=times new roman][COLOR=rgb(209, 213, 216)][I]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/I][/COLOR][/FONT][/SIZE]<br><br>" +
'[I][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]Закрыто.[/SIZE][/FONT][/COLOR][/I][/CENTER]',
prefix: CLOSE_PREFIX,
status: false,
},
{
title: 'Выдано верно',
content:
'[CENTER][FONT=times new roman][COLOR=rgb(255, 0, 0)][SIZE=4][I]Доброго времени суток, уважаемый {{ user.mention }}.[/I][/SIZE][/COLOR][/FONT]<br><br>' +
"[COLOR=rgb(209, 213, 216)][I][SIZE=4][FONT=times new roman]Нарушений со стороны администратора нет.[/FONT][/SIZE]<br>" +
"[SIZE=4][FONT=times new roman]Наказание выдано верно.[/FONT][/SIZE][/I][/COLOR]<br><br>" +
'[FONT=times new roman][COLOR=rgb(255, 0, 0)][SIZE=4][I]Закрыто.[/I][/SIZE][/COLOR][/FONT][/CENTER]',
prefix: CLOSE_PREFIX,
status: false,
},
{
title: 'Передано ГА',
content:
'[CENTER][FONT=times new roman][SIZE=4][I][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый {{ user.mention }}.[/COLOR][/I][/SIZE][/FONT]<br><br>' +
"[COLOR=rgb(209, 213, 216)][I][FONT=times new roman][SIZE=4]Ваше обращение переадресовано [/SIZE][/FONT][/I][/COLOR][COLOR=rgb(255, 0, 0)][I][FONT=times new roman][SIZE=4]Главному Администратору.[/SIZE][/FONT][/I][/COLOR][COLOR=rgb(209, 213, 216)][I][FONT=times new roman][SIZE=4][/SIZE][/FONT][/I][/COLOR]<br>" +
'[FONT=times new roman][SIZE=4][I][COLOR=rgb(209, 213, 216)]Ожидайте ответа в данной теме, копии создавать не нужно.[/COLOR][/I][/SIZE][/FONT][/CENTER]',
prefix: GA_PREFIX,
status: true,
},
{
title: 'Передано СА',
content:
'[CENTER][FONT=times new roman][SIZE=4][I][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый {{ user.mention }}.[/COLOR][/I][/SIZE][/FONT]<br><br>' +
"[COLOR=rgb(209, 213, 216)][I][FONT=times new roman][SIZE=4]Ваше обращение переадресовано [/SIZE][/FONT][/I][/COLOR][COLOR=rgb(255, 0, 0)][I][FONT=times new roman][SIZE=4]Специальному Администратору или его заместителям.[/SIZE][/FONT][/I][/COLOR][COLOR=rgb(209, 213, 216)][I][FONT=times new roman][SIZE=4][/SIZE][/FONT][/I][/COLOR]<br><br>" +
'[FONT=times new roman][SIZE=4][I][COLOR=rgb(209, 213, 216)]Ожидайте ответа в данной теме, копии создавать не нужно.[/COLOR][/I][/SIZE][/FONT][/CENTER]',
prefix: SPECIAL_PREFIX,
status: true,
},
{
title: 'Админ ошибся',
content:
'[CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]Доброго времени суток, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
"[SIZE=4][FONT=times new roman][I][COLOR=rgb(209, 213, 216)]Администратор допустил ошибку.[/COLOR]<br><br>" +
"[COLOR=rgb(209, 213, 216)]Приносим свои извинения за доставленные неудобства.[/COLOR]<br>" +
"[COLOR=rgb(209, 213, 216)]Приятной игры на [/COLOR][/I][COLOR=rgb(209, 213, 216)][I]BLACK RUSSIA Podolsk.<br>" +
"Ваше наказание будет снято в течение 12-ти часов.[/I][/COLOR][/FONT][/SIZE]<br><br>" +
'[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]Закрыто.[/I][/SIZE][/FONT][/COLOR][/CENTER]',
prefix: ACCEPT_PREFIX,
status: false,
},
{
title: 'Админ прав',
content:
'[CENTER][FONT=times new roman][COLOR=rgb(255, 0, 0)][SIZE=4][I]Доброго времени суток, уважаемый {{ user.mention }}.[/I][/SIZE][/COLOR][/FONT]<br><br>' +
"[COLOR=rgb(209, 213, 216)][I][SIZE=4][FONT=times new roman]Нарушений со стороны администратора нет.[/FONT][/SIZE]<br><br>" +
'[FONT=times new roman][COLOR=rgb(255, 0, 0)][SIZE=4][I]Закрыто.[/I][/SIZE][/COLOR][/FONT][/CENTER]',
prefix: CLOSE_PREFIX,
status: false,
},
{
 title: 'Админ не прав',
content:
'[CENTER][FONT=times new roman][COLOR=rgb(255, 0, 0)][SIZE=4][I]Доброго времени суток, уважаемый {{ user.mention }}.[/I][/SIZE][/COLOR][/FONT]<br><br>' +
"[SIZE=4][FONT=times new roman][I][COLOR=rgb(209, 213, 216)]В сторону администратора будут приняты необходимые меры.[/COLOR][/I][/FONT][/SIZE]<br>" +
"[FONT=times new roman][COLOR=#d1d5d8][SIZE=4][I]Приносим свои извинения за доставленные неудобства.<br>" +
"Приятной игры на BLACK RUSSIA Podolsk.[/I][/SIZE][/COLOR][/FONT]<br><br>" +
'[COLOR=rgb(209, 213, 216)][FONT=times new roman][COLOR=rgb(255, 0, 0)][SIZE=4][I]Закрыто.[/I][/SIZE][/COLOR][/FONT][/COLOR][/CENTER]',
prefix: ACCEPT_PREFIX,
status: false,
},
{
title: 'Админ будет наказан',
content:
'[CENTER][FONT=times new roman][COLOR=rgb(255, 0, 0)][SIZE=4][I]Доброго времени суток, уважаемый {{ user.mention }}.[/I][/SIZE][/COLOR][/FONT]<br><br>' +
"[SIZE=4][FONT=times new roman][I][COLOR=rgb(209, 213, 216)]Администратору будет выдано наказание за его ошибку.[/COLOR][/I][/FONT][/SIZE]<br>" +
"[FONT=times new roman][COLOR=#d1d5d8][SIZE=4][I]Приносим свои извинения за доставленные неудобства.<br>" +
"Приятной игры на BLACK RUSSIA Podolsk.[/I][/SIZE][/COLOR][/FONT]<br><br>" +
'[COLOR=rgb(209, 213, 216)][FONT=times new roman][COLOR=rgb(255, 0, 0)][SIZE=4][I]Закрыто.[/I][/SIZE][/COLOR][/FONT][/COLOR][/CENTER]',
prefix: ACCEPT_PREFIX,
status: false,
},
{
title: 'В тех раздел',
content:
'[CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]Доброго времени суток, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
"[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Обратитесь в технический раздел - [/SIZE][/FONT][/COLOR][/I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4][URL='https://forum.blackrussia.online/forums/%D0%A2%D0%B5%D1%85%D0%BD%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%B8%D0%B9-%D1%80%D0%B0%D0%B7%D0%B4%D0%B5%D0%BB-podolsk.3817/']*нажмите сюда*[/URL]<br>" +
"[I]Просьба не создавать дубликаты данной темы в этом разделе, иначе ваш форумный аккаунт может быть заблокирован.[/I][/SIZE][/FONT][/COLOR]<br><br>" +
'[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]Закрыто.[/I][/SIZE][/FONT][/COLOR][/CENTER]',
prefix: CLOSE_PREFIX,
status: false,
},
{
title: 'Тех. спец',
content:
'[CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]Доброго времени суток, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
"[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Обратитесь в раздел жалоб на технических специалистов - [/SIZE][/FONT][/COLOR][/I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4][URL='https://forum.blackrussia.online/forums/%D0%A1%D0%B5%D1%80%D0%B2%D0%B5%D1%80-%E2%84%9687-podolsk.3816/']*нажмите сюда*[/URL]<br>" +
"[I]Просьба не создавать дубликаты данной темы в этом разделе, иначе ваш форумный аккаунт может быть заблокирован.[/I][/SIZE][/FONT][/COLOR]<br><br>" +
'[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]Закрыто.[/I][/SIZE][/FONT][/COLOR][/CENTER]',
prefix: CLOSE_PREFIX,
status: false,
},
{
title: 'Прошло 48 часов',
content:
'[CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]Доброго времени суток, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
"[COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4][I]Срок написания жалобы - 48 часов с момента выдачи наказания.[/I][/SIZE][/FONT]<br>" +
"[I][FONT=times new roman][SIZE=4]Внимательно прочитайте правила составления жалоб, которые закреплены в этом разделе.[/SIZE][/FONT][/I][/COLOR]<br><br>" +
'[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]Закрыто.[/I][/SIZE][/FONT][/COLOR][/CENTER]',
prefix: CLOSE_PREFIX,
status: false,
},
{
title: 'Не по форме',
content:
'[CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]Доброго времени суток, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
"[SIZE=4][FONT=times new roman][I][COLOR=rgb(209, 213, 216)]Ваша жалоба составлена не по форме.[/COLOR]<br><br>" +
"[COLOR=rgb(209, 213, 216)]Внимательно прочитайте правила подачи жалоб на администрацию в соответствующем разделе форума.[/COLOR][/I][/FONT][/SIZE]<br><br>" +
'[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]Закрыто.[/I][/SIZE][/FONT][/COLOR][/CENTER]',
prefix: CLOSE_PREFIX,
status: false,
},
{
title: 'Ответ дан раннее',
content:
'[CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]Доброго времени суток, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
"[I][SIZE=4][FONT=times new roman][COLOR=rgb(209, 213, 216)]Вам уже ранее был дан корректный ответ, за создание дубликатов этой темы ваш форумный аккаунт может быть заблокирован.[/COLOR][/FONT][/SIZE][/I]<br><br>" +
'[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]Закрыто.[/I][/SIZE][/FONT][/COLOR][/CENTER]',
prefix: CLOSE_PREFIX,
status: false,
},
{
title: 'Нужно окно бана',
content:
'[CENTER][FONT=times new roman][SIZE=4][I][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый {{ user.mention }}.[/COLOR]<br><br>' +
'[COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4][I]Прикрепите в доказательства скриншот окна блокировки, которое появляется сразу после входа в игру.<br>' +
'Приятной игры на BLACK RUSSIA RolePlay.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
'[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]Закрыто.[/I][/SIZE][/FONT][/COLOR][/CENTER]',
prefix: CLOSE_PREFIX,
status: false,
},
{
title: '-----------------------------------------------------------Обжалование-----------------------------------------------------------',
},
{
title: 'В ОБЖ одобрено',
content:
'[CENTER][FONT=times new roman][COLOR=rgb(255, 0, 0)][SIZE=4][I]Доброго времени суток, уважаемый {{ user.mention }}.[/I][/SIZE][/COLOR][/FONT]<br><br>' +
'[COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4][I]Ваш аккаунт будет разблокирован, больше не совершайте таких ошибок. При повторном нарушении ваше обжалование будет отклонено.<br>' +
'Приятной игры на BLACK RUSSIA RolePlay.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
'[FONT=times new roman][COLOR=rgb(255, 0, 0)][SIZE=4][I]Одобрено, закрыто.[/I][/SIZE][/COLOR]',
prefix: ACCEPT_PREFIX,
status: false,
},
{
title: 'В ОБЖ отказано',
content:
'[CENTER][FONT=times new roman][COLOR=rgb(255, 0, 0)][SIZE=4][I]Доброго времени суток, уважаемый {{ user.mention }}.[/I][/SIZE][/COLOR][/FONT]<br><br>' +
'[COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4][I]В обжаловании отказано.<br><br>' +
'[FONT=times new roman][COLOR=#d1d5d8][SIZE=4][I]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/I][/SIZE][/COLOR][/FONT]<br><br>' +
'[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]Отказано, закрыто.[/I][/SIZE][/FONT][/COLOR][/CENTER]',
prefix: UNACCEPT_PREFIX,
status: false,
},
 {
title: 'На рассмотрении',
content:
'[CENTER][SIZE=4][FONT=times new roman][I][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый {{ user.mention }}.[/COLOR][/I][/FONT][/SIZE]<br><br>' +
"[I][SIZE=4][COLOR=rgb(209, 213, 216)][FONT=times new roman]Ваше обжалование взято на рассмотрение.[/FONT][/COLOR][/SIZE][/I]<br>" +
'[SIZE=4][FONT=times new roman][I][COLOR=rgb(209, 213, 216)]Не нужно создавать копии этой жалобы, ожидайте ответа в этой теме.[/COLOR][/I][/FONT][/SIZE][/CENTER]',
prefix: PIN_PREFIX,
status: true,
},
{
title: 'Оск родни одобрено',
content:
'[CENTER][FONT=times new roman][COLOR=rgb(255, 0, 0)][SIZE=4][I]Доброго времени суток, уважаемый {{ user.mention }}.[/I][/SIZE][/COLOR][/FONT]<br><br>' +
'[COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4][I]На первый раз ваше наказание будет снижено блокировки чата на 120 минут, больше не нарушайте. При повторном нарушении ваше обжалование будет отклонено.<br>' +
'Приятной игры на BLACK RUSSIA RolePlay.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
'[FONT=times new roman][COLOR=rgb(255, 0, 0)][SIZE=4][I]Одобрено, закрыто.[/I][/SIZE][/COLOR]',
prefix: ACCEPT_PREFIX,
status: false,
},
{
title: 'Разбан NonRP обман',
content:
'[CENTER][FONT=times new roman][COLOR=rgb(255, 0, 0)][SIZE=4][I]Доброго времени суток, уважаемый {{ user.mention }}.[/I][/SIZE][/COLOR][/FONT]<br><br>' +
'[COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4][I]Аккаунт будет разблокирован на 24 часа.<br>' +
"[SIZE=4][FONT=times new roman]За это время обманутый и обманувший игроки должны встретиться в игре и совершить возврат имущества. После чего видео фиксацию возврата имущества предоставить в этой жалобе. Если вы выполните все условия, ваш аккаунт будет полностью разблокирован. Если же украденное имущество будет передано друзьям/твинк аккаунт, то аккаунты будут заблокированы без возможности обжаловать наказание.<br><br>" +
'[COLOR=rgb(255, 255, 0)][FONT=times new roman][SIZE=4][I]На рассмотрении.[/I][/SIZE][/FONT][/COLOR][/CENTER]',
prefix: PIN_PREFIX,
status: true,
},
{
title: 'Разбан ник',
content:
'[CENTER][FONT=times new roman][COLOR=rgb(255, 0, 0)][SIZE=4][I]Доброго времени суток, уважаемый {{ user.mention }}.[/I][/SIZE][/COLOR][/FONT]<br><br>' +
'[COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4][I]Ваш аккаунт будет разблокирован на 24 часа.<br>' +
"[SIZE=4][FONT=times new roman]За это время вы должны сменить Nick_Name, после чего прикрепить доказательства в эту тему. Если же вы этого не сделаете, то аккаунт будут заблокированы без возможности обжаловать наказание.<br><br>" +
'[COLOR=rgb(255, 255, 0)][FONT=times new roman][SIZE=4][I]На рассмотрении.[/I][/SIZE][/FONT][/COLOR][/CENTER]',
prefix: PIN_PREFIX,
status: true,
},
{
title: 'Nrp обман',
content:
'[CENTER][FONT=times new roman][COLOR=rgb(255, 0, 0)][SIZE=4][I]Доброго времени суток, уважаемый {{ user.mention }}.[/I][/SIZE][/COLOR][/FONT]<br><br>' +
"[COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4][I]Обжалование NonRP обмана возможно лишь в том случае ,если вы сами свяжитесь с обманутой стороной и будете готовы отдать украденное. Игрок, которого вы обманули должен написать в профиле вашего форумного аккаунта что дает свое согласие на возврат средств и компенсацию.<br><br>" +
'[FONT=times new roman][COLOR=rgb(255, 0, 0)][SIZE=4][I]Отказано, закрыто.[/I][/SIZE][/FONT][/COLOR][/CENTER]',
prefix: CLOSE_PREFIX,
status: false,
},
{
title: 'Обж не по форме',
content:
'[CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]Доброго времени суток, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
"[SIZE=4][FONT=times new roman][I][COLOR=rgb(209, 213, 216)]Ваше обжалование составлено не по форме.[/COLOR]<br><br>" +
"[COLOR=rgb(209, 213, 216)]Внимательно прочитайте правила подачи обжалований в соответствующем разделе форума.[/COLOR][/I][/FONT][/SIZE]<br><br>" +
'[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]Закрыто.[/I][/SIZE][/FONT][/COLOR][/CENTER]',
prefix: CLOSE_PREFIX,
status: false,
},
{
title: 'Передать Sakaro',
content:
'[CENTER][FONT=times new roman][SIZE=4][I][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый {{ user.mention }}.[/COLOR][/I][/SIZE][/FONT]<br><br>' +
"[COLOR=rgb(209, 213, 216)][I][FONT=times new roman][SIZE=4]Ваша жалоба переадресована [/SIZE][/FONT][/I][/COLOR][COLOR=rgb(255, 0, 0)][I][FONT=times new roman][SIZE=4]Руководителю модерации Discord или его заместителям.[/SIZE][/FONT][/I][/COLOR][COLOR=rgb(209, 213, 216)][I][FONT=times new roman][SIZE=4][/SIZE][/FONT][/I][/COLOR]<br><br>" +
'[FONT=times new roman][SIZE=4][I][COLOR=rgb(209, 213, 216)]Ожидайте ответа в данной теме, копии создавать не нужно.[/COLOR][/I][/SIZE][/FONT][/CENTER]',
prefix: COMMAND_PREFIX,
status: false,
},
 {
title: 'ВК',
content:
'[CENTER][FONT=times new roman][COLOR=rgb(255, 0, 0)][SIZE=4][I]Доброго времени суток, уважаемый {{ user.mention }}.[/I][/SIZE][/COLOR][/FONT]<br><br>' +
"[COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4][I]Прикрепите ссылку на вашу страницу ВК, на которую выдан ЧС. <br><br>" +
'[FONT=times new roman][COLOR=rgb(255, 0, 0)][SIZE=4][I]Взято на рассмотрение.[/I][/SIZE][/FONT][/COLOR][/CENTER]',
prefix: PIN_PREFIX,
status: true,
},    
];
 
 
$(document).ready(() => {
    // Загрузка скрипта для обработки шаблонов
    $('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');
 
 
    // Добавление кнопок при загрузке страницы
    addButton('Закрыто', 'close');
    addButton('На рассмотрение', 'pin');
    addButton('Одобрено', 'accepted');
    addButton('Отказано', 'unaccept');
    addButton('Передано ГА', 'ga');
    addButton('Ответы', 'selectAnswer');
 
 
 
    // Поиск информации о теме
    const threadData = getThreadData();
 
 
    $('button#pin').click(() => editThreadData(PIN_PREFIX, true));
    $('button#accepted').click(() => editThreadData(ACCEPT_PREFIX, false));
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
    6 < hours && hours <= 15
      ? 'Доброе утро'
      : 15 < hours && hours <= 18
      ? 'Добрый день'
      : 18 < hours && hours <= 6
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