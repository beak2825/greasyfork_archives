// ==UserScript==
// @name         挑战答题助手
// @namespace    http://abbb.top/
// @version      0.2
// @description  挑战答题助手脚本
// @author       Je
// @match        https://124731.cn/174.html
// @require      http://cdn.bootcss.com/jquery/1.8.3/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/403115/%E6%8C%91%E6%88%98%E7%AD%94%E9%A2%98%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/403115/%E6%8C%91%E6%88%98%E7%AD%94%E9%A2%98%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';
    $("#search-button").bind("click",function(){
        $("#key-word").select();
    });
    $("#key-word").bind("keyup",function(event){
        if(event.keyCode ==13){
            $("#key-word").select();
            $("html, body").animate({ scrollTop: 190 }, "fast");
        }else if(event.keyCode ==46||event.keyCode==8){
            if($("#key-word").val()===""){
               $("html, body").animate({ scrollTop: 190 }, "fast");
            }
        }
    });
    // Your code here...
})();