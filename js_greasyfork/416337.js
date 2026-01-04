// ==UserScript==
// @name         贴吧申诉自动填充
// @namespace    https://osu.ppy.sh/u/376831
// @version      1.1
// @description  贴吧申诉自动填充的插件
// @author       wcx19911123
// @match        *tieba.baidu.com/pmc/post/manual?*
// @match        *http://tieba.baidu.com/pmc/post/appeal?*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/416337/%E8%B4%B4%E5%90%A7%E7%94%B3%E8%AF%89%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%85%85.user.js
// @updateURL https://update.greasyfork.org/scripts/416337/%E8%B4%B4%E5%90%A7%E7%94%B3%E8%AF%89%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%85%85.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var startApply = 0, autoFill = 0, autoSubmit = 0;
    var currentTime = new Date().getTime();
    var event = setInterval(function(){
        if($("textarea.j_textarea").length == 1 && autoFill == 0){
            autoFill = 1;
            console.log("autoFill");
            $("textarea.j_textarea").val("该内容没有任何违反《百度贴吧协议》的信息，烦请恢复！");
            $('a[class="j_submit ui_btn ui_btn_m"]').get(0).click();
        }else if($("a[class='tm_btn ui_btn ui_btn_m tm_normal_btn']").length == 1 && startApply == 0){
            startApply = 1;
            console.log("startApply");
            $("a[class='tm_btn ui_btn ui_btn_m tm_normal_btn']").get(0).click();
        }else if(autoFill == 1 && autoSubmit == 0){
            if($("p[class='j_error_tip color_red']").length == 1 && $("p[class='j_error_tip color_red']").html().indexOf("今天已达到恢复上限") > -1){
                autoSubmit = 1;
                console.log("autoSubmit");
            }else if($("p[class='p_big']").length == 1 && $("p[class='p_big']").parent().css("display") != "none"){
                autoSubmit = 1;
                console.log("autoSubmit");
                window.close();
            }
        }
    },100);
})();