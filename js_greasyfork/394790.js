// ==UserScript==
// @name         P&W - Orbis Date - Next Turn Countdown
// @namespace    redcore.com.br
// @version      0.0.5
// @description  Politics and War - Orbis Date - Next Turn - Countdown animation.
// @author       WingedSpak
// @include      https://politicsandwar.com/*
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/394790/PW%20-%20Orbis%20Date%20-%20Next%20Turn%20Countdown.user.js
// @updateURL https://update.greasyfork.org/scripts/394790/PW%20-%20Orbis%20Date%20-%20Next%20Turn%20Countdown.meta.js
// ==/UserScript==

/**
 * FEATURES:
 * - Next Turn Countdown
 * - Next Turn Countdown - Reload Page Button
 */

Date.prototype.addHours = function(h) {
    this.setTime(this.getTime() + (h * 60 * 60 * 1000));
    return this;
};

Number.prototype.isEven = function() { return this % 2 === 0 };


(() => {
    document.querySelectorAll("#leftcolumn ul")[4].querySelectorAll("b")[0].setAttribute("id", "next_turn");

    let countDownDate = new Date();

    countDownDate.setMinutes(0);
    countDownDate.setSeconds(0);

    let countDownHours = Math.floor((countDownDate % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

    countDownHours.isEven() ? countDownDate.addHours(2) : countDownDate.addHours(1);

    countDownDate = countDownDate.getTime();

    // Update the count down every 1 second
    let x = setInterval(function() {
        // Get today's date and time
        let now = new Date().getTime();

        // Find the distance between now and the count down date
        let distance = countDownDate - now;

        // Time calculations for hours, minutes and seconds
        let hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
            minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
            seconds = Math.floor((distance % (1000 * 60)) / 1000);

        // Update the count down
        document.getElementById("next_turn").innerHTML =
            `${hours}h ${minutes}m ${seconds}s <i class="fa fa-redo" aria-hidden="true" onclick="location.reload()" style="cursor: pointer;" data-toggle="tooltip" data-original-title="Refresh"></i>`;;

        // If the count down is finished
        if (distance < 0) {
            clearInterval(x);
            document.getElementById("next_turn").innerHTML = `<i class="fa fa-redo" aria-hidden="true" onclick="location.reload()" style="cursor: pointer;"></i> <strong> RELOAD </strong>`;
        }
    }, 1000);
})()