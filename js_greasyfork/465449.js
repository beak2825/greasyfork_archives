// ==UserScript==
// @name         修改csdn搜索
// @namespace    https://blog.csdn.net/
// @version      0.3
// @description  zh-cn
// @author       hh
// @license      MIT
// @match        https://blog.csdn.net/
// @grant        none
// @include      *://*.csdn.net/*
// @connect      www.csdn.net
// @require      https://code.jquery.com/jquery-2.1.4.min.js
// @downloadURL https://update.greasyfork.org/scripts/465449/%E4%BF%AE%E6%94%B9csdn%E6%90%9C%E7%B4%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/465449/%E4%BF%AE%E6%94%B9csdn%E6%90%9C%E7%B4%A2.meta.js
// ==/UserScript==
this.$ = this.jQuery = jQuery.noConflict(true);
(function() {
    'use strict';
    function demo()
        {
        var su = $(".article-comment");
        var txt = window.getSelection();
        if(txt.toString().length>1){
            if(document.getElementsByClassName("article-search")[0]){
            su.remove();
            $(".cnote").remove();
            txt="https://www.baidu.com/s?wd="+txt;
            document.getElementsByClassName("article-search")[0].setAttribute("href",txt);
            clearInterval(demo);
        }else{
            setTimeout(demo,50);
        }
        }
        }
    $('p').mouseup(demo);
})();