// ==UserScript==
// @name         Кураторы форума Moscow (Улучшенное оформление)
// @namespace    https://forum.blackrussia.online
// @version      3.3
// @description  Улучшенный стиль оформления скрипта
// @author       I. Lis
// @match        https://forum.blackrussia.online/threads/*
// @include      https://forum.blackrussia.online/threads/
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/529632/%D0%9A%D1%83%D1%80%D0%B0%D1%82%D0%BE%D1%80%D1%8B%20%D1%84%D0%BE%D1%80%D1%83%D0%BC%D0%B0%20Moscow%20%28%D0%A3%D0%BB%D1%83%D1%87%D1%88%D0%B5%D0%BD%D0%BD%D0%BE%D0%B5%20%D0%BE%D1%84%D0%BE%D1%80%D0%BC%D0%BB%D0%B5%D0%BD%D0%B8%D0%B5%29.user.js
// @updateURL https://update.greasyfork.org/scripts/529632/%D0%9A%D1%83%D1%80%D0%B0%D1%82%D0%BE%D1%80%D1%8B%20%D1%84%D0%BE%D1%80%D1%83%D0%BC%D0%B0%20Moscow%20%28%D0%A3%D0%BB%D1%83%D1%87%D1%88%D0%B5%D0%BD%D0%BD%D0%BE%D0%B5%20%D0%BE%D1%84%D0%BE%D1%80%D0%BC%D0%BB%D0%B5%D0%BD%D0%B8%D0%B5%29.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const ACCСEPT_PREFIX = 8; // Префикс для "Одобрено"
  const UNACCСEPT_PREFIX = 4; // Префикс для "Отказано"

  const buttons = [
    {
      title: '💬 Приветствие',
      content: '[FONT=Courier New][CENTER][COLOR=#00FF00]✦ Добро пожаловать, уважаемый {{ user.mention }}! ✦[/COLOR][/CENTER][/FONT]',
    },
    {
      title: '❌ Отказано',
      content: '[CENTER][COLOR=Red]⛔ Ваша заявка была отклонена.[/COLOR][/CENTER]',
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
    {
      title: '✅ Одобрено',
      content: '[CENTER][COLOR=LimeGreen]✔ Ваша заявка была одобрена.[/COLOR][/CENTER]',
      prefix: ACCСEPT_PREFIX,
      status: false,
    },
    {
      title: '📌 Закреплено',
      content: '[CENTER][COLOR=#FFD700]📌 Важное объявление закреплено.[/COLOR][/CENTER]',
      status: false,
    },
  ];

  console.log("Скрипт 'Кураторы форума Moscow' (улучшенная версия) загружен.");

})();
