// ==UserScript==
// @name         360Doc的登录弹窗、自动展开全文及去除浮动块
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  处理360Doc的登录弹窗、自动展开全文及去除浮动块
// @author       icescat
// @match        *://*.360doc.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/488500/360Doc%E7%9A%84%E7%99%BB%E5%BD%95%E5%BC%B9%E7%AA%97%E3%80%81%E8%87%AA%E5%8A%A8%E5%B1%95%E5%BC%80%E5%85%A8%E6%96%87%E5%8F%8A%E5%8E%BB%E9%99%A4%E6%B5%AE%E5%8A%A8%E5%9D%97.user.js
// @updateURL https://update.greasyfork.org/scripts/488500/360Doc%E7%9A%84%E7%99%BB%E5%BD%95%E5%BC%B9%E7%AA%97%E3%80%81%E8%87%AA%E5%8A%A8%E5%B1%95%E5%BC%80%E5%85%A8%E6%96%87%E5%8F%8A%E5%8E%BB%E9%99%A4%E6%B5%AE%E5%8A%A8%E5%9D%97.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
 
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.addedNodes.length) {
                const loginPopup = document.getElementById('registerOrLoginLayer');
                loginPopup?.parentNode.removeChild(loginPopup);
 
                document.body.classList.remove('articleMaxH');
 
                const floatQRCode1 = document.getElementById('floatqrcode_1');
                floatQRCode1?.parentNode.removeChild(floatQRCode1);
 
                const floatQRCode2 = document.getElementById('floatqrcode_2');
                floatQRCode2?.parentNode.removeChild(floatQRCode2);
            }
        });
    });
 
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();