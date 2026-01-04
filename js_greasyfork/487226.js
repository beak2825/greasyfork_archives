

    // ==UserScript==
    // @name         Autodarts - Next_Leg_Automatic
    // @namespace    http://tampermonkey.net/
    // @version      v1.2
    // @description  Starts automatically the next leg after 6 sec
    // @author       benebelter
    // @match        https://play.autodarts.io/*
    // @icon         https://www.google.com/s2/favicons?sz=64&domain=autodarts.io
    // @require      http://code.jquery.com/jquery-3.4.1.min.js
    // @run-at       document-end
    // @license      MIT 
// @downloadURL https://update.greasyfork.org/scripts/487226/Autodarts%20-%20Next_Leg_Automatic.user.js
// @updateURL https://update.greasyfork.org/scripts/487226/Autodarts%20-%20Next_Leg_Automatic.meta.js
    // ==/UserScript==
     
    (function() {
    'use strict';
     
    const sekunden = 6;
     
    var interval = setInterval(function() {
         var buttontext = $("button:contains('Next Leg')").text();
     
         if(buttontext == "Next Leg") {
            $("button:contains('Next Leg')").append('&nbsp;<span id="timer">'+sekunden+'</span>');
             var countdown = setInterval(function() {
                        var time = parseInt($('#timer').html());
                        $('#timer').html(time - 1);
                        if (time == 0) {
                            clearInterval(countdown);
                            $('#timer').remove();
                            $("button:contains('Next Leg')").trigger('click');
     
                        }
                    }, 1000);
           }
     
        $('.css-rzdgh7,.css-zsaruk').on("click",  function(){
     
            clearInterval(countdown); // counter abbrechen/reset
    });
     
        $("button:contains('Undo'),button:contains('Next Leg')").on( "click", function() {
     
        clearInterval(countdown); // counter abbrechen/reset
        })
     
     }, 3000);
     
    })();

