// ==UserScript==
// @name         去除简书右侧的推荐阅读
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  简书右侧的推荐, 一言难尽, 并不想看到.
// @author       wowo878787
// @match        *://www.jianshu.com/p/*
// @require      https://code.jquery.com/jquery-2.2.4.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/393741/%E5%8E%BB%E9%99%A4%E7%AE%80%E4%B9%A6%E5%8F%B3%E4%BE%A7%E7%9A%84%E6%8E%A8%E8%8D%90%E9%98%85%E8%AF%BB.user.js
// @updateURL https://update.greasyfork.org/scripts/393741/%E5%8E%BB%E9%99%A4%E7%AE%80%E4%B9%A6%E5%8F%B3%E4%BE%A7%E7%9A%84%E6%8E%A8%E8%8D%90%E9%98%85%E8%AF%BB.meta.js
// ==/UserScript==

(function() {
    // 等待 1s 后执行
    // var timer = setTimeout(function(){},1000);

    // 每 0.1s 执行
    var interval = setInterval(function(){
        // 去除两个推荐阅读 (._3Z3nHf)
        if($("._3Z3nHf").length === 2){
            $("._3Z3nHf").remove();
            clearInterval(interval);
        }
    },100);
})();