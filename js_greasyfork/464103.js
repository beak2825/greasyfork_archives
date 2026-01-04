// ==UserScript==
// @name         bspin.io : Auto Faucet
// @namespace    bspin.io.auto.faucet
// @version      1.4
// @description  https://ouo.io/d6WLKFY
// @author       stealtosvra
// @match        https://bspin.io/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bspin.io
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/464103/bspinio%20%3A%20Auto%20Faucet.user.js
// @updateURL https://update.greasyfork.org/scripts/464103/bspinio%20%3A%20Auto%20Faucet.meta.js
// ==/UserScript==

(function() {

    'use strict';
    const button = document.querySelectorAll('button.xbtn.large');
    const h2Element = document.querySelector("h2.flex.space-between");
    const spanElement = document.querySelector('.progress-bar h2 span');

    const urls = ['https://ouo.io/beKq2b',
                  'https://link1s.com/F6fuUT9',
                  'https://ex-foary.com/XGhtx4M',
                  'http://nx.chainfo.xyz/vcBOYq',
                  'https://mitly.us/VYPKgF6',
                  'https://try2link.com/QVhYNe',
                  'https://loptelink.com/mRRD6'];

    const randomIndex = Math.floor(Math.random() * urls.length);
    const randomUrl = urls[randomIndex];

    function reloadPage() {window.location.href = randomUrl;}setTimeout(reloadPage, 300000);
    function hCaptcha() {return grecaptcha && grecaptcha.getResponse().length !== 0;}

    setTimeout(() => {if (document.querySelectorAll("button.xbtn.large")[0]) {document.querySelectorAll("button.xbtn.large")[0].click();}}, 5000);
    setInterval(() => {if (hCaptcha()) {if (document.querySelectorAll("button.xbtn.size-xl.margin-top-32")[0]) {document.querySelectorAll("button.xbtn.size-xl.margin-top-32")[0].click();}}}, 5000);

})();
