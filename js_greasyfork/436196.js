// ==UserScript==
// @name         绝世神功跳转
// @namespace    https://baidu.com
// @version      1.0
// @description  绝世神功
// @author       suoa
// @require https://cdn.staticfile.org/jquery//2.0.2/jquery.min.js
// @match        *://fa.jygame.net/jssg/h5/zhuzhu.html?*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/436196/%E7%BB%9D%E4%B8%96%E7%A5%9E%E5%8A%9F%E8%B7%B3%E8%BD%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/436196/%E7%BB%9D%E4%B8%96%E7%A5%9E%E5%8A%9F%E8%B7%B3%E8%BD%AC.meta.js
// ==/UserScript==

(function() {
    window.hook_={};
    window.hook_.parseIntCount = 0;
    window.hook_.parseInt_ = parseInt;
     window.parseInt = function (x) {
        window.hook_.parseIntCount = window.hook_.parseIntCount + 1;
        if (window.hook_.parseIntCount == 3) {
            return 999999999999;
        }
        return window.hook_.parseInt_(x);
    };
    let s=location.href.replace(/fa.jygame.net/g,'fa.y3api.cn');
    location.href=s;
})();