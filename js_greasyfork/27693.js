// ==UserScript==
// @name         Social Ingot
// @namespace    https://greasyfork.org/en/users/95954
// @version      1.3
// @description  Automation
// @author       Ａ ｅ ｓ ｔ ｈ ｅ ｔ ｉ ｃ ｓ
// @icon            http://i.imgur.com/FhCT7Ke.png
// @icon64URL       http://i.imgur.com/8VRBwr7.png
// @include	       http://*.socialingot.com/*
// @include	       https://api.socialingot.com/*
// @downloadURL https://update.greasyfork.org/scripts/27693/Social%20Ingot.user.js
// @updateURL https://update.greasyfork.org/scripts/27693/Social%20Ingot.meta.js
// ==/UserScript==
setInterval(function() {
    var z = document.getElementsByClassName('timer');
    var a1 = document.getElementById('step_message_text').textContent;
    if(z[0].textContent == ':00')
    {
        document.getElementById('step_message_text').click();
        document.getElementById('step_message').click();
    }
    if (a1=="CONGRATS! YOU'RE DONE!")
    {
        window.close();
    }
}, Math.floor(Math.random() * 6000) + 2000);

// Check if the offer is not available at the moment and if it isn't close window
function offercheck(){
var dealcheck = document.getElementsByClassName('alert alert-danger');
var dealcheckstr = dealcheck[0].textContent;
if(dealcheckstr.indexOf("Deal Unavailable")>=0){window.close();}
}