// ==UserScript==
// @name         Close Zhihu Login Popup
// @name:zh-cn   关闭知乎登录浮窗
// @version      0.1
// @description  Close the login popup on zhihu.com after page load, now by pressing Esc
// @description:zh-cn 关闭知乎页面加载后的登录弹窗
// @author       anolir
// @license      GPL-3.0-or-later
// @match        https://*.zhihu.com/*
// @grant        none
// @namespace https://greasyfork.org/users/1046083
// @downloadURL https://update.greasyfork.org/scripts/462313/Close%20Zhihu%20Login%20Popup.user.js
// @updateURL https://update.greasyfork.org/scripts/462313/Close%20Zhihu%20Login%20Popup.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.onload = function() {
        var event = new KeyboardEvent('keydown', {'keyCode': 27});
        document.dispatchEvent(event);
    };
})();
