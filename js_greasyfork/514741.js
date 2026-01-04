// ==UserScript==
// @name         The Boston Globe - Paywall Bypass
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Simple script to bypass the paywall on The Boston Globe
// @author       November2246
// @match        https://*.bostonglobe.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bostonglobe.com
// @grant        none
// @run-at       document-start
// @license      ISC
// @downloadURL https://update.greasyfork.org/scripts/514741/The%20Boston%20Globe%20-%20Paywall%20Bypass.user.js
// @updateURL https://update.greasyfork.org/scripts/514741/The%20Boston%20Globe%20-%20Paywall%20Bypass.meta.js
// ==/UserScript==

const { log, warn, error, debug } = window.console;

Object.defineProperty(window, 'bg', {
    get() {
        return this._bg;
    },
    set(bg) {
        if (typeof bg.globalTracking === 'object') {
            bg.globalTracking.loginType = 'logged out';
            bg.globalTracking.meterNumber = 0;
            bg.globalTracking.paywallCount = 0;
            bg.globalTracking.paywallType = 'none';
            bg.globalTracking.paywall = false;
            bg.globalTracking.freeviewArticleCount = '';
        }

        if (typeof bg.meterStatus === 'object') {
            bg.meterStatus.contentSeen = [];
            bg.meterStatus.exemptFromMeter = true;
            bg.meterStatus.requestedContentExemptFromMeter = true;
        }

        if (typeof bg.page === 'object') {
            bg.page.exemptFromMeter = true;
            bg.page.fbiaArticleTier = 'free';
        }

        this._bg = bg;
    },
});

Object.defineProperties(Object.prototype, {
    subOnlyArticle: {
        get() {
            return false;
        },
        set() {}
    },
    exemptFromMeter: {
        get() {
            return true;
        },
        set() {}
    }
});