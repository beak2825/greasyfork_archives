// ==UserScript==
// @name         The Washington Post - Paywall Bypass
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Simple script to bypass paywalls on The Washington Post
// @author       November2246
// @match        https://*.washingtonpost.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=washingtonpost.com
// @grant        none
// @run-at       document-start
// @license      ISC
// @downloadURL https://update.greasyfork.org/scripts/514564/The%20Washington%20Post%20-%20Paywall%20Bypass.user.js
// @updateURL https://update.greasyfork.org/scripts/514564/The%20Washington%20Post%20-%20Paywall%20Bypass.meta.js
// ==/UserScript==

// Hooks responses from */tetro/metering/evaluate ;)
const _parse = JSON.parse;
JSON.parse = function parse() {
    let obj = _parse.apply(this, arguments);

    if (propCheck(obj, ['status', 'action', 'data', 'granted'])) {
        obj.granted = true;
        obj.data.userAttributes.isSubscriber = true;
        obj.data.userAttributes.isAsub = true;
        obj.data.userAttributes.isSignedOutSubscriber = true;
        obj.data.userAttributes.isRestricted = false;
        obj.data.userAttributes.paymentMethod = 'PAYPAL';

        obj.data.targetingAttributes.requiresInlineRegwall = false;
        if (Array.isArray(obj.data.targetingAttributes.targetCodes)) {
            obj.data.targetingAttributes.targetCodes = obj.data.targetingAttributes.targetCodes.filter(x => !String(x).includes('pay'));
        }

        obj.data.token.isAppSubscriber = true;
        obj.data.action = -1;
        obj.action = -1;
    }

    return obj;
};

function propCheck(obj, propertiesArr) {
    const props = Object.getOwnPropertyNames(obj);
    return (props.length === propertiesArr.length) && propertiesArr.every(x => props.includes(x));
}