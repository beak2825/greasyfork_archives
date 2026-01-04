// ==UserScript==
// @name        Internet Roadtrip Fix Cloudflare Turnstile
// @namespace   jdranczewski.github.io
// @match       https://neal.fun/internet-roadtrip/*
// @version     0.3.1
// @author      jdranczewski
// @description Fix Cloudflare Turnstile performance
// @license     MIT
// @grant       unsafeWindow
// @grant       GM_setValue
// @grant       GM_getValue
// @run-at      document-start
// @downloadURL https://update.greasyfork.org/scripts/546849/Internet%20Roadtrip%20Fix%20Cloudflare%20Turnstile.user.js
// @updateURL https://update.greasyfork.org/scripts/546849/Internet%20Roadtrip%20Fix%20Cloudflare%20Turnstile.meta.js
// ==/UserScript==

(async function() {

// Clear the interval, the widget renews every 5 minutes either way
if (unsafeWindow.turnstileInterval) {
    clearInterval(unsafeWindow.turnstileInterval);
    console.log("Turnstile interval cleared immediately");
} else {
    let _turnstileInterval;
    Object.defineProperty(unsafeWindow, "turnstileInterval", {
        get() {
            return _turnstileInterval;
        },
        set(turnstileInterval) {
            _turnstileInterval = turnstileInterval;
            clearInterval(turnstileInterval);
            console.log("Turnstile interval cleared after a bit");
        },
        configurable: true,
        enumerable: true,
    });
}

// Save the token for 7 minutes, so voting works immediately after reload
function saveToken(token) {
    GM_setValue("IRToken", token);
    GM_setValue("token_date", Date.now());
}
// No token set yet
if (!unsafeWindow.IRToken) {
    const stored_token = GM_getValue("IRToken");
    const stored_date = GM_getValue("token_date");
    if (stored_token && stored_date && (Date.now() - stored_date) < 420000) {
        unsafeWindow.IRToken = stored_token;
    }
}
let _IRToken = unsafeWindow?.IRToken;
Object.defineProperty(unsafeWindow, "IRToken", {
    get() {
        return _IRToken;
    },
    set(IRToken) {
        _IRToken = IRToken;
        saveToken(IRToken);
    },
    configurable: true,
    enumerable: true,
});


})();