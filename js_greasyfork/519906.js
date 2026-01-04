// ==UserScript==
// @name         Технические Специалисты (Форум)
// @namespace    https://wh10919.web1.maze-host.ru/index.php
// @version      0.7
// @description  Скрипт для технических специалистов
// @author       Dozza_Skyxrockedz
// @match        https://forum.blackrussia.online/threads/*
// @include      https://forum.blackrussia.online/threads/
// @grant        none
// @license      MIT
// @icon https://img.icons8.com/nolan/452/beezy.png
// @downloadURL https://update.greasyfork.org/scripts/519906/%D0%A2%D0%B5%D1%85%D0%BD%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%B8%D0%B5%20%D0%A1%D0%BF%D0%B5%D1%86%D0%B8%D0%B0%D0%BB%D0%B8%D1%81%D1%82%D1%8B%20%28%D0%A4%D0%BE%D1%80%D1%83%D0%BC%29.user.js
// @updateURL https://update.greasyfork.org/scripts/519906/%D0%A2%D0%B5%D1%85%D0%BD%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%B8%D0%B5%20%D0%A1%D0%BF%D0%B5%D1%86%D0%B8%D0%B0%D0%BB%D0%B8%D1%81%D1%82%D1%8B%20%28%D0%A4%D0%BE%D1%80%D1%83%D0%BC%29.meta.js
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
      title: 'Приветствие',
      content:
        '[COLOR=rgb(0, 255, 127)][FONT=Arial][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
        '[CENTER]Тут должен быть ваш текст[/CENTER]',
    },
    {
      title: 'Рассписываем',
      content:
        '[SIZE=4][FONT=Verdana][CENTER]Доброго времени суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
        '[CENTER]Получили блокировку за нарушение [COLOR=rgb(65, 168, 95)]пункта правил[/COLOR]:<br><br>' +
        '[SPOILER="пункт "]<br>' +
        '[/SPOILER]<br><br>' +
        'А именно из-за данных действий:[/CENTER]<br><br>' +
        '[TABLE][TR][TD][CENTER][/CENTER][/TD][TD][CENTER][/CENTER][/TD][/TR][TR][TD][CENTER][/CENTER][/TD][TD][CENTER][/CENTER][/TD][/TR][/TABLE]<br><br>[CENTER]' +
        'Передано Куратору для окончательного вердикта.<br><br>' +
        '[COLOR=rgb(255, 255, 0)]Тема закреплена и находится на рассмотрении[/COLOR][/CENTER][/FONT][/SIZE]',
      prefix: TECH_PREFIX,
      status: true,
    },
    {
      title: '----╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴Вердикты  ----╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
      title: '| На рассмотрение |',
      content:
        "[B][CENTER][FONT=georgia][COLOR=#ff0000][ICODE]{{ greeting }} {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>" +
        "[B][CENTER][COLOR=lavender]Ваша жалоба взята на рассмотрение, пожалуйста не создавайте дубликатов. Ожидайте ответа.<br>" +
        "[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br>" +
        '[B][CENTER][COLOR=#EEEE00][ICODE]На рассмотрении...[/ICODE][/COLOR][/FONT][/CENTER][/B]',
      prefix: PIN_PREFIX,
      status: true,
    },
    {
      title: '| Не по форме |',
      content:
        "[B][CENTER][FONT=georgia][COLOR=#ff0000][ICODE]{{ greeting }} {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>" +
        "[B][CENTER][COLOR=lavender]Ваша жалоба составлена не по форме, пожалуйста ознакомьтесь с правилами подачи жалоб : [URL='https://forum.blackrussia.online/index.php?threads/Правила-подачи-жалоб-на-лидеров.3429391/']*Нажмите сюда*[/URL]<br>" +
        "[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br>" +
        '[B][CENTER][COLOR=RED][ICODE]Отказано[/ICODE][/COLOR][/FONT][/CENTER][/B]',
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
      title: '| Нет к теме |',
      content:
        "[B][CENTER][FONT=georgia][COLOR=#ff0000][ICODE]{{ greeting }} {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>" +
        "[B][CENTER][COLOR=lavender]Ваше сообщение никоим образом не относится к предназначению данного раздела.<br>" +
        "[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br>" +
        '[B][CENTER][COLOR=RED][ICODE]Отказано[/ICODE][/COLOR][/FONT][/CENTER][/B]',
      prefix: CLOSE_PREFIX,
      status: false,
    },
  ];

})();