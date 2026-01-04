// ==UserScript==
// @name         HOOK:JSON.parse
// @namespace    http://tampermonkey.net/
// @version      2025-08-25
// @description  hook json.parse
// @author       逆向黄sir
// @match        *
// @icon         https://mmbiz.qpic.cn/sz_mmbiz_png/bMfOnvYiavj6Oq6zh6NLR1cHFCsVPqXIGvG8hROL0cJRkwGJzcshrJ6Wib8KjhzswbWbylB8Arxicg7icq5xib9BnQA/300?wx_fmt=png&wxfrom=18
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/547220/HOOK%3AJSONparse.user.js
// @updateURL https://update.greasyfork.org/scripts/547220/HOOK%3AJSONparse.meta.js
// ==/UserScript==

(function() {
    var parse_ = JSON.parse;
    JSON.parse = function(arg) {
        console.log("您猜怎么着？断住了！ ——> ",arg);
        debugger;
        return parse_(arg);   // 不改变原来的执行逻辑
    }
})();