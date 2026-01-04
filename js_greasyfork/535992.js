// ==UserScript==
// @name         StarTribune.com Paywall Bypass
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  None
// @author       November2246
// @match        https://startribune.com/*
// @match        https://*.startribune.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=startribune.com
// @grant        none
// @run-at       document-start
// @license      ISC
// @downloadURL https://update.greasyfork.org/scripts/535992/StarTribunecom%20Paywall%20Bypass.user.js
// @updateURL https://update.greasyfork.org/scripts/535992/StarTribunecom%20Paywall%20Bypass.meta.js
// ==/UserScript==

const _create = Object.create;
Object.create = function create() {
    if (!arguments[0]) return {};
    return _create.apply(this, arguments);
}

Object.defineProperty(Object.prototype, 'isPaywallEnabled', {
    get() { return false; },
    set(v) {}
});

