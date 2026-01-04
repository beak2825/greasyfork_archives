// ==UserScript==
// @name         简书沉浸式阅读
// @namespace    http://www.example.com/
// @version      1.0.1
// @license      MIT Licensed
// @description  为简书PC网站上的文章添加沉浸阅读按钮，进入沉浸后将文章主体扩展至100%，便于阅读和采集
// @author       静美书斋
// @match        https://www.jianshu.com/p/*
// @icon         https://www.jianshu.com/favicon.ico
// @grant        none
// @require      https://cdn.jsdelivr.net/npm/jquery@3.6.0/dist/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/510416/%E7%AE%80%E4%B9%A6%E6%B2%89%E6%B5%B8%E5%BC%8F%E9%98%85%E8%AF%BB.user.js
// @updateURL https://update.greasyfork.org/scripts/510416/%E7%AE%80%E4%B9%A6%E6%B2%89%E6%B5%B8%E5%BC%8F%E9%98%85%E8%AF%BB.meta.js
// ==/UserScript==   

(function() {
    'use strict';

    // -------------------------------- 全局常量设置 开始 --------------------------------
    
    // 存储默认的scroll事件监听器
    var originalScrollHandlers = {
        document: [],
        window: []
    };

    // 是否进入沉浸阅读 false-否 true-是，默认为false
    let isImmersive = false;
    // 是否删除过弹窗 false-否 true-是，默认为false
    let isdeletePopUpWindows = false;
    // 定时器 删除弹窗
    var myTime;

    // -------------------------------- 全局常量设置 结束 --------------------------------
    

    // 用window的onload事件，窗体加载完毕的时候
    window.onload = function(){
        console.log("页面加载完成====》onload");
        main();
    }

    // 定时器 需要放在设置定时器之前，防止加载顺序问题！
    var deletePopUpWindows = function() {
        // 检测元素存在时删除弹窗及蒙版
        if ($('._23ISFX-body').length > 0) {
            $('._23ISFX-body').remove();
            $('._23ISFX-mask').remove();
            console.log('删除弹窗及蒙版!');
        } else {
            // console.log('无弹窗!');
        }
    }

    // 主函数
    function main() {

        // 定时器 用于删除弹窗
        var myTime = setInterval(deletePopUpWindows, 2000);

        // 创建沉浸阅读按钮
        const immersiveButton = $('<div>', {
            class: 'immersive-button',
            css: {
                'width': '48px',
                'height': '48px',
                'background-color': '#ffffff',
                'border': '1px solid #f2f2f2',
                'border-radius': '50%',
                'cursor': 'pointer',
                // 'margin': '20px auto 0',
                'margin': '-5px auto 0', // [top right/left botton]
                'display': 'flex',
                'align-items': 'center',
                'justify-content': 'center',
                'position': 'relative'
            }
        });

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
        $('._3Pnjry').append(immersiveWrapper);

        // 添加图标
        const icon = $('<div>', {
            css: {
                'width': '22px',
                'height': '22px',
                'background-color': '#969696',
                'mask-image': 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 21 21\'%3E%3Cpath d=\'M0.25 1C0.25 0.585786 0.585786 0.25 1 0.25H4C4.41421 0.25 4.75 0.585786 4.75 1C4.75 1.41421 4.41421 1.75 4 1.75H1.75V4C1.75 4.41421 1.41421 4.75 1 4.75C0.585786 4.75 0.25 4.41421 0.25 4V1ZM0.25 19C0.25 19.4142 0.585786 19.75 1 19.75H4C4.41421 19.75 4.75 19.4142 4.75 19C4.75 18.5858 4.41421 18.25 4 18.25H1.75V16C1.75 15.5858 1.41421 15.25 1 15.25C0.585786 15.25 0.25 15.5858 0.25 16V19ZM19 0.25C19.4142 0.25 19.75 0.585786 19.75 1V4C19.75 4.41421 19.4142 4.75 19 4.75C18.5858 4.75 18.25 4.41421 18.25 4V1.75H16C15.5858 1.75 15.25 1.41421 15.25 1C15.25 0.585786 15.5858 0.25 16 0.25H19ZM19.75 19C19.75 19.4142 19.4142 19.75 19 19.75H16C15.5858 19.75 15.25 19.4142 15.25 19C15.25 18.5858 15.5858 18.25 16 18.25H18.25V16C18.25 15.5858 18.5858 15.25 19 15.25C19.4142 15.25 19.75 15.5858 19.75 16V19ZM7 5C5.89543 5 5 5.89543 5 7V13C5 14.1046 5.89543 15 7 15H13C14.1046 15 15 14.1046 15 13V7C15 5.89543 14.1046 5 13 5H7Z\'/%3E%3C/svg%3E")',
                '-webkit-mask-image': 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 21 21\'%3E%3Cpath d=\'M0.25 1C0.25 0.585786 0.585786 0.25 1 0.25H4C4.41421 0.25 4.75 0.585786 4.75 1C4.75 1.41421 4.41421 1.75 4 1.75H1.75V4C1.75 4.41421 1.41421 4.75 1 4.75C0.585786 4.75 0.25 4.41421 0.25 4V1ZM0.25 19C0.25 19.4142 0.585786 19.75 1 19.75H4C4.41421 19.75 4.75 19.4142 4.75 19C4.75 18.5858 4.41421 18.25 4 18.25H1.75V16C1.75 15.5858 1.41421 15.25 1 15.25C0.585786 15.25 0.25 15.5858 0.25 16V19ZM19 0.25C19.4142 0.25 19.75 0.585786 19.75 1V4C19.75 4.41421 19.4142 4.75 19 4.75C18.5858 4.75 18.25 4.41421 18.25 4V1.75H16C15.5858 1.75 15.25 1.41421 15.25 1C15.25 0.585786 15.5858 0.25 16 0.25H19ZM19.75 19C19.75 19.4142 19.4142 19.75 19 19.75H16C15.5858 19.75 15.25 19.4142 15.25 19C15.25 18.5858 15.5858 18.25 16 18.25H18.25V16C18.25 15.5858 18.5858 15.25 19 15.25C19.4142 15.25 19.75 15.5858 19.75 16V19ZM7 5C5.89543 5 5 5.89543 5 7V13C5 14.1046 5.89543 15 7 15H13C14.1046 15 15 14.1046 15 13V7C15 5.89543 14.1046 5 13 5H7Z\'/%3E%3C/svg%3E")',
                'mask-size': 'cover',
                '-webkit-mask-size': 'cover',
                // 'margin-left': '12px',
                // 'margin-top': '12px',
            }
        });
        immersiveButton.append(icon);

        // 添加文字描述
        const immersiveButtonTip = $('<div>', {
            class: 'P63n6G immersive-button-tip',
            text: '沉浸阅读'
        }).appendTo(immersiveWrapper);


        // 左键单击事件：进入沉浸阅读，保留沉浸按钮
        immersiveButton.on('click', toggleImmersiveReading);

        // 右键单击事件：进入沉浸阅读，不保留沉浸按钮，方便数据采集
        immersiveButton.on('contextmenu', function(e) {
            e.preventDefault(); // 阻止默认的右键菜单
            // 在这里添加右键单击时要执行的操作
            // console.log('右键单击了沉浸阅读按钮');
            hide(true, true);
        });

        // 添加悬停效果 特别说明：当在此对icon.css设置背景色后，则在hide方法中再设置该值时无效。
        immersiveButton.hover(
            function() {
                // icon.css('background-color', '#858585');
                customTooltip.css({
                    'opacity': '1',
                    'bottom': '125%'
                });
            },
            function() {
                // icon.css('background-color', '#8A92A5');
                customTooltip.css({
                    'opacity': '0',
                    'bottom': '320%'
                });
            }
        );

        // 点击沉浸阅读按钮时的处理函数
        function toggleImmersiveReading() {
            isImmersive = !isImmersive;

            if (isImmersive) {
                // console.log('左键单击了沉浸阅读按钮--->>进入沉浸');
                hide(true, false);
            } else {
                // console.log('左键单击了沉浸阅读按钮--->>退出沉浸');
                hide(false, false);
            }
            updateTooltipText(); // 更新文本
        }

        // 更新提示文本的函数
        function updateTooltipText() {
            customTooltip.text(isImmersive ? '退出沉浸' : '沉浸阅读');
        }

        // 公共调用方法
        function hide(isImmersive, isImmersiveX) {

            if (isImmersive) {
                // 弹窗
                $('._23ISFX-body').hide();

                // 头部
                $('#__next header').hide();
                // 头部 是否置顶
                $('._3VRLsv').css('padding-top', '0');

                // 左侧 隐藏其他交互按钮
                $('._3Pnjry ._1pUUKr').hide();
                $('._3Pnjry').css('left','calc((100vw - 1000px)/2 - 120px)');

                // 右侧
                $('._2OwGUo').hide();

                // 底部
                $('footer').hide();
                // 底部 点赞信息
                $('._1kCBjS').hide();
                // 底部 赞赏
                $('._13lIbp').hide();
                // 底部 个人头像
                $('.d0hShY').hide();
                // 底部 评论
                $('#note-page-comment').hide();
                // 底部 其他文章
                // $('._gp-ck > section:nth-child(2)').hide();
                $('._gp-ck > section:gt(0)').hide();
                
                // 将文章主体扩至100%
                $('._gp-ck').css('width', '100%');
                
                // 设置按钮颜色
                icon.css('background-color', '#FFFFFF');
                immersiveButton.css('background-color', '#EC7259');


                // 移除并保存默认的scroll事件
                removeAndStoreDefaultScrollHandlers();

                // 进入完全沉浸
                if (isImmersiveX) {
                    // console.log("右键单击->进入完全沉浸");
                    // 隐藏沉浸按钮
                    $('.immersive-wrapper').hide();
                    // 回到顶部按钮，由于是默认滚轮事件驱动，需要在关闭默认滚轮
                    $('.ant-back-top').hide();
                    // 添加自定义滚轮事件
                    addCustomScrollHandler();
                }

            } else {
                // 弹窗
                // $('._23ISFX-body').hide();

                // 头部
                $('#__next header').show();
                // 头部 是否置顶
                $('._3VRLsv').css('padding-top', '10px');

                // 左侧 隐藏其他交互按钮
                $('._3Pnjry ._1pUUKr').show();
                $('._3Pnjry').css('left','calc((100vw - 1000px)/2 - 78px)');

                // 右侧
                $('._2OwGUo').show();

                // 底部
                $('footer').show();
                // 底部 点赞信息
                $('._1kCBjS').show();
                // 底部 赞赏
                $('._13lIbp').show();
                // 底部 个人头像
                $('.d0hShY').show();
                // 底部 评论
                $('#note-page-comment').show();
                // 底部 其他文章
                // $('._gp-ck > section:nth-child(2)').show();
                $('._gp-ck > section:gt(0)').show();


                // 恢复文章主体
                $('._gp-ck').css('width', '730px');

                // 恢复按钮颜色
                icon.css('background-color', '#969696');
                immersiveButton.css('background-color', '#FFFFFF');

                // 恢复默认scroll事件
                restoreDefaultScrollHandlers();

            }
        }

    }


    // ----------------------------------------------- 自定义滚轮操作 开始 -----------------------------------------------
    // 自定义的 scroll 处理函数
    var onscroll = (event) => {
        // console.log('自定义 scroll 事件触发', event);
        // 在这里添加你的自定义 scroll 处理逻辑
        // 实时隐藏默认向上按钮 防止多次出现
        $('.ant-back-top').hide();
    };

    // 添加自定义的 scroll 事件处理器
    function addCustomScrollHandler() {
        $(window).on('scroll', onscroll);
        // console.log('已添加自定义 scroll 事件处理器');
    }

    // ----------------------------------------------- 自定义滚轮操作 结束 -----------------------------------------------
    // 
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
        $(window).off('scroll', onscroll);

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