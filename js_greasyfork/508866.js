// ==UserScript==
// @name         accetta e chiudi cookie figuccio
// @namespace    https://greasyfork.org/users/237458
// @version      1.5
// @description  Clicca automaticamente su accetta cookie
// @author       figuccio
// @match        *://*/*
// @exclude      https://www.giuseppefava.com/creare-registry-hack/
// @exclude      https://www.youtube.com/
// @exclude      https://*.facebook.com/*
// @exclude      https://consent.youtube.com/d?continue=https://www.youtube.com/%3Fcbrd%3D1&gl=IT&m=0&pc=yt&oyh=1&cm=6&hl=it&src=4
// @exclude      https://accounts.google.com/v3/signin/accountchooser?continue=http%3A%2F%2Fdrive.google.com%2F%3Futm_source%3Den&flowEntry=ServiceLogin&flowName=GlifWebSignIn&ifkv=AdBytiMQYrqsoyzLdsEsn5MersxrHXu6z9_t0VP3cDQRxaq-1aKbPfDweSHGmAy6xbciIlMzE28v&ltmpl=drive&passive=true&service=wise&usp=gtd&utm_campaign=web&utm_content=gotodrive&utm_medium=button&dsh=S-768872163%3A1752349996155876
// @exclude      https://accounts.google.com/v3/signin/speedbump/passkeyenrollment?TL=AMbiOOQ-qcynFZGdDopKtKmsArV6uxlGp_ZzchUYgrqPbuVfd_EBg-8GZO92isIx&checkConnection=youtube%3A780&checkedDomains=youtube&continue=http%3A%2F%2Fdrive.google.com%2F%3Futm_source%3Den&dsh=S1881832875%3A1757944508780288&flowEntry=ServiceLogin&flowName=GlifWebSignIn&ifkv=AfYwgwVrfneZdYlMGpfYhQnFHsmPdiaNJrARaujRv96rXPSxs585wWCbv_hR-_MipQA8JeB5-smBtA&ltmpl=drive&pstMsg=1&service=wise
// @run-at       document-start
// @icon         https://www.google.com/favicon.ico
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/508866/accetta%20e%20chiudi%20cookie%20figuccio.user.js
// @updateURL https://update.greasyfork.org/scripts/508866/accetta%20e%20chiudi%20cookie%20figuccio.meta.js
// ==/UserScript==
(function() {
    'use strict';
    // Funzione per cercare e cliccare sull'elemento
    function clickOnAccept() {
     const elements = document.querySelectorAll('*');
     elements.forEach(element => {
     if (element.textContent.includes('Rifiuta') ||
     element.textContent.includes('Accetta e chiudi')||
     element.textContent.includes('Rifiuta tutti')||
     element.textContent.includes('Accetta tutti')||
     element.textContent.includes('Continua senza accettare')||
     element.textContent.includes('Accept all cookies')||
     element.textContent.includes('Declina')||
     element.textContent.includes('accetta tutto e continua')||
     element.textContent.includes('Non ora')||
     element.textContent.includes('Consentire')||
     element.textContent.includes('Solo essenziali')||
     element.textContent.includes('Essential Cookies Only')) {
     element.click();
            }
        });
    }

    // Esegui la funzione al caricamento della pagina
    window.addEventListener('load', function() {
        // Ripeti la funzione dopo secondi
        setTimeout(clickOnAccept, 500);
    });
    /////////////////////////////////
})();


