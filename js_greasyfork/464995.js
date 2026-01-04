// ==UserScript==
// @name         11Xbit.co.in : Auto Faucet Claim
// @namespace    11xbit.co.in.auto.faucet.claim
// @version      1.1
// @description  https://ouo.io/WrRGAa
// @author       stealtosvra
// @match        https://11bit.co.in/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=11bit.co.in
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/464995/11Xbitcoin%20%3A%20Auto%20Faucet%20Claim.user.js
// @updateURL https://update.greasyfork.org/scripts/464995/11Xbitcoin%20%3A%20Auto%20Faucet%20Claim.meta.js
// ==/UserScript==

(function() {'use strict';

    const urls = ['http://traffic1s.com/BS5PkKF4','http://1shorten.com/bsBY8','https://link1s.com/tiqzFIp','https://sox.link/hBhtGHZ','http://flyearn.site/AvHau','http://link1s.net/zdZVn','https://wplink.online/jz0L','https://try2link.com/w7Bz','https://ser2.crazyblog.in/Kz2i','https://ex-foary.com/TEWqi95','http://nx.chainfo.xyz/cKvLeS4','https://moneylink.tk/FPoC9g5','https://ouo.io/WrRGAa'];
    const randomIndex = Math.floor(Math.random() * urls.length);
    const randomUrl = urls[randomIndex];

    function reloadPage() {window.location.href = randomUrl;}setTimeout(reloadPage, 180000);

    setTimeout(function() {document.querySelector(".btn.btn-primary.btn-lg.claim-button").click();}, 40000);

})();