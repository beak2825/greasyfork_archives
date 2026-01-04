// ==UserScript==
// @name         网道美化
// @namespace    http://tampermonkey.net/
// @version      0.9
// @description  试用于 1920*1080 分辨率的网道样式优化, 提升阅读体验
// @author       jsbay
// @match        https://wangdoc.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=wangdoc.com
// @require      https://code.jquery.com/jquery-3.7.1.min.js
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/480586/%E7%BD%91%E9%81%93%E7%BE%8E%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/480586/%E7%BD%91%E9%81%93%E7%BE%8E%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    // const style = $('<style>@media screen and (min-width: 1608px) .container:not(.is-max-desktop):not(.is-max-widescreen) { max-width: 1644px; }</style>')
    // $('head').append(style)


    // 右侧的大导航
    const rightColumn = $('.column.is-3')

    // 右侧的大导航内容高度设置
    $('.panel-menu .panel-block').css({ 'height': 'calc(100vh - 375px)', 'overflow-y': 'scroll', 'align-items': 'flex-start' })
    rightColumn.remove()

    $(rightColumn).removeClass('is-offset-1')
    $(rightColumn).css('position', 'fixed')
    $(rightColumn).css('width', '300px')
    $(rightColumn).css('z-index', '1')
    $('.main').append(rightColumn)

    // 中间的内容导航
    const toc = $('.article-toc')

    toc.remove()

    $(toc).css('position', 'fixed')
    $(toc).css('right', '40px')

    $(toc).css('height', 'calc(100vh - 98px)')
    $(toc).css('display', 'inherit')
    $(toc).css('overflow-y', 'scroll')
    $(toc).css('width', '300px')
    $(toc).css('z-index', '1')
    $('.main').append(toc)

    // 内容 + 评论

    const container = $('.main .container')
    container.remove()

    $('.main').append(container)
    $('.main').css('padding-top', '80px')

    $('.column.is-6-widescreen.is-8').removeClass('is-offset-1-widescreen')
    $('.column.is-6-widescreen.is-8').css('width', '100%')
    $('.column.is-6-widescreen.is-8').css('padding-left', '90px')
    $('.column.is-6-widescreen.is-8').css('padding-right', '120px')

    $('.panel-support').remove()
    // 防止没能只能删掉, 1s 后再次执行删除
    setTimeout(() => {
        $('.panel-support').remove()
    }, 1000)
    $('.navbar').css('position', 'fixed').css('width', '100%')


})();