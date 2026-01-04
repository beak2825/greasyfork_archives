// ==UserScript==
// @name         EasyCNBLOGS
// @description  这是一款促进博客园极致简洁和高效的插件。免费共享大量创新功能，如：净化页面、展示全屏、复制文本等。让我们的学习体验无比简洁、专注、高效、畅快。
// @version      10.0
// @author       xcanwin
// @namespace    https://github.com/xcanwin/EasyCNBLOGS/
// @supportURL   https://github.com/xcanwin/EasyCNBLOGS/
// @license      GPL-2.0-only
// @match        *://www.cnblogs.com/*/p/*.html
// @match        *://www.cnblogs.com/*/archive/*.html
// @grant        GM_addStyle
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/482368/EasyCNBLOGS.user.js
// @updateURL https://update.greasyfork.org/scripts/482368/EasyCNBLOGS.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const $ = (Selector, el) => (el || document).querySelector(Selector);
    const $$ = (Selector, el) => (el || document).querySelectorAll(Selector);

    /*电脑端净化样式*/
    const purify_style_pc = `
.postTitle /*隐藏[正文的][顶部的]原标题*/,
#right_meun /*隐藏[正文的][右边的]栏*/,
#blog_post_info_block /*隐藏[正文的][底部的]推荐关注*/,
.postDesc /*隐藏[正文的][底部的]文章信息栏*/,
.postfoot /*隐藏[正文的][底部的]文章信息栏2*/
{
    display: none !important;
}

/*隐藏背景*/
html body, .post, .postText, .postBody {
    background: none !important;
    background-image: unset !important;
    background-color: unset !important;
}

/*展示全屏*/
body {
    margin-left: unset !important;
    margin-right: unset !important;
    margin-bottom: unset !important;
    padding: unset !important;
    padding-bottom: unset !important;
    display: flex;
    justify-content: center;
    font-size: 16px !important;
}
.post {
    border: unset !important;
    border-bottom-width: unset !important;
    border-right-width: unset !important;
    padding: unset !important;
    margin-bottom: unset !important;
    width: 80%;
    font-size: 16px !important;
    line-height: 1.8 !important;
}
.postText, .postBody {
    padding-right: unset !important;
    padding-left: unset !important;
    padding-bottom: unset !important;
    padding-top: unset !important;
    border-bottom: unset !important;
    font-size: unset !important;
    line-height: unset !important;
}

/*调整标题*/
span[role="heading"] {
    display: flex;
    justify-content: center;
    margin-top: 35px !important;
    margin-bottom: 20px !important;
    color: black !important;
    font-size: 33px !important;
    font-family: 'PingFang SC','Microsoft YaHei','SimHei','Arial','SimSun';
    font-weight: bold;
}

/*调整文章信息栏*/
.newinfo {
    background: #f8f8f8;
    border-radius: 4px;
    font-size: 13px !important;
    display: flex;
    margin-bottom: 32px;
    align-items: center;
}
.newinfo a[href^="https://www.cnblogs.com/"] {
    margin-right: 23px;
}

/*调整头像*/
.newinfoimg {
    border-radius: 4px;
    width: 28px;
    height: 28px;
    margin: 6px;
    margin-right: 33px;
    border: 2px solid #eee;
    box-shadow: 0 0 0 2px #d9d9d9;
}

/*正文的图片居中*/
.post p img {
    display: flex;
    margin-left: auto;
    margin-right: auto;
}

/*恢复滚动条*/
body {
    overflow: unset !important;
}
`;

    //净化页面
    const purifyPage = function() {
        GM_addStyle(purify_style_pc);
    };

    //超净化页面
    const purifyPageSuper = function() {
        const p = $(".post");
        $('body').innerHTML = "";
        $('body').appendChild(p);
    };

    //调整标题
    const beautyTitle = function() {
        $('.post').insertBefore($('span[role="heading"]'), $('.post').childNodes[0]);
    };

    //调整文章信息栏
    const beautyInfo = function() {
        const ninfo = document.createElement('div');
        ninfo.classList.add('newinfo');
        const ninfoimg = document.createElement('img');
        ninfoimg.classList.add('newinfoimg');
        ninfoimg.src = $('link[rel="shortcut icon"]').href;
        const info_user = $('.postDesc a[href^="https://www.cnblogs.com/"]') || $('.postfoot a[href^="https://www.cnblogs.com/"]') ;
        info_user.style = 'color: #404040';
        const info_date = $('.postDesc #post-date') || $('.postfoot #post-date');
        info_date.style = 'color: #969696';
        ninfo.append(ninfoimg);
        ninfo.append(info_user);
        ninfo.append(info_date);
        $('.post').insertBefore(ninfo, $('.post').childNodes[1]);
    };

    document.addEventListener("DOMContentLoaded", function() {
        purifyPageSuper();
        beautyTitle();
        beautyInfo();
    });

    purifyPage();

})();
