// ==UserScript==
// @name Gabik | КФ [83] 
// @name:ru Gabik | КФ [83]  
// @description Скрипт для Кураторов форума 
// @version 3.6
// @namespace https://forum.blackrussia.online
// @match       https://forum.blackrussia.online/threads/*
// @match       https://forum.blackrussia.online/threads/
// @grant       none
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/530793/Gabik%20%7C%20%D0%9A%D0%A4%20%5B83%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/530793/Gabik%20%7C%20%D0%9A%D0%A4%20%5B83%5D.meta.js
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
    title: `Свой текст`,
    content: "[CENTER][FONT=georgia]Доброго времени суток, уважаемый(-ая) [U]{{ user.name }}[/U]![/font][/center]<br><br>" +
    "[font=georgia][center]Текст[/center][/font]<br><br>" +
    "[center][FONT=georgia]Приятной игры на сервере [COLOR=rgb(255, 215, 0)]TVER[/COLOR].[/center][/FONT]",
 
}, 
 
 
{
    title: `-------------------------------------------------------------------- РП биографии --------------------------------------------------------------------`,
},
 
 
 
{
    title: `Одобрено`,
    content: "[CENTER][FONT=georgia]Доброго времени суток, уважаемый(-ая) [U]{{ user.name }}[/U]![/font][/center]<br><br>" +
    "[font=georgia][center]Ваша [COLOR=rgb(255, 0, 0)]RolePlay[/COLOR] [COLOR=rgb(255, 0, 0)]биография[/COLOR] была рассмотрена и [COLOR=rgb(255, 0, 0)]получила статус[/COLOR]:[/font][center]<br>" +
    "[center][COLOR=rgb(127, 255, 0)][ICODE]Одобрено[/ICODE][/color][/center]<br><br>" +
    "[center][FONT=georgia]Приятной игры на сервере [COLOR=rgb(255, 215, 0)]TVER[/COLOR].[/center][/FONT]",
    prefix: ACCEPT_PREFIX,
    status: false,
},
 
 
{
    title: `копипаст`,
    content: "[CENTER][FONT=georgia]Доброго времени суток, уважаемый(-ая) [U]{{ user.name }}[/U]![/font][/center]<br><br>" +
    "[font=georgia][center]Ваша [COLOR=rgb(255, 0, 0)]RolePlay[/COLOR] [COLOR=rgb(255, 0, 0)]биография[/COLOR] была рассмотрена и [COLOR=rgb(255, 0, 0)]получила статус[/COLOR]:[/font][center]<br>" +
    "[center][COLOR=red][ICODE]Отказано[/ICODE][/color][/center]<br><br>" +
    "[center][font=Georgia][color=red]Причина[/color]: Копипаст. [/font][/center]<br><br>" +
    "[center][FONT=georgia]Приятной игры на сервере [COLOR=rgb(255, 215, 0)]TVER[/COLOR].[/center][/FONT]",
    prefix: UNACCEPT_PREFIX,
    status: false,
},
 
{
    title: `дата рождения указана некорректно`,
    content: "[CENTER][FONT=georgia]Доброго времени суток, уважаемый(-ая) [U]{{ user.name }}[/U]![/font][/center]<br><br>" +
    "[font=georgia][center]Ваша [COLOR=rgb(255, 0, 0)]RolePlay[/COLOR] [COLOR=rgb(255, 0, 0)]биография[/COLOR] была рассмотрена и [COLOR=rgb(255, 0, 0)]получила статус[/COLOR]:[/font][center]<br>" +
    "[center][COLOR=red][ICODE]Отказано[/ICODE][/color][/center]<br><br>" +
 "[center][font=Georgia][color=red]Причина[/color]: Дата рождения должна быть указана в формате дд.мм.гггг[/font][/center]<br><br>" +
  "[center][FONT=georgia]Приятной игры на сервере [COLOR=rgb(255, 215, 0)]TVER[/COLOR].[/center][/FONT]",
    prefix: UNACCEPT_PREFIX,
    status: false,
},
 
