// ==UserScript==
// @name        Clarin no paywall
// @namespace   dsr-clarin
// @version     2.0.0
// @description Saltear la ventana de login en clarin.com, incluso en Google Translate
// @author      DSR!
// @match       *://*.clarin.com/*
// @match       *://www-clarin-com.translate.goog/*
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/374441/Clarin%20no%20paywall.user.js
// @updateURL https://update.greasyfork.org/scripts/374441/Clarin%20no%20paywall.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log('[PAYWALL] Cleaned! - Ojala los medios se consigan un laburo honrado');
    const googleTranslate = "https://translate.google.com/translate?sl=auto&tl=es&u=";

    document.querySelectorAll("a[href]").forEach((link) => {
        if (link.href.includes("clarin.com") && !link.href.includes("translate.google.com")) {
            link.href = googleTranslate + encodeURIComponent(link.href);
        }
    });

})();
