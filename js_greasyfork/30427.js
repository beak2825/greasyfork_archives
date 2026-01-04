// ==UserScript==
// @name         BOBBOB
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        http://tampermonkey.net/faq.php?ext=dhdg
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/30427/BOBBOB.user.js
// @updateURL https://update.greasyfork.org/scripts/30427/BOBBOB.meta.js
// ==/UserScript==


(function() {
    'use strict';
 console.log('RUN');
    if(window.location.href.indexOf("nw.ru.perfectworld") > -1){
    var a = getElementById('memories');
        
        a.style.display="none";
    console.log('RUN');
    }
})();