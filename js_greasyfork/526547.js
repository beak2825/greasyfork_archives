// ==UserScript==
// @name         Meneame.net - Edición EDN
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  Mejora la visibilidad de ciertos enlaces en Menéame que requieren de una cuenta para ver las respuestas
// @author       ᵒᶜʰᵒᶜᵉʳᵒˢ
// @match        *://*.meneame.net/*
// @run-at       document-end
// @icon         https://www.meneame.net/favicon.ico
// @grant        none
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/526547/Meneamenet%20-%20Edici%C3%B3n%20EDN.user.js
// @updateURL https://update.greasyfork.org/scripts/526547/Meneamenet%20-%20Edici%C3%B3n%20EDN.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const A_N_D = ["://twitter.com", "://www.twitter.com", "://x.com", "://www.x.com"];
    const N_N_D = "://xcancel.com";
    const A_G_S = "x.com/i/grok/share";

    function replaceDomainInLinks() {
        document.querySelectorAll('a[href]').forEach(link => {
            A_N_D.forEach(oldDomain => {
                if (link.href.includes(oldDomain) && !link.href.includes(A_G_S)) {
                    link.href = sanitizeURL(link.href.replace(oldDomain, N_N_D));
                    link.removeAttribute("class");
                }
            });
        });
    }

    function sanitizeURL(url) {
        return url.replace(/\?.*$/, '').replace('/mediaViewer','');
    }

    replaceDomainInLinks();

    const Nuremberg = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            if (mutation.type === 'childList') {
                replaceDomainInLinks();
            }
        });
    });

    Nuremberg.observe(document.body, { childList: true, subtree: true });

})();