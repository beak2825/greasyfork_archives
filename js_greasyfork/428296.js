// ==UserScript==
// @name         Filmix Remove Adblock Message
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Filmix Remove Adblock Message. JQuery is used.
// @author       Somm
// @include      *://filmix.*
// @grant        none
// @require http://code.jquery.com/jquery-3.5.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/428296/Filmix%20Remove%20Adblock%20Message.user.js
// @updateURL https://update.greasyfork.org/scripts/428296/Filmix%20Remove%20Adblock%20Message.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var counter = 0;

    var interval = setInterval(function(){
        counter++;
        if($('pjsdiv:contains("Просмотр без ограничений доступен")').length || counter === 50){
            $('pjsdiv:contains("Просмотр без ограничений доступен"):last').parent().remove();
            clearInterval(interval);
        }
    }, 200);

}
)();