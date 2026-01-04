// ==UserScript==
// @name         New York Times - Paywall & Regiwall Bypass
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Simple script to bypass the paywall and regiwall on New York Times via hooking fetch
// @author       November2246
// @match        https://*.nytimes.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=nytimes.com
// @grant        unsafeWindow
// @run-at       document-start
// @license      ISC
// @downloadURL https://update.greasyfork.org/scripts/514556/New%20York%20Times%20-%20Paywall%20%20Regiwall%20Bypass.user.js
// @updateURL https://update.greasyfork.org/scripts/514556/New%20York%20Times%20-%20Paywall%20%20Regiwall%20Bypass.meta.js
// ==/UserScript==

const _fetch = unsafeWindow.fetch;
unsafeWindow.fetch = function fetch() {
    if (arguments[0].includes('/svc/onsite-messaging/query') && arguments[1]?.method === 'POST') return Promise.reject();
    return _fetch.apply(this, arguments);
}