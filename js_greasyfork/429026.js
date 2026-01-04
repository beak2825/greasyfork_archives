// ==UserScript==
// @name         VEJA Anti-Paywall
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Remove o Paywall no site da VEJA
// @author       DemoComPW
// @license      MIT
// @match        https://veja.abril.com.br/*
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/429026/VEJA%20Anti-Paywall.user.js
// @updateURL https://update.greasyfork.org/scripts/429026/VEJA%20Anti-Paywall.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function unlockPaywall() {
            document.querySelector('.piano-offer-overlay').style.display = 'none';
            document.getElementById('piano_offer').style.display = 'none';
            //document.querySelector('body').style = '';
            document.body.classList.remove('disabledByPaywall');
    }
    GM_registerMenuCommand("Remove Paywall", unlockPaywall);
    window.addEventListener( "message", function (e) {
        //e.stopPropagation();
        //if (e.data.action == 'showOffer') {
        if (typeof e.data.eventLabel != undefined && e.data.eventLabel == "Bloqueio contabilizado") {
            //setTimeout(function() {
            console.log('Rodando anti-paywall');
            unlockPaywall();
            //}, 1);
        }
        //var eData = JSON.parse(e.data);
        //console.log('RODOU', e.data.action, e);
    }, true);

})();
