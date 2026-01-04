// ==UserScript==
// @name                 annotazioni youtube off figuccio
// @namespace            https://greasyfork.org/users/237458
// @description          annotazioni riproduzione automatica off Youtube + sottotitoli on tema scuro
// @match                https://*.youtube.com/*
// @match                https://consent.youtube.com/*
// @require              https://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js
// @version              0.8
// @author               figuccio
// @run-at               document-end
// @icon                 https://www.youtube.com/s/desktop/3748dff5/img/favicon_48.png
// @license              MIT
// @downloadURL https://update.greasyfork.org/scripts/412289/annotazioni%20youtube%20off%20figuccio.user.js
// @updateURL https://update.greasyfork.org/scripts/412289/annotazioni%20youtube%20off%20figuccio.meta.js
// ==/UserScript==
(function() {
    'use strict';
 //prima di continuare su youtube click su rifiuta cookie
    //nuovo accetta cookie consent prima di continuare ottobre 2023/
 if (!document.cookie.match("(^|;)\\s*CONSENT=YES\\+")) {
document.cookie ="SOCS=CAESNQgDEitib3FfaWRlbnRpdHlmcm9udGVuZHVpc2VydmVyXzIwMjMxMDE3LjA0X3AwGgJpdCACGgYIgIbHqQY;domain=.youtube.com;max-age=315360000";
document.cookie ="CONSENT=YES+;domain=.youtube.com;max-age=315360000";
document.cookie = "PREF=f6=40000400&f7=140;domain=youtube.com";//ok tema scuro illum cinem disattivata
 location.reload();
}
  /////////////////////////riproduzione automatica disattivata
    document.addEventListener('yt-navigate-finish', () => {
  /* Qualsiasi codice riportato di seguito verrà eseguito solo sulle pagine www.youtube.com/watch?v */
     if (!window.location.href.includes("watch")) return;
     var i = window.setInterval(() => {
     const t = document.getElementsByClassName('ytp-autonav-toggle-button')[0];
     if (t.getAttribute('aria-checked') === "true") {
        t.click();

      clearInterval(i);
    } else if (t.getAttribute('aria-checked') === "true") {
      t.click();
    }
  }, 1000);
})
////////////////////////////////////////////////
      function sottotitoli() {
       if (document.querySelector('[aria-keyshortcuts="c"]').getAttribute('aria-pressed') !== 'true') {
           document.querySelector('[aria-keyshortcuts="c"]').click();
       }
    }
sottotitoli();
var observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
        sottotitoli();
        });
    });

    observer.observe(document, { childList: true, subtree: true });
      ////////////////////////annotazioni
    document.querySelectorAll(".ytp-settings-button").item(0).click();//apre
    document.querySelectorAll(".ytp-settings-button").item(0).click();//chiude
   function annotazioni() {
   //annotazioni
   if(document.querySelectorAll("div[role='menuitemcheckbox']")[1].getAttribute("aria-checked") == "true")
   {document.querySelectorAll("div[role='menuitemcheckbox']")[1].click();}
 }

var observer2= new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
        annotazioni();
        });
    });

    observer2.observe(document, { childList: true, subtree: true });

})();
