// ==UserScript==
// @name         Bless Russia | GREEN Chief script
// @namespace    https://forum.blessrussia.online
// @version      3.2.2
// @description  Скрипт для Руководства сервера | Bless Russia по всем вопросам на счет скрипта VK - https://vk.com/akroniksss
// @author       chief
// @match        https://forum.blessrussia.online/index.php*
// @include      https://forum.blessrussia.online/index.php
// @grant        none
// @license      MIT
// @icon https://freepngimg.com/thumb/eagle/20-eagle-black-siluet-png-image-download-thumb.png
// @downloadURL https://update.greasyfork.org/scripts/540518/Bless%20Russia%20%7C%20GREEN%20Chief%20script.user.js
// @updateURL https://update.greasyfork.org/scripts/540518/Bless%20Russia%20%7C%20GREEN%20Chief%20script.meta.js
// ==/UserScript==

(function () {
    'use strict';
    const UNACCEPT_PREFIX = 7; // Prefix that will be set when thread closes
    const ACCEPT_PREFIX = 6; // Prefix that will be set when thread accepted
    const RESHENO_PREFIX = 6; // Префикс "Решено"
    const PIN_PREFIX = 2; // Prefix that will be set when thread pins
    const GA_PREFIX = 11; // Префикс "Главному Администратору"
    const COMMAND_PREFIX = 9; // Префикс "Команде Проекта"
    const WATCHED_PREFIX = 8; // Префикс "Рассмотрено"
    const CLOSE_PREFIX = 5; // Префикс "Закрыто"
    const SPECIAL_PREFIX = 10; // Префикс "Специальному Администратору"
    const TEXY_PREFIX = 12; // Префикс "Специальному Администратору"
    const buttons = [

      {
		title: 'ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ                                ᅠ⠀             ⠀ ⠀⠀ᅠ ᅠᅠРаздел для жалоб   ᅠᅠ ᅠᅠ          ⠀        ⠀    ⠀      ⠀ᅠ     ᅠ ᅠ     ᅠ ᅠ ᅠ ',
        dpstyle: 'color: #000; background: #ff0000;  width: 96%;',
},
      {
        title: 'Взять на рассмотрение',
        content:
  '[CENTER][size=15px][font=Arial][CENTER]Приветствую, уважаемый игрок [COLOR=rgb(51, 255, 0)] {{ user.mention }}[/color].[/size][/font][/CENTER]' +
  '[CENTER][size=15px][font=Arial]Ваша жалоба получает Статус: [Color=rgb(255, 155 ,0)]На рассмотрении.[/color][/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Arial]Благодарим вас за ваше обращеUие.[/size][/font][/CENTER]<br>' +
  '[CENTER][size=15px][font=Arial][size=15px]С уважением, старшая администрация [COLOR=rgb(255,200,0)]Bless Russia[/color] сервер [Color=rgb(144, 238 ,144)]Green.[/size][/font][/CENTER]',
        prefix: PIN_PREFIX,
      status: true,
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
        title: 'Отказано',
        content:
  '[CENTER][size=15px][font=Arial][CENTER]Приветствую, уважаемый игрок [COLOR=rgb(51, 255, 0)] {{ user.mention }}[/color].[/size][/font][/CENTER]' +
  '[CENTER][size=15px][font=Arial]Ваша жалоба получает Статус: [Color=rgb(255,0,0)]Отказано.[/color][/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Arial]Благодарим вас за ваше обращение.[/size][/font][/CENTER]<br>' +
  '[CENTER][size=15px][font=Arial][size=15px]С уважением, старшая администрация [COLOR=rgb(255,200,0)]Bless Russia[/color] сервер [Color=rgb(144, 238 ,144)]Green.[/size][/font][/CENTER]',
        prefix: UNACCEPT_PREFIX,
      status: false,
      },
    {
        title: 'Взлом аккаунта',
        content:
  '[CENTER][size=15px][font=Arial][CENTER]Приветствую, уважаемый игрок [COLOR=rgb(51, 255, 0)] {{ user.mention }}[/color].[/size][/font][/CENTER]' +
  '[CENTER][size=15px][font=Arial]Ваше обжалование получает Статус: [Color=rgb(255,0,0)]Отказано.[/color] Взломанные аккаунты не подлежат восстановлению.[/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Arial]Благодарим вас за ваше обращение.[/size][/font][/CENTER]<br>' +
  '[CENTER][size=15px][font=Arial][size=15px]С уважением, старшая администрация [COLOR=rgb(255,200,0)]Bless Russia[/color] сервер [Color=rgb(144, 238 ,144)]Green.[/size][/font][/CENTER]',
        prefix: UNACCEPT_PREFIX,
      status: false,
      },
{
        title: 'Ошибка [ID]',
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
  '[CENTER][size=15px][font=Arial]Ознакомившись с доказательствами, администратор будет наказан.[/size][/font][/CENTER]<br>' +
  '[CENTER][size=15px][font=Arial]Ваша жалоба получает Статус: [Color=rgb(60, 250 ,0)]Одобрено.[/color][/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Arial]Благодарим вас за ваше обращение.[/size][/font][/CENTER]<br>' +
  '[CENTER][size=15px][font=Arial][size=15px]С уважением, старшая администрация [COLOR=rgb(255,200,0)]Bless Russia[/color] сервер [Color=rgb(144, 238 ,144)]Green.[/size][/font][/CENTER]',
        prefix: ACCEPT_PREFIX,
      status: false,
      },
      {
        title: 'Запрос док-ва у админа',
        content:
  '[CENTER][size=15px][font=Arial][CENTER]Приветствую, уважаемый игрок [COLOR=rgb(51, 255, 0)] {{ user.mention }}[/color].[/size][/font][/CENTER]' +
  '[CENTER][size=15px][font=Arial][Color=rgb(255,155,0)]Запросил доказательства у администратора[/color][/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Arial]Благодарим вас за ваше обращение.[/size][/font][/CENTER]<br>' +
  '[CENTER][size=15px][font=Arial][size=15px]С уважением, старшая администрация [COLOR=rgb(255,200,0)]Bless Russia[/color] сервер [Color=rgb(144, 238 ,144)]Green.[/size][/font][/CENTER]',
        prefix: WATCHED_PREFIX,
      status: true,
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
		title: 'ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ                                ᅠ⠀             ⠀ ⠀⠀ᅠ ᅠᅠРаздел с обжалованиями   ᅠᅠ ᅠᅠ          ⠀        ⠀    ⠀      ⠀ᅠ     ᅠ ᅠ     ᅠ ᅠ ᅠ ',
        dpstyle: 'color: #000; background: #32cd32;  width: 96%;',
},
    {
        title: 'Взять на рассмотрение',
        content:
  '[CENTER][size=15px][font=Arial][CENTER]Приветствую, уважаемый игрок [COLOR=rgb(51,255,0)]{{ user.mention }}[/color].[/size][/font][/CENTER]' +
  '[CENTER][size=15px][font=Arial]Ваша обжалование получает Статус: [Color=rgb(255, 155 ,0)]На рассмотрении.[/color][/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Arial]Благодарим вас за ваше обращение.[/size][/font][/CENTER]<br>' +
  '[CENTER][size=15px][font=Arial]С уважением, старшая администрация [COLOR=rgb(255,200,0)]Bless Russia[/color] сервер [Color=rgb(144, 238 ,144)]Green.[/size][/font][/CENTER]',
        prefix: PIN_PREFIX,
      status: true,
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
      status: true,
      },
    {
        title: 'Нет доказательств',
        content:
  '[CENTER][size=15px][font=Arial][CENTER]Приветствую, уважаемый игрок [COLOR=rgb(51, 255, 0)] {{ user.mention }}[/color].[/size][/font][/CENTER]' +
  '[CENTER][size=15px][font=Arial]К сожалению без доказательств / недостатка доказательств мы помочь Вам не сможем.[/size][/font][/CENTER]<br><br>' +
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
		title: 'ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ                                ᅠ⠀             ⠀ ⠀⠀ᅠ ᅠᅠПередача тем выше   ᅠᅠ ᅠᅠ          ⠀        ⠀    ⠀      ⠀ᅠ     ᅠ ᅠ     ᅠ ᅠ ᅠ ',
        dpstyle: 'color: #000; background: #ffff00;  width: 96%;',
},
    {
        title: 'Технический отдел',
        content:
  '[CENTER][size=15px][font=Arial][CENTER]Приветствую, уважаемый игрок [COLOR=rgb(51, 255, 0)] {{ user.mention }}[/color].[/size][/font][/CENTER]' +
  '[CENTER][size=15px][font=Arial]Ваше обращение передано в [Color=rgb(0,0,255)]Технический отдел[/color].[/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Arial]Благодарим вас за ваше обращение.[/size][/font][/CENTER]<br>' +
  '[CENTER][size=15px][font=Arial]С уважением, старшая администрация [COLOR=rgb(255,200,0)]Bless Russia[/color] сервер [Color=rgb(144, 238 ,144)]Green.[/size][/font][/CENTER]',
        prefix: TEXY_PREFIX,
      status: false,
      },
    {
        title: 'Спец. администрация',
        content:
  '[CENTER][size=15px][font=Arial][CENTER]Приветствую, уважаемый игрок [COLOR=rgb(51, 255, 0)] {{ user.mention }}[/color].[/size][/font][/CENTER]' +
  '[CENTER][size=15px][font=Arial]Ваше обращение передано [Color=rgb(255,0,0)]Специальной администраторации[/color].[/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Arial]Благодарим вас за ваше обращение.[/size][/font][/CENTER]<br>' +
  '[CENTER][size=15px][font=Arial]С уважением, старшая администрация [COLOR=rgb(255,200,0)]Bless Russia[/color] сервер [Color=rgb(144, 238 ,144)]Green.[/size][/font][/CENTER]',
        prefix: SPECIAL_PREFIX,
      status: false,
      },
    {
        title: 'Команда проекта',
        content:
  '[CENTER][size=15px][font=Arial][CENTER]Приветствую, уважаемый игрок [COLOR=rgb(51, 255, 0)] {{ user.mention }}[/color].[/size][/font][/CENTER]' +
  '[CENTER][size=15px][font=Arial]Ваше обращение передано [Color=rgb(255,0,0)]Команде проекта[/color].[/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Arial]Благодарим вас за ваше обращение.[/size][/font][/CENTER]<br>' +
  '[CENTER][size=15px][font=Arial]С уважением, старшая администрация [COLOR=rgb(255,200,0)]Bless Russia[/color] сервер [Color=rgb(144, 238 ,144)]Green.[/size][/font][/CENTER]',
        prefix: COMMAND_PREFIX,
      status: false,
      },
    {
        title: 'Главный админ.',
        content:
  '[CENTER][size=15px][font=Arial][CENTER]Приветствую, уважаемый игрок [COLOR=rgb(51, 255, 0)] {{ user.mention }}[/color].[/size][/font][/CENTER]' +
  '[CENTER][size=15px][font=Arial]Ваше обращение передано [Color=rgb(255,0,0)]Главному администратору[/color] сервера.[/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Arial]Благодарим вас за ваше обращение.[/size][/font][/CENTER]<br>' +
  '[CENTER][size=15px][font=Arial]С уважением, старшая администрация [COLOR=rgb(255,200,0)]Bless Russia[/color] сервер [Color=rgb(144, 238 ,144)]Green.[/size][/font][/CENTER]',
        prefix: GA_PREFIX,
      status: false,
      },
   {
		title: 'ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ                                ᅠ⠀             ⠀ ⠀⠀ᅠ ᅠᅠРаздел с амнистиями   ᅠᅠ ᅠᅠ          ⠀        ⠀    ⠀      ⠀ᅠ     ᅠ ᅠ     ᅠ ᅠ ᅠ ',
        dpstyle: 'color: #000; background: #00ffff;  width: 96%;',
},
    {
        title: 'Одобрено',
        content:
  '[CENTER][size=15px][font=Arial][CENTER]Приветствую, уважаемый игрок [COLOR=rgb(51,255,0)]{{ user.mention }}[/color].[/size][/font][/CENTER]' +
  '[CENTER][size=15px][font=Arial]Ваше заявление на Амнистию получает Статус: [Color=rgb(60, 250 ,0)]Одобрено.[/color][/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Arial]Благодарим вас за ваше обращение.[/size][/font][/CENTER]<br>' +
  '[CENTER][size=15px][font=Arial]С уважением, старшая администрация [COLOR=rgb(255,200,0)]Bless Russia[/color] сервер [Color=rgb(144, 238 ,144)]Green.[/size][/font][/CENTER]',
        prefix: ACCEPT_PREFIX,
      status: false,
      },
    {
        title: 'Отказано',
        content:
  '[CENTER][size=15px][font=Arial][CENTER]Приветствую, уважаемый игрок [COLOR=rgb(51,255,0)]{{ user.mention }}[/color].[/size][/font][/CENTER]' +
  '[CENTER][size=15px][font=Arial]Ваше заявление на Амнистию получает Статус: [Color=rgb(255,0,0)]Отказано.[/color][/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Arial]Благодарим вас за ваше обращение.[/size][/font][/CENTER]<br>' +
  '[CENTER][size=15px][font=Arial]С уважением, старшая администрация [COLOR=rgb(255,200,0)]Bless Russia[/color] сервер [Color=rgb(144, 238 ,144)]Green.[/size][/font][/CENTER]',
        prefix: UNACCEPT_PREFIX,
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
        addButton('КП', 'teamProject');
        addButton ('Спецу', 'specialAdmin');
        addButton ('ГА', 'mainAdmin');
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
      `<button type="button" class="button rippleButton" id="${id}" style="border-radius: 7px; margin-right: 5px; color: #000; background: #85ff0a; border: 1px solid;">${name}</button>`,
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