// ==UserScript==
// @name Для Руководства ОПГ
// @namespace https://forum.blackrussia.online
// @version 0.0.2
// @description Для ГС/ЗГС ОПГ
// @author Maksim_Vitalievich
// @match https://forum.blackrussia.online/index.php?threads/*
// @include https://forum.blackrussia.online/index.php?threads/
// @grant none
// @license MIT
// @collaborator !
// @icon https://icons.iconarchive.com/icons/papirus-team/papirus-apps/48/emerald-theme-manager-icon-icon.png
// @downloadURL https://update.greasyfork.org/scripts/460940/%D0%94%D0%BB%D1%8F%20%D0%A0%D1%83%D0%BA%D0%BE%D0%B2%D0%BE%D0%B4%D1%81%D1%82%D0%B2%D0%B0%20%D0%9E%D0%9F%D0%93.user.js
// @updateURL https://update.greasyfork.org/scripts/460940/%D0%94%D0%BB%D1%8F%20%D0%A0%D1%83%D0%BA%D0%BE%D0%B2%D0%BE%D0%B4%D1%81%D1%82%D0%B2%D0%B0%20%D0%9E%D0%9F%D0%93.meta.js
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
title: 'Запрошу док-ва',
content:
'[SIZE=4][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br><br>'+
"[CENTER]Запрошу доказательства у лидера. Просьба не создавать подобных тем, иначе форумный аккаунт может быть заблокирован.[/CENTER]<br><br>"+
'[CENTER][Color=Orange]На рассмотрении.[/Color][/CENTER][/B][/SIZE]',
prefix: PIN_PREFIX,
status: true,
},
{
title: 'На рассмотрение',
content:
'[SIZE=4][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br><br>'+
"[CENTER]Ваша жалоба взята [Color=Orange]на рассмотрение[/Color]. Просьба не создавать подобных тем, иначе форумный аккаунт может быть заблокирован[/CENTER]<br><br>"+
'[CENTER]Ожидайте ответа.[/CENTER][/B][/SIZE]',
prefix: PIN_PREFIX,
status: true,
},
{
title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴Одобренные жалобы ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴'
},
{
title: 'Жалоба одобрена(с заявками)',
content:
'[SIZE=4][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br><br>'+
"[CENTER]Ваша жалоба была одобрена и будет проведена беседа с лидером, заявки будут рассмотрены.[/CENTER]<br><br>"+
"[CENTER][COLOR=rgb(0,128,0)]Одобрено[/COLOR].[/CENTER]<br><br>"+
'[CENTER]Приятной игры и времяпровождение на сервере [COLOR=rgb(144,0,32)]CHERRY[/COLOR].[/CENTER][/B][/SIZE]',
prefix: ACCEPT_PREFIX,
status: false,
},
{
title: 'Беседа(простая)',
content:
'[SIZE=4][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br><br>'+
"[CENTER]С лидером будет проведена беседа.[/CENTER]<br><br>"+
"[CENTER][COLOR=rgb(0,128,0)]Одобрено[/COLOR].[/CENTER]<br><br>"+
'[CENTER]Приятной игры и времяпровождение на сервере [COLOR=rgb(144,0,32)]CHERRY[/COLOR].[/CENTER][/B][/SIZE]',
prefix: ACCEPT_PREFIX,
status: false,
},
{
title: 'Беседа(строгая)',
content:
'[SIZE=4][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br><br>'+
"[CENTER]С лидером будет проведена[/CENTER]<br><br>"+
"[CENTER][COLOR=rgb(0,128,0)]Одобрено[/COLOR].[/CENTER]<br><br>"+
'[CENTER]Приятной игры и времяпровождение на сервере [COLOR=rgb(144,0,32)]CHERRY[/COLOR].[/CENTER][/B][/SIZE]',
prefix: ACCEPT_PREFIX,
status: false,
},
{
title: 'Беседа+Будут приняты меры',
content:
'[SIZE=4][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br><br>'+
"[CENTER]С лидером будет проведена беседа, также будут приняты меры.[/CENTER]<br><br>"+
"[CENTER][COLOR=rgb(0,128,0)]Одобрено[/COLOR].[/CENTER]<br><br>"+
'[CENTER]Приятной игры и времяпровождение на сервере [COLOR=rgb(144,0,32)]CHERRY[/COLOR].[/CENTER][/B][/SIZE]',
prefix: ACCEPT_PREFIX,
status: false,
},
{
title: 'Беседа+обновление темы',
content:
'[SIZE=4][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br><br>'+
"[CENTER]С лидером будет проведена беседа, тема будет обновлена.[/CENTER]<br><br>"+
"[CENTER][COLOR=rgb(0,128,0)]Одобрено[/COLOR].[/CENTER]<br><br>"+
'[CENTER]Приятной игры и времяпровождение на сервере [COLOR=rgb(144,0,32)]CHERRY[/COLOR].[/CENTER][/B][/SIZE]',
prefix: ACCEPT_PREFIX,
status: false,
},
{
title: 'Беседа + исправление ошибок',
content:
'[SIZE=4][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br><br>'+
"[CENTER]С лидером будет проведена беседа и ошибки будут исправлены.[/CENTER]<br><br>"+
"[CENTER][COLOR=rgb(0,128,0)]Одобрено[/COLOR].[/CENTER]<br><br>"+
'[CENTER]Приятной игры и времяпровождение на сервере [COLOR=rgb(144,0,32)]CHERRY[/COLOR].[/CENTER][/B][/SIZE]',
prefix: ACCEPT_PREFIX,
status: false,
},
{
title: 'Благодарим за информацию',
content:
'[SIZE=4][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br><br>'+
"[CENTER]Благодарим за предоставленную информацию.[/CENTER]<br><br>"+
"[CENTER][COLOR=rgb(255,0,0)]Закрыто[/COLOR].[/CENTER]<br><br>"+
'[CENTER]Приятной игры и времяпровождение на сервере [COLOR=rgb(144,0,32)]CHERRY[/COLOR].[/CENTER][/B][/SIZE]',
prefix: CLOSE_PREFIX,
status: false,
},
{
title: 'Тема будет подкорректирована.',
content:
'[SIZE=4][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br><br>'+
"[CENTER]Тема будет подкорректирована.[/CENTER]<br><br>"+
"[CENTER][COLOR=rgb(255,0,0)]Закрыто[/COLOR].[/CENTER]<br><br>"+
'[CENTER]Приятной игры и времяпровождение на сервере [COLOR=rgb(144,0,32)]CHERRY[/COLOR].[/CENTER][/B][/SIZE]',
prefix: CLOSE_PREFIX,
status: false,
},
{
title: 'Лидер был снят',
content:
'[SIZE=4][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br><br>'+
"[CENTER]Лидер был снят[/CENTER]<br><br>"+
"[CENTER][COLOR=rgb(255,0,0)]Закрыто[/COLOR].[/CENTER]<br><br>"+
'[CENTER]Приятной игры и времяпровождение на сервере [COLOR=rgb(144,0,32)]CHERRY[/COLOR].[/CENTER][/B][/SIZE]',
prefix: CLOSE_PREFIX,
status: false,
},
{
title: 'Данный игрок не лд',
content:
'[SIZE=4][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br><br>'+
"[CENTER]Данной игрок не является лидером.[/CENTER]<br><br>"+
"[CENTER][COLOR=rgb(255,0,0)]Закрыто[/COLOR].[/CENTER]<br><br>"+
'[CENTER]Приятной игры и времяпровождение на сервере [COLOR=rgb(144,0,32)]CHERRY[/COLOR].[/CENTER][/B][/SIZE]',
prefix: CLOSE_PREFIX,
status: false,
},
{
title: 'Заместитель снят',
content:
'[SIZE=4][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br><br>'+
"[CENTER]Заместитель был снят. Спасибо за обращение.[/CENTER]<br><br>"+
"[CENTER][COLOR=rgb(255,0,0)]Закрыто[/COLOR].[/CENTER]<br><br>"+
'[CENTER]Приятной игры и времяпровождение на сервере [COLOR=rgb(144,0,32)]CHERRY[/COLOR].[/CENTER][/B][/SIZE]',
prefix: CLOSE_PREFIX,
status: false,
},
{
title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴Отказанные жалобы ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴'
},
{
title: 'В жалобы на сотрудников',
content:
'[SIZE=4][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br><br>'+
"[CENTER]Обратитесь в жалобы на сотрудников. [/CENTER]<br>"+
"[CENTER][COLOR=rgb(255,0,0)]Отказано[/COLOR].[/CENTER]<br><br>"+
'[CENTER]Приятной игры и времяпровождение на сервере [COLOR=rgb(144,0,32)]CHERRY[/COLOR].[/CENTER][/B][/SIZE]',
prefix: UNACCEPT_PREFIX,
status: false,
},
{
title: 'В жалобы на игроков',
content:
'[SIZE=4][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br><br>'+
"[CENTER]Обратитесь в [URL='https://clck.ru/SRgaB'][COLOR=rgb(255,0,0)]«жалобы на игроков».[/color][/URL][/CENTER]<br><br>"+
"[CENTER][COLOR=rgb(255,0,0)]Отказано[/COLOR].[/CENTER]<br><br>"+
'[CENTER]Приятной игры и времяпровождение на сервере [COLOR=rgb(144,0,32)]CHERRY[/COLOR].[/CENTER][/B][/SIZE]',
prefix: UNACCEPT_PREFIX,
status: false,
},
{
title: 'В жалобы на адм',
content:
'[SIZE=4][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br><br>'+
"[CENTER]Обратитесь в [URL='https://clck.ru/UczVV'][COLOR=rgb(255,0,0)]«жалобы на администрацию».[/color][/URL][/CENTER]<br><br>"+
"[CENTER][COLOR=rgb(255,0,0)]Отказано[/COLOR].[/CENTER]<br><br>"+
'[CENTER]Приятной игры и времяпровождение на сервере [COLOR=rgb(144,0,32)]CHERRY[/COLOR].[/CENTER][/B][/SIZE]',
prefix: UNACCEPT_PREFIX,
status: false,
},
{
title: 'Не по форме',
content:
'[SIZE=4][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}!<br><br>'+
"[CENTER]Ваша жалоба составлена не по форме. Ознакомьтесь с [URL='https://clck.ru/32xaHd'][COLOR=rgb(255,0,0)]«правилами подачи жалоб на лидеров».[/color][/URL][/CENTER]<br><br>"+
'[CENTER]Приятной игры и времяпровождение на сервере [COLOR=rgb(144,0,32)]CHERRY[/COLOR].[/CENTER][/B][/SIZE]',
prefix: UNACCEPT_PREFIX,
status: false,
},
{
title: 'Нет нарушений',
content:
'[SIZE=4][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br><br>'+
"[CENTER]Нет нарушений со стороны лидера.[/CENTER]<br><br>"+
"[CENTER][COLOR=rgb(255,0,0)]Отказано[/COLOR].[/CENTER]<br><br>"+
'[CENTER]Приятной игры и времяпровождение на сервере [COLOR=rgb(144,0,32)]CHERRY[/COLOR].[/CENTER][/B][/SIZE]',
prefix: UNACCEPT_PREFIX,
status: false,
},
{
title: 'Отсутствуют доки',
content:
'[SIZE=4][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br><br>'+
"[CENTER]В вашей жалобе отсутствуют доказательства. Создайте повторную тему с доказательствами.[/CENTER]<br><br>"+
"[CENTER][COLOR=rgb(255,0,0)]Отказано[/COLOR].[/CENTER]<br><br>"+
'[CENTER]Приятной игры и времяпровождение на сервере [COLOR=rgb(144,0,32)]CHERRY[/COLOR].[/CENTER][/B][/SIZE]',
prefix: UNACCEPT_PREFIX,
status: false,
},
{
title: 'Отредактированы',
content:
'[SIZE=4][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br><br>'+
"[CENTER]Ваши доказательства отредактированы, доказательства должны быть в первоначальном виде.[/CENTER]<br><br>"+
"[CENTER][COLOR=rgb(255,0,0)]Отказано[/COLOR].[/CENTER]<br><br>"+
'[CENTER]Приятной игры и времяпровождение на сервере [COLOR=rgb(144,0,32)]CHERRY[/COLOR].[/CENTER][/B][/SIZE]',
prefix: UNACCEPT_PREFIX,
status: false,
},
{
title: '3-е лицо.',
content:
'[SIZE=4][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br><br>'+
"[CENTER]Жалоба составлена от 3-его лица[/CENTER]<br><br>"+
"[CENTER][COLOR=rgb(255,0,0)]Отказано[/COLOR].[/CENTER]<br><br>"+
'[CENTER]Приятной игры и времяпровождение на сервере [COLOR=rgb(144,0,32)]CHERRY[/COLOR].[/CENTER][/B][/SIZE]',
prefix: UNACCEPT_PREFIX,
status: false,
},
{
title: 'нет тайма',
content:
'[SIZE=4][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br><br>'+
"[CENTER]Нет /time.[/CENTER]<br><br>"+
"[CENTER][COLOR=rgb(255,0,0)]Отказано[/COLOR].[/CENTER]<br><br>"+
'[CENTER]Приятной игры и времяпровождение на сервере [COLOR=rgb(144,0,32)]CHERRY[/COLOR].[/CENTER][/B][/SIZE]',
prefix: UNACCEPT_PREFIX,
status: false,
},
{
title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴Еженедельные отчеты ЛД ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴'
},
{
title: '10 Баллов',
content:
'[SIZE=4][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br><br>'+
"[CENTER]Выдам 10 баллов.[/CENTER]<br><br>"+
"[CENTER][COLOR=rgb(0,128,0)]Рассмотрено[/COLOR].[/CENTER]<br><br>",
prefix: UNACCEPT_PREFIX,
status: false,
},
{
title: '15 Баллов',
content:
'[SIZE=4][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br><br>'+
"[CENTER]Выдам 15 баллов.[/CENTER]<br><br>"+
"[CENTER][COLOR=rgb(0,128,0)]Рассмотрено[/COLOR].[/CENTER]<br><br>",
prefix: UNACCEPT_PREFIX,
status: false,
},
{
title: 'уст',
content:
'[SIZE=4][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br><br>'+
"[CENTER]Устное предупреждение будет снято.[/CENTER]<br><br>"+
"[CENTER][COLOR=rgb(0,128,0)]Рассмотрено[/COLOR].[/CENTER]<br><br>",
prefix: UNACCEPT_PREFIX,
status: false,
},
{
title: 'пред',
content:
'[SIZE=4][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br><br>'+
"[CENTER]Предупреждение будет снято.[/CENTER]<br><br>"+
"[CENTER][COLOR=rgb(0,128,0)]Рассмотрено[/COLOR].[/CENTER]<br><br>",
prefix: UNACCEPT_PREFIX,
status: false,
},
{
title: 'выг',
content:
'[SIZE=4][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br><br>'+
"[CENTER]Выговор будет снят.[/CENTER]<br><br>"+
"[CENTER][COLOR=rgb(0,128,0)]Рассмотрено[/COLOR].[/CENTER]<br><br>",
prefix: UNACCEPT_PREFIX,
status: false,
},
{
title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴Заявки ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴'
},
{
title: 'А-ОПГ',
content:
'[SIZE=5][CENTER][FONT=Times New Roman][B][Color=rgb(247,218,100)]Открыты заявления на лидерский пост организации "Арзамасское ОПГ"[/COLOR][/SIZE]<br><br>'+
'[SIZE=4]Подавать заявления строго по форме, предоставленной ниже, игнорирование данного сообщения - отказ в лидерском посту.<br><br>'+
'[SIZE=4][Color=rgb(247,218,100)]Требование к кандидату[/COLOR]:<br><br>'+
"[QUOTE]- Иметь Discord и исправно работающий микрофон.<br> - Быть в возрасте 15 лет (исключений нет).<br> - Не иметь действующих варнов/банов.<br> - Иметь никнейм формата Имя_Фамилия.<br> - Игровой уровень персонажа 8. <br> - Быть ознакомленным с правилами сервера/лидеров/государственных организаций.<br> - Иметь одобреную рп биографию.<br>- Иметь ВК с открытым профилем и личными сообщениями. [/QUOTE]<br>"+
"1. Никнейм: Текст.<br> 2. Игровой уровень: Текст.<br> 3. Скриншот статистики аккаунта с /time: Ссылка.<br> 4. Средний ежедневный онлайн: Текст.<br> 5. Были ли варны/баны (если да, то за что): Текст.<br> 6. Есть ли у вас твинк аккаунты (если да, то написать никнеймы): Текст.<br> 7. Почему именно вы должны занять пост лидера: Текст.<br> 8. Имеется ли опыт в данной организации: Текст<br> 9. Ваши предложения по улучшению фракции (максимально подробно): Текст.<br> 10. Были ли вы лидером любой другой организации: Текст.<br> 11. Ваш часовой пояс: Текст.<br> 12. Ссылка на страницу во вконтакте: Ссылка.<br> 13. Логин Discord аккаунта: Текст.<br> 14. Ваше реальное имя: Текст.<br> 15. Ваш реальный возраст: Текст.<br> 16. Город, в котором проживаете: Текст.<br> 17.Ссылка на вашу одобренную рп биографию: Ссылка.[/CENTER]",
},
{
title: 'Б-ОПГ',
content:
'[SIZE=5][CENTER][FONT=Times New Roman][B][Color=rgb(247,218,100)]Открыты заявления на лидерский пост организации "Батыревское ОПГ"[/COLOR][/SIZE]<br><br>'+
'[SIZE=4]Подавать заявления строго по форме, предоставленной ниже, игнорирование данного сообщения - отказ в лидерском посту.<br><br>'+
'[SIZE=4][Color=rgb(247,218,100)]Требование к кандидату[/COLOR]:<br><br>'+
"[QUOTE]- Иметь Discord и исправно работающий микрофон.<br> - Быть в возрасте 15 лет (исключений нет).<br> - Не иметь действующих варнов/банов.<br> - Иметь никнейм формата Имя_Фамилия.<br> - Игровой уровень персонажа 8. <br> - Быть ознакомленным с правилами сервера/лидеров/государственных организаций.<br> - Иметь одобреную рп биографию.<br>- Иметь ВК с открытым профилем и личными сообщениями. [/QUOTE]<br>"+
"1. Никнейм: Текст.<br> 2. Игровой уровень: Текст.<br> 3. Скриншот статистики аккаунта с /time: Ссылка.<br> 4. Средний ежедневный онлайн: Текст.<br> 5. Были ли варны/баны (если да, то за что): Текст.<br> 6. Есть ли у вас твинк аккаунты (если да, то написать никнеймы): Текст.<br> 7. Почему именно вы должны занять пост лидера: Текст.<br> 8. Имеется ли опыт в данной организации: Текст<br> 9. Ваши предложения по улучшению фракции (максимально подробно): Текст.<br> 10. Были ли вы лидером любой другой организации: Текст.<br> 11. Ваш часовой пояс: Текст.<br> 12. Ссылка на страницу во вконтакте: Ссылка.<br> 13. Логин Discord аккаунта: Текст.<br> 14. Ваше реальное имя: Текст.<br> 15. Ваш реальный возраст: Текст.<br> 16. Город, в котором проживаете: Текст.<br> 17.Ссылка на вашу одобренную рп биографию: Ссылка.[/CENTER]",
},
{
title: 'Л-ОПГ',
content:
'[SIZE=5][CENTER][FONT=Times New Roman][B][Color=rgb(247,218,100)]Открыты заявления на лидерский пост организации "Лыткаринское ОПГ"[/COLOR][/SIZE]<br><br>'+
'[SIZE=4]Подавать заявления строго по форме, предоставленной ниже, игнорирование данного сообщения - отказ в лидерском посту.<br><br>'+
'[SIZE=4][Color=rgb(247,218,100)]Требование к кандидату[/COLOR]:<br><br>'+
"[QUOTE]- Иметь Discord и исправно работающий микрофон.<br> - Быть в возрасте 15 лет (исключений нет).<br> - Не иметь действующих варнов/банов.<br> - Иметь никнейм формата Имя_Фамилия.<br> - Игровой уровень персонажа 8. <br> - Быть ознакомленным с правилами сервера/лидеров/государственных организаций.<br> - Иметь одобреную рп биографию.<br>- Иметь ВК с открытым профилем и личными сообщениями. [/QUOTE]<br>"+
"1. Никнейм: Текст.<br> 2. Игровой уровень: Текст.<br> 3. Скриншот статистики аккаунта с /time: Ссылка.<br> 4. Средний ежедневный онлайн: Текст.<br> 5. Были ли варны/баны (если да, то за что): Текст.<br> 6. Есть ли у вас твинк аккаунты (если да, то написать никнеймы): Текст.<br> 7. Почему именно вы должны занять пост лидера: Текст.<br> 8. Имеется ли опыт в данной организации: Текст<br> 9. Ваши предложения по улучшению фракции (максимально подробно): Текст.<br> 10. Были ли вы лидером любой другой организации: Текст.<br> 11. Ваш часовой пояс: Текст.<br> 12. Ссылка на страницу во вконтакте: Ссылка.<br> 13. Логин Discord аккаунта: Текст.<br> 14. Ваше реальное имя: Текст.<br> 15. Ваш реальный возраст: Текст.<br> 16. Город, в котором проживаете: Текст.<br> 17.Ссылка на вашу одобренную рп биографию: Ссылка.[/CENTER]",
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