// ==UserScript==
// @name         CSDN 去除主内容外的所有内容
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  try to take over the world!
// @author       beyond
// @match        *://*.blog.csdn.net/*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/389142/CSDN%20%E5%8E%BB%E9%99%A4%E4%B8%BB%E5%86%85%E5%AE%B9%E5%A4%96%E7%9A%84%E6%89%80%E6%9C%89%E5%86%85%E5%AE%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/389142/CSDN%20%E5%8E%BB%E9%99%A4%E4%B8%BB%E5%86%85%E5%AE%B9%E5%A4%96%E7%9A%84%E6%89%80%E6%9C%89%E5%86%85%E5%AE%B9.meta.js
// ==/UserScript==

(function() {
    'use strict'
    
    $(":not(main *,#vimvixen-console-frame,html,body,#mainBox,main,link,script,head,head *,style,.main_father)").remove();
    $("main").css("width","100%");
    $("main.t0, main.clearfix, .comment-box,#commentBox").remove();
    $("passport-login-container").remove();

})();