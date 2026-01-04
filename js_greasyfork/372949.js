// ==UserScript==
// @name         哔哩哔哩bilibili默认关闭弹幕
// @description  Bilibili html5播放器默认关闭弹幕
// @author      wly5556
// @version      2.0.1
// @match        *://*.bilibili.com/video/*
// @match        *://*.bilibili.com/watchlater/*
// @match        *://*.bilibili.com/bangumi/play/*
// @grant        none
// @run-at       document-end
// @namespace wly5556
// @downloadURL https://update.greasyfork.org/scripts/372949/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9bilibili%E9%BB%98%E8%AE%A4%E5%85%B3%E9%97%AD%E5%BC%B9%E5%B9%95.user.js
// @updateURL https://update.greasyfork.org/scripts/372949/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9bilibili%E9%BB%98%E8%AE%A4%E5%85%B3%E9%97%AD%E5%BC%B9%E5%B9%95.meta.js
// ==/UserScript==


(function () {
    var count = 0;
    function foo() {
        if (count++ < 20) {
            var button_old = document.querySelector(".icon-24danmuon");
            var button_new = document.querySelector(".bui-checkbox");
            if (button_old)
                button_old.click();
            else if(button_new)
                button_new.checked = false;
            else
                setTimeout(foo, 300);
        }
    }
    setTimeout(foo, 300);
})();