// ==UserScript==
// @name         earnbitmoon.xyz
// @namespace    http://tampermonkey.net/
// @version      0.1
// @license      none
// @description  earnbitmoon
// @author       LTW
// @match        https://earnbitmoon.xyz/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=earnbitmoon.xyz
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/500370/earnbitmoonxyz.user.js
// @updateURL https://update.greasyfork.org/scripts/500370/earnbitmoonxyz.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const redirecionamento = '';
    const timerRedirect = false;

tim3ba75fd550d12b36f0c4a1e8f808f74a6aee881ef65da32b98573e9fd7a76ad1 = 0;
str3ba75fd550d12b36f0c4a1e8f808f74a6aee881ef65da32b98573e9fd7a76ad1();
setTimeout(function () {location.reload();}, 600000);

function convertToSeconds(timeString) {
    if (!timeString) return 0;
    let timeParts = timeString.match(/(\d+)\s*minutes?\s*and\s*(\d+)\s*seconds?/i);
    if (!timeParts) return 0;

    let minutes = parseInt(timeParts[1], 10);
    let seconds = parseInt(timeParts[2], 10);
    return (minutes * 60) + seconds;
}

function checkAndRedirect() {
    let timeElement = document.getElementById('claimTime');
    if (timeElement) {
        let timeText = timeElement.textContent.trim();
        let totalSeconds = convertToSeconds(timeText);

       // console.log("Tempo em segundos:", totalSeconds);

        if (totalSeconds > 120) {
            window.location.href = redirecionamento;
        }
    }
}

if(timerRedirect === true){
setTimeout(function () {
checkAndRedirect();
}, 3000);
}

function is(element) {
    const rect = element.getBoundingClientRect();
    const viewHeight = Math.max(document.documentElement.clientHeight, window.innerHeight);
    return !(rect.bottom < 0 || rect.top - viewHeight >= 0);
}

function ch() {
    const b= document.querySelector('button.btn.btn-danger.btn-md.w-100.mt-2');
    if (b && is(b)) {
        b.click();
        clearInterval(i);
        setTimeout(function () {
        window.location.href = redirecionamento;
        }, 4000);
    }
}

const i= setInterval(ch, 7000);


})();