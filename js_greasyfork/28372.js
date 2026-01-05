// ==UserScript==
// @name         Facebook AutoPoker
// @namespace    http://samboyer.co.uk/
// @version      0.1.1
// @description  Automagically repokes anyone that pokes you, for as long as the pokes page is open.
// @author       Sam Boyer
// @match        https://www.facebook.com/pokes*
// @require http://code.jquery.com/jquery-latest.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/28372/Facebook%20AutoPoker.user.js
// @updateURL https://update.greasyfork.org/scripts/28372/Facebook%20AutoPoker.meta.js
// ==/UserScript==

(function() {
    'use strict';
    setTimeout(function(){clickButtons();},500);
})();

(function clickButtons() {
    'use strict';
    //console.log("autoPoker tick");
    $( "a:contains('Poke back')").addClass('autoPokerPleaseClickThis');
    var els = document.getElementsByClassName('autoPokerPleaseClickThis');
    for(var i=0;i<els.length;i++){
        els[i].click();
    }
    setTimeout(function(){clickButtons();},2000);
})();