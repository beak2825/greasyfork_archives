// ==UserScript==
// @name         Hcaptcha Dogecoin Faucet
// @namespace    Claim Dogecoin
// @version      1.1
// @description  Claim Dogecoin
// @author       lotocamion
// @match        https://outdoge.faucet.cfd/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=faucet.cfd
// @grant        none
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/446001/Hcaptcha%20Dogecoin%20Faucet.user.js
// @updateURL https://update.greasyfork.org/scripts/446001/Hcaptcha%20Dogecoin%20Faucet.meta.js
// ==/UserScript==

//EARN SOME CRYPTO USING THE LINK BELOW//

//https://galerybits.com/?r=867//
//https://coinsstar.ga/?r=148//
//https://coins100s.fun/?r=269//
//https://javafaucet.com/?r=443//


    (function() {
    'use strict';

    var clicked = false;

    var address = false;
    if($('.form-control')) {
    $('.form-control').val("lotocamion@gmail.com");////YOUR FAUCETPAY EMAIL /////EXAMPLE//
    address = true;
    }
    if ((document.getElementsByClassName("btn btn-common btn-effect")[0])
    && (window.location.href.includes("https://outdoge.faucet.cfd/?r=lotocamion@gmail.com"))) {
    document.getElementsByClassName("btn btn-common btn-effect")[0].click();
    }
    if (( document.querySelector("#contact > div > div > div.col-lg-6.col-md-6.col-xs-12 > center > center > form:nth-child(3) > a"))
    && (window.location.href.includes("https://outdoge.faucet.cfd/faucet"))) {
    document.querySelector("#contact > div > div > div.col-lg-6.col-md-6.col-xs-12 > center > center > form:nth-child(3) > a").click();
    }
    setInterval(function() {
    for(var hc=0; hc < document.querySelectorAll("iframe").length; hc++){
    if(! clicked && document.querySelectorAll("iframe")[hc] &&
    document.querySelectorAll("iframe")[hc].getAttribute("data-hcaptcha-response") &&
    document.querySelectorAll("iframe")[hc].getAttribute("data-hcaptcha-response").length > 0) {
    document.getElementsByClassName("btn btn-common btn-effect")[0].click();
    clicked = true;
    }
    } }, 25000);
    })();