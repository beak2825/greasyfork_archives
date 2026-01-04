// ==UserScript==
// @name         Yandex.com ➜ Yandex.ru redirect
// @namespace    yandex.com
// @version      2025-06-28
// @description  Redirect alles van yandex.com naar yandex.ru
// @author       You
// @match        https://yandex.com/*
// @match        https://www.yandex.com/*
// @run-at       document-start
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/542501/Yandexcom%20%E2%9E%9C%20Yandexru%20redirect.user.js
// @updateURL https://update.greasyfork.org/scripts/542501/Yandexcom%20%E2%9E%9C%20Yandexru%20redirect.meta.js
// ==/UserScript==

(function () {
  'use strict';

  if (location.hostname.endsWith('yandex.com')) {
    const newUrl = location.href.replace('yandex.com', 'yandex.ru');
    window.location.replace(newUrl);
  }
})();
