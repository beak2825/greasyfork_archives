// ==UserScript==
// @name         知乎去标题
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  避免同事或老板发现你正在看的知乎标题，保护你的隐私！
// @author       lnwazg
// @match        *://www.zhihu.com/*
// @grant        none
// @require      https://cdn.bootcss.com/jquery/1.12.4/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/376728/%E7%9F%A5%E4%B9%8E%E5%8E%BB%E6%A0%87%E9%A2%98.user.js
// @updateURL https://update.greasyfork.org/scripts/376728/%E7%9F%A5%E4%B9%8E%E5%8E%BB%E6%A0%87%E9%A2%98.meta.js
// ==/UserScript==

(function() {
        // Your code here...
        console.log("begin to remove ZHIHU title...");
        $(".QuestionHeader-title").hide();
        console.log("End remove ZHIHU title.");
})();