{
    title: `оос информация`,
    content: "[CENTER][FONT=georgia]Доброго времени суток, уважаемый(-ая) [U]{{ user.name }}[/U]![/font][/center]<br><br>" +
    "[font=georgia][center]Ваша [COLOR=rgb(255, 0, 0)]RolePlay[/COLOR] [COLOR=rgb(255, 0, 0)]биография[/COLOR] была рассмотрена и [COLOR=rgb(255, 0, 0)]получила статус[/COLOR]:[/font][center]<br>" +
    "[center][COLOR=red][ICODE]Отказано[/ICODE][/color][/center]<br><br>" +
    "[center][font=Georgia][color=red]Причина[/color]: Наличие OOC информации в RolePlay биографии. Уберите названия/города и т.д, которых не существует на карте Black Russia.[/font][/center]<br><br>" +
    "[center][FONT=georgia]Приятной игры на сервере [COLOR=rgb(255, 215, 0)]TVER[/COLOR].[/center][/FONT]",
    prefix: UNACCEPT_PREFIX,
    status: false,
},
 
 
 
{
    title: `Не по форме`,
    content: "[CENTER][FONT=georgia]Доброго времени суток, уважаемый(-ая) [U]{{ user.name }}[/U]![/font][/center]<br><br>" +
    "[font=georgia][center]Ваша [COLOR=rgb(255, 0, 0)]RolePlay[/COLOR] [COLOR=rgb(255, 0, 0)]биография[/COLOR] была рассмотрена и [COLOR=rgb(255, 0, 0)]получила статус[/COLOR]:[/font][center]<br>" +
    "[center][COLOR=red][ICODE]Отказано[/ICODE][/color][/center]<br><br>" +
    "[center][font=Georgia][color=red]Причина[/color]: Не по форме. [/font][/center]<br><br>" +
    "[center][FONT=georgia]Приятной игры на сервере [COLOR=rgb(255, 215, 0)]TVER[/COLOR].[/center][/FONT]",
    prefix: UNACCEPT_PREFIX,
    status: false,
},
 
{
    title: `Заголовок не по форме`,
    content: "[CENTER][FONT=georgia]Доброго времени суток, уважаемый(-ая) [U]{{ user.name }}[/U]![/font][/center]<br><br>" +
    "[font=georgia][center]Ваша [COLOR=rgb(255, 0, 0)]RolePlay[/COLOR] [COLOR=rgb(255, 0, 0)]биография[/COLOR] была рассмотрена и [COLOR=rgb(255, 0, 0)]получила статус[/COLOR]:[/font][center]<br>" +
    "[center][COLOR=red][ICODE]Отказано[/ICODE][/color][/center]<br><br>" +
    "[center][font=Georgia][color=red]Причина[/color]: Заголовок составлен не по форме. Общий формат заголовка: \"RolePlay биография | Имя Фамилия\" или \"RolePlay биография гражданина Имя Фамилия\". [/font][/center]<br><br>" +
    "[center][FONT=georgia]Приятной игры на сервере [COLOR=rgb(255, 215, 0)]TVER[/COLOR].[/center][/FONT]",
    prefix: UNACCEPT_PREFIX,
    status: false,
},
 
{
    title: `Отказано (NickName не на рус.)`,
    content: "[CENTER][FONT=georgia]Доброго времени суток, уважаемый(-ая) [U]{{ user.name }}[/U]![/font][/center]<br><br>" +
    "[font=georgia][center]Ваша [COLOR=rgb(255, 0, 0)]RolePlay[/COLOR] [COLOR=rgb(255, 0, 0)]биография[/COLOR] была рассмотрена и [COLOR=rgb(255, 0, 0)]получила статус[/COLOR]:[/font][center]<br>" +
    "[center][COLOR=red][ICODE]Отказано[/ICODE][/color][/center]<br><br>" +
    "[center][font=Georgia][color=red]Причина[/color]: Имя и фамилия персонажа должны быть указаны на русском языке, без пробелов, как в заголовке, так и в самой теме. [/font][/center]<br><br>" +
    "[center][FONT=georgia]Приятной игры на сервере [COLOR=rgb(255, 215, 0)]TVER[/COLOR].[/center][/FONT]",
    prefix: UNACCEPT_PREFIX,
    status: false,
},
 
