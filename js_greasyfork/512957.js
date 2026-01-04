// ==UserScript==
// @name         Hentasis Lite
// @description  Удаление лишних элементов на сайте
// @match        http://hentasis1.top/*
// @match        http://hentasis1.top/*
// @run-at       document-end
// @version      1.0
// @author       3BAH
// @grant        none
// @namespace 
// @downloadURL https://update.greasyfork.org/scripts/512957/Hentasis%20Lite.user.js
// @updateURL https://update.greasyfork.org/scripts/512957/Hentasis%20Lite.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.getElementsByClassName("logotype")[0].remove();
})();

(function() {
    'use strict';


document.getElementsByClassName("show-rside")[0].remove();
})();

(function() {
    'use strict';

    document.getElementsByClassName("head-line")[0].remove();
})();