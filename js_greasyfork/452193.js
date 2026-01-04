// ==UserScript==
// @name         _Test
// @namespace    mailto:azuzula.cz@gmail.com
// @version      0.6
// @description  test
// @author       Zuzana Nyiri
// @match        */admin/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/452193/_Test.user.js
// @updateURL https://update.greasyfork.org/scripts/452193/_Test.meta.js
// ==/UserScript==

(function() {
    'use strict';
 $(".navigation").prepend('Test userscript verze ' + GM_info.script.version);
//nový kód
})();