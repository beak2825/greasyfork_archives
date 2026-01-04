// ==UserScript==
// @name         OpenHarmony开发者论坛增强
// @namespace    https://gitee.com/westinyang/codelabs
// @supportURL   https://gitee.com/westinyang/codelabs
// @homepageURL  https://gitee.com/westinyang/codelabs
// @version      1.0.2
// @description  网页排版优化、解锁隐藏功能、Markdown编辑器支持全屏、隐藏通知角标
// @author       westinyang
// @match        https://forums.openharmony.cn/*
// @match        https://forums.openharmony.cn/forum.php?mod=post&action=newthread&fid=*
// @match        https://forums.openharmony.cn/forum.php?mod=viewthread&tid=*
// @match        https://forums.openharmony.cn/forum.php?mod=post&action=reply*
// @match        https://forums.openharmony.cn/forum.php?mod=post&action=edit*
// @icon         https://forums.openharmony.cn/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/480350/OpenHarmony%E5%BC%80%E5%8F%91%E8%80%85%E8%AE%BA%E5%9D%9B%E5%A2%9E%E5%BC%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/480350/OpenHarmony%E5%BC%80%E5%8F%91%E8%80%85%E8%AE%BA%E5%9D%9B%E5%A2%9E%E5%BC%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var $ = jq;
    var url = location.href;

    // 隐藏通知角标
    add_css(".notice-icon .dot{ display: none !important; }");

    // 首页
    if (url == 'https://forums.openharmony.cn/') {
        // 顶部排行版显示
        // $('#qmenu_menu').show();
        // 右侧欢迎和积分显示
        $('.hl_vt_user_box, .hl_vt_user_box_ibtm').show();
    }
    // 提问题/写文章 | 文章详情回复 | 新窗口回复 | 相关的编辑页面
    else if (url.indexOf('forums.openharmony.cn/forum.php?mod=post&action=newthread&fid=') != -1
             || url.indexOf('forums.openharmony.cn/forum.php?mod=viewthread&tid=') != -1
             || url.indexOf('forums.openharmony.cn/forum.php?mod=post&action=reply') != -1
             || url.indexOf('forums.openharmony.cn/forum.php?mod=post&action=edit') != -1
            ) {
        // 等待Markdown编辑器加载完毕
        general_wait(function(){
            return $('.vditor-toolbar > .vditor-toolbar__item').length > 0;
        }, function(){
            // 给Markdown编辑器工具栏添加一个“全屏切换”按钮
            $('.vditor-toolbar').append('<div class="vditor-toolbar__divider"></div>').append('<div class="vditor-toolbar__item"><div id="ext-vditor-fullscreen" onclick="javascript:;" data-type="fullscreen" class="vditor-tooltipped vditor-tooltipped__nw" aria-label="全屏切换 <Ctrl+\'>"><svg><use xlink:href="#vditor-icon-fullscreen"></use></svg></div></div>');
            // 绑定单击事件
            $('#ext-vditor-fullscreen').click(function() {
                // 根据当前图标判断最大最小化行为
                if ($(this).find('use').attr('xlink:href') == '#vditor-icon-fullscreen') {
                    // 设置 表单宽度100%
                    $('#wp').width('100%');
                    // 移除 Markdown预览器最大800px宽度限制
                    $('.vditor-preview .vditor-reset').css('width', '').css('max-width', '');
                    // 设置 编辑器全屏悬浮
                    $('#vditor').css('cssText', 'z-index: 99999 !important').css('position', 'fixed').css('top', 0).css('left', 0).css('width', '100%').css('height', '100%');
                    // 修改 图标为缩小
                    $(this).find('use').attr('xlink:href', '#vditor-icon-contract');
                } else {
                    // 恢复 表单宽度1200px
                    $('#wp').width('1200px');
                    // 恢复 Markdown预览器最大800px宽度
                    $('.vditor-preview .vditor-reset').css('width', '800px').css('max-width', '800px');
                    // 恢复 编辑器默认布局
                    $('#vditor').css('z-index', '').css('position', '').css('top', '').css('left', '').css('width', '').css('height', '');
                    // 修改 图标为放大
                    $(this).find('use').attr('xlink:href', '#vditor-icon-fullscreen');
                }
            });
            // 绑定快捷键
            $(document).keydown(function (event){
                // Ctrl + '
                if (event.ctrlKey && event.keyCode == 222) {
                    $('#ext-vditor-fullscreen').trigger('click');
                }
            });
        });
    }

    // 通用等待
    function general_wait(condition, callback) {
        let _tmp_interval = setInterval(function() {
            try {
                let result = condition();
                if (result) {
                    clearInterval(_tmp_interval);
                    callback(result);
                }
            } catch(e) {}
        }, 500);
    }

    // 动态加载css样式
    function add_css(str) {
        var style = document.createElement("style");
        // style.type = "text/css";
        style.innerHTML = str;
        document.getElementsByTagName("HEAD").item(0).appendChild(style);
    }
})();