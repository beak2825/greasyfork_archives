// ==UserScript==
// @name         miningblocks.club : Auto Claim Faucet, PTC and Shortlinks  with Auto Login
// @namespace    miningblocks.club.auto.claim.faucet
// @version      1.5
// @description  https://miningblocks.club?Referral=61273
// @author       White
// @match        https://miningblocks.club/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=miningblocks.club
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/473077/miningblocksclub%20%3A%20Auto%20Claim%20Faucet%2C%20PTC%20and%20Shortlinks%20%20with%20Auto%20Login.user.js
// @updateURL https://update.greasyfork.org/scripts/473077/miningblocksclub%20%3A%20Auto%20Claim%20Faucet%2C%20PTC%20and%20Shortlinks%20%20with%20Auto%20Login.meta.js
// ==/UserScript==

(function() {
    const email = "email@gmail.com";
    const password = "123";

    const emailField = document.querySelector("#txtCorreo");
    const passwordField = document.querySelector("#txtPassword");
    const submitButton = document.querySelector("button#btnLogIn");
    const selectElement = document.querySelector('.form-control');
    const pElement = document.getElementById("NumeroPTCAds");
    const btnClaim = document.getElementById("btnClaim");
    const hTiempoEspera = document.getElementById("hTiempoEspera");
    const button = document.getElementById('btnVerAds');
    const timer = document.getElementById('timer');
    const button2 = document.getElementById('btnClaim');
    const firstBtn = document.querySelector('.btn.btn-lg.btn-fill.btn-success');

    function waitForPageLoad(callback) {
        if (document.readyState === "complete") {
            callback();
        } else {
            window.addEventListener("load", callback);
        }
    }

    function redirectToPage() {
        var ptcStatusElement = document.getElementById("PTCStatus");
        if (ptcStatusElement !== null) {
            setTimeout(() => {
                window.location.href = "https://miningblocks.club/Faucet/Claim";
            }, 40000);
        }
    }

    if (window.location.href.includes("miningblocks.club/Shortlink/GetReward")) {
        setTimeout(function() {
            window.location.replace("https://miningblocks.club/Shortlink/List");
        }, 7000);
    }

    function hCaptcha() {
        return grecaptcha && grecaptcha.getResponse().length !== 0;
    }

    function reloadPage
() {
        setTimeout(() => {
            location.reload();
        }, 5000);
    }

    if (emailField) {
        emailField.value = email;
    }
    if (passwordField) {
        passwordField.value = password;
    }

    if (window.location.href === "https://miningblocks.club/Dashboard/Home") {
        var btnReparar = document.getElementById("btnReparar");
        if (btnReparar) {
            btnReparar.click();
            setInterval(function() {
                button.click();
                waitForPageLoad(redirectToPage);
            }, 5000);
        }
    }

    setInterval(function() {
        if (hCaptcha()) {
            submitButton.click();
        }
    }, 1000);

    setInterval(function() {
        if (hCaptcha()) {
            btnClaim.click();
            setTimeout(() => {
                location.reload();
            }, 5000);
        }
    }, 10000);

    setInterval(() => {
        if (hTiempoEspera && hTiempoEspera.innerText === "1 Secs") {
            reloadPage();
        }
    }, 1000);

    setInterval(function() {
        if (window.location.href.includes("https://miningblocks.club/PTC")) {
            const innerInterval = setInterval(function() {
                if (timer && timer.innerText === 'Wait 0 secs') {
                    if (button2) {
let turnstile = document.querySelector("input[name='cf-turnstile-response']")
                     if (turnstile && turnstile.value.length >0) {
                        button2.click();
                      }
                    }
                }
            }, 5000);
        }
    }, 5000);

    setTimeout(function() {
        if (window.location.href === "https://miningblocks.club") {
            window.location.replace("https://miningblocks.club/Auth/Login");
        }
    }, 3000);

    setTimeout(function() {
        if (window.location.href.includes("https://miningblocks.club/Shortlink/List")) {
            setTimeout(function() {
                var buttons = [
                    { id: 156, name: 'button156' },
                    { id: 144, name: 'button144' },
                    { id: 130, name: 'button130' },
                    { id: 93, name: 'button93' },
                    { id: 88, name: 'button88' },
                    { id: 84, name: 'button84' },
                    { id: 136, name: 'button136' },
                    { id: 148, name: 'button148' },
                    { id: 78, name: 'button78' },
                    { id: 155, name: 'button155' },
                    { id: 82, name: 'button82' },
                    { id: 108, name: 'button108' },
                    { id: 118, name: 'button118' },
                    { id: 147, name: 'button147' },
                ];

                var buttonFound = false;

                for (var i = 0; i < buttons.length; i++) {
                    var button = document.querySelector('[onclick="ObtenerLink(' + buttons[i].id + ')"]');
                    if (button) {
                        button.click();
                        buttonFound = true;
                        break;
                    }
                }

                if (!buttonFound) {
                    window.location.href = 'https://miningblocks.club/Dashboard/Home';
                }
            }, 3000);
        }
    }, 3000);
})();
