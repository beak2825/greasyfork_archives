// jscs:disable
// ==UserScript==
// @name         Premium
// @namespace    https://*.waysofhistory.com/
// @version      0.1
// @description  premium
// @author       menya
// @match        https://*.waysofhistory.com/*
// @exclude      https://ruforum.waysofhistory.com/
// @exclude      https://ru.waysofhistory.com/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/22717/Premium.user.js
// @updateURL https://update.greasyfork.org/scripts/22717/Premium.meta.js
// ==/UserScript==

(function () {
  // Сделаем себе царь-аккаунт
  Account.prototype.isPremium = function () {
    return true;
  };
})();