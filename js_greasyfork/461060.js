// ==UserScript==
// @name         starlavinia.name.tr : Auto Faucet
// @namespace    https://starlavinia.name.tr/clmm/?r=23926
// @version      1.2
// @description  https://starlavinia.name.tr/clmm/?r=23926
// @author       stealtosvra
// @match        https://starlavinia.name.tr/*
// @icon         https://starlavinia.name.tr/clmm/styles/upload/favicon/f019b396110fc39e9715f2d3140de41a.png
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/461060/starlavinianametr%20%3A%20Auto%20Faucet.user.js
// @updateURL https://update.greasyfork.org/scripts/461060/starlavinianametr%20%3A%20Auto%20Faucet.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var email = "";

    function hCaptcha() {
        return grecaptcha && grecaptcha.getResponse().length !== 0;
    }

    function autoClaim() {
        const element = document.querySelector('.btn.btn-primary');
        if (element.innerText === 'Go Claim') {
            element.click();
            location.reload();
        }
    }

    if(window.location.href === "https://starlavinia.name.tr/") {
        var element = document.querySelector('button[data-target="#login"]');
        element.click();

        var inputBox = document.getElementById("InputEmail");
        inputBox.value = email;

        setTimeout(function() {
            var buttons = document.querySelectorAll('button.btn.btn-primary');
            var secondButton = buttons[3];
            secondButton.click();
        }, 5000);
    }


    setInterval(function() {
            document.getElementById("subbutt").click();
    }, 5000);

    setInterval(autoClaim, 5000);

})();