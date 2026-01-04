// ==UserScript==
// @name         Freebitcoin Auto Roll and Reload Page + hCaptcha/Cloudflare Captcha Autoclick
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  freebitco.in auto roll and hCaptcha/cloudflare captcha auto click
// @author       Rafael BC
// @match        https://*.hcaptcha.com/*hcaptcha-challenge*
// @match        https://*.hcaptcha.com/*checkbox*
// @match        https://*.hcaptcha.com/*captcha*
// @match        https://freebitco.in/?op=home
// @match        https://freebitco.in/?op=home#
// @match        https://freebitco.in/
// @match        https://freebitco.in/static/html/wof/wof-premium.html
// @match        https://challenges.cloudflare.com/*
// @icon         https://static1.freebitco.in/favicon.png
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @require      https://greasyfork.org/scripts/464929-module-jquery-xiaoying/code/module_jquery_XiaoYing.js
// @require      https://greasyfork.org/scripts/464780-global-module/code/global_module.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/514049/Freebitcoin%20Auto%20Roll%20and%20Reload%20Page%20%2B%20hCaptchaCloudflare%20Captcha%20Autoclick.user.js
// @updateURL https://update.greasyfork.org/scripts/514049/Freebitcoin%20Auto%20Roll%20and%20Reload%20Page%20%2B%20hCaptchaCloudflare%20Captcha%20Autoclick.meta.js
// ==/UserScript==


// hCaptcha Auto Click
(function() {

    var CHECKBOX = "#checkbox";
    var ARIA_CHECKED = "aria-checked";

   function qSelector(selector) {
        return document.querySelector(selector);
    }

    function isHidden(el) {
        return (el.offsetParent === null)
    }

    if (window.location.href.includes("checkbox")) {
        var checkboxInterval = setInterval(function() {
            if (!qSelector(CHECKBOX)) {
            } else if (qSelector(CHECKBOX).getAttribute(ARIA_CHECKED) == "true") {
                clearInterval(checkboxInterval);
            } else if (!isHidden(qSelector(CHECKBOX)) && qSelector(CHECKBOX).getAttribute(ARIA_CHECKED) == "false") {
                qSelector(CHECKBOX).click();
            } else {
                return;
            }

        }, 60000);
    }

})();

(function() {

    'use strict';

    setInterval(function(){
        document.querySelector("#cf-stage > div.ctp-checkbox-container > label > span")?.click();
    },7000);
    setInterval(function(){
        document.querySelector("input[value='Verify you are human']")?.click();
        //document.querySelector('#challenge-stage')?.querySelector('input[type="checkbox"]')?.click();
        document.querySelector('.ctp-checkbox-label')?.click();
    },3000);

})();


// Freebitco.in Auto Roll + Force Refresh Page

//RELOAD PAGE
var timeout = setTimeout("location.reload(true);",60000); // 1 minute
      function resetTimeout() {
      clearTimeout(timeout);
      timeout = setTimeout("location.reload(true);",60000); // 1 minute
}


//AUTO ROLL
var count_min = 1;
$(document).ready(function(){
    console.log("Status: Page loaded.");

    setTimeout(function(){
        $('#free_play_form_button').click();
        console.log("Status: Button ROLL clicked.");
    }, random(2000,4000));

    setInterval(function(){
        console.log("Status: Elapsed time " + count_min + " minutes");
        count_min = count_min + 1;
    }, 60000);

    setTimeout(function(){
        $('.close-reveal-modal')[0].click();
        console.log("Status: Button CLOSE POPUP clicked.");
    }, random(12000,18000));

    setInterval(function(){
        $('#free_play_form_button').click();
        console.log("Status: Button ROLL clicked again.");
    }, random(60000,60000)); // 1 minute


        setInterval(function(){
        $('#javascript:PlayAll()').click();
        console.log("Status: Button ROLL clicked again.");
    }, random(60000,60000)); // 1 minute

});

function random(min,max){
   return min + (max - min) * Math.random();
}