{
    title: `Дата рождения не совпадает с возрастом`,
    content: "[CENTER][FONT=georgia]Доброго времени суток, уважаемый(-ая) [U]{{ user.name }}[/U]![/font][/center]<br><br>" +
    "[font=georgia][center]Ваша [COLOR=rgb(255, 0, 0)]RolePlay[/COLOR] [COLOR=rgb(255, 0, 0)]биография[/COLOR] была рассмотрена и [COLOR=rgb(255, 0, 0)]получила статус[/COLOR]:[/font][center]<br>" +
    "[center][COLOR=red][ICODE]Отказано[/ICODE][/color][/center]<br><br>" +
    "[center][font=Georgia][color=red]Причина[/color]: Возраст не совпадает с датой рождения. [/font][/center]<br><br>" +
    "[center][FONT=georgia]Приятной игры на сервере [COLOR=rgb(255, 215, 0)]TVER[/COLOR].[/center][/FONT]",
    prefix: UNACCEPT_PREFIX,
    status: false,
},
 
{
    title: `Мало инфо в пунктах жизнь в детстве и юности и взрослая жизнь вкл настоящее время`,
    content: "[CENTER][FONT=georgia]Доброго времени суток, уважаемый(-ая) [U]{{ user.name }}[/U]![/font][/center]<br><br>" +
    "[font=georgia][center]Ваша [COLOR=rgb(255, 0, 0)]RolePlay[/COLOR] [COLOR=rgb(255, 0, 0)]биография[/COLOR] была рассмотрена и [COLOR=rgb(255, 0, 0)]получила статус[/COLOR]:[/font][center]<br>" +
    "[center][COLOR=red][ICODE]Отказано[/ICODE][/color][/center]<br><br>" +
    "[center][font=Georgia][color=red]Причина[/color]: Мало информации в пунктах \"Жизнь в детстве и юности\" и \"Взрослая жизнь (включая настоящее время)\". [/font][/center]<br><br>" +
    "[center][FONT=georgia]Приятной игры на сервере [COLOR=rgb(255, 215, 0)]TVER[/COLOR].[/center][/FONT]",
    prefix: UNACCEPT_PREFIX,
    status: false,
},
 
 
 
{
    title: `Мало инфо в пункте жизнь в детстве и юности`,
    content: "[CENTER][FONT=georgia]Доброго времени суток, уважаемый(-ая) [U]{{ user.name }}[/U]![/font][/center]<br><br>" +
    "[font=georgia][center]Ваша [COLOR=rgb(255, 0, 0)]RolePlay[/COLOR] [COLOR=rgb(255, 0, 0)]биография[/COLOR] была рассмотрена и [COLOR=rgb(255, 0, 0)]получила статус[/COLOR]:[/font][center]<br>" +
    "[center][COLOR=red][ICODE]Отказано[/ICODE][/color][/center]<br><br>" +
    "[center][font=Georgia][color=red]Причина[/color]: Мало информации в пункте \"Жизнь в детстве и юности\".[/font][/center]<br><br>" +
    "[center][FONT=georgia]Приятной игры на сервере [COLOR=rgb(255, 215, 0)]TVER[/COLOR].[/center][/FONT]",
    prefix: UNACCEPT_PREFIX,
    status: false,
},
 
 
{
    title: `Мало инфо в пункте взрослая жизнь вкл настоящее время`,
    content: "[CENTER][FONT=georgia]Доброго времени суток, уважаемый(-ая) [U]{{ user.name }}[/U]![/font][/center]<br><br>" +
    "[font=georgia][center]Ваша [COLOR=rgb(255, 0, 0)]RolePlay[/COLOR] [COLOR=rgb(255, 0, 0)]биография[/COLOR] была рассмотрена и [COLOR=rgb(255, 0, 0)]получила статус[/COLOR]:[/font][center]<br>" +
    "[center][COLOR=red][ICODE]Отказано[/ICODE][/color][/center]<br><br>" +
    "[center][font=Georgia][color=red]Причина[/color]: Мало информации в пункте \"Взрослая жизнь (включая настоящее время)\". [/font][/center]<br><br>" +
    "[center][FONT=georgia]Приятной игры на сервере [COLOR=rgb(255, 215, 0)]TVER[/COLOR].[/center][/FONT]",
    prefix: UNACCEPT_PREFIX,
    status: false,
},
 
