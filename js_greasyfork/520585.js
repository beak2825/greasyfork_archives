// ==UserScript==
// @name         Кураторы форума РУСЬ МОБАЙЛ
// @namespace    https://forum.russia-game.ru/*
// @version      1.7
// @description  Работа с форумом
// @author       Maestro Neverthelles
// @match        https://forum.russia-game.ru/*
// @include      https://forum.russia-game.ru/
// @grant        none
// @license 	 MIT
// @icon https://icons.iconarchive.com/icons/thesquid.ink/free-flat-sample/128/support-icon.png
// @downloadURL https://update.greasyfork.org/scripts/520585/%D0%9A%D1%83%D1%80%D0%B0%D1%82%D0%BE%D1%80%D1%8B%20%D1%84%D0%BE%D1%80%D1%83%D0%BC%D0%B0%20%D0%A0%D0%A3%D0%A1%D0%AC%20%D0%9C%D0%9E%D0%91%D0%90%D0%99%D0%9B.user.js
// @updateURL https://update.greasyfork.org/scripts/520585/%D0%9A%D1%83%D1%80%D0%B0%D1%82%D0%BE%D1%80%D1%8B%20%D1%84%D0%BE%D1%80%D1%83%D0%BC%D0%B0%20%D0%A0%D0%A3%D0%A1%D0%AC%20%D0%9C%D0%9E%D0%91%D0%90%D0%99%D0%9B.meta.js
// ==/UserScript==
 
