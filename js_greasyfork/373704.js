// ==UserScript==
// @name         Acg18.us Navigator Language hack
// @namespace    edsgerlin
// @version      0.2
// @description  Set navigator language to `zh-CN` to avoid redirection.
// @author       edsgerlin
// @include      http*://acg18.us/*
// @include      http*://*.acg18.us/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/373704/Acg18us%20Navigator%20Language%20hack.user.js
// @updateURL https://update.greasyfork.org/scripts/373704/Acg18us%20Navigator%20Language%20hack.meta.js
// ==/UserScript==
/*jshint esversion: 6 */

(() => {
    'use strict';
    Object.defineProperty(navigator, 'language', {
        value: 'zh-CN'
    });
})();