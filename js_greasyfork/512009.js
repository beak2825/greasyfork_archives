// ==UserScript==
// @name         Pix Focus Mode Bypass
// @namespace    PixBypass
// @version      1.0.0
// @description  Bypasses focus mode by spoofing visibility changes.
// @match        https://app.pix.fr/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=pix.fr
// @license      MIT-0
// @downloadURL https://update.greasyfork.org/scripts/512009/Pix%20Focus%20Mode%20Bypass.user.js
// @updateURL https://update.greasyfork.org/scripts/512009/Pix%20Focus%20Mode%20Bypass.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document._addEventListener = document.addEventListener;
    document.addEventListener = function (e, c) {
      if (e == 'visibilitychange') return;
      addEventListener(e, c);
    }

    document._hasFocus = document.hasFocus;
    document.hasFocus = function() {
      return true;
    }

    document._visibilityState = Object.getOwnPropertyDescriptor(document, 'visibilityState');
    const newVisState = document._visibilityState ?? {};
    newVisState.get = function() { return "visible"; }
    Object.defineProperty(document, 'visibilityState', newVisState);
})();