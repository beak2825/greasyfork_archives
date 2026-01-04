// ==UserScript==
// @name                慕课网视频广告隐藏
// @name:zh-CN  	慕课网视频广告隐藏
// @description 	www.imooc.com 视频暂停的时候隐藏烦人的广告。
// @description:zh-CN 	www.imooc.com 视频暂停的时候隐藏烦人的广告。
// @namespace           http://tampermonkey.net/
// @version             0.1
// @author              Lazyb0x
// @include             *://www.imooc.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/401778/%E6%85%95%E8%AF%BE%E7%BD%91%E8%A7%86%E9%A2%91%E5%B9%BF%E5%91%8A%E9%9A%90%E8%97%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/401778/%E6%85%95%E8%AF%BE%E7%BD%91%E8%A7%86%E9%A2%91%E5%B9%BF%E5%91%8A%E9%9A%90%E8%97%8F.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var style1 = document.createElement('style');
    style1.innerHTML = '#courseVideoPause{display: none !important;}';
    document.head.appendChild(style1);

})();