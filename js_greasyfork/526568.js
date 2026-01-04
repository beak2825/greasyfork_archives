// ==UserScript==
// @name        ourcoincash.xyz | Auto Claim Faucet unlimited
// @namespace   auto.claim.faucet
// @description https://ourcoincash.xyz/?r=113456
// @author      MSCS
// @version     1.0
// @icon        https://www.google.com/s2/favicons?sz=64&domain=ourcoincash.xyz
// @grant       unsafeWindow
// @grant       GM_openInTab
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       GM_xmlhttpRequest
// @grant       window.onurlchange
// @grant       window.close
// @license     MIT
// @match       https://ourcoincash.xyz/*
// @downloadURL https://update.greasyfork.org/scripts/526568/ourcoincashxyz%20%7C%20Auto%20Claim%20Faucet%20unlimited.user.js
// @updateURL https://update.greasyfork.org/scripts/526568/ourcoincashxyz%20%7C%20Auto%20Claim%20Faucet%20unlimited.meta.js
// ==/UserScript==

(function(){

    'use strict';

    var email = 'email@email.com';  // Type here your e-mail address
    var password ='password';  // Type here your password
    var dailyClaims = 500 ;  // Type here the amount of faucet claims you want to do
    var minimumWithdrawal = 1000 ; // (50,000) Type here the minimum withdrawal amount
    var Withdrawal = false ; // if you want to withdrawal
    var address = '33gwyCZzR1QE1cmJJcNYVrv1nEkq6i4JVb'; // Type here your address wallet
    var selecteCoin = 'Btc' ;  // Trx / Btc / Lte / Eth

//========================================================================================//
//========================================================================================//
//========================================================================================//

    function onDocumentReady(fn) {
        if (document.readyState != "loading") {
            fn();
        } else {
            document.addEventListener("DOMContentLoaded", fn);
        }
    }

    onDocumentReady(function(){

        let check_address = 'https://ourcoincash.xyz';
        function isCaptchaChecked() {return grecaptcha && grecaptcha.getResponse().length !== 0;}

        if(window.location.href.includes(check_address) && document.body.innerHTML.includes("Why Join Us?")){
            let loginButton = document.querySelector("a[class='btn btn-warning btn-lg']");
            setTimeout(function(){
                if(loginButton){
                    location.href = 'login'
                }
            },3000);
        }

        if(window.location.href == (check_address + '/login')){
            let login = setInterval(function(){
                let emailfield = document.querySelector("#email");
                let passfield = document.querySelector("#password");
                let submitButton = document.querySelector("button[type='submit']");

                if(emailfield && passfield && (emailfield.value !== email || passfield.value !== password)){
                    emailfield.value = email
                    passfield.value = password
                }
                if(emailfield.value == email && passfield.value == password && submitButton && isCaptchaChecked()){
                    submitButton.click();
                    clearInterval(login)
                }
            },3000);
        }

        if(window.location.href == (check_address + '/dashboard')){
            let balance = document.querySelector("p.acc-amount:not(i)").textContent.split(",")[0];
            let selectElement = document.querySelector("select#method");
            let inputWallet = document.querySelector("input#wallet");
            let WithdrawalButton = document.querySelector("button[class='btn btn-success mb-2 mr-2']");
            var selectedOption;
            if(selecteCoin == 'Trx'){selectedOption = 2;}else if(selecteCoin == 'Btc'){selectedOption = 7;}else if(selecteCoin == 'Lte'){selectedOption = 10;}else if(selecteCoin == 'Eth'){selectedOption = 9;}

            if(balance > minimumWithdrawal || balance == minimumWithdrawal){
                let autowithdrawal = setInterval(function(){
                    if(Withdrawal == true){
                        if(selectElement){
                            selectElement.value = selectedOption ;
                        }
                        if(inputWallet){
                            inputWallet.value = address ;
                        }
                        setTimeout(function(){
                            if(WithdrawalButton){
                                WithdrawalButton.click()
                                clearInterval(autowithdrawal)
                            }
                        },2000);
                    } else {
                        location.href = 'ptc'
                        clearInterval(autowithdrawal)
                    }
                },8000);

            }
            if(balance < minimumWithdrawal){
                setTimeout(function redir(){
                        location.href = 'ptc'
                },8000);
            }
        }

        if(window.location.href.includes(check_address + '/faucet')){
            let claim = setInterval(function(){
                let ablinks = document.querySelector("a#antibotlinks_reset")
                let button = document.querySelector("button[type='submit']:not([disabled])");
                let leftClaims = document.querySelectorAll("h4.lh-1.mb-1")[3].textContent.split("/")[0];
                let totalClaims = document.querySelectorAll("h4.lh-1.mb-1")[3].textContent.split("/")[1];

                if(leftClaims > (totalClaims - dailyClaims)){
                    if(!ablinks){
                        if(button && button.willValidate == true && isCaptchaChecked()){
                            button.click()
                            clearInterval(claim)
                        }
                    }
                    if(ablinks.style.display == ""){
                        if(button && button.willValidate == true && isCaptchaChecked()){
                            button.click()
                            clearInterval(claim)
                        }
                    }
                }
                if(leftClaims < (totalClaims - dailyClaims) || leftClaims == (totalClaims - dailyClaims)){
                    location.href = 'achievements'
                    clearInterval(claim)
                }

            },5000);
        }

        if(window.location.href == (check_address + '/ptc')){
            setTimeout(function(){
                let button = document.querySelector("div.card-body button.btn-primary");
                if(button){
                    button.onclick()
                }
                if(!button){
                    location.href = 'faucet'
                }
            },5000);

        }

        if(window.location.href.includes('/view/')){
            let view = setInterval(function(){
                let timer = document.querySelector('#ptcCountdown');
                let button = document.querySelector('form button#verify');
                if (button && isCaptchaChecked() && timer.textContent == '0 second'){
                    setTimeout(function(){
                        button.click()
                    },2000);
                    clearInterval(view)
                }
            },5000);
        }

        if(window.location.href == (check_address + '/achievements')){
            setTimeout(function(){
                let button = document.querySelector("form:not(.p-3) button[type='submit']:not([disabled])");
                if(button){
                    button.parentElement.submit()
                }
                if(!button){
                    location.href = 'auto'
                }
            },5000);
        }

        if(window.location.href == (check_address + '/auto')){
            let claim = setInterval(function(){
                let alertNtf = document.querySelector("div.alert");
                if(alertNtf && alertNtf.textContent.includes("enough ")){
                    location.href = 'dashboard'
                    clearInterval(claim)
                }
            },5000);
        }


        if(window.location.href.includes(check_address)){
            let ok = setInterval(function(){
            let confirmButton = document.querySelector("button[type='button'][class='swal2-confirm swal2-styled']");
                if(confirmButton){
                    confirmButton.click()
                    clearInterval(ok)
                }
            },1000);

        }

        if(!window.location.href ==(check_address + '/dashboard')){
            setTimeout(function(){
                location.reload();
            },5*60000);
        }

    });

})();