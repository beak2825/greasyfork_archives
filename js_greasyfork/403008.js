// ==UserScript==
// @name         GamekitImageAutoRate
// @namespace    fr.mrcraftcod
// @version      0.5
// @description  Continuously rate every pictures with ransom stars
// @author       MrCraftCod
// @match        https://gamekit.com/image/star/*
// @match        https://dogry.pl/image/star/*
// @require      http://code.jquery.com/jquery-3.4.1.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/403008/GamekitImageAutoRate.user.js
// @updateURL https://update.greasyfork.org/scripts/403008/GamekitImageAutoRate.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var loadDate = Date.now();
    function tryRate()
    {
        var captchaValid = $('#google_recaptcha_send');
        if(captchaValid && captchaValid !== undefined && captchaValid !== null && captchaValid.length && captchaValid.length > 0) //Can't valid automatically captcha due to CORS
        {
            console.log("[GamekitImageAutoRate] Captcha, waiting user input");
            return;
        }
        var note = (1 + getRandomInt(5)) * 2;
        var button = $('[data-rating="' + note + '"]');
        if(!button || button === null || button === undefined){
            console.log("[GamekitImageAutoRate] Stars not found, retrying in 100ms");
            setTimeout(tryRate, 100);
        }
        else{
            console.log("[GamekitImageAutoRate] Rated image with " + note / 2 + " stars");
            button.click(); //Page will reload and script be run again after
        }
    }

    function getRandomInt(max) {
        return Math.floor(Math.random() * Math.floor(max));
    }

    $(document).ready(function(){
        var delay = Math.max(0, (loadDate + 1000) - Date.now());
        if(delay == 0){
            tryRate();
        }else{
            console.log("[GamekitImageAutoRate] Waiting " + delay + "ms before rating");
            setTimeout(tryRate, delay); //wait at least 1s since the scipt have been loaded
        }
    });
})();


