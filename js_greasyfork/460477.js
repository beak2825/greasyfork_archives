// ==UserScript==
// @name         faucet ustd
// @namespace    Wagner
// @version        1.0
// @description     wagner
// @author       s
// @match        https://faucetparty.unclecommon.com/usdt/page/faucet/*
// @icon         https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRTeWWgvhl6dHfpaBrjpYRCGFDQKfqACxjXEiFql71RPdMHhcnOIyoixL2GSjP7K9LR_MU&usqp=CAU
// @grant        none

// @downloadURL https://update.greasyfork.org/scripts/460477/faucet%20ustd.user.js
// @updateURL https://update.greasyfork.org/scripts/460477/faucet%20ustd.meta.js
// ==/UserScript==
(function() {
    'use strict';

    function isCaptchaChecked() {
       return grecaptcha && grecaptcha.getResponse().length !== 0;}

 setInterval(function() {if (isCaptchaChecked()){
                setTimeout(isCaptchaChecked, 15000);
                document.querySelector(".btn.btn-primary.btn-block").click();}}, 5000);

})();