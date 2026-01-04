// ==UserScript==
// @name            Redirect Youtube Logo to Subscriptions
// @namespace       https://tempermonkey.net
// @description     Redirect YouTube logo to your subscription feed. Works with both free and premium.
// @version         1.0.0
// @include         *://*.youtube.tld/*
// @author          CHJ85
// @downloadURL https://update.greasyfork.org/scripts/376132/Redirect%20Youtube%20Logo%20to%20Subscriptions.user.js
// @updateURL https://update.greasyfork.org/scripts/376132/Redirect%20Youtube%20Logo%20to%20Subscriptions.meta.js
// ==/UserScript==

async function WaitForPageLoad() {
    while (true) {
        var logoLoaded = document.querySelector("a[id='logo']") !== null;
        var userLoggedIn = document.querySelector("div[id='buttons'] img[id='img'][alt='Avatar image']") !== null;
        var userLoggedOut = document.querySelector("div[id='end'] [id='button'][aria-label='Sign in']") !== null;

        if (logoLoaded && (userLoggedIn || userLoggedOut)) {
            if (userLoggedIn) {
                RunScript();
            }
            return;
        }
        await new Promise(r => setTimeout(r, 100));
    }
}

function RunScript() {
    var logos = document.querySelectorAll("a[id='logo']");
    logos.forEach(logo => {
        logo.addEventListener("click", LogoClick);
    });
}

function LogoClick(event) {
    event.preventDefault();
    event.stopPropagation();
    var subLink = document.querySelector("a[href='/feed/subscriptions']");
    if (subLink) {
        subLink.click();
    } else {
        console.log("[YTLTSF] Subscriptions link not found");
    }
}

WaitForPageLoad();