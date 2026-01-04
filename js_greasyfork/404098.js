// ==UserScript==
// @name         pregna
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  drukowanie przepisow
// @author       You
// @match        https://pregna.com.pl/przepisy-kulinarne/*
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/404098/pregna.user.js
// @updateURL https://update.greasyfork.org/scripts/404098/pregna.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.addEventListener ("keydown", function (zEvent) {
        if (zEvent.ctrlKey && zEvent.altKey && zEvent.key === "p") {
            $('.lead').hide();
            $('li').css('float', 'none');

            var divContents = document.getElementsByClassName("col-txt")[0].innerHTML;
            var a = window.open('', '');
            a.document.write('<html>');
            a.document.write('<title>'+document.title+'</title>');
            a.document.write('<body>');
            a.document.write(divContents);
            a.document.write('</body></html>');
            a.document.close();
            a.print();
            a.onafterprint = function(){
                a.close();
            }

            $('.lead').show();
        }
    } );


})();