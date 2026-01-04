// ==UserScript==
// @name         Big Coins
// @namespace    http://tampermonkey.net/
// @version      0.0.1
// @author       Big watermelon
// @license      MIT
// @description  shows coins bigger
// @match        *://agma.io/*
// @grant        unsafeWindow
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/524876/Big%20Coins.user.js
// @updateURL https://update.greasyfork.org/scripts/524876/Big%20Coins.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if (unsafeWindow.top !== unsafeWindow.self || document.querySelector("title")?.textContent?.includes("Just a moment"))
        return;

    const SIZE = 300;

    let overwritten = false;
    const originalPush = unsafeWindow.Array.prototype.push;
    unsafeWindow.Array.prototype.push = function(elem) {
        if (!overwritten && elem?.namePart !== undefined) {
            Object.defineProperty(elem.constructor.prototype, 'size', {
                set: function(size) {
                    return this._size = size;
                },
                get: function() {
                    return this.a == 13 ? SIZE : this._size;
                }
            });
            overwritten = true;
        }
        return originalPush.apply(this, arguments);
    };
})();