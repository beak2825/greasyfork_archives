// ==UserScript==
// @name         claimcrypto.in PTC
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  claimcrypto
// @author       LTW
// @license      none
// @match        https://claimcrypto.in/ptc*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=claimcrypto.in
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/497757/claimcryptoin%20PTC.user.js
// @updateURL https://update.greasyfork.org/scripts/497757/claimcryptoin%20PTC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const redirecionamento = '';

    if (window.location.href === 'https://claimcrypto.in/ptc') {
        const buttons = document.querySelectorAll('button');

        setTimeout(() => {
            let found = false;

            for (let button of buttons) {
                const span = button.querySelector('span');
                if (span && span.textContent === 'View') {
                    button.click();
                    found = true;
                    break;
                }
            }

            if (!found) {
                window.location.href = redirecionamento;
            }
        }, 3000);
    }
if(window.location.href.includes('https://claimcrypto.in/ptc/window/')){
const count = setInterval(() => {
    --timer;
    if (timer < 0) {
        $('#disable').css('display', 'none');
        $('#verr').css('display', 'inline-block');
        document.title = 'Claim Reward!';
        clearInterval(count);

        setTimeout(() => {
            const verifyButton = document.getElementById('verify');
            if (verifyButton) {
                verifyButton.click();
            }
        }, 1000);
    }
}, 100);
}
})();