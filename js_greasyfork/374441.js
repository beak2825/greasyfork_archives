// ==UserScript==
// @name        Clarin no paywall
// @namespace   dsr-clarin
// @version     2.1.0
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

    console.log('[Clarin no paywall] Start! - Lo que falta que la gente tenga que pagar para que le mientan');

    const patchLinks = async () => {
        const googleTranslate = "https://translate.google.com/translate?sl=auto&tl=es&u=";

        document.querySelectorAll("a[href]").forEach((link) => {
            if (link.href.includes("clarin.com") && !link.href.includes("translate.google.com")) {
                link.href = googleTranslate + encodeURIComponent(link.href);
            }
        });
    };

    const patchVideos = async () => {
        const TARGET = "www-clarin-com.translate.goog";
        const REPLACEMENT = "www.clarin.com";

        document.querySelectorAll("video").forEach(video => {
            if (video.src && video.src.includes(TARGET)) {
                video.src = video.src.replace(TARGET, REPLACEMENT);
                video.load();
            }
        });
    };

    const patchUI = async () => {
        // elimino mierda de ventana molesta
        const spam = document.getElementById("intro-placement");
        if (spam) {
            spam.style.display = "none";
        }

        // elimino ventana de google
        const google = document.getElementById("gt-nvframe");
        if (google) {
            google.style.display = "none";
        }

        // blah blah
        document.querySelectorAll('md-dialog[type="alert"][open]').forEach(
            alertNode => alertNode.remove()
        );
    };

    const observer = new MutationObserver(() => {
        patchLinks();
        patchVideos();
        patchUI();
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();
