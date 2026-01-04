// ==UserScript==
// @name         Kickasstraffic
// @icon         https://kickasstraffic.com/assets/img/favicon.ico
// @namespace    https://helpercoins.blogspot.com/
// @version      1
// @description  Go to https://anon.to/VGgPPZ - enter yout bitcoin adress, complete captcha and the bot starts
// @author       Helpercoins.blogspot.com
// @match        http://kickasstraffic.com/surf
// @downloadURL https://update.greasyfork.org/scripts/370318/Kickasstraffic.user.js
// @updateURL https://update.greasyfork.org/scripts/370318/Kickasstraffic.meta.js
// ==/UserScript==

(function() {
    'use strict';
    if($(".btn.btn-danger:contains('Close')").length === 1)
        $(".btn.btn-danger:contains('Close')")[0].click();
    if($("#captchaSelector").length === 1) {
        $("#captchaSelector").focus();

        setInterval( function(){
            var el =  $('#adcopy_response');
            if(el.length > -1) {
                setTimeout( function() {
                    $('#adcopy_response').focus();
                }, 2000);
            }
        }, 1000);
    }

    setInterval( function() {
        var time = parseInt($('#counter').text().split(' ')[2]);
        setInterval( function() {
            if(time === 0)
                $(".btn.btn-primary.btn-block:contains('Next Website')")[0].click();
        }, 1000);
    }, 1000);

})();