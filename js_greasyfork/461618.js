// ==UserScript==
// @name         百度首页换壁纸
// @namespace    passer
// @version      1.0
// @description  每次打开百度首页，都将背景替换成一张指定的壁纸，并将百度首页在壁纸之上的部分变成透明的，并去除百度图标
// @match        https://*/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/461618/%E7%99%BE%E5%BA%A6%E9%A6%96%E9%A1%B5%E6%8D%A2%E5%A3%81%E7%BA%B8.user.js
// @updateURL https://update.greasyfork.org/scripts/461618/%E7%99%BE%E5%BA%A6%E9%A6%96%E9%A1%B5%E6%8D%A2%E5%A3%81%E7%BA%B8.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // 修改这里的链接为你想要的壁纸图片地址
    var wallpaper = "https://api.ixiaowai.cn/gqapi/gqapi2.php";
    // 判断是否是百度首页
    if (window.location.href === "https://www.baidu.com/") {
        // 获取百度首页的body元素
        var body = document.querySelector("body");
        // 设置body元素的背景图片为壁纸链接，并居中显示，不重复，覆盖整个区域
        body.style.backgroundImage = "url(" + wallpaper + ")";
        body.style.backgroundPosition = "center";
        body.style.backgroundRepeat = "no-repeat";
        body.style.backgroundSize = "cover";
        // 获取百度首页上方和下方两个div元素，并设置它们的透明度为0.5，即半透明效果
        var topDiv = document.querySelector("#s_top_wrap");
        var bottomDiv = document.querySelector("#bottom_layer");
        topDiv.style.opacity = 0.5;
        bottomDiv.style.opacity = 0.5;
        // 获取百度首页中间的百度图标元素，并设置它们的显示属性为none，即隐藏效果
        var logoDiv = document.querySelector("#lg");
        logoDiv.style.opacity = 0.0;
    }
})();