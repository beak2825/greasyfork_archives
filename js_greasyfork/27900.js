// ==UserScript==
// @name         破晓电影网ftp下载链接提取出来
// @namespace    DsfB2XVPmbThEv29bdxQR2hzid30iMF8
// @version      0.3
// @description  将poxiao电影下载ftp链接提取出来，放到下面供复制，原因：mac上点击链接不能调用迅雷
// @author       tomoya
// @include      http*://www.poxiao.com/movie/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/27900/%E7%A0%B4%E6%99%93%E7%94%B5%E5%BD%B1%E7%BD%91ftp%E4%B8%8B%E8%BD%BD%E9%93%BE%E6%8E%A5%E6%8F%90%E5%8F%96%E5%87%BA%E6%9D%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/27900/%E7%A0%B4%E6%99%93%E7%94%B5%E5%BD%B1%E7%BD%91ftp%E4%B8%8B%E8%BD%BD%E9%93%BE%E6%8E%A5%E6%8F%90%E5%8F%96%E5%87%BA%E6%9D%A5.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var e_ftps = document.getElementsByTagName("input");
    for(i = 0; i < e_ftps.length; i++) {
        if(e_ftps[i].name == 'checkbox2') {
            var ftp = e_ftps[i].value.replace('xzurl=', '');
            var e_div = document.createElement('div');
            var e_a = document.createElement("a");
            e_a.href = ftp;
            e_a.innerHTML = ftp;
            e_div.appendChild(e_a);
            e_ftps[i].parentNode.appendChild(e_div);
        }
    }
})();