{
    title: `Множество грамматических ошибок`,
    content: "[CENTER][FONT=georgia]Доброго времени суток, уважаемый(-ая) [U]{{ user.name }}[/U]![/font][/center]<br><br>" +
    "[font=georgia][center]Ваша [COLOR=rgb(255, 0, 0)]RolePlay[/COLOR] [COLOR=rgb(255, 0, 0)]биография[/COLOR] была рассмотрена и [COLOR=rgb(255, 0, 0)]получила статус[/COLOR]:[/font][center]<br>" +
    "[center][COLOR=red][ICODE]Отказано[/ICODE][/color][/center]<br><br>" +
    "[center][font=Georgia][color=red]Причина[/color]: Множество грамматических ошибок. [/font][/center]<br><br>" +
    "[center][FONT=georgia]Приятной игры на сервере [COLOR=rgb(255, 215, 0)]TVER[/COLOR].[/center][/FONT]",
    prefix: UNACCEPT_PREFIX,
    status: false,
},
 
{
    title: `Биография от первого лица`,
    content: "[CENTER][FONT=georgia]Доброго времени суток, уважаемый(-ая) [U]{{ user.name }}[/U]![/font][/center]<br><br>" +
    "[font=georgia][center]Ваша [COLOR=rgb(255, 0, 0)]RolePlay[/COLOR] [COLOR=rgb(255, 0, 0)]биография[/COLOR] была рассмотрена и [COLOR=rgb(255, 0, 0)]получила статус[/COLOR]:[/font][center]<br>" +
    "[center][COLOR=red][ICODE]Отказано[/ICODE][/color][/center]<br><br>" +
    "[center][font=Georgia][color=red]Причина[/color]: Биография должна вестись от третьего лица.[/font][/center]<br><br>" +
    "[center][FONT=georgia]Приятной игры на сервере [COLOR=rgb(255, 215, 0)]TVER[/COLOR].[/center][/FONT]",
    prefix: UNACCEPT_PREFIX,
    status: false,
},
 
{
    title: `Минимальный возраст в биографии - 18 лет, максимальный - 65 лет`,
    content: "[CENTER][FONT=georgia]Доброго времени суток, уважаемый(-ая) [U]{{ user.name }}[/U]![/font][/center]<br><br>" +
    "[font=georgia][center]Ваша [COLOR=rgb(255, 0, 0)]RolePlay[/COLOR] [COLOR=rgb(255, 0, 0)]биография[/COLOR] была рассмотрена и [COLOR=rgb(255, 0, 0)]получила статус[/COLOR]:[/font][center]<br>" +
    "[center][COLOR=red][ICODE]Отказано[/ICODE][/color][/center]<br><br>" +
    "[center][font=Georgia][color=red]Причина[/color]: Минимальный возраст в биографии - 18 лет, максимальный - 65 лет. [/font][/center]<br><br>" +
    "[center][FONT=georgia]Приятной игры на сервере [COLOR=rgb(255, 215, 0)]TVER[/COLOR].[/center][/FONT]",
    prefix: UNACCEPT_PREFIX,
    status: false,
},
 
{
    title: `Вторая биография для аккаунта`,
    content: "[CENTER][FONT=georgia]Доброго времени суток, уважаемый(-ая) [U]{{ user.name }}[/U]![/font][/center]<br><br>" +
    "[font=georgia][center]Ваша [COLOR=rgb(255, 0, 0)]RolePlay[/COLOR] [COLOR=rgb(255, 0, 0)]биография[/COLOR] была рассмотрена и [COLOR=rgb(255, 0, 0)]получила статус[/COLOR]:[/font][center]<br>" +
    "[center][COLOR=red][ICODE]Отказано[/ICODE][/color][/center]<br><br>" +
    "[center][font=Georgia][color=red]Причина[/color]: Запрещено создавать более чем одной биографии для одного игрового аккаунта. [/font][/center]<br><br>" +
    "[center][FONT=georgia]Приятной игры на сервере [COLOR=rgb(255, 215, 0)]TVER[/COLOR].[/center][/FONT]",
    prefix: UNACCEPT_PREFIX,
    status: false,
},
 
