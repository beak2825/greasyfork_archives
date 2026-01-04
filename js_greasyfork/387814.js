// ==UserScript==
// @name         王永杰图片管理添加背景
// @myBlog       wangyongjie.top
// @namespace    undefined
// @version      8.0.0
// @description  图片管理添加背景插件
// @author       图片管理添加背景
// @match        *://cxcms.ds.gome.com.cn/gome-cms-web/gomeCmsImgInfo/list.do
// @match        *://cms.gome.inc/gomeCmsImgInfo/list.do
// @match        http://cxcms.ds.gome.com.cn/gome-cms-web/gomeCmsImgInfo/list.do
// @match        http://cms.gome.inc/gomeCmsImgInfo/list.do
// @match        http://cms.gome.inc/gomeCmsImgInfo/list.do?token=57c20979-d07f-4656-aa47-f69e7ab09f3d
// @match        *://erm.ds.gome.com.cn/main.action
// @match        http://erm.ds.gome.com.cn/main.action
// @match        *
// @match        图片管理添加背景
// @downloadURL https://update.greasyfork.org/scripts/387814/%E7%8E%8B%E6%B0%B8%E6%9D%B0%E5%9B%BE%E7%89%87%E7%AE%A1%E7%90%86%E6%B7%BB%E5%8A%A0%E8%83%8C%E6%99%AF.user.js
// @updateURL https://update.greasyfork.org/scripts/387814/%E7%8E%8B%E6%B0%B8%E6%9D%B0%E5%9B%BE%E7%89%87%E7%AE%A1%E7%90%86%E6%B7%BB%E5%8A%A0%E8%83%8C%E6%99%AF.meta.js
// ==/UserScript==
$(document).ready(function () {
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