// ==UserScript==
// @name         腾讯云开发者社区沉浸式阅读
// @namespace    http://www.example.com/
// @version      1.0.0
// @license      MIT Licensed
// @description  为腾讯云开发者社区PC网站的沉浸阅读作扩展，原来沉浸阅读只是将部分元素隐藏，扩展后将不需要的元素隐藏，便于阅读
// @author       静美书斋
// @match        https://cloud.tencent.com/developer/article/*
// @icon         https://cloud.tencent.com/favicon.ico
// @grant        none
// @require      https://cdn.jsdelivr.net/npm/jquery@3.6.0/dist/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/510875/%E8%85%BE%E8%AE%AF%E4%BA%91%E5%BC%80%E5%8F%91%E8%80%85%E7%A4%BE%E5%8C%BA%E6%B2%89%E6%B5%B8%E5%BC%8F%E9%98%85%E8%AF%BB.user.js
// @updateURL https://update.greasyfork.org/scripts/510875/%E8%85%BE%E8%AE%AF%E4%BA%91%E5%BC%80%E5%8F%91%E8%80%85%E7%A4%BE%E5%8C%BA%E6%B2%89%E6%B5%B8%E5%BC%8F%E9%98%85%E8%AF%BB.meta.js
// ==/UserScript==

(function() {
    'use strict';

    $(document).ready(function(){
        // console.log("页面加载完成====>document");
        main();
    });


    /**
     * [操作手法说明]
     * 方式一：左键单击，进入默认沉浸+沉浸扩展
     * 方式二：右键单击，进入完全沉浸
     * 方式三：左键单击后右键单击，先进入沉浸扩展，后再进入完全沉浸
     */

    let isImmersive = false;

    // 主函数
    function main() {

        // 获取已有沉浸阅读按钮
        const myButton = $('.cdc-icon-btn.cdc-suspend-pill__item.cdc-icon-btn--text').eq(5);
        // console.log("myButton=", myButton);
        if (myButton) {
            myButton.on("click", function() {
                isImmersive = !isImmersive;
                if (isImmersive) {
                    console.log("按钮被点击了！沉浸阅读！！");
                    hide(true, false);
                } else {
                    console.log("按钮被点击了！关闭沉浸阅读！！");
                    hide(false, false);
                }
            });
            myButton.on("contextmenu", function(e) {
                e.preventDefault(); // 阻止默认的右键菜单
                // 在这里添加右键单击时要执行的操作
                console.log('右键单击了沉浸阅读按钮');
                // 在这里添加进入沉浸阅读模式的代码
                hide(true, true);
            });
        } else {
            console.error("未找到沉浸式阅读按钮，请检查选择器");
        }
    }

    // 公共调用方法
    // isImmersive  左键单击 沉浸状态 true-进入沉浸 false-退出沉浸
    // isImmersiveX 右键单击 沉浸状态 true-进入完全沉浸 false-不操作
    function hide(isImmersive, isImmersiveX) {

        if (isImmersive) {
            // 顶部 导航
            $('.cdc-header.cdc-header--block').hide();
            $('.cdc-header__bottom').hide();
            // 顶部 社区首页/专栏等
            $('.cdc-crumb.mod-crumb').hide();
            // 顶部 阅读数/评论数
            $('.mod-header__infos').hide();
            // 顶部 文章被收录信息
            $('.mod-header__special').hide();

            // 右侧 二维码/公告/Top
            $('.cdc-widget-global > :not(.top)').hide();
            // 右侧 举报按钮
            $('.mod-header__operates.mod-header__operates').hide();

            // 底部
            $('.cdc-footer').hide();

            // 左侧 除了沉浸按钮外其他功能按钮 eq索引从0开始
            $('.cdc-icon-btn.cdc-suspend-pill__item.cdc-icon-btn--text').eq(0).hide();
            $('.cdc-icon-btn.cdc-suspend-pill__item.cdc-icon-btn--text').eq(1).hide();
            $('.cdc-icon-btn.cdc-suspend-pill__item.cdc-icon-btn--text').eq(2).hide();
            $('.cdc-icon-btn.cdc-suspend-pill__item.cdc-icon-btn--text').eq(3).hide();
            $('.cdc-icon-btn.cdc-suspend-pill__item.cdc-icon-btn--text').eq(4).hide();
            $('.cdc-icon-btn.cdc-suspend-pill__item.cdc-icon-btn--text').eq(6).hide();
            // 左侧 分割线
            $('.cdc-suspend-pill__line').hide();

            if (isImmersiveX) {
                // 沉浸按钮
                $('.cdc-icon-btn.cdc-suspend-pill__item.cdc-icon-btn--text').eq(5).hide();
                // 先隐藏掉top
                $('.cdc-widget-global > .top').hide();
                // 滚轮事件 持续对top进行清除
                addCustomScrollHandler();

                // 防止首次进入完全沉浸，需进行不必要元素移除（由于完全进入后不再进行恢复，因此也可以直接删除，这里还是先hide操作）
                // 头部 滚动时出现的滚轮栏
                $('.cdc-sticky-header.mod-sticky-header').hide();
                // 右侧 全部元素
                $('.cdc-layout__side').hide();
                // 底部 评论区
                $('.mod-article-content.is-pill-hidden').hide();
                // 底部 推荐阅读
                $('.mod-article-content.recommend').hide();

            }
        } else {
            // 顶部 导航
            $('.cdc-header.cdc-header--block').show();
            $('.cdc-header__bottom').show();
            // 顶部 社区首页/专栏等
            $('.cdc-crumb.mod-crumb').show();
            // 顶部 阅读数/评论数
            $('.mod-header__infos').show();
            // 顶部 文章被收录信息
            $('.mod-header__special').show();

            // 右侧 二维码/公告/Top
            $('.cdc-widget-global > :not(.top)').show();
            // 右侧 举报按钮
            $('.mod-header__operates.mod-header__operates').show();

            // 底部
            $('.cdc-footer').show();

            // 左侧 除了沉浸按钮外其他功能按钮 eq索引从0开始
            $('.cdc-icon-btn.cdc-suspend-pill__item.cdc-icon-btn--text').eq(0).show();
            $('.cdc-icon-btn.cdc-suspend-pill__item.cdc-icon-btn--text').eq(1).show();
            $('.cdc-icon-btn.cdc-suspend-pill__item.cdc-icon-btn--text').eq(2).show();
            $('.cdc-icon-btn.cdc-suspend-pill__item.cdc-icon-btn--text').eq(3).show();
            $('.cdc-icon-btn.cdc-suspend-pill__item.cdc-icon-btn--text').eq(4).show();
            $('.cdc-icon-btn.cdc-suspend-pill__item.cdc-icon-btn--text').eq(6).show();
            // 左侧 分割线
            $('.cdc-suspend-pill__line').show();

            removeCustomScrollHandler();
        }
    }


    // ----------------------------------------------- 自定义滚轮操作 开始 -----------------------------------------------
    // 自定义的 scroll 处理函数
    var onscroll = (event) => {
        // console.log('自定义 scroll 事件触发', event);
        // 在这里添加你的自定义 scroll 处理逻辑
        // 实时隐藏默认向上按钮 防止多次出现
        $('.cdc-widget-global > .top').hide();
    };

    // 添加自定义的 scroll 事件处理器
    function addCustomScrollHandler() {
        $(window).on('scroll', onscroll);
        console.log('已添加自定义 scroll 事件处理器');
    }

    // 移除自定义的 scroll 事件处理器
    function removeCustomScrollHandler() {
        $(window).off('scroll', onscroll);
        console.log('已移除自定义 scroll 事件处理器');
    }
    // ----------------------------------------------- 自定义滚轮操作 结束 -----------------------------------------------

})();
