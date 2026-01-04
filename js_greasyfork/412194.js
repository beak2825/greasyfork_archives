// ==UserScript==
// @name         AutoAcc
// @namespace    http://tampermonkey.net/
// @version      0.11
// @description  try to take over the world!
// @author       You
// @match        https://store.steampowered.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/412194/AutoAcc.user.js
// @updateURL https://update.greasyfork.org/scripts/412194/AutoAcc.meta.js
// ==/UserScript==

(function() {
    var ccase = setInterval(function(){
        if(document.querySelector('#reenter_email')){
            document.querySelector('#reenter_email').value=document.querySelector('#email').value;
        }
        if(document.querySelector('#i_agree_check')){
            document.querySelector('#i_agree_check').checked=true;
            document.querySelector('#instructions').hide();
            document.querySelector('#ssa_box').hide();
            document.querySelector('#g-recaptcha-response').setAttribute('style','width: 500px; height: 100px; border: 1px solid rgb(193, 193, 193); padding: 0px;')

        }
        if(document.querySelector('#reenter_password')){
            document.querySelector('#reenter_password').value = document.querySelector('#password').value;
        }

        if(window.location.href.indexOf('created_account=1')>0){
            window.location.href='https://store.steampowered.com/account/';
        }
    },100);
})();