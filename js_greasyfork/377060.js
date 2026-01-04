// ==UserScript==
// @name         可爱的CSDN
// @namespace    http://bigto.bid/
// @version      0.4
// @include      http://blog.csdn.net/*
// @include      https://blog.csdn.net/*
// @description  1、移除CSDN底部的登录横条 2、展开所有内容 3、移除推荐栏的广告
// @author       Bigto
// @home-url     https://greasyfork.org/zh-CN/scripts/377060
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/377060/%E5%8F%AF%E7%88%B1%E7%9A%84CSDN.user.js
// @updateURL https://update.greasyfork.org/scripts/377060/%E5%8F%AF%E7%88%B1%E7%9A%84CSDN.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // Your code here...
    var hostName = window.location.hostname;
    if(hostName.indexOf('csdn.net')) {
        var els = document.getElementsByClassName('pulllog-box');
        if (els && els.length > 0) {
            for (var i = 0; i < els.length; i++) {
                els[i].parentNode.removeChild(els[i]);
            }
        }
        // remove mask
        var content = document.getElementById('article_content');
        content.style.height = '';
        var hide = document.getElementsByClassName('hide-article-box hide-article-pos text-center');
        if (hide) {
            hide[0].parentElement.removeChild(hide[0]);
        }
        // remove ad
        var ad1 = document.getElementsByClassName('csdn-tracking-statistics mb8 box-shadow')
        ad1[0].parentNode.removeChild(ad1[0]);
        var ad2 = document.getElementById('479');
        if (ad2) {
            ad2.parentElement.removeChild(ad2);
        }
        // 移除推荐栏的广告  recommend-item-box recommend-ad-box
        var ad3 = document.getElementsByClassName('recommend-ad-box');
        console.log(ad3.length);
        if (ad3 && ad3.length > 0) {
            for (var j = 0; j < ad3.length; j++) {
                ad3[j].remove();
            }
            for (var k = 0; k < ad3.length; k++) {
                ad3[k].remove();
            }
        }
    }
})();