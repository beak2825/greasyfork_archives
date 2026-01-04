// ==UserScript==
// @name         定时刷新西农校园网网页
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  定时刷新西农校园网网页小程序
// @author       BeZer0
// @match        https://portal.nwafu.edu.cn/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/461581/%E5%AE%9A%E6%97%B6%E5%88%B7%E6%96%B0%E8%A5%BF%E5%86%9C%E6%A0%A1%E5%9B%AD%E7%BD%91%E7%BD%91%E9%A1%B5.user.js
// @updateURL https://update.greasyfork.org/scripts/461581/%E5%AE%9A%E6%97%B6%E5%88%B7%E6%96%B0%E8%A5%BF%E5%86%9C%E6%A0%A1%E5%9B%AD%E7%BD%91%E7%BD%91%E9%A1%B5.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // 注意改掉上面的@match，里面是放指定你要刷新的网页网址
    // 几秒，例如10就是10秒刷新一次
    var btn=document.querySelector('#login-account');
    if(btn!=null){
        btn.click();
    }
    let timeout = 10
    console.log('%s秒后刷新: ', timeout);
    setTimeout(() => {
      location.reload()
    }, timeout*1000);
})();
