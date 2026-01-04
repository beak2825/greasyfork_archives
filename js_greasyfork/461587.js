// ==UserScript==
// @name         miningblocks.club : Auto Claim Faucet & PTC with Auto Login
// @namespace    miningblocks.club.auto.claim.faucet
// @version      1.5
// @description  https://miningblocks.club?Referral=43392
// @author       stealtosvra
// @match        https://miningblocks.club/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=miningblocks.club
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/461587/miningblocksclub%20%3A%20Auto%20Claim%20Faucet%20%20PTC%20with%20Auto%20Login.user.js
// @updateURL https://update.greasyfork.org/scripts/461587/miningblocksclub%20%3A%20Auto%20Claim%20Faucet%20%20PTC%20with%20Auto%20Login.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // INSERT YOUR CREDENTIALS
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

    function hCaptcha() {return grecaptcha && grecaptcha.getResponse().length !== 0;}
    function reloadPage() {setTimeout(() => {location.reload();}, 5000);}

    if (emailField) {emailField.value = email;}
    if (passwordField) {passwordField.value = password;}
    if (window.location.href === ("https://miningblocks.club/Dashboard/Home")) {document.getElementById("btnReparar").click();setInterval(function() {button.click();}, 5000);}

    setInterval(function() {if (hCaptcha()) {submitButton.click();}}, 1000);
    setInterval(function() {if (hCaptcha()) {btnClaim.click();setTimeout(() => {location.reload();}, 5000);}}, 10000);
    setInterval(() => {if (hTiempoEspera && hTiempoEspera.innerText === "1 Secs") {reloadPage();}}, 1000);
    setInterval(function() {if (window.location.href.includes("https://miningblocks.club/PTC")) {const innerInterval = setInterval(function() {if (timer && timer.innerText === 'Wait 0 secs') {if (button2) {button2.click();}}}, 5000);}}, 5000);
    setTimeout(function() {if (window.location.href === ("https://miningblocks.club")) {window.location.replace("https://miningblocks.club/Auth/Login")}}, 3000)
    setTimeout(function() {if (window.location.href.includes("https://miningblocks.club/Shortlink/List")) {if (firstBtn) {firstBtn.click();}}}, 3000)
})();
