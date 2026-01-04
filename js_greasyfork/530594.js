// ==UserScript==
// @name         lnscratch.com
// @description  auto claim
// @version      1.0
// @author       WXC
// @match        https://lnscratch.com/*
// @grant        none
// @require      https://code.jquery.com/jquery-latest.min.js
// @run-at document-idle
// @noframes
// @namespace https://greasyfork.org/users/713625
// @downloadURL https://update.greasyfork.org/scripts/530594/lnscratchcom.user.js
// @updateURL https://update.greasyfork.org/scripts/530594/lnscratchcom.meta.js
// ==/UserScript==


// best work with ALBY extension iokeahhehimjnekafflcihljlcjccdbe and linked BLINK.SV lightning wallet

(function() {
    'use strict';


    $(document).ready(function() {


        if( $("span:contains('EMPTY')").is(":visible")) {
            $(".has-border-color").css("background-color","#808080"); // winner
            document.title = "EMPTY";
        }

        else if( $("p:contains('out of tries')").is(":visible")) {
            $(".has-border-color").css("background-color","#808080"); // winner
            document.title = "OUT OF TRIES";
        }

        else {

            if( $("#sos_saw_card_0").is(":visible") ) {

                var backgroundImageUrl = $("#sos_saw_card_0").css("background-image");
                console.log(backgroundImageUrl);
                //alert( backgroundImageUrl );


                if (backgroundImageUrl.includes("win")) {
                    $(".has-border-color").css("background-color","#55ff55"); // winner
                    $("h5").text( backgroundImageUrl );
                    document.title = "WINNER";
                }


                // lnscratch.com/wp-content/uploads/2023/04/rubbellos400xloser-1.jpg
                if (backgroundImageUrl.includes("loser")) {
                    $(".has-border-color").css("background-color","#ff5555"); // loser
                    $("h5").text( backgroundImageUrl );
                    document.title = "LOSER";
                    location.reload();
                }

            }

        }


    });

})();