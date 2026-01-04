// ==UserScript==
// @name         吾爱破解论坛页面精简美化
// @description  吾爱破解论坛（www.52pojie.cn）帖子页面内容精简和样式美化，包括去除页面广告、自动点击签到按钮、页面宽度调整（方便大屏用户）、回帖作者信息栏精简、回帖作者头像变圆形、回帖栏高度适当降低、帖子图片加阴影和间距（白色背景图片可视性更高）、移除回帖框背景图、移除顶部工具条和背景图案、移除底部免责申明等等，页面访问速度大大提升。
// @icon         https://www.52pojie.cn/favicon.ico
// @namespace    https://greasyfork.org/zh-CN/users/393603-tsing
// @version      1.3
// @author       Tsing
// @run-at       document-start
// @match        https://www.52pojie.cn/thread*
// @match        https://www.52pojie.cn/forum.php?mod=viewthread&tid=*
// @grant        none
// @note         2019.12.08 V1.0 帖子内容精简和样式美化，去除页面广告、页面宽度调整（方便大屏用户）、回帖作者信息栏精简、回帖作者头像变圆形、回帖栏高度适当降低、帖子图片加阴影和间距（白色背景图片可视性更高）、移除回帖框背景图、移除顶部工具条和背景图案、移除底部免责申明等等，页面访问速度大大提升。
// @note         2019.12.09 V1.1 修复收藏按钮不见了的小bug。
// @note         2019.12.10 V1.2 修复免费评分区域单行变高的问题（感谢@_小白），去除鼠标移到帖子图片上弹出的下载悬浮框（感谢@mosagi）。
// @note         2020.06.30 V1.3 加自动签到功能，调整了部分元素样式，修改图片加阴影规则，避免表情图标加阴影。
// @downloadURL https://update.greasyfork.org/scripts/393516/%E5%90%BE%E7%88%B1%E7%A0%B4%E8%A7%A3%E8%AE%BA%E5%9D%9B%E9%A1%B5%E9%9D%A2%E7%B2%BE%E7%AE%80%E7%BE%8E%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/393516/%E5%90%BE%E7%88%B1%E7%A0%B4%E8%A7%A3%E8%AE%BA%E5%9D%9B%E9%A1%B5%E9%9D%A2%E7%B2%BE%E7%AE%80%E7%BE%8E%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var style_tag_52 = document.createElement('style');
    style_tag_52.innerHTML = '@media (min-width: 1366px){ .wp {width: 80%;} } body{background: none !important;} #toptb{display: none !important;} .dnch_eo_pt, .dnch_eo_pr{display: none !important;} .dnch_eo_f{display: none !important;} .bml{display: none !important;} .pls .avatar img{width:60px; height:60px; border-radius:60px; background:none; padding:0; border:4px solid #ffffff; box-shadow:0 0 4px #bbbbbb;} .avtm img{width:60px;} .pls .avatar{text-align:center;} ul.xl.xl2.o.cl{display:none;} dl.pil.cl{display:none;} p.md_ctrl{display:none;} td.plc.plm .sign{display:none;} .dnch_eo_pb, .dnch_eo_pt{display:none;} .pls .side-star{display:none;} .pls .side-group{display:none;} .t_fsz{min-height:60px;} .res-footer-note{display:none;} .pls .pi{text-align:center; padding:10px 0 0 0; border:none; overflow:visible;} .xw1{font-size:15px;} textarea#fastpostmessage{background:none !important;} .pcb .t_fsz img{max-width:80% !important; margin:20px 0;} .aimg_tip{display:none !important;} .wp.dnch_eo_f{display: none !important;}';
    document.head.appendChild(style_tag_52);

    document.addEventListener ("DOMContentLoaded", do_something); // 等DOM加载完毕时执行
    function do_something(){
        var img_obj_arr = document.querySelectorAll(".zoom");
        for(var i=0; i<img_obj_arr.length; i++){
            img_obj_arr[i].style.boxShadow= "0 0px 4px #444444"; // 图片加阴影，避免有的白底图片看不清边界。
        }
        var btn_obj_arr = document.querySelectorAll(".qq_bind");
        btn_obj_arr[1].parentElement.click(); // 自动点击签到按钮，签到成功之后就点不了了，刚好。签到链接：https://www.52pojie.cn/home.php?mod=task&do=apply&id=2
    }

})();