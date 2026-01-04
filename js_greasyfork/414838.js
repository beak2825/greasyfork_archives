// ==UserScript==
// @name                Tencent Animation - Prevent page zoom
// @name:zh-CN          腾讯动漫 - 阻止页面缩放
// @namespace           https://greasyfork.org/zh-CN/users/193133-pana
// @homepage            https://www.sailboatweb.com
// @version             1.0.0
// @description         Prevent page zoom when Ctrl+MouseWheel
// @description:zh-CN   阻止Ctrl+鼠标滚轮时页面会缩放的情况
// @author              pana
// @license             GNU General Public License v3.0 or later
// @compatible          chrome
// @match               *://ac.qq.com/*
// @grant               none
// @downloadURL https://update.greasyfork.org/scripts/414838/Tencent%20Animation%20-%20Prevent%20page%20zoom.user.js
// @updateURL https://update.greasyfork.org/scripts/414838/Tencent%20Animation%20-%20Prevent%20page%20zoom.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let comic = document.querySelector('.comic-contain');
    comic && comic.addEventListener('wheel', event => {
        if (event.ctrlKey) {
            event.preventDefault();
        }
    }, true);

})();