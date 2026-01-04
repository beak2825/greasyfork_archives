// ==UserScript==
// @name         Exhentai & E-Hentai Switcher
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  This script is for switching between exhentai.org and e-hentai.org on the gallery page
// @match        *://exhentai.org/g/*
// @match        *://e-hentai.org/g/*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/517358/Exhentai%20%20E-Hentai%20Switcher.user.js
// @updateURL https://update.greasyfork.org/scripts/517358/Exhentai%20%20E-Hentai%20Switcher.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const currentDomain = window.location.hostname;
    const targetDomain = currentDomain === "exhentai.org" ? "e-hentai.org" : "exhentai.org";

    const gtbElement = document.querySelector(".gtb");
    if (!gtbElement) return;

    const button = document.createElement("button");
    button.textContent = `Open in ${targetDomain}`;
    button.style.marginRight = "580px";
    button.style.padding = "3px 15px";
    button.style.backgroundColor = "#FF0000";
    button.style.color = "white";
    button.style.border = "none";
    button.style.borderRadius = "5px";
    button.style.cursor = "pointer";

    button.addEventListener("click", function() {
        const currentUrl = window.location.href;
        let newUrl;

        if (currentUrl.includes("exhentai.org")) {
            newUrl = currentUrl.replace("exhentai.org", "e-hentai.org");
        } else if (currentUrl.includes("e-hentai.org")) {
            newUrl = currentUrl.replace("e-hentai.org", "exhentai.org");
        }

        if (newUrl) window.location.href = newUrl;
    });

    gtbElement.insertBefore(button, gtbElement.firstChild);
})();
