// ==UserScript==
// @name         1688店铺首页图片下载
// @namespace    https://www.1024net.tech/
// @namespace    https://www.lovemake.love/
// @version      2024.08.01.080000
// @description  I try to take over the world!
// @author       Kay
// @match        https://*.1688.com/*
// @icon         https://aimg8.dlssyht.cn/u/1533835/ueditor/image/767/1533835/1633159205592221.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/502340/1688%E5%BA%97%E9%93%BA%E9%A6%96%E9%A1%B5%E5%9B%BE%E7%89%87%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/502340/1688%E5%BA%97%E9%93%BA%E9%A6%96%E9%A1%B5%E5%9B%BE%E7%89%87%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Your code here...
    function grab_img() {
        if (!jQuery("#love").length) {
            jQuery(".fx-tab-pane img,.fullscreen-img").attr("src", function (n, v) { return v + "#love"; });
            jQuery(".fx-tab-pane img").attr("alt", function (n, v) { return "轮播图" + (n + 1); });
            jQuery(".fullscreen-img").attr("alt", function (n, v) { return "全屏大图" + (n + 1); });
            jQuery("body").attr("id", "love");
        }
    }
    jQuery(document).keyup(function (event) {
        switch (event.keyCode) {
            case 27://Esc 抓取图片
                grab_img();
                break;
        }
    });
})();
/*2024.08.01.080000 - Line : 33*/