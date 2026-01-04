// ==UserScript==
// @name        Bypass FREEdlink countdown
// @description Bypasses 60 second countdowns on FREEdlink downloads
// @namespace   https://usltd.ge/
// @match       https://frdl.to/*
// @match       https://frdl.io/*
// @match       https://frdl.is/*
// @match       https://frdl.my/*
// @match       https://frdl.hk/*
// @match       https://frdl.fi/*
// @match       https://frdl.pw/*
// @match       https://frdl.by/*
// @match       https://frdl.*/*
// @match       https://fredl.ru/*
// @match       https://fredl.*/*
// @version     1.4.3
// @license     MIT
// @author      Luka Mamukashvili <mamukashvili.luka@usltd.ge>
// @downloadURL https://update.greasyfork.org/scripts/522735/Bypass%20FREEdlink%20countdown.user.js
// @updateURL https://update.greasyfork.org/scripts/522735/Bypass%20FREEdlink%20countdown.meta.js
// ==/UserScript==
 
(function () {
    'use strict';
    
    function bypass() {
        const freeDownloadButton = document.getElementById('downloadbtnfree');
        const countdownDisplay = document.getElementById('countdown');
        const freeCaptchaSection = document.getElementById('free-captcha');
        const downloadFreeInput = document.getElementById('download_free');
        if (freeDownloadButton && countdownDisplay && freeCaptchaSection && downloadFreeInput) {
            console.log('[FREEDL BYPASS] Normal download elements found.');
            downloadFreeInput.value = '1';
            countdownDisplay.style.display = "none";
            freeCaptchaSection.style.display = "block";
            console.log('[FREEDL BYPASS] Captcha section shown.');
            freeDownloadButton.disabled = false;
            freeDownloadButton.innerText = "Start Download NOW (after captcha)";
            console.log('[FREEDL BYPASS] Normal Download button enabled.');
            if (!document.getElementById('userscript_message')) {
                const userscript_message = document.createElement("p");
                userscript_message.id = "userscript_message";
                userscript_message.style.color = "green";
                userscript_message.style.textAlign = "center";
                userscript_message.innerText = 'Userscript active: Please complete the captcha above and then click "Start Download NOW"';
                freeCaptchaSection.after(userscript_message);
            }
        }
        else {
            console.log('[FREEDL BYPASS] Target elements for normal download not found on this page.');
        }
    }
    window.addEventListener('load', () => {
        bypass();
    });
})();
