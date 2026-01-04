// weibo-external-link-redirection
// ==UserScript==
// @name         自用微博跳转pixiv脚本
// @namespace    weibo-pixiv-link-redirection
// @version      0.0.1
// @description  微博跳转pixiv脚本
// @include     https://www.bing.com/*
// @include     https://cn.bing.com/*
// @require     http://libs.baidu.com/jquery/2.0.0/jquery.min.js
// @require     https://cdn.jsdelivr.net/npm/jquery@3.2.1/dist/jquery.min.js
// @require     https://cdn.staticfile.org/jquery/1.12.4/jquery.min.js
// @author      AmemiyaKokoro

// @downloadURL https://update.greasyfork.org/scripts/423149/%E8%87%AA%E7%94%A8%E5%BE%AE%E5%8D%9A%E8%B7%B3%E8%BD%ACpixiv%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/423149/%E8%87%AA%E7%94%A8%E5%BE%AE%E5%8D%9A%E8%B7%B3%E8%BD%ACpixiv%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==
(function () {
    if (window.location.href.includes('pixiv.net')) {
        let target = window.location.href.split('search?q=')[1]
        console.log(target)
        if (target.includes('&')) {
            target = target.split('&')[0]
        }
        window.location.replace(target)
    }
})();
  