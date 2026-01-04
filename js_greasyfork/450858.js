// ==UserScript==
// @name         XRP Faucet
// @namespace    xrp faucet
// @version      0.11
// @description  Easy XRP Faucet
// @author       pybeth
// @match        https://patak.dropz.xyz/*
// @match        https://my.dropz.xyz/*
// @noframes
// @grant        window.close
// @grant        unsafeWindow

// @downloadURL https://update.greasyfork.org/scripts/450858/XRP%20Faucet.user.js
// @updateURL https://update.greasyfork.org/scripts/450858/XRP%20Faucet.meta.js
// ==/UserScript==


(function() {
    'use strict';


    //Reload the page after 3 minutes
    setTimeout(function(){
        window.location.reload();
    },180000);

    var windowName = "";
    var popUpWindow = "";
    var balanceMin = 50000;
    var balanceMax = 100000;

    var currentwindowOpenFunction = unsafeWindow.open;

    function newwindowOpenFunction(params1, params2) {

        if (!params2 || params2 == "_blank") {
            windowName = "popUpWindowMyDropz";
        } else {
            windowName = params2;
        }

        return currentwindowOpenFunction(params1, windowName);
    };

    unsafeWindow.open = newwindowOpenFunction;

    unsafeWindow.onbeforeunload = function() {
        currentwindowOpenFunction('', windowName).close();

    };


    function endsWithNumber( str ){
        return isNaN(str.slice(-1)) ? false : true;
    }


    var clicked = false;

    setInterval(function(){

        if(unsafeWindow.name == "dropzemailVerificationWindow" && window.location.href.includes("https://my.patak.dropz.xyz/transactions")){
       // if(window.location.href.includes("patak.dropz.xyz/transactions")){
            unsafeWindow.close();
        }

        for(let i=0; i< document.querySelectorAll(".btn.btn-info").length; i++){

            if(!clicked && !endsWithNumber(document.querySelectorAll(".btn.btn-info")[i].getAttribute('id')) &&
               !document.querySelectorAll(".btn.btn-info")[i].innerText.includes("Submits")){
                document.querySelectorAll(".btn.btn-info")[i].click();
                break;
            }

        }

        for(var hc=0; hc < document.querySelectorAll("iframe").length; hc++){
            if(!clicked && document.querySelectorAll("iframe")[hc] &&
               document.querySelectorAll("iframe")[hc].hasAttribute("data-hcaptcha-response") &&
               document.querySelectorAll("iframe")[hc].getAttribute("data-hcaptcha-response").length > 0) {
                for(let i=0; i< document.querySelectorAll(".btn.btn-info").length; i++){
                    if(!clicked && !endsWithNumber(document.querySelectorAll(".btn.btn-info")[i].getAttribute('id')) &&
                       document.querySelectorAll(".btn.btn-info")[i].innerText == "Submits"){
                        document.querySelectorAll(".btn.btn-info")[i].click();
                        clicked = true;
                        break;
                    }

                }

            }
        }

    },7000);

    function randomInteger(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }




})();