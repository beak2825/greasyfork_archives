// ==UserScript==
// @name         知乎一键邀请
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  知乎自己的问题可一键邀请所有人
// @author       Shifter
// @match        https://www.zhihu.com/question/*
// @grant        none
// @require      https://cdn.bootcss.com/jquery/3.4.1/jquery.js
// @downloadURL https://update.greasyfork.org/scripts/420746/%E7%9F%A5%E4%B9%8E%E4%B8%80%E9%94%AE%E9%82%80%E8%AF%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/420746/%E7%9F%A5%E4%B9%8E%E4%B8%80%E9%94%AE%E9%82%80%E8%AF%B7.meta.js
// ==/UserScript==

(function() {
    $(function() {
        if($(".QuestionInvitation").length>0){
            $(".QuestionButtonGroup").eq(1).append("<button id='all_invite' type='button' class='Button Button--blue'>一键邀请</button>")
        }
        $("#all_invite").click(function(){
            $(".List-item").find(".Button--blue").trigger("click");
        });
    })
})();