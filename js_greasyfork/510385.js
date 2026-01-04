// ==UserScript==
// @name         51CTO沉浸式阅读
// @namespace    http://www.example.com/
// @version      1.0.0
// @license      MIT Licensed
// @description  为 51CTO PC网站上的文章添加沉浸阅读按钮，进入沉浸后将文章主体扩展至100%，便于阅读和采集
// @author       静美书斋,迎宝
// @match        https://blog.51cto.com/*
// @icon         https://blog.51cto.com/favicon.ico
// @grant        none
// @require      https://cdn.jsdelivr.net/npm/jquery@3.6.0/dist/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/510385/51CTO%E6%B2%89%E6%B5%B8%E5%BC%8F%E9%98%85%E8%AF%BB.user.js
// @updateURL https://update.greasyfork.org/scripts/510385/51CTO%E6%B2%89%E6%B5%B8%E5%BC%8F%E9%98%85%E8%AF%BB.meta.js
// ==/UserScript==   

(function() {
    'use strict';

    // 存储默认的scroll事件监听器
    var originalScrollHandlers = {
        document: [],
        window: []
    };

    // 创建沉浸阅读按钮
    const immersiveButton = $('<li class="immersive-button"><strong class=""><a href="javascript:;"><i class="iconblog"><div class="immersive-i"></div></i></a><span>沉浸</span></strong></li>');

    // 创建自定义提示框
    const customTooltip = $('<div>', {
        class: 'custom-tooltip',
        text: '沉浸阅读',
        css: {
            'position': 'absolute',
            'background-color': '#333333',
            'color': '#ffffff',
            'padding': '5px 10px',
            'border-radius': '4px',
            'font-size': '12px',
            'white-space': 'nowrap',
            'bottom': '120%',
            'left': '50%',
            'transform': 'translateX(-50%)',
            'opacity': '0',
            'transition': 'opacity 0.3s, bottom 0.3s',
            'pointer-events': 'none',
            'z-index': '1000'
        }
    }).appendTo(immersiveButton);

    // 创建包裹沉浸阅读按钮的div
    const immersiveWrapper = $('<div>', {
        class: 'immersive-wrapper',
        css: {
            'text-align': 'center'
        }
    }).append(immersiveButton);

    // 将按钮添加到适当位置
    $('.inner > ul').append(immersiveWrapper);

    // 设置多个样式
    $(".immersive-i").css({
        'width': '22px',
        'height': '22px',
        // 'background-color': '#333333',
        'background-color': '#8A92A5',
        'mask-image': 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 21 21\'%3E%3Cpath d=\'M0.25 1C0.25 0.585786 0.585786 0.25 1 0.25H4C4.41421 0.25 4.75 0.585786 4.75 1C4.75 1.41421 4.41421 1.75 4 1.75H1.75V4C1.75 4.41421 1.41421 4.75 1 4.75C0.585786 4.75 0.25 4.41421 0.25 4V1ZM0.25 19C0.25 19.4142 0.585786 19.75 1 19.75H4C4.41421 19.75 4.75 19.4142 4.75 19C4.75 18.5858 4.41421 18.25 4 18.25H1.75V16C1.75 15.5858 1.41421 15.25 1 15.25C0.585786 15.25 0.25 15.5858 0.25 16V19ZM19 0.25C19.4142 0.25 19.75 0.585786 19.75 1V4C19.75 4.41421 19.4142 4.75 19 4.75C18.5858 4.75 18.25 4.41421 18.25 4V1.75H16C15.5858 1.75 15.25 1.41421 15.25 1C15.25 0.585786 15.5858 0.25 16 0.25H19ZM19.75 19C19.75 19.4142 19.4142 19.75 19 19.75H16C15.5858 19.75 15.25 19.4142 15.25 19C15.25 18.5858 15.5858 18.25 16 18.25H18.25V16C18.25 15.5858 18.5858 15.25 19 15.25C19.4142 15.25 19.75 15.5858 19.75 16V19ZM7 5C5.89543 5 5 5.89543 5 7V13C5 14.1046 5.89543 15 7 15H13C14.1046 15 15 14.1046 15 13V7C15 5.89543 14.1046 5 13 5H7Z\'/%3E%3C/svg%3E")',
        '-webkit-mask-image': 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 21 21\'%3E%3Cpath d=\'M0.25 1C0.25 0.585786 0.585786 0.25 1 0.25H4C4.41421 0.25 4.75 0.585786 4.75 1C4.75 1.41421 4.41421 1.75 4 1.75H1.75V4C1.75 4.41421 1.41421 4.75 1 4.75C0.585786 4.75 0.25 4.41421 0.25 4V1ZM0.25 19C0.25 19.4142 0.585786 19.75 1 19.75H4C4.41421 19.75 4.75 19.4142 4.75 19C4.75 18.5858 4.41421 18.25 4 18.25H1.75V16C1.75 15.5858 1.41421 15.25 1 15.25C0.585786 15.25 0.25 15.5858 0.25 16V19ZM19 0.25C19.4142 0.25 19.75 0.585786 19.75 1V4C19.75 4.41421 19.4142 4.75 19 4.75C18.5858 4.75 18.25 4.41421 18.25 4V1.75H16C15.5858 1.75 15.25 1.41421 15.25 1C15.25 0.585786 15.5858 0.25 16 0.25H19ZM19.75 19C19.75 19.4142 19.4142 19.75 19 19.75H16C15.5858 19.75 15.25 19.4142 15.25 19C15.25 18.5858 15.5858 18.25 16 18.25H18.25V16C18.25 15.5858 18.5858 15.25 19 15.25C19.4142 15.25 19.75 15.5858 19.75 16V19ZM7 5C5.89543 5 5 5.89543 5 7V13C5 14.1046 5.89543 15 7 15H13C14.1046 15 15 14.1046 15 13V7C15 5.89543 14.1046 5 13 5H7Z\'/%3E%3C/svg%3E")',
        'mask-size': 'cover',
        '-webkit-mask-size': 'cover',
        'margin': '13px 12px 0px 13px',
    });

    // 是否进入沉浸阅读 false-否 true-是，默认为false
    let isImmersive = false;

    // 点击沉浸阅读按钮时的处理函数
    function toggleImmersiveReading() {
        isImmersive = !isImmersive;

        if (isImmersive) {
            console.log('左键单击了沉浸阅读按钮--->>进入沉浸');
            hide(true, false);
        } else {
            console.log('左键单击了沉浸阅读按钮--->>退出沉浸');
            hide(false, false);
        }
        updateTooltipText(); // 更新文本
    }

    // 左键单击事件：进入沉浸阅读，保留沉浸按钮
    immersiveButton.on('click', toggleImmersiveReading);

    // 右键单击事件：进入沉浸阅读，不保留沉浸按钮，方便数据采集
    immersiveButton.on('contextmenu', function(e) {
        e.preventDefault(); // 阻止默认的右键菜单
        // 在这里添加右键单击时要执行的操作
        console.log('右键单击了沉浸阅读按钮');
        hide(true, true);
    });

    // 更新提示文本的函数
    function updateTooltipText() {
        customTooltip.text(isImmersive ? '退出沉浸' : '沉浸阅读');
    }

    // 添加悬停效果 特别说明：当在此对icon.css设置背景色后，则在hide方法中再设置该值时无效。
    immersiveButton.hover(
        function() {
            $(".immersive-i").css('background-color', '#858585');
            customTooltip.css({
                'opacity': '1',
                'bottom': '125%'
            });
        },
        function() {
            $(".immersive-i").css('background-color', '#8A92A5');
            customTooltip.css({
                'opacity': '0',
                'bottom': '320%'
            });
        }
    );

    // 公共调用方法
    function hide(isImmersive, isImmersiveX) {

        if (isImmersive) {
            // 头部
            $('.home-top').css("visibility","hidden");
            $('.Header').css("visibility","hidden");
            $('.fixtitle').css("visibility","hidden");
            // 著作权
            $('#copyright-btn').hide();
            // 右侧列表
            $('.detail-content-right').hide();
            // 悬浮小菜单
            $('.minmenu').css("visibility","hidden");
            // 小AI
            $('.hover-ball').css("visibility","hidden");
            // 底部栏
            $('.Footer').hide();
            // 评论
            $('#comment').hide();
            // 相关文章
            $('.detail-content-left > section').hide();
            // 底部操作按钮 赞/收藏/评论/分享/举报
            $('.action-box').hide();
            $('.clearfix .lists').hide();
            $('.clearfix .label-list').hide();
            $('#container p:last').hide();

            // 头部取消间距
            $('.Content').css('padding-top', '');
            $('.detail-content-new').css('padding', '0');

            // 将文章主体扩至100%
            $('.detail-content-new .Page .detail-content-left').css('width', '100%');
            $('#page_center').css('width', '1200px');
            // 文章主体向右移动取消，原来是326px
            $('.reset-right').css("right","0");
            // $(".immersive-i").css('background-color', '#FFAC06');   // 橙色 与收藏按钮点击效果保持一致

            // 左侧按钮向右一点
            $('aside.action-aside.action-aside-left').css("margin","-265px 0 0 -703px");

            // 隐藏其他交互按钮
            $('.inner ul > li').hide();

            // 添加自定义滚轮事件监听器
            // window.addEventListener('wheel', handleScroll);
            // var onscroll = (event) => {
            //     // console.log('打印',event);
            //     // console.log("111111111111111111");
            // };
            
            removeAndStoreDefaultScrollHandlers();

            // 进入完全沉浸
            if (isImmersiveX) {
                console.log("右键单击->进入完全沉浸");
                // 隐藏沉浸按钮
                $('.immersive-button').hide();
            }

        } else {
            // 头部
            $('.home-top').css("visibility","");
            $('.Header').css("visibility","");
            $('.fixtitle').css("visibility","");
            // 著作权
            $('#copyright-btn').show();
            // 右侧列表
            $('.detail-content-right').show();
            // 悬浮小菜单
            $('.minmenu').css("visibility","");
            // 小AI
            $('.hover-ball').css("visibility","");
            // 底部栏
            $('.Footer').show();
            // 评论
            $('#comment').show();
            // 相关文章
            $('.detail-content-left > section').show();
            // 底部操作按钮 赞/收藏/评论/分享/举报
            $('.action-box').show();
            $('.clearfix .lists').show();
            $('.clearfix .label-list').show();
            $('#container p:last').show();

            // 头部恢复间距
            $('.Content').css('padding-top', '20px');
            $('.Content .detail-content-new').css('padding', '114px 0 30px');
            
            // 移除滚轮事件监听器
            // window.removeEventListener('wheel', handleScroll);

            // 恢复主体内容宽度
            $('.detail-content-new .Page .detail-content-left').css('width', '1254px');
            $('#page_center').css('width', '1580px');
            // 文章主体向右移动恢复
            $('.reset-right').css("right","326px");
            // $(".immersive-i").css('background-color', '#8A92A5');
            
            // 左侧按钮恢复
            $('aside.action-aside.action-aside-left').css("margin","-300px 0 0 -892px");

            // 恢复其他交互按钮
            $('.inner ul > li').show();

            restoreDefaultScrollHandlers();
        }
    }

    // 处理滚轮事件
    function handleScroll() {
        // 小AI
        $('.hover-ball').hide();
        $('.hover-ball').css("visibility","hidden");
        console.log("进行滚轮运行中...");
    }

    // ----------------------------------------------- 针对默认滚轮操作 开始 -----------------------------------------------
    // 移除默认的 scroll 事件监听器并存储它们
    function removeAndStoreDefaultScrollHandlers() {
        originalScrollHandlers.document = storeOriginalHandlers($(document), 'scroll');
        originalScrollHandlers.window = storeOriginalHandlers($(window), 'scroll');

        $(document).off('scroll');
        $(window).off('scroll');

        console.log('已移除并存储默认的 scroll 事件监听器');
    }

    // 恢复默认的 scroll 事件监听器
    function restoreDefaultScrollHandlers() {
        // 首先移除自定义的 scroll 处理器
        // $(window).off('scroll', onscroll);

        // 恢复 document 的 scroll 事件处理器
        originalScrollHandlers.document.forEach(function(handler) {
            $(document).on('scroll', handler.handler);
        });

        // 恢复 window 的 scroll 事件处理器
        originalScrollHandlers.window.forEach(function(handler) {
            $(window).on('scroll', handler.handler);
        });

        console.log('已恢复默认的 scroll 事件监听器');
    }

    // 存储原始的事件处理器
    function storeOriginalHandlers(element, eventName) {
        var handlers = $._data(element[0], "events");
        if (handlers && handlers[eventName]) {
            return handlers[eventName].slice(); // 返回处理器的副本
        }
        return [];
    }
    // ----------------------------------------------- 针对默认滚轮操作 结束 -----------------------------------------------

})();