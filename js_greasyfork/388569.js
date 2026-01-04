// ==UserScript==
// @name         SMS TACTV
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  TACTV
// @author       You
// @match        http*://sms.tactv.in/index.php/customer/*
// @match        http*://sms.tccl.co.in/index.php/customer/*

// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/388569/SMS%20TACTV.user.js
// @updateURL https://update.greasyfork.org/scripts/388569/SMS%20TACTV.meta.js
// ==/UserScript==

(function() {
    'use strict';
    setInterval(function() {
        $('.ed').val($('.sd').val());

    }, 200);
$(document).ready(function(){

   $('.myInputChannels').focus();
    $('#search_stb').attr('tabIndex', '1');
    $('.myInputChannels').attr('tabIndex', '2');
    $('.ed').removeAttr('readonly');
    $('.accordion-close').click();


    $('.ed').removeAttr('disabled');
    setTimeout(function() {
    $('.package_1').click();

    }, 1000);
    setTimeout(function() {
        $('.ed').val($('.sd').val());

    }, 1000);
$( ".sd" ).click(function() {
    setTimeout(function() {
        $('.ed').val($('.sd').val());

    }, 10);});


});
    setTimeout(function() {
        $('.alertify-ok').click();
document.getElementById("package_1").click();
//        document.getElementById('deactivate_service').click();
//document.getElementById("serial_number_1").click();
}, 2000);
    setInterval(
  function() {
      document.getElementById("deactivation_reason").value= 6;
      document.getElementById("alertify-ok").click();
      //document.getElementById("deactivate_service").click();
         document.getElementById('deactivate_service').onclick = function() {

            document.getElementById("deactivation_reason").value= 6;
                         if ($('.ui-button-text').val() == 'Save');
                {
                    $('.ui-button-text').click();
                }
};
}, 1500);
        window.onkeyup = function(e) {
        //var gonext = document.getElementById("sevacal_continue");
        var gonext = document.getElementById("sedavailability_contiune");
        //var up = document.getElementById("sedavailability_contiune");
        //var down = document.getElementsByClassName('tkts_dwnarw')[0];
            var sdt = $('.sd').val();
            var edt = $('.ed').val();
        var key = e.keyCode ? e.keyCode : e.which;
        if (key == 9) {
            document.getElementById("hidden_savePlugins").click();
        } else if (key == 68) {
            document.getElementById("deactivate_service").click();
                    setTimeout(function() {
                    document.getElementById("deactivation_reason").value= 6;
                            }, 1000);
        } else if (key == 192) {
            document.getElementById("alertify-ok").click();
        } else if (key == 77) {
            document.getElementById("alertify-ok").click();
            document.getElementById("serial_number_1").click();
                    $('.ed').removeAttr('disabled');
        setTimeout(function() {
        $('.ed').val($('.sd').val());
            if (sdt == edt) {
            $('.qty').hide();
                document.getElementById("hidden_savePlugins").click();
            }
    }, 1000);
        setTimeout(function() {
            $('#alertify-ok').click();
    }, 2000);
        } else if (key == 78) {
                          document.getElementById("hidden_savePlugins").click();
        } else if (key == 81) {
            window.close();
        } else if (key == 109) {
            down.click();
        } else if (key == 18) {
            document.getElementById("datepicker_from_1").click();
        } else if (key == 188) {
                                     if ($('.ui-button-text').val() == 'Save');
                {
                    $('.ui-button-text').click();
                }
                                     if ($('.ui-button-text').val() == 'Deactivate');
                {
                    $('.ui-button-text').click();
                }
        }
    };
})();