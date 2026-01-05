// ==UserScript==
// @name               Refuse mobile page!
// @name:zh-CN         拒绝手机版页面！
// @description        Redirect mobile-only URL to its corresponding PC version automatically
// @description:zh-CN  访问移动设备专用 URL 时跳转到对应的 PC 版页面（目前已支持微博、淘宝、天猫、京东）
// @namespace          https://github.com/xdqi/refuse-mobile-page
// @version            0.3
// @author             xdqi
// @license            MIT
// @grant              none
// @run-at             document-start
// @include            *
// @downloadURL https://update.greasyfork.org/scripts/24087/Refuse%20mobile%20page%21.user.js
// @updateURL https://update.greasyfork.org/scripts/24087/Refuse%20mobile%20page%21.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var replaceTable = [
        // weibo.com 用户页面
        [/^http:\/\/m\.weibo\.cn\/[d|u]\/(.+)/g, 'http://weibo.com/$1'],
        // weibo.com 用户页面
        [/^http:\/\/m\.weibo\.cn\/n\/(.+)/g, 'http://weibo.com/n/$1'],
        // weibo.com 话题
        [/^http:\/\/m\.weibo\.cn\/[k]\/(.+)/g, 'http://huati.weibo.com/$1'],
        // weibo.com 微博
        [/^http:\/\/m\.weibo\.cn\/(\d+)\/([A-Za-z0-9]+)(?:\?.*)?/g, 'http://weibo.com/$1/$2'],
        // weibo.com 文章
        [/^http:\/\/media\.weibo\.cn\/article(.+)/g, 'http://weibo.com/ttarticle/p/show$1'],
        // 哔哩哔哩 视频
        [/^http:\/\/www\.bilibili\.com\/mobile\/video\/(av\d+)\.html/g, 'http://www.bilibili.com/video/$1/'],
        // 京东 产品页面
        [/^http[s]?:\/\/item\.m\.jd\.com\/product\/(\d+).html/g, 'http://item.jd.com/$1.html'],
        // 天猫 产品页面
        [/^http[s]?:\/\/detail\.m\.tmall\.com\/(.*)/g, 'http://detail.tmall.com/$1'],
        // 淘宝 产品页面
        [/^http[s]?:\/\/h5\.m\.taobao\.com\/awp\/core\/detail\.htm\?(.*)/g, 'https://item.taobao.com/item.htm?$1'],
        // 北邮人
        [/^http[s]?:\/\/m\.byr\.cn\/(.*)/g, 'https://bbs.byr.cn/#!$1'],
    ];

    var pageURL = window.location.href;
    replaceTable.forEach(function(replaceRule) {
        var newURL = pageURL.replace(replaceRule[0], replaceRule[1]);
        if (pageURL !== newURL) {
            window.location = newURL;
        }
    });

})();

