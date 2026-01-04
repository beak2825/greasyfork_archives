// ==UserScript==
// @name         网道/WangDo美化（暗黑模式）
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  网道样式优化，暗黑模式、高分辨率以提升阅读体验,支持右侧目录隐藏
// @author       kelosun
// @match        https://wangdoc.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=wangdoc.com
// @require      https://code.jquery.com/jquery-3.7.1.min.js
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/501751/%E7%BD%91%E9%81%93WangDo%E7%BE%8E%E5%8C%96%EF%BC%88%E6%9A%97%E9%BB%91%E6%A8%A1%E5%BC%8F%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/501751/%E7%BD%91%E9%81%93WangDo%E7%BE%8E%E5%8C%96%EF%BC%88%E6%9A%97%E9%BB%91%E6%A8%A1%E5%BC%8F%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 添加暗黑模式的样式
    const darkModeStyle = `
        body {
            background-color: #1a1a1a;
            color: #e0e0e0;
        }
        .panel-menu .panel-block {
            background-color: #2b2b2b;
            border: 1px solid #3d3d3d;
        }
        .navbar {
            background-color: #2b2b2b;
            color: #e0e0e0;
        }
        .article-toc {
            background-color: #2b2b2b;
            border: 1px solid #3d3d3d;
        }
        .main .container {
            background-color: #2b2b2b;
            border: 1px solid #3d3d3d;
        }
    `;

    // 添加样式到头部
    const style = $('<style></style>').text(darkModeStyle);
    $('head').append(style);

    // 右侧的大导航
    const rightColumn = $('.column.is-3');
    rightColumn.remove();
    $(rightColumn).removeClass('is-offset-1');
    $(rightColumn).css({
        'position': 'fixed',
        'width': '300px',
        'z-index': '1'
    });
    $('.main').append(rightColumn);

    // 中间的内容导航
    const toc = $('.article-toc');
    toc.remove();
    $(toc).css({
        'position': 'fixed',
        'right': '40px',
        'height': 'calc(100vh - 98px)',
        'display': 'inherit',
        'overflow-y': 'scroll',
        'width': '300px',
        'z-index': '1'
    });
    $('.main').append(toc);

    // 内容 + 评论
    const container = $('.main .container');
    container.remove();
    $('.main').append(container);
    $('.main').css('padding-top', '80px');
    $('.column.is-6-widescreen.is-8').removeClass('is-offset-1-widescreen');
    $('.column.is-6-widescreen.is-8').css({
        'width': '100%',
        'padding-left': '90px',
        'padding-right': '120px'
    });

    // 删除支持面板
    $('.panel-support').remove();
    // 延迟1秒再次删除
    setTimeout(() => {
        $('.panel-support').remove();
    }, 1000);

    // 固定导航栏样式
    $('.navbar').css({
        'position': 'fixed',
        'width': '100%',
        'background-color': '#2b2b2b',
        'color': '#e0e0e0'
    });

})();
