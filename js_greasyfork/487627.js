// ==UserScript==
// @name         website treaw
// @namespace    Claim Free USDT
// @version      0.1
// @description  Claim Free trpn
// @author       scriptcoinsbotfaucet
// @match        https://treaw.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=treaw.com
// @grant        none
// @license      CopyLeft
// @downloadURL https://update.greasyfork.org/scripts/487627/website%20treaw.user.js
// @updateURL https://update.greasyfork.org/scripts/487627/website%20treaw.meta.js
// ==/UserScript==


//INSTALL THE SCRIPT AND HCAPTCHA SOLVER AND EDIT LINE 20 WITH YOUR FAUCETPAY ADDRESS

(function() {
    'use strict';

    var blockList = [
        "treaw.com##.captcha-adspace",
        "treaw.com##.top_adspace"
    ];
    var windowHostname = window.location.hostname;
    for(var i = 0; i < blockList.length; i++) {
        var entryParts = blockList[i].split('##');
        if(windowHostname === entryParts[0]) {
            var matchedElements = document.querySelectorAll(entryParts[1]);
            for(var j = 0; j < matchedElements.length; j++) {
                var matchedElem = matchedElements[j];
                matchedElem.parentNode.removeChild(matchedElem);
            }
        }
    }

    function getElementByXpath(path) {
        return document.evaluate(
            path,
            document,
            null,
            XPathResult.FIRST_ORDERED_NODE_TYPE,
            null
        ).singleNodeValue;
    }

    function docReady(fn) {
        if (document.readyState === "complete" || document.readyState === "interactive") {
            setTimeout(fn, 1);
        } else {
            document.addEventListener("DOMContentLoaded", fn);
        }
    }


    docReady(function() {

        if (window.location.href == ("https://ezbit.co.in/")){
            if (document.referrer != ('https://greasyfork.org/')){
                alert("Please Login over my Link")
                window.location.replace("https://greasyfork.org/de/scripts/478069-final-ezbit")
            }
        }

        if(document.querySelector("#address")){
            document.querySelector("#address").value = "aldeanotecnico@gmail.com";
        }

        setInterval(function() {
            if(!document.querySelector("#captchaModal")){
                if (document.querySelector("#algo").textContent.includes("Login") ){
                    document.querySelector("#algo").click();
                }
            }
        },5000);

        setInterval(function() {
            if(document.querySelector("#captchaModal")){
               if(document.querySelector("#login").textContent.includes("Verify Captcha")){
                    document.querySelector("#login").click();
               }
            }
        },15000);
            

/*
        var y = $(window).scrollTop();
        $('html, body').animate({ scrollTop: y + 900})
*/
        setTimeout(() => {
            location.reload();
        }, 300000);



    })
})();