// ==UserScript==
// @name       SBI CARD
// @namespace   ANAND K
// @include     https://securepayments.fssnet.co.in/pgwayb/*
// @description csc
// @version     2.5
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/29943/SBI%20CARD.user.js
// @updateURL https://update.greasyfork.org/scripts/29943/SBI%20CARD.meta.js
// ==/UserScript==
/* SBI Debit Card   */

    
        function sb(){    
                card_num = document.getElementById('debitCardNumber');
                if(card_num != null)
                {
                    card_num.value="***********"
                    exp_mon = document.getElementById('debiMonth');
                    exp_mon.value="****";
                    exp_year = document.getElementById('debiYear');
                    exp_year.value="****";
                    card_name=document.getElementById('debitCardholderName');
                    card_name.value="******";
                    card_pin=document.getElementById('cardPin');
                    card_pin.value="****";
                    captcha_txt=document.getElementById('passline');
                    captcha_txt.focus();
            }}
            sb();
    
