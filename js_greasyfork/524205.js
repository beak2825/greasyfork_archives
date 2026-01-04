// ==UserScript==
// @name         uview-plus文档广告去除
// @namespace    http://tampermonkey.net/
// @version      0.1.2
// @description  简易版
// @author       owo~
// @match        *://uview-plus.jiangruyi.com/*
// @match        *://uview-plus.lingyun.net/*
// @match        *://uiadmin.net/*
// @match        *://*.uiadmin.net/*
// @icon         https://uview-plus.jiangruyi.com/common/logo.png
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/524205/uview-plus%E6%96%87%E6%A1%A3%E5%B9%BF%E5%91%8A%E5%8E%BB%E9%99%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/524205/uview-plus%E6%96%87%E6%A1%A3%E5%B9%BF%E5%91%8A%E5%8E%BB%E9%99%A4.meta.js
// ==/UserScript==

(function() {
    'use strict';
    localStorage.setItem("adExpire2", Date.parse(new Date()) / 1e3 + 43200);
    Object.defineProperty(window, "showAd", {
        get: () => false,
        set: () => {},
        configurable: false
    });
    function removeGoogleAdsScripts() {
        document.querySelectorAll('script[src*="googlesyndication.com"], script[src*="fundingchoicesmessages.google.com"]').forEach(el => el.remove());
    }
    function removeGoogleAdFrames() {
        document.querySelectorAll('iframe[src*="googlesyndication.com"], iframe[src*="doubleclick.net"]').forEach(el => el.remove());
    }
    function removeTipsAd(){
        document.querySelectorAll('.showV2Tips').forEach(el => el.remove());
    }
    let observer = new MutationObserver(() => {
        removeGoogleAdsScripts();
        removeGoogleAdFrames();
        removeTipsAd();
    });
    observer.observe(document.body, { childList: true, subtree: true });
    removeGoogleAdsScripts();
    removeGoogleAdFrames();
    removeTipsAd();
    const e1 = document.querySelectorAll('.jump-linker');
    e1.forEach(el => {
        el.style.display = 'none';
    });
})();
