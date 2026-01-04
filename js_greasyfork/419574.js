// ==UserScript==
// @name         不看广告:juejin右侧+csdn自动展开+去广告+净化剪贴板+免登陆+woshipm+segment
// @namespace    http://tampermonkey.net/
// @version      1.3.15
// @description  JueJin ITeye CSDN自动展开阅读，可以将剪贴板的推广信息去除，去除大多数广告。
// @author       inyu
// @match        *://blog.csdn.net/*/article/details/*
// @match        *://*.blog.csdn.net/article/details/*
// @match        *://bbs.csdn.net/topics/*
// @match        *://*.iteye.com/blog/*
// @match        *://*.juejin.im/*
// @match        *://*.gitee.com/-/ide/*
// @match        *://*.woshipm.com/*
// @match        *://*.segmentfault.com/*
// @grant        none
// @icon         https://b-gold-cdn.xitu.io/favicons/v2/favicon.ico
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/419574/%E4%B8%8D%E7%9C%8B%E5%B9%BF%E5%91%8A%3Ajuejin%E5%8F%B3%E4%BE%A7%2Bcsdn%E8%87%AA%E5%8A%A8%E5%B1%95%E5%BC%80%2B%E5%8E%BB%E5%B9%BF%E5%91%8A%2B%E5%87%80%E5%8C%96%E5%89%AA%E8%B4%B4%E6%9D%BF%2B%E5%85%8D%E7%99%BB%E9%99%86%2Bwoshipm%2Bsegment.user.js
// @updateURL https://update.greasyfork.org/scripts/419574/%E4%B8%8D%E7%9C%8B%E5%B9%BF%E5%91%8A%3Ajuejin%E5%8F%B3%E4%BE%A7%2Bcsdn%E8%87%AA%E5%8A%A8%E5%B1%95%E5%BC%80%2B%E5%8E%BB%E5%B9%BF%E5%91%8A%2B%E5%87%80%E5%8C%96%E5%89%AA%E8%B4%B4%E6%9D%BF%2B%E5%85%8D%E7%99%BB%E9%99%86%2Bwoshipm%2Bsegment.meta.js
// ==/UserScript==

var interval = 150;
var sideInterval = 150;
 
(function () {
    var currentURL = window.location.href;
    var cert = '/cart.htm';
    var bbs = '/order/confirm_order.htm';

    if(cert.test(currentURL)){
        setTimeout(function () {
            document.getElementsByClassName("btn-area")[0].click();
        }, interval);
    }
    else if(bbs.test(currentURL)){
        setTimeout(function () {
            document.getElementsByClassName("go-btn")[0].click();            
        }, interval);
    }
})();