// ==UserScript==
// @name         微信小店助手
// @license      MIT
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  修复无法弹出绑定视频号的问题
// @author       alexskky
// @match        https://store.weixin.qq.com/shop/softchain/home
// @icon         https://www.google.com/s2/favicons?sz=64&domain=baidu.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/531116/%E5%BE%AE%E4%BF%A1%E5%B0%8F%E5%BA%97%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/531116/%E5%BE%AE%E4%BF%A1%E5%B0%8F%E5%BA%97%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';
    setTimeout(function(){window.__MICRO_APP_PROXY_WINDOW__.rawWindow.document.getElementsByClassName('weui-desktop-dropdown-menu')[0].style.display='block';}, 10000);
})();