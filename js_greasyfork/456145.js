// ==UserScript==
// @name         Auto Claim com Auto Login para miningblocks.club
// @namespace    auto claim de criptomoedas
// @version      1.12.1
// @description  Script para auto claim :)
// @author       PepeMoreno
// @match        https://miningblocks.club/*
// @match        https://miningblocks.club/
// @icon         https://miningblocks.club/assets/img/criptos/block.png
// @grant        none
// @license      none
// @downloadURL https://update.greasyfork.org/scripts/456145/Auto%20Claim%20com%20Auto%20Login%20para%20miningblocksclub.user.js
// @updateURL https://update.greasyfork.org/scripts/456145/Auto%20Claim%20com%20Auto%20Login%20para%20miningblocksclub.meta.js
// ==/UserScript==

(function() {
    'use strict';
    ////MUDE O EMAIL E SENHA ABAIXO////
    var username = "INSIRA SEU EMAIL";////EMAIL AQUI////
    var password = "INSIRA SUA SENHA";////SENHA AQUI////
    var clicked = false;
    var address = false;
    if(document.querySelector("#main-slide") && (window.location.href.includes("https://miningblocks.club/"))) {
        window.location.replace("https://miningblocks.club/Auth/LogIn");
    }
    if(window.location.href.includes("https://miningblocks.club/Dashboard/Home")) {
        window.location.replace("https://miningblocks.club/Faucet/Claim");
    }

    setInterval(function() {
        if (document.querySelector("#txtCorreo")) {
            document.querySelector("#txtCorreo").value = username;
            address = true;
        }
        if (document.querySelector("#txtPassword")) {
            document.querySelector("#txtPassword").value = password;
            address = true;
        }
    }, 1000);
    setInterval(function() {
        if ((document.querySelector(".h-captcha > iframe").getAttribute("data-hcaptcha-response").length > 0)) {
            document.getElementsByClassName("btn btn-fill btn-wd")[0].click();
        }

        clicked = true;
    },6000);


    setInterval(function() {
        function isCaptchaChecked() {
            return grecaptcha && grecaptcha.getResponse().length !== 0;
        }

        if (isCaptchaChecked()) {
            document.getElementsByClassName("btn btn-lg btn-fill btn-success")[0].click();
            clicked = true;
        }
    }, 3000);

    setTimeout(function() {
        window.location.replace(window.location.pathname + window.location.search + window.location.hash);
    }, 2*60000);
})();