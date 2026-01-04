// SPDX-License-Identifier: MIT-0

// ==UserScript==
// @name        Highlight older messages on linux.org.ru
// @name:ru     Highlight older messages on linux.org.ru
// @description:ru Скрипт подсвечивает сообщения, написанные более 30 дней назад.
// @version     2.0.1
// @license     MIT-0
// @supportURL  https://www.linux.org.ru/forum/development/14370848
// @grant       none
// @include     https://www.linux.org.ru/*
// @run-at      document-end
// @namespace https://greasyfork.org/users/31926
// @description Скрипт подсвечивает сообщения, написанные более 30 дней назад.
// @downloadURL https://update.greasyfork.org/scripts/396045/Highlight%20older%20messages%20on%20linuxorgru.user.js
// @updateURL https://update.greasyfork.org/scripts/396045/Highlight%20older%20messages%20on%20linuxorgru.meta.js
// ==/UserScript==

/* jshint esversion: 6 */

(function () {
  // Configurables.
  const old_message_age = 30; // Days.
  const old_message_background = '#000000';
  // -------------

  document.querySelectorAll('div.sign time').forEach(function (element) {
    const element_datetime = Date.parse(element.attributes.datetime.value);
    const age_in_seconds = (Date.now() - element_datetime) / 1000;
    const age_in_days = age_in_seconds / 3600 / 24;
    
    if (age_in_days > old_message_age) {
      element.closest('article').style.background = old_message_background;
    }
  });
})();