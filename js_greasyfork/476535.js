// ==UserScript==
// @name         7.showPublicCaptcha
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  try to take over the world!
// @author       MeGa
// @match        https://algeria.blsspainglobal.com/DZA/blsAppointment/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=blsspainglobal.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/476535/7showPublicCaptcha.user.js
// @updateURL https://update.greasyfork.org/scripts/476535/7showPublicCaptcha.meta.js
// ==/UserScript==


var TimeToReshowPublicCaptcha = (60 * 9) + 57;

setInterval(function () {
    document.querySelector("body > div:nth-child(41) > button:nth-child(12)").click();

    var start = TimeToReshowPublicCaptcha;
    var secondsLabel = document.querySelector("body > div:nth-child(41) > button:nth-child(12)");

    // Utiliser une seule fonction setInterval pour mettre à jour le temps
    var countdownInterval = setInterval(function () {
        var minutes = Math.floor(start / 60);
        var seconds = start % 60;

        var timeString = "Captcha expire dans " + pad(minutes) + " min " + pad(seconds) + " sec";
        secondsLabel.innerHTML = timeString;

        if (start <= 0) {
            clearInterval(countdownInterval); // Arrêter la désincrémentation lorsque le temps est écoulé
        } else {
            start--;
        }
    }, 1000);

    function pad(val) {
        return val < 10 ? "0" + val : val;
    }
}, TimeToReshowPublicCaptcha * 1000);
