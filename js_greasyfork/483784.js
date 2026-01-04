// ==UserScript==
// @name         private Arceus x neo Key System Bypasser
// @version      1.2
// @description  Bypass the Arceus x neo Key System
// @author       nonculturedperson / dindin
// @match        *://linkvertise.com/*
// @match        *://loot-link.com/*
// @match        *://loot-links.com/*
// @match        *://spdmteam.com/*
// @license      lol
// @namespace    https://greasyfork.org/en/users/1242451
// @downloadURL https://update.greasyfork.org/scripts/483784/private%20Arceus%20x%20neo%20Key%20System%20Bypasser.user.js
// @updateURL https://update.greasyfork.org/scripts/483784/private%20Arceus%20x%20neo%20Key%20System%20Bypasser.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const redirectMap = {
        "https://linkvertise.com/38666/arceus-x-neo?o=sharing": "spdmteam.com/api/keysystem?step=1",
        "https://linkvertise.com/38666/arceus-x-neo-key-system-2?o=sharing": "spdmteam.com/api/keysystem?step=2",
        "https://linkvertise.com/468297/arceus-x-neo-key-system-3?o=sharing": "spdmteam.com/api/keysystem?step=3",
    };

    const currentURL = window.location.href;

    if (currentURL in redirectMap) {
        window.location.replace(`https://${redirectMap[currentURL]}`);
    }

    if (currentURL.includes("https://spdmteam.com/key-system-1?hwid=")) {
        window.location.replace("https://linkvertise.com/38666/arceus-x-neo?o=sharing");
    }

    if (currentURL.includes("https://spdmteam.com/key-system-2?hwid=")) {
        window.location.replace("https://linkvertise.com/38666/arceus-x-neo-key-system-2?o=sharing");
    }

    if (currentURL.includes("https://spdmteam.com/key-system-3?hwid=")) {
        window.location.replace("https://linkvertise.com/468297/arceus-x-neo-key-system-3?o=sharing");
    }

    if (currentURL.includes("loot-links.com/s?")) {
        const scripts = document.getElementsByTagName('script');
    for (let i = 0; i < scripts.length; i++) {
        const script = scripts[i];
        const scriptContent = script.innerHTML;
        if (scriptContent.includes("p['PUBLISHER_LINK']")) {
            const linkRegex = /p\['PUBLISHER_LINK'\]\s*=\s*'(.+?)'/;
            const match = scriptContent.match(linkRegex);
            if (match && match.length > 1) {
                const redirectLink = match[1];
                window.location.replace(redirectLink);
                break;
            }
        }
    }
    }
    if (currentURL.includes("loot-link.com/s?")) {
        const scripts = document.getElementsByTagName('script');
    for (let i = 0; i < scripts.length; i++) {
        const script = scripts[i];
        const scriptContent = script.innerHTML;
        if (scriptContent.includes("p['PUBLISHER_LINK']")) {
            const linkRegex = /p\['PUBLISHER_LINK'\]\s*=\s*'(.+?)'/;
            const match = scriptContent.match(linkRegex);
            if (match && match.length > 1) {
                const redirectLink = match[1];
                window.location.replace(redirectLink);
                break;
            }
        }
    }
    }
})();