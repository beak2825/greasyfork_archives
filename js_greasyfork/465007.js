// ==UserScript==
// @name         Chequity.io : Auto Faucet Claim
// @namespace    chequity.io.auto.faucet.claim
// @version      1.1
// @description  https://ouo.io/vTdw4R
// @author       stealtosvra
// @match        https://chequity.io/earn/faucet
// @icon         https://www.google.com/s2/favicons?sz=64&domain=chequity.io
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/465007/Chequityio%20%3A%20Auto%20Faucet%20Claim.user.js
// @updateURL https://update.greasyfork.org/scripts/465007/Chequityio%20%3A%20Auto%20Faucet%20Claim.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const urls = [
        'https://ouo.io/qYWb6e',
        'https://link1s.com/wpAKI',
        'https://ex-foary.com/3z67FK',
        'http://nx.chainfo.xyz/4T2nRPI',
        'https://try2link.com/dYEu7xX',
        'https://loptelink.com/mRRD6',
        'https://ser2.crazyblog.in/lUDpm7P',
        'https://wplink.online/1iNOON',
        'https://sox.link/wmzr',
        'http://link1s.net/usvCf5',
        'https://moneylink.tk/BbhmNX5f'];

    const randomIndex = Math.floor(Math.random() * urls.length);
    const randomUrl = urls[randomIndex];

    function reloadPage() {window.location.href = randomUrl;}setTimeout(reloadPage, 300000);
    setTimeout(function() {document.querySelector("button[type='submit']").click();}, 7000);

})();