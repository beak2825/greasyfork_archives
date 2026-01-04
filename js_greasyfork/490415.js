// ==UserScript==
// @name         CSDN美化器 By Heyl
// @namespace    http://tampermonkey.net/
// @version      1.0.3
// @description CSDN自动展开、只保留文章内容和目录
// @author       yongli.he
// @license      GPL-3.0 License
// @match      https://blog.csdn.net/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=greasyfork.org
// @grant        none
// @require https://cdn.bootcdn.net/ajax/libs/jquery/3.7.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/490415/CSDN%E7%BE%8E%E5%8C%96%E5%99%A8%20By%20Heyl.user.js
// @updateURL https://update.greasyfork.org/scripts/490415/CSDN%E7%BE%8E%E5%8C%96%E5%99%A8%20By%20Heyl.meta.js
// ==/UserScript==

(function() {
    'use strict';
    $(function(){
        // 删除左侧边栏
        $('.blog_container_aside').remove();
        // 设置内容父容器宽度为100%
        $('.main_father > .container').width('100%');
        // 设置内容宽度为100%
        $('.main_father > .container > main').width('100%');
        // 模拟点击所有代码块展开按钮
        $('.hide-preCode-bt').trigger('click');
        const groupfileLength = $('#recommend-right > .groupfile').length;
        if(groupfileLength > 0){
            // 有【目录】
            // 删除【最新文章】
            $('#asideArchive').remove();
            // 删除【分类专栏】
            $('#recommend-right > .kind_person').remove();
        }else{
            // 没有【目录】
            // 删除【右边栏】
            $('#recommend-right').remove();
            $('.recommend-right').remove();
            // 设置内容宽度右外边距为0
            $('#mainBox').css('margin-right', '0');
        }
        setTimeout(() => {
            // 贴边工具栏
            $('.csdn-side-toolbar').css('left', 'auto');
            setTimeout(() => {
                $('.csdn-side-toolbar > [data-type!="gotop"]').remove();
                //$('.csdn-side-toolbar > .sidetool-writeguide-box').remove();
            }, 1500);
        }, 100);
        // 删除【活动层】
        $('.csdn-toolbar-creative-mp').remove();
    });
})();