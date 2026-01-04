// ==UserScript==
// @name         gpnu校园网自动点击登录
// @namespace    xxx
// @version      0.1
// @description  打开校园网登录界面自动点击登录，登录成功后自动关闭页面
// @author       xxx
// @include      http://10.0.6.247/eportal/*
// @grant        none
// @license      MIT

// @downloadURL https://update.greasyfork.org/scripts/442479/gpnu%E6%A0%A1%E5%9B%AD%E7%BD%91%E8%87%AA%E5%8A%A8%E7%82%B9%E5%87%BB%E7%99%BB%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/442479/gpnu%E6%A0%A1%E5%9B%AD%E7%BD%91%E8%87%AA%E5%8A%A8%E7%82%B9%E5%87%BB%E7%99%BB%E5%BD%95.meta.js
// ==/UserScript==
(function() {
    console.log("xxx");

    var url = window.parent.location.href; /* 获取地址栏URL */
    if(url.match("success")=="success"){
        window.location.href="about:blank";
        window.close();
    }

    setTimeout(function () {
        doauthen();// 点登录按钮时调用的函数
        console.log("1000");
    }, 500);//延迟后才成功，可能之前其他东西没加载完
})();
