// ==UserScript==
// @name         fuck zhihu 干知乎管理员
// @namespace    http://tampermonkey.net/
// @version      0.8
// @description  自动执行举报操作
// @author       oldManInTangLangHill
// @match        https://www.zhihu.com/*
// @grant        none
//@require https://code.jquery.com/jquery-2.1.4.min.js
// @downloadURL https://update.greasyfork.org/scripts/391466/fuck%20zhihu%20%E5%B9%B2%E7%9F%A5%E4%B9%8E%E7%AE%A1%E7%90%86%E5%91%98.user.js
// @updateURL https://update.greasyfork.org/scripts/391466/fuck%20zhihu%20%E5%B9%B2%E7%9F%A5%E4%B9%8E%E7%AE%A1%E7%90%86%E5%91%98.meta.js
// ==/UserScript==

(function() {
    'use strict';
    /* globals jQuery, $, waitForKeyElements */

    var moreLength=$("[aria-label='更多']").length;
    var i=0;
    var s=setInterval(()=>{
        $("[aria-label='更多']")[i].click();
        if($(".AnswerItem-selfMenuItem").length>1){
            $(".AnswerItem-selfMenuItem")[1].click();
            $(".ReportMenu-itemValue")[2].click();
            $(".needsclick")[0].click();
            $(".ReportMenu-button").click();
            $(".AnswerItem-selfMenuItem")[1].click();
        }

        i++;
        if(j>=clientNum){
            clearInterval(s);
        }
    },5000)
    // Your code here...
})();