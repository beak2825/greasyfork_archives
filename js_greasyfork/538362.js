// ==UserScript==
// @name                Blogspot remove sensitive warning
// @namespace           https://greasyfork.org/users/821661
// @match               https://*.blogspot.com/*
// @match               https://www.blogger.com/interstitial/blog*
// @grant               GM_xmlhttpRequest
// @version             1.3
// @author              hdyzen
// @description         try remove sensitive content warning in blogspot
// @license             GPL-3.0-only
// @downloadURL https://update.greasyfork.org/scripts/538362/Blogspot%20remove%20sensitive%20warning.user.js
// @updateURL https://update.greasyfork.org/scripts/538362/Blogspot%20remove%20sensitive%20warning.meta.js
// ==/UserScript==

async function exec() {
    const removeInterstitial = () => {
        const iframe = document.querySelector("body > #injected-iframe[src*='/interstitial/']");
        const style = document.querySelector("body > style");
        const links = document.querySelectorAll("a[href]");

        iframe?.remove();
        style?.remove();

        for (const link of links) {
            link.addEventListener("click", e => {
                e.stopImmediatePropagation();
                e.stopPropagation();
            });
        }
    };

    if (!location.search.includes("u=https://")) {
        removeInterstitial();
        return;
    }

    const search = new URLSearchParams(location.search);

    GM_xmlhttpRequest({
        url: search.get("u"),
        responseType: "document",
        headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36",
        },
        onload: e => {
            document.documentElement.innerHTML = e.response.documentElement.innerHTML;
            removeInterstitial();
        },
    });
}
exec();
