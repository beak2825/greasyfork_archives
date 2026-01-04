// ==UserScript==
// @icon         https://www.mybithouse.com/favicon.png
// @name         mybithouse
// @namespace    iquaridys
// @version      2.0
// @description  Auto claim @15 min, just run dont close.
// @author       iquaridys
// @match        https://www.mybithouse.com/faucet.php
// @require      https://ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/33272/mybithouse.user.js
// @updateURL https://update.greasyfork.org/scripts/33272/mybithouse.meta.js
// ==/UserScript==

$(document).ready(function(){
    setTimeout(function(){window.location.href = window.location.href;},897654);
    var SUM;
    var Num1 = $('#captchanbr1').val();
    var iNum1 = parseInt(Num1);
    var Num2 = $('#captchanbr2').val();
    var iNum2 = parseInt(Num2);
    var Operation = $('#captchaopt').val();
    if(Operation == '+'){
        SUM = iNum1 + iNum2;
    }
    else
    {
        SUM = iNum1 - iNum2;
    }
    $('#captchaResult').val(SUM);
    document.getElementsByClassName("btn btn-lg btn-warning")[0].click();
    var refresh = setInterval(function(){
        if($(".fa fa-btc").val() !== ""){
        window.location.href = window.location.href;
        clearInterval(refresh);
        }
    }, 1000);
});