{
    title: `Множество орфографических ошибок`,
    content: "[CENTER][FONT=georgia]Доброго времени суток, уважаемый(-ая) [U]{{ user.name }}[/U]![/font][/center]<br><br>" +
    "[font=georgia][center]Ваша [COLOR=rgb(255, 0, 0)]RolePlay[/COLOR] [COLOR=rgb(255, 0, 0)]биография[/COLOR] была рассмотрена и [COLOR=rgb(255, 0, 0)]получила статус[/COLOR]:[/font][center]<br>" +
    "[center][COLOR=red][ICODE]Отказано[/ICODE][/color][/center]<br><br>" +
    "[center][font=Georgia][color=red]Причина[/color]: Множество орфографических ошибок. [/font][/center]<br><br>" +
    "[center][FONT=georgia]Приятной игры на сервере [COLOR=rgb(255, 215, 0)]TVER[/COLOR].[/center][/FONT]",
    prefix: UNACCEPT_PREFIX,
    status: false,
},
 
 
{
    title: `Мало информации во всех пунктах`,
    content: "[CENTER][FONT=georgia]Доброго времени суток, уважаемый(-ая) [U]{{ user.name }}[/U]![/font][/center]<br><br>" +
    "[font=georgia][center]Ваша [COLOR=rgb(255, 0, 0)]RolePlay[/COLOR] [COLOR=rgb(255, 0, 0)]биография[/COLOR] была рассмотрена и [COLOR=rgb(255, 0, 0)]получила статус[/COLOR]:[/font][center]<br>" +
    "[center][COLOR=red][ICODE]Отказано[/ICODE][/color][/center]<br><br>" +
    "[center][font=Georgia][color=red]Причина[/color]: Мало информации во всех пунктах. [/font][/center]<br><br>" +
    "[center][FONT=georgia]Приятной игры на сервере [COLOR=rgb(255, 215, 0)]TVER[/COLOR].[/center][/FONT]",
    prefix: UNACCEPT_PREFIX,
    status: false,
},
 
{
    title: `Не заполнены некоторые пункты`,
    content: "[CENTER][FONT=georgia]Доброго времени суток, уважаемый(-ая) [U]{{ user.name }}[/U]![/font][/center]<br><br>" +
    "[font=georgia][center]Ваша [COLOR=rgb(255, 0, 0)]RolePlay[/COLOR] [COLOR=rgb(255, 0, 0)]биография[/COLOR] была рассмотрена и [COLOR=rgb(255, 0, 0)]получила статус[/COLOR]:[/font][center]<br>" +
    "[center][COLOR=red][ICODE]Отказано[/ICODE][/color][/center]<br><br>" +
    "[center][font=Georgia][color=red]Причина[/color]: Не заполнены некоторые пункты. [/font][/center]<br><br>" +
    "[center][FONT=georgia]Приятной игры на сервере [COLOR=rgb(255, 215, 0)]TVER[/COLOR].[/center][/FONT]",
    prefix: UNACCEPT_PREFIX,
    status: false,
},
 
{
    title: `пропаганда религий или националистических взглядов`,
    content: "[CENTER][FONT=georgia]Доброго времени суток, уважаемый(-ая) [U]{{ user.name }}[/U]![/font][/center]<br><br>" +
    "[font=georgia][center]Ваша [COLOR=rgb(255, 0, 0)]RolePlay[/COLOR] [COLOR=rgb(255, 0, 0)]биография[/COLOR] была рассмотрена и [COLOR=rgb(255, 0, 0)]получила статус[/COLOR]:[/font][center]<br>" +
    "[center][COLOR=red][ICODE]Отказано[/ICODE][/color][/center]<br><br>" +
    "[center][font=Georgia][color=red]Причина[/color]: Запрещена пропаганда религиозных, националистических взглядов или высказываний[/font][/center]<br><br>" +
    "[center][FONT=georgia]Приятной игры на сервере [COLOR=rgb(255, 215, 0)]TVER[/COLOR].[/center][/FONT]",
    prefix: UNACCEPT_PREFIX,
    status: false,
},
 
{
    title: `Слишком резкая цветовая палитра`,
    content: "[CENTER][FONT=georgia]Доброго времени суток, уважаемый(-ая) [U]{{ user.name }}[/U]![/font][/center]<br><br>" +
    "[font=georgia][center]Ваша [COLOR=rgb(255, 0, 0)]RolePlay[/COLOR] [COLOR=rgb(255, 0, 0)]биография[/COLOR] была рассмотрена и [COLOR=rgb(255, 0, 0)]получила статус[/COLOR]:[/font][center]<br>" +
    "[center][COLOR=red][ICODE]Отказано[/ICODE][/color][/center]<br><br>" +
    "[center][font=Georgia][color=red]Причина[/color]: Слишком резкая цветовая палитра. [/font][/center]<br><br>" +
    "[center][FONT=georgia]Приятной игры на сервере [COLOR=rgb(255, 215, 0)]TVER[/COLOR].[/center][/FONT]",
    prefix: UNACCEPT_PREFIX,
    status: false,
},
 
