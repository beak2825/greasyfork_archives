// ==UserScript==
// @name         tetew njiir eue siherp ahexa samehadaku.tv
// @namespace    njiir
// @version      1.5
// @description  redirect website dari samehadaku.tv
// @author       Reissfeld
// @match        https://www.tetew.info/*
// @match        https://www.njiir.com/*
// @match        https://www.siherp.com/*
// @match        https://eue.siherp.com/*
// @match        https://www.anjay.info/*
// @match        https://www.ahexa.com/*
// @require      http://code.jquery.com/jquery-latest.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/385174/tetew%20njiir%20eue%20siherp%20ahexa%20samehadakutv.user.js
// @updateURL https://update.greasyfork.org/scripts/385174/tetew%20njiir%20eue%20siherp%20ahexa%20samehadakutv.meta.js
// ==/UserScript==
'use strict';
safelink = {
             counter: 0,
             recent_url: 'https://www.njiir.com',
             adblock: false,
             openinnewtab: true,
             click2x: true,
             click2xratio: 2,
             adblocktext: 'njir ketauan pake adblok',
             linkcopied: 'Link copied!',
             scrollbottom: 'Scroll to bottom',
             errorurl: 'Please input valid URL',
             pleasewait: 'Mantan lo ternyata',
             visitlink: 'selangkangannya bau',
             click2xtext: 'digangbang bapak2 siskamling 3x'
         }
(function() {
    'use strict';
if (location.hostname == "www.ahexa.com") {
         var ahexa = $("a[rel='nofollow']").attr('href');
         var spl = ahexa.split("=");
         var b64 = atob(spl[1])
         document.location = b64;
     }
})();
 $(document).ready(function() {
     if (location.hostname == "www.anjay.info") {
         changeLink();
     }
     else if (location.hostname == "www.tetew.info") {
         var tetew = $("a[rel='nofollow']").attr('href');
         document.location = tetew;
     }
     else if (location.hostname == "www.siherp.com") {
         var siherp = $("a[rel='nofollow']").attr('href');
         document.location = siherp;
     }
     else if (location.hostname == "eue.siherp.com") {
         var eue = window.location.href;
         var spl = eue.split("=");
         var b64 = atob(spl[1])
         document.location = b64;
     }
     else if (location.hostname == "www.njiir.com") {
         function ye() {setTimeout(function () {
             var result = document.getElementsByTagName('a')[4];
             result.click();
         },1000)};
         setTimeout(function () {
             var result = document.getElementsByTagName('a')[4];
             result.click();
             ye();
         },1000);
     }
})();