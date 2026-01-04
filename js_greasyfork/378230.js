// ==UserScript==
// @name         知乎隐去标题
// @namespace    https://www.zhihu.com/
// @version      0.1.1
// @description  隐去标题
// @author       cH
// @match        https://www.zhihu.com
// @match        https://www.zhihu.com/question/*
// @require      http://cdn.bootcss.com/jquery/2.1.4/jquery.min.js
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/378230/%E7%9F%A5%E4%B9%8E%E9%9A%90%E5%8E%BB%E6%A0%87%E9%A2%98.user.js
// @updateURL https://update.greasyfork.org/scripts/378230/%E7%9F%A5%E4%B9%8E%E9%9A%90%E5%8E%BB%E6%A0%87%E9%A2%98.meta.js
// ==/UserScript==
(function() {
    'use strict';
    $("document").ready(function(){
        $('.QuestionHeader-title').css("display","none");
    })
})();