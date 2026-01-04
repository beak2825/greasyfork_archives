// ==UserScript==
// @name         今日头条沉浸式阅读
// @namespace    http://www.example.com/
// @version      2.1.2
// @license      MIT Licensed
// @description  ①为今日头条PC网站添加沉浸式阅读功能，优化按钮布局 ②进入沉浸阅读后，添加黑名单，拦截因滚轮到底部后触发的一系列加载事件
// @author       静美书斋
// @match        https://www.toutiao.com/article/*
// @match        https://www.toutiao.com/w/*
// @icon         https://www.toutiao.com/favicon.ico
// @grant        none
// @require      https://cdn.jsdelivr.net/npm/jquery@3.6.0/dist/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/502756/%E4%BB%8A%E6%97%A5%E5%A4%B4%E6%9D%A1%E6%B2%89%E6%B5%B8%E5%BC%8F%E9%98%85%E8%AF%BB.user.js
// @updateURL https://update.greasyfork.org/scripts/502756/%E4%BB%8A%E6%97%A5%E5%A4%B4%E6%9D%A1%E6%B2%89%E6%B5%B8%E5%BC%8F%E9%98%85%E8%AF%BB.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建沉浸阅读按钮
    const immersiveButton = $('<div>', {
        class: 'immersive-button',
        //title: '沉浸阅读', // 添加悬停时显示的文字
        css: {
            'width': '48px',
            'height': '48px',
            'background-color': '#f8f8f8',
            'border': '1px solid #f2f2f2',
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
            'background-color': '#222222',
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
    $('.detail-side-interaction').append(immersiveWrapper);

    // 是否进入沉浸阅读 false-否 true-是，默认为false
    let isImmersive = false;

    // 需要拦截的域名列表
    // 黑名单版本 -> 2024-09-10 16:13
    var blockedDomains = [
        '/ttwid/check',
        '/mp/agw/general/wenda/invite_count',
        '/ttwid/report_fingerprint',
        '/api/pc/list/feed',
        '/api/msg/tab_list',
        'https://helpdesk.bytedance.com/api',
        'https://lf3-beecdn.bytetos.com/obj',
        'https://mssdk.bytedance.com/web/common',
        'https://www.toutiao.com/feedback',
        'https://www.toutiao.com/api',
        'https://www.toutiao.com/api/pc/list/feed',
        'https://www.toutiao.com/api/msg/tab_list',
        'https://mon.zijieapi.com',
        'https://mon.zijieapi.com/monitor_web',
        'https://mon.zijieapi.com/monitor_web/settings/browser-settings',
        'https://mon.zijieapi.com',
        'https://mon.zijieapi.com/monitor_browser',
        'https://mon.zijieapi.com/monitor_browser/collect/batch',
        'https://mon.zijieapi.com/monitor_browser/collect/batch/',
        'https://mon.zijieapi.com/monitor_browser/collect/batch/?biz_id=toutiao_web_pc',
        'https://mcs.zijieapi.com/list'
    ];

    // 点击沉浸阅读按钮时的处理函数
    function toggleImmersiveReading() {
        isImmersive = !isImmersive;

        if (isImmersive) {
            hide(false);
        } else {
            // 显示其他交互按钮
            $('.detail-side-interaction > div:not(.immersive-wrapper)').show();
            // 恢复右侧信息
            $('.right-sidebar').show();
            // 恢复主体内容宽度
            $('.main').css('width', '676px');
            // 恢复评论部分下方的第三个div
            $('.main > div:nth-child(3)').show();
            // 恢复右下角如首页、反馈、下载、顶部等信息
            $('.ttp-toolbar').show();
            // 恢复顶部信息栏
            $('.ttp-sticky-container').show();
            // 恢复相关推荐内容
            $('.detail-end-feed').show();
            // 恢复推荐内容！！
            $('.main .show-monitor').eq(1).show();
            // 恢复举报按钮
            $('.action').show();
            // 恢复seo内容
            $('.seo-hot-link-list').show();
            // 恢复关注按钮
            $('.wtt-detail-subscribe').show();
            // 最后一行与底边移除间距
            $('.divide').css('margin-bottom', '0px');

            icon.css('background-color', '#222222');
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
        hide(true);
    });

    // 更新提示文本的函数
    function updateTooltipText() {
        customTooltip.text(isImmersive ? '退出沉浸' : '沉浸阅读');
    }

    // 添加悬停效果
    immersiveButton.hover(
        function() {
            $(this).css('background-color', '#f2f2f2');
            customTooltip.css({
                'opacity': '1',
                'bottom': '125%'
            });
        },
        function() {
            $(this).css('background-color', '#f8f8f8');
            customTooltip.css({
                'opacity': '0',
                'bottom': '120%'
            });
        }
    );

    // 公共调用方法
    function hide(flag) {
        // 隐藏其他交互按钮
        $('.detail-side-interaction > div:not(.immersive-wrapper)').hide();
        // 隐藏右侧信息
        $('.right-sidebar').hide();
        // 修改主体内容宽度 使用auto会存在问题，这里改用100%代替默认的676px
        $('.main').css('width', '100%');
        // 隐藏评论部分下方的第三个div
        $('.main > div:nth-child(3)').hide();
        // 隐藏右下角如首页、反馈、下载、顶部等信息
        $('.ttp-toolbar').hide();
        // 隐藏顶部信息栏
        $('.ttp-sticky-container').hide();
        // 隐藏相关推荐内容
        $('.detail-end-feed').hide();
        // 移除推荐内容！！
        $('.main .show-monitor').eq(1).hide();
        // 隐藏举报按钮
        $('.action').hide();
        // 隐藏seo内容
        $('.seo-hot-link-list').hide();
        // 隐藏关注按钮
        $('.wtt-detail-subscribe').hide();
        // 最后一行与底边设置一个间距
        $('.divide').css('margin-bottom', '60px');
        if (flag) {
            // 隐藏沉浸按钮
            $('.immersive-button').hide();
        } else {
            //icon.css('background-color', '#3385ff'); // 蓝色
            icon.css('background-color', '#FFC840');  // 橙色 与收藏按钮点击效果保持一致
        }
    }

    // 重写XMLHttpRequest:当进入沉浸阅读时，拦截在黑名单中的请求连接
    const originalXHR = window.XMLHttpRequest;
    window.XMLHttpRequest = function() {
        const xhr = new originalXHR();
        const open = xhr.open;

        xhr.open = function() {
            const url = arguments[1];
            const shouldBlock = blockedDomains.some(domain => url.includes(domain));
            // 调试时可以打开
            // console.log("[XML]shouldBlock:" + shouldBlock + ",isImmersive:" + isImmersive + ",获取想远程资源访问的URL:" + url);
            if (shouldBlock && isImmersive) {
                // 调试时可以打开
                // console.log('[XML]请求被拦截:', url);
                // 阻止请求
                return;
            }
            return open.apply(this, arguments);
        };

        return xhr;
    };
})();