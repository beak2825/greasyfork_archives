// ==UserScript==
// @name         playnanoForMe
// @namespace    ekaraman89@hotmail.com
// @version      1.0.6
// @description  play nano sitesinden otomatik gecis
// @author       ekaraman ekaraman89@hotmail.com
// @match        https://playnano.online/watch-and-learn/*
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery-scrollTo/2.1.2/jquery.scrollTo.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/410202/playnanoForMe.user.js
// @updateURL https://update.greasyfork.org/scripts/410202/playnanoForMe.meta.js
// ==/UserScript==

(function() {
    'use strict';
setInterval(function(){
    if(window.location.pathname!=='/watch-and-learn/nano/captcha')
    {
        $(window).scrollTo('+=50px')
    }
    }, 500);
   var interval = setInterval(function(){
    var addblock =$('#adblock-detected-modal');
    if(addblock!=undefined &&(!window.bab||!window.dfp_c||!window.gab_c)) location.reload();
       if(!$($('.watch-next-btn')[0]).prop('disabled'))
       {
           clearInterval( interval );
           $($('.watch-next-btn')[0]).click();
       }
    }, 1500);
})();