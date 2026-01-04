// ==UserScript==
// @name         图片管理添加背景
// @namespace    undefined
// @version      0.0.2
// @description  图片管理添加背景插件
// @author       图片管理添加背景
// @match        *://cxcms.ds.gome.com.cn/gome-cms-web/gomeCmsImgInfo/list.do
// @match        http://cxcms.ds.gome.com.cn/gome-cms-web/gomeCmsImgInfo/list.do
// @match        *://erm.ds.gome.com.cn/main.action
// @match        http://erm.ds.gome.com.cn/main.action
// @match        *
// @match        图片管理添加背景
// @downloadURL https://update.greasyfork.org/scripts/381753/%E5%9B%BE%E7%89%87%E7%AE%A1%E7%90%86%E6%B7%BB%E5%8A%A0%E8%83%8C%E6%99%AF.user.js
// @updateURL https://update.greasyfork.org/scripts/381753/%E5%9B%BE%E7%89%87%E7%AE%A1%E7%90%86%E6%B7%BB%E5%8A%A0%E8%83%8C%E6%99%AF.meta.js
// ==/UserScript==

$(document).ready(function(){
    function colorRandom() {
        var a, b, c;
        var a = parseInt(255 - Math.random() * 255).toString(16);
        var b = parseInt(255 - Math.random() * 255).toString(16);
        var c = parseInt(255 - Math.random() * 255).toString(16);
        colorStr = '#' + a + b + c;
    } colorRandom();

    $(".img_slide").css({
        background: colorStr
    })
    console.log("变色成功")
})
