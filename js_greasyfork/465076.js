// ==UserScript==
// @name         FarmiCorp : Auto Claim Water
// @namespace    farmicorp.auto.claim.water
// @version      1.1
// @description  https://ouo.io/eH5fSj
// @author       stealtosvra
// @match        https://farmicrop.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=farmicrop.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/465076/FarmiCorp%20%3A%20Auto%20Claim%20Water.user.js
// @updateURL https://update.greasyfork.org/scripts/465076/FarmiCorp%20%3A%20Auto%20Claim%20Water.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const email = "email@gmail.com";
    const password = "123";
    const emailField = document.querySelector("#email");
    const passwordField = document.querySelector("#password");

    const element = document.querySelectorAll('.boton.btn.water.verdeOscuro.fs-5');
    const urls = ['https://ouo.io/t7eqMI','https://link1s.com/WE8UT0','https://sox.link/Jq2yF52Z','http://flyearn.site/L51l9r0b','http://link1s.net/oYQKle','https://ex-foary.com/dcYz9F','https://wplink.online/cDtIY','https://try2link.com/XKTsQwC','https://loptelink.com/4Up6SlQ7','https://ser2.crazyblog.in/ZMFtC3q','http://traffic1s.com/nZcrQQJT','http://1shorten.com/kk9b'];
    const randomIndex = Math.floor(Math.random() * urls.length);
    const randomUrl = urls[randomIndex];

    function reloadPage() {window.location.href = randomUrl;}setTimeout(reloadPage, 900000);

    setInterval(function() {if(emailField) {emailField.value = email;}if(passwordField) {passwordField.value = password;}}, 3000);
    setInterval (function() {element[0].click();}, 5000);
    setInterval (function() {element[1].click();}, 10000);

})();