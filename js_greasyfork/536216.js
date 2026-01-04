// ==UserScript==
// @name         no auto scroll
// @description  Disable JavaScript-triggered scrolling like scrollIntoView
// @match        https://playground.allenai.org/*
// @match        https://grok.com/*
// @match        https://9to5mac.com/*
// @match        https://electrek.co/*
// @match        https://chat.mistral.ai/*
// @match        https://chat.z.ai/*
// @match        https://chat.falconllm.tii.ae/*
// @match        *://stepfun.ai/*
// @match        https://aistudio.google.com/*
// @match        https://chat.deepseek.com/*
// @match        *://claude.ai/*
// @match        https://chat.qwen.ai/*
// @run-at       document-start
// @version 0.0.1.20251118080234
// @namespace https://greasyfork.org/users/1435046
// @downloadURL https://update.greasyfork.org/scripts/536216/no%20auto%20scroll.user.js
// @updateURL https://update.greasyfork.org/scripts/536216/no%20auto%20scroll.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Override scroll-related functions to no-ops
    Element.prototype.scrollIntoView = function () { };
    Element.prototype.scrollIntoViewIfNeeded = function () { };
    Element.prototype.scrollTo = function () { };
    window.scrollTo = function () { };
    window.scrollBy = function () { };

    // Block scrollTop assignments (what falcon.tii uses)
    Object.defineProperty(HTMLElement.prototype, 'scrollTop', {
        set() { },
        get() { return 0; },
        configurable: false
    });
})();