(function () {
    'use strict';
  const PIN_PREFIX = 2; // На рассмотрении
  const RESHENO_PREFIX = 3; // Решено
  const UNACCEPT_PREFIX = 4; // Отказано
  const ACCEPT_PREFIX = 5; // Одобрено
  const COMMAND_PREFIX = 6; // Prefix that will be set when thread solved
  const GA_PREFIX = 7; //Главному администратору
  const WATCHED_PREFIX = 9;
  const buttons = [
      {
        title: '-----------------------------------------------------Раздел игроков-----------------------------------------------------'
      },
      {
        title: 'Взять жалобу на рассмотрение',
        content:
  '[CENTER][size=15px][font=Trebuchet MS][CENTER]Приветствую, уважаемый игрок [COLOR=rgb(255,200,0)] {{ user.mention }}[/color].[/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Trebuchet MS]Благодарим вас за ваше обращение. Ваша жалоба получает Статус: [Color=rgb(255, 155 ,0)]На рассмотрении.[/color][/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Trebuchet MS][size=15px][font=Trebuchet MS] Ожидайте ответа в данной теме[/color].[/size][/font][/CENTER]',
        prefix: PIN_PREFIX,
      status: false,
      },
      {

        title: 'Недостаточно док-в',
        content:
  '[CENTER][size=15px][font=Trebuchet MS][CENTER]Доброго времени суток, уважаемый [COLOR=rgb(255,200,0)] {{ user.mention }}[/color].[/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Trebuchet MS]Недостаточно докозательств[/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Trebuchet MS][size=15px][font=Trebuchet MS]Отказано, Закрыто[/color].[/size][/font][/CENTER]',
      prefix: UNACCEPT_PREFIX,
      status: false,
      },
      {
        title: 'Нет нарушений',
        content:
  '[CENTER][size=15px][font=Trebuchet MS][CENTER]Доброго времени суток, уважаемый [COLOR=rgb(255,200,0)] {{ user.mention }}[/color].[/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Trebuchet MS]Со стороны игрока нарушений не найдено[/size][/font][/CENTER]<br><br>' +
  
  '[CENTER][size=15px][font=Trebuchet MS][size=15px][font=Trebuchet MS]Отказано, Закрыто[/color].[/size][/font][/CENTER]',
      prefix: UNACCEPT_PREFIX,
      status: false,
      },
      {
        title: 'Дубликат жалобы',
        content:
  '[CENTER][size=15px][font=Trebuchet MS][CENTER]Доброго времени суток, уважаемый игрок [COLOR=rgb(255,200,0)] {{ user.mention }}[/color].[/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Trebuchet MS]Данная жалоба является дубликатом.[/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Trebuchet MS]При создании большого количества дубликата жалоб ваш форумнный аккаунт может быть заблокирован.[/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Trebuchet MS][size=15px][font=Trebuchet MS]Закрыто[/color].[/size][/font][/CENTER]',
      prefix: UNACCEPT_PREFIX,
      status: false,
      },
      {
        title: 'Продажа ИВ',
        content:
  '[CENTER][size=15px][font=Trebuchet MS][CENTER]Доброго времени суток, уважаемый [COLOR=rgb(255,200,0)] {{ user.mention }}[/color].[/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Trebuchet MS]Игрок понесет наказание, согласно пункту правил: [color=rgb(255, 0, 0)]3.04[/color][/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Trebuchet MS][Spoiler]Запрещена попытка покупки/продажи, а также покупка/продажа игрового имущества/аккаунта(-ов) за реальную валюту. | [color=rgb(255,0,0) Бан на 15-30 дней.[/Spoiler][/color][/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Trebuchet MS][size=15px][font=Trebuchet MS][color=rgb()Одобрено, [COLOR=rgb(255,0,0)]Закрыто.[/color].[/size][/font][/CENTER]',
      prefix: ACCEPT_PREFIX,
      status: false,
      },
      {
        title: 'Продажа аккаунта',
        content:
  '[CENTER][size=15px][font=Trebuchet MS][CENTER]Приветствую, уважаемый [COLOR=rgb(255,200,0)] {{ user.mention }}[/color].[/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Trebuchet MS]Благодарим вас за вашу жалобу. Мы тщательно рассмотрели вашу жалобу и приняли следующие решение:[/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Trebuchet MS]Игрок понесет наказание, согласно пункту правил: [color=rgb(255,200,0)]3.04 [/color]Запрещена передача своего игрового аккаунта 3-им лицам. |  [color=rgb(255,0,0)]Бан на 30 дней / Бан навсегда + Обнуление переданного имущества.[/color][/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Trebuchet MS]Ваша активная позиция и участие в создании безопасного и приятного игрового опыта очень важны для нас. Спасибо за ваше участие. [/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Trebuchet MS][size=15px][font=Trebuchet MS]С уважением, Администрация [COLOR=rgb(255,200,0)]РУСЬ Mobile[/color].[/size][/font][/CENTER]',
      prefix: ACCEPT_PREFIX,
      status: false,
      },
      {
        title: 'Обман 3.08',
        content:
  '[CENTER][size=15px][font=Trebuchet MS][CENTER]Приветствую, уважаемый [COLOR=rgb(255,200,0)] {{ user.mention }}[/color].[/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Trebuchet MS]Благодарим вас за вашу жалобу. Мы тщательно рассмотрели вашу жалобу и приняли следующие решение:[/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Trebuchet MS]Игрок понесет наказание, согласно пункту правил: [color=rgb(255,200,0)]3.08 [/color]Запрещены любые попытки обмана и его реализации. |  [color=rgb(255,0,0)]Бан до 30 дней / Бан навсегда.[/color][/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Trebuchet MS]Ваша активная позиция и участие в создании безопасного и приятного игрового опыта очень важны для нас. Спасибо за ваше участие. [/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Trebuchet MS][size=15px][font=Trebuchet MS]С уважением, Администрация [COLOR=rgb(255,200,0)]РУСЬ Mobile[/color].[/size][/font][/CENTER]',
      prefix: ACCEPT_PREFIX,
      status: false,
      },
      {
        title: 'Bagouse',
        content:
  '[CENTER][size=15px][font=Trebuchet MS][CENTER]Приветствую, уважаемый [COLOR=rgb(255,200,0)] {{ user.mention }}[/color].[/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Trebuchet MS]Благодарим вас за вашу жалобу. Мы тщательно рассмотрели вашу жалобу и приняли следующие решение:[/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Trebuchet MS]Игрок понесет наказание, согласно пункту правил: [color=rgb(255,200,0)]3.11 [/color]Запрещен багоюз в любой форме. |  [color=rgb(255,0,0)]Бан на 15-30 дней / Бан навсегда.[/color][/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Trebuchet MS]Ваша активная позиция и участие в создании безопасного и приятного игрового опыта очень важны для нас. Спасибо за ваше участие. [/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Trebuchet MS][size=15px][font=Trebuchet MS]С уважением, Администрация [COLOR=rgb(255,200,0)]РУСЬ Mobile[/color].[/size][/font][/CENTER]',
      prefix: ACCEPT_PREFIX,
      status: false,    
      },
      {
        title: 'Сторонее ПО',
        content:
  '[CENTER][size=15px][font=Trebuchet MS][CENTER]Приветствую, уважаемый [COLOR=rgb(255,200,0)] {{ user.mention }}[/color].[/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Trebuchet MS]Благодарим вас за вашу жалобу. Мы тщательно рассмотрели вашу жалобу и приняли следующие решение:[/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Trebuchet MS]Игрок понесет наказание, согласно пункту правил: [color=rgb(255,200,0)]3.12 [/color]Запрещено владение, использование или распространение сторонних программ или других средств, которые дают какое-либо преимущество перед другими игроками. |  [color=rgb(255,0,0)]Бан на 30 дней / Бан навсегда.[/color][/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Trebuchet MS]Ваша активная позиция и участие в создании безопасного и приятного игрового опыта очень важны для нас. Спасибо за ваше участие. [/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Trebuchet MS][size=15px][font=Trebuchet MS]С уважением, Администрация [COLOR=rgb(255,200,0)]РУСЬ Mobile[/color].[/size][/font][/CENTER]',
      prefix: ACCEPT_PREFIX,
      status: false,    
      },  
      {
        title: 'NRP',
        content:
  '[CENTER][size=15px][font=Trebuchet MS][CENTER]Приветствую, уважаемый [COLOR=rgb(255,200,0)] {{ user.mention }}[/color].[/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Trebuchet MS]Благодарим вас за вашу жалобу. Мы тщательно рассмотрели вашу жалобу и приняли следующие решение:[/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Trebuchet MS]Игрок понесет наказание, согласно пункту правил: [color=rgb(255,200,0)]4.01[/color]Запрещено действия, нарушающие стандарты ролевой игры. |  [color=rgb(255,0,0)]Деморган на 30 минут.[/color][/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Trebuchet MS]Ваша активная позиция и участие в создании безопасного и приятного игрового опыта очень важны для нас. Спасибо за ваше участие. [/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Trebuchet MS][size=15px][font=Trebuchet MS]С уважением, Администрация [COLOR=rgb(255,200,0)]РУСЬ Mobile[/color].[/size][/font][/CENTER]',
      },  
      {
        title: 'Уход от РП',
        content:
  '[CENTER][size=15px][font=Trebuchet MS][CENTER]Приветствую, уважаемый [COLOR=rgb(255,200,0)] {{ user.mention }}[/color].[/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Trebuchet MS]Благодарим вас за вашу жалобу. Мы тщательно рассмотрели вашу жалобу и приняли следующие решение:[/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Trebuchet MS]Игрок понесет наказание, согласно пункту правил: [color=rgb(255,200,0)]4.02 [/color]Запрещено целенаправленное избегание участия в РП процессе путем различных методов. |  [color=rgb(255,0,0)]Деморган на 30 минут.[/color][/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Trebuchet MS]Ваша активная позиция и участие в создании безопасного и приятного игрового опыта очень важны для нас. Спасибо за ваше участие. [/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Trebuchet MS][size=15px][font=Trebuchet MS]С уважением, Администрация [COLOR=rgb(255,200,0)]РУСЬ Mobile[/color].[/size][/font][/CENTER]',
      prefix: ACCEPT_PREFIX,
      status: false,    
      }, 
      {
        title: 'РП в свою сторону',
        content:
  '[CENTER][size=15px][font=Trebuchet MS][CENTER]Приветствую, уважаемый [COLOR=rgb(255,200,0)] {{ user.mention }}[/color].[/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Trebuchet MS]Благодарим вас за вашу жалобу. Мы тщательно рассмотрели вашу жалобу и приняли следующие решение:[/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Trebuchet MS]Игрок понесет наказание, согласно пункту правил: [color=rgb(255,200,0)]4.03 [/color]Запрещены все РП ситуации, направленные на выгоду или преимущество в свою пользу. |  [color=rgb(255,0,0)]Деморган на 30 минут.[/color][/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Trebuchet MS]Ваша активная позиция и участие в создании безопасного и приятного игрового опыта очень важны для нас. Спасибо за ваше участие. [/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Trebuchet MS][size=15px][font=Trebuchet MS]С уважением, Администрация [COLOR=rgb(255,200,0)]РУСЬ Mobile[/color].[/size][/font][/CENTER]',
      prefix: ACCEPT_PREFIX,
      status: false,    
      }, 
      {
        title: 'NonRP Drive',
        content:
  '[CENTER][size=15px][font=Trebuchet MS][CENTER]Приветствую, уважаемый [COLOR=rgb(255,200,0)] {{ user.mention }}[/color].[/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Trebuchet MS]Благодарим вас за вашу жалобу. Мы тщательно рассмотрели вашу жалобу и приняли следующие решение:[/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Trebuchet MS]Игрок понесет наказание, согласно пункту правил: [color=rgb(255,200,0)]4.05 [/color]Запрещено управление транспортным средством в условиях, не отражающих реальность, или с использованием необычной манеры вождения. (NonRP Вождение) |  [color=rgb(255,0,0)]Деморган на 30 минут.[/color][/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Trebuchet MS]Ваша активная позиция и участие в создании безопасного и приятного игрового опыта очень важны для нас. Спасибо за ваше участие. [/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Trebuchet MS][size=15px][font=Trebuchet MS]С уважением, Администрация [COLOR=rgb(255,200,0)]РУСЬ Mobile[/color].[/size][/font][/CENTER]',
      prefix: ACCEPT_PREFIX,
      status: false,
      },
      {
        title: 'DB',
        content:
  '[CENTER][size=15px][font=Trebuchet MS][CENTER]Приветствую, уважаемый [COLOR=rgb(255,200,0)] {{ user.mention }}[/color].[/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Trebuchet MS]Благодарим вас за вашу жалобу. Мы тщательно рассмотрели вашу жалобу и приняли следующие решение:[/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Trebuchet MS]Игрок понесет наказание, согласно пункту правил: [color=rgb(255,200,0)]4.07 [/color]Запрещено убийство или нанесение урона любым видом транспорта без убедительной ролевой причины (DB) |  [color=rgb(255,0,0)]Деморган 30 минут.[/color][/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Trebuchet MS]Ваша активная позиция и участие в создании безопасного и приятного игрового опыта очень важны для нас. Спасибо за ваше участие. [/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Trebuchet MS][size=15px][font=Trebuchet MS]С уважением, Администрация [COLOR=rgb(255,200,0)]РУСЬ Mobile[/color].[/size][/font][/CENTER]',
      prefix: ACCEPT_PREFIX,
      status: false,
      },
      {
        title: 'RK',
        content:
  '[CENTER][size=15px][font=Trebuchet MS][CENTER]Приветствую, уважаемый [COLOR=rgb(255,200,0)] {{ user.mention }}[/color].[/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Trebuchet MS]Благодарим вас за вашу жалобу. Мы тщательно рассмотрели вашу жалобу и приняли следующие решение:[/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Trebuchet MS]Игрок понесет наказание, согласно пункту правил: [color=rgb(255,200,0)]4.08 [/color]Запрещено убийство игрока с целью мести, возвращение на место смерти в течение 15 минут и использование информации, которая привела к смерти, в дальнейшем. (RK) |  [color=rgb(255,0,0)]Деморган 30 минут.[/color][/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Trebuchet MS]Ваша активная позиция и участие в создании безопасного и приятного игрового опыта очень важны для нас. Спасибо за ваше участие. [/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Trebuchet MS][size=15px][font=Trebuchet MS]С уважением, Администрация [COLOR=rgb(255,200,0)]РУСЬ Mobile[/color].[/size][/font][/CENTER]',
      prefix: ACCEPT_PREFIX,
      status: false,
      },
      {
        title: 'TK',
        content:
  '[CENTER][size=15px][font=Trebuchet MS][CENTER]Приветствую, уважаемый [COLOR=rgb(255,200,0)] {{ user.mention }}[/color].[/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Trebuchet MS]Благодарим вас за вашу жалобу. Мы тщательно рассмотрели вашу жалобу и приняли следующие решение:[/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Trebuchet MS]Игрок понесет наказание, согласно пункту правил: [color=rgb(255,200,0)]4.09 [/color]Запрещено убийство члена вашей организации без наличия убедительной ролевой причины (TK) |  [color=rgb(255,0,0)]Деморган 30 минут .[/color][/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Trebuchet MS]Ваша активная позиция и участие в создании безопасного и приятного игрового опыта очень важны для нас. Спасибо за ваше участие. [/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Trebuchet MS][size=15px][font=Trebuchet MS]С уважением, Администрация [COLOR=rgb(255,200,0)]РУСЬ Mobile[/color].[/size][/font][/CENTER]',
      prefix: ACCEPT_PREFIX,
      status: false,
      },
      {
        title: 'SK',
        content:
  '[CENTER][size=15px][font=Trebuchet MS][CENTER]Приветствую, уважаемый [COLOR=rgb(255,200,0)] {{ user.mention }}[/color].[/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Trebuchet MS]Благодарим вас за вашу жалобу. Мы тщательно рассмотрели вашу жалобу и приняли следующие решение:[/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Trebuchet MS]Игрок понесет наказание, согласно пункту правил: [color=rgb(255,200,0)]4.10 [/color]Запрещено убийство или нанесение урона на территории фракции или организации, а также на месте появления игрока или выхода из закрытых интерьеров и их окрестностей. (SK) |  [color=rgb(255,0,0)]Деморган на 30 минут .[/color][/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Trebuchet MS]Ваша активная позиция и участие в создании безопасного и приятного игрового опыта очень важны для нас. Спасибо за ваше участие. [/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Trebuchet MS][size=15px][font=Trebuchet MS]С уважением, Администрация [COLOR=rgb(255,200,0)]РУСЬ Mobile[/color].[/size][/font][/CENTER]',
      prefix: ACCEPT_PREFIX,
      status: false,
      },
      {
        title: 'PG',
        content:
  '[CENTER][size=15px][font=Trebuchet MS][CENTER]Приветствую, уважаемый [COLOR=rgb(255,200,0)] {{ user.mention }}[/color].[/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Trebuchet MS]Благодарим вас за вашу жалобу. Мы тщательно рассмотрели вашу жалобу и приняли следующие решение:[/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Trebuchet MS]Игрок понесет наказание, согласно пункту правил: [color=rgb(255,200,0)]4.11 [/color]Запрещено присваивание персонажу свойств, которые не соответствуют реальности, а также игра без учета страха за свою жизнь (PG) |  [color=rgb(255,0,0)]Деморган на 30 минут.[/color][/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Trebuchet MS]Ваша активная позиция и участие в создании безопасного и приятного игрового опыта очень важны для нас. Спасибо за ваше участие. [/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Trebuchet MS][size=15px][font=Trebuchet MS]С уважением, Администрация [COLOR=rgb(255,200,0)]РУСЬ Mobile[/color].[/size][/font][/CENTER]',
      prefix: ACCEPT_PREFIX,
      status: false,
      },
      {
        title: 'DM',
        content:
  '[CENTER][size=15px][font=Trebuchet MS][CENTER]Приветствую, уважаемый [COLOR=rgb(255,200,0)] {{ user.mention }}[/color].[/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Trebuchet MS]Благодарим вас за вашу жалобу. Мы тщательно рассмотрели вашу жалобу и приняли следующие решение:[/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Trebuchet MS]Игрок понесет наказание, согласно пункту правил: [color=rgb(255,200,0)]4.12 [/color]Запрещено убийство или нанесение урона без убедительной внутриигровой причины (DM) |  [color=rgb(255,0,0)]Деморган 30 минут.[/color][/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Trebuchet MS]Ваша активная позиция и участие в создании безопасного и приятного игрового опыта очень важны для нас. Спасибо за ваше участие. [/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Trebuchet MS][size=15px][font=Trebuchet MS]С уважением, Администрация [COLOR=rgb(255,200,0)]РУСЬ Mobile[/color].[/size][/font][/CENTER]',
      prefix: ACCEPT_PREFIX,
      status: false,
      },
      {
        title: 'Mass DM',
        content:
  '[CENTER][size=15px][font=Trebuchet MS][CENTER]Приветствую, уважаемый [COLOR=rgb(255,200,0)] {{ user.mention }}[/color].[/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Trebuchet MS]Благодарим вас за вашу жалобу. Мы тщательно рассмотрели вашу жалобу и приняли следующие решение:[/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Trebuchet MS]Игрок понесет наказание, согласно пункту правил: [color=rgb(255,200,0)]4.12.1 [/color]Запрещено убийство или нанесение урона трём или более игрокам без убедительной внутриигровой причины. |  [color=rgb(255,0,0)]Warn.[/color][/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Trebuchet MS]Ваша активная позиция и участие в создании безопасного и приятного игрового опыта очень важны для нас. Спасибо за ваше участие. [/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Trebuchet MS][size=15px][font=Trebuchet MS]С уважением, Администрация [COLOR=rgb(255,200,0)]РУСЬ Mobile[/color].[/size][/font][/CENTER]',
      prefix: ACCEPT_PREFIX,
      status: false,
      },
      {
        title: 'AFK no ESC',
        content:
  '[CENTER][size=15px][font=Trebuchet MS][CENTER]Приветствую, уважаемый [COLOR=rgb(255,200,0)] {{ user.mention }}[/color].[/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Trebuchet MS]Благодарим вас за вашу жалобу. Мы тщательно рассмотрели вашу жалобу и приняли следующие решение:[/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Trebuchet MS]Игрок понесет наказание, согласно пункту правил: [color=rgb(255,200,0)]4.13 [/color]Запрещено находиться в AFK без активации режима ESC или создание помехи для других игроков.  |  [color=rgb(255,0,0)]Kick.[/color][/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Trebuchet MS]Ваша активная позиция и участие в создании безопасного и приятного игрового опыта очень важны для нас. Спасибо за ваше участие. [/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Trebuchet MS][size=15px][font=Trebuchet MS]С уважением, Администрация [COLOR=rgb(255,200,0)]РУСЬ Mobile[/color].[/size][/font][/CENTER]',
      prefix: ACCEPT_PREFIX,
      status: false,
      },
      {
        title: 'AFK no ESC',
        content:
  '[CENTER][size=15px][font=Trebuchet MS][CENTER]Приветствую, уважаемый [COLOR=rgb(255,200,0)] {{ user.mention }}[/color].[/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Trebuchet MS]Благодарим вас за вашу жалобу. Мы тщательно рассмотрели вашу жалобу и приняли следующие решение:[/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Trebuchet MS]Игрок понесет наказание, согласно пункту правил: [color=rgb(255,200,0)]4.13 [/color]Запрещено находиться в AFK без активации режима ESC или создание помехи для других игроков.  |  [color=rgb(255,0,0)]Kick.[/color][/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Trebuchet MS]Ваша активная позиция и участие в создании безопасного и приятного игрового опыта очень важны для нас. Спасибо за ваше участие. [/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Trebuchet MS][size=15px][font=Trebuchet MS]С уважением, Администрация [COLOR=rgb(255,200,0)]РУСЬ Mobile[/color].[/size][/font][/CENTER]',
      prefix: ACCEPT_PREFIX,
      status: false,
      },
      {
        title: 'Аморал',
        content:
  '[CENTER][size=15px][font=Trebuchet MS][CENTER]Приветствую, уважаемый [COLOR=rgb(255,200,0)] {{ user.mention }}[/color].[/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Trebuchet MS]Благодарим вас за вашу жалобу. Мы тщательно рассмотрели вашу жалобу и приняли следующие решение:[/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Trebuchet MS]Игрок понесет наказание, согласно пункту правил: [color=rgb(255,200,0)]4.14 [/color] Запрещены любые формы аморального сексуального поведения в отношении других игроков. |  [color=rgb(255,0,0)]Деморган 60 минут.[/color][/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Trebuchet MS]Ваша активная позиция и участие в создании безопасного и приятного игрового опыта очень важны для нас. Спасибо за ваше участие. [/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Trebuchet MS][size=15px][font=Trebuchet MS]С уважением, Администрация [COLOR=rgb(255,200,0)]РУСЬ Mobile[/color].[/size][/font][/CENTER]',
      prefix: ACCEPT_PREFIX,
      status: false,
      },
      {
        title: 'OOC/IC Обман',
        content:
  '[CENTER][size=15px][font=Trebuchet MS][CENTER]Приветствую, уважаемый [COLOR=rgb(255,200,0)] {{ user.mention }}[/color].[/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Trebuchet MS]Благодарим вас за вашу жалобу. Мы тщательно рассмотрели вашу жалобу и приняли следующие решение:[/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Trebuchet MS]Игрок понесет наказание, согласно пункту правил: [color=rgb(255,200,0)]4.15 [/color] Запрещены любые попытки OOC обмана, а также IC обманы, нарушающие правила и логику ролевой игры. |  [color=rgb(255,0,0)]Бан до 30 дней / Бан навсегда.[/color][/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Trebuchet MS]Ваша активная позиция и участие в создании безопасного и приятного игрового опыта очень важны для нас. Спасибо за ваше участие. [/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Trebuchet MS][size=15px][font=Trebuchet MS]С уважением, Администрация [COLOR=rgb(255,200,0)]РУСЬ Mobile[/color].[/size][/font][/CENTER]',
      prefix: ACCEPT_PREFIX,
      status: false,
      },
      {
        title: 'Обман /do',
        content:
  '[CENTER][size=15px][font=Trebuchet MS][CENTER]Приветствую, уважаемый [COLOR=rgb(255,200,0)] {{ user.mention }}[/color].[/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Trebuchet MS]Благодарим вас за вашу жалобу. Мы тщательно рассмотрели вашу жалобу и приняли следующие решение:[/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Trebuchet MS]Игрок понесет наказание, согласно пункту правил: [color=rgb(255,200,0)]4.16 [/color] Запрещено использовать обман в команде /do, даже если это может негативно сказаться на вашем игровом персонаже. |  [color=rgb(255,0,0)]Блокировка чата на 60 минут.[/color][/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Trebuchet MS]Ваша активная позиция и участие в создании безопасного и приятного игрового опыта очень важны для нас. Спасибо за ваше участие. [/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Trebuchet MS][size=15px][font=Trebuchet MS]С уважением, Администрация [COLOR=rgb(255,200,0)]РУСЬ Mobile[/color].[/size][/font][/CENTER]',
      prefix: ACCEPT_PREFIX,
      status: false,
      },
      {
        title: 'Обман администрации',
        content:
  '[CENTER][size=15px][font=Trebuchet MS][CENTER]Приветствую, уважаемый [COLOR=rgb(255,200,0)] {{ user.mention }}[/color].[/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Trebuchet MS]Благодарим вас за вашу жалобу. Мы тщательно рассмотрели вашу жалобу и приняли следующие решение:[/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Trebuchet MS]Игрок понесет наказание, согласно пункту правил: [color=rgb(255,200,0)]4.22 [/color] Запрещено вводить администрацию проекта в заблуждение или обманывать её на всех ресурсах проекта. |  [color=rgb(255,0,0)]Бан на 10-15 дней.[/color][/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Trebuchet MS]Ваша активная позиция и участие в создании безопасного и приятного игрового опыта очень важны для нас. Спасибо за ваше участие. [/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Trebuchet MS][size=15px][font=Trebuchet MS]С уважением, Администрация [COLOR=rgb(255,200,0)]РУСЬ Mobile[/color].[/size][/font][/CENTER]',
      prefix: ACCEPT_PREFIX,
      status: false,
      },
      {
        title: 'Деанон',
        content:
  '[CENTER][size=15px][font=Trebuchet MS][CENTER]Приветствую, уважаемый [COLOR=rgb(255,200,0)] {{ user.mention }}[/color].[/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Trebuchet MS]Благодарим вас за вашу жалобу. Мы тщательно рассмотрели вашу жалобу и приняли следующие решение:[/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Trebuchet MS]Игрок понесет наказание, согласно пункту правил: [color=rgb(255,200,0)]4.26 [/color] Запрещено разглашать личную информацию игроков и их близких лиц. |  [color=rgb(255,0,0)] Бан на 15-30 дней.[/color][/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Trebuchet MS]Ваша активная позиция и участие в создании безопасного и приятного игрового опыта очень важны для нас. Спасибо за ваше участие. [/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Trebuchet MS][size=15px][font=Trebuchet MS]С уважением, Администрация [COLOR=rgb(255,200,0)]РУСЬ Mobile[/color].[/size][/font][/CENTER]',
      prefix: ACCEPT_PREFIX,
      status: false,
      },
      {
        title: 'MG',
        content:
  '[CENTER][size=15px][font=Trebuchet MS][CENTER]Приветствую, уважаемый [COLOR=rgb(255,200,0)] {{ user.mention }}[/color].[/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Trebuchet MS]Благодарим вас за вашу жалобу. Мы тщательно рассмотрели вашу жалобу и приняли следующие решение:[/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Trebuchet MS]Игрок понесет наказание, согласно пункту правил: [color=rgb(255,200,0)]5.02 [/color] Запрещено использовать OOC информацию в IC чате. (Meta Gaming) |  [color=rgb(255,0,0)] Блокировка чата на 30 минут.[/color][/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Trebuchet MS]Ваша активная позиция и участие в создании безопасного и приятного игрового опыта очень важны для нас. Спасибо за ваше участие. [/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Trebuchet MS][size=15px][font=Trebuchet MS]С уважением, Администрация [COLOR=rgb(255,200,0)]РУСЬ Mobile[/color].[/size][/font][/CENTER]',
      prefix: ACCEPT_PREFIX,
      status: false,
      },
      {
        title: 'Flood',
        content:
  '[CENTER][size=15px][font=Trebuchet MS][CENTER]Приветствую, уважаемый [COLOR=rgb(255,200,0)] {{ user.mention }}[/color].[/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Trebuchet MS]Благодарим вас за вашу жалобу. Мы тщательно рассмотрели вашу жалобу и приняли следующие решение:[/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Trebuchet MS]Игрок понесет наказание, согласно пункту правил: [color=rgb(255,200,0)]5.03 [/color] Нельзя повторять однотипные сообщения более двух раз подряд (Флудить)  |  [color=rgb(255,0,0)] Блокировка чата на 30 минут.[/color][/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Trebuchet MS]Ваша активная позиция и участие в создании безопасного и приятного игрового опыта очень важны для нас. Спасибо за ваше участие. [/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Trebuchet MS][size=15px][font=Trebuchet MS]С уважением, Администрация [COLOR=rgb(255,200,0)]РУСЬ Mobile[/color].[/size][/font][/CENTER]',
      prefix: ACCEPT_PREFIX,
      status: false,
      },
      {
        title: 'Caps',
        content:
  '[CENTER][size=15px][font=Trebuchet MS][CENTER]Приветствую, уважаемый [COLOR=rgb(255,200,0)] {{ user.mention }}[/color].[/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Trebuchet MS]Благодарим вас за вашу жалобу. Мы тщательно рассмотрели вашу жалобу и приняли следующие решение:[/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Trebuchet MS]Игрок понесет наказание, согласно пункту правил: [color=rgb(255,200,0)]5.04 [/color] В чатах сервера запрещено использование CapsLock (Чрезмерное использование верхнего регистра)  |  [color=rgb(255,0,0)] Блокировка чата на 30 минут.[/color][/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Trebuchet MS]Ваша активная позиция и участие в создании безопасного и приятного игрового опыта очень важны для нас. Спасибо за ваше участие. [/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Trebuchet MS][size=15px][font=Trebuchet MS]С уважением, Администрация [COLOR=rgb(255,200,0)]РУСЬ Mobile[/color].[/size][/font][/CENTER]',
      prefix: ACCEPT_PREFIX,
      status: false,
      },
      {
        title: 'Реклама',
        content:
  '[CENTER][size=15px][font=Trebuchet MS][CENTER]Приветствую, уважаемый [COLOR=rgb(255,200,0)] {{ user.mention }}[/color].[/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Trebuchet MS]Благодарим вас за вашу жалобу. Мы тщательно рассмотрели вашу жалобу и приняли следующие решение:[/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Trebuchet MS]Игрок понесет наказание, согласно пункту правил: [color=rgb(255,200,0)]5.06 [/color] Рекламирование других проектов, серверов, сайтов, своих каналов запрещено.  |  [color=rgb(255,0,0)] Блокировка аккаунта на 30 дней / Перманентная блокировка.[/color][/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Trebuchet MS]Ваша активная позиция и участие в создании безопасного и приятного игрового опыта очень важны для нас. Спасибо за ваше участие. [/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Trebuchet MS][size=15px][font=Trebuchet MS]С уважением, Администрация [COLOR=rgb(255,200,0)]РУСЬ Mobile[/color].[/size][/font][/CENTER]',
      prefix: ACCEPT_PREFIX,
      status: false,
      },
      {
        title: 'Оск',
        content:
  '[CENTER][size=15px][font=Trebuchet MS][CENTER]Приветствую, уважаемый [COLOR=rgb(255,200,0)] {{ user.mention }}[/color].[/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Trebuchet MS]Благодарим вас за вашу жалобу. Мы тщательно рассмотрели вашу жалобу и приняли следующие решение:[/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Trebuchet MS]Игрок понесет наказание, согласно пункту правил: [color=rgb(255,200,0)]5.07 [/color] Оскорбление других игроков, а так-же любые формы расизма, дискриминации, издевательств, национальной враждебностью запрещено, за исключением случаев, когда оно является частью RolePlay ситуации.  |  [color=rgb(255,0,0)] Блокировка чата на 30 минут.[/color][/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Trebuchet MS]Ваша активная позиция и участие в создании безопасного и приятного игрового опыта очень важны для нас. Спасибо за ваше участие. [/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Trebuchet MS][size=15px][font=Trebuchet MS]С уважением, Администрация [COLOR=rgb(255,200,0)]РУСЬ Mobile[/color].[/size][/font][/CENTER]',
      prefix: ACCEPT_PREFIX,
      status: false,
      },
      {
        title: 'Реклама промокода',
        content:
  '[CENTER][size=15px][font=Trebuchet MS][CENTER]Приветствую, уважаемый [COLOR=rgb(255,200,0)] {{ user.mention }}[/color].[/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Trebuchet MS]Благодарим вас за вашу жалобу. Мы тщательно рассмотрели вашу жалобу и приняли следующие решение:[/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Trebuchet MS]Игрок понесет наказание, согласно пункту правил: [color=rgb(255,200,0)]5.08 [/color] Запрещена реклама промокодов в игре.  |  [color=rgb(255,0,0)] Блокировка чата на 30 минут.[/color][/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Trebuchet MS]Ваша активная позиция и участие в создании безопасного и приятного игрового опыта очень важны для нас. Спасибо за ваше участие. [/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Trebuchet MS][size=15px][font=Trebuchet MS]С уважением, Администрация [COLOR=rgb(255,200,0)]РУСЬ Mobile[/color].[/size][/font][/CENTER]',
      prefix: ACCEPT_PREFIX,
      status: false,
      },
      {
        title: 'Реклама на Т/Т гос',
        content:
  '[CENTER][size=15px][font=Trebuchet MS][CENTER]Приветствую, уважаемый [COLOR=rgb(255,200,0)] {{ user.mention }}[/color].[/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Trebuchet MS]Благодарим вас за вашу жалобу. Мы тщательно рассмотрели вашу жалобу и приняли следующие решение:[/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Trebuchet MS]Игрок понесет наказание, согласно пункту правил: [color=rgb(255,200,0)]5.10  [/color] В зданиях государственных структур, запрещено устраивать рынки или рекламировать семьи и бизнесы.  |  [color=rgb(255,0,0)] Блокировка чата на 30 минут.[/color][/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Trebuchet MS]Ваша активная позиция и участие в создании безопасного и приятного игрового опыта очень важны для нас. Спасибо за ваше участие. [/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Trebuchet MS][size=15px][font=Trebuchet MS]С уважением, Администрация [COLOR=rgb(255,200,0)]РУСЬ Mobile[/color].[/size][/font][/CENTER]',
      prefix: ACCEPT_PREFIX,
      status: false,
      },
      {
        title: 'Религия',
        content:
  '[CENTER][size=15px][font=Trebuchet MS][CENTER]Приветствую, уважаемый [COLOR=rgb(255,200,0)] {{ user.mention }}[/color].[/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Trebuchet MS]Благодарим вас за вашу жалобу. Мы тщательно рассмотрели вашу жалобу и приняли следующие решение:[/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Trebuchet MS]Игрок понесет наказание, согласно пункту правил: [color=rgb(255,200,0)]5.11  [/color] Запрещено подстрекательство или пропагандирование к межнациональной вражде или травле других игроков.  |  [color=rgb(255,0,0)] Блокировка чата на 120 минут / Блокировка аккаунта на 7-15 дней.[/color][/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Trebuchet MS]Ваша активная позиция и участие в создании безопасного и приятного игрового опыта очень важны для нас. Спасибо за ваше участие. [/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Trebuchet MS][size=15px][font=Trebuchet MS]С уважением, Администрация [COLOR=rgb(255,200,0)]РУСЬ Mobile[/color].[/size][/font][/CENTER]',
      prefix: ACCEPT_PREFIX,
      status: false,
      },
      {
        title: 'Упом/Оск родных',
        content:
  '[CENTER][size=15px][font=Trebuchet MS][CENTER]Приветствую, уважаемый [COLOR=rgb(255,200,0)] {{ user.mention }}[/color].[/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Trebuchet MS]Благодарим вас за вашу жалобу. Мы тщательно рассмотрели вашу жалобу и приняли следующие решение:[/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Trebuchet MS]Игрок понесет наказание, согласно пункту правил: [color=rgb(255,200,0)]5.12  [/color] Запрещено упоминание/оскорбление родителей или близких других игроков. |  [color=rgb(255,0,0)] Блокировка чата на 180 минут / Блокировка аккаунта на 7 дней.[/color][/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Trebuchet MS]Ваша активная позиция и участие в создании безопасного и приятного игрового опыта очень важны для нас. Спасибо за ваше участие. [/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Trebuchet MS][size=15px][font=Trebuchet MS]С уважением, Администрация [COLOR=rgb(255,200,0)]РУСЬ Mobile[/color].[/size][/font][/CENTER]',
      prefix: ACCEPT_PREFIX,
      status: false,
      },
      {
        title: 'Оск адм',
        content:
  '[CENTER][size=15px][font=Trebuchet MS][CENTER]Приветствую, уважаемый [COLOR=rgb(255,200,0)] {{ user.mention }}[/color].[/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Trebuchet MS]Благодарим вас за вашу жалобу. Мы тщательно рассмотрели вашу жалобу и приняли следующие решение:[/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Trebuchet MS]Игрок понесет наказание, согласно пункту правил: [color=rgb(255,200,0)]5.13  [/color] Запрещено оскорбление администрации проекта. |  [color=rgb(255,0,0)] Блокировка чата на 120 минут / Блокировка аккаунта от 15 до 30 дней.[/color][/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Trebuchet MS]Ваша активная позиция и участие в создании безопасного и приятного игрового опыта очень важны для нас. Спасибо за ваше участие. [/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Trebuchet MS][size=15px][font=Trebuchet MS]С уважением, Администрация [COLOR=rgb(255,200,0)]РУСЬ Mobile[/color].[/size][/font][/CENTER]',
      prefix: ACCEPT_PREFIX,
      status: false,
      },
      {
        title: 'Оск проекта',
        content:
  '[CENTER][size=15px][font=Trebuchet MS][CENTER]Приветствую, уважаемый [COLOR=rgb(255,200,0)] {{ user.mention }}[/color].[/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Trebuchet MS]Благодарим вас за вашу жалобу. Мы тщательно рассмотрели вашу жалобу и приняли следующие решение:[/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Trebuchet MS]Игрок понесет наказание, согласно пункту правил: [color=rgb(255,200,0)]5.14  [/color] Запрещены оскорбления и клевета в сторону проекта. |  [color=rgb(255,0,0)] Блокировка чата на 120 минут / Блокировка аккаунта от 3 до 7 дней / Бан навсегда.[/color][/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Trebuchet MS]Ваша активная позиция и участие в создании безопасного и приятного игрового опыта очень важны для нас. Спасибо за ваше участие. [/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Trebuchet MS][size=15px][font=Trebuchet MS]С уважением, Администрация [COLOR=rgb(255,200,0)]РУСЬ Mobile[/color].[/size][/font][/CENTER]',
      prefix: ACCEPT_PREFIX,
      status: false,
      }, 
      {
        title: 'OOC угрозы',
        content:
  '[CENTER][size=15px][font=Trebuchet MS][CENTER]Приветствую, уважаемый [COLOR=rgb(255,200,0)] {{ user.mention }}[/color].[/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Trebuchet MS]Благодарим вас за вашу жалобу. Мы тщательно рассмотрели вашу жалобу и приняли следующие решение:[/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Trebuchet MS]Игрок понесет наказание, согласно пункту правил: [color=rgb(255,200,0)]5.17  [/color] Запрещены OOC угрозы, в том числе и завуалированные. |  [color=rgb(255,0,0)] Мут на 180 минут / Бан на 7-15 дней.[/color][/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Trebuchet MS]Ваша активная позиция и участие в создании безопасного и приятного игрового опыта очень важны для нас. Спасибо за ваше участие. [/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Trebuchet MS][size=15px][font=Trebuchet MS]С уважением, Администрация [COLOR=rgb(255,200,0)]РУСЬ Mobile[/color].[/size][/font][/CENTER]',
      prefix: ACCEPT_PREFIX,
      status: false,
      }, 
      {
        title: 'Выдача за адм',
        content:
  '[CENTER][size=15px][font=Trebuchet MS][CENTER]Приветствую, уважаемый [COLOR=rgb(255,200,0)] {{ user.mention }}[/color].[/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Trebuchet MS]Благодарим вас за вашу жалобу. Мы тщательно рассмотрели вашу жалобу и приняли следующие решение:[/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Trebuchet MS]Игрок понесет наказание, согласно пункту правил: [color=rgb(255,200,0)]5.18  [/color] Запрещена выдача себя за Администратора, если вы таковым не являетесь. |  [color=rgb(255,0,0)] Мут на 180 минут / Бан от 1 до 5 дней.[/color][/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Trebuchet MS]Ваша активная позиция и участие в создании безопасного и приятного игрового опыта очень важны для нас. Спасибо за ваше участие. [/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Trebuchet MS][size=15px][font=Trebuchet MS]С уважением, Администрация [COLOR=rgb(255,200,0)]РУСЬ Mobile[/color].[/size][/font][/CENTER]',
      prefix: ACCEPT_PREFIX,
      status: false,
      }, 
      {
        title: 'Помеха Voice',
        content:
  '[CENTER][size=15px][font=Trebuchet MS][CENTER]Приветствую, уважаемый [COLOR=rgb(255,200,0)] {{ user.mention }}[/color].[/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Trebuchet MS]Благодарим вас за вашу жалобу. Мы тщательно рассмотрели вашу жалобу и приняли следующие решение:[/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Trebuchet MS]Игрок понесет наказание, согласно пункту правил: [color=rgb(255,200,0)]5.20  [/color] Запрещено использование голосового чата с целью намеренного нарушения игры другим игрокам, таким как включение музыки, крики, различные звуки и т. д., запрещено. |  [color=rgb(255,0,0)] Мут голосового чата на 30 минут.[/color][/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Trebuchet MS]Ваша активная позиция и участие в создании безопасного и приятного игрового опыта очень важны для нас. Спасибо за ваше участие. [/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Trebuchet MS][size=15px][font=Trebuchet MS]С уважением, Администрация [COLOR=rgb(255,200,0)]РУСЬ Mobile[/color].[/size][/font][/CENTER]',
      prefix: ACCEPT_PREFIX,
      status: false,
      },
      {
        title: 'Музыка Voice',
        content:
  '[CENTER][size=15px][font=Trebuchet MS][CENTER]Приветствую, уважаемый [COLOR=rgb(255,200,0)] {{ user.mention }}[/color].[/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Trebuchet MS]Благодарим вас за вашу жалобу. Мы тщательно рассмотрели вашу жалобу и приняли следующие решение:[/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Trebuchet MS]Игрок понесет наказание, согласно пункту правил: [color=rgb(255,200,0)]5.21  [/color] Воспроизведение музыки в голосовом чате запрещено. |  [color=rgb(255,0,0)] Мут голосового чата на 30 минут.[/color][/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Trebuchet MS]Ваша активная позиция и участие в создании безопасного и приятного игрового опыта очень важны для нас. Спасибо за ваше участие. [/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Trebuchet MS][size=15px][font=Trebuchet MS]С уважением, Администрация [COLOR=rgb(255,200,0)]РУСЬ Mobile[/color].[/size][/font][/CENTER]',
      prefix: ACCEPT_PREFIX,
      status: false,
      },
      {
        title: 'Изменение голоса',
        content:
  '[CENTER][size=15px][font=Trebuchet MS][CENTER]Приветствую, уважаемый [COLOR=rgb(255,200,0)] {{ user.mention }}[/color].[/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Trebuchet MS]Благодарим вас за вашу жалобу. Мы тщательно рассмотрели вашу жалобу и приняли следующие решение:[/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Trebuchet MS]Игрок понесет наказание, согласно пункту правил: [color=rgb(255,200,0)]5.22  [/color] Запрещено использование любого софта для изменения голоса. |  [color=rgb(255,0,0)] Мут голосового чата на 30 минут.[/color][/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Trebuchet MS]Ваша активная позиция и участие в создании безопасного и приятного игрового опыта очень важны для нас. Спасибо за ваше участие. [/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Trebuchet MS][size=15px][font=Trebuchet MS]С уважением, Администрация [COLOR=rgb(255,200,0)]РУСЬ Mobile[/color].[/size][/font][/CENTER]',
      prefix: ACCEPT_PREFIX,
      status: false,
      },
      {
        title: '-------------------------------------------------Раздел администраций------------------------------------------------'
      },
      {
        title: 'Админ выдал наказание верно',
        content:
  '[CENTER][size=15px][font=Trebuchet MS][CENTER]Приветствую, уважаемый игрок [COLOR=rgb(255,200,0)] {{ user.mention }}[/color].[/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Trebuchet MS]Благодарим вас за вашу жалобу. После проведения расследования мы пришли к выводу, что в данной жалобе администратор выдал наказание верно.[/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Trebuchet MS]Мы всегда стремимся поддерживать честную и справедливую игровую среду для всех участников.[/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Trebuchet MS]Ваша внимательность и активное участие в сообществе игры оцениваются нами. Спасибо за понимание![/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Trebuchet MS][size=15px][font=Trebuchet MS]С уважением, Администрация [COLOR=rgb(255,200,0)]РУСЬ Mobile[/color].[/size][/font][/CENTER]',
      prefix: UNACCEPT_PREFIX,
      status: false,
      },
      {
        title: 'Админ не нарушает',
        content:
  '[CENTER][size=15px][font=Trebuchet MS][CENTER]Приветствую, уважаемый игрок [COLOR=rgb(255,200,0)] {{ user.mention }}[/color].[/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Trebuchet MS]Благодарим вас за вашу жалобу. После проведения расследования мы пришли к выводу, что в данной жалобе администратор не нарушает правила администрирования[/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Trebuchet MS]Мы всегда стремимся поддерживать честную и справедливую игровую среду для всех участников.[/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Trebuchet MS]Ваша внимательность и активное участие в сообществе игры оцениваются нами. Спасибо за понимание![/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Trebuchet MS][size=15px][font=Trebuchet MS]С уважением, Администрация [COLOR=rgb(255,200,0)]РУСЬ Mobile[/color].[/size][/font][/CENTER]',
      prefix: UNACCEPT_PREFIX,
      status: false,
      },
      {
        title: 'Админ выдал неверно/нету док-в на наказание',
        content:
  '[CENTER][size=15px][font=Trebuchet MS][CENTER]Приветствую, уважаемый игрок [COLOR=rgb(255,200,0)] {{ user.mention }}[/color].[/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Trebuchet MS]Благодарим вас за вашу жалобу. После проведения расследования мы пришли к выводу, что в данной жалобе администратор сделал неправильное решение.[/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Trebuchet MS]С администратором будет проведена дисциплинарная беседа. [/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Trebuchet MS]Ваша внимательность и активное участие в сообществе игры оцениваются нами. Спасибо за понимание![/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Trebuchet MS][size=15px][font=Trebuchet MS]С уважением, Администрация [COLOR=rgb(255,200,0)]РУСЬ Mobile[/color].[/size][/font][/CENTER]',
      prefix: UNACCEPT_PREFIX,
      status: false,
      },
      {
        title: 'Амнистия отказ',
        content:
  '[CENTER][size=15px][font=Trebuchet MS][CENTER]Приветствую, уважаемый игрок [COLOR=rgb(255,200,0)] {{ user.mention }}[/color].[/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Trebuchet MS]Благодарим вас за вашу жалобу. Мы тщательно рассмотрели вашу жалобу и приняли решение [COLOR=rgb(255,0,0)]отказа в амнистии.[/color][/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Trebuchet MS]Наказание выдано по разумному решению, чтобы обеспечить справедливую игровую среду. [/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Trebuchet MS]Спасибо за ваше обращение, а так-же спасибо за понимание![/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Trebuchet MS][size=15px][font=Trebuchet MS]С уважением, Администрация [COLOR=rgb(255,200,0)]РУСЬ Mobile[/color].[/size][/font][/CENTER]',
      prefix: UNACCEPT_PREFIX,
      status: false,
      },
      {
        title: 'Амнистия в пользу игрока',
        content:
  '[CENTER][size=15px][font=Trebuchet MS][CENTER]Приветствую, уважаемый игрок [COLOR=rgb(255,200,0)] {{ user.mention }}[/color].[/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Trebuchet MS]Благодарим вас за вашу жалобу. Мы тщательно рассмотрели вашу жалобу и приняли решение амнистии [COLOR=rgb(0,255,0)]в вашу пользу.[/color][/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Trebuchet MS]Наказание выдано по разумному решению, чтобы обеспечить справедливую игровую среду. [/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Trebuchet MS]Наказание будет смягчено, чтобы обеспечить справедливую игровую среду. Спасибо за ваше участие![/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Trebuchet MS][size=15px][font=Trebuchet MS]С уважением, Администрация [COLOR=rgb(255,200,0)]РУСЬ Mobile[/color].[/size][/font][/CENTER]',
      prefix: ACCEPT_PREFIX,
      status: false,
      },
      {
        title: 'Жалоба пустышка',
        content:
  '[CENTER][size=15px][font=Trebuchet MS][CENTER]Приветствую, уважаемый игрок [COLOR=rgb(255,200,0)] {{ user.mention }}[/color].[/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Trebuchet MS]Благодарим вас за вашу жалобу. Просим вас составить новую жалобу с подробным описанием ситуации и предоставленными доказательствами (при наличии).[/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Trebuchet MS]Спасибо за ваше обращение, а так-же спасибо за понимание![/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Trebuchet MS][size=15px][font=Trebuchet MS]С уважением, Администрация [COLOR=rgb(255,200,0)]РУСЬ Mobile[/color].[/size][/font][/CENTER]',
      prefix: UNACCEPT_PREFIX,
      status: false,
      },
      {
        title: 'Нечитабельные доказательства',
        content:
  '[CENTER][size=15px][font=Trebuchet MS][CENTER]Приветствую, уважаемый игрок [COLOR=rgb(255,200,0)] {{ user.mention }}[/color].[/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Trebuchet MS]Благодарим вас за вашу жалобу. Однако, при рассмотрении вашей жалобы было обнаружено, что доказательства нечитабельны или были подвержены редактированию (обрезка).[/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Trebuchet MS]Пожалуйста, будьте добры составить новую жалобу с оригинальными доказательствами. Спасибо за понимание![/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Trebuchet MS][size=15px][font=Trebuchet MS]С уважением, Администрация [COLOR=rgb(255,200,0)]РУСЬ Mobile[/color].[/size][/font][/CENTER]',
      prefix: UNACCEPT_PREFIX,
      status: false,
      },
          {
        title: '---------------------------------------------Раздел модерации форума---------------------------------------------'
      },
      {
        title: 'Био одобрена',
        content:
  '[CENTER][size=15px][font=Trebuchet MS][CENTER]Приветствую, уважаемый игрок [COLOR=rgb(255,200,0)] {{ user.mention }}[/color].[/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Trebuchet MS]Благодарим вас за создание RP биографии. Ваша биография получает Статус: [Color=rgb(0,255,0)]Одобрено.[/color][/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Trebuchet MS][size=15px][font=Trebuchet MS]С уважением, Администрация [COLOR=rgb(255,200,0)]РУСЬ Mobile[/color].[/size][/font][/CENTER]',
        prefix: ACCEPT_PREFIX,
      status: false,
      },
      {
        title: 'Био отказана',
        content:
  '[CENTER][size=15px][font=Trebuchet MS][CENTER]Приветствую, уважаемый игрок [COLOR=rgb(255,200,0)] {{ user.mention }}[/color].[/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Trebuchet MS]Благодарим вас за создание RP биографии. Ваша биография получает Статус: [Color=rgb(255, 0 ,0)]Отказано.[/color][/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Trebuchet MS][size=15px][font=Trebuchet MS]С уважением, Администрация [COLOR=rgb(255,200,0)]РУСЬ Mobile[/color].[/size][/font][/CENTER]',
      prefix: UNACCEPT_PREFIX,
      status: false,
      },
      {
        title: 'На рассмотрение био',
        content:
  '[CENTER][size=15px][font=Trebuchet MS][CENTER]Приветствую, уважаемый игрок [COLOR=rgb(255,200,0)] {{ user.mention }}[/color].[/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Trebuchet MS]Благодарим вас за создание RP биографии. Ваша биография получает Статус: [Color=rgb(255, 155 ,0)]На рассмотрении.[/color][/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Trebuchet MS][size=15px][font=Trebuchet MS]С уважением, Администрация [COLOR=rgb(255,200,0)]РУСЬ Mobile[/color].[/size][/font][/CENTER]',
        prefix: PIN_PREFIX,
      status: false,
      },
      {
        title: 'Возраст',
        content:
  '[CENTER][size=15px][font=Trebuchet MS][CENTER]Приветствую, уважаемый игрок [COLOR=rgb(255,200,0)] {{ user.mention }}[/color].[/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Trebuchet MS]Благодарим вас за создание RP биографии. Ваша биография получает Статус: [Color=rgb(255, 200 ,0)]На доработке.[/color][/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Trebuchet MS]Пожалуйста исправьте несостыковку в возрасте вашего персонажа в течении 24х часов.[/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Trebuchet MS][size=15px][font=Trebuchet MS]С уважением, Администрация [COLOR=rgb(255,200,0)]РУСЬ Mobile[/color].[/size][/font][/CENTER]',
        prefix: PIN_PREFIX,
      status: true,
      },
      {
        title: 'Био от 3го лица',
        content:
  '[CENTER][size=15px][font=Trebuchet MS][CENTER]Приветствую, уважаемый игрок [COLOR=rgb(255,200,0)] {{ user.mention }}[/color].[/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Trebuchet MS]Благодарим вас за создание RP биографии. Ваша биография получает Статус: [Color=rgb(255, 00 ,0)]Отказано.[/color][/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Trebuchet MS]Причиной тому послужило: Ваша RP Биография написана не от 3го лица игрового персонажа.[/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Trebuchet MS][size=15px][font=Trebuchet MS]С уважением, Администрация [COLOR=rgb(255,200,0)]РУСЬ Mobile[/color].[/size][/font][/CENTER]',
        prefix: UNACCEPT_PREFIX,
      status: false,
      },
      {
        title: 'Био не по форме',
        content:
  '[CENTER][size=15px][font=Trebuchet MS][CENTER]Приветствую, уважаемый игрок [COLOR=rgb(255,200,0)] {{ user.mention }}[/color].[/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Trebuchet MS]Благодарим вас за создание RP биографии. Ваша биография получает Статус: [Color=rgb(255, 00 ,0)]Отказано.[/color][/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Trebuchet MS]Причиной тому послужило: Ваша RP Биография была составлена не по форме. Пожалуйста ознакомьтесь с правилами написания RP биографии.[/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Trebuchet MS][size=15px][font=Trebuchet MS]С уважением, Администрация [COLOR=rgb(255,200,0)]РУСЬ Mobile[/color].[/size][/font][/CENTER]',
        prefix: UNACCEPT_PREFIX,
      status: false,
      },
      {
        title: 'Сменил ник',
        content:
  '[CENTER][size=15px][font=Trebuchet MS][CENTER]Приветствую, уважаемый игрок [COLOR=rgb(255,200,0)] {{ user.mention }}[/color].[/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Trebuchet MS]Благодарим вас за создание RP биографии. Ваша биография получает Статус: [Color=rgb(255, 00 ,0)]Отказано.[/color][/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Trebuchet MS]Причиной тому послужило: После смены игровго Nick_Name биография является недействительной.[/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Trebuchet MS][size=15px][font=Trebuchet MS]С уважением, Администрация [COLOR=rgb(255,200,0)]РУСЬ Mobile[/color].[/size][/font][/CENTER]',
        prefix: UNACCEPT_PREFIX,
      status: false,
      },
      {
        title: 'NRP способности',
        content:
  '[CENTER][size=15px][font=Trebuchet MS][CENTER]Приветствую, уважаемый игрок [COLOR=rgb(255,200,0)] {{ user.mention }}[/color].[/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Trebuchet MS]Благодарим вас за создание RP биографии. Ваша биография получает Статус: [Color=rgb(255, 00 ,0)]Отказано.[/color][/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Trebuchet MS]Причиной тому послужило: Запрещено присвоение NonRP способностей в биографии.[/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Trebuchet MS][size=15px][font=Trebuchet MS]С уважением, Администрация [COLOR=rgb(255,200,0)]РУСЬ Mobile[/color].[/size][/font][/CENTER]',
        prefix: UNACCEPT_PREFIX,
      status: false,
      },
      {
        title: 'NRP Nick Name',
        content:
  '[CENTER][size=15px][font=Trebuchet MS][CENTER]Приветствую, уважаемый игрок [COLOR=rgb(255,200,0)] {{ user.mention }}[/color].[/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Trebuchet MS]Благодарим вас за создание RP биографии. Ваша биография получает Статус: [Color=rgb(255, 00 ,0)]Отказано.[/color][/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Trebuchet MS]Причиной тому послужило: У персонажа биографии должен быть Role Play ник.[/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Trebuchet MS][size=15px][font=Trebuchet MS]С уважением, Администрация [COLOR=rgb(255,200,0)]РУСЬ Mobile[/color].[/size][/font][/CENTER]',
        prefix: UNACCEPT_PREFIX,
      status: false,
      },
      {
        title: '18+',
        content:
  '[CENTER][size=15px][font=Trebuchet MS][CENTER]Приветствую, уважаемый игрок [COLOR=rgb(255,200,0)] {{ user.mention }}[/color].[/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Trebuchet MS]Благодарим вас за создание RP биографии. Ваша биография получает Статус: [Color=rgb(255, 00 ,0)]Отказано.[/color][/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Trebuchet MS]Причиной тому послужило: Ваш игровой персонаж должен быть совершеннолетним (18+ лет).[/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Trebuchet MS][size=15px][font=Trebuchet MS]С уважением, Администрация [COLOR=rgb(255,200,0)]РУСЬ Mobile[/color].[/size][/font][/CENTER]',
        prefix: UNACCEPT_PREFIX,
      status: false,
      },
  ];
   
    $(document).ready(() => {
      // Загрузка скрипта для обработки шаблонов
      $('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');
   
      // Добавление кнопок при загрузке страницы
      addButton('На рассмотрении', 'pin');
      addButton('Одобрено', 'accepted');
      addButton('Отказано', 'unaccept');
      addButton('Главному Администратору', 'Ga');
      addButton('Спец.адм', 'teamProject');
      addButton('Ответы', 'selectAnswer');
   
      // Поиск информации о теме
      const threadData = getThreadData();
   
      $('button#pin').click(() => editThreadData(PIN_PREFIX, true));
      $('button#accepted').click(() => editThreadData(ACCEPT_PREFIX, false));
      $('button#Ga').click(() => editThreadData(GA_PREFIX, true));
      $('button#teamProject').click(() => editThreadData(COMMAND_PREFIX, true));
      $('button#unaccept').click(() => editThreadData(UNACCEPT_PREFIX, false));
      $('button#Texy').click(() => editThreadData(TEX_PREFIX, false));
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