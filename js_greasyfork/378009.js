// ==UserScript==
// @name         百度贴吧简化
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  屏蔽百度贴吧列表，详情页广告，屏蔽掉一些无用的元素
// @author       You
// @match        *://tieba.baidu.com/p/*
// @match        *://tieba.baidu.com/f?*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/378009/%E7%99%BE%E5%BA%A6%E8%B4%B4%E5%90%A7%E7%AE%80%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/378009/%E7%99%BE%E5%BA%A6%E8%B4%B4%E5%90%A7%E7%AE%80%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    'use strict';

     // 如果你想屏蔽某个元素，只需将该元素的 class(.demo) or id(#demo) 添加到下面的数组中
     var css =[
         "#fixed_bar", // 底部的广告
         "#fixed_daoliu", // 底部的广告
         ".tbui_aside_float_bar", // 分享插件
         ".share_btn_wrapper", // 一层楼底部的分享
         ".right_bright", // 详情页右侧的边栏，去掉后加大内容显示区域
         ".topic_list_box", // 右侧的热帖推荐
         ".save_face_bg", // 挽尊1
         ".save_face_bg_2", // 挽尊2
         "#thread_list>li:not(.thread_top_list_folder):not(.j_thread_list)", // 帖子列表里的广告
         ".firework-wrap", // 烟花
         ".app_download_box", // 下载app二维码
         ".celebrity", // 本吧会员兑换
         ".j_encourage_entry", // 推荐应用

             ].join(" , ");

     // hide no use element
     css += " {overflow:hidden;height:0;margin:0;padding:0} ";


     css += "#j_core_title_wrap { width:980px }"; // 详情页顶部拓宽
     css += ".d_post_content_main { width:820px}"; // 详情页内容区域拓宽
     css += ".l_post_bright { width:980px}"; // 详情页拓宽
     css += ".core_reply_wrapper { width:805px}"; // 详情页楼中楼拓宽
     css += ".BDE_Image { max-width:820px}"; // 详情页图片最大宽度，一般没啥用，因为百度返回的图片还是按照以前的尺寸

     // apply css
     GM_addStyle(css);

    // 去掉详情页的帖子广告，用了js是因为没有找到更好的css过滤
    var nodes = document.querySelectorAll('.l_post');
    nodes.forEach(function(node){
        if(node.classList.length > 4) {
           node.remove();
        }
    });

})();