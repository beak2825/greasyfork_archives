// ==UserScript==
// @name         哔哩哔哩bilibili关弹幕
// @description  强制关闭所有弹幕，寻求心灵的宁静 想打开弹幕请看说明  (修改自wly5556的脚本)
// @license           MIT
// @author      yexing17
// @contributor wly5556
// @version 1.4
// @namespace yexing17
// @match        *://*.bilibili.com/*
// @require      https://cdn.bootcss.com/jquery/1.12.4/jquery.min.js
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/383297/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9bilibili%E5%85%B3%E5%BC%B9%E5%B9%95.user.js
// @updateURL https://update.greasyfork.org/scripts/383297/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9bilibili%E5%85%B3%E5%BC%B9%E5%B9%95.meta.js
// ==/UserScript==

(function() {
    var t = setInterval(function(){
        $(".bilibili-player-video-sendbar .bui-checkbox:checked").click();
    },300);
})();