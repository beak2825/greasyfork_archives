// ==UserScript==
// @name        Disable Autofocus
// @description  Completely block all programmatic autofocus on chatgpt.com
// @match        https://chatgpt.com/*
// @match        https://chat.z.ai/*
// @match        https://stepfun.ai/*
// @run-at       document-start
// @version 0.0.1.20250805025357
// @namespace https://greasyfork.org/users/1435046
// @downloadURL https://update.greasyfork.org/scripts/535808/Disable%20Autofocus.user.js
// @updateURL https://update.greasyfork.org/scripts/535808/Disable%20Autofocus.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // block all programmatic focus
    HTMLElement.prototype.focus = function() {
        // no-op
    };

    // block all programmatic scrollIntoView
    Element.prototype.scrollIntoView = function() {
        // no-op
    };
})();