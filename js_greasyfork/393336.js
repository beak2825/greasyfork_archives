// ==UserScript==
// @name         fuck_baijiahao
// @icon         https://www.baidu.com/favicon.ico
// @namespace    http://greyh4t.github.com/
// @version      0.6
// @description  彻底过滤百度搜索中的百家号内容
// @author       greyh4t
// @match        *://www.baidu.com/s?*
// @match        *://www.baidu.com/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/393336/fuck_baijiahao.user.js
// @updateURL https://update.greasyfork.org/scripts/393336/fuck_baijiahao.meta.js
// ==/UserScript==

(function () {
    'use strict';
    let key = " -site:baijiahao.baidu.com";
    let white_list = ["视频", "图片", "知道", "文库", "贴吧", "采购", "地图"];

    let add = function () {
        let kw = document.getElementById("kw");
        if (kw.value && kw.value.indexOf(key) == -1) {
            kw.value = kw.value + key;
        }
    };

    let clear = function () {
        let kw = document.getElementById("kw");
        let value = kw.value;
        if (value.endsWith(key)) {
            kw.value = value.substring(0, value.length - key.length);
        }
    };

    let bar_handle = function (e) {
        // 兼容性处理
        let event = e || window.event;
        let target = event.target || event.srcElement;
        // 判断是否匹配目标元素
        if (target.nodeName == "A" && white_list.includes(target.textContent)) {
            target.href = target.href.replace(/(\+|20%|%20)-site(:|%3a)baijiahao.baidu.com/gi, "");
        }
    }

    document.getElementById("su").addEventListener("click", add);
    document.getElementById("kw").addEventListener("focus", clear);
    document.getElementById("wrapper").addEventListener('mousedown', bar_handle);
})();
