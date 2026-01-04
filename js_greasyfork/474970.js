// ==UserScript==
// @name         抖音摸鱼奎恩弹幕加一
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  抖音直播间摸鱼奎恩(Mr.Quin)添加弹幕加一功能
// @author       You
// @match        https://live.douyin.com/200525029536
// @icon         https://www.google.com/s2/favicons?sz=64&domain=douyin.com
// @require      http://code.jquery.com/jquery-1.11.0.min.js
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/474970/%E6%8A%96%E9%9F%B3%E6%91%B8%E9%B1%BC%E5%A5%8E%E6%81%A9%E5%BC%B9%E5%B9%95%E5%8A%A0%E4%B8%80.user.js
// @updateURL https://update.greasyfork.org/scripts/474970/%E6%8A%96%E9%9F%B3%E6%91%B8%E9%B1%BC%E5%A5%8E%E6%81%A9%E5%BC%B9%E5%B9%95%E5%8A%A0%E4%B8%80.meta.js
// ==/UserScript==

(function() {
    'use strict';

    $(document).on("click", ".webcast-chatroom___content-with-emoji-text", function(){
        $(".webcast-chatroom___textarea").focus();
        $(".webcast-chatroom___textarea").trigger("input").val($(this).text());
    });
})();