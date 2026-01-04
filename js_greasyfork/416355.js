// ==UserScript==
// @name         去除知乎、简书的标题
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  防止被别人看到自己在浏览什么内容
// @author       JKChen
// @email        1047588430@qq.com
// @match        *://www.zhihu.com/*
// @match        *://www.jianshu.com/*
// @grant        none
// @require      https://cdn.bootcss.com/jquery/1.12.4/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/416355/%E5%8E%BB%E9%99%A4%E7%9F%A5%E4%B9%8E%E3%80%81%E7%AE%80%E4%B9%A6%E7%9A%84%E6%A0%87%E9%A2%98.user.js
// @updateURL https://update.greasyfork.org/scripts/416355/%E5%8E%BB%E9%99%A4%E7%9F%A5%E4%B9%8E%E3%80%81%E7%AE%80%E4%B9%A6%E7%9A%84%E6%A0%87%E9%A2%98.meta.js
// ==/UserScript==

(function() {
    const zhihu = "www.zhihu.com"
    const jianshu = "www.jianshu.com"
    let domain = document.domain
    switch(domain){
        case zhihu:
            $(".QuestionHeader-title").hide();
            break;
        case jianshu:
            $("._2zeTMs").hide();
    }
})();