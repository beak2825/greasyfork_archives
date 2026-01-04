// ==UserScript==
// @name         ReturnMetadataLayout
// @license MIT
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Revert web_channel_metadata_layout to bottom layout
// @author       You
// @match        https://www.twitch.tv/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=twitch.tv
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/520454/ReturnMetadataLayout.user.js
// @updateURL https://update.greasyfork.org/scripts/520454/ReturnMetadataLayout.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const symbol = Symbol();
    Object.defineProperty(Object.prototype, 'web_channel_metadata_layout', {
        get: function () {
            if (typeof this === 'undefined' || this === null) return undefined;
            return this[symbol];
        },
        set: function (value) {
            if (typeof this === 'undefined' || this === null) return undefined;
            if (typeof value !== 'undefined' && value !== null && typeof value.default === 'string') {
                value.default = 'control';
            }
            this[symbol] = value;
        }
    });
})();