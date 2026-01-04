// ==UserScript==
// @name         按顺序打开签到网址
// @namespace    wjddd
// @version      0.1
// @description  按顺序打开签到
// @author       zhumeiling
// @match        https://docs.qq.com/doc/p/9db5813d4952df28a5a8f05eddcada34cfb5f227?dver=3.0.27516444
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/444445/%E6%8C%89%E9%A1%BA%E5%BA%8F%E6%89%93%E5%BC%80%E7%AD%BE%E5%88%B0%E7%BD%91%E5%9D%80.user.js
// @updateURL https://update.greasyfork.org/scripts/444445/%E6%8C%89%E9%A1%BA%E5%BA%8F%E6%89%93%E5%BC%80%E7%AD%BE%E5%88%B0%E7%BD%91%E5%9D%80.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var brr= [273148,1970900,269691,1257007,892362,1970899,285477,1978097,329248,276215,317087,853060,969474,1078599];
    for (var i=0;i<brr.length;i++) {
        var pinjie3 ='http://sysadmin.1zhe.com/?f=104&uid='+brr[i];
        window.open(pinjie3);
    };
})();