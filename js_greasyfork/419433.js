// ==UserScript==
// @name                慕课网视频暂停广告隐藏
// @name:zh-CN  	慕课网视频暂停广告隐藏
// @description 	www.icourse163.org 视频暂停的时候隐藏烦人的广告。
// @description:zh-CN 	www.icourse163.org视频暂停的时候隐藏烦人的广告。
// @namespace           http://tampermonkey.net/
// @version             0.1
// @author              Slopr
// @include             *://www.icourse163.org/*
// @grant               none
// 感谢灵感来源本代码修改于作者              Lazyb0x
// @downloadURL https://update.greasyfork.org/scripts/419433/%E6%85%95%E8%AF%BE%E7%BD%91%E8%A7%86%E9%A2%91%E6%9A%82%E5%81%9C%E5%B9%BF%E5%91%8A%E9%9A%90%E8%97%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/419433/%E6%85%95%E8%AF%BE%E7%BD%91%E8%A7%86%E9%A2%91%E6%9A%82%E5%81%9C%E5%B9%BF%E5%91%8A%E9%9A%90%E8%97%8F.meta.js
// ==/UserScript==
(function() {
    'use strict';

    var style1 = document.createElement('style');
    style1.innerHTML = '.ux-modal{display: none !important;}';
    style1.innerHTML = '.ux-modal_dialog{display: none !important;}';
    style1.innerHTML = '.um-recommend-modal{display: none !important;}';
    style1.innerHTML = '.ux-modal-fadeIn{display: none !important;}';
    document.head.appendChild(style1);

})();