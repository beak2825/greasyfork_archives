// ==UserScript==
// @name         Azure // Жалобы на адм (Junior)
// @namespace    https://greasyfork.org/ru/users/1032828-crystalby
// @version      1.0
// @description  Скрипт для упрощения работы Куратора Адм
// @author       ХЦЕСОС
// @match        https://forum.blackrussia.online/threads/*
// @include      https://forum.blackrussia.online/threads/
// @icon         https://icons.iconarchive.com/icons/papirus-team/papirus-apps/48/emerald-theme-manager-icon-icon.png
// @grant        none
// @license 	 none
// @downloadURL https://update.greasyfork.org/scripts/478716/Azure%20%20%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B%20%D0%BD%D0%B0%20%D0%B0%D0%B4%D0%BC%20%28Junior%29.user.js
// @updateURL https://update.greasyfork.org/scripts/478716/Azure%20%20%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B%20%D0%BD%D0%B0%20%D0%B0%D0%B4%D0%BC%20%28Junior%29.meta.js
// ==/UserScript==

(function () {
    'use strict';
    const UNACCEPT_PREFIX = 4; // Префикс "Отказано"
    const ACCEPT_PREFIX = 8; // Префикс "Одобрено"
    const RESHENO_PREFIX = 6; // Префикс "Решено"
    const PIN_PREFIX = 2; // Префикс "На рассмотрении"
    const GA_PREFIX = 12; // Префикс "Главному Администратору"
    const COMMAND_PREFIX = 10; // Префикс "Команде Проекта"
    const WATCHED_PREFIX = 9; // Префикс "Рассмотрено"
    const CLOSE_PREFIX = 7; // Префикс "Закрыто"
    const SPECIAL_PREFIX = 11; // Префикс "Специальному Администратору"
    const buttons = [
        {
      title: '|',
      content:
        '[SIZE=4][COLOR=rgb(0, 255, 255)][FONT=times new roman]{{ greeting }}, уважаемый игрок.[/FONT][/COLOR][/SIZE]',
    },
     {
      title: 'Передано ГА жб',
      content:
        '[CENTER][FONT=times new roman][SIZE=4][COLOR=rgb(255, 0, 0)]{{ greeting }}, уважаемый игрок.[/COLOR][/SIZE][/FONT]<br><br>' +
        "[COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Ваша жалоба переадресована [/SIZE][/FONT][/COLOR][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]Главному Администратору[/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4].[/SIZE][/FONT][/COLOR]<br>" +
        '[FONT=times new roman][SIZE=4][COLOR=rgb(209, 213, 216)]Ожидайте ответа в данной теме, копии создавать не нужно.[/COLOR][/SIZE][/FONT][/CENTER]' +
        "[Color=magenta][FONT=Courier New][RIGHT]By[Color=cyan] J.Grand[/color][/RIGHT][/FONT]"+
        '[Color=DeepPink][FONT=Book Antiqua][RIGHT]Соц.Сеть для связи со мной: [URL=https://vk.com/juniorgrand][/URL][/RIGHT][/color][/FONT]',
      prefix: GA_PREFIX,
      status: true,
    },
         {
      title: 'Передано ЗГА',
      content:
        '[CENTER][FONT=times new roman][SIZE=4][COLOR=rgb(255, 0, 0)]{{ greeting }}, уважаемый игрок.[/COLOR][/SIZE][/FONT]<br><br>' +
        "[COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Ваша жалоба переадресована [/SIZE][/FONT][/COLOR][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]Заместителю Главного Администратора[/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4].[/SIZE][/FONT][/COLOR]<br>" +
        '[FONT=times new roman][SIZE=4][COLOR=rgb(209, 213, 216)]Ожидайте ответа в данной теме, копии создавать не нужно.[/COLOR][/SIZE][/FONT][/CENTER]' +
        "[Color=magenta][FONT=Courier New][RIGHT]By[Color=cyan] J.Grand[/color][/RIGHT][/FONT]"+
        '[Color=DeepPink][FONT=Book Antiqua][RIGHT]Соц.Сеть для связи со мной: [URL=https://vk.com/juniorgrand][/URL][/RIGHT][/color][/FONT]',
      prefix: PIN_PREFIX,
      status: true,
    },
    {
      title: 'Передано СА',
      content:
        '[CENTER][FONT=times new roman][SIZE=4][COLOR=rgb(255, 0, 0)]{{ greeting }}, уважаемый игрок.[/COLOR][/SIZE][/FONT]<br><br>' +
        "[COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Ваша жалоба переадресована [/SIZE][/FONT][/COLOR][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]Специальному Администратору[/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4].[/SIZE][/FONT][/COLOR]<br><br>" +
        '[FONT=times new roman][SIZE=4][COLOR=rgb(209, 213, 216)]Ожидайте ответа в данной теме, копии создавать не нужно.[/COLOR][/SIZE][/FONT][/CENTER]'+
        "[Color=magenta][FONT=Courier New][RIGHT]By[Color=cyan] J.Grand[/color][/RIGHT][/FONT]"+
        '[Color=DeepPink][FONT=Book Antiqua][RIGHT]Соц.Сеть для связи со мной: [URL=https://vk.com/juniorgrand][/URL][/RIGHT][/color][/FONT]',
      prefix:SPECIAL_PREFIX,
      status: true,
    },
    {
      title: 'На рассмотрении',
      content:
        '[CENTER][SIZE=4][FONT=times new roman][COLOR=rgb(255, 0, 0)]{{ greeting }}, уважаемый игрок.[/COLOR][/FONT][/SIZE]<br><br>' +
        "[SIZE=4][COLOR=rgb(209, 213, 216)][FONT=times new roman]Ваша жалоба взята на рассмотрение.[/FONT][/COLOR][/SIZE]<br>" +
        '[SIZE=4][FONT=times new roman][COLOR=rgb(209, 213, 216)]Не нужно создавать копии этой жалобы, ожидайте ответа в этой теме.[/COLOR][/FONT][/SIZE][/CENTER]'+
        "[Color=magenta][FONT=Courier New][RIGHT]By[Color=cyan] J.Grand[/color][/RIGHT][/FONT]"+
        '[Color=DeepPink][FONT=Book Antiqua][RIGHT]Соц.Сеть для связи со мной: [URL=https://vk.com/juniorgrand][/URL][/RIGHT][/color][/FONT]',
      prefix: PIN_PREFIX,
      status: true,
    },
    {
      title: '========================================= Стандарт ========================================= ',
    },
    {
      title: 'Запрошу док-ва',
      content:
        '[CENTER][FONT=times new roman][SIZE=4][COLOR=rgb(255, 0, 0)]{{ greeting }}, уважаемый игрок.[/COLOR][/SIZE][/FONT]<br><br>' +
        "[SIZE=4][COLOR=rgb(209, 213, 216)][FONT=times new roman]Запрошу доказательства у администратора. [/FONT][/COLOR]<br>" +
        '[FONT=times new roman][COLOR=rgb(209, 213, 216)]Ожидайте, пожалуйста, ответа от администрации и не нужно создавать копии этой темы.[/COLOR][/FONT][/SIZE][/CENTER]'+
        "[Color=magenta][FONT=Courier New][RIGHT]By[Color=cyan] J.Grand[/color][/RIGHT][/FONT]"+
        '[Color=DeepPink][FONT=Book Antiqua][RIGHT]Соц.Сеть для связи со мной: [URL=https://vk.com/juniorgrand][/URL][/RIGHT][/color][/FONT]',
      prefix: PIN_PREFIX,
      status: true,
    },
    {
      title: 'Док-ва предоставлены',
      content:
        '[CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый игрок.[/SIZE][/FONT][/COLOR]<br><br>' +
        "[FONT=times new roman][SIZE=4][COLOR=rgb(209, 213, 216)]Доказательства предоставлены, наказание выдано верно.[/COLOR]<br>" +
        "[COLOR=rgb(209, 213, 216)]Внимательно прочтите общие правила серверов и впредь, пожалуйста, не нарушайте - [/COLOR][COLOR=rgb(209, 213, 216)][URL='https://forum.blackrussia.online/index.php?threads/%D0%9E%D0%B1%D1%89%D0%B8%D0%B5-%D0%BF%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%B5%D1%80%D0%B2%D0%B5%D1%80%D0%BE%D0%B2.312571/']*Нажмите сюда*[/URL][/COLOR][/SIZE][/FONT]<br><br>" +
        "[SIZE=4][FONT=times new roman][COLOR=rgb(209, 213, 216)]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/COLOR][/FONT][/SIZE]<br><br>" +
        '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]Закрыто.[/SIZE][/FONT][/COLOR][/CENTER]'+
        "[Color=magenta][FONT=Courier New][RIGHT]By[Color=cyan] J.Grand[/color][/RIGHT][/FONT]"+
        '[Color=DeepPink][FONT=Book Antiqua][RIGHT]Соц.Сеть для связи со мной: [URL=https://vk.com/juniorgrand][/URL][/RIGHT][/color][/FONT]',
      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
      title: 'Ответ дан раннее',
      content:
        '[CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый игрок.[/SIZE][/FONT][/COLOR]<br><br>' +
        "[SIZE=4][FONT=times new roman][COLOR=rgb(209, 213, 216)]Вам уже ранее был дан корректный ответ, за создание дубликатов этой темы ваш форумный аккаунт может быть заблокирован.[/COLOR][/FONT][/SIZE]<br><br>" +
        '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]Закрыто.[/SIZE][/FONT][/COLOR][/CENTER]'+
        "[Color=magenta][FONT=Courier New][RIGHT]By[Color=cyan] J.Grand[/color][/RIGHT][/FONT]"+
        '[Color=DeepPink][FONT=Book Antiqua][RIGHT]Соц.Сеть для связи со мной: [URL=https://vk.com/juniorgrand][/URL][/RIGHT][/color][/FONT]',
      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
      title: 'Админ ошибся (наказание снято)',
      content:
        '[CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый игрок.[/SIZE][/FONT][/COLOR]<br><br>' +
        "[SIZE=4][FONT=times new roman][COLOR=rgb(209, 213, 216)]Администратор допустил ошибку.[/COLOR]<br><br>" +
        "[COLOR=rgb(209, 213, 216)]Приносим свои извинения за доставленные неудобства.[/COLOR]<br>" +
        "[COLOR=rgb(209, 213, 216)]Приятной игры на [/COLOR][COLOR=rgb(209, 213, 216)]BLACK RUSSIA Azure.<br>" +
        "Ваше наказание будет снято в течение 6-ти часов.[/COLOR][/FONT][/SIZE]<br><br>" +
        '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]Закрыто.[/SIZE][/FONT][/COLOR][/CENTER]'+
        "[Color=magenta][FONT=Courier New][RIGHT]By[Color=cyan] J.Grand[/color][/RIGHT][/FONT]"+
        '[Color=DeepPink][FONT=Book Antiqua][RIGHT]Соц.Сеть для связи со мной: [URL=https://vk.com/juniorgrand][/URL][/RIGHT][/color][/FONT]',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: 'Выдано верно',
      content:
        '[CENTER][FONT=times new roman][COLOR=rgb(255, 0, 0)][SIZE=4]{{ greeting }}, уважаемый игрок.[/SIZE][/COLOR][/FONT]<br><br>' +
        "[COLOR=rgb(209, 213, 216)][SIZE=4][FONT=times new roman]Нарушений со стороны администратора нет.[/FONT][/SIZE]<br><br>" +
        '[FONT=times new roman][COLOR=rgb(255, 0, 0)][SIZE=4]Закрыто.[/SIZE][/COLOR][/FONT][/CENTER]'+
        "[Color=magenta][FONT=Courier New][RIGHT]By[Color=cyan] J.Grand[/color][/RIGHT][/FONT]"+
        '[Color=DeepPink][FONT=Book Antiqua][RIGHT]Соц.Сеть для связи со мной: [URL=https://vk.com/juniorgrand][/URL][/RIGHT][/color][/FONT]',
      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
      title: 'Админ не прав',
      content:
        '[CENTER][FONT=times new roman][COLOR=rgb(255, 0, 0)][SIZE=4]{{ greeting }}, уважаемый игрок.[/SIZE][/COLOR][/FONT]<br><br>' +
        "[SIZE=4][FONT=times new roman][COLOR=rgb(209, 213, 216)]С администратором будет проведена беседа.[/COLOR][/FONT][/SIZE]<br>" +
        "[FONT=times new roman][COLOR=#d1d5d8][SIZE=4]Приносим свои извинения за доставленные неудобства.<br>" +
        "Приятной игры на BLACK RUSSIA Azure.[/SIZE][/COLOR][/FONT]<br><br>" +
        '[COLOR=rgb(209, 213, 216)][FONT=times new roman][COLOR=rgb(255, 0, 0)][SIZE=4]Закрыто.[/SIZE][/COLOR][/FONT][/COLOR][/CENTER]'+
        "[Color=magenta][FONT=Courier New][RIGHT]By[Color=cyan] J.Grand[/color][/RIGHT][/FONT]"+
        '[Color=DeepPink][FONT=Book Antiqua][RIGHT]Соц.Сеть для связи со мной: [URL=https://vk.com/juniorgrand][/URL][/RIGHT][/color][/FONT]',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: '========================================= Ошибка ========================================= ',
    },
    {
      title: 'Прошло 48 часа',
      content:
        '[CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый игрок.[/SIZE][/FONT][/COLOR]<br><br>' +
        "[COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Срок написания жалобы - 48 часа с момента выдачи наказания.[/SIZE][/FONT]<br>" +
        "[FONT=times new roman][SIZE=4]Внимательно прочитайте правила составления жалоб, которые закреплены в этом разделе.[/SIZE][/FONT][/COLOR]<br><br>" +
        "[COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Вам стоит обратиться в раздел Обжалования наказаний - [/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4][URL='https://forum.blackrussia.online/forums/%D0%9E%D0%B1%D0%B6%D0%B0%D0%BB%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D0%B5-%D0%BD%D0%B0%D0%BA%D0%B0%D0%B7%D0%B0%D0%BD%D0%B8%D0%B9.724/']*Нажмите сюда*[/URL]<br>" +
        '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]Закрыто.[/SIZE][/FONT][/COLOR][/CENTER]'+
        "[Color=magenta][FONT=Courier New][RIGHT]By[Color=cyan] J.Grand[/color][/RIGHT][/FONT]"+
        '[Color=DeepPink][FONT=Book Antiqua][RIGHT]Соц.Сеть для связи со мной: [URL=https://vk.com/juniorgrand][/URL][/RIGHT][/color][/FONT]',
      prefix: CLOSE_PREFIX,
      status: false,
    },
          {
      title: 'Не работают доква',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Не работают докозательства[/CENTER]<br>" +
        '[Color=Flame][CENTER]Закрыто[/I][/CENTER][/color][/FONT]'+
        "[Color=magenta][FONT=Courier New][RIGHT]By[Color=cyan] J.Grand[/color][/RIGHT][/FONT]"+
        '[Color=DeepPink][FONT=Book Antiqua][RIGHT]Соц.Сеть для связи со мной: [URL=https://vk.com/juniorgrand][/URL][/RIGHT][/color][/FONT]',
      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
      title: 'Недостаточно док-в',
      content:
        '[CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый игрок.[/SIZE][/FONT][/COLOR]<br><br>' +
        "[COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Недостаточно доказательств для корректного рассмотрения вашего обращения.[/SIZE][/FONT][/COLOR]<br><br>" +
        '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]Закрыто.[/SIZE][/FONT][/COLOR][/CENTER]'+
        "[Color=magenta][FONT=Courier New][RIGHT]By[Color=cyan] J.Grand[/color][/RIGHT][/FONT]"+
        '[Color=DeepPink][FONT=Book Antiqua][RIGHT]Соц.Сеть для связи со мной: [URL=https://vk.com/juniorgrand][/URL][/RIGHT][/color][/FONT]',
      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
      title: 'Не по теме',
      content:
        '[CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый игрок.[/SIZE][/FONT][/COLOR]<br><br>' +
        "[COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Ваше сообщение никоим образом не относится к предназначению данного раздела.[/SIZE][/FONT][/COLOR]<br><br>" +
        '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]Закрыто.[/SIZE][/FONT][/COLOR][/CENTER]'+
        "[Color=magenta][FONT=Courier New][RIGHT]By[Color=cyan] J.Grand[/color][/RIGHT][/FONT]"+
        '[Color=DeepPink][FONT=Book Antiqua][RIGHT]Соц.Сеть для связи со мной: [URL=https://vk.com/juniorgrand][/URL][/RIGHT][/color][/FONT]',
      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
      title: 'Нужен фрапс',
      content:
        '[CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый игрок.[/SIZE][/FONT][/COLOR]<br><br>' +
        '[COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Недостаточно доказательств для корректного рассмотрения жалобы. В данном случае требуются видео - доказательства.[/SIZE][/FONT]<br>' +
        '[FONT=times new roman][SIZE=4]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/SIZE][/FONT][/COLOR]<br><br>' +
        '[FONT=times new roman][SIZE=4][COLOR=rgb(255, 0, 0)]Закрыто.[/COLOR][/SIZE][/FONT][/CENTER]'+
        "[Color=magenta][FONT=Courier New][RIGHT]By[Color=cyan] J.Grand[/color][/RIGHT][/FONT]"+
        '[Color=DeepPink][FONT=Book Antiqua][RIGHT]Соц.Сеть для связи со мной: [URL=https://vk.com/juniorgrand][/URL][/RIGHT][/color][/FONT]',
      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
      title: 'Док-ва отред.',
      content:
        '[CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый игрок.[/SIZE][/FONT][/COLOR]<br><br>' +
        '[COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Ваши доказательства были подвергнуты изменениям (редактированию), прикрепите оригинальные файлы.[/SIZE][/FONT]<br>' +
        '[FONT=times new roman][SIZE=4]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/SIZE][/FONT][/COLOR]<br><br>' +
        '[FONT=times new roman][SIZE=4][COLOR=rgb(255, 0, 0)]Закрыто.[/COLOR][/SIZE][/FONT][/CENTER]'+
        "[Color=magenta][FONT=Courier New][RIGHT]By[Color=cyan] J.Grand[/color][/RIGHT][/FONT]"+
        '[Color=DeepPink][FONT=Book Antiqua][RIGHT]Соц.Сеть для связи со мной: [URL=https://vk.com/juniorgrand][/URL][/RIGHT][/color][/FONT]',
      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
      title: 'Отсутст. док-ва',
      content:
        '[CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый игрок.[/SIZE][/FONT][/COLOR]<br><br>' +
        "[COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Отсутствуют доказательства - следовательно, рассмотрению не подлежит.[/SIZE][/FONT][/COLOR]<br>" +
        "[SIZE=4][COLOR=rgb(209, 213, 216)][FONT=times new roman]Загрузите доказательства на фото-видео хостинги YouTube, Imgur, Yapx и так далее.[/FONT][/COLOR][/SIZE]<br><br>" +
        '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]Закрыто.[/SIZE][/FONT][/COLOR][/CENTER]'+
        "[Color=magenta][FONT=Courier New][RIGHT]By[Color=cyan] J.Grand[/color][/RIGHT][/FONT]"+
        '[Color=DeepPink][FONT=Book Antiqua][RIGHT]Соц.Сеть для связи со мной: [URL=https://vk.com/juniorgrand][/URL][/RIGHT][/color][/FONT]',
      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
      title: 'Не по форме',
      content:
        '[CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый игрок.[/SIZE][/FONT][/COLOR]<br><br>' +
        "[SIZE=4][FONT=times new roman][COLOR=rgb(209, 213, 216)]Ваша жалоба составлена не по форме.[/COLOR]<br><br>" +
        "[COLOR=rgb(209, 213, 216)]Форма подачи:.[/COLOR][/FONT][/SIZE]<br><br>" +
		'[LEFT][QUOTE]1. Ваш Nick_Name:<br>2. Nick_Name администратора:<br>3. Дата выдачи/получения наказания:<br>4. Суть жалобы:<br>5. Доказательство:[/QUOTE][/LEFT]<br><br>' +
        '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]Закрыто.[/SIZE][/FONT][/COLOR][/CENTER]'+
        "[Color=magenta][FONT=Courier New][RIGHT]By[Color=cyan] J.Grand[/color][/RIGHT][/FONT]"+
        '[Color=DeepPink][FONT=Book Antiqua][RIGHT]Соц.Сеть для связи со мной: [URL=https://vk.com/juniorgrand][/URL][/RIGHT][/color][/FONT]',
      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
      title: 'Док-ва в соц. сетях',
      content:
        '[CENTER][FONT=times new roman][COLOR=rgb(255, 0, 0)][SIZE=4]{{ greeting }}, уважаемый игрок.[/SIZE][/COLOR][/FONT]<br><br>' +
        "[COLOR=rgb(209, 213, 216)][SIZE=4][FONT=times new roman]Доказательства в социальных сетях и т.д. не принимаются.[/FONT][/SIZE]<br>" +
        "[SIZE=4][FONT=times new roman]Загрузите доказательства на фото-видео хостинги YouTube, Imgur, Yapx и так далее.[/FONT][/SIZE][/COLOR]<br><br>" +
        '[FONT=times new roman][COLOR=rgb(255, 0, 0)][SIZE=4]Закрыто.[/SIZE][/COLOR][/FONT][/CENTER]'+
        "[Color=magenta][FONT=Courier New][RIGHT]By[Color=cyan] J.Grand[/color][/RIGHT][/FONT]"+
        '[Color=DeepPink][FONT=Book Antiqua][RIGHT]Соц.Сеть для связи со мной: [URL=https://vk.com/juniorgrand][/URL][/RIGHT][/color][/FONT]',
      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
      title: 'Нужно окно бана',
      content:
        '[CENTER][FONT=times new roman][SIZE=4][COLOR=rgb(255, 0, 0)]{{ greeting }}, уважаемый игрок.[/COLOR]<br><br>' +
        '[COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Прикрепите в доказательства скриншот окна блокировки, которое появляется сразу после входа в игру.<br>' +
        'Приятной игры на BLACK RUSSIA RolePlay.[/SIZE][/FONT][/COLOR]<br><br>' +
        '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]Закрыто.[/SIZE][/FONT][/COLOR][/CENTER]'+
        "[Color=magenta][FONT=Courier New][RIGHT]By[Color=cyan] J.Grand[/color][/RIGHT][/FONT]"+
        '[Color=DeepPink][FONT=Book Antiqua][RIGHT]Соц.Сеть для связи со мной: [URL=https://vk.com/juniorgrand][/URL][/RIGHT][/color][/FONT]',
      prefix: CLOSE_PREFIX,
      status: false,
    },
         {
      title: 'Заголовок не по форме',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][FONT=Georgia][I]Заголовок вашей жалобы составлен не по форме. Убедительная просьба ознакомиться [Color=Red]с правилами подачи жалоб на игроков[/color].[/CENTER]" +
        '[Color=Red][CENTER]Отказано, закрыто.[/I][/CENTER][/color][/FONT]'+
          "[Color=magenta][FONT=Courier New][RIGHT]By[Color=cyan] J.Grand[/color][/RIGHT][/FONT]"+
        '[Color=DeepPink][FONT=Book Antiqua][RIGHT]Соц.Сеть для связи со мной: [URL=https://vk.com/juniorgrand][/URL][/RIGHT][/color][/FONT]',
      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
      title: '====================================== Перепутал раздел ====================================== ',
    },
    {
      title: 'В обжалования',
      content:
        '[CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый игрок.[/SIZE][/FONT][/COLOR]<br><br>' +
        "[COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Обратитесь в раздел обжалований наказаний.[/SIZE][/FONT][/COLOR]<br><br>" +
        '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]Закрыто.[/SIZE][/FONT][/COLOR][/CENTER]'+
        "[Color=magenta][FONT=Courier New][RIGHT]By[Color=cyan] J.Grand[/color][/RIGHT][/FONT]"+
        '[Color=DeepPink][FONT=Book Antiqua][RIGHT]Соц.Сеть для связи со мной: [URL=https://vk.com/juniorgrand][/URL][/RIGHT][/color][/FONT]',
      prefix: CLOSE_PREFIX,
      status: false,
    },
        {
      title: 'Жб на игроков.',
      content:
        '[CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый игрок.[/SIZE][/FONT][/COLOR]<br><br>' +
        "[COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Обратитесь в раздел жалоб на Игроков - [/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4][URL='https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B8%D0%B3%D1%80%D0%BE%D0%BA%D0%BE%D0%B2.723/']*Нажмите сюда*[/URL]<br>" +
        "Просьба не создавать дубликаты данной темы в этом разделе, иначе ваш форумный аккаунт может быть заблокирован.[/SIZE][/FONT][/COLOR]<br><br>" +
        '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]Закрыто.[/SIZE][/FONT][/COLOR][/CENTER]'+
        "[Color=magenta][FONT=Courier New][RIGHT]By[Color=cyan] J.Grand[/color][/RIGHT][/FONT]"+
        '[Color=DeepPink][FONT=Book Antiqua][RIGHT]Соц.Сеть для связи со мной: [URL=https://vk.com/juniorgrand][/URL][/RIGHT][/color][/FONT]',
      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
      title: 'Жб for Тех. спец.',
      content:
        '[CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый игрок.[/SIZE][/FONT][/COLOR]<br><br>' +
        "[COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Обратитесь в раздел жалоб на Технических специалистов - [/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4][URL='https://forum.blackrussia.online/index.php?forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D1%82%D0%B5%D1%85%D0%BD%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%B8%D1%85-%D1%81%D0%BF%D0%B5%D1%86%D0%B8%D0%B0%D0%BB%D0%B8%D1%81%D1%82%D0%BE%D0%B2.490/']*Нажмите сюда*[/URL]<br>" +
        "Просьба не создавать дубликаты данной темы в этом разделе, иначе ваш форумный аккаунт может быть заблокирован.[/SIZE][/FONT][/COLOR]<br><br>" +
        '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]Закрыто.[/SIZE][/FONT][/COLOR][/CENTER]'+
        "[Color=magenta][FONT=Courier New][RIGHT]By[Color=cyan] J.Grand[/color][/RIGHT][/FONT]"+
        '[Color=DeepPink][FONT=Book Antiqua][RIGHT]Соц.Сеть для связи со мной: [URL=https://vk.com/juniorgrand][/URL][/RIGHT][/color][/FONT]',
      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
      title: 'В тех раздел',
      content:
        '[CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый игрок.[/SIZE][/FONT][/COLOR]<br><br>' +
        "[COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Обратитесь в технический раздел - [/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4][URL='https://clck.ru/NM4QK']*Нажмите сюда*[/URL]<br>" +
        "Просьба не создавать дубликаты данной темы в этом разделе, иначе ваш форумный аккаунт может быть заблокирован.[/SIZE][/FONT][/COLOR]<br><br>" +
        '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]Закрыто.[/SIZE][/FONT][/COLOR][/CENTER]'+
        "[Color=magenta][FONT=Courier New][RIGHT]By[Color=cyan] J.Grand[/color][/RIGHT][/FONT]"+
        '[Color=DeepPink][FONT=Book Antiqua][RIGHT]Соц.Сеть для связи со мной: [URL=https://vk.com/juniorgrand][/URL][/RIGHT][/color][/FONT]',
      prefix: CLOSE_PREFIX,
      status: false,
    },
 ];

    $(document).ready(() => {
        // Загрузка скрипта для обработки шаблонов
        $('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');

        // Добавление кнопок при загрузке страницы
        addButton('Админы', 'selectAnswer');
        addButton('Одобрить', 'accepted');
        addButton('Отказать', 'unaccept');
        addButton('На рассмотрение', 'pin');
        addButton('Закрыть', 'closed');


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

    function addButton(name, id) {
        $('.button--icon--reply').before(
            `<button type="button" class="button--primary button rippleButton" id="${id}" style="border-radius: 5px; margin-right: 7px;">${name}</button>`,
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