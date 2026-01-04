// ==UserScript==
// @name         yunfile
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        *://*.dfpan.com/*
// @match        *://*.yunfile.com/*
// @require      https://code.jquery.com/jquery-latest.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery-cookie/1.4.1/jquery.cookie.js
// @run-at      document-end
// @grant unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/31883/yunfile.user.js
// @updateURL https://update.greasyfork.org/scripts/31883/yunfile.meta.js
// ==/UserScript==

(function() {
    'use strict';

    $(function(){
        if (typeof show_vcode === "function") {
            show_vcode();
        }
        var wait = 32;
        var timer;
        function downpage(){
            //$.cookie('JSESSIONID', '5A959E2235C0DC9D14FC2BC110F' + Math.floor(Math.random() * (99999-10000+1)+10000), { path: '/'});
            var n = $('#slow_button').val();
            if (n > 1)
            {
                $('#slow_button').val(n - 1);
            }else{
                clearInterval(timer);
               // $.cookie('JSESSIONID', '5A959E2235C0DC9D14FC2BC110F' + Math.floor(Math.random() * (99999-10000+1)+10000), { path: '/'});
                redirectDownPage();
            }
        }
        $('#slow_button').attr('onclick', '').on('click', function(){
            $('#slow_button').val(wait);
            timer = setInterval(downpage , 1000);
        });
        $('#downbtn').html('Download').on('click', function(){
            startTime = Date();
            downSubmit(1);
        });
        unsafeWindow.doDownload = function(){
            startTime = Date();
            return true;
        };
    });
    // Your code here...
})();
