// ==UserScript==
// @name         nanoCaptcha
// @namespace    ekaraman89@hotmail.com
// @version      1.0.0
// @description  play nano sitesinden captha sonrasi otomatik tiklama
// @author       ekaraman ekaraman89@hotmail.com
// @match        https://playnano.online/watch-and-learn/nano/captcha
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/411215/nanoCaptcha.user.js
// @updateURL https://update.greasyfork.org/scripts/411215/nanoCaptcha.meta.js
// ==/UserScript==

(function() {
    'use strict';
   var interval = setInterval(function(){
       var popup = $("div[style='display: block !important;']");
       if(popup !=undefined)
           popup.remove();

      var capthaOk=$('#g-recaptcha-response').val();
       if(capthaOk!="")
       {
           clearInterval( interval );
           $('.button')[0].click();
       }
    }, 500);

})();