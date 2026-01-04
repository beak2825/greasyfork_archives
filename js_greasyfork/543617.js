// ==UserScript==
// @name         致理磨課師防切出偵測
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  防止致理磨課師平台偵測分頁切換
// @author       kenchou2006
// @match        *://moocs.chihlee.edu.tw/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/543617/%E8%87%B4%E7%90%86%E7%A3%A8%E8%AA%B2%E5%B8%AB%E9%98%B2%E5%88%87%E5%87%BA%E5%81%B5%E6%B8%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/543617/%E8%87%B4%E7%90%86%E7%A3%A8%E8%AA%B2%E5%B8%AB%E9%98%B2%E5%88%87%E5%87%BA%E5%81%B5%E6%B8%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    Object.defineProperty(document, 'visibilityState', {
        get: () => 'visible',
        configurable: true
    });
    Object.defineProperty(document, 'hidden', {
        get: () => false,
        configurable: true
    });

    window.addEventListener('visibilitychange', function(e) {
        e.stopImmediatePropagation();
    }, true);

    window.addEventListener('blur', function(e) {
        e.stopImmediatePropagation();
    }, true);

    window.addEventListener('focus', function(e) {
        e.stopImmediatePropagation();
    }, true);

    window.onblur = null;
    window.onfocus = null;

    console.log("✅ 致理磨課師防偵測腳本已啟用");

})();
