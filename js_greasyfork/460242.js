// ==UserScript==
// @name         Disable Youtube autoplay figuccio
// @namespace    https://greasyfork.org/users/237458
// @description  Disabilita riproduzione automatica permanente
// @author       figuccio
// @run-at       document-start
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @noframes
// @icon         https://www.youtube.com/s/desktop/3748dff5/img/favicon_48.png
// @grant        GM_registerMenuCommand
// @version      0.2
// @match        https://*.youtube.com/*
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/460242/Disable%20Youtube%20autoplay%20figuccio.user.js
// @updateURL https://update.greasyfork.org/scripts/460242/Disable%20Youtube%20autoplay%20figuccio.meta.js
// ==/UserScript==
(function() {
    'use strict';
//prima di continuare su youtube click su rifiuta cookie
var timerconsent;

timerconsent =setInterval(function(){document.querySelector("#content > div.body.style-scope.ytd-consent-bump-v2-lightbox > div.eom-buttons.style-scope.ytd-consent-bump-v2-lightbox > div:nth-child(1) > ytd-button-renderer:nth-child(1) > yt-button-shape > button > yt-touch-feedback-shape > div > div.yt-spec-touch-feedback-shape__fill").click();}, 1000);

// Dopo 9 secondi, fermiamo il timer utilizzando la funzione clearInterval()
setTimeout(function() {
  clearInterval(timerconsent);
}, 9000);

/////////////////////////////////////////////////////////f7 illum cinema
document.cookie = "PREF=f6=40000400&f7=140;domain=youtube.com";//ok tema scuro illum cinem disattivata
if(!localStorage.reload) {
 setTimeout("document.location.reload()",2000);
 localStorage.reload = 1;
    }
//////////////////////////////riproduzione automatica disattivata febbraio 2023
    function toggleAutoplayIfOn() {
        let autoplayButton = document.getElementsByClassName('ytp-autonav-toggle-button')[0];
        let autoplayEnabled = autoplayButton && autoplayButton.getAttribute('aria-checked') === 'true';
        if (autoplayEnabled) {
            console.log("proverà ora a disattivare la riproduzione automatica.");
            autoplayButton.click();
        }
    }

    toggleAutoplayIfOn();
    var observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
        toggleAutoplayIfOn();
        });
    });

    observer.observe(document, { childList: true, subtree: true });
})();
