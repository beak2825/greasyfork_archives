// ==UserScript==
// @name         stockenz.com : Auto Claim (SCAM)
// @namespace    stockenz.com.auto.claim
// @version      1.4
// @description  https://ouo.io/7vhQNl
// @author       stealtosvra
// @match        https://stockenz.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=stockenz.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/463763/stockenzcom%20%3A%20Auto%20Claim%20%28SCAM%29.user.js
// @updateURL https://update.greasyfork.org/scripts/463763/stockenzcom%20%3A%20Auto%20Claim%20%28SCAM%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function navigateToRandomUrl() {

        const urls = ['https://ouo.io/h4GudS','https://loptelink.com/JwNZL2','https://ser2.crazyblog.in/SOoetc6K','http://nx.chainfo.xyz/znkKwKQK','https://ex-foary.com/PN8ywMZ','https://try2link.com/FwWhV6di','https://link1s.com/k3vrWnBu'];
        const randomIndex = Math.floor(Math.random() * urls.length);
        const randomUrl = urls[randomIndex];

        function reloadPage() {window.location.href = randomUrl;}
        setTimeout(reloadPage, 300000);}

    setInterval(function() {function hCaptcha() {return typeof grecaptcha !== 'undefined' && grecaptcha.getResponse().length !== 0;}

        if (hCaptcha()) {const button = document.querySelector(".button");
        if (button) {button.click();}}}, 5000);

})();