// ==UserScript==
// @name Для Руководства ГОСС
// @namespace https://forum.blackrussia.online
// @version 1.0.4
// @description Для ГС/ЗГС ГОСС
// @author Richard Nestroy 
// @match https://forum.blackrussia.online/index.php?threads/*
// @include https://forum.blackrussia.online/index.php?threads/
// @grant none
// @license MIT
// @collaborator !
// @icon https://icons.iconarchive.com/icons/papirus-team/papirus-apps/48/emerald-theme-manager-icon-icon.png
// @downloadURL https://update.greasyfork.org/scripts/464056/%D0%94%D0%BB%D1%8F%20%D0%A0%D1%83%D0%BA%D0%BE%D0%B2%D0%BE%D0%B4%D1%81%D1%82%D0%B2%D0%B0%20%D0%93%D0%9E%D0%A1%D0%A1.user.js
// @updateURL https://update.greasyfork.org/scripts/464056/%D0%94%D0%BB%D1%8F%20%D0%A0%D1%83%D0%BA%D0%BE%D0%B2%D0%BE%D0%B4%D1%81%D1%82%D0%B2%D0%B0%20%D0%93%D0%9E%D0%A1%D0%A1.meta.js
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
title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴Жалобы на рассмотрении ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴'
},
{
title: 'ГОСС +',
content: '[COLOR=lime][FONT=times new roman][CENTER][SIZE=6]ГОСС[/SIZE][/CENTER][/COLOR][/FONT] +',},
{
title: 'Запрошу док-ва',
content:
'[SIZE=4][I][FONT=Times New Roman][CENTER][B]{{ greeting }}![/CENTER]<br><br>'+
"[CENTER]Запрошу доказательства у лидера.<br><br>"+
'[Color=Orange]На рассмотрении.[/Color][/I][/CENTER][/B][/SIZE]',
prefix: PIN_PREFIX,
status: true,
},
{
title: 'На рассмотрение',
content:
'[SIZE=4][FONT=Times New Roman][CENTER][B]{{ greeting }}![/CENTER]<br><br>'+
"[CENTER]Ваша жалоба взята [Color=Orange]на рассмотрение[/Color]. Просьба не создавать подобных тем, иначе форумный аккаунт может быть заблокирован[/CENTER]<br><br>"+
'[CENTER]Ожидайте ответа.[/CENTER][/B][/SIZE]',
prefix: PIN_PREFIX,
status: true,
},
{
title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴Одобренные жалобы ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴'
},
{
title: 'Беседа(простая)',
content:
'[SIZE=4][FONT=Times New Roman][CENTER][I][B]{{ greeting }}![/CENTER]<br><br>'+
"[CENTER][COLOR=#2124eb]С лидером будет проведена проффилактическая  беседа, в ходе которой к лидеру будет донесена его ошибка.[/COLOR][/CENTER]<br><br>"+
'CENTER][COLOR=lime]Одобрено,закрыто.[/COLOR].[/I][/B][/SIZE][/CENTER]<br><br>',
prefix: ACCEPT_PREFIX,
status: false,
},
{
title: 'Беседа(строгая)',
content:
'[SIZE=4][FONT=Times New Roman][CENTER][I][B]{{ greeting }}![/CENTER]<br><br>'+
"[CENTER][COLOR=#2124eb]С лидером будет проведена строгая беседа, в ходе которой к лидеру будет донесена его ошибка.[/COLOR][/CENTER]<br><br>"+
'[CENTER][COLOR=lime]Одобрено,закрыто.[/SIZE][/I][/B][/COLOR][/CENTER]<br><br>',
prefix: ACCEPT_PREFIX,
status: false,
},
{
title: 'Беседа+Будут приняты меры',
content:
'[SIZE=4][I][FONT=Times New Roman][CENTER][B]{{ greeting }}![/CENTER]<br><br>'+
"[CENTER][COLOR=#2124eb]С лидером будет проведена беседа, также будут приняты соответствующие меры.[/COLOR][/CENTER]<br><br>"+
'[CENTER][COLOR=lime]Одобрено,закрыто.[/B][/I][/SIZE][/COLOR][/CENTER]<br><br>',
prefix: ACCEPT_PREFIX,
status: false,
},
{
title: 'Благодарим за информацию',
content:
'[SIZE=4][I][FONT=Times New Roman][CENTER][B]{{ greeting }}![/CENTER]<br><br>'+
"[CENTER]Благодарим за предоставленную информацию.[/CENTER]<br><br>"+
'[CENTER][COLOR=lime]Закрыто[/COLOR].[/I][/CENTER][/SIZE][/B]<br><br>',
prefix: CLOSE_PREFIX,
status: false,
},
{
title: 'Лидер был снят',
content:
'[SIZE=4][I][FONT=Times New Roman][CENTER][B]{{ greeting }}![/CENTER]<br><br>'+
"[CENTER]Лидер был снят[/CENTER]<br><br>"+
'CENTER][COLOR=#FF0000]Закрыто[/COLOR].[/I][/B][/SIZE][/CENTER]<br><br>',
prefix: CLOSE_PREFIX,
status: false,
},
{
title: 'Данный игрок не лд',
content:
'[SIZE=4][I][FONT=Times New Roman][CENTER][B]{{ greeting }}![/CENTER]<br><br>'+
"[CENTER][COLOR=2124eb]Данный игрок не является лидером.[/COLOR][/CENTER]<br><br>"+
'[CENTER][COLOR=#FF0000]Закрыто[/COLOR].[/I][/SIZE][/B][/CENTER]<br><br>',
prefix: CLOSE_PREFIX,
status: false,
},
{
title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴Отказанные жалобы ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴'
},
{
title: 'В жалобы на сотрудников',
content:
'[SIZE=4][I][FONT=Times New Roman][CENTER][B]{{ greeting }}![/CENTER]<br><br>'+
"[CENTER][COLOR=#2124eb]Обратитесь в жалобы на сотрудников.[/COLOR]<br><br>"+
'[CENTER][COLOR=#FF0000]]Отказано,закрыто[/COLOR].[/I][/SIZE][/B][/CENTER]<br><br>',
prefix: UNACCEPT_PREFIX,
status: false,
},
{
title: 'В жалобы на игроков',
content:
'[SIZE=4][FONT=Times New Roman][/I][CENTER][B]{{ greeting }}![/CENTER]<br><br>'+
"[CENTER][COLOR=#2124eb]Обратитесь в [URL='https://forum.blackrussia.online/index.php?forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B8%D0%B3%D1%80%D0%BE%D0%BA%D0%BE%D0%B2.1167/'][U]«Жалобы на игроков»[/U][/URL][/COLOR].[/CENTER]<br><br>"+
'[CENTER][COLOR=#FF0000]Отказано, закрыто[/COLOR].[/CENTER][/I][/SIZE][/B]<br><br>',
prefix: UNACCEPT_PREFIX,
status: false,
},
{
title: 'В жалобы на адм',
content:
'[SIZE=4][FONT=Times New Roman][I][CENTER][B]{{ greeting }}![/CENTER]<br><br>'+
"[CENTER][COLOR=#2124eb]Обратитесь в [URL='https://forum.blackrussia.online/index.php?forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B0%D0%B4%D0%BC%D0%B8%D0%BD%D0%B8%D1%81%D1%82%D1%80%D0%B0%D1%86%D0%B8%D1%8E.1165/']/U]«Жалобы на администрацию»[/U][/URL][/COLOR].[/CENTER]<br><br>"+
'[CENTER][COLOR=#FF0000]Отказано, закрыто[/COLOR]. [/I][/SIZE][/B][/CENTER]<br><br>',
prefix: UNACCEPT_PREFIX,
status: false,
},
{
title: 'Не по форме',
content:
'[SIZE=4][FONT=Times New Roman][I][CENTER][B]{{ greeting }}![/CENTER]<br><br>'+
"[CENTER][COLOR=#2124eb]Ваша жалоба написана не по форме. Ознакомьтесь с [URL='https://forum.blackrussia.online/index.php?threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BF%D0%BE%D0%B4%D0%B0%D1%87%D0%B8-%D0%B6%D0%B0%D0%BB%D0%BE%D0%B1-%D0%BD%D0%B0-%D0%BB%D0%B8%D0%B4%D0%B5%D1%80%D0%BE%D0%B2.3429391/'][U]правилами подачи жалоб на лидеров.[/U][/URL][/COLOR].[/CENTER]<br><br>"+
'[CENTER][COLOR=#FF0000]Отказано, закрыто[/COLOR].[/SIZE][/B][/I][/CENTER]<br><br>',
prefix: UNACCEPT_PREFIX,
status: false,
},
{
title: 'Нет нарушений',
content:
'[SIZE=4][FONT=Times New Roman][I][CENTER][B]{{ greeting }}![/CENTER]<br><br>'+
"[CENTER][COLOR=#2124eb]Нет нарушений со стороны лидера.[/COLOR][/CENTER]<br><br>"+
'[CENTER][COLOR=#FF0000]Отказано, закрыто[/COLOR]. [/SIZE][/B][/I][/CENTER]<br><br>',
prefix: UNACCEPT_PREFIX,
status: false,
},
{
title: 'Отсутствуют доки',
content:
'[SIZE=4][FONT=Times New Roman][CENTER][I][B]{{ greeting }}![/CENTER]<br><br>'+
"[CENTER][COLOR=#2124eb]В вашей жалобе отсутствуют доказательства.[/COLOR][/CENTER]<br><br>"+
'[CENTER][COLOR=#FF0000]Отказано,закрыто[/COLOR].[/CENTER][/SIZE][/B][/I]<br><br>',
prefix: UNACCEPT_PREFIX,
status: false,
},
{
title: 'Отредактированы',
content:
'[SIZE=4][FONT=Times New Roman][CENTER][I][B]{{ greeting }}![/CENTER]<br><br>'+
"[CENTER][COLOR=#2124eb]Ваши доказательства отредактированы, доказательства должны быть в первоначальном виде.[/COLOR][/CENTER]<br><br>"+
'[CENTER][COLOR=#FF0000]Отказано,закрыто[/COLOR].[/CENTER][/SIZE][/B][/I]<br><br>',
prefix: UNACCEPT_PREFIX,
status: false,
},
{
title: '3-е лицо.',
content:
'[SIZE=4][FONT=Times New Roman][I][CENTER][B]{{ greeting }}![/CENTER]<br><br>'+
"[CENTER][COLOR=#2124eb]Жалоба составлена от 3-его лица[/CENTER][/COLOR]<br><br>"+
'[CENTER][COLOR=#FF0000]Отказано,закрыто[/COLOR].[/SIZE][/B][/I][/CENTER]<br><br>',
prefix: UNACCEPT_PREFIX,
status: false,
},
{
title: 'нет тайма',
content:
'[SIZE=4][FONT=Times New Roman][I][CENTER][B]{{ greeting }}![/CENTER]<br><br>'+
"[CENTER][COLOR=#2124eb]На ваших доказательствах отсутвует /time[/CENTER][/COLOR]<br><br>"+
'[CENTER][COLOR=#FF0000]Отказано,закрыто[/COLOR].[/SIZE][/B][/I][/CENTER]<br><br>',
prefix: UNACCEPT_PREFIX,
status: false,
},
{
title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴Еженедельные отчеты ЛД ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴'
},
{
    title: 'Еженедьльный + 50 балов',
    content: '[SIZE=4][CENTER][FONT=Times New Roman][I][B]{{ greeting }}!<br><br>'+
    "[COLOR=#2124eb]Ваша еженедельная норма была проверена, выдам 50 баллов [/COLOR]<br><br>"+
    '[COLOR=lime]Рассмотрено.[/COLOR][/CENTER][/I][/B]',
    prefix: WATCHED_PREFIX,
    status: true,
},
{
title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴Заявки ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴'
},
{ title: 'УМВД',
content: '[CENTER][FONT=times new roman][SIZE=4][IMG]https://i.postimg.cc/mkYxXTGb/dolorpavs-2.png[/IMG][/SIZE]<br><br>'+

"[COLOR=#5897ff][SIZE=5] Здравствуйте, уважаемые игроки. [/SIZE][/COLOR]<br><br>" +

"В данной теме вы можете подать свое заявление на должность" + "[COLOR=#2124eb] Полковник УМВД.<br><br>[/COLOR]" +
"[IMG]https://i.postimg.cc/W3s0FnbX/1619558447629-2.png[/IMG]<br><br>" +

"Требования к кандидату:<br><br>" +

"• Не иметь банов/варнов на сервере<br>" +
"• Не иметь подписок на запрещенные группы ВКонтакте<br>" +
"• Быть грамотным, адекватным, коммуникабельным, ответственным и креативным<br>" +
"• Уметь красиво и грамотно оформлять форум<br>" +
"• Иметь игровой уровень 8+<br>" +
"• Возраст 15+ (за обман администрации - бан), исключений нет<br>" +
"• Знания правил сервера, ГОСС<br><br>" +

"[IMG]https://i.postimg.cc/W3s0FnbX/1619558447629-2.png[/IMG]<br><br>" +

"[SIZE=5][COLOR=#5897ff]IC Information:[/COLOR][/SIZE]<br><br>" +

"1. Имя Фамилия:<br>" +
"2. Копия паспорта (/pass + /time):<br>" +
"3.Имеется ли опыт на руководящих должностях (подробно):<br>" +
"4. Какое значение имеет организация/какие функции выполняет:<br>" +
"5. Ваша стратегия на первые 2 дня на посту лидера:<br>" +
"6. История игры на проекте (подробно):<br><br>" +

"[SIZE=5][COLOR=#5897ff]OOC Information:[/COLOR][/SIZE]<br><br>" +

"1. Имя Фамилия:<br>" +
"2. Ваш возраст (полная дата рождения):<br>" +
"3. Скриншот статистики (/mm - 1):<br>" +
"4. Скриншот /history:<br>" +
"5. Средний онлайн в сутки:<br>" +
"6. Где Вы проживаете (Страна/Город):<br>" +
"7. Ваш логин Discord:<br>" +
"8. Ссылка на Ваш профиль VK:<br>" +
"9. Ознакомлены ли Вы с правилами сервера, правилами лидерства и другими правилами? Обязуетесь ли Вы их соблюдать?:<br>" +
"10. Готовы ли Вы получить блокировку аккаунта, если простоите на посту лидера менее 15-ти дней?:<br>" +
"11. Как Вы оцениваете свою адекватность? (10-ти бальная шкала):<br>" +
"12. Как Вы оцениваете свою грамотность? (10-ти бальная шкала):<br>" +
"13. Расскажите немного о себе:<br>" +
"14. Присутствует ли привязка аккаунта к E-Mail почте?:<br><br>" +

"[IMG]https://i.postimg.cc/W3s0FnbX/1619558447629-2.png[/IMG]<br><br>" +

"[SIZE=5][COLOR=#ff0000]Примечание:[/COLOR][/SIZE]<br><br>" +

"• Отбор кандидатов проходит строго на усмотрение Главного Следящего и непосредственно его заместителя<br>" +
"• Администрация в любой момент может закрыть заявление и назначить Лидера<br>" +
"• Не стоит писать Администрации в ЛС по вопросам обзвона и тд - это лишь усугубит ваши оценки<br>" +
"• Время обзвона зависит от выбора ГС/ЗГС<br><br>" +

"[IMG]https://i.postimg.cc/W3s0FnbX/1619558447629-2.png[/IMG]<br><br>" +

"[SIZE=5][COLOR=#ff0000]Важная информация:[/COLOR][/SIZE]<br><br>" +

"• Одобренным кандидатам быть в комнате Ожидание обзвона за 5 минут до начала с префиксом [K/LD/УМВД] *NickName*<br>" +
"• Опоздание на обзвон более чем на 5 минут – снятие с обзвона<br>" +
"• Обзвон будет проходить в данном дискорд канале - https://discord.gg/CmDnc4HyBj<br><br>" +

"[IMG]https://i.postimg.cc/W3s0FnbX/1619558447629-2.png[/IMG]<br><br>"+

'[COLOR=#5897ff]Всем желаю удачи![/COLOR][/FONT][/CENTER]',
},
{
    title: 'ГИБДД',
content: '[CENTER][FONT=times new roman][SIZE=4][IMG]https://i.postimg.cc/mkYxXTGb/dolorpavs-2.png[/IMG][/SIZE]<br><br>'+

"[COLOR=#5897ff][SIZE=5] Здравствуйте, уважаемые игроки. [/SIZE][/COLOR]<br><br>" +

"В данной теме вы можете подать свое заявление на должность" + "[COLOR=#2124eb] Полковник ГИБДД.<br><br>[/COLOR]" +
"[IMG]https://i.postimg.cc/W3s0FnbX/1619558447629-2.png[/IMG]<br><br>" +

"Требования к кандидату:<br><br>" +

"• Не иметь банов/варнов на сервере<br>" +
"• Не иметь подписок на запрещенные группы ВКонтакте<br>" +
"• Быть грамотным, адекватным, коммуникабельным, ответственным и креативным<br>" +
"• Уметь красиво и грамотно оформлять форум<br>" +
"• Иметь игровой уровень 8+<br>" +
"• Возраст 15+ (за обман администрации - бан), исключений нет<br>" +
"• Знания правил сервера, ГОСС<br><br>" +

"[IMG]https://i.postimg.cc/W3s0FnbX/1619558447629-2.png[/IMG]<br><br>" +

"[SIZE=5][COLOR=#5897ff]IC Information:[/COLOR][/SIZE]<br><br>" +

"1. Имя Фамилия:<br>" +
"2. Копия паспорта (/pass + /time):<br>" +
"3.Имеется ли опыт на руководящих должностях (подробно):<br>" +
"4. Какое значение имеет организация/какие функции выполняет:<br>" +
"5. Ваша стратегия на первые 2 дня на посту лидера:<br>" +
"6. История игры на проекте (подробно):<br><br>" +

"[SIZE=5][COLOR=#5897ff]OOC Information:[/COLOR][/SIZE]<br><br>" +

"1. Имя Фамилия:<br>" +
"2. Ваш возраст (полная дата рождения):<br>" +
"3. Скриншот статистики (/mm - 1):<br>" +
"4. Скриншот /history:<br>" +
"5. Средний онлайн в сутки:<br>" +
"6. Где Вы проживаете (Страна/Город):<br>" +
"7. Ваш логин Discord:<br>" +
"8. Ссылка на Ваш профиль VK:<br>" +
"9. Ознакомлены ли Вы с правилами сервера, правилами лидерства и другими правилами? Обязуетесь ли Вы их соблюдать?:<br>" +
"10. Готовы ли Вы получить блокировку аккаунта, если простоите на посту лидера менее 15-ти дней?:<br>" +
"11. Как Вы оцениваете свою адекватность? (10-ти бальная шкала):<br>" +
"12. Как Вы оцениваете свою грамотность? (10-ти бальная шкала):<br>" +
"13. Расскажите немного о себе:<br>" +
"14. Присутствует ли привязка аккаунта к E-Mail почте?:<br><br>" +

"[IMG]https://i.postimg.cc/W3s0FnbX/1619558447629-2.png[/IMG]<br><br>" +

"[SIZE=5][COLOR=#ff0000]Примечание:[/COLOR][/SIZE]<br><br>" +

"• Отбор кандидатов проходит строго на усмотрение Главного Следящего и непосредственно его заместителя<br>" +
"• Администрация в любой момент может закрыть заявление и назначить Лидера<br>" +
"• Не стоит писать Администрации в ЛС по вопросам обзвона и тд - это лишь усугубит ваши оценки<br>" +
"• Время обзвона зависит от выбора ГС/ЗГС<br><br>" +

"[IMG]https://i.postimg.cc/W3s0FnbX/1619558447629-2.png[/IMG]<br><br>" +

"[SIZE=5][COLOR=#ff0000]Важная информация:[/COLOR][/SIZE]<br><br>" +

"• Одобренным кандидатам быть в комнате Ожидание обзвона за 5 минут до начала с префиксом [K/LD/ГИБДД] *NickName*<br>" +
"• Опоздание на обзвон более чем на 5 минут – снятие с обзвона<br>" +
"• Обзвон будет проходить в данном дискорд канале - https://discord.gg/CmDnc4HyBj<br><br>" +

"[IMG]https://i.postimg.cc/W3s0FnbX/1619558447629-2.png[/IMG]<br><br>"+

'[COLOR=#5897ff]Всем желаю удачи![/COLOR][/FONT][/CENTER]',
},
{
    title: 'ФСБ',
content: '[CENTER][FONT=times new roman][SIZE=4][IMG]https://i.postimg.cc/mkYxXTGb/dolorpavs-2.png[/IMG][/SIZE]<br><br>'+

"[COLOR=#5897ff][SIZE=5] Здравствуйте, уважаемые игроки. [/SIZE][/COLOR]<br><br>" +

"В данной теме вы можете подать свое заявление на должность" + "[COLOR=#2124eb] Полковник ФСБ.<br><br>[/COLOR]" +
"[IMG]https://i.postimg.cc/W3s0FnbX/1619558447629-2.png[/IMG]<br><br>" +

"Требования к кандидату:<br><br>" +

"• Не иметь банов/варнов на сервере<br>" +
"• Не иметь подписок на запрещенные группы ВКонтакте<br>" +
"• Быть грамотным, адекватным, коммуникабельным, ответственным и креативным<br>" +
"• Уметь красиво и грамотно оформлять форум<br>" +
"• Иметь игровой уровень 8+<br>" +
"• Возраст 15+ (за обман администрации - бан), исключений нет<br>" +
"• Знания правил сервера, ГОСС<br><br>" +

"[IMG]https://i.postimg.cc/W3s0FnbX/1619558447629-2.png[/IMG]<br><br>" +

"[SIZE=5][COLOR=#5897ff]IC Information:[/COLOR][/SIZE]<br><br>" +

"1. Имя Фамилия:<br>" +
"2. Копия паспорта (/pass + /time):<br>" +
"3.Имеется ли опыт на руководящих должностях (подробно):<br>" +
"4. Какое значение имеет организация/какие функции выполняет:<br>" +
"5. Ваша стратегия на первые 2 дня на посту лидера:<br>" +
"6. История игры на проекте (подробно):<br><br>" +

"[SIZE=5][COLOR=#5897ff]OOC Information:[/COLOR][/SIZE]<br><br>" +

"1. Имя Фамилия:<br>" +
"2. Ваш возраст (полная дата рождения):<br>" +
"3. Скриншот статистики (/mm - 1):<br>" +
"4. Скриншот /history:<br>" +
"5. Средний онлайн в сутки:<br>" +
"6. Где Вы проживаете (Страна/Город):<br>" +
"7. Ваш логин Discord:<br>" +
"8. Ссылка на Ваш профиль VK:<br>" +
"9. Ознакомлены ли Вы с правилами сервера, правилами лидерства и другими правилами? Обязуетесь ли Вы их соблюдать?:<br>" +
"10. Готовы ли Вы получить блокировку аккаунта, если простоите на посту лидера менее 15-ти дней?:<br>" +
"11. Как Вы оцениваете свою адекватность? (10-ти бальная шкала):<br>" +
"12. Как Вы оцениваете свою грамотность? (10-ти бальная шкала):<br>" +
"13. Расскажите немного о себе:<br>" +
"14. Присутствует ли привязка аккаунта к E-Mail почте?:<br><br>" +

"[IMG]https://i.postimg.cc/W3s0FnbX/1619558447629-2.png[/IMG]<br><br>" +

"[SIZE=5][COLOR=#ff0000]Примечание:[/COLOR][/SIZE]<br><br>" +

"• Отбор кандидатов проходит строго на усмотрение Главного Следящего и непосредственно его заместителя<br>" +
"• Администрация в любой момент может закрыть заявление и назначить Лидера<br>" +
"• Не стоит писать Администрации в ЛС по вопросам обзвона и тд - это лишь усугубит ваши оценки<br>" +
"• Время обзвона зависит от выбора ГС/ЗГС<br><br>" +

"[IMG]https://i.postimg.cc/W3s0FnbX/1619558447629-2.png[/IMG]<br><br>" +

"[SIZE=5][COLOR=#ff0000]Важная информация:[/COLOR][/SIZE]<br><br>" +

"• Одобренным кандидатам быть в комнате Ожидание обзвона за 5 минут до начала с префиксом [K/LD/ФСБ] *NickName*<br>" +
"• Опоздание на обзвон более чем на 5 минут – снятие с обзвона<br>" +
"• Обзвон будет проходить в данном дискорд канале - https://discord.gg/CmDnc4HyBj<br><br>" +

"[IMG]https://i.postimg.cc/W3s0FnbX/1619558447629-2.png[/IMG]<br><br>"+

'[COLOR=#5897ff]Всем желаю удачи![/COLOR][/FONT][/CENTER]',
},
    {
        title: 'Армия',
content: '[CENTER][FONT=times new roman][SIZE=4][IMG]https://i.postimg.cc/mkYxXTGb/dolorpavs-2.png[/IMG][/SIZE]<br><br>'+

"[COLOR=#5897ff][SIZE=5] Здравствуйте, уважаемые игроки. [/SIZE][/COLOR]<br><br>" +

"В данной теме вы можете подать свое заявление на должность" + "[COLOR=#7d6c18] Полковник Армии.<br><br>[/COLOR]" +
"[IMG]https://i.postimg.cc/W3s0FnbX/1619558447629-2.png[/IMG]<br><br>" +

"Требования к кандидату:<br><br>" +

"• Не иметь банов/варнов на сервере<br>" +
"• Не иметь подписок на запрещенные группы ВКонтакте<br>" +
"• Быть грамотным, адекватным, коммуникабельным, ответственным и креативным<br>" +
"• Уметь красиво и грамотно оформлять форум<br>" +
"• Иметь игровой уровень 8+<br>" +
"• Возраст 15+ (за обман администрации - бан), исключений нет<br>" +
"• Знания правил сервера, ГОСС<br><br>" +

"[IMG]https://i.postimg.cc/W3s0FnbX/1619558447629-2.png[/IMG]<br><br>" +

"[SIZE=5][COLOR=#5897ff]IC Information:[/COLOR][/SIZE]<br><br>" +

"1. Имя Фамилия:<br>" +
"2. Копия паспорта (/pass + /time):<br>" +
"3.Имеется ли опыт на руководящих должностях (подробно):<br>" +
"4. Какое значение имеет организация/какие функции выполняет:<br>" +
"5. Ваша стратегия на первые 2 дня на посту лидера:<br>" +
"6. История игры на проекте (подробно):<br><br>" +

"[SIZE=5][COLOR=#5897ff]OOC Information:[/COLOR][/SIZE]<br><br>" +

"1. Имя Фамилия:<br>" +
"2. Ваш возраст (полная дата рождения):<br>" +
"3. Скриншот статистики (/mm - 1):<br>" +
"4. Скриншот /history:<br>" +
"5. Средний онлайн в сутки:<br>" +
"6. Где Вы проживаете (Страна/Город):<br>" +
"7. Ваш логин Discord:<br>" +
"8. Ссылка на Ваш профиль VK:<br>" +
"9. Ознакомлены ли Вы с правилами сервера, правилами лидерства и другими правилами? Обязуетесь ли Вы их соблюдать?:<br>" +
"10. Готовы ли Вы получить блокировку аккаунта, если простоите на посту лидера менее 15-ти дней?:<br>" +
"11. Как Вы оцениваете свою адекватность? (10-ти бальная шкала):<br>" +
"12. Как Вы оцениваете свою грамотность? (10-ти бальная шкала):<br>" +
"13. Расскажите немного о себе:<br>" +
"14. Присутствует ли привязка аккаунта к E-Mail почте?:<br><br>" +

"[IMG]https://i.postimg.cc/W3s0FnbX/1619558447629-2.png[/IMG]<br><br>" +

"[SIZE=5][COLOR=#ff0000]Примечание:[/COLOR][/SIZE]<br><br>" +

"• Отбор кандидатов проходит строго на усмотрение Главного Следящего и непосредственно его заместителя<br>" +
"• Администрация в любой момент может закрыть заявление и назначить Лидера<br>" +
"• Не стоит писать Администрации в ЛС по вопросам обзвона и тд - это лишь усугубит ваши оценки<br>" +
"• Время обзвона зависит от выбора ГС/ЗГС<br><br>" +

"[IMG]https://i.postimg.cc/W3s0FnbX/1619558447629-2.png[/IMG]<br><br>" +

"[SIZE=5][COLOR=#ff0000]Важная информация:[/COLOR][/SIZE]<br><br>" +

"• Одобренным кандидатам быть в комнате Ожидание обзвона за 5 минут до начала с префиксом [K/LD/МО] *NickName*<br>" +
"• Опоздание на обзвон более чем на 5 минут – снятие с обзвона<br>" +
"• Обзвон будет проходить в данном дискорд канале - https://discord.gg/CmDnc4HyBj<br><br>" +

"[IMG]https://i.postimg.cc/W3s0FnbX/1619558447629-2.png[/IMG]<br><br>"+

'[COLOR=#5897ff]Всем желаю удачи![/COLOR][/FONT][/CENTER]',
},
{
title: 'больница',
content: '[CENTER][FONT=times new roman][SIZE=4][IMG]https://i.postimg.cc/mkYxXTGb/dolorpavs-2.png[/IMG][/SIZE]<br><br>'+

"[COLOR=#5897ff][SIZE=5] Здравствуйте, уважаемые игроки. [/SIZE][/COLOR]<br><br>" +

"В данной теме вы можете подать свое заявление на должность" + "[COLOR=#ff0877] Глав.Врач Больницы.<br><br>[/COLOR]" +
"[IMG]https://i.postimg.cc/W3s0FnbX/1619558447629-2.png[/IMG]<br><br>" +

"Требования к кандидату:<br><br>" +

"• Не иметь банов/варнов на сервере<br>" +
"• Не иметь подписок на запрещенные группы ВКонтакте<br>" +
"• Быть грамотным, адекватным, коммуникабельным, ответственным и креативным<br>" +
"• Уметь красиво и грамотно оформлять форум<br>" +
"• Иметь игровой уровень 8+<br>" +
"• Возраст 15+ (за обман администрации - бан), исключений нет<br>" +
"• Знания правил сервера, ГОСС<br><br>" +

"[IMG]https://i.postimg.cc/W3s0FnbX/1619558447629-2.png[/IMG]<br><br>" +

"[SIZE=5][COLOR=#5897ff]IC Information:[/COLOR][/SIZE]<br><br>" +

"1. Имя Фамилия:<br>" +
"2. Копия паспорта (/pass + /time):<br>" +
"3.Имеется ли опыт на руководящих должностях (подробно):<br>" +
"4. Какое значение имеет организация/какие функции выполняет:<br>" +
"5. Ваша стратегия на первые 2 дня на посту лидера:<br>" +
"6. История игры на проекте (подробно):<br><br>" +

"[SIZE=5][COLOR=#5897ff]OOC Information:[/COLOR][/SIZE]<br><br>" +

"1. Имя Фамилия:<br>" +
"2. Ваш возраст (полная дата рождения):<br>" +
"3. Скриншот статистики (/mm - 1):<br>" +
"4. Скриншот /history:<br>" +
"5. Средний онлайн в сутки:<br>" +
"6. Где Вы проживаете (Страна/Город):<br>" +
"7. Ваш логин Discord:<br>" +
"8. Ссылка на Ваш профиль VK:<br>" +
"9. Ознакомлены ли Вы с правилами сервера, правилами лидерства и другими правилами? Обязуетесь ли Вы их соблюдать?:<br>" +
"10. Готовы ли Вы получить блокировку аккаунта, если простоите на посту лидера менее 15-ти дней?:<br>" +
"11. Как Вы оцениваете свою адекватность? (10-ти бальная шкала):<br>" +
"12. Как Вы оцениваете свою грамотность? (10-ти бальная шкала):<br>" +
"13. Расскажите немного о себе:<br>" +
"14. Присутствует ли привязка аккаунта к E-Mail почте?:<br><br>" +

"[IMG]https://i.postimg.cc/W3s0FnbX/1619558447629-2.png[/IMG]<br><br>" +

"[SIZE=5][COLOR=#ff0000]Примечание:[/COLOR][/SIZE]<br><br>" +

"• Отбор кандидатов проходит строго на усмотрение Главного Следящего и непосредственно его заместителя<br>" +
"• Администрация в любой момент может закрыть заявление и назначить Лидера<br>" +
"• Не стоит писать Администрации в ЛС по вопросам обзвона и тд - это лишь усугубит ваши оценки<br>" +
"• Время обзвона зависит от выбора ГС/ЗГС<br><br>" +

"[IMG]https://i.postimg.cc/W3s0FnbX/1619558447629-2.png[/IMG]<br><br>" +

"[SIZE=5][COLOR=#ff0000]Важная информация:[/COLOR][/SIZE]<br><br>" +

"• Одобренным кандидатам быть в комнате Ожидание обзвона за 5 минут до начала с префиксом [K/LD/ГБ] *NickName*<br>" +
"• Опоздание на обзвон более чем на 5 минут – снятие с обзвона<br>" +
"• Обзвон будет проходить в данном дискорд канале - https://discord.gg/CmDnc4HyBj<br><br>" +

"[IMG]https://i.postimg.cc/W3s0FnbX/1619558447629-2.png[/IMG]<br><br>"+

'[COLOR=#5897ff]Всем желаю удачи![/COLOR][/FONT][/CENTER]',},
{
title: 'СМИ',
content: '[CENTER][FONT=times new roman][SIZE=4][IMG]https://i.postimg.cc/mkYxXTGb/dolorpavs-2.png[/IMG][/SIZE]<br><br>'+

"[COLOR=#5897ff][SIZE=5] Здравствуйте, уважаемые игроки. [/SIZE][/COLOR]<br><br>" +

"В данной теме вы можете подать свое заявление на должность" + "[COLOR=#ff9c08] Директор СМИ.<br><br>[/COLOR]" +
"[IMG]https://i.postimg.cc/W3s0FnbX/1619558447629-2.png[/IMG]<br><br>" +

"Требования к кандидату:<br><br>" +

"• Не иметь банов/варнов на сервере<br>" +
"• Не иметь подписок на запрещенные группы ВКонтакте<br>" +
"• Быть грамотным, адекватным, коммуникабельным, ответственным и креативным<br>" +
"• Уметь красиво и грамотно оформлять форум<br>" +
"• Иметь игровой уровень 8+<br>" +
"• Возраст 15+ (за обман администрации - бан), исключений нет<br>" +
"• Знания правил сервера, ГОСС<br><br>" +

"[IMG]https://i.postimg.cc/W3s0FnbX/1619558447629-2.png[/IMG]<br><br>" +

"[SIZE=5][COLOR=#5897ff]IC Information:[/COLOR][/SIZE]<br><br>" +

"1. Имя Фамилия:<br>" +
"2. Копия паспорта (/pass + /time):<br>" +
"3.Имеется ли опыт на руководящих должностях (подробно):<br>" +
"4. Какое значение имеет организация/какие функции выполняет:<br>" +
"5. Ваша стратегия на первые 2 дня на посту лидера:<br>" +
"6. История игры на проекте (подробно):<br><br>" +

"[SIZE=5][COLOR=#5897ff]OOC Information:[/COLOR][/SIZE]<br><br>" +

"1. Имя Фамилия:<br>" +
"2. Ваш возраст (полная дата рождения):<br>" +
"3. Скриншот статистики (/mm - 1):<br>" +
"4. Скриншот /history:<br>" +
"5. Средний онлайн в сутки:<br>" +
"6. Где Вы проживаете (Страна/Город):<br>" +
"7. Ваш логин Discord:<br>" +
"8. Ссылка на Ваш профиль VK:<br>" +
"9. Ознакомлены ли Вы с правилами сервера, правилами лидерства и другими правилами? Обязуетесь ли Вы их соблюдать?:<br>" +
"10. Готовы ли Вы получить блокировку аккаунта, если простоите на посту лидера менее 15-ти дней?:<br>" +
"11. Как Вы оцениваете свою адекватность? (10-ти бальная шкала):<br>" +
"12. Как Вы оцениваете свою грамотность? (10-ти бальная шкала):<br>" +
"13. Расскажите немного о себе:<br>" +
"14. Присутствует ли привязка аккаунта к E-Mail почте?:<br><br>" +

"[IMG]https://i.postimg.cc/W3s0FnbX/1619558447629-2.png[/IMG]<br><br>" +

"[SIZE=5][COLOR=#ff0000]Примечание:[/COLOR][/SIZE]<br><br>" +

"• Отбор кандидатов проходит строго на усмотрение Главного Следящего и непосредственно его заместителя<br>" +
"• Администрация в любой момент может закрыть заявление и назначить Лидера<br>" +
"• Не стоит писать Администрации в ЛС по вопросам обзвона и тд - это лишь усугубит ваши оценки<br>" +
"• Время обзвона зависит от выбора ГС/ЗГС<br><br>" +

"[IMG]https://i.postimg.cc/W3s0FnbX/1619558447629-2.png[/IMG]<br><br>" +

"[SIZE=5][COLOR=#ff0000]Важная информация:[/COLOR][/SIZE]<br><br>" +

"• Одобренным кандидатам быть в комнате Ожидание обзвона за 5 минут до начала с префиксом [K/LD/СМИ] *NickName*<br>" +
"• Опоздание на обзвон более чем на 5 минут – снятие с обзвона<br>" +
"• Обзвон будет проходить в данном дискорд канале - https://discord.gg/CmDnc4HyBj<br><br>" +

"[IMG]https://i.postimg.cc/W3s0FnbX/1619558447629-2.png[/IMG]<br><br>"+

'[COLOR=#5897ff]Всем желаю удачи![/COLOR][/FONT][/CENTER]',},
{
    title: 'ФСИН',
content: '[CENTER][FONT=times new roman][SIZE=4][IMG]https://i.postimg.cc/mkYxXTGb/dolorpavs-2.png[/IMG][/SIZE]<br><br>'+

"[COLOR=#5897ff][SIZE=5] Здравствуйте, уважаемые игроки. [/SIZE][/COLOR]<br><br>" +

"В данной теме вы можете подать свое заявление на должность" + "[COLOR=#08b5ff] Полковник ФСИН.<br><br>[/COLOR]" +
"[IMG]https://i.postimg.cc/W3s0FnbX/1619558447629-2.png[/IMG]<br><br>" +

"Требования к кандидату:<br><br>" +

"• Не иметь банов/варнов на сервере<br>" +
"• Не иметь подписок на запрещенные группы ВКонтакте<br>" +
"• Быть грамотным, адекватным, коммуникабельным, ответственным и креативным<br>" +
"• Уметь красиво и грамотно оформлять форум<br>" +
"• Иметь игровой уровень 8+<br>" +
"• Возраст 15+ (за обман администрации - бан), исключений нет<br>" +
"• Знания правил сервера, ГОСС<br><br>" +

"[IMG]https://i.postimg.cc/W3s0FnbX/1619558447629-2.png[/IMG]<br><br>" +

"[SIZE=5][COLOR=#5897ff]IC Information:[/COLOR][/SIZE]<br><br>" +

"1. Имя Фамилия:<br>" +
"2. Копия паспорта (/pass + /time):<br>" +
"3.Имеется ли опыт на руководящих должностях (подробно):<br>" +
"4. Какое значение имеет организация/какие функции выполняет:<br>" +
"5. Ваша стратегия на первые 2 дня на посту лидера:<br>" +
"6. История игры на проекте (подробно):<br><br>" +

"[SIZE=5][COLOR=#5897ff]OOC Information:[/COLOR][/SIZE]<br><br>" +

"1. Имя Фамилия:<br>" +
"2. Ваш возраст (полная дата рождения):<br>" +
"3. Скриншот статистики (/mm - 1):<br>" +
"4. Скриншот /history:<br>" +
"5. Средний онлайн в сутки:<br>" +
"6. Где Вы проживаете (Страна/Город):<br>" +
"7. Ваш логин Discord:<br>" +
"8. Ссылка на Ваш профиль VK:<br>" +
"9. Ознакомлены ли Вы с правилами сервера, правилами лидерства и другими правилами? Обязуетесь ли Вы их соблюдать?:<br>" +
"10. Готовы ли Вы получить блокировку аккаунта, если простоите на посту лидера менее 15-ти дней?:<br>" +
"11. Как Вы оцениваете свою адекватность? (10-ти бальная шкала):<br>" +
"12. Как Вы оцениваете свою грамотность? (10-ти бальная шкала):<br>" +
"13. Расскажите немного о себе:<br>" +
"14. Присутствует ли привязка аккаунта к E-Mail почте?:<br><br>" +

"[IMG]https://i.postimg.cc/W3s0FnbX/1619558447629-2.png[/IMG]<br><br>" +

"[SIZE=5][COLOR=#ff0000]Примечание:[/COLOR][/SIZE]<br><br>" +

"• Отбор кандидатов проходит строго на усмотрение Главного Следящего и непосредственно его заместителя<br>" +
"• Администрация в любой момент может закрыть заявление и назначить Лидера<br>" +
"• Не стоит писать Администрации в ЛС по вопросам обзвона и тд - это лишь усугубит ваши оценки<br>" +
"• Время обзвона зависит от выбора ГС/ЗГС<br><br>" +

"[IMG]https://i.postimg.cc/W3s0FnbX/1619558447629-2.png[/IMG]<br><br>" +

"[SIZE=5][COLOR=#ff0000]Важная информация:[/COLOR][/SIZE]<br><br>" +

"• Одобренным кандидатам быть в комнате Ожидание обзвона за 5 минут до начала с префиксом [K/LD/ФСИН] *NickName*<br>" +
"• Опоздание на обзвон более чем на 5 минут – снятие с обзвона<br>" +
"• Обзвон будет проходить в данном дискорд канале - https://discord.gg/CmDnc4HyBj<br><br>" +

"[IMG]https://i.postimg.cc/W3s0FnbX/1619558447629-2.png[/IMG]<br><br>"+

'[COLOR=#5897ff]Всем желаю удачи![/COLOR][/FONT][/CENTER]',
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

