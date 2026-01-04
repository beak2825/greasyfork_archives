// ==UserScript==
// @name         playnano watch and learn pro
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  rewards
// @author       BBoytech
// @match        https://playnano.online/watch-and-learn/*
// @icon         https://www.google.com/s2/favicons?domain=playnano.online
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/433317/playnano%20watch%20and%20learn%20pro.user.js
// @updateURL https://update.greasyfork.org/scripts/433317/playnano%20watch%20and%20learn%20pro.meta.js
// ==/UserScript==

(function() {
    var claimTimer = setInterval (function() {claim(); }, Math.floor(Math.random() * 500) + 1000);
    var claimaTimer = setInterval (function() {claima(); }, Math.floor(Math.random() * 2000) + 3000);
    var claima1Timer = setInterval (function() {claima1(); }, Math.floor(Math.random() * 2000) + 3000);
    var claimbTimer = setInterval (function() {claimb(); }, Math.floor(Math.random() * 2000) + 3000);
    var claimdTimer = setInterval (function() {claimd(); }, Math.floor(Math.random() * 1000) + 2000);
    if(window.location.href == "https://playnano.online/watch-and-learn/nano/captcha") {
                 var claimcTimer = setInterval (function() {claimc(); }, Math.floor(Math.random() * 100) + 300);
        }
    else
    {
       document.getElementById("vjs-video-js").remove();
       document.getElementsByClassName("row video-description mt-3")[0].remove();
       document.getElementsByClassName("col-12 col-lg-4 mt-5 mt-lg-0")[0].remove();
    }

    // click on the next vidoe button
    function claim(){
        if(window.location.href == "https://playnano.online/watch-and-learn/nano/captcha") {
        }
        else if(window.location.href == "https://playnano.online/watch-and-learn/nano") {
            document.getElementsByClassName("button btn-primary watch-next-btn")[0].click();
        }
        else
        {
            document.getElementsByClassName("finished")[0].click();
            location.href = "https://playnano.online/watch-and-learn-next/nano";
        }
    }
    //close ads
    function claima(){
            document.getElementsByClassName("_9k9omwe")[0].click();
    }
    function claima1(){
            document.getElementsByClassName("_s6kpfpbg")[0].click();
    }
    //close ads
    function claimb(){
            document.getElementsByClassName("pl-d4b76db898bed07320419c0b48d1d7f1__close")[0].click();
    }
    // start a new one
    function claimc(){
        if(window.location.href == "https://playnano.online/watch-and-learn/nano/captcha") {
             document.getElementsByClassName("noty_body")[0].click();
            location.href = "https://playnano.online/watch-and-learn/nano";
        }
        else
        {
        }

    }
    // check if adblocker error comes up.
    function claimd()
    {
        document.getElementsByClassName("modal send-nano fade show")[0].click();
        var linkTimer = setInterval (function() {linka(); }, Math.floor(Math.random() * 1000) + 1100);
                function linka(){
                    var linka = window.location.href;
                    location.href = linka;
                }
        //document.getElementsByClassName("button-darker")[0].click();
    }
    var test = document.getElementsByClassName("form-group col")[0].innerHTML;
    if(test.match('https://hcaptcha.com/1/api.js'))
        {
            setInterval(function() {
                if (document.querySelector(".h-captcha > iframe").getAttribute("data-hcaptcha-response").length > 0) {
                    document.querySelector('button[value=keep]').click();
                    document.querySelector('button[value=keep]').onclick = function() {
                        setTimeout(function() {
                            location.href = "https://playnano.online/watch-and-learn/nano";
                        }, 1000);
                    }
                }
            }, 1000);
        }
        else{
                var interval = setInterval(function(){
                    var capthaOk=$('#g-recaptcha-response').val();
                    if(capthaOk!="")
                    {
                        clearInterval( interval );
                        $('.button')[0].click();
                    }
                }, 500);
        }
})();