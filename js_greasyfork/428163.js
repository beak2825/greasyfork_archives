// ==UserScript==
// @name         去除dz论坛的图片详情弹窗
// @namespace    https://tingfengge.top
// @version      0.1
// @description  我们访问dz论坛的时候，当你把鼠标移动到图片上时，不管你是不是有意的，都会触发详情弹窗，反正对于这个我很不爽！！！
// @author       那年夏天52
// @match        *://www.52pojie.cn/*
// @match        *://www.chinapyg.com/*
// @downloadURL https://update.greasyfork.org/scripts/428163/%E5%8E%BB%E9%99%A4dz%E8%AE%BA%E5%9D%9B%E7%9A%84%E5%9B%BE%E7%89%87%E8%AF%A6%E6%83%85%E5%BC%B9%E7%AA%97.user.js
// @updateURL https://update.greasyfork.org/scripts/428163/%E5%8E%BB%E9%99%A4dz%E8%AE%BA%E5%9D%9B%E7%9A%84%E5%9B%BE%E7%89%87%E8%AF%A6%E6%83%85%E5%BC%B9%E7%AA%97.meta.js
// ==/UserScript==

(function () {
    //原理 document.getElementById("xxxxxx").removeAttribute("onmouseover");
    var arrs = document.getElementsByTagName("img");
    for (var i = 0; i < arrs.length; i++) {
        if (arrs[i].id.indexOf("aimg_") != -1) {
            arrs[i].removeAttribute("onmouseover");
        }
    }
})();