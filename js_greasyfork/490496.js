// ==UserScript==
// @name          facebook clickseemore + clearRecentLogins figuccio
// @namespace     https://greasyfork.org/users/237458
// @version       0.5
// @description   rimuove login recenti ed espande Altro...
// @author        figuccio
// @namespace     https://greasyfork.org/users/237458
// @match         https://*.facebook.com/*
// @grant         GM_addStyle
// @grant         GM_registerMenuCommand
// @require       https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js
// @run-at        document-start
// @icon          https://facebook.com/favicon.ico
// @license        MIT
// @downloadURL https://update.greasyfork.org/scripts/490496/facebook%20clickseemore%20%2B%20clearRecentLogins%20figuccio.user.js
// @updateURL https://update.greasyfork.org/scripts/490496/facebook%20clickseemore%20%2B%20clearRecentLogins%20figuccio.meta.js
// ==/UserScript==
(function() {
    'use strict';
    //accetta cookie
 function isLoginPage() {
    return document.querySelector('form[action*="/login"]') !== null;
    }
    // Verifica se sei sulla pagina di login al caricamento della pagina
    if (isLoginPage()) {
        console.log('Sei sulla pagina di login di Facebook');
document.cookie = "datr=LVSeZ6822RyG0BNdfQNdbC3d; domain=.facebook.com; max-age=315360000";
//accetta tutti cookie facebook
GM_addStyle('div[data-cookiebanner=\"banner\"],.hasCookieBanner #root ~ .accelerate,body[tabindex] > div > #viewport > div:first-child:not(#MChromeHeader),div[data-testid=\"cookie-policy-dialog\"],div[data-testid=\"cookie-policy-manage-dialog\"]{display:none !important}.uiLayer[data-testid=\"cookie-policy-banner\"]{display:none !important}.hasCookieBanner > div{position:static !important}');
 if(!localStorage.reload) {
       //correzione errore triangolo giallo
      setTimeout(function(){document.location.reload();}, 2000);
      localStorage.reload = 1;
    }
    }

       //nuovo consent cookie al login facebook
if (document.URL =="https://www.facebook.com/two_step_verification/authentication/?encrypted_context=AWORbOl-6WUhspgD_PRex_sx-CcNd0rzSB8NpYs5J5A7J4i4h9xY-kmv08gpZrh8iKcZbwfJQxn3nX6nM7s7goKVUPmF0Xbm4D3vaB4U_Ffxqf0ak4WBRTyKha7lqZ5_7uzSvzPUqGEvQzhCyaJb5btWFFmWVX8YZmSy4E-dY5V1cL1k-VE3XdEBk48T1iVA4ky4hkPRkHYuiMm5DGAcSw6RGqkPsScxyvX01ADzM39-I7Z55GUPDajE8h-aqaJelDPb8jmfz0ZxPEfpbPjFI7mXG4BNo7ii_PhYX7q8K0AxcW7LeDaIQa-VMytDZMRwW7uNpmVk1ae_rf6Ep5EURhrAkYUfom6kGnJOuMJwo7Zad8Y5LRp2wIxNv-QhflSwD67cfT1PPcP7axAv_AGdecuyUBPCb6ZrqgnLMnzIEHfHtJuibJzcMk_DVvPFRWNp_530_706xm4H4LbW15A6vmHo_nFeUStlHKgR4NlX2eBVyocyUCMi1VM2V2m6f2K99O3yMUkXFchHiMLnwK_a05csEWxGetzV_EgKo5GAjTBTK6CJ6tdIfsY-6AsI89iJ1Yx5i2Up3yc7KF11yYbneU5C3ospNpglXsOcCnWDudYdu0l6HL2lJti83cR14hfPj5EjU5fwpMG4K6uijgHKyes-e1nLSz0wqmc5TQK410sJIDI-8raIeXngKj-EMaITakXlASAxVmVFq4MmAzHi0CrgS0GYl_i5QzCYJa8tmiQXvdeg&flow=pre_authentication&next") window.location.href = "https://www.facebook.com/";

/////////////////////////////////
//2 funzioni in una dopo che la pagina e carica
var $ = window.jQuery;
$(document).ready(function() {
   //multi lingue funzione espandi seemore Altro...
   var l_foundButton = false;
   function clickseemore(){
   if (document.URL.match(/facebook.com\/*(\?.*)*/)) {
   var adbutts=document.querySelectorAll('.x1iyjqo2');
   for(var i=0;i<adbutts.length;i++) {
   if (adbutts[i].textContent=='Altro...'|| adbutts[i].textContent === 'See more'|| adbutts[i].textContent === 'Ver más' || adbutts[i].textContent === 'Afficher la suite' || adbutts[i].textContent === 'Mehr ansehen'){
   adbutts[i].click();
   l_foundButton = true;
        }
    }
 }
}

// Chiama clickButton ogni 1000 millisecondi (1 secondo) finché il pulsante non viene trovato
var intervalId = setInterval(() => {
    if (!l_foundButton) {
        clickseemore();
    } else {
      clearInterval(intervalId); //Interrompere l'intervallo una volta cliccato il pulsante
    }
}, 3000);
 clickseemore();
 GM_registerMenuCommand("Altro",clickseemore);
  //////////////////no login recent
 window.setTimeout(clearRecentLogins,100);
 function clearRecentLogins() {
 if(!document.querySelectorAll('.removableItem a[role="button"][ajaxify^="/login/device-based"]').length)
 {return;}
 var x=document.querySelectorAll('.removableItem a[role="button"][ajaxify^="/login/device-based"]');
  for(var i=0;i<x.length;i++)
        {x[i].click();}
    }
    ////////////

    })();
})();
