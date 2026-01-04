// ==UserScript==
// @name         直播顺畅
// @version      0.1.3
// @description  一个替换logo的脚本
// @author       You
// @match        https://*.google.com/*
// @match        https://www.google.co.jp/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=google.co.jp
// @license      MIT
// @namespace http://tampermonkey.net/
// @downloadURL https://update.greasyfork.org/scripts/461082/%E7%9B%B4%E6%92%AD%E9%A1%BA%E7%95%85.user.js
// @updateURL https://update.greasyfork.org/scripts/461082/%E7%9B%B4%E6%92%AD%E9%A1%BA%E7%95%85.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Your code here...

    // 检测是主页面还是搜索结果界面
    var main_page_classname = "lnXdpd";
    var baidu_logo = "https://www.baidu.com/img/pcdoodle_2a77789e1a67227122be09c5be16fe46.png";
    var currentUrl = window.location.href;
    var pattern = /^https?:\/\/(www\.)?google\.[a-z]{2,3}(?:\.[a-z]{2})?(?:\/|$)/;

    if (pattern.test(currentUrl)) {
        // 主页
        var logoImg = document.getElementsByClassName(main_page_classname).item(0);
        var newLogoImg = document.createElement('img');
        newLogoImg.src = baidu_logo;
        newLogoImg.width = 272;
        logoImg.parentNode.removeChild(logoImg.parentNode.firstChild);
        logoImg.parentNode.replaceChild(newLogoImg, logoImg);

        // 修改下方的小字
        var searchGoogle = document.getElementsByClassName("gNO89b");
        searchGoogle[0].value = "百度一下";

        //
        var aboutGoogle = document.getElementsByClassName("pHiOh");
        console.log(aboutGoogle);
        aboutGoogle[0].innerHTML = "关于百度";
        aboutGoogle[3].innerHTML = "百度搜索的运作方式";
    } else {
        // 搜索页
    }

})();