{
    title: `--------------------------------------------------------------------Рп ситуации--------------------------------------------------------------------`,
},
 
 
{
    title: `Одобрено`,
    content: "[CENTER][FONT=georgia]Доброго времени суток, уважаемый(-ая) [U]{{ user.name }}[/U]![/font][/center]<br><br>" +
    "[font=georgia][center]Ваша [COLOR=rgb(255, 0, 0)]RolePlay[/COLOR] [COLOR=rgb(255, 0, 0)] ситуация[/COLOR] была рассмотрена и [COLOR=rgb(255, 0, 0)]получила статус[/COLOR]:[/font][center]<br>" +
    "[center][COLOR=rgb(127, 255, 0)][ICODE]Одобрено[/ICODE][/color][/center]<br><br>" +
    "[center][FONT=georgia]Приятной игры на сервере [COLOR=rgb(255, 215, 0)]TVER[/COLOR].[/center][/FONT]",
    prefix: ACCEPT_PREFIX,
    status: false,
},
 
 
 
{
    title: `Ошиблись разделом`,
    content: "[CENTER][FONT=georgia]Доброго времени суток, уважаемый(-ая) [U]{{ user.name }}[/U]![/font][/center]<br><br>" +
    "[font=georgia][center]Вы ошиблись разделом. Данный раздел предназначен для написания RolePlay ситуаций.[center][/font]<br><br>" +
    "[center][FONT=georgia]Приятной игры на сервере [COLOR=rgb(255, 215, 0)]TVER[/COLOR].[/center][/FONT]",
    prefix: CLOSE_PREFIX,
    status: false,
 
},
 
{
    title: `Не по форме`,
    content: "[CENTER][FONT=georgia]Доброго времени суток, уважаемый(-ая) [U]{{ user.name }}[/U]![/font][/center]<br><br>" +
    "[font=georgia][center]Ваша [COLOR=rgb(255, 0, 0)]RolePlay[/COLOR] [COLOR=rgb(255, 0, 0)]ситуация[/COLOR] была рассмотрена и [COLOR=rgb(255, 0, 0)]получила статус[/COLOR]:[/font][center]<br>" +
    "[center][COLOR=red][ICODE]Отказано[/ICODE][/color][/center]<br><br>" +
    "[center][font=Georgia][color=red]Причина[/color]: Не по форме. [/font][/center]<br><br>" +
    "[center][FONT=georgia]Приятной игры на сервере [COLOR=rgb(255, 215, 0)]TVER[/COLOR].[/center][/FONT]",
    prefix: UNACCEPT_PREFIX,
    status: false,
},
 
{
    title: `Отказано`,
    content: "[CENTER][FONT=georgia]Доброго времени суток, уважаемый(-ая) [U]{{ user.name }}[/U]![/font][/center]<br><br>" +
    "[font=georgia][center]Ваша [COLOR=rgb(255, 0, 0)]RolePlay[/COLOR] [COLOR=rgb(255, 0, 0)]ситуация[/COLOR] была рассмотрена и [COLOR=rgb(255, 0, 0)]получила статус[/COLOR]:[/font][center]<br>" +
    "[center][COLOR=red][ICODE]Отказано[/ICODE][/color][/center]<br><br>" +
    "[center][font=Georgia]Причиной отказа могло послужить какое-либо нарушение из правил написания RP ситуаций.[/font][/center]<br><br>" +
    "[center][FONT=georgia]Приятной игры на сервере [COLOR=rgb(255, 215, 0)]TVER[/COLOR].[/center][/FONT]",
    prefix: UNACCEPT_PREFIX,
    status: false,
},
 
 
 
 
{
    title: `-------------------------------------------------------------------- Неофиц рп организации --------------------------------------------------------------------`,
},
 
