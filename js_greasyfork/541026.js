// ==UserScript==
// @name         BLESS RUSSIA CHIEF | Scirpt
// @namespace    https://forum.blessrussia.online
// @version      3.3.3
// @description  Скрипт для Руководства сервера | Bless Russia по всем вопросам на счет скрипта VK - https://vk.com/akroniksss
// @author       оливер
// @match        https://forum.blessrussia.online/index.php*
// @include      https://forum.blessrussia.online/index.php
// @grant        none
// @license      MIT
// @icon https://icons.iconarchive.com/icons/thesquid.ink/free-flat-sample/128/support-icon.png
// @downloadURL https://update.greasyfork.org/scripts/541026/BLESS%20RUSSIA%20CHIEF%20%7C%20Scirpt.user.js
// @updateURL https://update.greasyfork.org/scripts/541026/BLESS%20RUSSIA%20CHIEF%20%7C%20Scirpt.meta.js
// ==/UserScript==

(function () {
    'use strict';
    const UNACCEPT_PREFIX = 7; // Prefix that will be set when thread closes
    const ACCEPT_PREFIX = 6; // Prefix that will be set when thread accepted
    const RESHENO_PREFIX = 8; // Префикс "Решено"
    const PIN_PREFIX = 2; // Prefix that will be set when thread pins
    const GA_PREFIX = 11; // Префикс "Главному Администратору"
    const COMMAND_PREFIX = 9; // Префикс "Команде Проекта"
    const WATCHED_PREFIX = 8; // Префикс "Рассмотрено"
    const CLOSE_PREFIX = 5; // Префикс "Закрыто"
    const SPECIAL_PREFIX = 10; // Префикс "Специальному Администратору"
    const TEXY_PREFIX = 12; // Префикс "Специальному Администратору"
    const buttons = [
    {
		title: 'ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ                                ᅠ⠀             ⠀ ⠀⠀ᅠ ᅠᅠПрочие ответы на темы   ᅠᅠ ᅠᅠ          ⠀        ⠀    ⠀      ⠀ᅠ     ᅠ ᅠ     ᅠ ᅠ ᅠ ',
        dpstyle: 'oswald: 3px;     color: #fff; background: #212428; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: 1px solid gold;  width: 96%; border-radius: 15px;',
},
{
        title: 'Взять на рассмотрение',
        content:
      '[CENTER][size=15px][font=Georgia][CENTER]Приветствую, уважаемый игрок [COLOR=GOLD] {{ user.name }}[/color].[/size][/font][/CENTER]' +
      '[CENTER][size=15px][font=Georgia]Ваше обращение взято [Color=rgb(255, 155 ,0)]на рассмотрении.[/color] <br> Ожидайте, пожалуйста, ответа от администрации и не нужно создавать копии этой темы.[/size][/font][/CENTER]<br><br>' +
      '[CENTER][size=15px][font=Georgia]С уважением, [COLOR=rgb(51, 255, 0)]Главная администрация[/color] сервера.[/size][/font][/CENTER]<br>' +
      '[CENTER][size=15px][font=Georgia][COLOR=GOLD]Приятной игры на нашем сервере![/color][/size][/font][/CENTER]',
        prefix: PIN_PREFIX,
        status: true,
},
{
        title: 'Технический отдел',
        content:
      '[CENTER][size=15px][font=Georgia][CENTER]Приветствую, уважаемый игрок [COLOR=GOLD] {{ user.name }}[/color].[/size][/font][/CENTER]' +
      '[CENTER][size=15px][font=Georgia]Ваше обращение передано в [Color=rgb(0,255,255)]Технический отдел[/color].[/size][/font][/CENTER]<br><br>' +
      '[CENTER][size=15px][font=Georgia]С уважением, [COLOR=rgb(51, 255, 0)]Главная администрация[/color] сервера.[/size][/font][/CENTER]<br>' +
      '[CENTER][size=15px][font=Georgia][COLOR=GOLD]Приятной игры на нашем сервере![/color][/size][/font][/CENTER]',
        prefix: TEXY_PREFIX,
        status: true,
},
{
        title: 'Спец. администрации',
        content:
      '[CENTER][size=15px][font=Georgia][CENTER]Приветствую, уважаемый игрок [COLOR=GOLD] {{ user.name }}[/color].[/size][/font][/CENTER]' +
      '[CENTER][size=15px][font=Georgia]Ваше обращение передано [Color=rgb(255,0,0)]Специальной администрации[/color].[/size][/font][/CENTER]<br><br>' +
      '[CENTER][size=15px][font=Georgia]С уважением, [COLOR=rgb(51, 255, 0)]Главная администрация[/color] сервера.[/size][/font][/CENTER]<br>' +
      '[CENTER][size=15px][font=Georgia][COLOR=GOLD]Приятной игры на нашем сервере![/color][/size][/font][/CENTER]',
        prefix: SPECIAL_PREFIX,
        status: true,
},
{
        title: 'Руководителю',
        content:
      '[CENTER][size=15px][font=Georgia][CENTER]Приветствую, уважаемый игрок [COLOR=GOLD] {{ user.name }}[/color].[/size][/font][/CENTER]' +
      '[CENTER][size=15px][font=Georgia]Ваше обращение передано [Color=rgb(255,0,0)]Руководителю администрации[/color].[/size][/font][/CENTER]<br><br>' +
      '[CENTER][size=15px][font=Georgia]С уважением, [COLOR=rgb(51, 255, 0)]Главная администрация[/color] сервера.[/size][/font][/CENTER]<br>' +
      '[CENTER][size=15px][font=Georgia][COLOR=GOLD]Приятной игры на нашем сервере![/color][/size][/font][/CENTER]',
        prefix: SPECIAL_PREFIX,
        status: true,
},
{
        title: 'Команде проекта',
        content:
      '[CENTER][size=15px][font=Georgia][CENTER]Приветствую, уважаемый игрок [COLOR=GOLD] {{ user.name }}[/color].[/size][/font][/CENTER]' +
      '[CENTER][size=15px][font=Georgia]Ваше обращение передано [Color=rgb(255,0,0)]Команде проекта[/color].[/size][/font][/CENTER]<br><br>' +
      '[CENTER][size=15px][font=Georgia]С уважением, [COLOR=rgb(51, 255, 0)]Главная администрация[/color] сервера.[/size][/font][/CENTER]<br>' +
      '[CENTER][size=15px][font=Georgia][COLOR=GOLD]Приятной игры на нашем сервере![/color][/size][/font][/CENTER]',
        prefix: COMMAND_PREFIX,
        status: true,
},
{
        title: 'Главному админу',
        content:
      '[CENTER][size=15px][font=Georgia][CENTER]Приветствую, уважаемый игрок [COLOR=GOLD] {{ user.name }}[/color].[/size][/font][/CENTER]' +
      '[CENTER][size=15px][font=Georgia]Ваше обращение передано [Color=rgb(0,255,0)]Главному администратору[/color] сервера.[/size][/font][/CENTER]<br><br>' +
      '[CENTER][size=15px][font=Georgia]С уважением, [COLOR=rgb(51, 255, 0)]Главная администрация[/color] сервера.[/size][/font][/CENTER]<br>' +
      '[CENTER][size=15px][font=Georgia][COLOR=GOLD]Приятной игры на нашем сервере![/color][/size][/font][/CENTER]',
        prefix: GA_PREFIX,
        status: true,
},
                  {
        title: 'Оскорбительная тема',
        content:
      '[CENTER][size=15px][font=Georgia][CENTER]Приветствую, уважаемый игрок [COLOR=GOLD] {{ user.name }}[/color].[/size][/font][/CENTER]' +
      '[CENTER][size=15px][font=Georgia]В вашем обращении имеется слова оскорбительного характера, данная тема рассмотрению не пожлежит.<br> Ваша жалоба получает cтатус: [Color=rgb(255,0,0)]Отказано.[/color][/size][/font][/CENTER]<br><br>' +
      '[CENTER][size=15px][font=Georgia]С уважением, [COLOR=rgb(51, 255, 0)]Главная администрация[/color] сервера.[/size][/font][/CENTER]<br>' +
      '[CENTER][size=15px][font=Georgia][COLOR=GOLD]Приятной игры на нашем сервере![/color][/size][/font][/CENTER]',
        prefix: WATCHED_PREFIX,
        status: false,
},
{
        title: 'Дубликат темы',
        content:
      '[CENTER][size=15px][font=Georgia][CENTER]Приветствую, уважаемый игрок [COLOR=GOLD] {{ user.name }}[/color].[/size][/font][/CENTER]' +
      '[CENTER][size=15px][font=Georgia]Ваша тема является дубликатом предыдущей.<br> Если вы дальше продолжите создать дубликаты по данной теме, то более 3-х созданых тем ваш форумный аккаунт может быть [COLOR=rgb(255, 0, 0)]заблокирован[/color]![/size][/font][/CENTER]<br><br>' +
      '[CENTER][size=15px][font=Georgia]С уважением, [COLOR=rgb(51, 255, 0)]Главная администрация[/color] сервера.[/size][/font][/CENTER]<br>' +
      '[CENTER][size=15px][font=Georgia][COLOR=GOLD]Приятной игры на нашем сервере![/color][/size][/font][/CENTER]',
        prefix: UNACCEPT_PREFIX,
        status: false,
},
{
        title: 'Не относится',
        content:
      '[CENTER][size=15px][font=Georgia][CENTER]Приветствую, уважаемый игрок [COLOR=GOLD] {{ user.name }}[/color].[/size][/font][/CENTER]' +
      '[CENTER][size=15px][font=Georgia]Ваше обращение / жалоба не относится к данному разделу.[/size][/font][/CENTER]<br><br>' +
      '[CENTER][size=15px][font=Georgia]С уважением, [COLOR=rgb(51, 255, 0)]Главная администрация[/color] сервера.[/size][/font][/CENTER]<br>' +
      '[CENTER][size=15px][font=Georgia][COLOR=GOLD]Приятной игры на нашем сервере![/color][/size][/font][/CENTER]',
        prefix: UNACCEPT_PREFIX,
        status: false,
},
{
        title: 'Ошибка сервером',
        content:
      '[CENTER][size=15px][font=Georgia][CENTER]Приветствую, уважаемый игрок [COLOR=GOLD] {{ user.name }}[/color].[/size][/font][/CENTER]' +
      '[CENTER][size=15px][font=Georgia]Вы ошиблись серверным разделом. Прежде чем составлять тему, посмотрите куда вы ее подаете.[/size][/font][/CENTER]<br><br>' +
      '[CENTER][size=15px][font=Georgia]С уважением, [COLOR=rgb(51, 255, 0)]Главная администрация[/color] сервера.[/size][/font][/CENTER]<br>' +
      '[CENTER][size=15px][font=Georgia][COLOR=GOLD]Приятной игры на нашем сервере![/color][/size][/font][/CENTER]',
        prefix: UNACCEPT_PREFIX,
        status: false,
},
{
        title: 'Недостаточно доказательств',
        content:
      '[CENTER][size=15px][font=Georgia][CENTER]Приветствую, уважаемый игрок [COLOR=GOLD] {{ user.name }}[/color].[/size][/font][/CENTER]' +
      '[CENTER][size=15px][font=Georgia]К сожалению у вас [Color=rgb(255,0,0)]недостаточно доказательств[/color] на данное нарушение, увы но мы помочь Вам не сможем.[/size][/font][/CENTER]<br><br>' +
      '[CENTER][size=15px][font=Georgia]С уважением, [COLOR=rgb(51, 255, 0)]Главная администрация[/color] сервера.[/size][/font][/CENTER]<br>' +
      '[CENTER][size=15px][font=Georgia][COLOR=GOLD]Приятной игры на нашем сервере![/color][/size][/font][/CENTER]',
        prefix: UNACCEPT_PREFIX,
        status: false,
},
{
        title: 'Нет доказательств',
        content:
      '[CENTER][size=15px][font=Georgia][CENTER]Приветствую, уважаемый игрок [COLOR=GOLD] {{ user.name }}[/color].[/size][/font][/CENTER]' +
      '[CENTER][size=15px][font=Georgia]К сожалению у вас [Color=rgb(255,0,0)]нет доказательств[/color] на данное нарушение, увы но мы помочь Вам не сможем.[/size][/font][/CENTER]<br><br>' +
      '[CENTER][size=15px][font=Georgia]С уважением, [COLOR=rgb(51, 255, 0)]Главная администрация[/color] сервера.[/size][/font][/CENTER]<br>' +
      '[CENTER][size=15px][font=Georgia][COLOR=GOLD]Приятной игры на нашем сервере![/color][/size][/font][/CENTER]',
        prefix: UNACCEPT_PREFIX,
        status: false,
},
{
		title: 'ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ                                ᅠ⠀             ⠀ ⠀⠀ᅠ ᅠᅠЖалоба на администрацию   ᅠᅠ ᅠᅠ          ⠀        ⠀    ⠀      ⠀ᅠ     ᅠ ᅠ     ᅠ ᅠ ᅠ ',
        dpstyle: 'oswald: 3px;     color: #fff; background: #212428; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: 1px solid red;  width: 96%; border-radius: 15px;',
},
{
        title: 'Отказано',
        content:
      '[CENTER][size=15px][font=Georgia][CENTER]Приветствую, уважаемый игрок [COLOR=GOLD] {{ user.name }}[/color].[/size][/font][/CENTER]' +
      '[CENTER][size=15px][font=Georgia]Ваша жалоба получает статус: [Color=rgb(255,0,0)]Отказано.[/color]<br> Главная администрация сервера вправе отказать вам в жалобе без обоснованных причин.[/color][/size][/font][/CENTER]<br><br>' +
      '[CENTER][size=15px][font=Georgia]С уважением, [COLOR=rgb(51, 255, 0)]Главная администрация[/color] сервера.[/size][/font][/CENTER]<br>' +
      '[CENTER][size=15px][font=Georgia][COLOR=GOLD]Приятной игры на нашем сервере![/color][/size][/font][/CENTER]',
        prefix: WATCHED_PREFIX,
        status: false,
},
{
        title: 'Запросить док-ва',
        content:
      '[CENTER][size=15px][font=Georgia][CENTER]Приветствую, уважаемый игрок [COLOR=GOLD] {{ user.name }}[/color].[/size][/font][/CENTER]' +
      '[CENTER][size=15px][font=Georgia]Запросил [Color=rgb(255, 155 ,0)]доказательства[/color] у администратора.<br> Ожидайте, пожалуйста, ответа от администрации и не нужно создавать копии этой темы.[/size][/font][/CENTER]<br><br>' +
      '[CENTER][size=15px][font=Georgia]С уважением, [COLOR=rgb(51, 255, 0)]Главная администрация[/color] сервера.[/size][/font][/CENTER]<br>' +
      '[CENTER][size=15px][font=Georgia][COLOR=GOLD]Приятной игры на нашем сервере![/color][/size][/font][/CENTER]',
        prefix: PIN_PREFIX,
        status: true,
},
{
        title: 'Отсуствует окно блокировки',
        content:
      '[CENTER][size=15px][font=Georgia][CENTER]Приветствую, уважаемый игрок [COLOR=GOLD] {{ user.name }}[/color].[/size][/font][/CENTER]' +
      '[CENTER][size=15px][font=Georgia]В вашей жалобе отсуствует окно блокировки. Советуем создать повторную жалобу.[/size][/font][/CENTER]<br><br>' +
      '[CENTER][size=15px][font=Georgia]С уважением, [COLOR=rgb(51, 255, 0)]Главная администрация[/color] сервера.[/size][/font][/CENTER]<br>' +
      '[CENTER][size=15px][font=Georgia][COLOR=GOLD]Приятной игры на нашем сервере![/color][/size][/font][/CENTER]',
        prefix: WATCHED_PREFIX,
        status: false,
},
{
        title: 'Не по форме',
        content:
      '[CENTER][size=15px][font=Georgia][CENTER]Приветствую, уважаемый игрок [COLOR=GOLD] {{ user.name }}[/color].[/size][/font][/CENTER]' +
      '[CENTER][size=15px][font=Georgia]Ваша жалоба составлена не по форме. Внимательно прочитайте правила составления жалобы или же ниже прикреплена форма на подачу.[/size][/font][/CENTER]<br>' +
      '[CENTER][SPOILER=Форма подачи жалобы][CENTER][size=15px][font=Georgia]Название темы необходимо сделать так, как указано в данном примере - [COLOR=gold]"Oliver_Cromwell | CapsLock"[/color][/size][/font][/CENTER]<br><br>' +
      '[CENTER][size=15px][font=Georgia][COLOR=gold]I.[/color] Ваш Nick_Name:[/size][/font][/CENTER]<br>' +
      '[CENTER][size=15px][font=Georgia][COLOR=gold]II.[/color] Nick_Name администратора:[/size][/font][/CENTER]<br>' +
      '[CENTER][size=15px][font=Georgia][COLOR=gold]III.[/color] Дата выдачи/получения наказания:[/size][/font][/CENTER]<br>' +
      '[CENTER][size=15px][font=Georgia][COLOR=gold]IV.[/color] Суть заявки:[/size][/font][/CENTER]<br>' +
      '[CENTER][size=15px][font=Georgia][COLOR=gold]V.[/color] Доказательство:[/SPOILER][/size][/font][/CENTER]' +
      '[CENTER][size=15px][font=Georgia]С уважением, [COLOR=rgb(51, 255, 0)]Главная администрация[/color] сервера.[/size][/font][/CENTER]<br>' +
      '[CENTER][size=15px][font=Georgia][COLOR=GOLD]Приятной игры на нашем сервере![/color][/size][/font][/CENTER]',
        prefix: UNACCEPT_PREFIX,
        status: false,
},
{
        title: 'Доква не в имгур япикс',
        content:
      '[CENTER][size=15px][font=Georgia][CENTER]Приветствую, уважаемый игрок [COLOR=GOLD] {{ user.name }}[/color].[/size][/font][/CENTER]' +
      '[CENTER][size=15px][font=Georgia]Доказательства должны быть загружены на фото/видео хостинги (YouTube, Япикс, imgur).[/size][/font][/CENTER]<br><br>' +
      '[CENTER][size=15px][font=Georgia]С уважением, [COLOR=rgb(51, 255, 0)]Главная администрация[/color] сервера.[/size][/font][/CENTER]<br>' +
      '[CENTER][size=15px][font=Georgia][COLOR=GOLD]Приятной игры на нашем сервере![/color][/size][/font][/CENTER]',
        prefix: UNACCEPT_PREFIX,
        status: false,
},
{
        title: 'Некликабельная ссылка',
        content:
      '[CENTER][size=15px][font=Georgia][CENTER]Приветствую, уважаемый игрок [COLOR=GOLD] {{ user.name }}[/color].[/size][/font][/CENTER]' +
      '[CENTER][size=15px][font=Georgia]В ваших доказательствах ссылка некликабельная.[/size][/font][/CENTER]<br><br>' +
      '[CENTER][size=15px][font=Georgia]С уважением, [COLOR=rgb(51, 255, 0)]Главная администрация[/color] сервера.[/size][/font][/CENTER]<br>' +
      '[CENTER][size=15px][font=Georgia][COLOR=GOLD]Приятной игры на нашем сервере![/color][/size][/font][/CENTER]',
        prefix: UNACCEPT_PREFIX,
        status: false,
},
{
        title: 'Не работают доказательства',
        content:
      '[CENTER][size=15px][font=Georgia][CENTER]Приветствую, уважаемый игрок [COLOR=GOLD] {{ user.name }}[/color].[/size][/font][/CENTER]' +
      '[CENTER][size=15px][font=Georgia]Ссылка на ваше доказательство не работает, создайте новую тему с нормальной ссылкой.<br> Ваша жалоба получает cтатус: [Color=rgb(255,0,0)]Отказано.[/color][/size][/font][/CENTER]<br><br>' +
      '[CENTER][size=15px][font=Georgia]С уважением, [COLOR=rgb(51, 255, 0)]Главная администрация[/color] сервера.[/size][/font][/CENTER]<br>' +
      '[CENTER][size=15px][font=Georgia][COLOR=GOLD]Приятной игры на нашем сервере![/color][/size][/font][/CENTER]',
        prefix: UNACCEPT_PREFIX,
        status: false,
},
{
        title: 'Отсутствует выдача наказания',
        content:
      '[CENTER][size=15px][font=Georgia][CENTER]Приветствую, уважаемый игрок [COLOR=GOLD] {{ user.name }}[/color].[/size][/font][/CENTER]' +
      '[CENTER][size=15px][font=Georgia]В вашей жалобе отсутствует скриншот выдачи наказания.<br> Ваша жалоба получает cтатус: [Color=rgb(255,0,0)]Отказано.[/color][/size][/font][/CENTER]<br><br>' +
      '[CENTER][size=15px][font=Georgia]С уважением, [COLOR=rgb(51, 255, 0)]Главная администрация[/color] сервера.[/size][/font][/CENTER]<br>' +
      '[CENTER][size=15px][font=Georgia][COLOR=GOLD]Приятной игры на нашем сервере![/color][/size][/font][/CENTER]',
        prefix: UNACCEPT_PREFIX,
        status: false,
},
{
        title: 'Качество док-в',
        content:
      '[CENTER][size=15px][font=Georgia][CENTER]Приветствую, уважаемый игрок [COLOR=GOLD] {{ user.name }}[/color].[/size][/font][/CENTER]' +
      '[CENTER][size=15px][font=Georgia]Пересоздайте жалобу и прикрепите туда доказательства в нормальном качестве.[/size][/font][/CENTER]<br><br>' +
      '[CENTER][size=15px][font=Georgia]С уважением, [COLOR=rgb(51, 255, 0)]Главная администрация[/color] сервера.[/size][/font][/CENTER]<br>' +
      '[CENTER][size=15px][font=Georgia][COLOR=GOLD]Приятной игры на нашем сервере![/color][/size][/font][/CENTER]',
        prefix: WATCHED_PREFIX,
        status: false,
},
{
        title: 'Подделка докв',
        content:
      '[CENTER][size=15px][font=Georgia][CENTER]Приветствую, уважаемый игрок [COLOR=GOLD] {{ user.name }}[/color].[/size][/font][/CENTER]' +
      '[CENTER][size=15px][font=Georgia]Ваши доказательства подделаны, форумный аккаунт будет [COLOR=rgb(247, 218, 100)]заблокирован[/color].[/size][/font][/CENTER]<br><br>' +
      '[CENTER][size=15px][font=Georgia]С уважением, [COLOR=rgb(51, 255, 0)]Главная администрация[/color] сервера.[/size][/font][/CENTER]<br>' +
      '[CENTER][size=15px][font=Georgia][COLOR=GOLD]Приятной игры на нашем сервере![/color][/size][/font][/CENTER]',
        prefix: UNACCEPT_PREFIX,
        status: false,
},
{
        title: 'Ответ в прошлой жалобе',
        content:
      '[CENTER][size=15px][font=Georgia][CENTER]Приветствую, уважаемый игрок [COLOR=GOLD] {{ user.name }}[/color].[/size][/font][/CENTER]' +
      '[CENTER][size=15px][font=Georgia]В прошлой вашей жалобе ответ был дан, и вредикт от главной администрации за это время не был изменен.<br> Ваша жалоба получает cтатус: [Color=rgb(255,0,0)]Отказано.[/color][/size][/font][/CENTER]<br><br>' +
      '[CENTER][size=15px][font=Georgia]С уважением, [COLOR=rgb(51, 255, 0)]Главная администрация[/color] сервера.[/size][/font][/CENTER]<br>' +
      '[CENTER][size=15px][font=Georgia][COLOR=GOLD]Приятной игры на нашем сервере![/color][/size][/font][/CENTER]',
        prefix: UNACCEPT_PREFIX,
        status: false,
},
{
        title: 'Ошибка [ID]',
        content:
      '[CENTER][size=15px][font=Georgia][CENTER]Приветствую, уважаемый игрок [COLOR=GOLD] {{ user.name }}[/color].[/size][/font][/CENTER]' +
      '[CENTER][size=15px][font=Georgia]Ваша жалоба получает статус: [Color=rgb(60,250,0)]Одобрено.[/color][/size][/font][/CENTER]<br>' +
      '[CENTER][size=15px][font=Georgia]Администратор ошибся ID. Наказание будет снято, приносим свои извинения за данную ошибку.[/size][/font][/CENTER]<br><br>' +
      '[CENTER][size=15px][font=Georgia]С уважением, [COLOR=rgb(51, 255, 0)]Главная администрация[/color] сервера.[/size][/font][/CENTER]<br>' +
      '[CENTER][size=15px][font=Georgia][COLOR=GOLD]Приятной игры на нашем сервере![/color][/size][/font][/CENTER]',
        prefix: ACCEPT_PREFIX,
        status: false,
},
             {
        title: 'Беседа с админом',
        content:
      '[CENTER][size=15px][font=Georgia][CENTER]Приветствую, уважаемый игрок [COLOR=GOLD] {{ user.name }}[/color].[/size][/font][/CENTER]' +
      '[CENTER][size=15px][font=Georgia]Ознакомившись с доказательствами, с администратором будет проведена профилактическая беседа.[/size][/font][/CENTER]<br>' +
      '[CENTER][size=15px][font=Georgia]Ваша жалоба получает cтатус: [Color=rgb(60, 250 ,0)]Одобрено.[/color][/size][/font][/CENTER]<br><br>' +
      '[CENTER][size=15px][font=Georgia]С уважением, [COLOR=rgb(51, 255, 0)]Главная администрация[/color] сервера.[/size][/font][/CENTER]<br>' +
      '[CENTER][size=15px][font=Georgia][COLOR=GOLD]Приятной игры на нашем сервере![/color][/size][/font][/CENTER]',
        prefix: ACCEPT_PREFIX,
        status: false,
},
{
        title: 'Одобрено в сторону игрока',
        content:
      '[CENTER][size=15px][font=Georgia][CENTER]Приветствую, уважаемый игрок [COLOR=GOLD] {{ user.name }}[/color].[/size][/font][/CENTER]' +
      '[CENTER][size=15px][font=Georgia]Ознакомившись с доказательствами, администратор будет наказан.[/size][/font][/CENTER]<br>' +
      '[CENTER][size=15px][font=Georgia]Ваша жалоба получает cтатус: [Color=rgb(60, 250 ,0)]Одобрено.[/color][/size][/font][/CENTER]<br><br>' +
      '[CENTER][size=15px][font=Georgia]С уважением, [COLOR=rgb(51, 255, 0)]Главная администрация[/color] сервера.[/size][/font][/CENTER]<br>' +
      '[CENTER][size=15px][font=Georgia][COLOR=GOLD]Приятной игры на нашем сервере![/color][/size][/font][/CENTER]',
        prefix: ACCEPT_PREFIX,
        status: false,
},
{
        title: 'Одобрено в сторону админа',
        content:
      '[CENTER][size=15px][font=Georgia][CENTER]Приветствую, уважаемый игрок [COLOR=GOLD] {{ user.name }}[/color].[/size][/font][/CENTER]' +
      '[CENTER][size=15px][font=Georgia]Администратор предоставил доказательства.[/size][/font][/CENTER]<br>' +
      '[CENTER][size=15px][font=Georgia]Ваша жалоба получает cтатус: [Color=rgb(255,0,0)]Отказано.[/color][/size][/font][/CENTER]<br><br>' +
      '[CENTER][size=15px][font=Georgia]С уважением, [COLOR=rgb(51, 255, 0)]Главная администрация[/color] сервера.[/size][/font][/CENTER]<br>' +
      '[CENTER][size=15px][font=Georgia][COLOR=GOLD]Приятной игры на нашем сервере![/color][/size][/font][/CENTER]',
        prefix: UNACCEPT_PREFIX,
        status: false,
},
{
        title: 'Нарушений от адм нет',
        content:
      '[CENTER][size=15px][font=Georgia][CENTER]Приветствую, уважаемый игрок [COLOR=GOLD] {{ user.name }}[/color].[/size][/font][/CENTER]' +
      '[CENTER][size=15px][font=Georgia]Ознакомившись с вашими доказательствами, нарушений  со стороны администраторы не были найдены.<br> Ваша жалоба получает статус: [Color=red]Отказано.[/color][/size][/font][/CENTER]<br><br>' +
      '[CENTER][size=15px][font=Georgia]С уважением, [COLOR=rgb(51, 255, 0)]Главная администрация[/color] сервера.[/size][/font][/CENTER]<br>' +
      '[CENTER][size=15px][font=Georgia][COLOR=GOLD]Приятной игры на нашем сервере![/color][/size][/font][/CENTER]',
        prefix: UNACCEPT_PREFIX,
        status: false,
},
{
        title: 'Снять админа',
        content:
      '[CENTER][size=15px][font=Georgia][CENTER]Приветствую, уважаемый игрок [COLOR=GOLD] {{ user.name }}[/color].[/size][/font][/CENTER]' +
      '[CENTER][size=15px][font=Georgia]Ознакомившись с вашими доказательствами, администратор будет снят со своего поста.<br> Ваша жалоба получает статус: [Color=lime]Одобрено.[/color][/size][/font][/CENTER]<br><br>' +
      '[CENTER][size=15px][font=Georgia]С уважением, [COLOR=rgb(51, 255, 0)]Главная администрация[/color] сервера.[/size][/font][/CENTER]<br>' +
      '[CENTER][size=15px][font=Georgia][COLOR=GOLD]Приятной игры на нашем сервере![/color][/size][/font][/CENTER]',
        prefix: ACCEPT_PREFIX,
        status: false,
},
{
        title: 'Заменить наказание',
        content:
      '[CENTER][size=15px][font=Georgia][CENTER]Приветствую, уважаемый игрок [COLOR=GOLD] {{ user.name }}[/color].[/size][/font][/CENTER]' +
      '[CENTER][size=15px][font=Georgia]Ознакомившись с вашими доказательствами, наказание будет заменено на другое.<br> Ваша жалоба получает статус: [Color=lime]Рассмотрено.[/color][/size][/font][/CENTER]<br><br>' +
      '[CENTER][size=15px][font=Georgia]С уважением, [COLOR=rgb(51, 255, 0)]Главная администрация[/color] сервера.[/size][/font][/CENTER]<br>' +
      '[CENTER][size=15px][font=Georgia][COLOR=GOLD]Приятной игры на нашем сервере![/color][/size][/font][/CENTER]',
        prefix: RESHENO_PREFIX,
        status: false,
},
{
        title: 'Отредачены док-ва',
        content:
      '[CENTER][size=15px][font=Georgia][CENTER]Приветствую, уважаемый игрок [COLOR=GOLD] {{ user.name }}[/color].[/size][/font][/CENTER]' +
      '[CENTER][size=15px][font=Georgia]Доказательства должны быть без обрезок / замазок.<br> Ваша жалоба получает cтатус: [Color=rgb(255,0,0)]Отказано.[/color][/size][/font][/CENTER]<br><br>' +
      '[CENTER][size=15px][font=Georgia]С уважением, [COLOR=rgb(51, 255, 0)]Главная администрация[/color] сервера.[/size][/font][/CENTER]<br>' +
      '[CENTER][size=15px][font=Georgia][COLOR=GOLD]Приятной игры на нашем сервере![/color][/size][/font][/CENTER]',
        prefix: UNACCEPT_PREFIX,
        status: false,
},
{
        title: 'Отсуствует /time',
        content:
      '[CENTER][size=15px][font=Georgia][CENTER]Приветствую, уважаемый игрок [COLOR=GOLD] {{ user.name }}[/color].[/size][/font][/CENTER]' +
      '[CENTER][size=15px][font=Georgia]В доказательствах у вас отсутствует [COLOR=rgb(247, 218, 100)]/time[/color].<br> Ваша жалоба получает cтатус: [Color=rgb(255,0,0)]Отказано.[/color][/size][/font][/CENTER]<br><br>' +
      '[CENTER][size=15px][font=Georgia]С уважением, [COLOR=rgb(51, 255, 0)]Главная администрация[/color] сервера.[/size][/font][/CENTER]<br>' +
      '[CENTER][size=15px][font=Georgia][COLOR=GOLD]Приятной игры на нашем сервере![/color][/size][/font][/CENTER]',
        prefix: UNACCEPT_PREFIX,
        status: false,
},
{
        title: 'Неверный ник',
        content:
      '[CENTER][size=15px][font=Georgia][CENTER]Приветствую, уважаемый игрок [COLOR=GOLD] {{ user.name }}[/color].[/size][/font][/CENTER]' +
      '[CENTER][size=15px][font=Georgia]Никнейм во 2-ом пункте отличается от ника в доказательствах.<br> Ваша жалоба получает статус: [Color=rgb(255,0,0)]Отказано.[/color][/size][/font][/CENTER]<br><br>' +
      '[CENTER][size=15px][font=Georgia]С уважением, [COLOR=rgb(51, 255, 0)]Главная администрация[/color] сервера.[/size][/font][/CENTER]<br>' +
      '[CENTER][size=15px][font=Georgia][COLOR=GOLD]Приятной игры на нашем сервере![/color][/size][/font][/CENTER]',
        prefix: UNACCEPT_PREFIX,
        status: false,
},
    {
        title: 'Срок подачи истек',
        content:
      '[CENTER][size=15px][font=Georgia][CENTER]Приветствую, уважаемый игрок [COLOR=GOLD] {{ user.name }}[/color].[/size][/font][/CENTER]' +
      '[CENTER][size=15px][font=Georgia]К сожалению срок подачи жалобы был истек.[/size][/font][/CENTER]<br>' +
      '[CENTER][size=15px][font=Georgia]Ваша жалоба получает cтатус: [Color=rgb(255,0,0)]Отказано.[/color][/size][/font][/CENTER]<br><br>' +
      '[CENTER][size=15px][font=Georgia]С уважением, [COLOR=rgb(51, 255, 0)]Главная администрация[/color] сервера.[/size][/font][/CENTER]<br>' +
      '[CENTER][size=15px][font=Georgia][COLOR=GOLD]Приятной игры на нашем сервере![/color][/size][/font][/CENTER]',
        prefix: UNACCEPT_PREFIX,
        status: false,
},
{
        title: 'Жалоба от 3 лица',
        content:
      '[CENTER][size=15px][font=Georgia][CENTER]Приветствую, уважаемый игрок [COLOR=GOLD] {{ user.name }}[/color].[/size][/font][/CENTER]' +
      '[CENTER][size=15px][font=Georgia]Ваша жалоба составлена от 3-го лица.<br> Ваша жалоба получает статус: [Color=rgb(255,0,0)]Отказано.[/color][/size][/font][/CENTER]<br><br>' +
      '[CENTER][size=15px][font=Georgia]С уважением, [COLOR=rgb(51, 255, 0)]Главная администрация[/color] сервера.[/size][/font][/CENTER]<br>' +
      '[CENTER][size=15px][font=Georgia][COLOR=GOLD]Приятной игры на нашем сервере![/color][/size][/font][/CENTER]',
        prefix: UNACCEPT_PREFIX,
        status: false,
},
   {
		title: 'ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ                                ᅠ⠀             ⠀ ⠀⠀ᅠ ᅠᅠОбжалование наказания   ᅠᅠ ᅠᅠ          ⠀        ⠀    ⠀      ⠀ᅠ     ᅠ ᅠ     ᅠ ᅠ ᅠ ',
        dpstyle: 'oswald: 3px;     color: #fff; background: #212428; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: 1px solid lime;  width: 96%; border-radius: 15px;',
},
{
        title: 'Одобрено (для снятия наказания)',
        content:
      '[CENTER][size=15px][font=Georgia][CENTER]Приветствую, уважаемый игрок [COLOR=GOLD] {{ user.name }}[/color].[/size][/font][/CENTER]' +
      '[CENTER][size=15px][font=Arial]Ваше обжалование получает cтатус: [Color=rgb(60, 250 ,0)]Одобрено.[/color][/size][/font][/CENTER]<br><br>' +
      '[CENTER][size=15px][font=Georgia]С уважением, [COLOR=rgb(51, 255, 0)]Главная администрация[/color] сервера.[/size][/font][/CENTER]<br>' +
      '[CENTER][size=15px][font=Georgia][COLOR=GOLD]Приятной игры на нашем сервере![/color][/size][/font][/CENTER]',
        prefix: ACCEPT_PREFIX,
        status: false,
},
{
        title: 'Отказано в обжалование',
        content:
      '[CENTER][size=15px][font=Georgia][CENTER]Приветствую, уважаемый игрок [COLOR=GOLD] {{ user.name }}[/color].[/size][/font][/CENTER]' +
      '[CENTER][size=15px][font=Georgia]На данный момент мы не готовы пойти вам на встречу и снизить срок наказания.<br> Ваше обжалование получает статус: [Color=rgb(255,0,0)]Отказано[/color].[/size][/font][/CENTER]<br><br>' +
      '[CENTER][size=15px][font=Georgia]С уважением, [COLOR=rgb(51, 255, 0)]Главная администрация[/color] сервера.[/size][/font][/CENTER]<br>' +
      '[CENTER][size=15px][font=Georgia][COLOR=GOLD]Приятной игры на нашем сервере![/color][/size][/font][/CENTER]',
        prefix: UNACCEPT_PREFIX,
          status: false,
},
      {
        title: 'Не по форме',
        content:
      '[CENTER][size=15px][font=Georgia][CENTER]Приветствую, уважаемый игрок [COLOR=GOLD] {{ user.name }}[/color].[/size][/font][/CENTER]' +
      '[CENTER][size=15px][font=Georgia]Ваше обжалование составлена не по форме. Внимательно прочитайте правила составления обжалование или же ниже прикреплена форма на подачу.[/size][/font][/CENTER]<br>' +
      '[CENTER][SPOILER=Форма подачи жалобы][CENTER][size=15px][font=Georgia]Название темы необходимо сделать так, как указано в данном примере - [COLOR=gold]"Oliver_Cromwell | Оскорбление родных"[/color][/size][/font][/CENTER]<br><br>' +
      '[CENTER][size=15px][font=Georgia][COLOR=gold]I.[/color] Ваш Nick_Name:[/size][/font][/CENTER]<br>' +
      '[CENTER][size=15px][font=Georgia][COLOR=gold]II.[/color] Nick_Name администратора:[/size][/font][/CENTER]<br>' +
      '[CENTER][size=15px][font=Georgia][COLOR=gold]III.[/color] Дата получения наказания:[/size][/font][/CENTER]<br>' +
      '[CENTER][size=15px][font=Georgia][COLOR=gold]IV.[/color] Почему вас должны обжаловать:[/size][/font][/CENTER]<br>' +
      '[CENTER][size=15px][font=Georgia][COLOR=gold]V.[/color] Доказательство:[/SPOILER][/size][/font][/CENTER]' +
      '[CENTER][size=15px][font=Georgia]С уважением, [COLOR=rgb(51, 255, 0)]Главная администрация[/color] сервера.[/size][/font][/CENTER]<br>' +
      '[CENTER][size=15px][font=Georgia][COLOR=GOLD]Приятной игры на нашем сервере![/color][/size][/font][/CENTER]',
        prefix: UNACCEPT_PREFIX,
        status: false,
},
{
        title: 'Отсуствует окно блокировки',
        content:
      '[CENTER][size=15px][font=Georgia][CENTER]Приветствую, уважаемый игрок [COLOR=GOLD] {{ user.name }}[/color].[/size][/font][/CENTER]' +
      '[CENTER][size=15px][font=Georgia]В вашем обжаловании отсуствует окно блокировки. Советуем создать повторное обжалование.[/size][/font][/CENTER]<br><br>' +
      '[CENTER][size=15px][font=Georgia]С уважением, [COLOR=rgb(51, 255, 0)]Главная администрация[/color] сервера.[/size][/font][/CENTER]<br>' +
      '[CENTER][size=15px][font=Georgia][COLOR=GOLD]Приятной игры на нашем сервере![/color][/size][/font][/CENTER]',
        prefix: WATCHED_PREFIX,
        status: false,
},
{
        title: 'Запрос док-ва у админа',
        content:
      '[CENTER][size=15px][font=Georgia][CENTER]Приветствую, уважаемый игрок [COLOR=GOLD] {{ user.name }}[/color].[/size][/font][/CENTER]' +
      '[CENTER][size=15px][font=Georgia]Запросил доказательства у администратора.[/size][/font][/CENTER]<br><br>' +
      '[CENTER][size=15px][font=Georgia]С уважением, [COLOR=rgb(51, 255, 0)]Главная администрация[/color] сервера.[/size][/font][/CENTER]<br>' +
      '[CENTER][size=15px][font=Georgia][COLOR=GOLD]Приятной игры на нашем сервере![/color][/size][/font][/CENTER]',
        prefix: WATCHED_PREFIX,
        status: true,
},
{
          title: 'Mute / Jail',
          content:
      '[CENTER][size=15px][font=Georgia][CENTER]Приветствую, уважаемый игрок [COLOR=GOLD] {{ user.name }}[/color].[/size][/font][/CENTER]' +
      '[CENTER][size=15px][font=Georgia]Ваше наказание не столь строгое для обжалования.<br> Ваше обжалование получает cтатус: [Color=lime]Рассмотрено.[/color][/size][/font][/CENTER]<br><br>' +
      '[CENTER][size=15px][font=Georgia]С уважением, [COLOR=rgb(51, 255, 0)]Главная администрация[/color] сервера.[/size][/font][/CENTER]<br>' +
      '[CENTER][size=15px][font=Georgia][COLOR=GOLD]Приятной игры на нашем сервере![/color][/size][/font][/CENTER]',
          prefix: WATCHED_PREFIX,
          status: false,
},
{
          title: 'Ответ в прошлом обж',
          content:
      '[CENTER][size=15px][font=Georgia][CENTER]Приветствую, уважаемый игрок [COLOR=GOLD] {{ user.name }}[/color].[/size][/font][/CENTER]' +
      '[CENTER][size=15px][font=Georgia]В прошлом вашем обжаловании ответ был дан, и вредикт от главной администрации за это время не был изменен.<br> Ваше обжалование получает cтатус: [Color=rgb(255,0,0)]Отказано.[/color][/size][/font][/CENTER]<br><br>' +
      '[CENTER][size=15px][font=Georgia]С уважением, [COLOR=rgb(51, 255, 0)]Главная администрация[/color] сервера.[/size][/font][/CENTER]<br>' +
      '[CENTER][size=15px][font=Georgia][COLOR=GOLD]Приятной игры на нашем сервере![/color][/size][/font][/CENTER]',
          prefix: UNACCEPT_PREFIX,
          status: false,
},
{
        title: 'Отсутствует выдача наказания',
        content:
      '[CENTER][size=15px][font=Georgia][CENTER]Приветствую, уважаемый игрок [COLOR=GOLD] {{ user.name }}[/color].[/size][/font][/CENTER]' +
      '[CENTER][size=15px][font=Georgia]В вашем обжалование отсутствует скриншот выдачи наказания.<br> Ваша обжалование получает cтатус: [Color=rgb(255,0,0)]Отказано.[/color][/size][/font][/CENTER]<br><br>' +
      '[CENTER][size=15px][font=Georgia]С уважением, [COLOR=rgb(51, 255, 0)]Главная администрация[/color] сервера.[/size][/font][/CENTER]<br>' +
      '[CENTER][size=15px][font=Georgia][COLOR=GOLD]Приятной игры на нашем сервере![/color][/size][/font][/CENTER]',
        prefix: UNACCEPT_PREFIX,
        status: false,
},
{
          title: 'Минимальное наказание было',
          content:
      '[CENTER][size=15px][font=Georgia][CENTER]Приветствую, уважаемый игрок [COLOR=GOLD] {{ user.name }}[/color].[/size][/font][/CENTER]' +
      '[CENTER][size=15px][font=Georgia]Вам и так было выдано минимальное наказание.<br> Ваше обжалование получает cтатус: [Color=lime]Рассмотрено.[/color][/size][/font][/CENTER]<br><br>' +
      '[CENTER][size=15px][font=Georgia]С уважением, [COLOR=rgb(51, 255, 0)]Главная администрация[/color] сервера.[/size][/font][/CENTER]<br>' +
      '[CENTER][size=15px][font=Georgia][COLOR=GOLD]Приятной игры на нашем сервере![/color][/size][/font][/CENTER]',
          prefix: WATCHED_PREFIX,
          status: false,
},
{
        title: 'Обжалованию не подлежит',
        content:
      '[CENTER][size=15px][font=Georgia][CENTER]Приветствую, уважаемый игрок [COLOR=GOLD] {{ user.name }}[/color].[/size][/font][/CENTER]' +
      '[CENTER][size=15px][font=Georgia]Ваше наказание обжалованию не подлет.<br> Ваше обжалование получает Статус: [Color=red]Отказано.[/color][/size][/font][/CENTER]<br><br>' +
      '[CENTER][size=15px][font=Georgia]С уважением, [COLOR=rgb(51, 255, 0)]Главная администрация[/color] сервера.[/size][/font][/CENTER]<br>' +
      '[CENTER][size=15px][font=Georgia][COLOR=GOLD]Приятной игры на нашем сервере![/color][/size][/font][/CENTER]',
        prefix: UNACCEPT_PREFIX,
        status: false,
},
{
        title: 'Снять наказание и наказать админа',
        content:
      '[CENTER][size=15px][font=Georgia][CENTER]Приветствую, уважаемый игрок [COLOR=GOLD] {{ user.name }}[/color].[/size][/font][/CENTER]' +
      '[CENTER][size=15px][font=Georgia]Ваше наказание будет [Color=lime]снято[/color] в течении суток, а администратор будет [Color=lime]наказан[/color].<br> Ваше обжалование получает Статус: [Color=rgb(60,250,0)]Одобрено.[/color][/size][/font][/CENTER]<br><br>' +
      '[CENTER][size=15px][font=Georgia]С уважением, [COLOR=rgb(51, 255, 0)]Главная администрация[/color] сервера.[/size][/font][/CENTER]<br>' +
      '[CENTER][size=15px][font=Georgia][COLOR=GOLD]Приятной игры на нашем сервере![/color][/size][/font][/CENTER]',
        prefix: ACCEPT_PREFIX,
        status: false,
},
{
        title: 'Наказание смягчено',
        content:
      '[CENTER][size=15px][font=Georgia][CENTER]Приветствую, уважаемый игрок [COLOR=GOLD] {{ user.name }}[/color].[/size][/font][/CENTER]' +
      '[CENTER][size=15px][font=Georgia]Ваше обжалование получает Статус: [Color=rgb(60,250,0)]Одобрено.[/color] Наказание было смягчено.[/size][/font][/CENTER]<br><br>' +
      '[CENTER][size=15px][font=Georgia]С уважением, [COLOR=rgb(51, 255, 0)]Главная администрация[/color] сервера.[/size][/font][/CENTER]<br>' +
      '[CENTER][size=15px][font=Georgia][COLOR=GOLD]Приятной игры на нашем сервере![/color][/size][/font][/CENTER]',
        prefix: ACCEPT_PREFIX,
        status: false,
},
{
        title: 'Снизить до 30 дней',
        content:
      '[CENTER][size=15px][font=Georgia][CENTER]Приветствую, уважаемый игрок [COLOR=GOLD] {{ user.name }}[/color].[/size][/font][/CENTER]' +
      '[CENTER][size=15px][font=Georgia]Ваше наказание будет снижено 30-ти дней блокировки аккаунта.<br> Ваше обжалование получает статус: [Color=rgb(0,255,0)]Одобрено.[/color][/size][/font][/CENTER]<br><br>' +
      '[CENTER][size=15px][font=Georgia]С уважением, [COLOR=rgb(51, 255, 0)]Главная администрация[/color] сервера.[/size][/font][/CENTER]<br>' +
      '[CENTER][size=15px][font=Georgia][COLOR=GOLD]Приятной игры на нашем сервере![/color][/size][/font][/CENTER]',
        prefix: ACCEPT_PREFIX,
        status: false,
},
          {
        title: 'Снизить до 15 дней',
        content:
      '[CENTER][size=15px][font=Georgia][CENTER]Приветствую, уважаемый игрок [COLOR=GOLD] {{ user.name }}[/color].[/size][/font][/CENTER]' +
      '[CENTER][size=15px][font=Georgia]Ваше наказание будет снижено 15-ти дней блокировки аккаунта.<br> Ваше обжалование получает статус: [Color=rgb(0,255,0)]Одобрено.[/color][/size][/font][/CENTER]<br><br>' +
      '[CENTER][size=15px][font=Georgia]С уважением, [COLOR=rgb(51, 255, 0)]Главная администрация[/color] сервера.[/size][/font][/CENTER]<br>' +
      '[CENTER][size=15px][font=Georgia][COLOR=GOLD]Приятной игры на нашем сервере![/color][/size][/font][/CENTER]',
        prefix: ACCEPT_PREFIX,
        status: false,
},
{
        title: 'Снизить до 7 дней',
        content:
      '[CENTER][size=15px][font=Georgia][CENTER]Приветствую, уважаемый игрок [COLOR=GOLD] {{ user.name }}[/color].[/size][/font][/CENTER]' +
      '[CENTER][size=15px][font=Georgia]Ваше наказание будет снижено 7-ми дней блокировки аккаунта.<br> Ваше обжалование получает статус: [Color=rgb(0,255,0)]Одобрено.[/color][/size][/font][/CENTER]<br><br>' +
      '[CENTER][size=15px][font=Georgia]С уважением, [COLOR=rgb(51, 255, 0)]Главная администрация[/color] сервера.[/size][/font][/CENTER]<br>' +
      '[CENTER][size=15px][font=Georgia][COLOR=GOLD]Приятной игры на нашем сервере![/color][/size][/font][/CENTER]',
        prefix: ACCEPT_PREFIX,
        status: false,
},
  ];
    $(document).ready(() => {
        // Загрузка скрипта для обработки шаблонов
        $('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');

        // Добавление кнопок при загрузке страницы
        addButton('Одобрить', 'accepted');
        addButton('Отказать', 'unaccept');
        addButton('На рассмотрение', 'pin');
        addButton('Рассмотрено', 'watched');
        addButton('Закрыть', 'closed');
        addButton('Выбрать ответ', 'selectAnswer');


        // Поиск информации о теме
        const threadData = getThreadData();

        $('button#pin').click(() => editThreadData(PIN_PREFIX, true));
        $('button#accepted').click(() => editThreadData(ACCEPT_PREFIX, false));
        $(`button#teamProject`).click(() => editThreadData(COMMAND_PREFIX, true));
        $(`button#watched`).click(() => editThreadData(WATCHED_PREFIX, false));
        $(`button#unaccept`).click(() => editThreadData(UNACCEPT_PREFIX, false));
        $(`button#mainAdmin`).click(() => editThreadData(GA_PREFIX, true));
        $(`button#specialAdmin`).click(() => editThreadData(SPECIAL_PREFIX, true));
        $('button#unaccept').click(() => editThreadData(UNACCEPT_PREFIX, false));

        $(`button#selectAnswer`).click(() => {
            XF.alert(buttonsMarkup(buttons), null, 'Выберите ответ:');
            buttons.forEach((btn, id) => {
                if(id > 1) {
                    $(`button#answers-${id}`).click(() => pasteContent(id, threadData, true));
                } else {
                    $(`button#answers-${id}`).click(() => pasteContent(id, threadData, false));
                }
            });
        });
    });

$(document).ready(() => {
    // Загрузка скрипта для обработки шаблонов
    $('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');

    // Поиск информации о теме
    const threadData = getThreadData();

    $('button#pin').click(() => editThreadData(PINN_PREFIX, true));
    $('button#Ga').click(() => editThreadData(GA_PREFIX, true));
    $('button#Spec').click(() => editThreadData(SPECY_PREFIX, true));
    $('button#teamProject').click(() => editThreadData(COMMAND_PREFIX, true));

     $(`button#selectAnswer`).click(() => {
      XF.alert(buttonsMarkup(buttons), null, 'Выберите ответ:');
      buttons.forEach((btn, id) => {
        if (id > 0) {
          $(`button#answers-${id}`).click(() => pasteContent(id, threadData, true));
        }
        else {
          $(`button#answers-${id}`).click(() => pasteContent(id, threadData, false));
        }
      });
    });
  });
  function addButton(name, id) {
    $('.button--icon--reply').before(
      `<button type="button" class="button rippleButton" id="${id}" style="border-radius: 12px; margin-right: 5px; border: 1px solid gold;">${name}</button>`,
    );
  }

	function buttonsMarkup(buttons) {
	return `<div class="select_answer">${buttons
	.map(
	(btn, i) =>
	`<button id="answers-${i}" class="button--primary button ` +
	`rippleButton" style="margin:4px; ${btn.dpstyle}"><span class="button-text">${btn.title}</span></button>`,
	)
	.join('')}</div>`;
	}

  function pasteContent(id, data = {}, send = false) {
    const template = Handlebars.compile(buttons[id].content);
    if ($('.fr-element.fr-view p').text() === '') $('.fr-element.fr-view p').empty();

    $('span.fr-placeholder').empty();
    $('div.fr-element.fr-view p').append(template(data));
    $('a.overlay-titleCloser').trigger('click');

    if (send == true) {
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
        4 < hours && hours <= 11 ?
        'Доброе утро' :
        11 < hours && hours <= 15 ?
        'Добрый день' :
        15 < hours && hours <= 21 ?
        'Добрый вечер' :
        'Доброй ночи',
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
    } else  {
        fetch(`${document.URL}edit`, {
          method: 'POST',
          body: getFormData({
            prefix_id: prefix,
            title: threadTitle,
            pin: 1,
                              sticky: 1,
            _xfToken: XF.config.csrf,
            _xfRequestUri: document.URL.split(XF.config.url.fullBase)[1],
            _xfWithData: 1,
            _xfResponseType: 'json',
          }),
        }).then(() => location.reload());
    }

function moveThread(prefix, type) {
// Получаем заголовок темы, так как он необходим при запросе
const threadTitle = $('.p-title-value')[0].lastChild.textContent;

fetch(`${document.URL}move`, {
  method: 'POST',
  body: getFormData({
    prefix_id: prefix,
    title: threadTitle,
    target_node_id: type,
    redirect_type: 'none',
    notify_watchers: 1,
    starter_alert: 1,
    starter_alert_reason: "",
    _xfToken: XF.config.csrf,
    _xfRequestUri: document.URL.split(XF.config.url.fullBase)[1],
    _xfWithData: 1,
    _xfResponseType: 'json',
  }),
}).then(() => location.reload());
}

function getFormData(data) {
    const formData = new FormData();
    Object.entries(data).forEach(i => formData.append(i[0], i[1]));
    return formData;
  }
    }
})();