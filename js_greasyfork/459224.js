// ==UserScript==
// @name         Reload przy reklamie
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Przeładowuje stronę po wykryciu pełnej reklamy WP
// @author       walker
// @match        https://forum.benchmark.pl/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=benchmark.pl
// @grant        none
// @license      none
// @downloadURL https://update.greasyfork.org/scripts/459224/Reload%20przy%20reklamie.user.js
// @updateURL https://update.greasyfork.org/scripts/459224/Reload%20przy%20reklamie.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var czekanko = setInterval(()=>{
        if (document.querySelectorAll("#ipsLayout_header").length==0){
            location.reload()
            clearInterval(czekanko);
        }
    }, 1); //konfigurowalny czasik

})();