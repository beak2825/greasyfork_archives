// ==UserScript==
// @name         EasyJIANSHU
// @description  这是一款促进简书极致简洁和高效的插件。免费共享大量创新功能，如：净化页面、展示全屏等。让我们的学习体验无比简洁、专注、高效、畅快。
// @version      6.0
// @author       xcanwin
// @namespace    https://github.com/xcanwin/EasyJIANSHU/
// @supportURL   https://github.com/xcanwin/EasyJIANSHU/
// @license      GPL-2.0-only
// @match        *://www.jianshu.com/p/*
// @match        *://*.jianshu.io/p/*
// @grant        GM_addStyle
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/481661/EasyJIANSHU.user.js
// @updateURL https://update.greasyfork.org/scripts/481661/EasyJIANSHU.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const $ = (Selector, el) => (el || document).querySelector(Selector);
    const $$ = (Selector, el) => (el || document).querySelectorAll(Selector);

    /*电脑端净化样式*/
    const purify_style_pc = `
#__next>header /*隐藏[置顶的][顶部的]菜单栏*/,
footer /*隐藏[置顶的][底部的]评论查看栏*/,
.ant-back-top /*隐藏[置顶的][底部的]返回顶部*/,
._3Pnjry /*隐藏[左边的]栏*/,
._2OwGUo /*隐藏[右边的]栏*/,
._3kba3h /*隐藏[正文的][顶部的]关注*/,
._3URWaO /*隐藏[正文的][顶部的]归属地*/,
._3tCVn5 /*隐藏[正文的][顶部的]钻石*/,
._1kCBjS /*隐藏[正文的][底部的]文章分类*/,
._19DgIp /*隐藏[正文的][底部的]下划线*/,
._13lIbp /*隐藏[正文的][底部的]APP推荐*/,
.d0hShY /*隐藏[正文的][底部的]用户介绍*/,
.ouvJEz:nth-of-type(2) /*隐藏[正文的][底部的]推荐文章*/,
.ouvJEz:nth-of-type(3) /*隐藏[正文的][底部的]空白*/,
#note-page-comment /*隐藏[正文的][底部的]评论发言栏*/
{
    display: none !important;
}

/*隐藏背景*/
._3kbg6I {
    background: none !important;
    background-image: unset !important;
    background-color: unset !important;
}

/*调整标题*/
._1RuRku {
    display: flex;
    justify-content: center;
    margin-top: 35px !important;
    margin-bottom: 20px !important;
    color: black !important;
    font-size: 33px !important;
    font-family: 'PingFang SC','Microsoft YaHei','SimHei','Arial','SimSun';
}

/*调整头像*/
._13D2Eh {
    display: none !important;
    min-width: unset !important;
    min-height: unset !important;
    border: unset !important;
    border-radius: 4px !important;
    width: 28px !important;
    height: 28px !important;
    margin: 6px !important;
    margin-right: 25px !important;
}

/*调整文章信息栏*/
.rEsl9f {
    background: #f8f8f8;
    border-radius: 4px !important;
}
._3U4Smb {
    margin-bottom: unset !important;
    margin-right: 15px !important;
    float: left !important;
}
.FxYr8x {
    font-size: unset !important;
}

/*展示全屏*/
._3VRLsv {
    padding-left: unset !important;
    padding-right: unset !important;
    padding-top: unset !important;
    width: unset !important;
}
._gp-ck {
    margin-bottom: unset !important;
    margin-right: unset !important;
    width: 80% !important;
}
.ouvJEz {
    padding: unset !important;
}
`;

    //净化页面
    const purifyPage = function() {
        GM_addStyle(purify_style_pc);
    };

    //调整头像
    const beautyLOGO = function() {
        $('._13D2Eh').src = $('link[rel="shortcut icon"]').href;
        $('._13D2Eh').style = 'display: block !important';
    };

    window.onload = function() {
        beautyLOGO();
    };

    purifyPage();

})();
