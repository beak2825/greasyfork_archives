// ==UserScript==
// @name         pick.io : Auto Claim & Auto Login
// @namespace    lite.doge.sol.tron.pick.auto.claim
// @version      1.5
// @description  NEW SITE ADDED - Made In Trinidad
// @author       stealtosvra
// @include        /^(https?:\/\/)(.+)?(bnbpick|dogepick|litepick|maticpick|solpick|tronpick)(\.io)(\/.*)/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tronpick.io
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/462030/pickio%20%3A%20Auto%20Claim%20%20Auto%20Login.user.js
// @updateURL https://update.greasyfork.org/scripts/462030/pickio%20%3A%20Auto%20Claim%20%20Auto%20Login.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const email = "123@gmail.com";
    const password = "123";

    const website = window.location.hostname;
    const domainParts = website.split(".");
    const tld = domainParts.pop();
    const domain = domainParts.pop();
    const key = `${domain}.${tld}`.replace(/^www\./, "");
    const currentUrl = window.location.href;
    const targetUrl = `https://${key}`;

    function hCaptcha() {return grecaptcha && grecaptcha.getResponse().length !== 0;}

    const emailField = document.querySelector("#user_email");
    const passwordField = document.querySelector("#password");
    const submitButton = document.querySelector("button.btn");

    if (emailField) {emailField.value = email;}
    if (passwordField) {passwordField.value = password;}

    setInterval(() => {if (hCaptcha()) {submitButton.click();}}, 3000);
    setInterval(function() {if (hCaptcha()) {document.querySelector("button.process_btn").click();}}, 5000);

    const ptcLinks = [

        ["https://litepick.io/faucet.php", "https://tronpick.io/faucet.php"],
        ["https://tronpick.io/faucet.php", "https://solpick.io/faucet.php"],
        ["https://solpick.io/faucet.php", "https://dogepick.io/faucet.php"],
        ["https://dogepick.io/faucet.php", "https://bnbpick.io/faucet.php"],
        ["https://bnbpick.io/faucet.php", "https://maticpick.io/faucet.php"],
        ["https://maticpick.io/faucet.php", "https://litepick.io/faucet.php"],
    ];

    const currentUrlptc = window.location.href;
    const nextLink = ptcLinks.find(link => link[0] === currentUrlptc);

    if (nextLink) {let redirectTimer = setTimeout(() => {window.location.href = nextLink[1];}, 50000);window.addEventListener('beforeunload', () => {clearTimeout(redirectTimer);});}

})();