{
    title: `Не по форме`,
    content: "[CENTER][FONT=georgia]Доброго времени суток, уважаемый(-ая) [U]{{ user.name }}[/U]![/font][/center]<br><br>" +
    "[font=georgia][center]Ваша [COLOR=rgb(255, 0, 0)]неофициальная RolePlay[/COLOR] [COLOR=rgb(255, 0, 0)]организация[/COLOR] была рассмотрена и [COLOR=rgb(255, 0, 0)]получила статус[/COLOR]:[/font][center]<br>" +
    "[center][COLOR=red][ICODE]Отказано[/ICODE][/color][/center]<br><br>" +
    "[center][font=Georgia][color=red]Причина[/color]: Не по форме. [/font][/center]<br><br>" +
    "[center][FONT=georgia]Приятной игры на сервере [COLOR=rgb(255, 215, 0)]TVER[/COLOR].[/center][/FONT]",
    prefix: UNACCEPT_PREFIX,
    status: false,
},
 
{
    title: `Отказано`,
    content: "[CENTER][FONT=georgia]Доброго времени суток, уважаемый(-ая) [U]{{ user.name }}[/U]![/font][/center]<br><br>" +
    "[font=georgia][center]Ваша [COLOR=rgb(255, 0, 0)]неофициальная RolePlay[/COLOR] [COLOR=rgb(255, 0, 0)]организация[/COLOR] была рассмотрена и [COLOR=rgb(255, 0, 0)]получила статус[/COLOR]:[/font][center]<br>" +
    "[center][COLOR=red][ICODE]Отказано[/ICODE][/color][/center]<br><br>" +
    "[center][font=Georgia]Причиной отказа могло послужить какое-либо нарушение из правил написания неофициальных RP организаций.[/font][/center]<br><br>" +
    "[center][FONT=georgia]Приятной игры на сервере [COLOR=rgb(255, 215, 0)]TVER[/COLOR].[/center][/FONT]",
    prefix: UNACCEPT_PREFIX,
    status: false,
},
 
{
    title: `Ошиблись разделом `,
    content: "[CENTER][FONT=georgia]Доброго времени суток, уважаемый(-ая) [U]{{ user.name }}[/U]![/font][/center]<br><br>" +
    "[font=georgia][center]Вы ошиблись разделом. Данный раздел предназначен для написания неофициальных RolePlay организаций.[center][/font]<br><br>" +
    "[center][FONT=georgia]Приятной игры на сервере [COLOR=rgb(255, 215, 0)]TVER[/COLOR].[/center][/FONT]",
    prefix: CLOSE_PREFIX,
    status: false,
 
},
 
{
    title: `Одобрено`,
    content: "[CENTER][FONT=georgia]Доброго времени суток, уважаемый(-ая) [U]{{ user.name }}[/U]![/font][/center]<br><br>" +
    "[font=georgia][center]Ваша [COLOR=rgb(255, 0, 0)]неофициальная RolePlay[/COLOR] [COLOR=rgb(255, 0, 0)] организация[/COLOR] была рассмотрена и [COLOR=rgb(255, 0, 0)]получила статус[/COLOR]:[/font][center]<br>" +
    "[center][COLOR=rgb(127, 255, 0)][ICODE]Одобрено[/ICODE][/color][/center]<br><br>" +
    "[center][FONT=georgia]Приятной игры на сервере [COLOR=rgb(255, 215, 0)]TVER[/COLOR].[/center][/FONT]",
    prefix: ACCEPT_PREFIX,
    status: false,
},
 
 
 
];
 
 $(document).ready(() => {
	// Загрузка скрипта для обработки шаблонов
	$('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');
 
	// Добавление кнопок при загрузке страницы
 
        addButton('На рассмотрении', 'pin');
$('button#pin').css({
    'background-color': '#FF8C00',
    'border': '2px solid #FF8C00',
    'border-radius': '20px'
});       
     
        addButton(`Одобрено`, `accepted`);
$("button#accepted").css({
    "background-color": "#228B22",
    "border": "2px solid #228B22",
    "border-radius": "20px"
});
 
addButton(`Отказано`, `unaccept`);
$("button#unaccept").css({
    "background-color": "#B22222",
    "border": "2px solid #B22222",
    "border-radius": "20px"
});
 
addButton(`Быстрые ответы`, `selectAnswer`);
$("button#selectAnswer").css({
    "background-color": "#6495ED",
    "border": "2px solid #6495ED",
    "border-radius": "20px",
});
 
	
 
	// Поиск информации о теме
	const threadData = getThreadData();
 
	$('button#pin').click(() => editThreadData(PIN_PREFIX, true));
	$('button#accepted').click(() => editThreadData(ACCEPT_PREFIX, false));
	$('button#teamProject').click(() => editThreadData(COMMAND_PREFIX, true));
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