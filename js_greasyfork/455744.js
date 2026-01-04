// ==UserScript==
// @name         Web With Color
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  上帝说：要有颜色
// @author       7nc
// @match        *://www.gamersky.com/*
// @match        *://weibo.com/*
// @match        *://www.zhihu.com/*
// @match        *://www.bilibili.com/*
// @match        *://www.163.com/*
// @match        *://www.sohu.com/*
// @match        *://www.ifeng.com/*
// @match        *://xueqiu.com/*
// @match        *://www.mysmth.net/*
// @match        *://tieba.baidu.com/*
// @match        *://www.taobao.com/*
// @match        *://www.tmall.com/*
// @match        *://www.jd.com/*
// @match        *://www.aliyun.com/*
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/455744/Web%20With%20Color.user.js
// @updateURL https://update.greasyfork.org/scripts/455744/Web%20With%20Color.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    document.getElementsByTagName('html')[0].style.webkitFilter='grayscale(0%)';

    var wbList=document.getElementsByClassName("grayTheme")
    if(wbList.length>0){
        wbList.forEach(function (elem) {
            elem.classList.remove("grayTheme")
        });
    }


})();