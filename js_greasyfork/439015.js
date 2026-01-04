// ==UserScript==
// @name         XRP-Unlimited Faucet
// @namespace    xrp faucet
// @version      1.2
// @description  XRP Drop Z
// @author       aimen
// @match        https://my.dropz.xyz/site-friends*
// @match        https://my.dropz.xyz/verifications/*
// @match        https://my.dropz.xyz/transactions*
// @match        https://mail.google.com/mail/u/0/*
// @noframes
// @grant        window.close
// @grant        unsafeWindow
 
// @downloadURL https://update.greasyfork.org/scripts/439015/XRP-Unlimited%20Faucet.user.js
// @updateURL https://update.greasyfork.org/scripts/439015/XRP-Unlimited%20Faucet.meta.js
// ==/UserScript==
 
 
(function() {
    'use strict';
 
 
    //Reload the page after 3 minutes
    setTimeout(function(){
        window.location.reload();
    },180000);
 
    var windowName = "";
    var popUpWindow = "";
    var gmailUrl = 'https://mail.google.com/mail/u/0/#advanced-search/from=no-reply%40mailer.dropz.xyz&subset=unread&within=1d&sizeoperator=s_sl&sizeunit=s_smb&query=is%3Aunread+from%3A(no-reply%40mailer.dropz.xyz)';
    var balanceMin = 5000;
    var balanceMax = 10000;
 
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
 
        if(unsafeWindow.name == "dropzemailVerificationWindow" && window.location.href.includes("https://my.dropz.xyz/transactions")){
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
 
 
    //Autowithdraw randomly when the balance is between balanceMin and balanceMax
    setTimeout(function(){
 
        if(!clicked && document.querySelector("#balance_lbl") && document.querySelector("#balance_lbl").innerText){
            var balance = document.querySelector("#balance_lbl").innerText;
            balance = balance.split(".");
            balance[0] = balance[0].replaceAll(",","");
            balance[0] = Number(balance[0]);
            if(balance[0] > randomInteger(balanceMin,balanceMax) && document.querySelector("#payout")){
                document.querySelector("#payout").click();
                clicked = true;
                document.querySelector("body > div.swal2-container.swal2-center.swal2-backdrop-show > div > div.swal2-actions > button.swal2-confirm.swal2-styled.swal2-default-outline").click();
                setTimeout(function(){
                    unsafeWindow.open(gmailUrl,"dropzemailWindow");
                },10000)
            }
        }
 
 
        if(window.location.href.includes(gmailUrl)){
            setInterval(function(){
 
                if(!clicked && document.querySelector("[email='no-reply@mailer.dropz.xyz']")){
                    document.querySelector("[email='no-reply@mailer.dropz.xyz']").click();
                    clicked = true;
                    setTimeout(function(){
                        var mydropzlink = "";document.querySelectorAll("a").forEach((urlLink) => {
                            if(urlLink.href.includes("my.dropz")){mydropzlink = urlLink.href}
                        });
                        unsafeWindow.onbeforeunload = function() {};
                        unsafeWindow.open(mydropzlink,"dropzemailVerificationWindow");
 
                        setTimeout(function(){
                            unsafeWindow.close();
                        },5000)
 
                    },5000);
                }
            },10000);
        }
 
    },7000);
 
 
})();