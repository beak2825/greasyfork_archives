// ==UserScript==
// @name         掘金沉浸式阅读
// @namespace    http://www.example.com/
// @version      2.0.1.1
// @license      MIT Licensed
// @description  为掘金PC网站的沉浸阅读作扩展，原来沉浸阅读只是将部分元素隐藏，扩展后将主体文章放大至100%，便于阅读
// @author       静美书斋
// @match        https://juejin.cn/post/*
// @icon         https://lf-web-assets.juejin.cn/obj/juejin-web/xitu_juejin_web/6c61ae65d1c41ae8221a670fa32d05aa.svg
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/507586/%E6%8E%98%E9%87%91%E6%B2%89%E6%B5%B8%E5%BC%8F%E9%98%85%E8%AF%BB.user.js
// @updateURL https://update.greasyfork.org/scripts/507586/%E6%8E%98%E9%87%91%E6%B2%89%E6%B5%B8%E5%BC%8F%E9%98%85%E8%AF%BB.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 用window的onload事件，窗体加载完毕的时候
    window.onload = function(){
        console.log("页面加载完成====>>onload");
        main();
    }

    /**
     * [部分逻辑说明]
     * 1.针对掘金沉浸按钮左键单击做扩展，移除不必要的元素，包括目录、导航栏、右下角部分按钮；并将文章主体扩展至100%；
     * 2.沉浸按钮右键绑定事件，当单击时，包括原有左键单击事件内容外，额外的，移除包括左侧系列按钮(包括沉浸按钮)、右下脚全部按钮。
     * 
     * [开发原则或注意事项]
     * 1.可以使用id选择器时不要使用class选择器；
     * 2.当单个标签中存在多个class元素进行querySelector选择时，中间连写，即中间可以不用空格；即，中间空格表示后代元素，但实际上这些类名都在同一个元素上，应该使用连续的类选择器（不加空格）
     * 3.使用确定性的class命令，不要使用data-v-xxx内容进行选择；
     * 4.行尾注释时不要进行多次tab，否则可能会造成querySelector选择失效。
     *
     * [操作手法说明]
     * 方式一：左键单击，进入默认沉浸+沉浸扩展
     * 方式二：右键单击，进入完全沉浸
     * 方式三：左键单击后右键单击，先进入沉浸扩展，后再进入完全沉浸
     * 
     * [左键单击和右键单击区别]
     * 1.左键单击时元素的隐藏和显示有原生方法加持，沉浸扩展后，只保留沉浸按钮和Top按钮
     * 2.右键单击连同沉浸按钮和Top按钮也隐藏，方便文章采集。
     */

    let isImmersive = false;

    // 主函数
    function main() {

        // 使用更精确的选择器，获取该沉浸按钮必须使用'.article-suspended-panel .tooltip'进行选择！
        const myButton = document.querySelector('.article-suspended-panel .tooltip');
        console.log("myButton=",myButton);
        if (myButton) {
            myButton.addEventListener("click", function() {
                isImmersive = !isImmersive;
                if (isImmersive) {
                    // console.log("按钮被点击了！全屏！！");
                    hide(true, false);
                } else {
                    // console.log("按钮被点击了！关闭全屏！！");
                    hide(false, false);
                }
            });
            myButton.addEventListener("contextmenu", function(e) {
                e.preventDefault(); // 阻止默认的右键菜单
                // 在这里添加右键单击时要执行的操作
                // console.log('右键单击了沉浸阅读按钮');
                // 在这里添加进入全屏模式的代码
                hide(true,true);
            });
        } else {
            console.error("未找到沉浸式阅读按钮，请检查选择器");
        }
    }

    // 公共调用方法
    // isImmersive  左键单击 沉浸状态 true-进入沉浸 false-退出沉浸
    // isImmersiveX 右键单击 沉浸状态 true-进入完全沉浸 false-不操作
    function hide(isImmersive, isImmersiveX) {

        // 网页顶部banner
        const globalBanner = document.querySelector('.global-banner.global-top-banner');
        // 文章主体前标签图文广告
        const img = document.querySelector('img[data-v-38a6c62f][src*="byteimg.com"]'); // 匹配部分 src
        // 文章主体
        const article = document.querySelector('.main-area.article-area');
        // 网站导航栏
        const header = document.querySelector('.main-header');
        // 右下角：AI助手、建议反馈、更多、回到顶部按钮
        const globalComponentBox = document.querySelector('.global-component-box'); // 右下角按钮容器
        const aiBtn = document.querySelector('.btn.btn-ai');
        const meiqiaBtn = document.querySelector('.btn.meiqia-btn');
        const moreBtn = document.querySelector('.global-component-box .more-btn');
        const topBtn = document.querySelector('.btn.to-top-btn');
        // 全屏后与最上层间隔
        const headerBox = document.querySelector('.main-header');
        // 文章下面的标签
        // const articleEnd = document.querySelector('.article-end');
        const rankEntryBottom = document.querySelector('.rank-entry-bottom');
        const tagListBox = document.querySelector('.tag-list-box');
        // 左侧所有按钮，包括沉浸按钮
        const immersiveButtons = document.querySelector('.article-suspended-panel.dynamic-data-ready');
        // AI代码助手上线啦 弹窗（操作说明：当页面出现该弹窗元素时，单击有效；否则无效）
        const aiAssistantNotification = document.querySelector('.ai-assistant-notification.ai-assistant-transition');
        // 登陆掘金领取礼包 弹窗（操作说明：当页面出现该弹窗元素时，单击有效；否则无效）
        const bottomLoginGuide = document.querySelector('.bottom-login-guide');

        // 上一篇或下一篇
        const columnContainer = document.querySelector('.column-container');
        // 评论区
        const commentBox = document.querySelector('#comment-box');
        // 右侧内容 包括目录、相关推荐、精选内容
        const sidebarContainer = document.querySelector('#sidebar-container');
        // 为你推荐内容
        var mainAreaRecommendedArea = document.querySelector('.main-area.recommended-area.entry-list-container.shadow');

        if (isImmersive) {
            if (globalBanner) {
                globalBanner.style.display = 'none';
            }
            if (img) {
                img.style.display = 'none';
            }
            header.style.display = 'none';
            aiBtn.style.display = 'none';
            meiqiaBtn.style.display = 'none';
            moreBtn.style.display = 'none';
            // articleEnd.style.display = 'none';
            rankEntryBottom.style.display = 'none';
            tagListBox.style.display = 'none';
            article.style.width = '100%';
            headerBox.style.height = '0';
            if (aiAssistantNotification && aiAssistantNotification.style) {
                aiAssistantNotification.style.display = 'none';
            }
            if (bottomLoginGuide && bottomLoginGuide.style) {
                bottomLoginGuide.style.display = 'none';
            }


            if (columnContainer && columnContainer.style) {
                columnContainer.style.display = 'none';
            }
            commentBox.style.display = 'none';
            sidebarContainer.style.display = 'none';
            mainAreaRecommendedArea.style.display = 'none';

            // 进入完全沉浸
            if (isImmersiveX) {
                // 进入完全沉浸时将右下角全部隐藏
                globalComponentBox.style.display = 'none';
                // 移除左侧所有按钮，包括沉浸按钮
                immersiveButtons.style.display = 'none';

            }
        } else {
            if (globalBanner) {
                globalBanner.style.display = '';
            }
            if (img) {
                img.style.display = '';
            }
            header.style.display = '';
            aiBtn.style.display = '';
            meiqiaBtn.style.display = '';
            moreBtn.style.display = '';
            // articleEnd.style.display = '';
            rankEntryBottom.style.display = '';
            tagListBox.style.display = '';
            article.style.width = '820px';
            headerBox.style.height = '5rem';
            if (aiAssistantNotification && aiAssistantNotification.style) {
                aiAssistantNotification.style.display = '';
            }
            if (bottomLoginGuide && bottomLoginGuide.style) {
                bottomLoginGuide.style.display = '';
            }

            if (columnContainer && columnContainer.style) {
                columnContainer.style.display = '';
            }
            commentBox.style.display = '';
            sidebarContainer.style.display = '';
            mainAreaRecommendedArea.style.display = '';
        }
    }

})();