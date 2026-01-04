// ==UserScript==
// @name         Better xCloud No VPN - Xbox Cloud Gaming Region Unlocker
// @namespace    https://www.tampermonkey.net/
// @version      1.0.3
// @description  Add-on script for Better xCloud to bypass region restriction (no VPN)
// @match        https://www.xbox.com/*/play*
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/473984/Better%20xCloud%20No%20VPN%20-%20Xbox%20Cloud%20Gaming%20Region%20Unlocker.user.js
// @updateURL https://update.greasyfork.org/scripts/473984/Better%20xCloud%20No%20VPN%20-%20Xbox%20Cloud%20Gaming%20Region%20Unlocker.meta.js
// ==/UserScript==

const FAKE_IP = '9.9.9.9';

let bypassed = false;
const originalFetch = window.fetch;

window.fetch = async (...args) => {
    if (bypassed) {
        return originalFetch(...args);
    }

    const request = args[0];
    const url = (typeof request === 'string') ? request : request.url;

    if (args[0].headers && !url.includes('xhome') && url.endsWith('/v2/login/user')) {
        args[0].headers.set('X-Forwarded-For', FAKE_IP);
        bypassed = true;
    }

    return originalFetch(...args);
}
