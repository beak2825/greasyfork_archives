// ==UserScript==
// @name         TextFixWdfiles.ru
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Фикс текста для сайта WDfiles.ru
// @author       You
// @match        http://wdfiles.ru/account_home.html
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/387885/TextFixWdfilesru.user.js
// @updateURL https://update.greasyfork.org/scripts/387885/TextFixWdfilesru.meta.js
// ==/UserScript==

(function() {
     document.body.style.fontSize = "95%";
})();