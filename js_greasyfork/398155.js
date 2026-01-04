// ==UserScript==
// @name         [Neko0] BiliBili优化
// @description  收藏视频弹窗优化
// @version      1.0.0
// @author       JoJunIori
// @namespace    neko0-web-tools
// @icon         https://www.google.com/s2/favicons?domain=bilibili.com
// @homepageURL  https://github.com/nekozero/neko0-web-tools
// @supportURL   https://github.com/nekozero/neko0-web-tools/issues
// @grant        none
// @run-at       document-idle
// @license      AGPLv3
// @require      https://cdn.bootcss.com/jquery/3.3.1/jquery.min.js
// @include      *://*.bilibili.com/*
// @include      *://bilibili.com/*
// @downloadURL https://update.greasyfork.org/scripts/398155/%5BNeko0%5D%20BiliBili%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/398155/%5BNeko0%5D%20BiliBili%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

// 置入Style
let style = `<style>
.clearfix {
    zoom: 1;
}
.clearfix:after {
    content: '.';
    display: block;
    height: 0;
    visibility: hidden;
    clear: both;
}
/* 收藏夹内部排列优化 */
.collection-m {
    width: 50vw;
}
.collection-m .content {
    padding: 0;
    height: auto;
    max-height: 60vh;
}
.collection-m .content .group-list {
    padding: 10px;
}
.collection-m .content .group-list ul {
    margin: 0;
}
.collection-m .content .group-list ul li {
    float: left;
    padding: 10px;
    margin: 10px;
    background: whitesmoke;
    border-radius: 6px;
}
.collection-m .content .group-list li input[type='checkbox'] + i {
    margin-right: 6px;
}
.collection-m .content .group-list li label .count {
    display: block;
    width: 100%;
    text-align: center;
    opacity: 0.5;
    float: unset;
}
.collection-m .content .group-list li input[type='checkbox']:checked + i + span {
    color: #00a1d6;
}
/* 新建收藏夹 */
.collection-m .content .group-list .add-group {
    width: 100%;
}
.collection-m .content .group-list .add-group .fav-add-tip {
    top: 48px;
    z-index: 1;
}
.collection-m .content .group-list .add-group .fav-add-tip .blue-arrow {
    top: -6px;
    transform: rotate(180deg);
}
</style>`
$('head').append(style)

// 移动新建框
$('.collect').click(() => {
    setTimeout(() => {
        $('.group-list').prepend($('.group-list .add-group'))
        $('.collection-m .content .group-list ul').addClass('clearfix')
    }, 10)
})
