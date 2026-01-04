// ==UserScript==
// @name         faucetcrypto.com
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://www.faucetcrypto.com/external/view-ptc/*
// @match        https://www.faucetcrypto.com/dash/ptc-ads*
// @match        https://www.faucetcrypto.com/dash/generate-ptc-link/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/412053/faucetcryptocom.user.js
// @updateURL https://update.greasyfork.org/scripts/412053/faucetcryptocom.meta.js
// ==/UserScript==

(function() {
    'use strict';

    //while(true) {
        setTimeout(() => {
        console.log('начинаю выполнять 1 скрипт...');
        document.querySelector('#page > div.vx-row.mt-base > div:nth-child(1) > div > div.vx-card__collapsible-content.vs-con-loading__container > div > div.flex.justify-between > button > span.vs-button-text.vs-button--text').click();

        setTimeout(() => {
            console.log('начинаю выполнять 2 скрипт...');
            document.querySelector('#generate-link-btn').click();
            setTimeout(() => {
                console.log('начинаю выполнять 3 скрипт...');
                document.querySelector('#app > div.layout--full-page > div > div > div > header > div.vs-con-items > a > span').click();
               //document.getElementsByClassName('')[0].click();
                    setTimeout(() => {
                    console.log('начинаю выполнять 4 скрипт...');
                    window.location.reload();
                    },5000 );
            },50000 );
        }, 10000);

    }, 10000);
    //}

})();