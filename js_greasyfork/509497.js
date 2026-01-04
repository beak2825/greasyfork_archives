// ==UserScript==
// @name         百家号沉浸式阅读
// @namespace    http://www.example.com/
// @version      1.1.1
// @license      MIT Licensed
// @description  为百度百家号PC网站文章添加沉浸式阅读功能
// @author       静美书斋
// @match        https://mbd.baidu.com/newspage/*
// @match        https://baijiahao.baidu.com/*
// @icon         https://bjhstatic.cdn.bcebos.com/favicon.ico
// @grant        none
// @require      https://cdn.jsdelivr.net/npm/jquery@3.6.0/dist/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/509497/%E7%99%BE%E5%AE%B6%E5%8F%B7%E6%B2%89%E6%B5%B8%E5%BC%8F%E9%98%85%E8%AF%BB.user.js
// @updateURL https://update.greasyfork.org/scripts/509497/%E7%99%BE%E5%AE%B6%E5%8F%B7%E6%B2%89%E6%B5%B8%E5%BC%8F%E9%98%85%E8%AF%BB.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建沉浸阅读按钮
    const immersiveButton = $('<div>', {
        class: 'immersive-button',
        css: {
            'width': '48px',
            'height': '48px',
            'border': '1px solid #edf1fd',
            'border-radius': '50%',
            'cursor': 'pointer',
            'margin': '20px auto 0',
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

    // 添加图标
    const icon = $('<div>', {
        css: {
            'width': '22px',
            'height': '22px',
            'background-color': '#333333',
            'mask-image': 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 21 21\'%3E%3Cpath d=\'M0.25 1C0.25 0.585786 0.585786 0.25 1 0.25H4C4.41421 0.25 4.75 0.585786 4.75 1C4.75 1.41421 4.41421 1.75 4 1.75H1.75V4C1.75 4.41421 1.41421 4.75 1 4.75C0.585786 4.75 0.25 4.41421 0.25 4V1ZM0.25 19C0.25 19.4142 0.585786 19.75 1 19.75H4C4.41421 19.75 4.75 19.4142 4.75 19C4.75 18.5858 4.41421 18.25 4 18.25H1.75V16C1.75 15.5858 1.41421 15.25 1 15.25C0.585786 15.25 0.25 15.5858 0.25 16V19ZM19 0.25C19.4142 0.25 19.75 0.585786 19.75 1V4C19.75 4.41421 19.4142 4.75 19 4.75C18.5858 4.75 18.25 4.41421 18.25 4V1.75H16C15.5858 1.75 15.25 1.41421 15.25 1C15.25 0.585786 15.5858 0.25 16 0.25H19ZM19.75 19C19.75 19.4142 19.4142 19.75 19 19.75H16C15.5858 19.75 15.25 19.4142 15.25 19C15.25 18.5858 15.5858 18.25 16 18.25H18.25V16C18.25 15.5858 18.5858 15.25 19 15.25C19.4142 15.25 19.75 15.5858 19.75 16V19ZM7 5C5.89543 5 5 5.89543 5 7V13C5 14.1046 5.89543 15 7 15H13C14.1046 15 15 14.1046 15 13V7C15 5.89543 14.1046 5 13 5H7Z\'/%3E%3C/svg%3E")',
            '-webkit-mask-image': 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 21 21\'%3E%3Cpath d=\'M0.25 1C0.25 0.585786 0.585786 0.25 1 0.25H4C4.41421 0.25 4.75 0.585786 4.75 1C4.75 1.41421 4.41421 1.75 4 1.75H1.75V4C1.75 4.41421 1.41421 4.75 1 4.75C0.585786 4.75 0.25 4.41421 0.25 4V1ZM0.25 19C0.25 19.4142 0.585786 19.75 1 19.75H4C4.41421 19.75 4.75 19.4142 4.75 19C4.75 18.5858 4.41421 18.25 4 18.25H1.75V16C1.75 15.5858 1.41421 15.25 1 15.25C0.585786 15.25 0.25 15.5858 0.25 16V19ZM19 0.25C19.4142 0.25 19.75 0.585786 19.75 1V4C19.75 4.41421 19.4142 4.75 19 4.75C18.5858 4.75 18.25 4.41421 18.25 4V1.75H16C15.5858 1.75 15.25 1.41421 15.25 1C15.25 0.585786 15.5858 0.25 16 0.25H19ZM19.75 19C19.75 19.4142 19.4142 19.75 19 19.75H16C15.5858 19.75 15.25 19.4142 15.25 19C15.25 18.5858 15.5858 18.25 16 18.25H18.25V16C18.25 15.5858 18.5858 15.25 19 15.25C19.4142 15.25 19.75 15.5858 19.75 16V19ZM7 5C5.89543 5 5 5.89543 5 7V13C5 14.1046 5.89543 15 7 15H13C14.1046 15 15 14.1046 15 13V7C15 5.89543 14.1046 5 13 5H7Z\'/%3E%3C/svg%3E")',
            'mask-size': 'cover',
            '-webkit-mask-size': 'cover'
        }
    });

    immersiveButton.append(icon);

    // 创建包裹沉浸阅读按钮的div
    const immersiveWrapper = $('<div>', {
        class: 'immersive-wrapper',
        css: {
            'text-align': 'center'
        }
    }).append(immersiveButton);

    // 将按钮添加到适当位置
    // $('._3PLyv > div:nth-child(0)').before(immersiveWrapper); // 原本想放在第一个，但是无效，child设置为1放在第二位时影响其他按钮布局
    $('._3PLyv').append(immersiveWrapper);

    // 是否进入沉浸阅读 false-否 true-是，默认为false
    let isImmersive = false;

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

    // 左键单击事件：进入沉浸阅读，保留沉浸按钮
    immersiveButton.on('click', toggleImmersiveReading);

    // 右键单击事件：进入沉浸阅读，不保留沉浸按钮，方便数据采集
    immersiveButton.on('contextmenu', function(e) {
        e.preventDefault(); // 阻止默认的右键菜单
        // 在这里添加右键单击时要执行的操作
        // console.log('右键单击了沉浸阅读按钮');
        hide(true, true);
    });

    // 更新提示文本的函数
    function updateTooltipText() {
        customTooltip.text(isImmersive ? '退出沉浸' : '沉浸阅读');
    }

    // 添加悬停效果 特别说明：当在此对icon.css设置背景色后，则在hide方法中再设置该值时无效。
    immersiveButton.hover(
        function() {
            icon.css('background-color', '#858585');
            customTooltip.css({
                'opacity': '1',
                'bottom': '125%'
            });
        },
        function() {
            icon.css('background-color', '#333333');
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
            $('.-F_R2').hide();
            // 作者信息、作者最新文章、相关推荐
            $('._2v051').hide();
            // 相关搜索
            $('.tw0jb').hide();
            // 评论（id选择器）
            $('#commentModule').hide();
            // 底部信息
            $('.Wo80H').hide();
            // 举报/反馈
            $('._3hMwG').last().hide();
            // 隐藏其他交互按钮
            $('._3PLyv > div:not(.immersive-wrapper)').hide();
            // 头部取消间距
            $('._2jN0Z').css('padding-top', '0px');

            // 将文章主体扩至100%
            $('.EaCvy').css('width', '100%');
            // icon.css('background-color', '#FFAC06');  // 橙色 与收藏按钮点击效果保持一致

            // 方式一:进行滚轮事件监听与处理
            // $(window).bind('scroll', function(){
            //     console.log("进行滚轮运行中...");
            // });
            // 方式二
            // $(window).scroll(function () {
            //     // 头部进行再次删除，防止在滚轮中再次出现
            //     $('.-F_R2').hide();
            //     console.log("进行滚轮运行中...");
            // });
            // 方式三
            // $(window).bind('scroll', addScrollEvent);
            
            // 方式四: // 添加滚轮事件监听器（可用）
            window.addEventListener('wheel', handleScroll);

            // 进入完全沉浸
            if (isImmersiveX) {
                // 隐藏沉浸按钮
                $('.immersive-button').hide();
            }

        } else {
            // 头部
            $('.-F_R2').show();
            // 作者信息、作者最新文章、相关推荐
            $('._2v051').show();
            // 相关搜索
            $('.tw0jb').show();
            // 评论（id选择器）
            $('#commentModule').show();
            // 底部信息
            $('.Wo80H').show();
            // 举报/反馈
            $('._3hMwG').last().show();
            // 隐藏其他交互按钮
            $('._3PLyv > div:not(.immersive-wrapper)').show();
            // 头部恢复间距
            $('._2jN0Z').css('padding-top', '70px');

            // 移除滚轮事件监听器
            window.removeEventListener('wheel', handleScroll);

            // 恢复主体内容宽度
            $('.EaCvy').css('width', '700px');
            // icon.css('background-color', '#333333');
        }
    }

    // 处理滚轮事件
    function handleScroll() {
        // 头部进行再次删除，防止在滚轮中再次出现
        $('.-F_R2').hide();
        // console.log("进行滚轮运行中...");
    }

})();