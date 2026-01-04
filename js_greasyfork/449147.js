// ==UserScript==
// @name         升学 E 网通 (EWT360) 试卷部分外挂 (选择题)
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  升学E网通试卷选择题答案页面跳转器
// @author       qzqxlXXL
// @match        https://web.ewt360.com/mystudy*
// @match        http://web.ewt360.com/mystudy*
// @grant        none
// @license MIT
//跳转后看中文，里面虽然碎但是有答案，可以放到记事本里用查找功能。然后手动选答案就行了。
// @downloadURL https://update.greasyfork.org/scripts/449147/%E5%8D%87%E5%AD%A6%20E%20%E7%BD%91%E9%80%9A%20%28EWT360%29%20%E8%AF%95%E5%8D%B7%E9%83%A8%E5%88%86%E5%A4%96%E6%8C%82%20%28%E9%80%89%E6%8B%A9%E9%A2%98%29.user.js
// @updateURL https://update.greasyfork.org/scripts/449147/%E5%8D%87%E5%AD%A6%20E%20%E7%BD%91%E9%80%9A%20%28EWT360%29%20%E8%AF%95%E5%8D%B7%E9%83%A8%E5%88%86%E5%A4%96%E6%8C%82%20%28%E9%80%89%E6%8B%A9%E9%A2%98%29.meta.js
// ==/UserScript==
var a='1';
(function() {
    'use strict';
    var reportId;

    function getQueryVariable(variable){
        var query = window.location.href;
        query = query.substring(query.indexOf("?") + 1);
        var vars = query.split("&");
        for (var i=0;i<vars.length;i++) {
            var pair = vars[i].split("=");
            if(pair[0] == variable){return pair[1];}
        }
        return(false);
    }
    function error(){
        alert("错误了");
    }
    if (window.location.href.indexOf("exam/answer") != -1){
        $("html").append("<button id='ewt_auto' style='position: fixed;right: 10px;bottom: 10px;font-size: 20px;padding: 10px 20px;border: none;outline: none;background: #5e72e4;color: #fff;border-radius: 5px;box-shadow: 0 2px 5px rgba(0, 0, 0, .2);'>跳转</button>");
    }
    $("#ewt_auto").on("click", function(){
        $("#ewt_auto").css("pointer-events", "none");
        $("#ewt_auto").css("background", "#666");
        getPaperInfo();
    });
    function getPaperInfo(){
        $("#ewt_auto").text("跳转中...");
        window.open("https://web.ewt360.com/customerApi/api/studyprod/web/answer/paper?paperId=" + getQueryVariable("paperId") + "&platform=" + getQueryVariable("platform") + "&bizCode=" + getQueryVariable("bizCode") + "&reportId=0&isRepeat=0");
        $("#ewt_auto").text("跳转结束...");

}}());