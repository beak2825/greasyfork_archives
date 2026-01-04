// ==UserScript==
// @name         Stop Youtube Autoplay figuccio
// @namespace    https://greasyfork.org/users/237458
// @match        https://www.youtube.com/*
// @match        https://consent.youtube.com/*
// @run-at       document-end
// @noframes
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @description  Stop Youtube video +stop riproduzione automatica novembre 2023
// @icon         https://www.youtube.com/s/desktop/3748dff5/img/favicon_48.png
// @version      0.3
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/460412/Stop%20Youtube%20Autoplay%20figuccio.user.js
// @updateURL https://update.greasyfork.org/scripts/460412/Stop%20Youtube%20Autoplay%20figuccio.meta.js
// ==/UserScript==
(function() {
    'use strict';
 // Funzione per fare clic sul pulsante "Accetta" dei cookie e impostare le preferenze marzo 2024
    function accettaCookieEImpostaPreferenze() {
        var accettaButton = document.querySelector("#content > div.body.style-scope.ytd-consent-bump-v2-lightbox > div.eom-buttons.style-scope.ytd-consent-bump-v2-lightbox > div:nth-child(1) > ytd-button-renderer:nth-child(2) > yt-button-shape > button > yt-touch-feedback-shape > div > div.yt-spec-touch-feedback-shape__fill");
        if (accettaButton) {
            accettaButton.click(); // Fai clic sul pulsante "Accetta"
            console.log("Pulsante 'Accetta' dei cookie su YouTube cliccato!");

            // Imposta i cookie per le preferenze
            document.cookie ="PREF=f6=40000400&f7=140;domain=.youtube.com"; // Imposta il tema scuro, l'illuminazione cinematografica disattivata, ecc.
            console.log("Preferenze impostate!");
        } else {
            console.log("Pulsante 'Accetta' dei cookie su YouTube non trovato.");
        }
    }

    // Attendi che il documento sia completamente caricato prima di fare clic sul pulsante e impostare le preferenze
    window.addEventListener('load', function() {
        setTimeout(accettaCookieEImpostaPreferenze, 3000); // Imposta un ritardo di 3 secondi prima di fare clic sul pulsante e impostare le preferenze (modificabile a seconda delle esigenze)
    });
/////////////////////////riproduzione automatica disattivata
document.addEventListener('yt-navigate-finish', () => {
  // Il codice sarà eseguito solo sulle pagine www.youtube.com/watch?v
  if (!window.location.href.includes("watch")) return;
  var i = window.setInterval(() => {
    const t = document.getElementsByClassName('ytp-autonav-toggle-button')[0];
    if (t.getAttribute('aria-checked') === "true") {
      t.click();
      clearInterval(i); // Interrompe il loop quando la riproduzione automatica è disattivata
    }
  }, 1000);
});

})();
