// ==UserScript==
// @name         claimfreebits.com
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  claimfreebits
// @author       LTW
// @license      none
// @match        https://claimfreebits.com/?page=faucet
// @icon         https://www.google.com/s2/favicons?sz=64&domain=claimfreebits.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/498856/claimfreebitscom.user.js
// @updateURL https://update.greasyfork.org/scripts/498856/claimfreebitscom.meta.js
// ==/UserScript==

(function() {
    'use strict';
 const pageTitle = document.title.toLowerCase();
    if (pageTitle.includes('just a moment...') || pageTitle.includes('um momento...')) {
        console.log('O título da página contém a frase "just a moment" ou "um momento". O script será desativado.');
        return;} else  {
    var redirecionamento = "https://claimfreebits.com/?page=faucet";

    function checkClaimTime() {
        var claimTime = document.getElementById('claimTime');
        var button = document.querySelector('button.btn.btn-primary.mifa');
        if (!claimTime.textContent.trim()) {
            button.click();
            clearInterval(interval);
            var interval1 = setInterval(checkReCaptcha, 3000);
        }
         function checkReCaptcha() {
        if (grecaptcha && grecaptcha.getResponse().length !== 0) {
            var button = document.querySelector('button.btn.btn-danger.btn-sm.w-30.mt-2.rollr');
            button.click();
            clearInterval(interval1);
            setTimeout(function() {
                window.location.href = redirecionamento;
            }, 3000);
        }
    }
    }
setTimeout(function () {location.reload();}, 180000);

    var interval = setInterval(checkClaimTime, 1000);
}
})();
