// ==UserScript==
// @name         "yudao" free
// @namespace    http://tampermonkey.net/
// @version      2025-01-07T11:42
// @description  该脚本仅供学习使用。
// @author       Sufjan
// @match        *://*.iocoder.cn/*
// @match        https://cloud.iocoder.cn/*
// @match        https://doc.iocoder.cn/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=iocoder.cn
// @grant        none
// @license      Sufjan
// @downloadURL https://update.greasyfork.org/scripts/522971/%22yudao%22%20free.user.js
// @updateURL https://update.greasyfork.org/scripts/522971/%22yudao%22%20free.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
    console.log('Blocked.');
    _sc();
    var endTime = new Date().getTime() + 2000;
    while (new Date().getTime() < endTime) {
        _jq();
        _req();
    }
 
})();
 
function _sc(){
    function setCookie(cookieName, cookieValue, hoursToExpire) {
        var date = new Date();
        date.setTime(date.getTime() + (hoursToExpire * 60 * 60 * 1000));
        var expires = "expires=" + date.toUTCString();
        document.cookie = cookieName + "=" + cookieValue + "; " + expires;
    }
    setCookie("88974ed8-6aff-48ab-a7d1-4af5ffea88bb", "88974ed8-6aff-48ab-a7d1-4af5ffea88bb", 12);
}
 
function _jq(){
    var originalHtml = jQuery.fn.html;
 
    jQuery.fn.html = function() {
        if (arguments.length && arguments[0] === '<div style="color: red;">仅 VIP 可见！</div>') {
            console.log('Blocked setting HTML to: ' + arguments[0]);
            return this;
        }
        return originalHtml.apply(this, arguments);
    };
}
 
// 注意：这个方法不生效，建议用 f12 阻止这仨请求
// static.iocoder.cn/answer.js
// svip.iocoder.cn/zsxq/auth?host=doc.iocoder.cn&vip=88974ed8-6aff-48ab-a7d1-4af5ffea88bb
// svip.iocoder.cn/zsxq/auth?host=cloud.iocoder.cn&vip=88974ed8-6aff-48ab-a7d1-4af5ffea88bb
function _req() {
    // intercept XMLHttpRequest
    var originalXHR = window.XMLHttpRequest;
 
    function newXHR() {
        var realXHR = new originalXHR();
 
        realXHR.open = function(method, url, async, user, password) {
            if (url.includes('svip.iocoder.cn/zsxq/auth')) {
                console.log('intercept:', method, url);
                return;
            }
            return originalXHR.prototype.open.apply(this, arguments);
        };
 
        return realXHR;
    }
 
    window.XMLHttpRequest = newXHR;
 
    // intercept fetch
    var originalFetch = window.fetch;
 
    window.fetch = function(input, init) {
        var url = (typeof input === 'string') ? input : input.url;
 
        if (url.includes('svip.iocoder.cn/zsxq/auth')) {
            console.log('intercept:', url);
            return;
        }
 
        return originalFetch(input, init);
    };
}