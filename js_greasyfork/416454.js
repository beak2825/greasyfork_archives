// ==UserScript==
// @name         博客园纯净版
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  try to take over the world!
// @author       bage22 liangys1115
// @include    *.cnblogs.com/*
// @lastmodified  2020-11-23
// @note    2020-11-20-V1.5 更新协议
// @note    2020-11-20-V1.4 隐藏博客园首页广告
// @note    2020-11-20-V1.3 动态获取左边距值并设置为右边距
// @note    2020-11-20-V1.2 设置主页面右边距与左边距保持一致
// @note    2020-11-20-V1.1 修改授权
// @note    2020-11-20-V1.0 移除更多无关的div中class内容
// @license    GPL-3.0-only
// @downloadURL https://update.greasyfork.org/scripts/416454/%E5%8D%9A%E5%AE%A2%E5%9B%AD%E7%BA%AF%E5%87%80%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/416454/%E5%8D%9A%E5%AE%A2%E5%9B%AD%E7%BA%AF%E5%87%80%E7%89%88.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function removeByID(){
        let len = arguments.length;
        for(var i=0;i<len;i++){
            $(arguments[i]).remove();
        }
    }

    function removeDivChild(){
        let len = arguments.length;
        for(var i=0;i<len;i++){
            $("div").remove(arguments[i]);
        }
    }

    function setContentRightMargin(){
        $("#mainContent .forFlow").css("margin-right",$("#mainContent .forFlow").css("margin-left"));
        $("#content").css("margin-right",$("#content").css("margin-left"));
    }

    removeByID("#cnblogs_c2","#comment_form","#cnblogs_c1","#sideBarMain","#blog_post_info_block", "#leftcontentcontainer",
               "#header", "#blog-comments-placeholder", "#mytopmenu", "#bannerbar", "#leftcontent", "#MySignature", "#side_right");
    removeDivChild(".bannerbar", ".orpc", ".footer", ".postDesc");
    setContentRightMargin();
})();