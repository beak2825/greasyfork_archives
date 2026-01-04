// ==UserScript==
// @name      企鹅直播禁用缩放提醒 Disable zoom tip for live.qq.com
// @namespace    https://greasyfork.org/zh-CN/scripts/395988
// @version      1.0
// @description  Disable zoom tip for live.qq.com
// @author       Al Cheung
// @match        *://live.qq.com/
// @require      https://cdn.staticfile.org/js-cookie/2.2.1/js.cookie.min.js
// @downloadURL https://update.greasyfork.org/scripts/395988/%E4%BC%81%E9%B9%85%E7%9B%B4%E6%92%AD%E7%A6%81%E7%94%A8%E7%BC%A9%E6%94%BE%E6%8F%90%E9%86%92%20Disable%20zoom%20tip%20for%20liveqqcom.user.js
// @updateURL https://update.greasyfork.org/scripts/395988/%E4%BC%81%E9%B9%85%E7%9B%B4%E6%92%AD%E7%A6%81%E7%94%A8%E7%BC%A9%E6%94%BE%E6%8F%90%E9%86%92%20Disable%20zoom%20tip%20for%20liveqqcom.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.Cookies.set('zoomtip', 1, { expires: 360 });
})();