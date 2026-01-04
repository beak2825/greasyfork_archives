// ==UserScript==
// @name         m.5xw.net净化
// @namespace    https://github.com/guoshiqiufeng
// @version      1.0.1
// @description  m.5xw.net净化， 过滤广告。
// @author       yanghq
// @license MIT
// @match        https://m.5xw.net/**
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/482366/m5xwnet%E5%87%80%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/482366/m5xwnet%E5%87%80%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 保存当前域名
    var currentDomain = window.location.hostname;
    console.log('currentDomain:', currentDomain);

    var nsws = document.querySelectorAll('#nsws');
    // console.log(nsws);
    if(nsws) {
        for(var i=0;i<nsws.length;i++) {
            nsws[i].innerHTML="";
        }
    }
    document.querySelectorAll('wwwhhh1').innerHTML="";

    // 重写XMLHttpRequest的open方法
    var originalOpen = XMLHttpRequest.prototype.open;

    XMLHttpRequest.prototype.open = function(method, url, async, user, pass) {
        // 检查请求的目标域名
        var targetDomain = (new URL(url)).hostname;
        console.log('targetDomain:', targetDomain);
        // 如果目标域名与当前域名不匹配，则拦截请求
        if (targetDomain !== currentDomain) {
            console.log('拦截请求:', url);
            return;
        }
        // 调用原始的open方法
        originalOpen.apply(this, arguments);
    };


})();