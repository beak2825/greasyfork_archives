// ==UserScript==
// @name         Earnbitmoon
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  Auto Faucet
// @author       LTW
// @license      none
// @match        https://earnbitmoon.club/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=earnbitmoon.club
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/491839/Earnbitmoon.user.js
// @updateURL https://update.greasyfork.org/scripts/491839/Earnbitmoon.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var intervalId;
    var modalClicked = false;

    function checkAndClick() {
        var loadingFaucet = document.getElementById('loadingFaucet');
        if (loadingFaucet && loadingFaucet.classList.contains('d-none')) {
            var buttons = document.querySelectorAll('button[data-target="#modal2my"]');
            if (buttons.length > 0) {
                buttons[0].click();
                modalClicked = true;
                clearInterval(intervalId);
                 setTimeout(function() {
               window.location.reload();
              }, 20000);
            }
        }
    }

    intervalId = setInterval(checkAndClick, 2000);

    setTimeout(function() {
         var loadingFaucet = document.getElementById('loadingFaucet');
         if (loadingFaucet){
        clearInterval(intervalId);
        if (!modalClicked) {
            window.location.reload();
        }}
    }, 10000);
setTimeout(function(){location.reload();}, 360000);
    function checkVerificationComplete() {
        var divElement = document.querySelector('.iconcaptcha-modal__body-title');

        if (divElement && divElement.innerText.toLowerCase() === 'verification complete.') {
            setTimeout(function() {
                var buttonElement = document.querySelector('button.zxz');
                if (buttonElement) {
                    buttonElement.click();
                    setTimeout(function() {
                        window.location.href = 'https://earnbitmoon.club/';
                   }, 3000);
                }
            }, 1000);
        } else {
            setTimeout(checkVerificationComplete, 1000);
        }
    }

    checkVerificationComplete();

})();