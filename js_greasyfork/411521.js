// ==UserScript==
// @name         do not translate code
// @namespace    极客青年
// @version      0.1
// @description  hahaha!
// @author       Geek
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/411521/do%20not%20translate%20code.user.js
// @updateURL https://update.greasyfork.org/scripts/411521/do%20not%20translate%20code.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var pres = document.getElementsByTagName('pre');
    if(pres && pres.length > 0) {
        for(var i = 0; i < pres.length; i++) {
            pres[i].classList.add('notranslate');
        }
    }
})();
