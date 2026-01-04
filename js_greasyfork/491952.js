// ==UserScript==
// @name         自动点击alert弹窗
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  自动点击页面中的alert弹窗
// @author       Your Name
// @match        *://*/*
// @grant        none
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/491952/%E8%87%AA%E5%8A%A8%E7%82%B9%E5%87%BBalert%E5%BC%B9%E7%AA%97.user.js
// @updateURL https://update.greasyfork.org/scripts/491952/%E8%87%AA%E5%8A%A8%E7%82%B9%E5%87%BBalert%E5%BC%B9%E7%AA%97.meta.js
// ==/UserScript==

(function($) {
    'use strict';

    // 重写 window.alert 和 window.confirm 方法
    window.alert = window.confirm = function(message) {
        console.log(message); // 输出弹窗内容
        $('body .bkeditor-dialog a.aui_close').click();//关闭参考资料
        return true;// 自动点击确认按钮
    };


})(jQuery);
