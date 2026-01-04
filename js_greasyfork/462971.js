// ==UserScript==
// @name         护眼模式，保护眼睛
// @namespace    http://tampermonkey
// @version      1.0
// @description  保护眼睛，减少眼部疲劳
// @author       wll
// @match        http://*/*
// @match        https://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/462971/%E6%8A%A4%E7%9C%BC%E6%A8%A1%E5%BC%8F%EF%BC%8C%E4%BF%9D%E6%8A%A4%E7%9C%BC%E7%9D%9B.user.js
// @updateURL https://update.greasyfork.org/scripts/462971/%E6%8A%A4%E7%9C%BC%E6%A8%A1%E5%BC%8F%EF%BC%8C%E4%BF%9D%E6%8A%A4%E7%9C%BC%E7%9D%9B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 设置页面背景颜色为黑色
    document.body.style.backgroundColor = "rgb(255, 250, 232)";

    // 设置页面字体颜色为绿色
    document.body.style.color = "green";

    // 设置页面字体颜色为绿色
    var links = document.getElementsByTagName("a");
    for (var i = 0; i < links.length; i++) {
        links[i].style.color = "green";
    }

})();