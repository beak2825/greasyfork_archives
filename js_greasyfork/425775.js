// ==UserScript==
// @name        阿尔斯神 · 屏蔽百度广告
// @namespace   https://www.baidu.com/
// @match       https://www.baidu.com/
// @grant       none
// @version     3.2.2
// @author      阿尔斯神
// @match       www.baidu.com
// @description 2021/5/1 下午1:40:52
// @downloadURL https://update.greasyfork.org/scripts/425775/%E9%98%BF%E5%B0%94%E6%96%AF%E7%A5%9E%20%C2%B7%20%E5%B1%8F%E8%94%BD%E7%99%BE%E5%BA%A6%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/425775/%E9%98%BF%E5%B0%94%E6%96%AF%E7%A5%9E%20%C2%B7%20%E5%B1%8F%E8%94%BD%E7%99%BE%E5%BA%A6%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==
//以下是代码
(function () {
    'use strict';
    //阅读全文
    $("div").remove("#s-hotsearch-wrapper");
    $("div").remove("#s_side_wrapper");
    $("div").remove("#s_wrap");
    $("div").remove("#s_menu_gurd");
    $("div").remove("#s-top-nav");
    $("div").remove("#s_ctner_menus");
    $("div").remove("#s-center-box");
})();
var elements = document.getElementsByClassName("mnav c-font-normal c-color-t");
for (var i = elements.length - 1; i >= 0; i--) {
    if (elements[i].id !== "csaitab") {
        elements[i].remove();
    }
}
