// ==UserScript==
// @name         auto kktix script for ticket qty=2
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  auto kktix script
// @author       You
// @match        https://kktix.com/events/*/registrations/new*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=kktix.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/456565/auto%20kktix%20script%20for%20ticket%20qty%3D2.user.js
// @updateURL https://update.greasyfork.org/scripts/456565/auto%20kktix%20script%20for%20ticket%20qty%3D2.meta.js
// ==/UserScript==

var ticketBoxIds = ['ticket_528041'];
var ticketBoxAddButton = ".btn-default.plus";
var ticketQty = [2];

var startingTime = new Date().getTime();

// Load the script
var script = document.createElement("SCRIPT");
script.src = 'https://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js';
script.type = 'text/javascript';
document.getElementsByTagName("head")[0].appendChild(script);

var loop = setInterval(checkDomReady,1);

function checkDomReady(){
    if(document.getElementById(ticketBoxIds[0]) !== null ){
        clearInterval(loop);

        // check is salable
        var ticketbox = document.getElementById(ticketBoxIds[0]);
        var qty = ticketbox.getElementsByClassName('ticket-quantity');
        var warningBox = $('.register-status.register-status-OUT_OF_STOCK');

        if(qty[0].innerText == '尚未開賣' || !warningBox.hasClass('hide')){
            location.reload();
        }

        //add ticket
        ticketBoxIds.forEach(function(ticketBoxId,index){
            for (let i = 0; i <ticketQty[index]; i++) {
                $('#'+ticketBoxId).find(ticketBoxAddButton).trigger('click');
            }
        });

        //check person agree terms
        $('#person_agree_terms').click();

        //send submit
        var submitButton = $(".form-actions button.btn");
        var loopSubmit = setInterval(function() {
            var buttonDisabled = submitButton.hasClass("btn-disabled-alt");
            var buttonSending = submitButton.prop('disabled');
            if( !buttonDisabled || !buttonSending ){
                submitButton.click();
            };
        },1000);
    }
};





