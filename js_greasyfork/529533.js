// ==UserScript==
// @name         SimplicityBlock
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  The lightest, most unobtrusive and safest ad blocker that blocks almost all ads.
// @description:hi  सबसे हल्का, गैर-दखल देने वाला और सुरक्षित विज्ञापन अवरोधक जो लगभग सभी विज्ञापनों को रोकता है।
// @description:es  El bloqueador de anuncios más ligero, no intrusivo y seguro que bloquea casi todos los anuncios.
// @description:de  Der leichteste, unaufdringlichste und sicherste Werbeblocker, der fast alle Anzeigen blockiert.
// @description:ja  ほぼすべての広告をブロックする、最も軽く、最も目立たず、最も安全な広告ブロッカー。
// @description:ru  Самый легкий, ненавязчивый и безопасный блокировщик рекламы, блокирующий практически всю рекламу.
// @description:pl  Najlżejszy, najbardziej dyskretny i najbezpieczniejszy bloker reklam, który blokuje niemal wszystkie reklamy.
// @author       Winverse
// @icon         https://i.ibb.co/r1ZSFgR/Projekt-bez-nazwy.png
// @match        *://*/*
// @grant        none
// @license      ARR
// @downloadURL https://update.greasyfork.org/scripts/529533/SimplicityBlock.user.js
// @updateURL https://update.greasyfork.org/scripts/529533/SimplicityBlock.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // List of ad provider keywords (all lowercase for consistency)
    const adKeywords = [
        "adsense", "googleads", "youtubeads", "doubleclick", "gstatic", "adcash",
        "ad-maven", "ezoic", "admob", "inmobi", "taboola", "luna", "adsterra",
        "media.net", "publist", "amazonpublisher", "amazon ads", "facebookads", "pubmatic",
        "popads", "propellerads", "bidvertiser", "smartyads", "evadav", "eporn", "rollerads",
        "mgid", "mobileads", "adform", "adspeed", "zedo", "advendio", "mediasmart", "passendo",
        "revive", "sizmek", "uprival", "openx", "lotame", "dataxu", "sovrn", "unityads"
    ];

    // Create a regex pattern from keywords
    const pattern = new RegExp(adKeywords.join("|"), "i");

    function removeAds() {
        const iframes = document.querySelectorAll("iframe");

        iframes.forEach(iframe => {
            if (pattern.test(iframe.src)) {
                console.log(`[SimplicityBlock] Removed ad iframe: ${iframe.src}`);
                iframe.remove();
            }
        });
    }

    // Run on page load and observe DOM changes
    removeAds();
    new MutationObserver(removeAds).observe(document.body, { childList: true, subtree: true });

})();
