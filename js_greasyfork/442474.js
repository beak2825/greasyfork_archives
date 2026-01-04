// ==UserScript==
// @name         cryptureworld - Automate
// @namespace    https://play.cryptureworld.com/
// @version      1.0.1
// @description  cryptureworld - Automate Script
// @author       Pong
// @match       https://play.cryptureworld.com/*
// @icon         https://www.google.com/s2/favicons?domain=play.cryptureworld.com
// @grant        none
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/442474/cryptureworld%20-%20Automate.user.js
// @updateURL https://update.greasyfork.org/scripts/442474/cryptureworld%20-%20Automate.meta.js
// ==/UserScript==

window.automateEnable = true;
window.storedMiningEnable = true;

window.interval = 10000;

window.sleep = function (ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

window.waitForModal = async function () {
    await window.sleep(4000);
}

window.automateMining = async function () {
    if ($("adventure button").get(0) != undefined && $("adventure button .animate-spin").get(0) == undefined) {
        $("adventure button").get(0).click();
        await window.waitForModal();
    }
}

window.automateInterval = setInterval(async function () {
    if (window.automateEnable) {
            await window.automateMining();
    }
}, window.interval);

/*window.loginInterval = setInterval(function () {
    if ($(".login-button").length > 0 && $("#RPC-Endpoint").val() != null) {
        $(".login-button").click();
        $(".login-modal-button:contains('Wax Wallet Account')").click();
        clearInterval(window.loginInterval);
    }
}, 100);*/