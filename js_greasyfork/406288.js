// ==UserScript==
// @name         将网页转化为阅读模式
// @description  调用简悦（simp.red）接口将网页转化为清爽的阅读模式，去除广告等无关元素。
// @icon         https://simpread-1254315611.cos.ap-shanghai.myqcloud.com/logo/logo%40128.png
// @namespace    https://greasyfork.org/zh-CN/users/393603-tsing
// @version      1.0
// @author       Tsing
// @match        *://*/*
// @exclude      *://www.baidu.com/
// @exclude      *://*.baidu.com/s?*
// @exclude      *://*.so.com/s?*
// @exclude      *://*.sogou.com/sogou*
// @exclude      *://www.sogou.com/
// @exclude      *://*.bing.com*
// @exclude      *://*.google.com.*
// @exclude      *://*.dogedoge.com*
// @require      https://cdn.bootcss.com/jquery/3.4.1/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/406288/%E5%B0%86%E7%BD%91%E9%A1%B5%E8%BD%AC%E5%8C%96%E4%B8%BA%E9%98%85%E8%AF%BB%E6%A8%A1%E5%BC%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/406288/%E5%B0%86%E7%BD%91%E9%A1%B5%E8%BD%AC%E5%8C%96%E4%B8%BA%E9%98%85%E8%AF%BB%E6%A8%A1%E5%BC%8F.meta.js
// ==/UserScript==

(function() {
    /* global $ */
    'use strict';

    var CurrentUrl = window.location.href;
    var NewUrl = "https://simp.red/trans?url=" + decodeURIComponent(CurrentUrl);
    var button = '<a href="' + NewUrl + '" style="width: 60px; height: 60px; border-radius: 30px; text-align: center; line-height: 60px; font-size: 20px !important; font-family: Arial !important; color: white !important; text-decoration:none; font-weight: 500; display: block; background: red; opacity: 0.6; z-index: 100000; position: fixed; right: 20px; bottom: 20px;" title="将本网页转换成阅读模式" target="_blank">阅</a>';
    $("body:first").prepend(button);

})();