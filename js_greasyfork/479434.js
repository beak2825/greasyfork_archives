// ==UserScript==
// @name         Бюро книги, подсветка якорей
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Код подсвечивает интерактивные абзацы. Даёт понять, когда надо проскроллить и увидеть связанный с абзацем или словом медиа-контент
// @author       You
// @license      MIT
// @match        *bureau.ru/books/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bureau.ru
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/479434/%D0%91%D1%8E%D1%80%D0%BE%20%D0%BA%D0%BD%D0%B8%D0%B3%D0%B8%2C%20%D0%BF%D0%BE%D0%B4%D1%81%D0%B2%D0%B5%D1%82%D0%BA%D0%B0%20%D1%8F%D0%BA%D0%BE%D1%80%D0%B5%D0%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/479434/%D0%91%D1%8E%D1%80%D0%BE%20%D0%BA%D0%BD%D0%B8%D0%B3%D0%B8%2C%20%D0%BF%D0%BE%D0%B4%D1%81%D0%B2%D0%B5%D1%82%D0%BA%D0%B0%20%D1%8F%D0%BA%D0%BE%D1%80%D0%B5%D0%B9.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle(`
      .js__anchor .anchor-in {
     background: #fffef5;
    border: 1px solid #f9f6e4;
    border-radius: 3px;
      }
    `);

    // Your code here...
})();