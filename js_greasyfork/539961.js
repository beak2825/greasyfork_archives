// ==UserScript==
// @name         Скрипт руководства admins BLESS RUSSIA
// @namespace    https://forum.blessrussia.online
// @version      1.10
// @description  Скрипт для Руководства сервера | Bless Russia по всем вопросам на счет скрипта VK - https://vk.com/akroniksss
// @author       акрошка
// @match        https://forum.blessrussia.com/index.php*
// @include      https://forum.blessrussia.com/index.php
// @grant        none
// @license 	 MIT
// @icon https://icons.iconarchive.com/icons/thesquid.ink/free-flat-sample/128/support-icon.png
// @downloadURL https://update.greasyfork.org/scripts/539961/%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D1%80%D1%83%D0%BA%D0%BE%D0%B2%D0%BE%D0%B4%D1%81%D1%82%D0%B2%D0%B0%20admins%20BLESS%20RUSSIA.user.js
// @updateURL https://update.greasyfork.org/scripts/539961/%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D1%80%D1%83%D0%BA%D0%BE%D0%B2%D0%BE%D0%B4%D1%81%D1%82%D0%B2%D0%B0%20admins%20BLESS%20RUSSIA.meta.js
// ==/UserScript==
 
(function () {
    'use strict';
    const UNACCEPT_PREFIX = 7; // Префикс "Отказано"
    const ACCEPT_PREFIX = 6; // Префикс "Одобрено"
    const RESHENO_PREFIX = 6; // Префикс "Решено"
    const PIN_PREFIX = 2; // Префикс "На рассмотрении"
    const GA_PREFIX = 11; // Префикс "Главному Администратору"
    const COMMAND_PREFIX = 9; // Префикс "Команде Проекта"
    const WATCHED_PREFIX = 8; // Префикс "Рассмотрено"
    const CLOSE_PREFIX = 5; // Префикс "Закрыто"
    const SPECIAL_PREFIX = 10; // Префикс "Специальному Администратору"
    const buttons = [
      {
        title: '-----------------------------------Работа с темами и сообщениями--------------------------------'
      },
      {
        title: 'Взять на рассмотрение',
        content:
  '[CENTER][size=15px][font=Arial][CENTER]Приветствую, уважаемый игрок [COLOR=rgb(51, 255, 0)] {{ user.mention }}[/color].[/size][/font][/CENTER]' +
  '[CENTER][size=15px][font=Arial]Ваша жалоба получает Статус: [Color=rgb(255, 155 ,0)]На рассмотрении.[/color][/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Arial]Благодарим вас за ваше обращение.[/size][/font][/CENTER]<br>' +
  '[CENTER][size=15px][font=Arial][size=15px]С уважением, старшая администрация [COLOR=rgb(255,200,0)]Bless Russia[/color] сервер [Color=rgb(144, 238 ,144)]Green.[/size][/font][/CENTER]',
        prefix: PIN_PREFIX,
      status: false,
      },
      {
        title: 'Жалоба не по форме',
        content:
  '[CENTER][size=15px][font=Arial][CENTER]Приветствую, уважаемый игрок [COLOR=rgb(51, 255, 0)] {{ user.mention }}[/color].[/size][/font][/CENTER]' +
  '[CENTER][size=15px][font=Arial]Заявления не по форме мы не рассматриваем[/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Arial]Благодарим вас за ваше обращение.[/size][/font][/CENTER]<br>' +
  '[CENTER][size=15px][font=Arial][size=15px]С уважением, старшая администрация [COLOR=rgb(255,200,0)]Bless Russia[/color] сервер [Color=rgb(144, 238 ,144)]Green.[/size][/font][/CENTER]',
        prefix: UNACCEPT_PREFIX,
      status: false,
      },
      {
        title: 'Отсуствие доказательств',
        content:
  '[CENTER][size=15px][font=Arial][CENTER]Приветствую, уважаемый игрок [COLOR=rgb(51, 255, 0)] {{ user.mention }}[/color].[/size][/font][/CENTER]' +
  '[CENTER][size=15px][font=Arial]Без доказательств/недостатка доказательств мы помочь не можем[/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Arial]Благодарим вас за ваше обращение.[/size][/font][/CENTER]<br>' +
  '[CENTER][size=15px][font=Arial][size=15px]С уважением, старшая администрация [COLOR=rgb(255,200,0)]Bless Russia[/color] сервер [Color=rgb(144, 238 ,144)]Green.[/size][/font][/CENTER]',
        prefix: UNACCEPT_PREFIX,
      status: false,
      },
      {
        title: 'Не относится',
        content:
  '[CENTER][size=15px][font=Arial][CENTER]Приветствую, уважаемый игрок [COLOR=rgb(51, 255, 0)] {{ user.mention }}[/color].[/size][/font][/CENTER]' +
  '[CENTER][size=15px][font=Arial]Ваше обращение не относится к данному разделу.[/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Arial]Благодарим вас за ваше обращение.[/size][/font][/CENTER]<br>' +
  '[CENTER][size=15px][font=Arial][size=15px]С уважением, старшая администрация [COLOR=rgb(255,200,0)]Bless Russia[/color] сервер [Color=rgb(144, 238 ,144)]Green.[/size][/font][/CENTER]',
        prefix: UNACCEPT_PREFIX,
      status: false,
      },
      {
        title: 'Дубликат темы',
        content:
  '[CENTER][size=15px][font=Arial][CENTER]Приветствую, уважаемый игрок [COLOR=rgb(51, 255, 0)] {{ user.mention }}[/color].[/size][/font][/CENTER]' +
  '[CENTER][size=15px][font=Arial]Ваша тема является дубликатом предыдущей.[/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Arial]Благодарим вас за ваше обращение.[/size][/font][/CENTER]<br>' +
  '[CENTER][size=15px][font=Arial][size=15px]С уважением, старшая администрация [COLOR=rgb(255,200,0)]Bless Russia[/color] сервер [Color=rgb(144, 238 ,144)]Green.[/size][/font][/CENTER]',
        prefix: UNACCEPT_PREFIX,
      status: false,
      },
     {
        title: 'Отказано (если нет причины)',
        content:
  '[CENTER][size=15px][font=Arial][CENTER]Приветствую, уважаемый игрок [COLOR=rgb(51, 255, 0)] {{ user.mention }}[/color].[/size][/font][/CENTER]' +
  '[CENTER][size=15px][font=Arial]Ваша жалоба получает Статус: [Color=rgb(255,0,0)]Отказано.[/color][/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Arial]Благодарим вас за ваше обращение.[/size][/font][/CENTER]<br>' +
  '[CENTER][size=15px][font=Arial][size=15px]С уважением, старшая администрация [COLOR=rgb(255,200,0)]Bless Russia[/color] сервер [Color=rgb(144, 238 ,144)]Green.[/size][/font][/CENTER]',
        prefix: UNACCEPT_PREFIX,
      status: false,
      },
    {
        title: 'Взлом акк',
        content:
  '[CENTER][size=15px][font=Arial][CENTER]Приветствую, уважаемый игрок [COLOR=rgb(51, 255, 0)] {{ user.mention }}[/color].[/size][/font][/CENTER]' +
  '[CENTER][size=15px][font=Arial]Ваше обжалование получает Статус: [Color=rgb(255,0,0)]Отказано.[/color] Взломанные аккаунты не подлежат восстановлению.[/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Arial]Благодарим вас за ваше обращение.[/size][/font][/CENTER]<br>' +
  '[CENTER][size=15px][font=Arial][size=15px]С уважением, старшая администрация [COLOR=rgb(255,200,0)]Bless Russia[/color] сервер [Color=rgb(144, 238 ,144)]Green.[/size][/font][/CENTER]',
        prefix: UNACCEPT_PREFIX,
      status: false,
      },
{
        title: 'Ошибка ID',
        content:
  '[CENTER][size=15px][font=Arial][CENTER]Приветствую, уважаемый игрок [COLOR=rgb(51, 255, 0)] {{ user.mention }}[/color].[/size][/font][/CENTER]' +
  '[CENTER][size=15px][font=Arial]Ваша жалоба получает Статус: [Color=rgb(60,250,0)]Одобрено.[/color] Администратор ошибся ID. Наказание снято, приношу свои извинения.[/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Arial]Благодарим вас за ваше обращение.[/size][/font][/CENTER]<br>' +
  '[CENTER][size=15px][font=Arial][size=15px]С уважением, старшая администрация [COLOR=rgb(255,200,0)]Bless Russia[/color] сервер [Color=rgb(144, 238 ,144)]Green.[/size][/font][/CENTER]',
        prefix: ACCEPT_PREFIX,
      status: false,
      },
    {
        title: 'Ошибка разделом',
        content:
  '[CENTER][size=15px][font=Arial][CENTER]Приветствую, уважаемый игрок [COLOR=rgb(51, 255, 0)] {{ user.mention }}[/color].[/size][/font][/CENTER]' +
  '[CENTER][size=15px][font=Arial]Вы ошиблись разделом. Переношу ваше заявления в нужный раздел.[/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Arial]Благодарим вас за ваше обращение.[/size][/font][/CENTER]<br>' +
  '[CENTER][size=15px][font=Arial][size=15px]С уважением, старшая администрация [COLOR=rgb(255,200,0)]Bless Russia[/color] сервер [Color=rgb(144, 238 ,144)]Green.[/size][/font][/CENTER]',
        prefix: WATCHED_PREFIX,
      status: false,
      },
       {
        title: 'Одобрено на админа',
        content:
  '[CENTER][size=15px][font=Arial][CENTER]Приветствую, уважаемый игрок [COLOR=rgb(51, 255, 0)] {{ user.mention }}[/color].[/size][/font][/CENTER]' +
  '[CENTER][size=15px][font=Arial]Ознакомившись с доказательствами, администратор будет наказан. Ваша жалоба получает Статус: [Color=rgb(60, 250 ,0)]Одобрено.[/color][/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Arial]Благодарим вас за ваше обращение.[/size][/font][/CENTER]<br>' +
  '[CENTER][size=15px][font=Arial][size=15px]С уважением, старшая администрация [COLOR=rgb(255,200,0)]Bless Russia[/color] сервер [Color=rgb(144, 238 ,144)]Green.[/size][/font][/CENTER]',
        prefix: ACCEPT_PREFIX,
      status: false,
      },
      {
        title: 'Запрос док-в у админа',
        content:
  '[CENTER][size=15px][font=Arial][CENTER]Приветствую, уважаемый игрок [COLOR=rgb(51, 255, 0)] {{ user.mention }}[/color].[/size][/font][/CENTER]' +
  '[CENTER][size=15px][font=Arial][Color=rgb(255,155,0)]Запросил доказательства у администратора[/color][/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Arial]Благодарим вас за ваше обращение.[/size][/font][/CENTER]<br>' +
  '[CENTER][size=15px][font=Arial][size=15px]С уважением, старшая администрация [COLOR=rgb(255,200,0)]Bless Russia[/color] сервер [Color=rgb(144, 238 ,144)]Green.[/size][/font][/CENTER]',
        prefix: WATCHED_PREFIX,
      status: false,
      },
      {
        title: 'Отказано на админа',
        content:
  '[CENTER][size=15px][font=Arial][CENTER]Приветствую, уважаемый игрок [COLOR=rgb(51,255,0)]{{ user.mention }}[/color].[/size][/font][/CENTER]' +
  '[CENTER][size=15px][font=Arial]Администратор предоставил доказательства.[/size][/font][/CENTER]<br>' +
  '[CENTER][size=15px][font=Arial]Ваша жалоба получает Статус: [Color=rgb(255,0,0)]Отказано.[/color][/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Arial]Благодарим вас за ваше обращение.[/size][/font][/CENTER]<br>' +
  '[CENTER][size=15px][font=Arial]С уважением, старшая администрация [COLOR=rgb(255,200,0)]Bless Russia[/color] сервер [Color=rgb(144, 238 ,144)]Green.[/size][/font][/CENTER]',
        prefix: UNACCEPT_PREFIX,
      status: false,
      },
    {
        title: 'Отсуствует /time',
        content:
  '[CENTER][size=15px][font=Arial][CENTER]Приветствую, уважаемый игрок [COLOR=rgb(51,255,0)]{{ user.mention }}[/color].[/size][/font][/CENTER]' +
  '[CENTER][size=15px][font=Arial]Отсутствует /time. Ваша жалоба получает Статус: [Color=rgb(255,0,0)]Отказано.[/color][/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Arial]Благодарим вас за ваше обращение.[/size][/font][/CENTER]<br>' +
  '[CENTER][size=15px][font=Arial]С уважением, старшая администрация [COLOR=rgb(255,200,0)]Bless Russia[/color] сервер [Color=rgb(144, 238 ,144)]Green.[/size][/font][/CENTER]',
        prefix: UNACCEPT_PREFIX,
      status: false,
      },
    {
        title: 'Неверный ник',
        content:
  '[CENTER][size=15px][font=Arial][CENTER]Приветствую, уважаемый игрок [COLOR=rgb(51,255,0)]{{ user.mention }}[/color].[/size][/font][/CENTER]' +
  '[CENTER][size=15px][font=Arial]Никнейм в 2 пункте отличается от ника в док-вах. Ваша жалоба получает Статус: [Color=rgb(255,0,0)]Отказано.[/color][/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Arial]Благодарим вас за ваше обращение.[/size][/font][/CENTER]<br>' +
  '[CENTER][size=15px][font=Arial]С уважением, старшая администрация [COLOR=rgb(255,200,0)]Bless Russia[/color] сервер [Color=rgb(144, 238 ,144)]Green.[/size][/font][/CENTER]',
        prefix: UNACCEPT_PREFIX,
      status: false,
      },
    {
        title: 'Срок подачи истек',
        content:
  '[CENTER][size=15px][font=Arial][CENTER]Приветствую, уважаемый игрок [COLOR=rgb(51,255,0)]{{ user.mention }}[/color].[/size][/font][/CENTER]' +
  '[CENTER][size=15px][font=Arial]Срок подачи жалобы истек.[/size][/font][/CENTER]<br>' +
  '[CENTER][size=15px][font=Arial]Ваша жалоба получает Статус: [Color=rgb(255,0,0)]Отказано.[/color][/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Arial]Благодарим вас за ваше обращение.[/size][/font][/CENTER]<br>' +
  '[CENTER][size=15px][font=Arial]С уважением, старшая администрация [COLOR=rgb(255,200,0)]Bless Russia[/color] сервер [Color=rgb(144, 238 ,144)]Green.[/size][/font][/CENTER]',
        prefix: UNACCEPT_PREFIX,
      status: false,
      },
    {
      title: '----------------------------------- Работа с обжалованиями ----------------------------------------------'
      },
    {
        title: 'Взять обжалование на рассмотрение',
        content:
  '[CENTER][size=15px][font=Arial][CENTER]Приветствую, уважаемый игрок [COLOR=rgb(51,255,0)]{{ user.mention }}[/color].[/size][/font][/CENTER]' +
  '[CENTER][size=15px][font=Arial]Ваша обжалование получает Статус: [Color=rgb(255, 155 ,0)]На рассмотрении.[/color][/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Arial]Благодарим вас за ваше обращение.[/size][/font][/CENTER]<br>' +
  '[CENTER][size=15px][font=Arial]С уважением, старшая администрация [COLOR=rgb(255,200,0)]Bless Russia[/color] сервер [Color=rgb(144, 238 ,144)]Green.[/size][/font][/CENTER]',
        prefix: WATCHED_PREFIX,
      status: false,
      },
    {
        title: 'Одобрено в обжаловании',
        content:
  '[CENTER][size=15px][font=Arial][CENTER]Приветствую, уважаемый игрок [COLOR=rgb(51,255,0)]{{ user.mention }}[/color].[/size][/font][/CENTER]' +
  '[CENTER][size=15px][font=Arial]Ваше обжалование получает Статус: [Color=rgb(60, 250 ,0)]Одобрено.[/color][/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Arial]Благодарим вас за ваше обращение.[/size][/font][/CENTER]<br>' +
  '[CENTER][size=15px][font=Arial]С уважением, старшая администрация [COLOR=rgb(255,200,0)]Bless Russia[/color] сервер [Color=rgb(144, 238 ,144)]Green.[/size][/font][/CENTER]',
        prefix: ACCEPT_PREFIX,
      status: false,
      },
          {
        title: 'Отказано в обжаловании',
        content:
  '[CENTER][size=15px][font=Arial][CENTER]Приветствую, уважаемый игрок [COLOR=rgb(51,255,0)]{{ user.mention }}[/color].[/size][/font][/CENTER]' +
  '[CENTER][size=15px][font=Arial]Администратор предоставил доказательства. Ваше обжалование получает Статус: [Color=rgb(255,0,0)]Отказано.[/color][/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Arial]Благодарим вас за ваше обращение.[/size][/font][/CENTER]<br>' +
  '[CENTER][size=15px][font=Arial]С уважением, старшая администрация [COLOR=rgb(255,200,0)]Bless Russia[/color] сервер [Color=rgb(144, 238 ,144)]Green.[/size][/font][/CENTER]',
        prefix: UNACCEPT_PREFIX,
      status: false,
      },
    {
        title: 'Запрос док-ва у админа',
        content:
  '[CENTER][size=15px][font=Arial][CENTER]Приветствую, уважаемый игрок [COLOR=rgb(51,255,0)]{{ user.mention }}[/color].[/size][/font][/CENTER]' +
  '[CENTER][size=15px][font=Arial]Запросил доказательства у администратора.[/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Arial]Благодарим вас за ваше обращение.[/size][/font][/CENTER]<br>' +
  '[CENTER][size=15px][font=Arial]С уважением, старшая администрация [COLOR=rgb(255,200,0)]Bless Russia[/color] сервер [Color=rgb(144, 238 ,144)]Green.[/size][/font][/CENTER]',
        prefix: WATCHED_PREFIX,
      status: false,
      },
    {
        title: 'Нет доказательств',
        content:
  '[CENTER][size=15px][font=Arial][CENTER]Приветствую, уважаемый игрок [COLOR=rgb(51, 255, 0)] {{ user.mention }}[/color].[/size][/font][/CENTER]' +
  '[CENTER][size=15px][font=Arial]Без доказательств/недостатка доказательств мы помочь не можем[/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Arial]Благодарим вас за ваше обращение.[/size][/font][/CENTER]<br>' +
  '[CENTER][size=15px][font=Arial]С уважением, старшая администрация [COLOR=rgb(255,200,0)]Bless Russia[/color] сервер [Color=rgb(144, 238 ,144)]Green.[/size][/font][/CENTER]',
        prefix: UNACCEPT_PREFIX,
      status: false,
      },
         {
        title: 'Наказание смягчено',
        content:
  '[CENTER][size=15px][font=Arial][CENTER]Приветствую, уважаемый игрок [COLOR=rgb(51,255,0)]{{ user.mention }}[/color].[/size][/font][/CENTER]' +
  '[CENTER][size=15px][font=Arial]Ваша жалоба получает Статус: [Color=rgb(60,250,0)]Одобрено.[/color] Наказание было смягчено.[/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Arial]Благодарим вас за ваше обращение.[/size][/font][/CENTER]<br>' +
  '[CENTER][size=15px][font=Arial]С уважением, старшая администрация [COLOR=rgb(255,200,0)]Bless Russia[/color] сервер [Color=rgb(144, 238 ,144)]Green.[/size][/font][/CENTER]',
        prefix: ACCEPT_PREFIX,
      status: false,
      },
    {
      title: '-----------------------------------Передано--------------------------------------------------------------------------'
      },
    {
        title: 'Тех Адм',
        content:
  '[CENTER][size=15px][font=Arial][CENTER]Приветствую, уважаемый игрок [COLOR=rgb(51, 255, 0)] {{ user.mention }}[/color].[/size][/font][/CENTER]' +
  '[CENTER][size=15px][font=Arial]Ваше обращение передано в [Color=rgb(0,0,255)]Технический отдел[/color].[/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Arial]Благодарим вас за ваше обращение.[/size][/font][/CENTER]<br>' +
  '[CENTER][size=15px][font=Arial]С уважением, старшая администрация [COLOR=rgb(255,200,0)]Bless Russia[/color] сервер [Color=rgb(144, 238 ,144)]Green.[/size][/font][/CENTER]',
        prefix: TEXY_PREFIX,
      status: false,
      },
    {
        title: 'Спец Адм',
        content:
  '[CENTER][size=15px][font=Arial][CENTER]Приветствую, уважаемый игрок [COLOR=rgb(51, 255, 0)] {{ user.mention }}[/color].[/size][/font][/CENTER]' +
  '[CENTER][size=15px][font=Arial]Ваше обращение передано [Color=rgb(255,0,0)]Специальной администраторации[/color].[/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Arial]Благодарим вас за ваше обращение.[/size][/font][/CENTER]<br>' +
  '[CENTER][size=15px][font=Arial]С уважением, старшая администрация [COLOR=rgb(255,200,0)]Bless Russia[/color] сервер [Color=rgb(144, 238 ,144)]Green.[/size][/font][/CENTER]',
        prefix: SPECIAL_PREFIX,
      status: false,
      },
    {
        title: 'Команда Проекта',
        content:
  '[CENTER][size=15px][font=Arial][CENTER]Приветствую, уважаемый игрок [COLOR=rgb(51, 255, 0)] {{ user.mention }}[/color].[/size][/font][/CENTER]' +
  '[CENTER][size=15px][font=Arial]Ваше обращение передано [Color=rgb(255,0,0)]Команде проекта[/color].[/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Arial]Благодарим вас за ваше обращение.[/size][/font][/CENTER]<br>' +
  '[CENTER][size=15px][font=Arial]С уважением, старшая администрация [COLOR=rgb(255,200,0)]Bless Russia[/color] сервер [Color=rgb(144, 238 ,144)]Green.[/size][/font][/CENTER]',
        prefix: COMMAND_PREFIX,
      status: false,
      },
    {
        title: 'ГА',
        content:
  '[CENTER][size=15px][font=Arial][CENTER]Приветствую, уважаемый игрок [COLOR=rgb(51, 255, 0)] {{ user.mention }}[/color].[/size][/font][/CENTER]' +
  '[CENTER][size=15px][font=Arial]Ваше обращение передано [Color=rgb(255,0,0)]Главному администратору[/color] сервера.[/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Arial]Благодарим вас за ваше обращение.[/size][/font][/CENTER]<br>' +
  '[CENTER][size=15px][font=Arial]С уважением, старшая администрация [COLOR=rgb(255,200,0)]Bless Russia[/color] сервер [Color=rgb(144, 238 ,144)]Green.[/size][/font][/CENTER]',
        prefix: GA_PREFIX,
      status: false,
      },
    {
        title: '-----------------------------------Работа с Амнистиями------------------------------------------------------------'
      },
    {
        title: 'Одобрено',
        content:
  '[CENTER][size=15px][font=Arial][CENTER]Приветствую, уважаемый игрок [COLOR=rgb(51,255,0)]{{ user.mention }}[/color].[/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Arial]Ваше заявление на Амнистию получает Статус: [Color=rgb(60, 250 ,0)]Одобрено.[/color][/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Arial]Благодарим вас за ваше обращение.[/size][/font][/CENTER]<br>' +
  '[CENTER][size=15px][font=Arial][size=15px][font=Arial]С уважением, Старшая Администрация [COLOR=rgb(255,200,0)]King Russia[/color].[/size][/font][/CENTER]',
        prefix: ACCEPT_PREFIX,
      status: false,
      },
    {
        title: 'Отказано',
        content:
  '[B][CENTER][size=15px][font=Arial][CENTER]Приветствую, уважаемый игрок [COLOR=rgb(51,255,0)]{{ user.mention }}[/color].[/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Arial]Ваше заявление на Амнистию получает Статус: [Color=rgb(255,0,0)]Отказано.[/color][/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Arial]Благодарим вас за ваше обращение.[/size][/font][/CENTER]<br>' +
  '[CENTER][size=15px][font=Arial][size=15px][font=Arial]С уважением, Старшая Администрация [COLOR=rgb(255,200,0)]King Russia[/color].[/size][/font][/CENTER][/B]',
        prefix: UNACCEPT_PREFIX,
      status: false,
      },
  ];
 
    $(document).ready(() => {
      // Загрузка скрипта для обработки шаблонов
      $('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');
 
      // Добавление кнопок при загрузке страницы
      addButton('Рассмотрено', 'pin');
      addButton('Одобрено', 'accepted');
      addButton('Отказано', 'unaccept');
      addButton('Главному Администратору', 'Ga');
      addButton('Команда Проекта', 'teamProject');
      addButton('Тех.адм', 'Texy')
      addButton('Спец.адм', 'Spec')
      addButton('Ответы', 'selectAnswer');
 
      // Поиск информации о теме
      const threadData = getThreadData();
 
      $('button#pin').click(() => editThreadData(RASSMOTRENNO_PREFIX, true));
      $('button#accepted').click(() => editThreadData(ACCEPT_PREFIX, false));
      $('button#Ga').click(() => editThreadData(GA_PREFIX, true));
      $('button#teamProject').click(() => editThreadData(COMMAND_PREFIX, true));
      $('button#unaccept').click(() => editThreadData(UNACCEPT_PREFIX, false));
      $('button#Texy').click(() => editThreadData(TEX_PREFIX, false));
      $('button#Spec').click(() => editThreadData(SPEC_PREFIX, false));
      $('button#Zakrito').click(() => editThreadData(CLOSE_PREFIX, false));
       
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
 
    function addButton(name, id) {
        $('.button--icon--reply').before(
            `<button type="button" class="button--primary button rippleButton" id="${id}" style="border-radius: 30px; margin-right: 7px;">${name}</button>`,
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