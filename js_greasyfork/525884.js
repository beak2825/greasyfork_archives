// ==UserScript==
// @name         ГА скрипт
// @namespace    https://forum.kingrussia.com/index.php*
// @version      1.25
// @description  Работа с форумом
// @author       Манжиро Сано | Manjiro_Sano
// @match        https://forum.kingrussia.com/index.php*
// @include      https://forum.kingrussia.com/index.php
// @grant        none
// @license 	 MIT
// @icon https://icons.iconarchive.com/icons/thesquid.ink/free-flat-sample/128/support-icon.png
// @downloadURL https://update.greasyfork.org/scripts/525884/%D0%93%D0%90%20%D1%81%D0%BA%D1%80%D0%B8%D0%BF%D1%82.user.js
// @updateURL https://update.greasyfork.org/scripts/525884/%D0%93%D0%90%20%D1%81%D0%BA%D1%80%D0%B8%D0%BF%D1%82.meta.js
// ==/UserScript==

(function () {
    'use strict';
  const RASSMOTRENNO_PREFIX = 7; // Prefix that will be set when thread pins
  const UNACCEPT_PREFIX = 6; // Prefix that will be set when thread closes
  const ACCEPT_PREFIX = 5; // Prefix that will be set when thread solved
  const COMMAND_PREFIX = 9; // Prefix that will be set when thread solved
  const WATCHED_PREFIX = 4;
  const TEX_PREFIX = 10;
  const SPEC_PREFIX = 12;
  const GA_PREFIX = 8;
  const buttons = [
      {
        title: '-----------------------------------Работа с темами и сообщениями--------------------------------'
      },
      {
        title: 'Взять жалобу на рассмотрение',
        content:
  '[CENTER][size=15px][font=Arial][CENTER]Приветствую, уважаемый игрок [COLOR=rgb(51, 255, 0)] {{ user.mention }}[/color].[/size][/font][/CENTER]<br>' +
  '[CENTER][size=15px][font=Arial]Ваша жалоба получает Статус: [Color=rgb(255, 155 ,0)]На рассмотрении.[/color][/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Arial]Благодарим вас за ваше обращение.[/size][/font][/CENTER]<br>' +
  '[CENTER][size=15px][font=Arial][size=15px]С уважением, Старшая Администрация [COLOR=rgb(255,200,0)]King Russia[/color].[/size][/font][/CENTER]',
        prefix: WATCHED_PREFIX,
      status: false,
      },
      {
        title: 'не по форме',
        content:
  '[CENTER][size=15px][font=Arial][CENTER]Приветствую, уважаемый игрок [COLOR=rgb(51, 255, 0)] {{ user.mention }}[/color].[/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Arial]Заявления не по форме мы не рассматриваем[/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Arial]Благодарим вас за ваше обращение.[/size][/font][/CENTER]<br>' +
  '[CENTER][size=15px][font=Arial]С уважением, Старшая Администрация [COLOR=rgb(255,200,0)]King Russia[/color].[/size][/font][/CENTER]',
        prefix: UNACCEPT_PREFIX,
      status: false,
      },
      {
        title: 'Нет док-в',
        content:
  '[CENTER][size=15px][font=Arial][CENTER]Приветствую, уважаемый игрок [COLOR=rgb(51, 255, 0)] {{ user.mention }}[/color].[/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Arial]Без доказательств/недостатка доказательств мы помочь не можем[/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Arial]Благодарим вас за ваше обращение.[/size][/font][/CENTER]<br>' +
  '[CENTER][size=15px][font=Arial]С уважением, Старшая Администрация [COLOR=rgb(255,200,0)]King Russia[/color].[/size][/font][/CENTER]',
        prefix: UNACCEPT_PREFIX,
      status: false,
      },
      {
        title: 'Не относится',
        content:
  '[CENTER][size=15px][font=Arial][CENTER]Приветствую, уважаемый игрок [COLOR=rgb(51,255,0)]{{ user.mention }}[/color].[/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Arial]Ваше обращение не относится к данному разделу.[/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Arial]Благодарим вас за ваше обращение.[/size][/font][/CENTER]<br>' +
  '[CENTER][size=15px][font=Arial]С уважением, Старшая Администрация [COLOR=rgb(255,200,0)]King Russia[/color].[/size][/font][/CENTER]',
        prefix: UNACCEPT_PREFIX,
      status: false,
      },
      {
        title: 'Дубликат',
        content:
  '[CENTER][size=15px][font=Arial][CENTER]Приветствую, уважаемый игрок [COLOR=rgb(51,255,0)]{{ user.mention }}[/color].[/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Arial]Ваша тема является дубликатом предыдущей.[/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Arial]Благодарим вас за ваше обращение.[/size][/font][/CENTER]<br>' +
  '[CENTER][size=15px][font=Arial]С уважением, Старшая Администрация [COLOR=rgb(255,200,0)]King Russia[/color].[/size][/font][/CENTER]',
        prefix: UNACCEPT_PREFIX,
      status: false,
      },
     {
        title: 'Отказано',
        content:
  '[CENTER][size=15px][font=Arial][CENTER]Приветствую, уважаемый игрок [COLOR=rgb(51,255,0)]{{ user.mention }}[/color].[/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Arial]Ваша жалоба получает Статус: [Color=rgb(255,0,0)]Отказано.[/color][/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Arial]Благодарим вас за ваше обращение.[/size][/font][/CENTER]<br>' +
  '[CENTER][size=15px][font=Arial]С уважением, Старшая Администрация [COLOR=rgb(255,200,0)]King Russia[/color].[/size][/font][/CENTER]',
        prefix: UNACCEPT_PREFIX,
      status: false,
      },
    {
        title: 'Взлом акк',
        content:
  '[CENTER][size=15px][font=Arial][CENTER]Приветствую, уважаемый игрок [COLOR=rgb(51,255,0)]{{ user.mention }}[/color].[/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Arial]Ваше обжалование получает Статус: [Color=rgb(255,0,0)]Отказано.[/color] Взломанные аккаунты не подлежат восстановлению.[/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Arial]Благодарим вас за ваше обращение.[/size][/font][/CENTER]<br>' +
  '[CENTER][size=15px][font=Arial]С уважением, Старшая Администрация [COLOR=rgb(255,200,0)]King Russia[/color].[/size][/font][/CENTER]',
        prefix: UNACCEPT_PREFIX,
      status: false,
      },
     {
        title: 'Одобрено',
        content:
  '[CENTER][size=15px][font=Arial][CENTER]Приветствую, уважаемый игрок [COLOR=rgb(51,255,0)]{{ user.mention }}[/color].[/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Arial]Ваша жалоба получает Статус: [Color=rgb(60,250,0)]Одобрено.[/color][/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Arial]Благодарим вас за ваше обращение.[/size][/font][/CENTER]<br>' +
  '[CENTER][size=15px][font=Arial][size=15px][font=Arial]С уважением, Старшая Администрация [COLOR=rgb(255,200,0)]King Russia[/color].[/size][/font][/CENTER]',
        prefix: ACCEPT_PREFIX,
      status: false,
      },
{
        title: 'Ошибка ID',
        content:
  '[CENTER][size=15px][font=Arial][CENTER]Приветствую, уважаемый игрок [COLOR=rgb(51,255,0)]{{ user.mention }}[/color].[/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Arial]Ваша жалоба получает Статус: [Color=rgb(60,250,0)]Одобрено.[/color] Администратор ошибся ID. Наказание снято, приношу свои извинения.[/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Arial]Благодарим вас за ваше обращение.[/size][/font][/CENTER]<br>' +
  '[CENTER][size=15px][font=Arial][size=15px][font=Arial]С уважением, Старшая Администрация [COLOR=rgb(255,200,0)]King Russia[/color].[/size][/font][/CENTER]',
        prefix: ACCEPT_PREFIX,
      status: false,
      },
    {
        title: 'Не верный раздел',
        content:
  '[CENTER][size=15px][font=Arial][CENTER]Приветствую, уважаемый игрок [COLOR=rgb(51, 255, 0)] {{ user.mention }}[/color].[/size][/font][/CENTER]<br>' +
  '[CENTER][size=15px][font=Arial]Вы ошиблись разделом. Переношу ваше заявления в нужный раздел.[/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Arial]Благодарим вас за ваше обращение.[/size][/font][/CENTER]<br>' +
  '[CENTER][size=15px][font=Arial][size=15px]С уважением, Старшая Администрация [COLOR=rgb(255,200,0)]King Russia[/color].[/size][/font][/CENTER]',
        prefix: WATCHED_PREFIX,
      status: false,
      },
         {
        title: '-------------------------------------------------Работа с жб на адм для ЗГА+--------------------------------'
      },
      {
        title: 'Взять жалобу на рассмотрение',
        content:
  '[CENTER][size=15px][font=Arial][CENTER]Приветствую, уважаемый игрок [COLOR=rgb(51,255,0)]{{ user.mention }}[/color].[/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Arial]Ваша жалоба получает Статус: [Color=rgb(255, 155 ,0)]На рассмотрении.[/color][/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Arial]Благодарим вас за ваше обращение.[/size][/font][/CENTER]<br>' +
  '[CENTER][size=15px][font=Arial][size=15px][font=Arial]С уважением,  Старшая Администрация [COLOR=rgb(255,200,0)]King Russia[/color].[/size][/font][/CENTER]',
        prefix: WATCHED_PREFIX,
      status: false,
      },
       {
        title: 'Одобрено на адм',
        content:
  '[CENTER][size=15px][font=Arial][CENTER]Приветствую, уважаемый игрок [COLOR=rgb(51,255,0)]{{ user.mention }}[/color].[/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Arial]Ознакомившись с доказательствами, администратор будет наказан. Ваша жалоба получает Статус: [Color=rgb(60, 250 ,0)]Одобрено.[/color][/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Arial]Благодарим вас за ваше обращение.[/size][/font][/CENTER]<br>' +
  '[CENTER][size=15px][font=Arial][size=15px][font=Arial]С уважением, Старшая Администрация [COLOR=rgb(255,200,0)]King Russia[/color].[/size][/font][/CENTER]',
        prefix: ACCEPT_PREFIX,
      status: false,
      },
      {
        title: 'Запрос докв у адм',
        content:
  '[CENTER][size=15px][font=Arial][CENTER]Приветствую, уважаемый игрок [COLOR=rgb(51,255,0)]{{ user.mention }}[/color].[/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Arial][Color=rgb(255,155,0)]Запросил доказательства у администратора[/color][/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Arial]Благодарим вас за ваше обращение.[/size][/font][/CENTER]<br>' +
  '[CENTER][size=15px][font=Arial][size=15px][font=Arial]С уважением, Старшая Администрация [COLOR=rgb(255,200,0)]King Russia[/color].[/size][/font][/CENTER]',
        prefix: WATCHED_PREFIX,
      status: false,
      },
      {
        title: 'Отказано на адм',
        content:
  '[CENTER][size=15px][font=Arial][CENTER]Приветствую, уважаемый игрок [COLOR=rgb(51,255,0)]{{ user.mention }}[/color].[/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Arial]Администратор предоставил доказательства. Ваша жалоба получает Статус: [Color=rgb(255,0,0)]Отказано.[/color][/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Arial]Благодарим вас за ваше обращение.[/size][/font][/CENTER]<br>' +
  '[CENTER][size=15px][font=Arial][size=15px][font=Arial]С уважением, Старшая Администрация [COLOR=rgb(255,200,0)]King Russia[/color].[/size][/font][/CENTER]',
        prefix: UNACCEPT_PREFIX,
      status: false,
      },
    {
        title: 'Нет тайм',
        content:
  '[CENTER][size=15px][font=Arial][CENTER]Приветствую, уважаемый игрок [COLOR=rgb(51,255,0)]{{ user.mention }}[/color].[/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Arial]Отсутствует /time. Ваша жалоба получает Статус: [Color=rgb(255,0,0)]Отказано.[/color][/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Arial]Благодарим вас за ваше обращение.[/size][/font][/CENTER]<br>' +
  '[CENTER][size=15px][font=Arial][size=15px][font=Arial]С уважением, Старшая Администрация [COLOR=rgb(255,200,0)]King Russia[/color].[/size][/font][/CENTER]',
        prefix: UNACCEPT_PREFIX,
      status: false,
      },
    {
        title: 'Непр ник',
        content:
  '[CENTER][size=15px][font=Arial][CENTER]Приветствую, уважаемый игрок [COLOR=rgb(51,255,0)]{{ user.mention }}[/color].[/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Arial]Никнейм в 2 пункте отличается от ника в док-вах. Ваша жалоба получает Статус: [Color=rgb(255,0,0)]Отказано.[/color][/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Arial]Благодарим вас за ваше обращение.[/size][/font][/CENTER]<br>' +
  '[CENTER][size=15px][font=Arial][size=15px][font=Arial]С уважением, Старшая Администрация [COLOR=rgb(255,200,0)]King Russia[/color].[/size][/font][/CENTER]',
        prefix: UNACCEPT_PREFIX,
      status: false,
      },
    {
        title: 'Срок подачи жб',
        content:
  '[CENTER][size=15px][font=Arial][CENTER]Приветствую, уважаемый игрок [COLOR=rgb(51,255,0)]{{ user.mention }}[/color].[/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Arial]Срок подачи жалобы истек. Ваша жалоба получает Статус: [Color=rgb(255,0,0)]Отказано.[/color][/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Arial]Благодарим вас за ваше обращение.[/size][/font][/CENTER]<br>' +
  '[CENTER][size=15px][font=Arial][size=15px][font=Arial]С уважением, Старшая Администрация [COLOR=rgb(255,200,0)]King Russia[/color].[/size][/font][/CENTER]',
        prefix: UNACCEPT_PREFIX,
      status: false,
      },
    {
      title: '-----------------------------------Работа с обж----------------------------------------------'
      },
    {
        title: 'Взять обж на рассмотрение',
        content:
  '[CENTER][size=15px][font=Arial][CENTER]Приветствую, уважаемый игрок [COLOR=rgb(51,255,0)]{{ user.mention }}[/color].[/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Arial]Ваша обжалование получает Статус: [Color=rgb(255, 155 ,0)]На рассмотрении.[/color][/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Arial]Благодарим вас за ваше обращение.[/size][/font][/CENTER]<br>' +
  '[CENTER][size=15px][font=Arial][size=15px][font=Arial]С уважением,  Старшая Администрация [COLOR=rgb(255,200,0)]King Russia[/color].[/size][/font][/CENTER]',
        prefix: WATCHED_PREFIX,
      status: false,
      },
    {
        title: 'Одобрено обж',
        content:
  '[CENTER][size=15px][font=Arial][CENTER]Приветствую, уважаемый игрок [COLOR=rgb(51,255,0)]{{ user.mention }}[/color].[/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Arial]Ваше обжалование получает Статус: [Color=rgb(60, 250 ,0)]Одобрено.[/color][/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Arial]Благодарим вас за ваше обращение.[/size][/font][/CENTER]<br>' +
  '[CENTER][size=15px][font=Arial][size=15px][font=Arial]С уважением, Старшая Администрация [COLOR=rgb(255,200,0)]King Russia[/color].[/size][/font][/CENTER]',
        prefix: ACCEPT_PREFIX,
      status: false,
      },
    {
        title: 'Запрос докв у адм',
        content:
  '[CENTER][size=15px][font=Arial][CENTER]Приветствую, уважаемый игрок [COLOR=rgb(51,255,0)]{{ user.mention }}[/color].[/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Arial][Color=rgb(255,155,0)]Запросил доказательства у Администратора[/color][/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Arial]Благодарим вас за ваше обращение.[/size][/font][/CENTER]<br>' +
  '[CENTER][size=15px][font=Arial][size=15px][font=Arial]С уважением, Старшая Администрация [COLOR=rgb(255,200,0)]King Russia[/color].[/size][/font][/CENTER]',
        prefix: WATCHED_PREFIX,
      status: false,
      },
    {
        title: 'Отказано обж',
        content:
  '[B][CENTER][size=15px][font=Arial][CENTER]Приветствую, уважаемый игрок [COLOR=rgb(51,255,0)]{{ user.mention }}[/color].[/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Arial]Администратор предоставил доказательства. Ваше обжалование получает Статус: [Color=rgb(255,0,0)]Отказано.[/color][/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Arial]Благодарим вас за ваше обращение.[/size][/font][/CENTER]<br>' +
  '[CENTER][size=15px][font=Arial][size=15px][font=Arial]С уважением, Старшая Администрация [COLOR=rgb(255,200,0)]King Russia[/color].[/size][/font][/CENTER][/B]',
        prefix: UNACCEPT_PREFIX,
      status: false,
      },
    {
        title: 'Нет док-в',
        content:
  '[CENTER][size=15px][font=Arial][CENTER]Приветствую, уважаемый игрок [COLOR=rgb(51, 255, 0)] {{ user.mention }}[/color].[/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Arial]Без доказательств/недостатка доказательств мы помочь не можем[/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Arial]Благодарим вас за ваше обращение.[/size][/font][/CENTER]<br>' +
  '[CENTER][size=15px][font=Arial][size=15px][font=Arial]С уважением, Старшая Администрация [COLOR=rgb(255,200,0)]King Russia[/color].[/size][/font][/CENTER]',
        prefix: UNACCEPT_PREFIX,
      status: false,
      },
         {
        title: 'Наказание смягчено',
        content:
  '[CENTER][size=15px][font=Arial][CENTER]Приветствую, уважаемый игрок [COLOR=rgb(51,255,0)]{{ user.mention }}[/color].[/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Arial]Ваша жалоба получает Статус: [Color=rgb(60,250,0)]Одобрено.[/color] Наказание было смягчено.[/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Arial]Благодарим вас за ваше обращение.[/size][/font][/CENTER]<br>' +
  '[CENTER][size=15px][font=Arial][size=15px][font=Arial]С уважением, Старшая Администрация [COLOR=rgb(255,200,0)]King Russia[/color].[/size][/font][/CENTER]',
        prefix: ACCEPT_PREFIX,
      status: false,
      },
    {
      title: '-----------------------------------Передано--------------------------------------------------------------------------'
      },
    {
        title: 'Тех Адм',
        content:
  '[CENTER][size=15px][font=Arial][CENTER]Приветствую, уважаемый игрок [COLOR=rgb(51, 255, 0)] {{ user.mention }}[/color].[/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Arial]Передано [Color=rgb(0,0,255)]Техническому Администратору[/color][/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Arial]Благодарим вас за ваше обращение.[/size][/font][/CENTER]<br>' +
  '[CENTER][size=15px][font=Arial][size=15px][font=Arial]С уважением, Старшая Администрация [COLOR=rgb(255,200,0)]King Russia[/color].[/size][/font][/CENTER]',
        prefix: TEX_PREFIX,
      status: false,
      },
    {
        title: 'Спец Адм',
        content:
  '[CENTER][size=15px][font=Arial][CENTER]Приветствую, уважаемый игрок [COLOR=rgb(51, 255, 0)] {{ user.mention }}[/color].[/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Arial]Передано [Color=rgb(255,0,0)]Специальному Администратору[/color][/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Arial]Благодарим вас за ваше обращение.[/size][/font][/CENTER]<br>' +
  '[CENTER][size=15px][font=Arial][size=15px][font=Arial]С уважением, Старшая Администрация [COLOR=rgb(255,200,0)]King Russia[/color].[/size][/font][/CENTER]',
        prefix: SPEC_PREFIX,
      status: false,
      },
    {
        title: 'Команда Проекта',
        content:
  '[CENTER][size=15px][font=Arial][CENTER]Приветствую, уважаемый игрок [COLOR=rgb(51, 255, 0)] {{ user.mention }}[/color].[/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Arial]Передано [Color=rgb(255,0,0)]Команде Проекта[/color][/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Arial]Благодарим вас за ваше обращение.[/size][/font][/CENTER]<br>' +
  '[CENTER][size=15px][font=Arial][size=15px][font=Arial]С уважением, Старшая Администрация [COLOR=rgb(255,200,0)]King Russia[/color].[/size][/font][/CENTER]',
        prefix: COMMAND_PREFIX,
      status: false,
      },
    {
        title: 'ГА',
        content:
  '[CENTER][size=15px][font=Arial][CENTER]Приветствую, уважаемый игрок [COLOR=rgb(51, 255, 0)] {{ user.mention }}[/color].[/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Arial]Передано [Color=rgb(255,0,0)]Главному Администратору[/color][/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Arial]Благодарим вас за ваше обращение.[/size][/font][/CENTER]<br>' +
  '[CENTER][size=15px][font=Arial][size=15px][font=Arial]С уважением, Старшая Администрация [COLOR=rgb(255,200,0)]King Russia[/color].[/size][/font][/CENTER]',
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
              _xfToken: XF.config.csrf,
              _xfRequestUri: document.URL.split(XF.config.url.fullBase)[1],
              _xfWithData: 1,
              _xfResponseType: 'json',
            }),
          }).then(() => location.reload());
      }




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