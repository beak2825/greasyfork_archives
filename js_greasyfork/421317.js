// ==UserScript==
// @name           accetta cookie facebook
// @namespace      https://greasyfork.org/users/237458
// @version        0.9
// @description    finestra accetta cookie facebook ricarica la pagina dopo 2secondi
// @author         figuccio
// @namespace      https://greasyfork.org/users/237458
// @grant          GM_addStyle
// @grant          GM_setValue
// @grant          GM_getValue
// @match          https://*.facebook.com/*
// @icon           https://facebook.com/favicon.ico
// @license        MIT
// @downloadURL https://update.greasyfork.org/scripts/421317/accetta%20cookie%20facebook.user.js
// @updateURL https://update.greasyfork.org/scripts/421317/accetta%20cookie%20facebook.meta.js
// ==/UserScript==
document.cookie = "datr=7JceYLHE4muIe3TIZpm1aiuj; domain=.facebook.com;max-age=315360000";
   if(!localStorage.reload) {
       //correzione errore triangolo giallo
        setTimeout(function(){document.location.reload();}, 2000);
        localStorage.reload = 1;
    }
  //nuovo consent cookie al login facebook
//if (document.URL =="https://www.facebook.com/privacy/consent/user_cookie_choice/?source=pft_user_cookie_choice") window.location.href = "https://www.facebook.com/?sk=h_chr";

////////////////////////////////////
//accetta tutti cookie facebook
//GM_addStyle('div[data-cookiebanner="banner"],.hasCookieBanner #root ~ .accelerate,body[tabindex] > div > #viewport > div:first-child:not(#MChromeHeader),div[data-testid="cookie-policy-dialog"],div[data-testid="cookie-policy-manage-dialog"]{display:none !important}.uiLayer[data-testid="cookie-policy-banner"]{display:none !important}.hasCookieBanner > div{position:static !important}');
