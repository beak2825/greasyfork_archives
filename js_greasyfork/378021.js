// ==UserScript==
// @name         点击获取图片地址
// @namespace    undefined
// @version      0.0.1
// @description  个人使用插件
// @author       个人使用
// @match        *://cxcms.ds.gome.com.cn/gome-cms-web/gomeCmsImgInfo/list.do
// @match        个人使用
// @downloadURL https://update.greasyfork.org/scripts/378021/%E7%82%B9%E5%87%BB%E8%8E%B7%E5%8F%96%E5%9B%BE%E7%89%87%E5%9C%B0%E5%9D%80.user.js
// @updateURL https://update.greasyfork.org/scripts/378021/%E7%82%B9%E5%87%BB%E8%8E%B7%E5%8F%96%E5%9B%BE%E7%89%87%E5%9C%B0%E5%9D%80.meta.js
// ==/UserScript==

$(document).ready(function () {
    console.log("点击获取图片地址成功---------------------------------------------------------------------->")
    // var img = $("#big_ul li img").attr("src");
    
    $("#big_ul li").click(function () {
        $("#show_image_win").hide();
        $(".modal-backdrop, .modal-backdrop.fade.in").hide();
        var imgSrc = $(this).find("img").attr("src");
        imgSrc.select(); // 选择对象
        document.execCommand("Copy"); // 执行浏览器复制命令
        alert(  imgSrc )
        console.log($(this).find("img").attr("src") )
    })
})