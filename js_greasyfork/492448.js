// ==UserScript==
// @name         faucetearner
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  O amanhã poderá ser tarde demais !!!
// @author       keno venas 
// @license      MIT
// @match        https://faucetearner.org/faucet.php
// @icon         https://www.google.com/s2/favicons?sz=64&domain=faucetearner.org
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/492448/faucetearner.user.js
// @updateURL https://update.greasyfork.org/scripts/492448/faucetearner.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function verificarContador() {
        var contador = parseInt(document.querySelector('b#second').innerText);
        if (contador === 50) {
            document.querySelector('button.m-auto').click();
        }
    }
    setInterval(verificarContador, 1000);
})();