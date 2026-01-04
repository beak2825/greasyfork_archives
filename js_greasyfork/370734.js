// ==UserScript==
// @namespace    https://greasyfork.org/ja/users/199792
// @name         DLsite search helper
// @description  DLsite検索で未購入作品のみを表示
// @version      0.1.0
// @match        http://www.dlsite.com/*
// @match        https://www.dlsite.com/*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/370734/DLsite%20search%20helper.user.js
// @updateURL https://update.greasyfork.org/scripts/370734/DLsite%20search%20helper.meta.js
// ==/UserScript==

'use strict';

NodeList.prototype[Symbol.iterator] = Array.prototype[Symbol.iterator];

(function() {
  const table = document.querySelector('div#search_result_list table.n_worklist');
  const rows  = table.querySelectorAll('tr');

  for(const row of rows) {
    const button_dl = row.querySelector('a.btn_dl');
    if(button_dl) {
      row.style.display = 'none';
    }
  }
})();
