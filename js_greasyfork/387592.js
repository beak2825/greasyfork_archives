// ==UserScript==
// @name         Autologin for Live-share
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Autologin for Live-share(microsoft account)
// @author       TKTK
// @match        https://prod.liveshare.vsengsaas.visualstudio.com/*
// @grant        window.close
// @downloadURL https://update.greasyfork.org/scripts/387592/Autologin%20for%20Live-share.user.js
// @updateURL https://update.greasyfork.org/scripts/387592/Autologin%20for%20Live-share.meta.js
// ==/UserScript==

(function() {
    switch(location.pathname){
        case '/auth/login':
            location.href="/auth/identity/microsoft"+location.search;
            //location.href="/auth/identity/github"+location.search;
            break;
        case '/auth/identity/microsoft/callback':
            setTimeout(close,3000);
            break;
    }
})();