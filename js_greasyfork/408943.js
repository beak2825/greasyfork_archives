// ==UserScript==
// @name                Wechat Official Account - Picture format conversion
// @name:zh-CN          微信公众号 - 图片格式转换
// @namespace           https://greasyfork.org/zh-CN/users/193133-pana
// @homepage            https://www.sailboatweb.com
// @version             1.0.0
// @description         webp to jpeg or png
// @description:zh-CN   webp to jpeg or png
// @license             GNU General Public License v3.0 or later
// @author              pana
// @match               *://mp.weixin.qq.com/*
// @grant               none
// @downloadURL https://update.greasyfork.org/scripts/408943/Wechat%20Official%20Account%20-%20Picture%20format%20conversion.user.js
// @updateURL https://update.greasyfork.org/scripts/408943/Wechat%20Official%20Account%20-%20Picture%20format%20conversion.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.querySelectorAll('img').forEach(item => {
        let src = item.dataset.src || item.src;
        if (src && src.match(/wx_fmt=(\w+)/)) {
            item.onload = e => {
                if (e.target.src != src) {
                    e.target.src = src;
                    e.target.classList.remove('img_loading');
                }
            };
            item.onerror = e => console.error(e);
        }
    });
})();