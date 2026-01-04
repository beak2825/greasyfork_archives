// ==UserScript==
// @name         Mitaku Ads Bypass
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Bypass ads in mitaku
// @author       Yu
// @match        https://mitaku.net/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=mitaku.net
// @license      MIT
// @run-at       document-start
// @grant        GM_webRequest
// @downloadURL https://update.greasyfork.org/scripts/479359/Mitaku%20Ads%20Bypass.user.js
// @updateURL https://update.greasyfork.org/scripts/479359/Mitaku%20Ads%20Bypass.meta.js
// ==/UserScript==


function bypassAds() {
    const ads1 = document.querySelectorAll("iframe");
    if(ads1.length > 0) {
        for(const item of ads1) {
            item.parentElement.removeChild(item);
        }
    }
    

    const ads2 = document.querySelector("#page ~ div");
    if(ads2) ads2.parentElement.removeChild(ads2);
}

(function() {
    'use strict';

    // Block all Ads
    const blockLinks = [
        "https://axwagmfhio.com/*",
        "https://fvcwqkkqmuv.com/*",
        "https://applicationmoleculepersonal.com/*",
        "https://oshoslokkn.com/*",
        "https://limurol.com/*"
    ];

    GM_webRequest( blockLinks.map((link) => (
        { selector: link, action: "cancel"}
    )))

    const script = document.querySelector("script")
    script.parentElement.removeChild(script)

    setInterval(bypassAds, 200)
    bypassAds()
})();