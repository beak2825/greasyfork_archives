// ==UserScript==
// @name         CNBeta首页广告隐藏
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  通过css隐藏首页滚动时加载的广告
// @author       woodj
// @license      MIT
// @include        *://www.cnbeta.com*
// @icon           https://www.cnbeta.com/images/logo_1.png
// @require     https://ajax.aspnetcdn.com/ajax/jQuery/jquery-2.2.4.js
// @downloadURL https://update.greasyfork.org/scripts/372269/CNBeta%E9%A6%96%E9%A1%B5%E5%B9%BF%E5%91%8A%E9%9A%90%E8%97%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/372269/CNBeta%E9%A6%96%E9%A1%B5%E5%B9%BF%E5%91%8A%E9%9A%90%E8%97%8F.meta.js
// ==/UserScript==

(function () {
    'use strict';
    // 创建 <style> 标签
    var style = document.createElement("style");
    // 对WebKit hack :(
    style.appendChild(document.createTextNode(".trc_related_container { display: none; }"));
    // 将 <style> 元素加到页面中
    document.head.appendChild(style);
    setInterval(function() {
        $(".adsbygoogle").css("display", "none");
        $(".item.cooperation").css("display", "none");
        $(".baidu_dropdown_box").css("display", "none");
    }, 500);
})();
