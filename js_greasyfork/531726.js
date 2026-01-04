// ==UserScript==
// @name         CSDN去登录弹窗（仅此，没有其他更改）
// @namespace    http://tampermonkey.net/
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @version      1.1
// @description  CSDN去登录弹窗（仅此，没有其他更改）。
// @author       You
// @match        *.blog.csdn.net/*/article/details/*
// @match        *.blog.csdn.net/article/details/*
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/531726/CSDN%E5%8E%BB%E7%99%BB%E5%BD%95%E5%BC%B9%E7%AA%97%EF%BC%88%E4%BB%85%E6%AD%A4%EF%BC%8C%E6%B2%A1%E6%9C%89%E5%85%B6%E4%BB%96%E6%9B%B4%E6%94%B9%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/531726/CSDN%E5%8E%BB%E7%99%BB%E5%BD%95%E5%BC%B9%E7%AA%97%EF%BC%88%E4%BB%85%E6%AD%A4%EF%BC%8C%E6%B2%A1%E6%9C%89%E5%85%B6%E4%BB%96%E6%9B%B4%E6%94%B9%EF%BC%89.meta.js
// ==/UserScript==

(function () {
    'use strict';

    //页面加载完成监听事件
    unsafeWindow.addEventListener ("load", pageFullyLoaded);
    //加载完成后运行
    function pageFullyLoaded () {

        $('.csdn-side-toolbar>*:lt(2)').remove();

        let tmp = setInterval(() => {

            $('.passport-login-container').remove();
            $('.passport-login-tip-container').remove();

            //阅读全文
            //$('#article_content').removeAttr("style");
            //移除左侧
            //$('.blog_container_aside').remove();
            //下部推荐
            //$('.recommend-box').remove();
            //上方工具栏
            //$('#csdn-toolbar').remove();
            //去版权
            //$('.article-copyright').remove();
            //评论自动展开
            //$('#btnMoreComment').click();
            //去除剪切板劫持
            //csdn.copyright.init("", "", "");

            //clearInterval(tmp);
        }, 50);
    }

})();
